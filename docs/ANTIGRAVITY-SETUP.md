# Antigravity 환경 세팅 가이드

> 동일 PC (`E:\Fire Project`), 동일 계정에서 Antigravity가 스스로 실행할 수 있는 원커맨드 지침.
> 모든 소프트웨어/인증은 이미 설치·완료 상태. **설정 복원만 하면 됨.**

---

## 0. 사전 조건 확인 (이미 설치됨)

```bash
# 모두 정상이어야 함
git --version          # 2.41.0+
node -v                # v24.13.0+
python3 --version      # 3.11+
gh auth status         # swp1234 로그인
gcloud auth list       # swp5516@bluehole.net 활성
claude --version       # 2.1.84+
```

---

## 1. 프로젝트 경로

```
E:\Fire Project\          # 루트 (git repo, 108개 서브모듈)
├── .claude/              # agents, commands, rules, settings (git tracked)
├── projects/             # 108개 앱/게임 (각각 서브모듈)
├── scripts/              # 자동화 스크립트
├── docs/                 # 프로젝트 문서
├── memory/               # 세션 메모리 (git tracked)
├── .mcp-servers/         # 로컬 MCP 서버 소스 (twitter, trends, youtube)
├── .nano-banana/         # Gemini 이미지 출력 디렉토리
├── CLAUDE.md             # 핵심 규칙 (반드시 숙지)
├── PROGRESS.md           # 진행 현황 (매 세션 시작 시 읽기)
└── shining-grid-486809-t4-577326e1e6a8.json  # GCP 서비스 계정 키
```

---

## 2. MCP 서버 등록

### 2.1 상시 서버 (Local scope — 이 프로젝트 전용)

```bash
# GA4
claude mcp add ga4 -s local \
  -e GOOGLE_APPLICATION_CREDENTIALS="E:\Fire Project\shining-grid-486809-t4-577326e1e6a8.json" \
  -e GA4_PROPERTY_ID=523606964 \
  -- "C:\Python3.11.2\Scripts\ga4-mcp-server.exe"

# GSC
claude mcp add gsc -s local \
  -e GOOGLE_APPLICATION_CREDENTIALS="E:\Fire Project\shining-grid-486809-t4-577326e1e6a8.json" \
  -- cmd /c npx -y mcp-server-gsc
```

### 2.2 On-demand 서버 (User scope)

한 번에 전부 등록하려면:
```bash
bash "E:/Fire Project/scripts/mcp-restore.sh" all
```

또는 개별 등록:

```bash
# Reddit (User scope)
claude mcp add reddit -s user -- python -m mcp_server_reddit

# Gemini 텍스트 (User scope)
claude mcp add gemini -s user \
  -e GOOGLE_CLOUD_PROJECT=pubg-platform-ai \
  -e GOOGLE_CLOUD_LOCATION=global \
  -e GEMINI_MODEL=gemini-2.5-flash \
  -e GEMINI_ENABLE_CONVERSATIONS=true \
  -e GEMINI_ALLOW_FILE_URIS=true \
  -- cmd /c npx -y github:mnthe/gemini-mcp-server

# Gemini 이미지 (User scope, 별칭: NanoBanana)
claude mcp add gemini-image -s user \
  -e GOOGLE_CLOUD_PROJECT=pubg-platform-ai \
  -e GOOGLE_CLOUD_LOCATION=global \
  -e GEMINI_MODEL=gemini-2.5-flash-image \
  -e GEMINI_ENABLE_CONVERSATIONS=true \
  -e GEMINI_ALLOW_FILE_URIS=true \
  -e GEMINI_IMAGE_OUTPUT_DIR="E:/Fire Project/.nano-banana" \
  -- cmd /c npx -y github:mnthe/gemini-mcp-server

# Twitter (User scope)
claude mcp add twitter -s user \
  -e RAPIDAPI_KEY=9d196dc128msh3d822634a202e4ap157914jsnd32221160443 \
  -- node "E:/Fire Project/.mcp-servers/twitter-X-mcp-server/main.js"

# Trends (User scope)
claude mcp add trends -s user \
  -e tiktok=9d196dc128msh3d822634a202e4ap157914jsnd32221160443 \
  -- mcp run "E:/Fire Project/.mcp-servers/Trends-MCP/src/server.py"

# YouTube (User scope)
claude mcp add youtube -s user \
  -e YOUTUBE_API_KEY=AIzaSyA16xsUHpqdCi2buaWcR3-3Ti37L3FEffk \
  -- node "E:/Fire Project/.mcp-servers/youtube-mcp-server/index.js"
```

### 2.3 확인

```bash
claude mcp list
# ga4, gsc, reddit, gemini, gemini-image 최소 5개 Connected
```

---

## 3. Claude Code 글로벌 설정

`C:\Users\박상우\.claude\settings.json`:

```json
{
  "includeGitInstructions": false,
  "permissions": {
    "allow": [
      "Bash(read_only:true)"
    ]
  },
  "model": "claude-opus-4-6[1m]",
  "statusLine": {
    "type": "command",
    "command": "node \"C:/Users/박상우/.claude/statusline-command.js\""
  },
  "enabledPlugins": {
    "frontend-design@claude-plugins-official": true
  },
  "autoUpdatesChannel": "latest"
}
```

> 이 파일이 이미 존재하면 건드리지 않는다.

---

## 4. 프로젝트 로컬 설정

### `.claude/settings.json` (git tracked — 이미 포함)
- permissions: Bash, Edit, Write 허용
- hooks: Stop 시 PROGRESS.md 업데이트 알림

### `.claude/settings.local.json` (git tracked — 이미 포함)
- 환경변수: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, `ENABLE_TOOL_SEARCH=1`
- 모든 MCP 서버 자동 활성화: `enableAllProjectMcpServers: true`
- 전체 Bash 명령 허용 목록 (git, gh, node, python, npm, bash 등)
- WebFetch 허용 도메인 (dopabrain.com, github.com 등)
- 모든 MCP 도구 허용

> 두 파일 모두 `git clone` 시 자동 포함. 수정 불필요.

---

## 5. Memory 시스템

```
E:\Fire Project\memory\         # git tracked (프로젝트 내)
├── MEMORY.md                   # 메모리 인덱스
├── data-check-log.md           # GA4/GSC 조회 이력
├── strategic-pivot-2.md        # 전략 전환 기록
├── asset-improvement-plan.md   # 에셋 개선 계획
└── failures.jsonl              # 실패 로그
```

Claude Code는 `~/.claude/projects/E--Fire-Project/memory/`에서도 메모리를 읽는다.
첫 실행 시 이 경로가 자동 생성되며, 프로젝트 내 `memory/`와 동일 내용이 유지되어야 한다.

---

## 6. 핵심 규칙 요약 (CLAUDE.md에서 발췌)

| 규칙 | 설명 |
|------|------|
| **Shell** | Windows + Git Bash. Unix 명령만 (`rm -f`, `ls`). `\` 경로 금지. |
| **Git** | `Co-authored-by` 금지. 서브모듈 내부에서 commit/push. |
| **세션 시작** | `PROGRESS.md` 읽기 → (작업재개 시만) GA4/GSC → 작업 → PROGRESS 업데이트 |
| **세션 종료** | GA4/GSC 조회 금지. 완료 작업 요약 + PROGRESS.md 업데이트만. |
| **병렬 에이전트** | 최대 5~8개. 같은 파일 동시 수정 금지. Edit 전 반드시 Read. |
| **i18n** | 12개 언어 필수 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| **디자인** | Dark mode first, Glassmorphism 2.0, 44px touch targets |
| **배포** | 서브모듈 내 `git init → commit → gh repo create → Pages → submodule add` |
| **응답** | 한국어. 코드 주석은 영어. |

---

## 7. Git 구조

```bash
# 루트: private repo (멀티디바이스 동기화용)
git remote -v  # origin = https://github.com/swp1234/fire-project.git

# 서브모듈: 각각 public repo (GitHub Pages 배포)
# 예: projects/eq-test → https://github.com/swp1234/eq-test.git

# 서브모듈 전체 상태 확인
git submodule status | head -5

# 서브모듈 업데이트 (노트북 작업 동기화 등)
git pull --ff-only && git submodule update --init --recursive
```

---

## 8. 주요 스크립트

```bash
bash scripts/mcp-restore.sh [social|media|all]   # MCP 서버 on-demand 등록
bash scripts/quality-gate.sh projects/<name>      # 앱 품질 게이트
bash scripts/app-test-suite.sh projects/<name>    # 앱 테스트 스위트
bash scripts/live-check.sh projects/<name>        # 배포 후 QA
bash scripts/runtime-check.sh [app|games|all]     # Playwright 런타임 테스트
bash scripts/log-failure.sh <agent> <app> <cat> "<desc>"  # 실패 로깅
bash scripts/analyze-failures.sh                  # 실패 분석
```

---

## 9. 전문 에이전트 (`.claude/agents/`)

| 에이전트 | 역할 | 격리 |
|----------|------|------|
| `team-lead` | 팀 조율 (TaskCreate → Agent 스폰) | - |
| `redesigner` | 쿠키커터 리디자인 | worktree |
| `seo-analyst` | GA4/GSC 분석 | worktree |
| `builder` | 신규 앱 생성 | worktree |
| `blog-writer` | 12언어 SEO 블로그 | worktree |
| `trend-scout` | 소셜 트렌드 스캔 | - |
| `supervisor` | 자가 치유 파이프라인 | - |

---

## 10. 빠른 시작 (원커맨드)

```bash
cd "E:/Fire Project"

# 1. 최신 동기화
git pull --ff-only && git submodule update --init --recursive

# 2. MCP 서버 등록 (이미 등록된 경우 스킵)
claude mcp list | grep -q "ga4" || {
  claude mcp add ga4 -s local \
    -e GOOGLE_APPLICATION_CREDENTIALS="E:\Fire Project\shining-grid-486809-t4-577326e1e6a8.json" \
    -e GA4_PROPERTY_ID=523606964 \
    -- "C:\Python3.11.2\Scripts\ga4-mcp-server.exe"
  claude mcp add gsc -s local \
    -e GOOGLE_APPLICATION_CREDENTIALS="E:\Fire Project\shining-grid-486809-t4-577326e1e6a8.json" \
    -- cmd /c npx -y mcp-server-gsc
}

# 3. Claude Code 시작
claude
```

---

## 11. 트러블슈팅

| 증상 | 해결 |
|------|------|
| MCP 서버 연결 실패 | `claude mcp list`로 확인 → 없으면 §2 재등록 |
| npx 명령 실패 | `cmd /c npx ...`로 래핑 |
| GCP 인증 만료 | `gcloud auth application-default login` |
| 서브모듈 detached HEAD | `cd projects/<name> && git checkout master` |
| GA4/GSC 동시 호출 실패 | GA4 먼저 → GSC 별도 블록 (절대 병렬 금지) |
| Edit 연쇄 실패 | Read를 먼저 병렬 → 그 다음 Edit 순차 |

---

> **이 문서는 Antigravity가 `E:\Fire Project`에서 바로 작업을 시작할 수 있도록 하기 위한 것이다.**
> **상세 규칙은 반드시 `CLAUDE.md`를 참조하라.**
