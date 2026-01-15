/**
 * PostHog Pageview Tracking Component
 *
 * Automatically tracks page views in Next.js App Router.
 * Handles both pathname changes and search param changes.
 *
 * @see https://posthog.com/docs/libraries/next-js
 * @see docs/adr/ADR-013-posthog-analytics-and-experimentation-platform.md
 */

'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

/**
 * PostHog PageView Tracker
 *
 * Add this component to your root layout to automatically track page views.
 * Tracks both route changes and query parameter changes.
 *
 * @example
 * // In app/layout.tsx
 * import { PostHogPageView } from '@/app/_components/posthog-pageview'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <PostHogProvider>
 *           <PostHogPageView />
 *           {children}
 *         </PostHogProvider>
 *       </body>
 *     </html>
 *   )
 * }
 */
export function PostHogPageView(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || !posthog.__loaded) return

    try {
      // Build full URL with search params
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }

      // Track pageview
      posthog.capture('$pageview', {
        $current_url: url,
      })

      if (process.env.NODE_ENV === 'development') {
        console.log('[PostHog] Pageview tracked:', url)
      }
    } catch (error) {
      console.error('[PostHog] Failed to track pageview:', error)
    }
  }, [pathname, searchParams])

  return null
}
