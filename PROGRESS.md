# DopaBrain current status

Updated: 2026-10-27 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-25)**: Policy violations 0 (`{}`). 오늘 **$0.02**, 어제 **$0.03**, 7일 누적 **$0.36**, 이달 누적 **$1.25**.
- 핵심 대책: 119개 전 서브모듈 44px 터치/0px 오버플로 유지, [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) 준수, AI 검색/진입면 전환 극대화.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 188s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-27) — 상세 설계: `docs/STRATEGY.md`

- **P0 GSC 10대 핵심 진입면 및 보조 도구 재색인 완료**:
  - GSC 실패 10대 핵심 도구 100% `FAQPage` 스키마 & 본문 FAQ 일치 주입 완료.
  - 전 도구 학술 프레임워크(Pugh, Lembke, Schultz, Maslach, Bowlby, Sweller, Linehan) 완비.
  - 10대 전 도구 `dateModified` 및 사이트맵 `<lastmod>`를 `2026-10-27`로 정합성 동기화.
  - 블로그 전역 516개 파일 761개 정지 링크 전면 소탕 (`funnel-bridge` PASS).
  - AdSense MCP 토큰 갱신 및 계정 연동 유지 (`pub-3600813755953882` keepalive PASS).
  - IndexNow 19개 URL 실시간 핑 전송 완료 (`HTTP 200, ok: true`).
- **P1 자율 개발 실수 방지 및 토큰 낭비 차단**: `memory/audit-registry.json` 기반 119/119 서브모듈 Zero-Token 스킵 영구화.

## Latest release: Core Tools E-E-A-T & Blog CRO Optimization (2026-10-27)

- **핵심 진입면 E-E-A-T & Schema.org FAQPage 동기화**:
  - `stress-check af22e9c`, `hsp-test 7de836d`, `future-self be1f0b0`, `brain-type 035adcf`, `iq-test f8f3150`, `attachment-style 902e49e`, `puzzle-2048 8bd1eff` 전수 FAQPage 스키마 탑재 및 dateModified `2026-10-27` 일체화.
  - `portal dfad2cb`: 6대 도구(`decision-matrix`, `dopamine-detox`, `burnout-stress`, `cognitive-load`, `grounding-exercise`, `emotion-regulation`) FAQPage 및 학술 인용 탑재, lastmod 동기화.
- **고트래픽 블로그 CRO 인터랙티브 위젯 탑재 (`portal 4adf50d, f6055a3`)**:
  - `15-signs-highly-sensitive-person.html`: 30초 HSP 감각 체크리스트 위젯 탑재 (`/hsp-test/`).
  - `avoidant-attachment-dating-patterns.html`: 30초 회피 애착 체크리스트 위젯 탑재 (`/attachment-style/`).
  - `anxiety-attack-vs-panic-attack-guide.html` (en, ko): 30초 불안 vs 공황 체크리스트 위젯 (`/portal/tools/grounding-exercise.html`).
  - `burnout-symptoms-self-check.html` (en, ko): 30초 번아웃 자가진단 위젯 및 퍼널 수정 (`/burnout-test/`, `/portal/tools/burnout-stress-differential.html`).
- **검증 및 사이트맵 무결성**:
  - `verify:indexing-inventory`: 1,533개 전체 URL 0 issue PASS.
  - `audit:touch`: 전 도구 390x844 모바일 0px 오버플로, 터치 이슈 0개 PASS.
  - IndexNow: 핵심 URL 19개 실시간 통지 100% 완료 (`status: 200, ok: true`).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
