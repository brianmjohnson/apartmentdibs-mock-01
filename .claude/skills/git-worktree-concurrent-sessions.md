# Git Worktree for Concurrent Sessions

**Use When**: Working on multiple features/branches simultaneously without switching contexts

---

## Context

Git worktrees allow multiple working directories from a single repository, enabling concurrent work on different branches without constant `git checkout` switching.

**Adapted from**: ApartmentDibs ADR-012

---

## Problem

**Context Switching Overhead**:

```bash
# Traditional workflow (slow and error-prone)
git checkout feature-a    # Work on feature A
# ... make changes, test, etc.
git stash                 # Stash changes
git checkout feature-b    # Switch to feature B
# ... work on B
git checkout feature-a    # Switch back
git stash pop             # Restore changes

# Issues:
# - Lose running dev servers
# - Reinstall dependencies if lockfile changed
# - Lose terminal state
# - Risk of stashing wrong changes
```

---

## Solution: Git Worktrees

**Create Separate Working Directories**:

```bash
# Main repository
~/projects/myapp/              # Main worktree (usually on main branch)

# Additional worktrees
~/projects/myapp-feature-a/    # Worktree for feature-a branch
~/projects/myapp-feature-b/    # Worktree for feature-b branch
~/projects/myapp-bugfix/       # Worktree for bugfix branch
```

**Each worktree**:

- ✅ Separate working directory
- ✅ Separate `node_modules/` (if needed)
- ✅ Separate dev server
- ✅ Separate terminal sessions
- ✅ Shared `.git/` directory (same repo, different branches)

---

## Usage

### 1. Create Worktree

```bash
# From main repository
cd ~/projects/myapp

# Create worktree for new branch
git worktree add ../myapp-feature-a feature-a

# Create worktree for existing branch
git worktree add ../myapp-bugfix bugfix/auth-error

# Create worktree and new branch
git worktree add -b feature-new ../myapp-feature-new
```

### 2. Work in Worktree

```bash
# Navigate to worktree
cd ~/projects/myapp-feature-a

# Start dev server
pnpm dev

# Make changes, commit, push
git add .
git commit -m "feat: add feature A"
git push origin feature-a
```

### 3. Switch Between Worktrees

```bash
# Terminal 1: Work on feature A
cd ~/projects/myapp-feature-a
pnpm dev                    # Dev server on port 3000

# Terminal 2: Work on feature B (simultaneously!)
cd ~/projects/myapp-feature-b
pnpm dev -- --port 3001     # Dev server on different port

# No git checkout needed! Both are running simultaneously.
```

### 4. Clean Up Worktree

```bash
# After merging feature branch
cd ~/projects/myapp

# Remove worktree
git worktree remove ../myapp-feature-a

# Or delete manually and prune
rm -rf ~/projects/myapp-feature-a
git worktree prune
```

---

## Benefits

✅ **No Context Switching**: Work on multiple features without `git checkout`
✅ **Concurrent Dev Servers**: Run multiple dev servers on different ports
✅ **Preserved State**: Each worktree maintains its terminal state, processes
✅ **Independent Dependencies**: Different `node_modules/` if lockfiles differ
✅ **Fast Testing**: Quickly test different branches side-by-side
✅ **AI Agent Parallelism**: Multiple Claude Code sessions on different branches

---

## Use Cases

### 1. Feature Development + Bug Fix

```bash
# Main work: Feature development
cd ~/projects/myapp-feature-auth
pnpm dev                      # Port 3000

# Urgent bug fix arrives
cd ~/projects/myapp
git worktree add ../myapp-hotfix hotfix/security-patch
cd ~/projects/myapp-hotfix
pnpm dev -- --port 3001       # Port 3001

# Fix bug, test, merge
# Return to feature work without losing context
```

### 2. Multiple Claude Code Sessions

```bash
# Session 1: Frontend work
cd ~/projects/myapp-frontend
claude                        # Claude Code session 1

# Session 2: Backend work (different branch)
cd ~/projects/myapp-backend
claude                        # Claude Code session 2

# Both agents work in parallel, no conflicts!
```

### 3. Side-by-Side Comparison

```bash
# Test new implementation vs old
cd ~/projects/myapp-new-approach
pnpm dev                      # Port 3000

cd ~/projects/myapp-old-approach
pnpm dev -- --port 3001       # Port 3001

# Open both in browser, compare behavior
```

---

## Best Practices

**Naming Convention**:

```bash
# Use descriptive names for worktrees
~/projects/myapp/             # Main
~/projects/myapp-feat-auth/   # Feature: authentication
~/projects/myapp-fix-bug-123/ # Bug fix
~/projects/myapp-refactor/    # Refactoring work
```

**Port Management**:

```bash
# Assign different ports to avoid conflicts
# Main: 3000
# Worktree 1: 3001
# Worktree 2: 3002

# Use env files
echo "PORT=3001" > .env.local
```

**Dependency Management**:

```bash
# Option 1: Shared node_modules (symlink)
ln -s ../myapp/node_modules node_modules

# Option 2: Separate node_modules (safer but uses more disk)
pnpm install
```

**Clean Up Regularly**:

```bash
# List all worktrees
git worktree list

# Remove merged worktrees
git worktree prune

# Check for stale worktrees
git worktree list | grep -v "(bare)"
```

---

## Common Issues

**Issue 1: Branch Already Checked Out**

```bash
Error: 'feature-a' is already checked out at '/path/to/worktree'

# Solution: Can only check out branch in one worktree at a time
# Remove existing worktree first or create new branch
```

**Issue 2: Port Conflicts**

```bash
Error: Port 3000 already in use

# Solution: Specify different port
pnpm dev -- --port 3001

# Or kill existing process
lsof -ti:3000 | xargs kill
```

**Issue 3: Stale Worktrees After Manual Delete**

```bash
# You deleted worktree folder manually

# Solution: Prune stale worktrees
git worktree prune
```

---

## Advanced: Shared Config

**Share Configuration Across Worktrees**:

```bash
# In main repo, create shared config
mkdir .shared-config
echo "PORT=3000" > .shared-config/.env.base

# In each worktree
ln -s ../.shared-config/.env.base .env.local

# Override port in specific worktree
echo "PORT=3001" >> .env.local
```

---

## Quick Reference

```bash
# Create worktree
git worktree add <path> <branch>

# Create worktree with new branch
git worktree add -b <new-branch> <path>

# List worktrees
git worktree list

# Remove worktree
git worktree remove <path>

# Prune deleted worktrees
git worktree prune

# Move worktree
git worktree move <old-path> <new-path>
```

---

## Example Workflow

**Starting a New Feature**:

```bash
# 1. Create worktree
cd ~/projects/myapp
git worktree add ../myapp-new-feature -b feature/new-feature

# 2. Set up environment
cd ~/projects/myapp-new-feature
cp ../myapp/.env.example .env.local
echo "PORT=3001" >> .env.local

# 3. Install dependencies (if needed)
pnpm install

# 4. Start dev server
pnpm dev

# 5. Work on feature (separate from main)
# ... make changes ...

# 6. Commit and push
git add .
git commit -m "feat: implement new feature"
git push origin feature/new-feature

# 7. Create PR (without leaving worktree)
gh pr create --title "New feature" --body "..."

# 8. Clean up after merge
cd ~/projects/myapp
git worktree remove ../myapp-new-feature
git branch -d feature/new-feature
```

---

## Related Documentation

- **Branch-Based AI Autonomy**: `docs/adr/ADR-010-branch-based-ai-autonomy.md`
- **Git Documentation**: https://git-scm.com/docs/git-worktree

---

**Key Principle**: Use worktrees for concurrent work on multiple branches. Eliminates context switching overhead and enables parallel development workflows.
