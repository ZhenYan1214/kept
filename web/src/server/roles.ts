import "server-only";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  encodePacked,
  keccak256,
  nonceManager,
  type Abi,
  type Address,
  type Hex,
  type LocalAccount,
} from "viem";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import { chain, RPC_URL, getDeployment, CHAIN_ID } from "@/lib/config";
import { ROLES, type RoleName } from "@/lib/scenario";
import {
  registryAbi,
  factoryAbi,
  fundAbi,
  ledgerAbi,
  voiceAbi,
  programsAbi,
  tokenAbi,
  semaphoreAbi,
} from "@/generated/contracts";

const ANVIL_MNEMONIC = "test test test test test test test test test test test junk";

/**
 * Every demo role's key comes from one secret held by the demo server:
 * - DEMO_PRIVATE_KEY: that key is the authority/deployer (index 0); each other role's key is
 *   keccak256(privateKey, "kept-role", index), so one funded key is enough to run the demo;
 * - or DEMO_MNEMONIC: HD address index per role;
 * - on the local devnet, anvil's well-known mnemonic.
 */
function deriveAccount(index: number): LocalAccount {
  const pk = process.env.DEMO_PRIVATE_KEY as Hex | undefined;
  if (pk) {
    const key = index === 0 ? pk : keccak256(encodePacked(["bytes32", "string", "uint256"], [pk, "kept-role", BigInt(index)]));
    return privateKeyToAccount(key, { nonceManager });
  }
  const m = process.env.DEMO_MNEMONIC ?? (CHAIN_ID === 31337 ? ANVIL_MNEMONIC : undefined);
  if (!m) throw new Error("Set DEMO_PRIVATE_KEY or DEMO_MNEMONIC for non-local chains");
  // Track nonces locally: a load-balanced RPC can report a stale pending nonce right after a send.
  return mnemonicToAccount(m, { addressIndex: index, nonceManager });
}

const accounts = new Map<RoleName, LocalAccount>();
export function roleAccount(role: RoleName): LocalAccount {
  let a = accounts.get(role);
  if (!a) {
    a = deriveAccount(ROLES[role].index);
    accounts.set(role, a);
  }
  return a;
}

const pollingInterval = CHAIN_ID === 31337 ? 100 : 1000;
export const publicClient = createPublicClient({ chain, transport: http(RPC_URL), pollingInterval });
/**
 * Poll for a receipt directly. (viem's waitForTransactionReceipt waits for a *new* block, which an
 * automining devnet does not produce until the next transaction arrives.)
 */
export async function waitReceipt(hash: `0x${string}`, timeoutMs = 120_000) {
  const start = Date.now();
  for (;;) {
    try {
      return await publicClient.getTransactionReceipt({ hash });
    } catch {
      if (Date.now() - start > timeoutMs) throw new Error(`Timed out waiting for ${hash}`);
      await new Promise((r) => setTimeout(r, pollingInterval));
    }
  }
}

export const walletFor = (role: RoleName) =>
  createWalletClient({ account: roleAccount(role), chain, transport: http(RPC_URL), pollingInterval });

export type Target = "registry" | "factory" | "fund" | "ledger" | "voice" | "programs" | "token";

export const ABIS: Record<Target, Abi> = {
  registry: [...registryAbi, ...semaphoreAbi.filter((x) => x.type === "error")] as Abi,
  factory: factoryAbi as Abi,
  fund: fundAbi as Abi,
  ledger: ledgerAbi as Abi,
  voice: [...voiceAbi, ...semaphoreAbi.filter((x) => x.type === "error")] as Abi,
  programs: [...programsAbi, ...semaphoreAbi.filter((x) => x.type === "error")] as Abi,
  token: tokenAbi as Abi,
};

const CHIEF = ["proposeRegistration", "approveRegistration", "rejectRegistration"];
const COMMITTEE = {
  fund: ["proposeAllocation", "proposeCapChange", "proposeExtension", "proposeSurplus", "approve", "execute", "concludeReview", "cancel"],
};
const CUSTODIAN_FLOW = {
  ledger: ["acknowledge", "forward", "reconcile"],
  programs: ["createProgram", "claim", "closeProgram"],
};

/**
 * What each demo role is allowed to call through the public demo API. Anything else is refused.
 * Setting up disasters, issuers and funds is done only by the server's own seed, so a visitor cannot
 * create a disaster or a fund and take over what the public dashboard shows.
 */
export const ALLOWED: Record<RoleName, Partial<Record<Target, string[]>>> = {
  authority: {},
  office: {
    registry: [...CHIEF, "revokeMember", "replaceMember", "resolveAppeal", "reportCoverage", "setProxy"],
  },
  chief0: { registry: CHIEF },
  chief1: { registry: CHIEF },
  chief2: { registry: CHIEF },
  chief3: { registry: CHIEF },
  chief4: { registry: CHIEF },
  c1: COMMITTEE,
  c2: COMMITTEE,
  c3: COMMITTEE,
  custodian: { fund: ["execute", "concludeReview"] },
  ministry: CUSTODIAN_FLOW,
  county: CUSTODIAN_FLOW,
  ngo: CUSTODIAN_FLOW,
  donor: { token: ["faucet", "approve"], fund: ["donate"] },
  socialWorker: {},
  relayer: { voice: ["castVote"], ledger: ["confirmLine"], registry: ["fileAppeal", "reportWaiting"], fund: ["execute", "concludeReview"] },
};

export function targetAddress(target: Exclude<Target, "fund">): Address {
  const d = getDeployment();
  return d[target];
}

export async function assertFund(address: Address) {
  const ok = await publicClient.readContract({
    address: getDeployment().factory,
    abi: factoryAbi,
    functionName: "isFund",
    args: [address],
  });
  if (!ok) throw new Error("Not a Kept fund created by the factory");
}

/** Keep every demo role topped up with gas from the authority account. */
export async function ensureGas(
  minEth = CHAIN_ID === 31337 ? "0.05" : "0.0005",
  topUpEth = CHAIN_ID === 31337 ? "0.2" : "0.002",
) {
  const funder = walletFor("authority");
  for (const role of Object.keys(ROLES) as RoleName[]) {
    if (role === "authority") continue;
    const address = roleAccount(role).address;
    const bal = await publicClient.getBalance({ address });
    if (bal < parseEther(minEth)) {
      const hash = await funder.sendTransaction({ to: address, value: parseEther(topUpEth), chain });
      await waitReceipt(hash);
    }
  }
}

/** Top up a single role from the authority if it is running low (testnet demo resilience). */
export async function ensureRoleGas(role: RoleName) {
  if (role === "authority") return;
  const min = parseEther(CHAIN_ID === 31337 ? "0.05" : "0.0005");
  const address = roleAccount(role).address;
  if ((await publicClient.getBalance({ address })) >= min) return;
  await withRoleLock("authority", async () => {
    const hash = await walletFor("authority").sendTransaction({
      to: address,
      value: parseEther(CHAIN_ID === 31337 ? "0.2" : "0.002"),
      chain,
    });
    await waitReceipt(hash);
  });
}

const locks = new Map<RoleName, Promise<unknown>>();
/** Serialise transactions per role so nonces never collide. */
export function withRoleLock<T>(role: RoleName, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(role) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  locks.set(role, next.catch(() => undefined));
  return next;
}
