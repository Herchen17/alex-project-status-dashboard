#!/bin/bash

# API Balance Checker for Anthropic and MiniMax
echo "🔍 API Balance Check - $(date)"
echo "================================"

# Extract API keys from config
ANTHROPIC_KEY=$(grep -o 'sk-ant-[^"]*' ~/.clawdbot/clawdbot.json | head -1)
MINIMAX_KEY="sk-api-KvSxKpdBANy12qHN9jl_KyDvw0doJsSi1z-IsmknWNWgoZlvU8rhaIQGuuZRihUjVRnAGcAOLSXkWIA9opAmVRwHuiGlaNWrzFliFyz4INrb3ERm6cjnUWs"

echo "📊 Anthropic Balance:"
# Try different Anthropic balance endpoints
for endpoint in "credits/balance" "organization/usage" "billing/balance"; do
    result=$(curl -s https://api.anthropic.com/v1/$endpoint \
        -H "x-api-key: $ANTHROPIC_KEY" \
        -H "anthropic-version: 2023-06-01")
    if echo "$result" | jq -e '.error.type != "not_found_error"' >/dev/null 2>&1; then
        echo "  $endpoint: $(echo "$result" | jq -c .)"
        break
    fi
done

echo ""
echo "💰 MiniMax Balance:"
# Try different MiniMax balance endpoints  
for endpoint in "billing/balance" "user/balance" "account/balance" "credits/balance"; do
    result=$(curl -s https://api.minimax.io/v1/$endpoint \
        -H "Authorization: Bearer $MINIMAX_KEY")
    if [ $? -eq 0 ] && [ "$result" != "404" ] && echo "$result" | jq . >/dev/null 2>&1; then
        echo "  $endpoint: $(echo "$result" | jq -c .)"
        break
    fi
done

echo ""
echo "🧪 Quick API Test:"
echo "  Anthropic: $(curl -s -X POST https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{"model":"claude-3-haiku-20240307","max_tokens":1,"messages":[{"role":"user","content":"Hi"}]}' \
    | jq -r '.error.type // "✅ Working"')"

echo "  MiniMax: $(curl -s -X POST https://api.minimax.io/anthropic/v1/messages \
    -H "Authorization: Bearer $MINIMAX_KEY" \
    -H "Content-Type: application/json" \
    -H "anthropic-version: 2023-06-01" \
    -d '{"model":"MiniMax-M2.1-lightning","max_tokens":1,"messages":[{"role":"user","content":[{"type":"text","text":"Hi"}]}]}' \
    | jq -r '.base_resp.status_msg // "✅ Working"' | sed 's/^$/✅ Working/')"

echo ""
echo "================================"