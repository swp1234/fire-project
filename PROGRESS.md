# DopaBrain current status

Updated: 2026-11-11 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-11)**: Policy violations 0 (`{}`). 오늘 **$0.05** (어제 $0.02 대비 상승, 오늘 RPM **$0.23**), 7일 **$0.30**, 30일 **$1.66**, Active View Viewability **60.66%**. Tier 1 실측 RPM (FR $3.52, NL $3.00, DE $2.47, US $0.64, CA $12.05).
- GA4 실측: Organic Search **72 세션/7d** (참여 48세션, 총 체류 3,038s), 고체류 진입면 (Color Blindness 332s, K-pop Roster 307s, Somatic Anxiety 225s, HSP Guide 196s, Stress Check 166s, Attachment Style 147s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test, Color Blindness, White Noise.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test, Color Blindness, White Noise).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-11) — 상세 설계: `docs/STRATEGY.md`

- **P0 GSC 미색인 진단 & IndexNow 7대 핵심면 브로드캐스트 (완료)**: 11/7 GSC 유효성 검사 실패(크롤링됨-미색인 552개) 원인 규명 및 7대 핵심 진입면 IndexNow 200 OK 재전송 완료.
- **P1 AdSense OAuth Keepalive 갱신 완료 (완료)**: OAuth 토큰 갱신 및 `accountsLoaded`, `policyIssuesLoaded (0건)` 정상화.
- **P2 고체류 핵심면(Color Blindness 332s) 전환 퍼널 탑재 & 사이트맵 등록 (완료)**: 결과 화면 `next-step-card` 탑재 (HSP/IQ 분기 연계), 12개 언어 i18n, 사이트맵 등록 및 IndexNow 200 OK.
- **P3 헬스 가드 & 퍼널 브릿지 & 트러스트 감사 ALL PASS (완료)**: AdSense Keepalive 정상, 4,034개 파일 퍼널 감사 무결점, 119개 프로젝트 트러스트 ALL CLEAN, 134단계 Harness ALL PASS.

## Latest release: High-Dwell Core Surface Monetization & Funnel Bridge (`2026-11-10 Batch` @ `2026-11-10`)

- **고체류 진입면 전환 퍼널 & E-E-A-T & 텔레메트리 전면 강화**:
  - `color-blindness` (@ `2d0529d`): 결과 화면 12개 언어 맞춤형 `next-step-card` 탑재 및 Web Share API·바이럴 챌린지 공유 연계, 엄격한 언어 보존(`?lang=`), 개인정보 보호 GA4 기술 메타데이터 정제, 관련 추천 허브 `/hsp-test/` 갱신.
  - `white-noise` (@ `e71e1ee`): 감각 과부하 완화 연계로 `hsp-test`를 관련 추천 그리드 및 12개 언어 번역에 정식 편입.
  - `root-domain` (@ `4cc0c88`): 고체류 핵심 진입면인 `color-blindness`, `white-noise`를 `sitemap.xml`에 등록, 색인 인벤토리 무결점 통과.
- **IndexNow 즉각 제출 200 OK**: `color-blindness`, `white-noise` 신규 제출 완료.
- **Health Guard & Harness 134단계 ALL PASS**: AdSense Keepalive, Auto Ads 계약, 비밀값 0건, 모바일 터치(390x844 오버플로 0px) 및 트러스트 감사 무결점.
- 사용자 자산 `attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` 완전 보존 원칙 100% 준수.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
