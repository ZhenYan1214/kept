"use client";
import Link from "next/link";
import { useSnapshot } from "@/components/snapshot";
import { Card, Empty, SectionTitle, Stat, Tag, ntd, ntdShort, pct } from "@/components/ui";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { StartHere } from "@/components/guide";
import { Lede } from "@/components/lede";
import {
  AlertsPanel,
  AuditPanel,
  CharterPanel,
  ExclusionPanel,
  FunnelPanel,
  HopTree,
  IssuerPanel,
  ProposalList,
  custodyTotals,
} from "@/components/panels";
import { toJSONSafe } from "@/lib/serialize";

export default function Dashboard() {
  const { snap, loading } = useSnapshot();
  if (loading && !snap)
    return (
      <div className="space-y-16">
        <Lede />
        <Empty>Loading the simulated demo from the chain…</Empty>
      </div>
    );
  if (!snap?.fund) {
    return (
      <Card>
        <SectionTitle title="No fund yet" />
        <p className="text-sm text-muted">
          The contracts are deployed but the simulated scenario has not been set up.{" "}
          <Link className="text-accent underline" href="/setup">
            Go to Setup
          </Link>
          .
        </p>
      </Card>
    );
  }
  const f = snap.fund;
  const t = custodyTotals(snap.hops);
  const pendingAppeals = snap.appeals.filter((a) => a.status === 1).length;
  const openVotes = f.proposals.filter((p) => p.status === 1).length;

  const download = () => {
    const blob = new Blob([JSON.stringify(toJSONSafe(snap), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `kept-open-data-block-${snap.block}.json`;
    a.click();
  };

  return (
    <div className="space-y-16 md:space-y-24">
      <Lede />

      <div className="space-y-8">
        <div id="demo" className="scroll-mt-28 border-t-2 border-ink pt-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow flex flex-wrap items-center gap-2">
                <Tag kind="sim" />
                The live demo ledger · anyone can verify it on-chain
              </p>
              <h2 className="mt-3 font-serif text-[30px] font-medium leading-tight md:text-[38px]">{f.name}</h2>
              <p className="mt-1 text-muted">{snap.disaster?.name}</p>
            </div>
            <button
              onClick={download}
              className="inline-flex items-center gap-2 self-start rounded-md border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/40 md:self-auto"
            >
              <Icon.Download className="h-4 w-4" />
              Download open data
            </button>
          </div>
        </div>

        <StartHere />

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
          <Stat label="Raised" value={<span title={ntd(f.totalRaised)}>{ntdShort(f.totalRaised)}</span>} sub={`${f.donationCount} donations`} />
          <Stat label="Allocated" value={<span title={ntd(f.totalAllocated)}>{ntdShort(f.totalAllocated)}</span>} sub={`${pct(f.totalAllocated, f.totalRaised)}% of raised`} />
          <Stat label="Reported paid" value={<span title={ntd(t.reported)}>{ntdShort(t.reported)}</span>} sub={`${t.reportedHouseholds} households`} />
          <Stat label="Confirmed" value={t.confirmed} sub={`by households · ${t.disputed} disputed`} tone={t.disputed ? "warn" : "ok"} />
          <Stat label="Verified" value={snap.disaster?.verified ?? 0} sub="households, two signatures each" />
          <Stat
            label="Appeals · votes"
            value={`${pendingAppeals} · ${openVotes}`}
            tone={pendingAppeals ? "warn" : undefined}
            sub="open now"
          />
        </div>

        <div className="space-y-6">
          <AlertsPanel snap={snap} />

          <div className="grid gap-6 lg:grid-cols-2">
            <FunnelPanel snap={snap} />
            <CharterPanel snap={snap} />
          </div>

          <Card>
            <SectionTitle kicker="Every hand" title="Custody tree">
              Each transfer is recorded by the sender and acknowledged by the receiver. Payment rosters are published as pseudonymous lines (receipt
              address and amount, never a name): each household finds its own line and confirms or disputes it.
            </SectionTitle>
            <HopTree snap={snap} />
          </Card>

          <AuditPanel snap={snap} />

          <Card>
            <SectionTitle kicker="Households have a vote" title="Changes to the fund">
              Allocations need committee signatures. Changing caps or extending the deadline waits through a public period in which
              verified households can veto — anonymously, one vote each.
            </SectionTitle>
            <ProposalList snap={snap} />
          </Card>

          <ExclusionPanel snap={snap} />
          <IssuerPanel snap={snap} />
        </div>
      </div>
    </div>
  );
}
