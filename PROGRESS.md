# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-24 (세션296: EN 롱테일 30 + 다국어 53 + cross-promo 전블로그)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **108개** (projects/ 108 디렉토리, 앱 108 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **1240개** |

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
| 런타임 검증 | **Playwright 스모크 테스트** + 게임 루프 try-catch **21/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, TeamCreate/TaskCreate/CronCreate |
| 멀티디바이스 | 루트 repo GitHub private (`swp1234/fire-project`) — 데스크톱↔노트북 동기화 |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **1372 URLs**, 피드백 페이지 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. eq-test 바이럴(108u/일) 확인.

---

## 세션 기록

### 세션296 (3/24) - EN 롱테일 30/30 + cross-promo 전블로그 적용

**#1 전체 품질 검증:**
- quality-gate: 107/107 PASS
- live-check: 107/107 PASS (0 FAIL, 0 WARN)

**#2 EN 롱테일 블로그 10개 (배치3, 심리 롱테일):**
- people-pleasing-fawn, codependency, emotional-intelligence-relationships
- nervous-system-regulation, shadow-work-journal-prompts
- inner-child-wounds-types, gaslighting-signs, disorganized-attachment
- emotional-triggers-understanding, self-sabotage-patterns
- EN 롱테일 총 **30/30** 완료

**#3 cross-promo.js 전블로그 적용:**
- EN 136개 + 다국어 855개 = **991개 블로그**에 cross-promo.js 추가
- 이전에 누락되어 있던 블로그 전량 수정

**#4 인프라 업데이트:**
- 사이트맵 +10 URL (1317 URLs)
- EN 블로그 인덱스 10개 항목 추가 + 카운트 업데이트 (165+, tests 50)

**#5 다국어 롱테일 블로그 53개 (5토픽 x 11언어, TR 2개 보류):**
- 토픽: people-pleasing-fawn, gaslighting-signs, shadow-work-journal-prompts, self-sabotage-patterns, inner-child-wounds-types
- KO5 + ZH5 + JA5 + ES5 + PT5 + DE5 + FR5 + RU5 + HI5 + TR3 + ID5 = 53개
- 사이트맵 +55 URL (1372 URLs)
- TR self-sabotage-patterns, inner-child-wounds-types 2개 다음 세션 처리

**배포:** portal push 완료

### 세션295 (3/24) - EN 롱테일 20/20 완료 + bounce 수정 + 내부링크 강화

**#1 inner-child-test 100% bounce 수정:**
- GA4 page_view/quiz_start 이벤트 누락 → 추가
- 스크립트 defer 통일 + app-loader hide를 app.js로 이동

**#2 engagement 이벤트 추가 (false bounce 방지):**
- toxic-trait-test, trauma-response, shadow-work에 5초 page_engage 이벤트 추가

**#3 EN 롱테일 블로그 10개 (2배치 병렬, 총 20/20 완료):**
- 배치A: avoidant-attachment, emotional-neglect, inner-child-healing, toxic-relationship, trauma-4f
- 배치B: workplace-stress, top-10-stress-relief, hsp-workplace, stress-self-diagnosis, dopamine-detox-practical

**#4 stress-management 내부링크 강화 (pos10.4→페이지1 돌파 목표):**
- burnout-symptoms, cbt-overthinking, emotional-regulation, perfectionism-anxiety에 크로스링크 추가 (8→12개)

**#5 인프라 업데이트:**
- 사이트맵 +10 URL (1257 URLs)
- EN 블로그 인덱스 10개 항목 추가 (159개)

**#6 OG 이미지 전앱 완료 (29→107개, +78):**
- 배치1(11): emotion-temp 외 10개
- 배치2(20): emotional-age 외 19개
- 배치3(24): affirmation~numerology
- 배치4(23): password-generator~would-you-rather
- 전 107개 앱 og:image + twitter:image 메타태그 업데이트 + push 완료

**#7 다국어 롱테일 블로그 50개 완료 (10개 언어 × 5토픽 = 전체 완료):**
- 토픽: emotional-regulation, avoidant-attachment, self-esteem, toxic-relationship, workplace-stress
- JA5 + ZH5 + ES5 + PT5 + DE5 + FR5 + RU5 + ID5 + HI5 + TR5 = 50개
- 사이트맵 +50 URL (1307 URLs)

**배포:** inner-child-test, toxic-trait-test, trauma-response, shadow-work, portal + 전앱 push 완료

### 세션294 (3/23) - EN 롱테일 블로그 10개 (KO→EN 확장)

**#1 영어 롱테일 블로그 10개 생성 (2배치 병렬):**
- 배치A: emotional-regulation, attachment-4types, self-esteem, dating-red-flags, cbt-overthinking
- 배치B: burnout-symptoms, anxiety-disorders, healthy-boundaries, perfectionism-anxiety, carl-jung-shadow

**#2 전체 인프라 업데이트:**
- 10개 블로그 앱별 OG 이미지 적용
- 사이트맵 +10 URL (1247 URLs)
- EN 블로그 인덱스 10개 항목 추가 (149개)

**배포:** portal push 완료

### 세션293 (3/23) - 롱테일 클러스터 20/20 완료 + OG 이미지 확대

- KO 롱테일 배치3 (자존감, 감정적방치, 건강한경계, 회피형애착, 완벽주의불안)
- OG 이미지 15개 추가 (14→29개) + 169개 블로그 교체
- 역방향 크로스링크 6개 + 롱테일 클러스터 **20/20 완료**

### 세션292 (3/23) - 롱테일 키워드 클러스터 배치2 (10개 블로그)

- 한국어 롱테일 블로그 10개 (감정조절~MBTI궁합)

### 세션291 (3/23) - 롱테일 클러스터 + OG 이미지 개별화

- KO 롱테일 5개 + OG 이미지 Playwright 자동 생성 14개 + 300+ 블로그 교체

### 세션290 (3/23) - Result Card 전앱 + Canonical 대수술

- result-card.js 10개 앱, toxic-trait bounce 개선, canonical 대수술, trauma-response 블로그 12언어

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 289 | 3/23 | trauma-response(108번째앱) + $1/day 전략 + result-card.js |
| 285-288 | 3/23 | shadow-work(106)+inner-child(107) 풀빌드 + 블로그 + 백업 |
| 282-284 | 3/23 | 전략 재점검 + 홈/포털 재설계 + 멀티디바이스 + AI 프리미엄 |
| 280-281 | 3/20-22 | 대규모 번역 + 버그 수정 + SEO 첫 클릭 캠페인 |
| 265-275 | 3/20 | toxic-trait/red-flag 블로그 번역 + 10개 블로그 x12언어 |
| 245-264 | 3/19 | toxic-trait-test(105번째 앱) + 블로그 + 크로스링크 |
| 209-244 | 3/15-19 | dopamine(100)+burnout(101)+stress(103)+anxiety(104) + FAQPage 100% |
| 173-208 | 3/14-15 | 전략 전환 + ai-personality(97)+overthinker(98)+red-flag(99) |
| 1-172 | 2/4-3/13 | 앱96개→, 포털, i18n, 블로그600+, AdSense, 크로스프로모 |

---

## 다음 우선순위

1. **stress-management pos 추적** — 내부링크 12개, pos10.4 → 첫 클릭 대기 (모니터링)
2. **bounce 효과 모니터링** — inner-child/toxic-trait/trauma/shadow 수정 효과 확인
3. **KO 롱테일 추가 확장** — KO 20개 완료 → 추가 토픽 검토
4. **TR 블로그 2개 보류** — self-sabotage-patterns, inner-child-wounds-types (다음 세션)
5. ~~OG 이미지~~ — **107/107 전앱 완료** ✓
6. ~~cross-promo 전블로그~~ — **991개 블로그 적용 완료** ✓
