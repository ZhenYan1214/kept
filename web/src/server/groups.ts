import "server-only";
import type { Group } from "@semaphore-protocol/core";
import { publicClient } from "./roles";
import { getDeployment } from "@/lib/config";
import { buildGroup } from "@/lib/groups";
import { registryAbi } from "@/generated/contracts";

/** Rebuild one Semaphore group from the registry (server side, for simulated households). */
export async function groupOf(groupId: bigint): Promise<Group> {
  const members = await publicClient.readContract({
    address: getDeployment().registry,
    abi: registryAbi,
    functionName: "groupMembers",
    args: [groupId],
  });
  return buildGroup(members);
}
