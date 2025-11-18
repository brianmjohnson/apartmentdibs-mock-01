#!/bin/bash
# Review configuration file differences between template and project
# Usage: ./review-config-updates.sh [template_path]

set -e

TEMPLATE_PATH="${1:-../projects_template}"
PROJECT_PATH="$(pwd)"

echo "🔍 Reviewing configuration differences"
echo "📁 Template: $TEMPLATE_PATH"
echo "📁 Project:  $PROJECT_PATH"
echo ""

# Configuration files to review
CONFIG_FILES=(
  "package.json"
  "tsconfig.json"
  "next.config.ts"
  "tailwind.config.ts"
  "vercel.json"
  ".env.example"
  "eslint.config.mjs"
  ".prettierrc"
  "CLAUDE.md"
)

HAS_DIFF=0

for file in "${CONFIG_FILES[@]}"; do
  if [[ -f "$TEMPLATE_PATH/$file" ]] && [[ -f "$file" ]]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📄 $file"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if diff -u "$file" "$TEMPLATE_PATH/$file" > /dev/null 2>&1; then
      echo "  ✅ No differences"
    else
      HAS_DIFF=1
      echo "  ⚠️  Differences found:"
      echo ""
      diff -u "$file" "$TEMPLATE_PATH/$file" || true
    fi
    echo ""
  elif [[ -f "$TEMPLATE_PATH/$file" ]] && [[ ! -f "$file" ]]; then
    HAS_DIFF=1
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📄 $file"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  ⚠️  Missing in project (exists in template)"
    echo "  💡 Run: cp $TEMPLATE_PATH/$file $file"
    echo ""
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ "$HAS_DIFF" -eq "0" ]]; then
  echo "✅ All configuration files match template"
else
  echo "⚠️  Configuration differences found"
  echo ""
  echo "Next steps:"
  echo "  1. Review differences above"
  echo "  2. Manually apply desired changes"
  echo "  3. Test: pnpm tsc --noEmit && pnpm build"
  echo "  4. Commit: git add . && git commit -m 'chore: update config from template'"
fi
