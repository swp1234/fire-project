# DopaBrain Project Rules

이 파일은 프로젝트 공통 규칙만 담는다. Codex 격리 규칙은 `AGENTS.md`가 우선한다.

## Product

- 운영 URL: `https://dopabrain.com/`
- 현재 전략: 소수의 검증된 진입면에 검색·홈·측정을 집중한다.
- 핵심 경로: Stress Check, HSP Test, 2048 Coach.
- 보조 경로: Brain Type, IQ Test, K-pop Role Roster.
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

- 분석 작업 시작 전 `npm run adsense:keepalive`를 실행한다.
- `invalid_grant`이면 `npm run adsense:auth-url`로 복구한다.
- Direct 급증은 국가·기기 조합을 확인하기 전 성장으로 판정하지 않는다.
- 세션 수보다 Organic 참여, 유효 CTA, 국가별 RPM, 색인 상태를 함께 본다.
- 데이터 조회는 작업 재개나 명시적 요청 때 수행하고 단순 종료 기록을 위해 반복하지 않는다.

## Failure records

- 재발 가능성이 있는 도구·배포·검증 실패만 `memory/failures.jsonl`에 한 줄로 남긴다.
- 해결된 일회성 출력이나 전체 콘솔 로그는 문서에 복사하지 않는다.

세부 운영은 `docs/OPERATIONS.md`, 검증은 `docs/VALIDATION.md`, 전략은 `docs/STRATEGY.md`를 따른다.
