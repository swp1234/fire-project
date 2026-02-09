#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re
import sys
from pathlib import Path

projects_dir = Path(r"E:\Fire Project\projects")
apps = sorted([d.name for d in projects_dir.iterdir() if d.is_dir() and d.name not in ['portal', 'root-domain']])

print("=== DETAILED RECOMMENDATION SECTION ANALYSIS ===\n")

apps_without_rec = []

for app in apps:
    html_path = projects_dir / app / "index.html"
    if html_path.exists():
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check for all possible recommendation section patterns
            has_rec_section = 'class="rec-section"' in content or '<section class="rec-section">' in content
            has_recommend_section = 'class="recommend' in content or '<div class="recommend' in content
            has_recommendations_section = 'class="recommendations' in content or '<div class="recommendations' in content
            has_recommended_apps = 'class="recommended' in content

            has_any = has_rec_section or has_recommend_section or has_recommendations_section or has_recommended_apps

            if has_any:
                # Count the links
                app_links = re.findall(r'dopabrain\.com/([a-z0-9-]+)/', content)
                unique_apps = set(app_links) - {app}
                print(f"O {app}: YES ({len(unique_apps)} unique app links)")

                if has_rec_section:
                    print(f"    - rec-section")
                if has_recommend_section:
                    print(f"    - recommend-section")
                if has_recommendations_section:
                    print(f"    - recommendations-section")
                if has_recommended_apps:
                    print(f"    - recommended-apps")
            else:
                print(f"X {app}: NO recommendation section")
                apps_without_rec.append(app)
        except Exception as e:
            print(f"E {app}: Error - {e}")

print(f"\n=== APPS WITHOUT RECOMMENDATION SECTION ({len(apps_without_rec)}) ===")
for app in apps_without_rec:
    print(f"  - {app}")
