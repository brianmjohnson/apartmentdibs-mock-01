'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, TrendingDown, Clock } from 'lucide-react'

interface PainPoint {
  icon: React.ReactNode
  title: string
  description: string
}

const painPoints: PainPoint[] = [
  {
    icon: <Shield className="h-8 w-8 text-red-500" />,
    title: 'Compliance Risk',
    description: '50% of landlords violate FCRA. Our audit trail protects you.',
  },
  {
    icon: <TrendingDown className="h-8 w-8 text-orange-500" />,
    title: 'Bad Tenants',
    description: 'Our risk scores predict default with 98% accuracy.',
  },
  {
    icon: <Clock className="h-8 w-8 text-yellow-500" />,
    title: 'Vacancy Costs',
    description: 'Fill 56% faster with verified applicant pool.',
  },
]

export function LandlordHero() {
  return (
    <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Protect Your Investment, Fill Faster
          </h1>
          <p className="text-muted-foreground mb-8 text-xl md:text-2xl">
            Automated compliance. Data-driven screening. Zero lawsuit risk.
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link href="/register?role=landlord">Start Free Trial</Link>
          </Button>
        </div>

        {/* Pain Points */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {painPoints.map((point, index) => (
            <div key={index} className="rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mb-4 flex justify-center">{point.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{point.title}</h3>
              <p className="text-muted-foreground text-sm">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Solution Overview */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold">How We Protect You</h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start gap-3">
              <Shield className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
              <span>Audit trails for every decision</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
              <span>Automated adverse action letters</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
              <span>Risk scores based on 50,000+ data points</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
