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
- **P1 30초 반응형 CRO 스크리너 전방위 확장 & 검증 (완료)**: 403개 가이드(108개 신규) 탑재 및 Playwright E2E ALL PASS.
- **P2 색인 인벤토리 & IndexNow 실시간 전송 (완료)**: 1,555개 URL 무결점(0 issue), 갱신 URL IndexNow 200 OK 제출.

## Latest release: Tool Funnel Bridge & CTA Tracking (`portal fdf19d0`, `root-domain 654844e`)

- **포털 도구 퍼널 누수 차단 및 다국어 직결 (`portal fdf19d0`)**:
  - `past-life-story-studio.html` & `js`: 비활성 앱(`/past-life/`) 링크를 핵심 수익화 진입면인 `/future-self/?lang=*&start=1`로 전면 교체. 12개 국어(`ja, es, pt, id, tr, de, fr, ru, hi, ko, zh, en`) 맞춤 문구 제공 및 `content_cta_click` 전환 어트리뷰션 탑재.
  - `past-life-calculator-birthday.html`: 정지 앱 링크를 `past-life-story-studio` 및 `future-self`로 교체, `blog/sitemap.xml` 2026-10-31 동기화.
  - `cross-promo.js`: 블로그 전방위 과거삶 브릿지를 `/future-self/` 10년 시뮬레이터로 직결 및 CTA 전환 추적 추가.
- **멘탈 웰니스 도구 파라미터 보존 및 전환 추적 표준화**:
  - `grounding-exercise.js`, `burnout-stress-differential.js`, `decision-matrix.js`: 브릿지 카드 언어 파라미터(`?lang=*&source=*`) 보존 보장 및 `.bridge-card` 클릭 시 GA4 `content_cta_click` 전송.
- **도구 전수 검증 및 품질 게이트 통과**:
  - `verify-portal-tools.js`: 15개 포털 도구 모바일 390x844 뷰포트 오버플로 0px, $\ge 44\text{px}$ 터치 타깃 전원 PASS.
  - `audit-funnel.js`: 4,034개 파일(블로그/앱/도구 전수) 정지 링크 및 텔레메트리 누출 0건(PASS).
  - `indexing-inventory.js --strict`: 1,555개 URL 0 issues, IndexNow 200 OK.
  - Health Guard: Auto Ads 계약, OAuth 토큰, 비밀값, 문서 예산, 루트 테스트 ALL PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
