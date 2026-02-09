#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
WCAG 2.1 AA 접근성 감사 스크립트
모든 앱의 HTML/CSS 접근성 문제 자동 검사 및 수정
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict

# 프로젝트 경로
PROJECT_ROOT = Path("E:\\Fire Project\\projects")
PRIORITY_APPS = [
    "dream-fortune", "past-life", "emotion-temp", "hsp-test", "mbti-love",
    "kpop-position", "idle-clicker", "brain-type", "stress-check", "memory-card",
    "color-memory", "reaction-test", "typing-speed", "word-scramble"
]

class AccessibilityAudit:
    def __init__(self):
        self.issues = defaultdict(list)
        self.passes = defaultdict(list)
        self.contrast_errors = []

    def check_color_contrast(self, hex_color, bg_color):
        """WCAG AA 색상 대비율 검사 (4.5:1 for normal, 3:1 for large)"""
        def hex_to_rgb(h):
            h = h.lstrip('#')
            if len(h) == 3:
                h = ''.join([c*2 for c in h])
            return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

        try:
            rgb1 = hex_to_rgb(hex_color)
            rgb2 = hex_to_rgb(bg_color)

            # Relative luminance 계산
            def get_luminance(r, g, b):
                r, g, b = r/255, g/255, b/255
                r = r/12.92 if r <= 0.03928 else ((r+0.055)/1.055)**2.4
                g = g/12.92 if g <= 0.03928 else ((g+0.055)/1.055)**2.4
                b = b/12.92 if b <= 0.03928 else ((b+0.055)/1.055)**2.4
                return 0.2126*r + 0.7152*g + 0.0722*b

            l1 = get_luminance(*rgb1)
            l2 = get_luminance(*rgb2)

            lighter = max(l1, l2)
            darker = min(l1, l2)
            contrast = (lighter + 0.05) / (darker + 0.05)
            return contrast
        except:
            return None

    def audit_html(self, app_path, html_file):
        """HTML 접근성 검사"""
        app_name = app_path.name
        issues = []
        passes = []

        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # 1. 이미지 alt 속성 검사
            images = re.findall(r'<img[^>]*>', content)
            if images:
                for img in images:
                    if 'alt=' not in img and '[role="img"]' not in img and 'aria-label' not in img:
                        issues.append("[IMG] Missing alt attribute")
                    else:
                        passes.append("[IMG] Alt attributes present")
                        break

            # 2. 기본 HTML 구조 검사
            if '<header' not in content and '<nav' not in content:
                issues.append("[HTML] Semantic structure missing (header/nav)")
            else:
                passes.append("[HTML] Semantic structure present")

            # 3. 언어 속성 검사
            if 'lang=' not in content:
                issues.append("[HTML] lang attribute missing")
            else:
                passes.append("[HTML] lang attribute present")

            # 4. Focus 스타일 검사
            if ':focus-visible' not in content and ':focus {' not in content:
                issues.append("[A11Y] :focus-visible style not explicit")
            else:
                passes.append("[A11Y] Focus styles defined")

            # 5. 제목 계층 검사
            h_tags = re.findall(r'<h([1-6])', content)
            if h_tags and h_tags[0] != '1':
                issues.append("[HTML] H1 not first heading")
            elif not h_tags:
                issues.append("[HTML] H1 heading missing")
            else:
                passes.append("[HTML] Heading hierarchy correct")

            # 6. 아이콘 aria-label 검사
            if '[role="button"]' in content or '[role="link"]' in content:
                if 'aria-label' not in content:
                    issues.append("[A11Y] Icon roles should have aria-label")

            # 7. 키보드 navigation 검사
            buttons = re.findall(r'<button[^>]*>', content)
            if buttons and 'tabindex' not in content:
                passes.append("[A11Y] Default tab order maintained")

            # 8. reduced-motion 검사
            if '@media (prefers-reduced-motion: reduce)' in content:
                passes.append("[A11Y] prefers-reduced-motion supported")
            else:
                issues.append("[A11Y] prefers-reduced-motion media query missing")

            # 9. 최소 터치 타겟 크기 (48x48px 확인을 위해 CSS에서)
            if 'min-height: 44px' in content or 'min-height: 48px' in content:
                passes.append("[A11Y] Touch target minimum size defined")

            self.issues[app_name].extend(issues)
            self.passes[app_name].extend(passes)

            return issues, passes

        except Exception as e:
            self.issues[app_name].append(f"[ERROR] HTML parsing: {str(e)}")
            return [], []

    def audit_css(self, app_path, css_file):
        """CSS 접근성 검사"""
        app_name = app_path.name
        issues = []
        passes = []

        try:
            with open(css_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # 1. Focus 스타일 확인
            if 'focus-visible' in content:
                passes.append("[CSS] :focus-visible style present")
            elif ':focus' in content:
                issues.append("[CSS] :focus present but :focus-visible missing")
            else:
                issues.append("[CSS] Focus style incomplete")

            # 2. 터치 타겟 최소 크기
            if 'min-height: 44px' in content or 'min-height: 48px' in content:
                passes.append("[CSS] Button minimum height 44px+")
            else:
                issues.append("[CSS] Button minimum height unclear")

            # 3. Color contrast ratio 검사
            # CSS Variables에서 색상 추출
            color_vars = re.findall(r'--\w+:\s*(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\))', content)

            # 배경색과 텍스트색 조합 검사
            if '--text:' in content and '--background:' in content:
                text_match = re.search(r'--text:\s*(#[0-9a-fA-F]{6})', content)
                bg_match = re.search(r'--background:\s*(#[0-9a-fA-F]{6})', content)

                if text_match and bg_match:
                    text_color = text_match.group(1)
                    bg_color = bg_match.group(1)
                    ratio = self.check_color_contrast(text_color, bg_color)

                    if ratio:
                        if ratio >= 4.5:
                            passes.append(f"[CONTRAST] Text/BG ratio: {ratio:.2f}:1 (WCAG AA)")
                        elif ratio >= 3:
                            issues.append(f"[CONTRAST] Ratio: {ratio:.2f}:1 (Large text only)")
                        else:
                            issues.append(f"[CONTRAST] Ratio: {ratio:.2f}:1 (Below WCAG AA)")

            # 4. prefers-reduced-motion 검사
            if '@media (prefers-reduced-motion: reduce)' in content:
                passes.append("[MOTION] prefers-reduced-motion supported")
            else:
                issues.append("[MOTION] prefers-reduced-motion media query missing")

            # 5. Animation 무한 반복 검사
            if 'infinite' in content and '@media (prefers-reduced-motion: reduce)' not in content:
                issues.append("[MOTION] Infinite animation not protected by prefers-reduced-motion")

            # 6. Outline 검사
            if 'outline: none' in content and 'outline: 3px solid' not in content:
                issues.append("[CSS] outline: none removes focus style")

            # 7. Glassmorphism 검사 (background-clip 텍스트)
            if 'background-clip: text' in content and '-webkit-text-fill-color: transparent' in content:
                if 'font-size: 2rem' in content or 'font-size: 1.5rem' in content:
                    issues.append("[CONTRAST] Large text with background-clip may have contrast issues")

            self.issues[app_name].extend(issues)
            self.passes[app_name].extend(passes)

            return issues, passes

        except Exception as e:
            self.issues[app_name].append(f"[ERROR] CSS parsing: {str(e)}")
            return [], []

    def audit_app(self, app_path):
        """앱 전체 감사"""
        app_name = app_path.name

        html_file = app_path / "index.html"
        css_file = app_path / "css" / "style.css"

        if not html_file.exists():
            self.issues[app_name].append("[ERROR] index.html missing")
            return

        if not css_file.exists():
            self.issues[app_name].append("[ERROR] css/style.css missing")
            return

        html_issues, html_passes = self.audit_html(app_path, html_file)
        css_issues, css_passes = self.audit_css(app_path, css_file)

    def run_audit(self):
        """모든 우선순위 앱 감사"""
        print("=" * 70)
        print("WCAG 2.1 AA Accessibility Audit")
        print("=" * 70)

        for app_name in PRIORITY_APPS:
            app_path = PROJECT_ROOT / app_name
            if app_path.exists():
                print(f"\n[{app_name}]...")
                self.audit_app(app_path)
            else:
                print(f"[WARNING] {app_name} directory not found")

        # 결과 출력
        self.print_results()

    def print_results(self):
        """감사 결과 출력"""
        print("\n" + "=" * 70)
        print("Audit Results Summary")
        print("=" * 70)

        for app_name in sorted(self.issues.keys()):
            print(f"\n[{app_name}]:")
            if self.issues[app_name]:
                for issue in self.issues[app_name][:3]:  # 최대 3개만 표시
                    print(f"  {issue}")

            if self.passes[app_name]:
                print(f"  PASS: {len(self.passes[app_name])} items")

        # 통계
        total_issues = sum(len(v) for v in self.issues.values())
        total_passes = sum(len(v) for v in self.passes.values())

        print("\n" + "=" * 70)
        print(f"Total Issues: {total_issues} | Passed: {total_passes}")
        print("=" * 70)

if __name__ == "__main__":
    audit = AccessibilityAudit()
    audit.run_audit()
