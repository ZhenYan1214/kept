// Renders the animated scenes in motion-round2.html to video, frame by frame: load(name, cues, D) then seek(t) for each
// frame, captured as JPEG over CDP and piped into ffmpeg. Frames depend only on t, so the output is exact at any speed.
// Library: const m = await openMotion(); await m.render(name, D, cues, opts, out.mp4); await m.close();
// CLI:     node render-motion.js sheet [scene…]   contact sheets of each scene at its cues (round2/sheet-<scene>.jpg)
//          node render-motion.js mp4 <scene> [out] one scene with its default cues
const { chromium } = require("playwright-core");
const { spawn, execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const ASSETS = path.resolve(__dirname, "..");
const PAGE = pathToFileURL(path.join(ASSETS, "motion-round2.html")).href;
const FPS = 30;

async function openMotion() {
  const browser = await chromium.launch({ executablePath: CHROME, args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(PAGE);
  await page.evaluate(() => document.fonts.ready);
  const cdp = await page.context().newCDPSession(page);
  const shot = async (scale = 1, quality = 94) =>
    Buffer.from((await cdp.send("Page.captureScreenshot", { format: "jpeg", quality, clip: { x: 0, y: 0, width: 1920, height: 1080, scale } })).data, "base64");
  const load = (name, cues, D, opts) => page.evaluate(([n, c, d, o]) => window.load(n, c, d, o), [name, cues || {}, D, opts || {}]);
  const seek = (t) => page.evaluate((t) => window.seek(t), t);

  async function render(name, D, cues, opts, out) {
    await load(name, cues, D, opts);
    const n = Math.round(D * FPS);
    const ff = spawn("ffmpeg", ["-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
      "-vf", "scale=1920:1080,fps=30,format=yuv420p,setsar=1", "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-frames:v", String(n), out], { stdio: ["pipe", "inherit", "inherit"] });
    const done = new Promise((res, rej) => ff.on("close", (code) => (code ? rej(new Error(`ffmpeg ${code}`)) : res())));
    for (let i = 0; i < n; i++) {
      await seek(i / FPS);
      const buf = await shot();
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    }
    ff.stdin.end();
    await done;
    return out;
  }
  // Defaults declared by a scene, for previews.
  const scenes = () => page.evaluate(() => Object.fromEntries(Object.entries(window.SCENES).map(([k, s]) => [k, { D: s.D, cues: s.cues }])));
  return { render, load, seek, shot, scenes, close: () => browser.close() };
}
module.exports = { openMotion };

if (require.main === module) {
  (async () => {
    const [mode, ...rest] = process.argv.slice(2);
    const m = await openMotion();
    const all = await m.scenes();
    const OUT = path.join(ASSETS, "round2");
    if (mode === "sheet") {
      const tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "sheet-"));
      for (const name of rest.length ? rest : Object.keys(all)) {
        const { D, cues } = all[name];
        // A frame just after each cue settles, plus the start and the end.
        const times = [0.6, ...Object.values(cues).map((c) => Math.min(D - 0.05, c + 1.2)), D - 0.05].sort((a, b) => a - b);
        await m.load(name, {}, D, { shot: "" });
        for (const [k, t] of times.entries()) { await m.seek(t); fs.writeFileSync(path.join(tmp, `${name}-${String(k).padStart(2, "0")}.jpg`), await m.shot(0.4, 85)); }
        const cols = 4, rows = Math.ceil(times.length / cols);
        execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", "1", "-i", path.join(tmp, `${name}-%02d.jpg`), "-vf", `tile=${cols}x${rows}:padding=6:color=white`, "-frames:v", "1", path.join(OUT, `sheet-${name}.jpg`)]);
        console.log("sheet", name, times.map((t) => t.toFixed(1)).join(" "));
      }
    } else if (mode === "mp4") {
      const name = rest[0], out = path.resolve(rest[1] || `${name}.mp4`);
      const t0 = Date.now();
      await m.render(name, all[name].D, {}, {}, out);
      console.log("wrote", out, `${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }
    await m.close();
  })();
}
