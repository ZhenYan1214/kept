"use client";
import type { Hop, Proposal, Snapshot } from "@/lib/snapshot";
import { villageName, VILLAGES, PURPOSES } from "@/lib/scenario";
import { Addr, Badge, Bar, Card, Empty, Hash, SectionTitle, formatDate, formatDuration, ntd, pct } from "./ui";

export const KIND = ["Allocation", "Cap change", "Deadline extension", "Surplus use"];
export const STATUS = [
  "Pending approvals",
  "Public waiting period",
  "Executed",
  "Vetoed by households",
  "Cancelled",
  "Overturned by households on review",
];

export function proposalTitle(p: Proposal, snap: Snapshot) {
  const purposes = snap.fund?.purposes ?? [];
  if (p.kind === 0) return `${ntd(p.amount)} for ${purposes[p.purposeId]?.name ?? "?"}`;
  if (p.kind === 1)
    return `Move cap: ${purposes[p.purposeId]?.name} → ${p.newCapFrom / 100}%, ${purposes[p.toPurposeId]?.name} → ${p.newCapTo / 100}%`;
  if (p.kind === 3) return `${ntd(p.amount)} of the surplus for ${purposes[p.purposeId]?.name ?? "?"}`;
  return `Extend deadline to ${formatDate(p.newDeadline)}`;
}

export function statusTone(status: number) {
  return (["warn", "info", "ok", "bad", "muted", "bad"] as const)[status];
}

/** True while an emergency change's household review is open or waiting to be settled. */
export const reviewPending = (p: Proposal) => p.emergency && p.status === 2 && !!p.vote && !p.reviewConcluded;

export function CharterPanel({ snap }: { snap: Snapshot }) {
  const f = snap.fund!;
  return (
    <Card>
      <SectionTitle kicker="Promise to donors" title="What this money may ever be used for">
        Fixed in the contract when the fund was created. Purposes outside the charter cannot be funded — not now, not after the
        deadline.
      </SectionTitle>
      <div className="space-y-4">
        {f.purposes.map((p) => {
          const cap = (Number(f.totalRaised) * p.capBps) / 10_000;
          return (
            <div key={p.id}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">{p.name}</span>
                <span className="tabular-nums text-muted">
                  {ntd(p.allocated)} of cap {ntd(Math.floor(cap))} <span className="text-xs">({p.capBps / 100}%)</span>
                </span>
              </div>
              <Bar value={Number(p.allocated)} max={cap || 1} tone={Number(p.allocated) > cap ? "bad" : "info"} />
            </div>
          );
        })}
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-ink/5 p-3 sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Surplus rule</dt>
          <dd className="mt-1">{f.surplusRule}</dd>
          <dd className="mt-1 text-xs text-muted">
            Enforced by the contract: after the deadline, money can only go to “{f.purposes[f.surplusPurposeId]?.name}”, and only
            after a public waiting period in which households can veto it.
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Deadline</dt>
          <dd>
            {formatDate(f.deadline)}{" "}
            <span className="text-xs text-muted">
              — never forces spending; an extension waits through the public period and households can veto it
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Committee</dt>
          <dd>
            {f.threshold} of {f.committee.length} to allocate ·{" "}
            {f.emergencyRevoked ? (
              <Badge tone="bad">Emergency path revoked by households</Badge>
            ) : (
              <>
                {f.emergencyThreshold} of {f.committee.length} for emergencies
              </>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Changes to caps, deadline or surplus</dt>
          <dd>
            Public waiting period of {formatDuration(f.timelock)}; households can veto (quorum {f.quorumBps / 100}%)
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-muted">Emergencies</dt>
          <dd>
            May only move cap between charter purposes and apply at once. Households review them afterwards: a veto returns the
            unspent part and revokes the emergency path for this fund.
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Custodian</dt>
          <dd>
            <Addr address={f.custodian} />
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export function custodyTotals(hops: Hop[]) {
  const roots = hops.filter((h) => h.parent === 0);
  const allocated = roots.reduce((a, h) => a + h.amount, 0n);
  const acknowledged = hops.filter((h) => h.ackAt).reduce((a, h) => a + (h.parent === 0 ? h.amount : 0n), 0n);
  const reported = hops.reduce((a, h) => a + h.reconciled, 0n);
  const estHouseholds = roots.reduce((a, h) => a + h.estHouseholds, 0);
  const reportedHouseholds = hops.reduce((a, h) => a + h.reconciledHouseholds, 0);
  const confirmed = hops.reduce((a, h) => a + h.confirmed + h.proxyConfirmed + h.programDelivered, 0);
  const disputed = hops.reduce((a, h) => a + h.disputed, 0);
  return { allocated, acknowledged, reported, estHouseholds, reportedHouseholds, confirmed, disputed };
}

export function FunnelPanel({ snap }: { snap: Snapshot }) {
  const t = custodyTotals(snap.hops);
  const raised = snap.fund?.totalRaised ?? 0n;
  const steps = [
    { label: "Raised", value: raised, note: `${snap.fund?.donations.length ?? 0} donations` },
    { label: "Allocated by committee", value: t.allocated, note: "on-chain transfer" },
    { label: "Receipt acknowledged", value: t.acknowledged, note: "by receiving custodian" },
    { label: "Reported paid to households", value: t.reported, note: `${t.reportedHouseholds} households in committed rosters` },
  ];
  return (
    <Card>
      <SectionTitle kicker="Chain of custody" title="Where the money is, hand by hand">
        Today the public only sees the first hand. Kept follows every tranche until households themselves confirm it arrived.
      </SectionTitle>
      <div className="space-y-3">
        {steps.map((s) => (
          <div key={s.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{s.label}</span>
              <span className="tabular-nums">
                {ntd(s.value)} <span className="text-xs text-muted">{pct(s.value, raised)}%</span>
              </span>
            </div>
            <Bar value={Number(s.value)} max={Number(raised) || 1} />
            <p className="mt-0.5 text-xs text-muted">{s.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-ink/5 p-2">
          <p className="text-lg font-semibold tabular-nums">{t.reportedHouseholds}</p>
          <p className="text-[11px] text-muted">households reported paid</p>
        </div>
        <div className="rounded-lg bg-ok/10 p-2">
          <p className="text-lg font-semibold tabular-nums text-ok">{t.confirmed}</p>
          <p className="text-[11px] text-muted">confirmed by the household (or its proxy)</p>
        </div>
        <div className="rounded-lg bg-bad/10 p-2">
          <p className="text-lg font-semibold tabular-nums text-bad">{t.disputed}</p>
          <p className="text-[11px] text-muted">disputed: “recorded as paid, not received”</p>
        </div>
      </div>
    </Card>
  );
}

export function HopTree({ snap }: { snap: Snapshot }) {
  const children = (id: number) => snap.hops.filter((h) => h.parent === id);
  const roots = children(0);
  if (!roots.length) return <Empty>No allocations yet.</Empty>;
  const Row = ({ h, depth }: { h: Hop; depth: number }) => {
    const remaining = h.amount - h.forwarded - h.reconciled;
    return (
      <>
        <div className="grid gap-2 border-t border-line py-3 text-sm md:grid-cols-[1.4fr_1fr_1.2fr]" style={{ paddingLeft: depth * 20 }}>
          <div>
            <p className="font-medium">
              <span className="text-muted">#{h.id}</span> <Addr address={h.from} /> → <Addr address={h.to} />
            </p>
            <p className="text-xs text-muted">
              {PURPOSES[h.purposeId] ?? `Purpose ${h.purposeId}`} · est. {h.estHouseholds} households · evidence <Hash value={h.evidenceHash} />
            </p>
          </div>
          <div className="tabular-nums">
            <p>{ntd(h.amount)}</p>
            <p className="text-xs text-muted">
              forwarded {ntd(h.forwarded)} · paid {ntd(h.reconciled)} · held {ntd(remaining)}
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-1.5">
            {h.ackAt ? <Badge tone="ok">Acknowledged</Badge> : <Badge tone="warn">Awaiting acknowledgement</Badge>}
            {h.batches.length > 0 && <Badge tone="info">{h.batches.length} roster batch(es)</Badge>}
            {h.confirmed + h.proxyConfirmed > 0 && (
              <Badge tone="ok">
                {h.confirmed + h.proxyConfirmed} confirmed{h.proxyConfirmed ? ` (${h.proxyConfirmed} by proxy)` : ""}
              </Badge>
            )}
            {h.programDelivered > 0 && <Badge tone="ok">{h.programDelivered} handed over in person (ZK-verified)</Badge>}
            {h.disputed > 0 && <Badge tone="bad">{h.disputed} disputed</Badge>}
          </div>
        </div>
        {children(h.id).map((c) => (
          <Row key={c.id} h={c} depth={depth + 1} />
        ))}
      </>
    );
  };
  return (
    <div>
      {roots.map((h) => (
        <Row key={h.id} h={h} depth={0} />
      ))}
    </div>
  );
}

/** k-anonymity: never show exact small counts for a village. */
export const kAnon = (n: number) => (n > 0 && n < 5 ? "<5" : String(n));

export function ExclusionPanel({ snap }: { snap: Snapshot }) {
  const rows = VILLAGES.map((v) => snap.villageStats.find((s) => s.code === v.code)).filter(Boolean);
  return (
    <Card>
      <SectionTitle kicker="Promise to households" title="Who may be left out">
        Appeals and their handling are public per village, so exclusion is visible on day one instead of after a protest. Counts
        under 5 are hidden to protect small villages.
      </SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="py-2 font-medium">Village</th>
              <th className="font-medium">Verified</th>
              <th className="font-medium">Appeals</th>
              <th className="font-medium">Pending</th>
              <th className="font-medium">Accepted / rejected</th>
              <th className="font-medium">Avg. handling</th>
              <th className="font-medium">Verified, no aid yet</th>
              <th className="font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const resolved = s!.appealsAccepted + s!.appealsRejected;
              const flag = s!.appealsPending > 0 && s!.verified === 0;
              return (
                <tr key={s!.code} className={flag ? "border-t border-line bg-bad/5" : "border-t border-line"}>
                  <td className="py-2 font-medium">{villageName(s!.code)}</td>
                  <td className="tabular-nums">{kAnon(s!.verified)}</td>
                  <td className="tabular-nums">{s!.appealsFiled}</td>
                  <td className="tabular-nums">{s!.appealsPending > 0 ? <Badge tone="warn">{s!.appealsPending}</Badge> : 0}</td>
                  <td className="tabular-nums">
                    {s!.appealsAccepted} / {s!.appealsRejected}
                  </td>
                  <td className="tabular-nums">{resolved ? formatDuration(s!.resolutionSecondsTotal / resolved) : "—"}</td>
                  <td className="tabular-nums">{s!.coverageAsOf ? kAnon(s!.unserved) : <span className="text-muted">not reported</span>}</td>
                  <td>{flag && <Badge tone="bad">Possible exclusion</Badge>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function IssuerPanel({ snap }: { snap: Snapshot }) {
  return (
    <Card>
      <SectionTitle kicker="Accountable judgement" title="Who certified whom">
        Eligibility is still decided by people. Kept makes every decision attributable.
      </SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="py-2 font-medium">Issuer</th>
              <th className="font-medium">Proposed</th>
              <th className="font-medium">Approved</th>
              <th className="font-medium">Rejected</th>
              <th className="font-medium">Revoked</th>
              <th className="font-medium">Appeals resolved</th>
            </tr>
          </thead>
          <tbody>
            {[...snap.issuers]
              .sort((a, b) => b.role - a.role)
              .map((i) => (
                <tr key={i.address} className="border-t border-line">
                  <td className="py-2">
                    <span className="font-medium">{i.name}</span>{" "}
                    <Badge tone={i.role === 2 ? "info" : "muted"}>{i.role === 2 ? "Township office" : "Village chief"}</Badge>
                  </td>
                  <td className="tabular-nums">{i.proposed}</td>
                  <td className="tabular-nums">{i.approved}</td>
                  <td className="tabular-nums">{i.rejected}</td>
                  <td className="tabular-nums">{i.revoked}</td>
                  <td className="tabular-nums">{i.appealsResolved}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function ProposalList({ snap, actions }: { snap: Snapshot; actions?: (p: Proposal) => React.ReactNode }) {
  const list = [...(snap.fund?.proposals ?? [])].reverse();
  if (!list.length) return <Empty>No proposals yet.</Empty>;
  return (
    <div className="divide-y divide-line">
      {list.map((p) => {
        const left = p.executeAfter - snap.timestamp;
        return (
          <div key={p.id} className="flex flex-col gap-2 py-3 text-sm md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <p className="font-medium">
                <span className="text-muted">#{p.id}</span> {KIND[p.kind]}: {proposalTitle(p, snap)}
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone={statusTone(p.status)}>{STATUS[p.status]}</Badge>
                {p.emergency && <Badge tone="warn">Emergency path</Badge>}
                {reviewPending(p) && <Badge tone="info">Household review {left > 0 ? "open" : "closed, awaiting settlement"}</Badge>}
                {p.emergency && p.reviewConcluded && p.status === 2 && <Badge tone="ok">Upheld on review</Badge>}
                <span className="text-xs text-muted">
                  {p.approvals} approval(s) · proposed {formatDate(p.createdAt)}
                  {p.kind === 0 && p.recipient && (
                    <>
                      {" "}
                      · to <Addr address={p.recipient} />
                    </>
                  )}
                </span>
              </div>
              {p.vote && (
                <p className="text-xs text-muted">
                  Household vote: <span className="text-ok">{p.vote.yes} yes</span> · <span className="text-bad">{p.vote.no} no</span> ·
                  turnout {pct(p.vote.yes + p.vote.no, p.vote.eligible)}% of {p.vote.eligible} (veto quorum {p.vote.quorumBps / 100}%)
                  {(p.status === 1 || reviewPending(p)) && (left > 0 ? ` · closes in ${formatDuration(left)}` : " · voting closed")}
                  {p.vote.vetoed && <Badge tone="bad">Veto threshold reached</Badge>}
                </p>
              )}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions(p)}</div>}
          </div>
        );
      })}
    </div>
  );
}
