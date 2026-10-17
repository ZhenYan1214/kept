# Kept: adversarial claims audit

Audit date: 2026-10-17. Auditor: independent fact-check pass (did not write the claims). Method: every number was re-derived from the primary source where the source was reachable. The project's research notes were used only to find URLs, never as evidence. Files audited: `README.md`, `docs/submission/description.md`, `docs/submission/video-script.md`, `web/src/app/why/page.tsx`, `web/src/lib/replay/backtest.ts`, `web/src/components/payout-timeline.tsx`, `docs/policy/ordinance-summary-en.md`. Line numbers refer to the files as they stood on 2026-10-17. Some files changed while the audit was running, so line numbers may drift by a few lines.

## Summary

| Verdict | Count |
|---|---|
| SUPPORTED | 56 |
| MISLEADING (true or sourced, but a hostile reader can attack the framing) | 28 |
| WRONG | 4 |
| UNVERIFIABLE (source not reachable, absence claim, or legal opinion) | 7 |
| **Total claims checked** | **95** |

### The items most likely to hurt in front of judges (details in the table)

1. **WRONG: "Donations reaching the county that year were under a fifth of 2018's"** (README:35; video 0:15–0:45, both the slide and the narration). The same README row says the county received NT$792M. The county's own statements put 2024 at NT$792.8M (Appendix B) and the 2018 account at NT$2.74bn actual income (Appendix A), which is **29%**. By 30 Apr 2024 the county account already held NT$553M, and by 31 May NT$689M (county monthly table). The PTS "4.53億" figure was a separate transfer from the foundation.
2. **WRONG: "this line is the only public evidence that money reached households"** (payout-timeline.tsx:139). The ministry published that 2,582 households had been paid, NT$659.9M of it from the foundation account, as of 2025-12-02 (Knews 2025-12-03). description.md:42 cites this same figure.
3. **MISLEADING: "no household can (check or) confirm its own payment" / "No channel" / "Undetectable"** (README:36, 48–50; description:42; why:129, 185; video 0:45). A household can see its own bank deposit and can complain through the township office, 1999 or the county mayor's mailbox. The project's own backtest material records such a petition. What does not exist is a **public, recorded** confirm/dispute channel.
4. **MISLEADING: "revised the number of affected households from 1,837 to 4,039"** (description:44; video 0:45, on screen). Transfer #5 (23 Oct 2025) already added an estimated 1,488 households outside the protected zone, so the estimate was about 3,325 within a month. 4,039 (plus 114 cases) counts clean-up-support recipients; it is not a revision of "affected households".
5. **MISLEADING: "never in the news"** for the NT$30M children's donation (README:148, description:91). LTN and TheHubNews ran a story on 2026-09-24 about the donor's gift, saying the county education department is disbursing it "in stages, by actual need". The amount and the delay were not reported. In March 2026 the committee had also scheduled applications for May–June / the 2026 school year.
6. **MISLEADING: "17 Jan 2025, first news story"** (README:147, description:90). backtest.ts has the hedge ("first news story we found on the unspent balance"), but the tables drop it. Earlier coverage of the county's 0403 donations exists: CNA 2024-05-07, and PTS 2024-05-17, which reported the county "has not yet paid out" the NT$453M it received.
7. **MISLEADING: the Why page "< 1/5" fact card** (why:121–124, 55; description:41). It is attributed to PTS, but the county's own records contradict PTS's comparison (see item 1). A hostile reader will recompute it.
8. **MISLEADING: 2018 surplus backtest row** (README:150, description:93). The repurposing of the 0206 surplus was publicly announced around 1 June 2022, with a 30-day donor-objection window. The "public found out 14 Jun 2023" date is inferred from a filename. The matter is also now under an ongoing prosecutorial investigation, so the row needs a "no finding of wrongdoing" note.
9. **MISLEADING: "Taiwan's donation-law reform has stalled since 2020"** (README:161, description:68, why:139–141). The Act **was amended** on 2020-01-15. The claim also contradicts ordinance-summary:13 ("since March 2024").
10. **WRONG: "Victims sit on no board"** (why:132). Since 2026 an appointed member of the Hualien committee is herself a 0403-affected household; she recused herself on that basis at the 2026-05-14 meeting. The defensible claim is "no board **reserves a seat** for affected households".

## Per-claim table

Abbreviations: **CR-B** = county committee report, Appendix B (https://sa.hl.gov.tw/Upload/202504020943277687541.pdf, p.36–37). **D#n** = relief foundation disclosure n (https://www.tf4dr.org/fundraising_plans/156/credits/{204,237,…,534}). The summary sentence was read from the page HTML, and the expense tables were read from the embedded PNGs; #2 and #11 were checked row by row.

### A. Guangfu 2025: relief foundation data

| # | Claim (quoted) | File:line | Primary source checked | Verdict | Suggested wording / note |
|---|---|---|---|---|---|
| A1 | "NT$1.21bn paid out" / "NT$1.209bn paid out in 48 transfers" | README:36; description:42 | D#11 HTML: 「已支出（含預撥）款項為12億904萬9,669元」; table rows 1–48, 合計 $1,209,049,669 | SUPPORTED | It is "paid out incl. pre-allocations"; why:127 says so, README does not. Optional: add "(incl. pre-allocations)". |
| A2 | "98.8% was pre-allocated" | README:36; description:42; video 0:45 ("nearly ninety-nine percent") | D#11 table: 預撥 rows sum 1,194,349,758 ÷ 1,209,049,669 = 98.78% | SUPPORTED | — |
| A3 | "93% to one ministry" | description:42; video 0:45 ("most of it to one ministry") | D#11 table: MOHW rows 1,128,621,259 = 93.3% (pre-allocated to MOHW alone: 1,126,207,928 = 93.1%) | SUPPORTED | — |
| A4 | "more than NT$1.1bn … was pre-allocated to the ministry" | why:184–185 | as A3 | SUPPORTED | — |
| A5 | "NT$49M (4%) had been reconciled a year later" / "~4% reconciled … as of Sept 2026" | README:36; description:42; why:48, 126–129 | D#11 HTML: 「已核銷款項為4,914萬9,006元」, as of 115/9/25; 49,149,006 ÷ 1,209,049,669 = 4.07%; day 367 after the flood | SUPPORTED | — |
| A6 | "raised NT$1.398bn" | description:42 | D#10/#11 income table total 1,397,723,978 | SUPPORTED | Note: this is net of refunds and includes NT$2.48M interest and NT$3.62M earmarked transfers. Gross appeal donations were NT$1,391,840,473 (D#1–#9 HTML). Fine as stated. |
| A7 | "reconciled minus paid-on-claim stayed at exactly NT$15.2M from Dec 2025 to Aug 2026" | README:36; description:42; payout-timeline:130–134 | Reconciled figures for D#2–#11 confirmed in each page's HTML. Paid-on-claim totals confirmed from table images for D#2 (9,310,980 → 24,510,980 − 9,310,980 = 15,200,000) and D#11; D#10 derived (14,699,911 − 2,020,000 claims dated after 8/21 = 12,679,911 → 27,879,911 − 12,679,911 = 15,200,000) | SUPPORTED | — |
| A8 | "Across all 11 monthly disclosures, reconciled minus paid-on-claim stayed at exactly NT$15.2M" | README:36 | as A7 | MISLEADING | It holds in 9 of the 11 disclosures (#2–#10). #1 states no reconciled figure and #11 differs. Fix: "In disclosures #2–#10 (Dec 2025–Aug 2026), reconciled minus paid-on-claim stayed at exactly NT$15.2M." (description:42 already words it correctly.) |
| A9 | "for eight months, no pre-allocated money was newly reported as reconciled" | README:36; description:42; video 0:45; payout-timeline:133 | Arithmetic from A7; D#2→D#10 = 2025-12-24 → 2026-08-21, 240 days, 7.9 months | SUPPORTED (derived) | This is an inference: the foundation never itemises "reconciled". It rests on paid-on-claim items counting as reconciled when paid, which D#1 supports by labelling them 核銷. Add "on our reading of the foundation's figures" once, e.g. in description:42. "by the foundation's own figures" (timeline:133) slightly overstates. |
| A10 | "publishes every transfer it makes" | description:42, 111; why:184; video 0:45 | D#1–#11 itemised tables | SUPPORTED | True for this appeal. "every transfer it makes" across all appeals was not checked; "every transfer from this appeal" is safer. |
| A11 | "after the first hand the public sees aggregate totals only" | README:36; description:42; why:128, 185 | Knews 2025-12-03 (MOHW aggregate: 2,582 households per programme) | SUPPORTED | — |
| A12 | "no household can confirm its own payment" / "no household can check or confirm its own payment, or say that it never arrived" | README:36; description:42; why:129, 185; video 0:45 | Households receive bank transfers (MOHW pays directly into accounts); complaint channels exist (township office, 1999, county mayor's mailbox; a 1999/mailbox petition appears in the 2026-05-14 county minutes) | MISLEADING | "check" is plainly attackable: a household can check its own bank account. Fix: "no household can publicly confirm or dispute its own payment in a way anyone else can see." |
| A13 | "the ministry reported 2,582 households paid by December 2025" | description:42 | Knews 2025-12-03 (https://www.knews.com.tw/news/3E9C73C77AA84F6D0663DA62B7732B56): 2,582 households in each of three programmes as of 2025-12-02; NT$659.9M from the foundation account | SUPPORTED | — |
| A14 | "this line is the only public evidence that money reached households, and it is one unexplained number a month" | payout-timeline:139–140 | as A13 | WRONG | MOHW's Dec 2025 aggregate is public evidence that money reached households. Fix: "this line is the only figure the foundation itself publishes on whether its pre-allocations reached households, and it is one unexplained number a month." |
| A15 | "killing 19 people with 5 missing" | description:42 | Multiple outlets (CommonWealth, Taiwan News, via search): 19 dead, 5 missing, 157 injured | SUPPORTED | — |
| A16 | "the foundation's own records revised the number of affected households from 1,837 to 4,039" / "the household estimate moving from 1,837 to 4,039" | description:44; video-script:13, 36 | D#11 table: #1 (10-01) 「預估1,837戶」; #5 (10-23) 「預估1,488非保全戶【含110戶爭議件】」; #30 (2026-03-05) 「補調整為4,039戶及114案」 | MISLEADING | By 23 Oct the foundation's estimates already totalled about 3,325 (1,837 + 1,488). 4,039 is the clean-up programme's count, not "affected households". Fix: "the foundation's household estimate for clean-up support rose from 1,837 (1 Oct) to about 3,325 (23 Oct) to 4,039 households plus 114 cases (Mar 2026)", or drop it. |
| A17 | "4,039 households" as "Guangfu's scale" | README:130, 170; description:73, 112 | D#11 #30 | SUPPORTED | Accurate as "households in the clean-up programme". |
| A18 | NT$X paid in the first 30 days, X% of all; "Money moved fast" | payout-timeline:122–123 | D#11 table: #1–#5 by 10-23 (day 30) = 829,950,000 = 68.6% | SUPPORTED | — |
| A19 | "Pre-allocations are checked against each agency's relief roster later" | why:48 | D#1–#11 HTML: 「日後再依各單位賑助名冊、項目、金額查核計算，多退少補」 | SUPPORTED | — |
| A20 | Foundation "funded the civic platform guangfu.tw" | description:111 | D#11 #46: NT$2,000,000 to 究心公益科技 for 「guangfu.tw 災害聯繫會報平臺」 | SUPPORTED | — |

### B. Hualien County 0403 (2024) account

| # | Claim | File:line | Primary source checked | Verdict | Suggested wording / note |
|---|---|---|---|---|---|
| B1 | "The county received NT$792M" | README:35, 147; description:41, 90; why:117; ordinance:10; video 0:15 | CR-B: 「0403震災指定捐款收入（資料統計截至114年3月7日）7億9,276萬412元」 | SUPPORTED | — |
| B2 | "earmarked NT$425M" | same | CR-B: 「0403震災計畫通過(匡列數) 4億2,478萬2,521元」; plan total 424,782,521 | SUPPORTED | — |
| B3 | "actually paid out NT$124M (16%)" | same | CR-B p.37: 已執行 124,205,920 (as of 114/2/27); 124.2 ÷ 792.8 = 15.7% | SUPPORTED | — |
| B4 | "eleven months later" | same | 2024-04-03 → 2025-02-27 = 10.8 months | SUPPORTED | — |
| B5 | "Its committee had no affected households on it" / "no victims on it" | README:35; description:41; why:118; ordinance:10; video 0:15 | PTS 2025-03-31 (https://news.pts.org.tw/article/744652): victims say 「善款委員會成員竟無納入災民與民意代表」; county audit office via KSNews 2026-07-31 (https://www.ksnews.com.tw/e/125676): 「尚未納入任何受災戶代表」 | SUPPORTED | Safer: "no affected-household representatives". From 2026 one appointed member is herself an affected household (see B12). |
| B6 | "Its committee met three times" / "met 3 times" | description:41; why:118; ordinance:10 | PTS 2025-03-31: 「開會次數只有3次」; **CNA 2025-01-17** (https://www.cna.com.tw/news/aloc/202501170181.aspx): councillor says 「只開過4次」; LTN 2025-03-30: 2 temporary + 1 plenary | MISLEADING | The sources disagree. Fix: "had met only a few times (three, per PTS; four, per CNA)", or "rarely met". |
| B7 | "Donations reaching the county that year were under a fifth of 2018's" | README:35; video-script:12 (slide "Donations reaching Hualien County, 2024: under 1/5 of 2018's" and narration "less than a fifth") | County 0403 monthly table (https://ws.hl.gov.tw/001/Upload/543/relpic/26433/156663/e61ed741-638a-486d-91cb-b0c7dfaaa440.jpg): Apr 2024 NT$552,966,386, total NT$793,162,377; CR-B 0403 NT$792.8M; 2018 county account actual income NT$2.74bn (Appendix A, same PDF); minutes 2024-04-17: 0403 income already NT$352.7M (https://sa.hl.gov.tw/Upload/202405071203378696311.pdf) | WRONG | 792.8 ÷ 2,742.8 = 29%. It also contradicts NT$792M in the same row. Fix: "Donations to the county's account were NT$793M, under a third of the NT$2.74bn after the 2018 earthquake", or drop the ratio. In the video, cut this sentence (it is already first in the cut order). |
| B8 | "By May 2024 Hualien County had received NT$453M … through the relief foundation: under a fifth of the NT$2.7bn it received in 2018" (fact card "< 1/5") | why:55, 121–124; description:41; video-script:34 | PTS 2024-05-17 (https://news.pts.org.tw/article/695533) does say this; county records (B7) show the county's own 0403 account held NT$689M by 31 May 2024, separate from the foundation's NT$453M transfer | MISLEADING | It faithfully reports PTS, but the county's primary data contradict PTS's comparison, and a big "< 1/5" headline invites recomputation. Fix: drop the ratio, or "By May 2024 the county's own account had received about NT$690M, against NT$2.74bn in 2018; a councillor said people 'would rather give to the central government'". |
| B9 | a councillor said people "would rather give to the central government" | description:41; why:55 | PTS 2024-05-17: 「民眾卻寧願捐給中央」 | SUPPORTED | — |
| B10 | "People preferred giving to the central government" (as fact) | why:123 | same | MISLEADING | This is the councillor's assertion, not a measured fact. Fix: "a councillor said people preferred to give to the central government". |
| B11 | Hualien rules let up to five victims attend, speak only with the chair's permission; no vote | why:132; description:44; ordinance:11 | 作業要點 第三點 (https://glrs.hl.gov.tw/glrsout/LawContent.aspx?id=GL001170, amended 2023-12-27): 「各災害受災民眾至多推派五人代表列席會議，並經主席同意後始得發言」 | SUPPORTED | "at most five per disaster". |
| B12 | "Victims sit on no board." / fact figure "0 votes" | why:131–132 | 2026-05-14 minutes (https://sa.hl.gov.tw/Upload/202606160928010835531.pdf), items 10–11: an appointed committee member recused herself 「因同為0403震災集合式住宅受災戶」 | WRONG | The absolute is literally false in 2026. Fix: "No board or committee reserves a seat for affected households." |
| B13 | "the foundation's board has no seat for them" | description:44 | Foundation charter Art. 6 (https://www.tf4dr.org/constitution): 11–15 directors from 7 agencies plus business, public-interest and civil-society representatives | SUPPORTED | — |
| B14 | "Say over how the money is used — Today: Attend if invited; no vote" | README:52 | 作業要點 第三點 (B11) | MISLEADING | Victims may *send* up to five representatives; it is not "if invited". Fix: "Up to 5 may attend, speak with the chair's permission, no vote". |
| B15 | "an affected household that found out 'only after a year' that NT$400M was unspent" | README:39 | PTS 2025-03-31: 「經過一年以後才發現善款還剩接近4億」; CR-B: NT$425M is the unearmarked balance of the *whole shared account*, 0403's own unearmarked balance NT$368M; 0403 money actually unspent was about NT$668M | MISLEADING | Quote it exactly: "found out 'only after a year' that nearly NT$400M was still left". why:20 already does. |
| B16 | "nearly 300 petitioned for an ordinance" / "A councillor and nearly 300 signatories called for a county ordinance" | why:55; ordinance:13 | PTS 2024-05-17: 「5月1日已多達將近300人的連署，要求善款受到我們縣議會的監督」; 「地方上已有連署，希望能透過《地方自治法》成立花蓮縣自己的重建條例」 | SUPPORTED | — |
| B17 | "Kept can implement the county ordinance nearly 300 people petitioned for" | README:161; description:68 | same | MISLEADING | No such ordinance exists; the petition asked for oversight in general. Fix: "the kind of county ordinance nearly 300 people petitioned for". |
| B18 | "Donations for several disasters sit in one shared account, separated only by bookkeeping" | ordinance:10 | CR-B: one 收支統計表 covering 0206 surplus, 0918, 0403, 康芮 | SUPPORTED | — |
| B19 | "committee reports listed *earmarked* amounts as *spent*" | ordinance:12 | CR-B: 支出 column = 「0403震災計畫通過(匡列數)」 | SUPPORTED | — |
| B20 | "Income was posted as JPG images" | ordinance:12 | County 0403 and 0923 donation statistics are .jpg (B7 URL) | SUPPORTED | — |
| B21 | "monthly spending statements went online three to eight weeks after each cutoff" | ordinance:12 | Sampled the 2026-08-31 statement: PDF created 2026-09-22 (22 days); other months not checked | UNVERIFIABLE | Based on PDF creation dates, which are only a proxy for publication date. Fix: "appear to have gone online (judging by file creation dates) …". |

### C. Backtest table (README:145–150; description:88–93; backtest.ts)

| # | Claim | File:line | Primary source checked | Verdict | Suggested wording / note |
|---|---|---|---|---|---|
| C1 | "NT$553M of donations arrived in April 2024" | backtest.ts:33 | County 0403 monthly table: 29,981,601 + 497,012,105 + 25,972,680 = 552,966,386 | SUPPORTED | — |
| C2 | Kept alert would fire "2 Jul 2024" | README:147; description:90; backtest.ts:34 | 2024-04-03 + 90 days = 2024-07-02 | SUPPORTED | Assumes the custodian records under Kept (stated). |
| C3 | "17 Jan 2025, first news story" | README:147; description:90 | CNA 2025-01-17 confirmed (balance 「3億6000萬餘元」). Earlier county-0403-donation coverage: CNA 2024-05-07 (https://www.cna.com.tw/news/aloc/202405070209.aspx); PTS 2024-05-17 「目前還沒發放是因為還沒完備程序」. No earlier story *on the unspent balance* found (searched 花蓮 0403 善款 餘額/結餘/專戶, 2024) | MISLEADING | backtest.ts:36 hedges; the tables do not. Fix: "17 Jan 2025, first news story we found on the balance". |
| C4 | "199 days" | README:147; description:90 | 2024-07-02 → 2025-01-17 = 199 | SUPPORTED | Depends on C3. |
| C5 | "NT$30M donated for children" on 26 Sep 2025 | README:148; backtest.ts:48 | 2026-05-14 minutes, item 2: 「114年9月26日指定捐款『馬太鞍溪堰塞湖潰堤災害及災區兒童救助』共3筆，捐款金額合計新臺幣3,000萬元」 | SUPPORTED | — |
| C6 | "NT$0 paid 339 days later" (31 Aug 2026) | README:148; description:91; backtest.ts:48 | County statement as of 2026-08-31 (PDF created 2026-09-22): 「受災學生家庭復原補助計畫(草案)(指定捐款) 30,000,000 / 0」; 2025-09-26 → 2026-08-31 = 339 days | SUPPORTED | Context a hostile reader will raise: the same statement shows a first NT$1,777,652 being processed, and the plan was approved by written review in March 2026 with applications from May–June 2026. Add one clause of context. |
| C7 | Alert would fire "25 Dec 2025" | README:148; backtest.ts:49 | 2025-09-26 + 90 = 2025-12-25 | SUPPORTED | — |
| C8 | "never in the news" | README:148; description:91; backtest.ts:51 | LTN 2026-09-24 (https://ec.ltn.com.tw/article/breakingnews/5585043) and TheHubNews 2026-09-24: the donor gave 「於災害發生後第一時間捐款，支持災區及受災兒童救助」, 「相關資源目前由花蓮縣教育處依學生家庭實際需求分階段辦理」 | MISLEADING | The gift and its handling were in the news, though not the amount or the delay. Fix: "no news report of the delay found (as of Oct 2026)". |
| C9 | "NT$97M of approved loans" approved 4 Dec 2025 | README:149; backtest.ts:59 | 2025-12-04 minutes (https://sa.hl.gov.tw/Upload/202605251157099035011.pdf): 「計約9,708萬元」; 2026-05-14 materials list it under 114.12.4 「照案通過」 | SUPPORTED | — |
| C10 | "nothing drawn" | README:149; backtest.ts:59 | 2026-05-14 materials: 「截至115年3月31日止，尚未有更新會提出申請」; KSNews 2026-07-31 (audit): 「無息借貸方案全數未動支」 | SUPPORTED | It is undrawn because no association applied. A demand-driven facility is not money "held back"; say so in one clause. |
| C11 | Public found out "31 Jul 2026, with audit findings"; "149 days" | README:149; description:92; backtest.ts:61 | Arithmetic 2026-03-04 → 2026-07-31 = 149 ✓. The county minutes stating no applications went online around 2026-06-16 (filename; PDF created 2026-06-15) | MISLEADING | Inconsistent method: the 2018 row counts "minutes online" as the public date. By that rule this row is 16 Jun 2026 and 104 days. Use the same convention in every row, or label the column "first news report". |
| C12 | 2018 surplus "moved to another disaster"; decided "20 Sep 2022" | README:150; description:93; backtest.ts:74 | 2022-09-20 minutes (https://sa.hl.gov.tw/Upload/202306140902150900931.pdf): chair 「希望使用0206善款轉入的錢來運用在此災害上」 | SUPPORTED | — |
| C13 | Public found out "14 Jun 2023, minutes online", "about 9 months" earlier | README:150; description:93; backtest.ts:76 | PDF created 2022-09-21; the upload date is inferred only from the filename. The 0206 surplus repurposing was publicly announced around 2022-06-01 with a donor-objection window 6/1–6/30 (https://0206.hl.gov.tw/cl.aspx?n=29638) | MISLEADING | The change of purpose itself was public before the alert date; only this specific allocation was posted late. The 0206/0918 money is also under an ongoing prosecutorial investigation (July 2026). Fix: "The surplus transfer was announced with a donor-objection period in June 2022; the decision to use it for the 2022 earthquake appeared online only with the minutes (about Jun 2023). An ongoing investigation concerns these funds; no finding of wrongdoing." |
| C14 | "Rules about households … cannot be replayed: no household-level data is public" | README:152; description:95 | — | SUPPORTED | Reasonable. |

### D. International cases

| # | Claim | File:line | Primary source checked | Verdict | Suggested wording / note |
|---|---|---|---|---|---|
| D1 | Haiti: "US$488M raised; six permanent homes built" | README:33; description:39; why:91–96; video 0:00 | ProPublica/NPR 2015 (article opened): "$488 million in donations"; permanent homes built "in all of Haiti: six" | SUPPORTED | The Red Cross disputes the framing (transitional shelters for 130,000+). The video's "six permanent homes" is the right wording. |
| D2 | Valencia: recording "inadecuado"; "all €22.1M received in 2024 was still unbudgeted at year-end" | README:34; description:40 | El Español 2026-01-06 (opened): 22,144,636.65 € at 31 Dec 2024, 「pendientes de aplicar a presupuesto」; most allocated "en el último trimestre del pasado año" | SUPPORTED | — |
| D3 | Valencia framing in README (year-end only) | README:34 | same | MISLEADING | The flood was 29 Oct 2024, so "unbudgeted at year-end" means two months, which is weak evidence of delay. Lead with what description:40 has: "most was only allocated in the last quarter of 2025, a year after the floods". |
| D4 | Japanese Red Cross: "¥100bn+ unplanned"; recipients "cannot be identified" | why:98–101 | Reuters 2011-05-11 (via NBC syndication): ¥174bn collected, ¥65bn distributed, "more than 100 billion yen" held, "no clear plan yet", "those who should be receiving the money cannot be identified" | SUPPORTED | Two months after the quake; consider saying so. |
| D5 | Singapore: NKF scandal "led to the Commissioner of Charities (2006) and a new Code of Governance (2007)" | why:106–108 | Commissioner of Charities annual report for 2005 exists (charities.gov.sg), so the office predates 2006; the Code was issued in 2007 | MISLEADING | Fix: "led to a full-time Commissioner of Charities (2006) and a Code of Governance (2007)". |

### E. Law and policy

| # | Claim | File:line | Primary source checked | Verdict | Suggested wording / note |
|---|---|---|---|---|---|
| E1 | "Taiwan's donation-law reform has stalled since 2020" / fact card "Stalled since 2020" | README:161; description:68; why:139–141 | law.moj.gov.tw D0050138: Act last amended **2020-01-15** | MISLEADING | Reform *passed* in 2020. It also conflicts with ordinance:13. Fix: "The Act was last amended in January 2020; no later bill covering government donation accounts has passed (the latest has sat in committee since March 2024)." |
| E2 | "The Public Welfare Fundraising Act's surplus and reporting rules do not bind government accounts" | why:140 | Act Art. 6 (government bodies: receipts, regular disclosure, designated use) vs Arts. 19–20 (勸募團體 only) | SUPPORTED | — |
| E3 | The Act asks a government account for three things, including "publish disclosures (monthly during a major disaster, at the level of spending items) … (Art. 6)" | ordinance:8 | Act Art. 6 says only 「定期辦理公開徵信」; the monthly rule is in the Enforcement Rules Art. 6 (amended) | MISLEADING | Fix the citation: "(Act Art. 6; monthly frequency from Enforcement Rules Art. 6)". |
| E4 | Charities "must spend any surplus within 3 years, and must post results online (Arts. 19–20)" | ordinance:8 | Art. 19(2)–(3): surplus use needs approval, within 3 years; Art. 20: public disclosure, posted by the authority | SUPPORTED | — |
| E5 | "a 2024 amendment for government donation oversight has sat in committee since March 2024" | ordinance:13 | Could not open the Legislative Yuan bill system; not confirmed by search | UNVERIFIABLE | Add the bill number and LY link. |
| E6 | "no draft exists" (of a county ordinance) | ordinance:13 | Absence claim | UNVERIFIABLE | Fix: "we found no draft". |
| E7 | "The 2025 reconstruction act requires monthly disclosure for public money but says nothing about donations" | ordinance:13 | Could not open the act text (searches confirmed only its existence and scope) | UNVERIFIABLE | Cite the article. |
| E8 | Taipei "already regulates a welfare donation account by ordinance, with monthly disclosure" | ordinance:38 | 臺北市政府結合民間資源辦理社會福利事業經費專戶管理及運用自治條例 Art. 8: 「應每月公告之」 | SUPPORTED | — |
| E9 | Local Government Act Arts. 19/25/26/28/30 analysis; "needs only filing, not approval" | ordinance:36–38 | Not opened article by article; this is legal interpretation | UNVERIFIABLE | Already labelled "not legal advice". |
| E10 | "An ordinance is not 'law' under Taiwan's privacy act" | ordinance:47 | Legal interpretation | UNVERIFIABLE | Same. |
| E11 | Japan: "Households cannot see or confirm what the register says about them" | ordinance:53 | Japan's APPI (which has covered local governments since 2023) gives individuals disclosure and correction rights over their own data | MISLEADING | Fix: "have no routine way to see or confirm …". |
| E12 | Virtual Asset Service Act "passed in June 2026" | README:168; description:110 | Passed third reading 2026-06-30 (LTN, Storm, Mirror via search); not yet in force | SUPPORTED | Optional: "passed (not yet in force)". |
| E13 | The relief foundation and other charities "raised most of the 2025 donations" | ordinance:46 | Foundation NT$1.398bn vs county account NT$311M | SUPPORTED | — |

### F. Other Guangfu evidence

| # | Claim | File:line | Primary source checked | Verdict | Suggested wording / note |
|---|---|---|---|---|---|
| F1 | "Three villages outside the 'red zone' were left off the first aid list and had to protest" / "Nanfu, Dajin and Daquan were left out … because they lay outside the 'red zone'" | README:37; description:44; why:135–137 | CNA 2025-10-06 (opened): headline 「南富等3村未納慰助金範圍 村民陳抗」; but in the same article the county says Dajin and Daquan were in the first wave for protected households, and only Nanfu was clearly outside the red zone; the list was the county's NT$50,000 consolation payment | MISLEADING | Fix: "Residents of three villages, at least one outside the 'red zone', protested being left out of the county's first NT$50,000 payment." |
| F2 | NGO: roster "finally confirmed at the end of November"; aid "about ten weeks after the disaster" | README:39; description:106; why:41 | CCRA final report p.17: 「在光復鄉公所的協助下，終在11月底得以確認災戶名冊」; distribution 2025-12-05/06 = day 73–74 | SUPPORTED | — |
| F3 | Indigenous representative: "no meeting notice or call" for seven months | README:39; why:34 | Newsmarket 2026-09-21: 「未收到任何開會通知或電話」, appointed February, county reconstruction committee | SUPPORTED | Person not named in Kept (good). |
| F4 | Ground-floor household missed aid "because agencies used different criteria" | why:27 | SETN 1767342: 「政府補助標準不一，自己已多次落空」 | SUPPORTED | — |
| F5 | "Registration rides on the door-to-door visits the government already makes" | README:59 | MOHW proactive door-to-door verification (CTEE/UDN, Oct 2025, via search) | SUPPORTED | — |

### G. Simulation and cost

| # | Claim | File:line | Source checked | Verdict | Suggested wording / note |
|---|---|---|---|---|---|
| G1 | Simulation table: 89%/day 29, 89%/28; ≈ chance; 28%/27; 90%/29; 85%/31 | README:132–137; description:75–80 | `web/src/lib/replay/fraud-sim.json` (0.888/29, 0.886/28, 0.038–0.042 vs 5% false alarm, 0.281/27, 0.278/27, 0.896/29, 0.851/31) | SUPPORTED | These are model outputs under stated assumptions (30% response rate, etc.), not evidence. Keep "simulation" next to every figure. |
| G2 | "At 2% the audit detects ghosts in 73% of runs, at 5% in 100%; 480 visits (12% of households)" | README:139, 219; description:82 | fraud-sim.json: 0.732, 1.0; auditVisits 480; 480 ÷ 4,039 = 11.9% | SUPPORTED | — |
| G3 | "about 4.9 billion gas, roughly US$150–1,500 at assumed L2 prices" | README:170; description:112 | Recomputed from `cost.ts`: 4,896,631,000 gas; US$146.9–1,469 at 0.01–0.1 gwei, ETH US$3,000 | SUPPORTED | — |
| G4 | "at most 0.003% of the money raised" | README:170; description:112 | 1,469 ÷ (1,397,723,978 ÷ 32) = 0.0034% | WRONG (rounding) | Fix: "about 0.003%" or "under 0.004%". |
| G5 | Slide: "≈US$150–1,500 per disaster, measured" | video-script:17 | as G3 | MISLEADING | The gas was measured; the prices are assumed (the script's own fact table says so). Fix: "gas measured; price assumed". |

### H. Overclaims and internal consistency

| # | Claim | File:line | Check | Verdict | Suggested wording / note |
|---|---|---|---|---|---|
| H1 | "Household can confirm or dispute its payment — Today: No channel" | README:48 | Complaint channels exist (A12) | MISLEADING | "No public, recorded channel". |
| H2 | "Custodian can pad the roster or confirm for itself — Today: Undetectable"; "ghosts … — Today: Undetectable" | README:49–50 | Government audit offices and ministry roster checks can detect these; the county audit office did review this account | MISLEADING | "Not visible to the public". |
| H3 | "only households can sign" | README:49; description:54 ("only real households can sign") | README:58 itself says a designated social worker can sign | MISLEADING | "only the household (or a designated social worker, whom the household can override) can sign". |
| H4 | "a custodian cannot deploy a look-alike without the commitments" | README:126 | Anyone can deploy any contract; the factory only marks genuine clones | MISLEADING | "only funds created by the factory are recognised, so a look-alike is detectable". |
| H5 | "The custodian cannot fake that answer, and cannot pad the list without it showing." | video-script:14 | Colluding issuers can register ghosts that confirm their own lines (README:62, 219) | MISLEADING | "cannot fake a registered household's answer, and padded lines that are not registered households show up". |
| H6 | "the record cannot be rewritten" / "Commitments that cannot be rewritten" | README:68; description:58; why:200 | `ReliefFund.sol` has no owner setters (grep); the registry owner can appoint issuers and auditors, which is disclosed at README:218 | SUPPORTED | — |
| H7 | "Every group involved has said so in public" / "Every group Kept serves has … already described the problem in public" | README:39; why:166 | The "donors" voice on the Why page is a councillor's characterisation, not donors | MISLEADING | "Every group involved has said so in public, or been described doing so". Or drop "every". |
| H8 | "Taiwan: the same loop, for 25 years" | why:114 | The page shows evidence for 2018–2025 only | UNVERIFIABLE (on the page) | Either add one pre-2018 case (e.g. 1999/2009/2014) with a source, or change to "since 2018". |
| H9 | "nine public statements and official records from seven stakeholder groups" | description:106 | The Why page shows six cards | MISLEADING | Make the counts match, or list the nine. |
| H10 | "What we did not find in any deployment we reviewed" | why:157 | Properly hedged | SUPPORTED | — |
| H11 | Ethics: real private persons named | all audited files | No private individuals are named. Linked county PDFs contain names and a private postal account number (CR-B item 9); Kept links to them but does not reproduce them | SUPPORTED | Do not quote those PDFs beyond institution-level figures. |
| H12 | Ethics: "Investigations mentioned are ongoing; we describe a pattern, not anyone's guilt" | description:136; why:145 | The 2018-surplus backtest row (C13) concerns funds now under investigation, and the README/description tables carry no disclaimer next to it | MISLEADING | Add "an alert is not a finding" to the README/description table captions (README:143 has it; description:86 has it) and an investigation note to the 2018 row. |

## Consistency issues across files (no new verdicts; see rows above)

- "under a fifth": README:35 and video say "that year"; description:41, why:55/123 say "by May 2024". Both are problematic (B7, B8).
- "stalled since 2020" (README, description, Why) vs "in committee since March 2024" (ordinance summary) (E1, E5).
- Committee meetings: "three" (description, Why, ordinance) vs four in CNA 2025-01-17 (B6).
- "NT$400M was unspent" (README:39) vs "nearly NT$400M … still left" (Why:20, description:106 "nearly NT$400M was unspent") (B15).
- "only households can sign" (README:49) vs the proxy signature (README:58) (H3).
- Cost basis: README:170 lists "one published line" per household; description:112 omits it, though the 4.9bn figure includes it.

## Sources that could not be accessed

- Reuters (reuters.com blocks fetch; the same Reuters text was read via NBC syndication).
- KSNews blocked WebFetch; the article was read via direct HTTP.
- Legislative Yuan bill system (E5), the 2025 reconstruction special act text (E7), and the Audit Office report platform (anti-bot).
