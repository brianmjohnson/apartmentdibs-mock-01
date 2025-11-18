# ADR-005: Use PostHog for Feature Flags and A/B Testing

**Status:** APPROVED
**Date:** 2025-11-16
**Author:** AI Agent

---

## Context

**What is the issue or problem we're solving?**

We need to roll out features gradually to manage risk, run A/B experiments to optimize conversion and engagement, and toggle features on/off without code deployment. This requires a feature flagging and experimentation platform that integrates with our analytics stack.

**Background**:
- PostHog is already in our tech stack for product analytics
- Current approach: No feature flagging (all features ship to everyone)
- Need to test pricing pages, onboarding flows, and UI variations
- Want to enable/disable features for specific user segments
- Beta features should be testable with subset of users before full launch

**Requirements**:
- **Functional**: Boolean feature flags (on/off for users/segments)
- **Functional**: Multivariate flags for A/B/n testing
- **Functional**: Gradual rollouts (0% → 25% → 50% → 100%)
- **Functional**: User/organization-level targeting
- **Non-functional**: <100ms flag evaluation latency
- **Non-functional**: 99.9% availability for flag checks
- **Non-functional**: Statistical significance calculation for experiments
- **Constraints**: Integrate with existing PostHog analytics
- **Constraints**: Work in both client and server environments

**Scope**:
- **Included**: Feature flags, A/B tests, multivariate experiments
- **Included**: Statistical analysis and experiment results
- **Included**: Integration with PostHog analytics events
- **Not included**: Complex personalization engine (use dedicated tool if needed)
- **Not included**: Server-side rendering optimization (accept client-side flags for now)

---

## Decision

**We will use PostHog's built-in feature flags and experimentation platform for gradual rollouts and A/B testing.**

PostHog provides feature flags and experimentation as part of its analytics suite, allowing us to consolidate tools and correlate experiments with user behavior analytics. We'll use the PostHog SDK for flag evaluation and configure experiments via the PostHog dashboard.

**Implementation Approach**:
- Use PostHog SDK (already installed) for flag evaluation
- Create feature flags via PostHog dashboard
- Implement flag checks in React components and tRPC routes
- Set up A/B experiments with conversion goals
- Use PostHog's statistical engine for experiment analysis
- Configure GDPR-compliant data processing agreement

**Why This Approach**:
1. **Unified Platform**: Single platform for analytics + flags + experiments
2. **Automatic Correlation**: Experiment results linked to user behavior data
3. **Cost-Effective**: Generous free tier (1M events/month, unlimited flags)
4. **Statistical Analysis**: Built-in significance testing and sample size calculation
5. **Already Integrated**: PostHog SDK already in our stack

**Example/Proof of Concept**:
```typescript
// Client-side feature flag check
import { useFeatureFlagEnabled } from 'posthog-js/react';

export const PricingPage = () => {
  const showNewPricing = useFeatureFlagEnabled('new-pricing-page');

  return showNewPricing ? <NewPricingPage /> : <CurrentPricingPage />;
};

// Server-side feature flag check
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY!);

export const getUserFeatures = async (userId: string) => {
  const hasAdvancedFeatures = await posthog.isFeatureEnabled(
    'advanced-features',
    userId
  );

  return { hasAdvancedFeatures };
};

// A/B test with variant
const pricingVariant = useFeatureFlagVariant('pricing-experiment');
// Returns: 'control' | 'variant-a' | 'variant-b'
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences
- **Risk Mitigation**: Roll out features to small percentage of users first
- **Data-Driven Decisions**: A/B test features before full release
- **Unified Analytics**: Experiments results integrated with user behavior data
- **Kill Switch**: Instantly disable problematic features without deployment
- **Free Tier**: No additional cost until 1M+ events/month
- **Beta Programs**: Easily enable features for beta users/organizations

### Negative Consequences
- **Client-Side Evaluation**: Initial render may show wrong variant (flash)
- **PostHog Dependency**: All experimentation tied to PostHog platform
- **Complexity**: Flag checks add conditional logic throughout codebase
- **Privacy Considerations**: Need PostHog DPA for GDPR compliance

### Neutral Consequences
- **Learning Curve**: Team needs to understand experiment design and statistical significance
- **Flag Hygiene**: Need process to clean up old/unused flags

### Mitigation Strategies
- **Client-Side Evaluation**: Use SSR-friendly flag caching, accept brief flash for client-only pages
- **PostHog Dependency**: PostHog is open-source, can self-host if needed
- **Complexity**: Create abstraction layer for flag checks, document flag usage
- **Privacy**: Sign PostHog DPA (available), configure data retention policies
- **Flag Hygiene**: Monthly flag review, remove flags after experiment concludes

---

## Alternatives Considered

### Alternative 1: LaunchDarkly

**Description**:
Use LaunchDarkly, a dedicated enterprise feature flag platform.

**Pros**:
- Industry leader in feature flagging
- Advanced targeting rules and segments
- Server-side rendering support
- Flag change audit logs
- Enterprise support and SLAs

**Cons**:
- Expensive ($9-15/seat/month minimum)
- Separate platform from analytics (correlation harder)
- Overkill for startup stage
- No built-in A/B testing (separate experiment platform needed)

**Why Not Chosen**:
Cost is prohibitive for early-stage product. LaunchDarkly excels at complex enterprise use cases we don't need yet. PostHog's free tier covers our needs.

---

### Alternative 2: Split.io

**Description**:
Use Split.io for feature flagging and experimentation.

**Pros**:
- Strong experimentation platform
- Good integration with analytics tools
- Server-side SDKs for fast evaluation
- Generous free tier (50k seats)

**Cons**:
- Another tool to integrate and learn
- Requires separate analytics integration
- More complex setup than PostHog
- Less community support than LaunchDarkly

**Why Not Chosen**:
Split.io is excellent but adds complexity by separating flags from analytics. PostHog's unified approach is simpler for our current needs.

---

### Alternative 3: Custom Implementation (Database Flags)

**Description**:
Build custom feature flag system using database tables and environment variables.

**Pros**:
- Full control over implementation
- No external dependency
- Free (except development time)
- Can optimize for our specific use case

**Cons**:
- High development time (1-2 weeks initial build)
- No A/B testing statistical analysis
- Need to build admin UI for flag management
- No gradual rollout percentage controls
- Ongoing maintenance burden

**Why Not Chosen**:
Building feature flags is not our core competency. Development time better spent on product features. PostHog provides sophisticated solution for free.

---

### Alternative 4: Environment Variables (Simple Toggle)

**Description**:
Use environment variables for simple feature toggles without user targeting.

**Pros**:
- Extremely simple (already using env vars)
- Zero cost and dependencies
- Fast evaluation (no API calls)
- Works server-side natively

**Cons**:
- No user/segment targeting
- Requires deployment to change flags
- No gradual rollouts or A/B testing
- No analytics integration

**Why Not Chosen**:
Too simplistic for our needs. Can't do gradual rollouts or user-specific targeting. We need experimentation capabilities for product optimization.

---

## Related

**Related ADRs**:
- [ADR-001: Technology Stack Selection] - PostHog already in stack for analytics
- [ADR-003: Redis Caching Strategy] - Can cache flag evaluations in Redis

**Related Documentation**:
- [docs/experimentation/ab-testing-guide.md] - A/B test design guide (to be created)
- [docs/experimentation/feature-flags.md] - Flag naming and hygiene (to be created)

**External References**:
- [PostHog Feature Flags Documentation](https://posthog.com/docs/feature-flags)
- [PostHog Experimentation Guide](https://posthog.com/docs/experiments)
- [PostHog DPA for GDPR](https://posthog.com/docs/privacy/gdpr)
- [Experiment Design Best Practices](https://posthog.com/blog/experiments-best-practices)

---

## Notes

**Decision Making Process**:
- Evaluated build vs buy for feature flags
- Compared pricing for expected user volume (10k users)
- Tested PostHog flag evaluation performance
- Reviewed PostHog experiment success stories
- Decision date: 2025-11-16

**Review Schedule**:
- Revisit if PostHog becomes too expensive (>$100/month)
- Re-evaluate if we need advanced enterprise features (LaunchDarkly)
- Monitor: Flag evaluation latency, experiment velocity, PostHog cost

**Migration Plan**:
- **Phase 1 (Day 1)**: Sign PostHog DPA, configure data retention
- **Phase 2 (Day 2)**: Create first feature flag, test client/server evaluation
- **Phase 3 (Week 1)**: Implement flag abstraction layer (`lib/feature-flags.ts`)
- **Phase 4 (Week 2)**: Document flag naming conventions and lifecycle
- **Phase 5 (Ongoing)**: Create flags for each new feature requiring gradual rollout
- **Rollback**: PostHog SDK wraps flag checks, can replace with any provider

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-16 | AI Agent | Initial draft and approval |
