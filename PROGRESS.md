# DopaBrain current status

Updated: 2026-10-31 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-31)**: Policy violations 0 (`{}`). 오늘 **$0.04** (진행 중), 어제 **$0.06**, 7일 누적 **$0.64** (일평균 $0.091, 성장세 지속), 이달 누적 **$1.87**.
- GA4 실측 (최근 7일 / 28일): Organic Search 67 세션 중 54 Engaged (참여율 **80.6%**, 총 참여시간 **5,189s**, 세션당 평균 **96s**).
- 고체류 핵심 진입면: 2048 Coach 8,362s(28d), Future Self 1,686s, Stress Check 1,479s, HSP Test 1,115s, HSP Workplace Guide 758s.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 188s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-31) — 상세 설계: `docs/STRATEGY.md`

- **P0 고체류 블로그 CRO 스크리너 확장 배포 (완료)**: HSP 자가진단(12개어), 정서적 소진(12개어), 스트레스 반응 관리(12개어), 직장인 HSP(KO), 회피형 애착(ZH/KO) 총 39개 가이드에 30초 반응형 스크리너 탑재.
- **P1 전 서브모듈 퍼널 무결성 & E-E-A-T 전수 정제 (완료)**: 119개 서브모듈 정지 링크 0건 및 12개 언어 목적지(`?lang=`) 정합성 복원.
- **P2 색인 인벤토리 및 IndexNow 실시간 전송 (완료)**: 1,534개 URL 정합성 0 issue 유지 및 갱신 40개 URL IndexNow 200 OK 제출.

## Latest release: 39-Guide Interactive CRO Screeners & Funnel Alignment (2026-10-31)

- **GA4 실측 상위 트래픽 39개 가이드 30초 반응형 CRO 스크리너 전면 배포 (`portal 0ce72ea`)**:
  - `am-i-highly-sensitive-person-signs.html` (12개 국어): 아론 박사 DOES 4대 차원 체크리스트 및 `/hsp-test/`, `/hsp-test/reset.html` 연계.
  - `emotional-exhaustion-signs-recovery.html` (12개 국어): 인지 안개·정서 무감각·비회복 수면·사회적 회피 4대 소진 트리아지 및 `/stress-check/`, `/portal/tools/burnout-stress-differential.html` 연계.
  - `stress-management-techniques-guide.html` (12개 국어): 자율신경 반응(투쟁-도피·얼어붙기·코르티솔 수면·인내심 포화) 스크리너 및 `/stress-check/`, `/portal/tools/grounding-exercise.html` 연계.
  - `ko/hsp-workplace-survival-guide.html`, `zh/avoidant-attachment-dating-guide.html`, `ko/avoidant-attachment-dating-patterns.html`: 직장 감각 소진 및 회피형 비활성화 방어기제 30초 스크리너 배포.
  - `tools/brain-game-workout.html`: 90일 `dateModified` 초과 이슈 해소 및 사이트맵 동기화.
  - Playwright 390x844 모바일 뷰포트 오버플로 0px, 터치 타깃 $\ge 44\text{px}$, 반응형 실시간 상태 변화(`0 -> 1 -> 4`) 13개 대표 경로 전수 검증 통과 (`npm run verify:screener`).
  - 사이트맵(`portal/sitemap.xml`, `blog/sitemap.xml`) 40개 URL `lastmod: 2026-10-31` 갱신 및 IndexNow 일괄 제출 (HTTP 200 OK).
- **시스템 건전성 & 무결성 가드 6/6 전원 통과**:
  - `health-guard`: AdSense OAuth & 계약, 색인 인벤토리(1,534개 0 issue), 시크릿 스캔, 문서 예산, 12개 언어 Playwright ALL PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
