# DopaBrain current status

Updated: 2026-10-29 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-29)**: Policy violations 0 (`{}`). 오늘 **$0.09** (진행 중), 7일 누적 **$0.59** (US RPM **$6.32**), 이달 누적 **$1.76**.
- 수익 실측: 미국(Tier 1) 고단가 eCPM 및 In-article($0.20), In-page($0.13), Anchor($0.13), Vignette($0.12) 균형 수익화.
- 유기적 성장: `/stress-check/` 23 Organic 세션(1,107s), DE HSP 10 Organic 세션(1,042s), ZH 2048/도파민 고체류 안착.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 188s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-29) — 상세 설계: `docs/STRATEGY.md`

- **P0 고체류 블로그 CRO 스크리너 배포 (완료)**: EN 혈액형 & ZH 반추 사고 가이드 30s 실시간 스크리너 배포.
- **P1 전 서브모듈 퍼널 무결성 & E-E-A-T 전수 정제 (완료)**: 119개 서브모듈 내 정지 앱 링크 14개 전수 제거 및 언어 보존.
- **P2 색인 인벤토리 및 IndexNow 실시간 전송 (완료)**: 1,534개 URL 정합성 0 issue 및 갱신 URL 200 OK 통지.

## Latest release: Interactive CRO Screeners & Complete Funnel Sanitization (2026-10-29)

- **고체류 블로그 CRO 스크리너 배포 (`portal 03d72c1`)**:
  - `blood-type-personality-guide.html`: 30s 실시간 혈액형 케미스트리 계산기 탑재 & `brain-type` 경로 복구.
  - `rumination-repetitive-thinking-stop.html`: 30s 반추 루프 패턴 식별 및 5-4-3-2-1 감각 착륙/스트레스 평가 연계.
  - `blog/sitemap.xml` lastmod 2026-10-29 동기화 및 IndexNow 200 OK 제출 (색인 인벤토리 1,534개 0 issue PASS).
- **119개 전 서브모듈 중단 링크 전수 소탕 (14개 -> 0개) & 언어 보존 강제**:
  - 활성 앱 내 정지된 앱(`daily-tarot`, `shadow-work`, `zodiac-match`, `dark-core`, `numerology`) 링크 전수 제거.
  - 대상: `aura-score`, `love-frequency`, `stress-type`, `name-match`, `soul-age`, `animal-personality`, `villain-origin`, `affirmation`, `fortune-cookie`, `seollal-greetings`, `valentine`.
  - `preserveLanguageLinks()` 전면 주입하여 모든 아웃바운드 카드에서 `?lang=` 파라미터 유실 방지.
  - `love-frequency`: 허위 `50,000+` 카운터 제거 및 결손되었던 `WebApplication` JSON-LD 복원.
  - `audit-funnel.js`: 블로그 및 119개 서브모듈 4,021개 파일 전수 검사로 영구 자동화 (0 issues PASS).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
