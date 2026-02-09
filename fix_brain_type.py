#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix brain-type by copying missing sections from en.json to de.json
"""

import json
from pathlib import Path

def fix_brain_type():
    app_dir = Path("E:/Fire Project/projects/brain-type")
    locales_dir = app_dir / "js" / "locales"

    # Read English version
    en_file = locales_dir / "en.json"
    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    # Fix de.json
    de_file = locales_dir / "de.json"
    with open(de_file, 'r', encoding='utf-8') as f:
        de_data = json.load(f)

    # Copy missing top-level sections from English
    sections_to_check = ['app', 'meta', 'intro', 'button', 'question', 'option', 'type', 'result', 'analyzing', 'message']

    fixed_keys = 0
    for section in sections_to_check:
        if section not in de_data and section in en_data:
            de_data[section] = en_data[section]
            print(f"Added section: {section}")
            fixed_keys += 1
        elif section in de_data and section in en_data:
            # Check for missing keys within section
            if isinstance(de_data[section], dict) and isinstance(en_data[section], dict):
                for key in en_data[section]:
                    if key not in de_data[section]:
                        de_data[section][key] = en_data[section][key]
                        print(f"Added key: {section}.{key}")
                        fixed_keys += 1

    # Write back with proper formatting
    with open(de_file, 'w', encoding='utf-8') as f:
        json.dump(de_data, f, ensure_ascii=False, indent=2)

    print(f"\nFixed de.json - added {fixed_keys} missing keys")

if __name__ == "__main__":
    fix_brain_type()
