#!/usr/bin/env python3
import os
import subprocess

projects_dir = "E:/Fire Project/projects"
all_projects = [
    "portal", "quiz-app", "shopping-calc", "detox-timer", "dream-fortune",
    "affirmation", "lottery", "dday-counter", "mbti-tips", "white-noise",
    "dev-quiz", "tax-refund-preview", "unit-converter", "emotion-temp",
    "hsp-test", "mbti-love", "kpop-position", "past-life", "valentine",
    "love-frequency", "idle-clicker", "sky-runner", "zigzag-runner",
    "stack-tower", "emoji-merge", "brain-type", "color-memory", "reaction-test",
    "number-puzzle", "typing-speed", "memory-card", "root-domain"
]

round16_count = 0
other_count = 0
no_repo = 0

print("=== FINAL STATUS ===\n")

for proj in all_projects:
    proj_path = os.path.join(projects_dir, proj)
    git_path = os.path.join(proj_path, ".git")

    if not os.path.exists(git_path):
        print(f"{proj:20} | NOT A GIT REPO")
        no_repo += 1
        continue

    try:
        os.chdir(proj_path)
        result = subprocess.run(
            ["git", "log", "--oneline", "-1"],
            capture_output=True,
            text=True,
            timeout=5,
            encoding='utf-8',
            errors='ignore'
        )
        if result.returncode == 0:
            commit = result.stdout.strip()
            if "Round 16" in commit:
                print(f"{proj:20} | ✓ {commit}")
                round16_count += 1
            else:
                print(f"{proj:20} | - {commit}")
                other_count += 1
        else:
            print(f"{proj:20} | ERROR")
    except Exception as e:
        print(f"{proj:20} | ERROR: {str(e)[:30]}")

print(f"\n=== SUMMARY ===")
print(f"Round 16 commits: {round16_count}")
print(f"Other commits: {other_count}")
print(f"Not git repos: {no_repo}")
print(f"Total projects: {len(all_projects)}")
