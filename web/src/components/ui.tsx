"use client";
import { useState } from "react";
import { useSnapshot } from "./snapshot";
import { Icon } from "./icons";
import { useToast } from "./toast";
import { CHAIN_ID, EXPLORER_URL } from "@/lib/config";

const CHAIN_LABEL = CHAIN_ID === 84532 ? "Base Sepolia" : CHAIN_ID === 31337 ? "the local devnet" : "the chain";

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

export function Card({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cx("min-w-0 rounded-xl border border-line bg-card p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04)] md:p-6", className)}>
      {children}
    </section>
  );
}

/** A section heading with an optional short label above it and a plain-language explanation below. */
export function SectionTitle({ kicker, title, children }: { kicker?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5">
      {kicker && <p className="eyebrow mb-1">{kicker}</p>}
      <h2 className="text-lg font-semibold leading-snug text-ink md:text-xl">{title}</h2>
      {children && <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">{children}</p>}
    </div>
  );
}

/** Where a figure comes from: real public records, or the simulated demo. */
export function Tag({ kind }: { kind: "real" | "sim" }) {
  return kind === "real" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ok/10 px-2 py-0.5 text-xs font-medium text-ok">
      <span className="h-1.5 w-1.5 rounded-full bg-ok" />
      Real data
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warn/10 px-2 py-0.5 text-xs font-medium text-warn">
      <span className="h-1.5 w-1.5 rounded-full bg-warn" />
      Simulated
    </span>
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
    <header className="mb-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
      <div className="max-w-3xl">
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
          {kind && <Tag kind={kind} />}
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[28px] font-semibold leading-tight text-ink md:text-[34px]">{title}</h1>
        {children && <div className="mt-3 text-[15px] leading-relaxed text-muted">{children}</div>}
      </div>
      {aside && <div>{aside}</div>}
    </header>
  );
}

/** A status pill for something a person signed: "Received", "Not received", "Verified". */
export function Stamp({ children, tone = "ok", className }: { children: React.ReactNode; tone?: "seal" | "ok" | "bad"; className?: string }) {
  const color = { seal: "bg-ok/10 text-ok", ok: "bg-ok/10 text-ok", bad: "bg-bad/10 text-bad" }[tone];
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", color, className)}>
      {tone === "bad" ? <Icon.Cross className="h-3 w-3" /> : <Icon.Check className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

/** A figure with its label: a quiet tile. */
export function Stat({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: Tone }) {
  return (
    <div className="min-w-0 rounded-xl border border-line bg-card px-4 py-3.5">
      <p className="text-[13px] text-muted">{label}</p>
      <p className={cx("mt-1 break-words text-2xl font-semibold tabular-nums tracking-tight", tone ? toneText[tone] : "text-ink")}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs leading-snug text-muted">{sub}</p>}
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
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium", toneBadge[tone])}>
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
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<"chain" | "local" | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const styles = {
    primary: "bg-accent text-on-accent hover:bg-accent/90",
    secondary: "border border-line bg-card text-ink hover:bg-sunk",
    danger: "bg-bad text-on-ink hover:bg-bad/85",
  }[variant];
  return (
    <span className={cx("inline-flex flex-col gap-1.5", className)}>
      <button
        type="button"
        disabled={disabled || busy}
        onClick={async () => {
          setBusy(true);
          setErr(null);
          // Local actions (a credential made in the browser) finish at once and get no toast; anything that
          // waits on the chain gets a corner notice after a moment, then its transaction.
          let t: number | undefined;
          const timer = setTimeout(() => (t = toast?.start(`Writing to ${CHAIN_LABEL}…`)), 350);
          try {
            const r = await onClick();
            clearTimeout(timer);
            const hash = (r as { hash?: string } | undefined)?.hash;
            if (!t && hash) t = toast?.start(`Writing to ${CHAIN_LABEL}…`);
            // Anything slow enough to get a notice went to the chain, with or without a hash to show.
            if (t) toast?.done(t, `Confirmed on ${CHAIN_LABEL}`, hash);
            onDone?.(r);
            setDone(hash || t ? "chain" : "local");
            setTimeout(() => setDone(null), 2600);
            await refresh();
          } catch (e) {
            clearTimeout(timer);
            const msg = humanError(e instanceof Error ? e.message : String(e));
            setErr(msg);
            if (t) toast?.fail(t, msg);
          } finally {
            setBusy(false);
          }
        }}
        className={cx(
          "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45",
          styles,
        )}
      >
        {busy && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {children}
      </button>
      {done && (
        <span className="flex items-center gap-1 text-xs font-medium text-ok" role="status">
          <Icon.Check className="h-3.5 w-3.5" /> {done === "chain" ? "Saved on-chain" : "Done"}
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
  "rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 hover:border-ink/30 focus:border-accent focus:ring-2 focus:ring-accent/20";

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-sunk/70 px-4 py-6 text-center text-sm text-muted">{children}</div>
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
  const border = { ok: "border-ok/20", warn: "border-warn/25", bad: "border-bad/20", info: "border-accent/20", muted: "border-line" }[tone];
  const bg = { ok: "bg-ok/5", warn: "bg-warn/5", bad: "bg-bad/5", info: "bg-accent/5", muted: "bg-sunk/60" }[tone];
  return <div className={cx("rounded-lg border px-4 py-3 text-sm text-ink", border, bg)}>{children}</div>;
}
