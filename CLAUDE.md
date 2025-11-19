# Project Claude Code Instructions

**Project Type**: Next.js Full-Stack Application
**Purpose**: Quick reference hub - detailed instructions are in `docs/` folder

## Tech Stack Summary

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript 5.9+
- **Database**: PostgreSQL (Neon) with Prisma 6+
- **API Layer**: tRPC v11 + TanStack Query v5
- **Schema**: ZenStack 2.19+ (access control + code generation)
- **Auth**: Better Auth 1.3+ (OAuth + Organizations)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Testing**: Jest (unit) + Playwright (E2E)
- **Deployment**: Vercel with Vercel Blob storage

## Quick Commands

```bash
pnpm dev              # Start development server
pnpm build            # Type-check and build
pnpm gen:check        # ZenStack + Prisma generation
pnpm lint             # Auto-fix formatting and linting
pnpm test             # Run all tests
pnpm diagnose         # Validate development environment
pnpm hitl:resume      # Process HITL batch approvals
```

## Project Philosophy

**Core Principle**: **Agentic First** - Hire Agents First, Then People

All development follows an autonomous agent-driven approach with human governance through HITL gates. Agents handle routine decisions and execution while humans provide strategic oversight.

**See**: `docs/PHILOSOPHY.md` for complete principles

---

## 🚨 CRITICAL: Agent Usage Policy

**MANDATORY RULE**: When an agent, skill, ADR workflow, or subagent exists for a task, you **MUST** use it. Do NOT bypass by thinking "this is simple enough to do directly."

### Before Starting ANY Task

1. **Check for agents**: `.claude/agents/` - Task-specific workflows
2. **Check for skills**: `.claude/skills/` - Reusable patterns with scripts
3. **Check for ADRs**: `docs/adr/` - Architectural decision workflows
4. **Check for agent roles**: `.claude/agents/` - Domain specialists

**If any exist → Use them. NO EXCEPTIONS.**

### User Override is ABSOLUTE

If the user says **"Use the [name] agent"** → You MUST use it.

Do NOT respond with:
- ❌ "That agent is for more complex tasks"
- ❌ "I can handle this directly"
- ❌ "This is too simple for the workflow"

**The user knows the architecture. Follow their direction.**

### Anti-Patterns (DO NOT DO THIS)

❌ "This is a simple dependency update, I'll just run `pnpm add`"
✅ **CORRECT**: Use ADR-012 automated dependency workflow

❌ "This is just a quick PR comment, I'll use `gh api`"
✅ **CORRECT**: Use github-pr-comment-processor agent

❌ "This is straightforward deployment check"
✅ **CORRECT**: Use deployment-monitoring-agent

❌ "This is simple template sync, I'll use rsync"
✅ **CORRECT**: Use template-sync-workflow skill + scripts

### Self-Check Prompt

Ask yourself: **"Am I thinking this is simple?"**

If YES → That's a **WARNING SIGN**, not permission to skip the agent.

**See**: `CLAUDE_HOME.md` for complete global agent usage policy (copy to `~/.claude/CLAUDE.md`)

---

## Development Workflow

**Complete process**: See `docs/WORKFLOW_GUIDE.md`

**Summary**:
1. Business Plan (README.md) → Create/update
2. User Stories → Generate in `docs/user-stories/` → **HITL Review**
3. Architecture (ADRs) → Create in `docs/adr/` → **HITL Review**
4. Technical Specs → Design contracts → **HITL Review**
5. Implementation → Parallel FE + BE development
6. Quality Review → Testing + validation → **HITL Review** (if issues)
7. Session Summary → Auto-generate `docs/sessions/session-<date>.md`

**HITL Process**: See `docs/HITL_GUIDE.md`
**Agent Coordination**: See `.claude/agents/README.md`
**Agent Hiring**: See `docs/AGENT_HIRING_CHECKLIST.md`
**SDLC Details**: See `docs/SDLC.md`

## HITL Checkpoints (4 Gates)

Human review required at these stages:
1. **After user story creation** → Batch review all stories
2. **After ADR creation/updates** → Approve DRAFT ADRs
3. **Before implementation** → Approve technical specifications
4. **After QA finds issues** → Decide: fix, refine story, or defer

**Location**: `docs/hitl/` with batch review files
**Resume**: Run `pnpm hitl:resume` after approvals

## Architecture Decisions

**Process**: See `docs/adr/README.md`
**Template**: `docs/adr/template.md`
**Statuses**: DRAFT → APPROVED → DEPRECATED → SUPERSEDED

Create ADR for:
- Technology choices (libraries, frameworks)
- Data modeling decisions
- Authentication/authorization approaches
- API design patterns
- Deployment strategies

## Code Generation (ZenStack)

**Schema Location**: `./schema.zmodel` (imports from `zschema/`)
**Structure**:
- `zschema/base.zmodel` - Abstract base models
- `zschema/config.zmodel` - Non-user models
- `zschema/auth.zmodel` - User + all user FK models

**After schema changes**:
```bash
pnpm gen:check  # Regenerates Prisma + tRPC + TanStack Query hooks
```

**Generated Files**:
- `prisma/schema.prisma` - Prisma schema
- `server/routers/generated/trpc/` - tRPC routers
- `lib/hooks/generated/tanstack-query/` - React hooks
- `lib/generated/schema/zod/` - Zod validation schemas

**Important**: Use ZenStack-generated tRPC routes. Only create custom routes when absolutely necessary.

## Research-First Development

Before implementing any feature:
1. **Search codebase**: `docs/`, existing code, configuration
2. **Web search**: Official docs, getting started guides, tutorials
3. **Check for existing solutions**: Never duplicate functionality
4. **Login-gated docs?** → Create HITL file in `docs/hitl/`

**Anti-hallucination checklist**:
- ✅ Searched for official documentation
- ✅ Checked codebase for existing implementation
- ✅ Verified API/library exists and is current
- ✅ Found working examples or starter projects

## Session Summaries

**Auto-generated when**:
- You say "batch complete"
- You say "summarize this work"
- You say "create session summary"

**Output**: `docs/sessions/session-YYYY-MM-DD.md`
**Format**: See `docs/sessions/template.md`
**Manual trigger**: `pnpm session:summary`

## AI Agents

**19 Specialized Agents** - See `docs/AGENT_HIRING_CHECKLIST.md` for complete list

### Product Development Agents (`.claude/agents/`)
- `architecture-agent.md` - ADR creation and review
- `product-manager.md` - User stories with RICE scoring
- `frontend-developer.md` - React/Next.js components
- `backend-developer.md` - ZenStack models + tRPC routes
- `ui-designer.md` - Component specs and mockups
- `ux-researcher.md` - User research and testing
- `quality-reviewer.md` - QA testing + eval suite generation

### Business Operations Agents (`.claude/agents/`)
- `market-analyst.md` - Competitive intelligence + market research
- `experimentation-agent.md` - A/B testing + PostHog experiments
- `data-engineer.md` - Data pipelines + ETL + warehouse design
- `data-scientist.md` - Statistical analysis + ML models + predictive analytics
- `compliance-agent.md` - GDPR/CCPA/SOC2 compliance
- `unit-economics-agent.md` - LTV/CAC modeling + financial metrics
- `observability-agent.md` - Logging + audit trails + monitoring
- `support-triage-agent.md` - FAQ + troubleshooting + escalation
- `operations-excellence-agent.md` - PR feedback processing + retrospective improvements

### Task-Specific Agents (`.claude/agents/`)
- `pr-finalization-agent.md` - PR workflow automation + migration rollback
- `github-integration-agent.md` - Issue/PR synchronization
- `session-summary-agent.md` - Generate session documentation

**Coordination**: See `.claude/agents/README.md`
**Philosophy**: See `docs/PHILOSOPHY.md` (Agentic First approach)

## Environment Setup

**Configuration**: `.env.example` (vendor-prefixed variables)
**Validation**: Run `./scripts/diagnose-web-environment.sh`
**Bootstrap**: See `docs/GETTING_STARTED.md`

**Required Environment Variables** (for local testing via web automation):
- `NEON_DATABASE_URL` - Postgres connection URL (pooled)
- `NEON_DATABASE_URL_UNPOOLED` - Postgres direct connection URL
- `UPSTASH_KV_URL` - Redis/KV store URL
- `VERCEL_BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token

**Cloud Environment** (Claude Code on the web):
- **SessionStart Hook**: `.claude/settings.json` - Auto-installs CLI tools in cloud sessions
- **CLI Tools Installed**: GitHub CLI (gh), Vercel CLI, Neon CLI, PostHog CLI, Upstash CLI
- **Script**: `scripts/install-cli-tools.sh` (only runs in `CLAUDE_CODE_REMOTE=true`)
- **Env Pull**: Automatically runs `vercel env pull --environment=preview` to setup environment variables

## Testing Requirements

**Unit Tests**: Jest - minimum 80% coverage for business logic
**E2E Tests**: Playwright - all critical user flows
**Validation**: All tests must pass before PR merge

See `docs/testing/README.md` for testing strategies.

## Deployment

**Platform**: Vercel
**Database**: Neon PostgreSQL (automatic branching)
**Storage**: Vercel Blob
**Crons**: Defined in `vercel.json`

See `docs/DEPLOYMENT.md` for CI/CD pipeline.

## Need Help?

- **Getting Started**: `docs/GETTING_STARTED.md`
- **Full Workflow**: `docs/WORKFLOW_GUIDE.md`
- **HITL Process**: `docs/HITL_GUIDE.md`
- **Architecture**: `docs/ARCHITECTURE.md`
- **SDLC**: `docs/SDLC.md`
