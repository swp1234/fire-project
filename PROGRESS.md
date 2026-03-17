# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-17 (세션220-240 자율 완료)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **102개** (projects/ 102 디렉토리, 앱 102 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **670개** (dopamine-type 12/12, burnout-test 12/12) |

**앱 분류:** 유틸 12 / 바이럴 테스트 **51** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 5 (ai-personality, overthinker-test, red-flag-test, dopamine-type, burnout-test)

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료** — 전앱 스크립트 + **10개 인기앱 결과페이지 수동 배치** |
| 분석 | GA4 + GSC + MCP 8개 (on-demand: gemini/gemini-image/reddit/twitter/youtube/trends) |
| 크로스프로모 | **99/99앱** 2x2 그리드 카드 완료 + cross-promo.js 동적 위젯 |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| SEO 스키마 | FAQPage **99/99 (100%)**, BreadcrumbList **99/99 (100%)**, JSON-LD 전앱 |
| 카테고리 허브 | Games(21), **Tests(33)**, Tools, MBTI (4개 랜딩페이지) |
| 런타임 검증 | **Playwright 스모크 테스트** + 게임 루프 try-catch **21/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, runtime-check.sh |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **650 URLs** |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. GSC 노출도 hsp-test(26imp), stress-check(8imp) 등 테스트 중심.

---

## 세션 기록

### 세션220-240 (3/17) - 자율 20세션: 인기 콘텐츠 확장 + burnout-test

**GA4/GSC 분석 (3/10~16):**
- 7일: 144u/416pv (↑57%), 3/15 스파이크 42u
- Organic 23u, 체류 334s(5.6분) 역대 최고
- red-flag-test 10u/10%bounce, dopamine-type 8u/0%bounce (신규 앱 즉시 성과)
- dopamine-type GSC 진입: "dopamine quiz" pos65 (배포 2일만에)
- hsp-test 16imp(노출왕), numerology pos3, affirmation pos4 유지
- overthinker-test 20u/90%bounce → 봇 트래픽 확인 (Desktop 19명, 1.5s)

**burnout-test (101번째 앱):**
- "What's Your Burnout Type?" 직업/정서 번아웃 유형 진단
- 8문항, 6유형 (Overachiever/Empathy/Boredom/Invisible/Creative/Digital)
- --primary: #ef4444, 12개 언어, quality gate PASS, 배포 완료
- Tests 허브(33개) + 사이트맵 + app-data 등록 완료

**GSC 구조화 데이터 오류 수정:**
- zh/hsp-test-guide.html FAQPage JSON-LD 따옴표 수정
- zh/dday-counter-guide, habit-tracker-guide, pong-game-guide 3개 추가 수정
- 전체 1044개 JSON-LD 블록 검증 → 0 에러

**내부 링크 강화 (6개 앱):**
- mbti-city, mbti-coffee, emotion-iceberg, ai-personality, red-flag-test에 인기 테스트 크로스링크 추가
- blood-type, future-self EN 블로그에 hsp-test/dopamine-type/red-flag-test 링크

**dopamine-type 블로그:** 12/12 완료

**burnout-test 블로그:** 12/12 완료

**내부 링크 대량 추가 (12개 앱):**
- burnout-test 크로스링크: hsp-test, stress-type, eq-test, animal-personality, mbti-city, emotion-temp, social-battery, attachment-style + 기존 4개
- burnoutTest i18n 키: 8개 앱 x 12개 언어 추가
- EN 블로그 6개에 dopamine-type + burnout-test 관련 링크 추가
- 블로그 인덱스 12개 언어 dopamine-type + burnout-test 엔트리 추가

### 세션219 (3/15) - dopamine-type (100번째 앱) 빌드 + 배포

**dopamine-type (100번째 앱):**
- "What's Your Dopamine Type?" 뇌과학 기반 바이럴 테스트
- 8문항, 6유형 (Thrill Seeker/Deep Diver/Social Spark/Comfort Creator/Challenge Chaser/Novelty Hunter)
- --primary: #f59e0b (앰버/골드), 12개 언어, quality gate PASS
- 신경전달물질 메트릭 (도파민/세로토닌/아드레날린/옥시토신/엔도르핀)
- SEO: SoftwareApplication + FAQPage(5Q) + BreadcrumbList JSON-LD
- CTA pulse 애니메이션, 컨페티, 분석 스텝 애니메이션
- 배포 완료: GitHub Pages + 서브모듈 + portal 등록 + Tests 허브(32개) + 사이트맵
- 내부 링크: 7개 앱에 dopamine-type 관련 링크 추가 (brain-type, hsp-test, stress-check, sleep-animal, eq-test, stress-type, animal-personality)
- 12개 언어 블로그 생성 중 (에이전트, 2/12 완료)

### 세션209-218 (3/15) - 대규모 SEO 스키마 + CTR 최적화 + 바운스 개선

**GA4/GSC 분석 기반 액션:**
- 주간: 92u/400pv, Direct77/Organic19, 0clicks (CTR 전환 필요)
- 신규 GSC 진입: minesweeper(pos6), idle-clicker(pos7)
- HSP 다국어 20+imp, stress-check 193s 체류

**CTR 최적화 (pos3-7 앱):**
- numerology/affirmation/biorhythm/minesweeper/idle-clicker title+description 개선 (에이전트)

**바운스율 추가 개선 (3개 앱):**
- emotion-iceberg: 모바일 히어로 압축, CTA pulse 애니메이션
- mbti-city: CTA를 fold 위로 이동, 모바일 샘플 숨김, CTA pulse
- mbti-coffee: 모바일 히어로 압축, 샘플 숨김, CTA pulse

**FAQPage 전앱 완료 (36→99/99, 100%):**
- 직접: color-blindness, sleep-animal, delulu-score, brainrot-score, work-style + brain-type dopamine keyword
- 에이전트 4배치: 나머지 63개 앱 (테스트/게임/유틸 전체)
- FAQ 확장: hsp-test +3Q(8Q), stress-check +3Q(8Q)
- BreadcrumbList: 90/99앱

**인프라:** 서브모듈 20개 일괄 업데이트

### 세션189-208 (3/15) - 신규 앱 2개 + SEO + 블로그 + 인프라

**신규 앱 2개:**
- red-flag-test (99번째 앱) — "What's Your Red Flag?" 바이럴 심리 테스트
  - 8문항, 6유형, --primary: #dc2626, 12개 언어, quality gate PASS, 배포 완료
- overthinker-test 블로그 12개 언어 + red-flag-test 블로그 12개 언어 생성

**SEO 콘텐츠 강화:**
- hsp-test: meta description 개선, 200+ words SEO 텍스트 상시 노출, 블로그 링크 섹션
- stress-check: meta description 개선, details→div 변환, 블로그 링크 섹션
- EN 롱테일 블로그 4개: HSP signs, stress-vs-anxiety, overthinking-at-night, relationship-red-flags

**게임 try-catch 추가 (5개):**
- minesweeper, puzzle-2048, memory-card, typing-speed (number-puzzle 이미 적용)

**인프라:**
- Tests 허브: overthinker-test + red-flag-test 추가 (31개 테스트)
- 블로그 인덱스 12개 언어 갱신 (EN +6, 기타 +2 each)
- 사이트맵 625+ URLs (+31: 앱 3 + 블로그 28)
- 서브모듈 refs 업데이트 (portal, minesweeper, puzzle-2048)
- app-data.js에 overthinker-test + red-flag-test 등록 완료

### 세션188 (3/15) - SEO 강화 + UX 바운스 개선 + 신규 앱

**SEO 스키마 강화 (pos 3~5 앱):**
- numerology: FAQPage(5Q) + BreadcrumbList + og:locale 6개 추가
- affirmation: FAQPage(5Q) + BreadcrumbList + og:locale 6개 + inLanguage 12개 완성
- biorhythm: FAQPage(5Q) + BreadcrumbList + hreflang 8개 + og:locale 12개 + robots 메타

**고바운스 UX 개선 (3개 앱):**
- emotion-iceberg (83%bounce): CTA를 티저 위로 이동, 모바일 티저 숨김, 미니 빙산 opacity 1
- mbti-city (69%bounce): 샘플 블러 제거, 모바일 히어로 축소, CTA→"Start Quiz (2 min)", 파티클 축소, 중간 격려
- mbti-coffee (73%bounce): 샘플 블러 제거, CTA 히어로 직후 이동→"Start 8-Question Quiz", 모바일 압축, 중간 격려

**신규 앱:** overthinker-test (98번째 앱) — 8문항, 6유형, 12개 언어, 배포 완료

### 세션173-187 (3/14) - 전략 전환 + 대규모 테스트 SEO + 신규 앱

**바운스율 감소 (4개 앱):** emotion-iceberg, mbti-coffee/city, animal-personality
**SEO 스키마 대규모 적용 (30+앱):** FAQPage + BreadcrumbList
**게임 참여도 강화 (8개):** color-memory, zigzag-runner, stack-tower, emoji-merge, idle-clicker, flappy-bird, block-puzzle, brick-breaker
**인프라:** Road Shooter 버그 수정, 게임 try-catch 10/21, Playwright 테스트, Tests 허브, 블로그 CTA 배너, AdSense 수동 배치
**신규 앱:** ai-personality + 12개 언어 블로그

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 163-172 | 3/13 | 9개 앱/게임 UX 폴리시 (자율 10세션) |
| 153-162 | 3/13 | 크로스프로모 95/95, 게임 13종 폴리시 |
| 143-152 | 3/11-13 | Teams, i18n 전수조사, RS 리디자인 |
| 104-142 | 3/9-10 | Brick Breaker, 내부링크, 쿠키커터 24개, 신규앱 4개 |
| 1-103 | 2/4-22 | 앱96개, 포털, RS 3D, i18n, MBTI16, 블로그600+, AdSense |

---

## 다음 우선순위

1. **dopamine-type 블로그 번역 마무리** — ja, es 2개 언어 (에이전트 진행중)
2. **burnout-test 로케일 번역** — 7개 언어 (ja,es,pt,id,tr,de,fr) 영문 → 번역 필요 (에이전트 진행중)
3. **첫 Organic 클릭 확보** — pos3-7 앱 CTR + dopamine-type/burnout-test 인덱싱 모니터링
4. **블로그 퍼널 확장** — 인기 테스트 중심 다국어 롱테일
