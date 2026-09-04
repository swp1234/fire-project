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

## Latest release: Word Guess containment and real-play funnel

- Word Guess was preserved because it retained four Organic sessions and 577 engagement seconds. The old page nevertheless combined duplicated Auto Ads loaders, two manual units, result interstitials and a rewarded-hint action, so its historical traffic could not safely justify monetization.
- Word Guess `f260e62` is deployed by Pages run `33926542249`. It removes all ad/reward paths, fabricated aggregate-rating and hidden FAQ proof, synthetic engagement, generic retention/promotion helpers and a duplicate floating share control. The daily/practice game, native streak/statistics, hints, 12 locales and four attributable related routes remain.
- Private exact-once funnel: `word_guess_view -> word_guess_start -> word_guess_progress -> word_guess_complete -> word_guess_share/word_guess_related_click`. Start requires the first accepted word and progress the second; page load, partial/invalid input, mode changes and resets do not qualify. Words, guesses, results, scores, timing, language and URLs are excluded.
- Real-browser validation also found and fixed two product defects: `?mode=practice` previously opened Daily despite the PWA shortcut, and mode/difficulty controls were only 36 px high. Shortcut mode is now honored and controls meet the 44 px touch target.
- The dedicated verifier detects 25/25 injected defects and passes local and production 390/1440px partial input, reset, two accepted guesses, completion, successful share and nested related-link journeys. Portfolio ad-risk is now `critical 3 / high 40 / medium 6 / info 52 / clean 18`.

## Validation and next action

- Common AdSense contract: 11/11 mutations detected; all suspended products have zero ad loaders.
- Submitted indexing inventory: 63 URLs, zero issues. Blog focus: 173 indexable, 208 redirects, 1,597 noindex.
- Final harness `2026-09-04T22-27-09-377Z`: 177/177 stages passed, including analytics 9/9 and runtime 6/6.
- Next: compare Emoji Merge and Snake using valid completion/acquisition evidence before containing the weaker risk surface. Keep trend publishing behind the distinct-intent and measurable-interaction gate.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
