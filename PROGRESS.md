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

## Latest release: portal Auto Ads-only cleanup

- Palworld's 56-day 459 page views were 94% Singapore desktop Direct scans. Only four Organic sessions existed, and valid actions were limited to three base-plan users and one field-plan user. Search Console returned no rows for the Palworld or MBTI type-page set.
- Portal `3fc3cd2` is deployed by Pages run `33932446058`. It removes six manual units/direct pushes and nine client-authored ad-impression events from five tools, 16 MBTI type pages and three hubs while retaining one fixed-publisher Auto Ads loader on each of the 21 monetized target pages.
- The risk scanner no longer mistakes `seenAds.push()` for an AdSense request or a compatibility adapter definition for an H5 call. It now detects product-prefixed synthetic ad-impression events; its self-test is 12/12.
- The dedicated verifier detects 9/9 injected defects, accepts the former false-positive case, and passes local/production 390/1440px Palworld plan, Past Life story and MBTI type-action journeys. Thirty deployed sources were independently checked with zero risky code and zero loader issues. Portfolio ad-risk is now `critical 0 / high 40 / medium 6 / info 53 / clean 20`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 209 redirects, 1,596 noindex.
- Final harness `2026-09-05T00-01-54-669Z`: 185/185 stages passed, including analytics 9/9 and runtime 6/6.
- Next: compare `anxiety-type` and `trauma-response`, the two highest remaining risks, using real Organic/action evidence; contain or retire the weaker product. Keep new trend content behind the distinct-intent and measurable-interaction gate.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
