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

## Latest release: Road Shooter containment and measurement

- Exact-route GA4 for 2026-07-11 to 2026-09-04 had 29 page views. Singapore desktop Direct supplied 24; ChatGPT AI-assistant referrals supplied four. There was no Organic or Search Console row.
- The old app had no game-stage telemetry, so lack of actions was unmeasured rather than proof of no play. It also ignored the URL language in favor of saved Korean, breaking English referral intent.
- Road Shooter `d7b0efc` is deployed by Pages run `33915308819`. It preserves the game and 12 locales while removing Auto Ads, interstitials, rewarded double-gold, fabricated rating, synthetic engagement and inaccessible promotion.
- New private exact-once funnel: `road_shooter_view -> road_shooter_start -> road_shooter_progress -> road_shooter_complete`. Scores, stages, outcomes, timing and URLs are excluded.
- The dedicated verifier detects 20/20 injected defects and passes local and production 390/1440px first-run tutorial, start, control, result and retry journeys.
- Portfolio ad-risk inventory is now `critical 8 / high 40 / medium 6 / info 52 / clean 13`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 208 redirects, 1,597 noindex.
- The integrated harness exposed a K-pop verifier race: it checked modal focus before the app's animation frame. The verifier now waits for the focus contract and its targeted suite passes 52/52 mutations.
- Final harness `2026-09-04T20-31-15-448Z`: 167/167 stages passed, including analytics 9/9 and runtime 6/6.
- Next: compare the remaining critical candidates while protecting Number Puzzle starts, Emoji Merge completion, Word Guess Organic sessions and Snake Organic acquisition.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
