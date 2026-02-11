# AUTOMATION.md - Automated Task Guidelines

## Model Usage for Automated Tasks

⚠️ **IMPORTANT**: All automated/repetitive tasks must use cheapest available models:

### ✅ **USE for automation** (cheapest first):
- **minimax/MiniMax-M2** (cheapest available - PREFERRED) ⭐ WORKING  
- **MiniMax-M2.1-lightning** (cheapest, fastest - but not working in Clawdbot yet)
- **claude-sonnet-4-20250514** (more expensive, avoid if possible)

### ❌ **NEVER use for automation** (expensive):
- `claude-opus-4-20250514` (expensive, for complex work only)
- `claude-opus-4-5-20250514` (most expensive, interactive use only)

### 🎯 **Current Settings**:
- **Heartbeats**: `minimax/MiniMax-M2` (configured in HEARTBEAT.md) ✅ WORKING
- **Cron jobs**: Should use `minimax/MiniMax-M2` 
- **Monitoring scripts**: Should use `minimax/MiniMax-M2`
- **Background tasks**: Should use `minimax/MiniMax-M2`

## Current Automated Tasks

### Disk Monitoring
- **Script**: `scripts/disk-monitor.sh`
- **Frequency**: Every 4 hours (not 30 minutes - too frequent)
- **Trigger**: Disk usage > 85%
- **Model**: Uses system scripts only, notifications via basic clawdbot message

### Heartbeat System
- **Script**: Built-in heartbeat system
- **Frequency**: As configured by gateway
- **Model**: `claude-sonnet-4-20250514` (set in HEARTBEAT.md)

## Adding New Automated Tasks

1. Always specify model in task configuration
2. Use Sonnet for routine/monitoring tasks
3. Test frequency - avoid over-polling
4. Add to this document for tracking

## Available Models (Cost Ranking)

1. **minimax/MiniMax-M2.1-lightning** - Cheapest, fastest ⭐ PREFERRED
2. **minimax/MiniMax-M2** - Very cheap alternative  
3. **anthropic/claude-sonnet-4-20250514** - More expensive, avoid
4. **anthropic/claude-opus-4-20250514** - Expensive, never use
5. **anthropic/claude-opus-4-5-20250514** - Most expensive, never use

## Cron Job Templates

### System Scripts (No AI needed)
```bash
# Disk monitoring every 4 hours
0 */4 * * * /home/ubuntu/clawd/scripts/disk-monitor.sh
```

### Clawdbot Cron Jobs (Using AI)
```javascript
// When using clawdbot cron system, specify model:
{
  "model": "minimax/MiniMax-M2.1-lightning",  // Use cheapest
  "schedule": "0 */4 * * *",
  "task": "Check system status and report issues"
}
```