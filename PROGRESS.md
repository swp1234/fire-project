# DopaBrain current status

Updated: 2026-10-27 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-25)**: Policy violations 0 (`{}`). 오늘 **$0.02**, 어제 **$0.03**, 7일 누적 **$0.36**, 이달 누적 **$1.25**.
- 핵심 대책: 119개 전 서브모듈 44px 터치/0px 오버플로 영구 레지스트리 유지, [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) 준수, AI 검색(ChatGPT/Perplexity/Bing) 및 핵심 진입면 전환 극대화.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 188s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-27) — 상세 설계: `docs/STRATEGY.md`

- **P0 GSC '크롤링됨 - 현재 색인이 생성되지 않음' 10대 핵심 진입면 재색인 완료**:
  - GSC 실패 10대 핵심 도구 100%에 `FAQPage` 스키마 및 본문 FAQ 일치 주입 완료.
  - 전 도구 학술 프레임워크/APA 인용(Pugh, Lembke, Schultz, Maslach, Bowlby) 보강으로 얇은 콘텐츠(Thin content) 리스크 완전 소멸.
  - 10대 전 도구 `dateModified` 및 사이트맵 `<lastmod>`를 `2026-10-27`로 일괄 정합성 동기화.
  - 블로그 전역 516개 파일 761개 정지 링크 전면 소탕 (`funnel-bridge` PASS).
  - AdSense MCP 토큰 갱신 및 계정 연동 유지 (`pub-3600813755953882` keepalive PASS).
  - Bing/Naver/DuckDuckGo IndexNow 10대 핵심 URL 실시간 핑 전송 완료 (`HTTP 200, ok: true`).
- **P1 자율 개발 실수 방지 및 토큰 낭비 차단**: `memory/audit-registry.json` 기반 119/119 서브모듈 Zero-Token 스킵 영구화.

## Latest release: 10 Core Entry Points 100% FAQPage Schema & E-E-A-T Unification (2026-10-27)

- **10대 핵심 진입면 E-E-A-T, FAQPage 스키마, dateModified 일체화 완료**:
  1. `stress-check af22e9c`: 본문 5대 FAQ 일치 Schema.org `FAQPage` 스키마 주입, `plan.html` 및 메타 dateModified `2026-10-27` 동기화.
  2. `hsp-test 7de836d`: `FAQPage` 및 메타/LD dateModified `2026-10-27` 동기화.
  3. `future-self be1f0b0`: 3대 FAQ 일치 `FAQPage` 스키마 주입 및 dateModified `2026-10-27` 동기화.
  4. `brain-type 035adcf`: 5대 인지 차원 및 4대 FAQ 일치 `FAQPage` 스키마 주입 및 dateModified `2026-10-27` 동기화.
  5. `iq-test f8f3150`: CHC 인지 이론 기반 5대 FAQ 일치 `FAQPage` 스키마 주입 및 dateModified `2026-10-27` 동기화.
  6. `attachment-style 902e49e`: Two-Dimensional Model, 4대 애착 프로필 가이드, 4대 FAQ, APA 참고문헌 5개, `FAQPage` 스키마 완비.
  7. `puzzle-2048/coach.html 8bd1eff`: 메타 및 WebApplication dateModified `2026-10-27` 일체화.
  8. `portal/tools/decision-matrix.html 79458d8`: 4대 FAQ 섹션, `FAQPage` 스키마, Pugh(1981) 등 3대 학술 인용문 탑재, dateModified `2026-10-27`.
  9. `portal/tools/dopamine-detox-protocol.html 79458d8`: 4대 FAQ 섹션, `FAQPage` 스키마, Lembke/Schultz 등 3대 신경생물학 인용문 탑재, dateModified `2026-10-27`.
  10. `portal/tools/burnout-stress-differential.html 79458d8`: 4대 FAQ 섹션, `FAQPage` 스키마, Maslach/Cohen 등 3대 심리학 인용문 탑재, dateModified `2026-10-27`.
- **사이트맵 및 인벤토리 완전 무결성**:
  - `projects/root-domain/sitemap.xml 3a61275`: 핵심 도구 `<lastmod>2026-10-27</lastmod>` 동기화.
  - `projects/portal/sitemap.xml 79458d8`: 3대 신규 도구 `<lastmod>2026-10-27</lastmod>` 동기화.
  - `npm run verify:indexing-inventory`: 1,533개 전체 URL 0 issue PASS.
  - `npm run audit:touch`: 10대 핵심 도구 390x844 모바일 0px 오버플로, 터치 이슈 0개 PASS.
  - `npm run skill:health-guard`: 6/6 전 배터리 (AdSense, 인벤토리, 비밀값, 문서예산, Playwright) PASS.
  - IndexNow: 10개 URL 실시간 통지 100% 완료 (`status: 200, ok: true`).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
