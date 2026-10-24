// Renders the two Details images in the logo's colours: the flow diagram (how-kept-works.html) and the real
// reconciliation chart (a screenshot of the live /replay card, framed by chart-frame.html).
// Usage: node render.js   (needs playwright-core and Chrome)
const { chromium } = require("playwright-core");
const path = require("path");
const { pathToFileURL } = require("url");

const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const SITE = process.env.SITE || "https://kept-lilac.vercel.app";
const here = (f) => path.join(__dirname, f);

async function frame(browser, html, out) {
  // A short viewport so the full-page screenshot takes the content's own height.
  const page = await browser.newPage({ viewport: { width: 2400, height: 600 } });
  await page.goto(pathToFileURL(here(html)).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: here(out), fullPage: true });
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });

  await frame(browser, "how-kept-works.html", "kept-flow.png");
  await frame(browser, "architecture.html", "kept-architecture.png");

  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  await page.goto(`${SITE}/replay`, { waitUntil: "networkidle" });
  const card = page.locator("section", { has: page.getByRole("heading", { name: /confirming it arrived did not/ }) }).first();
  await card.waitFor();
  await card.screenshot({ path: here("reconciliation-card.png") });
  await frame(browser, "chart-frame.html", "guangfu-reconciliation.png");

  await browser.close();
  console.log("wrote kept-flow.png, kept-architecture.png and guangfu-reconciliation.png");
})();
