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

## Latest release: Trauma Response containment and result reset

- Trauma Response had 58 page views / 28 users and only two completions during 2026-07-11 to 2026-09-04. Its five Organic sessions were all engaged but totaled only 143 seconds; Search Console returned no exact-page row. The Organic signal is enough to preserve the route, not enough to preserve its risky implementation.
- Release `067c356` removes three manual ad units, the result ad request/impression event, the active loader, fabricated `4.6 / 2,840` rating, hidden FAQ, random percentile, clinical-looking dimension output, duplicate promotion, result-bearing telemetry and premature result sharing. Ads are explicitly suspended.
- The result now transparently counts one point per answer across four labels, states that the activity is author-created and non-diagnostic, and offers one primary Stress Check plan action plus two focused related routes. Twelve locale bundles retain only used, bounded result copy; the app lost 1,417 lines net and gained a 711-byte release contract.
- Private exact-once stages are `trauma_response_view -> start -> progress -> complete`, plus success-only `next_click`, `share` and delegated `related_click`. Answers, result labels, scores, locale, URL and timing are excluded.
- The dedicated verifier detects 20/20 injected defects and passes local and deployed 390/1440px eight-question journeys. Portfolio ad-risk is now `critical 0 / high 39 / medium 6 / info 53 / clean 21`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 209 redirects, 1,596 noindex.
- Final harness `2026-09-05T00-34-10-042Z`: 187/187 stages passed, including analytics 9/9 and runtime 6/6. Production returned the exact 21,226-byte shell and 12,038-byte app with no ad surface.
- Next: evaluate `anxiety-type` as the highest-risk product with the strongest credible Organic engagement, then contain its placement/measurement risk without suppressing its search route. Keep new trend content behind the distinct-intent and measurable-interaction gate.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
