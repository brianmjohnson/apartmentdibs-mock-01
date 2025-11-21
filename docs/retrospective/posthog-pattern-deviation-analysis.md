# PostHog Pattern Deviation: Root Cause Analysis & Agent Improvements

**Date**: 2025-11-20
**Issue**: Implementation deviated from official PostHog documentation
**Severity**: High (functional but non-standard pattern)
**Status**: ✅ RESOLVED

---

## Executive Summary

The PostHog integration was implemented using a custom `instrumentation-client.ts` pattern instead of the official PostHog documentation pattern (` posthog.init()` in `useEffect` within `PostHogProvider`). This deviation occurred despite the user explicitly requesting to "follow their instructions here https://posthog.com/docs/libraries/next-js".

**Impact**:
- Functional code that works correctly
- Non-standard pattern that deviates from official docs
- Potential maintenance issues (future PostHog updates may assume standard pattern)
- Missing `defaults: '2025-05-24'` parameter from official docs

**Resolution**:
- ✅ Moved `posthog.init()` to `PostHogProvider` with `useEffect` (official pattern)
- ✅ Added `defaults: '2025-05-24'` parameter
- ✅ Removed `instrumentation-client.ts` file
- ✅ TypeScript validation passes

---

## What Went Wrong

### 1. Requirements Gathering Phase (Claude Creating Initial Prompt)

**Problem**: When creating [docs/hitl/posthog-integration-prompt.md](../hitl/posthog-integration-prompt.md), I specified:
> "Use Next.js 15.3+ `instrumentation-client.ts` approach (lightweight setup)"

**Root Cause**:
- Did NOT fetch the actual PostHog documentation from https://posthog.com/docs/libraries/next-js
- Made assumptions about "best practices" without verifying against source
- Invented a pattern (`instrumentation-client.ts`) that was not in the referenced documentation

**Why It Happened**:
- WebFetch tool returned CSS/fonts instead of actual documentation content
- Instead of retrying or using WebSearch, I made architectural assumptions
- Prioritized "modern patterns" over "following the official docs"

### 2. Architecture Decision Record (Architecture Agent)

**Problem**: ADR-013 approved the `instrumentation-client.ts` pattern without validating against the source documentation.

**Root Cause**:
- Architecture agent followed the flawed prompt requirements
- No cross-check against the original PostHog documentation URL
- Assumed the prompt requirements were already validated

**Why It Happened**:
- No validation step in architecture-agent.md that says "verify against source documentation"
- Agent trusted the prompt creator (me) too much
- No requirement to re-fetch or validate external documentation links

### 3. Technical Specification (Frontend Developer Agent)

**Problem**: Technical spec detailed the `instrumentation-client.ts` pattern, missing the official `useEffect` pattern entirely.

**Root Cause**:
- Frontend developer agent followed ADR-013 and the prompt
- No independent verification of PostHog documentation
- Spec was comprehensive but based on flawed requirements

**Why It Happened**:
- No step in frontend-developer.md to verify against official documentation
- Agent assumed ADR and prompt were correct
- No "research-first" validation step before spec creation

### 4. Quality Review (Quality Reviewer Agent)

**Problem**: QA agent verified the implementation against the spec/ADR but NOT against the original PostHog documentation URL.

**Root Cause**:
- QA checklist focused on "meets acceptance criteria from US-002"
- Did not include "matches source documentation URL from user requirement"
- Validated spec compliance, not source truth compliance

**Why It Happened**:
- quality-reviewer.md does not include "verify against original documentation links"
- QA agent assumes spec/ADR are ground truth
- No traceability requirement back to original source documentation

---

## Workflow Failure Points

```
User Request: "Follow https://posthog.com/docs/libraries/next-js"
        ↓
[❌ FAILURE POINT 1: Requirements Gathering]
Claude creates prompt WITHOUT fetching/verifying the URL
  → Invents "instrumentation-client.ts" pattern
        ↓
[❌ FAILURE POINT 2: Architecture Decision]
Architecture agent approves pattern WITHOUT re-checking docs
  → ADR-013 documents non-standard pattern
        ↓
[❌ FAILURE POINT 3: Technical Specification]
Frontend agent creates spec WITHOUT verifying official docs
  → Spec details wrong pattern
        ↓
[❌ FAILURE POINT 4: Implementation]
Frontend agent implements spec correctly (but spec is wrong)
  → Working code, wrong pattern
        ↓
[❌ FAILURE POINT 5: Quality Review]
QA agent validates against spec/ADR, NOT original docs
  → QA PASS (against wrong standard)
        ↓
User catches the deviation ✅
```

---

## Missing Guard Rails

### 1. No "Source Verification" Step

**Current State**: Agents trust the prompt/spec/ADR as ground truth

**Missing**:
- Requirement to fetch and verify external documentation URLs
- Validation that implementation matches source documentation
- Traceability from code back to original requirement source

### 2. No "Official Documentation First" Policy

**Current State**: Agents can invent "better" patterns

**Missing**:
- Policy: "If user provides official docs URL, match it exactly unless explicitly told otherwise"
- Validation: "Does our pattern appear in the official docs?"
- Red flag: "We're using a pattern not shown in the docs the user referenced"

### 3. No QA Verification Against Source Docs

**Current State**: QA validates against acceptance criteria only

**Missing**:
- QA step: "If user provided documentation URL, verify implementation matches it"
- Checklist item: "Pattern matches official documentation examples"
- Requirement: "All external doc URLs must be verified"

### 4. No "Research First" Gate

**Current State**: Prompts can be created without fetching referenced URLs

**Missing**:
- Gate: "Must successfully fetch and analyze all referenced URLs before proceeding"
- Validation: "WebFetch/WebSearch must return actual content, not CSS/fonts"
- Retry logic: "If fetch fails, try WebSearch or report to user"

---

## Agent Configuration Improvements

### 1. Update `.claude/agents/architecture-agent.md`

**Add to "Research Options" section**:

```markdown
#### Verify Source Documentation

**CRITICAL**: If the user provided a documentation URL in their request:

1. **Fetch the documentation**:
   ```
   Use WebFetch to retrieve the actual documentation
   If WebFetch fails (returns CSS/fonts), use WebSearch
   If both fail, create HITL file asking for clarification
   ```

2. **Validate against source**:
   - Does the pattern we're using appear in the official docs?
   - Are we adding complexity not shown in the docs?
   - Are we missing features shown in the docs?

3. **Document deviations**:
   - If deviating from official docs, explain WHY in ADR
   - Get explicit user approval for non-standard patterns
   - Mark as "NEEDS_REVIEW" if uncertain

**Red Flags**:
- ❌ "We'll use a better pattern" (without checking docs)
- ❌ "This is more modern" (without verifying it's in docs)
- ❌ "Best practices suggest..." (without source citation)

**Green Flags**:
- ✅ "Official docs show pattern X, we'll use that"
- ✅ "Docs recommend Y, here's why we're choosing Z" (with justification)
- ✅ "Source documentation verified at [URL]"
```

### 2. Update `.claude/agents/frontend-developer.md`

**Add to "Before Creating ANY Custom Hook" section**:

```markdown
### Before Implementing ANY Feature

**Step 0: Verify Source Documentation** (if provided by user)

1. **Check for documentation URLs** in:
   - User story
   - ADR
   - Original user request

2. **Fetch and verify**:
   ```bash
   # Use WebFetch to get actual docs
   WebFetch(url, "Extract implementation pattern and configuration options")

   # If fails, use WebSearch
   WebSearch("library-name next.js integration 2025")
   ```

3. **Match the pattern exactly** unless:
   - ADR explicitly approves deviation with justification
   - User explicitly requests custom approach
   - Official pattern is incompatible with our stack

4. **Document sources**:
   ```typescript
   /**
    * Implementation follows official docs:
    * @see https://posthog.com/docs/libraries/next-js
    * Pattern: useEffect initialization in provider component
    */
   ```
```

### 3. Update `.claude/agents/quality-reviewer.md`

**Add new section**:

```markdown
## Source Documentation Verification

**CRITICAL QA Step**: If the user provided documentation URLs, verify implementation matches source.

### Process

1. **Find Source URLs**:
   - Check user story for "References" or "Documentation" sections
   - Check ADR for "See also" or "Related" sections
   - Search for URLs in original user request

2. **Fetch and Compare**:
   ```bash
   # Get official docs
   WebFetch(documentation_url, "Extract implementation pattern and examples")

   # Compare with our implementation
   - Does our code structure match their examples?
   - Are we using parameters they recommend?
   - Are we missing features they show?
   ```

3. **Report Deviations**:
   ```markdown
   ### Source Documentation Compliance

   **Official Documentation**: https://example.com/docs
   **Pattern Used**: [Our pattern]
   **Pattern in Docs**: [Their pattern]

   **Compliance**: ✅ MATCH | ⚠️ MINOR DEVIATION | ❌ MAJOR DEVIATION

   **Deviations**:
   1. [Deviation 1] - Reason: [Why]
   2. [Deviation 2] - Reason: [Why]

   **Recommendation**: [Accept | Revise to match docs | Get user approval]
   ```

4. **Severity Levels**:
   - **CRITICAL**: Pattern doesn't work / Missing required features
   - **HIGH**: Non-standard pattern without justification
   - **MEDIUM**: Minor deviations with valid reasons
   - **LOW**: Implementation details not affecting functionality

### QA Checklist Addition

**Before signing off**:
- [ ] If user provided doc URLs, implementation matches them
- [ ] If deviating from docs, deviation is justified in ADR
- [ ] All external URLs referenced are verified
- [ ] Pattern appears in official documentation
```

### 4. Create New Validation Agent

**File**: `.claude/agents/documentation-validator.md`

```markdown
# Documentation Validator Agent

**Role**: Verify implementations match official source documentation
**Expertise**: Documentation analysis, pattern matching, compliance verification
**When to Use**: After implementation, before QA, when user provides doc URLs

## Mission

Ensure that implementations strictly follow official documentation when user provides source URLs. Catch deviations early before they propagate through the workflow.

## Process

### 1. Extract Documentation URLs

Search these locations:
- Original user request
- User story "References" section
- ADR "See also" section
- Technical spec "Documentation" section

### 2. Fetch and Analyze

For each URL:
```bash
# Primary: WebFetch
WebFetch(url, "Extract code examples, configuration patterns, setup steps")

# Fallback: WebSearch
WebSearch("[library] [framework] official documentation 2025")
```

### 3. Pattern Matching

Compare:
- **File structure**: Do our files match their examples?
- **Initialization**: Do we initialize the same way?
- **Configuration**: Are we using recommended parameters?
- **Integration**: Do we integrate with framework correctly?

### 4. Generate Report

```markdown
# Documentation Compliance Report

## Sources Verified
- [URL 1]: ✅ Fetched | ❌ Failed
- [URL 2]: ✅ Fetched | ❌ Failed

## Pattern Comparison

### Official Pattern (from docs)
\`\`\`typescript
[Their code example]
\`\`\`

### Our Implementation
\`\`\`typescript
[Our code]
\`\`\`

### Compliance: ✅ | ⚠️ | ❌

### Deviations
1. **[Deviation]**
   - Severity: CRITICAL | HIGH | MEDIUM | LOW
   - Justification: [Found in ADR | Not justified]
   - Recommendation: [Fix | Justify | Get approval]

## Overall Status
- ✅ COMPLIANT: Matches official docs
- ⚠️ MINOR DEVIATIONS: Justified or low-impact
- ❌ NON-COMPLIANT: Major deviations without justification

## Next Steps
[Recommendations]
```

### 5. Decision Points

**If COMPLIANT**: ✅ Approve, continue workflow

**If MINOR DEVIATIONS**:
- Check if justified in ADR
- If yes: Approve with note
- If no: Request justification

**If NON-COMPLIANT**:
- Create HITL file
- Pause workflow
- Request user decision: Fix or approve deviation
```

---

## Recommended Workflow Changes

### Updated HITL Workflow with Documentation Validation

```
Phase 1: Documentation & Planning
  1.1: Update README
  1.2: Product Manager → Create User Story
  1.3: ✨ NEW: Documentation Validator → Verify source URLs
       ↓ If non-compliant → HITL review
  1.4: Architecture Agent → Create ADR (with source verification)
       HITL Gate #1: Review ADR
  1.5: Frontend Developer → Create Tech Spec (verified against docs)
       ✨ NEW: Documentation Validator → Verify spec matches sources
       ↓ If non-compliant → HITL review
       HITL Gate #2: Review Technical Spec

Phase 2: Implementation
  2.1-2.5: Implementation (following verified spec)
  2.6: ✨ NEW: Documentation Validator → Verify implementation
       ↓ If non-compliant → Fix or HITL review

Phase 3: Quality Review
  3.1: Quality Reviewer → QA (includes source doc verification)
       HITL Gate #3: Review QA Report
```

### New Guard Rails

1. **Documentation URLs Must Be Verified**:
   - If user provides URL → Must fetch and validate
   - If fetch fails → Must use WebSearch
   - If both fail → Must create HITL request

2. **Deviations Must Be Justified**:
   - If pattern differs from docs → Must explain in ADR
   - If justification weak → Must get user approval
   - If unjustified → Block workflow

3. **QA Must Include Source Verification**:
   - QA checklist must include "Matches source documentation"
   - QA must fetch and compare against source URLs
   - QA must report compliance level

---

## Specific Fixes for This Issue

### ✅ Immediate Fixes (Completed)

1. ✅ Moved `posthog.init()` to `PostHogProvider` with `useEffect`
2. ✅ Added `defaults: '2025-05-24'` parameter (from official docs)
3. ✅ Removed `instrumentation-client.ts` (not in official docs)
4. ✅ TypeScript validation passes
5. ✅ Pattern now matches https://posthog.com/docs/libraries/next-js

### 📋 Documentation Updates Needed

1. Update ADR-013 to document the pattern change
2. Update technical spec to reflect official pattern
3. Update QA report to note the fix
4. Create this retrospective document

### 🔄 Process Improvements Needed

1. Implement Documentation Validator agent
2. Update architecture-agent.md with source verification steps
3. Update frontend-developer.md with "verify docs first" requirement
4. Update quality-reviewer.md with source URL verification checklist
5. Add documentation validation to HITL workflow diagram

---

## Lessons Learned

### What Worked Well

1. ✅ User caught the deviation (shows good code review)
2. ✅ Fix was straightforward (modular code design)
3. ✅ No functional issues (both patterns work)
4. ✅ TypeScript prevented errors during refactoring

### What Didn't Work

1. ❌ Multiple agents failed to validate against source documentation
2. ❌ WebFetch failure was not retried with WebSearch
3. ❌ No traceability from implementation back to source docs
4. ❌ QA validated against wrong standard (spec instead of source)
5. ❌ "Better practices" assumption overrode "follow the docs" requirement

### Key Takeaways

1. **Trust but Verify**: Even if a pattern seems "better", follow official docs unless explicitly told otherwise
2. **Source is Truth**: Specs and ADRs are derived from source docs, not the other way around
3. **Fetch → Verify → Implement**: Never skip the verification step
4. **QA Must Validate Source**: QA checklist must include source documentation verification
5. **Document Deviations**: If deviating from official docs, explicitly justify and get approval

---

## Prevention Checklist

Going forward, for any integration task:

- [ ] User provided documentation URL?
  - [ ] YES → WebFetch successful?
    - [ ] NO → WebSearch successful?
      - [ ] NO → Create HITL request
  - [ ] NO → Proceed with research

- [ ] Implementation pattern matches source docs?
  - [ ] YES → Continue
  - [ ] NO → Justified in ADR?
    - [ ] YES → Document deviation clearly
    - [ ] NO → HITL review required

- [ ] QA includes source verification?
  - [ ] Compare implementation to source docs
  - [ ] Report compliance level
  - [ ] Flag unjustified deviations

- [ ] All deviations documented and approved?
  - [ ] YES → Deploy
  - [ ] NO → Fix or get approval

---

## Metrics

**Time to Detect**: 1 session (user caught immediately)
**Time to Fix**: ~5 minutes (simple refactor)
**Impact**: Low (both patterns functional)
**Learning Value**: High (systemic process improvement)

**Prevention Cost**: Low (agent configuration updates)
**Prevention Benefit**: High (avoid future deviations)
**ROI**: Very High

---

## Action Items

**Immediate** (This Session):
- [x] Fix PostHogProvider pattern
- [x] Remove instrumentation-client.ts
- [x] Verify TypeScript passes
- [x] Create this retrospective

**Next Session**:
- [ ] Create documentation-validator agent
- [ ] Update architecture-agent.md
- [ ] Update frontend-developer.md
- [ ] Update quality-reviewer.md
- [ ] Update WORKFLOW_GUIDE.md with new validation steps

**Future**:
- [ ] Add automated source URL verification to all integration tasks
- [ ] Create "documentation compliance" badge for implementations
- [ ] Add documentation validation to CI/CD pipeline

---

## Conclusion

This deviation was caught quickly and fixed easily, but it revealed a **systemic gap** in our agent workflow: **lack of source documentation verification**.

The fix is straightforward: Add documentation validation steps to our agents and HITL workflow. This will prevent similar deviations in future integrations.

**Status**: ✅ Issue resolved, process improvements documented, ready to implement prevention measures.
