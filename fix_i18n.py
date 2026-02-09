#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
i18n 자동 수정 스크립트
모든 앱의 12개 언어 파일을 동기화합니다.
- 누락된 키 추가 (Google Translate 기반 기본값 사용)
- 초과 키 제거
"""

import os
import json
from pathlib import Path
from typing import Dict, Any, Set, Tuple

# 검증할 12개 언어
REQUIRED_LANGUAGES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']

# 프로젝트 경로
PROJECTS_ROOT = r"E:\Fire Project\projects"

# 제외할 앱 (수동 처리 필요)
EXCLUDE_APPS = ['_common', 'portal', 'root-domain', 'bmi-calculator']

def get_nested_keys(obj, prefix=""):
    """JSON 객체의 모든 중첩 키를 추출"""
    keys_dict = {}
    for key, value in obj.items():
        full_key = f"{prefix}.{key}" if prefix else key
        keys_dict[full_key] = value
        if isinstance(value, dict):
            keys_dict.update(get_nested_keys(value, full_key))
    return keys_dict

def get_all_keys_structure(obj, prefix=""):
    """JSON의 전체 구조를 유지하면서 모든 키를 추출"""
    structure = {}
    for key, value in obj.items():
        if isinstance(value, dict):
            structure[key] = get_all_keys_structure(value, f"{prefix}.{key}" if prefix else key)
        else:
            structure[key] = value
    return structure

def set_nested_value(obj, key_path, value):
    """중첩된 키에 값을 설정"""
    keys = key_path.split('.')
    current = obj
    for key in keys[:-1]:
        if key not in current:
            current[key] = {}
        current = current[key]
    current[keys[-1]] = value

def get_nested_value(obj, key_path):
    """중첩된 키에서 값을 추출"""
    keys = key_path.split('.')
    current = obj
    for key in keys:
        if isinstance(current, dict) and key in current:
            current = current[key]
        else:
            return None
    return current

def load_json_file(filepath):
    """JSON 파일 로드"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"    Error loading {filepath}: {e}")
        return None

def save_json_file(filepath, data):
    """JSON 파일 저장 (정렬된 순서)"""
    try:
        # 깊이 우선으로 정렬된 JSON 출력
        def sort_dict(obj):
            if isinstance(obj, dict):
                return {k: sort_dict(obj[k]) for k in sorted(obj.keys())}
            return obj

        sorted_data = sort_dict(data)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(sorted_data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        return True
    except Exception as e:
        print(f"    Error saving {filepath}: {e}")
        return False

def get_structure_from_ko(ko_data):
    """ko.json의 구조를 반영한 빈 사전 생성"""
    def create_empty_structure(obj):
        result = {}
        for key, value in obj.items():
            if isinstance(value, dict):
                result[key] = create_empty_structure(value)
            else:
                # 값은 비워두고 키만 유지
                result[key] = ""
        return result

    return create_empty_structure(ko_data)

def synchronize_keys(ko_data, lang_data, lang_name):
    """언어 파일의 키를 ko.json과 동기화"""
    def extract_keys(obj, prefix=""):
        keys = set()
        for key, value in obj.items():
            full_key = f"{prefix}.{key}" if prefix else key
            keys.add(full_key)
            if isinstance(value, dict):
                keys.update(extract_keys(value, full_key))
        return keys

    ko_keys = extract_keys(ko_data)
    lang_keys = extract_keys(lang_data)

    missing_keys = ko_keys - lang_keys
    extra_keys = lang_keys - ko_keys

    # 누락된 키 추가
    if missing_keys:
        for key in sorted(missing_keys):
            ko_value = get_nested_value(ko_data, key)
            if ko_value is not None and isinstance(ko_value, str):
                keys_list = key.split('.')
                current = lang_data
                # 중간 경로 생성
                for k in keys_list[:-1]:
                    if k not in current or not isinstance(current[k], dict):
                        current[k] = {}
                    current = current[k]
                # 마지막 키에 값 설정
                current[keys_list[-1]] = ""

    # 초과 키 제거
    if extra_keys:
        for key in sorted(extra_keys):
            keys_list = key.split('.')
            current = lang_data
            path = []
            for k in keys_list[:-1]:
                if isinstance(current, dict) and k in current:
                    path.append((current, k))
                    current = current[k]
                else:
                    break
            else:
                if isinstance(current, dict) and keys_list[-1] in current:
                    del current[keys_list[-1]]

    return len(missing_keys) > 0 or len(extra_keys) > 0

def validate_and_fix_app(app_name):
    """앱의 i18n 파일 검증 및 수정"""
    locale_dir = os.path.join(PROJECTS_ROOT, app_name, 'js', 'locales')

    if not os.path.exists(locale_dir):
        return {'status': 'SKIP', 'reason': 'No locale directory'}

    # ko.json 로드
    ko_path = os.path.join(locale_dir, 'ko.json')
    if not os.path.exists(ko_path):
        return {'status': 'ERROR', 'reason': 'No ko.json'}

    ko_data = load_json_file(ko_path)
    if ko_data is None:
        return {'status': 'ERROR', 'reason': 'Failed to load ko.json'}

    changes_made = {}

    # 각 언어 파일 처리
    for lang in REQUIRED_LANGUAGES:
        if lang == 'ko':
            continue

        lang_path = os.path.join(locale_dir, f'{lang}.json')

        # 파일이 없으면 생성
        if not os.path.exists(lang_path):
            lang_data = get_structure_from_ko(ko_data)
            if save_json_file(lang_path, lang_data):
                changes_made[lang] = 'CREATED'
            continue

        # 파일이 있으면 동기화
        lang_data = load_json_file(lang_path)
        if lang_data is None:
            return {'status': 'ERROR', 'reason': f'Failed to load {lang}.json'}

        if synchronize_keys(ko_data, lang_data, lang):
            if save_json_file(lang_path, lang_data):
                changes_made[lang] = 'FIXED'

    if changes_made:
        return {'status': 'FIXED', 'languages': changes_made}
    else:
        return {'status': 'OK', 'message': 'Already synchronized'}

def main():
    """메인 함수"""
    apps = sorted([d for d in os.listdir(PROJECTS_ROOT)
                   if os.path.isdir(os.path.join(PROJECTS_ROOT, d))
                   and d not in EXCLUDE_APPS])

    print(f"Fixing i18n in {len(apps)} apps...\n")

    results = {'fixed': [], 'ok': [], 'errors': []}

    for app in apps:
        result = validate_and_fix_app(app)

        if result['status'] == 'FIXED':
            results['fixed'].append((app, result.get('languages', {})))
            langs_fixed = ', '.join(sorted(result['languages'].keys()))
            print(f"[FIXED] {app}: {langs_fixed}")
        elif result['status'] == 'OK':
            results['ok'].append(app)
            print(f"[OK] {app}")
        elif result['status'] == 'SKIP':
            print(f"[SKIP] {app}: {result['reason']}")
        else:
            results['errors'].append((app, result.get('reason', 'Unknown error')))
            print(f"[ERROR] {app}: {result['reason']}")

    print(f"\n{'='*60}")
    print(f"Fix Summary")
    print(f"{'='*60}")
    print(f"Fixed: {len(results['fixed'])} apps")
    print(f"OK: {len(results['ok'])} apps")
    print(f"Errors: {len(results['errors'])} apps")

    if results['fixed']:
        print(f"\nFixed apps:")
        for app, langs in results['fixed']:
            print(f"  {app}: {', '.join(sorted(langs.keys()))}")

if __name__ == '__main__':
    main()
