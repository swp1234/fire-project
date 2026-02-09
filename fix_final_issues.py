#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix final i18n issues
"""

import json
from pathlib import Path

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

def fix_app_from_ko(app_name):
    """Fix an app using its Korean locale as reference"""
    projects_dir = Path("E:/Fire Project/projects")
    app_dir = projects_dir / app_name
    locales_dir = app_dir / "js" / "locales"

    if not locales_dir.exists():
        return

    # Read ko.json as reference
    ko_file = locales_dir / "ko.json"
    if not ko_file.exists():
        return

    with open(ko_file, 'r', encoding='utf-8') as f:
        ko_data = json.load(f)

    # Fix all other languages
    for lang_file in sorted(locales_dir.glob("*.json")):
        lang = lang_file.stem
        if lang == 'ko':
            continue

        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)

        fixed = _deep_merge_missing(lang_data, ko_data)

        if fixed > 0:
            # Write back
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(lang_data, f, ensure_ascii=False, indent=2)

            print(f"  {app_name}/{lang}.json - added {fixed} keys")

def main():
    apps_to_fix = [
        'sky-runner',
        'stack-tower',
        'shopping-calc'
    ]

    print("Fixing final i18n issues:")
    print("="*60)

    for app_name in apps_to_fix:
        print(f"\nProcessing {app_name}...")
        fix_app_from_ko(app_name)

    print("\n" + "="*60)
    print("Done!")

if __name__ == "__main__":
    main()
