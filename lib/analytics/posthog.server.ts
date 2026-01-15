/**
 * PostHog Server Utilities
 *
 * Server-side analytics using posthog-node.
 * Use for tracking events in API routes, server components, and serverless functions.
 *
 * @see https://posthog.com/docs/libraries/node
 * @see docs/adr/ADR-013-posthog-analytics-and-experimentation-platform.md
 */

import { PostHog } from 'posthog-node'
import type { AnalyticsEvent, FeatureFlagKey } from './types'

/**
 * Server-side PostHog client
 *
 * Singleton instance for server-side event tracking and feature flags.
 */
let posthogServer: PostHog | null = null

/**
 * Get PostHog server client instance
 *
 * Creates a new instance if one doesn't exist.
 * Configured for serverless environments (Vercel Edge Functions).
 */
function getPostHogServer(): PostHog | null {
  if (posthogServer) {
    return posthogServer
  }

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  if (!posthogKey) {
    console.warn('[PostHog Server] NEXT_PUBLIC_POSTHOG_KEY not found')
    return null
  }

  posthogServer = new PostHog(posthogKey, {
    host: posthogHost,

    // Serverless optimization: flush events immediately
    flushAt: 1,
    flushInterval: 0,
  })

  return posthogServer
}

/**
 * Server-side analytics client
 */
export const analyticsServer = {
  /**
   * Track a server-side event
   *
   * @param userId - User identifier (or distinctId)
   * @param event - Analytics event object
   *
   * @example
   * import { Events } from '@/lib/analytics/events'
   *
   * await analyticsServer.track(
   *   user.id,
   *   Events.Payment.completed({
   *     payment_id: payment.id,
   *     amount: payment.amount,
   *     currency: 'USD',
   *     user_id: user.id,
   *     status: 'success'
   *   })
   * )
   */
  track: async (userId: string, event: AnalyticsEvent): Promise<void> => {
    const client = getPostHogServer()
    if (!client) return

    try {
      client.capture({
        distinctId: userId,
        event: event.event,
        properties: event.properties,
      })

      // Important: Flush events in serverless environment
      await client.shutdown()
    } catch (error) {
      console.error(`[PostHog Server] Failed to track event "${event.event}":`, error)
    }
  },

  /**
   * Identify a user on the server
   *
   * @param userId - User identifier
   * @param properties - User properties
   *
   * @example
   * await analyticsServer.identify(user.id, {
   *   email: user.email,
   *   name: user.name,
   *   role: user.role
   * })
   */
  identify: async (userId: string, properties?: Record<string, unknown>): Promise<void> => {
    const client = getPostHogServer()
    if (!client) return

    try {
      client.identify({
        distinctId: userId,
        properties,
      })

      await client.shutdown()
    } catch (error) {
      console.error('[PostHog Server] Failed to identify user:', error)
    }
  },

  /**
   * Set organization context (group analytics) on the server
   *
   * @param userId - User identifier
   * @param organizationId - Organization identifier
   * @param properties - Organization properties
   *
   * @example
   * await analyticsServer.setOrganization(user.id, org.id, {
   *   name: org.name,
   *   plan: org.plan
   * })
   */
  setOrganization: async (
    userId: string,
    organizationId: string,
    properties?: Record<string, unknown>
  ): Promise<void> => {
    const client = getPostHogServer()
    if (!client) return

    try {
      client.groupIdentify({
        groupType: 'organization',
        groupKey: organizationId,
        properties,
      })

      // Also associate user with this organization
      client.capture({
        distinctId: userId,
        event: '$group_identify',
        properties: {
          $group_type: 'organization',
          $group_key: organizationId,
          ...properties,
        },
      })

      await client.shutdown()
    } catch (error) {
      console.error('[PostHog Server] Failed to set organization:', error)
    }
  },

  /**
   * Check if a feature flag is enabled for a user (server-side)
   *
   * @param flagKey - Feature flag key
   * @param userId - User identifier
   * @returns boolean or undefined
   *
   * @example
   * const isEnabled = await analyticsServer.isFeatureEnabled('new-dashboard', user.id)
   * if (isEnabled) {
   *   // Render new dashboard
   * }
   */
  isFeatureEnabled: async (
    flagKey: FeatureFlagKey,
    userId: string
  ): Promise<boolean | undefined> => {
    const client = getPostHogServer()
    if (!client) return undefined

    try {
      const isEnabled = await client.isFeatureEnabled(flagKey, userId)
      await client.shutdown()
      return isEnabled
    } catch (error) {
      console.error(`[PostHog Server] Failed to check feature flag "${flagKey}":`, error)
      return undefined
    }
  },

  /**
   * Get feature flag value for a user (server-side)
   *
   * @param flagKey - Feature flag key
   * @param userId - User identifier
   * @returns flag value or undefined
   *
   * @example
   * const variant = await analyticsServer.getFeatureFlag('ab-test-variant', user.id)
   */
  getFeatureFlag: async (
    flagKey: FeatureFlagKey,
    userId: string
  ): Promise<string | boolean | undefined> => {
    const client = getPostHogServer()
    if (!client) return undefined

    try {
      const value = await client.getFeatureFlag(flagKey, userId)
      await client.shutdown()
      return value
    } catch (error) {
      console.error(`[PostHog Server] Failed to get feature flag "${flagKey}":`, error)
      return undefined
    }
  },

  /**
   * Manually shutdown the PostHog server client
   *
   * Flushes all pending events. Called automatically in track/identify methods.
   * Use this if you're using the raw client.
   */
  shutdown: async (): Promise<void> => {
    const client = getPostHogServer()
    if (!client) return

    try {
      await client.shutdown()
    } catch (error) {
      console.error('[PostHog Server] Failed to shutdown:', error)
    }
  },
}

/**
 * Raw PostHog server client for advanced usage
 *
 * Prefer using analyticsServer.* methods instead.
 */
export function getPostHogClient(): PostHog | null {
  return getPostHogServer()
}
