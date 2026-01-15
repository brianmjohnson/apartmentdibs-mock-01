'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TierData {
  name: string
  price: number
  period?: string
  description: string
  features: string[]
  ctaText: string
  ctaLink: string
  highlighted?: boolean
  badge?: string
}

interface TierCardProps {
  tier: TierData
  onSelect?: () => void
}

export function TierCard({ tier, onSelect }: TierCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col',
        tier.highlighted && 'border-primary border-2 shadow-lg'
      )}
    >
      {tier.badge && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{tier.badge}</Badge>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${tier.price.toFixed(2)}</span>
          {tier.period && <span className="text-muted-foreground">/{tier.period}</span>}
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
          asChild={!onSelect}
          variant={tier.highlighted ? 'default' : 'outline'}
          className="w-full"
          onClick={onSelect}
        >
          {onSelect ? <span>{tier.ctaText}</span> : <Link href={tier.ctaLink}>{tier.ctaText}</Link>}
        </Button>
      </CardContent>
    </Card>
  )
}

// Pre-configured tenant pricing tiers
export const tenantPricingTiers: TierData[] = [
  {
    name: 'Basic Profile',
    price: 39.99,
    description: 'Essential screening for budget-conscious renters',
    features: [
      'Credit report (TransUnion)',
      'Basic background check',
      '60-day validity',
      'Unlimited applications',
      'Email support',
    ],
    ctaText: 'Get Started',
    ctaLink: '/register?tier=basic',
  },
  {
    name: 'Premium Profile',
    price: 54.99,
    description: 'Complete screening for competitive applicants',
    features: [
      'Everything in Basic',
      'Full criminal background check',
      'Eviction history search',
      'Income verification (Plaid)',
      '90-day validity',
      'Priority support',
    ],
    ctaText: 'Get Started',
    ctaLink: '/register?tier=premium',
    highlighted: true,
    badge: 'Best Value',
  },
  {
    name: 'Group Application',
    price: 99.99,
    description: 'Household screening for roommates',
    features: [
      'Everything in Premium',
      '2-4 roommate profiles',
      'Shared household screening',
      'Combined income calculation',
      '90-day validity',
      'Priority support',
    ],
    ctaText: 'Get Started',
    ctaLink: '/register?tier=group',
  },
]
