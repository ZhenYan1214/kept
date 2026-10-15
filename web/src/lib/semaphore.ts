"use client";
import { Group, generateProof, type Identity } from "@semaphore-protocol/core";
import { decodeEventLog } from "viem";
import { publicClient, getLogsChunked } from "./chain";
import { getDeployment } from "./config";
import { semaphoreGroupsAbi } from "@/generated/contracts";

/** Rebuild a Semaphore group (Lean IMT) from on-chain events, exactly as the contract holds it. */
export async function fetchGroup(groupId: bigint): Promise<Group> {
  const d = getDeployment();
  const head = await publicClient.getBlockNumber();
  const logs = await getLogsChunked({
    address: d.semaphore,
    events: semaphoreGroupsAbi.filter(
      (x) => x.type === "event" && ["MemberAdded", "MembersAdded", "MemberUpdated", "MemberRemoved"].includes(x.name),
    ) as never,
    fromBlock: BigInt(d.deployBlock),
    toBlock: head,
  });
  const group = new Group();
  for (const log of logs) {
    const ev = decodeEventLog({ abi: semaphoreGroupsAbi, data: log.data, topics: log.topics });
    const args = ev.args as Record<string, bigint | bigint[]>;
    if (args.groupId !== groupId) continue;
    if (ev.eventName === "MemberAdded") group.addMember(args.identityCommitment as bigint);
    else if (ev.eventName === "MembersAdded") group.addMembers(args.identityCommitments as bigint[]);
    else if (ev.eventName === "MemberUpdated") group.updateMember(Number(args.index), args.newIdentityCommitment as bigint);
    else if (ev.eventName === "MemberRemoved") group.removeMember(Number(args.index));
  }
  return group;
}

export type SolidityProof = {
  merkleTreeDepth: bigint;
  merkleTreeRoot: bigint;
  nullifier: bigint;
  message: bigint;
  scope: bigint;
  points: readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];
};

/** Find which tier group this identity belongs to, and produce a proof for (message, scope). */
export async function proveMembership(
  identity: Identity,
  tierGroups: { tier: number; groupId: bigint }[],
  message: bigint,
  scope: bigint,
): Promise<{ groupId: bigint; tier: number; proof: SolidityProof }> {
  for (const t of tierGroups) {
    const group = await fetchGroup(t.groupId);
    if (group.indexOf(identity.commitment) === -1) continue;
    const p = await generateProof(identity, group, message, scope);
    return {
      groupId: t.groupId,
      tier: t.tier,
      proof: {
        merkleTreeDepth: BigInt(p.merkleTreeDepth),
        merkleTreeRoot: BigInt(p.merkleTreeRoot),
        nullifier: BigInt(p.nullifier),
        message: BigInt(p.message),
        scope: BigInt(p.scope),
        points: p.points.map(BigInt) as unknown as SolidityProof["points"],
      },
    };
  }
  throw new Error("This credential is not (yet) in any verified group for this disaster.");
}

export async function findTier(identity: Identity, tierGroups: { tier: number; groupId: bigint }[]) {
  for (const t of tierGroups) {
    const group = await fetchGroup(t.groupId);
    if (group.indexOf(identity.commitment) !== -1) return t.tier;
  }
  return null;
}
