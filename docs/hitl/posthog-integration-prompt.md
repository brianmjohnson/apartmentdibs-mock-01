# PostHog Integration Prompt

## Objective

Add PostHog analytics and experimentation platform to the ApartmentDibs application following the official Next.js 15+ App Router integration guide.

## Documentation Reference

- **Primary Guide**: https://posthog.com/docs/libraries/next-js
- **App Router Tutorial**: https://posthog.com/tutorials/nextjs-app-directory-analytics
- **A/B Testing Guide**: https://posthog.com/tutorials/nextjs-ab-tests
- **Monitoring Guide**: https://posthog.com/tutorials/nextjs-monitoring

## Feature Requirements

### Core Capabilities

1. **Analytics**: Track pageviews, user interactions, and custom events
2. **Feature Flags**: Enable/disable features for different user segments
3. **A/B Testing**: Run experiments to optimize user experience
4. **Session Recording**: Capture user sessions for debugging and UX analysis
5. **User Identification**: Link analytics to authenticated users
6. **Organization Tracking**: Track events by organization context

### Technical Requirements

- Use Next.js 15.3+ `instrumentation-client.ts` approach (lightweight setup)
- Support both client-side and server-side event tracking
- Integrate with Better Auth for user identification
- Integrate with Organization context from Better Auth
- Configure proper environment variables with `NEXT_PUBLIC_` prefix
- Follow vendor-prefixed naming convention (e.g., `POSTHOG_*` for private vars)

## HITL Workflow - Step-by-Step Instructions

### Phase 1: Documentation & Planning

#### Step 1.1: Update Business Plan (README.md)

**Action**: Add PostHog to the Features section of README.md

**What to Add**:

```markdown
### Analytics & Experimentation

- **Platform**: PostHog (open-source product analytics)
- **Capabilities**:
  - Event tracking and analytics
  - Feature flags and A/B testing
  - Session recording and heatmaps
  - User segmentation and funnels
- **Integration**: Next.js App Router with SSR support
```

**Agent**: None (direct edit or use general-purpose agent)

#### Step 1.2: Create User Story

**Agent**: `product-manager.md`

**Prompt to Product Manager Agent**:

```
Create a user story for integrating PostHog analytics and experimentation platform into the application.

Requirements:
- Event tracking for all user interactions
- Feature flags for gradual rollouts
- A/B testing capability for experiments
- User identification with Better Auth integration
- Organization-level tracking
- Session recording for UX analysis

Target Users: Product team, engineering team, business stakeholders
RICE Scoring Factors:
- Reach: All users (tenants, agents, landlords)
- Impact: High (enables data-driven decisions)
- Confidence: High (proven platform)
- Effort: Medium (straightforward integration)
```

**Output**: `docs/user-stories/posthog-integration.md`

**HITL Gate #1**: STOP HERE. Review the user story.

- [ ] User story accurately captures PostHog capabilities
- [ ] Acceptance criteria are clear and testable
- [ ] RICE score is reasonable
- [ ] Success metrics are defined

**Resume Command**: After approval, continue to Step 1.3

---

#### Step 1.3: Create Architecture Decision Record (ADR)

**Agent**: `architecture-agent.md`

**Prompt to Architecture Agent**:

```
Create an ADR for integrating PostHog as our analytics and experimentation platform.

Decision: Use PostHog for product analytics, feature flags, and A/B testing

Context:
- Next.js 15+ App Router application
- Better Auth with organization support
- Need for data-driven product decisions
- Experimentation framework for optimization
- Session recording for debugging

Alternatives Considered:
1. Google Analytics + LaunchDarkly + FullStory (separate tools)
2. Mixpanel + Split + LogRocket
3. Amplitude + Optimizely
4. PostHog (all-in-one solution)

Technical Considerations:
- Next.js 15.3+ instrumentation-client.ts approach
- SSR compatibility
- GDPR compliance
- Performance impact
- Self-hosted vs Cloud options
- Organization multi-tenancy tracking

Integration Points:
- Better Auth user identification
- Organization context
- tRPC API endpoints
- Error tracking (if applicable)
```

**Output**: `docs/adr/XXX-posthog-integration.md` (auto-numbered)

**HITL Gate #2**: STOP HERE. Review the ADR.

- [ ] Decision rationale is sound
- [ ] Alternatives were properly evaluated
- [ ] Technical considerations are complete
- [ ] Consequences (positive and negative) are listed
- [ ] Integration points are identified

**Resume Command**: After approval, continue to Step 1.4

---

#### Step 1.4: Create Technical Specification

**Agent**: `frontend-developer.md` (PostHog is primarily frontend integration)

**Prompt to Frontend Developer Agent**:

```
Create a technical specification for PostHog integration based on the approved ADR and user story.

Include:
1. Installation steps (npm packages)
2. Environment variable configuration
3. File structure changes:
   - instrumentation-client.ts
   - PostHog provider component (if needed)
   - Utility functions for tracking
4. Integration points:
   - User identification on auth
   - Organization context setting
   - Page view tracking
   - Custom event tracking
5. TypeScript types and interfaces
6. Testing strategy
7. Performance considerations
8. GDPR compliance setup (cookie consent)

Reference: https://posthog.com/docs/libraries/next-js
```

**Output**: Create technical spec document or detailed implementation plan

**HITL Gate #3**: STOP HERE. Review the technical specification.

- [ ] Implementation approach is clear
- [ ] All integration points are covered
- [ ] TypeScript types are properly defined
- [ ] Testing strategy is adequate
- [ ] Performance impact is acceptable
- [ ] GDPR compliance is addressed

**Resume Command**: After approval, continue to Phase 2

---

### Phase 2: Implementation

#### Step 2.1: Environment Configuration

**Action**: Update environment variables

**Files to Update**:

1. `.env.example` - Add PostHog variables with documentation
2. `.env.local` - Add actual values (local development)
3. `docs/GETTING_STARTED.md` - Document new env vars
4. Vercel project settings - Add production env vars

**Required Environment Variables**:

```bash
# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # or https://eu.i.posthog.com

# Optional: PostHog API (for server-side operations)
POSTHOG_API_KEY=phx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Agent**: None (manual configuration) or `general-purpose`

---

#### Step 2.2: Install PostHog Package

**Action**: Install npm package

```bash
pnpm add posthog-js
```

**Agent**: Can be done directly or via `frontend-developer.md`

---

#### Step 2.3: Create PostHog Client Setup

**Agent**: `frontend-developer.md`

**Files to Create/Modify**:

1. **Create**: `instrumentation-client.ts` (root level, Next.js 15.3+)

```typescript
// instrumentation-client.ts
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only', // or 'always' for session recording
    capture_pageview: false, // We'll handle this manually
    capture_pageleave: true,
    defaults: '2025-05-24', // Use latest defaults
    // GDPR compliance
    opt_out_capturing_by_default: false, // Set true if requiring cookie consent
    respect_dnt: true,
  })
}
```

2. **Create**: `lib/analytics/posthog.ts` (utilities)

```typescript
import posthog from 'posthog-js'

export const analytics = {
  // Identify user
  identify: (userId: string, properties?: Record<string, any>) => {
    posthog.identify(userId, properties)
  },

  // Track event
  track: (eventName: string, properties?: Record<string, any>) => {
    posthog.capture(eventName, properties)
  },

  // Set organization context
  setOrganization: (orgId: string, orgName: string) => {
    posthog.group('organization', orgId, { name: orgName })
  },

  // Reset on logout
  reset: () => {
    posthog.reset()
  },

  // Page view (if manual tracking)
  pageView: () => {
    posthog.capture('$pageview')
  },
}

export { posthog }
```

3. **Create**: `app/providers/posthog-provider.tsx` (if needed for app router < 15.3)

```typescript
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

export function PostHogPageView(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams])

  return null
}
```

---

#### Step 2.4: Integrate with Better Auth

**Agent**: `backend-developer.md` or `frontend-developer.md`

**Action**: Add PostHog identification when user logs in

**File to Modify**: Look for auth callback/login handler

**Example Integration**:

```typescript
// When user successfully authenticates
import { analytics } from '@/lib/analytics/posthog'

// After successful login
analytics.identify(user.id, {
  email: user.email,
  name: user.name,
  role: user.role,
  createdAt: user.createdAt,
})

// If user belongs to organization
if (user.organizationId) {
  analytics.setOrganization(user.organizationId, organization.name)
}
```

---

#### Step 2.5: Add Event Tracking

**Agent**: `frontend-developer.md`

**Action**: Add tracking for key user actions

**Examples**:

- Property search
- Application submission
- Message sent
- Listing created
- Profile updated

**Implementation**: Add `analytics.track()` calls in relevant components/actions

---

#### Step 2.6: Update TypeScript Configuration

**Action**: Ensure instrumentation files are included

**File**: `tsconfig.json` or `next.config.ts`

Verify that instrumentation files are properly typed and included.

---

### Phase 3: Testing & Validation

#### Step 3.1: Manual Testing

**Agent**: `quality-reviewer.md`

**Test Cases**:

1. PostHog initializes on page load
2. Page views are tracked
3. User identification works on login
4. Custom events are captured
5. Organization context is set
6. Reset works on logout
7. No console errors
8. Performance impact is minimal

**Validation**: Check PostHog dashboard for incoming events

---

#### Step 3.2: Automated Testing (Optional)

**Agent**: `quality-reviewer.md`

**Action**: Create tests for analytics utility functions

**File**: `lib/analytics/__tests__/posthog.test.ts`

Mock PostHog and verify function calls work correctly.

---

### Phase 4: Documentation

#### Step 4.1: Update Project Documentation

**Files to Update**:

1. **README.md**: Already updated in Step 1.1
2. **docs/GETTING_STARTED.md**: Add PostHog env var setup
3. **docs/ARCHITECTURE.md**: Reference PostHog ADR
4. **docs/adr/README.md**: Link to PostHog ADR
5. **.env.example**: Already updated in Step 2.1

---

#### Step 4.2: Create PostHog Usage Guide (Optional)

**File**: `docs/analytics/posthog-guide.md`

**Content**:

- How to track custom events
- How to use feature flags
- How to set up A/B tests
- How to access PostHog dashboard
- GDPR and privacy considerations
- Debugging tips

---

### Phase 5: Deployment

#### Step 5.1: Verify Environment Variables in Vercel

**Action**: Ensure PostHog env vars are set in Vercel project settings

**Environments**: Production, Preview (optional)

---

#### Step 5.2: Deploy and Monitor

**Agent**: Can use `general-purpose` or manual deploy

**Steps**:

1. Commit all changes
2. Push to branch
3. Create PR
4. Deploy to preview
5. Test on preview deployment
6. Merge to main
7. Monitor production PostHog dashboard

---

### Phase 6: Follow-up Tasks

#### Optional Enhancements:

1. **Session Recording**: Enable in PostHog settings
2. **Feature Flags**: Create first feature flag
3. **A/B Test**: Set up first experiment (use `experimentation-agent.md`)
4. **Funnels**: Define key conversion funnels
5. **Dashboards**: Create custom dashboards for different teams

---

## Agent Summary

| Phase           | Agent                      | Purpose                             |
| --------------- | -------------------------- | ----------------------------------- |
| Planning        | `product-manager.md`       | Create user story with RICE scoring |
| Planning        | `architecture-agent.md`    | Create ADR for PostHog integration  |
| Planning        | `frontend-developer.md`    | Create technical specification      |
| Implementation  | `frontend-developer.md`    | Implement PostHog client setup      |
| Implementation  | `backend-developer.md`     | Integrate with Better Auth          |
| Testing         | `quality-reviewer.md`      | QA testing and validation           |
| Experimentation | `experimentation-agent.md` | Set up A/B tests (future)           |

---

## Checklist for Claude

Use this checklist to track progress:

- [ ] Phase 1.1: Update README.md with PostHog
- [ ] Phase 1.2: Create user story (HITL Gate #1 - STOP)
- [ ] Phase 1.3: Create ADR (HITL Gate #2 - STOP)
- [ ] Phase 1.4: Create technical spec (HITL Gate #3 - STOP)
- [ ] Phase 2.1: Configure environment variables
- [ ] Phase 2.2: Install posthog-js package
- [ ] Phase 2.3: Create PostHog client setup files
- [ ] Phase 2.4: Integrate with Better Auth
- [ ] Phase 2.5: Add event tracking
- [ ] Phase 2.6: Update TypeScript config
- [ ] Phase 3.1: Manual testing (HITL if issues found)
- [ ] Phase 3.2: Automated testing (optional)
- [ ] Phase 4.1: Update all documentation
- [ ] Phase 4.2: Create usage guide (optional)
- [ ] Phase 5.1: Verify Vercel env vars
- [ ] Phase 5.2: Deploy and monitor
- [ ] Create session summary

---

## Prompt to Start

**Copy and paste this to Claude to begin**:

```
I want to add PostHog analytics and experimentation platform to the ApartmentDibs application. Follow the step-by-step workflow documented in docs/hitl/posthog-integration-prompt.md.

Start with Phase 1 (Documentation & Planning):
1. Update README.md to add PostHog to features
2. Use the product-manager agent to create the user story
3. Stop at HITL Gate #1 for my review

Use the proper agent workflow as documented. Do not skip any HITL gates.

Reference: https://posthog.com/docs/libraries/next-js
```

---

## Notes

- **HITL Gates**: There are 3 HITL gates in the planning phase. DO NOT proceed past each gate without explicit approval.
- **Agent Usage**: Always use the specified agents. Do not bypass them.
- **Documentation First**: All documentation must be updated before marking complete.
- **Testing Required**: Manual testing is mandatory. Automated testing is recommended.
- **Privacy**: Ensure GDPR compliance settings are configured correctly.
- **Performance**: Monitor bundle size impact and page load times.

---

## Success Criteria

Integration is complete when:

- [ ] PostHog successfully initializes on all pages
- [ ] Page views are tracked automatically
- [ ] User identification works on authentication
- [ ] Organization context is set correctly
- [ ] Custom events can be tracked
- [ ] Reset works on logout
- [ ] All documentation is updated
- [ ] ADR is approved and finalized
- [ ] No console errors or warnings
- [ ] Performance impact is acceptable (< 50kb bundle increase)
- [ ] GDPR compliance is configured
- [ ] Session summary is created
