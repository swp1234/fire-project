# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-20 (세션97)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **87개** (projects/) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **442개** (EN 108, JA 58, ZH 50, ES 45, FR 29, PT 31, HI 28, RU 26, KO 24, ID 22, TR 23, DE 18) |

**앱 분류:** 유틸 12 / 바이럴 테스트 **33** / 게임 **21** / 도구 12 / 웹 2 / 운세 **4** / 신규 2

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료(2/20)** ca-pub-3600813755953882 — 세금/본인인증/은행 설정 필요 |
| 분석 | GA4 523606964 + GSC `https://dopabrain.com/` (MCP 연동) |
| 크로스프로모 | 61앱, 라이트모드+a11y |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| 접근성 | skip-link 61앱, reduced-motion 61앱, 키보드 4게임 **(100%)** |
| 소셜 공유 | **62앱 (100%)** |
| 구조화 데이터 | JSON-LD 60/61앱 (98%+) |
| PWA/SW | pwa-install 13앱, SW network-first 28앱+ |
| 카테고리 허브 | Games(20), Tests, Tools, MBTI (4개 랜딩페이지) |
| MBTI Programmatic | **16/16 타입 페이지 완료** |
| 서브모듈 | **69/70** (tree→submodule 12개 변환 완료, _common만 tree) |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 457 URLs, .gitattributes 전체 |

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

### 세션97 (2/20) - 블로그 내부링크 + 바이럴 앱 3개
- **블로그 내부링크 (Priority 4)**: personality-tests 라운드업 11개 언어 x 7앱 = 77링크, free-games 11언어 x 2앱 = 22링크, 개별 블로그 3개 추가
- **villain-type** (빌런 유형🦹): 10문항→6아키타입(마스터마인드/챠머/레벨/타이런트/트릭스터/폴른히어로), i18n 12언어
- **rizz-score** (리즈 점수✨): 12문항→0-100점+5단계(레전더리/인증/솔리드/언더커버/미스터리), 원형 스코어미터, i18n 12언어
- **sleep-animal** (수면 동물🌙): 10문항→4크로노타입(곰/사자/늑대/돌고래), 수면팁+이상적스케줄, i18n 12언어
- 3개 앱 GitHub Pages 배포 + 포털 등록(app-data+SEO디렉토리+tests허브) + 서브모듈 완료

### 세션96 (2/20) - 전사이트 버그 수정 + 라이트모드 가시성 개선
- **버그 수정 라운드1 (6개)**: unit-converter 중복스크립트, routine-planner 무한로딩, dream-fortune SW캐시, emotion-temp i18n누락, zodiac-match SVG파괴, daily-tarot 문법오류15개
- **버그 수정 라운드2 (6개)**: cross-promo 셀렉터 불일치(`html.light-mode`→`[data-theme="light"]`), quiz-app HTML전면재작성, would-you-rather 텍스트색상, aura-reading Pages활성화, todo-list i18n+라이트모드, zodiac-match 12언어 동적번역
- **affirmation 앱 수정**: 누락 `</main>`, 6개 DOM요소 추가, 카테고리 i18n키 매핑, skipMain키, deepAffirmation 10언어 추가
- **라이트모드 전사이트 감사+수정 (10개 앱)**: lottery, dday-counter, detox-timer, future-self, dev-quiz, affirmation, brainrot-score, idle-clicker, unit-converter, toxic-trait
- daily-tarot 라이트모드 CSS 227줄 추가
- **SEO 메타 최적화 (5개 페이지)**: blood-type `lang="ko"`→`"en"` 치명적 버그 수정, games hub/idle-clicker/FR jeux/JA 2048 title+desc 리라이팅
- **내부링크 강화**: 6개 신규앱 app-data.js 추가(크로스프로모 활성화), 포털 SEO디렉토리 11개 앱 추가, tests허브 8개+games허브 2개 카드 추가

### 세션95 (2/20) - 바이럴 앱 3개 + tree→서브모듈 12개 변환
- **attachment-style** (애착유형💔): 10문항→안정형/불안형/회피형/혼란형, 애착미터, i18n 12언어
- **brainrot-score** (브레인롯🧠): 12문항(언어별 현지 밈!), 0-100% 점수+5단계, 글리치 효과, i18n 12언어
- **social-battery** (소셜배터리🔋): 10문항→배터리잔량%, 솔라패널/충전식/절전/비상 4유형, i18n 12언어
- **tree→submodule 변환 12개**: block-puzzle, bmi-calculator, brain-type, color-palette, daily-tarot, habit-tracker, maze-runner, mbti-career, pomodoro-timer, reaction-test, snake-game, typing-speed
- 3개 앱 GitHub Pages 배포 + 포털 등록 + 서브모듈 완료

### 세션94 (2/20) - 바이럴 앱 3개 + zodiac-match SEO
- **GA4 (2/13~19)**: 주간184명(↑24%), PV369↑16%, US68/NL48/KR6(127PV). 신규앱 잘작동(fortune-cookie8, love-language8)
- **GSC (2/13~19)**: 1클릭(KOR), zodiac-match pos4 "별자리 궁합" 기회 발견
- **luck-meter** (운 측정기🍀): 원탭 행운점수0-100, 5카테고리 별점, 럭키아이템/컬러, i18n 12언어
- **red-green-flag** (레드/그린플래그🚩): 15문항→레드/옐로/그린 비율+8아키타입, 4차원 분석, i18n 12언어
- **toxic-trait** (독성특성탐지기☠️): 12문항→8아키타입(오버씽커/수동공격/메인캐릭터 등), 독성미터, i18n 12언어
- **zodiac-match SEO**: title/desc/hreflang/Schema.org 최적화, 12개 로케일 meta키 추가 (pos4 "별자리 궁합")

### 세션93 (2/20) - git 정리 + 세션 마무리
- idle-clicker i18n: share.twitter/copyUrl 키 추가 (11개 로케일)
- 루트 커밋: color-blindness 서브모듈, biorhythm/detox-timer/portal/idle-clicker 동기화

### 세션92 (2/20) - 포털 i18n 버그 수정 + color-blindness 신규 앱
- **포털 i18n race condition 수정**: 번역 로딩 완료 후 init() 실행되도록 변경
- **color-blindness** (색각 테스트🎨): 25레벨 색 구별 게임, i18n 12언어

### 세션91 (2/19) - 도파민 바이럴 앱 3개 신규 생성
- **name-match**(💕), **fortune-cookie**(🥠), **would-you-rather**(🤔) — 3개 모두 배포+포털+서브모듈 완료

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 88-90 | 2/19 | idle-clicker SEO, RS 폴리시, EN 블로그 12개, i18n 3라운드 전수검수 |
| 83-87 | 2/19 | GSC 404 수정(68개), 블로그 38개, stress-type+work-style, i18n 2라운드 |
| 82 | 2/19 | love-language 신규 앱(5가지 사랑의 언어, 30문항, i18n 12언어) |
| 81 | 2/19 | 68개 앱 버그/개선 감사 (P0~P4: skip-link14개, 소셜공유14개, SW8개) |
| 80 | 2/18 | 3D카메라, AdSense terms/about, .gitmodules 44개 추가, 설날 철거 |
| 73-79 | 2/18 | RS 대규모: Three.js 3D, 게임필5종, 밸런스, 3D메시, 볼류메트릭 |
| 68-72 | 2/17-18 | Road Shooter GDD→MVP→사운드→업그레이드→보스→3D도로 |
| 59-67 | 2/15-17 | i18n 전면수정, MBTI 16타입, 설날앱, 블로그+80, 카테고리허브 |
| 46-58 | 2/11-15 | JSON-LD, AdSense, 소셜공유100%, a11y100%, UX개선 |
| 1-45 | 2/4~11 | 앱 62개 개발, 포털, 인프라, i18n 전수, 라이트모드 |

---

## 다음 우선순위

1. **주간 리뷰** — 2/15~2/21 데이터로 2/22(일) 실시
2. **바이럴 앱 추가** — dark-personality, sleep-type 등 트렌드 앱
3. **GSC 신규앱 색인 대기** — 10개 앱 (세션91-95 신규 앱들)
4. **발견됨-미색인 앱 내부링크 강화** — blood-type, brick-breaker, flappy-bird 등
5. **Road Shooter 추가 폴리시** — 3D 파티클 효과, 유닛 언락 시스템
