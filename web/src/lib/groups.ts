import { Group } from "@semaphore-protocol/core";

/**
 * Rebuild a Semaphore group from the registry's `groupMembers` (leaves in tree order, 0 = revoked).
 * A revoked leaf is reproduced by adding a placeholder and setting it to 0, exactly as the on-chain
 * tree did, so the Merkle root matches.
 */
export function buildGroup(members: readonly bigint[]): Group {
  const group = new Group();
  members.forEach((m, i) => {
    if (m !== 0n) group.addMember(m);
    else {
      group.addMember(1n);
      group.removeMember(i);
    }
  });
  return group;
}
