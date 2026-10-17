# Kept — 3-minute demo video script (draft)

- Target length: 3:00. Narration about 420 words at a calm pace (about 140 words a minute; no row above 160). Slides: `video-assets/*.png`; captions: `video-assets/captions.srt`, regenerated from this table by `node docs/submission/video-assets/make-captions.mjs`, which also flags any row that is too fast.
- Record the screen at 1920×1080 with the browser zoomed to 125%. English narration, plus English captions burned in (judges may watch muted).
- Before recording: *Setup → Start a fresh scenario*, *Reset local demo data*, and keep one browser tab per role ready.
- **Waiting period:** on the live testnet site it is 5 minutes and cannot be skipped (*Devnet: skip waiting period* only exists on a local devnet). Propose and approve the cap change at the start of the recording session, record the other scenes, then come back to vote and press *Execute*; cut the wait in editing. Alternatively record this scene on a local devnet.
- On screen, every simulated item already says "simulated"; the real-data page says "real public data". Say the same out loud once (0:55).

| Time | Screen | Narration |
|---|---|---|
| **0:00–0:15** · Hook | Black slide, white text: "US$488,000,000 → 6 homes". Small source line: ProPublica/NPR, 2015. | "After the 2010 earthquake, the American Red Cross raised four hundred and eighty-eight million dollars for Haiti, and built six permanent homes. Disaster funds make promises. Almost nobody can check them." |
| **0:15–0:45** · The loop in Taiwan | Slide: the five-step loop (raised before a plan → custodian keeps the records → victims have no voice → money sits or arrives late → trust moves elsewhere). Then two facts appear one by one: "Hualien 2024: NT$792M donated to the county; 16% paid out after 11 months; no victims on the committee" and "2024: NT$1.65bn to the national foundation, about twice the county's NT$792M". | "Taiwan has lived the same loop. In Hualien in 2024, almost eight hundred million Taiwan dollars were donated to the county. Eleven months later, sixteen percent had been paid out, and its committee had no affected households on it. After disputes over earlier donations, most people gave to the national foundation instead, about twice as much. People did not stop giving. They stopped trusting where it goes." |
| **0:45–1:18** · Real data | App: **Guangfu, real data** page. Scroll slowly: the four numbers, "Where the trail stops", the 93% bar, then the timeline "Money moved fast; confirming it arrived did not" (the flat reconciled line), the household estimate moving from 1,837 to about 3,300 to 4,039. | "In 2025 a barrier lake flooded Guangfu. The national relief foundation publishes every transfer, which is more than most. Of 1.2 billion Taiwan dollars paid out, nearly ninety-nine percent was pre-allocated, most of it to one ministry. In eleven monthly reports, for eight months, not one more pre-allocated dollar was reported as reconciled. Pre-allocating is normal in an emergency. The problem is what comes next: after the first hand, the public sees only totals, and households have no public way to confirm or dispute their own payment." |
| **1:18–1:53** · Reconciliation | Dashboard → *Accountability alerts* (a dispute, two villages "still waiting"). Then **Household**: create credential → *Simulate: chief scans this code*. **Village & township**: propose, then approve as the township office. **Custodians**: as the ministry, publish the payment lines. **Household**: "found in the roster published on-chain" → *I did not receive it*. Dashboard: disputed count goes up, then scroll to *Sample audits* (the bound "at most N of 12 lines"). | "This is Kept, on a simulated version of the same disaster. Every hand acknowledges what it receives. When the ministry pays households, it publishes each payment as a line with no name on it. A household, verified by both the village chief and the township office, finds its own line without asking anyone, and says 'received', or 'not received'. The custodian cannot sign for the household, and cannot pad the list without it showing. And because many households never answer, the contract draws a random sample that an independent auditor visits in person." |
| **1:53–2:12** · Eligibility without the roster | **Household**: *Show code at the counter*. **NGO counter**: verify → handed over. Show the same code again → "already claimed". | "An NGO can check eligibility on the spot with a zero-knowledge proof. The proof tells the NGO only that this is an eligible household that has not claimed yet; the NGO never receives the roster, and the same household cannot claim twice." |
| **2:12–2:32** · Promises and voice | **Fund committee**: choose *General public works* → refused. Propose a cap change, approve with a second member → "public waiting period". **Household**: vote *No*; *Demo: 3 neighbours vote no*; then (after the waiting period, see note below) *Execute* → "Vetoed by households". | "The fund's charter is fixed when the money is raised. Spending outside it is refused. Changes wait in public, and the people the money is for can veto them, anonymously, one vote per household." |
| **2:32–2:52** · Why Web3, feasibility | Slide with four lines: "No single custodian controls the record" · "No personal data on-chain" · "Phase 1 works under today's law" · "≈US$150–1,500 per disaster (gas measured, prices assumed)". | "Why a blockchain? Because the people being overseen should not keep the only ledger, and several independent custodians need one shared record. Names, IDs and bank accounts never go on-chain. It works under today's law, and at Guangfu's scale it costs about a hundred and fifty to fifteen hundred dollars on-chain." |
| **2:52–3:00** · Close | Logo, "Kept — disaster-relief promises you can verify", GitHub link, demo link. | "Two promises: how the money is used, and that no one is left out. Kept makes both verifiable." |

## Word count and timing check

Narration above: about 420 words. If a take runs long, cut in this order:

1. 0:15–0:45: drop the sentence about donations reaching the county.
2. 1:18–1:53: drop the sentence about the sample audit (keep it on screen).
3. 2:32–2:52: drop the cost sentence (keep it on the slide).

## Facts used (all in the repository with sources)

| Claim in the video | Source |
|---|---|
| US$488M, six permanent homes | ProPublica/NPR, 2015-06-03 |
| Hualien county: NT$792M received, NT$425M earmarked, NT$124M (16%) paid out by 2025-02-27 | County committee report, appendix B (https://sa.hl.gov.tw/Upload/202504020943277687541.pdf); no affected households on the committee: PTS, 2025-03-31. Do NOT say "NT$420M left": that is the unearmarked balance of the whole shared account (2018, 2024 and other disasters), per LTN 2025-03-30 |
| 2024: NT$1.65bn to the national foundation, NT$792M to the county; attributed to disputes over 2018's donations | LTN, 2025-03-30 (https://news.ltn.com.tw/news/Hualien/breakingnews/4996579). Do NOT say "under a fifth of 2018's": by the county's own records 2024 was NT$793M against NT$2.74bn, 29% |
| 1.2bn paid out, 98.8% pre-allocated, 93% to one ministry, 4% reconciled | Relief foundation's 11th disclosure, transcribed in `web/src/lib/replay/guangfu-2025.ts` |
| Household estimate 1,837 → ~3,325 → 4,039 | Same disclosure: transfers #1, #4 (1,837), #5 (+1,488 outside the protected zone, 23 Oct 2025), #30 (4,039, clean-up programme) |
| Eight months with no pre-allocation newly reconciled | All 11 disclosures, transcribed in `web/src/lib/replay/disclosures-0923.ts`: reconciled minus paid-on-claim = NT$15,200,000 in disclosures #2–#10 (2025-12-24 to 2026-08-25) |
| Cost range | `web/src/lib/replay/cost.ts` (gas measured; prices assumed) |
| Sample audit (if shown on a slide: detection rates) | `web/scripts/fraud-sim.mjs` → `web/src/lib/replay/fraud-sim.json` (simulated; assumptions on the Why Kept page) |

## Wording to avoid (from the project's fact-check rules)

- Do not say "only 4% reached households": 4% is the reconciled share; pre-allocating and reconciling later is normal.
- Do not say anyone stole or misused donations; ongoing investigations are allegations only.
- Do not say "enforced by code" for phase 1: in phase 1 the charter binds the public record, not the bank account.
- Do not say "the first" or "the only": say "we did not find a deployment that does this".
