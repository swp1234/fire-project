# DopaBrain current status

Updated: 2026-10-28 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-28)**: Policy violations 0 (`{}`). 오늘 **$0.06** (진행 중), 어제(10-27) **$0.25 (일일 목표 초과 달성, +316%)**, 7일 누적 **$0.55**, 이달 누적 **$1.31**.
- 어제 급증 원인 실측: 미국(Tier 1) 고단가 CPM 입찰 92% 집중 ($0.23, eCPM $9.20), 영문 블로그(체류 73~337s)의 In-article($0.10) 및 Vignette($0.06) 폭증.
- 핵심 대책: 119개 전 서브모듈 44px 터치/0px 오버플로 유지, [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) 준수, AI 검색/진입면 전환 극대화.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 188s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-28) — 상세 설계: `docs/STRATEGY.md`

- **P0 Tier-1 고체류 영문 블로그 CRO 위젯 & 지속 수익화 파이프라인**:
  - 고체류(337초) 영문 아티클 3개에 30초 인터랙티브 스크리너 위젯 및 핵심 도구 퍼널 연계 완료.
  - In-article 광고 Viewability 70%+ 보장 및 자연스러운 Vignette 광고 노출 동선 구축.
  - `dateModified` 및 사이트맵 `<lastmod>` 2026-10-28 정합성 동기화 (1,533개 URL 0 issue PASS).
  - IndexNow 3개 핵심 URL 실시간 핑 전송 완료 (`HTTP 200, ok: true`).
- **P1 자율 개발 실수 방지 및 토큰 낭비 차단**: `memory/audit-registry.json` 기반 119/119 서브모듈 Zero-Token 스킵 유지.

## Latest release: Tier-1 High-Dwell Blog CRO Widgets & Sustained Revenue Expansion (2026-10-28)

- **Tier-1 고체류 영문 블로그 인터랙티브 위젯 탑재 (`portal fe5c6c6`)**:
  - `attachment-styles-4-types-explained.html`: 30초 4-Quadrant 애착 스크리너 위젯 탑재 (`/attachment-style/`).
  - `hsp-coping-strategies-highly-sensitive.html`: 30초 실시간 감각 과부하 트리아지 위젯 탑재 (`/hsp-test/reset.html`, `/hsp-test/`).
  - `grief-stages-healing-guide.html`: 30초 신체 그라운딩 게이지 위젯 탑재 (`/portal/tools/grounding-exercise.html`, `/stress-check/`).
  - 전 위젯 48px 이상 터치 타깃, 모바일 390x844 가로 오버플로 0px, 실시간 점수 피드백 및 GA4 비콘 전송 탑재.
- **검증 및 사이트맵 무결성**:
  - `verify:indexing-inventory`: 1,533개 전체 URL 0 issue PASS (sitemap lastmod 일치).
  - `skill:funnel-bridge`: 3,928개 블로그 파일 정지 링크 0개, 텔레메트리 누수 0개 PASS.
  - `content:verify`: 3개 대상 파일 0px overflow, Auto Ads 단일 로더 계약 100% 준수 PASS.
  - IndexNow: 3개 대상 URL 실시간 통지 100% 완료 (`status: 200, ok: true`).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
