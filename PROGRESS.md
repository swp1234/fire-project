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

- **P0 고RPM Tier-1 오가닉 퍼널 누수 차단 및 전환 최적화 (완료)**: 프랑스/독일/미국 고체류 가이드 내 무수익 정지앱 링크 퇴출 및 인터랙티브 30s 스크리너 탑재, 실시간 Auto Ads 앱(IQ, Stress, Future Self, Burnout, HSP) 직결, IndexNow 200 OK 제출 완료.
- **P1 GSC 미색인 진단 & IndexNow 브로드캐스트 (완료)**: 7대 핵심 진입면 및 신규 최적화 16개 가이드 IndexNow 200 OK 전송 완료.
- **P2 AdSense OAuth Keepalive 갱신 완료 (완료)**: OAuth 토큰 갱신 및 `accountsLoaded`, `policyIssuesLoaded (0건)` 정상화.
- **P3 헬스 가드 & 퍼널 브릿지 & 트러스트 감사 ALL PASS (완료)**: AdSense Keepalive 정상, 4,034개 파일 퍼널 감사 무결점, 1,557개 URL 인덱싱 감사 무결점, 119개 프로젝트 트러스트 ALL CLEAN.

## Latest release: Portal Tools & Assessment Bridges (`2026-11-12 Batch 18` @ `7522e7a`)

- **포털 고트래픽 툴 및 평가앱 간 2-Step Auto Ads 브릿지 직결**:
  - `cognitive-load-calculator`: GA4 54세션 상위 진입면의 브릿지 2번을 비수익 정적 툴에서 실시간 Auto Ads `/hsp-test/`로 교체, 12개 언어 다국어화 완료 (`7522e7a`).
  - `burnout-stress-differential`: GA4 75세션 상위 진입면의 브릿지 3번을 실시간 Auto Ads `/future-self/`로 교체, 12개 언어 다국어화 완료 (`c7c7ffa`).
  - `animal-personality` & `white-noise`: 정지앱 `brain-type`, `pomodoro-timer` 퇴출 -> `stress-type`, `future-self` 직결 완료 (`12ed4cd`, `95e18e9`).
  - `root-domain`: Root Focus 계약 불변성 보존 및 sitemap `lastmod` 2026-11-12 동기화 (`a59f796`).
  - IndexNow 200 OK 즉시 브로드캐스트 (`cognitive-load-calculator`, `burnout-stress-differential`, `animal-personality`, `white-noise`) 및 GSC 3대 사이트맵(1,564 URLs) 재제출 완료.
- **안전/컴플라이언스 전체 PASS**:
  - Health Guard 6개 게이트 통과, Funnel Bridge 4,034개 파일 무결점, 119개 프로젝트 감사 레지스트리 동기화, Portal 15개 툴 모바일 뷰포트(0px 오버플로, 44px 터치타깃) 검증 완료.
- 사용자 자산 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` 100% 불변 보존.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
