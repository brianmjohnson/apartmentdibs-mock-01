'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Phone } from 'lucide-react'

interface CalendlyEmbedProps {
  url?: string
  prefill?: {
    name?: string
    email?: string
  }
}

export function CalendlyEmbed({
  url = 'https://calendly.com/apartmentdibs/demo',
  prefill,
}: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const calendlyUrl = prefill
    ? `${url}?name=${encodeURIComponent(prefill.name || '')}&email=${encodeURIComponent(prefill.email || '')}`
    : url

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Your Demo</CardTitle>
        <CardDescription>
          Choose a time that works best for you. We offer 30-minute and 60-minute sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="calendly-inline-widget"
          data-url={calendlyUrl}
          style={{ minWidth: '320px', height: '630px' }}
        />

        <div className="bg-muted/50 mt-6 rounded-lg border p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>Can&apos;t find a time? Call us at</span>
            <a href="tel:+18005551234" className="font-medium underline">
              (800) 555-1234
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
