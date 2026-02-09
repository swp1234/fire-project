#!/usr/bin/env python3
import os
import subprocess

projects_dir = "E:/Fire Project/projects"
new_projects = ["word-scramble", "stress-check"]

for proj in new_projects:
    proj_path = os.path.join(projects_dir, proj)

    try:
        os.chdir(proj_path)

        # Check if already a git repo
        if os.path.exists(".git"):
            print(f"{proj}: Already a git repo")
            continue

        # Initialize git
        subprocess.run(["git", "init"], check=True, capture_output=True, timeout=5)
        subprocess.run(["git", "config", "user.name", "woodori1234"], check=True, capture_output=True, timeout=5)
        subprocess.run(["git", "config", "user.email", "swp1234@gmail.com"], check=True, capture_output=True, timeout=5)

        # Add and commit
        subprocess.run(["git", "add", "."], capture_output=True, timeout=5)
        subprocess.run(["git", "commit", "-m", "Initial commit: " + proj], capture_output=True, timeout=5)

        print(f"{proj}: Initialized and committed")

    except Exception as e:
        print(f"{proj}: ERROR - {str(e)[:50]}")
