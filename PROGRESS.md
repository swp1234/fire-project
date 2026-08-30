# DopaBrain Current State

Updated: 2026-08-30

This file keeps only the current operating state. Decision-changing measurements belong in `memory/data-check-log.md`; reusable procedure belongs in the `dopabrain-growth-ops` skill; durable test contracts belong in `docs/VALIDATION.md`.

## Objective

- Raise rolling 7 complete-KST-day AdSense revenue from `$0.75` to `$1.40` (`$0.20/day`), then toward `$1/day`.
- Exclude deployment days, partial current days, and Singapore desktop Direct scans from decisions.
- Change one independently measurable path at a time and preserve its observation window.

## Baseline

- 2026-08-23~29 AdSense: `$0.75`, 1,795 pageviews, 827 impressions, 22 clicks, Page RPM `$0.42`.
- Country opportunity: US `$0.21 / 57 PV / $3.75 RPM`; KR `$0.18 / 103 PV / $1.71 RPM`; CN `$0.19 / 591 PV / $0.32 RPM`.
- Focused sitemap: 49 unique submitted URLs, strict issues 0.
- Portfolio: Stress Check, HSP Test, and 2048 Coach are primary; Brain Type, IQ, and K-pop Roster are support; Culture Signal is a pilot; Portal is the archive.

## Latest release: English attachment path

- The English avoidant-attachment guide declined from 13 to 4 equal-window Organic sessions, but the recent 4 users still produced 602 engagement seconds. Across 56 days, 37 content users produced only 1 guide-to-test click.
- The attachment app had 117 page users, 41 starts, and 28 completions over 56 days. Start-to-completion was about 68%, so the completion engine was retained and the guide-to-start trust boundary was reset.
- The 36.2 KB guide became a 15.1 KB evidence-first answer. It explains the ECR-R 36-item/two-dimension model, separates association from causation, removes deterministic childhood/nervous-system/healing claims, and offers two identical direct-start CTAs plus two focused related links.
- The 12-locale app is now a private 10-scenario response reflection. Fabricated rating/social proof, hidden FAQ, random percentile, manual ad unit, synthetic impression, per-answer telemetry, and result-bearing share URLs were removed.
- New app stages: `attachment_reflection_view → start → complete → share/restart/related_click`. Answers, scores, and result labels stay out of analytics and URLs. Historical quiz/result events are not comparable.

## Deployment and verification

- Attachment app: `b6e9056`; Pages run `33310406327` succeeded.
- Portal guide/catalog: `319fbba`; Pages run `33310860473` succeeded.
- `verify:en-attachment-reflection`: 13/13 mutations detected; all 12 locale completions, mobile/desktop, guide auto-start, neutral sharing, source normalization, and `clarity_board` compatibility passed locally and live.
- Full harness: `logs/harness-workflow/2026-08-30T12-13-23-107Z.md`; all steps passed, analytics 9/9, runtime 6/6, submitted inventory 49 URLs / 0 issues.
- Prior live releases remain under observation: Chinese RSD action path, Chinese Zodiac Pair reset, and Spanish Blood Type culture reset.

## Observation windows

Use complete KST days. Do not decide before 20 qualified views unless a correctness or policy defect appears.

| Path | Window | First diagnostic |
|---|---|---|
| English attachment reflection | 2026-08-31~09-06 | qualified pattern→CTA 8%; app view→start 25%; start→complete 50%; complete→share/related 8% |
| Chinese RSD action | 2026-08-31~09-06 | qualified check→CTA 8%; linked view→generate 50%; generate→used/copy/related 8% |
| Chinese Zodiac Pair | 2026-08-31~09-06 | guide CTA 8%; app view→start 25%; start→open 50%; open→related 8% |
| Spanish Blood Type | 2026-08-31~09-06 | guide CTA 8%; app view→first open 25%; open→related 8% |
| IQ, reaction time, HSP/thought/habit, Brain Type, Spanish guides | 2026-08-31~09-06 | qualified bridge/use 8%; linked action or completion 50% |
| Culture Signal and earlier focused resets | 2026-08-30~09-05 | first decision 2026-09-06 after valid exposure threshold |

## Decision rule

- Revenue milestone: rolling 7 complete-day AdSense total `≥ $1.40`.
- Fewer than 7 complete days: `TOO_EARLY`; insufficient discovery or exposure: `DISCOVERY_HOLD`.
- `PROMOTE`: at least two durable signals among Organic 20/day, engagement 55%, bridge 8%, and attributable Page RPM `$1+`.
- Otherwise `ITERATE`. `SUPPRESS` only after at least 14 days plus 20 Organic sessions and 20 qualified content views show repeated failure.
- Page-unattributed AdSense RPM is a proxy, never URL-level causal evidence.
- Do not publish another trend candidate before the current Culture Signal reaches its first valid decision window.
