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

## Latest release: High-Traffic Viral Apps Quality & Trust Overhaul (2026-10-24)

- Trust & SEO Compliance Overhaul:
  - 고트래픽 바이럴 앱 5종(`dark-core`, `emotional-age`, `love-language`, `red-green-flag`, `toxic-trait`)의 과거 레거시 찌꺼기 전면 제거.
  - 인위적 5초 타이머(`page_engage`), 조작된 리뷰 점수(`aggregateRating`), 숨김 FAQ 스키마, `Math.random()` 가짜 통계 완전 박멸.
  - 최신 수정일(`dateModified: 2026-10-24`) 갱신 및 IndexNow 5개 URL 전원 제출 완료 (HTTP 200).
- Core Funnel Bridge:
  - 5개 앱의 연관 추천 그리드를 핵심 유료/고체류 도구(Stress Check, HSP Test, Future Self, Attachment Style)로 일괄 개편.
- Verification & Invariants:
  - 5개 서브모듈 커밋·푸시 완료(`cca79c4`, `0f88f57`, `fee834e`, `0bca6fe`, `858e357`).
  - `health-guard` (6/6 PASS), `verify:indexing-inventory` (0 issues), `verify:docs` (PASS), 모바일 오버플로 0px & 44px 터치 100% 준수.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
