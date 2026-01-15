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

/**
 * PostHog Analytics Provider
 *
 * Usage: Wrap your app with this provider in app/providers.tsx
 *
 * @example
 * <PostHogProvider>
 *   {children}
 * </PostHogProvider>
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log(
      'Initializing PostHog',
      process.env.NEXT_PUBLIC_POSTHOG_KEY,
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    )
    // Initialize PostHog (official pattern from PostHog docs)
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/0579f8', // Reverse proxy to avoid ad blockers
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com', // Required for toolbar authentication
      defaults: '2025-05-24', // Use latest PostHog defaults

      // Privacy settings (ADR-013)
      person_profiles: 'identified_only',
      capture_pageview: false, // Manual pageview tracking
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

/**
 * PostHog Initialization Check
 *
 * Helper component to ensure PostHog is initialized before rendering children.
 * Only use this if you need to ensure PostHog is ready before rendering.
 *
 * @example
 * <PostHogInitCheck>
 *   <ComponentThatNeedsPostHog />
 * </PostHogInitCheck>
 */
export function PostHogInitCheck({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Check if PostHog is initialized
    if (posthog.__loaded) {
      setIsReady(true)
    } else {
      // Wait for PostHog to initialize
      const checkInterval = setInterval(() => {
        if (posthog.__loaded) {
          setIsReady(true)
          clearInterval(checkInterval)
        }
      }, 100)

      // Timeout after 5 seconds
      setTimeout(() => {
        setIsReady(true)
        clearInterval(checkInterval)
      }, 5000)

      return () => clearInterval(checkInterval)
    }
  }, [])

  if (!isReady) {
    return null // or a loading spinner
  }

  return <>{children}</>
}
