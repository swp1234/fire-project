# DopaBrain current status

Updated: 2026-10-11 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-16)**: Policy violations 0 (`{}`). 10-16 **$0.01** (22 imps / 326 views). 7일 누적 **$0.28**, 30일 누적 **$1.69**.
- 핵심 대책: 블로그/포털 크로스 프로모션 라우팅을 광고 정지 앱(brain-type, eq-test)에서 활성 수익화 앱(stress-check, hsp-test, future-self)으로 전면 교체하여 트래픽 누수 차단.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-16) — 상세 설계: `docs/STRATEGY.md`

- **P0 수익화 트래픽 누수 차단 및 활성 도구 라우팅**:
  - `cross-promo.js`, `/portal/`, `/portal/mbti/`(256 매트릭스 모달 및 16개 유형 페이지), `/portal/tests/` 피처드 카드, 15개 마켓 `country-content.js` 레일, 상위 유입 EN 블로그 5종의 CTA를 활성 수익화 앱(`stress-check`, `hsp-test`, `future-self`, `attachment-style`, `animal-personality`)으로 전면 전환 완료.
  - 모바일 스티키 터치 타깃 44px 및 변이 테스트 통과 (`verify:cross-promo-touch`, `portal-hub-locale-audit`, `verify:portal-auto-ads-only`).
- **P1 핵심 진입면 인덱싱 회복 & 앱 내 후속 퍼널 강화**:
  - 활성 수익화 6대 앱(`animal-personality`, `kpop-position`, `daily-tarot`, `hsp-test`, `iq-test`, `future-self`) 완료 후 추천 카드가 무광고 앱으로 유출되지 않도록 내부 순환 퍼널 전면 전환 완료.

## Latest release: Post-Result Related Test Funnel Routing Across 6 Active Monetized Apps (2026-10-16)

- Submodules: `projects/animal-personality`, `projects/kpop-position`, `projects/daily-tarot`, `projects/hsp-test`, `projects/iq-test`, `projects/future-self`.
- Monetization & SEO:
  - 6대 핵심 수익화 앱의 결과 화면(Best Next Step, Related Tests, Next Discovery)에서 무광고 앱(`brain-type`, `color-personality`, `mbti-love`, `dopamine-type`, `burnout-test`, `stress-response`, `anxiety-type`, `aura-reading`, `past-life`, `mental-age`)으로 향하던 아웃바운드 링크를 100% 활성 수익화 앱으로 전환하고 12개 언어 로케일 반영.
- Test Harness:
  - `verify:animal-personality`, `verify:kpop-position`, `verify:daily-tarot`, `verify:hsp-reset-funnel`, `verify:iq-completion-reset`, `verify:future-self-funnel`, `verify:adsense-contract` 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
