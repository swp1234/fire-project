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

- **P0 자율 AI 검색(GEO) 배포 & IndexNow 즉각 송출 (완료)**: IndexNow API(Bing/ChatGPT Search) 즉시 색인 송출 200 OK, `llms.txt`/`llms-full.txt` AI 전용 표준 최적화 (`658524e`), 3대 킬러앱 공개 깃허브 학술 쇼케이스 리드미 완비.
- **P1 오가닉 바이럴 카드 & 고수익 파트너십 확장 (완료)**: `future-self`, `stress-check`, `hsp-test` 3대 킬러앱 1080x1920 인스타 스토리 카드 캔버스 엔진 및 도서 큐레이션 슬롯 구축.
- **P2 글로벌 소셜 런칭 카피 & 배포 템플릿 자산화 (완료)**: Reddit/Threads/X 맞춤형 바이럴 훅 및 가이드라인 구축 (`docs/MARKETING-VIRAL-HOOKS.md`).
- **P3 헬스 가드 & 퍼널 브릿지 ALL PASS (완료)**: 4,034개 파일 퍼널 무결점, 119개 프로젝트 감사 레지스트리 동기화.

## Latest release: Autonomous GEO & Open-Source Distribution (`2026-11-12 Batch 23` @ `c1cc310`)

- **IndexNow API 즉각 색인 송출 (Bing & ChatGPT Search 네트워크 200 OK)**:
  - `stress-check/`, `hsp-test/`, `future-self/` 정규 URL 즉시 색인 네트워크 API 송출 완료.
- **AI 검색 최적화(GEO) 엔진 구축 (`projects/root-domain` @ `658524e`)**:
  - `llms.txt` 및 `llms-full.txt`에 1080x1920 스토리 카드, 학술 프레임워크(PSS-10, DOES), 로컬 프라이버시 스펙 명시.
- **공개 GitHub 오픈소스 쇼케이스 리드미 완비 (AI 학습/인용 소스 확보)**:
  - `future-self`(`f552260`), `stress-check`(`d3f1f1c`), `hsp-test`(`c1cc310`)에 라이브 링크, 학술 인용(APA), 배지 탑재.
- 사용자 자산 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` 100% 불변 보존.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
