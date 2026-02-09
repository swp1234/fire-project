#!/usr/bin/env python3
"""
Link Validation Script for DopaBrain Project
Validates: rec-section, portal, blog, footer, canonical URLs
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# Project structure
PROJECT_ROOT = r"E:\Fire Project"
PROJECTS_DIR = os.path.join(PROJECT_ROOT, "projects")

# All 28 apps (excluding portal and root-domain)
APPS = [
    "affirmation", "brain-type", "color-memory", "dday-counter", "detox-timer",
    "dev-quiz", "dream-fortune", "emoji-merge", "emotion-temp", "hsp-test",
    "idle-clicker", "kpop-position", "lottery", "love-frequency", "mbti-love",
    "mbti-tips", "number-puzzle", "past-life", "quiz-app", "reaction-test",
    "shopping-calc", "sky-runner", "stack-tower", "tax-refund-preview",
    "unit-converter", "valentine", "white-noise", "zigzag-runner"
]

class LinkValidator:
    def __init__(self):
        self.errors = defaultdict(list)
        self.warnings = defaultdict(list)
        self.info = defaultdict(list)
        self.valid_apps = set(APPS)

    def extract_hrefs(self, html_content):
        """Extract all href values from HTML"""
        return re.findall(r'href=["\']([^"\']+)["\']', html_content)

    def validate_app_links(self, app_name, hrefs):
        """Validate links in app's rec-section"""
        for href in hrefs:
            # Skip non-dopabrain URLs and relative paths
            if not href.startswith("https://dopabrain.com/"):
                continue
            if href == "https://dopabrain.com/portal/":
                continue

            # Extract app name from URL
            match = re.match(r"https://dopabrain\.com/([^/]+)/?$", href)
            if match:
                target_app = match.group(1)
                if target_app not in self.valid_apps:
                    self.errors[f"{app_name}/index.html"].append(
                        f"BROKEN REC-LINK: {href} (app '{target_app}' does not exist)"
                    )
                else:
                    self.info[f"{app_name}/index.html"].append(
                        f"✓ REC-LINK: {href}"
                    )

    def check_canonical(self, app_name, html_content):
        """Check canonical URL"""
        canonical = re.search(r'<link rel="canonical" href="([^"]+)"', html_content)
        if canonical:
            expected = f"https://dopabrain.com/{app_name}/"
            actual = canonical.group(1)
            if actual == expected:
                self.info[f"{app_name}/index.html"].append(
                    f"✓ CANONICAL: {actual}"
                )
            else:
                self.errors[f"{app_name}/index.html"].append(
                    f"CANONICAL MISMATCH: Expected '{expected}', got '{actual}'"
                )
        else:
            self.warnings[f"{app_name}/index.html"].append(
                "NO CANONICAL: Missing canonical URL"
            )

    def check_footer_link(self, app_name, html_content):
        """Check DopaBrain home link in footer"""
        footer_link = re.search(r'<a[^>]*href="([^"]*)"[^>]*>(?:[^<]*<svg[^>]*>[^<]*</svg>)?[^<]*DopaBrain[^<]*홈', html_content)
        if footer_link:
            href = footer_link.group(1)
            if href == "https://dopabrain.com/portal/":
                self.info[f"{app_name}/index.html"].append(
                    "✓ FOOTER: DopaBrain 홈 link correct"
                )
            else:
                self.errors[f"{app_name}/index.html"].append(
                    f"FOOTER LINK WRONG: Expected 'https://dopabrain.com/portal/', got '{href}'"
                )
        else:
            self.warnings[f"{app_name}/index.html"].append(
                "NO FOOTER LINK: Missing DopaBrain 홈 link"
            )

    def validate_portal(self):
        """Validate portal/index.html contains all apps"""
        portal_html_path = os.path.join(PROJECTS_DIR, "portal", "index.html")
        if not os.path.exists(portal_html_path):
            self.errors["portal/index.html"].append("MISSING: portal/index.html not found")
            return

        with open(portal_html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()

        portal_hrefs = self.extract_hrefs(html_content)
        found_apps = set()

        for href in portal_hrefs:
            match = re.match(r"https://dopabrain\.com/([^/]+)/?$", href)
            if match:
                app_name = match.group(1)
                if app_name in self.valid_apps:
                    found_apps.add(app_name)

        missing_apps = self.valid_apps - found_apps
        if missing_apps:
            self.errors["portal/index.html"].append(
                f"MISSING APPS: {', '.join(sorted(missing_apps))}"
            )
        else:
            self.info["portal/index.html"].append(
                f"✓ PORTAL: All {len(self.valid_apps)} apps present"
            )

    def validate_blog(self):
        """Validate blog links"""
        blog_dir = os.path.join(PROJECTS_DIR, "portal", "blog")
        if not os.path.exists(blog_dir):
            self.warnings["portal/blog"].append("SKIP: blog directory not found")
            return

        for root, dirs, files in os.walk(blog_dir):
            for file in files:
                if file.endswith(".html"):
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, PROJECTS_DIR)

                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            html_content = f.read()

                        hrefs = self.extract_hrefs(html_content)
                        for href in hrefs:
                            if href.startswith("https://dopabrain.com/"):
                                match = re.match(r"https://dopabrain\.com/([^/]+)/?$", href)
                                if match:
                                    app_name = match.group(1)
                                    if app_name not in self.valid_apps and app_name != "portal":
                                        self.errors[rel_path].append(
                                            f"BROKEN BLOG-LINK: {href}"
                                        )
                    except Exception as e:
                        self.errors[rel_path].append(f"ERROR reading file: {e}")

    def run_validation(self):
        """Run all validations"""
        print("=" * 70)
        print("LINK VALIDATION FOR DOPABRAIN PROJECT (28 APPS)")
        print("=" * 70)
        print()

        # Validate each app
        for app_name in sorted(APPS):
            app_path = os.path.join(PROJECTS_DIR, app_name, "index.html")
            if not os.path.exists(app_path):
                self.errors[f"{app_name}/index.html"].append("MISSING: index.html not found")
                continue

            try:
                with open(app_path, 'r', encoding='utf-8') as f:
                    html_content = f.read()

                hrefs = self.extract_hrefs(html_content)
                self.validate_app_links(app_name, hrefs)
                self.check_canonical(app_name, html_content)
                self.check_footer_link(app_name, html_content)

            except Exception as e:
                self.errors[f"{app_name}/index.html"].append(f"ERROR reading file: {e}")

        # Validate portal
        self.validate_portal()

        # Validate blog
        self.validate_blog()

        # Print results
        self.print_results()

    def print_results(self):
        """Print validation results"""
        total_files = len(self.errors) + len(self.warnings) + len(self.info)

        # Print errors
        if self.errors:
            print("=" * 70)
            print(f"ERRORS ({sum(len(v) for v in self.errors.values())} total)")
            print("=" * 70)
            for file, errs in sorted(self.errors.items()):
                print(f"\n{file}:")
                for err in errs:
                    print(f"  [ERROR] {err}")
            print()

        # Print warnings
        if self.warnings:
            print("=" * 70)
            print(f"WARNINGS ({sum(len(v) for v in self.warnings.values())} total)")
            print("=" * 70)
            for file, warns in sorted(self.warnings.items()):
                print(f"\n{file}:")
                for warn in warns:
                    print(f"  [WARN] {warn}")
            print()

        # Print summary
        total_errors = sum(len(v) for v in self.errors.values())
        total_warnings = sum(len(v) for v in self.warnings.values())

        print("=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print(f"Total Errors: {total_errors}")
        print(f"Total Warnings: {total_warnings}")
        print()

        if total_errors == 0:
            print("[OK] ALL LINKS VALIDATED SUCCESSFULLY!")
        else:
            print(f"[FAILED] Found {total_errors} error(s) that need to be fixed")

if __name__ == "__main__":
    validator = LinkValidator()
    validator.run_validation()
