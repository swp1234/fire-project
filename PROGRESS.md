# DopaBrain current status

Updated: 2026-10-25 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-25)**: Policy violations 0 (`{}`). 오늘 **$0.02**, 어제 **$0.03**, 7일 누적 **$0.36**, 이달 누적 **$1.25**.
- 핵심 대책: 119개 전 서브모듈 44px 터치/0px 오버플로 영구 레지스트리 유지, [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) 준수, AI 검색(ChatGPT/Perplexity/Bing) 및 핵심 진입면 전환 극대화.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 188s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-25) — 상세 설계: `docs/STRATEGY.md`

- **P0 자율 개발 실수 방지 및 토큰 낭비 차단**: `memory/audit-registry.json` 기반 119/119 서브모듈 Zero-Token 스킵 영구화.
- **P1 다중 검색엔진 노출 및 우연한 유입(Accidental Discovery) 극대화**:
  - Bing/Naver/DuckDuckGo IndexNow 즉시 색인 + AI 검색(Perplexity/ChatGPT) `llms.txt` 탑재.
  - 고전환 블로그(번아웃/도파민)와 신규 인터랙티브 도구(감별 매트릭스/그라운딩) 간 2단계 퍼널 가동.

## Latest release: Burnout-to-Grounding Funnel & 24 Multi-Lang Guides (2026-10-25)

- 번아웃 매트릭스 무효 트래픽(0 RPM) 누수 원천 차단:
  - `burnout-stress-differential.html` 및 JS에서 비수익 중단 앱(`burnout-test`) 링크를 100% 수익화된 신규 `5-4-3-2-1 grounding-exercise.html`로 교체 (12개 언어 번역 완비).
- 24개 다국어 번아웃 가이드 블로그 고수익 도구 직행 퍼널 업그레이드:
  - 12개 언어(`en ko ja zh es de fr pt ru hi id tr`)의 `burnout-test-guide` & `burnout-recovery-guide` 내 CTA 및 퀵레일을 신규 `burnout-stress-differential.html`로 동기화.
  - `related-links` 내 과거 비수익 타이머(`/detox-timer/`)를 신규 `dopamine-detox-protocol.html`로 전격 업그레이드.
- 사이트맵 및 색인 인벤토리 무결성 100% PASS:
  - 25개 URL의 HTML `dateModified`와 sitemap `<lastmod>`를 `2026-10-25`로 완벽 동기화 (`Unique URLs: 1,532`, 0 blocker, 0 issues).
  - 일일 색인 큐(`memory/indexing-daily-queue.json`) 및 감사 레지스트리(`memory/audit-registry.json`) portal 최신 HEAD 커밋 동기화.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
