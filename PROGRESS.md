# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-31 (세션341: Hail Mary 트렌드 앱 + 블로그 런칭)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **109개** (projects/ 109 디렉토리, 앱 109 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **1562개** |

**앱 분류:** 유틸 12 / 바이럴 테스트 **58** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 10

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
| 카테고리 허브 | Games(21), **Tests(41)**, Tools, MBTI (4개 랜딩페이지) |
| OG 이미지 | **107개 앱별 1200×630 PNG** (전앱 완료) + 470+블로그 교체 완료 |
| 런타임 검증 | **Playwright 스모크 테스트 + analytics event harness** + 게임 루프 try-catch **21/21** 게임 |
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

### 세션348 (4/7) - redirect 포함 15개 blog URL 정리

**#1 입력 데이터:**
- 사용자 제공 `Coverage Drilldown` CSV(`리디렉션이 포함된 페이지`)에 `15개 URL`이 들어 있었고, 모두 `portal/blog/` 하위 redirect alias 또는 그와 직접 연결된 예전 slug였다

**#2 원인 판정:**
- 문제는 redirect 파일 자체보다, 이 URL들이 여전히 `blog/sitemap.xml`, `portal/sitemap.xml`, blog 허브 카드, 관련 글 링크, `hreflang` / `xhtml:link`에서 계속 노출되고 있었다는 점이었다
- 따라서 해결 방향을 `redirect 추가`가 아니라 `redirect URL의 제출/노출 제거`로 잡았다

**#3 실제 수정:**
- `scripts/cleanup-redirect-coverage.py`를 추가해 이번 CSV의 15개 redirect URL에 대해:
  - sitemap의 `<loc>` redirect 블록을 제거하고
  - `hreflang` / `xhtml:link`에서 redirect URL 라인을 제거하며
  - 일반 내부 링크/허브 카드/JS 데이터는 최종 타깃 URL로 교체하도록 자동 정리했다
- 그 결과 `projects/portal/blog/**`, `projects/portal/blog/sitemap.xml`, `projects/portal/sitemap.xml`, `projects/portal/index.html`, `projects/portal/tests/index.html` 등 redirect 노출원이 있던 파일들이 함께 정리됐다

**#4 검증:**
- exact URL 재검색 기준, CSV의 15개 URL은 이제 redirect 파일 자기 자신 외의 제출/내부 참조 지점에서 제거됐다
- `python scripts/check-blog-hreflang.py` → `OK: no missing blog hreflang targets found`
- `node scripts/blog-hub-nav-check.js` → `12/12 PASS`
- `node scripts/analytics-event-check.js` → `8/8 PASS`

### 세션347 (4/4) - GA4/GSC 판정 + locale blog hub 발견 신호 강화

**#1 GA4 판정:**
- 오늘은 규칙대로 `GA4 -> GSC` 순서로 조회를 진행했다
- 최근 7일 `pagePath` 기준 상위 표면은 여전히 `/eq-test/`, `/hail-mary-mode/`, `/portal/mbti/`, `/portal/`, `/portal/tests/`였고, 블로그 허브 자체는 아직 큰 유입면이 아니었다
- 따라서 직전 세션의 `blog 허브 prefetch`는 즉시 트래픽 확대보다 `내부 분배 효율`과 `향후 검색 유입 대비` 성격이 강하다고 판단했다

**#2 GSC 판정:**
- `index_inspect` 기준 `https://dopabrain.com/portal/blog/en/`은 `Submitted and indexed`
- `https://dopabrain.com/portal/blog/ko/`는 `Discovered - currently not indexed`
- `https://dopabrain.com/portal/blog/ja/`는 `URL is unknown to Google`
- 대표 글 샘플 `en/ko/anger-management-techniques-guide.html`는 둘 다 `Submitted and indexed`라, 병목은 개별 글보다 `locale hub 발견/우선순위` 쪽에 가깝다고 봤다

**#3 원인 재점검:**
- `portal/blog/sitemap.xml`에는 locale hub 엔트리가 이미 들어 있어, 단순 사이트맵 누락 문제는 아니었다
- 대신 강한 내부 허브에서 `ko/ja blog hub`로 직접 보내는 링크가 상대적으로 약하다고 판단했다

**#4 실제 구현:**
- `projects/portal/blog/index.html` 상단에 `빠른 언어 허브` 섹션을 추가해 `ko`, `ja`, `en` blog hub로 바로 들어가는 내부 링크를 더 앞단에 노출했다
- `projects/portal/tests/index.html`에도 `Blog Hubs by Language` 섹션을 추가해 강한 테스트 허브에서 `en`, `ko`, `ja` blog hub로 직접 이동하는 링크를 만들었다
- 새 링크는 모두 `js-prefetch-link`로 연결해 기존 navigation 최적화와 같이 동작하게 했다

**#5 검증:**
- `ReadLints` 기준 신규 lint 에러 없음
- `node scripts/analytics-event-check.js` → `8/8 PASS`
- `node scripts/blog-hub-nav-check.js` → `12/12 PASS`

### 세션346 (4/4) - blog EN 허브 prefetch 카나리 반영

**#1 재개 시점 점검:**
- `PROGRESS.md`와 `memory/data-check-log.md`를 기준으로 이어갈 작업을 재정렬했고, 오늘자 `GA4/GSC` 조회 기록은 아직 없음을 확인했다
- 현재 도구 범위에서는 분석 MCP를 직접 호출할 수 없어, 이번 턴은 다음 우선순위였던 `blog 허브 카나리 적용`을 코드 레벨로 먼저 진행했다

**#2 실제 구현:**
- `projects/portal/blog/en/index.html`에 `window.__navOptimizationsConfig`와 `/portal/js/nav-optimizations.js`를 연결했다
- EN 블로그 허브의 기사 카드 렌더링에 `.js-prefetch-link`를 추가해, 기사 카드 클릭 후보에만 선택적 `prefetch`가 걸리도록 제한했다
- `hubName`은 `blog-en`으로 분리해 이후 `bfcache restore` 측정 시 기존 `portal`/`tests`/`mbti` 허브와 구분 가능하게 했다

**#3 확장 판단:**
- `projects/portal/blog/ko/index.html`도 바로 점검했지만, EN 허브와 달리 정적 카드 누적/혼합 구조라 동일 패턴을 바로 복제하기엔 blast radius가 더 컸다
- 따라서 이번 세션에서는 EN만 카나리로 유지하고, KO 포함 다른 locale 허브 확장은 구조 정리 또는 실브라우저 확인 뒤로 미뤘다

**#4 검증:**
- `ReadLints` 기준 `projects/portal/blog/en/index.html`, `projects/portal/js/nav-optimizations.js` 신규 lint 에러 없음

**#5 추가 진행:**
- 먼저 `projects/portal/blog/ko/index.html`, `projects/portal/blog/es/index.html`, `projects/portal/blog/zh/index.html`에 공통 스크립트를 연결했다
- 이어서 `ja`, `pt`, `id`, `tr`, `de`, `fr`, `hi`, `ru` locale 허브도 상단 구조를 확인한 뒤 같은 패턴으로 확장했다
- `ko`/`es`/`zh`는 `.blog-grid > a.blog-card[href]`처럼 조금 더 좁은 selector를 썼고, 나머지 locale은 `a.blog-card[href]` selector로 카드 구조 차이를 흡수했다
- 결과적으로 현재 `portal/blog/{lang}/index.html` 12개 locale 허브 전체가 `nav-optimizations.js` 기반 `bfcache restore` 측정 + 선택적 `prefetch` 적용 상태다

**#6 남은 판단:**
- 이제 남은 핵심은 코드 확장이 아니라 실브라우저 확인이다: `blog-en`/`blog-ko`/`blog-ja` 정도를 샘플로 잡아 speculation 동작과 `pageshow persisted` 기반 복귀 계측이 실제로 잡히는지 확인
- `ko` 허브는 동작은 붙였지만 내부 카드 구조가 가장 불균일하므로, 추후 구조 정리 세션에서 별도 정돈 후보로 유지

**#7 자동 검증 추가:**
- `scripts/blog-hub-nav-check.js`를 새로 추가해 정적 서버 + Playwright 기반으로 locale 블로그 허브의 `speculationrules` 주입 여부를 자동 점검할 수 있게 했다
- 최종 실행 결과 `12/12 PASS`였고, 모든 locale 허브에서 기대한 selector로 `prefetch` 규칙이 주입되는 것을 확인했다
- 같은 headless 환경에서는 `bfcache restore`는 관측되지 않았으므로, 이 값은 실패가 아니라 `실브라우저에서 최종 확인 필요` 상태로 기록한다
- 브라우저 자동화 도구의 localhost 접근은 이번 세션에서 불가해 실브라우저 QA는 에이전트 환경 한계로 보류하고, 실패 로그를 규칙대로 남겼다
- 회귀 체크로 `node scripts/analytics-event-check.js`를 다시 실행했고 기존 시나리오 `8/8 PASS`를 유지했다

**#8 blog hreflang 전체 정리:**
- `python scripts/check-blog-hreflang.py` 전체 실행에서 `292개 파일`에 걸친 `MISSING_TARGET` 문제가 확인됐고, 핵심 패턴은 `실제 없는 locale alternate를 대량 선언한 blog 글`이었다
- `scripts/check-blog-hreflang.py`에 `--fix` 모드를 추가해 placeholder / 중복 locale segment / 존재하지 않는 blog target을 가리키는 `<link rel="alternate">` 라인을 인플레이스로 제거할 수 있게 했다
- `python scripts/check-blog-hreflang.py --fix` 실행으로 `292 files`를 자동 정리했고, 이후 재검사 결과 `OK: no missing blog hreflang targets found`를 확인했다
- 샘플 확인 결과 각 글은 `canonical + 실제 존재 locale + x-default`만 남도록 정리됐고, 루트형 단일 locale 글은 잘못된 alternate가 제거돼 단일 locale 선언만 유지됐다
- 정리 이후 `node scripts/blog-hub-nav-check.js`를 다시 실행해 locale 허브 `12/12 PASS`를 재확인했다

### 세션345 (4/4) - bfcache 측정 + 허브 prefetch 1차 반영

**#1 Google 메일 기반 성능 반영 검토:**
- `bfcache`, `Speculation Rules API`, `Chrome DevTools MCP` 제안을 현재 코드베이스 기준으로 감사했다
- 1차 코드 검색에서는 `unload`/`beforeunload` 계열 고전 blocker는 거의 없었고, 즉시 반영 가능한 고효율 작업은 `허브 페이지의 안전한 prefetch`와 `bfcache 복귀 측정`으로 판단했다

**#2 실제 구현:**
- `projects/portal/js/nav-optimizations.js`를 추가해:
  - `pageshow`의 `event.persisted` 기준으로 bfcache 복귀를 감지하고
  - GA4에 `navigation_type: back_forward_cache`를 포함한 `page_view`를 추가 전송하며
  - 브라우저가 지원하면 `Speculation Rules` 기반 `prefetch`를 `moderate` 적극성으로 주입하도록 구성했다
- `projects/portal/tests/index.html`, `projects/portal/mbti/index.html`, `projects/portal/index.html`에 공통 스크립트를 연결하고, 핵심 CTA/허브/후속 읽을거리 링크만 `.js-prefetch-link`로 지정해 과도한 speculation 없이 선택적 prefetch만 적용했다

**#3 왜 이 범위부터 시작했는가:**
- 허브 페이지는 내부 분배의 출발점이라 prefetch 체감이 크고, 앱/블로그 개별 페이지보다 blast radius가 작다
- AdSense + GA4가 전역적으로 들어가 있어, `prerender`까지 바로 확대하면 광고/분석 계측 리스크가 커서 우선 `prefetch`만 적용했다

**#4 검증:**
- `node scripts/analytics-event-check.js` → `portal`, `portal-tests`, `portal-mbti` 포함 **8/8 PASS**
- `ReadLints` 기준 신규 lint 에러 없음

**#5 다음 세션 설계:**
- 1순위: 실제 Chrome DevTools 또는 `chrome-devtools-mcp` 기반으로 `portal/tests/`, `portal/mbti/`, `portal/`의 speculation 동작과 bfcache restore를 실브라우저에서 확인
- 2순위: 이상 없으면 `portal/blog/{lang}/index.html` 허브들에 같은 패턴을 확장하되, locale 허브는 배치 적용 전 카나리 1개 언어부터 검증
- 3순위: 게임/오디오 앱군은 `AudioContext`와 SW 영향까지 포함해 bfcache eligibility를 따로 점검하고, 필요 시 `pagehide/pageshow` 정리로 2차 최적화를 설계

### 세션344 (4/4) - Coverage Drilldown 정리 + hreflang 재발 방지

**#1 Coverage CSV 실분류:**
- 사용자 제공 `Coverage Drilldown` CSV를 실제 파일 기준으로 재분류해, 78개 중 즉시 손댈 기술 이슈는 `8건`으로 축소했다
- 핵심 패턴은 `존재하지 않는 locale hreflang URL`, `옛 slug`, `legacy path(/projects/white-noise/, /quiz/, /portal/blog/{lang}/)`였다

**#2 실제 수정:**
- `validation-seeking`, `nervous-system-quiz-polyvagal`, `unit-converter`, `planificador-rutinas` 관련 글에서 `hreflang`을 실제 존재 locale만 남기도록 축소했다
- `es/validation-seeking-behavior-guide.html`, `es/unit-converter-guide.html`, `es/nervous-system-quiz-polyvagal-guide.html`, `ko/pt/routine-planner-guide.html`, `root-domain/projects/white-noise/`, `root-domain/quiz/`, `portal/blog/{lang}/`에 redirect alias를 추가했다

**#3 재발 방지 장치:**
- `scripts/check-blog-hreflang.py`를 추가해 블로그 HTML의 `hreflang`이 placeholder, 중복 locale segment, 존재하지 않는 타깃을 가리키는지 빠르게 점검할 수 있게 했다
- 타깃 파일 7개 기준 검사 결과 `OK: no missing blog hreflang targets found` 확인

**#4 다음 세션 설계:**
- 1순위: `python scripts/check-blog-hreflang.py`를 전체 `projects/portal/blog/`에 돌려 남아 있는 잘못된 locale 선언을 배치 정리
- 2순위: 정리 후 새 Coverage export 또는 GSC 드릴다운으로 잔여 URL이 `redirect alias`인지 `실제 noindex/비색인`인지 다시 분리
- 3순위: 다음 유효 조회일에는 `GA4 -> GSC -> AdSense` 순으로 `hail-mary-mode`, `portal/tests`, winner blog 4개를 재판정해 `locale 확장`과 `허브 노출 강화` 중 다음 배치를 결정

### 세션343 (4/1) - 성장 복귀 설계 정리

**#1 데이터 판정 루프 설계:**
- `docs/GROWTH-RECOVERY-DESIGN.md`를 추가해 `GA4 -> GSC -> AdSense` 순서의 유효 조회일 판정 루프와 `PROGRESS.md` 6줄 요약 기준을 고정
- 이번 복귀의 핵심 판정 질문을 `/hail-mary-mode/` 세션 발생, 허브 분배, winner 블로그 유입, AdSense 수익/경고 안정성으로 정리

**#2 Hail Mary 확장 설계:**
- `stress-response`, `burnout-test`, `eq-test`, `brain-type`, `portal/tests`, `portal` 기준으로 `Hail Mary`의 메인/보조/유지 역할을 파일 단위로 정리
- 실제 구현 우선순위는 `stress-response -> burnout-test -> eq-test -> brain-type` 순으로 확정

**#3 winner 블로그 2차 설계:**
- `stress-management-techniques-guide`는 12개 언어 기반이 이미 있어 확장 허브로 사용
- `habit-building`은 EN only 상태이므로 locale 확장보다 허브 유입 확대를 먼저 하기로 정리
- `digital-detox`는 focus/habit/stress 중간 허브, `blood-type`은 winner 유지형으로 분류

**#4 다음 구현 순서:**
- 다음 유효 조회일에 `GA4/GSC/AdSense`를 먼저 보고
- 그 결과를 기준으로 `확장 / 관찰 / 유지`를 나눈 뒤
- `Hail Mary` 교차 진입과 winner 블로그 2차를 실제 파일 수정으로 들어간다

### 세션342 (3/31) - 전용 AdSense MCP 구현

**#1 프로젝트 전용 MCP 서버 구현:**
- `E:/Fire Project/.mcp-servers/adsense-mcp/`에 TypeScript 기반 stdio 서버를 새로 만들고 `init`, `doctor`, `run` CLI를 구현
- OAuth 사용자 인증, 사용자 프로필 토큰 저장(`%USERPROFILE%/.config/adsense-mcp/`), 파일 기반 캐시, 429/5xx retry/backoff를 포함한 read-only AdSense 클라이언트를 구성
- MCP 도구 12개(`accounts`, `earnings summary`, `reports`, `sites`, `alerts`, `policy issues`, `payments`, `ad clients`, `ad units`, `url/custom channels`, `saved reports`)를 등록

**#2 운영 경로 반영:**
- `C:/Users/박상우/.codex/config.toml`의 `adsense` 엔트리를 제3자 패키지에서 로컬 `node "E:/Fire Project/.mcp-servers/adsense-mcp/build/index.js" run`으로 교체
- `scripts/mcp-restore.sh`에 `monetization` 그룹과 `adsense` 등록 명령을 추가
- `CLAUDE.md`, `docs/ANTIGRAVITY-SETUP.md`, `docs/ADSENSE-MCP.md`에 init/doctor/run 및 등록 절차를 문서화

**#3 검증 상태:**
- `npm run build` 통과
- 임시 프로필(`ADSENSE_MCP_PROFILE_DIR`)로 `node build/index.js run` + `tools/list` 호출 정상 확인
- 사용자 제공 OAuth client JSON 존재/구조 확인 완료
- 실사용 OAuth `init` 완료 후 `doctor` 통과
- 핵심 조회 4종 실검증 완료:
  - `adsense_get_earnings_summary` 정상 응답
  - `adsense_list_sites` 정상 응답 (`dopabrain.com`, `READY`, `autoAdsEnabled=true`)
  - `adsense_list_policy_issues` 정상 응답 (현재 이슈 없음)
  - `adsense_list_ad_units` 정상 응답 (`ca-pub-*` 클라이언트 기준 조회, 비지원 `partner-*`는 자동 스킵)
- 실제 프로필 기준 `tools/list` 응답으로 12개 tool descriptor 노출 확인
- 추가 실검증 완료:
  - `adsense_list_payments` → 현재 미지급 수익 `$1.22`
  - `adsense_list_alerts` → `ua-conflict-policy-update` 경고 1건 확인
  - `adsense_list_saved_reports` → 현재 저장 리포트 없음
- 운영 반영:
  - `docs/OPERATIONS.md`에 AdSense 일간/주간 점검 루틴 추가
  - `docs/STRATEGY.md` 수익 층에 AdSense unpaid/trend/alerts 포함
  - `memory/data-check-log.md`에 AdSense 일일 조회 기록 형식과 오늘 점검 로그 추가

### 세션341 (3/31) - Hail Mary 트렌드 앱 + 블로그 런칭

**#1 새 트렌드 앱 런칭:**
- `projects/hail-mary-mode` 신규 서브모듈 앱을 생성하고 `Hail Mary Mode Test`를 실제 구현
- 12문항, 4결과(`Mission Brain`, `Signal Keeper`, `Chaos Pilot`, `Last-Light Guardian`), 4축(`Pressure Logic`, `Emotional Containment`, `Adaptive Risk`, `Mission Bond`) 구조로 `eq-test`와 유사한 결과형 퍼널을 구성
- 12개 언어 i18n, app-loader, skip-link, GA4, AdSense, cross-promo, manifest, sw, JSON-LD, 결과 저장/공유까지 포함해 신규 앱 품질 게이트를 바로 통과 가능한 형태로 마감

**#2 Hail Mary 트렌드용 블로그/유입면 추가:**
- `projects/portal/blog/en/hail-mary-mindset.html` 신설로 `왜 지금 Hail Mary 서사가 먹히는가`를 심리 해석형 콘텐츠로 정리하고 새 앱 `/hail-mary-mode/`로 직접 연결
- `projects/portal/index.html` EN 블로그 피드에 새 글을 추가해 홈에서 트렌드 진입이 가능하도록 반영
- `projects/portal/blog/en/stress-management-techniques-guide.html` 관련 링크에 `Hail Mary Mode Test`와 새 글을 넣어 압박/위기 대응 클러스터 안에서 자연스럽게 순환되도록 연결

**#3 tests 허브 연결:**
- `projects/portal/js/app-data.js`에 `hail-mary-mode` 앱 메타와 11개 언어 이름/설명을 추가
- `projects/portal/tests/index.html` 메타/JSON-LD/카운트를 `41 tests` 기준으로 갱신하고, featured + emotion grid에 `Hail Mary Mode Test` 카드를 추가
- `projects/portal/js/locales/*.json` 12개 언어의 `hub_tests.badge`도 `41` 기준으로 맞춰 허브 수치와 실제 카드 수가 어긋나지 않도록 정리

**#4 검증/배포 준비:**
- `bash scripts/quality-gate.sh projects/hail-mary-mode` → **PASS**
- `bash scripts/app-test-suite.sh projects/hail-mary-mode` → **10/10 PASS**
- `node scripts/analytics-event-check.js` → 기존 `portal`, `portal-tests`, `portal-mbti`, winner blog 4개, `eq-test`까지 **8/8 PASS**

### 세션340 (3/31) - 10세션 실행안 1차 일괄 반영

**#1 winner blog 4개를 하나의 후속 네트워크로 재구성:**
- `projects/portal/blog/en/habit-building.html`에 `x-default` hreflang을 추가하고, `Stress Response Test`/`EQ Test`를 끼워 넣어 `습관 → 스트레스 패턴 → EQ` 흐름이 한 페이지 안에서 바로 이어지도록 재배치
- `projects/portal/blog/en/stress-management-techniques-guide.html`는 `digital-detox`와 `habit-building`을 더 앞단 자원으로 끌어올려, 스트레스 완화 글이 곧바로 환경 리셋/루틴 구축으로 연결되도록 정리
- `projects/portal/blog/en/blood-type-personality-guide.html`, `projects/portal/blog/en/digital-detox.html`는 서로를 연결하고 `dopamine-type`/`EQ Test`/`digital-detox`를 섞어 `재미형 유입 → 자기이해 → 행동형 가이드` 순환을 강화

**#2 허브 역할 분리 문구까지 고정:**
- `projects/portal/tests/index.html` 상단에 `/portal/mbti/` 바로가기를 추가하고, 하단 CTA 목적지를 게임에서 `MBTI 허브`로 전환해 `/portal/tests/`가 분배 허브 역할에 더 집중하도록 조정
- `projects/portal/mbti/index.html`는 CTA 섹션과 `next-tests`에 `/portal/tests/` 복귀 동선을 추가해, MBTI 허브가 `전체 테스트 홈`을 대체하지 않고 관계형 체류 허브 역할에 머물도록 정리
- `projects/portal/js/locales/*.json` 12개 언어의 `hub_tests.faq_a5`, `hub_tests.cta_*`를 업데이트해, 테스트 허브 문구도 `EQ → MBTI 허브 → Stress Check` 순서와 맞도록 통일

**#3 eq-test 결과 화면 정리:**
- `projects/eq-test/index.html`에서 결과 inline ad를 related grid 아래로 이동해 내부 순환 카드가 광고보다 먼저 보이도록 우선순위를 재정렬
- related grid에서는 하위 우선 카드 일부를 제거해 결과 직후 선택지가 과도하게 늘어지는 문제를 줄이고, 핵심 허브/테스트/블로그 카드만 남겨 다음 클릭 결정을 더 단순화

**#4 locale 우선순위/검색 정합성 반영:**
- `digital-detox`는 실제 존재하는 `ru` 버전까지 hreflang에 반영하고 `x-default`를 추가해 현재 배포된 locale 범위 안에서만 검색 신호를 맞춤
- `habit-building`은 EN 단독 유지 상태를 명시하는 수준으로만 정리하고, 실제 locale 확장은 다음 배치 설계 과제로 남김
- `habit-building`/`digital-detox` 메타 설명은 `stress`, `trigger`, `focus`, `habit` 중심으로 다듬어 검색 의도와 내부 링크 방향이 더 잘 맞게 조정

**#5 검증:**
- `ReadLints` 기준 이번 수정 파일들에서 추가 lint 에러 없음
- `node scripts/analytics-event-check.js` 결과 `portal`, `portal-tests`, `portal-mbti`, winner blog 4개, `eq-test`까지 **8/8 PASS**

### 세션339 (3/31) - GA4 없이 허브→EQ 흐름 강화 + 루트 예외 재점검

**#1 portal / tests / mbti → eq-test 동선 강화:**
- `projects/portal/index.html` 헤더 상단에 `EQ Test`와 `전체 테스트 보기` 진입점을 추가해, 포털 첫 화면에서 바로 감정/테스트 흐름으로 들어가게 조정
- `projects/portal/tests/index.html`는 `EQ Test`를 featured와 emotion grid에 모두 반영하고, 페이지 메타/`ItemList`/배지 수를 `40 tests` 기준으로 맞춰 분배형 허브 역할을 더 선명하게 정리
- `projects/portal/mbti/index.html`의 CTA 섹션과 호환성 모달에도 `EQ Test` 보조 진입점을 추가해, 관계형 허브에서 EQ 퍼널로 바로 넘어가는 경로를 보강

**#2 eq-test 결과 화면 후속 행동 강화:**
- `projects/eq-test/index.html` 결과 화면 공유 영역 아래에 `/portal/tests/`로 가는 보조 CTA를 추가해, 재도전 외에도 테스트 허브로 내부 순환이 가능하도록 변경
- related grid 상단에는 `/portal/tests/`, `Attachment Style`, `Stress Check`, `MBTI Love Match`를 먼저 배치해 결과 직후 `허브/핵심 테스트`가 winner blog보다 먼저 보이도록 순서를 재구성
- 새 허브 CTA도 기존 `eq_related_click` 계열 이벤트로 기록되도록 연결해, 다음 유효 조회일에 허브 복귀 흐름을 함께 판정할 수 있게 준비

**#3 i18n / 구조 정리:**
- `projects/portal/js/locales/*.json` 12개 언어에 `header.eq_cta_*`, `hub_tests.name_eq-test`, `hub_tests.desc_eq-test`를 추가하고 `hub_tests.badge`를 `40` 기준으로 통일
- 이번 배치에서는 GA4 재조회 없이 실행만 진행하고, 지표 판정은 다음 유효 조회일로 미뤄 `같은 날 재조회 금지` 원칙을 유지

**#4 root 예외 재점검:**
- 추가 점검 결과 `projects` 밖 루트에는 `aura-reading`, `number-merge` 같은 앱/alias 예외 디렉토리가 더 남아 있지 않음을 확인
- 예외성 엔트리는 현재 `projects/root-domain` 내부의 의도된 alias 수준(`number-merge`, `stress-test`, `privacy.html`)만 남아 있어, 루트 구조 정리는 일단 완료 상태로 판단

**#5 검증:**
- `ReadLints` 기준 이번 수정 파일들에서 추가 lint 에러 없음
- `node scripts/analytics-event-check.js` 결과 `portal`, `portal-tests`, `portal-mbti`, winner blog 4개, `eq-test`까지 **8/8 PASS**

### 세션338 (3/31) - winner blog CTA 고도화 + habit/stress 유입 보강

**#1 유입 발생 winner blog 후속 최적화:**
- `projects/portal/blog/en/blood-type-personality-guide.html`에서 CTA 버튼 묶음을 `Blood Type Test + Attachment Style Guide + EQ Test` 중심으로 재정렬하고, 관련 리스트 상단에도 `EQ Test`와 관계형 가이드를 더 직접 배치
- 같은 파일에 `Best next-click sequence` 안내 박스를 추가해, 유입이 생긴 독자가 `재미형 테스트 → 관계형 가이드 → EQ` 흐름으로 더 자연스럽게 이동하도록 정리
- `projects/portal/blog/en/digital-detox.html`는 툴/관련 글 블록에 `EQ Test`와 `Habit Building Guide`를 직접 넣어 `도구형 클릭`과 `후속 가이드 클릭`을 함께 노림

**#2 유입 미발생 글 보강 준비:**
- `projects/portal/mbti/index.html`의 `next-tests`에서 `Blood Type Guide` 대신 `Habit Building Guide`를 노출해, 아직 유입이 없던 `habit-building`에 허브 진입점을 추가
- `stress-management`는 기존 MBTI 허브 노출을 유지하고, `habit-building`도 같은 관계/자기이해 흐름 안에서 테스트 후속 읽을거리로 밀기 시작

**#3 검증:**
- 추가 GA4 재조회 없이 동일 날짜 제약을 유지하고, 이벤트 하네스만 재실행
- `node scripts/analytics-event-check.js` 결과 `portal`, `portal-tests`, `portal-mbti`, winner blog 4개, `eq-test`까지 **8/8 PASS**
- `ReadLints` 기준 이번 수정 파일들에서 추가 lint 에러 없음

### 세션337 (3/31) - GA4 운영체계 첫 실전 적용 + 허브/블로그 분기 판정

**#1 획득:**
- 같은 날짜에 이미 GA4 조회 기록이 있어 추가 MCP 재조회는 생략하고, 세션333~336에서 확보한 오늘자 GA4 데이터로 `팩1/팩2/팩3`를 첫 실전 적용
- 28일 구조 기준 `Direct 609세션`, `Organic Search 117세션`으로 여전히 Direct 편중이지만, 품질은 Organic이 더 높아 `브랜드/바이럴 유지 + SEO 확장` 이중 전략이 유효
- 랜딩 기준 메인 진입점은 `/eq-test 213`, `/ 85`, `/portal/mbti 34`, `/portal/blog/en/blood-type-personality-guide.html 18`로 요약

**#2 품질:**
- `/eq-test/`는 28일 기준 `engagementRate 62.6%`, `avgSessionDuration 152s`, 최근 3일 기준도 `17세션 / 243s`로 여전히 최강 표면
- `/portal/mbti/`는 28일 기준 평균 체류가 `358s` 수준으로 강한 체류형 허브지만, 분배량은 아직 작아 `좋은 허브`와 `강한 분배 허브`를 구분해 읽어야 함
- 세그먼트 품질은 `ko-kr 262세션 / 169s`, `South Korea 267세션 / 169s`, `mobile 326세션 / 143s`가 강하고, `en-us 373세션 / 42s`, `United States 180세션 / 61s`는 볼륨 대비 품질이 낮음

**#3 전환:**
- 메인 KPI는 여전히 표준 지표 + 안정 이벤트 중심으로 유지: 28일 기준 `eq_test_start 180`, `eq_test_complete 34`, 최근 3일 기준 `hub_view 6`, `hub_test_card_click 1`
- 반면 `premium_*`, `content_*`, `hub_cta_click`, `hub_faq_open`은 오늘까지도 Data API에서 안정적으로 안 보여 보조 KPI 유지
- 허브 → eq-test 흐름은 `중단`보다 `유지`로 판정하되, 추가 미세조정보다 다음 유효 조회일에 실제 세션 증가 여부를 먼저 보는 쪽으로 결정

**#4 재방문:**
- `new 581세션` 대비 `returning 109세션`으로 재방문층은 아직 얇지만, returning 평균 체류는 `263s`로 신규(`75s`)보다 훨씬 깊음
- 최근 기준 `DAU/WAU 0.35`, `WAU/MAU 0.28` 수준이라 루프형 서비스라기보다 아직은 신규 유입 의존 구조
- 따라서 다음 액션도 retention 기능 확장보다 `강한 랜딩 + 허브 유입 + SEO winner 확보`가 우선

**#5 수익/미수집:**
- `totalRevenue`, `totalAdRevenue`, `averageRevenuePerUser`, `adUnitExposure`는 오늘 확보된 데이터에서도 실질 활용 가능한 값이 없어 `미수집`으로 유지
- 수익 판단은 당분간 `eq-test 체류/완주`, `Organic 품질`, `winner blog 세션 발생`을 대리 지표로 사용

**#6 데이터위생:**
- `landingPage`는 `/eq-test`, `pagePath`는 `/eq-test/`처럼 슬래시 규칙이 갈려 있고, `(not set)` 세션도 존재해 해석 시 주의 필요
- `search.google.com / referral 35세션, activeUsers 1`, `Singapore 60세션 / 3s`, `Linux 65세션 / 5s` 등은 이상치/저품질 트래픽 후보로 분리 해석
- winner blog 분류는 28일 기준 `blood-type 발생(18)`, `digital-detox 발생(1)`, `habit-building 미발생(0)`, `stress-management 미발생(0)`으로 잠정 고정

### 세션336 (3/31) - GA4 인사이트 운영 체계 문서화

**#1 KPI 층위 고정:**
- GA4 해석 기준을 `획득 / 품질 / 전환 / 재방문 / 수익 / 데이터위생` 6개 층위로 재정의
- `sessions + 일부 custom event` 중심 해석에서 벗어나 `channel`, `landingPage`, `engagementRate`, `newVsReturning`, `DAU/WAU/MAU`, `revenue` 가능 여부까지 함께 보는 운영체계로 확장
- 특히 Data API에서 아직 불안정한 `premium_*`, `content_*`, `hub_cta_click`, `hub_faq_open`은 메인 KPI가 아니라 보조 KPI로 강등

**#2 세션용 조회 팩/표면별 KPI 설계:**
- `docs/GA4-INSIGHTS.md` 신설로 `28일 스냅샷`, `최근 3일 실험 표면`, `이벤트 건강도`, `조건부 팩` 4개 조회 묶음을 정의
- `app`, `hub`, `blog`, `cross_promo` 표면별 핵심 KPI/보조 KPI/해석 기준을 분리해 같은 숫자를 표면별로 다르게 읽지 않도록 정리
- `PROGRESS.md`에 남길 6줄 요약 템플릿과 `STRATEGY.md` 주간 스냅샷 템플릿도 함께 설계

**#3 운영 문서 연결:**
- `docs/OPERATIONS.md`에 GA4 일간 세션 루틴과 주간 리뷰 루틴을 추가해, 언제 어떤 팩을 보고 어디에 기록할지 명시
- `docs/STRATEGY.md`에는 주간 전략 스냅샷을 6층 구조로 누적하는 규칙을 추가
- `memory/data-check-log.md`에는 팩 번호와 목적을 함께 적는 형식으로 기록 원칙을 보강

**#4 방향성 결론:**
- 앞으로 세션 의사결정은 `custom event 반영 여부` 하나에 매달리지 않고, 표준 GA4 지표 기반 구조 판단을 우선한다
- winner blog는 `세션 발생 → CTA 최적화` 순서로 보고, 세션이 아직 없는 페이지는 유입 확보가 먼저다
- `Direct`/`Organic` 분리, locale별 볼륨/품질 분리, `미수집 수익 지표` 명시가 앞으로의 기본 규칙

### 세션335 (3/31) - traffic-first 허브 유입 강화 + 분석 표면 정리

**#1 측정 게이트 재확인 및 메인 분기 고정:**
- GA4 Data API(2026-03-29~31) 재조회 결과는 여전히 동일: `premium_*`, `content_*`, `hub_cta_click`, `hub_faq_open`은 미반영
- 반면 기준선은 그대로 유지되어 `/eq-test/ 17세션`, `/portal/ 3`, `/portal/mbti/ 3`, `/portal/tests/ 1`, winner blog 4개 `0` 상태 기준 이번 10세션 실행의 메인 축을 `traffic-first`로 확정

**#2 eq-test premium/result 후속 정리:**
- `projects/eq-test/index.html`에서 winner blog 4개 카드에 `data-blog-key`와 언어별 경로 매핑을 추가해, 현재 언어에 따라 가능한 locale 블로그로 우선 연결되도록 정리
- `premium_cta_view`, `premium_unlock_click`, `premium_unlock_complete`, `ai_analysis_view`, `eq_related_click`에 `surface_type=app`, `surface_name=eq_test_result`를 붙여 이후 표면별 비교가 가능하도록 정리
- 결과적으로 premium CTA 강화 작업을 더 하되, 당분간은 카피 미세조정보다 `결과 화면 → 다음 클릭` 구조 해석력을 높이는 쪽이 더 우선이라는 판단을 확정

**#3 portal/tests/mbti traffic 스프린트 구현:**
- `projects/portal/tests/index.html` featured 영역에 `/eq-test/` 카드를 추가하고, `data-app` 기반 카드 이름뿐 아니라 설명까지 locale별 `APP_DATA` shortDesc로 자동 채우도록 보강
- `projects/portal/mbti/index.html`의 `next-tests`를 `EQ Test`, `Attachment Style`, `Blood Type Test`, `Blood Type Guide`, `Stress Management Guide` 중심으로 단순화해 relationship cluster에서 `/eq-test/`와 winner blog로 더 직접 연결되도록 조정
- `projects/portal/index.html`, `projects/portal/tests/index.html`, `projects/portal/mbti/index.html`, `projects/portal/js/cross-promo.js`에 `surface_type` / `surface_name`과 blog locale/slug 등 공통 해석 파라미터를 추가해 hub/blog/app/cross-promo 표면을 같은 기준으로 읽을 수 있게 정리

**#4 방향성/부족한 점 점검 결론:**
- 계속 밀어야 할 것 3개: `eq-test → winner blog` 경로 강화, `portal/tests/mbti` 감정/관계 클러스터 정리, `surface_type` 중심 공통 분석 체계
- 덜 중요한 것 2개: Data API 미반영 상태에서의 premium 카피 소폭 반복실험, 게임/비핵심 허브 CTA 확장
- 보완해야 할 기반 2개: custom event 지연 반영 환경에서의 관찰 기준 통일, winner blog locale 불균형(`habit-building` 단일 언어 등) 해소

**#5 검증:**
- `node scripts/analytics-event-check.js` 재실행 결과 `portal`, `portal-tests`, `portal-mbti`, winner blog 4개, `eq-test`까지 **8/8 PASS**
- `ReadLints` 기준 이번 수정 파일들에서 추가 lint 에러 없음

### 세션334 (3/31) - eq-test CTA 개선 + winner blog 유입 경로 강화

**#1 측정 게이트 재확인 및 분기 결정:**
- GA4 Data API(2026-03-29~31) 재조회에서도 `premium_*`, `content_*`, `hub_cta_click`, `hub_faq_open`은 여전히 미반영
- 반면 `/eq-test/` 세션 17, `/portal/` 3, `/portal/mbti/` 3, `/portal/tests/` 1 기준선은 유지되어 `eq-test` 결과 화면 개선 + winner blog 유입 강화 쪽으로 실행

**#2 eq-test premium CTA 실험 구현:**
- `projects/eq-test/index.html`에서 AI 심층 분석 카드를 personalized tips 위로 올려 결과 화면에서 더 먼저 노출되도록 조정
- teaser 문구를 `preview + previewSecondary + teaserNote` 구조로 정리하고 `Unlock My EQ Roadmap` 계열 CTA로 변경
- `projects/eq-test/js/locales/*.json` 12개 언어에 새 premium teaser/related 라벨 키를 추가해 다국어 렌더링 유지

**#3 winner blog 유입/내부 클릭 최적화:**
- `eq-test` 결과 화면 상단 related 카드 4개를 `digital-detox`, `habit-building`, `stress-management-techniques-guide`, `blood-type-personality-guide`로 교체해 직접 유입 경로 확보
- winner blog 4개 중 `digital-detox`, `habit-building`, `stress-management`, `blood-type`에서 다음 클릭이 더 선명하게 일어나도록 CTA를 후속 가이드/도구 중심으로 조정
- 특히 `habit-building`의 홈 버튼을 제거하고 `Habit Tracker`/`Digital Detox`로 재정렬해 `content_cta_click` 해석력을 높임

**#4 검증:**
- `node scripts/analytics-event-check.js` 실행 결과 `portal`, `portal-tests`, `portal-mbti`, winner blog 4개, `eq-test`까지 **8/8 PASS**
- `ReadLints` 기준 이번 수정 파일들에서 추가 lint 에러 없음

### 세션333 (3/31) - GA4 custom event 재확인 + premium beacon 검증

**#1 GA4 custom event 반영 재확인:**
- GA4 Data API(2026-03-29~31) 기준 `hub_view` 6회, `hub_test_card_click` 1회가 실제 집계 반영된 것 확인
- pagePath 기준 `hub_view`는 `/portal/` 3회, `/portal/mbti/` 2회, `/portal/tests/` 1회 확인
- 반면 `hub_cta_click`, `hub_faq_open`, `content_*`, `premium_*`는 동일 기간 Data API에 아직 미반영

**#2 eq-test premium 전송 경로 판정:**
- `/eq-test/`는 동일 기간 GA4 기준 `sessions=17`, `totalUsers=6`, `eq_test_complete=1`까지 확인
- 운영 도메인 Playwright 점검에서 `window.dataLayer`에 `premium_cta_view`, `premium_unlock_click`, `premium_unlock_complete`, `ai_analysis_view`가 순서대로 push 되는 것 재확인
- 추가로 실제 GA `g/collect` POST body에 `eq_test_complete`, `premium_cta_view`, `premium_unlock_click`, `premium_unlock_complete`, `ai_analysis_view`가 함께 전송되는 것 확인 → 구현 문제보다 집계 지연/저표본 이슈로 판정

**#3 관찰 KPI 고정:**
- Ad slot 관찰 기준은 `/eq-test/`, `/portal/`, `/portal/mbti/`, `/portal/tests/`의 `sessions`, `totalUsers`, `hub_*`/`premium_*` 클릭 이벤트, 다음 클릭 이벤트로 고정
- 현재 기준선은 `/eq-test/` 17세션, `/portal/` 3세션, `/portal/mbti/` 3세션, `/portal/tests/` 1세션
- winner URL 4개(`digital-detox`, `habit-building`, `stress-management`, `blood-type`)는 2026-03-29~31 기간에 pagePath 기준 유입이 없어, 다음 클릭률 비교는 추가 트래픽 유입 후 재측정으로 보류

### 세션332 (3/29) - revenue rollout live deploy + analytics validation

**#1 라이브 배포 정리 완료:**
- `projects/portal` 수익화 커밋을 `origin/main` 최신 7커밋 위로 rebase 후 `83f00fd`로 push
- `projects/eq-test` detached HEAD에 있던 `b37bcb3` premium rollout 커밋을 `master`에 반영 후 push
- 루트 repo는 서브모듈 포인터를 최신 배포 SHA로 갱신하고 `master`에 push

**#2 운영 도메인 반영 확인:**
- `https://dopabrain.com/portal/tests/`에 `hub_view` 포함된 최신 tests hub HTML 반영 확인
- `https://dopabrain.com/portal/mbti/`에 `hub_view` / `next-tests` 포함된 최신 MBTI hub HTML 반영 확인
- `https://dopabrain.com/eq-test/`에 `premium_cta_view` / `btn-ai-unlock` 포함된 최신 premium HTML 반영 확인

**#3 라이브 analytics 검증:**
- 운영 도메인 Playwright 상호작용 기준 `hub_view`, `hub_cta_click`, `hub_faq_open`, `hub_test_card_click`, `content_cta_click`, `content_related_click` 커스텀 GA 요청 실제 발생 확인
- `eq-test`는 headless live page에서 `premium_cta_view`, `premium_unlock_click`, `premium_unlock_complete`가 `window.dataLayer`에 실제 push 되는 것 확인
- 단, GA4 Data API(2026-03-29 조회)에는 새 custom event가 아직 반영되지 않아 집계 지연 여부를 재확인 필요

### 세션331 (3/29) - analytics event smoke harness 검증 완료

**#1 로컬 이벤트 검증 하네스 구축:**
- `scripts/analytics-event-check.js` 추가
- `projects/` 정적 서버 + Playwright + `window.dataLayer`/`gtag` stub 조합으로 외부 GA4 전송 없이 이벤트 발생 여부만 검증
- Google tag / AdSense / 웹폰트 요청은 local smoke 용도로 차단 또는 빈 응답 처리

**#2 winner URL / hub 이벤트 스모크 PASS:**
- `/portal/`, `/portal/tests/`, `/portal/mbti/`, `/eq-test/`, winner blog 4개 페이지 총 **8개 시나리오 PASS**
- `hub_*`, `content_*`, `premium_*`, `eq_related_click` 이벤트가 의도한 사용자 상호작용에서 모두 발생하는 것 확인

**#3 하네스 안정화:**
- tests hub는 `emotion` 필터 적용 후 visible featured 카드만 클릭하도록 수정
- mbti hub는 matrix modal CTA 클릭 뒤 modal close → FAQ → next tests 순으로 재현해 실제 흐름과 동일하게 정리

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

1. **다음 유효 조회일까지 실행 유지** — 당일 수정분은 재조회하지 말고, 허브/앱/블로그 구조 개선을 더 쌓은 뒤 다음 집계 반영일에만 `팩1/팩2/팩3`으로 검증
2. **Hail Mary 신규 표면 관찰 준비** — 당장은 재조회하지 말고, 다음 유효 조회일에 `/hail-mary-mode/` 세션 발생 여부와 홈/테스트 허브 유입 비중만 먼저 판정
3. **Hail Mary 확장 연결** — 다음 배치에서는 `EQ`, `Stress Response`, `Burnout`, `Brain Type` 등 기존 강한 앱에서 `hail-mary-mode`로 들어오는 교차 진입점을 더 만들기
4. **미발생 winner blog 2차 확장 준비** — `habit-building`, `stress-management`는 허브/관련링크 1차 연결 이후 실제 locale 확장 후보와 추가 진입 허브를 좁히기
5. **허브 역할 분리 고정** — `/portal/`은 진입 허브, `/portal/tests/`는 분배 허브, `/portal/mbti/`는 체류형 허브라는 역할을 유지한 채 새 Hail Mary 카드도 같은 규칙 안에서 운영
### Session 348 (2026-04-07) - GSC Coverage Remediation

- Parsed the 485 `Crawled - currently not indexed` blog URLs from the GSC export CSV.
- Restored 3 zero-byte localized articles: `blog/de/somatic-anxiety-body-symptoms.html`, `blog/fr/somatic-anxiety-body-symptoms.html`, and `blog/tr/somatic-anxiety-body-symptoms.html`.
- Rebuilt the language blog hub coverage sections to add direct links for affected URLs that were missing from locale indexes.
- Added every locale blog hub URL to `projects/portal/sitemap.xml` and refreshed the hub `lastmod` values to `2026-04-07`.
- Follow-up after deploy: resubmit the portal sitemap and recheck GSC validation after recrawl.
### Session 349 (2026-04-07) - Post-Deploy GSC Check

- Verified the restored locale articles are live on `dopabrain.com` after the `portal` push.
- GSC sample inspections still show `Crawled - currently not indexed`, but the last crawl timestamps are pre-fix (`2026-04-03`, `2026-04-05`, `2026-04-06`), so Google has not re-crawled the remediated pages yet.
- `list_sitemaps` confirms `https://dopabrain.com/portal/sitemap.xml`, `https://dopabrain.com/portal/blog/sitemap.xml`, and `https://dopabrain.com/sitemap.xml` are already submitted on `2026-04-07`.
- `submit_sitemap` via API is blocked for the current credential with `403 Insufficient Permission`, so any re-submit must be done manually in the Search Console UI if needed.
- Next practical step: wait for recrawl, then re-check the restored pages plus a few locale hub pages in 24-72 hours.
### Session 350 (2026-04-07) - Attachment Style Funnel Upgrade

- Queried GA4 and GSC for `2026-03-31` to `2026-04-07` and selected `/attachment-style/` as the highest-priority winner fix based on meaningful sessions with weak engagement.
- Upgraded the result funnel with richer analytics events: `quiz_start`, `quiz_answer_selected`, `result_view`, `attachment_related_click`, `attachment_share_click`, `attachment_retake_click`, and `attachment_about_toggle`, while keeping `quiz_complete`.
- Reordered related-test cards by attachment result type and highlighted the top 3 recommendations so the post-result next click is more intentional.
- Fixed the default document language mismatch by syncing `document.documentElement.lang` during i18n UI refreshes.
- Filled the missing locale keys across all 12 translation files for `button.save_result`, `related.shadowWork`, and `related.traumaResponse`, then verified that every `data-i18n` key used in `index.html` resolves successfully.
- Local verification: `node --check js/app.js` passed, locale key coverage check passed, and `git diff --check` passed with no whitespace errors.
### Session 351 (2026-04-11) - Lang Canonical Cleanup for 6 Excluded URLs

- Investigated the GSC `Alternate page with proper canonical tag` exclusions shown for 6 query-language URLs: `/portal/?lang=en`, `/portal/tools/?lang=de`, `/portal/tools/?lang=es`, `/npc-test/?lang=pt`, `/npc-test/?lang=es`, and `/delulu-score/?lang=en`.
- Fixed `portal` shared i18n to read `?lang=` on load and to sync canonical/OG URL/history state when the selected language has an explicit hreflang URL.
- Added early head SEO sync on `portal`, `portal/tools`, `npc-test`, and `delulu-score` so language-param URLs self-canonicalize to their own hreflang URL instead of always pointing to the base page.
- Updated `npc-test` and `delulu-score` i18n flows so language changes keep the URL, canonical, and rendered language aligned.
- Verification: `node --check` passed for all edited i18n files; `git diff --check` passed in all 3 repos; `quality-gate` and `live-check` both passed for `npc-test` and `delulu-score`; `portal` pre-push quality gate passed automatically on push.
- Follow-up: wait for recrawl, then recheck the 6 screenshot URLs in GSC to confirm they move from excluded alternates to self-canonicalized locale variants.

### Session 352 (2026-04-11) - Weekly Review + NPC Test Funnel Upgrade

- Queried GA4 and GSC for `2026-04-04` to `2026-04-10` versus `2026-03-28` to `2026-04-03` to identify the next highest-value implementation target after the recent canonical and coverage cleanup.
- Weekly review summary: `/attachment-style/` improved from `2` to `16` sessions after the prior funnel work, `/portal/mbti/` remained stable with healthy engagement, and AdSense summary access is still blocked by `invalid_grant`.
- Selected `/npc-test/` as the immediate fix because GA4 showed `12` recent landing sessions with `0` engaged sessions, `bounceRate=1`, and only about `2.1s` average session duration, which made the result funnel the clearest friction point.
- Added a role-preview strip on the intro screen, result-specific related-test ranking, featured recommendation styling, canonical-aware share URLs, and richer analytics events: `npc_choice_select`, `npc_continue_click`, `result_view`, `npc_share_open`, `npc_share_click`, `npc_retry_click`, and `npc_related_click`, while retaining `quiz_start` and `quiz_complete`.
- Verification before deploy: `node --check js/app.js`, `git diff --check`, `quality-gate`, and `live-check` all passed, and a local browser run confirmed the result screen, reordered related cards, and new `dataLayer` events.
- Deployment: pushed `npc-test` `master` and `gh-pages`, then discovered the live Pages branch was still serving older locale JSON packs that left dialogue scenes unrendered.
- Remediation: synced all 12 `js/locales/*.json` files plus `og-image.svg` from `master` into `gh-pages` so the live site and the source branch now ship the same quiz content.
- Live verification after propagation: `https://dopabrain.com/npc-test/?lang=en` now renders the new role preview, plays through the 10-scene flow, shows the result-specific related-card order, and pushes `quiz_start`, `npc_choice_select`, `npc_continue_click`, `result_view`, `quiz_complete`, `npc_share_open`, and `npc_related_click` into `dataLayer`.
- Follow-up: check GA4 event reports after collection delay to confirm `result_view` and `npc_related_click` begin appearing outside of browser-side smoke tests.

### Session 353 (2026-04-11) - AdSense OAuth Recovery + Weekly Monetization Check

- Recovered the project-local AdSense MCP OAuth after `invalid_grant` blocked the weekly review by re-running the `adsense-mcp` consent flow and refreshing the stored token in `%USERPROFILE%/.config/adsense-mcp/`.
- `doctor` now passes again for `accounts/pub-3600813755953882`, confirming accounts, sites, policy issues, and ad clients all load with the refreshed credential.
- Current monetization snapshot on `2026-04-11`: `today $0.00`, `yesterday $0.04`, `last_7_days $0.18`, `this_month $0.23`, `last_30_days $1.41`, unpaid balance `$1.22`.
- Account/site status: `dopabrain.com` remains `READY` and `autoAdsEnabled=true`.
- Alerts/policy: one existing `WARNING` alert `ua-conflict-policy-update` is still present, and there are no active policy issues returned by the API.
- Note: the in-process Codex AdSense MCP tool session continued to hold the stale token after recovery, so the successful monetization read for this session was verified via the local `adsense-mcp` client directly.

### Session 354 (2026-04-11) - Attachment Style Result Funnel + Monetization Upgrade

- Used the weekly review findings to pick `/attachment-style/` as the next winner-page improvement target after `npc-test`, focusing on weak engagement despite recent session growth.
- Added a result-screen quick-action module that surfaces the top recommended next test as a primary CTA, plus a secondary jump CTA that scrolls users directly into the related-test grid.
- Added a new inline AdSense slot on the result screen so the page now has an actual monetization surface after the user finishes the quiz instead of only loading the AdSense script.
- Upgraded analytics on the result screen with `attachment_primary_cta_click` and `attachment_related_jump_click`, and made share URLs language-aware by using the current hreflang/canonical URL instead of always sharing the base path.
- While verifying the improvement, discovered and fixed a blocking progression bug where the app stopped after the first reply because `isAnimating` never reset before rendering the next scenario.
- Verification: `node --check`, `git diff --check`, `quality-gate`, and `live-check` all passed, and a local browser smoke run confirmed the 10-chat flow reaches results, the quick-action CTA updates to the top ranked related test, the inline ad slot renders, and the new result-screen events appear in `dataLayer`.

### Session 355 (2026-04-11) - Portal MBTI Funnel Upgrade Toward EQ + Relationship Winners

- Selected `/portal/mbti/` as the next hub-level implementation target after the weekly review because it already attracts engaged users but still under-serves the strongest relationship and monetization follow-ups.
- Reworked the page flow from `matrix -> static info -> generic CTA` into `matrix -> relationship starter pack -> strongest pairs -> prioritized CTA stack -> follow-up pills`.
- Added a new four-card starter pack that pushes users toward `eq-test`, `attachment-style`, `mbti-love`, and `blood-type`, with `eq-test` intentionally placed as the recommended first click.
- Rewrote the bottom CTA section to favor relationship funnel actions over generic browsing, while also reordering the follow-up pills so the test path appears before the blog path.
- Expanded hub tracking so the new surfaces are measurable: starter cards now emit `hub_featured_click` with `card_type=relationship_starter`, CTA buttons emit `hub_cta_click` with named surfaces like `eq_primary`, and the existing follow-up pill tracking continues through `hub_test_card_click`.
- Verification: `git diff --check` and `live-check` passed, a local browser smoke run confirmed the starter pack renders, the modal still works, and the new `hub_featured_click`, `hub_cta_click`, and `hub_test_card_click` events all appear in `dataLayer`.

### Session 356 (2026-04-11) - Portal Tools Funnel Upgrade Toward Focus + Test Cross-Sell

- Reviewed the same `2026-04-04` to `2026-04-10` GA4/GSC weekly window and selected `/portal/tools/` as the next hub optimization target because it had fresh landing sessions but almost no meaningful engagement or next-click depth.
- Repositioned the hub from a generic utilities list into a clearer focus/wellness funnel by replacing the featured cards with `habit-tracker`, `pomodoro-timer`, and `detox-timer`, then adding a three-step routine band that guides users through reset -> streak -> focus.
- Added a real inline AdSense surface after the main tools grid so the hub now has a monetization point once users have already scanned the catalog.
- Upgraded the bottom CTA section from a single generic tests link into a tracked stack that keeps the tests hub as the main action while also surfacing direct next clicks to `eq-test`, `attachment-style`, and `blood-type`.
- Added hub analytics coverage for the new surfaces: `hub_view`, `hub_filter_select`, `hub_featured_click`, `hub_tool_card_click`, `hub_cta_click`, `hub_faq_open`, and `hub_ad_impression`.
- Verification: `git diff --check` and `live-check` passed, and a local Playwright smoke run on `http://127.0.0.1:8771/portal/tools/?lang=en` confirmed the new featured/routine layouts plus the expected `dataLayer` events for filters, featured clicks, tool clicks, CTA clicks, FAQ opens, and the inline ad initialization.

### Session 357 (2026-04-13) - Portal Home Hero Funnel Upgrade

- Queried GA4, GSC, and AdSense again on `2026-04-13` using `2026-04-06` to `2026-04-12` versus `2026-03-30` to `2026-04-05` to pick the next implementation target after the tools hub rollout.
- Review snapshot: `/portal/` remained the weakest major hub with `7 sessions`, `engagementRate 0`, and `bounceRate 1`, while `/portal/mbti/` stayed healthy at `17 sessions` with strong engagement and AdSense improved to `today $0.08`, `yesterday $0.07`, `last_7_days $0.21`, `this_month $0.39`.
- Selected `/portal/` home as the next fix and added a new hero-level winner strip that pushes the first click toward `eq-test`, `attachment-style`, and `blood-type`, while also extending the existing hero pills with a direct `portal/mbti` path.
- Added named CTA surfaces across the hero pills and category hubs (`hero_eq_pill`, `hero_eq_primary`, `hero_attachment_primary`, `hero_blood_primary`, `tests_hub`, `mbti_hub`, `tools_hub`, `games_hub`) so the top-of-page routing is now measurable at a finer level.
- Added explicit `hub_ad_impression` tracking for the top and bottom homepage AdSense banners, and localized the new winner cards on load plus after language changes by syncing them through `APP_DATA`, `getAppName`, `getAppDesc`, and `getCategoryName`.
- Validation: `node --check js/app.js`, `git diff --check`, and `live-check` passed after removing two pre-existing false positives in `js/achievements.js` and `js/daily-streak.js`, and a local Playwright smoke run confirmed the new hero cards render and emit `hub_cta_click` events for `hero_eq_pill`, `hero_eq_primary`, `hero_attachment_primary`, and `tools_hub`.

### Session 358 (2026-04-13) - GSC Redirect Source Cleanup

- Investigated the `Page with redirect` GSC validation failure shown for `19` affected URLs and traced the pattern to discoverable redirect stubs under `portal/blog` that were still referenced by sitemap entries, hreflang blocks, and related-resource links.
- Kept the legacy redirect stub files in place for external/backlink safety, but stopped advertising them internally by rewriting `href/src/loc` references to the final destination URLs instead of the redirect stubs.
- Updated `projects/portal/sitemap.xml`, `projects/portal/blog/sitemap.xml`, the affected locale blog index pages, and related-article blocks across `de/es/fr/hi/ja/ko/pt/ru/zh` blog content so redirecting URLs are no longer surfaced as crawl targets.
- Representative fixes included replacing redirecting references like `en/2048-puzzle-strategy-guide` -> `en/number-puzzle-2048-tips`, `en/best-brain-training-games-2026` -> `en/best-free-brain-training-games-2026`, `fr/aura-reading-personality-quiz` -> `en/aura-reading-personality-quiz`, and several locale redirect stubs that previously bounced to English articles or locale hub indexes.
- Validation: a repository-wide post-fix scan across all non-stub `html/xml` files found `0` remaining `href/src/loc` references to non-self redirect stubs, confirming the issue is no longer being reintroduced from internal discovery paths before deploy.

### Session 359 (2026-04-13) - GSC 404 CSV Cleanup for Blog Locale Gaps + Root Aliases

- Audited the new GSC `404` CSV export with `228` reported URLs, then rechecked them against live responses and reduced the active problem set to `22` real live-404 URLs instead of treating the whole CSV as current breakage.
- Added redirect stubs for `18` missing locale blog URLs across `de/es/fr`, pointing each dead path at the live canonical article or closest locale-equivalent page, plus a defensive redirect for the accidental `/portal/blog/{lang}/` placeholder path that leaked from one broken article.
- Removed the last known internal discovery sources for these dead URLs by rewriting the Spanish related-resource links, Japanese Pomodoro environment-sound links, and Spanish/Japanese word-game CTAs to canonical live targets instead of the retired paths.
- Repaired `projects/portal/blog/pt/stress-response-guide.html`, which still contained literal template placeholders like `{lang}` and `{lang_data[...]}` in the live article, so the Portuguese page now exposes real copy and a valid blog breadcrumb instead of generating a fake crawl target.
- Added root-domain alias coverage for `/projects/focus-music/` -> `/white-noise/`, `/word-chain` -> `/word-guess/`, and generated a real `/favicon.ico` so crawler hits to the root icon path and historical alias URLs no longer return `404`.
- Validation: post-fix repository scans found `0` remaining internal references to `/portal/blog/es/healthy-boundaries-guide.html`, `/portal/blog/es/somatic-symptoms-anxiety-body-connection.html`, `/projects/focus-music/`, `https://dopabrain.com/word-chain`, and the live `{lang}` placeholder URL; `git diff --check` was reserved for the final rollout step before deploy.

### Session 360 (2026-04-13) - GSC Crawled-Not-Indexed Discoverability Remediation

- Audited the `Crawled - currently not indexed` CSV export with `470` reported URLs and verified the whole set was already live `200`, which shifted the remediation focus away from broken pages and toward discovery/refresh signals.
- Found that `468` of the affected URLs were `/portal/blog/` pages and all were already present in `projects/portal/sitemap.xml`, but the separate blog sitemap was badly stale and only surfaced a small subset of the blog corpus.
- Rebuilt [blog/sitemap.xml](E:/Fire%20Project/projects/portal/blog/sitemap.xml) from the authoritative portal sitemap so it now includes the full current blog inventory, covering all `468` affected blog URLs from the CSV instead of leaving them absent from the dedicated blog sitemap.
- Strengthened crawler discovery at the host level by adding `https://dopabrain.com/portal/sitemap.xml` and `https://dopabrain.com/portal/blog/sitemap.xml` to the root [robots.txt](E:/Fire%20Project/projects/root-domain/robots.txt), and also advertised the blog sitemap directly from [projects/portal/robots.txt](E:/Fire%20Project/projects/portal/robots.txt) for consistency.
- Rechecked representative affected pages and confirmed the underlying documents already had canonical, hreflang, `robots`, title, and H1 structure, so this rollout intentionally targeted the missing sitemap/robots layer rather than rewriting hundreds of already-live articles.
- Validation: the regenerated blog sitemap now covers all `468` blog URLs from the CSV, while the two non-blog URLs in the report (`/portal/mbti/entp.html` and `/valentine/`) were already live, present in sitemap coverage, and internally linked before this rollout.

### Session 361 (2026-04-13) - Rizz Score Result Funnel Upgrade

- Ran a fresh GA4/GSC/AdSense weekly review for `2026-04-06..2026-04-12` versus `2026-03-30..2026-04-05` and selected `/rizz-score/` as the next implementation target after finding `11 sessions`, `0 engaged sessions`, `engagementRate 0`, and roughly `3.2s` average session duration despite relationship-funnel potential.
- Reworked the result screen from a static score/share endpoint into a real next-step funnel by adding a quick-action recommendation card, a jump CTA into related tests, and a result-inline AdSense slot that only initializes after the quiz completes.
- Replaced the old low-value related-card set with higher-value winner paths to `EQ Test`, `Attachment Style`, `MBTI Love`, and `Blood Type`, then ranked those cards dynamically by appeal style so witty, deep, and funny results each surface a different first click.
- Added stronger measurement across the full quiz and result flow: `quiz_start`, `rizz_choice_select`, `result_view`, `quiz_complete`, `rizz_related_jump_click`, `rizz_primary_cta_click`, `rizz_related_click`, `rizz_share_click`, and `rizz_retry_click`.
- Made result sharing language-aware by building share URLs from the current `?lang=` state instead of always sending users back to the base English path.
- Added new locale coverage for the result CTA and follow-up copy across all `12` languages so the upgraded funnel stays localized on non-English landings.
- Validation: `node --check js/app.js`, locale key coverage checks, `quality-gate`, `live-check`, `node scripts/runtime-check.js rizz-score`, and a custom Playwright journey all passed; the browser run confirmed the result CTA ranked `eq-test` first for the witty path, initialized the inline ad slot, and emitted the new `rizz_*` events end-to-end before deploy.
- Deployment: pushed `rizz-score` commit `ca91c3e` to `origin/master`, then rechecked `https://dopabrain.com/rizz-score/?lang=en` after propagation to confirm the live site serves the new quick-action card, keeps `eq-test` as the first related follow-up for the witty path, initializes the inline ad slot, and emits the upgraded `rizz_*` events during a full browser journey.

### Session 362 (2026-04-13) - Brainrot Score Recovery Funnel Upgrade

- Queried GA4 and GSC again for `2026-04-06..2026-04-12` and selected `/brainrot-score/` as the next implementation target after seeing `12 sessions`, `0 engaged sessions`, `engagementRate 0`, `bounceRate 1`, and about `32.8s` average session duration, which pointed to a weak result-screen follow-up rather than a top-of-funnel discoverability issue.
- Reworked the result screen from a joke-only endpoint into a recovery funnel by adding a quick-action card, a follow-up jump CTA, and an inline AdSense slot that initializes only after the score is revealed.
- Replaced the old meme-adjacent related cards with higher-intent recovery paths to `Habit Tracker`, `Stress Check`, `Detox Timer`, and `EQ Test`, then ranked them dynamically by tier so higher-brainrot outcomes push `Detox Timer` first while healthier outcomes lead with `Habit Tracker`.
- Added richer analytics across the full scroll loop and result funnel: `quiz_start`, `feed_start`, `brainrot_reaction_select`, `brainrot_warning_choice`, `result_view`, `quiz_complete`, `feed_complete`, `brainrot_related_jump_click`, `brainrot_primary_cta_click`, `brainrot_related_click`, `brainrot_share_click`, and `brainrot_retry_click`.
- Fixed a pre-existing dynamic i18n bug where runtime-generated copy was reading `window.i18n` instead of the actual global `i18n`, which had been forcing dynamic content like feed posts and next-step copy to fall back incorrectly; also updated language handling to respect `?lang=` URLs and keep share links language-aware.
- Added localized next-step recovery copy across all `12` locale JSON files so the new CTA layer stays translated on non-English landings.
- Validation: `node --check js/app.js`, locale key coverage checks, `quality-gate`, `live-check`, `node scripts/runtime-check.js brainrot-score`, and custom local Playwright journeys all passed. The local browser run confirmed the `touchgrass` path surfaces `Emergency Reset: Detox Timer`, initializes the inline ad slot, and emits the full `brainrot_*` event set plus share/retry actions before deploy.
- Deployment: pushed `brainrot-score` commit `98e1801` to `origin/master`, then rechecked `https://dopabrain.com/brainrot-score/?lang=en` after propagation. A live Playwright run confirmed `Detox Timer` ranks first for the high-brainrot path, the quick-action title renders as `Emergency Reset: Detox Timer`, the inline ad slot initializes, and the upgraded `brainrot_*` events fire through CTA, related, share, and retry actions.

### Session 363 (2026-04-14) - Villain Type Result Funnel Upgrade

- Queried the latest GA4 and AdSense weekly snapshot on `2026-04-14` and selected `/villain-type/` as the next implementation target after seeing `15 sessions`, `0 engaged sessions`, `engagementRate 0`, `bounceRate 1`, and about `21s` average session duration, while AdSense improved to `today $0.04`, `yesterday $0.08`, and `last_7_days $0.28`.
- Reworked the result screen from a static share endpoint into a follow-up funnel by adding a quick-action recommendation card, a jump CTA into the related section, and a result-inline AdSense slot that only initializes after the quiz finishes.
- Replaced the old dark-cluster related cards (`dark-core`, `toxic-trait`, `villain-origin`, `npc-test`) with higher-value follow-ups to `EQ Test`, `Attachment Style`, `MBTI Love`, and `Blood Type`, then ranked those cards dynamically by archetype so different villain outcomes surface different first clicks.
- Added stronger analytics across the quiz and result flow: `quiz_start`, `villain_option_select`, `result_view`, `quiz_complete`, `villain_share_open`, `villain_share_click`, `villain_primary_cta_click`, `villain_related_jump_click`, `villain_related_click`, and `villain_retry_click`.
- Updated result sharing to use the current `?lang=` URL instead of always sharing the base path, and added the new result CTA labels plus related-card names across all `12` locale JSON files so the funnel stays localized on non-English landings.
- Validation: `node --check js/app.js`, locale key coverage checks, `git diff --check`, `quality-gate`, `live-check`, and `node scripts/runtime-check.js villain-type` all passed. Live Playwright verification on `https://dopabrain.com/villain-type/?lang=en&v=363b` confirmed the `trickster` path ranks `MBTI Love` first, the inline ad node is present, and the upgraded events land in `dataLayer`, including `villain_share_open`, `villain_share_click`, and `villain_primary_cta_click`.
- Deployment: pushed `villain-type` commit `8e72fe3` to `origin/master` and rechecked the live site after propagation to confirm the new result funnel is serving from `dopabrain.com`.

### Session 364 (2026-04-14) - NPC Test Result Funnel Upgrade

- Rechecked the weekly review after the `villain-type` rollout and kept `/npc-test/` as the highest-priority follow-up target because `2026-04-07..2026-04-13` GA4 still showed `12 sessions`, `0 engaged sessions`, `engagementRate 0`, `bounceRate 1`, and only about `2.54s` average session duration, which pointed to a result-screen conversion problem rather than a discoverability issue.
- Reworked the result screen from a percentile/share endpoint into a real next-step funnel by adding a quick-action recommendation card, a jump CTA into the related section, and a result-inline AdSense slot that only initializes once the RPG role is revealed.
- Replaced the weaker meme cluster (`brainrot-score`, `delulu-score`) with higher-value follow-ups to `EQ Test` and `Attachment Style`, while keeping `Rizz Score` and `Villain Type`, then ranked those cards dynamically by result tier so `Full NPC` now leads with `Attachment Style`, while stronger routes shift toward `EQ Test`, `Rizz Score`, or `Villain Type`.
- Expanded analytics coverage across the result funnel with `npc_primary_cta_click` and `npc_related_jump_click`, and tightened the existing share flow so copied URLs always preserve the current `?lang=` variant instead of depending on the current canonical tag state.
- Added localized result-funnel labels across all `12` locales for the quick-action label, description, CTA text, jump button, and the new `EQ Test` / `Attachment Style` related-card names so the upgraded funnel stays translated on non-English landings.
- Validation: `node --check js/app.js`, locale key coverage checks, `git diff --check`, `quality-gate`, `live-check`, and `node scripts/runtime-check.js npc-test` all passed. Live Playwright verification on `https://dopabrain.com/npc-test/?lang=en&v=364e` confirmed the `npc` path ranks `Attachment Style` first, the inline ad node is present, and `npc_related_jump_click`, `npc_share_open`, `npc_share_click`, and `npc_primary_cta_click` all land in `dataLayer`.
- Deployment: pushed `npc-test` commit `4737bee` to `origin/master`, then mirrored the same rollout to the actual live branch with `gh-pages` commit `062796a` after verifying the site was still serving the older branch. Rechecked the live site after propagation to confirm the new result funnel is now serving from `dopabrain.com`.

### Session 365 (2026-04-14) - Portal Tools Quick-Start Funnel Tightening

- Rechecked the weekly hub review after the `npc-test` rollout and kept `/portal/tools` as the next hub-level target because `2026-04-07..2026-04-13` GA4 still showed `11 sessions`, `0 engaged sessions`, `engagementRate 0`, `bounceRate 1`, and `0` average session duration on the landing page path `/portal/tools`.
- Confirmed the earlier tools-hub rollout was already live, so the remaining issue was not missing deployment but weak above-the-fold decision support: users landed on a dense catalog without a strong first click before the featured grid.
- Added a new hero `quick-start` panel above the filters with three immediate intent paths to `Pomodoro Timer`, `Detox Timer`, and `Habit Tracker`, each framed around the next few minutes (`25 min sprint`, `2 min reset`, `1 minute setup`) so the hub now gives users a clear first action before they hit the broader catalog.
- Kept the existing featured cards, routine band, inline AdSense slot, and test cross-sell stack in place, but extended the localized hub copy across all `12` locale JSON files with the new quick-start headline and timing labels so the top-of-page funnel stays language-aware.
- Extended measurement on the existing `hub_cta_click` surface map by adding explicit hero surfaces `hero_focus_sprint`, `hero_reset_scroll`, and `hero_build_streak`, and also exposed `quick_start_count` in the `hub_view` payload so the new entry layer can be tracked separately from featured cards and tool-grid clicks.
- Validation: locale JSON parse checks, `git diff --check`, `quality-gate`, and `live-check` all passed. A local Playwright run on `http://127.0.0.1:8137/portal/tools/?lang=en` confirmed the new quick-start panel renders with `3` cards and that clicking the focus card emits `hub_cta_click` with `cta_type: hero_focus_sprint` before navigation.
- Deployment: pushed `portal` commit `ccf59bb` to `origin/main`, then rechecked `https://dopabrain.com/portal/tools/?lang=en&v=365e` after propagation. Live verification confirmed the quick-start panel is serving from `dopabrain.com`, the three hero cards render with the expected tool names, the inline ad node remains present, and clicking the focus card emits `hub_cta_click` with `cta_type: hero_focus_sprint` and destination `https://dopabrain.com/pomodoro-timer/`.

### Session 366 (2026-04-15) - Delulu Score Result Funnel Upgrade

- Ran a fresh weekly review on `2026-04-15` using GA4 landing-page data for `2026-04-08..2026-04-14`, then selected `/delulu-score/` as the next app target after seeing `11 sessions`, `1 engaged session`, `engagementRate 0.09`, `bounceRate 0.91`, and about `3.33s` average session duration, while AdSense held at `yesterday $0.04`, `last_7_days $0.27`, and `this_month $0.43`.
- Confirmed the current app still ended the journey at a static result/share screen, so the remediation focused on turning the result into a follow-up funnel rather than changing the quiz itself.
- Added a quick-action recommendation card, a jump CTA into the related grid, and a result-inline AdSense slot to [projects/delulu-score/index.html](E:/Fire%20Project/projects/delulu-score/index.html), then replaced the empty post-result area with higher-value follow-ups to `Attachment Style`, `EQ Test`, `Rizz Score`, and `MBTI Love`.
- Reworked [projects/delulu-score/js/app.js](E:/Fire%20Project/projects/delulu-score/js/app.js) so related-card order now changes by delulu tier: grounded scores lean toward `Attachment Style`, mid scores surface `Rizz Score`, and high `movie` scores push `MBTI Love` first, while the primary CTA mirrors the top-ranked follow-up and share URLs always preserve the current `?lang=` state.
- Expanded analytics coverage with `delulu_option_select`, `result_view`, `quiz_complete`, `delulu_primary_cta_click`, `delulu_related_jump_click`, `delulu_related_click`, `delulu_share_click`, and `delulu_retry_click`, and added the required result-funnel labels plus related-card names across all `12` locale JSON files so the upgrade stays localized on non-English landings.
- Validation: `node --check js/app.js`, locale key coverage checks, `git diff --check`, `quality-gate`, `live-check`, and `node scripts/runtime-check.js delulu-score` all passed. A local Playwright run on `http://127.0.0.1:8138/delulu-score/?lang=en` confirmed the `movie` path ranks `MBTI Love` first, shows the inline ad slot, and emits the new `delulu_*` CTA/share/retry events before deploy.
- Deployment: pushed `delulu-score` commit `cba04f4` to `origin/gh-pages`, then rechecked `https://dopabrain.com/delulu-score/?lang=en&v=366b` after propagation. Live verification confirmed the new quick-action card is serving from `dopabrain.com`, `MBTI Love -> Rizz Score -> EQ Test -> Attachment Style` is the visible order for the high-delulu path, the inline ad node remains present, and `delulu_related_jump_click`, `delulu_primary_cta_click`, `delulu_related_click`, `delulu_share_click`, and `delulu_retry_click` all land in `dataLayer`.

### Session 367 (2026-04-16) - HSP Test Result Funnel + Lang-Aware SEO Sync

- Ran a fresh weekly review on `2026-04-16` using GA4 landing-page data for `2026-04-09..2026-04-15` plus the current AdSense snapshot, then selected `/hsp-test/` as the next implementation target after seeing `7 sessions`, `1 engaged session`, `engagementRate 0.14`, `bounceRate 0.86`, and only about `3.6s` average session duration, while AdSense held at `today $0.13`, `last_7_days $0.25`, and `this_month $0.57`.
- Confirmed the app already had a strong result breakdown but still ended the journey at a static chart/share screen, so the remediation focused on post-result conversion rather than changing the quiz itself.
- Added a quick-action recommendation card, a jump CTA into the related grid, and a result-inline AdSense slot to [projects/hsp-test/index.html](E:/Fire%20Project/projects/hsp-test/index.html), then tagged all follow-up cards with stable `data-related-key` values so the result layer can rank and measure them consistently.
- Reworked [projects/hsp-test/js/app.js](E:/Fire%20Project/projects/hsp-test/js/app.js) so related-card order now changes by HSP result type: resilient outcomes lean toward `EQ Test` / `Social Battery`, while higher-sensitivity outcomes push `Burnout Test`, `Stress Response`, `Anxiety Type`, `Shadow Work`, and `Inner Child` first; the primary CTA now mirrors the highest-ranked card, share URLs preserve the current `?lang=` state, and the new funnel emits `quiz_start`, `test_start`, `hsp_handle_click`, `hsp_limit_click`, `result_view`, `quiz_complete`, `hsp_related_jump_click`, `hsp_primary_cta_click`, `hsp_related_click`, `hsp_share_click`, `hsp_save_click`, `hsp_retry_click`, and `hsp_result_ad_impression`.
- Rebuilt [projects/hsp-test/js/i18n.js](E:/Fire%20Project/projects/hsp-test/js/i18n.js) to detect `?lang=` first, sync canonical/`og:url`/history from hreflang alternates, and update metadata from localized `meta.*` values; also added the new result-funnel labels and related-card names across all `12` locale JSON files in [projects/hsp-test/js/locales](E:/Fire%20Project/projects/hsp-test/js/locales).
- Validation: `node --check js/app.js`, `node --check js/i18n.js`, locale key coverage checks, `git diff --check`, `quality-gate`, `live-check`, and `node scripts/runtime-check.js hsp-test` all passed. Live Playwright verification on `https://dopabrain.com/hsp-test/?lang=en&v=367a` confirmed the page now self-canonicals to `?lang=en`, serves the quick-action card and result-inline ad container, ranks `Burnout Test` first for the high-sensitivity `Ultra Antenna` path, marks `burnout-test` and `stress-response` as featured, and emits `quiz_start`, `hsp_limit_click`, `result_view`, `quiz_complete`, `hsp_related_jump_click`, and `hsp_primary_cta_click` in `dataLayer`.
- Deployment: pushed `hsp-test` commit `28b91f4` to `origin/main`, then rechecked the live site after propagation to confirm the new result funnel and language-aware SEO state are serving from `dopabrain.com`.

### Session 368 (2026-04-16) - Root Homepage First-Click Funnel Upgrade

- Ran another weekly review on `2026-04-16` using GA4 landing-page data for `2026-04-09..2026-04-15` plus the current AdSense snapshot, then selected the root homepage `/` as the next highest-ROI target after seeing `23 sessions`, `5 engaged sessions`, `engagementRate 0.22`, `bounceRate 0.78`, and only about `23.5s` average session duration, down sharply from the prior week even though it remained the highest-traffic landing page.
- Confirmed the homepage already exposed many links but still forced users through a generic portal path, so the remediation focused on making the first click more decisive instead of adding more catalog depth.
- Reworked [projects/root-domain/index.html](E:/Fire%20Project/projects/root-domain/index.html) to add a new hero action row plus a `start-here` winner strip that sends users directly to `/portal/mbti/`, `/brain-type/`, and `/eq-test/`, while keeping the existing top picks and full-content hub underneath.
- Added root-home specific analytics surfaces so we can tell which first-click entry point is actually working: `root_view`, `root_cta_click`, `root_pick_click`, `root_app_click`, and `root_directory_click`, with explicit surfaces like `hero_primary_mbti`, `hero_start_mbti`, `hero_start_brain_type`, `hero_start_eq_test`, `quick_cat_mbti`, and `popular_grid`.
- Reworked the inline homepage render script so dynamic popular-grid cards now carry tracking metadata and slot positions, while preserving the existing `Personalize.trackClick` behavior for app cards.
- Added the new hero and start-strip labels to all `12` locale JSON files in [projects/root-domain/js/locales](E:/Fire%20Project/projects/root-domain/js/locales) so the homepage CTA layer stays localized instead of falling back to only static English strings.
- Validation: `git diff --check`, locale key coverage checks, `quality-gate`, and `live-check` all passed. A local Playwright journey on `http://127.0.0.1:8139/root-domain/` confirmed the new homepage serves `3` start cards and `12` tracked popular cards, and emits `root_view`, `root_cta_click`, and `root_app_click` across the hero CTA, start strip, and popular grid.
- Deployment: pushed `root-domain` commit `98d529a` to `origin/main`, then rechecked `https://dopabrain.com/?v=368a` after propagation. Live verification confirmed the new `start-here` strip is serving from `dopabrain.com`, the hero primary CTA now points to `/portal/mbti/`, and `root_view`, `root_cta_click`, and `root_app_click` all land in `dataLayer` on the live homepage.

### Session 369 (2026-04-17) - Root Homepage Locale Hotfix

- Paused the next implementation cycle after a live screenshot showed the new homepage CTA and `start-here` strings rendering as `????` on the Korean homepage, even though the rest of the page was still healthy.
- Traced the issue to the locale injection from Session 368: the newly added `cta.primary`, `cta.secondary`, and `startHere.*` keys in [projects/root-domain/js/locales](E:/Fire%20Project/projects/root-domain/js/locales) had been written with encoding damage, which only affected the new hero/start-strip copy for non-ASCII locales.
- Rewrote those homepage-specific keys across all `12` locale JSON files using a safe Unicode-preserving update path, restoring readable copy for Korean, Japanese, Chinese, Russian, Turkish, and the Latin-script locales without changing the rest of the homepage funnel.
- Validation: locale JSON parse checks and `git diff --check` both passed after the hotfix; then the live homepage was rechecked after deploy to confirm the Korean hero CTA and `start-here` module now render with readable text again instead of placeholder question marks.
- Deployment: pushed `root-domain` commit `5e17fb0` to `origin/main`, then rechecked `https://dopabrain.com/?lang=ko&v=369a` after propagation to confirm the localized hero CTA, secondary CTA, and all three `start-here` cards were serving correctly from `dopabrain.com`.

### Session 370 (2026-04-17) - Locale Incident Rule + Markdown Hygiene Optimization

- Reviewed the active Markdown inventory outside dependency/vendor directories and confirmed there were no leftover temporary planning docs to delete; the main long-lived docs remain `README.md`, `PROGRESS.md`, `memory/data-check-log.md`, and the canonical guides in `docs/`.
- Identified the real maintenance risk as process drift rather than file count: locale-edit safety had not been written down in the canonical i18n guide, and document retention rules were implicit instead of explicit.
- Updated [docs/I18N.md](E:/Fire%20Project/docs/I18N.md) with a new critical section that bans unsafe non-ASCII one-liner locale rewrites on Windows/PowerShell, requires UTF-8-safe bulk edit paths, and standardizes post-edit verification on both locale JSON endpoints and live rendered pages.
- Updated [docs/OPERATIONS.md](E:/Fire%20Project/docs/OPERATIONS.md) with Markdown hygiene rules so `README.md` stays onboarding-only, `PROGRESS.md` archives once it grows past `25` session headings or `100KB`, `memory/data-check-log.md` stays a one-line ledger, and temporary `md` files must be absorbed or deleted instead of piling up.
- Kept the optimization intentionally inside existing source-of-truth docs rather than creating another policy file, so the fix reduces future sprawl instead of adding to it.

### Session 371 (2026-04-17) - Root Homepage MBTI Copy Correction

- Paused the next implementation step after spotting that the homepage CTA copy `MBTI & 사랑` was semantically wrong for the actual destination page [projects/portal/mbti/index.html](E:/Fire%20Project/projects/portal/mbti/index.html), which is an MBTI compatibility hub rather than a vague love landing.
- Reframed the homepage hero and first winner card around the real target by updating [projects/root-domain/index.html](E:/Fire%20Project/projects/root-domain/index.html) fallback text plus the localized keys in [projects/root-domain/js/locales](E:/Fire%20Project/projects/root-domain/js/locales) from the ambiguous `MBTI & Love` wording to `MBTI Compatibility` / `MBTI 궁합` phrasing.
- Used the Unicode-safe locale update path from the new i18n rule so the non-ASCII languages (`ko`, `ja`, `zh`, `ru`) stayed readable while aligning the same semantic fix across all `12` locale JSON files.
- Validation: `git diff --check` and `quality-gate` both passed. After deploy, the live Korean homepage was rechecked to confirm the hero CTA now reads `MBTI 궁합부터 보기`, the first card reads `MBTI 궁합 허브 열기`, and the related explanatory copy matches the actual compatibility hub.
- Deployment: pushed `root-domain` commit `a1841e0` to `origin/main`, then rechecked `https://dopabrain.com/?lang=ko&v=371a` after propagation to confirm the revised copy is live on `dopabrain.com`.

### Session 372 (2026-04-17) - MBTI Love Result Funnel Upgrade + Lang-Aware SEO

- Ran a fresh weekly review on `2026-04-17` using GA4 landing-page data for `2026-04-10..2026-04-16` versus `2026-04-03..2026-04-09`, then selected `/mbti-love/` as the next relationship-funnel target after seeing the landing rise from `2` to `7` sessions but still convert poorly with only `1 engaged session`, `engagementRate 0.14`, `bounceRate 0.86`, and roughly `5.05s` average session duration; the same check also logged the current AdSense snapshot at `today $0.00`, `yesterday $0.13`, `last_7_days $0.37`, and `this_month $0.57`.
- Reworked [projects/mbti-love/index.html](E:/Fire%20Project/projects/mbti-love/index.html) and [projects/mbti-love/css/style.css](E:/Fire%20Project/projects/mbti-love/css/style.css) so the result screen no longer ends at static share buttons: it now includes a quick-action recommendation card, a jump CTA into the related grid, a result-inline AdSense slot that loads only after the result appears, and stronger follow-up cards to `Attachment Style`, `Love Language`, `EQ Test`, and `Rizz Score`.
- Upgraded [projects/mbti-love/js/app.js](E:/Fire%20Project/projects/mbti-love/js/app.js) to rank those follow-up cards by MBTI love group (`NF`, `NT`, `SF`, `ST`), mirror the top-ranked card into the primary CTA, preserve the current `?lang=` state in all share URLs, and emit the new `mbti_love_*` event set across the quiz, result, share, premium, and follow-up clicks.
- Rebuilt [projects/mbti-love/js/i18n.js](E:/Fire%20Project/projects/mbti-love/js/i18n.js) so the app detects `?lang=` first, syncs canonical/`og:url` from hreflang alternates, updates metadata from localized copy, and keeps browser history aligned when users switch language; also added the new result-funnel labels plus related-card names across all `12` locale JSON files in [projects/mbti-love/js/locales](E:/Fire%20Project/projects/mbti-love/js/locales).
- Validation: `node --check js/app.js`, `node --check js/i18n.js`, locale key coverage checks, `git diff --check`, `quality-gate`, `live-check`, and `node scripts/runtime-check.js mbti-love` all passed. After deploy, live verification on `https://dopabrain.com/mbti-love/?lang=en&v=372f` confirmed the page self-canonicals to `?lang=en`, the result screen now surfaces the primary follow-up CTA, and `quiz_start`, `mbti_love_option_select`, `result_view`, `quiz_complete`, `mbti_love_related_jump_click`, `mbti_love_share_open`, `mbti_love_primary_cta_click`, and `mbti_love_related_click` all land in `dataLayer`.
- Deployment: pushed `mbti-love` commit `e56e2f5` to `origin/main`, then rechecked the live site after propagation to confirm the upgraded result funnel and language-aware SEO state are serving from `dopabrain.com`.

### Session 373 (2026-04-17) - Blood Type Result Funnel Upgrade + Hidden Modal Bug Fix

- Ran another weekly review on `2026-04-17` using GA4 landing-page data for `2026-04-10..2026-04-16` and selected `/blood-type/` as the next personality-funnel target after seeing `4 sessions`, `0 engaged sessions`, `engagementRate 0`, `bounceRate 1`, and about `36.7s` average session duration, which suggested real reading intent but no post-result conversion; the same check kept the current AdSense snapshot at `today $0.00`, `yesterday $0.13`, `last_7_days $0.37`, and `this_month $0.57`.
- Reworked [projects/blood-type/index.html](E:/Fire%20Project/projects/blood-type/index.html) and [projects/blood-type/css/style.css](E:/Fire%20Project/projects/blood-type/css/style.css) so the result screen now includes a quick-action recommendation card, a jump CTA into the related grid, a result-inline AdSense slot, and stronger follow-up cards to `Attachment Style`, `MBTI Love`, `EQ Test`, and `Color Personality`, ranked dynamically by blood type instead of leaving the user at a static tabbed result.
- Upgraded [projects/blood-type/js/app.js](E:/Fire%20Project/projects/blood-type/js/app.js) to rank related cards by blood type, mirror the top-ranked follow-up into the primary CTA, preserve the current `?lang=` state in share URLs, initialize static/result ads more safely, and emit the new `blood_type_*` event set across selection, tab switches, premium opens, sharing, downloads, and follow-up clicks.
- Rebuilt [projects/blood-type/js/i18n.js](E:/Fire%20Project/projects/blood-type/js/i18n.js) so the app detects `?lang=` first, syncs canonical/`og:url`/`twitter:url` from hreflang alternates, and updates metadata without relying only on browser-language detection; also added the new result-funnel labels plus related-card names across all `12` locale JSON files in [projects/blood-type/js/locales](E:/Fire%20Project/projects/blood-type/js/locales).
- Fixed a higher-severity existing bug uncovered during verification: the premium modal and hidden share/language panels were relying on the HTML `hidden` attribute while CSS forced them back to `display:flex`, so the modal overlay could intercept clicks even when “hidden.” Added explicit `[hidden] { display:none !important; }` handling for the modal, language menu, and share section so the result screen is actually clickable.
- Validation: `node --check js/app.js`, `node --check js/i18n.js`, locale key coverage checks, `git diff --check`, `quality-gate`, and `live-check` all passed. The generic `node scripts/runtime-check.js blood-type` still reports false positives because it opens the app over `file://`, which breaks fetch-based locale loading for this app, so the final verification used a local HTTP server plus live Playwright instead. Local verification on `http://127.0.0.1:8140/?lang=en` confirmed the hidden-modal fix, the AB path ranking `MBTI Love` first, and `engagement`, `quiz_start`, `blood_type_select`, `result_view`, `quiz_complete`, `blood_type_primary_cta_click`, `blood_type_related_click`, `blood_type_share_open`, and `blood_type_share_click` all landing in `dataLayer`. Live verification on `https://dopabrain.com/blood-type/?lang=en&v=374d` confirmed the page self-canonicals to `?lang=en` after client init and serves the upgraded result funnel from `dopabrain.com`.
- Deployment: pushed `blood-type` commit `dd7ffca` to `origin/master`, then rechecked the live site after propagation to confirm the upgraded result funnel and hidden-modal fix are serving from `dopabrain.com`.

### Session 374 (2026-04-18) - Emotion Temp Result Funnel Upgrade + Lang-Aware SEO

- Continued the weekly landing-page remediation cycle on `2026-04-18` using the latest GA4 landing review for `2026-04-11..2026-04-17`, then selected `/emotion-temp/` as the next target after seeing `4 sessions`, `0 engaged sessions`, `engagementRate 0`, `bounceRate 1`, and roughly `208.5s` average session duration, which suggested real reading intent but no effective post-result conversion; the same review also noted that AdSense access had fallen back to `invalid_grant` again, so revenue verification was not usable for this cycle.
- Reworked [projects/emotion-temp/index.html](E:/Fire%20Project/projects/emotion-temp/index.html) and [projects/emotion-temp/css/style.css](E:/Fire%20Project/projects/emotion-temp/css/style.css) so the result screen now includes a quick-action recommendation card, a jump CTA into the related grid, a deferred result-inline AdSense slot, and stable `data-related-key` tags on each follow-up card instead of leaving the user at a static share/premium endpoint.
- Upgraded [projects/emotion-temp/js/app.js](E:/Fire%20Project/projects/emotion-temp/js/app.js) so follow-up cards are ranked by emotion-temperature bucket (`cold`, `cool`, `warm`, `hot`), the top-ranked card is mirrored into the primary CTA, the result-inline ad initializes only after the result appears, share URLs preserve the current `?lang=` state, and the new flow emits `quiz_start`, `emotion_temp_option_select`, `result_view`, `quiz_complete`, `emotion_temp_related_jump_click`, `emotion_temp_primary_cta_click`, `emotion_temp_related_click`, `emotion_temp_share_open`, `emotion_temp_share_click`, `emotion_temp_save_click`, `emotion_temp_premium_click`, `emotion_temp_premium_view`, and `emotion_temp_retry_click`.
- Rebuilt [projects/emotion-temp/js/i18n.js](E:/Fire%20Project/projects/emotion-temp/js/i18n.js) so the app now detects `?lang=` first, syncs canonical/`og:url`/`twitter:url` from hreflang alternates, and keeps history plus localized metadata in sync when the active language changes; also added the new result-funnel labels across all `12` locale JSON files in [projects/emotion-temp/js/locales](E:/Fire%20Project/projects/emotion-temp/js/locales) using the UTF-8-safe locale update path from the i18n operations rule.
- Validation: `node --check js/app.js`, `node --check js/i18n.js`, locale key coverage checks, `git diff --check`, `quality-gate`, `live-check`, and `node scripts/runtime-check.js emotion-temp` all passed. Live Playwright verification on `https://dopabrain.com/emotion-temp/?lang=en&v=374e` confirmed the page self-canonicals to `?lang=en`, serves the quick-action card and result-inline ad container, surfaces `HSP Test` as the primary follow-up for the verified live path, and emits `quiz_start`, `emotion_temp_option_select`, `hub_ad_impression`, `result_view`, `quiz_complete`, `emotion_temp_related_jump_click`, and `emotion_temp_primary_cta_click` in `dataLayer`.
- Deployment: pushed `emotion-temp` commits `937563b` (`Upgrade emotion-temp result funnel and lang-aware SEO`) and the follow-up fix `c4e29a0` (`Fix emotion-temp primary recommendation mapping`) to `origin/main`, then rechecked the live site after propagation to confirm the upgraded result funnel and language-aware SEO state are serving from `dopabrain.com`.
