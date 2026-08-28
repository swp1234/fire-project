# Multi-Device Sync

기기 간 동기화는 Git 저장소만 기준으로 하며 Codex 런타임은 격리 상태를 유지한다. 세션 시작과 선택적 환경 가져오기는 [AGENTS.md](../AGENTS.md)와 [AGENT-ENV-SYNC.md](AGENT-ENV-SYNC.md)를 따른다.

## Safe sync

1. 루트와 변경 대상 하위 저장소의 `git status --short`를 각각 확인한다.
2. 하위 저장소 변경을 먼저 검증·commit·push한다.
3. 마지막에 루트의 submodule pointer와 공통 파일을 commit·push한다.
4. 다른 기기에서는 `git pull --ff-only` 후 `git submodule update --init --recursive`를 실행한다.

- 파일은 명시한 경로만 stage하고 사용자 변경을 보존한다.
- 인증 정보, 로컬 캐시, 호스트별 런타임 설정은 Git으로 동기화하지 않는다.
- 저장소 경계와 배포 순서는 [OPERATIONS.md](OPERATIONS.md)가 기준이다.
- 경로·도구 차이는 고정 사용자 경로를 문서화하지 말고 각 기기에서 조회한다.
