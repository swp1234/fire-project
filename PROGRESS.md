# DopaBrain current status

Updated: 2026-10-18 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-18)**: Policy violations 0 (`{}`). 10-17 **$0.05**, 10-18 당일 중간 **$0.04**. 7일 누적 **$0.26**, 이달 누적 **$0.91**.
- 핵심 대책: 포털 블로그 전반의 404 감각 리셋 데드 링크(`/stress-check/reset.html`) 191건을 활성 Auto Ads 감각 리셋 세션(`/hsp-test/reset.html`)으로 전수 복구하고, GA4 최상위 체류 가이드의 유입 누수를 활성 수익화 도구로 전면 전환.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 200s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-18) — 상세 설계: `docs/STRATEGY.md`

- **P0 수익화 트래픽 누수 차단 및 활성 도구 라우팅**:
  - 98개 다국어 블로그 가이드 내 잘못 연결된 `/stress-check/reset.html`(404) 191건을 활성 Auto Ads 페이지(`/hsp-test/reset.html`)로 일괄 복구.
  - GA4 최상위 체류시간 가이드(`dopamine-detox-practical-guide` 235.8s, `pt/emotional-regulation-techniques` 232.6s 등)의 정지/중복 링크를 활성 Auto Ads 도구로 전환 완료.
- **P1 고유지율 허브(`/puzzle-2048/coach.html`) & 진입면 수익 연결**:
  - GA4 1위 체류 페이지(2048 Coach 200.1s) 및 핵심 셀프체크 허브로의 유기적 수익 순환 유지.

## Latest release: 3,990-Source Portal Profitability, Localization & Funnel Clean Sweep (2026-10-18)

- Submodules: `projects/portal` (`4d4b767`..`3955e3a`, `4fdeda0`, `6102e91`, `2f03e38`).
- Monetization & Routing:
  - 비계약 라이브 블로그 전체에서 정지된 앱(`loaders=0`) 링크를 전수 제거(0건)하고 고체류 활성 Auto Ads 도구(`/stress-check/`, `/stress-type/`, `/iq-test/`, `/hsp-test/`, `/hsp-test/reset.html`, `/detox-timer/`, `/future-self/`, `/emotional-age/`, `/dream-fortune/`) 및 `/puzzle-2048/coach.html`로 전환.
  - 비영어권 11개 언어(`ko, ja, zh, es, pt, de, fr, ru, hi, id, tr`) 가이드 내 영문 UI(Quick-Rail 7,246카드, Followup/Portal CTA 2,168건, FAQ/Conclusion 헤더 1,153건, 작성자/읽기시간 메타바 627건, Home/Blog 라벨 68건) 전수 현지화 및 2,115개 그리드 중복 카드 0건 달성.
  - 활성 앱 링크 10,565건, `/puzzle-2048/coach.html` 683건, `/portal/` 및 `/portal/blog/` 허브 2,078건, `<nav>`/`<footer>` 루트 링크 1,018건에 `?lang=<locale>`을 부여하고 GA4 `data-target-slug` 불일치 395건을 동기화.
  - 404 `og:image`/파비콘/JSON-LD 로고 3,488건(892개 가이드)을 `/portal/icon-512.svg`로 복구, 정지 앱 이름으로 남은 CTA 문구 738건을 실제 도착 도구명으로 교정, 리디렉트 스텁을 가리키던 hreflang 296건 제거.
- Mobile & Ad Quality:
  - Playwright 기준 390x844 모바일 가로 오버플로 12개 지원 언어 대표 가이드 전원 0px 검증 완료.
  - `verify:adsense-contract` (11/11), `verify:portal-auto-ads-only` (9/9), `verify:portal-ad-containment` (11/11), `harness:analytics` (9/9), `verify:root` (24/24), `verify:docs` (10/10) 전원 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
