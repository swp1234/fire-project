# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-31 (세션338: winner blog CTA 고도화 + habit/stress 유입 보강)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **108개** (projects/ 108 디렉토리, 앱 108 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **1561개** |

**앱 분류:** 유틸 12 / 바이럴 테스트 **57** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 10

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료** — 전앱 스크립트 + 10개 인기앱 수동 배치 + **eq-test AI 프리미엄 실험** |
| 분석 | GA4 + GSC + MCP 8개 (on-demand: gemini/gemini-image/reddit/twitter/youtube/trends) |
| 크로스프로모 | **99/99앱** 2x2 그리드 카드 완료 + cross-promo.js 동적 위젯 |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| SEO 스키마 | FAQPage **104/104 (100%)**, BreadcrumbList **104/104 (100%)**, JSON-LD 전앱 |
| 카테고리 허브 | Games(21), **Tests(39)**, Tools, MBTI (4개 랜딩페이지) |
| OG 이미지 | **107개 앱별 1200×630 PNG** (전앱 완료) + 470+블로그 교체 완료 |
| 런타임 검증 | **Playwright 스모크 테스트 + analytics event harness** + 게임 루프 try-catch **21/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, TeamCreate/TaskCreate/CronCreate |
| 멀티디바이스 | 루트 repo GitHub private (`swp1234/fire-project`) — 데스크톱↔노트북 동기화 |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **1667 URLs**, 피드백 페이지 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. eq-test 바이럴(108u/일) 확인.

---

## 세션 기록

### 세션338 (3/31) - winner blog CTA 고도화 + habit/stress 유입 보강

**#1 유입 발생 winner blog 후속 최적화:**
- `projects/portal/blog/en/blood-type-personality-guide.html`에서 CTA 버튼 묶음을 `Blood Type Test + Attachment Style Guide + EQ Test` 중심으로 재정렬하고, 관련 리스트 상단에도 `EQ Test`와 관계형 가이드를 더 직접 배치
- 같은 파일에 `Best next-click sequence` 안내 박스를 추가해, 유입이 생긴 독자가 `재미형 테스트 → 관계형 가이드 → EQ` 흐름으로 더 자연스럽게 이동하도록 정리
- `projects/portal/blog/en/digital-detox.html`는 툴/관련 글 블록에 `EQ Test`와 `Habit Building Guide`를 직접 넣어 `도구형 클릭`과 `후속 가이드 클릭`을 함께 노림

**#2 유입 미발생 글 보강 준비:**
- `projects/portal/mbti/index.html`의 `next-tests`에서 `Blood Type Guide` 대신 `Habit Building Guide`를 노출해, 아직 유입이 없던 `habit-building`에 허브 진입점을 추가
- `stress-management`는 기존 MBTI 허브 노출을 유지하고, `habit-building`도 같은 관계/자기이해 흐름 안에서 테스트 후속 읽을거리로 밀기 시작

**#3 검증:**
- 추가 GA4 재조회 없이 동일 날짜 제약을 유지하고, 이벤트 하네스만 재실행
- `node scripts/analytics-event-check.js` 결과 `portal`, `portal-tests`, `portal-mbti`, winner blog 4개, `eq-test`까지 **8/8 PASS**
- `ReadLints` 기준 이번 수정 파일들에서 추가 lint 에러 없음

### 세션337 (3/31) - GA4 운영체계 첫 실전 적용 + 허브/블로그 분기 판정

**#1 획득:**
- 같은 날짜에 이미 GA4 조회 기록이 있어 추가 MCP 재조회는 생략하고, 세션333~336에서 확보한 오늘자 GA4 데이터로 `팩1/팩2/팩3`를 첫 실전 적용
- 28일 구조 기준 `Direct 609세션`, `Organic Search 117세션`으로 여전히 Direct 편중이지만, 품질은 Organic이 더 높아 `브랜드/바이럴 유지 + SEO 확장` 이중 전략이 유효
- 랜딩 기준 메인 진입점은 `/eq-test 213`, `/ 85`, `/portal/mbti 34`, `/portal/blog/en/blood-type-personality-guide.html 18`로 요약

**#2 품질:**
- `/eq-test/`는 28일 기준 `engagementRate 62.6%`, `avgSessionDuration 152s`, 최근 3일 기준도 `17세션 / 243s`로 여전히 최강 표면
- `/portal/mbti/`는 28일 기준 평균 체류가 `358s` 수준으로 강한 체류형 허브지만, 분배량은 아직 작아 `좋은 허브`와 `강한 분배 허브`를 구분해 읽어야 함
- 세그먼트 품질은 `ko-kr 262세션 / 169s`, `South Korea 267세션 / 169s`, `mobile 326세션 / 143s`가 강하고, `en-us 373세션 / 42s`, `United States 180세션 / 61s`는 볼륨 대비 품질이 낮음

**#3 전환:**
- 메인 KPI는 여전히 표준 지표 + 안정 이벤트 중심으로 유지: 28일 기준 `eq_test_start 180`, `eq_test_complete 34`, 최근 3일 기준 `hub_view 6`, `hub_test_card_click 1`
- 반면 `premium_*`, `content_*`, `hub_cta_click`, `hub_faq_open`은 오늘까지도 Data API에서 안정적으로 안 보여 보조 KPI 유지
- 허브 → eq-test 흐름은 `중단`보다 `유지`로 판정하되, 추가 미세조정보다 다음 유효 조회일에 실제 세션 증가 여부를 먼저 보는 쪽으로 결정

**#4 재방문:**
- `new 581세션` 대비 `returning 109세션`으로 재방문층은 아직 얇지만, returning 평균 체류는 `263s`로 신규(`75s`)보다 훨씬 깊음
- 최근 기준 `DAU/WAU 0.35`, `WAU/MAU 0.28` 수준이라 루프형 서비스라기보다 아직은 신규 유입 의존 구조
- 따라서 다음 액션도 retention 기능 확장보다 `강한 랜딩 + 허브 유입 + SEO winner 확보`가 우선

**#5 수익/미수집:**
- `totalRevenue`, `totalAdRevenue`, `averageRevenuePerUser`, `adUnitExposure`는 오늘 확보된 데이터에서도 실질 활용 가능한 값이 없어 `미수집`으로 유지
- 수익 판단은 당분간 `eq-test 체류/완주`, `Organic 품질`, `winner blog 세션 발생`을 대리 지표로 사용

**#6 데이터위생:**
- `landingPage`는 `/eq-test`, `pagePath`는 `/eq-test/`처럼 슬래시 규칙이 갈려 있고, `(not set)` 세션도 존재해 해석 시 주의 필요
- `search.google.com / referral 35세션, activeUsers 1`, `Singapore 60세션 / 3s`, `Linux 65세션 / 5s` 등은 이상치/저품질 트래픽 후보로 분리 해석
- winner blog 분류는 28일 기준 `blood-type 발생(18)`, `digital-detox 발생(1)`, `habit-building 미발생(0)`, `stress-management 미발생(0)`으로 잠정 고정

### 세션336 (3/31) - GA4 인사이트 운영 체계 문서화

**#1 KPI 층위 고정:**
- GA4 해석 기준을 `획득 / 품질 / 전환 / 재방문 / 수익 / 데이터위생` 6개 층위로 재정의
- `sessions + 일부 custom event` 중심 해석에서 벗어나 `channel`, `landingPage`, `engagementRate`, `newVsReturning`, `DAU/WAU/MAU`, `revenue` 가능 여부까지 함께 보는 운영체계로 확장
- 특히 Data API에서 아직 불안정한 `premium_*`, `content_*`, `hub_cta_click`, `hub_faq_open`은 메인 KPI가 아니라 보조 KPI로 강등

**#2 세션용 조회 팩/표면별 KPI 설계:**
- `docs/GA4-INSIGHTS.md` 신설로 `28일 스냅샷`, `최근 3일 실험 표면`, `이벤트 건강도`, `조건부 팩` 4개 조회 묶음을 정의
- `app`, `hub`, `blog`, `cross_promo` 표면별 핵심 KPI/보조 KPI/해석 기준을 분리해 같은 숫자를 표면별로 다르게 읽지 않도록 정리
- `PROGRESS.md`에 남길 6줄 요약 템플릿과 `STRATEGY.md` 주간 스냅샷 템플릿도 함께 설계

**#3 운영 문서 연결:**
- `docs/OPERATIONS.md`에 GA4 일간 세션 루틴과 주간 리뷰 루틴을 추가해, 언제 어떤 팩을 보고 어디에 기록할지 명시
- `docs/STRATEGY.md`에는 주간 전략 스냅샷을 6층 구조로 누적하는 규칙을 추가
- `memory/data-check-log.md`에는 팩 번호와 목적을 함께 적는 형식으로 기록 원칙을 보강

**#4 방향성 결론:**
- 앞으로 세션 의사결정은 `custom event 반영 여부` 하나에 매달리지 않고, 표준 GA4 지표 기반 구조 판단을 우선한다
- winner blog는 `세션 발생 → CTA 최적화` 순서로 보고, 세션이 아직 없는 페이지는 유입 확보가 먼저다
- `Direct`/`Organic` 분리, locale별 볼륨/품질 분리, `미수집 수익 지표` 명시가 앞으로의 기본 규칙

### 세션335 (3/31) - traffic-first 허브 유입 강화 + 분석 표면 정리

**#1 측정 게이트 재확인 및 메인 분기 고정:**
- GA4 Data API(2026-03-29~31) 재조회 결과는 여전히 동일: `premium_*`, `content_*`, `hub_cta_click`, `hub_faq_open`은 미반영
- 반면 기준선은 그대로 유지되어 `/eq-test/ 17세션`, `/portal/ 3`, `/portal/mbti/ 3`, `/portal/tests/ 1`, winner blog 4개 `0` 상태 기준 이번 10세션 실행의 메인 축을 `traffic-first`로 확정

**#2 eq-test premium/result 후속 정리:**
- `projects/eq-test/index.html`에서 winner blog 4개 카드에 `data-blog-key`와 언어별 경로 매핑을 추가해, 현재 언어에 따라 가능한 locale 블로그로 우선 연결되도록 정리
- `premium_cta_view`, `premium_unlock_click`, `premium_unlock_complete`, `ai_analysis_view`, `eq_related_click`에 `surface_type=app`, `surface_name=eq_test_result`를 붙여 이후 표면별 비교가 가능하도록 정리
- 결과적으로 premium CTA 강화 작업을 더 하되, 당분간은 카피 미세조정보다 `결과 화면 → 다음 클릭` 구조 해석력을 높이는 쪽이 더 우선이라는 판단을 확정

**#3 portal/tests/mbti traffic 스프린트 구현:**
- `projects/portal/tests/index.html` featured 영역에 `/eq-test/` 카드를 추가하고, `data-app` 기반 카드 이름뿐 아니라 설명까지 locale별 `APP_DATA` shortDesc로 자동 채우도록 보강
- `projects/portal/mbti/index.html`의 `next-tests`를 `EQ Test`, `Attachment Style`, `Blood Type Test`, `Blood Type Guide`, `Stress Management Guide` 중심으로 단순화해 relationship cluster에서 `/eq-test/`와 winner blog로 더 직접 연결되도록 조정
- `projects/portal/index.html`, `projects/portal/tests/index.html`, `projects/portal/mbti/index.html`, `projects/portal/js/cross-promo.js`에 `surface_type` / `surface_name`과 blog locale/slug 등 공통 해석 파라미터를 추가해 hub/blog/app/cross-promo 표면을 같은 기준으로 읽을 수 있게 정리

**#4 방향성/부족한 점 점검 결론:**
- 계속 밀어야 할 것 3개: `eq-test → winner blog` 경로 강화, `portal/tests/mbti` 감정/관계 클러스터 정리, `surface_type` 중심 공통 분석 체계
- 덜 중요한 것 2개: Data API 미반영 상태에서의 premium 카피 소폭 반복실험, 게임/비핵심 허브 CTA 확장
- 보완해야 할 기반 2개: custom event 지연 반영 환경에서의 관찰 기준 통일, winner blog locale 불균형(`habit-building` 단일 언어 등) 해소

**#5 검증:**
- `node scripts/analytics-event-check.js` 재실행 결과 `portal`, `portal-tests`, `portal-mbti`, winner blog 4개, `eq-test`까지 **8/8 PASS**
- `ReadLints` 기준 이번 수정 파일들에서 추가 lint 에러 없음

### 세션334 (3/31) - eq-test CTA 개선 + winner blog 유입 경로 강화

**#1 측정 게이트 재확인 및 분기 결정:**
- GA4 Data API(2026-03-29~31) 재조회에서도 `premium_*`, `content_*`, `hub_cta_click`, `hub_faq_open`은 여전히 미반영
- 반면 `/eq-test/` 세션 17, `/portal/` 3, `/portal/mbti/` 3, `/portal/tests/` 1 기준선은 유지되어 `eq-test` 결과 화면 개선 + winner blog 유입 강화 쪽으로 실행

**#2 eq-test premium CTA 실험 구현:**
- `projects/eq-test/index.html`에서 AI 심층 분석 카드를 personalized tips 위로 올려 결과 화면에서 더 먼저 노출되도록 조정
- teaser 문구를 `preview + previewSecondary + teaserNote` 구조로 정리하고 `Unlock My EQ Roadmap` 계열 CTA로 변경
- `projects/eq-test/js/locales/*.json` 12개 언어에 새 premium teaser/related 라벨 키를 추가해 다국어 렌더링 유지

**#3 winner blog 유입/내부 클릭 최적화:**
- `eq-test` 결과 화면 상단 related 카드 4개를 `digital-detox`, `habit-building`, `stress-management-techniques-guide`, `blood-type-personality-guide`로 교체해 직접 유입 경로 확보
- winner blog 4개 중 `digital-detox`, `habit-building`, `stress-management`, `blood-type`에서 다음 클릭이 더 선명하게 일어나도록 CTA를 후속 가이드/도구 중심으로 조정
- 특히 `habit-building`의 홈 버튼을 제거하고 `Habit Tracker`/`Digital Detox`로 재정렬해 `content_cta_click` 해석력을 높임

**#4 검증:**
- `node scripts/analytics-event-check.js` 실행 결과 `portal`, `portal-tests`, `portal-mbti`, winner blog 4개, `eq-test`까지 **8/8 PASS**
- `ReadLints` 기준 이번 수정 파일들에서 추가 lint 에러 없음

### 세션333 (3/31) - GA4 custom event 재확인 + premium beacon 검증

**#1 GA4 custom event 반영 재확인:**
- GA4 Data API(2026-03-29~31) 기준 `hub_view` 6회, `hub_test_card_click` 1회가 실제 집계 반영된 것 확인
- pagePath 기준 `hub_view`는 `/portal/` 3회, `/portal/mbti/` 2회, `/portal/tests/` 1회 확인
- 반면 `hub_cta_click`, `hub_faq_open`, `content_*`, `premium_*`는 동일 기간 Data API에 아직 미반영

**#2 eq-test premium 전송 경로 판정:**
- `/eq-test/`는 동일 기간 GA4 기준 `sessions=17`, `totalUsers=6`, `eq_test_complete=1`까지 확인
- 운영 도메인 Playwright 점검에서 `window.dataLayer`에 `premium_cta_view`, `premium_unlock_click`, `premium_unlock_complete`, `ai_analysis_view`가 순서대로 push 되는 것 재확인
- 추가로 실제 GA `g/collect` POST body에 `eq_test_complete`, `premium_cta_view`, `premium_unlock_click`, `premium_unlock_complete`, `ai_analysis_view`가 함께 전송되는 것 확인 → 구현 문제보다 집계 지연/저표본 이슈로 판정

**#3 관찰 KPI 고정:**
- Ad slot 관찰 기준은 `/eq-test/`, `/portal/`, `/portal/mbti/`, `/portal/tests/`의 `sessions`, `totalUsers`, `hub_*`/`premium_*` 클릭 이벤트, 다음 클릭 이벤트로 고정
- 현재 기준선은 `/eq-test/` 17세션, `/portal/` 3세션, `/portal/mbti/` 3세션, `/portal/tests/` 1세션
- winner URL 4개(`digital-detox`, `habit-building`, `stress-management`, `blood-type`)는 2026-03-29~31 기간에 pagePath 기준 유입이 없어, 다음 클릭률 비교는 추가 트래픽 유입 후 재측정으로 보류

### 세션332 (3/29) - revenue rollout live deploy + analytics validation

**#1 라이브 배포 정리 완료:**
- `projects/portal` 수익화 커밋을 `origin/main` 최신 7커밋 위로 rebase 후 `83f00fd`로 push
- `projects/eq-test` detached HEAD에 있던 `b37bcb3` premium rollout 커밋을 `master`에 반영 후 push
- 루트 repo는 서브모듈 포인터를 최신 배포 SHA로 갱신하고 `master`에 push

**#2 운영 도메인 반영 확인:**
- `https://dopabrain.com/portal/tests/`에 `hub_view` 포함된 최신 tests hub HTML 반영 확인
- `https://dopabrain.com/portal/mbti/`에 `hub_view` / `next-tests` 포함된 최신 MBTI hub HTML 반영 확인
- `https://dopabrain.com/eq-test/`에 `premium_cta_view` / `btn-ai-unlock` 포함된 최신 premium HTML 반영 확인

**#3 라이브 analytics 검증:**
- 운영 도메인 Playwright 상호작용 기준 `hub_view`, `hub_cta_click`, `hub_faq_open`, `hub_test_card_click`, `content_cta_click`, `content_related_click` 커스텀 GA 요청 실제 발생 확인
- `eq-test`는 headless live page에서 `premium_cta_view`, `premium_unlock_click`, `premium_unlock_complete`가 `window.dataLayer`에 실제 push 되는 것 확인
- 단, GA4 Data API(2026-03-29 조회)에는 새 custom event가 아직 반영되지 않아 집계 지연 여부를 재확인 필요

### 세션331 (3/29) - analytics event smoke harness 검증 완료

**#1 로컬 이벤트 검증 하네스 구축:**
- `scripts/analytics-event-check.js` 추가
- `projects/` 정적 서버 + Playwright + `window.dataLayer`/`gtag` stub 조합으로 외부 GA4 전송 없이 이벤트 발생 여부만 검증
- Google tag / AdSense / 웹폰트 요청은 local smoke 용도로 차단 또는 빈 응답 처리

**#2 winner URL / hub 이벤트 스모크 PASS:**
- `/portal/`, `/portal/tests/`, `/portal/mbti/`, `/eq-test/`, winner blog 4개 페이지 총 **8개 시나리오 PASS**
- `hub_*`, `content_*`, `premium_*`, `eq_related_click` 이벤트가 의도한 사용자 상호작용에서 모두 발생하는 것 확인

**#3 하네스 안정화:**
- tests hub는 `emotion` 필터 적용 후 visible featured 카드만 클릭하도록 수정
- mbti hub는 matrix modal CTA 클릭 뒤 modal close → FAQ → next tests 순으로 재현해 실제 흐름과 동일하게 정리

### 세션330 (3/29) - 10세션 수익화 설계 구현 완료

**#1 광고/프리미엄 노출 구현:**
- `projects/portal/index.html` + `projects/portal/css/style.css`에 실제 AdSense top/bottom slot 적용, 고정형 placeholder는 inline bottom slot으로 전환
- `projects/portal/tests/index.html`, `projects/portal/mbti/index.html`에 본문형 ad slot 추가 및 AdSense init 적용
- `projects/portal/blog/en/digital-detox.html`, `habit-building.html`, `stress-management-techniques-guide.html`, `blood-type-personality-guide.html`에 winner 페이지용 중간/다음행동 직전 광고 구간 추가
- `projects/eq-test/index.html` result screen에 inline ad slot 추가, hidden result 화면 전환 시 1회만 초기화되도록 조정

**#2 저효율 자산 freeze 반영:**
- `projects/portal/index.html` EN blog feed 상단을 `stress-management`, `blood-type`, `digital-detox`, `habit-building`, `personality-tests`, `mbti`, `habit-tracker`, `pomodoro` 중심으로 재정렬
- portal blog category 순서를 `tests/wellness/tools/love` 우선으로 재배치해 게임 노출 비중을 낮춤

**#3 허브 품질 정리:**
- `projects/portal/tests/index.html` JSON-LD item list 중복/누락 정리
- tests hub 메타/배지 수량을 실제 39개 기준으로 보정

**#4 런타임 검증:**
- 임시 정적 서버 기준 `eq-test`, `portal`, `portal/tests`, `portal/mbti`, winner blog 4개 페이지 로딩/JS 에러 스모크 PASS
- 외부 AdSense/서드파티 리소스 400/403은 검증에서 제외하고, 페이지 자체 pageerror/치명적 console error 없음 확인

### 세션322-329 (3/28) - 10세션 수익화 rollout 실행 완료

**#1 허브 퍼널 재정렬 + 이벤트 rollout:**
- `projects/portal/js/app.js` featured 기준을 `eq-test`, `stress-response`, `blood-type` 중심으로 재정렬
- `projects/portal/index.html`에 `hub_view`, `hub_filter_select`, `hub_featured_click`, `hub_test_card_click`, `hub_cta_click` 추가
- `projects/portal/tests/index.html` featured/카드 순서를 수익 우선 테스트 기준으로 재정렬
- `projects/portal/mbti/index.html`에 다음 테스트 섹션과 hub event tracking 추가

**#2 focus / stress / relationship 클러스터 연결 강화:**
- `projects/portal/blog/en/digital-detox.html`에 `habit-tracker`, `pomodoro-timer`, `habit-building` 중심 CTA/related/tool 동선 추가
- `projects/portal/blog/en/habit-building.html`에 tracker 진입 CTA와 `digital-detox` / `stress-management` 연결 강화
- `projects/portal/blog/en/stress-management-techniques-guide.html`를 `stress-response`, `stress-check`, `burnout-test`, `digital-detox` 축으로 재정렬
- `projects/portal/blog/en/blood-type-personality-guide.html`를 `attachment-style`, `mbti-love`, `zodiac-match` 관계 퍼널로 연결

**#3 eq-test premium v2 적용:**
- `projects/eq-test/index.html`에 AI preview teaser + unlock 버튼 상태 복구 로직 추가
- `premium_cta_view`, `premium_unlock_click`, `premium_unlock_complete`, `eq_related_click` 이벤트 추가
- related cards를 `blood-type`, `mbti-love` 기준으로 재정렬해 premium 이후 다음 클릭을 설계

**#4 10세션 설계 정리:**
- 320-329 설계/기준선은 `PROGRESS.md` 기준으로 통합 유지
- 임시 revenue 브리프 문서 정리 완료

### 세션321 (3/28) - Session 2 instrumentation canary on portal/tests

**#1 instrumentation audit:**
- `eq-test`는 기존 이벤트가 충분하고, `portal/tests`/`portal` 허브는 funnel event가 거의 없음을 확인
- Session 2 taxonomy와 rollout 기준 정리

**#2 portal/tests canary 구현:**
- `projects/portal/tests/index.html`에 `hub_view`, `hub_filter_select`, `hub_featured_click`, `hub_test_card_click`, `hub_cta_click`, `hub_faq_open` 추가
- `hub_name=tests` 기준으로 filter/card/CTA 사용 흐름을 측정 가능하게 구성

### 세션320 (3/28) - 10세션 수익화 스프린트 설계 + baseline 확정

**#1 수익화 운영 설계 문서화:**
- Sessions 320-329 기준 KPI, winner URL, 자동진행 규칙, 토큰 효율 규칙 고정

**#2 Session 1 baseline 확정 (3/21-27):**
- GA4 기준 `eq-test` 43세션 / 76.4초, `/portal/` 10세션 / 75.5초, `/portal/mbti/` 8세션 / 1027초 확인
- GSC 기준 `digital-detox` 1클릭 pos4, `stress-management` 16imp pos10.56, `blood-type` pos2, `habit-building` pos1 확인

**#3 sprint 작업 범위 고정:**
- winner URL 15개 및 cluster 3개 고정
- Session 2 진입조건과 target files 정리

### 세션319 (3/27) - portal skip-link 보강 + quality gate 경고 해소

**#1 portal 홈 접근성 보강:**
- `projects/portal/index.html`에 skip-link 추가
- 기존 CSS에 맞춰 `#app-grid`로 바로 이동 가능하게 연결

**#2 품질 게이트 재검증:**
- `projects/portal` quality gate 재실행
- 기존 warning이던 `Skip-link (a11y) missing` 해소
- portal quality gate 결과 `PASS / 0 warning`

### 세션318 (3/27) - blood-type 페이지 체류 경로 보강

**#1 blood-type personality guide 보강:**
- `projects/portal/blog/en/blood-type-personality-guide.html`에 심리 기반 후속 탐색 문단 추가
- `attachment-style-quiz-guide` + `EQ test` 연결로 pop-culture → psychology 흐름 강화

**#2 related content 확장:**
- Related Content에 `Attachment Style Guide`, `Healthy Boundaries Guide` 추가
- 혈액형 글 유입을 관계/성격 클러스터로 분산되도록 보강

### 세션317 (3/27) - digital-detox / habit-building 전환 동선 강화

**#1 digital-detox 후속 행동 설계:**
- `projects/portal/blog/en/digital-detox.html` 본문에 `habit-building` 연결 문장 추가
- Related Articles에 `How to Build Better Habits`, `Nervous System Regulation Techniques` 카드 추가

**#2 habit-building 유지율 보강:**
- `projects/portal/blog/en/habit-building.html`에 digital-detox + stress-management 연결 문단 추가
- Related Articles에 `Nervous System Regulation Techniques` 카드 추가

### 세션316 (3/27) - sensory / fawn / somatic 링크망 확장

**#1 sensory-overload 허브 확장:**
- `projects/portal/blog/en/sensory-overload-hsp-coping.html`에 `digital-detox` 연결 문장 추가
- related links에 `Somatic Anxiety Guide`, `Digital Detox Guide` 추가

**#2 people-pleasing / somatic 보강:**
- `projects/portal/blog/en/people-pleasing-fawn-response-guide.html` related resources에 `Nervous System Regulation`, `Somatic Anxiety` 추가
- `projects/portal/blog/en/somatic-anxiety-body-symptoms.html` related reading에 `sensory-overload`, `people-pleasing` 추가

### 세션315 (3/27) - nervous-system 허브 강화

**#1 dive reflex 허브 연결:**
- `projects/portal/blog/en/nervous-system-regulation-techniques.html` cold exposure 섹션에 stress-management 연결 문단 추가
- `dive reflex` 의도 검색이 stress-management와 상호 보강되도록 연결

**#2 stress cluster 상호링크 확대:**
- Related Reading에 `sensory-overload-hsp-coping`, `somatic-anxiety-body-symptoms`, `people-pleasing-fawn-response-guide` 추가
- nervous-system 글을 stress cluster 허브 역할로 강화

### 세션314 (3/27) - GSC/GA4 점검 + stress-management SEO 보강

**#1 배치9 진행 상태 재점검:**
- portal 최신 상태 기준 배치9 12언어 5토픽 번역 완료
- 배치9 인덱스 12언어 반영 완료 확인

**#2 GA4/GSC 점검 (3/21-27):**
- `stress-management-techniques-guide` 쿼리 `"dive reflex" "escape-avoidance"` 9imp / pos10.56
- GA4 최근 7일: `digital-detox` 1세션 / 76.8초, `blood-type-personality-guide` 2세션
- 최근 윈도우 기준 digital-detox / habit-building / blood-type는 GSC 쿼리 데이터 제한적

**#3 stress-management SEO 보강:**
- `projects/portal/blog/en/stress-management-techniques-guide.html` 인코딩 깨짐 문구 정리
- meta description / keywords에 `dive reflex stress relief` 강화
- FAQ JSON-LD + 본문 FAQ에 `dive reflex` / `escape-avoidance coping` 추가
- Fleer 섹션에 escape-avoidance coping 설명 + digital-detox 내부링크 추가

### 세션313 (3/27) - 배치9 JA/ES 인덱스 카드 반영 + 자동화 스크립트

**#1 배치9 인덱스 자동화 스크립트 추가:**
- `scripts/update_batch9_indexes.py` 추가
- 배치9 5개 글이 모두 존재하는 언어에만 index.html 카드 5개를 자동 삽입하도록 구성

**#2 JA/ES 블로그 인덱스 업데이트:**
- JA index +5카드 완료
- ES index +5카드 완료

**#3 진행 현황 정리:**
- 배치9 인덱스 반영 완료 언어: KO / ZH / JA / ES
- HI는 gaslighting 1개 미완으로 보류
- RU/PT/ID/TR/DE/FR는 번역 완료 후 동일 스크립트로 즉시 반영 가능

### 세션312 (3/27) - GA4/GSC 분석 + digital-detox 역링크 + 배치9 EN/KO 블로그

**#1 GA4/GSC 분석 (3/20-26):**
- 138u/266pv/7d, Direct79%/Organic12%(124s체류/29%bounce 우수)
- 3/23 스파이크 53u, trauma-response 12u/0%bounce, eq-test 11u/76s
- **GSC 1click! digital-detox(pos4/CTR100%)**, stress-management 23imp/pos10.5
- "dive reflex" 9imp/pos10.6, habit-building pos1, blood-type pos2

**#2 digital-detox 내부링크 강화 (14→21개):**
- dopamine-type, overthinking-at-night, rumination, functional-freeze, nervous-system-regulation, self-compassion, stress-management 7개 블로그에 링크 추가

**#3 배치8 사이트맵 누락 수정 (+60 URLs):**
- maladaptive-daydreaming, burnout-vs-depression, decision-fatigue, functional-freeze, doom-scrolling × 12언어

**#4 배치9 EN 블로그 5개 신규 생성:**
- attachment-style-quiz-guide, people-pleasing-fawn-response-guide, emotional-exhaustion-signs-recovery, boundaries-setting-complete-guide, gaslighting-signs-recovery-guide

**#5 배치9 KO 번역 5/5 완료**

**#6 배치9 다국어 번역 (29/30 완료):**
- ZH 5/5 ✓, JA 5/5 ✓, ES 5/5 ✓, HI 4/5 (gaslighting 1개 미완)
- RU/PT/ID/TR/DE/FR 6개 언어 미시작

**#7 인덱스 업데이트:**
- EN index +5카드, KO index +5카드, ZH index +5카드

**배포:** portal 8+ push, 사이트맵 **1732 URLs** (+65), 블로그 **1551+개**

### 세션311 (3/27) - 실시간 모델 사용량 모니터링 시스템 구축

**#1 실시간 모델 사용량 대시보드 (Customization):**
- `.mcp-servers/gemini-mcp-server` 로컬화 및 토큰 트래킹 로직 삽입.
- `memory/llm_usage.json` 자동 로그 시스템 구축.
- `tools/usage-dashboard.html` 구현 (Glassmorphism 2.0, Dark Mode).
- 사용자가 실시간으로 AI 비용 및 모델별 점유율을 모니터링할 수 있는 인프라 구축.

**#2 MCP 인프라 최적화:**
- 외부 npx 호출 방식 대신 로컬 빌드 바이너리 (`node build/index.js`) 사용으로 전환.
- 지연 시간 단축 및 커스텀 트래킹 가능하도록 구조 변경.

### 세션310 (3/27) - 모델 가이드 수립 + 배치8 EN/KO/ZH 풀사이클

**#1 모델별 전문성 가이드 수립:**
- `docs/MODEL_GUIDELINES.md` 작성. (Flash=워커, Pro=분석, Sonnet=실무, Opus=전략)
- 업무 발생 시 최적 모델 자동 제안 및 전환 규칙 적용.

**#2 배치8 블로그 콘텐츠 확장 (진행률 25%):**
- **EN (5/5)**: maladaptive-daydreaming, burnout-vs-depression, decision-fatigue, functional-freeze, doom-scrolling 생성 및 인덱스 반영.
- **KO (5/5)**: 5개 주제 완벽 번역 및 KO 인덱스 카드 5개 추가.
- **ZH (5/5)**: 5개 주제 완벽 번역 및 ZH 인덱스 카드 5개 추가.

**#3 운영 전략:**
- 사용자의 '자율 판단 및 즉시 실행' 지침에 따라 명령어 대기 없이 순차적 대량 생산 수행.
- 모든 파일 commit & push 완료.

**배포:** portal 10+ push, 블로그 **1551개** (+15)

### 세션309 (3/26) - 배치6완료 + 배치7 풀사이클 + CTR 최적화

**#1 GA4/GSC 분석 (3/19-25):**
- 153u/183s/311pv, Organic 17u/143s체류/36%bounce
- 3/23 스파이크 53u (바이럴 추정)
- stress-management pos10.45/20imp, blood-type pos2, habit-building pos1
- Top: eq-test(13u/51s), toxic-trait(14u), trauma-response(12u)

**#2 배치6 다국어 잔여 40/40 완료:**
- dysregulation/dissociation/hypervigilance/codependency × 10언어 전량

**#3 EN 배치7 블로그 5개 신규:**
- complex-ptsd-symptoms-recovery, emotional-unavailability-signs-dating
- sensory-overload-hsp-coping, rumination-repetitive-thinking-stop
- somatic-anxiety-body-symptoms

**#4 KO 배치7 5/5 완료**

**#5 다국어 배치7 50/50 전량 완료**

**#6 stress-management CTR 최적화:**
- 내부링크 +4개 (dysregulation, dissociation, trauma-bonding, codependency → stress-management)
- 키워드 강화 (dive reflex, fight flight freeze fawn)

**#7 인프라:** 사이트맵 1667 URLs, EN/KO 블로그 인덱스 +5카드, 사이트맵 구조 수정

**배포:** portal 5+ push, 블로그 1536개

### 세션308 (3/25) - SEO 강화 + bounce 개선 (데스크탑 재개)

**#4 trauma-bonding HI 번역 완료** (배치6 미완 1개 마무리, 블로그 1405개)

**#5 stress-management 추가 역링크 +5개** (anxiety-type-guide, stress-vs-anxiety, burnout-test-guide, stress-check-test-guide, perfectionism-anxiety-quiz)

**배포:** toxic-trait-test + inner-child-test + portal 5회 push 완료

### 세션304-307 (3/25) - EN배치5+6(10개) + KO10 + 다국어50/50 + 내부링크13

**#1 EN 롱테일 블로그 10개 (배치5+6, 총 45개):**
- 배치5: imposter-syndrome, emotional-numbness, narcissistic-abuse, abandonment-issues, self-compassion
- 배치6: trauma-bonding, emotional-dysregulation, dissociation, hypervigilance, codependency-recovery

**#2 KO 번역 10/10 완료** ✓

**#3 다국어 50/50 전량 완료** ✓ (배치5 토픽 × 10언어)

**#4 배치6 다국어 시작:** trauma-bonding 9/10 완료 (HI 미완)

**#5 내부링크 +13개 + EN/KO 블로그 인덱스 +5카드 + 사이트맵 1607 URLs**

**배포:** portal 35+ push, 블로그 1404개

### 세션299-302 (3/25) 요약

| 세션 | 주요 작업 |
|------|----------|
| 302 | 다국어4차 30/30 + 내부링크+12 + 깨진링크158개수정 + 사이트맵1487 |
| 300-301 | EN롱테일배치4(5개) + KO5 + 내부링크+7 + 사이트맵1437 |
| 299 | 다국어3차 50/50완료 + JSON-LD조사 + canonical검증 |

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 294-298 | 3/23-25 | EN롱테일30 + page_engage107앱 + OG이미지107 + 다국어155 + cross-promo991블로그 |
| 289-293 | 3/23-24 | trauma-response(108앱) + result-card전앱 + canonical대수술 + KO롱테일20 |
| 285-288 | 3/23 | shadow-work(106)+inner-child(107) 풀빌드 + 블로그 + 백업 |
| 282-284 | 3/23 | 전략 재점검 + 홈/포털 재설계 + 멀티디바이스 + AI 프리미엄 |
| 245-281 | 3/19-22 | toxic-trait(105)+red-flag + 대규모 번역 + SEO 첫 클릭 |
| 209-244 | 3/15-19 | dopamine(100)+burnout(101)+stress(103)+anxiety(104) + FAQPage 100% |
| 173-208 | 3/14-15 | 전략 전환 + ai-personality(97)+overthinker(98)+red-flag(99) |
| 1-172 | 2/4-3/13 | 앱96개→, 포털, i18n, 블로그600+, AdSense, 크로스프로모 |

---

## 다음 우선순위

1. **다음 유효 조회일 GA4 재확인** — 같은 날짜 재조회는 건너뛰고, 다음 집계 반영일에 `팩1/팩2/팩3`을 다시 돌려 허브 → eq-test 실제 상승 여부를 수치로 확인
2. **winner blog 분기 실행** — `blood-type`, `digital-detox`는 CTA/related 최적화 후보로, `habit-building`, `stress-management`는 locale 확장/유입 확보 후보로 분리 실행
3. **허브 유지 관찰** — `/portal/mbti/` 체류형 강점은 유지하되 `/portal/tests/`와 `/portal/`은 eq-test 분배효율이 실제로 오르지 않으면 추가 미세조정보다 다른 유입 축 검토
4. **보조 KPI 상태 재점검** — `premium_*`, `content_*`, `hub_cta_click`, `hub_faq_open`이 여전히 안 보이면 다음 세션도 메인 판단은 표준 지표 중심 유지
5. **주간 전략 루프 고정** — `STRATEGY.md`의 6층 스냅샷을 다음 주부터 매주 갱신해 세션 로그와 전략 문서가 같은 구조를 쓰도록 유지
