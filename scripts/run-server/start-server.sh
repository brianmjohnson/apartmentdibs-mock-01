#!/bin/bash
# Start the development server using vercel dev
# Logs output to .logs/vercel-dev.log
set -e

# Configuration
PORT=3000
LOG_DIR=".logs"
LOG_FILE="$LOG_DIR/vercel-dev.log"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Starting development server..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Error: Vercel CLI is not installed${NC}"
    echo "Install with: pnpm add -g vercel"
    exit 1
fi

# Check if port is already in use
if lsof -i:$PORT &> /dev/null; then
    echo -e "${YELLOW}Warning: Port $PORT is already in use${NC}"
    echo "Current process:"
    lsof -i:$PORT
    echo ""
    read -p "Kill existing process and continue? (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
        sleep 1
    else
        echo "Aborted. Stop the existing server first."
        exit 1
    fi
fi

# Create log directory
mkdir -p "$LOG_DIR"

# Start vercel dev in background
echo "Starting vercel dev..."
nohup vercel dev --listen $PORT > "$LOG_FILE" 2>&1 &
PID=$!

# Save PID to file for later reference
echo $PID > "$LOG_DIR/vercel-dev.pid"

# Wait a moment for server to start
sleep 3

# Check if process is still running
if ps -p $PID > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server started successfully!${NC}"
    echo ""
    echo "  URL:     http://localhost:$PORT"
    echo "  PID:     $PID"
    echo "  Logs:    $LOG_FILE"
    echo ""
    echo "Commands:"
    echo "  View logs:    tail -f $LOG_FILE"
    echo "  Stop server:  ./scripts/run-server/stop-server.sh"
    echo ""

    # Show first few lines of output
    echo "Initial output:"
    echo "---------------"
    head -20 "$LOG_FILE" 2>/dev/null || echo "(waiting for output...)"
else
    echo -e "${RED}❌ Server failed to start${NC}"
    echo ""
    echo "Check logs for errors:"
    cat "$LOG_FILE"
    exit 1
fi
