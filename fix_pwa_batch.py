#!/usr/bin/env python3
"""
모든 앱의 PWA 설정을 일괄 수정하는 스크립트
1. index.html에 SW 등록 코드 추가
2. sw.js 업데이트 (절대 경로 → 상대 경로, i18n 파일 추가)
3. manifest.json 정규화 (중복된 PNG 아이콘 제거)
"""
import os
import json
import re
from pathlib import Path

APPS_DIR = r"E:\Fire Project\projects"

# 이미 수정한 앱 (제외)
COMPLETED = {"quiz-app", "affirmation"}

APPS = [
    "brain-type", "color-memory", "dday-counter", "detox-timer",
    "dev-quiz", "dream-fortune", "emoji-merge", "emotion-temp", "hsp-test",
    "idle-clicker", "kpop-position", "lottery", "love-frequency", "mbti-love",
    "mbti-tips", "memory-card", "number-puzzle", "past-life",
    "reaction-test", "shopping-calc", "sky-runner", "stack-tower",
    "stress-check", "tax-refund-preview", "typing-speed", "unit-converter",
    "valentine", "white-noise", "word-scramble", "zigzag-runner", "snake-game"
]

def fix_index_html(app_path):
    """index.html에 Service Worker 등록 코드 추가"""
    index_path = os.path.join(app_path, "index.html")
    if not os.path.exists(index_path):
        return False, "index.html 없음"

    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 이미 SW 등록이 있는지 확인
    if 'navigator.serviceWorker' in content or 'registerServiceWorker' in content:
        return False, "이미 SW 등록됨"

    # 종료 태그 찾기
    if '</body>' not in content:
        return False, "</body> 태그 없음"

    # SW 등록 코드
    sw_script = '''
    <!-- Service Worker 등록 -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(registration => console.log('Service Worker registered'))
                    .catch(error => console.log('Service Worker registration failed:', error));
            });
        }
    </script>
'''

    # </body> 전에 추가
    new_content = content.replace('</body>', sw_script + '\n</body>')

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True, "SW 등록 코드 추가됨"

def fix_sw_js(app_path, app_name):
    """sw.js를 표준 형식으로 수정"""
    sw_path = os.path.join(app_path, "sw.js")
    if not os.path.exists(sw_path):
        return False, "sw.js 없음"

    with open(sw_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # CACHE_NAME 추출
    cache_match = re.search(r"const CACHE_NAME = ['\"]([^'\"]+)['\"]", content)
    if not cache_match:
        return False, "CACHE_NAME을 찾을 수 없음"

    cache_name = cache_match.group(1)

    # 앱 폴더 내 파일 목록 스캔
    js_files = []
    css_files = []
    locale_files = []

    for root, dirs, files in os.walk(app_path):
        # .git 폴더 제외
        dirs[:] = [d for d in dirs if d != '.git']

        for file in files:
            rel_path = os.path.relpath(os.path.join(root, file), app_path)
            rel_path = './' + rel_path.replace('\\', '/')

            if file.endswith('.js') and not file.startswith('sw'):
                js_files.append(rel_path)
            elif file.endswith('.css'):
                css_files.append(rel_path)
            elif rel_path.startswith('./js/locales/') and file.endswith('.json'):
                locale_files.append(rel_path)

    # 캐시 파일 목록 생성
    urls_to_cache = [
        './',
        './index.html'
    ]

    # CSS 파일들 추가
    for css_file in sorted(css_files):
        urls_to_cache.append(css_file)

    # JS 파일들 추가 (i18n은 먼저)
    for js_file in sorted(js_files):
        if 'i18n' in js_file:
            urls_to_cache.insert(len(urls_to_cache), js_file)
            break

    for js_file in sorted(js_files):
        if 'i18n' not in js_file:
            urls_to_cache.append(js_file)

    # manifest.json
    urls_to_cache.append('./manifest.json')

    # 아이콘 추가
    for icon_file in ['icon-192.svg', 'icon-512.svg', 'icon-192.png', 'icon-512.png']:
        icon_path = os.path.join(app_path, icon_file)
        if os.path.exists(icon_path):
            urls_to_cache.append(f'./{icon_file}')

    # 로케일 파일 추가
    if locale_files:
        for locale_file in sorted(locale_files):
            if locale_file not in urls_to_cache:
                urls_to_cache.append(locale_file)
    else:
        # 기본 로케일 파일 추가
        locales = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']
        for locale in locales:
            urls_to_cache.append(f'./js/locales/{locale}.json')

    # 캐시 리스트를 JavaScript 배열로 변환
    cache_list_js = "const urlsToCache = [\n"
    for i, url in enumerate(urls_to_cache):
        cache_list_js += f"    '{url}'"
        if i < len(urls_to_cache) - 1:
            cache_list_js += ","
        cache_list_js += "\n"
    cache_list_js += "];"

    # 기존 urlsToCache 부분을 교체
    urls_pattern = r"const urlsToCache = \[[\s\S]*?\];"
    new_content = re.sub(urls_pattern, cache_list_js, content, count=1)

    # install 이벤트 업데이트
    if 'self.skipWaiting()' not in new_content:
        new_content = re.sub(
            r"(self\.addEventListener\('install'.*?caches\.open\(CACHE_NAME\).*?\.then\(cache => cache\.addAll\(urlsToCache\)\).*?\);)",
            r"\1\n    self.skipWaiting();",
            new_content,
            flags=re.DOTALL
        )

    # fetch 이벤트 개선 (캐시 업데이트 로직)
    fetch_pattern = r"self\.addEventListener\('fetch',[\s\S]*?\};\s*\}\);\s*\}\);"
    if fetch_pattern not in new_content or 'Cache hit' not in new_content:
        fetch_handler = '''self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    // Cache hit - return cached version, but also fetch update
                    fetch(event.request).then(fetchResponse => {
                        if (fetchResponse && fetchResponse.status === 200) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, fetchResponse);
                            });
                        }
                    }).catch(() => {});
                    return response;
                }
                return fetch(event.request);
            })
    );
});'''
        # fetch 이벤트 교체
        new_content = re.sub(
            r"self\.addEventListener\('fetch'[\s\S]*?\}\);\s*\}\);",
            fetch_handler,
            new_content
        )

    # activate 이벤트 업데이트
    if '.clients.claim()' not in new_content:
        new_content = re.sub(
            r"(\.then\(\(\) => self\.clients\.claim\(\)\))",
            r".then(() => self.clients.claim())",
            new_content
        )
        # claim() 메서드가 없으면 추가
        if 'self.clients.claim()' not in new_content:
            new_content = re.sub(
                r"(caches\.delete\(cacheName\);\s*\}\)\s*\);)",
                r"\1.then(() => self.clients.claim())",
                new_content
            )

    with open(sw_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True, f"sw.js 수정됨 ({len(urls_to_cache)} 파일 캐싱)"

def fix_manifest_json(app_path, app_name):
    """manifest.json 정규화"""
    manifest_path = os.path.join(app_path, "manifest.json")
    if not os.path.exists(manifest_path):
        return False, "manifest.json 없음"

    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    # icons 배열 정규화
    if "icons" in manifest:
        new_icons = []
        seen = set()

        for icon in manifest["icons"]:
            src = icon.get("src", "")
            # 파일 존재 여부 확인
            icon_path = os.path.join(app_path, src)
            if not os.path.exists(icon_path):
                # .svg 또는 .png 파일 중 하나라도 있는지 확인
                base_name = os.path.splitext(src)[0]
                svg_path = os.path.join(app_path, f"{base_name}.svg")
                png_path = os.path.join(app_path, f"{base_name}.png")

                # 실제 파일이 있는 것을 사용
                if os.path.exists(svg_path):
                    src = f"{base_name}.svg"
                    icon["src"] = src
                    icon["type"] = "image/svg+xml"
                elif os.path.exists(png_path):
                    src = f"{base_name}.png"
                    icon["src"] = src
                    icon["type"] = "image/png"
                else:
                    # 파일이 없으면 스킵
                    continue

            # 중복 제거 (같은 src + 크기)
            key = (icon.get("src"), icon.get("sizes"))
            if key not in seen:
                seen.add(key)
                # purpose 통합
                purpose_list = []
                if icon.get("purpose"):
                    purpose_list = icon["purpose"].split()
                if "any" not in purpose_list:
                    purpose_list.append("any")
                if "maskable" not in purpose_list:
                    purpose_list.append("maskable")

                icon["purpose"] = " ".join(sorted(purpose_list))
                new_icons.append(icon)

        manifest["icons"] = new_icons

    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    return True, f"manifest.json 정규화됨 ({len(manifest['icons'])} 아이콘)"

def fix_app(app_name):
    """앱 수정"""
    app_path = os.path.join(APPS_DIR, app_name)
    if not os.path.isdir(app_path):
        return {"app": app_name, "status": "MISSING"}

    result = {"app": app_name, "status": "OK", "changes": []}

    # 1. index.html 수정
    success, msg = fix_index_html(app_path)
    if success:
        result["changes"].append(msg)
    elif msg != "이미 SW 등록됨":
        result["status"] = "WARNING"
        result["changes"].append(f"⚠️ {msg}")

    # 2. sw.js 수정
    success, msg = fix_sw_js(app_path, app_name)
    if success:
        result["changes"].append(msg)
    else:
        result["status"] = "WARNING"
        result["changes"].append(f"⚠️ {msg}")

    # 3. manifest.json 수정
    success, msg = fix_manifest_json(app_path, app_name)
    if success:
        result["changes"].append(msg)
    else:
        result["status"] = "WARNING"
        result["changes"].append(f"⚠️ {msg}")

    return result

# 실행
print("=" * 100)
print("PWA 일괄 수정 (30개 앱)")
print("=" * 100)

all_results = []
for app in sorted(APPS):
    result = fix_app(app)
    all_results.append(result)

    status_icon = "✅" if result["status"] == "OK" else "⚠️"
    print(f"{status_icon} {app:25} {result['status']}")
    for change in result["changes"]:
        print(f"     {change}")

print("\n" + "=" * 100)
ok_count = sum(1 for r in all_results if r["status"] == "OK")
warning_count = sum(1 for r in all_results if r["status"] == "WARNING")
missing_count = sum(1 for r in all_results if r["status"] == "MISSING")

print(f"수정 완료")
print(f"  ✅ OK: {ok_count}/{len(APPS)}")
print(f"  ⚠️ WARNING: {warning_count}/{len(APPS)}")
print(f"  ❌ MISSING: {missing_count}/{len(APPS)}")
print("=" * 100)

# portal 앱 처리
print("\nPortal 앱 확인 중...")
result = fix_app("portal")
print(f"{result['status']:25} portal")
for change in result["changes"]:
    print(f"     {change}")
