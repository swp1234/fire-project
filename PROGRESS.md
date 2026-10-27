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

- **P0 GSC '크롤링됨 - 현재 색인이 생성되지 않음' 근본 해결 및 10대 핵심면 재색인**:
  - 블로그 전역 516개 파일 내 761개 정지 레거시 링크 100% 제거 및 활성 수익화 코호트 교체 (Zero Suspended Links 달성).
  - 얇은 콘텐츠 탈피: `attachment-style` E-E-A-T 프레임워크(Bowlby/ECR-R), 4대 애착 프로필, FAQ 4개, APA 참고문헌 탑재.
  - 핵심 도구 리치 스니펫 보강: `future-self`, `brain-type`, `iq-test`에 Schema.org `FAQPage` 및 `BreadcrumbList` 완비.
  - AdSense MCP 토큰 정상 갱신 및 계정 연동 (`accounts/pub-3600813755953882` keepalive PASS).
  - Bing/Naver/DuckDuckGo IndexNow 10대 핵심 URL 실시간 핑 전송 완료 (`HTTP 200`).
- **P1 자율 개발 실수 방지 및 토큰 낭비 차단**: `memory/audit-registry.json` 기반 119/119 서브모듈 Zero-Token 스킵 영구화.

## Latest release: Core Tools E-E-A-T & FAQPage Schema Synchronization (2026-10-27)

- **핵심 진입면 E-E-A-T 및 검색엔진 신뢰도 전면 강화**:
  - `attachment-style aef1446`: Two-Dimensional Model, 4대 애착 유형 가이드, 4대 FAQ, APA 참고문헌 5개 완비.
  - `future-self be1f0b0`: 본문 3대 FAQ와 100% 일치하는 Schema.org `FAQPage` 스키마 주입 및 dateModified 2026-10-27 동기화.
  - `brain-type 035adcf`: 5대 인지 차원 및 4대 FAQ 일치 `FAQPage` 스키마 주입 및 dateModified 2026-10-27 동기화.
  - `iq-test f8f3150`: CHC 인지 이론 기반 5대 FAQ 일치 `FAQPage` 스키마 주입 및 dateModified 2026-10-27 동기화.
- **블로그 516개 파일 761개 정지 링크 전면 소탕 (`portal ceb461c`)**:
  - 28종 정지 레거시 링크 1,492곳을 100% 활성 도구로 일괄 교체하여 크롤러 누수 차단.
- **검증 및 색인 제출 완료**:
  - `skill:funnel-bridge` 0 issue PASS, `verify:indexing-inventory` 1,533개 URL 0 issue PASS.
  - `memory/audit-registry.json` 119/119 서브모듈 Zero-Token 스킵 100% 동기화.
  - IndexNow 10대 핵심 URL 실시간 제출 완료 (`status: 200, ok: true`).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
