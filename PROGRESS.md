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
| AdSense | ca-pub-3600813755953882, 심사 중(2/8), 자동광고+ad-slot auto 통일 |
| GA4 | 속성 523606964, MCP 연동 |
| GSC | siteUrl: `https://dopabrain.com/`, MCP 연동 |
| 크로스프로모 | 58앱 적용, 라이트모드+a11y 개선 (세션50) |
| i18n 안정화 | **전체 완료** — try-catch 전앱 적용 |
| FOUC 수정 | **60앱 app-loader 적용 완료** |
| SW network-first | **28앱+ 전환 완료** (세션51: cache-first 16앱 전환) |
| 라이트모드 | **63앱 토글+CSS+JS 완전 적용** |
| 접근성(a11y) | skip-link 26앱, prefers-reduced-motion 49앱, 키보드단축키 4게임 |
| PWA 설치 | pwa-install.js 5개 인기앱 적용 |
| 404 페이지 | 커스텀 404 다크/라이트 + i18n 12개 언어 |
| 소셜 공유 | 38앱 적용 (세션51: +3앱) |
| 구조화 데이터 | JSON-LD 60/61앱 (98%+) |

**URL 구조:** `/` 랜딩 → `/portal/` 포털 → `/[앱]/` 개별 앱 → `/portal/blog/{lang}/` 블로그

---

## GSC 인덱싱 (2/12)

**Indexed (50/62, 81%):** /, portal 포함 50개 앱

**Discovered (9):** minesweeper, flappy-bird, dev-quiz, qr-generator, lottery, color-palette, blood-type, routine-planner, todo-list

**Unknown (1):** brick-breaker (사이트맵 포함, 크롤 대기)

---

## GA4 (2/6~2/12)

| 지표 | 값 |
|------|-----|
| TOP5 | /(58), portal(22), idle-clicker(16), emotion-temp(14), hsp-test(14) |
| 최우수 참여 | emoji-merge(0%), brain-type(0%), color-personality(0%), minesweeper(0%) |
| 100% 이탈 (5+세션) | 8개: animal-personality, biorhythm, number-puzzle, mbti-career, numerology, color-memory, color-palette, todo-list |
| 랜딩(/) | 58세션, 66% 이탈, 4.5초 평균 |
| GSC 주간 노출 | 61건 (pyeongsu-calculator 33건) |

---

## 세션 기록

### 세션51 (2/12) - SEO + 바이럴 + 게임UX + SW전략

- **JSON-LD:** flappy-bird 추가 → 60/61앱 완료
- **소셜 공유:** biorhythm, daily-tarot, dev-quiz에 Twitter/X + URL 복사 추가
- **키보드 단축키 4게임:** block-puzzle(P/R), minesweeper(화살표/Space/F), puzzle-2048(WASD/R/U), word-scramble(A-Z/Enter/Backspace)
- **SW network-first 전환 16앱:** cache-first→network-first + 캐시 버전 범프

### 세션50 (2/12) - 접근성 + PWA + 크로스프로모 + 404

- **prefers-reduced-motion 8앱** + **skip-link+main 태그 7앱**
- **PWA 설치 프롬프트:** pwa-install.js 생성, 5개 인기앱 적용
- **크로스프로모:** 라이트모드 CSS + nav 시맨틱 + aria-label (58앱 반영)
- **커스텀 404 페이지:** 다크/라이트 + i18n 12언어 + GA4 추적
- **누락 테마토글 3앱 보완:** maze-runner, snake-game, typing-speed

### 세션49 (2/12) - 수익최적화 + 성능개선

- **AdSense ad-slot 플레이스홀더 18앱 수정** (→ auto 통일)
- **BMI 자동계산** + **block-puzzle GA4 이벤트** + **랜딩 preconnect**

### 세션48 (2/12) - GSC 50개 + GA4 이벤트 + 고이탈 UX

- **GSC 47→50개 인덱싱**, GA4 이벤트 5앱, pulse CTA 2앱, 블로그 SEO

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 47 | 2/12 | 100% 이탈 8앱 UX + 블로그 CTR + GA4 이벤트 5앱 |
| 46 | 2/11 | 서브모듈 정리 + 랜딩 이탈률 76→66% + GSC 37→47 |
| 45 | 2/11 | 라이트모드 QA 60앱 + FOUC 60앱 + i18n 안정화 전체 완료 |
| 44 | 2/11 | 라이트모드 52앱 + canonical/og + 사이트맵 정리 |
| 43 | 2/11 | GA4 이탈률 분석 + 5앱 수정 |
| 40-42 | 2/10-11 | 고이탈 8앱 + i18n 전수 + 포털 정비 + statusline |
| 37-39 | 2/10 | 게임 버그 + 43앱 정리 + SEO 블로그 16개 |
| 30-36 | 2/10-11 | FOUC 37앱, i18n 17앱, 크로스프로모 57앱 |
| 1-29 | 2/4~10 | 앱 62개 개발, 포털, 도메인, 인프라, i18n, SEO |

---

## 다음 우선순위

1. **GSC Discovered→Indexed 전환** - 9개 앱 크롤 대기 (기술적 이슈 없음)
2. **Google Play** - 상위 게임 APK/AAB
3. **100% 이탈 앱 효과 확인** - 세션47-49 수정 효과 GA4 모니터링
4. **AdSense 심사 통과 후** - 광고 위치 최적화
5. **PWA 설치 프롬프트 확대** - 나머지 인기앱으로 확장
6. **소셜 공유 확대** - 공유 없는 유틸/게임 앱 추가
