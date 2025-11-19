'use client'

import { Check, Shield, Phone, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LandlordTier {
  id: string
  name: string
  description: string
  annualPrice: number | null
  perListingPrice?: number
  features: string[]
  isRecommended?: boolean
  icon: React.ReactNode
}

const tiers: LandlordTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic features',
    annualPrice: 0,
    icon: <Shield className="h-6 w-6" />,
    features: [
      '1 active listing',
      'Basic tenant screening',
      'Email support',
      'Standard application forms',
    ],
  },
  {
    id: 'compliance',
    name: 'Compliance',
    description: 'Full legal protection for landlords',
    annualPrice: 249,
    isRecommended: true,
    icon: <Star className="h-6 w-6" />,
    features: [
      'Unlimited listings',
      'Full audit trail',
      'Adverse action automation',
      'Risk score analytics',
      'Priority support',
      'Compliance reports',
      'Document retention',
    ],
  },
  {
    id: 'concierge',
    name: 'Concierge',
    description: 'White-glove service for busy landlords',
    annualPrice: 499,
    perListingPrice: 99,
    icon: <Phone className="h-6 w-6" />,
    features: [
      'Everything in Compliance',
      'Phone support',
      'Dedicated account manager',
      'White-glove onboarding',
      'Custom reports',
      'Tenant communication assistance',
      'Priority processing',
    ],
  },
]

interface LandlordPricingProps {
  onSelectTier?: (tierId: string) => void
  currentTierId?: string
  className?: string
}

export function LandlordPricing({ onSelectTier, currentTierId, className }: LandlordPricingProps) {
  const handleSelectTier = (tierId: string) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('landlord_tier_selected', {
        tierId,
      })
    }

    onSelectTier?.(tierId)
  }

  const formatPrice = (tier: LandlordTier) => {
    if (tier.annualPrice === 0) return 'Free'
    return `$${tier.annualPrice}`
  }

  return (
    <div className={className}>
      <div className="mb-8 text-center">
        <h3 className="text-lg font-semibold">Protect Your Investment</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Compliance tiers save you thousands in potential legal fees
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`relative flex flex-col ${
              tier.isRecommended
                ? 'border-2 border-primary shadow-lg'
                : 'border'
            } ${currentTierId === tier.id ? 'ring-2 ring-primary' : ''}`}
          >
            {tier.isRecommended && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Recommended
              </Badge>
            )}
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {tier.icon}
              </div>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">{formatPrice(tier)}</span>
                {tier.annualPrice !== 0 && (
                  <span className="text-muted-foreground">/year</span>
                )}
                {tier.perListingPrice && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    + ${tier.perListingPrice}/listing
                  </p>
                )}
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {currentTierId === tier.id ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={tier.isRecommended ? 'default' : 'outline'}
                  onClick={() => handleSelectTier(tier.id)}
                >
                  {tier.annualPrice === 0 ? 'Get Started' : 'Subscribe'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
