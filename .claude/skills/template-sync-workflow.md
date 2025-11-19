# Template Sync Workflow

**Use When**: Syncing updates from projects_template to downstream projects

---

## Context

The projects_template repository serves as a living template that receives improvements over time (new ADRs, skills, agents, configuration updates). Downstream projects need a safe way to pull in these updates without losing their project-specific customizations.

**Adapted from**: Real-world template → home-inventory sync workflow

---

## Problem

**Template Updates After Project Bootstrap**:

```bash
# Initial bootstrap (day 1)
cp -r projects_template/ my-new-project/

# 3 months later: projects_template has new features
# - New ADRs
# - Updated skills
# - Improved agents
# - Better configuration

# Problem: How to sync updates without losing customizations?
```

**Challenges**:

- **Customizations**: Project has project-specific code
- **Conflicts**: Same files modified in both repos
- **Selective Sync**: Some template changes don't apply to all projects
- **Safety**: Don't want to overwrite working code

---

## Solution: Automated Sync Scripts

This skill provides three scripts for safe template synchronization:

1. **sync-from-template.sh** - Full sync (docs, agents, skills, agents)
2. **sync-docs-only.sh** - Documentation only (safest)
3. **review-config-updates.sh** - Review configuration differences

**Location**: `.claude/skills/template-sync-workflow/`

---

## Script 1: Full Sync

**File**: `sync-from-template.sh`

**What it does**:

- ✅ Creates backup branch before any changes
- ✅ Syncs new ADRs, domain guides, testing docs
- ✅ Syncs new agents, skills, agents
- ✅ Uses `--ignore-existing` to preserve customizations
- ✅ Shows summary of changes

**Usage**:

```bash
# From your project directory
cd ~/projects/my-project

# Copy script from template
cp ~/projects/projects_template/.claude/skills/template-sync-workflow/sync-from-template.sh \
   scripts/sync-from-template.sh
chmod +x scripts/sync-from-template.sh

# Run sync
./scripts/sync-from-template.sh ~/projects/projects_template

# Review changes
git diff

# Test
pnpm tsc --noEmit
pnpm build

# Commit if successful
git add .
git commit -m "chore: sync from template"

# Or rollback if issues
git reset --hard HEAD
git checkout -
```

**What it syncs**:

```
docs/adr/              → New ADRs
docs/domains/          → New domain guides
docs/testing/          → Testing documentation
docs/*.md              → Workflow guides (if missing)
.claude/agents/        → New agents
.claude/skills/        → New skills
.claude/agents/     → New agents
```

**Safety Features**:

- Checks for clean working directory
- Creates timestamped backup branch
- Uses `--ignore-existing` (won't overwrite customizations)
- Shows clear rollback instructions

---

## Script 2: Documentation Only Sync

**File**: `sync-docs-only.sh`

**What it does**:

- ✅ Syncs only documentation files
- ✅ Safest option (no code or config changes)
- ✅ Perfect for weekly doc updates

**Usage**:

```bash
# From your project directory
cd ~/projects/my-project

# Copy script from template
cp ~/projects/projects_template/.claude/skills/template-sync-workflow/sync-docs-only.sh \
   scripts/sync-docs-only.sh
chmod +x scripts/sync-docs-only.sh

# Run sync
./scripts/sync-docs-only.sh ~/projects/projects_template

# Review and commit
git add docs/
git commit -m "docs: sync from template"
```

**What it syncs**:

```
docs/adr/              → ADRs only
docs/domains/          → Domain guides only
docs/testing/          → Testing docs only
```

**When to use**:

- ✅ Weekly documentation updates
- ✅ No risk to code or configuration
- ✅ Safe to run anytime

---

## Script 3: Configuration Review

**File**: `review-config-updates.sh`

**What it does**:

- ✅ Compares all configuration files
- ✅ Shows diffs for each file
- ✅ Identifies missing files
- ✅ No changes made (review only)

**Usage**:

```bash
# From your project directory
cd ~/projects/my-project

# Copy script from template
cp ~/projects/projects_template/.claude/skills/template-sync-workflow/review-config-updates.sh \
   scripts/review-config-updates.sh
chmod +x scripts/review-config-updates.sh

# Review configuration differences
./scripts/review-config-updates.sh ~/projects/projects_template

# Manually apply desired changes
# (Edit files based on diff output)

# Test after changes
pnpm install
pnpm tsc --noEmit
pnpm build
```

**What it reviews**:

```
package.json           → Dependencies, scripts
tsconfig.json          → TypeScript configuration
next.config.ts         → Next.js settings
tailwind.config.ts     → Tailwind configuration
vercel.json            → Deployment settings
.env.example           → Environment variables
eslint.config.mjs      → Linting rules
.prettierrc            → Code formatting
CLAUDE.md              → Project instructions
```

**When to use**:

- ✅ Before syncing configuration
- ✅ Understanding what changed in template
- ✅ Planning manual updates

---

## Workflow Examples

### Example 1: Weekly Documentation Sync

```bash
# Every Monday: sync new docs from template

cd ~/projects/my-project

# Sync docs only (safe, fast)
./scripts/sync-docs-only.sh ~/projects/projects_template

# Quick review
git diff

# Commit
git add docs/
git commit -m "docs: sync from template (weekly)"
git push
```

### Example 2: Monthly Full Sync

```bash
# First Monday of month: full sync

cd ~/projects/my-project

# Ensure clean state
git status

# Run full sync
./scripts/sync-from-template.sh ~/projects/projects_template

# Review changes
git diff

# Test thoroughly
pnpm install
pnpm gen:check
pnpm tsc --noEmit
pnpm lint
pnpm test
pnpm build

# Commit in logical groups
git add docs/
git commit -m "docs: sync ADRs and guides from template"

git add .claude/
git commit -m "feat: sync agents and skills from template"

git push
```

### Example 3: Configuration Update

```bash
# Template updated TypeScript settings

cd ~/projects/my-project

# Review what changed
./scripts/review-config-updates.sh ~/projects/projects_template

# Output shows tsconfig.json differences
# Manually apply desired changes
code tsconfig.json

# Test
pnpm tsc --noEmit
pnpm build

# Commit
git add tsconfig.json
git commit -m "chore: apply stricter TypeScript settings from template"
```

### Example 4: New Project Bootstrap

```bash
# Starting completely fresh project

# Clone template
git clone git@github.com:yourorg/projects_template.git new-project
cd new-project

# Remove template git history
rm -rf .git

# Initialize new repo
git init
git remote add origin git@github.com:yourorg/new-project.git

# Initial commit
git add .
git commit -m "chore: bootstrap from projects_template"
git push -u origin main

# Add template as remote for future syncs
git remote add template git@github.com:yourorg/projects_template.git
git fetch template

# Copy sync scripts for later use
mkdir -p scripts
cp .claude/skills/template-sync-workflow/*.sh scripts/
chmod +x scripts/*.sh
```

---

## Best Practices

### 1. Sync Frequently, Sync Small

```bash
# ✅ GOOD: Weekly small syncs
./scripts/sync-docs-only.sh ~/projects/projects_template

# ❌ BAD: Yearly massive syncs (merge hell)
```

### 2. Always Create Backup Branch

```bash
# Sync scripts do this automatically
# But if doing manual sync:
git checkout -b backup-before-manual-sync
git checkout main
# ... make changes ...
```

### 3. Test After Every Sync

```bash
# Full validation pipeline
pnpm install          # Ensure dependencies match
pnpm gen:check        # ZenStack + Prisma generation
pnpm tsc --noEmit     # Type check
pnpm lint             # Linting
pnpm test             # Unit tests
pnpm build            # Production build
```

### 4. Document Customizations

Create `docs/TEMPLATE_CUSTOMIZATIONS.md`:

```markdown
# Template Customizations

## Files Modified from Template

- `package.json`: Added Stripe and AWS SDK
- `next.config.ts`: Custom image domains for CDN
- `lib/auth/auth-server.ts`: Custom OAuth providers

## Files to Skip When Syncing

- `zschema/`: Project-specific data models
- `app/`: Project-specific routes
- `components/`: Project-specific UI

## Safe to Sync

- `docs/adr/`: Always sync
- `.claude/`: Always sync
- `scripts/`: Review and merge
```

### 5. Use Git Remote for Template Tracking

```bash
# Add template as remote
cd ~/projects/my-project
git remote add template git@github.com:yourorg/projects_template.git

# Fetch updates
git fetch template

# Cherry-pick specific commits
git log template/main --oneline
git cherry-pick <commit-hash>

# Or selective file checkout
git checkout template/main -- docs/adr/ADR-013-new-pattern.md
```

---

## Safety Checklist

**Before Syncing**:

- [ ] Clean working directory: `git status`
- [ ] All changes committed
- [ ] Backup branch created (scripts do this automatically)
- [ ] Template path is correct

**During Sync**:

- [ ] Review what scripts will sync
- [ ] Understand `--ignore-existing` behavior
- [ ] Check output for errors

**After Sync**:

- [ ] Review changes: `git diff`
- [ ] Run type checker: `pnpm tsc --noEmit`
- [ ] Run linter: `pnpm lint`
- [ ] Run tests: `pnpm test`
- [ ] Run build: `pnpm build`
- [ ] Test locally: `pnpm dev`

---

## Troubleshooting

### Issue 1: Script Permission Denied

```bash
# Problem
bash: ./scripts/sync-from-template.sh: Permission denied

# Solution
chmod +x scripts/sync-from-template.sh
```

### Issue 2: Template Path Not Found

```bash
# Problem
❌ Error: Template path not found: ../projects_template

# Solution: Specify correct path
./scripts/sync-from-template.sh ~/projects/projects_template
```

### Issue 3: Working Directory Not Clean

```bash
# Problem
❌ Error: Working directory not clean. Commit changes first.

# Solution: Commit or stash changes
git add .
git commit -m "wip: save work before template sync"

# Or stash
git stash
./scripts/sync-from-template.sh ~/projects/projects_template
git stash pop
```

### Issue 4: Build Breaks After Sync

```bash
# Problem: Build fails after syncing

# Solution: Identify breaking change
pnpm tsc --noEmit  # Find type errors
git diff           # Review changes

# Rollback specific file
git checkout HEAD -- path/to/breaking/file.ts

# Or rollback entire sync (backup branch still exists)
git reset --hard HEAD
git checkout -
git branch -D backup-before-sync-YYYYMMDD-HHMMSS
```

### Issue 5: Want to Force Overwrite File

```bash
# Problem: Script skipped file with --ignore-existing, but you want template version

# Solution: Copy manually
cp ~/projects/projects_template/path/to/file.ts path/to/file.ts

# Review and commit
git diff
git add path/to/file.ts
git commit -m "chore: adopt template version of file.ts"
```

---

## Installing Scripts in Project

**One-time setup** in each project:

```bash
cd ~/projects/my-project

# Create scripts directory
mkdir -p scripts

# Copy all sync scripts
cp ~/projects/projects_template/.claude/skills/template-sync-workflow/*.sh scripts/

# Make executable
chmod +x scripts/*.sh

# Commit scripts
git add scripts/
git commit -m "chore: add template sync scripts"

# Now you can run them anytime
./scripts/sync-from-template.sh ~/projects/projects_template
./scripts/sync-docs-only.sh ~/projects/projects_template
./scripts/review-config-updates.sh ~/projects/projects_template
```

---

## What NOT to Sync

**Never auto-sync these** (project-specific):

```
zschema/                    # Project data models
app/                        # Project routes
components/                 # Project UI components
prisma/migrations/          # Database migrations
lib/models/                 # Project-specific models
server/routers/custom/      # Custom tRPC routes
public/                     # Project assets
.env                        # Never sync actual env (use .env.example)
```

**Review before syncing**:

```
package.json                # May have project dependencies
tsconfig.json               # May have project paths
next.config.ts              # May have project domains
schema.zmodel               # Project-specific schema
```

**Safe to sync**:

```
docs/adr/                   # Architecture decisions
docs/domains/               # Implementation patterns
.claude/agents/             # Agents
.claude/skills/             # Skills
.claude/agents/          # Subagents
scripts/                    # Utility scripts (review first)
```

---

## Related Documentation

- **Git Worktrees**: `.claude/skills/git-worktree-concurrent-sessions.md` (test sync in worktree)
- **Branch-Based Autonomy**: `docs/adr/ADR-010-branch-based-ai-autonomy.md` (sync workflow)

---

**Key Principle**: Treat projects_template as a living source of best practices. Use provided scripts for safe, automated syncing. Sync frequently (weekly docs, monthly full), test thoroughly, and preserve project-specific customizations.
