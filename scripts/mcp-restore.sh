#!/bin/bash
# MCP servers on-demand restore script
# Usage: bash scripts/mcp-restore.sh [group]
# Groups: social | media | monetization | all

GROUP="${1:-all}"

add_social() {
  echo "Adding social MCP servers..."
  claude mcp add -s user reddit -- python -m mcp_server_reddit
  claude mcp add -s user -e RAPIDAPI_KEY=9d196dc128msh3d822634a202e4ap157914jsnd32221160443 twitter -- node "E:/Fire Project/.mcp-servers/twitter-X-mcp-server/main.js"
  claude mcp add -s user -e tiktok=9d196dc128msh3d822634a202e4ap157914jsnd32221160443 trends -- mcp run "E:/Fire Project/.mcp-servers/Trends-MCP/src/server.py"
  claude mcp add -s user -e YOUTUBE_API_KEY=AIzaSyA16xsUHpqdCi2buaWcR3-3Ti37L3FEffk youtube -- node "E:/Fire Project/.mcp-servers/youtube-mcp-server/index.js"
}

add_media() {
  echo "Adding media MCP servers..."
  # Text-only server (gemini-2.5-flash)
  claude mcp add gemini -s user \
    -e GOOGLE_CLOUD_PROJECT=pubg-platform-ai \
    -e GOOGLE_CLOUD_LOCATION=global \
    -e GEMINI_MODEL=gemini-2.5-flash \
    -e GEMINI_ENABLE_CONVERSATIONS=true \
    -e GEMINI_ALLOW_FILE_URIS=true \
    -- node "E:/Fire Project/.mcp-servers/gemini-mcp-server/build/index.js"
  # Image generation server (gemini-2.5-flash-image)
  claude mcp add gemini-image -s user \
    -e GOOGLE_CLOUD_PROJECT=pubg-platform-ai \
    -e GOOGLE_CLOUD_LOCATION=global \
    -e GEMINI_MODEL=gemini-2.5-flash-image \
    -e GEMINI_ENABLE_CONVERSATIONS=true \
    -e GEMINI_ALLOW_FILE_URIS=true \
    -e GEMINI_IMAGE_OUTPUT_DIR="E:/Fire Project/.nano-banana" \
    -- node "E:/Fire Project/.mcp-servers/gemini-mcp-server/build/index.js"
}

add_monetization() {
  echo "Adding monetization MCP servers..."
  claude mcp add adsense -s user -- node "E:/Fire Project/.mcp-servers/adsense-mcp/build/index.js" run
}

case "$GROUP" in
  social) add_social ;;
  media)  add_media ;;
  monetization) add_monetization ;;
  all)    add_social; add_media; add_monetization ;;
  *)      echo "Usage: $0 [social|media|monetization|all]" ;;
esac

echo "Done. Restart Claude Code to activate."
