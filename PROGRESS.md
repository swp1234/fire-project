# DopaBrain current status

Updated: 2026-10-31 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-31)**: Policy violations 0 (`{}`). 오늘 **$0.06** (진행 중, 어제 실적 조기 달성), 어제 **$0.06**, 7일 누적 **$0.64** (일평균 $0.091, 지속 상승), 이달 누적 **$1.89**.
- GA4 실측 (최근 7일 / 28일): Organic Search 67 세션 중 54 Engaged (참여율 **80.6%**, 총 참여시간 **5,189s**, 세션당 평균 **96s**).
- 고체류 핵심 진입면: 2048 Coach 8,362s(28d), Future Self 1,686s, Stress Check 1,479s, HSP Test 1,115s, HSP Workplace Guide 758s.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 188s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-31) — 상세 설계: `docs/STRATEGY.md`

- **P0 도구 퍼널 누수 차단 & 언어/CTA 전환 추적 표준화 (완료)**: `past-life-story-studio` 및 블로그의 정지 앱 누수 제거(`/future-self/` 직결), 12개어 다국어 로케일 보존 및 GA4 `content_cta_click` 이벤트 전면 탑재.
- **P1 핵심 진입면 전환 어트리뷰션 전면 연결 (완료)**: `stress-check`, `puzzle-2048` Coach, `future-self`, `hsp-test`의 언어/소스 보존 및 `content_cta_click` 탑재.
- **P2 색인 인벤토리 & 검증 하네스 무결점 통과 (완료)**: 1,555개 URL 무결점(0 issue), 105개 스크리너 E2E 및 Health Guard ALL PASS.

## Latest release: Core Assessment Funnel Attribution (`stress-check 732eb63`, `puzzle-2048 331d5f2`, `future-self 935f472`, `hsp-test f0362bd`)

- **2048 Coach & 고체류 진입면 어트리뷰션 (`puzzle-2048 331d5f2`)**:
  - `projects/puzzle-2048/js/coach.js`: 외부 평가 도구(`/brain-type/`, `/iq-test/`) 및 전략 가이드 연결 시 `source=coach_2048` 파라미터 보존. `data-destination` 및 게임 이동 시 GA4 `content_cta_click` 어트리뷰션 전면 연결.
  - 2048 ad-policy baseline & 26개 mutation 테스트 100% 통과(25 mutants 차단).
- **Future Self & HSP Test 전환 추적 (`future-self 935f472`, `hsp-test f0362bd`)**:
  - `future-self/js/app.js`: 결과 화면 애착유형 진입 및 푸터 추천 도구 6종에 `content_cta_click` 탑재.
  - `hsp-test/js/app.js`: 결과 화면 추천 카드 그리드 6종에 `content_cta_click` 이벤트 탑재.
- **스트레스 체크 리셋 플랜 구문 오류 해소 (`stress-check 732eb63`)**:
  - `plan.js` 중복 식별자 선언 결함 제거, `script.js` 및 `library.js`에 전환 어트리뷰션 전면 연결.
- **품질 게이트 및 E2E 통과**:
  - `verify-screener-live.js`: 105개 인터랙티브 스크리너 모바일 터치 및 반응형 상태 전원 PASS.
  - `indexing-inventory.js --strict`: 1,555개 URL 0 issues, IndexNow 200 OK.
  - `audit-funnel.js`: 4,034개 파일 정지 링크 및 텔레메트리 누출 0건(PASS).
  - Health Guard Suite: Auto Ads 계약, OAuth 토큰, 비밀값, 문서 예산, 루트 테스트 ALL PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
