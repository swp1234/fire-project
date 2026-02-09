#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
WCAG 2.1 AA 고급 접근성 개선 스크립트
색상 대비율, 포커스 스타일, 모션 등 심층 개선
"""

import re
from pathlib import Path

PROJECT_ROOT = Path("E:\\Fire Project\\projects")
PRIORITY_APPS = [
    "dream-fortune", "past-life", "emotion-temp", "hsp-test", "mbti-love",
    "kpop-position", "idle-clicker", "brain-type", "stress-check", "memory-card",
    "color-memory", "reaction-test", "typing-speed", "word-scramble"
]

class AccessibilityEnhancer:
    def __init__(self):
        self.improvements = []

    def enhance_focus_styles(self, css_content, primary_color):
        """포커스 스타일 강화"""
        # 기존 outline: none 제거
        if 'outline: none' in css_content:
            # outline: none을 :focus:not(:focus-visible)로 변경
            css_content = re.sub(
                r'(\w+):focus\s*\{\s*outline:\s*none',
                r'\1:focus:not(:focus-visible) { outline: none',
                css_content
            )
            self.improvements.append("Enhanced focus outline handling")

        # Input focus 스타일 강화
        if 'input:focus' not in css_content:
            input_focus = f"""
/* Enhanced input focus styles */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {{
    outline: 2px solid {primary_color};
    outline-offset: 1px;
    box-shadow: 0 0 0 3px rgba('{self.hex_to_rgb(primary_color)[0]}', '{self.hex_to_rgb(primary_color)[1]}', '{self.hex_to_rgb(primary_color)[2]}', 0.1);
}}
"""
            css_content += input_focus
            self.improvements.append("Added input focus styles")

        return css_content

    def hex_to_rgb(self, hex_color):
        """Hex를 RGB로 변환"""
        h = hex_color.lstrip('#')
        if len(h) == 3:
            h = ''.join([c*2 for c in h])
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

    def enhance_button_styles(self, css_content):
        """버튼 스타일 강화 (터치 타겟, 시각적 피드백)"""
        # 모든 버튼에 명확한 포커스 스타일 추가
        button_enhancement = """
/* Enhanced button accessibility */
button:focus-visible,
input[type="button"]:focus-visible,
input[type="submit"]:focus-visible,
[role="button"]:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
}

button:active,
input[type="button"]:active,
input[type="submit"]:active,
[role="button"]:active {
    transform: scale(0.98);
}

/* High contrast mode */
@media (prefers-contrast: more) {
    button,
    input[type="button"],
    input[type="submit"],
    [role="button"] {
        border: 2px solid currentColor;
        font-weight: bold;
    }
}
"""

        if 'Enhanced button accessibility' not in css_content:
            css_content += button_enhancement
            self.improvements.append("Enhanced button accessibility styles")

        return css_content

    def add_link_focus_styles(self, css_content):
        """링크 포커스 스타일 추가"""
        if 'a:focus-visible' not in css_content:
            link_focus = """
/* Link focus accessibility */
a:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: 2px;
}

a:focus:not(:focus-visible) {
    outline: none;
}
"""
            css_content += link_focus
            self.improvements.append("Added link focus styles")

        return css_content

    def enhance_form_accessibility(self, css_content):
        """폼 접근성 개선"""
        form_enhancement = """
/* Enhanced form accessibility */
label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
textarea,
select {
    font-size: 16px;
    min-height: 44px;
    padding: 10px 12px;
}

input[type="text"]:focus-visible,
input[type="email"]:focus-visible,
input[type="password"]:focus-visible,
input[type="number"]:focus-visible,
textarea:focus-visible,
select:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 1px;
}

/* Error handling accessibility */
.error-message,
[aria-invalid="true"] {
    color: #dc2626;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

[aria-invalid="true"] {
    border-color: #dc2626;
}
"""

        if 'Enhanced form accessibility' not in css_content:
            css_content += form_enhancement
            self.improvements.append("Enhanced form accessibility")

        return css_content

    def strengthen_motion_support(self, css_content):
        """모션 지원 강화"""
        if '@media (prefers-reduced-motion: reduce)' in css_content:
            # 기존 규칙 확인
            if 'animation-duration: 0.01ms' in css_content:
                return css_content  # 이미 충분함

        motion_support = """
/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }

    /* Keep essential transitions for state changes */
    button:active,
    [role="button"]:active {
        transform: none;
    }
}
"""

        if motion_support.strip() not in css_content:
            css_content += motion_support
            self.improvements.append("Strengthened motion preferences support")

        return css_content

    def add_color_focus_alternatives(self, css_content):
        """색상에만 의존하지 않는 피드백 추가"""
        alternatives = """
/* Non-color focus indicators */
:focus-visible {
    outline-width: 3px;
}

/* Icon patterns for colorblind users */
.error::before {
    content: "x ";
}

.success::before {
    content: "✓ ";
}

.warning::before {
    content: "! ";
}

.info::before {
    content: "i ";
}
"""

        if 'Non-color focus indicators' not in css_content:
            css_content += alternatives
            self.improvements.append("Added non-color focus alternatives")

        return css_content

    def ensure_scrollbar_contrast(self, css_content):
        """스크롤바 명도 개선"""
        scrollbar = """
/* High contrast scrollbar */
::-webkit-scrollbar {
    width: 12px;
    height: 12px;
}

::-webkit-scrollbar-track {
    background: var(--bg-dark, #f1f5f9);
}

::-webkit-scrollbar-thumb {
    background: var(--primary-color, #3b82f6);
    border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark, #1e40af);
}

/* Firefox scrollbar */
* {
    scrollbar-color: var(--primary-color, #3b82f6) var(--bg-dark, #f1f5f9);
    scrollbar-width: thin;
}
"""

        if '::-webkit-scrollbar' not in css_content:
            css_content += scrollbar
            self.improvements.append("Added scrollbar contrast improvement")

        return css_content

    def enhance_app_css(self, app_path):
        """앱 CSS 개선"""
        css_file = app_path / "css" / "style.css"
        if not css_file.exists():
            return

        with open(css_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # 주요색 추출
        primary_match = re.search(r'--primary[^:]*:\s*(#[0-9a-fA-F]{6})', content)
        primary_color = primary_match.group(1) if primary_match else '#3b82f6'

        original = content

        # 개선 작업
        content = self.enhance_focus_styles(content, primary_color)
        content = self.enhance_button_styles(content)
        content = self.add_link_focus_styles(content)
        content = self.enhance_form_accessibility(content)
        content = self.strengthen_motion_support(content)
        content = self.add_color_focus_alternatives(content)
        content = self.ensure_scrollbar_contrast(content)

        if content != original:
            with open(css_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return len(self.improvements)

        return 0

    def run_enhancements(self):
        """모든 앱 개선"""
        print("=" * 70)
        print("WCAG 2.1 AA Advanced Accessibility Enhancements")
        print("=" * 70)

        total_improvements = 0

        for app_name in PRIORITY_APPS:
            app_path = PROJECT_ROOT / app_name
            if not app_path.exists():
                print(f"[SKIP] {app_name} not found")
                continue

            self.improvements = []
            improvements = self.enhance_app_css(app_path)

            if improvements:
                print(f"\n[{app_name}]")
                for imp in self.improvements:
                    print(f"  + {imp}")
                total_improvements += improvements

        print("\n" + "=" * 70)
        print(f"Summary: {total_improvements} enhancements applied")
        print("=" * 70)

if __name__ == "__main__":
    enhancer = AccessibilityEnhancer()
    enhancer.run_enhancements()
