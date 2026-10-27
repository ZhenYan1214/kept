// Renders the stills the Round 2 video needs: the four new slides, the architecture image with one column in focus at a
// time, and the household's decoded transaction on Blockscout. Usage: node render-round2.js
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const ASSETS = path.resolve(__dirname, "..");
const DETAILS = path.resolve(__dirname, "../../../assets/details");
const OUT = path.join(ASSETS, "round2");
const TX = "0x7003603d900c67692886c0df9454315ff1828b4c0d1a051999cd138aa3ce04c4"; // household answers "not received"
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });

  const slides = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (let i = 1; i <= 4; i++) {
    await slides.goto(`${pathToFileURL(path.join(ASSETS, "slides-round2.html")).href}#${i}`);
    await slides.reload();
    await slides.evaluate(() => document.fonts.ready);
    await slides.screenshot({ path: path.join(OUT, `slide-${i}.png`) });
  }

  // Architecture: full, then each of the three columns in focus (the others dimmed).
  const arch = await browser.newPage({ viewport: { width: 2400, height: 600 } });
  await arch.goto(pathToFileURL(path.join(DETAILS, "architecture.html")).href);
  await arch.evaluate(() => document.fonts.ready);
  for (const [name, col] of [["arch-0", 0], ["arch-1", 1], ["arch-2", 2], ["arch-3", 3]]) {
    await arch.evaluate((col) => {
      const cols = [...document.querySelectorAll(".cols > .col")];
      cols.forEach((c, i) => (c.style.opacity = col === 0 || i === col - 1 ? "1" : "0.22"));
      document.querySelector(".off").style.opacity = col === 0 || col === 3 ? "1" : "0.22";
    }, col);
    await arch.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  }

  // The decoded event on Blockscout.
  const bs = await browser.newPage({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: 1.25 });
  await bs.goto(`https://base-sepolia.blockscout.com/tx/${TX}?tab=logs`, { waitUntil: "domcontentloaded" });
  await bs.getByText("LineConfirmed").first().waitFor({ timeout: 60_000 });
  await bs.waitForTimeout(1500);
  await bs.screenshot({ path: path.join(OUT, "blockscout-logs.png") });
  await bs.goto(`https://base-sepolia.blockscout.com/tx/${TX}`, { waitUntil: "domcontentloaded" });
  await bs.waitForTimeout(2500);
  await bs.screenshot({ path: path.join(OUT, "blockscout-tx.png") });

  await browser.close();
  console.log("wrote", fs.readdirSync(OUT).join(", "));
})();
