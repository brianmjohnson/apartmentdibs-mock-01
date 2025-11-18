# Agent Coordination Guide

How AI agents work together in this project to deliver features autonomously.

## Overview

This project uses **specialized AI agents** (agents) that collaborate to take features from concept to production. Each agent has specific expertise and responsibilities.

## Agent Types

### Role-Based Agents (in `.claude/agents/`)

These agents have specialized domain expertise:

1. **Architecture Agent** - Technical decisions & ADRs
2. **Product Manager** - User stories & prioritization
3. **Frontend Developer** - React/Next.js implementation
4. **Backend Developer** - ZenStack/tRPC implementation
5. **UI Designer** - Component specs & mockups
6. **UX Researcher** - User research & testing
7. **Quality Reviewer** - QA testing & validation

### Task-Specific Agents (in `.claude/agents/`)

These agents handle specific workflows:

1. **PR Finalization** - Complete PR workflow
2. **GitHub Integration** - Issue/PR synchronization
3. **Session Summary** - Generate session documentation

## Agent Collaboration Patterns

### Pattern 1: Sequential Handoff

One agent completes work, hands off to next agent.

**Example: User Story → Implementation**

```
Product Manager Agent
  ↓ (creates US-001.md)
UI Designer Agent
  ↓ (updates US-001.md)
UX Researcher Agent (when needed)
  ↓ (updates US-001.md)
Architecture Agent
  ↓ (creates ADR-003.md)
  ↓ (updates US-003.md)
Backend Developer Agent
  ↓ (implements schema, api, services)
Frontend Developer Agent
  ↓ (implements UI)
Quality Reviewer Agent
  ↓ (validates)
Session Summary Agent
  ✓ (documents)
```

**Coordination**:
- Each agent reads previous agent's output
- US-001.md contains context for all agents
- ADRs provide architectural guardrails
- HITL gates prevent bad handoffs

### Pattern 2: Parallel Execution

Multiple agents work simultaneously on independent tasks.

**Example: Frontend + Backend Development**

```
      (after tech spec approved)
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
Backend Agent      Frontend Agent
(schema, tRPC)     (components, hooks)
    ↓                   ↓
    └─────────┬─────────┘
              ↓
      Quality Reviewer
```

**Coordination**:
- Both read same tech spec
- API contract defined in US-XXX.md
- Both use ZenStack-generated types
- No circular dependencies

### Pattern 3: Iterative Refinement

Agent produces output, receives feedback, refines.

**Example: ADR Review with HITL**

```
Architecture Agent (Draft ADR)
    ↓
HITL Review (NEEDS_REVISION)
    ↓
Architecture Agent (Revised ADR)
    ↓
HITL Review (APPROVED)
    ↓
Implementation Proceeds
```

**Coordination**:
- HITL file contains specific feedback
- Agent reads feedback and incorporates
- Multiple revision rounds possible
- Final approval required to proceed

## Agent Responsibilities

### Architecture Agent

**Role**: Make and document technical decisions

**Inputs**:
- Approved user stories
- Existing ADRs
- Tech stack constraints
- Research findings

**Outputs**:
- New ADRs (DRAFT status)
- Updated ADRs (NEEDS_REVIEW status)
- Technical recommendations

**When Activated**:
- After user stories approved
- Before implementation begins
- When significant decision needed

**Works With**:
- Product Manager (understands requirements)
- Backend/Frontend Developers (provides guidance)

**Configuration**: `.claude/agents/architecture-agent.md`

---

### Product Manager Agent

**Role**: Define and prioritize features

**Inputs**:
- Business plan (README.md)
- Market research
- User feedback
- Success metrics

**Outputs**:
- `docs/user-stories.md` (master index)
- `docs/user-stories/US-XXX.md` (detailed stories)
- RICE scoring
- Prioritization (P0-P3)

**When Activated**:
- At project start
- For new features
- Sprint planning

**Works With**:
- UX Researcher (validates assumptions)
- UI Designer (creates mockups)
- Architecture Agent (technical feasibility)

**Configuration**: `.claude/agents/product-manager.md`

---

### Frontend Developer Agent

**Role**: Implement UI and client logic

**Inputs**:
- Approved user stories
- Technical specifications
- ADRs for guidance
- UI mockups/specs

**Outputs**:
- React components
- Client-side logic
- TanStack Query hook usage
- Form validation
- Component tests

**When Activated**:
- After tech spec approved
- Can work in parallel with backend

**Works With**:
- Backend Developer (API contracts)
- UI Designer (implements designs)
- Quality Reviewer (testing)

**Anti-Hallucination Rules**:
- ✅ Use ZenStack-generated hooks
- ✅ Search for existing components first
- ✅ Web search for library docs
- ❌ Don't create custom tRPC hooks
- ❌ Don't duplicate existing components

**Configuration**: `.claude/agents/frontend-developer.md`

---

### Backend Developer Agent

**Role**: Implement data models and business logic

**Inputs**:
- Approved user stories
- Technical specifications
- ADRs for guidance
- Data requirements

**Outputs**:
- ZenStack models (`zschema/`)
- Access control policies
- Business logic services
- Database migrations
- Unit tests

**When Activated**:
- After tech spec approved
- Can work in parallel with frontend

**Works With**:
- Frontend Developer (API contracts)
- Architecture Agent (follows ADRs)
- Quality Reviewer (testing)

**Anti-Hallucination Rules**:
- ✅ Use ZenStack-generated tRPC routes
- ✅ Search for existing models first
- ✅ Follow established schema patterns
- ❌ Don't create custom tRPC routes unless necessary
- ❌ Don't duplicate existing business logic

**Configuration**: `.claude/agents/backend-developer.md`

---

### UI Designer Agent

**Role**: Create component specifications and mockups

**Inputs**:
- User stories
- Brand guidelines
- Accessibility requirements
- User personas

**Outputs**:
- Component specifications
- Text-based mockups
- Layout descriptions
- Accessibility notes
- Design tokens/variables

**When Activated**:
- During user story creation
- Before frontend implementation

**Works With**:
- Product Manager (understands requirements)
- UX Researcher (validates with users)
- Frontend Developer (implements designs)

**Configuration**: `.claude/agents/ui-designer.md`

---

### UX Researcher Agent

**Role**: Validate assumptions and test usability

**Inputs**:
- User stories
- Target personas
- Product goals
- User feedback

**Outputs**:
- User research findings
- Usability recommendations
- Friction point analysis
- A/B test suggestions
- Analytics tracking requirements

**When Activated**:
- During user story refinement
- After feature implementation
- For major UX changes

**Works With**:
- Product Manager (refines stories)
- UI Designer (improves designs)
- Quality Reviewer (validates UX)

**Configuration**: `.claude/agents/ux-researcher.md`

---

### Quality Reviewer Agent

**Role**: Validate implementation meets requirements

**Inputs**:
- User stories (acceptance criteria)
- Implemented code
- Test results
- Performance metrics

**Outputs**:
- QA report
- Issues found (critical/minor)
- Test coverage analysis
- Performance assessment
- HITL for decisions

**When Activated**:
- After implementation complete
- Before marking story as done

**Works With**:
- Frontend/Backend Developers (reports issues)
- Product Manager (story refinement)
- Human (HITL for issue resolution)

**Review Criteria**:
- All acceptance criteria met?
- Edge cases handled?
- Error states implemented?
- Analytics tracking added?
- Tests cover critical paths?
- Accessibility requirements met?
- Performance acceptable?

**Configuration**: `.claude/agents/quality-reviewer.md`

---

## Coordination Mechanisms

### 1. Shared Documents

**User Story Files** (`docs/user-stories/US-XXX.md`):
- Source of truth for requirements
- All agents read this for context
- Updated throughout lifecycle

**ADRs** (`docs/adr/NNN-title.md`):
- Architectural guardrails
- All agents follow ADR decisions
- Architecture agent maintains

**CLAUDE.md**:
- Project-wide instructions
- All agents reference this
- Points to detailed guides

### 2. HITL Checkpoints

**Gate 1: User Stories**
- Product Manager creates stories
- Human reviews and approves
- Architecture Agent waits for approval

**Gate 2: ADRs**
- Architecture Agent creates ADRs
- Human reviews and approves
- Developers wait for approval

**Gate 3: Tech Specs**
- Developers create specs
- Human reviews contracts
- Implementation waits for approval

**Gate 4: QA Issues**
- Quality Reviewer finds issues
- Human decides resolution
- Agents proceed based on decision

### 3. Agent Communication Protocol

**Reading Previous Work**:
```markdown
# Frontend Developer Agent reads:
1. US-001.md - Requirements and acceptance criteria
2. ADR-003.md - State management decision
3. Technical spec in US-001.md - API contracts
4. Existing components/ directory - Reusable components
```

**Writing for Next Agent**:
```markdown
# Backend Developer Agent writes:
1. ZenStack models with clear comments
2. Generated tRPC routes (auto-documented)
3. Technical spec section in US-001.md
4. Unit tests (documentation via tests)
```

### 4. Research-First Protocol

**Before Implementing Anything**:

1. **Search Codebase**:
   ```bash
   rg "similar-functionality" --type ts
   find components/ -name "*ComponentName*"
   ```

2. **Check Documentation**:
   - Read relevant ADRs
   - Check user story requirements
   - Review existing patterns

3. **Web Search** (if new library/API):
   - "[library] getting started 2025"
   - "[library] next.js integration"
   - "[library] github examples"

4. **Create HITL** (if docs login-gated):
   - Pause this task
   - Create HITL file
   - Continue with other tasks

## Example: Complete User Story Flow

### Scenario: US-015 "User Preferences Feature"

#### Phase 1: Story Creation

**Product Manager Agent**:
1. Reads README.md business goals
2. Creates US-015.md with:
   - User story format
   - RICE scoring (P0)
   - Acceptance criteria
   - Dependencies
3. Adds to docs/user-stories.md index
4. Creates HITL for batch review

**HITL Checkpoint #1**:
- Human reviews US-015
- Marks APPROVED
- Runs `pnpm hitl:resume`

#### Phase 2: Architecture

**Architecture Agent**:
1. Reads US-015.md requirements
2. Identifies need for ADR-003 (state management)
3. Researches options (Context, Redux, Zustand)
4. Creates ADR-003.md (DRAFT)
5. Creates HITL for review

**HITL Checkpoint #2**:
- Human reviews ADR-003
- Marks APPROVED
- Runs `pnpm hitl:resume`

#### Phase 3: Technical Specification

**Backend Developer Agent**:
1. Reads US-015.md and ADR-003
2. Designs UserPreference model
3. Defines access control
4. Documents API contract in US-015.md
5. Waits for frontend spec

**Frontend Developer Agent**:
1. Reads US-015.md and ADR-003
2. Designs PreferenceForm component
3. Plans Zustand store structure
4. Documents component hierarchy in US-015.md
5. Verifies API contract matches backend

**UI Designer Agent**:
1. Creates component spec
2. Adds mockup to docs/design-mockups/
3. Links in US-015.md

**Coordination**:
- Both read same requirements
- API contract agreed in US-015.md
- Both use ZenStack types
- Designer provides UI guidance

**HITL Checkpoint #3**:
- Human reviews tech specs
- Verifies frontend/backend alignment
- Marks APPROVED
- Runs `pnpm hitl:resume`

#### Phase 4: Implementation (Parallel)

**Backend Developer Agent**:
1. Creates `zschema/user-preference.zmodel`
2. Adds import to `auth.zmodel`
3. Runs `pnpm gen:check`
4. Creates migration
5. Writes unit tests
6. Marks backend complete

**Frontend Developer Agent** (in parallel):
1. Creates `components/preferences/PreferenceForm.tsx`
2. Uses generated `useUserPreference` hook
3. Implements Zustand store
4. Adds form validation
5. Writes component tests
6. Marks frontend complete

**Coordination**:
- Both use generated types (type safety)
- Frontend uses backend's tRPC routes
- No custom integration needed
- Tests verify contract

#### Phase 5: Quality Review

**Quality Reviewer Agent**:
1. Reads US-015.md acceptance criteria
2. Tests all criteria:
   - ✅ User can save preferences
   - ✅ Preferences persist across sessions
   - ✅ Validation works correctly
   - ✅ Error states display properly
   - ✅ Loading states implemented
   - ❌ **Issue**: Theme changes don't apply until refresh
3. Creates HITL with issue

**HITL Checkpoint #4**:
- Human reviews issue
- Decides: Fix immediately
- Marks decision in HITL
- Runs `pnpm hitl:resume`

**Frontend Developer Agent** (fix):
1. Reads HITL decision
2. Adds real-time theme application
3. Updates US-015.md
4. Re-runs tests

**Quality Reviewer Agent** (re-check):
1. Verifies fix
2. All criteria now pass
3. Marks US-015 complete

#### Phase 6: Session Summary

**Session Summary Agent**:
1. Triggered by "batch complete"
2. Collects:
   - Git commits
   - US-015 completed
   - ADR-003 created
   - Files changed
3. Generates `docs/sessions/session-2025-01-15.md`

**Human**: Reviews summary, adds deployment notes

---

## Anti-Patterns to Avoid

### ❌ Agents Working in Silos

**Problem**: Backend implements API without frontend input
**Solution**: Tech spec phase aligns contracts before implementation

### ❌ Duplicating Work

**Problem**: Frontend creates custom tRPC client
**Solution**: Research-first protocol finds generated hooks

### ❌ Skipping HITL

**Problem**: Architecture agent proceeds without ADR approval
**Solution**: HITL gates prevent unauthorized progress

### ❌ Hallucinating APIs

**Problem**: Agent assumes library has certain method
**Solution**: Web search verification before implementation

### ❌ Circular Dependencies

**Problem**: Frontend agent waits for backend, backend waits for frontend
**Solution**: Tech spec phase defines contract upfront

## Best Practices

### ✅ Clear Handoffs

Each agent documents:
- What they did
- What's ready for next agent
- Any blockers or questions

### ✅ Shared Context

All agents read:
- User stories (requirements)
- ADRs (architectural decisions)
- CLAUDE.md (process guidance)

### ✅ Research Before Implementing

All agents:
- Search codebase first
- Check documentation
- Web search for latest practices
- Create HITL if blocked

### ✅ Explicit Contracts

API contracts defined in tech spec:
- Input/output types
- Error handling
- Loading states
- Validation rules

### ✅ Quality Gates

Quality reviewer ensures:
- All acceptance criteria met
- Tests passing
- Performance acceptable
- Accessibility compliant

## Monitoring Agent Coordination

### Signs of Good Coordination

- ✅ Minimal HITL revision cycles
- ✅ Frontend/backend types align
- ✅ No duplicate code created
- ✅ Tests pass on first try
- ✅ Clear handoff notes

### Signs of Poor Coordination

- ❌ Multiple HITL revisions for same decision
- ❌ Type mismatches between FE/BE
- ❌ Duplicate functionality created
- ❌ Test failures after integration
- ❌ Unclear what's ready for next agent

## Summary

Agent coordination in this project:

1. **Specialized Roles**: Each agent has clear expertise
2. **Sequential + Parallel**: Handoffs when dependent, parallel when independent
3. **Shared Documents**: User stories and ADRs provide context
4. **HITL Gates**: Human approval at key checkpoints
5. **Research-First**: All agents verify before implementing
6. **Clear Contracts**: Tech specs align frontend/backend

**Key Principle**: Agents are autonomous but coordinated through shared documents and HITL gates.

---

**See Also**:
- `docs/WORKFLOW_GUIDE.md` - Complete workflow
- `docs/HITL_GUIDE.md` - HITL batch process
- `.claude/agents/*` - Individual agent configurations
