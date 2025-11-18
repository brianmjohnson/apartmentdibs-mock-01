#!/bin/bash
# Sync only documentation from projects_template (safest operation)
# Usage: ./sync-docs-only.sh [template_path]

set -e

TEMPLATE_PATH="${1:-../projects_template}"
PROJECT_PATH="$(pwd)"

echo "📚 Syncing documentation from template: $TEMPLATE_PATH"

# Ensure template path exists
if [[ ! -d "$TEMPLATE_PATH" ]]; then
  echo "❌ Error: Template path not found: $TEMPLATE_PATH"
  exit 1
fi

# Create docs directories if they don't exist
mkdir -p docs/adr
mkdir -p docs/domains
mkdir -p docs/testing

# Sync ADRs
echo "📝 Syncing ADRs..."
rsync -av --ignore-existing "$TEMPLATE_PATH/docs/adr/" docs/adr/

# Sync domain guides
echo "🏢 Syncing domain guides..."
rsync -av --ignore-existing "$TEMPLATE_PATH/docs/domains/" docs/domains/

# Sync testing documentation
echo "🧪 Syncing testing docs..."
rsync -av --ignore-existing "$TEMPLATE_PATH/docs/testing/" docs/testing/ 2>/dev/null || echo "  (no testing docs in template)"

# Show what changed
NEW_FILES=$(git status --short | grep "^??" | wc -l | tr -d ' ')

if [[ "$NEW_FILES" -eq "0" ]]; then
  echo ""
  echo "✅ No new documentation files - already up to date!"
else
  echo ""
  echo "✅ Found $NEW_FILES new documentation files"
  echo ""
  git status --short | grep "^??"
  echo ""
  echo "Next steps:"
  echo "  📝 Review: git diff"
  echo "  💾 Commit: git add docs/ && git commit -m 'docs: sync from template'"
fi
