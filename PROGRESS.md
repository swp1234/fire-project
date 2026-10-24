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

## Latest release: Trust & Compliance Engine with Zero-Token Auditing (2026-10-24)

- Trust, Schema & Ad Policy Eradication:
  - 19개 서브모듈의 보상형 전면광고 잠금(`ad-lock`), 인위적 5초 타이머(`page_engage`), 허위 평점(`aggregateRating`), 숨김 FAQ 스키마 완전 제거 (`future-self`, `hsp-test`, `stress-type`, `mbti-tips`, `numerology`, `shopping-calc`, `white-noise` 등).
  - 과거 실수 및 수익 악영향 패턴을 [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md)에 정식 문서화.
- Agent Skill & Zero-Token Optimization:
  - 신규 스킬 `dopabrain-trust-audit` 구축 및 `package.json` 등록 (`npm run skill:trust-audit`).
  - `memory/audit-registry.json` 기반 완료 프로젝트 즉시 스킵(Zero-Token Waste) 체계 확립.
- Quality Gates & Deployment:
  - 하위 서브모듈 개별 커밋·푸시 완료, IndexNow 일괄 제출(HTTP 200), `verify:docs` 및 `health-guard` 6/6 PASS 준수.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
