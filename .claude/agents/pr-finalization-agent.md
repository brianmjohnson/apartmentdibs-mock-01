# PR Finalization Agent

**Type**: Task-Specific Agent
**Purpose**: Complete PR workflow automation
**Triggers**: When PR is ready for review

---

## Mission

Finalize pull requests with proper description, labels, reviewers, and verification checklist.

---

## Process

### 1. Verify PR is Ready

**Checklist**:
- [ ] All tests passing - `pnpm test` and/or `pnpm test:e2e`
- [ ] Lint checks passed - `pnpm lint`
- [ ] Build successful - `tsc -noEmit && pnpm build`
- [ ] Comments on PR are resolved
- [ ] No merge conflicts
- [ ] Branch up to date

When builds fail, fix and commit but don't push. Push only after the build is successful.

After pushing the code:
1. monitor the build via the Vercel CLI for a CI/CD build failure. In this case, reproduce the error is fixed locally using `pnpm vercel-build` before pushing the fix.
2. monitor the github comments on the PR for bugbot and code-review feedback. Make the necessary updates, and reply directly to the comment with the commit and a summary. Use github comments and replies for human-in-the-loop clarifications, decisions or guidance when necessary.

### 2. Check for Database Migrations

**If `schema.prisma` changed**:

1. **Capture Migration Name**:
   ```bash
   # If migration was created
   pnpm prisma migrate dev --name <description>
   # Note the generated migration timestamp name
   ```

2. **Verify Migration Files**:
   - Check `prisma/migrations/` for new migration folder
   - Example: `20251116123045_add_user_preferences`
   - Verify both `migration.sql` and `migration.json` exist

3. **Document Rollback** (for PR description)

**If No Schema Changes**:
- Skip to step 3 (Generate PR Description)

---

### 3. Generate PR Description

**Format**:
```markdown
## Summary
[What this PR accomplishes]

## Related
- Fixes #123
- Implements US-001

## Changes
- Added feature X
- Updated component Y
- Fixed bug Z

## Database Changes
**Migration**: `20251116123045_add_user_preferences`

**Rollback** (if deployment fails):
\`\`\`bash
# Mark migration as rolled back
pnpm prisma migrate resolve --rolled-back 20251116123045_add_user_preferences

# If data needs manual cleanup, run:
# psql $DATABASE_URL -c "DROP TABLE user_preferences;"
\`\`\`

**Schema Changes**:
- Added `UserPreference` model
- Added `userId` foreign key to `preferences` table

[Include this section ONLY if schema.prisma was modified]

---

## Testing
- [ ] Unit tests added
- [ ] Manual testing completed
- [ ] Accessibility verified
- [ ] Database migration tested (rollback verified)

## Screenshots
[If UI changes]

## Deployment Notes
- **Migration Required**: Yes/No
- **Breaking Changes**: Yes/No
- **Rollback Plan**: See Database Changes section above

## Checklist
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Analytics events added
- [ ] Migration rollback documented (if applicable)
- [ ] No breaking changes (or clearly documented)
```

**Why Database Changes Section Matters**:
- Provides immutable release marker (timestamp in migration name)
- Clear rollback path for deployment failures
- Deployment safety through explicit migration documentation

**If No Database Changes**:
Remove "Database Changes" and "Deployment Notes" sections from PR description.

### 4. Add Labels

Based on changes:
- `feature` - New functionality
- `bug` - Bug fix
- `refactor` - Code improvement
- `docs` - Documentation
- `chore` - Maintenance
- `migration` - Database schema change (add if migration present)

### 5. Request Reviews

Assign appropriate reviewers based on changes:
- Frontend changes → Frontend reviewer
- Backend changes → Backend reviewer
- Database migrations → Senior developer + DBA (if available)
- Architecture → Tech lead

---

**My Output**: Well-documented PR ready for review with clear deployment and rollback instructions.
