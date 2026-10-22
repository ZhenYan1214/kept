"use client";
import type { Hop, Proposal, Snapshot } from "@/lib/snapshot";
import { villageName, VILLAGES, PURPOSES } from "@/lib/scenario";
import { computeAlerts, RULES } from "@/lib/alerts";
import { CONFIDENCE, summarizeAudit } from "@/lib/audit";
import { postJSON } from "@/lib/api";
import { DEMO_MODE } from "@/lib/config";
import { ActionButton, Addr, Badge, Bar, Card, Empty, Hash, SectionTitle, cx, formatDate, formatDuration, ntd, pct } from "./ui";
import { Icon } from "./icons";

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
        <div className="rounded-md border border-line bg-sunk/50 p-4 sm:col-span-2">
          <dt className="eyebrow flex items-center gap-2">
            <Icon.Seal className="h-3.5 w-3.5 text-seal" /> Surplus rule, fixed at fundraising
          </dt>
          <dd className="mt-2 font-serif text-[17px] leading-snug">{f.surplusRule}</dd>
          <dd className="mt-1 text-xs text-muted">
            Enforced by the contract: after the deadline, money can only go to “{f.purposes[f.surplusPurposeId]?.name}”, and only
            after a public waiting period in which households can veto it.
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Deadline</dt>
          <dd>
            {formatDate(f.deadline)}{" "}
            <span className="text-xs text-muted">
              — never forces spending; an extension waits through the public period and households can veto it
            </span>
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Committee</dt>
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
          <dt className="eyebrow">Changes to caps, deadline or surplus</dt>
          <dd>
            Public waiting period of {formatDuration(f.timelock)}; households can veto (quorum {f.quorumBps / 100}%)
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="eyebrow">Emergencies</dt>
          <dd>
            May only move cap between charter purposes and apply at once. Households review them afterwards: a veto returns the
            unspent part and revokes the emergency path for this fund.
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Custodian</dt>
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
    { label: "Raised", value: raised, note: `${snap.fund?.donationCount ?? 0} donations` },
    { label: "Allocated by committee", value: t.allocated, note: "on-chain transfer" },
    { label: "Receipt acknowledged", value: t.acknowledged, note: "by receiving custodian" },
    { label: "Reported paid to households", value: t.reported, note: `${t.reportedHouseholds} households in published rosters` },
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
      <div className="mt-6 grid grid-cols-3 border-t border-line pt-4">
        {[
          [t.reportedHouseholds, "households reported paid", "text-ink"],
          [t.confirmed, "confirmed by the household (or its proxy)", "text-ok"],
          [t.disputed, "disputed: “recorded as paid, not received”", "text-bad"],
        ].map(([n, label, color], i) => (
          <div key={i} className={cx("pr-3", i > 0 && "border-l border-line pl-4")}>
            <p className={cx("font-serif text-3xl leading-none tabular-nums", color as string)}>{n}</p>
            <p className="mt-1.5 text-xs leading-snug text-muted">{label}</p>
          </div>
        ))}
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
        <div className="grid gap-2 border-t border-line py-4 text-sm md:grid-cols-[1.4fr_1fr_1.2fr]" style={{ paddingLeft: depth * 28 }}>
          <div className="relative">
            {depth > 0 && (
              <span aria-hidden className="absolute -left-5 -top-4 h-7 w-3.5 rounded-bl-md border-b border-l border-ink/30" />
            )}
            <p className="flex flex-wrap items-center gap-1.5 font-medium">
              <span className="font-mono text-xs text-muted">#{h.id}</span> <Addr address={h.from} />
              <Icon.Arrow className="h-3.5 w-3.5 text-muted" /> <Addr address={h.to} />
            </p>
            <p className="text-xs text-muted">
              {PURPOSES[h.purposeId] ?? `Purpose ${h.purposeId}`} · est. {h.estHouseholds} households · evidence <Hash value={h.evidenceHash} />
            </p>
          </div>
          <div className="tabular-nums">
            <p className="font-mono text-[15px]">{ntd(h.amount)}</p>
            <p className="text-xs text-muted">
              forwarded {ntd(h.forwarded)} · paid {ntd(h.reconciled)} · held {ntd(remaining)}
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-1.5">
            {h.ackAt ? <Badge tone="ok">Acknowledged</Badge> : <Badge tone="warn">Awaiting acknowledgement</Badge>}
            {h.batches.length > 0 && <Badge tone="info">{h.batches.length} published roster batch(es)</Badge>}
            {h.confirmed + h.proxyConfirmed > 0 && (
              <Badge tone="ok">
                {h.confirmed + h.proxyConfirmed} confirmed{h.proxyConfirmed ? ` (${h.proxyConfirmed} by proxy)` : ""}
              </Badge>
            )}
            {h.programDelivered > 0 && <Badge tone="ok">{h.programDelivered} handed over in person (ZK-verified)</Badge>}
            {h.disputed > 0 && <Badge tone="bad">{h.disputed} disputed</Badge>}
            {h.unregistered > 0 && <Badge tone="bad">{h.unregistered} line(s) not a registered household</Badge>}
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

/**
 * Sample audits: for each published batch a random sample, seeded by a block fixed at publication, is
 * visited in person by an independent auditor. Every sampled line not confirmed in person counts as bad.
 */
export function AuditPanel({ snap }: { snap: Snapshot }) {
  const rows = snap.hops.flatMap((h) => h.batches.map((b) => ({ h, b, s: summarizeAudit(b.households, b.audit) })));
  return (
    <Card>
      <SectionTitle kicker="No need to wait for everyone" title="Sample audits">
        Not every household will answer, and colluding officials could register households that do not exist. So for each
        published batch the contract draws a random sample of lines, seeded by a block fixed when the batch was published, so
        nobody can choose which lines get checked. An independent auditor visits those households in person: each signs the
        visit with its own key, or the auditor records, under its own name, that nobody lives at the registered address. From
        the visits anyone can compute how many lines of the whole batch could be undelivered ({Math.round(CONFIDENCE * 100)}%
        confidence; lines not yet visited count as undelivered).
      </SectionTitle>
      {rows.length === 0 ? (
        <Empty>No payment batches published yet.</Empty>
      ) : (
        <div className="divide-y divide-line">
          {rows.map(({ h, b, s }) => (
            <div key={`${h.id}-${b.index}`} className="grid gap-3 py-3 text-sm md:grid-cols-[1.1fr_1.4fr_1.2fr]">
              <div>
                <p className="font-medium">
                  Tranche #{h.id} · batch {b.index}
                </p>
                <p className="text-xs text-muted">
                  {b.households} lines · {ntd(b.amount)} · sample of {s.sample}
                </p>
                {s.drawn && (
                  <p className="text-xs text-muted">
                    seeded by block {b.auditSeedBlock}
                    {b.auditSeedBlock > b.atBlock + 2 ? " (drawn late)" : " (fixed at publication)"}
                  </p>
                )}
              </div>
              <div>
                {!s.drawn ? (
                  <p className="text-muted">Sample not drawn yet.</p>
                ) : (
                  <>
                    <div className="mb-2 flex flex-wrap gap-1" aria-label="Sampled lines">
                      {b.audit.map((p) => (
                        <span
                          key={p.receipt}
                          title={["not visited yet", "received, signed in person", "not received", "nobody at the address"][p.outcome]}
                          className={cx(
                            "grid h-6 w-6 place-items-center rounded-[4px] border",
                            p.outcome === 1 && "border-ok/40 bg-ok/10 text-ok",
                            (p.outcome === 2 || p.outcome === 3) && "border-bad/40 bg-bad/10 text-bad",
                            p.outcome === 0 && "border-dashed border-line text-muted",
                          )}
                        >
                          {p.outcome === 1 ? <Icon.Check className="h-3.5 w-3.5" /> : p.outcome ? <Icon.Cross className="h-3 w-3" /> : null}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge tone="ok">{s.received} received, signed in person</Badge>
                      {s.notReceived > 0 && <Badge tone="bad">{s.notReceived} not received</Badge>}
                      {s.notFound > 0 && <Badge tone="bad">{s.notFound} nobody at the address</Badge>}
                      {s.pending > 0 && <Badge tone="warn">{s.pending} not visited yet</Badge>}
                    </div>
                    <p className="mt-1.5 text-xs text-muted">
                      {s.complete ? "Audit complete." : "Audit in progress; the bound tightens as visits are recorded."} At most{" "}
                      <span className="font-semibold text-ink">
                        {s.maxBad} of {s.lines} lines ({Math.round(s.maxBadShare * 100)}%)
                      </span>{" "}
                      could be undelivered.
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-start gap-2">
                {!s.drawn && DEMO_MODE && (
                  <ActionButton variant="secondary" onClick={() => postJSON("/api/sim/audit", { hopId: h.id, batchIndex: b.index, action: "draw" })}>
                    Draw the sample
                  </ActionButton>
                )}
                {s.drawn && !s.complete && DEMO_MODE && (
                  <ActionButton variant="secondary" onClick={() => postJSON("/api/sim/audit", { hopId: h.id, batchIndex: b.index, action: "visit" })}>
                    Demo: auditor visits the sampled households
                  </ActionButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/** k-anonymity: never show exact small counts for a village. */
export const kAnon = (n: number) => (n > 0 && n < 5 ? "<5" : String(n));

export function ExclusionPanel({ snap }: { snap: Snapshot }) {
  const rows = VILLAGES.map((v) => snap.villageStats.find((s) => s.code === v.code)).filter(Boolean);
  return (
    <Card>
      <SectionTitle kicker="Promise to households" title="Who may be left out">
        Appeals and their handling are public per village, so exclusion is visible on day one instead of after a protest. Verified
        households can also report anonymously, once a week, that they are still waiting: that count does not depend on any
        custodian recording anything. Counts under 5 are hidden on this page; see the limitations for what the chain itself shows.
      </SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="eyebrow border-b border-ink/60 text-left">
              <th className="py-2 font-medium">Village</th>
              <th className="font-medium">Verified</th>
              <th className="font-medium">Appeals</th>
              <th className="font-medium">Pending</th>
              <th className="font-medium">Accepted / rejected</th>
              <th className="font-medium">Avg. handling</th>
              <th className="font-medium">Verified, no aid yet</th>
              <th className="font-medium" title="Anonymous reports by verified households, this week / last week">
                Still waiting (households say)
              </th>
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
                  <td className="tabular-nums">
                    {kAnon(s!.waitingNow)} <span className="text-xs text-muted">/ {kAnon(s!.waitingLast)}</span>
                  </td>
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
            <tr className="eyebrow border-b border-ink/60 text-left">
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

export function AlertsPanel({ snap }: { snap: Snapshot }) {
  const alerts = computeAlerts(snap);
  return (
    <Card>
      <SectionTitle kicker={`Where to look · ${alerts.length} alert${alerts.length === 1 ? "" : "s"}`} title="Accountability alerts">
        Simple published rules over the public record: acknowledgement within {RULES.ackDays} days, money not held for more than{" "}
        {RULES.heldDays} days, appeals answered within {RULES.appealDays} days, households&apos; own reports. They show where to
        look, not who is to blame.
      </SectionTitle>
      {alerts.length === 0 ? (
        <Empty>No alerts.</Empty>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {alerts.map((a, i) => (
            <li key={i} className="flex gap-3 py-3 text-sm">
              <span
                className={cx(
                  "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                  a.tone === "bad" ? "bg-bad/10 text-bad" : a.tone === "warn" ? "bg-warn/12 text-warn" : "bg-accent/10 text-accent",
                )}
              >
                {a.tone === "info" ? <Icon.Info className="h-3.5 w-3.5" /> : <Icon.Alert className="h-3.5 w-3.5" />}
              </span>
              <span>
                <span className="block font-medium text-ink">{a.rule}</span>
                <span className="block text-muted">{a.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
