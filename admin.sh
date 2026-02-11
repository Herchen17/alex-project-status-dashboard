#!/bin/bash

# 🪖 Soldier Admin CLI
# Quick access to configuration files and system status

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🪖 Soldier Admin Panel${NC}"
echo "========================"

# Check if file exists and get its status
check_file() {
    if [ -f "/home/ubuntu/clawd/$1" ]; then
        lines=$(wc -l < "/home/ubuntu/clawd/$1")
        echo -e "${GREEN}✅ $1${NC} (${lines} lines)"
    else
        echo -e "${RED}❌ $1${NC} (missing)"
    fi
}

echo -e "\n${YELLOW}📁 Configuration Files:${NC}"
check_file "SOUL.md"
check_file "USER.md"
check_file "IDENTITY.md"
check_file "TOOLS.md"
check_file "HEARTBEAT.md"
check_file "CONFIG_OVERVIEW.md"

echo -e "\n${YELLOW}📊 System Status:${NC}"
echo "Current Model: $(cat /home/ubuntu/.npm-global/lib/node_modules/clawdbot/models.json 2>/dev/null | grep -o '"default":"[^"]*"' | cut -d'"' -f4 || echo 'Claude Sonnet')"
echo "Active Session: main"
echo "Workspace: /home/ubuntu/clawd"
echo "Memory Files: $(find /home/ubuntu/clawd/memory -name "*.md" 2>/dev/null | wc -l) recent"

echo -e "\n${YELLOW}🔧 Quick Actions:${NC}"
echo "1. View configuration overview"
echo "2. Edit SOUL.md"
echo "3. Edit USER.md" 
echo "4. Edit HEARTBEAT.md"
echo "5. Open web admin panel"
echo "6. View recent memory files"

read -p "Choose action (1-6): " choice

case $choice in
    1)
        cat /home/ubuntu/clawd/CONFIG_OVERVIEW.md
        ;;
    2)
        ${EDITOR:-nano} /home/ubuntu/clawd/SOUL.md
        ;;
    3)
        ${EDITOR:-nano} /home/ubuntu/clawd/USER.md
        ;;
    4)
        ${EDITOR:-nano} /home/ubuntu/clawd/HEARTBEAT.md
        ;;
    5)
        if command -v xdg-open >/dev/null 2>&1; then
            xdg-open /home/ubuntu/clawd/admin/index.html
        elif command -v open >/dev/null 2>&1; then
            open /home/ubuntu/clawd/admin/index.html
        else
            echo "Web browser not available. Open manually: file:///home/ubuntu/clawd/admin/index.html"
        fi
        ;;
    6)
        ls -lt /home/ubuntu/clawd/memory/*.md 2>/dev/null | head -5 || echo "No memory files found"
        ;;
    *)
        echo "Invalid choice"
        ;;
esac