# JOB AUTOMATION SYSTEM

## Automated Job Management

### Cron Job: Regular Job Checking
**Schedule:** Every 2 hours during work hours (8 AM - 10 PM AEST)
**Purpose:** Check for SOLDIER jobs that can be worked on

```bash
# Cron schedule: 0 8-22/2 * * * 
# Runs at: 8:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00, 22:00 AEST
```

### Job Checking Logic

1. **Load current project state** from `PROJECTS.md`
2. **Identify available SOLDIER jobs** with status `TODO`
3. **Check dependencies** - ensure no blocking requirements
4. **Prioritize by project priority** (CRITICAL > HIGH > MEDIUM > LOW)
5. **Work on highest priority job** or **batch similar jobs**
6. **Update job status** to `IN_PROGRESS` 
7. **Execute the work**
8. **Update status** to `REVIEW` or `DONE` or create handoff job for Alex

### Handoff Process

When a SOLDIER job needs Alex's input:
1. Update job status to `BLOCKED`
2. Create corresponding ALEX job with clear context:
   - What was accomplished
   - What decision/input is needed  
   - What the options are
   - What the recommendation is
3. Send notification if urgent

### Job Categories

**SOLDIER Can Do Autonomously:**
- Research and analysis
- Code writing and testing
- File organization and documentation
- System monitoring and maintenance
- Content creation (drafts)
- Data processing and reporting

**ALEX Required For:**
- Strategic decisions
- External communications (emails, posts)
- Financial transactions
- API key management
- Final approvals before deployment
- Priority changes

### Automation Commands

```bash
# Check for available jobs
clawdbot agents run main "Check PROJECTS.md for SOLDIER jobs marked TODO. Work on highest priority item."

# Daily project summary  
clawdbot agents run main "Generate daily project progress report from PROJECTS.md"

# Weekly cleanup
clawdbot agents run main "Review completed jobs in PROJECTS.md and archive old completed tasks"
```

### Success Metrics

- **No SOLDIER job in TODO status > 24 hours**
- **All IN_PROGRESS jobs have daily updates**
- **Clear handoffs with specific asks**
- **Completed projects properly archived**
- **Always something being worked on**