---
name: safe-delete
description: Safely delete files by moving them to .deleted/ folder instead of permanent deletion. Use this when removing files, cleaning up code, or deleting unused components. Preserves files for recovery.
allowed-tools: Bash, Read, Glob
---

# Safe Delete Skill

Move files to `.deleted/` folder instead of permanently deleting them, preserving the ability to recover.

## When to Use

- Removing unused files
- Cleaning up deprecated code
- Deleting old components
- Any file deletion in the project

## Instructions

**NEVER permanently delete files**. Always move them to `.deleted/` to preserve for potential recovery.

### Basic Usage

```bash
# Move file to .deleted/ preserving path structure
mkdir -p .deleted/$(dirname <filepath>)
git mv <filepath> .deleted/<filepath>
```

### Script Helper

For convenience, use this pattern:

```bash
# Delete a single file
filepath="path/to/file.ts"
mkdir -p ".deleted/$(dirname "$filepath")"
git mv "$filepath" ".deleted/$filepath"
```

### Examples

#### Delete a Component

```bash
filepath="components/unused-button.tsx"
mkdir -p ".deleted/$(dirname "$filepath")"
git mv "$filepath" ".deleted/$filepath"
```

Result: `components/unused-button.tsx` → `.deleted/components/unused-button.tsx`

#### Delete Multiple Files

```bash
for file in components/old-*.tsx; do
  mkdir -p ".deleted/$(dirname "$file")"
  git mv "$file" ".deleted/$file"
done
```

#### Delete a Directory

```bash
dirpath="components/deprecated"
mkdir -p ".deleted/$dirpath"
git mv "$dirpath"/* ".deleted/$dirpath/"
rmdir "$dirpath"
```

## Recovery

To recover a deleted file:

```bash
# Move back from .deleted/
git mv .deleted/path/to/file.ts path/to/file.ts
```

## Cleanup

Periodically clean up `.deleted/` folder after confirming files are not needed:

```bash
# List what's in .deleted/
find .deleted -type f

# Remove old deleted files (after reviewing)
git rm -r .deleted/
```

## .gitignore Consideration

Decide whether to track `.deleted/`:

**Track it** (recommended for teams): Files remain recoverable from git history

```gitignore
# Don't ignore .deleted/
```

**Ignore it** (local only): Personal trash, not shared

```gitignore
.deleted/
```

## Important Notes

- The `.deleted/` folder mirrors the original directory structure
- Files in `.deleted/` are still tracked by git (unless ignored)
- This provides a "soft delete" before permanent removal
- Clean up `.deleted/` periodically to avoid bloat
