# Kept — disaster-relief promises you can verify

**A disaster fund makes two promises: to donors, about how the money will be used; to affected households, that no one will be left out. Kept makes both verifiable.**

Built for the *Web3 for Social Good Hackathon 2026* (SMU · GSR Foundation · University of Málaga), Tech Track.

> All households, amounts and decisions in the demo are **simulated**. Place names follow Guangfu Township, Hualien (Taiwan), where the Mataian River barrier lake overflowed on 2025-09-23.

## The problem, in one loop

Money is raised before a plan exists → the custodian keeps every record → victims have no voice → surpluses and delays → trust collapses and donations go elsewhere.

- **Haiti 2010:** US$488M raised, six permanent homes built ([ProPublica/NPR](https://www.propublica.org/article/how-the-red-cross-raised-half-a-billion-dollars-for-haiti-and-built-6-homes)).
- **Hualien 2024:** a county donation account of ~NT$790M still held ~NT$420M a year later; its committee met three times and had no victims on it ([PTS](https://news.pts.org.tw/article/744652)). The following year's allocation through the national relief foundation was under a fifth of the 2018 one ([PTS](https://news.pts.org.tw/article/695533)).
- **Guangfu 2025:** of NT$1.21bn paid out by the relief foundation (including pre-allocations), NT$49M had been reconciled by Sept 2026 ([disclosure](https://www.tf4dr.org/fundraising_plans/156/credits)). Pre-allocating and reconciling later is normal in an emergency; the point is that **nothing after the first hand is visible**.
- Victims have **no vote** on how the money is used: the relief foundation's board has no seat for them, and Hualien's rules let up to five attend committee meetings and speak only with the chair's permission ([rules](https://glrs.hl.gov.tw/glrsout/LawContent.aspx?id=GL001170)).
- Three villages outside the "red zone" were left off the first aid list and had to protest ([CNA](https://www.cna.com.tw/news/aloc/202510060164.aspx)).

The full, source-checked problem statement is on the app's **Why Kept** page.

## Evidence of need, in stakeholders' own words

We have not yet interviewed practitioners (see [Validation](#validation)). Every group Kept serves has, however, already described the problem in public:

| Who | What is on the record | Source | Kept answers with |
|---|---|---|---|
| Affected household | "Only after a year did we find out nearly NT$400M of the donations was still left." | [PTS, 2025-03-31](https://news.pts.org.tw/article/744652) | Public commitments and progress |
| Affected household | A ground-floor household living alone missed aid several times because agencies used different criteria. | [SETN, 2025-12-18](https://www.setn.com/news/1767342) | Public appeals per village; "verified, not yet paid" signal |
| Affected household | A temporary-housing application was refused over a decades-old property record and took two weeks to correct. | [The Reporter, 2026-02-12](https://www.twreporter.org/a/the-year-of-healing-hualien-mataian-villagers) | Attributable decisions and a public appeal trail |
| Indigenous representative | Appointed to a reconstruction committee, then received "no meeting notice or call" for seven months. | [Newsmarket, 2026-09-21](https://www.newsmarket.com.tw/blog/242854/) | Household voice that does not depend on being invited |
| NGO | "With the township office's help, the household roster was finally confirmed at the end of November"; aid was handed out on 5–6 December, about ten weeks after the disaster. | [CCRA final report, 2026-01-07](https://www.ccra.org.tw/pdf/report/0923%20%20final%20project%20report_20260107.pdf) | Eligibility checks without handing the roster to each NGO |
| Custodian | Pre-allocations are "checked against each agency's relief roster later, with refunds or top-ups"; a year on, NT$49M of NT$1.21bn is reconciled. | [Relief foundation disclosure](https://www.tf4dr.org/fundraising_plans/156/credits) | Roster roots and household receipts as reconciliation evidence |
| Donors | After the 2018 disputes, the relief foundation's 2024 allocation to Hualien was under a fifth of 2018's; a councillor said people "would rather give to the central government". | [PTS, 2024-05-17](https://news.pts.org.tw/article/695533) | A fund custodians can prove they kept |
| Citizens | Nearly 300 people petitioned for a county ordinance to oversee disaster donations. | [PTS, 2024-05-17](https://news.pts.org.tw/article/695533) | A ready technical implementation of such an ordinance |
| Oversight bodies | The Control Yuan corrected the county over 2018 quake procurement; the Legislative Budget Center found the national guideline on disaster donations not binding. | [Control Yuan](https://www.cy.gov.tw/News_Content.aspx?n=124&sms=8912&s=16366), [Budget Center](https://www.ly.gov.tw/Pages/Detail.aspx?nodeid=45805&pid=223464) | Records that do not depend on the custodian's own reporting |

## Where Kept starts: reconciliation

The relief foundation already publishes every transfer it makes, which is better than most. But more than NT$1.1bn of the Guangfu donations was pre-allocated to the ministry, and from there the public sees nothing until reconciliation, which a year later covers about 4%. The foundation needs that evidence too.

Kept gives every downstream custodian the same simple tool: acknowledge what you received, commit each payment roster as a Merkle root, and let each household confirm or dispute its own line. **The custodian gets reconciliation evidence it currently assembles by hand; the public can see past the first hand; households can say "this never reached me".** Commitments and household voice build on that record.

## What Kept does

| Mechanism | What it guarantees | Contract |
|---|---|---|
| **Custody** | Each tranche is recorded by the sender and acknowledged by the receiver, hand by hand. Payment rosters are committed as **Merkle roots**: the public sees totals, each household can prove it is counted and **sign** "received" or "not received" for its own line. Only receipt addresses registered with two signatures count, so a custodian cannot pad a roster with its own keys and confirm them. Proxies (e.g. a social worker for elders) are designated per village by the township office, and a household's own answer always replaces a proxy's. | `CustodyLedger`, `EligibilityRegistry` |
| **Eligibility** | A household is verified only after **two signatures** (village chief + township office). NGOs then check eligibility on the spot with a zero-knowledge proof, **without receiving any roster**; per-programme nullifiers block double claims and prevent linking claims across programmes. Registration itself is still done by people and is still the slow step; what Kept removes is handing the roster to every NGO. | `EligibilityRegistry`, `AidPrograms` |
| **Commitment** | Purposes, caps and the surplus purpose are fixed when money is raised and cannot be rewritten. Cap changes, deadline extensions and uses of the surplus wait through a public period; they go ahead unless households veto them. After the deadline, money can only go to the charter's surplus purpose (e.g. long-term recovery of the same villages). Emergencies need a stricter committee threshold, may only move cap between charter purposes and apply at once; households review them afterwards, and a veto returns the unspent part and revokes the emergency path for that fund. The fund never forces spending at the deadline. | `ReliefFund`, `KeptFactory` |
| **Voice** | The same credential that lets a household receive aid gives it **one anonymous vote** (Semaphore) on changes, a public **appeal** when it is left out, and a weekly anonymous **"still waiting"** report. Appeal counts, handling times and waiting reports are public per village; the waiting count does not depend on any custodian recording anything. | `VoiceModule`, `EligibilityRegistry` |

**What "enforced" means, phase by phase.** For money held by the contract (the demo's token, and later a regulated NT$ stablecoin), the charter is enforced: an allocation outside it reverts. In phase 1, while donations stay in bank accounts, the contract enforces the charter on the public record only: nothing outside it can be recorded as an allocation, and the record cannot be rewritten afterwards. It cannot stop a custodian from paying out of the bank off the record; Kept makes that harder to hide, not impossible (see Known limitations).

**Accountability alerts.** The dashboard applies simple published rules to the public record (tranches not acknowledged within 14 days, money held over 90 days, disputes, heavy proxy use, appeals waiting over 14 days, households saying they are waiting while the township reports nothing). They show where to look, not who is to blame.

**Never on-chain:** names, ID numbers, bank accounts, rosters. Only commitments, hashes and Merkle roots. Eligibility is still decided by people; Kept makes their decisions attributable.

**Borrowed, not reinvented:** Semaphore v4 (PSE), OpenZeppelin contracts and Merkle trees. Prior art we build on: WFP Building Blocks, Spanish Red Cross RedChain, "Not Yet Another Digital ID" (IEEE S&P 2023).

## Real data: Guangfu 2025 replayed

The app's **Guangfu, real data** page shows the relief foundation's actual disclosure (48 transfers, transcribed from its published images; they add up exactly to the stated NT$1,209,049,669). 21 pre-allocations make up 98.8% of the money paid out, 93% went to one ministry, and the household estimate in the foundation's own records moved from 1,837 to 4,039. It also shows what Kept would cost at that scale, from gas measured with the real zero-knowledge verifier: about 4.7 billion gas, roughly US$140–1,400 at assumed L2 prices, at most 0.003% of the money raised.

## Repository

```
contracts/   Foundry project: 6 contracts (+ a mock NT$ token), unit tests, deploy script, e2e script with real ZK proofs
web/         Next.js app: public dashboard + screens for each role
```

## Run it locally

Requirements: Node 20+, [Foundry](https://getfoundry.sh).

```bash
# 1. contracts
cd contracts
npm install
forge test                 # 62 unit tests
anvil                      # in a separate terminal
npm run deploy:local       # deploys Poseidon, Semaphore and Kept to the local chain
npm run e2e                # optional: end-to-end run with real Semaphore proofs

# 2. web app
cd ../web
npm install
npm run dev                # http://localhost:3000
```

Then open **Setup → Set up scenario** to create the simulated disaster, fund, 20 households, appeals and a partly delivered custody chain.

### Demo walkthrough

The order follows the story: what the public sees today, then reconciliation, then the promises.

1. **Guangfu, real data** — the foundation's real disclosure: 98.8% of what was paid out was pre-allocated, and the trail stops after the first hand.
2. **Public dashboard** — the simulated fund. *Accountability alerts* already flag a disputed payment and two villages where verified households say they are still waiting.
3. **Household** — create a credential; press *Simulate: chief scans this code*.
4. **Village & township** — as the Nanfu chief, propose the registration; switch to the township office and approve it (two signatures).
5. **Custodians** — as the ministry, commit a payment roster that includes the new household. **Household** — the line is checked against the on-chain root; say *I received it* or *I did not receive it*. This is the reconciliation evidence the custodian gets.
6. **NGO counter** — on the household screen, *Show code at the counter* makes a zero-knowledge proof; the NGO verifies it without any roster. Showing the same code again is rejected.
7. **Fund committee** — try to allocate to *General public works*: the contract refuses. Propose a cap change and approve it with a second member: it enters the public waiting period. Vote *No* as the household; *Demo: 3 neighbours vote no* casts real proofs from simulated households; skip the waiting period (devnet) and *Execute*: the change is **vetoed**.
   Optional: tick *Emergency* for a cap move — it applies at once; three *No* votes and *Settle household review* return the unspent part and revoke the emergency path. *Use the surplus* only opens after the deadline (*Devnet: jump past the deadline*).
8. **Public dashboard** — everything above is visible; download the open data as JSON.

## Demo mode — what is simulated

- Institutional signing keys (township office, committee, ministry, NGO…) are held by the demo server (`/api/tx`, allow-listed per role). In production each institution signs with its own wallet.
- Creating disasters, issuers and funds is not exposed through the demo API; only the server's seed does it. The dashboard shows the latest fund of the demo custodian, so a fund created by anyone else through the open factory does not replace it. *Setup → Start a fresh scenario* creates a new disaster and fund, at most once every 15 minutes.
- A relayer pays gas for households; they never need crypto.
- "Scanning a QR code" between devices is simulated through the browser's local storage.
- `MockTWD` stands in for a regulated NT$ stablecoin. In phase 1 donations stay in bank accounts and Kept records commitments, decisions and custody; Taiwan's Virtual Asset Service Act (passed 2026-06-30) opens a path to on-chain NT$ later.

## Validation

- **What we have:** nine public statements and official records from seven stakeholder groups ([table above](#evidence-of-need-in-stakeholders-own-words)), and a replay of the relief foundation's real Guangfu transfer disclosure on Kept's custody ledger (institution-level public data; household-level data stays simulated).
- **What we do not have yet:** interviews with a relief custodian, an NGO, a social worker or affected households, and any field test with elders.
- **Plan for the mentoring period (27 Oct–25 Nov):** ask the organisers' mentors and partner NGOs to connect us with one custodian and one social worker for feedback, and test the household screens with older users.

## Known limitations

- In phase 1 the contract cannot stop a custodian from paying out of a bank account outside the charter, or from leaving payments unrecorded. Kept raises the cost of doing so (two-sided records, household signatures and disputes, households reporting that nothing reached them) but cannot prevent it until funds move on-chain.
- Registrations publish their village, damage tier and time on-chain. The dashboard hides counts under 5, but anyone reading the chain directly can see exact numbers for small villages. Moving the village to an off-chain mapping is planned.
- An issuer could register ghost households; Kept makes it attributable (issuer statistics, two signatures) rather than impossible.
- A household's receipt key is reused across rosters, so its confirmations can be linked to one pseudonym. Rotating keys per programme is an off-chain change planned next.
- Victims can veto changes but do not yet elect committee representatives. Votes are veto-only: a change that nobody vetoes goes ahead, and a veto needs a turnout quorum.
- Votes are anonymous but not receipt-free: a household could prove how it voted to someone pressuring it. MACI, which is receipt-free, is the planned upgrade.
- An emergency change applies before households review it. Money already paid out under it stays paid; the review can only return the unspent part and revoke the emergency path.

## License

MIT
