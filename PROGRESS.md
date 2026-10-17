# DopaBrain current status

Updated: 2026-10-17 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-17)**: Policy violations 0 (`{}`). 10-17 **$0.05** (반등 지속, 10-16 $0.01 대비 5배). 7일 누적 **$0.26**, 30일 누적 **$1.82**.
- 핵심 대책: 직접 유입 정지 앱 및 10개 유틸리티 도구의 관련 링크를 활성 수익화 도구(`pomodoro-timer`, `dark-core`, `stress-check`, `future-self`, `emotional-age`)로 전면 전환하여 유입 트래픽 누수 원천 차단.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-17) — 상세 설계: `docs/STRATEGY.md`

- **P0 수익화 트래픽 누수 차단 및 활성 도구 라우팅**:
  - 10개 유틸리티 앱의 정지 스텁(`qr-generator`) 링크를 활성 Auto Ads 앱(`pomodoro-timer`)으로 전면 전환.
  - 직접 유입 정지 심리테스트(`inner-child-test`, `villain-type`)의 관련 그리드를 활성 수익화 앱으로 전환 및 서브모듈 푸시 완료.
- **P1 고유지율 허브(`/puzzle-2048/coach.html`) & 진입면 수익 연결**:
  - GA4 1위 체류 페이지(2048 Coach)에서 다국어 가이드 및 게임 허브로의 유기적 수익 순환 유지.

## Latest release: Multilingual Avoidant Attachment Dating Guides Clean Sweep (2026-10-17)

- Submodules: `projects/portal` (`1e78c17`).
- Monetization & Routing:
  - 4개 핵심 애착/연애 가이드(`blog/en/avoidant-attachment-dating-patterns.html`, `blog/ko/avoidant-attachment-dating-patterns.html`, `blog/zh/avoidant-attachment-dating-guide.html`, `blog/es/avoidant-attachment-dating-guide.html`):
    - 퀵 레일, 인트로 CTA, 관련 리소스 내 데드 링크(`/iq-test/`) 및 정지 앱(`/animal-personality/`) 링크를 활성 Auto Ads 앱(`/attachment-style/?lang=...`, `/stress-check/?lang=...`, `/stress-check/reset.html?lang=...`, `/future-self/?lang=...`, `/hsp-test/?lang=...`, `/puzzle-2048/coach.html?lang=...`)으로 전면 전환.
    - 스페인어/한국어 문서 내 영문 라벨 오염 전면 해소.
- Mobile & Ad Quality:
  - Playwright 기준 390x844 모바일 가로 오버플로 4개 파일 모두 0px 검증 완료.
  - `verify:adsense-contract` (11/11), `verify:portal-auto-ads-only` (9/9), `verify:portal-ad-containment` (11/11), `harness:analytics` (9/9), `verify:root` (24/24), `verify:docs` (10/10) 전원 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
