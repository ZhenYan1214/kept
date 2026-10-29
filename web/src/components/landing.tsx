"use client";
import { useEffect, useMemo, useState } from "react";
import { cx } from "./ui";
import { Icon, KeptMark } from "./icons";
import { TRANSFERS, SPENT_TOTAL, RECONCILED_TOTAL } from "@/lib/replay/guangfu-2025";
import { DISCLOSURES } from "@/lib/replay/disclosures-0923";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Runs `tick` every `ms` while `on`, unless the viewer prefers less motion. */
function useTicker(on: boolean, ms: number, tick: () => void) {
  useEffect(() => {
    if (!on || reducedMotion()) return;
    const id = setInterval(tick, ms);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, ms]);
}

const Check = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

/**
 * The hero: the public record behind, a household's phone in front. It plays the core moment by itself
 * (a payment is recorded, the household answers, the record gains a line) and hands over when clicked.
 */
export function HeroScene() {
  // 0 notice, 1 payment, 2 question, 3 tap, 4–6 answered and recorded
  const [beat, setBeat] = useState(2);
  const [auto, setAuto] = useState(true);
  const [answer, setAnswer] = useState<"yes" | "no">("yes");
  useEffect(() => {
    if (!reducedMotion()) setBeat(0);
  }, []);
  useTicker(auto, 1500, () => setBeat((b) => (b + 1) % 7));
  const say = (a: "yes" | "no") => {
    setAuto(false);
    setAnswer(a);
    setBeat(4);
  };
  const no = answer === "no";
  const answered = beat >= 4;

  return (
    <div className="rise relative mx-auto h-[560px] w-full min-w-0 max-w-[620px] [animation-delay:200ms]">
      {/* The public record: it starts behind the phone, its text clear of it */}
      <div className="absolute left-[120px] right-0 top-2.5 overflow-hidden rounded-2xl border border-line bg-card shadow-[0_30px_60px_-24px_rgb(27_41_53/0.25)] max-sm:hidden">
        <div className="flex h-10 items-center gap-1.5 border-b border-line bg-sunk/50 px-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="ml-3 text-xs text-muted">Public record · Guangfu Relief Fund</span>
        </div>
        <div className="py-4 pl-[170px] pr-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold">Latest on-chain</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-ok">
              <span className="ping h-[7px] w-[7px] rounded-full bg-ok" />
              Live
            </span>
          </div>
          <ol className="mt-3 text-[13px]">
            {answered && (
              <li className="new-row -mx-2.5 rounded-lg p-2.5">
                <div className="flex justify-between gap-2">
                  <span className={cx("font-semibold", no ? "text-bad" : "text-ok")}>
                    {no ? "A household: not received" : "A household confirmed its payment"}
                  </span>
                  <span className="text-muted">now</span>
                </div>
                <div className="mt-0.5 text-muted">Signed with its own key</div>
              </li>
            )}
            {[
              ["Ministry published 12 lines", "Totals added up by the contract", "2 min"],
              ["Township approved a household", "2 of 2 signatures", "6 min"],
              ["Ministry acknowledged a tranche", "Livelihood relief", "9 min"],
            ].map(([a, b, t]) => (
              <li key={a} className="border-t border-line/70 py-2.5">
                <div className="flex justify-between gap-2">
                  <span className="font-semibold">{a}</span>
                  <span className="text-muted">{t}</span>
                </div>
                <div className="mt-0.5 text-muted">{b}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* The household's phone */}
      <div className="absolute left-0 top-[60px] w-[270px] rounded-[40px] bg-[#1b2935] p-[9px] shadow-[0_40px_80px_-20px_rgb(27_41_53/0.45)] max-sm:left-1/2 max-sm:-translate-x-1/2">
        <div className="relative h-[462px] overflow-hidden rounded-[32px] bg-[#fffdf9] px-[18px] py-[22px] text-[#1b2935]">
          <div className="flex items-center gap-2">
            <KeptMark className="h-5 w-5" seal={false} plain />
            <span className="text-[13px] font-semibold">My relief</span>
            <span className="ml-auto text-[11px] text-[#2c7350]">Verified</span>
          </div>
          {beat === 0 && (
            <div className="drop mt-4 rounded-[14px] bg-[#1b2935] px-3.5 py-3 text-[#fffdf9]">
              <div className="text-[11px] text-white/60">Kept · now</div>
              <div className="mt-0.5 text-sm font-semibold">A payment was recorded for you</div>
            </div>
          )}
          {beat >= 1 && beat <= 3 && (
            <div className="rise mt-4">
              <div className="text-xs text-[#6b7480]">Recorded as paid by the Ministry</div>
              <div className="mt-1 text-[32px] font-semibold tracking-[-0.03em]">NT$50,000</div>
              <div className="mt-[18px] h-px bg-[#eee6d9]" />
            </div>
          )}
          {beat >= 2 && beat <= 3 && (
            <div className="rise">
              <div className="mt-4 text-[15px] font-semibold">Did it reach you?</div>
              <div className="mt-3 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => say("yes")}
                  className={cx("min-h-[46px] rounded-[11px] bg-[#1b2935] text-sm font-semibold text-[#fffdf9]", beat === 3 && auto && "tap")}
                >
                  Yes, I received it
                </button>
                <button
                  type="button"
                  onClick={() => say("no")}
                  className="min-h-[46px] rounded-[11px] border border-[#d9cfbf] text-sm font-semibold text-[#1b2935]"
                >
                  No, it hasn’t arrived
                </button>
              </div>
            </div>
          )}
          {answered && (
            <div className="mt-6 text-center">
              <span className={cx("pop inline-grid h-14 w-14 place-items-center rounded-full text-[#fffdf9]", no ? "bg-[#b3261e]" : "bg-[#2c7350]")}>
                <Check className="h-7 w-7" />
              </span>
              <div className="rise mt-3.5 text-[17px] font-semibold [animation-delay:150ms]">{no ? "Recorded: not received" : "Recorded: received"}</div>
              <div className="rise mt-1.5 text-[13px] leading-snug text-[#4a5662] [animation-delay:250ms]">
                On the public record. The Ministry can’t change it.
              </div>
              <button
                type="button"
                onClick={() => {
                  setAnswer("yes");
                  setBeat(0);
                  setAuto(true);
                }}
                className="mt-3 min-h-11 text-[13px] text-[#6b7480] underline"
              >
                Replay
              </button>
            </div>
          )}
          <div className="absolute inset-x-[18px] bottom-[18px] flex items-center gap-2.5 rounded-xl bg-[#f1ebe1] px-3 py-2.5 text-[11.5px] leading-snug text-[#4a5662]">
            <Icon.Shield className="h-4 w-4 shrink-0 text-[#2c7350]" />
            Only a receipt address and the amount go public. Never your name.
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  {
    title: "Each custodian signs for what it receives",
    body: "Foundation, ministry, county, NGO: every transfer is recorded by the sender and acknowledged by the receiver, on one shared record no single custodian controls.",
  },
  {
    title: "The household answers its own payment",
    body: "Received, or not received. On a phone, a printed card, or through a village social worker. No name, ID or bank account goes on-chain.",
  },
  {
    title: "A random sample is visited in person",
    body: "For the households who never answer, the contract picks one line in five for an independent visit, so fake households cannot hide behind silence.",
  },
];

const HOPS = [
  { name: "Foundation", state: "sent", icon: Icon.Coin },
  { name: "Ministry", state: "acknowledged", icon: Icon.Building },
  { name: "County", state: "acknowledged", icon: Icon.Ledger },
  { name: "Household", state: "received", icon: Icon.House },
];
const SAMPLED = new Set([2, 7, 11, 18, 23, 26]);

/** How it works: three tabs that advance by themselves until someone picks one, each with its own small scene. */
export function HowTabs() {
  const [tab, setTab] = useState(0);
  const [auto, setAuto] = useState(true);
  useTicker(auto, 7000, () => setTab((t) => (t + 1) % 3));
  return (
    <div className="mt-14 flex flex-wrap items-stretch gap-12">
      <div role="tablist" aria-label="How it works" className="flex flex-[1_1_340px] flex-col gap-1.5">
        {TABS.map((t, i) => (
          <button
            key={t.title}
            type="button"
            role="tab"
            aria-selected={tab === i}
            onClick={() => {
              setTab(i);
              setAuto(false);
            }}
            className={cx("relative overflow-hidden rounded-[14px] px-5 py-5 text-left transition-colors", tab === i ? "bg-sunk" : "hover:bg-sunk/50")}
          >
            <div className="flex items-baseline gap-3.5">
              <span className="font-mono text-[13px] text-muted">0{i + 1}</span>
              <span className="text-[19px] font-semibold tracking-[-0.01em]">{t.title}</span>
            </div>
            {tab === i && (
              <>
                <p className="rise ml-[34px] mt-2.5 text-[15px] leading-relaxed text-muted">{t.body}</p>
                {auto && <span key={`bar-${tab}`} className="fill-bar absolute inset-x-0 bottom-0 h-0.5 bg-ink [animation-duration:7s]" />}
              </>
            )}
          </button>
        ))}
      </div>

      <div className="flex min-h-[380px] min-w-0 flex-[999_1_520px] items-center justify-center rounded-[20px] bg-sunk p-10">
        {tab === 0 && (
          <div key="t0" className="rise w-full max-w-[560px]">
            <div className="relative mx-9 h-1 rounded-sm bg-line">
              <span className="travel absolute -top-1.5 -ml-2 h-4 w-4 rounded-full bg-seal shadow-[0_0_0_5px_rgb(241_102_70/0.2)]" />
            </div>
            <div className="-mt-10 grid grid-cols-4 gap-2 text-center">
              {HOPS.map((h, i) => (
                <div key={h.name} className="flex flex-col items-center gap-2.5">
                  <span className="grid h-[72px] w-[72px] place-items-center rounded-full border border-line bg-card shadow-[0_8px_20px_-10px_rgb(27_41_53/0.25)]">
                    <h.icon className="h-7 w-7 text-ink" />
                  </span>
                  <span className="text-[15px] font-semibold">{h.name}</span>
                  <span className="pop rounded-full bg-ok/10 px-2.5 py-0.5 text-xs font-semibold text-ok" style={{ animationDelay: `${0.2 + i * 0.8}s` }}>
                    {h.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 1 && (
          <div key="t1" className="flex w-full max-w-[440px] flex-col gap-2.5">
            {[
              ["0x3f9c…a1", "Received", "bg-ok/10 text-ok"],
              ["0x81d2…7e", "Not received", "bg-bad/10 text-bad"],
              ["0xc04b…19", "No answer yet", "bg-line/60 text-muted"],
            ].map(([addr, ans, cls], i) => (
              <div
                key={addr}
                className="rise flex items-center justify-between gap-3 rounded-xl border border-line bg-card px-4 py-3.5"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <span className="font-mono text-sm">{addr}</span>
                <span className="text-[15px] font-semibold">NT$50,000</span>
                <span className={cx("pop rounded-full px-2.5 py-0.5 text-[13px] font-semibold", cls)} style={{ animationDelay: `${0.9 + i * 0.6}s` }}>
                  {ans}
                </span>
              </div>
            ))}
            <p className="mt-1.5 text-center text-[13px] text-muted">A receipt address and an amount. Never a name.</p>
          </div>
        )}
        {tab === 2 && (
          <div key="t2" className="rise text-center">
            <div className="grid grid-cols-6 justify-center gap-2.5 sm:grid-cols-10">
              {Array.from({ length: 30 }, (_, i) => (
                <span
                  key={i}
                  className={cx("grid h-[34px] w-[34px] place-items-center rounded-[9px]", SAMPLED.has(i) ? "ring-pulse bg-card text-seal" : "text-muted/60")}
                >
                  <Icon.House className="h-[18px] w-[18px]" />
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted">The contract picks one line in five. An independent auditor visits each one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const day = (s: string) => Date.parse(s) / 86_400_000;

/** Guangfu 2025, from the foundation's own disclosures: what was paid out, and what was reported as reconciled. */
export function CaseChart() {
  const { paid, rec, labels } = useMemo(() => {
    const start = day("2025-09-23");
    const end = day("2026-09-30");
    const X = (d: number) => 20 + ((d - start) / (end - start)) * 480;
    const Y = (v: number) => 200 - (v / SPENT_TOTAL) * 170;
    let cum = 0;
    const paid: string[] = [`${X(start)},${Y(0)}`];
    for (const t of [...TRANSFERS].sort((a, b) => a.date.localeCompare(b.date))) {
      const x = X(day(t.date));
      paid.push(`${x},${Y(cum)}`);
      cum += t.amount;
      paid.push(`${x},${Y(cum)}`);
    }
    paid.push(`${X(end)},${Y(cum)}`);
    const rec = DISCLOSURES.filter((d) => d.reconciled !== null).map((d) => `${X(day(d.asOf ?? d.published))},${Y(d.reconciled!)}`);
    return { paid: paid.join(" "), rec: rec.join(" "), labels: { end: X(end) } };
  }, []);
  const bn = (SPENT_TOTAL / 1e9).toFixed(2);
  const m = (RECONCILED_TOTAL / 1e6).toFixed(1);
  return (
    <figure className="m-0 min-w-0 flex-[1_1_520px]">
      <svg
        viewBox="0 0 540 250"
        className="h-auto w-full"
        role="img"
        aria-label={`Cumulative payouts rise to NT$${bn} billion within months, while the reported reconciled total stays near zero and reaches NT$${m} million a year later`}
      >
        <line x1="20" y1="200" x2="520" y2="200" stroke="#3a4b5c" />
        <line x1="20" y1="115" x2="520" y2="115" stroke="#2a3a4a" strokeDasharray="3 5" />
        <line x1="20" y1="30" x2="520" y2="30" stroke="#2a3a4a" strokeDasharray="3 5" />
        <polyline className="draw-in" style={{ ["--len" as string]: 1400 }} fill="none" stroke="#f8f4ee" strokeWidth={2.5} strokeLinejoin="round" points={paid} />
        <polyline
          className="draw-in"
          style={{ ["--len" as string]: 1400, animationDelay: "1s" }}
          fill="none"
          stroke="#f16646"
          strokeWidth={2.5}
          strokeLinejoin="round"
          points={rec}
        />
        <text x={labels.end} y="18" textAnchor="end" fill="#f8f4ee" fontSize="13">
          Paid out · NT${bn}bn
        </text>
        <text x={labels.end} y="180" textAnchor="end" fill="#f6a08a" fontSize="13">
          Reported reconciled · NT${m}M
        </text>
        <text x="20" y="222" fill="#8e9aa6" fontSize="12">
          Sep 2025
        </text>
        <text x={labels.end} y="222" textAnchor="end" fill="#8e9aa6" fontSize="12">
          Sep 2026
        </text>
      </svg>
      <figcaption className="mt-2 text-[13px] text-[#8e9aa6]">From the foundation’s eleven monthly disclosures, transcribed by hand.</figcaption>
    </figure>
  );
}

const FAQ = [
  {
    q: "Do households need a crypto wallet?",
    a: "No. A household gets a credential on its phone or a printed card. A relayer pays the transaction fees, so households never touch crypto. A village social worker can answer for those who need help, and the household’s own answer always replaces theirs.",
  },
  {
    q: "Does the money itself move on-chain?",
    a: "Not in the first phase. Relief money keeps moving through banks as it does today. Kept records who holds it at each hand, and what each household says arrived.",
  },
  {
    q: "What exactly goes on-chain?",
    a: "Each payment as a line: a receipt address and an amount. To stop double registration, a keyed hash of the ID number is stored. Names, ID numbers and bank accounts never are.",
  },
  {
    q: "What about households that never answer?",
    a: "The contract draws a random sample of every payment batch, one line in five. An independent auditor visits those households, and each signs the visit with its own key.",
  },
  {
    q: "Is this running today?",
    a: "The contracts run on the Base Sepolia testnet with a simulated fund, so anyone can try every role. The Guangfu figures come from the relief foundation’s real public disclosures.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="min-w-0 flex-[999_1_560px] border-t border-line">
      {FAQ.map((f, i) => (
        <div key={f.q} className="border-b border-line">
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex min-h-16 w-full items-center justify-between gap-4 py-[18px] text-left text-lg font-semibold text-ink"
          >
            {f.q}
            <svg
              viewBox="0 0 24 24"
              className={cx("h-5 w-5 shrink-0 transition-transform duration-300", open === i && "rotate-45")}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          {open === i && <p className="rise pb-[22px] pr-10 text-base leading-relaxed text-muted">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
