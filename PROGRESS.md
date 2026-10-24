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

- **P0 자율 개발 실수 방지 및 토큰 낭비 차단**: `memory/audit-registry.json` 기반 119/119 서브모듈 Zero-Token 스킵 영구화.
- **P1 다중 검색엔진 노출 및 우연한 유입(Accidental Discovery) 극대화**:
  - Bing/Naver/DuckDuckGo IndexNow 즉시 색인 + AI 검색(Perplexity/ChatGPT) `llms.txt` 탑재.
  - 모바일 Web Share API 및 고전환 블로그-인터랙티브 툴 브릿지 연동.

## Latest release: Multi-Engine Search, Grounding Tool & SEO Engine Fix (2026-10-24)

- 신규 인터랙티브 도구 3종 런칭 및 12개 언어 탑재:
  - `burnout-stress-differential.html`: 2D 피로 좌표계(급성 스트레스 vs 만성 번아웃) 감별 및 전용 프로토콜.
  - `dopamine-detox-protocol.html`: 저가 vs 복리 도파민 마찰 비율 계산기 + 24시간 리셋 일정표 + ADHD 대체 메뉴.
  - `grounding-exercise.html`: 5-4-3-2-1 신체 감각 그라운딩 + 생리적 한숨(Cyclic Sigh) 호흡 가이드.
- 검색 색인 및 바이럴 공유 강화:
  - GSC 근본 원인 해결: JS canonical 변조 제거(`hsp-test`, `brain-type`, `npc-test`, `portal`), 정적 일치화.
  - `stress-check`, `hsp-test`, `future-self` 수동 색인 요청 완료 + 일일 큐(`memory/indexing-daily-queue.json`) 가동.
  - Bing/Naver IndexNow 5개 핵심 URL 전송 완료, `root-domain/llms.txt` AI 검색 색인 갱신.
  - GA4와 AdSense 계정 연동 완료 및 자동 광고 슬라이더(60-70%)·전면·앵커 활성화.
- 119/119 Submodules Clean:
  - `health-guard`: 6/6 전 배터리 PASS (1,532개 전 URL 0-issue), 0px 모바일 오버플로, 44px 터치 타깃 100% 준수.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
