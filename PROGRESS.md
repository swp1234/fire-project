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

- **P0 오가닉 바이럴 카드 & 고수익 파트너십 확장 (완료)**: `future-self`(`dcfab78`), `stress-check`(`23bc4b3`), `hsp-test`(`36ef100`) 3대 킬러앱 1080x1920 인스타 스토리 카드 캔버스 엔진 및 근거 기반 도서 큐레이션 슬롯 구축 완료.
- **P1 글로벌 소셜 런칭 카피 & 배포 템플릿 자산화 (완료)**: Reddit/Threads/X 맞춤형 바이럴 훅 및 가이드라인 구축 (`docs/MARKETING-VIRAL-HOOKS.md`).
- **P2 AdSense OAuth Keepalive 갱신 완료 (완료)**: OAuth 토큰 갱신 및 `accountsLoaded`, `policyIssuesLoaded (0건)` 정상화.
- **P3 헬스 가드 & 퍼널 브릿지 & 트러스트 감사 ALL PASS (완료)**: 4,034개 파일 퍼널 감사 무결점, 119개 프로젝트 트러스트 ALL CLEAN.

## Latest release: Complete Viral Growth & Monetization Engine (`2026-11-12 Batch 22` @ `36ef100`)

- **감각 프로필 바이럴 공유 카드 & 제휴 큐레이션 슬롯 (`hsp-test` @ `36ef100`)**:
  - `hsp-test`에 1080x1920 딥 바이올렛 흑요석 스타일 감각 프로필 카드 캔버스 렌더러 구축 (5대 감각 축 차트, 규제 인사이트, 워터마크).
  - Web Share API 네이티브 공유 및 PNG 다운로드, 12개 언어 다국어화 완료.
  - 근거 기반 도서 큐레이션 파트너 슬롯 탑재 (Elaine Aron, Jenn Granneman), nofollow/noopener 준수.
  - `verify-hsp-reset-funnel` 13/13 돌연변이 및 런타임 레이아웃(390px 오버플로 0px) ALL PASS.
- **3대 킬러앱 바이럴 캔버스 엔진 & 파트너십 구축 완료 (`future-self`, `stress-check`, `hsp-test`)**:
  - 방문자의 자발적 SNS 공유 유도(인스타 스토리/스레드) 루프 및 $0.02 단가 탈피용 도서 제휴 링크 완비.
- **글로벌 커뮤니티 배포 템플릿 자산화 (`docs/MARKETING-VIRAL-HOOKS.md`)**:
  - Reddit (`r/selfimprovement`, `r/mbti`, `r/hsp`), Threads, X 타겟별 비침습적 가치 중심 런칭 카피 완비.
- 사용자 자산 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` 100% 불변 보존.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
