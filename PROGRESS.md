# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-19 (세션86)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **72개** (projects/) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **442개** (EN 108, JA 58, ZH 50, ES 45, FR 29, PT 31, HI 28, RU 26, KO 24, ID 22, TR 23, DE 18) |

**앱 분류:** 유틸 12 / 바이럴 테스트 **22** / 게임 **20** / 도구 12 / 웹 2 / 운세 2 / 신규 2

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | AdSense ca-pub-3600813755953882, 심사 중(2/8) — terms/about 페이지 추가 |
| 분석 | GA4 523606964 + GSC `https://dopabrain.com/` (MCP 연동) |
| 크로스프로모 | 61앱, 라이트모드+a11y |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| 접근성 | skip-link 61앱, reduced-motion 61앱, 키보드 4게임 **(100%)** |
| 소셜 공유 | **62앱 (100%)** |
| 구조화 데이터 | JSON-LD 60/61앱 (98%+) |
| PWA/SW | pwa-install 13앱, SW network-first 28앱+ |
| 카테고리 허브 | Games(20), Tests, Tools, MBTI (4개 랜딩페이지) |
| MBTI Programmatic | **16/16 타입 페이지 완료** |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 454 URLs, .gitattributes 전체 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/mbti/` → `/road-shooter/`

---

## GSC 인덱싱 (2/12)

**Indexed 50/62 (81%)** | **Discovered 9:** minesweeper, flappy-bird, dev-quiz, qr-generator, lottery, color-palette, blood-type, routine-planner, todo-list | **Unknown 1:** brick-breaker

---

## GSC 주간 리뷰 (2/8~2/14)

| 지표 | 값 |
|------|-----|
| 주간 클릭 | **6건** |
| 주간 노출 | **~270건** |
| TOP 국가 | FR 4클릭(17%CTR) > JPN 1 > USA 1 |
| 클릭 페이지 | FR jeux-navigateur(3/12%/pos4.5), FR cerebral(1/20%/6.2), JA 2048(1/10%/7.5), EN valentine(1/25%/7.5) |
| 기회 | EN blood-type(32노출,pos53), EN free-games(20,pos4.6), idle-clicker(3,pos9.7) |

---

## 세션 기록

### 세션86 (2/19) - 전앱 i18n 하드코딩 전수 검수 및 수정 (2라운드)
- **포탈 app.js**: 카테고리 레이블·배지·검색결과·더보기 → i18n 적용, badge/search 키 12언어 추가
- **앱별 수정 (19개 앱, ~200개 locale 키 추가)**:
  - snake-game: WALL/INFINITE MODE → i18n, skip link
  - typing-speed: "Top %", rec.title → i18n
  - reaction-test: Best label → i18n
  - daily-tarot: (Reversed)/(Upright), share.copied/copyUrl → i18n
  - mbti-career: ko.json 중복 키 제거 (조직성·변화수용·대면충돌)
  - maze-runner: lang="en"→"ko", accessibility.skipToMain 12언어
  - routine-planner: defaultQuote·noneSelected·weeklyGoal·none → data-i18n
  - todo-list: weekday labels (Mon-Sun), share toast → i18n
  - unit-converter: 21개 단위 레이블 전체 data-i18n 적용
  - block-puzzle: skip link, share buttons, Lv. prefix → i18n
  - brain-type: 8 타입 배지, theme toggle title → i18n
  - pomodoro-timer: Mon-Sun, 종합, goal tip → i18n
  - habit-tracker: placeholder (English), All Habits, 알람 → i18n
  - bmi-calculator: 트윗 본문, 클립보드 알림 → i18n
  - minesweeper: keyboard hints, share buttons, related articles → i18n
  - word-scramble: keyboard hints, category badge → i18n
  - color-palette: related articles heading, back-link → i18n

### 세션84 (2/19) - love-language, eq-test 포털 등록
- **portal/js/app-data.js**: love-language(💗 #e91e8c), eq-test(🧠 #00bcd4) 2개 앱 추가 (test 카테고리, i18n 12언어)
- **portal/sitemap.xml**: 두 앱 URL 추가 (priority 0.8, changefreq monthly)
- portal git commit & push 완료
- **다음**: love-language, eq-test GitHub repo 생성 후 서브모듈 등록 필요

### 세션83 (2/19) - GSC 404 대규모 수정 + 다국어 블로그 38개 생성
- **404 완전 해결 (68개)**: 26개 redirect (ru/ru/ 경로 오류, 잘못된 파일명, lang 폴더 오류 등) + 38개 신규 블로그 포스트
- **루트 URL 수정**: `/privacy.html` redirect(→/portal/privacy-policy), `/aura-reading/`, `/number-merge/` 삭제 앱 redirect
- **신규 블로그 38개**: snake-game/todo-list/lottery/color-palette/habit-tracker/aura-reading (ko/hi/pt/fr/tr/ru/id/es/zh/de)
- **크롤링됨-미색인(30개)**: `/portal/tools/` canonical 이미 설정됨 — 시간 해결 예정
- **발견됨-미색인(191개)**: 크롤 예산 부족 — 내부 링크 강화로 개선 예정
- GSC 현황: 300 비색인 → 향후 대폭 감소 기대, 블로그 442개 달성

### 세션82 (2/19) - Love Language Test 신규 앱 생성
- **신규 앱**: `love-language` — Gary Chapman의 5가지 사랑의 언어 테스트
- 30개 쌍비교 질문(A/B), 5가지 결과(W/A/G/T/P), 상세 해석+관계조언+궁합
- i18n 12개 언어 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr), Glassmorphism 2.0 다크모드
- Primary Color #e91e8c, GA4, JSON-LD, PWA/SW, cross-promo, 접근성 완비
- 16파일, 2708줄, git commit: `314e238`

### 세션81 (2/19) - 전체 앱 버그/개선 병렬 감사 및 수정 (68개 앱)
- **P0 긴급수정**: road-shooter(GA4 ID·cross-promo·manifest·og:image), biorhythm(locale 12개), routine-planner(locale 12개), aura-reading(GA4 ID), portal(설날앱 app-data 제거)
- **P1 접근성**: skip-link 14개 앱 추가 (stack-tower, dev-quiz, mbti-tips, love-frequency, quiz-app, detox-timer, dday-counter, white-noise, shopping-calc, unit-converter, lottery, affirmation, valentine, portal)
- **P2 소셜공유**: 14개 앱 share 기능 추가/확인 (todo-list, habit-tracker, bmi-calculator, qr-generator, routine-planner, affirmation, word-guess, word-scramble, seollal-greetings 등)
- **P3 Service Worker**: 8개 앱 SW 등록 (pomodoro-timer, dday-counter, white-noise, lottery, tax-refund-preview, reaction-test, typing-speed, routine-planner)
- **P4 기타**: flappy-bird reduced-motion, puzzle-2048 skip-link 복원, pomodoro-timer/todo-list og:image 절대URL
- **크로스 리뷰**: 4팀 병렬 검증 전항목 PASS

### 세션80 (2/18) - 3D카메라 수정, AdSense 준비, .gitmodules 대수술, 설날 철거
- **3D 카메라 뷰포트**: (0,8,5)→(0,14,10), lookAt -10, 안개 35-60, 스쿼드 이동 clamp center±85
- **AdSense 정책 대응**: terms.html + about.html 신규 생성, 푸터 링크 + i18n 12언어
- **.gitmodules 정비**: 44개 누락 서브모듈 URL 일괄 추가 (9→53), root-domain URL 수정, stale portal ref 제거
- **설날 특집 철거**: 3개 앱(운세/세뱃돈/인사말) portal 전면 제거 (app-data, sitemap, 허브, 배너)
- **빌드 수정**: GitHub Pages 빌드 #50~53 실패 → #54 성공

### 세션79 (2/18) - Road Shooter 밸런스+3D+연출 라운드5-9
- 3D Tank/Brute/트랩 메시, 죽음 연출, 중간런 성장(+8%dmg/웨이브)
- 밸런스 리튠: 아이템↓, 적수↓, 스폰간격↑, 무기/업그레이드/보스 리밸런스
- rapidFire→발사속도40%↑, 결과화면 Time/bestCombo, 트랩 빈도 2.5배

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 78 | 2/18 | RS 대규모 오버홀: 신규적2+무기2, 게임필5종, 스크린이펙트, 난이도리밸, UX |
| 77 | 2/18 | Three.js r128 3D 렌더링 엔진 도입, 듀얼캔버스, 3D메시 전체 |
| 76 | 2/18 | 자동 크로스리뷰 4라운드: 쉴드+업그레이드+Endless+보스+dt타이머 |
| 73-75 | 2/18 | 센터링, 군인4타입+적7종+보스3종 3D볼류메트릭, X투영, i18n검수 |
| 68-72 | 2/17-18 | Road Shooter GDD→MVP→사운드→업그레이드→보스→3D도로→파워업 |
| 65-67 | 2/16-17 | i18n 전면수정, MBTI 16타입, 설날앱 3개 |
| 59-64 | 2/15-16 | 블로그+80, 카테고리허브 4개, SEO최적화 |
| 46-58 | 2/11-15 | JSON-LD, AdSense, 소셜공유100%, a11y100%, UX개선 |
| 1-45 | 2/4~11 | 앱 62개 개발, 포털, 인프라, i18n 전수, 라이트모드 |

---

## 다음 우선순위

1. **신규 앱 GSC URL 검사 요청** — love-language, eq-test 색인 요청
2. **Road Shooter 브라우저 테스트** — 3D 카메라 뷰포트 수정 검증, 게임필+밸런스 최종 확인
3. **Road Shooter 추가 폴리시** — 3D 파티클 효과, 유닛 언락 시스템, 프레스티지 메타
4. **주간 리뷰** — 2/15~2/21 데이터로 2/22(일) 실시
5. **발견됨-미색인 앱 내부링크 강화** — blood-type, brick-breaker, flappy-bird, minesweeper 등
6. **도파민 자극 바이럴 앱 추가** — 신규 테스트/게임 지속 추가
7. **biorhythm i18n 표준화** — 기술부채
