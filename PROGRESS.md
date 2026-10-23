# DopaBrain current status

Updated: 2026-10-24 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-24)**: Policy violations 0 (`{}`). 오늘 **$0.01**, 어제 **$0.07**, 7일 누적 **$0.37**, 이달 누적 **$1.20**, 30일 누적 **$1.69**.
- 핵심 대책: 119개 전 서브모듈 44px 터치/0px 오버플로 감사 완료 및 영구 레지스트리 구축, 운영 실수 방지 지침([docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md)) 준수, 핵심 진입면 SEO/UX 지속 최적화.

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

## Latest release: Autonomous Development Reliability System & 119 Submodule Audit Baseline (2026-10-24)

- Reliability & Operational Guard:
  - 과거 운영 실수 및 수익 저해요인 체계화: [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) 작성 (무효 클릭 리스크, 블로그 색인 붕괴, 터치 미달 방지).
  - 작업 재실행 방지 레지스트리 구축: `memory/audit-registry.json` & [docs/COMPLETED-AUDITS.md](docs/COMPLETED-AUDITS.md) (119개 서브모듈 100% 검증 기록).
  - 재사용 가능 작업 스킬 패키징: `.agents/skills/` (`dopabrain-touch-audit`, `dopabrain-submodule-ops`, `dopabrain-health-guard`) 및 npm 스크립트 연동 (`skill:*`).
  - 1,524개 sitemap URL 전수 조사: 60일 이상 경과 URL 0건 (100% 최신성 확보).
- Verification & Invariants:
  - 119개 전 서브모듈 모바일(390x844) 가로 오버플로 0px, 인터랙티브 터치 타깃 44px 이상 100% 준수 (`ef75b45`).
  - `verify:root` (24/24), `verify:indexing-inventory` (0 issues), `verify:adsense-contract` (PASS), `verify:tracked-secrets` (PASS), `verify:docs` (PASS).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
