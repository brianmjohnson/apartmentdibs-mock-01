# Complete Development Workflow Guide

This guide describes the end-to-end development process for building features with Claude Code and autonomous agent workflows.

## Overview

The workflow follows a phased approach with built-in HITL (Human-in-the-Loop) checkpoints to ensure alignment before proceeding to the next stage.

## Phase Flow Diagram

```
Business Plan → User Stories → Architecture (ADRs) → Technical Specs → Implementation → QA → Session Summary and retrospective document
```

## Phase 1: Business Plan & Vision

### Purpose

Establish the foundation: what are we building and why?

### Process

1. **Create/Update** business plan:
   - Executive summary
   - Problem statement
   - Solution overview
   - Target market & user personas
   - Value proposition
   - Business model & monetization
   - Go-to-market strategy
   - Success metrics
   - Mermaid diagrams for visualization

2. **Update ARCHITECTURE.md** with high-level system design

### Completion Criteria

- Clear business vision documented
- Target users identified
- Success metrics defined
- Architecture overview complete

---

## Phase 2: High-Level User Story Generation

### Purpose

Break down business vision into actionable user stories.

### Process

#### 2.1 Generate Master User Story List

**Agent**: Product Manager (`product-manager.md`)

**Input**: links to relevant business plan documentation

**Output**: `user-stories.md` - Master index with:

- Brief description of each story
- Priority (P0-P3)
- Status (Draft, Ready, In Progress, Complete)
- Links to detailed story files

This file should have a companion CLAUDE.md following the indexing pattern since this file can overflow context.

#### 2.2 Generate Detailed User Stories

**Agent**: Product Manager + UX Researcher

For each story, create `STORY-XXX-user-stories-summary.md`:

- User story format (As a... I want... So that...)
- RICE scoring (Reach, Impact, Confidence, Effort)
- Detailed acceptance criteria
- Technical implementation notes
- Analytics tracking requirements
- Dependencies and related stories
- Mockups/wireframes (by UI Designer agent)

#### 2.3 RECOMMENDED Checkpoint #1: User Story Review

**Trigger**: After all stories generated for current batch

**Process**:

1. Request review
2. Human reviews live with the agent, or updates the status and the results are pulled as an updated commit.
3. For each story, mark status in corresponding `hitl-*` file:
   - `APPROVED` - Ready to proceed
   - `NEEDS_REVISION` - Needs changes (add comments)
   - `REJECTED` - Won't implement
4. Resume processing

**Approval Required Before**: Moving to architecture phase

---

## Phase 3: Architecture & Technical Decisions

### Purpose

Document significant technical decisions before implementation.

### Process

#### 3.1 Identify Required ADRs

**Agent**: Architecture Agent (`architecture-agent.md`)

**Reviews**:

- Approved user stories
- Existing ADRs
- Current tech stack

**Identifies**:

- New ADRs needed (mark as DRAFT)
- Existing ADRs to update (mark as NEEDS_REVIEW)
- Deprecated patterns to document

#### 3.2 Create/Update ADRs

**Agent**: Architecture Agent

For each ADR, create `ADR-NNN-title.md`:

- Context: What problem are we solving?
- Decision: What approach are we taking?
- Consequences: What becomes easier/harder?
- Alternatives considered: What else did we evaluate?
- Status: DRAFT → APPROVED → DEPRECATED → SUPERSEDED BY (link in old doc) amd PRECEDED BY (link to old doc)

**Example ADR Topics**:

- State management approach
- Authentication strategy
- Database schema design
- API versioning strategy
- File upload handling
- Caching strategy
- Error handling patterns

#### 3.3 HITL Checkpoint #2: ADR Review

**Trigger**: After all ADRs created/updated

**Process**:

1. Claude creates ADR document
2. Human reviews
3. Mark status: `APPROVED`, `NEEDS_REVISION`, `REJECTED` during chat or via GitHub, and you pull the updates
4. Update ADR status field to APPROVED
5. Resume

**Approval Required Before**: Creating technical specifications

---

## Phase 4: Technical Specifications

### Purpose

Design detailed implementation contracts (APIs, schemas, interfaces).

### Process

#### 4.1 Backend Specification

**Agent**: Backend Developer (`backend-developer.md`)

**Creates**:

- ZenStack model definitions in `zschema/`
- Access control policies
- Database relationships
- tRPC route specifications (use generated routes)
- API contracts (input/output types)

**Output**: Technical spec section in each `TECH-SPEC-XXX.md`

#### 4.2 Frontend Specification

**Agent**: Frontend Developer + UI Designer

**Creates**:

- Component hierarchy
- Props interfaces
- State management design
- tRPC/TanStack Query hook usage
- Routing structure
- Form validation schemas

**Output**: Technical spec section in each `TECH-SPEC-XXX.md `

**Process**: 3. Verify frontend/backend contracts align

**Approval Required Before**: Implementation begins

---

## Phase 5: Implementation (Parallel Development)

### Purpose

Build the features according to approved specifications.

### Process

#### 5.1 Backend Implementation

**Agent**: Backend Developer

**Tasks**:

1. Create/update ZenStack models in `zschema/`
2. Run code generate Prisma + tRPC + tanstack query
3. Use generated enhanced prisma client for backend code, use tanstack query for client facing code, zod for API and front-end validation. NEVER call prisma from the frontend code! Use 'use-server' and 'use-client' to protect where code goes
4. Implement business logic in separate service files
5. Implement custom routes, if in the technical specification
6. Implement better-auth backend configuration, components, etc.
7. Implement rate limiting, bot detection,
8. Add database migrations if schema changed
9. Write unit tests for business logic

**Anti-Hallucination Checklist**:

- ✅ Searched for existing models/functions before creating new ones
- ✅ Used ZenStack-generated enhanced prisma client, tRPC routes and tanstack query
- ✅ Verified all libraries exist and are correct versions
- ✅ Checked for examples in official documentation

#### 5.2 Frontend Implementation

**Agent**: Frontend Developer

**Tasks**:

1. Create components in `components/` (ui/ or feature-specific)
2. Use shadcn/ui base components where possible
3. Implement with generated TanStack Query hooks
4. Add form validation using generated Zod schemas
5. Implement loading/error states
6. Add analytics tracking (PostHog, etc.)
7. Write component tests

**Anti-Hallucination Checklist**:

- ✅ Searched for existing components before creating new ones
- ✅ Used generated hooks from ZenStack
- ✅ Verified all library APIs are current
- ✅ Checked component library documentation

#### 5.3 Research-First Approach

**For any new library or API**:

1. Web search: "[library name] getting started 2025"
2. Web search: "[library name] nextjs tutorial"
3. Web search: "[library name] github examples"
4. If docs require login → Create HITL file, continue with other tasks

---

## Phase 6: Quality Review

### Purpose

Validate implementation meets requirements and quality standards.

### Process

#### 6.1 Automated Quality Checks

**Run automatically**:

```bash
pnpm lint       # Formatting + linting
pnpm test       # Unit tests
```

#### 6.2 Quality Review Agent

**Agent**: Quality Reviewer (`quality-reviewer.md`)

**Reviews**:

- All acceptance criteria met?
- Edge cases handled?
- Error states implemented?
- Loading states implemented?
- Analytics tracking added?
- Tests cover critical paths?
- Accessibility requirements met?
- Performance considerations addressed?

**Outputs**:

- Pass: Story complete, ready to merge
- Issues found: provide feedback

---

## Phase 7: Session Summary

### Purpose

Document what was accomplished for future reference.

### Trigger

Human says:

- "batch complete"
- "summarize this work"
- "create session summary"

OR run manually: `pnpm session:summary`

### Process

#### 7.1 Auto-Generate Summary

**Agent**: Session Summary Agent (`session-summary-agent.md`)

**Collects**:

- Git commits since last session
- User stories created/completed
- ADRs created/updated
- Files changed
- Key features implemented

**Output**: `project-summary-<YYYY-MM-DD-HH-mm>.md`

**Format**:

- Release goals
- Statistics (commits, files, stories)
- Major features
- Technical improvements
- Testing updates
- Documentation updates
- Links to related work

#### 7.2 Review & Edit

- Human reviews generated summary
- Add any missing context
- Update with deployment notes if applicable

---

## Research-First Development Principles

### Before Implementing ANY Feature

1. **Search Codebase**

   ```bash
   # Search for similar functionality
   rg "keyword" --type ts

   # Find existing components
   find components/ -name "*ComponentName*"

   # Check documentation
   rg "keyword" docs/
   ```

2. **Web Search for Official Docs**
   - "[library/API name] getting started"
   - "[library/API name] next.js integration"
   - "[library/API name] github examples 2025"
   - "[library/API name] best practices"

3. **Verify APIs Exist**
   - Check official documentation
   - Verify version compatibility
   - Find working examples
   - If login-gated → HITL

4. **Check for Existing Code**
   - Don't duplicate functionality
   - Reuse existing utilities
   - Follow established patterns

---

## Agent Coordination

### When Multiple Agents Work Together

**Sequential Dependencies**:

- Product Manager → Architecture Agent
- Architecture Agent → Backend -> Frontend Developers
- Developers → Quality Reviewer
- Quality Reviewer → Session Summary Agent

**Parallel Work**:

- UI Designer + UX Researcher
- Multiple user stories (if independent)

**Communication**:

- Agents read each other's outputs
- Shared context in markdown documentation files
- ADRs provide architectural guidance

---

## Success Metrics

### Workflow Quality Indicators

- ✅ Research conducted before implementation
- ✅ No hallucinated APIs or duplicated code
- ✅ All tests passing
- ✅ Documentation updated
- ✅ Session summary generated

### Anti-Patterns to Avoid

- ❌ Implementing without research
- ❌ Creating custom tRPC routes when generated ones work
- ❌ Duplicating existing functionality
- ❌ Assuming APIs exist without verification
- ❌ Proceeding when official docs require login

---

## Quick Reference

### Phase Checklist

- [ ] **Phase 1**: Read Business plan
- [ ] **Phase 2**: User stories → Approved
- [ ] **Phase 3**: ADRs → Approved
- [ ] **Phase 4**: Technical specs → Approved
- [ ] **Phase 5**: Implementation (research-first)
- [ ] **Phase 6**: QA review → HITL Review (if needed)
- [ ] **Phase 7**: Session summary generated
