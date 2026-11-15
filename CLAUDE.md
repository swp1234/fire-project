# DopaBrain Project Rules

이 파일은 프로젝트 공통 규칙을 담는다 (Claude, Antigravity/Gemini, Codex 공통). Codex 격리 규칙은 [AGENTS.md](AGENTS.md)가 우선한다.

## Product

- 운영 URL: `https://dopabrain.com/`
- 현재 전략: 소수의 검증된 진입면에 검색·홈·측정을 집중한다.
- 핵심 경로: Stress Check, HSP Test, 2048 Coach.
- 보조 경로: Brain Type, IQ Test, Future Self, Color Blindness, White Noise, K-pop Role Roster.
- 저성과 페이지는 근거 없이 삭제하지 않되 홈과 사이트맵에서 제외한다.

## Required invariants

- 지원 언어: `ko en zh hi ru ja es pt id tr de fr` 12개.
- 사용자 문구는 locale JSON과 `data-i18n`을 통한다.
- 터치 타깃은 최소 44px, 모바일 가로 오버플로는 0이어야 한다.
- GA4 ID: `G-J8GSWM40TV`.
- AdSense publisher: `ca-pub-3600813755953882`.
- GSC property: `https://dopabrain.com/`; `sc-domain:` 속성은 사용하지 않는다.
- 루트 robots는 `https://dopabrain.com/sitemap.xml` 하나만 알린다.

## Change discipline

- 기존 상태를 읽고 사용자 변경을 보존한다.
- 각 앱은 독립 저장소일 수 있으므로 `.gitmodules`와 실제 Git 경계를 확인한다.
- 하위 저장소를 먼저 commit/push하고, 마지막에 루트 포인터와 운영 문서를 commit/push한다.
- 구현 완료 선언 전 `docs/VALIDATION.md`의 위험도에 맞는 검증을 수행한다.
- 생성된 보고서나 세션 전문을 Markdown에 누적하지 않는다. 현재 상태만 `PROGRESS.md`에 갱신하고 상세 이력은 Git에 맡긴다.

## Data discipline

- 분석 전 `npm run adsense:keepalive` 실행(`invalid_grant` 시 `adsense:auth-url` 복구).
- Direct 급증은 국가·기기로 봇 여부를 먼저 걸러내고, 세션 수보다 Organic 참여·CTA·RPM·색인을 본다.
- 데이터 조회는 작업 재개·요청 시에만 실행하고, 배포 직후 효과 조기 판정 금지(`memory/data-check-log.md` 성숙일 >=7일/28일 이후 추적).

## Failure & feedback records

- 세션 시작: `npm run session:brief`로 [memory/retrospectives.jsonl](memory/retrospectives.jsonl) 최근 3줄·미승격 교훈(`promoted: false`)·[memory/data-check-log.md](memory/data-check-log.md) 성숙일을 확인한다(합의 제약 재경고·조기 판정 금지).
- 세션 종료: `retrospectives.jsonl`에 1줄(`date, task, friction, rule_target, promoted, lesson`)을 추가하고, 반복 실수는 `verify-*.js` 코드로 승격한다(`failures.jsonl`은 2026-08 동결).

## Multi-Agent Architecture

- SSOT: 모든 도구가 `CLAUDE.md`·`docs/` 공유(`GEMINI.md`, `AGENTS.md`, `.cursorrules`, `.github/`, `.windsurfrules`).

세부 운영은 [docs/OPERATIONS.md](docs/OPERATIONS.md), 검증은 [docs/VALIDATION.md](docs/VALIDATION.md), 전략은 [docs/STRATEGY.md](docs/STRATEGY.md)를 따른다.
