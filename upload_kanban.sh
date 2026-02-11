#!/bin/bash

# Create GitHub Gist
GIST_JSON=$(cat << 'GIST_EOF'
{
  "description": "🪖 Project Command Center - Kanban Board",
  "public": true,
  "files": {
    "kanban-board.html": {
      "content": ""
    }
  }
}
GIST_EOF
)

# Read the HTML file and escape it properly for JSON
HTML_CONTENT=$(cat kanban-board.html | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')

# Insert the content into the JSON
FINAL_JSON=$(echo "$GIST_JSON" | sed "s/\"content\": \"\"/\"content\": \"$HTML_CONTENT\"/")

# Post to GitHub Gist API
curl -X POST \
  -H "Content-Type: application/json" \
  -d "$FINAL_JSON" \
  https://api.github.com/gists
