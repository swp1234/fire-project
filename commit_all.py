#!/usr/bin/env python3
import os
import subprocess
import sys

projects_dir = "E:/Fire Project/projects"
projects = [
    "portal", "quiz-app", "shopping-calc", "detox-timer", "dream-fortune",
    "affirmation", "lottery", "dday-counter", "mbti-tips", "white-noise",
    "dev-quiz", "tax-refund-preview", "unit-converter", "emotion-temp",
    "hsp-test", "mbti-love", "kpop-position", "past-life", "valentine",
    "love-frequency", "idle-clicker", "sky-runner", "zigzag-runner",
    "stack-tower", "emoji-merge", "brain-type", "color-memory", "reaction-test",
    "number-puzzle", "typing-speed", "memory-card", "root-domain"
]

results = {"success": [], "failed": []}

for proj in projects:
    proj_path = os.path.join(projects_dir, proj)
    git_path = os.path.join(proj_path, ".git")

    if not os.path.exists(git_path):
        print(f"SKIP: {proj} (not a git repo)")
        continue

    try:
        os.chdir(proj_path)

        # Check status
        status = subprocess.check_output(["git", "status", "--short"], text=True, stderr=subprocess.DEVNULL)

        if not status.strip():
            print(f"SKIP: {proj} (no changes)")
            continue

        # Add changes
        subprocess.run(["git", "add", "."], check=True, capture_output=True)

        # Commit
        result = subprocess.run(
            ["git", "commit", "-m", "Round 16: Update app"],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print(f"FAIL: {proj} (commit failed: {result.stderr[:100]})")
            results["failed"].append(proj)
            continue

        # Push
        push_result = subprocess.run(
            ["git", "push", "origin", "main"],
            capture_output=True,
            text=True,
            timeout=30
        )

        if push_result.returncode != 0:
            # Try master branch
            push_result = subprocess.run(
                ["git", "push", "origin", "master"],
                capture_output=True,
                text=True,
                timeout=30
            )

        if push_result.returncode == 0:
            print(f"OK: {proj}")
            results["success"].append(proj)
        else:
            print(f"FAIL: {proj} (push failed: {push_result.stderr[:100]})")
            results["failed"].append(proj)

    except subprocess.TimeoutExpired:
        print(f"TIMEOUT: {proj} (push timed out)")
        results["failed"].append(proj)
    except Exception as e:
        print(f"ERROR: {proj} ({str(e)[:100]})")
        results["failed"].append(proj)

print("\n" + "="*50)
print(f"Success: {len(results['success'])} projects")
print(f"Failed: {len(results['failed'])} projects")
if results["failed"]:
    print(f"Failed projects: {', '.join(results['failed'])}")
