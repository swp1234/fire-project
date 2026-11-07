# DopaBrain current status

Updated: 2026-11-07 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-07)**: Policy violations 0 (`{}`). 오늘 현재 **$0.01**, 어제 **$0.09**, 7일 누적 **$0.35**, 30일 누적 **$1.70**. Active View CPM 0클릭 수익 지속 및 전환 퍼널 정렬.
- GA4 실측: Organic Search **77 세션/7d** (참여 46세션, 총 체류 3,114s), AI Assistant 2세션 (322s), 고체류 진입면 (Color Blindness 332s, HSP Guide 192s, Attachment Style 147s, Emotion Management 133s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test, Color Blindness, White Noise.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test, Color Blindness, White Noise).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-07) — 상세 설계: `docs/STRATEGY.md`

- **P0 전체 134단계 Harness Workflow 100% 녹색 완결 (완료)**: `npm run harness` 134단계 모든 검증기 무결점 통과.
- **P1 스트레스 유형 가짜 소셜 프루프 완전 퇴출 (완료)**: `stress-type` 잔존 32,000+ 제거, 12개 언어 교육용 디스클레이머 전면 교체.
- **P2 백색소음 플레이어 E-E-A-T 과학 가이드 & 다국어 정렬 (완료)**: `white-noise` 음향 물리학($1/f^\alpha$), FAQPage 스키마, 12개 언어 실시간 팁, 터치 44px 완비.
- **P3 뇌 유형(Brain Type) 인지 프레임워크 & FAQPage 스키마 탑재 (완료)**: `brain-type` 카너먼 시스템 1 인지 차원 해설, 10개 언어 FAQ 번역, profile-stat 정제.
- **P4 헬스 가드 & 퍼널 브릿지 & 트러스트 감사 ALL PASS (완료)**: AdSense OAuth Keepalive, Auto Ads 단일 로더, 비밀값 0건, 4,034개 파일 퍼널 감사 통과.

## Latest release: Core Surfaces & Tools E-E-A-T, Telemetry & Sitemap Sync (`2026-11-07 Batch` @ `2026-11-07`)

- **루트/포털 및 핵심 도구 구조화 데이터 & GA4 텔레메트리 전면 정렬**:
  - `root-domain` (@ `c958b2c`), `portal` (@ `c3682be`), `stress-check` (@ `32f3795`), `hsp-test` (@ `7cb5b12`).
  - `portal/tools/emotion-regulation-planner`: James Gross 프로세스 모델 및 DBT 기반 `FAQPage` 스키마 신규 탑재.
  - `portal/tools/grounding-exercise`: 단계별 진행, 사이클릭 한숨, 완료 시간, 공유 등 정밀 GA4 텔레메트리 탑재.
  - 고트래픽 도구군(`burnout-stress-differential`, `cognitive-load-calculator`, `dopamine-detox-protocol`, `plan.html`, `script.html`, `library.html`, `reset.html`, `map.html`) `dateModified="2026-11-07"` 동기화.
- **사이트맵 lastmod 불일치 0건 완전 해소**: `root-domain/sitemap.xml`, `sitemap-core.xml`, `portal/sitemap.xml` 전수 동기화, `indexing-inventory.js --strict` 1,555개 URL 0이슈/0블로커 통과.
- **IndexNow 즉각 제출 200 OK**: 루트, 포털, 핵심 진입면 및 도구군 전수 배포.
- **Health Guard 6종 배터리 100% ALL PASS**: AdSense Keepalive, Auto Ads 계약, 비밀값 0건, 모바일 터치(390x844 오버플로 0px) 및 트러스트 감사 무결점.
- 사용자 자산 `attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` 완전 보존 원칙 100% 준수.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
