#!/bin/bash
# LLM Usage Tracker for Clawdbot

echo "💰 CLAWDBOT LLM USAGE TRACKER"
echo "============================="
echo

# Check if session status is available
echo "📊 CURRENT SESSION STATUS"
echo "-------------------------"
if command -v clawdbot &> /dev/null; then
    echo "🔍 Gathering usage data..."
    echo
    
    # Get session status which includes token usage
    clawdbot status | grep -A 20 "Sessions"
    echo
    
    # Try to get more detailed model usage
    echo "🎯 MODEL USAGE BREAKDOWN"
    echo "-----------------------"
    
    # Check for usage logs or config
    if [ -f "/home/ubuntu/.clawdbot/usage.log" ]; then
        echo "Usage log found - analyzing..."
        tail -20 /home/ubuntu/.clawdbot/usage.log
    else
        echo "No dedicated usage log found"
    fi
    
    echo
    echo "⚙️  CONFIGURED MODELS"
    echo "-------------------"
    clawdbot status | grep -E "(model|claude|anthropic|minimax)" -i | sort | uniq
    
else
    echo "❌ Clawdbot CLI not available"
fi

echo
echo "📈 USAGE RECOMMENDATIONS"
echo "-----------------------"
echo "• Use MiniMax for heartbeats and routine tasks"
echo "• Use Claude Sonnet for regular conversations"
echo "• Use Claude Opus only for complex reasoning"
echo
echo "💡 To track costs precisely, consider adding usage logging to config"