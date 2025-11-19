'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  onQuestionExpand?: (question: string) => void
}

export function FAQAccordion({ items, onQuestionExpand }: FAQAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      onValueChange={(value) => {
        if (value && onQuestionExpand) {
          const item = items.find((_, index) => `item-${index}` === value)
          if (item) {
            onQuestionExpand(item.question)
          }
        }
      }}
    >
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

// Pre-defined FAQ sets for different pages
export const landlordFAQs: FAQItem[] = [
  {
    question: 'How does the audit trail protect me from lawsuits?',
    answer:
      'Every decision you make is logged with timestamps, criteria used, and applicant data. If you ever face a discrimination claim, you can show exactly what objective criteria were applied equally to all applicants.',
  },
  {
    question: "What if I don't know Fair Housing laws?",
    answer:
      'Our platform automatically prevents you from using illegal screening criteria. We block questions about familial status, disability, and other protected classes, and alert you if your criteria might be problematic in your jurisdiction.',
  },
  {
    question: 'How do risk scores work?',
    answer:
      'Risk scores are calculated using 50,000+ data points including credit history, eviction records, income verification, and rental history. Higher scores indicate lower default risk, but you always make the final decision.',
  },
  {
    question: 'Can I use my own lease template?',
    answer:
      'Yes! You can upload your own lease templates and we will auto-populate them with tenant information. We also offer state-specific templates that are kept up-to-date with local regulations.',
  },
  {
    question: 'What happens when a tenant is denied?',
    answer:
      'We automatically generate and send adverse action letters as required by FCRA. These letters explain the denial reason, provide credit bureau contact information, and ensure you stay compliant.',
  },
  {
    question: 'How long does screening take?',
    answer:
      "Most screens complete within minutes. Tenants who have pre-verified their profile can apply instantly, and you'll see their complete background check, credit report, and income verification immediately.",
  },
  {
    question: 'Is my tenant data secure?',
    answer:
      'Yes. We use bank-level encryption, are SOC 2 Type II compliant, and never share data with third parties. Tenant PII is only revealed after you select them for further consideration.',
  },
  {
    question: 'Can I screen multiple applicants at once?',
    answer:
      'Absolutely. Our dashboard lets you compare multiple applicants side-by-side using objective criteria, making it easy to select the best qualified tenant fairly and efficiently.',
  },
  {
    question: 'What if I manage properties in multiple states?',
    answer:
      'Our compliance engine automatically applies the correct regulations for each property location. We track rules in all 50 states and major municipalities.',
  },
  {
    question: 'How do I get support?',
    answer:
      'Free tier users get email support. Compliance tier gets priority email with 24-hour response. Concierge tier gets phone support and a dedicated account manager.',
  },
]

export const agentFAQs: FAQItem[] = [
  {
    question: 'How does CRM auto-matching work?',
    answer:
      "When an applicant is denied for one property, our CRM automatically matches them with your other listings they qualify for. You'll get notified of these warm leads, and can reach out with one tap.",
  },
  {
    question: 'Which platforms do you syndicate to?',
    answer:
      'We syndicate to Zillow, Trulia, HotPads, Apartments.com, Realtor.com, and Facebook Marketplace. Professional and Enterprise tiers get all platforms; Starter gets Zillow only.',
  },
  {
    question: 'Can my team share a subscription?',
    answer:
      'Enterprise plans support multi-agent teams with shared listings, lead pools, and consolidated billing. Each agent gets their own login with role-based permissions.',
  },
  {
    question: 'How do I transfer existing listings?',
    answer:
      "We offer free migration assistance. Send us your current listing spreadsheet or connect your existing platform, and we'll import everything within 24 hours.",
  },
  {
    question: 'Is there a mobile app?',
    answer:
      'Yes! Our mobile app lets you manage listings, respond to leads, and communicate with applicants on the go. Available for iOS and Android.',
  },
  {
    question: 'How does one-click syndication work?',
    answer:
      'Create your listing once in our platform, and we automatically push it to all connected platforms. When you update details or mark it rented, all platforms sync instantly.',
  },
  {
    question: 'What analytics do you provide?',
    answer:
      'Track views, inquiries, applications, and conversions for each listing. See which platforms perform best, average days on market, and lead quality scores.',
  },
  {
    question: 'How do you help with compliance?',
    answer:
      'We prevent discriminatory screening criteria, generate required adverse action letters, and maintain audit trails for every decision. This protects you from Fair Housing complaints.',
  },
  {
    question: 'Can I customize my public profile?',
    answer:
      'Yes. Your public profile shows your photo, bio, specialties, listings, and performance metrics. It acts as a marketing page for you that tenants can find in search.',
  },
  {
    question: 'What is the cancellation policy?',
    answer:
      'Cancel anytime. Monthly plans stop at the end of your billing period. Annual plans can be refunded pro-rata within 30 days, after which they continue until expiration.',
  },
]
