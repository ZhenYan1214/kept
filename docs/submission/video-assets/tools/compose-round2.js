// Builds the Round 2 presentation video (presentation-script.md): recorded narration rows, some trimmed by word timings,
// new rows N0–N5, stills and screen clips fitted to the narration, a part label in the corner, burned-in captions.
// Usage: OLD=<voice dir with rowN.wav/json> NEW=<voice dir for N0–N5> CLIPS=<record.js clips dir> node compose-round2.js <out.mp4>
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ASSETS = path.resolve(__dirname, "..");
const R2 = path.join(ASSETS, "round2");
const OLD = process.env.OLD, NEW = process.env.NEW, CLIPS = process.env.CLIPS;
const OUT = path.resolve(process.argv[2] || "kept-round2.mp4");
const BUILD = path.join(path.dirname(OUT), "build-round2");
fs.mkdirSync(BUILD, { recursive: true });
const LEAD = 0.5, CAP = 0.7, NAVY = "0x0e1d31";
const ff = (args) => execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...args], { cwd: BUILD, stdio: ["ignore", "inherit", "inherit"] });
const probe = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }));
const bare = (w) => w.replace(/[^A-Za-z0-9-]/g, "");
const slash = (p) => p.replace(/\\/g, "/");

// ---- Audio: a narration row, optionally keeping only some word ranges ----------------------------------------------
function loadRow(dir, i) {
  return { wav: path.join(dir, `row${i}.wav`), words: JSON.parse(fs.readFileSync(path.join(dir, `row${i}.json`), "utf8")).words };
}
const find = (words, re, from = 0) => {
  const k = words.findIndex((w, j) => j >= from && re.test(bare(w.w)));
  if (k < 0) throw new Error(`word ${re} not found`);
  return k;
};
function cutAudio(name, row, ranges) {
  const { wav, words } = row;
  const total = probe(wav);
  const pieces = ranges.map(([s, e]) => {
    const a = Math.max(s > 0 ? words[s - 1].t + words[s - 1].d + 0.02 : 0, words[s].t - 0.12);
    const b = Math.min(e + 1 < words.length ? words[e + 1].t - 0.03 : total, words[e].t + words[e].d + 0.25);
    return { s, e, a, b };
  });
  const GAP = 0.2;
  const parts = pieces.map((p, k) => `[0]atrim=${p.a.toFixed(3)}:${p.b.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=${(p.b - p.a - 0.01).toFixed(3)}:d=0.01${k + 1 < pieces.length ? `,apad=pad_dur=${GAP}` : ""}[p${k}]`);
  const out = path.join(BUILD, `${name}.wav`);
  ff(["-i", wav, "-filter_complex", `${parts.join(";")};${pieces.map((_, k) => `[p${k}]`).join("")}concat=n=${pieces.length}:v=0:a=1[a]`, "-map", "[a]", "-ar", "48000", out]);
  let off = 0;
  const kept = [];
  pieces.forEach((p, k) => {
    for (let j = p.s; j <= p.e; j++) kept.push({ ...words[j], t: words[j].t - p.a + off });
    off += p.b - p.a + (k + 1 < pieces.length ? GAP : 0);
  });
  return { wav: out, words: kept, spoken: probe(out) };
}

// ---- Visuals -------------------------------------------------------------------------------------------------------
const S = (file, until, crop) => ({ still: file, until, crop });
const C = (name, until, from, to) => ({ clip: name, until, from, to });
function clipFrames({ clip: name, from, to }) {
  const dir = path.join(CLIPS, name);
  const j = JSON.parse(fs.readFileSync(path.join(dir, "frames.json"), "utf8"));
  const t0 = j.frames[0].t, end = j.frames.at(-1).t;
  const a = from === undefined ? t0 : from < 0 ? end + from : t0 + from;
  const b = to === undefined ? end : t0 + to;
  let first = 0;
  while (first + 1 < j.frames.length && j.frames[first + 1].t <= a) first++;
  const fr = j.frames.slice(first).filter((f, k) => k === 0 || f.t <= b);
  return fr.map((f, k) => ({ file: slash(path.join(dir, f.file)), d: k + 1 < fr.length ? Math.min(fr[k + 1].t - Math.max(f.t, a), CAP) : 0.6 }));
}
const VF = (crop) => `${crop ? `crop=${crop},` : ""}scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=${NAVY},fps=30,format=yuv420p,setsar=1`;
let pieceNo = 0;
function renderStill(file, dur, crop) {
  const out = `v${String(pieceNo++).padStart(3, "0")}.mp4`;
  ff(["-loop", "1", "-t", dur.toFixed(3), "-i", file, "-vf", VF(crop), "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-t", dur.toFixed(3), out]);
  return out;
}
function renderClip(frames, dur) {
  const total = frames.reduce((s, f) => s + f.d, 0), k = dur / total;
  const out = `v${String(pieceNo++).padStart(3, "0")}`;
  const list = frames.map((f) => `file '${f.file}'\nduration ${(f.d * k).toFixed(4)}`).join("\n") + `\nfile '${frames.at(-1).file}'\n`;
  fs.writeFileSync(path.join(BUILD, `${out}.txt`), list);
  ff(["-f", "concat", "-safe", "0", "-i", `${out}.txt`, "-vf", VF(), "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-t", dur.toFixed(3), `${out}.mp4`]);
  console.log(`   clip ${total.toFixed(1)}s -> ${dur.toFixed(1)}s (x${(1 / k).toFixed(2)})`);
  return `${out}.mp4`;
}

// ---- The plan (presentation-script.md v2.1) ------------------------------------------------------------------------
const old = (i) => loadRow(OLD, i), neu = (i) => loadRow(NEW, i);
const SL = (f) => slash(path.join(ASSETS, f)), RD = (f) => slash(path.join(R2, f));
const lastFrame = (name) => { const j = JSON.parse(fs.readFileSync(path.join(CLIPS, name, "frames.json"), "utf8")); return slash(path.join(CLIPS, name, j.frames.at(-1).file)); };
const firstFrame = (name) => { const j = JSON.parse(fs.readFileSync(path.join(CLIPS, name, "frames.json"), "utf8")); return slash(path.join(CLIPS, name, j.frames[0].file)); };
const FLOW = slash(path.resolve(ASSETS, "../../assets/details/kept-flow.png"));

const r1 = old(1), r2 = old(2), r3 = old(3);
const segments = [
  { label: "1 · Problem", audio: () => cutAudio("a00", neu(0), [[0, neu(0).words.length - 1]]),
    vis: (at) => [S(RD("slide-1.png"), at(/^Six$/) - 0.3), S(RD("slide-2.png"))] },
  { label: "1 · Problem", audio: () => cutAudio("a01", r1, [[find(r1.words, /^In$/), r1.words.length - 1]]),
    vis: (at) => [S(SL("03-hualien.png"), at(/^After$/) - 0.3), S(SL("04-trust.png"))] },
  { label: "1 · Problem", audio: () => cutAudio("a02", r2, [[find(r2.words, /^The$/), r2.words.length - 1]]),
    vis: (at, w) => [S(lastFrame("rd-numbers"), at(/^most$/, w(/^pre-allocated$/)) - 0.2), S(lastFrame("rd-ministry"), at(/^eleven$/) - 0.4), S(lastFrame("rd-timeline"), at(/^Pre-allocating$/) - 0.3), S(lastFrame("rd-trail"))] },
  { label: "2 · Solution", audio: () => cutAudio("a03", neu(1), [[0, neu(1).words.length - 1]]),
    vis: (at, w) => [S(FLOW, at(/^verified$/) - 0.6), C("waiting", at(/^And$/, w(/^received$/)) - 0.3), S(FLOW)] },
  { label: "3 · Technical architecture", audio: () => cutAudio("a04", neu(2), [[0, neu(2).words.length - 1]]),
    vis: (at, w) => [S(RD("arch-0.png"), at(/^phone$/) - 0.6), S(RD("arch-1.png"), at(/^relayer$/) - 0.4), S(RD("arch-2.png"), at(/^Base$/, w(/^wallet$/)) - 0.5), S(RD("arch-3.png"))] },
  { label: "4 · Working prototype", audio: () => { const a = find(r3.words, /^custodian$/, 20) - 1, b = find(r3.words, /^And$/, a) - 1; return cutAudio("a05", r3, [[0, a - 1], [b + 1, r3.words.length - 1]]); },
    vis: () => [C("register"), C("verified", undefined, -2.6), C("lines", undefined, undefined, 22.5), C("audits")] },
  { label: "4 · Working prototype", want: 18, audio: () => cutAudio("a06", old(5), [[0, old(5).words.length - 1]]),
    vis: () => [C("committee1"), C("committee2"), C("committee3")] },
  { label: "4 · Working prototype", audio: () => cutAudio("a07", neu(3), [[0, neu(3).words.length - 1]]),
    vis: (at) => [S(RD("blockscout-logs.png"), at(/^you$/, 20) - 0.4, "980:551:320:360"), S(firstFrame("register"))] },
  { label: "5 · Innovation & impact", audio: () => cutAudio("a08", old(6), [[0, old(6).words.length - 1]]),
    vis: () => [S(SL("06-why-web3.png"))] },
  { label: "5 · Innovation & impact", audio: () => cutAudio("a09", neu(4), [[0, neu(4).words.length - 1]]),
    vis: (at, w) => [S(RD("slide-3.png"), at(/^And$/, w(/^honest$/)) - 0.3), S(RD("slide-4.png"))] },
  { label: "", audio: () => cutAudio("a10", neu(5), [[0, neu(5).words.length - 1]]),
    vis: () => [S(SL("07-close.png"))] },
];

// ---- Build ---------------------------------------------------------------------------------------------------------
const pieces = [], cues = [], labels = [], audios = [];
let t = 0;
segments.forEach((seg, i) => {
  const au = seg.audio();
  const dur = Math.max(seg.want || 0, LEAD + au.spoken + 0.9);
  const w = (re, from = 0) => find(au.words, re, from);
  const at = (re, from = 0) => LEAD + au.words[find(au.words, re, typeof from === "number" ? from : 0)].t;
  const items = seg.vis(at, w);
  console.log(`seg ${i} ${seg.label || "close"}: ${dur.toFixed(1)}s`);
  // Fixed durations from "until"; the rest share what is left (clips by footage length, a final still takes it all).
  let cursor = 0;
  const fixed = items.map((it) => { if (it.until === undefined) return null; const d = it.until - cursor; cursor = it.until; return d; });
  const free = items.filter((_, k) => fixed[k] === null);
  const left = dur - cursor;
  const weights = free.map((it) => (it.clip ? clipFrames(it).reduce((s, f) => s + f.d, 0) : 1));
  const wsum = weights.reduce((a, b) => a + b, 0);
  let fi = 0;
  items.forEach((it, k) => {
    const d = fixed[k] !== null ? fixed[k] : (left * weights[fi++]) / wsum;
    pieces.push(it.clip ? renderClip(clipFrames(it), d) : renderStill(it.still, d, it.crop));
  });
  audios.push({ wav: au.wav, at: t + LEAD });
  if (seg.label) labels.push({ text: seg.label, a: t, b: t + dur });
  // Captions: sentences, long ones split near a comma.
  const toks = au.words;
  const groups = [];
  let cur = [];
  toks.forEach((x, k) => { cur.push(k); if (/[.?!]["']?$/.test(x.w) || k === toks.length - 1) { groups.push(cur); cur = []; } });
  const text = (g) => g.map((k) => toks[k].w).join(" ");
  const split = (g) => {
    if (text(g).length <= 84) return [g];
    let best = 0, score = 1e9;
    g.forEach((k, n) => { if (n === g.length - 1) return; const s = Math.abs(text(g.slice(0, n + 1)).length - text(g).length / 2) - (/[,;:]$/.test(toks[k].w) ? 30 : 0); if (s < score) { score = s; best = n; } });
    return [...split(g.slice(0, best + 1)), ...split(g.slice(best + 1))];
  };
  const segCues = groups.flatMap(split).map((g) => ({ start: t + LEAD + toks[g[0]].t, end: t + LEAD + toks[g.at(-1)].t + toks[g.at(-1)].d, text: text(g) }));
  segCues.forEach((c, k) => { c.end = Math.min(c.end + 0.5, k + 1 < segCues.length ? segCues[k + 1].start - 0.05 : c.end + 0.6); });
  cues.push(...segCues);
  t += dur;
});
const total = t;
console.log("total", total.toFixed(1));

fs.writeFileSync(path.join(BUILD, "pieces.txt"), pieces.map((p) => `file '${p}'`).join("\n") + "\n");
ff(["-f", "concat", "-safe", "0", "-i", "pieces.txt", "-c", "copy", "video.mp4"]);

const ins = audios.flatMap((a) => ["-i", a.wav]);
const delays = audios.map((a, i) => `[${i}]adelay=${Math.round(a.at * 1000)}:all=1[a${i}]`).join(";");
ff([...ins, "-filter_complex", `${delays};${audios.map((_, i) => `[a${i}]`).join("")}amix=inputs=${audios.length}:normalize=0,apad,atrim=0:${total.toFixed(3)},loudnorm=I=-16:TP=-1.5:LRA=11[a]`, "-map", "[a]", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "voice.m4a"]);

const stamp = (s) => { const ms = Math.round(s * 1000); return `${String(Math.floor(ms / 3.6e6)).padStart(2, "0")}:${String(Math.floor(ms / 6e4) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`; };
const srt = cues.map((c, k) => `${k + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join("\n");
fs.writeFileSync(path.join(BUILD, "captions.srt"), srt);
fs.writeFileSync(OUT.replace(/\.mp4$/, ".srt"), srt);

fs.copyFileSync(process.env.FONT || "C:/Windows/Fonts/arial.ttf", path.join(BUILD, "arial.ttf"));
const style = "FontName=Arial,FontSize=11,PrimaryColour=&H00FFFFFF,OutlineColour=&H50000000,BorderStyle=3,Outline=5,Shadow=0,MarginV=36,MarginL=40,MarginR=40";
const draw = labels.map((l) => `drawtext=fontfile=arial.ttf:text='${l.text}':fontsize=28:fontcolor=white:box=1:boxcolor=${NAVY}@0.88:boxborderw=14:x=w-tw-46:y=h-th-40:enable='between(t,${l.a.toFixed(2)},${l.b.toFixed(2)})'`).join(",");
ff(["-i", "video.mp4", "-i", "voice.m4a", "-vf", `${draw},subtitles=captions.srt:fontsdir=.:force_style='${style}'`, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", OUT]);
console.log("wrote", OUT, `${cues.length} cues`);
