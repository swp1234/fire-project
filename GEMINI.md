# DopaBrain Antigravity (Gemini) Project Rules

> **Primary Source of Truth:** [CLAUDE.md](CLAUDE.md)
> DopaBrain 프로젝트의 제품 공통 불변 규칙, 아키텍처 경계, 검증 절차는 [CLAUDE.md](CLAUDE.md)를 따른다.

## 핵심 규칙 요약 (CLAUDE.md 기반)

- **운영 URL:** `https://dopabrain.com/`
- **핵심 진입면:** Stress Check, HSP Test, 2048 Coach (보조: Brain Type, IQ Test, Future Self, K-pop Role Roster).
- **12개 지원 언어:** `ko en zh hi ru ja es pt id tr de fr` (문구는 locale JSON 및 `data-i18n` 필수).
- **모바일/UX 불변 조건:** 터치 타깃 최소 44px, 모바일 가로 오버플로 0px 유지.
- **측정/광고 식별자:**
  - GA4 ID: `G-J8GSWM40TV`
  - AdSense publisher: `ca-pub-3600813755953882` (Auto Ads 로더 1개 원칙, 수동 광고 슬롯/보상형 교환 금지)
  - GSC property: `https://dopabrain.com/` (`sc-domain:` 사용 금지)
- **Git 서브모듈 경계:** `projects/*`는 독립 Git 저장소일 수 있으므로 하위 저장소를 먼저 commit/push하고 마지막에 루트를 갱신한다.
- **감사 레지스트리 및 토큰 절약:** [memory/audit-registry.json](memory/audit-registry.json)에 기록된 HEAD 커밋과 일치하는 서브모듈은 중복 감사하지 않고 스킵한다.
- **문서 예산:** 세션 로그/보고서를 Markdown에 누적하지 않고, 현재 상태는 [PROGRESS.md](PROGRESS.md)에 갱신한다.

## 에이전트 전용 스킬 (`.agents/skills/`)
- `dopabrain-touch-audit`: 390x844 모바일 뷰포트 오버플로 0px 및 44px 터치 타깃 자동 검증.
- `dopabrain-submodule-ops`: 브랜치 정렬, 커밋 메시지 버퍼, child push 및 root 포인터 자동 동기화.
- `dopabrain-health-guard`: AdSense 인증, Auto Ads 계약, 색인 인벤토리, 비밀값, 문서 예산 통합 점검.

## 상세 가이드 링크
- **운영 교훈 & 안티패턴:** [docs/ANTI-PATTERNS.md](docs/ANTI-PATTERNS.md)
- **완료된 감사 내역:** [docs/COMPLETED-AUDITS.md](docs/COMPLETED-AUDITS.md)
- **공통 규칙:** [CLAUDE.md](CLAUDE.md)
- **진행 상황 & Blocker:** [PROGRESS.md](PROGRESS.md)
- **에이전트 격리 규칙:** [AGENTS.md](AGENTS.md)
- **운영 및 배포 절차:** [docs/OPERATIONS.md](docs/OPERATIONS.md)
- **검증 기준:** [docs/VALIDATION.md](docs/VALIDATION.md)
- **성장 전략:** [docs/STRATEGY.md](docs/STRATEGY.md)
- **UI/UX 디자인:** [docs/UX-DESIGN.md](docs/UX-DESIGN.md)
- **다국어 i18n:** [docs/I18N.md](docs/I18N.md)
- **분석 지침:** [docs/GA4-INSIGHTS.md](docs/GA4-INSIGHTS.md)
- **테스트 하네스:** [docs/HARNESS-WORKFLOW.md](docs/HARNESS-WORKFLOW.md)
