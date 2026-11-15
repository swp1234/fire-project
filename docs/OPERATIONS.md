# DopaBrain Operations

## Start

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-codex-isolated.ps1
npm run session:brief
npm run adsense:keepalive
git status --short
```

수익·분석 작업이 아니면 불필요하게 GA4/GSC를 조회하지 않는다. OAuth `invalid_grant`는 `npm run adsense:auth-url`로 복구한다.

## Repository boundaries

`projects/*`는 독립 Git 저장소 또는 일반 디렉터리일 수 있다.

```powershell
git submodule status
git -C projects/root-domain status --short
```

변경한 하위 저장소를 먼저 검증·commit·push한다. 그다음 루트에서 submodule pointer, 공통 스크립트, 현재 문서를 commit·push한다.

GitHub Pages 저장소는 작업 브랜치와 배포 브랜치가 다를 수 있다. 푸시 전에 `gh api repos/<owner>/<repo>/pages --jq .source.branch`로 실제 source를 확인하고, fast-forward 가능한 배포 커밋을 그 브랜치에도 올린다. Actions의 Pages run이 그 커밋으로 성공하기 전에는 production 배포로 보지 않는다.

## Change loop

1. 시작 보정: `npm run session:brief`로 `memory/retrospectives.jsonl` 최근 3줄, 미승격 교훈, `memory/data-check-log.md` 성숙일 도래 여부를 먼저 확인한다(미도래 실험 조기 판정 및 사용자 합의 제약 재경고 금지).
2. 현재 파일과 dirty state, 수정 대상 `scripts/verify-*.js` 계약, 완료 기준(유입·색인·전환 등 실제 병목 기준)을 확인한다.
3. 구현 후 정상 경로 + 실패 민감도 검증을 수행한다.
4. 로컬 통과 시 하위 저장소부터 commit/push하고, production URL과 성숙일 등록을 완료한다.
5. **세션 종료 자체 피드백**: `PROGRESS.md` 현재 상태 갱신 후, `memory/retrospectives.jsonl`에 단일 스키마(`date, task, friction, rule_target, promoted, lesson`) 1줄을 추가한다. 반복되는 실수는 문서가 아니라 `scripts/verify-*.js` 코드 검증기로 승격한다.

## Release gates

```powershell
npm run harness
npm run harness:release -- --target projects/<app> --release-verifier scripts/verify-<app>.js
```

전체 하네스는 runtime·analytics·indexing 안전 검사를 포함한다. 제품 반복에는 작은 release gate를 쓰고, root 배포 전에는 전체 하네스를 실행한다.

프로덕션 root 확인:

```powershell
node scripts/verify-root-focus.js https://dopabrain.com --no-screenshot
```

검증 의미와 위험도별 선택은 `docs/VALIDATION.md`를 따른다.

## Autonomous skills & registry

- Mobile UX 390x844 audit: `.agents/skills/dopabrain-touch-audit/`
- Submodule branch & push: `.agents/skills/dopabrain-submodule-ops/`
- Full health suite: `.agents/skills/dopabrain-health-guard/`
- Audit registry: `memory/audit-registry.json` 일치 서브모듈은 재감사 스킵 (`docs/COMPLETED-AUDITS.md`).
- Operating lessons & anti-patterns: `docs/ANTI-PATTERNS.md`.

## Documentation budget

- `PROGRESS.md`: 현재 상태, blocker, 다음 판단만.
- `memory/data-check-log.md`: 전략을 바꾼 데이터 기준점만.
- `memory/retrospectives.jsonl`: 세션 회고 및 미승격 실수 단일 기록(반복 2회 시 `verify-*.js` 승격; `memory/failures.jsonl`은 2026-08 동결 아카이브).
- 완료된 세션 전문, 콘솔 원문, 중복 체크리스트는 Git 이력에 맡긴다.
- 조건이 바뀌면 기존 문단을 고치고 같은 내용을 새 섹션으로 덧붙이지 않는다.

## Stop conditions

다음은 코드로 우회하지 않는다.

- AdSense 주소/지급 확인.
- 권한 없는 GSC 제출이나 외부 계정 변경.
- 사용자 승인 범위를 넘어선 URL 대량 삭제.
- 실제 프로덕션 배포 여부를 확인할 수 없는 상태에서의 완료 선언.
