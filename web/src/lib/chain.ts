import { createPublicClient, http, type Address, type AbiEvent, type Log } from "viem";
import { chain, RPC_URL, CHAIN_ID } from "./config";

export const publicClient = createPublicClient({
  chain,
  transport: http(RPC_URL),
  pollingInterval: CHAIN_ID === 31337 ? 250 : 2000,
  // Base Sepolia has Multicall3; the local devnet does not.
  batch: { multicall: CHAIN_ID !== 31337 },
});

const CHUNK = 9_000n;

/** getLogs over a long range in chunks (public RPCs cap the block range). */
export async function getLogsChunked<E extends AbiEvent>(params: {
  address: Address | Address[];
  event?: E;
  events?: readonly AbiEvent[];
  fromBlock: bigint;
  toBlock: bigint;
}): Promise<Log[]> {
  const out: Log[] = [];
  for (let start = params.fromBlock; start <= params.toBlock; start += CHUNK) {
    const end = start + CHUNK - 1n > params.toBlock ? params.toBlock : start + CHUNK - 1n;
    const logs = await publicClient.getLogs({
      address: params.address,
      ...(params.event ? { event: params.event } : { events: params.events }),
      fromBlock: start,
      toBlock: end,
    } as Parameters<typeof publicClient.getLogs>[0]);
    out.push(...(logs as Log[]));
  }
  return out;
}
