import "server-only";
import { keccak256, toHex, parseEventLogs, zeroHash, type Address, type Abi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Identity, generateProof } from "@semaphore-protocol/core";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { ABIS, ensureGas, waitReceipt, publicClient, roleAccount, targetAddress, walletFor, withRoleLock, type Target } from "./roles";
import { chain, getDeployment, CHAIN_ID } from "@/lib/config";
import {
  DISASTER_NAME,
  FUND_NAME,
  PURPOSE_CAPS,
  PURPOSES,
  SURPLUS_PURPOSE,
  SURPLUS_RULE,
  TIERS,
  TOWNSHIP,
  VILLAGES,
  type RoleName,
} from "@/lib/scenario";
import { receiptDomain, RECEIPT_TYPES } from "@/lib/receipt";
import { waitingPeriod, waitingScope } from "@/lib/scopes";
import { groups } from "./groups";

const SIM_SEED = process.env.SIM_SEED ?? "kept-simulated-households";
const FUND_LIFETIME = 365n * 86400n;

async function send(role: RoleName, target: Target, functionName: string, args: unknown[], fund?: Address) {
  const address = target === "fund" ? fund! : targetAddress(target);
  return withRoleLock(role, async () => {
    const { request } = await publicClient.simulateContract({
      account: roleAccount(role),
      address,
      abi: ABIS[target],
      functionName,
      args,
      chain,
    });
    const hash = await walletFor(role).writeContract(request);
    const receipt = await waitReceipt(hash);
    return parseEventLogs({ abi: ABIS[target] as Abi, logs: receipt.logs });
  });
}

/** Simulated households (no real people). Each has a Semaphore identity and a receipt key. */
export function simHousehold(i: number) {
  const identity = new Identity(`${SIM_SEED}/identity/${i}`);
  const receipt = privateKeyToAccount(keccak256(toHex(`${SIM_SEED}/receipt/${i}`)));
  return { identity, receipt };
}

type SimPlan = { village: number; tier: number }[];

/** Datong and Dama are well covered; Nanfu, Dajin and Daquan start almost invisible. */
export function plan(): SimPlan {
  const p: SimPlan = [];
  const add = (village: number, tiers: number[]) => tiers.forEach((tier) => p.push({ village, tier }));
  add(VILLAGES[0].code, [0, 0, 1, 1, 1, 2, 2, 2, 2, 2]);
  add(VILLAGES[1].code, [0, 1, 1, 2, 2, 2, 2, 2]);
  add(VILLAGES[3].code, [1, 2]);
  return p;
}

export type SeedLog = string[];

export async function seedScenario(log: SeedLog = []): Promise<{ fund: Address; log: SeedLog }> {
  const d = getDeployment();
  // A fresh scenario (new disaster and fund) may be started again, but not more than once every
  // 15 minutes, so the public demo API cannot be used to drain the demo wallets. (Not on the local
  // devnet, whose seed fast-forwards chain time.)
  const funds = (await publicClient.readContract({ address: d.factory, abi: ABIS.factory, functionName: "allFunds" })) as Address[];
  if (funds.length > 0 && CHAIN_ID !== 31337) {
    const lastDeadline = (await publicClient.readContract({
      address: funds[funds.length - 1],
      abi: ABIS.fund,
      functionName: "deadline",
    })) as bigint;
    const createdAt = lastDeadline - FUND_LIFETIME;
    const age = (await publicClient.getBlock()).timestamp - createdAt;
    if (age < 15n * 60n) throw new Error(`A scenario was started ${age / 60n} min ago; try again in a few minutes`);
  }

  const timelock = Number(process.env.DEMO_TIMELOCK_SECONDS ?? (CHAIN_ID === 31337 ? 7 * 86400 : 300));

  await ensureGas();
  log.push("Topped up gas for demo institutions");

  // 1. Registry: villages, issuers, disaster
  for (const v of VILLAGES) await send("authority", "registry", "setVillage", [v.code, TOWNSHIP.code]);
  await send("authority", "registry", "setIssuer", [roleAccount("office").address, 2, TOWNSHIP.code, true, TOWNSHIP.name]);
  for (let i = 0; i < VILLAGES.length; i++) {
    const role = `chief${i}` as RoleName;
    await send("authority", "registry", "setIssuer", [
      roleAccount(role).address,
      1,
      VILLAGES[i].code,
      true,
      `Village chief — ${VILLAGES[i].name}`,
    ]);
  }
  const created = await send("authority", "registry", "createDisaster", [DISASTER_NAME, [...TIERS]]);
  const disasterId = (created.find((l) => l.eventName === "DisasterCreated") as unknown as { args: { disasterId: bigint } })
    .args.disasterId;
  // The township office designates the social worker as proxy for elders in Datong only.
  await send("office", "registry", "setProxy", [disasterId, VILLAGES[0].code, roleAccount("socialWorker").address, true]);
  log.push(`Disaster #${disasterId} created with ${TIERS.length} damage tiers; ${VILLAGES.length} villages and issuers set`);

  // 2. Fund from the audited template
  const now = (await publicClient.getBlock()).timestamp;
  const fundLogs = await send("custodian", "factory", "createFund", [
    {
      name: FUND_NAME,
      surplusRule: SURPLUS_RULE,
      surplusPurposeId: SURPLUS_PURPOSE,
      custodian: roleAccount("custodian").address,
      token: d.token,
      disasterId,
      deadline: now + FUND_LIFETIME,
      threshold: 2,
      emergencyThreshold: 3,
      timelock,
      quorumBps: 1000,
      committee: [roleAccount("c1").address, roleAccount("c2").address, roleAccount("c3").address],
      purposeNames: [...PURPOSES],
      purposeCaps: PURPOSE_CAPS,
    },
  ]);
  const fund = (fundLogs.find((l) => l.eventName === "FundCreated") as unknown as { args: { fund: Address } }).args.fund;
  log.push(`Fund created at ${fund} (timelock ${timelock}s)`);

  // 3. Donations
  const donations = [3_000_000n, 1_200_000n, 800_000n, 500_000n, 2_000_000n, 300_000n, 150_000n, 50_000n, 1_000_000n, 600_000n];
  const total = donations.reduce((a, b) => a + b, 0n);
  await send("donor", "token", "faucet", [roleAccount("donor").address, total]);
  await send("donor", "token", "approve", [fund, total]);
  for (const amt of donations) await send("donor", "fund", "donate", [amt, zeroHash], fund);
  log.push(`${donations.length} donations, NT$${total.toLocaleString()} raised`);

  // 4. Households: two signatures each
  const p = plan();
  for (const [i, h] of p.entries()) {
    const { identity, receipt } = simHousehold(i);
    const chief = `chief${VILLAGES.findIndex((v) => v.code === h.village)}` as RoleName;
    const tag = keccak256(toHex(`${SIM_SEED}/hmac/${i}`));
    const logs = await send(chief, "registry", "proposeRegistration", [
      disasterId,
      h.tier,
      h.village,
      identity.commitment,
      tag,
      receipt.address,
    ]);
    const id = (logs.find((l) => l.eventName === "RegistrationProposed") as unknown as { args: { id: bigint } }).args.id;
    await send("office", "registry", "approveRegistration", [id]);
  }
  log.push(`${p.length} simulated households verified (chief + township office)`);

  // 5. Appeals: the villages outside the "red zone"
  const appeal = (village: number, text: string) =>
    send("relayer", "registry", "fileAppeal", [disasterId, village, keccak256(toHex(text))]);
  await appeal(VILLAGES[2].code, "Nanfu: house flooded to 1.2m, outside red zone");
  await appeal(VILLAGES[2].code, "Nanfu: road closed, shop flooded");
  await appeal(VILLAGES[4].code, "Daquan: mud in ground floor, not on list");
  const resolved = await appeal(VILLAGES[3].code, "Dajin: renter, household registration elsewhere");
  if (CHAIN_ID === 31337) {
    // Let the resolved appeal wait a realistic 2.5 days on the local devnet.
    await publicClient.request({ method: "evm_increaseTime" as never, params: [216000] as never });
    await publicClient.request({ method: "evm_mine" as never, params: [] as never });
  }
  const appealId = (resolved.find((l) => l.eventName === "AppealFiled") as unknown as { args: { id: bigint } }).args.id;
  await send("office", "registry", "resolveAppeal", [appealId, true, keccak256(toHex("Accepted: residence confirmed by chief"))]);
  await send("office", "registry", "reportCoverage", [disasterId, VILLAGES[0].code, 2]);
  log.push("4 appeals filed (1 resolved); coverage report for Datong");

  // 6. Allocations -> custody chain
  const allocate = async (purpose: number, to: RoleName, amount: bigint, est: number, doc: string) => {
    const logs = await send("c1", "fund", "proposeAllocation", [purpose, roleAccount(to).address, amount, est, keccak256(toHex(doc))], fund);
    const id = (logs.find((l) => l.eventName === "Proposed") as unknown as { args: { id: bigint } }).args.id;
    const ex = await send("c2", "fund", "approve", [id], fund);
    const executed = ex.find((l) => l.eventName === "Executed") as unknown as { args: { hopId: bigint } };
    return executed.args.hopId;
  };
  const livelihoodHop = await allocate(0, "ministry", 1_500_000n, 20, "Pre-allocation: livelihood relief, est. 20 households");
  const housingHop = await allocate(1, "ministry", 1_800_000n, 9, "Pre-allocation: housing repair, est. 9 households");
  const ngoHop = await allocate(2, "ngo", 300_000n, 30, "Grant: household essentials & psychosocial support");

  await send("ministry", "ledger", "acknowledge", [livelihoodHop]);
  await send("ministry", "ledger", "acknowledge", [housingHop]);
  await send("ngo", "ledger", "acknowledge", [ngoHop]);
  const fwd = await send("ministry", "ledger", "forward", [housingHop, roleAccount("county").address, 1_200_000n, 6, keccak256(toHex("bank slip #A-1"))]);
  const countyHop = (fwd.find((l) => l.eventName === "HopCreated") as unknown as { args: { hopId: bigint } }).args.hopId;
  await send("county", "ledger", "acknowledge", [countyHop]);
  await send("ngo", "programs", "createProgram", [ngoHop, disasterId, 0b111, 10_000n, "Household essentials kit"]);

  // Ministry reconciles livelihood relief for the first 12 households (NT$50,000 each)
  const paid = Array.from({ length: 12 }, (_, i) => i);
  const roster = StandardMerkleTree.of(
    paid.map((i) => [simHousehold(i).receipt.address, "50000"]),
    ["address", "uint256"],
  );
  await send("ministry", "ledger", "reconcile", [livelihoodHop, roster.root, 600_000n, paid.length, keccak256(toHex("roster batch 1"))]);
  const domain = receiptDomain(d.ledger);
  for (const [idx, [addr]] of roster.entries()) {
    if (idx >= 10) break; // 10 of 12 answer: 8 confirm, 1 disputes, 1 elder is confirmed by the Datong proxy
    const received = idx !== 4;
    const { receipt } = simHousehold(paid.find((i) => simHousehold(i).receipt.address === addr)!);
    const signer = idx === 9 ? roleAccount("socialWorker") : receipt;
    const signature = await signer.signTypedData({
      domain,
      types: RECEIPT_TYPES,
      primaryType: "Receipt",
      message: { hopId: livelihoodHop, batchIndex: 0n, receipt: addr as Address, amount: 50_000n, received },
    });
    await send("relayer", "ledger", "confirmLine", [livelihoodHop, 0n, addr, 50_000n, received, roster.getProof(idx), signature]);
  }
  log.push("Custody chain seeded: 3 allocations, 1 forward, 1 roster batch, 8 confirmations + 1 by proxy, 1 dispute");

  // 7. Four verified households outside the roster say, anonymously, that they are still waiting.
  const [, , disasterCreatedAt] = (await publicClient.readContract({
    address: d.registry,
    abi: ABIS.registry,
    functionName: "disasters",
    args: [disasterId],
  })) as [boolean, number, bigint];
  const period = waitingPeriod(Number((await publicClient.getBlock()).timestamp), Number(disasterCreatedAt));
  const scope = waitingScope(d.registry, disasterId, period);
  const g = await groups();
  for (const i of [12, 13, 18, 19]) {
    const h = p[i];
    const groupId = (await publicClient.readContract({
      address: d.registry,
      abi: ABIS.registry,
      functionName: "tierGroup",
      args: [disasterId, h.tier],
    })) as bigint;
    const proof = await generateProof(simHousehold(i).identity, g.get(groupId)!, BigInt(h.village), scope);
    await send("relayer", "registry", "reportWaiting", [
      disasterId,
      groupId,
      {
        merkleTreeDepth: BigInt(proof.merkleTreeDepth),
        merkleTreeRoot: BigInt(proof.merkleTreeRoot),
        nullifier: BigInt(proof.nullifier),
        message: BigInt(proof.message),
        scope: BigInt(proof.scope),
        points: proof.points.map(BigInt),
      },
    ]);
  }
  log.push("4 verified households reported anonymously that they are still waiting");

  return { fund, log };
}
