"use client";
import { useState } from "react";
import { Badge, Bar, Card, SectionTitle, Stat, ntd, pct } from "@/components/ui";
import {
  AREAS,
  INCOME_TOTAL,
  RECONCILED_TOTAL,
  SOURCE,
  SPENT_TOTAL,
  TRANSFERS,
  type Area,
  type RecipientKind,
} from "@/lib/replay/guangfu-2025";
import { COST_LINES, PRICE_ASSUMPTIONS, TOTAL_GAS, usdCost } from "@/lib/replay/cost";
import { PayoutTimeline } from "@/components/payout-timeline";

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const PREALLOC = TRANSFERS.filter((t) => t.prealloc);
const PREALLOC_TOTAL = sum(PREALLOC.map((t) => t.amount));
const NTD_PER_USD = 32; // assumption, for the cost ratio only

const KIND_LABEL: Record<RecipientKind, string> = {
  ministry: "Ministry of Health and Welfare",
  county: "Hualien County Government",
  agency: "Other ministries",
  ngo: `NGOs (${TRANSFERS.filter((t) => t.kind === "ngo").length} transfers, ${new Set(TRANSFERS.filter((t) => t.kind === "ngo").map((t) => t.recipient)).size} organisations)`,
  school: "Schools",
  "civic-tech": "Civic tech (guangfu.tw)",
};

export default function ReplayPage() {
  const [showAll, setShowAll] = useState(false);
  const byKind = (Object.keys(KIND_LABEL) as RecipientKind[])
    .map((k) => ({ k, amount: sum(TRANSFERS.filter((t) => t.kind === k).map((t) => t.amount)) }))
    .sort((a, b) => b.amount - a.amount);
  const byArea = (Object.keys(AREAS) as Area[]).map((a) => ({ a, amount: sum(TRANSFERS.filter((t) => t.area === a).map((t) => t.amount)) }));
  const rows = showAll ? TRANSFERS : TRANSFERS.filter((t) => t.amount >= 10_000_000);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Real public data · nothing on this page is simulated</p>
        <h1 className="text-2xl font-semibold">Guangfu 2025, as the public can see it today</h1>
        <p className="max-w-3xl text-sm text-muted">
          Every number below comes from the Disaster Relief Foundation&apos;s 11th public disclosure for the 0923 barrier-lake
          appeal (as of {SOURCE.asOf}), published as images and transcribed by hand. The 48 transfers add up exactly to the total
          the foundation states. It is institution-level data only; no household appears anywhere.{" "}
          <a href={SOURCE.url} target="_blank" rel="noreferrer" className="text-accent underline">
            Source
          </a>
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Raised" value={ntd(INCOME_TOTAL)} sub="donations, interest, earmarked transfers" />
        <Stat label="Paid out" value={ntd(SPENT_TOTAL)} sub={`48 transfers · ${pct(SPENT_TOTAL, INCOME_TOTAL)}% of raised`} />
        <Stat
          label="Of which pre-allocated"
          value={ntd(PREALLOC_TOTAL)}
          sub={`${PREALLOC.length} transfers · ${pct(PREALLOC_TOTAL, SPENT_TOTAL)}% of paid out, to be reconciled later`}
          tone="warn"
        />
        <Stat label="Reconciled" value={ntd(RECONCILED_TOTAL)} sub={`${pct(RECONCILED_TOTAL, SPENT_TOTAL)}% of paid out, a year after the disaster`} tone="bad" />
      </div>

      <PayoutTimeline />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle kicker="Where the trail stops" title="One hand visible, then nothing">
            Pre-allocating and reconciling later is normal in an emergency, and this foundation discloses more than most. The gap
            is what comes after the first hand.
          </SectionTitle>
          <ol className="space-y-3 text-sm">
            {[
              ["Donors → foundation", "Visible", "Totals and donor lists are published.", "ok"],
              ["Foundation → 48 recipients", "Visible", "Every transfer: date, voucher, item, amount.", "ok"],
              [`Recipients → households (${PREALLOC.length} pre-allocations, ${ntd(PREALLOC_TOTAL)})`, "Totals only", "Aggregate counts are published (e.g. 2,582 households by Dec 2025); no record a household can check.", "warn"],
              ["Households: “it reached me”", "No channel", "No way for a household to confirm or dispute a payment.", "bad"],
            ].map(([step, state, note, tone]) => (
              <li key={step} className="flex items-start justify-between gap-3 border-t border-line pt-3 first:border-0 first:pt-0">
                <div>
                  <p className="font-medium">{step}</p>
                  <p className="text-xs text-muted">{note}</p>
                </div>
                <Badge tone={tone as "ok" | "warn" | "bad"}>{state}</Badge>
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-lg bg-accent/10 p-3 text-sm">
            <strong>With Kept</strong>, each of the 21 pre-allocations would be acknowledged by the ministry or NGO that received
            it, each payment batch would be published as pseudonymous lines, and each household could find its own line and say
            “received” or “not received”. The foundation would get its reconciliation evidence as it happens, not a year later.
          </p>
        </Card>

        <Card>
          <SectionTitle kicker="Who received the money" title="93% went to one ministry, in advance">
            Recipients of the 48 transfers.
          </SectionTitle>
          <div className="space-y-3">
            {byKind.map(({ k, amount }) => (
              <div key={k}>
                <div className="mb-1 flex justify-between gap-2 text-sm">
                  <span>{KIND_LABEL[k]}</span>
                  <span className="tabular-nums text-muted">
                    {ntd(amount)} · {pct(amount, SPENT_TOTAL)}%
                  </span>
                </div>
                <Bar value={amount} max={SPENT_TOTAL} tone={k === "ministry" ? "warn" : "info"} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle kicker="No shared roster" title="How many households? The estimate kept moving">
            The same disaster, in the foundation&apos;s own transfer records.
          </SectionTitle>
          <ol className="space-y-2 text-sm">
            <li>
              <Badge tone="muted">Oct 2025</Badge> Clean-up and housing repair: <strong>est. 1,837 households</strong> (#1, #4)
            </li>
            <li>
              <Badge tone="muted">Oct 2025</Badge> A further <strong>est. 1,488 households outside the protected zone</strong>,
              including <strong>110 disputed cases</strong> (#5)
            </li>
            <li>
              <Badge tone="muted">Mar 2026</Badge> Clean-up support <strong>adjusted to 4,039 households and 114 cases</strong> (#30)
            </li>
          </ol>
          <p className="mt-4 text-sm text-muted">
            Revising estimates is expected. What is missing is one attributable record of who was counted, by whom, and who appealed:
            the registry and appeal statistics Kept keeps per village.
          </p>
        </Card>

        <Card>
          <SectionTitle kicker="The charter already exists" title="23 relief categories, published from day one">
            The foundation already defines what the money is for: 23 categories in 5 areas, each with a per-person or per-household
            standard. A Kept charter is the same table, fixed so it cannot be rewritten, plus what the disclosure does not state:
            caps and a surplus rule.
          </SectionTitle>
          <div className="space-y-3">
            {byArea.map(({ a, amount }) => (
              <div key={a}>
                <div className="mb-1 flex justify-between gap-2 text-sm">
                  <span>
                    {AREAS[a].label} <span className="text-xs text-muted">({AREAS[a].categories} {AREAS[a].categories === 1 ? "category" : "categories"})</span>
                  </span>
                  <span className="tabular-nums text-muted">{ntd(amount)}</span>
                </div>
                <Bar value={amount} max={SPENT_TOTAL} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle kicker="The 48 transfers" title={showAll ? "All transfers" : "Transfers of NT$10M or more"}>
          Pre-allocations are paid on an estimate and reconciled later; the others were paid on a claim.
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2 font-medium">#</th>
                <th className="font-medium">Date</th>
                <th className="font-medium">Recipient</th>
                <th className="font-medium">Item</th>
                <th className="text-right font-medium">Amount</th>
                <th className="pl-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.n} className="border-t border-line align-top">
                  <td className="py-2 tabular-nums text-muted">{t.n}</td>
                  <td className="whitespace-nowrap tabular-nums">{t.date}</td>
                  <td>
                    {t.recipient}
                    <span className="block text-xs text-muted">{t.recipientZh}</span>
                  </td>
                  <td>
                    {t.item}
                    <span className="block text-xs text-muted">{t.itemZh}</span>
                  </td>
                  <td className="text-right tabular-nums">{ntd(t.amount)}</td>
                  <td className="pl-3">
                    {t.prealloc ? <Badge tone="warn">Pre-allocated</Badge> : <Badge tone="muted">Paid on claim</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-3 text-sm text-accent underline" onClick={() => setShowAll((s) => !s)}>
          {showAll ? "Show only the large transfers" : `Show all ${TRANSFERS.length} transfers`}
        </button>
      </Card>

      <Card>
        <SectionTitle kicker="Feasibility" title="What Kept would cost on-chain at this scale">
          Gas per operation measured with the real zero-knowledge verifier; counts from the disclosure or stated assumptions.
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2 font-medium">Operation</th>
                <th className="text-right font-medium">Gas each</th>
                <th className="text-right font-medium">Count</th>
                <th className="pl-3 font-medium">Basis</th>
              </tr>
            </thead>
            <tbody>
              {COST_LINES.map((l) => (
                <tr key={l.op} className="border-t border-line">
                  <td className="py-2">{l.op}</td>
                  <td className="text-right tabular-nums">{l.gasEach.toLocaleString("en-US")}</td>
                  <td className="text-right tabular-nums">{l.count.toLocaleString("en-US")}</td>
                  <td className="pl-3 text-xs text-muted">{l.basis}</td>
                </tr>
              ))}
              <tr className="border-t border-line font-medium">
                <td className="py-2">Total</td>
                <td className="text-right tabular-nums" colSpan={2}>
                  {(TOTAL_GAS / 1e9).toFixed(2)} billion gas
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm">
          At an assumed all-in L2 price of {PRICE_ASSUMPTIONS.gweiLow}–{PRICE_ASSUMPTIONS.gweiHigh} gwei and ETH at US$
          {PRICE_ASSUMPTIONS.ethUsd.toLocaleString("en-US")}, that is roughly{" "}
          <strong>
            US${Math.round(usdCost(PRICE_ASSUMPTIONS.gweiLow)).toLocaleString("en-US")}–
            {Math.round(usdCost(PRICE_ASSUMPTIONS.gweiHigh)).toLocaleString("en-US")}
          </strong>{" "}
          for the whole disaster: at most{" "}
          {((usdCost(PRICE_ASSUMPTIONS.gweiHigh) * NTD_PER_USD * 100) / INCOME_TOTAL).toFixed(3)}% of the money raised (at an assumed
          NT${NTD_PER_USD} per US$). For comparison, the foundation granted NT$2,000,000 to the guangfu.tw platform (#46).
        </p>
        <p className="mt-2 text-xs text-muted">
          Prices are assumptions, shown as a tenfold range on purpose. Registration (adding each household to the zero-knowledge
          group) is the largest item; batching it is the obvious saving.
        </p>
      </Card>
    </div>
  );
}
