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

## Latest release: MBTI Couple Screener & Universal Trust Sanitization (2026-10-29)

- **고체류 블로그 CRO 스크리너 배포 (`portal d6f258a`)**:
  - `blog/en/mbti-compatibility-guide.html`: 30s 실시간 커플 케미스트리 계산 스크리너 탑재 및 `/mbti-love/?lang=en` 연계.
  - `blog/fr/jeux-entrainement-cerveau-2026.html`: 30s 인지 우선순위 스크리너 탑재 및 10개 게임 카드 맞춤 연결.
  - `blog/sitemap.xml`: lastmod 2026-10-29 등록 및 IndexNow 실시간 통지 200 OK (색인 인벤토리 1,534개 0 issue PASS).
- **8개 서브모듈 신뢰성/E-E-A-T 전수 정제 & 언어 파라미터 보존 (`social-battery`, `ick-factor` 등)**:
  - 조작된 백분위(`Math.random()`), 합성 텔레메트리(`page_engage`), 허위 소셜 카운터 영구 제거 및 정직한 성찰 노트로 전환.
  - 대상: `social-battery 9a0e1bf`, `ick-factor 9ec2125`, `villain-origin 539d9bc`, `villain-type 446a3e2`, `pick-me 3bf016e`, `inner-child-test f9b4e61`, `life-in-numbers 8fa999a`, `mbti-tips 620540f`.
  - `trust-audit`: JS 파일 내 합성 텔레메트리 및 난수 백분위 자동 탐지 규칙 추가 및 119/119 서브모듈 0 issue 검증.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
