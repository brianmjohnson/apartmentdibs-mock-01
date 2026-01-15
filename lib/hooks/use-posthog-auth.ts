/**
 * PostHog Authentication Integration Hook
 *
 * Automatically identifies users in PostHog when they log in
 * and resets PostHog on logout.
 *
 * Depends on Better Auth integration (US-001).
 *
 * @see docs/adr/ADR-013-posthog-analytics-and-experimentation-platform.md
 * @see docs/user-stories/posthog-integration.md (Dependency: US-001)
 */

'use client'

import { useEffect } from 'react'
import { analytics } from '@/lib/analytics/posthog'

// TODO: Import Better Auth session hook once US-001 (User Authentication) is implemented
// import { useSession } from '@/lib/auth/client' // or wherever Better Auth session hook is located

/**
 * PostHog Auth Integration Hook
 *
 * Handles automatic user identification and organization context setting
 * based on the current authentication session.
 *
 * Usage: Called automatically by PostHogProvider
 *
 * @example
 * // Manual usage if needed
 * function MyComponent() {
 *   usePostHogAuth()
 *   // ...
 * }
 */
export function usePostHogAuth() {
  // TODO: Replace this with actual Better Auth session hook
  // import { useSession } from '@/lib/auth/client'
  // const { data: session, status } = useSession()

  // Temporary: Do nothing until Better Auth is implemented (US-001)
  // This hook will automatically work once Better Auth session hook is available

  useEffect(() => {
    // Placeholder - no-op until Better Auth is integrated
    // Once Better Auth is ready, uncomment the implementation below:
    /*
    // Skip if not ready
    if (status === 'loading') return

    // User logged in - identify in PostHog
    if (session?.user) {
      const user = session.user

      // Identify user
      analytics.identify(user.id, {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        ...(user.organizationId && { organizationId: user.organizationId }),
      })

      // Set organization context if available
      if (session.organization) {
        analytics.setOrganization(session.organization.id, {
          id: session.organization.id,
          name: session.organization.name,
          plan: session.organization.plan,
          createdAt: session.organization.createdAt,
        })
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[PostHog] User identified:', user.id)
        if (session.organization) {
          console.log('[PostHog] Organization set:', session.organization.id)
        }
      }
    }

    // User logged out - reset PostHog
    if (status === 'unauthenticated' && !session) {
      analytics.reset()

      if (process.env.NODE_ENV === 'development') {
        console.log('[PostHog] User identity reset')
      }
    }
    */
  }, [])
}

/**
 * IMPLEMENTATION NOTES:
 *
 * When Better Auth is implemented (US-001), update this file:
 *
 * 1. Import the Better Auth session hook:
 *    import { useSession } from '@/lib/auth/client'
 *
 * 2. Replace the placeholder session with actual hook:
 *    const { data: session, status } = useSession()
 *
 * 3. Ensure the session object shape matches:
 *    {
 *      user: {
 *        id: string
 *        email: string
 *        name?: string
 *        role?: string
 *        createdAt: Date | string
 *        organizationId?: string
 *      },
 *      organization?: {
 *        id: string
 *        name: string
 *        plan?: string
 *        createdAt?: Date | string
 *      }
 *    }
 *
 * 4. Test the integration:
 *    - Login should identify user in PostHog
 *    - Organization switch should update group
 *    - Logout should reset PostHog
 *    - Check PostHog dashboard for events
 */
