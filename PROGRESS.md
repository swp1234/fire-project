# DopaBrain Current State

Updated: 2026-08-21

이 문서는 현재 상태와 다음 판단만 유지한다. 이전 세션 전문은 Git 이력에 있으며, 반복 가능한 절차는 `dopabrain-growth-ops` Skill로 이동했다.

## Current objective

수익 정체를 페이지 증산으로 해결하지 않는다. 검색 참여와 국가별 수익성이 확인된 소수 경로에 홈, 내부 링크, 크롤링, 측정을 집중한다.

## Production portfolio

| Tier | Paths | Role |
|---|---|---|
| Primary | Stress Check, HSP Test, 2048 Coach | 홈 첫 행동과 핵심 전환 |
| Support | Brain Type, IQ Test, K-pop Role Roster | 검증된 보조 수요 |
| Archive | Portal | 기존 사용자를 위한 보존 경로 |
| Suppressed | 나머지 앱·콘텐츠 | 라이브 유지, 홈·집중 사이트맵 제외 |

## Data baseline

2026-08-20 점검 기준:

- AdSense 최근 30일: 약 `$2.97`, 14,682 pageviews, Page RPM 약 `$0.20`.
- 2026-08-06의 7,137 pageviews / `$0.24`는 저가치 스캔성 급증으로 판정.
- GA4 Singapore desktop Direct 9,909 sessions는 제품 수요 지표로 사용하지 않는다.
- Organic은 Stress, HSP, 2048 및 일부 두뇌 콘텐츠에서 상대적으로 유효했다.
- GSC 대량 제출 구조는 색인 성과가 없어서 집중 큐로 교체했다.
- 집중 사이트맵: 루트 18 + 포털 7 + 블로그 17 = 42 unique URLs.

## Current release

- 루트 홈은 3개 primary와 6개 focused picks만 노출한다.
- 12개 언어, PWA, 메타데이터, sitemap/robots를 집중 전략에 맞췄다.
- 미사용 country rail, stats, app directory, app grid, personalization 코드를 제거했다.
- 구조화 데이터는 화면에 실제 노출되는 WebSite, Organization, CollectionPage, ItemList만 기술한다.
- skip link가 실제 `main#main-content`를 가리키도록 수정했다.
- 루트 HTML은 약 55.8KB에서 40.6KB로 축소했다.
- runtime 검증은 `file://` false failure를 막기 위해 로컬 HTTP 서버를 사용한다.
- 세션·분석·배포의 재사용 절차는 전역 `dopabrain-growth-ops` Skill로 분리했다.

## Verification state

- `npm run verify:root`: 12 locales × mobile/desktop 24회 + 핵심 링크 8개.
- `npm run verify:root:mutations`: 정상 기준과 6개 의도적 결함 탐지.
- `npm run harness`: 포털 locale, 정적 품질, 분석 이벤트, runtime smoke.
- `npm run harness:runtime`: focused portfolio 6개 runtime smoke.
- Stress/HSP 앱 전용 suite는 이전 릴리스에서 전 항목 통과.

## Open operations

- AdSense 주소 PIN 미인증 지급 보류는 계정에서 수동 처리해야 한다.
- 새 포트폴리오는 2~4주 관찰 후 Organic landing, CTA events, country RPM, GSC indexing으로 재판정한다.
- 명확한 증거 없이 suppressed 페이지를 홈이나 sitemap으로 복귀시키지 않는다.

## Next review

1. 검색엔진이 42 URL 큐를 다시 처리했는지 확인한다.
2. `root_view → root_cta_click/root_pick_click` 비율을 언어·국가별로 비교한다.
3. primary 경로별 수익과 참여가 없으면 순서를 조정하거나 한 경로를 교체한다.
4. 트래픽 급증은 scan/bot 가능성을 먼저 배제한다.
