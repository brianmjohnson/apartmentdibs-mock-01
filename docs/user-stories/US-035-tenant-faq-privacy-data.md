# US-035: Tenant FAQ with Privacy and Data Questions [P1]

**Status**: Approved
**Priority**: P1 (High - Trust is essential for tenant conversion)
**Sprint**: Sprint 2

---

## User Story

**As a** privacy-conscious tenant (Maya)
**I want a** comprehensive FAQ page answering my questions about how ApartmentDibs handles my personal data
**So that** I can trust the platform before uploading sensitive documents like pay stubs and Social Security numbers

---

## Context & Background

### Problem Statement

Tenants are wary of uploading sensitive financial documents to unknown platforms. Without clear privacy explanations, tenants abandon onboarding.

### Business Rationale

- **Trust Gap**: Must address privacy concerns upfront
- **GDPR/CCPA**: Legal requirement to explain data handling
- **Conversion**: Clear answers reduce abandonment

### User Pain Point

Maya's perspective: "I emailed PDFs with my SSN to 7 different landlords. I have no idea how securely they're storing this."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 FAQ visitors per month
- **Impact**: 2 (High - trust and conversion)
- **Confidence**: 90%
- **Effort**: 2 person-weeks

**RICE Score**: (1000 x 2 x 0.9) / 2 = **900**

### Story Points

**Estimated Effort**: 8 story points (30-40 hours)

---

## Acceptance Criteria

### AC-1: FAQ Page Structure (/faq)

**Given** tenant needs answers
**When** viewing FAQ
**Then** they see categories:
- Privacy & Data Security
- Profile & Verification
- Application Process
- Billing & Fees
- Account Management

**Verification**:
- [ ] Categories logical
- [ ] Navigation easy
- [ ] Mobile-friendly accordion

### AC-2: Privacy & Data Security Questions

**Given** privacy concerns
**When** viewing category
**Then** answers include:

- "How does ApartmentDibs protect my privacy?"
- "Why is my information hidden from landlords?"
- "Is my data secure? Where is it stored?"
- "Who has access to my personal information?"
- "How long do you keep my data?"
- "How do I request my data be deleted?"
- "Do you sell my data to third parties?"

**Verification**:
- [ ] All questions answered
- [ ] Plain language
- [ ] Links to privacy policy

### AC-3: Profile & Verification Questions

**Given** onboarding questions
**When** viewing category
**Then** answers include:

- "How long is my profile valid?"
- "What documents do I need to upload?"
- "How does income verification work?"
- "What if my credit score is low?"

**Verification**:
- [ ] Practical answers
- [ ] Steps clearly explained

### AC-4: Application & Billing Questions

**Given** process questions
**When** viewing categories
**Then** answers include:

- "What happens if I'm denied?"
- "How do I get matched to new listings?"
- "Can I apply to multiple listings at once?"
- "Why do I pay instead of the landlord?"
- "What's included in the profile fee?"
- "Is there a refund policy?"

**Verification**:
- [ ] Process explained
- [ ] Value proposition clear

### AC-5: Schema.org FAQPage Structured Data

**Given** SEO needs
**When** page rendered
**Then** includes:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does ApartmentDibs protect my privacy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your personal information is hidden from landlords until after they select you..."
      }
    }
  ]
}
```

**Verification**:
- [ ] Valid schema
- [ ] Rich results in search

### AC-6: Search Functionality

**Given** many questions
**When** user searches
**Then** they can:
- Filter by keyword
- See "Can't find your answer? Contact support"

**Verification**:
- [ ] Search works
- [ ] Support fallback visible

### AC-7: Cross-Links

**Given** multiple user types
**When** tenant on FAQ
**Then** they see:
- "Are you an agent? Visit Agent FAQ"
- "Are you a landlord? Visit Landlord FAQ"

**Verification**:
- [ ] Links work correctly

---

## Technical Implementation Notes

### Route

`app/(public)/faq/page.tsx`

### Content Storage

Store FAQs in database or MDX for easy updates

### Components

```
components/
  faq/
    FAQCategory.tsx          - Category section
    FAQAccordion.tsx         - Expandable Q&A
    FAQSearch.tsx            - Search filter
    ContactSupport.tsx       - Fallback CTA
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `faq_viewed` | Page loads | `{source}` |
| `question_expanded` | Answer viewed | `{questionId, category}` |
| `faq_searched` | Search used | `{query, results}` |
| `support_clicked` | Contact initiated | `{fromQuestion}` |

**Success Metrics**:
- 80%+ of FAQ visitors find answer (no support ticket)
- Top questions inform product improvements
- Rich snippets in search results

---

## Edge Cases

- **Question not in FAQ**: Contact form at bottom
- **Privacy policy changes**: Update answers, show "Last updated"
- **User doesn't read FAQ**: Surface key points during onboarding

---

## Dependencies

### Related Stories
- US-025: GDPR/CCPA Data Export
- US-036: Tenant Pricing

---

**Last Updated**: 2025-11-19
**Assigned To**: Content Writer, Frontend Developer
