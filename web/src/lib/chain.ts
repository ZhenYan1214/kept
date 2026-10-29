import { createPublicClient, http } from "viem";
import { chain, RPC_URL, CHAIN_ID } from "./config";

export const publicClient = createPublicClient({
  chain,
  transport: http(RPC_URL),
  pollingInterval: CHAIN_ID === 31337 ? 250 : 2000,
  // Base Sepolia has Multicall3; the local devnet does not. Reads issued within a few milliseconds of each other share
  // one request, and a request may carry many of them (the default packs only ~1 KB of calls into each).
  batch: { multicall: CHAIN_ID !== 31337 && { batchSize: 32_768, wait: 16 } },
});
