# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-11 (세션42)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | 62개 (projects/) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | 120개+ (EN 20+) |
| i18n JSON | 660개+ |

**앱 목록:** 유틸 12 / 바이럴 테스트 16 / 게임 19 / 도구 10 / 웹 2 / 신규(biorhythm) 1

---

## 인프라

| 항목 | 상태 |
|------|------|
| 도메인 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| AdSense | ca-pub-3600813755953882, 심사 중(2/8), 자동광고, 62앱 적용 |
| GA4 | 속성 523606964, MCP 연동 |
| GSC | siteUrl: `https://dopabrain.com/`, MCP 연동 |
| 크로스프로모 | 57앱 cross-promo.js 적용 |
| i18n 안정화 | 32앱 try-catch 적용 (세션41: +animal-personality) |
| FOUC 수정 | 26앱 app-loader CSS+JS (세션41: +zodiac-match) |
| SW network-first | 16앱+ 전환 완료 |
| 라이트모드 감사 | 9앱 완료 (세션41) |
| 커스텀 명령어 | /analyze, /validate, /new-app, /session-wrap |

**URL 구조:** `/` 랜딩 → `/portal/` 포털 → `/[앱]/` 개별 앱 → `/portal/blog/{lang}/` 블로그

---

## GSC 인덱싱 (2/11)

**Indexed (37/62, 60%):** /, portal, hsp-test, emoji-merge, stack-tower, idle-clicker, mbti-tips, dream-fortune, past-life, kpop-position, sky-runner, zigzag-runner, tax-refund-preview, valentine, love-frequency, block-puzzle, word-guess, puzzle-2048, brain-type, reaction-test, emotion-temp, mbti-love, memory-card, password-generator, maze-runner, number-puzzle, color-personality, numerology, quiz-app, daily-tarot, dday-counter, detox-timer, iq-test, shopping-calc, unit-converter, word-scramble, affirmation

**Discovered (18):** color-memory, typing-speed, pong-game, snake-game, biorhythm, animal-personality, bmi-calculator, stress-check, future-self, zodiac-match, habit-tracker, minesweeper, qr-generator, pomodoro-timer, white-noise, lottery, color-palette, blood-type

**Unknown (3):** flappy-bird, brick-breaker, dev-quiz | **404:** number-merge (사이트맵 제거 필요)

---

## GA4 (2/4~2/10)

| 지표 | 값 |
|------|-----|
| 주간 사용자 | 426명 (2/10 스파이크 260명), 100% Direct |
| TOP5 | /(48), portal(22), idle-clicker(15), past-life(14), hsp-test(13) |
| 최우수 참여 | emoji-merge(0%), brain-type(0%), stack-tower(9%) |
| 100% 이탈 | kpop-position, animal-personality, habit-tracker, number-puzzle, biorhythm |

---

## 세션 기록

### 세션42 (2/11) - Claude Code statusline 토큰/비용 표시 설정

- **statusline 설정:** ~/.claude/statusline.sh — 모델명, 토큰, 비용, 컨텍스트% 표시

### 세션41 (2/11) - 이탈률 수정 + 라이트모드 감사 + BMAD 도구

- **idle-clicker HP 버그 수정:** NG+ 사이클 전환 시 HP 급감 → floor HP 선형보간으로 항상 증가 보장
- **포털 누락앱 3개 추가:** reaction-test, animal-personality, color-personality
- **이탈률 수정 4앱:** animal-personality(로더 try-finally), zodiac-match(app-loader 전체), stress-check(HTML+rec-grid+CSS), bmi-calculator(한국어 locale 3곳)
- **라이트모드 감사 9앱:** root-domain, portal, past-life, hsp-test, zigzag-runner, sky-runner, emotion-temp, stack-tower, emoji-merge
- **memory-card:** 한국어 공유 텍스트 → i18n 전환
- **CLAUDE.md 최적화:** 92→54줄 / **BMAD 커스텀 명령어 4개 생성**
- **GSC 인덱싱:** 15→37페이지 (60%) 확인

### 세션40 (2/10) - 고이탈 8앱 + i18n 전수 안정화 + 포털 정비

- 고이탈 3앱 근본 수정 + 7앱 SW network-first + i18n 13앱 추가 (총31)
- 포털 UI 수정 + 누락앱 3개 추가 + biorhythm SW

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 39 | 2/10 | 게임 버그 + 43앱 정리 + SEO 블로그 16개 |
| 38 | 2/10 | idle-clicker 보스타이머, portal버그, maze-runner 재설계 |
| 37 | 2/10 | word-guess+emoji-merge+pong-game 전면수정 |
| 36 | 2/10 | zigzag/emoji 비차단토스트, minesweeper 다크 |
| 35 | 2/10 | snake-game 치명적 버그(화면겹침) |
| 34 | 2/11 | block-puzzle/maze-runner/typing-speed |
| 33 | 2/11 | i18n 11앱, SEO 블로그 3개, 메타 SEO |
| 32 | 2/11 | i18n 6앱, 크로스프로모 57앱 배포 |
| 31 | 2/11 | FOUC 24앱, 포털 최적화, AdSense 감사 |
| 30 | 2/11 | GA4 버그헌팅, _common 28앱, FOUC 13앱 |
| 1-29 | 2/4~10 | 앱 62개 개발, 포털, 도메인, 인프라, i18n, SEO |

---

## 다음 우선순위

1. **GSC 수동 인덱싱** - Discovered 18개 + Unknown 3개 수동 제출
2. **나머지 앱 라이트모드** - 9앱 완료, 50+ 앱 남음
3. **이탈률 재추적** - 세션41 수정 효과 확인 (zodiac-match, stress-check, animal-personality)
4. **내부링크 강화** - flappy-bird, brick-breaker, dev-quiz (Unknown to Google)
5. **number-merge 404** - 사이트맵 제거
6. **Google Play** - 상위 게임 APK/AAB
7. **신규** - biorhythm 완성
