# Architecture Decision Records (ADR) Process

Guide to creating, reviewing, and maintaining Architecture Decision Records in this project.

## What is an ADR?

An Architecture Decision Record (ADR) documents an important architectural decision made during the project, including its context, the decision itself, and its consequences.

## When to Create an ADR

Create an ADR when making decisions about:

### Technology Choices

- Selecting libraries or frameworks
- Choosing databases or storage solutions
- Picking testing frameworks
- Selecting build tools or bundlers

### Architecture Patterns

- State management strategy
- Authentication/authorization approach
- API design patterns
- Data modeling strategies
- Caching strategies

### Infrastructure

- Deployment platforms
- CI/CD pipelines
- Monitoring and logging
- Service integrations

### Significant Changes

- Breaking changes to existing patterns
- Major refactoring decisions
- Deprecating existing approaches

## When NOT to Create an ADR

Don't create ADRs for:

- Trivial implementation details
- Temporary solutions (mark as TODO instead)
- Decisions easily reversible
- Standard best practices (document in guides instead)

## ADR Lifecycle

### Status Flow

```
DRAFT → APPROVED → DEPRECATED → SUPERSEDED
         ↓
      REJECTED
```

- **DRAFT**: Proposed decision awaiting review
- **APPROVED**: Decision accepted and active
- **REJECTED**: Proposal not accepted
- **DEPRECATED**: No longer recommended, but not replaced
- **SUPERSEDED**: Replaced by newer ADR (link to replacement)

## Creating an ADR

### Step 1: Determine if ADR is Needed

Ask these questions:

1. Is this decision significant and long-lasting?
2. Will future developers need to understand why we made this choice?
3. Does this affect multiple parts of the system?
4. Are there trade-offs to consider?

If yes to 2+, create an ADR.

### Step 2: Number the ADR

ADRs are numbered sequentially:

```bash
# Find next number
ls docs/adr/*.md | grep -E '[0-9]' | tail -n 1

# Next available: NNN
```

Format: `NNN-kebab-case-title.md`

- Example: `003-state-management-zustand.md`

### Step 3: Use the Template

Copy `docs/adr/template.md`:

```bash
cp docs/adr/template.md docs/adr/003-your-decision.md
```

### Step 4: Fill in the Sections

#### Title

Clear, specific description:

- ✅ "Use Zustand for Client State Management"
- ❌ "State Management"

#### Status

Start as `DRAFT` if awaiting approval, or `APPROVED` if already decided.

#### Date

Date of decision (not creation):

- `YYYY-MM-DD`

#### Author

Your name and email:

- `John Doe <john@example.com>`

#### Context

**What problem are we solving?**

Explain:

- Current situation
- Why we need to make this decision
- Constraints or requirements
- Relevant background

Example:

```markdown
## Context

Our application needs client-side state management for:

- User preferences (theme, locale, sidebar state)
- Shopping cart data (before checkout)
- Real-time notifications (WebSocket data)

Current situation:

- Using React Context for some state
- Props drilling in many components
- No persistent state across sessions
- Performance issues with frequent re-renders

Requirements:

- TypeScript support
- Small bundle size
- Easy to test
- Persistent state capability
- DevTools for debugging
```

#### Decision

**What approach are we taking and why?**

Be specific:

- State the decision clearly
- Explain why this approach
- How it solves the problem

Example:

```markdown
## Decision

We will use **Zustand** for client-side state management.

Implementation approach:

- Create separate stores for different domains (user, cart, notifications)
- Use middleware for persistence (localStorage/sessionStorage)
- Integrate with React via hooks
- Combine with tRPC for server state

Why Zustand:

1. **Simplicity**: Minimal boilerplate, easy to learn
2. **Performance**: Fine-grained reactivity, no unnecessary re-renders
3. **TypeScript**: Excellent type inference
4. **Size**: ~1KB gzipped
5. **DevTools**: Support for Redux DevTools
6. **Middleware**: Built-in persistence, immer, devtools
```

#### Consequences

**What becomes easier or more difficult?**

List both positive and negative:

Example:

```markdown
## Consequences

### Positive

- **Simpler code**: Less boilerplate than Redux
- **Better performance**: Component re-renders only when relevant state changes
- **Smaller bundle**: Zustand is ~1KB vs Redux ~3KB
- **TypeScript friendly**: Strong type inference without manual typing
- **Easy testing**: Stores are plain JavaScript, no framework coupling
- **Persistent state**: Middleware makes localStorage integration simple

### Negative

- **Less structure**: More freedom can lead to inconsistent patterns
- **Smaller community**: Fewer examples than Redux/MobX
- **No time-travel**: While DevTools work, replay isn't native
- **Learning curve**: Team needs to learn new library

### Neutral

- **Different from previous projects**: Team used Redux before
- **Migration needed**: Will need to migrate Context-based code
```

#### Alternatives Considered

**What other options were evaluated?**

List at least 2-3 alternatives:

Example:

```markdown
## Alternatives Considered

### Alternative 1: Redux Toolkit

**Pros**:

- Industry standard, large community
- Excellent DevTools
- Time-travel debugging
- Team familiar with Redux

**Cons**:

- More boilerplate even with Toolkit
- Larger bundle size (~3KB)
- Overkill for our state needs
- Steeper learning curve for new developers

### Alternative 2: Jotai

**Pros**:

- Atomic state management
- Even smaller than Zustand
- Modern approach

**Cons**:

- Less mature than Zustand
- Smaller community
- Different paradigm from what team knows

### Alternative 3: React Context + useReducer

**Pros**:

- No additional dependencies
- Already using in some places
- Team familiar

**Cons**:

- Performance issues with frequent updates
- Requires more boilerplate
- No built-in persistence
- Props drilling still needed
- Hard to debug
```

#### Related

Link to related ADRs, docs, issues:

Example:

```markdown
## Related

- Related to ADR-001 (Authentication Strategy) - shares user state
- Supersedes informal decision to use Context API
- See `docs/research/state-management-comparison.md` for detailed analysis
- GitHub Issue: #45 (State management discussion)
```

### Step 5: HITL Review

If created by Claude Code:

1. ADR is marked as DRAFT
2. HITL file created for approval
3. Human reviews in batch
4. If approved, update status to APPROVED
5. If rejected, update status to REJECTED with reasoning

## Reviewing an ADR

### Review Checklist

- [ ] **Title is clear**: Can you understand the decision from title alone?
- [ ] **Context is sufficient**: Do you understand why this decision is needed?
- [ ] **Decision is specific**: Is it clear exactly what we're doing?
- [ ] **Consequences are honest**: Are negatives acknowledged, not just positives?
- [ ] **Alternatives considered**: Were other options fairly evaluated?
- [ ] **Links provided**: Are related ADRs and resources referenced?

### Common Feedback

**Missing Context**:

- "Why are we solving this now?"
- "What prompted this decision?"

**Vague Decision**:

- "Be more specific about implementation"
- "Define boundaries of this decision"

**Unbalanced Consequences**:

- "What are the downsides?"
- "This seems too optimistic"

**Insufficient Alternatives**:

- "What else did we consider?"
- "Why not approach X?"

## Maintaining ADRs

### When to Update

**Don't update ADRs** unless:

- Fixing typos or clarity
- Adding links to related ADRs
- Updating status

**Create new ADR** instead when:

- Changing the decision
- Addressing new requirements
- Learning new information

### Deprecating an ADR

When an approach is no longer recommended:

1. Update ADR file:

   ```markdown
   **Status**: DEPRECATED
   **Date**: 2025-01-20
   **Deprecated By**: ADR-007 (New State Management Approach)

   **Deprecation Reason**:
   Zustand didn't scale well for our complex state needs.
   Moving to Redux Toolkit for better DevTools and middleware.
   ```

2. Create new ADR explaining new approach

3. Link between old and new

### Superseding an ADR

When replacing an old decision:

1. Create new ADR with new decision
2. Update old ADR:
   ```markdown
   **Status**: SUPERSEDED
   **Superseded By**: ADR-007 (State Management with Redux Toolkit)
   **Date**: 2025-01-20
   ```
3. Link new ADR back to old one

## Example ADR Flow

### Scenario: Choosing State Management

**Day 1: Research Phase**

- Product manager creates US-015 (User Preferences)
- Backend developer notes need for client state
- Creates `docs/research/state-management-options.md`

**Day 2: Proposal**

- Architecture agent identifies need for ADR
- Creates `docs/adr/003-state-management-zustand.md` (DRAFT)
- Creates HITL request in batch

**Day 3: Review**

- Human reviews HITL batch
- Questions: "Why not Redux Toolkit?"
- Marks NEEDS_REVISION with feedback

**Day 4: Revision**

- Architecture agent adds Redux Toolkit to alternatives
- Explains why Zustand is better fit
- Updates HITL file

**Day 5: Approval**

- Human reviews revision
- Marks APPROVED
- ADR status changed to APPROVED
- Implementation begins

**3 Months Later: Revisit**

- Team has outgrown Zustand
- Create ADR-007 (Redux Toolkit)
- Mark ADR-003 as SUPERSEDED
- Migration plan in new ADR

## Best Practices

### Writing Style

**Be Honest**:

- Acknowledge trade-offs
- Don't oversell a decision
- Be clear about uncertainties

**Be Specific**:

- Avoid vague language
- Provide examples
- Link to resources

**Be Concise**:

- One decision per ADR
- Focus on "why" not "how"
- Implementation details go in code comments

### Common Anti-Patterns

❌ **The Obvious ADR**:
"We will use React because this is a React project"
→ Don't document decisions that are already established

❌ **The Novel ADR**:
3000 words about every possible consideration
→ Keep it focused and scannable

❌ **The Sales Pitch**:
Only lists positives, ignores downsides
→ Be balanced and honest

❌ **The Vague ADR**:
"We will use best practices for state management"
→ Be specific about what you're doing

✅ **The Good ADR**:

- Clear problem statement
- Specific decision
- Honest consequences
- Fair comparison of alternatives
- Concise (500-1000 words)

## Templates & Examples

### Available Templates

- **Main Template**: `docs/adr/template.md`
- **Example ADR**: `docs/adr/ADR-001-example.md` (created in this project)

### Example Titles

Good ADR titles:

- "Use Zustand for Client-Side State Management"
- "Implement Multi-Tenancy with Organization Model"
- "Deploy to Vercel with Neon for Database"
- "Use Better Auth for Authentication with OAuth"
- "Cache tRPC Queries with TanStack Query"

Poor ADR titles:

- "State Management" (too vague)
- "Fix Performance Issues" (not a decision)
- "Update Authentication" (not specific)

## ADR Checklist

When creating an ADR:

- [ ] Numbered sequentially
- [ ] Title is clear and specific
- [ ] Status is set (DRAFT or APPROVED)
- [ ] Date is included
- [ ] Author is identified
- [ ] Context explains the problem
- [ ] Decision is specific and actionable
- [ ] Consequences list both positives and negatives
- [ ] At least 2 alternatives considered
- [ ] Related ADRs linked
- [ ] Ready for HITL review (if DRAFT)

## FAQ

**Q: How many ADRs should we have?**
A: Quality over quantity. A mature project might have 10-30 ADRs. If you have hundreds, you're probably documenting too much.

**Q: Can I update an old ADR?**
A: Only for typos or clarity. For significant changes, create a new ADR and mark the old one as superseded.

**Q: What if we made a wrong decision?**
A: Create a new ADR with the correct decision and mark the old one as deprecated or superseded. Keep the old ADR for historical context.

**Q: Do I need an ADR for every library choice?**
A: No. Only for significant, project-impacting decisions. Using lodash? No ADR. Choosing GraphQL vs tRPC? Yes, ADR.

**Q: Should ADRs include code?**
A: Minimal code examples are fine for clarity. Detailed implementation goes in the codebase with comments.

## Summary

ADRs help us:

- ✅ Document significant decisions
- ✅ Understand why we made choices
- ✅ Avoid repeating past mistakes
- ✅ Onboard new team members
- ✅ Maintain architectural consistency

**Key Principle**: Write ADRs for your future self who forgot why this decision was made.
