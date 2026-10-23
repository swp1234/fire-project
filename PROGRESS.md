# DopaBrain current status

Updated: 2026-10-24 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-24)**: Policy violations 0 (`{}`). 오늘 **$0.01**, 어제 **$0.07**, 7일 누적 **$0.37**, 이달 누적 **$1.20**, 30일 누적 **$1.69**.
- 핵심 대책: 119개 전 서브모듈 44px 터치/0px 오버플로 영구 레지스트리 유지, [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) 준수, AI 검색(ChatGPT/Perplexity/Bing) 및 핵심 진입면 전환 극대화.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 200s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-24) — 상세 설계: `docs/STRATEGY.md`

- **P0 자율 개발 실수 방지 및 토큰 낭비 차단**:
  - `memory/audit-registry.json` 및 [docs/COMPLETED-AUDITS.md](docs/COMPLETED-AUDITS.md) 기반 중복 검증 스킵.
  - 작업 전 [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) 숙지 (무효트래픽 방지, 블로그 남발 금지, 터치 44px 엄수).
- **P1 핵심 진입면 유기적 검색 강화 및 전환 최적화**:
  - Stress Check, HSP Test, 2048 Coach, Future Self 체류시간 및 연계 완료율 극대화.

## Latest release: AI Assistant Authority Directory & Portal Cross-Promotion Funnel (2026-10-24)

- AI Assistant Authority & Indexing:
  - `root-domain`의 `llms.txt` 및 `llms-full.txt`를 12개 언어 지원, PSS-10, Aron SPS, Hershfield 등 학술 체계와 정규 사양으로 전면 쇄신 (`9411feb`).
  - 루트 sitemap 최신성 갱신 및 IndexNow 제출 성공 (HTTP 200).
- Cross-Promotion Funnel Fix:
  - `portal/js/cross-promo.js`의 `.html` 경로 인식 버그 수정으로 고트래픽 유틸리티(Palworld 등)에서 핵심 도구 4종(Stress Check, HSP Test, Future Self, Attachment Style) 추천 카드 정상 노출 및 48px 터치 타깃 보장 (`6741f22`).
- Verification & Invariants:
  - `health-guard` (6/6 PASS), `verify:palworld-server-console` (PASS), `verify:cross-promo-touch` (PASS with mutations), `verify:indexing-inventory` (0 issues), `verify:docs` (PASS).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
