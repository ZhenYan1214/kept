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
      <button onClick={() => toggle(false)} className="text-sm font-medium text-accent hover:underline">
        Show the step-by-step guide
      </button>
    );
  }
  return (
    <div className="rounded-xl border border-line bg-card p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">New here? Try it in this order</h3>
          <p className="mt-1 max-w-3xl text-sm text-muted">
            Play each role in turn; every step writes to the testnet. Someone may have used the demo before you, and{" "}
            <Link href="/setup" className="text-accent hover:underline">
              Setup
            </Link>{" "}
            can start a fresh scenario.
          </p>
        </div>
        <button onClick={() => toggle(true)} className="shrink-0 rounded-md p-1 text-muted hover:bg-sunk hover:text-ink" aria-label="Hide the guide">
          <Icon.Cross className="h-4 w-4" />
        </button>
      </div>
      <ol className="mt-4 grid gap-x-6 gap-y-1 md:grid-cols-2">
        {STEPS.map((s, i) => (
          <li key={i}>
            <Link href={s.href} className="group flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-sunk">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/10 text-xs font-semibold text-accent tabular-nums">
                {i + 1}
              </span>
              <span>
                <span className="text-sm font-medium text-ink group-hover:text-accent">{s.page}</span>
                <span className="block text-[13px] leading-snug text-muted">{s.what}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
