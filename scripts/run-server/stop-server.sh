#!/bin/bash
# Stop the development server running on port 3000
set -e

# Configuration
PORT=3000
LOG_DIR=".logs"
PID_FILE="$LOG_DIR/vercel-dev.pid"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🛑 Stopping development server..."

# Function to kill process on port
kill_by_port() {
    local pids=$(lsof -ti:$PORT 2>/dev/null)
    if [ -n "$pids" ]; then
        echo "Found process(es) on port $PORT: $pids"

        # Try graceful shutdown first (SIGTERM)
        echo "Sending SIGTERM..."
        echo "$pids" | xargs kill -15 2>/dev/null || true
        sleep 2

        # Check if still running
        local remaining=$(lsof -ti:$PORT 2>/dev/null)
        if [ -n "$remaining" ]; then
            echo "Process still running, sending SIGKILL..."
            echo "$remaining" | xargs kill -9 2>/dev/null || true
            sleep 1
        fi

        return 0
    fi
    return 1
}

# Function to kill by PID file
kill_by_pid_file() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p $pid > /dev/null 2>&1; then
            echo "Found PID from file: $pid"
            kill -15 $pid 2>/dev/null || true
            sleep 2

            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                kill -9 $pid 2>/dev/null || true
            fi
        fi
        rm -f "$PID_FILE"
        return 0
    fi
    return 1
}

# Try to stop the server
stopped=false

# Method 1: Kill by port (most reliable)
if kill_by_port; then
    stopped=true
fi

# Method 2: Kill by PID file
kill_by_pid_file

# Verify server is stopped
sleep 1
if lsof -i:$PORT &> /dev/null; then
    echo -e "${RED}❌ Failed to stop server on port $PORT${NC}"
    echo "Processes still running:"
    lsof -i:$PORT
    echo ""
    echo "Try manual kill: lsof -ti:$PORT | xargs kill -9"
    exit 1
fi

if [ "$stopped" = true ]; then
    echo -e "${GREEN}✅ Server stopped successfully${NC}"
    echo "Port $PORT is now free"
else
    echo -e "${YELLOW}No server was running on port $PORT${NC}"
fi

# Clean up PID file
rm -f "$PID_FILE" 2>/dev/null || true
