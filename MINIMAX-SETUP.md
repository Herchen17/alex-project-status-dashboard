# 🚀 MiniMax Setup Guide

## Why MiniMax?
- **Ultra-cheap**: $0.3 per million input tokens (vs Claude's much higher cost)
- **Perfect for automation**: Heartbeats, monitoring, cron jobs  
- **Fast**: 100 tokens/second with lightning model
- **Long context**: 204K tokens (same as Claude)

## Setup Steps

### 1. Get API Key
1. Visit: https://platform.minimax.io/user-center/basic-information/interface-key
2. Sign up/login to MiniMax platform
3. Navigate to "API Keys" section
4. Click "Create new secret key" (for pay-as-you-go)
5. Copy the API key (shown only once!)

### 2. Update Clawdbot Config
```bash
# Method 1: Using clawdbot CLI (if supported)
clawdbot config patch --set "models.providers.minimax.apiKey=sk-your-new-key-here"

# Method 2: Manual config edit
# Edit ~/.clawdbot/clawdbot.json and replace the apiKey value
```

### 3. Test Connection
```bash
clawdbot models list
# Should show MiniMax models if working
```

### 4. Switch Default Model (Optional)
```bash
clawdbot config patch --set "agents.defaults.model.primary=minimax/MiniMax-M2.1-lightning"
```

## Models Available

| Model | Speed | Best For |
|-------|-------|----------|
| `MiniMax-M2.1-lightning` | 100 tps | ⭐ **Automation, heartbeats** |  
| `MiniMax-M2.1` | 60 tps | General use |
| `MiniMax-M2` | - | Complex reasoning |

## Cost Comparison (Estimates)

| Provider | Cost per 1M tokens |
|----------|-------------------|
| **MiniMax** | **$0.30 input** ⭐ |
| Claude Sonnet | ~$15-30 |
| Claude Opus | ~$75+ |

**Savings**: 50-250x cheaper for automation tasks!

## Current Config Status
✅ **Provider configured**: `minimax` provider exists  
✅ **Models defined**: M2, M2.1, M2.1-lightning  
✅ **Endpoints correct**: `https://api.minimax.io/anthropic`  
❌ **API Key invalid**: Needs replacement with valid key  

## After Setup
- All automation will use MiniMax (massive cost savings)
- Heartbeats will be nearly free
- Can run monitoring every hour instead of every 4 hours
- Claude reserved for complex interactive work only

## Troubleshooting
- If models don't appear: API key is invalid
- If 404 errors: Check API endpoint (should be `/anthropic`)  
- If auth errors: Check key format and permissions