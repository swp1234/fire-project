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

## Latest release: Delulu retirement

- Retired `/delulu-score/`: 2026-08-29 through 2026-09-04 contained no credible acquisition or qualified action; its only visit was Singapore desktop Direct scan-like traffic.
- Removed the unsupported behavior/personality score, result-bearing shares, synthetic engagement, FAQ, manual ad unit/request and stale 12-locale bundle. The legacy URL is now a 1.4 KB `noindex,follow` redirect to the validated Future Self path with narrow cache cleanup.
- Removed the sole portal catalog dependency; 4,289 lines were deleted across the child and portal repositories.
- Child `29043cb` and portal `89fa800` deployed from confirmed Pages sources; runs `33960469571` and `33960471975` succeeded. The three checked live files match their deployed Git blobs.

## Validation and next action

- Delulu retirement caught 8/8 injected defects; local and production mobile/desktop redirects passed. Portfolio risk is now `0 critical / 21 high / 6 medium / 53 info / 39 clean`; submitted inventory remains 63/0 because the retired URL was not submitted.
- Final harness `2026-09-05T10-23-47-409Z` passed 118/118 in 739.1 summed seconds: Delulu 8/8 mutations, analytics 9/9, runtime 6/6 and submitted inventory 63/0.
- Documentation budgets remain mutation-tested: `PROGRESS.md` is current-state only, and durable evidence is compacted in the data log and skill references.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
