#!/usr/bin/env python3
"""PWA 검증 및 수정 스크립트"""
import os
import json
import re
from pathlib import Path

APPS_DIR = "E:\\Fire Project\\projects"

APPS = [
    "affirmation", "brain-type", "color-memory", "dday-counter", "detox-timer",
    "dev-quiz", "dream-fortune", "emoji-merge", "emotion-temp", "hsp-test",
    "idle-clicker", "kpop-position", "lottery", "love-frequency", "mbti-love",
    "mbti-tips", "memory-card", "number-puzzle", "past-life",
    "quiz-app", "reaction-test", "shopping-calc", "sky-runner", "stack-tower",
    "stress-check", "tax-refund-preview", "typing-speed", "unit-converter",
    "valentine", "white-noise", "word-scramble", "zigzag-runner", "snake-game"
]

def find_files(app_path, pattern):
    """앱 폴더 내에서 특정 파일 찾기"""
    result = []
    for root, dirs, files in os.walk(app_path):
        for file in files:
            if re.match(pattern, file):
                result.append(os.path.join(root, file))
    return result

def validate_app(app_name):
    """각 앱의 PWA 설정 검증"""
    app_path = os.path.join(APPS_DIR, app_name)

    if not os.path.isdir(app_path):
        return {"app": app_name, "status": "MISSING", "issues": []}

    result = {
        "app": app_name,
        "status": "OK",
        "issues": [],
        "files": {}
    }

    # 1. index.html 확인
    index_path = os.path.join(app_path, "index.html")
    if os.path.exists(index_path):
        result["files"]["index.html"] = True
        with open(index_path, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()
            if '<link rel="manifest"' not in html:
                result["issues"].append("index.html에 manifest.json link 없음")
            if 'registerServiceWorker' not in html and 'service' not in html.lower():
                result["issues"].append("index.html에 Service Worker 등록 스크립트 없음")
            if 'theme-color' not in html:
                result["issues"].append("index.html에 theme-color 메타태그 없음")
    else:
        result["issues"].append("❌ index.html 파일 없음")
        result["status"] = "ERROR"

    # 2. sw.js 확인
    sw_path = os.path.join(app_path, "sw.js")
    if os.path.exists(sw_path):
        result["files"]["sw.js"] = True
        with open(sw_path, 'r', encoding='utf-8', errors='ignore') as f:
            sw = f.read()
            has_issues = False
            if 'install' not in sw:
                result["issues"].append("sw.js에 install 이벤트 없음")
                has_issues = True
            if 'fetch' not in sw:
                result["issues"].append("sw.js에 fetch 이벤트 없음")
                has_issues = True
            if 'activate' not in sw:
                result["issues"].append("sw.js에 activate 이벤트 없음")
                has_issues = True
            if has_issues:
                result["status"] = "ERROR"
    else:
        result["issues"].append("❌ sw.js 파일 없음")
        result["status"] = "ERROR"

    # 3. manifest.json 확인
    manifest_path = os.path.join(app_path, "manifest.json")
    if os.path.exists(manifest_path):
        result["files"]["manifest.json"] = True
        try:
            with open(manifest_path, 'r', encoding='utf-8') as f:
                manifest = json.load(f)

                # manifest 필수 필드 확인
                if "name" not in manifest:
                    result["issues"].append("manifest.name 없음")
                if "display" not in manifest:
                    result["issues"].append("manifest.display 없음")
                elif manifest["display"] != "standalone":
                    result["issues"].append(f"manifest.display가 '{manifest['display']}'임 (standalone 권장)")

                if "icons" not in manifest or len(manifest["icons"]) == 0:
                    result["issues"].append("manifest.icons 배열 비어있음")
                    result["status"] = "ERROR"
                else:
                    # 아이콘 파일 확인
                    missing_icons = []
                    for icon in manifest["icons"]:
                        src = icon.get("src", "")
                        icon_path = os.path.join(app_path, src)
                        if not os.path.exists(icon_path):
                            # .svg 또는 .png 파일 중 하나라도 있는지 확인
                            base_name = os.path.splitext(src)[0]
                            svg_path = os.path.join(app_path, f"{base_name}.svg")
                            png_path = os.path.join(app_path, f"{base_name}.png")

                            if not os.path.exists(svg_path) and not os.path.exists(png_path):
                                missing_icons.append(src)

                    if missing_icons:
                        result["issues"].append(f"아이콘 파일 없음: {', '.join(missing_icons)}")

        except json.JSONDecodeError as e:
            result["issues"].append(f"manifest.json JSON 파싱 오류: {str(e)}")
            result["status"] = "ERROR"
    else:
        result["issues"].append("❌ manifest.json 파일 없음")
        result["status"] = "ERROR"

    # 4. 아이콘 파일 확인
    icon_192_exists = os.path.exists(os.path.join(app_path, "icon-192.svg")) or \
                      os.path.exists(os.path.join(app_path, "icon-192.png"))
    icon_512_exists = os.path.exists(os.path.join(app_path, "icon-512.svg")) or \
                      os.path.exists(os.path.join(app_path, "icon-512.png"))

    if not icon_192_exists:
        result["issues"].append("아이콘 파일 없음: icon-192 (svg 또는 png)")
    if not icon_512_exists:
        result["issues"].append("아이콘 파일 없음: icon-512 (svg 또는 png)")

    if not result["issues"]:
        result["status"] = "OK"
    else:
        result["status"] = "WARNING" if result["status"] != "ERROR" else "ERROR"

    return result

# 실행
print("=" * 100)
print("PWA 설정 검증 시작 (34개 앱)")
print("=" * 100)

all_results = []
error_count = 0
warning_count = 0
ok_count = 0

for app in sorted(APPS):
    result = validate_app(app)
    all_results.append(result)

    if result["status"] == "OK":
        ok_count += 1
        status_icon = "✅"
    elif result["status"] == "WARNING":
        warning_count += 1
        status_icon = "⚠️"
    elif result["status"] == "ERROR":
        error_count += 1
        status_icon = "❌"
    else:
        status_icon = "❓"

    print(f"{status_icon} {app:25} {result['status']:10} ({len(result['issues'])} 문제)")
    if result["issues"]:
        for issue in result["issues"][:3]:  # 처음 3개만 표시
            print(f"     {issue}")
        if len(result["issues"]) > 3:
            print(f"     ... 외 {len(result['issues']) - 3}개 문제")

print("\n" + "=" * 100)
print(f"검증 완료")
print(f"  ✅ OK: {ok_count}/{len(APPS)}")
print(f"  ⚠️ WARNING: {warning_count}/{len(APPS)}")
print(f"  ❌ ERROR: {error_count}/{len(APPS)}")
print("=" * 100)

# 문제별 요약
print("\n문제 요약:")
issue_count = {}
for result in all_results:
    for issue in result["issues"]:
        # 첫 부분을 키로 사용
        key = issue.split(":")[0]
        issue_count[key] = issue_count.get(key, 0) + 1

for issue, count in sorted(issue_count.items(), key=lambda x: -x[1]):
    print(f"  • {issue}: {count}개 앱")
