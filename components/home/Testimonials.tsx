'use client'

import { Users, Building2, TrendingUp, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Testimonial {
  quote: string
  author: string
  role: string
  initials: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      'ApartmentDibs saved me $300 and 12 hours. I created my profile once and applied to 15 listings in one afternoon.',
    author: 'Maya T.',
    role: 'Verified Renter, Brooklyn',
    initials: 'MT',
  },
  {
    quote:
      'I close 25% more leases now. The CRM auto-matching connects me with qualified tenants instantly.',
    author: 'Jessica L.',
    role: 'Licensed Agent, Manhattan',
    initials: 'JL',
  },
  {
    quote:
      'The audit trail is bulletproof. I sleep better knowing I&apos;m protected from discrimination lawsuits.',
    author: 'David R.',
    role: 'Property Owner, Queens',
    initials: 'DR',
  },
]

interface Stat {
  icon: React.ReactNode
  value: string
  label: string
}

const stats: Stat[] = [
  {
    icon: <Users className="text-primary h-8 w-8" />,
    value: '10K+',
    label: 'Verified Renters',
  },
  {
    icon: <Building2 className="text-primary h-8 w-8" />,
    value: '500+',
    label: 'Partner Agents',
  },
  {
    icon: <TrendingUp className="text-primary h-8 w-8" />,
    value: '21',
    label: 'Days Avg. Time to Lease',
  },
]

export function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Trusted by Thousands</h2>

        {/* Stats */}
        <div className="mx-auto mb-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                {stat.icon}
                <span className="text-4xl font-bold md:text-5xl">{stat.value}</span>
              </div>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-foreground border-2">
              <CardContent className="pt-6">
                <Quote className="text-muted-foreground mb-4 h-6 w-6" />
                <p className="text-muted-foreground mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center text-sm font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
