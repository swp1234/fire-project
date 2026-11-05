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
- **P2 전체 핵심 검증 스위트 100% 녹색 패스 (완료)**: `verify-boundary-script`, `verify-boundary-library`, `verify-brain-game-workout`, `verify-emotion-regulation-planner`, `verify:es-dopamine-break`, `verify:es-typing-speed`, `verify:zh-habit-tracker`, `verify:ja-brain-type`, `verify:zh-cognitive-distortions`, `verify:fr-cognitive-distortions`, `verify:es-cognitive-distortions`, `verify:ko-psychology-picker`, `verify:zh-hsp-guide`, `verify:ja-reaction-time`, `verify:ja/fr-minesweeper-path`, `verify:id-lottery-random-path`, `verify:zh-block-puzzle-path`, `verify:fr-dev-quiz-path`, `verify:en-past-life-path`, `verify:zh-mbti-city-path`, `verify:doomscrolling-bridge`, `verify:zh-browser-games`, `verify:zh-free-games-controls`, `verify:stress-core` 전원 PASS.
- **P3 헬스 가드 & 퍼널 브릿지 전체 ALL PASS (완료)**: AdSense OAuth Keepalive, Auto Ads 단일 로더, 사이트맵/색인 인벤토리(1,555 URLs), 비밀값 0건, 문서 예산, 4,034개 파일 퍼널 감사 무결점 확인.

## Latest release: Legacy Tool Verifier Alignment & Full Health-Guard Battery PASS (`portal edc89d4`, `future-self 862fb70`)

- **레거시 도구 검증 하네스 정합성 완료**: Auto Ads 단일 로더 정책 및 포털 카탈로그 런타임 쿼리와 어긋나 있던 4종 도구 검증기(`boundary-script`, `boundary-library`, `brain-game-workout`, `emotion-regulation-planner`) 정렬 및 PASS.
- **인도네시아 감정 조절 가이드 크로스프로모 연동**: `portal/blog/id/emotional-regulation-techniques.html`에 크로스프로모 스크립트 연결하여 동남아 트래픽의 인터랙티브 플래너 전환 경로 확보.
- **24개 이상 종합 검증 스크립트 전원 통과**: 브라우저 런타임(390px, 1440px) 100% 무오류 확인.
- **헬스 가드 & 퍼널 브릿지 완결**: `skill:health-guard` 전 항목 및 `skill:funnel-bridge` ALL PASS 확인 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
