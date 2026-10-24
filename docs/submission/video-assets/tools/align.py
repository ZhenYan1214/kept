"""Word timings for the user's own narration: transcribe each row locally, then map the script's words onto it.

Usage: python align.py <tts-audio-dir> <voice-dir>
Reads <voice-dir>/rawN.wav and the script text from <tts-audio-dir>/rowN.json; writes <voice-dir>/rowN.json in the
same shape ({text, words:[{t, d, w}]}), one entry per script token, times relative to the start of rawN.wav.
"""
import difflib, json, re, subprocess, sys
import numpy as np
from pathlib import Path
from faster_whisper import WhisperModel

tts, voice = Path(sys.argv[1]), Path(sys.argv[2])
model = WhisperModel("small.en", device="cpu", compute_type="int8")
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())

for i in range(8):
    text = json.loads((tts / f"row{i}.json").read_text(encoding="utf-8"))["text"]
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(voice / f"raw{i}.wav"), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    segs, _ = model.transcribe(np.frombuffer(pcm, dtype=np.float32), language="en", word_timestamps=True, initial_prompt=text, beam_size=5)
    heard = [w for s in segs for w in s.words]
    tokens = text.replace("’", "'").split()
    a, b = [norm(t) for t in tokens], [norm(w.word) for w in heard]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    times = [None] * len(tokens)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            w = heard[blk.b + k]
            times[blk.a + k] = (w.start, w.end)
    matched = sum(t is not None for t in times)
    # Unmatched tokens (numbers said as words, mispronunciations): spread them between their matched neighbours.
    k = 0
    while k < len(times):
        if times[k] is None:
            j = k
            while j < len(times) and times[j] is None:
                j += 1
            lo = times[k - 1][1] if k > 0 else (heard[0].start if heard else 0.0)
            hi = times[j][0] if j < len(times) else (heard[-1].end if heard else lo + 0.3 * (j - k))
            step = max(hi - lo, 0.05) / (j - k)
            for m in range(k, j):
                times[m] = (lo + step * (m - k), lo + step * (m - k + 1))
            k = j
        k += 1
    words = [{"t": s, "d": max(e - s, 0.05), "w": tok} for tok, (s, e) in zip(tokens, times)]
    (voice / f"row{i}.json").write_text(json.dumps({"text": text, "words": words}, indent=1), encoding="utf-8")
    said = " ".join(w.word.strip() for w in heard)
    print(f"row{i}: {matched}/{len(tokens)} script words matched, speech {words[0]['t']:.2f}-{words[-1]['t'] + words[-1]['d']:.2f}s")
    print("   heard:", said[:400])
