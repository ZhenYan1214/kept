# Kept — submission text (draft)

> Draft for the DoraHacks "Submit Build" form. Paste each section into the matching field.
> Placeholders in [brackets] must be filled before submitting. Currency: NT$32 ≈ US$1 (approximate, for readers outside Taiwan).

---

## Name

Kept

## Tagline (one line)

Disaster-relief promises you can verify: past the first hand, with a voice for the people the money is for.

## Short description (about 280 characters)

When disaster donations are pre-allocated, the public loses sight of them after the first hand. Kept lets every custodian acknowledge each tranche and publish payments as pseudonymous lines, so verified households can confirm or dispute their own payment, appeal, and veto changes.

## Links

- Demo: https://kept-lilac.vercel.app
- Video: [https://… (YouTube, unlisted is fine)]
- Code: https://github.com/ZhenYan1214/kept
- Contracts on Base Sepolia (chain 84532): KeptFactory `0xE1014fd9E4ffaB6FdB283B980B4E0fA8ADE05eE2`, CustodyLedger `0x3d3BCa042Dc8a021A70186be2d5C0aAd90FC696f`, EligibilityRegistry `0x7b1763E6b1EeAC98C2f69524F35aFb9fDA5A48E0`, VoiceModule `0x3493B41b7B734A15e4DbE9520dEFe7B70f67F28F`, AidPrograms `0x4167Aa2358d942F1e0D0C0672C28cE2Ad90cBFb7` (Semaphore v4 `0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D`)

## Track

Tech Track. Solo builder: [name, one line about you].

---

## Description (long, markdown)

### The problem: trust stops at the first hand

A disaster fund makes two promises: to donors, about how the money will be used; to affected households, that no one will be left out. Both are hard to check, and the same loop repeats across countries: money is raised before a plan exists, the custodian keeps every record, the people affected have no say, money sits unspent or arrives late, and trust moves elsewhere.

- **Haiti, 2010:** the American Red Cross raised US$488M and built six permanent homes (ProPublica/NPR, 2015).
- **Valencia, Spain, 2024:** after the DANA floods, the regional audit office found the way donations were recorded "inadecuado"; all €22.1M received in 2024 was still unbudgeted at year-end, and most was allocated in the last quarter of 2025 (El Español, 2026).
- **Hualien, Taiwan, 2024:** a county donation account of about NT$790M (≈US$25M) still held about NT$420M a year later; its committee had met three times, with no affected households on it (PTS, 2025). Earlier, by May 2024, the county had received NT$453M for that earthquake through the relief foundation, under a fifth of the NT$2.7bn (≈US$84M) in donations it received after the 2018 earthquake; a councillor said people "would rather give to the central government" (PTS, 2024).
- **Guangfu, Taiwan, 2025:** a barrier lake overflowed, killing 19 people with 5 missing. The national relief foundation raised NT$1.398bn (≈US$44M) and, to its credit, publishes every transfer it makes. We transcribed its September 2026 disclosure: of NT$1.209bn paid out in 48 transfers, **98.8% was pre-allocated**, 93% to one ministry, and NT$49M (4%) had been reconciled a year later. Pre-allocating and reconciling later is normal in an emergency. The problem is that **after the first hand, the public sees only aggregate totals** (the ministry reported 2,582 households paid by December 2025), the foundation's reconciliation lags by a year, and **no household can check or confirm its own payment**, or say that it never arrived.

Two more gaps from the same disaster: three villages outside the "red zone" were left off the first aid list and had to protest; and the foundation's own records revised the number of affected households from 1,837 to 4,039. Victims have no vote on how the money is used: the foundation's board has no seat for them, and Hualien's rules let at most five attend committee meetings, speaking only with the chair's permission.

### Who it serves

- **Custodians** (relief foundation, ministries, county, NGOs): reconciliation evidence as it happens, and a way to win back trust.
- **Affected households:** confirm or dispute their own payment, appeal when left out, report anonymously that they are still waiting, and veto changes to the fund.
- **Donors, journalists, councillors, auditors:** a public record they can check and download as open data.

### What Kept does

1. **Custody chain (where Kept starts).** Each tranche is recorded by the sender and acknowledged by the receiver, hand by hand. When a custodian pays households, it publishes the payment batch as pseudonymous lines (a receipt address and an amount, never a name). Each household finds its own line without asking the custodian and signs "received" or "not received". The contract adds up the lines itself and publicly counts any line that is not a household registered with two signatures, so a padded roster shows up, and only real households can sign. Social workers can sign for elders, but only in the village the township office designated them for, and the household's own answer always replaces theirs.
2. **Eligibility without sharing the roster.** A household is verified only after two signatures (village chief and township office). An NGO then checks eligibility on the spot with a zero-knowledge proof (Semaphore) and never receives the roster; per-programme nullifiers block double claims and stop claims being linked across programmes.
3. **Voice.** The same credential gives each household one anonymous vote on changes, a public appeal when it is left out, and a weekly anonymous "I am still waiting" report. Waiting reports do not depend on any custodian recording anything, so unrecorded payments still show up.
4. **Commitments that cannot be rewritten.** Purposes, caps and the surplus purpose are fixed when money is raised. Cap changes, deadline extensions and uses of the surplus wait through a public period and go ahead unless households veto them. After the deadline, money can only go to the charter's surplus purpose. Emergencies need a stricter committee threshold and may only move cap between purposes; households review them afterwards, and a veto returns the unspent part and revokes the emergency path.
5. **Accountability alerts.** Published rules over the public record flag where to look: tranches not acknowledged within 14 days, money held over 90 days, disputes, heavy proxy use, appeals waiting over 14 days, and villages where households say they are waiting while the township reports nothing.

**Never on-chain:** names, ID numbers, bank accounts. Payment rosters appear only as pseudonymous lines (a receipt address and an amount); a household's confirmation would reveal the same line anyway. Eligibility is still decided by people; Kept makes their decisions attributable.

### Why Web3, and where we deliberately do not use it

- **The people being overseen should not keep the ledger.** Today each custodian keeps its own records and decides what to publish. A shared, append-only record that no single custodian controls is the point.
- **Several independent custodians need shared state** (foundation, ministries, county, NGOs), and none of them is a natural operator for the others.
- **Households need anonymous standing.** In small communities a named "no" carries social cost; zero-knowledge proofs give "a verified household, one vote, not saying which".
- **Law acts after the fact; code acts before.** Taiwan's reform of donation law has stalled since 2020; Kept can be the technical implementation of the county ordinance that nearly 300 people petitioned for.
- **Off-chain on purpose:** personal data and bank payments. In phase 1, while donations stay in banks, the contracts bind the public record, not the bank account: spending outside the charter cannot be recorded as compliant, but it can still happen off the record. We say so plainly.

### Built and tested

- 6 Solidity contracts (Foundry): `ReliefFund`, `KeptFactory`, `CustodyLedger`, `EligibilityRegistry`, `VoiceModule`, `AidPrograms`. 69 unit tests, plus an end-to-end script with real Semaphore v4 proofs (14 checks).
- Next.js app with a public dashboard and a screen for each role (household, village chief and township office, fund committee, custodians, NGO counter), a "Why Kept" page with sources, and a **real-data page** replaying the foundation's 48 Guangfu transfers.
- Deployed on Base Sepolia (addresses above). Households never need crypto: a relayer pays gas, and the credential can live on a phone or be printed as a QR code.
- Borrowed, not reinvented: Semaphore v4 (PSE), OpenZeppelin. Prior art we build on: WFP Building Blocks (cross-agency deduplication), Spanish Red Cross RedChain (ZK eligibility), "Not Yet Another Digital ID" (EPFL × ICRC, IEEE S&P 2023).

### Evidence of need

We have not yet interviewed practitioners. Our evidence is nine public statements and official records from seven stakeholder groups (an affected household finding out after a year that nearly NT$400M was unspent; an NGO whose household roster was "finally confirmed at the end of November", about ten weeks after the disaster; an indigenous representative who received "no meeting notice or call" for seven months; the foundation's own note that pre-allocations are checked against rosters later), and the foundation's real disclosure. All are linked in the repository.

### Feasibility and sustainability

- **Path to adoption.** Phase 0 needs no one's permission: civil-society volunteers can already turn a custodian's published disclosures into open data and alerts, as our real-data page does for Guangfu. Phase 1 works under current law: money stays in banks, custodians join voluntarily and get a verifiable record that helps them win back donors. Phase 2: a county ordinance or legal amendment requires the format for government donation accounts. Phase 3: once regulated NT$ stablecoins exist (Taiwan's Virtual Asset Service Act passed in June 2026), funds can sit in the contract and the charter is enforced on the money itself.
- **Most likely pilot:** the national relief foundation, which already publishes every transfer and funded the civic platform guangfu.tw. Kept is complementary to guangfu.tw: it provides the verifiable payment and eligibility data such a platform can display.
- **Cost, measured.** Gas per operation was measured with the real zero-knowledge verifier. At Guangfu's scale (4,039 households, 48 transfers, one confirmation and one NGO claim per household, two votes at 25% turnout) the whole disaster needs about 4.9 billion gas: roughly US$150–1,500 at assumed L2 prices, at most 0.003% of the money raised.
- **Maintenance:** open source (MIT), designed as a digital public good; funding routes include public-goods and humanitarian innovation grants.

### Known limitations

- Phase 1 cannot stop off-record bank payments; it makes them harder to hide.
- Registrations publish village and damage tier on-chain, so exact counts for small villages are visible to anyone reading the chain (the dashboard hides counts under 5). Moving the village off-chain is planned.
- Votes are anonymous but not receipt-free; MACI is the planned upgrade.
- An issuer could still register ghost households; Kept makes this attributable, not impossible.
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
