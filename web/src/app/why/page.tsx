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
            After disputes over 2018 quake donations, the relief foundation&apos;s 2024 allocation to Hualien was under a fifth of the
            2018 one; people preferred giving to the central government (
            <Src href="https://news.pts.org.tw/article/695533">PTS, 2024</Src>).
          </Fact>
          <Fact figure="~4% verified">
            2025 Guangfu barrier lake: of NT$1.21bn paid out (incl. pre-allocations) by the relief foundation, NT$49M had been
            reconciled as of Sept 2026. Pre-allocation then reconciliation is normal emergency practice — but what happens after the
            first hand is invisible to the public (<Src href="https://www.tf4dr.org/fundraising_plans/156/credits">foundation disclosure</Src>).
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
          What we could not find anywhere: <strong>a fund whose promises are enforced by code</strong>,{" "}
          <strong>a custody trail that follows money past the first hand</strong>, and{" "}
          <strong>a vote for the people the money is for</strong>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Kept: two promises, made verifiable</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Commitment", "Purposes, caps and the surplus purpose are fixed when money is raised. Purposes outside the charter cannot be funded. Changes wait through a public period in which households can veto them."],
            ["Custody", "Every hand records and acknowledges each tranche. Payment rosters are committed as Merkle roots: each registered household can prove it is counted and confirm or dispute its own line."],
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
