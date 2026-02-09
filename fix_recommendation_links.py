#!/usr/bin/env python3
"""
Fix recommendation links to use absolute URLs
"""
import os
import re
from pathlib import Path

PROJECTS_BASE = "E:/Fire Project/projects"

APPS_TO_FIX = [
    "affirmation", "brain-type", "color-memory", "dday-counter", "detox-timer",
    "dev-quiz", "dream-fortune", "emoji-merge", "hsp-test", "idle-clicker",
    "kpop-position", "lottery", "love-frequency", "mbti-love", "mbti-tips",
    "number-puzzle", "past-life", "quiz-app", "reaction-test", "shopping-calc",
    "sky-runner", "stack-tower", "typing-speed", "unit-converter", "white-noise",
    "word-scramble", "zigzag-runner", "tax-refund-preview"
]

def fix_links_in_app(app_folder):
    """Fix relative links to absolute URLs"""
    html_path = os.path.join(PROJECTS_BASE, app_folder, "index.html")

    if not os.path.exists(html_path):
        print(f"  X {app_folder}: not found")
        return False

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace href="/{app}/" with href="https://dopabrain.com/{app}/"
    # But don't replace if it's already an absolute URL
    pattern = r'href="(/[a-z0-9\-]+/)"'
    replacement = r'href="https://dopabrain.com\1"'

    updated_content = re.sub(pattern, replacement, content)

    if updated_content != content:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"  O {app_folder}: Fixed relative links")
        return True
    else:
        print(f"  ~ {app_folder}: Already using absolute links")
        return False

def main():
    print("=" * 60)
    print("Fixing Recommendation Links to Absolute URLs")
    print("=" * 60)

    fixed_count = 0
    checked_count = 0

    for app_folder in sorted(APPS_TO_FIX):
        try:
            if fix_links_in_app(app_folder):
                fixed_count += 1
            checked_count += 1
        except Exception as e:
            print(f"  X {app_folder}: Error - {e}")

    print("\n" + "=" * 60)
    print(f"Summary: {fixed_count} fixed out of {checked_count} checked")
    print("=" * 60)

if __name__ == "__main__":
    main()
