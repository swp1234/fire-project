# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-19 (세션244 성장 앱 SEO + EQ 롱테일 + 포털 메타)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **104개** (projects/ 104 디렉토리, 앱 104 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **712개** (eq-test 12/12, anxiety-type 12/12, EQ 롱테일 EN +2) |

**앱 분류:** 유틸 12 / 바이럴 테스트 **53** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 7

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료** — 전앱 스크립트 + **10개 인기앱 결과페이지 수동 배치** |
| 분석 | GA4 + GSC + MCP 8개 (on-demand: gemini/gemini-image/reddit/twitter/youtube/trends) |
| 크로스프로모 | **99/99앱** 2x2 그리드 카드 완료 + cross-promo.js 동적 위젯 |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| SEO 스키마 | FAQPage **104/104 (100%)**, BreadcrumbList **104/104 (100%)**, JSON-LD 전앱 |
| 카테고리 허브 | Games(21), **Tests(35)**, Tools, MBTI (4개 랜딩페이지) |
| 런타임 검증 | **Playwright 스모크 테스트** + 게임 루프 try-catch **21/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, TeamCreate/TaskCreate/CronCreate |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **694 URLs** |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. eq-test 바이럴(108u/일) 확인.

---

## 세션 기록

### 세션244 (3/19) - 성장 앱 SEO 강화 + EQ 롱테일 블로그 + 포털 메타 업데이트

**GA4/GSC (3/12~18):**
- 7일: 251u/528pv, stress-response 13u↑, anxiety-type 9u↑, burnout-test 10u↑ (성장 확인)
- 홈페이지 GSC pos1 (신규!), numerology pos3/affirmation pos4 유지, 0clicks 지속

**성장 앱 키워드 확장 (3개):**
- stress-response, anxiety-type, burnout-test — 롱테일 키워드 추가 (각 5-9개)

**포털 메타 현대화:**
- title/description EN으로 전환 + "100+ Apps" 표기 (기존 한국어/30개)
- OG/Twitter meta 업데이트

**EQ 롱테일 EN 블로그 2개 (에이전트):**
- how-to-improve-emotional-intelligence, eq-vs-iq-which-matters-more
- 블로그 인덱스 + 사이트맵 등록 (694 URLs)

### 세션243 (3/18) - eq-test 바이럴 대응 + 블로그 24개 생성 + HTML 버그 일괄 수정

**GA4/GSC 분석 (3/11~17):**
- 7일: 231u/496pv (↑60%!), 3/17 역대 최고 128u/293pv
- **eq-test 108u/7.8%bounce/194s** — Direct 유입 바이럴!
- 신규 앱 5개 전부 0% bounce (dopamine 8u, burnout 6u, stress-response 5u, anxiety 3u)
- Organic 21u/197s, 0clicks 지속, numerology pos3/affirmation pos4 유지

**eq-test 바이럴 최적화:**
- FAQ 5Q → 8Q 확장 (EQ dimensions, test duration, trainability)
- title/description/keywords SEO 최적화 + OG/Twitter meta 소셜 최적화
- eq-test 블로그 12/12 언어 생성 (EN 카나리 → 11개 번역)
- eq-test 크로스링크: 4개 앱에 추가 (hsp-test, anxiety-type, stress-check, social-battery, emotion-temp)
- EN 블로그 5개에 eq-test 내부 링크 추가

**anxiety-type 블로그 12/12 완성:**
- 나머지 10개 언어 번역 완료 (zh/hi/ru/ja/es/pt/id/tr/de/fr)

**HTML 버그 일괄 수정 (9개 앱):**
- 중첩 `<a>` 태그 (anxiety-type inside stress-response) 수정
- hsp-test, stress-check, social-battery, emotion-temp, animal-personality, attachment-style, eq-test, mbti-city, stress-type

**인프라:**
- 하네스 업그레이드: TeamCreate/TaskCreate/CronCreate 도구 통합
- 블로그 인덱스 12개 언어에 eq-test 엔트리 추가
- 사이트맵 692 URLs (+24)

### 세션242 (3/17) - anxiety-type (104번째 앱) + stress-response 블로그 완료

**anxiety-type (104번째 앱):**
- "What's Your Anxiety Type?" 6유형 불안 진단, --primary: #10b981, 배포 완료

**stress-response 블로그 12/12 + anxiety-type 블로그 en+ko + 내부 링크 12개 앱**

### 세션241+ (3/17) - stress-response 배포 + EN 롱테일 블로그 + 내부링크

**stress-response (103번째 앱):** Fight/Flight/Freeze/Fawn, --primary: #6366f1, 배포 완료
**EN 롱테일 4개 + 내부 링크 11개 앱 + 3개 블로그**

### 세션220-240 (3/17) - 자율 20세션: burnout-test + JSON-LD 수정 + 내부링크

**burnout-test (101번째 앱):** 6유형, --primary: #ef4444, 배포 완료
**JSON-LD 수정 4개** + dopamine-type/burnout-test 블로그 24/24 + 내부링크 12+앱

### 세션219 (3/15) - dopamine-type (100번째 앱)

8문항 6유형 뇌과학 테스트, --primary: #f59e0b, 배포 완료

### 세션209-218 (3/15) - SEO 스키마 + CTR 최적화 + 바운스 개선

FAQPage 전앱 100%, BreadcrumbList 90/99, CTR pos3-7 최적화, 바운스 3개 앱

### 세션188-208 (3/15) - 신규 앱 2개 + SEO + 블로그

overthinker-test(98) + red-flag-test(99), 블로그 24개, SEO 텍스트, 게임 try-catch

### 세션173-187 (3/14) - 전략 전환 + 대규모 테스트 SEO + 신규 앱

ai-personality(97), FAQPage 대규모 적용, 게임 참여도 8개, 바운스 감소 4개

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 163-172 | 3/13 | 9개 앱/게임 UX 폴리시 (자율 10세션) |
| 153-162 | 3/13 | 크로스프로모 95/95, 게임 13종 폴리시 |
| 143-152 | 3/11-13 | Teams, i18n 전수조사, RS 리디자인 |
| 104-142 | 3/9-10 | Brick Breaker, 내부링크, 쿠키커터 24개, 신규앱 4개 |
| 1-103 | 2/4-22 | 앱96개, 포털, RS 3D, i18n, MBTI16, 블로그600+, AdSense |

---

## 다음 우선순위

1. **eq-test 모멘텀 유지** — 소셜 공유 경로 분석, 추가 EQ 관련 롱테일 블로그
2. **첫 Organic 클릭 확보** — pos3-7 앱 CTR 모니터링 + 인덱싱 대기
3. **신규 바이럴 테스트** — GSC 트렌드 기반 키워드 발굴
4. **EN 롱테일 블로그** — EQ/anxiety/stress 관련 추가 콘텐츠
