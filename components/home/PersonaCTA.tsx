'use client'

import Link from 'next/link'
import { Shield, Clock, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function PersonaCTA() {
  const handleCTAClick = (ctaType: 'landlord' | 'agent', destination: string) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('cta_clicked', {
        ctaType,
        destination,
      })
    }
  }

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          Built for Everyone in the Rental Process
        </h2>
        <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center">
          Whether you&apos;re managing properties or representing clients, we&apos;ve got you
          covered
        </p>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* For Landlords */}
          <Card className="border-foreground border-2 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">For Landlords</CardTitle>
              <CardDescription className="text-foreground text-lg font-medium">
                Protect Your Investment, Fill Faster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">&#x2713;</span>
                  Audit trails for compliance protection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">&#x2713;</span>
                  Risk scores for tenant quality assessment
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">&#x2713;</span>
                  56% faster time-to-fill
                </li>
              </ul>

              {/* Testimonial */}
              <div className="bg-muted/50 border-border mt-4 rounded-md border p-4">
                <div className="flex items-start gap-2">
                  <Quote className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-sm italic">
                      &quot;The audit trail is bulletproof. I sleep better knowing I&apos;m
                      protected from lawsuits.&quot;
                    </p>
                    <p className="mt-2 text-xs font-medium">David R., Property Owner</p>
                  </div>
                </div>
              </div>

              <Button
                className="border-foreground mt-4 w-full border-2"
                asChild
                onClick={() => handleCTAClick('landlord', '/for-landlords')}
              >
                <Link href="/for-landlords">Get Started as Landlord</Link>
              </Button>
            </CardContent>
          </Card>

          {/* For Agents */}
          <Card className="border-foreground border-2 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">For Agents</CardTitle>
              <CardDescription className="text-foreground text-lg font-medium">
                Close 25% More Leases, Save 20 Hours/Week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">&#x2713;</span>
                  CRM auto-matching with verified applicants
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">&#x2713;</span>
                  One-click syndication to all platforms
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">&#x2713;</span>
                  Unified dashboard for all properties
                </li>
              </ul>

              {/* Testimonial */}
              <div className="bg-muted/50 border-border mt-4 rounded-md border p-4">
                <div className="flex items-start gap-2">
                  <Quote className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-sm italic">
                      &quot;I close 25% more leases now. The CRM auto-matching is a game
                      changer.&quot;
                    </p>
                    <p className="mt-2 text-xs font-medium">Jessica L., Licensed Agent</p>
                  </div>
                </div>
              </div>

              <Button
                className="border-foreground mt-4 w-full border-2"
                asChild
                onClick={() => handleCTAClick('agent', '/for-agents')}
              >
                <Link href="/for-agents">Get Started as Agent</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
