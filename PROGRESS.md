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

- **P0 고체류 블로그 CRO 스크리너 배포 (완료)**: Doomscrolling, 도파민 디톡스, HSP, 번아웃 가이드에 30초 반응형 스크리너 배포.
- **P1 전 서브모듈 퍼널 무결성 & E-E-A-T 전수 정제 (완료)**: 119개 서브모듈 정지 링크 소탕 및 12개 언어 목적지 정합성 복원.
- **P2 색인 인벤토리 및 IndexNow 실시간 전송 (완료)**: 1,534개 URL 정합성 0 issue 유지 및 갱신 아티클 200 OK 제출.

## Latest release: Interactive CRO Screeners & Comprehensive Funnel Sanitization (2026-10-29)

- **핵심 상위 가이드 인터랙티브 30초 CRO 스크리너 전면 배포 (`portal 20ee155`)**:
  - `doom-scrolling-mental-health-effects.html`: 12개 언어 30s 스크롤 트리거 & 도파민 리셋 평가기 배포 및 22개 CTA 앵커 불일치 일괄 수정.
  - `dopamine-detox-guide-reset-brain.html`: EN, ES, DE 30s 신경계 과부하 스크리너 탑재 및 `/hsp-test/`, `/stress-check/` 고효율 연계.
  - `hsp-coping-strategies-highly-sensitive.html`: EN, ES, FR, KO, JA, ZH 30s 실시간 감각 과부하 트리아지 배포.
  - `sensory-overload-hsp-coping.html`: EN, KO, ES, DE, FR, JA, ZH 7개 국어 30s 감각 과부하 스크리너 신규 배포.
  - `burnout-recovery-guide.html`: EN, KO, ES, DE 4개 국어 30s 만성 번아웃 vs 급성 스트레스 감별 스크리너 배포.
  - `dissociation-symptoms-grounding.html`: 10개 언어 4F 트라우마 목적지 불일치 해소 및 한국어 외래 링크(`/en/`) 정상화.
  - Playwright 모바일 390x844 가로 오버플로 0px, 터치 타깃 $\ge 44\text{px}$, 반응형 실시간 업데이트 전수 검증 통과.
  - 사이트맵(`portal/sitemap.xml`, `blog/sitemap.xml`) 18개 URL `lastmod: 2026-10-29` 동기화 및 IndexNow 일괄 제출 (HTTP 200 OK).
- **시스템 건전성 & 무결성 가드 6/6 전원 통과**:
  - `health-guard`: AdSense OAuth & 계약, 색인 인벤토리(1,534개 0 issue), 시크릿 스캔, 문서 예산, 12개 언어 Playwright ALL PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
