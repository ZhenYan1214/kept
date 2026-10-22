"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cx } from "./ui";
import { useSnapshot } from "./snapshot";
import { Icon, KeptMark } from "./icons";
import { CHAIN_ID, DEMO_MODE } from "@/lib/config";

const PUBLIC = [
  { href: "/", label: "The record" },
  { href: "/replay", label: "Guangfu, real data" },
  { href: "/why", label: "Why Kept" },
  { href: "/donate", label: "Donate" },
];

export const ROLE_LINKS = [
  { href: "/household", label: "Household", what: "Hold a credential, confirm or dispute a payment", icon: Icon.House },
  { href: "/issuer", label: "Village & township", what: "Two signatures for every household", icon: Icon.Seal },
  { href: "/custody", label: "Custodians", what: "Acknowledge, pass on, publish payment lines", icon: Icon.Handoff },
  { href: "/committee", label: "Fund committee", what: "Decide, under a charter households can veto", icon: Icon.People },
  { href: "/ngo", label: "NGO counter", what: "Check eligibility without the roster", icon: Icon.Shield },
  { href: "/setup", label: "Setup", what: "Start a fresh simulated scenario", icon: Icon.Settings },
];

const chainName = CHAIN_ID === 31337 ? "local devnet" : CHAIN_ID === 84532 ? "Base Sepolia testnet" : `chain ${CHAIN_ID}`;

export function Nav() {
  const path = usePathname();
  const { snap, error } = useSnapshot();
  const [menu, setMenu] = useState<null | "roles" | "mobile">(null);
  const box = useRef<HTMLDivElement>(null);
  const inRole = ROLE_LINKS.some((r) => r.href === path);

  useEffect(() => setMenu(null), [path]);
  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menu]);

  const roleList = (
    <ul className="grid gap-0.5">
      {ROLE_LINKS.map((r) => (
        <li key={r.href}>
          <Link
            href={r.href}
            className={cx(
              "group flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-sunk",
              path === r.href && "bg-sunk",
            )}
          >
            <r.icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-muted group-hover:text-accent" />
            <span>
              <span className="block text-sm font-medium text-ink">{r.label}</span>
              <span className="block text-xs text-muted">{r.what}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
      <div ref={box} className="relative mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-ink" aria-label="Kept, home">
          <KeptMark className="h-8 w-8" />
          <span className="leading-none">
            <span className="block text-xl font-semibold tracking-tight">Kept</span>
          </span>
        </Link>
        <span
          className="hidden items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs text-muted sm:inline-flex"
          title={`Simulated demo on ${chainName}${snap ? ` · block ${snap.block.toLocaleString("en-US")}` : ""}${DEMO_MODE ? " · institution keys held by this server" : ""}`}
        >
          <span className={cx("h-1.5 w-1.5 rounded-full", error ? "bg-bad" : "bg-ok")} />
          Testnet demo
        </span>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
          {PUBLIC.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={path === l.href ? "page" : undefined}
              className={cx(
                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                path === l.href ? "bg-sunk font-medium text-ink" : "text-muted hover:text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
          <span className="mx-2 h-5 w-px bg-line" />
          <button
            type="button"
            onClick={() => setMenu(menu === "roles" ? null : "roles")}
            aria-expanded={menu === "roles"}
            className={cx(
              "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors",
              inRole || menu === "roles" ? "border-accent/30 bg-accent/10 font-medium text-accent" : "border-line bg-card text-ink hover:bg-sunk",
            )}
          >
            <Icon.People className="h-4 w-4" />
            {inRole ? ROLE_LINKS.find((r) => r.href === path)!.label : "Try a role"}
            <svg viewBox="0 0 10 10" className={cx("h-2.5 w-2.5 transition-transform", menu === "roles" && "rotate-180")} aria-hidden>
              <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </button>
        </nav>

        <button
          type="button"
          className="ml-auto rounded-md p-2 text-ink lg:hidden"
          onClick={() => setMenu(menu === "mobile" ? null : "mobile")}
          aria-expanded={menu === "mobile"}
          aria-label="Menu"
        >
          {menu === "mobile" ? <Icon.Cross className="h-5 w-5" /> : <Icon.Menu className="h-5 w-5" />}
        </button>

        {menu === "roles" && (
          <div className="absolute right-4 top-[calc(100%+6px)] z-40 w-[340px] rounded-lg border border-line bg-card p-2 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.35)] sm:right-6">
            <p className="px-3 pb-1 pt-2 text-xs text-muted">Simulated roles. Each step writes to the testnet.</p>
            {roleList}
          </div>
        )}
        {menu === "mobile" && (
          <div className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-paper px-4 pb-6 pt-2 shadow-lg lg:hidden">
            <ul className="grid gap-0.5 border-b border-line pb-3">
              {PUBLIC.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cx("block rounded-lg px-3 py-2.5 text-base", path === l.href ? "bg-sunk font-medium text-ink" : "text-ink")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="px-3 pb-1 pt-4 text-xs text-muted">Simulated roles</p>
            {roleList}
          </div>
        )}
      </div>

      {error && (
        <div className="border-t border-bad/20 bg-bad/5">
          <p className="mx-auto max-w-6xl px-4 py-1.5 text-xs text-bad sm:px-6">Could not read the chain: {error.slice(0, 120)}</p>
        </div>
      )}
    </header>
  );
}
