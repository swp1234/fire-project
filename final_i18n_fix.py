#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Final comprehensive fix for all remaining i18n issues
"""

import json
from pathlib import Path

def merge_missing_sections_from_reference(app_name, reference_lang='en'):
    """Copy all missing sections/keys from reference language"""
    projects_dir = Path("E:/Fire Project/projects")
    app_dir = projects_dir / app_name
    locales_dir = app_dir / "js" / "locales"

    if not locales_dir.exists():
        return 0

    # Read reference file
    ref_file = locales_dir / f"{reference_lang}.json"
    if not ref_file.exists():
        return 0

    with open(ref_file, 'r', encoding='utf-8') as f:
        ref_data = json.load(f)

    # Get all language files
    total_fixed = 0
    for lang_file in sorted(locales_dir.glob("*.json")):
        lang = lang_file.stem
        if lang in ['ko', reference_lang]:
            continue

        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)

        fixed = _deep_merge_missing(lang_data, ref_data)

        if fixed > 0:
            # Write back
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(lang_data, f, ensure_ascii=False, indent=2)

            print(f"  {app_name}/{lang}.json - added {fixed} keys")
            total_fixed += fixed

    return total_fixed

def _deep_merge_missing(target, source):
    """Recursively merge missing keys from source into target"""
    count = 0
    for key, value in source.items():
        if key not in target:
            target[key] = value
            count += 1
        elif isinstance(value, dict) and isinstance(target.get(key), dict):
            count += _deep_merge_missing(target[key], value)
    return count

def main():
    apps_to_fix = {
        'idle-clicker': 'en',
        'emotion-temp': 'en'
    }

    print("Final I18N Fix - Merging missing keys from reference languages:")
    print("="*60)

    for app_name, ref_lang in apps_to_fix.items():
        print(f"\nProcessing {app_name}...")
        merge_missing_sections_from_reference(app_name, reference_lang=ref_lang)

    print("\n" + "="*60)
    print("Done!")

if __name__ == "__main__":
    main()
