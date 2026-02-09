#!/usr/bin/env python3
"""빠른 PWA 상태 스캔"""
import os
import json
from pathlib import Path

APPS_DIR = r"E:\Fire Project\projects"

APPS = [
    "affirmation", "brain-type", "color-memory", "dday-counter", "detox-timer",
    "dev-quiz", "dream-fortune", "emoji-merge", "emotion-temp", "hsp-test",
    "idle-clicker", "kpop-position", "lottery", "love-frequency", "mbti-love",
    "mbti-tips", "memory-card", "number-puzzle", "past-life",
    "quiz-app", "reaction-test", "shopping-calc", "sky-runner", "stack-tower",
    "stress-check", "tax-refund-preview", "typing-speed", "unit-converter",
    "valentine", "white-noise", "word-scramble", "zigzag-runner", "snake-game", "portal"
]

def scan_app(app_name):
    """앱 상태 스캔"""
    app_path = os.path.join(APPS_DIR, app_name)

    if not os.path.isdir(app_path):
        return {"app": app_name, "exists": False}

    result = {
        "app": app_name,
        "exists": True,
        "has_index": os.path.exists(os.path.join(app_path, "index.html")),
        "has_sw": os.path.exists(os.path.join(app_path, "sw.js")),
        "has_manifest": os.path.exists(os.path.join(app_path, "manifest.json")),
        "has_sw_register": False,
        "has_icon_192": False,
        "has_icon_512": False,
        "icon_types": []
    }

    # index.html에 SW 등록 확인
    if result["has_index"]:
        with open(os.path.join(app_path, "index.html"), 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            result["has_sw_register"] = 'navigator.serviceWorker' in content or 'registerServiceWorker' in content

    # 아이콘 확인
    for ext in ['svg', 'png']:
        if os.path.exists(os.path.join(app_path, f"icon-192.{ext}")):
            result["has_icon_192"] = True
            result["icon_types"].append(f"192-{ext}")
        if os.path.exists(os.path.join(app_path, f"icon-512.{ext}")):
            result["has_icon_512"] = True
            result["icon_types"].append(f"512-{ext}")

    return result

# 스캔 실행
print("=" * 100)
print("PWA 상태 스캔 (34개 앱)")
print("=" * 100)

results = []
for app in sorted(APPS):
    result = scan_app(app)
    results.append(result)

    if result["exists"]:
        # 체크마크
        checks = [
            "✓" if result["has_index"] else "✗",
            "✓" if result["has_sw"] else "✗",
            "✓" if result["has_manifest"] else "✗",
            "✓" if result["has_sw_register"] else "✗",
            "✓" if result["has_icon_192"] and result["has_icon_512"] else "✗"
        ]
        icons_str = f"[{','.join(result['icon_types'])}]" if result['icon_types'] else "[]"
        print(f"{app:25} {' '.join(checks)} {icons_str}")

# 요약
print("\n" + "=" * 100)
existing = sum(1 for r in results if r["exists"])
has_all_files = sum(1 for r in results if r["exists"] and r["has_index"] and r["has_sw"] and r["has_manifest"])
has_sw_register = sum(1 for r in results if r["exists"] and r["has_sw_register"])
has_icons = sum(1 for r in results if r["exists"] and r["has_icon_192"] and r["has_icon_512"])

print(f"총 앱: {existing}/{len(APPS)}")
print(f"필수 파일 모두 있음: {has_all_files}/{existing}")
print(f"SW 등록됨: {has_sw_register}/{existing}")
print(f"아이콘 모두 있음: {has_icons}/{existing}")
print("=" * 100)

# Legend
print("\n범례: [index.html] [sw.js] [manifest.json] [SW register] [icons]")
