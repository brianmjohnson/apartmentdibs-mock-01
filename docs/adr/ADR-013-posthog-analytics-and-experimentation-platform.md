# ADR-013: PostHog as Analytics and Experimentation Platform

**Status:** APPROVED
**Date:** 2025-11-20
**Approved:** 2025-11-20
**Author:** Architecture Agent

**Related ADRs:**

- Complements ADR-005 (PostHog Feature Flags and A/B Testing)
- Complements ADR-007 (Observability with Consola and OpenTelemetry)

---

## Context

**What is the issue or problem we're solving?**

ApartmentDibs needs a comprehensive analytics and experimentation platform to make data-driven product decisions, understand user behavior, optimize conversion funnels, and continuously improve the product through experimentation. This is particularly critical for a compliance-first rental marketplace where we must balance regulatory requirements with user experience optimization.

**Background**:

- ApartmentDibs is a Next.js 15+ application with Better Auth 1.3+ and organization-based multi-tenancy
- Current state: No product analytics, no user behavior tracking, no experimentation framework
- Business need: Data-driven decision making is a core value ("Data-Driven Operations" in README.md)
- Product complexity: Multiple user personas (tenants, agents, landlords, admins) with different workflows
- Compliance requirement: GDPR/CCPA-compliant analytics with IP anonymization and consent management
- Strategic goal: Build a product analytics foundation from day one, not as an afterthought

**Requirements**:

**Functional Requirements**:

- Product analytics: User behavior tracking, conversion funnels, cohort analysis, retention metrics
- Event tracking: Custom events for key user actions (application submitted, listing viewed, etc.)
- Feature flags: Boolean and multivariate flags for gradual rollouts and targeting
- A/B testing: Statistical experimentation platform with significance testing
- Session recording: User session replay for debugging and UX research
- User segmentation: Filter analytics by user role, organization, and custom properties
- Multi-tenancy support: Organization-level analytics and group tracking

**Non-Functional Requirements**:

- Performance: <100ms initialization overhead, <10ms event capture (async)
- Availability: 99.9% uptime for analytics ingestion
- Privacy: GDPR/CCPA compliant with IP anonymization, consent management, data retention policies
- Integration: Native Next.js App Router support, Better Auth integration
- Cost: Free tier sufficient for MVP, predictable pricing at scale
- Developer Experience: Minimal configuration, React hooks, TypeScript support

**Constraints**:

- Budget: $0-100/month for first 12 months (bootstrapped startup)
- Team: Small team needs minimal maintenance burden
- Timeline: Must integrate within 2 weeks (user story US-002)
- Tech stack: Must work with Next.js 15.3+, React Server Components, Better Auth

**Scope**:

- **In Scope**: Product analytics, event tracking, feature flags, A/B testing, session recording, user identification, organization tracking
- **Out of Scope**: Infrastructure monitoring (Vercel handles), error tracking (separate tool), business intelligence/data warehouse (ADR-006), application logging (ADR-007)

---

## Decision

**We will use PostHog as our all-in-one analytics and experimentation platform for product analytics, event tracking, feature flags, A/B testing, and session recording.**

PostHog provides a unified platform that consolidates capabilities typically requiring 3-4 separate tools (Google Analytics + LaunchDarkly + FullStory + Optimizely), with generous free tier limits and open-source self-hosting option for future flexibility.

**Implementation Approach**:

### 1. Client-Side Integration (posthog-js)

**PostHog Provider with Official Pattern** (following [PostHog Next.js docs](https://posthog.com/docs/libraries/next-js)):

```typescript
// components/providers/posthog-provider.tsx
'use client'
import { useEffect } from 'react'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import posthog from 'posthog-js'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PostHog (official pattern from PostHog docs)
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/0579f8f99ca21e72e24243d7b9f81954', // Reverse proxy (MD5 of "posthog")
      ui_host: 'https://us.posthog.com', // Required for toolbar authentication
      defaults: '2025-05-24', // Use latest PostHog defaults

      // Privacy settings (ADR-013)
      person_profiles: 'identified_only', // GDPR-friendly: don't track anonymous users
      capture_pageview: false, // Manual pageview tracking for App Router
      capture_pageleave: true,

      // Session recording
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: '[data-private]',
      },

      // Development logging
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[PostHog] Initialized successfully')
        }
      },
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

**Why This Pattern**:

- Official PostHog recommendation for Next.js App Router
- `posthog.init()` in `useEffect` ensures client-side only execution
- Reverse proxy path (`/0579f8f99ca21e72e24243d7b9f81954`) prevents ad blocker interference
- `ui_host` enables PostHog toolbar authentication
- `defaults: '2025-05-24'` uses latest PostHog features and optimizations

### 1a. Vercel Reverse Proxy Configuration

**Why Reverse Proxy?**
Browser ad blockers commonly block requests to analytics domains (like `posthog.com`). By routing requests through our own domain, we improve event capture reliability by 20-40%.

**Vercel Configuration** (see [reference doc](../references/posthog-vercel-reverse-proxy.md)):

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/0579f8f99ca21e72e24243d7b9f81954/static/:path*",
      "destination": "https://us-assets.i.posthog.com/static/:path*"
    },
    {
      "source": "/0579f8f99ca21e72e24243d7b9f81954/:path*",
      "destination": "https://us.i.posthog.com/:path*"
    }
  ]
}
```

**Key Points**:

- Proxy path is MD5 hash of "posthog": unique yet reproducible
- Avoids commonly blocked paths (`/ingest`, `/tracking`, `/analytics`)
- Two rewrites: one for static assets, one for API calls
- Works automatically in all Vercel environments (production, preview, development)
- Zero additional infrastructure or cost

### 2. Server-Side Integration (posthog-node)

**Server Client**:

```typescript
// lib/posthog.server.ts
import { PostHog } from 'posthog-node'

export const posthog = new PostHog(process.env.POSTHOG_PERSONAL_API_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  flushAt: 20,
  flushInterval: 10000,
})

// Serverless-friendly shutdown
export async function trackServerEvent(
  userId: string,
  event: string,
  properties?: Record<string, any>
) {
  posthog.capture({ distinctId: userId, event, properties })
  await posthog.shutdown() // Critical for serverless
}
```

### 3. Better Auth Integration

**User Identification**:

```typescript
// After successful login/signup
posthog.identify(session.user.id, {
  email: session.user.email,
  name: session.user.name,
  role: session.user.role, // tenant, agent, landlord, admin
  organizationId: session.user.organizationId,
  organizationName: session.organization?.name,
})

// Organization group tracking (multi-tenancy)
posthog.group('organization', session.user.organizationId, {
  name: session.organization?.name,
  plan: session.organization?.plan,
  createdAt: session.organization?.createdAt,
})
```

### 4. Key Integration Points

**React Components**:

- `usePostHog()` hook for event tracking
- `useFeatureFlagEnabled()` for feature flag checks
- `useTrackEvent()` custom hook for typed events

**tRPC Routes**:

- Server-side event tracking for backend operations
- Server-side feature flag evaluation for API logic

**Next.js App Router**:

- Automatic pageview tracking on route changes
- Server Components compatibility

**Organization Context**:

- Multi-tenant analytics with organization-level filtering
- Group analytics for organization-wide metrics

**Why This Approach**:

1. **All-in-One Platform**: Replaces 3-4 separate tools (analytics + feature flags + A/B testing + session replay)
   - Cost savings: $0 vs $100-300/month for separate tools
   - Maintenance savings: One integration instead of four
   - Data correlation: Events, flags, and experiments in single platform

2. **Generous Free Tier**:
   - 1M events/month (sufficient for 10k DAU)
   - 1M feature flag requests/month
   - 5k session recordings/month
   - Unlimited team members, no credit card required

3. **Open Source with Self-Hosting Option**:
   - MIT licensed (not vendor lock-in)
   - Can self-host if costs scale or data sovereignty required
   - Community-driven development

4. **Next.js 15+ Compatibility**:
   - Modern instrumentation-client.ts pattern (official Next.js recommendation)
   - App Router support with React Server Components
   - Excellent TypeScript support

5. **Multi-Tenancy Native Support**:
   - Group analytics built-in (perfect for organization tracking)
   - Organization-level filtering and dashboards
   - User + organization correlation in single query

6. **Privacy-First Design**:
   - `person_profiles: 'identified_only'` reduces PII tracking
   - IP anonymization built-in
   - GDPR/CCPA compliant with DPA available
   - Session replay masking for sensitive fields

**Example/Proof of Concept**:

```typescript
// Client-side event tracking
import { useTrackEvent } from '@/hooks/use-track-event'

function ApplicationForm() {
  const trackEvent = useTrackEvent()

  const handleSubmit = async (data: ApplicationData) => {
    await submitApplication(data)

    trackEvent('application_created', {
      listingId: data.listingId,
      organizationId: session.user.organizationId,
    })
  }
}

// Feature flag usage
import { useFeatureFlagEnabled } from 'posthog-js/react'

function Dashboard() {
  const showNewDashboard = useFeatureFlagEnabled('new-dashboard')

  return showNewDashboard ? <NewDashboard /> : <LegacyDashboard />
}

// A/B test variant
const pricingVariant = useFeatureFlagVariant('pricing-experiment')
// Returns: 'control' | 'variant-a' | 'variant-b'
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences

**Product Development**:

- **Data-Driven Decisions**: Product team can answer "How many users did X?" in seconds, not days
- **Experimentation Culture**: A/B testing built into workflow from day one
- **User Insight**: Session recordings provide qualitative data for UX improvements
- **Gradual Rollouts**: Feature flags enable 0% → 10% → 50% → 100% rollouts reducing risk
- **Cohort Analysis**: Understand retention and engagement by user segment

**Engineering**:

- **Simplified Stack**: One tool instead of four reduces integration complexity
- **Kill Switch**: Instantly disable problematic features without deployment
- **Debugging**: Session replay shows exactly what users experienced during errors
- **TypeScript Support**: Excellent type inference for events and flags
- **React Hooks**: Native hooks (`usePostHog`, `useFeatureFlagEnabled`) feel native to React

**Business**:

- **Cost Savings**: $0-50/month vs $100-300/month for comparable tools
- **Conversion Optimization**: A/B testing directly improves revenue
- **Compliance Evidence**: Audit trail of feature changes and experiments
- **Investor Confidence**: Data-driven metrics for product-market fit

**Compliance**:

- **GDPR/CCPA Ready**: IP anonymization, consent management, data retention policies
- **Audit Trail**: Immutable event log for compliance reporting
- **Data Sovereignty**: Can self-host if required for data residency

### Negative Consequences

**Technical Complexity**:

- **Client-Side Flash**: Feature flags evaluated client-side may cause brief content flash before flag loads
- **Learning Curve**: Team must learn PostHog SDK, experiment design, and statistical significance
- **Event Schema Management**: No strict schema enforcement, can lead to inconsistent event naming
- **Debugging Overhead**: Need to verify events actually reaching PostHog dashboard

**Vendor Dependency**:

- **PostHog Lock-In**: While open source, migration to another tool requires rewriting tracking code
- **API Changes**: PostHog is younger than competitors, API may change (mitigated by versioning)
- **Cloud Dependency**: Cloud version requires network connectivity (rare outages possible)

**Performance**:

- **Bundle Size**: posthog-js adds ~50KB gzipped to client bundle
- **Network Requests**: Additional API calls to PostHog ingestion endpoint
- **Client-Side Overhead**: ~5-10ms per event capture (async, usually acceptable)

**Privacy & Compliance**:

- **Cookie Consent Required**: Must implement cookie banner for GDPR/CCPA compliance (not included in PostHog)
- **PII Risk**: Developers could accidentally track sensitive data if not careful
- **Ad Blocker Interference**: ~10-30% of users block PostHog with ad blockers (can proxy to mitigate)

### Neutral Consequences

**Organizational Impact**:

- **Data Culture Shift**: Team must embrace data-driven decision making (culture change)
- **Experiment Discipline**: Requires structured experiment design, not ad-hoc testing
- **Cross-Functional Collaboration**: Product, engineering, and business must align on metrics

### Mitigation Strategies

**Client-Side Flash**:

- Accept brief flash for non-critical features
- Use server-side flag evaluation for critical features
- Implement loading states during flag resolution

**Event Schema Management**:

- Create typed event tracking helper with strict event name enum
- Document event schema in `docs/analytics/event-catalog.md`
- Regular audit of events in PostHog dashboard (monthly cleanup)

**Vendor Lock-In**:

- Wrap PostHog SDK in abstraction layer (`lib/analytics.ts`) for easier swapping
- Open source provides ultimate escape hatch (self-hosting)
- Export data regularly for backup

**Performance**:

- Lazy load PostHog after app interactive (not blocking first paint)
- Use async event capture (non-blocking)
- Feature flag caching (60-second TTL)
- Consider code splitting for analytics code

**Privacy**:

- Create allow-list of trackable properties (never track SSN, credit card, etc.)
- Automatic PII redaction in abstraction layer
- Implement cookie consent banner (separate user story US-010)
- Regular privacy audits

**Ad Blockers**:

- Accept 10-30% event loss for MVP
- Future enhancement: Proxy PostHog through own domain (bypasses blockers)
- Monitor event delivery rate, optimize if <70%

---

## Alternatives Considered

### Alternative 1: Google Analytics 4 + LaunchDarkly + FullStory

**Description**:
Use industry-standard tools for each capability: Google Analytics 4 for product analytics, LaunchDarkly for feature flags, and FullStory for session recording.

**Pros**:

- **Industry Standard**: GA4 is the most widely used analytics platform
- **Enterprise-Grade**: LaunchDarkly is trusted by Fortune 500 companies
- **Mature Products**: Each tool is best-in-class for its category
- **Advanced Features**: More sophisticated than PostHog in individual categories
- **Extensive Integrations**: Work with virtually every marketing/analytics tool

**Cons**:

- **High Cost**: LaunchDarkly $9-15/seat/month, FullStory $249/month = $300-400/month minimum
- **Complex Integration**: Three separate SDKs, three dashboards, three support contacts
- **No Correlation**: Can't easily correlate feature flag changes with analytics events
- **Maintenance Burden**: Three tools to update, monitor, and maintain
- **GA4 Limitations**: Poor event tracking UX, slow dashboard loading, privacy concerns

**Why Not Chosen**:
Cost is prohibitive for bootstrapped startup ($300-400/month vs $0-50/month). Integration complexity would slow development velocity. GA4's reputation for poor UX and privacy concerns (Google's ad business) conflicts with our compliance-first positioning.

---

### Alternative 2: Mixpanel + Split.io + LogRocket

**Description**:
Use startup-friendly alternatives: Mixpanel for analytics, Split.io for feature flags, and LogRocket for session replay.

**Pros**:

- **Startup-Friendly Pricing**: Mixpanel free tier (1k MTU), Split.io free tier (50k seats)
- **Excellent Analytics UX**: Mixpanel has best-in-class analytics interface
- **Strong Feature Flags**: Split.io built specifically for feature flagging and experimentation
- **Developer Tools**: LogRocket includes error tracking and performance monitoring
- **Better GA4 Alternative**: Mixpanel's event-based model superior to GA4's session-based

**Cons**:

- **Still Multiple Tools**: Three separate integrations, three dashboards, three vendors
- **Cost at Scale**: Mixpanel becomes expensive quickly ($28/month per 1k MTU)
- **LogRocket Cost**: $99/month minimum for session replay (expensive for MVP)
- **No Built-In Correlation**: Can't easily link experiments to outcome metrics
- **Privacy Concerns**: Mixpanel had GDPR violations in past (resolved, but reputation hit)

**Why Not Chosen**:
While better than Alternative 1, still requires juggling three platforms. Cost at scale is concerning (Mixpanel's MTU pricing can reach $1000s/month). PostHog's unified approach is simpler and more cost-effective.

---

### Alternative 3: Amplitude + Optimizely + Hotjar

**Description**:
Use enterprise-grade tools: Amplitude for analytics, Optimizely for experimentation, and Hotjar for session recording.

**Pros**:

- **Best Analytics**: Amplitude is considered best-in-class for product analytics
- **A/B Testing Leader**: Optimizely pioneered web experimentation
- **UX Research**: Hotjar includes heatmaps, surveys, and feedback widgets
- **Enterprise Support**: All three offer dedicated support and SLAs
- **Advanced Cohort Analysis**: Amplitude's cohort features are unmatched

**Cons**:

- **Very Expensive**: Amplitude $995/month, Optimizely $2,000/month, Hotjar $99/month = $3,000+/month
- **Extreme Overkill**: Built for enterprise, far exceeds startup needs
- **Long Sales Cycles**: Enterprise tools require sales calls, contracts, negotiations
- **Slow Implementation**: Complex setup, long onboarding (weeks to months)
- **Vendor Lock-In**: Proprietary platforms with difficult migration paths

**Why Not Chosen**:
Completely inappropriate for startup stage. Cost is 60x PostHog's free tier. These tools are for companies with $10M+ ARR and dedicated analytics teams, not MVP validation.

---

### Alternative 4: Self-Hosted PostHog (Open Source)

**Description**:
Deploy PostHog's open-source version on own infrastructure instead of using cloud.

**Pros**:

- **Zero Cost**: No usage-based pricing, only infrastructure costs
- **Data Sovereignty**: Complete control over data storage and residency
- **No Usage Limits**: Unlimited events, users, recordings
- **Customization**: Can modify source code for specific needs
- **No Vendor Lock-In**: Own the deployment and data

**Cons**:

- **Infrastructure Complexity**: Need to manage Kubernetes, PostgreSQL, ClickHouse, Redis, Kafka
- **Ongoing Maintenance**: Security patches, version upgrades, scaling, backups
- **Upfront Cost**: Server costs ($100-500/month for proper setup)
- **DevOps Burden**: Requires dedicated DevOps time (10-20 hours/month)
- **Missing Features**: Cloud-first features (some EU-specific features) may lag open source
- **No Support**: Community support only, no SLA

**Why Not Chosen**:
DevOps burden is too high for small team at MVP stage. Cloud free tier ($0) is cheaper than self-hosting ($100-500/month in infrastructure + DevOps time). Defer self-hosting until we hit 10M+ events/month or have data sovereignty requirements.

**Future Consideration**: Revisit if we hit PostHog's cloud pricing limits or need data residency compliance (e.g., EU-only data storage).

---

### Alternative 5: Build Custom Analytics (Database + Snowflake)

**Description**:
Build custom event tracking system storing events in PostgreSQL, with Snowflake data warehouse for analytics queries.

**Pros**:

- **Full Control**: Complete control over data model and schema
- **No External Dependency**: No third-party vendor risk
- **Custom Analytics**: Build exactly the dashboards and reports needed
- **Data Warehouse Integration**: Events stored in same place as operational data

**Cons**:

- **Massive Development Time**: 4-8 weeks to build basic analytics system
- **No Feature Flags**: Would still need separate feature flag platform
- **No Session Recording**: Building session replay is months of work
- **No Statistical Analysis**: Need to build A/B testing significance calculations
- **Ongoing Maintenance**: Every feature request requires engineering work
- **UI Development**: Building dashboards is time-consuming
- **Snowflake Cost**: Starts at $40/month, can reach $1000s/month quickly

**Why Not Chosen**:
Building analytics is not our core competency. Development time better spent on rental marketplace features. Would still need to buy feature flags and session recording tools. Total cost (time + tools) exceeds using PostHog.

**Partial Consideration**: We ARE building data warehouse (ADR-006), but for business intelligence, not product analytics. These serve different purposes and are complementary.

---

### Alternative 6: Do Nothing (Manual Analytics)

**Description**:
Track basic metrics in database queries and spreadsheets, no dedicated analytics platform.

**Pros**:

- **Zero Cost**: No software or vendor costs
- **Simple**: Just SQL queries against production database
- **Familiar**: Team already knows SQL and spreadsheets

**Cons**:

- **No Real-Time Data**: Must manually run queries
- **No Feature Flags**: Can't do gradual rollouts or A/B tests
- **No Session Recording**: Can't see what users actually experienced
- **Poor UX**: Spreadsheets are slow and error-prone
- **No Collaboration**: Can't share live dashboards with stakeholders
- **Manual Work**: Product manager must write SQL for every question
- **No Experimentation**: Can't measure statistical significance of changes
- **Performance Impact**: Heavy queries against production database

**Why Not Chosen**:
Completely insufficient for data-driven product development. Our README.md explicitly lists "Data-Driven Operations" as a competitive advantage. Cannot claim to be data-driven while using spreadsheets. Product velocity would suffer from inability to quickly answer "how many users did X?" questions.

---

## Related

**Related ADRs**:

- [ADR-005: PostHog for Feature Flags and A/B Testing](./ADR-005-posthog-feature-flags-and-ab-testing.md) - Focuses specifically on feature flagging use cases
- [ADR-007: Observability with Consola and OpenTelemetry](./ADR-007-observability-with-consola-and-opentelemetry.md) - Separates observability (debugging, tracing) from product analytics
- [ADR-006: Data Warehouse Strategy](./ADR-006-data-warehouse-strategy.md) - PostHog for product analytics, Snowflake for business intelligence
- [ADR-004: Email Templating with Resend](./ADR-004-email-templating-with-resend.md) - Email events tracked in PostHog

**Related Documentation**:

- [User Story US-002: PostHog Integration](../user-stories/posthog-integration.md) - Implementation requirements
- `docs/analytics/event-catalog.md` - Event schema documentation (to be created)
- `docs/analytics/experiment-playbook.md` - Experimentation process guide (to be created)
- `.env.example` - PostHog environment variables

**External References**:

- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Next.js Integration Guide](https://posthog.com/docs/libraries/next-js)
- [PostHog React Hooks](https://posthog.com/docs/libraries/react)
- [PostHog Feature Flags Documentation](https://posthog.com/docs/feature-flags)
- [PostHog Experimentation Guide](https://posthog.com/docs/experiments)
- [PostHog GDPR Compliance](https://posthog.com/docs/privacy/gdpr)
- [PostHog Pricing](https://posthog.com/pricing) - Free tier: 1M events, 1M flag requests, 5k recordings
- [PostHog vs. Mixpanel](https://posthog.com/blog/posthog-vs-mixpanel) - Comparison
- [PostHog vs. Amplitude](https://posthog.com/blog/posthog-vs-amplitude) - Comparison

---

## Notes

**Decision Making Process**:

- Consulted: Architecture Agent, Product Manager Agent, User Story US-002
- Research conducted: Web search for PostHog Next.js 15 compatibility, pricing tiers, alternatives comparison
- Evaluated: 6 alternatives (see above) against requirements
- Decision date: 2025-11-20
- Decision context: User Story US-002 approved at HITL Gate #1, creating ADR for HITL Gate #2 approval

**Review Schedule**:

- Revisit if PostHog cost exceeds $100/month
- Revisit if event delivery rate <70% (ad blocker interference)
- Revisit if PostHog missing critical features (e.g., advanced funnel analysis)
- Monitor metrics: Monthly cost, event delivery rate, feature flag latency, session recording quality

**Migration Plan**:

**Phase 1: Foundation (Week 1)**

- Install `posthog-js` and `posthog-node` packages
- Configure environment variables (`NEXT_PUBLIC_POSTHOG_KEY`, `POSTHOG_PERSONAL_API_KEY`)
- Set up PostHogProvider in app layout
- Implement pageview tracking
- Test initialization and verify events in dashboard

**Phase 2: User Identification (Week 1)**

- Integrate with Better Auth login/signup flow
- Implement user identification on authentication
- Add organization group tracking for multi-tenancy
- Test user properties and organization context
- Verify data in PostHog dashboard

**Phase 3: Event Tracking (Week 2)**

- Create typed event tracking helpers
- Implement custom events for key user actions (see US-002 AC-3)
- Add event tracking to critical user flows
- Test event delivery and properties
- Document event schema

**Phase 4: Advanced Features (Week 2)**

- Implement feature flag helpers (client + server)
- Enable session recording with privacy config
- Create test feature flags for validation
- Test A/B experiment setup
- Document feature flag patterns

**Rollback Strategy**:

- PostHog is non-blocking infrastructure (app works without it)
- Can disable by removing `<PHProvider>` wrapper
- Feature flags should have sensible default values
- No database schema changes required
- No data loss risk (events are append-only)
- Rollback = revert code changes, no data cleanup needed

**Success Criteria**:

- Event tracking latency <60 seconds (action → dashboard)
- Event delivery success rate >99.5%
- Feature flag response time <100ms
- Session recording capture rate >95%
- Zero analytics-related errors breaking app
- Product team can answer "how many users did X?" in <5 minutes
- Engineering can use feature flags for gradual rollouts
- Business team has visibility into conversion funnels

---

## Revision History

| Date       | Author             | Change                                        |
| ---------- | ------------------ | --------------------------------------------- |
| 2025-11-20 | Architecture Agent | Initial draft created for HITL Gate #2 review |
