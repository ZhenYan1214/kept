import Link from "next/link";
import { SPENT_TOTAL, TRANSFERS } from "@/lib/replay/guangfu-2025";
import { DISCLOSURES } from "@/lib/replay/disclosures-0923";
import { BACKTEST } from "@/lib/replay/backtest";

/**
 * The first screen: the strongest real finding first, then what Kept does, then the way in.
 * Every number is computed from the transcribed public records (the same sources `npm run verify:data`
 * checks), so the first screen cannot drift from the evidence.
 */
const DAY = 86_400_000;
const days = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);

const preShare = TRANSFERS.filter((t) => t.prealloc).reduce((a, t) => a + t.amount, 0) / SPENT_TOTAL;
const withRec = DISCLOSURES.filter((d) => d.reconciled !== null);
const base = withRec[0].reconciled! - withRec[0].claims!;
let k = 0;
while (k + 1 < withRec.length && withRec[k + 1].reconciled! - withRec[k + 1].claims! === base) k++;
const flatMonths = Math.round(
  days(withRec[0].asOf ?? withRec[0].published, withRec[k].asOf ?? withRec[k].published) / 30.4,
);
const held = BACKTEST.find((c) => c.id === "0403-held")!;
const lead = days(held.keptFlags, held.publicLearned!);
const billions = (SPENT_TOTAL / 1e9).toFixed(2);

const FINDINGS: { figure: string; text: string; href: string; tag?: string }[] = [
  {
    figure: `${(preShare * 100).toFixed(1)}%`,
    text: `of NT$${billions}bn paid out by the relief foundation after the 2025 Guangfu flood went out as pre-allocations, to be accounted for later.`,
    href: "/replay",
  },
  {
    figure: `${flatMonths} months`,
    text: "in which the foundation's monthly reports showed no pre-allocated money newly reconciled (Dec 2025 – Aug 2026).",
    href: "/replay",
  },
  {
    figure: `${lead} days`,
    tag: "Backtest on real records",
    text: "earlier than the first news story we found: when Kept's “held over 90 days” alert would have fired on Hualien County's 2024 donation account, had it recorded under Kept.",
    href: "/replay#backtest",
  },
];

export function Lede() {
  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-sm md:p-8">
      <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
        <span className="rounded-full bg-ok/10 px-2 py-0.5 text-ok ring-1 ring-inset ring-ok/30">Real data</span>
        From the public record · Hualien, Taiwan
      </p>
      <h1 className="mt-2 max-w-4xl text-2xl font-semibold leading-tight md:text-3xl">
        A year after the flood, the public could see NT${billions}bn leave the relief foundation, but not whether it reached
        anyone.
      </h1>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {FINDINGS.map((f) => (
          <Link
            key={f.figure}
            href={f.href}
            className="group rounded-xl bg-paper p-4 ring-1 ring-line transition hover:ring-accent/40"
          >
            {f.tag && <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{f.tag}</p>}
            <p className="text-3xl font-semibold tabular-nums text-ink">{f.figure}</p>
            <p className="mt-1 text-sm text-muted">{f.text}</p>
            <p className="mt-2 text-xs font-medium text-accent group-hover:underline">See the records →</p>
          </Link>
        ))}
      </div>
      <p className="mt-5 max-w-4xl text-base">
        <span className="font-semibold">Kept</span> follows donated money hand by hand. Each custodian acknowledges what it
        receives; households confirm or dispute their own payment line; a random sample drawn on-chain is visited by an independent
        auditor. No names, IDs or bank accounts go on-chain. Getting paid needs nothing from a household; confirming is
        optional, and elders can use a printed card or a social worker.
      </p>
      <dl className="mt-3 grid max-w-4xl gap-2 text-sm md:grid-cols-2">
        <div>
          <dt className="font-semibold">Why on-chain</dt>
          <dd className="text-muted">
            The custodians being checked should not keep the only ledger. No single one of them can quietly edit a shared record.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Who runs it</dt>
          <dd className="text-muted">
            Custodians record as they pay. Phase 0 needs no one&apos;s permission: volunteers can already turn published disclosures
            into open data, as the real-data page does.
          </dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href="/replay" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90">
          See the real data
        </Link>
        <a href="#demo" className="rounded-lg px-4 py-2 text-sm font-medium text-ink ring-1 ring-inset ring-line hover:bg-ink/5">
          Try the 5-minute demo ↓
        </a>
        <Link href="/why" className="rounded-lg px-4 py-2 text-sm font-medium text-ink ring-1 ring-inset ring-line hover:bg-ink/5">
          Why Kept
        </Link>
      </div>
      <p className="mt-4 text-xs text-muted">
        Figures computed from the foundation&apos;s 11 monthly disclosures and Hualien County&apos;s committee reports; the 199-day
        backtest assumes the custodian records under Kept. An alert is a reason to look, not a finding of wrongdoing.
      </p>
    </section>
  );
}
