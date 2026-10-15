# Kept — disaster-relief promises you can verify

**A disaster fund makes two promises: to donors, about how the money will be used; to affected households, that no one will be left out. Kept makes both verifiable.**

Built for the *Web3 for Social Good Hackathon 2026* (SMU · GSR Foundation · University of Málaga), Tech Track.

> All households, amounts and decisions in the demo are **simulated**. Place names follow Guangfu Township, Hualien (Taiwan), where the Mataian River barrier lake overflowed on 2025-09-23.

## The problem, in one loop

Money is raised before a plan exists → the custodian keeps every record → victims have no voice → surpluses and delays → trust collapses and donations go elsewhere.

- **Haiti 2010:** US$488M raised, six permanent homes built ([ProPublica/NPR](https://www.propublica.org/article/how-the-red-cross-raised-half-a-billion-dollars-for-haiti-and-built-6-homes)).
- **Hualien 2024:** a county donation account of ~NT$790M still held ~NT$420M a year later; its committee met three times and had no victims on it ([PTS](https://news.pts.org.tw/article/744652)). The following year's allocation through the national relief foundation was under a fifth of the 2018 one ([PTS](https://news.pts.org.tw/article/695533)).
- **Guangfu 2025:** of NT$1.21bn paid out by the relief foundation (including pre-allocations), NT$49M had been reconciled by Sept 2026 ([disclosure](https://www.tf4dr.org/fundraising_plans/156/credits)). Pre-allocating and reconciling later is normal in an emergency; the point is that **nothing after the first hand is visible**.
- Victims have **no vote** anywhere; Hualien's rules let up to five attend committee meetings and speak only with the chair's permission ([rules](https://glrs.hl.gov.tw/glrsout/LawContent.aspx?id=GL001170)).
- Three villages outside the "red zone" were left off the first aid list and had to protest ([CNA](https://www.cna.com.tw/news/aloc/202510060164.aspx)).

The full, source-checked problem statement is on the app's **Why Kept** page.

## What Kept does

| Mechanism | What is enforced | Contract |
|---|---|---|
| **Commitment** | Purposes, caps and the surplus purpose are fixed when money is raised. Purposes outside the charter cannot be funded. Cap changes, deadline extensions and uses of the surplus wait through a public period; they go ahead unless households veto them. After the deadline, money can only go to the charter's surplus purpose (e.g. long-term recovery of the same villages). Emergencies need a stricter committee threshold, may only move cap between charter purposes and apply at once; households review them afterwards, and a veto returns the unspent part and revokes the emergency path for that fund. The fund never forces spending at the deadline. | `ReliefFund`, `KeptFactory` |
| **Custody** | Each tranche is recorded by the sender and acknowledged by the receiver, hand by hand. Payment rosters are committed as **Merkle roots**: the public sees totals, each household can prove it is counted and **sign** "received" or "not received" for its own line. Only receipt addresses registered with two signatures count, so a custodian cannot pad a roster with its own keys and confirm them. Proxies (e.g. a social worker for elders) are designated per village by the township office, and a household's own answer always replaces a proxy's. | `CustodyLedger`, `EligibilityRegistry` |
| **Voice** | The same credential that lets a household receive aid gives it **one anonymous vote** (Semaphore) on changes, and a public **appeal** when it is left out. Appeal counts and handling times are public per village. | `VoiceModule`, `EligibilityRegistry` |
| **Eligibility** | A household is verified only after **two signatures** (village chief + township office). NGOs check eligibility on the spot with a zero-knowledge proof, **without receiving any roster**; per-programme nullifiers block double claims and prevent linking claims across programmes. | `EligibilityRegistry`, `AidPrograms` |

**Never on-chain:** names, ID numbers, bank accounts, rosters. Only commitments, hashes and Merkle roots. Eligibility is still decided by people; Kept makes their decisions attributable.

**Borrowed, not reinvented:** Semaphore v4 (PSE), OpenZeppelin contracts and Merkle trees. Prior art we build on: WFP Building Blocks, Spanish Red Cross RedChain, "Not Yet Another Digital ID" (IEEE S&P 2023).

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
forge test                 # 60 unit tests
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

1. **Household** — create a credential; press *Simulate: chief scans this code*.
2. **Village & township** — as the Nanfu chief, propose the registration; switch to the township office and approve it (two signatures).
3. **Household** — now verified. *Show code at the counter* generates a zero-knowledge proof in the browser.
4. **NGO counter** — verify and record the hand-over. Showing the same code again is rejected.
5. **Fund committee** — try to allocate to *General public works*: the contract refuses. Propose a cap change and approve it with a second member: it enters the public waiting period.
6. **Household** — vote *No*. On the committee screen, *Demo: 3 neighbours vote no* casts real proofs from simulated households; skip the waiting period (devnet) and *Execute*: the change is **vetoed**.
   Optional: tick *Emergency* for a cap move — it applies at once; three *No* votes and *Settle household review* return the unspent part and revoke the emergency path. *Use the surplus* only opens after the deadline (*Devnet: jump past the deadline*).
7. **Custodians** — as the ministry, commit a payment roster including the live household. **Household** — the line is checked against the on-chain root; confirm or dispute it.
8. **Public dashboard** — everything above is visible; download the open data as JSON.

## Demo mode — what is simulated

- Institutional signing keys (township office, committee, ministry, NGO…) are held by the demo server (`/api/tx`, allow-listed per role). In production each institution signs with its own wallet.
- A relayer pays gas for households; they never need crypto.
- "Scanning a QR code" between devices is simulated through the browser's local storage.
- `MockTWD` stands in for a regulated NT$ stablecoin. In phase 1 donations stay in bank accounts and Kept records commitments, decisions and custody; Taiwan's Virtual Asset Service Act (passed 2026-06-30) opens a path to on-chain NT$ later.

## Known limitations

- A custodian can still lie about off-chain bank transfers in phase 1; Kept raises the cost of doing so (two-sided records, household signatures, disputes) but cannot prevent it until funds move on-chain.
- An issuer could register ghost households; Kept makes it attributable (issuer statistics, two signatures) rather than impossible.
- A household's receipt key is reused across rosters, so its confirmations can be linked to one pseudonym. Rotating keys per programme is an off-chain change planned next.
- Victims can veto changes but do not yet elect committee representatives. Votes are veto-only: a change that nobody vetoes goes ahead, and a veto needs a turnout quorum.
- An emergency change applies before households review it. Money already paid out under it stays paid; the review can only return the unspent part and revoke the emergency path.

## License

MIT
