#!/bin/bash
# Install CLI tools without requiring sudo (user-local installation)
set -e

# Only run in remote cloud environments
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  echo "Skipping CLI tool installation (local environment)"
  exit 0
fi

echo "🔧 Installing CLI tools for cloud environment..."

# Setup local bin directory
mkdir -p "$HOME/.local/bin"
export PATH="$HOME/.local/bin:$PATH"

# Setup pnpm for global installs (user-local)
echo "📦 Configuring pnpm for global installs..."
pnpm setup > /dev/null 2>&1 || true

# Set pnpm environment variables
export PNPM_HOME="$HOME/.local/share/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Install GitHub CLI (gh) - Binary download method (no sudo required)
if ! command_exists gh; then
  echo "📦 Installing GitHub CLI (gh)..."
  GH_VERSION="2.62.0"
  GH_ARCH="linux_amd64"
  GH_TAR="gh_${GH_VERSION}_${GH_ARCH}.tar.gz"

  cd /tmp
  curl -fsSL "https://github.com/cli/cli/releases/download/v${GH_VERSION}/${GH_TAR}" -o "${GH_TAR}"
  tar -xzf "${GH_TAR}"
  cp "gh_${GH_VERSION}_${GH_ARCH}/bin/gh" "$HOME/.local/bin/"
  chmod +x "$HOME/.local/bin/gh"
  rm -rf "gh_${GH_VERSION}_${GH_ARCH}" "${GH_TAR}"
  cd - > /dev/null
  echo "✅ GitHub CLI installed to ~/.local/bin/gh"
else
  echo "✓ GitHub CLI already installed ($(gh --version | head -n1))"
fi

# Install Vercel CLI via pnpm (user-local)
if ! command_exists vercel; then
  echo "📦 Installing Vercel CLI..."
  pnpm add -g vercel 2>&1 | grep -v "ERR_PNPM" || true
  # Reload PATH to pick up newly installed CLI
  export PATH="$PNPM_HOME:$PATH"
  if command_exists vercel; then
    echo "✅ Vercel CLI installed"
  else
    echo "⚠️  Vercel CLI installation had issues (may need pnpm setup)"
  fi
else
  echo "✓ Vercel CLI already installed ($(vercel --version))"
fi

# Install Neon CLI via pnpm (user-local)
if ! command_exists neonctl; then
  echo "📦 Installing Neon CLI..."
  pnpm add -g neonctl 2>&1 | grep -v "ERR_PNPM" || true
  # Reload PATH to pick up newly installed CLI
  export PATH="$PNPM_HOME:$PATH"
  if command_exists neonctl; then
    echo "✅ Neon CLI installed"
  else
    echo "⚠️  Neon CLI installation had issues (may need pnpm setup)"
  fi
else
  echo "✓ Neon CLI already installed ($(neonctl --version 2>/dev/null || echo 'version unknown'))"
fi

# Install PostHog CLI via pnpm (user-local)
if ! command_exists posthog-cli; then
  echo "📦 Installing PostHog CLI..."
  pnpm add -g @posthog/cli 2>&1 | grep -v "ERR_PNPM" || true
  # Reload PATH to pick up newly installed CLI
  export PATH="$PNPM_HOME:$PATH"
  if command_exists posthog-cli; then
    echo "✅ PostHog CLI installed"
  else
    echo "⚠️  PostHog CLI installation had issues"
  fi
else
  echo "✓ PostHog CLI already installed ($(posthog-cli --version 2>/dev/null || echo 'version unknown'))"
fi

# Install Upstash CLI via npm (user-local)
if ! command_exists upstash; then
  echo "📦 Installing Upstash CLI..."
  npm install -g @upstash/cli 2>&1 | grep -v "npm WARN" || true
  # Reload PATH to pick up newly installed CLI
  export PATH="$PNPM_HOME:$PATH"
  if command_exists upstash; then
    echo "✅ Upstash CLI installed"
  else
    echo "⚠️  Upstash CLI installation had issues"
  fi
else
  echo "✓ Upstash CLI already installed ($(upstash --version 2>/dev/null || echo 'version unknown'))"
fi

# Persist PATH updates to shell profile (if not already there)
if [ -f "$HOME/.bashrc" ]; then
  if ! grep -q 'HOME/.local/bin' "$HOME/.bashrc" 2>/dev/null; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
  fi
fi

# Pull environment variables from Vercel (if Vercel CLI is available)
if command_exists vercel; then
  echo ""
  echo "🔐 Pulling environment variables from Vercel..."
  if vercel env pull --environment=preview 2>&1; then
    echo "✅ Environment variables pulled successfully"
  else
    echo "⚠️  Could not pull environment variables (may need to run 'vercel login' first)"
  fi
fi

# Generate ZenStack and Prisma files (required for development)
echo ""
echo "🔧 Generating ZenStack and Prisma files..."
if command_exists pnpm; then
  if pnpm zenstack generate && pnpm prisma generate 2>&1; then
    echo "✅ ZenStack and Prisma files generated successfully"
  else
    echo "⚠️  Code generation failed (may need to run manually after dependencies are installed)"
  fi
else
  echo "⚠️  pnpm not found, skipping code generation"
fi

echo ""
echo "✅ CLI tools installation complete!"
echo ""
echo "Available CLIs:"
command_exists gh && echo "  • gh (GitHub): $(gh --version | head -n1)" || echo "  ✗ gh (GitHub): not available"
command_exists vercel && echo "  • vercel: $(vercel --version)" || echo "  ✗ vercel: not available"
command_exists neonctl && echo "  • neonctl (Neon): $(neonctl --version 2>/dev/null || echo 'installed')" || echo "  ✗ neonctl (Neon): not available"
command_exists posthog-cli && echo "  • posthog-cli (PostHog): $(posthog-cli --version 2>/dev/null || echo 'installed')" || echo "  ✗ posthog-cli (PostHog): not available"
command_exists upstash && echo "  • upstash (Upstash): $(upstash --version 2>/dev/null || echo 'installed')" || echo "  ✗ upstash (Upstash): not available"
echo ""
echo "Note: CLIs installed to user directories (~/.local/bin, pnpm global, npm global)"
if [ -n "$PNPM_HOME" ]; then
  echo "PNPM_HOME: $PNPM_HOME"
fi
echo ""

exit 0
