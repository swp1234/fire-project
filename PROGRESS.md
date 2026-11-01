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

- **P0 도구 카탈로그·MBTI·감각 리셋·꿈해몽 전환 추적 통합 (완료)**: `portal/tools`, `portal/mbti`, `hsp-test` (reset, map), `dream-fortune`에 GA4 `content_cta_click` 탑재 및 터치 규격 44px 준수.
- **P1 관계·감정 핵심 진입면 전환 어트리뷰션 확장 (완료)**: `attachment-style` & `emotion-iceberg` 상호 브릿지, `source` 파라미터 보존, GA4 `content_cta_click` 탑재.
- **P2 포털 도구 및 K-pop 생태계 전환 추적 표준화 (완료)**: `portal` dopamine-detox, kpop-role-roster, brain-game-workout, emotion-regulation-planner 및 `kpop-position` companion card i18n/추적 표준화.
- **P3 무결점 컴플라이언스 & 헬스 가드 통과 (완료)**: AdSense Auto Ads 계약, OAuth keepalive, 터치 타깃 0 이슈, 105개 스크리너 라이브 테스트 및 Health Guard ALL PASS.

## Latest release: Core Assessment Funnels & Touch Compliance (`mbti-love b6c7dcb`, `love-language 3c1bf24`, `dopamine-type 7b3129a`, `inner-child 8f4e6ee`)

- **MBTI Couple Deck & Relationship Flow (`mbti-love b6c7dcb`)**: `deck.css` 모바일 브랜드 버튼 44px 터치 규격 확보, `deck.js` & `app.js` GA4 `content_cta_click` 이벤트 및 `?lang=`/`source` 보존.
- **Love Language & Emotional Age (`love-language 3c1bf24`, `emotional-age 54941ef`)**: 추천 테스트 카드 동적 언어 파라미터 보존 및 `content_cta_click` 어트리뷰션 탑재.
- **Dopamine Type & EQ Test (`dopamine-type 7b3129a`, `eq-test 5b9c24e`, `animal 445c6e1`)**: 15px 모바일 오버플로 수정 (0px 완결), `source` 파라미터 보존 및 `content_cta_click` 탑재.
- **Inner Child & Mental Age (`inner-child-test 8f4e6ee`, `mental-age bd4da5a`, `shadow-work d6c9378`)**: 공유/추천 버튼 44px 터치 규격 수정 (14개 이슈 전멸), 가이드 링크 및 추천 카드 `content_cta_click` 전환 탑재.
- **품질 게이트 및 E2E 통과**: `audit-touch.js` 0px/0이슈, `audit-funnel.js`(4,034파일) PASS, `indexing-inventory.js --strict`(1,555URL) PASS, IndexNow 13개 URL 제출 (HTTP 202), `audit-registry.json` 동기화 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
