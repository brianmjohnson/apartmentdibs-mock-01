'use client'

import { Check, Shield, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProfileTier {
  id: string
  name: string
  description: string
  price: number
  validityDays: number
  features: string[]
  isBestValue?: boolean
  icon: React.ReactNode
}

const tiers: ProfileTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential screening for your application',
    price: 39.99,
    validityDays: 60,
    icon: <Shield className="h-6 w-6" />,
    features: [
      'Credit report',
      'Basic background check',
      '60-day validity',
      'Apply to unlimited listings',
      'Email support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Complete verification for serious renters',
    price: 54.99,
    validityDays: 90,
    isBestValue: true,
    icon: <Star className="h-6 w-6" />,
    features: [
      'Full credit report',
      'Comprehensive background check',
      'Eviction history',
      'Income verification',
      '90-day validity',
      'Apply to unlimited listings',
      'Priority support',
    ],
  },
  {
    id: 'group',
    name: 'Group',
    description: 'Perfect for roommates applying together',
    price: 99.99,
    validityDays: 90,
    icon: <Users className="h-6 w-6" />,
    features: [
      'Screen 2-4 roommates',
      'Shared household report',
      'Combined income verification',
      'Group eviction check',
      '90-day validity',
      'Joint applications',
      'Priority support',
    ],
  },
]

interface ProfilePricingProps {
  onSelectTier?: (tierId: string) => void
  currentTierId?: string
  className?: string
}

export function ProfilePricing({ onSelectTier, currentTierId, className }: ProfilePricingProps) {
  const handleSelectTier = (tierId: string) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('profile_tier_selected', {
        tierId,
      })
    }

    onSelectTier?.(tierId)
  }

  return (
    <div className={className}>
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground">
          30-day money-back guarantee if denied by all landlords
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`relative flex flex-col ${
              tier.isBestValue
                ? 'border-2 border-primary shadow-lg'
                : 'border'
            } ${currentTierId === tier.id ? 'ring-2 ring-primary' : ''}`}
          >
            {tier.isBestValue && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Best Value
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
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-muted-foreground"> one-time</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Valid for {tier.validityDays} days
                </p>
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
                  Current Profile
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={tier.isBestValue ? 'default' : 'outline'}
                  onClick={() => handleSelectTier(tier.id)}
                >
                  Get {tier.name}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
