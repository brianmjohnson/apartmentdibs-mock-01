# HITL Review Batch - [Category] - YYYY-MM-DD

**Batch ID**: REVIEW_BATCH_YYYY-MM-DD_[category]
**Date Created**: YYYY-MM-DD
**Category**: User Stories | ADRs | Tech Specs | QA Issues | Mixed
**Total Items**: X
**Status**: `PENDING_REVIEW` | `IN_REVIEW` | `COMPLETED`

---

## Executive Summary

**Context**: [Why these decisions are grouped together]

**Overall Impact**: [High-level impact if all approved]

**Time Estimate**: [Estimated time to review this batch]

---

## Statistics

### By Type
- User Stories: X
- ADRs: Y
- Tech Specs: Z
- QA Issues: W
- Other: V

### By Priority
- P0 (Critical/MVP): X items
- P1 (Important): Y items
- P2 (Nice to Have): Z items
- P3 (Future): W items

### By Status
- Awaiting Review: X
- Needs Revision: Y (from previous round)
- Approved: Z (updated after review)

---

## Quick Review Options

Use these for bulk approval of low-risk items:

### Option A: Approve All
- [ ] **Approve all items in this batch**
  - Use when: All items are straightforward and low-risk
  - Action: Mark all linked HITL files as `APPROVED`

### Option B: Approve by Priority
- [ ] **Approve all P0 (MVP) items** (Items: #1-#5)
- [ ] **Approve all P1 (Important) items** (Items: #6-#8)
- [ ] **Approve all P2 (Nice to Have) items** (Items: #9-#10)

### Option C: Approve by Type
- [ ] **Approve all user stories** (Items: #1-#5)
- [ ] **Approve all ADRs** (Items: #6-#8)
- [ ] **Approve all tech specs** (Items: #9-#12)

### Option D: Review Individually
- Use when: High-risk decisions or unfamiliar territory
- Process: Open each link, review thoroughly, mark status

---

## Items for Review

### Critical Items (Review First)

These items are high-priority or high-risk and should be reviewed individually:

#### Item #1: [Title]
- **Type**: User Story | ADR | Tech Spec | QA Issue
- **Priority**: P0
- **Risk**: High | Medium | Low
- **HITL File**: [hitl-YYYY-MM-DD-001.md](./hitl-YYYY-MM-DD-001.md)

**Quick Summary**:
[1-2 sentence summary of the decision]

**Key Decision**:
[What's being decided - the core choice]

**Recommended**: [Option name]

**Why Review Carefully**:
[Reason this needs thorough review - high risk, breaking change, etc.]

**Quick Check**:
- [ ] Reviewed full context
- [ ] Alternatives considered
- [ ] Comfortable with recommendation
- [ ] Decision: `APPROVED` | `NEEDS_REVISION` | `REJECTED`

---

#### Item #2: [Another Critical Item]
[Same format]

---

### Standard Items (Can Bulk Approve)

These items are lower risk and follow established patterns:

#### Item #3: [Title]
- **Type**: User Story
- **Priority**: P1
- **Risk**: Low
- **HITL File**: [hitl-YYYY-MM-DD-003.md](./hitl-YYYY-MM-DD-003.md)

**Quick Summary**: [1-2 sentences]

**Recommended**: [Option name]

---

#### Item #4: [Title]
[Same format]

---

### Items Needing Revision (From Previous Round)

These items were previously marked `NEEDS_REVISION` and have been updated:

#### Item #X: [Title] (REVISED)
- **Original Review**: YYYY-MM-DD
- **Revision Date**: YYYY-MM-DD
- **HITL File**: [hitl-YYYY-MM-DD-0XX.md](./hitl-YYYY-MM-DD-0XX.md)

**What Was Changed**:
[Summary of revisions made based on feedback]

**Previous Feedback**:
> [Quote your previous feedback]

**How Addressed**:
[How the revision addresses your feedback]

**Re-Review**:
- [ ] Changes satisfy previous concerns
- [ ] Decision: `APPROVED` | `STILL_NEEDS_REVISION` | `REJECTED`

---

## Detailed Item List

### User Stories (X items)

| # | ID | Title | Priority | Risk | File | Status |
|---|---|---|---|---|---|---|
| 1 | US-001 | [User Authentication] | P0 | Low | [hitl-...-001.md](./hitl-...-001.md) | PENDING |
| 2 | US-002 | [User Profile] | P0 | Low | [hitl-...-002.md](./hitl-...-002.md) | PENDING |

### ADRs (Y items)

| # | ID | Title | Category | Risk | File | Status |
|---|---|---|---|---|---|---|
| 1 | ADR-003 | [State Management] | Technical | Medium | [hitl-...-003.md](./hitl-...-003.md) | PENDING |

### Tech Specs (Z items)

| # | Story | Component | Type | Risk | File | Status |
|---|---|---|---|---|---|---|
| 1 | US-001 | Auth Flow | FE+BE | Medium | [hitl-...-005.md](./hitl-...-005.md) | PENDING |

### QA Issues (W items)

| # | Story | Severity | Type | Recommended | File | Status |
|---|---|---|---|---|---|---|
| 1 | US-001 | Critical | Security | Fix Now | [hitl-...-010.md](./hitl-...-010.md) | PENDING |

---

## Review Checklist

Before marking this batch as complete:

### Preparation
- [ ] Read executive summary
- [ ] Understand overall context
- [ ] Note any high-risk items

### Review Process
- [ ] Critical items reviewed individually
- [ ] Standard items approved or reviewed as needed
- [ ] Revised items re-evaluated
- [ ] All decisions documented in individual HITL files

### Documentation
- [ ] Each HITL file status updated
- [ ] Feedback provided for NEEDS_REVISION items
- [ ] Rationale given for REJECTED items
- [ ] Next steps clear for all items

### Completion
- [ ] All items have status (no PENDING left)
- [ ] Ready to run `pnpm hitl:resume`
- [ ] Batch status changed to COMPLETED

---

## Review Instructions

### For Each Item

1. **Click HITL file link** to open full context
2. **Read the sections**:
   - Problem statement
   - Options considered
   - Recommendation
   - Questions for human
3. **Make decision**:
   - Approve: Mark status as `APPROVED`
   - Revise: Mark as `NEEDS_REVISION`, add specific feedback
   - Reject: Mark as `REJECTED`, explain why
4. **Save file** with updated status

### For Bulk Approval

1. **Check appropriate quick review box** above
2. **For each item in that category**:
   - Open HITL file
   - Update status to `APPROVED`
   - Save file
3. **Verify** all files updated

### After Review

1. **Update this batch file** status to `COMPLETED`
2. **Run resume command**:
   ```bash
   pnpm hitl:resume
   ```
3. **Confirm** Claude Code receives decisions

---

## Notes & Observations

[Add any patterns, concerns, or observations from this batch review]

**Common Themes**:
- [Any patterns across multiple items]

**Concerns**:
- [Any broader concerns that emerged]

**Follow-up Actions**:
- [Any actions needed beyond individual items]

---

## Batch Summary (After Review)

**Review Completed**: YYYY-MM-DD
**Reviewed By**: [Your name]
**Time Taken**: [How long to review]

**Decisions**:
- Approved: X items
- Needs Revision: Y items
- Rejected: Z items

**Next Batch**: [If there are more pending]
**Resume Command Run**: [ ] Yes [ ] No

---

## Metadata

**Created**: YYYY-MM-DD HH:MM
**Last Updated**: YYYY-MM-DD HH:MM
**Items Added**: X
**Items Removed**: Y (if any duplicate or consolidated)
**Version**: 1.0

**Tags**: #batch-review #[category] #[sprint-number]
