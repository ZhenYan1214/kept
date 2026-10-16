import type { Address } from "viem";

/**
 * Sample audits of published payment batches, in the spirit of risk-limiting election audits.
 * The contract draws a random sample of each batch's lines, seeded by a block fixed when the batch is
 * published, so neither the custodian nor anyone else can pick it. An independent auditor
 * visits the sampled households in person; each one signs the visit with its own receipt key, or the
 * auditor records that nobody lives at the registered address. From the visits anyone can compute an
 * upper bound on how many lines of the whole batch could be undelivered.
 */

export const AUDIT_MIN = 5;
export const AUDIT_MAX = 59;
export const CONFIDENCE = 0.95;

/** Same rule as CustodyLedger.auditSampleSize: a fifth of the lines, at least 5, at most 59. */
export function auditSampleSize(lines: number) {
  let n = Math.ceil(lines / 5);
  if (n < AUDIT_MIN) n = AUDIT_MIN;
  if (n > AUDIT_MAX) n = AUDIT_MAX;
  return Math.min(n, lines);
}

// auditOutcome values from CustodyLedger
export const VISIT = { pending: 0, received: 1, notReceived: 2, notFound: 3 } as const;

export type AuditPick = { receipt: Address; outcome: number };

const logFact: number[] = [0];
function lf(k: number) {
  for (let i = logFact.length; i <= k; i++) logFact[i] = logFact[i - 1] + Math.log(i);
  return logFact[k];
}
const logChoose = (n: number, k: number) => (k < 0 || k > n ? -Infinity : lf(n) - lf(k) - lf(n - k));

/** P(X <= x) when drawing n of N lines without replacement and D of the N are bad. */
export function hypergeomCdf(N: number, D: number, n: number, x: number) {
  let p = 0;
  const total = logChoose(N, n);
  for (let k = 0; k <= x; k++) p += Math.exp(logChoose(D, k) + logChoose(N - D, n - k) - total);
  return Math.min(1, p);
}

/**
 * Exact one-sided upper confidence bound on the number of bad lines in the batch: the largest D for
 * which seeing x or fewer bad lines in the sample is still plausible (probability above 1 - confidence).
 */
export function upperBoundBad(N: number, n: number, x: number, confidence = CONFIDENCE) {
  const alpha = 1 - confidence;
  let D = x;
  while (D < N && hypergeomCdf(N, D + 1, n, x) > alpha) D++;
  return D;
}

export type AuditSummary = {
  lines: number;
  sample: number;
  drawn: boolean;
  received: number; // the household, met in person, signed "received"
  notReceived: number; // the household, met in person, signed "not received"
  notFound: number; // the auditor found nobody at the registered address
  pending: number; // not visited yet
  complete: boolean;
  /** Upper bound (95%) on undelivered lines, counting every sampled line not confirmed in person as bad. */
  maxBad: number;
  maxBadShare: number;
};

export function summarizeAudit(lines: number, picks: AuditPick[]): AuditSummary {
  const count = (o: number) => picks.filter((p) => p.outcome === o).length;
  const received = count(VISIT.received);
  const maxBad = picks.length ? upperBoundBad(lines, picks.length, picks.length - received) : lines;
  return {
    lines,
    sample: picks.length || auditSampleSize(lines),
    drawn: picks.length > 0,
    received,
    notReceived: count(VISIT.notReceived),
    notFound: count(VISIT.notFound),
    pending: count(VISIT.pending),
    complete: picks.length > 0 && count(VISIT.pending) === 0,
    maxBad,
    maxBadShare: lines ? maxBad / lines : 0,
  };
}
