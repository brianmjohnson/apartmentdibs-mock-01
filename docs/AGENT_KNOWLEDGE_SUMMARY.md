# Agent Knowledge Summary

**Purpose**: Comprehensive reference of all AI agent capabilities, knowledge domains, and coordination patterns

**Last Updated**: 2025-11-22

---

## Table of Contents

1. [Product Development Agents](#product-development-agents)
2. [Business Operations Agents](#business-operations-agents)
3. [Task-Specific Agents](#task-specific-agents)
4. [Agent Coordination Patterns](#agent-coordination-patterns)

---

## Product Development Agents

### Architecture Agent

**Role**: Technical Decision Making & Architecture Documentation

**Inputs Required**:
- README.md (business goals and constraints)
- Approved user stories from `docs/user-stories/`
- Existing ADRs in `docs/adr/`
- Current system design (`docs/ARCHITECTURE.md`)

**Outputs Produced**:
- Architecture Decision Records (ADRs) in `docs/adr/` with DRAFT status
- Technical recommendations and research findings
- Updated/deprecated ADRs with appropriate status changes
- HITL files for ADR approval

**Domain Knowledge**:
- **Architectural Principles**:
  - Type Safety First (full-stack TypeScript)
  - Generated Over Custom (use ZenStack-generated code)
  - Schema-Level Access Control (policies in ZenStack)
  - Convention Over Configuration
  - Performance Matters (bundle size, lazy loading, caching)
  - Developer Experience (hot reload, inferred types, clear errors)

- **Decision Categories**:
  - Technology choices (libraries, frameworks, tools)
  - Architectural patterns (state management, auth, API design)
  - Data modeling decisions
  - Infrastructure choices (hosting, storage, caching)
  - Integration decisions (third-party services, APIs)

- **Common Decision Patterns**:
  - State Management: Zustand (default), Jotai, Redux Toolkit, React Context
  - Authentication: Better Auth (in template)
  - File Storage: Vercel Blob (integrated), AWS S3, Cloudinary
  - Real-time: Polling (start), SSE, WebSockets, Pusher/Ably

**Key Instructions**:
- Research options thoroughly (codebase search, web search, documentation)
- Compare at least 2-3 alternatives for each decision
- Be specific and honest about trade-offs
- Create HITL for approval before proceeding
- Link related ADRs
- Avoid hype-driven decisions

**Dependencies**:
- **Receives from Product Manager**: User stories, business constraints, success criteria
- **Provides to Backend/Frontend Developers**: Data modeling patterns, API design, architectural guardrails
- **Coordinates with UX Researcher**: Performance requirements, accessibility needs

---

### Product Manager Agent

**Role**: Feature Definition & Prioritization

**Inputs Required**:
- README.md (business plan, target users, success metrics)
- docs/ARCHITECTURE.md (technical constraints)
- Market research and user feedback
- Existing backlog (`docs/user-stories.md`)

**Outputs Produced**:
- `docs/user-stories.md` (master index with status tracking)
- `docs/user-stories/US-XXX.md` (detailed story files)
- RICE scoring for prioritization
- Analytics tracking requirements
- HITL batch files for story approval

**Domain Knowledge**:
- **User Story Format**:
  ```
  As a [user role/persona]
  I want to [action/capability]
  So that [benefit/value]
  ```

- **RICE Scoring Framework**:
  - **Reach**: How many users per time period (specific numbers)
  - **Impact**: How much value (3=Massive, 2=High, 1=Medium, 0.5=Low)
  - **Confidence**: How sure are we (100%=Certain, 80%=High, 50%=Medium, 20%=Low)
  - **Effort**: Person-weeks to implement (Design + FE + BE + Testing + QA)
  - **Score** = (Reach × Impact × Confidence) / Effort

- **Prioritization Tiers**:
  - **P0 (MVP)**: Core value prop, can't launch without, RICE 800+
  - **P1 (Important)**: Significant value, launch soon after, RICE 400-800
  - **P2 (Nice to Have)**: Good to have, defer to later, RICE 100-400
  - **P3 (Future)**: Low priority, future releases, RICE <100

- **INVEST Criteria** (stories should be):
  - Independent, Negotiable, Valuable, Estimable, Small, Testable

**Key Instructions**:
- Write user-focused stories (not technical tasks)
- Include specific acceptance criteria (Given/When/Then format)
- Define analytics events for feature tracking
- Create HITL batch for approval before proceeding
- Right-size stories (fits in one sprint)

**Dependencies**:
- **Receives from UX Researcher**: User insights, pain points, validation results
- **Provides to Architecture Agent**: Requirements for technical decisions
- **Provides to Developers**: Detailed acceptance criteria, user flows, success metrics
- **Coordinates with UI Designer**: User personas, feature requirements

---

### Frontend Developer Agent

**Role**: UI Implementation, Client Logic, Component Development

**Inputs Required**:
- Approved user stories (`docs/user-stories/US-XXX.md`)
- Technical specifications
- ADRs for guidance
- UI mockups/specs from `docs/design-mockups/`

**Outputs Produced**:
- React components (Next.js 15+ App Router)
- Client-side logic with TanStack Query
- Form validation with Zod schemas
- Component tests
- Analytics event tracking

**Domain Knowledge**:
- **Core Technologies**:
  - React, Next.js 15+, TypeScript 5.9+
  - TanStack Query v5 (generated hooks)
  - shadcn/ui components
  - Tailwind CSS, lucide icons
  - PlateJs for rich-text editing
  - Zustand for state management

- **Generated Hooks (CRITICAL - DO NOT CREATE CUSTOM)**:
  - ZenStack auto-generates ALL TanStack Query hooks
  - `useFindMany[Model]`, `useFindUnique[Model]`
  - `useCreate[Model]`, `useUpdate[Model]`, `useDelete[Model]`
  - `useInfiniteFindMany[Model]` for pagination
  - Only create custom hooks for: combining multiple queries, complex transformations, shared UI logic

- **Coding Standards**:
  - **HTML Entity Escaping**: Always escape `'` as `&apos;`, `"` as `&quot;`, `&` as `&amp;`
  - **Unused Variables**: Prefix with `_` to avoid lint warnings
  - **Third-Party Images**: Download to `/public/images/` instead of external links
  - **Analytics**: Track events using PostHog per US requirements

- **Component Patterns**:
  - Feature structure: Form, List, Card, Dialog, Filters
  - Loading states with Skeleton components
  - Error states with Alert components
  - Empty states with EmptyState component
  - Accessible (WCAG 2.1 AA compliance)

**Key Instructions**:
- **NEVER create custom tRPC hooks** - use generated hooks
- Search for existing components before creating new ones
- Use shadcn/ui components from `components/ui/`
- Implement loading, error, and empty states
- Add analytics events per US specifications
- Ensure keyboard navigation and ARIA labels
- Push after completing each story (atomic commits)

**Dependencies**:
- **Receives from Backend Developer**: API contracts, ZenStack-generated types
- **Receives from UI Designer**: Component specs, mockups, design tokens
- **Coordinates with Quality Reviewer**: Testing feedback

---

### Backend Developer Agent

**Role**: Data Models, Business Logic, API Implementation

**Inputs Required**:
- Approved user stories (`docs/user-stories/US-XXX.md`)
- Technical specifications
- ADRs for guidance
- Data requirements
- Existing schema files in `zschema/`

**Outputs Produced**:
- ZenStack models in `zschema/` with access control policies
- Business logic services in `lib/services/`
- Database migrations
- Unit tests
- Technical specifications in US files

**Domain Knowledge**:
- **Core Technologies**:
  - ZenStack 2.19+ (access control + code generation)
  - Prisma 6+ (database ORM)
  - tRPC v11 (type-safe API)
  - Better Auth 1.3+ (authentication)
  - PostgreSQL (Neon)

- **Generated Code (CRITICAL - DO NOT CREATE CUSTOM ROUTES)**:
  - ZenStack auto-generates ALL tRPC routes
  - Only create custom routes for: multi-model transactions, external API integrations, complex business logic, performance optimization
  - Run `pnpm gen:check` after ANY zmodel changes

- **ZenStack File Organization**:
  - **NEVER** put models directly in `schema.zmodel` (import-only file)
  - **Has user FK?** → Create in `zschema/<domain>.zmodel`, import in `zschema/auth.zmodel`
  - **No user FK?** → Create in `zschema/<domain>.zmodel`, import in `schema.zmodel`
  - **Mutual imports are expected** (ZenStack flattens before processing)

- **Bidirectional Foreign Key Relationships**:
  - MUST add relation field on BOTH models
  - MUST add reciprocal imports in BOTH zmodel files
  - Example: `Property` has `listings Listing[]`, `Listing` has `propertyId + property Property @relation(...)`

- **Access Control Patterns**:
  - **ACL** (Low complexity): Direct sharing (share with users A, B, C)
  - **RBAC** (Medium): Team roles (admin, editor, viewer)
  - **ABAC** (High): Attribute-based rules (same dept, same location)
  - **ReBAC** (Very High): Relationship-based (org members, friends)
  - **Recommendation**: Start with RBAC, add ACL for direct sharing if needed

- **CRUD Operations → Prisma Mapping**:
  - `create`: `create`, `createMany`, `upsert`, nested creates
  - `read`: `findMany`, `findUnique`, `count`, `aggregate`, `groupBy` (also controls return values of mutations)
  - `update`: `update`, `updateMany`, `upsert`, nested updates
  - `delete`: `delete`, `deleteMany`, nested deletes
  - `all`: Shorthand for all operations

- **Sensitive Data Marking**:
  - MUST use `@meta(sensitivity: "...")` for all sensitive fields
  - Categories: "personal information", "financial information", "health information", "confidential business information"
  - Additional security: `@password`, `@omit`, `@encrypted`, `@@deny('read', ...)`

- **Field Types**:
  - Primitives: String, Int, Float, Boolean, DateTime, BigInt, Decimal, Bytes
  - Special: Json (use typed `type` for safety), enum
  - Arrays: String[], Int[], etc.

- **Base Models**:
  - `BaseModel`: Includes id, createdAt, updatedAt
  - `BaseModelWithUser`: Adds createdBy, updatedBy
  - `ImmutableModel`: For audit logs (append-only, deny update/delete)

**Key Instructions**:
- **NEVER create custom tRPC routes** unless absolutely necessary (see valid reasons above)
- Always extend `BaseModel` or `BaseModelWithUser`
- Define access control policies in schema (not API layer)
- Use typed JSON for all Json fields (never raw `Json` type)
- Mark sensitive fields with `@meta(sensitivity)`
- Run `pnpm gen:check` after schema changes
- Create migrations with `pnpm db:migrate`
- Push after completing each story (atomic commits)

**Dependencies**:
- **Receives from Architecture Agent**: Data modeling patterns, access control approach
- **Provides to Frontend Developer**: API contracts via generated types
- **Coordinates with Compliance Agent**: Sensitive data tagging
- **Coordinates with Observability Agent**: Audit logging requirements

---

### UI Designer Agent

**Role**: Component Specifications & Visual Design

**Inputs Required**:
- User stories
- Brand guidelines
- Accessibility requirements (WCAG 2.1 AA)
- User personas

**Outputs Produced**:
- Component specifications in `docs/design-mockups/`
- Text-based mockups
- Layout descriptions
- Accessibility notes
- Design tokens and patterns

**Domain Knowledge**:
- **Style Guide Reference**: `docs/design-system/brutalist-style-guide.md`
  - Progressive elaboration for token optimization
  - Quick Reference (lines 1-50)
  - Component Patterns (lines 51-150)
  - Full Specifications (lines 151+)

- **Design Tokens**:
  - Colors: Tailwind CSS variables (primary, secondary, success, destructive, muted)
  - Typography: font-semibold, font-bold, font-normal
  - Spacing: Tailwind scale (2, 4, 6, 8, 12, 16, 24, 32)
  - Component libraries: shadcn/ui, lucide icons, PlateJs

- **Accessibility Requirements**:
  - Color contrast ≥ 4.5:1 for text
  - Touch targets ≥ 44x44px
  - Focus indicators visible
  - Alt text for images
  - ARIA labels for icons

- **Responsive Design**:
  - Mobile-first approach
  - Breakpoints: sm (640), md (768), lg (1024), xl (1280)
  - Touch-friendly on mobile, hover states on desktop

**Key Instructions**:
- Create text-based mockups in markdown
- Specify component states (default, hover, active, disabled)
- Document interaction flows
- Define visual hierarchy
- Save specifications to `docs/design-mockups/`

**Dependencies**:
- **Receives from Product Manager**: User personas, feature requirements
- **Provides to Frontend Developer**: Component specs for implementation
- **Coordinates with UX Researcher**: Validates designs with users

---

### UX Researcher Agent

**Role**: User Insights & Validation

**Inputs Required**:
- User stories (assumptions to validate)
- Target personas
- Product goals
- User feedback

**Outputs Produced**:
- Research findings in `docs/research/`
- Usability recommendations
- Friction point analysis
- A/B test suggestions
- Analytics tracking requirements

**Domain Knowledge**:
- **Research Methods**:
  - Desk Research (analytics, support tickets, user feedback, competitor analysis)
  - User Testing (task-based, think-aloud protocol, usability testing)
  - Heuristic Evaluation (Nielsen's 10 heuristics, accessibility guidelines)

- **Common Friction Points**:
  - Too many steps
  - Unclear calls-to-action
  - Missing feedback (loading, success, error)
  - Jargon or unclear labels
  - Hidden features
  - Difficult navigation

**Key Instructions**:
- Validate assumptions in user stories
- Identify confusing UX patterns
- Provide actionable recommendations with evidence
- Suggest A/B tests for unclear approaches
- Save findings to `docs/research/ux-findings-feature-name.md`

**Dependencies**:
- **Receives from Product Manager**: Assumptions to validate
- **Provides to Product Manager**: Validated insights, story refinements
- **Provides to UI Designer**: Design improvements

---

### Quality Reviewer Agent

**Role**: QA Testing & Validation

**Inputs Required**:
- User stories with acceptance criteria (`docs/user-stories/US-XXX.md`)
- Implemented code
- Test results
- Performance metrics

**Outputs Produced**:
- QA reports with issues categorized by severity
- Test coverage analysis
- Performance assessment
- HITL files for issue resolution decisions
- Regression tests for discovered bugs
- Adversarial testing results (security)

**Domain Knowledge**:
- **Severity Levels**:
  - **Critical**: Security vulnerabilities, data loss, broken core functionality, accessibility blockers
  - **High**: Major UX issues, performance problems, missing error handling
  - **Medium**: Minor UX polish, edge case handling
  - **Low**: Visual tweaks, optional enhancements

- **Review Criteria Checklist**:
  - All acceptance criteria met
  - Edge cases handled
  - Error states implemented
  - Analytics tracking added
  - Tests cover critical paths
  - Accessibility requirements met (WCAG 2.1 AA)
  - Performance acceptable

- **Automated Checks**:
  - `pnpm gen:check` (ZenStack + Prisma)
  - `pnpm lint:check`
  - `pnpm test` (unit tests)
  - `pnpm build` (type checking)

- **Failure Mode Capture**:
  - Document what input caused failure
  - Create regression test
  - Update US-XXX.md with testing notes
  - Store in `__tests__/failure-modes/` directory

- **Adversarial Testing (OWASP Top 10 2021)**:
  - **#1 Broken Access Control**: Unauthorized API access, permission escalation
  - **#2 Cryptographic Failures**: Sensitive data exposure, weak encryption
  - **#3 Injection**: SQL, XSS, Command, NoSQL injection
  - **#4 Insecure Design**: Missing security requirements
  - **#5 Security Misconfiguration**: Default credentials, error message leaks
  - **#6 Vulnerable Components**: Outdated packages, CVEs
  - **#7 Auth Failures**: Weak passwords, session fixation
  - **#8 Data Integrity**: CSRF, insecure deserialization
  - **#9 Logging Failures**: Failed login attempts not logged
  - **#10 SSRF**: Internal URL access

**Key Instructions**:
- Test all acceptance criteria
- Run automated checks before proceeding
- Create regression tests for ALL bugs found
- Document failure modes for future reference
- Create HITL for critical/high issues
- Perform adversarial testing for security-sensitive features
- Zero bug recurrence rate (same bug never happens twice)

**Dependencies**:
- **Receives from Developers**: Implemented features
- **Provides to Product Manager**: Story refinement needs
- **Provides to Developers**: Bug reports and regression test requirements

---

## Business Operations Agents

### Market Analyst Agent

**Role**: Competitive Intelligence & Market Research

**Inputs Required**:
- README.md (competitive analysis section)
- `docs/strategy/gtm-plan.md` (target market, ICP)
- Existing `docs/research/competitive-matrix.md`

**Outputs Produced**:
- `docs/research/competitive-matrix.md` (feature/pricing comparison)
- `docs/research/market-insights-YYYY-MM.md` (monthly trends)
- `docs/research/competitors.md` (tracked competitor list)
- HITL files for significant competitive moves

**Domain Knowledge**:
- **Competitor Categories**:
  - Direct (same problem, same solution, same market)
  - Indirect (same problem, different solution)
  - Potential (adjacent markets that could pivot)

- **Information Sources** (Public Only):
  - ✅ Public websites, pricing pages, changelogs
  - ✅ Public GitHub repos
  - ✅ Public funding announcements (Crunchbase, TechCrunch)
  - ✅ Social media, review sites (G2, Capterra, ProductHunt)
  - ❌ NEVER access competitor systems with fake accounts

- **Competitive Matrix Structure**:
  - Feature comparison (your solution vs 3-5 competitors)
  - Pricing comparison (tiers, per-user, usage-based)
  - Differentiation analysis (your advantages, competitor advantages)
  - Feature gaps (opportunities to consider)

- **HITL Triggers**:
  - Competitor raises major funding
  - Competitor launches your core differentiator
  - Competitor significantly undercuts pricing
  - Market shift threatens your tech stack

**Key Instructions**:
- Focus on top 3-5 direct competitors (avoid analysis paralysis)
- Update competitive matrix monthly (max 30-day staleness)
- Create HITL within 48 hours of major competitive moves
- Use public data only (no terms of service violations)
- Identify 2-3 opportunities per quarter

**Dependencies**:
- **Provides to Product Manager**: Feature gaps, market trends for RICE scoring
- **Provides to Experimentation Agent**: Competitor pricing for A/B tests
- **Provides to Unit Economics Agent**: Competitor ARPU estimates
- **Provides to Architecture Agent**: Technology trends for ADR timing

---

### Experimentation Agent

**Role**: A/B Testing & Feature Experimentation

**Inputs Required**:
- `docs/user-stories.md` (low confidence scores < 60%)
- `docs/research/market-insights-YYYY-MM.md` (market trends to validate)
- `docs/strategy/gtm-plan.md` (business assumptions)

**Outputs Produced**:
- Experiment plans in `docs/experiments/EXPERIMENT-XXX-title.md`
- PostHog feature flag configurations
- Bayesian probability analysis
- HITL files for experiment approval and results

**Domain Knowledge**:
- **Good Experiment Candidates**:
  - High Impact + High Uncertainty (pricing, onboarding, value prop)
  - Multiple Valid Approaches (UI designer proposed 2 directions)
  - Minimum 500 visitors per variant for Bayesian analysis

- **Traffic Requirements (Bayesian Sequential Testing)**:
  - Minimum: 500 visitors per variant before first evaluation
  - Ideal: 2,000+ visitors per variant
  - Timeline: 1-3 weeks typical
  - Advantages: No peeking problem, 30-50% fewer samples needed, clear interpretation

- **Bayesian Decision Criteria**:
  - P(B > A) ≥ 95% AND expected loss < 1% → Ship Variant B
  - P(B > A) ≤ 5% → Keep Control A
  - 5% < P(B > A) < 95% → Insufficient evidence, continue
  - Early stop for harm: P(B worse by >20%) > 90%

- **Experiment Structure**:
  - Hypothesis (we believe, because, we'll know when)
  - Variables (independent, dependent, controlled)
  - Traffic split (50/50, randomized, sticky)
  - Sample size (Bayesian sequential)
  - Success criteria (primary + secondary metrics)
  - Risks & mitigation

- **PostHog Integration**:
  - Feature flags for variants
  - Event tracking (exposure, conversion)
  - Dashboard for real-time monitoring
  - Alerts for anomalies

- **Code Cleanup (REQUIRED after experiment)**:
  - Remove losing variant code
  - Remove feature flag logic
  - Remove unused imports
  - Update tests
  - Git commit: "Cleanup EXPERIMENT-XXX: Remove losing variant code"

**Key Instructions**:
- Create HITL for experiment approval before launch
- Check results daily (Bayesian allows continuous monitoring)
- Create HITL for results decision (ship winner, keep control, iterate)
- **Always clean up experiment code** after conclusion
- Never test security features, legal requirements, or with <500 visitors/week

**Dependencies**:
- **Receives from Product Manager**: User stories with low confidence for validation
- **Receives from Market Analyst**: Competitor patterns to test
- **Receives from Unit Economics Agent**: Pricing tiers to test
- **Provides to Product Manager**: Validated insights to increase RICE confidence

---

### Unit Economics Agent

**Role**: Financial Modeling & SaaS Metrics

**Inputs Required**:
- README.md (business model, revenue streams, pricing)
- `docs/strategy/gtm-plan.md` (acquisition channels, CAC estimates)
- `docs/research/competitive-matrix.md` (competitor pricing)
- Stripe subscription data
- Database (user counts, activation rates)
- PostHog (conversion funnels)

**Outputs Produced**:
- `docs/finance/unit-economics-model.md` (metrics, projections)
- `docs/finance/monthly-reviews/YYYY-MM.md` (trend analysis)
- HITL files for pricing changes and negative trends

**Domain Knowledge**:
- **Key Metrics**:
  - **MRR** (Monthly Recurring Revenue): SUM(active subscriptions)
  - **ARR** (Annual Recurring Revenue): MRR × 12
  - **ARPU** (Average Revenue Per User): MRR / paid customers
  - **CAC** (Customer Acquisition Cost): (Marketing + Sales) / New customers
  - **LTV** (Lifetime Value): ARPU × Gross Margin × Lifespan
  - **Churn Rate**: Canceled customers / Total customers
  - **LTV:CAC Ratio**: Target 3:1+ for profitability
  - **CAC Payback**: Target <18 months
  - **Gross Margin**: Target 70%+ for SaaS

- **Retention Periods**:
  - 1 / Monthly Churn Rate = Average lifespan

- **MRR Waterfall**:
  - Starting MRR + New MRR + Expansion MRR - Contraction MRR - Churned MRR = Ending MRR

- **HITL Triggers**:
  - LTV:CAC drops below 3:1
  - Churn increases >20% MoM
  - MRR growth stalls (<5% for 2 consecutive months)
  - Pricing changes (high risk, always HITL)

**Key Instructions**:
- Update metrics monthly (1st of month)
- Grandfather existing customers when raising prices
- A/B test new pricing before rollout
- Create HITL for pricing changes (high risk)
- Coordinate with Market Analyst for competitor benchmarks

**Dependencies**:
- **Provides to Product Manager**: Revenue opportunity sizing, financial constraints
- **Provides to Experimentation Agent**: Pricing tiers to test
- **Provides to Market Analyst**: Pricing positioning
- **Receives from Experimentation Agent**: Pricing test results

---

### Compliance Agent

**Role**: Legal & Regulatory Compliance

**Inputs Required**:
- README.md (business model, data collection)
- `schema.zmodel` and `zschema/` (all data models, identify PII)
- `docs/adr/` (technical decisions affecting compliance)
- `docs/user-stories.md` (features that collect/process data)

**Outputs Produced**:
- `docs/legal/compliance-checklist.md` (current status)
- `docs/legal/privacy-policy.md` (draft)
- `docs/legal/terms-of-service.md` (draft)
- `docs/legal/cookie-policy.md`
- User stories for compliance features (data export, deletion, opt-out)
- Quarterly compliance review summaries

**Domain Knowledge**:
- **Applicable Regulations**:
  - GDPR (EU users) - data protection, user rights
  - CCPA (California users) - consumer privacy rights
  - SOC 2 (enterprise customers) - security and availability
  - PCI-DSS (payment handling) - managed by Stripe
  - HIPAA (health data) - if applicable
  - COPPA (children <13) - if applicable

- **GDPR User Rights**:
  - Right to Access (download data)
  - Right to Deletion (delete account + data)
  - Right to Rectification (edit profile)
  - Right to Portability (machine-readable export)
  - Right to Object (opt-out of analytics)
  - Right to be Informed (Privacy Policy)

- **Sensitive Data Categories** (for `@meta(sensitivity)`):
  - **"personal information"**: Names, emails, SSNs, addresses, phone numbers, IPs
  - **"financial information"**: Credit cards, bank accounts, tax info, billing
  - **"health information"**: Medical records, PHI, insurance
  - **"confidential business information"**: Trade secrets, IP, strategic plans

- **Field-Level Security Attributes** (ZenStack):
  - `@password` - Auto-hashes with bcrypt
  - `@omit` - Excludes from query results by default
  - `@encrypted` - Encrypts at rest (Postgres only)
  - `@@deny('read', ...)` - Field-level access control

- **Data Retention Policy**:
  - Audit logs: 1-3 years (event-dependent)
  - Application logs: 7-90 days (Vercel automatic)
  - Analytics events: 90 days (PostHog)
  - User account data: Account lifetime + 30 days soft delete
  - Financial data: 7 years (tax compliance)

**Key Instructions**:
- Audit all models in `zschema/` for PII
- Ensure `@meta(sensitivity)` on all sensitive fields
- Create HITL for legal questions (not legal advice)
- Sign DPAs with all data processors (Neon, Vercel, PostHog, Resend)
- Quarterly compliance reviews
- Consult licensed attorney before launch

**Dependencies**:
- **Coordinates with Backend Developer**: Sensitive data tagging, access control implementation
- **Coordinates with Observability Agent**: Audit log requirements, PII redaction in logs
- **Provides to Product Manager**: Compliance user stories (data export, deletion, opt-out)

---

### Observability Agent

**Role**: Logging, Monitoring & Audit Trails

**Inputs Required**:
- `schema.zmodel` and `zschema/` (all data models)
- `docs/legal/compliance-checklist.md` (GDPR/CCPA requirements)
- `docs/adr/` (existing architecture decisions)

**Outputs Produced**:
- `docs/observability/audit-requirements.md` (audit event catalog)
- `zschema/audit.zmodel` (audit log data model)
- `lib/logger.ts` (application logging with PII redaction)
- `lib/audit.ts` (audit logging helper functions)
- `docs/observability/monitoring-dashboards.md` (dashboard specs)
- `docs/observability/data-retention-policy.md`
- `app/api/cron/cleanup/route.ts` (retention cleanup cron)

**Domain Knowledge**:
- **Observability Stack (ADR-007)**:
  - **Tier 1**: Application Logs (Consola with PII redaction, 7 days)
  - **Tier 2**: Audit Logs (PostgreSQL, 1-3 years, immutable)
  - **Tier 3**: Analytics Events (PostHog, 90 days)
  - **Tier 4**: Distributed Tracing (OpenTelemetry, LETS metrics)

- **Audit-Worthy Operations**:
  - **Authentication**: login success/failed, password changed, MFA enabled/disabled
  - **Authorization**: role changed, member added/removed, permission granted
  - **Data Access**: viewed, exported, shared (with GDPR compliance)
  - **Data Modifications**: created, updated, deleted (with old→new values)
  - **Configuration**: config changed, integration connected/disconnected

- **Better-Auth Admin Plugin Integration**:
  - User fields: role, banned, banReason, banExpires
  - Session fields: impersonatedBy
  - Audit events: user created by admin, role changed, banned/unbanned, session impersonated, session revoked

- **Audit Table Naming Convention**:
  - Pattern: `Audit[ModelName]` (e.g., AuditUser, AuditSession)
  - Relationship: 1:many FK from audited model → audit table
  - All audit tables extend `ImmutableModel` (append-only, deny update/delete)

- **ImmutableModel Base**:
  - `@@allow('create', true)` - Anyone can create records
  - `@@deny('update', true)` - No one can update
  - `@@deny('delete', true)` - No one can delete
  - Exception: Retention cleanup uses raw Prisma to bypass ZenStack

- **PII Handling in Logs**:
  - ✅ ALLOWED: User ID (reference), hashed email, timestamp, IP (pseudonymized after 90 days)
  - ❌ NEVER LOG: Passwords, credit cards, full session tokens, API keys, sensitive content

- **Automatic PII Obfuscation with Consola**:
  - Custom reporter detects `@meta(sensitivity)` fields
  - Auto-redacts based on category (personal, financial, health, confidential)
  - Include `{ __meta: true }` in Prisma queries for redaction to work

- **LETS Metrics (DevOps Performance)**:
  - **L - Lead Time**: Request duration (p50, p95, p99), DB query time
  - **E - Error Rate**: HTTP 4xx/5xx, tRPC errors, DB errors, failed logins
  - **T - Throughput**: Requests/sec, tRPC calls/sec, DB queries/sec
  - **S - Saturation**: Heap used, event loop lag, connection pool, rate limits

- **Retention Policy (Convention Over Configuration)**:
  - Auto-discover models extending `ImmutableModel` (audit tables)
  - Auto-discover models with `deletedAt` (soft-deleted, hard delete after 30 days)
  - Auto-discover models with `retentionDate` (delete after expiry)
  - Auto-discover `ipAddress` fields in audit (pseudonymize after 90 days)
  - Cron job: `app/api/cron/cleanup/route.ts` runs daily at 2am

**Key Instructions**:
- All critical operations create audit log entries
- Audit logs are immutable (insert-only)
- Use typed JSON for audit metadata (type safety)
- Implement PII redaction in all logs
- Define retention periods per event type
- Create admin dashboard to view audit logs

**Dependencies**:
- **Receives from Compliance Agent**: Audit log requirements, PII handling rules
- **Coordinates with Backend Developer**: Audit logging in tRPC routes
- **Coordinates with Frontend Developer**: Admin dashboard for audit logs

---

### Support Triage Agent

**Role**: Customer Support Documentation & Issue Escalation

**Inputs Required**:
- `docs/user-stories.md` (feature descriptions)
- `docs/testing/qa-reports/` (QA findings on confusing UX)
- Production error logs
- PostHog session recordings (observe where users struggle)

**Outputs Produced**:
- `docs/support/faq.md` (self-service knowledge base)
- `docs/support/troubleshooting.md` (internal troubleshooting guide)
- `docs/support/escalation-protocol.md` (when/how to escalate)
- `docs/support/support-playbook.md` (best practices)
- `docs/support/ticket-tracking.md` (monthly analysis)
- User stories for UX improvements based on support patterns

**Domain Knowledge**:
- **Ticket Categorization**:
  - Login/Authentication
  - Billing/Payments
  - Feature Questions
  - Bug Reports
  - Data Export/Deletion

- **Escalation Criteria**:
  - **To Engineering** (P0/P1/P2): Bug affects >3 users, data loss, security vulnerability, payment failure, critical feature broken
  - **To Founder** (immediate): Legal threat, security breach, major customer churn risk (>$1k MRR), press inquiry

- **Severity Levels**:
  - **P0 (Critical)**: System down, data loss, security breach (immediate response)
  - **P1 (High)**: Core feature broken, major user impact (<4 hours)
  - **P2 (Medium)**: Feature degraded, workaround available (<2 business days)
  - **P3 (Low)**: Nice-to-have, minor inconvenience (<1 week)

- **Response Templates**:
  - Acknowledging bug report
  - Declining refund (polite)
  - Escalation to founder (internal)
  - Issue resolved (thank you)

- **Decision Trees**:
  - Refund requests (within 7 days, service failure, annual plan)
  - Data deletion requests (GDPR/CCPA, active subscription, soft delete grace period)
  - Bug vs feature request (current feature not working vs new functionality)

**Key Instructions**:
- Update FAQ monthly based on ticket volume
- Document common issues proactively (before launch)
- Create user stories for UX improvements (10 users asking = UX issue)
- Maintain response templates (personalize before sending)
- Track metrics: First response time, resolution time, CSAT, reopened rate

**Dependencies**:
- **Receives from Quality Reviewer**: QA findings on confusing UX
- **Provides to Product Manager**: Feature requests with frequency data
- **Provides to Frontend Developer**: UX improvement tickets
- **Uses Observability Agent**: Audit logs for support investigations

---

### Operations Excellence Agent

**Role**: Continuous Improvement & Feedback Integration

**Inputs Required**:
- PR comments (feedback on documentation/processes)
- Session summaries in `docs/sessions/` (retrospective analysis)
- Documentation across `docs/` and `.claude/`

**Outputs Produced**:
- Documentation updates with consistency checks
- Process improvements in `docs/proposals/enhancement-<title>.md`
- HITL files for improvement approvals
- Process improvement backlog in `docs/backlog/process-improvements.md`

**Domain Knowledge**:
- **PR Comment Processing Workflow**:
  1. Catalog all comments (one todo per comment)
  2. For each comment sequentially:
     - Read and analyze (what's requested, which files affected)
     - Research context (search for related docs, check ADRs)
     - Plan changes (scope, consistency check, impact)
     - Implement changes
     - Commit with descriptive message
     - Reply to GitHub comment
  3. Create HITL batch for approval
  4. Await human approval
  5. Execute (push commits, post replies)

- **Retrospective Analysis**:
  - Review recent sessions for patterns
  - Extract improvement opportunities (documentation gaps, process inefficiencies, agent capability gaps)
  - Prioritize using RICE scoring
  - Create enhancement proposals
  - Create HITL batch for approval

- **Consistency Checklist**:
  - Terminology (use project glossary, consistent capitalization/abbreviations)
  - Cross-references (update all docs, fix broken links, update TOCs)
  - Examples and code (current syntax, actual paths, tested commands)
  - Agent instructions (clear, actionable, include when/why, provide examples)
  - Workflow documentation (sequential steps, prerequisites, expected outcomes)

**Key Instructions**:
- Process feedback one item at a time, thoroughly
- Maintain consistency across all documentation
- All improvements require HITL approval
- Changes driven by concrete feedback and patterns
- High standards for clarity, accuracy, completeness

**Dependencies**:
- **Coordinates with all agents**: Ensures agent instructions stay clear, examples updated, consistency maintained
- **Receives from Product Manager**: Retrospective findings for improvement priorities
- **Receives from Architecture Agent**: Process ADRs for architectural consistency

---

## Task-Specific Agents

### Session Summary Agent

**Role**: Generate session documentation

**Inputs Required**:
- Git log since last session
- Files changed
- User stories created/completed
- ADRs created/updated
- Test results

**Outputs Produced**:
- `docs/sessions/session-YYYY-MM-DD.md` (using template)

**Trigger Phrases**:
- "batch complete"
- "summarize this work"
- "create session summary"
- Manual: `pnpm session:summary`

**Key Instructions**:
- Collect data from git log, user stories, ADRs, tests
- Categorize work (features, improvements, documentation)
- Include statistics (commits, files, tests)
- Present to human for review and editing

---

### PR Finalization Agent

**Role**: Complete PR workflow automation

**Inputs Required**:
- Current branch state
- Test results
- Build status
- Database schema changes (if any)

**Outputs Produced**:
- PR description with summary, changes, testing checklist
- Deployment notes (migration required, breaking changes, rollback plan)
- GitHub PR creation

**Process**:
1. Verify PR is ready (tests pass, lint pass, build success, no merge conflicts)
2. Check for database migrations (if schema.prisma changed, document rollback)
3. Generate PR description (summary, related issues, changes, database changes, testing, deployment notes)
4. Add labels (feature, bug, refactor, docs, chore, migration)
5. Request reviews

**Key Instructions**:
- Always document database migration rollback instructions
- Monitor deployment via Vercel CLI for failures
- Monitor GitHub PR comments for feedback
- Push only after build succeeds locally

**Dependencies**:
- **Coordinates with Deployment Monitoring Agent**: Post-push deployment verification

---

### Deployment Monitoring Agent

**Role**: Monitor deployment status and provide insights

**Inputs Required**:
- Git push events
- Deployment platform (Vercel, Netlify, GitHub Actions)

**Outputs Produced**:
- Deployment status (BUILDING, READY, ERROR, CANCELED)
- Preview URLs
- Build logs (on failure)
- Failure analysis with recommended fixes

**Workflow**:
1. Detect deployment trigger (git push, PR creation)
2. Monitor deployment status (check every 30 seconds)
3. Investigate failures (fetch logs, analyze common patterns)
4. Provide actionable feedback (fix recommendations, verification commands)
5. Success response (preview URL, testing options)

**Common Failure Patterns**:
- TypeScript errors (`error TS[0-9]+`)
- Missing environment variables
- Build timeout
- Module resolution errors
- Dependency installation failures

**Key Instructions**:
- Provide immediate feedback (<60 seconds)
- Extract key errors from logs
- Recommend local verification commands
- Zero failed deployments merged to main (preview validation)

---

### GitHub Integration Agent

**Role**: GitHub issue/PR synchronization

**Capabilities**:
- Create issues from user stories
- Link issues to PRs (Fixes #123, Closes #456)
- Update issue status (in-progress, blocked, complete)
- Create PRs
- Check PR status and merge

**Key Instructions**:
- Use GitHub CLI (`gh`) for all operations
- Sync user stories with GitHub issues
- Track progress via labels

---

### PR Quick Fixes Agent (Haiku)

**Role**: Quick PR comment fixes

**Specializations**:
- Typo & grammar fixes
- Code cleanup (unused imports, console.log, dead code)
- Simple bug fixes (syntax errors, type mismatches)

**Safety Rules**:
- Only on feature branches (not main)
- High confidence, low-risk changes
- No architectural implications
- Require human approval for: main branch, auth/permissions, schema changes, complex refactoring

**Process**:
1. Read file for context
2. Apply fix directly
3. Run validation (`pnpm lint`, `tsc --noEmit`)
4. Commit with descriptive message
5. Reply to GitHub comment

---

### GitHub PR Comment Processor (Sonnet)

**Role**: Expert PR comment analysis and resolution

**Core Capabilities**:
- Use GraphQL `reviewThreads` API for unresolved comments
- Intelligent categorization (bug, quick win, architecture, documentation, technical debt)
- Decision-making framework (autonomous, consultation, manual review)
- Risk assessment (high, medium, low)

**Categorization**:
- **🐛 Bug** (Medium): bug, error, fix, issue, problem
- **⚡ Quick Win** (Low): typo, spelling, unused import
- **🏗️ Architecture** (High): auth, permission, Better Auth
- **📚 Documentation** (Low): docs, readme, comment
- **🔧 Technical Debt** (Medium): refactor, cleanup, deprecated

**Decision Framework**:
- **Autonomous**: High confidence (0.8+), low risk
- **Consultation**: Medium confidence (0.6+), architectural
- **Manual Review**: Low confidence (<0.6), high risk

**Process**:
1. Discovery (fetch unresolved review threads)
2. Analysis (categorize, assess risk, determine action)
3. Resolution (apply fixes, validate, commit, reply)
4. GitHub integration (post threaded replies)

---

### PR Architecture Reviewer (Sonnet)

**Role**: Architectural review for high-risk changes

**Expertise**:
- Better Auth v1.3.27 patterns
- Permission & role systems
- ZenStack schema patterns
- Organization-based multi-tenancy

**Better Auth Patterns**:
- Session cookie detection via `await headers()`
- Database-backed authorization (query Member model)
- Organization → Member → Business flow
- Platform admin access patterns

**Risk Assessment**:
- Main branch work = HIGH RISK
- Auth/permission changes = HIGH RISK
- Database schema changes = HIGH RISK
- Breaking changes = HIGH RISK

**Process**:
1. Context analysis (read files, check ADRs, verify Better Auth compatibility)
2. Impact assessment (schema, auth, permissions, breaking changes)
3. Solution design (multiple approaches, trade-offs, testing strategies)
4. Human consultation (always require approval)

---

## Agent Coordination Patterns

### Sequential Handoff Pattern

**Flow**: One agent completes work, hands off to next agent

**Example: User Story → Implementation**
```
Product Manager Agent
  ↓ (creates US-001.md)
UI Designer Agent
  ↓ (updates US-001.md with mockups)
UX Researcher Agent (when needed)
  ↓ (updates US-001.md with validation)
Architecture Agent
  ↓ (creates ADR-003.md, updates US-003.md)
Backend Developer Agent
  ↓ (implements schema, API, services)
Frontend Developer Agent
  ↓ (implements UI)
Quality Reviewer Agent
  ↓ (validates, creates regression tests)
Session Summary Agent
  ✓ (documents)
```

**Coordination**:
- Each agent reads previous agent's output
- US-XXX.md contains context for all agents
- ADRs provide architectural guardrails
- HITL gates prevent bad handoffs

---

### Parallel Execution Pattern

**Flow**: Multiple agents work simultaneously on independent tasks

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

---

### Iterative Refinement Pattern

**Flow**: Agent produces output, receives feedback, refines

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

---

### Shared Documents for Coordination

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

---

### HITL Checkpoints for Coordination

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

---

### Anti-Patterns to Avoid

❌ **Agents Working in Silos**: Backend implements API without frontend input
✅ **Solution**: Tech spec phase aligns contracts before implementation

❌ **Duplicating Work**: Frontend creates custom tRPC client
✅ **Solution**: Research-first protocol finds generated hooks

❌ **Skipping HITL**: Architecture agent proceeds without ADR approval
✅ **Solution**: HITL gates prevent unauthorized progress

❌ **Hallucinating APIs**: Agent assumes library has certain method
✅ **Solution**: Web search verification before implementation

❌ **Circular Dependencies**: Frontend waits for backend, backend waits for frontend
✅ **Solution**: Tech spec phase defines contract upfront

---

## Summary

**Total Agents**: 22
- **Product Development**: 7 agents (Architecture, Product Manager, Frontend, Backend, UI Designer, UX Researcher, Quality Reviewer)
- **Business Operations**: 7 agents (Market Analyst, Experimentation, Unit Economics, Compliance, Observability, Support Triage, Operations Excellence)
- **Task-Specific**: 8 agents (Session Summary, PR Finalization, Deployment Monitoring, GitHub Integration, PR Quick Fixes, GitHub PR Comment Processor, PR Architecture Reviewer, + README coordination agent)

**Core Principles**:
1. **Specialized Roles**: Each agent has clear expertise
2. **Coordination Patterns**: Sequential + Parallel + Iterative
3. **Shared Documents**: User stories and ADRs provide context
4. **HITL Gates**: Human approval at key checkpoints
5. **Research-First**: All agents verify before implementing
6. **Clear Contracts**: Tech specs align frontend/backend
7. **Generated Over Custom**: Use ZenStack-generated code
8. **Type Safety**: Full-stack TypeScript with generated types
9. **Schema-Level Access Control**: Policies in ZenStack models
10. **Continuous Improvement**: Retrospectives, feedback integration, documentation consistency

---

**For detailed agent instructions, see**:
- Individual agent files in `.claude/agents/`
- Agent coordination guide: `.claude/agents/README.md`
- Workflow guide: `docs/WORKFLOW_GUIDE.md`
- HITL guide: `docs/HITL_GUIDE.md`
- SDLC: `docs/SDLC.md`
- Philosophy: `docs/PHILOSOPHY.md`
