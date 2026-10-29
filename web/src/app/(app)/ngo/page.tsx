"use client";
import { useState } from "react";
import { useSnapshot } from "@/components/snapshot";
import { ActionButton, Badge, Card, Empty, Field, Note, SectionTitle, humanError, inputCls, ntd, NotReady, PageHeader } from "@/components/ui";
import { tx } from "@/lib/api";
import { consumeInbox, useInbox } from "@/lib/inbox";
import { fromJSONSafe } from "@/lib/serialize";
import { TIERS, tierName } from "@/lib/scenario";
import type { SolidityProof } from "@/lib/semaphore";

type Claim = { kind: "kept-claim"; programId: number; groupId: string; proof: unknown };

export default function NgoPage() {
  const { snap, roles } = useSnapshot();
  const scans = useInbox<Claim>("claim");
  const [results, setResults] = useState<Record<string, { ok: boolean; text: string }>>({});
  if (!snap?.fund) return <NotReady />;
  const ngo = roles.ngo?.toLowerCase();
  const myPrograms = snap.programs.filter((p) => p.ngo.toLowerCase() === ngo);
  const myHops = snap.hops.filter((h) => h.to.toLowerCase() === ngo && h.ackAt);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Role · NGO counter"
        kind="sim"
        title="Verify eligibility on the spot — without the roster"
      >
        A household shows a one-time code. The contract checks a zero-knowledge proof that it is a verified household of this
        disaster that has not received this programme yet. The code reveals nothing else about the household, and you never need the roster.
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <SectionTitle title="Scanner" />
          {scans.length === 0 ? (
            <Empty>Waiting for a code. On the Household screen, press “Show code at the counter”.</Empty>
          ) : (
            <div className="space-y-3">
              {scans.map((m) => {
                const program = snap.programs.find((p) => p.id === m.payload.programId);
                return (
                  <div key={m.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line p-3">
                    <div>
                      <p className="font-medium">Code for “{program?.name ?? `programme #${m.payload.programId}`}”</p>
                      <p className="text-xs text-muted">Anonymous proof · scanned {new Date(m.at).toLocaleTimeString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <ActionButton
                        onClick={async () => {
                          const proof = fromJSONSafe(m.payload.proof) as SolidityProof;
                          try {
                            await tx("ngo", "programs", "claim", [BigInt(m.payload.programId), BigInt(m.payload.groupId), proof]);
                            setResults((r) => ({ ...r, [m.id]: { ok: true, text: `Eligible — hand over the kit (${ntd(program?.amountPerHousehold ?? 0n)})` } }));
                          } catch (e) {
                            setResults((r) => ({ ...r, [m.id]: { ok: false, text: humanError(e instanceof Error ? e.message : String(e)) } }));
                            throw e;
                          } finally {
                            consumeInbox(m.id);
                          }
                        }}
                      >
                        Verify & record hand-over
                      </ActionButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {Object.entries(results).map(([id, r]) => (
            <div key={id} className="mt-3">
              <Note tone={r.ok ? "ok" : "bad"}>{r.text}</Note>
            </div>
          ))}
          <p className="mt-4 text-xs text-muted">
            Try showing the same household&apos;s code twice: the second one is rejected, because the nullifier for this programme was
            already used.
          </p>
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionTitle title="My programmes" />
            {myPrograms.length === 0 ? (
              <Empty>No programmes yet.</Empty>
            ) : (
              <div className="space-y-2">
                {myPrograms.map((p) => (
                  <div key={p.id} className="rounded-lg border border-line p-3 text-sm">
                    <p className="font-medium">
                      #{p.id} {p.name} {p.active ? <Badge tone="ok">Active</Badge> : <Badge>Closed</Badge>}
                    </p>
                    <p className="text-xs text-muted">
                      {ntd(p.amountPerHousehold)} per household · {TIERS.filter((_, i) => p.tierMask & (1 << i)).join(", ")} ·{" "}
                      {p.claims} handed over{p.hopId ? ` · funded by tranche #${p.hopId}` : " · self-funded"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <NewProgram hops={myHops.map((h) => ({ id: h.id, amount: h.amount }))} disasterId={snap.disaster!.id} />
        </div>
      </div>
    </div>
  );
}

function NewProgram({ hops, disasterId }: { hops: { id: number; amount: bigint }[]; disasterId: bigint }) {
  const [hop, setHop] = useState(hops[0]?.id ?? 0);
  const [name, setName] = useState("Cleaning tools & rain boots");
  const [amount, setAmount] = useState(3000);
  const [mask, setMask] = useState(0b111);
  return (
    <Card>
      <SectionTitle title="New programme" />
      <div className="space-y-3">
        <Field label="Name">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Funded by">
            <select className={inputCls} value={hop} onChange={(e) => setHop(Number(e.target.value))}>
              <option value={0}>Own resources</option>
              {hops.map((h) => (
                <option key={h.id} value={h.id}>
                  Tranche #{h.id} ({ntd(h.amount)})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Value per household">
            <input type="number" className={inputCls} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          {TIERS.map((t, i) => (
            <label key={t} className="flex items-center gap-1.5">
              <input type="checkbox" checked={(mask & (1 << i)) !== 0} onChange={() => setMask(mask ^ (1 << i))} />
              {tierName(i)}
            </label>
          ))}
        </div>
        <ActionButton onClick={() => tx("ngo", "programs", "createProgram", [BigInt(hop), disasterId, mask, BigInt(amount), name])}>
          Create programme
        </ActionButton>
      </div>
    </Card>
  );
}
