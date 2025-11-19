---
name: run-server
description: Start and stop the local development server using vercel dev. Logs output to .logs/vercel-dev.log for monitoring. Use this when you need to test the application locally.
allowed-tools: Bash, Read, BashOutput, KillShell
---

# Run Server Skill

Start and stop the local development server using `vercel dev` with proper logging.

## When to Use

- Testing application locally
- Debugging features during development
- Running E2E tests that require a running server
- Verifying changes before push

## Server Management

### Start the Server

Use the start script to launch `vercel dev` in the background:

```bash
./scripts/run-server/start-server.sh
```

This will:
- Start `vercel dev` on http://localhost:3000
- Run in background mode
- Log output to `.logs/vercel-dev.log`
- Display the process ID for reference

### Check Server Status

View live logs:

```bash
tail -f .logs/vercel-dev.log
```

Check if server is running:

```bash
lsof -i:3000
```

### Stop the Server

Use the stop script to kill the server:

```bash
./scripts/run-server/stop-server.sh
```

This will:
- Find the process running on port 3000
- Terminate it gracefully (SIGTERM)
- Fall back to force kill (SIGKILL) if needed
- Clean up any child processes

## Manual Commands

### Quick Start (inline)

```bash
mkdir -p .logs
nohup vercel dev > .logs/vercel-dev.log 2>&1 &
echo "Server started on http://localhost:3000 (PID: $!)"
```

### Quick Stop (inline)

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No server running on port 3000"
```

### View Logs

```bash
# Last 100 lines
tail -100 .logs/vercel-dev.log

# Follow live
tail -f .logs/vercel-dev.log

# Search for errors
grep -i error .logs/vercel-dev.log
```

## Log Location

**Log file**: `.logs/vercel-dev.log`

This location is:
- Well-known for automation tools
- Gitignored (add `.logs/` to `.gitignore` if not already)
- Easy to tail and search

## Troubleshooting

### Port Already in Use

```bash
# Find what's using port 3000
lsof -i:3000

# Kill it
lsof -ti:3000 | xargs kill -9
```

### Server Won't Start

1. Check if Vercel CLI is installed: `which vercel`
2. Check for port conflicts: `lsof -i:3000`
3. Review logs: `tail -50 .logs/vercel-dev.log`

### Server Crashes

1. Check logs for errors: `grep -i error .logs/vercel-dev.log`
2. Verify environment variables are set
3. Run `vercel dev` directly (foreground) to see immediate errors

## Integration with Testing

When running E2E tests, start the server first:

```bash
# Start server
./scripts/run-server/start-server.sh

# Wait for server to be ready
sleep 5

# Run tests
pnpm test:e2e

# Stop server
./scripts/run-server/stop-server.sh
```

## Important Notes

- Server runs in background by default
- Always check `.logs/vercel-dev.log` for errors
- Stop the server when done to free port 3000
- The log file is overwritten on each start
