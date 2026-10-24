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

