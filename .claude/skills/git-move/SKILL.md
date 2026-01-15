---
name: git-move
description: Move or rename files using git mv to preserve history. Use this when moving files, renaming files, or reorganizing code structure. Always prefer git mv over regular mv or filesystem operations.
---

# Git Move Skill

Move or rename files using `git mv` to preserve git history and ensure proper staging.

## When to Use

- Moving files between directories
- Renaming files
- Reorganizing code structure
- Refactoring file locations

## Instructions

**ALWAYS use `git mv` instead of regular file move operations** when working in a git repository.

### Basic Usage

```bash
# Move a file
git mv <source> <destination>

# Examples
git mv src/old-component.tsx src/components/new-component.tsx
git mv app/page.tsx app/(home)/page.tsx
git mv utils.ts lib/utils.ts
```

### Moving Multiple Files

```bash
# Move all files matching a pattern
git mv src/utils/*.ts lib/utils/

# Move entire directory
git mv old-directory/ new-directory/
```

### Benefits Over Regular mv

1. **Preserves history**: Git tracks the file rename
2. **Auto-stages**: Change is automatically staged for commit
3. **Safe operation**: Fails if destination exists (prevents overwrites)
4. **Works with git status**: Shows as renamed, not deleted+added

## Examples

### Rename a Component

```bash
git mv components/OldButton.tsx components/Button.tsx
```

### Reorganize Directory Structure

```bash
# Create target directory first if needed
mkdir -p components/ui

# Move files
git mv components/button.tsx components/ui/button.tsx
git mv components/input.tsx components/ui/input.tsx
```

### Move with Force (Overwrite)

```bash
# Use -f to overwrite existing destination (use carefully)
git mv -f source.ts destination.ts
```

## Important Notes

- After moving, update all import statements that reference the old path
- Run type checking (`pnpm tsc --noEmit`) to find broken imports
- Consider using an IDE refactoring tool for imports if available
