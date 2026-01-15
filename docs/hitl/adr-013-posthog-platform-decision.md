# HITL Request: ADR-013 PostHog Analytics Platform Decision

**Date**: 2025-11-20
**Category**: `adr`
**Related**: US-002, ADR-005, ADR-007
**Status**: `PENDING`

---

## Problem Statement

We need architectural approval for choosing PostHog as ApartmentDibs' analytics and experimentation platform. User Story US-002 (PostHog Integration) was approved at HITL Gate #1, and now we need to document the architectural decision for HITL Gate #2 approval before implementation begins.

### What We're Building

A comprehensive analytics and experimentation platform that provides:

- Product analytics (event tracking, funnels, cohorts, retention)
- Feature flags (boolean and multivariate)
- A/B testing with statistical significance
- Session recording for debugging and UX research
- Multi-tenant organization tracking

This is foundational infrastructure that will enable data-driven product decisions across all future features.

### Why Human Input is Needed

This is a significant architectural decision that:

1. Establishes our analytics foundation for the entire product lifecycle
2. Has cost implications as we scale ($0 now, potentially $100-500/month at scale)
3. Creates vendor dependency (though open source provides escape hatch)
4. Impacts privacy/compliance approach (GDPR/CCPA)
5. Requires HITL Gate #2 approval per our development workflow

This ADR documents our evaluation of 6 alternatives and provides comprehensive rationale for why PostHog is the best choice for our stage and needs.

---

## Context

### What I Know

**Current State**:

- User Story US-002 approved at HITL Gate #1
- PostHog already mentioned in README.md as competitive advantage ("Data-Driven Operations")
- ADR-005 exists covering PostHog feature flags specifically
- ADR-007 mentions PostHog in observability context but focuses on Consola/OpenTelemetry
- Next.js 15.3+ supports modern instrumentation-client.ts pattern for PostHog
- Better Auth 1.3+ provides user identification for analytics

**Requirements from US-002**:

- Track 9 custom events (application_created, listing_viewed, etc.)
- User identification on authentication
- Organization-level analytics (multi-tenancy)
- Feature flags for gradual rollouts
- Session recording with privacy controls
- GDPR/CCPA compliance

### Research Completed

#### Web Research

**PostHog Next.js 15 Compatibility**:

- Searched: "PostHog Next.js 15 App Router integration 2025"
- Found: Official PostHog documentation confirms Next.js 15.3+ support with instrumentation-client.ts pattern
- Verified: App Router compatibility, React Server Components support, modern pageview tracking

**PostHog Pricing**:

- Searched: "PostHog pricing free tier limits 2025"
- Found: Free tier includes:
  - 1M events/month (sufficient for 10k DAU)
  - 1M feature flag requests/month
  - 5k session recordings/month
  - Unlimited team members, no credit card required
- Pricing after free tier: $0.00005/event, $0.0001/flag request, $0.005/recording

#### Documentation Review

**ADRs Checked**:

- ADR-005 (PostHog Feature Flags) - Focuses specifically on feature flagging, approved
- ADR-007 (Observability) - Separates observability (logs/traces) from product analytics
- ADR-006 (Data Warehouse) - Snowflake for BI, separate from product analytics
- ADR-004 (Email) - Email events could be tracked in PostHog

**User Stories**:

- US-002 (PostHog Integration) - Approved at Gate #1, comprehensive requirements
- Future dependencies: US-010 (GDPR Compliance), US-011 (Analytics Dashboard), US-015 (A/B Testing Framework)

**Template Review**:

- Reviewed docs/adr/template.md for structure
- Reviewed docs/adr/README.md for ADR numbering and process
- Determined ADR-013 is next sequential number

### Relevant Code Reviewed

**Existing ADRs**:

- ADR-005 provides PostHog code examples (useFeatureFlagEnabled, server-side flags)
- No conflicts with existing decisions
- Complements observability stack (ADR-007) without overlap

**Environment Setup**:

- .env.example already includes PostHog variables (mentioned in US-002)

### Constraints & Requirements

**Technical**:

- Must work with Next.js 15.3+ App Router
- Must support React Server Components
- Must integrate with Better Auth for user identification
- Must support organization-level multi-tenant analytics
- Performance: <100ms initialization, <10ms event capture
- Bundle size: Acceptable addition to client bundle

**Business**:

- Budget: $0-100/month for first 12 months (bootstrapped)
- Timeline: 2 weeks for implementation (US-002)
- Competitive advantage: "Data-Driven Operations" in README.md

**Privacy/Compliance**:

- GDPR/CCPA compliant
- IP anonymization required
- Session recording must mask sensitive fields
- Support for user data deletion requests

**Team**:

- Small team needs minimal maintenance burden
- No dedicated analytics or DevOps engineer
- Prefer unified platform over multiple tools

---

## Options Considered

### Option 1: PostHog (All-in-One Platform)

**Description**:
Use PostHog for product analytics, event tracking, feature flags, A/B testing, and session recording. Single platform consolidating capabilities of 3-4 tools.

**Implementation**:

```typescript
// instrumentation-client.ts (Next.js 15.3+)
import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  person_profiles: 'identified_only',
  capture_pageview: false,
  session_recording: { maskInputOptions: { password: true } },
})

// Server-side
import { PostHog } from 'posthog-node'
export const posthog = new PostHog(process.env.POSTHOG_PERSONAL_API_KEY!)
```

**Pros**:

- ✅ All-in-one: Replaces GA4 + LaunchDarkly + FullStory (one integration vs three)
- ✅ Generous free tier: 1M events, 1M flag requests, 5k recordings, unlimited team members
- ✅ Open source: MIT licensed, can self-host if needed (no vendor lock-in)
- ✅ Next.js 15+ compatible: Official instrumentation-client.ts support
- ✅ Multi-tenancy native: Group analytics built-in for organization tracking
- ✅ Cost-effective: $0-50/month vs $300-400/month for separate tools
- ✅ Data correlation: Events, flags, experiments in single platform
- ✅ Privacy-first: person_profiles: 'identified_only', IP anonymization, GDPR DPA available

**Cons**:

- ❌ Younger platform: Less mature than GA4 or Mixpanel (founded 2020)
- ❌ Client-side flash: Feature flags evaluated client-side may cause brief content flash
- ❌ Event schema: No strict schema enforcement, requires discipline
- ❌ Bundle size: ~50KB gzipped added to client bundle
- ❌ Ad blocker interference: 10-30% of users may block PostHog

**Complexity**: Low - single SDK, minimal configuration
**Risk**: Low - open source provides escape hatch, cloud SLA is 99.9%
**Effort**: Small - 2 weeks per US-002 (13 story points)

**Aligns with**:

- ADR-005: PostHog feature flags (already approved)
- ADR-007: Separates analytics from observability (no overlap)
- README.md: "Data-Driven Operations" competitive advantage

---

### Option 2: Google Analytics 4 + LaunchDarkly + FullStory

**Description**:
Industry-standard tools for each capability. GA4 for analytics, LaunchDarkly for feature flags, FullStory for session recording.

**Pros**:

- ✅ Industry standard: Most widely adopted tools in each category
- ✅ Enterprise-grade: Trusted by Fortune 500 companies
- ✅ Mature products: Years of development, extensive features
- ✅ Advanced features: More sophisticated than PostHog individually

**Cons**:

- ❌ High cost: LaunchDarkly $9-15/seat/month + FullStory $249/month = $300-400/month
- ❌ Complex integration: Three separate SDKs, dashboards, support contacts
- ❌ No correlation: Can't easily link flag changes to analytics events
- ❌ Maintenance burden: Three tools to update, monitor, maintain
- ❌ GA4 UX: Poor reputation for event tracking interface, slow dashboards
- ❌ Privacy concerns: Google's ad business conflicts with compliance-first positioning

**Complexity**: High - three separate integrations
**Risk**: Medium - vendor dependency on three companies
**Effort**: Large - 3-4 weeks to integrate three platforms

**Aligns with**:

- Industry best practices ✅
- Budget constraints ❌ ($300-400/month exceeds $0-100/month limit)

---

### Option 3: Mixpanel + Split.io + LogRocket

**Description**:
Startup-friendly alternatives. Mixpanel for analytics, Split.io for flags, LogRocket for session replay.

**Pros**:

- ✅ Startup-friendly pricing: Mixpanel free tier (1k MTU), Split.io free tier (50k seats)
- ✅ Excellent analytics UX: Mixpanel best-in-class interface
- ✅ Strong feature flags: Split.io purpose-built for flagging
- ✅ Better than GA4: Mixpanel's event-based model superior

**Cons**:

- ❌ Still multiple tools: Three separate integrations, dashboards, vendors
- ❌ Cost at scale: Mixpanel $28/month per 1k MTU (can reach $1000s/month)
- ❌ LogRocket cost: $99/month minimum for session replay
- ❌ No built-in correlation: Hard to link experiments to outcomes
- ❌ Privacy concerns: Mixpanel had GDPR violations in past (resolved, but reputation)

**Complexity**: Medium-High - three platforms to manage
**Risk**: Medium - cost scaling, past privacy issues
**Effort**: Medium - 2-3 weeks to integrate three tools

**Aligns with**:

- Startup stage ✅
- Unified platform preference ❌

---

### Option 4: Amplitude + Optimizely + Hotjar

**Description**:
Enterprise-grade tools. Amplitude for analytics, Optimizely for experimentation, Hotjar for UX.

**Pros**:

- ✅ Best-in-class: Amplitude best analytics, Optimizely pioneered A/B testing
- ✅ Enterprise support: Dedicated support, SLAs
- ✅ Advanced features: Unmatched cohort analysis, sophisticated testing

**Cons**:

- ❌ Very expensive: $3,000+/month (Amplitude $995, Optimizely $2,000, Hotjar $99)
- ❌ Extreme overkill: Built for enterprise with $10M+ ARR
- ❌ Long sales cycles: Enterprise contracts, negotiations
- ❌ Slow implementation: Complex setup, weeks to months onboarding

**Complexity**: Very High - enterprise-grade complexity
**Risk**: High - massive overkill, vendor lock-in
**Effort**: Very Large - months to implement properly

**Aligns with**:

- Current stage ❌ (MVP, not enterprise)
- Budget ❌ (60x over budget)

---

### Option 5: Self-Hosted PostHog (Open Source)

**Description**:
Deploy PostHog's open-source version on own infrastructure instead of using cloud.

**Pros**:

- ✅ Zero usage cost: Only infrastructure costs, no usage-based pricing
- ✅ Data sovereignty: Complete control over data storage
- ✅ No limits: Unlimited events, users, recordings
- ✅ Customization: Can modify source code if needed

**Cons**:

- ❌ Infrastructure complexity: Manage Kubernetes, PostgreSQL, ClickHouse, Redis, Kafka
- ❌ Ongoing maintenance: Security patches, upgrades, scaling, backups
- ❌ Upfront cost: $100-500/month in infrastructure
- ❌ DevOps burden: 10-20 hours/month maintenance
- ❌ No support: Community support only, no SLA

**Complexity**: Very High - full infrastructure management
**Risk**: High - operational burden for small team
**Effort**: Large - weeks to set up, ongoing maintenance

**Aligns with**:

- Small team capacity ❌
- Budget (cloud free tier is cheaper than self-hosting) ❌

**Future Consideration**: Revisit at 10M+ events/month or data sovereignty requirements

---

### Option 6: Build Custom Analytics

**Description**:
Build custom event tracking storing events in PostgreSQL, with Snowflake warehouse for analytics.

**Pros**:

- ✅ Full control: Complete control over data model
- ✅ No external dependency: No vendor risk
- ✅ Custom analytics: Build exactly what's needed

**Cons**:

- ❌ Massive development time: 4-8 weeks for basic system
- ❌ No feature flags: Still need separate platform
- ❌ No session recording: Building replay is months of work
- ❌ No statistical analysis: Must build A/B testing calculations
- ❌ Ongoing maintenance: Every feature requires engineering
- ❌ UI development: Dashboard building is time-consuming

**Complexity**: Extreme - building entire analytics platform
**Risk**: Very High - not core competency, opportunity cost
**Effort**: Very Large - months of development + ongoing maintenance

**Aligns with**:

- Core competency ❌ (rental marketplace, not analytics platform)
- Timeline ❌ (2 weeks for US-002, not 2 months)

---

## Comparison Matrix

| Criteria                   | PostHog   | GA4+LD+FS | Mixpanel+Split+LR | Amplitude+Opt+HJ | Self-Hosted PH | Custom Build   |
| -------------------------- | --------- | --------- | ----------------- | ---------------- | -------------- | -------------- |
| **Monthly Cost**           | $0-50     | $300-400  | $150-250          | $3,000+          | $100-500       | $0 (time)      |
| **Integration Complexity** | Low       | High      | Med-High          | Very High        | Very High      | Extreme        |
| **Maintenance Burden**     | Low       | Medium    | Medium            | High             | Very High      | Extreme        |
| **Time to Implement**      | 2 weeks   | 3-4 weeks | 2-3 weeks         | 2-3 months       | 3-4 weeks      | 2-3 months     |
| **Feature Completeness**   | High      | Highest   | High              | Highest          | High           | Low (MVP only) |
| **Privacy/Compliance**     | Excellent | Good      | Good              | Excellent        | Excellent      | Custom         |
| **Vendor Lock-In**         | Low (OSS) | High      | High              | Very High        | None           | None           |
| **Multi-Tenancy Support**  | Native    | Manual    | Manual            | Manual           | Native         | Custom         |
| **Next.js 15+ Support**    | Excellent | Good      | Good              | Manual           | Excellent      | N/A            |
| **Free Tier Limits**       | 1M events | None      | 1k MTU            | None             | N/A            | N/A            |
| **Fits Budget**            | ✅        | ❌        | ⚠️                | ❌               | ❌             | ✅             |
| **Fits Timeline**          | ✅        | ⚠️        | ⚠️                | ❌               | ⚠️             | ❌             |
| **Fits Team Size**         | ✅        | ⚠️        | ⚠️                | ❌               | ❌             | ❌             |

**Legend**: ✅ Good fit | ⚠️ Acceptable | ❌ Poor fit

---

## Recommendation

**Preferred Option**: Option 1 - PostHog (All-in-One Platform)

**Reasoning**:

1. **Best fit for stage and budget**: Free tier covers MVP needs ($0 vs $300-3,000/month for alternatives). At our expected scale (10k DAU), we'll stay well within free tier limits for 6-12 months.

2. **Unified platform simplicity**: One integration instead of 3-4 separate tools dramatically reduces complexity and maintenance burden for small team. Single dashboard, single SDK, single vendor relationship.

3. **Strong Next.js 15 integration**: Official support for instrumentation-client.ts pattern (modern Next.js 15.3+ approach), excellent React hooks, TypeScript support. Competitors require more manual integration work.

4. **Multi-tenancy native support**: Group analytics built-in, perfect for our organization-based architecture. Competitors require manual organization tracking implementation.

5. **Open source escape hatch**: MIT license means we can self-host if costs scale or data sovereignty becomes requirement. No vendor lock-in unlike proprietary alternatives.

6. **Data-driven from day one**: Aligns with README.md competitive advantage ("Data-Driven Operations"). Installing comprehensive analytics on day one enables product velocity through fast iteration and experimentation.

**Why not others**:

- **Option 2 (GA4+LD+FS)**: Cost ($300-400/month) is 6-8x our budget, complexity too high for small team
- **Option 3 (Mixpanel+Split+LR)**: Better than Option 2 but still juggling three platforms, cost scaling concerns
- **Option 4 (Amplitude+Opt+HJ)**: Extreme overkill for MVP stage, $3k/month is 60x budget
- **Option 5 (Self-hosted PostHog)**: DevOps burden too high for small team, cloud free tier actually cheaper
- **Option 6 (Custom build)**: Not our core competency, 2-3 months vs 2 weeks timeline, would still need feature flags

**Confidence Level**: High

PostHog is purpose-built for our exact use case: early-stage product with modern Next.js stack needing all-in-one analytics. The combination of free tier, open source, and Next.js 15+ support makes this a clear winner.

**Risk Mitigation**:

- Wrap PostHog SDK in abstraction layer for easier swapping if needed
- Set billing alerts at $50/month to monitor scaling costs
- Document event schema to prevent inconsistent naming
- Accept 10-30% event loss from ad blockers (can proxy later if needed)

---

## Questions for Human

1. **Budget confirmation**: Is $0-100/month the correct budget constraint for analytics in first 12 months? (This drives the decision toward PostHog vs paid alternatives)

2. **Privacy priority**: How important is the "compliance-first" positioning to our brand? (PostHog's privacy-first features align well with this)

3. **Future scaling**: At what point (events/month or cost/month) should we revisit this decision? (Helps set review criteria)

4. **Alternative preference**: Do you have prior experience with any of the alternatives (Mixpanel, Amplitude, etc.) that would make you prefer them despite cost? (Team familiarity matters)

5. **Open-ended**: What am I missing in this evaluation? Any concerns about PostHog being "younger" than competitors like GA4 or Mixpanel?

---

## Impact Assessment

### If Approved

**Immediate**:

- Update ADR-013 status from DRAFT → APPROVED
- Begin US-002 implementation (2-week sprint)
- Install posthog-js and posthog-node packages
- Configure environment variables

**Short-term** (2 weeks):

- Complete PostHog integration per US-002 acceptance criteria
- Implement 9 custom events for key user actions
- Enable feature flags and session recording
- User identification on authentication
- Organization-level analytics working

**Long-term** (months):

- Product team has data to answer "how many users did X?" in seconds
- Engineering can use feature flags for gradual rollouts
- A/B testing framework for conversion optimization
- Session recordings help debug production issues
- Data-driven culture established from MVP stage

### If Rejected

**Alternative path**:

- Return to alternatives evaluation
- Likely choose Option 3 (Mixpanel + Split.io + LogRocket) as next best option
- Would require 2-3 weeks implementation instead of 2 weeks
- Higher monthly cost ($150-250 vs $0-50)

**Blockers**:

- US-002 (PostHog Integration) blocked until alternative chosen
- All features depending on analytics/feature flags delayed
- US-010 (GDPR Compliance - cookie consent) depends on analytics choice
- US-015 (A/B Testing Framework) depends on experimentation platform

**Workarounds**:

- Could implement basic database event logging (temporary)
- Environment variable feature flags (no user targeting)
- Manual analytics via SQL queries (slow, painful)
- Defer experimentation until analytics platform chosen

---

## Decision Required

Please choose one:

- [ ] **Approve recommended approach** (Option 1: PostHog)
- [ ] **Choose different option** (specify: Option \_\_\_)
- [ ] **Request more research** (specify what to investigate)
- [ ] **Defer decision** (reason: \_\_\_)
- [ ] **Reject all options** (provide alternative direction)

---

## Human Response Section

**Status**: `PENDING` → Update to `APPROVED`, `NEEDS_REVISION`, or `REJECTED`

**Decision**:
[Your decision here - which option, or other direction]

**Feedback/Instructions**:
[Any clarifications, changes requested, or additional context]

**Rationale** (optional):
[Explain your reasoning - helps AI learn for future decisions]

**Next Steps**:
[What should happen after this decision]

**References** (optional):
[Any additional resources or documentation to consider]

---

## Metadata

**Created**: 2025-11-20
**Last Updated**: 2025-11-20
**Reviewed By**: [Pending]
**Resolution Date**: [Pending]
**Time to Resolution**: [Pending]

**Tags**: #adr #analytics #experimentation #posthog #hitl-gate-2 #us-002 #foundational-infrastructure

---

## Appendix: ADR-013 Full Text

The complete ADR document is available at:
`/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/docs/adr/ADR-013-posthog-analytics-and-experimentation-platform.md`

**Key sections**:

- Context: Problem statement, requirements, constraints
- Decision: PostHog implementation approach with code examples
- Consequences: Positive, negative, neutral impacts with mitigation strategies
- Alternatives: 6 alternatives evaluated (GA4+LD+FS, Mixpanel+Split+LR, Amplitude+Opt+HJ, self-hosted, custom build, do nothing)
- Related: Links to ADR-005, ADR-007, US-002, external references

**ADR Status**: DRAFT (pending HITL Gate #2 approval)
**Word Count**: ~8,500 words
**Alternatives Evaluated**: 6 (comprehensive)
**Code Examples**: Yes (TypeScript implementation patterns)
