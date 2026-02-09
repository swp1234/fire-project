#!/usr/bin/env python3
"""
Validate all recommendation links are using absolute URLs
"""
import os
import re
from pathlib import Path

PROJECTS_BASE = "E:/Fire Project/projects"

def validate_app(app_folder):
    """Validate all links in an app"""
    html_path = os.path.join(PROJECTS_BASE, app_folder, "index.html")

    if not os.path.exists(html_path):
        return None

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all recommendation links
    rec_section = re.search(r'<div class="rec-grid">.*?</div>\s*</div>', content, re.DOTALL)
    if not rec_section:
        rec_section = re.search(r'<section class="rec-section">.*?</section>', content, re.DOTALL)

    if not rec_section:
        return None

    rec_text = rec_section.group(0)

    # Check for relative links
    relative_links = re.findall(r'href="(/[^"]+/)"', rec_text)

    # Count absolute links
    absolute_links = re.findall(r'href="https://dopabrain\.com/[^"]+/"', rec_text)

    return {
        'relative': len(relative_links),
        'absolute': len(absolute_links),
        'total': len(relative_links) + len(absolute_links),
        'issues': relative_links
    }

def main():
    print("=" * 70)
    print("Validating All Recommendation Links")
    print("=" * 70)

    apps = sorted([d for d in os.listdir(PROJECTS_BASE) if os.path.isdir(os.path.join(PROJECTS_BASE, d))])

    with_recs = 0
    without_recs = 0
    issues = 0

    for app in apps:
        result = validate_app(app)

        if result is None:
            print(f"  ~ {app}: No recommendation section")
            without_recs += 1
        else:
            if result['relative'] == 0:
                print(f"  O {app}: OK ({result['absolute']} absolute links)")
                with_recs += 1
            else:
                print(f"  X {app}: {result['relative']} relative links found!")
                issues += 1
                print(f"      {result['issues']}")

    print("\n" + "=" * 70)
    print(f"Summary:")
    print(f"  With recommendations: {with_recs}")
    print(f"  Without recommendations: {without_recs}")
    print(f"  Issues found: {issues}")
    print("=" * 70)

if __name__ == "__main__":
    main()
