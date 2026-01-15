# US-002: PostHog Analytics and Experimentation Platform Integration [P0]

**Status**: Draft
**Priority**: P0 (MVP - Must Have)
**Sprint**: Sprint 2, Week 1-2

---

## User Story

**As a** product manager, engineer, and business stakeholder
**I want to** have comprehensive analytics, feature flags, and A/B testing capabilities integrated into the application
**So that** I can make data-driven product decisions, gradually roll out features, run experiments, and understand user behavior

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 100% of users across all personas (tenants, agents, landlords, admins) - All future features benefit from analytics
- **Impact**: 3 (Massive)
  - Enables data-driven decision making for all future features
  - Reduces deployment risk with feature flags and gradual rollouts
  - Provides debugging capability with session recordings
  - Creates feedback loop for continuous improvement
  - Essential infrastructure for product-led growth
- **Confidence**: 100% (proven platform, clear integration path, straightforward implementation)
- **Effort**: 2 person-weeks
  - Setup: 0.5 weeks (PostHog account, environment config)
  - Core integration: 0.75 weeks (provider setup, user identification, pageview tracking)
  - Event tracking: 0.5 weeks (custom events across key user flows)
  - Testing & validation: 0.25 weeks (verify events, test feature flags)

**RICE Score**: (1000 × 3 × 1.0) / 2 = **1,500**

### Story Points
**Estimated Effort**: 13 story points (32 hours)

**Complexity Factors**:
- Technical complexity: Medium (React provider setup, server-side identification, multi-tenant context)
- UI complexity: Low (no UI changes, invisible to users)
- Integration complexity: Medium (Better Auth integration, organization tracking, event instrumentation)
- Unknown factors: Feature flag implementation patterns for Next.js App Router

---

## Acceptance Criteria

### AC-1: PostHog Provider Initialized
**Given** the application loads
**When** a user visits any page
**Then** PostHog client is initialized with correct project API key
**And** pageview event is automatically tracked with URL and timestamp
**And** no console errors related to PostHog appear

**Verification**:
- [ ] PostHog provider wraps app in `app/layout.tsx`
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` environment variable configured
- [ ] Client initializes on first page load
- [ ] Pageview events appear in PostHog dashboard within 60 seconds
- [ ] Works in both development and production environments

### AC-2: User Identification on Authentication
**Given** a user successfully logs in with Better Auth
**When** authentication completes
**Then** PostHog identifies user with `userId`, `email`, and `name`
**And** organization context is set with `organizationId` and `organizationName`
**And** user properties include `userRole` (tenant/agent/landlord/admin)
**And** all subsequent events are linked to this user identity

**Verification**:
- [ ] `posthog.identify()` called after Better Auth login
- [ ] User ID matches Better Auth user ID
- [ ] User properties set correctly: `{email, name, role, organizationId, organizationName}`
- [ ] Organization-level events can be filtered in PostHog
- [ ] User identification persists across sessions
- [ ] Identification cleared on logout

### AC-3: Custom Event Tracking for Key User Actions
**Given** key user interactions occur
**When** users perform critical actions
**Then** custom events are tracked with relevant properties

**Events to Track**:

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `application_created` | Tenant submits rental application | `{userId, listingId, organizationId, timestamp}` |
| `application_viewed` | Landlord/agent views application | `{userId, applicationId, viewerRole, timestamp}` |
| `listing_created` | Landlord creates new listing | `{userId, listingId, organizationId, timestamp}` |
| `listing_viewed` | User views listing details | `{userId, listingId, source, timestamp}` |
| `message_sent` | User sends message | `{userId, recipientRole, conversationId, timestamp}` |
| `search_performed` | User searches listings | `{userId, query, filters, resultCount, timestamp}` |
| `profile_completed` | User completes profile | `{userId, role, profileType, timestamp}` |
| `payment_initiated` | User starts payment flow | `{userId, amount, paymentType, timestamp}` |
| `payment_completed` | Payment succeeds | `{userId, amount, paymentType, timestamp}` |

**Verification**:
- [ ] All listed events tracked correctly
- [ ] Event properties captured accurately
- [ ] Events appear in PostHog within 60 seconds
- [ ] Events queryable and filterable in PostHog
- [ ] No PII leaked in event properties (email, SSN, etc.)

### AC-4: Feature Flags Implementation
**Given** feature flags are configured in PostHog dashboard
**When** application checks for feature flag status
**Then** correct boolean value returned based on user/organization context
**And** flags can be used to conditionally render features
**And** flags support gradual rollouts (0-100% of users)

**Verification**:
- [ ] `useFeatureFlagEnabled()` hook works in client components
- [ ] Server-side feature flag checks work in API routes
- [ ] Flags respect user-level targeting rules
- [ ] Flags respect organization-level targeting rules
- [ ] Flag changes reflected within 60 seconds (polling interval)
- [ ] Default fallback value used if flag undefined

**Example Usage**:
```typescript
// Client-side
const isNewDashboardEnabled = useFeatureFlagEnabled('new-dashboard')

// Server-side
const flagValue = await posthog.getFeatureFlag('new-dashboard', userId)
```

### AC-5: Session Recording for Debugging
**Given** session recording is enabled
**When** users interact with the application
**Then** user sessions are recorded and playable in PostHog dashboard
**And** recordings respect privacy (no password fields, no PII in forms)
**And** recordings help debug issues and understand UX problems

**Verification**:
- [ ] Session recording enabled in PostHog config
- [ ] Recordings appear in PostHog dashboard
- [ ] Recordings show mouse movements, clicks, scrolls, page transitions
- [ ] Password inputs masked/hidden in recordings
- [ ] PII fields (SSN, etc.) masked in recordings
- [ ] Recordings can be filtered by user, date, session duration
- [ ] Performance impact acceptable (< 50ms overhead)

### AC-6: Organization-Level Analytics
**Given** ApartmentDibs is a multi-tenant application
**When** events are tracked
**Then** organization context is included in all events
**And** analytics can be segmented by organization
**And** organization admins can see their organization's metrics

**Verification**:
- [ ] `organizationId` included in all user events
- [ ] `organizationName` set as user property
- [ ] Events filterable by organization in PostHog
- [ ] Organization-level dashboards configurable
- [ ] Cross-organization analytics available for platform team
- [ ] Organization context set on login and persists

### AC-7: Performance and Error Handling
**Performance**:
- [ ] PostHog initialization adds < 100ms to page load
- [ ] Event tracking is non-blocking (async)
- [ ] Analytics don't impact core app functionality
- [ ] Works on slow network connections (3G)

**Error Handling**:
- [ ] PostHog failures don't break app functionality
- [ ] Console warnings logged if PostHog unavailable
- [ ] Events queued if PostHog temporarily unreachable
- [ ] Graceful degradation if PostHog blocked (ad blockers)

**Privacy & Compliance**:
- [ ] GDPR compliance: respect user consent preferences
- [ ] CCPA compliance: support opt-out requests
- [ ] No sensitive PII tracked (SSN, full credit card, etc.)
- [ ] IP address anonymization enabled
- [ ] Cookie consent banner honors opt-out

---

## Technical Implementation Notes

### Backend Specification

**PostHog Server-Side Client**:
```typescript
// lib/posthog.server.ts
import { PostHog } from 'posthog-node'

export const posthog = new PostHog(
  process.env.POSTHOG_PERSONAL_API_KEY!,
  {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 20, // Batch size
    flushInterval: 10000, // 10 seconds
  }
)

// Helper for server-side events
export async function trackServerEvent(
  userId: string,
  event: string,
  properties?: Record<string, any>
) {
  posthog.capture({
    distinctId: userId,
    event,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
    },
  })

  // Flush immediately in serverless environments
  await posthog.shutdown()
}
```

**Better Auth Integration**:
```typescript
// app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth'
import { posthog } from '@/lib/posthog.server'

// After successful login/signup
export async function identifyUser(session: Session) {
  await posthog.identify({
    distinctId: session.user.id,
    properties: {
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      organizationId: session.user.organizationId,
      organizationName: session.organization?.name,
      createdAt: session.user.createdAt,
    },
  })

  // Set organization as group
  await posthog.groupIdentify({
    groupType: 'organization',
    groupKey: session.user.organizationId,
    properties: {
      name: session.organization?.name,
      plan: session.organization?.plan,
      createdAt: session.organization?.createdAt,
    },
  })
}
```

**Feature Flag Helper**:
```typescript
// lib/feature-flags.ts
import { posthog } from './posthog.server'

export async function getFeatureFlag(
  flagKey: string,
  userId: string,
  defaultValue: boolean = false
): Promise<boolean> {
  try {
    const flag = await posthog.getFeatureFlag(flagKey, userId)
    return flag === true
  } catch (error) {
    console.warn(`Feature flag ${flagKey} failed, using default:`, error)
    return defaultValue
  }
}

export async function getAllFeatureFlags(userId: string): Promise<Record<string, boolean>> {
  try {
    return await posthog.getAllFlags(userId)
  } catch (error) {
    console.warn('Failed to fetch feature flags:', error)
    return {}
  }
}
```

**Environment Variables** (already in `.env.example`):
- `NEXT_PUBLIC_POSTHOG_KEY` - Project API key (client-side)
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL
- `POSTHOG_PERSONAL_API_KEY` - Personal API key (server-side)

### Frontend Specification

**PostHog Provider**:
```typescript
// components/providers/posthog-provider.tsx
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'identified_only', // Don't track anonymous users in full
        capture_pageview: false, // We'll handle this manually
        capture_pageleave: true,
        session_recording: {
          maskAllInputs: false, // We'll mask specific inputs
          maskInputOptions: {
            password: true, // Always mask passwords
            email: false, // Allow email visibility
          },
        },
      })
    }
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
```

**App Layout Integration**:
```typescript
// app/layout.tsx
import { PHProvider } from '@/components/providers/posthog-provider'
import { PostHogPageview } from '@/components/posthog-pageview'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PHProvider>
          <PostHogPageview />
          {children}
        </PHProvider>
      </body>
    </html>
  )
}
```

**Pageview Tracking Component**:
```typescript
// components/posthog-pageview.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export function PostHogPageview() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }

      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams, posthog])

  return null
}
```

**Auth Integration Hook**:
```typescript
// hooks/use-posthog-auth.ts
'use client'

import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { useSession } from '@/lib/auth-client'

export function usePostHogAuth() {
  const posthog = usePostHog()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user && posthog) {
      // Identify user
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        organizationId: session.user.organizationId,
        organizationName: session.organization?.name,
      })

      // Set organization group
      posthog.group('organization', session.user.organizationId, {
        name: session.organization?.name,
        plan: session.organization?.plan,
      })
    } else if (posthog) {
      // User logged out
      posthog.reset()
    }
  }, [session, posthog])
}
```

**Event Tracking Hook**:
```typescript
// hooks/use-track-event.ts
'use client'

import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'

export function useTrackEvent() {
  const posthog = usePostHog()

  return useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      if (posthog) {
        posthog.capture(eventName, {
          ...properties,
          timestamp: new Date().toISOString(),
        })
      }
    },
    [posthog]
  )
}

// Usage in components:
// const trackEvent = useTrackEvent()
// trackEvent('listing_viewed', { listingId: '123', source: 'search' })
```

**Feature Flag Hook** (provided by PostHog):
```typescript
// Already provided by posthog-js/react
import { useFeatureFlagEnabled, useFeatureFlagPayload } from 'posthog-js/react'

// Usage:
const isEnabled = useFeatureFlagEnabled('new-dashboard')
const payload = useFeatureFlagPayload('new-dashboard')
```

**Routing**:
- No new routes needed (analytics are invisible infrastructure)

**Dependencies**:
```json
{
  "dependencies": {
    "posthog-js": "^1.100.0",
    "posthog-node": "^4.0.0"
  }
}
```

---

## Analytics Tracking

**Core Events** (Auto-tracked):
- `$pageview` - Every page navigation
- `$pageleave` - When user leaves page
- `$autocapture` - Automatic click tracking

**Custom Events** (Manual tracking):
See AC-3 for comprehensive list of custom events

**Success Metrics**:
- Event tracking latency < 60 seconds (from action to dashboard)
- Event delivery success rate > 99.5%
- Feature flag response time < 100ms
- Session recording capture rate > 95%
- Zero analytics-related errors breaking app functionality
- Organization-level analytics filterable for 100% of events

---

## Dependencies

### Blocks
This story is foundational infrastructure and blocks:
- **All A/B testing features** - Need feature flags
- **Data-driven product decisions** - Need event tracking
- **User behavior analysis** - Need session recordings
- **Gradual feature rollouts** - Need feature flags
- **Performance monitoring** - Need analytics baseline

### Blocked By
- **US-001: User Authentication** - Need user identification working

### Related Stories
- US-010: GDPR Compliance - Cookie consent integration
- US-011: Analytics Dashboard - Custom dashboards for stakeholders
- US-015: A/B Test Framework - Structured experimentation process

### External Dependencies
- PostHog account created (free tier available)
- PostHog project API keys generated
- `NEXT_PUBLIC_POSTHOG_KEY` environment variable set
- `POSTHOG_PERSONAL_API_KEY` environment variable set
- Better Auth session management working

---

## Testing Requirements

### Unit Tests
- [ ] PostHog provider initializes correctly
- [ ] User identification function works
- [ ] Event tracking function captures events
- [ ] Feature flag helper returns correct values
- [ ] Organization context helper works
- [ ] Error handling gracefully degrades

### Integration Tests
- [ ] PostHog initializes on app load
- [ ] Pageview events tracked on navigation
- [ ] User identified after login
- [ ] Custom events tracked correctly
- [ ] Feature flags queried successfully
- [ ] Organization groups set correctly
- [ ] Session recordings start after opt-in

### E2E Tests (Playwright)
```typescript
test('PostHog tracks user journey', async ({ page }) => {
  // Visit homepage - should track pageview
  await page.goto('/')

  // Sign up - should identify user
  await page.goto('/sign-up')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'SecurePass123!')
  await page.click('button[type="submit"]')

  // Navigate to dashboard - should track pageview
  await expect(page).toHaveURL('/dashboard')

  // Perform action - should track custom event
  await page.click('[data-testid="create-listing"]')

  // Verify no console errors related to PostHog
  const errors = await page.evaluate(() => {
    return (window as any).__posthogErrors || []
  })
  expect(errors).toHaveLength(0)
})

test('Feature flags work correctly', async ({ page }) => {
  // Set up mock feature flag
  await page.addInitScript(() => {
    (window as any).__POSTHOG_FLAGS__ = {
      'new-dashboard': true,
    }
  })

  await page.goto('/dashboard')

  // Verify new dashboard shown if flag enabled
  await expect(page.locator('[data-testid="new-dashboard"]')).toBeVisible()
})
```

**Test Coverage Target**: 85% for analytics integration code

---

## Security Considerations

**Access Control**:
- PostHog Personal API key kept server-side only (never exposed to client)
- Project API key is public (safe to expose, read-only for events)
- Organization-level data isolation enforced

**Data Validation**:
- Event properties sanitized before sending
- No sensitive PII tracked (SSN, credit cards, passwords)
- Email addresses allowed but can be hashed if needed
- User IDs are opaque (not sequential)

**Privacy Compliance**:
- IP address anonymization enabled
- Cookie consent integration required (future story)
- Support for user data deletion requests (GDPR/CCPA)
- Session recordings respect privacy (mask sensitive fields)

**Potential Risks**:
- **Ad blockers**: Mitigate with proxy setup (future enhancement)
- **Data leakage**: Never track sensitive fields, use allow-list approach
- **Performance impact**: Async tracking, batching, graceful degradation
- **Third-party dependency**: Graceful fallback if PostHog unavailable

---

## Performance Considerations

**Expected Load**:
- 10,000+ events per day initially
- 100+ concurrent users during peak
- 1,000+ daily active users at scale

**Optimization Strategies**:
- Client-side batching (PostHog default: 10 events or 10 seconds)
- Server-side batching (PostHog Node SDK: 20 events or 10 seconds)
- Async event capture (non-blocking)
- Feature flag caching (60-second TTL)
- Lazy provider initialization (after app interactive)

**Performance Targets**:
- PostHog initialization: < 100ms overhead
- Event capture: < 10ms (async, non-blocking)
- Feature flag lookup: < 50ms (cached)
- Session recording: < 50ms overhead per interaction
- No impact on Core Web Vitals (LCP, FID, CLS)

---

## Rollout Plan

**Phase 1: Setup (Week 1, Days 1-2)**
- [ ] Create PostHog account and project
- [ ] Generate API keys and add to environment
- [ ] Install `posthog-js` and `posthog-node` packages
- [ ] Configure PostHog provider in app layout
- [ ] Verify initialization and pageview tracking

**Phase 2: User Identification (Week 1, Days 3-4)**
- [ ] Integrate with Better Auth login flow
- [ ] Add user identification on authentication
- [ ] Add organization group tracking
- [ ] Test multi-tenant context
- [ ] Verify user properties in PostHog dashboard

**Phase 3: Custom Events (Week 2, Days 1-3)**
- [ ] Implement event tracking hook
- [ ] Add events for applications, listings, messages
- [ ] Add events for search and profile actions
- [ ] Add events for payment flows
- [ ] Test all events in dashboard

**Phase 4: Feature Flags & Session Recording (Week 2, Days 4-5)**
- [ ] Implement feature flag helpers (client + server)
- [ ] Create test feature flags in dashboard
- [ ] Enable session recording with privacy config
- [ ] Test feature flag targeting rules
- [ ] Validate session recordings

**Rollback Plan**:
- PostHog is non-blocking infrastructure
- Can disable by removing provider wrapper
- Feature flags should have sensible defaults
- No database migrations needed
- Easy to rollback by reverting code changes

---

## Open Questions

- [x] **Question 1**: Should we track anonymous users before authentication?
  - **Answer**: No, use `person_profiles: 'identified_only'` to avoid inflating user counts. Track pageviews but don't create full user profiles until authenticated.

- [x] **Question 2**: What's the PostHog data retention policy?
  - **Answer**: Free tier: 1 year for events, unlimited for recordings. Paid plans: configurable. Confirm with PostHog documentation.

- [ ] **Question 3**: Do we need a cookie consent banner before enabling PostHog?
  - **Answer**: Yes, required for GDPR/CCPA compliance. Create separate story (US-010) for cookie consent integration.

- [ ] **Question 4**: Should we proxy PostHog requests to avoid ad blockers?
  - **Answer**: Not for MVP. Future enhancement (US-012) to improve event capture rate if ad blocking becomes significant issue.

- [ ] **Question 5**: What feature flags should we create for initial testing?
  - **Answer**: TBD during implementation. Suggest: `new-dashboard`, `beta-features`, `maintenance-mode` as starting examples.

---

## Notes & Updates

### Update Log

| Date | Author | Update |
|------|--------|--------|
| 2025-11-20 | Product Manager Agent | Initial draft created |

### Discussion Notes

**Why PostHog?**
- Open-source with self-hosting option (future flexibility)
- All-in-one: analytics + feature flags + A/B testing + session recording
- Better Auth integration straightforward
- Organization/group tracking built-in for multi-tenant apps
- Generous free tier (1M events/month, unlimited feature flags)

**Implementation Strategy**:
- Start with core tracking (pageviews, user identification)
- Add custom events incrementally across user flows
- Feature flags introduced gradually with sensible defaults
- Session recording enabled but respects privacy settings

**Success Indicators**:
- Product team can answer "How many users did X?" queries
- Engineering can use feature flags for gradual rollouts
- Business team has visibility into conversion funnels
- Support team can watch session replays to debug issues

---

## Related Documentation

- **PostHog Docs**: https://posthog.com/docs
- **PostHog React Integration**: https://posthog.com/docs/libraries/react
- **PostHog Feature Flags**: https://posthog.com/docs/feature-flags
- **Better Auth Session Management**: (see project auth setup)
- **ADRs**: ADR-015 (Analytics Platform Selection) - To be created
- **Environment Setup**: `.env.example` (PostHog variables already added)

---

**Last Updated**: 2025-11-20
**Status**: Draft - Ready for HITL Gate #1 Review
**Assigned To**: Backend Developer (server integration) + Frontend Developer (client integration)
**Reviewer**: Product Manager + Architecture Agent
