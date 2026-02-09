# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> ⚠️ **중요**: 이 파일과 `.cursorrules`는 항상 동기화되어야 합니다.
> 규칙 업데이트 시 두 파일 모두 확인하고 일관성 유지할 것.

## 🔗 설정 파일 연동

| 파일 | 역할 | 동기화 |
|------|------|--------|
| `CLAUDE.md` | Claude AI 규칙 | ↔ .cursorrules와 동기화 |
| `.cursorrules` | Cursor AI 규칙 | ↔ CLAUDE.md와 동기화 |
| `PROGRESS.md` | 진행 상황 | 세션마다 업데이트 |

**규칙 추가/수정 시 반드시 두 파일 모두 업데이트**

---

## Project Overview

**10-Year Wealth Project: AI 기반 앱/게임/웹 수익 파이프라인**

This project uses AI tools (Cursor for development) to build copyright-free apps, games, and web services, generating passive income through advertising.

**Vision:** 10년 내 경제적 자유 달성 - 앱/게임/웹 3채널 광고 수익

**Core Strategy: 적게, 제대로, 빨리**
- 양산보다 **선택과 집중** (수익 가능성 높은 것에 올인)
- **게임**이 유틸 앱보다 광고 수익 5~10배 (체류시간 + 자연스러운 전면광고)
- **바이럴 가능한 앱** (SNS 공유 → 자연 유입)
- **웹 SEO** (Google 검색 유입 → AdSense 수익)
- **시즌 검색 유입** (연말정산, 퇴직금 등 시즌 트래픽)

**Roadmap:**
1. **Phase 1 (Now):** 기존 12개 앱 유지 + Google Play 출시 + 웹 포털 구축
2. **Phase 2:** 캐주얼 게임 개발 (수익의 메인 엔진)
3. **Phase 3:** 바이럴 테스트 앱/웹 개발 (유저 유입 채널)
4. **Phase 4:** 성공한 앱/웹 스케일업 → 수익 극대화

**수익 채널 3개:**

| 채널 | 플랫폼 | 광고 | 장점 |
|------|--------|------|------|
| **앱** | Google Play | AdMob | 앱스토어 검색 유입, 푸시알림 |
| **게임** | Google Play + 웹 | AdMob + AdSense | 높은 체류시간, 반복 플레이 |
| **웹** | GitHub Pages / Netlify | AdSense | SEO 검색 유입, 즉시 접근, 공유 쉬움 |

**수익 가능 콘텐츠 우선순위:**

| Tier | 유형 | 이유 | 예시 |
|------|------|------|------|
| **Tier 1** | 캐주얼 게임 | 체류시간 길고 광고 노출 많음 | 2048, Flappy Bird, 퍼즐 |
| **Tier 2** | 바이럴 테스트/웹 | SNS 공유로 자연 유입 | 심리테스트, 궁합, 전생 |
| **Tier 3** | SEO 유틸 웹 | Google 검색 유입 | 계산기, 변환기, 시뮬레이터 |
| **Tier 4** | 시즌 유틸 | 특정 시기 폭발적 검색 | 연말정산, 실업급여 계산기 |

### 🌐 웹 수익화 전략

> **기존 PWA 앱은 이미 웹 기반 → 웹 수익화와 자연스럽게 연결**

**1. 통합 포털 사이트 (메인 허브)**
- 모든 앱/게임/도구를 하나의 사이트에서 제공
- 사용자가 여러 도구를 탐색 → 페이지뷰 증가 → 광고 수익 증가
- 예: `firetools.kr` 또는 GitHub Pages 활용

**2. SEO 최적화 (검색 유입)**
- 각 도구/게임 페이지를 개별 랜딩 페이지로 SEO 최적화
- 타겟 키워드: "연말정산 계산기", "로또 번호 생성기", "MBTI 궁합" 등
- 검색 수요가 높은 키워드 중심으로 콘텐츠 보강
- 구조화된 데이터 (schema.org) 적용

**3. 바이럴 결과 페이지 (SNS 유입)**
- 테스트/퀴즈 결과를 고유 URL로 공유 가능하게 구현
- Open Graph 메타태그로 카카오톡/인스타 미리보기 최적화
- 결과 이미지 자동 생성 (Canvas → 이미지 다운로드/공유)

**4. 웹 게임 포털 (체류시간 극대화)**
- 여러 게임을 한 사이트에서 제공 (미니클립/Poki 스타일)
- 게임 간 상호 연결 (이 게임도 해보세요)
- 리더보드/랭킹 시스템으로 재방문 유도

**5. 웹 AdSense 수익 구조**

| 위치 | 유형 | 예상 RPM |
|------|------|----------|
| 사이드바/상단 | 디스플레이 배너 | $1~3 |
| 콘텐츠 사이 | 인피드 광고 | $2~5 |
| 게임 스테이지 사이 | 전면 광고 | $5~15 |
| 결과 페이지 | 네이티브 광고 | $3~8 |

**웹 수익화 핵심:**
- 앱과 웹 동시 운영 → 같은 코드로 2배 수익 채널
- 웹은 설치 장벽 없음 → 더 많은 사용자 접근
- SEO로 무료 트래픽 확보 가능 (광고비 0원)
- SNS 공유 시 웹 링크가 앱 링크보다 접근성 높음

## Team Roles

- **상우 (Sang-woo)**: Project lead
  - App/game architecture and development
  - AdMob SDK integration and optimization

## Shell Environment (CRITICAL)

> **이 프로젝트는 Windows에서 bash 셸(Git Bash)을 사용합니다.**
> **Windows 전용 명령어(del, dir, copy, move, cls, type)를 절대 사용하지 마세요.**

| 작업 | ✅ 사용 | ❌ 금지 |
|------|--------|---------|
| 파일 삭제 | `rm -f "path"` | `del`, `erase` |
| 폴더 삭제 | `rm -rf "path"` | `rmdir`, `rd` |
| 파일 목록 | `ls` | `dir` |
| 파일 복사 | `cp` | `copy`, `xcopy` |
| 파일 이동 | `mv` | `move` |
| 경로 구분자 | `/` (슬래시) | `\` (백슬래시, bash에서 이스케이프 문자) |

```bash
# 올바른 예시
rm -f "E:/Fire Project/파일.md"
rm -rf "E:/Fire Project/폴더/"
cp "E:/Fire Project/a.txt" "E:/Fire Project/b.txt"
ls "E:/Fire Project/projects/"
```

## 에러 학습 규칙 (CRITICAL)

> **한 번 에러가 발생한 명령어/패턴은 절대 반복하지 않는다.**
> **성공한 명령어를 기억하고, 같은 유형의 작업에는 성공 패턴을 재사용한다.**

### 학습된 성공 패턴

| 작업 | 성공 명령어 | 실패했던 명령어 |
|------|------------|---------------|
| 파일 삭제 | `rm -f "path"` | `del /Q` (bash에서 command not found) |
| Git 커밋 (서브모듈) | 서브모듈 내부에서 `git add -A && git commit && git push` | 루트에서 `git add projects/앱명/` (서브모듈 변경 감지 안 됨) |
| GSC 사이트 URL | `https://dopabrain.com/` | `sc-domain:dopabrain.com` (invalid URL 에러) |
| Git push | 서브모듈 내부에서 `git push` | 루트(`E:/Fire Project`)에서 `git push` (remote 없음) |
| CRLF 경고 방지 | 서브모듈에 `.gitattributes` 추가 (`* text=auto eol=lf`) | `.gitattributes` 없이 commit (LF/CRLF 경고 발생) |
| 웹 검색 | `WebFetch`로 특정 URL 크롤링 | `WebSearch` (이 환경에서 API 제한으로 사용 불가) |

### 규칙
- 명령어 실행 후 에러 발생 시, 성공한 대안을 즉시 위 표에 추가
- 동일 작업 재수행 시 반드시 위 표의 성공 패턴 사용
- 새로운 에러 유형 발견 시 이 섹션에 기록하여 영구 학습

## Development Commands

### 앱 로컬 테스트
```bash
# 특정 앱 로컬 서버 실행
cd projects/[앱폴더]
python -m http.server 8000
# http://localhost:8000 에서 확인

# 또는 직접 열기
start projects/[앱폴더]/index.html
```

## Architecture

### App/Game/Web Revenue Strategy

수익 모델: **3채널 광고 수익 (AdMob + AdSense)**

1. **기존 유틸 앱 (Day 1~12)** - 유지/관리, Google Play 출시 + 웹 포털 통합
2. **캐주얼 게임 (신규 개발)** - 수익의 핵심 엔진
   - 높은 체류 시간 → 많은 광고 노출
   - 스테이지/라운드 사이 자연스러운 전면 광고
   - 중독성 있는 게임플레이
   - 웹 + 앱 동시 배포
3. **바이럴 앱/웹 (신규 개발)** - 유저 유입 채널
   - SNS 공유 기능 필수
   - 결과 이미지/카드 생성
   - Open Graph 메타태그로 공유 미리보기 최적화
4. **웹 포털 (통합)** - SEO 기반 무료 트래픽
   - 모든 앱/게임을 하나의 사이트에서 접근
   - 검색 유입 → AdSense 수익

### Copyright Principles

**Critical**: All assets must be copyright-safe to avoid platform penalties:
- Use only fact-based knowledge and public data
- Leverage AI-generated assets
- No copyrighted images, text, or code

## 🎨 Design Principles (CRITICAL)

> **Every app MUST follow 2026 UI/UX trends with unique, non-overlapping design.**
> **References:** Calm, Headspace, Timefully, Wise, Revolut, Co-Star

### 📱 2026 UI/UX Trends (MUST APPLY)

1. **Glassmorphism 2.0** - Functional, not decorative (backdrop-filter: blur)
2. **Microinteractions** - Subtle hover/tap animations, ripple effects
3. **Dark Mode First** - Dark as default, light as option
4. **Minimalist Flow** - Generous white space, one action per screen
5. **Progress & Statistics** - Beautiful data visualization
6. **Personalization** - User preferences saved (LocalStorage)
7. **Accessibility** - Color contrast, 44px touch targets

### App-Specific Design Themes

| Day | App | Primary | Style | Reference |
|-----|-----|---------|-------|-----------|
| 1 | Quiz App | `#667eea` | Game/Quiz | Kahoot, Trivia Crack |
| 2 | Global Shopping Calc | `#f39c12` | Finance | Wise, Revolut |
| 3 | Digital Detox Timer | `#00b894` | Meditation | Calm, Headspace |
| 4 | AI Dream/Fortune | `#9b59b6` | Mystical | Co-Star, Pattern |
| 5 | Daily Affirmation | `#e91e63` | Emotional | Pinterest, Canva |
| 6 | Lottery Generator | `#e74c3c` | Luxury | Casino apps |
| 7 | D-Day Counter | `#3498db` | Minimal | Apple Calendar |
| 8 | MBTI Tips | `#1abc9c` | Social | 16Personalities |
| 9 | White Noise Player | `#2c3e50` | Sleep | Noisli, Rain Rain |
| 10 | Dev Quiz | `#27ae60` | Terminal | VS Code, GitHub |

### 📅 Day 11-20 아이디어 파이프라인

| Day | 앱 이름 | 설명 |
|-----|---------|------|
| 11 | 연말정산 미리보기 | 환급액 시뮬레이션 |
| 12 | 단위 변환기 Pro | 평수, 인치 등 생활 밀착형 변환 |
| 13 | 주식 평단가 계산기 | 물타기 수익률 계산기 |
| 14 | 웹 접근성 컬러 테스트 | 디자이너/개발자용 도구 |
| 15 | 오늘의 식단 추첨기 | 결정장애를 위한 메뉴 랜덤 추천 |
| 16 | 위드마크 음주 수치 계산기 | 사고 예방 및 정보 제공용 |
| 17 | 퇴직금/실업급여 계산기 | 노동법 기반 자동 산출 |
| 18 | 감성 텍스트 이모지 모음 | 특수문자 이모티콘 원클릭 복사 |
| 19 | 글자수/맞춤법 체크 | 자소서 및 포스팅용 간이 도구 |
| 20 | 디지털 수평계/나침반 | 자이로 센서 활용 유틸리티 |

### New App Checklist

- [ ] All 7 trends applied
- [ ] Unique primary color
- [ ] Reference app style checked
- [ ] 3+ microinteractions
- [ ] Dark mode first
- [ ] Statistics visualization
- [ ] Accessibility standards
- [ ] i18n 다국어 지원 적용 (12개 언어 필수)

---

## 🌍 i18n 다국어 지원 규칙 (REQUIRED)

> **모든 앱/게임은 반드시 12개 언어를 지원해야 함**

### 지원 언어 목록 (12개)

| 코드 | 언어 | 우선순위 | 비고 |
|------|------|----------|------|
| `ko` | 한국어 | 기본 | 메인 개발 언어 |
| `en` | English | 필수 | 글로벌 기본 |
| `zh` | 中文 | 필수 | 중국어 간체 |
| `hi` | हिन्दी | 필수 | 힌디어 (인도) |
| `ru` | Русский | 필수 | 러시아어 |
| `ja` | 日本語 | 필수 | 일본어 (높은 RPM) |
| `es` | Español | 필수 | 스페인어 (5억+ 화자) |
| `pt` | Português | 필수 | 포르투갈어 (브라질) |
| `id` | Bahasa Indonesia | 필수 | 인도네시아어 (2.7억) |
| `tr` | Türkçe | 필수 | 터키어 |
| `de` | Deutsch | 필수 | 독일어 (높은 RPM) |
| `fr` | Français | 필수 | 프랑스어 |

### i18n 구현 패턴 (표준)

모든 앱은 동일한 i18n 패턴을 사용:

```
project/
├── js/
│   ├── i18n.js          # I18n 클래스 (표준 템플릿)
│   └── locales/
│       ├── ko.json      # 한국어
│       ├── en.json      # English
│       ├── zh.json      # 中文
│       ├── hi.json      # हिन्दी
│       ├── ru.json      # Русский
│       ├── ja.json      # 日本語
│       ├── es.json      # Español
│       ├── pt.json      # Português
│       ├── id.json      # Bahasa Indonesia
│       ├── tr.json      # Türkçe
│       ├── de.json      # Deutsch
│       └── fr.json      # Français
├── index.html           # data-i18n 속성 + 언어 선택 메뉴
```

### I18n 클래스 표준 구조

```javascript
class I18n {
    constructor() {
        this.translations = {};
        this.supportedLanguages = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
        this.currentLang = this.detectLanguage();
    }
    detectLanguage() { /* localStorage → browser → 'en' */ }
    async loadTranslations(lang) { /* fetch locales/{lang}.json */ }
    t(key) { /* dot notation: 'app.title' → translations.app.title */ }
    async setLanguage(lang) { /* 언어 변경 + UI 갱신 */ }
    updateUI() { /* data-i18n 속성 자동 번역 */ }
    getCurrentLanguage() { return this.currentLang; }
    getLanguageName(lang) { /* 언어명 반환 */ }
}
```

### HTML 언어 선택기 표준 구조

```html
<div class="language-selector">
    <button id="lang-toggle">🌐</button>
    <div id="lang-menu" class="lang-menu hidden">
        <button class="lang-option" data-lang="ko">🇰🇷 한국어</button>
        <button class="lang-option" data-lang="en">🇺🇸 English</button>
        <button class="lang-option" data-lang="zh">🇨🇳 中文</button>
        <button class="lang-option" data-lang="hi">🇮🇳 हिन्दी</button>
        <button class="lang-option" data-lang="ru">🇷🇺 Русский</button>
        <button class="lang-option" data-lang="ja">🇯🇵 日本語</button>
        <button class="lang-option" data-lang="es">🇪🇸 Español</button>
        <button class="lang-option" data-lang="pt">🇧🇷 Português</button>
        <button class="lang-option" data-lang="id">🇮🇩 Indonesia</button>
        <button class="lang-option" data-lang="tr">🇹🇷 Türkçe</button>
        <button class="lang-option" data-lang="de">🇩🇪 Deutsch</button>
        <button class="lang-option" data-lang="fr">🇫🇷 Français</button>
    </div>
</div>
```

### 번역 품질 규칙

- 기계 번역이 아닌 자연스러운 현지어 사용
- 문화별 맥락 반영 (예: 일본어 です/ます体, 독일어 Sie형, 프랑스어 vous형)
- 앱별 도메인 용어 정확히 번역 (게임/금융/건강 등)
- JSON 키 구조는 모든 언어에서 동일하게 유지
- 새 기능 추가 시 모든 12개 언어 JSON에 키 추가 필수

### 블로그 다국어 규칙

- 블로그는 `portal/blog/{lang}/` 폴더에 작성
- 각 언어별 최소 3개 SEO 블로그 글 유지
- 문화별로 적절한 토픽 선택 (예: 일본-혈액형, 인도네시아-조디악)
- Schema.org, OG태그, hreflang 태그 필수 적용

---

### Key Components

**Quiz App (quiz-app/)**
- Tech Stack: HTML5, CSS3, Vanilla JavaScript
- PWA (Progressive Web App) enabled
- Mobile-responsive design
- Ad placements:
  - Top banner (AdSense ready)
  - Bottom banner (AdSense ready)
  - Interstitial ads (every 3 questions)
- Features:
  - 10 random questions per session
  - Score tracking
  - Visual feedback (correct/wrong)
  - Results screen

**File Structure:**
```
quiz-app/
├── index.html          # Main HTML with ad slots
├── manifest.json       # PWA configuration
├── css/style.css      # Responsive styles
├── js/
│   ├── app.js         # App logic
│   └── quiz-data.js   # Quiz questions (copyright-safe)
└── README.md
```

**향후 프로젝트 (예정)**
- 캐주얼 퍼즐 게임 (2048류, 워들류)
- 무한 러너/클리커 게임
- HTML5 Canvas 기반 게임
- 통합 포털 사이트 (모든 앱/게임 허브)
- 바이럴 테스트 웹 (SNS 공유 최적화)

## ⚡ 작업 효율화 규칙 (필수)

> **단순 반복 작업은 백그라운드로, 복잡한 작업은 병렬로 처리**

### 백그라운드 작업 규칙

**다음 작업은 반드시 백그라운드 에이전트(`run_in_background: true`)로 처리:**
- SEO 메타태그 적용 (앱별 독립)
- Git 저장소 생성/배포 (앱별 독립)
- 다국어 번역 적용 (파일별 독립)
- 기존 앱 버그 수정 (앱별 독립)
- 파일 구조 검증/리뷰 (읽기 전용)
- 아이콘/매니페스트 업데이트 (앱별 독립)

**백그라운드로 돌리면 안 되는 작업:**
- 새 앱/게임 핵심 로직 개발 (메인 에이전트가 직접)
- 같은 파일을 여러 에이전트가 수정하는 경우
- 사용자 확인이 필요한 설계 결정

### 병렬 처리 규칙

- **독립적인 앱/파일 작업**: 최대 4개 에이전트 동시 실행
- **동일 파일 수정 금지**: 충돌 방지를 위해 같은 파일은 순차 처리
- **결과 종합**: 모든 백그라운드 에이전트 완료 후 리더가 검증

---

## 🤖 Cursor Task 기반 병렬 작업 (Cursor 환경 최적화)

> **복잡한 작업 시 Cursor의 Task(서브에이전트) 기능을 활용하여 병렬 처리**
> ⚠️ Cursor는 Claude Code의 Team Agent와 다릅니다. 아래는 Cursor 환경에 맞춘 규칙입니다.

### Cursor Task 기능 요약

| 항목 | 사양 |
|------|------|
| 서브에이전트 타입 | `generalPurpose` (범용), `explore` (코드 탐색) |
| 최대 동시 실행 | **4개** |
| 모델 옵션 | `fast` (빠른 작업용) 또는 기본 모델 |
| 에이전트 간 통신 | 불가 (리더가 결과 종합) |
| 파일 수정 | generalPurpose만 가능, explore는 읽기 전용 |

### 병렬 Task 활용 조건

다음 작업 시 Task를 **병렬 실행**하여 효율성 향상:

| 작업 유형 | Task 구성 (최대 4개) | 목적 |
|----------|---------------------|------|
| **새 앱 개발** | 리더가 직접 개발 + explore Task로 레퍼런스 조사 | 개발하면서 동시 조사 |
| **앱 개선/리팩토링** | explore로 코드 분석 → 리더가 개선 | 분석 후 집중 개선 |
| **완성도 검증** | explore Task 2~3개로 각 영역 동시 검토 | 다각도 검증 |
| **버그 조사** | explore Task로 관련 코드 동시 탐색 | 빠른 원인 파악 |
| **코드베이스 파악** | explore Task 여러 개로 다른 영역 동시 탐색 | 빠른 컨텍스트 수집 |

### Task 활용 규칙

#### 1. 새 앱 개발 시
```
워크플로우:
1. explore Task로 기존 앱 구조/패턴 파악 (병렬)
2. explore Task로 참고할 디자인 트렌드 조사 (병렬)
3. 리더(메인 에이전트)가 직접 핵심 코드 작성
4. 완성 후 explore Task로 검증
```

#### 2. 기존 앱 개선 시
```
워크플로우:
1. explore Task 2~3개로 앱 코드 동시 분석 (HTML/CSS/JS 각각)
2. 리더가 분석 결과 종합하여 개선 계획 수립
3. 리더가 직접 코드 수정
4. 수정 후 검증
```

#### 3. 앱 검증 시 (배포 전 필수)
```
explore Task 병렬 실행 (최대 4개):
- Task 1: HTML 구조 및 파일 경로 검증
- Task 2: CSS 스타일 및 반응형 검증
- Task 3: JavaScript 로직 및 에러 검증
- Task 4: PWA 설정 및 접근성 검증

리더가 모든 결과 종합하여 최종 판단
```

#### 4. 버그 조사 시
```
explore Task 병렬 실행:
- Task 1: 관련 파일의 코드 흐름 추적
- Task 2: 유사한 패턴의 다른 파일 검색
- Task 3: 설정 파일 및 의존성 확인

리더가 결과 종합하여 원인 파악 및 수정
```

### 워크플로우 자동화

**작업 시작 시:**
1. 작업 유형 파악 → 필요한 Task 구성 결정
2. 독립적인 탐색/분석 작업은 explore Task로 병렬 실행
3. 코드 수정은 리더(메인 에이전트)가 직접 수행

**작업 진행 중:**
- explore Task 결과를 리더가 수집 및 종합
- 추가 조사 필요 시 새 Task 실행
- 코드 수정은 항상 리더가 담당 (일관성 유지)

**작업 완료 시:**
1. explore Task로 최종 검증
2. 검증 결과 종합
3. 사용자에게 결과 보고

### 주의사항

- **Task는 보조 역할**: 핵심 코드 작성은 리더(메인 에이전트)가 직접 수행
- **최대 4개 동시 실행**: 4개를 초과하면 안 됨
- **explore는 읽기 전용**: 파일 수정이 필요하면 generalPurpose 사용
- **비용 관리**: 단순 작업(1-2 파일 수정)은 Task 없이 직접 처리
- **결과 종합**: 각 Task의 결과는 리더가 종합하여 판단 (에이전트 간 직접 통신 불가)

### 실행 예시

**사용자가 "Day 11 앱 만들어줘" 요청 시:**
```
# Cursor 워크플로우:
1. explore Task로 기존 앱 패턴 분석 (병렬 2~3개)
2. 리더가 분석 결과 기반으로 설계
3. 리더가 직접 HTML/CSS/JS 파일 생성
4. explore Task로 완성도 검증 (병렬)
5. 리더가 검증 결과 반영하여 최종 수정
```

---

## Daily Development Workflow

### Mission Schedule
- **상우 (Sang-woo)**: Daily technical mission at 18:30
- All missions are recorded in MD files for tracking

### Day 1 Completed (2026.02.04)
- ✅ **Tech**: Quiz app skeleton built with AdSense ad placements
- ⏳ **Content**: WordPress trending post (pending)

## Progress Tracking System

**IMPORTANT**: Every session MUST follow this workflow:

### At Session Start
1. **Read `PROGRESS.md`** - Check current project status
2. **Read latest `records/YYYY-MM-DD_DayN_미션.md`** - Review last session's work
3. **Understand context** before starting new work
4. **🔍 MANDATORY: Review & Improve All Existing Apps**:
   - **매일 작업 재개 시 모든 프로젝트를 전체 검토**
   - Evaluate all apps (Day 1~10) for:
     - Bugs or errors
     - UX/UI issues
     - Missing features or incomplete functionality
     - Performance problems
     - Outdated content or data
   - Research current trends and successful apps for inspiration
   - Apply improvements to enhance user experience
   - **개선작업을 완료한 후** Google Play 출시 준비, 새 기능 추가 등 다른 작업 진행
   - **Important**: 개선사항을 앱에 반영하면 Google Play 자산/번역도 업데이트 필요함을 염두
   - Maintain existing user experience - avoid breaking changes

### During Session
1. **Update `PROGRESS.md`** when:
   - Completing a major task
   - Starting a new feature
   - Encountering blockers
   - Changing priorities

2. **Create daily mission record** in `records/` folder:
   - Format: `YYYY-MM-DD_DayN_미션.md`
   - Include: completed tasks, next steps, blockers

### On Project Completion (BEFORE Deployment!)
1. **🧪 Run self-testing & validation** (see checklist below)
2. Record test results in `records/` folder
3. Only deploy after ALL tests pass

### At Session End
1. **Update `PROGRESS.md`** with final status
2. **Save daily record** with complete summary
3. **Update this file (CLAUDE.md)** if architecture changes

### Git Commit Rules
- **NEVER add Co-authored-by trailer**
- Keep commit messages concise, message only
- Use `git commit -m "message"` format only
- **실시간 반영:** 작은 단위라도 개선/구현 완료 즉시 `git add . && git commit -m "메시지" && git push`
- 사용자가 실시간으로 변경사항을 확인할 수 있도록 지속적으로 push
- 대규모 작업도 중간중간 커밋 (완벽해질 때까지 기다리지 말 것)

---

## 🌍 i18n (다국어 지원) 프로세스 (REQUIRED)

> **모든 앱/게임/웹 프로젝트에 반드시 다국어 지원을 적용한다.**
> **i18n 미적용 프로젝트는 완성으로 인정하지 않는다.**

### 지원 언어 (최소 5개)

| 코드 | 언어 | 파일명 | 필수 |
|------|------|--------|------|
| `ko` | 한국어 | `js/locales/ko.json` | 필수 (기본) |
| `en` | English | `js/locales/en.json` | 필수 |
| `zh` | 中文 | `js/locales/zh.json` | 필수 |
| `hi` | हिन्दी | `js/locales/hi.json` | 필수 |
| `ru` | Русский | `js/locales/ru.json` | 필수 |

### i18n 구현 표준 구조

```
프로젝트/
├── js/
│   ├── i18n.js          # 다국어 로더 (공통 모듈)
│   └── locales/
│       ├── ko.json      # 한국어
│       ├── en.json      # English
│       ├── zh.json      # 中文
│       ├── hi.json      # हिन्दी
│       └── ru.json      # Русский
└── index.html           # 언어 선택기 포함
```

### i18n 적용 타이밍

| 시점 | 적용 내용 |
|------|-----------|
| **새 앱/게임 개발** | 개발 완료 직후 i18n 즉시 적용 |
| **기존 앱 수정** | UI 텍스트 변경 시 모든 locale 파일 동시 업데이트 |
| **블로그/웹 게시** | 게시 전 i18n 적용 확인 필수 |
| **Google Play 출시** | i18n 미적용 시 출시 불가 |

### i18n 적용 체크리스트

1. **`js/i18n.js` 로더 생성/확인**
   - `loadLocale(lang)` - JSON 파일 로드
   - `t(key)` - 번역 키 → 텍스트 반환
   - `setLanguage(lang)` - 언어 변경 + localStorage 저장
   - `initI18n()` - 초기화 (저장된 언어 또는 브라우저 언어 감지)

2. **`js/locales/*.json` 5개 언어 파일 생성**
   - 모든 사용자 대면 텍스트를 키-값 구조로 관리
   - 키 네이밍: `section.element` 형식 (예: `header.title`, `button.start`)

3. **`index.html` 언어 선택기 추가**
   - 상단 또는 설정 영역에 언어 드롭다운/버튼
   - `data-i18n="키"` 속성으로 텍스트 요소 마킹

4. **JS에서 동적 텍스트 처리**
   - `document.querySelectorAll('[data-i18n]')` 로 일괄 업데이트
   - JS로 생성되는 텍스트도 `t('key')` 사용

### 주의사항
- **게임**: 게임 내 UI 텍스트만 번역 (게임 로직은 언어 무관)
- **숫자/날짜**: `Intl.NumberFormat`, `Intl.DateTimeFormat` 사용
- **RTL 언어**: 현재 미지원 (향후 아랍어 추가 시 고려)
- **번역 품질**: AI 번역 사용, 추후 네이티브 검수 권장

---

## 🧪 Project Completion Validation (REQUIRED)

> **Every project MUST be validated by AI before deployment.**
> **This is NOT test code in the repo - AI performs validation directly.**

### Validation Checklist (AI performs this)

#### 1. Code Validation
- [ ] No HTML syntax errors
- [ ] No CSS syntax errors
- [ ] No JavaScript console errors
- [ ] All file paths correct (case-sensitive)

#### 2. Functionality Test
- [ ] Core features work correctly
- [ ] All buttons/links clickable
- [ ] Input fields work
- [ ] LocalStorage save/load works
- [ ] Error handling in place

#### 3. UI/UX Test
- [ ] Mobile responsive (360px ~ 480px)
- [ ] Desktop layout correct
- [ ] Dark mode displays properly
- [ ] Animations smooth
- [ ] Touch targets 44px+

#### 4. PWA Validation
- [ ] manifest.json valid
- [ ] Icons exist (192, 512)

#### 5. Ad Areas
- [ ] Top banner visible
- [ ] Bottom banner visible
- [ ] Interstitial logic works (if applicable)

#### 6. Accessibility
- [ ] Sufficient color contrast
- [ ] Readable font sizes
- [ ] Keyboard navigation possible

#### 7. i18n (다국어) Validation
- [ ] i18n.js 로더 파일 존재
- [ ] js/locales/ 폴더에 5개 언어 파일 존재 (ko, en, zh, hi, ru)
- [ ] 언어 선택기 UI 존재 (index.html)
- [ ] 모든 사용자 대면 텍스트가 i18n 키로 관리됨
- [ ] 언어 전환 시 모든 텍스트 정상 변경
- [ ] localStorage에 언어 설정 저장/복원

### Test Commands
```bash
# Open in browser
start index.html

# Local server test
python -m http.server 8000

# Check console errors: F12 → Console tab
```

### Record Test Results
Before deploy, briefly record in `records/`:
```
✅ Code: Pass
✅ Functionality: Pass
✅ UI/UX: Pass
✅ PWA: Pass
⚠️ Issues found: (if any)
```

### File Locations
- **PROGRESS.md** - Main progress tracker (always up-to-date)
- **records/YYYY-MM-DD_DayN_미션.md** - Daily session logs
- **프로젝트_계획.md** - Original project plan (reference only)

### Language Preference
- **All responses** must be in Korean (한글)
- **Code comments** can be in English for compatibility
- **Documentation** files in Korean for team readability

---

## 💰 수익 모델 전략 (내부 전략 - 절대 공개 금지)

> ⚠️ **이 섹션은 README, 공개 문서, 사용자 대면 텍스트에 절대 노출하지 않는다.**

### 수익 모델 다각화 (광고만으로는 한계)

> **광고는 기반 수입, 인앱결제/프리미엄이 메인 수입이 되어야 함**

| 수익 모델 | 설명 | 예상 비중 | 난이도 |
|-----------|------|-----------|--------|
| **광고 (AdMob/AdSense)** | 배너, 전면, 보상형 광고 | 기반 수입 | 쉬움 |
| **인앱 결제** | 광고 제거 (₩3,900), 프리미엄 기능 해금 | 메인 수입 | 중간 |
| **프리미엄 버전** | 무료앱 + 유료 Pro 버전 분리 | 보조 수입 | 중간 |
| **후원/팁** | "개발자 커피 사주기" 버튼 (Buy Me a Coffee 등) | 소소한 수입 | 쉬움 |
| **프리랜서/외주** | 쌓인 실력으로 외주 수주 | 안정적 수입 | 스킬 필요 |

### 인앱 결제 구현 전략

**1. 광고 제거 (모든 앱 공통)**
- 가격: ₩3,900 ~ ₩5,900 (일회성)
- "광고 없이 쾌적하게" 메시지
- 모든 앱에 기본 탑재

**2. 프리미엄 기능 해금 (앱별 차별화)**

| 앱 유형 | 무료 | 프리미엄 (₩2,900~) |
|---------|------|---------------------|
| 게임 | 기본 모드 | 추가 스테이지, 스킨, 아이템 |
| 퀴즈 | 10문제/회 | 무제한 + 카테고리별 도전 |
| 테스트 | 기본 결과 | AI 심층 분석 + 상세 리포트 |
| 계산기 | 기본 기능 | 고급 기능 + 히스토리 내보내기 |
| 타이머 | 기본 타이머 | 프리미엄 통계 + 위젯 |

**3. 보상형 광고 (게임 필수)**
- 게임 내 "광고 보고 생명 얻기", "광고 보고 힌트 얻기"
- 사용자가 자발적으로 광고 시청 → 높은 eCPM ($10~30)
- 전면 광고보다 사용자 경험 좋고 수익도 높음

### 프리미엄 콘텐츠 전략 (광고 시청 기반)

**핵심 원칙:** 가장 심도 있는 콘텐츠는 반드시 광고 시청 후 제공

| 유형 | 품질 | 접근 방식 |
|------|------|-----------|
| 무료 | 70% | 충분히 유용하지만 아쉬움 남김 |
| 프리미엄 | 100% | 광고 시청 또는 인앱 결제 후 |

**구현 방식:**
1. "AI 심층 분석" 또는 "더 자세히 보기" 버튼 추가
2. 클릭 → 전면 광고 표시 (5초 카운트다운) 또는 프리미엄 구매 유도
3. 광고 완료/결제 → 프리미엄 결과 표시
4. 버튼 디자인: 골드/프리미엄 느낌으로 눈에 띄게

**모든 앱 필수 적용:**
- 꿈해몽: AI 심층 해석
- 운세/타로: AI 개인화 리딩
- 퀴즈: 상세 해설 + 학습 팁
- 타이머: 프리미엄 통계
- 계산기: 고급 기능
- 게임: 추가 콘텐츠, 스킨, 보너스
- **앞으로 만드는 모든 앱/게임에 적용**

### 글로벌 시장 전략 (한국어만으로는 시장이 작음)

> **한국 인구 5,100만 vs 영어권 15억+ → 글로벌이 30배 큰 시장**

**단계적 글로벌화:**
1. **Phase 1:** 한국어 우선 출시 → 검증
2. **Phase 2:** 영어 번역 추가 (i18n 이미 Day 1~3에 적용)
3. **Phase 3:** 일본어, 중국어 추가 (아시아 시장)
4. **Phase 4:** 성과 좋은 앱만 추가 언어 지원

**글로벌화 시 주의:**
- 게임은 언어 의존도 낮아 글로벌화 쉬움 (Tier 1 이점)
- 유틸 앱은 국가별 제도 차이 고려 (세금 계산기 등)
- 바이럴 테스트는 문화별 커스터마이징 필요

### 데이터 기반 의사결정 (필수)

> **감이 아니라 숫자로 판단**

**모든 앱/웹에 반드시 적용:**
- Google Analytics 4 연동 (무료)
- 핵심 지표 추적: DAU, 체류시간, 이탈률, 전환율
- **월 1회 성과 리뷰** → 성과 좋은 것에 집중, 안 되는 것은 과감히 정리

**의사결정 기준:**
| 지표 | 집중 투자 | 유지 | 정리 |
|------|-----------|------|------|
| 월 활성 사용자 | 1,000+ | 100~999 | 100 미만 |
| 평균 체류시간 | 3분+ | 1~3분 | 1분 미만 |
| 재방문율 | 20%+ | 5~20% | 5% 미만 |

### 5년 수익 목표 (현실적)

| 시기 | 월 목표 | 핵심 마일스톤 |
|------|---------|---------------|
| 1년차 | 5~10만원 | Google Play 출시, 웹 포털, 게임 1개 |
| 2년차 | 20~50만원 | 히트 게임/앱 1개, 인앱 결제 도입 |
| 3년차 | 50~150만원 | 글로벌 확장, 수익 모델 다각화 |
| 4년차 | 150~300만원 | 포트폴리오 성숙, 복리 효과 |
| 5년차 | 300~500만원 | 안정적 수동 수입 + 프리랜서 병행 |

### 완성 기준 (강화)
- 프리미엄 콘텐츠가 없으면 앱 완성으로 보지 않음
- 인앱 결제(광고 제거) 미구현 시 Google Play 출시 불가
- Google Analytics 미연동 시 배포 불가
- **i18n 미적용 시 앱/웹 완성으로 보지 않음**

---

## AI 자율 성장 & 지속적 개선 (REQUIRED)

> **매 세션 시작 시 참고 자료를 확인하고 적용 가능한 개선사항을 즉시 실행**

### 목적별 가이드 (docs/)
| 파일 | 용도 | 참조 에이전트 |
|------|------|-------------|
| `docs/GAME-SPEC.md` | 게임 기획/개발 바이블 | 게임 개발 에이전트 |
| `docs/BLOG-SEO.md` | 블로그 작성 + SEO + 시즌 키워드 | 블로그/SEO 에이전트 |
| `docs/UX-DESIGN.md` | UX 개선 + 2026 트렌드 + 심리법칙 | UX 개선 에이전트 |
| `docs/OPERATIONS.md` | 자율 운영 + 성장 루프 + 병렬 관리 | 리더/코디네이션 |
| `docs/MARKETING.md` | 마케팅 + SNS + Google Play 출시 | 마케팅/배포 에이전트 |

### 자율 운영 원칙 (Master Directive)
> 매 세션 시작 시 PROGRESS.md를 분석하여 자율적으로 목표를 설정하고 보고한다.
> 우선순위: **유지보수 → 성장(SEO) → 최적화(UX) → 확장(다국어)**
> **자율 연속 운영:** 작업 완료 시 사용자 확인 없이 다음 목표를 즉시 설정하고 진행한다.
> 수익화를 향해 지속적으로 전진. 멈추지 않는다.

### Daily AI Growth Loop (매 세션 적용)
1. **데이터 수집:** GA4/GSC MCP로 트래픽/인덱싱 현황 확인
2. **분석:** 유입 감소 원인, 체류시간 저조 페이지, 트렌드 키워드 파악
3. **최적화:** SEO 개선, 콘텐츠 업데이트, UI 변경, 신규 콘텐츠 생성
4. **배포:** 변경사항 push, IndexNow 제출, 사이트맵 업데이트

### 자가 점검 (작업 완료 시)
- 오늘 작업이 '도파민 증대'라는 서비스 본질에 기여했는가?
- 수동 반복 작업 중 자동화한 부분은 무엇인가?
- 26개 앱 전체의 일관성을 유지하고 있는가?
- 내일의 에이전트가 이 로그를 보고 바로 이어갈 수 있는가?

### 지속적 리서치 체크리스트 (필요시 수행)
- GitHub Trending - 새로운 에이전트 프레임워크/도구 확인
- Anthropic Blog - Claude 신기능 확인 및 활용
- Google Search Central - SEO 알고리즘 변경 확인
- 게임/앱 마켓 트렌드 - 수익화 전략 변화 확인

### 핵심 구현 원칙
- **Agentic Workflow:** 계획→실행→검토→수정 루프 (한 번에 끝내려 하지 말 것)
- **Tool Use 최대 활용:** MCP 서버(GA4/GSC)로 외부 데이터 실시간 조회
- **병렬 처리:** 독립적 작업은 Task 에이전트로 병렬 실행 (최대 4개)
- **데이터 기반 의사결정:** 감이 아닌 GA4/GSC 숫자로 판단

---

## Google Search Console (GSC) 사용 규칙

> **GSC API 호출 시 반드시 아래 siteUrl을 사용할 것**

| 항목 | 값 |
|------|-----|
| **siteUrl** | `https://dopabrain.com/` |
| **잘못된 값 (사용 금지)** | `sc-domain:dopabrain.com` |

- `sc-domain:` 형식은 도메인 속성 등록 시 사용되지만, 이 프로젝트는 URL 접두어(`https://dopabrain.com/`)로 등록됨
- `sc-domain:dopabrain.com` 사용 시 **403 에러** 발생
- `index_inspect`, `search_analytics`, `list_sitemaps` 등 모든 GSC API 호출에 동일 적용

---

## Project Completion Status

### 현재 배포 현황 (2026-02-10)

| 카테고리 | 앱/게임 | 상태 |
|---------|--------|------|
| **유틸 (Day 1-12)** | 12개 | ✅ 배포 (Google Play 출시 준비) |
| **바이럴 테스트** | 5개 | ✅ 배포 (emotion-temp, hsp-test, mbti-love, past-life, kpop-position) |
| **캐주얼 게임** | 6개 | ✅ 배포 (sky-runner, stack-tower, emoji-merge, idle-clicker, zigzag-runner + color-memory) |
| **신규 테스트** | 3개 | ✅ 배포 (brain-type, reaction-test, valentine) |
| **신규 게임** | 2개 | ✅ 배포 (number-puzzle, typing-speed + 추가 진행 중) |
| **웹 포털** | 1개 | ✅ 배포 (portal + root-domain 랜딩) |
| **블로그** | 110개+ | ✅ 작성 (한국어 10 + 다국어 49 + 신규 30+) |
| **총계** | 32개+ 앱/게임 | **✅ 전체 배포 완료** |

### 세션24 신규 추가

| 앱 | 타입 | 설명 | 배포 |
|----|------|------|------|
| Brain Type | 테스트 | 두뇌 유형 8가지 분석 | ✅ |
| Color Memory | 게임 | Simon Says 메모리 게임 | ✅ |
| Reaction Test | 테스트 | 반응속도 측정, 등급시스템 | ✅ |
| Number Puzzle | 게임 | 2048 변형, 4x4 그리드 | ✅ |
| Typing Speed | 테스트 | 타이핑 속도 WPM 측정 | ✅ |

## Notes

- Project started: 2026.02.04
- Primary tools: Cursor (development), Claude Code (단독 작업)
- Revenue streams: AdMob (앱) + AdSense (웹) - 3채널 (앱/게임/웹)
- 기존 앱: 12개 (Day 1~12) - 고도화 + Google Play 출시 준비
- 신규 앱: 20개+ (게임 6, 바이럴 테스트 5, 신규 테스트 3, 신규 게임 5, 포털 1)
- 총 프로젝트: 32개+ 배포 완료 (dopabrain.com)
- 신규 개발 방향: 캐주얼 게임 + 바이럴 테스트 + 웹 포털 + 다국어 콘텐츠
- Long-term goal: Economic freedom through passive income within 10 years
