# DopaBrain Current State

Updated: 2026-08-29

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

- 2026-08-22~28 AdSense: `$0.75`, 1,645 pageviews, 828 impressions, 23 clicks, Page RPM 약 `$0.46`.
- SG Desktop scan 제외 유효 RPM 약 `$0.91`; KR RPM 약 `$3.21`.
- `$1/day`에는 현 효율 약 1,100 유효 PV/day, KR 수준 약 300 PV/day가 필요하다.
- 주간 Organic 175 sessions, Google Organic 1 session. 집중 sitemap은 43 unique URLs다.
- AdSense 주소 PIN 미인증 지급 보류가 남아 있다.

## Current release

- 홈은 3 primary, 6 focused picks, Culture Signal 1개, archive 1개만 노출한다. Culture Signal은 첫 viewport 안의 compact rail로 올렸고 2026-08-29를 새 launch date로 삼는다.
- 첫 Culture Signal은 오딧세이·스파이더맨 해설, 전용 OG 이미지, 귀환/리셋 선택 카드, Brain Type·2048 bridge를 제공한다.
- 선택 카드는 진단·인기 통계·내부 광고 없이 `content_choice_*`와 CTA/share를 측정한다. 해당 글에서는 중복 sticky cross-promo를 끈다.
- `root_trend_click → content_view → content_test_click/content_cta_click`을 핵심 체인으로 사용하며 `content_related_click`은 bridge 분자에서 제외한다.
- Brain Type의 허위 평점·이용자·분포·스캔 표현은 제거했고 실제 가중 선택 방식과 제한을 공개했다.
- KR 두뇌훈련 글은 근거 없는 효능 주장을 실제 10개 기능 설명으로 교체하고 Brain Workout·2048 Coach·Brain Type 전환을 정확히 계측한다. 변경 전 28일 search-like landing은 16 sessions, 최근 7일은 7 sessions였고 CTA click은 0이었다.
- ZH 2048 가이드는 화면 FAQ와 schema를 일치시키고 가짜 광고 unit·노출 이벤트를 제거했다. 2048 게임은 일반 undo를 무료 동작으로 복구하고 공식 H5 natural-break/reward 흐름만 유지한다.
- EN K-pop 포지션 가이드는 고정 서열·아티스트 포지션 단정을 제거하고 2026-08-29 공식 프로필 확인 근거, 로스터·테스트 전환 2개, 정확한 surface/slug 계측만 남겼다. 변경 전 28일 Organic landing은 16 sessions, bridge는 37 users view 대비 1 user click이었다.
- K-pop 로스터와 포지션 테스트는 Auto Ads loader 하나만 유지한다. 테스트의 가짜 2,400명·평점·희귀도·광고 대기창·AI 잠금·아티스트 고정 매핑과 비지원 locale 10개를 제거해 경량화했다. 로스터→테스트는 지원 언어로 정규화하면서 자동 시작·surface를 보존한다.
- 포지션 테스트는 EN/KO만 지원하고 번역 실패 시 정적 EN으로 복구한다. 답변 전환 잠금, 확대 허용, 질문·결과 focus/공지, 재현 가능한 동점 규칙, 실제 성공한 공유만의 계측, 정적 same-origin SW cache를 적용했다.
- HSP 결과는 진단·유형 판정이 아닌 감각 선호 점검으로 정리했다. 결과 바로 아래에는 5분 감각 리셋 하나만 primary로 두고 map, fabricated percentile·rating·types, manual ads를 제거했다.
- HSP 선택값·결과값은 URL이나 telemetry로 보내지 않으며 개인정보 고지와 실제 동작을 맞췄다. 12 locale, EN fallback과 same-origin service worker cache를 유지하고, 연결된 12 locale 가이드의 수동 광고와 합성 광고 노출 이벤트도 제거했다.
- 광고 계약은 Auto Ads loader 하나만 허용한다. `data-ad-slot="auto"`, 임의 manual unit/push, DOM 기반 유료 노출 주장은 금지한다.
- 도구 카탈로그의 화면 43개와 ItemList 33개 불일치를 43개 동일 순서·URL·이름으로 맞췄다. 12개 언어, canonical/hreflang, schema, sitemap/robots와 모바일 44px·overflow 기준을 유지한다.

## Verification

- Root: 12 locales × 2 viewports, 핵심 링크 9개, 결함 변이 14종.
- Brain Type: 신뢰·schema·hreflang 및 허위 표현 변이 5종.
- Culture choice: mobile pointer/desktop keyboard, 정확한 event params·CTA/share·schema 및 변이 12종.
- Cross-promo: mobile 44px·overflow와 결함 변이 검증.
- Culture review: 판정 상태, 최소 표본, URL 귀속, SG scan 제외, proxy 비승격, path/event 오류 변이 13종.
- Blog generator: 같은 spec에서 접근 가능한 2선택 UI·분기 CTA·공유 계측·sticky 억제를 재생성.
- Brain training 20종, ZH 2048 guide 20종, 2048 ad policy 22종, AdSense contract 9종 결함 변이를 탐지한다.
- K-pop 경로는 로스터 12 locale의 핵심 현지화+EN fallback, 2개 로스터 여정, 4개 bridge, EN/KO 퀴즈, 카탈로그 12 locale × 2 viewport, 43개 DOM/schema 순서·URL·이름, 개인정보·공유·SW와 결함 변이 52종을 검증한다.
- HSP는 12 locale·i18n fallback·service worker, 결과→리셋 계층, 실제 50% intersection exact-once 노출, 개인정보·Auto Ads 계약과 결함 변이를 검증한다.
- `npm run harness`와 focused 6개 runtime smoke가 통합 회귀 기준이다. 브라우저 검증 서버는 안전 포트 범위를 사용해 OS 임시 포트의 `ERR_UNSAFE_PORT` 오탐을 막는다.

## Next decision

`scripts/culture-signal-review.js`가 spec과 읽기 전용 evidence로 `review.json`·경량 `review.md`를 생성한다.

- 2026-08-29 현재 0 complete days라 첫 파일럿은 `TOO_EARLY`; 두 번째 URL은 공개하지 않는다. 관찰 구간은 8월 30일~9월 5일, 첫 판정일은 9월 6일이다.
- KR 두뇌훈련 bridge 변경도 같은 기간을 별도 기준선으로 관찰한다. Culture Signal 성과와 합산하지 않는다.
- K-pop 변경도 8월 30일~9월 5일을 별도 관찰한다. SG desktop Direct와 배포일을 제외하고 `content_view → quick/CTA/bridge click → roster_generate 또는 kpop_position_result_view`를 본다. 최소 20 bridge users 전에는 결론내리지 않고 click user rate 8%를 1차 기준으로 삼는다.
- HSP의 기존 reset/map view 각 41 users·click 0은 결과 화면이 숨겨진 render 시점에 발생해 유효 기준선이 아니다. 8월 29일 배포일을 제외한 8월 30일~9월 5일 KST를 새 관찰창으로 삼아 `result_view → sensory_reset_cta_view → sensory_reset_cta_click → sensory_reset_view → sensory_reset_generate`를 본다. CTA view는 실제 50% intersection에서 exact-once로 기록하며, 실제 노출 20 users 전에는 결론내리지 않고 click-user rate 8%를 1차 목표로 둔다.
- 다음 트렌드 글 후보는 GTA VI 공식정보 글이 1순위, S26 FE 구매검토 글은 후순위다. 두 spec·상호작용 검증·오리지널 OG draft는 준비됐고 첫 7일 판정 뒤 한 편만 공개한다.

- 7 complete days 미만: `TOO_EARLY`; 유입·색인 증거 없음: `DISCOVERY_HOLD`.
- Organic 20/day, engagement 55%, bridge 8%, page-attributed RPM `$1` 중 신뢰 가능한 2개 이상: `PROMOTE`.
- 그 외는 `ITERATE`; `SUPPRESS`는 14일 이후 Organic 20·content view 20 표본과 신뢰 가능한 실패가 함께 있을 때만 허용한다.
- AdSense 도메인 RPM은 proxy로만 표시하고 승격 점수에 넣지 않는다. `SUPPRESS`는 홍보·집중 discovery만 제거하고 URL은 유지한다.
- 수동 운영 잔여는 AdSense 주소 PIN과 과거 Git 이력의 API key 폐기·회전이다. 현재 tree의 추적 파일 secret scan은 통과하며 값은 문서에 기록하지 않는다.
- 제출 sitemap의 43개 URL은 indexing inventory 이슈 0건이다. 기존 14개 가이드의 invalid manual-ad markup·수동 push·DOM 기반 가짜 노출 이벤트를 제거했고, strict inventory가 재발 시 실패한다.
