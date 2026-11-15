# DopaBrain Anti-Patterns & Guardrails

> **목적:** 코드/하네스로 **아직 자동 차단되지 않는 실수**는 작업 전 직접 막고, **이미 자동 차단되는 불변식**은 검증기 위치만 색인해 컨텍스트 소모와 재발을 줄인다. (이력 서사는 Git에 맡긴다.)

---

## 1. 작업 전 에이전트 필수 체크 (비자동화 실수 방지)

| 영역 | 금지 / 실수 패턴 | 필수 대책 |
|---|---|---|
| **환경·CLI** | Windows PowerShell에서 `&&` 체이닝 또는 따옴표/정규식 포함 인라인 `node -e` 실행 | 세미콜론(`;`) 사용, 3줄 이상·특수문자 script는 `.js` 파일로 실행 후 정리 |
| **경로 격리** | `%USERPROFILE%\.claude*`, `E:\Fire Project\.claude\`, `projects/attachment-style/clarity.*` 수정 | Codex 격리 규칙 및 사용자 직할 파일 절대 비접촉 |
| **서브모듈** | Detached HEAD에서 커밋·푸시 누락, 루트 먼저 커밋해 Pages 404 유발 | `dopabrain-submodule-ops` 순서 준수 (child branch 검증→push→Pages 성공→root) |
| **일괄 수정** | `scripts/verify-*.js` 계약(메타 날짜, 브릿지 문구, HSP/IQ/City 경로 등) 미확인 후 일괄 치환 | 수정 전 `Select-String` / `findstr`로 `scripts/verify-*.js` 바인딩 여부 먼저 확인 |
| **배치 멱등** | 무변경 파일까지 공백 정리/리라이트하여 가짜 `dirty` 유발, `&amp%3B` 이중 인코딩 | `next !== source`일 때만 기록, active app 화이트리스트 확인 |
| **수익·계정** | AdSense UI 조작, 사용자 확인 완료된 **PIN 경고 반복**, 배포 후 `<7일`/`<28일` 조기 효과 판정 | `npm run session:brief`로 성숙일(`READY` / `WAIT`) 확인 후에만 ROI 평가 |
| **외부 도구** | Google 멀티계정 기본(`/u/0/`) 접속 혼선, 임의 IndexNow 키 생성, GSC `sc-domain:` 사용 | URL에 `authuser=1`, `scripts/indexnow-submit.js` 사용, GSC는 `https://dopabrain.com/` |
| **콘텐츠·SEO** | 비임상 도구에 `Clinical-grade`/`diagnostic benchmarks` 사용, Tier 블로그 양산(`build-tier*`), 미검토 3000p 사이드바 | `"Self-reflection"`, `"Trait exploration"` 표현, Tier 파이프라인 동결 유지 |
| **다국어·JS** | `window.i18n` 미노출, `node -c` 문법검사 누락, 브라우저 언어 우선(URL `?lang=` 무시), 비ASCII 콘솔 파손 | `window.i18n = i18n;`, `?lang=` 최우선, locale JSON 일괄 수정 시 UTF-8 `.js` 스크립트 사용 |

---

## 2. CSS / DOM 실수 방지 체크 (자동감사 오탐·결함 예방)

- **모바일 0px 오버플로:** `html { overflow-x: hidden; max-width: 100%; }`, 2열 그리드는 `repeat(2, minmax(0, 1fr))` + 자식 `min-width: 0; word-break: break-word;` (가로 슬라이드 애니메이션 포함).
- **44px 터치 타깃:** `button, select, input[type="checkbox"], input[type="radio"], nav a, footer a, .sources a`에 직접 `min-height: 44px; min-width: 44px; touch-action: manipulation;`. 진입 `scale(0.95)` 애니메이션 카드는 `min-height: 48px;`로 여유 확보. SVG 존 위 음수 마진 오버레이 중첩 금지 (`pointer-events: none`).

---

## 3. 코드·하네스로 이미 자동 차단되는 불변식 (중복 서술 금지)

| 불변식 / 과거 사고 | 자동 차단 스크립트 / 게이트 |
|---|---|
| 수동 `adsbygoogle` 유닛·빈 `.ad-slot`/보상형 잠금·5초 카운트다운·36개 정지 앱(2026-09-03 계약) | `verify-adsense-contract.js`, `verify-restricted-ad-projects.js` |
| `page_engage` 합성 텔레메트리·조작 `aggregateRating`·숨겨진 `FAQPage`·임의 백분위 | `.agents/skills/dopabrain-trust-audit/scripts/trust-audit.js` |
| 정지 앱(`/past-life/`, `/detox-timer/` 등) 링크 잔존·목적지 불일치·점수/결과 GA4 누출 | `.agents/skills/dopabrain-funnel-bridge/scripts/audit-funnel.js`, `analytics-event-check.js` |
| `127.0.0.1` AdSense 오염·SG 직통 봇 스캔 희석 (`ad-loader.js` 가드) | `verify-portal-auto-ads-only.js`, `ad-loader.js` |
| 동적 `<link rel="canonical">` 변조·사이트맵/HTML `dateModified` 불일치·`noindex` 재등재 | `indexing-inventory.js --strict`, `verify-root-focus.js` |
| `?lang=` 유실·카탈로그 어트리뷰션 유실·HSP 결과 `#sensory-reset-cta` 계약 위반 | `verify-sensory-reset.js`, `verify-hsp-reset-funnel.js`, `verify-portal-tools.js` |
| 390x844 오버플로·44px 터치 타깃·개별 `.html` trailing slash 파싱 | `.agents/skills/dopabrain-touch-audit/scripts/audit-touch.js` |
| 문서 비대화·로컬 깨진 링크·세션 회고 스키마·미성숙 실험 조기 판정 | `verify-doc-budget.js --mutations`, `scripts/session-brief.js` |
