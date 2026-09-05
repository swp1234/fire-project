# Harness workflow

## 실행 모드

전체 회귀는 등록된 검사를 순차 실행하고 첫 실패에서 중단한다.

```powershell
npm run harness
```

제품 반복은 별칭을 새로 만들지 않고 하나의 범용 게이트를 사용한다.

```powershell
npm run harness:release -- --target projects/<app> --release-verifier scripts/verify-<app>.js
```

릴리스 모드는 제품 검증기와 문서, quality, 색인, secret, 광고 안전 검사를 실행한다. 최종 root 배포 전 전체 회귀는 별도다.

## 계획 계약

```powershell
node scripts/harness-workflow-check.js --plan
node scripts/harness-workflow-check.js --self-test
```

`--plan`은 실행 없이 다음을 검증·출력한다.

- 중복 step과 누락된 Node/Bash 파일.
- 안전한 product/runtime 경로.
- foundation, product-contract, acquisition, containment, release-safety, telemetry-runtime 그룹별 수.
- `package.json`의 `verify:*`가 full 등록 또는 사유가 있는 diagnostic-only인지 여부.

새 제품 검증기는 full 목록에 등록한다. 일회성 migration이나 현재 portfolio 밖 직접 진단만 코드에 사유를 적어 제외하며, 분류되지 않은 검증기는 계획 단계에서 실패한다. `--self-test`는 이 구조 결함 여섯 종류가 실제로 탐지되는지 확인한다.

## 직접 진단

```powershell
npm run harness:analytics
npm run harness:runtime
node scripts/runtime-check.js <app-name>
```

`runtime-check.js all`은 광범위 브라우저 회귀에만 사용한다. runtime과 analytics는 격리 context에서 최대 3 workers를 사용하며, 재현 시 `RUNTIME_CONCURRENCY=1` 또는 `ANALYTICS_CONCURRENCY=1`로 낮춘다.

전체 step은 기본 순차다. 일부 legacy mutation 검증기가 fixture를 만들며 실제 경로도 잠깐 쓰기 때문에 상위 runner의 무조건 병렬화는 금지한다.

## 보고서

- pass에는 그룹·이름·결과·시간만, fail에는 진단 tail도 남긴다.
- screenshot과 trace는 실패 때만 ignored artifact 경로에 둔다.
- timestamp report는 최근 8회만 보존하고 세션 Markdown에 복사하지 않는다.
- 완료 의미와 production 기준은 `docs/VALIDATION.md`를 따른다.
