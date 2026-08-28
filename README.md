# DopaBrain

트렌드 콘텐츠에서 무료 테스트·도구·게임으로 연결하는 12개 언어 정적 웹 포트폴리오입니다.

- Production: https://dopabrain.com/
- Archive portal: https://dopabrain.com/portal/
- Current focus: Culture Signal + Stress Check, HSP Test, 2048 Coach

## Workspace

- `projects/`: 앱별 독립 저장소와 portal/root-domain.
- `scripts/`: 검증, 분석, 운영 자동화.
- `docs/`: 현재 전략과 운영 기준.
- `PROGRESS.md`: 현재 상태, blocker, 다음 판단.
- `AGENTS.md`: Codex 격리 규칙.
- `CLAUDE.md`: 제품 공통 불변 조건.

## Main checks

```powershell
npm run verify:root
npm run verify:root:mutations
npm run verify:brain-trust
npm run harness
npm run harness:runtime
```

세부 완료 기준은 `docs/VALIDATION.md`, 배포 순서는 `docs/OPERATIONS.md`를 참고하세요.
