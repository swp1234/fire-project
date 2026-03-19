# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-20 (세션270+ 자율: 대규모 블로그 번역 + mental-age 블로그 + 사이트맵 755)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **105개** (projects/ 105 디렉토리, 앱 105 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **775개** (dopamine-detox 12/12, hsp-coping 12/12, stress-mgmt 9/12) |

**앱 분류:** 유틸 12 / 바이럴 테스트 **54** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 8

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료** — 전앱 스크립트 + **10개 인기앱 결과페이지 수동 배치** |
| 분석 | GA4 + GSC + MCP 8개 (on-demand: gemini/gemini-image/reddit/twitter/youtube/trends) |
| 크로스프로모 | **99/99앱** 2x2 그리드 카드 완료 + cross-promo.js 동적 위젯 |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| SEO 스키마 | FAQPage **104/104 (100%)**, BreadcrumbList **104/104 (100%)**, JSON-LD 전앱 |
| 카테고리 허브 | Games(21), **Tests(36)**, Tools, MBTI (4개 랜딩페이지) |
| 런타임 검증 | **Playwright 스모크 테스트** + 게임 루프 try-catch **21/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, TeamCreate/TaskCreate/CronCreate |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **755 URLs**, 피드백 페이지 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. eq-test 바이럴(108u/일) 확인.

---

## 세션 기록

### 세션270+ (3/20) - 자율: 대규모 블로그 번역 + mental-age 블로그 + SEO

**dopamine-detox 블로그 12/12 완성:**
- EN (이전) + ko/zh/hi/ja/ru/es/pt/id/tr/de/fr 번역 완료

**hsp-coping 블로그 12/12 완성:**
- EN (이전) + ko/ja/zh/es/hi/ru/pt/id/de/tr/fr 전체 완료

**stress-management 블로그 9/12:**
- EN (이전) + ko/ja/zh/es/pt/id/tr/de 완료, fr/hi/ru 미완

**mental-age EN 블로그 신규:**
- mental-age-test-brain-quiz-guide.html (500줄, FAQ 6Q, cyan #06b6d4)
- GSC pos87 앱에 대한 콘텐츠 지원

**EN 블로그 크로스링크 강화:**
- dopamine-detox: mental-age + anxiety-type 추가
- hsp-coping: mental-age + toxic-trait 추가, hreflang 12개 언어 추가
- stress-management: mental-age + hsp-test 추가

**KO 블로그 인덱스 업데이트:**
- toxic-trait, hsp-coping, dopamine-detox 3개 항목 추가

**기타:**
- about 페이지: 770+ blogs, 54+ tests 업데이트
- EN blog index: 135+ guides, mental-age 항목 추가, hsp-coping 중복 제거
- 사이트맵 **755 URLs** (+32)

### 세션265-269 (3/20) - 자율: toxic-trait 12/12 + red-flag 12/12 + 내부링크

- toxic-trait 블로그 12/12, red-flag 블로그 11/11 번역 완료
- DE QR 블로그 실번역 (redirect→363줄), 내부링크 대규모 추가
- 홈페이지/MBTI/Games 허브 크로스링크, RU/JA 내부링크 네트워크
- mental-age/stress-response SEO 키워드 확장, 사이트맵 723 URLs

### 세션245-264 (3/19) - 자율 20세션: toxic-trait-test + 블로그 + 크로스링크 + SEO

**GA4/GSC (3/12~18):**
- 7일: 253u/521pv, eq-test 108u (바이럴 유지), overthinker-test 20u/90%bounce
- 신규 앱 성장: stress-response 13u, burnout 10u, red-flag 10u, anxiety 9u, dopamine 8u
- Organic 시작: blood-type blog 12u, mbti/ 8u, brain-type/dark-core 각 1u
- GSC: homepage pos1, numerology pos3, habit-tracker blog pos2, 0clicks 지속

**신규 앱 — toxic-trait-test (105번째):**
- "What's Your Toxic Trait?" 6유형 (Ghoster/Over-Promiser/Passive-Aggressor/Main Character/Serial Canceler/Chronic Comparer)
- --primary: #e11d48, 12개 언어, 배포+Pages+서브모듈 완료

**포탈 개선:**
- 건의사항 페이지 (feedback.html) 12개 언어, footer 링크 추가
- about 페이지 통계 업데이트 (105+ apps, 710+ blogs, 53+ tests)
- tests 허브에 toxic-trait-test 추가 (36개)
- app-data.js에 toxic-trait-test 등록

**overthinker-test 바운스 수정 (90%→):**
- 로더 딜레이 제거, hook question 추가, eq-test/dopamine 크로스링크

**EN 블로그 3개:**
- toxic-trait-test-quiz-guide, red-flag-test-relationship-warning-signs, dopamine-detox-guide-reset-brain

**크로스링크 강화 (6개 앱):**
- eq-test, stress-response, burnout-test, red-flag-test, dopamine-type, anxiety-type → toxic-trait-test 링크 추가

**SEO 키워드 확장:**
- hsp-test: JP/ZH 롱테일 키워드 추가 (GSC 10 impressions)
- stress-check: 롱테일 키워드 추가 (GSC 7 impressions)
- numerology: EN 키워드 추가 (GSC pos3)

### 세션243-244 (3/18-19) - eq-test 바이럴 대응 + 블로그 + HTML 버그

- eq-test FAQ 8Q 확장, SEO 최적화, 블로그 12/12, 크로스링크 5개 앱
- anxiety-type 블로그 12/12, HTML 버그 9개 앱 수정, 하네스 업그레이드

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 241-242 | 3/17 | stress-response(103)+anxiety-type(104) 배포, 블로그 24개 |
| 220-240 | 3/17 | burnout-test(101) 배포, JSON-LD 수정, 내부링크 대규모 |
| 219 | 3/15 | dopamine-type(100) 배포 |
| 209-218 | 3/15 | FAQPage 100%, BreadcrumbList, CTR/바운스 최적화 |
| 188-208 | 3/15 | overthinker-test(98)+red-flag-test(99), 블로그 24개 |
| 173-187 | 3/14 | 전략 전환, ai-personality(97), FAQPage 대규모 |
| 163-172 | 3/13 | 9개 앱/게임 UX 폴리시 (자율 10세션) |
| 143-162 | 3/11-13 | 크로스프로모 95/95, Teams, i18n 전수조사 |
| 1-142 | 2/4-3/10 | 앱96개→, 포털, RS 3D, i18n, 블로그600+, AdSense |

---

## 다음 우선순위

1. **첫 Organic 클릭 확보** — habit-tracker pos2, DE qr-code pos4, RU mbti-coffee pos5
2. **stress-management 나머지 번역** — fr/hi/ru (3개 언어)
3. **mental-age 다국어 블로그** — EN만 존재, 11개 언어 번역 필요
4. **stress-response 성장 가속** — 8u, 콘텐츠 확대
5. **각 언어 블로그 인덱스 업데이트** — 신규 블로그 항목 추가
