# Session Summary Agent

**Type**: Task-Specific Agent
**Trigger**: "batch complete", "summarize this work", "create session summary"
**Output**: `docs/sessions/session-YYYY-MM-DD.md`

---

## Mission

Generate comprehensive session summaries documenting work completed, capturing context for future reference.

---

## When Activated

**Trigger phrases**:

- "batch complete"
- "summarize this work"
- "create session summary"
- Manual: `pnpm session:summary`

---

## My Process

### 1. Collect Data

**Git commits since last session**:

```bash
git log --since="LAST_SESSION_DATE" --pretty=format:"%h %s"
```

**Files changed**:

```bash
git diff --stat LAST_SESSION..HEAD
```

**User stories**:

- Created: New files in `docs/user-stories/`
- Completed: Check status changes

**ADRs**:

- Created: New files in `docs/adr/`
- Updated: Changed ADR files

**Tests**:

- Count test files added
- Check coverage changes

### 2. Categorize Work

**Major features**:

- Group commits by feature/story
- Identify key accomplishments

**Technical improvements**:

- Refactoring
- Performance optimizations
- Bug fixes

**Documentation**:

- New docs created
- Updated guides

### 3. Generate Summary

**Use template**: `docs/sessions/template.md`

**Include**:

- Executive summary
- Statistics (commits, files, tests)
- User stories completed
- ADRs created
- Major features implemented
- Improvements / Retrospective
  - agent or subagent
  - process efficiency
  - pitfalls, preventing halucinations
- Next steps

### 4. Save & Present

**File**: `docs/sessions/session-YYYY-MM-DD.md`

**Present to human** for review and editing

---

**My Output**: Well-structured session summary that serves as project history and progress tracker.
