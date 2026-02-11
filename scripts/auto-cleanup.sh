#!/bin/bash
# Auto-cleanup script to prevent disk space issues
# Run this script when disk usage hits 85% or higher

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🧹 BitClaw Auto-Cleanup Script${NC}"
echo "=================================================="

# Check current disk usage
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
echo -e "Current disk usage: ${YELLOW}${DISK_USAGE}%${NC}"

if [ "$DISK_USAGE" -lt 85 ]; then
    echo -e "${GREEN}✅ Disk usage is below 85%. No cleanup needed.${NC}"
    exit 0
fi

echo -e "${YELLOW}⚠️ Disk usage is at ${DISK_USAGE}%. Starting cleanup...${NC}"

# Function to log space freed
log_space_freed() {
    local before_kb=$(df / | awk 'NR==2 {print $3}')
    local after_kb=$(df / | awk 'NR==2 {print $3}')
    local freed_mb=$((($before_kb - $after_kb) / 1024))
    echo -e "${GREEN}   Freed: ${freed_mb}MB${NC}"
}

echo "🗑️ Cleaning NPX cache..."
rm -rf ~/.npm/_npx/* 2>/dev/null || true
log_space_freed

echo "🗑️ Cleaning NPM cache..."
npm cache clean --force 2>/dev/null || true

echo "🗑️ Cleaning APT cache..."
sudo apt clean 2>/dev/null || true
sudo apt autoremove -y 2>/dev/null || true

echo "🗑️ Cleaning system logs (keep last 7 days)..."
sudo journalctl --vacuum-time=7d 2>/dev/null || true
sudo find /var/log -name "*.log.*" -o -name "*.gz" -exec rm -f {} \; 2>/dev/null || true

echo "🗑️ Cleaning temporary files..."
sudo rm -rf /tmp/* /var/tmp/* 2>/dev/null || true

echo "🗑️ Cleaning old snap packages..."
# Only remove broken/disabled snaps
snap list | grep -E 'broken|disabled' | awk '{print $1}' | xargs -r sudo snap remove 2>/dev/null || true

echo "🗑️ Cleaning Docker (if installed)..."
if command -v docker &> /dev/null; then
    docker system prune -f 2>/dev/null || true
fi

# Check for large node_modules that aren't essential
echo "🔍 Checking for large node_modules directories..."
find /home -name "node_modules" -type d -exec du -sh {} \; 2>/dev/null | sort -hr | head -5

# Final disk usage check
FINAL_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
echo "=================================================="
echo -e "Final disk usage: ${YELLOW}${FINAL_USAGE}%${NC}"

if [ "$FINAL_USAGE" -lt "$DISK_USAGE" ]; then
    SAVED=$((DISK_USAGE - FINAL_USAGE))
    echo -e "${GREEN}✅ Cleanup successful! Freed ${SAVED}% disk space.${NC}"
else
    echo -e "${YELLOW}⚠️ Cleanup complete but disk usage still high.${NC}"
    echo -e "${YELLOW}Consider removing large files manually.${NC}"
fi

echo -e "${GREEN}🎉 BitClaw cleanup complete!${NC}"