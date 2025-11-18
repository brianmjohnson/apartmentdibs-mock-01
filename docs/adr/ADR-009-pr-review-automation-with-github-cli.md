# ADR-009: PR Review Automation with GitHub CLI

**Status:** DRAFT
**Date:** 2025-11-17
**Author:** System Architecture <system@example.com>

---

## Context

**What is the issue or problem we're solving?**

Pull request reviews generate dozens of comments requiring responses, verification, and documentation. Manual PR comment management becomes time-consuming and error-prone at scale:

- **Manual overhead**: Clicking through GitHub UI for each comment reply
- **Inconsistent responses**: Easy to miss comments or provide incomplete information
- **No workflow automation**: Human-in-the-loop approvals required for every `gh` command
- **Poor tracking**: Difficult to verify which comments have been addressed
- **Lost context**: No structured verification trail linking comments to code changes

**Background**:
- Large PRs (500+ LOC) can generate 20-50 review comments
- AI agents and automated tools (linters, security scanners) add structured comments
- Manual response workflow: read comment → find code → verify → reply (repeat 30+ times)
- Constant approval prompts interrupt flow when using GitHub CLI

**Requirements**:
- Programmatically reply to PR comments with verification details
- Avoid approval spam for trusted GitHub operations
- Maintain audit trail of bug fixes and verifications
- Enable AI-assisted review comment resolution
- Scalable to 50+ comments per PR

---

## Decision

**Use GitHub CLI (`gh`) API for programmatic PR comment management with pre-approved permissions**

This enables automated or semi-automated PR review comment workflows with full audit trails and verification documentation.

### Implementation Approach

**1. GitHub CLI API Integration**

```bash
# Fetch PR comments for analysis
gh api repos/{owner}/{repo}/pulls/{pr}/comments

# Fetch specific comment details
gh api repos/{owner}/{repo}/pulls/comments/{comment_id}

# Reply to specific review comments
gh api repos/{owner}/{repo}/pulls/comments/{comment_id}/replies \
  -f body="Verification details..."

# List all comments on a PR
gh pr view {pr_number} --json comments
```

**2. Permission Pre-approval** (`.claude/settings.json`)

```json
{
  "permissions": {
    "allow": [
      "Bash(gh api:*)",
      "Bash(gh pr:*)"
    ]
  }
}
```

**Why Pre-approve**:
- Eliminates ~30 approval prompts per PR review session
- GitHub CLI is read-mostly (comments are non-destructive)
- PAT can be scoped to `repo` with read/write access only
- Agent can batch-process comments efficiently

**3. Comment Reply Workflow**

```
1. Fetch all PR comments
2. For each unresolved comment:
   a. Read the comment to understand the issue
   b. Verify the code/fix in the actual file locations
   c. Document verification with file paths and line numbers
   d. Reply with structured response including verification details
   e. Mark comment as addressed (metadata or tracking file)
3. Generate summary report of all addressed comments
```

**4. Response Template**

```markdown
**Verified**: [Issue description from comment]

**Resolution**:
- [What was done to fix the issue]
- File: `path/to/file.ts:lines`
- Commit: [commit-hash or "pending commit"]

**Verification**: [How the fix was tested or validated]
[Code snippet if relevant]
```

**Example Response**:

```markdown
**Verified**: Missing null check for `user.profile` access

**Resolution**:
- Added optional chaining to prevent null reference error
- File: `lib/auth/helpers.ts:42-45`
- Commit: `a1b2c3d`

**Verification**: Tested with `user.profile === null` case
```typescript
// Before
const name = user.profile.displayName

// After
const name = user.profile?.displayName ?? "Anonymous"
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences (Easier)

✅ **Systematic Bug Resolution**: Process review comments in batches with verification
✅ **No Approval Spam**: Pre-approved permissions eliminate constant approval prompts
✅ **Better Documentation**: Every fix documented with file paths and verification
✅ **Faster Iteration**: Reply to multiple comments in one workflow (10-20 replies in minutes)
✅ **AI Assistance**: Enables AI agents to participate in code review workflows
✅ **Audit Trail**: Complete record of all bug fixes and verifications
✅ **Scalability**: Handle 50+ comments programmatically vs manual UI clicks
✅ **Consistency**: Structured responses prevent missing details

### Negative Consequences (More Difficult)

⚠️ **Security Risk**: `Bash(gh api:*)` allows all GitHub API operations
   - *Mitigation*: Use read-only PAT scope when possible, limit to `repo` scope
   - *Mitigation*: Audit all `gh api` commands before execution
   - *Mitigation*: Rotate PATs regularly

⚠️ **Setup Required**: Need to configure GitHub CLI and PAT in development environment
   - *Mitigation*: Document setup in `docs/GETTING_STARTED.md`
   - *Mitigation*: Provide script to validate `gh` auth status

⚠️ **Learning Curve**: Team needs to understand `gh api` usage patterns
   - *Mitigation*: Provide examples and templates in this ADR
   - *Mitigation*: Create wrapper scripts for common operations

### Neutral Consequences

- **Rate Limits**: GitHub API has rate limits (5000/hour authenticated)
- **Dependency**: Requires `gh` CLI installed and authenticated
- **Workflow Change**: Team must adopt structured comment response pattern

---

## Alternatives Considered

### Alternative 1: Manual GitHub UI

**Description**: Continue using GitHub web interface for all PR comment replies

**Pros**:
- No setup required
- Familiar workflow for all team members
- No security considerations for CLI tools

**Cons**:
- Time-consuming for 30+ comments (10-20 seconds per comment)
- No automation possible
- Inconsistent response quality (easy to miss details)
- Easy to miss comments entirely
- No structured verification trail

**Why Not Chosen**: Does not scale to large PRs or AI-assisted workflows. Manual overhead prohibitive for systematic bug resolution.

---

### Alternative 2: GitHub App/Bot

**Description**: Build custom GitHub App to automatically reply to PR comments

**Pros**:
- Fully automated (no human intervention)
- Centralized webhook-driven workflow
- Can implement complex logic

**Cons**:
- Overhead of app infrastructure (hosting, webhooks, auth)
- Complexity for one-time migration tasks or ad-hoc reviews
- Would still need human verification for most comments
- Overkill for developer-driven workflows
- Maintenance burden (app code, infrastructure, secrets)

**Why Not Chosen**: Too complex for semi-automated workflows where human judgment is required for many comments. GitHub CLI provides right balance of automation and control.

---

### Alternative 3: GitHub Actions Workflow

**Description**: Use GitHub Actions to automatically respond to PR comments

**Pros**:
- Integrated with CI/CD pipeline
- No local setup required
- Runs in GitHub-managed environment

**Cons**:
- Limited to CI/CD context (runs on events, not on-demand)
- Can't provide real-time feedback during development
- Less flexible than CLI for ad-hoc tasks
- Still needs approval mechanisms for write operations
- Difficult to test locally

**Why Not Chosen**: Not suitable for interactive, developer-driven PR review workflows. Best for automated checks, not manual comment resolution.

---

### Alternative 4: Third-Party PR Management Tools

**Description**: Use tools like Review Board, Gerrit, or Phabricator

**Pros**:
- Purpose-built for code review workflows
- Advanced features (inline discussions, approval chains)
- Better UI/UX than GitHub

**Cons**:
- Additional tool to learn and maintain
- May not integrate well with GitHub
- Migration cost from existing GitHub workflow
- Team familiarity with GitHub ecosystem

**Why Not Chosen**: GitHub is primary source control platform. Adding separate review tool increases complexity without significant benefit.

---

## Related

**Related ADRs**:
- None yet (this is a process ADR, not technical architecture)

**Related Documentation**:
- `docs/WORKFLOW_GUIDE.md` - PR review process
- `.claude/settings.json` - Permission configuration

**External References**:
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub API v3 - Pull Request Review Comments](https://docs.github.com/en/rest/pulls/comments)
- [GitHub CLI API Reference](https://cli.github.com/manual/gh_api)

---

## Notes

### Setup Instructions

**1. Install GitHub CLI**:

```bash
# macOS
brew install gh

# Linux
sudo apt install gh

# Windows
choco install gh
```

**2. Authenticate**:

```bash
gh auth login
# Follow prompts to authenticate with GitHub
```

**3. Verify Authentication**:

```bash
gh auth status
# Should show authenticated user and scopes
```

**4. Configure Permissions** (`.claude/settings.json`):

```json
{
  "permissions": {
    "allow": [
      "Bash(gh api:*)",
      "Bash(gh pr:*)"
    ]
  }
}
```

---

### Common Patterns

**Fetch all comments on a PR**:

```bash
gh api repos/OWNER/REPO/pulls/PR_NUMBER/comments \
  --jq '.[] | {id, body, path, line, user: .user.login}'
```

**Reply to a specific comment**:

```bash
gh api repos/OWNER/REPO/pulls/comments/COMMENT_ID/replies \
  -f body="$(cat <<'EOF'
**Verified**: Issue description

**Resolution**:
- Fixed in commit abc123
- File: `path/to/file.ts:42`

**Verification**: Tested with unit test
EOF
)"
```

**List unresolved comments** (requires filtering in jq):

```bash
gh pr view PR_NUMBER --json comments \
  --jq '.comments[] | select(.state == "UNRESOLVED")'
```

---

### Error Handling

**Common Error**: `Validation Failed (HTTP 422) - user_id can only have one pending review`

**Solution**: Discard pending review on GitHub before batch-replying:

1. Go to PR page on GitHub
2. Click "Finish review" and discard changes
3. Retry failed comment replies

---

**Common Error**: `Resource not accessible by integration (HTTP 403)`

**Solution**: Check GitHub token scopes:

```bash
gh auth status
# Ensure token has 'repo' scope
```

Refresh token if needed:

```bash
gh auth refresh -s repo
```

---

### Verification Pattern

For each review comment:

1. **Read** the file at the specified location (`path:line` from comment)
2. **Verify** the issue exists or was already fixed
3. **Document** the actual state of the code with snippets
4. **Reply** with verification details (use template)
5. **Track** which comments have been addressed (metadata file or spreadsheet)

**Example Workflow**:

```bash
# 1. Fetch all comments
gh api repos/OWNER/REPO/pulls/123/comments > pr_comments.json

# 2. For each comment, read the file
cat pr_comments.json | jq -r '.[0] | .path + ":" + (.line|tostring)'
# Output: lib/auth/helpers.ts:42

# 3. Read the file at that location
sed -n '40,45p' lib/auth/helpers.ts

# 4. Verify issue and prepare response
# ... (manual or automated verification)

# 5. Reply with verification
gh api repos/OWNER/REPO/pulls/comments/COMMENT_ID/replies \
  -f body="Verification response..."
```

---

### Tracking Addressed Comments

**Option 1: Metadata File** (`pr_comments_tracking.json`):

```json
{
  "pr": 123,
  "comments": [
    {
      "id": 456,
      "status": "addressed",
      "verified_at": "2025-11-17T10:30:00Z",
      "commit": "a1b2c3d"
    }
  ]
}
```

**Option 2: GitHub Labels**:

- Add label `review:addressed` to PR after batch processing

**Option 3: Comment Prefix**:

- Start reply with `**[VERIFIED]**` to indicate addressed comment

---

### Success Metrics

How to measure effectiveness of this approach:

- ✅ Time to address all PR comments (target: <1 hour for 30+ comments)
- ✅ Percentage of comments with verification details (target: 100%)
- ✅ Number of approval prompts (target: 0 with pre-approved permissions)
- ✅ Percentage of missed comments (target: 0%)
- ✅ Audit trail completeness (target: 100% with file paths and commits)

---

### Future Enhancements

Potential improvements for this pattern:

1. **Comment Templates**: Standardized response formats for common issue types (security, performance, accessibility)
2. **Bulk Operations**: Script to process multiple comments in one command (`pnpm pr:reply-all`)
3. **Status Tracking**: Database or file to track which comments are addressed across multiple PRs
4. **Integration Testing**: Automated verification that claimed fixes actually work (run tests for modified files)
5. **PR Comment Dashboard**: TUI interface for managing PR comments (interactive CLI tool)
6. **AI Agent Integration**: Delegate comment verification to AI agents with structured output

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-17 | System Architecture | Initial draft |
