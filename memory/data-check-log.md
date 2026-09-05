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
- Current ad-risk inventory after the Knowledge Sprint release is `0 critical / 23 high / 6 medium / 53 info / 37 clean`. Remaining high items are containment candidates, not permission to broaden traffic.

## Burnout reflection trust reset — 2026-09-05

- Retained on 14 page views, six users, four real starts/completions and credible Organic acquisition in India, Indonesia and South Korea. The engine was healthy; unsupported proof, random/population metrics, manual ads, result export and sensitive telemetry were the bottleneck.
- Child `c4f9fab`, Pages `33950596564`: 14/14 mutations and 12-locale production journeys passed. The first production failure exposed a verifier lifecycle race; the gate now waits for the app-owned destination contract.

## Reward-preference trust reset — 2026-09-05

- `/dopamine-type/` had 13 page views, seven users and four starts/completions in 2026-08-29~09-04. China, Hong Kong and South Korea supplied three credible Organic sessions, so the eight-question engine was retained.
- Removed ads, fake proof/rating/neurotransmitter metrics, hidden FAQ, generic promotion and sensitive result telemetry. Child `cd34142`, Pages `33952662441`: 17/17 mutations and 12-locale local/production journeys passed; a mixed-CDN failure produced the versioned-asset/readiness contract now reused across reflections.

## Emotion Iceberg reflection reset — 2026-09-05

- Three page views/two users, credible Honduras/Indonesia Organic and one completion justified preserving the 10 scenarios. Ads, fake proof/rating, unsupported gap/percentile/analysis and result leakage were removed; frequent words, tie order and metaphor mapping are disclosed.
- Child `8cb643f`, Pages `33954024124`: 17/17 mutations and 12-locale local/production journeys passed; 20 live assets match local bytes.

## Coffee Code culture reset — 2026-09-05

- `/mbti-coffee/` had one French Organic user and one completion in 2026-08-29~09-04. Preserve the eight café scenarios while treating the sample only as valid acquisition/action evidence.
- Removed ads, fake 8,900+ and 4.5/1,380 proof, random match counts, hidden FAQ, synthetic engagement, personality claims and result leakage. The 2/1/2/1 points, E/S/T/J ties and 16-item authored lookup are visible; every locale distinguishes the game from the official assessment.
- Child `cc7e849`, Pages `33955104573`: 17/17 mutations and 12-locale local/production journeys passed; 20 live assets match local bytes and risk moved to `0/25/6/53/35`.

## Aura Color Studio reset — 2026-09-05

- `/aura-reading/` had two users, including one South Korean mobile Organic visitor, but no valid start/completion in 2026-08-29 through 2026-09-04. Preserve as an acquisition-backed conversion test, not a growth winner.
- Replaced aura/energy/personality claims, fake proof/rating/rarity, ads, hidden FAQ and result leakage with a disclosed `3+1` ten-scene palette mapping and fixed tie order. Child `3112cd3`, Pages `33956298791`: 17/17 mutations, 12-locale local/production journeys and 21 release-blob matches passed; risk moved to `0/24/6/53/36`.

## World Knowledge Sprint reset — 2026-09-05

- `/quiz-app/` had three users including one Indian Organic visitor but no action. Its claimed 12-language experience actually served 180+ Korean-only questions and immediately started a 15-second timer.
- Replaced it with ten fixed English/Korean questions, explanations, no timer and literal correct-count scoring; removed ads/interstitials, fake rating/grades, AI gate, FAQ and result leakage. Child `879185c`, Pages `33957622442`: 17/17 mutations, bilingual production journey and 12 blob matches passed; risk moved to `0/23/6/53/37`.

## Trend queue

1. Recheck seven-day game signals; held hypotheses and meme formats do not justify thin pages.
2. Improve the existing Odyssey/Spider-Man URL only after its choice path is measured; do not fragment the intent.

Current signal qualification and primary sources live in `docs/STRATEGY.md` and the `dopabrain-growth-ops` culture-signal reference.

## Verification baseline

- Pre-optimization harness `2026-09-05T04-49-44-276Z` passed 205/205 in 968.9 seconds. Its 97 duplicate syntax subprocesses used only 4.7 seconds but nearly doubled the step/report count.
- Final harness `2026-09-05T09-20-21-366Z` passed 116/116 in 734.4 summed seconds after adding Knowledge Sprint. It remains 24% faster than the 968.9-second 205-step baseline; Knowledge Sprint and Aura each caught 17/17 mutations, analytics 9/9, runtime 6/6 and inventory 63/0.
- Successful-step output is omitted from JSON: `latest.json` fell from 159.0 KB to about 14 KB. Safe gates use path-scoped clocks or isolated concurrency; qualified-exposure and crash-watch timers remain real.
- GitHub Pages source must be queried per child repository before release. Working/development branch names are not deployment evidence.
