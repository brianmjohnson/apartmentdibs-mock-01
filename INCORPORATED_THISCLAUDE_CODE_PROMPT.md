# ApartmentDibs - Claude Code Context Prompt

**Last Updated**: 2025-11-22
**Version**: 0.1.0
**Status**: In Development

---

## Tech Stack (Complete Version Reference)

### Core Framework
- **Next.js**: `16.0.3` (App Router, React Server Components, Turbopack)
- **React**: `19.2.0` (latest stable)
- **TypeScript**: `5.9.3` (strict mode)
- **Node.js**: `>=20.0.0` (required)
- **pnpm**: `9.15.0` (package manager)

### Database & ORM
- **PostgreSQL**: Neon (cloud-native, automatic branching)
- **Prisma**: `6.19.0` (@prisma/client, prisma)
- **ZenStack**: `2.21.1` (zenstack, @zenstackhq/runtime, @zenstackhq/tanstack-query, @zenstackhq/trpc)

### API Layer
- **tRPC**: `11.7.1` (@trpc/server, @trpc/client, @trpc/react-query)
- **TanStack Query**: `5.90.10` (@tanstack/react-query)
- **Zod**: `4.1.12` (validation)

### Authentication & Authorization
- **Better Auth**: `1.3.34` (OAuth + Organizations + plugin library - search online docs )
- **ZenStack Access Control**: Schema-level row security (@@allow policies), RBAC, APAC, 

### UI & Styling
- **Tailwind CSS**: `4.1.17` (@tailwindcss/postcss)
- **Radix UI**: Complete component library (~20 @radix-ui/react-* packages)
  - accordion `1.2.12`, avatar `1.1.11`, checkbox `1.3.3`, dialog `1.1.15`, dropdown-menu `2.1.16`
  - label `2.1.8`, navigation-menu `1.2.14`, popover `1.1.15`, select `2.2.6`, toast `1.2.15`, etc.
- **shadcn/ui**: Component system built on Radix UI
- **Lucide React**: `0.554.0` (icons)
- **class-variance-authority**: `0.7.1` (component variants)
- **clsx**: `2.1.1` + **tailwind-merge**: `3.4.0` (className utilities)
- **next-themes**: `0.4.6` (dark mode support)

### Forms & Validation
- **React Hook Form**: `7.66.1` (form state management)
- **Hookform Resolvers**: `5.2.2` (Zod integration)
- **Zod**: `4.1.12` + **zod-to-json-schema**: `3.25.0`

### Analytics & Monitoring
- **PostHog**: `1.297.2` (posthog-js), `5.13.2` (posthog-node)
  - Product analytics, feature flags, A/B testing, session recording
- **Consola**: `3.4.2` (structured logging)

### UI Enhancements
- **Sonner**: `2.0.7` (toast notifications)
- **cmdk**: `1.1.1` (command palette)
- **Embla Carousel**: `8.6.0` (carousels)

### Environment & Config
- **@t3-oss/env-nextjs**: `0.13.8` (type-safe environment variables)

### Development Tools
- **TypeScript**: `5.9.3`
- **ESLint**: `9.39.1` + **@typescript-eslint**: `8.47.0`
- **Prettier**: `3.6.2` + **prettier-plugin-tailwindcss**: `0.7.1`
- **PostCSS**: `8.5.6`
- **Autoprefixer**: `10.4.22`
- **tsx**: `4.20.6` (TypeScript execution)

### Testing
- **Jest**: `30.2.0` (@types/jest `30.0.0`)
- **Playwright**: `1.56.1` (@playwright/test)

### Type Definitions
- **@types/node**: `24.10.1`
- **@types/react**: `19.2.6`
- **@types/react-dom**: `19.2.3`

---

## Architecture Principles

### 1. Type Safety Everywhere
- Full-stack TypeScript with strict mode
- Generated types flow: ZenStack → Prisma → tRPC → React
- No `any` types (use `unknown` if truly dynamic)
- Shared types between frontend and backend via tRPC

### 2. Code Generation (CRITICAL)
**NEVER create manual tRPC routes or API handlers unless absolutely necessary.**

**Generation Flow**:
```
schema.zmodel (ZenStack schema)
  ↓ pnpm gen:check
├─→ prisma/schema.prisma (Prisma schema)
├─→ .zenstack/ (runtime access control)
├─→ lib/generated/schema/zod/ (Zod validation schemas)
├─→ server/routers/generated/trpc/ (tRPC routers - ALL CRUD operations)
└─→ lib/hooks/generated/tanstack-query/ (React hooks - type-safe queries/mutations)
```

**When to create custom routes**:
- ✅ Multi-model transactions (e.g., create Organization + Member + Business atomically)
- ✅ External API integrations (Stripe, Plaid, TransUnion)
- ✅ Complex business logic not representable in ZenStack
- ✅ Performance optimization (denormalization, caching)
- ❌ Simple CRUD operations (use generated routes)
- ❌ Access control (use ZenStack @@allow policies)

### 3. ZenStack Schema Organization

**File Structure**:
```
schema.zmodel                    # Import-only file (NEVER put models here)
├─ import "zschema/config.zmodel"   # Non-user models (no User FK)
└─ import "zschema/auth.zmodel"      # User model + all models with User FK

zschema/
├─ base.zmodel                   # Abstract base models (BaseModelWithId, BaseModelWithoutId)
├─ config.zmodel                 # Non-user models (Config, Feature, etc.)
└─ auth.zmodel                   # User + all user FK models
   ├─ import "zschema/tenant.zmodel"
   ├─ import "zschema/agent.zmodel"
   ├─ import "zschema/landlord.zmodel"
   └─ etc.
```

**Rules**:
- **Has User FK?** → Create in `zschema/<domain>.zmodel`, import in `zschema/auth.zmodel`
- **No User FK?** → Create in `zschema/<domain>.zmodel`, import in `schema.zmodel`
- **Extend BaseModelWithId** unless (a) many-to-many join table with compound key, or (b) extension table reusing parent ID
- **Use SlugDecorator** for models with landing pages (route: `/<model>/[slug]/[id]`)

### 4. Access Control at Schema Level

**Use ZenStack @@allow policies, NOT imperative checks:**

```zmodel
model Post {
  id String @id @default(cuid())
  author User @relation(fields: [authorId], references: [id])
  authorId String

  // ✅ Declarative access control
  @@allow('read', true)
  @@allow('create,update,delete', auth() == author)
}
```

**Access Control Patterns**:
- **ACL** (Access Control List): User-based permissions
- **RBAC** (Role-Based Access Control): Role-based permissions (owner, admin, member)
- **ABAC** (Attribute-Based Access Control): Attribute-based rules (e.g., organization membership)
- **ReBAC** (Relationship-Based Access Control): Relationship graph (e.g., friend-of-friend)

### 5. Better Auth v1.3+ Patterns

**Organization → Member → Business Flow** (ADR-002):
```typescript
// 1. Create Organization (no createdById - not a user-owned model)
const organization = await createOrganization.mutateAsync({
  data: { name: businessName, slug: generateSlug(businessName) },
});

// 2. Create Member (user as owner)
await createMember.mutateAsync({
  data: { userId: user.id, organizationId: organization.id, role: "owner" },
});

// 3. Create Business
const business = await createBusiness.mutateAsync({
  data: {
    businessName,
    organizationId: organization.id,
    emails: [], // Required empty JSON array
    addresses: [],
    phoneNumbers: [],
    websites: [],
  },
});
```

**Session Cookie Detection** (CRITICAL):
```typescript
// ✅ CORRECT - Detects session cookies
const session = await auth.api.getSession({
  headers: await headers(),
});

// ❌ WRONG - Fails to detect session cookies
const session = await auth.api.getSession({
  headers: new Headers(),
});
```

**Database-backed Authorization** (NOT session-based):
```typescript
// ✅ CORRECT - Query database for authorization
const isPlatformAdmin = await prisma.member.findFirst({
  where: {
    userId: session.user.id,
    organization: { slug: "platform" },
    role: "owner",
  },
});

// ❌ WRONG - Session doesn't have role field
const isAdmin = session.user.role === "admin";
```

---

## Next.js App Router Structure

**CRITICAL: Route Group Naming Convention**

Route groups use **parentheses** to organize routes without affecting the URL:

```
app/
├── (public)/             # Public pages (no auth) → URL: /
│   ├── page.tsx          # Homepage → /
│   ├── contact/          # Contact → /contact
│   └── legal/            # Legal → /legal
│
├── (auth)/               # Auth flows → URL: /login, /register
│   ├── login/            # Login → /login
│   └── register/         # Register → /register
│
├── (tenant)/             # Tenant dashboard → URL: /tenant/*
│   ├── layout.tsx        # Tenant-specific layout (sidebar, auth guard)
│   ├── dashboard/        # → /tenant/dashboard
│   ├── profile/          # → /tenant/profile
│   ├── applications/     # → /tenant/applications
│   └── settings/         # → /tenant/settings
│
├── (agent)/              # Agent dashboard → URL: /agent/*
├── (landlord)/           # Landlord dashboard → URL: /landlord/*
└── (admin)/              # Admin dashboard → URL: /admin/*
```

**Key Patterns**:
- **Route Groups** `(name)`: Organize routes, don't affect URL
- **Dynamic Routes** `[slug]`: Capture URL parameters
- **Catch-all Routes** `[...slug]`: Match multiple segments
- **Private Folders** `_components`: Excluded from routing (underscore prefix)
- **Parallel Routes** `@modal`: Render multiple slots in same layout (future)
- **Intercepting Routes** `(..)path`: Intercept navigation (future)

**Layout Inheritance**:
- `app/layout.tsx` - Root layout (global providers, fonts)
- `app/(tenant)/layout.tsx` - Tenant layout (sidebar, auth guard)
- Nested layouts compose (child inherits parent)

---

## Development Workflow (7 Phases + HITL)

### Phase 1: Business Plan
- **Location**: `README.md`
- **Owner**: Product Manager Agent
- **Output**: Problem statement, solution, target market, tech stack

### Phase 2: User Stories
- **Location**: `docs/user-stories/`
- **Owner**: Product Manager Agent
- **Format**: RICE scoring (Reach × Impact × Confidence / Effort)
- **HITL Gate**: Batch review all stories before proceeding

### Phase 3: Architecture (ADRs)
- **Location**: `docs/adr/`
- **Owner**: Architecture Agent
- **Format**: ADR template (Context, Decision, Consequences)
- **Statuses**: DRAFT → APPROVED → DEPRECATED → SUPERSEDED
- **HITL Gate**: Approve all DRAFT ADRs before implementation

### Phase 4: Technical Specifications
- **Location**: `docs/technical-specs/`
- **Owner**: Backend Developer Agent + Frontend Developer Agent
- **Output**: API contracts, component specs, database schemas
- **HITL Gate**: Approve specs before coding

### Phase 5: Implementation
- **Owner**: Frontend + Backend Developers (parallel execution)
- **Process**:
  1. Backend: ZenStack models → `pnpm gen:check` → tRPC routes
  2. Frontend: Use generated TanStack Query hooks
  3. Both: Write unit tests alongside code

### Phase 6: Quality Review
- **Owner**: Quality Reviewer Agent
- **Output**: QA report, regression tests, eval suite additions
- **HITL Gate**: If critical issues found, decide fix/defer/refine

### Phase 7: Session Summary
- **Location**: `docs/sessions/session-YYYY-MM-DD.md`
- **Owner**: Session Summary Agent
- **Trigger**: "batch complete", "summarize this work", `pnpm session:summary`

---

## AI Agents (22 Specialized Roles)

### Product Development Agents
- **architecture-agent.md** - ADR creation and review
- **product-manager.md** - User stories with RICE scoring
- **frontend-developer.md** - React/Next.js components
- **backend-developer.md** - ZenStack models + tRPC routes
- **ui-designer.md** - Component specs and mockups
- **ux-researcher.md** - User research and testing
- **quality-reviewer.md** - QA testing + eval suite generation

### Business Operations Agents
- **market-analyst.md** - Competitive intelligence + market research
- **experimentation-agent.md** - A/B testing + PostHog experiments
- **data-engineer.md** - Data pipelines + ETL + warehouse design
- **data-scientist.md** - Statistical analysis + ML models
- **compliance-agent.md** - GDPR/CCPA/SOC2 compliance
- **unit-economics-agent.md** - LTV/CAC modeling + financial metrics
- **observability-agent.md** - Logging + audit trails + monitoring
- **support-triage-agent.md** - FAQ + troubleshooting + escalation
- **operations-excellence-agent.md** - PR feedback processing + retrospective improvements

### Task-Specific Agents
- **pr-finalization-agent.md** - PR workflow automation + migration rollback
- **github-integration-agent.md** - Issue/PR synchronization
- **session-summary-agent.md** - Generate session documentation
- **deployment-monitoring-agent.md** - Deployment status monitoring
- **pr-quick-fixes.md** - Quick PR fixes (Haiku model)
- **github-pr-comment-processor.md** - PR comment analysis (Sonnet model)
- **pr-architecture-reviewer.md** - Architectural review (Sonnet model)

**Agent Coordination**: See `.claude/agents/README.md`
**Philosophy**: See `docs/PHILOSOPHY.md` (Agentic First approach)

---

## Environment Setup

### Required Environment Variables (Vendor-Prefixed)

```bash
# Database (Neon PostgreSQL)
NEON_DATABASE_URL="postgresql://..."           # Pooled connection
NEON_DATABASE_URL_UNPOOLED="postgresql://..."  # Direct connection

# Authentication (Better Auth)
BETTER_AUTH_SECRET="..."                        # Session encryption key
BETTER_AUTH_URL="http://localhost:3000"         # Base URL

# Storage (Vercel Blob)
VERCEL_BLOB_READ_WRITE_TOKEN="..."             # Blob storage token

# Analytics (PostHog)
POSTHOG_API_KEY="..."                          # PostHog project API key
POSTHOG_HOST="https://app.posthog.com"         # PostHog host (or self-hosted)

# Redis/KV (Upstash)
UPSTASH_KV_URL="..."                           # Redis URL
UPSTASH_KV_TOKEN="..."                         # Redis token

# Email (Resend)
RESEND_API_KEY="..."                           # Email API key

# Stripe (Payments)
STRIPE_SECRET_KEY="sk_test_..."                # Secret key
STRIPE_WEBHOOK_SECRET="whsec_..."              # Webhook signing secret

# Verification Services (Future)
# PLAID_CLIENT_ID="..."                        # Income verification
# PLAID_SECRET="..."
# TRANSUNION_API_KEY="..."                     # Credit reports
# CHECKR_API_KEY="..."                         # Background checks
# ONFIDO_API_KEY="..."                         # Identity verification
```

### Cloud Environment (Claude Code Web)

**SessionStart Hook** (`.claude/settings.json`):
- Auto-installs CLI tools: `gh`, `vercel`, `neon`, `posthog`, `upstash`
- Runs `vercel env pull --environment=development` to setup `.env.local`
- Only runs in `CLAUDE_CODE_REMOTE=true` environment


### Validation

```bash
vercel dev                                # Start development server
vercel build                              # Type-check and build
pnpm zenstack generate && pnpm prisma generate                          # ZenStack + Prisma generation
```

---

## Testing Requirements

### Unit Tests (Jest)
- **Minimum**: 80% coverage for business logic
- **Location**: `__tests__/` or `*.test.ts` colocated with code
- **Run**: `pnpm test` or `pnpm test:watch`

### E2E Tests (Playwright)
- **Coverage**: All critical user flows (login, apply, approve, etc.)
- **Location**: `e2e/` or `*.spec.ts`
- **Run**: `pnpm test:e2e`

### Evaluation Suites (Failure Mode Capture)
- **Philosophy**: Every bug becomes a regression test
- **Structure**:
  - `__tests__/failure-modes/` - Captured regressions
  - `__tests__/adversarial/` - Security tests (SQL injection, XSS)
  - `__tests__/e2e/` - Full user flows

**Validation**: All tests must pass before PR merge

---

## PostHog Integration (Analytics & Experimentation)

### Capabilities
- **Event Tracking**: Page views, user interactions, conversion funnels
- **Feature Flags**: Gradual rollouts, user segmentation, kill switches
- **A/B Testing**: Experiments with Bayesian sequential testing (500+ visitors per variant)
- **Session Recording**: User session replay for debugging and UX analysis
- **User Identification**: Linked to Better Auth with organization context

### Integration Points
```typescript
// User identification on auth
posthog.identify(user.id, {
  email: user.email,
  organization: user.organizationId,
});

// Custom event tracking
posthog.capture('application_submitted', {
  listingId,
  applicantId,
});

// Feature flag check
const showNewUI = posthog.isFeatureEnabled('new-ui-redesign');
```

### Testing Strategy
- **Sample Size**: 500+ visitors per variant for statistical significance
- **Bayesian Sequential Testing**: Early stopping when confidence threshold met
- **Metrics**: Conversion rate, engagement, revenue per user

See: `docs/adr/ADR-013-posthog-analytics-and-experimentation-platform.md`

---

## Observability Stack

### Application Logging (Consola)
```typescript
import { logger } from '@/lib/logger';

logger.info('User logged in', { userId, email });
logger.warn('Rate limit exceeded', { ip, endpoint });
logger.error('Payment failed', { error, userId, amount });
```

### Audit Logs (PostgreSQL)
```json
{
  "timestamp": "2025-11-22T10:30:00Z",
  "actor": "urn:user:01JCQX8...",
  "action": "user.profile.update",
  "resource": "urn:profile:01JCQX8...",
  "changes": { "email": "old@example.com -> new@example.com" },
  "ip": "192.168.1.1",
  "success": true
}
```

### Analytics (PostHog)
- User behavior tracking
- Feature usage metrics
- Conversion funnels
- Session recordings

### Future: OpenTelemetry
- Distributed tracing for API calls
- Performance monitoring
- Error tracking with context

See: `docs/adr/ADR-007-observability-with-consola-and-opentelemetry.md`

---

## Key Commands

```bash
# Development
pnpm dev                # Start dev server (Turbopack)
pnpm build              # Type-check and build

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Watch mode
pnpm test:e2e           # Run E2E tests

# Database
pnpm prisma push            # Push schema changes (dev)
pnpm prisma migrate         # Create migration
pnpm prisma reset           # Reset database
pnpm prisma seed            # Seed database
pnpm prisma studio          # Open Prisma Studio, the port is in the command line
Pnpm zenstack repl # run ad hoc queries
```

---

## Anti-Patterns (DO NOT DO THIS)

### 1. Bypassing Code Generation
❌ Creating manual tRPC routes for CRUD operations
✅ Use ZenStack-generated routes, create custom only when necessary

### 2. Skipping Agents
❌ "This is simple, I'll just run `pnpm add package@latest`"
✅ Use ADR-012 automated dependency workflow

❌ "This is a quick PR comment fix, I'll use `gh api` directly"
✅ Use github-pr-comment-processor agent

### 3. Imperative Access Control
❌ Adding `if (user.id !== record.userId) throw Error` in every route
✅ Use ZenStack `@@allow` policies at schema level

### 4. Session-Based Authorization
❌ Checking `session.user.role === "admin"`
✅ Query database for Member role (database-backed)


### 6. Hallucinating APIs
❌ Writing code based on assumed API without verification
✅ Web search for official docs, find examples, verify API exists

---

## Research-First Development

**Before implementing ANY feature**:

1. **Search codebase**: Check documentation, existing code, configuration
2. **Web search**: Official docs, getting started guides, tutorials (prefer 2025 docs)
3. **Check for existing solutions**: Never duplicate functionality
4. **Find examples**: Official repos, starter projects, working code
5. **Login-gated docs?** → Create HITL file in `docs/hitl/`, continue other tasks

**Anti-hallucination checklist**:
- ✅ Searched for official documentation
- ✅ Checked codebase for existing implementation
- ✅ Verified API/library exists and is current version
- ✅ Found working examples or starter projects

---
