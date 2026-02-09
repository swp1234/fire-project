#!/usr/bin/env python3
import os
import subprocess
import sys

projects_dir = "E:/Fire Project/projects"

# 미커밋된 프로젝트
projects_to_fix = [
    "hsp-test", "mbti-love", "kpop-position", "past-life", "valentine",
    "love-frequency", "idle-clicker", "sky-runner", "zigzag-runner",
    "stack-tower", "emoji-merge", "brain-type", "color-memory", "reaction-test",
    "number-puzzle", "typing-speed"
]

success = []
failed = []

for proj in projects_to_fix:
    proj_path = os.path.join(projects_dir, proj)
    git_path = os.path.join(proj_path, ".git")

    if not os.path.exists(git_path):
        print(f"SKIP: {proj} (no git)")
        continue

    try:
        os.chdir(proj_path)

        # Check status
        result = subprocess.run(
            ["git", "status", "--short"],
            capture_output=True,
            text=True,
            timeout=5,
            encoding='utf-8',
            errors='ignore'
        )

        if not result.stdout.strip():
            print(f"SKIP: {proj} (no changes)")
            continue

        # Add
        subprocess.run(["git", "add", "."], capture_output=True, timeout=5)

        # Commit
        if proj == "idle-clicker":
            msg = "Round 16: i18n sync and improvements"
        else:
            msg = "Round 16: Update app"

        commit_result = subprocess.run(
            ["git", "commit", "-m", msg],
            capture_output=True,
            timeout=5
        )

        if commit_result.returncode != 0:
            print(f"FAIL: {proj} (commit failed)")
            failed.append(proj)
            continue

        # Push
        push_result = subprocess.run(
            ["git", "push", "origin", "main"],
            capture_output=True,
            timeout=30
        )

        if push_result.returncode != 0:
            push_result = subprocess.run(
                ["git", "push", "origin", "master"],
                capture_output=True,
                timeout=30
            )

        if push_result.returncode == 0:
            print(f"OK: {proj}")
            success.append(proj)
        else:
            print(f"FAIL: {proj} (push failed)")
            failed.append(proj)

    except subprocess.TimeoutExpired:
        print(f"TIMEOUT: {proj}")
        failed.append(proj)
    except Exception as e:
        print(f"ERROR: {proj} ({str(e)[:50]})")
        failed.append(proj)

print(f"\nSuccess: {len(success)}, Failed: {len(failed)}")
if failed:
    print(f"Failed: {', '.join(failed)}")
