'use client'

import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface PricingTier {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  listingLimit: number | null
  isPopular?: boolean
  isEnterprise?: boolean
}

const tiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individual agents getting started',
    monthlyPrice: 99,
    yearlyPrice: 948,
    listingLimit: 10,
    features: [
      '10 active listings',
      'Basic CRM features',
      'Zillow syndication',
      'Email support',
      'Standard analytics',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing agents who need more power',
    monthlyPrice: 299,
    yearlyPrice: 2868,
    listingLimit: null,
    isPopular: true,
    features: [
      'Unlimited listings',
      'Full CRM suite',
      '6+ platform syndication',
      'Priority support',
      'Advanced analytics',
      'Lead scoring',
      'Automated follow-ups',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large teams',
    monthlyPrice: 0,
    yearlyPrice: 0,
    listingLimit: null,
    isEnterprise: true,
    features: [
      'Multi-agent teams',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SSO/SAML',
      'Custom reporting',
      'SLA guarantees',
    ],
  },
]

interface PricingTableProps {
  onSelectPlan?: (planId: string, isAnnual: boolean) => void
  currentPlanId?: string
  className?: string
}

export function PricingTable({ onSelectPlan, currentPlanId, className }: PricingTableProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  const handleSelectPlan = (planId: string) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('pricing_plan_selected', {
        planId,
        isAnnual,
      })
    }

    onSelectPlan?.(planId, isAnnual)
  }

  const formatPrice = (tier: PricingTier) => {
    if (tier.isEnterprise) return 'Custom'
    const price = isAnnual ? Math.floor(tier.yearlyPrice / 12) : tier.monthlyPrice
    return `$${price}`
  }

  const getAnnualSavings = (tier: PricingTier) => {
    if (tier.isEnterprise) return null
    const monthlyCost = tier.monthlyPrice * 12
    const annualCost = tier.yearlyPrice
    const savings = monthlyCost - annualCost
    return savings
  }

  return (
    <div className={className}>
      <div className="mb-8 flex items-center justify-center gap-3">
        <Label htmlFor="billing-toggle" className={!isAnnual ? 'font-semibold' : ''}>
          Monthly
        </Label>
        <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
        <Label htmlFor="billing-toggle" className={isAnnual ? 'font-semibold' : ''}>
          Annual
          <Badge variant="secondary" className="ml-2">
            Save 20%
          </Badge>
        </Label>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`relative flex flex-col ${
              tier.isPopular ? 'border-primary border-2 shadow-lg' : 'border'
            } ${currentPlanId === tier.id ? 'ring-primary ring-2' : ''}`}
          >
            {tier.isPopular && (
              <Badge className="bg-primary absolute -top-3 left-1/2 -translate-x-1/2">
                <Star className="mr-1 h-3 w-3" />
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">{formatPrice(tier)}</span>
                {!tier.isEnterprise && <span className="text-muted-foreground">/month</span>}
                {isAnnual && !tier.isEnterprise && (
                  <p className="mt-1 text-sm text-green-600">Save ${getAnnualSavings(tier)}/year</p>
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
              {currentPlanId === tier.id ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : tier.isEnterprise ? (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleSelectPlan(tier.id)}
                >
                  Contact Sales
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={tier.isPopular ? 'default' : 'outline'}
                  onClick={() => handleSelectPlan(tier.id)}
                >
                  {currentPlanId ? 'Switch Plan' : 'Get Started'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
