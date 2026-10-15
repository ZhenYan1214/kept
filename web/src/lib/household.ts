"use client";
import { Identity } from "@semaphore-protocol/core";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import type { Hex } from "viem";

/**
 * A household's credential lives only on its own device (or printed card):
 *  - a Semaphore identity: proves "I am a verified household" without saying which one;
 *  - a receipt key: signs "I received it" / "I did not" for its own line of a payment roster.
 * Neither is ever sent to a server. The township office only learns the public commitment and
 * receipt address when it registers the household.
 */
export type HouseholdCard = {
  version: 1;
  label: string;
  identity: string; // Identity.export()
  receiptKey: Hex;
  createdAt: number;
};

const KEY = "kept.household";

export function loadCard(): HouseholdCard | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HouseholdCard) : null;
  } catch {
    return null;
  }
}

export function saveCard(card: HouseholdCard) {
  localStorage.setItem(KEY, JSON.stringify(card));
}

export function clearCard() {
  localStorage.removeItem(KEY);
}

export function newCard(label: string): HouseholdCard {
  const identity = new Identity();
  return { version: 1, label, identity: identity.export(), receiptKey: generatePrivateKey(), createdAt: Date.now() };
}

export function cardIdentity(card: HouseholdCard) {
  return Identity.import(card.identity);
}

export function cardReceipt(card: HouseholdCard) {
  return privateKeyToAccount(card.receiptKey);
}

/** What the household shows the village chief / township office to get registered (public data only). */
export function registrationPayload(card: HouseholdCard) {
  return {
    kind: "kept-registration" as const,
    label: card.label,
    commitment: cardIdentity(card).commitment.toString(),
    receipt: cardReceipt(card).address,
  };
}
