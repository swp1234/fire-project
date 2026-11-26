# DopaBrain Antigravity Rules

> **SSOT:** 공통 규칙·제품 목록·측정 ID·검증 정본은 [CLAUDE.md](CLAUDE.md). 매 턴 자동 주입되므로 실행 루프와 포인터만 유지.

## Session 루프

1. **시작:** `npm run session:brief` → [memory/retrospectives.jsonl](memory/retrospectives.jsonl) 최근 3줄·미승격(`promoted: false`)·[memory/data-check-log.md](memory/data-check-log.md) 성숙일 확인.
2. **작업 전:** [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md)와 `scripts/verify-*.js`를 `Select-String` 조회. [memory/audit-registry.json](memory/audit-registry.json) HEAD 일치 서브모듈은 스킵.
3. **릴리스:** `projects/*` 선 검증·commit·push → Pages 성공 확인 → 루트 포인터·문서 갱신(`verify:docs`).
4. **종료:** [PROGRESS.md](PROGRESS.md) 1문단 갱신 + `memory/retrospectives.jsonl` 1줄 추가(반복 실수는 `scripts/verify-*.js` 승격).

## 에이전트 전용 스킬 (`.agents/skills/`)

- `dopabrain-touch-audit`: 390x844 오버플로 0px·44px 터치 타깃.
- `dopabrain-submodule-ops`: detached HEAD 방지·child→root 동기화.
- `dopabrain-health-guard`: AdSense·Auto Ads·색인·비밀값·문서 예산 점검.
- `dopabrain-funnel-bridge` / `dopabrain-trust-audit`: 중단 앱·어트리뷰션·신뢰도 스키마 검사.

## Neon 운용 규칙

- **Effort:** 기본 `Medium` / 단순 조회·단일 수정 `Low` / 4개+ 서브모듈·하네스·회귀 분석 `High` (`XHigh` 예외 전용).
- **실행:** 대규모 변경은 `High` 계획 후 `Medium` 실행, 동일 검증 2회 실패 시 재진단·승격, `browser`는 `flash` 고정 → [NEON-WORKFLOW.md](docs/NEON-WORKFLOW.md).

## 상세 가이드 (`docs/`)

- [NEON-WORKFLOW.md](docs/NEON-WORKFLOW.md) · [ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md) · [OPERATIONS.md](docs/OPERATIONS.md) · [VALIDATION.md](docs/VALIDATION.md) · [HARNESS-WORKFLOW.md](docs/HARNESS-WORKFLOW.md) · [STRATEGY.md](docs/STRATEGY.md) · [I18N.md](docs/I18N.md) · [GA4-INSIGHTS.md](docs/GA4-INSIGHTS.md) · [COMPLETED-AUDITS.md](docs/COMPLETED-AUDITS.md) · [AGENTS.md](AGENTS.md)
