# DopaBrain current status

Updated: 2026-11-04 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-04)**: Policy violations 0 (`{}`). 어제(11-03) **$0.04**, 7일 누적 **$0.39**, 30일 누적 **$1.73**. 오늘(11-04) **$0.02** 진행 중. Active View CPM 기반 0클릭 수익 지속.
- GA4 실측: Organic Search 61 세션/7d, 핵심 고체류 진입면 (2048 Coach 414s, HSP Guide 300s, Dopamine Detox 231s, Future Self 130s, Stress Check 85s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-01) — 상세 설계: `docs/STRATEGY.md`

- **P0 도구 카탈로그·MBTI·감각 리셋·꿈해몽 전환 추적 통합 (완료)**: `portal/tools`, `portal/mbti`, `hsp-test`, `dream-fortune` GA4 `content_cta_click` 탑재 및 터치 규격 44px 준수.
- **P1 관계·감정 핵심 진입면 전환 어트리뷰션 확장 (완료)**: `attachment-style` & `emotion-iceberg` 상호 브릿지, `source` 파라미터 보존, GA4 `content_cta_click` 탑재.
- **P2 포털 도구 및 K-pop 생태계 전환 추적 표준화 (완료)**: `portal` dopamine-detox, kpop-role-roster, brain-game-workout, emotion-regulation-planner 및 `kpop-position` companion card i18n/추적 표준화.
- **P3 877개 포털 에디토리얼 글 FAQPage 구조화 데이터 전면 적용 (완료)**: 사이트맵 내 877개 가시적 FAQ 글에 JSON-LD `FAQPage` 스키마 주입 완료 (`portal b6463a3`).
- **P4 카테고리 허브 다국어 보존 및 고체류 터치 최적화 (완료)**: `portal/games` & `portal/tests` 다국어 파라미터(`?lang=`) 전면 보존, 빈 광고 슬롯 제거, `stress-check/plan.html` 44px 터치 규격 충족 (`dbc7532`, `eeec00c`).

## Latest release: Hub Multilingual Retention, High-Dwell Touch Fixes & Editorial FAQ Rich Snippets (`portal eeec00c`, `stress-check dbc7532`)

- **허브 언어 파라미터 보존 및 바운스 차단**: `/portal/tests/` 및 `/portal/games/`에서 해외 사용자가 카드 클릭 시 한국어 기본값으로 튕기던 문제 해결. 모든 카드에 `?lang=` 및 `source=portal_tests/games` 자동 동기화.
- **877개 에디토리얼 FAQPage 스키마 탑재 & IndexNow 즉시 브로드캐스트**: 가시적 Q&A가 존재하는 877개 글에 `FAQPage` 스키마 주입 완료 및 주요 URL IndexNow HTTP 200 전송.
- **터치 규격 및 광고 컨테이너 정리**: `stress-check/plan.html` 체크박스 44px 터치 규격 준수 (`verify:high-dwell` ALL PASS), `portal/tests/` 빈 광고 박스 및 중복 데일리 타로 카드 제거.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
