"""Synthesise the narration of docs/submission/video-script.md, one MP3 per row, with word timings.

Usage: python tts.py <video-script.md> <out-dir> [voice] [rate]
Writes rowN.mp3 and rowN.json ({start, end, text, words:[{t, d, w}]}) per narration row.
"""
import asyncio, json, re, sys
from pathlib import Path
import edge_tts

script, out = Path(sys.argv[1]), Path(sys.argv[2])
voice = sys.argv[3] if len(sys.argv) > 3 else "en-US-AndrewNeural"
rate = sys.argv[4] if len(sys.argv) > 4 else "+0%"
out.mkdir(parents=True, exist_ok=True)

row_re = re.compile(r'^\|\s*\*\*(\d+):(\d{2})–(\d+):(\d{2})\*\*[^|]*\|[^|]*\|\s*"(.*)"\s*\|\s*$')
rows = []
for line in script.read_text(encoding="utf-8").splitlines():
    m = row_re.match(line)
    if m:
        a, b, c, d, text = m.groups()
        rows.append({"start": int(a) * 60 + int(b), "end": int(c) * 60 + int(d), "text": text})


async def synth(i, row):
    comm = edge_tts.Communicate(row["text"], voice, rate=rate, boundary="WordBoundary")
    words = []
    with open(out / f"row{i}.mp3", "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({"t": chunk["offset"] / 1e7, "d": chunk["duration"] / 1e7, "w": chunk["text"]})
    (out / f"row{i}.json").write_text(json.dumps({**row, "voice": voice, "rate": rate, "words": words}, indent=1), encoding="utf-8")
    spoken = (words[-1]["t"] + words[-1]["d"]) if words else 0
    print(f"row{i}: slot {row['end'] - row['start']:>3}s  spoken {spoken:5.1f}s  {len(row['text'].split())} words")


async def main():
    for i, row in enumerate(rows):
        await synth(i, row)


asyncio.run(main())
