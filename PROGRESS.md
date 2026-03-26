# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-27 (세션311: 실시간 모델 사용량 대시보드 커스텀 완료)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **108개** (projects/ 108 디렉토리, 앱 108 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **1536개** |

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
| OG 이미지 | **107개 앱별 1200×630 PNG** (전앱 완료) + 470+블로그 교체 완료 |
| 런타임 검증 | **Playwright 스모크 테스트** + 게임 루프 try-catch **21/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, TeamCreate/TaskCreate/CronCreate |
| 멀티디바이스 | 루트 repo GitHub private (`swp1234/fire-project`) — 데스크톱↔노트북 동기화 |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **1667 URLs**, 피드백 페이지 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. eq-test 바이럴(108u/일) 확인.

---

## 세션 기록

### 세션311 (3/27) - 실시간 모델 사용량 모니터링 시스템 구축

**#1 실시간 모델 사용량 대시보드 (Customization):**
- `.mcp-servers/gemini-mcp-server` 로컬화 및 토큰 트래킹 로직 삽입.
- `memory/llm_usage.json` 자동 로그 시스템 구축.
- `tools/usage-dashboard.html` 구현 (Glassmorphism 2.0, Dark Mode).
- 사용자가 실시간으로 AI 비용 및 모델별 점유율을 모니터링할 수 있는 인프라 구축.

**#2 MCP 인프라 최적화:**
- 외부 npx 호출 방식 대신 로컬 빌드 바이너리 (`node build/index.js`) 사용으로 전환.
- 지연 시간 단축 및 커스텀 트래킹 가능하도록 구조 변경.

### 세션310 (3/27) - 모델 가이드 수립 + 배치8 EN/KO/ZH 풀사이클

**#1 모델별 전문성 가이드 수립:**
- `docs/MODEL_GUIDELINES.md` 작성. (Flash=워커, Pro=분석, Sonnet=실무, Opus=전략)
- 업무 발생 시 최적 모델 자동 제안 및 전환 규칙 적용.

**#2 배치8 블로그 콘텐츠 확장 (진행률 25%):**
- **EN (5/5)**: maladaptive-daydreaming, burnout-vs-depression, decision-fatigue, functional-freeze, doom-scrolling 생성 및 인덱스 반영.
- **KO (5/5)**: 5개 주제 완벽 번역 및 KO 인덱스 카드 5개 추가.
- **ZH (5/5)**: 5개 주제 완벽 번역 및 ZH 인덱스 카드 5개 추가.

**#3 운영 전략:**
- 사용자의 '자율 판단 및 즉시 실행' 지침에 따라 명령어 대기 없이 순차적 대량 생산 수행.
- 모든 파일 commit & push 완료.

**배포:** portal 10+ push, 블로그 **1551개** (+15)

### 세션309 (3/26) - 배치6완료 + 배치7 풀사이클 + CTR 최적화

**#1 GA4/GSC 분석 (3/19-25):**
- 153u/183s/311pv, Organic 17u/143s체류/36%bounce
- 3/23 스파이크 53u (바이럴 추정)
- stress-management pos10.45/20imp, blood-type pos2, habit-building pos1
- Top: eq-test(13u/51s), toxic-trait(14u), trauma-response(12u)

**#2 배치6 다국어 잔여 40/40 완료:**
- dysregulation/dissociation/hypervigilance/codependency × 10언어 전량

**#3 EN 배치7 블로그 5개 신규:**
- complex-ptsd-symptoms-recovery, emotional-unavailability-signs-dating
- sensory-overload-hsp-coping, rumination-repetitive-thinking-stop
- somatic-anxiety-body-symptoms

**#4 KO 배치7 5/5 완료**

**#5 다국어 배치7 50/50 전량 완료**

**#6 stress-management CTR 최적화:**
- 내부링크 +4개 (dysregulation, dissociation, trauma-bonding, codependency → stress-management)
- 키워드 강화 (dive reflex, fight flight freeze fawn)

**#7 인프라:** 사이트맵 1667 URLs, EN/KO 블로그 인덱스 +5카드, 사이트맵 구조 수정

**배포:** portal 5+ push, 블로그 1536개

### 세션308 (3/25) - SEO 강화 + bounce 개선 (데스크탑 재개)

**#4 trauma-bonding HI 번역 완료** (배치6 미완 1개 마무리, 블로그 1405개)

**#5 stress-management 추가 역링크 +5개** (anxiety-type-guide, stress-vs-anxiety, burnout-test-guide, stress-check-test-guide, perfectionism-anxiety-quiz)

**배포:** toxic-trait-test + inner-child-test + portal 5회 push 완료

### 세션304-307 (3/25) - EN배치5+6(10개) + KO10 + 다국어50/50 + 내부링크13

**#1 EN 롱테일 블로그 10개 (배치5+6, 총 45개):**
- 배치5: imposter-syndrome, emotional-numbness, narcissistic-abuse, abandonment-issues, self-compassion
- 배치6: trauma-bonding, emotional-dysregulation, dissociation, hypervigilance, codependency-recovery

**#2 KO 번역 10/10 완료** ✓

**#3 다국어 50/50 전량 완료** ✓ (배치5 토픽 × 10언어)

**#4 배치6 다국어 시작:** trauma-bonding 9/10 완료 (HI 미완)

**#5 내부링크 +13개 + EN/KO 블로그 인덱스 +5카드 + 사이트맵 1607 URLs**

**배포:** portal 35+ push, 블로그 1404개

### 세션299-302 (3/25) 요약

| 세션 | 주요 작업 |
|------|----------|
| 302 | 다국어4차 30/30 + 내부링크+12 + 깨진링크158개수정 + 사이트맵1487 |
| 300-301 | EN롱테일배치4(5개) + KO5 + 내부링크+7 + 사이트맵1437 |
| 299 | 다국어3차 50/50완료 + JSON-LD조사 + canonical검증 |

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 294-298 | 3/23-25 | EN롱테일30 + page_engage107앱 + OG이미지107 + 다국어155 + cross-promo991블로그 |
| 289-293 | 3/23-24 | trauma-response(108앱) + result-card전앱 + canonical대수술 + KO롱테일20 |
| 285-288 | 3/23 | shadow-work(106)+inner-child(107) 풀빌드 + 블로그 + 백업 |
| 282-284 | 3/23 | 전략 재점검 + 홈/포털 재설계 + 멀티디바이스 + AI 프리미엄 |
| 245-281 | 3/19-22 | toxic-trait(105)+red-flag + 대규모 번역 + SEO 첫 클릭 |
| 209-244 | 3/15-19 | dopamine(100)+burnout(101)+stress(103)+anxiety(104) + FAQPage 100% |
| 173-208 | 3/14-15 | 전략 전환 + ai-personality(97)+overthinker(98)+red-flag(99) |
| 1-172 | 2/4-3/13 | 앱96개→, 포털, i18n, 블로그600+, AdSense, 크로스프로모 |

---

## 다음 우선순위

1. **배치8 다국어 잔여 확장 (45/60)** — hi, ru, ja, es, pt, id, tr, de, fr 9개 언어 번역 및 배포
2. **배치8 인덱스 업데이트 (전 언어)** — 나머지 9개 언어별 index.html 카드 추가
3. **stress-management pos 추적** — pos10.45 + 역링크 16개 추가 효과 확인
5. **blood-type(pos2) / habit-building(pos1) CTR 모니터링** — 첫 클릭 임박
