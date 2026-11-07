# DopaBrain current status

Updated: 2026-11-07 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-07)**: Policy violations 0 (`{}`). 오늘 현재 **$0.01**, 어제 **$0.09**, 7일 누적 **$0.35**, 30일 누적 **$1.70**. Active View CPM 0클릭 수익 지속 및 전환 퍼널 정렬.
- GA4 실측: Organic Search **77 세션/7d** (참여 46세션, 총 체류 3,114s), AI Assistant 2세션 (322s), 고체류 진입면 (Color Blindness 332s, HSP Guide 192s, Attachment Style 147s, Emotion Management 133s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test, Color Blindness.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test, Color Blindness).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-07) — 상세 설계: `docs/STRATEGY.md`

- **P0 전체 134단계 Harness Workflow 100% 녹색 완결 (완료)**: `npm run harness` 134단계 모든 검증기 무결점 통과.
- **P1 동적 크로스 프로모션 무효 트래픽 추천 봉쇄 (완료)**: `cross-promo.js` 내 운세/타로 토픽 추천을 핵심 도구로 교체 및 29개 제한 앱 런타임 추천 필터링.
- **P2 색각 테스트 E-E-A-T 과학적 방법론 & FAQ 스키마 완비 (완료)**: `color-blindness` 판스워스-먼셀/이시하라 프레임워크 해설, 구간별 해석, 12개 언어 FAQ 및 JSON-LD FAQPage 연동.
- **P3 언어 파라미터 유실 방지 및 다국어 보존 (완료)**: `color-blindness`, `biorhythm` 내 `delete('lang')` 제거, 글로벌 언어 파라미터 보존.
- **P4 헬스 가드 & 퍼널 브릿지 & 트러스트 감사 ALL PASS (완료)**: AdSense OAuth Keepalive, Auto Ads 단일 로더, 비밀값 0건, 4,034개 파일 퍼널 감사 통과.

## Latest release: Color Blindness E-E-A-T Depth & Dynamic Suspension Hardening (`color-blindness` @ `b7a2d0b`, `portal` @ `78c5569`)

- **고체류 진입면 Color Blindness(체류 332s) E-E-A-T 신뢰도 강화**:
  - `projects/color-blindness/index.html`: 가짜 소셜 프루프(45,000+) 및 비근거 백분위(상위 1%) 제거, 베버-페히너 및 색차(Delta-E) 기반 과학적 측정 가이드 완비.
  - 12개 언어 i18n 동기화, 점수 구간별 해석, 4대 질문 FAQ 및 정식 `FAQPage` JSON-LD 구조화 데이터 적용.
- **동적 JS 추천 무효 트래픽 봉쇄 및 언어 보존**:
  - `cross-promo.js` 운세 토픽 고수익 4대 도구 전환, 29개 제한 앱 런타임 격리, `color-blindness`/`biorhythm` 언어 파라미터 엄격 보존.
- **전 단계 134/134 PASS, Health Guard ALL PASS, Trust Audit 119개 무결점 검증 완결**.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
