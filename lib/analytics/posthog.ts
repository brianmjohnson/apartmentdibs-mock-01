/**
 * PostHog Client Utilities
 *
 * Wrapper functions for PostHog client-side analytics.
 * Use these instead of calling posthog directly for type safety and consistency.
 *
 * @see docs/analytics/event-catalog.md
 * @see docs/adr/ADR-013-posthog-analytics-and-experimentation-platform.md
 */

'use client'

import posthog from 'posthog-js'
import type { AnalyticsEvent, UserProperties, OrganizationProperties, FeatureFlagKey } from './types'

/**
 * Analytics client
 *
 * Provides type-safe methods for tracking events, identifying users,
 * and managing feature flags.
 */
export const analytics = {
  /**
   * Identify a user
   *
   * Call this after user logs in or signs up to associate events with the user.
   *
   * @param userId - Unique user identifier
   * @param properties - User properties (email, name, role, etc.)
   *
   * @example
   * analytics.identify(user.id, {
   *   email: user.email,
   *   name: user.name,
   *   role: user.role,
   *   createdAt: user.createdAt
   * })
   */
  identify: (userId: string, properties?: Partial<UserProperties>) => {
    try {
      posthog.identify(userId, properties)
    } catch (error) {
      console.error('[PostHog] Failed to identify user:', error)
    }
  },

  /**
   * Track a custom event
   *
   * Use the Events builders from lib/analytics/events.ts for type safety.
   *
   * @param event - Analytics event object
   *
   * @example
   * import { Events } from '@/lib/analytics/events'
   *
   * analytics.track(Events.Listing.created({
   *   listing_id: '123',
   *   user_id: user.id,
   *   property_type: 'apartment'
   * }))
   */
  track: (event: AnalyticsEvent) => {
    try {
      posthog.capture(event.event, event.properties)
    } catch (error) {
      console.error(`[PostHog] Failed to track event "${event.event}":`, error)
    }
  },

  /**
   * Set organization context (group analytics)
   *
   * Call this after user switches organization or on initial load
   * to enable organization-level analytics.
   *
   * @param organizationId - Organization identifier
   * @param properties - Organization properties
   *
   * @example
   * analytics.setOrganization(org.id, {
   *   name: org.name,
   *   plan: org.plan,
   *   memberCount: org.members.length
   * })
   */
  setOrganization: (organizationId: string, properties?: Partial<OrganizationProperties>) => {
    try {
      posthog.group('organization', organizationId, properties)
    } catch (error) {
      console.error('[PostHog] Failed to set organization:', error)
    }
  },

  /**
   * Reset user identity
   *
   * Call this on logout to clear user identification.
   * This will generate a new anonymous ID for subsequent events.
   *
   * @example
   * analytics.reset()
   */
  reset: () => {
    try {
      posthog.reset()
    } catch (error) {
      console.error('[PostHog] Failed to reset:', error)
    }
  },

  /**
   * Track page view
   *
   * Normally handled automatically by PostHogPageView component.
   * Use this for manual tracking if needed.
   *
   * @example
   * analytics.pageView()
   */
  pageView: () => {
    try {
      posthog.capture('$pageview')
    } catch (error) {
      console.error('[PostHog] Failed to track pageview:', error)
    }
  },

  /**
   * Check if a feature flag is enabled
   *
   * @param flagKey - Feature flag key
   * @returns boolean or undefined if flag hasn't loaded
   *
   * @example
   * if (analytics.isFeatureEnabled('new-dashboard')) {
   *   // Show new dashboard
   * }
   */
  isFeatureEnabled: (flagKey: FeatureFlagKey): boolean | undefined => {
    try {
      return posthog.isFeatureEnabled(flagKey)
    } catch (error) {
      console.error(`[PostHog] Failed to check feature flag "${flagKey}":`, error)
      return undefined
    }
  },

  /**
   * Get feature flag value
   *
   * @param flagKey - Feature flag key
   * @returns flag value (string, boolean, number) or undefined
   *
   * @example
   * const variant = analytics.getFeatureFlag('ab-test-variant')
   * // variant could be 'control', 'test-a', 'test-b', etc.
   */
  getFeatureFlag: (flagKey: FeatureFlagKey): string | boolean | undefined => {
    try {
      return posthog.getFeatureFlag(flagKey)
    } catch (error) {
      console.error(`[PostHog] Failed to get feature flag "${flagKey}":`, error)
      return undefined
    }
  },

  /**
   * Set user properties (super properties)
   *
   * These properties will be sent with every event.
   *
   * @param properties - Properties to set
   *
   * @example
   * analytics.setProperties({ theme: 'dark', language: 'en' })
   */
  setProperties: (properties: Record<string, unknown>) => {
    try {
      posthog.register(properties)
    } catch (error) {
      console.error('[PostHog] Failed to set properties:', error)
    }
  },

  /**
   * Opt user out of tracking
   *
   * @example
   * analytics.optOut()
   */
  optOut: () => {
    try {
      posthog.opt_out_capturing()
    } catch (error) {
      console.error('[PostHog] Failed to opt out:', error)
    }
  },

  /**
   * Opt user in to tracking (if previously opted out)
   *
   * @example
   * analytics.optIn()
   */
  optIn: () => {
    try {
      posthog.opt_in_capturing()
    } catch (error) {
      console.error('[PostHog] Failed to opt in:', error)
    }
  },
}

/**
 * Re-export posthog instance for advanced usage
 *
 * Use analytics.* methods instead when possible for type safety.
 */
export { posthog }
