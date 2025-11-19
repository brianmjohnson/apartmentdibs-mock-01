---
name: vercel-monitor
description: Monitor and interact with Vercel deployments, build logs, and environment details using the Vercel CLI. Use this to check build status, wait for deployments, view logs, and debug CI/CD failures.
allowed-tools: Bash, Read
---

# Vercel Monitor Skill

Monitor and interact with Vercel deployments, build logs, and environment details using the Vercel CLI.

## When to Use

- After pushing code to check deployment status
- Debugging CI/CD build failures
- Waiting for preview deployments to complete
- Inspecting build logs and errors
- Verifying deployment configuration

## Prerequisites

Ensure Vercel CLI is installed and authenticated:

```bash
# Check if installed
which vercel

# Install if needed
pnpm add -g vercel

# Login if needed
vercel login
```

## Core Commands

### List Recent Deployments

Find the most recent preview builds:

```bash
vercel ls --status BUILDING,ERROR,READY --environment preview
```

**Output example**:
```
  Age     Deployment                                                           Status      Environment     Duration     Username
  2h      https://apartmentdibs-mock-01-55pbsys1k-apartmentdibs.vercel.app     ● Ready     Preview         1m           brianmjohnson
  2h      https://apartmentdibs-mock-01-cesjjw73c-apartmentdibs.vercel.app     ● Error     Preview         51s          brianmjohnson
```

**Filter options**:
- `--status BUILDING` - Only show in-progress builds
- `--status ERROR` - Only show failed builds
- `--status READY` - Only show successful builds
- `--status BUILDING,ERROR,READY` - Show all statuses
- `--environment preview` - Preview deployments only
- `--environment production` - Production deployments only

### Wait for Build to Complete

Wait up to 10 minutes for a deployment to finish:

```bash
vercel inspect <url|deploymentId> --wait --timeout 600s
```

**Example**:
```bash
vercel inspect https://apartmentdibs-mock-01-55pbsys1k-apartmentdibs.vercel.app --wait --timeout 600s
```

Use this to:
- Wait for a deployment after `git push`
- Block until build completes before running tests
- Get immediate feedback on build status

### View Build Logs

Get detailed build logs for debugging:

```bash
vercel inspect <url|deploymentId> --logs
```

**Example**:
```bash
vercel inspect https://apartmentdibs-mock-01-cesjjw73c-apartmentdibs.vercel.app --logs
```

Look for:
- TypeScript errors
- Build failures
- Missing environment variables
- Dependency issues

### Inspect Deployment Details

Get comprehensive deployment information:

```bash
vercel inspect <url>
```

**Example output**:
```
> Fetched deployment "apartmentdibs-mock-01-55pbsys1k-apartmentdibs.vercel.app" [295ms]

  General

    id          dpl_Haksnq9pV9JsxWHu8MuVXB8NKALN
    name        apartmentdibs-mock-01
    target      preview
    status      ● Ready
    url         https://apartmentdibs-mock-01-55pbsys1k-apartmentdibs.vercel.app
    created     Tue Nov 18 2025 18:34:23 GMT-0800 [2h ago]

  Aliases

    ╶ https://apartmentdibs-mock-01-git-claude-build-web-1ecfd4-apartmentdibs.vercel.app

  Builds

    ┌ .        [0ms]
    ├── λ admin/support/[ticketId] (939.95KB) [iad1]
    ├── λ admin/users/[userId] (939.95KB) [iad1]
    └── 757 output items hidden
```

### Pull Environment Variables

Get environment variables from Vercel:

```bash
vercel env pull --environment=preview
```

This downloads `.env.local` with all preview environment variables.

### List Environment Variables

View configured environment variables:

```bash
vercel env ls
```

## Common Workflows

### Monitor After Push

After pushing code, monitor the deployment:

```bash
# 1. List recent deployments to find yours
vercel ls --status BUILDING,ERROR,READY --environment preview

# 2. Wait for it to complete (grab URL from step 1)
vercel inspect <deployment-url> --wait --timeout 600s

# 3. If failed, check logs
vercel inspect <deployment-url> --logs
```

### Debug Failed Build

When a build fails:

```bash
# 1. Find the failed deployment
vercel ls --status ERROR --environment preview

# 2. Get detailed logs
vercel inspect <failed-url> --logs

# 3. Look for specific errors
vercel inspect <failed-url> --logs | grep -i error

# 4. Get full details
vercel inspect <failed-url>
```

### Verify Before Merge

Before merging a PR, verify the preview deployment:

```bash
# 1. Check deployment status
vercel ls --environment preview

# 2. Get preview URL
vercel inspect <deployment-url>

# 3. Aliases section shows the branch preview URL
# Test at that URL before merging
```

### Wait and Validate Workflow

Complete workflow for CI/CD monitoring:

```bash
# After git push...

# Wait for deployment
URL=$(vercel ls --environment preview | head -1 | awk '{print $2}')
vercel inspect $URL --wait --timeout 600s

# Check if successful
STATUS=$(vercel inspect $URL 2>&1 | grep "status" | awk '{print $2}')
if [ "$STATUS" = "Ready" ]; then
    echo "Deployment successful!"
    vercel inspect $URL
else
    echo "Deployment failed!"
    vercel inspect $URL --logs
fi
```

## Error Patterns to Look For

### TypeScript Errors

```bash
vercel inspect <url> --logs | grep "error TS"
```

### Missing Environment Variables

```bash
vercel inspect <url> --logs | grep -i "env\|environment\|undefined"
```

### Build Failures

```bash
vercel inspect <url> --logs | grep -i "error\|failed\|exit code"
```

### Dependency Issues

```bash
vercel inspect <url> --logs | grep -i "npm\|pnpm\|yarn\|module\|package"
```

## Reproducing CI/CD Issues Locally

If the Vercel build fails but local builds succeed:

```bash
# Run the exact same build command Vercel uses
vercel build

# This runs:
# - zenstack generate
# - prisma generate
# - next build
# - prisma migrate deploy
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `vercel ls --environment preview` | List preview deployments |
| `vercel ls --status ERROR` | List failed deployments |
| `vercel inspect <url>` | Get deployment details |
| `vercel inspect <url> --logs` | View build logs |
| `vercel inspect <url> --wait` | Wait for completion |
| `vercel env pull` | Download env variables |
| `vercel env ls` | List env variables |
| `vercel build` | Run build locally |

## Important Notes

- Always use `--environment preview` for feature branch deployments
- Build logs are essential for debugging failures
- `--wait` timeout is in seconds (600s = 10 minutes)
- Use `vercel build` locally to reproduce CI/CD issues
- Preview URLs follow pattern: `project-git-branch-team.vercel.app`
