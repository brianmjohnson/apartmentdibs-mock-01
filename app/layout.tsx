import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { PostHogPageView } from './_components/posthog-pageview'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Apartment Dibs',
  description: 'Apartment Dibs Application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </Providers>
      </body>
    </html>
  )
}
