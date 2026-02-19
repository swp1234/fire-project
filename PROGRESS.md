# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-19 (세션83)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **69개** (projects/) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **442개** (EN 108, JA 58, ZH 50, ES 45, FR 29, PT 31, HI 28, RU 26, KO 24, ID 22, TR 23, DE 18) |

**앱 분류:** 유틸 12 / 바이럴 테스트 **19** / 게임 **20** / 도구 12 / 웹 2 / 운세 2 / 신규 2

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | AdSense ca-pub-3600813755953882, 심사 중(2/8) — terms/about 페이지 추가 |
| 분석 | GA4 523606964 + GSC `https://dopabrain.com/` (MCP 연동) |
| 크로스프로모 | 59앱, 라이트모드+a11y |
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

1. **GSC 재크롤 요청** — 수정된 404 URL 들을 Search Console에서 URL 검사 → 재크롤 요청
2. **발견됨-미색인 앱 내부링크 강화** — blood-type, brick-breaker, flappy-bird, minesweeper 등 191개
3. **도파민 자극 휘발성 컨텐츠 대폭 추가** — 짧고 자극적인 바이럴 콘텐츠로 트래픽 확보
4. **주간 리뷰** — 2/15~2/21 데이터로 2/22(일) 실시
5. **EN free-games CTR 최적화** — 20노출 pos4.6 0클릭 → Meta Title/Description 개선
6. **Road Shooter 브라우저 테스트** — 3D 카메라 뷰포트 수정 검증
