# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-15 (세션218)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **100개** (projects/ 100 디렉토리, 앱 100 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **644개** |

**앱 분류:** 유틸 12 / 바이럴 테스트 **49** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 3 (ai-personality, overthinker-test, red-flag-test)

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료** — 전앱 스크립트 + **10개 인기앱 결과페이지 수동 배치** |
| 분석 | GA4 + GSC + MCP 8개 (on-demand: gemini/gemini-image/reddit/twitter/youtube/trends) |
| 크로스프로모 | **99/99앱** 2x2 그리드 카드 완료 + cross-promo.js 동적 위젯 |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| SEO 스키마 | FAQPage **99/99앱 (100%)**, BreadcrumbList **90/99앱**, JSON-LD 전앱 |
| 카테고리 허브 | Games(21), **Tests(31)**, Tools, MBTI (4개 랜딩페이지) |
| 런타임 검증 | **Playwright 스모크 테스트** + 게임 루프 try-catch **18/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, runtime-check.sh |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **624 URLs** |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. GSC 노출도 hsp-test(26imp), stress-check(8imp) 등 테스트 중심.

---

## 세션 기록

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
- 사이트맵 624 URLs (+31: 앱 3 + 블로그 28)
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

1. **첫 Organic 클릭 확보** — pos3-7 앱 CTR 최적화 효과 모니터링
2. **바운스 추적** — emotion-iceberg/mbti-city/mbti-coffee CTA+pulse 효과 GA4 확인
3. **BreadcrumbList 나머지 9앱** — 90/99 완료
4. **바이럴 테스트 신규** — dopamine-type 테스트 (brand keyword "dopamine quiz" pos53 활용)
5. **블로그 퍼널 확장** — blood-type/HSP 다국어 롱테일 추가
