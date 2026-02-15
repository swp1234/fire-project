# DopaBrain Blog & SEO Guide

> 블로그 작성/SEO 에이전트는 이 파일만 참조하면 됨

---

## 1. 블로그 작성 규칙

### 필수 HTML 요소
- Schema.org (Article + FAQPage)
- Open Graph 메타태그
- hreflang 태그
- GA4: `gtag.js` (G-측정ID)
- AdSense: `ca-pub-3600813755953882`
- 내부 링크 3개+ (관련 앱 + 다른 블로그)
- 목차 (Table of Contents)
- CTA 버튼 (관련 앱 이동)
- FAQ 섹션 (3개+ Q&A)
- 최소 2000자 (한국어), 1500자 (영문)

### 다국어 블로그 규칙
- 12개 언어별 지속적으로 블로그 추가
- 위치: `portal/blog/{lang}/`
- 문화별 적절한 토픽 선택
- 각 언어 최소 5개 블로그 목표
- 기존 블로그 구조 참고하여 동일 패턴 사용

### 블로그 배포 체크리스트
1. HTML 파일 생성 (`portal/blog/` 또는 `portal/blog/{lang}/`)
2. 사이트맵 2개 업데이트 (`portal/sitemap.xml` + `root-domain/sitemap.xml`)
3. git commit + push
4. IndexNow API 제출 (선택)

## 2. SEO 전략

### 키워드 전략
- 시즌 키워드 선점 (2개월 전 콘텐츠 준비)
- 롱테일 키워드 우선 (경쟁 낮고 전환율 높음)
- DopaBrain 앱과 자연스럽게 연결

### 내부 링크 구조
- 블로그 ↔ 앱 양방향 링크
- 블로그 ↔ 블로그 크로스링크 ("이것도 읽어보세요")
- 포털에서 블로그 노출

### SGE (AI 검색) 최적화
- Schema.org 구조화 데이터 필수
- FAQ 섹션으로 답변형 검색 대응
- 명확한 H1/H2 구조

## 3. 국가별 시즌 키워드

| 국가 | 시기 | 키워드 | 콘텐츠 유형 |
|------|------|--------|------------|
| 한국 | 1~2월 | 연말정산, 설날 | 계산기, 운세 |
| 한국 | 5월 | 종합소득세, 가정의달 | 계산기, 선물 |
| 미국 | 1~4월 | Tax Season | 계산기 |
| 미국 | 8~9월 | Back to School | 퀴즈, 성격테스트 |
| 일본 | 3~4월 | 벚꽃, 신학기 | 성격테스트 |
| 일본 | 8월 | 오본 | 운세, 전생 |
| 중국 | 1~2월 | 춘절 | 운세, 게임 |
| 중국 | 11월 | 광군제 | 쇼핑 계산기 |
| 글로벌 | 2월 | 발렌타인 | 궁합, 연애 |
| 글로벌 | 10월 | 할로윈 | 전생, 심리 |
| 글로벌 | 12월 | 크리스마스 | 운세, 연말 |

### 시점 역산 원칙
- 시즌 피크 2개월 전에 콘텐츠 작성
- 인덱싱 + 랭킹에 4~8주 필요
- 예: 8월 Back to School → 6월에 블로그 작성

## 4. 트렌드 모니터링 리소스

- [Google Trends](https://trends.google.com/trends/yis/) - 국가별 인기 키워드
- [Pinterest Trends](https://trends.pinterest.com/) - 취향 기반 시즈널
- [Forekast](https://forekast.com/) - 실시간 글로벌 이슈
- Google Search Central Blog - SEO 알고리즘 변경

## 5. 현재 블로그 현황

> **최신 수치는 PROGRESS.md 참조.** 아래는 Session 59 기준.

| 언어 | 개수 | 주요 성과 |
|------|------|----------|
| EN | 88 | 최다 — free-games, blood-type 등 GSC 노출 |
| JA | 35 | 2048 GSC 클릭, +게임가이드/HSP/로또/sky-runner |
| ZH | 29 | HSP, 조디악, 게임 가이드, habit-tracker |
| ES | 26 | PAS(HSP), Pong, 색상팔레트, serpiente |
| KO | 20 | 제곱미터 평수 검색어 대응 블로그 |
| FR | 19 | **CTR 12-20% 최고 성과** — jeux-navigateur 3클릭 |
| HI | 19 | |
| RU | 19 | |
| PT | 15 | |
| ID | 15 | |
| TR | 15 | |
| DE | 13 | |
