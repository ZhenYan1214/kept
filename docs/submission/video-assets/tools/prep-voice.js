// Cleans a recorded narration for compose.js: light denoise, trims the ends, shortens long pauses, optional speed-up,
// and carries the word timings (from align.py) through every cut.
// Usage: node prep-voice.js <voice-dir> [tempo=1.1] [maxPause=0.4]
// Reads <voice-dir>/rawN.wav + rowN.json (times in the raw file); writes <voice-dir>/out/rowN.wav + rowN.json.
const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

const DIR = path.resolve(process.argv[2]);
const TEMPO = Number(process.argv[3] || 1.1);
const MAX_PAUSE = Number(process.argv[4] || 0.4); // a silence longer than this is cut down to it
const OUT = path.join(DIR, "out");
fs.mkdirSync(OUT, { recursive: true });
const ff = (args) => execFileSync("ffmpeg", ["-hide_banner", "-y", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const probe = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }));

for (let i = 0; ; i++) {
  const raw = path.join(DIR, `raw${i}.wav`);
  if (!fs.existsSync(raw)) break;
  const j = JSON.parse(fs.readFileSync(path.join(DIR, `row${i}.json`), "utf8"));
  const clean = path.join(OUT, `clean${i}.wav`);
  ff(["-i", raw, "-af", "highpass=f=80,afftdn=nf=-45:nr=12", "-ar", "48000", "-ac", "1", clean]);
  const total = probe(clean);

  // Silences, from the cleaned audio. ffmpeg prints them on stderr.
  const err = spawnSync("ffmpeg", ["-hide_banner", "-i", clean, "-af", "silencedetect=noise=-36dB:d=0.2", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const sil = [];
  let start = null;
  for (const m of err.matchAll(/silence_(start|end): ([0-9.]+)/g)) {
    if (m[1] === "start") start = Number(m[2]);
    else if (start !== null) { sil.push([start, Number(m[2])]); start = null; }
  }
  if (start !== null) sil.push([start, total]);

  // Speech runs from the first word to the last; keep a little air at each end.
  const first = Math.max(0, j.words[0].t - 0.12);
  const last = Math.min(total, j.words.at(-1).t + j.words.at(-1).d + 0.25);
  const lead = sil.find(([a, b]) => a <= first + 0.05 && b > first && b < j.words[1].t);
  const from = lead ? Math.max(first, lead[1] - 0.12) : first;
  const tail = sil.find(([a, b]) => a < last && b >= last - 0.05 && a > j.words.at(-2).t);
  const to = tail ? Math.min(last, tail[0] + 0.25) : last;

  // Keep [from, to] minus the excess of each long internal silence (cut from its middle).
  const keep = [];
  let cur = from;
  for (const [a, b] of sil) {
    if (a <= from || b >= to || b - a <= MAX_PAUSE) continue;
    const cutA = a + MAX_PAUSE / 2, cutB = b - MAX_PAUSE / 2;
    keep.push([cur, cutA]);
    cur = cutB;
  }
  keep.push([cur, to]);
  const map = (t) => { // raw time -> time in the edited (pre-tempo) audio
    let acc = 0;
    for (const [a, b] of keep) {
      if (t < a) return acc;
      if (t <= b) return acc + (t - a);
      acc += b - a;
    }
    return acc;
  };

  const parts = keep.map(([a, b], k) => `[0]atrim=${a.toFixed(3)}:${b.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=${(b - a - 0.01).toFixed(3)}:d=0.01[p${k}]`).join(";");
  const cat = keep.map((_, k) => `[p${k}]`).join("") + `concat=n=${keep.length}:v=0:a=1`;
  const tempo = TEMPO === 1 ? "" : `,atempo=${TEMPO}`;
  ff(["-i", clean, "-filter_complex", `${parts};${cat}${tempo}[a]`, "-map", "[a]", "-ar", "48000", path.join(OUT, `row${i}.wav`)]);

  const words = j.words.map((w) => {
    const t = map(w.t) / TEMPO, e = map(w.t + w.d) / TEMPO;
    return { t, d: Math.max(e - t, 0.04), w: w.w };
  });
  fs.writeFileSync(path.join(OUT, `row${i}.json`), JSON.stringify({ text: j.text, words }, null, 1));
  const cutSec = (to - from) - keep.reduce((s, [a, b]) => s + b - a, 0);
  console.log(`row${i}: raw ${total.toFixed(1)}s -> ${probe(path.join(OUT, `row${i}.wav`)).toFixed(1)}s (trimmed ends ${(from + total - to).toFixed(1)}s, pauses -${cutSec.toFixed(1)}s, tempo ${TEMPO})`);
}
