#!/bin/bash

# 모든 프로젝트 폴더 확인
cd "/e/Fire Project/projects"

echo "=== 추천 섹션 검증 현황 ==="
echo ""

declare -a apps=("affirmation" "brain-type" "color-memory" "dday-counter" "detox-timer" "dev-quiz" "dream-fortune" "emoji-merge" "emotion-temp" "hsp-test" "idle-clicker" "kpop-position" "lottery" "love-frequency" "mbti-love" "mbti-tips" "past-life" "quiz-app" "shopping-calc" "sky-runner" "stack-tower" "tax-refund-preview" "unit-converter" "valentine" "white-noise" "zigzag-runner")

for app in "${apps[@]}"; do
    if [ -f "$app/index.html" ]; then
        if grep -q "rec-section\|recommended" "$app/index.html"; then
            if grep -q "rec-section" "$app/index.html"; then
                echo "✓ $app: rec-section 있음"
            else
                echo "△ $app: recommended (다른 이름) 있음"
            fi
        else
            echo "✗ $app: 추천 섹션 없음"
        fi
    else
        echo "? $app: index.html 없음"
    fi
done
