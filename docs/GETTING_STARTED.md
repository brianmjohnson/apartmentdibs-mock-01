# Getting Started with the Next.js Project Template

Complete guide to bootstrapping a new project from this template.

## Prerequisites

### Required Software

- **Node.js**: 20.x or later
- **pnpm**: 9.x or later (`npm install -g pnpm`)
- **Git**: Latest version
- **PostgreSQL**: Local instance or Neon account
- **Code Editor**: VS Code recommended

### Required Accounts

- **GitHub**: For repository hosting
- **Vercel**: For deployment (free tier works)
- **Neon**: For PostgreSQL database (free tier available)
- **Better Auth OAuth Apps**: Google, GitHub, Discord, etc.

### Recommended Tools

- **Claude Code CLI**: For autonomous development
- **GitHub CLI**: `gh` for GitHub integration
- **Docker**: For local service containers (optional)

### Claude Code Web Environment

If using **Claude Code on the web** (https://claude.com/code), additional environment variables are required:

**Required Environment Variables**:

- `GITHUB_TOKEN` - For GitHub CLI (`gh`) commands
  - Create at: https://github.com/settings/tokens
  - Required scopes: `repo`, `workflow`, `read:org`
  - Set in Claude Code Settings or local `.env`

- `CLAUDE_SHARE_REPO` - For share plugin (configured in `.claude/settings.json`)
  - Format: `username/repository` (e.g., `"brianmjohnson/claude-sessions"`)
  - Already configured in this template

**Optional Environment Variables**:

- `VERCEL_TOKEN` - For Vercel CLI commands
- `NEON_API_KEY` - For Neon CLI commands

**Setup Instructions**:
See "Claude Code Web Setup" section below for complete configuration.

---

## Quick Start (10 Minutes)

### 1. Clone Template

```bash
# Create new project from template
git clone https://github.com/yourusername/projects_template my-new-project
cd my-new-project

# Remove template git history
rm -rf .git
git init
git add .
git commit -m "Initial commit from template"

# Create GitHub repo and push
gh repo create my-new-project --private --source=. --remote=origin --push
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Generate secrets
openssl rand -base64 32  # For BETTER_AUTH_SECRET

# Edit .env.local with your values
# At minimum, set:
# - DATABASE_URL
# - BETTER_AUTH_SECRET
```

### 4. Set Up Database

```bash
# Generate Prisma schema from ZenStack
pnpm gen:check

# Create database tables
pnpm db:push

# Optional: Seed with sample data
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit: http://localhost:3000

---

## Detailed Setup

### Step 1: Environment Configuration

#### 1.1 Database Setup (Neon)

**Create Neon Project**:

1. Go to https://neon.tech
2. Create new project
3. Copy connection strings:
   - Pooled connection (for app)
   - Direct connection (for migrations)

**Update .env.local**:

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require&pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://user:pass@host/db?sslmode=require"
```

#### 1.2 Better Auth Setup

**Generate Secret**:

```bash
openssl rand -base64 32
```

**Add to .env.local**:

```env
BETTER_AUTH_SECRET="your-generated-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

#### 1.3 OAuth Providers (Optional)

**Google OAuth**:

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret

**Add to .env.local**:

```env
AUTH_GOOGLE_ID="your-client-id"
AUTH_GOOGLE_SECRET="your-client-secret"
```

Repeat for GitHub, Discord, etc.

### Step 2: Customize for Your Project

#### 2.1 Update README.md

Replace template README with your business plan:

- Executive summary
- Problem statement
- Solution overview
- Target market
- Success metrics

Use `README-template.md` as guide.

#### 2.2 Configure Project Details

Update `package.json`:

```json
{
  "name": "my-project-name",
  "version": "0.1.0",
  "description": "Your project description",
  "author": "Your Name",
  "repository": "github:yourusername/my-project"
}
```

Update `next.config.ts`:

- Update site URL
- Add any custom domains
- Configure redirects if needed

#### 2.3 Initialize Git Hooks (Optional)

```bash
# Install husky for git hooks
pnpm add -D husky
npx husky init

# Add pre-commit hook
echo "pnpm lint:check" > .husky/pre-commit
chmod +x .husky/pre-commit
```

### Step 3: Verify Setup

#### 3.1 Run Diagnostics

```bash
./scripts/diagnose-web-environment.sh
```

This checks:

- Environment variables set correctly
- Database connectivity
- Required tools installed
- Port availability

#### 3.2 Run Tests

```bash
pnpm test
```

All template tests should pass.

#### 3.3 Check Type Safety

```bash
pnpm build
```

Should compile without errors.

### Step 4: Deploy to Vercel

#### 4.1 Connect to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login and link project
vercel login
vercel link
```

#### 4.2 Configure Environment Variables

In Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Set for Production, Preview, and Development

#### 4.3 Deploy

```bash
vercel --prod
```

#### 4.4 Update OAuth Redirect URIs

Add production URL to OAuth app configs:

- `https://your-app.vercel.app/api/auth/callback/google`

---

## Claude Code Web Setup

### Overview

When using Claude Code on the web (https://claude.com/code), the environment runs in a remote container. You need to configure environment variables so Claude Code can authenticate with external services.

### Step 1: Set Up GitHub Token

**Create Personal Access Token**:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `Claude Code Web Access`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `read:org` (Read org and team membership)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

**Configure in Claude Code**:

1. Open Claude Code Settings (gear icon)
2. Go to "Environment Variables"
3. Add: `GITHUB_TOKEN` = `your-token-here`
4. Save settings

**Alternative**: Add to project `.env` file (NOT committed to git):

```bash
echo 'GITHUB_TOKEN=your-token-here' >> .env
```

### Step 2: Verify Configuration

The `.claude/settings.json` file is already configured with:

```json
{
  "env": {
    "CLAUDE_SHARE_REPO": "brianmjohnson/claude-sessions",
    "NODE_OPTIONS": "--max-old-space-size=10000"
  }
}
```

**Environment Variables Explained**:

- `CLAUDE_SHARE_REPO`: Repository for sharing Claude Code sessions (configure with your own)
- `NODE_OPTIONS`: Node.js memory allocation for builds
  - **Default**: 10000 MB (10GB) for ZenStack + Prisma + Next.js builds
  - **If builds take >15 minutes or crash**: Increase value (e.g., `--max-old-space-size=16000`)
  - **If builds succeed**: Keep current value, document in project setup

**To use your own share repository**:

1. Create a private GitHub repository (e.g., `your-username/claude-sessions`)
2. Update `.claude/settings.json`:
   ```json
   {
     "env": {
       "CLAUDE_SHARE_REPO": "your-username/claude-sessions",
       "NODE_OPTIONS": "--max-old-space-size=10000"
     }
   }
   ```

### Step 3: Test GitHub Integration

```bash
# Test GitHub CLI authentication
gh auth status

# Expected output:
# ✓ Logged in to github.com as yourusername
```

If not authenticated:

```bash
gh auth login
# Follow prompts to authenticate
```

### Step 4: Run Diagnostics

```bash
./scripts/diagnose-web-environment.sh
```

This checks:

- ✅ Dependencies installed (`node_modules`)
- ✅ Generated code exists (`.zenstack`, `lib/hooks/generated`)
- ✅ Git working tree clean
- ✅ Environment variables configured

**All checks should show ✅ before starting development.**

### Step 5: Project-Specific Environment Variables

Copy and configure environment template:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

- `DATABASE_URL` (from Neon)
- `BETTER_AUTH_SECRET` (generate with `openssl rand -base64 32`)
- OAuth credentials (Google, GitHub, etc.)
- Service tokens (Vercel Blob, Resend, PostHog)

**Important**: `.env.local` is gitignored and never committed.

### Common Issues

**"gh: command not found"**:

- Claude Code web auto-installs `gh` CLI on SessionStart
- Wait for session initialization to complete
- Check `.claude/settings.json` has SessionStart hook configured

**"API rate limit exceeded"**:

- Your `GITHUB_TOKEN` may be invalid or expired
- Regenerate token with correct scopes
- Update environment variable

**"Permission denied"**:

- Check token has `repo` and `workflow` scopes
- Verify token hasn't been revoked

---

## Understanding the Project Structure

### Key Directories

```
my-project/
├── .claude/                   # AI agent configurations
│   ├── agents/               # Task-specific agents
│   ├── agents/            # Role-based agents
│   └── settings.json         # Permissions & config
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (grouped)
│   ├── (dashboard)/         # Protected routes
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # shadcn/ui base components
│   ├── forms/               # Form components
│   └── [feature]/           # Feature-specific components
├── docs/                    # Documentation
│   ├── adr/                 # Architecture decisions
│   ├── user-stories/        # User stories
│   ├── hitl/                # HITL requests
│   ├── sessions/            # Session summaries
│   └── *.md                 # Guides
├── lib/                     # Utilities
│   ├── trpc/                # tRPC setup
│   ├── hooks/               # React hooks
│   │   └── generated/       # ZenStack generated hooks
│   ├── generated/           # Generated code
│   └── utils/               # Utility functions
├── prisma/                  # Database
│   ├── schema.prisma        # Generated from ZenStack
│   ├── migrations/          # Migration history
│   └── seed/                # Seed data
├── scripts/                 # Automation scripts
├── server/                  # Backend logic
│   └── routers/
│       └── generated/trpc/  # Generated tRPC routers
├── zschema/                 # ZenStack models
│   ├── base.zmodel          # Base models
│   ├── auth.zmodel          # Auth + user models
│   └── [feature].zmodel     # Feature models
└── schema.zmodel            # Main ZenStack schema
```

### Configuration Files

- **schema.zmodel**: Main schema, imports from `zschema/`
- **.env.local**: Environment variables (not in git)
- **package.json**: Dependencies and scripts
- **next.config.ts**: Next.js configuration
- **vercel.json**: Vercel deployment config
- **CLAUDE.md**: Project instructions for Claude Code

---

## Development Workflow

### Creating Your First Feature

Follow the complete workflow guide: `docs/WORKFLOW_GUIDE.md`

**Quick version**:

1. **Define in README.md**
   - What problem does this solve?
   - Who is it for?
   - How will we measure success?

2. **Create User Stories**
   - Use Claude Code with product manager agent
   - Stories go in `docs/user-stories/`
   - Review and approve via HITL

3. **Architecture Decisions**
   - Architecture agent creates ADRs
   - Review and approve via HITL

4. **Technical Specs**
   - Backend + frontend agents design
   - Review API contracts via HITL

5. **Implementation**
   - Agents implement in parallel
   - Use ZenStack-generated code

6. **Quality Review**
   - QA agent validates
   - Resolve any issues

7. **Session Summary**
   - Auto-generated on "batch complete"
   - Saved to `docs/sessions/`

### Using Claude Code

**Start session**:

```bash
claude
```

**Give Claude the master prompt** (from MASTER_PROMPT.md):

- Paste the research-first development prompt
- Include HITL gate instructions
- Reference CLAUDE.md for project context

**Trigger session summary**:
Say "batch complete" or "summarize this work"

### HITL Review Process

See complete guide: `docs/HITL_GUIDE.md`

**Quick version**:

1. Claude creates HITL files as it works
2. At checkpoints, batch review files generated
3. You review batches and mark approvals
4. Run `pnpm hitl:resume` to continue

---

## Common Tasks

### Adding a New Data Model

1. **Create ZenStack model**:

   ```bash
   # Create new file in zschema/
   touch zschema/my-feature.zmodel
   ```

2. **Define model**:

   ```zmodel
   import "base.zmodel"

   model MyFeature extends BaseModel {
     userId   String
     user     User   @relation(fields: [userId], references: [id])
     name     String

     @@allow('create', auth() != null)
     @@allow('read', auth() == user)
     @@allow('update', auth() == user)
     @@allow('delete', auth() == user)
   }
   ```

3. **Import in auth.zmodel** (if has user FK):

   ```zmodel
   import "my-feature.zmodel"
   ```

4. **Generate code**:

   ```bash
   pnpm gen:check
   ```

5. **Create migration**:
   ```bash
   pnpm db:migrate
   ```

### Adding a New Page

1. **Create route file**:

   ```bash
   mkdir -p app/my-page
   touch app/my-page/page.tsx
   ```

2. **Use generated hooks**:

   ```typescript
   import { useFindManyMyFeature } from '@/lib/hooks/generated/tanstack-query'

   export default function MyPage() {
     const { data, isLoading } = useFindManyMyFeature()
     // ...
   }
   ```

### Running Database Migrations

```bash
# Development: Apply schema changes
pnpm db:push

# Production: Create migration
pnpm db:migrate

# Reset database (WARNING: Deletes data)
pnpm db:reset
```

### Adding Environment Variables

1. **Add to .env.local**:

   ```env
   NEW_API_KEY="your-key-here"
   ```

2. **Add to .env.example** (without value):

   ```env
   NEW_API_KEY="<add your key here>"
   ```

3. **Add to Vercel** (if deploying):
   - Vercel Dashboard → Environment Variables

4. **Reference in code**:
   ```typescript
   const apiKey = process.env.NEW_API_KEY
   ```

---

## Troubleshooting

### Common Issues

#### "Module not found" errors

```bash
# Clear caches and reinstall
pnpm package-clean
```

#### Database connection fails

```bash
# Verify environment variables
./scripts/diagnose-web-environment.sh

# Check database is running
# For Neon: Check dashboard for status
```

#### Type errors after schema changes

```bash
# Regenerate all code
pnpm gen:check

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

#### Port already in use

```bash
# Kill process on port 3000
pnpm dev  # Automatically kills port in script
# Or manually:
lsof -ti:3000 | xargs kill -9
```

### Getting Help

1. **Check documentation**:
   - `docs/WORKFLOW_GUIDE.md`
   - `docs/ARCHITECTURE.md`
   - `docs/adr/` for architecture decisions

2. **Search codebase**:

   ```bash
   rg "keyword" --type ts
   ```

3. **Check existing issues**:

   ```bash
   gh issue list
   ```

4. **Create HITL request**:
   - If Claude Code is helping, it will create HITL file
   - Describe problem, research done, options

---

## Next Steps

### Immediate

- [ ] Complete environment setup
- [ ] Verify all tests pass
- [ ] Deploy to Vercel
- [ ] Set up OAuth providers

### First Week

- [ ] Update README.md with business plan
- [ ] Create first user stories
- [ ] Review and approve via HITL
- [ ] Create architecture ADRs
- [ ] Start first implementation batch

### Ongoing

- [ ] Review HITL batches daily
- [ ] Generate session summaries weekly
- [ ] Update ADRs when architecture changes
- [ ] Keep documentation in sync with code

---

## Additional Resources

### Documentation

- **Workflow**: `docs/WORKFLOW_GUIDE.md`
- **HITL**: `docs/HITL_GUIDE.md`
- **Architecture**: `docs/ARCHITECTURE.md`
- **SDLC**: `docs/SDLC.md`

### External Resources

- [Next.js Docs](https://nextjs.org/docs)
- [ZenStack Guide](https://zenstack.dev/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Better Auth](https://better-auth.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Templates

- `docs/adr/template.md` - Architecture Decision Record
- `docs/user-stories/template.md` - User Story
- `docs/hitl/template.md` - HITL Request
- `README-template.md` - Business Plan

---

**Ready to build!** Start with updating README.md with your project vision, then let Claude Code help you generate user stories.
