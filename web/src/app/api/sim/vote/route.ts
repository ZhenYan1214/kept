import { NextResponse } from "next/server";
import { decodeEventLog, type Hex, type Log } from "viem";
import { Group, generateProof } from "@semaphore-protocol/core";
import { ABIS, publicClient, roleAccount, walletFor, waitReceipt, withRoleLock } from "@/server/roles";
import { plan, simHousehold } from "@/server/seed";
import { chain, getDeployment, DEMO_MODE } from "@/lib/config";
import { registryAbi, semaphoreGroupsAbi, voiceAbi } from "@/generated/contracts";
import { fromJSONSafe } from "@/lib/serialize";

export const runtime = "nodejs";
export const maxDuration = 120;

async function groups(): Promise<Map<bigint, Group>> {
  const d = getDeployment();
  const logs = (await publicClient.getLogs({
    address: d.semaphore,
    events: semaphoreGroupsAbi.filter((x) => x.type === "event" && ["MemberAdded", "MembersAdded", "MemberUpdated", "MemberRemoved"].includes(x.name)) as never,
    fromBlock: BigInt(d.deployBlock),
  })) as Log[];
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

/**
 * DEMO ONLY: other (simulated) verified households cast real anonymous votes, so a veto can be shown
 * with a single live participant. Each vote is a genuine Semaphore proof from a simulated household.
 */
export async function POST(req: Request) {
  if (!DEMO_MODE) return NextResponse.json({ error: "Demo mode is disabled" }, { status: 403 });
  const { voteKey, yes = 0, no = 0 } = fromJSONSafe(await req.json()) as { voteKey: Hex; yes?: number; no?: number };
  const d = getDeployment();
  const disasterId = (await publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "disasterCount" })) as bigint;
  const g = await groups();
  const scope = BigInt(voteKey) >> 8n;
  const wanted = [...Array(yes).fill(1n), ...Array(no).fill(0n)] as bigint[];
  let cast = 0;
  for (const [i, h] of plan().entries()) {
    if (cast >= wanted.length) break;
    const groupId = (await publicClient.readContract({
      address: d.registry,
      abi: registryAbi,
      functionName: "tierGroup",
      args: [disasterId, h.tier],
    })) as bigint;
    const group = g.get(groupId);
    const { identity } = simHousehold(i);
    if (!group || group.indexOf(identity.commitment) === -1) continue;
    const message = wanted[cast];
    const p = await generateProof(identity, group, message, scope);
    const used = await publicClient.readContract({ address: d.voice, abi: voiceAbi, functionName: "nullifierUsed", args: [voteKey, BigInt(p.nullifier)] });
    if (used) continue;
    const proof = {
      merkleTreeDepth: BigInt(p.merkleTreeDepth),
      merkleTreeRoot: BigInt(p.merkleTreeRoot),
      nullifier: BigInt(p.nullifier),
      message: BigInt(p.message),
      scope: BigInt(p.scope),
      points: p.points.map(BigInt),
    };
    await withRoleLock("relayer", async () => {
      const { request } = await publicClient.simulateContract({
        account: roleAccount("relayer"),
        address: d.voice,
        abi: ABIS.voice,
        functionName: "castVote",
        args: [voteKey, groupId, proof],
        chain,
      });
      await waitReceipt(await walletFor("relayer").writeContract(request));
    });
    cast++;
  }
  return NextResponse.json({ cast });
}
