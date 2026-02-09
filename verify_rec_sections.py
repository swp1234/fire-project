#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re
import sys
from pathlib import Path

# 한글 출력을 위한 설정
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

projects_dir = Path(r"E:\Fire Project\projects")
apps = sorted([d.name for d in projects_dir.iterdir() if d.is_dir() and d.name not in ['portal', 'root-domain']])

print("=== Recommendation Section Status ===\n")

new_apps = ['brain-type', 'color-memory', 'reaction-test']

for app in apps:
    html_path = projects_dir / app / "index.html"
    if html_path.exists():
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()

            has_rec = bool(re.search(r'rec-section|rec-card|recommended|recommendations', content))

            # 추천 앱 링크 개수 세기
            app_links = re.findall(r'dopabrain\.com/([a-z0-9-]+)/', content)
            unique_apps = set(app_links) - {app}  # 자신 제외

            if has_rec:
                print(f"O {app}: HAS recommended section ({len(unique_apps)} links)")
            else:
                print(f"X {app}: NO recommended section")
        except Exception as e:
            print(f"E {app}: Error - {e}")
    else:
        print(f"? {app}: index.html NOT found")

print("\n=== New Apps Inclusion Check ===\n")

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

            if new_apps_found:
                print(f"{app}: {', '.join(new_apps_found)} included")
            elif app not in new_apps:
                print(f"{app}: MISSING new apps")
        except Exception as e:
            print(f"E {app}: Error - {e}")
