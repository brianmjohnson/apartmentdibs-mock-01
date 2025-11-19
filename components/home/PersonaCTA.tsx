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
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Built for Everyone in the Rental Process
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Whether you&apos;re managing properties or representing clients, we&apos;ve got you covered
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* For Landlords */}
          <Card className="border-2 border-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <CardHeader>
              <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">For Landlords</CardTitle>
              <CardDescription className="text-lg font-medium text-foreground">
                Protect Your Investment, Fill Faster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground">
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
              <div className="bg-muted/50 p-4 rounded-md mt-4 border border-border">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  <div>
                    <p className="text-sm italic text-muted-foreground">
                      &quot;The audit trail is bulletproof. I sleep better knowing I&apos;m protected from lawsuits.&quot;
                    </p>
                    <p className="text-xs font-medium mt-2">David R., Property Owner</p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-4 border-2 border-foreground"
                asChild
                onClick={() => handleCTAClick('landlord', '/for-landlords')}
              >
                <Link href="/for-landlords">Get Started as Landlord</Link>
              </Button>
            </CardContent>
          </Card>

          {/* For Agents */}
          <Card className="border-2 border-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <CardHeader>
              <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">For Agents</CardTitle>
              <CardDescription className="text-lg font-medium text-foreground">
                Close 25% More Leases, Save 20 Hours/Week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground">
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
              <div className="bg-muted/50 p-4 rounded-md mt-4 border border-border">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  <div>
                    <p className="text-sm italic text-muted-foreground">
                      &quot;I close 25% more leases now. The CRM auto-matching is a game changer.&quot;
                    </p>
                    <p className="text-xs font-medium mt-2">Jessica L., Licensed Agent</p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-4 border-2 border-foreground"
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
