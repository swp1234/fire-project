# Harness Workflow

## Fast path

```powershell
npm run harness
```

포털 locale audit, 정적 품질 게이트, 분석 이벤트 smoke, 대표 runtime smoke를 순서대로 실행한다. 첫 실패에서 중단하고 보고서는 `logs/harness-workflow/`에 제한적으로 보존한다.

각 Node 검증기는 실제 실행 자체가 문법 검사이므로 별도 `node --check` 단계나 선언을 만들지 않는다. 성공 단계는 이름·결과·시간만 보고서에 남기고, 실패 단계만 진단 출력을 보존한다.

`node scripts/harness-workflow-check.js --plan`은 실행 없이 중복 단계명과 누락 스크립트를 검사하고 실제 단계 수를 출력한다.

`npm run verify:docs`는 현재 상태 문서의 byte/line 예산, 중복 heading, 단일 latest release와 기록 보존 경계를 변이 검사한다.

## Focused product gate

```powershell
npm run verify:root
npm run verify:root:mutations
npm run harness:runtime
```

루트 검증은 12개 언어, 두 viewport, 핵심 링크, 분석 이벤트, 접근성, 구조화 데이터를 확인한다. 변이 검증은 assertion의 민감도를 확인한다.

## Targeted commands

```powershell
npm run harness:analytics
node scripts/runtime-check.js focused
node scripts/runtime-check.js <app-name>
node scripts/runtime-check.js all
```

`all`은 광범위 변경이나 배포 회귀 때만 사용한다. 일반 작업은 변경된 경로와 focused portfolio를 우선한다.

## Artifacts

- 성공 실행은 대형 screenshot/trace를 남기지 않는다.
- 실패 artifact는 `logs/harness-artifacts/`에 둔다.
- root screenshot은 `.codex-artifacts/`에 생성되며 Git에서 제외된다.
- Markdown 보고서를 세션 기록으로 복사하지 않는다.

검증 계층과 완료 기준은 `docs/VALIDATION.md`가 기준이다.
