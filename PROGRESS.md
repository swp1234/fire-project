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

## Latest release: Toxic Trait containment and reflection reset

- Toxic Trait had 34 page views / 32 users, 18 engaged sessions and 345 engagement seconds during 2026-07-11 to 2026-09-04. Its seven Organic sessions were all engaged but totaled only 124 seconds, and no valid start or completion event existed. Search Console returned no exact-page row. The Organic entries preserve the route; the missing action signal makes it the weakest remaining score-130 implementation.
- Release `b83d2af` removes three manual ad units, two direct pushes, the active loader/H5 initialization, fabricated `4.7 / 2,340` rating, hidden FAQ, fake 12,000-profile comparison, random percentile, clinical-looking dimension output, duplicate recommendations and five result-bearing share actions. Ads are explicitly suspended.
- The retained eight questions disclose an author-created rule: each answer adds one point to one mapped label and the first matching label breaks a tie. The page states that it is not a diagnosis or validated assessment. The result has one primary Stress Check action, two focused related routes and one neutral success-gated share.
- Private exact-once stages are `toxic_trait_view -> start -> progress -> complete`, plus success-only `next_click`, `share` and delegated `related_click`. Answers, scores, result labels, locale, URL and timing are excluded.
- The dedicated verifier detects 21/21 injected defects and passes local and deployed 390/1440px eight-question journeys. Portfolio ad-risk is now `critical 0 / high 37 / medium 6 / info 53 / clean 23`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 209 redirects, 1,596 noindex.
- Final harness `2026-09-05T01-31-05-429Z`: 191/191 stages passed, including analytics 9/9 and runtime 6/6. Production returned the exact 33,505-byte shell and 1,161-byte scoped worker with no ad surface.
- Next: contain `ai-personality`, the weakest of the six remaining score-130 products, while preserving its four engaged Organic sessions and three completions. Keep new trend content behind the distinct-intent and measurable-interaction gate.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
