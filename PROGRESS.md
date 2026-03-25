# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-25 (세션308: 다국어trauma-bonding9/10+블로그1404)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **108개** (projects/ 108 디렉토리, 앱 108 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **1404개** |

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
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **1607 URLs**, 피드백 페이지 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. eq-test 바이럴(108u/일) 확인.

---

## 세션 기록

### 세션304-307 (3/25) - EN배치5+6(10개) + KO10 + 다국어50/50 + 내부링크13

**#1 EN 롱테일 블로그 10개 (배치5+6, 총 45개):**
- 배치5: imposter-syndrome, emotional-numbness, narcissistic-abuse, abandonment-issues, self-compassion
- 배치6: trauma-bonding, emotional-dysregulation, dissociation, hypervigilance, codependency-recovery

**#2 KO 번역 10/10 완료** ✓

**#3 다국어 50/50 전량 완료** ✓ (배치5 토픽 × 10언어)

**#4 배치6 다국어 시작:** trauma-bonding 9/10 완료 (HI 미완)

**#5 내부링크 +13개 + EN/KO 블로그 인덱스 +5카드 + 사이트맵 1607 URLs**

**배포:** portal 35+ push, 블로그 1404개

### 세션302 (3/25) - 다국어 번역 4차 30개 + 내부링크 강화 + 깨진 링크 수정

**#1 다국어 번역 4차 (6언어×5토픽=30개, 18/30 완료 중):**
- 5개 토픽: anxious-attachment, cognitive-distortions, flashbacks, love-bombing, RSD
- DE 5/5 ✓, FR 5/5 ✓, RU 5/5 ✓, HI 5/5 ✓, ID 5/5 ✓, TR 5/5 ✓
- **30/30 전량 완료** ✓, 전체 canonical 검증 통과

**#2 내부링크 강화 +12개:**
- attachment-4types → anxious-attachment+disorganized
- cbt-overthinking → cognitive-distortions
- trauma-4f → emotional-flashbacks
- gaslighting → love-bombing
- anxiety-types → RSD+cognitive-distortions
- dating-red-flags → love-bombing
- toxic-relationship → love-bombing+gaslighting
- inner-child-wounds → emotional-flashbacks
- people-pleasing → anxious-attachment
- social-anxiety → RSD+cognitive-distortions

**#3 깨진 내부 링크 158개 수정 (EN 12 + 다국어 146, 잔여 0개):**
- attachment-style-test-guide → test-quiz, avoidant-dating-guide → dating-patterns
- emotional-neglect-childhood → signs-healing, inner-child-healing → healing-guide
- red-flag-test-dating → test-guide, shadow-work-guide → quiz-guide
- toxic-relationship-patterns → patterns-signs, toxic-trait-test-guide → quiz-guide
- trauma-response-guide → test-guide, hsp-test-ko-slug → en-slug
- +다국어 146개: HSP/iceberg/attachment/perfectionism/cbt/jung 등 언어별 올바른 슬러그로 교정

**#4 블로그 인덱스 업데이트:**
- ZH/JA/ES/PT/DE/FR/RU/HI/ID/TR 10개 언어 인덱스에 5개 카드 추가

**#5 사이트맵:** +30 URL (1487 URLs)

**배포:** portal 3회 push 완료

### 세션300-301 (3/25) - EN 롱테일5 + KO 번역5 + 내부링크 강화

**#1 GA4/GSC 분석 (3/19~25):**
- 146u/293pv/7d, Organic 16u/145s체류/37.5%bounce
- stress-management pos10.45 유지, EI 12imp/pos89.7
- trauma-response/shadow-work 0% bounce (page_engage 효과 확인!)

**#2 EN 롱테일 블로그 5개 (배치4, 총 35개):**
- anxious-attachment-style-relationships, cognitive-distortions-list
- emotional-flashbacks-cptsd, love-bombing-signs-narcissist
- rejection-sensitivity-dysphoria

**#3 내부링크 강화:**
- stress-management 역방향 링크 +5개 (anxiety-types, dopamine-detox, self-esteem, emotional-triggers, healthy-boundaries)
- EI 블로그 역방향 링크 +2개 (codependency, avoidant-attachment)

**#4 KO 번역 5개 진행중:**
- 5개 새 블로그 KO 번역 에이전트 실행중

**#5 인프라:**
- 사이트맵 +10 URL (1437 URLs)
- EN/KO 블로그 인덱스 업데이트

**배포:** portal push 완료

### 세션299 (3/25) - 다국어 롱테일 3차 50/50 완료 + JSON-LD 조사

**#1 다국어 롱테일 3차 완료 (50/50 ✓):**
- 13개 누락 번역 전량 완료: JA×1, PT×1, RU×1, HI×2, ID×4, TR×4
- 10개 언어 × 5토픽 = 50개 전량 완료
- Canonical URL 전량 검증 통과

**#2 레거시 JSON-LD 조사:**
- 9개 EN 블로그 JSON-LD 누락 확인 → 전부 17줄 리다이렉트 스텁 → 추가 불필요

**#3 기타:**
- ID disorganized-attachment 에이전트 실수 삭제 → git checkout 복원
- Portal 4회 push 완료

**배포:** portal push 완료

### 세션294-298 (3/23-25) 요약

| 세션 | 주요 작업 |
|------|----------|
| 298 | KO롱테일5 + 다국어50 + 블로그품질대수술(GA4+AdSense+footer수정) |
| 297 | page_engage 107/107 전앱 + EI 내부링크 강화 + GA4/GSC 분석 |
| 296 | EN롱테일30/30 + cross-promo 991블로그 + 다국어55 |
| 295 | EN롱테일20 + bounce수정 + OG이미지107개 + 다국어50 |
| 294 | EN롱테일10 + OG이미지 + 사이트맵 |

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 293-295 | 3/23-24 | KO롱테일20/20 + OG이미지107개 + EN롱테일20 + 다국어50 + bounce수정 |
| 290-292 | 3/23 | result-card전앱 + canonical대수술 + KO롱테일15 + OG이미지29개 |
| 289 | 3/23 | trauma-response(108번째앱) + $1/day 전략 + result-card.js |
| 285-288 | 3/23 | shadow-work(106)+inner-child(107) 풀빌드 + 블로그 + 백업 |
| 282-284 | 3/23 | 전략 재점검 + 홈/포털 재설계 + 멀티디바이스 + AI 프리미엄 |
| 280-281 | 3/20-22 | 대규모 번역 + 버그 수정 + SEO 첫 클릭 캠페인 |
| 245-275 | 3/19-20 | toxic-trait(105)+red-flag 블로그 번역 + 10개 블로그 x12언어 |
| 209-244 | 3/15-19 | dopamine(100)+burnout(101)+stress(103)+anxiety(104) + FAQPage 100% |
| 173-208 | 3/14-15 | 전략 전환 + ai-personality(97)+overthinker(98)+red-flag(99) |
| 1-172 | 2/4-3/13 | 앱96개→, 포털, i18n, 블로그600+, AdSense, 크로스프로모 |

---

## 다음 우선순위

1. **배치6 다국어 잔여** — HI trauma-bonding(1) + dysregulation/dissociation/hypervigilance/codependency-recovery × 10언어(40) = 41개
2. **EN 롱테일 블로그 배치7** — 새 토픽 5개
3. **page_engage bounce 효과 모니터링** — 107/107 전앱 적용
4. **stress-management pos 추적** — pos10.45, 첫 클릭 임박
