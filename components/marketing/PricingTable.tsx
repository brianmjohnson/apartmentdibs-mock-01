'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  ctaLink: string
  highlighted?: boolean
  badge?: string
}

interface PricingTableProps {
  type: 'landlord' | 'agent'
}

const landlordTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For landlords getting started',
    features: ['1 listing', 'Basic screening', 'Email support', '30-day profile validity'],
    cta: 'Get Started',
    ctaLink: '/register?role=landlord&tier=free',
  },
  {
    name: 'Compliance',
    price: '$249',
    period: '/year',
    description: 'Full compliance protection',
    features: [
      'Unlimited listings',
      'Complete audit trail',
      'Adverse action letters',
      'Risk scores',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/register?role=landlord&tier=compliance',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Concierge',
    price: '$499',
    period: '/year + $99/listing',
    description: 'White-glove service',
    features: [
      'Everything in Compliance',
      'Phone support',
      'White-glove onboarding',
      'Dedicated account manager',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    ctaLink: '/for-landlords/demo',
  },
]

const agentTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'For individual agents',
    features: [
      '10 listings',
      'Basic CRM',
      'Zillow syndication',
      'Email support',
      '30-day profile validity',
    ],
    cta: 'Get Started',
    ctaLink: '/register?role=agent&tier=starter',
  },
  {
    name: 'Professional',
    price: '$299',
    period: '/month',
    description: 'For growing agents',
    features: [
      'Unlimited listings',
      'Full CRM with auto-matching',
      '6+ platform syndication',
      'Priority support',
      'Analytics dashboard',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/register?role=agent&tier=professional',
    highlighted: true,
    badge: 'Best Value',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams and brokerages',
    features: [
      'Multi-agent teams',
      'API access',
      'Dedicated account manager',
      'Custom branding',
      '99.9% uptime SLA',
    ],
    cta: 'Contact Sales',
    ctaLink: '/for-agents/demo',
  },
]

export function PricingTable({ type }: PricingTableProps) {
  const tiers = type === 'landlord' ? landlordTiers : agentTiers

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {tiers.map((tier) => (
        <Card
          key={tier.name}
          className={cn(
            'relative flex flex-col',
            tier.highlighted && 'border-primary border-2 shadow-lg'
          )}
        >
          {tier.badge && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{tier.badge}</Badge>
          )}
          <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
            <CardDescription>{tier.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">{tier.price}</span>
              <span className="text-muted-foreground">{tier.period}</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ul className="mb-6 flex-1 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant={tier.highlighted ? 'default' : 'outline'}
              className="w-full"
            >
              <Link href={tier.ctaLink}>{tier.cta}</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function MoneyBackGuarantee() {
  return (
    <div className="mt-8 rounded-lg border bg-muted/50 p-6 text-center">
      <p className="text-lg font-semibold">30-Day Money-Back Guarantee</p>
      <p className="text-muted-foreground mt-1 text-sm">
        Not satisfied? Get a full refund within 30 days, no questions asked.
      </p>
    </div>
  )
}
