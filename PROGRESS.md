# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-23 (세션290: result-card 전앱 + canonical 대수술 + bounce 개선)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **108개** (projects/ 108 디렉토리, 앱 108 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **1055개** |

**앱 분류:** 유틸 12 / 바이럴 테스트 **57** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 10

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료** — 전앱 스크립트 + 10개 인기앱 수동 배치 + **eq-test AI 프리미엄 실험** |
| 분석 | GA4 + GSC + MCP 8개 (on-demand: gemini/gemini-image/reddit/twitter/youtube/trends) |
| 크로스프로모 | **99/99앱** 2x2 그리드 카드 완료 + cross-promo.js 동적 위젯 |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| SEO 스키마 | FAQPage **104/104 (100%)**, BreadcrumbList **104/104 (100%)**, JSON-LD 전앱 |
| 카테고리 허브 | Games(21), **Tests(39)**, Tools, MBTI (4개 랜딩페이지) |
| 런타임 검증 | **Playwright 스모크 테스트** + 게임 루프 try-catch **21/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, TeamCreate/TaskCreate/CronCreate |
| 멀티디바이스 | 루트 repo GitHub private (`swp1234/fire-project`) — 데스크톱↔노트북 동기화 |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **1217 URLs**, 피드백 페이지 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. eq-test 바이럴(108u/일) 확인.

---

## 세션 기록

### 세션290 (3/23) - Result Card 전앱 + Canonical 대수술 + Bounce 개선

**#1 result-card.js 바이럴 이미지 전앱 확산:**
- eq-test 파일럿 → 총 10개 앱 적용 완료 (shadow-work, inner-child, trauma-response, attachment-style, stress-response, anxiety-type, burnout-test, hsp-test, toxic-trait-test)
- 모든 앱에 "Save Result" 버튼 추가, Canvas→PNG 다운로드

**#2 toxic-trait-test bounce 85% 개선:**
- 분석 중간 화면 추가 (4단계 프로그레스 바 "Analyzing patterns...")
- 6가지 유형 dimension bars 추가 (결과 시각화)
- result-card 다운로드 버튼 추가

**#3 Canonical URL 대수술:**
- 10개 언어 블로그 21개 파일의 잘못된 canonical URL 수정 (모두 /en/을 가리키고 있었음)
- KO 블로그 3개의 영어-only meta keywords → 한국어로 교체
- error-patterns.md에 예방법 기록

**#4 trauma-response 블로그 12개 언어 완성:**
- EN+KO 기존 + ja/zh/es/pt/hi/ru/id/tr/de/fr 10개 번역 완료
- 사이트맵 10개 URL 추가 (1217 URLs)
- 블로그 1055개

**배포:** portal + toxic-trait-test + 8개 앱(result-card) — 전부 push 완료

### 세션289 (3/23) - Trauma Response 빌드 + $1/day 수익 전략 실행

**#1 Trauma Response Test (108번째 앱) 풀빌드:**
- 4F 프레임워크 (Fight/Flight/Freeze/Fawn), 5차원, 8문항, 레이더 차트
- 12개 언어 i18n, primary color: #e11d48, 배포 완료

**#2 $1/day 수익 전략 — 세션 깊이 + 한국어 SEO:**
- 심리 생태계 크로스링크 대폭 강화: stress-response, hsp-test, overthinker-test, attachment-style, burnout-test — 각 앱에 shadow-work/inner-child/trauma-response 링크 추가 (5앱 push)
- 한국어 블로그 6개에 생태계 크로스링크 추가 (eq-test, toxic-trait, attachment, anxiety, burnout, fight-flight 블로그)
- eq-test 한국어 블로그에 cross-promo.js + 생태계 링크 11개 추가

**#3 바이럴 엔진 — 개인화 결과 카드 이미지:**
- `/portal/js/result-card.js` 공통 모듈 생성 (Canvas → PNG 다운로드)
- eq-test 파일럿: "Save Result" 버튼 추가, 1080×1350 Instagram 비율 카드 생성
- GA4 이벤트: `result_card_download` 추적

**#4 Trauma Response 블로그 (EN+KO):**
- KO: 트라우마 반응 유형 가이드 (23KB, 네이티브 한국어)
- EN: Trauma Response Test Guide (35KB)
- 블로그 인덱스 (KO+EN) + 사이트맵 2개 URL 추가

**#5 에러 패턴 기록:** `memory/error-patterns.md` 생성 — 7가지 에러 패턴과 예방법

**배포:** trauma-response(신규) + portal + eq-test + stress-response + hsp-test + overthinker-test + attachment-style + burnout-test — 전부 push 완료

### 세션288 (3/23) - 로컬 설정 백업 스크립트 + MCP 수정

- 노트북 이전 대비 로컬 전용 설정 전수 점검 (인증, Claude, Git, 런타임)
- `scripts/backup-local-settings.sh` 생성 — 백업 + `restore.sh` 자동 생성
- MCP gemini/gemini-image `cmd /c npx` 래핑 수정 (`/doctor` 경고 해소)
- 백업 바탕화면 저장 완료 (91KB, 14파일)

### 세션287 (3/23) - Inner Child Test 빌드 + 크로스링크 강화

**#1 Shadow Work 크로스링크 강화:**
- EN 블로그 5개에 shadow-work 링크 추가 (toxic-trait, emotion-iceberg, attachment-style, stress-management, hsp-test)

**#2 트렌드 스캔:**
- Gemini 검색으로 후보 분석 → Inner Child Test 선정 (shadow-work 생태계 시너지)

**#3 Inner Child Test 블로그 12개 언어 생성:**
- inner-child-test-quiz-guide.html 12개 언어 (EN 직접 + 11개 에이전트 번역)
- Article/FAQPage/BreadcrumbList 스키마, 6개 유형 해설, 치유 접근법, FAQ 5개
- 12개 블로그 인덱스 업데이트, 사이트맵 12개 URL 추가 (1205 URLs)
- EN 블로그 6개에 inner-child-test 크로스링크 추가

**#4 Inner Child Test (107번째 앱) 풀빌드:**
- 6가지 내면 아이 유형 (버림받은/비난받은/투명한/부모화된/과보호된/놀이하는)
- 5개 차원 (abandonment/shame/trust/autonomy/healing), 8문항, 레이더 차트
- 힐링 어퍼메이션 기능, primary color: #e8913a (warm amber)
- 12개 언어 i18n, dark mode, app-loader, cross-promo, GA4, FAQPage/BreadcrumbList JSON-LD
- 배포: GitHub Pages + 서브모듈 추가 + 포털/Tests허브(38개)/사이트맵(1205 URLs) 등록

### 세션286 (3/23) - Shadow Work 블로그 12개 언어 생성

- shadow-work-quiz-guide.html 12개 언어 블로그 생성 (EN 직접 + 11개 에이전트 번역)
- Article/FAQPage/BreadcrumbList/HowTo 스키마, 7개 섹션, 저널 프롬프트, CTA
- 12개 블로그 인덱스 업데이트, 사이트맵 12개 URL 추가
- portal commit & push 완료, 블로그 1031개

### 세션285 (3/23) - Shadow Work Quiz 신규 앱 + SEO 강화 + bounce 개선

**#1 Shadow Work Quiz (106번째 앱) 풀빌드:**
- 융 심리학 기반 6가지 그림자 아키타입 (PeoplePleaser/Perfectionist/Controller/Avoider/Rebel/Caretaker)
- 5개 차원 (Repression/Projection/Denial/Avoidance/Integration), 8문항, 레이더 차트
- 12개 언어 i18n, dark mode, app-loader, cross-promo, GA4, FAQPage/BreadcrumbList JSON-LD
- primary color: #7c3aed (violet), 저널링 프롬프트 기능
- 배포: GitHub Pages + 서브모듈 추가 + 포털/Tests허브/사이트맵 등록

**#2 SEO 내부링크 강화:**
- stress-management 블로그(pos10.4): hsp-test + overthinker-test에 링크 추가 (총 7개 앱에서 링크)
- shadow-work 크로스링크: eq-test, toxic-trait, anxiety-type에서 링크

**#3 toxic-trait bounce 개선:**
- shadow-work + attachment-style 크로스링크 추가 (related tests 8개로 확대)
- SEO 내부링크 섹션 추가 (footer 전)

**#4 eq-test AI 프리미엄 점검:** 구현 정상, GA4 이벤트 확인, 데이터 수집 대기

**#5 배포:** shadow-work(신규) + portal + eq-test + hsp-test + overthinker-test + toxic-trait-test — 전부 push 완료

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 285-287 | 3/23 | shadow-work(106)+inner-child(107) 풀빌드 + 블로그 + SEO 내부링크 |
| 284 | 3/23 | 루트 GitHub 동기화 + 멀티디바이스 환경 구축 |
| 283 | 3/23 | eq-test AI 프리미엄 실험 + attachment-style 프로모션 + 블로그 |
| 282 | 3/23 | 전략 재점검 + 홈/포털 재설계 + stress-management SEO 푸시 |
| 280-281 | 3/20-22 | 대규모 번역 (Sonnet 최적화) + 버그 수정 + SEO 첫 클릭 캠페인 |
| 265-275 | 3/20 | toxic-trait/red-flag 블로그 번역 + 10개 블로그 x12언어 |
| 245-264 | 3/19 | toxic-trait-test(105번째 앱) + 블로그 + 크로스링크 |
| 241-244 | 3/17-19 | stress-response(103)+anxiety-type(104) 배포 + eq-test 바이럴 |
| 209-240 | 3/15-17 | dopamine-type(100)+burnout-test(101) + FAQPage 100% |
| 173-208 | 3/14-15 | 전략 전환 + ai-personality(97)+overthinker(98)+red-flag(99) |
| 1-172 | 2/4-3/13 | 앱96개→, 포털, i18n, 블로그600+, AdSense, 크로스프로모 |

---

## 다음 우선순위

1. **롱테일 키워드 클러스터** — 20개 세부 키워드 블로그 발행 (도메인 권위)
2. **블로그 OG 이미지 개별화** — 전앱 icon-512.svg → 앱별 고유 1200x630 이미지
3. **stress-management pos 추적** — 내부링크 11개 앱 연결, 현재 pos10.4
4. **신규 4개 앱 모니터링** — shadow-work + inner-child + trauma-response + toxic-trait bounce 효과
5. **AI 프리미엄 이탈 구간 분석** — eq-test ai_analysis_unlock 이벤트 데이터
