# 🖥️ SYSTEM DASHBOARD

## 🌐 **WEB DASHBOARD (LIVE!)**
**URL:** `http://localhost:8080/`  
**API:** `http://localhost:8080/api/system-status`

**Commands:**
- `dashboard-start` - Start web server
- `dashboard-status` - Check if running
- `dashboard-stop` - Stop web server

## 📟 **COMMAND LINE TOOLS**
- `disk-status` - System health overview  
- `disk-clean` - Force disk cleanup
- `llm-usage` - LLM token usage details
- `system-health` - Complete dashboard

---

## 🚨 DISK SPACE MONITORING

**Current Status:** Run `disk-status` for live data

**Automated Protection:**
- ✅ **Every 4 hours:** Check disk usage, auto-cleanup at 85%+
- ✅ **Daily at 2 AM:** Forced cleanup routine  
- ✅ **Emergency cleanup:** Triggers at 90%+ usage

**Manual Cleanup:**
```bash
disk-clean           # Force cleanup now
./scripts/disk-monitor.sh clean
```

**What gets cleaned:**
- Package caches (npm, apt)
- Old log files (>7 days)
- Temporary files
- Clawdbot session backups (>7 days)

---

## 💰 LLM USAGE & COST TRACKING

**Current Sessions:** Run `llm-usage` for live data

**Model Hierarchy (Cost: Low → High):**
1. **MiniMax-M2** - Cheapest, use for routine tasks
2. **Claude Sonnet** - Balanced, default for conversations  
3. **Claude Opus** - Most expensive, complex reasoning only

**Cost Optimization:**
- Heartbeats use MiniMax (configured in HEARTBEAT.md)
- Switch models: `clawdbot session --model minimax/MiniMax-M2`
- Check current: `clawdbot status`

---

## 📊 MONITORING FILES

**Logs & Status:**
- `/home/ubuntu/disk-monitor.log` - Cleanup history
- `/home/ubuntu/.clawdbot/agents/main/sessions/sessions.json` - Session data

**Scripts:**
- `scripts/disk-monitor.sh` - Disk management
- `scripts/system-status.sh` - System overview
- `scripts/llm-usage.sh` - LLM tracking

---

## 🛡️ AUTOMATIC PROTECTIONS

**Disk Space:**
- 🟢 <80%: Normal operation
- 🟡 80-89%: Warning, preventive cleanup
- 🔴 90%+: Critical, aggressive cleanup

**System Health:**
- Gateway monitoring
- Session management  
- Memory usage tracking

---

**Last Updated:** $(date)
**Reload aliases:** `source ~/.bashrc`