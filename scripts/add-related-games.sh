#!/bin/bash
# Add "Related Games" internal linking section to all 21 games
# Uses heredoc approach to avoid bash word-splitting issues

cd "$(dirname "$0")/.."

inject_links() {
  local app="$1"
  local html_file="projects/$app/index.html"
  local tmpfile=$(mktemp)

  if ! [ -f "$html_file" ]; then echo "SKIP: $html_file not found"; return; fi
  if grep -q 'related-games' "$html_file" 2>/dev/null; then echo "SKIP: $app already has related-games"; return; fi

  # Read links from stdin (one per line: emoji Name slug)
  local links_html=""
  while IFS= read -r line; do
    local emoji=$(echo "$line" | awk '{print $1}')
    local name=$(echo "$line" | awk '{$1=""; $NF=""; print}' | sed 's/^ *//;s/ *$//')
    local slug=$(echo "$line" | awk '{print $NF}')
    links_html+="        <a href=\"/${slug}/\" style=\"padding:6px 12px;background:rgba(255,255,255,0.08);border-radius:8px;text-decoration:none;color:inherit;font-size:13px;\">${emoji} ${name}</a>\n"
  done

  # Build full section
  local section="    <!-- Related Games (SEO Internal Links) -->\n    <section class=\"related-games\" style=\"margin:20px auto;padding:16px;max-width:480px;background:rgba(255,255,255,0.05);border-radius:12px;\">\n      <p style=\"font-size:13px;color:#aaa;margin:0 0 8px 0;font-weight:600;\">More Free Games</p>\n      <div style=\"display:flex;gap:8px;flex-wrap:wrap;\">\n${links_html}      </div>\n    </section>"

  # Insert before cross-promo.js using awk for reliability
  awk -v section="$section" '
    /cross-promo\.js/ && !done {
      printf "%s\n", section
      done = 1
    }
    { print }
  ' "$html_file" > "$tmpfile" && mv "$tmpfile" "$html_file"

  echo "DONE: $app"
}

# Action/Runner games
echo -e "🐍 Snake Game snake-game\n🏃 Zigzag Runner zigzag-runner\n☁️ Sky Runner sky-runner\n🏗️ Stack Tower stack-tower\n🔫 Road Shooter road-shooter" | inject_links "flappy-bird"

echo -e "🐦 Flappy Bird flappy-bird\n🏃 Zigzag Runner zigzag-runner\n🏗️ Stack Tower stack-tower\n🔫 Road Shooter road-shooter\n🧱 Brick Breaker brick-breaker" | inject_links "sky-runner"

echo -e "🐦 Flappy Bird flappy-bird\n☁️ Sky Runner sky-runner\n🔫 Road Shooter road-shooter\n🏗️ Stack Tower stack-tower\n🐍 Snake Game snake-game" | inject_links "zigzag-runner"

echo -e "🐦 Flappy Bird flappy-bird\n☁️ Sky Runner sky-runner\n🏃 Zigzag Runner zigzag-runner\n🐍 Snake Game snake-game\n🏗️ Stack Tower stack-tower" | inject_links "road-shooter"

echo -e "🐦 Flappy Bird flappy-bird\n🧩 Block Puzzle block-puzzle\n🔢 2048 Puzzle puzzle-2048\n🏃 Zigzag Runner zigzag-runner\n⚡ Reaction Test reaction-test" | inject_links "stack-tower"

# Puzzle games
echo -e "🔢 2048 Puzzle puzzle-2048\n🔢 Number Puzzle number-puzzle\n💣 Minesweeper minesweeper\n🏗️ Stack Tower stack-tower\n✨ Emoji Merge emoji-merge" | inject_links "block-puzzle"

echo -e "🧩 Block Puzzle block-puzzle\n🔢 Number Puzzle number-puzzle\n💣 Minesweeper minesweeper\n✨ Emoji Merge emoji-merge\n🏗️ Stack Tower stack-tower" | inject_links "puzzle-2048"

echo -e "🔢 2048 Puzzle puzzle-2048\n🧩 Block Puzzle block-puzzle\n💣 Minesweeper minesweeper\n✨ Emoji Merge emoji-merge\n📝 Word Scramble word-scramble" | inject_links "number-puzzle"

echo -e "🧩 Block Puzzle block-puzzle\n🔢 2048 Puzzle puzzle-2048\n🔢 Number Puzzle number-puzzle\n🃏 Memory Card memory-card\n🎨 Color Memory color-memory" | inject_links "minesweeper"

echo -e "🔢 2048 Puzzle puzzle-2048\n🧩 Block Puzzle block-puzzle\n🔢 Number Puzzle number-puzzle\n🏗️ Stack Tower stack-tower\n⚔️ Idle Clicker idle-clicker" | inject_links "emoji-merge"

# Word games
echo -e "📝 Word Scramble word-scramble\n⌨️ Typing Speed typing-speed\n🔢 Number Puzzle number-puzzle\n💣 Minesweeper minesweeper\n🧩 Block Puzzle block-puzzle" | inject_links "word-guess"

echo -e "🔤 Word Guess word-guess\n⌨️ Typing Speed typing-speed\n🔢 Number Puzzle number-puzzle\n🧩 Block Puzzle block-puzzle\n✨ Emoji Merge emoji-merge" | inject_links "word-scramble"

echo -e "🔤 Word Guess word-guess\n📝 Word Scramble word-scramble\n⚡ Reaction Test reaction-test\n🔢 Number Puzzle number-puzzle\n💣 Minesweeper minesweeper" | inject_links "typing-speed"

# Memory/Casual games
echo -e "🃏 Memory Card memory-card\n⚡ Reaction Test reaction-test\n💣 Minesweeper minesweeper\n🧩 Block Puzzle block-puzzle\n🔢 2048 Puzzle puzzle-2048" | inject_links "color-memory"

echo -e "🎨 Color Memory color-memory\n⚡ Reaction Test reaction-test\n💣 Minesweeper minesweeper\n🔢 Number Puzzle number-puzzle\n🧩 Block Puzzle block-puzzle" | inject_links "memory-card"

echo -e "🎨 Color Memory color-memory\n🃏 Memory Card memory-card\n⌨️ Typing Speed typing-speed\n🏗️ Stack Tower stack-tower\n🐦 Flappy Bird flappy-bird" | inject_links "reaction-test"

# Classic games
echo -e "🐦 Flappy Bird flappy-bird\n🏓 Pong Game pong-game\n🧱 Brick Breaker brick-breaker\n🏃 Zigzag Runner zigzag-runner\n🔫 Road Shooter road-shooter" | inject_links "snake-game"

echo -e "🐍 Snake Game snake-game\n🧱 Brick Breaker brick-breaker\n🐦 Flappy Bird flappy-bird\n⚡ Reaction Test reaction-test\n🏗️ Stack Tower stack-tower" | inject_links "pong-game"

echo -e "🐍 Snake Game snake-game\n🏓 Pong Game pong-game\n🐦 Flappy Bird flappy-bird\n🏗️ Stack Tower stack-tower\n☁️ Sky Runner sky-runner" | inject_links "brick-breaker"

echo -e "🐍 Snake Game snake-game\n🏃 Zigzag Runner zigzag-runner\n🐦 Flappy Bird flappy-bird\n💣 Minesweeper minesweeper\n🎨 Color Memory color-memory" | inject_links "maze-runner"

echo ""
echo "=== All done ==="
