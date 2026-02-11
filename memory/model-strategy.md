# Model Selection Strategy

## URGENT COST PRIORITIES ($15.29 in Jan!)

**Default: Sonnet** (now system default)
**MiniMax: Most tasks** (when working - $25 balance)  
**Opus 4.5: Complex only** (emergency use)

### Use Opus 4.5 ONLY for:
- Critical medical research  
- Complex statistical analysis requiring highest accuracy
- Publication-ready work that needs perfection
- When Alex explicitly requests best quality

### Use Sonnet for:
- Most conversations & daily tasks
- Research assistance 
- Code reviews & debugging
- File operations
- All heartbeats & cron jobs

### Use MiniMax for:
- High-volume tasks
- Background processing  
- Simple queries
- Repetitive work

## Implementation
1. **System default: Sonnet** ✅
2. **Heartbeats: Sonnet** ✅  
3. **Cron: Inherit default (Sonnet)** ✅
4. **Manual override**: `/model opus` only when needed

## Cost Tracking
- Monitor with `/status` to see per-model usage
- Weekly review of model distribution