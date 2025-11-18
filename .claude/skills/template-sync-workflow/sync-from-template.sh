#!/bin/bash
# Sync documentation, agents, and skills from projects_template
# Usage: ./sync-from-template.sh [template_path]

set -e

TEMPLATE_PATH="${1:-../projects_template}"
PROJECT_PATH="$(pwd)"

echo "🔄 Syncing from template: $TEMPLATE_PATH"
echo "📁 Into project: $PROJECT_PATH"

# Ensure template path exists
if [[ ! -d "$TEMPLATE_PATH" ]]; then
  echo "❌ Error: Template path not found: $TEMPLATE_PATH"
  exit 1
fi

# Ensure clean working directory
if [[ -n $(git status -s) ]]; then
  echo "❌ Error: Working directory not clean. Commit changes first."
  echo "Run: git status"
  exit 1
fi

# Create backup branch
BACKUP_BRANCH="backup-before-sync-$(date +%Y%m%d-%H%M%S)"
git checkout -b "$BACKUP_BRANCH"
git checkout -
echo "✅ Created backup branch: $BACKUP_BRANCH"

# Sync documentation
echo ""
echo "📚 Syncing documentation..."
rsync -av --ignore-existing "$TEMPLATE_PATH/docs/adr/" docs/adr/ 2>/dev/null || echo "  (no ADRs to sync)"
rsync -av --ignore-existing "$TEMPLATE_PATH/docs/domains/" docs/domains/ 2>/dev/null || echo "  (no domain guides to sync)"
rsync -av --ignore-existing "$TEMPLATE_PATH/docs/testing/" docs/testing/ 2>/dev/null || echo "  (no testing docs to sync)"

# Sync workflow guides (but not project-specific content)
for guide in WORKFLOW_GUIDE.md HITL_GUIDE.md GETTING_STARTED.md; do
  if [[ -f "$TEMPLATE_PATH/docs/$guide" ]] && [[ ! -f "docs/$guide" ]]; then
    cp "$TEMPLATE_PATH/docs/$guide" docs/
    echo "  ✅ Copied docs/$guide"
  fi
done

# Sync agents
echo ""
echo "🤖 Syncing agents..."
rsync -av --ignore-existing "$TEMPLATE_PATH/.claude/agents/" .claude/agents/ 2>/dev/null || echo "  (no agents to sync)"

# Sync skills
echo ""
echo "🛠️  Syncing skills..."
rsync -av --ignore-existing "$TEMPLATE_PATH/.claude/skills/" .claude/skills/ 2>/dev/null || echo "  (no skills to sync)"

# Sync subagents
echo ""
echo "👥 Syncing subagents..."
rsync -av --ignore-existing "$TEMPLATE_PATH/.claude/subagents/" .claude/subagents/ 2>/dev/null || echo "  (no subagents to sync)"

# Show what changed
echo ""
echo "📊 Changes:"
git status --short

NEW_FILES=$(git status --short | wc -l | tr -d ' ')

if [[ "$NEW_FILES" -eq "0" ]]; then
  echo ""
  echo "✅ No new files to sync - project is up to date!"
  echo "🗑️  Removing backup branch: $BACKUP_BRANCH"
  git branch -D "$BACKUP_BRANCH"
else
  echo ""
  echo "✅ Sync complete! Found $NEW_FILES new files."
  echo ""
  echo "Next steps:"
  echo "  📝 Review changes: git diff"
  echo "  🧪 Test build: pnpm tsc --noEmit && pnpm build"
  echo "  💾 Commit: git add . && git commit -m 'chore: sync from template'"
  echo "  🔙 Rollback: git reset --hard HEAD && git checkout - && git branch -D $BACKUP_BRANCH"
fi
