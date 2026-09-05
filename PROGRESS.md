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

## Latest release: NPC completion reset

- The current source already emitted completion correctly; the only observed starter stopped after four choices and four mandatory continue clicks. The route is preserved, but question typing waits and ten extra continue clicks are removed so ten choices complete the activity.
- Manual ads, synthetic engagement, fabricated 4.5 / 1,850 rating, inaccurate FAQ schema, random percentile and zero-click generic cross-promo are removed. The disclosed score is the ten 0–3 choice values divided by 30, with a visible entertainment-only boundary.
- Production commit d2134b7 is deployed from the repository's actual Pages source, gh-pages. Master commit dd1332c carries the same reset. Cache-bypassed production HTML, CSS, app, Korean locale, manifest and worker match local SHA-256 hashes.

## Validation and next action

- NPC verifier: 22/22 injected defects detected; local and production ten-choice journeys passed at 390/1440 px with three private exact-once stages and zero ads. Pages run 33946998363 succeeded.
- Portfolio risk: critical 0 / high 29 / medium 6 / info 53 / clean 31. Submitted inventory remains 63 unique URLs with zero issues.
- The 158 KB append-only decision log is now a 7.9 KB current baseline. A mutation-tested documentation budget prevents root operating files from regrowing into session transcripts.
- Final harness `2026-09-05T06-14-34-023Z` passed 110/110 in 693.4 seconds with analytics 9/9, runtime 6/6 and inventory 63/0. That is 28% faster than the 968.9-second 205-step baseline; JSON fell from 159.0 KB to 13.8 KB.
- Path-scoped clocks and isolated concurrency reduced Attachment 115.2s -> 10.2s, K-pop 122.7s -> 32.8s, runtime 61.8s -> 21.1s, analytics 39.7s -> 8.5s and Shadow 37.1s -> 4.4s without shortening qualified exposure or per-app crash watches. Next: return to the highest-value containment/product bottleneck while traffic expansion remains paused.

User-owned projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js} remains untouched.
