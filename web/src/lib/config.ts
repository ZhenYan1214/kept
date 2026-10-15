import { defineChain } from "viem";
import { baseSepolia } from "viem/chains";
import { deployments, type Deployment } from "@/generated/contracts";

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 31337);

const anvil = defineChain({
  id: 31337,
  name: "Local devnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
});

export const chain = CHAIN_ID === baseSepolia.id ? baseSepolia : anvil;

export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? chain.rpcUrls.default.http[0];

export const EXPLORER_URL = CHAIN_ID === baseSepolia.id ? "https://sepolia.basescan.org" : undefined;

export function getDeployment(): Deployment {
  const d = deployments[CHAIN_ID];
  if (!d) throw new Error(`No Kept deployment for chain ${CHAIN_ID}. Run the deploy script, then \`npm run sync\`.`);
  return d;
}

/** Demo mode: institutional role keys are held by this demo server. */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
