# Global Claude Code Instructions

**IMPORTANT**: Copy this file to `~/.claude/CLAUDE.md` for global settings that apply to ALL projects.

```bash
# Install global Claude Code instructions
cp CLAUDE_HOME.md ~/.claude/CLAUDE.md
```

**What this file does**: Provides cross-project directives that override default Claude behavior.

---

## 🚨 CRITICAL: Agent Usage Policy

### MANDATORY Agent Usage

**RULE**: When an agent exists for a specific purpose, you MUST use that agent. Do NOT bypass agents by thinking "this is simple enough to do directly."

**Why this matters**: Agents exist because:
1. They have specialized workflows
2. They follow established patterns
3. They maintain consistency across projects
4. They have built-in safety checks
5. They know when to ask for human approval

### Anti-Patterns (DO NOT DO THIS)

❌ **WRONG**: "This is a simple dependency update, I'll just run `pnpm add package@latest` directly"
✅ **CORRECT**: Use the dependency-update agent/workflow defined in ADR-012

❌ **WRONG**: "This is just a quick PR comment reply, I'll use `gh api` directly"
✅ **CORRECT**: Use the github-pr-comment-processor agent

❌ **WRONG**: "This is a simple git commit, I'll just commit directly"
✅ **CORRECT**: Follow the git commit workflow in ADR-010 (branch-based autonomy)

❌ **WRONG**: "This is straightforward deployment monitoring, I'll check manually"
✅ **CORRECT**: Use the deployment-monitoring-agent

❌ **WRONG**: "This is just documentation sync, I'll use rsync directly"
✅ **CORRECT**: Use the template-sync-workflow skill and scripts

### When Agent Usage is REQUIRED

If ANY of these conditions are true, you MUST use the agent:

1. **An agent file exists** in `.claude/agents/` matching the task
2. **A skill exists** in `.claude/skills/` matching the task
3. **An ADR exists** defining a workflow for the task
4. **A subagent exists** in `.claude/agents/` for the domain
5. **The user recommends an agent** - always follow this suggestion

### Detection: How to Know an Agent Exists

**Before starting ANY task**, check:

```bash
# Check for relevant agent
ls .claude/agents/ | grep -i <task-keyword>

# Check for relevant skill
ls .claude/skills/ | grep -i <task-keyword>

# Check for relevant ADR
ls docs/adr/ | grep -i <task-keyword>

# Check for relevant subagent
ls .claude/agents/ | grep -i <task-keyword>
```

**Example**:
```bash
# User: "Update the next package to the latest version"

# Check for agent
ls .claude/agents/ | grep -i update
# → Nothing

# Check for skills
ls .claude/skills/ | grep -i update
# → Nothing

# Check for ADRs
ls docs/adr/ | grep -i dependency
# → ADR-012-automated-dependency-update-workflow.md

# ✅ CORRECT ACTION: Read ADR-012 and follow its workflow
# ❌ WRONG ACTION: "This is simple, I'll just run pnpm add"
```

### User Override is ABSOLUTE

**If the user says**: "Use the [name] agent"
**You MUST**: Use that agent, NO EXCEPTIONS

Do NOT respond with:
- "That agent is for more complex tasks, this is simple"
- "I can handle this directly without the agent"
- "The agent is overkill for this"

The user knows the architecture better than you. Follow their direction.

---

## 🎯 Execution Philosophy

### 1. Research BEFORE Implementation

Before writing ANY code:
1. **Search codebase** for existing solutions
2. **Check documentation** for established patterns
3. **Review ADRs** for architectural decisions
4. **Identify relevant agents/skills**
5. **Ask clarifying questions** if uncertain

### 2. Never Assume Simplicity

**WRONG mindset**: "This is simple, I'll just do it quickly"
**CORRECT mindset**: "Let me check if there's an established pattern for this"

Tasks that seem "simple" often have:
- Hidden edge cases
- Established workflows
- Required approvals
- Testing requirements
- Documentation needs

### 3. Tool Selection Hierarchy

When choosing how to accomplish a task, use this priority order:

1. **Dedicated Agent** (`.claude/agents/`)
2. **Skill with Scripts** (`.claude/skills/`)
3. **ADR Workflow** (`docs/adr/`)
4. **Subagent** (`.claude/agents/`)
5. **Direct Tool Usage** (only if none of the above exist)

### 4. ADR Compliance

**ADRs are not suggestions** - they are REQUIRED architectural decisions.

If an ADR exists for the task:
- ✅ Read the entire ADR
- ✅ Follow the workflow exactly
- ✅ Use the specified tools/patterns
- ❌ Don't skip steps because "they seem unnecessary"
- ❌ Don't create your own "better" approach

---

## 📋 Common Task → Agent Mapping

| Task | Check For | Required Reading |
|------|-----------|------------------|
| **Dependency updates** | ADR-012 | Automated dependency workflow |
| **PR comments** | github-pr-comment-processor | Agent workflow |
| **Deployment monitoring** | deployment-monitoring-agent | Agent workflow |
| **Template sync** | template-sync-workflow skill | Skill + scripts |
| **Git commits** | ADR-010 | Branch-based autonomy |
| **Architecture decisions** | architecture-agent subagent | Subagent workflow |
| **Code reviews** | quality-reviewer subagent | Subagent workflow |
| **User stories** | product-manager subagent | Subagent workflow |

---

## 🚫 Bypass Exceptions

The ONLY times you can skip agents:

1. **Emergency fixes** - Critical production issues requiring immediate action
2. **User explicitly says** - "Don't use the agent for this"
3. **Agent doesn't exist** - No agent/skill/ADR/subagent for the task

Even in exceptions, you should:
- ✅ Document why you bypassed the agent
- ✅ Create a follow-up task to formalize the pattern
- ✅ Ask if a new agent/ADR should be created

---

## 🎓 Learning from Mistakes

### Scenario: User recommends agent but Claude ignores it

**What happened**:
```
User: "Use the template-sync-workflow skill for this"
Claude: "This is a simple rsync operation, I'll handle it directly"
[Proceeds to use rsync without the skill]
```

**Why this is WRONG**:
1. User explicitly recommended the agent
2. The skill has scripts, safety checks, and established patterns
3. "Simple" doesn't mean "skip the established workflow"
4. Undermines the architecture the team built

**Correct behavior**:
```
User: "Use the template-sync-workflow skill for this"
Claude: "I'll use the template-sync-workflow skill as recommended."
[Reads skill, uses provided scripts, follows established workflow]
```

### Scenario: Claude thinks task is too simple for agent

**What happened**:
```
User: "Update this dependency"
Claude: "I'll run pnpm add package@latest"
[Skips ADR-012 workflow]
```

**Why this is WRONG**:
1. ADR-012 exists for dependency updates
2. Workflow includes: one-at-a-time, testing, rollback plan
3. "Simple" updates can break production
4. Skipping workflow bypasses safety checks

**Correct behavior**:
```
User: "Update this dependency"
Claude: [Checks for ADRs about dependencies]
Claude: [Finds ADR-012]
Claude: "I'll follow the automated dependency update workflow from ADR-012"
[Follows workflow: update one dep, test before & after, commit with rollback plan]
```

---

## ✅ Self-Check Before Starting Task

Ask yourself these questions BEFORE executing:

1. **Did I search for relevant agents?**
   - [ ] Checked `.claude/agents/`
   - [ ] Checked `.claude/skills/`
   - [ ] Checked `docs/adr/`
   - [ ] Checked `.claude/agents/`

2. **Did the user recommend an agent?**
   - [ ] If YES → Use it, no exceptions

3. **Is there an established pattern?**
   - [ ] If YES → Follow it exactly

4. **Am I thinking "this is simple"?**
   - [ ] If YES → Double-check for agents/patterns

5. **Would bypassing the agent save time?**
   - [ ] This is a RED FLAG - established patterns exist for a reason

---

## 📝 Documentation Standards

**When you do bypass an agent** (rare exceptions only):

```markdown
## Why No Agent Used

**Task**: [Description]
**Considered**: [Agent/skill checked]
**Reason for bypass**: [Emergency | User requested | No agent exists]
**Follow-up**: [Create ADR | Add to backlog | Document pattern]
```

---

## 🔄 Feedback Loop

If you find yourself repeatedly thinking:
- "The agent is overkill for this"
- "This is too simple for the workflow"
- "I can do this faster without the agent"

**STOP** - You're operating against the architecture. Either:
1. Follow the established pattern (most likely)
2. Discuss with the user whether the pattern should be simplified
3. Never silently bypass without discussion

---

## 🎯 Success Criteria

You're following this correctly when:

✅ You check for agents BEFORE starting tasks
✅ You follow user recommendations without question
✅ You read ADRs completely before implementing
✅ You use established patterns even for "simple" tasks
✅ You ask "is there an agent for this?" reflexively
✅ You never think "this is too simple for the workflow"

You're NOT following this when:

❌ You skip agents because the task seems simple
❌ You ignore user agent recommendations
❌ You create your own approach instead of following ADRs
❌ You think "I know a faster way"
❌ You bypass safety checks to save time

---

## 🚀 Quick Reference

**Before ANY task**:
1. Check for agents: `.claude/agents/`, `.claude/skills/`, `.claude/agents/`
2. Check for ADRs: `docs/adr/`
3. If any exist → Use them
4. If user recommended → Use it
5. If you think "this is simple" → That's a warning sign, not permission to skip

**Remember**: Agents and established patterns exist because someone learned a lesson. Don't re-learn it the hard way.

---

**Installation Reminder**:
```bash
cp CLAUDE_HOME.md ~/.claude/CLAUDE.md
```

This makes these rules apply to ALL your Claude Code sessions globally.
