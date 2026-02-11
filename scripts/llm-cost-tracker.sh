#!/bin/bash
# Enhanced LLM Cost Tracker with session analysis

echo "💰 ENHANCED LLM COST TRACKER"
echo "============================"
echo

# Get session data
SESSION_DATA=$(clawdbot status --all 2>/dev/null | grep -A 50 "Sessions" | grep -E "(agent:|claude|anthropic|minimax|tokens|Tokens)")

echo "📊 CURRENT ACTIVE SESSIONS & TOKEN USAGE"
echo "----------------------------------------"
if [ ! -z "$SESSION_DATA" ]; then
    echo "$SESSION_DATA"
else
    echo "Unable to fetch session data - checking alternative sources..."
    
    # Try to read session files directly
    if [ -f "/home/ubuntu/.clawdbot/agents/main/sessions/sessions.json" ]; then
        echo "📁 Session file analysis:"
        jq -r 'keys[] as $k | "\($k): \(.[$k].tokenUsage // "No token data") tokens"' /home/ubuntu/.clawdbot/agents/main/sessions/sessions.json 2>/dev/null | head -10
    fi
fi

echo
echo "🎯 MODEL BREAKDOWN"
echo "-----------------"
echo "Currently configured models:"

# Check config for models and costs
if [ -f "/home/ubuntu/.clawdbot/clawdbot.json" ]; then
    echo "• Anthropic Models:"
    jq -r '.models.providers.anthropic.models[]? | "  - \(.name) (\(.id))"' /home/ubuntu/.clawdbot/clawdbot.json 2>/dev/null
    echo "• MiniMax Models:"
    jq -r '.models.providers.minimax.models[]? | "  - \(.name) (\(.id))"' /home/ubuntu/.clawdbot/clawdbot.json 2>/dev/null
fi

echo
echo "💡 COST OPTIMIZATION TIPS"
echo "-------------------------"
echo "• Use MiniMax-M2 for routine tasks (cheaper)"
echo "• Current main session: $(clawdbot status 2>/dev/null | grep -E 'claude-sonnet|anthropic' | head -1 | awk '{print $3}')"
echo "• Switch models with: clawdbot session --model minimax/MiniMax-M2"
echo "• Monitor with: clawdbot status"

echo
echo "📈 USAGE HISTORY"
echo "---------------"
if [ -f "/home/ubuntu/disk-monitor.log" ]; then
    echo "Last system activity:"
    tail -3 /home/ubuntu/disk-monitor.log
else
    echo "No activity log found"
fi

echo
echo "🔧 COMMANDS TO MANAGE COSTS"
echo "---------------------------"
echo "disk-status    - System overview"
echo "llm-usage      - This detailed breakdown"  
echo "system-health  - Full dashboard"