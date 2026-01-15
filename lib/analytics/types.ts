/**
 * PostHog Analytics Types
 *
 * Type definitions for PostHog integration including events, user properties,
 * organization properties, and feature flags.
 *
 * @see docs/technical-specs/posthog-integration-spec.md
 * @see docs/adr/ADR-013-posthog-analytics-and-experimentation-platform.md
 */

/**
 * User properties sent to PostHog on identification
 */
export interface UserProperties {
  id: string
  email: string
  name?: string
  role?: string
  createdAt: Date | string
  organizationId?: string
  // Add more properties as needed
  [key: string]: unknown
}

/**
 * Organization properties for group analytics
 */
export interface OrganizationProperties {
  id: string
  name: string
  plan?: string
  createdAt?: Date | string
  memberCount?: number
  // Add more properties as needed
  [key: string]: unknown
}

/**
 * Application Created Event
 */
export interface ApplicationCreatedEvent {
  event: 'application_created'
  properties: {
    application_id: string
    listing_id: string
    user_id: string
    organization_id?: string
  }
}

/**
 * Application Viewed Event
 */
export interface ApplicationViewedEvent {
  event: 'application_viewed'
  properties: {
    application_id: string
    user_id: string
    viewer_role: string
  }
}

/**
 * Listing Created Event
 */
export interface ListingCreatedEvent {
  event: 'listing_created'
  properties: {
    listing_id: string
    user_id: string
    organization_id?: string
    property_type?: string
  }
}

/**
 * Listing Viewed Event
 */
export interface ListingViewedEvent {
  event: 'listing_viewed'
  properties: {
    listing_id: string
    user_id?: string
    source?: string
  }
}

/**
 * Message Sent Event
 */
export interface MessageSentEvent {
  event: 'message_sent'
  properties: {
    message_id: string
    sender_id: string
    recipient_id: string
    conversation_id?: string
  }
}

/**
 * Search Performed Event
 */
export interface SearchPerformedEvent {
  event: 'search_performed'
  properties: {
    query: string
    filters?: Record<string, unknown>
    results_count: number
    user_id?: string
  }
}

/**
 * Profile Completed Event
 */
export interface ProfileCompletedEvent {
  event: 'profile_completed'
  properties: {
    user_id: string
    profile_type: string
    completion_percentage: number
  }
}

/**
 * Payment Initiated Event
 */
export interface PaymentInitiatedEvent {
  event: 'payment_initiated'
  properties: {
    payment_id: string
    amount: number
    currency: string
    user_id: string
    payment_method?: string
  }
}

/**
 * Payment Completed Event
 */
export interface PaymentCompletedEvent {
  event: 'payment_completed'
  properties: {
    payment_id: string
    amount: number
    currency: string
    user_id: string
    status: 'success' | 'failed'
  }
}

/**
 * Union type of all analytics events
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
 * Feature flag keys (type-safe)
 *
 * Add new feature flags here for type safety across the app
 */
export type FeatureFlagKey =
  | 'new-dashboard'
  | 'beta-features'
  | 'maintenance-mode'
  | 'session-recording'
  // Add more feature flags as needed

/**
 * PostHog initialization configuration
 */
export interface PostHogConfig {
  apiKey: string
  apiHost?: string
  personProfiles?: 'always' | 'identified_only' | 'never'
  capturePageview?: boolean
  capturePageleave?: boolean
  enableSessionRecording?: boolean
  respectDNT?: boolean
  ipAnonymization?: boolean
}
