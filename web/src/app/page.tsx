"use client";
import Link from "next/link";
import { useSnapshot } from "@/components/snapshot";
import { Card, Empty, SectionTitle, Stat, ntd, ntdShort, pct } from "@/components/ui";
import { StartHere } from "@/components/guide";
import {
  AlertsPanel,
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
  if (loading && !snap) return <Empty>Loading on-chain state…</Empty>;
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
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Public dashboard · anyone can verify</p>
          <h1 className="text-2xl font-semibold">{f.name}</h1>
          <p className="text-sm text-muted">{snap.disaster?.name}</p>
        </div>
        <button onClick={download} className="self-start rounded-lg px-3 py-2 text-sm text-accent ring-1 ring-inset ring-accent/30 hover:bg-accent/5 md:self-auto">
          Download open data (JSON)
        </button>
      </div>

      <StartHere />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Raised" value={<span title={ntd(f.totalRaised)}>{ntdShort(f.totalRaised)}</span>} sub={`${f.donationCount} donations`} />
        <Stat label="Allocated" value={<span title={ntd(f.totalAllocated)}>{ntdShort(f.totalAllocated)}</span>} sub={`${pct(f.totalAllocated, f.totalRaised)}% of raised`} />
        <Stat label="Reported paid" value={<span title={ntd(t.reported)}>{ntdShort(t.reported)}</span>} sub={`${t.reportedHouseholds} households`} />
        <Stat label="Household-confirmed" value={t.confirmed} sub={`${t.disputed} disputed`} tone={t.disputed ? "warn" : "ok"} />
        <Stat label="Verified households" value={snap.disaster?.verified ?? 0} sub="two signatures each" />
        <Stat
          label="Open appeals · votes"
          value={`${pendingAppeals} · ${openVotes}`}
          tone={pendingAppeals ? "warn" : undefined}
          sub="exclusion & changes"
        />
      </div>

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
  );
}
