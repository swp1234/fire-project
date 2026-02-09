#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re
import sys
from pathlib import Path

projects_dir = Path(r"E:\Fire Project\projects")
apps = sorted([d.name for d in projects_dir.iterdir() if d.is_dir() and d.name not in ['portal', 'root-domain']])

new_apps = ['brain-type', 'color-memory', 'reaction-test']
game_apps = ['idle-clicker', 'emoji-merge', 'stack-tower', 'sky-runner', 'zigzag-runner']
test_apps = ['brain-type', 'mbti-love', 'emotion-temp', 'hsp-test', 'past-life', 'kpop-position', 'valentine', 'love-frequency', 'dev-quiz', 'quiz-app']

print("=== NEW APPS INCLUSION ANALYSIS ===\n")

# For each app, check which new apps are included
for app in apps:
    html_path = projects_dir / app / "index.html"
    if html_path.exists():
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()

            included = []
            for new_app in new_apps:
                if new_app in content and new_app != app:
                    included.append(new_app)

            is_game = app in game_apps
            is_test = app in test_apps

            if len(included) == 3:
                print(f"COMPLETE: {app}")
            elif len(included) > 0:
                print(f"PARTIAL: {app} - {included} (missing {[a for a in new_apps if a not in included]})")
            else:
                print(f"MISSING: {app} - all 3 new apps")

        except Exception as e:
            print(f"ERROR: {app} - {e}")

print("\n=== APPS BY MISSING NEW APPS ===\n")

missing_brain_type = []
missing_color_memory = []
missing_reaction_test = []

for app in apps:
    if app in new_apps:
        continue

    html_path = projects_dir / app / "index.html"
    if html_path.exists():
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()

            if 'brain-type' not in content:
                missing_brain_type.append(app)
            if 'color-memory' not in content:
                missing_color_memory.append(app)
            if 'reaction-test' not in content:
                missing_reaction_test.append(app)

        except Exception as e:
            pass

print(f"Missing brain-type ({len(missing_brain_type)}):")
for app in missing_brain_type:
    print(f"  - {app}")

print(f"\nMissing color-memory ({len(missing_color_memory)}):")
for app in missing_color_memory:
    print(f"  - {app}")

print(f"\nMissing reaction-test ({len(missing_reaction_test)}):")
for app in missing_reaction_test:
    print(f"  - {app}")
