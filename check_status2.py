#!/usr/bin/env python3
import os
import subprocess

projects_dir = "E:/Fire Project/projects"
projects = [
    "dev-quiz", "tax-refund-preview", "unit-converter", "emotion-temp",
    "hsp-test", "mbti-love", "kpop-position", "past-life", "valentine",
    "love-frequency", "idle-clicker", "sky-runner", "zigzag-runner",
    "stack-tower", "emoji-merge", "brain-type", "color-memory", "reaction-test",
    "number-puzzle", "typing-speed", "memory-card", "root-domain"
]

for proj in projects:
    proj_path = os.path.join(projects_dir, proj)
    git_path = os.path.join(proj_path, ".git")

    if not os.path.exists(git_path):
        print(f"{proj}: NOT A GIT REPO")
        continue

    try:
        os.chdir(proj_path)
        result = subprocess.run(
            ["git", "log", "--oneline", "-1"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            commit = result.stdout.strip()
            print(f"{proj}: {commit}")
        else:
            print(f"{proj}: ERROR")
    except Exception as e:
        print(f"{proj}: {str(e)[:50]}")
