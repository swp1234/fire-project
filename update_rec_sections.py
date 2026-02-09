#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re
from pathlib import Path

projects_dir = Path(r"E:\Fire Project\projects")
apps = sorted([d.name for d in projects_dir.iterdir() if d.is_dir() and d.name not in ['portal', 'root-domain']])

new_apps = {
    'brain-type': ('🧠', '두뇌 유형 테스트', '당신의 뇌 유형은?'),
    'color-memory': ('🎨', '색상 기억력', '기억력 도전 게임'),
    'reaction-test': ('⚡', '반응속도 테스트', '당신의 반응속도는?')
}

game_apps = {'idle-clicker', 'emoji-merge', 'stack-tower', 'sky-runner', 'zigzag-runner', 'color-memory'}
test_apps = {'brain-type', 'mbti-love', 'emotion-temp', 'hsp-test', 'past-life', 'kpop-position', 'valentine', 'love-frequency', 'dev-quiz', 'quiz-app', 'reaction-test'}

def get_app_type(app_name):
    """앱의 유형을 판단 (game, test, util)"""
    if app_name in game_apps:
        return 'game'
    elif app_name in test_apps:
        return 'test'
    else:
        return 'util'

def extract_rec_links(html_content):
    """현재 추천 섹션에서 앱 링크를 추출"""
    links = re.findall(r'dopabrain\.com/([a-z0-9-]+)/', html_content)
    return set(links)

def build_new_rec_cards(existing_links, current_app):
    """현재 추천 링크에 새 앱 추가된 카드를 생성"""
    html_cards = []

    # 새 앱 추가
    for app_name in new_apps:
        if app_name not in existing_links and app_name != current_app:
            emoji, name, desc = new_apps[app_name]
            html_cards.append(f'''                <a href="https://dopabrain.com/{app_name}/" class="rec-card">
                    <span class="rec-emoji">{emoji}</span>
                    <span class="rec-name">{name}</span>
                    <span class="rec-desc">{desc}</span>
                </a>''')

    return '\n'.join(html_cards)

def update_app_rec_section(app_path, app_name):
    """앱의 rec-section/recommendations-section을 업데이트"""
    try:
        with open(app_path, 'r', encoding='utf-8') as f:
            content = f.read()

        existing_links = extract_rec_links(content)
        existing_links.discard(app_name)  # 자신 제외

        # 추가할 새 앱들 찾기
        to_add = []
        for new_app in new_apps:
            if new_app not in existing_links and new_app != app_name:
                to_add.append(new_app)

        if not to_add:
            return False, "No new apps to add"

        # 새로운 카드 HTML 생성
        new_cards_html = build_new_rec_cards(existing_links, app_name)

        # 마지막 rec-card 다음에 새 카드 삽입
        # rec-card의 마지막을 찾아서 그 다음에 삽입
        pattern = r'(</a>)(\s*</div>\s*</section>)'  # 마지막 </a> 찾기

        if re.search(pattern, content):
            # rec-section이 있는 경우
            replacement = rf'\1\n{new_cards_html}\2'
            new_content = re.sub(pattern, replacement, content)
        else:
            # 패턴이 없으면 건너뛰기
            return False, f"Could not find rec-section pattern"

        with open(app_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        return True, f"Added: {', '.join(to_add)}"

    except Exception as e:
        return False, f"Error: {e}"

# 모든 앱 업데이트
print("=== UPDATING RECOMMENDATION SECTIONS ===\n")

success_count = 0
fail_count = 0

for app in apps:
    if app in new_apps:
        continue  # 새 앱 자신은 스킵

    html_path = projects_dir / app / "index.html"
    if html_path.exists():
        success, msg = update_app_rec_section(html_path, app)

        if success:
            print(f"OK: {app} - {msg}")
            success_count += 1
        else:
            print(f"SKIP: {app} - {msg}")
            fail_count += 1

print(f"\n=== RESULTS ===")
print(f"Updated: {success_count}")
print(f"Skipped/Failed: {fail_count}")
