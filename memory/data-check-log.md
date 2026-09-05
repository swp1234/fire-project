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
- Current ad-risk inventory after Rizz Score retirement is `0 critical / 17 high / 6 medium / 53 info / 43 clean`. Remaining high items are containment candidates, not permission to broaden traffic.

## 2026-09-05 release ledger

| Route | Decision evidence | Release proof |
|---|---|---|
| Burnout | Keep: 14 views, 6 users, 4 starts/completions and credible IN/ID/KR Organic; remove unsupported proof, ads, export and private telemetry | `c4f9fab`, Pages `33950596564`, 14/14 mutations, 12 locales |
| Dopamine Type | Keep: 13 views, 7 users, 4 completions and 3 credible Organic sessions; remove fake chemistry metrics, ads and result leakage | `cd34142`, Pages `33952662441`, 17/17, 12 locales |
| Emotion Iceberg | Keep: credible HN/ID Organic and one completion; disclose metaphor mapping and remove fake analysis | `8cb643f`, Pages `33954024124`, 17/17, 20 blob matches |
| Coffee Code | Keep: one FR Organic completion; disclose authored lookup and remove personality/proof claims | `cc7e849`, Pages `33955104573`, 17/17, 20 blob matches |
| Aura Studio | Keep as conversion test: one KR mobile Organic, zero starts; replace mystical claims with disclosed `3+1` palette game | `3112cd3`, Pages `33956298791`, 17/17, 21 blob matches |
| Knowledge Sprint | Keep as conversion test: one IN Organic, zero starts; replace Korean-only random bank with 10 reviewed bilingual questions | `879185c`, Pages `33957622442`, 17/17, 12 blob matches |
| Brainrot Score | Retire: only 2 SG desktop Direct scans, no qualified action; remove score, fake proof, ads, bundles and promotions, redirect to maintained detox/doomscrolling paths | app `5f92038`, portal `124da1f`, Pages `33958580365`/`33959125600`, 10/10 mutations |
| Delulu Score | Retire: only 1 SG desktop Direct scan and no qualified action; remove score, result sharing, fake proof, ads and catalog card, redirect to Future Self | app `29043cb`, portal `89fa800`, Pages `33960469571`/`33960471975`, 8/8 mutations |
| Hail Mary Mode | Retire: no credible acquisition or qualified action; remove score/rating, result telemetry, ads, push and promotions, redirect app/article to maintained stress paths | app `0ad86a4`, portal `c53617c`, Pages `33961391663`/`33961531649`, 10/10 mutations, 18 blob matches |
| Luck Meter | Retire: zero 7-day visits/actions and zero 28-day GSC impressions; remove random score/proof/ads and redirect to Fortune Cookie, replacing stale recommendations | app `b91413b`, Fortune Cookie `76ef226`, portal `fca8319`, Pages `33962455925`/`33962460822`/`33962465861`, 8/8, 18 blob matches |
| Sleep Animal | Retire: zero 7-day visits/actions and zero 28-day GSC impressions; remove unvalidated chronotype/results/ads and redirect to credible Animal Personality, replacing every stale backlink | app `27a743a`, Animal Personality `8608976`, portal `d03809f`, Pages `33963444659`/`33963482240`/`33963485815`, 8/8, 19 blob matches |
| Rizz Score | Retire: zero 7-day GA4 rows/actions and zero 28-day GSC rows; remove unvalidated score/ads and redirect to Attachment Style, replacing live backlinks and stale Brainrot/Delulu cards | app `74cd5a2`, five app dependencies plus portal `94afaaa`, Pages `33964626238` through `33964649073`, 8/8, 13 blob matches |

## Trend queue

1. Recheck seven-day game signals; held hypotheses and meme formats do not justify thin pages.
2. Improve the existing Odyssey/Spider-Man URL only after its choice path is measured; do not fragment the intent.

Current signal qualification and primary sources live in `docs/STRATEGY.md` and the `dopabrain-growth-ops` culture-signal reference.

## Verification baseline

- Pre-optimization harness `2026-09-05T04-49-44-276Z` passed 205/205 in 968.9 seconds. Its 97 duplicate syntax subprocesses used only 4.7 seconds but nearly doubled the step/report count.
- Final harness `2026-09-05T11-57-56-963Z` passed 122/122 in 788.7 summed seconds after Rizz Score retirement. It remains about 19% faster than the 205-step baseline; Rizz Score caught 8/8 mutations, analytics 9/9, runtime 6/6 and inventory 63/0.
- Successful-step output is omitted from JSON: `latest.json` fell from 159.0 KB to about 14 KB. Safe gates use path-scoped clocks or isolated concurrency; qualified-exposure and crash-watch timers remain real.
- GitHub Pages source must be queried per child repository before release. Working/development branch names are not deployment evidence.
