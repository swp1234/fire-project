#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
WCAG 2.1 AA 접근성 자동 수정 스크립트
모든 앱의 CSS/HTML에서 발견된 문제를 자동으로 수정
"""

import os
import re
from pathlib import Path

PROJECT_ROOT = Path("E:\\Fire Project\\projects")
PRIORITY_APPS = [
    "dream-fortune", "past-life", "emotion-temp", "hsp-test", "mbti-love",
    "kpop-position", "idle-clicker", "brain-type", "stress-check", "memory-card",
    "color-memory", "reaction-test", "typing-speed", "word-scramble"
]

class AccessibilityFixer:
    def __init__(self):
        self.fixed_files = []
        self.skipped_files = []

    def add_focus_visible_to_css(self, css_content):
        """CSS에 :focus-visible 명시화"""
        if ':focus-visible' in css_content:
            return css_content, False

        # Focus 스타일 추가 (없으면)
        focus_styles = """
/* === Keyboard Focus Accessibility === */
button:focus-visible,
a:focus-visible,
input:focus-visible,
[role="button"]:focus-visible,
[role="link"]:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
}

/* Remove default outline only if custom one provided */
button:focus-visible,
a:focus-visible,
input:focus-visible {
    outline: 3px solid #9b59b6;
    outline-offset: 2px;
}

/* Tab key only focus style */
button:focus:not(:focus-visible),
a:focus:not(:focus-visible),
input:focus:not(:focus-visible) {
    outline: none;
}
"""

        if '/* === Accessibility Improvements ===' in css_content:
            # Replace existing accessibility section
            pattern = r'/\* === Accessibility Improvements ===.*?(?=/\*|$)'
            css_content = re.sub(pattern, focus_styles.strip(), css_content, flags=re.DOTALL)
        else:
            # Add at the end
            css_content = css_content.rstrip() + "\n" + focus_styles

        return css_content, True

    def add_prefers_reduced_motion(self, css_content):
        """CSS에 prefers-reduced-motion 미디어 쿼리 추가"""
        if '@media (prefers-reduced-motion: reduce)' in css_content:
            return css_content, False

        motion_rule = """
/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
"""

        css_content = css_content.rstrip() + "\n" + motion_rule
        return css_content, True

    def add_high_contrast_support(self, css_content):
        """CSS에 고대비 모드 지원 추가"""
        if '@media (prefers-contrast: more)' in css_content:
            return css_content, False

        contrast_rule = """
/* High contrast mode support */
@media (prefers-contrast: more) {
    button, input, a[href], [role="button"] {
        border: 2px solid currentColor;
    }
}
"""

        css_content = css_content.rstrip() + "\n" + contrast_rule
        return css_content, True

    def ensure_touch_targets(self, css_content):
        """CSS에서 터치 타겟 최소 크기 확보"""
        if 'min-height: 44px' in css_content or 'min-height: 48px' in css_content:
            return css_content, False

        touch_rule = """
/* Ensure minimum touch target size (WCAG 2.1 Level AAA) */
button, a[href], input[type="button"], input[type="submit"],
[role="button"], [role="link"] {
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
"""

        # 이미 유사한 규칙이 있으면 스킵
        if 'min-width: 44px' in css_content:
            return css_content, False

        # button 섹션 찾기
        if 'button {' in css_content:
            pattern = r'(button\s*\{[^}]*\})'
            match = re.search(pattern, css_content)
            if match:
                return css_content, False

        css_content = css_content.rstrip() + "\n" + touch_rule
        return css_content, True

    def add_skip_link_to_html(self, html_content):
        """HTML에 skip link 추가"""
        if 'skip-link' in html_content or 'skip to' in html_content.lower():
            return html_content, False

        skip_link = '''    <!-- Skip to main content link for keyboard users -->
    <a href="#main-content" class="skip-link" data-i18n="app.skipLink">Skip to main</a>
'''

        # <body> 태그 직후에 삽입
        if '<body' in html_content:
            body_match = re.search(r'(<body[^>]*>)', html_content)
            if body_match:
                insert_pos = body_match.end()
                html_content = html_content[:insert_pos] + "\n" + skip_link + html_content[insert_pos:]
                return html_content, True

        return html_content, False

    def add_skip_link_css(self, css_content):
        """CSS에 skip link 스타일 추가"""
        if '.skip-link' in css_content:
            return css_content, False

        skip_css = """
/* Skip to main content link (keyboard navigation) */
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #9b59b6;
    color: white;
    padding: 8px 12px;
    text-decoration: none;
    border-radius: 0 0 4px 0;
    z-index: 100;
}

.skip-link:focus {
    top: 0;
}
"""

        css_content = css_content.rstrip() + "\n" + skip_css
        return css_content, True

    def fix_app_css(self, app_path):
        """앱 CSS 수정"""
        css_file = app_path / "css" / "style.css"
        if not css_file.exists():
            return 0

        with open(css_file, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        fixed_count = 0

        # 1. Focus-visible 추가
        content, changed = self.add_focus_visible_to_css(content)
        if changed:
            fixed_count += 1
            print(f"  + Added :focus-visible styles")

        # 2. prefers-reduced-motion 추가
        content, changed = self.add_prefers_reduced_motion(content)
        if changed:
            fixed_count += 1
            print(f"  + Added prefers-reduced-motion")

        # 3. High contrast support 추가
        content, changed = self.add_high_contrast_support(content)
        if changed:
            fixed_count += 1
            print(f"  + Added high contrast support")

        # 4. Touch targets 확보
        content, changed = self.ensure_touch_targets(content)
        if changed:
            fixed_count += 1
            print(f"  + Ensured touch target sizes")

        # 변경 사항 저장
        if content != original:
            with open(css_file, 'w', encoding='utf-8') as f:
                f.write(content)
            self.fixed_files.append(str(css_file))

        return fixed_count

    def fix_app_html(self, app_path):
        """앱 HTML 수정"""
        html_file = app_path / "index.html"
        if not html_file.exists():
            return 0

        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        fixed_count = 0

        # 1. Skip link 추가
        content, changed = self.add_skip_link_to_html(content)
        if changed:
            fixed_count += 1
            print(f"  + Added skip link")

        # 변경 사항 저장
        if content != original:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            self.fixed_files.append(str(html_file))

        return fixed_count

    def fix_all_apps(self):
        """모든 우선순위 앱 수정"""
        print("=" * 70)
        print("WCAG 2.1 AA Accessibility Fixes")
        print("=" * 70)

        total_fixes = 0

        for app_name in PRIORITY_APPS:
            app_path = PROJECT_ROOT / app_name
            if not app_path.exists():
                print(f"[SKIP] {app_name} not found")
                self.skipped_files.append(app_name)
                continue

            print(f"\n[{app_name}]")

            css_fixes = self.fix_app_css(app_path)
            html_fixes = self.fix_app_html(app_path)

            total = css_fixes + html_fixes
            if total == 0:
                print(f"  Already compliant")

            total_fixes += total

        print("\n" + "=" * 70)
        print(f"Summary: {total_fixes} issues fixed in {len(self.fixed_files)} files")
        print(f"Files modified:")
        for f in self.fixed_files:
            print(f"  - {f}")
        print("=" * 70)

if __name__ == "__main__":
    fixer = AccessibilityFixer()
    fixer.fix_all_apps()
