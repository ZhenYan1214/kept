"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSnapshot } from "./snapshot";
import { useToast } from "./toast";
import { cx } from "./ui";
import { Icon } from "./icons";
import { loadCard, registrationPayload, type HouseholdCard } from "@/lib/household";
import { useInbox } from "@/lib/inbox";
import { lineKey } from "@/lib/scopes";
import { getDeployment } from "@/lib/config";
import { publicClient } from "@/lib/chain";
import { ledgerAbi } from "@/generated/contracts";

/** The 2-minute path through the demo, in order. Each step is done when the chain (or this browser) says so. */
export const STEPS = [
  { label: "Get a credential", page: "Household" },
  { label: "Register it", page: "Village & township" },
  { label: "Publish payments", page: "Custodians" },
  { label: "Answer your payment", page: "Household" },
  { label: "See the record", page: "Overview" },
  { label: "Try to break the charter", page: "Fund committee" },
] as const;

const FLAGS = "kept.demo";
const FLAGS_EVENT = "kept-demo";
type Flags = { seenRecord?: boolean; triedCharter?: boolean };

function readFlags(): Flags {
  try {
    return JSON.parse(localStorage.getItem(FLAGS) ?? "{}");
  } catch {
    return {};
  }
}

/** Marks a step that has no on-chain trace of its own (looking at the record, a refused transaction). */
export function setDemoFlag(flag: keyof Flags) {
  try {
    localStorage.setItem(FLAGS, JSON.stringify({ ...readFlags(), [flag]: true }));
  } catch {}
  window.dispatchEvent(new Event(FLAGS_EVENT));
}

export function clearDemoFlags() {
  try {
    localStorage.removeItem(FLAGS);
  } catch {}
  window.dispatchEvent(new Event(FLAGS_EVENT));
}

/** A value kept in this browser; undefined until it has been read. */
function useStored<T>(read: () => T, events: string[]) {
  const [v, setV] = useState<T | undefined>(undefined);
  useEffect(() => {
    const update = () => setV(read());
    update();
    for (const e of events) window.addEventListener(e, update);
    return () => events.forEach((e) => window.removeEventListener(e, update));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return v;
}

type Hint = { text: React.ReactNode; href: string };
type Progress = { ready: boolean; done: boolean[]; current: number; hint: Hint | null; card: HouseholdCard | null | undefined };

const ProgressContext = createContext<Progress | null>(null);
export const useDemoProgress = () => useContext(ProgressContext);

const B = ({ children }: { children: React.ReactNode }) => <strong className="font-semibold text-ink">{children}</strong>;

export function DemoProgressProvider({ children }: { children: React.ReactNode }) {
  const { snap } = useSnapshot();
  const path = usePathname();
  const card = useStored(loadCard, ["kept-card", "storage"]);
  const flags = useStored(readFlags, [FLAGS_EVENT, "storage"]) ?? {};
  const scans = useInbox<{ commitment: string }>("registration", true);
  const reg = useMemo(() => (card ? registrationPayload(card) : null), [card]);

  // Leaving the overview counts as having seen the record.
  const prevPath = useRef(path);
  useEffect(() => {
    if (prevPath.current === "/dashboard" && path !== "/dashboard") setDemoFlag("seenRecord");
    prevPath.current = path;
  }, [path]);

  const registration = snap?.registrations.filter((r) => reg && r.commitment.toString() === reg.commitment).at(-1);
  const scanned = !!reg && scans.some((m) => m.payload.commitment === reg.commitment);

  // This household's payment lines: look for its receipt address in every published batch, once per batch.
  const [lines, setLines] = useState<{ key: string; state: number }[]>([]);
  const [scannedOnce, setScannedOnce] = useState(false);
  const found = useRef(new Map<string, `0x${string}`>());
  const checked = useRef(new Set<string>());
  const receipt = reg?.receipt;
  useEffect(() => {
    found.current.clear();
    checked.current.clear();
    setLines([]);
    setScannedOnce(false);
  }, [receipt]);
  useEffect(() => {
    if (!snap || !receipt || registration?.status !== 2) return;
    let stale = false;
    (async () => {
      const d = getDeployment();
      for (const h of snap.hops) {
        for (const b of h.batches) {
          const id = `${h.id}-${b.index}`;
          if (checked.current.has(id)) continue;
          const amount = await publicClient.readContract({
            address: d.ledger,
            abi: ledgerAbi,
            functionName: "lineAmount",
            args: [BigInt(h.id), BigInt(b.index), receipt],
          });
          checked.current.add(id);
          if (amount > 0n) found.current.set(id, lineKey(BigInt(h.id), BigInt(b.index), receipt));
        }
      }
      const next = await Promise.all(
        [...found.current].map(async ([key, lk]) => ({
          key,
          state: Number(await publicClient.readContract({ address: d.ledger, abi: ledgerAbi, functionName: "lineState", args: [lk] })),
        })),
      );
      if (!stale) {
        setLines(next);
        setScannedOnce(true);
      }
    })().catch(() => {});
    return () => {
      stale = true;
    };
  }, [snap, receipt, registration?.status]);

  const answered = lines.some((l) => l.state === 1 || l.state === 2);
  const done = [!!card, registration?.status === 2, lines.length > 0, answered, !!flags.seenRecord, !!flags.triedCharter];
  const current = done.findIndex((d) => !d);
  const at = current === -1 ? STEPS.length : current;

  let hint: Hint | null = null;
  if (at === 0) hint = { href: "/household", text: <>Press <B>Create credential</B>. It makes a key on this device. Nothing is sent anywhere.</> };
  else if (at === 1) {
    if (registration?.status === 1)
      hint = { href: "/issuer", text: <>The village chief has signed. Now sign as the <B>Township office</B> and press <B>Approve</B>: two signatures make a household verified.</> };
    else if (registration?.status === 3)
      hint = { href: "/household", text: <>This registration was rejected. Remove the credential at the bottom of the card and create a new one.</> };
    else if (scanned) hint = { href: "/issuer", text: <>The chief has your code. Press <B>Propose registration</B>: that is signature 1 of 2.</> };
    else hint = { href: "/household", text: <>Under Status, press <B>Simulate: chief scans this code</B>. The code holds no name, only public data.</> };
  } else if (at === 2)
    hint = {
      href: "/custody",
      text: (
        <>
          As the Ministry, tick <B>{card?.label ?? "your household"}</B> under “Report a payment batch” and press <B>Publish payment lines</B>.
        </>
      ),
    };
  else if (at === 3) hint = { href: "/household", text: <>A payment line with your receipt address is now public. Did it arrive? Press <B>I received it</B> or <B>I did not receive it</B>.</> };
  else if (at === 4)
    hint = { href: "/dashboard", text: <>Your answer now counts in <B>Confirmed</B>. Anyone can read these totals and alerts, and no custodian can change what you said.</> };
  else if (at === 5)
    hint = { href: "/committee", text: <>Ask the contract to spend money on something the charter never promised. Press <B>Try it</B>.</> };

  // A small cheer when a step completes while the visitor is here, not when the page first catches up.
  const toast = useToast();
  const prevAt = useRef<number | null>(null);
  const settled = card !== undefined && (!card || (!!snap && (registration?.status !== 2 || scannedOnce)));
  useEffect(() => {
    if (!settled) return;
    if (prevAt.current !== null && at === prevAt.current + 1 && toast) {
      const id = toast.start(`Step ${prevAt.current + 1} done`);
      toast.done(id, `Step ${prevAt.current + 1} done: ${STEPS[prevAt.current].label}`, undefined, at < STEPS.length ? `Next: ${STEPS[at].label}` : "You ran the whole loop.");
    }
    prevAt.current = at;
  }, [at, settled, toast]);

  return <ProgressContext.Provider value={{ ready: settled, done, current: at, hint, card }}>{children}</ProgressContext.Provider>;
}

/** The guided path in the sidebar: what is done, what is next. */
export function GuideSteps() {
  const p = useDemoProgress();
  if (!p) return null;
  const count = p.ready ? p.done.filter(Boolean).length : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between px-2.5">
        <p className="text-xs font-semibold text-muted">Guided demo</p>
        <p className="text-xs tabular-nums text-muted">
          {count}/{STEPS.length}
        </p>
      </div>
      <div className="mx-2.5 mt-2 h-1 overflow-hidden rounded-full bg-sunk">
        <div className="h-full rounded-full bg-ok transition-[width] duration-700 ease-out" style={{ width: `${(count / STEPS.length) * 100}%` }} />
      </div>
      <ol className="mt-3 flex flex-col gap-0.5">
        {STEPS.map((s, i) => {
          const isDone = p.ready && p.done[i];
          const now = p.ready && i === p.current;
          return (
            <li key={s.label}>
              <Link
                href={now && p.hint ? p.hint.href : HREFS[i]}
                className={cx(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  now ? "bg-sunk font-semibold text-ink" : isDone ? "text-ink/70 hover:bg-sunk/70" : "text-muted hover:bg-sunk/70 hover:text-ink",
                )}
              >
                <span
                  className={cx(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-semibold tabular-nums",
                    isDone ? "pop border-ok bg-ok text-on-ink" : now ? "border-ink bg-ink text-on-ink" : "border-line text-muted",
                  )}
                >
                  {isDone ? <Icon.Check className="h-3 w-3" /> : i + 1}
                </span>
                {s.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const HREFS = ["/household", "/issuer", "/custody", "/household", "/dashboard", "/committee"];

/** The line above every demo page: the one thing to do next, and where. */
export function GuideBar() {
  const p = useDemoProgress();
  const path = usePathname();
  if (!p) return null;
  if (!p.ready) return <div className="mb-8 h-[66px] animate-pulse rounded-xl bg-sunk/60" aria-hidden />;
  if (p.current >= STEPS.length) {
    return (
      <div className="rise mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-ok/25 bg-ok/5 px-4 py-3.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ok text-on-ink">
          <Icon.Check className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">You ran the whole loop.</p>
          <p className="text-sm text-muted">The registration, the payment line and your answer are real transactions anyone can check. Try any role freely, or see the real case behind it.</p>
        </div>
        <Link href="/replay" className="rounded-lg border border-line bg-card px-3.5 py-2 text-sm font-semibold text-ink hover:bg-sunk">
          The Guangfu case
        </Link>
      </div>
    );
  }
  const step = STEPS[p.current];
  const here = p.hint?.href === path;
  const nextAfterRecord = p.current === 4 && here;
  return (
    <div
      key={`${p.current}-${p.hint?.href}`}
      className="rise mb-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 rounded-xl border border-line border-l-[3px] border-l-seal bg-card px-4 py-3 shadow-[0_1px_2px_rgb(0_0_0/0.04)] sm:mb-8 sm:py-3.5"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-on-ink tabular-nums max-sm:hidden">
        {p.current + 1}
      </span>
      <div className="min-w-0 flex-[1_1_320px]">
        <p className="text-xs text-muted">
          Step {p.current + 1} of {STEPS.length} · <span className="font-semibold text-ink">{step.label}</span>
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted">{p.hint?.text}</p>
      </div>
      {p.hint && !here && (
        <Link
          href={p.hint.href}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
        >
          Go to {pageOf(p.hint.href)}
          <Icon.Arrow className="h-4 w-4" />
        </Link>
      )}
      {nextAfterRecord && (
        <Link
          href="/committee"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
        >
          Next: {STEPS[5].label}
          <Icon.Arrow className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

const pageOf = (href: string) =>
  ({ "/household": "Household", "/issuer": "Village & township", "/custody": "Custodians", "/dashboard": "Overview", "/committee": "Fund committee" })[href] ??
  "page";
