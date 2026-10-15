import "server-only";
import { decodeEventLog, type Log } from "viem";
import { Group } from "@semaphore-protocol/core";
import { publicClient } from "./roles";
import { getDeployment } from "@/lib/config";
import { semaphoreGroupsAbi } from "@/generated/contracts";

const CHUNK = 9_000n;

/** Rebuild every Semaphore group from on-chain events (server side, for simulated households). */
export async function groups(): Promise<Map<bigint, Group>> {
  const d = getDeployment();
  const head = await publicClient.getBlockNumber();
  const events = semaphoreGroupsAbi.filter(
    (x) => x.type === "event" && ["MemberAdded", "MembersAdded", "MemberUpdated", "MemberRemoved"].includes(x.name),
  ) as never;
  // Public RPCs cap the block range of a log query, so walk the chain in chunks.
  const logs: Log[] = [];
  for (let from = BigInt(d.deployBlock); from <= head; from += CHUNK) {
    const to = from + CHUNK - 1n > head ? head : from + CHUNK - 1n;
    logs.push(...((await publicClient.getLogs({ address: d.semaphore, events, fromBlock: from, toBlock: to })) as Log[]));
  }
  const out = new Map<bigint, Group>();
  for (const log of logs) {
    const ev = decodeEventLog({ abi: semaphoreGroupsAbi, data: log.data, topics: log.topics });
    const a = ev.args as Record<string, bigint | bigint[]>;
    const g = out.get(a.groupId as bigint) ?? new Group();
    out.set(a.groupId as bigint, g);
    if (ev.eventName === "MemberAdded") g.addMember(a.identityCommitment as bigint);
    else if (ev.eventName === "MembersAdded") g.addMembers(a.identityCommitments as bigint[]);
    else if (ev.eventName === "MemberUpdated") g.updateMember(Number(a.index), a.newIdentityCommitment as bigint);
    else if (ev.eventName === "MemberRemoved") g.removeMember(Number(a.index));
  }
  return out;
}
