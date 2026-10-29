// Records the Round 2 demo on the redesigned live site (app shell, guide bar, large-type Chinese household screen).
// Same capture as record.js (Chrome DevTools screencast, JPEG frames, 1920x1080), fresh browser profile so the guide
// starts at step 1. Usage: node record-round2.js part1 | part2 | committee      (CLIPS_OUT= overrides the output folder)
// part2 must start within the 5-minute waiting period; "committee" re-records committee1 and runs part2 straight after.
// part1: register (landing -> household -> chief -> office -> verified), lines (ministry publishes, household answers
//        in 繁中大字), waiting (still waiting -> alert), audits, committee1 (Try it refused; cap change queued).
// part2: committee2 (household votes no, neighbours vote no), wait out the 5-minute period, committee3 (vetoed).
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const SITE = process.env.SITE || "https://kept-lilac.vercel.app";
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const ROOT = __dirname;
const CLIPS = process.env.CLIPS_OUT || path.join(ROOT, "clips-round2");
const PROFILE = path.join(ROOT, "profile-round2");
const LOG = path.join(ROOT, "record-round2-log.json");
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

// No animations inside the app: a spinner would otherwise produce frames, and idle waits could not be cut.
// The landing page keeps its hero animation.
const NO_ANIM = "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}";
async function stillCss() {
  await page.evaluate((css) => {
    if (document.getElementById("rec-css")) return;
    const s = document.createElement("style");
    s.id = "rec-css";
    s.textContent = css;
    document.documentElement.appendChild(s);
  }, NO_ANIM);
}

async function setup() {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    executablePath: CHROME,
    headless: true,
    viewport: { width: 1536, height: 864 },
    deviceScaleFactor: 1.25,
    args: ["--hide-scrollbars"],
  });
  await ctx.addInitScript((css) => {
    if (location.pathname === "/") return;
    const add = () => {
      if (document.getElementById("rec-css")) return;
      const s = document.createElement("style");
      s.id = "rec-css";
      s.textContent = css;
      document.documentElement.appendChild(s);
    };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", add) : add();
  }, NO_ANIM);
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
const view = (v) => page.evaluate((v) => localStorage.setItem("kept.household.view", v), v);

// A ring where we are about to click, so viewers can follow (the logo's coral).
async function ring(locator) {
  const box = await locator.boundingBox();
  if (!box) return;
  await page.evaluate(({ x, y }) => {
    const d = document.createElement("div");
    d.style.cssText = `position:fixed;left:${x - 24}px;top:${y - 24}px;width:48px;height:48px;border-radius:50%;border:4px solid #f16646;background:rgba(241,102,70,.16);z-index:99999;pointer-events:none`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 900);
  }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
  await sleep(550);
}
async function click(locator, label) {
  await locator.scrollIntoViewIfNeeded();
  await sleep(300);
  await ring(locator);
  mark(label || "click");
  await locator.click();
}
const btn = (name, scope = page) => scope.getByRole("button", { name }).first();
const card = (title) => page.locator("section", { has: page.getByRole("heading", { name: title, exact: true }) }).last();

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
  // 1. Landing, then a household registers with two signatures; the guide bar ticks along.
  await go("/", "Try the demo");
  await sleep(1500);
  await start("register");
  await sleep(3500);
  await page.evaluate(() => localStorage.setItem("kept.household.view", "en"));
  await click(page.getByRole("link", { name: /Try the demo, 2 minutes/ }), "try-demo");
  await page.getByRole("button", { name: "Create credential" }).waitFor({ timeout: 90_000 });
  await stillCss();
  await sleep(1200);
  await click(btn("Create credential"), "create");
  await btn(/Simulate: chief scans this code/).waitFor({ timeout: 60_000 });
  await sleep(1200);
  await click(btn(/Simulate: chief scans this code/), "scan");
  await sleep(1500);
  await go("/issuer", "Scanned registration codes");
  const propose = btn(/Propose registration/);
  await propose.waitFor({ timeout: 60_000 });
  await sleep(1000);
  await click(propose, "propose");
  await page.getByText(/No codes scanned yet/).waitFor({ timeout: 120_000 });
  await sleep(1500);
  const actor = page.getByLabel("Signing as");
  if ((await actor.inputValue()) !== "office") {
    await ring(actor);
    await actor.selectOption("office");
    await sleep(1200);
  }
  const waiting = card("Waiting for my signature");
  const approve = waiting.getByRole("button", { name: "Approve" }).last();
  await approve.waitFor({ timeout: 90_000 });
  await sleep(800);
  await click(approve, "approve");
  await page.getByText(/Confirmed on/).first().waitFor({ timeout: 120_000 });
  await sleep(1500);
  await go("/household", "Status");
  await page.getByText("Verified household").first().waitFor({ timeout: 120_000 });
  await sleep(3000);
  await stop();

  // 2. The ministry publishes a payment line; the household switches to 繁中大字 and answers it.
  await go("/custody", "Every hand signs for what it holds");
  await page.locator("input[type=checkbox]").first().waitFor({ timeout: 120_000 });
  await start("lines");
  await sleep(800);
  const box = page.locator("input[type=checkbox]").first();
  await scrollToEl(box, 300, 1200);
  await ring(box);
  await box.check();
  await sleep(900);
  await click(btn(/Publish payment lines/), "publish");
  await page.getByText(/Confirmed on/).first().waitFor({ timeout: 120_000 });
  await sleep(1500);
  await go("/household", "Payments recorded for my household");
  await btn("I received it").waitFor({ timeout: 180_000 });
  await sleep(1500);
  await click(page.getByRole("button", { name: "繁中大字" }), "zh");
  const yes = btn(/有，我收到了/);
  await yes.waitFor({ timeout: 120_000 });
  await sleep(1800);
  await scrollToEl(page.getByText("這筆錢，您有收到嗎？"), 260, 1200);
  await sleep(800);
  await click(yes, "received");
  await page.getByText("您回報：有收到").waitFor({ timeout: 120_000 });
  await sleep(3000);
  await stop();

  // 3. Still waiting, anonymously, in 繁中大字; the public dashboard raises the alert.
  await go("/household", "還在等補助嗎？");
  const wait = btn("我還在等");
  await wait.waitFor({ timeout: 120_000 });
  await scrollToEl(page.getByRole("heading", { name: "還在等補助嗎？" }), 140, 0);
  await sleep(800);
  await start("waiting");
  await sleep(1200);
  await click(wait, "waiting");
  await page.getByText(/本週已回報/).waitFor({ timeout: 180_000 });
  await sleep(2000);
  await go("/dashboard", "Accountability alerts");
  await scrollToEl(page.getByRole("heading", { name: "Accountability alerts" }).first(), 100, 1500);
  await page.getByText(/Households say they are waiting/).first().waitFor({ timeout: 120_000 }).catch(() => {});
  await sleep(3500);
  await stop();

  // 4. Sample audits on the public dashboard.
  await go("/dashboard", "Accountability alerts");
  const audits = page.getByRole("heading", { name: "Sample audits", exact: true });
  await audits.waitFor({ timeout: 120_000 });
  await scrollToEl(audits, 120, 0);
  await sleep(800);
  await start("audits");
  await sleep(5000);
  await stop();

  await committee1();
}

async function committee1() {
  // 5. Committee: "Try it" is refused by the contract; a cap change goes into the public waiting period.
  await go("/committee", "Try to spend outside the charter");
  await start("committee1");
  await sleep(1500);
  await click(page.getByRole("button", { name: "Try it", exact: true }), "try-it");
  await page.getByText("Refused by the contract.").waitFor({ timeout: 60_000 });
  await sleep(3500);
  const caps = card("Change caps");
  await scrollToEl(caps, 140, 1200);
  await click(btn("Propose", caps), "cap-change");
  await page.getByText(/Confirmed on/).first().waitFor({ timeout: 120_000 });
  await sleep(1200);
  const proposals = card("Proposals");
  const id = (await proposals.locator("span.text-muted", { hasText: /^#\d+$/ }).first().innerText()).trim();
  state.proposal = id;
  save();
  log("proposal", id);
  const member = page.getByLabel("Signing as");
  await scrollTo(0, 800);
  await ring(member);
  await member.selectOption("c2");
  await sleep(1200);
  const row = proposals.locator("div.py-3", { hasText: `${id} ` }).first();
  await scrollToEl(row, 200, 1200);
  await click(btn("Approve", row), "approve-cap");
  await row.getByText(/Public waiting period/).first().waitFor({ timeout: 120_000 });
  state.queuedAt = Date.now();
  save();
  await sleep(3000);
  await stop();
}

async function part2() {
  // 6. The household votes no, three neighbours vote no; after the waiting period, execute -> vetoed.
  // Votes are on the standard screen; part1 left the household on 繁中大字.
  await page.goto(SITE + "/household", { waitUntil: "domcontentloaded" });
  await view("en");
  await go("/household", "Changes you can vote on");
  const votes = card("Changes you can vote on");
  const no = votes.getByRole("button", { name: "No", exact: true }).last();
  await no.waitFor({ timeout: 90_000 });
  await start("committee2");
  await scrollToEl(votes, 120, 1500);
  await sleep(1000);
  await click(no, "vote-no");
  await votes.getByText(/You voted no/).waitFor({ timeout: 180_000 });
  await sleep(1500);
  await go("/committee", "Proposals");
  const proposals = card("Proposals");
  const row = proposals.locator("div.py-3", { hasText: `${state.proposal} ` }).first();
  await scrollToEl(row, 200, 1200);
  await click(btn(/Demo: 3 neighbours vote no/, row), "neighbours");
  await sleep(8000);
  await stop();
  const left = (state.queuedAt || 0) + 5 * 60_000 + 20_000 - Date.now();
  if (left > 0) {
    log(`waiting ${Math.round(left / 1000)}s for the public waiting period`);
    await sleep(left);
  }
  await go("/committee", "Proposals");
  const p2 = card("Proposals");
  const r2 = p2.locator("div.py-3", { hasText: `${state.proposal} ` }).first();
  await scrollToEl(r2, 200, 0);
  await sleep(600);
  await start("committee3");
  await sleep(800);
  const exec = btn("Execute", r2);
  await exec.waitFor({ timeout: 60_000 });
  await click(exec, "execute");
  await r2.getByText(/Vetoed by households/).first().waitFor({ timeout: 180_000 });
  await sleep(3500);
  await stop();
}

(async () => {
  const ctx = await setup();
  const which = process.argv[2];
  try {
    if (which === "part1") await part1();
    else if (which === "part2") await part2();
    else if (which === "committee") await committee1(), await part2();
    else throw new Error("usage: node record-round2.js part1|part2|committee");
    log("done", which);
  } catch (e) {
    log("FAILED:", e.message);
    await page.screenshot({ path: path.join(ROOT, `fail-round2-${which}.png`) }).catch(() => {});
    if (current) await stop().catch(() => {});
    process.exitCode = 1;
  } finally {
    await ctx.close();
  }
})();
