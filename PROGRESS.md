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

## Latest release: Hail Mary retirement

- Retired `/hail-mary-mode/`: the complete 2026-08-29 through 2026-09-04 window contained no credible acquisition or qualified action.
- Removed the unsupported score/rating, result telemetry and sharing, FAQ, manual ad units/requests, push worker and stale 12-locale bundle. The 1.4 KB legacy route redirects `noindex,follow` to Stress Check with narrow cache cleanup.
- Removed its portal catalog, tests-hub and 12-locale guide promotions. The unindexed trend article now redirects to the maintained stress-management guide; 3,592 lines were deleted.
- Child `0ad86a4` and portal `c53617c` deployed from confirmed `main` Pages sources; runs `33961391663` and `33961531649` succeeded. All 18 affected live files match `origin/main` byte-for-byte.

## Validation and next action

- Hail Mary retirement caught 10/10 injected defects; app/article redirects passed locally and in production at mobile and desktop sizes. Portfolio risk is now `0 critical / 20 high / 6 medium / 53 info / 40 clean`; submitted inventory remains 63/0 because neither retired URL was submitted.
- The 12 preserved stress guides passed individual browser checks. Final harness `2026-09-05T10-47-12-020Z` passed 119/119 in 741.5 summed seconds, including analytics 9/9, runtime 6/6 and submitted inventory 63/0.
- Documentation budgets remain mutation-tested: `PROGRESS.md` is current-state only, and durable evidence is compacted in the data log and skill references.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
