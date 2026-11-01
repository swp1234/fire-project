# DopaBrain current status

Updated: 2026-11-01 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-01)**: Policy violations 0 (`{}`). 어제 확정 **$0.07**, 7일 누적 **$0.67** (일평균 $0.096, 지속 상승), 30일 누적 **$1.81**. 오늘 **$0.01** 진행 중.
- GA4 실측: Organic Search 84 세션/7d, 핵심 고체류 진입면 (2048 Coach 414s, Future Self 203s, Brain Type 243s, HSP Guide 650s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-01) — 상세 설계: `docs/STRATEGY.md`

- **P0 MBTI 허브·감각 리셋·꿈해몽 전환 추적 통합 (완료)**: `portal/mbti`, `hsp-test` (reset, map), `dream-fortune`에 GA4 `content_cta_click` 탑재 및 터치 규격 44px 준수.
- **P1 관계·감정 핵심 진입면 전환 어트리뷰션 확장 (완료)**: `attachment-style` & `emotion-iceberg` 상호 브릿지, `source` 파라미터 보존, GA4 `content_cta_click` 탑재.
- **P2 포털 도구 및 K-pop 생태계 전환 추적 표준화 (완료)**: `portal` dopamine-detox, kpop-role-roster, brain-game-workout, emotion-regulation-planner 및 `kpop-position` companion card i18n/추적 표준화.
- **P3 무결점 컴플라이언스 & 헬스 가드 통과 (완료)**: AdSense Auto Ads 계약, OAuth keepalive, 터치 타깃 0 이슈, 105개 스크리너 라이브 테스트 및 Health Guard ALL PASS.

## Latest release: Hub & Tool Funnel Continuity (`portal 16314c0`, `hsp-test 005da45`, `dream-fortune 0737c4e`)

- **MBTI Compatibility Matrix & Type Pages (`portal 16314c0`)**:
  - `mbti/index.html`: starter card, surface CTA, next tests pill에 `content_cta_click` 탑재, `?source=portal_mbti` 파라미터 보존, 모바일 터치 타깃 44px 이상 보장.
  - `mbti/type-page-enhancer.js`: hero strip, action rail, bottom CTA에 `content_cta_click` 통일 탑재.
- **HSP Reset Card & Sensory Load Map (`hsp-test 005da45`)**:
  - `reset.js` & `map.js`: 감각 리셋 및 부하 지도 아웃바운드 링크에 `content_cta_click` 탑재, 390x844 오버플로 0px 검증.
- **Dream Fortune Related Assessment Bridge (`dream-fortune 0737c4e`)**:
  - `js/app.js`: 4개 추천 평가 카드(#related-grid a) 클릭 시 `content_cta_click` 탑재, 12개 언어 파라미터 동적 보존.
- **품질 게이트 및 E2E 전원 통과**:
  - `audit-touch.js`: `portal`(53), `hsp-test`(5), `dream-fortune`(19) 오버플로 0px, 터치 이슈 0건(PASS).
  - `audit-funnel.js`: 4,034개 파일 무결점 통과(PASS).
  - `indexing-inventory.js --strict`: 1,555개 고유 URL 인벤토리 0 이슈(PASS).
  - `health-guard.js`: 6개 전체 검사(AdSense 계약, 토큰, 비밀값, 문서 예산, 12개 언어 루트) ALL PASS.
  - IndexNow 즉각 갱신(HTTP 202) 및 `audit-registry.json` HEAD 동기화 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
