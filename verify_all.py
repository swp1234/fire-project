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
    "number-puzzle", "typing-speed", "memory-card", "root-domain",
    "word-scramble", "stress-check"
]

round16 = []
other = []
no_repo = []

for proj in all_projects:
    proj_path = os.path.join(projects_dir, proj)

    if not os.path.exists(os.path.join(proj_path, ".git")):
        no_repo.append(proj)
        continue

    try:
        os.chdir(proj_path)
        result = subprocess.run(
            ["git", "log", "-1", "--format=%h %s"],
            capture_output=True,
            timeout=5
        )

        if result.returncode == 0:
            commit_msg = result.stdout.decode('utf-8', errors='ignore').strip()
            if "Round 16" in commit_msg:
                round16.append((proj, commit_msg))
            else:
                other.append((proj, commit_msg))
    except:
        pass

print("=== ROUND 16 COMMITS ===")
for proj, msg in sorted(round16):
    print(f"{proj:25} | {msg}")

print(f"\n=== OTHER COMMITS ({len(other)}) ===")
for proj, msg in sorted(other):
    print(f"{proj:25} | {msg}")

if no_repo:
    print(f"\n=== NOT GIT REPOS ({len(no_repo)}) ===")
    for proj in no_repo:
        print(f"{proj}")

print(f"\n=== SUMMARY ===")
print(f"Round 16:  {len(round16):2d}")
print(f"Other:     {len(other):2d}")
print(f"No repo:   {len(no_repo):2d}")
print(f"Total:     {len(all_projects):2d}")
