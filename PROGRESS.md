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

## Latest release: Zigzag Runner containment and measurement

- Exact-route GA4 for 2026-07-11 to 2026-09-04 had 30 page views / 30 sessions / 23 engaged sessions / 402 engagement seconds. Singapore desktop Direct supplied 23; China desktop Bing supplied the only two Organic sessions. Search Console returned no exact-page row.
- Historical events contained only page-view, synthetic and ambient signals, so no valid game action was measurable. Stack Tower retained Organic acquisition from two engines and stronger repeat use, so Zigzag Runner was the weaker next containment target; the game and four attributable related routes remain live.
- Zigzag Runner `712ddb0` is deployed by Pages run `33920495932`. It removes Auto Ads, interstitials, rewarded revive, fabricated rating/FAQ, synthetic engagement, generic promotion and about 102 KB of unused image/error assets.
- New private exact-once funnel: `zigzag_runner_view -> zigzag_runner_start -> zigzag_runner_progress -> zigzag_runner_complete -> zigzag_runner_share/zigzag_runner_related_click`. Scores, coins, stages, themes, outcomes, timing and URLs are excluded.
- The dedicated verifier detects 23/23 injected defects and passes local and production 390/1440px start, two-tap progress, result, retry, share and nested related-link journeys. Portfolio ad-risk is now `critical 6 / high 40 / medium 6 / info 52 / clean 15`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 208 redirects, 1,597 noindex.
- The integrated harness exposed a K-pop verifier race: it checked modal focus before the app's animation frame. The verifier now waits for the focus contract and its targeted suite passes 52/52 mutations.
- Final harness `2026-09-04T21-19-48-375Z`: 171/171 stages passed, including analytics 9/9 and runtime 6/6.
- Next: compare the remaining critical candidates while protecting Number Puzzle starts, Emoji Merge completion, Word Guess Organic sessions, Snake Organic acquisition and Stack Tower's multi-engine Organic acquisition.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
