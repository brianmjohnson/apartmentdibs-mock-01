# HITL Request: [Title]

**Date**: YYYY-MM-DD
**Category**: `user-story` | `adr` | `tech-spec` | `qa-issue` | `implementation` | `other`
**Related**: US-XXX, ADR-XXX, Issue #XX
**Status**: `PENDING`

---

## Problem Statement

[Clear, concise description of what decision is needed and why]

### What We're Building

[Brief context from relevant user story or feature]

### Why Human Input is Needed

[Explain why autonomous decision isn't appropriate here]

---

## Context

### What I Know

[Summarize current understanding of the situation]

### Research Completed

#### Codebase Search

- **Searched for**: `keyword`, `pattern`
- **Found**: Path/to/file.ts:line - [Description]
- **Reviewed**: Existing implementations, patterns, utilities

#### Documentation Review

- **ADRs checked**: ADR-001 (relevant decision), ADR-002 (related pattern)
- **Guides reviewed**: docs/ARCHITECTURE.md, docs/WORKFLOW_GUIDE.md
- **User stories**: US-XXX (dependency), US-YYY (related)

#### Web Research

- **Searched for**: "[library name] getting started", "[api] nextjs integration"
- **Found**:
  - https://example.com/docs - [Summary of what was found]
  - https://github.com/project/examples - [Relevant examples]
  - https://blog.com/tutorial - [Tutorial or guide]

#### Sites/Resources Visited

1. **Official Documentation** (https://...)
   - What I found: [Summary]
   - What I couldn't access: [Login-gated sections]

2. **GitHub Examples** (https://github.com/...)
   - Relevant code: [File/line references]
   - Patterns observed: [Summarize]

3. **Community Resources** (https://...)
   - Stack Overflow: [Solutions found]
   - Discussions: [Community consensus]

### Relevant Code Reviewed

- `path/to/existing-file.ts:123-145` - [Why this is relevant]
- `components/ExistingComponent.tsx` - [How this relates]
- `docs/adr/002-previous-decision.md` - [Related architectural decision]

### Constraints & Requirements

- Technical: [Type safety, performance, bundle size, etc.]
- Business: [Timeline, budget, scope]
- User: [Accessibility, UX, compatibility]
- Team: [Skills, familiarity, maintainability]

---

## Options Considered

### Option 1: [Approach Name]

**Description**:
[Detailed explanation of this approach]

**Implementation**:

```typescript
// Brief code example or pseudocode
```

**Pros**:

- ✅ Benefit 1 with reasoning
- ✅ Benefit 2 with reasoning
- ✅ Benefit 3 with reasoning

**Cons**:

- ❌ Drawback 1 with impact
- ❌ Drawback 2 with impact
- ❌ Drawback 3 with impact

**Complexity**: `Low` | `Medium` | `High`
**Risk**: `Low` | `Medium` | `High`
**Effort**: `Small` (hours) | `Medium` (days) | `Large` (weeks)

**Aligns with**:

- ADR-XXX: [How it aligns or conflicts]
- Existing patterns: [Consistency with codebase]

---

### Option 2: [Alternative Approach]

**Description**:
[Detailed explanation of this approach]

**Implementation**:

```typescript
// Brief code example or pseudocode
```

**Pros**:

- ✅ Benefit 1
- ✅ Benefit 2

**Cons**:

- ❌ Drawback 1
- ❌ Drawback 2

**Complexity**: `Low` | `Medium` | `High`
**Risk**: `Low` | `Medium` | `High`
**Effort**: `Small` | `Medium` | `Large`

**Aligns with**:

- ADR-XXX: [How it aligns or conflicts]
- Existing patterns: [Consistency with codebase]

---

### Option 3: [Another Alternative]

[Same format as Options 1-2]

---

## Comparison Matrix

| Criteria          | Option 1 | Option 2 | Option 3 |
| ----------------- | -------- | -------- | -------- |
| Complexity        | Low      | Medium   | High     |
| Risk              | Low      | Medium   | Low      |
| Effort            | Small    | Medium   | Large    |
| Maintainability   | High     | Medium   | Low      |
| Performance       | Good     | Better   | Best     |
| Type Safety       | Full     | Partial  | Full     |
| Community Support | Large    | Medium   | Small    |

---

## Recommendation

**Preferred Option**: Option 1 - [Approach Name]

**Reasoning**:

1. **Primary reason**: [Most important factor]
2. **Secondary reason**: [Supporting factor]
3. **Risk mitigation**: [How we handle the downsides]

**Why not others**:

- **Option 2**: [Key reason to reject]
- **Option 3**: [Key reason to reject]

**Confidence Level**: `High` | `Medium` | `Low`

**If confidence is Low**: [What additional research would help?]

---

## Questions for Human

1. [Specific question about approach]
2. [Question about constraints or requirements]
3. [Question about trade-offs]
4. [Open-ended: "What am I missing?"]

---

## Impact Assessment

### If Approved

- **Immediate**: [What happens next]
- **Short-term** (days/weeks): [Near-term implications]
- **Long-term** (months): [Future considerations]

### If Rejected

- **Alternative path**: [What would we do instead]
- **Blockers**: [What else is blocked by this decision]
- **Workarounds**: [Temporary solutions available]

---

## Decision Required

Please choose one:

- [ ] **Approve recommended approach** (Option 1)
- [ ] **Choose different option** (specify: Option \_\_\_)
- [ ] **Request more research** (specify what to investigate)
- [ ] **Defer decision** (reason: \_\_\_)
- [ ] **Reject all options** (provide alternative direction)

---

## Human Response Section

**Status**: `PENDING` → Update to `APPROVED`, `NEEDS_REVISION`, or `REJECTED`

**Decision**:
[Your decision here - which option, or other direction]

**Feedback/Instructions**:
[Any clarifications, changes requested, or additional context]

**Rationale** (optional):
[Explain your reasoning - helps AI learn for future decisions]

**Next Steps**:
[What should happen after this decision]

**References** (optional):
[Any additional resources or documentation to consider]

---

## Metadata

**Created**: YYYY-MM-DD HH:MM
**Last Updated**: YYYY-MM-DD HH:MM
**Reviewed By**: [Your name]
**Resolution Date**: YYYY-MM-DD
**Time to Resolution**: X days

**Tags**: #[category] #[feature-area] #[priority]
