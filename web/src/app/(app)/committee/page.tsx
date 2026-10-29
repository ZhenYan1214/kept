"use client";
import { useState } from "react";
import { useSnapshot } from "@/components/snapshot";
import { ActionButton, Card, Field, Note, SectionTitle, formatDate, formatDuration, inputCls, ntd, NotReady, PageHeader } from "@/components/ui";
import { ProposalList, CharterPanel, reviewPending } from "@/components/panels";
import { tx, postJSON } from "@/lib/api";
import { CHAIN_ID } from "@/lib/config";
import { textHash } from "@/lib/scopes";
import { ROLES, type RoleName } from "@/lib/scenario";
import { publicClient } from "@/lib/chain";
import { fundAbi } from "@/generated/contracts";
import { setDemoFlag } from "@/components/demo-guide";
import { Icon } from "@/components/icons";

const MEMBERS: RoleName[] = ["c1", "c2", "c3"];
const RECIPIENTS: RoleName[] = ["ministry", "county", "ngo"];
const NOT_IN_CHARTER = 255;

export default function CommitteePage() {
  const { snap, roles } = useSnapshot();
  const [member, setMember] = useState<RoleName>("c1");
  if (!snap?.fund) return <NotReady />;
  const f = snap.fund;
  const me = roles[member]?.toLowerCase();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Role · Fund committee"
        kind="sim"
        title="Decisions, under the charter"
        aside={
          <Field label="Signing as">
            <select className={inputCls} value={member} onChange={(e) => setMember(e.target.value as RoleName)}>
              {MEMBERS.map((m) => (
                <option key={m} value={m}>
                  {ROLES[m].label}
                </option>
              ))}
            </select>
          </Field>
        }
      >
        The committee can only act inside the promises made when the money was raised. Balance available:{" "}
        <strong>{ntd(f.balance)}</strong>.
      </PageHeader>

      <BreakCharter />

      <div className="grid gap-6 lg:grid-cols-2">
        <Allocate member={member} />
        <CapChange member={member} />
        <Extension member={member} />
        <Surplus member={member} />
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
              {reviewPending(p) && (
                <ActionButton
                  variant="secondary"
                  disabled={snap.timestamp < p.executeAfter}
                  onClick={() => tx(member, "fund", "concludeReview", [BigInt(p.id)], f.address)}
                >
                  Settle household review
                </ActionButton>
              )}
              {(p.status === 1 || reviewPending(p)) && CHAIN_ID === 31337 && snap.timestamp < p.executeAfter && (
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
          <input
            type="checkbox"
            checked={emergency}
            disabled={f.emergencyRevoked}
            onChange={(e) => setEmergency(e.target.checked)}
          />
          {f.emergencyRevoked
            ? "Emergency path revoked: households overturned an earlier emergency change"
            : `Emergency (needs ${f.emergencyThreshold} of ${f.committee.length}, applies at once; must only move cap; a household veto on review returns the unspent part and revokes this path)`}
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
            The fund never forces money out at the deadline. An extension waits through the public period ({formatDuration(f.timelock)})
            and goes ahead unless households veto it.
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

function Surplus({ member }: { member: RoleName }) {
  const { snap, roles } = useSnapshot();
  const f = snap!.fund!;
  const [to, setTo] = useState<RoleName>("county");
  const [amount, setAmount] = useState(1_000_000);
  const [est, setEst] = useState(30);
  const [note, setNote] = useState("Rebuild the Datong community kitchen");
  const open = snap!.timestamp <= f.deadline;
  return (
    <Card>
      <SectionTitle title="Use the surplus" />
      <div className="space-y-3">
        <Note tone="muted">
          <span className="text-xs">
            After the deadline ({formatDate(f.deadline)}), unspent money may only go to “{f.purposes[f.surplusPurposeId]?.name}”,
            after a public waiting period in which households can veto it. No other purpose can receive it.
          </span>
        </Note>
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
        <Field label="Public reason (fingerprint on-chain)">
          <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            disabled={open}
            onClick={() => tx(member, "fund", "proposeSurplus", [roles[to]!, BigInt(amount), est, textHash(note)], f.address)}
          >
            Propose
          </ActionButton>
          {open && CHAIN_ID === 31337 && (
            <ActionButton variant="secondary" onClick={() => postJSON("/api/dev/time", { seconds: f.deadline - snap!.timestamp + 1 })}>
              Devnet: jump past the deadline
            </ActionButton>
          )}
        </div>
        {open && <p className="text-xs text-muted">Available after the deadline.</p>}
      </div>
    </Card>
  );
}

/**
 * The quickest proof that the charter binds: ask the fund, as a committee member, to pay for something the
 * charter never listed. The call is only simulated, so nothing is written; the contract's own refusal is the result.
 */
function BreakCharter() {
  const { snap } = useSnapshot();
  const f = snap!.fund!;
  const [state, setState] = useState<"idle" | "busy" | "refused" | string>("idle");
  const amount = 500_000;
  const tryIt = async () => {
    setState("busy");
    try {
      await publicClient.simulateContract({
        address: f.address,
        abi: fundAbi,
        functionName: "proposeAllocation",
        args: [NOT_IN_CHARTER, f.custodian, BigInt(amount), 10, textHash("General public works")],
        account: f.committee[0],
      });
      setState("The contract accepted it. That should not happen; please report it.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("PurposeNotInCharter")) {
        setState("refused");
        setDemoFlag("triedCharter");
      } else setState(msg.slice(0, 200));
    }
  };
  return (
    <Card className="border-seal/30">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="min-w-0 flex-[1_1_380px]">
          <p className="mb-1 text-[13px] font-medium text-coral-ink">Try it</p>
          <h2 className="text-lg font-semibold leading-snug text-ink md:text-xl">Try to spend outside the charter</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            The charter lists what this money was raised for. As a committee member, ask the fund to pay {ntd(amount)} for
            “General public works”, which it never listed.
          </p>
        </div>
        {state === "refused" ? (
          <div className="pop flex max-w-sm items-start gap-3 rounded-lg bg-ok/10 px-4 py-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ok text-on-ink">
              <Icon.Shield className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm text-ink">
              <strong className="font-semibold">Refused by the contract.</strong>{" "}
              <span className="text-muted">
                PurposeNotInCharter. The fund has no way to add a purpose once the money is raised. Nothing was spent.
              </span>
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={tryIt}
            disabled={state === "busy"}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {state === "busy" && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
            Try it
          </button>
        )}
      </div>
      {state !== "idle" && state !== "busy" && state !== "refused" && <p className="mt-3 text-xs text-bad">{state}</p>}
    </Card>
  );
}
