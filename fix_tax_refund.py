#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix tax-refund-preview by properly syncing locale files
The app has both ko.json (detailed) and en.json (concise)
All other languages should follow ko.json structure with proper translations
"""

import json
from pathlib import Path

def fix_tax_refund():
    app_dir = Path("E:/Fire Project/projects/tax-refund-preview")
    locales_dir = app_dir / "js" / "locales"

    # Read both Ko and En
    ko_file = locales_dir / "ko.json"
    en_file = locales_dir / "en.json"

    with open(ko_file, 'r', encoding='utf-8') as f:
        ko_data = json.load(f)

    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    # The structure should be based on ko.json (more complete)
    # All non-ko, non-en languages should follow this structure
    # Fill in missing keys from en translations where applicable

    def merge_language_structure(target_lang_data, reference_ko, reference_en, lang_name):
        """
        For each section in reference_ko:
        - Keep existing target_lang_data keys
        - For missing keys, use reference_en translation if exists
        - Otherwise use reference_ko as fallback
        """
        merged = {}

        for section, content in reference_ko.items():
            if section == 'languages':
                # Keep language names
                merged[section] = target_lang_data.get(section, reference_ko.get(section, {}))
            elif isinstance(content, dict):
                merged[section] = {}
                en_section = reference_en.get(section, {})
                target_section = target_lang_data.get(section, {})

                for key, value in content.items():
                    if isinstance(value, dict):
                        # Nested dict (like form fields descriptions)
                        merged[section][key] = {}
                        for sub_key, sub_value in value.items():
                            if key in target_section and sub_key in target_section[key]:
                                # Use existing translation
                                merged[section][key][sub_key] = target_section[key][sub_key]
                            elif key in en_section and sub_key in en_section[key]:
                                # Use English as fallback
                                merged[section][key][sub_key] = en_section[key][sub_key]
                            else:
                                # Use Korean as last resort
                                merged[section][key][sub_key] = sub_value
                    else:
                        # Simple string
                        if key in target_section:
                            merged[section][key] = target_section[key]
                        elif key in en_section:
                            merged[section][key] = en_section[key]
                        else:
                            merged[section][key] = value
            else:
                merged[section] = target_lang_data.get(section, content)

        return merged

    # Process all languages except ko and en
    for lang_file in sorted(locales_dir.glob("*.json")):
        lang = lang_file.stem
        if lang in ['ko', 'en']:
            continue

        with open(lang_file, 'r', encoding='utf-8') as f:
            try:
                lang_data = json.load(f)
            except:
                print(f"ERROR: Cannot parse {lang}.json")
                continue

        # Merge with ko structure, fill from en where missing
        merged_data = merge_language_structure(lang_data, ko_data, en_data, lang)

        # Write back
        with open(lang_file, 'w', encoding='utf-8') as f:
            json.dump(merged_data, f, ensure_ascii=False, indent=2)

        print(f"FIXED: tax-refund-preview/{lang}.json - synchronized with ko structure")

if __name__ == "__main__":
    fix_tax_refund()
