'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileSearch, UserX, AlertTriangle } from 'lucide-react'

interface PainPoint {
  icon: React.ReactNode
  title: string
  description: string
}

const painPoints: PainPoint[] = [
  {
    icon: <FileSearch className="h-8 w-8 text-blue-500" />,
    title: 'Document Chasing',
    description: '60% of applicants need follow-ups. We automate it.',
  },
  {
    icon: <UserX className="h-8 w-8 text-purple-500" />,
    title: 'Lost Leads',
    description: "Denied applicants disappear. Our CRM recaptures them.",
  },
  {
    icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
    title: 'Compliance Anxiety',
    description: 'Fair Housing violations can cost $25,000+. We prevent them.',
  },
]

export function AgentHero() {
  return (
    <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Close 25% More Leases, Save 20 Hours/Week
          </h1>
          <p className="text-muted-foreground mb-8 text-xl md:text-2xl">
            CRM that converts. Syndication that syncs. Compliance that protects.
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link href="/register?role=agent">Start Free Trial</Link>
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
          <h2 className="mb-8 text-center text-2xl font-bold">Everything You Need</h2>
          <ul className="grid gap-4 text-lg md:grid-cols-2">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">1.</span>
              <span>CRM auto-matching with denied applicants</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">2.</span>
              <span>One-click syndication to 6+ platforms</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">3.</span>
              <span>Unified applicant dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">4.</span>
              <span>Automated compliance protection</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
