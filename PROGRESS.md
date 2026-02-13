# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-13 (세션52)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | 62개 (projects/) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | 124개+ (EN 20+, FR 2, JA 3, PT 2, ZH 2) |
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
| 크로스프로모 | 58앱 적용, 라이트모드+a11y 개선 |
| i18n 안정화 | **전체 완료** — try-catch 전앱 적용 |
| FOUC 수정 | **60앱 app-loader 적용 완료** |
| SW network-first | **28앱+ 전환 완료** |
| 라이트모드 | **63앱 토글+CSS+JS 완전 적용** |
| 접근성(a11y) | **skip-link 56앱(92%)**, **prefers-reduced-motion 61앱(100%)**, 키보드단축키 4게임 |
| PWA 설치 | **pwa-install.js 13앱 적용** (세션52: +8앱) |
| 404 페이지 | 커스텀 404 다크/라이트 + i18n 12개 언어 |
| 소셜 공유 | **50앱 적용** (세션52: +12앱) |
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
| TOP5 | /(61), portal(22), idle-clicker(17), emotion-temp(14), hsp-test(14) |
| 최우수 참여 | emoji-merge(0%), brain-type(0%), minesweeper(0%), stack-tower(8%), typing-speed(11%) |
| 고이탈 앱 | 100%×7 + 85%+×9 = 16앱 → **세션52에서 전체 GA4 engagement 이벤트 추가** |
| 랜딩(/) | 61users, 66% 이탈, 4.7초 평균 |
| GSC 주간 노출 | **150건** (전주 61건 대비 2.5배↑, pyeongsu-calculator 49건) |
| GSC 클릭 | 3건 (fr/jeux-navigateur 33% CTR 최고성과) |

---

## 세션 기록

### 세션52 (2/13) - 고이탈 22앱 UX + 블로그 SEO 4개 + a11y 100%

- **고이탈 22앱 GA4 engagement:** 100% 이탈 7앱 + 85%+ 이탈 9앱 + 추가 6앱 전체에 CTA pulse + GA4 engagement/scroll/timer 이벤트
- **블로그 SEO CTR:** en/free-games, en/top-10-browser-games, pyeongsu-calculator title/meta 최적화
- **다국어 블로그 4개 신규:** FR(성격테스트), JA(性格診断), PT(personalidade), ZH(心理测试) + 사이트맵
- **소셜 공유 +12앱:** block-puzzle, brick-breaker, color-memory 등 → 총 50/62앱
- **PWA 설치 +8앱:** past-life, puzzle-2048, zigzag-runner 등 → 총 13앱
- **a11y:** prefers-reduced-motion +8앱(→100%), skip-link +15앱(→92%)

### 세션51 (2/12) - SEO + 바이럴 + 게임UX + SW전략

- JSON-LD flappy-bird → 60/61앱, 소셜 공유 +3앱, 키보드단축키 4게임, SW network-first 16앱

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 50 | 2/12 | 접근성(motion 8+skip 7) + PWA 5앱 + 크로스프로모 58앱 + 404 |
| 49 | 2/12 | AdSense ad-slot 18앱 + BMI 자동계산 + 랜딩 preconnect |
| 48 | 2/12 | GSC 47→50 인덱싱 + GA4 이벤트 5앱 + pulse CTA 2앱 |
| 47 | 2/12 | 100% 이탈 8앱 UX + 블로그 CTR + GA4 이벤트 5앱 |
| 46 | 2/11 | 서브모듈 정리 + 랜딩 이탈률 76→66% + GSC 37→47 |
| 45 | 2/11 | 라이트모드 QA 60앱 + FOUC 60앱 + i18n 안정화 전체 완료 |
| 44 | 2/11 | 라이트모드 52앱 + canonical/og + 사이트맵 정리 |
| 40-43 | 2/10-11 | 고이탈 8앱 + i18n 전수 + 포털 + GA4 분석 + statusline |
| 37-39 | 2/10 | 게임 버그 + 43앱 정리 + SEO 블로그 16개 |
| 30-36 | 2/10-11 | FOUC 37앱, i18n 17앱, 크로스프로모 57앱 |
| 1-29 | 2/4~10 | 앱 62개 개발, 포털, 도메인, 인프라, i18n, SEO |

---

## 다음 우선순위

1. **세션52 효과 모니터링** - 22앱 이탈률 + 블로그 CTR 변화 (2-3일 후 GA4/GSC 확인)
2. **GSC Discovered→Indexed** - 9앱 크롤 대기 (기술적 이슈 없음)
3. **Google Play** - 상위 게임 APK/AAB
4. **AdSense 심사 통과 후** - 광고 위치 최적화
5. **소셜 공유 잔여 12앱** - 나머지 앱 추가
6. **skip-link 잔여 5앱** - routine-planner, snake-game, todo-list, zodiac-match, root-domain
