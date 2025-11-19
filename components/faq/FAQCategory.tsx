'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FAQAccordion, type FAQItem } from '@/components/marketing/FAQAccordion'

interface FAQCategoryProps {
  title: string
  icon?: React.ReactNode
  items: FAQItem[]
  onQuestionExpand?: (question: string) => void
}

export function FAQCategory({ title, icon, items, onQuestionExpand }: FAQCategoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FAQAccordion items={items} onQuestionExpand={onQuestionExpand} />
      </CardContent>
    </Card>
  )
}

// Pre-defined tenant FAQ categories
export const tenantFAQCategories = {
  privacy: {
    title: 'Privacy & Data Security',
    items: [
      {
        question: 'How does ApartmentDibs protect my privacy?',
        answer:
          'Your personal information is hidden from landlords until after they select you for further consideration. We use anonymized profiles showing only qualification data, protecting your identity while letting you apply.',
      },
      {
        question: 'Why is my information hidden from landlords?',
        answer:
          'Hidden profiles protect you from discrimination and ensure fair evaluation based on qualifications, not personal characteristics. Landlords see only objective criteria like income ratio and credit band.',
      },
      {
        question: 'Is my data secure? Where is it stored?',
        answer:
          'Yes. We use bank-level 256-bit encryption, are SOC 2 Type II certified, and store data in secure US data centers with multiple redundancies. Your SSN and sensitive documents are encrypted at rest and in transit.',
      },
      {
        question: 'Who has access to my personal information?',
        answer:
          'Only you and landlords you explicitly authorize can see your full profile. Our staff can only access anonymized data for support purposes. We never share data with advertisers or third parties.',
      },
      {
        question: 'How long do you keep my data?',
        answer:
          'Active profile data is kept for 90 days (or until you delete it). Anonymized analytics are retained longer for service improvement. You can request full deletion at any time under GDPR/CCPA.',
      },
      {
        question: 'How do I request my data be deleted?',
        answer:
          'Go to Settings > Privacy > Delete My Data, or email privacy@apartmentdibs.com. We process deletion requests within 30 days as required by GDPR/CCPA.',
      },
      {
        question: 'Do you sell my data to third parties?',
        answer:
          'No, never. We do not sell, rent, or share your personal information with third parties for marketing purposes. Our revenue comes from subscription fees, not data sales.',
      },
    ],
  },
  profile: {
    title: 'Profile & Verification',
    items: [
      {
        question: 'How long is my profile valid?',
        answer:
          'Basic profiles are valid for 60 days, Premium profiles for 90 days. After expiration, you can renew by updating your information and paying the renewal fee.',
      },
      {
        question: 'What documents do I need to upload?',
        answer:
          'Typically: government ID, 2 recent pay stubs, bank statements, and authorization for background/credit check. Premium profiles also require employment verification through Plaid or employer letter.',
      },
      {
        question: 'How does income verification work?',
        answer:
          "You can connect your bank account via Plaid for instant verification, or upload pay stubs and employer letter. We verify income meets the landlord's requirements (typically 3x monthly rent).",
      },
      {
        question: 'What if my credit score is low?',
        answer:
          'Some landlords accept lower scores with conditions like additional deposit or guarantor. Our matching system shows you listings where you meet the criteria, so you only apply where qualified.',
      },
    ],
  },
  application: {
    title: 'Application Process',
    items: [
      {
        question: 'What happens if I\'m denied?',
        answer:
          'You receive an adverse action notice explaining why. Your profile remains active for other applications. Our CRM can automatically match you to other listings you qualify for.',
      },
      {
        question: 'How do I get matched to new listings?',
        answer:
          'Enable notifications in your profile settings. When new listings match your criteria (neighborhood, price, pets, etc.), you\'ll receive alerts and can apply with one click.',
      },
      {
        question: 'Can I apply to multiple listings at once?',
        answer:
          'Yes! That\'s the main benefit. Your profile works for unlimited applications during its validity period. Apply to as many listings as you want with one click each.',
      },
    ],
  },
  billing: {
    title: 'Billing & Fees',
    items: [
      {
        question: 'Why do I pay instead of the landlord?',
        answer:
          'When you pay, you own and control your profile. You decide who sees it, and it works across all listings. Traditional landlord-paid screening creates fragmented reports you can\'t reuse.',
      },
      {
        question: 'What\'s included in the profile fee?',
        answer:
          'Credit report, background check, identity verification, and unlimited applications for the validity period. Premium adds income verification and eviction history search.',
      },
      {
        question: 'Is there a refund policy?',
        answer:
          'Yes. If your profile is denied by all landlords within 30 days, we refund your fee. If you find a place before using all applications, unused value doesn\'t carry over.',
      },
    ],
  },
  account: {
    title: 'Account Management',
    items: [
      {
        question: 'How do I update my profile?',
        answer:
          'Log in and go to Profile > Edit. You can update most information anytime. Changes to verified information (income, employment) may require re-verification.',
      },
      {
        question: 'Can I share my profile with roommates?',
        answer:
          'Yes! Group applications link multiple profiles for household screening. Each person creates their own profile, then you combine them into a group application.',
      },
      {
        question: 'How do I cancel my account?',
        answer:
          'Go to Settings > Account > Cancel Account. Your data will be deleted within 30 days. Note that purchased profile credits are non-refundable after 30 days.',
      },
    ],
  },
}
