# DopaBrain Operations

## Start

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-codex-isolated.ps1
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

1. 현재 파일과 dirty state를 확인한다.
2. 사용자 행동이나 운영 결과로 표현되는 완료 조건을 정한다.
3. 구현한다.
4. 정상 경로 검증과 해당 검증기의 실패 민감도를 확인한다.
5. 로컬 결과가 통과하면 하위 저장소부터 배포한다.
6. production URL에서 다시 검증한다.
7. `PROGRESS.md`는 현재 상태만 갱신한다.

## Focused release

```powershell
npm run verify:root
npm run verify:root:mutations
npm run harness
npm run harness:runtime
node scripts/indexing-inventory.js
```

프로덕션 확인:

```powershell
node scripts/verify-root-focus.js https://dopabrain.com --no-screenshot
```

검증 의미와 위험도별 선택은 `docs/VALIDATION.md`를 따른다.

## Documentation budget

- `PROGRESS.md`: 현재 상태, blocker, 다음 판단만.
- `memory/data-check-log.md`: 전략을 바꾼 데이터 기준점만.
- `memory/failures.jsonl`: 재발 가능성이 있는 실패만.
- 완료된 세션 전문, 콘솔 원문, 중복 체크리스트는 Git 이력에 맡긴다.
- 조건이 바뀌면 기존 문단을 고치고 같은 내용을 새 섹션으로 덧붙이지 않는다.

## Stop conditions

다음은 코드로 우회하지 않는다.

- AdSense 주소/지급 확인.
- 권한 없는 GSC 제출이나 외부 계정 변경.
- 사용자 승인 범위를 넘어선 URL 대량 삭제.
- 실제 프로덕션 배포 여부를 확인할 수 없는 상태에서의 완료 선언.
