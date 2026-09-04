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

## Latest release: portal shared-ad containment and stale-guide retirement

- The portal apps remain live because credible Organic signals exist: Past Life had two app sessions and its English guide had 16 Organic sessions / 10 engaged / 463 engagement seconds; the Chinese MBTI City guide had four Organic sessions, all engaged, and 465 seconds. Shared monetization risk was isolated instead of deleting those routes.
- Portal `0d359ee` is deployed by Pages run `33930945759`. The shared 6,758-byte H5/reward module is now a 464-byte compatibility adapter that never requests, renders or rewards an ad, reports unavailable and preserves existing completion callbacks.
- `/portal/blog/free-online-games.html` had only three Direct sessions / one engaged / 15 seconds in 56 days, zero Organic acquisition and no exact Search Console row. Its 79,097-byte page is now a 673-byte `noindex,follow` redirect to `/portal/games/`; ten catalog, feed, related-link and hreflang references no longer promote it.
- The dedicated verifier detects 11/11 injected defects and passes local and production 390/1440px retirement journeys. The deployed adapter is exactly 464 bytes and contains no AdSense, H5 break or rewarded API. Portfolio ad-risk is now `critical 0 / high 41 / medium 6 / info 52 / clean 20`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 209 redirects, 1,596 noindex.
- Final harness `2026-09-04T23-35-12-426Z`: 183/183 stages passed, including analytics 9/9 and runtime 6/6.
- Next: rank the 41 remaining high-risk products by real Organic/action value, then isolate one manual-unit/direct-push surface without disabling focused loader-only revenue pages. Keep new trend content behind the distinct-intent and measurable-interaction gate.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
