# DopaBrain current status

Updated: 2026-10-11 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

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

## Latest release: KO, ZH, ID Reaction Time Guides Monetization Routing & ZH Contract Locking (2026-10-17)

- Submodules: `projects/portal` (`598fc34`).
- Monetization & High-Intent Conversion Routing:
  - 한국어/중국어/인도네시아어 반응속도 가이드(`blog/{ko,zh,id}/reaction-time-test-how-fast-are-you.html`):
    - 퀵 레일 카드 및 타이틀을 현지화하고 미작동/정지 게임 대신 활성 수익화 도구(`/reaction-test/?lang=...`, `/stress-check/?lang=...`, `/hsp-test/?lang=...`, `/future-self/?lang=...`)로 전면 개편.
    - 본문 CTA 1/2, 인라인 링크, FAQ 및 하단 관련 도구 그리드 내 14~16개 트래픽 누수 링크(`iq-test` 오작동 및 정지 게임 스텁)를 활성 앱(`/reaction-test/?lang=...`, `/puzzle-2048/coach.html?lang=...` 등)으로 100% 교체.
    - 중국어 2048 가이드 계약 검증(`verify:zh-2048-guide`) 20/20 PASS 복구 및 불변 고정.
- Mobile & Ad Quality:
  - 390x844 모바일 가로 오버플로 수정 파일 모두 0px 검증 완료.
  - `verify:adsense-contract`, `verify:portal-auto-ads-only`, `verify:portal-ad-containment`, `verify:restricted-ads`, `verify:zh-2048-guide`, `verify:ja-reaction-time`, `harness:analytics`, `verify:root`, `verify:docs` 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.





