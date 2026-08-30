# DopaBrain Current State

Updated: 2026-08-30

This file contains current operating state only. Decision-changing measurements belong in `memory/data-check-log.md`; reusable procedure belongs in the `dopabrain-growth-ops` skill; durable test contracts belong in `docs/VALIDATION.md`.

## Objective

- Raise rolling 7 complete-KST-day AdSense revenue from `$0.75` to `$1.40` (`$0.20/day`), then toward `$1/day`.
- Exclude deployment days, partial current days, and Singapore desktop Direct scans from decisions.
- Change one independently measurable path at a time and preserve its observation window.

## Baseline and portfolio

- 2026-08-23~29 AdSense: `$0.75`, 1,795 pageviews, 827 impressions, 22 clicks, Page RPM `$0.42`.
- Country opportunity: US `$0.21 / 57 PV / $3.75 RPM`; KR `$0.18 / 103 PV / $1.71 RPM`; CN `$0.19 / 591 PV / $0.32 RPM`.
- Focused sitemap: 49 unique submitted URLs, strict issues 0.
- Primary: Stress Check, HSP Test, 2048 Coach. Support: Brain Type, IQ, K-pop Roster. Culture Signal remains one isolated pilot. Portal remains the archive.

## Latest release: English Jung shadow path

- `/portal/blog/en/carl-jung-shadow-self-explained.html` had 49 content users and 20 engaged users over 56 days but no valid next-action user. Its latest two Organic users were engaged for 410 seconds. Exact-page Google Search Console rows were absent.
- `/shadow-work/` had 54 page users, 17 quiz-start users and 9 quiz-complete users. The completion engine was usable, but its random percentile, invented six-archetype measurement, deterministic unconscious claims, result telemetry and mixed legacy events made the funnel uninterpretable.
- The 48.2 KB guide is now a 14.1 KB evidence-boundary article. It distinguishes Jungian theory from diagnosis or measurement, cites IAAP/SAP sources, provides one grounded four-line practice, and uses two identical direct-start CTAs plus two focused related links.
- The app is now a 12-locale private eight-scenario response reflection. It publishes the one-point-per-answer-direction formula, removes fabricated proof and result claims, uses one Auto Ads loader, and keeps answers, counts and result names out of analytics, URLs and neutral share links.
- New funnel only: `content_en_jung_shadow_concept_view -> content_cta_click -> shadow_reflection_view -> shadow_reflection_start -> shadow_reflection_complete -> shadow_reflection_share/shadow_reflection_related_click`. Historical quiz/result/ad events are not comparable.

## Deployment and verification

- Shadow app: `556933d`; Pages run `33312294971` succeeded.
- Portal guide/catalog: `83da986`; Pages run `33312297876` succeeded.
- `verify:en-shadow-reflection`: 14/14 mutations detected; all 12 locale completions, guide auto-start, source normalization, neutral sharing, private telemetry, mobile layout and locale-load recovery passed locally and live.
- Full harness: `logs/harness-workflow/2026-08-30T12-47-31-171Z.md`; every step passed, analytics 9/9, runtime 6/6, submitted inventory 49 URLs / 0 issues.

## Observation windows

Use complete KST days. Do not decide before 20 qualified views unless a correctness or policy defect appears.

| Path | Window | First diagnostic |
|---|---|---|
| English Jung shadow reflection | 2026-08-31~09-06 | qualified concept-to-CTA 8%; app view-to-start 25%; start-to-complete 50%; complete-to-share/related 8% |
| English attachment, Chinese RSD, Chinese Zodiac Pair, Spanish Blood Type | 2026-08-31~09-06 | use each release's new stage events; ignore legacy/synthetic events |
| IQ, reaction time, HSP/thought/habit, Brain Type, Spanish guides | 2026-08-31~09-06 | qualified bridge/use 8%; linked action or completion 50% |
| Culture Signal and earlier focused resets | 2026-08-30~09-05 | first decision 2026-09-06 after valid exposure threshold |

## Decision rule

- Revenue milestone: rolling seven complete-day AdSense total `>= $1.40`.
- Fewer than seven complete days: `TOO_EARLY`; insufficient discovery or exposure: `DISCOVERY_HOLD`.
- `PROMOTE`: at least two durable signals among Organic 20/day, engagement 55%, bridge 8%, and attributable Page RPM `$1+`.
- Otherwise `ITERATE`. `SUPPRESS` only after at least 14 days plus 20 Organic sessions and 20 qualified content views show repeated failure.
- Page-unattributed AdSense RPM is a proxy, never URL-level causal evidence. Do not publish another trend candidate before the current Culture Signal reaches its first valid decision window.
