import { NextResponse } from "next/server";
import { BaseError, ContractFunctionRevertedError, parseEventLogs, type Address, type Abi } from "viem";
import { ABIS, ALLOWED, assertFund, publicClient, roleAccount, targetAddress, walletFor, withRoleLock, waitReceipt, type Target } from "@/server/roles";
import { ROLES, type RoleName } from "@/lib/scenario";
import { fromJSONSafe, toJSONSafe } from "@/lib/serialize";
import { DEMO_MODE, chain } from "@/lib/config";
import { registryAbi, factoryAbi, fundAbi, ledgerAbi, voiceAbi, programsAbi, tokenAbi } from "@/generated/contracts";

export const runtime = "nodejs";

const ALL_EVENTS = [
  ...registryAbi,
  ...factoryAbi,
  ...fundAbi,
  ...ledgerAbi,
  ...voiceAbi,
  ...programsAbi,
  ...tokenAbi,
].filter((x) => x.type === "event") as Abi;

type Body = { role: RoleName; target: Target; address?: Address; functionName: string; args?: unknown[] };

/**
 * DEMO MODE ONLY. Signs a transaction as one of the demo institutions (township office, committee,
 * NGO...) or as the relayer that pays gas for households. In production each institution signs with
 * its own wallet and households' proofs/signatures are relayed by any public relayer.
 */
export async function POST(req: Request) {
  if (!DEMO_MODE) return NextResponse.json({ error: "Demo mode is disabled" }, { status: 403 });
  let body: Body;
  try {
    body = fromJSONSafe(await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const { role, target, functionName } = body;
  const args = body.args ?? [];
  if (!(role in ROLES)) return NextResponse.json({ error: "Unknown role" }, { status: 400 });
  if (!ALLOWED[role]?.[target]?.includes(functionName)) {
    return NextResponse.json({ error: `${ROLES[role].short} may not call ${target}.${functionName}` }, { status: 403 });
  }

  try {
    let address: Address;
    if (target === "fund") {
      if (!body.address) throw new Error("Fund address required");
      await assertFund(body.address);
      address = body.address;
    } else {
      address = targetAddress(target);
    }
    const abi = ABIS[target];
    const account = roleAccount(role);
    const { hash, receipt } = await withRoleLock(role, async () => {
      const { request } = await publicClient.simulateContract({ account, address, abi, functionName, args, chain });
      const hash = await walletFor(role).writeContract(request);
      const receipt = await waitReceipt(hash);
      return { hash, receipt };
    });
    const events = parseEventLogs({ abi: ALL_EVENTS, logs: receipt.logs }).map((l) => ({
      eventName: l.eventName,
      address: l.address,
      args: l.args,
    }));
    return NextResponse.json(toJSONSafe({ hash, status: receipt.status, events }));
  } catch (e) {
    return NextResponse.json({ error: explain(e) }, { status: 400 });
  }
}

function explain(e: unknown): string {
  if (e instanceof BaseError) {
    const revert = e.walk((err) => err instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError) {
      const name = revert.data?.errorName ?? revert.reason;
      const args = revert.data?.args?.length ? `(${revert.data.args.map(String).join(", ")})` : "";
      return `${name ?? "Reverted"}${args}`;
    }
    return e.shortMessage;
  }
  return e instanceof Error ? e.message : String(e);
}
