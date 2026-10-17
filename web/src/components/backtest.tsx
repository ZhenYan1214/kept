"use client";
import { BACKTEST, BACKTEST_NOTES, type BacktestCase } from "@/lib/replay/backtest";
import { Badge, Card, SectionTitle } from "./ui";

const DAY = 86_400_000;
const TODAY = "2026-10-17"; // date of the research; cases with no news are counted up to here
const days = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);
const fmt = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function Strip({ c }: { c: BacktestCase }) {
  const end = c.publicLearned ?? TODAY;
  const lead = days(c.keptFlags, end);
  return (
    <div className="mt-3">
      <div className="relative h-2 rounded-full bg-ink/8">
        <div className={c.publicLearned ? "h-full rounded-full bg-accent/60" : "h-full rounded-full bg-warn/60"} style={{ width: "100%" }} />
        <span className="absolute -top-1 left-0 h-4 w-1 rounded bg-accent" />
        <span className={`absolute -top-1 right-0 h-4 w-1 rounded ${c.publicLearned ? "bg-ink" : "bg-warn"}`} />
      </div>
      <div className="mt-1.5 flex justify-between gap-3 text-xs">
        <span>
          <span className="font-semibold text-accent">Kept flags</span> {fmt(c.keptFlags)}
        </span>
        <span className="font-semibold tabular-nums">{lead} days</span>
        <span className="text-right">
          {c.publicLearned ? (
            <>
              <span className="font-semibold">Public learns</span> {fmt(c.publicLearned)}
            </>
          ) : (
            <>
              <span className="font-semibold text-warn">No news of the delay found</span> (as of {fmt(TODAY)})
            </>
          )}
        </span>
      </div>
    </div>
  );
}

/** "If Kept had been there": Kept's alert rules replayed against real Hualien records. */
export function Backtest() {
  return (
    <div id="backtest" className="scroll-mt-28">
    <Card>
      <SectionTitle kicker="Backtest on real records" title="If Kept had been there, when would someone have looked?">
        Kept&apos;s published alert rules, replayed against Hualien County&apos;s own donation-account records. Each line runs from the
        day a rule would have fired to the day the public found out.
      </SectionTitle>
      <div className="space-y-5">
        {BACKTEST.map((c) => (
          <div key={c.id} className="border-t border-line pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info">{c.disaster}</Badge>
              <span className="text-xs text-muted">{c.custodian}</span>
            </div>
            <p className="mt-1.5 text-sm font-medium">Rule: {c.rule}</p>
            <p className="mt-1 text-sm text-muted">{c.facts}</p>
            <Strip c={c} />
            <p className="mt-1.5 text-xs text-muted">
              {c.publicHow}{" "}
              {c.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && " · "}
                  <a className="text-accent underline" href={s.url} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted">
        Assumptions: &quot;Kept flags&quot; assumes the custodian records receipts, transfers and payments as they happen, which is
        what Kept asks of it; the rules are the dashboard&apos;s published ones. When county documents went online is estimated from
        upload timestamps. Rules about households (unconfirmed or disputed payments) cannot be replayed, because no household-level
        data is public. An alert is a reason to look, not a finding of wrongdoing: holding money while rebuilding is planned can be
        prudent. Full timelines and sources:{" "}
        <a className="text-accent underline" href={BACKTEST_NOTES} target="_blank" rel="noreferrer">
          backtest notes
        </a>
        .
      </p>
    </Card>
    </div>
  );
}
