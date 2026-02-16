# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-17 (세션67)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | 67개 (projects/) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **404개** (EN 88, JA 58, ZH 49, ES 41, FR 26, PT 26, HI 22, RU 22, KO 20, ID 18, TR 18, DE 16) |

**앱 분류:** 유틸 12 / 바이럴 테스트 18 / 게임 19 / 도구 12 / 웹 2 / 운세 2 / 신규 2

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | AdSense ca-pub-3600813755953882, 심사 중(2/8) |
| 분석 | GA4 523606964 + GSC `https://dopabrain.com/` (MCP 연동) |
| 크로스프로모 | 59앱, 라이트모드+a11y |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** (포털+랜딩+허브4페이지 i18n 전면 수정) |
| 접근성 | skip-link 61앱, reduced-motion 61앱, 키보드 4게임 **(100%)** |
| 소셜 공유 | **62앱 (100%)** |
| 구조화 데이터 | JSON-LD 60/61앱 (98%+) |
| PWA/SW | pwa-install 13앱, SW network-first 28앱+ |
| 내부 링크 | 8앱 포털백링크+블로그링크, 4블로그→Discovered앱 링크 |
| 카테고리 허브 | Games, Tests, Tools, MBTI (4개 랜딩페이지) |
| MBTI Programmatic | **16/16 타입 페이지 완료** + 사이트맵 반영 (453 URLs) |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 453 URLs, .gitattributes 전체 |

**URL:** `/` 랜딩 → `/portal/` 포털 → `/[앱]/` 개별 앱 → `/portal/blog/{lang}/` 블로그 → `/portal/games/` 게임 허브 → `/portal/mbti/` MBTI 궁합 → `/portal/mbti/{type}.html` 타입별 페이지

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
| 기회 | EN blood-type(32노출,pos53), EN mbti-compat(25,pos36), EN free-games(22,pos4.8), EN browser-games(22,pos6.4) |

---

## 세션 기록

### 세션67 (2/17) - MBTI 16타입 완성 + 허브 i18n 완료
- **MBTI Programmatic SEO 완성**: 나머지 12타입 (Diplomats+Sentinels+Explorers) 커밋/푸시 + 사이트맵 16 URL 추가 (총 453)
- **허브 4페이지 i18n 완전 적용**: games/tests/tools/mbti → i18n.js+app-data.js 로드, data-i18n 160+요소, APP_DATA 앱이름 동적 렌더링
- **12개 locale 파일**: hub/hub_games/hub_tests/hub_tools/hub_mbti 5개 namespace +35키/namespace 추가
- **i18n.js 절대경로 수정**: `js/locales/` → `/portal/js/locales/` (서브디렉토리 페이지 호환)

### 세션66 (2/17) - i18n 전면 수정 + MBTI Programmatic SEO 착수
- CRLF 방지 65개 프로젝트, 포털+랜딩 i18n 전면 수정, MBTI Analyst 4타입 페이지

### 세션65 (2/16) - 설날 특화 앱 3개 + Mental Age Test (67개 프로젝트)
- 설날 운세(`/seollal-fortune/`), 세뱃돈 계산기(`/sebatdon-calc/`), 설날 인사말(`/seollal-greetings/`), 정신 나이 테스트(`/mental-age/`)
- 포털 app-data.js +4앱, Tests/Tools Hub +4카드, 사이트맵 +4 URLs (총 437)
- 설날 특집 배너 포털 최상단 추가, GitHub Pages 서브모듈 배포

### 세션64 (2/16) - 트래픽 다변화: 4개 카테고리 허브 + MBTI 매트릭스
- Games/Tests/Tools Hub 3개 + MBTI Compatibility Matrix 인터랙티브 차트
- 카테고리 필터, CollectionPage+ItemList+FAQ Schema, 사이트맵 +4 URLs (총 433)

### 세션63 (2/16) - DE/TR/ID/HI/RU/PT 블로그 +24개 + EN/FR CTR 최적화
- 6개 언어 각 4개 블로그, EN/FR 메타 최적화, 사이트맵 +24 URLs (총 429)

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 62 | 2/15 | Discovered 앱 블로그 +6개, FR/PT +8개 (380개) |
| 59-61 | 2/15 | Neon Aurora, SEO최적화, 내부링크, 다국어 블로그 +46개, 포털SEO, aura-reading |
| 52-58 | 2/13-15 | UX개선 22앱, EN+32블로그, 소셜공유100%, a11y100%, 다국어 블로그 +28개 |
| 46-51 | 2/11-12 | JSON-LD, AdSense, GSC 37→50, SW+PWA, 크로스프로모 |
| 30-45 | 2/10-11 | i18n 전수, FOUC 60앱, 라이트모드, 게임 버그, 블로그 16개 |
| 1-29 | 2/4~10 | 앱 62개 개발, 포털, 도메인, 인프라 |

---

## 다음 우선순위

1. **주간 리뷰** - 2/15~2/21 데이터로 2/22(일) 실시
2. **신규 앱 인덱싱** - mental-age, seollal-fortune, sebatdon-calc, seollal-greetings + Discovered 9앱
3. **내부 링크 강화** - Discovered/미인덱싱 앱들에 블로그→앱 링크 추가
4. **Google Play** - 상위 게임 APK/AAB
