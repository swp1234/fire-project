# CLAUDE.md

> 핵심 규칙만. 상세는 `docs/` 참조.

## Shell & Environment (CRITICAL)

Windows + Git Bash. **Windows 명령어 절대 금지.**
- `rm -f`, `ls`, `cp`, `mv` 사용 (`del`, `rmdir`, `dir`, `copy`, `move` 금지)
- 경로: `/` 슬래시만 (`\` 금지)
- CRLF 방지: `.gitattributes` (`* text=auto eol=lf`)

## Git (CRITICAL)

- **Co-authored-by 절대 금지** — `git commit -m "message"` 만
- 서브모듈 내부에서 commit/push (루트 `E:\Fire Project`는 remote 없음)
- 서브모듈 vs 일반 디렉토리 혼재 — `git ls-tree HEAD`로 확인
- 작은 단위라도 즉시 commit & push

## GSC / Language

- siteUrl: `https://dopabrain.com/` (**`sc-domain:` = 403 에러**)
- 응답: 한국어 / 코드 주석: 영어

## i18n (REQUIRED)

- **12개 언어 필수**: ko, en, zh, hi, ru, ja, es, pt, id, tr, de, fr
- 패턴: `js/i18n.js` + `js/locales/{lang}.json` + `data-i18n`
- **i18n IIFE는 반드시 try-catch** (loader 멈춤 방지) → `docs/I18N.md`

## Design

- Dark mode first, Glassmorphism 2.0, 44px touch targets
- 앱별 고유 primary color (중복 금지) → `docs/DESIGN.md`

## New App Checklist

- [ ] i18n 12개 언어 + app-loader (HTML div + CSS + JS hide)
- [ ] Dark mode first + `<script src="/portal/js/cross-promo.js" defer></script>` + GA4
- [ ] 상세: `docs/VALIDATION.md`

## 작업 방식

- **병렬 에이전트(Task tool) 적극 활용** (최대 4개, 같은 파일 동시 수정 금지)
- 우선순위: **유지보수 → SEO → UX → 확장**
- 세션 시작: `PROGRESS.md` 읽기 → GA4/GSC 확인 → 작업 → `PROGRESS.md` 업데이트

## Project Context

**dopabrain.com** — 61개 앱/게임 (projects/), AdMob + AdSense 3채널 수익

## Docs

`STRATEGY` `I18N` `DESIGN` `VALIDATION` `GAME-SPEC` `BLOG-SEO` `UX-DESIGN` `OPERATIONS` `MARKETING` — 모두 `docs/` 하위
