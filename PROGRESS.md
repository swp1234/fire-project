# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-23 (세션283: eq-test AI프리미엄 + attachment-style 프로모션 + 크로스링크)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **105개** (projects/ 105 디렉토리, 앱 105 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **1008개** |

**앱 분류:** 유틸 12 / 바이럴 테스트 **54** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 8

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
| 카테고리 허브 | Games(21), **Tests(36)**, Tools, MBTI (4개 랜딩페이지) |
| 런타임 검증 | **Playwright 스모크 테스트** + 게임 루프 try-catch **21/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, TeamCreate/TaskCreate/CronCreate |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **1167 URLs**, 피드백 페이지 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. eq-test 바이럴(108u/일) 확인.

---

## 세션 기록

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
- 사이트맵 1167 URLs

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

### 세션281 (3/22) - 버그 수정 + UX 개선 + SEO 강화

**버그 수정:**
- emotion-temp 결과 화면 빈 박스 버그 — i18n fallback 미동기화 + CSS overflow hidden 수정 (3파일)
- 다른 7개 테스트 앱 점검 → 동일 버그 없음 확인

**toxic-trait-test UX 개선 (85% → 목표 30% 바운스):**
- 제목 "Toxic Trait" → "Self-Awareness Pattern Test" 리프레이밍
- 버튼 "Expose My Toxic Trait" → "Discover My Pattern"
- 시작 버튼 above-the-fold로 이동, 유형 카드 접기(details)
- 12개 언어 i18n 전체 업데이트

**SEO 강화 — 첫 클릭 확보 캠페인:**
- stress-management 블로그 (pos 10.4): title/desc 최적화 + featured snippet TL;DR 추가 + 내부링크 3개 (stress-response/stress-check/burnout-test→블로그)
- 5개 상위 블로그 CTR 최적화: animal-personality(pos2), decision-making(pos4), psychology-test-best(pos4.7), FR mbti(pos9), snake-game(pos10)
- hsp-test 내부링크 6개 언어 stress-management 블로그에 추가
- mental-age 내부링크: eq-test + dopamine-type에서 추가

**번역 + 사이트맵 (1차):**
- bmi(12/12), free-iq(12/12), block-puzzle(12/12 + 4재번역), minesweeper(12/12) 완료
- 11개 언어 블로그 인덱스 +230항목 + 신규 번역 4종 반영
- 사이트맵 932→**1100 URLs** (+168)

**번역 (2차):**
- stress-check 12/12, zodiac 12/12, reaction-time 12/12, mini-games 12/12, favorite-color 12/12, spirit-animal 12/12 — 전부 완료
- 사이트맵 932→**1166 URLs**, 블로그 913→**1007개** (+94)

### 세션280 (3/20-21) - 대규모 번역 + Sonnet 에이전트 속도 최적화

**속도 최적화 적용:**
- Sonnet 에이전트 전환 (Opus→Sonnet, ~5배 비용 절감)
- 배치 크기 3-4개 언어/에이전트, 메인은 조율만

**블로그 번역 완료 (15개 블로그 신규/보완):**
- dopamine-detox-quiz 12/12, hsp-empath-difference-test 12/12
- perfectionism-anxiety-quiz 12/12, anxiety-types-explained 12/12
- am-i-highly-sensitive-person-signs 12/12 (이전 세션 잔여분)
- relationship-red-flags-quiz 12/12, social-anxiety-signs-test 12/12
- eq-vs-iq-which-matters-more 12/12, how-to-improve-emotional-intelligence 12/12
- habit-tracker-guide 12/12 (ko/id/tr/fr 보완)
- snake-game-guide 11/11, todo-list-guide 11/11 (보완)
- lottery-number-guide 12/12, color-palette-generator 12/12, personality-tests 12/12
- free-games/ko 보완

**인덱스 수정:** 11개 언어 블로그 인덱스 잘못된 파일명 4개 수정 + 중복 제거
**사이트맵:** 810→**932 URLs** (+122)
**about 페이지:** 832→900+ blogs 업데이트

### 세션275+ (3/20) - 자율: 10개 블로그 x12언어 번역 + SEO 강화

**대규모 블로그 번역 (10개 x 11언어):**
- burnout-recovery-guide, stress-vs-anxiety-difference-test, overthinking-at-night-how-to-stop
- fight-flight-freeze-fawn-test, mental-age-test-brain-quiz-guide
- dopamine-detox/hsp-coping/stress-management 각 12/12

**SEO 강화:**
- habit-tracker: hreflang 12언어, 키워드 8개, 크로스링크 3개
- DE qr-code/RU mbti-coffee: hreflang+키워드 확장
- eq-test 블로그 크로스링크, qr-code hreflang 수정

### 세션265-269 (3/20) - 자율: toxic-trait 12/12 + red-flag 12/12 + 내부링크

- toxic-trait 블로그 12/12, red-flag 블로그 11/11 번역 완료
- DE QR 블로그 실번역, 내부링크 대규모 추가
- 사이트맵 723 URLs

### 세션245-264 (3/19) - 자율 20세션: toxic-trait-test + 블로그 + 크로스링크 + SEO

- toxic-trait-test (105번째 앱) 배포
- 건의사항 페이지, overthinker-test 바운스 수정
- EN 블로그 3개, 크로스링크 6개 앱, SEO 키워드 확장

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 243-244 | 3/18-19 | eq-test 바이럴 대응, anxiety-type 12/12, HTML 버그 수정 |
| 241-242 | 3/17 | stress-response(103)+anxiety-type(104) 배포, 블로그 24개 |
| 220-240 | 3/17 | burnout-test(101) 배포, JSON-LD 수정, 내부링크 대규모 |
| 209-219 | 3/15 | dopamine-type(100), FAQPage 100%, BreadcrumbList |
| 188-208 | 3/15 | overthinker-test(98)+red-flag-test(99), 블로그 24개 |
| 173-187 | 3/14 | 전략 전환, ai-personality(97), FAQPage 대규모 |
| 1-172 | 2/4-3/13 | 앱96개→, 포털, i18n, 블로그600+, AdSense, 크로스프로모 |

---

## 다음 우선순위

1. **attachment-style 11개 언어 블로그 번역** — EN 완료, 나머지 11언어 blog-writer 에이전트 위임
2. **stress-management 블로그 pos 추적** — 내부링크 9개 효과 1-2주 후 확인 (현재 pos10.4)
3. **eq-test AI 프리미엄 효과 모니터링** — ai_analysis_unlock 이벤트 추적
4. **toxic-trait UX 리프레이밍 효과** — 3/22 변경 후 1-2주 데이터 확인
5. **홈/포털 재설계 + 크로스링크 효과** — bounce rate, attachment-style 유입 모니터링
