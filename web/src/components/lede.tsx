import Link from "next/link";
import { SPENT_TOTAL, TRANSFERS } from "@/lib/replay/guangfu-2025";
import { DISCLOSURES } from "@/lib/replay/disclosures-0923";
import { BACKTEST } from "@/lib/replay/backtest";
import { Tag } from "./ui";
import { Icon } from "./icons";
import { VisibilityChain } from "./visibility-chain";

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

const FINDINGS: { value: number; format: (n: number) => string; text: string; href: string; tag?: string }[] = [
  {
    value: preShare * 100,
    format: (n) => `${n.toFixed(1)}%`,
    text: `of NT$${billions}bn paid out by the relief foundation after the 2025 Guangfu flood went out as pre-allocations, to be accounted for later.`,
    href: "/replay",
  },
  {
    value: flatMonths,
    format: (n) => `${Math.round(n)} months`,
    text: "in which the foundation's monthly reports showed no pre-allocated money newly reconciled (Dec 2025 – Aug 2026).",
    href: "/replay",
  },
  {
    value: lead,
    format: (n) => `${Math.round(n)} days`,
    tag: "Backtest",
    text: "earlier than the first news story we found: when Kept's “held over 90 days” alert would have fired on Hualien County's 2024 donation account, had it recorded under Kept.",
    href: "/replay#backtest",
  },
];

const STEPS = [
  {
    icon: Icon.Seal,
    title: "Every hand signs",
    text: "Each custodian acknowledges what it receives and records what it passes on. The record is shared, so no single custodian can quietly edit it.",
  },
  {
    icon: Icon.House,
    title: "Every household can answer",
    text: "Payments are published as pseudonymous lines. A household finds its own and says “received” or “not received”: no name, ID or bank account on-chain.",
  },
  {
    icon: Icon.Sample,
    title: "A sample is visited",
    text: "Many will never answer. So the contract draws a random sample that an independent auditor visits in person, and anyone can bound what could be missing.",
  },
];

export function Lede() {
  return (
    <div className="space-y-14 md:space-y-20">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Tag kind="real" />
            Guangfu, Hualien · 2025 flood
          </p>
          <h1 className="mt-4 text-[34px] font-semibold leading-[1.12] text-ink sm:text-[42px] lg:text-[46px]">
            A year after the flood, the public could see NT${billions}bn leave the relief foundation, but not whether it reached
            anyone.
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
            Kept follows donated money hand by hand, until the household it was meant for can say whether it arrived. Getting paid
            needs nothing from a household; confirming is optional, and elders can use a printed card or a social worker.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/replay"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent/90"
            >
              See the real records
              <Icon.Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-sunk"
            >
              Try the demo
            </a>
          </div>
        </div>
        <VisibilityChain />
      </section>

      <section aria-labelledby="findings">
        <h2 id="findings" className="text-xl font-semibold">
          What the records show
        </h2>
        <p className="mt-1 text-sm text-muted">From the foundation&apos;s 11 monthly disclosures and Hualien County&apos;s committee reports.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {FINDINGS.map((f, i) => (
            <Link
              key={f.href + i}
              href={f.href}
              className="group flex flex-col rounded-xl border border-line bg-card p-5 transition-colors hover:border-accent/40"
            >
              <p className="text-[34px] font-semibold leading-none tracking-tight text-ink tabular-nums">{f.format(f.value)}</p>
              {f.tag && <p className="mt-2 text-xs font-medium text-accent">{f.tag} on real records</p>}
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{f.text}</p>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                See the records
                <Icon.Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          The backtest assumes the custodian records under Kept. An alert is a reason to look, not a finding of wrongdoing.
        </p>
      </section>

      <section aria-labelledby="how">
        <h2 id="how" className="text-xl font-semibold">
          How Kept works
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Two promises made checkable: to donors, about how the money is used; to the people it is for, that no one is left out.{" "}
          <Link href="/why" className="font-medium text-accent hover:underline">
            Why on-chain
          </Link>
        </p>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.title} className="rounded-xl border border-line bg-card p-5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/10 text-accent">
                <s.icon className="h-[18px] w-[18px]" />
              </span>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
