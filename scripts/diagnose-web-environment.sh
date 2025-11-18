#!/bin/bash

# diagnose-web-environment.sh
# Validates development environment for Next.js project

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Symbols
CHECK="✅"
CROSS="❌"
WARNING="⚠️"

echo ""
echo "================================================"
echo "  Development Environment Diagnostic Tool"
echo "================================================"
echo ""

# Track if any checks failed
FAILED=0

# Function to print success
success() {
    echo -e "${GREEN}${CHECK}${NC} $1"
}

# Function to print failure
fail() {
    echo -e "${RED}${CROSS}${NC} $1"
    FAILED=1
}

# Function to print warning
warn() {
    echo -e "${YELLOW}${WARNING}${NC} $1"
}

# 1. Check Node.js version (>=20)
echo "Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 20 ]; then
        success "Node.js version $(node -v) (>= 20 required)"
    else
        fail "Node.js version $(node -v) is too old (>= 20 required)"
    fi
else
    fail "Node.js is not installed"
fi
echo ""

# 2. Check pnpm installed
echo "Checking pnpm installation..."
if command -v pnpm &> /dev/null; then
    success "pnpm version $(pnpm -v) is installed"
else
    fail "pnpm is not installed. Install with: npm install -g pnpm"
fi
echo ""

# 3. Check if .env.local exists
echo "Checking environment configuration..."
if [ -f ".env.local" ]; then
    success ".env.local file exists"
elif [ -f ".env.example" ]; then
    warn ".env.local not found, but .env.example exists"
    echo "   Creating .env.local from .env.example..."
    cp .env.example .env.local
    success ".env.local created from .env.example"
    warn "Please update .env.local with your actual values"
else
    fail ".env.local and .env.example not found"
fi
echo ""

# 4. Check required environment variables
echo "Checking required environment variables..."
if [ -f ".env.local" ]; then
    # Source the .env.local file
    export $(grep -v '^#' .env.local | xargs -0)

    # Check DATABASE_URL
    if [ ! -z "$DATABASE_URL" ]; then
        success "DATABASE_URL is set"
    else
        fail "DATABASE_URL is not set in .env.local"
    fi

    # Check NEXTAUTH_SECRET or BETTER_AUTH_SECRET
    if [ ! -z "$NEXTAUTH_SECRET" ] || [ ! -z "$BETTER_AUTH_SECRET" ]; then
        success "Auth secret is set"
    else
        fail "NEXTAUTH_SECRET or BETTER_AUTH_SECRET is not set in .env.local"
    fi
else
    warn "Skipping environment variable check (.env.local not found)"
fi
echo ""

# 5. Check database connection
echo "Checking database connection..."
if command -v pnpm &> /dev/null && [ -f "package.json" ]; then
    # Check if prisma is in dependencies
    if grep -q "prisma" package.json; then
        # Try to connect to database
        if pnpm prisma db pull --force --schema=./prisma/schema.prisma &> /dev/null; then
            success "Database connection successful"
        else
            warn "Database connection failed or not configured yet"
            echo "   This is normal for new projects. Set DATABASE_URL in .env.local"
        fi
    else
        warn "Prisma not found in package.json, skipping database check"
    fi
else
    warn "Skipping database check (pnpm or package.json not found)"
fi
echo ""

# 6. Check if packages are installed
echo "Checking package installation..."
if [ -d "node_modules" ]; then
    success "node_modules directory exists"

    # Check if it's not empty
    if [ "$(ls -A node_modules)" ]; then
        success "Packages appear to be installed"
    else
        fail "node_modules is empty. Run: pnpm install"
    fi
else
    fail "node_modules not found. Run: pnpm install"
fi
echo ""

# Final summary
echo "================================================"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}${CHECK} All checks passed!${NC}"
    echo ""
    echo "You're ready to start development:"
    echo "  pnpm dev              # Start development server"
    echo "  pnpm gen:check        # Generate Prisma + tRPC code"
    echo "  pnpm lint             # Run linter"
    echo "  pnpm test             # Run tests"
else
    echo -e "${RED}${CROSS} Some checks failed${NC}"
    echo ""
    echo "Please fix the issues above before continuing."
    echo "See docs/GETTING_STARTED.md for detailed setup instructions."
fi
echo "================================================"
echo ""

exit $FAILED
