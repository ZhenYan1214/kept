import { NextResponse } from "next/server";
import { type Hex } from "viem";
import { generateProof } from "@semaphore-protocol/core";
import { ABIS, ensureRoleGas, publicClient, roleAccount, walletFor, waitReceipt, withRoleLock } from "@/server/roles";
import { plan, simHousehold } from "@/server/seed";
import { chain, getDeployment, DEMO_MODE } from "@/lib/config";
import { registryAbi, voiceAbi } from "@/generated/contracts";
import { groups } from "@/server/groups";
import { fromJSONSafe } from "@/lib/serialize";

export const runtime = "nodejs";
export const maxDuration = 120;

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
  await ensureRoleGas("relayer");
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
