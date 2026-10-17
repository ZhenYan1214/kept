"use client";
import { SOURCE, TRANSFERS } from "@/lib/replay/guangfu-2025";
import { DISCLOSURES, DISCLOSURE_SOURCE } from "@/lib/replay/disclosures-0923";
import { Card, SectionTitle } from "./ui";

const DISASTER = "2025-09-23"; // the barrier lake overflowed
const DAY = 86_400_000;
const day = (iso: string) => Math.round((Date.parse(iso) - Date.parse(DISASTER)) / DAY);
const m = (n: number) => `NT$${(n / 1e6).toLocaleString("en-US", { maximumFractionDigits: n >= 1e8 ? 0 : 1 })}M`;

/** Cumulative payouts by date, from the dates in the foundation's disclosure (real data). */
export function PayoutTimeline() {
  const end = day(SOURCE.asOf);
  const sorted = [...TRANSFERS].sort((a, b) => a.date.localeCompare(b.date) || a.n - b.n);
  let pre = 0;
  let claim = 0;
  const points = [{ d: 0, pre: 0, claim: 0 }];
  for (const t of sorted) {
    if (t.prealloc) pre += t.amount;
    else claim += t.amount;
    points.push({ d: day(t.date), pre, claim });
  }
  points.push({ d: end, pre, claim });
  const total = pre + claim;
  const firstMonth = sorted.filter((t) => day(t.date) <= 30).reduce((a, t) => a + t.amount, 0);
  const dayReaching = (share: number) => points.find((p) => p.pre + p.claim >= share * total)!.d;

  // Reconciled, as reported in each monthly disclosure (dated by its "as of" date, else its publication date).
  const rec = DISCLOSURES.filter((x) => x.reconciled !== null).map((x) => ({
    n: x.n,
    d: day(x.asOf ?? x.published),
    v: x.reconciled!,
    spent: x.spent!,
    claims: x.claims!,
    url: x.url,
    date: x.asOf ?? x.published,
  }));
  const last = rec[rec.length - 1];
  // Reconciled minus paid-on-claim, from the foundation's own figures: how long it stayed unchanged.
  const base = rec[0].v - rec[0].claims;
  let k = 0;
  while (k + 1 < rec.length && rec[k + 1].v - rec[k + 1].claims === base) k++;
  const flatFrom = rec[0];
  const flatTo = rec[k];
  const flatMonths = Math.round((flatTo.d - flatFrom.d) / 30.4);

  // SVG step chart
  const W = 720;
  const H = 240;
  const pad = { l: 68, r: 12, t: 12, b: 28 };
  const x = (d: number) => pad.l + (d / end) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - (v / total) * (H - pad.t - pad.b);
  type P = (typeof points)[number];
  // corners of a step line: hold the previous value until the next transfer date, then jump
  const corners = (val: (p: P) => number) =>
    points.flatMap((p, i) => (i === 0 ? [[x(p.d), y(val(p))]] : [[x(p.d), y(val(points[i - 1]))], [x(p.d), y(val(p))]]));
  const line = (val: (p: P) => number) => corners(val).map(([a, b], i) => `${i ? "L" : "M"}${a},${b}`).join("");
  const area = (top: (p: P) => number, base: (p: P) => number) =>
    [...corners(top), ...corners(base).reverse()].map(([a, b], i) => `${i ? "L" : "M"}${a},${b}`).join("") + "Z";
  const recLine = rec
    .flatMap((r, i) => (i === 0 ? [[x(r.d), y(r.v)]] : [[x(r.d), y(rec[i - 1].v)], [x(r.d), y(r.v)]]))
    .concat([[x(end), y(last.v)]])
    .map(([a, b], i) => `${i ? "L" : "M"}${a},${b}`)
    .join("");
  const months = Array.from({ length: 13 }, (_, i) => {
    const date = new Date(Date.UTC(2025, 9 + i, 1));
    return { d: Math.round((date.getTime() - Date.parse(DISASTER)) / DAY), label: date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }) };
  }).filter((mo) => mo.d <= end);

  return (
    <Card>
      <SectionTitle kicker="Over time · all 11 monthly disclosures" title="Money moved fast; confirming it arrived did not">
        Cumulative payouts by the date of each transfer, and the reconciled total as reported in each of the foundation&apos;s
        eleven monthly disclosures (one cumulative number per month, not itemised).
      </SectionTitle>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px]" role="img" aria-label="Cumulative payouts over time">
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1={pad.l} x2={W - pad.r} y1={y(f * total)} y2={y(f * total)} className="stroke-line" />
              <text x={pad.l - 6} y={y(f * total) + 4} textAnchor="end" className="fill-muted text-[10px]">
                {m(f * total)}
              </text>
            </g>
          ))}
          {months.map((mo) => (
            <text key={mo.d} x={x(mo.d)} y={H - 10} textAnchor="middle" className="fill-muted text-[10px]">
              {mo.label}
            </text>
          ))}
          <path d={area((p) => p.pre, () => 0)} className="fill-warn/30" />
          <path d={area((p) => p.pre + p.claim, (p) => p.pre)} className="fill-ok/30" />
          <path d={line((p) => p.pre + p.claim)} className="fill-none stroke-ink" strokeWidth={1.5} />
          <path d={recLine} className="fill-none stroke-accent" strokeWidth={2} />
          {rec.map((r) => (
            <a key={r.n} href={r.url} target="_blank" rel="noreferrer">
              <circle cx={x(r.d)} cy={y(r.v)} r={9} className="fill-transparent" />
              <circle cx={x(r.d)} cy={y(r.v)} r={4} className="fill-accent stroke-card" strokeWidth={2}>
                <title>{`Disclosure #${r.n} (${r.date}): reconciled ${m(r.v)} of ${m(r.spent)} spent (${((r.v / r.spent) * 100).toFixed(1)}%)`}</title>
              </circle>
            </a>
          ))}
          <text x={x(end) - 8} y={y(last.v) - 12} textAnchor="end" className="fill-ink text-[11px] font-medium">
            reconciled by {last.date}: {m(last.v)}
          </text>
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-warn/40" /> pre-allocated, reconciled later (
          {((pre / total) * 100).toFixed(1)}%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-ok/40" /> paid on a claim ({((claim / total) * 100).toFixed(1)}%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-accent" /> reconciled, as reported each month (hover a point; click for the source)
        </span>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <p>
          <span className="font-semibold">{m(firstMonth)}</span>
          <span className="text-muted"> paid out in the first 30 days ({Math.round((firstMonth / total) * 100)}% of everything paid out by {SOURCE.asOf}).</span>
        </p>
        <p>
          <span className="font-semibold">Day {dayReaching(0.5)}</span>
          <span className="text-muted"> half of it had gone out; day {dayReaching(0.9)}, 90%.</span>
        </p>
        <p>
          <span className="font-semibold">{flatMonths} months unchanged</span>
          <span className="text-muted">
            : from disclosure #{flatFrom.n} to #{flatTo.n}, reconciled minus paid-on-claim stayed at exactly {ntdExact(base)}. Every
            rise in that period matched a small paid-on-claim item; by the foundation&apos;s own figures, no pre-allocated money was
            newly reported as reconciled until disclosure #{last.n} ({Math.round((last.v / total) * 100)}% on day {end}).
          </span>
        </p>
      </div>
      <p className="mt-3 text-xs text-muted">
        Pre-allocating and reconciling later is normal in an emergency. The point is that this line is the only figure the foundation itself
        publishes on whether its pre-allocations were accounted for, and it is one unexplained number a month. With Kept, households&apos; own confirmations and audit
        visits would form a dated, itemised line here from the first payment batch on.
      </p>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted">Table view: all {DISCLOSURES.length} disclosures</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[560px] text-xs tabular-nums">
            <thead>
              <tr className="text-left text-muted">
                <th className="py-1 font-medium">#</th>
                <th className="font-medium">Published</th>
                <th className="font-medium">Spent (incl. pre-allocations)</th>
                <th className="font-medium">Reconciled</th>
                <th className="font-medium">Reconciled ÷ spent</th>
                <th className="font-medium">Transfers</th>
              </tr>
            </thead>
            <tbody>
              {DISCLOSURES.map((x) => (
                <tr key={x.n} className="border-t border-line" title={x.note}>
                  <td className="py-1">
                    <a className="text-accent underline" href={x.url} target="_blank" rel="noreferrer">
                      {x.n}
                    </a>
                  </td>
                  <td>{x.published}</td>
                  <td>{x.spent === null ? "—" : ntdExact(x.spent)}</td>
                  <td>{x.reconciled === null ? "not stated" : ntdExact(x.reconciled)}</td>
                  <td>{x.reconciled === null || !x.spent ? "—" : `${((x.reconciled / x.spent) * 100).toFixed(2)}%`}</td>
                  <td>{x.transfers ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 text-[11px] text-muted">
            Transcribed by hand from the published pages and table images, retrieved {DISCLOSURE_SOURCE.retrieved} (
            <a className="underline" href={DISCLOSURE_SOURCE.index} target="_blank" rel="noreferrer">
              index
            </a>
            ). Hover a row for transcription notes; for example disclosure #7 repeats #6 word for word.
          </p>
        </div>
      </details>
    </Card>
  );
}

const ntdExact = (n: number) => `NT${n.toLocaleString("en-US")}`;
