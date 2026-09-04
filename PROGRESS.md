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

## Latest release: Number Puzzle measurement correction and containment

- The historical `game_start` signal with 36 users was invalid: source inspection proved it fired in the constructor on every page load, before any player input. It is no longer evidence of product use, so the route remains live only to collect a valid funnel rather than being promoted or immediately deleted.
- Number Puzzle `5cb658a` is deployed by Pages run `33924867445`. The release removes Auto Ads, three manual units/pushes, interstitial/rewarded score paths, fabricated rating/hidden FAQ, synthetic telemetry, eight stale `/projects/*` recommendations, generic promotion and unused social images.
- The 4x4 game, Undo, saved state, sound, 12 locales and four attributable related routes remain. `number_puzzle_start` now requires the first board-changing move; `number_puzzle_progress` requires three valid moves.
- Private exact-once funnel: `number_puzzle_view -> number_puzzle_start -> number_puzzle_progress -> number_puzzle_complete -> number_puzzle_share/number_puzzle_related_click`. Scores, tiles, directions, results, timing and URLs are excluded.
- The dedicated verifier detects 25/25 injected defects, including page-load false starts, and passes local and production 390/1440px reset, three valid moves, 2048 completion, share and nested related-link journeys. Portfolio ad-risk is now `critical 4 / high 40 / medium 6 / info 52 / clean 17`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 208 redirects, 1,597 noindex.
- Final harness `2026-09-04T22-03-28-113Z`: 175/175 stages passed, including analytics 9/9 and runtime 6/6.
- Next: contain Word Guess without discarding its four Organic sessions, then re-evaluate Emoji Merge and Snake around their valid completion/acquisition signals. Keep trend publishing behind the distinct-intent and measurable-interaction gate.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
