# DopaBrain current status

Updated: 2026-11-01 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-01)**: Policy violations 0 (`{}`). 어제 확정 **$0.07**, 7일 누적 **$0.67** (일평균 $0.096, 지속 상승), 30일 누적 **$1.81**. 오늘 **$0.01** 진행 중.
- GA4 실측 (최근 7일): Organic Search 84 세션(프랑스, 미국, 중국, 독일, 한국 등), 핵심 고체류 진입면 체류 지속 (2048 Coach 414s, Future Self 203s, Brain Type 243s, HSP Guide 650s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-01) — 상세 설계: `docs/STRATEGY.md`

- **P0 6대 핵심 진입면 전환 어트리뷰션 전면 완성 (완료)**: `stress-check`, `puzzle-2048`, `future-self`, `hsp-test`, `brain-type`, `iq-test` 전원 언어 및 `source` 보존, GA4 `content_cta_click` 표준화.
- **P1 포털 도구 및 K-pop 생태계 전환 추적 표준화 (완료)**: `portal` dopamine-detox, kpop-role-roster 및 `kpop-position` 상호 연계 companion card, 12개 언어 i18n, `content_cta_click` 탑재.
- **P2 블로그 고체류 triage-sub-btn 전환 추적 보강 (완료)**: HSP 가이드(en, de), 2048 전략(zh) 보조 CTA에 `content_cta_click` 탑재.
- **P3 무결점 컴플라이언스 & 헬스 가드 통과 (완료)**: AdSense Auto Ads 계약, OAuth keepalive, 터치 타깃 0 이슈, 105개 스크리너 라이브 테스트 및 Health Guard ALL PASS.

## Latest release: Complete Funnel Attribution & K-Pop Companion Bridge (`portal 3317b69`, `kpop-position bc2887b`)

- **K-Pop Position & Role Roster 상호 브릿지 (`kpop-position bc2887b`)**:
  - `projects/kpop-position/index.html`: 결과 화면에 `/portal/tools/kpop-role-roster.html` 전용 companion 카드 탑재.
  - 12개 언어(`ko, en, ja, zh, es, de, fr, pt, ru, hi, id, tr`) 번역 JSON `relatedTests.roleRoster` 완비.
  - `updateLocalizedLinks()`에 `source=kpop_position` 파라미터 자동 보존 로직 추가.
  - `.related-test-card, .back-link` 클릭 시 GA4 `content_cta_click` 이벤트 발송.
- **고체류 블로그 아티클 전환 추적 보강 (`portal 3317b69`)**:
  - `en/hsp-coping-strategies`: `.triage-sub-btn`에 `data-content-surface="cta"` 및 전용 클릭 리스너 연결.
  - `zh/2048-strategy-guide`: `.triage-btn`, `.triage-sub-btn`에 `data-content-surface="cta"` 명시하여 위젯 전환 추적 누락 해결.
- **품질 게이트 및 E2E 전원 통과**:
  - `audit-touch.js`: `kpop-position` (8 targets), `portal` (53 targets), `puzzle-2048` (34 targets) 오버플로 0px, 터치 이슈 0건(PASS).
  - `verify-screener-live.js`: 105개 전체 인터랙티브 스크리너 Chromium 라이브 테스트 ALL PASS.
  - `audit-funnel.js`: 4,034개 파일 스캔 결과 정지 링크/텔레메트리 누출 0건(PASS).
  - `indexing-inventory.js --strict`: 1,555개 고유 URL 인벤토리 0 이슈, 0 블로커(PASS).
  - `health-guard.js`: AdSense 단일 Auto Ads 계약, 토큰, 비밀값, 문서 예산, 12개 언어 루트 테스트 ALL PASS.
  - IndexNow 즉각 갱신(HTTP 200) 및 `memory/audit-registry.json` HEAD 동기화 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
