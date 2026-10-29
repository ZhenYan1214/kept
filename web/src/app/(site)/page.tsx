import Link from "next/link";
import { KeptMark } from "@/components/icons";
import { CaseChart, Faq, HeroScene, HowTabs } from "@/components/landing";
import { SPENT_TOTAL, TRANSFERS } from "@/lib/replay/guangfu-2025";

const PREALLOC_PCT = Math.round((TRANSFERS.filter((t) => t.prealloc).reduce((a, t) => a + t.amount, 0) / SPENT_TOTAL) * 1000) / 10;

const Tick = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 text-ok" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

const FITS = [
  {
    title: "Money stays in banks",
    body: "Kept records who holds what. Payments still move the way they do today.",
    icon: "M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M2 10l10-6 10 6",
  },
  {
    title: "Registration rides on existing visits",
    body: "The village chief and the township office sign, as they already visit after a disaster.",
    icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  },
  {
    title: "A charter that can’t quietly change",
    body: "Purposes and caps are fixed when money is raised. Changes wait in public, and households can veto them.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-4 pb-16 pt-14 sm:px-6 md:pt-[88px]">
        <div className="min-w-0 flex-[999_1_460px]">
          <Link
            href="/replay"
            className="rise inline-flex items-center gap-2.5 rounded-full border border-line bg-card py-1.5 pl-2 pr-3.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <span className="rounded-full bg-ok px-2 py-0.5 text-xs font-semibold text-on-ink">Live demo</span>
            Built on the real 2025 Guangfu flood records
          </Link>
          <h1 className="rise mt-7 text-[52px] font-semibold leading-none tracking-[-0.045em] [animation-delay:80ms] sm:text-[72px]">
            Know the aid
            <br />
            arrived.
          </h1>
          <p className="rise mt-6 max-w-[480px] text-xl leading-relaxed text-muted [animation-delay:160ms]">
            Kept follows donated money hand by hand to the household it was meant for, and lets that household say, on a public record,
            whether it arrived.
          </p>
          <div className="rise mt-9 flex flex-wrap items-center gap-6 [animation-delay:240ms]">
            <Link
              href="/household"
              className="rounded-[10px] bg-accent px-[22px] py-[15px] text-base font-semibold text-on-accent shadow-[0_8px_20px_-8px_rgb(27_41_53/0.5)] transition-opacity hover:opacity-90"
            >
              Try the demo, 2 minutes
            </Link>
            <a href="#how" className="border-b-[1.5px] border-line pb-0.5 text-base font-semibold text-ink transition-colors hover:border-ink">
              See how it works
            </a>
          </div>
          <div className="rise mt-11 flex flex-wrap gap-6 text-sm text-muted [animation-delay:320ms]">
            {["No wallet for households", "No names on-chain", "Open source"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <Tick />
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-[1_1_520px]">
          <HeroScene />
        </div>
      </section>

      {/* Sources */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-line pt-7 text-sm text-muted">
          <span>Grounded in public records from</span>
          <a href="/replay" className="font-semibold text-ink/80 hover:text-ink">
            Disaster Relief Foundation disclosures
          </a>
          <a href="/why" className="font-semibold text-ink/80 hover:text-ink">
            Hualien County committee papers
          </a>
          <a href="https://github.com/ZhenYan1214/kept" className="font-semibold text-ink/80 hover:text-ink">
            Six verified contracts on Base
          </a>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-16 border-y border-line bg-card">
        <div className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 md:py-28">
          <h2 className="max-w-[640px] text-[36px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[44px]">
            Every hand signs. The last hand is the household.
          </h2>
          <p className="mt-4 max-w-[560px] text-lg leading-relaxed text-muted">Three changes to how relief money is recorded. Nothing about how it is paid.</p>
          <HowTabs />
        </div>
      </section>

      {/* The case */}
      <section id="case" className="bg-[#1b2935] text-[#f8f4ee]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-16 px-4 py-24 sm:px-6 md:py-28">
          <div className="min-w-0 flex-[1_1_400px]">
            <p className="text-[15px] text-[#b9c2cb]">Guangfu, Taiwan · barrier-lake flood, September 2025</p>
            <p className="mt-4 text-[52px] font-semibold leading-none tracking-[-0.045em] md:text-[68px]">NT$1.21 billion</p>
            <p className="mt-6 text-[19px] leading-relaxed text-[#d7dde3]">
              left the national relief foundation in {TRANSFERS.length} transfers. {PREALLOC_PCT}% went out as pre-allocations, to be accounted
              for later. For eight months, none of it was newly reported as reconciled.
            </p>
            <Link href="/replay" className="mt-7 inline-block border-b-[1.5px] border-seal pb-0.5 text-base font-semibold text-[#f8f4ee]">
              Read the full case
            </Link>
          </div>
          <CaseChart />
        </div>
      </section>

      {/* Fits how relief runs */}
      <section className="mx-auto max-w-[1200px] px-4 pb-10 pt-24 sm:px-6 md:pt-28">
        <h2 className="max-w-[680px] text-[36px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[44px]">Fits the way relief already runs.</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {FITS.map((f) => (
            <div key={f.title}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-sunk">
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] text-ink" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={f.icon} />
                </svg>
              </span>
              <h3 className="mt-4 text-[19px] font-semibold">{f.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto flex max-w-[1200px] scroll-mt-16 flex-wrap gap-12 px-4 pb-24 pt-16 sm:px-6 md:pb-28">
        <div className="flex-[1_1_300px]">
          <h2 className="text-[36px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[44px]">Questions</h2>
          <p className="mt-3.5 max-w-xs text-[17px] leading-relaxed text-muted">What people ask first. The rest is in the repository.</p>
        </div>
        <Faq />
      </section>

      {/* Closing */}
      <section className="px-4 pb-24 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-[1152px] rounded-[28px] bg-[#1b2935] px-6 py-16 text-center text-[#f8f4ee] md:px-10 md:py-[72px]">
          <KeptMark className="mx-auto h-16 w-16" />
          <h2 className="mt-6 text-[36px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[44px]">See it work in two minutes.</h2>
          <p className="mx-auto mt-3.5 max-w-[520px] text-lg text-[#c9d1d8]">Play each role on a simulated fund. Every step is a real transaction you can check.</p>
          <Link href="/household" className="mt-8 inline-block rounded-[10px] bg-[#f8f4ee] px-6 py-[15px] text-base font-semibold text-[#1b2935] transition-opacity hover:opacity-90">
            Try the demo
          </Link>
          <p className="mt-4 text-sm text-[#8e9aa6]">No sign-up. No wallet.</p>
        </div>
      </section>
    </main>
  );
}
