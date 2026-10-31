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

## Latest release: 15 Portal Tools & 17 MBTI Type Hub Matrix (`portal 32992e0`, `root-domain 654844e`)

- **포털 15대 인터랙티브 도구 모바일 UX & 사이트맵 완결 (`portal 32992e0`)**:
  - 팔월드 5대 도구(`breeding-notebook`, `server-settings`, `field-guide`, `base-planner`, `server-troubleshooter`): 네비/푸터/필터 26~42px &rarr; 44px 준수, 수동 ad-wrap 제거, 사이트맵 등재 및 IndexNow 200 OK.
  - 상위 10대 심리/생산성 도구(`brain-game-workout`, `past-life-studio`, `kpop-role-roster` 등): 모바일 0px 오버플로 및 $\ge 44\text{px}$ ALL PASS.
- **MBTI 16개 유형별 상세 페이지 & 허브 모바일 UX 최적화 (`portal 32992e0`, `root-domain 654844e`)**:
  - `type-page-enhancer.css`: 16개 유형 페이지 skip-link, breadcrumb, footer 터치 타깃 15~21px &rarr; 44px 준수.
  - 사이트맵 동기화 및 IndexNow 17개 URL(허브 + 16개 유형) 200 OK 제출.
  - 영구 회귀 테스트 `scripts/verify-mbti-hub.js` (`npm run verify:mbti`) 신설 및 17개 전 라우트 ALL PASS.
- **Playwright 모바일 E2E & 건전성 가드 전원 통과**:
  - `verify:high-dwell`, `verify:mbti`, `verify-portal-tools`: 전원 0px 오버플로 & $\ge 44\text{px}$ ALL PASS.
  - `audit-registry.json`: `portal 32992e0`, `root-domain 654844e` 동기화.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
