# AI + Web3 for Social Good, Academic Literature, and 2025–2026 Macro Trends (research notes, as of 2026-10-14)

Context: these notes are for brainstorming a project for the "Web3 for Social Good Hackathon 2026" (SMU, GSR Foundation, University of Málaga; theme "From Vision to Impact"; tags AI and Sustainability).
Source-quality legend: [P] = primary or peer-reviewed; [S] = secondary, vendor, or blog (treat figures as indicative); [K] = from the researcher's prior knowledge, URL given but page not re-fetched this session (verify before quoting).

---

## Q1. AI + Web3 for social good: agentic payments (x402, ERC-8004), AI-assisted grant allocation, content provenance, data DAOs, zkML, aid fraud, DePIN + AI

### Takeaway
The AI x crypto "agent stack" became real infrastructure in 2025–2026: x402 for HTTP-native stablecoin payments, now under a Linux Foundation x402 Foundation, plus ERC-8004 for agent identity and reputation on more than 20 chains. Usage is real but noisy, and Chainalysis says a large share was meme-coin farming. On the social-good side, the most mature AI+crypto mechanism is AI-assisted public-goods funding: Deep Funding, Gitcoin GG23/GG24, and Optimism's metric-driven Retro Funding. Content provenance (C2PA) and zkML are maturing, but each has documented limits that a hackathon team should design around rather than ignore.

### Cited Findings

**Agentic payments: x402**
- Chainalysis (published 3 Jun 2026) found that x402 agentic transactions on Base went from near zero in mid-2025 to "well over 100 million cumulative transactions through Q1 2026". The Q4 2025 surge was "driven in large part by meme coin activity, particularly PING" (PING rose more than 10,000% in a single week), and growth moderated in Q1 2026 as speculation cooled. [P] — [Chainalysis](https://www.chainalysis.com/blog/x402-agentic-payments-adoption/)
- Chainalysis on payment mix: transactions of $1 or more rose from 49% of x402 volume (early 2025) to 95% (early 2026), while transactions between 10 cents and $1 fell from 46% to 4%. Tester-to-payer conversion improved 4x in six months. x402 payers are younger wallets than the Base average (197 vs 423 days old). The article gives premium data feeds, sanctions screening, and credit-bureau queries as examples of agentic demand, but it does not quantify non-speculative use. [P] — [Chainalysis](https://www.chainalysis.com/blog/x402-agentic-payments-adoption/)
- Governance: the Linux Foundation launched the x402 Foundation on 2 Apr 2026, with Coinbase contributing the protocol. Secondary sources say it became operational in July 2026 with more than 40 members, including Visa, Mastercard, and Stripe. Cloudflare uses x402 for pay-per-crawl, and Visa's Trusted Agent Protocol is reported to build on x402. [S] — [Wikipedia: X402](https://en.wikipedia.org/wiki/X402); [agentlux](https://agentlux.ai/blog/the-agent-payment-stack-in-2026-x402-ap2-and-the-race-to-pay-agents); [bex.co](https://bex.co/blog/2026/04/01/x402-protocol-http-402-ai-agent-commerce-stablecoin-payments)
- Volume figures conflict. One secondary source says the x402 dashboard showed about 75M transactions and $24M volume over a trailing 30 days in mid-July 2026. Others cite 119M transactions on Base and 35M on Solana as of March 2026. These are unaudited; prefer the Chainalysis figures. [S] — [bex.co](https://bex.co/blog/2026/04/01/x402-protocol-http-402-ai-agent-commerce-stablecoin-payments); [futurehumanism](https://futurehumanism.co/articles/three-laws-agent-commerce-erc-8183-ribbita/)
- The IMF published Note 2026/004, "How Agentic AI Will Reshape Payments". It discusses ERC-8004-style registries as a way to decide which agents may act in machine-initiated payment flows. [P] — [IMF Note 2026/004 (PDF)](https://www.imf.org/-/media/files/publications/imf-notes/2026/english/insea2026004.pdf)

**Agent identity and reputation: ERC-8004**
- ERC-8004 ("Trustless Agents") defines on-chain Identity, Reputation, and Validation registries for AI agents, and it is designed to compose with x402. As of Oct 2026 the contracts repository lists deployments on Ethereum mainnet, Base, Arbitrum, Optimism, Polygon, and more than 20 other mainnets. [S] — [eco.com explainer](https://eco.com/support/en/articles/13221214-what-is-erc-8004-the-ethereum-standard-enabling-trustless-ai-agents); spec [K]: [EIP-8004](https://eips.ethereum.org/EIPS/eip-8004)
- Agent registrations are small next to payment counts. One tracker reported 1,563 ERC-8004 "Agent Passport" holders in Feb 2026. [S] — [PANews AgentFi report](https://panews.io/articles/019c9473-0a16-75cc-a061-6288f7ddb643)
- ETHGlobal sponsor tracks now reward agents with wallets directly. ETHGlobal Buenos Aires (Nov 2025) had a Circle prize for "an autonomous agent that uses Circle Wallets" to move USDC based on real-world data, with bonus points for x402. Agentic Ethereum had a Coinbase AgentKit pool prize and a Lit Protocol Agent Wallet prize. [P] — [ETHGlobal Buenos Aires prizes](https://ethglobal.com/events/buenosaires/prizes); [ETHGlobal Agents prizes](https://ethglobal.com/events/agents/prizes)

**AI for impact evaluation and grant allocation**
- Deep Funding, designed by Vitalik Buterin, asks "how much of the credit for outcome Y belongs to project X" across a dependency graph. An open market of AI models proposes weights, and a human jury spot-checks them. It launched with $250K seed funding from Buterin, and the Ethereum dependency graph has more than 40,000 edges. [P, self-reported] — [Gitcoin: Deep Funding mechanism](https://gitcoin.co/mechanisms/deep-funding); [DeepFunding app](https://gitcoin.co/apps/deepfunding); [visual guide](https://gitcoin.co/research/deep-funding-visual-guide)
- Gitcoin Grants 24 (GG24) distributed about $1.8M ($1.175M from Gitcoin, $632.5K from partners) through six mechanisms. In the $600K Ethereum Dev Tooling and Infrastructure domain, $350K was allocated by Deep Funding using Seer prediction markets, combined with quadratic funding. [P, self-reported] — [Gitcoin GG24 campaign](https://gitcoin.co/campaigns/gitcoin-grants-24-gg24); [Announcing GG24](https://gitcoin.co/blog/announcing-gitcoin-grants-24); [GR1→GG24 forum history](https://gov.gitcoin.co/t/gitcoin-grants-rounds-gr1-gg24/25253)
- In GG23's Predictive Funding Challenge, 11 models were submitted within 36 hours. The winning model's error score was 0.016, against about 0.04 for random prediction. [P] — [GG23 Predictive Funding Challenge Retrospective](https://gitcoin.co/case-studies/gg23-predictive-funding-challenge-retrospective)
- Optimism Retro Funding (2025, Season 7) moved to "evaluation algorithms" that badgeholders vote on. Each algorithm is a different philosophy for measuring impact. The Onchain Builders mission evaluated 187 projects using TVL, transactions, gas fees, and daily active addresses from Superchain traces and DefiLlama. Monthly rounds ran from Feb to Jul 2025. [P] — [OSO: Retro Funding S7 algorithms](https://docs.oso.xyz/blog/retro-funding-s7-release/); [Optimism forum: Evolution of Retro Funding in 2025](https://gov.optimism.io/t/the-evolution-of-retro-funding-in-2025/9414)
- Optimism has acknowledged that the program "still fails to reliably support important contributions" and that there is "insufficient evidence" that rewards caused significant ecosystem growth. This candid admission shows impact measurement is still unsolved. [P via summary] — [Optimism forum](https://gov.optimism.io/t/the-evolution-of-retro-funding-in-2025/9414)
- Hypercerts are on-chain impact claims that record who did what work, over what time period, and with what scope. In the GreenPill Hypercerts experiment, most donors chose based on familiar project-level information rather than structured impact claims, which is a UX and behavioral limitation. [P, self-reported] — [Gitcoin case study: GreenPill Hypercerts](https://gitcoin.co/case-studies/greenpill-hypercerts-experiment-impact-certificates-in-practice); [Protocol Labs: Hypercerts](https://pl.xyz/blog/hypercert-new-primitive/)
- Gitcoin research frames "AI agents and public goods" as an emerging agentic economy. [P, self-reported] — [Gitcoin research](https://gitcoin.co/research/ai-agents-and-public-goods-the-emerging-agentic-economy)
- Buterin's framing: "AI as the engine, humans as the steering wheel". Humans set direction with a few high-level decisions and an open market of AIs executes. This is the philosophy behind Deep Funding and "info finance". The phrase is confirmed in secondary coverage [S] — [Cryptopolitan](https://www.cryptopolitan.com/vitalik-buterin-skeptical-agentic-ai-models/). The original essays [K]: [vitalik.eth.limo "AI as the engine, humans as the steering wheel" (Feb 2025)](https://vitalik.eth.limo/general/2025/02/28/aihumans.html); [info finance (Nov 2024)](https://vitalik.eth.limo/general/2024/11/09/infofinance.html); [d/acc "My techno-optimism" (Nov 2023)](https://vitalik.eth.limo/general/2023/11/27/techno_optimist.html)

**Content provenance and deepfakes**
- C2PA Content Credentials do not use blockchain. The spec relies on hashing, Merkle trees, digital signatures, and X.509 certificates, the same trust model as HTTPS. [P] — [C2PA 2.4 Explainer](https://spec.c2pa.org/specifications/specifications/2.4/explainer/Explainer.html); [IPTC C2PA FAQ](https://iptc.org/std/guidelines/media-provenance/C2PA-FAQs/IPTC-C2PA-FAQs-v1.0-2027-07-08.pdf)
- Known C2PA limits: it does not judge whether content is true, credentials can be stripped, and a compromised device can sign false data. A 2026 arXiv paper argues the C2PA specifications fall short for verifying provenance. [P] — [arXiv 2604.24890 "Verifying Provenance of Digital Media: Why the C2PA Specifications Fall Short"](https://arxiv.org/html/2604.24890v1); [truescreen](https://truescreen.io/articles/c2pa-standard-history-limitations/)
- Regulatory driver: EU AI Act Article 50 transparency obligations (machine-readable marking of AI-generated content) apply from August 2026. [S] — [softwareseni](https://www.softwareseni.com/what-is-c2pa-and-how-does-content-provenance-infrastructure-work/)
- Story Protocol joined C2PA and announced a research collaboration with Stanford FDCI (around early 2025). Press claims that blockchain would be integrated into C2PA's core are not supported by the C2PA spec. [S] — [Blockmedia](https://www.eblockmedia.com/news/articleView.html?idxno=15131); [cointrust](https://www.cointrust.com/market-news/story-joins-c2pa-to-enhance-content-authentication-with-blockchain)
- Research direction: "The Birthmark Standard" (arXiv 2602.04933, 2026) proposes privacy-preserving photo authentication that combines hardware roots of trust with a consortium blockchain. A useful pattern is to anchor hashes or attestations on-chain while keeping media and identity off-chain. [P] — [arXiv 2602.04933](https://arxiv.org/pdf/2602.04933)
- "AI Identity: Standards, Gaps, and Research Directions for AI Agents" (arXiv 2604.23280, 2026) surveys agent identity standards. [P] — [arXiv 2604.23280](https://arxiv.org/pdf/2604.23280)

**Data ownership and data DAOs (Vana)**
- Vana mainnet launched on 16 Dec 2024 as an EVM L1 where users keep control of personal data used for AI training. Vana reports that its testnet had over 1.3M users contributing more than 6.5M data points to DataDAOs. Twelve DataDAOs were live at launch, and the top 16 receive protocol rewards every 21 days based on staking. Contributions are validated by "Proof of Contribution". These figures are self-reported in a press release. [S] — [Decrypt/Chainwire](https://decrypt.co/296830/vana-mainnet-goes-live-with-vana-to-power-data-as-a-new-asset-class-in-global-ai-economy); [Vana docs](https://docs.vana.org/docs/network-overview)
- An early Reddit DataDAO pooled users' Reddit data for sale to AI firms after a community vote, without Reddit's coordination. This raises consent and terms-of-service questions. [S] — [The Defiant](https://thedefiant.io/vana-launches-dao-allowing-users-to-control-and-sell-their-reddit-data)

**Verifiable AI (zkML / TEE)**
- "A Survey of Zero-Knowledge Proof Based Verifiable Machine Learning" (arXiv 2502.18535, 2025) covers verifiable training, testing, and inference from Jun 2017 to Aug 2025. It names the main bottlenecks as limited circuit expressiveness, high proving cost, and deployment complexity. [P] — [arXiv 2502.18535](https://arxiv.org/abs/2502.18535)
- "Verifiable evaluations of ML models using zkSNARKs" (arXiv 2402.02675) proves a model's benchmark score without revealing its weights. This fits auditing AI used for aid or credit decisions. [P] — [arXiv 2402.02675](https://arxiv.org/pdf/2402.02675)
- A 2026 attack paper, "Hollow-LLM" (arXiv 2607.28884), shows that zk verification of LLM inference can be gamed with computationally trivial weights. Proving "a model ran" is not the same as proving "the right model ran". [P] — [arXiv 2607.28884](https://arxiv.org/pdf/2607.28884)
- Practical state per ICME's 2025 guide: "we can prove inference, but we cannot prove training at scale". A hybrid approach is Optimistic TEE-Rollups (arXiv 2512.20176). [S/P] — [ICME guide](https://blog.icme.io/the-definitive-guide-to-zkml-2025/); [arXiv 2512.20176](https://arxiv.org/pdf/2512.20176)

**AI and blockchain for aid integrity and fraud**
- WFP Building Blocks (permissioned ledger, since 2017) is reported to have moved more than $760M across over 40M redemption transactions and reached about 6M people by 2025. A vendor blog claims it prevented about $270M of aid overlap or duplication in Ukraine by flagging duplicates across agencies; this is unverified. The anti-fraud value comes from cross-agency deduplication on a shared ledger, not from AI. [S] — [coincub](https://coincub.com/blog/humanitarian-blockchain-that-works/); [WFP USA](https://wfpusa.org/news/blockchain-tech-helps-refugees-grocery-shop-in-conflict-zones/)

**DePIN + AI**
- Messari 2026 theses (secondary summaries) expect DePIN to exceed $100M in on-chain verifiable revenue. They name vertical integration (e.g., Helium Mobile) and "DePAI", where DePIN collects real-world physical data for robotics and AI, as key models. A retrospective notes that only large DePINs such as Render and Helium did well while many small ones failed. [S] — [OneKey summary of Messari 2026](https://onekey.so/blog/ecosystem/messari-2026-research-trends-across-seven-crypto-sectors/); [PANews: 60 trends](https://www.panewslab.com/en/articles/6c84c1d8-e92f-480a-8371-20c315cf0257)

### Inferences
- The strongest hackathon fit for "AI + Web3 + social good" is an agent that holds a budget (stablecoin wallet), has an on-chain identity and reputation (ERC-8004), and pays for or receives verifiable data (x402). Humans set the goals, keeping the "steering wheel". Examples: an aid-disbursement agent with spending policies and transparent logs, or a climate-MRV agent that buys sensor data per call.
- AI-assisted allocation (Deep Funding style) is a credible social-good primitive because it addresses a scaling bottleneck funders have documented. A student project could apply the dependency-graph and jury pattern to a non-crypto domain, such as NGO or open-data contributions in Singapore or Málaga.
- For provenance, the defensible design is C2PA for media plus on-chain anchoring of attestation hashes and revocations. Teams should not claim that "blockchain detects deepfakes".
- Teams should treat zkML claims carefully. Proving the evaluation of a small model (e.g., an eligibility classifier) is feasible, while proving LLM inference is fragile (see Hollow-LLM).

### Gaps
- No independently verified count of non-speculative or social-good x402 transactions; Chainalysis gives only qualitative examples.
- No primary Optimism source confirming that AI scoring was used in 2025 Retro Funding. The claim appears only on Gitcoin's page.
- No 2025–2026 Vana usage or impact data beyond the Dec 2024 press release. No published per-project GG24 Deep Funding payouts were found (the GitHub repo is reportedly public).
- No rigorous source found on ML-based fraud detection inside WFP, UNHCR, or UNDP cash programmes.

---

## Q2. Academic literature: systematic reviews, landmark reports, frameworks, critiques

### Takeaway
The literature is large but thin on field evidence. Reviews consistently find many positive SDG linkages in theory (energy, supply chain, finance, identity), few rigorous impact evaluations, little theory, and non-trivial negative effects. The classic decision framework, Wüst & Gervais (2018), says blockchain is justified only when multiple mutually distrusting writers share state without a trusted third party. Judges with academic backgrounds will expect a team to pass this test explicitly.

### Cited Findings

**Landmark reports**
- Stanford GSB "Blockchain for Social Impact" (2019, led by Doug Galen, Center for Social Innovation) analyzed 193 organizations and initiatives, with 110 interviewed. 74% were still at the pilot or idea stage. 34% had started in 2017 or later. Only 20% provided a solution "not otherwise possible" without blockchain, while 86% were material improvements over existing solutions. Use cases were mostly records and verification (47.3%) and platforms and marketplaces (26.4%); smart contracting was 1.8%. 93.5% of executives said blockchain added value to their impact goals. [P via coverage] — [Stanford GSB Insights](https://gsb.stanford.edu/insights/can-blockchain-be-used-public-good); [Ledger Insights](https://www.ledgerinsights.com/stanford-blockchain-social-impact/); [NextBillion](https://nextbillion.net/news/report-93-of-execs-say-blockchain-helps-achieve-social-impact-goals); [PDF mirror](https://cms.lowimpact.org/wp-content/uploads/blockchain-social-impact.pdf)
- Note on the Stanford figures: the 93.5% value figure comes from organizations already using blockchain, so it is selection-biased. The 20% "not otherwise possible" figure is the more decision-relevant number.

**Decision frameworks**
- Wüst, K. & Gervais, A. (2018). "Do you Need a Blockchain?" Crypto Valley Conference on Blockchain Technology (CVCBT), pp. 45–54. The paper gives a structured methodology contrasting permissionless chains, permissioned chains, and a central database. It applies the method to supply chain, interbank payments, and DAOs. The decision tree asks whether state must be stored, whether there are multiple writers, whether all writers are trusted, and whether a trusted third party is available. [P] — [IACR ePrint 2017/375](https://eprint.iacr.org/2017/375); [UCL Discovery](https://discovery.ucl.ac.uk/id/eprint/10182342/); [ETH Zurich](https://syssec.ethz.ch/publications/2018-06-20-do-you-need-a-blockchain-20-500-11850-312301/); [doyouneedablockchain.com](http://doyouneedablockchain.com/)
- A domain variant: "Do you need a blockchain in construction? Use case categories and decision framework for DLT design options" (arXiv 2004.04626). [P] — [arXiv 2004.04626](https://arxiv.org/pdf/2004.04626)

**Systematic reviews on blockchain and the SDGs**
- Thanasi-Boçe, M. & Hoxha, J. (2025). "Blockchain for Sustainable Development: A Systematic Review". *Sustainability* 17(11):4848 (MDPI). PRISMA 2020 review of 131 articles from 2015–2025, organized by environmental, economic, and social pillars, using institutional and stakeholder theory. [P] — [MDPI](https://www.mdpi.com/2071-1050/17/11/4848)
- "A Tertiary Review on Blockchain and Sustainability With Focus on Sustainable Development Goals". *IEEE Access* (2022). A review of 42 literature reviews that found 76 positive and 10 negative linkages between blockchain and the 17 SDGs, plus 45 adoption drivers and barriers. [P] — [IEEE Xplore 9931107](https://ieeexplore.ieee.org/document/9931107/)
- Parmentola, A. et al. (2022). "Is blockchain able to enhance environmental sustainability? A systematic review and research agenda from the perspective of SDGs". *Business Strategy and the Environment* (Wiley). 195 studies from 2015–2020. It finds blockchain can support environmental SDGs but has "no negligible negative effects" on the environment. [P] — [Wiley](https://onlinelibrary.wiley.com/doi/abs/10.1002/bse.2882)
- "Blockchain for sustainability: A systematic literature review for policy impact". *Telecommunications Policy* (2023/24, Imperial College authors). It finds most papers lack a structured approach for applying blockchain under emerging regulation. [P] — [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0308596123001878); [Imperial Spiral](https://spiral.imperial.ac.uk/entities/publication/b59980d4-b653-4e43-8457-0d0b6d1c8194)
- "A systematic literature review of blockchain technology and environmental sustainability: Status quo and future research" (ScienceDirect, 2023). Focused on SDG 7 and SDG 13, it concludes no proposed remedy was sufficient to fix carbon-market problems. [P] — [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S105905602300254X)
- "Sustainable Development Goals and Blockchain: A Systematic Literature Review from a Business Studies Perspective" (ECIE conference). It identifies 14 research areas and 49 topics. [P] — [ECIE](https://papers.academic-conferences.org/index.php/ecie/article/view/2719)
- A 2026 *Frontiers in Blockchain* study used a GPT-4o classification pipeline on 306 EU public-sector blockchain use cases. They align strongly with SDG 9 and SDG 17, and weakly with SDG 2 (hunger), SDG 6 (water), and SDG 14 (oceans). This is an AI-for-meta-research example that reveals white space. [P] — [Frontiers in Blockchain 2026](https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2026.1768217/abstract)
- "Digital economy structuring for sustainable development: the role of blockchain and artificial intelligence in improving supply chain and reducing negative environmental impacts". *Scientific Reports* (Nature portfolio), 2024. [P] — [Nature Sci Rep](https://www.nature.com/articles/s41598-024-53760-3)
- "Use-cases of Blockchain Technology for Humanitarian Engineering" (arXiv 2012.01168, 2020). [P] — [arXiv](https://arxiv.org/pdf/2012.01168)

**Critiques (the "solutionism" line)**
- "Conjuring a Blockchain Pilot: Ignorance and Innovation in Humanitarian Aid" (*Geopolitics*, Taylor & Francis, 2024, DOI 10.1080/14650045.2024.2389284). It critiques the WFP Jordan pilot as built on narrow, donor-friendly success metrics, such as traceability and lower fees. The authors argue this created an "illusion of success" that sidelined refugees' own priorities, and that refugees could not correct false data entered into the system. [P, via summaries; full text returned 403] — [T&F](https://www.tandfonline.com/doi/full/10.1080/14650045.2024.2389284); [preprint PDF via ICTworks](https://www.ictworks.org/wp-content/uploads/2024/09/Conjuring-Blockchain-Pilot-Humanitarian-Aid.pdf); [ICTworks op-ed "Please Stop Conjuring Blockchain Pilots"](https://www.ictworks.org/conjuring-blockchain-pilots/)
- Wüst & Gervais motivate their paper by questioning the hype that blockchains will "revolutionize how society trades and interacts". The search did not find them using the word "solutionism", a term usually credited to Evgeny Morozov. [P] — [IACR ePrint 2017/375](https://eprint.iacr.org/2017/375)

**UN / multilateral**
- The UNDP SDG Blockchain Accelerator (Alternative Finance Lab, partnered with the Blockchain for Good Alliance and the Stellar Development Foundation) now explicitly covers "blockchain and decentralized AI solutions". For 82% of participating UNDP Country Offices it was their first blockchain experience. Staff reporting high understanding rose from 21% to 60%. [P] — [UNDP Eurasia: SDG Blockchain Accelerator 2025](https://innovation.eurasia.undp.org/sdg-blockchain-accelerator-driving-sdg-impact-in-2025/)

### Inferences
- An evidence-aware pitch should (1) state which of the 76 positive SDG linkages it targets, (2) show the Wüst–Gervais test result (multiple distrusting writers, no trusted third party), and (3) name a field-evaluable metric. That is exactly what the literature says is missing.
- Under-served SDGs per the Frontiers 2026 mapping (SDG 2, 6, 14: food, water, oceans) are white space where a project is less likely to duplicate past pilots.

### Gaps
- Could not find a 2025–2026 WEF, OECD, or ITU report specifically on "blockchain + AI for SDGs". Older WEF and OECD blockchain reports exist but were not retrieved this session.
- Did not locate a Stanford update after 2019 to the "Blockchain for Social Impact" report.
- No Nature or Science original-research paper on blockchain impact for the SDGs was found, only a *Scientific Reports* paper.

---

## Q3. Lessons from about 10 years of "blockchain for good" pilots: why most did not scale, and success factors

### Takeaway
Most pilots stalled because they were funded as short projects, optimized for donor-visible metrics, ignored last-mile infrastructure (cash-out, connectivity, legal status), and rarely published evaluations. The durable successes (WFP Building Blocks, UNHCR USDC on Stellar) hid the chain inside a modular end-to-end service. They used the ledger as a shared accounting and coordination layer among multiple agencies, kept personal data off-chain, and solved the off-ramp to local cash or mobile money.

### Cited Findings
- Stanford 2019: 74% of 193 initiatives were still at idea or pilot stage. [P] — [Ledger Insights](https://www.ledgerinsights.com/stanford-blockchain-social-impact/)
- A cross-institutional analysis of blockchain cash and voucher assistance (*International Journal of Disaster Risk Reduction*, ScienceDirect, 2023) recommends context-adaptable solutions, field-capacity investment, and participatory, community-based design. Field-based evaluations are named as a key knowledge gap. [P] — [ScienceDirect S221242092300609X](https://www.sciencedirect.com/science/article/pii/S221242092300609X)
- Humanitarian Supply Blockchain pilot (*International Journal of Operations & Production Management* 41(9):1522, 2021). The scarcity of public lessons-learned documentation shaped how participants perceived scalability risk. [P] — [Emerald IJOPM](https://www.emerald.com/ijopm/article/41/9/1522/146970/Exploring-the-application-of-blockchain-to)
- The Humanitarian Advisory Group review of 43 use cases found many articles and whitepapers about potential benefits but no in-practice analysis. Time-limited, project-based funding rarely becomes a long-term solution. [S] — [Humanitarian Advisory Group](https://humanitarianadvisorygroup.org/blockchain-for-social-impact-in-aid-and-development/)
- Infrastructure constraints: cash-based blockchain transfers work only where markets are accessible, and crisis areas lack connectivity and power. Crypto's legal status varies by country. [S] — [academia.edu review](https://www.academia.edu/122571496/Blockchain_for_social_good_A_review_of_applications_in_humanitarian_aid_and_social_initiatives)
- The 2026 analysis "The Humanitarian Blockchain That Works Is the One You Never See" argues the working deliverable was a modular end-to-end system, not a chain. The hardest parts were downstream, such as conversion to local mobile money. Identity should be minimal, separate from transaction data, and revocable. [S] — [coincub](https://coincub.com/blog/humanitarian-blockchain-that-works/)
- WFP Building Blocks began in 2017 with Syrian refugees in Jordan, avoiding bank routing. It reported about $3.5M in fee savings early on, then expanded to Bangladesh and Ukraine. Reported scale ranges from $555M to more than $760M depending on period. [S] — [WFP USA](https://wfpusa.org/news/blockchain-tech-helps-refugees-grocery-shop-in-conflict-zones/); [coincub](https://coincub.com/blog/humanitarian-blockchain-that-works/)
- UNHCR has paid displaced Ukrainians in USDC on Stellar since Dec 2022, with cash-out at MoneyGram. It had disbursed about $4.6M to about 2,500 households by end-2024. Commentators still describe it as pilot-scale next to Building Blocks. [S] — [coincub](https://coincub.com/blog/humanitarian-blockchain-that-works/)
- New in 2026: Circle Foundation grants to UNDP and WFP (Sept 2026). WFP USA will test regulated-stablecoin payments in 2–3 country corridors over 3 years, covering risk controls, payment records, compliance tools, and links to local financial providers. [S] — [Cryptonomist, 25 Sep 2026](https://en.cryptonomist.ch/2026/09/25/stablecoin-payment-trials-un/); [FF News](https://ffnews.com/news/circle-foundation-announces-support-for-united-nations-development-programme-and-aa57a620); [blockchaining.org](https://blockchaining.org/circle-foundations-undp-and-wfp-grants-buy-stablecoins-a-un-track-record/)
- A privacy-preserving stablecoin aid pilot (USDCx on Aleo) near the Venezuelan border was announced in Apr 2026. It targets migrants who avoid registering for aid because of identity exposure. [S, vendor] — [Aleo blog](https://aleo.org/post/private-stablecoins-humanitarian-aid/)
- UNICEF's leadership discussed expanding the CryptoFund to stablecoins at Davos 2026. [S] — [cryptoaltruists](https://www.cryptoaltruists.com/blog/5-ways-the-united-nations-is-embracing-cryptocurrency-and-blockchain)

### Inferences
- Success-factor checklist for a hackathon project:
  - a real multi-party trust problem
  - an off-ramp or last-mile plan (cash-out, mobile money, merchant acceptance)
  - personal data off-chain (hashes, ZK, or selective disclosure)
  - beneficiary-centred metrics and a way for users to correct errors
  - an institutional partner or path to one
  - an evaluation plan with a baseline
- "Invisible blockchain" UX (passkeys, gas sponsorship, no tokens shown to beneficiaries) directly addresses past failure modes.

### Gaps
- No MIT or Brookings quantitative "pilot mortality" study was found this session. Claims that "X% of pilots died" beyond Stanford's 74% idea or pilot stage figure are unsourced.
- Building Blocks figures come from secondary or vendor sources and conflict. WFP primary annual figures were not retrieved.

---

## Q4. 2025–2026 macro trends: stablecoin law, RWA, DePIN, account abstraction and passkeys, L2 costs, prediction markets, on-chain agents

### Takeaway
2025–2026 removed most of the old excuses. US stablecoin law (GENIUS Act, July 2025) and large adjusted stablecoin volumes (about $9T in 12 months per a16z) made dollar rails legitimate. Fusaka (Dec 2025) cut L2 data costs again. EIP-7702 and passkey smart wallets removed seed phrases. Agent payment rails emerged. The remaining hard problems are last-mile, governance, and proof of impact, which is where a social-good project can differentiate.

### Cited Findings
- a16z State of Crypto 2025 (Oct 2025):
  - adjusted stablecoin volume of about $9T over 12 months, up 87% YoY; raw volume about $46T, up 106%
  - stablecoin supply above $300B, with Tether and USDC at 87%
  - more than 1% of all US dollars now exist as on-chain stablecoins
  - stablecoins hold over $150B in US Treasuries
  - monthly volume reached nearly $1.25T in Sep 2025
  - a16z describes activity as largely uncorrelated with trading
  - [P] — [a16z crypto State of Crypto 2025](https://a16zcrypto.com/posts/article/state-of-crypto-report-2025/); [a16z.news](https://www.a16z.news/p/state-of-crypto-2025); [Yahoo Finance](https://finance.yahoo.com/news/stablecoin-payments-hit-9-trillion-042534119.html)
- GENIUS Act (2025) is the first US federal stablecoin regulation. Secondary sources report a 18 Jul 2026 statutory deadline for implementing rules on capital, reserves, and liquidity; whether the rules were finalized was not confirmed. Messari 2026 expects Tether to lead in emerging markets and regulated incumbents to lead in developed markets, with yield-bearing stablecoins as a theme. [S] — [OneKey/Messari summary](https://onekey.so/blog/ecosystem/messari-2026-research-trends-across-seven-crypto-sectors/); [RootData Messari part 2](https://www.rootdata.com/news/487344); [CoinGecko 2026 outlook roundup](https://www.coingecko.com/learn/2026-crypto-market-outlook-roundup-major-institutions)
- RWA tokenization: Messari summaries put tokenized RWAs at about $18B in 2025, mostly Treasuries and credit. One summary prints "$1.8B", likely a unit error. A later outlook reports non-stablecoin RWAs grew from about $5.4B (Jan 2025) to about $34B (Jul 2026). DTCC received SEC authorization to tokenize US securities. These figures conflict and are secondary. [S] — [PANews Messari](https://www.panewslab.com/en/articles/0f751750-3b96-4287-bc15-fc397f8848cf); [CoinDesk 2026 outlook](https://www.coindesk.com/coindesk-indices/2025/12/17/crypto-for-advisors-predictions-for-2026)
- DePIN: forecast to exceed $100M in on-chain verifiable revenue in 2026, with vertical integration and DePAI (physical data for AI and robotics) as themes. [S] — [OneKey/Messari](https://onekey.so/blog/ecosystem/messari-2026-research-trends-across-seven-crypto-sectors/)
- Prediction markets: forecasts say media companies will adopt them as a revenue line and that they will become acquisition targets. In the social-good funding context, Seer prediction markets allocated $350K in GG24 (see Q1). [S] — [CoinGecko narratives 2026](https://www.coingecko.com/learn/crypto-narratives); [Gitcoin GG24](https://gitcoin.co/campaigns/gitcoin-grants-24-gg24)
- Fusaka (live 3 Dec 2025) introduced PeerDAS, followed by blob-parameter-only forks: 17 Dec 2025 (target 10, max 15) and 7 Jan 2026 (target 14, max 21). Reported L2 fee cuts range from 40–60% up to 95%, and one blog cites $0.005–0.02 per transaction on Arbitrum and Optimism. EIP-7918 sets a blob base-fee floor tied to L1 gas. [S] — [BlockEden](https://blockeden.xyz/blog/2026/01/24/ethereum-fusaka-blob-expansion-l2-fees-peerdas/); [bex.co six months after Fusaka](https://bex.co/blog/2026/05/25/ethereum-fusaka-peerdas-six-months-l2-economics); [justthedata](https://paragraph.com/@justthedata/post-fusaka-l2-economics-peerdas-blob-saturation-metrics-uops-benchmarks-and-data-availability-costs)
- Account abstraction: EIP-7702 (Pectra, 2025) lets existing EOAs delegate to smart-account code, enabling batching and gas sponsorship without changing addresses. MetaMask Smart Accounts use this. Estimates of 7702-delegated accounts conflict: about 14M by Apr 2026 versus more than 27M by Sep 2026. One uncorroborated report says 65–70% of early delegations were linked to phishing. Coinbase Smart Wallet uses ERC-4337 with passkeys, and the RIP-7212 secp256r1 precompile makes passkey verification cheap on L2s. [S] — [eco.com 7702 deep dive](https://eco.com/support/en/articles/15254037-erc-7702-deep-dive-2026-eoa-becomes-smart-wallet); [Openfort](https://www.openfort.io/blog/eip-7702); [bex.co wallet wars 2026](https://bex.co/blog/2026/03/09/wallet-development-trends-2026)
- On-chain AI agents: see x402 and ERC-8004 under Q1. The IMF now treats agentic payments as a mainstream policy topic. [P] — [IMF Note 2026/004](https://www.imf.org/-/media/files/publications/imf-notes/2026/english/insea2026004.pdf)
- Social-good news, 2025–2026:
  - Circle Foundation and UNDP/WFP stablecoin pilots (Sep 2026)
  - UNICEF Venture Fund 2026 call for blockchain startups (up to US$100K equity-free in ETH, BTC, or USDC; requires an open-source commitment, a working prototype, and registration in a programme country)
  - the UNDP SDG Blockchain Accelerator expanding into decentralized AI
  - [P/S] — [UNICEF apply](https://www.unicef.org/innovation/applyBlockchainCrypto); [Opportunity Desk](https://opportunitydesk.org/2026/03/04/unicef-venture-fund-2026/); [UNDP](https://innovation.eurasia.undp.org/sdg-blockchain-accelerator-driving-sdg-impact-in-2025/); [Cryptonomist](https://en.cryptonomist.ch/2026/09/25/stablecoin-payment-trials-un/)

### Inferences
- In 2026 a team can credibly demo near-zero-fee, seedless, gas-sponsored stablecoin flows on an L2. The "UX too hard / fees too high" objection from 2017–2021 pilots no longer holds, so judges will focus on impact and adoption design.
- Stablecoin regulation makes "regulated dollar rails for aid, remittance, or micro-grants" a mainstream rather than fringe proposal. A Singapore context (MAS stablecoin framework) could be relevant but was not researched here.

### Gaps
- Messari 2026 figures were seen only through secondary summaries, which conflict on RWA size.
- Final GENIUS Act implementing rules (July 2026 deadline) were not confirmed.
- 7702 adoption counts and passkey-wallet fee data have no primary dashboard source; Dune or L2Beat would be needed.

---

## Q5. What judges value: lessons from prior social-good and Web3 hackathons

### Takeaway
Across UNICEF, ETHGlobal, and accelerator rubrics, judges reward (1) real social impact and value proposition, (2) technical completion with a working demo, (3) originality, (4) viability, team, and scalability, and (5) use of sponsor primitives. UNICEF additionally emphasizes open source, a working prototype with real-world use, measurable impact, and benefit to children and young people. Details of the target hackathon (SMU, GSR Foundation, Málaga) could not be found online this session.

### Cited Findings
- UNICEF Blockchain Hackathon Mexico rubric had five criteria: originality, technical difficulty and completion, social impact and value proposition, viability and team skills, and scalability. The winner, "Linda", stored refugees' identity documents and let them track them via app, SMS, or phone call. Runners-up were "New Born" (refugee health records) and "Digital Passport". The event is several years old (around 2018–2019). [P] — [UNICEF Innovation](https://www.unicef.org/innovation/blockchain/blockchain-hackathon-mexico)
- At ETHNewYork 2019, the UNICEF Ventures and UNICEF France bounty on the digital divide was won by a donor map with escrowed funds released on conditions, plus a connectivity-monitoring browser plug-in. [P] — [UNICEF: Enabling technologists](https://www.unicef.org/innovation/stories/enabling-technologists-solve-global-issues)
- UNICEF Venture Fund 2026 criteria: early-stage startup with a working prototype and real-world use, open-source licensing, registration in a programme country, and potential to benefit children and youth. It prioritizes practical use cases, measurable impact, and scalability. [P] — [UNICEF](https://www.unicef.org/innovation/applyBlockchainCrypto); [The 101 on UNICEF call](https://www.unicef.org/innovation/stories/101blockchainAPPLY)
- ETHGlobal prize criteria vary by sponsor. Examples include product-market fit and completeness (Istanbul), and vision and use case, a working dApp, usability, and business model (Gnosis track). Public-goods tracks include Worldcoin's "Best Public Goods Use Case" at Sydney (World ID with quadratic funding, $2,500) and Nouns "Nounish Public Goods" ($5,000). [P] — [ETHGlobal Istanbul prizes](https://ethglobal.com/events/istanbul/prizes); [ETHGlobal Sydney prizes](https://ethglobal.com/events/sydney/prizes)
- Recent ETHGlobal finalists cluster around agents and payments, for example Payload Exchange (agent merchant payments via x402) and Halo (receipt rewards verified with World ID) at Buenos Aires 2025. [S] — [WEEX top-10 Buenos Aires](https://www.weex.com/news/detail/quick-look-at-the-top-10-winning-projects-from-the-ethglobal-buenos-aires-hackathon-241705); [ETHGlobal Buenos Aires finalists](https://ethglobal.com/events/buenosaires/prizes)
- An analysis of about 8,200 hackathon projects examines what wins. It is a Medium post and was not fetched. [S] — [Medium](https://simbro.medium.com/what-8-200-hackathon-projects-reveal-about-what-actually-wins-f105346ec97c)
- A closest-analogue prior event: Crypto.com's APAC Hackathon (2023), with SMU and Melbourne Business School as academic partners, asked for Web3 + AI solutions to UN SDGs 4 (education), 8 (decent work), and 13 (climate). Twelve finalists entered a 4-week incubation. Prizes were US$20K, $10K, and $5K, and finals were held at the Singapore FinTech Festival on 14 Nov 2023. This shows SMU's prior judging context favoured SDG-mapped Web3+AI proposals. [P] — [Crypto.com newsroom](https://crypto.com/au/company-news/crypto-com-launches-inaugural-apac-hackathon); [Fintech News SG](https://fintechnews.sg/78181/crypto/crypto-com-kicks-off-its-inaugural-apac-hackathon-focused-on-web3-0-ai/)

### Inferences
- Pitch structure judges reward:
  1. a named beneficiary and a quantified pain point
  2. why blockchain is required (Wüst–Gervais) and why AI is required
  3. a live demo on a testnet or low-cost L2 with invisible-crypto UX
  4. impact metrics plus a verification method (on-chain attestations or Hypercerts)
  5. an adoption path (partner NGO, off-ramp, regulation)
  6. open-source code and an explicit risk and ethics section (privacy, AI bias, a human override)
- Given the "From Vision to Impact" theme and the SMU and Málaga academic hosts, citing evaluation literature (Stanford 2019, "Conjuring a Blockchain Pilot") and showing awareness of failure modes is likely to differentiate a team from typical "token for X" pitches. This is an inference, not a published rubric.

### Gaps
- No public web page was found for "Web3 for Social Good Hackathon 2026" (SMU, GSR Foundation, University of Málaga), its rubric, or its tracks. Searches returned nothing on a "GSR Foundation". The team should use the official brief.
- No consolidated list of ETHGlobal "impact" prize winners for 2025–2026 was found. DoraHacks and Gitcoin social-impact hackathon winners were not researched due to the tool-call budget.
