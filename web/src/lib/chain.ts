import { createPublicClient, http } from "viem";
import { chain, RPC_URL, CHAIN_ID } from "./config";

export const publicClient = createPublicClient({
  chain,
  transport: http(RPC_URL),
  pollingInterval: CHAIN_ID === 31337 ? 250 : 2000,
  // Base Sepolia has Multicall3; the local devnet does not.
  batch: { multicall: CHAIN_ID !== 31337 },
});
