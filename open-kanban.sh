#!/bin/bash
echo "🪖 Opening Smart Kanban Board..."
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open /home/ubuntu/clawd/smart-kanban.html
elif command -v open >/dev/null 2>&1; then
    open /home/ubuntu/clawd/smart-kanban.html
else
    echo "Open manually: file:///home/ubuntu/clawd/smart-kanban.html"
fi
