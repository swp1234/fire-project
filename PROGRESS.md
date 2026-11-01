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
- **P1 포털 도구 카탈로그 전환 추적 표준화 (완료)**: `portal` dopamine-detox 브릿지 카드 및 kpop-role-roster 관련 링크 `content_cta_click` 전면 탑재.
- **P2 무결점 컴플라이언스 & 헬스 가드 통과 (완료)**: AdSense 단일 Auto Ads 계약, OAuth keepalive(UTF-8 보정), 터치 타깃 0 이슈, Health Guard ALL PASS.

## Latest release: Complete Assessment & Portal Tools Funnel Attribution (`portal 5525f98`, `brain-type 5f45a1e`, `iq-test 00a58e9`)

- **Portal 유틸리티 도구 표준 전환 추적 (`portal 5525f98`)**:
  - `dopamine-detox-protocol.js`: 브릿지 카드 3종(Stress Check, Future Self, Burnout Differential) 클릭 시 `content_cta_click` 탑재.
  - `kpop-role-roster.js`: 관련 링크 2종(포지션 테스트, 가이드) 클릭 시 `content_cta_click` 탑재.
- **Brain Type & IQ Test 표준 전환 추적 (`brain-type 5f45a1e`, `iq-test 00a58e9`)**:
  - `brain-type/js/app.js`: intro growth 카드, 관련 검사 그리드, primary CTA, 푸터 링크 전원에 `content_cta_click` 탑재 및 `source=brain_type_result` 보존.
  - `iq-test/js/app.js`: hero next-step CTA 및 관련 라우트 링크에 `content_cta_click` 탑재, `source=iq_test` 파라미터 자동 보존.
  - IndexNow 즉각 갱신(HTTP 200) 및 `memory/audit-registry.json` HEAD 동기화 완료.
- **품질 게이트 및 E2E 통과**:
  - `audit-touch.js`: `brain-type`, `iq-test`, `portal` 390x844 모바일 뷰포트 오버플로 0px, 터치 이슈 0건(PASS).
  - `audit-funnel.js`: 4,034개 파일 정지 링크 및 텔레메트리 누출 0건(PASS).
  - `health-guard.js`: AdSense 계약, OAuth 토큰, 비밀값, 문서 예산, 루트 테스트 ALL PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
