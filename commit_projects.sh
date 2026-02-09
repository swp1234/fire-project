#!/bin/bash

cd "E:/Fire Project/projects"

# 프로젝트 목록
projects=(
  "portal"
  "quiz-app"
  "shopping-calc"
  "detox-timer"
  "dream-fortune"
  "affirmation"
  "lottery"
  "dday-counter"
  "mbti-tips"
  "white-noise"
  "dev-quiz"
  "tax-refund-preview"
  "unit-converter"
  "emotion-temp"
  "hsp-test"
  "mbti-love"
  "kpop-position"
  "past-life"
  "valentine"
  "love-frequency"
  "idle-clicker"
  "sky-runner"
  "zigzag-runner"
  "stack-tower"
  "emoji-merge"
  "brain-type"
  "color-memory"
  "reaction-test"
  "number-puzzle"
  "typing-speed"
  "memory-card"
  "root-domain"
)

success_count=0
skip_count=0
fail_count=0

for proj in "${projects[@]}"; do
  if [ ! -d "$proj/.git" ]; then
    echo "SKIP: $proj (not a git repo)"
    ((skip_count++))
    continue
  fi

  cd "$proj"

  # Check if there are changes
  if git status --short | grep -q .; then
    git add . > /dev/null 2>&1

    # Determine commit message based on project
    if [ "$proj" = "idle-clicker" ]; then
      msg="Round 16: i18n sync and improvements"
    else
      msg="Round 16: Update app"
    fi

    if git commit -m "$msg" > /dev/null 2>&1; then
      # Try to push
      if git push origin main > /dev/null 2>&1 || git push origin master > /dev/null 2>&1; then
        echo "OK: $proj"
        ((success_count++))
      else
        echo "FAIL: $proj (push error)"
        ((fail_count++))
      fi
    else
      echo "SKIP: $proj (nothing to commit)"
      ((skip_count++))
    fi
  else
    echo "SKIP: $proj (no changes)"
    ((skip_count++))
  fi

  cd ..
done

echo ""
echo "========================================="
echo "Success: $success_count"
echo "Skipped: $skip_count"
echo "Failed: $fail_count"
echo "========================================="
