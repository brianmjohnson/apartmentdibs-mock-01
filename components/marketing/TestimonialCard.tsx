'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  image?: string
  initials?: string
}

export function TestimonialCard({ quote, author, role, image, initials }: TestimonialCardProps) {
  const displayInitials =
    initials ||
    author
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <Quote className="text-muted-foreground mb-4 h-6 w-6" />
        <p className="text-muted-foreground mb-6 italic">&quot;{quote}&quot;</p>
        <div className="flex items-center gap-3">
          {image ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image src={image} alt={author} fill className="object-cover" />
            </div>
          ) : (
            <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold">
              {displayInitials}
            </div>
          )}
          <div>
            <p className="font-medium">{author}</p>
            <p className="text-muted-foreground text-sm">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Pre-configured testimonials for different personas
export const landlordTestimonials = [
  {
    quote:
      'The audit trail saved me in a discrimination complaint. I showed exactly how I applied the same criteria to every applicant, and the case was dismissed.',
    author: 'David Patel',
    role: 'Property Owner, 15 units',
    initials: 'DP',
  },
  {
    quote:
      "I was skeptical about technology, but the concierge service walked me through everything. Now I can't imagine going back to paper applications.",
    author: 'Sandra Williams',
    role: 'Independent Landlord, 3 units',
    initials: 'SW',
  },
  {
    quote:
      'Reduced my vacancy time from 45 days to 19 days. The pre-verified tenant pool means I only see qualified applicants.',
    author: 'Michael Chen',
    role: 'Portfolio Landlord, 42 units',
    initials: 'MC',
  },
]

export const agentTestimonials = [
  {
    quote:
      'The CRM auto-matching is a game-changer. Last month I placed 3 tenants who were originally denied for other properties in my pipeline.',
    author: 'Jessica Rodriguez',
    role: 'Senior Leasing Agent, Metro Property',
    initials: 'JR',
  },
  {
    quote:
      'One-click syndication saves me 10 hours a week. I used to spend all day copying listings between platforms.',
    author: 'Marcus Johnson',
    role: 'Independent Agent, Brooklyn',
    initials: 'MJ',
  },
  {
    quote:
      "Our brokerage's ROI is 41x. We closed $2.4M more in commissions last year thanks to the CRM and faster turnaround.",
    author: 'Sarah Kim',
    role: 'Brokerage Owner, Prime Realty',
    initials: 'SK',
  },
]
