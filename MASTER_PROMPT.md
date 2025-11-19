# Claude Code Master Prompt for Autonomous Development

**Purpose**: This prompt provides comprehensive instructions for Claude Code to build features autonomously using this Next.js template with efficient HITL (Human-in-the-Loop) batch review workflow.

---

## Core Directive: Research-First Development

**BEFORE implementing ANY feature, API, or library**:

1. **Search the codebase FIRST**

   ```bash
   # Check for existing functionality
   rg "similar-keyword" --type ts
   find components/ -name "*ComponentName*"
   grep -r "function-name" lib/
   ```

2. **Web search for latest documentation**
   - "[library/API name] getting started 2025"
   - "[library/API name] next.js integration tutorial"
   - "[library/API name] github examples"
   - "[library/API name] best practices"

3. **Never hallucinate APIs**
   - Verify every API method exists in official docs
   - Check version compatibility
   - Find working code examples
   - **If official docs require login**: STOP - Create HITL file, continue with other tasks

4. **Check for existing code**
   - Read `docs/adr/` for architectural decisions
   - Review `zschema/` for existing data models
   - Check `components/` for reusable components
   - Never duplicate functionality

---

## Development Workflow (7 Phases)

### Phase 1: Business Plan Foundation

**Input**: Human provides business idea/vision

**Your Task**:

1. Read any existing `README.md`
2. Help create/update `README.md` using `README-template.md`
3. Include:
   - Problem statement
   - Solution overview
   - Target users/personas
   - Success metrics
   - Mermaid diagrams for visualization

**Template**: `README-template.md`

---

### Phase 2: User Story Generation → HITL Gate #1

**Agent**: Product Manager subagent

**Process**:

1. Read `README.md` business plan
2. Generate `docs/user-stories.md` master index
   - Brief description of each story
   - Priority (P0-P3)
   - Status tracking
3. Create detailed `docs/user-stories/US-XXX.md` for each story:
   - Use template: `docs/user-stories/template.md`
   - RICE scoring (Reach, Impact, Confidence, Effort)
   - Detailed acceptance criteria
   - Technical placeholders (filled later)

4. **Create HITL batch** for all stories:
   - Individual HITL files: `docs/hitl/hitl-YYYY-MM-DD-XXX.md`
   - Batch file: `docs/hitl/REVIEW_BATCH_YYYY-MM-DD_user-stories.md`

**HITL CHECKPOINT #1**:

- **STOP and wait** for human to review batch
- Human marks: APPROVED, NEEDS_REVISION, or REJECTED
- **Resume when**: Human runs `pnpm hitl:resume`
- **If NEEDS_REVISION**: Incorporate feedback, create new HITL

**Templates**:

- `docs/user-stories/template.md`
- `docs/hitl/template.md`
- `docs/hitl/REVIEW_BATCH_template.md`

---

### Phase 3: Architecture Decisions (ADRs) → HITL Gate #2

**Agent**: Architecture Agent subagent

**Process**:

1. Review APPROVED user stories
2. Review existing `docs/adr/` directory
3. Identify architectural decisions needed:
   - New technology choices
   - Data modeling approaches
   - API design patterns
   - Infrastructure decisions

4. For each decision:
   - Create `docs/adr/NNN-kebab-case-title.md`
   - Use template: `docs/adr/template.md`
   - Status: DRAFT
   - Include: Context, Decision, Consequences, Alternatives

5. For existing ADRs that need updates:
   - Mark status as NEEDS_REVIEW
   - Explain why update is needed

6. **Create HITL batch** for all ADRs:
   - Individual HITL files for each ADR decision
   - Batch file: `docs/hitl/REVIEW_BATCH_YYYY-MM-DD_adrs.md`

**HITL CHECKPOINT #2**:

- **STOP and wait** for human to review ADRs
- Human marks: APPROVED, NEEDS_REVISION, REJECTED
- **If APPROVED**: Update ADR status to APPROVED
- **Resume when**: Human runs `pnpm hitl:resume`

**Templates**:

- `docs/adr/template.md`
- `docs/adr/README.md` (process guide)

---

### Phase 4: Technical Specifications → HITL Gate #3

**Agents**: Backend Developer + Frontend Developer agents

**Process**:

#### Backend Developer Creates:

1. **ZenStack Models** (in `zschema/`):

   ```zmodel
   import "base.zmodel"

   model Feature extends BaseModel {
     userId String
     user   User @relation(...)
     name   String

     @@allow('create', auth() != null)
     @@allow('read', auth() == user)
     @@allow('update', auth() == user)
   }
   ```

2. **Import Strategy**:
   - If model has NO user FK → import in `schema.zmodel`
   - If model has user FK → import in `zschema/auth.zmodel`

3. **API Contract** in `US-XXX.md`:
   - List generated tRPC routes
   - Input/output types
   - Access control policies
   - Business logic requirements

#### Frontend Developer Creates:

1. **Component Hierarchy** in `US-XXX.md`:
   - List all components needed
   - Props interfaces
   - State management approach

2. **Hooks to Use**:

   ```typescript
   import {
     useCreate[Model],
     useFindMany[Model],
     useUpdate[Model],
     useDelete[Model]
   } from '@/lib/hooks/generated/tanstack-query'
   ```

3. **Routing Structure**:
   - Page paths
   - URL parameters
   - Navigation flow

#### Both Verify:

- API contracts align (FE expects what BE provides)
- Types match (use ZenStack-generated types)
- No custom tRPC routes unless absolutely necessary

**Create HITL batch**:

- Individual HITL files for each tech spec
- Batch file: `docs/hitl/REVIEW_BATCH_YYYY-MM-DD_tech-specs.md`

**HITL CHECKPOINT #3**:

- **STOP and wait** for human approval
- Human verifies contracts align
- **Resume when**: Human runs `pnpm hitl:resume`

---

### Phase 5: Implementation (Parallel Development)

**Agents**: Backend + Frontend Developer agents

#### Backend Implementation:

1. **Create/Update ZenStack models**:

   ```bash
   # Edit files in zschema/
   vim zschema/feature.zmodel

   # Import in correct location
   # - No user FK: schema.zmodel
   # - Has user FK: zschema/auth.zmodel
   ```

2. **Generate code**:

   ```bash
   pnpm gen:check
   ```

   This generates:
   - Prisma schema
   - tRPC routers
   - TanStack Query hooks
   - Zod schemas

3. **Use generated tRPC routes**:
   - ✅ DO: Use routes in `server/routers/generated/trpc/`
   - ❌ DON'T: Create custom tRPC routes unless necessary
   - If custom needed: Document why in ADR

4. **Business logic** (if complex):
   - Create services in `lib/services/`
   - Keep models clean
   - Unit test services

5. **Database migration**:
   ```bash
   pnpm db:migrate
   ```

#### Frontend Implementation:

1. **Create components** in `components/`:

   ```typescript
   // Use generated hooks
   import { useCreate[Model] } from '@/lib/hooks/generated/tanstack-query'

   export function FeatureForm() {
     const { mutate: createFeature } = useCreate[Model]()
     // ...
   }
   ```

2. **Use shadcn/ui components**:
   - Check `components/ui/` first
   - Reuse existing components
   - Add new ui components if needed

3. **Form validation**:

   ```typescript
   import { [Model]Schema } from '@/lib/generated/schema/zod'
   // Use or extend generated schema
   ```

4. **Analytics tracking**:
   - Add events per user story requirements
   - Use PostHog or configured analytics

#### Anti-Hallucination Checklist:

- ✅ Searched for existing functionality
- ✅ Used ZenStack-generated code
- ✅ Verified library versions and APIs
- ✅ Checked official documentation
- ✅ Found working examples

**If documentation is login-gated**:

1. Create `docs/hitl/hitl-YYYY-MM-DD-XXX-library-docs.md`
2. Document: Library name, goal, URLs found, alternatives
3. **STOP work on this** story
4. Continue with other independent tasks
5. Resume when human provides docs/guidance

---

### Phase 6: Quality Review → HITL Gate #4 (if issues)

**Agent**: Quality Reviewer subagent

**Process**:

1. **Review acceptance criteria** from `US-XXX.md`
2. **Run automated checks**:

   ```bash
   pnpm gen:check  # ZenStack + Prisma
   pnpm lint       # ESLint + Prettier
   pnpm test       # Unit tests
   ```

3. **Manual review**:
   - All ACs met?
   - Edge cases handled?
   - Error states implemented?
   - Loading states present?
   - Analytics events added?
   - Tests cover critical paths?
   - Accessibility compliant?
   - Performance acceptable?

4. **If issues found**:
   - Create `docs/hitl/REVIEW_BATCH_YYYY-MM-DD_qa-issues.md`
   - Categorize: Critical (blocks merge) vs Minor (can defer)
   - For each issue, provide options:
     - Fix immediately
     - Refine user story
     - Defer to new story
     - Accept as-is

**HITL CHECKPOINT #4** (only if issues):

- **STOP if critical issues** found
- Human decides how to proceed
- **Resume when**: Human runs `pnpm hitl:resume`

**If no issues**: Mark story complete, proceed to Phase 7

---

### Phase 7: Session Summary (Auto-Generated)

**Agent**: Session Summary Agent

**Triggers**:

- Human says: "batch complete"
- Human says: "summarize this work"
- Human says: "create session summary"
- Human runs: `pnpm session:summary`

**Process**:

1. Collect since last session:
   - Git commits
   - User stories created/completed
   - ADRs created/updated
   - Files changed
   - Tests added

2. Generate `docs/sessions/session-YYYY-MM-DD.md`:
   - Use template: `docs/sessions/template.md`
   - Executive summary
   - Statistics
   - Major features
   - Technical improvements
   - Testing updates
   - Next steps

3. Present to human for review/editing

**Template**: `docs/sessions/template.md`

---

## HITL Batch System

### Individual HITL Files

**When to create**:

- Need human decision on approach
- Multiple valid options exist
- Login-gated documentation encountered
- Security/privacy considerations
- Ambiguous requirements

**Format**: `docs/hitl/hitl-YYYY-MM-DD-XXX.md`

**Template**: `docs/hitl/template.md`

**Contents**:

- Problem statement
- Research completed (codebase, web, docs)
- Options considered (with pros/cons)
- Recommendation
- Questions for human
- Decision section (human fills this)

### Batch Review Files

**When to create**:

- At each of 4 HITL checkpoints
- When multiple related decisions accumulate

**Format**: `docs/hitl/REVIEW_BATCH_YYYY-MM-DD_[category].md`

**Categories**:

- `user-stories` - Gate #1
- `adrs` - Gate #2
- `tech-specs` - Gate #3
- `qa-issues` - Gate #4

**Template**: `docs/hitl/REVIEW_BATCH_template.md`

**Contents**:

- Executive summary
- Statistics
- Quick review options (bulk approve)
- Individual item list with links
- Review instructions

### Batch Review Process

**For Claude Code**:

1. Create individual HITL files as you work
2. At checkpoints, create batch review file
3. **STOP and wait** - do not proceed past gate
4. Can continue with unrelated tasks
5. When human runs `pnpm hitl:resume`:
   - Read resume report
   - Process APPROVED items
   - Revise NEEDS_REVISION items
   - Archive REJECTED items

**For Human** (your workflow):

1. Claude creates batch file at checkpoint
2. You open `docs/hitl/REVIEW_BATCH_*` file
3. Review summary and decide:
   - Bulk approve low-risk items, OR
   - Review each individually
4. Update status in each `hitl-*.md` file:
   - `APPROVED` - proceed
   - `NEEDS_REVISION` - add feedback
   - `REJECTED` - explain why
5. Run `pnpm hitl:resume`
6. Claude continues with decisions

---

## ZenStack Best Practices

### Schema Organization

**Main File** (`schema.zmodel`):

```zmodel
// Import non-user models
import "zschema/config.zmodel"

// Import auth (brings User + all user FK models)
import "zschema/auth.zmodel"

// Datasource, generator, plugins
```

**Auth Hub** (`zschema/auth.zmodel`):

```zmodel
import "base.zmodel"
import "profile.zmodel"      // Has user FK
import "wishlist.zmodel"     // Has user FK
import "feature.zmodel"      // Has user FK

model User { ... }
model Session { ... }
model Account { ... }
```

**Modular Files** (`zschema/*.zmodel`):

- One domain per file
- Use `extends BaseModel` for standard fields
- Define access control in model

### Generated vs Custom Code

**✅ ALWAYS Use Generated**:

- tRPC routes (`server/routers/generated/trpc/`)
- TanStack Query hooks (`lib/hooks/generated/`)
- Zod schemas (`lib/generated/schema/zod/`)
- Types from Prisma

**❌ AVOID Custom Code**:

- Custom tRPC routes (unless absolutely necessary)
- Manual type definitions (use generated)
- Duplicate CRUD operations

**When Custom is Needed**:

- Complex multi-model queries
- Business logic beyond CRUD
- External API integrations
- Document in ADR why custom is needed

---

## Project Context Reference

### Always Read These First:

- `README.md` - Business plan and vision
- `CLAUDE.md` - Project-specific instructions
- `docs/WORKFLOW_GUIDE.md` - Complete process
- `docs/HITL_GUIDE.md` - Batch HITL details

### For Architecture Decisions:

- `docs/adr/` - All architectural decisions
- `docs/ARCHITECTURE.md` - System design

### For Current Work:

- `docs/user-stories.md` - Master story index
- `docs/user-stories/US-XXX.md` - Individual stories

### For Agent Coordination:

- `.claude/agents/README.md` - How agents work together
- `.claude/agents/*` - Individual agent configs

---

## Key Commands

```bash
# Development
pnpm dev                # Start dev server with Turbopack
pnpm gen:check          # ZenStack + Prisma generation
pnpm lint               # Auto-fix linting
pnpm lint:check         # Check without fixing
pnpm test               # Run all tests
pnpm build              # Type-check + build

# Database
pnpm db:push            # Push schema changes (dev)
pnpm db:migrate         # Create migration (prod)
pnpm db:seed            # Seed database

# HITL Workflow
pnpm hitl:resume        # Process batch approvals
pnpm session:summary    # Generate session summary

# Deployment
vercel                  # Deploy to preview
vercel --prod           # Deploy to production
```

---

## Success Criteria

### Quality Indicators:

- ✅ All 4 HITL checkpoints completed before proceeding
- ✅ Research conducted before each implementation
- ✅ No hallucinated APIs or libraries
- ✅ ZenStack-generated code used (not custom)
- ✅ No duplicate functionality created
- ✅ All tests passing
- ✅ Documentation updated
- ✅ Session summary generated

### Anti-Patterns to Avoid:

- ❌ Skipping HITL checkpoints
- ❌ Implementing without researching
- ❌ Creating custom tRPC routes when generated work
- ❌ Duplicating existing code
- ❌ Assuming APIs exist without verification
- ❌ Proceeding when docs require login

---

## Agent Coordination

### Sequential Dependencies:

```
Product Manager → Architecture Agent → Backend + Frontend (parallel) → Quality Reviewer → Session Summary
```

### Parallel Work Opportunities:

- Multiple independent user stories
- Frontend + Backend (after specs approved)
- UI Designer + UX Researcher

### Shared Context:

- All agents read `US-XXX.md` for requirements
- All agents follow ADRs for architecture
- All agents reference `CLAUDE.md` for process

---

## Example Session Flow

1. **Human**: "Let's implement user authentication"

2. **Claude (PM Agent)**:
   - Creates US-001, US-002, US-003
   - HITL Batch #1 created
   - **STOPS, awaits approval**

3. **Human**: Reviews batch, marks APPROVED, runs `pnpm hitl:resume`

4. **Claude (Arch Agent)**:
   - Creates ADR-001 (Better Auth decision)
   - HITL Batch #2 created
   - **STOPS, awaits approval**

5. **Human**: Approves ADR, runs `pnpm hitl:resume`

6. **Claude (BE + FE Agents)**:
   - Creates tech specs
   - HITL Batch #3 created
   - **STOPS, awaits approval**

7. **Human**: Approves specs, runs `pnpm hitl:resume`

8. **Claude (BE + FE Agents)**:
   - Implements in parallel
   - Uses generated code
   - Adds tests

9. **Claude (QA Agent)**:
   - Reviews, finds minor issue
   - HITL Batch #4 created
   - **STOPS, awaits decision**

10. **Human**: "Fix the issue", runs `pnpm hitl:resume`

11. **Claude (FE Agent)**:
    - Fixes issue
    - Re-validates

12. **Human**: "batch complete"

13. **Claude (Summary Agent)**:
    - Generates `session-2025-01-15.md`
    - Presents for review

---

## Final Checklist

Before considering any feature complete:

- [ ] Research completed (codebase + web)
- [ ] HITL checkpoints passed
- [ ] ZenStack-generated code used
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Analytics events added
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] User story ACs met
- [ ] Session summary created

---

## Emergency Protocols

### If Stuck on Login-Gated Docs:

1. Create HITL with all research done
2. Document what you were trying to achieve
3. List URLs found but couldn't access
4. Suggest alternatives if any
5. Continue with other independent tasks

### If Approach Seems Wrong:

1. Don't proceed with uncertainty
2. Create HITL explaining concerns
3. Present multiple approaches
4. Ask specific questions
5. Wait for human guidance

### If Tests Failing:

1. Don't mark story complete
2. Debug and fix issues
3. If complex: Create HITL
4. Request guidance if needed

---

**This prompt is your complete guide. Read `CLAUDE.md` for project context, follow the 7-phase workflow, stop at all 4 HITL gates, and always research before implementing.**

**Key Principle**: Autonomous within guidelines, collaborative at decision points.
