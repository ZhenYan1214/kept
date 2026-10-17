// Builds burned-in captions (SRT) from the narration column of ../video-script.md, so the captions
// always match the script. Each row's time slot is shared among its sentences in proportion to their
// length. Also checks pacing: a row narrated faster than 160 words a minute will not fit its slot.
//
//   node docs/submission/video-assets/make-captions.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const script = readFileSync(join(here, "..", "video-script.md"), "utf8").split(/\r?\n/);

const toSec = (t) => {
  const [m, s] = t.split(":").map(Number);
  return m * 60 + s;
};
const stamp = (sec) => {
  const ms = Math.round(sec * 1000);
  const h = String(Math.floor(ms / 3_600_000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3_600_000) / 60_000)).padStart(2, "0");
  const s = String(Math.floor((ms % 60_000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s},${String(ms % 1000).padStart(3, "0")}`;
};
const MAX = 84; // characters per caption (two lines of ~42)

// Split a sentence into caption-sized chunks at commas, then at spaces.
function chunk(sentence) {
  if (sentence.length <= MAX) return [sentence];
  const parts = sentence.split(/(?<=,)\s+/);
  const out = [];
  let cur = "";
  for (const p of parts) {
    if ((cur + " " + p).trim().length > MAX && cur) {
      out.push(cur.trim());
      cur = p;
    } else cur = (cur + " " + p).trim();
  }
  if (cur) out.push(cur.trim());
  return out.flatMap((c) => {
    if (c.length <= MAX) return [c];
    const words = c.split(" ");
    const half = Math.ceil(words.length / 2);
    return [words.slice(0, half).join(" "), words.slice(half).join(" ")];
  });
}

const rows = [];
for (const line of script) {
  const m = line.match(/^\|\s*\*\*(\d+:\d{2})–(\d+:\d{2})\*\*[^|]*\|[^|]*\|\s*"(.*)"\s*\|\s*$/);
  if (m) rows.push({ start: toSec(m[1]), end: toSec(m[2]), text: m[3] });
}
if (!rows.length) throw new Error("No narration rows found in video-script.md");

let n = 0;
let srt = "";
let words = 0;
let warnings = 0;
console.log("Row        words  wpm");
for (const r of rows) {
  const slot = r.end - r.start;
  const w = r.text.split(/\s+/).length;
  words += w;
  const wpm = Math.round((w / slot) * 60);
  const flag = wpm > 160 ? "  ⚠ too fast for its slot" : "";
  if (flag) warnings++;
  console.log(`${String(r.start).padStart(3)}–${String(r.end).padEnd(4)}s  ${String(w).padStart(4)}  ${String(wpm).padStart(4)}${flag}`);
  const cues = r.text.split(/(?<=[.!?])\s+/).flatMap(chunk);
  const total = cues.reduce((a, c) => a + c.length, 0);
  let t = r.start;
  for (const c of cues) {
    const d = (c.length / total) * slot;
    srt += `${++n}\n${stamp(t)} --> ${stamp(t + d - 0.05)}\n${c}\n\n`;
    t += d;
  }
}
writeFileSync(join(here, "captions.srt"), srt);
console.log(`\n${n} captions, ${words} words over ${rows[rows.length - 1].end}s → captions.srt${warnings ? `, ${warnings} row(s) too fast` : ""}`);
