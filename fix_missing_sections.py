#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix missing sections by copying from a reference language (usually 'en' or 'ko')
"""

import json
from pathlib import Path

def copy_missing_keys_from_reference(app_name, reference_lang='en', target_langs=None):
    """Copy missing keys from reference language to target languages"""
    projects_dir = Path("E:/Fire Project/projects")
    app_dir = projects_dir / app_name
    locales_dir = app_dir / "js" / "locales"

    if not locales_dir.exists():
        print(f"SKIP: {app_name} - no locales folder")
        return False

    # Read reference file
    ref_file = locales_dir / f"{reference_lang}.json"
    if not ref_file.exists():
        print(f"SKIP: {app_name} - no {reference_lang}.json")
        return False

    with open(ref_file, 'r', encoding='utf-8') as f:
        ref_data = json.load(f)

    if target_langs is None:
        # Get all language files except the reference
        target_langs = [
            f.stem for f in locales_dir.glob("*.json")
            if f.stem != reference_lang and f.stem != 'ko'
        ]

    fixed_count = 0
    for lang in target_langs:
        lang_file = locales_dir / f"{lang}.json"
        if not lang_file.exists():
            continue

        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)

        # Deep merge missing keys from reference
        def merge_missing(target, source, path=''):
            for key, value in source.items():
                if key not in target:
                    target[key] = value
                    print(f"  ADD {path}.{key}" if path else f"  ADD {key}")
                    fixed_count = fixed_count + 1
                elif isinstance(value, dict) and isinstance(target.get(key), dict):
                    merge_missing(target[key], value, f"{path}.{key}" if path else key)

        # This approach doesn't work as a function return, let me rewrite
        fixed_keys = _merge_missing(lang_data, ref_data)

        if fixed_keys > 0:
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(lang_data, f, ensure_ascii=False, indent=2)
            print(f"FIXED: {app_name}/{lang}.json - merged {fixed_keys} missing keys")
            fixed_count += fixed_keys

    return fixed_count > 0

def _merge_missing(target, source, path=''):
    """Recursively merge missing keys from source into target"""
    count = 0
    for key, value in source.items():
        if key not in target:
            target[key] = value
            count += 1
        elif isinstance(value, dict) and isinstance(target.get(key), dict):
            count += _merge_missing(target[key], value, f"{path}.{key}" if path else key)
    return count

def main():
    # Apps with specific missing sections
    apps_to_fix = {
        'detox-timer': 'en',  # hero section missing in non-en, non-ko
        'dev-quiz': 'en',     # game.loading missing in de
        'emotion-temp': 'en',  # title section missing in de
        'white-noise': 'en',   # game section missing
        'zigzag-runner': 'en'  # recommendations.colorMemory missing
    }

    total_fixed = 0
    for app_name, ref_lang in apps_to_fix.items():
        if copy_missing_keys_from_reference(app_name, reference_lang=ref_lang):
            total_fixed += 1

    print(f"\nTotal apps fixed: {total_fixed}")

if __name__ == "__main__":
    main()
