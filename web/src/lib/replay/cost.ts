/**
 * On-chain cost of running Kept for a disaster the size of Guangfu 2025.
 *
 * Gas per operation was MEASURED on 2026-10-15: every transaction of `npm run e2e` (real Semaphore
 * verifier, not the unit-test mock) on a local chain, averaged per function.
 * Counts come from the foundation's disclosure where it says so; the rest are stated assumptions.
 * Prices are ASSUMPTIONS and are shown as a range on purpose.
 */

export type CostLine = { op: string; gasEach: number; count: number; basis: string };

const REGISTER = 208_018 + 324_406; // proposeRegistration + approveRegistration (adds to the Semaphore tree)
const TRANSFER = 185_000 + 308_808 + 32_642; // proposeAllocation + approve (executes) + acknowledge
const ROSTER_BATCH = 207_000; // reconcile: fixed part of publishing one batch
const ROSTER_LINE = 52_000; // reconcile: each published line (receipt address + amount, registry check)
const CONFIRM = 79_390; // confirmLine: one household's signed "received" / "not received"
const VOTE = 311_493; // castVote: real Semaphore proof verified on-chain
const CLAIM = 385_059; // AidPrograms.claim: real Semaphore proof at an NGO counter
const SETUP = 614_452 + 786_041; // createDisaster (3 tier groups) + createFund

const HOUSEHOLDS = 4_039; // disclosure #30: clean-up support "adjusted to 4,039 households"

export const COST_LINES: CostLine[] = [
  { op: "Disaster and fund set-up", gasEach: SETUP, count: 1, basis: "once" },
  { op: "Household registration (two signatures)", gasEach: REGISTER, count: HOUSEHOLDS, basis: "4,039 households (disclosure #30)" },
  { op: "Foundation transfers, acknowledged", gasEach: TRANSFER, count: 48, basis: "48 transfers (disclosure)" },
  { op: "Payment roster batches", gasEach: ROSTER_BATCH, count: 21, basis: "assumed: one batch per pre-allocation" },
  { op: "Published payment lines", gasEach: ROSTER_LINE, count: HOUSEHOLDS, basis: "one line per household" },
  { op: "Household confirmations", gasEach: CONFIRM, count: HOUSEHOLDS, basis: "assumed: every household answers once" },
  { op: "Anonymous votes", gasEach: VOTE, count: 2_020, basis: "assumed: 2 decisions, 25% turnout" },
  { op: "NGO on-the-spot claims", gasEach: CLAIM, count: HOUSEHOLDS, basis: "assumed: one claim per household" },
];

export const TOTAL_GAS = COST_LINES.reduce((a, l) => a + l.gasEach * l.count, 0);

/** Assumed all-in price per gas on an Ethereum L2 (execution + data), low and high, and ETH in US$. */
export const PRICE_ASSUMPTIONS = { gweiLow: 0.01, gweiHigh: 0.1, ethUsd: 3_000 };

export function usdCost(gwei: number) {
  return (TOTAL_GAS * gwei * 1e-9 * PRICE_ASSUMPTIONS.ethUsd);
}
