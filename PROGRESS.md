# DopaBrain Current State

Updated: 2026-08-30

현재 상태와 다음 판단만 기록한다. 상세 근거는 `memory/data-check-log.md`, 반복 절차는 `dopabrain-growth-ops` Skill, 완료 기준은 `docs/VALIDATION.md`가 기준이다.

## Objective

- 단기 목표: complete KST 7일 수익을 `$0.75`에서 `$1.40`으로 높여 일평균 `$0.20`를 달성한다.
- 장기 목표: `$1/day`.
- 배포일, 당일 부분 데이터, Singapore desktop Direct scan은 판단에서 제외한다.

## Baseline

- 2026-08-23~29 AdSense: `$0.75`, 1,795 pageviews, 827 impressions, 22 clicks, Page RPM `$0.42`.
- 국가별: US `$0.21 / 57 PV / $3.75 RPM`, KR `$0.18 / 103 PV / $1.71 RPM`, CN `$0.19 / 591 PV / $0.32 RPM`.
- 유효 검색 수요와 RPM을 함께 고려해 US/KR 전환을 우선하고, CN은 단일 PV보다 게임 내 다중 페이지 세션을 우선한다.
- 집중 sitemap: 49 unique URLs, strict indexing issues 0.
- 계정 정책 문제는 없고, 주소 PIN 미인증에 따른 지급 보류가 남아 있다.

## Portfolio

| Tier | Paths | Role |
|---|---|---|
| Primary | Stress Check, HSP Test, 2048 Coach | 첫 행동·핵심 전환 |
| Support | Brain Type, IQ Test, K-pop Role Roster | 검증된 보조 수요 |
| Pilot | Culture Signal | 트렌드 유입→도구 bridge 검증 |
| Archive | Portal | 기존 자산 보존 |
| Suppressed | 나머지 저성과 자산 | 라이브 유지, discovery·집중 sitemap 제외 |

## Current release

- Japanese Brain Type: Organic landing `4 → 8`, recent engaged 5/8, but path-wide CTA users were 1/12. The 54 KB guide's unsupported “latest neuroscience,” left/right-brain personality, 80–85% accuracy, and career-fit claims were replaced with a compact 10-choice scoring rule, explicit limits, one direct primary source, and a Japanese auto-start route. Qualified exposure and click attribution are private and exact-once.
- Chinese habit tracker: Organic landing `8 → 9`, recent engaged 4/9, CTA users 0. 78 KB 장문을 7일 단일 행동 경로로 축소하고, 앱의 허위 평점·AI/광고 잠금·수동 광고·합성 engage·개인 습관 수치 telemetry를 제거했다. 연결된 중국어 프리필은 확인 전 저장하지 않으며 첫 생성·완료·성공 공유만 비공개 단계로 기록한다.
- French Brain Type: Organic landing `3 → 8`, recent engaged 5/8. 좌·우뇌 우세·직업 결정 주장을 제거하고 10개 선택의 고정 규칙과 한계를 공개했다. 앱은 중복 page view와 합성 engage, 선택·결과·공유 URL telemetry를 제거하고 실제 성공한 공유만 기록한다.
- Spanish typing speed: Organic landing `0 → 5`, engaged 5/5; recent path-wide CTA users were 5/9, but the destination had no start/complete signal. The 44 KB guide is now a focused three-duration route with a visible formula. The app adds Spanish prompts and private view/start/complete/share events while removing fabricated rating, percentile, grade, reward-inflated WPM, duplicate page views, and root-scope cache errors.
- Spanish dopamine break: Organic landing `1 → 9`, engaged 7. 가이드를 근거 있는 화면 휴식 안내와 10분 타이머 bridge로 축소했다. 목적지 앱의 허위 50,000+ 이용량·평점·AI 분석·깨진 가짜 광고 대기창을 제거하고 ES 진입, 완료/중단 현지화, 비공개 exact-once 퍼널, same-origin cache를 복구했다.
- Chinese browser games: Organic `3 → 11`, engaged `3 → 8`. 근거 없는 TOP-10/평점 대신 9개 중국어 게임 경로와 비공개 3/10/20분 선택기로 교체했다.
- US doomscrolling: Organic `4 → 6`, US `1 → 4`. 과장된 건강 주장을 제거하고 60초 interrupt에서 Stress Check로 직접 연결했다.
- Korean Future Self: Organic `6 → 9`, engaged 2/9. 예측·평점 주장을 제거하고 규칙 공개형 한국어 직접 시작 경로로 교체했다.
- Palworld, MBTI compatibility, K-pop, HSP reset은 기존 URL의 모바일 계층·중복 intent·목적지 신뢰·노출 이벤트 결함을 수정한 뒤 별도 관찰 중이다.

## Deployment and verification

- Portal `64817ad`, Pages run `33302837640`: success. Live Japanese guide→qualified view→CTA→Japanese auto-start passed at 390/1440px with no answer/result telemetry.
- Habit Tracker `bb83e74`, Pages build `1183494033`; Portal `0ff35b5`, Pages build `1183494802`: success. Live guide→ZH prefill→confirm→complete→successful share, privacy source, and sitemap passed at 390/1440px.
- Brain Type `bb174a3`, Pages build `1183464962`; Portal `072ceba`, Pages build `1183465900`: success. Live 12 locales × mobile/desktop, guide CTA/related telemetry, privacy source, and sitemap passed.
- Typing Speed `f1ed220`, Pages run `33300169297`; Portal `8c5144f`, Pages run `33300203355`: success. Live guide→Spanish prompt→start→complete→successful share passed at 390/1440px.
- Detox Timer `7941186`, Pages run `33299235567`: success.
- Portal `4f1d455`, Pages run `33299275506`: success.
- Spanish production journey: 390/1440px overflow 0, 44px targets, qualified guide view/use, exact CTA, linked ES 10-minute start, localized complete/abort, app view/start/outcome exact-once, live source/sitemap passed.
- Full local regression: `logs/harness-workflow/2026-08-30T08-50-25-794Z.md`; focused runtime 6/6, submitted inventory 49/0 issues, Japanese Brain Type mutations 10/10.
- Previous production units: Chinese browser games Portal `5016b6b` / run `33298349084`; doomscrolling Portal `b67323d` / run `33297525976`; Future Self app `cc254c5`, Portal `77c052f`.
- Main gates: `npm run harness -- --skip-analytics`, `npm run verify:ja-brain-type`, `npm run verify:zh-habit-tracker`, `node scripts/indexing-inventory.js --strict`.

## Observation windows

All windows exclude their deployment day and SG desktop Direct. Do not decide before the stated qualified exposure sample.

| Path | Complete KST window | Funnel | First diagnostic |
|---|---|---|---|
| Japanese Brain Type | 2026-08-31~09-06 | `content_view → content_ja_brain_type_view → content_cta_click → test_start → test_complete` | 20 qualified views; click 8%; linked start 50% |
| Chinese habit tracker | 2026-08-31~09-06 | `content_view → content_zh_habit_plan_view → content_cta_click → habit_tracker_view → habit_tracker_quick_form_view → habit_tracker_habit_created → habit_tracker_first_completion` | 20 plan views; click 8%; form→create 50% |
| French Brain Type | 2026-08-31~09-06 | `content_view → content_fr_brain_type_view → content_cta_click → test_start → test_complete` | 20 profile views; click 8%; linked start 50% |
| Spanish typing speed | 2026-08-31~09-06 | `content_view → typing_view → CTA → app_view → start → complete/share` | 20 guide views; click 8%; linked view→start 50% |
| Spanish dopamine break | 2026-08-31~09-06 | `content_view → break_view → break_use/CTA → timer_view → start → complete/abort` | 20 break views; click 8%; linked view→start 50% |
| Chinese browser games | 2026-08-31~09-06 | `content_view → picker_view → picker_use/game_click` | 20 picker views; click 8% |
| US doomscrolling | 2026-08-31~09-06 | `content_view → reset_view → reset_use/CTA → test_start` | 20 reset views; click 8% |
| Korean Future Self | 2026-08-31~09-06 | `content_view → CTA_view → CTA → start → complete` | 20 CTA views; click 8%; completion 50% |
| Palworld | 2026-08-31~09-06 | `tool_view → generator_view → change → copy` | 20 generator views; copy 8% |
| MBTI compatibility | 2026-08-31~09-06 | combined old/new Organic → `compare_view → use/CTA` | 20 compare views |
| K-pop | 2026-08-30~09-05 | `content_view → bridge → roster/result` | 20 bridge users; click 8% |
| HSP reset | 2026-08-30~09-05 | `result → CTA_view → CTA → reset → generate` | 20 real CTA views; click 8% |
| Culture Signal / brain training | 2026-08-30~09-05 | separate path contracts | first decision 2026-09-06 |

Historical synthetic `content_ad_impression`, hidden-render views, stale bridge events, and SG scan traffic are not comparable baselines.

## Decision rule

- Revenue milestone: only a rolling 7 complete-day AdSense total of at least `$1.40` counts.
- `<7` complete days: `TOO_EARLY`; insufficient discovery/exposure: `DISCOVERY_HOLD`.
- `PROMOTE` requires at least two durable signals among Organic 20/day, engagement 55%, bridge 8%, and attributable RPM `$1+`.
- Otherwise `ITERATE`. `SUPPRESS` requires at least 14 days, Organic 20 and content-view 20 samples, plus repeated discovery/conversion failure.
- Page-unattributed AdSense RPM is proxy evidence only and cannot promote or suppress a URL by itself.
- 다음 신규 트렌드 후보는 GTA VI 공식정보 글이다. 기존 관찰창의 첫 판정 전에는 추가 공개하지 않는다.
