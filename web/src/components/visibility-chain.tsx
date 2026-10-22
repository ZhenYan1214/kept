"use client";
import { useState } from "react";
import { cx } from "./ui";
import { Icon } from "./icons";

type State = { label: string; tone: "ok" | "warn" | "bad"; note: string };
const ROWS: { who: string; icon: (p: { className?: string }) => React.ReactNode; today: State; kept: State }[] = [
  {
    who: "Donors → relief foundation",
    icon: Icon.People,
    today: { label: "Visible", tone: "ok", note: "Totals and donor lists are published." },
    kept: { label: "Receipted", tone: "ok", note: "Every donation gets a receipt number on-chain." },
  },
  {
    who: "Foundation → 48 recipients",
    icon: Icon.Building,
    today: { label: "Visible", tone: "ok", note: "Every transfer: date, item, amount." },
    kept: { label: "Acknowledged", tone: "ok", note: "Each recipient signs for what it received." },
  },
  {
    who: "Recipients → households",
    icon: Icon.Handoff,
    today: { label: "Totals only", tone: "warn", note: "Aggregate counts, such as 2,582 households by Dec 2025." },
    kept: { label: "Published lines", tone: "ok", note: "Each payment as a pseudonymous line: receipt address and amount." },
  },
  {
    who: "The household",
    icon: Icon.House,
    today: { label: "No record", tone: "bad", note: "No public way to confirm a payment, or say it never came." },
    kept: { label: "Signed", tone: "ok", note: "“Received” or “not received”, in its own words; a random sample is visited." },
  },
];

const toneText = { ok: "text-ok", warn: "text-warn", bad: "text-bad" };

/** Where the public trail stops today, and how far it reaches with Kept. Real Guangfu figures. */
export function VisibilityChain() {
  const [kept, setKept] = useState(false);
  return (
    <figure className="rounded-lg border border-line bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <figcaption className="eyebrow">
          Who can see the money<span className="hidden sm:inline"> · Guangfu 2025</span>
        </figcaption>
        <div role="tablist" className="flex rounded-md bg-sunk p-0.5 text-xs font-medium">
          {[
            ["Today", false],
            ["With Kept", true],
          ].map(([label, v]) => (
            <button
              key={String(label)}
              role="tab"
              aria-selected={kept === v}
              onClick={() => setKept(v as boolean)}
              className={cx(
                "whitespace-nowrap rounded-[5px] px-2.5 py-1 transition-colors",
                kept === v ? "bg-card text-ink shadow-[0_1px_2px_rgb(0_0_0/0.12)]" : "text-muted hover:text-ink",
              )}
            >
              {label as string}
            </button>
          ))}
        </div>
      </div>
      <ol className="relative px-5 py-4">
        {ROWS.map((r, i) => {
          const s = kept ? r.kept : r.today;
          const dark = !kept && s.tone !== "ok";
          const last = i === ROWS.length - 1;
          return (
            <li key={r.who} className="relative flex gap-4 pb-5 last:pb-1">
              {!last && (
                <span
                  aria-hidden
                  className={cx(
                    "absolute left-[17px] top-9 bottom-0 w-0 border-l-2 transition-all duration-500",
                    kept ? "border-solid border-ok/60" : i >= 1 ? "border-dashed border-line" : "border-solid border-ink/40",
                  )}
                />
              )}
              <span
                className={cx(
                  "relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500",
                  dark ? "border-dashed border-line bg-paper text-muted/70" : "border-ink/20 bg-card text-ink",
                )}
              >
                <r.icon className="h-[18px] w-[18px]" />
                {kept && (
                  <span className="stamp-in absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-ok text-on-ink" style={{ animationDelay: `${i * 90}ms` }}>
                    <Icon.Check className="h-3 w-3" />
                  </span>
                )}
              </span>
              <div className="min-w-0 pt-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <p className={cx("text-sm font-medium transition-colors", dark ? "text-muted" : "text-ink")}>{r.who}</p>
                  <p className={cx("font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors", toneText[s.tone])}>
                    {s.label}
                  </p>
                </div>
                <p className="mt-0.5 text-[13px] leading-snug text-muted">{s.note}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="border-t border-line px-5 py-3 text-xs text-muted">
        {kept
          ? "Kept adds a signature at every hand, down to the household. No names, IDs or bank accounts go on-chain."
          : "Pre-allocating and reconciling later is normal in an emergency. The gap is what comes after the first hand."}
      </p>
    </figure>
  );
}
