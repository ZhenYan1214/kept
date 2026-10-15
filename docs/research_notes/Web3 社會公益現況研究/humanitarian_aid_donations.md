# Web3 / Blockchain for Humanitarian Aid, Charitable Giving & Donation Transparency (as of Oct 2026)

Research notes for the "Web3 for Social Good Hackathon 2026" (SMU / GSR Foundation / Univ. of Málaga). Judging: social impact 30%, solution quality 25%, meaningful use of Web3 20%, feasibility/sustainability 15%, pitch 10%.
Dates are marked as [YYYY]. Most program figures are self-reported by implementers or vendors. Independent evaluations are rare, and this is flagged where relevant.

---

## Q1. What major deployments exist and what were their measurable results?

### Takeaway
The deployments with real scale are permissioned or "invisible" blockchain systems run by UN agencies. WFP Building Blocks has moved about US$555M and also coordinates aid across agencies. Stablecoin cash pilots (UNHCR/Stellar in Ukraine, Mercy Corps/HesabPay in Syria and Afghanistan, NRC/CoalaPay in Sudan, UNICEF AidLink in Kenya) are small: US$3k to US$4.6M and 49 to 2,500 households. Crypto philanthropy rails (The Giving Block, Endaoment, Gitcoin/Giveth) handle tens of millions of dollars a year, mainly from US donors.

### Cited Findings

**WFP Building Blocks (Jordan, Bangladesh, Lebanon, Ukraine). Started 2017; current figures from the WFP page [accessed 2026]**
- About 4 million people supported each month. US$555M in cash-based transfers and 25 million transactions to date. US$3.5M saved in bank fees. — [WFP Building Blocks](https://www.wfp.org/building-blocks)
- WFP describes it as a "privately managed blockchain network." Organizations assisting the same people send aid to one shared blockchain account per household. All participating organizations are equal owners. The codebase is free to reputable humanitarian organizations. — [WFP Building Blocks](https://www.wfp.org/building-blocks)
- It serves over 1 million refugees in Jordan and Bangladesh. In Bangladesh it is also used to distribute UNICEF WASH items and UNFPA sexual and reproductive health items. — [WFP Building Blocks](https://www.wfp.org/building-blocks)
- Beirut blast [Aug 2020]: coordinated US$59M for 130,000 people on behalf of 17 organizations. — [WFP Building Blocks](https://www.wfp.org/building-blocks)
- Ukraine [1 May–31 Aug 2022]: 18 organizations flagged potential overlap in US$337M of assistance to 1 million unique households. This prevented US$35M of unintended duplicate aid (about 185,000 transfers). 30 organizations now use it in Ukraine. — [WFP Building Blocks](https://www.wfp.org/building-blocks)
- Reported savings vary by source and date: US$3.5M (WFP, UN Innovation Network [2023]), US$3M with US$475M transferred (OECD OPSI), and US$2.4M (older figures). — [UN Innovation Network](https://www.uninnovation.network/blog/how-the-building-blocks-blockchain-network-is-transforming-humanitarian-aid); [OECD OPSI](https://oecd-opsi.org/innovations/building-blocks/); [Center for a Digital Future](https://www.centerforadigitalfuture.org/blog/60kqfdgb4f8kljqy1j4ujvaqr1bx5y-364pg-bskhw-58gfs-c9t7w-cr3mn-ysa25-rmy2k)
- The UN Innovation Network reports that more than US$760M in assistance has passed through the platform. This differs from WFP's own US$555M figure, which counts WFP cash-based food transfers only. — [UN Innovation Network](https://www.uninnovation.network/blog/how-the-building-blocks-blockchain-network-is-transforming-humanitarian-aid)

**UNHCR + Stellar Aid Assist + USDC (Ukraine). Launched Dec 2022**
- Pilot run by UNHCR with UNICC and the Stellar Development Foundation. Recipients receive USDC in the Vibrant wallet. They cash out in USD, EUR or local currency at any MoneyGram location, or transfer to a bank account. Initial cities were Kyiv, Lviv and Vinnytsia. — [UNHCR press release](https://www.unhcr.org/news/press-releases/unhcr-wins-award-innovative-use-blockchain-solutions-provide-cash-forcibly); [Cointelegraph](https://cointelegraph.com/news/stellar-partners-with-unhcr-to-give-ukrainian-refugees-cash-via-usdc)
- By year two, about US$4.6M had gone to about 2,500 households. After year one the figure was about US$1.1M to 1,500+ individuals. The program has expanded to Argentina. — [Stellar Aid Assist 2-year post](https://stellar.org/blog/foundation-news/stellar-aid-assist-2-year-anniversary)
- CGAP [June 2026] describes the stack. UNHCR bought USDC directly from Circle with no third-party exchange. Stellar Disbursement Platform (open source) handled bulk sends. Vesseo provided a self-custodial wallet. MoneyGram's 4,500+ locations in Ukraine were the off-ramp. Funds can be cashed out across borders, for example in Polish zloty. — [CGAP, Stablecoins in Humanitarian Cash Transfers (2026)](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers) ([PDF via CALP](https://www.calpnetwork.org/wp-content/uploads/2026/09/Stablecoins-in-humanitarian-cash-transfers-finalF.pdf))
- Won the "Best Impact Project Award" at Paris Blockchain Week 2023. — [Center for a Digital Future](https://www.centerforadigitalfuture.org/blog/60kqfdgb4f8kljqy1j4ujvaqr1bx5y-364pg-bskhw-58gfs-c9t7w-cr3mn-Y6Fse-6p66f)

**Mercy Corps / Mercy Corps Ventures stablecoin pilots (Syria, Afghanistan, Myanmar, Kenya) [2024–2026]**
- NE Syria with HesabPay: about US$30,000 in USDC for agricultural inputs. Payment time fell from an average of 28 days to under 1 day (a 96% reduction). Cost was 60% lower than informal money transfer agents. 72% of participants preferred stablecoins to physical cash. Sources disagree on reach: about 100 farmers vs. over 400 people. — [Crypto Council for Innovation summary](https://cryptoforinnovation.org/stablecoin-payments-transform-humanitarian-aid-delivery-in-syria/)
- Mercy Corps brief "Crypto in Mercy Corps" [Dec 2025 / Jan 2026] covers pilots in Myanmar, Afghanistan, Kenya and Syria. — [Mercy Corps PDF](https://www.mercycorps.org/sites/default/files/2025-12/crypto-in-mercy-corps.pdf); [Mercy Corps Digital Cash Series](https://www.mercycorps.org/research-resources/digital-cash-series-crypto-cash-assistance)
- CGAP reports a Myanmar corridor result of 45–62% reduction in transfer time, plus the Syria figure of 28 days to under 1 day. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- Afghanistan [early 2025]: CDDO, HesabPay and Mercy Corps Ventures sent US$100/month to 100 rural households near Gardez. Payments used HAFN, a permissioned stablecoin pegged to the Afghan afghani and built on Algorand. The system is closed-loop and fully custodial. Recipients use offline-capable AfPay magstripe/QR cards. HesabPay deployed satellite connectivity hubs. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- Undisclosed country (withheld for security): Mercy Corps sends USDC on Polygon through the Lydian platform to local NGO partners' self-custodial wallets (Web3Auth). Partners convert to fiat with local exchangers and deliver physical cash. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)

**NRC + CoalaPay (Sudan) [2025–26]**
- NRC transfers USDC on Stellar and Base through CoalaPay to local MTOs, hawalas and commercial partners. Partners convert to Sudanese pounds at agreed rates and pay recipients by cash, voucher or bank transfer (Bankak). Partners often settle offshore obligations with the USDC instead of off-ramping locally. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)

**CARE Ecuador + Umoja Labs + Celo [2022]**
- 250 women received cUSD on NFC tap cards, redeemable at 8 health providers (pharmacies, clinics, labs). This was a closed-loop, restricted-spend design. No FX was needed because Ecuador is dollarized. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)

**UNICEF Venture Fund / AidLink (Kenya) [pilot Dec 2025, results Mar 2026]**
- 49 beneficiaries with intellectual disabilities in Greater Nairobi each received 65 USDC through an SMS wallet on feature phones (no app or internet). Funds were off-ramped to M-Pesa via Kotani Pay. Partners: Advantage Africa, Rumsan, Xcapit, Kotani Pay. 100% received and cashed out. 79.6% of transactions completed in about 19 minutes on average. One took 2 days because the recipient had no electricity. Problems included case-sensitive SMS commands, mistyped phone numbers, recipients arriving with SIMs but no phones, a temporary KES liquidity shortage, and RPC node outages. A public Dune dashboard was used for verification. No personal data was put on-chain. An earlier pilot in Cusco, Peru reached 270 beneficiaries. — [Xcapit blog (vendor)](https://www.xcapit.com/en/blog/aidlink-kenya-pilot-results)

**Rahat (Rumsan, Nepal): anticipatory cash on blockchain [2024–2025]**
- 2024 monsoon pilot (Bardiya/Kailali) with Danish Red Cross and Nepal Red Cross. 4,500+ households received early warnings. 774 households got cash via banks within about 5.5–6 hours of the trigger. 800+ people were trained in digital financial literacy. 98% self-reported taking protective action. Disbursement uses a multi-signature smart contract that combines forecast triggers with human approvals. It works over SMS and USSD. — [NRCS/Danish RC case study PDF](https://nrcs.org/wp-content/uploads/2025/03/Use-of-digital-and-blockchain-technologies-into-Anticipatory-Action-2024-Monsoon-Pilot-Program.pdf); [IHSA paper](https://conference.ihsa.info/call-for-papers/view/6197); [UNICEF Venture Fund](https://www.unicefventurefund.org/story/oss-episode-1-transparent-aid-distribution-blockchain); [GSMA case study](https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/gsma_resources/rumsan-leveraging-blockchain-for-anticipatory-action-and-cash-assistance-in-nepal/); [Reach Alliance 2026](https://reachalliance.org/blog/2026/04/scaling-humanitarian-aid-in-southeast-asia-before-disaster-strikes-from-research-to-action/)
- Sources disagree on the unit (774 "people" vs. "households"). A full cost analysis is still pending. — [Reach Alliance](https://reachalliance.org/blog/2026/04/scaling-humanitarian-aid-in-southeast-asia-before-disaster-strikes-from-research-to-action/); [UNICEF Venture Fund](https://www.unicefventurefund.org/story/oss-episode-1-transparent-aid-distribution-blockchain)

**Older pilots [2017–2021]**
- Sikka (Nepal, Kathmandu Living Labs/USAID-linked): cash to 73 workers in Sindhupalchowk, with a self-reported 78% reduction in payment administration costs. In Aug 2017, Nepal Rastra Bank banned crypto transfers, which forced a redesign. — [Sikka Medium (team)](https://medium.com/@davisjes/sikka-working-at-the-intersection-of-blockchain-and-humanitarian-innovation-2c752332c616); [Sikka: One Year Later](https://medium.com/@saujanyaacharya/sikka-lessons-learned-and-recent-developments-8fda5b1b83cf)
- Disberse (UK aid / Start Network pilots): the Frontier Tech Hub review found that the strongest impact "comes not from the decentralised nature" of the platform but from centralised, coordinated management of financial flows. It also found the emphasis on blockchain distracted stakeholders. — [Frontier Tech Hub](https://www.frontiertechhub.org/pilot-portfolio/tracking-ukaid-blockchain); [Start Network](https://startnetwork.org/learn-change/news-and-blogs/blockchain-experiment-humanitarian-aid)
- IFRC + Kenya Red Cross open-loop blockchain cash pilot (Isiolo, May 2018): 2,000+ drought-affected households, linked to M-Pesa. It also tested blockchain digital IDs for people without national ID. — [Cash Hub](https://cash-hub.org/resource/blockchain-technology-in-humanitarian-programming-a-pilot-project-in-cash-transfer-programming-in-kenya); [IFRC Learning Review PDF](https://preparecenter.org/sites/default/files/kenya_blockchain_open_loop_pilot.pdf)
- Sarafu (Grassroots Economics + Kenya Red Cross, from 2019): community-currency vouchers of KES 400/week (about US$4) in Mukuru; about 4,000 residents registered [2021]. — [CNBC Africa 2021](https://www.cnbcafrica.com/2021/feature-kenya-slum-dwellers-battle-covid-19-downturn-with-virtual-currency)

**UNICEF CryptoFund / Venture Fund**
- Launched Oct 2019 as a fund denominated in BTC/ETH. It gives open-source startups up to US$100k in equity-free seed funding. Example: June 2020, four Latin American startups received 125 ETH. — [UNICEF CryptoFund](https://www.unicef.org/innovation/CryptoFundInvestments); [Contxto](https://www.contxto.com/en/central-america/unicef-cryptocurrency-fund-startups-latin-america/)
- In Jan 2023, a UNICEF Venture Fund + Giga cohort funded 4 blockchain startups for digital inclusion. — [UNICEF blockchain-Giga cohort](https://www.unicef.org/innovation/blockchain-giga-cohort)

**Crypto philanthropy rails**
- The Giving Block, 2026 report covering 2025: over US$100M in crypto donations processed (its largest year, +66% YoY). Over US$300M cumulative since 2018. 22,343 donations. Average gift US$11,019. Over US$32M in stablecoins (USDC, RLUSD, USDT, DAI), about one-third of volume. The stablecoin total includes a US$25M RLUSD pledge that may be from Ripple. 88% of donations came from the US. Top causes: Education, Health, Food & Water, Children, Animals. 1 in 5 nonprofits on the platform raised over US$100k. — [The Giving Block 2026 Annual Report](https://thegivingblock.com/annual-report/); [Cointelegraph](https://cointelegraph.com/news/giving-block-stablecoin-donations-surge)
- The earlier report covering 2024 claimed "over $1B" in crypto donated to nonprofits across the market and projected about US$2.5B for 2025. Those are market-wide estimates, not platform totals, and the projection is not verified. — [TGB 2025 Annual Report PDF](https://go.thegivingblock.com/hubfs/2025%20Annual%20Report/2025%20Annual%20Report%20on%20Crypto%20Philanthropy.pdf); [Cointelegraph](https://cointelegraph.com/news/giving-block-stablecoin-donations-surge)
- Endaoment (crypto-native DAF, EIN 84-4661797): 2024 giving of about US$34.8M–36.9M per its Form 990-PF (aggregator figures differ). US$50M lifetime donations was passed in 2022. US$130M+ lifetime (undated). — [Grantable](https://grantable.co/funders/endaoment-inc-morg_eae19f6076dc4407b383e4921a39143a); [Endaoment blog](https://blog.endaoment.org/blog/endaoment-celebrates-50-million-donations); [Web3 Impact Toolkit](https://web3impacttoolkit.notion.site/Endaoment-24e3139d12538092a9b1dafbbbc01a9f)
- Gitcoin Grants: GG23 [mid-2025] distributed over US$600k in matching to 235 projects from about 10,000 donors. GG24 [Oct 2025] had about US$1.8M in matching across six domains. Giveth ran QF rounds inside GG24: US$300k matching, 64 projects, 1,286 donors. — [Gitcoin GG23 retro](https://gitcoin.co/blog/gitcoin-grants-23-retro); [Gitcoin GG24](https://gitcoin.co/campaigns/gitcoin-grants-24-gg24)
- Endaoment + Gitcoin "Universal Impact Pool" [2023]: US$200k seed, distributing 25% per quarter. — [NonProfit PRO](https://www.nonprofitpro.com/article/endaoment-and-gitcoin-unveil-new-200000-universal-impact-pool/)

**Disaster crypto giving**
- Turkey–Syria earthquake [Feb 2023]: the Turkish NGO Ahbap claimed about US$4.2–4.3M in crypto, mostly stablecoins. On-chain trackers showed about US$2.2M at the address at one point. Vitalik Buterin gave 99 ETH. Binance's reported contribution was about US$5M, with an unconfirmed claim of US$10M (sources conflict). Avalanche donated US$1M. — [BeInCrypto](https://beincrypto.com/how-crypto-community-helping-victims-turkish-earthquake/); [ForkLog](https://forklog.com/en/vitalik-buterin-donates-99-eth-to-turkey-syria-earthquake-victims/); [CoinBasics](https://coinbasics.beehiiv.com/p/earthquake-response-turkey-syria)
- Ukraine [2022]: Binance Charity committed US$10M. UNHCR accepted its first stablecoin donation (US$2.5M BUSD), and UNICEF received an equivalent of US$2.5M. Crypto donations to Ukraine's government and NGOs reached about US$17.2M in the early weeks. — [USA for UNHCR](https://admin.unrefugees.org/news/the-un-refugee-agency-accepts-first-stablecoin-crypto-donation-of-25m-from-binance-charity-to-support-ukraine-efforts); [Benzinga](https://benzinga.com/markets/asia/22/02/25877708/binance-is-donating-10m-to-help-the-humanitarian-crisis-in-ukraine); [Yahoo Finance](https://finance.yahoo.com/news/binance-donates-2-5m-crypto-030532213.html)

### Inferences
- The largest real-world blockchain aid system (Building Blocks) succeeds as a coordination and deduplication layer among agencies, not as a beneficiary-facing crypto system. Recipients never see the blockchain. Its most striking number, US$35M in duplicate aid avoided in Ukraine, is a coordination outcome.
- Stablecoin pilots cluster in places where banking has broken down (Syria, Afghanistan, Sudan, Myanmar). That is where the "stablecoin vs. no transfer at all" argument holds.
- Crypto philanthropy is concentrated in the US and among wealthy donors (average gift about US$11k). It is mostly a donation on-ramp and does little to make spending transparent once funds reach the NGO.

### Gaps
- No current (2025–26) figures for Aid:Tech, Disberse, Sikka or Binance Charity. They appear inactive or rebranded, but I found no explicit shutdown notice.
- GiveDirectly's crypto donation volumes were not found in this search.
- Endaoment's 2025 totals are not yet public. They should appear in the 2025 Form 990.
- No independent impact evaluation was found for UNHCR Ukraine, Mercy Corps Syria or AidLink. All figures are self-reported.
- Building Blocks figures differ across sources (US$555M vs. US$760M+, savings of US$2.4M–3.5M) because of different cutoffs and definitions.

---

## Q2. What problems were they solving, and what is the evidence of impact?

### Takeaway
The problems are leakage and duplication, bank fees and FX costs, slow or blocked cross-border corridors (de-risking, sanctions), physical cash risk, and donor-facing traceability. CGAP's 2026 review is the strongest evidence base. It finds that stablecoins clearly help market access in broken corridors and help with speed and transparency. Total cost is mixed: costs move around rather than disappear, and in direct-to-wallet models they often land on recipients.

### Cited Findings
- Humanitarian cash and voucher assistance (CVA) peaked at US$10.6B in 2022, about 24% of all humanitarian aid. It has declined since because of budget shortfalls. — [CGAP 2026, citing CALP 2025](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- Fiat problems CGAP identifies: correspondent banking withdrawal, cross-border fees averaging 6.5% (higher in fragile states, with FX margins the largest hidden cost), multi-day or multi-week delays, local liquidity collapse, cash-out fees, low trust in digital tools, and recipient surveillance risk. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- Two models in use: (1) **via local disbursement partner**, where stablecoins are used only for the bulk cross-border leg and the recipient experience is unchanged; (2) **direct to recipient wallet**, which is rare and needs off-ramp, merchant, smartphone and literacy investment. CGAP calls model 1 "a realistic starting point for most programs." — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- CGAP scorecard:
  - Cost: MIXED (via-partner) / MIXED-WORSE (direct). Recipients may pay 3–8% cash-out costs.
  - Timing: same-day cross-border settlement. Examples: Syria 28 days to under 1 day; Myanmar 45–62% time reduction.
  - Market access: BETTER, the strongest case.
  - Transparency: end-to-end traceability in the direct model, but permanent records create data-protection obligations.
  - Last mile: no gain in the via-partner model.
  — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- Indicative fees: on-ramp 0–0.5%, gas a fraction of a cent on Stellar, Celo, Algorand and Base (but it accumulates in batch payouts), wallet provider fees in pilots. Implementer bears about 2–6% and recipient about 3–8% in the direct model. Bespoke acceptance networks (Afghanistan, Ecuador) add setup costs that per-transaction figures do not capture. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- CGAP notes the same benefits can sometimes be achieved with fiat. Example: the Afghanistan Humanitarian Exchange Facility lets local partners receive USD offshore in exchange for distributing AFN locally. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- Deduplication and coordination: Building Blocks prevented US$35M of overlapping aid in Ukraine across 18 organizations [2022]. — [WFP](https://www.wfp.org/building-blocks)
- Speed in anticipatory action: Rahat moved cash to 774 recipients (households or people; sources disagree) in about 5.5–6 hours after a flood trigger [2024]. — [Reach Alliance](https://reachalliance.org/blog/2026/04/scaling-humanitarian-aid-in-southeast-asia-before-disaster-strikes-from-research-to-action/)
- Portability: UNHCR Ukraine recipients could cash out in neighboring countries (e.g., PLN), which matters for displaced people. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- Disberse: the real value came from centralised coordination of fund flows, not decentralisation. — [Frontier Tech Hub](https://www.frontiertechhub.org/pilot-portfolio/tracking-ukaid-blockchain)

### Inferences
- The defensible Web3 value propositions are (a) settlement in corridors fiat cannot reach; (b) a shared ledger for multi-agency deduplication and coordination; (c) publicly verifiable fund flows for donors (e.g., Dune dashboards); and (d) programmable, conditional or trigger-based release (Rahat). "Lower fees" alone is weak evidence and contested.
- A hackathon pitch scoring well on "meaningful use of Web3" should pick a problem where a shared, tamper-evident, multi-party ledger or open settlement rail is actually needed. Examples: multiple NGOs needing deduplication, donors needing proof without trusting a single NGO's database, cross-border corridors with no banking.

### Gaps
- No rigorous, comparable cost study yet. CGAP says it is still open whether reported savings "survive rigorous, comparable measurement."
- Little outcome-level evidence (welfare effects on recipients) compared with fiat cash. Most metrics are operational (speed, fees, completion rate).

---

## Q3. What failed or was criticized?

### Takeaway
The main critiques are: blockchain used "in name only" where a database would do; success measured by donor-friendly metrics; immutability conflicting with data correction and erasure rights; biometric and transaction-metadata privacy risks; off-ramp and connectivity barriers; regulatory bans and sanctions; and costs and risks shifted onto recipients.

### Cited Findings
- Cheesman, "Conjuring a Blockchain Pilot" (Geopolitics, Aug 2024), fieldwork 2018–2019 in Za'atari and Azraq camps, Jordan (Cash4Work):
  - The private, permissioned Ethereum-based pilot was called a "BINO" (blockchain in name only). Its project manager publicly admitted a normal shared database could have achieved the same outcomes.
  - The pilot used narrow donor-friendly metrics (traceability, fee reduction) that created an "illusion of success."
  - False data entered on-chain could not be corrected by beneficiaries.
  - Aid workers could upload data but had no access to the "transparency."
  — [Taylor & Francis](https://www.tandfonline.com/doi/full/10.1080/14650045.2024.2389284); [ICTworks summary](https://www.ictworks.org/conjuring-blockchain-pilots/); [PDF](https://www.ictworks.org/wp-content/uploads/2024/09/Conjuring-Blockchain-Pilot-Humanitarian-Aid.pdf)
- A secondary summary of the same research reports added costs, miscommunication between supermarket cashiers and camp staff, and low familiarity among aid workers and refugees. — [Kalkine Media](https://kalkinemedia.com/news/cryptocurrency/blockchain-conjuring-falls-short-in-enhancing-humanitarian-aid)
- Book: Cheesman, *When Blockchain Meets Aid: The Human Costs of Innovation* (Princeton UP; the listing shows a 2027 publication date). It argues the experiment imposes new burdens and surveillance on refugees and aid workers and recentres power in distant commercial actors. — [Princeton UP](https://press.princeton.edu/books/paperback/9780691291703/when-blockchain-meets-aid)
- ODI HPN, "Privacy in peril" (Aug 26, 2025, by Zcash Foundation authors):
  - Startup-led pilots "often neglect digital privacy safeguards," which can put participants in life-threatening situations.
  - Specific risks: immutability vs. rights to erasure and rectification; re-identification from pseudonymous metadata in small groups; biometric (iris) linkage; behavioural inference from transaction history.
  - Building Blocks Jordan is cited for using iris scanners while lacking clear data governance.
  - Recommendations: Privacy Impact Assessments, data minimisation, ZK proofs, consent and opt-out, redress channels, open-source auditable components.
  — [ODI HPN](https://odihpn.org/en/publication/privacy-in-peril-safeguarding-digital-data-in-humanitarian-blockchain-initiatives/)
- CGAP [2026] on direct-to-wallet stablecoin aid:
  - It shifts FX and cash-out costs (3–8%) to "those least able to absorb it."
  - Wallet providers are often unregulated in the country of operation, with limited consumer protection or recourse and no deposit insurance.
  - Bespoke merchant networks "may not outlast the pilot."
  - On-chain records are permanent and public, which creates surveillance risk.
  — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- Sanctions and regulation [2026]: under the US GENIUS Act (2025), issuers are financial institutions able to freeze tokens. Tether and Circle have frozen OFAC-designated addresses. It is untested how OFAC humanitarian general licences (e.g., Afghanistan GLs 14–20, UNSCR 2664) apply on stablecoin rails. Stablecoins bypass monetary policy, capital controls and financial intelligence functions (dollarization risk). — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- An academic legal analysis [Mar 2026] examines INGO liability under international humanitarian law for using stablecoins in Syria, using the Mercy Corps pilot as the case. — [Case Western Cox Center PDF](https://case.edu/law/cox-international-law-center/sites/default/files/2026-03/IHL%26Stablecoins%20-%20RS%20edited%20Accessible%20FINAL%20COX%20VERSION%203-23-2026.pdf)
- Regulatory shutdown risk: Nepal Rastra Bank's Aug 2017 crypto ban halted Sikka's first pilot. — [Sikka: One Year Later](https://medium.com/@saujanyaacharya/sikka-lessons-learned-and-recent-developments-8fda5b1b83cf)
- Operational failures in recent pilots: AidLink Kenya [Dec 2025] hit SMS UX errors, wrong phone numbers, no-phone recipients, off-ramp liquidity shortage, RPC outages and power outages. — [Xcapit](https://www.xcapit.com/en/blog/aidlink-kenya-pilot-results)
- Disaster crypto donation transparency was imperfect. Ahbap's claimed US$4.2M differed from the roughly US$2.2M on-chain balance at the time, and Binance's figures conflict across outlets. — [BeInCrypto](https://beincrypto.com/how-crypto-community-helping-victims-turkish-earthquake/); [CoinBasics](https://coinbasics.beehiiv.com/p/earthquake-response-turkey-syria)
- "Blockchain not needed": the Disberse review found the blockchain emphasis was "a distraction to stakeholders." — [Frontier Tech Hub](https://www.frontiertechhub.org/pilot-portfolio/tracking-ukaid-blockchain)

### Inferences
- Judges, especially SMU and academic judges, are likely to know the BINO critique. A strong pitch should say up front why a conventional database or mobile money is insufficient, and show privacy-by-design: no PII on-chain, ZK or eligibility proofs, a way to correct mistakes.
- "Transparency" that only serves donors and not beneficiaries or field staff is a known failure mode. Designs that give beneficiaries visibility and recourse address a stated gap.

### Gaps
- No public post-mortems were found for specific discontinued startups (Aid:Tech, Disberse, AIDONIC, etc.).

---

## Q4. What gaps remain unsolved in 2025–2026?

### Takeaway
Open problems: last-mile cash-out (off-ramp liquidity, agent networks), offline and feature-phone access, beneficiary privacy vs. donor traceability, verification of actual delivery and impact (not just fund movement), consumer protection and recourse for wallet users, regulatory clarity (sanctions exemptions, local licensing), sustainability after pilots, and access for small NGOs.

### Cited Findings
- CGAP lists open questions: whether cost savings survive rigorous measurement; whether UN humanitarian exemptions apply to stablecoin rails; whether trust and cultural acceptance can scale; whether program-specific off-ramp networks can become durable market infrastructure. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- Last mile: "the off-ramp network replaces — but does not remove — the last-mile delivery challenge." Merchant acceptance is "very limited in most markets." The same fragile contexts where stablecoins help with cross-border transfers have the weakest digital infrastructure. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- Self-custodial wallets bring higher AML compliance challenges (FATF 2026). — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- Offline and low-tech workarounds exist but need investment: HesabPay satellite hubs and offline AfPay cards; Rahat SMS/USSD/voice; AidLink SMS wallet with a USSD redesign planned. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers); [GSMA Rahat](https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/gsma_resources/rumsan-leveraging-blockchain-for-anticipatory-action-and-cash-assistance-in-nepal/); [Xcapit](https://www.xcapit.com/en/blog/aidlink-kenya-pilot-results)
- Privacy-preserving payments: Mercy Corps Ventures, Aleo, Humanity Link, GOAL and the Danish Refugee Council announced [Apr 2026] a pilot delivering aid in USDCx, a private stablecoin on Aleo, to displaced people near the Venezuelan border. Recipients use WhatsApp, and identity is shielded from merchants. Results are due late 2026. — [Aleo blog](https://aleo.org/post/private-stablecoins-humanitarian-aid/)
- Mercy Corps is also cited as testing zero-knowledge eligibility proofs in Colombia (secondary, unverified source). — [Coincub blog](https://coincub.com/blog/humanitarian-blockchain-that-works/)
- Impact proof: Hypercerts (ERC-1155 impact claims, deployed on Optimism and Celo) and the Ethereum Attestation Service are proposed for on-chain impact records. Limits: they work only retroactively, struggle where impact is hard to measure or verify, and "evaluation remains the hardest problem." The GreenPill trial [late 2023] was tiny: 170 donors, US$552 direct and US$2,237 matching. — [Gitcoin: Hypercerts](https://gitcoin.co/mechanisms/impact-certificates-hypercerts); [GreenPill case study](https://gitcoin.co/case-studies/greenpill-hypercerts-experiment-impact-certificates-in-practice); [Protocol Labs](https://protocol.ai/blog/hypercert-new-primitive)
- Data correction and governance: no beneficiary mechanism to fix wrong on-chain data (Jordan). — [Cheesman 2024](https://www.tandfonline.com/doi/full/10.1080/14650045.2024.2389284)
- Rahat cost-effectiveness analysis is still pending. — [UNICEF Venture Fund](https://www.unicefventurefund.org/story/oss-episode-1-transparent-aid-distribution-blockchain)

### Inferences
- Promising hackathon spaces that the evidence identifies as unsolved:
  1. **Proof of delivery and impact at the last mile.** On-chain records show money moved, not that goods or services arrived or that outcomes happened. Possible approaches: attestations from community verifiers, merchants or field staff, with ZK eligibility.
  2. **Privacy-preserving eligibility and deduplication across NGOs.** This applies the Building Blocks coordination idea, with ZK or nullifiers instead of iris data on shared systems.
  3. **Offline or feature-phone first wallets** with clear cash-out cost disclosure for recipients.
  4. **Small-NGO toolkits.** Open-source rails (Stellar Disbursement Platform, Algorand Aid Assist, Rahat) exist, but small local NGOs lack compliance and off-ramp onboarding.
  5. **Beneficiary-side transparency and grievance/redress.**
  6. **Donor-facing verifiable reporting** (e.g., Dune-style dashboards plus attestations) for crypto donations, addressing the Ahbap-style mismatch between claimed and on-chain totals.
- Feasibility (15%): the via-partner model or open-source rails are more realistic than building new merchant networks.

### Gaps
- I found no systematic data on how many small or local NGOs use blockchain rails, or what barriers they report.
- No evidence yet on whether ZK or private-stablecoin pilots work for recipients. Mercy Corps/Aleo results are due late 2026 and were not yet published at the time of research.

---

## Q5. Recent 2025–2026 news and trends

### Takeaway
2025–26 has moved from "blockchain for aid" to "stablecoins for humanitarian cash." Drivers include the US GENIUS Act (2025) and Circle and Ripple philanthropy. There is more institutional analysis (CGAP/World Bank June 2026, Mercy Corps 2026 brief, ODI 2025), more privacy-preserving pilots, and stablecoins make up about a third of crypto donations on The Giving Block.

### Cited Findings
- **CGAP/World Bank "Stablecoins in Humanitarian Cash Transfers" (June 2026)**, authors Cook, Lennox, Murray and Sbeih. Reviewers included UNICEF, DRC, Algorand Foundation, CALP and ECHO. Recommends the via-partner model as the default and says funders should design "backwards from the off-ramp." — [CGAP](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers); [World Bank PDF](https://documents1.worldbank.org/curated/en/099063026162074449/pdf/P511773-dff11519-3fef-46a5-97bf-f4f950846346.pdf)
- **Circle Foundation backs UNDP and WFP** to pilot regulated stablecoin aid payments [reported Sept 26, 2026]. No grant amounts, countries, corridors or off-ramps were disclosed, and it is described as "a test, not a rollout." — [SpendNode (citing Cointelegraph)](https://www.spendnode.io/blog/circle-foundation-stablecoin-payments-un-humanitarian-aid-september-2026/); [Phemex News](https://phemex.com/news/article/circle-foundation-grants-stablecoin-funding-to-undp-and-world-food-programme-for-humanitarian-aid-97878)
- **Mercy Corps/Aleo private stablecoin pilot** (Venezuela border, announced Apr 2026). — [Aleo](https://aleo.org/post/private-stablecoins-humanitarian-aid/)
- **NRC using CoalaPay USDC in Sudan** (via-partner model). — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- **UNICEF Venture Fund AidLink Kenya results** (Mar 2026). — [Xcapit](https://www.xcapit.com/en/blog/aidlink-kenya-pilot-results)
- **Mercy Corps "Crypto in Mercy Corps" brief** (Dec 2025/Jan 2026) on Myanmar, Afghanistan, Kenya and Syria. — [Mercy Corps](https://www.mercycorps.org/sites/default/files/2025-12/crypto-in-mercy-corps.pdf)
- **ODI HPN privacy critique** (Aug 2025). — [ODI HPN](https://odihpn.org/en/publication/privacy-in-peril-safeguarding-digital-data-in-humanitarian-blockchain-initiatives/)
- **Regulation:** the US GENIUS Act (2025) makes stablecoin issuers financial institutions with freeze capability. EU MiCA treats them as "e-money token issuers." The Fed proposed its first GENIUS Act stablecoin rules [Sept 2026]. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers); [SpendNode](https://www.spendnode.io/blog/circle-foundation-stablecoin-payments-un-humanitarian-aid-september-2026/)
- **Crypto donations:** stablecoins reached about one-third (over US$32M) of The Giving Block's US$100M+ in 2025. Online stock giving rose 127% and digital DAF giving more than doubled, a sign the platform is shifting to "digital donor" multi-asset giving. — [The Giving Block 2026 report](https://thegivingblock.com/annual-report/)
- **Local-currency stablecoins** (HAFN in Afghanistan) are emerging to remove recipient FX risk. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- **Anticipatory action on blockchain** is scaling. Rahat's next testing ground was proposed for the Philippines after Reach Alliance's 2025 hackathon. — [Reach Alliance 2026](https://reachalliance.org/blog/2026/04/scaling-humanitarian-aid-in-southeast-asia-before-disaster-strikes-from-research-to-action/)
- Humanitarian budget cuts: CVA declined over the three years before 2026, which increases pressure for efficiency tech. — [CGAP 2026](https://www.cgap.org/research/stablecoins-in-humanitarian-cash-transfers)
- LSE International Development blog (Jul 2025) published a 2025 status overview of blockchain in the humanitarian sector. I could not retrieve its content (HTTP 403). — [LSE blog](https://blogs.lse.ac.uk/internationaldevelopment/2025/07/10/how-blockchain-is-contributing-to-the-humanitarian-sector-as-of-2025/)

### Inferences
- Asia-Pacific relevance for an SMU-hosted hackathon: Rahat (Nepal, possibly the Philippines next), WFP Bangladesh (Rohingya), HesabPay (Afghanistan) and Myanmar corridors are close regional reference cases.
- The trend favours "invisible blockchain" designs: stablecoin settlement plus SMS/USSD, cards or mobile money at the edge, with privacy layers (ZK or private stablecoins) and on-chain attestations for impact. These are likely to score best across solution quality, Web3 use and feasibility.

### Gaps
- No final results yet for the Circle–UNDP/WFP or Mercy Corps/Aleo pilots (as of Oct 2026).
- No 2025–26 news found for UNHCR expanding Stellar disbursements beyond Ukraine and Argentina, or for IFRC's current blockchain work beyond Rahat and Sarafu.
- Market-wide crypto donation totals for 2025, as opposed to The Giving Block platform totals, were not found from a reliable source.
