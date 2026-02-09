class I18n {
    constructor() {
        this.translations = {};
        this.supportedLanguages = ['ko', 'en', 'ja', 'zh', 'es', 'pt', 'id', 'tr', 'de', 'fr', 'hi', 'ru'];
        this.currentLang = this.detectLanguage();
        this.isLoading = false;
    }

    detectLanguage() {
        // 로컬스토리지에서 저장된 언어 확인
        const saved = localStorage.getItem('preferredLanguage');
        if (saved && this.supportedLanguages.includes(saved)) {
            return saved;
        }

        // 브라우저 언어 감지
        const browserLang = navigator.language.split('-')[0].toLowerCase();
        if (this.supportedLanguages.includes(browserLang)) {
            return browserLang;
        }

        // 기본값: 한국어
        return 'ko';
    }

    async loadTranslations(lang) {
        if (this.isLoading) return;

        try {
            this.isLoading = true;

            if (this.translations[lang]) {
                this.isLoading = false;
                return this.translations[lang];
            }

            const response = await fetch(`js/locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language: ${lang}`);
            }

            const data = await response.json();
            this.translations[lang] = data;
            this.isLoading = false;
            return data;
        } catch (error) {
            console.error('Error loading translations:', error);
            this.isLoading = false;
            // 폴백: 한국어
            if (lang !== 'ko') {
                return this.loadTranslations('ko');
            }
        }
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        if (!value) {
            return key;
        }

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        return value || key;
    }

    async setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Unsupported language: ${lang}`);
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        await this.loadTranslations(lang);
        this.updateUI();
        this.updateLangButtons();
    }

    updateUI() {
        // data-i18n 속성이 있는 모든 요소 업데이트
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.t(key);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.placeholder) {
                    element.placeholder = text;
                }
            } else {
                element.textContent = text;
            }
        });
    }

    updateLangButtons() {
        document.querySelectorAll('.lang-option').forEach(btn => {
            if (btn.getAttribute('data-lang') === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getLanguageName(lang) {
        const names = {
            ko: '한국어',
            en: 'English',
            ja: '日本語',
            zh: '中文',
            es: 'Español',
            pt: 'Português',
            id: 'Bahasa Indonesia',
            tr: 'Türkçe',
            de: 'Deutsch',
            fr: 'Français',
            hi: 'हिन्दी',
            ru: 'Русский'
        };
        return names[lang] || lang;
    }

    async init() {
        await this.loadTranslations(this.currentLang);
        this.updateUI();
        this.updateLangButtons();
    }
}

// 전역 i18n 인스턴스 생성
const i18n = new I18n();
