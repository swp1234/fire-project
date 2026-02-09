#!/usr/bin/env python3
"""Simple link validation for DopaBrain apps"""

import os
import re

# All 28 apps
APPS = [
    "affirmation", "brain-type", "color-memory", "dday-counter", "detox-timer",
    "dev-quiz", "dream-fortune", "emoji-merge", "emotion-temp", "hsp-test",
    "idle-clicker", "kpop-position", "lottery", "love-frequency", "mbti-love",
    "mbti-tips", "number-puzzle", "past-life", "quiz-app", "reaction-test",
    "shopping-calc", "sky-runner", "stack-tower", "tax-refund-preview",
    "unit-converter", "valentine", "white-noise", "zigzag-runner"
]

PROJECTS_DIR = r"E:\Fire Project\projects"
valid_apps = set(APPS)

print("=" * 70)
print("CHECKING LINKS IN ALL APPS")
print("=" * 70)
print()

# Check each app
broken_links = []
missing_footer = []
wrong_canonical = []

for app_name in sorted(APPS):
    html_path = os.path.join(PROJECTS_DIR, app_name, "index.html")
    if not os.path.exists(html_path):
        print(f"[ERROR] {app_name}: index.html not found")
        continue

    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Check canonical
    canon_match = re.search(r'<link rel="canonical" href="([^"]+)"', html)
    if canon_match:
        canonical = canon_match.group(1)
        expected_canonical = f"https://dopabrain.com/{app_name}/"
        if canonical != expected_canonical:
            wrong_canonical.append((app_name, expected_canonical, canonical))

    # Check footer link
    footer_match = re.search(r'<a[^>]*href="([^"]*)"[^>]*>(?:[^<]*<svg[^>]*>[^<]*</svg>)?[^<]*DopaBrain', html)
    if footer_match:
        footer_href = footer_match.group(1)
        if footer_href != "https://dopabrain.com/portal/":
            missing_footer.append((app_name, footer_href))
    else:
        missing_footer.append((app_name, "NOT FOUND"))

    # Check rec-links
    rec_links = re.findall(r'href="https://dopabrain\.com/([^/]+)/"', html)
    for target_app in rec_links:
        if target_app not in valid_apps and target_app != "portal":
            broken_links.append((app_name, f"https://dopabrain.com/{target_app}/"))

# Print results
print("BROKEN RECOMMENDATION LINKS:")
print("-" * 70)
if broken_links:
    for app_name, broken_link in broken_links:
        print(f"{app_name}: {broken_link}")
else:
    print("None found!")
print()

print("WRONG FOOTER LINKS:")
print("-" * 70)
if missing_footer:
    for app_name, link in missing_footer:
        if link != "https://dopabrain.com/portal/":
            print(f"{app_name}: {link}")
else:
    print("None found!")
print()

print("WRONG CANONICAL URLS:")
print("-" * 70)
if wrong_canonical:
    for app_name, expected, actual in wrong_canonical:
        print(f"{app_name}:")
        print(f"  Expected: {expected}")
        print(f"  Got:      {actual}")
else:
    print("None found!")
print()

print("=" * 70)
total_issues = len(broken_links) + len([x for x in missing_footer if x[1] != "https://dopabrain.com/portal/"]) + len(wrong_canonical)
if total_issues == 0:
    print("[OK] ALL LINKS VALIDATED SUCCESSFULLY!")
else:
    print(f"[ISSUES] Found {total_issues} problems")
