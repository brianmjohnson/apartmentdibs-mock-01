'use client'

import Link from 'next/link'
import { HelpCircle, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// FAQ data organized by category
const faqData = {
  general: [
    {
      question: 'What is ApartmentDibs?',
      answer: 'ApartmentDibs is a fair-housing compliant rental platform that connects verified tenants with landlords and agents. We provide portable screening reports, objective evaluation criteria, and complete audit trails to make renting fair, fast, and compliant for everyone.',
    },
    {
      question: 'How does fair housing compliance work?',
      answer: 'Our platform ensures fair housing compliance through several mechanisms: PII obfuscation hides protected characteristics during initial review, objective screening criteria ensure consistent evaluation, automated adverse action letters meet legal requirements, and complete audit trails document every decision. This protects landlords from discrimination claims while ensuring tenants are evaluated fairly.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use bank-level encryption (AES-256) for all data at rest and in transit. We\'re SOC 2 Type II certified, GDPR compliant, and undergo regular third-party security audits. Your personal information is never sold to third parties, and you control who sees your screening report.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach our support team via email at support@apartmentdibs.com, through our contact form, or by phone at (555) 123-4567 during business hours (Mon-Fri 9AM-6PM PST). Premium and Enterprise users also have access to priority support channels.',
    },
    {
      question: 'Is ApartmentDibs available in my area?',
      answer: 'We\'re currently available in 25+ major cities across the United States, with more launching every month. Enter your city or ZIP code on our homepage to see available listings in your area. Don\'t see your city? Sign up to be notified when we launch there.',
    },
    {
      question: 'How is ApartmentDibs different from other rental platforms?',
      answer: 'Unlike traditional platforms, we focus on fairness and compliance. Tenants create one verified profile that works everywhere, eliminating repeated fees. Landlords get pre-screened applicants with complete audit trails. Everyone benefits from objective, legally-compliant evaluation criteria.',
    },
  ],
  tenants: [
    {
      question: 'How do I create a verified profile?',
      answer: 'Creating a profile is easy: 1) Sign up with your email, 2) Complete the application form with your rental history, employment, and income information, 3) Authorize a background check (we use TransUnion), 4) Verify your income through our secure bank connection or document upload. The entire process takes about 15 minutes.',
    },
    {
      question: 'What\'s included in the screening report?',
      answer: 'Your screening report includes: credit score and summary, criminal background check, eviction history, income verification, employment verification, and rental history. Landlords see a standardized summary without access to protected characteristics like race, national origin, or familial status.',
    },
    {
      question: 'Can I apply to multiple apartments?',
      answer: 'Yes! That\'s one of the main benefits of ApartmentDibs. Once your profile is verified, you can apply to unlimited listings with just one click. No more filling out the same forms repeatedly or paying multiple application fees.',
    },
    {
      question: 'What if I\'m denied?',
      answer: 'If you\'re denied, you\'ll receive an adverse action letter explaining the specific reasons based on the landlord\'s objective criteria. You also have access to your full screening report and can dispute any errors. Many tenants find success with other properties that have different criteria.',
    },
    {
      question: 'How long is my profile valid?',
      answer: 'Your verified profile is valid for 30 days from the date of your background check. After that, you can renew it for free to update your information and run a fresh background check. This ensures landlords always see current information.',
    },
    {
      question: 'How much does it cost for tenants?',
      answer: 'ApartmentDibs is completely free for tenants. We don\'t charge application fees, screening fees, or any hidden costs. Landlords pay for the platform, and we believe tenants shouldn\'t have to pay to prove they\'re qualified.',
    },
    {
      question: 'Can I see what landlords see in my profile?',
      answer: 'Yes! You have full access to your own screening report and can see exactly what landlords will see. You can also add additional documents like letters of recommendation, proof of savings, or explanation letters for any items on your report.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'You can update most profile information anytime by logging into your account. For verified information (income, employment, background check), you\'ll need to re-verify to ensure accuracy. This keeps your profile current for landlords.',
    },
  ],
  agents: [
    {
      question: 'How do I list properties on ApartmentDibs?',
      answer: 'After creating an Agent account, you can list properties in minutes: 1) Click "Add Listing" from your dashboard, 2) Enter property details, photos, and amenities, 3) Set your screening criteria (income requirements, credit score, etc.), 4) Publish. Our auto-syndication will also post to partner platforms.',
    },
    {
      question: 'What is the CRM and how does it work?',
      answer: 'Our CRM (Customer Relationship Management) tool helps you manage all applicants, including those who didn\'t qualify for a particular property. You can track communications, schedule showings, set reminders, and match past applicants to new listings. It\'s your personal database of qualified renters.',
    },
    {
      question: 'How does auto-syndication work?',
      answer: 'When you publish a listing on ApartmentDibs, we automatically syndicate it to up to 5 partner platforms (like Zillow, Apartments.com, etc.) based on your plan. All applications flow back into your unified dashboard, so you manage everything in one place.',
    },
    {
      question: 'What are the compliance features?',
      answer: 'Our compliance features include: PII obfuscation (hide photos, names, and protected characteristics during initial review), standardized screening criteria, automated adverse action letters, and complete audit trails. These protect you from fair housing violations while speeding up your workflow.',
    },
    {
      question: 'How do I schedule showings?',
      answer: 'Our built-in calendar lets you set available showing times for each property. Interested tenants can book directly, and you\'ll receive notifications. You can also send bulk invitations to qualified applicants. Integrations with Google Calendar and Outlook keep everything synced.',
    },
    {
      question: 'Can I use my own screening criteria?',
      answer: 'Yes, but with guardrails. You can set minimum credit scores, income-to-rent ratios, and other objective criteria. Our system ensures your criteria comply with fair housing laws and are applied consistently to all applicants. Enterprise users can create custom criteria with legal review.',
    },
    {
      question: 'How quickly can I fill vacancies?',
      answer: 'On average, our agents fill vacancies 50% faster than traditional methods. With pre-verified applicants, automated scheduling, and streamlined workflows, you can go from listing to signed lease in as little as 7 days.',
    },
    {
      question: 'What support is available for agents?',
      answer: 'Professional plan includes email support with 24-hour response time. We also offer a knowledge base, video tutorials, and monthly webinars. Enterprise users get priority phone support and a dedicated account manager.',
    },
  ],
  landlords: [
    {
      question: 'How do I review applicants?',
      answer: 'Applicants appear in your dashboard with their verified screening reports. Initially, you see an anonymized version without photos or names to ensure fair evaluation. You can compare applicants side-by-side, and once you select finalists, you can reveal full profiles and contact them directly.',
    },
    {
      question: 'What is PII obfuscation?',
      answer: 'PII (Personally Identifiable Information) obfuscation hides protected characteristics during initial review. Applicant photos, names, and other identifying details are hidden until you\'ve evaluated their qualifications. This helps prevent unconscious bias and protects you from discrimination claims.',
    },
    {
      question: 'How are adverse action letters generated?',
      answer: 'When you decline an applicant, our system automatically generates a legally-compliant adverse action letter. It includes the specific reasons for denial based on your screening criteria, credit bureau information if applicable, and the applicant\'s rights. This satisfies FCRA and state requirements.',
    },
    {
      question: 'What\'s included in the audit trail?',
      answer: 'The audit trail documents every decision: when you viewed applications, what criteria you used, which applicants you approved or denied, and why. This creates a complete record that demonstrates fair housing compliance if ever questioned by regulators or in litigation.',
    },
    {
      question: 'Can I manage multiple properties?',
      answer: 'Yes! Enterprise plan supports unlimited properties with portfolio-level analytics. You can set different criteria per property, assign team members to specific buildings, and see vacancy rates and performance metrics across your entire portfolio.',
    },
    {
      question: 'How do I set screening criteria?',
      answer: 'In your property settings, you define objective criteria: minimum credit score, income-to-rent ratio (typically 2.5-3x), maximum debt-to-income ratio, eviction history limits, etc. Our system checks criteria against fair housing laws and applies them consistently to all applicants.',
    },
    {
      question: 'What integrations are available?',
      answer: 'We integrate with popular property management software (Yardi, AppFolio, Buildium), accounting tools (QuickBooks), and communication platforms. Enterprise users can also access our API for custom integrations with their existing tech stack.',
    },
    {
      question: 'How does ApartmentDibs protect me legally?',
      answer: 'Our platform protects you through: objective, consistently-applied screening criteria; PII obfuscation to prevent bias; automated adverse action letters that meet legal requirements; and complete audit trails documenting fair treatment. Combined, these significantly reduce fair housing liability.',
    },
  ],
}

export default function FAQPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-background border-b-4 border-foreground">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:4px_4px]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 bg-primary text-primary-foreground flex items-center justify-center">
                <HelpCircle className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about ApartmentDibs
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Tabs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 h-auto p-1 border-2 border-foreground bg-muted">
                <TabsTrigger
                  value="general"
                  className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-none border-2 border-transparent data-[state=active]:border-foreground"
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="tenants"
                  className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-none border-2 border-transparent data-[state=active]:border-foreground"
                >
                  For Tenants
                </TabsTrigger>
                <TabsTrigger
                  value="agents"
                  className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-none border-2 border-transparent data-[state=active]:border-foreground"
                >
                  For Agents
                </TabsTrigger>
                <TabsTrigger
                  value="landlords"
                  className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-none border-2 border-transparent data-[state=active]:border-foreground"
                >
                  For Landlords
                </TabsTrigger>
              </TabsList>

              {/* General FAQs */}
              <TabsContent value="general" className="mt-8">
                <Accordion type="single" collapsible className="border-2 border-foreground">
                  {faqData.general.map((faq, index) => (
                    <AccordionItem
                      key={`general-${index}`}
                      value={`general-${index}`}
                      className={index < faqData.general.length - 1 ? 'border-b-2 border-foreground' : ''}
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
              </TabsContent>

              {/* Tenant FAQs */}
              <TabsContent value="tenants" className="mt-8">
                <Accordion type="single" collapsible className="border-2 border-foreground">
                  {faqData.tenants.map((faq, index) => (
                    <AccordionItem
                      key={`tenant-${index}`}
                      value={`tenant-${index}`}
                      className={index < faqData.tenants.length - 1 ? 'border-b-2 border-foreground' : ''}
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
              </TabsContent>

              {/* Agent FAQs */}
              <TabsContent value="agents" className="mt-8">
                <Accordion type="single" collapsible className="border-2 border-foreground">
                  {faqData.agents.map((faq, index) => (
                    <AccordionItem
                      key={`agent-${index}`}
                      value={`agent-${index}`}
                      className={index < faqData.agents.length - 1 ? 'border-b-2 border-foreground' : ''}
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
              </TabsContent>

              {/* Landlord FAQs */}
              <TabsContent value="landlords" className="mt-8">
                <Accordion type="single" collapsible className="border-2 border-foreground">
                  {faqData.landlords.map((faq, index) => (
                    <AccordionItem
                      key={`landlord-${index}`}
                      value={`landlord-${index}`}
                      className={index < faqData.landlords.length - 1 ? 'border-b-2 border-foreground' : ''}
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <MessageSquare className="h-12 w-12" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="border-2 border-primary-foreground text-lg px-8"
            asChild
          >
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
