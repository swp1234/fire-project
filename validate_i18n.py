#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
i18n 동기화 검증 스크립트
모든 앱의 12개 언어 파일을 검증합니다.
"""

import os
import json
from pathlib import Path
from collections import defaultdict

# 검증할 12개 언어
REQUIRED_LANGUAGES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']

# 프로젝트 경로
PROJECTS_ROOT = r"E:\Fire Project\projects"

def get_json_keys(obj, prefix=""):
    """JSON 객체의 모든 키를 재귀적으로 추출"""
    keys = set()
    for key, value in obj.items():
        full_key = f"{prefix}.{key}" if prefix else key
        keys.add(full_key)
        if isinstance(value, dict):
            keys.update(get_json_keys(value, full_key))
    return keys

def load_locale_file(filepath):
    """locale JSON 파일 로드"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        return None

def validate_app(app_name):
    """앱의 i18n 파일 검증"""
    locale_dir = os.path.join(PROJECTS_ROOT, app_name, 'js', 'locales')

    if not os.path.exists(locale_dir):
        return {
            'status': 'MISSING_LOCALE_DIR',
            'app': app_name,
            'message': f'Locale directory not found: {locale_dir}'
        }

    # 각 언어의 파일과 키 로드
    lang_data = {}
    missing_files = []

    for lang in REQUIRED_LANGUAGES:
        filepath = os.path.join(locale_dir, f'{lang}.json')
        if not os.path.exists(filepath):
            missing_files.append(lang)
            continue

        data = load_locale_file(filepath)
        if data is None:
            return {
                'status': 'ERROR',
                'app': app_name,
                'language': lang,
                'message': f'Failed to load {lang}.json'
            }

        lang_data[lang] = {
            'data': data,
            'keys': get_json_keys(data)
        }

    # 누락된 파일 확인
    if missing_files:
        return {
            'status': 'MISSING_FILES',
            'app': app_name,
            'missing_languages': missing_files,
            'message': f'Missing locale files for: {", ".join(missing_files)}'
        }

    # ko.json을 기준으로 다른 언어와 비교
    if 'ko' not in lang_data:
        return {
            'status': 'NO_KOREAN',
            'app': app_name,
            'message': 'Korean (ko.json) file not found'
        }

    korean_keys = lang_data['ko']['keys']
    mismatches = {}

    for lang in REQUIRED_LANGUAGES:
        if lang == 'ko' or lang not in lang_data:
            continue

        lang_keys = lang_data[lang]['keys']
        missing = korean_keys - lang_keys
        extra = lang_keys - korean_keys

        if missing or extra:
            mismatches[lang] = {
                'missing': sorted(list(missing)),
                'extra': sorted(list(extra))
            }

    if mismatches:
        return {
            'status': 'KEY_MISMATCH',
            'app': app_name,
            'mismatches': mismatches,
            'message': f'Key mismatches found in {len(mismatches)} language(s)'
        }

    return {
        'status': 'OK',
        'app': app_name,
        'languages': len(lang_data),
        'keys': len(korean_keys),
        'message': f'All {len(lang_data)} languages synchronized with {len(korean_keys)} keys'
    }

def main():
    """메인 함수"""
    apps = sorted([d for d in os.listdir(PROJECTS_ROOT)
                   if os.path.isdir(os.path.join(PROJECTS_ROOT, d)) and d not in ['root-domain', 'portal']])

    print(f"Total {len(apps)} apps to validate...\n")

    results = {
        'ok': [],
        'errors': [],
        'warnings': []
    }

    for app in apps:
        result = validate_app(app)

        if result['status'] == 'OK':
            results['ok'].append(result)
            print(f"[OK] {app}: {result['message']}")
        elif result['status'] in ['MISSING_FILES', 'KEY_MISMATCH']:
            results['warnings'].append(result)
            print(f"[WARN] {app}: {result['message']}")
        else:
            results['errors'].append(result)
            print(f"[ERROR] {app}: {result['message']}")

    print(f"\n{'='*60}")
    print(f"Validation Summary")
    print(f"{'='*60}")
    print(f"OK: {len(results['ok'])} apps")
    print(f"Warnings: {len(results['warnings'])} apps")
    print(f"Errors: {len(results['errors'])} apps")

    if results['warnings']:
        print(f"\nWarning Details:")
        for result in results['warnings']:
            print(f"\n{result['app']}:")
            if result['status'] == 'MISSING_FILES':
                print(f"  Missing languages: {', '.join(result['missing_languages'])}")
            elif result['status'] == 'KEY_MISMATCH':
                for lang, mismatches in result['mismatches'].items():
                    if mismatches['missing']:
                        print(f"  {lang}: {len(mismatches['missing'])} missing keys")
                    if mismatches['extra']:
                        print(f"  {lang}: {len(mismatches['extra'])} extra keys")

    if results['errors']:
        print(f"\nError Details:")
        for result in results['errors']:
            print(f"  {result['app']}: {result['message']}")

if __name__ == '__main__':
    main()
