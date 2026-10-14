// Deploys PoseidonT3 at its canonical deterministic address (0x3333...3B93) if missing.
// Semaphore v4 links against this address on every chain.
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import poseidon from "poseidon-solidity";

const rpc = process.env.RPC_URL ?? "http://127.0.0.1:8545";
const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const pub = createPublicClient({ transport: http(rpc) });
const wallet = createWalletClient({ account, transport: http(rpc) });
const { PoseidonT3, proxy } = poseidon;

const code = await pub.getCode({ address: PoseidonT3.address });
if (code && code !== "0x") {
  console.log("PoseidonT3 already deployed at", PoseidonT3.address);
} else {
  const proxyCode = await pub.getCode({ address: proxy.address });
  if (!proxyCode || proxyCode === "0x") throw new Error("Deterministic deployment proxy missing on this chain");
  const chain = { id: await pub.getChainId(), name: "x", nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: [rpc] } } };
  const hash = await wallet.sendTransaction({ chain, to: proxy.address, data: PoseidonT3.data });
  await pub.waitForTransactionReceipt({ hash });
  console.log("PoseidonT3 deployed at", PoseidonT3.address);
}
