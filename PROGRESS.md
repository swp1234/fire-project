# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-10 (세션124)

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
| 구조화 데이터 | JSON-LD 60/61앱 (98%+), Quiz→SoftwareApplication 3앱 수정 |
| PWA/SW | pwa-install 13앱, SW network-first **93/94앱** |
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

### 세션124 (3/10) - 에셋 투명도 전수 수정 + 온보딩 UX + SEO 메타 최적화
- **스프라이트 투명도 전수 수정** — Pillow flood-fill로 17개 PNG 에셋 배경 제거 (8개 게임):
  - flappy-bird(3), snake-game(3), brick-breaker(2), pong-game(2), sky-runner(1), maze-runner(2), minesweeper(2), reaction-test(1)
  - 원인: Gemini 생성 이미지가 불투명 배경/가짜 체커보드 패턴 포함
- **Road Shooter 튜토리얼** — 첫 플레이 시 HOW TO PLAY 오버레이 + ? 버튼 (12개 언어 i18n)
- **게임 온보딩 개선** — 5개 게임에 목표 설명 텍스트 추가 (color-memory, flappy-bird, sky-runner, zigzag-runner, brick-breaker)
- **SEO 메타 최적화** — 10개 앱 title/description 개선 (50-60자 + CTA + "Free Online" + DopaBrain 브랜드)
- **Share Score 버튼** — 6개 게임에 점수 공유 추가 (puzzle-2048, pong-game, minesweeper, maze-runner, number-puzzle, word-scramble)
- **Games Hub 업데이트** — typing-speed 추가, 게임 수 20→21, JSON-LD/FAQ 카운트 수정
- **미커밋 에셋 정리** — 5개 게임 bg-opt.jpg 커밋 (color-blindness, emoji-merge, number-puzzle, word-guess, word-scramble)
- **Dopamine Juice 추가** — 4개 게임 (puzzle-2048, number-puzzle, memory-card, color-memory): floating text, NEW BEST flash, combo, shake
- **SW 캐시 범프** — 6개 게임 (flappy-bird v4, sky-runner v4, brick-breaker v3, color-memory v3, zigzag-runner v2, road-shooter v5)
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

### 세션120 (3/10) - Road Shooter 스킨 시스템 + 랭킹 보드
- **스킨 시스템** (`js/skins.js`, `js/scenes/skin.js`):
  - 6종 스킨: Standard(무료), Desert Storm(800g), Arctic Ops(1500g), Neon Strike(2500g), Shadow Force(4000g), Gold Legion(100회 업적)
  - Canvas filter 기반 (hue-rotate/saturate/brightness), 3D 렌더러 CSS filter 지원
  - 갤러리 씬: 캐릭터 프리뷰, 구매/장착/잠금 표시, 피드백 토스트
  - 골드 싱크: 총 8,800g 소모 가능 → 플레이 동기 + 광고 시청 유도
- **로컬 랭킹 보드** (`js/ranking.js`, `js/scenes/rank.js`):
  - Stage Top 10 + Endless Top 10, 탭 전환
  - 메달(금/은/동) + 날짜/처치/골드 표시, 스크롤 지원
  - 매 스테이지 클리어/엔들리스 종료 시 자동 저장
- **메뉴 UI**: 스킨 버튼(🎨) + 랭킹 버튼(📊) 상단 추가
- **i18n**: 14키 × 12개 언어, SW 캐시 v4

### 세션119 (3/10) - 전 게임 Monetization — 4-Layer ✅ 21/21 완성!
- **공통 모듈**: `_common/js/game-ads.js` — H5 Games Ads (Ad Placement API) 래퍼
  - `adBreak()` interstitial (매 3게임), `adBreak(reward)` rewarded ad
  - `injectRewardButton()` — DOM 게임용 자동 보상 버튼 주입
  - 광고 미로드 시 graceful fallback (게임 진행 차단 없음)
- **Road Shooter Monetization ✅**: Interstitial + Rewarded 2x Gold (12개 언어 i18n)
- **20개 게임 Interstitial** (4개 병렬 에이전트): 매 3게임 game-over 시점
- **20개 게임 Rewarded Ad** (4개 병렬 에이전트):
  - 기존 revive UI 연동 6개: snake, stack-tower, brick-breaker, emoji-merge, sky-runner, zigzag-runner
  - 새 reward 버튼 주입 14개: flappy, block, puzzle-2048, maze, pong, minesweeper, number-puzzle, memory-card, color-memory, word-guess, word-scramble, reaction, typing, idle-clicker
- **4-Layer 완성**: Core✅21 | Meta✅21 | Retention✅21 | **Monetization✅21**

### 세션118 (3/10) - 전 게임 업적 시스템 — Retention ✅ 21/21 달성
- **Road Shooter 업적 시스템** (`js/achievements.js`, `js/scenes/achieve.js`):
  - 20개 마일스톤: 출격(4), 처치(4), 분대(4), 보스(3), 스테이지(2), 엔들리스(2), 골드(1)
  - 골드 보상 (50~5000), 토스트 알림, 트로피 화면, 메뉴 트로피 버튼
  - 12개 언어 i18n (23키 × 12언어), SW 캐시 v2
- **범용 업적 모듈** (`_common/js/achievements.js`): DOM 토스트, Haptic 연동, localStorage 기반
- **9개 아케이드 게임 업적 통합** (3개 병렬 에이전트):
  - snake(7), stack-tower(9), flappy-bird(7), sky-runner(7), zigzag-runner(9), pong(8), color-memory(6), reaction-test(6), typing-speed(7)
- **idle-clicker**: 기존 자체 업적+일일미션 확인 → Retention ✅ 승격
- **GAME-SPEC 업데이트**: **Retention ✅ 21/21** (전 게임 완료!)

### 세션111-117 (3/10) - 게임 고도화 전면 완성 + 상태저장
- **Meta 완성 21/21** + Haptic 21개 + Retention(상태저장 9개+daily-streak 19개) 21/21
- 쿠키커터 24개 전량 완료, 신규 앱 4개, 방향성 수정(70/20/10)

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 107-110 | 3/10 | 쿠키커터 24개 완료, 신규 앱 4개, quality-gate, 블로그 48개 |
| 104-106 | 3/9 | 복귀, GSC 수정, 인프라 자동화(agents/rules/hooks), 리디자인 5개 |
| 100-103 | 2/22 | 쿠키커터 7개, MCP 5개, 주간 리뷰, 인프라 정리 |
| 96-99 | 2/20-21 | 버그12+, 라이트모드10앱, 바이럴9개, AdSense전수, 내부링크 |
| 59-95 | 2/15-20 | RS MVP→3D, 바이럴앱, i18n전면, MBTI16, 블로그130+, GSC404수정 |
| 1-58 | 2/4-15 | 앱62개, 포털, JSON-LD, a11y100%, UX개선 |

---

## 다음 우선순위

1. **Organic 가속** — 블로그 pos 7~10 → top 5 진입 추적, 내부링크 강화
2. **GSC 재확인** — 세션104~119 수정사항 반영 확인 (1~2주 후)
3. **기존 앱 품질 개선** — Stop Criteria 기반 성과 점검 후 저성과 앱 개선/정리
4. **Road Shooter 추가 폴리시** — ~~스킨 시스템, 랭킹 보드~~ ✅ → 밸런스 조정, 새 보스
5. **신규 게임/앱** — 트렌드 기반 실험 (10% 할당)
