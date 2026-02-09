#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix kpop-position by using ko.json as reference (since en.json is incomplete)
"""

import json
from pathlib import Path

def fix_kpop():
    app_dir = Path("E:/Fire Project/projects/kpop-position")
    locales_dir = app_dir / "js" / "locales"

    # Read Korean version (complete reference)
    ko_file = locales_dir / "ko.json"
    with open(ko_file, 'r', encoding='utf-8') as f:
        ko_data = json.load(f)

    # Process all non-Korean languages
    for lang_file in sorted(locales_dir.glob("*.json")):
        lang = lang_file.stem
        if lang == 'ko':
            continue

        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)

        # Merge missing keys from ko
        def _deep_merge_missing(target, source):
            count = 0
            for key, value in source.items():
                if key not in target:
                    target[key] = value
                    count += 1
                elif isinstance(value, dict) and isinstance(target.get(key), dict):
                    count += _deep_merge_missing(target[key], value)
            return count

        fixed = _deep_merge_missing(lang_data, ko_data)

        if fixed > 0:
            # Write back
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(lang_data, f, ensure_ascii=False, indent=2)

            print(f"FIXED: kpop-position/{lang}.json - added {fixed} keys")
        else:
            print(f"OK: kpop-position/{lang}.json")

if __name__ == "__main__":
    fix_kpop()
