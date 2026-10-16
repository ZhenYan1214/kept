"use client";
import { useState } from "react";
import { useSnapshot } from "./snapshot";
import { EXPLORER_URL } from "@/lib/config";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export const ntd = (v: bigint | number) => `NT$${Number(v).toLocaleString("en-US")}`;

/** Short form for stat cards: NT$9.6M, NT$600K. The exact figure stays in the tooltip. */
export const ntdShort = (v: bigint | number) => {
  const n = Number(v);
  if (n >= 1e6) return `NT$${(n / 1e6).toFixed(n >= 1e8 ? 0 : 1)}M`;
  if (n >= 1e4) return `NT$${Math.round(n / 1e3)}K`;
  return ntd(n);
};

export const pct = (part: bigint | number, whole: bigint | number) => {
  const w = Number(whole);
  return w === 0 ? 0 : Math.round((Number(part) / w) * 1000) / 10;
};

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cx("min-w-0 rounded-xl border border-line bg-card p-5 shadow-sm", className)}>{children}</section>;
}

export function SectionTitle({ kicker, title, children }: { kicker?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4">
      {kicker && <p className="text-xs font-semibold uppercase tracking-wider text-accent">{kicker}</p>}
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {children && <p className="mt-1 text-sm text-muted">{children}</p>}
    </div>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: Tone }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={cx("mt-1 break-words text-lg font-semibold tabular-nums sm:text-2xl", tone ? toneText[tone] : "text-ink")}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
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
  ok: "bg-ok/10 text-ok ring-ok/20",
  warn: "bg-warn/10 text-warn ring-warn/25",
  bad: "bg-bad/10 text-bad ring-bad/20",
  info: "bg-accent/10 text-accent ring-accent/20",
  muted: "bg-ink/5 text-muted ring-ink/10",
};

export function Badge({ tone = "muted", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", toneBadge[tone])}>
      {children}
    </span>
  );
}

/** Horizontal bar with an optional cap marker. */
export function Bar({ value, max, cap, tone = "info" }: { value: number; max: number; cap?: number; tone?: Tone }) {
  const w = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  const c = cap === undefined || max === 0 ? undefined : Math.min(100, (cap / max) * 100);
  const fill = { ok: "bg-ok", warn: "bg-warn", bad: "bg-bad", info: "bg-accent", muted: "bg-muted" }[tone];
  return (
    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-ink/8">
      <div className={cx("h-full rounded-full transition-all", fill)} style={{ width: `${w}%` }} />
      {c !== undefined && <div className="absolute top-0 h-full w-0.5 bg-ink/60" style={{ left: `${c}%` }} title="cap" />}
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

/** Button that runs an async action, shows progress and surfaces contract errors in plain words. */
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
  const [err, setErr] = useState<string | null>(null);
  const styles = {
    primary: "bg-accent text-white hover:bg-accent/90",
    secondary: "bg-card text-ink ring-1 ring-inset ring-line hover:bg-ink/5",
    danger: "bg-bad text-white hover:bg-bad/90",
  }[variant];
  return (
    <span className={cx("inline-flex flex-col gap-1", className)}>
      <button
        type="button"
        disabled={disabled || busy}
        onClick={async () => {
          setBusy(true);
          setErr(null);
          try {
            const r = await onClick();
            onDone?.(r);
            await refresh();
          } catch (e) {
            setErr(humanError(e instanceof Error ? e.message : String(e)));
          } finally {
            setBusy(false);
          }
        }}
        className={cx(
          "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
          styles,
        )}
      >
        {busy && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {children}
      </button>
      {err && <span className="max-w-md text-xs text-bad">{err}</span>}
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
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-dashed border-line p-4 text-center text-sm text-muted">{children}</p>;
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
  const bg = { ok: "bg-ok/5 border-ok/20", warn: "bg-warn/5 border-warn/25", bad: "bg-bad/5 border-bad/20", info: "bg-accent/5 border-accent/20", muted: "bg-ink/5 border-line" }[tone];
  return <div className={cx("rounded-lg border p-3 text-sm text-ink", bg)}>{children}</div>;
}
