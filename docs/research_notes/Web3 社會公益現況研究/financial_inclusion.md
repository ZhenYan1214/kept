# Web3 / Blockchain for Financial Inclusion: Remittances, Stablecoins for the Unbanked, Microfinance, Savings Groups, Credit Access

> Research notes for the "Web3 for Social Good Hackathon 2026" (SMU / GSR Foundation / University of Malaga) student team. Compiled 2026-10-14. Dates are marked on all data points; anything older than 2025 is flagged as dated. Many traction figures are company-reported (unaudited); this is noted where it applies. Where I could not verify a claim, it is placed under Gaps.

---

## 1. Key projects and their real-world traction

### Takeaway
The projects with real traction in 2025-2026 are **distribution-led stablecoin wallets and off-ramps**: Opera MiniPay on Celo, MoneyGram on Stellar, Lemon in Argentina and Bitso in Mexico. They succeed by hiding the blockchain behind a phone number, a browser or a cash agent network. The more ambitious "rebuild the financial system" projects have mostly shut down, pivoted or stayed small: Kiva Protocol (sunset 2022), Goldfinch (defaults), Union (tiny TVL), GoodDollar and Sarafu (data mostly pre-2024). The consumer-facing African on/off-ramps (Yellow Card, Kotani Pay) are moving to B2B or into Tether's orbit.

### Cited Findings

**Celo / Opera MiniPay (stablecoin wallet inside the Opera Mini browser)**
- MiniPay is a self-custodial stablecoin wallet built on Celo. It needs only a mobile phone number to activate, and users can send stablecoins by phone number — [Barchart / Tether press release, Feb 2026](https://www.barchart.com/story/news/37360409/tether-and-opera-expand-financial-access-in-emerging-markets-through-minipay)
- Tether, Feb 2026: >12.6M activated wallets, 350M transactions, 3.64M estimated on-chain users. In Dec 2025 users made >96M USDT of transfers and >3.5M P2P payments. Growth is concentrated in Africa, LatAm and SE Asia (company-reported) — [Barchart / Tether PR](https://www.barchart.com/story/news/37360409/tether-and-opera-expand-financial-access-in-emerging-markets-through-minipay)
- Tether added USDT and Tether Gold (XAUt0) to MiniPay in Feb 2026, and Opera shares rose ~15-18% on the news — [The Block](https://www.theblock.co/amp/post/388040/opera-shares-jump-18-minipay-adds-tethers-usdt-stablecoin)
- Celo's own blog says MiniPay grew from 3M to 13M wallets during 2025 and reached 14M across 60+ countries. The Block says 14M across 66 countries — [Celo blog, "Celo's First Year as an L2"](https://blog.celo.org/celos-first-year-as-an-l2-scaling-the-programmable-rails-for-global-finance-cf0e5ecb7886); [The Block Celo page](https://www.theblock.co/price/celo)
- Celo (now an Ethereum L2) reports a peak of 840K daily actives and 1.3M monthly actives (early 2026), 5M+ weekly active USDT users and 10M+ USDT holders. It says it passed Tron as the top chain for USDT by weekly active users and has >$65B in stablecoin volume since the L2 migration. USDT gas payments are ~half of network fees (Celo-reported) — [Celo blog](https://blog.celo.org/celos-first-year-as-an-l2-scaling-the-programmable-rails-for-global-finance-cf0e5ecb7886); [The Block](https://www.theblock.co/price/celo)
- Recent MiniPay integrations include Mercado Pago and Brazil's PIX — [The Block](https://www.theblock.co/price/celo)
- A June 2026 MiniPay Card (Visa + Gnosis Pay debit card that spends stablecoin balances) is reported by one secondary source only; unverified against Opera — [Webull AU](https://www.webull.com.au/news-detail/15156332621104128)
- A $160M CELO allocation proposal would turn Opera from distribution partner into a network stakeholder (headline, 2026) — [Finviz](https://finviz.com/news/338735/160m-celo-allocation-proposal-to-grow-opera-from-distribution-partner-into-key-network-stakeholder)

**Valora (the original Celo consumer wallet)**
- Valora was spun out of cLabs in 2021 with a $20M Series A — [Venture Capital Journal](https://www.venturecapitaljournal.com/celo-spinout-valora-snags-20m-series-a/)
- Dec 2025: Stripe acquired the Valora *team* but not the IP. The app returned to cLabs and keeps running (multi-chain: Celo, Ethereum, Base, Optimism, Arbitrum). This is not a shutdown — [The Block](https://www.theblock.co/post/382111/stripe-acquires-valora-wallet-team-builds-stablecoin-services); [Cointelegraph](https://cointelegraph.com/news/stripe-acquires-self-custody-crypto-wallet-app)

**Stellar + MoneyGram**
- The partnership dates from 2021. MoneyGram built stablecoin cash on/off ramps and APIs and uses stablecoins in internal settlement — [Stellar press release](https://stellar.org/press/moneygram-and-stellar-extend-partnership-to-scale-real-world-stablecoin-utility-globally)
- Sep 2025: MoneyGram launched a stablecoin app in Colombia. Recipients get a USD balance backed by USDC on Stellar, with wallet infrastructure from Crossmint and no keys or gas for users. The balance can be cashed out at MoneyGram retail (>6,000 locations in Colombia; ~500,000 globally). Rationale given: Colombian families receive >22x what they send, and the peso lost >40% over four years — [Blockworks](https://blockworks.co/news/moneygram-stablecoin-app-colombia); [FXC Intelligence](https://fxcintel.com/research/reports/ct-moneygram-dollar-proxy-app)
- Stablecoin balance features are being extended to El Salvador and more of LatAm — [Stellar press release](https://stellar.org/press/moneygram-and-stellar-extend-partnership-to-scale-real-world-stablecoin-utility-globally)
- 10 Sep 2026: MoneyGram Card, a Visa card spending from the stablecoin balance, launched first in Colombia (single secondary source) — [Genfinity](https://genfinity.io/2026/09/10/moneygram-card-stablecoin-visa-colombia-remittances/)

**Kiva Protocol (Sierra Leone national digital ID + credit bureau)**
- Kiva described the work as building, with the government of Sierra Leone, "the country's first blockchain-based national identity and credit system" (page predates the sunset) — [Kiva blog, "Nancy's story: Kiva Protocol's first user"](https://www-0.kiva.org/blog/nancys-story-kiva-protocols-first-user)
- **Outcome: shut down.** Announced 13 May 2022, wind-down by 30 Jun 2022. The stated reason was that "extended implementation timelines" and COVID delays pushed it "past our organizational scale and capacity". Kiva claims it validated demand for verifiable financial histories and built a remittance-digitization business case in Honduras. The stack was open-sourced. The post gives no Sierra Leone user numbers and does not say what happened to the data — [Kiva: Sunset Kiva Protocol](https://www.kiva.org/blog/sunset-kiva-protocol)

**GoodDollar (crypto UBI on Celo/Fuse)**
- Sep 2023 (dated): 624,100 individuals from 180 countries had claimed G$; 110K weekly actives on Celo and >100K monthly on Fuse. Top claimer countries: Vietnam 161.1K, Indonesia 120.4K, Nigeria 96.9K, India 89.8K — [GoodDollar docs, "GoodDollar in numbers"](https://docs.gooddollar.org/gooddollar-in-numbers)
- Mechanism: the daily UBI pool is split evenly among "active users" (anyone who claimed in the past 14 days), so the per-person amount shrinks as users grow — [GoodDollar docs](https://docs.gooddollar.org/about-the-protocol/usage)
- DappRadar (2022) reported a 175% active-user jump — [DappRadar](https://dappradar.com/blog/gooddollar-active-users-jump-175)

**Grassroots Economics / Sarafu (Kenya community inclusion currencies)**
- Sarafu grew from 8,354 registered accounts (Jan 2020) to ~55,000 (Jun 2021) during COVID. Circulation was highly local and modular, and chamas (savings groups) and community institutions were central — [arXiv 2207.08941](https://arxiv.org/pdf/2207.08941); [arXiv 2209.01512](https://arxiv.org/pdf/2209.01512); [UK Data Service dataset](https://reshare.ukdataservice.ac.uk/855142/)
- The Kenya Red Cross adopted the CIC model as a COVID humanitarian response in 2020 — [Frontiers in Blockchain RCT](https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2021.739751/pdf)
- RCT (Mqamelo, 2021, Nairobi): a ~$30 token transfer raised wallet balances by ~$93.51, monthly currency income by ~$23.17 and food/water spending by ~$28.43. Gender gaps in outcomes persisted — [Frontiers in Blockchain](https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2021.739751/pdf)

**Union (Ethereum peer-to-peer "vouching" credit)**
- Users stake stablecoins to vouch for trusted contacts, who can then borrow without collateral. The protocol does not underwrite; vouchers bear the default risk. Live on Ethereum, Optimism, Arbitrum and Base (USDC) — [ConsenSys](https://consensys.io/blog/union-protocol-a-trust-based-solution-for-uncollateralized-defi-lending); [Paragraph: Union on Base](https://paragraph.xyz/@judithetugbo/getting-started-with-union-on-base)
- Very small: DefiLlama listed TVL ~$326K (as of early 2025, possibly stale) — [DefiLlama](https://preview.dl.llama.fi/protocol/union-protocol)

**Goldfinch (real-world credit to EM fintech lenders):** see Q3 (failures).

**Kotani Pay (Kenya, USSD + stablecoin on/off-ramp)**
- Provides fiat-to-stablecoin on/off-ramps to local African payment channels. Its key differentiator is a USSD interface, so it works on any feature phone with no data connection. It offers a REST API, SDK and widget — [Kotani docs](https://docs.kotanipay.com/docs); [Kola King Substack on $2M pre-seed](https://kolaking.substack.com/p/kotani-gets-2m-pre-seed-to-help-african)
- Oct 21, 2025: Tether made a strategic investment, with expansion planned to Rwanda and Nigeria — [TechCabal](https://techcabal.com/2025/10/22/tether-invests-in-kotani-pay-to-revolutionise-africas-digital-asset-infrastructure-and-cross-border-payments/); [Mariblock](https://www.mariblock.com/tether-invests-in-kotani-pay-to-boost-africa-crypto-payments). A deal tracker labels it an "acquisition", which is unverified and conflicts with these reports — [Signalbase](https://www.trysignalbase.com/news/acquisitions/kotani-pay-acquired-by-tetherio-acquisition)

**Yellow Card (pan-African stablecoin on/off-ramp)**
- Oct 2024 Series C of $33M (Blockchain Capital), ~$85-88M total raised. Transaction volume rose from $1.7B to >$3B, revenue grew 7x since Jan 2023, and it serves ~30,000 companies after pivoting to B2B — [TechCrunch](https://techcrunch.com/2024/10/16/african-crypto-startup-yellow-card-raises-33m-led-by-blockchain-capital-to-scale-its-b2b-pivot)
- A later $40M strategic round (SC Ventures/Standard Chartered, Sony, Polychain) brought total equity to >$120M (date not confirmed) — [TechEconomy.ng](https://techeconomy.ng/yellow-card-secures-40m-raise-accelerates-global-growth)
- **The consumer app closed on 1 Jan 2026** to go fully B2B (stablecoin payments, fiat settlement, custody, local-currency stablecoin issuance). Stated reasons: enterprise is now the majority of volume, and retail slowed under tighter regulation and volatility. Peers Quidax and Busha made similar B2B moves — [TechCabal, Nov 2025](https://techcabal.com/2025/11/03/yellow-card-closes-retail-app-turns-to-enterprises/); [bne IntelliNews](https://www.intellinews.com/nigeria-s-yellow-card-to-shut-retail-platform-shift-fully-to-b2b-stablecoin-payments-409617/); [BusinessDay](https://businessday.ng/technology/article/yellow-card-exits-retail-crypto-bets-on-40bn-stablecoin-payments-market/)

**Bitso (Mexico / LatAm)**
- Bitso Business processed >$6.5B in cross-border remittances in 2024 (vs $4.3B in 2023), estimated at >10% of the US-Mexico corridor — [FF News](https://ffnews.com/newsarticle/bitso-business-surpasses-12-billion-in-transactions-in-2024-and-unveils-study-revealing-stablecoins-as-the-leading-alternative-for-cross-border-payments)
- 2025: on track for $82B annualized total payment volume (all payments, not only remittances) — [Bitcoin.com News (PL)](https://news.bitcoin.com/pl/kamien-milowy-bitso-przetwarza-platnosci-w-stablecoinach-o-wartosci-ponad-80-mld-usd-w-ameryce-lacinskiej/)
- Bitso self-estimate: 14.7% of US→Mexico remittance volume in Jan-Aug 2026 (Banxico-based, reported by Expansión on 2 Oct 2026, not regulator-confirmed). Mexico received $41.8B in remittances in Jan-Aug 2026 (+2.2% YoY) — [Rio Times](https://www.riotimesonline.com/?p=743355)

**Lemon (Argentina)**
- Lemon's 2025 Crypto Report: stablecoins moved from inflation hedge to a way to move, receive and invest money, and stablecoin volume on Lemon grew 45% YoY (company-reported) — [Lemon Crypto Report 2025](https://www.lemon.me/crypto-report-2025.md)
- Its USD "Earn" savings product is built on the Morpho DeFi lending protocol — [Morpho case study](https://morpho.org/stories/lemon)
- Lemon recorded its highest-ever one-hour volume around the Oct 2025 midterm election results, when people bought stablecoins as a hedge — [Sumsub, Oct 2025](https://sumsub.com/media/news/argentina-flocked-to-stablecoins-ahead-of-president-midterms-win/)
- Lemon launched a bitcoin-backed credit card. Argentines hold an estimated ~$271B in undeclared cash dollars (Reuters estimate cited) — [Cointelegraph](https://cointelegraph.com/news/bitcoin-backed-credit-card-argentina-lemon)

**Coins.ph (Philippines) — PHPC peso stablecoin**
- BSP sandbox approval (May 2024) for PHPC, a 1:1 peso-backed stablecoin targeted at OFW remittances. It met its KPIs within two months and later graduated from the sandbox (date unconfirmed). It must publish proof-of-reserve audits — [Ledger Insights](https://ledgerinsights.com/regulated-crypto-firm-coins-ph-debuts-philippines-stablecoin-in-sandbox/); [Fintech News PH](https://fintechnews.ph/67165/crypto/coins-ph-phpc-progresses-beyond-bsp-sandbox/); [Elliptic](https://www.elliptic.co/insights/philippines-opens-up-potential-new-frontier-for-stablecoin-innovation/)
- Aug 2025: Coins.ph and HashKey Exchange (Hong Kong) announced direct PHP↔HKD transfers over regulated crypto rails, aimed at the HK→PH corridor (rollout status unconfirmed) — [The Fintech Times](https://thefintechtimes.com/?p=60654)

### Inferences
- **Distribution beats protocol.** MiniPay works because it ships inside an existing browser (Opera Mini) used on cheap Android phones. MoneyGram works because it bolts USDC onto 500K cash agents. A hackathon project should plug into an existing distribution channel (a wallet such as MiniPay mini-apps, WhatsApp/Telegram, USSD, or an NGO/cooperative) rather than build a standalone app.
- **USD savings is the killer use case**, more than remittance speed (Argentina, Colombia, Nigeria, Turkey). The demand is for a "dollar account", not for "crypto".
- **The ecosystem is consolidating around Tether and Circle**: Tether is in MiniPay, Kotani Pay and Celo gas; Circle's USDC is in MoneyGram. Neutral, community-run infrastructure (GoodDollar, Sarafu) has far less money behind it.
- **Retail-facing African crypto startups are retreating to B2B** (Yellow Card, Quidax, Busha), which leaves the last-mile, low-income retail user under-served. That gap is an opening for social-good projects.

### Gaps
- No 2025-2026 traction numbers were found for GoodDollar (claimers, G$ distributed) or Grassroots Economics/Sarafu (current users, post-2021 impact). Their dashboards and Dune would need checking.
- Kiva Protocol's actual Sierra Leone outcome (number of IDs and credit records issued, fate of the data, government status) is not disclosed in the sunset post. The promised follow-up "learnings" blog was not found.
- Mento local-currency stablecoins (cKES, cCOP, eXOF, etc.) traction was not found.
- Celo's exact L2 migration date was not confirmed in the sources retrieved.
- No independent audit exists of MiniPay or Celo user figures; all are company-reported.

---

## 2. Data on stablecoin adoption in emerging markets and remittance costs

### Takeaway
Financial inclusion is improving through mobile money: Findex 2025 shows 79% of adults with an account, and GSMA shows $2T of mobile money flows in 2025. Still, 1.3B adults remain unbanked, and remittances cost ~6.4% on average (~8.5% to Sub-Saharan Africa) against an SDG target of 3%. Stablecoin volumes are huge but mostly not retail. Only ~18-20% of raw on-chain stablecoin volume is "organic" after adjustment, and emerging-market retail usage is driven by currency hedging (Argentina, Nigeria, Turkey), not by payments.

### Cited Findings

**Financial inclusion baseline (World Bank Global Findex 2025, survey year 2024, published Jul 2025)**
- 79% of adults globally have an account and 75% in LMICs (+6pp since 2021). 1.3B adults remain unbanked, and ~650M of them are in 8 countries: Bangladesh, China, Egypt, India, Indonesia, Mexico, Nigeria, Pakistan — [World Bank Global Findex](https://www.worldbank.org/en/publication/globalfindex); [BIIA summary](https://www.biia.com/financial-inclusion-at-record-high-but-1-3-billion-still-unbanked-world-bank-global-findex-2025-report)
- 84% of LMIC adults own a mobile phone and 3B have smartphones. Mobile money accounts reach 15% of adults globally (1% in 2014) and 40% in Sub-Saharan Africa (27% in 2021) — [World Bank Global Findex](https://www.worldbank.org/en/publication/globalfindex)
- 40% of adults in developing economies saved in a financial account in 2024, up 16pp since 2021 and the fastest rise in a decade — [World Bank press release, 16 Jul 2025](https://www.worldbank.org/en/news/press-release/2025/07/16/mobile-phone-technology-powers-saving-surge-in-developing-economies)
- About 300M accounts sit idle. Credit, insurance and pensions lag, and nearly half of EM adults struggle to raise emergency funds — [CGAP podcast on Findex 2025](https://www.cgap.org/research/podcast/whats-next-for-financial-inclusion-unpacking-findex-2025)

**Mobile money (GSMA State of the Industry 2026, covering 2025)**
- >$2T in transactions in 2025, doubling in four years (the first $1T took 20 years). 2.3B registered accounts (+268M) and 593M monthly actives (+15%). Africa drives most growth — [GSMA press release, Mar 2026](https://www.gsma.com/newsroom/press-release/mobile-money-accounted-for-2-trillion-in-transactions-in-2025-doubling-since-2021-as-active-accounts-continue-to-grow/)

**Remittance costs (World Bank Remittance Prices Worldwide, RPW)**
- Global average cost to send $200: 6.26% in Q4 2024 and 6.49% in Q1 2025. The "SmaRT" (cheapest qualifying services) average was 3.29% in Q1 2025 — [RPW Main Report Q1 2025 (PDF)](https://remittanceprices.worldbank.org/sites/default/files/rpw_main_report_and_annex_q125_1_0.pdf); [RPW homepage](https://remittanceprices.worldbank.org)
- Q3 2025: global average 6.36%, more than double the SDG 10.c target of 3% (the G20 target is 5%). Banks were the most expensive channel at 14.99%, and digital-only MTOs were cheapest at 3.54% — [Axis Intelligence summary of RPW](https://axis-intelligence.com/cross-border-payments-statistics/) (secondary); [World Bank DataBank metadata](https://databank.worldbank.org/metadataglossary/world-development-indicators/series/SI.RMT.COST.OB.ZS)
- Sub-Saharan Africa is the most expensive receiving region: ~8.78% (Q1 2025) and ~8.46% (Q3 2025), against ECA 6.80% and EAP 5.83%. A SARB paper using the same data gives 7.97% for SSA, so methodologies differ — [Nairametrics](https://nairametrics.com/?p=476267); [WEF](https://www.weforum.org/stories/financial-and-monetary-systems/sending-money-to-africa-it-will-cost-you/); [SARB paper](https://www.resbank.co.za/content/dam/sarb/what-we-do/payments-and-settlements/cross-border-payments-conference/documents/paper-cost-patterns-remittance.pdf)

**Chainalysis 2025 Geography of Cryptocurrency (Jul 2024 - Jun 2025 data; index published 2 Sep 2025)**
- Global Crypto Adoption Index top 10: India, US, Pakistan, Vietnam, Brazil, Nigeria, Indonesia, Ukraine, Philippines, Russia — [CoinDesk via Coinspectator](https://coinspectator.com/coindesk/2025/09/06/bitcoin-and-stablecoins-dominate-as-india-u-s-top-2025-crypto-adoption-index/); [Decrypt](https://decrypt.co/337855/us-crypto-adoption-on-the-rise-following-regulatory-momentum-chainalysis)
- On-chain value received grew 69% YoY in APAC (to $2.36T), 63% in LatAm and 52% in SSA — [Bitcoinist](https://bitcoinist.com/crypto-adoption-2025-chainalysis-report/)
- USDT processed >$1T per month (Jun 2024 - Jun 2025) — [Bitcoinist](https://bitcoinist.com/crypto-adoption-2025-chainalysis-report/)
- SSA received ~$205B (+52%). Nigeria received $92.1B, ~3x South Africa, with Ethiopia, Kenya and Ghana next. A spike of ~$25B/month in March 2025 followed a naira devaluation. "Stablecoins = 43% of SSA volume" is reported but unconfirmed in Chainalysis text. Note: Chainalysis data captures CEX activity and misses much P2P/OTC — [Tech.Africa](https://tech.africa/sub-saharan-africa-crypto-205bn/); [Mariblock](https://www.mariblock.com/stories/sub-saharan-africa-now-the-third-fastest-growing-crypto-region-chainalysis)
- Goldman Sachs estimate (third-party): ~66% of global stablecoin supply is held in emerging markets — [Stablecoin Insider](https://stablecoininsider.org/the-global-stablecoin-adoption-index-which-countries-and-regions-lead-in-2026/) (secondary; unverified)

**a16z State of Crypto 2025 (published 22 Oct 2025)**
- Stablecoins did $46T in raw transaction volume over 12 months (+106%), but only ~$9T adjusted for bots and artificial activity (+87%). Monthly adjusted volume neared $1.25T in Sep 2025 — [DL News](https://www.dlnews.com/articles/markets/stablecoin-volumes-triple-visa-as-a16z-projects-digital-dollars-to-hit-3tn-by-2030/); [a16z crypto Substack](https://a16zcrypto.substack.com/p/5-more-charts-that-explain-crypto)
- Stablecoins are 94% of Argentina's peso-denominated crypto trading volume (a16z analysis) — [Serrari Group](https://serrarigroup.com/argentina-stablecoins-reach-94-of-peso-crypto-trading-volume/)

**Visa Onchain Analytics / Allium**
- June 2026: record ~$1.79T adjusted monthly stablecoin volume (+63% MoM). USDC ~67% ($1.21T) and USDT ~$576B. H1 2026 split: USDC ~70%, USDT ~25% of *adjusted* volume — [Solana Compass](https://solanacompass.com/news/visa-onchain-analytics-reports-record-179-trillion-in-adjusted-stablecoin-volume-for-june-2026); [Allium blog](https://www.allium.so/blog/bitcoin-com-cites-allium-data-in-the-15b-stablecoin-supply-drop-story/)
- Allium's Feb 2026 report: only ~17.6% of raw monthly volume survives adjustment, and 2025 adjusted transfer volume was $11.6T — [Stablecoin Insider on Allium 2026 report](https://stablecoininsider.org/allium-stablecoins-report-2026.md) (secondary)
- Visa white paper (2025): $6.4T adjusted volume over the trailing 12 months (+63% YoY). This conflicts with Allium's totals, likely because of a different window or method — [Visa white paper PDF](https://images.globalclient.visa.com/Web/InovantElqVisaCheckout/%7B04401ddf-3e84-464f-a5db-709a01e29cb4%7D_stablecoins-and-the-future-of-onchain-finance-2025-Visa-white-paper.pdf); [Visa "Making sense of stablecoins"](https://corporate.visa.com/en/sites/visa-perspectives/trends-insights/making-sense-of-stablecoins.html)

**Country snapshots**
- **Argentina**: stablecoins are the dominant way to save in USD (Lemon, Morpho). See Q1 — [Morpho](https://morpho.org/stories/lemon)
- **Nigeria**: $92.1B on-chain value (2nd globally in some rankings). Dollar stablecoins are used mainly to protect savings against the naira and for international transactions. cNGN (a naira stablecoin) launched Feb 2025 in the SEC Regulatory Incubation Program but initially could not be sent to third-party wallets or DEXs — [S&P Global](https://spglobal.com/ratings/en/research/articles/250214-stablecoin-brief-cngn-could-intensify-payment-competition-in-nigeria-101613758); [Ledger Insights](https://ledgerinsights.com/?p=37125); [TechCabal](https://techcabal.com/es/?p=151501)
- **Turkey**: lira trading volume grew from a few million to >$10B over ~4 years (Kaiko). Zodia Markets processed $3.4B in TRY stablecoin transactions in 2025. The central bank's 2021 rule still bans crypto as a payment instrument, so usage is trading and hedging, not payments. The first crypto law came in July 2024 with CASP licensing, and Treasury rules followed in 2025 (e.g., a mandatory 20-character transfer note or 72-hour withdrawal delay) — [Kaiko](https://www.kaiko.com/resources/whats-behind-turkeys-booming-crypto-market); [CryptoSlate](https://cryptoslate.com/turkish-lira-stablecoins-euro-token-demand/); [Chambers 2026 Turkey guide](https://practiceguides.chambers.com/practice-guides/blockchain-crypto-assets-2026/turkey)
- **Philippines**: 9th in the Chainalysis 2025 index. PHPC is a regulated peso stablecoin aimed at OFW remittances. Vendor claims put traditional OFW fees at 6-7% with 2-5 day delays (marketing source) — [TransFi blog](https://www.transfi.com/jp/blog/how-ofws-are-using-stablecoins-to-send-money-home-faster)
- **LatAm**: crypto transaction volume +60% in 2025 to $730B (figure attributed to Lemon's report via CB Insights) — [CB Insights](https://www.cbinsights.com/investor/lemon-cash)

### Inferences
- **The "stablecoins = $46T" headline is misleading for social-impact framing.** Use adjusted figures ($9-11.6T/year) and be explicit that most volume is trading, exchange and treasury activity, not poor households.
- **The remittance cost gap is still large**: 6.4% globally, 8.5% to Africa and ~15% via banks, against cheap digital MTOs at 3.5%. Stablecoin rails cost close to nothing on-chain, but the **cash-out leg** (agent, FX spread) is where the cost sits. A hackathon project that reduces off-ramp spread or connects to mobile money could show measurable savings against the RPW benchmarks.
- **Mobile money (593M monthly actives) is far larger than any crypto wallet** (MiniPay ~14M registered). Interoperating with mobile money (M-Pesa, GCash, PIX) is more realistic than replacing it.

### Gaps
- The World Bank RPW site returned 403. The latest official 2026 quarterly figures (Q1/Q2 2026) were not retrieved, and the Q3 2025 6.36% figure comes from secondary summaries.
- No primary Chainalysis text was retrieved. The stablecoin share of fiat purchases by country (Nigeria, Turkey, Argentina) remains unconfirmed.
- No 2026 Visa/Allium emerging-market breakdown exists in the sources found.
- Specific Singapore/Taiwan/HK → SE Asia corridor costs from RPW were not retrieved (e.g., SGD→IDR, HKD→PHP, TWD→VND/IDR).

---

## 3. What failed and why

### Takeaway
Failures cluster into four causes: (1) **credit risk in the real world**, where on-chain wrappers don't remove off-chain fraud or insolvency (Goldfinch); (2) **government and institutional dependency with long timelines** (Kiva Protocol); (3) **retail unit economics plus regulatory tightening** (Yellow Card exiting retail); and (4) **scams that grow faster than legitimate adoption**, with record losses of ~$17B in 2025.

### Cited Findings

**Goldfinch (on-chain credit to EM lenders): ~$18M in losses in 2023**
- Its first default was a $5M loan to Tugende Kenya, a motorbike financier, in mid-2023. Warbler Labs alleged Tugende Kenya lent $1.9M of the funds to its struggling Ugandan parent in breach of the loan agreement, leaving it insolvent. The Senior Pool took a ~3.95% NAV write-down, and the DAO allocated $1M USDC from its treasury to cover losses. A later restructuring partially recovered funds — [The Defiant](https://thedefiant.io/goldfinch-writes-down-failed-usd5m-loan-to-kenyan-taxi-financier); [DL News](https://dlnews.com/articles/defi/african-motorbike-finance-company-defaults-on-loan/)
- Stratos was a $20M facility (Feb 2022) to a US credit fund. In Oct 2023 its $5M REZI and $2M POKT positions were written to $0 (~$7M loss), and Warbler backstopped most backers — [The Defiant](https://thedefiant.io/news/defi/rwa-protocol-goldfinch-writes-down-usd7m-of-usd20m-loan-to-usd0)
- Lend East (SE Asia) borrower default — [DL News](https://dlnews.com/articles/defi/goldfinch-borrower-lend-east-defaults-says-warbler-labs/); Goldfinch cut ties with its risk adviser — [DL News](https://www.dlnews.com/articles/defi/rwa-protocol-goldfinch-cuts-ties-with-risk-adviser/)
- Total Goldfinch losses were reported at almost $18M — [The Defiant](https://thedefiant.io/news/defi/rwa-protocol-goldfinch-writes-down-usd7m-of-usd20m-loan-to-usd0)

**Kiva Protocol (2018-2022)**
- Sunset because of "extended implementation timelines" and COVID delays beyond Kiva's "organizational scale and capacity". It depended on government and national ID integration in Sierra Leone — [Kiva](https://www.kiva.org/blog/sunset-kiva-protocol)

**Retail crypto in Africa**
- Yellow Card closed its retail app on 1 Jan 2026, citing tighter regulation and volatility in several African markets. Quidax and Busha are also moving to B2B — [TechCabal](https://techcabal.com/2025/11/03/yellow-card-closes-retail-app-turns-to-enterprises/)
- cNGN's early design (no third-party wallet or DEX transfers) limited its usefulness. Analysts cite high entry costs, compliance burden, cybersecurity risk and low awareness as adoption barriers — [TechCabal](https://techcabal.com/es/?p=151501); [Mondaq](https://www.mondaq.com/nigeria/fin-tech/1732006/navigating-nigerias-regulatory-approach-to-stablecoin)

**Regulatory delistings**
- Under EU MiCA, USDT lacks e-money token authorization. Coinbase (Dec 2024), Kraken (fully delisted by 31 Mar 2025), Crypto.com, OKX, Bitstamp and Uphold restricted USDT for EEA users. Self-custody remains legal — [DL News (Kraken)](https://www.dlnews.com/articles/markets/kraken-delists-tether-usdt-in-europe-as-mica-rules-take-hold); [The Defiant (Coinbase)](https://thedefiant.io/news/cefi/coinbase-to-delist-usdt-unauthorized-stablecoins-eu-year-end-under-mica-09e96e1f)

**Scams targeting users**
- 2025: crypto scams reached a record ~$17B (Chainalysis). The average scam payment rose to $2,764 from $782 (+253%), impersonation scams grew >1,400% YoY, and AI-enabled scams earned 4.5x more per operation — [Decrypt](https://decrypt.co/354624/ai-impersonation-drove-crypto-scam-losses-record-17-billion-2025-chainalysis)
- 2024: scam revenue was at least $9.9B (possibly $12.4B). Pig-butchering revenue grew ~40% YoY and made up 33.2% of scam revenue — [FXStreet](https://www.fxstreet.com/cryptocurrencies/news/crypto-scams-drain-10-billion-from-users-in-pig-butchering-ai-and-illicit-schemes-202502141943)
- The HKMA issued a specific warning about scams impersonating the newly licensed stablecoin issuers (Apr 2026) — [Charltons](https://www.charltonslaw.com/hkma-issues-first-stablecoin-issuer-licences/)

**UBI token design limits**
- GoodDollar's per-claimer amount falls as active users rise (fixed pool divided among claimers), and the documented user base is concentrated in a few countries (Vietnam, Indonesia, Nigeria, India). This raises sustainability and "farming" questions — [GoodDollar docs](https://docs.gooddollar.org/about-the-protocol/usage); [GoodDollar in numbers](https://docs.gooddollar.org/gooddollar-in-numbers)

### Inferences
- **"On-chain" does not equal "transparent credit".** Goldfinch's losses came from off-chain borrower behavior (related-party lending) that the blockchain could not see. Any credit project needs off-chain due diligence, covenants monitoring and local legal recourse.
- **Projects tied to national governments move on government timelines.** Kiva's four years were not enough. Hackathon projects should work with cooperatives, NGOs and MFIs rather than ministries.
- **Retail crypto in poor markets is expensive to serve** (KYC, support, fraud, regulation). That is why firms move to B2B, and it is a gap NGOs and social enterprises could fill.
- **Scam protection is a core design requirement, not an add-on.** Low-literacy users facing rising AI-driven impersonation need protections such as transaction delays, allow-lists, guardian or recovery contacts and "is this a scam?" checks.

### Gaps
- Kiva Protocol's promised post-mortem "learnings" posts were not found.
- No systematic data on how many low-income users lost money to crypto scams by country (Chainalysis does not break this down by income).
- Status of Goldfinch in 2025-2026 (current loan book, further defaults, recovery on Tugende) was not retrieved.
- No source found on a 2024-2025 Binance enforcement action in Nigeria (I did not search further after the first query returned nothing).

---

## 4. Unsolved gaps in 2025-2026 (on/off ramps, credit scoring, consumer protection, literacy, migrant workers, women)

### Takeaway
The bottlenecks are the **edges of the system**, not the chain:
- cash-in and cash-out for people with feature phones or no ID
- credit for people with no collateral and no history
- protection from scams
- the women's credit gap
- low-cost, regulated rails for SE Asian migrant workers in Singapore, Hong Kong and Taiwan, where crypto-based options remain thin and mostly unlaunched

These are the most promising problem spaces for a hackathon.

### Cited Findings

**On/off ramps and last mile**
- Kotani Pay's USSD approach exists because many users lack data connections or smartphones. USSD works on any handset and carrier with no data — [Kotani docs](https://docs.kotanipay.com/docs); [Solana Compass, Kotani Pay](https://solanacompass.com/projects/kotani-pay)
- MoneyGram's cash-out network (6,000+ locations in Colombia) shows that physical agents are still required for the off-ramp — [Blockworks](https://blockworks.co/news/moneygram-stablecoin-app-colombia)
- Banks charge ~15% vs ~3.5% for digital-only MTOs (Q3 2025). Price dispersion remains huge — [Axis Intelligence (RPW summary)](https://axis-intelligence.com/cross-border-payments-statistics/)

**Credit without collateral**
- On-chain credit typically requires over-collateralization, which excludes the poor. Union's social vouching is one alternative, but it remains small (~$326K TVL) — [ConsenSys](https://consensys.io/blog/union-protocol-a-trust-based-solution-for-uncollateralized-defi-lending); [DefiLlama](https://preview.dl.llama.fi/protocol/union-protocol)
- Findex 2025: credit, insurance and pensions lag account ownership — [CGAP](https://www.cgap.org/research/podcast/whats-next-for-financial-inclusion-unpacking-findex-2025)
- Kiva validated demand for "verifiable financial histories" before shutting down. The portable credit-history problem is unsolved — [Kiva](https://www.kiva.org/blog/sunset-kiva-protocol)
- Sarafu data shows chamas (rotating savings groups) are the natural organizing unit for community finance in Kenya — [arXiv 2207.08941](https://arxiv.org/pdf/2207.08941)

**Women's financial access (Findex 2025)**
- 73% of women in LMICs have accounts, up from 50% in 2014 and 66% in 2021. The LMIC gender gap is 5pp, down from 9pp for years; globally it is 77% of women vs 81% of men. Gaps persist in 65 LMICs and reach up to ~30pp in some countries (e.g., Pakistan) — [World Bank Data Blog](https://blogs.worldbank.org/en/opendata/more-women-have-financial-accounts--yet-equal-access-and-use-rem); [CGAP blog](https://www.cgap.org/blog/banking-on-progress-why-next-chapter-of-financial-inclusion-is-so-important); [Accion](https://www.accion.org/news/world-banks-global-findex-2025-shows-progress-on-financial-inclusion-accion-reaction/)
- Women's formal saving rose to 36% (from 22% in 2021) and their digital payments to 58% (from 50%). **Only 9% of women borrow to start or run a business, and only half of those use formal credit.** Women are also less able to raise emergency funds — [World Bank Data Blog](https://blogs.worldbank.org/en/opendata/more-women-have-financial-accounts--yet-equal-access-and-use-rem)
- In the Sarafu RCT, gender gaps in outcomes persisted even with the community-currency intervention — [Frontiers](https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2021.739751/pdf)

**Migrant workers in Singapore, Hong Kong and Taiwan sending money to SE Asia**
- Hong Kong has ~380K migrant domestic workers (year unspecified). Filipino bank remittances from HK were US$357M in Jan-May 2025 — [BusinessWorld](https://www.bworldonline.com/?p=435368)
- Existing non-crypto rails: TNG Wallet (HK) → GCash (PH); WeChat Pay HK + EMQ for PH/ID payouts; PearlPay + Transfez for Indonesian workers in HK (2020, dated) — [Manila Times (2018, dated)](https://manilatimes.net/2018/07/01/business/gcash-expands-remittance-business-in-hk-with-alipay/414588); [Electronic Payments International](https://electronicpaymentsinternational.com/news/company-news/wechat-pay-hk-taps-emq-expand-reach-southeast-asia); [DealStreetAsia](https://dealstreetasia.com/?p=2329)
- Crypto rail: Coins.ph × HashKey PHP↔HKD over regulated infrastructure (announced Aug 2025, launch unconfirmed) — [The Fintech Times](https://thefintechtimes.com/?p=60654)
- OFWs complain of 6-7% fees and 2-5 day delays (vendor blog) — [TransFi](https://www.transfi.com/jp/blog/how-ofws-are-using-stablecoins-to-send-money-home-faster)

**Consumer protection and literacy**
- Scam losses hit a record $17B in 2025, with AI impersonation up >1,400% — [Decrypt](https://decrypt.co/354624/ai-impersonation-drove-crypto-scam-losses-record-17-billion-2025-chainalysis)
- Yellow Card's retail exit left users with a withdrawal deadline. Unwithdrawn balances went to locked accounts recoverable with proof of ownership, which illustrates the custody and continuity risk for retail users — [bne IntelliNews](https://www.intellinews.com/nigeria-s-yellow-card-to-shut-retail-platform-shift-fully-to-b2b-stablecoin-payments-409617/)
- Nearly half of EM adults struggle to raise emergency funds. Financial resilience, not just account access, is now the policy focus — [CGAP](https://www.cgap.org/research/podcast/whats-next-for-financial-inclusion-unpacking-findex-2025)

### Inferences (hackathon opportunity map)
- **Migrant worker remittances (SG/HK/TW → PH/ID/VN/MM) is a strong fit for an SMU-hosted hackathon.** Regulated local-currency stablecoins now exist on both ends: PHPC in the Philippines, HKD stablecoins from HSBC and Anchorpoint in H2 2026, and a coming MAS SGD stablecoin framework. Few retail crypto products serve these workers, and Singapore-specific products were not found at all. A project could prototype a compliant "payday → family wallet" flow with built-in savings goals, scam warnings and a cash-out partner.
- **Digital savings groups (ROSCA / chama / paluwagan / arisan / 標會) on-chain** build on evidence that savings groups are the core of Sarafu's circulation. A savings record could double as a portable credit history: reputation from repayment in groups, which is Kiva's unfinished idea.
- **Women-focused credit**: only 9% of women in LMICs borrow for business. Group vouching (Union-style) combined with savings-group track records could be tested with an MFI partner.
- **Anti-scam UX for first-time stablecoin users** (transaction simulation, delay or cancel windows, trusted-contact co-sign) addresses the fastest-growing harm.
- **Feature-phone access (USSD/SMS) plus stablecoins** for the ~16% of LMIC adults without mobile phones or with basic phones. The 84% phone ownership figure implies roughly that share.

### Gaps
- No data found on crypto or stablecoin remittance usage by Indonesian, Filipino, Vietnamese or Myanmar workers in **Singapore or Taiwan** specifically. Taiwan had no results at all; this needs searches on MOM/MAS data and Taiwan FSC rules on migrant remittances.
- No quantitative studies found on the effectiveness of on-chain credit scoring or alternative data (e.g., repayment from savings groups) for the unbanked.
- No 2025-2026 RCT or independent impact evaluations of stablecoin wallets on household welfare were found. The Sarafu 2021 RCT is the main rigorous study.
- Financial literacy statistics specific to crypto users in EMs were not found.

---

## 5. Regulatory developments affecting this (GENIUS Act, MAS, Hong Kong, MiCA, plus EM regimes)

### Takeaway
2025-2026 is the year stablecoins became regulated payment instruments in the major hubs:
- **US**: the GENIUS Act was signed in 2025, with rules proposed but not final as of mid-2026 and an effective date by 18 Jan 2027 at the latest.
- **Hong Kong**: the ordinance has been in force since 1 Aug 2025, and the first two licenses were issued in Apr 2026.
- **Singapore**: MAS is consulting on the PS Act amendments (Sep-Oct 2026).
- **EU**: MiCA has pushed USDT off EU exchanges.

Emerging markets are building local-currency stablecoin sandboxes: Nigeria's cNGN, the Philippines' PHPC, and Turkey's licensing regime with its payment ban. The direction is toward a few licensed, bank-like issuers with strict AML/KYC, which improves safety but raises onboarding barriers for people without ID.

### Cited Findings

**United States: GENIUS Act**
- Most implementing rules are due one year after enactment; Treasury and banking-regulator rules were due 18 Jul 2026. The Act takes effect on the earlier of 18 Jan 2027 or 120 days after final rules — [Chapman GENIUS Act tracker (Jul 2026)](https://www.chapman.com/assets/htmldocuments/Chapman-GENIUS-Act-Rulemaking-and-Reporting-Tracker-071626.pdf); [JD Supra](https://www.jdsupra.com/legalnews/genius-act-implementation-key-proposals-9522631/)
- OCC, FDIC, Treasury and NCUA have proposed issuer rules. FinCEN and OFAC jointly proposed an AML/sanctions framework for permitted issuers (Apr 2026), and Treasury proposed principles for "substantially similar" state regimes (Apr 2026). As of mid-2026 **no final rules** had been issued and no state regime was certified — [Eco GENIUS 1-year tracker](https://eco.com/support/en/articles/15606775-genius-act-1-year-implementation-tracker-where-things-actually-stand); [Chapman tracker](https://www.chapman.com/assets/htmldocuments/Chapman-GENIUS-Act-Rulemaking-and-Reporting-Tracker-071626.pdf)

**Singapore: MAS single-currency stablecoin (SCS) framework**
- The framework (finalized Aug 2023) covers SGD- or G10-pegged single-currency stablecoins. It requires reserves ≥100% of outstanding supply and par redemption within 5 business days. Only MAS-licensed issuers may use the "MAS-regulated stablecoin" label — [ITNews Asia](https://www.itnews.asia/news/singapore-releases-regulatory-framework-for-stablecoins-599320); [Fireblocks](https://www.fireblocks.com/blog/mas-stablecoin-framework-impact)
- On 1 Sep 2026 MAS published a consultation on draft Payment Services Act amendments to implement the SCS framework, closing **16 Oct 2026**. Subsidiary legislation (reserve composition, redemption, recognition of foreign stablecoins) will follow, and multi-jurisdictional issuance models may be recognized. MAS expects only a limited number of authorized coins — [Gibson Dunn](https://www.gibsondunn.com/singapore-publishes-draft-legislation-to-implement-its-stablecoin-framework/); [The Paypers](https://thepaypers.com/crypto-web3-and-cbdc/news/mas-consults-on-legislative-changes-for-stablecoin-framework); [Rajah & Tann](https://www.rajahtannasia.com/?p=198122)

**Hong Kong: Stablecoins Ordinance**
- In force since 1 Aug 2025. It requires HKMA licensing for fiat-referenced stablecoin issuers, with rules on reserves, redemption, governance and AML — [Cointelegraph](https://cointelegraph.com/news/hong-kong-first-stablecoin-licenses-issued)
- 10 Apr 2026: the first two licenses went to **HSBC** and **Anchorpoint Financial** (a JV of Standard Chartered HK, HKT and Animoca Brands) out of 36 applications. Both plan HKD stablecoins in H2 2026. The HKMA warned about scams impersonating the licensees — [Charltons](https://www.charltonslaw.com/hkma-issues-first-stablecoin-issuer-licences/); [Fintech News HK](https://fintechnews.hk/34983/blockchain/hkma-stablecoin-licenses-2026/)

**EU: MiCA**
- Stablecoin (EMT) issuers must be authorized e-money institutions. Circle holds French ACPR authorization for USDC and EURC; Tether does not have authorization for USDT. ESMA told CASPs to restrict non-compliant stablecoins (Q1 2025 deadline), and the major exchanges delisted USDT for EEA users. Some sources describe a further hard date of 1 Jul 2026, with Revolut delisting USDT by 31 Aug 2026 (secondary, unverified) — [DL News](https://www.dlnews.com/articles/markets/kraken-delists-tether-usdt-in-europe-as-mica-rules-take-hold); [Benzinga (ESMA)](https://benzinga.com/content/43086240/esma-pushes-for-delisting-of-non-mica-compliant-stablecoins-sets-q1-2025-deadline); [Stablecoin Insider](https://stablecoininsider.org/micas-july-1-hard-deadline-is-here-what-changes-today-for-stablecoins-in-europe/)
- EURC monthly volume grew from ~$47M to >$7.5B (Jun 2024 - Jun 2025), with MiCA cited as a driver — [Bitcoinist (Chainalysis)](https://bitcoinist.com/crypto-adoption-2025-chainalysis-report/)

**Emerging-market regimes**
- **Nigeria**: cNGN (Feb 2025) runs in the SEC Regulatory Incubation Program, and the SEC launched a "Crypto Smart, Nigeria Strong" initiative to co-create stablecoin rules. A blog claims the 2025 Investments and Securities Act brought stablecoins under SEC oversight (unverified) — [BusinessDay](https://businessday.ng/technology/article/what-cngn-nigerias-stablecoin-means-for-crypto-adoption/); [Ledger Insights](https://ledgerinsights.com/?p=37125)
- **Philippines**: BSP sandbox for PHPC, with ongoing reporting, holder disclosure and third-party proof-of-reserve audits — [Fintech News PH](https://fintechnews.ph/67165/crypto/coins-ph-phpc-progresses-beyond-bsp-sandbox/)
- **Turkey**: crypto law (Jul 2024) with CASP licensing. Crypto payments remain banned (2021 CBRT rule). In Oct 2025 a draft bill was announced to let the regulator freeze crypto accounts tied to illicit activity — [Chambers 2026](https://practiceguides.chambers.com/practice-guides/blockchain-crypto-assets-2026/turkey); [Kaiko](https://www.kaiko.com/resources/whats-behind-turkeys-booming-crypto-market)

### Inferences
- **For a Singapore-hosted hackathon**, the MAS consultation (closing 16 Oct 2026) and Hong Kong's HKD stablecoins (launching H2 2026) make **regulated-stablecoin remittance corridors (SGD/HKD → PHP/IDR)** timely. Projects should design for licensed issuers and KYC from day one.
- **Regulation is splitting the market by stablecoin.** USDT dominates EM retail (Celo/MiniPay, Tron) but is restricted in the EU and not GENIUS-compliant by default. USDC dominates adjusted volume and regulated rails. A cross-border social-good app may need to handle both, plus local-currency coins (PHPC, cNGN, HKD coins).
- **Stricter KYC/AML (FinCEN/OFAC proposals, HKMA, MAS) can conflict with inclusion goals** for people without ID. Tiered KYC, verifiable credentials and NGO attestation are open design problems, close to Kiva Protocol's original thesis.

### Gaps
- Whether GENIUS Act final rules were issued after Jul 2026 was not confirmed. Check OCC, FDIC, Fed, Treasury and FinCEN.
- Whether HSBC or Anchorpoint HKD stablecoins have actually launched (as of Oct 2026) was not confirmed. Same for further HKMA licenses.
- Taiwan FSC stablecoin and virtual-asset regulation (relevant to migrant workers in Taiwan) was not researched.
- Exact current status of MiCA's 2026 USDT transitional deadlines is unverified (secondary sources only).
- The Indonesian (OJK) and Vietnamese crypto and stablecoin regimes affecting remittance receivers were not researched.
