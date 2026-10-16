import "server-only";
import { keccak256, toHex, parseEventLogs, zeroHash, type Address, type Abi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Identity, generateProof } from "@semaphore-protocol/core";
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
import { receiptDomain, AUDIT_VISIT_TYPES, RECEIPT_TYPES } from "@/lib/receipt";
import { lineKey, waitingPeriod, waitingScope } from "@/lib/scopes";
import { groupOf } from "./groups";

const SIM_SEED = process.env.SIM_SEED ?? "kept-simulated-households";
const FUND_LIFETIME = 365n * 86400n;

async function send(role: RoleName, target: Target, functionName: string, args: unknown[], fund?: Address) {
  const address = target === "fund" ? fund! : targetAddress(target);
  return withRoleLock(role, async () => {
    const { request } = await simulateWithRetry({
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

/**
 * A public RPC is served by several nodes, and the next call can reach one that has not seen the
 * block we just waited for (e.g. "UnknownDisaster" right after createDisaster). On a live chain,
 * retry the simulation a few times before treating a revert as real.
 */
async function simulateWithRetry(params: Parameters<typeof publicClient.simulateContract>[0]) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await publicClient.simulateContract(params);
    } catch (e) {
      if (CHAIN_ID === 31337 || attempt >= 6) throw e;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
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

/**
 * Simulated households that, in this scenario, did not actually receive their line: #4 disputed it
 * itself; #11 never answered, and says so only if the audit sample reaches it.
 */
const NOT_RECEIVED = new Set([4, 11]);

/**
 * DEMO: the independent auditor visits each sampled line not visited yet. A simulated household signs
 * the visit with its own receipt key; a line with no registered household behind it is recorded as
 * "not found" by the auditor. Lines of live demo users are left for them (Household screen).
 */
export async function auditVisits(hopId: bigint, batchIndex: bigint) {
  const d = getDeployment();
  const read = (functionName: string, args: unknown[]) =>
    publicClient.readContract({ address: d.ledger, abi: ABIS.ledger, functionName, args });
  let picks = (await read("auditPicks", [hopId, batchIndex])) as Address[];
  // Right after the draw, a load-balanced public RPC may answer from a node that has not seen it yet.
  for (let attempt = 0; picks.length === 0 && CHAIN_ID !== 31337 && attempt < 6; attempt++) {
    await new Promise((r) => setTimeout(r, 2000));
    picks = (await read("auditPicks", [hopId, batchIndex])) as Address[];
  }
  const fund = (await read("hop", [hopId])) as { fund: Address };
  const disasterId = (await publicClient.readContract({ address: fund.fund, abi: ABIS.fund, functionName: "disasterId" })) as bigint;
  const households = plan().map((_, i) => simHousehold(i).receipt);
  const auditor = roleAccount("auditor").address;
  let visited = 0;
  let live = 0;
  for (const receipt of picks) {
    if (Number(await read("auditOutcome", [lineKey(hopId, batchIndex, receipt)])) !== 0) continue;
    const i = households.findIndex((h) => h.address === receipt);
    if (i === -1) {
      const village = Number(
        await publicClient.readContract({ address: d.registry, abi: ABIS.registry, functionName: "villageOfReceipt", args: [disasterId, receipt] }),
      );
      if (village !== 0) {
        live++; // a live demo household: it signs on its own screen
        continue;
      }
      await send("auditor", "ledger", "recordAuditVisit", [hopId, batchIndex, receipt, 3, "0x"]);
      visited++;
      continue;
    }
    const amount = (await read("lineAmount", [hopId, batchIndex, receipt])) as bigint;
    const received = !NOT_RECEIVED.has(i);
    const signature = await households[i].signTypedData({
      domain: receiptDomain(d.ledger),
      types: AUDIT_VISIT_TYPES,
      primaryType: "AuditVisit",
      message: { hopId, batchIndex, receipt, amount, received, auditor },
    });
    await send("auditor", "ledger", "recordAuditVisit", [hopId, batchIndex, receipt, received ? 1 : 2, signature]);
    visited++;
  }
  return { sampled: picks.length, visited, live };
}

/** Draw a batch's audit sample. On the local devnet, mine the blocks up to its seed block first. */
export async function drawAudit(hopId: bigint, batchIndex: bigint) {
  const d = getDeployment();
  if (CHAIN_ID === 31337) {
    const b = (await publicClient.readContract({ address: d.ledger, abi: ABIS.ledger, functionName: "batch", args: [hopId, batchIndex] })) as {
      atBlock: bigint;
    };
    const target = b.atBlock + 3n; // the seed block (published + AUDIT_DELAY) must already exist
    while ((await publicClient.getBlockNumber()) < target) {
      await publicClient.request({ method: "evm_mine" as never, params: [] as never });
    }
  }
  await send("relayer", "ledger", "drawAudit", [hopId, batchIndex]);
}

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
  // The registry authority appoints an auditor independent of every custodian (sample visits).
  await send("authority", "ledger", "setAuditor", [roleAccount("auditor").address, true]);
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

  // Ministry publishes livelihood relief for the first 12 households (NT$50,000 each) as pseudonymous lines
  const paid = Array.from({ length: 12 }, (_, i) => simHousehold(i).receipt);
  await send("ministry", "ledger", "reconcile", [
    livelihoodHop,
    paid.map((r) => r.address),
    paid.map(() => 50_000n),
    keccak256(toHex("roster batch 1")),
  ]);
  const domain = receiptDomain(d.ledger);
  for (const [idx, receipt] of paid.entries()) {
    if (idx >= 10) break; // 10 of 12 answer: 8 confirm, 1 disputes, 1 elder is confirmed by the Datong proxy
    const received = idx !== 4;
    const signer = idx === 9 ? roleAccount("socialWorker") : receipt;
    const signature = await signer.signTypedData({
      domain,
      types: RECEIPT_TYPES,
      primaryType: "Receipt",
      message: { hopId: livelihoodHop, batchIndex: 0n, receipt: receipt.address, amount: 50_000n, received },
    });
    await send("relayer", "ledger", "confirmLine", [livelihoodHop, 0n, receipt.address, received, signature]);
  }
  log.push("Custody chain seeded: 3 allocations, 1 forward, 1 roster batch, 8 confirmations + 1 by proxy, 1 dispute");

  // Sample audit of that batch: drawn in a later block, then the auditor visits the sampled households.
  await drawAudit(livelihoodHop, 0n);
  const audit = await auditVisits(livelihoodHop, 0n);
  log.push(`Audit sample of ${audit.sampled} drawn; the independent auditor visited ${audit.visited}`);

  // 7. Four verified households outside the roster say, anonymously, that they are still waiting.
  const [, , disasterCreatedAt] = (await publicClient.readContract({
    address: d.registry,
    abi: ABIS.registry,
    functionName: "disasters",
    args: [disasterId],
  })) as [boolean, number, bigint];
  const period = waitingPeriod(Number((await publicClient.getBlock()).timestamp), Number(disasterCreatedAt));
  const scope = waitingScope(d.registry, disasterId, period);
  for (const i of [12, 13, 18, 19]) {
    const h = p[i];
    const groupId = (await publicClient.readContract({
      address: d.registry,
      abi: ABIS.registry,
      functionName: "tierGroup",
      args: [disasterId, h.tier],
    })) as bigint;
    const proof = await generateProof(simHousehold(i).identity, await groupOf(groupId), BigInt(h.village), scope);
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
