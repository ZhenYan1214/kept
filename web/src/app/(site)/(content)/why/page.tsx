import Link from "next/link";
import { FraudSimulation } from "@/components/fraud-sim";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/motion";

const Src = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent">
    {children}
  </a>
);

const Fact = ({ figure, children }: { figure: string; children: React.ReactNode }) => (
  <div className="border-t border-line pt-4">
    <p className="text-2xl font-semibold tracking-tight tabular-nums text-ink">{figure}</p>
    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{children}</p>
  </div>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-semibold leading-tight">{children}</h2>
);

const EVIDENCE = [
  {
    who: "Affected household",
    text: "“Only after a year did we find out nearly NT$400M of the donations was still left.”",
    source: "PTS, 2025-03-31",
    href: "https://news.pts.org.tw/article/744652",
    kept: "public commitments and progress",
  },
  {
    who: "Affected household",
    text: "A ground-floor household living alone missed aid several times because agencies used different criteria.",
    source: "SETN, 2025-12-18",
    href: "https://www.setn.com/news/1767342",
    kept: "public appeals; “verified, not yet paid” reports",
  },
  {
    who: "Indigenous representative",
    text: "Appointed to a reconstruction committee, then received “no meeting notice or call” for seven months.",
    source: "Newsmarket, 2026-09-21",
    href: "https://www.newsmarket.com.tw/blog/242854/",
    kept: "a household voice that does not depend on being invited",
  },
  {
    who: "NGO",
    text: "“With the township office's help, the household roster was finally confirmed at the end of November”; aid was handed out about ten weeks after the disaster.",
    source: "CCRA final report, 2026-01-07",
    href: "https://www.ccra.org.tw/pdf/report/0923%20%20final%20project%20report_20260107.pdf",
    kept: "eligibility checks without handing the roster to each NGO",
  },
  {
    who: "Custodian",
    text: "Pre-allocations are checked against each agency's relief roster later; a year on, NT$49M of NT$1.21bn is reconciled.",
    source: "relief foundation disclosure",
    href: "https://www.tf4dr.org/fundraising_plans/156/credits",
    kept: "published payment lines and household receipts as reconciliation evidence",
  },
  {
    who: "Donors and citizens",
    text: "In 2024 most donors gave to the national relief foundation (NT$1.65bn) rather than Hualien County (NT$792M); the press linked this to disputes over the county's 2018 donations. A councillor said people “would rather give to the central government”, and nearly 300 residents called for an ordinance.",
    source: "LTN, 2025-03-30; PTS, 2024-05-17",
    href: "https://news.ltn.com.tw/news/Hualien/breakingnews/4996579",
    kept: "a fund custodians can prove they kept",
  },
];

export default function Why() {
  return (
    <article className="mx-auto max-w-3xl space-y-16 pb-8">
      <header className="space-y-5 border-b border-line pb-10">
        <p className="text-sm text-muted">Why Kept</p>
        <h1 className="text-[32px] font-semibold leading-[1.12] md:text-[40px]">
          People in Hualien did not stop giving.
          <br />
          They stopped trusting where it goes.
        </h1>
        <p className="text-lg leading-relaxed text-muted">
          A disaster donation passes through a foundation, a ministry, a county and a township before it reaches a household. With
          every hand, the public sees less — and the people it is meant for have no say in how it is used.
        </p>
      </header>

      <section className="space-y-6">
        <H2>A loop that repeats across countries</H2>
        <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line text-sm sm:grid-cols-5">
          {["Money is raised before a plan exists", "The custodian keeps every record", "Victims have no voice", "Surpluses and delays", "Trust collapses; donations go elsewhere"].map(
            (s, i) => (
              <li key={s} className="relative bg-card p-4">
                <span className="flex items-center justify-between text-xs text-muted">
                  Step {i + 1}
                  {i < 4 ? <Icon.Arrow className="h-3.5 w-3.5" /> : <span>back to 1</span>}
                </span>
                <span className="mt-2 block text-[15px] font-medium leading-snug">{s}</span>
              </li>
            ),
          )}
        </ol>
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          <Fact figure="$488M → 6 homes">
            American Red Cross, Haiti 2010: six permanent homes built across the country (
            <Src href="https://www.propublica.org/article/how-the-red-cross-raised-half-a-billion-dollars-for-haiti-and-built-6-homes">
              ProPublica/NPR, 2015
            </Src>
            ).
          </Fact>
          <Fact figure="¥100bn+ unplanned">
            Japanese Red Cross after Tōhoku 2011: recipients &quot;cannot be identified&quot; (
            <Src href="https://www.reuters.com/article/us-japan-quake-donations-idUSTRE74A1G620110511">Reuters, 2011</Src>).
          </Fact>
          <Fact figure="€22M unbudgeted">
            Valencia DANA floods 2024: regional auditor called the recording of donations inadequate; most was allocated a year
            later (El Español, 2026).
          </Fact>
          <Fact figure="2005 → new law">
            Singapore&apos;s NKF scandal led to a full-time Commissioner of Charities (2006) and a new Code of Governance (2007). Law acts after
            the fact; code can act before.
          </Fact>
        </div>
      </section>

      <section className="space-y-6">
        <H2>Taiwan: the same loop, for 25 years</H2>
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          <Fact figure="16% paid after 11 months">
            2024 Hualien earthquake: the county received NT$792M in donations; by February 2025 it had earmarked NT$425M and paid out
            NT$124M (<Src href="https://sa.hl.gov.tw/Upload/202504020943277687541.pdf">county report</Src>). Its committee met only three or four times (reports differ) and had no victims on it (
            <Src href="https://news.pts.org.tw/article/744652">PTS, 2025</Src>).
          </Fact>
          <Fact figure="≈ 2× elsewhere">
            In 2024 donors gave NT$1.65bn to the national relief foundation and NT$792M to Hualien County, a shift the press attributed
            to disputes over the county&apos;s 2018 donations (<Src href="https://news.ltn.com.tw/news/Hualien/breakingnews/4996579">LTN, 2025</Src>).
          </Fact>
          <Fact figure="~4% reconciled">
            2025 Guangfu barrier lake: of NT$1.21bn paid out (incl. pre-allocations) by the relief foundation, NT$49M had been
            reconciled as of Sept 2026. Pre-allocation then reconciliation is normal emergency practice — but after the first hand the public sees only
            aggregate totals, and households have no public, recorded way to confirm or dispute their own payment (<Src href="https://www.tf4dr.org/fundraising_plans/156/credits/534">foundation disclosure</Src>).
          </Fact>
          <Fact figure="0 votes">
            No board reserves a seat for affected households. Hualien&apos;s rules let up to five victims attend committee meetings and speak only with the
            chair&apos;s permission (<Src href="https://glrs.hl.gov.tw/glrsout/LawContent.aspx?id=GL001170">county rules</Src>).
          </Fact>
          <Fact figure="3 villages">
            Residents of Nanfu, Dajin and Daquan protested at being left off the county&apos;s first consolation list, which followed the
            &quot;red zone&quot; (<Src href="https://www.cna.com.tw/news/aloc/202510060164.aspx">CNA, 2025</Src>).
          </Fact>
          <Fact figure="Last amended 2020">
            The Public Welfare Fundraising Act&apos;s surplus and reporting rules do not bind government accounts, and later bills that
            would cover them have not passed (<Src href="https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0050138">law text</Src>).
          </Fact>
        </div>
        <p className="text-xs text-muted">
          Ongoing investigations are allegations only. We describe a pattern, not anyone&apos;s guilt.
        </p>
      </section>

      <section className="space-y-5">
        <H2>What already exists, and what is still missing</H2>
        <p className="text-base leading-relaxed text-muted">
          The relief foundation publishes monthly transfer-level disclosures; the government paid households proactively in 2025;
          civic platforms such as <Src href="https://guangfu.tw">guangfu.tw</Src> coordinate recovery. Abroad, WFP&apos;s Building Blocks
          deduplicates aid across agencies and the Spanish Red Cross runs zero-knowledge eligibility credentials.
        </p>
        <p className="text-base leading-relaxed">
          What we did not find in any deployment we reviewed: <strong>a custody trail that follows money past the first hand</strong> until
          households confirm it, <strong>promises the custodian cannot rewrite</strong>, and{" "}
          <strong>a voice for the people the money is for</strong>.
        </p>
      </section>

      <section className="space-y-6">
        <H2>Evidence of need, in stakeholders&apos; own words</H2>
        <p className="text-base leading-relaxed text-muted">
          We have not yet interviewed practitioners. Every group Kept serves has, however, already described the problem in public.
        </p>
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {EVIDENCE.map((e) => (
            <Reveal key={e.text} className="self-start border-l-2 border-line pl-5">
              <p className="text-xs font-medium text-muted">{e.who}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{e.text}</p>
              <p className="mt-3 text-xs text-muted">
                <Src href={e.href}>{e.source}</Src> · <span className="text-ink/70">Kept: {e.kept}</span>
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <H2>Where Kept starts: reconciliation</H2>
        <p className="text-base leading-relaxed text-muted">
          The relief foundation already publishes every transfer it makes. But more than NT$1.1bn of the Guangfu donations was
          pre-allocated to the ministry. From there the public sees only aggregate totals, households have no public, recorded way to confirm their own
          payment, and reconciliation a year later covers about 4%. The foundation needs that evidence too.
        </p>
        <p className="text-base leading-relaxed">
          Kept gives every downstream custodian one simple tool: acknowledge what you received, publish each payment batch as
          pseudonymous lines, and let each household confirm or dispute its own line. The custodian gets reconciliation evidence it now
          assembles by hand; the public sees past the first hand; households can say &quot;this never reached me&quot;.
        </p>
      </section>

      <section className="space-y-6">
        <H2>Kept: two promises, made verifiable</H2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Custody", "Every hand records and acknowledges each tranche. Payment rosters are published as pseudonymous lines, so each registered household finds its own line without asking the custodian, and confirms or disputes it."],
            ["Commitment", "Purposes, caps and the surplus purpose are fixed when money is raised and cannot be rewritten. Changes wait through a public period in which households can veto them. While donations stay in banks, this binds the public record, not the bank account."],
            ["Voice", "The same credential that lets a household receive aid gives it one anonymous vote on changes, and a public appeal when it is left out."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-lg border border-line bg-card p-5">
              {t === "Custody" ? <Icon.Handoff className="h-5 w-5 text-accent" /> : t === "Commitment" ? <Icon.Seal className="h-5 w-5 text-accent" /> : <Icon.Ballot className="h-5 w-5 text-accent" />}
              <p className="mt-3 text-xl">{t}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
        <p className="text-base leading-relaxed text-muted">
          Deliberately off-chain: names, ID numbers and bank accounts; payment rosters appear only as pseudonymous lines. Eligibility
          is still decided by the village chief and township office — Kept makes their decisions attributable instead of replacing
          them.
        </p>
      </section>

      <FraudSimulation />

      <p className="text-base leading-relaxed">
        <Link href="/dashboard" className="text-accent underline">
          See the public dashboard →
        </Link>
      </p>
    </article>
  );
}
