# DopaBrain current status

Updated: 2026-09-05 KST. Release history is in `memory/data-check-log.md`; the repeatable loop is in the `dopabrain-growth-ops` skill.

## Target and blocker

- Target: `$1.40` per completed seven days (`$0.20/day`).
- 2026-08-29 through 2026-09-04: `$0.63 / 2,115 page views / 644 impressions / 14 clicks`, or `$0.090/day`.
- Ad serving has been restricted for invalid-traffic concerns since 2026-09-03; the policy-issues API remains empty.

## Current rule

- Keep ad-layout experiments, traffic expansion, IndexNow and manual GSC submissions paused until the restriction clears.
- Remove manual ads, reward/interstitial exchanges, fabricated proof and unverifiable paid-impression telemetry one measured product at a time.
- Preserve routes with credible Organic acquisition or valid action evidence. Exclude Singapore desktop Direct scans and legacy synthetic events from growth decisions.

## Latest release: World Knowledge Sprint

- Keep `/quiz-app/` as a repaired acquisition test: 2026-08-29 through 2026-09-04 had three users, including one Indian Organic visitor, but no valid action. The old page advertised 12 languages while serving all 180+ questions only in Korean and started a 15-second timer immediately.
- Replaced the stale/random bank with ten fixed, stable English/Korean questions, an explicit start, one point per correct answer, visible explanations and no timer. The result is only correct answers out of ten and explicitly makes no intelligence, education, rank or percentile claim.
- Removed four manual ad units/pushes, interstitial and result ads, fabricated rating/grades, ad-gated “AI analysis,” hidden FAQ, synthetic engagement, result leakage and six competing rails. Removed 6,317 lines and 245 KB of unused PNGs; risk moved from `high 110` to `clean 0`.
- Child `879185c` deployed from confirmed Pages source `main`; Pages run `33957622442` succeeded. All 12 release assets match the deployed commit byte-for-byte.

## Validation and next action

- Knowledge Sprint caught 17/17 injected defects. Local and production mobile journeys passed across both honest locales and ten answers with duplicate-click protection, two localized actions, seven parameter-free exact-once events and zero ads.
- Portfolio risk is now `0 critical / 23 high / 6 medium / 53 info / 37 clean`. Submitted inventory remains 63 unique URLs with zero issues.
- Final harness `2026-09-05T09-20-21-366Z` passed 116/116 in 734.4 summed seconds: Knowledge Sprint 17/17 mutations, Aura 17/17, analytics 9/9, runtime 6/6 and submitted inventory 63/0.
- Documentation budgets remain mutation-tested: `PROGRESS.md` is current-state only, and durable evidence is compacted in the data log and skill references.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
