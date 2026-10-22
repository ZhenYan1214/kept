import Link from "next/link";
import { SPENT_TOTAL, TRANSFERS } from "@/lib/replay/guangfu-2025";
import { DISCLOSURES } from "@/lib/replay/disclosures-0923";
import { BACKTEST } from "@/lib/replay/backtest";
import { Tag } from "./ui";
import { Icon } from "./icons";
import { CountUp, Reveal } from "./motion";
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
    <div className="space-y-16 md:space-y-24">
      <section className="grid items-start gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
        <div>
          <p className="eyebrow flex flex-wrap items-center gap-2">
            <Tag kind="real" />
            The public record · Guangfu, Hualien · 2025 flood
          </p>
          <h1 className="mt-5 font-serif text-[38px] font-medium leading-[1.04] text-ink sm:text-[48px] lg:text-[56px]">
            A year after the flood, the public could see NT${billions}bn leave the relief foundation,{" "}
            <em className="text-seal">but not whether it reached anyone.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            <span className="font-medium text-ink">Kept</span> follows donated money hand by hand, until the household it was meant
            for can say whether it arrived. Getting paid needs nothing from a household; confirming is optional, and elders can use a
            printed card or a social worker.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/replay"
              className="group inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-medium text-on-ink transition hover:bg-ink/85"
            >
              See the real records
              <Icon.Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-md border border-line px-5 py-3 text-sm font-medium text-ink transition hover:border-ink/40"
            >
              Try the 5-minute demo
              <Icon.ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
        <Reveal delay={120}>
          <VisibilityChain />
        </Reveal>
      </section>

      <section aria-labelledby="findings">
        <div className="flex items-end justify-between gap-4 border-b border-ink pb-3">
          <h2 id="findings" className="font-serif text-2xl font-medium">
            What the records show
          </h2>
          <span className="eyebrow hidden sm:block">Computed from 11 monthly disclosures and county reports</span>
        </div>
        <div className="grid md:grid-cols-3">
          {FINDINGS.map((f, i) => (
            <Reveal key={f.href + i} delay={i * 110}>
              <Link
                href={f.href}
                className="group flex h-full flex-col border-b border-line py-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <p className="eyebrow flex items-center gap-2">
                  <span className="tabular-nums">0{i + 1}</span>
                  {f.tag && <span className="rounded-[3px] bg-accent/10 px-1.5 py-px text-accent">{f.tag}</span>}
                </p>
                <p className="mt-3 font-serif text-[44px] leading-none text-seal">
                  <CountUp value={f.value} format={f.format} />
                </p>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/85">{f.text}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  See the records
                  <Icon.Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">
          The backtest assumes the custodian records under Kept. An alert is a reason to look, not a finding of wrongdoing.
        </p>
      </section>

      <section aria-labelledby="how" className="grid gap-10 lg:grid-cols-[0.8fr_2fr]">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <span className="h-px w-5 bg-seal" />
            How Kept works
          </p>
          <h2 id="how" className="mt-2 font-serif text-[28px] font-medium leading-tight">
            Two promises, made checkable.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            To donors, about how the money is used. To the people it is for, that no one is left out. The custodians being checked
            should not keep the only ledger.
          </p>
          <Link href="/why" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
            Why on-chain, and what it would catch <Icon.Arrow className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 text-ink">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-serif text-xl font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
