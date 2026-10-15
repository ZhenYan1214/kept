# Web3 Identity (DID / VC / Proof of Personhood) and Applications in Education & Healthcare for Social Good

Research date: 2026-10-14. Dates in brackets mark when the underlying fact/source is from. Every claim has a source; anything unsourced is under "Gaps".
Purpose: input for a student team brainstorming a project for the Web3 for Social Good Hackathon 2026 (SMU / GSR Foundation / University of Málaga).

---

## Q1. Identity for the underserved: the ID gap, refugees, SSI standards, EUDI Wallet, Singapore, Bhutan NDI, MOSIP

### Takeaway
The official World Bank figure is still about 850M people with no official ID, from 2021 data. A far larger group, around 3.3B, cannot use a government-recognised digital ID online. The standards now exist: W3C VC 2.0 became a Recommendation in May 2025, and OpenID4VCI 1.0 and HAIP 1.0 became Final Specifications in 2025. National rollouts are real but uneven. As of October 2026 only Denmark has an EUDI wallet in production, even though the legal deadline is around 24 Dec 2026. Bhutan moved its SSI national ID from Polygon to Ethereum. MOSIP and Inji are the main open-source digital public infrastructure (DPI) route for the Global South.

### Cited Findings

**Scale of the ID gap (World Bank ID4D)**
- About 850M people worldwide had no official proof of identity as of 2021. Roughly half are children, and most live in lower-income countries in Africa and South Asia. [ID4D Global Dataset 2021, published 2022] — [World Bank blog](https://blogs.worldbank.org/digital-development/850-million-people-globally-dont-have-id-why-matters-and-what-we-can-do-about); [ID4D homepage](https://id4d.worldbank.org/)
- The same dataset gives wider gaps:
  - at least 1.1B people have no digital record of their identity;
  - 1.25B have no digitally verifiable identity;
  - 3.3B have no access to a government-recognised digital ID they can use to transact securely online. — [World Bank blog](https://blogs.worldbank.org/digital-development/850-million-people-globally-dont-have-id-why-matters-and-what-we-can-do-about)
- Women in low-income countries are 8 percentage points less likely than men to have an ID. The previous estimate, from 2018, was just under 1B people without ID. — [World Bank blog](https://blogs.worldbank.org/digital-development/850-million-people-globally-dont-have-id-why-matters-and-what-we-can-do-about); [Open Knowledge Repository](https://openknowledge.worldbank.org/entities/publication/fff8457e-5e6e-5c2e-b98d-92860e56f51b)
- I found no 2025–2026 update to the 850M figure. The ID4D homepage still cites it. — [ID4D](https://id4d.worldbank.org/)

**Refugees and humanitarian identity**
- WFP Building Blocks [2017–2018]:
  - Syrian refugees in Jordan's Zaatari camp paid at camp shops with iris scans. The scans were checked against a UNHCR database, and family accounts were queried on a permissioned (private) Ethereum variant.
  - It served over 100,000 refugees in 2017, with a target of 500,000 by end-2018.
  - A review linked to the World Bank reported a 98% cut in transaction fees. Critics said a conventional database could do the same job. — [Joint Data Center / World Bank-UNHCR](https://www.jointdatacenter.org/?p=52511); [WEF 2018](https://weforum.org/agenda/2018/06/three-ways-blockchain-change-refugees-lives)
- Privacy critique: an immutable ledger holding sensitive data can "codify identities" that the individual may later want to change or remove. — [Joint Data Center](https://www.jointdatacenter.org/?p=52511)
- Ethiopia's MOSIP-based ID expanded to 91 integrated agencies in 2025 and added an integration with UNHCR. This is one concrete route for refugees into a national ID system. — [MOSIP Rewind 2025](https://www.mosip.io/pdf/MOSIP-Rewind-2025.pdf)

**Self-sovereign identity standards**
- W3C published the Verifiable Credentials 2.0 family as seven Recommendations at once [May 2025]. They include VC Data Model v2.0, Data Integrity 1.0, and VC-JOSE-COSE. VC 2.0 allows Data Integrity proofs, JOSE/COSE and SD-JWT as securing mechanisms. — [W3C news](https://www.w3.org/news/2025/the-verifiable-credentials-2-0-family-of-specifications-is-now-a-w3c-recommendation); [Start with Identity, 15 May 2025](https://startwithidentity.com/blog/2025-05-15-w3c-publishes-verifiable-credentials-data-model-2-0-as-a-recommendatio/)
- OpenID Foundation Final Specifications [2025]:
  - OpenID for Verifiable Credential Issuance (OID4VCI) 1.0: the member vote ran 1–15 Sep 2025.
  - OpenID for Verifiable Presentations (OID4VP) 1.0.
  - The High Assurance Interoperability Profile (HAIP) 1.0 followed after a vote in December 2025.
  - These are the protocols the EUDI Wallet uses. — [OpenID: OID4VCI Final](https://openid.net/tag/digital-credentials-protocols/); [OID4VP Final](https://www.openid.net/tag/openid4vc/); [HAIP](https://openid.net/public-review-period-for-proposed-openid4vc-high-assurance-interoperability-profile-1-final-specification)

**EU Digital Identity Wallet (eIDAS 2.0)**
- Deadlines:
  - Each member state must offer at least one EUDI Wallet by about 24 Dec 2026, which is 24 months after the first implementing acts entered into force on 24 Dec 2024.
  - Regulated private services and very large online platforms must accept the wallet by about 24 Dec 2027.
  - EEA states (Norway, Iceland, Liechtenstein) get one extra year. — [OpenID Europe timeline, Oct 2026](https://www.openideurope.eu/digital-identity/eudi-wallet-timeline/); [Kennedys Law 2026](https://www.kennedyslaw.com/en/thought-leadership/article/2026/the-european-digital-identity-framework-introducing-the-new-eu-digital-identity-wallet/)
- Rollout status as of 2 Sep 2026 (eIDEasy tracker, cited by OpenID Europe):
  - Denmark is the only country with a wallet in production; it launched AltID on 3 Jun 2026.
  - Germany, France, Italy and Norway have public sandboxes.
  - Spain has announced a wallet but has no public sandbox. — [OpenID Europe](https://www.openideurope.eu/digital-identity/eudi-wallet-timeline/)
- Delays:
  - ENISA said that in early 2026 "no wallet had been deployed or certified". ENISA's draft certification scheme was open for consultation until 30 Apr 2026.
  - Germany's public wallet is planned for early January 2027, and Finland moved its wallet to 2027.
  - Only 16 of 27 member states took part in the 2025 Launchpad interoperability testing.
  - The Commission has signalled doubt that all 27 states will meet the deadline. — [OpenID Europe](https://www.openideurope.eu/digital-identity/eudi-wallet-timeline/); [Didit tracker](https://didit.me/blog/eudi-wallet-launch-by-country/)

**Singapore (Singpass, OpenAttestation, OpenCerts, TradeTrust)**
- OpenAttestation is GovTech's open-source framework for endorsing and verifying documents. It can anchor document hashes in Ethereum smart contracts, or it can use digital signatures and skip Ethereum transaction fees. — [GovTech Developer Portal](https://www.developer.tech.gov.sg/products/categories/blockchain/openattestation/overview)
- OpenCerts:
  - It is built on OpenAttestation, launched in 2019 under Smart Nation, and aims to conform to the W3C VC Data Model.
  - Verifiers can check whether a certificate has been revoked without contacting the issuer. — [GovTech OpenCerts](https://developer.tech.gov.sg/products/categories/blockchain/opencerts/overview); [Web of Trust](https://www.weboftrust.org/project/opencerts-121)
- SkillsFuture Singapore (SSG) migration:
  - SSG ended its E-Certificate system by 30 Jun 2024 and now issues digital certificates only through OpenCerts.
  - All old E-Certificate records were to be converted to OpenCerts by Q2 2025.
  - Learners download their OpenCerts from MySkillsFuture after logging in with Singpass. — [GovTech TechNews](https://www.tech.gov.sg/technews/losing-your-educational-certs-a-thing-of-the-past/)
- SUSS issues OpenCerts. Its certificates are aligned with the National Skills Framework and can be stored in the national Career & Skills Passport. — [SUSS](https://suss.edu.sg/news-and-events/news/convenient-and-secure-authentication-of-education-and-training-certificates-through-opencerts); [Accredify case study](https://www.accredify.io/education/case-study-singapore-school-of-social-sciences)
- Singpass is the login used to get credentials. I found no source showing it verifies OpenCerts itself. GCE O/N/A-level results are also available in the Singpass app. — [GovTech TechNews](https://www.tech.gov.sg/technews/losing-your-educational-certs-a-thing-of-the-past/)

**Bhutan NDI**
- Bhutan's National Digital Identity is an SSI system for about 800K residents. Its ledger history:
  - Hyperledger Indy first;
  - Polygon from August 2024;
  - integration with Ethereum announced in Oct 2025, with full migration of credentials targeted for Q1 2026.
- Vitalik Buterin and Aya Miyaguchi attended the launch, and Miyaguchi called Bhutan the first nation to anchor a national ID on Ethereum. — [The Block, 13 Oct 2025](https://www.theblock.co/post/374480/bhutan-migrates-national-digital-id-system-ethereum); [Cointelegraph](https://cointelegraph.com/news/bhutan-migrates-ethereum-national-id)
- Bhutan's NDI team attended MOSIP Connect 2025, which included a workshop on Inji VC issuance. — [DHI Bhutan](https://dhi.bt/newsroom/newsupdate/Bhutan%20NDI%20at%20MOSIP%20Connect%202025)

**MOSIP and Inji (open-source DPI)**
- 2025 progress by country:
  - Nigeria began migrating data for more than 124M people to a MOSIP-based system.
  - The Philippines passed 90% resident registration.
  - Tonga and São Tomé and Príncipe moved to national rollout. São Tomé is the first Lusophone MOSIP adopter and has an Inji implementation planned. — [MOSIP Rewind 2025](https://www.mosip.io/pdf/MOSIP-Rewind-2025.pdf)
- Inji:
  - Started in 2023 and is becoming an independent initiative at IIIT Bangalore.
  - Is widening into a general VC stack for education, healthcare, employability, trade and transport.
  - Inji 1.0 was expected in Q4 2026, with an alpha already available.
  - Was nominated for a 2026 Global Digital Trust Award for a rural credit use case. — [Biometric Update, Sep 2026](https://www.biometricupdate.com/202609/mosip-broadens-inji-beyond-digital-id-into-open-credentialing-platform)

### Inferences
- The gap is now less about standards and more about last-mile delivery:
  - wallets that work offline or on feature phones;
  - assisted or guardian custody;
  - verifiers that actually accept VCs.
- A hackathon project that plugs into existing rails (OID4VCI/OID4VP, VC 2.0, Inji, OpenAttestation) is more credible than one that invents a new identity chain.
- The pattern of Bhutan (Indy, then Polygon, then Ethereum) and Sovrin's collapse (Q6) suggests the ledger layer is swappable and fragile. Projects should keep credentials portable and ledger-agnostic, and anchor only hashes or status lists on-chain.
- Singapore is a natural local demo angle for SMU. OpenCerts and TradeTrust are production OpenAttestation systems, and SkillsFuture data shows real government adoption.

### Gaps
- No post-2021 World Bank estimate of the unregistered population was found.
- I found no current (2025–2026) data on UNHCR deploying W3C-style VCs for refugees. ID2020's current status was not researched; the search returned nothing usable.
- TradeTrust adoption figures were not retrieved.
- Whether Bhutan's credential migration actually finished in Q1 2026 is unconfirmed.
- Spain's specific EUDI wallet launch date was not found, which matters because University of Málaga is a co-host.

---

## Q2. Proof of personhood: World ID, Proof of Humanity, BrightID, Human Passport, Humanity Protocol, ZKPassport/Self, Anon Aadhaar

### Takeaway
World (formerly Worldcoin) is the largest proof-of-personhood system: it reports more than 18M Orb-verified people in 160 countries (April 2026) and signed Tinder, Zoom and Docusign partnerships in 2026. It also has the worst regulatory record, with halts, bans or deletion orders in at least 11 jurisdictions between 2023 and 2025. The fastest-growing privacy-preserving alternative is ZK proofs over the NFC chip in e-passports and national IDs (Self, ZKPassport, Anon Aadhaar). These avoid new biometric collection, but they exclude people who lack such documents, which is exactly the underserved group.

### Cited Findings

**World (Tools for Humanity)**
- Scale and growth:
  - It reports more than 18M Orb-verified people across 160 countries [Apr 2026].
  - On 17 Apr 2026 it announced partnerships with Tinder, Zoom and Docusign to fight deepfakes and fraud. — [Rest of World 2026](https://restofworld.org/2026/sam-altman-worldcoin-zoom-tinder-partnerships/)
  - In May 2025 it had about 12M verified since mid-2023, against a stated goal of 50M by end-2025. — [TIME, May 2025](https://time.com/7288387/sam-altman-orb-tools-for-humanity/)
- US launch [Apr–May 2025]:
  - Launched in six cities (San Francisco, Los Angeles, Atlanta, Nashville, Miami, Austin) and introduced the Orb Mini.
  - Planned 7,500 Orbs across the US.
  - Partnered with Match Group. — [TIME](https://time.com/7288387/sam-altman-orb-tools-for-humanity/); [eWeek](https://www.eweek.com/news/sam-altman-orb-security/); [Rest of World](https://restofworld.org/2026/sam-altman-worldcoin-zoom-tinder-partnerships/)
- Regulatory actions:
  - Kenya: paused verification in Aug 2023. It dropped the probe in Jun 2024, but a court later ordered the data deleted (see next item).
  - Spain: the AEPD ordered a halt in Mar 2024 over minors' data and consent withdrawal.
  - Portugal: banned collection in Mar 2024.
  - Argentina (Buenos Aires province): alleged "abusive clauses" in Apr 2024.
  - Hong Kong: the privacy watchdog ordered it to cease operations in May 2024 over "unnecessary and excessive" data collection.
  - Germany: ordered deletion of data that breached GDPR in Dec 2024.
  - Brazil: the ANPD banned it in Jan 2025 and reaffirmed the ban in Mar 2025, with a fine of R$50,000 per day if collection resumes. The reason was paying people for iris scans.
  - Indonesia: suspended operations in May 2025.
  - Philippines: the National Privacy Commission ordered a halt in Oct 2025.
  - Thailand: shut down iris scanning and ordered biometric data deleted in Nov 2025.
  - India: sign-ups were reportedly halted in 2023.
  - Sources — [Rest of World 2026](https://restofworld.org/2026/sam-altman-worldcoin-zoom-tinder-partnerships/); [The Block, Indonesia](https://www.theblock.co/post/353072/sam-altmans-world-project-hit-with-suspension-in-indonesia-over-alleged-regulatory-violations); [ID Tech, Thailand](https://idtechwire.com/thailand-orders-worldcoin-to-halt-iris-scans-and-delete-biometric-data/)
- Kenya also faced a court-ordered data deletion after its suspension, and South Korea's privacy commission fined the company about ₩1.1B. These come from secondary aggregators; check primary sources before quoting. — [BitPinas](https://bitpinas.com/regulation/indonesia-kenya-worldcoin-issue/); [Plisio 2026](https://plisio.net/crypto/worldcoin)
- Indonesia's ministry cited "noncompliance with registration obligations and the use of another legal entity's identity" as a serious violation. — [Fintech News Indonesia](https://fintechnews.id/107892/crypto/indonesia-worldcoin/)
- Privacy and ethics critiques:
  - A 2022 MIT Technology Review investigation reported deceptive marketing and collection of data beyond iris scans.
  - Edward Snowden criticised the project for "cataloguing eyeballs".
  - Early sign-ups were paid about $50 in crypto, and in Uganda recruiters earned commissions per recruit.
  - Sources — [Rest of World](https://restofworld.org/2026/sam-altman-worldcoin-zoom-tinder-partnerships/)

**ZK passport and national-ID approaches**
- Self (self.xyz, formerly OpenPassport):
  - Generates ZK proofs from the NFC chip in passports, national ID cards or Aadhaar, so users can prove humanity, age or non-sanctioned status without revealing the document.
  - Claims support for passports from 129 countries, ID cards from 35 countries, and Aadhaar [Jan 2026 press release; another source says 170+].
  - Google Cloud's Web3 testnet faucet uses Self to block bots, and Aave has integrated it. — [Business Wire, Jan 2026](https://www.businesswire.com/news/home/20260128053068/en); [ETH Daily](https://ethdaily.io/746)
- ZKPassport:
  - Reads ICAO e-passport and ID chips and generates proofs on the phone.
  - A SAFE Foundation review says it suits personhood-based account recovery today but lacks liveness checks and has document-renewal problems. — [SAFE Foundation](https://safefoundation.org/blog/safe-research-zk-passport-where-are-we-now)
- Anon Aadhaar (Privacy & Scaling Explorations, supported by the Ethereum Foundation):
  - A Circom/Groth16 circuit verifies the RSA-SHA256 signature on the Aadhaar Secure QR code inside the proof, and proofs are generated client-side.
  - Optional disclosure is limited to age over 18, gender, state and pincode.
  - It produces a nullifier to stop duplicate claims. — [PSE project page](https://pse.dev/en/projects/anon-aadhaar); [Docs](https://documentation.anon-aadhaar.pse.dev/docs/how-does-it-work); [GitHub](https://github.com/privacy-scaling-explorations/anon-aadhaar)

**Human Passport (formerly Gitcoin Passport, now Holonym / human.tech)**
- Combines several verification "stamps" into a single score. It is a heuristic and does not guarantee one account per person. — [ProofHuman comparison](https://proof-human.com/blog/best-proof-of-personhood-protocols); [markaicode](https://markaicode.com/preventing-sybil-attacks-proof-of-personhood-solutions/)
- Its NFC passport path runs on ZKPassport. A free attestation lasts 3 months and a $3 proof lasts 1 year. — [Holonym Q2 2026 update](https://human.tech/blog/holonym-foundation-quarterly-update-q2-2026)

**Humanity Protocol**
- Uses palm recognition plus a ZK identity model, according to a third-party comparison. I found no independent 2026 adoption data. — [ProofHuman](https://proof-human.com/blog/best-proof-of-personhood-protocols)

### Inferences
- There is a trade-off triangle:
  - biometric uniqueness (World, Humanity Protocol): strong Sybil resistance, but high regulatory and consent risk, especially for vulnerable groups;
  - document-based ZK (Self, ZKPassport, Anon Aadhaar): strong privacy and no new biometrics, but it excludes the roughly 850M people without ID and people without NFC phones;
  - social graph or score (BrightID, Human Passport): inclusive, but weaker guarantees.
- A social-good hackathon project could combine these, for example ZK document proofs when available and a fallback of attestations vouched for by NGOs or community leaders.
- The regulatory actions against World concentrate in Global South and privacy-strict jurisdictions, and focus on consent, minors and cash incentives. Any project collecting biometrics from refugees or poor communities faces the same objections.

### Gaps
- Proof of Humanity (Kleros) and BrightID: I did not retrieve 2025–2026 status, user counts or activity, and found no reliable current data.
- I could not confirm whether the Kenya, Spain and Hong Kong actions against World were later lifted.
- I found no independent audit of Humanity Protocol's palm-scan data handling.

---

## Q3. Zero-knowledge proofs for privacy-preserving eligibility (e.g. proving income is below a threshold for aid)

### Takeaway
The building blocks exist: ZK proofs over government-signed data (Anon Aadhaar, Self), VC 2.0 with SD-JWT selective disclosure, and nullifiers against double-claiming. The research case for ZK-based eligibility checks is established. However, I found no deployed government welfare program that accepts ZK eligibility proofs, so this is an open and good hackathon niche.

### Cited Findings
- Anon Aadhaar shows the core pattern: a ZK-SNARK proves that a government RSA signature over identity data is valid while hiding the data, and a nullifier prevents duplicate proofs ("double-spending"). Income is not among the disclosable fields, so means-testing would need new circuits or a different signed source. — [Anon Aadhaar docs](https://documentation.anon-aadhaar.pse.dev/docs/how-does-it-work); [PSE](https://pse.dev/en/projects/anon-aadhaar)
- A research paper argues that eligibility programs usually require in-person checks or repeated exposure of sensitive identifiers, and proposes replacing disclosure-based verification with ZKPs. — [arXiv 2311.13008](https://arxiv.org/html/2311.13008v2)
- An ETHIndia 2022 hackathon project ("Data Proof") argued that welfare data collection forces a trade-off with citizen privacy. It is a prototype only. — [ETHGlobal showcase](https://ethglobal.com/showcase/data-proof-244q1)
- VC 2.0 supports SD-JWT and Data Integrity proofs, which allow selective disclosure of credential fields without a custom circuit. — [Start with Identity](https://startwithidentity.com/blog/2025-05-15-w3c-publishes-verifiable-credentials-data-model-2-0-as-a-recommendatio/); [W3C](https://www.w3.org/news/2025/the-verifiable-credentials-2-0-family-of-specifications-is-now-a-w3c-recommendation)
- Self is used for privacy-preserving OFAC (sanctions) compliance checks. This is an example of a ZK "eligibility" check in production. — [Business Wire 2026](https://www.businesswire.com/news/home/20260128053068/en)
- The EUDI Wallet roadmap includes pseudonyms in later phases, after identification and a first set of credentials. — [OpenID Europe](https://www.openideurope.eu/digital-identity/eudi-wallet-timeline/)

### Inferences
- A concrete hackathon architecture:
  1. An issuer signs a VC (for example a social-worker or NGO attestation of household income, or a government-signed record).
  2. The holder generates a client-side ZK proof of a predicate such as "income < X" or "resident of region Y", plus a nullifier scoped to the aid round.
  3. A smart contract or aid distributor verifies the proof and releases funds or vouchers, and the nullifier blocks double-claiming.
- The hard problem is not the ZK maths. It is getting a trustworthy signed data source: income data is rarely available as a signed digital record in low-income settings.
- Proof generation on low-end Android phones is a known UX constraint. Anon Aadhaar and ZKPassport proofs run on-device, but performance on cheap phones was not measured in the sources.

### Gaps
- No deployed government or UN ZK-eligibility program was found.
- No benchmark of proof-generation time on low-end devices was retrieved.

---

## Q4. Education: blockchain diplomas, OpenCerts, EBSI and Spanish universities, badges, credentials for refugees

### Takeaway
Verifiable diplomas are the most mature Web3 identity use case and are now in government production. Examples are Singapore's OpenCerts (SkillsFuture is OpenCerts-only from 2024), Spain's EBSI and CertiDigital work, and MIT's Blockcerts pilot (2017) leading to the Digital Credentials Consortium. Credentials for displaced students remain mostly proposals, which leaves a clear social-good gap.

### Cited Findings
- MIT [2017]:
  - Piloted Blockcerts diplomas with 111 graduates through a smartphone wallet.
  - Blockcerts was developed by Learning Machine and the MIT Media Lab.
  - Demand came especially from international students who needed secure proof of their degree in their home countries. — [Inside Higher Ed, Oct 2017](https://www.insidehighered.com/news/2017/10/19/mit-introduces-digital-diplomas); [MIT Technology Review 2018](https://www.technologyreview.com/2018/04/25/143311/digital-diplomas/)
- The Digital Credentials Consortium (led by MIT) moved to W3C Verifiable Credentials and a Learner Credential Wallet, and had a U.S. Department of Education contract for an open student wallet standard [2021]. — [DCC presentation 2021](https://digitalcredentials.mit.edu/docs/2021_IMS_Digital_Credentials_Summit-Digital_Credentials_Consortium.pdf)
- Singapore OpenCerts: SkillsFuture is OpenCerts-only since 30 Jun 2024, and legacy records were to be converted by Q2 2025. OpenCerts aims for W3C VC conformance. — [GovTech TechNews](https://www.tech.gov.sg/technews/losing-your-educational-certs-a-thing-of-the-past/); [GovTech](https://developer.tech.gov.sg/products/categories/blockchain/opencerts/overview)
- EBSI in Spain:
  - In the EBSI diploma pilot, the Royal Spanish Mint (FNMT) issues a verifiable identity and Universitat Rovira i Virgili issues a verifiable diploma.
  - The pilot covers cross-border exchange among Spain, Belgium and Italy.
  - The wider use case started in Jul 2021 with KU Leuven and the University of Bologna under Una Europa. — [EBSI Transcript of Records](https://ebsi.eu/projects/transcript-of-records); [EC EBSI wiki](https://ec.europa.eu/digital-building-blocks/sites/display/EBSI/Transcript+of+records)
- CertiDigital is the Spanish university system's digital credentialing service:
  - It is based on European Commission formats (Europass, EDCI, EBSI).
  - It is framed by the UniDigital plan and Royal Decree 641/2021.
  - It was presented by Carlos Delgado Kloos of UC3M [2024]. — [Europass CertiDigital slides, Oct 2024](https://europass.europa.eu/system/files/2024-10/Certidigital%20Slides.pdf)
- Spanish vendor eTítulo says it issues diplomas, Diploma Supplements and transcripts as EBSI credentials, sealed PDFs and mobile passes. This is a vendor claim. — [eTítulo](https://www.etitulo.com/en/)
- Refugees and displaced students:
  - Geoidentity, a proposed blockchain academic passport by researcher Giorgia Maria Malandrino, was not deployed. — [Springwise](https://springwise.com/diversity-social/innovation-education-helping-refugees-prove-their-academic-credentials)
  - ODEM and the InternetBar.org Institute announced refugee education credentials in 2018; I found no evidence of implementation. — [StreetInsider 2018](https://www.streetinsider.com/Press+Releases/ODEM%2C+IBO+Partner+to+Provide+Digital+Credentials+to+Refugees/14456119.html)
- Inji (MOSIP) is expanding to education credentials. — [Biometric Update, Sep 2026](https://www.biometricupdate.com/202609/mosip-broadens-inji-beyond-digital-id-into-open-credentialing-platform)

### Inferences
- The strongest education project angle is credential recovery and portability for displaced learners:
  - re-issuing or attesting prior learning, for example through vouching by former teachers or exam boards, or assessment-based re-certification, as W3C VCs;
  - making those VCs verifiable by universities in Singapore and Spain through OpenAttestation and EBSI-compatible formats.
- This directly bridges the three host institutions: SMU (Singapore OpenCerts), Málaga (Spain EBSI and CertiDigital), and the GSR Foundation (Web3).
- Scholarships on-chain (conditional disbursement released when a VC proves enrolment or grades) can reuse the ZK and nullifier pattern from Q3.

### Gaps
- I found no reliable data on learn-to-earn programs or skill-badge adoption numbers in 2025–2026.
- I did not research UNESCO's Qualifications Passport for Refugees or the Council of Europe's European Qualifications Passport for Refugees (EQPR); both are highly relevant non-blockchain precedents to check.
- Whether University of Málaga specifically issues EBSI or CertiDigital credentials was not confirmed.
- No current list of EBSI diploma issuers was found; the EBSI project page showed "No items found".

---

## Q5. Healthcare: medical records, drug supply chains, vaccine credentials, health data

### Takeaway
Successful health "blockchain" deployments use the ledger only for integrity and audit. Estonia's KSI hashes records and logs; MedRec stored only pointers and hashes. The data itself stays in conventional databases. Drug traceability has a strong social-good rationale (WHO estimates about 1 in 10 medical products in low- and middle-income countries are substandard or falsified), but the flagship MediLedger appears to have stalled after its FDA pilot. The largest health credential deployment ever, the EU Digital COVID Certificate, was signature-based and not blockchain-based, and it became WHO's global network.

### Cited Findings
- Estonia: Guardtime's KSI blockchain was integrated with the Estonian e-Health Foundation's Oracle database [announced Mar 2016] to secure the integrity of about 1M health records and access logs. KSI uses only hash functions, and only signatures, not data, go on the ledger. Government use of KSI dates from 2011. — [e-Estonia](https://e-estonia.com/ehealth-authority-partners-with-guardtime-to-accelerate-transparency-and-auditability-in-health-care/); [SiliconANGLE 2016](https://siliconangle.com/2016/03/03/estonia-partners-with-guardtime-to-secure-1-million-health-records-with-blockchain-technology/)
- MedRec (MIT Media Lab) [2016–2018]:
  - An open-source prototype with Ethereum smart contracts that hold pointers to records and hashes for tamper checks.
  - Piloted with data from Beth Israel Deaconess Medical Center.
  - The authors present it "not as the panacea" but as a prototype. — [MIT Media Lab](https://www.media.mit.edu/projects/medrec/overview/); [ONC/HealthIT.gov whitepaper](https://www.healthit.gov/sites/default/files/5-56-onc_blockchainchallenge_mitwhitepaper.pdf); [IEEE brief 2018](https://blockchain.ieee.org/technical-briefs/july-2018/medrec-patient-control-of-medical-record-distribution/)
- Counterfeit medicines [2017]:
  - WHO estimates about 1 in 10 medical products in low- and middle-income countries are substandard or falsified (10.5% across 48,000 samples from 88 countries).
  - The estimated cost is about $30B.
  - A University of Edinburgh model estimates 72,000–169,000 child pneumonia deaths a year from bad antibiotics; this is a modelled figure.
  - WHO itself calls these approximations. — [WHO news release, 28 Nov 2017](https://www.who.int/news/item/28-11-2017-1-in-10-medical-products-in-developinG-countries-is-substandard-or-falsified)
- MediLedger:
  - Launched in 2018 by Chronicled with major pharma manufacturers and distributors for compliance with the US Drug Supply Chain Security Act (DSCSA).
  - Joined the FDA DSCSA pilot with 25 members and built a working prototype. — [Tablets & Capsules](https://www.tabletscapsules.com/3641-Technical-Articles/585483-Track-and-Trace-Summary-of-the-MediLedger-DSCSA-Pilot-Project-Report-to-the-FDA/); [BioPharma Dive](https://www.biopharmadive.com/news/big-pharma-blockchain-experiment-returns/525751)
  - The DSCSA's final interoperability milestone took effect on 27 Nov 2024, with GS1 EPCIS as the data standard. — [Wireless Life Sciences, May 2025](https://wirelesslifesciences.org/2025/05/blockchain-track-trace/)
- Vaccine credentials:
  - The EU Digital COVID Certificate connected about 80 countries and territories.
  - In June 2023 WHO adopted it as the first building block of the Global Digital Health Certification Network (GDHCN). WHO does not access personal data, which stays with national governments. — [European Commission](https://health.ec.europa.eu/ehealth-digital-health-and-care/international-cooperation_en); [Health Policy Watch](https://healthpolicy-watch.news/who-to-establish-digital-health-certification-network-based-on-eu-covid-19-certificate/)
- Barriers in healthcare blockchain:
  - A 2022 JAMIA Open scoping review found that security and interoperability remain open challenges.
  - An arXiv review found most projects are white papers, proofs of concept or have small user bases.
  - In a PwC survey: 61% cite lack of expertise, 47% lack of trust, 39% regulatory uncertainty, 37% the inability to bring the network together, 36% interoperability and 33% scaling. — [PubMed 35911668](https://pubmed.ncbi.nlm.nih.gov/35911668/); [arXiv 1812.02776](https://arxiv.org/pdf/1812.02776); [Healthcare IT News](https://healthcareitnews.com/node/542137)

### Inferences
- MediLedger's history suggests the industry chose GS1 EPCIS and conventional interoperability for DSCSA compliance rather than a shared blockchain. Treat this as an inference; I have no confirmed source for MediLedger's current status.
- In LMICs, verification at the point of dispensing (a pharmacy or patient scans a pack and checks a manufacturer-signed VC or serial) may matter more than full-chain traceability.
- Health records on-chain are a known anti-pattern because of GDPR's right to erasure and immutability (see the refugee critique in Q1). Workable designs store hashes, consents and access logs on-chain and keep data off-chain.
- The design of the EU vaccine certificate shows that a signed QR code plus a trust list of public keys is enough for verification at scale. A blockchain's value is in governing the trust registry and handling cross-border acceptance, not in storing the data.

### Gaps
- MediLedger's status for 2024–2026 was not found.
- I did not research health data DAOs (e.g. VitaDAO), clinical-trial data on blockchain, or the Africa and Asia counterfeit-drug pilots (e.g. mPedigree, Sproxil). Their outcomes are unknown from this research.
- No updated WHO counterfeit-drug estimate after 2017 was found.
- The current GDHCN member count was not found.

---

## Q6. What failed and why; unsolved gaps in 2025–2026

### Takeaway
SSI failures are mostly about governance, economics and adoption, not cryptography:
- Sovrin dissolved after its MainNet usage collapsed.
- EUDI is late because of certification and procurement.
- World is blocked by consent and biometric regulators.
- Health and refugee blockchain pilots often could not show an advantage over a database.

The unsolved problems are key loss and recovery, inclusive personhood for people without documents, verifier adoption, trust-registry governance, and erasure versus immutability.

### Cited Findings
- Sovrin:
  - The foundation announced in Feb 2025 that its MainNet would likely shut down by 31 Mar 2025.
  - Reasons given: declining usage, no new Transaction Endorsers in 2024, regulatory ambiguity deterring investment, resources diverted to TestNet fixes, low Steward participation, and a $2M debt inherited from a previous board.
  - The foundation was later dissolved; the ledger data remains publicly available. — [Sovrin announcement](https://sovrin.org/sovrin-foundation-mainnet-ledger-shutdown-likely-on-or-before-march-31-2025/); [ID Tech Wire](https://idtechwire.com/the-community-moved-on-sovrin-announces-mainnets-likely-shutdown); [Sovrin dissolution notice](https://sovrin.org/?p=15740)
- Bhutan's ledger changes (Indy, then Polygon, then Ethereum, within about 2 years) show ledger dependency risk even in a successful national deployment. — [The Block](https://www.theblock.co/post/374480/bhutan-migrates-national-digital-id-system-ethereum)
- EUDI delays: specifications kept changing through 2025, certification was only ready in 2026, and national procurement and legislation are slow. Only 16 of 27 states joined the 2025 Launchpad testing. — [OpenID Europe](https://www.openideurope.eu/digital-identity/eudi-wallet-timeline/)
- World: regulators in at least 11 jurisdictions intervened over consent, minors, cash incentives and excessive collection. Adoption was also slower than planned: about 12M in May 2025 against a 50M target. — [Rest of World](https://restofworld.org/2026/sam-altman-worldcoin-zoom-tinder-partnerships/); [TIME](https://time.com/7288387/sam-altman-orb-tools-for-humanity/)
- ZKPassport-style systems lack liveness checks and have problems when documents are renewed. — [SAFE Foundation](https://safefoundation.org/blog/safe-research-zk-passport-where-are-we-now)
- Human Passport scores do not guarantee one account per person. — [markaicode](https://markaicode.com/preventing-sybil-attacks-proof-of-personhood-solutions/)
- WFP Building Blocks: critics argued that a traditional database could do the same job, and storing identity on immutable ledgers raises privacy risks. — [Joint Data Center](https://www.jointdatacenter.org/?p=52511)
- Healthcare blockchain projects mostly stay as proofs of concept. Barriers include expertise, trust, network formation and interoperability. — [arXiv 1812.02776](https://arxiv.org/pdf/1812.02776); [Healthcare IT News](https://healthcareitnews.com/node/542137)

### Inferences (unsolved gaps = hackathon opportunity list)
1. **Key loss and recovery for low-literacy users.** Social or guardian recovery, NGO custodial wallets with exit rights, and personhood-based recovery using ZK passports (which SAFE says is viable today).
2. **Personhood for the roughly 850M without documents.** Combine community or NGO attestations with ZK and nullifiers instead of biometrics.
3. **The verifier side.** Most failures come from nobody accepting credentials. Simple verifier tools (a QR scanner web app, OpenAttestation-compatible) for clinics, schools and aid distributors.
4. **Trust-registry governance.** Deciding who counts as a legitimate issuer (a refugee school, an NGO) is an unsolved problem, and an on-chain registry with DAO or multi-stakeholder governance is a plausible Web3 contribution.
5. **Privacy by design.** Only hashes and status lists go on-chain; selective disclosure and ZK go to verifiers. This avoids the GDPR conflict and the "codifying identities" critique.
6. **Interoperability.** Use VC 2.0, OID4VCI/OID4VP and EBSI/EUDI-compatible formats so a pilot can connect to the EU (Málaga) and Singapore (SMU).

### Gaps
- uPort's shutdown (ConsenSys, around 2020–2021): no sources were retrieved, so its lessons are not documented here.
- No quantitative data on key-loss rates in SSI wallets was found.
- Learn-to-earn failures (e.g. post-2022 play-to-earn collapses) were not researched in this note.
