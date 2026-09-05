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

## Latest release: AI Personality containment and character reset

- AI Personality had 34 page views / 17 users / 17 sessions, 15 engaged sessions and 486 engagement seconds during 2026-07-11 to 2026-09-04. Four Organic sessions were all engaged and totaled 139 seconds; five users started and three completed. Search Console returned no exact-page row. Those credible acquisition and action signals preserve the route.
- Release `1db0eac` removes three manual ad units, the direct result push, active loader, synthetic ad-impression/engagement/page-view events, fabricated `4.6 / 2,180` rating, hidden FAQ, fake `2.1M` proof, random percentile, arbitrary capability metrics, duplicate recommendations and result-bearing share actions. Ads are explicitly suspended.
- The retained ten choices now disclose an author-created rule: each answer adds one point to one named AI character and the first listed character breaks a tie. The page states that the output is entertainment, not a personality assessment or official/current AI-model comparison.
- The result has one primary private Future Self reflection, two focused related routes and one neutral success-gated share. Private exact-once stages are `ai_personality_view -> start -> progress -> complete`, plus success-only `next_click`, `share` and delegated `related_click`; answers, scores, result labels, locale, URL and timing are excluded.
- Twelve locale bundles retain only rendered copy; HTML shrank from 29,500 to 19,082 bytes and app JS from 24,855 to 9,168 bytes. The dedicated verifier detects 23/23 injected defects and passes local and deployed 390/1440px ten-choice journeys. Portfolio ad-risk is now `critical 0 / high 36 / medium 6 / info 53 / clean 24`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 209 redirects, 1,596 noindex.
- Final harness `2026-09-05T01-59-39-003Z`: 193/193 stages passed, including analytics 9/9 and runtime 6/6. Pages run `33937771685` succeeded; production returned the exact 19,082-byte shell, 9,168-byte app and 1,281-byte scoped worker with no ad surface.
- Next: contain `emotion-temp`, the weakest remaining score-130 product by completion count, while preserving its six Organic sessions / five engaged / 774 seconds and five completions. Keep new trend content behind the distinct-intent and measurable-interaction gate.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
