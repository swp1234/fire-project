# DopaBrain current status

Updated: 2026-09-05 KST

This file contains only the current operating decision. Detailed evidence and release history are in `memory/data-check-log.md`; repeatable procedure is in the `dopabrain-growth-ops` skill.

## Goal and blocker

- First target: `$1.40` per completed seven days, equivalent to `$0.20/day`.
- Latest completed seven days (2026-08-29 to 2026-09-04): `$0.63 / 2,115 page views / 644 impressions / 14 clicks`, or `$0.090/day`.
- Latest completed 30 days: `$3.19`, or `$0.106/day`.
- The highest-priority blocker is the invalid-traffic ad-serving restriction that began on 2026-09-03.

## Current operating rules

- The API alert is `SEVERE / adsense-traffic-throttled`; the policy-issues collection is empty.
- Pause ad-layout experiments, traffic expansion, IndexNow and GSC manual submissions until the restriction clears.
- Remove ads, interstitials, rewarded actions, fabricated proof and unverifiable paid-impression telemetry from interactive products one measured product at a time.
- Exclude deployment days, Singapore desktop Direct scans, concentrated non-organic bursts, AI-assistant referrals and legacy synthetic events from growth judgments.
- Do not suppress a product with credible Organic acquisition or real completion signals merely because its total traffic is small.

## Latest release: Emoji Merge containment and valid-play funnel

- Emoji Merge stays live because it retained two China desktop Organic sessions / six page views / 82 engagement seconds and one source-valid `game_over` user. Search Console had no exact-page row. Its historical 79 `page_view` events are not valid visit evidence because the app duplicated GA's automatic page view on initialization.
- Emoji Merge `f64d76c` is deployed by Pages run `33929567417`. It removes Auto Ads, H5/result/100-move interstitials, rewarded double score, fake ad surfaces, fabricated aggregate rating/hidden FAQ, synthetic engagement, deterministic “AI” analysis, private legacy events, generic retention/promotion helpers and dormant copy. The 2048-style board, four evolution chains, Undo, local stats/collection, 12 locales and four related routes remain.
- Private exact-once funnel: `emoji_merge_view -> emoji_merge_start -> emoji_merge_progress -> emoji_merge_complete -> emoji_merge_share/emoji_merge_related_click`. Start requires the first successful move, progress the third, completion a board with no legal move, and sharing a successful system or clipboard action. Score, chain, board, tile, timing, result, language and URL are excluded.
- The service worker and manifest are app-scoped and deployment-relative. Theme, sound and language controls no longer overlap at 390 px, and actions meet the 44 px touch minimum.
- The dedicated verifier detects 24/24 injected defects and passes local and production 390/1440px menu/no-start, three-move progress, terminal-board completion, successful share and nested related-link journeys. Portfolio ad-risk is now `critical 1 / high 40 / medium 6 / info 52 / clean 20`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 208 redirects, 1,597 noindex.
- Final harness `2026-09-04T23-12-56-696Z`: 181/181 stages passed, including analytics 9/9 and runtime 6/6.
- Next: audit and contain the remaining portal-level critical risk without disabling revenue on already-focused, loader-only pages. Keep trend publishing behind the distinct-intent and measurable-interaction gate.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
