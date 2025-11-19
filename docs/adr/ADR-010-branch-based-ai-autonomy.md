# ADR-010: Branch-Based AI Autonomy Levels

**Status:** DRAFT
**Date:** 2025-11-17
**Author:** System Architecture <system@example.com>

---

## Context

**What is the issue or problem we're solving?**

AI-assisted development workflows must balance productivity with production safety. The challenge: **How to enable rapid AI-assisted iteration while preventing production incidents?**

**The Problem**:

**On Feature Branches**:

- Rapid iteration needed for complex features
- AI assistance accelerates development significantly
- TypeScript/lint errors caught and fixed quickly
- Preview deployments enable testing before merge
- Mistakes can be fixed with additional commits (fix-forward approach)

**On Main Branch**:

- Production deployments trigger automatically
- Errors impact live users immediately
- Reverting commits is disruptive
- Every change needs thorough validation
- Human review is critical before commits

**Without clear guidelines, teams either**:

1. **Over-restrict branches** → Slow development velocity, approval fatigue
2. **Under-restrict main** → Production incidents, broken builds

**Background**:

- Complex feature development often requires 20+ commits with iterative fixes
- AI agents can self-correct errors when given autonomy to commit-and-validate
- Main branch deploys to production automatically (Vercel, Netlify, etc.)
- Preview deployments provide safe testing environment for feature branches
- Full production builds can take 5+ minutes, blocking rapid iteration

**Requirements**:

- Enable high AI autonomy on safe branches (feature branches)
- Require human validation on critical branches (main, production)
- Clear workflow boundaries AI agents can detect and follow
- Maintain production safety without sacrificing development velocity

---

## Decision

**Implement a two-tier SDLC workflow with different AI autonomy levels based on branch criticality**

This establishes different workflows for feature branches (high AI autonomy) versus main branch (human-validated safety).

### Feature Branch Workflow: AI-Assisted Autonomy

**Philosophy**: Move fast, catch errors with automation, fix mistakes with additional commits

**Workflow**:

```bash
# 1. Create feature branch
git checkout -b feature/new-capability

# 2. AI makes changes with high autonomy
# - Multiple tool calls in parallel
# - Automated validation after each change
# - Self-correction when errors detected

# 3. Validation after each change (FAST: ~30 seconds)
pnpm lint && tsc --noEmit && pnpm test

# 4. Commit frequently (no full build required)
git add "components/MyComponent.tsx" && git commit -m "fix: component logic"
git push origin feature/new-capability

# 5. Monitor preview deployment
vercel ls  # or check deployment dashboard

# 6. Fix issues with additional commits
# (no need for perfection on first try - fix-forward approach)
```

**AI Autonomy Level**: **HIGH**

Permissions granted:

- ✅ Run multiple commands without approval (lint, typecheck, test)
- ✅ Make architectural decisions independently
- ✅ Create commits after validation passes
- ✅ Push to remote immediately after commit
- ✅ Fix-forward instead of amending commits
- ✅ Parallel tool execution for speed

**Validation Gates**:

```typescript
// Quick validation (~30 seconds)
await runLint() // Formatting, code quality
await runTypeCheck() // TypeScript compilation (no emit)
await runUnitTests() // Jest unit tests only
await monitorPreview() // Verify preview deployment succeeds
```

**Human-in-the-Loop (HITL)**:

- ⏸️ Review PR before merging to main
- ⏸️ Test preview deployment manually
- ⏸️ Approve final merge decision

**Workflow Example**:

```
[AI Agent on feature/auth-refactor]

🤖 Making changes to authentication flow...
  ✓ Modified lib/auth/helpers.ts
  ✓ Modified lib/auth/guards.ts

🤖 Validating changes...
  ✓ Lint passed
  ✓ TypeScript compilation passed
  ✓ Unit tests passed (42 tests)

🤖 Committing changes...
  ✓ Created commit: "refactor: simplify auth guard logic"

🤖 Pushing to remote...
  ✓ Pushed to feature/auth-refactor

🤖 Monitoring preview deployment...
  ✓ Preview deployed: https://my-app-feat-auth.vercel.app
```

---

### Main Branch Workflow: Human-Validated Safety

**Philosophy**: Every change must be perfect before commit, zero tolerance for build failures

**Workflow**:

```bash
# On main branch (after PR merge or hotfix work)

# 1. Run FULL validation suite (SLOW: 5+ minutes)
pnpm vercel-build  # Includes lint, typecheck, build, tests
# This takes time - set expectations with user

# 2. Review ALL changes
git status
git diff

# 3. Human reviews and approves BEFORE commit
# AI presents changes, waits for explicit approval

# 4. Commit only after human approval
git add "file1" "file2"
git commit -m "feat: new capability"

# 5. STOP - prompt human for push approval
# AI asks: "Ready to push to main? This will deploy to production."

# 6. Push only after explicit approval
git push origin main

# 7. Monitor production deployment
vercel ls --prod
# Watch for deployment errors or rollback
```

**AI Autonomy Level**: **LOW**

Approval required:

- 🛑 Approval before commits
- 🛑 Approval before pushes
- 🛑 Present changes for human review
- 🛑 Wait for explicit confirmation at each gate
- 🛑 Sequential operations (no parallel execution)

**Validation Gates**:

```typescript
// Full validation (~5 minutes)
await runLint()
await runTypeCheck()
await runProductionBuild() // Full Next.js build
await runAllTests() // Unit + integration + E2E
await requireApproval('Review changes before commit?')
await gitCommit()
await requireApproval('Ready to push to main? This deploys to production.')
await gitPush()
await monitorProductionDeploy()
```

**Human-in-the-Loop (HITL)**:

- ⏸️ Review every file change
- ⏸️ Approve commit message
- ⏸️ Approve push to main
- ⏸️ Monitor production deployment
- ⏸️ Verify production functionality

**Workflow Example**:

```
[AI Agent on main]

⚠️  WARNING: You are on the MAIN branch.
⚠️  This requires careful human validation at each step.

🤖 Running full production build...
  ⏳ This may take 5+ minutes...
  ✓ Lint passed
  ✓ TypeScript compilation passed
  ✓ Production build succeeded
  ✓ All tests passed (127 tests)

🤖 Changes ready for commit:
  Modified: lib/auth/helpers.ts (+15, -8)
  Modified: components/auth/LoginForm.tsx (+3, -1)

⏸️  Human approval required before commit.
   Ready to commit these changes? [y/N]

[User approves]

🤖 Committed: "fix: resolve OAuth callback error"

⏸️  Human approval required before push.
   Ready to push to MAIN? This will deploy to production. [y/N]

[User approves]

🤖 Pushing to main...
  ✓ Pushed to main
  🚀 Production deployment starting...
  ✓ Deployment succeeded: https://my-app.com
```

---

### Comparison Matrix

| Aspect                  | Feature Branch              | Main Branch                   |
| ----------------------- | --------------------------- | ----------------------------- |
| **AI Autonomy**         | High                        | Low                           |
| **Commit Frequency**    | High (fix-forward)          | Low (get it right first time) |
| **Validation**          | Quick (lint + typecheck)    | Full (production build)       |
| **Validation Time**     | ~30 seconds                 | ~5 minutes                    |
| **HITL Gates**          | PR review only              | Every commit + push           |
| **Error Tolerance**     | High (fix with next commit) | Zero (no broken builds)       |
| **Deployment**          | Preview (safe to fail)      | Production (must succeed)     |
| **Approval Required**   | Pre-approved tools          | Explicit approval             |
| **Parallel Operations** | Yes (speedy)                | Sequential (careful)          |
| **Push Timing**         | Immediately after commit    | After human approval          |
| **Self-Correction**     | Encouraged (fix-forward)    | Discouraged (get it right)    |

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences (Easier)

✅ **Fast Feature Development**: AI can iterate rapidly on branches without approval overhead

- Example: 20+ commits in 1 day on complex refactoring

✅ **Production Safety**: Main branch protected by human review gates

- Zero broken builds deployed to production

✅ **Clear Boundaries**: Team knows when to allow AI autonomy vs require human review

- Branch name indicates workflow ("feature/" = high autonomy, "main" = human-validated)

✅ **Efficient Debugging**: Fix-forward on branches instead of amending commits

- Git history shows progression of fixes, easier to debug

✅ **Preview Testing**: Test changes thoroughly before merging to main

- Catch issues in preview environment, not production

✅ **Parallel Execution**: Feature branches enable parallel tool calls

- Faster validation and iteration

### Negative Consequences (More Difficult)

⚠️ **Mental Context Switching**: Developers must remember which branch they're on

- _Mitigation_: AI agent announces branch context at start of session
- _Mitigation_: Shell prompt shows current branch with color coding

⚠️ **Slower Main Branch Work**: Production validation is deliberately slow and careful

- _Mitigation_: Encourage all work on feature branches, merge via PR
- _Mitigation_: Set expectations: "Full build takes 5 minutes on main"

⚠️ **AI Confusion**: AI must understand branch context to apply correct workflow

- _Mitigation_: Implement branch detection logic in AI agent instructions
- _Mitigation_: Document workflow rules clearly in CLAUDE.md

### Neutral Consequences

- **Git History**: Feature branches have more commits (fix-forward), main has squashed commits
- **Deployment Frequency**: More preview deployments, fewer production deployments
- **Approval Interruptions**: None on features, frequent on main

---

## Alternatives Considered

### Alternative 1: Same Workflow for All Branches

**Description**: Use identical workflow (approval gates, validation) for all branches

**Pros**:

- Simple to understand and implement
- Consistent behavior regardless of branch

**Cons**:

- Too restrictive on feature branches → slow development velocity
- Not safe enough on main → production incidents
- Doesn't leverage AI's ability to self-correct on branches
- Approval fatigue for non-critical work

**Why Not Chosen**: Sacrifices either productivity (if strict everywhere) or safety (if lenient everywhere). No way to balance both.

---

### Alternative 2: Fully Automated Main Branch

**Description**: Allow high AI autonomy on all branches including main

**Pros**:

- Maximum productivity
- No approval interruptions
- Fast iteration everywhere

**Cons**:

- Too risky for production deployments
- No human validation of critical changes
- Single bad commit can break production
- Difficult to rollback production issues

**Why Not Chosen**: Unacceptable production risk. Main branch deploys to live users, requires human oversight.

---

### Alternative 3: Fully Manual Feature Branches

**Description**: Require human approval for all commits on all branches

**Pros**:

- Maximum safety everywhere
- Human review catches all issues
- Consistent workflow

**Cons**:

- Loses AI productivity benefits
- Slow iteration on complex migrations
- Approval fatigue (30+ approvals per feature)
- Developer frustration

**Why Not Chosen**: Defeats purpose of AI-assisted development. Feature branches are safe environment for experimentation.

---

### Alternative 4: Separate Development and Production Repositories

**Description**: Maintain separate repos for dev and production code

**Pros**:

- Clear separation of concerns
- Production repo always stable

**Cons**:

- Still need branch workflow distinction within each repo
- Adds infrastructure complexity
- Sync overhead between repos
- Doesn't solve the autonomy vs safety problem

**Why Not Chosen**: Adds complexity without solving core problem. Git branches already provide isolation.

---

## Related

**Related ADRs**:

- [ADR-009: PR Review Automation](./ADR-009-pr-review-automation-with-github-cli.md) - Complements this workflow

**Related Documentation**:

- `docs/WORKFLOW_GUIDE.md` - Development workflow
- `docs/SDLC.md` - Software development lifecycle
- `.claude/agents/README.md` - Agent coordination and autonomy levels

**External References**:

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Trunk-Based Development](https://trunkbaseddevelopment.com/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## Notes

### Implementation Guidelines for AI Assistants

**Branch Detection Logic** (pseudo-code):

```typescript
async function determineWorkflow() {
  const branch = await git.getCurrentBranch()
  const isMain = branch === 'main' || branch === 'master' || branch === 'production'

  if (isMain) {
    return {
      workflow: 'human-validated',
      autonomy: 'LOW',
      validation: 'full',
      approvalRequired: ['commit', 'push'],
    }
  } else {
    return {
      workflow: 'ai-assisted',
      autonomy: 'HIGH',
      validation: 'quick',
      approvalRequired: [],
    }
  }
}
```

**Workflow Prompts**:

On main branch:

```
⚠️ You are on the MAIN branch.
This requires careful human validation at each step.
I will run full builds and wait for your approval before commits.

Workflow:
1. Run full validation (lint + typecheck + build + tests)
2. Present changes for review
3. Wait for commit approval
4. Wait for push approval
5. Monitor production deployment
```

On feature branch:

```
✓ You are on feature branch 'feature/auth-refactor'.
I'll work with more autonomy, running validations and committing
automatically after each successful change.

Workflow:
1. Make changes
2. Run quick validation (lint + typecheck + tests)
3. Auto-commit if validation passes
4. Auto-push to remote
5. Monitor preview deployment
```

---

### Branch Creation Checklist (for Developers)

- ✅ Create feature branch for all non-trivial work
- ✅ Never develop directly on main unless fixing critical production issues
- ✅ Use descriptive branch names:
  - `feature/` - New features
  - `fix/` - Bug fixes
  - `refactor/` - Code refactoring
  - `docs/` - Documentation updates
  - `test/` - Test additions/updates
- ✅ Ensure main branch is up-to-date before creating feature branch

---

### Pre-Merge Checklist (for Feature Branches)

Before merging feature branch to main:

- ✅ Preview deployment succeeds
- ✅ All tests passing (unit + integration + E2E)
- ✅ Manual testing completed (tested preview deployment)
- ✅ Code review approved (PR reviewed by at least one team member)
- ✅ Resolved all review comments
- ✅ No merge conflicts with main
- ✅ Ready for production

---

### Main Branch Rules

**NEVER**:

- ⛔ No direct commits without full build validation
- ⛔ No force pushes ever (`git push --force` forbidden)
- ⛔ No merge without preview testing
- ⛔ No push without human approval
- ⛔ No commits that break the build
- ⛔ No experimental or WIP commits

**ALWAYS**:

- ✅ Run full validation before commit (`pnpm vercel-build`)
- ✅ Review all changes before commit
- ✅ Wait for human approval before push
- ✅ Monitor production deployment after push
- ✅ Test production functionality after deployment

---

### Git Hooks (Optional)

**Pre-commit Hook** (feature branches):

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  # Main branch: require full build
  echo "⚠️  Pre-commit on MAIN branch - running full build..."
  pnpm vercel-build
else
  # Feature branch: quick validation
  echo "✓ Pre-commit on feature branch - running quick validation..."
  pnpm lint && pnpm tsc --noEmit && pnpm test
fi
```

**Pre-push Hook** (main branch):

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  echo "⚠️  About to push to MAIN branch!"
  echo "This will deploy to PRODUCTION."
  read -p "Continue? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Push cancelled."
    exit 1
  fi
fi
```

---

### Branch Protection Rules (GitHub)

**Recommended settings for `main` branch**:

```yaml
# .github/branch-protection.yml (conceptual)
branches:
  main:
    protection:
      required_pull_request_reviews:
        required_approving_review_count: 1
      required_status_checks:
        strict: true
        contexts:
          - 'build'
          - 'test'
          - 'lint'
      enforce_admins: true
      restrictions:
        users: []
        teams: ['core-team']
```

---

### Success Metrics

How to measure effectiveness of this approach:

**Feature Branch Development**:

- ⏱️ Time to complete complex feature (target: 50% faster than manual)
- 📊 Number of commits per feature (expect 15-30 for complex features)
- ✅ Preview deployment success rate (target: 95%+)
- 🤖 AI autonomy success rate (target: 90%+ commits without intervention)

**Main Branch Safety**:

- 🚫 Broken builds pushed to main (target: 0 per quarter)
- 🚀 Production deployment success rate (target: 99%+)
- 🔙 Rollbacks required (target: <2 per quarter)
- 👤 Human review coverage (target: 100%)

**Overall Workflow**:

- ⏱️ Time from feature start to production (target: 3-5 days)
- 📝 PR review turnaround time (target: <24 hours)
- 😊 Developer satisfaction with workflow (survey quarterly)

---

### Future Enhancements

Potential improvements for this pattern:

1. **Git Hook Automation**: Auto-detect branch and apply workflow via husky hooks
2. **Branch Protection Enforcement**: GitHub branch protection rules enforce workflow
3. **AI Context Detection**: Claude Code automatically adjusts autonomy based on branch
4. **Deployment Agent**: Automated preview deployment monitoring and alerts
5. **Workflow Templates**: Standardized workflows for common development patterns (hotfix, feature, refactor)
6. **Rollback Automation**: One-command rollback for production issues
7. **Metrics Dashboard**: Real-time metrics on branch workflows and success rates

---

## Revision History

| Date       | Author              | Change        |
| ---------- | ------------------- | ------------- |
| 2025-11-17 | System Architecture | Initial draft |
