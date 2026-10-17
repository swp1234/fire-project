# DopaBrain current status

Updated: 2026-10-11 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-17)**: Policy violations 0 (`{}`). 10-17 **$0.03** (반등 추세, Canada $0.05 / US $0.04). 7일 누적 **$0.30**, 30일 누적 **$1.71**.
- 핵심 대책: 직접 유입 정지 앱(`brain-type`, `social-battery`) 및 영문 공략 가이드 아웃바운드 링크를 활성 수익화 앱(`iq-test`, `stress-check`, `hsp-test`, `future-self`)으로 전면 전환하여 수익 누수 차단.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-17) — 상세 설계: `docs/STRATEGY.md`

- **P0 수익화 트래픽 누수 차단 및 활성 도구 라우팅**:
  - `brain-type` 결과 화면 Primary CTA 및 관련 그리드를 정지 스텁(`eq-test`, `mental-age`)에서 활성 수익화 앱(`iq-test`, `stress-check`, `hsp-test`, `future-self`)으로 전면 전환.
  - `social-battery` 결과 화면 관련 그리드에서 정지 스텁 4종 제거, 100% 활성 수익화 앱 유지.
  - 영문 고-CPM 아티클(`number-puzzle-2048-tips.html`, `dopamine-detox-guide-reset-brain.html`) 내 아웃바운드 링크를 2048 Coach 및 활성 도구로 전환.
- **P1 고유지율 허브(`/puzzle-2048/coach.html`) & 진입면 수익 연결**:
  - 유저 체류시간 3,790초 초고유지율 허브와 동반 수익화 테스트 간 상호 연결 완성.

## Latest release: Direct-Landing Outbound Funnel Recovery & English Strategy Monetization (2026-10-17)

- Submodules: `projects/portal` (`ff8084e`), `projects/brain-type` (`e5977c4`), `projects/social-battery` (`059dddb`).
- Monetization & Traffic Routing:
  - 직접 유입 상위 정지 앱(`brain-type`, `social-battery`)의 결과 화면 Primary CTA 및 관련 그리드를 활성 수익화 앱(`iq-test`, `stress-check`, `hsp-test`, `future-self`, `anxiety-type`)으로 전면 개편.
  - 2048 전략 가이드(`number-puzzle-2048-tips.html`) 내 무광고 `number-puzzle` 링크를 2048 Coach 및 IQ Test/Stress Check로 교체.
  - 도파민 디톡스 영문 가이드 관련 링크 라벨 및 목적지를 활성 수익화 앱(`detox-timer`, `stress-check`, `future-self`, `iq-test` 등)으로 정합성 갱신.
- Test Harness:
  - `verify:adsense-contract`, `verify:restricted-ads`, `verify:brain-trust`, `verify:2048-ad-policy`, `verify:docs` 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.


