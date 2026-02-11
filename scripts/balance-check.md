# API Balance Monitoring

## Quick Status Check
Run: `./scripts/check-api-balances.sh`

## Integration Options

### Add to HEARTBEAT.md (recommended)
Add balance checks every few hours to catch low balances early.

### Cron Job Option  
Create dedicated balance monitoring job that alerts when credits are low.

## Current Status
- ✅ **MiniMax**: $25 USD, working
- ❓ **Anthropic**: Working but balance endpoint needs investigation

## Next Steps
1. Fix MiniMax model registration in Clawdbot
2. Find proper Anthropic balance endpoint
3. Set up low-balance alerts