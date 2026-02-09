#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
WCAG 2.1 AA 접근성 수정 검증 스크립트
모든 앱이 필수 접근성 기능을 갖추었는지 확인
"""

import os
from pathlib import Path

PROJECT_ROOT = Path("E:\\Fire Project\\projects")
PRIORITY_APPS = [
    "dream-fortune", "past-life", "emotion-temp", "hsp-test", "mbti-love",
    "kpop-position", "idle-clicker", "brain-type", "stress-check", "memory-card",
    "color-memory", "reaction-test", "typing-speed", "word-scramble"
]

class AccessibilityVerifier:
    def __init__(self):
        self.results = {}
        self.total_checks = 0
        self.passed_checks = 0

    def check_app(self, app_name):
        """앱의 접근성 기능 검증"""
        app_path = PROJECT_ROOT / app_name
        results = {
            "app_name": app_name,
            "checks": []
        }

        # HTML 파일 확인
        html_file = app_path / "index.html"
        css_file = app_path / "css" / "style.css"

        if not html_file.exists():
            results["checks"].append(("index.html missing", False))
            self.results[app_name] = results
            return

        if not css_file.exists():
            results["checks"].append(("css/style.css missing", False))
            self.results[app_name] = results
            return

        # HTML 검사
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()

        # CSS 검사
        with open(css_file, 'r', encoding='utf-8') as f:
            css_content = f.read()

        # 1. lang 속성
        check = "lang=\"ko\"" in html_content or "lang='ko'" in html_content
        results["checks"].append(("HTML lang attribute", check))
        self.total_checks += 1
        if check: self.passed_checks += 1

        # 2. Skip link
        check = "skip-link" in html_content or "Skip" in html_content
        results["checks"].append(("Skip link", check))
        self.total_checks += 1
        if check: self.passed_checks += 1

        # 3. Focus visible CSS
        check = "focus-visible" in css_content
        results["checks"].append((":focus-visible style", check))
        self.total_checks += 1
        if check: self.passed_checks += 1

        # 4. prefers-reduced-motion
        check = "prefers-reduced-motion" in css_content
        results["checks"].append(("prefers-reduced-motion", check))
        self.total_checks += 1
        if check: self.passed_checks += 1

        # 5. Touch target minimum height
        check = "min-height: 44px" in css_content or "min-height: 48px" in css_content
        results["checks"].append(("Touch target min-height", check))
        self.total_checks += 1
        if check: self.passed_checks += 1

        # 6. Button styling (any button-related CSS)
        check = "button" in css_content and ("padding:" in css_content or "border:" in css_content)
        results["checks"].append(("Button styles defined", check))
        self.total_checks += 1
        if check: self.passed_checks += 1

        # 7. Color variables
        check = "--primary" in css_content or "--color" in css_content
        results["checks"].append(("Color variables defined", check))
        self.total_checks += 1
        if check: self.passed_checks += 1

        # 8. Form input styling
        check = "input:focus" in css_content or "input[type=" in css_content
        results["checks"].append(("Input focus styles", check))
        self.total_checks += 1
        if check: self.passed_checks += 1

        self.results[app_name] = results

    def run_verification(self):
        """모든 앱 검증"""
        print("=" * 70)
        print("WCAG 2.1 AA Accessibility Verification")
        print("=" * 70)

        for app_name in PRIORITY_APPS:
            self.check_app(app_name)

        # 결과 출력
        self.print_results()

    def print_results(self):
        """검증 결과 출력"""
        print("\nDetailed Results:")
        print("-" * 70)

        compliant_apps = 0

        for app_name in PRIORITY_APPS:
            if app_name not in self.results:
                continue

            result = self.results[app_name]
            passed = sum(1 for _, check in result["checks"] if check)
            total = len(result["checks"])

            status = "PASS" if passed == total else "PARTIAL"
            if status == "PASS":
                compliant_apps += 1

            print(f"\n[{app_name}] {status}")
            for check_name, check_result in result["checks"]:
                mark = "[OK]" if check_result else "[X]"
                print(f"  {mark} {check_name}")

        print("\n" + "=" * 70)
        print("Summary:")
        print(f"  Total Checks: {self.total_checks}")
        print(f"  Passed: {self.passed_checks}")
        print(f"  Compliant Apps: {compliant_apps}/{len(PRIORITY_APPS)}")
        print(f"  Overall Score: {(compliant_apps/len(PRIORITY_APPS)*100):.0f}%")
        print("=" * 70)

        return compliant_apps, len(PRIORITY_APPS)

if __name__ == "__main__":
    verifier = AccessibilityVerifier()
    verifier.run_verification()
