# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-12 (세션47)

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
| 크로스프로모 | 58앱 cross-promo.js 적용 |
| i18n 안정화 | **전체 완료** — i18n.js 초기화 코드 있는 모든 앱 try-catch 적용 (세션45) |
| FOUC 수정 | **60앱 app-loader 적용** (세션45: +9앱으로 전체 완료) |
| SW network-first | 16앱+ 전환 완료 |
| 라이트모드 | **60앱 토글+CSS+JS 완전 적용** (세션45 QA: 토글 9앱+CSS 1앱 보완) |
| 커스텀 명령어 | /analyze, /validate, /new-app, /session-wrap |

**URL 구조:** `/` 랜딩 → `/portal/` 포털 → `/[앱]/` 개별 앱 → `/portal/blog/{lang}/` 블로그

---

## GSC 인덱싱 (2/11 재확인)

**Indexed (47/62, 76%):** /, portal, hsp-test, emoji-merge, stack-tower, idle-clicker, mbti-tips, dream-fortune, past-life, kpop-position, sky-runner, zigzag-runner, tax-refund-preview, valentine, love-frequency, block-puzzle, word-guess, puzzle-2048, brain-type, reaction-test, emotion-temp, mbti-love, memory-card, password-generator, maze-runner, number-puzzle, color-personality, numerology, quiz-app, daily-tarot, dday-counter, detox-timer, iq-test, shopping-calc, unit-converter, word-scramble, affirmation, **color-memory, typing-speed, pong-game, snake-game, biorhythm, animal-personality, bmi-calculator, stress-check, future-self, zodiac-match**

**Discovered (13):** habit-tracker, minesweeper, flappy-bird, brick-breaker, dev-quiz, qr-generator, pomodoro-timer, white-noise, lottery, color-palette, blood-type, routine-planner, todo-list

---

## GA4 (2/5~2/11, 세션47 기준)

| 지표 | 값 | 변화 |
|------|-----|------|
| 활성 페이지 | 63개 | +1 |
| TOP5 | /(58), portal(22), idle-clicker(16), emotion-temp(14), hsp-test(14) | |
| 최우수 참여 | emoji-merge(0%), brain-type(0%), color-personality(0%), minesweeper(0%), stack-tower(8%), typing-speed(11%) | 개선 |
| 100% 이탈 (5+세션) | **8개:** animal-personality(8), biorhythm(8), number-puzzle(8), mbti-career(7), numerology(7), color-memory(6), color-palette(5), todo-list(5) | **12→8 개선** |
| 85%+ 이탈 | kpop-position(92%), habit-tracker(89%), reaction-test(89%), hsp-test(86%), bmi-calculator(88%), memory-card(88%), zodiac-match(88%) | |
| 랜딩(/) | 58세션, **66% 이탈** (76%→66%, -10pp 개선!), 4.5초 평균 | **개선됨** |
| GSC 주간 노출 | 총 61건 (pyeongsu-calculator blog 33건 선두) | 성장 중 |

---

## 세션 기록

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
