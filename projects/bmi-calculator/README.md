# BMI 계산기 💪

체질량지수(BMI)를 계산하고 건강 상태를 분석하는 무료 온라인 도구입니다.

## 기능

- **실시간 BMI 계산**: 키와 몸무게를 입력하면 즉시 BMI가 계산됩니다
- **단위 전환**: KG/CM ↔ LB/FT 단위 자동 변환
- **시각화**: 반원 게이지로 BMI 수치를 직관적으로 표시
- **건강 분류**: WHO 기준에 따른 4가지 체중 분류
  - 저체중 (< 18.5)
  - 정상 (18.5 - 24.9)
  - 과체중 (25.0 - 29.9)
  - 비만 (30.0+)
- **이상적 체중 범위**: 키에 따른 이상적 체중 범위 제시
- **건강 팁**: 각 분류별 맞춤형 건강 조언
- **계산 히스토리**: 최근 10개 계산 기록 저장
- **결과 공유**: SNS 공유 기능
- **다국어 지원**: 12개 언어 지원 (한국어, 영어, 중국어, 힌디어, 러시아어, 일본어, 스페인어, 포르투갈어, 인도네시아어, 터키어, 독일어, 프랑스어)

## 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PWA**: Service Worker, Manifest.json
- **Analytics**: Google Analytics 4 (GA4)
- **Ads**: AdSense/AdMob ready
- **i18n**: 12개 언어 다국어 지원
- **Storage**: LocalStorage (히스토리 저장)

## 파일 구조

```
bmi-calculator/
├── index.html           # 메인 HTML
├── manifest.json        # PWA 설정
├── sw.js               # Service Worker
├── README.md           # 이 파일
├── icon-192.svg        # PWA 아이콘 (192x192)
├── icon-512.svg        # PWA 아이콘 (512x512)
├── css/
│   └── style.css       # 스타일시트
├── js/
│   ├── app.js          # 메인 앱 로직
│   ├── i18n.js         # 다국어 관리
│   └── locales/        # 번역 파일
│       ├── ko.json     # 한국어
│       ├── en.json     # 영어
│       ├── zh.json     # 중국어
│       ├── hi.json     # 힌디어
│       ├── ru.json     # 러시아어
│       ├── ja.json     # 일본어
│       ├── es.json     # 스페인어
│       ├── pt.json     # 포르투갈어
│       ├── id.json     # 인도네시아어
│       ├── tr.json     # 터키어
│       ├── de.json     # 독일어
│       └── fr.json     # 프랑스어
```

## 설치 및 실행

### 로컬 개발

```bash
# 디렉토리 이동
cd projects/bmi-calculator

# Python http.server 사용
python -m http.server 8000

# http://localhost:8000 접속
```

### 배포

1. `index.html` 메타태그 업데이트
   - GA4 ID: `G-J8GSWM40TV`
   - AdSense ID: `ca-pub-3600813755953882`
   - Canonical URL 확인

2. 도메인에 배포
   - `https://dopabrain.com/bmi-calculator/`

## 설계 원칙

### 2026 UI/UX 트렌드 적용

1. **Glassmorphism 2.0**: 반투명 배경 + 블러 효과
2. **Microinteractions**: 호버 및 탭 애니메이션
3. **Dark Mode First**: 다크 배경 (#0f0f23)
4. **Minimalist Flow**: 깔끔한 레이아웃, 여유있는 공간
5. **Progress & Statistics**: 게이지를 통한 시각화
6. **Personalization**: LocalStorage에 언어/설정 저장
7. **Accessibility**: 48px+ 터치 타겟, 충분한 색상 대비

### 색상 팔레트

- **Primary**: #00b894 (건강 그린)
- **Background**: #0f0f23 (짙은 남색)
- **Accent**: #00d9a3 (밝은 그린)
- **Status Colors**:
  - 저체중: #3498db (파랑)
  - 정상: #00b894 (그린)
  - 과체중: #f39c12 (주황)
  - 비만: #e74c3c (빨강)

## API 및 외부 서비스

### Google Analytics 4 (GA4)

```javascript
// 이벤트 기록 예시
recordGA4Event('bmi_calculated', { bmi: 24.5 });
recordGA4Event('bmi_shared');
```

### i18n 사용법

```javascript
// 현재 언어 텍스트 가져오기
const text = i18n.t('bmi.heightLabel'); // "키"

// 언어 변경
await i18n.setLanguage('en');

// 현재 언어 확인
const lang = i18n.getCurrentLanguage(); // "en"
```

## 성능 최적화

- Service Worker를 통한 오프라인 지원
- Canvas를 사용한 효율적인 게이지 렌더링
- 번역 파일 지연 로딩
- 로컬 스토리지 최대 10개 기록 유지

## 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- 모바일 브라우저 (iOS Safari, Chrome Mobile 등)

## SEO 최적화

- Schema.org JSON-LD 구조화된 데이터
- Open Graph 메타태그
- hreflang 태그 (다국어 SEO)
- Robots 메타태그
- Canonical URL

## 라이센스

MIT License

## 개발자

DopaBrain - https://dopabrain.com

---

**마지막 업데이트**: 2026-02-10
**버전**: 1.0.0
