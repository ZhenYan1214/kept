"use client";
import { RECONCILED_TOTAL, SOURCE, TRANSFERS } from "@/lib/replay/guangfu-2025";
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
  const months = Array.from({ length: 13 }, (_, i) => {
    const date = new Date(Date.UTC(2025, 9 + i, 1));
    return { d: Math.round((date.getTime() - Date.parse(DISASTER)) / DAY), label: date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }) };
  }).filter((mo) => mo.d <= end);

  return (
    <Card>
      <SectionTitle kicker="Over time" title="Money moved fast; checking whether it arrived did not">
        Cumulative payouts by the date of each transfer in the disclosure. Pre-allocations went out within days; reconciliation is
        reported only as one cumulative figure, with no dates, so its progress cannot be drawn.
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
          <circle cx={x(end)} cy={y(RECONCILED_TOTAL)} r={4} className="fill-bad" />
          <text x={x(end) - 8} y={y(RECONCILED_TOTAL) - 8} textAnchor="end" className="fill-bad text-[11px] font-medium">
            reconciled by {SOURCE.asOf}: {m(RECONCILED_TOTAL)}
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
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-bad" /> reconciled (one cumulative figure)
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
          <span className="font-semibold">Day {end}</span>
          <span className="text-muted">
            : {Math.round((RECONCILED_TOTAL / total) * 100)}% reconciled. With Kept, households&apos; own confirmations and audit
            visits would form a second line on this chart, dated, from the first payment batch on.
          </span>
        </p>
      </div>
    </Card>
  );
}
