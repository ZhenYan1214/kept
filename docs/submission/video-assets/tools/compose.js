// Builds the demo video: slides + recorded clips fitted to each narration row, voiceover, burned-in captions.
// Usage: node compose.js <out.mp4>   (also writes <out>.srt for YouTube)
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = __dirname;
const SLIDES = path.resolve(ROOT, "..").replace(/\\/g, "/");
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "out", "kept-demo.mp4"));
const BUILD = path.join(ROOT, "build");
fs.mkdirSync(BUILD, { recursive: true });
fs.mkdirSync(path.dirname(OUT), { recursive: true });

const LEAD = 0.5; // silence before each row's narration
const CAP = 0.7; // longest a recorded frame may stay on screen before scaling (cuts out waiting)
const ff = (args) => execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...args], { cwd: BUILD, stdio: ["ignore", "inherit", "inherit"] });

const rows = [...Array(8)].map((_, i) => JSON.parse(fs.readFileSync(path.join(ROOT, "audio", `row${i}.json`), "utf8")));
const spoken = rows.map((r) => r.words.at(-1).t + r.words.at(-1).d);
const wordAt = (row, re, from = 0) => {
  const i = rows[row].words.findIndex((w, k) => k >= from && re.test(w.w));
  if (i < 0) throw new Error(`word ${re} not in row ${row}`);
  return LEAD + rows[row].words[i].t;
};

// Seconds of screen per row; never shorter than the narration plus a beat.
const want = [14, 27, 37, 37, 16.5, 18, 20, 8.5];
const dur = want.map((d, i) => Math.max(d, LEAD + spoken[i] + 1.0));

// What is on screen in each row. Slides take fixed times; clips share the rest by their (compressed) length.
const slide = (file, until) => ({ slide: file, until });
const clip = (name, from, to) => ({ clip: name, from, to });
// A still from the last frame of a recorded clip, shown until a given time (like a slide).
const still = (name, until) => {
  const j = JSON.parse(fs.readFileSync(path.join(ROOT, "clips", name, "frames.json"), "utf8"));
  return { slide: path.join(ROOT, "clips", name, j.frames.at(-1).file).replace(/\\/g, "/"), until };
};
const plan = [
  [slide("01-hook.png")],
  [slide("02-loop.png", wordAt(1, /^Hualien$/) - 0.6), slide("03-hualien.png", wordAt(1, /^After$/) - 0.3), slide("04-trust.png")],
  [still("rd-numbers", wordAt(2, /^most$/, rows[2].words.findIndex((w) => w.w === "pre-allocated")) - 0.2), still("rd-ministry", wordAt(2, /^eleven$/) - 0.4), still("rd-timeline", wordAt(2, /^Pre-allocating$/) - 0.3), still("rd-trail")],
  [clip("register"), clip("verified", -2.6), clip("lines", undefined, 22.5), clip("audits")],
  [clip("ngo")],
  [clip("committee1"), clip("committee2"), clip("committee3")],
  [slide("06-why-web3.png")],
  [slide("07-close.png")],
];

function clipFrames({ clip: name, from, to }) {
  const dir = path.join(ROOT, "clips", name);
  const j = JSON.parse(fs.readFileSync(path.join(dir, "frames.json"), "utf8"));
  const t0 = j.frames[0].t, end = j.frames.at(-1).t;
  const a = from === undefined ? t0 : from < 0 ? end + from : t0 + from;
  const b = to === undefined ? end : t0 + to;
  // Keep the frame on screen at time a, then every frame up to b.
  let first = 0;
  while (first + 1 < j.frames.length && j.frames[first + 1].t <= a) first++;
  const fr = j.frames.slice(first).filter((f, k) => k === 0 || f.t <= b);
  return fr.map((f, k) => ({
    file: path.join(dir, f.file).replace(/\\/g, "/"),
    d: k + 1 < fr.length ? Math.min(fr[k + 1].t - Math.max(f.t, a), CAP) : 0.6,
  }));
}

function renderRow(i) {
  const items = plan[i];
  const list = [];
  if (items[0].slide) {
    let t = 0;
    items.forEach((it, k) => {
      const until = it.until ?? dur[i];
      list.push({ file: it.slide.includes("/") ? it.slide : `${SLIDES}/${it.slide}`, d: until - t });
      t = until;
    });
  } else {
    const parts = items.map(clipFrames);
    const total = parts.flat().reduce((s, f) => s + f.d, 0);
    const k = dur[i] / total;
    console.log(`row ${i}: ${total.toFixed(1)}s of footage -> ${dur[i].toFixed(1)}s (x${(1 / k).toFixed(2)} speed)`);
    parts.flat().forEach((f) => list.push({ file: f.file, d: f.d * k }));
  }
  const txt = list.map((f) => `file '${f.file}'\nduration ${f.d.toFixed(4)}`).join("\n") + `\nfile '${list.at(-1).file}'\n`;
  fs.writeFileSync(path.join(BUILD, `row${i}.txt`), txt);
  ff(["-f", "concat", "-safe", "0", "-i", `row${i}.txt`, "-vf", "scale=1920:1080:flags=lanczos,fps=30,format=yuv420p",
    "-t", dur[i].toFixed(3), "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-r", "30", `row${i}.mp4`]);
}

// Captions: cut the script text into short cues and time them by the voice's word boundaries.
function cues(i, offset) {
  const words = rows[i].words;
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const tokens = rows[i].text.replace(/[‘’]/g, "'").split(/\s+/).filter(Boolean);
  // Map each script token to the boundary that speaks it (boundaries sometimes merge two tokens, e.g. "in 2024").
  const at = [];
  let w = 0, acc = "";
  tokens.forEach((tok) => {
    if (w >= words.length) w = words.length - 1;
    at.push(w);
    acc += norm(tok);
    if (acc.length >= norm(words[w].w).length) { w++; acc = ""; }
  });
  // Sentences, then split long ones at a comma or semicolon near the middle.
  const groups = [];
  let cur = [];
  tokens.forEach((tok, k) => {
    cur.push(k);
    if (/[.?!]["']?$/.test(tok) || k === tokens.length - 1) { groups.push(cur); cur = []; }
  });
  const text = (g) => g.map((k) => tokens[k]).join(" ");
  const split = (g) => {
    if (text(g).length <= 84) return [g];
    let best = -1, score = 1e9;
    g.forEach((k, n) => {
      if (n === g.length - 1) return;
      const left = text(g.slice(0, n + 1)).length, s = Math.abs(left - text(g).length / 2) - (/[,;:]$/.test(tokens[k]) ? 30 : 0);
      if (s < score) { score = s; best = n; }
    });
    return [...split(g.slice(0, best + 1)), ...split(g.slice(best + 1))];
  };
  const out = groups.flatMap(split).map((g) => {
    const a = words[at[g[0]]], b = words[at[g.at(-1)]];
    return { start: offset + LEAD + a.t, end: offset + LEAD + b.t + b.d, text: text(g) };
  });
  out.forEach((c, k) => { c.end = Math.min(c.end + 0.5, k + 1 < out.length ? out[k + 1].start - 0.05 : c.end + 0.8); });
  return out;
}
const stamp = (s) => {
  const ms = Math.round(s * 1000), h = Math.floor(ms / 3.6e6), m = Math.floor(ms / 6e4) % 60, x = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
};

const offsets = dur.map((_, i) => dur.slice(0, i).reduce((s, d) => s + d, 0));
const total = offsets.at(-1) + dur.at(-1);
console.log("rows:", dur.map((d) => d.toFixed(1)).join(" "), "total", total.toFixed(1));

const only = process.env.ONLY_SRT;
const pick = process.env.ROWS ? process.env.ROWS.split(",").map(Number) : plan.map((_, i) => i);
if (!only) pick.forEach((i) => renderRow(i));
if (process.env.ROWS) process.exit(0);

const all = rows.flatMap((_, i) => cues(i, offsets[i]));
const srt = all.map((c, k) => `${k + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join("\n");
fs.writeFileSync(path.join(BUILD, "captions.srt"), srt);
fs.writeFileSync(OUT.replace(/\.mp4$/, ".srt"), srt);
console.log(`${all.length} cues, longest ${Math.max(...all.map((c) => c.text.length))} chars`);
if (only) process.exit(0);

fs.writeFileSync(path.join(BUILD, "rows.txt"), plan.map((_, i) => `file 'row${i}.mp4'`).join("\n") + "\n");
ff(["-f", "concat", "-safe", "0", "-i", "rows.txt", "-c", "copy", "video.mp4"]);

const ins = rows.flatMap((_, i) => ["-i", path.join(ROOT, "audio", `row${i}.mp3`)]);
const delays = rows.map((_, i) => `[${i}]adelay=${Math.round((offsets[i] + LEAD) * 1000)}:all=1[a${i}]`).join(";");
ff([...ins, "-filter_complex", `${delays};${rows.map((_, i) => `[a${i}]`).join("")}amix=inputs=${rows.length}:normalize=0,apad,atrim=0:${total.toFixed(3)},loudnorm=I=-16:TP=-1.5:LRA=11[a]`,
  "-map", "[a]", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "voice.m4a"]);

fs.copyFileSync(process.env.FONT || "C:/Windows/Fonts/arial.ttf", path.join(BUILD, "arial.ttf"));
const style = "FontName=Arial,FontSize=11,PrimaryColour=&H00FFFFFF,OutlineColour=&H50000000,BorderStyle=3,Outline=5,Shadow=0,MarginV=36,MarginL=40,MarginR=40";
ff(["-i", "video.mp4", "-i", "voice.m4a", "-vf", `subtitles=captions.srt:fontsdir=.:force_style='${style}'`,
  "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", OUT]);
console.log("wrote", OUT);
