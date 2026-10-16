"use client";
import { useState } from "react";
import SIM from "@/lib/replay/fraud-sim.json";
import { cx } from "./ui";

type Outcome = { detected: number; medianDay: number | null };

const pct = (x: number) => `${Math.round(x * 100)}%`;
const A = SIM.assumptions;

function Cell({ o }: { o: Outcome }) {
  // At or below the false-alarm rate, a "detection" is indistinguishable from noise.
  if (o.detected <= A.falseAlarm + 0.01) return <span className="text-bad">≈ chance ({pct(o.detected)})</span>;
  return (
    <span className={cx("font-medium", o.detected >= 0.9 ? "text-ok" : "text-warn")}>
      {pct(o.detected)}
      {o.medianDay !== null && <span className="font-normal text-muted"> · day {o.medianDay}</span>}
    </span>
  );
}

/** Monte Carlo results from web/scripts/fraud-sim.mjs: who would notice which failure, and when. */
export function FraudSimulation() {
  const rates = [...new Set(SIM.results.map((r) => r.rate))];
  const [rate, setRate] = useState(0.01);
  const rows = SIM.scenarios.map((s) => ({ s, r: SIM.results.find((x) => x.scenario === s.key && x.rate === rate)! }));
  const at = (key: string, r: number) => SIM.results.find((x) => x.scenario === key && x.rate === r)!;
  const sens = (key: string, r: number) => SIM.sensitivity.find((x) => x.scenario === key && x.responseRate === r)!;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Simulated · every assumption listed below</p>
        <h2 className="text-xl font-semibold">Would anyone notice? A simulation at Guangfu&apos;s scale</h2>
        <p className="text-sm text-muted">
          {A.households.toLocaleString("en-US")} households paid in {A.batches} published batches; {A.trials.toLocaleString("en-US")}{" "}
          runs per cell. Even when nothing is wrong, some honest households answer “not received” by mistake and some cannot be found
          at home, so a single alert is where to look, not proof. A failure counts as <em>detected</em> only when the count of bad
          answers rises above what 95% of honest runs produce ({pct(A.falseAlarm)} false alarms by construction).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">Share of households affected:</span>
        {rates.map((r) => (
          <button
            key={r}
            onClick={() => setRate(r)}
            className={cx(
              "rounded-lg px-2.5 py-1 ring-1 ring-inset",
              r === rate ? "bg-accent text-white ring-accent" : "text-ink ring-line hover:bg-ink/5",
            )}
          >
            {r * 100}% ({Math.round(r * A.households)})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-card">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-3 font-medium">Failure</th>
              <th className="p-3 font-medium">Today: aggregate totals</th>
              <th className="p-3 font-medium">Kept: households&apos; own answers</th>
              <th className="p-3 font-medium">Kept + sample audit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ s, r }) => (
              <tr key={s.key} className="border-t border-line align-top">
                <td className="p-3">
                  <p className="font-medium">{s.label}</p>
                  <p className="text-xs text-muted">{s.note}</p>
                </td>
                <td className="p-3 text-muted">Not in the public record</td>
                <td className="p-3">
                  <Cell o={r.self} />
                </td>
                <td className="p-3">
                  <Cell o={r.withAudit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">
        Cells: share of runs in which the failure is detected within {A.horizonDays} days · median day of detection. Not simulated
        because they are rules, not chance: roster lines that are not registered households are counted by the contract the moment
        they are published, and money neither passed on nor reported paid raises an alert after 90 days.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-card p-4 text-sm">
          <p className="font-semibold">Households&apos; own answers are strong where victims speak</p>
          <p className="mt-1 text-muted">
            At 1%, payments withheld at random are detected in {pct(at("withheld", 0.01).self.detected)} of runs, and households left
            off every roster, through their anonymous “still waiting” reports, in {pct(at("excluded", 0.01).self.detected)}.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-card p-4 text-sm">
          <p className="font-semibold">They are blind where nobody answers</p>
          <p className="mt-1 text-muted">
            Money withheld from households that never answer, or paid to ghosts whose keys the colluders hold, produces no dispute at
            all. That is why the sample audit exists: at 1% it detects them in {pct(at("ghost", 0.01).withAudit.detected)} of runs, at
            2% in {pct(at("ghost", 0.02).withAudit.detected)}, at 5% in {pct(at("ghost", 0.05).withAudit.detected)}.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-card p-4 text-sm">
          <p className="font-semibold">The audit is small and bounded</p>
          <p className="mt-1 text-muted">
            {A.auditVisits} visits ({pct(A.auditVisits / A.households)} of households). It cannot see households who are on no roster,
            and below about 1% it is weak: what it guarantees is an upper bound on what could be missing, batch by batch.
          </p>
        </div>
      </div>

      <details className="rounded-xl border border-line bg-card p-4 text-sm">
        <summary className="cursor-pointer font-medium">Assumptions, sensitivity and limits</summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
          <li>
            {pct(A.responseRate)} of households answer by themselves (we have no data; see sensitivity), after {A.answerMeanDays} days on
            average. All batches are published on day 0.
          </li>
          <li>
            {pct(A.mistakenRate)} of honest answers are mistaken; {pct(A.notFoundRate)} of honest sampled households cannot be found even
            after repeated visits. On average that is {SIM.honestBaseline.meanSelfSignals} mistaken disputes and{" "}
            {SIM.honestBaseline.meanAuditSignals} bad audit visits per disaster when nothing is wrong.
          </li>
          <li>
            The audit samples a fifth of each batch, at least 5 and at most 59 lines, visited within {A.auditVisitDays} days. With two
            channels, the {pct(A.falseAlarm)} false-alarm budget is split between them, which is why the audit column can be slightly
            lower where the audit adds nothing.
          </li>
          <li>
            Sensitivity at 1% affected: if only {pct(0.1)} of households answer, payments withheld at random are detected in{" "}
            {pct(sens("withheld", 0.1).self.detected)} of runs from answers alone, {pct(sens("withheld", 0.1).withAudit.detected)} with the
            audit; at {pct(0.6)} answering, {pct(sens("withheld", 0.6).self.detected)}. Withholding aimed at non-answering households stays
            at chance without the audit whatever the response rate.
          </li>
          <li>
            Not modelled: ghosts registered by colluding officials would cluster under the officials who signed them, which the
            dashboard shows per issuer, so real detection could be higher. We assume the auditor is honest and independent of the
            custodians; a corrupt auditor is attributable, not prevented.
          </li>
          <li>
            Reproduce: <code>node web/scripts/fraud-sim.mjs</code> (seeded, deterministic).
          </li>
        </ul>
      </details>
    </section>
  );
}
