// Renders slides.html to the seven 1920x1080 PNGs the video uses. Usage: node render-slides.js
const { chromium } = require("playwright-core");
const path = require("path");
const { pathToFileURL } = require("url");

const DIR = path.resolve(__dirname, "..");
const NAMES = ["01-hook", "02-loop", "03-hualien", "04-trust", "05-backtest", "06-why-web3", "07-close"];
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [i, name] of NAMES.entries()) {
    await page.goto(`${pathToFileURL(path.join(DIR, "slides.html")).href}#${i + 1}`);
    await page.reload(); // the slide is chosen from the hash on load
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(DIR, `${name}.png`) });
    console.log("wrote", name);
  }
  await browser.close();
})();
