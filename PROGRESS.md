# DopaBrain Current State

Updated: 2026-08-28

현재 상태와 다음 판단만 기록한다. 이력은 Git, 반복 절차는 `dopabrain-growth-ops` Skill이 기준이다.

## Objective

하루 `$1`를 목표로 KR/US의 유효 검색 유입을 늘린다. 트렌드 콘텐츠가 유입을 만들고 테스트·도구·게임이 행동과 재방문으로 연결되는지 한 편씩 검증한다.

## Portfolio

| Tier | Paths | Role |
|---|---|---|
| Primary | Stress Check, HSP Test, 2048 Coach | 홈 첫 행동·핵심 전환 |
| Support | Brain Type, IQ Test, K-pop Role Roster | 검증된 보조 수요 |
| Pilot | Culture Signal | 트렌드 유입·도구 bridge 검증 |
| Archive | Portal | 기존 자산 보존 |
| Suppressed | 나머지 앱·콘텐츠 | 라이브 유지, 홈·집중 sitemap 제외 |

## Baseline

- 2026-08-21~27 AdSense: `$0.76`, 1,531 pageviews, Page RPM `$0.49`.
- SG Desktop scan 제외 유효 RPM 약 `$0.91`; KR RPM 약 `$3.21`.
- `$1/day`에는 현 효율 약 1,100 유효 PV/day, KR 수준 약 300 PV/day가 필요하다.
- 주간 Organic 175 sessions, Google Organic 1 session. 집중 sitemap은 43 unique URLs다.
- AdSense 주소 PIN 미인증 지급 보류가 남아 있다.

## Current release

- 홈은 3 primary, 6 focused picks, Culture Signal 1개, archive 1개만 노출한다.
- 첫 Culture Signal은 오딧세이·스파이더맨 해설, 전용 OG 이미지, 귀환/리셋 선택 카드, Brain Type·2048 bridge를 제공한다.
- 선택 카드는 진단·인기 통계·내부 광고 없이 `content_choice_*`와 CTA/share를 측정한다. 해당 글에서는 중복 sticky cross-promo를 끈다.
- `root_trend_click → content_view → content_test_click/content_cta_click`을 핵심 체인으로 사용하며 `content_related_click`은 bridge 분자에서 제외한다.
- Brain Type의 허위 평점·이용자·분포·스캔 표현은 제거했고 실제 가중 선택 방식과 제한을 공개했다.
- 12개 언어, canonical/hreflang, schema, sitemap/robots와 모바일 44px·overflow 기준을 유지한다.

## Verification

- Root: 12 locales × 2 viewports, 핵심 링크 9개, 결함 변이 7종.
- Brain Type: 신뢰·schema·hreflang 및 허위 표현 변이 5종.
- Culture choice: mobile pointer/desktop keyboard, 정확한 event params·CTA/share·schema 및 변이 12종.
- Cross-promo: mobile 44px·overflow와 결함 변이 검증.
- Culture review: 판정 상태, 최소 표본, URL 귀속, SG scan 제외, proxy 비승격, path/event 오류 변이 13종.
- Blog generator: 같은 spec에서 접근 가능한 2선택 UI·분기 CTA·공유 계측·sticky 억제를 재생성.
- `npm run harness`와 focused 6개 runtime smoke가 통합 회귀 기준이다.

## Next decision

`scripts/culture-signal-review.js`가 spec과 읽기 전용 evidence로 `review.json`·경량 `review.md`를 생성한다.

- 7 complete days 미만: `TOO_EARLY`; 유입·색인 증거 없음: `DISCOVERY_HOLD`.
- Organic 20/day, engagement 55%, bridge 8%, page-attributed RPM `$1` 중 신뢰 가능한 2개 이상: `PROMOTE`.
- 그 외는 `ITERATE`; `SUPPRESS`는 14일 이후 Organic 20·content view 20 표본과 신뢰 가능한 실패가 함께 있을 때만 허용한다.
- AdSense 도메인 RPM은 proxy로만 표시하고 승격 점수에 넣지 않는다. `SUPPRESS`는 홍보·집중 discovery만 제거하고 URL은 유지한다.
