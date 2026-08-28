# DopaBrain Current State

Updated: 2026-08-28

이 문서는 현재 상태와 다음 판단만 유지한다. 이전 세션 전문은 Git 이력에 있으며, 반복 가능한 절차는 `dopabrain-growth-ops` Skill로 이동했다.

## Current objective

하루 `$1`를 목표로 유효한 KR/US 트래픽을 늘린다. 기존 도구는 전환 레이어로 유지하고, 영화·밈·게임 등 트렌드 콘텐츠는 독립 측정되는 유입 레이어로 시험한다.

## Production portfolio

| Tier | Paths | Role |
|---|---|---|
| Primary | Stress Check, HSP Test, 2048 Coach | 홈 첫 행동과 핵심 전환 |
| Support | Brain Type, IQ Test, K-pop Role Roster | 검증된 보조 수요 |
| Archive | Portal | 기존 사용자를 위한 보존 경로 |
| Pilot | Culture Signal | 트렌드 검색 유입과 도구 전환 검증 |
| Suppressed | 나머지 앱·콘텐츠 | 라이브 유지, 홈·집중 사이트맵 제외 |

## Data baseline

2026-08-28 점검 기준:

- 최근 7일 AdSense: `$0.76`, 1,531 pageviews, Page RPM `$0.49`.
- SG desktop scan을 제외한 유효 RPM은 약 `$0.91`; KR RPM은 약 `$3.21`.
- 현재 효율이면 `$1/day`에 유효 PV 약 1,100/day, KR 수준이면 약 300/day가 필요하다.
- Organic은 주간 175 sessions로 정체했고 Google Organic은 1 session뿐이다.
- 집중 사이트맵은 신규 문화 글 1개를 추가해 43 unique URLs가 된다.

## Current release

- 루트 홈은 3개 primary와 6개 focused picks만 노출한다.
- 12개 언어, PWA, 메타데이터, sitemap/robots를 집중 전략에 맞췄다.
- 미사용 country rail, stats, app directory, app grid, personalization 코드를 제거했다.
- 구조화 데이터는 화면에 실제 노출되는 WebSite, Organization, CollectionPage, ItemList만 기술한다.
- skip link가 실제 `main#main-content`를 가리키도록 수정했다.
- 루트 HTML은 약 55.8KB에서 40.6KB로 축소했다.
- runtime 검증은 `file://` false failure를 막기 위해 로컬 HTTP 서버를 사용한다.
- 세션·분석·배포의 재사용 절차는 전역 `dopabrain-growth-ops` Skill로 분리했다.
- Brain Type의 가짜 평점·가짜 이용자 수·가짜 분포 통계와 스캔 표현을 제거하고 실제 가중 선택 방식을 공개했다.
- 첫 Culture Signal로 오딧세이·스파이더맨 글을 만들고 홈에서 `root_trend_click`으로 분리 측정한다.

## Verification state

- `npm run verify:root`: 12 locales × mobile/desktop 24회 + 핵심 링크 9개.
- `npm run verify:root:mutations`: 정상 기준과 7개 의도적 결함 탐지.
- `npm run verify:brain-trust`: 신뢰·schema·hreflang 기준과 5개 변이 탐지.
- `npm run harness`: 포털 locale, 정적 품질, 분석 이벤트, runtime smoke.
- `npm run harness:runtime`: focused portfolio 6개 runtime smoke.
- Stress/HSP 앱 전용 suite는 이전 릴리스에서 전 항목 통과.

## Open operations

- AdSense 주소 PIN 미인증 지급 보류는 계정에서 수동 처리해야 한다.
- Culture Signal은 7일 단위로 색인, organic landing, 도구 bridge CTR, 국가 RPM을 확인한다.
- 명확한 증거 없이 suppressed 페이지를 홈이나 sitemap으로 복귀시키지 않는다.

## Next review

1. 신규 문화 글의 색인과 `root_trend_click → content_view → content_*_click`을 확인한다.
2. 7일 내 유효 organic 20/day, engagement 55%, 도구 bridge CTR 8%, 유효 RPM `$1` 중 몇 개를 달성했는지 본다.
3. 2개 이상 달성하면 게임/밈 문화 신호를 한 편 추가하고, 아니면 제목·내부 링크 또는 주제를 교체한다.
4. 트래픽 급증은 scan/bot 가능성을 먼저 배제한다.
