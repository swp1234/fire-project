#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix idle-clicker by copying missing sections from en.json to other languages
"""

import json
from pathlib import Path

def fix_idle_clicker():
    app_dir = Path("E:/Fire Project/projects/idle-clicker")
    locales_dir = app_dir / "js" / "locales"

    # Read English version (complete reference)
    en_file = locales_dir / "en.json"
    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    # Identify complete sections from English
    complete_sections = ['dungeon', 'monsters', 'skills', 'skill', 'ranks', 'equipment', 'milestones', 'tutorial']

    # Process all non-English languages except ko
    for lang_file in sorted(locales_dir.glob("*.json")):
        lang = lang_file.stem
        if lang in ['en', 'ko']:
            continue

        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)

        fixed_sections = []
        for section in complete_sections:
            if section not in lang_data and section in en_data:
                lang_data[section] = en_data[section]
                fixed_sections.append(section)

        if fixed_sections:
            # Write back
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(lang_data, f, ensure_ascii=False, indent=4)

            print(f"FIXED: idle-clicker/{lang}.json - added {len(fixed_sections)} sections: {', '.join(fixed_sections)}")
        else:
            print(f"OK: idle-clicker/{lang}.json - no missing sections")

if __name__ == "__main__":
    fix_idle_clicker()
