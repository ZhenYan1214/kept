"use client";
import { useState } from "react";
import { useSnapshot } from "./snapshot";
import { Icon } from "./icons";
import { EXPLORER_URL } from "@/lib/config";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export const ntd = (v: bigint | number) => `NT$${Number(v).toLocaleString("en-US")}`;

/** Short form for stat cards: NT$9.6M, NT$600K. The exact figure stays in the tooltip. */
export const ntdShort = (v: bigint | number) => {
  const n = Number(v);
  if (n >= 1e9) return `NT$${(n / 1e9).toFixed(2)}bn`;
  if (n >= 1e6) return `NT$${(n / 1e6).toFixed(n >= 1e8 ? 0 : 1)}M`;
  if (n >= 1e4) return `NT$${Math.round(n / 1e3)}K`;
  return ntd(n);
};

export const pct = (part: bigint | number, whole: bigint | number) => {
  const w = Number(whole);
  return w === 0 ? 0 : Math.round((Number(part) / w) * 1000) / 10;
};

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cx("min-w-0 rounded-lg border border-line bg-card p-5 md:p-7", className)}>{children}</section>;
}

/** A section heading: a small mono label, a serif title, an optional plain-language explanation. */
export function SectionTitle({ kicker, title, children }: { kicker?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      {kicker && (
        <p className="eyebrow flex items-center gap-2">
          <span className="h-px w-5 bg-seal" />
          {kicker}
        </p>
      )}
      <h2 className="mt-2 font-serif text-[22px] font-medium leading-snug text-ink md:text-[26px]">{title}</h2>
      {children && <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted">{children}</p>}
    </div>
  );
}

/** Marks where a figure comes from: real public records, or the simulated demo. */
export function Tag({ kind }: { kind: "real" | "sim" }) {
  return kind === "real" ? (
    <span className="rounded-[3px] bg-ok/15 px-1.5 py-px font-mono text-[10.5px] font-semibold tracking-wider text-ok">REAL DATA</span>
  ) : (
    <span className="rounded-[3px] bg-warn/15 px-1.5 py-px font-mono text-[10.5px] font-semibold tracking-wider text-warn">SIMULATED</span>
  );
}

/** The top of every page. */
export function PageHeader({
  eyebrow,
  title,
  kind,
  children,
  aside,
}: {
  eyebrow: string;
  title: React.ReactNode;
  kind?: "real" | "sim";
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <header className="mb-10 grid gap-6 border-b border-line pb-8 md:grid-cols-[1fr_auto] md:items-end">
      <div className="max-w-3xl">
        <p className="eyebrow flex flex-wrap items-center gap-2">
          {kind && <Tag kind={kind} />}
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-[32px] font-medium leading-[1.08] text-ink md:text-[44px]">{title}</h1>
        {children && <div className="mt-4 text-base leading-relaxed text-muted">{children}</div>}
      </div>
      {aside && <div className="md:pb-1">{aside}</div>}
    </header>
  );
}

/** An ink stamp, pressed when something is signed: "RECEIVED", "DISPUTED", "VERIFIED". */
export function Stamp({ children, tone = "seal", className }: { children: React.ReactNode; tone?: "seal" | "ok" | "bad"; className?: string }) {
  const color = { seal: "border-seal text-seal", ok: "border-ok text-ok", bad: "border-bad text-bad" }[tone];
  return (
    <span
      className={cx(
        "stamp-in inline-flex -rotate-[7deg] items-center gap-1 rounded-[4px] border-2 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] opacity-90 outline outline-1 outline-offset-2",
        color,
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A figure under a ruled line, like a line in an annual report. */
export function Stat({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: Tone }) {
  return (
    <div className="min-w-0 border-t border-ink/70 pt-3">
      <p className="eyebrow">{label}</p>
      <p className={cx("mt-1.5 break-words font-serif text-[26px] leading-none tabular-nums sm:text-[32px]", tone ? toneText[tone] : "text-ink")}>
        {value}
      </p>
      {sub && <p className="mt-1.5 text-xs leading-snug text-muted">{sub}</p>}
    </div>
  );
}

type Tone = "ok" | "warn" | "bad" | "info" | "muted";
const toneText: Record<Tone, string> = {
  ok: "text-ok",
  warn: "text-warn",
  bad: "text-bad",
  info: "text-accent",
  muted: "text-muted",
};
const toneBadge: Record<Tone, string> = {
  ok: "bg-ok/10 text-ok",
  warn: "bg-warn/12 text-warn",
  bad: "bg-bad/10 text-bad",
  info: "bg-accent/10 text-accent",
  muted: "bg-sunk text-muted",
};
const toneDot: Record<Tone, string> = { ok: "bg-ok", warn: "bg-warn", bad: "bg-bad", info: "bg-accent", muted: "bg-muted" };

export function Badge({ tone = "muted", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-[4px] px-1.5 py-0.5 text-xs font-medium", toneBadge[tone])}>
      <span className={cx("h-1.5 w-1.5 shrink-0 rounded-full", toneDot[tone])} />
      {children}
    </span>
  );
}

/** Thin horizontal bar with an optional cap marker. */
export function Bar({ value, max, cap, tone = "info" }: { value: number; max: number; cap?: number; tone?: Tone }) {
  const w = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  const c = cap === undefined || max === 0 ? undefined : Math.min(100, (cap / max) * 100);
  const fill = { ok: "bg-ok", warn: "bg-warn", bad: "bg-bad", info: "bg-accent", muted: "bg-muted" }[tone];
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-sunk">
      <div className={cx("h-full rounded-full transition-[width] duration-700 ease-out", fill)} style={{ width: `${w}%` }} />
      {c !== undefined && <div className="absolute top-0 h-full w-0.5 bg-ink/70" style={{ left: `${c}%` }} title="cap" />}
    </div>
  );
}

export function Addr({ address, className }: { address?: string; className?: string }) {
  const { labelOf } = useSnapshot();
  if (!address) return <span className="text-muted">—</span>;
  const label = labelOf(address);
  const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
  const inner = (
    <span className={cx("font-mono text-xs", className)} title={address}>
      {label ? <span className="font-sans text-sm font-medium text-ink">{label}</span> : short}
    </span>
  );
  return EXPLORER_URL ? (
    <a href={`${EXPLORER_URL}/address/${address}`} target="_blank" rel="noreferrer" className="hover:underline">
      {inner}
    </a>
  ) : (
    inner
  );
}

export function Hash({ value }: { value?: string }) {
  if (!value || /^0x0+$/.test(value)) return <span className="text-muted">—</span>;
  return (
    <span className="font-mono text-xs text-muted" title={value}>
      {value.slice(0, 10)}…
    </span>
  );
}

export function TxLink({ hash }: { hash?: string }) {
  if (!hash) return null;
  const short = `${hash.slice(0, 10)}…`;
  return EXPLORER_URL ? (
    <a className="font-mono text-xs text-accent hover:underline" href={`${EXPLORER_URL}/tx/${hash}`} target="_blank" rel="noreferrer">
      {short}
    </a>
  ) : (
    <span className="font-mono text-xs text-muted">{short}</span>
  );
}

export function formatDuration(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  return `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h`;
}

export function formatDate(ts: number) {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

/**
 * Button that runs an async action, shows progress, surfaces contract errors in plain words, and
 * briefly stamps "Recorded" when the chain has accepted it.
 */
export function ActionButton({
  onClick,
  children,
  variant = "primary",
  disabled,
  className,
  onDone,
}: {
  onClick: () => Promise<unknown>;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
  onDone?: (result: unknown) => void;
}) {
  const { refresh } = useSnapshot();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const styles = {
    primary: "bg-ink text-on-ink hover:bg-ink/85",
    secondary: "border border-line bg-card text-ink hover:border-ink/40",
    danger: "bg-bad text-on-ink hover:bg-bad/85",
  }[variant];
  return (
    <span className={cx("relative inline-flex flex-col gap-1.5", className)}>
      <button
        type="button"
        disabled={disabled || busy}
        onClick={async () => {
          setBusy(true);
          setErr(null);
          try {
            const r = await onClick();
            onDone?.(r);
            setDone(true);
            setTimeout(() => setDone(false), 2600);
            await refresh();
          } catch (e) {
            setErr(humanError(e instanceof Error ? e.message : String(e)));
          } finally {
            setBusy(false);
          }
        }}
        className={cx(
          "inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-[background,border-color,transform] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45",
          styles,
        )}
      >
        {busy && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {children}
      </button>
      {done && (
        <span className="stamp-in pointer-events-none absolute -right-3 -top-3 rounded-[3px] border-2 border-seal px-1.5 py-px font-mono text-[10px] font-semibold tracking-widest text-seal">
          RECORDED
        </span>
      )}
      {err && (
        <span className="flex max-w-md items-start gap-1.5 text-xs text-bad">
          <Icon.Alert className="mt-px h-3.5 w-3.5 shrink-0" />
          {err}
        </span>
      )}
    </span>
  );
}

const ERRORS: Record<string, string> = {
  PurposeNotInCharter: "Rejected by the contract: this purpose is not in the fund's charter. The charter was fixed when the money was raised.",
  CapExceeded: "Rejected by the contract: this would exceed the purpose's cap.",
  FundExpired: "Rejected: the fund's deadline has passed. An extension needs household approval first.",
  TimelockActive: "The public waiting period has not ended yet.",
  AlreadyClaimed: "Rejected: this household already received this programme.",
  AlreadyVoted: "Rejected: this household has already voted on this change.",
  TierNotEligible: "Rejected: this household's damage tier is not covered by the programme.",
  SameRoleCannotApprove: "A second signature from the other issuer (chief ↔ township office) is required.",
  DuplicateHousehold: "Rejected: this household is already registered for this disaster.",
  OutOfJurisdiction: "Rejected: outside this issuer's village/township.",
  NotAcknowledged: "The receiving custodian must acknowledge the transfer first.",
  ExceedsRemaining: "Rejected: more than this custodian still holds for this tranche.",
  AlreadyRecorded: "This line has already been confirmed or disputed.",
  AuditTooEarly: "The sample can only be drawn in a later block than the one that published the batch. Try again in a few seconds.",
  AuditAlreadyDrawn: "The audit sample for this batch has already been drawn.",
  BadSignature: "Rejected: only the household (or a registered proxy) can sign this.",
  NotInRoster: "This receipt is not in the published roster.",
  Semaphore__MerkleTreeRootIsNotPartOfTheGroup: "Rejected: the proof is not from a verified household.",
  InvalidProof: "Rejected: the zero-knowledge proof is not valid.",
  VoteNotOpen: "This vote is closed.",
  AlreadyApproved: "This committee member has already approved.",
  InvalidState: "This proposal is not in a state that allows that action.",
};

export function humanError(msg: string) {
  const key = Object.keys(ERRORS).find((k) => msg.includes(k));
  return key ? ERRORS[key] : msg;
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "rounded-md border border-line bg-card px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 hover:border-ink/30 focus:border-accent focus:ring-2 focus:ring-accent/20";

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
      <Icon.Ledger className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/** Shown before on-chain state is available: loading, an RPC error, or no scenario yet. */
export function NotReady() {
  const { loading, error } = useSnapshot();
  if (loading) return <Empty>Loading on-chain state…</Empty>;
  if (error) return <Empty>Could not read the chain right now ({error.slice(0, 120)}). Retrying…</Empty>;
  return (
    <Empty>
      No scenario on this deployment yet. Open <a className="text-accent underline" href="/setup">Setup</a> to create one.
    </Empty>
  );
}

export function Note({ children, tone = "info" }: { children: React.ReactNode; tone?: Tone }) {
  const border = { ok: "border-ok", warn: "border-warn", bad: "border-bad", info: "border-accent", muted: "border-line" }[tone];
  const bg = { ok: "bg-ok/5", warn: "bg-warn/5", bad: "bg-bad/5", info: "bg-accent/5", muted: "bg-sunk/60" }[tone];
  return <div className={cx("rounded-r-md border-l-2 px-4 py-3 text-sm text-ink", border, bg)}>{children}</div>;
}
