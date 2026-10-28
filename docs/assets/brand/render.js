// Renders the DoraHacks cover and banner, and the logo PNGs, into ../../../../submission_kit.
// Usage: node render.js   (needs playwright-core and Chrome)
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = process.env.OUT || path.resolve(__dirname, "../../../../submission_kit");
const here = (f) => path.join(__dirname, f);

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [html, out, width, height] of [["cover.html", "cover-1920x1080.png", 1920, 1080], ["banner.html", "kept-banner.png", 2000, 695]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(pathToFileURL(here(html)).href);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, out) });
  }
  const svg = fs.readFileSync(here("../logo/kept-logo-tile.svg"), "utf8");
  for (const size of [512, 1024]) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<style>html,body{margin:0}svg{width:${size}px;height:${size}px;display:block}</style>${svg}`);
    await page.screenshot({ path: path.join(OUT, `kept-logo-${size}.png`), omitBackground: true });
  }
  await browser.close();
  console.log("wrote cover, banner and logo PNGs to", OUT);
})();
