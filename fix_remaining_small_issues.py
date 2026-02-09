#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix remaining small issues
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

def main():
    projects_dir = Path("E:/Fire Project/projects")

    # Fix lottery - copy missing Turkish type.lotto from ko
    print("Fixing lottery...")
    app_dir = projects_dir / "lottery"
    locales_dir = app_dir / "js" / "locales"

    with open(locales_dir / "ko.json", 'r', encoding='utf-8') as f:
        ko_data = json.load(f)

    with open(locales_dir / "tr.json", 'r', encoding='utf-8') as f:
        tr_data = json.load(f)

    fixed = _deep_merge_missing(tr_data, ko_data)
    if fixed > 0:
        with open(locales_dir / "tr.json", 'w', encoding='utf-8') as f:
            json.dump(tr_data, f, ensure_ascii=False, indent=2)
        print(f"  Fixed lottery/tr.json - added {fixed} keys")

    # Fix root-domain - copy missing languages section from ko
    print("\nFixing root-domain...")
    app_dir = projects_dir / "root-domain"
    locales_dir = app_dir / "js" / "locales"

    with open(locales_dir / "ko.json", 'r', encoding='utf-8') as f:
        ko_data = json.load(f)

    for lang_file in sorted(locales_dir.glob("*.json")):
        lang = lang_file.stem
        if lang == 'ko':
            continue

        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)

        fixed = _deep_merge_missing(lang_data, ko_data)

        if fixed > 0:
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(lang_data, f, ensure_ascii=False, indent=2)
            print(f"  Fixed root-domain/{lang}.json - added {fixed} keys")

    print("\nDone!")

if __name__ == "__main__":
    main()
