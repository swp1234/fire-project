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

- **P0 관계·감정 핵심 진입면 전환 어트리뷰션 확장 (완료)**: `attachment-style` & `emotion-iceberg` 상호 브릿지, `source` 파라미터 보존, GA4 `content_cta_click` 탑재.
- **P1 포털 도구 및 K-pop 생태계 전환 추적 표준화 (완료)**: `portal` dopamine-detox, kpop-role-roster, brain-game-workout, emotion-regulation-planner 및 `kpop-position` companion card, 12개 언어 i18n, `content_cta_click` 탑재.
- **P2 블로그 고체류 triage-sub-btn 전환 추적 보강 (완료)**: HSP 가이드(en, de), 2048 전략(zh) 보조 CTA에 `content_cta_click` 탑재.
- **P3 무결점 컴플라이언스 & 헬스 가드 통과 (완료)**: AdSense Auto Ads 계약, OAuth keepalive, 터치 타깃 0 이슈, 105개 스크리너 라이브 테스트 및 Health Guard ALL PASS.

## Latest release: Relationship & Emotion Assessment Attribution (`attachment-style b28272d`, `emotion-iceberg 8563df3`, `portal e8b2384`)

- **Attachment Style & Emotion Iceberg 상호 연계 (`attachment-style b28272d`, `emotion-iceberg 8563df3`)**:
  - `attachment-style/js/app.js`: primary CTA/관련 카드 `content_cta_click` 탑재, `source=attachment_style` 파라미터 보존. (사용자 소유 `clarity.*` 불변 유지)
  - `emotion-iceberg/js/app.js`: 4개 다음 단계 카드 `source=emotion_iceberg` 파라미터 보존 및 `content_cta_click` 탑재.
- **고체류 블로그 전환 추적 및 도구 i18n 보존 (`portal e8b2384`)**:
  - `en/kpop-positions-explained` & `zh/avoidant-attachment`: screener sub-CTA에 `data-content-surface="cta"` 및 추적 연결.
  - `brain-game-workout.js` & `emotion-regulation-planner.js`: 영문 접속 시 `?lang=` 제거 방지, 12개 언어 전체 엄격 보존.
  - `zh, ja, hi/what-your-favorite-color-says-about-you`: 누락된 빈 `<h3>` 제목 복구 및 `data-target-slug="brain-type"` 정합성 수정.
- **품질 게이트 및 E2E 전원 통과**:
  - `audit-touch.js`: `attachment-style`, `emotion-iceberg`, `portal` 오버플로 0px, 터치 이슈 0건(PASS).
  - `verify-screener-live.js`: 105개 전체 인터랙티브 스크리너 Chromium 라이브 테스트 ALL PASS.
  - `audit-funnel.js`: 4,034개 파일 정지 링크/텔레메트리 누출 0건(PASS).
  - `indexing-inventory.js --strict`: 1,555개 고유 URL 인벤토리 0 이슈, 0 블로커(PASS).
  - `health-guard.js`: AdSense Auto Ads 계약, 토큰, 비밀값, 문서 예산, 12개 언어 루트 테스트 ALL PASS.
  - IndexNow 즉각 갱신(HTTP 200) 및 `memory/audit-registry.json` HEAD 동기화 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
