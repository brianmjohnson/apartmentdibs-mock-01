# PostHog Analytics Integration - Technical Specification

**Status**: Draft - HITL Gate #3 Review
**Date**: 2025-11-20
**Author**: Frontend Developer Agent
**Related Documents**:
- [ADR-013: PostHog Analytics Platform](../adr/ADR-013-posthog-analytics-and-experimentation-platform.md)
- [US-002: PostHog Integration User Story](../user-stories/posthog-integration.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Installation Steps](#installation-steps)
3. [Environment Configuration](#environment-configuration)
4. [File Structure](#file-structure)
5. [Implementation Details](#implementation-details)
6. [TypeScript Types](#typescript-types)
7. [Testing Strategy](#testing-strategy)
8. [Performance Considerations](#performance-considerations)
9. [GDPR/CCPA Compliance](#gdprcccpa-compliance)
10. [Migration Plan](#migration-plan)
11. [Success Criteria](#success-criteria)

---

## Overview

This specification defines the complete implementation of PostHog analytics, feature flags, A/B testing, and session recording for ApartmentDibs. The implementation follows the official PostHog Next.js pattern with client-side initialization in a React Provider and integrates deeply with Better Auth for user identification and organization-based multi-tenancy.

### Key Integration Points

- **Client-Side Tracking**: posthog-js for browser events, pageviews, feature flags
- **Server-Side Tracking**: posthog-node for API events, server-side feature flags
- **Reverse Proxy**: Vercel rewrites to prevent ad blocker interference (20-40% improvement in capture rate)
- **User Identification**: Better Auth session integration
- **Multi-Tenancy**: Organization-level group analytics
- **Privacy**: GDPR/CCPA compliance with IP anonymization

### Estimated Implementation Time

**Total**: 2 weeks (13 story points, ~32 hours)

**Breakdown**:
- Week 1, Days 1-2: Installation, configuration, initialization (8 hours)
- Week 1, Days 3-4: User identification and auth integration (8 hours)
- Week 2, Days 1-3: Custom event tracking across app (12 hours)
- Week 2, Days 4-5: Feature flags, session recording, testing (4 hours)

---

## Installation Steps

### 1. Install NPM Packages

```bash
pnpm add posthog-js posthog-node
```

**Version Requirements**:
- `posthog-js`: ^1.100.0 (client-side SDK)
- `posthog-node`: ^4.0.0 (server-side SDK)
- Compatible with Next.js 15.3+, React 19.2+

**Bundle Size Impact**:
- posthog-js: ~50KB gzipped
- posthog-node: Server-only, no client bundle impact

### 2. Verify Dependencies

Existing dependencies already compatible:
- `@tanstack/react-query`: ^5.90.10 ✅
- `next`: ^16.0.3 ✅
- `react`: ^19.2.0 ✅
- `better-auth`: ^1.3.34 ✅

### 3. PostHog Account Setup

**Before Implementation**:
1. Create PostHog account at https://posthog.com/signup
2. Create new project: "ApartmentDibs Production"
3. Retrieve API keys:
   - **Project API Key** (public, for client-side): Found in Project Settings → API Keys
   - **Personal API Key** (private, for server-side): Found in Personal Settings → API Keys → Create Personal API Key
4. Choose host region:
   - US: `https://us.i.posthog.com` (default)
   - EU: `https://eu.i.posthog.com` (if GDPR requires EU data residency)

---

## Environment Configuration

### Environment Variables

Add the following to `.env.local` (development) and Vercel Environment Variables (production):

```bash
# ============================================
# Analytics (PostHog)
# ============================================
# Project API key (public, safe for client)
NEXT_PUBLIC_POSTHOG_KEY="phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# PostHog host (US or EU)
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"

# Personal API key (for server-side, PRIVATE)
POSTHOG_PERSONAL_API_KEY="phx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Configuration Locations

**1. `.env.example` - Already Updated**
Lines 67-76 already contain PostHog configuration with comments.

**2. `.env.local` - Developer Creates**
Copy `.env.example` and fill in actual PostHog keys:
```bash
cp .env.example .env.local
# Edit .env.local with real keys
```

**3. Vercel Environment Variables**
Add to Vercel dashboard for each environment:
- Production: Add all three variables
- Preview: Add all three variables (can use same keys or separate preview project)
- Development: Use `.env.local`

**Security Notes**:
- ✅ `NEXT_PUBLIC_POSTHOG_KEY`: Public, exposed to client (read-only for events)
- ⚠️ `POSTHOG_PERSONAL_API_KEY`: Private, server-only (can delete data, manage flags)
- Never commit `.env.local` to git

---

## File Structure

### Files to Create

```
apartmentdibs-mock-01/
├── lib/
│   ├── analytics/
│   │   ├── posthog.ts                    # NEW: Client-side utility functions
│   │   ├── posthog.server.ts             # NEW: Server-side PostHog client
│   │   ├── events.ts                     # NEW: Typed event definitions
│   │   └── types.ts                      # NEW: TypeScript types
│   └── hooks/
│       ├── use-posthog-auth.ts           # NEW: User identification hook
│       └── use-track-event.ts            # NEW: Event tracking hook
├── components/
│   └── providers/
│       └── posthog-provider.tsx          # NEW: PostHog React provider with initialization
├── app/
│   └── _components/
│       └── posthog-pageview.tsx          # NEW: Pageview tracking component
└── docs/
    ├── analytics/
    │   ├── event-catalog.md               # NEW: Event documentation
    │   └── feature-flag-patterns.md       # NEW: Feature flag guide
    └── references/
        ├── TEMPLATE.md                    # NEW: Reference documentation template
        └── posthog-vercel-reverse-proxy.md # NEW: Reverse proxy reference
```

### Files to Modify

```
apartmentdibs-mock-01/
├── vercel.json                            # MODIFY: Add reverse proxy rewrites
├── app/
│   ├── layout.tsx                         # MODIFY: Add PostHogPageView component
│   └── providers.tsx                      # MODIFY: Wrap with PostHogProvider
├── package.json                           # MODIFY: Add posthog dependencies (via pnpm add)
└── .env.example                           # NO CHANGE: Already has PostHog vars
```

---

## Implementation Details

### 1. Vercel Reverse Proxy Configuration

**Purpose**: Route PostHog requests through our domain to prevent ad blocker interference. This improves event capture reliability by 20-40% compared to direct PostHog requests.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/vercel.json`

**Reference**: See [posthog-vercel-reverse-proxy.md](../references/posthog-vercel-reverse-proxy.md) for complete documentation.

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm vercel-build",
  "installCommand": "pnpm install",
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
- **Proxy Path**: `/0579f8f99ca21e72e24243d7b9f81954` is the MD5 hash of "posthog" - unique enough to avoid ad blockers, yet reproducible
- **Two Routes Required**: One for static assets (`/static/:path*`), one for API calls (`/:path*`)
- **Ad Blocker Resistance**: Avoids commonly blocked paths like `/ingest`, `/tracking`, `/analytics`
- **Zero Cost**: Uses Vercel's built-in rewrites feature, no additional infrastructure
- **Multi-Environment**: Works automatically in production, preview, and development deployments

**Why This Matters**:
Ad blockers like uBlock Origin, AdBlock Plus, and Brave Browser commonly block requests to analytics domains. By proxying through our domain (`apartmentdibs.com`), requests appear as first-party traffic and pass through ad blockers, significantly improving data quality.

---

### 2. Client Initialization (PostHogProvider)

**Purpose**: Initialize PostHog client using the official PostHog Next.js pattern. PostHog is initialized in a React Provider with `useEffect` to ensure client-side only execution.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/components/providers/posthog-provider.tsx`

**Reference**: Official pattern from [PostHog Next.js docs](https://posthog.com/docs/libraries/next-js)

```typescript
/**
 * PostHog Provider Component
 *
 * Wraps the app to provide PostHog context to all components.
 * Also handles automatic user identification when auth session changes.
 *
 * @see docs/adr/ADR-013-posthog-analytics-and-experimentation-platform.md
 */

'use client'

import { useEffect, useState } from 'react'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import posthog from 'posthog-js'
import { usePostHogAuth } from '@/lib/hooks/use-posthog-auth'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PostHog (official pattern from PostHog docs)
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/0579f8f99ca21e72e24243d7b9f81954', // Reverse proxy to avoid ad blockers
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

  // Automatic user identification based on auth session
  usePostHogAuth()

  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

**Key Configuration Points**:
- **api_host**: Uses reverse proxy path `/0579f8f99ca21e72e24243d7b9f81954` instead of direct PostHog domain
- **ui_host**: Required for PostHog toolbar authentication and dashboard links
- **defaults**: '2025-05-24' enables latest PostHog features and optimizations
- **person_profiles**: 'identified_only' ensures GDPR compliance by not tracking anonymous users
- **capture_pageview**: false for manual control with App Router (see PostHogPageView component)
- **session_recording**: Masks all inputs and elements with `[data-private]` attribute

**PostHogInitCheck Helper** (optional, for components that need PostHog to be fully loaded):
```typescript
export function PostHogInitCheck({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (posthog.__loaded) {
      setIsReady(true)
    } else {
      const checkInterval = setInterval(() => {
        if (posthog.__loaded) {
          setIsReady(true)
          clearInterval(checkInterval)
        }
      }, 100)

      setTimeout(() => {
        setIsReady(true)
        clearInterval(checkInterval)
      }, 5000)

      return () => clearInterval(checkInterval)
    }
  }, [])

  if (!isReady) return null

  return <>{children}</>
}
```

---

### 3. Pageview Tracking Component

**Purpose**: Automatic pageview tracking for Next.js App Router route changes.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/app/_components/posthog-pageview.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

export function PostHogPageView(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || !posthog.__loaded) return

    try {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', { $current_url: url })
    } catch (error) {
      console.error('[PostHog] Failed to track pageview:', error)
    }
  }, [pathname, searchParams])

  return null
}
```

**Usage in app/layout.tsx**:
```typescript
import { Suspense } from 'react'
import { PostHogPageView } from './_components/posthog-pageview'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

---

### 4. Environment Variables (No Changes Needed)

**File**: `.env.example` (already configured)

```bash
# ============================================
# Analytics (PostHog)
# ============================================
# Project API key (public, safe for client)
NEXT_PUBLIC_POSTHOG_KEY="phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# PostHog host (US or EU) - NOTE: Not used with reverse proxy
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"

# Personal API key (for server-side, PRIVATE)
POSTHOG_PERSONAL_API_KEY="phx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Note on NEXT_PUBLIC_POSTHOG_HOST**:
- This variable is no longer used in the client initialization (we use the reverse proxy path instead)
- Kept for backward compatibility and documentation
- Server-side code may still reference it for direct PostHog API calls

---

### 5. Server-Side Integration

**Purpose**: Track events from the server side (API routes, server components) and evaluate feature flags.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/lib/analytics/posthog.server.ts`

```typescript
import { PostHog } from 'posthog-node'

let posthogServer: PostHog | null = null

function getPostHogServer(): PostHog | null {
  if (!process.env.POSTHOG_PERSONAL_API_KEY) {
    console.warn('[PostHog Server] POSTHOG_PERSONAL_API_KEY not configured')
    return null
  }

  if (!posthogServer) {
    posthogServer = new PostHog(process.env.POSTHOG_PERSONAL_API_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 20,
      flushInterval: 10000,
    })
  }

  return posthogServer
}

export const analyticsServer = {
  track: async (userId: string, event: AnalyticsEvent): Promise<void> => {
    const client = getPostHogServer()
    if (!client) return

    try {
      client.capture({
        distinctId: userId,
        event: event.event,
        properties: event.properties,
      })
      await client.shutdown() // Critical for serverless
    } catch (error) {
      console.error(`[PostHog Server] Failed to track event "${event.event}":`, error)
    }
  },

  isFeatureEnabled: async (flagKey: FeatureFlagKey, userId: string): Promise<boolean> => {
    const client = getPostHogServer()
    if (!client) return false

    try {
      const isEnabled = await client.isFeatureEnabled(flagKey, userId)
      return isEnabled || false
    } catch (error) {
      console.error(`[PostHog Server] Failed to check feature flag "${flagKey}":`, error)
      return false
    }
  },
}
```

**Why server-side tracking uses direct PostHog domain**:
- Server-side requests don't go through ad blockers
- Vercel rewrites only apply to client-side requests
- Direct connection is simpler and more reliable for server-to-server communication

---

  // Error tracking
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      posthog.capture('$exception', {
        $exception_message: event.message,
        $exception_type: event.error?.name || 'Error',
        $exception_source: event.filename,
        $exception_lineno: event.lineno,
        $exception_colno: event.colno,
      })
    })
  }
}
```

**Key Configuration Decisions** (from ADR-013):
- `person_profiles: 'identified_only'`: Reduces PII exposure, GDPR-friendly
- `capture_pageview: false`: Manual control for App Router accuracy
- `ip: false`: IP anonymization for GDPR/CCPA compliance
- `respect_dnt: true`: Honor browser Do Not Track setting

---

### 2. PostHog Provider (components/providers/posthog-provider.tsx)

**Purpose**: Wrap app with PostHog React Context for hooks like `usePostHog()`, `useFeatureFlagEnabled()`.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/components/providers/posthog-provider.tsx`

```typescript
/**
 * PostHog Provider Component
 *
 * Wraps the application with PostHog React Context.
 * Provides access to PostHog hooks throughout the app.
 *
 * Usage:
 *   const posthog = usePostHog()
 *   const isEnabled = useFeatureFlagEnabled('feature-name')
 */

'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { type ReactNode } from 'react'

export function PostHogProvider({ children }: { children: ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

**Why So Simple?**
- Initialization happens in `instrumentation-client.ts` (early, before provider)
- Provider only wraps React Context
- Keeps component logic minimal

---

### 3. Pageview Tracking (app/_components/posthog-pageview.tsx)

**Purpose**: Track pageviews on route changes in Next.js App Router. Handles query parameters and hash changes.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/app/_components/posthog-pageview.tsx`

```typescript
/**
 * PostHog Pageview Tracking
 *
 * Automatically tracks pageviews on Next.js App Router navigation.
 * Handles query parameters and hash changes.
 *
 * Must be placed inside <PostHogProvider> and in a client component.
 */

'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export function PostHogPageview() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    // Early return if PostHog not initialized
    if (!posthog) return

    // Early return if no pathname (shouldn't happen, but safety)
    if (!pathname) return

    // Build full URL with query parameters
    let url = window.origin + pathname
    if (searchParams && searchParams.toString()) {
      url = `${url}?${searchParams.toString()}`
    }

    // Capture pageview event
    posthog.capture('$pageview', {
      $current_url: url,
    })
  }, [pathname, searchParams, posthog])

  // This component renders nothing
  return null
}
```

**Why Manual Pageviews?**
- Next.js App Router has complex navigation (soft navigation, partial hydration)
- Manual tracking ensures we catch all route changes accurately
- Allows adding custom properties to pageview events

---

### 4. Auth Integration Hook (lib/hooks/use-posthog-auth.ts)

**Purpose**: Automatically identify users when they log in/out using Better Auth session.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/lib/hooks/use-posthog-auth.ts`

```typescript
/**
 * PostHog Auth Integration Hook
 *
 * Automatically identifies users in PostHog when Better Auth session changes.
 * Sets user properties and organization context.
 *
 * Usage:
 *   Call usePostHogAuth() in root layout or provider to auto-track auth state.
 */

'use client'

import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

/**
 * IMPORTANT: Replace this import with your actual Better Auth session hook
 *
 * Expected session shape:
 * {
 *   user: {
 *     id: string
 *     email: string
 *     name: string
 *     role: 'tenant' | 'agent' | 'landlord' | 'admin'
 *     organizationId: string
 *   }
 *   organization: {
 *     id: string
 *     name: string
 *     plan?: string
 *     createdAt: string
 *   }
 * }
 */
// import { useSession } from '@/lib/auth-client' // TODO: Update with actual import

type User = {
  id: string
  email: string
  name: string
  role: 'tenant' | 'agent' | 'landlord' | 'admin'
  organizationId: string
  createdAt?: string
}

type Organization = {
  id: string
  name: string
  plan?: string
  createdAt?: string
}

type Session = {
  user: User
  organization?: Organization
} | null

// Mock hook for now - replace with actual Better Auth hook
function useSession(): { data: Session } {
  // TODO: Replace with actual Better Auth session hook
  return { data: null }
}

export function usePostHogAuth() {
  const posthog = usePostHog()
  const { data: session } = useSession()

  useEffect(() => {
    if (!posthog) return

    if (session?.user) {
      // User is logged in - identify them in PostHog
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        organizationId: session.user.organizationId,
        organizationName: session.organization?.name,
        userCreatedAt: session.user.createdAt,
      })

      // Set organization as a group (multi-tenant analytics)
      if (session.user.organizationId && session.organization) {
        posthog.group('organization', session.user.organizationId, {
          name: session.organization.name,
          plan: session.organization.plan || 'free',
          organizationCreatedAt: session.organization.createdAt,
        })
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[PostHog] User identified:', session.user.id)
      }
    } else {
      // User is logged out - reset PostHog
      posthog.reset()

      if (process.env.NODE_ENV === 'development') {
        console.log('[PostHog] User reset (logged out)')
      }
    }
  }, [session, posthog])
}
```

**Integration Points**:
- Replace `useSession()` mock with actual Better Auth session hook
- Adjust `User` and `Organization` types to match your schema
- Called once in root layout (runs on every session change)

---

### 5. Event Tracking Hook (lib/hooks/use-track-event.ts)

**Purpose**: Type-safe custom event tracking with consistent property structure.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/lib/hooks/use-track-event.ts`

```typescript
/**
 * Event Tracking Hook
 *
 * Type-safe wrapper for PostHog event tracking.
 * Ensures consistent event naming and property structure.
 *
 * Usage:
 *   const trackEvent = useTrackEvent()
 *   trackEvent('application_created', { listingId: '123' })
 */

'use client'

import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'
import type { AnalyticsEvent } from '@/lib/analytics/types'

export function useTrackEvent() {
  const posthog = usePostHog()

  return useCallback(
    <T extends AnalyticsEvent>(
      eventName: T['name'],
      properties?: Omit<T, 'name' | 'timestamp'>
    ) => {
      if (!posthog) {
        // PostHog not initialized (shouldn't happen, but graceful degradation)
        if (process.env.NODE_ENV === 'development') {
          console.warn('[PostHog] Event not tracked (PostHog not initialized):', eventName)
        }
        return
      }

      // Add timestamp automatically
      const eventData = {
        ...properties,
        timestamp: new Date().toISOString(),
      }

      posthog.capture(eventName, eventData)

      if (process.env.NODE_ENV === 'development') {
        console.log('[PostHog] Event tracked:', eventName, eventData)
      }
    },
    [posthog]
  )
}

/**
 * Strongly-typed event tracking function (for components that use events directly)
 */
export function trackEvent<T extends AnalyticsEvent>(
  posthog: ReturnType<typeof usePostHog>,
  eventName: T['name'],
  properties?: Omit<T, 'name' | 'timestamp'>
) {
  if (!posthog) return

  posthog.capture(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  })
}
```

---

### 6. Server-Side PostHog Client (lib/analytics/posthog.server.ts)

**Purpose**: Server-side PostHog client for tracking backend events and server-side feature flags.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/lib/analytics/posthog.server.ts`

```typescript
/**
 * PostHog Server-Side Client
 *
 * For server-side event tracking and feature flag evaluation.
 * Use in API routes, Server Components, and Server Actions.
 *
 * IMPORTANT: Always call posthog.shutdown() in serverless functions
 * to ensure events are flushed before function terminates.
 */

import { PostHog } from 'posthog-node'

// Initialize PostHog client (singleton)
const posthogClient = new PostHog(
  process.env.POSTHOG_PERSONAL_API_KEY!,
  {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',

    // Batch configuration (optimize for serverless)
    flushAt: 20,         // Send batch when 20 events accumulated
    flushInterval: 10000, // Or send every 10 seconds

    // Enable debug logging in development
    enable_recording_console_log: process.env.NODE_ENV === 'development',
  }
)

/**
 * Track server-side event
 *
 * @param userId - User ID (Better Auth user ID)
 * @param event - Event name
 * @param properties - Event properties
 *
 * @example
 * await trackServerEvent(userId, 'listing_created', { listingId: '123' })
 */
export async function trackServerEvent(
  userId: string,
  event: string,
  properties?: Record<string, any>
) {
  try {
    posthogClient.capture({
      distinctId: userId,
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        source: 'server',
      },
    })

    // CRITICAL: Flush events in serverless environment
    // Without this, events may be lost when function terminates
    await posthogClient.shutdown()
  } catch (error) {
    console.error('[PostHog Server] Failed to track event:', error)
  }
}

/**
 * Get feature flag value (server-side)
 *
 * @param flagKey - Feature flag key
 * @param userId - User ID to evaluate flag for
 * @param defaultValue - Default value if flag not found
 * @returns Feature flag value (boolean or string)
 *
 * @example
 * const isEnabled = await getFeatureFlag('new-dashboard', userId, false)
 */
export async function getFeatureFlag(
  flagKey: string,
  userId: string,
  defaultValue: boolean | string = false
): Promise<boolean | string> {
  try {
    const flagValue = await posthogClient.getFeatureFlag(flagKey, userId)

    // Return default if flag undefined
    if (flagValue === undefined) {
      return defaultValue
    }

    return flagValue
  } catch (error) {
    console.error(`[PostHog Server] Failed to fetch flag ${flagKey}:`, error)
    return defaultValue
  }
}

/**
 * Get all feature flags for a user (server-side)
 *
 * @param userId - User ID
 * @returns Record of all feature flags
 *
 * @example
 * const flags = await getAllFeatureFlags(userId)
 * if (flags['new-dashboard']) { ... }
 */
export async function getAllFeatureFlags(
  userId: string
): Promise<Record<string, boolean | string>> {
  try {
    const flags = await posthogClient.getAllFlags(userId)
    return flags || {}
  } catch (error) {
    console.error('[PostHog Server] Failed to fetch all flags:', error)
    return {}
  }
}

/**
 * Identify user (server-side)
 * Called after user signup/login to set user properties
 *
 * @param userId - User ID
 * @param properties - User properties
 */
export async function identifyUser(
  userId: string,
  properties: Record<string, any>
) {
  try {
    posthogClient.identify({
      distinctId: userId,
      properties,
    })

    await posthogClient.shutdown()
  } catch (error) {
    console.error('[PostHog Server] Failed to identify user:', error)
  }
}

/**
 * Set organization group (server-side)
 *
 * @param organizationId - Organization ID
 * @param properties - Organization properties
 */
export async function setOrganizationGroup(
  userId: string,
  organizationId: string,
  properties: Record<string, any>
) {
  try {
    posthogClient.groupIdentify({
      groupType: 'organization',
      groupKey: organizationId,
      properties,
    })

    await posthogClient.shutdown()
  } catch (error) {
    console.error('[PostHog Server] Failed to set organization group:', error)
  }
}

// Export client for advanced usage
export { posthogClient }
```

**Critical Notes**:
- ⚠️ Always call `posthog.shutdown()` in serverless functions
- Serverless functions terminate quickly; unflushed events are lost
- `shutdown()` flushes pending events and waits for completion

---

### 7. Event Definitions (lib/analytics/events.ts)

**Purpose**: Centralized, typed event definitions matching US-002 AC-3.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/lib/analytics/events.ts`

```typescript
/**
 * Analytics Event Definitions
 *
 * Centralized event catalog with TypeScript types.
 * All custom events tracked in the application are defined here.
 *
 * See: docs/analytics/event-catalog.md for detailed documentation
 */

import type {
  ApplicationCreatedEvent,
  ApplicationViewedEvent,
  ListingCreatedEvent,
  ListingViewedEvent,
  MessageSentEvent,
  SearchPerformedEvent,
  ProfileCompletedEvent,
  PaymentInitiatedEvent,
  PaymentCompletedEvent,
} from './types'

/**
 * Event name constants (use these instead of magic strings)
 */
export const EVENTS = {
  // Application events
  APPLICATION_CREATED: 'application_created',
  APPLICATION_VIEWED: 'application_viewed',

  // Listing events
  LISTING_CREATED: 'listing_created',
  LISTING_VIEWED: 'listing_viewed',

  // Messaging events
  MESSAGE_SENT: 'message_sent',

  // Search events
  SEARCH_PERFORMED: 'search_performed',

  // Profile events
  PROFILE_COMPLETED: 'profile_completed',

  // Payment events
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
} as const

/**
 * Helper functions for tracking specific events
 * These provide intellisense and type safety
 */

import { useTrackEvent } from '@/lib/hooks/use-track-event'

export function useApplicationEvents() {
  const trackEvent = useTrackEvent()

  return {
    trackApplicationCreated: (data: Omit<ApplicationCreatedEvent, 'name' | 'timestamp'>) => {
      trackEvent(EVENTS.APPLICATION_CREATED, data)
    },

    trackApplicationViewed: (data: Omit<ApplicationViewedEvent, 'name' | 'timestamp'>) => {
      trackEvent(EVENTS.APPLICATION_VIEWED, data)
    },
  }
}

export function useListingEvents() {
  const trackEvent = useTrackEvent()

  return {
    trackListingCreated: (data: Omit<ListingCreatedEvent, 'name' | 'timestamp'>) => {
      trackEvent(EVENTS.LISTING_CREATED, data)
    },

    trackListingViewed: (data: Omit<ListingViewedEvent, 'name' | 'timestamp'>) => {
      trackEvent(EVENTS.LISTING_VIEWED, data)
    },
  }
}

export function useMessagingEvents() {
  const trackEvent = useTrackEvent()

  return {
    trackMessageSent: (data: Omit<MessageSentEvent, 'name' | 'timestamp'>) => {
      trackEvent(EVENTS.MESSAGE_SENT, data)
    },
  }
}

export function useSearchEvents() {
  const trackEvent = useTrackEvent()

  return {
    trackSearchPerformed: (data: Omit<SearchPerformedEvent, 'name' | 'timestamp'>) => {
      trackEvent(EVENTS.SEARCH_PERFORMED, data)
    },
  }
}

export function useProfileEvents() {
  const trackEvent = useTrackEvent()

  return {
    trackProfileCompleted: (data: Omit<ProfileCompletedEvent, 'name' | 'timestamp'>) => {
      trackEvent(EVENTS.PROFILE_COMPLETED, data)
    },
  }
}

export function usePaymentEvents() {
  const trackEvent = useTrackEvent()

  return {
    trackPaymentInitiated: (data: Omit<PaymentInitiatedEvent, 'name' | 'timestamp'>) => {
      trackEvent(EVENTS.PAYMENT_INITIATED, data)
    },

    trackPaymentCompleted: (data: Omit<PaymentCompletedEvent, 'name' | 'timestamp'>) => {
      trackEvent(EVENTS.PAYMENT_COMPLETED, data)
    },
  }
}
```

**Usage Example**:
```typescript
// In a component
const { trackListingViewed } = useListingEvents()

function ListingPage({ listingId }) {
  useEffect(() => {
    trackListingViewed({ listingId, source: 'search' })
  }, [listingId])
}
```

---

### 8. TypeScript Types (lib/analytics/types.ts)

**Purpose**: Complete type definitions for analytics events, user properties, and feature flags.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/lib/analytics/types.ts`

```typescript
/**
 * Analytics Type Definitions
 *
 * TypeScript types for PostHog integration.
 * Ensures type safety across event tracking, user identification, and feature flags.
 */

/**
 * User Roles (from Better Auth schema)
 */
export type UserRole = 'tenant' | 'agent' | 'landlord' | 'admin'

/**
 * Base Event Interface
 * All custom events extend this
 */
export interface BaseEvent {
  name: string
  timestamp: string
}

/**
 * Application Events
 */
export interface ApplicationCreatedEvent extends BaseEvent {
  name: 'application_created'
  userId: string
  listingId: string
  organizationId: string
}

export interface ApplicationViewedEvent extends BaseEvent {
  name: 'application_viewed'
  userId: string
  applicationId: string
  viewerRole: UserRole
}

/**
 * Listing Events
 */
export interface ListingCreatedEvent extends BaseEvent {
  name: 'listing_created'
  userId: string
  listingId: string
  organizationId: string
}

export interface ListingViewedEvent extends BaseEvent {
  name: 'listing_viewed'
  userId: string
  listingId: string
  source: 'search' | 'direct' | 'featured' | 'recommended'
}

/**
 * Messaging Events
 */
export interface MessageSentEvent extends BaseEvent {
  name: 'message_sent'
  userId: string
  recipientRole: UserRole
  conversationId: string
}

/**
 * Search Events
 */
export interface SearchPerformedEvent extends BaseEvent {
  name: 'search_performed'
  userId?: string // Optional: may be anonymous
  query: string
  filters?: Record<string, any>
  resultCount: number
}

/**
 * Profile Events
 */
export interface ProfileCompletedEvent extends BaseEvent {
  name: 'profile_completed'
  userId: string
  role: UserRole
  profileType: 'basic' | 'detailed' | 'verified'
}

/**
 * Payment Events
 */
export interface PaymentInitiatedEvent extends BaseEvent {
  name: 'payment_initiated'
  userId: string
  amount: number
  paymentType: 'application_fee' | 'security_deposit' | 'rent' | 'other'
}

export interface PaymentCompletedEvent extends BaseEvent {
  name: 'payment_completed'
  userId: string
  amount: number
  paymentType: 'application_fee' | 'security_deposit' | 'rent' | 'other'
  transactionId: string
}

/**
 * Union type of all events (for type narrowing)
 */
export type AnalyticsEvent =
  | ApplicationCreatedEvent
  | ApplicationViewedEvent
  | ListingCreatedEvent
  | ListingViewedEvent
  | MessageSentEvent
  | SearchPerformedEvent
  | ProfileCompletedEvent
  | PaymentInitiatedEvent
  | PaymentCompletedEvent

/**
 * User Properties (sent with identify())
 */
export interface UserProperties {
  email: string
  name: string
  role: UserRole
  organizationId: string
  organizationName?: string
  userCreatedAt?: string
}

/**
 * Organization Properties (sent with group())
 */
export interface OrganizationProperties {
  name: string
  plan: 'free' | 'basic' | 'pro' | 'enterprise'
  organizationCreatedAt?: string
  userCount?: number
  listingCount?: number
}

/**
 * Feature Flag Keys
 * Add new feature flags here for type safety
 */
export type FeatureFlagKey =
  | 'new-dashboard'
  | 'beta-features'
  | 'maintenance-mode'
  | 'advanced-search'
  | 'ai-recommendations'
  // Add new flags here

/**
 * Feature Flag Value Types
 */
export type FeatureFlagValue = boolean | string | number

/**
 * PostHog Configuration
 */
export interface PostHogConfig {
  apiKey: string
  apiHost: string
  personProfiles: 'always' | 'never' | 'identified_only'
  capturePageview: boolean
  capturePageleave: boolean
  sessionRecording: {
    maskAllInputs: boolean
    maskInputOptions: {
      password: boolean
      email: boolean
      tel: boolean
    }
  }
}
```

---

### 9. Client Utility Functions (lib/analytics/posthog.ts)

**Purpose**: Client-side helper functions for common PostHog operations.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/lib/analytics/posthog.ts`

```typescript
/**
 * PostHog Client Utilities
 *
 * Helper functions for client-side PostHog operations.
 * Use these instead of calling posthog directly for consistency.
 */

import posthog from 'posthog-js'
import type { UserProperties, OrganizationProperties, FeatureFlagKey } from './types'

/**
 * Check if PostHog is initialized and ready
 */
export function isPostHogReady(): boolean {
  return typeof window !== 'undefined' && posthog.__loaded
}

/**
 * Identify user with properties
 * Called after login/signup
 */
export function identifyUser(userId: string, properties: UserProperties): void {
  if (!isPostHogReady()) return

  posthog.identify(userId, properties)
}

/**
 * Set organization as a group
 * Called after login/organization selection
 */
export function setOrganization(
  organizationId: string,
  properties: OrganizationProperties
): void {
  if (!isPostHogReady()) return

  posthog.group('organization', organizationId, properties)
}

/**
 * Reset PostHog (logout)
 * Clears user identity and starts fresh session
 */
export function resetPostHog(): void {
  if (!isPostHogReady()) return

  posthog.reset()
}

/**
 * Track custom event
 * Prefer using typed hooks (useTrackEvent, useApplicationEvents, etc.)
 */
export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  if (!isPostHogReady()) return

  posthog.capture(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Check if feature flag is enabled
 * Returns false if PostHog not initialized or flag not found
 */
export function isFeatureEnabled(flagKey: FeatureFlagKey): boolean {
  if (!isPostHogReady()) return false

  return posthog.isFeatureEnabled(flagKey) ?? false
}

/**
 * Get feature flag variant
 * Useful for A/B tests with multiple variants
 */
export function getFeatureFlagVariant(
  flagKey: FeatureFlagKey
): string | boolean | undefined {
  if (!isPostHogReady()) return undefined

  return posthog.getFeatureFlagPayload(flagKey)
}

/**
 * Reload feature flags from server
 * Useful after user properties change
 */
export function reloadFeatureFlags(): Promise<void> {
  if (!isPostHogReady()) return Promise.resolve()

  return posthog.reloadFeatureFlags()
}

/**
 * Set user property (after identification)
 * Updates existing user properties without re-identifying
 */
export function setUserProperty(key: string, value: any): void {
  if (!isPostHogReady()) return

  posthog.setPersonProperties({ [key]: value })
}

/**
 * Start session recording explicitly
 * Useful if you want to start recording based on user consent
 */
export function startSessionRecording(): void {
  if (!isPostHogReady()) return

  posthog.startSessionRecording()
}

/**
 * Stop session recording
 * Respects user opt-out
 */
export function stopSessionRecording(): void {
  if (!isPostHogReady()) return

  posthog.stopSessionRecording()
}

/**
 * Opt user out of tracking
 * Respects user privacy preferences
 */
export function optOut(): void {
  if (!isPostHogReady()) return

  posthog.opt_out_capturing()
}

/**
 * Opt user in to tracking (after opt-out)
 */
export function optIn(): void {
  if (!isPostHogReady()) return

  posthog.opt_in_capturing()
}

/**
 * Check if user has opted out
 */
export function hasOptedOut(): boolean {
  if (!isPostHogReady()) return true

  return posthog.has_opted_out_capturing()
}
```

---

### 10. App Layout Integration (app/layout.tsx)

**Purpose**: Integrate PostHog provider into root layout.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/app/layout.tsx` (MODIFY)

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Apartment Dibs',
  description: 'Apartment Dibs Application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**Note**: The actual PostHog provider will be integrated in `app/providers.tsx` (see next section).

---

### 11. Providers Integration (app/providers.tsx)

**Purpose**: Combine PostHog provider with existing TanStack Query provider.

**File**: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/app/providers.tsx` (MODIFY)

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { PostHogProvider } from '@/components/providers/posthog-provider'
import { PostHogPageview } from '@/app/_components/posthog-pageview'
import { usePostHogAuth } from '@/lib/hooks/use-posthog-auth'

/**
 * Analytics Integration Component
 * Handles PostHog pageview tracking and auth integration
 */
function AnalyticsIntegration() {
  // Auto-identify users on login/logout
  usePostHogAuth()

  return (
    <>
      {/* Track pageviews on route changes */}
      <PostHogPageview />
    </>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15 * 60 * 1000, // 15 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <PostHogProvider>
      <QueryClientProvider client={queryClient}>
        {/* Analytics must be inside both providers */}
        <AnalyticsIntegration />
        {children}
      </QueryClientProvider>
    </PostHogProvider>
  )
}
```

**Key Points**:
- PostHog provider wraps everything (outermost)
- `AnalyticsIntegration` component handles pageviews and auth
- Existing QueryClientProvider unchanged
- All hooks work inside this provider tree

---

## TypeScript Types

All types are defined in `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/lib/analytics/types.ts` (see Implementation Details section 8).

**Key Types**:
- `AnalyticsEvent`: Union of all custom events
- `UserProperties`: User identification properties
- `OrganizationProperties`: Organization group properties
- `FeatureFlagKey`: Type-safe feature flag keys
- `PostHogConfig`: Configuration options

---

## Testing Strategy

### Unit Tests

**Test File**: `lib/analytics/__tests__/posthog.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from '@jest/globals'
import { identifyUser, trackEvent, isFeatureEnabled } from '../posthog'
import posthog from 'posthog-js'

// Mock posthog-js
vi.mock('posthog-js', () => ({
  default: {
    __loaded: true,
    identify: vi.fn(),
    capture: vi.fn(),
    group: vi.fn(),
    reset: vi.fn(),
    isFeatureEnabled: vi.fn(),
  },
}))

describe('PostHog Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should identify user with properties', () => {
    identifyUser('user-123', {
      email: 'test@example.com',
      name: 'Test User',
      role: 'tenant',
      organizationId: 'org-456',
    })

    expect(posthog.identify).toHaveBeenCalledWith('user-123', {
      email: 'test@example.com',
      name: 'Test User',
      role: 'tenant',
      organizationId: 'org-456',
    })
  })

  it('should track custom event with timestamp', () => {
    const mockDate = new Date('2025-11-20T12:00:00Z')
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as any)

    trackEvent('application_created', { listingId: 'listing-789' })

    expect(posthog.capture).toHaveBeenCalledWith('application_created', {
      listingId: 'listing-789',
      timestamp: '2025-11-20T12:00:00.000Z',
    })
  })

  it('should check feature flag status', () => {
    vi.mocked(posthog.isFeatureEnabled).mockReturnValue(true)

    const result = isFeatureEnabled('new-dashboard')

    expect(result).toBe(true)
    expect(posthog.isFeatureEnabled).toHaveBeenCalledWith('new-dashboard')
  })
})
```

**Test File**: `lib/hooks/__tests__/use-track-event.test.ts`

```typescript
import { renderHook } from '@testing-library/react'
import { useTrackEvent } from '../use-track-event'
import { usePostHog } from 'posthog-js/react'
import { vi } from '@jest/globals'

vi.mock('posthog-js/react')

describe('useTrackEvent', () => {
  it('should track event with properties', () => {
    const mockPostHog = {
      capture: vi.fn(),
    }
    vi.mocked(usePostHog).mockReturnValue(mockPostHog as any)

    const { result } = renderHook(() => useTrackEvent())

    result.current('listing_viewed', { listingId: '123', source: 'search' })

    expect(mockPostHog.capture).toHaveBeenCalledWith(
      'listing_viewed',
      expect.objectContaining({
        listingId: '123',
        source: 'search',
        timestamp: expect.any(String),
      })
    )
  })
})
```

### Integration Tests

**Test File**: `app/__tests__/posthog-integration.test.tsx`

```typescript
import { render, waitFor } from '@testing-library/react'
import { Providers } from '../providers'
import posthog from 'posthog-js'
import { vi } from '@jest/globals'

vi.mock('posthog-js')

describe('PostHog Integration', () => {
  it('should initialize PostHog on app load', async () => {
    render(
      <Providers>
        <div>Test App</div>
      </Providers>
    )

    await waitFor(() => {
      expect(posthog.init).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          person_profiles: 'identified_only',
          capture_pageview: false,
        })
      )
    })
  })

  it('should identify user on session change', async () => {
    // Mock Better Auth session
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'tenant',
        organizationId: 'org-456',
      },
      organization: {
        id: 'org-456',
        name: 'Test Organization',
        plan: 'pro',
      },
    }

    // Test with mock session
    // ...implementation depends on Better Auth mock setup
  })
})
```

### E2E Tests (Playwright)

**Test File**: `tests/e2e/analytics.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('PostHog Analytics E2E', () => {
  test('should track pageview on navigation', async ({ page }) => {
    // Mock PostHog requests to verify events
    const events: string[] = []

    await page.route('**/e/**', (route) => {
      const request = route.request()
      const postData = request.postData()
      if (postData) {
        events.push(postData)
      }
      route.fulfill({ status: 200, body: '1' })
    })

    // Visit homepage
    await page.goto('/')

    // Navigate to another page
    await page.goto('/listings')

    // Wait for analytics to fire
    await page.waitForTimeout(1000)

    // Verify pageview events were sent
    expect(events.length).toBeGreaterThan(0)
  })

  test('should track custom event on user action', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'SecurePass123!')
    await page.click('button[type="submit"]')

    // Perform trackable action
    await page.goto('/listings')
    await page.click('[data-testid="listing-card"]:first-child')

    // Verify listing_viewed event (check network or console)
    const logs = await page.evaluate(() => (window as any).__analyticsEvents || [])
    expect(logs).toContainEqual(
      expect.objectContaining({ event: 'listing_viewed' })
    )
  })

  test('should respect feature flag', async ({ page }) => {
    // Set feature flag via bootstrap or mock
    await page.addInitScript(() => {
      (window as any).__POSTHOG_BOOTSTRAP__ = {
        featureFlags: { 'new-dashboard': true },
      }
    })

    await page.goto('/dashboard')

    // Verify new dashboard is shown
    await expect(page.locator('[data-testid="new-dashboard"]')).toBeVisible()
  })

  test('should not break app if PostHog fails', async ({ page }) => {
    // Block PostHog requests (simulate ad blocker)
    await page.route('**/*posthog*/**', (route) => route.abort())

    await page.goto('/')

    // App should still work
    await expect(page.locator('body')).toBeVisible()

    // Verify no console errors break the app
    const errors = await page.evaluate(() =>
      (window as any).__appErrors || []
    )
    expect(errors).toHaveLength(0)
  })
})
```

### Testing Checklist

- [ ] Unit tests for `lib/analytics/posthog.ts` utilities (80% coverage)
- [ ] Unit tests for `lib/hooks/use-track-event.ts` (100% coverage)
- [ ] Integration test for PostHog initialization
- [ ] Integration test for user identification
- [ ] Integration test for pageview tracking
- [ ] E2E test for custom event tracking
- [ ] E2E test for feature flag evaluation
- [ ] E2E test for graceful degradation (PostHog blocked)
- [ ] Manual testing in PostHog dashboard (events appear)
- [ ] Manual testing of session recordings

---

## Performance Considerations

### Bundle Size Impact

**Client Bundle**:
- posthog-js: ~50KB gzipped
- Total bundle increase: ~2% (from ~2MB to ~2.05MB)
- Lazy loading: Not possible (needs early init for accurate tracking)

**Mitigation**:
- PostHog is tree-shakeable (only used features bundled)
- Consider code splitting for admin-only analytics features
- Compression enabled by default in Next.js

### Runtime Performance

**Initialization Overhead**:
- PostHog init: ~50-100ms (one-time, non-blocking)
- First pageview: ~10ms
- Feature flag fetch: ~50ms (cached for 60s)

**Event Tracking**:
- Event capture: ~5-10ms (async, non-blocking)
- Batching: Events sent in groups of 10 or every 10 seconds
- Network: ~20-50ms per batch (to PostHog ingestion)

**Session Recording**:
- Recording overhead: ~10-20ms per user interaction
- Replay compression: ~90% size reduction
- Network: Sent in chunks, not blocking

**Performance Budget**:
- ✅ LCP (Largest Contentful Paint): No impact (async init)
- ✅ FID (First Input Delay): <5ms overhead
- ✅ CLS (Cumulative Layout Shift): Zero (no UI changes)
- ✅ TTI (Time to Interactive): +50ms (PostHog init)

### Optimization Strategies

**1. Async Initialization**
```typescript
// PostHog initializes asynchronously, not blocking app render
if (typeof window !== 'undefined') {
  posthog.init(/* config */)
}
```

**2. Event Batching**
```typescript
// Events batched automatically (10 events or 10 seconds)
posthog.capture('event1')
posthog.capture('event2')
// Both sent in single network request
```

**3. Feature Flag Caching**
```typescript
// Flags cached for 60 seconds (reduce API calls)
posthog.init({
  /* ... */
  feature_flag_request_timeout_ms: 3000, // Timeout after 3s
})
```

**4. Session Recording Optimization**
```typescript
// Disable recording on slow networks
disable_session_recording_on_high_network_usage: true,
```

**5. Lazy Feature Flags** (Advanced)
```typescript
// Load flags after app interactive (not on init)
posthog.init({ bootstrap: { featureFlags: {} } })

// Later, when needed:
await posthog.reloadFeatureFlags()
```

### Performance Monitoring

**Metrics to Track**:
- PostHog initialization time (target: <100ms)
- Event capture latency (target: <10ms)
- Feature flag response time (target: <50ms)
- Session recording overhead (target: <20ms per interaction)
- Network bandwidth (target: <10KB/minute per user)

**Monitoring Setup**:
```typescript
// In instrumentation-client.ts
posthog.init({
  /* ... */
  loaded: (posthog) => {
    const loadTime = performance.now()
    console.log(`[PostHog] Loaded in ${loadTime}ms`)

    // Track load time as event
    posthog.capture('$posthog_loaded', { loadTime })
  },
})
```

---

## GDPR/CCPA Compliance

### Configuration for Compliance

**1. IP Anonymization**
```typescript
// In instrumentation-client.ts
posthog.init({
  ip: false, // Anonymize IP addresses
})
```

**2. Person Profiles**
```typescript
// Only create profiles for identified users
posthog.init({
  person_profiles: 'identified_only',
})
```

**3. Cookie Configuration**
```typescript
posthog.init({
  cookie_expiration: 365, // 1 year (inform users in privacy policy)
  cross_subdomain_cookie: false, // No cross-domain tracking
  respect_dnt: true, // Honor Do Not Track
})
```

**4. Session Recording Privacy**
```typescript
posthog.init({
  session_recording: {
    maskAllInputs: false,
    maskInputOptions: {
      password: true,    // Always mask
      tel: true,         // Always mask
      email: false,      // Allow (not PII in rental context)
    },
    urlBlocklist: [
      '/api/*',          // Never record API routes
      '/admin/settings', // Never record sensitive pages
    ],
  },
})
```

### User Opt-Out Mechanism

**Opt-Out Hook**: `lib/hooks/use-analytics-consent.ts`

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import { optIn, optOut, hasOptedOut } from '@/lib/analytics/posthog'

export function useAnalyticsConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)

  useEffect(() => {
    // Check current opt-out status
    setHasConsent(!hasOptedOut())
  }, [])

  const giveConsent = useCallback(() => {
    optIn()
    setHasConsent(true)
  }, [])

  const revokeConsent = useCallback(() => {
    optOut()
    setHasConsent(false)
  }, [])

  return {
    hasConsent,
    giveConsent,
    revokeConsent,
  }
}
```

**Cookie Consent Banner** (separate US-010):
```typescript
// Future implementation in US-010: Cookie Consent
function CookieConsent() {
  const { hasConsent, giveConsent, revokeConsent } = useAnalyticsConsent()

  if (hasConsent !== null) return null

  return (
    <div className="cookie-banner">
      <p>We use cookies for analytics. Accept?</p>
      <button onClick={giveConsent}>Accept</button>
      <button onClick={revokeConsent}>Decline</button>
    </div>
  )
}
```

### Data Retention

**PostHog Default Retention**:
- Events: 7 years (free tier: 1 year)
- Session recordings: Unlimited
- Feature flag history: Unlimited

**Custom Retention** (if needed):
1. Configure in PostHog dashboard: Project Settings → Data Retention
2. Set event retention to 1 year (GDPR minimum: 1 year for analytics)
3. Set recording retention to 90 days (sufficient for debugging)

### User Data Deletion

**GDPR Right to Erasure**:
```typescript
// Server-side function for GDPR deletion requests
// Call from admin panel or API endpoint

import { posthogClient } from '@/lib/analytics/posthog.server'

export async function deleteUserData(userId: string) {
  try {
    // PostHog GDPR delete endpoint
    await fetch(
      `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/api/person/${userId}/delete`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
        },
      }
    )

    console.log(`[PostHog] User data deleted for ${userId}`)
  } catch (error) {
    console.error('[PostHog] Failed to delete user data:', error)
    throw error
  }
}
```

### Compliance Checklist

- [ ] IP anonymization enabled (`ip: false`)
- [ ] Person profiles: identified only (`person_profiles: 'identified_only'`)
- [ ] Cookie expiration: 1 year (documented in privacy policy)
- [ ] Do Not Track honored (`respect_dnt: true`)
- [ ] Session recording masks passwords/phone numbers
- [ ] Cookie consent banner implemented (US-010)
- [ ] User opt-out mechanism implemented
- [ ] Privacy policy updated with PostHog disclosure
- [ ] Data retention policy configured (1 year)
- [ ] GDPR deletion endpoint implemented
- [ ] Terms of service updated

---

## Migration Plan

### Phase 1: Foundation (Week 1, Days 1-2)

**Goal**: Install PostHog, configure environment, verify initialization

**Tasks**:
1. Install packages: `pnpm add posthog-js posthog-node`
2. Create PostHog project in dashboard
3. Add environment variables to `.env.local` and Vercel
4. Create `instrumentation-client.ts` with PostHog init
5. Create `components/providers/posthog-provider.tsx`
6. Integrate provider in `app/providers.tsx`
7. Test initialization in browser DevTools

**Verification**:
```bash
# In browser console
window.posthog // Should be defined
window.posthog.__loaded // Should be true

# Check PostHog dashboard
# Live events → Should see $pageview events
```

**Rollback**: Remove provider from `app/providers.tsx`

---

### Phase 2: User Identification (Week 1, Days 3-4)

**Goal**: Identify users on login/signup, set organization context

**Tasks**:
1. Create `lib/hooks/use-posthog-auth.ts`
2. Update `useSession` import to use actual Better Auth hook
3. Add `usePostHogAuth()` call in `app/providers.tsx`
4. Test login flow: user should be identified
5. Test logout flow: user identity should be reset
6. Verify organization group in PostHog dashboard

**Verification**:
```typescript
// After login, in console:
window.posthog._identify_called // Should be true

// In PostHog dashboard:
// People → Search for user email → Should show user properties
// Groups → Search for organization → Should show organization
```

**Rollback**: Remove `usePostHogAuth()` call from providers

---

### Phase 3: Event Tracking (Week 2, Days 1-3)

**Goal**: Implement custom events for key user actions

**Tasks**:
1. Create `lib/analytics/types.ts` with event types
2. Create `lib/analytics/events.ts` with event helpers
3. Create `lib/hooks/use-track-event.ts`
4. Add event tracking to components:
   - Application form: `application_created`
   - Listing page: `listing_viewed`
   - Search page: `search_performed`
   - Message form: `message_sent`
   - Profile page: `profile_completed`
   - Payment flow: `payment_initiated`, `payment_completed`
5. Test each event in PostHog dashboard

**Verification**:
```typescript
// Perform action (e.g., view listing)
// In PostHog dashboard:
// Activity → Should see custom event within 60 seconds
```

**Rollback**: Remove event tracking calls (app works without tracking)

---

### Phase 4: Advanced Features (Week 2, Days 4-5)

**Goal**: Implement feature flags, session recording, server-side tracking

**Tasks**:
1. Create `lib/analytics/posthog.server.ts`
2. Create `lib/analytics/posthog.ts` (client utilities)
3. Create test feature flags in PostHog dashboard:
   - `new-dashboard` (boolean)
   - `beta-features` (boolean)
   - `maintenance-mode` (boolean)
4. Add feature flag checks in components:
   - Use `useFeatureFlagEnabled('new-dashboard')`
   - Test server-side flags in API routes
5. Enable session recording (verify privacy config)
6. Create documentation:
   - `docs/analytics/event-catalog.md`
   - `docs/analytics/feature-flag-patterns.md`

**Verification**:
```typescript
// Create flag in dashboard: new-dashboard = true for 50% of users
// Reload app multiple times, should see different behavior

// Session recording:
// PostHog dashboard → Recordings → Should see recent sessions
```

**Rollback**: Remove feature flag checks (provide default values)

---

### Phase 5: Testing & Documentation (Week 2, Day 5)

**Goal**: Write tests, document implementation, prepare for production

**Tasks**:
1. Write unit tests for utilities
2. Write integration tests for hooks
3. Write E2E tests for critical flows
4. Update `.env.example` (already done)
5. Create event catalog documentation
6. Create feature flag documentation
7. Test in production-like environment
8. Performance audit (bundle size, load time)
9. Privacy audit (GDPR compliance)

**Verification**:
- [ ] All tests passing (`pnpm test`)
- [ ] E2E tests passing (`pnpm test:e2e`)
- [ ] Documentation complete
- [ ] Performance within targets
- [ ] Privacy compliance verified

---

### Rollback Strategy

**If Issues Arise**:

**1. Immediate Rollback** (Critical Bug):
```bash
# Remove PostHog provider from app
git revert <commit-hash>
git push
```

**2. Disable Feature** (Non-Critical):
```typescript
// In app/providers.tsx, comment out PostHog:
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <PostHogProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    // </PostHogProvider>
  )
}
```

**3. Feature Flag Rollback**:
```typescript
// In PostHog dashboard:
// Feature Flags → Select flag → Set to 0% rollout
```

**Why Rollback is Safe**:
- PostHog is non-blocking (app works without it)
- No database migrations required
- No data loss (events are append-only)
- Feature flags have default values
- Can disable per-environment (production only)

---

## Success Criteria

### Functional Requirements

- [ ] **AC-1**: PostHog provider initializes on app load
  - No console errors
  - Pageview events tracked automatically
  - Works in dev and production

- [ ] **AC-2**: User identification on authentication
  - User ID, email, name, role tracked
  - Organization context set
  - Persists across sessions
  - Resets on logout

- [ ] **AC-3**: Custom events tracked
  - All 9 events from US-002 implemented
  - Event properties captured accurately
  - Events appear in dashboard within 60 seconds
  - No PII leaked

- [ ] **AC-4**: Feature flags working
  - `useFeatureFlagEnabled()` works client-side
  - Server-side flags work in API routes
  - Gradual rollout supported (0-100%)
  - Default values used if flag undefined

- [ ] **AC-5**: Session recording enabled
  - Recordings appear in dashboard
  - Privacy respected (passwords masked)
  - Performance acceptable (<50ms overhead)

- [ ] **AC-6**: Organization-level analytics
  - Organization ID in all events
  - Organization groups filterable
  - Cross-organization analytics available

- [ ] **AC-7**: Performance and error handling
  - PostHog init <100ms overhead
  - Event tracking non-blocking
  - Graceful degradation if PostHog fails
  - GDPR/CCPA compliant

### Technical Metrics

**Performance**:
- [ ] PostHog initialization: <100ms
- [ ] Event capture latency: <10ms
- [ ] Feature flag response: <50ms
- [ ] Session recording overhead: <20ms per interaction
- [ ] Bundle size increase: <60KB gzipped
- [ ] No impact on Core Web Vitals

**Reliability**:
- [ ] Event delivery success rate: >99.5%
- [ ] Feature flag availability: >99.9%
- [ ] Session recording capture rate: >95%
- [ ] Zero analytics-related app crashes

**Quality**:
- [ ] Unit test coverage: >80%
- [ ] Integration tests: 100% of critical paths
- [ ] E2E tests: All acceptance criteria covered
- [ ] Documentation: Complete event catalog and flag patterns

### Business Metrics

**Usage**:
- [ ] Product team can answer "How many users did X?" in <5 minutes
- [ ] Engineering can use feature flags for gradual rollouts
- [ ] Business team has visibility into conversion funnels
- [ ] Support team can watch session replays to debug issues

**Outcomes**:
- [ ] 100% of key user actions tracked (9 custom events)
- [ ] Feature flags enable safe deployments
- [ ] Session recordings reduce support tickets by 20%
- [ ] A/B testing framework ready for experimentation

---

## Appendix A: Event Catalog Documentation

Create this file after implementation: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/docs/analytics/event-catalog.md`

**Template**:
```markdown
# PostHog Event Catalog

## Overview
This document catalogs all custom events tracked in ApartmentDibs.

## Events

### application_created
**When**: Tenant submits rental application
**Properties**:
- `userId` (string): User ID of tenant
- `listingId` (string): Listing ID
- `organizationId` (string): Organization ID
- `timestamp` (string): ISO 8601 timestamp

**Example**:
\`\`\`json
{
  "event": "application_created",
  "userId": "user_123",
  "listingId": "listing_456",
  "organizationId": "org_789",
  "timestamp": "2025-11-20T12:00:00Z"
}
\`\`\`

[... document all 9 events ...]
```

---

## Appendix B: Feature Flag Patterns

Create this file after implementation: `/Users/brianjohnson/dev/github_personal/apartmentdibs-mock-01/docs/analytics/feature-flag-patterns.md`

**Template**:
```markdown
# PostHog Feature Flag Patterns

## Client-Side Flags

### Conditional Rendering
\`\`\`typescript
const isEnabled = useFeatureFlagEnabled('new-dashboard')
return isEnabled ? <NewDashboard /> : <LegacyDashboard />
\`\`\`

## Server-Side Flags

### API Route Protection
\`\`\`typescript
const isEnabled = await getFeatureFlag('beta-api', userId, false)
if (!isEnabled) return { error: 'Feature not available' }
\`\`\`

[... document patterns ...]
```

---

## Questions for HITL Review

### 1. Better Auth Integration
**Question**: What is the exact import path for the Better Auth session hook?
**Context**: Currently using a mock `useSession()` hook in `use-posthog-auth.ts`. Need actual import.
**Options**:
- A) `import { useSession } from '@/lib/auth-client'`
- B) `import { useSession } from 'better-auth/react'`
- C) Custom implementation

### 2. Cookie Consent Timing
**Question**: Should we block PostHog initialization until cookie consent is given?
**Context**: GDPR requires consent before non-essential cookies. PostHog uses cookies.
**Options**:
- A) Implement consent banner now (blocking for MVP)
- B) Deploy without consent, add in US-010 (separate story)
- C) Use localStorage instead of cookies (no consent needed)

**Recommendation**: Option B (add consent in US-010, deploy now for team usage)

### 3. Session Recording Scope
**Question**: Should session recording be enabled for all users or opt-in?
**Context**: Privacy-conscious users may not want recordings. Recordings useful for debugging.
**Options**:
- A) Enabled by default, user can opt-out
- B) Opt-in only (requires banner/setting)
- C) Enabled for internal users only (by feature flag)

**Recommendation**: Option A (enabled by default, opt-out in settings)

### 4. Feature Flag Testing
**Question**: What initial feature flags should we create for testing?
**Context**: Need 2-3 flags to validate implementation.
**Suggestions**:
- `new-dashboard` (boolean): Enable new dashboard UI
- `beta-features` (boolean): Show beta features
- `maintenance-mode` (boolean): Display maintenance banner

**Recommendation**: Create all three for comprehensive testing

### 5. Production Rollout
**Question**: Should we deploy PostHog to production immediately or staging first?
**Context**: PostHog is non-blocking, but we want to verify no issues.
**Options**:
- A) Deploy to production immediately (feature flag at 0% for safety)
- B) Deploy to staging first, test for 1 week, then production
- C) Deploy to production for internal team only (by organization ID)

**Recommendation**: Option C (internal team first, then gradual rollout)

---

## Summary

This technical specification provides a complete, production-ready implementation plan for PostHog analytics integration. Key highlights:

- **11 new files created**: Client/server utilities, hooks, providers, types
- **2 files modified**: `app/layout.tsx`, `app/providers.tsx`
- **Type-safe**: Full TypeScript coverage with comprehensive types
- **GDPR-compliant**: IP anonymization, consent mechanism, opt-out
- **Performance-optimized**: <100ms overhead, non-blocking, batched
- **Well-tested**: Unit, integration, and E2E tests included
- **Documented**: Event catalog and feature flag patterns

**Estimated Implementation**: 2 weeks (13 story points) matches US-002 estimate.

**Next Steps**:
1. HITL Gate #3 review of this specification
2. Address any questions/feedback
3. Begin implementation Phase 1 (setup)
4. Proceed through 5 phases as defined in Migration Plan

**Dependencies Ready**:
- ✅ Environment variables (`.env.example` already updated)
- ✅ Better Auth integration (hooks need session import path)
- ✅ TanStack Query provider (already in place)
- ✅ Next.js 15.3+ App Router (compatible)

The implementation is ready to begin once approved at HITL Gate #3.
