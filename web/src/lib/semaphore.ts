"use client";
import { generateProof, type Group, type Identity } from "@semaphore-protocol/core";
import { publicClient } from "./chain";
import { getDeployment } from "./config";
import { buildGroup } from "./groups";
import { registryAbi } from "@/generated/contracts";

/** Rebuild a Semaphore group exactly as the contract holds it, from the registry's member list. */
export async function fetchGroup(groupId: bigint): Promise<Group> {
  const members = await publicClient.readContract({
    address: getDeployment().registry,
    abi: registryAbi,
    functionName: "groupMembers",
    args: [groupId],
  });
  return buildGroup(members);
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
