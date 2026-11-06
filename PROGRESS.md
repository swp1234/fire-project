# DopaBrain current status

Updated: 2026-11-06 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-06)**: Policy violations 0 (`{}`). Active View CPM 기반 0클릭 수익 지속 및 전환 퍼널 정렬.
- GA4 실측: Organic Search 61 세션/7d, 핵심 고체류 진입면 (2048 Coach 414s, HSP Guide 300s, Dopamine Detox 231s, Future Self 130s, Stress Check 85s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-06) — 상세 설계: `docs/STRATEGY.md`

- **P0 전체 134단계 Harness Workflow 100% 녹색 완결 (완료)**: `npm run harness` 134단계 모든 정적/동적/변이/런타임 검증기(390px 모바일 터치, Auto Ads 계약, 데이터레이어 프라이버시, 서브모듈 포인터) 완전 무결점 통과.
- **P1 하네스 검증기 및 레거시 어설션 동기화 (완료)**: 20종 이상의 검증기(`sensory-reset`, `sensory-load-map`, `trauma-response`, `anxiety-type`, `zh-2048-guide`, `palworld-server-console`, `red-flag-retirement`, `seollal-retirement`, `clean-indexable-blog-ads`, `suspend-restricted-ad-projects`)의 URL 어트리뷰션(`source=`), 공백 멱등성 및 카탈로그 스키마 계약 동기화.
- **P2 서브모듈 원격 동기화 (완료)**: `portal`, `red-flag-test`, `trauma-response` 하위 저장소 커밋/푸시 및 루트 포인터 일치화.
- **P3 헬스 가드 & 퍼널 브릿지 전체 ALL PASS (완료)**: AdSense OAuth Keepalive, Auto Ads 단일 로더, 사이트맵/색인 인벤토리, 비밀값 0건, 문서 예산 통과.

## Latest release: Full 134-Step Harness Pass & Submodule Synchronization (`portal`, `red-flag-test`, `trauma-response`)

- **하네스 전 단계 134/134 PASS**: `scripts/harness-workflow-check.js` 및 모든 하위 도구/포털 검증기 100% 녹색 패스 달성.
- **서브모듈 안전 커밋 및 푸시**: `projects/portal`(카탈로그 쿼리 보존 및 중복 스크립트 정리), `projects/red-flag-test`(1.5KB 이하 경량화), `projects/trauma-response`(관련 카드 이벤트 위임 복원) 독립 원격 푸시 완료.
- **배치 도구 공백 멱등성 및 원격 런타임 안정화**: 무diff 공백 변경 방지 가드 적용 및 12개 언어권 감각 리셋/부하 지도 변이 통과.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
