// End-to-end check against a real Semaphore deployment with REAL zero-knowledge proofs.
// Usage: anvil running, contracts deployed (deployments/31337.json), then: node scripts/e2e.mjs
import { readFileSync } from "node:fs";
import {
  createPublicClient,
  createWalletClient,
  http,
  keccak256,
  toHex,
  encodeAbiParameters,
  parseEventLogs,
  defineChain,
  zeroHash,
} from "viem";
import { mnemonicToAccount, generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { Identity, Group, generateProof } from "@semaphore-protocol/core";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

const RPC = process.env.RPC_URL ?? "http://127.0.0.1:8545";
const dep = JSON.parse(readFileSync(new URL("../deployments/31337.json", import.meta.url)));
const abi = (name) => JSON.parse(readFileSync(new URL(`../out/${name}.sol/${name}.json`, import.meta.url))).abi;
const semErrors = abi("ISemaphore").filter((x) => x.type === "error");
const ABI = {
  registry: abi("EligibilityRegistry"),
  factory: abi("KeptFactory"),
  fund: abi("ReliefFund"),
  ledger: abi("CustodyLedger"),
  voice: [...abi("VoiceModule"), ...semErrors],
  programs: [...abi("AidPrograms"), ...semErrors],
  token: abi("MockTWD"),
};

const chain = defineChain({
  id: 31337,
  name: "anvil",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [RPC] } },
});
const pub = createPublicClient({ chain, transport: http(RPC) });
const MNEMONIC = "test test test test test test test test test test test junk";
const acct = (i) => mnemonicToAccount(MNEMONIC, { addressIndex: i });
const [authority, office, chiefA, c1, c2, c3, ministry, ngo, donor, custodian] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(acct);
const wallet = (a) => createWalletClient({ account: a, chain, transport: http(RPC) });

let passed = 0;
const ok = (msg) => (passed++, console.log("  ✔", msg));
const assert = (cond, msg) => {
  if (!cond) throw new Error("ASSERTION FAILED: " + msg);
  ok(msg);
};

async function send(account, address, abiName, functionName, args = []) {
  const { request } = await pub.simulateContract({ account, address, abi: ABI[abiName], functionName, args });
  const hash = await wallet(account).writeContract(request);
  const receipt = await pub.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error(`${functionName} reverted`);
  return parseEventLogs({ abi: ABI[abiName], logs: receipt.logs });
}

async function expectRevert(account, address, abiName, functionName, args, errorName) {
  try {
    await pub.simulateContract({ account, address, abi: ABI[abiName], functionName, args });
  } catch (e) {
    const name = e?.cause?.data?.errorName ?? e?.cause?.reason ?? e.shortMessage;
    if (String(name).includes(errorName)) return ok(`${functionName} rejected with ${errorName}`);
    throw new Error(`${functionName}: expected ${errorName}, got ${name}`);
  }
  throw new Error(`${functionName}: expected revert ${errorName}`);
}

const read = (address, abiName, functionName, args = []) =>
  pub.readContract({ address, abi: ABI[abiName], functionName, args });

const toSolidityProof = (p) => ({
  merkleTreeDepth: BigInt(p.merkleTreeDepth),
  merkleTreeRoot: BigInt(p.merkleTreeRoot),
  nullifier: BigInt(p.nullifier),
  message: BigInt(p.message),
  scope: BigInt(p.scope),
  points: p.points.map(BigInt),
});

const TOWNSHIP = 1001;
const VILLAGE_A = 100101;
const VILLAGE_B = 100102;

console.log("\n1) Authority sets up villages, issuers and the disaster");
await send(authority, dep.registry, "registry", "setVillage", [VILLAGE_A, TOWNSHIP]);
await send(authority, dep.registry, "registry", "setVillage", [VILLAGE_B, TOWNSHIP]);
await send(authority, dep.registry, "registry", "setIssuer", [office.address, 2, TOWNSHIP, true, "Guangfu Township Office (sim)"]);
await send(authority, dep.registry, "registry", "setIssuer", [chiefA.address, 1, VILLAGE_A, true, "Village chief A (sim)"]);
const created = await send(authority, dep.registry, "registry", "createDisaster", [
  "Guangfu barrier lake 2025 (simulated)",
  ["Destroyed", "Severely damaged", "Flooded"],
]);
const disasterId = created.find((l) => l.eventName === "DisasterCreated").args.disasterId;
const groupIds = created.filter((l) => l.eventName === "TierGroupCreated").map((l) => l.args.groupId);
ok(`disaster ${disasterId} with Semaphore groups ${groupIds.join(", ")}`);

console.log("\n2) Five households registered with two signatures each (real Semaphore groups)");
const households = Array.from({ length: 5 }, (_, i) => ({ id: new Identity(`household-${i}`), tier: i % 2 }));
const localGroups = groupIds.map(() => new Group());
for (const [i, h] of households.entries()) {
  const tag = keccak256(toHex(`HMAC(national-id-${i})`));
  const logs = await send(chiefA, dep.registry, "registry", "proposeRegistration", [disasterId, h.tier, VILLAGE_A, h.id.commitment, tag]);
  const regId = logs.find((l) => l.eventName === "RegistrationProposed").args.id;
  await send(office, dep.registry, "registry", "approveRegistration", [regId]);
  localGroups[h.tier].addMember(h.id.commitment);
}
assert((await read(dep.registry, "registry", "verifiedHouseholds", [disasterId])) === 5n, "5 verified households on-chain");

console.log("\n3) An excluded household files an appeal; township resolves it");
await send(donor, dep.registry, "registry", "fileAppeal", [disasterId, VILLAGE_B, keccak256(toHex("flood photos"))]);
await send(office, dep.registry, "registry", "resolveAppeal", [0n, true, keccak256(toHex("accepted"))]);
const vs = await read(dep.registry, "registry", "villageStats", [disasterId, VILLAGE_B]);
assert(vs[1] === 1 && vs[3] === 1, "appeal filed and accepted, visible in village stats");

console.log("\n4) Fund created from the audited template; donations arrive");
const now = (await pub.getBlock()).timestamp;
const fundLogs = await send(custodian, dep.factory, "factory", "createFund", [
  {
    name: "Guangfu Relief Fund (simulated)",
    surplusRule: "Charter purposes for this disaster only",
    custodian: custodian.address,
    token: dep.token,
    disasterId,
    deadline: now + 365n * 86400n,
    threshold: 2,
    emergencyThreshold: 3,
    timelock: 7 * 86400,
    quorumBps: 2000,
    committee: [c1.address, c2.address, c3.address],
    purposeNames: ["Livelihood relief", "Housing repair", "Community recovery"],
    purposeCaps: [6000, 3000, 1000],
  },
]);
const fund = fundLogs.find((l) => l.eventName === "FundCreated").args.fund;
await send(donor, dep.token, "token", "faucet", [donor.address, 1_000_000n]);
await send(donor, dep.token, "token", "approve", [fund, 1_000_000n]);
await send(donor, fund, "fund", "donate", [1_000_000n, zeroHash]);
assert((await read(fund, "fund", "totalRaised")) === 1_000_000n, "NT$1,000,000 raised");
await expectRevert(c1, fund, "fund", "proposeAllocation", [255, ministry.address, 1n, 0, zeroHash], "PurposeNotInCharter");

console.log("\n5) NGO grant -> on-the-spot ZK eligibility check (real proof)");
let logs = await send(c1, fund, "fund", "proposeAllocation", [0, ngo.address, 50_000n, 10, keccak256(toHex("ngo grant"))]);
const allocId = logs.find((l) => l.eventName === "Proposed").args.id;
logs = await send(c2, fund, "fund", "approve", [allocId]);
const ngoHop = (await read(fund, "fund", "proposal", [allocId])).hopId;
await send(ngo, dep.ledger, "ledger", "acknowledge", [ngoHop]);
logs = await send(ngo, dep.programs, "programs", "createProgram", [ngoHop, disasterId, 0b11, 10_000n, "Household essentials"]);
const programId = logs.find((l) => l.eventName === "ProgramCreated").args.programId;
const programScope = await read(dep.programs, "programs", "scopeOf", [programId]);

const h0 = households[0];
let t = Date.now();
const claimProof = await generateProof(h0.id, localGroups[h0.tier], 0, programScope);
console.log(`    (proof generated in ${Date.now() - t} ms)`);
await send(ngo, dep.programs, "programs", "claim", [programId, groupIds[h0.tier], toSolidityProof(claimProof)]);
const hop = await read(dep.ledger, "ledger", "hop", [ngoHop]);
assert(hop.programDelivered === 1 && hop.reconciled === 10_000n, "real ZK claim recorded as an in-person delivery");
await expectRevert(ngo, dep.programs, "programs", "claim", [programId, groupIds[h0.tier], toSolidityProof(claimProof)], "AlreadyClaimed");

const outsider = new Identity("not-registered");
const fakeGroup = new Group([...localGroups[0].members, outsider.commitment]);
const fakeProof = await generateProof(outsider, fakeGroup, 0, programScope);
await expectRevert(ngo, dep.programs, "programs", "claim", [programId, groupIds[0], toSolidityProof(fakeProof)], "Semaphore__MerkleTreeRootIsNotPartOfTheGroup");

console.log("\n6) Cap change queued -> households vote anonymously -> veto");
logs = await send(c1, fund, "fund", "proposeCapChange", [2, 1, 500, 3500, false, keccak256(toHex("move 5% to housing"))]);
const changeId = logs.find((l) => l.eventName === "Proposed").args.id;
await send(c2, fund, "fund", "approve", [changeId]);
const change = await read(fund, "fund", "proposal", [changeId]);
const voteScope = await read(dep.voice, "voice", "scopeOf", [change.voteKey]);
const votes = [0, 0, 1]; // two "no", one "yes"
for (const [i, support] of votes.entries()) {
  const h = households[i + 1];
  const p = await generateProof(h.id, localGroups[h.tier], support, voteScope);
  await send(donor, dep.voice, "voice", "castVote", [change.voteKey, groupIds[h.tier], toSolidityProof(p)]); // relayed
}
const p2 = await generateProof(households[1].id, localGroups[households[1].tier], 1, voteScope);
await expectRevert(donor, dep.voice, "voice", "castVote", [change.voteKey, groupIds[households[1].tier], toSolidityProof(p2)], "AlreadyVoted");
await pub.request({ method: "evm_increaseTime", params: [7 * 86400] });
await pub.request({ method: "evm_mine", params: [] });
await send(donor, fund, "fund", "execute", [changeId]);
assert((await read(fund, "fund", "proposal", [changeId])).status === 3, "households vetoed the change (status Vetoed)");
assert((await read(fund, "fund", "purpose", [1])).capBps === 3000, "housing cap unchanged");

console.log("\n7) Custody chain: ministry reconciles a roster; households confirm / dispute");
logs = await send(c1, fund, "fund", "proposeAllocation", [1, ministry.address, 300_000n, 2, keccak256(toHex("housing pre-allocation"))]);
const a2 = logs.find((l) => l.eventName === "Proposed").args.id;
await send(c2, fund, "fund", "approve", [a2]);
const mHop = (await read(fund, "fund", "proposal", [a2])).hopId;
await send(ministry, dep.ledger, "ledger", "acknowledge", [mHop]);
const receiptKeys = [generatePrivateKey(), generatePrivateKey()].map(privateKeyToAccount);
const roster = StandardMerkleTree.of(
  [
    [receiptKeys[0].address, "200000"],
    [receiptKeys[1].address, "50000"],
  ],
  ["address", "uint256"],
);
await send(ministry, dep.ledger, "ledger", "reconcile", [mHop, roster.root, 250_000n, 2, keccak256(toHex("roster batch 1"))]);
const domain = { name: "Kept CustodyLedger", version: "1", chainId: 31337, verifyingContract: dep.ledger };
const types = {
  Receipt: [
    { name: "hopId", type: "uint256" },
    { name: "batchIndex", type: "uint256" },
    { name: "receipt", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "received", type: "bool" },
  ],
};
for (const [i, [addr, amt]] of [...roster.entries()].map(([i, v]) => [i, v])) {
  const received = i === 0;
  const signer = receiptKeys.find((k) => k.address === addr);
  const message = { hopId: mHop, batchIndex: 0n, receipt: addr, amount: BigInt(amt), received };
  const signature = await signer.signTypedData({ domain, types, primaryType: "Receipt", message });
  await send(donor, dep.ledger, "ledger", "confirmLine", [mHop, 0n, addr, BigInt(amt), received, roster.getProof(i), signature]);
}
const mh = await read(dep.ledger, "ledger", "hop", [mHop]);
assert(mh.confirmed === 1 && mh.disputed === 1, "one household confirmed, one disputed — via signatures only they can make");

console.log(`\nAll ${passed} end-to-end checks passed with real Semaphore proofs.\n`);
process.exit(0);
