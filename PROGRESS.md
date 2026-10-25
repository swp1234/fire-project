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
  - 고전환 블로그(번아웃/해리/야간과잉사고/도파민메뉴)와 신규 도구 3종 간 2단계 퍼널 가동.

## Latest release: Color Psychology Guide 12-Language Funnel Optimization (2026-10-25)

- 좋아하는 색상 심리 가이드(What Your Favorite Color Says About You) 12개 전 언어(`de en es fr hi id ja ko pt ru tr zh`) 고전환 퍼널 전면 개편:
  - 퀵레일(`indexing-quick-rail`) 4개 카드를 `brain-type`(두뇌 유형 테스트), `hsp-test`(고감각자 HSP 테스트), `future-self`(미래의 나 시뮬레이터), `stress-check`로 전격 교체.
  - 본문 Hero/Mid CTA 및 인라인 링크 내 정지된 레거시 앱 링크(`animal-personality`, `attachment-style` 총 60여 개) 전면 제거, 두뇌 유형 및 HSP 고감각자 테스트로 교체.
  - 12개 전 언어 하단 `indexing-followup-section` 신설로 심층 인지 기질 분석 도구 직행 유도.
- 인벤토리 무결성 및 인덱싱 완전 검증:
  - `portal/blog/sitemap.xml` 12개 언어 `<lastmod>` 2026-10-25 동기화, `indexing-inventory` 1,533개 URL 0 issue PASS.
  - Bing/Naver/DuckDuckGo IndexNow 12개 URL 실시간 전송 접수 (누적 407개 URL 실시간 인덱싱 완료).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
