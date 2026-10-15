# Web3 Public Goods Funding & Community/Civic Governance (公共財資助與社群治理) — research notes as of Oct 2026

Context: background research for the "Web3 for Social Good Hackathon 2026" (SMU / GSR Foundation / University of Málaga). Dates are given for every item. Where secondary sources conflict, both are noted.

---

## Q1. Funding mechanisms: Gitcoin, QF, MACI, RetroPGF, Octant, Protocol Guild, Drips, Hypercerts, Deep Funding, Allo, Artizen, Giveth

### Takeaway
The flagship programs all shrank or changed shape in 2025–2026. Gitcoin shut down its Grants Stack software and runs a smaller "Gitcoin 3.0" model that uses several mechanisms at once. Optimism paused Retro Funding for at least 12 months from January 2026. The newer approaches are yield-based endowments (Octant v2, Protocol Guild vesting), AI-assisted allocation (Deep Funding), and impact records (Hypercerts on ATProto).

### Cited Findings

**Gitcoin: history and scale**
- Quadratic funding (QF) comes from Buterin, Hitzig & Weyl, "A Flexible Design for Funding Public Goods" (2018). Matching is based on the square of the sum of the square roots of contributions, so many small donors attract more matching than a few large ones — [arXiv 1809.06421](https://arxiv.org/abs/1809.06421)
- Gitcoin's lifetime total: "since its launch in 2019, Gitcoin Grants has distributed over $67M to 6,700+ projects" (stated in the GG23 announcement, early 2025) — [Gitcoin blog: Announcing GG23](https://www.gitcoin.co/blog/announcing-gitcoin-grants-round-23-gg23)
- GG23 (April 2025), QF track: $600K matching pool, $95,278.16 in community donations, 9,991 unique donors, 235 open-source projects. A separate retro track split $600K across 30 curated projects. Each got at least $10K; the remaining $300K followed badgeholder votes, with a top allocation of $39,895. More than $1.3M was distributed in total — [GG23 Results & Recap](https://www.gitcoin.co/blog/gg23-results-recap); [GG23 retro blog](https://gitcoin.co/blog/gitcoin-grants-23-retro)
- GG23 also ran an "AI ImpactQF" track and a "Predictive Funding Challenge", where AI models predicted allocations — [GG23 AI ImpactQF retrospective](https://gitcoin.co/case-studies/gg23-ai-impactqf-regen-coordination-retrospective); [GG23 Predictive Funding Challenge Retrospective](https://gitcoin.co/case-studies/gg23-predictive-funding-challenge-retrospective)

**Gitcoin: Grants Stack sunset (2025)**
- The wind-down was announced on 25 April 2025. Grants Stack was no longer maintained after 31 May 2025. The Grants Labs unit's expenses "have been exceeding its revenue for some time." Gitcoin as a whole reportedly earned about $1M/yr against about $3M/yr in spending, during a bear market. Explorer, Builder and Manager stopped working because they relied on the indexer that was shut down. Open Source Observer offers a data portal as an alternative. Allo.Capital was spun out and is described as "thriving independently". Passport was spun out to human.tech. The Grants Program continues — [Gitcoin governance forum: Sunsetting Grants Stack](https://gov.gitcoin.co/t/focusing-gitcoins-future-sunsetting-grants-stack-eol-may-2025/20333); [Gitcoin on X](https://x.com/gitcoin/status/1915778356815016277); [CryptoNinjas](https://www.cryptoninjas.net/news/gitcoin-to-sunset-grants-stack-and-grants-lab-by-may-2025-to-refocus-on-core-mission/)

**Gitcoin 3.0 / GG24 (Oct–Nov 2025)**
- GG24 was the first round under "Gitcoin 3.0" and used a "Dedicated Domain Allocation" model, in which community operators design and run the round for each domain. It distributed more than $1.8M: $1.175M from Gitcoin and about $632.5K from external co-funders such as CeloPG, Ethereum Foundation and GoodDollar. The QF window ran 14–28 Oct 2025 — [GG24 case study](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0); [GG24 campaign page](https://gitcoin.co/campaigns/gitcoin-grants-24-gg24)
- The six domains and their mechanisms: Dev Tooling (QF on Giveth, $200K, Arbitrum); Interop (QF on Giveth, $100K, Celo); Privacy (MACI private voting); Public Goods R&D (peer-reviewed hypercerts plus direct grants); Solutions Development (milestone grants); Targeted Development & Adoption (conviction voting plus retro rewards). Deep Funding was also used — [GG24 case study](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0)
- GG24 QF participation: 78 projects, about 1,300 unique donors and $36,657 in direct donations, against GG23's $95,278 across 235 projects. Gitcoin's own retrospectives give 64 curated projects and 1,286 donors instead — [Giveth GIVnews](https://news.giveth.io/givnews46); [GG24 OSS QF on Giveth retrospective](https://gitcoin.co/case-studies/gg24-oss-qf-giveth-retrospective)
- Lessons Gitcoin reported: running five or more mechanisms in one cycle was feasible and gave a richer signal. The hard parts were coordinating independent operators, combining results across mechanisms, and onboarding donors to conviction voting and MACI. Gitcoin suggests a unified donor interface that hides how each mechanism works — [GG24 case study](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0)
- The Interop retrospective found that QF "reliably surfaced mid-stage, user-facing tools but underperformed for standards… invisible coordination layers." It recommends using QF to discover projects rather than as the only way to allocate funds — [GG24 Interop retrospective](https://gitcoin.co/case-studies/gg24-interop-round-retrospective)
- Gitcoin put $1M of treasury into an Octant v2 yield vault, and Octant matched it with another $1M. Gitcoin projected about $32K per quarter at roughly 4.5% APY; this is a projection, not a reported outcome — [Gitcoin case study: sustainable funding model](https://gitcoin.co/case-studies/from-one-off-rounds-to-ongoing-impact-gitcoin-s-new-sustainable-funding-model)

**Sybil resistance: Passport becomes Human Passport**
- Holonym Foundation acquired Gitcoin Passport for a reported $10M, and Passport was renamed "Human Passport" (reported in Feb 2025) — [Biometric Update](https://www.biometricupdate.com/202502/holonym-acquires-gitcoin-passport-in-proof-of-personhood-expansion); [ID Tech](https://idtechwire.com/holonym-foundation-acquires-gitcoin-passport-in-10m-deal-to-create-proof-of-humanity-network/); [Human Passport blog](https://passport.human.tech/blog/from-gitcoin-passport-to-human-passport-we-re-now-part-of-human-tech)
- In GG23, Human Passport used machine-learning "model-based detection" on onchain history to flag sybil wallets. This is the vendor's own claim — [human.tech blog](https://human.tech/blog/human-passport-x-gitcoin-grants-defending-gg23-with-model-based-sybil-detection)
- A Gitcoin research page cites a roughly 60% reduction in flagged addresses from 2024 sybil defenses but gives no methodology. Treat it as low confidence — [Gitcoin research: QF sybil resistance](https://gitcoin.co/research/quadratic-funding-sybil-resistance)

**Giveth QF**
- Giveth took over QF operations for GG24's open-source domains. The combined $300K was its largest-ever matching pool and its first time running several QF rounds at once — [Gitcoin campaign page](https://gitcoin.co/campaigns/gitcoin-grants-24-gg24); [Giveth forum: GG24 QF rounds](https://forum.giveth.io/t/gg24-qf-rounds-october-14-28-2025/2128)

**MACI / aMACI (Dora Factory / DoraHacks)**
- MACI (PSE / Ethereum Foundation) encrypts votes onchain so that voters cannot prove how they voted, which makes bribery hard to enforce. The v2.x docs are no longer maintained in favour of v3.x. The roadmap targeted MACI v3.0 for 2025 with custom voice credits and per-poll gatekeeping. The separate "MACI Platform" project page on pse.dev is marked as sunset — [maci.pse.dev](https://maci.pse.dev/); [MACI roadmap](https://maci.pse.dev/roadmap); [PSE MACI Platform](https://pse.dev/projects/maci-platform)
- Dora Factory runs MACI and aMACI rounds on its Dora Vota appchain. aMACI, launched in 2024, adds anonymity so that the round operator cannot see votes or collude with the organizer — [DoraFactory/doravota GitHub](https://github.com/DoraFactory/doravota); [dorafactory.org](https://dorafactory.org/)
- ATOM Economic Zone QF (2024) was funded by Cosmos Hub Proposal 917. It had 80,000 ATOM plus $200K USDC over 10 rounds of QF and MACI voting. About 1.04M ATOM-staker addresses were airdropped DORA and became eligible, described as "the largest MACI voting round ever." Voice credits scaled with ATOM staked, which raises plutocracy concerns. Gas was sponsored through a gas station — [The Daily Hodl (Jun 2024)](https://dailyhodl.com/2024/06/06/dora-factory-announces-historic-dora-airdrop-to-over-one-million-atom-stakers-in-largest-maci-voting-round-ever/); [Yahoo Finance: Cosmos Hub $1M grant](https://finance.yahoo.com/news/cosmos-hub-approves-1-million-114500584.html)
- Dora Factory says it is preparing "World MACI", a scalable, privacy-preserving, decentralized polling platform with a whitelist — [dorafactory.org](https://dorafactory.org/)
- Vitalik has said "Interfold" brings MACI-style private voting closer to Ethereum (2026 news) — [CryptoAdventure](https://cryptoadventure.com/vitalik-says-interfold-brings-maci-style-private-voting-closer-to-ethereum/)

**clr.fund**
- clr.fund is a MACI-based QF project. Its blog shows Round 9 with a matching pool of about $50K. It also disclosed that its QF implementation had computed allocations differently from the original CLR paper, and that the bug was later fixed. Current activity is unclear, and the last confirmed activity is from 2024 — [blog.clr.fund](https://blog.clr.fund/); [clr.fund X (Jan 2024)](https://x.com/clrfund/status/1747709959058665504)

**Optimism Retro Funding (RetroPGF)**
- In 2024, Retro Funding rewarded more than 400 builders with 20M OP across 3 rounds. Season 7 (2025) allocated 16M OP and moved to "Missions" (Dev Tooling, Onchain Builders). In these missions badgeholders voted on evaluation algorithms rather than individual projects. The winning algorithm, "Arcturus", weights widely adopted tools with many downstream dependents — [Optimism: Retro Funding 2025](https://optimism.io/blog/retro-funding-2025); [Optimism X](https://x.com/Optimism/status/1893052061484491160); [OSO: S7 algorithms](https://docs.oso.xyz/blog/retro-funding-s7-release/)
- Optimism's own retrospective of 2023–24 found that mega rounds "devolve into popularity contests", annual feedback is too slow, and it had no data showing that retro funding produces better outcomes. The builder wevm said funding was too infrequent and unpredictable to rely on — [Optimism gov forum: Lessons from two years of RetroPGF](https://gov.optimism.io/t/lessons-learned-from-two-years-of-retroactive-public-goods-funding/9239); [Evolution of Retro Funding in 2025](https://gov.optimism.io/t/the-evolution-of-retro-funding-in-2025/9414)
- On 8 Jan 2026, Optimism said Retro Funding "will not run for at least the next 12 months" as it refocuses on the OP Stack and enterprise adoption. About 775M OP is reserved for Retro Funding, and the Foundation said it may propose reallocating all or part of it — [Optimism blog: Season 9](https://optimism.io/blog/season-9-from-experiment-to-organization)
- A secondary report says cumulative Retro commitments total 81.4M OP, about 9.5% of the 859M OP allocation. It also says a vote closing 19 Aug 2026 (about 62% approval) redirected 546.9M OP from the user airdrop reserve, not the Retro reserve, into a "Strategic Ecosystem Fund". These figures are not verified against the primary forum — [CryptoTimes (Aug 2026)](https://www.cryptotimes.io/2026/08/06/optimism-cuts-op-spending-35-in-year-4-pivots-to-enterprise/); [Cryptonomist (Aug 2026)](https://en.cryptonomist.ch/2026/08/21/optimism-token-reallocation-foundation/)

**Deep Funding (Vitalik, 2024–2025)**
- Deep Funding rests on two ideas. First, value is treated as a graph: the question is "how much of the credit for Y belongs to X?" Second, it uses "distilled human judgement": an open market of AI models fills in the weights and a human jury spot-checks randomly sampled edges — [Vitalik on X (Dec 2024)](https://x.com/VitalikButerin/status/1867886974058520820)
- The first round had a $250K sponsorship from Vitalik: $170K to projects by graph weight, $40K for the best model and $40K for open-source models. The graph was the Ethereum dependency graph with about 40,000 edges — [Gitcoin: Deep Funding mechanism](https://gitcoin.co/mechanisms/deep-funding); [Deep Funding visual guide](https://gitcoin.co/research/deep-funding-visual-guide)
- Model submissions continued through 2025, and a GG24 Deep Funding track used smaller graphs of about 83–98 repos — [Ethereum Magicians: model submissions](https://ethereum-magicians.org/t/model-submissions-for-ethereum-deep-funding/24200); [Gitcoin gov: GG24 Deep Funding](https://gov.gitcoin.co/t/model-submissions-gg24-deep-funding/25151?page=2)
- Vitalik acknowledged two risks: it becomes a contest to match the jury, and developers may change how they declare dependencies to game the graph — [Gitcoin: Deep Funding](https://gitcoin.co/mechanisms/deep-funding)

**Octant (Golem Foundation)**
- Octant launched in 2023 and funds public goods from staking yield on the Golem Foundation's ETH. Epoch 1 had a reward pool of 330.25 ETH, of which about 250 ETH went to 19 projects including Protocol Guild, Hypercerts, Drips, Tor and Giveth. In Epoch 2, Protocol Guild received 36.55 ETH, Drips 21.38 ETH and Hypercerts 16.38 ETH — [Octant: Epoch 2 results](https://octant.substack.com/p/celebrating-our-epoch-2-results); [Octant year in review](https://blog.octant.build/our-year-in-review-octant/)
- Cumulative figures conflict: "$7M+ to 350+ projects" versus "$12M+". Neither is verified — [Gitcoin app listing: Octant](https://gitcoin.co/apps/octant)
- Octant v2 (2025) uses ERC-4626 vaults on Yearn v3 architecture. Depositors keep their principal and the yield goes to funding rounds, an endowment-style model — [Octant v2 docs](https://docs.octant.app/); [Octant v2 Substack](https://octant.substack.com/p/octant-v2-degens-dragons-and-ethereum-alignment)
- Octant's framing in Aug 2025: "When $1.2 Billion in Grants Still Can't Keep Projects Alive" — [Octant on X](https://x.com/OctantApp/status/1953529351959429512)

**Protocol Guild**
- Protocol Guild funds about 177+ Ethereum L1 core contributors through a vesting split contract (0xSplits) — [Splits help](https://splits.org/help/protocol-guild/); [TechFlow](https://www.techflowpost.com/en-US/article/18681)
- It had disbursed more than $20M to developers, with $33.5M more vesting over 4 years. Donation totals are reported variously as over $76M (Dune) and over $100M (2025 figures). ether.fi and Taiko made up 66% of the Dune total, and LayerZero's "proof-of-donation" claim mechanism raised up to $18.5M — [The Defiant](https://thedefiant.io/news/blockchains/protocol-guild-has-distributed-usd20m-to-support-ethereum-development); [The Block](https://www.theblock.co/post/301043/layerzero-proof-of-donation-zro-claiming-mechanism)
- Protocol Guild has warned of a talent drain because core developers are paid less than in the wider industry — [Phemex News](https://phemex.com/news/article/protocol-guild-warns-of-talent-drain-amid-developer-pay-disparity-70239)

**Hypercerts**
- Hypercerts launched on Optimism in early 2023 as tokenized impact certificates. In 2025 the Foundation made "a directional shift" and rebuilt hypercerts on ATProto, the protocol behind Bluesky. Hypercerts are now framed as portable records of contributions for "value recognition networks". The original repo is archived — [Hypercerts blog: 2025→2026](https://hypercerts.org/blog/3mb6z2bku2c2z); [Why we are building hypercerts](https://hypercerts.leaflet.pub/3m6mnb2riz22o); [GitHub](https://github.com/hypercerts-org/hypercerts)
- GG24's Public Goods R&D domain used peer-reviewed hypercerts — [GG24 case study](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0)

**Artizen**
- Artizen is match-fund crowdfunding for art, science and technology: buying a project's "Artifact" NFTs unlocks matching from curated funds. Gitcoin's listing says it has raised $2.2M and awarded over $750K (date unclear). Artizen charges a 10% endowment fee. Example: the Metacrisis Fund has a $127K pot that can unlock up to $500K in match (2026) — [Gitcoin listing: Artizen](https://gitcoin.co/apps/artizen-fund); [Artizen Playbook](https://play.artizen.fund/); [Metacrisis Fund on Artizen](https://paragraph.com/@metacrisisxyz/metacrisis-fund-for-positive-sum-interventions-on-artizen)

### Inferences
- The field has moved from running one QF round to combining several mechanisms. A hackathon project that composes mechanisms (QF for discovery, MACI for privacy, hypercerts for impact records, AI for evaluation) behind a single simple donor UX addresses a gap Gitcoin named itself in 2025.
- Funding volume in crypto public-goods funding fell sharply from 2023 to 2026: GG23 QF donations were about $95K, GG24 about $37K, and Optimism Retro Funding is paused. Endowment and yield models (Octant v2, Gitcoin's $2M vault) and in-protocol donations (Protocol Guild, LayerZero) look like the most durable trend.
- Dora Factory and DoraHacks have practical MACI/aMACI infrastructure, probably DoraHacks being the hackathon's submission platform. That makes privacy-preserving QV/QF rounds a low-friction technical choice for this event.

### Gaps
- No official winners list or payout table for Deep Funding's first round was found, and no evaluation of whether AI-assigned weights beat human allocation.
- There is no confirmed post-2025 lifetime total for Gitcoin (the "$67M+" figure dates from early 2025).
- No primary source was found on whether the ~775M OP Retro reserve was reallocated by Oct 2026.
- MACI v3 release status and current Dora Vota round activity in 2026 are unverified.
- Drips: no 2025–26 volume figures were found, beyond its receipts as an Octant grantee.

---

## Q2. DAOs and tools for community/civic use: CityDAO, cooperatives, vTaiwan/Join/Polis, Colorado QV, Plurality, RadicalxChange

### Takeaway
Real civic uses of quadratic voting and deliberation tools exist: Taiwan's Join hackathon votes and vTaiwan/Polis, and the Colorado House. Most of them are off-chain and run by government. The best-known on-chain civic DAO, CityDAO, wound down in 2024 because of governance friction, zoning law and securities-law constraints. Colorado's anonymous QV was ruled to violate open-meetings law.

### Cited Findings
- **CityDAO:** In 2021 it raised more than $8M from more than 5,000 members and bought 40 acres near Clark, Wyoming, for about $100K. In May 2024 members voted 92.64% to wind down, and about $3.076M was returned to 4,808 addresses — [Belfer Center](https://www.belfercenter.org/publication/deep-dive-citydao-experiment-collective-land-ownership-and-decentralized-governance); [DAO Times timeline](https://daotimes.com/the-story-of-citydao-explain-through-timeline/); [MIDAO blog](https://www.midao.org/blog-posts/the-rise-and-fall-of-citydao-lessons-in-dao-lifecycle-management); [Wyoming Public Media (2021)](https://www.wyomingpublicmedia.org/business/2021-11-12/blockchain-company-citydao-buys-40-acres-in-park-county)
- **CityDAO lessons:**
  - Every decision needed a quorum of 500 voters, which produced a "vetocracy".
  - Zoning limited each 40-acre lot to one single-family dwelling.
  - Legal ownership had to be separated from governance tokens to avoid securities issues.
  - There was no plan for the DAO's lifecycle.
  - Token voting led to the "DAO plutocracy problem".
  - Sources: [MIDAO](https://www.midao.org/blog-posts/the-rise-and-fall-of-citydao-lessons-in-dao-lifecycle-management); [Belfer Center](https://www.belfercenter.org/publication/deep-dive-citydao-experiment-collective-land-ownership-and-decentralized-governance); [SSRN, Rong & Mao](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5287462)
- **Colorado QV:**
  - In 2019 the Colorado House Democratic caucus used QV to rank 107 bills. Each member got 100 tokens; 10 votes cost 100 tokens.
  - In 2021, members from both chambers used RadicalxChange's "RxC QV" app.
  - A Denver judge ruled in Jan 2024 that the anonymous QV process was a "meeting" and violated Colorado's open-meetings law.
  - Critics noted that leadership still decided much of the final funding.
  - Sources: [RadicalxChange wiki: Colorado QV](https://www.radicalxchange.org/wiki/colorado-qv/); [Colorado Sun (2019)](https://coloradosun.com/2019/05/28/quadratic-voting-colorado-house-budget/); [CPR News (Jan 2024)](https://www.cpr.org/2024/01/05/democrats-secret-voting-system-colorado-legislature/); [Colorado FOIC](https://coloradofoic.org/lawmakers-use-of-anonymous-quadratic-voting-system-violates-colorados-open-meetings-law-judge-rules/)
- **Taiwan:**
  - vTaiwan started in 2015 and is built on Polis. Its first case was regulating Uber (Aug 2015).
  - Polis lets people vote on others' statements but not reply to them, which reduces trolling.
  - Criticism: the government is not required to adopt vTaiwan's outcomes.
  - The Presidential Hackathon uses public QV on the Join platform to pick five funded proposals each year.
  - Audrey Tang said (2020) that QF and participatory budgeting had not yet been implemented.
  - Sources: [Computational Democracy Project: vTaiwan](https://compdemocracy.org/case-studies/2014-vtaiwan/); [MIT Tech Review (2018)](https://www.technologyreview.com/2018/08/21/240284/the-simple-but-ingenious-system-taiwan-uses-to-crowdsource-its-laws/); [Democracy Technologies](https://democracy-technologies.org/participation/consensus-building-in-taiwan/); [HBR podcast with Audrey Tang (Oct 2020)](https://hbr.org/podcast/2020/10/how-taiwan-is-using-technology-to-foster-democracy-with-digital-minister-audrey-tang)
- **Taiwan participatory budgeting (參與式預算):**
  - Taipei launched i-Voting in 2015.
  - New Taipei's Sanxia District runs participatory budgeting with both online and paper voting.
  - All of this uses conventional voting, not QV or blockchain.
  - Sources: [Participedia: Sanxia](https://participedia.net/case/12028); [Tandfonline: Taipei PB](https://www.tandfonline.com/doi/full/10.1080/17516234.2021.1998947)
- **Plurality and RadicalxChange:**
  - *Plurality* (Weyl & Tang) was written openly on GitHub, released under CC0 and translated into more than a dozen languages — [plurality.net](https://plurality.net/)
  - Audrey Tang's 2025–26 work on the "6-Pack of Care" sets out six principles for civic AI and frames deployment as a "bounded local steward". She also cites Alignment Assemblies, for example on deepfake scam ads — [Oxford podcast (Oct 2025)](https://staged.podcasts.ox.ac.uk/people/audrey-tang); [Oxford seminar (May 2026)](https://events.ox.ac.uk/oxford_event/181e917f-6352-f111-bec7-6045bd12f634)
  - Weyl is linked to the Plurality Institute, RadicalxChange and Microsoft's Plural Technology Collaboratory — [plurality.net About the Authors](https://www.plurality.net/v/chapters/0-1/eng/?mode=dark)
- A 2025 arXiv study, "Fair Decisions through Plurality", interviewed Gitcoin participants. Some framed large donor counts as a sybil and fraud concern — [arXiv 2509.18343](https://arxiv.org/abs/2509.18343)

### Inferences
- Local-government QV and QF has mostly happened off-chain. The one legislative QV use (Colorado) ran into transparency law, so a civic tool needs public auditability (verifiable tallies) and voter privacy together. MACI-style receipt-freeness with public verification fits that need.
- CityDAO's failure modes (quorum fatigue, zoning, securities law, no exit plan) are a useful checklist for any "community DAO" hackathon idea. Wrapping a legal entity such as a cooperative or a Wyoming DAO LLC around the DAO, and delegating or sampling votes instead of requiring mass quorum, are known mitigations.

### Gaps
- No 2024–2026 government participatory-budgeting pilot using QV/QF on blockchain was found. Searches covered Taiwan's MODA; there was no confident evidence for Singapore or Spain/Málaga either.
- On-chain cooperatives (for example, platform co-ops on DAO tooling) were not researched in depth because of the budget for this note.
- It is not confirmed whether the Colorado 2024 ruling was appealed.

---

## Q3. Evidence: what worked, what failed (sybils, collusion, apathy, plutocracy, concentration)

### Takeaway
QF works for finding and funding grassroots projects and for mobilising many small donors (about 10K donors in GG23). It is vulnerable to sybil attacks and collusion, which need identity layers (Passport, MACI). Badgeholder-based retro funding tends toward popularity contests and is hard to evaluate. Token-weighted governance can be heavily amplified by sybils.

### Cited Findings
- Pasquini's empirical analysis of Gitcoin data found "a significant amount of reciprocal backing" (mutual donation), consistent with strategic or collusive behaviour — [arXiv 2010.01193](https://arxiv.org/pdf/2010.01193)
- Yu, Bennett, Gao & Joseph (May 2025) gave formal proofs of vulnerabilities in the quadratic, mean and median voting that Optimism RetroPGF has used, validated them with simulations, and made design recommendations. Two colluding voters can raise their effective power by a factor of √2 under quadratic schemes — [arXiv 2505.16068](https://arxiv.org/abs/2505.16068)
- "Concave is the New Linear" (2026) replayed proposals from five DAOs. It found sybil amplification of 1,172× to 4,039× under quadratic voting, and more than 229,000× under steeper power rules. It argues anti-plutocratic DAO governance is impossible without identity — [arXiv 2605.18990](https://arxiv.org/html/2605.18990v1)
- BlockScience: QF "is sensitive to sybil attacks and collusion strategies". It argues for computer-aided governance, meaning algorithmic flagging plus human review — [BlockScience blog](https://blog.block.science/towards-computer-aided-governance-of-gitcoin-grants/)
- Optimism's own retrospective: popularity contests, slow feedback, and no evidence that retro funding outperforms other approaches — [Optimism gov forum](https://gov.optimism.io/t/lessons-learned-from-two-years-of-retroactive-public-goods-funding/9239)
- Plutocracy example: in the AEZ MACI round, voice credits scaled with ATOM staked — [The Daily Hodl](https://dailyhodl.com/2024/06/06/dora-factory-announces-historic-dora-airdrop-to-over-one-million-atom-stakers-in-largest-maci-voting-round-ever/)
- Apathy and quorum: CityDAO's 500-voter quorum caused "vetocracy" — [MIDAO](https://www.midao.org/blog-posts/the-rise-and-fall-of-citydao-lessons-in-dao-lifecycle-management)
- Declining participation: GG24 QF donations ($36,657) and project count (78) were down from GG23 ($95,278; 235). The Dev Tooling retrospective linked falling donor numbers to "current public goods funding sentiments" — [Giveth GIVnews](https://news.giveth.io/givnews46); [GG24 Giveth retrospective (forum)](https://gov.gitcoin.co/t/gg24-oss-qf-on-giveth-retrospective/24890)
- What worked:
  - In GG24, MACI reportedly prevented vote-buying in the Privacy round.
  - The Interop operator saw strong alignment between community signal and expert evaluation.
  - Community operators with no prior experience ran credible rounds.
  - Sources: [GG24 case study](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0)
- An independent, non-peer-reviewed audit of capital efficiency and sybil resilience across GG24 and Octant v2 epochs is posted as a GitHub issue — [gitcoinco/gitcoin_co_30 #504](https://github.com/gitcoinco/gitcoin_co_30/issues/504)

### Inferences
- The binding constraint is no longer the mechanism math but identity, evaluation and demand. Proof-of-personhood that non-crypto users can obtain cheaply and privately is still the bottleneck for applying QV/QF to civic use.

### Gaps
- No peer-reviewed, cross-round measurement of the share of Gitcoin matching captured by sybil or collusive activity was found.
- No rigorous causal study was found showing that funded projects had more impact than unfunded ones.

---

## Q4. 2025–2026 news: Gitcoin changes, Optimism evolution, AI-assisted allocation, impact evaluation

### Takeaway
In 2025–26, Gitcoin shut down Grants Stack and moved to multi-mechanism domains, Optimism moved from voting on projects to voting on metrics algorithms and then paused Retro Funding, and AI-assisted allocation (Deep Funding, GG23 predictive and AI ImpactQF tracks) became mainstream experiments. Impact evaluation is shifting to data pipelines such as Open Source Observer and dependency graphs.

### Cited Findings
- Gitcoin timeline: Grants Stack end-of-life in May 2025 → GG24 under Gitcoin 3.0 in Oct 2025 → $2M Octant v2 vault — [Gitcoin forum](https://gov.gitcoin.co/t/focusing-gitcoins-future-sunsetting-grants-stack-eol-may-2025/20333); [GG24 case study](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0); [Gitcoin sustainable funding case](https://gitcoin.co/case-studies/from-one-off-rounds-to-ongoing-impact-gitcoin-s-new-sustainable-funding-model)
- Optimism timeline: Season 7 metrics-based missions (16M OP) in 2025 → pause announced 8 Jan 2026 for at least 12 months → Aug 2026 reports of a 35% spending cut and a pivot toward enterprise — [Optimism Retro Funding 2025](https://optimism.io/blog/retro-funding-2025); [Optimism Season 9](https://optimism.io/blog/season-9-from-experiment-to-organization); [CryptoTimes](https://www.cryptotimes.io/2026/08/06/optimism-cuts-op-spending-35-in-year-4-pivots-to-enterprise/)
- Open Source Observer (OSO) supplied the impact metrics for Optimism's S7 algorithms and now hosts Gitcoin's historical grants data — [OSO blog](https://docs.oso.xyz/blog/retro-funding-s7-release/); [Gitcoin forum](https://gov.gitcoin.co/t/focusing-gitcoins-future-sunsetting-grants-stack-eol-may-2025/20333)
- AI-assisted allocation:
  - Deep Funding: AI models plus a human jury, run for Ethereum and for GG24.
  - GG23 AI ImpactQF and the Predictive Funding Challenge.
  - Sources: [Gitcoin Deep Funding](https://gitcoin.co/mechanisms/deep-funding); [GG23 Predictive Funding retrospective](https://gitcoin.co/case-studies/gg23-predictive-funding-challenge-retrospective)
- Hypercerts moved to ATProto in 2025 so that impact records can travel across social and open-web platforms — [Hypercerts blog](https://hypercerts.org/blog/3mb6z2bku2c2z)

### Inferences
- Combining AI evaluation with a human jury or community (Deep Funding pattern) and verifiable impact records (hypercerts) is the most current frontier. A hackathon prototype that applies this to non-crypto social-good projects such as NGOs, local communities or climate work would be novel and timely.

### Gaps
- No published evidence was found that AI allocators beat human allocators, or that they resist gaming.

---

## Q5. Unsolved gaps: impact measurement, sustainability, non-crypto-native participation, privacy voting, local government adoption

### Takeaway
Five problems remain open: measuring impact outside software dependency graphs, funding that lasts beyond one-off grants, onboarding non-crypto users with identity checks, privacy-preserving yet auditable voting, and adoption by local governments (legal transparency rules, Colorado).

### Cited Findings
- Impact measurement: Optimism had no data showing that retro funding produces better outcomes. QF "underperformed for standards… invisible coordination layers" — [Optimism forum](https://gov.optimism.io/t/lessons-learned-from-two-years-of-retroactive-public-goods-funding/9239); [GG24 Interop retrospective](https://gitcoin.co/case-studies/gg24-interop-round-retrospective)
- Sustainability: Gitcoin spent about $3M/yr against about $1M/yr of revenue; Retro Funding was paused; builders called retro funding unpredictable. Octant's slogan was "$1.2B in grants still can't keep projects alive" — [Gitcoin forum](https://gov.gitcoin.co/t/focusing-gitcoins-future-sunsetting-grants-stack-eol-may-2025/20333); [Optimism Season 9](https://optimism.io/blog/season-9-from-experiment-to-organization); [Octant X](https://x.com/OctantApp/status/1953529351959429512)
- Non-crypto-native participation: GG24 had difficulty onboarding donors unfamiliar with conviction voting or MACI and recommended a unified donor interface — [GG24 case study](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0)
- Privacy versus transparency: MACI and aMACI provide encrypted, collusion-resistant voting — [maci.pse.dev](https://maci.pse.dev/); [Dora Factory](https://dorafactory.org/). Colorado's anonymous QV was ruled to violate open-meetings law — [CPR News](https://www.cpr.org/2024/01/05/democrats-secret-voting-system-colorado-legislature/)
- Government adoption: vTaiwan outcomes are not binding — [Democracy Technologies](https://democracy-technologies.org/participation/consensus-building-in-taiwan/). Taiwan participatory budgeting uses conventional i-Voting and paper voting — [Participedia](https://participedia.net/case/12028)

### Inferences (hackathon idea seeds)
- Some hackathon ideas follow from these gaps:
  - **"Civic QF kit"**: privacy-preserving QV/QF (aMACI) for a university, NGO or neighbourhood participatory-budgeting pilot. It would combine low-friction personhood (student or resident credentials), a simple donor UX hiding the mechanism, and public verifiable tallies to satisfy transparency norms.
  - **Impact-record layer**: hypercert-style records for social-good projects, with AI-assisted evaluation and human spot-checks (Deep Funding pattern) to cut evaluation cost for small grantmakers.
  - **Endowment-style matching pool**: Octant v2-style yield vaults for a community fund, so matching does not depend on one-off sponsors.

### Gaps
- No primary 2026 data was found on local governments (Singapore, Spain, Taiwan) adopting on-chain PB/QF.
- There is no consensus metric for "social impact" outside open-source dependency data.
