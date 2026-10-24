# DopaBrain current status

Updated: 2026-10-24 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-24)**: Policy violations 0 (`{}`). 오늘 **$0.02**, 어제 **$0.07**, 7일 누적 **$0.37**, 이달 누적 **$1.21**, 30일 누적 **$1.70**.
- 핵심 대책: 119개 전 서브모듈 44px 터치/0px 오버플로 영구 레지스트리 유지, [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) 준수, AI 검색(ChatGPT/Perplexity/Bing) 및 핵심 진입면 전환 극대화.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 188s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-24) — 상세 설계: `docs/STRATEGY.md`

- **P0 자율 개발 실수 방지 및 토큰 낭비 차단**:
  - `memory/audit-registry.json` 기반 119/119 서브모듈 Zero-Token 스킵 영구화.
  - [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) 8대 영역 숙지 (언어 탈락, 목적지 불일치, 텔레메트리 점수 누출 금지).
- **P1 핵심 진입면 유기적 검색 강화 및 전환 최적화**:
  - Stress Check, HSP Test, 2048 Coach, Future Self 체류시간 및 연계 완료율 극대화.

## Latest release: Search Visibility & Viral Exposure (2026-10-24)

- 유기적 검색 노출 & 언어 불일치 해소:
  - `stress-check`, `hsp-test`, `future-self`: 정적 HTML 제목/설명/OG 태그를 한국어 canonical 및 `lang="ko"`와 일치시켜 Googlebot의 "Crawled - currently not indexed" 원인 제거.
  - `scripts/verify-stress-core.js` (16/16 변이/런타임), `verify-hsp-reset-funnel.js` (13/13 변이/런타임), `verify-future-self-funnel.js` 전원 PASS.
- 바이럴 & 우연한 발견(Accidental Discovery) 강화:
  - `decision-matrix.html`: 모바일 네이티브 공유 시트(`navigator.share`) 및 1클릭 복사 보고서 링크 탑재.
  - `root-domain/llms.txt` & `llms-full.txt`: Decision Matrix & Emotion Regulation Planner 신규 도구 AI 검색(ChatGPT/Perplexity/Claude) 색인 등록 완료.
- 119/119 Submodules Clean:
  - `health-guard`: 6/6 전 배터리 PASS (1,529개 전 URL 무결점), Pre-push 품질 게이트 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
