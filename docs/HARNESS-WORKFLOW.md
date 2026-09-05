# Harness Workflow

## Fast path

```powershell
npm run harness
```

정적·변이·분석·대표 runtime 검증을 순서대로 실행하며 첫 실패에서 중단한다.

Node 검증기의 실제 실행이 문법 검사도 담당한다. 성공 보고서는 이름·결과·시간만, 실패 보고서는 진단 출력도 보존한다.

`node scripts/harness-workflow-check.js --plan`은 중복 단계와 누락 스크립트를, `npm run verify:docs`는 문서 예산·구조를 변이 검사한다.

브라우저 검증에서 제품 애니메이션 대기를 줄일 때는 대상 앱 경로에만 test clock을 적용한다. 블로그 CTA의 50%/500ms 같은 노출 자격 타이머와 서비스 워커 타임아웃은 실제 시간으로 검증한다.

## Focused product gate

```powershell
npm run verify:root
npm run verify:root:mutations
npm run verify:burnout-trust
npm run harness:runtime
```

루트 검증은 12개 언어, 두 viewport, 링크, 이벤트, 접근성과 구조화 데이터를 확인한다.

## Targeted commands

```powershell
npm run harness:analytics
node scripts/runtime-check.js focused
node scripts/runtime-check.js <app-name>
node scripts/runtime-check.js all
```

`all`은 광범위 변경이나 배포 회귀 때만 사용한다. 일반 작업은 변경된 경로와 focused portfolio를 우선한다.

Runtime smoke는 최대 3개 context를 병렬 실행하되 앱별 5초+5초 관찰은 유지한다. 기능 계약은 제품 verifier가 담당한다. `RUNTIME_CONCURRENCY=1`은 직렬 재현이다.

Analytics smoke도 독립 시나리오를 최대 3개 병렬 실행한다. EQ의 1.4초 피드백 애니메이션만 test clock으로 줄이고 500ms 노출 자격은 실제 시간으로 확인한다. `ANALYTICS_CONCURRENCY=1`은 직렬 재현이다.

다국어 병렬 검증은 locale별 context를 격리해 저장소 간섭을 막는다.

## Artifacts

- 성공 실행은 대형 screenshot/trace를 남기지 않는다.
- 실패 artifact는 `logs/harness-artifacts/`, root screenshot은 Git 제외된 `.codex-artifacts/`에 둔다.
- Markdown 보고서를 세션 기록으로 복사하지 않는다.

검증 계층과 완료 기준은 `docs/VALIDATION.md`가 기준이다.
