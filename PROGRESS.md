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

## Latest release: Emotion Temp containment and transparent scoring

- Emotion Temp had six Organic sessions / five engaged / 774 engagement seconds and five completions during 2026-07-11 to 2026-09-04. Search Console returned no exact-page row. Those credible discovery and action signals preserve the route.
- Release `8b7af6b` removes the manual ad unit/push, active loader, synthetic ad-impression/engagement events, fabricated `4.6 / 2,800` proof, hidden FAQ, fake premium/ad wait, random percentile, diagnostic-looking traits/compatibility, result-image download, duplicate recommendations and result-bearing shares. Ads are explicitly suspended.
- The retained ten choices disclose their 0–4 intensity points. The formula `round(-10 + total / 40 * 50)` maps the 0–40 total to a −10–40°C author-created metaphor and one of eight fixed ranges. The page states that this is not a psychological or health assessment.
- The result has one primary private Stress Check, two related reflections and one neutral success-gated share. Seven exact-once stages exclude answers, total, temperature, result, locale, URL and timing.
- The release removed 5,051 lines. HTML shrank from 24,478 to 8,605 bytes and app JS from 34,579 to 6,378 bytes. The verifier detects 21/21 defects and passes local/deployed 390/1440px journeys. Portfolio ad-risk is now `critical 0 / high 35 / medium 6 / info 53 / clean 25`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 209 redirects, 1,596 noindex.
- Final harness `2026-09-05T02-25-17-669Z`: 195/195 stages passed, including analytics 9/9 and runtime 6/6. Pages run `33939016757` succeeded; four cache-bypassed production files exactly matched local content.
- Next: contain `overthinker-test`, now the weakest remaining score-130 product, while preserving its six Organic sessions / six engaged / 1,079 seconds and nine completions. Keep new trend content behind the distinct-intent and measurable-interaction gate.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
