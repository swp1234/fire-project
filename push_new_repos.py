#!/usr/bin/env python3
import os
import subprocess

projects_dir = "E:/Fire Project/projects"
new_projects = ["word-scramble", "stress-check"]

for proj in new_projects:
    proj_path = os.path.join(projects_dir, proj)

    try:
        os.chdir(proj_path)

        # Create remote repo using gh
        result = subprocess.run(
            ["gh", "repo", "create", proj, "--public", "--source=.", "--remote=origin", "--push"],
            capture_output=True,
            timeout=60
        )

        if result.returncode == 0:
            print(f"{proj}: Created and pushed successfully")
        else:
            # Maybe repo already exists, try to add remote and push
            subprocess.run(["git", "remote", "add", "origin", f"https://github.com/swp1234/{proj}.git"],
                          capture_output=True, timeout=5)
            push_result = subprocess.run(["git", "push", "-u", "origin", "main"],
                                        capture_output=True, timeout=30)
            if push_result.returncode == 0:
                print(f"{proj}: Added remote and pushed")
            else:
                print(f"{proj}: Push failed")

    except Exception as e:
        print(f"{proj}: ERROR - {str(e)[:50]}")
