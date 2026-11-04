# DopaBrain current status

Updated: 2026-11-04 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-04)**: Policy violations 0 (`{}`). 어제(11-03) **$0.04**, 7일 누적 **$0.39**, 30일 누적 **$1.73**. 오늘(11-04) **$0.02** 진행 중. Active View CPM 기반 0클릭 수익 지속.
- GA4 실측: Organic Search 61 세션/7d (Direct 제외), 핵심 고체류 진입면 (2048 Coach 414s, HSP Guide 300s, Dopamine Detox 231s, Future Self 130s, Stress Check 85s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-01) — 상세 설계: `docs/STRATEGY.md`

- **P0 도구 카탈로그·MBTI·감각 리셋·꿈해몽 전환 추적 통합 (완료)**: `portal/tools`, `portal/mbti`, `hsp-test`, `dream-fortune` GA4 `content_cta_click` 탑재 및 터치 규격 44px 준수.
- **P1 관계·감정 핵심 진입면 전환 어트리뷰션 확장 (완료)**: `attachment-style` & `emotion-iceberg` 상호 브릿지, `source` 파라미터 보존, GA4 `content_cta_click` 탑재.
- **P2 포털 도구 및 K-pop 생태계 전환 추적 표준화 (완료)**: `portal` dopamine-detox, kpop-role-roster, brain-game-workout, emotion-regulation-planner 및 `kpop-position` companion card i18n/추적 표준화.
- **P3 877개 포털 에디토리얼 글 FAQPage 구조화 데이터 전면 적용 (완료)**: 사이트맵 내 920개 검증 글 중 가시적 FAQ를 보유한 877개 글에 `FAQPage` 스키마 주입 완료 (`portal b6463a3`). SERP 리치 스니펫 획득 자격 부여.
- **P4 무결점 컴플라이언스 & 헬스 가드 통과 (완료)**: AdSense Auto Ads 단일 계약, OAuth keepalive, 터치 타깃 0 이슈, Health Guard ALL PASS.

## Latest release: Comprehensive Portal Editorial FAQPage Schema Expansion & Auto Ads Compliance (`portal b6463a3`, `projects/* 23 submodules`)

- **877개 핵심 에디토리얼 글 FAQPage 구조화 데이터 탑재**: `portal/blog/sitemap.xml` 내 가시적 Q&A가 존재하는 877개 다국어 아티클에 JSON-LD `FAQPage` 스키마 주입 완료. Google 검색 결과 리치 스니펫(FAQ 아코디언) 노출 극대화 및 CTR/E-E-A-T 신뢰도 강화.
- **가짜 카운트다운 게이트 및 수동 플레이스홀더 완전 박멸**: 6개 서브모듈의 5초 카운트다운 게이트 및 11개 서브모듈의 빈 광고 슬롯(`.ad-banner`, `.ad-placeholder`, `.result-ad-slot`) 완전 제거로 단일 Auto Ads 계약 100% 준수.
- **최고 체류면 퍼널 브릿지 및 중단 앱 제거**: 체류시간 414초의 `puzzle-2048` 게임오버 화면을 고수익 핵심 도구(`iq-test`, `brain-type`, `reaction-test`, `stress-check`)로 전환(12개 언어). `shadow-work`(`/future-self/`) 및 `ick-factor`(`/love-frequency/`) 중단 링크 제거.
- **품질 게이트 및 헬스 가드 통과**: 모든 하위 저장소 commit/push 완료, `audit-touch.js` 0px/0이슈, `audit-funnel.js`(4,034파일) PASS, `trust-audit.js --all`(119개) PASS, `audit-registry.json` 동기화 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
