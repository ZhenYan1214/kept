"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Address, Hex } from "viem";
import { useSnapshot } from "@/components/snapshot";
import { ActionButton, Badge, Card, Empty, Field, Note, SectionTitle, inputCls, ntd } from "@/components/ui";
import { proposalTitle } from "@/components/panels";
import {
  cardIdentity,
  cardReceipt,
  clearCard,
  loadCard,
  newCard,
  registrationPayload,
  saveCard,
  type HouseholdCard,
} from "@/lib/household";
import { findTier, proveMembership } from "@/lib/semaphore";
import { postInbox, useInbox } from "@/lib/inbox";
import { tx } from "@/lib/api";
import { lineKey, programScope, textHash, voteScope } from "@/lib/scopes";
import { getDeployment } from "@/lib/config";
import { publicClient } from "@/lib/chain";
import { ledgerAbi, voiceAbi } from "@/generated/contracts";
import { receiptDomain, RECEIPT_TYPES } from "@/lib/receipt";
import { TIERS, VILLAGES, tierName } from "@/lib/scenario";
import type { RosterProof } from "@/lib/roster";
import { toJSONSafe } from "@/lib/serialize";

export default function HouseholdPage() {
  const [card, setCard] = useState<HouseholdCard | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setCard(loadCard());
    setReady(true);
  }, []);
  if (!ready) return null;
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Household device</p>
        <h1 className="text-2xl font-semibold">My relief credential</h1>
        <p className="max-w-2xl text-sm text-muted">
          Your credential stays on this phone (or a printed card). It proves you are a verified household without saying which
          one. Nothing personal ever goes on-chain, and you never need crypto or gas.
        </p>
      </header>
      {card ? <WithCard card={card} onReset={() => (clearCard(), setCard(null))} /> : <CreateCard onCreate={(c) => (saveCard(c), setCard(c))} />}
      <AppealCard />
    </div>
  );
}

function CreateCard({ onCreate }: { onCreate: (c: HouseholdCard) => void }) {
  const [label, setLabel] = useState("Household Chen (sim)");
  const [imported, setImported] = useState("");
  return (
    <Card>
      <SectionTitle title="Get a credential">
        In the field a social worker or the village chief can create this with you, or hand you a printed card.
      </SectionTitle>
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <Field label="Label (simulated, stays on this device)">
          <input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <ActionButton onClick={async () => onCreate(newCard(label))}>Create credential</ActionButton>
      </div>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-muted">Restore from a card (paste card data)</summary>
        <div className="mt-2 flex flex-col gap-2">
          <textarea className={inputCls} rows={3} value={imported} onChange={(e) => setImported(e.target.value)} />
          <ActionButton variant="secondary" onClick={async () => onCreate(JSON.parse(imported))}>
            Restore
          </ActionButton>
        </div>
      </details>
    </Card>
  );
}

function WithCard({ card, onReset }: { card: HouseholdCard; onReset: () => void }) {
  const { snap } = useSnapshot();
  const identity = useMemo(() => cardIdentity(card), [card]);
  const receipt = useMemo(() => cardReceipt(card), [card]);
  const [tier, setTier] = useState<number | null | undefined>(undefined);
  const [showSecret, setShowSecret] = useState(false);
  const tierKey = snap?.disaster?.tiers.map((t) => t.groupId.toString()).join(",") ?? "";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tiers = useMemo(() => snap?.disaster?.tiers ?? [], [tierKey]);
  const verifiedCount = snap?.disaster?.verified;

  const checkTier = useCallback(async () => {
    if (!tiers.length) return;
    setTier(await findTier(identity, tiers));
  }, [identity, tiers]);
  useEffect(() => {
    checkTier();
  }, [checkTier, verifiedCount]);

  const reg = registrationPayload(card);
  const pending = snap?.registrations.find((r) => r.commitment.toString() === reg.commitment && r.status === 1);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Card>
          <SectionTitle kicker={card.label} title="Status" />
          {tier === undefined ? (
            <p className="text-sm text-muted">Checking verified groups…</p>
          ) : tier === null ? (
            <div className="space-y-3">
              <Badge tone={pending ? "info" : "warn"}>{pending ? "Waiting for second signature" : "Not registered yet"}</Badge>
              <p className="text-sm text-muted">
                Show this code to your village chief or township office. It contains only public data: a commitment and a receipt
                address.
              </p>
              <div className="w-fit rounded-lg bg-white p-3 ring-1 ring-line">
                <QRCodeSVG value={JSON.stringify(reg)} size={168} />
              </div>
              <ActionButton
                variant="secondary"
                onClick={async () => {
                  postInbox("registration", reg);
                }}
              >
                Simulate: chief scans this code
              </ActionButton>
            </div>
          ) : (
            <div className="space-y-2">
              <Badge tone="ok">Verified household · {tierName(tier)}</Badge>
              <p className="text-sm text-muted">
                You are one of {snap?.disaster?.verified} verified households. Programmes and votes below can check this without
                learning who you are.
              </p>
            </div>
          )}
          <div className="mt-5 border-t border-line pt-4 text-sm">
            <button className="text-muted underline" onClick={() => setShowSecret((s) => !s)}>
              {showSecret ? "Hide" : "Show"} printable card (contains your secret)
            </button>
            {showSecret && (
              <div className="mt-3 space-y-2">
                <Note tone="warn">Anyone holding this card can act as your household. Keep it like a bank card.</Note>
                <div className="w-fit rounded-lg bg-white p-3 ring-1 ring-line">
                  <QRCodeSVG value={JSON.stringify(card)} size={168} />
                </div>
                <button
                  className="text-xs text-accent underline"
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(card))}
                >
                  Copy card data
                </button>
              </div>
            )}
            <div className="mt-3">
              <button className="text-xs text-bad underline" onClick={onReset}>
                Remove credential from this device
              </button>
            </div>
          </div>
        </Card>
        <div className="space-y-6">
          <Programmes identityTier={tier} card={card} />
          <Votes card={card} registered={tier !== null && tier !== undefined} />
        </div>
      </div>
      <Payments receipt={receipt.address} card={card} />
    </>
  );
}

function Programmes({ identityTier, card }: { identityTier: number | null | undefined; card: HouseholdCard }) {
  const { snap } = useSnapshot();
  const d = getDeployment();
  const [qr, setQr] = useState<{ programId: number; payload: string } | null>(null);
  if (!snap) return null;
  const list = snap.programs.filter((p) => p.active);
  return (
    <Card>
      <SectionTitle title="Aid programmes near you">
        At an NGO counter, show a one-time code. It proves you are eligible for this programme and have not received it yet —
        without revealing who you are, and it cannot be linked to your other programmes.
      </SectionTitle>
      {list.length === 0 ? (
        <Empty>No programmes yet.</Empty>
      ) : (
        <div className="space-y-3">
          {list.map((p) => {
            const eligible = identityTier !== null && identityTier !== undefined && (p.tierMask & (1 << identityTier)) !== 0;
            return (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line p-3">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted">
                    {ntd(p.amountPerHousehold)} per household · tiers{" "}
                    {TIERS.filter((_, i) => p.tierMask & (1 << i)).join(", ")} · {p.claims} handed over
                  </p>
                </div>
                <ActionButton
                  variant="secondary"
                  disabled={!eligible}
                  onClick={async () => {
                    const scope = programScope(d.programs, p.id);
                    const { groupId, proof } = await proveMembership(cardIdentity(card), snap.disaster!.tiers, 0n, scope);
                    const payload = { kind: "kept-claim", programId: p.id, groupId: groupId.toString(), proof: toJSONSafe(proof) };
                    postInbox("claim", payload);
                    setQr({ programId: p.id, payload: JSON.stringify(payload) });
                  }}
                >
                  {eligible ? "Show code at the counter" : "Not eligible"}
                </ActionButton>
              </div>
            );
          })}
        </div>
      )}
      {qr && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">One-time code for programme #{qr.programId}</p>
          <div className="w-fit rounded-lg bg-white p-3 ring-1 ring-line">
            <QRCodeSVG value={qr.payload} size={200} />
          </div>
          <p className="text-xs text-muted">Sent to the NGO counter&apos;s scanner (simulated in this browser).</p>
        </div>
      )}
    </Card>
  );
}

function Votes({ card, registered }: { card: HouseholdCard; registered: boolean }) {
  const { snap } = useSnapshot();
  const d = getDeployment();
  const [voted, setVoted] = useState<Record<string, "yes" | "no">>({});
  useEffect(() => {
    try {
      setVoted(JSON.parse(localStorage.getItem("kept.voted") ?? "{}"));
    } catch {}
  }, []);
  if (!snap?.fund) return null;
  const open = snap.fund.proposals.filter((p) => p.vote && p.vote.closesAt > snap.timestamp);
  const cast = async (key: Hex, support: boolean) => {
    const { groupId, proof } = await proveMembership(cardIdentity(card), snap.disaster!.tiers, support ? 1n : 0n, voteScope(key));
    const used = await publicClient.readContract({ address: d.voice, abi: voiceAbi, functionName: "nullifierUsed", args: [key, proof.nullifier] });
    if (used) throw new Error("AlreadyVoted");
    await tx("relayer", "voice", "castVote", [key, groupId, proof]);
    const next = { ...voted, [key]: support ? ("yes" as const) : ("no" as const) };
    localStorage.setItem("kept.voted", JSON.stringify(next));
    setVoted(next);
  };
  return (
    <Card>
      <SectionTitle title="Changes you can vote on">
        One anonymous vote per household. A majority &quot;no&quot; with enough turnout stops the change.
      </SectionTitle>
      {open.length === 0 ? (
        <Empty>No open votes.</Empty>
      ) : (
        <div className="space-y-3">
          {open.map((p) => (
            <div key={p.id} className="rounded-lg border border-line p-3">
              <p className="font-medium">{proposalTitle(p, snap)}</p>
              <p className="mb-2 text-xs text-muted">
                {p.emergency ? "Emergency change already applied — your vote is a public review." : "Not applied until the waiting period ends."}{" "}
                So far: {p.vote!.yes} yes · {p.vote!.no} no
              </p>
              {voted[p.vote!.key] ? (
                <Badge tone="info">You voted {voted[p.vote!.key]}</Badge>
              ) : (
                <div className="flex gap-2">
                  <ActionButton disabled={!registered} onClick={() => cast(p.vote!.key, true)}>
                    Yes
                  </ActionButton>
                  <ActionButton variant="danger" disabled={!registered} onClick={() => cast(p.vote!.key, false)}>
                    No
                  </ActionButton>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function Payments({ receipt, card }: { receipt: Address; card: HouseholdCard }) {
  const d = getDeployment();
  const proofs = useInbox<RosterProof>("roster-proof", true).filter((m) => m.payload.receipt.toLowerCase() === receipt.toLowerCase());
  const [states, setStates] = useState<Record<string, number>>({});
  const [included, setIncluded] = useState<Record<string, boolean>>({});
  const { snap } = useSnapshot();
  useEffect(() => {
    (async () => {
      const out: Record<string, number> = {};
      const inc: Record<string, boolean> = {};
      for (const m of proofs) {
        const p = m.payload;
        const key = lineKey(BigInt(p.hopId), BigInt(p.batchIndex), receipt);
        out[m.id] = Number(await publicClient.readContract({ address: d.ledger, abi: ledgerAbi, functionName: "lineState", args: [key] }));
        // Check the household's own line against the root committed on-chain.
        inc[m.id] = await publicClient.readContract({
          address: d.ledger,
          abi: ledgerAbi,
          functionName: "verifyInclusion",
          args: [BigInt(p.hopId), BigInt(p.batchIndex), p.receipt, BigInt(p.amount), p.proof],
        });
      }
      setStates(out);
      setIncluded(inc);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proofs.length, snap?.block]);

  const answer = async (p: RosterProof, received: boolean) => {
    const account = cardReceipt(card);
    const message = {
      hopId: BigInt(p.hopId),
      batchIndex: BigInt(p.batchIndex),
      receipt: p.receipt,
      amount: BigInt(p.amount),
      received,
    };
    const signature = await account.signTypedData({ domain: receiptDomain(d.ledger), types: RECEIPT_TYPES, primaryType: "Receipt", message });
    await tx("relayer", "ledger", "confirmLine", [message.hopId, message.batchIndex, p.receipt, message.amount, received, p.proof, signature]);
  };

  return (
    <Card>
      <SectionTitle title="Payments recorded for my household">
        When a custodian reports a payment batch, it commits only a fingerprint (Merkle root) of the list. You can check that you
        are in it — and say whether the money actually reached you.
      </SectionTitle>
      {proofs.length === 0 ? (
        <Empty>No payment has been reported for this household yet.</Empty>
      ) : (
        <div className="space-y-3">
          {proofs.map((m) => {
            const p = m.payload;
            const state = states[m.id];
            return (
              <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-3">
                <div>
                  <p className="font-medium">
                    {ntd(BigInt(p.amount))} reported paid by {p.custodianLabel}
                  </p>
                  <p className="text-xs text-muted">
                    Tranche #{p.hopId} · batch {p.batchIndex} ·{" "}
                    {included[m.id] === undefined
                      ? "checking inclusion…"
                      : included[m.id]
                        ? "✓ your line is in the roster committed on-chain"
                        : "✗ this line does NOT match the on-chain roster"}
                  </p>
                </div>
                {state === 1 ? (
                  <Badge tone="ok">You confirmed receipt</Badge>
                ) : state === 2 ? (
                  <Badge tone="bad">You disputed this payment</Badge>
                ) : (
                  <div className="flex gap-2">
                    <ActionButton onClick={() => answer(p, true)}>I received it</ActionButton>
                    <ActionButton variant="danger" onClick={() => answer(p, false)}>
                      I did not receive it
                    </ActionButton>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function AppealCard() {
  const { snap } = useSnapshot();
  const [village, setVillage] = useState<number>(VILLAGES[2].code);
  const [text, setText] = useState("Our ground floor flooded to 1 m but we are not on the list.");
  const [done, setDone] = useState(false);
  if (!snap?.disaster) return null;
  return (
    <Card>
      <SectionTitle title="Left out? File an appeal">
        Anyone can appeal, even without a credential. Your evidence stays with the township office; only its fingerprint and the
        village are public, so everyone can see how many appeals are waiting and how long they take.
      </SectionTitle>
      <div className="grid gap-3 md:grid-cols-[200px_1fr_auto] md:items-end">
        <Field label="Village">
          <select className={inputCls} value={village} onChange={(e) => setVillage(Number(e.target.value))}>
            {VILLAGES.map((v) => (
              <option key={v.code} value={v.code}>
                {v.name} ({v.zh})
              </option>
            ))}
          </select>
        </Field>
        <Field label="What happened (kept off-chain)">
          <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <ActionButton
          onClick={async () => {
            await tx("relayer", "registry", "fileAppeal", [snap.disaster!.id, village, textHash(text)]);
            setDone(true);
          }}
        >
          File appeal
        </ActionButton>
      </div>
      {done && <p className="mt-2 text-sm text-ok">Appeal filed. It now appears on the public dashboard.</p>}
    </Card>
  );
}
