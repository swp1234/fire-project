# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-15 (세션188)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **100개** (projects/ 100 디렉토리, 앱 98 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **627개** (overthinker-test 12개 추가) |

**앱 분류:** 유틸 12 / 바이럴 테스트 **47** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 2 (ai-personality, overthinker-test)

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료** — 전앱 스크립트 + **10개 인기앱 결과페이지 수동 배치** |
| 분석 | GA4 + GSC + MCP 8개 (on-demand: gemini/gemini-image/reddit/twitter/youtube/trends) |
| 크로스프로모 | **95/95앱** 2x2 그리드 카드 완료 + cross-promo.js 동적 위젯 |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| SEO 스키마 | FAQPage **33+앱**, BreadcrumbList **33+앱**, JSON-LD 전앱 |
| 카테고리 허브 | Games(21), **Tests(29)**, Tools, MBTI (4개 랜딩페이지) |
| 런타임 검증 | **Playwright 스모크 테스트** + 게임 루프 try-catch **10/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, runtime-check.sh |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 785+ URLs |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. GSC 노출도 hsp-test(26imp), stress-check(8imp) 등 테스트 중심.

---

## 세션 기록

### 세션188 (3/15) - SEO 강화 + UX 바운스 개선 + 신규 앱

**SEO 스키마 강화 (pos 3~5 앱):**
- numerology: FAQPage(5Q) + BreadcrumbList + og:locale 6개 추가
- affirmation: FAQPage(5Q) + BreadcrumbList + og:locale 6개 + inLanguage 12개 완성
- biorhythm: FAQPage(5Q) + BreadcrumbList + hreflang 8개 + og:locale 12개 + robots 메타

**고바운스 UX 개선 (3개 앱):**
- emotion-iceberg (83%bounce): CTA를 티저 위로 이동, 모바일 티저 숨김, 미니 빙산 opacity 1
- mbti-city (69%bounce): 샘플 블러 제거, 모바일 히어로 축소, CTA→"Start Quiz (2 min)", 파티클 축소, 중간 격려
- mbti-coffee (73%bounce): 샘플 블러 제거, CTA 히어로 직후 이동→"Start 8-Question Quiz", 모바일 압축, 중간 격려

**신규 앱:** overthinker-test (98번째 앱) — "What Type of Overthinker Are You?" 바이럴 심리 테스트
- 8문항, 6유형 (3AM Spiral Thinker, Scenario Architect, Reply Rehearser, Micro-Expression Analyst, Future Catastrophizer, Selective Memory Replayer)
- 12개 언어, FAQPage+BreadcrumbList, quality gate PASS, GitHub Pages 배포 완료

### 세션173-187 (3/14) - 전략 전환 + 대규모 테스트 SEO + 신규 앱

**바운스율 감소 (4개 앱):**
- emotion-iceberg (91%→개선): 랜딩 훅, 퀴즈 페이싱, 결과 개인화
- mbti-coffee/mbti-city: 애니메이션 히어로, 결과 캐러셀, CTA 강화
- animal-personality: 동물 퍼레이드, 결과 캐러셀

**SEO 스키마 대규모 적용 (30+앱):**
- FAQPage + BreadcrumbList: puzzle-2048, hsp-test, stress-check, mbti-city/coffee, emotion-iceberg, color-personality, past-life, aura-reading, blood-type, daily-tarot, love-frequency, brain-type, emotion-temp, future-self, kpop-position, mbti-love/tips, soul-age, pick-me, emotional-age, villain-origin, ick-factor, life-in-numbers, zodiac-match, attachment-style, social-battery, love-language, fortune-cookie, seollal-fortune, valentine, would-you-rather, mbti-career, number-puzzle, qr-generator, password-generator, tax-refund-preview, shopping-calc, dday-counter, habit-tracker

**게임 참여도 강화 (8개 게임):**
- color-memory: 인트로 데모, 튜토리얼, 마일스톤, 스트릭
- zigzag-runner: 즉시 리트라이, 스코어 비교, 난이도 표시, 챌린지
- stack-tower: 콤보, 높이 마일스톤, PB, 빠른 재시작
- emoji-merge: 발견 트래커, NEW! 축하, 콤보, 컬렉션
- idle-clicker: 골드 마일스톤, 프레스티지 티저, 오프라인 보상, 업적
- flappy-bird: 데일리 챌린지, 스피드 모드, 스코어 히스토리
- block-puzzle: 마일스톤, 콤보, PB, 세션 통계
- brick-breaker: 스트릭, 레벨 축하, 파워업 인디케이터

**인프라:**
- Road Shooter 프리즈 버그 수정 (combat.js undefined 변수)
- 게임 루프 try-catch 표준화 (10/21 게임)
- Playwright 런타임 스모크 테스트 구축 (scripts/runtime-check.sh)
- Tests 카테고리 허브 페이지 생성 (/portal/tests/)
- 포털 네비게이션 Tests 허브 연결
- 블로그→테스트 CTA 배너 20개 블로그 삽입
- 10개 인기 테스트 결과페이지 AdSense 수동 배치

**신규 앱:** ai-personality (AI 성격 매칭 테스트) + 12개 언어 블로그

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

1. **overthinker-test 블로그 12개 언어** — blog-writer 에이전트 위임
2. **Organic 클릭 확보** — numerology(pos3), affirmation(pos4), biorhythm(pos5) 모니터링
3. **바이럴 테스트 추가** — overthinker-test 성과 기반 1-2개 더 (트렌드 심리)
4. **블로그 퍼널 확장** — 고노출 테스트별 롱테일 키워드 블로그 추가
5. **바운스 추적** — emotion-iceberg/mbti-city/mbti-coffee 개선 효과 GA4 모니터링
