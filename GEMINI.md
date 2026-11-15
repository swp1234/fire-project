# DopaBrain Antigravity Rules

> **SSOT:** 모든 공통 규칙·제품 목록·측정 ID·검증·운영 원칙의 단일 정본은 [CLAUDE.md](CLAUDE.md)다. 이 파일은 매 턴 자동 주입되므로 중복 요약 없이 Antigravity 전용 실행 루프와 포인터만 유지한다.

## Session 루프

1. **시작:** `npm run session:brief` 실행 → [memory/retrospectives.jsonl](memory/retrospectives.jsonl) 최근 3줄·미승격 교훈(`promoted: false`)·[memory/data-check-log.md](memory/data-check-log.md) 성숙일 확인.
2. **작업 전 확인:** [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) 금지 목록과 수정 대상 `scripts/verify-*.js` 계약을 `Select-String`으로 먼저 조회. [memory/audit-registry.json](memory/audit-registry.json) HEAD 일치 서브모듈은 재감사 스킵.
3. **릴리스 순서:** `projects/*` 하위 저장소 선 검증·commit·push → Pages run 성공 확인 → 루트 포인터 및 문서 갱신(`verify:docs` 통과).
4. **종료:** [PROGRESS.md](PROGRESS.md) 현재 상태 1문단 갱신 + `memory/retrospectives.jsonl`에 1줄 추가(반복 실수는 [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) 대신 `scripts/verify-*.js` 코드로 승격).

## 에이전트 전용 스킬 (`.agents/skills/`)

- `dopabrain-touch-audit`: 390x844 오버플로 0px 및 44px 터치 타깃 검증.
- `dopabrain-submodule-ops`: detached HEAD 방지 및 child push → root 포인터 동기화.
- `dopabrain-health-guard`: AdSense keepalive, Auto Ads, 색인 인벤토리, 비밀값, 문서 예산 통합 점검.
- `dopabrain-funnel-bridge` / `dopabrain-trust-audit`: 중단 앱 링크·어트리뷰션·신뢰도 스키마 자동 검사.

## 상세 가이드 (`docs/`)

- [ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) · [OPERATIONS.md](docs/OPERATIONS.md) · [VALIDATION.md](docs/VALIDATION.md) · [HARNESS-WORKFLOW.md](docs/HARNESS-WORKFLOW.md) · [STRATEGY.md](docs/STRATEGY.md) · [I18N.md](docs/I18N.md) · [GA4-INSIGHTS.md](docs/GA4-INSIGHTS.md) · [COMPLETED-AUDITS.md](docs/COMPLETED-AUDITS.md) · [AGENTS.md](AGENTS.md)
