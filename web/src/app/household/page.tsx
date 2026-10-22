"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Address, Hex } from "viem";
import { useSnapshot } from "@/components/snapshot";
import { ActionButton, Badge, Card, Empty, Field, Note, SectionTitle, Stamp, inputCls, ntd, PageHeader } from "@/components/ui";
import { KeptMark } from "@/components/icons";
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
import { postInbox } from "@/lib/inbox";
import { tx } from "@/lib/api";
import { lineKey, programScope, textHash, voteScope, waitingPeriod, waitingScope } from "@/lib/scopes";
import { getDeployment } from "@/lib/config";
import { publicClient } from "@/lib/chain";
import { ledgerAbi, voiceAbi } from "@/generated/contracts";
import { receiptDomain, AUDIT_VISIT_TYPES, RECEIPT_TYPES } from "@/lib/receipt";
import { TIERS, VILLAGES, tierName } from "@/lib/scenario";
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
      <PageHeader
        eyebrow="Role · Household device"
        kind="sim"
        title="My relief credential"
      >
        Your credential stays on this phone (or a printed card). It proves you are a verified household without saying which
        one. Nothing personal ever goes on-chain, and you never need crypto or gas.
      </PageHeader>
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
          <div className="relative mb-6 aspect-[1.586] max-w-sm overflow-hidden rounded-xl border border-ink/15 bg-[linear-gradient(135deg,var(--card),var(--sunk))] p-5 shadow-[0_14px_30px_-18px_rgb(0_0_0/0.45)]">
            <div className="ledger-rules absolute inset-0 opacity-40" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-ink">
                  <KeptMark className="h-7 w-7" seal={false} />
                  <span className="font-serif text-lg font-semibold">Kept</span>
                </div>
                <span className="eyebrow text-right">Relief credential</span>
              </div>
              <div>
                <p className="font-serif text-[22px] leading-tight text-ink">{card.label}</p>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  receipt {receipt.address.slice(0, 8)}…{receipt.address.slice(-6)}
                </p>
              </div>
            </div>
            {tier !== null && tier !== undefined && (
              <span className="absolute bottom-5 right-5">
                <Stamp>Verified · 2 signatures</Stamp>
              </span>
            )}
          </div>
          <SectionTitle kicker="This device" title="Status" />
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
          {tier !== null && tier !== undefined && <StillWaiting card={card} />}
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
                {p.emergency
                  ? "Emergency change already applied. If households vote it down, the part not yet spent goes back and the committee loses its emergency power."
                  : "Not applied until the waiting period ends; it goes ahead unless households vote it down."}{" "}
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

function StillWaiting({ card }: { card: HouseholdCard }) {
  const { snap } = useSnapshot();
  const d = getDeployment();
  const [village, setVillage] = useState<number>(VILLAGES[0].code);
  const [sentFor, setSentFor] = useState<number | null>(null);
  if (!snap?.disaster) return null;
  const period = waitingPeriod(snap.timestamp, snap.disaster.createdAt);
  return (
    <Card>
      <SectionTitle title="Still waiting for aid?">
        Say so anonymously, once a week. Only the count per village is public, and it does not depend on any custodian having
        recorded a payment for you.
      </SectionTitle>
      {sentFor === period ? (
        <Badge tone="info">Reported for this week. You can report again next week if nothing arrives.</Badge>
      ) : (
        <div className="flex flex-wrap items-end gap-3">
          <Field label="My village">
            <select className={inputCls} value={village} onChange={(e) => setVillage(Number(e.target.value))}>
              {VILLAGES.map((v) => (
                <option key={v.code} value={v.code}>
                  {v.name} ({v.zh})
                </option>
              ))}
            </select>
          </Field>
          <ActionButton
            variant="secondary"
            onClick={async () => {
              const scope = waitingScope(d.registry, snap.disaster!.id, period);
              const { groupId, proof } = await proveMembership(cardIdentity(card), snap.disaster!.tiers, BigInt(village), scope);
              await tx("relayer", "registry", "reportWaiting", [snap.disaster!.id, groupId, proof]);
              setSentFor(period);
            }}
          >
            I am still waiting
          </ActionButton>
        </div>
      )}
    </Card>
  );
}

type MyLine = {
  hopId: number;
  batchIndex: number;
  amount: bigint;
  custodian: Address;
  state: number;
  audit?: number; // when the line was drawn for the sample audit: the recorded visit (0 = not visited yet)
};

function Payments({ receipt, card }: { receipt: Address; card: HouseholdCard }) {
  const d = getDeployment();
  const { snap, labelOf, roles } = useSnapshot();
  const [lines, setLines] = useState<MyLine[] | null>(null);
  useEffect(() => {
    if (!snap) return;
    (async () => {
      // The lines are public: look for this household's receipt address in every published batch.
      const found: MyLine[] = [];
      for (const h of snap.hops) {
        for (const b of h.batches) {
          const amount = await publicClient.readContract({
            address: d.ledger,
            abi: ledgerAbi,
            functionName: "lineAmount",
            args: [BigInt(h.id), BigInt(b.index), receipt],
          });
          if (amount === 0n) continue;
          const state = await publicClient.readContract({
            address: d.ledger,
            abi: ledgerAbi,
            functionName: "lineState",
            args: [lineKey(BigInt(h.id), BigInt(b.index), receipt)],
          });
          const pick = b.audit.find((p) => p.receipt.toLowerCase() === receipt.toLowerCase());
          found.push({ hopId: h.id, batchIndex: b.index, amount, custodian: h.to, state: Number(state), audit: pick?.outcome });
        }
      }
      setLines(found);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap?.block, receipt]);

  const answer = async (l: MyLine, received: boolean) => {
    const account = cardReceipt(card);
    const message = { hopId: BigInt(l.hopId), batchIndex: BigInt(l.batchIndex), receipt, amount: l.amount, received };
    const signature = await account.signTypedData({ domain: receiptDomain(d.ledger), types: RECEIPT_TYPES, primaryType: "Receipt", message });
    await tx("relayer", "ledger", "confirmLine", [message.hopId, message.batchIndex, receipt, received, signature]);
  };

  // Signed in front of the auditor who visits; the message names that auditor, so it cannot be reused.
  const signVisit = async (l: MyLine, received: boolean) => {
    const auditor = roles.auditor!;
    const message = { hopId: BigInt(l.hopId), batchIndex: BigInt(l.batchIndex), receipt, amount: l.amount, received, auditor };
    const signature = await cardReceipt(card).signTypedData({
      domain: receiptDomain(d.ledger),
      types: AUDIT_VISIT_TYPES,
      primaryType: "AuditVisit",
      message,
    });
    await tx("auditor", "ledger", "recordAuditVisit", [message.hopId, message.batchIndex, receipt, received ? 1 : 2, signature]);
  };

  return (
    <Card>
      <SectionTitle title="Payments recorded for my household">
        Custodians publish each payment batch as pseudonymous lines. This screen finds your line by itself, without asking the
        custodian, and lets you say whether the money actually reached you. Getting paid never requires this step; it is how you
        can say if something went wrong.
      </SectionTitle>
      {lines === null ? (
        <Empty>Looking for your line in the published rosters…</Empty>
      ) : lines.length === 0 ? (
        <Empty>No payment has been recorded for this household yet. If you expected one, use “Still waiting for aid?”.</Empty>
      ) : (
        <div className="space-y-3">
          {lines.map((l) => (
            <div
              key={`${l.hopId}-${l.batchIndex}`}
              className="relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-md border border-line bg-card px-5 pb-4 pt-5"
            >
              <span aria-hidden className="perforated absolute inset-x-0 top-0 h-2" />
              <div>
                <p className="eyebrow">Payment line · receipt {receipt.slice(0, 6)}…{receipt.slice(-4)}</p>
                <p className="mt-1.5 font-medium">
                  <span className="font-mono text-lg">{ntd(l.amount)}</span> recorded as paid by {labelOf(l.custodian) ?? "a custodian"}
                </p>
                <p className="text-xs text-muted">
                  Tranche #{l.hopId} · batch {l.batchIndex} · found in the roster published on-chain
                </p>
                {l.audit !== undefined && (
                  <div className="mt-3 rounded-r-md border-l-2 border-accent bg-accent/5 px-3 py-2 text-xs">
                    <p className="font-medium text-accent">Your line was drawn for the sample audit.</p>
                    {l.audit === 0 ? (
                      <>
                        <p className="mt-0.5 text-muted">
                          An independent auditor will visit you. When they do, sign the visit here, in front of them.
                        </p>
                        <div className="mt-1.5 flex gap-2">
                          <ActionButton variant="secondary" onClick={() => signVisit(l, true)}>
                            Sign for the auditor: received
                          </ActionButton>
                          <ActionButton variant="secondary" onClick={() => signVisit(l, false)}>
                            Not received
                          </ActionButton>
                        </div>
                      </>
                    ) : (
                      <p className="mt-0.5 text-muted">
                        Visit recorded: {l.audit === 1 ? "you signed “received”" : l.audit === 2 ? "you signed “not received”" : "nobody found at the address"}.
                      </p>
                    )}
                  </div>
                )}
              </div>
              {l.state === 1 ? (
                <div className="flex flex-col items-end gap-2">
                  <Stamp tone="ok">Received</Stamp>
                  <Badge tone="ok">You confirmed receipt</Badge>
                </div>
              ) : l.state === 2 ? (
                <div className="flex flex-col items-end gap-2">
                  <Stamp tone="bad">Not received</Stamp>
                  <Badge tone="bad">You disputed this payment</Badge>
                </div>
              ) : (
                <div className="space-y-2">
                  {(l.state === 3 || l.state === 4) && (
                    <p className="text-xs text-muted">
                      Your proxy recorded “{l.state === 3 ? "received" : "not received"}” for you. Your own answer replaces it.
                    </p>
                  )}
                  <div className="flex gap-2">
                    <ActionButton onClick={() => answer(l, true)}>I received it</ActionButton>
                    <ActionButton variant="danger" onClick={() => answer(l, false)}>
                      I did not receive it
                    </ActionButton>
                  </div>
                </div>
              )}
            </div>
          ))}
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
