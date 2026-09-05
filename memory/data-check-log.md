# Data Decision Baseline

This file keeps only evidence that still changes a product, traffic, or release decision. Full release narratives remain in Git history and child repositories; raw responses and console output belong in ignored reports.

## Current account state — 2026-09-05 KST

- Goal: `$0.20/day`, evaluated as at least `$1.40` across seven complete days.
- Latest complete seven-day AdSense window, 2026-08-29 through 2026-09-04: `$0.63`, 2,115 pageviews, 644 impressions, 14 clicks; `$0.090/day` and about `$0.30` Page RPM.
- Ad serving has been restricted for invalid-traffic concerns since 2026-09-03. During the restriction, do not publish new discovery URLs, promote traffic, submit IndexNow/GSC, restore suspended loaders, or add manual units.
- The address/PIN payment hold and unpaid balance are account constraints, not page-performance signals.

## Measurement rules

- Exclude deployment day and incomplete KST days from comparisons.
- Exclude Singapore desktop Direct scan-like traffic and the 2026-08-06 spike from demand, engagement, and monetization decisions.
- Ignore synthetic `page_engage`, client-authored ad-impression events, hidden-surface views, fabricated proof, and action events whose current source cannot emit them.
- Treat AdSense earnings as an account proxy unless a valid URL-level report supports page attribution.
- Keep a route when it has credible Organic acquisition or a real qualified action. Retire only when a working action event remains at zero and acquisition has no credible signal.
- Wait for 20 qualified-view users before judging a new conversion surface. A 24-hour trend spike is research input, not a release gate.

## Portfolio decisions still in force

| Area | Current decision | Evidence or condition |
|---|---|---|
| Home | Keep Stress Check, HSP Test and 2048 Coach primary; focused picks secondary | Portfolio reset preserved the strongest valid search/action paths |
| Crawl | Keep the submitted inventory small, unique, canonical and reachable | Large sitemap expansion produced little non-brand search value |
| Blog | Preserve the 175-page focused indexable cohort; leave low-signal inventory `noindex,follow` | The cohort retained about 90% of observed Organic blog sessions |
| Games | Keep playable routes but suspend ad rewards/manual units during restriction | Game actions can be valid; ad exchange and adjacent-click risk cannot |
| Reflections | Keep only disclosed scoring, visible limits, private stage telemetry and focused next actions | Unsupported ratings, percentiles, diagnoses and capability claims are not performance assets |
| Retirements | Word Scramble, MBTI Career and Seollal Fortune stay retired | Their qualified action/search evidence did not justify the stale experiences |

## Measured paths awaiting enough post-release evidence

| Path | Baseline and next comparison |
|---|---|
| HSP → Sensory Reset | Use actual 50%-visible CTA exposure → click → generate; old hidden result views are invalid. Wait for 20 qualified views; first click-user diagnostic is 8%. |
| Palworld settings | Existing utility gained 15 Organic landings but only one copy/preset user; compare generator → copy after 20 qualified users. |
| Future Self | Preserve the guide and auto-start destination; compare content view → CTA view/click → start → complete after 20 qualified CTA views. |
| Doomscrolling → Stress Check | Preserve the US-oriented guide; compare qualified reset view/use and Stress Check click after 20 views. |
| K-pop guide → roster/test | Preserve the valid path, but exclude all pre-reset fake proof/ad-lock events. |
| Odyssey/Spider-Man article | Existing URL had 4 page-view users, 2 Direct landings, 1 qualified choice view, 0 selections, 0 Organic landings in 2026-08-29~09-04. Improve the existing URL only after restriction; do not create a duplicate. |

## Invalid-traffic containment program — 2026-09-03 onward

- Root/shared surfaces and focused products use either one legitimate Auto Ads loader or an explicit dated suspension marker with zero ad code. Manual units, direct pushes, paid-impression guesses and ad-for-result/reward exchanges are forbidden.
- Reward-risk games were contained or suspended: 2048, Sky Runner, Pong, Idle Clicker, Flappy Bird, Memory Card, Maze Runner, Color Memory, Road Shooter, Brick Breaker, Zigzag Runner, Stack Tower, Number Puzzle, Word Guess, Snake and Emoji Merge.
- Claim-heavy reflections were reset around their actual authored rules: Trauma Response, Anxiety Type, Toxic Trait, AI Personality, Emotion Temperature, Overthinker, MBTI Love, Stress Response and Color Choice Mixer.
- Seollal Fortune was reduced to a 750-byte `noindex,follow` redirect to Fortune Cookie. Its worker removes only `seollal-fortune-*` caches and unregisters so the stale app cannot revive offline.
- Current ad-risk inventory after the NPC release is `0 critical / 29 high / 6 medium / 53 info / 31 clean`. Remaining high items are the next containment candidates, not permission to broaden traffic.

## NPC completion reset — 2026-09-05

- Historical source and GA4 agreed: `quiz_complete` was reachable and emitted at the result, but the only observed starter stopped after four choices and four required continue clicks. This was a real completion-friction signal, not missing instrumentation.
- The route remains live because its meme/game framing is useful and the sample is too small for retirement. Ten scenes remain, but question typing waits and ten mandatory continue clicks are gone; one choice now advances automatically after a short visible reaction.
- Manual ad code, fabricated 4.5/1,850 rating, inaccurate FAQ schema, random percentile, synthetic engagement and zero-click generic cross-promo were removed. The published score is the sum of ten visible 0–3 mappings divided by 30; copy states that it is entertainment rather than a validated assessment.
- Analytics now records private exact-once `npc_test_start → npc_test_halfway → npc_test_complete` stages plus scene number only for choice progression. Answer keys, points, score and result label are excluded.
- Child commits: `dd1332c` on `master`, production `d2134b7` on the actual Pages source `gh-pages`. Pages run `33946998363` succeeded. The verifier detects 22/22 injected defects and passes 390/1440px ten-choice journeys with zero ads.

## Trend queue

1. Recheck Steam Korea game signals across seven days; Onimusha: Way of the Sword is a held play-style interaction hypothesis, not an approved article.
2. Repackage one existing measured interaction with a current short-form format only after the restriction clears. Meme formats alone do not justify thin pages.
3. Update the existing Odyssey/Spider-Man URL only after its current choice path is measured; do not fragment the intent.

Current signal qualification and primary sources live in `docs/STRATEGY.md` and the `dopabrain-growth-ops` culture-signal reference.

## Verification baseline

- Pre-optimization harness `2026-09-05T04-49-44-276Z` passed 205/205 in 968.9 seconds. Its 97 duplicate syntax subprocesses used only 4.7 seconds but nearly doubled the step/report count.
- Optimized harness `2026-09-05T05-53-47-443Z` passed 110/110 in 813.7 seconds. The 205-step baseline took 968.9 seconds; the first 109-step run took 1,038.2 seconds before targeted clock work. All mutation, analytics 9/9, runtime 6/6 and submitted inventory 63/0 coverage remains.
- Successful-step output is no longer copied into JSON: `latest.json` fell from 159.0 KB to 13.8 KB (91% smaller), while the Markdown summary is 5.9 KB. English Attachment Reflection fell from 115.2s to 10.2s and K-pop roster/guide from 122.7s to 32.3s by collapsing only app animation delays in their browser contexts; article qualification timers remain real.
- Current slow gates are shared runtime smoke (61.8s), analytics smoke (39.7s), English Shadow Reflection (37.1s), root focus (34.9s), K-pop roster/guide (32.3s) and NPC reset (29.6s). Profile internals before changing them; never trade behavior or mutation coverage for a shorter run.
- GitHub Pages source must be queried per child repository before release. Working/development branch names are not deployment evidence.
