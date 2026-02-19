# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-19 (세션91)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **77개** (projects/) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **442개** (EN 108, JA 58, ZH 50, ES 45, FR 29, PT 31, HI 28, RU 26, KO 24, ID 22, TR 23, DE 18) |

**앱 분류:** 유틸 12 / 바이럴 테스트 **25** / 게임 **21** / 도구 12 / 웹 2 / 운세 **3** / 신규 2

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

### 세션91 (2/19) - 도파민 바이럴 앱 3개 신규 생성
- **name-match** (이름 궁합💕): 두 이름→5카테고리 점수 분석, i18n 12언어, 공유 기능
- **fortune-cookie** (포춘 쿠키🥠): 쿠키 탭→운세 공개, 30개 운세×12언어(360개), 크래킹 애니메이션
- **would-you-rather** (이것아니면저것🤔): 20개 딜레마 선택, 커뮤니티 비율 표시, i18n 12언어
- 3개 모두 GitHub Pages 배포 + 포털 등록 + 서브모듈 완료

### 세션90 (2/19) - lottery i18n + love-language locale 보완
- lottery ~45개 i18n 키 추가, love-language zh.json 수정

### 세션89 (2/19) - i18n 하드코딩 잔여 전량 수정 (3라운드, 20개 앱)
- 14개 앱 직접 수정 + 6개 앱 이미 완료 확인 (blood-type, color-personality, affirmation 등)
- **GA4 (2/12~18)**: 7d users ~139, sessions ~157, pageviews ~317
- **GSC (2/12~18)**: 4clicks, FR jeux 1click/20imp/pos5, EN blood-type 33imp/pos54

### 세션88 (2/19) - idle-clicker SEO, Road Shooter 폴리시, EN 블로그 12개
- **idle-clicker**: VideoGame+FAQPage JSON-LD, EN title/desc 최적화, lang="en", 내부링크 5개 (pos9.7 → Top3 공략)
- **Road Shooter**: 적 타입별 사망 파티클, 머즐플래시 30%, 콤보 마일스톤 강화(3x/5x/10x/25x), 보스HP 펄스
- **EN 블로그 12개 추가**: stress-type 3개 + work-style 3개 + love-language 3개 + eq-test 3개 (1400~2000 단어)

### 세션87 (2/19) - 미색인 앱 내부링크 강화, stress-type + work-style 신규 앱 추가
- **portal/js/app-data.js**: stress-type(🔥 #ff6b35), work-style(👑 #6366f1) 2개 앱 추가 (test 카테고리, i18n 12언어)
- **portal/sitemap.xml**: stress-type, work-style URL 추가 (priority 0.8, changefreq monthly)
- portal git commit & push 완료

### 세션86 (2/19) - 전앱 i18n 하드코딩 전수 검수 및 수정 (2라운드)
- **포탈 app.js**: 카테고리 레이블·배지·검색결과·더보기 → i18n 적용
- **앱별 수정 (19개 앱, ~200개 locale 키 추가)**: snake-game, typing-speed, reaction-test, daily-tarot, mbti-career, maze-runner, routine-planner, todo-list, unit-converter, block-puzzle, brain-type, pomodoro-timer, habit-tracker, bmi-calculator, minesweeper, word-scramble, color-palette

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

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 82 | 2/19 | love-language 신규 앱(5가지 사랑의 언어, 30문항, i18n 12언어) |
| 81 | 2/19 | 68개 앱 버그/개선 감사 (P0~P4: skip-link14개, 소셜공유14개, SW8개) |
| 80 | 2/18 | 3D카메라, AdSense terms/about, .gitmodules 44개 추가, 설날 철거 |
| 79 | 2/18 | RS 밸런스+3D메시+연출 라운드5-9, rapidFire→발사속도40%↑ |
| 78 | 2/18 | RS 대규모 오버홀: 신규적2+무기2, 게임필5종, 스크린이펙트 |
| 73-77 | 2/18 | Three.js 3D, 크로스리뷰, 볼류메트릭 메시, i18n검수 |
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
