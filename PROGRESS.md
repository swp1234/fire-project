# DopaBrain current status

Updated: 2026-10-31 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-31)**: Policy violations 0 (`{}`). 오늘 **$0.06** (진행 중, 어제 실적 조기 달성), 어제 **$0.06**, 7일 누적 **$0.64** (일평균 $0.091, 지속 상승), 이달 누적 **$1.89**.
- GA4 실측 (최근 7일 / 28일): Organic Search 67 세션 중 54 Engaged (참여율 **80.6%**, 총 참여시간 **5,189s**, 세션당 평균 **96s**).
- 고체류 핵심 진입면: 2048 Coach 8,362s(28d), Future Self 1,686s, Stress Check 1,479s, HSP Test 1,115s, HSP Workplace Guide 758s.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 188s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-31) — 상세 설계: `docs/STRATEGY.md`

- **P0 영혼동물·색상심리 가이드 퍼널 정합화 & 모바일 터치 최적화 (완료)**: 12개어 24개 가이드 CTA/관련링크 목적지 불일치 해소(`/animal-personality/`, `/brain-type/`, `/attachment-style/` 직결), 터치 타깃 $\ge 44\text{px}$, 0px 오버플로.
- **P1 30초 반응형 CRO 스크리너 전방위 검증 (완료)**: 72개 가이드(플래시백·무감각·영합·야간과잉사고·반추·완벽주의 12개어) Playwright 69개 라우트 E2E ALL PASS.
- **P2 색인 인벤토리 & IndexNow 실시간 전송 (완료)**: 1,555개 URL 무결점(0 issue), 24개 갱신 URL IndexNow 200 OK 제출.

## Latest release: Funnel Bridge & 30s CRO Screeners (`portal ac6044a`, `root-domain 654844e`, `puzzle-2048 3875d37`)

- **영혼동물 & 색상심리 가이드 퍼널 복원 (12개 언어, `portal ac6044a`)**:
  - `spirit-animal-personality-quiz.html`: 두뇌유형으로 오연결되던 CTA/인라인/관련링크를 공식 활성 동물 테스트(`/animal-personality/?lang=*`)로 정상화, 진실된 라벨(`무료 수호 동물 테스트 시작하기 →` 등) 통일.
  - `what-your-favorite-color-says-about-you.html`: CTA 박스를 두뇌 인지유형 진단으로 정합화, 정지된 mbti-love 제거 후 `/attachment-style/` 및 `/animal-personality/`로 연결.
  - 상단 breadcrumb, header-nav, footer 링크 터치 규격 $\ge 44\text{px}$ 준수, 390x844 뷰포트 오버플로 0px 달성.
  - `blog/sitemap.xml` 2026-10-31 동기화 및 IndexNow 24개 URL 200 OK 제출.
- **30초 인터랙티브 CRO 스크리너 6개 신규 주제 12개어 배포 (`portal ac6044a`)**:
  - 플래시백(CPTSD), 감정무감각, 영합(Fawn), 야간과잉사고, 반추, 완벽주의 가이드 72편에 반응형 체크리스트 탑재.
  - `verify-screener-live.js`: Playwright 69개 검증 라우트 전원 PASS (0px 오버플로, $\ge 44\text{px}$ 터치, 0->1->4 상태 전환, `?lang=` 보존).
- **엄격 건강 상태 점검 (Health Guard Battery)**:
  - `indexing-inventory.js --strict`: 1,555개 URL 0 issues, sitemap_lastmod_mismatch 0건.
  - `audit-funnel.js`: 4,021개 파일 정지 링크 및 원격 측정 누출 0건.
  - `audit-registry.json`: `projects/portal` HEAD `ac6044a` 정합.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
