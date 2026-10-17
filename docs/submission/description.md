# Kept — submission text (draft)

> Draft for the DoraHacks "Submit Build" form. Paste each section into the matching field.
> Placeholders in [brackets] must be filled before submitting. Currency: NT$32 ≈ US$1 (approximate, for readers outside Taiwan).

---

## Name

Kept

## Tagline (one line)

Disaster-relief promises you can verify: past the first hand, with a voice for the people the money is for.

## Short description (about 280 characters)

After the first hand, disaster donations vanish into aggregate totals. Kept has every custodian publish payments as pseudonymous lines that verified households confirm or dispute, plus a random sample drawn on-chain that an independent auditor visits in person.

## Links

- Demo: https://kept-lilac.vercel.app
- Video: [https://… (YouTube, unlisted is fine)]
- Code: https://github.com/ZhenYan1214/kept
- Contracts on Base Sepolia (chain 84532): KeptFactory `0xD2f8E97EB8cDde0d4446b3464f36Cf01F54A13C0`, CustodyLedger `0x36e9859d90E06A084AF602282985c7b568e18072`, EligibilityRegistry `0xB784Cbe3d5Db9288baa6Ffc5F2cc909A1E2aC016`, VoiceModule `0x6ceFbf6C843A217B077e518f1808f1bb3e97ADBB`, AidPrograms `0xFf7D18bB5E7702DA924Daa07D56Fe15B6A9117be` (Semaphore v4 `0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D`)

## Track

Tech Track. Solo builder: [name, one line about you].

---

## Description (long, markdown)

### The problem: trust stops at the first hand

A disaster fund makes two promises: to donors, about how the money will be used; to affected households, that no one will be left out. Both are hard to check, and the same loop repeats across countries: money is raised before a plan exists, the custodian keeps every record, the people affected have no say, money sits unspent or arrives late, and trust moves elsewhere.

- **Haiti, 2010:** the American Red Cross raised US$488M and built six permanent homes (ProPublica/NPR, 2015).
- **Valencia, Spain, 2024:** after the DANA floods, the regional audit office found the way donations were recorded "inadecuado"; all €22.1M received in 2024 was still unbudgeted at year-end, and most was allocated in the last quarter of 2025 (El Español, 2026).
- **Hualien, Taiwan, 2024:** the county received NT$792M (≈US$25M) in donations for the earthquake; eleven months later it had earmarked NT$425M and actually paid out NT$124M, 16% (county committee report, February 2025). Its committee had met three times, with no affected households on it (PTS, 2025). Earlier, by May 2024, the county had received NT$453M for that earthquake through the relief foundation, under a fifth of the NT$2.7bn (≈US$84M) in donations it received after the 2018 earthquake; a councillor said people "would rather give to the central government" (PTS, 2024).
- **Guangfu, Taiwan, 2025:** a barrier lake overflowed, killing 19 people with 5 missing. The national relief foundation raised NT$1.398bn (≈US$44M) and, to its credit, publishes every transfer it makes. We transcribed all eleven of its monthly disclosures: of NT$1.209bn paid out in 48 transfers, **98.8% was pre-allocated**, 93% to one ministry, and NT$49M (4%) had been reconciled a year later. From December 2025 to August 2026, reconciled minus paid-on-claim stayed at exactly NT$15.2M in every disclosure: **for eight months, no pre-allocated money was newly reported as reconciled**. Pre-allocating and reconciling later is normal in an emergency. The problem is that **after the first hand, the public sees only aggregate totals** (the ministry reported 2,582 households paid by December 2025), the foundation's reconciliation lags by a year, and **no household can check or confirm its own payment**, or say that it never arrived.

Two more gaps from the same disaster: three villages outside the "red zone" were left off the first aid list and had to protest; and the foundation's own records revised the number of affected households from 1,837 to 4,039. Victims have no vote on how the money is used: the foundation's board has no seat for them, and Hualien's rules let at most five attend committee meetings, speaking only with the chair's permission.

### Who it serves

- **Custodians** (relief foundation, ministries, county, NGOs): reconciliation evidence as it happens, and a way to win back trust.
- **Affected households:** confirm or dispute their own payment, appeal when left out, report anonymously that they are still waiting, and veto changes to the fund.
- **Donors, journalists, councillors, auditors:** a public record they can check and download as open data.

### What Kept does

1. **Custody chain (where Kept starts).** Each tranche is recorded by the sender and acknowledged by the receiver, hand by hand. When a custodian pays households, it publishes the payment batch as pseudonymous lines (a receipt address and an amount, never a name). Each household finds its own line without asking the custodian and signs "received" or "not received". The contract adds up the lines itself and publicly counts any line that is not a household registered with two signatures, so a padded roster shows up, and only real households can sign. Social workers can sign for elders, but only in the village the township office designated them for, and the household's own answer always replaces theirs.
2. **Sample audit, for those who never answer.** Many households will not answer, and a chief and township office who collude could register ghosts and confirm their lines themselves. For each batch the contract draws a random sample (a fifth of the lines, 5 to 59), seeded by a block fixed at publication, so nobody chooses it. An independent auditor visits those households: each signs the visit with its own key, or the auditor records under its own address that nobody lives there. Anyone can compute an upper bound on how much of the batch could be undelivered (95% confidence).
3. **Eligibility without sharing the roster.** A household is verified only after two signatures (village chief and township office). An NGO then checks eligibility on the spot with a zero-knowledge proof (Semaphore) and never receives the roster; per-programme nullifiers block double claims and stop claims being linked across programmes.
4. **Voice.** The same credential gives each household one anonymous vote on changes, a public appeal when it is left out, and a weekly anonymous "I am still waiting" report. Waiting reports do not depend on any custodian recording anything, so unrecorded payments still show up.
5. **Commitments that cannot be rewritten.** Purposes, caps and the surplus purpose are fixed when money is raised. Cap changes, deadline extensions and uses of the surplus wait through a public period and go ahead unless households veto them. After the deadline, money can only go to the charter's surplus purpose. Emergencies need a stricter committee threshold and may only move cap between purposes; households review them afterwards, and a veto returns the unspent part and revokes the emergency path.
6. **Accountability alerts.** Published rules over the public record flag where to look: tranches not acknowledged within 14 days, money held over 90 days, disputes, audit visits that find "not received" or nobody at the address, heavy proxy use, appeals waiting over 14 days, and villages where households say they are waiting while the township reports nothing.

**Never on-chain:** names, ID numbers, bank accounts. Payment rosters appear only as pseudonymous lines (a receipt address and an amount); a household's confirmation would reveal the same line anyway. Eligibility is still decided by people; Kept makes their decisions attributable.

### Why Web3, and where we deliberately do not use it

- **The people being overseen should not keep the ledger.** Today each custodian keeps its own records and decides what to publish. A shared, append-only record that no single custodian controls is the point.
- **Several independent custodians need shared state** (foundation, ministries, county, NGOs), and none of them is a natural operator for the others.
- **Households need anonymous standing.** In small communities a named "no" carries social cost; zero-knowledge proofs give "a verified household, one vote, not saying which".
- **Law acts after the fact; code acts before.** Taiwan's reform of donation law has stalled since 2020; Kept can be the technical implementation of the county ordinance that nearly 300 people petitioned for.
- **Off-chain on purpose:** personal data and bank payments. In phase 1, while donations stay in banks, the contracts bind the public record, not the bank account: spending outside the charter cannot be recorded as compliant, but it can still happen off the record. We say so plainly.

### Would anyone notice? A simulation at Guangfu's scale

A Monte Carlo model (4,039 households, 4,000 runs per case, every assumption stated on the Why Kept page) asks when each regime would detect a failure affecting 1% of households, counting a detection only when bad answers rise above what 95% of honest runs produce:

| 1% of households (40) | Today | Households' own answers | + sample audit |
|---|---|---|---|
| Payments withheld at random | not in the public record | 89%, median day 29 | 89%, day 28 |
| Withheld from households unlikely to answer | not in the public record | ≈ chance | 28%, day 27 |
| Ghosts registered by colluding officials | not in the public record | ≈ chance | 28%, day 27 |
| Left off every roster | not in the public record | 90% (via "still waiting"), day 29 | 85%, day 31 |

At 2% the audit detects ghosts in 73% of runs, at 5% in 100%, for 480 visits (12% of households). Households' own answers are strong where victims speak and blind where nobody does; the audit is what covers that gap, and it cannot see households who are on no roster.

### On real records: a backtest

We also replayed Kept's alert rules against Hualien County's own donation-account records, assuming the custodian records under Kept as it goes (an alert is a reason to look, not a finding of wrongdoing):

| Real case (Hualien County donation account) | Kept's alert would fire | Public found out | Earlier by |
|---|---|---|---|
| 2024 earthquake: NT$792M received, 16% paid out after 11 months (rule: held over 90 days) | 2 Jul 2024 | 17 Jan 2025, first news story | 199 days |
| 2025 flood: NT$30M donated for children, NT$0 paid 339 days later (rule: earmarked money held over 90 days) | 25 Dec 2025 | never in the news | — |
| 2024 earthquake: NT$97M of approved loans, nothing drawn (rule: approved plan unpaid after 90 days) | 4 Mar 2026 | 31 Jul 2026, with audit findings | 149 days |
| 2018 earthquake: surplus moved to another disaster (rule: change of purpose) | 20 Sep 2022, the day it was decided | 14 Jun 2023, minutes online | about 9 months |

Household-level rules cannot be replayed, because no household-level data is public. Sources and assumptions are on the real-data page and in the repository.

### Built and tested

- 6 Solidity contracts (Foundry): `ReliefFund`, `KeptFactory`, `CustodyLedger`, `EligibilityRegistry`, `VoiceModule`, `AidPrograms`. 74 unit tests, 4 invariants checked over random call sequences (money conserved, caps respected, the custody tree balances, published lines add up), Slither findings triaged in `docs/security-review.md`, and an end-to-end script with real Semaphore v4 proofs (17 checks).
- Next.js app with a public dashboard and a screen for each role (household, village chief and township office, fund committee, custodians, NGO counter), a "Why Kept" page with sources, and a **real-data page** built from all eleven of the foundation's monthly Guangfu disclosures (48 transfers, the reconciliation series) with the backtest above.
- Deployed on Base Sepolia (addresses above). Households never need crypto: a relayer pays gas, and the credential can live on a phone or be printed as a QR code.
- Borrowed, not reinvented: Semaphore v4 (PSE), OpenZeppelin. Prior art we build on: WFP Building Blocks (cross-agency deduplication), Spanish Red Cross RedChain (ZK eligibility), "Not Yet Another Digital ID" (EPFL × ICRC, IEEE S&P 2023).

### Evidence of need

We have not yet interviewed practitioners. Our evidence is nine public statements and official records from seven stakeholder groups (an affected household finding out after a year that nearly NT$400M was unspent; an NGO whose household roster was "finally confirmed at the end of November", about ten weeks after the disaster; an indigenous representative who received "no meeting notice or call" for seven months; the foundation's own note that pre-allocations are checked against rosters later), and the foundation's real disclosure. All are linked in the repository.

### Feasibility and sustainability

- **Path to adoption.** Phase 0 needs no one's permission: civil-society volunteers can already turn a custodian's published disclosures into open data and alerts, as our real-data page does for Guangfu. Phase 1 works under current law: money stays in banks, custodians join voluntarily and get a verifiable record that helps them win back donors. Phase 2: a county ordinance or legal amendment requires the format for government donation accounts. We drafted that ordinance for Hualien County (39 articles, technology-neutral, no fines so the county can adopt it on its own authority, each article mapped to Kept; English summary in `docs/policy/ordinance-summary-en.md`). Its stated limit: a county can bind only its own account; the national relief foundation can opt in. Phase 3: once regulated NT$ stablecoins exist (Taiwan's Virtual Asset Service Act passed in June 2026), funds can sit in the contract and the charter is enforced on the money itself.
- **Most likely pilot:** the national relief foundation, which already publishes every transfer and funded the civic platform guangfu.tw. Kept is complementary to guangfu.tw: it provides the verifiable payment and eligibility data such a platform can display.
- **Cost, measured.** Gas per operation was measured with the real zero-knowledge verifier. At Guangfu's scale (4,039 households, 48 transfers, one confirmation and one NGO claim per household, two votes at 25% turnout) the whole disaster needs about 4.9 billion gas: roughly US$150–1,500 at assumed L2 prices, at most 0.003% of the money raised.
- **Maintenance:** open source (MIT), designed as a digital public good; funding routes include public-goods and humanitarian innovation grants.

### Known limitations

- Phase 1 cannot stop off-record bank payments; it makes them harder to hide.
- Registrations publish village and damage tier on-chain, so exact counts for small villages are visible to anyone reading the chain (the dashboard hides counts under 5). Moving the village off-chain is planned.
- Votes are anonymous but not receipt-free; MACI is the planned upgrade.
- Colluding issuers could still register ghost households; Kept makes this attributable, and the sample audit catches it with a probability that grows with its scale (simulation above), not with certainty.
- The audit sample is seeded by a block hash; production should use a public randomness beacon (drand) or a VRF. The auditor is trusted to visit honestly; a false "nobody there" is recorded under its address.
- Not externally audited; a professional audit is a precondition for holding real funds (phase 3).
- The registry authority is a single key in the demo; in production it should be a multisig of independent bodies, since the ministry is also a custodian.
- Votes are veto-only and need a turnout quorum; victims cannot yet elect committee representatives.

### Plan for the mentoring period (27 Oct – 25 Nov)

- Validate with practitioners: ask mentors and partner NGOs to connect us with a relief custodian and a social worker; test the household screens with older users.
- Accountant-signed balance attestations for custodian bank accounts, to compare money held with money recorded.
- MACI-based voting, per-programme receipt keys, village data moved off-chain.
- A Traditional Chinese household interface, vote notifications, and designed paper cards for elders.
- Open-data export aligned with IATI / Open Contracting, for platforms such as guangfu.tw.

### Ethics

All households, amounts and decisions in the demo are simulated, except the real-data page, which uses only institution-level public data. People in news reports are not named. Investigations mentioned are ongoing; we describe a pattern, not anyone's guilt.
