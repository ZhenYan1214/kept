import type { Address } from "viem";
import { CHAIN_ID } from "./config";

/** EIP-712 receipt a household signs to confirm or dispute one line of a payment roster. */
export const RECEIPT_TYPES = {
  Receipt: [
    { name: "hopId", type: "uint256" },
    { name: "batchIndex", type: "uint256" },
    { name: "receipt", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "received", type: "bool" },
  ],
} as const;

export function receiptDomain(ledger: Address) {
  return { name: "Kept CustodyLedger", version: "1", chainId: CHAIN_ID, verifyingContract: ledger } as const;
}
