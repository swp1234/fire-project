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

## Latest release: Stack Tower containment and measurement

- Exact-route GA4 for 2026-07-11 to 2026-09-04 had 65 page views / 30 sessions. Singapore desktop Direct dominated, but South Korea mobile Naver and Uruguay desktop Bing supplied Organic acquisition, including a six-page repeat session. Search Console returned no exact-page row.
- Historical events contained only page-view, synthetic and ambient signals, so the route remains live while real play is measured. Stack Tower `424f75a` is deployed by Pages run `33923277993`.
- The release removes Auto Ads, interstitial/rewarded paths, ad-gated power-ups and revive, fabricated rating/hidden FAQ, synthetic telemetry, generic promotion and unused error/social-image assets. Play, themes, local statistics, 12 locales and four attributable related routes remain.
- New private exact-once funnel: `stack_tower_view -> stack_tower_start -> stack_tower_progress -> stack_tower_complete -> stack_tower_share/stack_tower_related_click`. Scores, floors, themes, outcomes, timing and URLs are excluded.
- The dedicated verifier detects 24/24 injected defects and passes local and production 390/1440px play, successful placement, game over, retry, share and nested related-link journeys. Portfolio ad-risk is now `critical 5 / high 40 / medium 6 / info 52 / clean 16`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 208 redirects, 1,597 noindex.
- Final harness `2026-09-04T21-41-06-476Z`: 173/173 stages passed, including analytics 9/9 and runtime 6/6.
- Next: compare the remaining critical candidates while protecting Number Puzzle starts, Emoji Merge completion, Word Guess Organic sessions and Snake Organic acquisition. Keep trend publishing behind the distinct-intent and measurable-interaction gate.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
