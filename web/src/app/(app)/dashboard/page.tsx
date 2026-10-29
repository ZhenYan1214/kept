"use client";
import Link from "next/link";
import { useSnapshot } from "@/components/snapshot";
import { Card, Empty, SectionTitle, Stat, Tag, ntd, ntdShort, pct } from "@/components/ui";
import { Icon } from "@/components/icons";
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
      <Empty>Loading the simulated demo from the chain…</Empty>
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
    <div>
      <div className="space-y-6">
        <div id="demo" className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <Tag kind="sim" />
              Everything here is read from the contracts. Anyone can check it on-chain.
            </p>
            <h1 className="mt-3 text-[30px] font-semibold tracking-tight">Overview</h1>
            <p className="mt-1 text-sm text-muted">
              {f.name} · {snap.disaster?.name}
            </p>
          </div>
          <button
            onClick={download}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-line bg-card px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-sunk md:self-auto"
          >
            <Icon.Download className="h-4 w-4" />
            Download open data
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
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
          <nav aria-label="Dashboard sections" className="-mx-1 flex gap-1 overflow-x-auto px-1 text-sm">
            {[
              ["#alerts", "Alerts"],
              ["#money", "Money and charter"],
              ["#custody", "Custody tree"],
              ["#audits", "Sample audits"],
              ["#changes", "Changes and votes"],
              ["#excluded", "Who may be left out"],
              ["#issuers", "Who certified whom"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-muted transition-colors hover:bg-sunk hover:text-ink">
                {label}
              </a>
            ))}
          </nav>

          <div id="alerts" className="scroll-mt-20">
            <AlertsPanel snap={snap} />
          </div>

          <div id="money" className="grid scroll-mt-20 gap-6 lg:grid-cols-2">
            <FunnelPanel snap={snap} />
            <CharterPanel snap={snap} />
          </div>

          <Card className="scroll-mt-20" id="custody">
            <SectionTitle kicker="Every hand" title="Custody tree">
              Each transfer is recorded by the sender and acknowledged by the receiver. Payment rosters are published as pseudonymous lines (receipt
              address and amount, never a name): each household finds its own line and confirms or disputes it.
            </SectionTitle>
            <HopTree snap={snap} />
          </Card>

          <div id="audits" className="scroll-mt-20">
            <AuditPanel snap={snap} />
          </div>

          <Card className="scroll-mt-20" id="changes">
            <SectionTitle kicker="Households have a vote" title="Changes to the fund">
              Allocations need committee signatures. Changing caps or extending the deadline waits through a public period in which
              verified households can veto — anonymously, one vote each.
            </SectionTitle>
            <ProposalList snap={snap} />
          </Card>

          <div id="excluded" className="scroll-mt-20">
            <ExclusionPanel snap={snap} />
          </div>
          <div id="issuers" className="scroll-mt-20">
            <IssuerPanel snap={snap} />
          </div>
        </div>
      </div>
    </div>
  );
}
