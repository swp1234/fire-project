# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-12 (세션51)

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
| 크로스프로모 | 58앱 cross-promo.js 적용, **라이트모드+a11y 개선** (세션50) |
| i18n 안정화 | **전체 완료** — i18n.js 초기화 코드 있는 모든 앱 try-catch 적용 (세션45) |
| FOUC 수정 | **60앱 app-loader 적용** (세션45: +9앱으로 전체 완료) |
| SW network-first | 16앱+ 전환 완료 |
| 라이트모드 | **63앱 토글+CSS+JS 완전 적용** (세션50: maze-runner, snake-game, typing-speed 보완) |
| 접근성(a11y) | skip-link 26앱, prefers-reduced-motion 49앱, **키보드 단축키 4게임** (세션51) |
| PWA 설치 | pwa-install.js 5개 인기앱 적용 (세션50) |
| 404 페이지 | **커스텀 404** 다크/라이트 + i18n 12개 언어 (세션50) |
| SW network-first | **28앱+ 전환 완료** (세션51: cache-first 16앱 전환) |
| 커스텀 명령어 | /analyze, /validate, /new-app, /session-wrap |

**URL 구조:** `/` 랜딩 → `/portal/` 포털 → `/[앱]/` 개별 앱 → `/portal/blog/{lang}/` 블로그

---

## GSC 인덱싱 (2/12 재확인)

**Indexed (50/62, 81%):** /, portal, hsp-test, emoji-merge, stack-tower, idle-clicker, mbti-tips, dream-fortune, past-life, kpop-position, sky-runner, zigzag-runner, tax-refund-preview, valentine, love-frequency, block-puzzle, word-guess, puzzle-2048, brain-type, reaction-test, emotion-temp, mbti-love, memory-card, password-generator, maze-runner, number-puzzle, color-personality, numerology, quiz-app, daily-tarot, dday-counter, detox-timer, iq-test, shopping-calc, unit-converter, word-scramble, affirmation, color-memory, typing-speed, pong-game, snake-game, biorhythm, animal-personality, bmi-calculator, stress-check, future-self, zodiac-match, **habit-tracker, pomodoro-timer, white-noise**

**Discovered (9):** minesweeper, flappy-bird, dev-quiz, qr-generator, lottery, color-palette, blood-type, routine-planner, todo-list

**Unknown (1):** brick-breaker (사이트맵 포함, 크롤 대기)

---

## GA4 (2/6~2/12, 세션48 기준)

| 지표 | 값 | 변화 |
|------|-----|------|
| 활성 페이지 | 63개 | 유지 |
| TOP5 | /(58), portal(22), idle-clicker(16), emotion-temp(14), hsp-test(14) | 유지 |
| 최우수 참여 | emoji-merge(0%), brain-type(0%), color-personality(0%), minesweeper(0%), stack-tower(8%), typing-speed(11%) | 유지 |
| 100% 이탈 (5+세션) | **8개:** animal-personality(8), biorhythm(8), number-puzzle(8), mbti-career(7), numerology(7), color-memory(6), color-palette(5), todo-list(5) | 세션47 수정 대기 |
| 85%+ 이탈 | kpop-position(92%), habit-tracker(89%), reaction-test(89%), bmi-calculator(88%), memory-card(88%), zodiac-match(88%), hsp-test(86%) | |
| 신규 고이탈 | future-self(82%,11세션), stress-check(80%,10세션) | 세션48 개선 |
| 랜딩(/) | 58세션, **66% 이탈** 유지, 4.5초 평균 | 안정 |
| GSC 주간 노출 | 총 61건 (pyeongsu-calculator 33건, top-10-browser-games 6건) | 블로그 성장 |

---

## 세션 기록

### 세션51 (2/12) - SEO + 바이럴 + 게임UX + SW전략 (다양한 유형)

- **JSON-LD structured data:** flappy-bird 추가 → 전체 60/61앱 완료 (100%)
- **소셜 공유 버튼 3개 퀴즈앱:**
  - biorhythm, daily-tarot, dev-quiz에 Twitter/X 공유 + URL 복사 버튼 추가
  - 결과 표시 후 공유 섹션 노출 → 바이럴 잠재력 확대
- **게임 키보드 단축키 4개 앱:**
  - block-puzzle: P/Esc 일시정지, R 재시작
  - minesweeper: 화살표 셀 이동, Space/Enter 열기, F 깃발, R 재시작
  - puzzle-2048: WASD 대체키, R 새 게임, U 실행취소
  - word-scramble: A-Z 글자 선택, Enter 제출, Backspace 삭제, Esc 초기화
  - 데스크톱 전용 `<kbd>` 힌트 UI 추가
- **SW cache-first→network-first 전환 (16개 앱):**
  - 캐시 우선 전략으로 최근 업데이트(라이트모드, a11y 등)가 기존 방문자에게 안 보이던 문제 해결
  - 캐시 버전 v1→v2 범프 포함
  - 대상: block-puzzle, blood-type, color-memory, emoji-merge, future-self, habit-tracker, iq-test, maze-runner, mbti-career, mbti-love, numerology, pong-game, todo-list, typing-speed, word-guess, zodiac-match
- **총 24개+ 서브모듈/디렉토리 수정 및 push**

### 세션50 (2/12) - 접근성(a11y) + PWA + 크로스프로모 + 404 페이지

- **prefers-reduced-motion 추가 (8개 앱):**
  - cta-pulse 애니메이션이 있는 앱에 모션 감소 미디어 쿼리 적용
  - 대상: block-puzzle, bmi-calculator, future-self, stress-check, reaction-test, color-memory, animal-personality, mbti-career
- **skip-to-main link + `<main>` 태그 추가 (7개 앱):**
  - 스크린리더/키보드 내비게이션 개선
  - 대상: sky-runner, zigzag-runner, block-puzzle, word-guess, bmi-calculator, animal-personality, emoji-merge
- **PWA 커스텀 설치 프롬프트:**
  - `/portal/js/pwa-install.js` 공유 유틸리티 생성 (beforeinstallprompt 처리)
  - 30초 참여 후 글래스모피즘 배너 표시, 10초 후 자동 숨김, localStorage 기억
  - 5개 인기 앱 적용: idle-clicker, hsp-test, emoji-merge, emotion-temp, brain-type
- **크로스프로모(cross-promo.js) 개선:**
  - 라이트모드 CSS 추가 (58개 앱에 즉시 반영)
  - `<nav>` 시맨틱 태그 + `aria-label` + `focus-visible` 스타일
- **커스텀 404 페이지 생성:**
  - 다크/라이트 모드 자동 대응 (prefers-color-scheme)
  - 12개 언어 자동 감지 (navigator.language)
  - 인기 앱 바로가기 + GA4 page_not_found 이벤트 추적
- **누락 테마 토글 3앱 보완:** maze-runner, snake-game, typing-speed (라이트모드 CSS+JS+토글)
- **총 20개+ 서브모듈/디렉토리 수정 및 push**

### 세션49 (2/12) - 수익최적화 + 성능개선 + UX (다양한 유형 작업)

- **AdSense ad-slot 플레이스홀더 일괄 수정 (18개 앱):**
  - 플레이스홀더 슬롯 ID ("1234567890" 등) → "auto"로 통일
  - 대상: animal-personality, blood-type, brain-type, color-memory, color-personality, flappy-bird, future-self, habit-tracker, iq-test, mbti-career, memory-card, minesweeper, pong-game, puzzle-2048, qr-generator, routine-planner, word-guess, portal/blog
- **BMI 계산기 자동 계산:** 페이지 로드 시 기본값(170cm, 70kg)으로 즉시 결과 표시 + pulse CTA
- **block-puzzle GA4 이벤트:** game_start, game_over 추가 + 시작 버튼 pulse CTA
- **랜딩 페이지 성능:** preconnect 힌트 추가 (GTM, AdSense, GA 도메인)
- **Discovered 9개 앱 기술 점검:** 전체 SEO 마크업 정상 확인 (인덱싱 지연은 Google 크롤 대기)
- **총 20개 서브모듈/디렉토리 수정 및 push**

### 세션48 (2/12) - GSC 인덱싱 50개 확인 + GA4 이벤트 확대 + 고이탈 UX 개선

- **GSC 인덱싱 47→50개 (81%):** habit-tracker, pomodoro-timer, white-noise 신규 인덱싱 확인
  - Discovered 13→9개, brick-breaker 1개 Unknown (사이트맵 포함, 크롤 대기)
- **GA4 engagement 이벤트 5개 앱 추가:**
  - future-self: quiz_start, quiz_complete
  - habit-tracker: add_habit, complete_habit
  - qr-generator: generate_qr, download_qr
  - memory-card: game_start, game_over
  - stress-check: (기존 이벤트 있음, CTA만 추가)
- **Pulse CTA 2개 앱 추가:**
  - stress-check: 시작 버튼 cta-pulse 애니메이션 (80% 이탈 개선)
  - future-self: 시작 버튼 cta-pulse 애니메이션 (82% 이탈 개선)
- **number-puzzle AdSense 수정:** 플레이스홀더 ID → 실제 ca-pub 교체 (세션47 후반)
- **영문 블로그 SEO:** top-10-browser-games title/meta 60/155자 이내 최적화
- **총 6개 서브모듈 수정 및 push**

### 세션47 (2/12) - 100% 이탈앱 8개 UX 개선 + 블로그 CTR 최적화

- **랜딩(/) 이탈률 76%→66% 확인** (세션46 CTA 추가 효과 입증)
- **100% 이탈 앱 8개 수정 (12→8개로 이미 개선, 추가 UX 개선):**
  - color-palette: HEAD 동기 i18n.js 제거(렌더링 차단 해소) + 라이트모드 CSS + 테마토글 추가
  - todo-list: 첫 방문 시 샘플 할일 3개 자동 추가 (빈 화면 해소)
  - numerology: 첫 방문 시 샘플 날짜(1995-06-15)로 자동 계산 결과 표시
  - biorhythm: 첫 방문 시 데모 날짜로 바이오리듬 그래프 자동 표시
  - mbti-career: CTA pulse 애니메이션 + MBTI 미리보기 + i18n 12언어 보완
  - animal-personality: 시작 버튼 pulse 애니메이션 추가
  - color-memory: 시작 버튼 pulse 애니메이션 추가
- **85%+ 이탈 앱 추가 수정:**
  - reaction-test: pulse CTA + 라이트모드 CSS 추가 (89% 이탈 개선 목표)
- **블로그 CTR 최적화:**
  - pyeongsu-calculator blog: title/meta에 구체적 숫자 추가 (59m²=17.8평, 84m²=25.4평) — 33 impressions, position 10.6
- **GA4 engagement 이벤트 5개 앱 추가:**
  - todo-list: add_todo, complete_todo
  - numerology: calculate_life_path, calculate_expression
  - biorhythm: calculate_biorhythm
  - color-memory: game_start, game_over
  - color-palette: generate_palette
- **총 8개 서브모듈 + 1개 일반 디렉토리 수정 및 push**

### 세션46 (2/11) - 서브모듈 정리 + 랜딩페이지 이탈률 개선 + 라이트모드 30앱 push

- **서브모듈 전체 정리:**
  - 미커밋 6개 서브모듈 commit & push (idle-clicker, memory-card, portal, root-domain, stress-check, zodiac-match)
  - 미push 30개 서브모듈 commit & push (라이트모드 토글+CSS 일괄 적용)
  - biorhythm 정식 서브모듈 등록
- **랜딩페이지(/) 이탈률 개선:**
  - `opacity: 0` + 1.5s setTimeout 검은 화면 제거 → 즉시 렌더링
  - Hero CTA 버튼 추가 (above-the-fold, 스크롤 없이 포털 진입)
  - `cta.explore` i18n 12개 언어 추가
  - Brand Essence 섹션 제거 (중복 콘텐츠)
- **GA4/GSC 분석:** 62세션 랜딩 76% 이탈, 100% 이탈 12앱 구조 분석 (코드 정상, UX 이슈)
- **고이탈 앱 4개 심층 분석:** qr-generator, todo-list, numerology, kpop-position — 구조적 크래시 없음 확인
- **고이탈 3앱 UX 개선:** kpop-position(미리보기 질문+CTA pulse), mbti-career(히어로 리디자인+참여 추적), habit-tracker(i18n 8언어 추가)
- **GSC 인덱싱 대폭 개선:** 37→47 인덱싱 (10개 신규), Discovered 18→13으로 감소

### 세션45 (2/11) - 라이트모드 QA + FOUC 전체 완료 + 고이탈 수정 + i18n 안정화

- **라이트모드 QA 전수 점검 → 10앱 보완:**
  - 토글 버튼+JS 누락 9앱 추가: hsp-test, past-life, emoji-merge, stack-tower, color-palette, emotion-temp, iq-test, sky-runner, zigzag-runner
  - CSS 누락 1앱(reaction-test) 라이트모드 CSS 규칙 추가
  - 결과: **60앱 3요소(HTML토글+CSS+JS) 완전 적용** (root-domain 제외)
- **FOUC app-loader 9앱 추가 → 60앱 전체 완료:** iq-test, puzzle-2048, routine-planner, blood-type, quiz-app, flappy-bird, pong-game, word-guess, pomodoro-timer
- **고이탈 6앱 근본 원인 수정:** color-memory(FATAL 문법오류), mbti-career(app-loader+i18n), animal-personality(i18n.init미존재), number-puzzle(i18n race condition), qr-generator(HEAD 동기로드), biorhythm(try-catch 누락)
- **i18n try-catch 4앱 추가 → 전체 완료:** maze-runner, todo-list, puzzle-2048, word-guess
- **GA4/GSC 분석:** 주간 59페이지 트래픽, 100% 이탈 12앱 식별, GSC 노출 극초기(3건)
- 총 15개+ 서브모듈 수정

### 세션44/Cursor (2/11) - 라이트모드 전수 완료 + SEO + 사이트맵 + UX 개선

- **라이트모드 전체 완료 (52앱):** B그룹 6앱 CSS 보완 + C그룹 46앱 신규 추가
- **canonical 태그 10앱 + og:url 4앱 수정**
- **고이탈 5앱 UX 개선:** numerology, qr-generator, habit-tracker, number-puzzle, biorhythm
- **사이트맵 정리:** number-merge 404 제거, biorhythm 추가, 60앱 동기화
- **내부링크 검증 + GSC 인덱싱 촉진:** cross-promo에 Discovered 18+Unknown 3앱 포함 확인
- **지침 최적화:** .cursorrules 599→68줄(-88.6%)

### 세션43 (2/11) - GA4 이탈률 추적 + 5앱 이탈 원인 수정

- **GA4 이탈률 분석:** 100% 이탈 13앱 근본 원인 조사
- **4앱 수정:** habit-tracker(app-loader+i18n), todo-list(app-loader+i18n), numerology(catch loader), animal-personality(데드코드)

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 42 | 2/11 | Claude Code statusline 설정 |
| 41 | 2/11 | idle-clicker HP 버그, 이탈률 4앱, 라이트모드 감사 9앱, BMAD |
| 40 | 2/10 | 고이탈 8앱 + i18n 전수 안정화 + 포털 정비 |
| 39 | 2/10 | 게임 버그 + 43앱 정리 + SEO 블로그 16개 |
| 37-38 | 2/10 | idle-clicker, portal, maze-runner, word-guess, emoji-merge, pong-game |
| 30-36 | 2/10-11 | FOUC 37앱, i18n 17앱, 크로스프로모 57앱, snake-game, zigzag, minesweeper |
| 1-29 | 2/4~10 | 앱 62개 개발, 포털, 도메인, 인프라, i18n, SEO |

---

## 다음 우선순위

1. ~~랜딩페이지(/) 이탈률 개선~~ ✅ **개선 적용** (세션46: opacity 제거+hero CTA)
2. **GSC Discovered→Indexed 전환** - 18개 앱 수동 제출 + 인덱싱 대기
3. ~~고이탈 앱 UX 개선~~ ✅ **완료** (세션44+45)
4. ~~FOUC app-loader~~ ✅ **60앱 전체 완료** (세션45)
5. ~~i18n 안정화~~ ✅ **전체 완료** (세션45)
6. ~~number-merge 404~~ ✅ 사이트맵 제거 완료 (세션44)
7. ~~라이트모드 QA~~ ✅ **60앱 완전 적용 확인** (세션45 QA: 토글 9앱+CSS 1앱 보완)
8. **Google Play** - 상위 게임 APK/AAB
9. ~~biorhythm i18n~~ ✅ **이미 12개 언어 분리 완료**
10. **100% 이탈 앱 참여도 개선** - kpop-position(12세션), habit-tracker 등 UX 개선
