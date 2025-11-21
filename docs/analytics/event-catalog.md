# PostHog Event Catalog

**Purpose**: Centralized documentation of all custom analytics events tracked in ApartmentDibs.

**Last Updated**: 2025-11-20

---

## Overview

This document catalogs all custom events tracked in PostHog, including their properties, usage, and business purpose.

**Related Documents**:
- [PostHog Setup Guide](./posthog-setup-guide.md) - One-time account configuration (HITL task)
- [User Story: PostHog Integration](../user-stories/posthog-integration.md)
- [ADR-013: PostHog Analytics Platform](../adr/ADR-013-posthog-analytics-and-experimentation-platform.md)
- [Technical Spec: PostHog Integration](../technical-specs/posthog-integration-spec.md)
- [PostHog Vercel Reverse Proxy Reference](../references/posthog-vercel-reverse-proxy.md)

### Event Capture Reliability

All events are captured through a Vercel reverse proxy to ensure maximum reliability:

- **Reverse Proxy Path**: `/0579f8f99ca21e72e24243d7b9f81954` (MD5 hash of "posthog")
- **Ad Blocker Bypass**: Events appear as first-party requests, avoiding common blockers
- **Reliability Improvement**: 20-40% increase in capture rate compared to direct PostHog requests
- **Configuration**: See [vercel.json](../../vercel.json) and [ADR-013](../adr/ADR-013-posthog-analytics-and-experimentation-platform.md#1a-vercel-reverse-proxy-configuration)

This ensures that the metrics in this catalog accurately represent user behavior without significant data loss from ad blockers.

---

## Event Naming Convention

All custom events follow the pattern: `<noun>_<past_tense_verb>`

**Examples**:
- `application_created` (not `create_application`)
- `listing_viewed` (not `view_listing`)
- `message_sent` (not `send_message`)

**Rationale**: Past tense indicates something has happened, making analytics more readable.

---

## Core Events

### 1. Application Events

#### `application_created`

**Purpose**: Track when a tenant submits a rental application

**Properties**:
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `application_id` | string | ✅ | Unique application identifier |
| `listing_id` | string | ✅ | Listing being applied to |
| `user_id` | string | ✅ | Tenant submitting application |
| `organization_id` | string | ❌ | Organization context (if applicable) |

**Usage Example**:
```typescript
import { Events } from '@/lib/analytics/events'
import { useTrackEvent } from '@/lib/hooks/use-track-event'

const track = useTrackEvent()

track(Events.Application.created({
  application_id: application.id,
  listing_id: listing.id,
  user_id: user.id,
  organization_id: organization?.id
}))
```

**Business Value**: Measure application submission rate, identify high-performing listings

---

#### `application_viewed`

**Purpose**: Track when a landlord/agent views a submitted application

**Properties**:
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `application_id` | string | ✅ | Application identifier |
| `user_id` | string | ✅ | Viewer (landlord/agent) ID |
| `viewer_role` | string | ✅ | Role: 'landlord', 'agent', 'admin' |

**Usage Example**:
```typescript
track(Events.Application.viewed({
  application_id: application.id,
  user_id: user.id,
  viewer_role: user.role
}))
```

**Business Value**: Measure landlord engagement, time-to-review metrics

---

### 2. Listing Events

#### `listing_created`

**Purpose**: Track when a landlord creates a new property listing

**Properties**:
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `listing_id` | string | ✅ | Listing identifier |
| `user_id` | string | ✅ | Landlord/agent creating listing |
| `organization_id` | string | ❌ | Organization context |
| `property_type` | string | ❌ | 'apartment', 'house', 'condo', etc. |

**Usage Example**:
```typescript
track(Events.Listing.created({
  listing_id: listing.id,
  user_id: user.id,
  organization_id: organization?.id,
  property_type: listing.propertyType
}))
```

**Business Value**: Track supply growth, identify active landlords

---

#### `listing_viewed`

**Purpose**: Track when a user views a listing detail page

**Properties**:
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `listing_id` | string | ✅ | Listing identifier |
| `user_id` | string | ❌ | Viewer ID (if authenticated) |
| `source` | string | ❌ | Referrer: 'search', 'map', 'email', etc. |

**Usage Example**:
```typescript
track(Events.Listing.viewed({
  listing_id: listing.id,
  user_id: user?.id,
  source: 'search-results'
}))
```

**Business Value**: Measure listing popularity, optimize search results

---

### 3. Message Events

#### `message_sent`

**Purpose**: Track when a user sends a message (tenant to landlord, etc.)

**Properties**:
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `message_id` | string | ✅ | Message identifier |
| `sender_id` | string | ✅ | User sending message |
| `recipient_id` | string | ✅ | User receiving message |
| `conversation_id` | string | ❌ | Conversation/thread identifier |

**Usage Example**:
```typescript
track(Events.Message.sent({
  message_id: message.id,
  sender_id: user.id,
  recipient_id: recipient.id,
  conversation_id: conversation?.id
}))
```

**Business Value**: Measure engagement, response rates, communication patterns

---

### 4. Search Events

#### `search_performed`

**Purpose**: Track when a user searches for listings

**Properties**:
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `query` | string | ✅ | Search query text |
| `filters` | object | ❌ | Applied filters (price, beds, etc.) |
| `results_count` | number | ✅ | Number of results returned |
| `user_id` | string | ❌ | User performing search |

**Usage Example**:
```typescript
track(Events.Search.performed({
  query: 'Brooklyn 2BR',
  filters: { minPrice: 2000, maxPrice: 3000, beds: 2 },
  results_count: 42,
  user_id: user?.id
}))
```

**Business Value**: Understand search behavior, optimize search algorithm

---

### 5. Profile Events

#### `profile_completed`

**Purpose**: Track when a user completes their profile

**Properties**:
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `user_id` | string | ✅ | User identifier |
| `profile_type` | string | ✅ | 'tenant', 'landlord', 'agent' |
| `completion_percentage` | number | ✅ | Profile completion (0-100) |

**Usage Example**:
```typescript
track(Events.Profile.completed({
  user_id: user.id,
  profile_type: user.role,
  completion_percentage: 100
}))
```

**Business Value**: Measure onboarding completion, identify drop-off points

---

### 6. Payment Events

#### `payment_initiated`

**Purpose**: Track when a user initiates a payment (application fee, deposit, etc.)

**Properties**:
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `payment_id` | string | ✅ | Payment identifier |
| `amount` | number | ✅ | Payment amount (cents) |
| `currency` | string | ✅ | Currency code (USD, EUR, etc.) |
| `user_id` | string | ✅ | User making payment |
| `payment_method` | string | ❌ | 'card', 'ach', 'wire', etc. |

**Usage Example**:
```typescript
track(Events.Payment.initiated({
  payment_id: payment.id,
  amount: 5000, // $50.00 in cents
  currency: 'USD',
  user_id: user.id,
  payment_method: 'card'
}))
```

**Business Value**: Track revenue funnel, identify payment friction

---

#### `payment_completed`

**Purpose**: Track when a payment successfully completes

**Properties**:
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `payment_id` | string | ✅ | Payment identifier |
| `amount` | number | ✅ | Payment amount (cents) |
| `currency` | string | ✅ | Currency code |
| `user_id` | string | ✅ | User who paid |
| `status` | string | ✅ | 'success' or 'failed' |

**Usage Example**:
```typescript
track(Events.Payment.completed({
  payment_id: payment.id,
  amount: 5000,
  currency: 'USD',
  user_id: user.id,
  status: 'success'
}))
```

**Business Value**: Measure payment success rate, revenue metrics

---

## Automatic Events

PostHog automatically tracks these events:

- `$pageview` - Page views (tracked by PostHogPageView component)
- `$pageleave` - Page exits
- `$autocapture` - Element clicks (if enabled)
- `$feature_flag_called` - Feature flag evaluations
- `$identify` - User identification

---

## Event Volume Estimates

Based on US-002 user story projections:

| Event | Monthly Volume | Free Tier Limit | Notes |
|-------|----------------|-----------------|-------|
| `listing_viewed` | ~50,000 | 1M events/month | High volume |
| `search_performed` | ~30,000 | 1M events/month | High volume |
| `application_created` | ~5,000 | 1M events/month | Medium |
| `message_sent` | ~10,000 | 1M events/month | Medium |
| `payment_completed` | ~2,000 | 1M events/month | Low |
| **TOTAL** | **~100,000** | **1M events/month** | ✅ Within free tier |

---

## Adding New Events

### Process

1. **Define the event** in `lib/analytics/types.ts`:
   ```typescript
   export interface NewEventEvent {
     event: 'new_event_name'
     properties: {
       required_property: string
       optional_property?: number
     }
   }
   ```

2. **Add to union type** in `lib/analytics/types.ts`:
   ```typescript
   export type AnalyticsEvent = ... | NewEventEvent
   ```

3. **Create event builder** in `lib/analytics/events.ts`:
   ```typescript
   export const NewEvents = {
     triggered: (properties): NewEventEvent => ({
       event: 'new_event_name',
       properties
     })
   }
   ```

4. **Document in this file** with purpose, properties, usage, business value

5. **Test the event** in PostHog dashboard

---

## Best Practices

### Event Naming
- Use past tense verbs (`created`, `viewed`, `sent`)
- Be specific but concise (`application_created` not `new_application`)
- Avoid generic names (`click`, `view`)

### Properties
- Always include IDs (user_id, listing_id, etc.)
- Use snake_case for property names
- Include timestamps only if different from event time
- Keep property values simple (strings, numbers, booleans)

### Tracking Calls
- Use event builders from `lib/analytics/events.ts`
- Track events close to the action (not in useEffect)
- Handle errors gracefully (use `useSafeTrackEvent` if needed)
- Don't block UI on tracking calls

---

## Troubleshooting

### Event not appearing in PostHog?

1. Check PostHog API key is set correctly
2. Verify event name matches exactly (case-sensitive)
3. Check browser console for errors
4. PostHog has ~5 minute delay for event processing

### Event volume too high?

1. Review PostHog billing dashboard
2. Consider sampling high-volume events
3. Use PostHog's event filtering
4. Self-host PostHog if needed

---

## Resources

- [PostHog Event Tracking Docs](https://posthog.com/docs/product-analytics/capture-events)
- [PostHog Dashboard](https://app.posthog.com)
- [Internal: PostHog Integration Spec](../technical-specs/posthog-integration-spec.md)
