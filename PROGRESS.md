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

## Latest release: Sensory Reset 404 Clean Sweep & Top-Dwell Guides Monetization Routing (2026-10-18)

- Submodules: `projects/portal` (`4d4b767`).
- Monetization & Routing:
  - 98개 다국어 블로그 문서의 데드 링크(`/stress-check/reset.html`) 191건을 활성 Auto Ads 감각 리셋 페이지(`/hsp-test/reset.html`)로 전수 복구.
  - GA4 최상위 체류/유입 5대 가이드(`blog/en/dopamine-detox-practical-guide.html`, `blog/pt/emotional-regulation-techniques.html`, `blog/en/emotional-regulation-techniques.html`, `blog/en/15-signs-highly-sensitive-person.html`, `blog/en/vulnerability-courage-connection-guide.html`)의 정지 앱(`/emotion-temp/`, `/overthinker-test/`)·중복 링크·영문 라벨 오염을 해소하고 활성 Auto Ads 앱(`?lang=...`)으로 전면 라우팅.
- Mobile & Ad Quality:
  - Playwright 기준 390x844 모바일 가로 오버플로 5개 가이드 모두 0px 검증 완료.
  - `verify:adsense-contract` (11/11), `verify:portal-auto-ads-only` (9/9), `verify:portal-ad-containment` (11/11), `harness:analytics` (9/9), `verify:root` (24/24), `verify:docs` (10/10) 전원 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
