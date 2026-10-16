import Link from "next/link";

const Src = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent">
    {children}
  </a>
);

const Fact = ({ figure, children }: { figure: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-line bg-card p-4">
    <p className="text-2xl font-semibold tabular-nums text-ink">{figure}</p>
    <p className="mt-1 text-sm text-muted">{children}</p>
  </div>
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
    text: "By May 2024 Hualien County had received NT$453M for that year's earthquake, under a fifth of the NT$2.7bn it received in 2018; a councillor said people “would rather give to the central government”; nearly 300 petitioned for an ordinance.",
    source: "PTS, 2024-05-17",
    href: "https://news.pts.org.tw/article/695533",
    kept: "a fund custodians can prove they kept",
  },
];

export default function Why() {
  return (
    <article className="mx-auto max-w-3xl space-y-10 pb-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Why Kept</p>
        <h1 className="text-3xl font-semibold leading-tight">
          People in Hualien did not stop giving.
          <br />
          They stopped trusting where it goes.
        </h1>
        <p className="text-muted">
          A disaster donation passes through a foundation, a ministry, a county and a township before it reaches a household. With
          every hand, the public sees less — and the people it is meant for have no say in how it is used.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">A loop that repeats across countries</h2>
        <ol className="grid gap-2 text-sm sm:grid-cols-5">
          {["Money is raised before a plan exists", "The custodian keeps every record", "Victims have no voice", "Surpluses and delays", "Trust collapses; donations go elsewhere"].map(
            (s, i) => (
              <li key={s} className="rounded-lg bg-ink/5 p-3">
                <span className="block text-xs font-semibold text-accent">{i + 1}</span>
                {s}
              </li>
            ),
          )}
        </ol>
        <div className="grid gap-3 sm:grid-cols-2">
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
            Singapore&apos;s NKF scandal led to the Commissioner of Charities (2006) and a new Code of Governance (2007). Law acts after
            the fact; code can act before.
          </Fact>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Taiwan: the same loop, for 25 years</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Fact figure="NT$420M left after a year">
            2024 Hualien earthquake: a county donation account of ~NT$790M still held ~NT$420M a year later; its committee met three
            times and had no victims on it (<Src href="https://news.pts.org.tw/article/744652">PTS, 2025</Src>).
          </Fact>
          <Fact figure="< 1/5">
            After disputes over 2018 quake donations, Hualien County had received NT$453M for the 2024 earthquake by May, through the
            relief foundation: under a fifth of the NT$2.7bn it received in 2018. People preferred giving to the central government (
            <Src href="https://news.pts.org.tw/article/695533">PTS, 2024</Src>).
          </Fact>
          <Fact figure="~4% reconciled">
            2025 Guangfu barrier lake: of NT$1.21bn paid out (incl. pre-allocations) by the relief foundation, NT$49M had been
            reconciled as of Sept 2026. Pre-allocation then reconciliation is normal emergency practice — but after the first hand the public sees only
            aggregate totals, and no household can confirm its own payment (<Src href="https://www.tf4dr.org/fundraising_plans/156/credits/534">foundation disclosure</Src>).
          </Fact>
          <Fact figure="0 votes">
            Victims sit on no board. Hualien&apos;s rules let up to five victims attend committee meetings and speak only with the
            chair&apos;s permission (<Src href="https://glrs.hl.gov.tw/glrsout/LawContent.aspx?id=GL001170">county rules</Src>).
          </Fact>
          <Fact figure="3 villages">
            Nanfu, Dajin and Daquan were left out of the county&apos;s first aid list because they lay outside the &quot;red zone&quot;;
            residents protested (<Src href="https://www.cna.com.tw/news/aloc/202510060164.aspx">CNA, 2025</Src>).
          </Fact>
          <Fact figure="Stalled since 2020">
            The Public Welfare Fundraising Act&apos;s surplus and reporting rules do not bind government accounts; reform bills have
            stalled (<Src href="https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0050138">law text</Src>).
          </Fact>
        </div>
        <p className="text-xs text-muted">
          Ongoing investigations are allegations only. We describe a pattern, not anyone&apos;s guilt.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What already exists — and what is still missing</h2>
        <p className="text-sm text-muted">
          The relief foundation publishes monthly transfer-level disclosures; the government paid households proactively in 2025;
          civic platforms such as <Src href="https://guangfu.tw">guangfu.tw</Src> coordinate recovery. Abroad, WFP&apos;s Building Blocks
          deduplicates aid across agencies and the Spanish Red Cross runs zero-knowledge eligibility credentials.
        </p>
        <p className="text-sm">
          What we did not find in any deployment we reviewed: <strong>a custody trail that follows money past the first hand</strong> until
          households confirm it, <strong>promises the custodian cannot rewrite</strong>, and{" "}
          <strong>a voice for the people the money is for</strong>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Evidence of need, in stakeholders&apos; own words</h2>
        <p className="text-sm text-muted">
          We have not yet interviewed practitioners. Every group Kept serves has, however, already described the problem in public.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {EVIDENCE.map((e) => (
            <div key={e.text} className="rounded-xl border border-line bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">{e.who}</p>
              <p className="mt-1 text-sm">{e.text}</p>
              <p className="mt-2 text-xs text-muted">
                <Src href={e.href}>{e.source}</Src> · Kept: {e.kept}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Where Kept starts: reconciliation</h2>
        <p className="text-sm text-muted">
          The relief foundation already publishes every transfer it makes. But more than NT$1.1bn of the Guangfu donations was
          pre-allocated to the ministry. From there the public sees only aggregate totals, no household can confirm its own
          payment, and reconciliation a year later covers about 4%. The foundation needs that evidence too.
        </p>
        <p className="text-sm">
          Kept gives every downstream custodian one simple tool: acknowledge what you received, publish each payment batch as
          pseudonymous lines, and let each household confirm or dispute its own line. The custodian gets reconciliation evidence it now
          assembles by hand; the public sees past the first hand; households can say &quot;this never reached me&quot;.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Kept: two promises, made verifiable</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Custody", "Every hand records and acknowledges each tranche. Payment rosters are published as pseudonymous lines, so each registered household finds its own line without asking the custodian, and confirms or disputes it."],
            ["Commitment", "Purposes, caps and the surplus purpose are fixed when money is raised and cannot be rewritten. Changes wait through a public period in which households can veto them. While donations stay in banks, this binds the public record, not the bank account."],
            ["Voice", "The same credential that lets a household receive aid gives it one anonymous vote on changes, and a public appeal when it is left out."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-line bg-card p-4">
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted">
          Deliberately off-chain: names, ID numbers, bank accounts and rosters. Eligibility is still decided by the village chief and
          township office — Kept makes their decisions attributable instead of replacing them.
        </p>
      </section>

      <p className="text-sm">
        <Link href="/" className="text-accent underline">
          See the public dashboard →
        </Link>
      </p>
    </article>
  );
}
