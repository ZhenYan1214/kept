"use client";
import { useState } from "react";
import { useSnapshot } from "@/components/snapshot";
import { ActionButton, Addr, Card, Empty, Field, Note, SectionTitle, formatDate, inputCls, ntd, pct } from "@/components/ui";
import { CharterPanel, custodyTotals } from "@/components/panels";
import { tx, eventArg } from "@/lib/api";
import { textHash } from "@/lib/scopes";

export default function DonatePage() {
  const { snap, roles } = useSnapshot();
  const [amount, setAmount] = useState(10_000);
  const [receipt, setReceipt] = useState<{ no: bigint; amount: number } | null>(null);
  if (!snap?.fund) return <Empty>Set up the scenario first.</Empty>;
  const f = snap.fund;
  const t = custodyTotals(snap.hops);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Donate</p>
        <h1 className="text-2xl font-semibold">Give to a fund that cannot change its promises</h1>
        <p className="max-w-2xl text-sm text-muted">
          Read the charter below before you give. It was fixed when this fund was created and cannot be rewritten; the contract enforces it on the money it holds.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Card>
          <SectionTitle title="Donate (testnet NT$)" />
          <div className="space-y-3">
            <Field label="Amount" hint="Demo donations use a testnet stand-in for a regulated NT$ stablecoin.">
              <input type="number" className={inputCls} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </Field>
            <ActionButton
              onClick={async () => {
                const a = BigInt(amount);
                await tx("donor", "token", "faucet", [roles.donor!, a]);
                await tx("donor", "token", "approve", [f.address, a]);
                const r = await tx("donor", "fund", "donate", [a, textHash(`donation ${Date.now()}`)], f.address);
                setReceipt({ no: eventArg<bigint>(r, "Donated", "receiptNo"), amount });
              }}
            >
              Donate {ntd(amount)}
            </ActionButton>
            {receipt && (
              <Note tone="ok">
                Receipt #{receipt.no.toString()} for {ntd(receipt.amount)}. Your gift now counts toward every cap in the charter. At
                this moment {pct(t.allocated, f.totalRaised)}% of the fund is allocated and {t.confirmed} households have confirmed
                receiving aid.
              </Note>
            )}
            <p className="text-xs text-muted">
              In production, donations in NT$ stay at the bank in phase 1; the commitments, decisions and custody trail are on-chain
              either way. Tax receipts with your name are issued off-chain by the custodian.
            </p>
          </div>
        </Card>
        <CharterPanel snap={snap} />
      </div>
      <Card>
        <SectionTitle title="Recent donations (public)" />
        <div className="divide-y divide-line text-sm">
          {[...f.donations].reverse().map((d) => (
            <div key={d.receiptNo.toString()} className="flex items-center justify-between py-2">
              <span>
                Receipt #{d.receiptNo.toString()} · <Addr address={d.donor} />
              </span>
              <span className="flex items-center gap-3 tabular-nums">
                {ntd(d.amount)} <span className="text-xs text-muted">{formatDate(d.at)}</span>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
