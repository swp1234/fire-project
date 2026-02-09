#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re
from pathlib import Path

projects_dir = Path(r"E:\Fire Project\projects")
apps = sorted([d.name for d in projects_dir.iterdir() if d.is_dir() and d.name not in ['portal', 'root-domain']])

print("=== FINAL VERIFICATION AFTER UPDATES ===\n")

app_status = {}

for app in apps:
    html_path = projects_dir / app / "index.html"
    if html_path.exists():
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()

            has_brain_type = 'brain-type' in content
            has_color_memory = 'color-memory' in content
            has_reaction_test = 'reaction-test' in content

            new_apps_found = []
            if has_brain_type:
                new_apps_found.append('brain-type')
            if has_color_memory:
                new_apps_found.append('color-memory')
            if has_reaction_test:
                new_apps_found.append('reaction-test')

            # 추천 섹션이 있는지 확인
            has_rec = bool(re.search(r'rec-section|recommend', content))

            app_status[app] = {
                'has_rec': has_rec,
                'new_apps': new_apps_found,
                'count': len(new_apps_found)
            }

        except Exception as e:
            pass

# 상태별로 분류
complete = {k:v for k,v in app_status.items() if v['count'] == 3 and v['has_rec']}
partial = {k:v for k,v in app_status.items() if 0 < v['count'] < 3 and v['has_rec']}
missing = {k:v for k,v in app_status.items() if v['count'] == 0 and v['has_rec']}
no_rec = {k:v for k,v in app_status.items() if not v['has_rec']}

print(f"COMPLETE (모든 새 앱 포함): {len(complete)}")
for app in sorted(complete.keys()):
    print(f"  - {app}")

print(f"\nPARTIAL (일부 새 앱 포함): {len(partial)}")
for app in sorted(partial.keys()):
    v = partial[app]
    missing_apps = [a for a in ['brain-type', 'color-memory', 'reaction-test'] if a not in v['new_apps']]
    print(f"  - {app}: {v['new_apps']} (missing: {missing_apps})")

print(f"\nMISSING (새 앱 미포함): {len(missing)}")
for app in sorted(missing.keys()):
    print(f"  - {app}")

print(f"\nNO REC SECTION: {len(no_rec)}")
for app in sorted(no_rec.keys()):
    print(f"  - {app}")

print(f"\n=== SUMMARY ===")
print(f"Total apps: {len(app_status)}")
print(f"Complete: {len(complete)} ({100*len(complete)//len(app_status)}%)")
print(f"Partial: {len(partial)}")
print(f"Missing: {len(missing)}")
print(f"No rec section: {len(no_rec)}")
