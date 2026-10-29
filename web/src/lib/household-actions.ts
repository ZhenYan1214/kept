"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Address } from "viem";
import { useSnapshot } from "@/components/snapshot";
import { cardIdentity, cardReceipt, type HouseholdCard } from "./household";
import { findTier, proveMembership } from "./semaphore";
import { tx } from "./api";
import { lineKey, waitingPeriod, waitingScope } from "./scopes";
import { getDeployment } from "./config";
import { publicClient } from "./chain";
import { ledgerAbi } from "@/generated/contracts";
import { receiptDomain, AUDIT_VISIT_TYPES, RECEIPT_TYPES } from "./receipt";

/**
 * What a household's own device does, shared by the standard screen and the large-type Chinese one:
 * find its verified tier, find its payment lines, answer them, sign an audit visit, say it is still waiting.
 */

/** undefined while checking, null when not (yet) a verified household, else the damage tier. */
export function useHouseholdTier(card: HouseholdCard) {
  const { snap } = useSnapshot();
  const identity = useMemo(() => cardIdentity(card), [card]);
  const [tier, setTier] = useState<number | null | undefined>(undefined);
  const tierKey = snap?.disaster?.tiers.map((t) => t.groupId.toString()).join(",") ?? "";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tiers = useMemo(() => snap?.disaster?.tiers ?? [], [tierKey]);
  const verifiedCount = snap?.disaster?.verified;
  const check = useCallback(async () => {
    if (!tiers.length) return;
    setTier(await findTier(identity, tiers));
  }, [identity, tiers]);
  useEffect(() => {
    check();
  }, [check, verifiedCount]);
  return tier;
}

export type MyLine = {
  hopId: number;
  batchIndex: number;
  amount: bigint;
  custodian: Address;
  state: number; // 0 no answer, 1 received, 2 not received, 3/4 the proxy's answer
  audit?: number; // when the line was drawn for the sample audit: the recorded visit (0 = not visited yet)
};

/** The lines are public: look for this household's receipt address in every published batch. null while looking. */
export function useMyLines(receipt: Address) {
  const { snap } = useSnapshot();
  const [lines, setLines] = useState<MyLine[] | null>(null);
  useEffect(() => {
    if (!snap) return;
    const d = getDeployment();
    (async () => {
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
  return lines;
}

/** "I received it" / "I did not": signed with the household's own key, relayed so it never needs gas. */
export async function answerLine(card: HouseholdCard, l: MyLine, received: boolean) {
  const account = cardReceipt(card);
  const receipt = account.address;
  const message = { hopId: BigInt(l.hopId), batchIndex: BigInt(l.batchIndex), receipt, amount: l.amount, received };
  const signature = await account.signTypedData({
    domain: receiptDomain(getDeployment().ledger),
    types: RECEIPT_TYPES,
    primaryType: "Receipt",
    message,
  });
  return tx("relayer", "ledger", "confirmLine", [message.hopId, message.batchIndex, receipt, received, signature]);
}

/** Signed in front of the auditor who visits; the message names that auditor, so it cannot be reused. */
export async function signAuditVisit(card: HouseholdCard, l: MyLine, received: boolean, auditor: Address) {
  const account = cardReceipt(card);
  const receipt = account.address;
  const message = { hopId: BigInt(l.hopId), batchIndex: BigInt(l.batchIndex), receipt, amount: l.amount, received, auditor };
  const signature = await account.signTypedData({
    domain: receiptDomain(getDeployment().ledger),
    types: AUDIT_VISIT_TYPES,
    primaryType: "AuditVisit",
    message,
  });
  return tx("auditor", "ledger", "recordAuditVisit", [message.hopId, message.batchIndex, receipt, received ? 1 : 2, signature]);
}

/** The household's anonymous weekly "still waiting" report: only the count per village is public. */
export function useStillWaiting(card: HouseholdCard) {
  const { snap } = useSnapshot();
  const [sentFor, setSentFor] = useState<number | null>(null);
  const period = snap?.disaster ? waitingPeriod(snap.timestamp, snap.disaster.createdAt) : null;
  const report = async (village: number) => {
    const disaster = snap!.disaster!;
    const scope = waitingScope(getDeployment().registry, disaster.id, period!);
    const { groupId, proof } = await proveMembership(cardIdentity(card), disaster.tiers, BigInt(village), scope);
    const r = await tx("relayer", "registry", "reportWaiting", [disaster.id, groupId, proof]);
    setSentFor(period);
    return r;
  };
  return { ready: period !== null, sent: period !== null && sentFor === period, report };
}
