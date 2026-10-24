# Demo video tools

How `kept-demo.mp4` (2:58, 1080p) was made on 2026-10-21. The finished video is not in git (about 25 MB); it lives on the recording machine at `contest/video/kept-demo.mp4`, next to `kept-demo.srt`.

Needs Node, ffmpeg in PATH, Chrome, and Python with `edge-tts` (7.3.1). Run everything from this folder.

1. **Voice**: `python tts.py ../../video-script.md audio` writes `audio/rowN.mp3` and word timings in `audio/rowN.json`. It uses voice en-US-AndrewNeural, an online Microsoft service, so the script text is sent to it.
2. **Screen**: run `npm install`, then `node record.js part1`, `node record.js part2`, and `node record.js part3`.
   - It drives headless Chrome on the live site (`SITE=` overrides it) and writes `clips/<name>/` as JPEG frames plus `frames.json`.
   - Part 1 queues a cap change. Part 2 waits out the 5-minute testnet waiting period, then executes it as vetoed.
   - Every run writes new simulated data to Base Sepolia: a household, a proposal, a payment line, a dispute and an NGO claim.
   - The `realdata` clip from part 1 is no longer used; part 3 replaces it.
3. **Check**: `node sheet.js <clip> 16` writes a contact sheet to `check/`.
4. **Edit**: `node compose.js <out.mp4>`.
   - Each script row gets a screen slot of at least its narration length.
   - Waits longer than 0.7 s are cut, then the footage is time-scaled to fit the slot.
   - Slides and real-data stills switch on narration words.
   - Captions are cut from the script text and timed by the voice.
   - Writes the MP4 with burned-in captions, plus a matching `.srt`.

**Your own voice.** Record one file per script row, then:
1. Convert each file with `ffmpeg -i <file> -ac 1 -ar 48000 voice/rawN.wav`.
2. Run `python align.py audio voice`. This uses local faster-whisper `small.en`, which needs `requests` and works around a PyAV version mismatch by decoding through ffmpeg. It writes word timings for the script's words.
3. Run `node prep-voice.js voice 1.15`. This applies light noise reduction, trims the ends, cuts pauses over 0.4 s, and speeds the voice up 1.15× at the same pitch.
4. Run `AUDIO=voice/out AUDIO_EXT=wav node compose.js out.mp4`.

The 2026-10-23 recording became `kept-demo-myvoice.mp4` (3:36).

If the UI changes, re-record (step 2) and re-run step 4. The selectors in `record.js` use visible button labels and card titles, so renamed labels break them. To use your own voice, replace `audio/rowN.mp3`/`.json` with matching timings, or re-time `want` in `compose.js`.
