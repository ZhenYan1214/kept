// Renders the two Details images: the flow diagram (from how-kept-works.html) and the real reconciliation chart
// (screenshot of the live /replay page). Usage: node render.js   (needs playwright-core and Chrome)
const { chromium } = require("playwright-core");
const path = require("path");
const { pathToFileURL } = require("url");

const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const SITE = process.env.SITE || "https://kept-lilac.vercel.app";

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });

  const flow = await browser.newPage({ viewport: { width: 2400, height: 600 } });
  await flow.goto(pathToFileURL(path.join(__dirname, "how-kept-works.html")).href);
  await flow.evaluate(() => document.fonts.ready);
  await flow.screenshot({ path: path.join(__dirname, "how-kept-works.png"), fullPage: true });

  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  await page.goto(`${SITE}/replay`, { waitUntil: "networkidle" });
  const card = page.locator("section", { has: page.getByRole("heading", { name: /confirming it arrived did not/ }) }).first();
  await card.waitFor();
  await card.screenshot({ path: path.join(__dirname, "reconciliation-guangfu.png") });

  await browser.close();
  console.log("wrote how-kept-works.png and reconciliation-guangfu.png");
})();
