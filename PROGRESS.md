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

- **P0 고RPM Tier-1 오가닉 퍼널 누수 차단 및 전환 최적화 (완료)**: 프랑스(#1 유입), 영어 고체류(Future Self 876s, HSP Workplace 687s), 일본 고체류(2048 Guide 416s) 가이드 내 무수익 정지앱 링크 퇴출 및 인터랙티브 30s 스크리너 탑재, 실시간 Auto Ads 앱(IQ, Stress, Future Self, Color Blindness, HSP) 직결, IndexNow 200 OK 제출 완료.
- **P1 GSC 미색인 진단 & IndexNow 7대 핵심면 브로드캐스트 (완료)**: 11/7 GSC 유효성 검사 미색인 원인 규명 및 7대 핵심 진입면 IndexNow 200 OK 재전송 완료.
- **P2 AdSense OAuth Keepalive 갱신 완료 (완료)**: OAuth 토큰 갱신 및 `accountsLoaded`, `policyIssuesLoaded (0건)` 정상화.
- **P3 헬스 가드 & 퍼널 브릿지 & 트러스트 감사 ALL PASS (완료)**: AdSense Keepalive 정상, 4,034개 파일 퍼널 감사 무결점, 119개 프로젝트 트러스트 ALL CLEAN, 134단계 Harness ALL PASS.

## Latest release: High-RPM Tier-1 Multilingual CRO & Auto Ads Alignment (`2026-11-12 Batch 2` @ `2026-11-12`)

- **고RPM Tier-1 오가닉 가이드 인터랙티브 스크리너 및 정식 Auto Ads 직결**:
  - `portal` (@ `53c9659`):
    - EN/ZH 2048 가이드(`number-puzzle-2048-tips.html`, `2048-strategy-guide.html`): 30s 전술 CRO 스크리너 탑재, 정지/무수익앱(`reaction-test`, `minesweeper`) 링크 퇴출, `puzzle-2048/coach.html`, `iq-test`, `stress-check` 직결.
    - DE/FR/ES/PT HSP 가이드(`am-i-highly-sensitive-person-signs.html`): 중복·허위 링크 전면 교체, 7개 정식 Auto Ads 앱(`hsp-test`, `reset`, `stress-check`, `attachment-style`, `future-self`, `iq-test`, `color-blindness`) 정밀 언어 파라미터(`?lang=`) 매핑.
    - US 고의도 `vulnerability-courage-connection-guide.html`: 30s Emotional Armor 스크리너 탑재, 정식 Auto Ads 앱 연결.
    - 사이트맵(`sitemap.xml`, `blog/sitemap.xml`) lastmod 2026-11-12 갱신 및 IndexNow 200 OK 즉시 전송.
- **Harness & Health Battery ALL PASS**: Health Guard, Funnel Bridge(4,034 파일), Touch Audit(0px overflow), Trust Audit ALL CLEAN.
- 사용자 자산 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` 100% 불변 보존.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
