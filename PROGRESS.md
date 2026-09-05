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

## Latest release: Sleep Animal retirement

- Retired `/sleep-animal/`: the complete 2026-08-29 through 2026-09-04 window had zero visits/actions, and the prior 28 Search Console days had zero impressions.
- Removed the unvalidated chronotype result, result telemetry, ads and stale locale/assets. The 1.4 KB `noindex,follow` route now redirects to Animal Personality with narrow cache cleanup.
- Removed portal promotion and replaced every portal/destination backlink with HSP Test. Animal Personality remains the credible target: two Organic sessions and three completion users in the same complete seven-day window.
- Sleep Animal `27a743a`, Animal Personality `8608976` and portal `d03809f` deployed from confirmed Pages sources; runs `33963444659`, `33963482240`, `33963485815` succeeded. All 19 affected live files match their deployed Git blobs.

## Validation and next action

- Sleep Animal retirement caught 8/8 injected defects; local and production mobile/desktop redirects passed. Portfolio risk is now `0 critical / 18 high / 6 medium / 53 info / 42 clean`; submitted inventory remains 63/0 because the retired URL was not submitted.
- The preserved Animal Personality target passed its quality gate, and the related English guide passed its browser/content contract. Final harness `2026-09-05T11-32-10-298Z` passed 121/121 in 738.7 summed seconds, including analytics 9/9, runtime 6/6 and submitted inventory 63/0.
- Documentation budgets remain mutation-tested: `PROGRESS.md` is current-state only, and durable evidence is compacted in the data log and skill references.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
