# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-10 (세션133)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **98개** (projects/ 98 디렉토리, 앱 96 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **603개** 실측 |

**앱 분류:** 유틸 12 / 바이럴 테스트 **45** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 2

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료(2/20)** ca-pub-3600813755953882 — 전앱 스크립트 확인완료(83/83) |
| 분석 | GA4 + GSC + **Reddit + Twitter + YouTube + Trends(TikTok/IG) + Gemini** MCP 8개 연동 |
| 크로스프로모 | **101앱**, 라이트모드+a11y |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| 접근성 | skip-link 61앱, reduced-motion 61앱, 키보드 4게임 **(100%)** |
| 소셜 공유 | **62앱 (100%)** |
| 구조화 데이터 | JSON-LD 전앱 완료, aggregateRating+publisher 강화 완료 |
| PWA/SW | pwa-install 13앱, SW 등록 완료 **전앱** |
| 카테고리 허브 | Games(21), Tests, Tools, MBTI (4개 랜딩페이지) |
| MBTI Programmatic | **16/16 타입 페이지 완료** |
| 서브모듈 | **73/74** (_common만 tree) |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 785 URLs, .gitattributes 전체 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/mbti/` → `/road-shooter/`

---

## GSC 인덱싱 (3/9 업데이트)

**Indexed 60/62 (97%)** | 이전 미색인 10개 모두 indexed | **Unknown 7+3:** dark-core, soul-age, pick-me, emotional-age, villain-origin, ick-factor, life-in-numbers, emotion-iceberg, mbti-coffee, mbti-city — 사이트맵 등록 완료, 크롤링 대기

---

## 세션 기록

### 세션133 (3/10) - SEO 내부링크 전앱 완료 (95/95)
- **SEO 내부링크 100%** — 세션132(26앱) + 세션133(48앱) = **95/95 앱 완료** (root-domain 제외)
  - 세션133 Batch1: mbti-coffee, mbti-city, mbti-tips, dream-fortune, numerology
  - 세션133 Batch2: villain-type, aura-score, future-self, past-life, animal-personality
  - 세션133 Batch3: color-personality, emotion-temp, emotion-iceberg, sleep-animal, life-in-numbers
  - 세션133 Batch4: name-match, love-frequency, valentine, red-green-flag, would-you-rather
  - 세션133 Batch5: luck-meter, aura-reading, kpop-position, blood-type, biorhythm
  - 세션133 Batch6-10: affirmation, bmi-calculator, color-blindness, color-palette, dday-counter, detox-timer, habit-tracker, lottery, password-generator, pomodoro-timer, qr-generator, quiz-app, routine-planner, sebatdon-calc, seollal-fortune, seollal-greetings, shopping-calc, stress-check, tax-refund-preview, todo-list, unit-converter, white-noise, work-style
- **QA PASS 96 / WARN 0 / FAIL 0**

### 이전 세션 (~132)

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 132 | 3/10 | SEO 내부링크 26앱 (심리/바이럴/MBTI/운세/퀴즈 클러스터) |
| 131 | 3/10 | typing-speed 라이브HUD/콤보 + dev-quiz/quiz-app SFX/햅틱/confetti |
| 130 | 3/10 | Snake 파워업 4종 + Flappy 메달 시스템 + daily-tarot 빌드 수정 |

### 이전 세션 (~129)

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 129 | 3/10 | SEO 내부링크 21게임 + priceCurrency 55앱 + 에셋개선계획 |
| 128 | 3/10 | RS Healer+Splitter 적 2종 + AI 타겟팅 + 접촉충돌 |
| 127 | 3/10 | RS Inferno Dragon 보스 (4종 완성) + 보스 도로범위 clamp |
| 126 | 3/10 | SFX 21/21 완료 (number-puzzle, typing-speed, word-scramble) + typing-speed 난이도 |
| 125 | 3/10 | English-first 96앱 완료 + 도파민 4게임 + SW 등록 21앱 수정 |
| 124 | 3/10 | 에셋 투명도 17PNG + 온보딩 6게임 + SEO 21게임 + NEW BEST 20/21 |
| 123 | 3/10 | Gemini 에셋 31개 + QA PASS 96 + Cross-promo 101앱 |
| 121-122 | 3/10 | /_common/js/ 404 수정 21게임 + QA 자동화 + 블로그 603개 + Gemini MCP |
| 120 | 3/10 | RS 스킨 6종 + 랭킹 보드 (Stage/Endless Top10) |
| 118-119 | 3/10 | 업적 21/21, Monetization 21/21 (4-Layer 완성) |
| 107-110 | 3/10 | 쿠키커터 24개 완료, 신규 앱 4개, quality-gate, 블로그 48개 |
| 104-106 | 3/9 | 복귀, GSC 수정, 인프라 자동화(agents/rules/hooks), 리디자인 5개 |
| 96-103 | 2/20-22 | 버그12+, 바이럴9개, AdSense전수, 쿠키커터7, MCP5 |
| 1-95 | 2/4-20 | 앱96개, 포털, RS 3D, i18n전면, MBTI16, 블로그600+, a11y |

---

## 다음 우선순위

1. **Organic 가속** — 블로그 pos 7~10 → top 5 진입 추적, ~~내부링크 강화~~ ✅ 95/95 완료
2. **GSC 재확인** — 세션104~119 수정사항 반영 확인 (1~2주 후)
3. **기존 앱 품질 개선** — Stop Criteria 기반 성과 점검 후 저성과 앱 개선/정리
4. **Road Shooter 추가 폴리시** — ~~스킨, 랭킹, 새 보스, 새 적~~ ✅ → 밸런스 미세조정, 추가 콘텐츠
5. **신규 게임/앱** — 트렌드 기반 실험 (10% 할당)
