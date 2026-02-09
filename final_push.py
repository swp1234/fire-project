#!/usr/bin/env python3
import os
import subprocess

projects_dir = "E:/Fire Project/projects"
new_projects = ["word-scramble", "stress-check"]

for proj in new_projects:
    proj_path = os.path.join(projects_dir, proj)

    try:
        os.chdir(proj_path)

        # Try push with main branch
        result = subprocess.run(
            ["git", "push", "-u", "origin", "main"],
            capture_output=True,
            timeout=30,
            encoding='utf-8',
            errors='ignore'
        )

        if result.returncode == 0:
            print(f"{proj}: Pushed successfully to main")
        else:
            # Try master
            result = subprocess.run(
                ["git", "push", "-u", "origin", "master"],
                capture_output=True,
                timeout=30,
                encoding='utf-8',
                errors='ignore'
            )
            if result.returncode == 0:
                print(f"{proj}: Pushed successfully to master")
            else:
                print(f"{proj}: Push failed - {result.stderr[:100]}")

    except subprocess.TimeoutExpired:
        print(f"{proj}: Push timeout")
    except Exception as e:
        print(f"{proj}: ERROR - {str(e)[:50]}")
