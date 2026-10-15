"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "./ui";
import { useSnapshot } from "./snapshot";
import { CHAIN_ID, DEMO_MODE } from "@/lib/config";

const PUBLIC = [
  { href: "/", label: "Public dashboard" },
  { href: "/why", label: "Why Kept" },
  { href: "/replay", label: "Guangfu, real data" },
  { href: "/donate", label: "Donate" },
];

const ROLES = [
  { href: "/household", label: "Household" },
  { href: "/issuer", label: "Village & township" },
  { href: "/committee", label: "Fund committee" },
  { href: "/custody", label: "Custodians" },
  { href: "/ngo", label: "NGO counter" },
  { href: "/setup", label: "Setup" },
];

export function Nav() {
  const path = usePathname();
  const { snap, error } = useSnapshot();
  const link = (l: { href: string; label: string }) => (
    <Link
      key={l.href}
      href={l.href}
      className={cx(
        "whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm transition",
        path === l.href ? "bg-ink text-white" : "text-ink/80 hover:bg-ink/5",
      )}
    >
      {l.label}
    </Link>
  );
  return (
    <header className="z-20 md:sticky md:top-0 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pb-2 pt-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-bold text-white">K</span>
            <span className="leading-tight">
              <span className="block text-base font-semibold">Kept</span>
              <span className="block text-[11px] text-muted">Disaster-relief promises you can verify</span>
            </span>
          </Link>
        </div>
        <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible">
          {PUBLIC.map(link)}
          <span className="mx-1 my-1 w-px bg-line" />
          {ROLES.map(link)}
        </nav>
      </div>
      <div className="border-t border-line bg-warn/10">
        <p className="mx-auto max-w-6xl px-4 py-1 text-[11px] text-warn">
          Simulated scenario — no real household data.
          {DEMO_MODE && " Demo mode: institutional signing keys are held by this demo server; in production each institution signs with its own wallet."}
          {" "}Chain {CHAIN_ID === 31337 ? "local devnet" : CHAIN_ID === 84532 ? "Base Sepolia testnet" : CHAIN_ID}
          {snap && ` · block ${snap.block}`}
          {error && <span className="text-bad"> · {error}</span>}
        </p>
      </div>
    </header>
  );
}
