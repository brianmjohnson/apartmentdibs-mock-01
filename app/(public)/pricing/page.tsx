'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  X,
  HelpCircle,
  ArrowRight,
  Building2,
  Users,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Pricing tiers data
const pricingTiers = [
  {
    name: 'Starter',
    description: 'Free for Tenants',
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Users,
    popular: false,
    cta: 'Get Started Free',
    ctaLink: '/register?role=tenant',
    features: [
      { text: 'Create verified profile', included: true },
      { text: 'Apply to unlimited listings', included: true },
      { text: '30-day profile validity', included: true },
      { text: 'Basic email support', included: true },
      { text: 'CRM access', included: false },
      { text: 'Auto-syndication', included: false },
      { text: 'Compliance audit trail', included: false },
    ],
  },
  {
    name: 'Professional',
    description: 'For Agents',
    monthlyPrice: 49,
    annualPrice: 39,
    icon: Building2,
    popular: true,
    cta: 'Start Free Trial',
    ctaLink: '/register?role=agent',
    features: [
      { text: 'Unified applicant dashboard', included: true },
      { text: 'CRM access (denied applicants)', included: true },
      { text: 'Auto-syndication to 5 platforms', included: true },
      { text: 'Calendar & scheduling', included: true },
      { text: 'Email support', included: true },
      { text: 'Compliance audit trail', included: false },
      { text: 'Adverse action automation', included: false },
    ],
  },
  {
    name: 'Enterprise',
    description: 'For Landlords & Property Managers',
    monthlyPrice: 199,
    annualPrice: 159,
    icon: Shield,
    popular: false,
    cta: 'Contact Sales',
    ctaLink: '/contact?subject=sales',
    features: [
      { text: 'Everything in Professional', included: true },
      { text: 'Compliance audit trail', included: true },
      { text: 'Adverse action automation', included: true },
      { text: 'Custom screening criteria', included: true },
      { text: 'Priority support', included: true },
      { text: 'Multiple properties', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
  },
]

// Pricing FAQs
const pricingFaqs = [
  {
    question: 'Can I switch plans later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you\'ll be charged the prorated difference. If you downgrade, you\'ll receive credit toward future billing.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes, both Professional and Enterprise plans come with a 14-day free trial. No credit card required to start. You can explore all features before committing.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and ACH bank transfers for annual Enterprise plans. All payments are processed securely through Stripe.',
  },
  {
    question: 'Do you offer discounts for nonprofits or housing authorities?',
    answer: 'Yes! We offer special pricing for nonprofit organizations and public housing authorities. Contact our sales team to learn more about our social impact program.',
  },
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-background border-b-4 border-foreground">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:4px_4px]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Choose the plan that works for you. Tenants always free.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-lg font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative h-8 w-14 rounded-full border-2 border-foreground transition-colors ${
                  isAnnual ? 'bg-primary' : 'bg-muted'
                }`}
                aria-label="Toggle annual billing"
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-background border border-foreground transition-transform ${
                    isAnnual ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual
              </span>
              {isAnnual && (
                <Badge variant="secondary" className="ml-2">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => {
              const Icon = tier.icon
              const price = isAnnual ? tier.annualPrice : tier.monthlyPrice

              return (
                <Card
                  key={tier.name}
                  className={`border-2 border-foreground relative flex flex-col ${
                    tier.popular
                      ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:-mt-4 md:mb-4'
                      : 'hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  } transition-all`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">
                          ${price}
                        </span>
                        {price > 0 && (
                          <span className="text-muted-foreground">/mo</span>
                        )}
                      </div>
                      {isAnnual && price > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Billed annually (${price * 12}/year)
                        </p>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          )}
                          <span className={feature.included ? '' : 'text-muted-foreground'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button
                      className={`w-full border-2 border-foreground ${
                        tier.popular ? '' : 'bg-background text-foreground hover:bg-muted'
                      }`}
                      variant={tier.popular ? 'default' : 'outline'}
                      size="lg"
                      asChild
                    >
                      <Link href={tier.ctaLink}>{tier.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Note */}
      <section className="py-8 bg-muted/30 border-y-2 border-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            All plans include SSL encryption, GDPR compliance, and 99.9% uptime SLA.
            <Link href="/contact" className="text-primary hover:underline ml-2">
              Need a custom plan?
            </Link>
          </p>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pricing Questions
              </h2>
              <p className="text-muted-foreground">
                Common questions about our pricing and plans
              </p>
            </div>
            <Accordion type="single" collapsible className="border-2 border-foreground">
              {pricingFaqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className={index < pricingFaqs.length - 1 ? 'border-b-2 border-foreground' : ''}
                >
                  <AccordionTrigger className="px-6 text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Managing 50+ properties? We offer custom enterprise plans with volume discounts,
            dedicated support, and custom integrations.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="border-2 border-primary-foreground text-lg px-8"
            asChild
          >
            <Link href="/contact?subject=sales">
              Talk to Sales
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
