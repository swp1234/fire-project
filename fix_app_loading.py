#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix missing app.loading keys in all locale files
"""

import json
from pathlib import Path

# Translations for "Loading..."
LOADING_TRANSLATIONS = {
    'en': 'Loading...',
    'zh': '加载中...',
    'hi': 'लोड हो रहा है...',
    'ru': 'Загрузка...',
    'ja': '読み込み中...',
    'es': 'Cargando...',
    'pt': 'Carregando...',
    'id': 'Memuat...',
    'tr': 'Yükleniyor...',
    'de': 'Wird geladen...',
    'fr': 'Chargement...'
}

def fix_app_loading():
    projects_dir = Path("E:/Fire Project/projects")
    apps_fixed = []

    # Apps that need app.loading added
    apps_to_fix = [
        'color-memory', 'dday-counter', 'dream-fortune',
        'emoji-merge', 'hsp-test', 'kpop-position', 'love-frequency'
    ]

    for app_name in apps_to_fix:
        app_dir = projects_dir / app_name
        locales_dir = app_dir / "js" / "locales"

        if not locales_dir.exists():
            print(f"SKIP: {app_name} - no locales folder")
            continue

        # Read ko.json to verify it has app.loading
        ko_file = locales_dir / "ko.json"
        if not ko_file.exists():
            print(f"SKIP: {app_name} - no ko.json")
            continue

        with open(ko_file, 'r', encoding='utf-8') as f:
            ko_data = json.load(f)

        if 'loading' not in ko_data.get('app', {}):
            print(f"SKIP: {app_name} - ko.json doesn't have app.loading")
            continue

        # Fix all other language files
        for lang, loading_text in LOADING_TRANSLATIONS.items():
            lang_file = locales_dir / f"{lang}.json"
            if not lang_file.exists():
                continue

            with open(lang_file, 'r', encoding='utf-8') as f:
                lang_data = json.load(f)

            # Check if app.loading exists
            if 'app' not in lang_data:
                lang_data['app'] = {}

            if 'loading' not in lang_data['app']:
                lang_data['app']['loading'] = loading_text

                # Write back
                with open(lang_file, 'w', encoding='utf-8') as f:
                    json.dump(lang_data, f, ensure_ascii=False, indent=2)

                print(f"FIXED: {app_name}/{lang}.json - added app.loading")

        apps_fixed.append(app_name)

    print(f"\nTotal apps fixed: {len(apps_fixed)}")
    return apps_fixed

if __name__ == "__main__":
    fix_app_loading()
