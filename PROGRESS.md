# DopaBrain current status

Updated: 2026-11-07 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-07)**: Policy violations 0 (`{}`). 오늘 현재 **$0.01**, 어제 **$0.09**, 7일 누적 **$0.35**, 30일 누적 **$1.70**. Active View CPM 0클릭 수익 지속 및 전환 퍼널 정렬.
- GA4 실측: Organic Search **77 세션/7d** (참여 46세션, 총 체류 3,114s), AI Assistant 2세션 (322s), 고체류 진입면 (Color Blindness 332s, HSP Guide 192s, Attachment Style 147s, Emotion Management 133s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-07) — 상세 설계: `docs/STRATEGY.md`

- **P0 전체 134단계 Harness Workflow 100% 녹색 완결 (완료)**: `npm run harness` 134단계 모든 정적/동적/변이/런타임 검증기 무결점 통과.
- **P1 동적 크로스 프로모션 무효 트래픽 추천 봉쇄 (완료)**: `cross-promo.js` 내 운세/타로 토픽의 제한 대상 앱 추천을 핵심 도구(`future-self`, `stress-check`, `hsp-test`, `attachment-style`)로 전면 교체 및 29개 제한 앱 런타임 추천 필터링.
- **P2 언어 파라미터 유실 방지 및 다국어 보존 (완료)**: `color-blindness`, `biorhythm` 내 `delete('lang')` 패턴 제거, 글로벌 진입 시 언어 유지 보장.
- **P3 헬스 가드 & 퍼널 브릿지 & 트러스트 감사 ALL PASS (완료)**: AdSense OAuth Keepalive, Auto Ads 단일 로더, 사이트맵/색인 인벤토리, 비밀값 0건, 문서 예산, 4,034개 파일 퍼널 감사 통과.

## Latest release: Funnel Hardening & Dynamic Suspension Containment (`portal` @ `78c5569`)

- **동적 JS 추천 무효 트래픽 봉쇄 및 고체류 전환 극대화**:
  - `projects/portal/js/cross-promo.js`: 운세/타로/꿈 블로그 진입면 추천 목록을 비수익/제한 앱에서 고수익 4대 핵심 도구로 교체.
  - `isSuspendedApp` 가드로 29개 무효트래픽 제한 앱이 런타임 카테고리/인기 추천에 동적 노출되는 경로 차단.
- **글로벌 다국어 파라미터 엄격 보존**:
  - `projects/color-blindness/js/app.js` 및 `projects/biorhythm/index.html`: `delete('lang')` 제거하여 해외 방문자의 언어 유지 보장.
- **전 단계 134/134 PASS, Health Guard ALL PASS, Trust Audit 119개 무결점 검증 완결**.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
