"use client";
import { useEffect, useState } from "react";
import { useSnapshot } from "@/components/snapshot";
import { ActionButton, Addr, Badge, Card, Empty, Field, Note, SectionTitle, inputCls, ntd, NotReady, PageHeader } from "@/components/ui";
import { HopTree } from "@/components/panels";
import { tx } from "@/lib/api";
import { textHash } from "@/lib/scopes";
import { PURPOSES, ROLES, TIERS, villageName, type RoleName } from "@/lib/scenario";
import { loadRoster, type RosterEntry } from "@/lib/roster";
import type { Hop } from "@/lib/snapshot";

const CUSTODIANS: RoleName[] = ["ministry", "county", "ngo"];

export default function CustodyPage() {
  const { snap, roles } = useSnapshot();
  const [me, setMe] = useState<RoleName>("ministry");
  if (!snap?.fund) return <NotReady />;
  const addr = roles[me]?.toLowerCase();
  const mine = snap.hops.filter((h) => h.to.toLowerCase() === addr);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Role · Custodians"
        kind="sim"
        title="Every hand signs for what it holds"
        aside={
          <Field label="Acting as">
            <select className={inputCls} value={me} onChange={(e) => setMe(e.target.value as RoleName)}>
              {CUSTODIANS.map((c) => (
                <option key={c} value={c}>
                  {ROLES[c].label}
                </option>
              ))}
            </select>
          </Field>
        }
      >
        Acknowledge what you received, record what you pass on, and publish each payment batch as pseudonymous lines (a
        receipt address and an amount, never a name). Every household can then find its own line without asking you.
      </PageHeader>

      {mine.length === 0 ? (
        <Empty>No tranches held by {ROLES[me].short} yet.</Empty>
      ) : (
        <div className="space-y-4">
          {mine.map((h) => (
            <HopCard key={h.id} h={h} me={me} />
          ))}
        </div>
      )}

      <Card>
        <SectionTitle title="Full custody tree (public)" />
        <HopTree snap={snap} />
      </Card>
    </div>
  );
}

function HopCard({ h, me }: { h: Hop; me: RoleName }) {
  const held = h.amount - h.forwarded - h.reconciled;
  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xl font-semibold">
            Tranche #{h.id}: {ntd(h.amount)} · {PURPOSES[h.purposeId]}
          </p>
          <p className="text-sm text-muted">
            from <Addr address={h.from} /> · est. {h.estHouseholds} households · still held {ntd(held)}
          </p>
        </div>
        {h.ackAt ? <Badge tone="ok">Acknowledged</Badge> : <Badge tone="warn">Not acknowledged</Badge>}
      </div>
      {!h.ackAt ? (
        <ActionButton onClick={() => tx(me, "ledger", "acknowledge", [BigInt(h.id)])}>Acknowledge receipt</ActionButton>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Forward h={h} me={me} held={held} />
          <Reconcile h={h} me={me} held={held} />
        </div>
      )}
    </Card>
  );
}

function Forward({ h, me, held }: { h: Hop; me: RoleName; held: bigint }) {
  const { roles } = useSnapshot();
  const options = (["county", "ngo", "ministry"] as RoleName[]).filter((r) => r !== me);
  const [to, setTo] = useState<RoleName>(options[0]);
  const [amount, setAmount] = useState(100_000);
  const [est, setEst] = useState(5);
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Pass on to the next custodian</p>
      <div className="grid grid-cols-3 gap-2">
        <select className={inputCls} value={to} onChange={(e) => setTo(e.target.value as RoleName)}>
          {options.map((r) => (
            <option key={r} value={r}>
              {ROLES[r].short}
            </option>
          ))}
        </select>
        <input type="number" className={inputCls} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <input type="number" className={inputCls} value={est} onChange={(e) => setEst(Number(e.target.value))} title="est. households" />
      </div>
      <ActionButton
        variant="secondary"
        disabled={held === 0n}
        onClick={() => tx(me, "ledger", "forward", [BigInt(h.id), roles[to]!, BigInt(amount), est, textHash(`bank slip ${Date.now()}`)])}
      >
        Record transfer
      </ActionButton>
    </div>
  );
}

function Reconcile({ h, me, held }: { h: Hop; me: RoleName; held: bigint }) {
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [amount, setAmount] = useState(50_000);
  const { snap } = useSnapshot();
  useEffect(() => {
    const update = () => setRoster(loadRoster());
    update();
    window.addEventListener("kept-inbox", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("kept-inbox", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  const verified = roster.filter((e) => snap?.registrations.some((r) => r.commitment.toString() === e.commitment && r.status === 2));
  const chosen = verified.filter((e) => picked[e.commitment]);
  const total = BigInt(amount) * BigInt(chosen.length);
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Report a payment batch</p>
      {verified.length === 0 ? (
        <Note tone="muted">
          <span className="text-xs">
            No live households on the township roster yet. Register one via the Household and Village &amp; township screens.
          </span>
        </Note>
      ) : (
        <div className="space-y-1">
          {verified.map((e) => (
            <label key={e.commitment} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!picked[e.commitment]} onChange={(ev) => setPicked({ ...picked, [e.commitment]: ev.target.checked })} />
              {e.label} · {villageName(e.village)} · {TIERS[e.tier]}
            </label>
          ))}
        </div>
      )}
      <Field label="Amount per household (NT$)">
        <input type="number" className={inputCls} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </Field>
      <ActionButton
        disabled={!chosen.length || total > held}
        onClick={() =>
          tx(me, "ledger", "reconcile", [
            BigInt(h.id),
            chosen.map((e) => e.receipt),
            chosen.map(() => BigInt(amount)),
            textHash(`roster ${Date.now()}`),
          ])
        }
      >
        Publish payment lines ({ntd(total)})
      </ActionButton>
      <p className="text-xs text-muted">
        The contract adds up the lines itself and publicly counts any line that is not a registered household.
      </p>
    </div>
  );
}
