# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-16 (세션65)

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
| i18n/FOUC/라이트모드 | **전앱 완료** (i18n try-catch, app-loader 60앱, 라이트모드 63앱) |
| 접근성 | skip-link 61앱, reduced-motion 61앱, 키보드 4게임 **(100%)** |
| 소셜 공유 | **62앱 (100%)** |
| 구조화 데이터 | JSON-LD 60/61앱 (98%+) |
| PWA/SW | pwa-install 13앱, SW network-first 28앱+ |
| 내부 링크 | 8앱 포털백링크+블로그링크, 4블로그→Discovered앱 링크 |
| 카테고리 허브 | Games, Tests, Tools, MBTI (4개 랜딩페이지) |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 437 URLs |

**URL:** `/` 랜딩 → `/portal/` 포털 → `/[앱]/` 개별 앱 → `/portal/blog/{lang}/` 블로그 → `/portal/games/` 게임 허브 → `/portal/mbti/` MBTI 궁합

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
| 신규시장 | BRA(PT) 15노출 pos6.7 → PT 확장, KO 제곱미터 인덱싱 대기 |

---

## 세션 기록

### 세션65 (2/16) - 설날 특화 앱 3개 + Mental Age Test (67개 프로젝트)
- **설날 운세 뽑기** (`/seollal-fortune/`): 12간지 띠별 2026년 운세, 재물/건강/연애/직장 4카테고리, 카드 뽑기 UI
- **세뱃돈 계산기** (`/sebatdon-calc/`): 관계별 적정 세뱃돈 계산, 총 지출/수입 대시보드, 국민 평균 비교
- **설날 인사말 생성기** (`/seollal-greetings/`): 대상×톤별 맞춤 덕담 생성, 클립보드 복사, 2026 병오년 특화
- **정신 나이 테스트** (`/mental-age/`): 15문항 바이럴 테스트, 6개 나이 카테고리(15~75세), 이미지 공유
- 포털 app-data.js +4앱, Tests/Tools Hub 업데이트, 사이트맵 +4 URLs (총 437)
- 타겟 키워드: "설날 운세", "세뱃돈 계산기", "설날 인사말", "정신 나이 테스트"

### 세션64 (2/16) - 트래픽 다변화: 4개 카테고리 허브 + MBTI 인터랙티브 매트릭스
- **새 시도 (블로그 외 콘텐츠)**: 카테고리 랜딩페이지 4개 + 인터랙티브 도구
- **Games Hub** (`/portal/games/`): 19개 게임, 카테고리 필터, CollectionPage+ItemList+FAQ Schema
- **Tests Hub** (`/portal/tests/`): 17개 성격 테스트, Psychology/MBTI/Fortune/Fun 필터
- **Tools Hub** (`/portal/tools/`): 15+ 유틸리티, Calculator/Timer/Generator/Wellness 필터
- **MBTI Compatibility Matrix** (`/portal/mbti/`): 16×16 인터랙티브 차트, 256개 조합 데이터, 모달 상세
- **포털 내비게이션**: 메인 포털 하단에 4개 허브 카드 추가, 푸터 링크 확장
- 타겟: "free browser games", "personality tests online", "free online tools", "MBTI compatibility chart"
- 사이트맵 +4 URLs (총 433)

### 세션63 (2/16) - DE/TR/ID 블로그 +12개 + EN/FR CTR 최적화 (392개)
- **DE +4**: gehirntraining-spiele-kostenlos, persoenlichkeitstest-tier, stressabbau-digitale-entgiftung, browser-spiele-ohne-download
- **TR +4**: ucretsiz-tarayici-oyunlari, kisilik-testi-hayvan, stres-azaltma-dijital-detoks, beyin-egzersizi-oyunlari
- **ID +4**: game-browser-gratis-terbaik, tes-kepribadian-hewan, tips-mengurangi-stres-digital-detox, latihan-otak-game-asah-otak
- **CTR 최적화**: EN free-games(pos4.8→title/meta rewrite), EN blood-type(pos53→title/meta), FR jeux-navigateur(pos5.1→title/meta)
- **HI +4**: free-browser-games, personality-test-animal, stress-relief-digital-detox, brain-training-games-free
- **RU +4**: besplatnye-brauzernye-igry, test-lichnosti-zhivotnoe, snyatie-stressa-detoks, besplatnye-igry-mozga
- **PT +4**: jogos-navegador-gratis, teste-personalidade-animal, como-reduzir-estresse-detox-digital, jogos-treino-cerebral
- 사이트맵 +24 URLs (총 429), DE/TR/ID/HI/RU/PT 블로그 인덱스 업데이트

### 세션62 (2/15) - Discovered 앱 블로그 +6개 + FR/PT 확장 +8개 (380개)
- **Discovered 앱 블로그 6개**: JA(color-palette, dev-quiz), ZH(lottery, color-palette, dev-quiz), ES(quiz-desarrollador)
- **FR +4**: guide-flappy-bird, guide-jeu-serpent, guide-lecture-aura, guide-quiz-developpeur
- **PT +4**: guia-flappy-bird, guia-jogo-cobra, guia-leitura-aura, guia-quiz-desenvolvedor
- 블로그 인덱스 대량 업데이트 (JA/ZH/ES/FR/PT), 사이트맵 +14 URLs (총 405)

### 세션61 (2/15) - 포털 SEO 최적화 + 다국어 블로그 +12개 (345개) + 신규 앱
- **포털 SEO**: BreadcrumbList schema, FAQPage schema (Featured Snippet 대응), cross-promo.js 추가
- **랜딩 SEO**: FAQPage schema + cross-promo.js 추가
- **JA +4**: flappy-bird-guide, habit-tracker-guide, snake-game-guide, block-puzzle-guide
- **ZH +4**: routine-planner-guide, todo-list-guide, qr-code-guide, brick-breaker-guide
- **ES +4**: planificador-rutinas-guia, lista-tareas-guia, generador-qr-guia, rastreador-habitos-guia
- 사이트맵 +12 URLs (총 146), JA/ZH/ES 블로그 인덱스 업데이트
- **신규 앱**: aura-reading (Cosmos Persona 스타일 바이럴 성격 테스트)

### 세션60 (2/15) - 주간 리뷰 + EN 메타 최적화 + 다국어 블로그 20개 (333개)
- **주간 리뷰 (2/8~2/14)**: 6클릭, 270노출, FR 17%CTR 최고 성과
- **EN 메타 최적화**: browser-games(pos6.4), mbti-compat(pos36) title/desc/OG/schema 리라이트
- **FR +4**: guide-compatibilite-mbti, guide-strategie-2048, calculateur-imc-guide, test-personnalite-couleur-guide
- **PT +4**: guia-compatibilidade-mbti, calculadora-imc-guia, teste-personalidade-cor-guia, teste-pas-pessoa-altamente-sensivel
- **JA +4**: zodiac-compatibility-guide, qr-code-guide, routine-planner-guide, todo-list-guide (Discovered앱 3개 지원)
- **ZH +4**: 2048-strategy-guide, tarot-reading-guide, color-personality-guide, flappy-bird-guide
- **ES +4**: guia-compatibilidad-mbti, calculadora-imc-guia, test-personalidad-color-guia, flappy-bird-guia
- 사이트맵 +20 URLs (총 134), JA/ZH/ES/FR/PT 블로그 인덱스 업데이트

### 세션59 (2/15) - 다국어 블로그 대량 확장 (JA/ZH/ES +14개, 313개)
- **JA +5**: word-guess, brick-breaker, pong, lottery-number, sky-runner-game-guide
- **ZH +5**: hsp-test, zodiac-compatibility, word-guess, pong, habit-tracker-guide
- **ES +4**: test-pas-persona-altamente-sensible, pong-game-guia, generador-paleta-colores, juego-serpiente-guia
- Discovered앱 인덱싱 지원: lottery(JA), color-palette(ES) 전용 블로그 생성
- 사이트맵 +14 URLs (총 114), 블로그 인덱스 JA/ZH/ES 업데이트

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 62-65 | 2/15-16 | 블로그 +24개, 카테고리허브 4개, MBTI매트릭스, 설날앱 3개, mental-age |
| 56-61 | 2/15 | Neon Aurora 리디자인, GSC SEO최적화, 내부링크강화, 다국어 블로그 +54개, 포털SEO, aura-reading 앱 |
| 52-55 | 2/13-14 | UX개선 22앱, EN+32블로그, 소셜공유100%, a11y100% |
| 46-51 | 2/11-12 | JSON-LD, AdSense, GSC 37→50, SW+PWA, 크로스프로모 |
| 30-45 | 2/10-11 | i18n 전수, FOUC 60앱, 라이트모드, 게임 버그, 블로그 16개 |
| 1-29 | 2/4~10 | 앱 62개 개발, 포털, 도메인, 인프라 |

---

## 다음 우선순위

1. **설날 컨텐츠 홍보** - SNS/커뮤니티에 설날 앱 3개 노출, 시즌 트래픽 확보
2. **신규 앱 인덱싱 확인** - mental-age, seollal-fortune, sebatdon-calc, seollal-greetings
3. **Programmatic SEO** - MBTI 16타입 개별 페이지, Zodiac 궁합 매트릭스 등 확장
4. **주간 리뷰** - 2/15~2/21 데이터로 2/22(일) 실시
5. **GSC Discovered→Indexed** - 9앱 크롤 대기
6. **Google Play** - 상위 게임 APK/AAB
