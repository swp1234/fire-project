# DopaBrain Current State

Updated: 2026-08-30

이 문서는 현재 판단만 유지한다. 수치 근거는 `memory/data-check-log.md`, 반복 절차는 `dopabrain-growth-ops` Skill, 완료 기준은 `docs/VALIDATION.md`가 기준이다.

## Objective

- 단기: complete KST 7일 수익을 `$0.75`에서 `$1.40`으로 높여 일평균 `$0.20` 달성.
- 장기: `$1/day`.
- 배포일·당일 부분 데이터·Singapore desktop Direct scan은 판단에서 제외.

## Baseline

- 2026-08-23~29 AdSense: `$0.75`, 1,795 pageviews, 827 impressions, 22 clicks, Page RPM `$0.42`.
- US `$0.21 / 57 PV / $3.75 RPM`, KR `$0.18 / 103 PV / $1.71 RPM`, CN `$0.19 / 591 PV / $0.32 RPM`.
- US/KR은 검색→행동 전환, CN은 게임 내 다중 페이지 세션을 우선한다.
- 집중 sitemap: 49 unique URLs, strict issues 0. 계정 정책 문제 없음; 주소 PIN 지급 보류는 유지.

## Portfolio

| Tier | Paths | Role |
|---|---|---|
| Primary | Stress Check, HSP Test, 2048 Coach | 첫 행동·핵심 전환 |
| Support | Brain Type, IQ Test, K-pop Role Roster | 검증된 보조 수요 |
| Pilot | Culture Signal | 트렌드 유입→도구 bridge |
| Archive | Portal | 기존 자산 보존 |
| Suppressed | 나머지 저성과 자산 | 라이브 유지, 홈·집중 sitemap 제외 |

## Latest release

- Chinese zodiac guide held `6 → 6` equal-window Organic sessions. It had 25 pageview users, 20 qualified content users and no CTA users in 56 days; the app had 67 page users but only 10 sign selectors. Discovery existed, but the guide-to-choice path did not convert.
- Replaced deterministic compatibility scores and predictions with 12-locale, score-free conversation cards. Removed fabricated `5,280+` proof, random percentile, love/friend/work scoring, stale AI/premium language, selection values from analytics/share, and synthetic engagement/ad events.
- The 40.5 KB Chinese guide is now a 13.1 KB culture-and-evidence answer with two primary studies and two direct app CTAs. App changes net `−3,801` lines; one Auto Ads loader and app-scoped cache remain.
- Stage contract: `content_view → content_cta_click → zodiac_pair_view → zodiac_pair_start → zodiac_pair_open → zodiac_pair_related_click/zodiac_pair_share`. Historical `page_engage`, `zodiac_select`, `zodiac_result_view`, timer/scroll and synthetic ad events are not comparable.

## Deployment and verification

- Zodiac Match `e403d4f`, Pages run `33308739615`; Portal `cb9d233`, Pages run `33308739767`: success.
- `verify:zodiac-pair-reset`: 10/10 mutations detected; local and live 12-locale mobile journeys, desktop journey and Chinese guide→app journey passed. Sign choices stayed out of URLs, telemetry and shared links.
- Full regression: `logs/harness-workflow/2026-08-30T11-13-44-952Z.md`; all steps passed, runtime 6/6, analytics 9/9, submitted inventory 49/0 issues.
- Recent prior release: Blood Type `63da3a5` / run `33307767157`; Portal `7f0cfd7` / run `33307767313`.
- Main gates: `npm run harness`, `npm run verify:zodiac-pair-reset`, `npm run verify:blood-type-culture-reset`, `node scripts/indexing-inventory.js --strict`.

## Observation windows

All windows use complete KST days and exclude deployment day and SG desktop Direct. Do not decide before 20 qualified views unless a correctness or policy defect appears.

| Path | Window | First diagnostic |
|---|---|---|
| Chinese zodiac pair | 2026-08-31~09-06 | guide CTA-user 8%; app view→start 25%; start→open 50%; open→related 8% |
| Spanish Blood Type | 2026-08-31~09-06 | guide CTA-user 8%; app view→first open 25%; open→related 8% |
| IQ puzzle | 2026-08-31~09-06 | start 35%; start→complete 50%; complete→related 8% |
| Japanese reaction time | 2026-08-31~09-06 | setup use/CTA 8%; linked start 50%; completion 50% |
| Chinese HSP, thought check, habit tracker | 2026-08-31~09-06 | qualified use/CTA 8%; linked action 50% |
| Japanese/French Brain Type | 2026-08-31~09-06 | profile→CTA 8%; linked start 50% |
| Spanish typing speed/dopamine break | 2026-08-31~09-06 | guide→CTA 8%; linked view→start 50% |
| Chinese browser games, US doomscrolling | 2026-08-31~09-06 | qualified tool use/click 8% |
| Korean Future Self, Palworld, MBTI | 2026-08-31~09-06 | CTA/copy/use 8%; linked completion where applicable 50% |
| K-pop, HSP reset, Culture Signal | 2026-08-30~09-05 | bridge/CTA 8%; first decision 2026-09-06 |

## Decision rule

- Revenue milestone: rolling 7 complete-day AdSense total `≥ $1.40` only.
- `<7` complete days: `TOO_EARLY`; insufficient discovery/exposure: `DISCOVERY_HOLD`.
- `PROMOTE`: Organic 20/day, engagement 55%, bridge 8%, attributable RPM `$1+` 중 durable signal 2개 이상.
- 그 외 `ITERATE`. `SUPPRESS`: 14일, Organic 20·content view 20 이상에서 discovery/conversion 실패가 반복될 때만.
- Page-unattributed AdSense RPM은 proxy일 뿐 URL 승격·억제 근거가 아니다.
- 다음 신규 트렌드 후보는 GTA VI 공식정보 글이지만 기존 관찰창 첫 판정 전에는 공개하지 않는다.
