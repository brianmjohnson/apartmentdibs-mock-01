'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { PostHogInitCheck, PostHogProvider } from '@/components/providers/posthog-provider'

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
    <QueryClientProvider client={queryClient}>
      <PostHogInitCheck>
        <PostHogProvider>{children}</PostHogProvider>
      </PostHogInitCheck>
    </QueryClientProvider>
  )
}
