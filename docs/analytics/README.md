# PostHog Analytics Documentation

**Purpose**: Central hub for all PostHog analytics and experimentation documentation

**Last Updated**: 2025-11-20

---

## Overview

ApartmentDibs uses [PostHog](https://posthog.com) as our all-in-one analytics and experimentation platform. This directory contains all documentation related to analytics implementation, configuration, and usage.

**Key Features**:
- Product analytics and event tracking
- Feature flags and A/B testing
- Session recording and heatmaps
- Web Vitals and performance monitoring
- Exception autocapture and error tracking

---

## Documentation Index

### 🚀 Getting Started

1. **[PostHog Setup Guide](./posthog-setup-guide.md)** - **START HERE**
   - One-time PostHog account configuration (HITL task)
   - Project creation, team invitations, authorized URLs
   - Session recording, autocapture, and feature flag settings
   - Monthly maintenance tasks (SCRAPE AND LEARN cycle)

### 📊 Event Tracking

2. **[Event Catalog](./event-catalog.md)**
   - All 9 custom events tracked in the application
   - Event properties, usage examples, business value
   - Event naming conventions
   - Reverse proxy reliability notes

### 🎛️ Feature Flags & Experimentation

3. **[Feature Flag Patterns](./feature-flag-patterns.md)**
   - Best practices for feature flags and A/B testing
   - Boolean flags, multivariate flags, percentage rollouts
   - Gradual rollout strategies
   - Server-side and client-side flag evaluation
   - Feature flag lifecycle management

---

## Related Documentation

### Architecture & Design

- **[ADR-013: PostHog Analytics Platform](../adr/ADR-013-posthog-analytics-and-experimentation-platform.md)**
  - Architecture decision record for choosing PostHog
  - Evaluated alternatives (Google Analytics, Mixpanel, Amplitude)
  - Implementation approach and rationale
  - GDPR/CCPA compliance details

### Implementation

- **[User Story: PostHog Integration (US-002)](../user-stories/posthog-integration.md)**
  - Complete user story with acceptance criteria
  - RICE score: 1,500 (High priority)
  - Dependencies and implementation timeline

- **[Technical Specification](../technical-specs/posthog-integration-spec.md)**
  - Complete implementation specification
  - 13 files created, 4 files modified
  - TypeScript types, React hooks, utilities
  - Server-side and client-side integration

- **[PostHog Vercel Reverse Proxy Reference](../references/posthog-vercel-reverse-proxy.md)**
  - Reverse proxy configuration for ad blocker bypass
  - 20-40% improvement in event capture reliability
  - Troubleshooting guide

### Quality Assurance

- **[QA Report: PostHog Integration](../qa-reports/posthog-integration-qa-report.md)**
  - All 8 acceptance criteria verified
  - Status: ✅ READY FOR PRODUCTION
  - TypeScript validation passed
  - Deployment verification checklist

---

## Quick Reference

### Implementation Files

**Client-Side**:
- [components/providers/posthog-provider.tsx](../../components/providers/posthog-provider.tsx) - PostHog initialization
- [app/_components/posthog-pageview.tsx](../../app/_components/posthog-pageview.tsx) - Pageview tracking
- [lib/analytics/posthog.ts](../../lib/analytics/posthog.ts) - Client utilities
- [lib/analytics/types.ts](../../lib/analytics/types.ts) - TypeScript types
- [lib/analytics/events.ts](../../lib/analytics/events.ts) - Event builders

**Server-Side**:
- [lib/analytics/posthog.server.ts](../../lib/analytics/posthog.server.ts) - Server utilities

**React Hooks**:
- [lib/hooks/use-posthog-auth.ts](../../lib/hooks/use-posthog-auth.ts) - User identification
- [lib/hooks/use-track-event.ts](../../lib/hooks/use-track-event.ts) - Event tracking

**Configuration**:
- [vercel.json](../../vercel.json) - Reverse proxy configuration
- [.env.example](../../.env.example) - Environment variables

### Key Concepts

**Reverse Proxy Path**: `/0579f8f99ca21e72e24243d7b9f81954`
- MD5 hash of "posthog"
- Bypasses ad blockers (20-40% reliability improvement)
- Configured in [vercel.json](../../vercel.json)

**Environment Variables**:
```bash
NEXT_PUBLIC_POSTHOG_KEY="phc_..."          # Project API key (public)
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"  # Host (not used with proxy)
POSTHOG_PERSONAL_API_KEY="phx_..."        # Personal API key (server-side, private)
POSTHOG_MCP_API_KEY="..."                 # MCP server API key (optional)
```

**Privacy Settings**:
- `person_profiles: 'identified_only'` - GDPR-friendly
- `maskAllInputs: true` - Session recording privacy
- `respect_dnt: true` - Respect Do Not Track
- IP anonymization enabled

### Common Tasks

**Track a Custom Event**:
```typescript
import { useTrackEvent } from '@/lib/hooks/use-track-event'
import { Events } from '@/lib/analytics/events'

const track = useTrackEvent()
track(Events.Application.created({ application_id: '123', listing_id: '456', user_id: 'user_789' }))
```

**Check a Feature Flag**:
```typescript
import { useFeatureFlagEnabled } from 'posthog-js/react'

const showNewDashboard = useFeatureFlagEnabled('new-dashboard')
return showNewDashboard ? <NewDashboard /> : <OldDashboard />
```

**Server-Side Tracking**:
```typescript
import { analyticsServer } from '@/lib/analytics/posthog.server'
import { Events } from '@/lib/analytics/events'

await analyticsServer.track('user_123', Events.Payment.completed({ amount: 99.99, currency: 'USD' }))
```

---

## Support & Resources

### Internal Support
- **Setup Questions**: See [PostHog Setup Guide](./posthog-setup-guide.md)
- **Implementation Questions**: See [Technical Spec](../technical-specs/posthog-integration-spec.md)
- **Troubleshooting**: See [PostHog Vercel Reverse Proxy Reference](../references/posthog-vercel-reverse-proxy.md#troubleshooting)

### External Resources
- [PostHog Official Docs](https://posthog.com/docs)
- [PostHog Next.js Integration](https://posthog.com/docs/libraries/next-js)
- [PostHog Community](https://posthog.com/questions)
- [PostHog Slack](https://posthog.com/slack)
- [PostHog Status Page](https://status.posthog.com/)

---

## Monthly Maintenance

**SCRAPE AND LEARN CYCLE**: Review these items monthly

### Session Recording Review (30-day cycle)
- Review recordings with JavaScript errors
- Identify UX pain points (dead clicks, rage clicks)
- Document findings in `docs/ux-research/`
- Create GitHub issues for discovered bugs

### Feature Flag Audit
- List all active feature flags
- Identify flags at 100% rollout for >30 days
- Remove flag code and delete flag (feature is permanent)
- Document flag retirement in changelog

### Exception Autocapture Review (Weekly)
- Review new exceptions from past week
- Create GitHub issues for critical errors
- Track exception trends (increasing/decreasing)

**See**: [PostHog Setup Guide - Monthly Maintenance](./posthog-setup-guide.md#monthly-maintenance-tasks) for detailed instructions

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-11-20 | Initial analytics documentation hub created | Claude |

---

## Notes

**HITL Required**:
- [PostHog Setup Guide](./posthog-setup-guide.md) must be completed by a human administrator before deployment
- MCP API key creation requires manual setup in PostHog dashboard
- Team member invitations and authorized URLs require human configuration

**Integration Status**:
- ✅ PostHog integration: Complete and production-ready
- ⚠️ Better Auth integration (US-001): Pending - user identification will activate automatically when Better Auth is implemented
- 🔲 Data warehouse integration (ADR-006): Future enhancement - pipeline destinations to explore

**Cost Monitoring**:
- PostHog free tier: 1M events/month, 5K recordings/month
- Current usage: Monitor at Settings → Billing → Usage
- Set billing alerts at 80% of free tier limits
