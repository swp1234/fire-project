# DopaBrain Anti-Patterns & Operational Lessons Learned

> **Mandatory Reference for Autonomous Agents & Developers**  
> DopaBrain의 수익, 색인(SEO), 안정성에 악영향을 주었던 과거의 실수와 금지 패턴을 정리한 불변 지침서입니다. 자율 개발 전 반드시 숙지하여 동일한 실수의 반복과 토큰 낭비를 방지합니다.

---

## 1. 광고 및 수익성 악영향 패턴 (AdSense & Invalid Traffic)

### ⚠️ [CRITICAL] 2026-09-03 광고 게재 제한(Invalid Traffic) 사후 분석
- **발생 원인**:
  1. **보상형/결과 잠금 교환 (Ad-for-Result Exchange)**: 퀴즈 결과 확인이나 게임 재도전 시 광고 시청을 강제(`ad-lock`)하여 Google 정책 위반(무효 클릭 및 강제 노출) 판정.
  2. **수동 `adsbygoogle` 슬롯 배치**: 반응형 수동 광고 유닛이 콘텐츠와 겹치거나 인접 배치되어 의도치 않은 무효 클릭 발생.
  3. **Above-the-fold(상단 첫 화면) 광고 과밀**: H1 제목이나 주요 CTA 버튼 위에 광고 인텐트(Ad Intent 링크)가 겹쳐 사용자 경험을 훼손.
  4. **클라이언트 합성 텔레메트리**: 브라우저 스크립트에서 임의로 `page_engage`나 광고 노출 완료 이벤트를 조작하여 발행.
- **금지 불변식 (Strict Invariants)**:
  - ❌ **수동 광고 슬롯 (`<ins class="adsbygoogle">`) 추가 절대 금지**: 단 하나의 Auto Ads 로더 스크립트만 허용하거나, 제한 앱은 완전히 0개 유지.
  - ❌ **보상형 광고 교환 금지**: 광고 시청을 대가로 결과를 잠금 해제하거나 포인트를 제공하는 행위 영구 금지.
  - ❌ **AdSense UI 위치 조작 금지**: 광고 배치는 구글 자동 최적화에 일임하며, 코드 레벨에서 광고를 조작하지 않음.
  - ❌ **무효 트래픽 봉쇄 36개 레거시 앱 계약 준수**: `puzzle-2048`, `sky-runner`, `flappy-bird` 등 제한 대상 앱에는 `data-ad-serving="suspended-invalid-traffic-2026-09-03"` 속성을 명시하고 광고 코드를 절대 삽입하지 않음.

---

## 2. 검색 색인 및 크롤 예산 잠식 패턴 (SEO & Crawl Budget)

### ⚠️ [CRITICAL] 1,900개 비관련 블로그 자동 생성으로 인한 색인 붕괴
- **발생 원인**:
  - Roblox, 게임 팁 등 도메인 핵심 주제(심리, 두뇌 훈련, 감각 민감성)와 무관한 저품질 자동 생성 블로그가 ~1,900개 누적됨.
  - 이로 인해 구글 크롤러가 사이트 전체를 '대량 생성 스팸성 도메인'으로 인지하여 사이트 신뢰도(E-E-A-T)가 급락.
  - 결과적으로 **Stress Check, HSP Test 등 핵심 5대 진입면이 `Crawled - currently not indexed(크롤링됨 - 현재 색인 생성되지 않음)`로 탈락**하는 치명적 병목 초래.
- **금지 불변식 (Strict Invariants)**:
  - ❌ **대량 블로그 생성 스크립트(`scripts/build-tier*.js` 등) 영구 동결**: 추가적인 자동 양산 금지.
  - ❌ **사이트맵 무차별 확장 금지**: 저신호/오프토픽 블로그는 `noindex,follow` 봉쇄를 유지하며, 사이트맵에는 검증된 핵심 도구와 고품질 코호트만 등록.
  - ❌ **얇은(Thin) 도구 페이지 방치 금지**: 핵심 도구는 반드시 12개 언어 i18n, 학술 프레임워크 설명(PSS-10, Aron SPS 등), 구간별 해석 가이드, FAQ, APA 참고문헌을 완비하여 고품질 신호를 유지할 것.

---

## 3. 모바일 사용성(UX) & 접근성 감점 패턴

### ⚠️ 모바일 친화성 평가 탈락 및 터치 타깃 미달
- **발생 원인**:
  - 390x844 모바일 뷰포트에서 고정 너비(px) 요소로 인해 1~186px 가로 스크롤 오버플로 발생.
  - 테마 토글(40px), 사운드 토글(40px), 뒤로가기 링크(19~28px), 체크박스 래퍼(16~18px) 등 터치 타깃이 최소 규격(44px)에 미달하여 모바일 오클릭 유발.
  - `touch-action: manipulation` 누락으로 모바일 더블탭 줌 딜레이 발생.
- **금지 불변식 (Strict Invariants)**:
  - ❌ **가로 오버플로 0px 초과 절대 금지**: 모든 요소는 `box-sizing: border-box`, `max-width: 100%`, `overflow-x: hidden` 고려.
  - ❌ **인터랙티브 요소 44px 미만 금지**: 버튼, 링크, 셀렉트, 체크박스 라벨은 `min-height: 44px; min-width: 44px; display: inline-flex; align-items: center; justify-content: center; touch-action: manipulation;`을 필수로 적용. (단, 본문 단락 내 인라인 텍스트 링크 및 모바일 화면폭 제약이 있는 10열 가상 키보드 가로폭은 WCAG 예외 적용).

---

## 4. Git 서브모듈 및 배포 프로세스 실수 패턴

### ⚠️ Detached HEAD 푸시 누락 및 404 페이지 장애
- **발생 원인**:
  - 서브모듈 디렉터리(`projects/*`)가 detached HEAD 상태에서 작업된 후 원격 브랜치(`main` 또는 `master`)로 checkout/push되지 않고 루트 포인터만 커밋되면, GitHub Pages 빌드 실패 또는 실서비스 404 발생.
  - 루트에서 `git add projects/...`를 먼저 실행하여 하위 저장소 품질 게이트를 우회하는 위험.
- **해결 절차 (Submodule Deployment Protocol)**:
  1. 하위 저장소 상태 확인 (`git -C projects/<app> status`).
  2. 추적 브랜치 정렬 (`git -C projects/<app> checkout -B <main|master>`).
  3. 변경사항 커밋 및 원격 push (`git -C projects/<app> push origin <branch>`).
  4. Pre-push Quality Gate PASS 확인.
  5. 루트 저장소에서 포인터 스테이징 및 커밋/푸시.

---

## 5. 실행 환경 및 CLI 명령어 실수 패턴

- **PowerShell 인라인 따옴표/괄호 파싱 에러**:
  - `node -e 'execSync("git commit -m \"fix(ux): ...\"")'` 실행 시 PowerShell이 `(ux)`를 cmdlet/함수로 오인식하여 에러 발생.
  - **대책**: 복수 저장소 일괄 Git 조작은 반드시 Node.js 독립 실행 스크립트(`.js`)를 생성하여 실행할 것.
- **보호 대상 파일 훼손 금지**:
  - `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}`는 사용자 직접 관리 파일이므로 자율 개발 시 절대 수정하거나 덮어쓰지 말 것.
- **Claude / Codex 런타임 격리 준수**:
  - `%USERPROFILE%\.claude*` 및 `E:\Fire Project\.claude\` 경로는 건드리지 않음.
- **IndexNow 키 불일치로 인한 403 에러 방지**:
  - 임의의 키/해시 문자열을 인라인으로 생성해 제출하면 원격 `dopabrain.com`의 키 파일과 불일치하여 HTTP 403이 반환됨. 반드시 표준 스크립트인 `node scripts/indexnow-submit.js --url <url>`을 사용하여 `projects/root-domain/da41d463f68842ffa3ae58ee92c4105f.txt` 정식 계약 키로 제출할 것.

---

## 6. 구조화 데이터 & E-E-A-T 신뢰도 안티패턴

- **조작된 리뷰 평점 (Fabricated `aggregateRating`)**:
  - 검증 가능한 사용자 리뷰 시스템이 없음에도 스키마에 `ratingValue: 4.8`, `ratingCount: 1240` 등을 임의 삽입하는 행위는 구글 구조화 데이터 가이드라인 위반(스팸 조치 및 신뢰도 강등 대상)이므로 절대 금지.
- **숨겨진 FAQ 스키마 (Hidden `FAQPage` Schema)**:
  - 페이지 본문에 실제로 보이지 않는 FAQ를 JSON-LD 스키마로만 주입하는 행위 금지 (구글 스키마 불일치 페널티 유발).
- **조작된 백분위/통계 (Fake Percentile & Social Proof)**:
  - `Math.random()`이나 하드코딩된 임의 백분위수("상위 19%의 성격입니다", "현재 N명이 응시 중") 표시는 심리학적 전문성/신뢰성을 훼손하므로 금지.
- **클라이언트 합성 타이머 (`page_engage`)**:
  - `setTimeout(..., 5000)`으로 자동 발송되는 가짜 체류 이벤트는 애드센스/GA4의 무효 트래픽(IVT) 탐지 알고리즘을 자극하므로 일체 금지.
- **크로스 프로모션 확장자 처리 누락**:
  - `window.location.pathname` 분석 시 `.html` 확장자를 제거하지 않아 `/portal/tools/*.html` 유틸리티 도구에서 추천 위젯이 렌더링되지 않던 버그 방지 (`.replace(/\.html$/, '')` 필수 적용).

---

## 7. 콘텐츠 & E-E-A-T 신뢰도 누수 안티패턴

- **내부 최적화 지표 텍스트 누출 (Internal Metrics Leakage)**:
  - 블로그/포털 퀵 레일 카드에 `(63s dwell)`, `(175s dwell)`, `(178s dwell)` 등 개발/분석용 체류 시간 메트릭이 방문자 대상 텍스트로 노출되어 스팸/자동생성 사이트 인상을 주는 치명적 문제. 반드시 깨끗한 사용자 가치 설명 문구로 교체할 것.
- **비임상 자가진단 도구에 대한 과장된 의료/진단 표현 금지**:
  - `Clinical-grade check`, `diagnostic benchmarks` 등 임상/의료적 오해를 유발하는 표현은 구글 E-E-A-T 정책 위반(YMYL) 및 의료법적 위험을 초래하므로 "Self-reflection check", "Trait exploration" 등으로 엄격히 대체할 것.

---

## 8. 다국어 및 크로스 프로모션 퍼널 안티패턴 (Cross-Promotion & Funnel Leakage)

- **언어 파라미터 강제 삭제 버그 (`this.currentLang === 'en'` stripping)**:
  - 다국어 i18n 링크 업데이트 로직에서 영어가 기본값이라고 가정하여 `url.searchParams.delete('lang')`를 실행할 경우, 한국어가 기본값인 서브모듈(`/animal-personality/`, `/future-self/` 등)로 이동할 때 영어 사용자가 한국어 기본 페이지로 떨어져 즉시 이탈(Bounce)하는 문제 발생.
  - **대책**: 모든 크로스 프로모션 링크는 현재 활성 언어(`this.currentLang`)를 명시적으로 `url.searchParams.set('lang', this.currentLang)`로 유지하여 언어 연속성을 보장할 것.
- **허브/블로그 카드 목적지 불일치 (Destination-Description Mismatch)**:
  - 게임 허브나 블로그에서 카드의 제목/설명(예: "Flappy Bird", "Road Shooter")과 실제 링크 목적지(`href="/future-self/"`, `href="/daily-tarot/"`)가 불일치하여 클릭 시 사용자 혼란 및 즉각 이탈을 유발.
  - **대책**: 추천/허브 카드는 항상 실제 콘텐츠와 일치하는 정직한 메타데이터를 유지하고, 트래픽 유도가 필요한 경우 해당 수익화 도구의 정식 명칭과 가치 제안(Value Proposition)을 정면으로 노출할 것.
- **Sitemap `lastmod`와 HTML `dateModified` 불일치 (`sitemap_lastmod_mismatch`)**:
  - 사이트맵에 `<lastmod>2026-10-24</lastmod>`를 기록했으나 HTML 메타/JSON-LD가 과거 일자(`2026-08-30` 등)로 남아있을 경우 색인 인벤토리 무결성 실패 발생. 두 값은 항상 동기화되어야 함.
- **분석 텔레메트리 내 사용자 점수/결과값 전송 금지 (`Telemetry Result Leak`)**:
  - 클릭 이벤트나 전환 이벤트에 사용자의 점수(`stress_score`, `score`), 결과 유형(`result_type`), 백분위 등을 파라미터로 포함할 경우 개인정보 보호 불변 조건(Privacy Invariant) 위반 및 회귀 검증기(`verify-*.js`) 실패 발생. 모든 분석 이벤트는 개인 점수/결과를 완전히 배제하고 오직 `target_key`, `surface` 등 기술적 탐색 속성만 전송할 것.
- **전역 크로스 프로모션 위젯 내 중단된 앱(Suspended App) 노출 누수**:
  - `projects/portal/js/cross-promo.js` 내 `BLOG_TOPIC_STRATEGIES`나 `EN_TOOL_BRIDGE_IDS`에 무효 트래픽으로 광고가 중단된 앱(`routine-planner`, `todo-list`, `puzzle-2048`, `brick-breaker`, `reaction-test`, `qr-generator`, `typing-speed`)이 등록되어 있을 경우, 블로그 방문자가 해당 추천을 클릭하여 광고가 없는(0 RPM) 페이지로 빠져나가는 치명적인 수익 누수 발생.
  - **대책**: 전역 위젯의 추천 대상 목록은 반드시 현재 Auto Ads가 정상 작동하는 활성 수익화 도구(`future-self`, `stress-check`, `iq-test`, `pomodoro-timer`, `detox-timer`, `color-blindness`, `animal-personality`, `kpop-position`, `password-generator`, `unit-converter` 등)로만 구성할 것.
- **계약 검증기(`scripts/verify-*.js`)가 바인딩된 블로그 페이지 일괄 수정 금지**:
  - `verify-en-attachment-reflection.js`, `verify-en-future-self-guide.js`, `verify-doomscrolling-bridge.js`, `verify-zh-mbti-city-path.js` 등 특정 블로그 페이지를 타깃으로 정밀 계약 및 변이 테스트(Mutation Test)를 수행하는 검증기가 존재하는 경우, 해당 페이지의 링크나 `dateModified`를 무단으로 변경하면 회귀 테스트가 깨짐.
  - **대책**: 블로그 링크/메타 수정 전 반드시 `scripts/verify-*.js` 파일들을 검색하여 해당 페이지가 계약으로묶여 있는지 확인하고, 수정 시 검증기 및 변이 픽스처까지 함께 계약을 갱신할 것.
- **HSP 진단 결과 화면 내 임의 CTA 카드 삽입 금지 (HSP Reset Funnel Contract Breach)**:
  - `projects/hsp-test`는 결과 화면(`#screen-result`) 내에서 `#result-boundary` 바로 다음에 감각 리셋 룸(`#sensory-reset-cta` -> `/hsp-test/reset.html`)이 위치하는 엄격한 2단계 수익화 퍼널 구조를 계약 검증기(`scripts/verify-hsp-reset-funnel.js`)로 보호함.
  - 임의로 `id="next-step-card"` 또는 `quick-actions-card`를 삽입하면 변이/계약 검증기에서 즉각 `Error: Result contains forbidden next-step card` 실패를 유발함.
  - **대책**: HSP 테스트 결과 후속 링크는 `#sensory-reset-cta`의 리셋 룸을 1순위로 유지하고, 타 앱 연결은 하단의 `.related-grid` 카드에 동적 언어 보존(`?lang=`) 및 `&start=1` 직행 쿼리를 적용하여 유도할 것.
- **서브모듈 메타 `dateModified` 갱신 시 검증기 assertion 동기화 누락**:
  - `scripts/verify-kpop-position.js`, `scripts/verify-animal-personality.js` 등 단위 검증기들은 `dateModified: "YYYY-MM-DD"`를 정확히 검증함. 서브모듈의 `index.html`만 날짜를 올리고 검증기 파일의 assertion을 갱신하지 않으면 회귀 검증이 실패함. 서브모듈 메타 날짜 수정 시 검증기도 즉시 동기화할 것.
- **JavaScript 동적 Canonical 변조로 인한 구글 색인 거절 (Dynamic Canonical Mutation)**:
  - `brain-type`, `npc-test`, `portal/index.html` 등에서 `if (canonical) canonical.href = targetHref;`를 실행하여 쿼리스트링(`?lang=...`)을 표준 URL로 동적 변조하던 문제.
  - **영향**: Googlebot이 JS 렌더링 시 서버의 정적 Canonical과 DOM Canonical 간 불일치를 감지하여 "사용자 지정 표준이 없는 중복 페이지" 또는 "크롤링됨 - 현재 색인 생성되지 않음"으로 배제함.
  - **불변식**: `<link rel="canonical">`은 반드시 정적이고 불변이어야 하며, 클라이언트 사이드 스크립트에서 절대로 수정하지 말 것.
- **다국어 블로그 CTA의 비수익 중단 앱(/detox-timer/) 누수 방지**:
  - 신규 인터랙티브 수익화 도구(`burnout-stress-differential`, `dopamine-detox-protocol`, `grounding-exercise`) 출시 시, 12개 언어 블로그 가이드(예: `dopamine-type-guide`, `dopamine-detox-quiz`)가 여전히 과거의 무광고 중단 앱(`/detox-timer/`)으로 링크되어 발생하는 치명적 수익 누수.
  - **대책**: 신규 도구 배포 즉시 관련 블로그 12개 언어의 CTA 목적지를 신규 도구 URL로 동기화할 것.

---

## 9. 환경, CLI 및 Google 플랫폼 연동 안티패턴

- **Windows PowerShell 명령어 체이닝 (`&&` 사용 금지)**:
  - PowerShell 환경에서 `git add . && git commit`과 같이 `&&` 구문 사용 시 파싱 에러 발생. 복합 명령 실행 시 반드시 세미콜론(`;`)을 사용하거나 Node.js 실행 스크립트로 분리할 것.
- **Google 멀티 계정 세션 혼선 방지 (`authuser=1` 필수)**:
  - 브라우저에 여러 구글 계정이 로그인된 환경에서 `analytics.google.com` 접근 시 기본 계정(`/u/0/`)이 열려 빈 계정(속성 없음)이 노출됨. DopaBrain 전용 계정(`/u/1/`)으로 직행할 수 있도록 URL에 `?authuser=1` 파라미터나 명시적 속성 ID(`p523606964`) 경로를 안내할 것.
- **Google Search Console 소유권 인증 파일 신속 배포 프로토콜**:
  - 서치 콘솔 소유자 권한 부여 시 다운로드받은 `google[hash].html` 파일은 즉시 `projects/root-domain/`에 커밋 및 GitHub Pages로 푸시하고, 라이브 서버에서 `HTTP 200 OK`가 응답하는 것을 curl/fetch로 확인한 뒤 사용자에게 확인을 요청할 것.
- **GA4 Search Console 보고서 라이브러리 미게시 상태 방치**:
  - GA4와 서치 콘솔 연동이 완료되어도 기본값은 미게시(보관함) 상태이므로, [보고서] ➔ [라이브러리] ➔ 'Search Console' 컬렉션의 점 3개(`⋮`)를 눌러 [게시(Publish)]를 수행해야 좌측 내비게이션 메뉴에 영구 노출됨.
- **Windows PowerShell `node -e` 인라인 따옴표/정규식 훼손**:
  - PowerShell에서 `node -e "..."` 실행 시 따옴표(`\"`)나 정규식 슬래시(`/`)가 셸 파서에 의해 손상되어 예기치 않은 문법 오류를 일으킴.
  - **대책**: 복잡한 파일 검증 및 문자열 교체 작업 시 인라인 `node -e`를 지양하고, 반드시 명시적 임시 스크립트(`scripts/*.js`)를 작성해 실행한 후 즉시 삭제할 것.
- **이중 사이트맵(`projects/portal/sitemap.xml` vs `projects/portal/blog/sitemap.xml`) 분기 누락**:
  - `red-flag-test-guide.html`, `stress-response-guide.html`, `boundaries-setting-complete-guide.html` 등 일부 아티클은 `en`/`ko`는 루트 사이트맵에, 나머지 10개 언어는 블로그 사이트맵에 등록되어 있거나 그 반대로 분기되어 있음.
  - **대책**: 마이그레이션 시 반드시 두 사이트맵 모두에서 해당 URL의 존재 여부를 전수 확인하고, 양쪽 모두 `<lastmod>YYYY-MM-DD</lastmod>`를 동기화하여 `sitemap_lastmod_mismatch` 방지.
- **서브모듈 인덱스 내 중단된 앱(Suspended App) 링크 누수 (Submodule Funnel Leakage)**:
  - 과거 `audit-funnel.js`가 `projects/portal/blog/`만 감사하여, `projects/*` 서브모듈 14개소(`animal-personality`, `stress-type`, `name-match`, `soul-age`, `villain-origin`, `affirmation`, `fortune-cookie`, `seollal-greetings`, `valentine`)에 광고가 중단된 앱(`/daily-tarot/`, `/shadow-work/`, `/zodiac-match/`, `/dark-core/`, `/numerology/`) 링크가 방치되었던 문제.
  - **대책**: `audit-funnel.js`를 블로그뿐 아니라 전체 119개 서브모듈 인덱스(4,021개 파일)까지 전수 스캔하도록 확장하고, 정지된 앱 링크는 즉시 활성 수익화 도구(`hsp-test`, `stress-check`, `future-self`, `brain-type`, `soul-age`, `mbti-love`)로 교체할 것.
- **다국어 URL 파라미터(`?lang=`)보다 브라우저 언어를 우선 감지하는 안티패턴**:
  - `name-match` 등 일부 서브모듈의 `i18n.js`에서 `detectLanguage()`가 URL의 `?lang=` 쿼리를 읽지 않고 `localStorage` 및 브라우저 언어(`navigator.language`)를 우선 적용하여, 해외 검색 엔진에서 `?lang=en`으로 유입된 사용자가 한국어로 강제 리디렉트되거나 아웃바운드 링크에 `?lang=ko`가 주입되던 문제.
  - **대책**: 모든 클라이언트 언어 감지 및 `preserveLanguageLinks()`는 반드시 `new URLSearchParams(window.location.search).get('lang')`를 최우선 순위로 둘 것.
- **서브모듈 Pre-push 게이트 구조화 데이터 검사 누락 방지**:
  - `love-frequency`와 같이 Schema.org JSON-LD structured data가 누락된 상태로 푸시를 시도할 경우 Pre-push Quality Gate(`✗ JSON-LD structured data missing`)에서 거부됨. 커밋 전 항상 `WebApplication` 및 `BreadcrumbList` 스키마가 존재하는지 사전 점검할 것.
- **비영어권 아티클 내 정지 앱 교체 후 남겨진 텍스트-목적지 불일치 (Destination-Description Mismatch)**:
  - 과거 정지 앱 교체 시 URL만 바꾸고 앵커 텍스트를 방치하여, 예컨대 `/portal/tools/dopamine-detox-protocol.html`로 가는데 독일어 앵커가 "Krafttier-Persönlichkeitstest(동물 성격 테스트)"로 남아있거나 `/hsp-test/`로 가는데 "트라우마 반응: 4F"로 표기되는 UX/신뢰도 훼손 문제.
  - **대책**: 링크 교체 시 반드시 해당 언어에 맞는 정확한 도구명으로 앵커 텍스트를 함께 교체하고, `dopabrain-funnel-bridge`의 목적지 정합성 검사를 상시 수행할 것.
- **사이트맵 추가 시 HTML 내 JSON-LD `dateModified` 동기화 필수 (`sitemap_lastmod_mismatch`)**:
  - `sitemap.xml`에 새로운 페이지를 등재하거나 `<lastmod>`를 갱신할 때, 해당 HTML 파일의 `<meta name="dateModified">` 및 Schema.org JSON-LD 내 `"dateModified"` 값이 불일치하면 `scripts/indexing-inventory.js --strict`에서 실패함. 사이트맵 수정 시 반드시 대상 HTML 파일들의 메타/스키마 날짜를 동일 날짜(YYYY-MM-DD)로 함께 일치시킬 것.
- **수동 더미 광고 래퍼(`<div class="ad-wrap">`) 방치 안티패턴**:
  - 과거 템플릿에 남아있던 `<div class="ad-wrap"><span data-i18n="ad">Advertisement</span></div>`와 같은 빈 수동 광고 컨테이너는 Auto Ads 단일 로더 정책(`ca-pub-3600813755953882`)에 위배되며 사용자에게 빈 광고 박스를 노출해 정책 리스크를 유발함. Auto Ads 환경에서는 모든 수동 ad-wrap 마크업을 완전히 제거할 것.
- **Select 및 Checkbox 요소의 모바일 터치 타깃 축소 방지**:
  - 브라우저 `<select>`나 `<input type="checkbox">` 요소는 모바일에서 높이나 너비가 24~35px로 축소되기 쉬움. CSS에서 `min-height: 44px; min-width: 44px;`를 명시하거나 44px 이상의 라벨 래퍼로 감싸 터치 타깃 규격을 보장할 것.
- **포털 도구(`projects/portal/tools/`) 내 정지 앱 링크 및 누락된 전환 추적 (Portal Tools Funnel & CTA Attribution Gap)**:
  - 과거 `audit-funnel.js`가 블로그와 서브모듈만 검사하여 `past-life-story-studio.html`에 무효 트래픽 정지 앱(`/past-life/`) 링크가 방치되었고, `cognitive-load-calculator`, `grounding-exercise`, `burnout-stress-differential`, `dopamine-detox-protocol`, `emotion-regulation-planner`, `brain-game-workout`, `decision-matrix` 등 주요 도구에서 브릿지 카드 클릭 시 GA4 전환 이벤트(`content_cta_click`)가 누락되어 도구간 상호 전환 기여도를 측정하지 못했던 문제.
  - **대책**: `audit-funnel.js`의 감사 대상에 `projects/portal/tools/`를 포함하고 `/past-life/`를 `SUSPENDED_SLUGS`에 추가. 모든 인터랙티브 도구는 언어 변경 시 브릿지 링크의 `?lang=` 및 `&source=*` 파라미터를 동적으로 보존하고, `.bridge-card`/`.related a` 클릭 시 `content_cta_click` 이벤트를 필수로 발행할 것.
- **블로그 교차 프로모션 위젯(`cross-promo.js`) 내 정지 앱 브릿지 방치 안티패턴**:
  - `cross-promo.js` 내 과거삶 아티클 인젝션 브릿지가 정지된 `/past-life/`로 향하여 트래픽이 무수익 페이지로 유실되던 문제.
  - **대책**: 위젯 링크를 고체류 핵심 진입면인 `/future-self/?lang=*&start=1`로 직결하고 12개 언어 맞춤 문구 제공 및 `content_cta_click`을 병행 발행하여 트래픽 전환율 극대화.






