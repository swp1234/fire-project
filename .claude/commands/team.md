팀 구성 및 실행. 인자: $ARGUMENTS

팀 템플릿에 따라 TeamCreate → TaskCreate → Agent 스폰을 자동 수행한다.

## 사용법
- `/team launch <app-name>` — 새 앱 출시 풀사이클 (build → blog → seo)
- `/team growth` — 성장 스프린트 (trend-scout + seo-analyst → action items)
- `/team redesign <app1> [app2] [app3]` — 배치 리디자인 (max 3 동시)
- `/team content <app1> [app2] [app3]` — 배치 블로그 생성 (max 3 동시)
- `/team custom` — 사용자 지정 팀 구성

## 실행 절차

### 1. 팀 생성
`TeamCreate`로 팀 생성. team_name: `{template}-{MMDD}` (예: `launch-0311`)

### 2. 태스크 생성 (템플릿별)

#### launch
1. `plan` — 앱 기획 (컨셉, 타겟, primary color)
2. `build` — 앱 구현 (index.html + CSS + JS + i18n 12개) [blockedBy: 1]
3. `validate` — 품질 검증 (quality-gate.sh) [blockedBy: 2]
4. `deploy` — 배포 (git init → gh repo → Pages → submodule) [blockedBy: 3]
5. `blog` — 12개 언어 블로그 생성 [blockedBy: 4]
6. `seo-audit` — SEO 최적화 확인 [blockedBy: 4]

#### growth
1. `trend-scan` — 소셜 트렌드 스캔
2. `seo-audit` — GA4/GSC 분석
3. `action-items` — 분석 결과 종합 + 실행 계획 [blockedBy: 1, 2]

#### redesign
앱별 독립 태스크 (병렬 실행, max 3)

#### content
앱별 독립 태스크 (병렬 실행, max 3)

### 3. 에이전트 스폰
- `subagent_type`: 해당 에이전트명 (builder, redesigner, blog-writer, seo-analyst, trend-scout)
- `mode: "dontAsk"`
- `isolation: "worktree"` (trend-scout, seo-analyst 제외)
- 카나리 패턴: 배치 작업 시 1개 먼저 → 성공 확인 → 나머지

### 4. 모니터링
- 태스크 완료 메시지 자동 수신 (SendMessage 기반)
- TaskList로 전체 진행률 확인
- 의존성 해제 시 다음 에이전트 스폰
- 장시간 작업 시: CronCreate로 5분마다 TaskList 체크 → 멈춘 태스크 감지
- 전체 완료 시 shutdown_request → TeamDelete → CronDelete → PROGRESS.md 업데이트

모든 단계 자율 진행, 확인 질문 없음.
