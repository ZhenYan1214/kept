"use client";
import type { Address, Hex } from "viem";
import { fromJSONSafe, toJSONSafe } from "./serialize";
import type { RoleName } from "./scenario";

export type TxEvent = { eventName: string; address: Address; args: Record<string, unknown> };
export type TxResult = { hash: Hex; status: string; events: TxEvent[] };

/** Ask the demo server to sign as an institution, or as the relayer for a household. */
export async function tx(
  role: RoleName,
  target: "registry" | "factory" | "fund" | "ledger" | "voice" | "programs" | "token",
  functionName: string,
  args: unknown[] = [],
  address?: Address,
): Promise<TxResult> {
  const res = await fetch("/api/tx", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(toJSONSafe({ role, target, functionName, args, address })),
  });
  const json = fromJSONSafe(await res.json()) as TxResult & { error?: string };
  if (!res.ok || json.error) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

export function eventArg<T>(r: TxResult, eventName: string, arg: string): T {
  const ev = r.events.find((e) => e.eventName === eventName);
  if (!ev) throw new Error(`Event ${eventName} not found`);
  return ev.args[arg] as T;
}

export async function postJSON<T>(url: string, body: unknown = {}): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(toJSONSafe(body)),
  });
  const json = fromJSONSafe(await res.json()) as T & { error?: string };
  if (!res.ok || (json as { error?: string }).error) throw new Error((json as { error?: string }).error ?? `HTTP ${res.status}`);
  return json;
}
