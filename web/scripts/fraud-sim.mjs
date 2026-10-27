// Monte Carlo: how likely, and how fast, would four kinds of failure be noticed at Guangfu's scale?
// Regimes compared: today (aggregate totals only), Kept with households' own answers, and Kept with
// households' own answers plus the on-chain sample audit. Every assumption is listed in ASSUMPTIONS and
// written to the output, so the page can show it next to the results.
//
//   node scripts/fraud-sim.mjs   ->  src/lib/replay/fraud-sim.json
import { writeFileSync } from "node:fs";

const ASSUMPTIONS = {
  households: 4039, // recipients of the foundation's clean-up support programme (transfer #30), used for scale
  batchSize: 500, // CustodyLedger.MAX_LINES
  responseRate: 0.3, // share of households that answer by themselves (no data: see the sensitivity rows)
  answerMeanDays: 21, // mean delay of a household's own answer (exponential)
  auditVisitDays: 30, // sampled households are visited uniformly within 30 days of publication
  mistakenRate: 0.01, // an honest household wrongly says "not received" / "still waiting"
  notFoundRate: 0.01, // an honest household not found by the auditor even after repeated visits
  horizonDays: 180,
  falseAlarm: 0.05, // per regime; split equally between channels when there are two
  trials: 4000,
};
const RATES = [0.005, 0.01, 0.02, 0.05];
const SENSITIVITY = [0.1, 0.6];

// --- deterministic PRNG so the published numbers can be reproduced exactly
let state = 0x6b657074; // "kept"
function rand() {
  state |= 0;
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const expDays = (mean) => -mean * Math.log(1 - rand());
const binom = (n, p) => {
  let k = 0;
  for (let i = 0; i < n; i++) if (rand() < p) k++;
  return k;
};
const sampleSize = (lines) => Math.min(lines, Math.max(5, Math.min(59, Math.ceil(lines / 5))));

const N = ASSUMPTIONS.households;
const batches = [];
for (let left = N; left > 0; left -= ASSUMPTIONS.batchSize) batches.push(Math.min(ASSUMPTIONS.batchSize, left));
const auditVisits = batches.reduce((a, b) => a + sampleSize(b), 0);

/**
 * One run. kind: "honest" | "withheld" | "targeted" | "ghost" | "excluded". k = affected lines/households.
 * Returns the times (days) of the "bad" signals on each channel:
 *   self:  disputes ("not received") or "still waiting" reports from households themselves
 *   audit: sampled lines found "not received" or with nobody at the address
 */
function run(kind, k, r) {
  const { answerMeanDays, mistakenRate, notFoundRate, auditVisitDays, horizonDays } = ASSUMPTIONS;
  const self = [];
  const audit = [];
  const push = (arr, t) => t <= horizonDays && arr.push(t);

  // Households themselves. Honest ones occasionally answer wrongly.
  const honestHouseholds = kind === "honest" ? N : N - k;
  const noise = binom(binom(honestHouseholds, r), mistakenRate);
  for (let i = 0; i < noise; i++) push(self, expDays(answerMeanDays));
  if (kind === "withheld" || kind === "excluded") {
    // victims who answer say "not received" (withheld) or "still waiting" (left off every roster)
    const answering = binom(k, r);
    for (let i = 0; i < answering; i++) push(self, expDays(answerMeanDays));
  }
  // "targeted": victims were chosen among households that would never answer; "ghost": the colluders
  // hold the ghosts' keys and confirm every ghost line. Neither adds a household signal.

  // Sample audit over the published lines. Excluded households are not on any roster.
  const lines = kind === "excluded" ? N - k : N;
  const bad = kind === "honest" || kind === "excluded" ? 0 : k;
  let badLeft = bad;
  let linesLeft = lines;
  for (let left = lines; left > 0; left -= ASSUMPTIONS.batchSize) {
    const size = Math.min(ASSUMPTIONS.batchSize, left);
    // bad lines in this batch: hypergeometric share of the remaining bad lines
    let badHere = 0;
    for (let i = 0; i < size; i++) {
      if (rand() < badLeft / linesLeft) {
        badHere++;
        badLeft--;
      }
      linesLeft--;
    }
    let pool = size;
    let poolBad = badHere;
    for (let i = 0, n = sampleSize(size); i < n; i++) {
      const isBad = rand() < poolBad / pool;
      pool--;
      if (isBad) poolBad--;
      const t = rand() * auditVisitDays;
      if (isBad || rand() < mistakenRate + notFoundRate) push(audit, t);
    }
  }
  self.sort((a, b) => a - b);
  audit.sort((a, b) => a - b);
  return { self, audit };
}

/** 1 - alpha quantile of the final count under the honest baseline: more than this is a detection. */
function threshold(counts, alpha) {
  const sorted = [...counts].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil((1 - alpha) * sorted.length) - 1)];
}

const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return Math.round(s[Math.floor(s.length / 2)]);
};

function evaluate(r) {
  const T = ASSUMPTIONS.trials;
  const a = ASSUMPTIONS.falseAlarm;
  const honest = Array.from({ length: T }, () => run("honest", 0, r));
  const th = {
    selfOnly: threshold(honest.map((h) => h.self.length), a),
    selfWithAudit: threshold(honest.map((h) => h.self.length), a / 2),
    audit: threshold(honest.map((h) => h.audit.length), a / 2),
  };
  // day on which a channel's count first exceeds its threshold (null = never within the horizon)
  const crossing = (times, limit) => (times.length > limit ? times[limit] : null);
  const measure = (kind, k) => {
    const self = [];
    const both = [];
    for (let i = 0; i < T; i++) {
      const o = run(kind, k, r);
      self.push(crossing(o.self, th.selfOnly));
      const s = crossing(o.self, th.selfWithAudit);
      const au = crossing(o.audit, th.audit);
      both.push(s === null ? au : au === null ? s : Math.min(s, au));
    }
    const summary = (days) => {
      const hit = days.filter((d) => d !== null);
      return { detected: +(hit.length / T).toFixed(3), medianDay: median(hit) };
    };
    return { self: summary(self), withAudit: summary(both) };
  };
  return { th, honest, measure };
}

const SCENARIOS = [
  { key: "withheld", label: "Payments withheld from real households", note: "Lines are published as paid; the households never got the money." },
  { key: "targeted", label: "Withheld from households unlikely to answer", note: "Same, but aimed at elders and displaced families who would not answer by themselves." },
  { key: "ghost", label: "Ghost households registered by colluding officials", note: "A village chief and the township office both sign fake households; the colluders confirm the ghosts' lines themselves." },
  { key: "excluded", label: "Eligible households left off every roster", note: "Never recorded as paid; nothing to dispute." },
];

const main = evaluate(ASSUMPTIONS.responseRate);
const results = [];
for (const s of SCENARIOS) {
  for (const rate of RATES) {
    const k = Math.round(rate * N);
    results.push({ scenario: s.key, rate, affected: k, ...main.measure(s.key, k) });
  }
}
const sensitivity = [];
for (const r of SENSITIVITY) {
  const e = evaluate(r);
  for (const key of ["withheld", "targeted"]) {
    const k = Math.round(0.01 * N);
    sensitivity.push({ scenario: key, responseRate: r, rate: 0.01, affected: k, ...e.measure(key, k) });
  }
}

const mean = (xs) => +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1);
const out = {
  generatedBy: "web/scripts/fraud-sim.mjs",
  assumptions: { ...ASSUMPTIONS, batches: batches.length, auditVisits },
  honestBaseline: {
    meanSelfSignals: mean(main.honest.map((h) => h.self.length)),
    meanAuditSignals: mean(main.honest.map((h) => h.audit.length)),
    thresholds: main.th,
  },
  scenarios: SCENARIOS,
  results,
  sensitivity,
};
const path = new URL("../src/lib/replay/fraud-sim.json", import.meta.url);
writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${path.pathname}`);
for (const r of results) {
  console.log(
    `${r.scenario.padEnd(9)} ${String(r.rate * 100).padStart(4)}% (${String(r.affected).padStart(3)})  self ${(r.self.detected * 100).toFixed(0).padStart(3)}% d${r.self.medianDay ?? "-"}  +audit ${(r.withAudit.detected * 100).toFixed(0).padStart(3)}% d${r.withAudit.medianDay ?? "-"}`,
  );
}
console.log("honest baseline", out.honestBaseline);
for (const r of sensitivity) console.log("sens", r.scenario, r.responseRate, r.self, r.withAudit);
