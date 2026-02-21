# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-22 (세션100)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **96개** (projects/) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **442개** (EN 108, JA 58, ZH 50, ES 45, FR 29, PT 31, HI 28, RU 26, KO 24, ID 22, TR 23, DE 18) |

**앱 분류:** 유틸 12 / 바이럴 테스트 **42** / 게임 **21** / 도구 12 / 웹 2 / 운세 **4** / 신규 2

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료(2/20)** ca-pub-3600813755953882 — 전앱 스크립트 확인완료(83/83) |
| 분석 | GA4 523606964 + GSC `https://dopabrain.com/` (MCP 연동) |
| 크로스프로모 | 61앱, 라이트모드+a11y |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| 접근성 | skip-link 61앱, reduced-motion 61앱, 키보드 4게임 **(100%)** |
| 소셜 공유 | **62앱 (100%)** |
| 구조화 데이터 | JSON-LD 60/61앱 (98%+) |
| PWA/SW | pwa-install 13앱, SW network-first 28앱+ |
| 카테고리 허브 | Games(20), Tests, Tools, MBTI (4개 랜딩페이지) |
| MBTI Programmatic | **16/16 타입 페이지 완료** |
| 서브모듈 | **72/73** (tree→submodule 12개 변환 완료, _common만 tree) |
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

## GA4 주간 리뷰 (2/14~2/20)

| 지표 | 이번 주 | 지난 주 | 변화 |
|------|---------|---------|------|
| 주간 사용자 | **309명** | 184명 | **+68%** |
| 주간 PV | **680** | 369 | **+84%** |
| 2/20 스파이크 | **134명** | - | 역대 최고 |
| TOP 국가 | US137, NL63, IL17, DE12 | US68, NL48 | US 2배 |
| TOP 앱 | mental-age(26), color-blindness(14), stress-type(14), fortune-cookie(13) | | |
| 스파이크 원인 | Direct 120명 — US 커뮤니티(Discord/Reddit) 공유 추정, 84개 페이지 분산 | | |

---

## 세션 기록

### 세션100 (2/22) - 차별화 메카닉 앱 3개 + 인프라 정리 + CLAUDE.md 개선
- **CLAUDE.md 대폭 개선** (insights 기반): Session Management(wrap 시 API 금지), Parallel Agents(카나리 패턴, 5-8개 제한), Checkpoint(대규모 작업 자동 저장), Code Changes, Game Dev 섹션 추가
- **인프라 정리**: 고아 레포 `portal/`(dopabrain-portal) 삭제, 루트 git index 정리, `projects/portal` 서브모듈 포인터 갱신, 더보기 버튼 수정 올바른 레포에 반영
- **emotional-age** (감정 나이😢): **시나리오 슬라이더** — 10개 감정 상황에 연속 슬라이더(0-100)로 반응, 5단계(Child/Teen/Young Adult/Mature/Elder), 레이더 차트, i18n 12언어
- **villain-origin** (빌런 오리진🦹‍♂️): **이진 래피드파이어** — 16개 이진 선택(두 카드 탭), 6아키타입(Betrayed/Mastermind/Anarchist/Fallen Hero/Phantom/Conqueror), 콤보 카운터, i18n 12언어
- **ick-factor** (ick 테스트😬): **스와이프 카드** — 틴더 스타일 20장 행동 카드 좌우 스와이프, 4카테고리(위생/사교/성격/연애), 5단계 ick 감도, i18n 12언어
- 3개 앱 GitHub Pages 배포 + 포털 등록(app-data+tests허브) + 서브모듈 완료
- **기존 테스트 전수 감사**: ~30개 앱이 동일 "N문항×4보기" 패턴 확인 → 인기앱 우선 메카닉 차별화 계획

### 세션99 (2/21) - 바이럴 앱 3개 (dark-core, soul-age, pick-me)
- **dark-core** (다크코어 테스트🖤): 12문항 다크 트라이어드(나르시시즘/마키아벨리즘/사이코패시/사디즘) 측정, 5티어(Pure Light/Grey Zone/Shadow Walker/Dark Architect/Abyss Dweller), 4트레이트 분석바, i18n 12언어
- **soul-age** (영혼 나이 테스트🔮): 12문항 영적 성숙도→영혼 나이(500~100,000+년), 5단계(Infant/Young/Mature/Old/Transcendent Soul), 타임라인 시각화, i18n 12언어
- **pick-me** (픽미 테스트🙋): 12문항 인정욕구/피플플리징→픽미 에너지 %, 5단계(Main Character Secure/Chill/Mild/Certified/Ultimate Pick Me), 핑크 미터, i18n 12언어
- 3개 앱 GitHub Pages 배포 + 포털 등록(app-data+tests허브) + 서브모듈 완료

### 세션98 (2/21) - AdSense 전수 점검 + 바이럴 앱 3개
- **GA4 (2/14~20)**: 주간309명(**+68%**), PV680(**+84%**), 2/20 역대 스파이크 134명(US 커뮤니티 Direct)
- **AdSense 전수 점검**: 83앱 중 81OK, 2누락 수정(habit-tracker, mbti-career) + 블로그 3개 잘못된 publisher ID 수정
- **aura-score** (아우라 점수✨): 12문항 사회적 상황→아우라 포인트 계산, 5티어(NPC Energy/Background/Side/Main/Aura God), 아우라 미터+글로우, i18n 12언어
- **npc-test** (NPC 테스트🎮): 12문항 일상/사교→NPC~메인캐릭터 스펙트럼, 5단계(Full NPC/Background Extra/Side Character/Main Character/Final Boss), 게임UI풍, i18n 12언어
- **delulu-score** (델루루 점수💭): 12문항 로맨스/커리어/자아→망상력 %, 5단계(Grounded/Slightly Delulu/Solulu/Professional Daydreamer/Living in a Movie), 원형미터, i18n 12언어
- 3개 앱 GitHub Pages 배포 + 포털 등록(app-data) + 서브모듈 완료

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

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 94-95 | 2/20 | luck-meter/red-green-flag/toxic-trait, attachment-style/brainrot-score/social-battery, tree→sub 12개, zodiac SEO |
| 91-93 | 2/19-20 | name-match/fortune-cookie/would-you-rather, color-blindness, 포털 i18n 수정 |
| 88-90 | 2/19 | idle-clicker SEO, RS 폴리시, EN 블로그 12개, i18n 3라운드 전수검수 |
| 83-87 | 2/19 | GSC 404 수정(68개), 블로그 38개, stress-type+work-style, i18n 2라운드 |
| 80-82 | 2/18-19 | love-language, 68앱감사, AdSense, 3D카메라, .gitmodules |
| 59-79 | 2/15-18 | RS MVP→3D, i18n전면, MBTI16, 설날, 블로그+80, 카테고리허브 |
| 1-58 | 2/4-15 | 앱62개, 포털, JSON-LD, AdSense, a11y100%, UX개선 |

---

## 다음 우선순위

1. **기존 테스트 메카닉 차별화** — 인기앱(mental-age, stress-type, eq-test 등) 우선 리디자인
2. **주간 리뷰 (2/22)** — 2/15~2/21 전체 데이터 비교
3. **GSC 신규앱 색인 촉진** — 19+개 앱
4. **Road Shooter 폴리시**
