# ADR-012: Automated Dependency Update Workflow

**Status:** DRAFT
**Date:** 2025-11-17
**Author:** System Architecture <system@example.com>

---

## Context

**What is the issue or problem we're solving?**

Projects receive regular Dependabot security alerts and dependency update notifications. Managing these updates requires balancing security responsiveness with risk management and thorough testing.

**The Problem**:

**Security Responsiveness**:
- Critical vulnerabilities require fast patching
- Multiple security alerts with varying severities
- Mix of direct and transitive dependencies

**Risk Management**:
- Updates can introduce breaking changes
- Regressions can break functionality
- Debugging multiple simultaneous updates is difficult

**Testing Rigor**:
- Not all updates are thoroughly tested
- Manual testing is inconsistent
- Regression detection is ad-hoc

**Feature Evaluation**:
- New capabilities in updates often ignored
- Missed opportunities for improvements
- No systematic feature adoption process

**Documentation**:
- Update decisions not recorded
- No audit trail for changes
- Difficult to reproduce process

**Example Scenario**:

```
Current state:
- 5 open security alerts (severities: High to Low)
- 12 outdated non-security dependencies
- Multiple breaking changes across updates
- New features available in several packages
- No systematic workflow to process them
```

**Without a structured workflow, updates are**:
- **Rushed**: Security fixes applied without proper testing
- **Delayed**: Low-priority updates accumulate tech debt
- **Incomplete**: Breaking changes not fully addressed
- **Undocumented**: No record of why decisions were made

**Background**:
- Dependabot creates PRs for updates automatically
- Security alerts require timely response
- Breaking changes need research and planning
- New features need evaluation for adoption

**Requirements**:
- Fast response to security alerts (< 48 hours for High/Critical)
- Systematic testing before and after updates
- Clear documentation of changes and decisions
- Feature evaluation and adoption process
- Low regression rate (target: 0)

---

## Decision

**Implement a comprehensive, automated dependency update workflow with specialized slash commands and structured phases**

This establishes a multi-phase process for handling both security and non-security dependency updates with appropriate rigor and documentation.

### 1. Specialized Slash Commands

**`.claude/commands/update-security-deps.md`**:
- Handles Dependabot security alerts
- Prioritizes by severity (Critical → High → Medium → Low)
- Enforces testing before and after updates
- Creates GitHub issues for tracking
- Updates ONE dependency at a time (except patches)

**`.claude/commands/update-deps.md`**:
- Handles non-security dependency updates
- Categorizes by type (Major, Minor, Patch)
- Evaluates new features for adoption
- Creates sub-issues for breaking changes
- Allows batching low-risk patch updates

---

### 2. Structured Workflow Phases

**Phase 1: Discovery & Prioritization**

```bash
# Fetch security alerts
gh api repos/OWNER/REPO/dependabot/alerts

# Check for general updates
pnpm outdated

# Categorize by risk:
# - Critical/High security: Immediate
# - Medium/Low security: This sprint
# - Major versions: Research required
# - Minor/Patch: Low risk, batch possible
```

**Phase 2: Research**

```typescript
// For each update:
1. Read release notes between versions
2. Identify breaking changes
3. Document new features
4. Assess migration effort
5. Recommend approach
```

**Phase 3: Test Planning**

```typescript
1. Identify existing test coverage for affected code
2. Determine if new tests needed
3. Choose automated vs. manual testing strategy
4. Write tests BEFORE updating (if needed)
```

**Phase 4: GitHub Issue Creation**

```typescript
1. Create parent tracking issue
2. Create sub-issues for breaking changes
3. Create sub-issues for feature evaluation
4. Label appropriately (security, dependencies, breaking-change)
5. Assign to maintainer
```

**Phase 5: Update Execution**

```bash
# Establish baseline
pnpm test && pnpm build
# All tests must pass before proceeding

# Update single dependency
pnpm add {package}@{version}

# Fix breaking changes (if any)

# Run post-update tests
pnpm test && pnpm build
# Same tests must pass after update

# Manual testing (if required)
```

**Phase 6: Commit & Document**

```bash
git commit -m "{type}: update {package} from {old} to {new}

{Detailed description}

Testing:
- {test-count} automated tests passing
- Build successful
- {Manual testing details if applicable}

Fixes #{issue-number}"
```

**Phase 7: Pull Request**

```bash
# Push branch
git push origin update/{package}-{version}

# Create PR with comprehensive description
gh pr create --title "..." --body "..."

# Link to tracking issues
```

**Phase 8: Monitor Deployment**

```bash
# Watch deployment
vercel ls --prod

# Check for runtime errors
# Verify in production
```

---

### 3. Key Principles

**One Dependency at a Time** (Exception: Patches):

✅ **Why**:
- Isolates risk (know exactly which dependency caused issue)
- Simplifies debugging (single variable changed)
- Clear audit trail (one commit per dependency)
- Easy to revert (git revert single commit)

❌ **Exception**: Low-risk patch updates (x.x.X) MAY be batched if:
- No known breaking changes
- No code changes required
- All tests pass

**Test Before and After**:

```bash
# Before update (establish baseline)
pnpm test          # All tests must pass
pnpm lint          # No linting errors
pnpm build         # Build must succeed

# Update dependency
pnpm add {package}@{version}

# After update (verify no regressions)
pnpm test          # Same tests must still pass
pnpm lint          # No new linting errors
pnpm build         # Build must still succeed
```

**Document Everything**:

- 📝 GitHub issues for tracking
- 📝 Sub-issues for research questions
- 📝 Commit messages with details
- 📝 PR descriptions with context
- 📝 Test results in issues

**Evaluate Features**:

- Don't just update, **improve**
- Analyze new features for value
- Create sub-issues for evaluation
- Document adoption decisions
- Consider if new patterns should be adopted

**Manage Risk**:

- Prioritize by severity (Critical → High → Medium → Low)
- Research breaking changes thoroughly
- Plan migration steps
- Have rollback plan (git revert)

---

### 4. Testing Requirements

**Automated Testing** (Preferred):

```bash
# Baseline (before update)
pnpm test                  # Jest unit tests
pnpm exec playwright test  # E2E tests
pnpm lint                  # ESLint + Prettier
pnpm tsc --noEmit          # TypeScript compilation
pnpm build                 # Production build

# Update dependency
pnpm add {package}@{version}

# Verification (after update - same tests)
pnpm test                  # Same tests must pass
pnpm exec playwright test  # Same E2E tests must pass
pnpm lint                  # No new lint errors
pnpm tsc --noEmit          # No new type errors
pnpm build                 # Build must succeed
```

**Manual Testing** (When Required):

```markdown
Manual Test Checklist:
- [ ] Test scenario 1 (e.g., authentication flow)
- [ ] Test scenario 2 (e.g., checkout process)
- [ ] Test scenario 3 (e.g., form submission)
- [ ] Capture screenshots of UI changes
- [ ] Record results in GitHub issue
- [ ] Verify no visual regressions
```

**New Tests** (If Needed):

```typescript
// When to write new tests:
// 1. Current behavior has no test coverage
// 2. Update adds new functionality to test
// 3. Breaking change requires different assertions

// Example: Testing current behavior before update
describe("Current behavior (before update)", () => {
  it("should behave as documented", () => {
    // Test current behavior to establish baseline
  })
})
```

---

### 5. GitHub Issue Structure

**Parent Issue Template**:

```markdown
## Security Alert / Dependency Update

**Package**: `{package-name}`
**Current Version**: `{current}`
**Target Version**: `{target}`
**Severity**: {Critical|High|Medium|Low} (if security)
**CVE**: {CVE-ID} (if security)

## Release Notes Summary

{Key changes from release notes}

## Breaking Changes

- [ ] Breaking change 1 (#sub-issue-1)
- [ ] Breaking change 2 (#sub-issue-2)

## New Features to Evaluate

- [ ] Feature 1 (#sub-issue-3)
- [ ] Feature 2 (#sub-issue-4)

## Testing Strategy

- [x] Automated tests (unit + E2E)
- [ ] Manual testing required
- [ ] New tests needed

## Sub-Issues

- #sub-issue-1: Breaking Change - {description}
- #sub-issue-2: Breaking Change - {description}
- #sub-issue-3: Feature Evaluation - {description}

## Implementation Plan

1. Research breaking changes
2. Write migration plan
3. Update dependency
4. Fix breaking changes
5. Run full test suite
6. Deploy to preview
7. Manual testing
8. Merge to main
```

**Breaking Change Sub-Issue**:

```markdown
## Breaking Change

**Package**: `{package}`
**Change**: {Description of what changed}

## Impact Assessment

{How this affects our codebase}

## Migration Options

1. **Option A**: {Description}
   - Pros: ...
   - Cons: ...

2. **Option B**: {Description}
   - Pros: ...
   - Cons: ...

## Recommendation

{Option X} because {rationale}

## Implementation Plan

- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## Testing Requirements

- [ ] Update unit tests
- [ ] Update E2E tests
- [ ] Manual testing
```

**Feature Evaluation Sub-Issue**:

```markdown
## Feature Evaluation

**Package**: `{package}`
**Feature**: {Feature name}

## Description

{What the new feature does}

## Current Approach

{How we currently solve this problem}

## New Approach (with feature)

{How we would solve it with the new feature}

## Cost-Benefit Analysis

**Benefits**:
- Benefit 1
- Benefit 2

**Costs**:
- Cost 1 (migration effort, learning curve, etc.)
- Cost 2

## Decision

- [ ] **Adopt** - Implement in this update
- [ ] **Defer** - Evaluate in future sprint
- [ ] **Skip** - Not valuable for our use case

**Rationale**: {Why we made this decision}

## Implementation Plan (if Adopt)

- [ ] Step 1
- [ ] Step 2
- [ ] Step 3
```

---

### 6. Commit Message Format

**Security Update**:

```
security: update {package} from {old} to {new}

Addresses CVE-{id} (Severity: {severity})
{Vulnerability summary}

Changes:
- Update {package} to {version}
- {Code change 1} (if any)
- {Code change 2} (if any)

Testing:
- Automated testing completed
- {test-count} tests passing
- Build successful
- {Manual testing summary} (if applicable)

Fixes #{issue-number}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Non-Security Update**:

```
chore: update {package} from {old} to {new}

{One-line summary of why we're updating}

Changes:
- Update {package} to {version}
- {Code change 1} (if any)
- {Code change 2} (if any)

New Features Adopted:
- {Feature 1} (#{sub-issue})
- {Feature 2} (#{sub-issue})

Testing:
- Automated testing completed
- {test-count} tests passing
- Build successful

Fixes #{issue-number}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### 7. Exception: Batch Patch Updates

Low-risk patch updates (x.x.X) MAY be batched if:
- ✅ No known breaking changes
- ✅ No code changes required
- ✅ All tests pass
- ✅ Build succeeds

```bash
# Batch multiple patch updates
pnpm add pkg1@latest pkg2@latest pkg3@latest

# Verify all tests still pass
pnpm test && pnpm exec playwright test && pnpm build

# Commit with details
git commit -m "chore: update patch-level dependencies

Updates:
- pkg1: 1.2.3 → 1.2.4
- pkg2: 2.5.1 → 2.5.2
- pkg3: 3.1.0 → 3.1.1

All patch-level updates, no breaking changes.
Tests passing, build successful.

Fixes #{issue1}, #{issue2}, #{issue3}"
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences (Easier)

**Security Benefits**:
- ✅ Faster response to security alerts (target: < 48 hours for High/Critical)
- ✅ Systematic vulnerability patching
- ✅ Clear prioritization by severity
- ✅ Reduced attack surface

**Quality Benefits**:
- ✅ Fewer regressions (testing before/after)
- ✅ Clear rollback path (one dependency at a time)
- ✅ Better test coverage (new tests for updates)
- ✅ Documented decisions (GitHub issues)

**Development Benefits**:
- ✅ Structured workflow reduces cognitive load
- ✅ Automated slash commands speed execution
- ✅ Feature evaluation prevents missed opportunities
- ✅ Breaking change analysis prevents surprises

**Maintenance Benefits**:
- ✅ Up-to-date dependencies
- ✅ Reduced tech debt
- ✅ Clear update history
- ✅ Reproducible process

### Negative Consequences (More Difficult)

**Additional Overhead**:
- ⚠️ More time per update (research, testing, documentation)
- ⚠️ More GitHub issues created
- ⚠️ More commits (one per dependency)

**Process Complexity**:
- ⚠️ Multi-phase workflow to learn
- ⚠️ Slash command usage requires training
- ⚠️ More decisions to make (feature adoption)

**Mitigations**:
- Automate common tasks via slash commands
- Template GitHub issues for consistency
- Batch low-risk patches to reduce overhead
- Document workflow clearly (ADR + workflow guide)

---

## Alternatives Considered

### Alternative 1: Automated Dependency Updates (Dependabot Auto-Merge)

**Description**: Enable Dependabot auto-merge for low-risk updates

**Pros**:
- Minimal manual effort
- Fast updates

**Cons**:
- No research or feature evaluation
- Risk of breaking changes slipping through
- No human decision on feature adoption
- Poor documentation of changes

**Why Not Chosen**: Need deliberate feature evaluation and thorough testing. Auto-merge suitable only for projects with extensive automated test coverage.

---

### Alternative 2: Batch All Updates Together

**Description**: Update all dependencies at once in a single commit

**Pros**:
- Fewer commits
- Faster to execute

**Cons**:
- High risk of breakage
- Difficult to debug which dependency caused issue
- Hard to revert specific updates
- Lost opportunity to evaluate features individually

**Why Not Chosen**: Risk too high, debugging too difficult. One-at-a-time approach provides isolation and clarity.

---

### Alternative 3: Manual Ad-Hoc Updates

**Description**: Continue manual process without structure

**Pros**:
- No process overhead
- Maximum flexibility

**Cons**:
- Inconsistent approach
- Missed security alerts
- No documentation
- Poor feature evaluation

**Why Not Chosen**: Current ad-hoc approach is insufficient for security and quality needs. Structured process provides consistency.

---

### Alternative 4: Update Only When Absolutely Necessary

**Description**: Only update when forced (major security issue, broken functionality)

**Pros**:
- Minimal effort

**Cons**:
- Accumulates tech debt
- Larger, riskier updates when forced
- Miss out on improvements
- Security vulnerabilities persist longer

**Why Not Chosen**: Proactive updates are safer than reactive. Small, incremental updates are less risky than large, forced updates.

---

## Related

**Related ADRs**:
- [ADR-009: PR Review Automation](./ADR-009-pr-review-automation-with-github-cli.md) - GitHub CLI integration
- [ADR-010: Branch-Based AI Autonomy](./ADR-010-branch-based-ai-autonomy.md) - Workflow for branches

**Related Documentation**:
- `.claude/commands/update-security-deps.md` - Slash command (to be created)
- `.claude/commands/update-deps.md` - Slash command (to be created)
- `docs/dependency-update-workflow.md` - Workflow guide (to be created)

**External References**:
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Semantic Versioning](https://semver.org/)

---

## Notes

### Implementation Checklist

**Phase 1: Documentation and Commands**:
- [ ] Create `.claude/commands/update-security-deps.md`
- [ ] Create `.claude/commands/update-deps.md`
- [ ] Create `docs/dependency-update-workflow.md` (detailed guide)
- [ ] Document this ADR (completed)

**Phase 2: Initial Testing**:
- [ ] Test workflow with current security alerts
- [ ] Process 1-2 security updates following workflow
- [ ] Document lessons learned
- [ ] Refine workflow based on experience

**Phase 3: Full Rollout**:
- [ ] Update all remaining security alerts
- [ ] Process non-security dependency updates
- [ ] Train team on slash commands
- [ ] Establish update cadence (e.g., monthly dependency reviews)

**Phase 4: Metrics and Monitoring**:
- [ ] Track time-to-patch for security alerts
- [ ] Monitor regression rate
- [ ] Measure feature adoption rate
- [ ] Review and refine workflow quarterly

---

### Metrics for Success

**Security**:
- Time from alert to merge: < 48 hours for High/Critical
- Open security alerts: < 5 at any time
- Security patch adoption: 100%

**Quality**:
- Regressions from dependency updates: 0
- Test coverage for updated dependencies: 100%
- Successful deployments after updates: 100%

**Maintenance**:
- Average dependency age: < 6 months
- Features evaluated: 100% of relevant features
- Feature adoption rate: > 30% of evaluated features

---

### Workflow Examples

**Security Update: High Severity**

```bash
# 1. Use slash command
/update-security-deps

# 2. Command fetches alerts, prioritizes by severity
# 3. Research release notes
# 4. Create GitHub issue #100
# 5. Identify existing tests
# 6. Run baseline tests (all must pass)
# 7. Update: pnpm add package@version
# 8. Run post-update tests (all must still pass)
# 9. Commit: "security: update package X.X.X to Y.Y.Y"
# 10. Update issue #100 with results
# 11. Create PR
# 12. Monitor deployment
```

**Feature Adoption: Major Version Update**

```bash
# 1. Use slash command
/update-deps

# 2. Research major version updates
# 3. Find new feature: improved API
# 4. Create parent issue #101
# 5. Create sub-issue #102: "Should we adopt new API?"
# 6. Analyze current approach
# 7. Analyze new approach (benefits/costs)
# 8. Recommend: Adopt (significant performance gain)
# 9. Implement migration plan
# 10. Document in ADR if significant pattern change
```

---

### Review Schedule

This ADR should be reviewed:
- After first 5 dependency updates (validate workflow)
- Quarterly (refine based on experience)
- When significant pain points emerge
- When new tools or practices become available

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-17 | System Architecture | Initial draft |
