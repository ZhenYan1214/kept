# Blockchain Ecosystems for Social Impact: Positioning, Tooling, Funding (for "Web3 for Social Good Hackathon 2026")

Research date: 2026-10-14. Scope: Ethereum + L2s (Optimism, Base, Arbitrum, Scroll, zkSync), Celo, Stellar, Solana, Aptos, Sui, Polygon, NEAR, Algorand, Cardano, Hedera, TON.
Method note: about 17 search/fetch calls. Primary sources were fetched where possible (stellar.org, celo.org, sui.io, overflow.sui.io, optimism.io). Many 2026 grant listings come up only on aggregators (grantedai.com, grantchain.eu, kucoin news), and these are flagged. Items marked **[prior knowledge, unverified this session]** come from background knowledge and were NOT confirmed with a fetched source. The report writer should treat them as unverified, or drop them.

---

## 1. Social-impact positioning, notable impact projects, and grant/accelerator programs per chain

### Takeaway
The chains with the clearest, documented social-impact positioning are **Celo**, **Stellar** and **Hedera**. Celo is mobile and stablecoin payments for emerging markets (MiniPay, Self ZK identity, Mento local stablecoins). Stellar is aid disbursement (UNHCR via Stellar Aid Assist, MoneyGram cash-out). Hedera is climate MRV (Guardian). Ethereum's public-goods funding pipeline changed a lot in 2026. Optimism Retro Funding is **paused for at least 12 months** (announced 8 Jan 2026). Gitcoin moved to a "3.0" domain-allocator model. EF ESP is active but focuses on core infrastructure and ZK, not end-user social apps. Several foundations (NEAR, Aptos, Cardano Catalyst) are shrinking or restructuring direct grants in 2026.

### Cited Findings

**Ethereum (L1) / Ethereum Foundation ESP**
- ESP announced $9.856M in Q1 2026 funding, focused on core infrastructure (cryptography, ZK proofs, security audits, protocol research). — [KuCoin News (aggregator)](https://www.kucoin.com/news/flash/ethereum-foundation-announces-9-85m-q1-2026-ecosystem-funding)
- ESP said Q2 2026 continued the focus on "ZK proofs, client diversity, formal verification, and open-source tooling". — [EF ESP on X](https://x.com/EF_ESP?lang=en)
- ESP has awarded more than $172M to more than 1,700 projects to date. — [EthDaily](https://ethdaily.io/ef-esp-pays-grants-in-eth)
- ESP runs on a rolling basis, through two pathways: Wishlist and RFPs. Grant sizes vary across aggregators ($5K–$50K in one; $10K–$500K, with small grants up to $30K, in another). Conflicting figures; check esp.ethereum.foundation. — [GrantChain guide](https://www.grantchain.eu/guides/how-to-apply-for-ethereum-foundation-esp); [GrantedAI listing](https://grantedai.com/grants/ethereum-foundation-ecosystem-support-program-esp-ethereum-foundation-2f04682c)
- EF PhD Fellowship 2026: $24,000 per Fellow over 1 year, 9–10 Fellowships, deadline 22 Apr 2026. — [ESP PhD Fellowship page](https://esp.ethereum.foundation/rounds/phdfp26)

**Gitcoin (Ethereum-wide public-goods funding, multi-chain)**
- GG24 was the first round of "Gitcoin 3.0". Its main QF window was Oct 2025, and it distributed more than $1.8M across six thematic domains in Oct–Nov 2025. It used a "Domain Allocator" model, and Grants Stack was sunset (QF moved to Giveth and other platforms). — [Gitcoin GG24 case study](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0)
- GG24 domains included Dev Tooling (QF on Giveth, $200K matching on Arbitrum), Interop (QF, $100K matching on **Celo**), Privacy (MACI), and Public Goods R&D (hypercerts). A governance post lists different budgets (Dev Tooling $600K, Privacy $150K), so the figures conflict. — [Gitcoin GG24 case study](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0); [Gitcoin GR1→GG24 post](https://gov.gitcoin.co/t/gitcoin-grants-rounds-gr1-gg24/25253)
- The GG24 Public Goods Tooling round (Oct 2025–Mar 2026) allocated $123,800 in total: $83,800 to 12 projects via conviction voting, plus $40,000 in retro funding. — [Gitcoin Governance retrospective](https://gov.gitcoin.co/t/gg24-public-goods-tooling-development-round-full-retrospective/25276)

**Optimism (OP Stack / Superchain, which includes Base and Celo)**
- **Retro Funding is paused.** The Season 9 post (dated 8 Jan 2026) says: "The Retro Funding program will not run for at least the next 12 months." The Foundation may re-allocate "all or a portion of the tokens reserved for Retro Funding (~775M OP)". It still states: "Public goods remain core to Optimism's vision", and the OP Stack is called "the core public good". It proposes a buyback using 50% of Superchain revenue. These are proposals, subject to governance. — [Optimism blog, Season 9](https://optimism.io/blog/season-9-from-experiment-to-organization)
- Retro Funding distributed 60M+ OP (Atlas cites 70M OP). In 2025, rounds were replaced by continuously measured missions (Dev Tooling, Onchain Builders). **Atlas is discontinued as of 18 Sep 2026.** — [Optimism Atlas](https://atlas.optimism.io/) (via search summary); [Cointelegraph (older, the $3B set-aside)](https://cointelegraph.com/news/optimism-3-billion-public-good-retro-funding-grants)

**Celo (Ethereum L2 on OP Stack)**
- Celo is positioned as a "fast, low-cost Ethereum L2" for payments and stablecoins. — [celo.org/builders](https://celo.org/builders)
- Live builder programs listed on the official page (fetched Oct 2026):
  - **Proof of Ship**: monthly rewards for early builders, 30k cUSD + 100k CELO pool, run by Celo DevRel.
  - **Support Streams**: user incentive budgets for live protocols, 150k CELO + 150k OP, run by Celo Public Goods.
  - **Prezenti Growth Grants**: milestone-based, $25–50k.
  - **Celo Builders Fund**: $25k investment.

  — [celo.org/builders](https://celo.org/builders)
- Ecosystem stats on the official page: 5,643 builders, 662 OSS developers, 39 live Mini Apps, **183 apps building with Self ZK Identity**, and $500k+ in builder rewards distributed. — [celo.org/builders](https://celo.org/builders)
- Mento offers "25+ local digital currencies" (local stablecoins for FX and payments). — [celo.org/builders](https://celo.org/builders)
- Celo Public Goods: the 2024 cycle budget was 1.6M cUSD + 700K CELO (Feb–Jul 2024), distributed by elected Public Goods Stewards (dated). A 2026 "Celo Public Goods Round" ($2K–$25K) appears only on an aggregator, with no deadline. — [GrantedAI listing](https://grantedai.com/grants/celo-public-goods-round-celo-8e3f866e)
- MiniPay (Opera): MiniPay Card launched June 2026 with Gnosis Pay + Visa on Celo. CELO was added to MiniPay in April 2026, reaching "14M+" users. Another source says 11M wallets and 840K DAU (Apr 2026), so the user figures conflict. In March 2026, Celo governance considered replacing its quarterly USD grant to Opera with a one-time 160M CELO grant over 3 years (outcome not confirmed). — [The Block](https://www.theblock.co/post/394367/celo-token-grant-opera); [Cryptowisser](https://www.cryptowisser.com/news/celo-is-now-available-on-minipay)

**Stellar**
- Stellar positions itself for aid through the **Stellar Disbursement Platform (SDP)**: "Bulk stablecoin payments via API with built-in recipient registration and compliance controls". It also has claimable balances and freeze/clawback. — [stellar.org/use-cases/stellar-for-aid](https://stellar.org/use-cases/stellar-for-aid)
- **UNHCR Ukraine via Stellar Aid Assist**: "$4.6M to 2,500 households". Another figure on the same page says "Nearly $5M … 2,500+ households", with same-day recipient access. No date is given. — [stellar.org aid page](https://stellar.org/use-cases/stellar-for-aid)
- **GIZ**: payroll for Syrian healthcare workers moved from 2–3 month delays to on-time delivery, saving €400K per year in fees. **Airtm** serves 250K+ recipients. — [stellar.org aid page](https://stellar.org/use-cases/stellar-for-aid)
- Cash-out: USDC to local cash at MoneyGram in 170+ countries, 475K+ locations, no bank account needed. Fees are "sub-cent" (Allium report, Mar 2026). — [stellar.org aid page](https://stellar.org/use-cases/stellar-for-aid)
- **Stellar Community Fund (SCF)**: up to $150K in XLM across 3 award tracks. SCF #45 had a deadline of 16 Aug 2026, and **SCF #46 submissions are due 8 Nov 2026**. A tranche timegating policy was added in July 2026. — [communityfund.stellar.org](https://communityfund.stellar.org/); [SCF awards](https://communityfund.stellar.org/awards); [SCF Handbook](https://stellar.gitbook.io/scf-handbook)

**Solana**
- Solana Foundation grants have two tracks. **Standard grants** fund non-commercial public goods (things that "make it easier to build and develop on Solana" and that are reusable). **Convertible grants** fund projects with a commercial angle. — [solana.com news](https://solana.com/news/solana-foundation-convertible-grants-investments)
- The average public-good / open-source grant check is about $40K, per a Foundation statement. Grants are rolling. — [Coinpaper](https://coinpaper.com/15701/solana-foundation-defends-builder-support-as-ecosystem-growth-faces-scrutiny)
- No 2026-dated Solana social-impact grant round was found.

**Aptos**
- Aptos Foundation tokenomics proposal (8 Oct 2026): cut staking rewards to 2.6%, hard cap of 2.1B APT. Foundation grant distributions will **decrease >50% YoY from 2026 to 2027**, and future grants will vest on milestones tied to "Aptos' role as the global trading engine". This suggests trading/DeFi focus, not social impact. — [Aptos Network, tokenomics update](https://aptosnetwork.com/currents/aptos-tokenomics-update)
- Historical: Phase 1 grants were $3.5M to 50+ projects (dated). An aggregator lists an Aptos Payments Grant up to $150K (unverified). — [Aptos Grants Phase 1](https://aptosnetwork.com/currents/aptos-grants-phase-1); [GrantedAI Aptos Payments Grant](https://grantedai.com/grants/aptos-payments-grant-aptos-network-64bc68a9)

**Sui**
- Official programs page (fetched Oct 2026):
  - **Hydropower accelerator** (no upfront equity).
  - **Academic Research Awards** ($25k).
  - **RFPs** (sui.io/request-for-proposals).
  - Direct investment.

  No social-impact track is listed. — [sui.io/programs-funding](https://www.sui.io/programs-funding)
- **Sui Overflow 2026** (May–Aug 2026):
  - Core tracks: Agentic Web, DeFi & Payments, Infra & DevX.
  - Specialized tracks: Walrus, DeepBook, EVE, ONE Championship.
  - Core 1st prize is $30K.
  - **University Award: $2,500 to 10 university teams**.
  - No social-impact track.
  - Totals conflict on the page itself ("Over $1,000,000" vs "$500K+").
  - A Sui Foundation post says 16 winners plus 10 University Awards were announced.

  — [overflow.sui.io](https://overflow.sui.io/); [Sui grant recipients blog](https://www.sui.io/blog/mar-apr-grant-recipients)

**Polygon**
- No 2026 Polygon Community Grants or social-impact program information was found in searches (see Gaps).

**NEAR**
- In 2026 the NEAR Foundation **paused temporary grants** while House of Stake works toward independence. Operational costs move to House of Stake from April 2026. A co-founder's proposal (3 Aug 2026) would create a ~30M NEAR sovereign fund; it is only a proposal. — [NEAR Forum, HoS funding](https://gov.near.org/t/hos-funding-proposals-in-dec-2025-q1-2026/41864); [NEAR Forum, withdrawn HSP](https://gov.near.org/t/withdrawn-hsp-xxx-establish-house-of-stake-operational-proposal-co-funding-budget-for-2026/42148/10); [Crypto Briefing](https://cryptobriefing.com/near-sovereign-fund-proposal/)

**Algorand**
- 2026 materials focus on network metrics and governance:
  - 49.88M wallets and 3.47B cumulative transactions (Feb 2026 report).
  - HQ moved back to Delaware from Singapore (announced 14 Jan 2026).
  - Post-quantum roadmap (June 2026), with milestones starting Q3 2026.
  - "AI dev tools" and an agentic-commerce focus; a February 2026 masterclass drew 500+ builders.

  No 2026 impact-grant totals were found. — [Algorand Feb 2026 Insights](https://algorand.co/blog/february-2026-algo-insights-report); [Algorand PQ roadmap](https://algorand.co/blog/algorand-foundation-announces-post-quantum-security-roadmap-targets-broad-quantum-resilience-by-2027); [Genfinity, Feb 2026 update](https://genfinity.io/2026/03/03/algorand-february-2026-ecosystem-update/)

**Cardano (Project Catalyst)**
- Fund 14 (voting closed 6 Oct 2025): the Cardano Foundation reviewed 158 Partners & Products proposals (₳53.6M requested) and shortlisted 23. It backed traceable carbon-credit and tokenized CO₂ projects. — [Cardano Foundation F14 selection PDF](https://cardanofoundation.org/foundation-catalyst-f14-selection.pdf); [CF blog F14 results](https://cardanofoundation.org/blog/project-catalyst-f14-results)
- Fund 14 status: 57 complete, 59 in progress, 12 did not finish. — [projectcatalyst.io/funds/14](https://projectcatalyst.io/funds/14)
- In February 2026, IOG and the Cardano Foundation agreed the Foundation takes over Catalyst stewardship. **Fund15/Fund16 did not go ahead in their planned form.** This is only in a glossary page, so verify it. — [cardano.org glossary](https://cardano.org/glossary/project-catalyst/)

**Hedera**
- **Hedera Guardian** is an open-source workflow engine for climate accounting and MRV. It is the reference implementation of the IWA Voluntary Ecological Markets standards. — [Hedera blog, sustainable building blocks](https://hedera.com/blog/sustainable-building-blocks-pt-ii)
- The HBAR Foundation Sustainable Impact Fund targets carbon MRV, and Guardian usage is its key metric. HBAR Foundation gave $16M across 68 grants in 2023 (all sectors; dated). — [Flowcarbon / HBAR Foundation](https://www.flowcarbon.com/knowcarbon/flowcarbon-partners-with-the-hbar-foundation); [The TIE recap](https://www.thetie.io/insights/recap-hedera-q1-2024-state-of-the-ecosystem)
- Reported 2026 developments, from secondary sources only:
  - BCarbon (Rice University Baker Institute registry) migrated 2M+ credits to Hedera (Feb 2026).
  - Gold Standard + ATEC issued eCook Bangladesh cookstove credits via IoT digital MRV on Guardian (Mar 2026).
  - Verra announced a collaboration to connect Guardian to Verra Project Hub.

  — [Ryder HBAR explainer](https://ryder.id/blogs/post/hbar-explained-hedera-and-the-enterprise-blockchain-bet); [OneKey Hedera sustainability](https://onekey.so/blog/ecosystem/hederas-environmental-sustainability-edge-why-it-matters)

**TON**
- TON Pay (announced 9 Feb 2026) brings native crypto payments into Telegram Mini Apps. The roadmap includes subscriptions and gasless transactions. — [Ryder TON 2026 explainer](https://ryder.id/blogs/post/ton-toncoin-in-2026-telegrams-blockchain-explained)
- TON pitches native USDT and Telegram reach for emerging markets and the unbanked; this is mostly analyst framing. — [Cointelegraph](https://cointelegraph.com/news/new-telegram-mini-apps-convenient-users-crypto); [Alea Research](https://alearesearch.io/reports/theses/ton)
- No official 2026 TON grants program was found.

### Inferences
- For a social-good hackathon pitch, Celo, Stellar and Hedera have the most "ready-made narrative" and real deployments to cite (UNHCR, GIZ, MiniPay, Gold Standard/Verra).
- Post-hackathon funding for a student team is most realistic via:
  - **Celo Proof of Ship**: monthly, low bar, designed for early builders.
  - **Stellar SCF**: the next deadline after this hackathon is SCF #46, 8 Nov 2026; check for #47.
  - **Gitcoin domain rounds**.

  EF ESP and Optimism are poor fits in 2026. ESP focuses on infra/ZK, and Optimism Retro Funding is paused.
- The hackathon's host GSR Foundation and the allowed list (Ethereum/EVM, Solana, Aptos, Sui) suggest judges are chain-agnostic. Choosing an EVM L2 keeps the widest optionality.

### Gaps
- Polygon, Arbitrum, Base, Scroll and zkSync 2026 social-impact grant programs: none found in searches. Arbitrum hosted the GG24 Dev Tooling matching only.
- The 2026 TON Foundation grant program, and whether TON's coin was renamed (a single unverified claim).
- The NEAR, Algorand and Aptos social-impact-specific programs for 2026: none found. All three appear to be cutting or retargeting grants.
- The Solana Foundation's 2026 public-goods RFPs and any Solana humanitarian deployments.
- The outcome of the Celo–Opera 160M CELO proposal.
- The current Celo Public Goods round terms (official page not fetched).

---

## 2. Developer experience for beginners (language, scaffolds, embedded wallets/AA/passkeys/zkLogin, gas sponsorship, AI coding)

### Takeaway
An EVM chain (Celo or Base, both OP Stack L2s) with **Scaffold-ETH 2** (or the Base fork **Scaffold-Base**, which has passkey 4337 wallets) gives a beginner team the shortest path. The reasons are Solidity's huge corpus, burner wallets, hot reload, and the largest developer base. **Sui** is the strongest non-EVM option for non-crypto users, because zkLogin plus sponsored transactions give a Web2-like login with no gas. The cost is learning Move.

### Cited Findings
- **Scaffold-ETH 2**: Next.js + Hardhat or Foundry. It has wallet hooks, hot contract reload, a local faucet, a burner wallet, and extension modules. It is listed on ethereum.org's developer tools. — [docs.scaffoldeth.io](https://docs.scaffoldeth.io/); [ethereum.org SE-2](https://ethereum.org/developers/tools/scaffold-eth-2/); [GitHub se-2](https://github.com/scaffold-eth/se-2)
- **Scaffold-Base** (a fork of SE-2) has native Base/Base Sepolia support, faucets, and a preconfigured Coinbase SDK wallet enabling **ERC-4337 account abstraction with passkeys**. — [BuidlGuidl scaffold-base README](https://github.com/BuidlGuidl/scaffold-base/blob/main/README.md)
- **thirdweb** is a "platform layer": SDKs, prebuilt contracts, UI components and deployment tooling, so it is more batteries-included than SE-2. This is a third-party opinion. — [Startupik comparison](https://startupik.com/scaffold-eth-vs-thirdweb-which-tool-is-better-for-rapid-web3-development/)
- An SE-2 "agent skill" is published on skills.sh, which suggests AI-assistant integration for SE-2. — [skills.sh scaffold-eth-2](https://www.skills.sh/justaname-id/cryptoskills/scaffold-eth-2)
- **Celo** offers "plug-and-play templates and AI tools built for first-time builders" and an "agent skills" link for bots. — [celo.org/builders](https://celo.org/builders)
- **Solana**: `create-solana-dapp` is the official "fastest way to create Solana apps", with a separate templates repo. — [Solana Foundation GitHub](https://github.com/solana-foundation)
- **Sui**: sponsored transactions allow gasless UX, and "paired together, zkLogin and sponsored transactions enable a fully Web 2.0 experience". In Q1 2025, 23.4% of Sui transactions were sponsored (dated). Examples include SongBits (Enoki + zkLogin), Gifted.art (zkLogin via email/social), and Super-B. — [Grayscale Research on Sui](https://research.grayscale.com/reports/built-for-scale-why-sui-stands-out); [Messari State of Sui Q1 2025](https://messari.io/report/state-of-sui-q1-2025); [Sui grant recipients May–Jul](https://www.sui.io/blog/may-june-july-grant-recipients)
- **Algorand** emphasizes "AI dev tools" in its Feb 2026 update. — [Genfinity](https://genfinity.io/2026/03/03/algorand-february-2026-ecosystem-update/)
- **Developer base (Electric Capital, Jan–Sep 2025)**: Ethereum (L1 + L2s) added about 16,000 new developers, with about 31,869 active. Solana added about 11,500 new developers. The Solana Foundation disputes undercounting (~7,800 missing). Solana led new-dev growth in 2024 (7,625 new, +83%). — [Forklog](https://forklog.com/en/ethereum-surpasses-solana-and-bitcoin-in-attracting-new-developers/); [CryptoRank](https://cryptorank.io/news/feed/7272c-16000-developers-join-ethereum-in-9-months); [The Block (2024 report)](https://mta-sts.theblock.co/post/330627/electric-capital-report-shows-solana-as-the-top-ecosystem-for-new-developers-in-2024)
- **Languages, embedded wallets and paymasters [prior knowledge, unverified this session]**:
  - Languages: Solidity on all EVM chains (Ethereum L2s, Celo, Polygon, plus Hedera's EVM-compatible Smart Contract Service); Rust (Anchor) on Solana; Move on Aptos and Sui; Rust/JS on NEAR; Python/TypeScript (Algorand Python/AlgoKit) on Algorand; Plutus/Aiken on Cardano; Rust (Soroban) on Stellar; FunC/Tact/Tolk on TON.
  - Aptos has "Keyless" (OIDC login, similar to zkLogin) and fee-payer transactions.
  - Embedded-wallet providers (Privy, Dynamic, Coinbase CDP, thirdweb in-app wallets, Web3Auth) and ERC-4337 paymasters (Pimlico, Alchemy, Coinbase Paymaster) are widely available on EVM L2s.

### Inferences
- **AI "vibe coding" friendliness**: Solidity/EVM has by far the most training data and examples, consistent with the largest developer base (Electric Capital). That makes AI-assisted coding most reliable on EVM. Move (Aptos/Sui) and Soroban are newer, smaller corpora, so expect more AI hallucination of APIs.
- For a 10-day beginner team, the best choice is EVM (Solidity) + SE-2 or thirdweb + an embedded wallet or passkeys + a paymaster on a cheap L2 (Celo/Base). Celo's extra advantage is MiniPay distribution plus Self ZK identity for social-good demos.
- Sui is the best "wow" UX (zkLogin with Google login, gasless). It is a reasonable second choice if a team member already knows Rust-like languages.

### Gaps
- No current (2026) official docs were fetched for Coinbase embedded wallets, thirdweb in-app wallets, Aptos Keyless, Sui zkLogin or Enoki pricing, or create-solana-dapp templates. Sponsorship limits and free tiers are unverified.
- There is no objective benchmark of AI coding accuracy per smart-contract language.
- No Electric Capital full-year 2025 figures for Aptos, Sui, Celo, Stellar or others were retrieved.

---

## 3. Cost and UX for users in developing regions (fees, stablecoins, on-ramps, mobile wallets)

### Takeaway
**Celo/MiniPay** (stablecoins inside the Opera browser, 11–14M wallets, a Visa card from June 2026, 25+ Mento local stablecoins) and **Stellar** (USDC cash-out at 475K+ MoneyGram locations in 170+ countries, sub-cent fees) are the strongest documented options for last-mile users in developing regions. **TON** has Telegram distribution and native USDT, but less documented humanitarian use.

### Cited Findings
- MiniPay: Opera's stablecoin wallet on Celo, with "14M+" users (Apr 2026); another source says 11M wallets and 840K DAU. The MiniPay Card (Gnosis Pay + Visa) launched June 2026. — [Cryptowisser](https://www.cryptowisser.com/news/celo-is-now-available-on-minipay); [The Block](https://www.theblock.co/post/394367/celo-token-grant-opera)
- Celo has 39 live MiniPay "Mini Apps". Mento offers 25+ local digital currencies. — [celo.org/builders](https://celo.org/builders)
- Stellar:
  - USDC cash-out at MoneyGram in 170+ countries and 475K+ locations, with no bank account needed.
  - "Sub-cent" fees (Allium, Mar 2026).
  - SDP built-in recipient registration and compliance.
  - Funds are held in a hard-currency stablecoin until the recipient chooses to cash out in local currency.

  — [stellar.org aid page](https://stellar.org/use-cases/stellar-for-aid)
- TON:
  - Native USDT, which removes the need for local payment gateways (TON Foundation investments director).
  - TON Pay in Mini Apps (Feb 2026).
  - Targets 30% of Telegram MAU (~450M) by 2028.

  — [Cointelegraph](https://cointelegraph.com/news/new-telegram-mini-apps-convenient-users-crypto); [Ryder](https://ryder.id/blogs/post/ton-toncoin-in-2026-telegrams-blockchain-explained)
- Algorand has 49.88M total wallets (Feb 2026). — [Algorand Insights Feb 2026](https://algorand.co/blog/february-2026-algo-insights-report)

### Inferences
- For aid disbursement to the unbanked, Stellar's cash-out network is the decisive feature. No other chain in scope documented an equivalent physical cash-out network.
- For consumer micro-payments or donations in Africa/LatAm, Celo + MiniPay is the best fit (a phone-native wallet with stablecoins).
- Any of the major L2s and Solana have sub-cent fees, so fees are not a differentiator among them in 2026. **[prior knowledge, unverified this session]**

### Gaps
- No fetched, dated fee comparisons (Base, Arbitrum, Solana, Sui, Aptos, Polygon median fee in 2026).
- Native USDC/USDT availability per chain in 2026 was not verified (e.g., USDC native on Base, Arbitrum, OP, Solana, Stellar, Sui, Aptos, Polygon, Celo, Algorand, Hedera, NEAR **[prior knowledge, unverified this session]**).
- Fiat on-ramp coverage (MoonPay, Transak, Yellow Card) by country and chain was not researched.

---

## 4. 2025–2026 news on these ecosystems' social good / public goods initiatives

### Takeaway
2026 is a year of **retrenchment and restructuring** in crypto public-goods funding:
- Optimism Retro Funding paused (Jan 2026).
- NEAR grants paused.
- Aptos grants cut >50% from 2026 to 2027.
- Cardano Catalyst F15/F16 disrupted.
- Gitcoin moved to the 3.0 domain model.

The counter-trend is real-world impact infrastructure in payments and climate: MiniPay Card, Stellar SDP and Allium data, and Hedera Guardian integrations with Gold Standard, Verra and BCarbon.

### Cited Findings
- **8 Jan 2026**: Optimism Season 9 pauses Retro Funding for ≥12 months; ~775M OP may be re-allocated. — [Optimism blog](https://optimism.io/blog/season-9-from-experiment-to-organization)
- **18 Sep 2026**: Optimism Atlas discontinued. — [Optimism Atlas](https://atlas.optimism.io/)
- **Oct 2025–Mar 2026**: Gitcoin GG24 (3.0), $1.8M+ across six domains, with matching pools on Arbitrum and Celo. — [Gitcoin](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0)
- **Q1 2026**: EF ESP gave $9.856M, focused on infrastructure. — [KuCoin News](https://www.kucoin.com/news/flash/ethereum-foundation-announces-9-85m-q1-2026-ecosystem-funding)
- **Feb 2026**: Cardano Catalyst stewardship moved to the Cardano Foundation; F15/F16 did not proceed as planned (needs verification). — [cardano.org glossary](https://cardano.org/glossary/project-catalyst/)
- **Feb–Mar 2026 (secondary sources)**: BCarbon migrated 2M+ credits to Hedera; Gold Standard cookstove credits were issued via Guardian dMRV. — [Ryder](https://ryder.id/blogs/post/hbar-explained-hedera-and-the-enterprise-blockchain-bet)
- **Mar 2026**: proposed Celo–Opera 160M CELO grant. **Apr 2026**: CELO added to MiniPay. **Jun 2026**: MiniPay Card launched. — [The Block](https://www.theblock.co/post/394367/celo-token-grant-opera); [Cryptowisser](https://www.cryptowisser.com/news/celo-is-now-available-on-minipay)
- **Feb 2026**: TON Pay launched. — [Ryder](https://ryder.id/blogs/post/ton-toncoin-in-2026-telegrams-blockchain-explained)
- **2026**: NEAR Foundation temporary grants paused. **Aug 2026**: NEAR sovereign fund proposal. — [NEAR Forum](https://gov.near.org/t/hos-funding-proposals-in-dec-2025-q1-2026/41864); [Crypto Briefing](https://cryptobriefing.com/near-sovereign-fund-proposal/)
- **8 Oct 2026**: Aptos tokenomics proposal, grants down >50% YoY into 2027. — [Aptos Network](https://aptosnetwork.com/currents/aptos-tokenomics-update)
- **May–Aug 2026**: Sui Overflow 2026, with a University Award of 10 × $2,500 and no social-impact track. — [overflow.sui.io](https://overflow.sui.io/)
- **Jul 2026**: Stellar SCF added tranche timegating. **SCF #46 deadline is 8 Nov 2026.** — [SCF Handbook](https://stellar.gitbook.io/scf-handbook); [SCF awards](https://communityfund.stellar.org/awards)

### Inferences
- Hackathon teams should not count on "retro" public-goods payouts in 2026. Milestone-based programs (Celo Prezenti/Proof of Ship, Stellar SCF) and hackathon prizes are the realistic follow-on funding.
- Climate MRV projects have unusually strong institutional rails on Hedera. That makes Hedera worth considering even though it is outside the "headline" allowed chains, since "other public chains" are permitted.

### Gaps
- No primary-source verification of the Hedera 2026 partner news (Verra, Gold Standard, BCarbon press releases were not fetched).
- No 2026 news found on Polygon, Base, Arbitrum, Scroll or zkSync social-impact initiatives.
- No CoinDesk or Blockworks coverage was retrieved on 2026 public-goods trends.

---

## 5. Recommendation matrix: chain × social-good use case, and the best choice for a beginner team with ~10 days

### Takeaway
**Default recommendation: build on Celo (EVM, OP Stack L2) using Solidity + Scaffold-ETH 2 (or thirdweb) + an embedded wallet or passkeys + gas sponsorship.** This gives the most AI-friendly language, the most beginner tooling, a social-impact narrative (MiniPay, stablecoins, Self ZK identity), and live small-grant follow-ons (Proof of Ship, Prezenti). Base, via Scaffold-Base passkeys, is the near-equivalent EVM alternative. The choice should switch to Stellar for cash-based aid disbursement, Hedera for climate MRV, and Sui if Web2-style login UX is the headline feature.

### Cited Findings (basis for matrix)
- Celo: payments and stablecoins L2, MiniPay, Self ZK identity (183 apps), Mento 25+ local stablecoins, Proof of Ship and Prezenti. — [celo.org/builders](https://celo.org/builders)
- Stellar: SDP bulk disbursement, UNHCR Aid Assist, MoneyGram cash-out, clawback/freeze compliance. — [stellar.org aid](https://stellar.org/use-cases/stellar-for-aid)
- Hedera: Guardian MRV workflow engine (IWA VEM standard). — [Hedera blog](https://hedera.com/blog/sustainable-building-blocks-pt-ii)
- Sui: zkLogin + sponsored transactions give a Web2 UX. — [Grayscale](https://research.grayscale.com/reports/built-for-scale-why-sui-stands-out)
- Gitcoin: QF and hypercerts tooling for donations and impact certificates; MACI for private voting. — [Gitcoin GG24](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0)
- Cardano Catalyst funded carbon-credit traceability (F14). — [CF F14 PDF](https://cardanofoundation.org/foundation-catalyst-f14-selection.pdf)
- SE-2 and Scaffold-Base tooling. — [docs.scaffoldeth.io](https://docs.scaffoldeth.io/); [scaffold-base](https://github.com/BuidlGuidl/scaffold-base/blob/main/README.md)

### Inferences — Recommendation matrix
Fit ratings: ★★★ = best, ★★ = good, ★ = possible.

| Use case | Best fit | Good alternatives | Why |
|---|---|---|---|
| Donations / transparent charity (QF, matching, impact certificates) | Celo or Base/OP (EVM) ★★★ | Arbitrum, Polygon ★★; Solana ★★ | Gitcoin QF and hypercerts are EVM-native, GG24 matching ran on Celo and Arbitrum, and stablecoin donations are cheap |
| Aid / cash disbursement to unbanked | Stellar ★★★ | Celo + MiniPay ★★ | SDP + MoneyGram cash-out (UNHCR, GIZ); Celo for phone-wallet recipients |
| Identity / proof-of-personhood / credentials | Celo (Self ZK identity) ★★★ | Sui (zkLogin) ★★; EVM + EAS ★★ | Self is used by 183 Celo apps; zkLogin removes wallet onboarding |
| Climate MRV / carbon credits | Hedera (Guardian) ★★★ | Celo ★★; Cardano ★ | Guardian is the IWA reference implementation with Gold Standard/Verra integrations (2026, secondary reports) |
| Governance / DAO / participatory budgeting | EVM L2 (Optimism/Base/Celo) ★★★ | Cardano ★ (Catalyst model); NEAR ★ | Mature DAO tooling on EVM; MACI private voting (Gitcoin) |
| Consumer micro-payments in emerging markets | Celo/MiniPay ★★★ | TON ★★; Stellar ★★ | Phone-native stablecoins; TON reaches Telegram users |
| "Web2-like" UX showcase (social login, gasless) | Sui ★★★ | Base + passkeys ★★★; Aptos Keyless ★★ | zkLogin + sponsored tx; Scaffold-Base passkey 4337 |

**Beginner-team, 10-day feasibility ranking (inference):**
1. **Celo / Base / other EVM L2s.** Solidity, SE-2 or thirdweb, the largest AI training corpus, the largest developer base (Electric Capital: ETH ~16K new devs in Jan–Sep 2025), and gas sponsorship plus passkeys are available.
2. **Stellar.** Strong aid narrative. Soroban (Rust) is harder, but the SDP and simple payment APIs can be used with little contract code.
3. **Sui.** Best onboarding UX (zkLogin), but Move has a learning curve and a smaller AI corpus.
4. **Solana.** Large ecosystem and create-solana-dapp, but Rust/Anchor is hard for beginners in 10 days.
5. **Aptos / Hedera / Algorand / others.** Viable in niche cases (Hedera for MRV), but they have fewer beginner templates and their 2026 grant programs are shrinking or unclear.

### Gaps
- The hackathon's own rules and judging criteria (sponsor tracks, preferred chains) were not retrieved, so they could change the recommendation.
- Rankings 2–5 rely partly on [prior knowledge, unverified this session] about language difficulty and tooling maturity.
