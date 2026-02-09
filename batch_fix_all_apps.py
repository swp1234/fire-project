#!/usr/bin/env python3
"""
모든 앱의 PWA 설정을 일괄 수정
"""
import os
import json
import re

APPS_DIR = r"E:\Fire Project\projects"

# 이미 수정한 앱 (제외)
COMPLETED = {"quiz-app", "affirmation", "detox-timer"}

APPS = [
    "brain-type", "color-memory", "dday-counter",
    "dev-quiz", "dream-fortune", "emoji-merge", "emotion-temp", "hsp-test",
    "idle-clicker", "kpop-position", "lottery", "love-frequency", "mbti-love",
    "mbti-tips", "memory-card", "number-puzzle", "past-life",
    "portal", "reaction-test", "shopping-calc", "sky-runner", "stack-tower",
    "stress-check", "tax-refund-preview", "typing-speed", "unit-converter",
    "valentine", "white-noise", "word-scramble", "zigzag-runner", "snake-game"
]

def add_sw_registration(index_path):
    """index.html에 SW 등록 코드 추가"""
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 이미 있는지 확인
    if 'navigator.serviceWorker' in content:
        return False

    # </body> 찾기
    if '</body>' not in content:
        return False

    # SW 등록 코드
    sw_code = '''
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

    # </body> 앞에 삽입
    new_content = content.replace('</body>', sw_code + '\n</body>')

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True

def fix_sw_js(sw_path):
    """sw.js를 표준 형식으로 수정"""
    with open(sw_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # 캐시 이름 추출
    cache_match = re.search(r"const CACHE_NAME = ['\"]([^'\"]+)['\"]", content)
    if not cache_match:
        return False

    cache_name = cache_match.group(1)

    # 기본 캐시 리스트 (모든 앱용)
    urls_to_cache = [
        './',
        './index.html',
        './css/style.css',
        './js/app.js',
        './js/i18n.js',
        './manifest.json',
        './icon-192.svg',
        './icon-512.svg',
        './js/locales/ko.json',
        './js/locales/en.json',
        './js/locales/zh.json',
        './js/locales/hi.json',
        './js/locales/ru.json',
        './js/locales/ja.json',
        './js/locales/es.json',
        './js/locales/pt.json',
        './js/locales/id.json',
        './js/locales/tr.json',
        './js/locales/de.json',
        './js/locales/fr.json'
    ]

    # 캐시 리스트 문자열 생성
    cache_list = "const urlsToCache = [\n"
    for i, url in enumerate(urls_to_cache):
        cache_list += f"    '{url}'"
        if i < len(urls_to_cache) - 1:
            cache_list += ","
        cache_list += "\n"
    cache_list += "];"

    # 기존 urlsToCache 영역 교체
    urls_pattern = r"const urlsToCache = \[[\s\S]*?\];"
    new_content = re.sub(urls_pattern, cache_list, content, count=1)

    # install 이벤트에 skipWaiting 추가
    if 'self.skipWaiting()' not in new_content:
        # install 이벤트 찾기 및 수정
        install_pattern = r"(self\.addEventListener\(['\"]install['\"],\s*\(event\)\s*=>\s*\{[\s\S]*?cache\.addAll\(urlsToCache\)\)[\s\S]*?\);)([\s\S]*?\}\);)"

        # 간단한 방식: );  바로 앞에 추가
        new_content = re.sub(
            r"(\s+\);)\s*\n\s*}\);(\s*//)",
            r"\1\n    self.skipWaiting();\n})",
            new_content
        )

    # Fetch 이벤트 개선
    if 'Cache hit' not in new_content:
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

        # fetch 이벤트 찾아서 교체
        fetch_pattern = r"self\.addEventListener\(['\"]fetch['\"][\s\S]*?\}\);\s*\}\);"
        new_content = re.sub(fetch_pattern, fetch_handler, new_content)

    # Activate 이벤트에 claim() 추가
    if 'self.clients.claim()' not in new_content:
        new_content = new_content.replace(
            '});\n});',
            '}).then(() => self.clients.claim());\n});'
        )

    with open(sw_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True

def fix_manifest_json(manifest_path):
    """manifest.json에서 중복/잘못된 아이콘 제거"""
    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    if "icons" not in manifest:
        return False

    app_dir = os.path.dirname(manifest_path)
    new_icons = []
    seen = set()

    for icon in manifest["icons"]:
        src = icon.get("src", "")

        # 파일 존재 여부 확인
        icon_path = os.path.join(app_dir, src)
        if not os.path.exists(icon_path):
            # .svg 또는 .png 찾기
            base = os.path.splitext(src)[0]
            if os.path.exists(os.path.join(app_dir, f"{base}.svg")):
                src = f"{base}.svg"
                icon["src"] = src
                icon["type"] = "image/svg+xml"
            elif os.path.exists(os.path.join(app_dir, f"{base}.png")):
                src = f"{base}.png"
                icon["src"] = src
                icon["type"] = "image/png"
            else:
                continue  # 파일이 없으면 스킵

        # 중복 확인 (src + sizes)
        key = (src, icon.get("sizes"))
        if key in seen:
            continue
        seen.add(key)

        # purpose 통합 (any + maskable)
        purpose = icon.get("purpose", "any")
        purposes = set(purpose.split() if isinstance(purpose, str) else ["any"])
        purposes.add("any")
        purposes.add("maskable")
        icon["purpose"] = " ".join(sorted(purposes))

        new_icons.append(icon)

    manifest["icons"] = new_icons

    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    return True

def process_app(app_name):
    """앱 처리"""
    if app_name in COMPLETED:
        return None  # 스킵

    app_path = os.path.join(APPS_DIR, app_name)

    if not os.path.isdir(app_path):
        return {"app": app_name, "status": "MISSING"}

    result = {"app": app_name, "changes": []}

    # 1. index.html
    index_path = os.path.join(app_path, "index.html")
    if os.path.exists(index_path):
        if add_sw_registration(index_path):
            result["changes"].append("+ SW 등록 코드 추가")
    else:
        result["changes"].append("- index.html 없음")

    # 2. sw.js
    sw_path = os.path.join(app_path, "sw.js")
    if os.path.exists(sw_path):
        if fix_sw_js(sw_path):
            result["changes"].append("+ sw.js 수정")
    else:
        result["changes"].append("- sw.js 없음")

    # 3. manifest.json
    manifest_path = os.path.join(app_path, "manifest.json")
    if os.path.exists(manifest_path):
        if fix_manifest_json(manifest_path):
            result["changes"].append("+ manifest.json 정규화")
    else:
        result["changes"].append("- manifest.json 없음")

    return result

# 실행
print("=" * 100)
print(f"PWA 일괄 수정 ({len(APPS)}개 앱)")
print("=" * 100)

success_count = 0
for app in sorted(APPS):
    result = process_app(app)

    if result is None:
        continue

    if result["status"] == "MISSING":
        print(f"❌ {app:25} 폴더 없음")
    else:
        print(f"✅ {app:25}")
        for change in result["changes"]:
            print(f"   {change}")
        success_count += 1

print("\n" + "=" * 100)
print(f"수정 완료: {success_count}/{len(APPS)} 앱")
print("=" * 100)
