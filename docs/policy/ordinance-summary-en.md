# Hualien County Disaster Donation Account Oversight Ordinance (draft): one-page summary

> [!WARNING]
> **Student draft for discussion, not legal advice.** Written on 2026-10-17 by a hackathon participant as Kept's "phase 2" policy prototype. No lawyer, government body or indigenous community has reviewed it. All periods and thresholds are starting points for public hearings. Full Chinese text, with an article-by-article rationale and sources: [`花蓮縣災害民間捐款專戶監督自治條例草案.md`](花蓮縣災害民間捐款專戶監督自治條例草案.md).

## Why

When a disaster strikes, Hualien County opens a government donation account. Taiwan's Public Welfare Fundraising Act asks a government account for only three things: issue receipts, publish disclosures (monthly during a major disaster, at the level of spending items), and use the money as designated (Art. 6). Charities, by contrast, need an approved spending plan, must spend any surplus within 3 years, and must post results online (Arts. 19–20). The gap shows in practice:

- **2024 earthquake:** the county received about NT$792M; eleven months later it had earmarked NT$425M and paid out NT$124M (16%). The committee met 3 times and had no affected households on it. Donations for several disasters sit in one shared account, separated only by bookkeeping.
- **Current rules:** affected residents may send at most 5 people, who **attend without a vote** and speak only with the chair's permission.
- **2025 Guangfu flood:** the county's monthly spending statements went online three to eight weeks after each cutoff, and committee reports listed *earmarked* amounts as *spent*. Income was posted as JPG images. At the national relief foundation, about 4% of NT$1.21bn paid out had been reconciled a year later; no household can confirm its own payment.
- **Reform has stalled:** a 2024 amendment for government donation oversight has sat in committee since March 2024. A councillor and nearly 300 signatories called for a county ordinance; no draft exists. The 2025 reconstruction act requires monthly disclosure for *public* money but says nothing about donations.

## What the draft requires (39 articles, 9 chapters)

| # | Requirement | Articles |
|---|---|---|
| 1 | **Charter before money:** a separate account per disaster; purposes, percentage caps, surplus purpose and a deadline (≤ 3 years) published when fundraising starts. No new purposes, no transfers to other disasters or the general budget. Unspent money is never forced out. | 6–10 |
| 2 | **Changes wait in public; households can veto:** cap changes, extensions and surplus use are posted for ≥ 14 days. They fail if opponents outnumber supporters *and* turnout reaches a chartered 10–25% of households. After a veto the same kind of change is blocked for four periods. Emergency moves between purposes take effect at once and face a 30-day household review; if vetoed, the unspent part reverts and the emergency path is lost. | 11–13 |
| 3 | **Every hand records and acknowledges:** the sender records each transfer within 3 working days. The receiver acknowledges within 7 days, and gets no further tranche until it does. Earmarked, approved, paid and reconciled amounts are recorded separately. | 15–17 |
| 4 | **Pseudonymous payment lines:** households are registered by two separate people (village chief and township officer) and get a receipt code. Payments are published within 14 days as code + amount, never a name, ID or account number. The record totals each batch itself and counts lines that belong to no registered household. | 18–19 |
| 5 | **Households confirm or dispute their own line** without asking the payer. Proxies are labelled, and the household's own answer always wins. | 20 |
| 6 | **Random sample audits:** 1/5 of each batch (min 5, max 59) is drawn by a method no one can predict beforehand and anyone can reproduce afterwards. An independent auditor visits each sampled household, and "nobody here" is recorded under the auditor's own name. If all 59 sampled households confirm, fewer than 5% of the batch is undelivered at 95% confidence. | 21 |
| 7 | **Appeals and anonymous "still waiting" reports**, open to anyone, with counts, handling times and outcomes published per village. Published, recomputable alert rules point to where to look. | 22–24 |
| 8 | **Data:** a tamper-evident public record that no single agency controls, with open source code. Machine-readable, openly licensed data within 7 days. Images and scans do not count as disclosure. | 25–26 |
| 9 | **Privacy:** no personal data is published, and counts under 5 are shown as "<5". The code-to-identity table stays with the township office. | 27 |
| 10 | **Committee:** county staff ≤ 1/3 of members; **affected-household representatives ≥ 1/3, with full votes and elected by households**. Indigenous representation at least proportional; donor representatives included. Meets at least monthly in the first year. | 29–32 |
| 11 | **Oversight:** a written report at every council session, a yearly CPA check of bank balances against the public record, and audit findings published. No fines; consequences are suspended tranches, repayment under grant conditions, and existing civil-service discipline. | 33–35 |
| 12 | **Transition and support:** existing accounts publish a charter and one year of back data within 6 months. The county provides shared systems, paper cards and staff to small townships, and charities may opt in voluntarily. | 28, 36–39 |

The articles are **technology-neutral**: they name outcomes (tamper-evident, machine-readable, verifiable by anyone, one vote per household, unlinkable), not blockchain or Kept.

## Why a county can do this

- Taiwan's Local Government Act (Arts. 19, 25, 28) lets a county legislate on its own finances, charity and social assistance, and disaster relief. Rights for residents and the committee's composition must be set by ordinance.
- The draft only **tightens a county's duties over its own account**. It adds to the national minimum and never overrides a donor's designated purpose, so it should not conflict with national law, which would make it void under Art. 30.
- With no fines it needs only *filing* with the central ministry, not approval (Art. 26). Precedent: Taipei already regulates a welfare donation account by ordinance, with monthly disclosure.

## How Kept implements it

Kept's contracts on Base cover most articles: `ReliefFund` (charter, caps, surplus, waiting period, emergency review), `VoiceModule` (anonymous veto, Semaphore), `CustodyLedger` (hops, acknowledgements, payment lines, household confirmations, sample audits), `EligibilityRegistry` (two-signature registration, appeals, "still waiting" reports) and published alert rules. Not yet built: paper voting, electing household representatives, CPA balance checks, indigenous consultation workflow, open-standard (IATI) export. The Chinese draft's appendix maps every article to a function and marks what is missing.

## Limits we found

1. **It cannot bind the national relief foundation** or other charities, which raised most of the 2025 donations. They can only opt in; covering them needs an amendment to Art. 6 of the national Act.
2. **An ordinance is not "law" under Taiwan's privacy act.** It can define county duties but cannot authorise sharing personal data with NGOs, hence "publish no personal data". In small villages, pseudonymous lines may still be partly identifiable.
3. **The household veto is novel.** It is not a referendum, but the central government might see it as fettering the county's spending discretion. A fallback is "a veto forces re-deliberation and a report to the council".
4. **Public naming of violators is a penalty** that a county ordinance cannot impose. The national audit office cannot be directed by a county.
5. **Indigenous collective decision-making** (tribal councils, Art. 2-1 and Art. 21 of the Indigenous Peoples Basic Law) may not match one-household-one-vote. This needs consultation with the Amis communities of Mataian and Tafalong before any filing.
6. **Phase 1 binds the record, not the bank**: an off-record bank payment is still possible. The yearly CPA check is the backstop.

*Comparative note:* Japan's Disaster Countermeasures Basic Act (Arts. 90-2 to 90-4) creates a statutory victim register with defined sharing rules. Households cannot see or confirm what the register says about them, which is the gap this draft targets.
