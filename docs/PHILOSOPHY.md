# Project Philosophy

**Last Updated**: 2025-11-16

---

## Core Principle: Agentic First

This template embodies a fundamental shift in how we build software: **Hire Agents First, Then People**.

### What This Means

Every business function—from product management to compliance to market research—must first be represented by an **autonomous AI agent** before considering human resources for that role.

**Why**:
- Agents provide **24/7 availability** and **instant scalability**
- Agents follow **documented processes** and create **audit trails**
- Agents reduce **cognitive load** on humans by handling routine decisions
- Agents enable **small teams** to operate like much larger organizations

**When Humans Are Essential**:
- Strategic decision-making (C-level choices, pivots, acquisitions)
- Ethical judgment and edge cases requiring empathy
- Final approval at HITL (Human-in-the-Loop) gates
- Customer-facing relationships requiring trust

---

## The Five Pillars

### 1. Governance Through HITL

**Principle**: Humans govern, agents execute.

Agents operate autonomously within boundaries, but humans maintain final authority through **4 mandatory HITL gates**:

1. **User Stories** - Approve feature priorities before architecture
2. **ADRs** - Approve technical decisions before implementation
3. **Tech Specs** - Approve API contracts before coding
4. **QA Issues** - Decide on fix/defer/refine for discovered problems

**Batch Review Philosophy**: Consolidate 10-20 decisions into a single review session rather than constant interruptions. This respects human attention while maintaining oversight.

**Source**: IBM/Anthropic Agent Development Lifecycle (2025) - "HITL is non-negotiable for enterprise AI agents."

---

### 2. Declarative Goals Over Imperative Instructions

**Principle**: Define *what* (goals) and *constraints* (guardrails), not *how* (implementation).

**Examples**:

✅ **Good (Declarative)**:
```
Goal: Users can only access their own data
Guardrail: ZenStack @@allow policy enforces ownership
```

❌ **Bad (Imperative)**:
```
Instruction: Add if-check in every API route to verify user.id === record.userId
```

**Why Declarative**:
- Agents can explore multiple implementation approaches
- Constraints prevent dangerous actions (security, data loss)
- Goals allow creativity within safe boundaries

**Implementation**:
- **ADRs** define architectural guardrails ("use ZenStack for access control")
- **User Stories** define goals ("users can export their data")
- **ZenStack policies** enforce constraints declaratively (`@@allow`)

**Source**: Architecture & Governance Magazine (2025) - "Agentic SDLC requires declarative constraints."

---

### 3. Evaluation Suites Capture Failure Modes

**Principle**: Every bug becomes a regression test. Every edge case becomes an eval scenario.

Traditional QA validates happy paths. Agentic QA builds **evaluation suites** that evolve:

**Process**:
1. Bug is discovered (e.g., "empty array crashes dashboard")
2. Quality Reviewer creates regression test for that specific failure
3. Test is added to **failure modes suite**
4. Future iterations can never reintroduce that bug

**Eval Suite Structure**:
- `__tests__/failure-modes/` - Captured regression tests
- `__tests__/adversarial/` - Security and robustness tests (SQL injection, XSS)
- `__tests__/e2e/` - Full user flows (Playwright)

**Soft Failures**: Unlike traditional CI/CD (hard pass/fail), agent systems allow "soft failures" where outputs are scored on a spectrum. A response can be 85% correct rather than binary pass/fail.

**Source**: Confident AI (2025) - "Failure mode capture is the unlock for AI agent quality."

---

### 4. Research-First Development

**Principle**: Never implement without evidence. Never assume APIs exist.

**Anti-Hallucination Protocol**:

Before writing any code:
1. **Search codebase** for existing solutions (don't duplicate)
2. **Web search** for official documentation (verify APIs exist)
3. **Find examples** in official repos or tutorials
4. **Create HITL** if documentation is login-gated

**For Every New Library**:
```
1. Web search: "[library] getting started 2025"
2. Web search: "[library] nextjs integration"
3. Web search: "[library] github examples"
4. If docs require login → HITL, continue other tasks
```

**Why This Matters**:
- Agents can hallucinate non-existent APIs
- 2025 documentation is more reliable than 2023 patterns
- Official examples prevent integration mistakes

**Zero Tolerance**: If an agent creates code based on hallucinated APIs, the agent's instructions must be updated to require more verification.

---

### 5. Real-Time Embedded Governance

**Principle**: Governance is not periodic paperwork—it's continuous, automated, and observable.

**Observability Requirements**:
- **Audit logs** capture who/what/when/where for every sensitive action
- **Monitoring dashboards** track error rates, latency, user flows
- **Alerting** notifies humans when thresholds breach
- **Retention policies** comply with GDPR (30-90 days for most data)

**Audit Trail Format** (see `docs/adr/ADR-008`):
```json
{
  "timestamp": "2025-11-16T10:30:00Z",
  "actor": "urn:user:01JCQX8QZKE9W8H4N2F1RSTVBG",
  "action": "user.profile.update",
  "resource": "urn:profile:01JCQX8QZKE9W8H4N2F1RSTVBG",
  "changes": { "email": "old@example.com -> new@example.com" },
  "ip": "192.168.1.1",
  "success": true
}
```

**Governance as Code**:
- ZenStack `@@allow` policies are governance rules
- Database migrations include rollback instructions
- Feature flags enable instant rollback without deploys

**Source**: Gartner (2025) - "Agentic AI requires real-time governance, not quarterly audits."

---

## Operating Principles

### Autonomy with Accountability

**Agents Have**:
- Authority to make implementation decisions within ADR guardrails
- Responsibility to document decisions (ADRs, comments, tests)
- Obligation to create HITL when uncertainty exists

**Agents Don't Have**:
- Authority to skip HITL gates
- Permission to implement without research
- Freedom to choose technologies contradicting existing ADRs

### Parallel Execution When Independent

**Sequential** (dependencies):
```
Product Manager → Architecture Agent → Developers → QA
```

**Parallel** (independent):
```
Frontend Developer ⟺ Backend Developer (shared API contract)
Market Analyst ⟺ Compliance Agent (independent research)
```

**Coordination**: Shared documents (User Stories, ADRs, Tech Specs) keep parallel agents aligned.

### Fail Fast, Learn Faster

**When Things Go Wrong**:
1. **Document the failure** in session summary
2. **Create regression test** to prevent recurrence
3. **Update agent instructions** if process failed
4. **Create ADR** if architectural decision caused issue

**Never**:
- Hide failures or ship broken code
- Skip tests to meet deadlines
- Ignore tech debt (create stories for it)

### Deterministic Over Clever

**Prefer**:
- ZenStack-generated tRPC routes over custom API handlers
- Generated TanStack Query hooks over manual fetching
- Declarative access policies over imperative checks

**Why**: Generated code is:
- Type-safe by default
- Tested by the framework
- Documented automatically
- Consistent across the codebase

---

## Cultural Values

### 1. Documentation as Artifact

Code comments explain *why*, not *what*.

```typescript
// ❌ Bad
// Loop through users
users.forEach(u => ...)

// ✅ Good
// Pre-fetch user preferences to avoid N+1 queries in the render loop
// See ADR-015 for performance benchmarks
users.forEach(u => ...)
```

Every significant decision has an ADR. Every feature has a User Story. Every session has a summary.

### 2. Quality is Non-Negotiable

Ship fast, but never ship broken:
- All tests must pass (`pnpm test`)
- Type-check must pass (`pnpm build`)
- Linting must pass (`pnpm lint`)
- Accessibility must meet WCAG 2.1 AA

If QA finds critical issues, create HITL—don't rush the fix.

### 3. Security by Default

- Never trust user input (validate with Zod)
- Never skip authentication (ZenStack `@@allow`)
- Never log secrets (mask in observability)
- Never deploy without migration rollback plan

### 4. User Value Over Technical Perfection

**Prefer**:
- Working MVP over perfect architecture
- User feedback over assumptions
- A/B testing over opinions

**But**:
- Security and data integrity are never compromised
- Accessibility is not optional
- Technical debt must be tracked (create stories)

---

## Decision Framework

When faced with a choice, agents (and humans) use this hierarchy:

### Level 1: Is there an existing ADR?
✅ Follow the ADR (don't relitigate decisions)
❌ No ADR? → Check if significant enough to create one

### Level 2: Is there a codebase pattern?
✅ Follow established patterns (consistency > novelty)
❌ No pattern? → Create one and document

### Level 3: Is there official documentation?
✅ Follow official best practices (research-first)
❌ Conflicting sources? → Create HITL for decision

### Level 4: Create HITL
If the decision is:
- Ambiguous (multiple valid approaches)
- High-stakes (security, data, breaking changes)
- Unprecedented (no ADR, no pattern, no docs)

**Never Guess**: HITL is cheaper than production incidents.

---

## Workflow Philosophy

### The 7-Phase Rhythm

Every feature flows through the same cycle:

```
1. Business Plan (README.md) - What and why
2. User Stories (RICE scoring) - Who wants what
3. Architecture (ADRs) - How we'll build it
4. Tech Specs (Contracts) - Detailed design
5. Implementation (Parallel FE+BE) - Build it
6. Quality Review (Eval suites) - Validate it
7. Session Summary (Documentation) - Remember it
```

**Why This Order**:
- Business justifies investment (no "because it's cool" features)
- Architecture prevents rework (decide before coding)
- Parallel execution maximizes velocity (FE+BE simultaneously)
- QA prevents regression (eval suites evolve)

### HITL Gates as Quality Checkpoints

HITL is not bureaucracy—it's **batch decision-making**:

**Without HITL**: Human interrupted 50 times for micro-decisions
**With HITL**: Human reviews 20 decisions in 30 minutes, once

**Batch Efficiency**:
- Product Manager creates 10 user stories → 1 HITL review
- Architecture Agent creates 3 ADRs → 1 HITL review
- Quality Reviewer finds 5 issues → 1 HITL review

---

## Technology Philosophy

### Generated Over Manual

**Prefer**:
- ZenStack models → Prisma schema → tRPC routes → React hooks
- Tailwind utilities over custom CSS
- Zod schemas for validation
- TypeScript for everything

**Why**: Generated code is type-safe, tested, and consistent.

### Type Safety is Non-Negotiable

TypeScript everywhere:
- No `any` types (use `unknown` if truly dynamic)
- Strict mode enabled
- Shared types between FE/BE (tRPC)

**Why**: Catch bugs at compile-time, not production.

### Access Control at Schema Level

Use ZenStack `@@allow` policies, not imperative checks:

```zmodel
model Post {
  id String @id
  author User @relation(fields: [authorId], references: [id])
  authorId String

  // ✅ Declarative access control
  @@allow('read', true)
  @@allow('create,update,delete', auth() == author)
}
```

**Why**: Access control is **impossible to bypass** when enforced at schema level.

### Observability from Day One

Not "we'll add logging later"—logging is **part of the feature**:

- Every sensitive action creates audit log
- Every API call tracked for performance
- Every error captured with context
- Every deployment has rollback instructions

---

## Continuous Improvement

### This Philosophy Evolves

When we discover better approaches:
1. Create ADR documenting the new approach
2. Update this philosophy document
3. Deprecate old patterns (don't just delete)
4. Update agent instructions

**Example**: If we discover Zustand doesn't scale, create ADR-XXX for Redux Toolkit, mark ADR-003 as superseded, update this doc.

### Agent Instructions Are Living Documents

If an agent repeatedly creates HITL for the same type of decision:
→ Update agent instructions with clearer guidance
→ Create ADR to establish pattern
→ Add examples to agent's process section

**Agents should get more autonomous over time, not less.**

---

## Summary

This template operationalizes a philosophy of **Agentic First** development where:

1. **Agents handle routine decisions** (implementation details, pattern following)
2. **Humans handle strategic decisions** (architecture, priorities, edge cases)
3. **HITL gates provide governance** (batch reviews, not micromanagement)
4. **Evaluation suites prevent regression** (failures become tests)
5. **Research prevents hallucination** (verify before implementing)
6. **Observability enables accountability** (audit trails, monitoring)
7. **Documentation is mandatory** (ADRs, User Stories, Session Summaries)

**The Goal**: Small teams with AI agents operate like much larger organizations, shipping faster while maintaining quality, security, and compliance.

**The Constraint**: Never sacrifice user trust, data integrity, or security for velocity.

---

**See Also**:
- `docs/WORKFLOW_GUIDE.md` - How the 7-phase process works
- `docs/HITL_GUIDE.md` - How batch HITL reviews work
- `docs/adr/README.md` - How to create Architecture Decision Records
- `.claude/agents/README.md` - How agents coordinate
- `docs/AGENT_HIRING_CHECKLIST.md` - Which agents exist for which functions
