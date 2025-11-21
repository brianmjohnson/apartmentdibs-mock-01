/**
 * PostHog Event Definitions
 *
 * Type-safe event tracking helpers for all custom analytics events.
 * Use these functions instead of calling posthog.capture() directly.
 *
 * @see docs/analytics/event-catalog.md
 * @see docs/user-stories/posthog-integration.md
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
 * Application Events
 */
export const ApplicationEvents = {
  created: (properties: ApplicationCreatedEvent['properties']): ApplicationCreatedEvent => ({
    event: 'application_created',
    properties,
  }),

  viewed: (properties: ApplicationViewedEvent['properties']): ApplicationViewedEvent => ({
    event: 'application_viewed',
    properties,
  }),
}

/**
 * Listing Events
 */
export const ListingEvents = {
  created: (properties: ListingCreatedEvent['properties']): ListingCreatedEvent => ({
    event: 'listing_created',
    properties,
  }),

  viewed: (properties: ListingViewedEvent['properties']): ListingViewedEvent => ({
    event: 'listing_viewed',
    properties,
  }),
}

/**
 * Message Events
 */
export const MessageEvents = {
  sent: (properties: MessageSentEvent['properties']): MessageSentEvent => ({
    event: 'message_sent',
    properties,
  }),
}

/**
 * Search Events
 */
export const SearchEvents = {
  performed: (properties: SearchPerformedEvent['properties']): SearchPerformedEvent => ({
    event: 'search_performed',
    properties,
  }),
}

/**
 * Profile Events
 */
export const ProfileEvents = {
  completed: (properties: ProfileCompletedEvent['properties']): ProfileCompletedEvent => ({
    event: 'profile_completed',
    properties,
  }),
}

/**
 * Payment Events
 */
export const PaymentEvents = {
  initiated: (properties: PaymentInitiatedEvent['properties']): PaymentInitiatedEvent => ({
    event: 'payment_initiated',
    properties,
  }),

  completed: (properties: PaymentCompletedEvent['properties']): PaymentCompletedEvent => ({
    event: 'payment_completed',
    properties,
  }),
}

/**
 * Convenience export of all event builders
 */
export const Events = {
  Application: ApplicationEvents,
  Listing: ListingEvents,
  Message: MessageEvents,
  Search: SearchEvents,
  Profile: ProfileEvents,
  Payment: PaymentEvents,
}
