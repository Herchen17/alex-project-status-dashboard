#!/bin/bash
# System Status Dashboard

echo "🖥️  SYSTEM STATUS DASHBOARD"
echo "=========================="
echo

# Disk Usage
echo "💾 DISK USAGE"
echo "-------------"
df -h / | awk 'NR==1{printf "%-15s %-6s %-6s %-6s %-6s %s\n", $1,$2,$3,$4,$5,$6} NR==2{printf "%-15s %-6s %-6s %-6s %-6s %s\n", $1,$2,$3,$4,$5,$6}'
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')

if [ $DISK_USAGE -ge 90 ]; then
    echo "🔴 CRITICAL: ${DISK_USAGE}% - Immediate action required!"
elif [ $DISK_USAGE -ge 80 ]; then
    echo "🟡 WARNING: ${DISK_USAGE}% - Cleanup recommended"
else
    echo "🟢 HEALTHY: ${DISK_USAGE}% - Normal operation"
fi
echo

# Top disk usage
echo "📊 TOP DISK CONSUMERS"
echo "--------------------"
du -sh /home/ubuntu/* 2>/dev/null | sort -hr | head -5
echo

# Clawdbot Status
echo "🤖 CLAWDBOT STATUS"
echo "-------------------"
if systemctl is-active --quiet clawdbot-gateway.service; then
    echo "🟢 Gateway: Running"
else
    echo "🔴 Gateway: Stopped"
fi

# Show session count
if [ -f "/home/ubuntu/.clawdbot/agents/main/sessions/sessions.json" ]; then
    SESSION_COUNT=$(jq '. | length' /home/ubuntu/.clawdbot/agents/main/sessions/sessions.json 2>/dev/null || echo "0")
    echo "📱 Active Sessions: $SESSION_COUNT"
fi
echo

# Memory Usage
echo "🧠 MEMORY USAGE"
echo "--------------"
free -h | awk 'NR==1{print $0} NR==2{print $0}'
echo

# Last cleanup
if [ -f "/home/ubuntu/disk-monitor.log" ]; then
    echo "🧹 LAST CLEANUP"
    echo "--------------" 
    tail -1 /home/ubuntu/disk-monitor.log
else
    echo "🧹 No cleanup log found"
fi