/**
 * REAL public data, transcribed by hand from the Disaster Relief Foundation's 11th public
 * disclosure for the 0923 Mataian River barrier lake appeal (published 2026-09-26 as PNG images).
 * Institution-level only: no household or personal data. Retrieved 2026-10-15.
 * Source: https://www.tf4dr.org/fundraising_plans/156/credits/534
 */

export const SOURCE = {
  url: "https://www.tf4dr.org/fundraising_plans/156/credits/534",
  title: "賑災基金會 0923 專案第 11 次公開徵信",
  published: "2026-09-26",
  asOf: "2026-09-25",
  retrieved: "2026-10-15",
};

/** Income statement (收入報告). Amounts in NT$. */
export const INCOME = [
  { label: "0923 appeal donations", zh: "0923 花蓮馬太鞍溪堰塞湖災害專案", amount: 1_391_840_473 },
  { label: "Refunds requested by donors (Nov, 30 people)", zh: "民眾申請退款（11 月份 30 人）", amount: -216_299 },
  { label: "Refunds requested by donors (Dec, 1 person)", zh: "民眾申請退款（12 月份 1 人）", amount: -1_111 },
  { label: "Interest (half-year, 21 Dec)", zh: "半年期活期存款利息（12/21）", amount: 2_477_754 },
  { label: "Donations earmarked for this appeal", zh: "民眾指定用途", amount: 183_288 },
  { label: "Earmarked donations transferred from the ministry", zh: "衛福部轉入指定用途", amount: 2_429_017 },
  { label: "Donations earmarked for this appeal (23 Feb 2026)", zh: "民眾指定用途（115/2/23）", amount: 1_010_856 },
];
export const INCOME_TOTAL = 1_397_723_978;

/** Stated in the disclosure text: spent (incl. pre-allocations) and reconciled, as of 2026-09-25. */
export const SPENT_TOTAL = 1_209_049_669;
export const RECONCILED_TOTAL = 49_149_006;

export type RecipientKind = "ministry" | "county" | "agency" | "ngo" | "school" | "civic-tech";
export type Area = "statutory" | "livelihood" | "mental" | "community" | "other";

/** The foundation's own relief categories (賑助種類), grouped as in its disclosure: 23 categories in 5 areas. */
export const AREAS: Record<Area, { label: string; zh: string; categories: number }> = {
  statutory: { label: "Statutory relief", zh: "法定賑助", categories: 7 },
  livelihood: { label: "Livelihood support", zh: "生活支持", categories: 4 },
  mental: { label: "Mental-health support", zh: "心理支持", categories: 1 },
  community: { label: "Community support", zh: "社區支持", categories: 10 },
  other: { label: "Other", zh: "其它", categories: 1 },
};

export type Transfer = {
  n: number;
  date: string; // Gregorian (the disclosure uses ROC years)
  prealloc: boolean; // 預撥 (pre-allocated, reconciled later) vs 辦理 (paid on a claim)
  recipient: string;
  recipientZh: string;
  kind: RecipientKind;
  item: string;
  itemZh: string;
  area: Area;
  amount: number;
};

type Name = readonly [string, string];
const MOHW: Name = ["Ministry of Health and Welfare", "衛生福利部"];
const COUNTY: Name = ["Hualien County Government", "花蓮縣政府"];
const FEIYANG: Name = ["Chinese Fei Yang Care Association", "社團法人中華飛揚關懷協會"];
const VOL = ["Lodging for heavy-machinery volunteers", "各機關重機械志工動員住宿補助案"] as const;
const RESILIENCE = [
  "Village & tribal community resilience (Fire Agency plan)",
  "內政部消防署「花蓮縣馬太鞍溪溢流災害村里與部落社區韌性建構計畫」",
] as const;

function t(
  n: number,
  date: string,
  prealloc: boolean,
  [recipient, recipientZh]: Name,
  kind: RecipientKind,
  [item, itemZh]: readonly [string, string],
  area: Area,
  amount: number,
): Transfer {
  return { n, date, prealloc, recipient, recipientZh, kind, item, itemZh, area, amount };
}

const flood = (households: number) =>
  [`Flood relief (${households} household${households > 1 ? "s" : ""})`, `淹水救助（${households} 戶）`] as const;

export const TRANSFERS: Transfer[] = [
  t(1, "2025-10-01", true, MOHW, "ministry", ["Home clean-up support (est. 1,837 households)", "家園清理支持方案（預估 1,837 戶）"], "livelihood", 55_110_000),
  t(2, "2025-10-01", true, MOHW, "ministry", ["Death relief (est. 18 people)", "死亡賑助（預估 18 人）"], "statutory", 14_400_000),
  t(3, "2025-10-03", true, MOHW, "ministry", ["Home clean-up support (top-up for 1,837 households)", "家園清理支持方案（補調整 1,837 戶金額）"], "livelihood", 36_740_000),
  t(4, "2025-10-07", true, MOHW, "ministry", ["Housing repair & family support (est. 1,837 households)", "房屋修復暨家庭支持救助金（預估 1,837 戶）"], "livelihood", 367_400_000),
  t(5, "2025-10-23", true, MOHW, "ministry", ["Death relief (1), clean-up and housing repair (est. 1,488 households outside the protected zone, incl. 110 disputed)", "3 項賑助：死亡賑助 1 人、家園清理支持方案、房屋修復暨家庭支持救助金（預估 1,488 非保全戶【含 110 戶爭議件】）"], "livelihood", 356_300_000),
  t(6, "2025-11-03", false, COUNTY, "county", VOL, "other", 562_600),
  t(7, "2025-11-03", false, COUNTY, "county", VOL, "other", 1_313_480),
  t(8, "2025-11-17", false, COUNTY, "county", VOL, "other", 792_300),
  t(9, "2025-11-20", false, COUNTY, "county", VOL, "other", 337_200),
  t(10, "2025-11-20", false, COUNTY, "county", VOL, "other", 304_600),
  t(11, "2025-11-20", false, COUNTY, "county", VOL, "other", 926_800),
  t(12, "2025-11-20", false, COUNTY, "county", VOL, "other", 101_400),
  t(13, "2025-11-20", false, COUNTY, "county", VOL, "other", 158_000),
  t(14, "2025-12-02", false, MOHW, "ministry", ["“Safe stay, we pay” lodging (incl. infant placement)", "「安心住，幫你付」專案（含嬰幼兒安置）"], "livelihood", 74_400),
  t(15, "2025-12-03", false, COUNTY, "county", VOL, "other", 415_800),
  t(16, "2025-12-03", false, COUNTY, "county", ["Missing-person relief (est. 5 people)", "失蹤賑助（預估 5 人）"], "statutory", 4_000_000),
  t(17, "2025-12-03", true, MOHW, "ministry", ["“Safe stay, we pay” lodging", "「安心住，幫你付」專案"], "livelihood", 30_000_000),
  t(18, "2025-12-08", false, COUNTY, "county", VOL, "other", 124_400),
  t(19, "2025-12-10", false, COUNTY, "county", ["Serious-injury relief (1 person)", "重傷賑助（1 人）"], "statutory", 200_000),
  t(20, "2026-01-09", false, MOHW, "ministry", ["Social workers alongside the rebuild", "重建路上、社工陪你走－馬太鞍溪堰塞湖專案社工服務計畫"], "community", 2_338_931),
  t(21, "2026-01-14", true, MOHW, "ministry", ["Community care points & disability support", "花蓮縣馬太鞍溪溢流災後關懷據點暨身心障礙者支持計畫"], "community", 13_304_000),
  t(22, "2026-01-16", true, ["Hualien Indigenous East Taiwan Cultural Development Association", "花蓮縣原住民東台灣文化發展協會"], "ngo", ["2026 livelihood rebuilding: Cilah workstation", "115 年生活重建－Cilah 鹽巴工作站計畫"], "community", 7_722_774),
  t(23, "2026-01-20", false, COUNTY, "county", flood(1), "statutory", 5_000),
  t(24, "2026-01-23", false, COUNTY, "county", ["Serious-injury relief (3 people)", "重傷賑助（3 人）"], "statutory", 600_000),
  t(25, "2026-01-30", false, COUNTY, "county", ["Serious-injury relief (1 person)", "重傷賑助（1 人）"], "statutory", 200_000),
  t(26, "2026-01-30", true, MOHW, "ministry", ["Long-term-care community support", "花蓮縣馬太鞍溪堰塞湖溢流災害長照個案社區支持計畫"], "community", 2_100_000),
  t(27, "2026-02-11", true, ["Ministry of the Interior, National Land Management Agency", "內政部國土署"], "agency", ["Rent subsidy (est. 1,000 households)", "受災戶住宅補貼方案（租金補貼）（預估 1,000 戶）"], "statutory", 12_000_000),
  t(28, "2026-02-25", false, COUNTY, "county", ["Flood relief (1 household) and relocation relief (4 people)", "淹水救助（1 戶）及安遷賑助（4 人）"], "statutory", 45_000),
  t(29, "2026-03-04", false, COUNTY, "county", flood(7), "statutory", 35_000),
  t(30, "2026-03-05", true, MOHW, "ministry", ["Home clean-up support (adjusted to 4,039 households and 114 cases)", "家園清理支持方案（補調整為 4,039 戶及 114 案）"], "livelihood", 212_100_000),
  t(31, "2026-03-11", true, MOHW, "ministry", ["Health-insurance premiums & medical care", "受災戶健保費補助暨穩定醫療服務提供專案"], "community", 38_753_928),
  t(32, "2026-03-18", true, FEIYANG, "ngo", ["Home repairs for vulnerable households", "花蓮光復，家園再起－災後艱困家戶修繕專案"], "community", 7_500_000),
  t(33, "2026-03-18", true, ["Mustard Seed Mission", "財團法人基督教芥菜種會"], "ngo", ["Recovery action plan", "0923 光復馬太鞍溪堰塞湖災害回應復原行動計畫"], "community", 15_589_056),
  t(34, "2026-03-19", false, COUNTY, "county", flood(3), "statutory", 15_000),
  t(35, "2026-04-09", false, ["Schools (various)", "各級學校"], "school", ["Study grants (16 students)", "助學金（16 名）"], "statutory", 90_000),
  t(36, "2026-04-10", true, ["Garden of Hope Foundation", "財團法人勵馨社會福利事業基金會"], "ngo", ["“One more mile” livelihood rebuilding", "多陪一里路光復災後生活重建計畫"], "community", 1_700_000),
  t(37, "2026-04-15", true, ["Taiwan Child Development Association", "社團法人台灣兒童發展協會"], "ngo", ["Mental-health rebuild: elders living alone", "心理重建計畫－子計畫一「獨居長輩社區連結計畫」"], "mental", 3_200_000),
  t(38, "2026-04-15", true, ["Taiwan Creative Arts Therapy Alliance", "臺灣創造性藝術治療聯盟"], "ngo", ["Mental-health rebuild: children and youth", "心理重建計畫－子計畫二「創造性藝術治療災後兒少心理重建計畫」"], "mental", 3_000_000),
  t(39, "2026-06-05", true, ["Presbyterian Church in Taiwan mission council", "財團法人台灣基督長老教會宣教事業聯合會"], "ngo", RESILIENCE, "community", 7_260_000),
  t(40, "2026-06-23", false, COUNTY, "county", flood(3), "statutory", 15_000),
  t(41, "2026-07-17", false, COUNTY, "county", flood(2), "statutory", 10_000),
  t(42, "2026-07-24", true, ["Tzu Chi Foundation", "財團法人中華民國佛教慈濟慈善事業基金會"], "ngo", RESILIENCE, "community", 1_900_000),
  t(43, "2026-07-28", true, FEIYANG, "ngo", ["Home repairs for vulnerable households", "花蓮光復，家園再起－災後艱困家戶修繕專案"], "community", 7_500_000),
  t(44, "2026-08-05", true, ["World Vision Taiwan", "財團法人台灣世界展望會"], "ngo", RESILIENCE, "community", 770_000),
  t(45, "2026-08-19", false, COUNTY, "county", flood(3), "statutory", 15_000),
  t(46, "2026-08-31", false, ["Jiuxin Civic Tech (guangfu.tw)", "究心公益科技股份有限公司"], "civic-tech", ["guangfu.tw disaster liaison platform", "「guangfu.tw 災害聯繫會報平臺」"], "community", 2_000_000),
  t(47, "2026-08-31", false, COUNTY, "county", flood(1), "statutory", 5_000),
  t(48, "2026-09-08", false, COUNTY, "county", flood(3), "statutory", 15_000),
];
