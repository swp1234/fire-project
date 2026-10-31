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

## Latest release: Future Self & Stress Check Mobile UX & High-Dwell Harness (2026-10-31)

- **Future Self E2E 사용자 여정 모바일 UX 최적화 (`future-self 93eeeeb`)**:
  - `css/style.css`: 결과 화면 `.back-link` 터치 타깃 18px &rarr; 44px 준수 (`min-height: 44px; inline-flex`).
  - `index.html`: 메타 및 JSON-LD `dateModified: 2026-10-31` 갱신. 12개 국어 동적 전환 및 크로스 프로모션 파라미터(`?lang=`) 완전 보존 확인.
- **Stress Check Plan 터치 타깃 및 사이트맵 최적화 (`stress-check 4db8190`, `root-domain 3973998`)**:
  - `css/plan.css`: evidence 및 footer 외부/내부 링크 터치 타깃 $\ge 44\text{px}$ 준수.
  - `plan.html` 및 `root-domain/sitemap.xml`: `dateModified: 2026-10-31`, `lastmod: 2026-10-31` 동기화.
- **영구 고체류 모바일 검증 하네스 신설 (`npm run verify:high-dwell`)**:
  - Playwright 390x844 모바일 E2E: Future Self 전체 여정(인식 &rarr; 8장면 선택 &rarr; 결과 화면 &rarr; 추천 링크) 및 Stress Check 4개 페이지(메인/플랜/스크립트/라이브러리) 0px 오버플로 및 $\ge 44\text{px}$ 타깃 ALL PASS.
  - IndexNow: 2개 canonical URL 즉시 전송 (HTTP 200 OK).
- **시스템 건전성 & 무결성 가드 전원 통과**:
  - `health-guard`: AdSense OAuth($0.64 7일/정책 0건), 계약(Auto Ads 단일/0 manual), 색인(1,534개 0 issue), 시크릿 스캔, 문서 예산 통과.
  - `audit-registry.json`: future-self(`93eeeeb`), stress-check(`4db8190`), root-domain(`3973998`) 전수 동기화.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
