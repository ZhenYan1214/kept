# Web3 / Blockchain for Climate, Sustainability & Regenerative Finance (ReFi)

Research date: 2026-10-14. Prepared for a student team brainstorming for the Web3 for Social Good Hackathon 2026 (SMU / GSR Foundation / University of Málaga). Dates are given for every finding. Older material (2018–2023) is labeled. Where sources disagree or come from secondary or promotional pages, the note says so.

---

## Q1. Tokenized carbon credits: Toucan, KlimaDAO, Moss, Flowcarbon, C3, Verra's ban, "zombie credits", and the current on-chain market

### Takeaway
The 2021–22 boom of "bridged" voluntary carbon credits (Toucan BCT, KlimaDAO, Moss MCO2) brought mostly old, low-quality credits on-chain. Verra stopped it in May 2022 by banning tokens built on retired credits. On-chain volume then collapsed. By 2025–26 the first-generation projects had pivoted, gone open source, or wound down. The momentum has moved to registry-led digitization (Verra + Hedera, JPMorgan Kinexys pilots) and dMRV, not crypto-native retail tokens.

### Cited Findings
**Toucan / BCT and "zombie credits" (CarbonPlan, 7 Apr 2022)**
- About 21.6 million Verra VCUs moved on-chain through Toucan from Oct 2021, mostly into Base Carbon Tonnes (BCT). KlimaDAO's treasury reportedly held over 17 MtCO2e of carbon tokens. — [CarbonPlan, "Zombies on the blockchain"](https://carbonplan.org/research/toucan-crypto-offsets)
- About 28% of Toucan-bridged credits (6.0 MtCO2e) came from "zombie projects". CarbonPlan defines these as projects with no public retirements in the two years before a Toucan retirement, or with more than 95% of their retirements going through Toucan. Examples include a natural-gas project with no retirements from 2013 until Toucan bridged over 500k of its credits, and a hydropower project with 98.9% of its retirements via Toucan. — [CarbonPlan](https://carbonplan.org/research/toucan-crypto-offsets)
- At least 84.8% (18.3M) of bridged credits came from projects registered before 1 Jan 2013 and would fail Article 6-style cut-offs. 99.9% had crediting periods starting before 2016, so they were CORSIA-ineligible. Toucan had also bridged EU-banned HFC-23 credits before restricting them. — [CarbonPlan](https://carbonplan.org/research/toucan-crypto-offsets)
- BCT traded at about $5–8 at launch (late 2021) and later at about $3–4. KLIMA peaked in the mid-$3,000s and was near $20 by April 2022. — [CarbonPlan](https://carbonplan.org/research/toucan-crypto-offsets)

**Verra's policy**
- On 25 May 2022, Verra prohibited "creating instruments or tokens based on retired credits", reasoning that retirement means the environmental benefit has been consumed. It said it was open to tokens linked to "immobilized" VCUs held in dedicated registry sub-accounts. — [CarbonCredits.com](https://carboncredits.com/verra-suspension-carbon-credits-proposes-immobilizing-credits); [Carbon Pulse](https://carbon-pulse.com/160625/); [S&P Global](https://www.spglobal.com/commodity-insights/en/news-research/latest-news/energy-transition/052522-market-players-react-positively-to-verras-proposal-to-link-tokens-to-immobilized-carbon-credits)
- A public consultation followed, with a stakeholder-feedback summary published in January 2023. The work was then "deprioritized". A later report says Verra resumed developing a formal tokenization policy and aims to finish it by end-2026. That report is a Substack post and unverified against Verra. — [CarbonCredits.com](https://carboncredits.com/?p=4863); [REDD-Monitor Substack](https://reddmonitor.substack.com/p/the-launch-of-500-million-carbon)
- Verra's ban halted Toucan's main activity. TIME (2022) reported that about 22 million retired credits were already on-chain with unclear status. — [TIME](https://time.com/6181907/crypto-carbon-credits/)

**Volume collapse (peer-reviewed data)**
- KlimaDAO-related tokenized volume fell from 516 MtCO2e (2021) to 254 MtCO2e (2022, −51%) and then 111 MtCO2e (2023). Average price per tCO2e went $4.2 → $7.8 → $6.5. Activity stabilized at much lower levels from mid-2022. — [Frontiers in Blockchain (Oct 2024), "Tokenized carbon credits in VCMs: the case of KlimaDAO"](https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2024.1474540/full)
- The same paper says KlimaDAO "initially achieved significant engagement" but faces challenges of "market maturity and participant retention". — [DOAJ record](https://doaj.org/article/a8146f69ad1e4d25ac46f45915d21b64)

**Toucan in 2025**
- On 8 May 2025, Toucan announced the protocol is going open source / community-run ("Carbon markets should be a public good"). The team moved to a new venture, Cedar, which builds AI agents for corporate sustainability teams. Lessons Toucan cited: VCM integrity scandals, regulatory uncertainty, fragmentation, and that combining carbon and crypto was "perhaps too early". Existing assets (CHAR biochar-removal pool via the Puro.earth bridge, NCT, TCO2) keep operating. — [Toucan blog, 8 May 2025](https://blog.toucan.earth/toucan-protocol-is-going-open-source-and-introducing-cedar/)

**KlimaDAO → Klima Protocol (Klima 2.0)**
- Klima 2.0 was announced 7 Apr 2025 with two new tokens. — [Quantum Commodity Intelligence, 7 Apr 2025](https://www.qcintel.com/carbon/article/klimadao-launches-major-upgrade-in-bid-to-reinvent-itself-39029.html)
- Klima Protocol settles on Base. kVCM is the unit of account: suppliers deposit registry-issued credits and receive kVCM, and buyers pay kVCM to retire. K2 is a governance/incentive token that sets capacity per "carbon class". Retirement is the only exit. The site claims "no fees" for retirement, 5 registries, retirements from 0.001 t via an x402 endpoint, and a Hashlock audit. Headline stats on the site rendered as "0". — [klimaprotocol.com](https://www.klimaprotocol.com/); [Dexscreener Base listing](https://dexscreener.com/base/0xef96ec76eeb36584fc4922e9fa268e0780170f33)
- A secondary blog says the relaunch happened in Feb 2026 with identity verification required. It also says KLIMA was about $0.04 by March 2026 (more than 99% below peak), that over 17 Mt were retired via the original infrastructure, and that the marketplace was spun out as Carbonmark (API access to tokenized credits). I could not confirm the Feb 2026 date or the price in a primary source. — [Crypto Altruists blog, 2026](https://www.cryptoaltruists.com/blog/what-happened-to-crypto-carbon-blockchain-and-carbon-markets-in-2026); [carbonmark.com](https://www.carbonmark.com/)
- The KLIMA price model was "backed" by BCT in the treasury, with high inflationary staking yields. A Jan 2022 trade article reported the community "defending" the protocol after a large price fall. — [QCIntel](https://www.qcintel.com/carbon/article/carbon-backed-cryptocurrency-klima-defends-protocol-against-price-fall-3809.html); [Gwern mirror of 2021 commentary](https://gwern.net/docs/www/mirror.xyz/0034992e753f3eaf032a7f1679f97572c73bddd5.html)

**Moss (MCO2, Brazil)**
- A Thomson Reuters Foundation investigation (2022) reportedly found Moss privately called some purchased credits "low quality". Verra sent Moss a cease-and-desist over use of its logo. A critic alleges the tokens were resold at up to 8× the price paid to developers and that one MCO2 does not map to one specific credit (unverified critic claim). Moss says third-party auditors check single use. Coinbase suspended MCO2 trading in 2023, which Moss attributed to liquidity. — [REDD-Monitor](https://reddmonitor.substack.com/p/florestal-santa-maria-redd-project); [Hill David Substack](https://hilldavid.substack.com/p/four-things-green-crypto-firms-should); [JotUp, Coinbase suspension](https://www.jotup.co/node/2629606)

**Flowcarbon (Adam Neumann)**
- Flowcarbon raised $70M in May 2022 (a16z-led), of which $38M came from pre-sales of the "Goddess Nature Token" (GNT) planned on Celo. The launch was postponed indefinitely. — [The Block](https://www.theblock.co/post/148427/adam-neumann-backed-blockchain-startup-flowcarbon-raises-70-million); [The Block, WSJ delay](https://www.theblock.co/amp/post/157971/adam-neumanns-crypto-startup-delays-token-launch-wsj)
- In Sept 2024, Forbes reported Flowcarbon was refunding GNT buyers, conditional on claim waivers and confidentiality. It blamed market conditions and registry opposition, and pivoted to project finance and carbon sales (e.g., biochar credits via Puro.earth). — [web3isgoinggreat](https://www.web3isgoinggreat.com/single/adam-neumanns-flowcarbon-refunds-customers); [blockchain.news](https://blockchain.news/news/flowcarbon-refunds-investors-after-canceling-token-launch)

**Other casualties**
- Nori (Seattle carbon-removal marketplace with its own NORI token) shut down in Sept 2024 after 7 years, citing a stagnant VCM and weak funding. — [GeekWire](https://www.geekwire.com/2024/nori-a-seattle-based-carbon-removal-marketplace-that-raised-17m-shuts-down-after-7-years/)

**Registry-level tokenization (the "institutional" second wave)**
- In early July 2025, JPMorgan's Kinexys piloted carbon-credit tokenization with S&P Global Commodity Insights (Environmental Registry), EcoRegistry and the International Carbon Registry, covering lifecycle tracking from issuance to retirement on Kinexys Digital Assets. EcoRegistry and ICR had completed initial tests. It is a pilot, not a commercial launch. — [The Block](https://www.theblock.co/post/360886/jpmorgan-tests-carbon-credit-tokenization-application); [Bloomberg, 2 Jul 2025](https://www.bloomberg.com/news/articles/2025-07-02/jpmorgan-s-blockchain-unit-explores-tokenizing-carbon-credits); [ESG Today](https://esgtoday.com/jpmorgan-launches-blockchain-tokenization-for-carbon-credits/)
- On 17 Jun 2025, S&P Global made Singapore's CIX the first carbon exchange to join its Meta Registry. — [CIX news](https://www.climateimpactx.com/news)
- Gold Standard ran a 2022 consultation proposing conditions on tokens in 8 areas: token model, registry reporting, pooling limits, KYC/AML, low-carbon chains, data security, and others. Final rules were not confirmed in my search. — [DLA Piper, Nov 2022](https://www.dlapiper.com/insights/publications/2022/11/gold-standard-consultation-future-of-digital-assets)

**Wider VCM context**
- VCM transaction value was about $2B in 2021 and about $535M in 2024, while retirements held at about 182 Mt (2024). Removals traded at a 381% premium over reductions. — [Ecosystem Marketplace 2025 SOVCM, via Crypto Altruists](https://www.ecosystemmarketplace.com/publications/2025-state-of-the-voluntary-carbon-market-sovcm/)
- Estimates conflict. Sylvera puts the 2024 VCM value at $966M and 2025 at $1,040M (via Lloyds, Apr 2026), while another summary gives about $1.1B for 2024. Reported 2024 retirements also differ: 182 Mt vs 164 Mt. — [Lloyds Bank, Apr 2026](https://www.lloydsbank.com/assets/assets-business-banking/pdfs/lb-april-2026-voluntary-carbon-market-sustainability-market-insights-lloyds.pdf); [Environmental Finance](https://www.environmental-finance.com/content/analysis/is-the-voluntary-carbon-market-finally-ready-to-grow-up.html); [Sustainable Atlas](https://sustainableatlas.org/post/data-story-key-signals-in-the-global-carbon-credit-market-1452)
- ICVCM's Core Carbon Principles (CCP) label: current renewable-energy methodologies will not receive CCP. One summary says 9 programs approved and about 107M CCP-eligible credits by April 2026. — [Lloyds Bank, Apr 2026](https://www.lloydsbank.com/assets/assets-business-banking/pdfs/lb-april-2026-voluntary-carbon-market-sustainability-market-insights-lloyds.pdf); [Sustainable Atlas](https://sustainableatlas.org/post/data-story-key-signals-in-the-global-carbon-credit-market-1452)

### Inferences
- Bridging (moving legacy registry credits onto a chain) is effectively over as a business model. The lowest-quality vintages were dumped into fungible pools, a "lemons" problem. Any hackathon idea that just "tokenizes carbon credits" will look derivative and will face the same registry-permission problem.
- The surviving design pattern is registry-native issuance or immobilization combined with quality-differentiated (non-fungible or class-based) pools. Klima 2.0's "carbon classes" and Toucan's CHAR removal pool both move away from undifferentiated "1 token = any tonne".
- Fungibility destroyed price signals for quality. A useful student project could expose quality metadata (vintage, methodology, CCP label, ratings) next to on-chain credits.

### Gaps
- No reliable primary figure found for 2025–2026 total on-chain tokenized carbon volume or Carbonmark retirements. I also could not find dashboard data for BCT/NCT supply.
- C3 (Carbon Credit Collective / UBO and NBO tokens): the search returned nothing usable, so its current status is unknown.
- The exact Klima 2.0 mainnet date and Verra's final tokenization policy status (target end-2026) are unconfirmed.

---

## Q2. MRV (measurement, reporting, verification) with IoT, satellite and AI plus blockchain: dMRV projects

### Takeaway
dMRV is where blockchain-climate work is actually moving forward in 2025–26. Verra issued its first credits under a dMRV high-frequency pilot in Feb 2026, and it is digitizing methodologies on Hedera Guardian. Crypto-native players (Regen Network, Open Forest Protocol, GainForest, Silvi, Hyphen) stay small but are good reference designs for a hackathon prototype.

### Cited Findings
- **Verra dMRV pilot (19 Feb 2026):** Verra approved its first credits under its dMRV pilot for high-frequency (monthly or bi-monthly) issuance. The source is the Foumbouni-Mitsamiouli solar farm on Grande Comore (Comoros, Verra project 3788), developed by Innovent Comores and Aera Group under CDM methodology AMS-I.D. SustainCERT did an entirely digital verification. Proponents can request 80% of approved credits, and Verra holds 20% as a buffer during the pilot. A full verification (safeguards, stakeholder engagement) is required after one year. The pilot is expanding to CCS and clean cookstoves. — [Verra](https://verra.org/verra-approves-first-credits-under-dmrv-pilot-for-high-frequency-issuances/); [Carbon Pulse](https://carbon-pulse.com/485196/); [ESG Post](https://esgpost.com/verra-issues-first-high-frequency-carbon-credits-under-digital-mrv-pilot/)
- **Verra and Hedera (May 2025):** The Hedera Foundation made a 5-year capital commitment. Verra became the first standards body to integrate Hedera Guardian (an open-source policy-workflow and tokenization engine) with its Project Hub, targeting more than 20 digitized methodologies by end-2025. A "DLT Earth Bounty" pays open-source contributors up to $5,000 per methodology. Completion status of the 20 is unconfirmed. — [Verra](https://verra.org/verra-and-hedera-to-accelerate-digital-transformation-of-carbon-markets/); [Hedera case study](https://hedera.com/case-study/verra/)
- Hedera Guardian design: each token mint links to a W3C verifiable presentation that traces back through the methodology, project and registry documents (HIP-28). — [HIP-28](https://hips.hedera.com/hip/hip-28)
- Verra runs a dMRV Working Group. — [Verra dMRV Working Group](https://verra.org/documents/digital-measurement-reporting-and-verification-dmrv-working-group)
- **Gold Standard:** A 2018 UNFCCC presentation laid out a path from paper-based MRV to tokenization plus automated verification. A LinkedIn post (promotional, unverified) claims ATEC Global and Gold Standard issued the "first fully dMRV-based" credits tokenized on Hedera (cookstoves). — [Gold Standard COP24 deck](https://unfccc.int/sites/default/files/resource/Digital%20MRV%20Presentation%20Gold%20Standard%202018%2012%20COP.pdf)
- **Regen Network:** A Cosmos-SDK proof-of-stake chain (Regen Ledger) acting as a registry for ecological claims, data and assets. Its Regen Marketplace (Oct 2022) supports peer-to-peer buy, sell and retire of tokenized ecocredits. The Regen Registry Handbook covers MRV and issuance. A biodiversity pilot protects jaguar habitat across about 10,000 ha in Ecuador. — [Keplr blog](https://blog.keplr.app/regen-network-healing-our-planet-through-regenerative-finance/); [Regen Registry Notion](https://regennetwork.notion.site/Welcome-to-Regen-Registry-0d55aab2a2d64f27aee2a468df172990); [Regen Registry learning center](https://registry.regen.network/learning-center/urban-forestry-part-3-protecting-mature-forests-and-wildlife-habitat-corridors)
- **Open Forest Protocol (OFP):** Built on NEAR. Forest data is collected with a mobile app and stored in an open, blockchain-based registry. A profile page (undated) lists 191 projects and 5,182 ha. An earlier example is a 5,067 ha Ivory Coast pact (Gorké forest) when OFP had 27 projects. It raised a $4.1M pre-seed. — [Causeartist](https://www.causeartist.com/companies/open-forest-protocol); [CIFOR Forests News (2020–24 archive)](https://archive2020-24.pfbc-cbfp.org/news-partner/reforestation-FORESTSNEWS.html); [Startupticker](https://www.startupticker.ch/en/news/open-forest-protocol-raises-usd-4-1m-in-pre-seed-round)
- **GainForest:** Was a finalist in the $10M XPRIZE Rainforest. The finals were held July 2024 in the Brazilian Amazon. The $5M grand prize went to Limelight Rainforest (drone-deployed multi-taxa sensors), and ETH BiodivX got a $250k bonus prize. GainForest did not win. It works with Hypercerts on "ecocerts" (on-chain impact certificates). — [XPRIZE finalists](https://go.xprize.org/news/xprize-rainforest-announces-finalist-teams); [Commercial UAV News](https://www.commercialuavnews.com/xprize-rainforest-names-limelight-rainforest-winner-of-biodiversity-tech-competition); [Celo forum, ecocerts](https://forum.celo.org/t/discussion-and-development-of-hypercerts-for-ecological-impact/9944); [HackMD GainForest](https://hackmd.io/@dwddao/SJHnjJ_s2)
- **Silvi:** Tree-stewardship and MRV payments platform in public beta. Only projects vetted and configured with methodologies get stewardship payments. It raised $4,059 from 1,437 donors in a Gitcoin round. — [Gitcoin checker: Silvi](https://checker.gitcoin.co/public/project/show/silvi)
- **Hyphen Global (Basel, Switzerland, founded 2021):** Atmospheric MRV that uses eddy covariance to measure CO2, CH4 and N2O fluxes directly. It partnered with Demia to anchor pre- and post-AI-analysis data on blockchain. A secondary claim (unverified) says Hyphen ran a native on-chain issuance pilot with the Singapore government and VVBs in late 2025. — [Solar Impulse profile](https://solarimpulse.com/companies/hyphen-global-ag); [The Energyst](https://theenergyst.com/hyphen-global-selects-demia-to-validate-real-time-carbon-sequestration-data-for-voluntary-carbon-market-contracts/); [Sustainable Atlas explainer](https://sustainableatlas.org/post/explainer-blockchain-carbon-markets-mrv-how-distributed-ledgers-transform-verification-1668)
- **CIX (2021 plan):** CIX said at founding it would use satellite monitoring, machine learning and blockchain to improve verification of nature-based credits. — [Standard Chartered press release, May 2021](https://www.sc.com/en/press-release/dbs-sgx-standard-chartered-and-temasek-to-take-climate-action-through-global-carbon-exchange-and-marketplace-2/)
- Background explainers on dMRV and blockchain: [Cointelegraph Magazine](https://cointelegraph.com/magazine/dmrv-blockchain-carbon-trading); [Carbonmark blog](https://www.carbonmark.com/post/how-dmrv-and-smart-contracts-help-build-trust-in-carbon-markets)

### Inferences
- The new pattern is "sensor → signed data → digital VVB → registry → (optional) token". Blockchain's value is tamper-evident data lineage, not speculation. A student team could plausibly build one stage of this, for example signed IoT data with an on-chain hash and a verifier dashboard.
- High-frequency issuance (monthly instead of every few years) improves cash flow for small project developers. This is a strong social-good angle for Global South smallholders.

### Gaps
- No 2025–26 figures found for Regen Network credit volumes or OFP's current hectares.
- I did not find confirmation of how many Verra methodologies were actually digitized on Guardian by end-2025.

---

## Q3. Plastic, renewable-energy trading, DePIN environmental sensing, biodiversity credits, supply-chain traceability (EUDR, fisheries)

### Takeaway
The deployments that last use blockchain as a back-office audit trail inside a real business: Plastic Bank (private chain with IBM), the SAFc registry on Energy Web, and OpenSC traceability. Token-incentivized DePIN sensing works for weather (WeatherXM) but failed for air quality (PlanetWatch). EUDR (applies 30 Dec 2026) creates real demand for geolocation and traceability tools.

### Cited Findings
**Plastic Bank**
- In 2025: 28.2 million kg of plastic collected across 6 countries, and more than 27,000 collectors recovered over 1.4 billion bottles. It describes "100% digital social benefits" on a "blockchain-secured platform". — [Plastic Bank 2025 review](https://wp.plasticbank.com/blog/plastic-banks-sustainability-journey-in-2025/)
- Lifetime: over 162 million kg as of April 2025, with "58,000 collection members". This member count conflicts with the 27,000 collectors above, likely a different definition. — [Plastic Bank blog](https://plasticbank.com/blog/how-plastic-waste-turns-to-opportunity/)
- The blockchain is private, built with IBM (LinuxONE). — [ABC da Comunicação](https://www.abcdacomunicacao.com.br/com-reciclagem-rastreavel-por-blockchain-plastic-bank-chega-a-r-25-milhoes-pagos-a-catadores-no-brasil/); [IBM case study](https://www.ibm.com/case-studies/plastic-bank-systems-linuxone)

**Renewable-energy trading and certificates**
- Powerledger deprecated its own chain from 1 Oct 2024 and completed Solana integration (POWR on Ethereum and Solana) in Oct 2024. It was announced at Breakpoint 2024 in Singapore. It supports REC, EAC and carbon-credit tokenization and trading (TraceX). — [Decrypt](https://decrypt.co/285993/powerledger-completes-integration-with-solana-accelerating-the-pace-of-innovation-in-sustainability?amp=1); [Powerledger FAQ](https://powerledger.io/everything-you-need-to-know-about-powerledgers-expansion-to-solana/)
- Energy Web built the SAFc (Sustainable Aviation Fuel certificate) Registry for RMI and EDF, launched 6 Dec 2023 at COP28. On 19 Feb 2026 it passed 500,000 tCO2e abated, with certificates for more than 164,000 t (54M gallons) of neat SAF. It runs on Energy Web's Verified Compute Cloud. — [RMI press release](https://rmi.org/press-release/safc-registry-surpasses-500000-metric-tons-of-co₂e-abated/); [RMI launch](https://rmi.org/news/not-for-profit-registry-launches-to-spur-sustainable-aviation-fuel-market-through-transparent-digital-tool/); [The Defiant](https://thedefiant.io/education/defi/energy-web-is-building-the-verification-layer-for-real-world-markets)
- Older example (about 2019): Energy Web Chain plus Thailand's PTT for I-REC certificate tracking. — [Ledger Insights](https://ledgerinsights.com/?p=6767)

**DePIN environmental sensing**
- WeatherXM: stations cost about $400–900 and measure temperature, humidity, solar radiation, wind, pressure and rain. A secure element signs the data. Operators earn WXM, and data users buy licenses with WXM. Arbitrum-based. It raised a $7.7M Series A (Lightspeed Faction, May 2024). The network had 8,000+ stations (Feb 2025), with targeted bounties for Africa, LatAm and India. — [The Block](https://www.theblock.co/post/295807/lightspeed-faction-leads-7-7-million-series-a-round-for-depin-weather-startup-weatherxm); [Arbitrum blog](https://blog.arbitrum.io/how-weatherxm-is-paving-the-way-for-depin-on-arbitrum/); [DePIN Hub, Feb 2025](https://9o1hbtdj3x.depinhub.io/news/weather-xm-pro-revolutionizing-weather-data-access-21875)
- PlanetWatch (air-quality DePIN on Algorand) is listed as "no longer active", transitioning to "Ambient Network" on Solana per an aggregator. Bitfinex delisted PLANETS (2023), and its market cap is now tiny. — [DePIN Hub](https://9o1hbtdj3x.depinhub.io/projects/planetwatch); [Bitfinex notice](https://support.bitfinex.com/hc/en-us/articles/900006737366-Planet-Token-Delisted); [Coinbase](https://www.coinbase.com/en-ca/price/planetwatch)

**Biodiversity credits**
- IAPB launched a framework at COP16 (Cali, 2024): 21 high-level principles, co-developed with the Biodiversity Credit Alliance and WEF. The global biodiversity finance gap is $598–824B per year. As of Dec 2025, BCA had partnered with multilaterals and a science body to operationalize the rules. A LatAm commodity exchange launched a blockchain-verified marketplace for carbon and biodiversity credits. — [Reforest'Action](https://www.reforestaction.com/en/magazine/nature-credits-biodiversity-finance); [Carbon Pulse, 4 Dec 2025](https://carbon-pulse.com/464203/); [IAPB insights](https://www.iapbiocredits.org/news-events/insights)

**Supply-chain traceability**
- EUDR (EU Deforestation Regulation) was delayed twice. It now applies 30 Dec 2026 for large and medium operators and 30 Jun 2027 for micro and small. It still requires plot-level geolocation (GeoJSON polygons) for cattle, cocoa, coffee, oil palm, rubber, soy and wood. Obtaining geolocation data from millions of smallholders is a known pain point. A simplification review was due April 2026. — [Personal Care Magazine](https://www.personalcaremagazine.com/story/49511/european-union-postpones-eudr-implementation-to-end-2026); [Grant Thornton](https://www.grantthornton.be/en/the-field/articles-and-publications/Advisory/eudr-update-what-it-is-impact-on-companies-and-the-proposed-delay/); [OneStopESG](https://onestopesg.com/esg-resources/eudr-december-2026-supplier-checklist)
- Fisheries (2018–2020, older): WWF with ConsenSys, TraSeable and Sea Quest Fiji ran a tuna "bait to plate" blockchain pilot. WWF and BCG Digital Ventures then co-founded OpenSC (RFID/QR plus blockchain), used for Patagonian toothfish and prawns. Independent impact evaluations were not found. — [WWF-Australia 2018](https://wwf.org.au/news/2018/how-blockchain-and-a-smartphone-can-stamp-out-illegal-fishing-and-slavery-in-the-tuna-industry/); [WWF-Australia 2019](https://wwf.org.au/news/2019/world-first-revolutionary-blockchain-platform-empowers-all-to-track-environmental-and-ethical-impact-of-food-and-products/); [WEF 2020](https://weforum.org/agenda/2020/02/blockchain-tuna-sustainability-fisheries-food-security)

### Inferences
- EUDR smallholder geolocation is a timely, concrete Asia-relevant problem. Examples include Indonesian and Malaysian palm oil, Vietnamese coffee, and Thai rubber. A wallet- or DID-based "farm passport" with geofenced plot polygons fits a hackathon scope.
- Token incentives work for cheap hardware with a clear data buyer (weather). They fail when demand for the data is weak (PlanetWatch).

### Gaps
- No found evidence that the EU's EUDR Information System uses or accepts blockchain records. Blockchain would be a voluntary supplier-side tool.
- No 2025 Energy Web "Green Proofs" figures. No verified biodiversity-credit transaction volumes.

---

## Q4. Gitcoin climate rounds, Celo Climate Collective, Ethereum's Merge, and criticism of crypto's footprint

### Takeaway
ReFi public-goods funding (Gitcoin Climate Solutions rounds, Celo) has been real but small: tens to hundreds of thousands of dollars per round. Gitcoin moved away from broad QF rounds in 2025. Ethereum's 2022 Merge cut its energy use by about 99.95%, but Bitcoin's footprint keeps growing, so the "crypto is bad for climate" criticism remains, mostly aimed at PoW.

### Cited Findings
- GG21 (2024): Gitcoin put $370K into community rounds, and partners (Arbitrum, Celo) added $373K. The Climate Solutions round used 50% QF and 50% COCM and funded 71 climate projects. — [Gitcoin GG21 retrospective](https://gitcoin.co/blog/gg21-results-retrospective)
- GG23 (2025): The "Grants Garden" round moved from Quadratic Funding to Conviction Voting with $30k matching across 21 communities, including climate. A Celo forum post notes Gitcoin "shifting its focus" toward on-chain revenue and growth. — [Gitcoin campaigns](https://explore.gitcoin.co/campaigns/gitcoin-grants-21-gg21); [CeloPG forum](https://forum.celo.org/t/celopg-season-1-funding-request/11747/3); [CCN Climate Solutions retro](https://gov.gitcoin.co/t/ccn-climate-solutions-round-retro/18940)
- Celo Climate Collective (2021–22): Web3 climate projects building on Celo, which calls itself "carbon-negative" because block rewards buy offsets via Project Wren. Its goal was to back Celo stablecoins with tokenized natural assets, up to 40% of the Celo Reserve over 4 years. Members included Moss, Flowcarbon, Toucan, Thallo, CRED, Senken and Plastiks. Several of these later failed or pivoted. — [Celo blog intro](https://blog.celo.org/introducing-the-celo-climate-collective-6f056f190a04); [Celo × Toucan](https://blog.celo.org/the-celo-foundation-climate-collective-and-toucan-collaboration-deepens-to-bring-refi-to-the-e714700b96d0); [Celo × Flowcarbon](https://blog.celo.org/flow-carbon-joins-celos-climate-collective-in-the-fight-against-climate-change-33a93efebd0f)
- Ethereum Merge (15 Sep 2022): PoW → PoS cut energy use by about 99.95% (ethereum.org figure), from about 60 TWh/yr to about 0.01 TWh/yr. — [ethereum.org energy page](https://ethereum.org/en/energy-consumption/); [designboom](https://www.designboom.com/technology/ethereum-merge-historic-upgrade-reduces-cryptocurrency-energy-consumption-09-15-2022/)
- Bitcoin: Cambridge (Apr 2025) estimated 138 TWh/yr (about 0.5% of global electricity), 39.8 MtCO2e, and 52.4% sustainable energy. A preliminary update put Dec 2025 at about 190 TWh annualized, with low-carbon share at 59.4% and emissions up about 20%. — [Cambridge Judge Business School, 2025](https://jbs.cam.ac.uk/2025/cambridge-study-sustainable-energy-rising-in-bitcoin-mining/); [The Energy Mag](https://www.theenergymag.com/news/market-news/bitcoin-energy-consumption-mix-cambridge-eif); [CoinTurk](https://en.coin-turk.com/cambridge-hydropower-leads-as-bitcoin-mining-hits-record-190-twh-emissions-rise-slower/)

### Inferences
- Choose a PoS or L2 chain (Ethereum L2, Celo, which became an Ethereum L2 in 2025, Base, Solana, Hedera) and say so explicitly in the pitch. Judges will ask about footprint.
- Hypercerts and impact certificates plus retroactive funding are still a live ReFi funding primitive (GainForest ecocerts).

### Gaps
- No GG24 (late 2025) climate-round amounts found. No current Celo Climate Collective roster.
- Celo's L2 migration date is from my background knowledge (2025) and was not re-verified in this session.

---

## Q5. What failed and why, and unsolved gaps in 2025–2026

### Takeaway
The failures share root causes. Tokens inherited bad underlying credits ("garbage in, garbage on-chain"). Ponzi-like token economics (KLIMA's rebasing and staking yields) let speculation overwhelm the climate purpose. Projects tokenized without registry consent. Demand was weak. What remains unsolved is data integrity at the source, credit quality, double counting with Article 6, and smallholder inclusion. Blockchain alone fixes none of these.

### Cited Findings
- Quality: 28% zombie credits, 85% pre-2013 projects, and 99.9% CORSIA-ineligible in Toucan's BCT pool. — [CarbonPlan](https://carbonplan.org/research/toucan-crypto-offsets)
- Registry conflict: Verra's May 2022 ban on retired-credit tokens and its cease-and-desist to Moss over logo use. Flowcarbon cited "opposition from carbon registries" when refunding. — [Carbon Pulse](https://carbon-pulse.com/160625/); [REDD-Monitor](https://reddmonitor.substack.com/p/florestal-santa-maria-redd-project); [blockchain.news](https://blockchain.news/news/flowcarbon-refunds-investors-after-canceling-token-launch)
- Tokenomics: inflationary staking rewards and BCT-backed "floor" price narratives. Volume fell 516 → 111 MtCO2e from 2021 to 2023. — [Gwern mirror](https://gwern.net/docs/www/mirror.xyz/0034992e753f3eaf032a7f1679f97572c73bddd5.html); [Frontiers 2024](https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2024.1474540/full)
- Market timing: Toucan says carbon and crypto were combined "perhaps too early". The VCM shrank from about $2B (2021) to about $535M (2024). — [Toucan](https://blog.toucan.earth/toucan-protocol-is-going-open-source-and-introducing-cedar/); [Ecosystem Marketplace](https://www.ecosystemmarketplace.com/publications/2025-state-of-the-voluntary-carbon-market-sovcm/)
- Shutdowns: Nori (2024), PlanetWatch (inactive), and Flowcarbon GNT (never launched). — [GeekWire](https://www.geekwire.com/2024/nori-a-seattle-based-carbon-removal-marketplace-that-raised-17m-shuts-down-after-7-years/); [DePIN Hub](https://9o1hbtdj3x.depinhub.io/projects/planetwatch)
- Taiwan press reporting warns firms of Verra fraud allegations and greenwashing risk when buying international credits. — [Inside.com.tw](https://www.inside.com.tw/article/33726-tcx-launch)
- Demand is shifting toward national schemes and Article 6. Removals command large premiums. — [Crypto Altruists 2026](https://www.cryptoaltruists.com/blog/what-happened-to-crypto-carbon-blockchain-and-carbon-markets-in-2026)

### Inferences (unsolved gaps a hackathon could target)
1. **Oracle and data-integrity problem.** Blockchain guarantees immutability after entry, not truth at entry. Signed sensors (WeatherXM-style secure elements), multi-source cross-checks (satellite plus ground), and verifier reputation are still open problems.
2. **Article 6 corresponding adjustments and double counting.** Tracking which tonne was authorized, adjusted and used by Singapore, Taiwan or a corporate claim across registries is a natural ledger problem. Registry-of-registries efforts (S&P Meta Registry, Kinexys) are only pilots.
3. **Smallholder and community benefit-sharing.** Transparent payout tracking to local communities and collectors, as in Plastic Bank's digital payments and Silvi's stewardship payments, combined with EUDR geolocation.
4. **Quality transparency for SME buyers in Asia.** Taiwan's TCX sells in 1-tonne units to SMEs, who lack rating tools. An explainer or rating overlay (vintage, CCP label, methodology risk) is a feasible student build.
5. **Retirement-claim integrity.** Preventing the same tonne being claimed in a tokenized retirement, in a registry retirement, and in a carbon-tax offset at once.

### Gaps
- No rigorous academic post-mortem of KLIMA's 2022 collapse mechanics was found in this session. The tokenomics explanation is partly my synthesis from commentary.

---

## Q6. Singapore context: Climate Impact X, MAS Project Greenprint and Gprnt, carbon tax and international carbon credits

### Takeaway
Singapore positions itself as Asia's carbon-services hub. CIX is a bank, SGX and Temasek-backed exchange that originally promised satellite, ML and blockchain. MAS's Greenprint became Gprnt, an ESG data utility. The carbon tax (S$45/t in 2026–27) lets emitters offset up to 5% with Article 6-compliant international credits. Eligible supply is scarce, so the government is tendering for 12M+ ITMOs.

### Cited Findings
- **CIX:** Founded May 2021 by DBS, SGX, Standard Chartered and Temasek (now via GenZero). It focused on nature-based solutions and planned "satellite monitoring, machine learning and blockchain". CIX Exchange (spot trading) launched June 2023. — [Standard Chartered PR](https://www.sc.com/en/press-release/dbs-sgx-standard-chartered-and-temasek-to-take-climate-action-through-global-carbon-exchange-and-marketplace-2/); [BusinessWire Jun 2023](https://www.businesswire.com/news/home/20230607005394/en/)
- CIX in 2025: it joined S&P Global's Meta Registry on 17 Jun 2025 (first exchange to do so). It partnered with MSCI on 23 Jul 2025 to distribute price data. It launched a CORSIA Phase 1 standardized contract, was approved as a custodian for Abaxx carbon futures, and ran a consultation on reinstating C-Quest Capital cookstove projects (17 Mar 2025). — [CIX news](https://www.climateimpactx.com/news); [Rajah & Tann](https://www.rajahtannasia.com/?p=177355)
- **MAS Project Greenprint → Gprnt:** Launched Nov 2023 as an integrated ESG-data platform (registry, reporting via API and consent, marketplace). Strategic partners are HSBC, KPMG, Microsoft and MUFG, and it was rolled out progressively from Q1 2024. Earlier Greenprint pilots included an ESG certification registry; MAS's Greenprint pilots in 2021–22 used DLT. — [MAS media release, Nov 2023](https://www.mas.gov.sg/news/media-releases/2023/mas-launches-digital-platform-for-seamless-esg-data-collection-and-access); [ASEAN Briefing](https://www.aseanbriefing.com/news/mas-sets-new-standard-with-digital-platform-for-esg-data-collection/)
- **Carbon tax:** Covers facilities emitting ≥25,000 tCO2e per year. It was S$5 (2019–23), S$25 (2024–25), and S$45 (2026–27), with S$50–80 targeted by 2030. The Feb 2026 Budget suggests the low end of that range. Since 1 Jan 2024, up to 5% of taxable emissions can be offset with eligible ICCs that have Article 6 corresponding adjustments. — [CarbonCredits.com](https://carboncredits.com/?p=47558); [S&P Global, Mar 2026](https://www.spglobal.com/energy/en/news-research/latest-news/energy-transition/030626-singapore-carbon-credit-buying-to-grow-as-2026-tax-hike-looms-participants); [Clifford Chance, Sep 2024](https://cliffordchance.com/content/dam/cliffordchance/briefings/2024/09/singapore-carbon-initiatives-the-carbon-tax-and-the-eligibility-list.pdf)
- **Implementation Agreements:** Ghana, Bhutan, Chile, Mongolia, PNG, Peru, Rwanda, Paraguay, Thailand, Vietnam and the Philippines, with Laos signing Sept 2026. — [CarbonCredits.com](https://carboncredits.com/?p=47558)
- **Government procurement:** In Sept 2025, Singapore agreed to buy 2.175 Mt of nature-based credits from 4 projects (Ghana, Peru, Paraguay), worth about S$76M, delivered 2026–2030. The second-stage tender for at least 12M ITMOs opened 7 Sep 2026, with 2% of credits cancelled for overall mitigation and 5% of proceeds going to adaptation. — [CarbonCredits.com](https://carboncredits.com/?p=47558)
- Early 2026: S&P reported a shortage of approved eligible ICCs for 2026 compliance. In July 2026, Singapore broadened the accepted proof of host-country authorization. — [S&P Global](https://www.spglobal.com/energy/en/news-research/latest-news/energy-transition/030626-singapore-carbon-credit-buying-to-grow-as-2026-tax-hike-looms-participants); [Carbon Pulse, 14 Jul 2026](https://carbon-pulse.com/531269/)
- IETA's 2025 business brief on Singapore is available as further reading. — [IETA](https://www.ieta.org/uploads/wp-content/Resources/Busines-briefs/2025/IETA_Business_Brief-Singapore-final.pdf)

### Inferences
- The Singapore pain point is proving Article 6 eligibility and authorization documents for each credit (letters of authorization, corresponding adjustment status). A verifiable-credential or attestation layer for those documents would line up with MAS's Gprnt consent-based data approach.

### Gaps
- No 2025–26 Gprnt adoption numbers. No confirmation that CIX actually uses blockchain today.

---

## Q7. Asia context: Taiwan carbon fee (2025) and Taiwan Carbon Solution Exchange (TCX)

### Takeaway
Taiwan's carbon fee took effect 1 Jan 2025, with the first payment in May 2026 based on 2025 emissions. The general rate is NT$300/t, with preferential rates of NT$50 and 100. Domestic and foreign credits can offset part of the fee. TCX (opened Aug 2023) sells international credits in 1-tonne units and is preparing a TW ETS with EEX. Credit quality and greenwashing are the main concerns.

### Cited Findings
- **碳費費率:** General rate NT$300/t. Preferential rates A (industry-specific reduction rate) NT$50 and B (technology-benchmark reduction rate) NT$100 require an approved voluntary reduction plan (自主減量計畫). — [ETtoday 2024-10-07](https://www.ettoday.net/news/20241007/2830698.htm); [天下 CW](https://www.cw.com.tw/index.php/article/5132190)
- **時程:** Effective 2025-01-01. May 2025 was a trial declaration with no payment. Actual payment starts May 2026 based on prior-year emissions. Rates are reviewed every 2 years, with a reported plan of NT$1,200–1,800 by about 2030. — [Reccessary FAQ](https://www.reccessary.com/zh-tw/news/carbon-fees-guide-5-key-faqs); [The News Lens](https://www.thenewslens.com/article/242889)
- **對象:** Power, gas and manufacturing emitters of ≥25,000 t/yr, about 500 plants (281 companies, 141 listed). The fee covers more than 50% of national emissions. Estimated 2026 (民國115年) revenue is about NT$4.97B, earmarked for green transition. — [Reccessary](https://reccessary.com/zh-tw/news/world-market/taiwan-carbon-fee-analysis); [工商時報 2026-06-19](https://www.ctee.com.tw/news/20260619700657-430104)
- **抵換規則:** Domestic credits offset at 1.2×, capped at 10% of chargeable emissions. Foreign credits are capped at 5%. — [Search summary of Taiwan press; see 中時/工商 coverage](https://wantrich.chinatimes.com/news/20260318900784-420101)
- **TCX (台灣碳權交易所):** Opened 7 Aug 2023 in Kaohsiung. Funded by TWSE (NT$600M) and the National Development Fund (NT$400M). Business lines are domestic credits, international credits, and consulting and training. International listing criteria: credible issuers (Gold Standard, Verra), ex-post credits, vintage within 5 years, and ≥3 SDGs. Sold in 1-tonne units (versus thousands of tonnes internationally) for SMEs. — [中央社 CNA](https://www.cna.com.tw/news/afe/202308070083.aspx); [INSIDE](https://www.inside.com.tw/article/33726-tcx-launch)
- **2025 milestones:** MoU with EEX (June 2025) toward a TW ETS. Launched a "台灣自然碳匯永續共生行動計畫" with TWSE. Listed US forest projects. — [工商時報 2026-03-20](https://www.ctee.com.tw/news/20260320700888-430201); [中時新聞網](https://wantrich.chinatimes.com/news/20260320900412-420501)
- NSYSU Carbon Center's "VCM 2025 Annual Observation" reports a recovery in both price and volume, with high-quality credits becoming mainstream. — [鉅亨網](https://news.cnyes.com/news/id/6409460)

### Inferences
- Taiwan buyers are compliance-driven (5% foreign cap) and SME-heavy. A tool helping Taiwanese SMEs check international credit quality, or tracking domestic 自願減量 project data via dMRV, is directly relevant to an Asia-based team.

### Gaps
- No found figure for TCX's cumulative international-credit trading volume (tonnes) for 2024–2025. No confirmation of actual May 2026 carbon-fee collections versus the estimate.
