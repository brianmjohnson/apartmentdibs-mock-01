'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, HelpCircle, ArrowRight, Building2, Users, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
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
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit toward future billing.",
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer:
      'Yes, both Professional and Enterprise plans come with a 14-day free trial. No credit card required to start. You can explore all features before committing.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express) and ACH bank transfers for annual Enterprise plans. All payments are processed securely through Stripe.',
  },
  {
    question: 'Do you offer discounts for nonprofits or housing authorities?',
    answer:
      'Yes! We offer special pricing for nonprofit organizations and public housing authorities. Contact our sales team to learn more about our social impact program.',
  },
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-background border-foreground relative border-b-4">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:4px_4px]" />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl md:text-2xl">
              Choose the plan that works for you. Tenants always free.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span
                className={`text-lg font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`border-foreground relative h-8 w-14 rounded-full border-2 transition-colors ${
                  isAnnual ? 'bg-primary' : 'bg-muted'
                }`}
                aria-label="Toggle annual billing"
              >
                <div
                  className={`bg-background border-foreground absolute top-1 h-5 w-5 rounded-full border transition-transform ${
                    isAnnual ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span
                className={`text-lg font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}
              >
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
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => {
              const Icon = tier.icon
              const price = isAnnual ? tier.annualPrice : tier.monthlyPrice

              return (
                <Card
                  key={tier.name}
                  className={`border-foreground relative flex flex-col border-2 ${
                    tier.popular
                      ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:-mt-4 md:mb-4'
                      : 'hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  } transition-all`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4 text-center">
                    <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-12 w-12 items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-6 text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">${price}</span>
                        {price > 0 && <span className="text-muted-foreground">/mo</span>}
                      </div>
                      {isAnnual && price > 0 && (
                        <p className="text-muted-foreground mt-1 text-sm">
                          Billed annually (${price * 12}/year)
                        </p>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                          ) : (
                            <X className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
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
                      className={`border-foreground w-full border-2 ${
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
      <section className="bg-muted/30 border-foreground border-y-2 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            All plans include SSL encryption, GDPR compliance, and 99.9% uptime SLA.
            <Link href="/contact" className="text-primary ml-2 hover:underline">
              Need a custom plan?
            </Link>
          </p>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <div className="mb-4 flex items-center justify-center">
                <HelpCircle className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Pricing Questions</h2>
              <p className="text-muted-foreground">Common questions about our pricing and plans</p>
            </div>
            <Accordion type="single" collapsible className="border-foreground border-2">
              {pricingFaqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className={index < pricingFaqs.length - 1 ? 'border-foreground border-b-2' : ''}
                >
                  <AccordionTrigger className="px-6 text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground px-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Need a Custom Solution?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            Managing 50+ properties? We offer custom enterprise plans with volume discounts,
            dedicated support, and custom integrations.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="border-primary-foreground border-2 px-8 text-lg"
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
