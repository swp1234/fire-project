# DopaBrain current status

Updated: 2026-11-12 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-12)**: Policy violations 0 (`{}`). 어제 확정 **$0.06** (3배 성장), 7일 **$0.30**, 30일 **$1.64**, 이번달 MTD **$0.47**, Active View Viewability **60.66%**. Tier 1 실측 RPM (CA $6.77, DE $3.84, BE $2.97, US $2.34, FR $2.19).
- GA4 실측: Organic Search **72 세션/7d** (참여 48세션, 총 체류 3,038s), 고체류 진입면 (Future Self Guide 876s, HSP Workplace 687s, JA 2048 Guide 416s, Color Blindness 332s, K-pop Roster 307s, Somatic Anxiety 225s, HSP Guide 196s, Stress Check 166s).
- 고체류 핵심 진입면: Stress Check, HSP Test, Future Self, 2048 Coach, Brain Type, IQ Test, Color Blindness, White Noise.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test, Color Blindness, White Noise).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-12) — 상세 설계: `docs/STRATEGY.md`

- **P0 오가닉 바이럴 카드 엔진 도입 (진행중)**: 상위 체류 진입면(Future Self) 1080x1920 인스타그램 스토리/SNS 고해상도 카드 캔버스 생성기 구축, 12개 언어 다국어화 및 네이티브 공유 API 연동 완료 (`dcfab78`).
- **P1 고RPM Tier-1 오가닉 퍼널 전환 최적화 (완료)**: 영/프/독/일/중 고체류 가이드 내 30s 스크리너 탑재 및 핵심 Auto Ads 앱 직결.
- **P2 AdSense OAuth Keepalive 갱신 완료 (완료)**: OAuth 토큰 갱신 및 `accountsLoaded`, `policyIssuesLoaded (0건)` 정상화.
- **P3 헬스 가드 & 퍼널 브릿지 & 트러스트 감사 ALL PASS (완료)**: 4,034개 파일 퍼널 감사 무결점, 119개 프로젝트 트러스트 ALL CLEAN.

## Latest release: Viral Story Card & Monetization Bridges (`2026-11-12 Batch 20` @ `dcfab78`)

- **오가닉 바이럴 공유 카드 엔진 도입 (`future-self` @ `dcfab78`)**:
  - 체류 876초 1위 진입면 `future-self`에 1080x1920 고해상도 캔버스 기반 인스타그램/SNS 스토리 카드 생성기 구축.
  - 아키타입별 고유 네온 글로우, 이모지 배지, 3대 특성, 인용구 및 `dopabrain.com/future-self` 워터마크 자동 렌더링.
  - Web Share API 모바일 네이티브 파일 공유(인스타 스토리/사진앱 즉시 저장) 및 데스크톱 PNG 직접 다운로드 지원, 12개 언어 UI 대응.
  - `verify-future-self-funnel` 15/15 돌연변이 및 런타임 레이아웃(390px 오버플로 0px) ALL PASS.
- **포털 도구 고수익 평가앱 직결 정렬 (Batch 19 연계)**:
  - `cognitive-load-calculator` → `/hsp-test/`, `burnout-stress-differential` → `/future-self/`, `zh-2048-strategy-guide` 20/20 통과.
  - Health Guard 6개 게이트 통과, 4,034개 파일 퍼널 무결점, 119개 프로젝트 감사 레지스트리 동기화 완료.
- 사용자 자산 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` 100% 불변 보존.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
