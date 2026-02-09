#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
mbti-love의 JSON 파일에서 쉼표 누락 문제 수정
"""

import os
import re
from pathlib import Path

LOCALE_DIR = r"E:\Fire Project\projects\mbti-love\js\locales"

def fix_missing_comma(filepath):
    """JSON 파일에서 누락된 쉼표 수정"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # "game": { ... } 뒤에 "ads"가 바로 오는 경우 수정
        # 패턴: "back": "..."\n  }\n  "ads":
        pattern = r'("back":\s*"[^"]*")\n(\s*})\n(\s*)("ads":)'
        replacement = r'\1\n\2,\n\3\4'

        new_content = re.sub(pattern, replacement, content)

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """모든 mbti-love locale 파일 수정"""
    files = sorted(Path(LOCALE_DIR).glob('*.json'))

    for filepath in files:
        if fix_missing_comma(str(filepath)):
            print(f"[FIXED] {filepath.name}")
        else:
            print(f"[OK] {filepath.name}")

if __name__ == '__main__':
    main()
