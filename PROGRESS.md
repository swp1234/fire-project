# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-10 (세션138)

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

### 세션138 (3/10) - 3게임 고도화 (Flappy Bird + Pong + RS 밸런스)
- **Flappy Bird 게임플레이 확장**
  - 무빙 파이프: score 10+ 후 35% 확률로 상하 진동 파이프 등장 (빨간색 경고)
  - 코인 수집: 파이프 사이 40% 확률 코인 출현 → +2 보너스 점수
- **Pong 볼 이펙트**
  - 볼 트레일: 잔상 효과 (rally 10+ 시 길어짐)
  - 다이나믹 색상: rally 10(노랑) → 15(주황) → 20+(빨강) 색 변화
  - 고 rally 글로우: 10+ rally 시 볼 주변 발광 효과
- **RS 보스 골드 스케일링** — 고정 200 → `200 * bossMul` (세션137 포함)
- **SW 캐시 bump**: flappy-bird v7, pong-game v6
- **QA PASS 96 / WARN 0 / FAIL 0**

### 세션137 (3/10) - RS 보스 골드 스케일링 + 밸런스 감사
- **보스 골드 보상 난이도 비례** — 기존 고정 200골드 → `200 * bossMul`로 스케일링 (Stage 10에서 ~650골드)
- **Frost Wraith 이동 개선** — 더 빠르고 불규칙한 부유 이동 패턴
- **endless.js infernoDragon 충돌 누락 수정** — flame breath/fire trail/meteor 충돌 판정 추가 (세션136 커밋에 포함)
- **전체 밸런스 감사 완료** — 5보스 rotation HP 곡선, 골드 보상, stage difficulty 검증
- **QA PASS 96 / WARN 0 / FAIL 0**

### 세션136 (3/10) - Road Shooter Frost Wraith 5번째 보스 + endless.js 버그 수정
- **Frost Wraith 보스 추가** — HP 200, 아이스 테마, 3 phase 공격
  - Phase 1: ice_shard (6발 부채꼴 빙하 탄막)
  - Phase 2: blizzard (4초 눈보라 + 빙하 비)
  - Phase 3: frost_nova (확산 링 + 탄환 링 + 냉동 구역)
  - 풀 비주얼: 유령 형태, 얼음 왕관, 궤도 빙결정, 서리 아크, 냉동 구역 이펙트
- **Boss rotation 4→5**: zombieTitan → warMachine → stormColossus → infernoDragon → frostWraith
- **endless.js 버그 수정** — infernoDragon 공격(flame breath, fire trail, meteor)의 충돌 판정 누락 수정
- **SW 캐시 v7→v8**
- **QA PASS 96 / WARN 0 / FAIL 0**

### 세션135 (3/10) - GameAchievements 전게임 통합 + DailyStreak 보완
- **GameAchievements 10게임 신규 통합** — block-puzzle, brick-breaker, memory-card, puzzle-2048, word-scramble, maze-runner, number-puzzle, minesweeper, word-guess, emoji-merge
  - 게임별 6개 업적 정의 (점수/게임수/콤보/스테이지 등)
  - 전 게임 통합 완료: 18/19 (idle-clicker 자체 시스템)
- **DailyStreak word-guess 추가** — 19/19 게임 완료
- **게임 공유 모듈 통합률**: SFX 21/21, Haptic 21/21, Confetti 21/21, DailyStreak 19/19, GameAds 19/19, GameAchievements 18/19
- **SW 캐시 버전 bump** — 15게임 (세션134-135 변경분 반영)
- **QA PASS 96 / WARN 0 / FAIL 0**

### 세션134 (3/10) - 도파민 피드백 21/21 게임 완성
- **Confetti 8게임 추가** — pong-game, brick-breaker, memory-card, flappy-bird, snake-game, word-scramble, maze-runner, reaction-test
  - 승리/레벨클리어/NEW BEST 시 confetti 축하 효과
- **Haptic idle-clicker 추가** — light(클릭), medium(업그레이드), heavy(보스킬)
- **도파민 피드백 완성**: SFX 21/21, Haptic 21/21, Confetti 21/21
- **QA PASS 96 / WARN 0 / FAIL 0**

### 세션133 (3/10) - SEO 내부링크 전앱 완료 (95/95)
- **SEO 내부링크 100%** — 세션132(26앱) + 세션133(48앱) = **95/95 앱 완료** (root-domain 제외)
  - 세션133 Batch1: mbti-coffee, mbti-city, mbti-tips, dream-fortune, numerology
  - 세션133 Batch2: villain-type, aura-score, future-self, past-life, animal-personality
  - 세션133 Batch3: color-personality, emotion-temp, emotion-iceberg, sleep-animal, life-in-numbers
  - 세션133 Batch4: name-match, love-frequency, valentine, red-green-flag, would-you-rather
  - 세션133 Batch5: luck-meter, aura-reading, kpop-position, blood-type, biorhythm
  - 세션133 Batch6-10: affirmation, bmi-calculator, color-blindness, color-palette, dday-counter, detox-timer, habit-tracker, lottery, password-generator, pomodoro-timer, qr-generator, quiz-app, routine-planner, sebatdon-calc, seollal-fortune, seollal-greetings, shopping-calc, stress-check, tax-refund-preview, todo-list, unit-converter, white-noise, work-style
- **QA PASS 96 / WARN 0 / FAIL 0**

### 이전 세션 (~134)

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 135 | 3/10 | GameAchievements 10게임 + DailyStreak word-guess + SW bump 15게임 |
| 137 | 3/10 | RS 보스 골드 스케일링 + Frost Wraith 이동 + 밸런스 감사 |
| 136 | 3/10 | Frost Wraith 5번째 보스 + endless.js infernoDragon 충돌 수정 |
| 134 | 3/10 | Confetti 8게임 + Haptic idle-clicker (도파민 피드백 21/21 완성) |
| 133 | 3/10 | SEO 내부링크 48앱 → 전앱 완료 (95/95) |
| 132 | 3/10 | SEO 내부링크 26앱 (심리/바이럴/MBTI/운세/퀴즈 클러스터) |
| 131 | 3/10 | typing-speed 라이브HUD/콤보 + dev-quiz/quiz-app SFX/햅틱/confetti |
| 130 | 3/10 | Snake 파워업 4종 + Flappy 메달 시스템 + daily-tarot 빌드 수정 |

### 이전 세션 (~129)

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 125-129 | 3/10 | SEO 내부링크, RS 적 2종+보스, SFX 21/21, English-first 96앱 |
| 118-124 | 3/10 | 에셋/온보딩/업적/Monetization 완성, 크로스프로모 101앱 |
| 104-110 | 3/9-10 | 복귀+인프라 자동화, 쿠키커터 24개, 신규앱 4개 |
| 1-103 | 2/4-22 | 앱96개, 포털, RS 3D, i18n, MBTI16, 블로그600+, AdSense |

---

## 다음 우선순위

1. **Organic 가속** — 블로그 pos 7~10 → top 5 진입 추적, ~~내부링크 강화~~ ✅ 95/95 완료
2. **GSC 재확인** — 세션104~119 수정사항 반영 확인 (1~2주 후)
3. **기존 앱 품질 개선** — Stop Criteria 기반 성과 점검 후 저성과 앱 개선/정리
4. **Road Shooter 추가 폴리시** — ~~스킨, 랭킹, 새 보스, 새 적~~ ✅ → ~~5번째 보스~~ ✅ → 밸런스 미세조정, 추가 콘텐츠
5. **신규 게임/앱** — 트렌드 기반 실험 (10% 할당)
