#!/usr/bin/env python3
"""
Update cross-links (recommendations) in all DopaBrain apps - Version 2
Handles both new sections and existing sections
"""
import os
import re
from pathlib import Path

PROJECTS_BASE = "E:/Fire Project/projects"

# Complete list of all apps
ALL_APPS = {
    "quiz-app": ("상식 퀴즈", "🧠"),
    "shopping-calc": ("환전 계산기", "💱"),
    "detox-timer": ("디지털 디톡스", "📵"),
    "dream-fortune": ("꿈해몽/운세", "🔮"),
    "affirmation": ("일일 긍정", "💪"),
    "lottery": ("로또 번호 추천", "🎰"),
    "dday-counter": ("디데이 카운터", "⏳"),
    "mbti-tips": ("MBTI 팁", "📖"),
    "white-noise": ("화이트 노이즈", "🎵"),
    "dev-quiz": ("개발자 퀴즈", "💻"),
    "tax-refund-preview": ("연말정산", "📊"),
    "unit-converter": ("단위 변환기", "📏"),
    "emotion-temp": ("감정 온도계", "🌡️"),
    "hsp-test": ("HSP 테스트", "🌸"),
    "mbti-love": ("MBTI 궁합", "💕"),
    "kpop-position": ("K-POP 포지션", "🎤"),
    "past-life": ("전생 테스트", "✨"),
    "valentine": ("발렌타인", "💘"),
    "love-frequency": ("사랑 주파수", "💝"),
    "idle-clicker": ("던전 클리커", "⚔️"),
    "sky-runner": ("스카이 러너", "☁️"),
    "zigzag-runner": ("지그재그 러너", "⚡"),
    "stack-tower": ("스택 타워", "🏢"),
    "emoji-merge": ("이모지 머지", "🧬"),
    "brain-type": ("두뇌 유형 테스트", "🧠"),
    "color-memory": ("색상 기억력", "🎨"),
    "reaction-test": ("반응속도 테스트", "⚡"),
    "number-puzzle": ("2048 퍼즐", "🔢"),
    "typing-speed": ("타이핑 속도", "⌨️"),
    "word-scramble": ("단어 섞임", "🔤"),
}

# Recommended apps for each category
RECOMMENDATIONS = {
    "quiz-app": [
        ("reaction-test", "반응속도 테스트", "⚡"),
        ("dev-quiz", "개발자 퀴즈", "💻"),
        ("brain-type", "두뇌 유형 테스트", "🧠"),
        ("emotion-temp", "감정 온도계", "🌡️"),
        ("hsp-test", "HSP 테스트", "🌸"),
        ("mbti-love", "MBTI 궁합", "💕"),
    ],
    "brain-type": [
        ("reaction-test", "반응속도 테스트", "⚡"),
        ("hsp-test", "HSP 테스트", "🌸"),
        ("emotion-temp", "감정 온도계", "🌡️"),
        ("mbti-love", "MBTI 궁합", "💕"),
        ("past-life", "전생 테스트", "✨"),
        ("dream-fortune", "꿈해몽/운세", "🔮"),
    ],
    "reaction-test": [
        ("color-memory", "색상 기억력", "🎨"),
        ("number-puzzle", "2048 퍼즐", "🔢"),
        ("typing-speed", "타이핑 속도", "⌨️"),
        ("brain-type", "두뇌 유형 테스트", "🧠"),
        ("word-scramble", "단어 섞임", "🔤"),
        ("quiz-app", "상식 퀴즈", "🧠"),
    ],
    "hsp-test": [
        ("emotion-temp", "감정 온도계", "🌡️"),
        ("affirmation", "일일 긍정", "💪"),
        ("mbti-love", "MBTI 궁합", "💕"),
        ("dream-fortune", "꿈해몽/운세", "🔮"),
        ("brain-type", "두뇌 유형 테스트", "🧠"),
        ("past-life", "전생 테스트", "✨"),
    ],
    "emotion-temp": [
        ("affirmation", "일일 긍정", "💪"),
        ("hsp-test", "HSP 테스트", "🌸"),
        ("mbti-love", "MBTI 궁합", "💕"),
        ("dream-fortune", "꿈해몽/운세", "🔮"),
        ("past-life", "전생 테스트", "✨"),
        ("love-frequency", "사랑 주파수", "💝"),
    ],
    "mbti-love": [
        ("mbti-tips", "MBTI 팁", "📖"),
        ("hsp-test", "HSP 테스트", "🌸"),
        ("emotion-temp", "감정 온도계", "🌡️"),
        ("affirmation", "일일 긍정", "💪"),
        ("love-frequency", "사랑 주파수", "💝"),
        ("valentine", "발렌타인", "💘"),
    ],
    "dream-fortune": [
        ("past-life", "전생 테스트", "✨"),
        ("love-frequency", "사랑 주파수", "💝"),
        ("affirmation", "일일 긍정", "💪"),
        ("emotion-temp", "감정 온도계", "🌡️"),
        ("mbti-love", "MBTI 궁합", "💕"),
        ("brain-type", "두뇌 유형 테스트", "🧠"),
    ],
    "past-life": [
        ("dream-fortune", "꿈해몽/운세", "🔮"),
        ("love-frequency", "사랑 주파수", "💝"),
        ("affirmation", "일일 긍정", "💪"),
        ("mbti-love", "MBTI 궁합", "💕"),
        ("valentine", "발렌타인", "💘"),
        ("emotion-temp", "감정 온도계", "🌡️"),
    ],
    "love-frequency": [
        ("mbti-love", "MBTI 궁합", "💕"),
        ("valentine", "발렌타인", "💘"),
        ("past-life", "전생 테스트", "✨"),
        ("dream-fortune", "꿈해몽/운세", "🔮"),
        ("affirmation", "일일 긍정", "💪"),
        ("hsp-test", "HSP 테스트", "🌸"),
    ],
    "valentine": [
        ("mbti-love", "MBTI 궁합", "💕"),
        ("love-frequency", "사랑 주파수", "💝"),
        ("past-life", "전생 테스트", "✨"),
        ("dream-fortune", "꿈해몽/운세", "🔮"),
        ("affirmation", "일일 긍정", "💪"),
        ("emotion-temp", "감정 온도계", "🌡️"),
    ],
    "affirmation": [
        ("emotion-temp", "감정 온도계", "🌡️"),
        ("hsp-test", "HSP 테스트", "🌸"),
        ("mbti-love", "MBTI 궁합", "💕"),
        ("love-frequency", "사랑 주파수", "💝"),
        ("detox-timer", "디지털 디톡스", "📵"),
        ("white-noise", "화이트 노이즈", "🎵"),
    ],
    "idle-clicker": [
        ("emoji-merge", "이모지 머지", "🧬"),
        ("sky-runner", "스카이 러너", "☁️"),
        ("zigzag-runner", "지그재그 러너", "⚡"),
        ("stack-tower", "스택 타워", "🏢"),
        ("number-puzzle", "2048 퍼즐", "🔢"),
        ("color-memory", "색상 기억력", "🎨"),
    ],
    "emoji-merge": [
        ("idle-clicker", "던전 클리커", "⚔️"),
        ("sky-runner", "스카이 러너", "☁️"),
        ("zigzag-runner", "지그재그 러너", "⚡"),
        ("stack-tower", "스택 타워", "🏢"),
        ("number-puzzle", "2048 퍼즐", "🔢"),
        ("color-memory", "색상 기억력", "🎨"),
    ],
    "sky-runner": [
        ("idle-clicker", "던전 클리커", "⚔️"),
        ("zigzag-runner", "지그재그 러너", "⚡"),
        ("stack-tower", "스택 타워", "🏢"),
        ("emoji-merge", "이모지 머지", "🧬"),
        ("color-memory", "색상 기억력", "🎨"),
        ("number-puzzle", "2048 퍼즐", "🔢"),
    ],
    "zigzag-runner": [
        ("sky-runner", "스카이 러너", "☁️"),
        ("stack-tower", "스택 타워", "🏢"),
        ("idle-clicker", "던전 클리커", "⚔️"),
        ("emoji-merge", "이모지 머지", "🧬"),
        ("color-memory", "색상 기억력", "🎨"),
        ("number-puzzle", "2048 퍼즐", "🔢"),
    ],
    "stack-tower": [
        ("idle-clicker", "던전 클리커", "⚔️"),
        ("sky-runner", "스카이 러너", "☁️"),
        ("zigzag-runner", "지그재그 러너", "⚡"),
        ("emoji-merge", "이모지 머지", "🧬"),
        ("color-memory", "색상 기억력", "🎨"),
        ("number-puzzle", "2048 퍼즐", "🔢"),
    ],
    "color-memory": [
        ("number-puzzle", "2048 퍼즐", "🔢"),
        ("reaction-test", "반응속도 테스트", "⚡"),
        ("brain-type", "두뇌 유형 테스트", "🧠"),
        ("emotion-temp", "감정 온도계", "🌡️"),
        ("hsp-test", "HSP 테스트", "🌸"),
        ("typing-speed", "타이핑 속도", "⌨️"),
    ],
    "number-puzzle": [
        ("color-memory", "색상 기억력", "🎨"),
        ("typing-speed", "타이핑 속도", "⌨️"),
        ("word-scramble", "단어 섞임", "🔤"),
        ("reaction-test", "반응속도 테스트", "⚡"),
        ("brain-type", "두뇌 유형 테스트", "🧠"),
        ("quiz-app", "상식 퀴즈", "🧠"),
    ],
    "typing-speed": [
        ("word-scramble", "단어 섞임", "🔤"),
        ("number-puzzle", "2048 퍼즐", "🔢"),
        ("color-memory", "색상 기억력", "🎨"),
        ("reaction-test", "반응속도 테스트", "⚡"),
        ("dev-quiz", "개발자 퀴즈", "💻"),
        ("quiz-app", "상식 퀴즈", "🧠"),
    ],
    "word-scramble": [
        ("typing-speed", "타이핑 속도", "⌨️"),
        ("number-puzzle", "2048 퍼즐", "🔢"),
        ("quiz-app", "상식 퀴즈", "🧠"),
        ("dev-quiz", "개발자 퀴즈", "💻"),
        ("color-memory", "색상 기억력", "🎨"),
        ("reaction-test", "반응속도 테스트", "⚡"),
    ],
    "dev-quiz": [
        ("quiz-app", "상식 퀴즈", "🧠"),
        ("reaction-test", "반응속도 테스트", "⚡"),
        ("brain-type", "두뇌 유형 테스트", "🧠"),
        ("typing-speed", "타이핑 속도", "⌨️"),
        ("number-puzzle", "2048 퍼즐", "🔢"),
        ("word-scramble", "단어 섞임", "🔤"),
    ],
    "detox-timer": [
        ("white-noise", "화이트 노이즈", "🎵"),
        ("affirmation", "일일 긍정", "💪"),
        ("emotion-temp", "감정 온도계", "🌡️"),
        ("hsp-test", "HSP 테스트", "🌸"),
        ("dream-fortune", "꿈해몽/운세", "🔮"),
        ("past-life", "전생 테스트", "✨"),
    ],
    "white-noise": [
        ("detox-timer", "디지털 디톡스", "📵"),
        ("affirmation", "일일 긍정", "💪"),
        ("emotion-temp", "감정 온도계", "🌡️"),
        ("hsp-test", "HSP 테스트", "🌸"),
        ("dream-fortune", "꿈해몽/운세", "🔮"),
        ("past-life", "전생 테스트", "✨"),
    ],
    "mbti-tips": [
        ("mbti-love", "MBTI 궁합", "💕"),
        ("brain-type", "두뇌 유형 테스트", "🧠"),
        ("hsp-test", "HSP 테스트", "🌸"),
        ("emotion-temp", "감정 온도계", "🌡️"),
        ("quiz-app", "상식 퀴즈", "🧠"),
        ("dev-quiz", "개발자 퀴즈", "💻"),
    ],
    "kpop-position": [
        ("mbti-tips", "MBTI 팁", "📖"),
        ("quiz-app", "상식 퀴즈", "🧠"),
        ("brain-type", "두뇌 유형 테스트", "🧠"),
        ("hsp-test", "HSP 테스트", "🌸"),
        ("mbti-love", "MBTI 궁합", "💕"),
        ("emotion-temp", "감정 온도계", "🌡️"),
    ],
    "shopping-calc": [
        ("unit-converter", "단위 변환기", "📏"),
        ("tax-refund-preview", "연말정산", "📊"),
        ("lottery", "로또 번호 추천", "🎰"),
        ("dday-counter", "디데이 카운터", "⏳"),
        ("mbti-tips", "MBTI 팁", "📖"),
        ("kpop-position", "K-POP 포지션", "🎤"),
    ],
    "unit-converter": [
        ("shopping-calc", "환전 계산기", "💱"),
        ("tax-refund-preview", "연말정산", "📊"),
        ("lottery", "로또 번호 추천", "🎰"),
        ("dday-counter", "디데이 카운터", "⏳"),
        ("quiz-app", "상식 퀴즈", "🧠"),
        ("dev-quiz", "개발자 퀴즈", "💻"),
    ],
    "tax-refund-preview": [
        ("unit-converter", "단위 변환기", "📏"),
        ("shopping-calc", "환전 계산기", "💱"),
        ("lottery", "로또 번호 추천", "🎰"),
        ("dday-counter", "디데이 카운터", "⏳"),
        ("quiz-app", "상식 퀴즈", "🧠"),
        ("mbti-tips", "MBTI 팁", "📖"),
    ],
    "lottery": [
        ("unit-converter", "단위 변환기", "📏"),
        ("shopping-calc", "환전 계산기", "💱"),
        ("tax-refund-preview", "연말정산", "📊"),
        ("dday-counter", "디데이 카운터", "⏳"),
        ("dream-fortune", "꿈해몽/운세", "🔮"),
        ("love-frequency", "사랑 주파수", "💝"),
    ],
    "dday-counter": [
        ("unit-converter", "단위 변환기", "📏"),
        ("shopping-calc", "환전 계산기", "💱"),
        ("tax-refund-preview", "연말정산", "📊"),
        ("lottery", "로또 번호 추천", "🎰"),
        ("valentine", "발렌타인", "💘"),
        ("mbti-tips", "MBTI 팁", "📖"),
    ],
}

def generate_rec_card_html(app_key, app_name, emoji):
    """Generate a single recommendation card"""
    return f"""                    <a href="/{app_key}/" class="rec-card" target="_blank">
                        <span class="rec-icon">{emoji}</span>
                        <span class="rec-info">
                            <span class="rec-name">{app_name}</span>
                        </span>
                    </a>"""

def update_existing_rec_section(app_folder, content, recommendations_list):
    """Update existing recommendation section with new content"""
    # Pattern for rec-grid with cards
    pattern = r'<div class="rec-grid">.*?</div>\s*</div>\s*</div>'

    if not re.search(pattern, content, re.DOTALL):
        return content, False

    new_cards = '\n'.join([
        generate_rec_card_html(key, name, emoji)
        for key, name, emoji in recommendations_list
    ])

    new_grid = f"""<div class="rec-grid">
{new_cards}
                </div>
            </div>
        </div>"""

    updated = re.sub(pattern, new_grid, content, flags=re.DOTALL)
    return updated, True

def update_app_recommendations(app_folder):
    """Update recommendations section in an app"""
    html_path = os.path.join(PROJECTS_BASE, app_folder, "index.html")

    if not os.path.exists(html_path):
        print(f"  X {app_folder}: index.html not found")
        return False

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if app_folder not in RECOMMENDATIONS:
        print(f"  ~ {app_folder}: No recommendations defined")
        return False

    recs = RECOMMENDATIONS[app_folder]

    # Try to update existing section
    updated_content, success = update_existing_rec_section(app_folder, content, recs)

    if success:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"  O {app_folder}: Updated with {len(recs)} recommendations")
        return True
    else:
        print(f"  ~ {app_folder}: No rec-grid section found")
        return False

def main():
    print("=" * 60)
    print("Updating Cross-Links in DopaBrain Apps (Version 2)")
    print("=" * 60)

    updated_count = 0
    skipped_count = 0

    for app_folder in sorted(RECOMMENDATIONS.keys()):
        try:
            if update_app_recommendations(app_folder):
                updated_count += 1
            else:
                skipped_count += 1
        except Exception as e:
            print(f"  X {app_folder}: Error - {e}")
            skipped_count += 1

    print("\n" + "=" * 60)
    print(f"Summary: {updated_count} updated, {skipped_count} skipped")
    print("=" * 60)

if __name__ == "__main__":
    main()
