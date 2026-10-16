"use client";
import type { Address } from "viem";

/**
 * The township office's own roster. In reality this is the office's existing database of who was
 * registered; it holds names and IDs and never leaves the office. In the demo it is kept in this
 * browser's localStorage under the "township" screen, and only public fields are used by others.
 */
export type RosterEntry = {
  label: string; // simulated household label, e.g. "Household Lin (sim)"
  village: number;
  tier: number;
  commitment: string;
  receipt: Address;
  registrationId?: number;
};

const KEY = "kept.township-roster";

export function loadRoster(): RosterEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function upsertRoster(entry: RosterEntry) {
  const list = loadRoster().filter((e) => e.commitment !== entry.commitment);
  list.push(entry);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("kept-inbox"));
}
