/**
 * PostHog Event Tracking Hook
 *
 * Convenient React hook for tracking events in components.
 * Provides a stable callback that won't cause re-renders.
 *
 * @see docs/analytics/event-catalog.md
 * @see docs/user-stories/posthog-integration.md
 */

'use client'

import { useCallback } from 'react'
import { analytics } from '@/lib/analytics/posthog'
import type { AnalyticsEvent } from '@/lib/analytics/types'

/**
 * Hook for tracking analytics events
 *
 * Returns a stable callback function that can be used to track events
 * without causing re-renders.
 *
 * @returns track function
 *
 * @example
 * import { useTrackEvent } from '@/lib/hooks/use-track-event'
 * import { Events } from '@/lib/analytics/events'
 *
 * function ListingCard({ listing }) {
 *   const track = useTrackEvent()
 *
 *   const handleClick = () => {
 *     track(Events.Listing.viewed({
 *       listing_id: listing.id,
 *       source: 'search-results'
 *     }))
 *   }
 *
 *   return <div onClick={handleClick}>...</div>
 * }
 */
export function useTrackEvent() {
  const track = useCallback((event: AnalyticsEvent) => {
    analytics.track(event)
  }, [])

  return track
}

/**
 * Hook for tracking a specific event with preset properties
 *
 * Useful when you want to track the same event multiple times with some fixed properties.
 *
 * @param eventBuilder - Function that builds the event
 * @returns track function that accepts additional properties
 *
 * @example
 * import { useTrackSpecificEvent } from '@/lib/hooks/use-track-event'
 * import { Events } from '@/lib/analytics/events'
 *
 * function SearchResults({ query }) {
 *   const trackSearch = useTrackSpecificEvent((resultsCount: number) =>
 *     Events.Search.performed({
 *       query,
 *       results_count: resultsCount,
 *       filters: {}
 *     })
 *   )
 *
 *   useEffect(() => {
 *     trackSearch(results.length)
 *   }, [results, trackSearch])
 * }
 */
export function useTrackSpecificEvent<TArgs extends unknown[]>(
  eventBuilder: (...args: TArgs) => AnalyticsEvent
) {
  const track = useCallback(
    (...args: TArgs) => {
      const event = eventBuilder(...args)
      analytics.track(event)
    },
    [eventBuilder]
  )

  return track
}

/**
 * Hook for tracking events with automatic error handling
 *
 * Catches and logs errors without breaking the component.
 *
 * @returns track function with error handling
 *
 * @example
 * const track = useSafeTrackEvent()
 * track(Events.Application.created({ ... })) // Won't throw errors
 */
export function useSafeTrackEvent() {
  const track = useCallback((event: AnalyticsEvent) => {
    try {
      analytics.track(event)
    } catch (error) {
      console.error('[PostHog] Failed to track event:', error)
      // Optionally report to error tracking service
    }
  }, [])

  return track
}
