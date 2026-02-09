#!/bin/bash
cd "E:/Fire Project/projects"
for dir in */; do
    if [ -d "${dir}.git" ]; then
        echo "Resetting $dir..."
        cd "$dir"
        git reset --hard HEAD 2>&1 > /dev/null
        cd ..
    fi
done
echo "All projects reset!"
