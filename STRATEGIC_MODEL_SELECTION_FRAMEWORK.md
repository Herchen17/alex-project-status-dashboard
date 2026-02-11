# STRATEGIC MODEL SELECTION FRAMEWORK - SOLDIER-CO-005

## 🎯 MANDATORY PRE-TASK MODEL DECISION PROCESS

**RULE**: Before every task, explicitly consider and document model selection reasoning.

## 📊 AVAILABLE MODELS & CHARACTERISTICS

### **Claude Opus 4/4.5** (`opus`)
- **Capability**: Highest reasoning, creativity, complex problem-solving
- **Cost**: Most expensive (~10-50x MiniMax)
- **Speed**: Slower
- **Use Cases**: High-stakes creative work, complex analysis, critical decisions

### **Claude Sonnet 4** (`sonnet`) 
- **Capability**: Strong reasoning, good creativity, reliable output
- **Cost**: Moderate (current default)  
- **Speed**: Moderate
- **Use Cases**: Standard complex tasks, writing, analysis

### **MiniMax-M2** (`minimax`)
- **Capability**: Good reasoning, cost-efficient, reliable
- **Cost**: Very low (50-250x cheaper than Claude)
- **Speed**: Fast
- **Use Cases**: Routine tasks, automation, background processing

### **MiniMax-M2.1-lightning** (`lightning`)
- **Capability**: Basic reasoning, very fast
- **Cost**: Lowest
- **Speed**: Fastest
- **Use Cases**: Simple tasks, quick responses, high-volume processing

## 🎯 DECISION MATRIX

### **OPUS - Use When:**
- **High-Stakes Creative**: Logo design, brand strategy, critical writing
- **Complex Analysis**: Multi-variable research, strategic planning
- **Revenue-Critical**: Client deliverables, proposals, presentations
- **Novel Problem-Solving**: First-time complex challenges
- **Quality > Cost**: When perfection matters most

**Examples**: 
- Final client proposals for UGC Creator Agent
- Strategic business model analysis
- Creative design briefs
- Critical architecture decisions

### **SONNET - Use When:**
- **Standard Complex Tasks**: Multi-step analysis, detailed writing
- **User-Facing Work**: Responses to Alex, important documentation
- **Moderate Complexity**: Research compilation, system design
- **Balanced Requirements**: Good quality needed but cost-conscious
- **Default Choice**: When unsure between tiers

**Examples**:
- User conversations (like this one)
- Complex research compilation  
- System architecture planning
- Detailed project documentation

### **MINIMAX - Use When:**
- **Routine Automation**: Scheduled tasks, monitoring, maintenance
- **Background Processing**: Data organization, file management
- **Repetitive Tasks**: Similar tasks repeated multiple times
- **Cost-Sensitive Work**: High-volume processing needed
- **Good Enough Quality**: When 80% quality suffices

**Examples**:
- Cron job executions
- Data processing and organization
- Routine monitoring and reporting
- Background research compilation
- Template-based content creation

### **LIGHTNING - Use When:**
- **Simple Tasks**: File operations, basic text processing
- **Quick Responses**: Status updates, simple confirmations  
- **High-Volume Processing**: Bulk data operations
- **Testing/Development**: Rapid iteration cycles
- **Ultra-Cost-Sensitive**: Maximum efficiency needed

**Examples**:
- File organization and cleanup
- Simple status reports
- Basic template filling
- Quick data transformations
- Development testing cycles

## 🧠 TASK COMPLEXITY ASSESSMENT

### **Complexity Indicators**

#### **HIGH COMPLEXITY** → Opus
- Multiple interconnected variables
- Novel or unprecedented challenges  
- Creative/strategic thinking required
- High-stakes outcomes (revenue, reputation)
- Complex multi-step reasoning chains

#### **MEDIUM COMPLEXITY** → Sonnet  
- Established patterns with some novelty
- Multi-step analysis required
- User-facing deliverables
- Moderate stakes
- Standard professional work

#### **LOW COMPLEXITY** → MiniMax
- Routine, repeatable processes
- Clear patterns and templates
- Background/automation work
- Low stakes for quality variance
- Cost efficiency prioritized

#### **SIMPLE TASKS** → Lightning
- Single-step operations
- Well-defined inputs/outputs  
- No creative thinking required
- Speed more important than quality
- Maximum cost efficiency needed

## ⚡ IMPLEMENTATION STRATEGY

### **Pre-Task Model Decision Checklist**
Before every task, ask:

1. **Stakes Assessment**: 
   - High stakes (client-facing, revenue-critical) → Opus
   - Medium stakes (important but internal) → Sonnet  
   - Low stakes (routine, background) → MiniMax/Lightning

2. **Complexity Assessment**:
   - Novel/creative problem → Opus
   - Standard complex work → Sonnet
   - Routine/template work → MiniMax/Lightning

3. **Quality Requirements**:
   - Perfection required → Opus
   - Good quality needed → Sonnet
   - Good enough suffices → MiniMax/Lightning

4. **Cost Sensitivity**:
   - Quality over cost → Opus
   - Balanced → Sonnet
   - Cost efficiency priority → MiniMax/Lightning

5. **Speed Requirements**:
   - Quality over speed → Opus
   - Balanced → Sonnet  
   - Speed priority → Lightning

### **Documentation Format**
```
**MODEL SELECTION**: [chosen_model]
**REASONING**: [complexity/stakes/requirements analysis]
**TASK**: [brief description]
```

## 📋 COMMON USE CASE MAPPING

### **OPUS TASKS**
- ✅ UGC Creator Agent business model development
- ✅ Client proposal creation
- ✅ Strategic planning documents
- ✅ Brand/creative strategy development
- ✅ Complex technical architecture
- ✅ High-stakes problem solving

### **SONNET TASKS**
- ✅ User conversations and responses
- ✅ Complex research compilation
- ✅ Detailed documentation writing
- ✅ Multi-step analysis projects
- ✅ System design and planning
- ✅ Professional deliverable creation

### **MINIMAX TASKS**
- ✅ Cron job automation
- ✅ Data processing and organization
- ✅ Routine monitoring and reporting
- ✅ Background research tasks
- ✅ Template-based content
- ✅ Sub-agent routine work

### **LIGHTNING TASKS**
- ✅ File operations and cleanup
- ✅ Simple data transformations
- ✅ Quick status updates
- ✅ Basic template filling
- ✅ Rapid testing cycles
- ✅ Simple automation scripts

## 🎯 COST OPTIMIZATION TARGETS

### **Model Usage Goals**
- **Opus**: <5% of tasks (high-value only)
- **Sonnet**: 20-30% (user-facing, complex)  
- **MiniMax**: 60-70% (routine, automation)
- **Lightning**: 10-20% (simple, high-volume)

### **Cost Monitoring**
- Track model usage patterns weekly
- Calculate cost per task category
- Optimize model selection based on outcomes
- Report cost savings from strategic selection

## ⚡ IMMEDIATE IMPLEMENTATION

### **Next Task Examples**

**SOLDIER-UI-007** (Implement kanban redesign):
- **Complexity**: Medium (standard implementation work)
- **Stakes**: Medium (important for productivity)  
- **Quality**: Good quality needed
- **DECISION**: **SONNET** (balanced complexity, user-facing)

**SOLDIER-UGC-004** (LinkedIn outreach execution):
- **Complexity**: Low (routine automation)
- **Stakes**: Low (background process)
- **Quality**: Good enough (template-based)
- **DECISION**: **MINIMAX** (cost-efficient automation)

**BitClaw strategic analysis**:
- **Complexity**: High (novel blockchain problem)
- **Stakes**: High (revenue opportunity)
- **Quality**: Perfection needed
- **DECISION**: **OPUS** (critical business analysis)

---

**✅ SOLDIER-CO-005 COMPLETE**

**Framework Created**: Mandatory pre-task model selection with decision matrix, complexity assessment, and cost optimization targets.

**Implementation**: Starting immediately - all future tasks will include explicit model selection reasoning.

**Next Action**: SOLDIER-CO-006 - Apply this framework to immediate task queue and document initial results.