// Outside judge for Kept's public numbers. Recomputes every figure the project states about the real
// Guangfu and Hualien data from the raw transcriptions, then checks that the README, the submission
// text and the video script say the same thing. Exit code 1 on any mismatch.
//
//   node web/scripts/verify-data.mts        (Node 22.18+ / 24: runs TypeScript directly)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { TRANSFERS, INCOME, INCOME_TOTAL, SPENT_TOTAL, RECONCILED_TOTAL } from "../src/lib/replay/guangfu-2025.ts";
import { DISCLOSURES } from "../src/lib/replay/disclosures-0923.ts";
import { BACKTEST } from "../src/lib/replay/backtest.ts";
import { TOTAL_GAS, usdCost, PRICE_ASSUMPTIONS } from "../src/lib/replay/cost.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (p: string) => readFileSync(join(root, p), "utf8");
const docs = {
  README: read("README.md"),
  submission: read("docs/submission/description.md"),
  video: read("docs/submission/video-script.md"),
};
const sim = JSON.parse(read("web/src/lib/replay/fraud-sim.json"));

let failed = 0;
let passed = 0;
const check = (ok: boolean, what: string, detail = "") => {
  if (ok) passed++;
  else failed++;
  console.log(`${ok ? "  ✔" : "  ✘"} ${what}${detail ? `  (${detail})` : ""}`);
};
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const pct1 = (a: number, b: number) => Math.round((a / b) * 1000) / 10;
const DAY = 86_400_000;
const days = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);
const said = (doc: keyof typeof docs, text: string) => check(docs[doc].includes(text), `${doc} states "${text}"`);

console.log("\n1. Transcription integrity (foundation, disclosure #11)");
check(TRANSFERS.length === 48, "48 transfers", `${TRANSFERS.length}`);
check(sum(TRANSFERS.map((t) => t.amount)) === SPENT_TOTAL, "transfers add up to the stated spent total", `${sum(TRANSFERS.map((t) => t.amount))} vs ${SPENT_TOTAL}`);
check(sum(INCOME.map((i) => i.amount)) === INCOME_TOTAL, "income lines add up to the stated total");
const last = DISCLOSURES[DISCLOSURES.length - 1];
check(last.spent === SPENT_TOTAL && last.reconciled === RECONCILED_TOTAL && last.raised === INCOME_TOTAL, "disclosure #11 in the series matches the detailed transcription");
check(last.transfers === TRANSFERS.length, "disclosure #11 lists the same number of transfers");

console.log("\n2. Monthly series (11 disclosures)");
check(DISCLOSURES.length === 11, "11 disclosures");
for (const d of DISCLOSURES) {
  if (d.spent !== null && d.prealloc !== null && d.claims !== null) {
    check(d.prealloc + d.claims === d.spent, `#${d.n}: pre-allocated + paid on claim = spent`);
  }
}
for (let i = 1; i < DISCLOSURES.length; i++) {
  const a = DISCLOSURES[i - 1];
  const b = DISCLOSURES[i];
  check((b.spent ?? 0) >= (a.spent ?? 0) && (b.transfers ?? 0) >= (a.transfers ?? 0), `#${b.n}: spent and transfer count never go down`);
}
const withRec = DISCLOSURES.filter((d) => d.reconciled !== null);
const base = withRec[0].reconciled! - withRec[0].claims!;
const flat = withRec.filter((d) => d.reconciled! - d.claims! === base);
check(base === 15_200_000, "reconciled minus paid-on-claim starts at NT$15,200,000", `${base}`);
check(flat.map((d) => d.n).join(",") === "2,3,4,5,6,7,8,9,10", "it stays exactly there from #2 to #10, and changes at #11", flat.map((d) => d.n).join(","));
const flatMonths = Math.round(days(flat[0].asOf ?? flat[0].published, flat[flat.length - 1].asOf ?? flat[flat.length - 1].published) / 30.4);
check(flatMonths === 8, "that is eight months", `${flatMonths}`);

console.log("\n3. Derived shares");
const pre = sum(TRANSFERS.filter((t) => t.prealloc).map((t) => t.amount));
const mohw = sum(TRANSFERS.filter((t) => t.recipient === "Ministry of Health and Welfare").map((t) => t.amount));
check(pct1(pre, SPENT_TOTAL) === 98.8, "98.8% pre-allocated", `${pct1(pre, SPENT_TOTAL)}%`);
check(Math.round((mohw / SPENT_TOTAL) * 100) === 93, "93% to one ministry", `${pct1(mohw, SPENT_TOTAL)}%`);
check(Math.round((RECONCILED_TOTAL / SPENT_TOTAL) * 100) === 4, "4% reconciled", `${pct1(RECONCILED_TOTAL, SPENT_TOTAL)}%`);
const hualienPaid = 124_205_920; // county committee report, appendix B (2025-02-27)
const hualienReceived = 792_000_000; // ~NT$7.92億 at that date (CNA 2025-01-17: 7億9196萬餘元)
check(Math.round((hualienPaid / hualienReceived) * 100) === 16, "Hualien 2024: 16% paid out after 11 months", `${pct1(hualienPaid, hualienReceived)}%`);

console.log("\n4. Backtest lead times");
const lead = (id: string) => {
  const c = BACKTEST.find((x) => x.id === id)!;
  return c.publicLearned ? days(c.keptFlags, c.publicLearned) : null;
};
check(lead("0403-held") === 199, "2024 earthquake: 199 days earlier", `${lead("0403-held")}`);
check(lead("0403-loans") === 149, "approved loans: 149 days earlier", `${lead("0403-loans")}`);
check(lead("0923-children") === null, "children's fund: never in the news (no public date)");
check(days("2025-09-26", "2026-08-31") === 339, "children's fund: 339 days unpaid");
check(days("2024-04-03", BACKTEST.find((x) => x.id === "0403-held")!.keptFlags) === 90, "held-over-90-days rule fires 90 days after the quake");

console.log("\n5. Cost");
const lo = usdCost(PRICE_ASSUMPTIONS.gweiLow);
const hi = usdCost(PRICE_ASSUMPTIONS.gweiHigh);
check(Math.round(TOTAL_GAS / 1e8) / 10 === 4.9, "about 4.9 billion gas", `${(TOTAL_GAS / 1e9).toFixed(2)}bn`);
check(Math.abs(lo - 150) < 10 && Math.abs(hi - 1500) < 100, "roughly US$150–1,500", `US$${lo.toFixed(0)}–${hi.toFixed(0)}`);

console.log("\n6. Simulation figures quoted in the docs");
const r = (scenario: string, rate: number) => sim.results.find((x: { scenario: string; rate: number }) => x.scenario === scenario && x.rate === rate);
const P = (x: number) => Math.round(x * 100);
check(P(r("withheld", 0.01).self.detected) === 89, "withheld at random, 1%: 89%");
check(P(r("targeted", 0.01).withAudit.detected) === 28, "targeted, 1%, with audit: 28%");
check(P(r("ghost", 0.01).withAudit.detected) === 28, "ghosts, 1%, with audit: 28%");
check(P(r("ghost", 0.02).withAudit.detected) === 73, "ghosts, 2%, with audit: 73%");
check(P(r("ghost", 0.05).withAudit.detected) === 100, "ghosts, 5%, with audit: 100%");
check(P(r("excluded", 0.01).self.detected) === 90, "left off every roster, 1%: 90%");
check(sim.assumptions.auditVisits === 480, "480 audit visits");

console.log("\n7. The documents say the same numbers");
for (const doc of ["README", "submission"] as const) {
  said(doc, "98.8%");
  said(doc, "NT$15.2M");
  said(doc, "199 days");
  said(doc, "149 days");
  said(doc, "16%");
  said(doc, "339 days");
}
said("README", "4.9 billion gas");
said("submission", "4.9 billion gas");
said("video", "sixteen percent");
said("video", "eight months");
for (const doc of ["README", "submission", "video"] as const) {
  // Lines that warn against the claim ("Do NOT say ...") are allowed.
  const used = docs[doc]
    .split("\n")
    .filter((l) => !/do not say/i.test(l))
    .some((l) => /NT\$420M (still|left)|four hundred million/.test(l));
  check(!used, `${doc} no longer uses the retracted "NT$420M left" claim`);
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
