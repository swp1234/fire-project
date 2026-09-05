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

## Latest release: QR Generator trust reset

- Kept `/qr-generator/` because it had two US Direct visits and useful guide dependencies, despite zero qualified actions and no 28-day Search Console rows.
- Removed two manual ad units, the active loader, fabricated daily-use/rating proof, synthetic engagement and persisted payload history. Analytics now emits exact-once start/generate/download and successful neutral-share stages without QR input values.
- Restricted the service worker to same-origin successful responses and `qr-generator*` cache cleanup. The app README fell from 209 to 9 lines; the shared harness guide fell from 2,297 to 1,635 bytes.
- Child `91f23f3` deployed in Pages run `33965694291`; all 15 live product files match the deployed Git blobs.

## Validation and next action

- QR trust verification caught 18/18 injected defects; local and production mobile/desktop generation and PNG download passed. Portfolio risk is now `0 critical / 16 high / 6 medium / 53 info / 44 clean`; submitted inventory remains 63/0.
- Product release harness `2026-09-05T12-22-54-697Z` passed 14/14 in 13.0 seconds. Final full harness `2026-09-05T12-23-25-469Z` passed 123/123 in 791.8 summed seconds, including analytics 9/9 and runtime 6/6.
- Documentation budgets remain mutation-tested; current decisions stay here, while release narration and raw reports stay in Git/ignored logs.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
