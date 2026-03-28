# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-29 (세션330: 10세션 수익화 설계 구현 완료)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **108개** (projects/ 108 디렉토리, 앱 108 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **1561개** |

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

### 세션330 (3/29) - 10세션 수익화 설계 구현 완료

**#1 광고/프리미엄 노출 구현:**
- `projects/portal/index.html` + `projects/portal/css/style.css`에 실제 AdSense top/bottom slot 적용, 고정형 placeholder는 inline bottom slot으로 전환
- `projects/portal/tests/index.html`, `projects/portal/mbti/index.html`에 본문형 ad slot 추가 및 AdSense init 적용
- `projects/portal/blog/en/digital-detox.html`, `habit-building.html`, `stress-management-techniques-guide.html`, `blood-type-personality-guide.html`에 winner 페이지용 중간/다음행동 직전 광고 구간 추가
- `projects/eq-test/index.html` result screen에 inline ad slot 추가, hidden result 화면 전환 시 1회만 초기화되도록 조정

**#2 저효율 자산 freeze 반영:**
- `projects/portal/index.html` EN blog feed 상단을 `stress-management`, `blood-type`, `digital-detox`, `habit-building`, `personality-tests`, `mbti`, `habit-tracker`, `pomodoro` 중심으로 재정렬
- portal blog category 순서를 `tests/wellness/tools/love` 우선으로 재배치해 게임 노출 비중을 낮춤

**#3 허브 품질 정리:**
- `projects/portal/tests/index.html` JSON-LD item list 중복/누락 정리
- tests hub 메타/배지 수량을 실제 39개 기준으로 보정

**#4 런타임 검증:**
- 임시 정적 서버 기준 `eq-test`, `portal`, `portal/tests`, `portal/mbti`, winner blog 4개 페이지 로딩/JS 에러 스모크 PASS
- 외부 AdSense/서드파티 리소스 400/403은 검증에서 제외하고, 페이지 자체 pageerror/치명적 console error 없음 확인

### 세션322-329 (3/28) - 10세션 수익화 rollout 실행 완료

**#1 허브 퍼널 재정렬 + 이벤트 rollout:**
- `projects/portal/js/app.js` featured 기준을 `eq-test`, `stress-response`, `blood-type` 중심으로 재정렬
- `projects/portal/index.html`에 `hub_view`, `hub_filter_select`, `hub_featured_click`, `hub_test_card_click`, `hub_cta_click` 추가
- `projects/portal/tests/index.html` featured/카드 순서를 수익 우선 테스트 기준으로 재정렬
- `projects/portal/mbti/index.html`에 다음 테스트 섹션과 hub event tracking 추가

**#2 focus / stress / relationship 클러스터 연결 강화:**
- `projects/portal/blog/en/digital-detox.html`에 `habit-tracker`, `pomodoro-timer`, `habit-building` 중심 CTA/related/tool 동선 추가
- `projects/portal/blog/en/habit-building.html`에 tracker 진입 CTA와 `digital-detox` / `stress-management` 연결 강화
- `projects/portal/blog/en/stress-management-techniques-guide.html`를 `stress-response`, `stress-check`, `burnout-test`, `digital-detox` 축으로 재정렬
- `projects/portal/blog/en/blood-type-personality-guide.html`를 `attachment-style`, `mbti-love`, `zodiac-match` 관계 퍼널로 연결

**#3 eq-test premium v2 적용:**
- `projects/eq-test/index.html`에 AI preview teaser + unlock 버튼 상태 복구 로직 추가
- `premium_cta_view`, `premium_unlock_click`, `premium_unlock_complete`, `eq_related_click` 이벤트 추가
- related cards를 `blood-type`, `mbti-love` 기준으로 재정렬해 premium 이후 다음 클릭을 설계

**#4 10세션 설계 정리:**
- 320-329 설계/기준선은 `PROGRESS.md` 기준으로 통합 유지
- 임시 revenue 브리프 문서 정리 완료

### 세션321 (3/28) - Session 2 instrumentation canary on portal/tests

**#1 instrumentation audit:**
- `eq-test`는 기존 이벤트가 충분하고, `portal/tests`/`portal` 허브는 funnel event가 거의 없음을 확인
- Session 2 taxonomy와 rollout 기준 정리

**#2 portal/tests canary 구현:**
- `projects/portal/tests/index.html`에 `hub_view`, `hub_filter_select`, `hub_featured_click`, `hub_test_card_click`, `hub_cta_click`, `hub_faq_open` 추가
- `hub_name=tests` 기준으로 filter/card/CTA 사용 흐름을 측정 가능하게 구성

### 세션320 (3/28) - 10세션 수익화 스프린트 설계 + baseline 확정

**#1 수익화 운영 설계 문서화:**
- Sessions 320-329 기준 KPI, winner URL, 자동진행 규칙, 토큰 효율 규칙 고정

**#2 Session 1 baseline 확정 (3/21-27):**
- GA4 기준 `eq-test` 43세션 / 76.4초, `/portal/` 10세션 / 75.5초, `/portal/mbti/` 8세션 / 1027초 확인
- GSC 기준 `digital-detox` 1클릭 pos4, `stress-management` 16imp pos10.56, `blood-type` pos2, `habit-building` pos1 확인

**#3 sprint 작업 범위 고정:**
- winner URL 15개 및 cluster 3개 고정
- Session 2 진입조건과 target files 정리

### 세션319 (3/27) - portal skip-link 보강 + quality gate 경고 해소

**#1 portal 홈 접근성 보강:**
- `projects/portal/index.html`에 skip-link 추가
- 기존 CSS에 맞춰 `#app-grid`로 바로 이동 가능하게 연결

**#2 품질 게이트 재검증:**
- `projects/portal` quality gate 재실행
- 기존 warning이던 `Skip-link (a11y) missing` 해소
- portal quality gate 결과 `PASS / 0 warning`

### 세션318 (3/27) - blood-type 페이지 체류 경로 보강

**#1 blood-type personality guide 보강:**
- `projects/portal/blog/en/blood-type-personality-guide.html`에 심리 기반 후속 탐색 문단 추가
- `attachment-style-quiz-guide` + `EQ test` 연결로 pop-culture → psychology 흐름 강화

**#2 related content 확장:**
- Related Content에 `Attachment Style Guide`, `Healthy Boundaries Guide` 추가
- 혈액형 글 유입을 관계/성격 클러스터로 분산되도록 보강

### 세션317 (3/27) - digital-detox / habit-building 전환 동선 강화

**#1 digital-detox 후속 행동 설계:**
- `projects/portal/blog/en/digital-detox.html` 본문에 `habit-building` 연결 문장 추가
- Related Articles에 `How to Build Better Habits`, `Nervous System Regulation Techniques` 카드 추가

**#2 habit-building 유지율 보강:**
- `projects/portal/blog/en/habit-building.html`에 digital-detox + stress-management 연결 문단 추가
- Related Articles에 `Nervous System Regulation Techniques` 카드 추가

### 세션316 (3/27) - sensory / fawn / somatic 링크망 확장

**#1 sensory-overload 허브 확장:**
- `projects/portal/blog/en/sensory-overload-hsp-coping.html`에 `digital-detox` 연결 문장 추가
- related links에 `Somatic Anxiety Guide`, `Digital Detox Guide` 추가

**#2 people-pleasing / somatic 보강:**
- `projects/portal/blog/en/people-pleasing-fawn-response-guide.html` related resources에 `Nervous System Regulation`, `Somatic Anxiety` 추가
- `projects/portal/blog/en/somatic-anxiety-body-symptoms.html` related reading에 `sensory-overload`, `people-pleasing` 추가

### 세션315 (3/27) - nervous-system 허브 강화

**#1 dive reflex 허브 연결:**
- `projects/portal/blog/en/nervous-system-regulation-techniques.html` cold exposure 섹션에 stress-management 연결 문단 추가
- `dive reflex` 의도 검색이 stress-management와 상호 보강되도록 연결

**#2 stress cluster 상호링크 확대:**
- Related Reading에 `sensory-overload-hsp-coping`, `somatic-anxiety-body-symptoms`, `people-pleasing-fawn-response-guide` 추가
- nervous-system 글을 stress cluster 허브 역할로 강화

### 세션314 (3/27) - GSC/GA4 점검 + stress-management SEO 보강

**#1 배치9 진행 상태 재점검:**
- portal 최신 상태 기준 배치9 12언어 5토픽 번역 완료
- 배치9 인덱스 12언어 반영 완료 확인

**#2 GA4/GSC 점검 (3/21-27):**
- `stress-management-techniques-guide` 쿼리 `"dive reflex" "escape-avoidance"` 9imp / pos10.56
- GA4 최근 7일: `digital-detox` 1세션 / 76.8초, `blood-type-personality-guide` 2세션
- 최근 윈도우 기준 digital-detox / habit-building / blood-type는 GSC 쿼리 데이터 제한적

**#3 stress-management SEO 보강:**
- `projects/portal/blog/en/stress-management-techniques-guide.html` 인코딩 깨짐 문구 정리
- meta description / keywords에 `dive reflex stress relief` 강화
- FAQ JSON-LD + 본문 FAQ에 `dive reflex` / `escape-avoidance coping` 추가
- Fleer 섹션에 escape-avoidance coping 설명 + digital-detox 내부링크 추가

### 세션313 (3/27) - 배치9 JA/ES 인덱스 카드 반영 + 자동화 스크립트

**#1 배치9 인덱스 자동화 스크립트 추가:**
- `scripts/update_batch9_indexes.py` 추가
- 배치9 5개 글이 모두 존재하는 언어에만 index.html 카드 5개를 자동 삽입하도록 구성

**#2 JA/ES 블로그 인덱스 업데이트:**
- JA index +5카드 완료
- ES index +5카드 완료

**#3 진행 현황 정리:**
- 배치9 인덱스 반영 완료 언어: KO / ZH / JA / ES
- HI는 gaslighting 1개 미완으로 보류
- RU/PT/ID/TR/DE/FR는 번역 완료 후 동일 스크립트로 즉시 반영 가능

### 세션312 (3/27) - GA4/GSC 분석 + digital-detox 역링크 + 배치9 EN/KO 블로그

**#1 GA4/GSC 분석 (3/20-26):**
- 138u/266pv/7d, Direct79%/Organic12%(124s체류/29%bounce 우수)
- 3/23 스파이크 53u, trauma-response 12u/0%bounce, eq-test 11u/76s
- **GSC 1click! digital-detox(pos4/CTR100%)**, stress-management 23imp/pos10.5
- "dive reflex" 9imp/pos10.6, habit-building pos1, blood-type pos2

**#2 digital-detox 내부링크 강화 (14→21개):**
- dopamine-type, overthinking-at-night, rumination, functional-freeze, nervous-system-regulation, self-compassion, stress-management 7개 블로그에 링크 추가

**#3 배치8 사이트맵 누락 수정 (+60 URLs):**
- maladaptive-daydreaming, burnout-vs-depression, decision-fatigue, functional-freeze, doom-scrolling × 12언어

**#4 배치9 EN 블로그 5개 신규 생성:**
- attachment-style-quiz-guide, people-pleasing-fawn-response-guide, emotional-exhaustion-signs-recovery, boundaries-setting-complete-guide, gaslighting-signs-recovery-guide

**#5 배치9 KO 번역 5/5 완료**

**#6 배치9 다국어 번역 (29/30 완료):**
- ZH 5/5 ✓, JA 5/5 ✓, ES 5/5 ✓, HI 4/5 (gaslighting 1개 미완)
- RU/PT/ID/TR/DE/FR 6개 언어 미시작

**#7 인덱스 업데이트:**
- EN index +5카드, KO index +5카드, ZH index +5카드

**배포:** portal 8+ push, 사이트맵 **1732 URLs** (+65), 블로그 **1551+개**

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

1. **GA4 수집 확인** — `/portal/`, `/portal/tests/`, `/portal/mbti/`, `/eq-test/`, winner blog 4개 페이지의 `hub_*`, `content_*`, premium 이벤트 실제 수집 여부 확인
2. **Ad slot 효과 관찰** — portal/tests/mbti/winner blog/eq-test의 세션 깊이와 광고 가시 구간 이탈 변화 체크
3. **winner URL 재측정** — `digital-detox`, `habit-building`, `stress-management`, `blood-type`의 다음 클릭률과 내부 링크 흐름 재비교
4. **eq-test premium 2차 실험** — `premium_cta_view → premium_unlock_click → premium_unlock_complete` 전환율 기준 CTA 카피/위치 조정
5. **확장 여부 판단** — 상위 winner URL 개선폭이 확인되면 같은 패턴을 adjacent winner 페이지로만 제한 확장
