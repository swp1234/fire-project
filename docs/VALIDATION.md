# 검증 기준

검증은 “문자열이 있다”가 아니라 실제 사용자 여정과 실패 탐지 능력을 증명해야 한다.

## 필수 계층

| 계층 | 최소 증거 |
|---|---|
| 정적 | canonical, schema, locale JSON, 광고 계약, 서비스워커 범위 |
| 동작 | 시작→완료→다음 행동의 실제 브라우저 여정 |
| 분석 | 단계 이벤트 exact-once, 선택·답변·점수·결과 비전송 |
| 화면 | 390px/1440px overflow 0, 주요 터치 대상 44px 이상, 초점 이동 |
| 변이 | 같은 결함을 주입했을 때 검증기가 실패함 |
| 통합 | 출발 링크, 도착 페이지, 쿼리 allowlist가 함께 동작함 |
| 운영 | 자식 저장소 배포 후 `https://dopabrain.com`에서 동일 계약 통과 |

스크린샷이나 grep만으로 배포를 승인하지 않는다. 런타임 실패가 검증기 결함이면 제품 결함과 구분해 검증기부터 수정한다.

## 공통 명령

```powershell
npm run harness
npm run harness:analytics
npm run harness:runtime
npm run verify:indexing-inventory
npm run verify:tracked-secrets
npm run verify:adsense-contract
npm run verify:ad-risk-inventory
```

현재 핵심 경로:

```powershell
npm run verify:stress-core
npm run verify:eq-trust
npm run verify:2048-ad-policy
npm run verify:sky-runner-suspension
npm run verify:portfolio-retirement
npm run verify:mbti-career-retirement
npm run verify:word-scramble-retirement
npm run verify:pong-suspension
npm run verify:idle-clicker-suspension
npm run verify:flappy-suspension
npm run verify:memory-card-suspension
npm run verify:maze-runner-suspension
npm run verify:color-memory-suspension
npm run verify:road-shooter-suspension
npm run verify:brick-breaker-suspension
npm run verify:zigzag-runner-suspension
npm run verify:hsp-reset-funnel
npm run verify:sensory-reset
npm run verify:ja-minesweeper-path
npm run verify:fr-minesweeper-path
```

나머지 전용 검증기는 `package.json`의 `verify:*` 스크립트를 기준으로 한다. 새 검증기는 문법 검사와 실행을 `scripts/harness-workflow-check.js`에 함께 등록한다.

## AdSense 계약

정상 모드는 고정 게시자 ID의 Auto Ads 로더 1개만 허용한다. 다음 항목은 금지한다.

- 수동 `<ins class="adsbygoogle">` 및 직접 `adsbygoogle.push`
- `data-ad-slot="auto"` 같은 가짜 수동 단위
- DOM을 근거로 한 광고 노출·수익 이벤트
- 광고 시청을 점수, 생명, 결과, 프리미엄 분석과 교환하는 흐름
- 게임 버튼·연속 클릭 영역에 가까운 광고 배치

무효 트래픽 조사 중에는 다음 명시적 중단 계약을 사용할 수 있다.

```html
<body data-ad-serving="suspended-invalid-traffic-YYYY-MM-DD">
```

중단 마커가 있는 페이지에는 AdSense 로더, 수동 단위, push, 정적 광고 surface가 모두 0개여야 한다. `quality-gate.sh`와 indexing inventory가 마커-광고 충돌을 실패 처리한다. 중단 해제는 AdSense 제한 상태와 원인 점검 후 별도 변경으로 수행한다.

공용 `verify:adsense-contract`는 정상 페이지의 로더 1개와 중단 페이지의 로더 0개를 모두 검증한다. 2048 전용 검증은 게임·코치 양쪽의 중단 상태와 일반 Undo를, Sky Runner와 Pong은 시작·완료를, Idle Clicker는 첫 공격·첫 장비 구매를 검사한다. 세 게임 모두 성공 공유·관련 링크·private telemetry를 운영 URL까지 검증한다.

`ad-risk-inventory.js`는 각 하위 저장소의 현재 존재하는 tracked HTML/JS만 검사한다. 커밋 전 삭제된 tracked 파일은 건너뛴다. Auto Ads 존재 자체는 정보로 분리하고, 보상형 광고·자가 완료 unlock·수동 단위/push·중단 마커 충돌을 우선순위화한다. 알려진 위험이 남아 있는 동안 전체 인벤토리는 보고 모드로 실행하고, 탐지기의 9개 행동 변이는 하네스에서 항상 통과해야 한다.

## 분석 계약

- 사용자가 실제로 통과한 단계만 기록한다.
- view는 50% 이상이 500ms 연속 노출된 경우에만 기록한다.
- start, complete, qualified view, primary click은 한 페이지 로드에서 exact-once다.
- 답변, 점수, 결과 유형, 입력 텍스트, 공유 URL은 URL이나 GA4로 보내지 않는다.
- 합성 `page_engage`, 타이머/스크롤 이벤트, 광고 impression 추정치는 성과 판단에서 제외한다.
- 결과 링크는 안정된 `target_slug`만 기록한다.

## 로컬 서버와 네트워크

- 브라우저 검증 서버는 `scripts/lib/safe-local-port.js`의 20000–45000 범위를 사용한다.
- `listen(0)`이나 임의 하드코딩 포트는 브라우저 금지 포트를 뽑을 수 있으므로 사용하지 않는다.
- 외부 분석·광고 요청은 로컬 검증에서 차단하되 앱 스크립트 오류는 숨기지 않는다.
- 서비스워커는 GET, same-origin, 앱 경로, 성공 응답만 캐시한다.

## 배포 순서

1. 전용 정적·변이·런타임 검증
2. 전체 회귀와 인벤토리
3. 자식 저장소 commit/push
4. Pages 완료 확인
5. 프로덕션 전용 검증
6. 루트 gitlink·검증기·운영 문서 commit/push

IndexNow는 변경된 canonical만 보낸다. sitemap이 실제로 바뀐 경우에만 GSC sitemap을 한 번 제출한다. 무효 트래픽 제한 대응 중에는 발견 확대 제출을 중단한다.

콘텐츠 은퇴는 원문을 작은 `noindex,follow` 리디렉트로 바꾸고 목록·관련 링크·hreflang에서 제거한다. 앱 전체를 은퇴할 때는 사용하지 않는 자산도 삭제하고, 기존 cache만 좁게 제거한 뒤 service worker가 스스로 해제되어야 한다. `quality-gate.sh`는 퇴역 stub에 active-app의 GA·schema·locale을 요구하지 않고 2KB 이하·무광고·canonical·SW 해제 계약을 검사한다. `verify:portfolio-retirement`와 `verify:mbti-career-retirement`가 잔존 참조, 재유입 결함과 390/1440px 운영 여정을 검증한다.

## 판정 원칙

- 배포일은 관찰에서 제외하고 완료된 KST 날짜끼리 비교한다.
- 20 qualified view 이전은 `DISCOVERY_HOLD`다.
- 수익은 AdSense URL 단위 근거가 없으면 페이지 성과가 아니라 계정 proxy로 취급한다.
- Direct/Unassigned 스캔, 비정상 국가×기기 세그먼트, 기존 합성 이벤트는 분리한다.
- 같은 결함을 탐지하지 못하는 검증기는 통과 숫자와 관계없이 유효하지 않다.
