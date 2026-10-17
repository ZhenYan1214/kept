/**
 * Backtest: on which date would Kept's alert rules have flagged real cases from Hualien County's
 * donation accounts, compared with when the public found out? REAL public data, institution-level only.
 * Full timelines, assumptions and every source: docs/research_notes/台灣災難捐款真實案例/警示回測資料.md
 *
 * "Kept would flag" assumes the custodian records under Kept (receipts, transfers and payments as they
 * happen). Dates when county documents went online are estimated from upload timestamps in file names.
 * Household-level rules (unconfirmed receipts, disputes) cannot be backtested: no household-level data is public.
 */

export type BacktestCase = {
  id: string;
  disaster: string;
  custodian: string;
  rule: string;
  facts: string;
  keptFlags: string; // ISO date
  publicLearned: string | null; // ISO date, null = never reached the news (as far as we found)
  publicHow: string;
  sources: { label: string; url: string; secondary?: boolean }[];
};

const COUNTY_2025_02 = "https://sa.hl.gov.tw/Upload/202504020943277687541.pdf";
const COUNTY_2026_06 = "https://sa.hl.gov.tw/Upload/202606160928010835531.pdf";

export const BACKTEST: BacktestCase[] = [
  {
    id: "0403-held",
    disaster: "2024 earthquake (0403)",
    custodian: "Hualien County donation account",
    rule: "Money held over 90 days without being passed on or reported paid",
    facts:
      "NT$553M of donations arrived in April 2024 (NT$792M in total). By 27 Feb 2025, eleven months on, NT$425M had been earmarked and NT$124M (16%) actually paid out.",
    keptFlags: "2024-07-02",
    publicLearned: "2025-01-17",
    publicHow: "First news story we found on the unspent balance (county council session); the audit office's finding reached the press on 31 Jul 2026.",
    sources: [
      { label: "County committee report, appendix B", url: COUNTY_2025_02 },
      { label: "CNA, 2025-01-17", url: "https://www.cna.com.tw/news/aloc/202501170181.aspx" },
    ],
  },
  {
    id: "0923-children",
    disaster: "2025 barrier lake (0923)",
    custodian: "Hualien County donation account",
    rule: "Earmarked donation held over 90 days with nothing paid",
    facts:
      "NT$30M donated on 26 Sep 2025 specifically for children's relief. Still NT$0 paid on 31 Aug 2026, 339 days later.",
    keptFlags: "2025-12-25",
    publicLearned: null,
    publicHow: "No news report of the delay found. The county said in Sep 2026 that it is paying out in stages, by need; applications were scheduled for May–June 2026, and the first NT$1.78M was being processed.",
    sources: [{ label: "County committee minutes (item 2)", url: COUNTY_2026_06 }],
  },
  {
    id: "0403-loans",
    disaster: "2024 earthquake (0403)",
    custodian: "Hualien County donation account",
    rule: "Approved plan with nothing paid after 90 days",
    facts: "Interest-free loans of NT$97.08M for rebuilding committees approved on 4 Dec 2025; nothing drawn by the spring because no committee had applied. An alert is a prompt to ask why, not a finding.",
    keptFlags: "2026-03-04",
    publicLearned: "2026-06-16",
    publicHow: "County minutes saying no rebuilding committee had applied went online (estimated from the file's upload date); the audit office's findings reached the press on 31 Jul 2026.",
    sources: [
      { label: "County committee minutes", url: COUNTY_2026_06 },
      { label: "KSNews, 2026-07-31 (audit findings, secondary)", url: "https://www.ksnews.com.tw/e/125676", secondary: true },
    ],
  },
];

export const BACKTEST_NOTES =
  "https://github.com/ZhenYan1214/kept/blob/main/docs/research_notes/%E5%8F%B0%E7%81%A3%E7%81%BD%E9%9B%A3%E6%8D%90%E6%AC%BE%E7%9C%9F%E5%AF%A6%E6%A1%88%E4%BE%8B/%E8%AD%A6%E7%A4%BA%E5%9B%9E%E6%B8%AC%E8%B3%87%E6%96%99.md";
