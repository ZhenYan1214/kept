"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./icons";

/** A first-visit guide: the order to try the demo in. */
const STEPS: { href: string; page: string; what: string }[] = [
  { href: "/replay", page: "Guangfu, real data", what: "What the public can see today, from the relief foundation's real disclosure." },
  { href: "/household", page: "Household", what: "Create a credential, then press “Simulate: chief scans this code”." },
  { href: "/issuer", page: "Village & township", what: "As the Nanfu chief, propose the registration; switch to the township office and approve it." },
  { href: "/custody", page: "Custodians", what: "As the ministry, publish payment lines that include your household." },
  { href: "/household", page: "Household", what: "Your line is found in the published roster; say “I received it” or “I did not”." },
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
      <button onClick={() => toggle(false)} className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
        <Icon.Ledger className="h-4 w-4" /> Show the 7-step guided demo
      </button>
    );
  }
  return (
    <div className="rounded-lg border border-line bg-card">
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4 md:px-7">
        <div>
          <p className="eyebrow">New here? A 5-minute route through the demo</p>
          <p className="mt-1.5 max-w-3xl text-sm text-muted">
            Play each role in turn, in this order. Every step writes to the chain; someone else may have used the demo before you, and{" "}
            <Link href="/setup" className="text-accent hover:underline">
              Setup
            </Link>{" "}
            can start a fresh scenario.
          </p>
        </div>
        <button onClick={() => toggle(true)} className="shrink-0 rounded-md p-1 text-muted hover:text-ink" aria-label="Hide the guide">
          <Icon.Cross className="h-4 w-4" />
        </button>
      </div>
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={i} className="border-b border-line last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0">
            <Link href={s.href} className="group flex h-full gap-3 p-4 transition-colors hover:bg-sunk/60 md:p-5">
              <span className="font-serif text-2xl leading-none text-seal tabular-nums">{i + 1}</span>
              <span>
                <span className="flex items-center gap-1 text-sm font-medium text-ink group-hover:text-accent">
                  {s.page}
                  <Icon.Arrow className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-muted">{s.what}</span>
              </span>
            </Link>
          </li>
        ))}
        <li className="hidden items-center justify-center p-5 lg:flex">
          <span className="text-center font-serif text-sm italic text-muted">Every step leaves a public trace.</span>
        </li>
      </ol>
    </div>
  );
}
