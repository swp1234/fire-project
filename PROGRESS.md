# DopaBrain current status

Updated: 2026-11-05 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-05)**: Policy violations 0 (`{}`). 어제(11-04) **$0.02**, 7일 누적 **$0.39**, 30일 누적 **$1.73**. Active View CPM 기반 0클릭 수익 지속 및 전환 퍼널 정렬.
- GA4 실측: Organic Search 61 세션/7d, 핵심 고체류 진입면 (2048 Coach 414s, HSP Guide 300s, Dopamine Detox 231s, Future Self 130s, Stress Check 85s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-05) — 상세 설계: `docs/STRATEGY.md`

- **P0 다국어 가이드 및 고체류 진입면 CTA·라우트 정합성 완결 (완료)**: `portal/blog` 6개 언어권 가이드 내 손상된 CTA 목적지(정지 앱 오분류 및 이중 앰퍼샌드 오염)를 정상 활성 도구 및 정식 게임 경로로 100% 복구 완료 (`portal c5a0aa8`).
- **P1 스키마 일관성 및 비가시적 FAQPage 페널티 제거 (완료)**: `future-self/index.html` 및 `portal/tools` 비가시적 FAQ 스키마 제거, DOM 일치 검증 (`future-self 862fb70`).
- **P2 전체 20여 개 핵심 검증 스위트 100% 녹색 패스 (완료)**: `verify:es-dopamine-break`, `verify:es-typing-speed`, `verify:zh-habit-tracker`, `verify:ja-brain-type`, `verify:zh-cognitive-distortions`, `verify:fr-cognitive-distortions`, `verify:es-cognitive-distortions`, `verify:ko-psychology-picker`, `verify:zh-hsp-guide`, `verify:ja-reaction-time`, `verify:ja/fr-minesweeper-path`, `verify:id-lottery-random-path`, `verify:zh-block-puzzle-path`, `verify:fr-dev-quiz-path`, `verify:en-past-life-path`, `verify:zh-mbti-city-path`, `verify:doomscrolling-bridge`, `verify:zh-browser-games`, `verify:zh-free-games-controls`, `verify:stress-core` 전원 PASS.
- **P3 헬스 가드 전체 배터리 ALL PASS (완료)**: AdSense OAuth Keepalive, Auto Ads 단일 로더, 사이트맵/색인 인벤토리, 비밀값 탐지, 문서 예산, 루트 도메인 12개 언어 Playwright E2E 검증 통과.

## Latest release: Multilingual Funnel Repair, Schema Compliance & Comprehensive Verifier Battery PASS (`portal c5a0aa8`, `future-self 862fb70`)

- **다국어 가이드 전환 퍼널 전면 복구**: 과거 일괄 치환 과정에서 오염되었던 블로그 가이드(EN, ES, FR, ZH) 내 2차 CTA 및 퀵레일 목적지를 복구하여 해외 트래픽 이탈 차단.
- **비가시적 스키마 페널티 제거**: DOM에 FAQ가 없는 페이지의 비가시적 `FAQPage` 스키마를 정리하여 구글 리치 리절트 가이드라인 준수.
- **20개 이상 종합 검증 스크립트 전원 통과**: 돌출된 드리프트 정렬 및 Playwright 브라우저 런타임(390px, 1440px) 100% 무오류 확인.
- **헬스 가드 배터리 무결점 검증**: `skill:health-guard` 전 항목 ALL PASS 확인 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
