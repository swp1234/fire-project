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
npm run verify:hsp-reset-funnel
npm run verify:sensory-reset
npm run verify:kpop-role-roster
npm run verify:kst-date
npm run verify:blog-generator-interaction -- --spec scripts/specs/trend-odyssey-spiderman-ko.json
npm run harness
npm run harness:runtime
```

- Root: 12 locales × mobile/desktop, 9개 목적지, schema, 44px/overflow, root events; route·locale·event·layout·runtime 변이.
- Brain Type: 실제 scoring·제한 고지, schema, 13 hreflang; 허위 수치·평점·분포·고지 제거 변이.
- Brain training bridge: 구현으로 확인한 10개 기능, 4 quick/7 article/4 follow-up 경로, 정확한 surface·slug 이벤트, 효능·의료·허위 광고 주장 제거를 검증한다.
- 2048 ad policy: 실제 mobile touch/desktop keyboard 이동·일반 undo, Auto Ads loader 하나, 공식 natural-break/reward 호출, 가짜 보상·수동 slot·허위 impression 부재를 검증한다.
- Culture choice: pointer/keyboard 선택, CTA/share, `content_*` 공통·선택 params, no fake stats/ad-in-interaction, schema; 대응 변이.
- Cross-promo: mobile sticky target 44px와 overflow 0; touch geometry 변이.
- Culture review: 순수 evidence 판정과 13개 in-memory 변이. 얇은 표본·전역 수치·URL 불일치가 승격/억제를 만들지 못하며 외부 계정을 변경하지 않는다.
- Blog generator: 잘못된 interaction spec 거부, 임시 생성물의 2선택·분기 CTA·공유 이벤트 순서·mobile overflow·sticky 억제를 검증한다.
- AdSense: Auto Ads 구현 경로는 하나만 허용하고 관리형 loader는 Google script 요청까지 확인한다. `data-ad-slot="auto"`, 수동 unit/push, DOM 기반 `content_ad_impression`은 거부하며 GA 이벤트는 유료 노출 증거가 아니다. 제출 sitemap 전체는 strict indexing inventory에서 이슈 0건이어야 한다.
- HSP reset funnel: 결과 바로 아래의 reset primary 하나, map·fabricated percentile/rating/types·manual ads 부재, 12 locale·i18n fallback·service worker를 확인한다. `sensory_reset_cta_view`는 CTA가 실제 50% 교차할 때 exact-once여야 하며 query·telemetry에 선택값이나 결과값을 노출하지 않는다. 연결된 12 locale 가이드도 Auto Ads loader 하나와 합성 광고 이벤트 0건을 검증한다.
- Daily Tarot: 허위 이용량·평점·AI 주장·가짜 광고 대기창·수동 광고가 없고, ES 자동 카드 뽑기에서 심화 성찰이 즉시 열리며 `daily_tarot_reflection_view`가 exact-once인지 검증한다.
- Blog focus: 2026-06-01~08-28 Organic Search 2세션 이상 또는 sitemap 포함 글만 indexable로 두고, 나머지는 `noindex,follow`인지 확인한다. redirect는 건드리지 않으며 keep 글 175개는 Auto Ads 계약을 통과해야 한다. 전체 blog HTML은 합성 `content_ad_impression`이 없어야 하고 모든 inline script가 컴파일되어야 한다.
- K-pop: 가이드 FAQ·공식 출처 4개·2개 전환 경로, 로스터 12 locale 핵심 현지화+EN fallback·exact-once 이벤트·개인정보 비전송, EN/KO 테스트의 실패 복구·접근성·공유·SW, 43개 도구 카탈로그의 순서·URL·이름을 390/1440px과 52개 결함 변이로 검증한다.
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
