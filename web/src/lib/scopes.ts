import { encodeAbiParameters, keccak256, type Address, type Hex } from "viem";

/** Mirrors AidPrograms.scopeOf(programId). */
export function programScope(programs: Address, programId: number | bigint) {
  return BigInt(keccak256(encodeAbiParameters([{ type: "address" }, { type: "uint256" }], [programs, BigInt(programId)]))) >> 8n;
}

/** Mirrors VoiceModule.scopeOf(voteKey). */
export function voteScope(voteKey: Hex) {
  return BigInt(voteKey) >> 8n;
}

/** Mirrors EligibilityRegistry.waitingScope(disasterId, period). */
export function waitingScope(registry: Address, disasterId: bigint, period: number) {
  return (
    BigInt(
      keccak256(
        encodeAbiParameters(
          [{ type: "address" }, { type: "string" }, { type: "uint256" }, { type: "uint64" }],
          [registry, "waiting", disasterId, BigInt(period)],
        ),
      ),
    ) >> 8n
  );
}

/** Mirrors EligibilityRegistry.currentPeriod: whole weeks since the disaster was created. */
export const WAITING_PERIOD = 7 * 86400;
export const waitingPeriod = (now: number, disasterCreatedAt: number) => Math.floor((now - disasterCreatedAt) / WAITING_PERIOD);

/** Mirrors CustodyLedger's lineState key: keccak256(abi.encode(hopId, batchIndex, receipt)). */
export function lineKey(hopId: bigint, batchIndex: bigint, receipt: Address) {
  return keccak256(
    encodeAbiParameters([{ type: "uint256" }, { type: "uint256" }, { type: "address" }], [hopId, batchIndex, receipt]),
  );
}

/**
 * Demo stand-in for the authority's blinded uniqueness tag: HMAC(national ID) with a key the
 * authority keeps. Here a fixed demo key is used; the ID itself never leaves the issuer's screen.
 */
export function demoUniqueTag(nationalId: string): Hex {
  return keccak256(new TextEncoder().encode(`kept-demo-hmac-key|${nationalId.trim().toUpperCase()}`));
}

export function textHash(text: string): Hex {
  return keccak256(new TextEncoder().encode(text));
}
