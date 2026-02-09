#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check a single app's locale keys
"""

import json
from pathlib import Path
from collections import defaultdict

def extract_all_keys(obj, prefix=""):
    """Recursively extract all keys from a nested dict/list structure"""
    keys = set()
    if isinstance(obj, dict):
        for key, value in obj.items():
            full_key = f"{prefix}.{key}" if prefix else key
            keys.add(full_key)
            keys.update(extract_all_keys(value, full_key))
    elif isinstance(obj, list):
        for i, value in enumerate(obj):
            full_key = f"{prefix}[{i}]"
            keys.add(full_key)
            keys.update(extract_all_keys(value, full_key))
    return keys

app_name = 'dev-quiz'
app_dir = Path(f"E:/Fire Project/projects/{app_name}")
locales_dir = app_dir / "js" / "locales"

# Get all JSON files
locale_files = sorted(locales_dir.glob("*.json"))

# Read all locale files
locales = {}
for locale_file in locale_files:
    lang = locale_file.stem
    with open(locale_file, 'r', encoding='utf-8') as f:
        locales[lang] = json.load(f)

# Extract keys from ko.json as reference
reference_keys = extract_all_keys(locales['ko'])

print(f"App: {app_name}")
print(f"Reference keys in ko.json: {len(reference_keys)}")
print("\nChecking de.json...")
de_keys = extract_all_keys(locales['de'])
print(f"Keys in de.json: {len(de_keys)}")

missing_in_de = reference_keys - de_keys
if missing_in_de:
    print(f"\nMissing in de.json ({len(missing_in_de)}):")
    for key in sorted(missing_in_de):
        print(f"  - {key}")
else:
    print("No missing keys!")
