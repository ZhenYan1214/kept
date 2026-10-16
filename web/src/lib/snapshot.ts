import { type Address, type Hex } from "viem";
import { publicClient } from "./chain";
import { getDeployment } from "./config";
import {
  registryAbi,
  factoryAbi,
  fundAbi,
  ledgerAbi,
  voiceAbi,
  programsAbi,
} from "@/generated/contracts";
import { lineKey } from "./scopes";
import type { AuditPick } from "./audit";

export type Issuer = {
  address: Address;
  role: number; // 1 chief, 2 township office
  active: boolean;
  region: number;
  proposed: number;
  approved: number;
  rejected: number;
  revoked: number;
  appealsResolved: number;
  name: string;
};

export type Registration = {
  id: number;
  disasterId: bigint;
  commitment: bigint;
  proposer: Address;
  decider: Address;
  proposedAt: number;
  decidedAt: number;
  village: number;
  tier: number;
  status: number; // 1 pending, 2 approved, 3 rejected
};

export type Appeal = {
  id: number;
  disasterId: bigint;
  evidenceHash: Hex;
  resolutionHash: Hex;
  resolver: Address;
  filedAt: number;
  resolvedAt: number;
  village: number;
  status: number; // 1 pending, 2 accepted, 3 rejected
};

export type VillageStats = {
  code: number;
  verified: number;
  appealsFiled: number;
  appealsPending: number;
  appealsAccepted: number;
  appealsRejected: number;
  unserved: number;
  resolutionSecondsTotal: number;
  coverageAsOf: number;
  waitingNow: number; // anonymous "still waiting" reports this period (self-declared village)
  waitingLast: number; // ... and the previous period
};

export type Tier = { tier: number; name: string; groupId: bigint };

export type Disaster = { id: bigint; name: string; tierCount: number; verified: number; createdAt: number; tiers: Tier[] };

export type Purpose = { id: number; name: string; capBps: number; allocated: bigint };

export type Vote = {
  key: Hex;
  disasterId: bigint;
  eligible: number;
  opensAt: number;
  closesAt: number;
  yes: number;
  no: number;
  quorumBps: number;
  vetoed: boolean;
};

export type Proposal = {
  id: number;
  kind: number; // 0 allocation, 1 cap change, 2 extension, 3 surplus use
  status: number; // 0 pending, 1 queued, 2 executed, 3 vetoed, 4 cancelled, 5 overturned on review
  emergency: boolean;
  movedBps: number;
  reviewConcluded: boolean;
  purposeId: number;
  toPurposeId: number;
  approvals: number;
  approvedBy: Address[];
  newCapFrom: number;
  newCapTo: number;
  estHouseholds: number;
  newDeadline: number;
  createdAt: number;
  executeAfter: number;
  proposer: Address;
  recipient: Address;
  amount: bigint;
  hopId: bigint;
  docHash: Hex;
  vote?: Vote;
};

export type Donation = { donor: Address; amount: bigint; receiptNo: bigint; at: number };

export type Fund = {
  address: Address;
  name: string;
  surplusRule: string;
  surplusPurposeId: number;
  emergencyRevoked: boolean;
  custodian: Address;
  disasterId: bigint;
  deadline: number;
  threshold: number;
  emergencyThreshold: number;
  timelock: number;
  quorumBps: number;
  committee: Address[];
  purposes: Purpose[];
  totalRaised: bigint;
  totalAllocated: bigint;
  balance: bigint;
  donationCount: number;
  donations: Donation[]; // the most recent ones (see RECENT_DONATIONS)
  proposals: Proposal[];
};

export type Batch = {
  index: number;
  amount: bigint;
  households: number; // number of published lines
  unregistered: number;
  docHash: Hex;
  at: number;
  atBlock: number;
  auditSeedBlock: number; // block whose hash seeded the sample (0 = not drawn)
  audit: AuditPick[]; // sampled lines and the auditor's recorded visits (empty until drawn)
};

export type Hop = {
  id: number;
  parent: number;
  fund: Address;
  from: Address;
  to: Address;
  amount: bigint;
  forwarded: bigint;
  reconciled: bigint;
  evidenceHash: Hex;
  createdAt: number;
  ackAt: number;
  estHouseholds: number;
  reconciledHouseholds: number;
  confirmed: number;
  proxyConfirmed: number;
  disputed: number;
  programDelivered: number;
  purposeId: number;
  unregistered: number; // roster lines that are not registered households
  batches: Batch[];
};

export type Program = {
  id: number;
  ngo: Address;
  hopId: number;
  disasterId: bigint;
  amountPerHousehold: bigint;
  tierMask: number;
  claims: number;
  active: boolean;
  name: string;
};

export type Snapshot = {
  block: bigint;
  timestamp: number;
  seeded: boolean;
  disaster: Disaster | null;
  villages: { code: number; township: number }[];
  villageStats: VillageStats[];
  issuers: Issuer[];
  registrations: Registration[];
  appeals: Appeal[];
  fund: Fund | null;
  hops: Hop[];
  programs: Program[];
};

const n = (x: bigint | number) => Number(x);

/**
 * The fund shown is the most recent one created for the demo custodian (when known), so a fund
 * anyone else creates through the open factory cannot take over the dashboard. Everything else is
 * filtered to that fund and its disaster.
 */
async function pickFund(funds: readonly Address[], custodian?: Address): Promise<Address | undefined> {
  for (let i = funds.length - 1; i >= 0; i--) {
    if (!custodian) return funds[i];
    const c = (await publicClient.readContract({ address: funds[i], abi: fundAbi, functionName: "custodian" })) as Address;
    if (c.toLowerCase() === custodian.toLowerCase()) return funds[i];
  }
  return undefined;
}

export async function loadSnapshot(custodian?: Address): Promise<Snapshot> {
  const d = getDeployment();
  const head = await publicClient.getBlock();

  // Everything is read with plain calls; nothing depends on event logs (public RPCs cap log ranges).
  const [issuerCount, villageCount, regCount, appealCount, disasterCount, funds, hopCount, programCount] = await Promise.all([
    publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "issuerCount" }),
    publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "villageCount" }),
    publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "registrationCount" }),
    publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "appealCount" }),
    publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "disasterCount" }),
    publicClient.readContract({ address: d.factory, abi: factoryAbi, functionName: "allFunds" }),
    publicClient.readContract({ address: d.ledger, abi: ledgerAbi, functionName: "hopCount" }),
    publicClient.readContract({ address: d.programs, abi: programsAbi, functionName: "programCount" }),
  ]);

  const fundAddr = await pickFund(funds as readonly Address[], custodian);
  const disasterId = fundAddr
    ? ((await publicClient.readContract({ address: fundAddr, abi: fundAbi, functionName: "disasterId" })) as bigint)
    : disasterCount;

  const [issuerAddrs, villageList] = await Promise.all([
    Promise.all(
      Array.from({ length: n(issuerCount) }, (_, i) =>
        publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "issuerList", args: [BigInt(i)] }),
      ),
    ),
    Promise.all(
      Array.from({ length: n(villageCount) }, async (_, i) => {
        const code = await publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "villageList", args: [BigInt(i)] });
        const township = await publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "townshipOf", args: [code] });
        return [n(code), n(township)] as const;
      }),
    ),
  ]);
  const villages = new Map<number, number>(villageList);

  // --- registry ---
  let disaster: Disaster | null = null;
  if (disasterId > 0n) {
    const [, tierCount, createdAt, verified, name] = await publicClient.readContract({
      address: d.registry,
      abi: registryAbi,
      functionName: "disasters",
      args: [disasterId],
    });
    const tiers = await Promise.all(
      Array.from({ length: n(tierCount) }, async (_, tier) => {
        const [groupId, tierName] = await Promise.all([
          publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "tierGroup", args: [disasterId, tier] }),
          publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "tierName", args: [disasterId, tier] }),
        ]);
        return { tier, name: tierName, groupId } satisfies Tier;
      }),
    );
    disaster = { id: disasterId, name, tierCount: n(tierCount), verified: n(verified), createdAt: n(createdAt), tiers };
  }

  const [issuers, registrations, appeals, villageStats] = await Promise.all([
    Promise.all(
      issuerAddrs.map(async (address) => {
        const r = await publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "issuers", args: [address] });
        return {
          address,
          role: n(r[0]),
          active: r[1],
          region: n(r[2]),
          proposed: n(r[3]),
          approved: n(r[4]),
          rejected: n(r[5]),
          revoked: n(r[6]),
          appealsResolved: n(r[7]),
          name: r[8],
        } satisfies Issuer;
      }),
    ),
    Promise.all(
      Array.from({ length: n(regCount) }, async (_, id) => {
        const r = await publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "registrations", args: [BigInt(id)] });
        return {
          id,
          disasterId: r[0],
          commitment: r[1],
          proposer: r[3],
          decider: r[4],
          proposedAt: n(r[5]),
          decidedAt: n(r[6]),
          village: n(r[7]),
          tier: n(r[8]),
          status: n(r[9]),
        } satisfies Registration;
      }),
    ),
    Promise.all(
      Array.from({ length: n(appealCount) }, async (_, id) => {
        const r = await publicClient.readContract({ address: d.registry, abi: registryAbi, functionName: "appeals", args: [BigInt(id)] });
        return {
          id,
          disasterId: r[0],
          evidenceHash: r[1],
          resolutionHash: r[2],
          resolver: r[3],
          filedAt: n(r[4]),
          resolvedAt: n(r[5]),
          village: n(r[6]),
          status: n(r[7]),
        } satisfies Appeal;
      }),
    ),
    disaster
      ? Promise.all(
          [...villages.keys()].map(async (code) => {
            const period = BigInt(Math.max(0, Math.floor((n(head.timestamp) - disaster!.createdAt) / (7 * 86400))));
            const waiting = (p: bigint) =>
              p < 0n
                ? Promise.resolve(0)
                : publicClient
                    .readContract({ address: d.registry, abi: registryAbi, functionName: "waitingReports", args: [disaster!.id, p, code] })
                    .then(n);
            const [r, waitingNow, waitingLast] = await Promise.all([
              publicClient.readContract({
                address: d.registry,
                abi: registryAbi,
                functionName: "villageStats",
                args: [disaster!.id, code],
              }),
              waiting(period),
              waiting(period - 1n),
            ]);
            return {
              code,
              verified: n(r[0]),
              appealsFiled: n(r[1]),
              appealsPending: n(r[2]),
              appealsAccepted: n(r[3]),
              appealsRejected: n(r[4]),
              unserved: n(r[5]),
              resolutionSecondsTotal: n(r[6]),
              coverageAsOf: n(r[7]),
              waitingNow,
              waitingLast,
            } satisfies VillageStats;
          }),
        )
      : Promise.resolve([] as VillageStats[]),
  ]);

  // --- fund (see pickFund) ---
  const fund = fundAddr ? await loadFund(fundAddr) : null;

  // --- custody ledger ---
  const hops = await Promise.all(
    Array.from({ length: n(hopCount) }, async (_, i) => {
      const id = i + 1;
      const [h, batchCount] = await Promise.all([
        publicClient.readContract({ address: d.ledger, abi: ledgerAbi, functionName: "hop", args: [BigInt(id)] }),
        publicClient.readContract({ address: d.ledger, abi: ledgerAbi, functionName: "batchCount", args: [BigInt(id)] }),
      ]);
      const batches = await Promise.all(
        Array.from({ length: n(batchCount) }, async (_, b) => {
          const [r, picks, seedBlock] = await Promise.all([
            publicClient.readContract({ address: d.ledger, abi: ledgerAbi, functionName: "batch", args: [BigInt(id), BigInt(b)] }),
            publicClient.readContract({ address: d.ledger, abi: ledgerAbi, functionName: "auditPicks", args: [BigInt(id), BigInt(b)] }),
            publicClient.readContract({
              address: d.ledger,
              abi: ledgerAbi,
              functionName: "auditSeedBlockUsed",
              args: [BigInt(id), BigInt(b)],
            }),
          ]);
          const audit = await Promise.all(
            picks.map(async (receipt) => {
              const outcome = await publicClient.readContract({
                address: d.ledger,
                abi: ledgerAbi,
                functionName: "auditOutcome",
                args: [lineKey(BigInt(id), BigInt(b), receipt)],
              });
              return { receipt, outcome: n(outcome) } satisfies AuditPick;
            }),
          );
          return {
            index: b,
            amount: r.amount,
            households: n(r.households),
            unregistered: n(r.unregistered),
            docHash: r.docHash,
            at: n(r.at),
            atBlock: n(r.atBlock),
            auditSeedBlock: n(seedBlock),
            audit,
          } satisfies Batch;
        }),
      );
      return {
        id,
        parent: n(h.parent),
        fund: h.fund,
        from: h.from,
        to: h.to,
        amount: h.amount,
        forwarded: h.forwarded,
        reconciled: h.reconciled,
        evidenceHash: h.evidenceHash,
        createdAt: n(h.createdAt),
        ackAt: n(h.ackAt),
        estHouseholds: n(h.estHouseholds),
        reconciledHouseholds: n(h.reconciledHouseholds),
        confirmed: n(h.confirmed),
        proxyConfirmed: n(h.proxyConfirmed),
        disputed: n(h.disputed),
        programDelivered: n(h.programDelivered),
        purposeId: n(h.purposeId),
        unregistered: n(h.unregistered),
        batches,
      } satisfies Hop;
    }),
  );

  const programs = await Promise.all(
    Array.from({ length: n(programCount) }, async (_, i) => {
      const id = i + 1;
      const p = await publicClient.readContract({ address: d.programs, abi: programsAbi, functionName: "program", args: [BigInt(id)] });
      return {
        id,
        ngo: p.ngo,
        hopId: n(p.hopId),
        disasterId: p.disasterId,
        amountPerHousehold: p.amountPerHousehold,
        tierMask: n(p.tierMask),
        claims: n(p.claims),
        active: p.active,
        name: p.name,
      } satisfies Program;
    }),
  );

  return {
    block: head.number,
    timestamp: n(head.timestamp),
    seeded: !!fund,
    disaster,
    villages: [...villages.entries()].map(([code, township]) => ({ code, township })),
    villageStats,
    issuers,
    registrations: registrations.filter((r) => r.disasterId === disasterId),
    appeals: appeals.filter((a) => a.disasterId === disasterId),
    fund,
    hops: hops.filter((h) => fundAddr && h.fund.toLowerCase() === fundAddr.toLowerCase()),
    programs: programs.filter((p) => p.disasterId === disasterId),
  };
}

const RECENT_DONATIONS = 12;

async function loadFund(address: Address): Promise<Fund> {
  const d = getDeployment();
  const read = <F extends string>(functionName: F, args: unknown[] = []) =>
    publicClient.readContract({ address, abi: fundAbi, functionName: functionName as never, args: args as never });

  const [
    name,
    surplusRule,
    surplusPurposeId,
    emergencyRevoked,
    custodian,
    disasterId,
    deadline,
    threshold,
    emergencyThreshold,
    timelock,
    quorumBps,
    committee,
    purposeCount,
    totalRaised,
    totalAllocated,
    balance,
    proposalCount,
    donationCount,
  ] = await Promise.all([
    read("name"),
    read("surplusRule"),
    read("surplusPurposeId"),
    read("emergencyRevoked"),
    read("custodian"),
    read("disasterId"),
    read("deadline"),
    read("threshold"),
    read("emergencyThreshold"),
    read("timelock"),
    read("quorumBps"),
    read("committee"),
    read("purposeCount"),
    read("totalRaised"),
    read("totalAllocated"),
    read("balance"),
    read("proposalCount"),
    read("donationCount"),
  ]);

  const members = committee as unknown as Address[];
  const purposes = await Promise.all(
    Array.from({ length: n(purposeCount as bigint) }, async (_, id) => {
      const p = (await read("purpose", [id])) as unknown as { name: string; capBps: number; allocated: bigint };
      return { id, name: p.name, capBps: n(p.capBps), allocated: p.allocated } satisfies Purpose;
    }),
  );

  const proposals = await Promise.all(
    Array.from({ length: n(proposalCount as bigint) }, async (_, id) => {
      const p = (await read("proposal", [BigInt(id)])) as unknown as Record<string, never>;
      const approvedBy = (
        await Promise.all(members.map(async (m) => ((await read("hasApproved", [BigInt(id), m])) ? m : null)))
      ).filter(Boolean) as Address[];
      let vote: Vote | undefined;
      const voteKey = p.voteKey as Hex;
      if (voteKey && BigInt(voteKey) !== 0n) {
        const [v, vetoed] = await Promise.all([
          publicClient.readContract({ address: d.voice, abi: voiceAbi, functionName: "votes", args: [voteKey] }),
          publicClient.readContract({ address: d.voice, abi: voiceAbi, functionName: "isVetoed", args: [voteKey] }),
        ]);
        vote = {
          key: voteKey,
          disasterId: v[1],
          eligible: n(v[2]),
          opensAt: n(v[4]),
          closesAt: n(v[5]),
          yes: n(v[6]),
          no: n(v[7]),
          quorumBps: n(v[8]),
          vetoed,
        };
      }
      return {
        id,
        kind: n(p.kind),
        status: n(p.status),
        emergency: p.emergency as boolean,
        movedBps: n(p.movedBps),
        reviewConcluded: p.reviewConcluded as boolean,
        purposeId: n(p.purposeId),
        toPurposeId: n(p.toPurposeId),
        approvals: n(p.approvals),
        approvedBy,
        newCapFrom: n(p.newCapFrom),
        newCapTo: n(p.newCapTo),
        estHouseholds: n(p.estHouseholds),
        newDeadline: n(p.newDeadline),
        createdAt: n(p.createdAt),
        executeAfter: n(p.executeAfter),
        proposer: p.proposer as Address,
        recipient: p.recipient as Address,
        amount: p.amount as bigint,
        hopId: p.hopId as bigint,
        docHash: p.docHash as Hex,
        vote,
      } satisfies Proposal;
    }),
  );

  const count = n(donationCount as bigint);
  const donations = await Promise.all(
    Array.from({ length: Math.min(count, RECENT_DONATIONS) }, async (_, i) => {
      const receiptNo = BigInt(count - Math.min(count, RECENT_DONATIONS) + i + 1);
      const r = (await read("donation", [receiptNo])) as unknown as { donor: Address; amount: bigint; at: bigint };
      return { donor: r.donor, amount: r.amount, receiptNo, at: n(r.at) } satisfies Donation;
    }),
  );

  return {
    address,
    name: name as string,
    surplusRule: surplusRule as string,
    surplusPurposeId: n(surplusPurposeId as number),
    emergencyRevoked: emergencyRevoked as boolean,
    custodian: custodian as Address,
    disasterId: disasterId as bigint,
    deadline: n(deadline as bigint),
    threshold: n(threshold as number),
    emergencyThreshold: n(emergencyThreshold as number),
    timelock: n(timelock as number),
    quorumBps: n(quorumBps as number),
    committee: members,
    purposes,
    totalRaised: totalRaised as bigint,
    totalAllocated: totalAllocated as bigint,
    balance: balance as bigint,
    donationCount: count,
    donations,
    proposals,
  };
}
