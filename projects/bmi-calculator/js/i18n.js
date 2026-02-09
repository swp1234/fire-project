// i18n - Internationalization Module

class I18n {
    constructor() {
        this.translations = {};
        this.supportedLanguages = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
        this.currentLang = this.detectLanguage();
    }

    // 브라우저 언어 감지 또는 저장된 언어 로드
    detectLanguage() {
        const saved = localStorage.getItem('selectedLanguage');
        if (saved && this.supportedLanguages.includes(saved)) {
            return saved;
        }

        const browserLang = navigator.language.split('-')[0];
        if (this.supportedLanguages.includes(browserLang)) {
            return browserLang;
        }

        return 'en'; // 기본값: 영어
    }

    // 번역 데이터 로드
    async loadTranslations(lang) {
        if (this.translations[lang]) {
            return this.translations[lang];
        }

        try {
            const response = await fetch(`js/locales/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}`);
            this.translations[lang] = await response.json();
            return this.translations[lang];
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            return {};
        }
    }

    // 번역 키로 텍스트 반환 (dot notation 지원)
    t(key) {
        const lang = this.currentLang;
        const translations = this.translations[lang] || {};

        const keys = key.split('.');
        let value = translations;

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // 번역이 없으면 키 반환
            }
        }

        return value || key;
    }

    // 언어 변경
    async setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.error(`Unsupported language: ${lang}`);
            return;
        }

        await this.loadTranslations(lang);
        this.currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);
        document.documentElement.lang = lang;
        this.updateUI();
    }

    // UI 텍스트 일괄 업데이트
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const translated = this.t(key);
            element.textContent = translated;
        });
    }

    // 현재 언어 반환
    getCurrentLanguage() {
        return this.currentLang;
    }

    // 언어명 반환
    getLanguageName(lang) {
        const names = {
            'ko': '한국어',
            'en': 'English',
            'zh': '中文',
            'hi': 'हिन्दी',
            'ru': 'Русский',
            'ja': '日本語',
            'es': 'Español',
            'pt': 'Português',
            'id': 'Bahasa Indonesia',
            'tr': 'Türkçe',
            'de': 'Deutsch',
            'fr': 'Français'
        };
        return names[lang] || lang;
    }

    // 초기화
    async initI18n() {
        await this.loadTranslations(this.currentLang);
        document.documentElement.lang = this.currentLang;
        this.updateUI();
    }
}

// 전역 인스턴스
const i18n = new I18n();
