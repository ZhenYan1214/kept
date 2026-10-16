# Kept — 3-minute demo video script (draft)

- Target length: 3:00. Narration about 400 words at a calm pace (about 140 words a minute).
- Record the screen at 1920×1080 with the browser zoomed to 125%. English narration, plus English captions burned in (judges may watch muted).
- Before recording: *Setup → Start a fresh scenario*, *Reset local demo data*, and keep one browser tab per role ready.
- On screen, every simulated item already says "simulated"; the real-data page says "real public data". Say the same out loud once (0:55).

| Time | Screen | Narration |
|---|---|---|
| **0:00–0:15** · Hook | Black slide, white text: "US$488,000,000 → 6 homes". Small source line: ProPublica/NPR, 2015. | "After the 2010 earthquake, the American Red Cross raised four hundred and eighty-eight million dollars for Haiti, and built six permanent homes. Disaster funds make promises. Almost nobody can check them." |
| **0:15–0:45** · The loop in Taiwan | Slide: the five-step loop (raised before a plan → custodian keeps the records → victims have no voice → money sits or arrives late → trust moves elsewhere). Then two facts appear one by one: "Hualien 2024: NT$420M still unspent a year later; no victims on the committee" and "Donations reaching Hualien County, 2024: under 1/5 of 2018's". | "Taiwan has lived the same loop. In Hualien in 2024, a county donation account still held over four hundred million Taiwan dollars a year later, and its committee had no affected households on it. And after earlier disputes, donations reaching the county that year were less than a fifth of what they had been in 2018. People did not stop giving. They stopped trusting where it goes." |
| **0:45–1:15** · Real data | App: **Guangfu, real data** page. Scroll slowly: the four numbers, "Where the trail stops", the 93% bar, the household estimate moving from 1,837 to 4,039. | "In 2025 a barrier lake flooded Guangfu. The national relief foundation publishes every transfer, which is more than most. We transcribed its disclosure. Of 1.2 billion Taiwan dollars paid out, nearly ninety-nine percent was pre-allocated, most of it to one ministry. A year later, four percent was reconciled. That is normal in an emergency. The problem is what comes next: after the first hand, the public sees only totals, and no household can check or confirm its own payment." |
| **1:15–1:50** · Reconciliation | Dashboard → *Accountability alerts* (a dispute, two villages "still waiting"). Then **Household**: create credential → *Simulate: chief scans this code*. **Village & township**: propose, then approve as the township office. **Custodians**: as the ministry, commit a roster. **Household**: "✓ your line is in the roster committed on-chain" → *I did not receive it*. Dashboard: disputed count goes up. | "This is Kept, on a simulated version of the same disaster. Every hand acknowledges what it receives. When the ministry pays households, it commits only a fingerprint of the roster. A household, verified by both the village chief and the township office, checks its own line and says 'received', or 'not received'. The custodian cannot fake that answer. Households can also report, anonymously, that they are still waiting, even if nothing was ever recorded." |
| **1:50–2:10** · Eligibility without the roster | **Household**: *Show code at the counter*. **NGO counter**: verify → handed over. Show the same code again → "already claimed". | "An NGO can check eligibility on the spot with a zero-knowledge proof. The proof tells the NGO only that this is an eligible household that has not claimed yet; the NGO never receives the roster, and the same household cannot claim twice." |
| **2:10–2:35** · Promises and voice | **Fund committee**: choose *General public works* → refused. Propose a cap change, approve with a second member → "public waiting period". **Household**: vote *No*; *Demo: 3 neighbours vote no*; *Devnet: skip waiting period* → *Execute* → "Vetoed by households". | "The fund's charter is fixed when the money is raised. Spending outside it is refused. Changes wait in public, and the people the money is for can veto them, anonymously, one vote per household." |
| **2:35–2:52** · Why Web3, feasibility | Slide with four lines: "No single custodian controls the record" · "No personal data on-chain" · "Phase 1 works under today's law" · "≈US$140–1,400 per disaster, measured". | "Why a blockchain? Because the people being overseen should not keep the only ledger, and several independent custodians need one shared record. Names, IDs and rosters never go on-chain. It works under today's law, and at Guangfu's scale the whole disaster costs roughly a hundred and forty to fourteen hundred US dollars on-chain." |
| **2:52–3:00** · Close | Logo, "Kept — disaster-relief promises you can verify", GitHub link, demo link. | "Two promises: how the money is used, and that no one is left out. Kept makes both verifiable." |

## Word count and timing check

Narration above: about 400 words. If a take runs long, cut in this order:

1. 0:15–0:45: drop the sentence about the next year's allocation.
2. 1:15–1:50: drop the sentence about anonymous "still waiting" reports.
3. 2:35–2:52: drop the cost sentence (keep it on the slide).

## Facts used (all in the repository with sources)

| Claim in the video | Source |
|---|---|
| US$488M, six permanent homes | ProPublica/NPR, 2015-06-03 |
| Hualien county account still held about NT$420M a year later; no affected households on the committee | PTS, 2025-03-31 |
| By May 2024 the county had received NT$453M through the relief foundation, under a fifth of the NT$2.7bn received in 2018 | PTS, 2024-05-17 (fact-check #3: compare the two only as stated in this source) |
| 1.2bn paid out, 98.8% pre-allocated, 93% to one ministry, 4% reconciled | Relief foundation's 11th disclosure, transcribed in `web/src/lib/replay/guangfu-2025.ts` |
| Household estimate 1,837 → 4,039 | Same disclosure, transfers #1, #4, #30 |
| Cost range | `web/src/lib/replay/cost.ts` (gas measured; prices assumed) |

## Wording to avoid (from the project's fact-check rules)

- Do not say "only 4% reached households": 4% is the reconciled share; pre-allocating and reconciling later is normal.
- Do not say anyone stole or misused donations; ongoing investigations are allegations only.
- Do not say "enforced by code" for phase 1: in phase 1 the charter binds the public record, not the bank account.
- Do not say "the first" or "the only": say "we did not find a deployment that does this".
