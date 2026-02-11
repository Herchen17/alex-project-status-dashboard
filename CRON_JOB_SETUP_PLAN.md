# 8-HOUR KANBAN REVIEW CRON JOB SETUP - SOLDIER-PM-012

## 🎯 OBJECTIVE
Set up automated 8-hour cron job to systematically review kanban board and work on highest priority jobs.

## 📋 SYSTEMATIC IMPLEMENTATION PLAN

### **STEP 1: Determine Correct Cron Format**
- [ ] **SOLDIER-PM-012A**: Research Gateway cron job syntax and parameters
- [ ] **SOLDIER-PM-012B**: Test cron job creation with simple example
- [ ] **SOLDIER-PM-012C**: Validate model specification (MiniMax for cost efficiency)

### **STEP 2: Create Kanban Review Job**
- [ ] **SOLDIER-PM-012D**: Implement 8-hour interval cron job (every 28800000ms)
- [ ] **SOLDIER-PM-012E**: Set up MiniMax model for cost-efficient reviews
- [ ] **SOLDIER-PM-012F**: Configure context messages for kanban state

### **STEP 3: Define Review Protocol**
**Cron Job Tasks** (every 8 hours):
1. Check all SOLDIER jobs marked TODO
2. Prioritize by project priority (CRITICAL > HIGH > MEDIUM > LOW)
3. Work on highest priority job available
4. Update any IN_PROGRESS jobs older than 8 hours
5. Flag blocked jobs for Alex with context
6. Report progress summary

### **STEP 4: Test and Validate**
- [ ] **SOLDIER-PM-012G**: Test cron job execution manually
- [ ] **SOLDIER-PM-012H**: Verify job selection logic works correctly  
- [ ] **SOLDIER-PM-012I**: Confirm cost optimization (MiniMax usage)
- [ ] **ALEX-PM-002**: Review cron job behavior and effectiveness

## 🔧 TECHNICAL SPECIFICATIONS

### **Schedule**: Every 8 hours (28800000ms intervals)
### **Model**: MiniMax-M2 (cost-efficient for routine reviews)
### **Context**: 3 messages for kanban state understanding
### **Actions**:
```
1. Read current PROJECTS.md state
2. Identify highest priority SOLDIER TODO job
3. Begin work on that job OR update IN_PROGRESS job
4. Report status and next actions
```

## 🚨 CURRENT BLOCKER
**ISSUE**: Cron job syntax error - need to research correct Gateway cron format
**NEXT ACTION**: SOLDIER-PM-012A to resolve syntax and implement

---

**STATUS**: Plan created, implementation blocked on cron syntax research
**PRIORITY**: CRITICAL (core to systematic operation)
**OWNER**: SOLDIER