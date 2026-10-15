// Deploys Kept to Base Sepolia with the demo key in ../../.env (DEMO_PRIVATE_KEY, or index 0 of
// DEMO_MNEMONIC): that account becomes the authority and owner.
// Reuses the official Semaphore v4 deployment (SEMAPHORE_ADDRESS) and the canonical PoseidonT3.
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import { toHex } from "viem";

const env = Object.fromEntries(
  readFileSync(new URL("../../.env", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, "")];
    }),
);

const privateKey = env.DEMO_PRIVATE_KEY
  ? env.DEMO_PRIVATE_KEY
  : toHex(mnemonicToAccount(env.DEMO_MNEMONIC, { addressIndex: 0 }).getHdKey().privateKey);
console.log("Deploying from", privateKeyToAccount(privateKey).address, "to", env.NEXT_PUBLIC_RPC_URL);

const r = spawnSync(
  "forge",
  ["script", "script/Deploy.s.sol", "--rpc-url", env.NEXT_PUBLIC_RPC_URL, "--broadcast", "--slow"],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, PRIVATE_KEY: privateKey, SEMAPHORE_ADDRESS: env.SEMAPHORE_ADDRESS },
  },
);
process.exit(r.status ?? 1);
