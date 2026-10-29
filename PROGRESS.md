# DopaBrain current status

Updated: 2026-10-29 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-29)**: Policy violations 0 (`{}`). 오늘 **$0.08** (진행 중), 7일 누적 **$0.59** (US RPM **$6.32**), 이달 누적 **$1.76**.
- 수익 실측: 미국(Tier 1) 고단가 eCPM 및 In-article($0.20), In-page($0.13), Anchor($0.13), Vignette($0.12) 균형 수익화.
- 유기적 성장: `/stress-check/` 23 Organic 세션(1,107s), DE HSP 10 Organic 세션(1,042s), ZH 2048/도파민 고체류 안착.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 188s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-29) — 상세 설계: `docs/STRATEGY.md`

- **P0 다국어 고체류 블로그 CRO 위젯 & 퍼널 연계 (완료)**: DE HSP 및 ZH/PT/KO 도파민 가이드 30s 스크리너 배포.
- **P1 모바일 UX 전수 준수 & 서브모듈 무결성 (완료)**: 119개 전 서브모듈 44px 터치/0px 오버플로 0 issue PASS.
- **P2 색인 인벤토리 및 IndexNow 실시간 전송 (완료)**: 1,533개 URL 정합성 0 issue 및 4개 URL 200 OK 통지.

## Latest release: Multilingual High-Dwell Triage Screeners & Trust Compliance (2026-10-29)

- **고체류 블로그 CRO 스크리너 배포 (`portal 30f7104`)**:
  - `blog/de/hsp-coping-strategies-highly-sensitive.html`: 30s 감각 과부하 트리아지 (`/hsp-test/reset.html?lang=de`).
  - `blog/zh/dopamine-detox-guide-reset-brain.html`, `pt`, `ko`: 30s 도파민 과자극 스크리너 탑재 및 비임상 용어 정제.
  - `blog/zh/2048-strategy-guide.html`: 30s 2048 전술 스크리너 탑재 및 오표기 링크(`/puzzle-2048/coach.html?lang=zh`) 전면 정정.
  - `blog/sitemap.xml`: lastmod 2026-10-29 동기화 및 IndexNow 실시간 전송 200 OK.
- **신뢰성 산출물 및 모바일 UX 검증 (`soul-age 6361325`, `color-palette cb82149`)**:
  - `soul-age`: 조작된 백분위(`Math.random()`) 및 가짜 소셜 배지 영구 제거, JSON-LD 스키마 및 ?lang= 언어 유지 보장.
  - `color-palette`: 모달 textarea 및 기사 링크 44px+ 터치 타깃 보정, 119/119 서브모듈 0 issue PASS.
  - `health-guard`: 6/6 전수 통과 (Auto Ads 단일 로더, 1,533 URL 인벤토리 0 issue, 12개 언어 Playwright PASS).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
