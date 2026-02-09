#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
I18n Locale Key Synchronization Checker
Checks all apps in projects/ for missing keys in locale JSON files
"""

import json
import os
import sys
from pathlib import Path
from collections import defaultdict

# Force UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

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

def check_app_locales(app_path):
    """Check all locale files in an app directory"""
    locales_dir = app_path / "js" / "locales"

    if not locales_dir.exists():
        return None

    # Get all JSON files
    locale_files = sorted(locales_dir.glob("*.json"))
    if not locale_files:
        return None

    # Read all locale files
    locales = {}
    for locale_file in locale_files:
        lang = locale_file.stem
        try:
            with open(locale_file, 'r', encoding='utf-8') as f:
                locales[lang] = json.load(f)
        except json.JSONDecodeError as e:
            return {
                'error': f'JSON Syntax Error in {lang}.json: {str(e)}',
                'file': str(locale_file)
            }
        except Exception as e:
            return {
                'error': f'Error reading {lang}.json: {str(e)}',
                'file': str(locale_file)
            }

    # Extract keys from ko.json as reference
    if 'ko' not in locales:
        return {'error': 'Missing ko.json'}

    reference_keys = extract_all_keys(locales['ko'])

    # Check all other languages
    issues = defaultdict(list)

    for lang, content in locales.items():
        if lang == 'ko':
            continue

        lang_keys = extract_all_keys(content)

        # Find missing keys
        missing = reference_keys - lang_keys
        if missing:
            issues[f'{lang}_missing'] = sorted(missing)

        # Find extra keys (shouldn't exist but good to know)
        extra = lang_keys - reference_keys
        if extra:
            issues[f'{lang}_extra'] = sorted(extra)

    return {
        'status': 'OK' if not issues else 'ISSUES',
        'languages': list(locales.keys()),
        'issues': dict(issues) if issues else None
    } if not any('error' in str(v) for v in locales.values()) else {'error': str(list(locales.values())[0])}

def main():
    projects_dir = Path("E:/Fire Project/projects")

    if not projects_dir.exists():
        print(f"Projects directory not found: {projects_dir}")
        return

    results = {}
    apps_with_issues = []
    apps_without_locales = []

    # Check all app directories
    for app_dir in sorted(projects_dir.iterdir()):
        if not app_dir.is_dir() or app_dir.name.startswith('.'):
            continue

        result = check_app_locales(app_dir)

        if result is None:
            apps_without_locales.append(app_dir.name)
        elif 'error' in result:
            apps_with_issues.append({
                'app': app_dir.name,
                'issue': result['error']
            })
            results[app_dir.name] = result
        else:
            results[app_dir.name] = result
            if result['status'] == 'ISSUES':
                apps_with_issues.append({
                    'app': app_dir.name,
                    'issue_count': sum(len(v) for k, v in result.get('issues', {}).items() if k.endswith('_missing'))
                })

    # Print summary
    print("\n" + "="*80)
    print("I18N LOCALE SYNCHRONIZATION CHECK")
    print("="*80)

    print(f"\nTotal apps checked: {len(results)}")
    print(f"Apps with locales: {len([r for r in results.values() if 'error' not in r])}")
    print(f"Apps WITHOUT locales folder: {len(apps_without_locales)}")
    print(f"Apps with ISSUES: {len([r for r in results.values() if r.get('status') == 'ISSUES'])}")

    if apps_without_locales:
        print(f"\nApps without locales folder ({len(apps_without_locales)}):")
        for app in sorted(apps_without_locales):
            print(f"  - {app}")

    # Print detailed issues
    print("\n" + "-"*80)
    print("DETAILED ISSUES:")
    print("-"*80)

    issue_count = 0
    for app_name in sorted(results.keys()):
        result = results[app_name]

        if 'error' in result:
            print(f"\n{app_name}: ERROR")
            print(f"  {result.get('error', 'Unknown error').encode('utf-8', errors='ignore').decode('utf-8')}")
            issue_count += 1
        elif result.get('status') == 'ISSUES' and result.get('issues'):
            print(f"\n{app_name}:")
            print(f"  Languages: {', '.join(result['languages'])}")
            for issue_type, keys in sorted(result['issues'].items()):
                if issue_type.endswith('_missing'):
                    lang = issue_type.replace('_missing', '')
                    print(f"  Missing in {lang}.json ({len(keys)} keys):")
                    for key in sorted(keys)[:10]:  # Show first 10
                        print(f"    - {key}")
                    if len(keys) > 10:
                        print(f"    ... and {len(keys)-10} more")
            issue_count += 1

    if issue_count == 0:
        print("\nNo critical issues found!")

    print("\n" + "="*80)

if __name__ == "__main__":
    main()
