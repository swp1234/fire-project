96개 서브모듈 상태 일괄 점검.

1. 모든 projects/ 하위 서브모듈 순회
2. 각 서브모듈에서 확인:
   - 미커밋 변경 파일 수 (`git status --porcelain | wc -l`)
   - 미Push 커밋 수 (`git log @{u}..HEAD --oneline 2>/dev/null | wc -l`)
   - 현재 브랜치
3. 결과를 테이블로 요약:
   - 미커밋 변경이 있는 프로젝트 목록
   - 미Push 커밋이 있는 프로젝트 목록
   - 정상 프로젝트 수
4. 문제 있는 프로젝트에 대해 `git add -A && git commit -m "sync" && git push` 수행 여부를 사용자에게 확인

규칙:
- tree 타입 디렉토리(_common 등)는 건너뛰기
- `git ls-tree HEAD projects/` 로 서브모듈 목록 확인
- 결과는 간결하게 테이블 형식으로
