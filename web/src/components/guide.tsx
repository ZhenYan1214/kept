"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "./ui";

/** A first-visit guide: what this page is, and the order to try the demo in. */
const STEPS: { href: string; page: string; what: string }[] = [
  { href: "/replay", page: "Guangfu, real data", what: "What the public can see today, from the relief foundation's real disclosure." },
  { href: "/household", page: "Household", what: "Create a credential, then press “Simulate: chief scans this code”." },
  { href: "/issuer", page: "Village & township", what: "As the Nanfu chief, propose the registration; switch to the township office and approve it." },
  { href: "/custody", page: "Custodians", what: "As the ministry, commit a payment roster that includes your household." },
  { href: "/household", page: "Household", what: "Check your line against the on-chain root; say “I received it” or “I did not”." },
  { href: "/household", page: "Household → NGO counter", what: "“Show code at the counter”, then verify it on the NGO counter. A second try is rejected." },
  { href: "/committee", page: "Fund committee", what: "Try “General public works” (refused). Propose a cap change, approve, vote No, execute: vetoed." },
];

const KEY = "kept.guide-hidden";

export function StartHere() {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    try {
      setHidden(localStorage.getItem(KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);
  const toggle = (h: boolean) => {
    setHidden(h);
    try {
      localStorage.setItem(KEY, h ? "1" : "0");
    } catch {}
  };
  if (hidden) {
    return (
      <button onClick={() => toggle(false)} className="text-sm text-accent underline">
        Show the guided demo
      </button>
    );
  }
  return (
    <Card className="border-accent/30 bg-accent/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">New here? A 5-minute guided demo</p>
          <p className="mt-1 max-w-3xl text-sm text-muted">
            Below is a simulated fund for the 2025 Guangfu flood, running on the Base Sepolia testnet. Kept follows the money hand by
            hand until each household confirms it arrived. Try it in this order; every step writes to the chain.
          </p>
        </div>
        <button onClick={() => toggle(true)} className="shrink-0 text-xs text-muted underline">
          Hide
        </button>
      </div>
      <ol className="mt-4 grid gap-2 text-sm md:grid-cols-2">
        {STEPS.map((s, i) => (
          <li key={i} className="flex gap-3 rounded-lg bg-card p-3 ring-1 ring-line">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
              {i + 1}
            </span>
            <span>
              <Link href={s.href} className="font-medium text-accent underline">
                {s.page}
              </Link>
              <span className="block text-muted">{s.what}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted">
        Someone else may have used the demo before you. <Link href="/setup" className="underline">Setup</Link> can start a fresh
        scenario.
      </p>
    </Card>
  );
}
