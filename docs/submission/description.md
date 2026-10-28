# Kept — submission text (draft)

> Draft for the DoraHacks "Submit Build" form. Paste each section into the matching field.
> **For the Details field, paste `details.md` instead of the long description below** (it follows the 2026-10-24 details guide: no tables, about 1,200 words). The long description stays as the fuller reference.
> All placeholders are filled. Currency: NT$32 ≈ US$1 (approximate, for readers outside Taiwan).

---

## Name

Kept

## Tagline (one line)

Disaster-relief promises you can verify: past the first hand, with a voice for the people the money is for.

## Short description (about 280 characters)

Aid trackers record what custodians say they did. Kept lets the people the money was for confirm or dispute it, on the record. Custodians publish payments as pseudonymous lines that verified households answer, and a random sample drawn on-chain is visited by an independent auditor.

## Links

- Demo: https://kept-lilac.vercel.app
- Presentation video (5:44): https://youtu.be/xQsi2FCJgGY
- Code: https://github.com/ZhenYan1214/kept
- All seven contracts are source-verified on Blockscout and Sourcify (exact match, 2026-10-24).
- Contracts on Base Sepolia (chain 84532): KeptFactory `0xD2f8E97EB8cDde0d4446b3464f36Cf01F54A13C0`, CustodyLedger `0x36e9859d90E06A084AF602282985c7b568e18072`, EligibilityRegistry `0xB784Cbe3d5Db9288baa6Ffc5F2cc909A1E2aC016`, VoiceModule `0x6ceFbf6C843A217B077e518f1808f1bb3e97ADBB`, AidPrograms `0xFf7D18bB5E7702DA924Daa07D56Fe15B6A9117be` (Semaphore v4 `0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D`)

## Track

Tech Track. Solo builder: a first-year master's student in Taiwan, interested in blockchain.

---

## Description (long, markdown)

**Aid trackers record what custodians say they did. Kept lets the people the money was for confirm or dispute it, on the record.**

After the 2025 Guangfu flood in Taiwan, the public could see NT$1.21bn leave the national relief foundation, 98.8% of it as pre-allocations, but not whether it reached anyone: for eight months the foundation's own reports showed no pre-allocated money newly reconciled. After the 2024 Hualien earthquake, the county had paid out 16% of NT$792M eleven months on. Kept follows donated money hand by hand until the household it was meant for can say whether it arrived.

### Try it in 2 minutes (no wallet, no sign-up)

1. **Real records, read-only (1 min).** [Guangfu, real data](https://kept-lilac.vercel.app/replay): the relief foundation's 48 transfers and all eleven monthly disclosures, the reconciliation line that stays flat for eight months, and the backtest. Nobody can change this page, so every reviewer sees the same thing.
2. **The loop, interactive (1–2 min).** On the shared testnet demo (role screens are under *Try a role* in the header):
   - **Household:** *Create credential*, then *Simulate: chief scans this code*.
   - **Village & township:** *Propose registration*, switch *Acting as* to the township office, then *Approve*. The household now shows "Verified household".
   - **Custodians:** tick your household, then *Publish payment lines*.
   - **Household:** *I did not receive it*. The public dashboard counts the dispute.
   - **NGO counter:** on the Household screen press *Show code at the counter*, then *Verify & record hand-over* on the NGO counter. A second try with the same household is rejected.

The demo is public, so other visitors may have added households or proposals. Your credential lives in your own browser, so the steps above work regardless. Changes to the fund (Fund committee) wait through a real 5-minute public period that cannot be skipped on the testnet. The presentation video (5:44) shows the full flow, including a household veto.

### The problem: trust stops at the first hand

A disaster fund makes two promises: to donors, about how the money will be used; to affected households, that no one will be left out. Both are hard to check, and the same loop repeats across countries: money is raised before a plan exists, the custodian keeps every record, the people affected have no say, money sits unspent or arrives late, and trust moves elsewhere. Taiwan first, where our data comes from:

- **Hualien, Taiwan, 2024:** the county received NT$792M (≈US$25M) in donations for the earthquake; eleven months later it had earmarked NT$425M and actually paid out NT$124M, 16% (county committee report, February 2025). Its committee had met only three or four times (reports differ), with no affected households on it (PTS, 2025). Most donors gave to the national relief foundation instead, NT$1.65bn, about twice the county's; the press attributed this to disputes over the county's 2018 donations (LTN, 2025), and a councillor said people "would rather give to the central government" (PTS, 2024).
- **Guangfu, Taiwan, 2025:** a barrier lake overflowed, killing 19 people with 5 missing. The national relief foundation raised NT$1.398bn (≈US$44M) and, to its credit, publishes every transfer it makes. We transcribed all eleven of its monthly disclosures: of NT$1.209bn paid out in 48 transfers, **98.8% was pre-allocated**, 93% to one ministry, and NT$49M (4%) had been reconciled a year later. From December 2025 to August 2026, reconciled minus paid-on-claim stayed at exactly NT$15.2M in every disclosure: **for eight months, no pre-allocated money was newly reported as reconciled**. Pre-allocating and reconciling later is normal in an emergency. The problem is that **after the first hand, the public sees only aggregate totals** (the ministry reported 2,582 households paid by December 2025), the foundation's reconciliation lags by a year, and **households have no public, recorded way to confirm their own payment or to say that it never arrived**; they can only petition.
- **Elsewhere, the same loop.** Haiti, 2010: the American Red Cross raised US$488M and built six permanent homes (ProPublica/NPR, 2015). Valencia, Spain, 2024: after the DANA floods, most of the €22.1M donated was allocated only in the last quarter of 2025, a year after the floods, and the regional audit office found the way donations were recorded "inadecuado" (El Español, 2026).

Two more gaps from the same disaster: residents of three villages protested that they had been left out of the county's first consolation payment (CNA, 6 Oct 2025); and the foundation's own estimate of affected households moved from 1,837 to about 3,325 within a month, and later to 4,039 for one programme. Victims have no vote on how the money is used: the foundation's board reserves no seat for them, and Hualien's rules let at most five attend committee meetings, speaking only with the chair's permission.

### Who it serves

- **Custodians** (relief foundation, ministries, county, NGOs): reconciliation evidence as it happens, and a way to win back trust.
- **Affected households:** confirm or dispute their own payment, appeal when left out, report anonymously that they are still waiting, and veto changes to the fund.
- **Donors, journalists, councillors, auditors:** a public record they can check and download as open data.

### What Kept does

1. **Custody chain (where Kept starts).** Each tranche is recorded by the sender and acknowledged by the receiver, hand by hand. When a custodian pays households, it publishes the payment batch as pseudonymous lines (a receipt address and an amount, never a name). Each household finds its own line without asking the custodian and signs "received" or "not received". The contract adds up the lines itself and publicly counts any line that is not a household registered with two signatures, so a padded roster shows up, and only real households can sign. Social workers can sign for elders, but only in the village the township office designated them for, and the household's own answer always replaces theirs.
2. **Sample audit, for those who never answer.** Many households will not answer, and a chief and township office who collude could register ghosts and confirm their lines themselves. For each batch the contract draws a random sample (a fifth of the lines, 5 to 59), seeded by a block hash just after publication (a later draw uses a later block, recorded publicly). An independent auditor visits those households: each signs the visit with its own key, or the auditor records under its own address that nobody lives there. Anyone can compute an upper bound on how much of the batch could be undelivered (95% confidence).
3. **Eligibility without sharing the roster.** A household is verified only after two signatures (village chief and township office). An NGO then checks eligibility on the spot with a zero-knowledge proof (Semaphore) and never receives the roster; per-programme nullifiers block double claims and stop claims being linked across programmes.
4. **Voice.** The same credential gives each household one anonymous vote on changes, a public appeal when it is left out, and a weekly anonymous "I am still waiting" report. Waiting reports do not depend on any custodian recording anything, so unrecorded payments still show up.
5. **Commitments that cannot be rewritten.** Purposes, caps and the surplus purpose are fixed when money is raised. Cap changes, deadline extensions and uses of the surplus wait through a public period and go ahead unless households veto them. After the deadline, money can only go to the charter's surplus purpose. Emergencies need a stricter committee threshold and may only move cap between purposes; households review them afterwards, and a veto returns the unspent part and revokes the emergency path.
6. **Accountability alerts.** Published rules over the public record flag where to look: tranches not acknowledged within 14 days, money held over 90 days, disputes, audit visits that find "not received" or nobody at the address, heavy proxy use, appeals waiting over 14 days, and villages where households say they are waiting while the township reports nothing.

**Never on-chain:** names, ID numbers, bank accounts. Payment rosters appear only as pseudonymous lines (a receipt address and an amount); a household's confirmation would reveal the same line anyway. Eligibility is still decided by people; Kept makes their decisions attributable.

### Why Web3, and where we deliberately do not use it

**In one line:** the custodians who pay cannot rewrite the record afterwards, and the households they paid can say, anonymously and on the record, whether the money arrived. Zero-knowledge eligibility is a building block here, not the selling point (the Spanish Red Cross's RedChain already does it).

- **The people being overseen should not keep the ledger.** Today each custodian keeps its own records and decides what to publish. A shared, append-only record that no single custodian controls is the point.
- **Several independent custodians need shared state** (foundation, ministries, county, NGOs), and none of them is a natural operator for the others.
- **Households need anonymous standing.** In small communities a named "no" carries social cost; zero-knowledge proofs give "a verified household, one vote, not saying which".
- **Law acts after the fact; code acts before.** Taiwan's donation law was last amended in January 2020, and later bills that would cover government accounts have not passed; Kept can be the technical implementation of the county ordinance that a councillor and nearly 300 residents called for in 2024.
- **Off-chain on purpose:** personal data and bank payments. In phase 1, while donations stay in banks, the contracts bind the public record, not the bank account: spending outside the charter cannot be recorded as compliant, but it can still happen off the record. We say so plainly.

### Where Kept sits next to existing work

| | What it establishes | What Kept adds |
|---|---|---|
| UMA "Blockchain for Good · Proof of Aid" qualifier (Sept 2026): tracking NGO aid from need to delivery, protecting recipients' data | Aid traced from need to delivery (the brief) | The household's own recorded answer, a random audit for those who never answer, and a public record of who was left off the roster |
| Spanish Red Cross RedChain; WFP Building Blocks | Private eligibility; deduplication across agencies | Commitments to donors fixed in the charter, with a household veto on changes |
| guangfu.tw (civic platform) | Information for affected residents | Verifiable payment and eligibility data such a platform can display |

### Would anyone notice? A simulation at Guangfu's scale

A Monte Carlo model (4,039 households, 4,000 runs per case, every assumption stated on the Why Kept page) asks when each regime would detect a failure affecting 1% of households, counting a detection only when bad answers rise above what 95% of honest runs produce:

| 1% of households (40) | Today | Households' own answers | + sample audit |
|---|---|---|---|
| Payments withheld at random | not in the public record | 89%, median day 29 | 89%, day 28 |
| Withheld from households unlikely to answer | not in the public record | ≈ chance | 28%, day 27 |
| Ghosts registered by colluding officials | not in the public record | ≈ chance | 28%, day 27 |
| Left off every roster | not in the public record | 90% (via "still waiting"), day 29 | 85%, day 31 |

At 2% the audit detects ghosts in 73% of runs, at 5% in 100%, for 480 visits (12% of households); these figures assume the auditor visits honestly. Households' own answers are strong where victims speak and blind where nobody does; the audit is what covers that gap, and it cannot see households who are on no roster.

### On real records: a backtest

We also replayed Kept's alert rules against Hualien County's own donation-account records, assuming the custodian records under Kept as it goes (an alert is a reason to look, not a finding of wrongdoing):

| Real case (Hualien County donation account) | Kept's alert would fire | Public found out | Earlier by |
|---|---|---|---|
| 2024 earthquake: NT$792M received, 16% paid out after 11 months (rule: held over 90 days) | 2 Jul 2024 | 17 Jan 2025, first news story we found on the balance | 199 days |
| 2025 flood: NT$30M donated for children, NT$0 paid 339 days later (rule: earmarked money held over 90 days) | 25 Dec 2025 | no news report of the delay found | — |
| 2024 earthquake: NT$97M of approved loans, nothing drawn because no one applied (rule: approved plan unpaid after 90 days) | 4 Mar 2026 | 16 Jun 2026, minutes online | 104 days |

Household-level rules cannot be replayed, because no household-level data is public. Sources and assumptions are on the real-data page and in the repository.

### Built and tested

- 6 Solidity contracts (Foundry): `ReliefFund`, `KeptFactory`, `CustodyLedger`, `EligibilityRegistry`, `VoiceModule`, `AidPrograms`. 74 unit tests, 4 invariants checked over random call sequences (money conserved, caps respected, the custody tree balances, published lines add up), Slither findings triaged in `docs/security-review.md`, and an end-to-end script with real Semaphore v4 proofs (17 checks).
- Next.js app with a public dashboard and a screen for each role (household, village chief and township office, fund committee, custodians, NGO counter), a "Why Kept" page with sources, and a **real-data page** built from all eleven of the foundation's monthly Guangfu disclosures (48 transfers, the reconciliation series) with the backtest above.
- Deployed on Base Sepolia (addresses above). Households never need crypto: a relayer pays gas, and the credential can live on a phone or be printed as a QR code.
- Borrowed, not reinvented: Semaphore v4 (PSE), OpenZeppelin. Prior art we build on: WFP Building Blocks (cross-agency deduplication), Spanish Red Cross RedChain (ZK eligibility), "Not Yet Another Digital ID" (EPFL × ICRC, IEEE S&P 2023).

### Evidence of need

We have not yet interviewed practitioners. Our evidence is public statements and official records from several stakeholder groups (an affected household finding out after a year that nearly NT$400M was still left; an NGO whose household roster was "finally confirmed at the end of November", about ten weeks after the disaster; an indigenous representative who received "no meeting notice or call" for seven months; the foundation's own note that pre-allocations are checked against rosters later), and the foundation's real disclosure. All are linked in the repository.

### Feasibility and sustainability

- **Path to adoption.** Phase 0 needs no one's permission: civil-society volunteers can already turn a custodian's published disclosures into open data and alerts, as our real-data page does for Guangfu. Phase 1 works under current law: money stays in banks, custodians join voluntarily and get a verifiable record that helps them win back donors. Phase 2: a county ordinance or legal amendment requires the format for government donation accounts. We drafted that ordinance for Hualien County (39 articles, technology-neutral, no fines so the county can adopt it on its own authority, each article mapped to Kept; English summary in `docs/policy/ordinance-summary-en.md`). Its stated limit: a county can bind only its own account; the national relief foundation can opt in. Phase 3: once regulated NT$ stablecoins exist (Taiwan's Virtual Asset Service Act passed in June 2026), funds can sit in the contract and the charter is enforced on the money itself.
- **Most likely pilot:** the national relief foundation, which already publishes every transfer and funded the civic platform guangfu.tw. Kept is complementary to guangfu.tw: it provides the verifiable payment and eligibility data such a platform can display.
- **Cost, measured.** Gas per operation was measured with the real zero-knowledge verifier. At Guangfu's scale (4,039 households, 48 transfers, one confirmation and one NGO claim per household, two votes at 25% turnout) the whole disaster needs about 4.9 billion gas: roughly US$150–1,500 at assumed L2 prices, about 0.003% of the money raised.
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

### Plan for the next rounds

Official timeline: presentation videos reviewed 30 Oct–1 Nov, finalists announced by 1 Nov, refinement with mentors 2–25 Nov, final at SMU on 26 Nov. During refinement:

- Validate with practitioners: ask mentors and partner NGOs to connect us with a relief custodian and a social worker; test the household screens with older users.
- Accountant-signed balance attestations for custodian bank accounts, to compare money held with money recorded.
- MACI-based voting, per-programme receipt keys, village data moved off-chain.
- A Traditional Chinese household interface, vote notifications, and designed paper cards for elders.
- Open-data export aligned with IATI / Open Contracting, for platforms such as guangfu.tw.

### Ethics

All households, amounts and decisions in the demo are simulated, except the real-data page, which uses only institution-level public data. People in news reports are not named. Investigations mentioned are ongoing; we describe a pattern, not anyone's guilt.
