# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-23 (세션287: Inner Child Test 빌드 + 크로스링크)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **107개** (projects/ 107 디렉토리, 앱 107 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **1043개** |

**앱 분류:** 유틸 12 / 바이럴 테스트 **56** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 10

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
| 카테고리 허브 | Games(21), **Tests(38)**, Tools, MBTI (4개 랜딩페이지) |
| 런타임 검증 | **Playwright 스모크 테스트** + 게임 루프 try-catch **21/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, TeamCreate/TaskCreate/CronCreate |
| 멀티디바이스 | 루트 repo GitHub private (`swp1234/fire-project`) — 데스크톱↔노트북 동기화 |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **1205 URLs**, 피드백 페이지 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. eq-test 바이럴(108u/일) 확인.

---

## 세션 기록

### 세션287 (3/23) - Inner Child Test 빌드 + 크로스링크 강화

**#1 Shadow Work 크로스링크 강화:**
- EN 블로그 5개에 shadow-work 링크 추가 (toxic-trait, emotion-iceberg, attachment-style, stress-management, hsp-test)

**#2 트렌드 스캔:**
- Gemini 검색으로 후보 분석 → Inner Child Test 선정 (shadow-work 생태계 시너지)

**#3 Inner Child Test 블로그 12개 언어 생성:**
- inner-child-test-quiz-guide.html 12개 언어 (EN 직접 + 11개 에이전트 번역)
- Article/FAQPage/BreadcrumbList 스키마, 6개 유형 해설, 치유 접근법, FAQ 5개
- 12개 블로그 인덱스 업데이트, 사이트맵 12개 URL 추가 (1205 URLs)
- EN 블로그 6개에 inner-child-test 크로스링크 추가

**#4 Inner Child Test (107번째 앱) 풀빌드:**
- 6가지 내면 아이 유형 (버림받은/비난받은/투명한/부모화된/과보호된/놀이하는)
- 5개 차원 (abandonment/shame/trust/autonomy/healing), 8문항, 레이더 차트
- 힐링 어퍼메이션 기능, primary color: #e8913a (warm amber)
- 12개 언어 i18n, dark mode, app-loader, cross-promo, GA4, FAQPage/BreadcrumbList JSON-LD
- 배포: GitHub Pages + 서브모듈 추가 + 포털/Tests허브(38개)/사이트맵(1205 URLs) 등록

### 세션286 (3/23) - Shadow Work 블로그 12개 언어 생성

- shadow-work-quiz-guide.html 12개 언어 블로그 생성 (EN 직접 + 11개 에이전트 번역)
- Article/FAQPage/BreadcrumbList/HowTo 스키마, 7개 섹션, 저널 프롬프트, CTA
- 12개 블로그 인덱스 업데이트, 사이트맵 12개 URL 추가
- portal commit & push 완료, 블로그 1031개

### 세션285 (3/23) - Shadow Work Quiz 신규 앱 + SEO 강화 + bounce 개선

**#1 Shadow Work Quiz (106번째 앱) 풀빌드:**
- 융 심리학 기반 6가지 그림자 아키타입 (PeoplePleaser/Perfectionist/Controller/Avoider/Rebel/Caretaker)
- 5개 차원 (Repression/Projection/Denial/Avoidance/Integration), 8문항, 레이더 차트
- 12개 언어 i18n, dark mode, app-loader, cross-promo, GA4, FAQPage/BreadcrumbList JSON-LD
- primary color: #7c3aed (violet), 저널링 프롬프트 기능
- 배포: GitHub Pages + 서브모듈 추가 + 포털/Tests허브/사이트맵 등록

**#2 SEO 내부링크 강화:**
- stress-management 블로그(pos10.4): hsp-test + overthinker-test에 링크 추가 (총 7개 앱에서 링크)
- shadow-work 크로스링크: eq-test, toxic-trait, anxiety-type에서 링크

**#3 toxic-trait bounce 개선:**
- shadow-work + attachment-style 크로스링크 추가 (related tests 8개로 확대)
- SEO 내부링크 섹션 추가 (footer 전)

**#4 eq-test AI 프리미엄 점검:** 구현 정상, GA4 이벤트 확인, 데이터 수집 대기

**#5 배포:** shadow-work(신규) + portal + eq-test + hsp-test + overthinker-test + toxic-trait-test — 전부 push 완료

### 세션284 (3/23) - 루트 GitHub 동기화 + 멀티디바이스 환경 구축

- 루트 repo를 GitHub에 push (`swp1234/fire-project`, private)
- 서브모듈 포인터 16개 업데이트 + push
- 노트북 환경 구축 가이드 제공 (clone → submodule init → claude code)
- 데스크톱↔노트북 번갈아 사용 가능한 워크플로우 확립

### 세션283 (3/23) - eq-test AI 프리미엄 + attachment-style 프로모션

**#1 eq-test AI Deep Analysis (프리미엄 결과 실험):**
- HTML/CSS/JS 추가: 결과 페이지에 AI 심층 분석 카드 (강점/성장기회/관계패턴/성장로드맵)
- 템플릿 기반 개인화 분석 (점수 프로필에 따라 동적 생성)
- GA4 이벤트 트래킹 (ai_analysis_unlock)
- **12개 언어 i18n 완료** (premium.* + ai.* 키 전체)

**#2 attachment-style 프로모션 (트렌드 #1 → 즉시 노출 강화):**
- 이미 존재하는 앱(12언어 완비) 재발견 → popularity 72로 상향
- eq-test에서 cross-link 추가 (social-battery → attachment-style 교체)
- stress-response/burnout-test/hsp-test/mbti-love에서 cross-link 추가 (5개 앱)
- attachment-style EN 블로그 생성 (FAQPage + HowTo 스키마)
- 사이트맵 1178 URLs, 블로그 1019개

**#3 배포:** eq-test(2회) + stress-response + burnout-test + hsp-test + mbti-love + portal — 전부 push 완료

### 세션282 (3/23) - stress-management 블로그 첫 클릭 푸시 + SEO 내부링크

**GA4 (3/16-22):** 243u/498pv (↓12% post-spike), eq-test 108u/27%bounce(안정), stress-response 14u/7%, toxic-trait 14u/86%(절반봇)
**GSC:** 0clicks, stress-management블로그 18imp/pos10.4(페이지1문턱!), stress-check pos81.6(↑from84), EI블로그 8imp/pos91.6(신규!)

**#1 전략 재점검 (STRATEGY.md 대폭 업데이트):**
- 28일 데이터: 405u, Direct84%/Organic14.6%(227s=3배 참여!), KR=코어(180s), US=봇(9.4s)
- 게임→테스트 전환 확정, 승자 10-15개 심층 강화, 수익 다각화 필요
- 콘텐츠 우선순위: 바이럴 심리테스트 > SEO 블로그 > 허브 > 게임

**#2 홈/포털 재설계:**
- 홈 top-picks: 데이터 기반 인기앱 6개 (eq-test/stress-response/burnout/anxiety/hsp/red-flag)
- 홈 카테고리: 심리테스트 우선 + MBTI/Blog 추가, CTA "100+ 무료 테스트 & 게임"
- 포털 featured: eq-test/stress-response/burnout-test (구 idle-clicker/mbti-love/emotion-temp 교체)
- 포털 popularity: 12개 앱 GA4 데이터 기반 점수 업데이트

**#3 SEO 내부링크 (stress-management 블로그 pos10.4 → 첫클릭 푸시):**
- eq-test(108u): stress-management + How to Improve EQ 블로그 링크
- anxiety-type(10u): stress-management 가이드 링크
- 블로그 7개에서 내부링크 추가 + HowTo 스키마 (Box Breathing)

**#4 트렌드 스캔:** Attachment Style Test 유망 (#1 후보), Shadow Work Quiz (#2)

**#5 모니터링:** GSC 0clicks 유지, toxic-trait 봇50%+, 대기

### 세션281 (3/22) - 버그 수정 + UX 개선 + SEO 강화 + 대규모 번역

- emotion-temp 결과 버그 수정, toxic-trait UX 리프레이밍 (12언어)
- SEO 첫 클릭 캠페인: stress-management 블로그 + 5개 상위 블로그 CTR 최적화
- 10개 앱 12언어 번역 완료, 사이트맵 932→1166 URLs, 블로그 1007개

### 세션280 (3/20-21) - 대규모 번역 + Sonnet 에이전트 속도 최적화

- Sonnet 에이전트 전환 (5배 비용 절감), 15개 블로그 x12언어 번역 완료
- 사이트맵 810→932 URLs, 인덱스 수정, about 페이지 업데이트

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 275+ | 3/20 | 10개 블로그 x12언어 번역 + SEO 강화 (hreflang, 크로스링크) |
| 265-269 | 3/20 | toxic-trait 12/12 + red-flag 12/12 블로그 번역 + 내부링크 |
| 245-264 | 3/19 | toxic-trait-test(105번째 앱) + 블로그 + 크로스링크 + SEO |
| 243-244 | 3/18-19 | eq-test 바이럴 대응, anxiety-type 12/12, HTML 버그 수정 |
| 241-242 | 3/17 | stress-response(103)+anxiety-type(104) 배포, 블로그 24개 |
| 220-240 | 3/17 | burnout-test(101) 배포, JSON-LD 수정, 내부링크 대규모 |
| 209-219 | 3/15 | dopamine-type(100), FAQPage 100%, BreadcrumbList |
| 188-208 | 3/15 | overthinker-test(98)+red-flag-test(99), 블로그 24개 |
| 173-187 | 3/14 | 전략 전환, ai-personality(97), FAQPage 대규모 |
| 1-172 | 2/4-3/13 | 앱96개→, 포털, i18n, 블로그600+, AdSense, 크로스프로모 |

---

## 다음 우선순위

1. **stress-management 블로그 pos 추적** — 내부링크 11개 앱에서 연결, 1-2주 후 확인 (현재 pos10.4)
2. **shadow-work + inner-child-test 모니터링** — 신규 2개 앱 유입/체류 추적
3. **eq-test AI 프리미엄 효과 모니터링** — ai_analysis_unlock 이벤트 데이터 수집
4. **toxic-trait bounce 추적** — 크로스링크 8개 + SEO 섹션 추가 효과 확인
5. **다음 신규 앱 검토** — 트렌드 기반 (Ego Death Test, Trauma Response Test 등)
