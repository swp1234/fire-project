# DopaBrain current status

Updated: 2026-09-05 KST. Release history is in memory/data-check-log.md; the repeatable loop is in the dopabrain-growth-ops skill.

## Target and blocker

- Target: $1.40 per completed seven days ($0.20/day).
- 2026-08-29~09-04: $0.63 / 2,115 page views / 644 impressions / 14 clicks ($0.090/day).
- Ad serving has been restricted for invalid-traffic concerns since 2026-09-03. Policy-issues API remains empty.

## Current rule

- Keep ad-layout experiments, traffic expansion, IndexNow and manual GSC submissions paused until the restriction clears.
- Remove manual ads, rewarded/interstitial paths, fabricated proof and unverifiable paid-impression telemetry one measured product at a time.
- Preserve routes with credible Organic acquisition or valid completion evidence; exclude Singapore desktop Direct scans and legacy synthetic events from growth judgments.

## Latest release: Seollal Fortune retirement

- The score-110 comparison selected Seollal Fortune because 2026-07-11~09-04 had zero Organic landing sessions, zero fortune_draw actions and no exact Search Console row. It recorded 37 page views / 37 users, while 34 Singapore desktop Direct sessions matched the excluded scan pattern.
- Release fa08267 replaces the stale 2026 random-fortune experience, two manual ads, direct pushes, synthetic engagement, fabricated 4.3 / 1,150 proof, unsupported fortune claims and result-rich sharing with a 750-byte noindex,follow redirect to evergreen Fortune Cookie.
- A 592-byte retirement worker deletes only seollal-fortune-* caches, moves previously controlled clients to the target and unregisters. This prevents the old cache-first worker from reviving retired content.
- Seollal Greetings release 524d8cd removes its retired recommendation and links to Zodiac Pair. Both production files and the redirect/worker matched local hashes exactly.

## Validation and next action

- Seollal retirement verifier: 12/12 injected defects detected; local and production redirects passed at 390/1440 px.
- Portfolio risk: critical 0 / high 30 / medium 6 / info 53 / clean 30.
- Submitted inventory: 63 unique URLs, zero issues. Full harness 2026-09-05T04-49-44-276Z: 205/205 passed, including analytics 9/9 and runtime 6/6.
- Trend R&D queue is refreshed in docs/STRATEGY.md. Next: continue score-110 cleanup while rechecking the held game signal across seven days; do not publish or expand traffic while the restriction remains.

User-owned projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js} remains untouched.
