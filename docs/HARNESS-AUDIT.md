# DopaBrain 하네스 엔지니어링 감사 보고서

> 작성일: 2026-03-12
> 분석 대상: Claude Code 프로젝트 전체 인프라 (CLAUDE.md, MEMORY.md, agents/, rules/, commands/, scripts/, docs/, settings, MCP, hooks)

---

## 1. 하네스 엔지니어링이란 무엇인가 (정의)

> **"A harness is every piece of code, configuration, and execution logic that isn't the model itself."**
> — LangChain, "The Anatomy of an Agent Harness"

> **"The infrastructure that wraps around an AI model to manage long-running tasks — prompt presets, opinionated handling for tool calls, lifecycle hooks, and sub-agent management."**
> — Phil Schmid, "The Importance of Agent Harness in 2026"

> **"The tooling and practices we can use to keep AI agents in check."**
> — Martin Fowler (OpenAI Codex팀 인용), "Harness Engineering"

**공식:** `Agent = Model + Harness`

하네스는 AI 에이전트에게 OS가 CPU에게 하는 역할을 한다 (Phil Schmid의 비유):
- Model = CPU (연산 능력)
- Context Window = RAM (제한적, 휘발성)
- **Harness = OS** (컨텍스트 큐레이션, 부팅 시퀀스, 드라이버 제공, 제약 적용)
- Agent = Application (사용자 로직)

### 6대 구성 요소 (전 문서 합의)

| # | 구성 요소 | 설명 |
|---|----------|------|
| 1 | **Context Engineering** | 모델이 보는 정보의 큐레이션 — 시스템 프롬프트, 점진적 공개, 컴팩션, 디렉토리 매핑 |
| 2 | **Tool Infrastructure** | 모델이 할 수 있는 것 — Bash, 파일시스템, git, 브라우저, MCP, 샌드박스 |
| 3 | **Middleware & Lifecycle Hooks** | 모델/도구 호출을 가로채고 보강하는 로직 — 사전체크리스트, 루프 감지, 예산 경고 |
| 4 | **State & Memory Management** | 컨텍스트 윈도우/세션 간 상태 지속 — 진행 파일, git 히스토리, 파일시스템 메모리 |
| 5 | **Verification & Testing** | 결과 정확성 보장 — 자기검증 루프, E2E 테스트, 결정론적 린터, 구조 테스트 |
| 6 | **Architectural Constraints** | 솔루션 공간 한정 — 코딩 표준 강제, 점진적 작업 패턴, JSON > Markdown |

### 보편 원칙 (전 문서 합의)

1. **점진적 > 일괄** — 한 번에 하나의 기능/태스크만 (Anthropic)
2. **자기검증은 협상 불가** — 에이전트는 완료 선언이 아닌 테스트로 증명해야 한다 (LangChain, Anthropic)
3. **삭제를 위해 구축** — 하네스 로직은 더 나은 모델에 의해 대체된다; 모듈성과 교체 가능성이 핵심 (Phil Schmid)
4. **에이전트 실패 = 하네스 개선 신호** — 프롬프트가 아닌 도구, 가드레일, 문서를 개선하라 (Martin Fowler)
5. **Fresh Context + Persisted State** — "Ralph Loop" 패턴: 이전 세션 상태를 읽는 깨끗한 컨텍스트로 시작 (LangChain)
6. **점진적 공개** — 관련 도구와 컨텍스트만 표면화; 과부하는 성능을 저하시킨다 (LangChain, Phil Schmid)

### 보편 안티패턴 (전 문서 합의)

1. **One-shotting** — 단일 세션/컨텍스트에서 모든 것을 완료하려는 시도 (Anthropic)
2. **Doom Loop** — 전략 변경 없이 같은 접근법을 반복 (LangChain)
3. **Premature Victory Declaration** — 검증 없는 완료 선언 (Anthropic)
4. **Context Rot** — 노이즈로 컨텍스트가 차서 성능 저하 (LangChain)
5. **Over-engineering** — 모델 업데이트 시 깨지는 경직된 파이프라인 (Phil Schmid, "Bitter Lesson")
6. **세션 간 지식 손실** — 상태 미지속으로 중복 조사 유발 (Anthropic)

---

## 2. 정확히 매핑되는 활동

### 2.1 Context Engineering — ✅ 강한 매핑

| 활동 | 하네스 요소 | 판정 |
|------|-----------|------|
| **CLAUDE.md** (121줄, 5.7KB) | System Prompt / Agent Onboarding | ✅ 정확 |
| **MEMORY.md** (90줄, 6.1KB) | Cross-session Knowledge Base | ✅ 정확 |
| **PROGRESS.md** (86줄, 4.7KB) | Session State / Progress Tracking | ✅ 정확 |
| **Rules 자동 로드** (path-matched YAML) | Progressive Disclosure | ✅ 정확 |
| **에이전트별 참조 문서** (GAME-SPEC, BLOG-SEO 등) | Scoped Context Injection | ✅ 정확 |

**왜 매핑되는가:** LangChain이 정의한 "harness = delivery mechanism for good context engineering"에 정확히 부합. CLAUDE.md가 시스템 프롬프트, MEMORY.md가 장기 기억, PROGRESS.md가 세션 상태, Rules가 조건부 컨텍스트 주입. 이 4중 구조는 하네스의 컨텍스트 계층(system → persistent → session → conditional)을 충실하게 구현한다.

**특히 좋은 점:**
- Rules의 path-matching은 "progressive disclosure"의 교과서적 구현. 게임 파일 수정 시에만 game-dev.md 로드, 블로그 수정 시에만 blog-seo.md 로드.
- `data-check-log.md`로 GA4/GSC 중복 조회 방지 — 불필요한 컨텍스트 유입 차단.

---

### 2.2 State & Memory Management — ✅ 강한 매핑 (Ralph Loop 패턴)

| 활동 | 하네스 요소 | 판정 |
|------|-----------|------|
| **세션 시작 → PROGRESS.md 읽기** | Session Startup Ritual | ✅ 정확 |
| **세션 종료 → /session-wrap** | Session Shutdown Protocol | ✅ 정확 |
| **Stop Hook → PROGRESS.md 리마인더** | Lifecycle Hook | ✅ 정확 |
| **MEMORY.md에 안정 패턴만 기록** | Durable Knowledge vs Volatile State 분리 | ✅ 정확 |
| **Git 히스토리 as rollback** | Version-controlled State | ✅ 정확 |

**왜 매핑되는가:** Anthropic이 정의한 "work across multiple context windows" 패턴과 LangChain의 "Ralph Loop" (fresh context + persisted state)를 정확히 구현. 세션 시작 시 PROGRESS.md 읽기 → 새 컨텍스트에서 작업 → 세션 종료 시 상태 저장. 이것이 장기 에이전트의 핵심 메카니즘이다.

---

### 2.3 Sub-agent Coordination — ✅ 매핑 (단, 한계 존재)

| 활동 | 하네스 요소 | 판정 |
|------|-----------|------|
| **6개 전문 에이전트** (builder, redesigner 등) | Specialized Sub-agents | ✅ 정확 |
| **team-lead 코디네이터** | Orchestration Agent | ✅ 정확 |
| **TaskCreate + blockedBy 의존성** | DAG-based Task Scheduling | ✅ 정확 |
| **Canary Pattern** (1개 테스트 후 배치) | Risk Mitigation | ✅ 정확 |
| **Max 5-8 동시 에이전트** | Resource Throttling | ✅ 정확 |
| **Worktree 격리** | Sandboxed Execution | ✅ 정확 |
| **mode: "dontAsk"** | Non-interactive Agent Execution | ✅ 정확 |

**왜 매핑되는가:** Phil Schmid이 정의한 "sub-agent management"와 Anthropic의 "Initializer Agent → Coding Agent" 패턴을 확장 구현. 에이전트를 역할별로 분리하고, DAG 의존성으로 실행 순서를 제어하며, worktree로 격리하는 구조는 하네스 엔지니어링의 핵심 요소다.

---

### 2.4 Architectural Constraints — ✅ 부분 매핑

| 활동 | 하네스 요소 | 판정 |
|------|-----------|------|
| **typeof 가드 강제** | Deterministic Safety Rule | ✅ 정확 |
| **i18n try-catch IIFE 강제** | Crash Prevention Constraint | ✅ 정확 |
| **/_common/js/ 참조 금지** | Path Constraint (404 방지) | ✅ 정확 |
| **GA4/GSC 병렬 블록 분리** | MCP Call Ordering Constraint | ✅ 정확 |
| **Co-authored-by 금지** | Git Commit Constraint | ✅ 정확 |
| **12개 언어 필수** | i18n Completeness Constraint | ✅ 정확 |
| **앱별 고유 Primary Color** | Design Constraint (중복 방지) | ✅ 정확 |

**왜 매핑되는가:** Martin Fowler가 소개한 OpenAI Codex팀의 "deterministic custom linters and structural tests" + "architectural constraints monitored by agents"와 동일한 접근. 실패에서 학습한 규칙(GA4/GSC 병렬 실패 → 분리 규칙, /_common/ 404 → 경로 금지)을 하네스에 인코딩한 것은 정확히 "에이전트 실패 → 하네스 개선" 피드백 루프다.

---

### 2.5 Deterministic Verification — ⚠️ 부분 매핑

| 활동 | 하네스 요소 | 판정 |
|------|-----------|------|
| **quality-gate.sh** (14개 체크) | Pre-deploy Linter | ✅ 정확 |
| **live-check.sh** (7개 체크) | Post-deploy Runtime Verifier | ✅ 정확 |
| **/validate 스킬** (4개 병렬 에이전트) | AI-assisted Validation | ⚠️ 부분 |

**왜 "부분"인가:** 아래 §3에서 상세 비판.

---

## 3. 매핑되지 않거나 어긋나는 활동

### 3.1 Middleware & Lifecycle Hooks — ❌ 심각하게 부족

**현재 상태:** Stop Hook 1개 — `echo "PROGRESS.md 업데이트 확인 필요"` (텍스트 출력만)

**하네스 엔지니어링이 요구하는 것:**
- `PreCompletionChecklistMiddleware` — 에이전트가 완료 선언 전 체크리스트 강제 실행 (LangChain)
- `LoopDetectionMiddleware` — 10회 이상 같은 패턴 반복 감지 시 자동 개입 (LangChain)
- `LocalContextMiddleware` — 환경 매핑 자동 주입 (LangChain)
- Budget/Time Warning — 컨텍스트 70%+ 소진 시 자동 경고 (LangChain)

**비판:** CLAUDE.md에 "context 70%+ 소진 시 체크포인트 작성"이라는 **규칙은 있지만 이를 강제하는 메카니즘이 없다**. 모델의 자발적 준수에 의존한다. 이것은 하네스가 아니라 프롬프트다. 하네스는 프롬프트와 달리 **결정론적으로 동작해야** 한다. Stop Hook이 유일한 Lifecycle Hook인데, 그마저도 echo 한 줄이다.

---

### 3.2 Verification Gap — ❌ 기능적 검증 부재

**현재 상태:**
- quality-gate.sh → 파일 존재 여부, 문법, 태그 포함 여부 체크 (정적 분석)
- live-check.sh → 스크립트 참조, typeof 가드, CSS 검사 (정적 분석)
- /validate → LLM 기반 코드 리뷰 (비결정론적)

**하네스 엔지니어링이 요구하는 것:**
- **기능적 검증** — "버튼을 클릭하면 실제로 동작하는가?" (Anthropic: "verify features end-to-end as a human user would")
- **Self-verification Loop** — 에이전트가 코드를 작성한 뒤 스스로 테스트를 실행하고, 실패 시 수정하는 반복 루프 (LangChain: "write code → run tests → inspect logs → fix")
- **행동적 정확성** — Martin Fowler가 지적한 "missing verification of functionality and behavioral correctness"

**비판:**
1. **정적 분석만으로는 "게임이 작동하는가"를 알 수 없다.** quality-gate.sh가 i18n 파일 12개의 존재를 확인하지만, 번역 키가 실제 UI 요소와 매칭되는지는 검증하지 않는다.
2. **/validate는 LLM이 코드를 읽고 판단하는 것이지, 실행해서 검증하는 것이 아니다.** 이것은 "코드 리뷰"이지 "테스트"가 아니다. LangChain이 경고한 "agents confirming solutions match their own code rather than task requirements" 안티패턴에 해당한다.
3. **Playwright, Puppeteer 등 브라우저 자동화 테스트가 전무하다.** 96개 앱 중 어느 것도 E2E 테스트가 없다. 결과적으로 "게임이 로드되고, 플레이되고, 점수가 기록되는가"를 기계적으로 확인할 방법이 없다.

---

### 3.3 Feedback Loop — ❌ 체계적 부재

**현재 상태:**
- MEMORY.md에 사용자가 수동으로 패턴 기록
- 에이전트 실패 시 CLAUDE.md에 규칙 추가 (예: GA4/GSC 분리)

**하네스 엔지니어링이 요구하는 것:**
- **Trace Analysis** — 에이전트가 자신의 실행 trace를 검토하고 자가 진단 (LangChain)
- **Garbage Collection Agent** — 주기적으로 문서/규칙의 불일치를 찾아 정리하는 에이전트 (Martin Fowler/OpenAI)
- **Harness as Dataset** — 에이전트가 생성하는 trajectory 데이터를 경쟁 우위로 활용 (Phil Schmid: "competitive advantage comes from trajectories your harness captures")

**비판:**
1. **피드백이 수동이다.** 사용자가 실패를 인지 → CLAUDE.md/MEMORY.md에 규칙 추가. 이것은 "사람이 하네스를 수정"하는 것이지, "하네스가 스스로 학습"하는 것이 아니다.
2. **에이전트 실행 기록이 보존되지 않는다.** `~/.claude/todos/`에 100개+ 에이전트 태스크 JSON이 쌓여 있지만, 이 데이터를 분석하여 반복 실패 패턴을 추출하는 메카니즘이 없다.
3. **Garbage Collection이 없다.** MEMORY.md에 "쿠키커터 리디자인 완료 메카닉 레지스트리"가 여전히 90줄 중 5줄을 차지한다. 완료된 작업의 잔해가 매 세션 컨텍스트를 소비한다. Martin Fowler가 말한 "entropy and decay"의 실례다.

---

### 3.4 Over-engineering — ⚠️ Bitter Lesson 위험

**현재 상태:**
- 참조 문서 12+ (OPERATIONS, STRATEGY, GAME-SPEC, BLOG-SEO, DESIGN, VALIDATION, I18N, UX-DESIGN, MARKETING, SOCIAL-MEDIA-PACK, GAME-ROAD-SHOOTER 등)
- 에이전트 6개 + 규칙 4개 + 스킬 6개 + 스크립트 4개
- Permissions allowlist 97개 항목
- 동일 규칙의 중복 명시 (CLAUDE.md + MEMORY.md + OPERATIONS.md + 개별 agent.md에 같은 내용)

**Phil Schmid의 경고:**
> "If you over-engineer the control flow, the next model update will break your system."
> "Build to delete — design modular architecture; new models will replace your logic."

**비판:**
1. **규칙 중복:** "GA4/GSC 병렬 금지"가 CLAUDE.md, MEMORY.md, OPERATIONS.md, seo-analyst.md, team-lead.md에 각각 명시되어 있다. 하나를 수정하면 나머지 4곳도 동기화해야 한다. 이것은 DRY 위반이며, 하네스의 유지보수 부채다.
2. **12개 참조 문서:** 대부분의 세션에서 3개 이상 참조되지 않는다. 나머지는 죽은 컨텍스트다. Phil Schmid이 말한 "build to delete" 원칙과 대치된다.
3. **97개 Permissions:** "progressive disclosure"의 정반대. 모든 가능한 명령을 사전 허용하여 모델에게 선택지를 과다 제공한다.

---

### 3.5 JSON vs Markdown — ⚠️ 구조화 데이터 형식 불일치

**Anthropic의 권장:**
> "The model is less likely to inappropriately change or overwrite JSON files."

**현재 상태:** PROGRESS.md, MEMORY.md, 에이전트 태스크 기록, 세션 기록 — 전부 Markdown.

**비판:** Markdown은 사람이 읽기 좋지만, 모델이 **구조적으로 파싱하고 업데이트하기에는 취약하다.** 특히 PROGRESS.md의 세션 기록 테이블은 모델이 줄을 추가하거나 삭제할 때 포맷이 깨지기 쉽다. Anthropic이 JSON을 권장하는 이유는 구조적 무결성 보존이다. 다만 이것은 "개선 가능" 수준이지 "치명적 결함"은 아니다.

---

### 3.6 Premature Victory Declaration 방지 — ❌ 메카니즘 부재

**현재 상태:** 에이전트가 TaskUpdate status: "completed"를 호출하면 완료 처리.

**Anthropic의 경고:**
> "Premature victory declaration — examining partial progress and declaring project complete"

**비판:** 에이전트가 `completed`를 선언하기 전에 검증을 강제하는 미들웨어가 없다. team-lead가 TaskList를 모니터링하지만, 완료된 태스크의 결과물을 **독립적으로 검증하는 절차가 없다.** 에이전트의 자기 평가에 전적으로 의존한다.

---

## 4. 종합 평가

### 매핑 점수판

| 하네스 구성 요소 | 매핑 수준 | 근거 |
|----------------|----------|------|
| Context Engineering | ✅ **강함** | 4중 컨텍스트 계층 + path-matched rules |
| Tool Infrastructure | ✅ **강함** | MCP 8개, scripts 4개, Agent tool 활용 |
| State & Memory Management | ✅ **강함** | Ralph Loop 패턴 정확 구현 |
| Sub-agent Coordination | ✅ **강함** | DAG 의존성, canary, worktree 격리 |
| Architectural Constraints | ✅ **강함** | 실패-학습 규칙 인코딩 |
| Middleware & Hooks | ❌ **약함** | Stop Hook echo 1개뿐 |
| Verification & Testing | ❌ **약함** | 정적 분석만, 기능적/E2E 테스트 전무 |
| Feedback Loop | ❌ **약함** | 수동 피드백, trace 미활용, GC 부재 |
| Progressive Disclosure | ⚠️ **혼재** | Rules는 좋지만 permissions 과다 |
| Build to Delete | ⚠️ **위험** | 12+ docs, 규칙 중복, 교체 어려운 구조 |

**한 줄 요약:** 컨텍스트 엔지니어링과 에이전트 조율은 하네스 엔지니어링의 모범 사례에 근접한다. 그러나 미들웨어, 검증, 피드백 루프가 부재하여 **"좋은 프롬프트 엔지니어링 + 도구 구성"에 머물고, 완전한 하네스에는 도달하지 못했다.**

---

## 5. 제언

### 유지·발전시킬 것

| 항목 | 이유 | 조치 |
|------|------|------|
| **4중 컨텍스트 계층** (CLAUDE.md → MEMORY.md → PROGRESS.md → Rules) | 하네스의 핵심. 이미 잘 작동 | 유지. 단, MEMORY.md 경량화 필요 |
| **Ralph Loop** (세션 시작 Read → 작업 → 세션 종료 Write) | 장기 에이전트의 필수 패턴 | 유지 |
| **Canary Pattern** | 배치 실패 방지의 핵심 | 유지 |
| **GA4/GSC 분리 규칙** | 실패에서 학습한 제약 — 하네스의 정수 | 유지. 단, 한 곳에서만 정의 (DRY) |
| **quality-gate.sh / live-check.sh** | 결정론적 검증의 시작점 | 유지 + 확장 |

### 개선해야 할 것

| 항목 | 문제 | 구체적 액션 |
|------|------|-----------|
| **미들웨어 부재** | 모델 자발적 준수에 의존 | **Git pre-push hook으로 quality-gate.sh 자동 실행.** 서브모듈 내부에서 push 시 14개 체크 자동 통과 필수. 이것만으로도 "프롬프트"가 "하네스"로 격상된다. |
| **기능적 검증 부재** | 정적 분석만으로 앱 동작 미확인 | **Playwright MCP 서버 활성화** (이미 plugin 목록에 있음). 핵심 게임 3개부터 "페이지 로드 + 클릭 + 점수 표시" 수준의 스모크 테스트 작성. 96개 전부가 아니라 상위 게임부터. |
| **피드백 루프 수동** | 에이전트 실패→규칙 추가가 사람 의존 | **실패 로그 자동 수집.** 에이전트 종료 시 exit status + 에러 요약을 `memory/failures.jsonl`에 append. 주간 리뷰(일요일)에 패턴 분석. |
| **규칙 중복** | 같은 규칙이 5곳에 분산 | **Single Source of Truth 원칙 적용.** CLAUDE.md에서 정의 → 나머지는 "CLAUDE.md §X 참조"로 대체. 에이전트 .md에는 해당 에이전트만의 고유 지침만 기재. |
| **MEMORY.md 비대** | 완료 항목이 토큰 소비 | **완료된 쿠키커터 레지스트리 삭제.** redesign.md 규칙에 이미 레지스트리가 있으므로 MEMORY.md에서는 "쿠키커터 24개 완료 → rules/redesign.md 참조"로 1줄 축소. |
| **Premature Victory 방지** | 에이전트 자기 선언에 의존 | **team-lead에 검증 단계 추가.** 태스크 completed 후 quality-gate.sh 실행을 team-lead가 자동 수행. PASS여야 다음 의존 태스크 unblock. |
| **Permissions 과다** | 97개 pre-authorized | **정리 불필요** (실용적 판단). claude -y 모드를 사용하므로 permissions는 성능 영향 없음. 다만 보안 경계가 느슨하다는 점은 인지할 것. |
| **JSON 전환** | Markdown 구조 불안정 | **PROGRESS.md 세션 기록을 JSON 섹션으로 전환**은 ROI가 낮다. 현재 /session-wrap이 잘 작동하므로 현상 유지. 다만 에이전트 간 통신 데이터(태스크 결과 등)는 JSON이 유리. |
| **Garbage Collection** | 오래된 메모리/태스크 정리 부재 | **`~/.claude/todos/` 정리.** 100+ 스테일 태스크 JSON 삭제. 주간 리뷰에 "stale 메모리 정리" 항목 추가. |

### 우선순위 (즉시 → 점진)

1. **즉시:** MEMORY.md 경량화 + 규칙 중복 제거 (토큰 절감, 5분 작업)
2. **이번 주:** Git pre-push hook으로 quality-gate.sh 자동화 (하네스 격상의 최소 단위)
3. **다음 주:** 실패 로그 자동 수집 시작 (memory/failures.jsonl)
4. **월 단위:** Playwright 스모크 테스트 3개 게임 (기능적 검증의 시작)
5. **장기:** team-lead의 자동 검증 단계 + Garbage Collection 에이전트

---

## 6. 결론

이 프로젝트는 하네스 엔지니어링의 **"위쪽 절반"** — 컨텍스트 큐레이션, 상태 관리, 서브에이전트 조율 — 을 높은 수준으로 구현했다. 145개 세션에 걸쳐 96개 앱을 운영하면서 축적된 실전 규칙들(GA4/GSC 분리, typeof 가드, i18n try-catch)은 Martin Fowler가 말한 "에이전트 실패를 하네스 개선 신호로 전환"하는 관행의 실례다.

그러나 **"아래쪽 절반"** — 결정론적 미들웨어, 기능적 검증, 자동 피드백 루프 — 이 빠져 있다. 현재 시스템은 **"잘 설계된 프롬프트 + 잘 구성된 도구"**이지, **"에이전트를 결정론적으로 제어하는 하네스"**는 아니다. 핵심 차이는 한 가지다: **프롬프트는 모델이 따르기를 '요청'하고, 하네스는 '강제'한다.** quality-gate.sh를 git hook에 연결하는 순간, 그것은 프롬프트에서 하네스로 격상된다.

> 출처: LangChain "The Anatomy of an Agent Harness" (2026), LangChain "Improving Deep Agents with Harness Engineering" (2026), Anthropic "Effective Harnesses for Long-Running Agents" (2025), Phil Schmid "The Importance of Agent Harness in 2026" (2026), Martin Fowler "Harness Engineering" (2025)
