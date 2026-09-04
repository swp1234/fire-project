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

## Latest release: Snake containment and real-movement funnel

- Emoji Merge was preserved in the comparison: 79 PV, two China Organic sessions / six PV / 82 engagement seconds and one `game_over` user. Snake had 26 PV, of which Singapore desktop Direct supplied 23; its only Organic line was Spain desktop with two sessions / one PV / three seconds, and it had no game-stage event. Search Console returned no exact-page row for either route.
- Snake `211f6a8` is deployed by Pages run `33928019401`. It removes Auto Ads, result interstitial/rewarded revive, fake ad surfaces, fabricated aggregate rating/hidden FAQ, synthetic engagement, score-bearing share URLs, generic retention/promotion helpers and dormant ad/share locale copy. The two-mode canvas game, keyboard/swipe/on-screen controls, power-ups, local leaderboard, 12 locales and four related routes remain.
- Private exact-once funnel: `snake_view -> snake_start -> snake_progress -> snake_complete -> snake_share/snake_related_click`. Mode selection and reset do not qualify; start requires activating the board and progress requires the first completed grid movement. Score, rank, mode, duration, food, direction, language and URL are excluded.
- Runtime validation found the share/menu controls rendered at 43 px; both now meet the 44 px touch target. The service worker and manifest are deployment-relative and app-scoped.
- The dedicated verifier detects 22/22 injected defects and passes local and production 390/1440px menu, mode choice, actual board start, grid movement, game over, successful share and nested related-link journeys. Portfolio ad-risk is now `critical 2 / high 40 / medium 6 / info 52 / clean 19`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 208 redirects, 1,597 noindex.
- Final harness `2026-09-04T22-49-20-274Z`: 179/179 stages passed, including analytics 9/9 and runtime 6/6.
- Next: contain Emoji Merge without discarding its Organic and completion signals, then audit the remaining portal-level critical risk. Keep trend publishing behind the distinct-intent and measurable-interaction gate.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
