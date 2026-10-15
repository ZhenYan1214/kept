"use client";
import { useState } from "react";
import { useSnapshot } from "@/components/snapshot";
import { ActionButton, Card, Empty, Field, Note, SectionTitle, inputCls, ntd } from "@/components/ui";
import { ProposalList, CharterPanel } from "@/components/panels";
import { tx, postJSON } from "@/lib/api";
import { CHAIN_ID } from "@/lib/config";
import { textHash } from "@/lib/scopes";
import { ROLES, type RoleName } from "@/lib/scenario";

const MEMBERS: RoleName[] = ["c1", "c2", "c3"];
const RECIPIENTS: RoleName[] = ["ministry", "county", "ngo"];
const NOT_IN_CHARTER = 255;

export default function CommitteePage() {
  const { snap, roles } = useSnapshot();
  const [member, setMember] = useState<RoleName>("c1");
  if (!snap?.fund) return <Empty>Set up the scenario first.</Empty>;
  const f = snap.fund;
  const me = roles[member]?.toLowerCase();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Fund committee</p>
          <h1 className="text-2xl font-semibold">Decisions, under the charter</h1>
          <p className="max-w-2xl text-sm text-muted">
            The committee can only act inside the promises made when the money was raised. Balance available:{" "}
            <strong>{ntd(f.balance)}</strong>.
          </p>
        </div>
        <Field label="Acting as">
          <select className={inputCls} value={member} onChange={(e) => setMember(e.target.value as RoleName)}>
            {MEMBERS.map((m) => (
              <option key={m} value={m}>
                {ROLES[m].label}
              </option>
            ))}
          </select>
        </Field>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Allocate member={member} />
        <CapChange member={member} />
        <Extension member={member} />
      </div>

      <Card>
        <SectionTitle title="Proposals" />
        <ProposalList
          snap={snap}
          actions={(p) => (
            <>
              {p.status === 0 && !p.approvedBy.some((a) => a.toLowerCase() === me) && (
                <ActionButton onClick={() => tx(member, "fund", "approve", [BigInt(p.id)], f.address)}>Approve</ActionButton>
              )}
              {p.status === 1 && (
                <ActionButton
                  variant="secondary"
                  disabled={snap.timestamp < p.executeAfter}
                  onClick={() => tx(member, "fund", "execute", [BigInt(p.id)], f.address)}
                >
                  Execute
                </ActionButton>
              )}
              {p.vote && p.vote.closesAt > snap.timestamp && (
                <>
                  <ActionButton variant="secondary" onClick={() => postJSON("/api/sim/vote", { voteKey: p.vote!.key, no: 3 })}>
                    Demo: 3 neighbours vote no
                  </ActionButton>
                  <ActionButton variant="secondary" onClick={() => postJSON("/api/sim/vote", { voteKey: p.vote!.key, yes: 3 })}>
                    Demo: 3 vote yes
                  </ActionButton>
                </>
              )}
              {p.status === 1 && CHAIN_ID === 31337 && snap.timestamp < p.executeAfter && (
                <ActionButton variant="secondary" onClick={() => postJSON("/api/dev/time", { seconds: p.executeAfter - snap.timestamp + 1 })}>
                  Devnet: skip waiting period
                </ActionButton>
              )}
              {(p.status === 0 || p.status === 1) && p.proposer.toLowerCase() === me && (
                <ActionButton variant="secondary" onClick={() => tx(member, "fund", "cancel", [BigInt(p.id)], f.address)}>
                  Cancel
                </ActionButton>
              )}
            </>
          )}
        />
      </Card>

      <CharterPanel snap={snap} />
    </div>
  );
}

function Allocate({ member }: { member: RoleName }) {
  const { snap, roles } = useSnapshot();
  const f = snap!.fund!;
  const [purpose, setPurpose] = useState(0);
  const [to, setTo] = useState<RoleName>("ministry");
  const [amount, setAmount] = useState(500_000);
  const [est, setEst] = useState(10);
  const [note, setNote] = useState("Pre-allocation, batch 2");
  return (
    <Card>
      <SectionTitle title="Allocate money" />
      <div className="space-y-3">
        <Field label="Purpose">
          <select className={inputCls} value={purpose} onChange={(e) => setPurpose(Number(e.target.value))}>
            {f.purposes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value={NOT_IN_CHARTER}>General public works (not in charter)</option>
          </select>
        </Field>
        <Field label="To custodian">
          <select className={inputCls} value={to} onChange={(e) => setTo(e.target.value as RoleName)}>
            {RECIPIENTS.map((r) => (
              <option key={r} value={r}>
                {ROLES[r].label}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (NT$)">
            <input type="number" className={inputCls} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </Field>
          <Field label="Est. households">
            <input type="number" className={inputCls} value={est} onChange={(e) => setEst(Number(e.target.value))} />
          </Field>
        </div>
        <Field label="Note (fingerprint goes on-chain)">
          <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <ActionButton
          onClick={() =>
            tx(member, "fund", "proposeAllocation", [purpose, roles[to]!, BigInt(amount), est, textHash(note)], f.address)
          }
        >
          Propose
        </ActionButton>
        <p className="text-xs text-muted">Executes as soon as {f.threshold} members approve.</p>
      </div>
    </Card>
  );
}

function CapChange({ member }: { member: RoleName }) {
  const { snap } = useSnapshot();
  const f = snap!.fund!;
  const [from, setFrom] = useState(2);
  const [toId, setToId] = useState(1);
  const [capFrom, setCapFrom] = useState(f.purposes[2]?.capBps / 100 - 5);
  const [capTo, setCapTo] = useState(f.purposes[1]?.capBps / 100 + 5);
  const [emergency, setEmergency] = useState(false);
  const [note, setNote] = useState("Repairs cost more than expected");
  return (
    <Card>
      <SectionTitle title="Change caps" />
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Take from">
            <select className={inputCls} value={from} onChange={(e) => setFrom(Number(e.target.value))}>
              {f.purposes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.capBps / 100}%)
                </option>
              ))}
            </select>
          </Field>
          <Field label="Give to">
            <select className={inputCls} value={toId} onChange={(e) => setToId(Number(e.target.value))}>
              {f.purposes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.capBps / 100}%)
                </option>
              ))}
            </select>
          </Field>
          <Field label="New cap (from) %">
            <input type="number" className={inputCls} value={capFrom} onChange={(e) => setCapFrom(Number(e.target.value))} />
          </Field>
          <Field label="New cap (to) %">
            <input type="number" className={inputCls} value={capTo} onChange={(e) => setCapTo(Number(e.target.value))} />
          </Field>
        </div>
        <Field label="Reason (fingerprint goes on-chain)">
          <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={emergency} onChange={(e) => setEmergency(e.target.checked)} />
          Emergency (needs {f.emergencyThreshold} of {f.committee.length}, applies at once, households review afterwards)
        </label>
        <ActionButton
          onClick={() =>
            tx(
              member,
              "fund",
              "proposeCapChange",
              [from, toId, Math.round(capFrom * 100), Math.round(capTo * 100), emergency, textHash(note)],
              f.address,
            )
          }
        >
          Propose
        </ActionButton>
      </div>
    </Card>
  );
}

function Extension({ member }: { member: RoleName }) {
  const { snap } = useSnapshot();
  const f = snap!.fund!;
  const [days, setDays] = useState(180);
  const [note, setNote] = useState("Housing reconstruction needs another season");
  return (
    <Card>
      <SectionTitle title="Extend the deadline" />
      <div className="space-y-3">
        <Note tone="muted">
          <span className="text-xs">
            The fund never forces money out at the deadline. Unspent money stays locked until households accept an extension.
          </span>
        </Note>
        <Field label="Extend by (days)">
          <input type="number" className={inputCls} value={days} onChange={(e) => setDays(Number(e.target.value))} />
        </Field>
        <Field label="Public reason (fingerprint on-chain)">
          <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <ActionButton
          onClick={() => tx(member, "fund", "proposeExtension", [BigInt(f.deadline + days * 86400), textHash(note)], f.address)}
        >
          Propose
        </ActionButton>
      </div>
    </Card>
  );
}
