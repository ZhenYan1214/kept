// Records the demo on the live site as clips of JPEG frames (Chrome DevTools screencast, 1920x1080).
// Usage: node record.js part1 | part2 | part3
// part1: registration, committee proposal (starts the 5-minute waiting period), payment lines,
//        dispute, dashboard, NGO claim.   part2: household vote, neighbours vote, execute -> vetoed.
// part3: real-data stills in narration order, and the verified badge.
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const SITE = process.env.SITE || "https://kept-lilac.vercel.app";
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const ROOT = __dirname;
const CLIPS = path.join(ROOT, "clips");
const PROFILE = path.join(ROOT, "profile");
const LOG = path.join(ROOT, "record-log.json");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

let page, cdp, current = null;
const state = fs.existsSync(LOG) ? JSON.parse(fs.readFileSync(LOG, "utf8")) : {};
const save = () => fs.writeFileSync(LOG, JSON.stringify(state, null, 1));

async function start(name) {
  const dir = path.join(CLIPS, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  current = { name, dir, frames: [], marks: [] };
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
  await sleep(400);
}
async function stop() {
  await sleep(700);
  await cdp.send("Page.stopScreencast");
  fs.writeFileSync(path.join(current.dir, "frames.json"), JSON.stringify(current));
  log(`clip ${current.name}: ${current.frames.length} frames`);
  current = null;
}
const mark = (label) => current && current.marks.push({ label, t: Date.now() / 1000 });

async function setup() {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    executablePath: CHROME,
    headless: true,
    viewport: { width: 1536, height: 864 },
    deviceScaleFactor: 1.25,
    args: ["--hide-scrollbars"],
  });
  // No animations: a waiting spinner would otherwise produce frames, and idle waits could not be cut.
  await ctx.addInitScript(() => {
    const css = "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}";
    const add = () => {
      if (document.getElementById("rec-css")) return;
      const s = document.createElement("style");
      s.id = "rec-css";
      s.textContent = css;
      document.documentElement.appendChild(s);
    };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", add) : add();
    try { localStorage.setItem("kept.guide-hidden", "1"); } catch {}
  });
  page = ctx.pages()[0] || (await ctx.newPage());
  page.setDefaultTimeout(120_000);
  cdp = await ctx.newCDPSession(page);
  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    try { await cdp.send("Page.screencastFrameAck", { sessionId }); } catch {}
    if (!current) return;
    const i = current.frames.length;
    const file = String(i).padStart(5, "0") + ".jpg";
    fs.writeFileSync(path.join(current.dir, file), Buffer.from(data, "base64"));
    current.frames.push({ file, t: metadata.timestamp });
  });
  return ctx;
}

async function go(p, waitText) {
  await page.goto(SITE + p, { waitUntil: "domcontentloaded" });
  if (waitText) await page.getByText(waitText, { exact: false }).first().waitFor({ timeout: 90_000 });
  await sleep(800);
}

// A ring where we are about to click, so viewers can follow.
async function ring(locator) {
  const box = await locator.boundingBox();
  if (!box) return;
  await page.evaluate(({ x, y }) => {
    const d = document.createElement("div");
    d.style.cssText = `position:fixed;left:${x - 22}px;top:${y - 22}px;width:44px;height:44px;border-radius:50%;border:4px solid #0f6e64;background:rgba(15,110,100,.15);z-index:99999;pointer-events:none`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 900);
  }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
  await sleep(500);
}
async function click(locator, label) {
  await locator.scrollIntoViewIfNeeded();
  await sleep(300);
  await ring(locator);
  mark(label || "click");
  await locator.click();
}
const btn = (name, scope = page) => scope.getByRole("button", { name }).first();
const card = (title) => page.locator("section", { has: page.getByRole("heading", { name: title, exact: true }) }).first();

async function scrollTo(y, ms = 1500) {
  const from = await page.evaluate(() => window.scrollY);
  const steps = Math.max(1, Math.round(ms / 40));
  for (let i = 1; i <= steps; i++) {
    const v = from + ((y - from) * i) / steps;
    await page.evaluate((v) => window.scrollTo(0, v), v);
    await sleep(40);
  }
}
async function scrollToEl(locator, offset = 120, ms = 1500) {
  const y = await locator.evaluate((el, off) => el.getBoundingClientRect().top + window.scrollY - off, offset);
  await scrollTo(Math.max(0, y), ms);
}

async function part1() {
  // 1. Real data page
  await go("/replay", "Where the trail stops");
  await start("realdata");
  await sleep(1500);
  await scrollToEl(page.getByRole("heading", { name: /One hand visible/ }), 100, 2500);
  await sleep(2000);
  await scrollToEl(page.getByRole("heading", { name: /93% went to one ministry/ }), 100, 2000);
  await sleep(2000);
  await scrollToEl(page.getByRole("heading", { name: /confirming it arrived did not/ }), 90, 2500);
  await sleep(4500);
  await scrollToEl(page.getByRole("heading", { name: /estimate kept moving/ }), 100, 2000);
  await sleep(2500);
  await stop();

  // 2. Alerts, then register a household with two signatures
  await go("/", "Accountability alerts");
  await start("register");
  await scrollToEl(page.getByRole("heading", { name: /Accountability alerts/i }).first(), 100, 2000);
  await sleep(2500);
  await go("/household", "Get a credential");
  await sleep(600);
  await click(btn("Create credential"), "create");
  await page.getByText("Simulate: chief scans this code").waitFor({ timeout: 60_000 });
  await sleep(1200);
  await click(btn(/Simulate: chief scans this code/), "scan");
  await sleep(1200);
  await go("/issuer", "Scanned registration codes");
  await btn(/Propose registration/).waitFor({ timeout: 60_000 });
  await sleep(800);
  await click(btn(/Propose registration/), "propose");
  await page.getByText(/No codes scanned yet/).waitFor({ timeout: 120_000 });
  await sleep(800);
  const actor = page.getByLabel("Acting as");
  await ring(actor);
  await actor.selectOption("office");
  await sleep(1500);
  const waiting = card("Waiting for my signature");
  await btn("Approve", waiting).waitFor({ timeout: 90_000 });
  await click(btn("Approve", waiting), "approve");
  await waiting.getByText("Nothing to sign").waitFor({ timeout: 120_000 });
  await sleep(1000);
  await go("/household", "Status");
  await page.getByText("Verified household").first().waitFor({ timeout: 120_000 });
  await sleep(2000);
  await stop();

  // 3. Committee: outside-the-charter refused; cap change into the public waiting period
  await go("/committee", "Allocate money");
  await start("committee1");
  const alloc = card("Allocate money");
  await alloc.getByLabel("Purpose").selectOption("255");
  await sleep(600);
  await click(btn("Propose", alloc), "public-works");
  await alloc.getByText(/not in the fund's charter/).waitFor({ timeout: 60_000 });
  await sleep(2500);
  const caps = card("Change caps");
  await click(btn("Propose", caps), "cap-change");
  await page.getByText(/Pending approvals/).first().waitFor({ timeout: 120_000 });
  await sleep(800);
  const member = page.getByLabel("Acting as");
  await ring(member);
  await member.selectOption("c2");
  await sleep(1500);
  const proposals = card("Proposals");
  await click(btn("Approve", proposals), "approve-cap");
  await proposals.getByText(/Public waiting period/).first().waitFor({ timeout: 120_000 });
  state.queuedAt = Date.now();
  save();
  await sleep(2500);
  await stop();

  // 4. Ministry publishes payment lines; the household disputes its own line
  await go("/custody", "Every hand signs for what it holds");
  await page.locator("input[type=checkbox]").first().waitFor({ timeout: 120_000 });
  await start("lines");
  const box = page.locator("input[type=checkbox]").first();
  await box.scrollIntoViewIfNeeded();
  await ring(box);
  await box.check();
  await sleep(800);
  const publish = btn(/Publish payment lines/);
  await click(publish, "publish");
  await page.getByText(/Publish payment lines \(NT\$0\)/).first().waitFor({ timeout: 120_000 }).catch(() => {});
  await sleep(1500);
  await go("/household", "Payments recorded for my household");
  const dispute = btn("I did not receive it");
  await dispute.waitFor({ timeout: 180_000 });
  await scrollToEl(card("Payments recorded for my household"), 100, 1500);
  await sleep(2000);
  await click(dispute, "dispute");
  await page.getByText(/You disputed/).first().waitFor({ timeout: 120_000 });
  await sleep(2000);
  await go("/", "Sample audits");
  await scrollToEl(page.getByRole("heading", { name: /Where the money is, hand by hand/ }).first(), 100, 2500);
  await sleep(2500);
  await scrollToEl(page.getByText("Sample audits").first(), 100, 2500);
  await sleep(3000);
  await stop();

  // 5. NGO counter: eligible once, rejected the second time
  await go("/household", "Aid programmes near you");
  await start("ngo");
  const progs = card("Aid programmes near you");
  await scrollToEl(progs, 100, 1500);
  await click(btn(/Show code at the counter/, progs), "show-code");
  await page.getByText(/One-time code for programme/).waitFor({ timeout: 120_000 });
  await sleep(2500);
  await go("/ngo", "Scanner");
  await click(btn(/Verify & record hand-over/), "verify");
  await page.getByText(/Eligible/).first().waitFor({ timeout: 120_000 });
  await sleep(2500);
  await go("/household", "Aid programmes near you");
  await click(btn(/Show code at the counter/, card("Aid programmes near you")), "show-code-2");
  await page.getByText(/One-time code for programme/).waitFor({ timeout: 120_000 });
  await sleep(1500);
  await go("/ngo", "Scanner");
  await click(btn(/Verify & record hand-over/), "verify-2");
  await page.getByText(/already received this programme/).first().waitFor({ timeout: 120_000 });
  await sleep(3000);
  await stop();
}

async function part2() {
  // 6. Household votes no; three neighbours vote no; after the waiting period, execute -> vetoed
  await go("/household", "Changes you can vote on");
  const votes = card("Changes you can vote on");
  await btn("No", votes).waitFor({ timeout: 90_000 });
  await start("committee2");
  await scrollToEl(votes, 100, 1500);
  await sleep(1000);
  await click(btn("No", votes), "vote-no");
  await votes.getByText(/You voted no/).waitFor({ timeout: 180_000 });
  await sleep(1500);
  await go("/committee", "Proposals");
  const proposals = card("Proposals");
  await click(btn(/Demo: 3 neighbours vote no/, proposals), "neighbours");
  await sleep(8000);
  await stop();
  const wait = (state.queuedAt || 0) + 5 * 60_000 + 20_000 - Date.now();
  if (wait > 0) {
    log(`waiting ${Math.round(wait / 1000)}s for the public waiting period`);
    await sleep(wait);
  }
  await go("/committee", "Proposals");
  await start("committee3");
  const p2 = card("Proposals");
  await scrollToEl(p2, 100, 1200);
  await btn("Execute", p2).waitFor({ timeout: 60_000 });
  await click(btn("Execute", p2), "execute");
  await p2.getByText(/Vetoed by households/).first().waitFor({ timeout: 180_000 });
  await sleep(3500);
  await stop();
}

async function part3() {
  // Real data, shot by shot in the order the narration uses it; plus the verified badge after registration.
  await go("/replay", "Where the trail stops");
  const jump = async (re, off = 100) => {
    const h = page.getByRole("heading", { name: re }).first();
    const y = await h.evaluate((el, o) => el.getBoundingClientRect().top + window.scrollY - o, off);
    await page.evaluate((v) => window.scrollTo(0, v), Math.max(0, y));
    await sleep(600);
  };
  await page.evaluate(() => window.scrollTo(0, 0));
  await start("rd-numbers");
  await sleep(5000);
  await stop();
  await jump(/93% went to one ministry/, 140);
  await start("rd-ministry");
  await sleep(5000);
  await stop();
  await jump(/confirming it arrived did not/, 130);
  await start("rd-timeline");
  await sleep(6000);
  await stop();
  await jump(/One hand visible/, 140);
  await start("rd-trail");
  await sleep(5000);
  await stop();
  await go("/household", "Status");
  await start("verified");
  await page.getByText(/^Verified household ·/).first().waitFor({ timeout: 180_000 });
  await sleep(2500);
  await stop();
}

(async () => {
  const ctx = await setup();
  const which = process.argv[2];
  try {
    if (which === "part1") await part1();
    else if (which === "part2") await part2();
    else if (which === "part3") await part3();
    else throw new Error("usage: node record.js part1|part2");
    log("done", which);
  } catch (e) {
    log("FAILED:", e.message);
    await page.screenshot({ path: path.join(ROOT, `fail-${which}.png`) }).catch(() => {});
    if (current) await stop().catch(() => {});
    process.exitCode = 1;
  } finally {
    await ctx.close();
  }
})();
