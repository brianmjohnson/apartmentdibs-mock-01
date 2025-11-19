# Human-in-the-Loop (HITL) Batch Review Guide

Complete guide to the efficient batch HITL review process.

## Overview

The HITL system allows Claude Code to work autonomously while pausing at critical decision points for human approval. The **batch review** approach enables you to review multiple decisions efficiently rather than interrupting workflow for each individual decision.

## Core Concepts

### Individual HITL Files

As Claude works, it creates individual HITL files when human input is needed:

- `docs/hitl/hitl-2025-01-15-001.md` - User story approval
- `docs/hitl/hitl-2025-01-15-002.md` - ADR decision
- `docs/hitl/hitl-2025-01-15-003.md` - Technical approach question

### Batch Review Files

At natural checkpoints, Claude consolidates HITL files into batches:

- `docs/hitl/REVIEW_BATCH_2025-01-15_user-stories.md`
- `docs/hitl/REVIEW_BATCH_2025-01-15_adrs.md`
- `docs/hitl/REVIEW_BATCH_2025-01-15_tech-specs.md`
- `docs/hitl/REVIEW_BATCH_2025-01-15_qa-issues.md`

### Status Values

Each HITL file has a status field:

- `PENDING` - Awaiting human review
- `APPROVED` - Human approved, proceed
- `NEEDS_REVISION` - Needs changes (comments added)
- `REJECTED` - Won't proceed with this approach

## The Four HITL Checkpoints

### Checkpoint #1: User Story Review

**When**: After product manager agent creates all user stories for batch

**What**: Review all generated user stories before architecture phase

**Batch File**: `REVIEW_BATCH_<date>_user-stories.md`

**Quick Actions Available**:

- Approve all stories (US-001 through US-010)
- Approve by priority (all P0 stories)
- Review individually

**Example Batch File**:

```markdown
# HITL Review Batch - User Stories - 2025-01-15

## Summary

- Total Stories: 10
- P0 (MVP): 5 stories
- P1 (Important): 3 stories
- P2 (Nice to have): 2 stories

## Quick Review Options

- [ ] Approve all P0 stories (US-001 to US-005)
- [ ] Approve all P1 stories (US-006 to US-008)
- [ ] Review all individually

## Individual Stories

### P0 Stories (MVP Must-Haves)

- [US-001](./hitl-2025-01-15-001.md) - User Authentication ⏱️ 8 pts
- [US-002](./hitl-2025-01-15-002.md) - User Profile Creation ⏱️ 5 pts
  ...

## Instructions

1. Review summary and stories
2. Check quick actions OR review individually
3. Update status in each linked hitl-\*.md file
4. Run: `pnpm hitl:resume`
```

**How to Review**:

1. Open batch file
2. Review summary stats
3. For bulk approval: Check box and mark all linked files as `APPROVED`
4. For individual review: Open each link, read full story, mark status
5. Add comments in `NEEDS_REVISION` files
6. Run `pnpm hitl:resume`

---

### Checkpoint #2: Architecture Decision Review

**When**: After architecture agent creates/updates ADRs

**What**: Review all DRAFT ADRs before implementation

**Batch File**: `REVIEW_BATCH_<date>_adrs.md`

**Categories**:

- New ADRs (DRAFT)
- Updated ADRs (NEEDS_REVIEW)
- Deprecated ADRs

**Example Batch File**:

```markdown
# HITL Review Batch - ADRs - 2025-01-15

## Summary

- New ADRs: 3
- Updated ADRs: 1
- Deprecations: 1

## New Architecture Decisions (DRAFT)

### ADR-003: State Management with Zustand

- [Review File](./hitl-2025-01-15-008.md)
- **Context**: Need client-side state for user preferences
- **Decision**: Use Zustand over Redux or Context API
- **Why**: Simpler, smaller bundle, good TypeScript support
- **Alternatives**: Redux Toolkit, Jotai, Context API

### ADR-004: File Upload to Vercel Blob

- [Review File](./hitl-2025-01-15-009.md)
- **Context**: Need storage for user-uploaded images
- **Decision**: Vercel Blob (integrated with deployment)
- **Alternatives**: S3, Cloudinary, Uploadthing

## Updated ADRs

### ADR-001: Authentication Strategy (NEEDS_REVIEW)

- [Review File](./hitl-2025-01-15-010.md)
- **Change**: Adding Discord OAuth to existing Google auth
- **Reason**: User request for Discord login

## Quick Actions

- [ ] Approve all new ADRs
- [ ] Review individually

## Instructions

1. Review each ADR's context, decision, and alternatives
2. Mark status: APPROVED or NEEDS_REVISION (with comments)
3. For approved ADRs: Update ADR file status to APPROVED
4. Run: `pnpm hitl:resume`
```

**How to Review**:

1. Understand the context and problem
2. Evaluate if the decision makes sense
3. Check if alternatives were properly considered
4. Approve or request revision with specific feedback
5. Update ADR status field when approved

---

### Checkpoint #3: Technical Specification Review

**When**: After backend + frontend specs created

**What**: Review API contracts, schemas, component designs

**Batch File**: `REVIEW_BATCH_<date>_tech-specs.md`

**Focus Areas**:

- API contracts align between FE and BE
- Data models are well-designed
- Access control policies are correct
- Component hierarchy makes sense

**Example Batch File**:

```markdown
# HITL Review Batch - Technical Specs - 2025-01-15

## Summary

- Stories with specs: 5
- New ZenStack models: 3
- New components: 8
- API endpoints (generated): 12

## Specifications by Story

### US-001: User Authentication

- [Review File](./hitl-2025-01-15-015.md)

**Backend Spec**:

- Models: User, Session, Account (in zschema/auth.zmodel)
- tRPC routes: Generated by ZenStack
- Access policies: Defined in model

**Frontend Spec**:

- Components: LoginForm, SignupForm, AuthProvider
- Hooks: useAuth (custom), useCreateUser (generated)
- Routes: /login, /signup, /logout

**Contract**: User creation returns { id, email, name }

### US-002: User Profile

- [Review File](./hitl-2025-01-15-016.md)

**Backend Spec**:

- Model: Profile (extends BaseModel, FK to User)
- Fields: displayName, bio, avatar, preferences
- Access: Users can read all, update own

**Frontend Spec**:

- Components: ProfileForm, ProfileCard, AvatarUpload
- Hooks: useProfile, useUpdateProfile (generated)
- Validation: Zod schema from generated types

## Review Checklist

- [ ] Frontend/backend contracts match
- [ ] Access control policies are secure
- [ ] Data models follow schema patterns
- [ ] All required fields identified
- [ ] Component hierarchy is logical

## Instructions

1. Verify API contracts align
2. Check data model design
3. Review access control policies
4. Mark status in linked files
5. Run: `pnpm hitl:resume`
```

**How to Review**:

1. Verify frontend expects what backend provides
2. Check data models make sense
3. Ensure access control is secure
4. Approve or request changes

---

### Checkpoint #4: QA Issues Review

**When**: Quality reviewer finds problems during testing

**What**: Decide how to handle issues (fix, defer, refine)

**Batch File**: `REVIEW_BATCH_<date>_qa-issues.md`

**Decision Options**:

- **Fix**: Send back to developer agent
- **Refine**: Update user story, re-implement
- **Defer**: Create new story for future
- **Accept**: Issue is acceptable

**Example Batch File**:

```markdown
# HITL Review Batch - QA Issues - 2025-01-15

## Summary

- Stories reviewed: 5
- Issues found: 8
- Critical: 2
- Minor: 6

## Critical Issues (Block Merge)

### Issue #1: Authentication Bypass

- **Story**: US-001 (User Authentication)
- [Review File](./hitl-2025-01-15-025.md)
- **Problem**: Password reset doesn't verify email ownership
- **Impact**: Security vulnerability
- **Recommendation**: Fix immediately

**Your Decision**:

- [ ] Fix (send back to backend developer)
- [ ] Refine story (update acceptance criteria)

### Issue #2: Data Loss on Form Error

- **Story**: US-003 (Profile Update)
- [Review File](./hitl-2025-01-15-026.md)
- **Problem**: Form clears on validation error
- **Impact**: Poor UX, user frustration
- **Recommendation**: Fix

**Your Decision**:

- [ ] Fix (send back to frontend developer)
- [ ] Accept (with TODO comment)

## Minor Issues (Can Defer)

### Issue #3: Missing Loading Skeleton

- **Story**: US-002 (Profile Display)
- [Review File](./hitl-2025-01-15-027.md)
- **Problem**: No loading state, shows blank page briefly
- **Impact**: Minor UX polish
- **Recommendation**: Defer to future story

**Your Decision**:

- [ ] Fix now
- [ ] Defer (create US-011)
- [ ] Accept as-is

## Instructions

1. Review each issue
2. For CRITICAL: Must fix before merge
3. For MINOR: Decide fix now vs defer vs accept
4. Mark decision in each linked file
5. Run: `pnpm hitl:resume`
```

**How to Review**:

1. Assess severity of each issue
2. Critical issues must be fixed
3. Minor issues: balance quality vs velocity
4. Provide clear direction for each

---

## Batch Review Workflow

### Step-by-Step Process

#### 1. Claude Generates HITL Files

As Claude works autonomously, it creates individual HITL files:

```
docs/hitl/
├── hitl-2025-01-15-001.md (US-001 approval)
├── hitl-2025-01-15-002.md (US-002 approval)
├── hitl-2025-01-15-003.md (ADR-003 approval)
└── ...
```

Each file has:

- **Status**: PENDING
- **Category**: user-story, adr, tech-spec, qa-issue
- **Context**: What decision is needed
- **Research**: What Claude found
- **Options**: Possible approaches
- **Recommendation**: Claude's suggestion

#### 2. Claude Creates Batch Review

At checkpoints, Claude consolidates:

```
docs/hitl/REVIEW_BATCH_2025-01-15_user-stories.md
```

This file:

- Summarizes all pending decisions
- Groups by category
- Provides quick action options
- Links to individual HITL files

#### 3. You Review the Batch

Open batch file, review summary, choose:

**Option A: Bulk Approval**

- Check quick action box
- Update all linked files to `APPROVED`
- Fast for straightforward batches

**Option B: Individual Review**

- Click each link
- Read full context
- Make individual decisions
- Add comments if needed

**Option C: Mixed Approach**

- Bulk approve obvious ones (e.g., all P2 stories)
- Review critical ones individually (e.g., P0 stories)

#### 4. Update HITL File Status

For each HITL file, edit the status field:

```markdown
**Status**: APPROVED
```

Or for revisions:

```markdown
**Status**: NEEDS_REVISION

**Human Feedback**:

- Change the authentication to use magic links instead of passwords
- Add 2FA requirement for admin users
- Update US-001.md with these changes
```

#### 5. Resume Workflow

Run the resume script:

```bash
pnpm hitl:resume
```

This script:

- Scans all HITL files
- Reports status summary
- Provides context for Claude to continue
- Marks batch as reviewed

#### 6. Claude Continues

Based on your decisions:

- **APPROVED**: Proceeds to next phase
- **NEEDS_REVISION**: Makes changes, updates files
- **REJECTED**: Archives story/ADR, continues with others

---

## HITL File Template

Each individual HITL file follows this structure:

```markdown
# HITL Request: [Title]

**Date**: YYYY-MM-DD
**Category**: user-story | adr | tech-spec | qa-issue
**Related**: US-XXX, ADR-XXX, etc.
**Status**: PENDING

## Problem Statement

[Clear description of what decision is needed and why]

## Context

### What We're Building

[Relevant user story or feature context]

### Research Completed

- Searched codebase for: [keywords]
- Web searched for: [queries]
- Found: [relevant docs, examples, patterns]
- Reviewed: [existing code, ADRs, dependencies]

### Sites/Resources Visited

- https://example.com/docs - [What was found]
- https://github.com/project - [Example implementations]

### Relevant Code Reviewed

- `path/to/file.ts:123` - [Why this is relevant]
- `docs/adr/002-previous-decision.md` - [Related decision]

## Options Considered

### Option 1: [Approach Name]

**Pros**:

- Benefit 1
- Benefit 2

**Cons**:

- Drawback 1
- Drawback 2

**Complexity**: Low | Medium | High
**Risk**: Low | Medium | High

### Option 2: [Alternative Approach]

[Same format]

### Option 3: [Another Alternative]

[Same format]

## Recommendation

**Preferred Option**: Option 1

**Reasoning**:

- Aligns with existing architecture (ADR-002)
- Lower complexity and risk
- Better long-term maintainability

## Questions for Human

1. Do you agree with Option 1?
2. Are there other approaches to consider?
3. Any constraints I'm missing?

## Decision Required

- [ ] Approve recommended approach
- [ ] Choose different option (specify which)
- [ ] Request more research (specify what)
- [ ] Defer this decision

---

## Human Response Section

**Status**: PENDING → Update to APPROVED, NEEDS_REVISION, or REJECTED

**Decision**: [Your decision here]

**Feedback/Instructions**: [Any additional context or changes needed]

**Next Steps**: [What should happen after this decision]
```

---

## Resume Script Details

### What `pnpm hitl:resume` Does

1. **Scans HITL Directory**

   ```bash
   docs/hitl/*.md
   ```

2. **Categorizes by Status**
   - APPROVED: X files
   - NEEDS_REVISION: Y files
   - REJECTED: Z files
   - PENDING: W files (awaiting review)

3. **Generates Summary Report**

   ```
   HITL Resume Report - 2025-01-15
   ================================

   APPROVED: 12 files
   - User Stories: 8
   - ADRs: 3
   - Tech Specs: 1

   NEEDS_REVISION: 2 files
   - US-003: hitl-2025-01-15-003.md
     Human feedback: Add 2FA requirement
   - ADR-004: hitl-2025-01-15-009.md
     Human feedback: Consider cost implications

   REJECTED: 1 file
   - US-010: Out of scope for v1.0

   PENDING: 0 files (all reviewed!)

   Next Steps:
   - Implement approved items
   - Revise items with feedback
   - Archive rejected items
   ```

4. **Provides Context for Claude**
   The report becomes input for Claude to:
   - Continue with approved work
   - Make requested revisions
   - Archive rejected items
   - Proceed to next phase if all approved

---

## Best Practices

### For Efficient Reviews

1. **Batch Similar Items**
   - Review all user stories together
   - Review all ADRs together
   - Context switching is reduced

2. **Use Quick Actions When Appropriate**
   - Bulk approve low-risk items
   - Spend time on critical decisions

3. **Provide Clear Feedback**
   - Be specific in NEEDS_REVISION comments
   - Reference examples when possible
   - Update the source document if needed

4. **Review Regularly**
   - Check for HITL batches at natural breaks
   - Don't let PENDING files accumulate
   - Faster feedback = faster iteration

### For Clear Communication

1. **In NEEDS_REVISION**:
   - State what needs to change
   - Explain why
   - Provide examples if helpful
   - Reference relevant ADRs or patterns

2. **In APPROVED**:
   - Can add optional clarifying notes
   - Highlight if there are edge cases to consider

3. **In REJECTED**:
   - Explain why this approach won't work
   - Suggest alternative if appropriate
   - Note if it could be reconsidered later

---

## Example Full Workflow

### Scenario: Building Authentication Feature

#### Day 1 Morning: User Story Phase

Claude generates US-001, US-002, US-003 for authentication feature.

**Claude creates**:

- `hitl-2025-01-15-001.md` - US-001 approval
- `hitl-2025-01-15-002.md` - US-002 approval
- `hitl-2025-01-15-003.md` - US-003 approval
- `REVIEW_BATCH_2025-01-15_user-stories.md` - Batch file

**You review** (10 minutes):

- Open batch file
- Quick scan of all 3 stories
- Check "Approve all P0 stories" box
- Update all 3 hitl files: `APPROVED`
- Run `pnpm hitl:resume`

#### Day 1 Afternoon: Architecture Phase

Claude identifies need for ADR-003 (auth strategy).

**Claude creates**:

- `hitl-2025-01-15-004.md` - ADR-003 approval
- `REVIEW_BATCH_2025-01-15_adrs.md`

**You review** (15 minutes):

- Read ADR-003 full context
- Consider alternatives
- Decide to use Better Auth instead of NextAuth
- Update hitl file: `NEEDS_REVISION` with feedback
- Run `pnpm hitl:resume`

**Claude revises**:

- Updates ADR-003 with Better Auth decision
- Creates new hitl file for revised ADR
- Adds to batch

**You re-review** (5 minutes):

- Approve revised ADR-003
- Run `pnpm hitl:resume`

#### Day 2: Technical Spec Phase

Claude creates backend + frontend specs.

**Claude creates**:

- `hitl-2025-01-15-005.md` - Tech spec review
- `REVIEW_BATCH_2025-01-15_tech-specs.md`

**You review** (20 minutes):

- Verify API contracts
- Check data models
- Approve all specs
- Run `pnpm hitl:resume`

#### Day 3: Implementation

Claude implements (no HITL needed during implementation).

#### Day 4: QA Phase

Quality reviewer finds 2 issues.

**Claude creates**:

- `hitl-2025-01-15-006.md` - Security issue (critical)
- `hitl-2025-01-15-007.md` - UX polish (minor)
- `REVIEW_BATCH_2025-01-15_qa-issues.md`

**You review** (10 minutes):

- Issue #1: Fix immediately
- Issue #2: Defer to US-004 (new story)
- Run `pnpm hitl:resume`

**Claude continues**:

- Fixes critical issue
- Creates US-004 for deferred UX improvement
- Generates session summary

#### Total HITL Time: ~60 minutes

#### Total Development Time: 3+ days

**Efficiency**: Human intervention only at key decision points, not continuous oversight.

---

## Troubleshooting

### All HITL Files Show PENDING

**Solution**: You haven't reviewed them yet. Open batch file and start reviewing.

### Resume Script Says "No Changes"

**Solution**: Make sure you updated status fields in individual HITL files, not just the batch file.

### Claude Keeps Creating HITL for Same Issue

**Solution**: Ensure you updated the source (e.g., ADR file status) in addition to HITL file.

### Too Many HITL Files Accumulating

**Solution**: Review batches daily. Set calendar reminder to check `docs/hitl/` for REVIEW_BATCH files.

---

## Summary

The batch HITL system enables:

- ✅ Autonomous Claude work with human oversight
- ✅ Efficient bulk review of similar decisions
- ✅ Clear audit trail of all decisions
- ✅ Faster iteration with less interruption
- ✅ Focus human time on critical decisions

**Key Takeaway**: Let Claude work autonomously, review in batches, provide clear feedback, resume workflow.
