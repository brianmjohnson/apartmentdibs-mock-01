'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Building2 } from 'lucide-react'

interface QualificationRouterProps {
  teamSize?: string
  unitCount?: string
}

export function QualificationRouter({ teamSize, unitCount }: QualificationRouterProps) {
  // Determine if this is a small enough operation to use self-service
  const isSmallTeam = teamSize === '1-4'
  const isSmallPortfolio = unitCount === '1-9' || unitCount === '10-49'
  const shouldRouteSelfService = isSmallTeam || isSmallPortfolio

  if (shouldRouteSelfService) {
    return (
      <Card className="border-primary">
        <CardContent className="py-6">
          <div className="text-center">
            <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <ArrowRight className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Try Our Professional Tier</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Based on your team size, our Professional tier may be the best fit. Start your free
              trial today - no credit card required.
            </p>
            <Button asChild className="w-full">
              <Link href="/register">Start Free Trial</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-muted/50">
      <CardContent className="py-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Enterprise Support</p>
              <p className="text-muted-foreground text-sm">
                Multi-agent teams with dedicated account management
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Custom Pricing</p>
              <p className="text-muted-foreground text-sm">
                Volume discounts and flexible payment terms
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Enterprise benefits component for the demo page
export function EnterpriseFeatures() {
  const features = [
    {
      title: 'Multi-Agent Team Management',
      description: 'Shared listings, lead pools, and role-based permissions for your entire team.',
    },
    {
      title: 'API Access',
      description: 'Integrate with your existing systems using our REST API and webhooks.',
    },
    {
      title: '99.9% Uptime SLA',
      description: 'Enterprise-grade reliability with guaranteed uptime and 24/7 monitoring.',
    },
    {
      title: 'Dedicated Account Manager',
      description: 'A single point of contact for onboarding, training, and ongoing support.',
    },
    {
      title: 'Volume Discounts',
      description: 'Custom pricing based on your portfolio size and team needs.',
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Enterprise Features</h3>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex gap-3">
            <div className="bg-primary mt-1 h-2 w-2 flex-shrink-0 rounded-full" />
            <div>
              <p className="font-medium">{feature.title}</p>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
