/**
 * REAL public data, transcribed by hand from all 11 monthly public disclosures (公開徵信) that the
 * Disaster Relief Foundation (財團法人賑災基金會, tf4dr.org) has published for its 0923 Mataian River
 * barrier lake appeal (花蓮馬太鞍溪堰塞湖). No 12th disclosure existed on retrieval.
 * Institution-level only: no household or personal data. Retrieved 2026-10-17.
 *
 * Field sources:
 * - spent / reconciled / asOf: the HTML summary sentence on each page (■支出報告).
 * - raised: #1–#9 the HTML sentence 「勸募活動所得：新臺幣13億9,184萬473元」 (gross donations
 *   9/25–10/24, before the 217,410 refunds); #10–#11 the income-table PNG total 1,397,723,978
 *   (net of refunds, plus interest and earmarked transfers). The two are different definitions.
 * - transfers / prealloc / claims: counted and summed by hand from the expense-table PNGs
 *   (支出明細/捐款使用情形). "prealloc" = rows labelled 預撥; "claims" = rows labelled 辦理
 *   (labelled 核銷 in #1). In every disclosure prealloc + claims equals the table's 合計
 *   and the HTML "spent" figure exactly.
 */

export type Disclosure = {
  n: number;
  published: string;
  asOf: string | null;
  raised: number | null;
  spent: number | null;
  reconciled: number | null;
  transfers: number | null;
  prealloc: number | null;
  claims: number | null;
  url: string;
  note?: string;
};

const U = (id: number) => `https://www.tf4dr.org/fundraising_plans/156/credits/${id}`;

export const DISCLOSURES: Disclosure[] = [
  {
    n: 1, published: "2025-11-24", asOf: null, raised: 1_391_840_473,
    spent: 832_618_380, reconciled: null,
    transfers: 8, prealloc: 829_950_000, claims: 2_668_380, url: U(204),
    note: "Text says 「目前已支出款項」 (no 含預撥 wording) and gives no reconciled figure. Claim rows are labelled 核銷 here, 辦理 from #2 on. Land Bank channel stated as 9億7,994萬1,195元, which does not sum to the stated total (later corrected to 9億7,986萬2,195元).",
  },
  {
    n: 2, published: "2025-12-24", asOf: null, raised: 1_391_840_473,
    spent: 869_260_980, reconciled: 24_510_980,
    transfers: 19, prealloc: 859_950_000, claims: 9_310_980, url: U(237),
    note: "First reconciled figure. Reconciled minus claims = 15,200,000 (unexplained in source; equals 19 deaths x 800,000, see notes).",
  },
  {
    n: 3, published: "2026-01-26", asOf: null, raised: 1_391_840_473,
    spent: 893_231_685, reconciled: 27_454_911,
    transfers: 24, prealloc: 880_976_774, claims: 12_254_911, url: U(303),
  },
  {
    n: 4, published: "2026-02-23", asOf: null, raised: 1_391_840_473,
    spent: 907_531_685, reconciled: 27_654_911,
    transfers: 27, prealloc: 895_076_774, claims: 12_454_911, url: U(306),
  },
  {
    n: 5, published: "2026-03-25", asOf: null, raised: 1_391_840_473,
    spent: 1_181_569_669, reconciled: 27_749_911,
    transfers: 34, prealloc: 1_169_019_758, claims: 12_549_911, url: U(336),
    note: "Largest single jump: 212,100,000 pre-allocated to MOHW for home-cleaning support on 2026-03-05.",
  },
  {
    n: 6, published: "2026-04-30", asOf: null, raised: 1_391_840_473,
    spent: 1_189_559_669, reconciled: 27_839_911,
    transfers: 38, prealloc: 1_176_919_758, claims: 12_639_911, url: U(369),
  },
  {
    n: 7, published: "2026-05-29", asOf: null, raised: 1_391_840_473,
    spent: 1_189_559_669, reconciled: 27_839_911,
    transfers: 38, prealloc: 1_176_919_758, claims: 12_639_911, url: U(403),
    note: "Body content (text and all 6 images) byte-identical to #6; only the title differs. No transfers dated between 2026-04-15 and 2026-06-05.",
  },
  {
    n: 8, published: "2026-06-23", asOf: "2026-06-22", raised: 1_391_840_473,
    spent: 1_196_819_669, reconciled: 27_839_911,
    transfers: 39, prealloc: 1_184_179_758, claims: 12_639_911, url: U(437),
    note: "Source text has the typo 「11憶」 for 11億. Reconciled unchanged for a third month.",
  },
  {
    n: 9, published: "2026-07-27", asOf: null, raised: 1_391_840_473,
    spent: 1_198_744_669, reconciled: 27_864_911,
    transfers: 42, prealloc: 1_186_079_758, claims: 12_664_911, url: U(470),
  },
  {
    n: 10, published: "2026-08-25", asOf: "2026-08-21", raised: 1_397_723_978,
    spent: 1_207_029_669, reconciled: 27_879_911,
    transfers: 45, prealloc: 1_194_349_758, claims: 12_679_911, url: U(503),
    note: "Income now shown as a table image (net of refunds, plus interest and earmarked transfers); matches MOHW 實募金額 1,397,723,978.",
  },
  {
    n: 11, published: "2026-09-26", asOf: "2026-09-25", raised: 1_397_723_978,
    spent: 1_209_049_669, reconciled: 49_149_006,
    transfers: 48, prealloc: 1_194_349_758, claims: 14_699_911, url: U(534),
    note: "Reconciled jumped by 21,269,095 while new claims were only 2,020,000; the other 19,249,095 is not itemised in the source.",
  },
];

export const DISCLOSURE_SOURCE = {
  index: "https://www.tf4dr.org/fundraising_plans/156/credits",
  retrieved: "2026-10-17",
  mohw: "https://sasw.mohw.gov.tw/app39/fundactivity/fundactivityDetails/16446568",
};
