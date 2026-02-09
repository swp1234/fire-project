/**
 * I18n Module - Multi-language Support
 */

class I18n {
    constructor() {
        this.translations = {};
        this.supportedLanguages = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
        this.currentLanguage = this.detectLanguage();
        this.languageNames = {
            ko: '🇰🇷 한국어',
            en: '🇺🇸 English',
            zh: '🇨🇳 中文',
            hi: '🇮🇳 हिन्दी',
            ru: '🇷🇺 Русский',
            ja: '🇯🇵 日本語',
            es: '🇪🇸 Español',
            pt: '🇧🇷 Português',
            id: '🇮🇩 Bahasa Indonesia',
            tr: '🇹🇷 Türkçe',
            de: '🇩🇪 Deutsch',
            fr: '🇫🇷 Français'
        };
    }

    detectLanguage() {
        // Check localStorage
        const saved = localStorage.getItem('language');
        if (saved && this.supportedLanguages.includes(saved)) {
            return saved;
        }

        // Check browser language
        const browserLang = navigator.language.split('-')[0];
        if (this.supportedLanguages.includes(browserLang)) {
            return browserLang;
        }

        // Default to English
        return 'en';
    }

    async loadTranslations(lang) {
        if (this.translations[lang]) {
            return this.translations[lang];
        }

        try {
            const response = await fetch(`js/locales/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
            this.translations[lang] = await response.json();
            return this.translations[lang];
        } catch (e) {
            console.error(`Failed to load translations for ${lang}:`, e);
            // Fallback to English
            if (lang !== 'en') {
                return this.loadTranslations('en');
            }
            return {};
        }
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage] || {};

        for (const k of keys) {
            value = value[k];
            if (!value) return key; // Fallback to key if not found
        }

        return typeof value === 'string' ? value : key;
    }

    async setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Language ${lang} not supported`);
            return;
        }

        await this.loadTranslations(lang);
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updateUI();
    }

    updateUI() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update elements with data-i18n-attr attribute
        document.querySelectorAll('[data-i18n-attr]').forEach(element => {
            const key = element.getAttribute('data-i18n-attr');
            element.setAttribute('title', this.t(key));
        });

        // Update language menu
        this.updateLanguageMenu();
    }

    updateLanguageMenu() {
        const langMenu = document.getElementById('langMenu');
        if (!langMenu) return;

        langMenu.innerHTML = this.supportedLanguages
            .map(lang => `
                <button class="lang-option ${lang === this.currentLanguage ? 'active' : ''}"
                        data-lang="${lang}"
                        onclick="window.i18n.setLanguage('${lang}')">
                    ${this.languageNames[lang]}
                </button>
            `)
            .join('');
    }

    setupLanguageSelector() {
        const langBtn = document.getElementById('langBtn');
        const langMenu = document.getElementById('langMenu');

        if (!langBtn || !langMenu) return;

        langBtn.addEventListener('click', () => {
            langMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.add('hidden');
            }
        });

        this.updateLanguageMenu();
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getLanguageName(lang) {
        return this.languageNames[lang] || lang;
    }

    async initI18n() {
        // Load current language
        await this.loadTranslations(this.currentLanguage);

        // Load English as fallback
        if (this.currentLanguage !== 'en') {
            await this.loadTranslations('en');
        }

        // Setup language selector
        this.setupLanguageSelector();

        // Update UI
        this.updateUI();
    }
}

// Create global instance
window.i18n = new I18n();
