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

## Latest release: SG Bot Scan Guard, GSC Sitemap Sync, High-Dwell Touch & Multilingual Retention (`portal 56f00a6`, `brain-type ae04ef5`, `stress-check dbc7532`)

- **포털 도구 봇 스캔 가드 지연 방어**: GA4 실측에서 확인된 싱가포르 데스크톱 다이렉트 봇 트래픽(0s 이탈)의 광고 요청을 지연·차단하여 eCPM 희석 방어 (`portal 56f00a6`).
- **GSC 전체 사이트맵 및 IndexNow 즉각 동기화**: 3개 사이트맵(1,561개 URL) Google Search Console API 직접 제출 및 IndexNow 갱신 전송 완료.
- **허브 언어 파라미터 보존 및 고체류 터치 규격 완결**: `/portal/tests/`, `/portal/games/` 다국어(`?lang=`) 동기화로 해외 바운스 차단, `stress-check/plan.html` 44px 터치 충족.
- **스키마 신뢰 정합성**: `brain-type` JSON-LD를 사이트맵 `2026-10-27`과 일치시키고 `health-guard` 전 항목 ALL PASS 검증 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
