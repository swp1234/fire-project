# CLAUDE.md

> 핵심 규칙만. 상세는 `docs/`, 조건부 규칙은 `.claude/rules/` 참조.

## Shell & Environment (CRITICAL)

Windows + Git Bash. **Windows 명령어 절대 금지.**
- `rm -f`, `ls`, `cp`, `mv` 사용 (`del`, `rmdir`, `dir`, `copy`, `move` 금지)
- 경로: `/` 슬래시만 (`\` 금지)
- `~` 직접 해석 안 됨 → 풀 경로 사용 (`/c/Users/박상우/...`)
- CRLF 방지: `.gitattributes` (`* text=auto eol=lf`)

## Git (CRITICAL)

- **Co-authored-by 절대 금지** — `git commit -m "message"` 만
- 서브모듈 내부에서 commit/push (루트 `E:\Fire Project`는 remote 없음)
- 서브모듈 vs 일반 디렉토리 혼재 — `git ls-tree HEAD`로 확인
- 작은 단위라도 즉시 commit & push

## Session Management (CRITICAL)

- **세션 종료/wrap-up 시 GA4/GSC 조회 절대 금지** — 완료 작업 요약 + `PROGRESS.md` 업데이트만
- GA4/GSC는 **"작업재개"** 또는 **명시적 요청** 시에만 조회
- `memory/data-check-log.md`에 오늘 날짜 있으면 조회 생략
- **Effort 전략:** 단순 작업=low, 일반=medium(기본), 복잡한 디버깅/설계=high(`ultrathink`)
- **`/compact`:** 대규모 작업 시작 전 선제적으로 실행해 context 확보
- **`/fork`:** 메카닉/접근법 고민 시 대화 분기해 A/B 비교

## Parallel Agents (CRITICAL)

- **최대 5~8개** 동시 에이전트 — 20+개는 context 폭발 원인
- **카나리 패턴**: 대량 배치 전 1개 테스트 에이전트 먼저 → 성공 확인 후 나머지 배치
- 에이전트 mode: `dontAsk` (permission 실패 방지)
- 같은 파일 동시 수정 금지
- Edit 전 반드시 Read 먼저 (Grep/Glob은 Read로 인정 안 됨)
- 에이전트가 실패하면 **같은 방법 재시도 금지** → 접근법 변경 또는 메인에서 직접 실행
- Background agents false positive 가능 → 항상 직접 검증

## Checkpoint (대규모 작업 시)

- 10+ 파일 또는 5+ 에이전트 작업 시 **체크포인트 모드** 활성화
- 3개 태스크 완료 또는 15 tool calls마다 → `PROGRESS.md`에 중간 저장
- context 70%+ 소진 감지 시 → 즉시 체크포인트 작성 + commit + 새 세션 안내

## Code Changes

- **수정 전 반드시 현재 상태 확인** — 이전 세션/에이전트가 이미 적용했을 수 있음
- 파일 Read → 이해 → Edit (추측 금지)
- 불필요한 작업 금지: 요청받지 않은 리팩토링, 주석 추가, 타입 어노테이션 금지

## GSC / Language

- siteUrl: `https://dopabrain.com/` (**`sc-domain:` = 403 에러**)
- GSC와 GA4를 같은 병렬 블록에 **절대 넣지 않는다** (연쇄 실패)
- 순서: ① GA4 → ② GSC (별도 블록)
- 응답: 한국어 / 코드 주석: 영어

## i18n (REQUIRED)

- **12개 언어 필수**: ko, en, zh, hi, ru, ja, es, pt, id, tr, de, fr
- 패턴: `js/i18n.js` + `js/locales/{lang}.json` + `data-i18n`
- **하드코딩 금지** — 모든 사용자 문자열은 i18n 경유
- **i18n IIFE는 반드시 try-catch** (loader 멈춤 방지) → `docs/I18N.md`

## Design

- Dark mode first, Glassmorphism 2.0, 44px touch targets
- 앱별 고유 primary color (중복 금지) → `docs/DESIGN.md`

## New App Checklist

- [ ] i18n 12개 언어 + app-loader (HTML div + CSS + JS hide)
- [ ] Dark mode first + `<script src="/portal/js/cross-promo.js" defer></script>` + GA4
- [ ] `.gitattributes` (`* text=auto eol=lf`)
- [ ] 배포: `git init` → commit → `gh repo create` → Pages → 루트에서 `git submodule add`
- [ ] 12개 언어 블로그 생성 (`blog-writer` 에이전트 위임)
- [ ] **품질 게이트 통과:** `bash scripts/quality-gate.sh projects/<name>` → PASS 필수
- [ ] 상세: `docs/VALIDATION.md`

## 작업 방식

- 리소스 배분: **게임 고도화 70% → SEO/CTR 20% → 신규 실험 10%**
- 우선순위: **유지보수 → 게임 고도화 → SEO → 확장**
- 세션 시작: `PROGRESS.md` 읽기 → (작업재개 시만) GA4/GSC → 작업 → `PROGRESS.md` 업데이트

## Project Context

**dopabrain.com** — 96개 앱/게임 (projects/), AdSense 수익화

## Agents & Rules

- **전문 에이전트** (`.claude/agents/`):
  - `redesigner` — 쿠키커터 리디자인 (worktree 격리)
  - `seo-analyst` — GA4/GSC 분석 (worktree 격리)
  - `builder` — 신규 앱 생성 (worktree 격리)
  - `blog-writer` — 12개 언어 SEO 블로그 생성 (worktree 격리)
  - `trend-scout` — 소셜 트렌드 스캔 (Reddit/Twitter/TikTok/YouTube)
- **조건부 규칙** (`.claude/rules/`): 게임/블로그/리디자인 경로 자동 로드
- **자동 위임:** 작업 유형 판단 → Agent tool `name` 파라미터로 에이전트 스폰
- **스킬:** `/submodule-check` — 96개 서브모듈 상태 일괄 점검

## Docs

`STRATEGY` `I18N` `DESIGN` `VALIDATION` `GAME-SPEC` `BLOG-SEO` `UX-DESIGN` `OPERATIONS` `MARKETING` — 모두 `docs/` 하위
