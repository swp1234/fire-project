# Validation Standard

검증은 정상 실행뿐 아니라 같은 종류의 의도적 결함을 실패시키는지까지 확인한다.

## Layers

| Layer | Evidence |
|---|---|
| Static | JSON, locale, canonical/hreflang, schema |
| Runtime | browser/page/console error 없음 |
| Behavior | 실제 클릭·완료와 정확한 event params |
| Integration | 내부 목적지 응답과 공통 자산 연결 |
| Layout/a11y | 44px, overflow 0, landmark, keyboard |
| Mutation | broken route/event/layout/stat을 탐지 |
| Production | 배포 URL에서 같은 기준 통과 |

grep은 존재만, screenshot은 모양만 증명한다. 행동·연결·계측을 대신하지 않는다.

## Focused gates

```powershell
npm run verify:root
npm run verify:root:mutations
npm run verify:brain-trust
npm run verify:brain-training-bridge
npm run verify:2048-ad-policy
npm run verify:zh-2048-guide
npm run verify:culture-choice
npm run verify:cross-promo-touch
npm run verify:culture-review
npm run verify:indexing-inventory
npm run verify:tracked-secrets
npm run verify:adsense-contract
npm run verify:focused-auto-ads
npm run verify:stress-plan
npm run verify:stress-core
npm run verify:fake-unlock-gates
npm run verify:rule-based-labels
npm run verify:iq-completion-reset
npm run verify:ko-emotion-action-path
npm run verify:en-shadow-reflection
npm run verify:fr-attachment-reflection
npm run verify:hsp-reset-funnel
npm run verify:sensory-reset
npm run verify:en-hsp-coping
npm run verify:kpop-role-roster
npm run verify:future-self-funnel
npm run verify:doomscrolling-bridge
npm run verify:zh-browser-games
npm run verify:zh-free-games-controls
npm run verify:es-dopamine-break
npm run verify:es-typing-speed
npm run verify:zh-habit-tracker
npm run verify:ja-brain-type
npm run verify:zh-cognitive-distortions
npm run verify:fr-cognitive-distortions
npm run verify:es-cognitive-distortions
npm run verify:ko-psychology-picker
npm run verify:zh-hsp-guide
npm run verify:ja-reaction-time
npm run verify:ja-minesweeper-path
npm run verify:fr-minesweeper-path
npm run verify:id-lottery-random-path
npm run verify:zh-block-puzzle-path
npm run verify:fr-dev-quiz-path
npm run verify:en-past-life-path
npm run verify:kst-date
npm run verify:blog-generator-interaction -- --spec scripts/specs/trend-odyssey-spiderman-ko.json
npm run harness
npm run harness:runtime
```

- Root: 12 locales × mobile/desktop, 9개 목적지, schema, 44px/overflow, root events; route·locale·event·layout·runtime 변이.
- Brain Type: 실제 scoring·제한 고지, schema, 13 hreflang, 중복 page view 제거, 선택·결과·공유 URL 비전송, 성공한 공유만 기록한다. 프랑스어 가이드의 공개 규칙·좌우뇌 신화 경계·직접 경로·50%/500ms 노출·sitemap/index 연결을 포함해 10개 변이로 검증한다.
- Brain training bridge: 구현으로 확인한 10개 기능, 4 quick/7 article/4 follow-up 경로, 정확한 surface·slug 이벤트, 효능·의료·허위 광고 주장 제거를 검증한다.
- 2048 ad policy: 실제 mobile touch/desktop keyboard 이동·일반 undo, Auto Ads loader 하나, 공식 natural-break/reward 호출, 가짜 보상·수동 slot·허위 impression 부재를 검증한다.
- Culture choice: pointer/keyboard 선택, CTA/share, `content_*` 공통·선택 params, no fake stats/ad-in-interaction, schema; 대응 변이.
- Cross-promo: mobile sticky target 44px와 overflow 0; touch geometry 변이.
- Culture review: 순수 evidence 판정과 13개 in-memory 변이. 얇은 표본·전역 수치·URL 불일치가 승격/억제를 만들지 못하며 외부 계정을 변경하지 않는다.
- Blog generator: 잘못된 interaction spec 거부, 임시 생성물의 2선택·분기 CTA·공유 이벤트 순서·mobile overflow·sticky 억제를 검증한다.
- AdSense: Auto Ads 구현 경로는 하나만 허용하고 관리형 loader는 Google script 요청까지 확인한다. `data-ad-slot="auto"`, 수동 unit/push, DOM 기반 `content_ad_impression`은 거부하며 GA 이벤트는 유료 노출 증거가 아니다. Google 공식 H5 `adBreak/adConfig` 초기화 shim만 전용 공용 모듈에서 예외로 허용한다. 제출 sitemap의 현재 unique URL과 연결된 local JS도 같은 계약을 따르고 strict indexing inventory에서 이슈 0건이어야 한다.
- GSC sitemap submission: `npm run verify:gsc-submit-sitemaps` must reject missing robots declarations, non-XML/empty/external sitemap content and unapproved feed paths before credentials are loaded. The live queue is fixed to the three DopaBrain focused sitemaps, requires system CA verification and the official `webmasters` write scope, and must never print credentials or access tokens. A real submission is successful only when Search Console reports a new `lastSubmitted`/`lastDownloaded`, matching row counts and zero warnings/errors; immediate indexed counts are not a pass/fail signal.
- IndexNow submission: only explicitly supplied, newly changed clean DopaBrain canonical URLs may be sent. The verifier must reject absent/external/query/hash/duplicate URLs, and the live path must prove the public key, direct 200 HTML response, noindex absence and canonical equality before posting. Never expand a submission from the sitemap or retry unchanged URLs; HTTP 200/202 proves receipt or pending key validation, not crawl, indexing, ranking or revenue.
- Search trust: 제출 URL의 `aggregateRating`은 화면에 보이는 실제 자사 리뷰 수집 근거가 없으면 high-risk로 실패한다. 메타 description은 실제 `<meta>` 태그에서 읽고 누락·빈 값·160자 초과를 통과시키지 않는다.
- Fake unlocks: Blood Type과 MBTI Love 상세 해석은 광고 countdown·가짜 premium modal 없이 1초 안에 열려야 한다. 12 locale 소스와 모바일 runtime에서 AI/ad-gate 금칙어·overflow·page error를 검증한다.
- Rule-based labels: IQ와 Zodiac 상세 화면은 미리 작성된 규칙 기반 메모임을 명시하고 AI·광고 잠금으로 표시하지 않아야 한다. IQ 점수는 `정답 수 / 10 × 100`과 정확히 일치하고 85–145 변환·속도 보너스·등급·인구 백분위가 없어야 한다. 12개 locale의 JSON-실제 DOM 정확 일치, UTF-8 치환 문자 부재, Zodiac 로더의 번역 초기화 대기, 모바일 결과 흐름, IQ 10번 문항 직후 완료 동작을 함께 검증한다.
- HSP reset funnel: 결과 바로 아래의 reset primary 하나, map·fabricated percentile/rating/types·manual ads 부재, 12 locale·i18n fallback·service worker를 확인한다. `sensory_reset_cta_view`는 CTA가 실제 50% 교차할 때 exact-once여야 하며 query·telemetry에 선택값이나 결과값을 노출하지 않는다. 연결된 12 locale 가이드도 Auto Ads loader 하나와 합성 광고 이벤트 0건을 검증한다.
- Stress core: preserve the 15-question search identity and all 12 locale result renders while keeping answers, totals, categories and display bands out of URL/analytics. The result plan action must precede detail, qualify at 50% for 500 ms, deduplicate start/click events, retain exactly two related choices, and use a scoped success-only service worker. Percentage gauges, result image/share surfaces, generic cross-promo, duplicate recommendation rails, synthetic ad events and manual ads are forbidden. Require 16 mutations plus local/live 390/1440px completion, the Chinese/French/Spanish auto-start source families, and the three Doomscroll attribution sources.
- Daily Tarot: 허위 이용량·평점·AI 주장·가짜 광고 대기창·수동 광고가 없고, ES 자동 카드 뽑기에서 심화 성찰이 즉시 열리며 `daily_tarot_reflection_view`가 exact-once인지 검증한다.
- Blog focus: 2026-06-01~08-28 Organic Search 2세션 이상 또는 sitemap 포함 글만 indexable로 두고, 나머지는 `noindex,follow`인지 확인한다. redirect는 건드리지 않으며 indexable keep 글 174개는 Auto Ads 계약을 통과해야 한다. retained redirect 1개는 광고 검증에서 제외한다. 전체 blog HTML은 수동 unit/push/static ad surface와 합성 `content_ad_impression`이 없어야 하고, cleanup 멱등성·검색 메타/가시 본문 보존·모든 inline script 컴파일을 검증한다.
- K-pop: 가이드 FAQ·공식 출처 4개·2개 전환 경로, 로스터 12 locale 핵심 현지화+EN fallback·exact-once 이벤트·개인정보 비전송, EN/KO 테스트의 실패 복구·접근성·공유·SW, 43개 도구 카탈로그의 순서·URL·이름을 390/1440px과 52개 결함 변이로 검증한다.
- Future Self: 12 locales, query-language priority, linked Korean auto-start, source allowlist, answer/result privacy, successful-share telemetry, service-worker assets, qualified 50%/500ms guide exposure, CTA click, completion, and 15 adversarial mutations.
- English Future Self guide: preserve the observed search identity while presenting the destination as an eight-scene fictional reflection, not AI or an individual forecast. Require the published `8 choices × 2 theme points = 16` rule and fixed tie order, two source-attributed English auto-start CTAs, two direct research sources with visible study limits, one Auto Ads loader, private stage-only telemetry, catalog/sitemap parity, 13 mutations and local/live 390/1440px completion. In live qualification, an Auto Ads layout shift before 500 ms must cancel the exposure; the browser gate should let the layout settle, re-centre the surface and then require one continuous exact-once exposure rather than weakening the threshold.
- Doomscrolling: unsupported health claims, schema, four direct sources, private 60-second reset, qualified exposure, exact-once use, CTA click, and the Stress Check destination are enforced with 13 mutations and 390/1440px journeys.
- Chinese browser games: unsupported rankings/ratings/ad claims are forbidden; nine Chinese query routes, four static quick cards, private 3/10/20-minute picker, qualified exposure, exact-once use, click attribution, and the 2048 destination are enforced with 13 mutations and 390/1440px journeys.
- Chinese free games: five fixed Chinese-language destinations must match their local locale/query support and be filterable as 3 keyboard/mouse or 5 touch entries. The page forbids ranking/effect claims, hidden schema, manual ads, synthetic paid-impression telemetry and generic cross-promo; it requires visible browser/cache/ad boundaries, one Auto Ads loader, private exact-once filter use, destination-slug click attribution, focused sitemap/catalog parity, 13 mutations and local/live 390/1440px journeys. Live qualification must keep the panel centered during Auto Ads layout shifts while preserving 50% continuous visibility for 500ms.
- Spanish dopamine break: literal detox/reset and unsupported medical claims, fabricated usage/rating/AI proof, fake ad gates, duration telemetry, and cross-origin cache writes are forbidden. Four direct sources, private qualified guide interactions, the linked Spanish 10-minute preset, localized completion/abort, exact-once funnel events, successful-share attribution, 12 locale bundles, and 21 mutations are enforced at 390/1440px.
- Spanish typing speed: the guide formula, three duration routes, qualified CTA exposure, four focused destinations, Spanish word/sentence prompts, attempted-word accuracy, linked entry without auto-start, private view/start/complete/share events, success-only sharing, local cache scope, 12 locale bundles, and 19 mutations are enforced at 390/1440px. Fabricated ratings, percentiles, grades, reward-inflated WPM, fake ad surfaces, duplicate page views, and result telemetry are forbidden.
- Chinese habit tracker: 66-day research boundary, three direct sources, one-action 7-day route, qualified exposure, four destinations, localized prefill without auto-save, escaped user text, local-only habit records, private exact-once create/complete/share stages, success-only sharing, 12 locale bundles, and 16 mutations are enforced at 390/1440px. Fabricated ratings, AI/ad gates, manual ad units, synthetic engagement, habit counts/goals/completion telemetry, and unsafe service-worker fallbacks are forbidden.
- Japanese Brain Type: the guide must frame the result as a fixed summary of 10 choices, not a scan, intelligence measure, left/right-brain diagnosis, talent, or career assessment. One direct primary source, four focused routes, 50%/500ms qualified exposure, exact CTA attribution, Japanese auto-start, and answer/result privacy are enforced with 10 mutations and 390/1440px linked journeys.
- Chinese cognitive distortions / Stress Check: 15 visible patterns, three direct health-authority sources, a private three-step check, qualified exposure, four focused routes, Chinese auto-start, all 15 nested-control clicks, exact completion, 12 locale trust copy, and answer/result privacy are enforced with 10 mutations and 390/1440px linked journeys. Fabricated usage, validated-scale/AI-ad claims, hidden FAQ, manual ad surfaces, synthetic engagement, sensitive URL/event values, and retired result save/share surfaces are forbidden.
- French cognitive distortions: 15 visible teaching categories, three direct NHS/WHO sources, a private three-step check, 50%/500ms qualified exposure, four related routes, French Stress Check auto-start and selection privacy are enforced with 10 mutations at 390/1440px. Live verification must validate the exact canonical URL and derive the origin before appending routes so a duplicated path cannot masquerade as page overflow. Hidden FAQ, deterministic thought claims, manual ads and synthetic telemetry are forbidden.
- Spanish cognitive distortions: 15 visible teaching categories, three direct NHS/WHO sources, a private three-step check, 50%/500ms qualified exposure, four related routes, focused sitemap inclusion, Spanish Stress Check auto-start and selection privacy are enforced with 11 mutations at 390/1440px. Hidden FAQ, deterministic thought claims, manual ads and synthetic telemetry are forbidden.
- Korean psychology picker: five purpose choices and five visible measurement boundaries must route to Stress Check, HSP, Brain Type, IQ Puzzle, and K-pop Position without transmitting the selected purpose in the use event. Two direct APA/WHO sources, continuous 50%/500ms qualified exposure that survives layout shifts, four focused guides, focused sitemap inclusion, exact-once stage telemetry, 44px targets, and 13 mutations are enforced locally and live at 390/1440px. Popularity/ranking claims, diagnosis/accuracy claims, hidden FAQ, manual ads, and synthetic telemetry are forbidden.
- Chinese HSP guide: SPS is presented as a research framework rather than a diagnosis, validated clinical scale, fixed prevalence, or deterministic brain signature. Four observation prompts, three direct research sources, 50%/500ms qualified exposure, four focused routes, Chinese HSP auto-start, five-category completion, and choice/result privacy are enforced with 10 mutations and 390/1440px linked journeys. The HSP app remains an independently observed dependency and is not changed by this guide-only gate.
- English HSP coping guide: preserve repeat English Organic intent while removing fixed prevalence, universal brain-pattern and treatment claims. Require three direct bounded sources, two identical Reset routes, a focused two-card rail with central allowlisting and `data-content-surface="quick_rail"`, continuous 50%/500ms qualification, private exact-once events, one managed Auto Ads loader, catalog/sitemap parity, 14 mutations, and local/live 390/1440px Reset generation plus Map loading.
- Japanese reaction time: the guide and app must describe browser timing as a device/browser-dependent measurement, not a diagnostic score or population ranking. Three direct timing sources, a private three-item preflight, qualified exposure, four focused routes, query-priority Japanese rendering, linked auto-start, five-round completion, and result privacy are enforced with 10 mutations and 390/1440px linked journeys. Fabricated ratings, grades, percentiles, AI/career interpretation, fake ad gates, and timing/result telemetry are forbidden.
- Indonesian 6/45 random path: the guide must show the exact `C(45, 6) = 8,145,060` boundary, reject prediction and winning claims, and link twice to the allowlisted Indonesian app entry. The app must use Web Crypto with rejection sampling, keep generated/saved numbers out of analytics and shared URLs, store only explicit favorites locally, remove simulated winning/AI/frequency claims, and expose exact-once view/generate/save/share/related stages. Eighteen mutations, all 12 languages, focused sitemap/catalog parity, scoped PWA caching, and local/live 390/1440px journeys are required.
- Chinese game catalog / Block Puzzle: the guide must expose four verified Chinese-language choices without ranking or cognitive-effect claims and keep Block Puzzle as the primary route selected by observed CTA users. The game must remove fake ratings/FAQ/ad surfaces, legacy synthetic events and score-changing rewards; keep score, level and board state out of analytics and share URLs; use only the game-over natural break for H5 interstitial requests; and scope manifest/service-worker behavior to `/block-puzzle/`. Eighteen mutations, all 12 languages, exact-once view/start/complete/successful-share/related events and local/live 390/1440px journeys are required.
- French developer guide / Developer Quiz: preserve the guide's direct quiz intent while removing ranking, fake proof, hidden FAQ, fake ad gates and synthetic events from the destination. The app must expose exactly ten reproducible programming questions in all 12 supported shell languages; keep answers, score and result out of analytics and shared URLs; use only an official post-completion ad request; and scope manifest/service-worker behavior to `/dev-quiz/`. Sixteen mutations plus local/live 390/1440px completion, language, query-cleanup and exact-once stage checks are required.
- English past-life birthday guide / story journey: the guide must distinguish repeatable birthday digit arithmetic from evidentiary claims, expose nine neutral writing prompts and route twice to the fictional six-scene activity. Preserve the destination's six-scene/eight-role engine while removing fabricated rating/participant proof, hidden FAQ, manual ads, synthetic events, compatibility/percentile outputs and result-bearing analytics/share. Publish the 3/2/1 rule, keep choices/result local, scope PWA behavior to `/past-life/`, and require 18 mutations plus local/live 390/1440px journeys across all 12 languages.
- Chinese MBTI city guide / city match: preserve the guide's observed Bing intent while presenting the 16 cities as fictional editorial mappings rather than validated psychology or relocation advice. The app must expose exactly eight travel questions, publish the four-axis/tie rule, remove fabricated participation/rating/rarity proof, hidden FAQ, manual ads, synthetic engagement and stale completion calls, and keep answers, scores and result out of analytics. Require 18 mutations, all 12 languages, app-scoped PWA behavior, completion-break ads only, and local/live 390/1440px guide-to-completion journeys.
- Korean emotion-regulation guide / action planner: preserve the observed Korean Bing search identity while replacing efficacy percentages, deterministic brain/mechanism claims, hidden FAQ, EQ measurement CTAs, synthetic ad telemetry and generic cross-promo with a bounded now-next-later action path. Require two identical allowlisted planner CTAs, three direct sources, four valid quick cards, query/hash sanitization before analytics, stage-only telemetry, selection/result privacy, 13 mutations, all 12 planner languages and local/live 390/1440px linked journeys. The existing Chinese rejection-sensitivity source must remain valid.
- Indonesian emotion-regulation guide / action planner: preserve the repeat engaged Organic search identity while removing exact efficacy, brain-structure, treatment-timing, hidden FAQ, synthetic ad and generic cross-promo claims. Require two identical allowlisted Indonesian planner CTAs, WHO/NHS source boundaries, four valid related cards, full Indonesian shell and generated action output, pre-analytics query/hash sanitization, stage-only telemetry, selection/result privacy, 15 mutations and local/live 390/1440px linked journeys. Existing Korean and Chinese planner sources must remain valid.
- German emotion-regulation guide / action planner: preserve new Germany Ecosia/Bing acquisition while removing brain-structure, medication-equivalence, fixed timing, hidden English FAQ, synthetic ad, raw-link and generic cross-promo claims. Require two identical allowlisted German planner CTAs, WHO and German federal health-portal boundaries, four valid related cards, continuous 35%/500ms qualified exposure, full German shell and generated action output, pre-analytics query/hash sanitization, stage-only private telemetry, 16 mutations and local/live 390/1440px linked journeys. Existing Korean, Chinese and Indonesian sources must remain valid.
- French attachment guide / response reflection: preserve the observed French attachment-style query while treating the four labels as shorthand over continuous anxiety and avoidance dimensions, not diagnosis, stable identity, childhood cause or relationship prediction. Require the ECR-R 36-item/two-dimension boundary, two identical allowlisted French auto-start CTAs, two focused internal cards, one Auto Ads loader, continuous 35%/500ms qualified exposure, stage-only private telemetry, language-only neutral sharing, service-worker cache rotation, 13 mutations and local/live mobile/desktop guide-to-ten-scenario completion. Existing English and Clarity entry sources and all 12 locale completions must remain valid.
- Japanese Minesweeper: the guide must teach only the two count-derived rules and distinguish DopaBrain's first-click safe zone, hint behavior and random-board uncertainty from universal rules. Two Japanese CTAs, four related cards, 50%/500ms exposure, private example use, one Auto Ads path, allowlisted query entry, exact-once view/start/complete, success-gated share, 12 locale feedback, app-local PWA scope and 16 mutations are required at 390/1440px locally and live. Ratings, hidden FAQ, manual ads, duplicate page views and board/result/time telemetry are forbidden.
- French Minesweeper: preserve the observed French search identity while replacing expert/mastery, solve-every-board, cognitive-effect and daily-training claims with the same two count-derived rules and explicit DopaBrain implementation boundaries. Require two French source-attributed CTAs, four valid related cards, private mini-exercise events, 50%/500ms exposure, catalog/sitemap parity, pre-analytics query sanitization, exact-once guide/game stages, success-gated sharing, a measured French return route and 15 mutations at 390/1440px locally and live. The Japanese source and 12-language game contract must remain valid.
- IQ completion reset: exactly ten fixed puzzles must use only numbers and symbols while the shell, prompts, limits, and result explanation render in all 12 locales. No timer, fabricated ranking, manual ad, answer event, result payload, broad service-worker cache, or damaged locale text is allowed. Ten mutations, 12 mobile locale completions, one Korean desktop completion, success-gated sharing, private related-click attribution, and 390/1440px layout are required.
- English attachment reflection: the ECR-R 36-item/two-dimension boundary must be visible before start and at result. The 10-scenario activity may summarize the current run but cannot claim a diagnosis, stable type, childhood cause, percentile, rating, or prediction. Thirteen mutations, all 12 locale completions, the guide-to-auto-start journey, two focused internal cards, source normalization, language-only sharing, Auto Ads-only loading, and answer/result privacy are required.
- English shadow reflection: the guide must frame Jung's shadow as an analytical-psychology concept rather than a diagnosis or detectable hidden type. The app publishes its one-point-per-answer-direction formula, keeps answers/counts/result names private, removes fabricated archetypes and percentiles, and requires 14 mutations, all 12 locale completions, guide-qualified exposure, linked auto-start, neutral sharing, mobile layout, and locale-load recovery.
- Harness: portal locale·정적 품질·위 검증기·analytics smoke·focused runtime을 첫 실패에서 중단한다. 브라우저 검증 서버는 차단 포트를 피하는 20000–45000 범위만 사용한다.

콘텐츠 기본 검증은 필요 시 다음을 함께 실행한다.

```powershell
node scripts/verify-blog-pages.js --file projects/portal/blog/ko/odyssey-spider-man-identity-reset-2026.html --expect-auto 1 --expect-events content_view,content_test_click,content_cta_click,content_related_click
```

## Decision evidence

`culture-signal-review.js` 입력은 complete-day window, GA4 자체 pagePath와 event contract, GA4 Organic·events, GSC discovery, AdSense totals/segments를 포함한다.

- pagePath/event 불일치와 현재일 포함은 `TRACKING_BLOCKED`.
- 0분모는 `null`; `NaN/Infinity`를 허용하지 않는다.
- SG Desktop은 유효 RPM 분모에서 제외한다.
- 대상 URL과 일치하는 page attribution이 없는 RPM은 proxy이며 승격 pass가 아니다.
- `SUPPRESS`에도 Organic 20 sessions와 content view 20의 최소 표본이 모두 필요하다.
- business 상태(`PROMOTE`, `ITERATE`, `SUPPRESS`)와 검증 실패를 구분한다.

보고서는 기본적으로 `.codex-artifacts/culture-signal-review/<date>/`에 두고, 전략이 바뀔 때만 `memory/data-check-log.md`를 갱신한다.

## Production and failures

하위 저장소와 루트 pointer push 후 실행한다.

```powershell
node scripts/verify-root-focus.js https://dopabrain.com --no-screenshot
node scripts/verify-hsp-reset-funnel.js --production
node scripts/verify-kpop-role-roster.js --production
```

실제 sitemap/robots 응답과 변경 경로를 재검증한다. 반복 재시도로 실패를 숨기지 말고 코드·fixture·도구 결함을 구분하며, 재발 가능한 도구 문제만 `memory/failures.jsonl`에 남긴다.
