# Validation Standard

검증은 “명령이 성공했다”가 아니라 요청한 결함을 실제로 탐지하는지까지 확인한다.

## Layers

| Layer | What it proves | Example |
|---|---|---|
| Static | 형식과 필수 자산 | JSON parse, 12 locales, schema parse |
| Runtime | 브라우저가 예외 없이 로드됨 | Playwright page/console errors |
| Behavior | 사용자가 목표 행동을 완료함 | CTA event, test completion |
| Integration | 목적지와 공통 자산이 연결됨 | internal URL 2xx/3xx |
| Layout/a11y | 실제 조작 가능함 | 44px target, overflow, landmarks |
| Production | 배포본이 로컬과 동일하게 동작함 | live URL regression |
| Mutation | 검증기가 알려진 결함에서 실패함 | broken link, missing locale |

정적 grep만 통과한 결과를 기능 검증으로 보고하지 않는다.

## Focused root gate

```powershell
npm run verify:root
npm run verify:root:mutations
npm run verify:brain-trust
```

`verify:root`가 확인하는 항목:

- 12개 locale 파일과 필수 키.
- mobile 390×844, desktop 1440×900에서 각 언어 렌더링.
- 정확한 primary/start/pick/culture 경로와 9개 목적지 응답.
- canonical, 13개 hreflang, 화면과 일치하는 schema types.
- 중복 ID, skip target, 44px target, 초기 CTA 가시성, 가로 overflow.
- `root_view`, CTA, pick, culture, language-change 분석 이벤트.
- page/console runtime exceptions.

`verify:root:mutations`는 정상 fixture가 통과하고 다음 결함이 실패하는지 확인한다.

- primary route 변조.
- locale 파일 누락.
- CTA event surface 변조.
- Culture Signal route 변조.
- 강제 mobile overflow.
- duplicate ID.
- runtime exception.

`verify:brain-trust`는 12 locale, 실제 scoring 설명, 제한 고지, schema, 13 hreflang을 확인하고 가짜 수치·평점·분포·hreflang 붕괴·고지 제거 변이를 실패시킨다.

## Portfolio runtime

```powershell
npm run harness
npm run harness:analytics
npm run harness:runtime
```

`harness:runtime` 기본 대상은 focused portfolio 6개다. 광범위 회귀가 필요한 경우에만 `node scripts/runtime-check.js all`을 사용한다.

## App-specific risk

질문 흐름, 결과 계산, 저장, 공유, 광고 트리거를 변경했다면 해당 앱 전용 Playwright suite를 실행한다. 스타일이나 문구만 바꿔도 핵심 CTA와 모바일 레이아웃은 다시 확인한다.

## Production gate

하위 저장소 push와 루트 submodule pointer push가 끝난 후 실행한다.

```powershell
node scripts/verify-root-focus.js https://dopabrain.com --no-screenshot
```

사이트맵과 robots는 실제 HTTP 200 응답과 URL 수를 확인한다. CDN 캐시가 의심되면 query cachebuster를 붙인다.

## Failure handling

- 검증 실패를 같은 명령의 무한 재시도로 숨기지 않는다.
- 코드 결함, fixture 결함, 도구 결함을 구분한다.
- 검증기가 결함을 못 잡으면 기능 코드보다 먼저 assertion을 강화한다.
- 재발 가능한 도구 문제만 `memory/failures.jsonl`에 기록한다.
