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
- Current ad-risk inventory after the Emotion Iceberg release is `0 critical / 26 high / 6 medium / 53 info / 34 clean`. Remaining high items are the next containment candidates, not permission to broaden traffic.

## Burnout reflection trust reset — 2026-09-05

- Retained on 14 page views, six users, four real starts/completions and credible Organic acquisition in India, Indonesia and South Korea. The engine was healthy; unsupported proof, random/population metrics, manual ads, result export and sensitive telemetry were the bottleneck.
- Child `c4f9fab`, Pages `33950596564`: 14/14 mutations and 12-locale production journeys passed. The first production failure exposed a verifier lifecycle race; the gate now waits for the app-owned destination contract.

## Reward-preference trust reset — 2026-09-05

- `/dopamine-type/` had 13 page views, seven users and four starts/completions in 2026-08-29~09-04. China, Hong Kong and South Korea supplied three credible Organic sessions, so the eight-question engine was retained.
- Removed ads, fake proof/rating/neurotransmitter metrics, hidden FAQ, generic promotion and sensitive result telemetry. Child `cd34142`, Pages `33952662441`: 17/17 mutations and 12-locale local/production journeys passed; a mixed-CDN failure produced the versioned-asset/readiness contract now reused across reflections.

## Emotion Iceberg reflection reset — 2026-09-05

- `/emotion-iceberg/` had three page views/two users, credible Organic acquisition from Honduras and Indonesia, and one current completion user in 2026-08-29~09-04. Preserve the 10-scenario flow; sample size is not a growth verdict.
- Removed the manual ad/loader, fabricated 12,400+ and 4.5/1,340 proof, FAQ, synthetic engagement, unsupported gap/percentile/analysis, result sharing and six-way promotion. Results now report frequent outward/inner words with disclosed tie order and authored metaphor mapping; no diagnostic or hidden-emotion claim remains.
- Child `8cb643f`, Pages `33954024124`: 17/17 mutations plus local/production journeys passed across 12 locales, 20 choices and seven parameter-free exact-once events. Twenty live assets match local bytes; risk moved to `0/26/6/53/34`.

## Trend queue

1. Recheck Steam Korea game signals across seven days; Onimusha: Way of the Sword is a held play-style interaction hypothesis, not an approved article.
2. Repackage one existing measured interaction with a current short-form format only after the restriction clears. Meme formats alone do not justify thin pages.
3. Update the existing Odyssey/Spider-Man URL only after its current choice path is measured; do not fragment the intent.

Current signal qualification and primary sources live in `docs/STRATEGY.md` and the `dopabrain-growth-ops` culture-signal reference.

## Verification baseline

- Pre-optimization harness `2026-09-05T04-49-44-276Z` passed 205/205 in 968.9 seconds. Its 97 duplicate syntax subprocesses used only 4.7 seconds but nearly doubled the step/report count.
- Final harness `2026-09-05T08-01-54-417Z` passed 113/113 in 722.0 summed seconds after adding the Emotion gate. It remains 25% faster than the 968.9-second 205-step baseline. Emotion mutations were 17/17, K-pop 52/52, analytics 9/9, runtime 6/6 and submitted inventory 63/0.
- Successful-step output is no longer copied into JSON: `latest.json` fell from 159.0 KB to 13.8 KB (91% smaller), while the Markdown summary is 5.9 KB. English Attachment Reflection fell from 115.2s to 10.2s and K-pop roster/guide from 122.7s to 32.3s by collapsing only app animation delays in their browser contexts; article qualification timers remain real.
- Shared runtime smoke now runs at most three independent browser contexts concurrently. It fell from 61.8s to 21.1s; all six apps passed and recorded 10,024-10,052ms observation windows, so parallelism did not shorten the per-app crash watch.
- Analytics smoke now runs at most three isolated scenarios concurrently and waits on EQ state instead of ten fixed 1.55s sleeps. It fell from 39.7s to 8.4s with 9/9 scenarios; EQ's 500ms qualified-action timer remains real.
- English Shadow Reflection now runs its 12 locale journeys in isolated contexts four at a time. It fell from 37.1s to 4.4s while retaining 14/14 mutations, eight answers per locale, guide attribution, neutral sharing, mobile and fallback checks.
- Current slow gates are root focus (33.9s), K-pop roster/guide (32.8s) and NPC reset (29.6s). Profile internals before changing them; never trade behavior or mutation coverage for a shorter run.
- GitHub Pages source must be queried per child repository before release. Working/development branch names are not deployment evidence.
