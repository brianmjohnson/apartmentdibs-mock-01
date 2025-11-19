/**
 * @file useReducedMotion hook for accessibility
 * @story US-001 - PII Anonymization Before Landlord Review
 *
 * Respects user's prefers-reduced-motion setting for accessibility
 */

'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect if user prefers reduced motion
 * Respects system/browser preference for accessibility
 *
 * @returns {boolean} True if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return
    }

    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Update when preference changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}
