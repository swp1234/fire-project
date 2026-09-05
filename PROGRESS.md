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

## Latest release: Red Flag retirement

- Retired `/red-flag-test/` after GA4 showed zero visits/actions for 2026-08-29 through 2026-09-04 and GSC showed no exact-page rows across 28 days. Attachment Style had seven starts, five completions and one related click in the same GA4 window.
- Replaced the 4,132-line stale app with a 1,500-byte `noindex,follow` redirect, narrow cache cleanup and no ads, analytics or unsupported scores. Active portal promotion now leads to Attachment Style with a private `red_flag_retirement` source.
- Corrected the tests hub schema/card/12-locale badge count to 40. Child commits: Attachment `2c7f0d6`, Red Flag `b846af1`, Portal `cb915f7`; Pages runs `33967343730`, `33967345195`, `33967348956`.

## Validation and next action

- Retirement verification caught 11/11 injected defects; local and production mobile/desktop redirects passed, and 19/19 live files match deployed Git blobs. Portfolio risk is now `0 critical / 15 high / 6 medium / 53 info / 45 clean`; submitted inventory remains 63/0.
- Product release harness `2026-09-05T12-55-32-921Z` passed 14/14. Final full harness `2026-09-05T12-56-26-497Z` passed 124/124 in 797.2 summed seconds, including analytics 9/9 and runtime 6/6.
- Documentation budgets remain mutation-tested; current decisions stay here, while release narration and raw reports stay in Git/ignored logs.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
