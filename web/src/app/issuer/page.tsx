"use client";
import { useEffect, useState } from "react";
import type { Address } from "viem";
import { useSnapshot } from "@/components/snapshot";
import { ActionButton, Badge, Card, Empty, Field, Note, SectionTitle, formatDate, formatDuration, inputCls } from "@/components/ui";
import { consumeInbox, useInbox } from "@/lib/inbox";
import { tx, eventArg } from "@/lib/api";
import { demoUniqueTag, textHash } from "@/lib/scopes";
import { ROLES, TIERS, VILLAGES, villageName, type RoleName } from "@/lib/scenario";
import { upsertRoster } from "@/lib/roster";
import { getDeployment } from "@/lib/config";
import { publicClient } from "@/lib/chain";
import { registryAbi } from "@/generated/contracts";

type Reg = { kind: "kept-registration"; label: string; commitment: string; receipt: Address };

const ACTORS: RoleName[] = ["office", "chief0", "chief1", "chief2", "chief3", "chief4"];

export default function IssuerPage() {
  const { snap, roles } = useSnapshot();
  const [actor, setActor] = useState<RoleName>("chief2");
  const inbox = useInbox<Reg>("registration");
  if (!snap?.disaster) return <Empty>Set up the scenario first.</Empty>;
  const isOffice = actor === "office";
  const myVillage = isOffice ? null : VILLAGES[Number(actor.slice(5))].code;
  const myAddr = roles[actor]?.toLowerCase();

  const pending = snap.registrations.filter(
    (r) => r.status === 1 && (isOffice || r.village === myVillage) && r.proposer.toLowerCase() !== myAddr,
  );
  const issuerOf = (addr: string) => snap.issuers.find((i) => i.address.toLowerCase() === addr.toLowerCase());

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Issuers</p>
          <h1 className="text-2xl font-semibold">Village chief & township office</h1>
          <p className="max-w-2xl text-sm text-muted">
            A household becomes verified only when both the village chief and the township office sign. Every decision is
            attributed to the person who made it.
          </p>
        </div>
        <Field label="Acting as">
          <select className={inputCls} value={actor} onChange={(e) => setActor(e.target.value as RoleName)}>
            {ACTORS.map((a) => (
              <option key={a} value={a}>
                {ROLES[a].label}
              </option>
            ))}
          </select>
        </Field>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Scanned registration codes">
            Households show a code with public data only. Enter the ID number to compute the authority&apos;s blinded tag — the ID
            itself is never sent anywhere.
          </SectionTitle>
          {inbox.length === 0 ? (
            <Empty>No codes scanned yet. On the Household screen, press “Simulate: chief scans this code”.</Empty>
          ) : (
            <div className="space-y-4">
              {inbox.map((m) => (
                <RegisterForm key={m.id} msg={m.payload} actor={actor} fixedVillage={myVillage} onDone={() => consumeInbox(m.id)} />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle title="Waiting for my signature">
            {isOffice ? "Proposals by village chiefs in Guangfu Township." : "Proposals by the township office for my village."}
          </SectionTitle>
          {pending.length === 0 ? (
            <Empty>Nothing to sign.</Empty>
          ) : (
            <div className="space-y-3">
              {pending.map((r) => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line p-3 text-sm">
                  <div>
                    <p className="font-medium">
                      Registration #{r.id} · {villageName(r.village)} · {TIERS[r.tier]}
                    </p>
                    <p className="text-xs text-muted">
                      proposed by {issuerOf(r.proposer)?.name ?? r.proposer} · {formatDate(r.proposedAt)} · commitment{" "}
                      {r.commitment.toString().slice(0, 10)}…
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <ActionButton onClick={() => tx(actor, "registry", "approveRegistration", [BigInt(r.id)])}>Approve</ActionButton>
                    <ActionButton
                      variant="secondary"
                      onClick={() => tx(actor, "registry", "rejectRegistration", [BigInt(r.id), textHash("Not a resident (demo)")])}
                    >
                      Reject
                    </ActionButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {isOffice && <AppealsDesk />}
      {isOffice && <CoverageDesk />}
      {isOffice && <ProxyDesk />}
    </div>
  );
}

function RegisterForm({
  msg,
  actor,
  fixedVillage,
  onDone,
}: {
  msg: Reg;
  actor: RoleName;
  fixedVillage: number | null;
  onDone: () => void;
}) {
  const { snap } = useSnapshot();
  const [village, setVillage] = useState<number>(fixedVillage ?? VILLAGES[2].code);
  const [tier, setTier] = useState(2);
  const [nid, setNid] = useState("U22" + Math.floor(1e6 + Math.random() * 9e6));
  useEffect(() => {
    if (fixedVillage) setVillage(fixedVillage);
  }, [fixedVillage]);
  return (
    <div className="space-y-3 rounded-lg border border-line p-3">
      <p className="text-sm font-medium">
        {msg.label} <span className="font-mono text-xs text-muted">commitment {msg.commitment.slice(0, 10)}…</span>{" "}
        <span className="font-mono text-xs text-muted">receipt {msg.receipt.slice(0, 8)}…</span>
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Village">
          <select className={inputCls} value={village} disabled={!!fixedVillage} onChange={(e) => setVillage(Number(e.target.value))}>
            {VILLAGES.map((v) => (
              <option key={v.code} value={v.code}>
                {v.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Damage tier">
          <select className={inputCls} value={tier} onChange={(e) => setTier(Number(e.target.value))}>
            {TIERS.map((t, i) => (
              <option key={t} value={i}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="National ID (simulated)" hint="Only its blinded tag goes on-chain">
          <input className={inputCls} value={nid} onChange={(e) => setNid(e.target.value)} />
        </Field>
      </div>
      <ActionButton
        onClick={async () => {
          const r = await tx(actor, "registry", "proposeRegistration", [
            snap!.disaster!.id,
            tier,
            village,
            BigInt(msg.commitment),
            demoUniqueTag(nid),
            msg.receipt,
          ]);
          const id = Number(eventArg<bigint>(r, "RegistrationProposed", "id"));
          upsertRoster({ label: msg.label, village, tier, commitment: msg.commitment, receipt: msg.receipt, registrationId: id });
          onDone();
        }}
      >
        Propose registration (signature 1 of 2)
      </ActionButton>
    </div>
  );
}

function AppealsDesk() {
  const { snap } = useSnapshot();
  const pending = snap!.appeals.filter((a) => a.status === 1);
  return (
    <Card>
      <SectionTitle title="Appeals desk">
        Every appeal is public by village, with the time it has been waiting. Accepting an appeal means the household can then be
        registered.
      </SectionTitle>
      {pending.length === 0 ? (
        <Empty>No pending appeals.</Empty>
      ) : (
        <div className="space-y-3">
          {pending.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line p-3 text-sm">
              <div>
                <p className="font-medium">
                  Appeal #{a.id} · {villageName(a.village)}
                </p>
                <p className="text-xs text-muted">
                  waiting {formatDuration(snap!.timestamp - a.filedAt)} · evidence fingerprint {a.evidenceHash.slice(0, 10)}…
                </p>
              </div>
              <div className="flex gap-2">
                <ActionButton onClick={() => tx("office", "registry", "resolveAppeal", [BigInt(a.id), true, textHash("Accepted after field visit")])}>
                  Accept
                </ActionButton>
                <ActionButton
                  variant="secondary"
                  onClick={() => tx("office", "registry", "resolveAppeal", [BigInt(a.id), false, textHash("Rejected: reason recorded")])}
                >
                  Reject
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function CoverageDesk() {
  const { snap } = useSnapshot();
  const [village, setVillage] = useState<number>(VILLAGES[0].code);
  const [unserved, setUnserved] = useState(0);
  return (
    <Card>
      <SectionTitle title="Coverage report">
        The office holds the roster legally. It publishes only how many verified households in a village have not yet received
        any programme.
      </SectionTitle>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Village">
          <select className={inputCls} value={village} onChange={(e) => setVillage(Number(e.target.value))}>
            {VILLAGES.map((v) => (
              <option key={v.code} value={v.code}>
                {v.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Verified, no aid yet">
          <input type="number" min={0} className={inputCls} value={unserved} onChange={(e) => setUnserved(Number(e.target.value))} />
        </Field>
        <ActionButton onClick={() => tx("office", "registry", "reportCoverage", [snap!.disaster!.id, village, unserved])}>
          Publish
        </ActionButton>
      </div>
      <Note tone="muted">
        <span className="text-xs">Small numbers are shown as “&lt;5” on the public dashboard.</span>
      </Note>
      <div className="mt-2">
        <Badge tone="muted">{snap!.villageStats.filter((s) => s.coverageAsOf).length} village(s) reported</Badge>
      </div>
    </Card>
  );
}

function ProxyDesk() {
  const { snap, roles } = useSnapshot();
  const [village, setVillage] = useState<number>(VILLAGES[0].code);
  const worker = roles.socialWorker;
  const [proxies, setProxies] = useState<Record<number, boolean>>({});
  const block = snap?.block;
  useEffect(() => {
    if (!worker || !snap?.disaster) return;
    (async () => {
      const d = getDeployment();
      const out: Record<number, boolean> = {};
      for (const v of VILLAGES) {
        out[v.code] = await publicClient.readContract({
          address: d.registry,
          abi: registryAbi,
          functionName: "isProxy",
          args: [snap.disaster!.id, v.code, worker],
        });
      }
      setProxies(out);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worker, block]);
  if (!worker) return null;
  const active = !!proxies[village];
  return (
    <Card>
      <SectionTitle title="Proxies">
        A proxy (here, a registered social worker) may sign “received” or “not received” for elders of one village who cannot do
        it themselves. It is designated per village, publicly, and a household&apos;s own answer always replaces the proxy&apos;s.
      </SectionTitle>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Village">
          <select className={inputCls} value={village} onChange={(e) => setVillage(Number(e.target.value))}>
            {VILLAGES.map((v) => (
              <option key={v.code} value={v.code}>
                {v.name}
                {proxies[v.code] ? " (proxy active)" : ""}
              </option>
            ))}
          </select>
        </Field>
        <ActionButton
          variant={active ? "secondary" : "primary"}
          onClick={() => tx("office", "registry", "setProxy", [snap!.disaster!.id, village, worker, !active])}
        >
          {active ? "Remove social worker as proxy" : "Designate social worker as proxy"}
        </ActionButton>
      </div>
    </Card>
  );
}
