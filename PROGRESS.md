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

- **P0 고체류 블로그 CRO 스크리너 확장 배포 (완료)**: 누적 223개 가이드(HSP·소진·스트레스·신경계·감정조절·애착유형·혼란애착·공의존·경계설정·영합Fawn·유기상처·4F트라우마·기능적동결·번아웃vs우울·신체화불안·감정트리거·결정피로 12개어 클러스터)에 30초 반응형 스크리너 탑재.
- **P1 전 서브모듈 퍼널 무결성 & 포털 도구 12개어 Hreflang 최적화 (완료)**: 4,021개 파일 정지 링크 0건, 포털 도구 12개어 hreflang·robots·`?lang=` 완전 보존.
- **P2 색인 인벤토리 및 IndexNow 실시간 전송 (완료)**: 1,534개 URL 정합성 0 issue 유지 및 갱신 URL IndexNow 200 OK 제출.

## Latest release: 10 Portal Interactive Tools UX & 223-Guide CRO Screener Matrix (`portal 35dee8e`)

- **포털 10대 인터랙티브 도구 모바일 UX & 사이트맵 완결 (`portal 35dee8e`)**:
  - `brain-game-workout.html`: 네비게이션, 푸터, 언어 select 터치 규격 25~35px &rarr; 44px 준수.
  - `past-life-story-studio.html`: 네비게이션, 푸터 및 5개 시나리오 선택 드롭다운 25~41px &rarr; 44px 준수, 메타 및 JSON-LD `dateModified: 2026-10-31` 동기화.
  - `kpop-role-roster.html`: 네비/푸터 터치 타깃 44px 준수, `/kpop-position/?lang=` 12개어 보존.
  - `scripts/verify-portal-tools.js`: 10대 포털 도구 390x844 모바일 0px 오버플로 및 $\ge 44\text{px}$ 타깃 전수 ALL PASS.
  - `portal/sitemap.xml`: `past-life-story-studio.html` 신규 색인 등재 및 `brain-game-workout.html` `lastmod: 2026-10-31` 동기화. IndexNow 200 OK 제출.
- **블로그 72개 가이드 30초 반응형 CRO 스크리너 신규 배포**:
  - `boundaries-setting`, `codependency-signs`, `disorganized-attachment`, `functional-freeze`, `emotional-burnout-vs-depression`, `somatic-anxiety` 12개어 전수 배포. 누적 223개 가이드 탑재.
- **Playwright 모바일 E2E 57개 라우트 & 건전성 가드 전원 통과**:
  - `npm run verify:screener`: 57개 대표 라우트 390x844 오버플로 0px, $\ge 44\text{px}$ 타깃, `0->1->4` 반응 ALL PASS.
  - `health-guard` & `funnel-bridge`: 4,021개 파일 정지 링크 0건, 1,535개 색인 0 issue, `audit-registry.json` (`portal 35dee8e`) 동기화.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
