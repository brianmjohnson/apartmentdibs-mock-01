'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Mail, Phone } from 'lucide-react'

interface ContactSupportProps {
  showPhone?: boolean
}

export function ContactSupport({ showPhone = false }: ContactSupportProps) {
  return (
    <Card className="border-muted bg-muted/50">
      <CardContent className="py-6 text-center">
        <MessageSquare className="text-muted-foreground mx-auto mb-4 h-8 w-8" />
        <h3 className="mb-2 font-semibold">Can&apos;t find your answer?</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Our support team is here to help you with any questions.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Link>
          </Button>
          {showPhone && (
            <Button asChild variant="outline">
              <a href="tel:+18005551234">
                <Phone className="mr-2 h-4 w-4" />
                (800) 555-1234
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Cross-links component for navigating to other FAQ sections
interface FAQCrossLinksProps {
  currentType: 'tenant' | 'agent' | 'landlord'
}

export function FAQCrossLinks({ currentType }: FAQCrossLinksProps) {
  const links = {
    tenant: { href: '/faq', label: 'Tenant FAQ' },
    agent: { href: '/for-agents/faq', label: 'Agent FAQ' },
    landlord: { href: '/for-landlords/faq', label: 'Landlord FAQ' },
  }

  const otherLinks = Object.entries(links).filter(([type]) => type !== currentType)

  return (
    <div className="rounded-lg border bg-muted/30 p-4 text-center">
      <p className="text-muted-foreground mb-2 text-sm">Looking for different information?</p>
      <div className="flex flex-wrap justify-center gap-2">
        {otherLinks.map(([type, { href, label }]) => (
          <Link
            key={type}
            href={href}
            className="text-primary text-sm underline hover:no-underline"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
