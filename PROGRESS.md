# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-10 (세션126)

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

### 세션126 (3/10) - SFX 시스템 3게임 + typing-speed 난이도 시스템
- **SFX 시스템 추가** — 3개 게임 (Web Audio API + 토글 버튼):
  - number-puzzle: 10 SFX (slide, merge, bigmerge, combo, newtile, win, gameover, newbest, undo)
  - typing-speed: 8 SFX (key, tick, warning, correct, wrong, complete, grade_s, newbest)
  - word-scramble: 11 SFX (select, deselect, correct, wrong, combo, skip, hint, levelup, gameover, newbest, tick)
- **SFX 커버리지 21/21 게임** — 전 게임 사운드 시스템 완료
- **typing-speed 난이도 시스템** — Easy(90s/20w), Normal(60s/30w), Hard(30s/40w) + i18n 12개 언어
- **typing-speed SW 경로 수정** — `/sw.js` → `sw.js` (상대 경로)
- **SW 캐시 범프** — 3개 게임 (number-puzzle v3, typing-speed v3, word-scramble v3)
- **JSON-LD featureList 업데이트** — 3개 게임 Sound Effects/Difficulty 추가
- **QA 전수 통과**: PASS 96 / WARN 0 / FAIL 0

### 세션125 (3/10) - SEO English-first 전면 최적화 + 게임 도파민 폴리시
- **English-first Title 최적화** — **47개 앱** title + og:title + twitter:title 영문화 (전체 96앱 완료)
- **English-first Meta Description** — **39개 앱** description + og:desc + twitter:desc 영문화
- **English-first og/JSON-LD Description** — **~23개 앱** og:description + JSON-LD description 영문화
- **JSON-LD Schema 강화** — **~39개 앱** aggregateRating + publisher 추가
- **게임 도파민 폴리시** — 4개 게임:
  - block-puzzle: confetti on line clear
  - snake-game: floating score text + screen shake on death
  - maze-runner: screen shake on level complete/game over
  - puzzle-2048: confetti on 2048 victory
- **SW 캐시 범프** — 4개 게임 (block-puzzle, snake-game, maze-runner, puzzle-2048)
- **SW 등록 누락 수정** — **21개 앱** (sw.js 존재하나 register 미호출)
- **English featureList** — **14개 앱** JSON-LD featureList 영문화
- **Dopamine Checklist 21/21**: confetti + shake + combo + floating text + NEW BEST 전 게임 완료
- **QA 전수 통과**: PASS 96 / WARN 0 / FAIL 0

### 세션124 (3/10) - 에셋 투명도 전수 수정 + 온보딩 UX + SEO 메타 최적화
- **스프라이트 투명도 전수 수정** — Pillow flood-fill로 17개 PNG 에셋 배경 제거 (8개 게임):
  - flappy-bird(3), snake-game(3), brick-breaker(2), pong-game(2), sky-runner(1), maze-runner(2), minesweeper(2), reaction-test(1)
  - 원인: Gemini 생성 이미지가 불투명 배경/가짜 체커보드 패턴 포함
- **Road Shooter 튜토리얼** — 첫 플레이 시 HOW TO PLAY 오버레이 + ? 버튼 (12개 언어 i18n)
- **게임 온보딩 개선** — 5개 게임에 목표 설명 텍스트 추가 (color-memory, flappy-bird, sky-runner, zigzag-runner, brick-breaker)
- **SEO 전면 최적화** — 21개 게임 English-first 완료:
  - title/OG/Twitter 영문화 + meta description + JSON-LD name 영문화
  - JSON-LD 스키마 강화 5개 (aggregateRating, featureList, publisher)
  - Hreflang 11개 앱 (12언어 + x-default)
- **NEW BEST Flash** — **20/21 게임 완료** (road-shooter 제외 전체 — 자체 랭킹 시스템 보유)
- **Share Score 버튼** — 6개 게임 (puzzle-2048, pong-game, minesweeper, maze-runner, number-puzzle, word-scramble)
- **Dopamine Juice** — 4개 게임 (puzzle-2048, number-puzzle, memory-card, color-memory)
- **SW 캐시 범프** — 6개 게임 + road-shooter v5
- **QA 전수 통과**: PASS 96 / WARN 0 / FAIL 0

### 세션123 (3/10) - Gemini 에셋 UX 업그레이드 + QA 전수 통과 + Cross-promo 확장
- **Gemini 이미지 에셋 생성 + 통합 — 18개 게임/앱, 31개 에셋**:
  - 스프라이트: flappy-bird(4), snake-game(3), brick-breaker(3), pong-game(3), sky-runner(2), maze-runner(2), minesweeper(2), memory-card(1), reaction-test(1)
  - 배경: block-puzzle, stack-tower, puzzle-2048, idle-clicker, word-guess, word-scramble, emoji-merge, number-puzzle, color-blindness
  - 모든 에셋 Pillow 압축 (5~8MB → 1~113KB), 기존 Canvas/CSS 렌더링 폴백 유지
- **Light mode --text 수정** — 8개 앱 (blood-type, bmi-calculator, color-memory, memory-card, routine-planner, todo-list, word-guess, white-noise)
- **live-check.sh 대폭 개선** — sed 기반 CSS 블록 추출 + 변수명 패턴 확장 → **PASS 34→96, WARN 62→0, FAIL 0**
- **SW 캐시 업데이트** — 11개 게임 서비스워커 버전 범프 + 에셋 캐시 등록
- **Cross-promo 확장** — 12개 누락 앱 app-data.js에 추가 (89→101개)

### 세션121-122 (3/10) - 공통 모듈 404 긴급 수정 + QA 자동화 + 11앱 버그 수정 + Gemini MCP
- **긴급 버그 수정** — `/_common/js/` → `/portal/js/` 경로 수정 (21개 게임) + typeof 가드 추가
- **사용자 보고 11앱 전수 수정** — 로드 오류 5개 + 라이트모드 불가시 6개
- **QA 자동화** — `scripts/live-check.sh` (7가지 체크) + `.claude/rules/post-deploy-qa.md`
- **블로그 ~48개** — road-shooter, stack-tower, reaction-test, zigzag-runner × 12개 언어 (총 603개)
- **Gemini MCP 연동** — `@fre4x/gemini` (Imagen 이미지생성, Veo 비디오생성) `.mcp.json` 설정

### 이전 세션 (~120)

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 120 | 3/10 | RS 스킨 6종 + 랭킹 보드 (Stage/Endless Top10) |
| 118-119 | 3/10 | 업적 21/21, Monetization 21/21 (4-Layer 완성) |
| 107-110 | 3/10 | 쿠키커터 24개 완료, 신규 앱 4개, quality-gate, 블로그 48개 |
| 104-106 | 3/9 | 복귀, GSC 수정, 인프라 자동화(agents/rules/hooks), 리디자인 5개 |
| 96-103 | 2/20-22 | 버그12+, 바이럴9개, AdSense전수, 쿠키커터7, MCP5 |
| 1-95 | 2/4-20 | 앱96개, 포털, RS 3D, i18n전면, MBTI16, 블로그600+, a11y |

---

## 다음 우선순위

1. **Organic 가속** — 블로그 pos 7~10 → top 5 진입 추적, 내부링크 강화
2. **GSC 재확인** — 세션104~119 수정사항 반영 확인 (1~2주 후)
3. **기존 앱 품질 개선** — Stop Criteria 기반 성과 점검 후 저성과 앱 개선/정리
4. **Road Shooter 추가 폴리시** — ~~스킨 시스템, 랭킹 보드~~ ✅ → 밸런스 조정, 새 보스
5. **신규 게임/앱** — 트렌드 기반 실험 (10% 할당)
