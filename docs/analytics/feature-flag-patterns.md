# PostHog Feature Flag Patterns

**Purpose**: Best practices and patterns for using feature flags in ApartmentDibs.

**Last Updated**: 2025-11-20

---

## Overview

Feature flags allow us to:

- **Gradual Rollouts**: Release features to 1%, 10%, 50%, 100% of users
- **A/B Testing**: Test variants to optimize conversion
- **Kill Switches**: Instantly disable problematic features
- **Beta Access**: Give early access to specific users
- **Environment Control**: Different behavior in dev/staging/prod

**Related Documents**:

- [PostHog Setup Guide](./posthog-setup-guide.md) - One-time account configuration (HITL task)
- [ADR-013: PostHog Analytics Platform](../adr/ADR-013-posthog-analytics-and-experimentation-platform.md)
- [User Story: PostHog Integration](../user-stories/posthog-integration.md)
- [PostHog Vercel Reverse Proxy Reference](../references/posthog-vercel-reverse-proxy.md)

### Feature Flag Reliability

Feature flags are evaluated through our Vercel reverse proxy (`/0579f8f99ca21e72e24243d7b9f81954`) to ensure reliable flag evaluation even when users have ad blockers enabled. This is critical for:

- **Consistent UX**: All users see the correct feature flag state
- **Accurate Experiments**: A/B tests get complete data without ad blocker interference
- **Kill Switch Reliability**: Emergency feature disabling works for all users

See [ADR-013 Reverse Proxy Configuration](../adr/ADR-013-posthog-analytics-and-experimentation-platform.md#1a-vercel-reverse-proxy-configuration) for technical details.

---

## Feature Flag Types

### 1. Boolean Flags

Simple on/off switches.

**Example**:

```typescript
'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export function Dashboard() {
  const newDashboard = useFeatureFlagEnabled('new-dashboard')

  if (newDashboard) {
    return <NewDashboard />
  }

  return <OldDashboard />
}
```

### 2. Multivariate Flags

Multiple variants for A/B/C testing.

**Example**:

```typescript
'use client'

import { useFeatureFlagVariantKey } from 'posthog-js/react'

export function PricingPage() {
  const variant = useFeatureFlagVariantKey('pricing-test')

  switch (variant) {
    case 'control':
      return <PricingOriginal />
    case 'variant-a':
      return <PricingLowerPrices />
    case 'variant-b':
      return <PricingHighlightAnnual />
    default:
      return <PricingOriginal />
  }
}
```

### 3. Percentage Rollouts

Gradually increase exposure.

**PostHog Configuration**:

- Day 1: 5% of users
- Day 3: 25% of users
- Day 7: 50% of users
- Day 14: 100% of users

---

## Client-Side Patterns

### Pattern 1: Component-Level Flags

**Use Case**: Show/hide entire UI components

```typescript
'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export function Header() {
  const showBetaFeatures = useFeatureFlagEnabled('beta-features')

  return (
    <header>
      <Logo />
      <Navigation />
      {showBetaFeatures && <BetaFeaturesMenu />}
    </header>
  )
}
```

### Pattern 2: Loading States

**Use Case**: Prevent flash of wrong content while flags load

```typescript
'use client'

import { useFeatureFlagEnabled, usePostHog } from 'posthog-js/react'

export function Dashboard() {
  const posthog = usePostHog()
  const newDashboard = useFeatureFlagEnabled('new-dashboard')

  // Check if flags are loaded
  if (posthog.isFeatureEnabled('new-dashboard') === undefined) {
    return <LoadingSpinner />
  }

  return newDashboard ? <NewDashboard /> : <OldDashboard />
}
```

### Pattern 3: Fallback to Default

**Use Case**: Graceful degradation if PostHog fails

```typescript
'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export function SearchPage() {
  // Default to false if PostHog isn't loaded
  const useNewSearch = useFeatureFlagEnabled('new-search') ?? false

  return useNewSearch ? <NewSearchUI /> : <OldSearchUI />
}
```

---

## Server-Side Patterns

### Pattern 1: Server Component Flags

**Use Case**: Decide which component to render on the server

```typescript
// app/dashboard/page.tsx
import { analyticsServer } from '@/lib/analytics/posthog.server'
import { auth } from '@/lib/auth' // Better Auth

export default async function DashboardPage() {
  const session = await auth()
  if (!session) return <LoginPrompt />

  const newDashboard = await analyticsServer.isFeatureEnabled(
    'new-dashboard',
    session.user.id
  )

  return newDashboard ? <NewDashboard /> : <OldDashboard />
}
```

### Pattern 2: API Route Flags

**Use Case**: Control API behavior

```typescript
// app/api/listings/route.ts
import { NextRequest } from 'next/server'
import { analyticsServer } from '@/lib/analytics/posthog.server'

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')

  const useNewAlgorithm = await analyticsServer.isFeatureEnabled('new-ranking-algorithm', userId)

  const listings = useNewAlgorithm
    ? await getListingsNewAlgorithm()
    : await getListingsOldAlgorithm()

  return Response.json(listings)
}
```

### Pattern 3: Feature Flag Caching

**Use Case**: Reduce PostHog API calls in server components

```typescript
import { cache } from 'react'
import { analyticsServer } from '@/lib/analytics/posthog.server'

// Cache flag evaluation for the duration of the request
const getFeatureFlag = cache(async (flagKey: string, userId: string) => {
  return await analyticsServer.isFeatureEnabled(flagKey, userId)
})

export async function MyServerComponent({ userId }: { userId: string }) {
  const isEnabled = await getFeatureFlag('my-feature', userId)

  return <div>{isEnabled ? 'New Feature' : 'Old Feature'}</div>
}
```

---

## Advanced Patterns

### Pattern 1: Flag + Analytics Tracking

**Use Case**: Track which variant users see

```typescript
'use client'

import { useEffect } from 'react'
import { useFeatureFlagVariantKey } from 'posthog-js/react'
import { useTrackEvent } from '@/lib/hooks/use-track-event'
import { Events } from '@/lib/analytics/events'

export function PricingPage() {
  const variant = useFeatureFlagVariantKey('pricing-test')
  const track = useTrackEvent()

  useEffect(() => {
    // Track which variant was shown
    if (variant) {
      track(
        Events.Experiment.viewed({
          experiment_name: 'pricing-test',
          variant_name: variant,
        })
      )
    }
  }, [variant, track])

  // Render based on variant...
}
```

### Pattern 2: User Targeting

**Use Case**: Show feature only to specific users

```typescript
// In PostHog dashboard:
// - Create flag 'beta-access'
// - Add user property filter: email contains '@beta-testers.com'
// - Or: user_id in ['user1', 'user2', 'user3']

'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export function AppLayout() {
  const hasBetaAccess = useFeatureFlagEnabled('beta-access')

  return (
    <div>
      {hasBetaAccess && <BetaBadge />}
      {hasBetaAccess && <BetaFeaturesPanel />}
    </div>
  )
}
```

### Pattern 3: Organization-Level Flags

**Use Case**: Enable features for entire organizations

```typescript
// In PostHog dashboard:
// - Create flag 'enterprise-features'
// - Add group filter: organization plan = 'enterprise'

'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export function Settings() {
  const hasEnterpriseFeatures = useFeatureFlagEnabled('enterprise-features')

  return (
    <div>
      <h1>Settings</h1>
      {hasEnterpriseFeatures && <AdvancedSecuritySettings />}
      {hasEnterpriseFeatures && <SSO Configuration />}
    </div>
  )
}
```

### Pattern 4: Kill Switch

**Use Case**: Instantly disable a problematic feature

```typescript
'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export function PaymentFlow() {
  // If this flag is disabled, fall back to old payment flow
  const useStripeCheckout = useFeatureFlagEnabled('stripe-checkout') ?? false

  if (!useStripeCheckout) {
    return <LegacyPaymentFlow />
  }

  return <StripeCheckoutFlow />
}
```

---

## Current Feature Flags

| Flag Key            | Type    | Purpose                              | Status              |
| ------------------- | ------- | ------------------------------------ | ------------------- |
| `new-dashboard`     | Boolean | New dashboard UI rollout             | 🟡 Testing (10%)    |
| `beta-features`     | Boolean | Early access features for beta users | 🟢 Active           |
| `maintenance-mode`  | Boolean | Kill switch for maintenance          | 🔴 Off              |
| `session-recording` | Boolean | Enable session recording             | 🟢 Active (opt-out) |

**Legend**:

- 🟢 Active (100%)
- 🟡 Testing (< 100%)
- 🔴 Off (0%)

---

## Best Practices

### 1. Flag Naming

**Good**:

- `new-dashboard` (descriptive)
- `checkout-flow-v2` (version number)
- `enable-session-recording` (action-oriented)

**Bad**:

- `test` (too vague)
- `flag1` (not descriptive)
- `johns-experiment` (personal names)

### 2. Flag Lifecycle

1. **Create**: Define flag in PostHog dashboard
2. **Develop**: Implement feature behind flag
3. **Test**: Internal testing at 0% or specific users
4. **Rollout**: Gradual increase (1% → 10% → 50% → 100%)
5. **Monitor**: Watch error rates, analytics, user feedback
6. **Stabilize**: Run at 100% for 2+ weeks
7. **Remove**: Delete flag code, remove from PostHog

**Important**: Don't accumulate technical debt! Remove flags after successful rollout.

### 3. Default Values

Always provide fallback values:

```typescript
// ❌ Bad: Will crash if PostHog fails
const isEnabled = useFeatureFlagEnabled('my-feature')
return isEnabled ? <New /> : <Old />

// ✅ Good: Defaults to false
const isEnabled = useFeatureFlagEnabled('my-feature') ?? false
return isEnabled ? <New /> : <Old />
```

### 4. Loading States

Handle flag loading gracefully:

```typescript
// ✅ Good: Shows loader while flags load
const isEnabled = useFeatureFlagEnabled('my-feature')

if (isEnabled === undefined) {
  return <Skeleton />
}

return isEnabled ? <New /> : <Old />
```

### 5. Testing

Mock flags in tests:

```typescript
// __tests__/my-component.test.tsx
import { render } from '@testing-library/react'
import { PostHogProvider } from 'posthog-js/react'

// Mock PostHog
jest.mock('posthog-js', () => ({
  isFeatureEnabled: jest.fn().mockReturnValue(true)
}))

test('renders new feature when flag is enabled', () => {
  render(
    <PostHogProvider client={mockPostHog}>
      <MyComponent />
    </PostHogProvider>
  )
  // assertions...
})
```

---

## Common Use Cases

### Use Case 1: Gradual Rollout

**Scenario**: New search algorithm

**Strategy**:

1. Week 1: Internal team only (0.1%)
2. Week 2: Early adopters (5%)
3. Week 3: General rollout (50%)
4. Week 4: Full rollout (100%)

**PostHog Config**: Percentage rollout with gradual increase

---

### Use Case 2: A/B Test

**Scenario**: Test two pricing page designs

**Strategy**:

- 50% see original (control)
- 50% see new design (variant)
- Track conversion rate for each
- Winner gets 100% rollout

**PostHog Config**: Multivariate flag with 50/50 split

---

### Use Case 3: Beta Program

**Scenario**: New landlord dashboard for beta testers

**Strategy**:

- Target users with `beta_tester` property
- OR target specific user IDs
- Collect feedback before public launch

**PostHog Config**: User property filter or ID list

---

### Use Case 4: Maintenance Mode

**Scenario**: Disable payments during database migration

**Strategy**:

- Create `maintenance-mode` flag
- Default to `false` in code
- Flip to `true` during migration
- Show maintenance message
- Flip back to `false` after migration

**PostHog Config**: Boolean flag with instant rollout

---

## Troubleshooting

### Flag not updating?

- PostHog polls every 30 seconds by default
- Force refresh: `posthog.reloadFeatureFlags()`
- Check flag status in PostHog dashboard

### Flash of wrong content (FOUC)?

- Add loading state while flags load
- Use server-side rendering for critical flags
- Set sensible default values

### Flag evaluation slow?

- Cache flag results with React `useMemo`
- Use server-side evaluation for SSR
- Self-host PostHog for lower latency

---

## Resources

- [PostHog Feature Flags Docs](https://posthog.com/docs/feature-flags)
- [PostHog A/B Testing Guide](https://posthog.com/docs/experiments)
- [PostHog Dashboard](https://app.posthog.com)
- [Internal: PostHog Integration Spec](../technical-specs/posthog-integration-spec.md)
