# US-027: Landlord Marketing Hub with Pricing, FAQ, Case Studies [P1]

**Status**: Approved
**Priority**: P1 (High - Key acquisition channel for landlord persona)
**Sprint**: Sprint 2

---

## User Story

**As a** landlord prospect (David or Sandra)
**I want a** dedicated marketing hub that explains how ApartmentDibs protects me from lawsuits, reduces vacancy time, and screens tenants using data
**So that** I can understand the ROI and decide whether to subscribe

---

## Context & Background

### Problem Statement

Landlords are risk-averse and need detailed information before trusting a platform with their properties. Most platforms focus on features, not outcomes.

### Business Rationale

- **Competitor Gap**: Focus on outcomes (compliance protection, faster fills)
- **Trust Building**: Detailed information reduces hesitation
- **Conversion**: Clear ROI drives subscriptions

### User Pain Points

- **David**: "Will this protect me from fair housing lawsuits? What's the audit trail look like?"
- **Sandra**: "Is there someone I can call if I get stuck? I'm not good with technology."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 landlord prospects per month
- **Impact**: 2 (High - acquisition channel)
- **Confidence**: 80%
- **Effort**: 3 person-weeks

**RICE Score**: (500 x 2 x 0.8) / 3 = **266.7**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: Landing Page (/for-landlords)

**Given** landlord visits marketing page
**When** page loads
**Then** they see:

**Hero Section**:
- Headline: "Protect Your Investment, Fill Faster"
- Subheadline: "Automated compliance. Data-driven screening. Zero lawsuit risk."
- CTA: "Start Free Trial" -> /register?role=landlord

**Pain Points (3-Column)**:
- "Compliance Risk" - "50% of landlords violate FCRA. Our audit trail protects you."
- "Bad Tenants" - "Our risk scores predict default with 98% accuracy."
- "Vacancy Costs" - "Fill 56% faster with verified applicant pool."

**Solution Overview**:
- Audit trails for every decision
- Automated adverse action letters
- Risk scores based on 50,000+ data points

**Testimonial**: David Patel quote with photo

**Verification**:
- [ ] Hero section compelling
- [ ] CTAs functional
- [ ] Pain points addressed

### AC-2: Pricing Page (/for-landlords/pricing)

**Given** landlord views pricing
**When** page loads
**Then** they see:

**Tier Comparison Table**:
- Free Tier: 1 listing, basic screening, email support ($0/month)
- Compliance Tier: Unlimited listings, audit trail, adverse action, risk scores, priority support ($249/year)
- Concierge Tier: Everything + phone support, white-glove onboarding ($499/year + $99/listing)

**ROI Calculator**:
- Inputs: Units owned, average rent
- Output: Annual savings estimate

**Money-Back Guarantee**: "30-day refund if not satisfied"

**Verification**:
- [ ] Tier table clear
- [ ] Calculator functional
- [ ] Guarantee displayed

### AC-3: FAQ Page (/for-landlords/faq)

**Given** landlord has questions
**When** viewing FAQ
**Then** they see:
- Schema.org FAQPage structured data
- Minimum 10 questions covering compliance, features, support
- Clear answers in plain language

**Questions Include**:
- "How does the audit trail protect me from lawsuits?"
- "What if I don't know Fair Housing laws?"
- "How do risk scores work?"
- "Can I use my own lease template?"

**Verification**:
- [ ] FAQPage schema implemented
- [ ] Questions comprehensive
- [ ] Answers helpful

### AC-4: Compliance Deep-Dive (/for-landlords/compliance)

**Given** landlord wants compliance details
**When** viewing page
**Then** they see:
- Location-aware compliance rules explanation
- Audit trail walkthrough with screenshots
- Adverse action letter samples
- PDF compliance report generation

**Verification**:
- [ ] Technical details explained
- [ ] Screenshots/samples included
- [ ] Builds confidence

### AC-5: Case Studies (/for-landlords/case-studies)

**Given** landlord wants proof
**When** viewing case studies
**Then** they see:
- Index page with 3-5 preview cards
- Individual case study pages with Problem, Solution, Results, Testimonial
- Schema.org Article markup

**Case Studies**:
- "How David reduced vacancy by 56%"
- "Sandra's first year with concierge service"

**Verification**:
- [ ] Case studies compelling
- [ ] Metrics included
- [ ] SEO markup correct

### AC-6: Demo Request (/for-landlords/demo)

**Given** landlord wants personalized demo
**When** filling out form
**Then** they provide:
- Name, email, phone
- Number of units
- Current challenges (checkboxes)

**And** see:
- Calendly embed for scheduling
- Phone callback option for Sandra-type

**Verification**:
- [ ] Form works correctly
- [ ] Calendar integration functional
- [ ] Lead captured in CRM

---

## Technical Implementation Notes

### Routes

```
app/(public)/for-landlords/page.tsx
app/(public)/for-landlords/pricing/page.tsx
app/(public)/for-landlords/faq/page.tsx
app/(public)/for-landlords/compliance/page.tsx
app/(public)/for-landlords/case-studies/page.tsx
app/(public)/for-landlords/case-studies/[slug]/page.tsx
app/(public)/for-landlords/demo/page.tsx
```

### Frontend Specification

**Components**:
```
components/
  marketing/
    ROICalculator.tsx        - Savings estimate
    TestimonialCard.tsx      - Quote display
    PricingTable.tsx         - Tier comparison
    FAQAccordion.tsx         - Expandable questions
    DemoForm.tsx             - Lead capture
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `landlord_page_viewed` | Page loads | `{page, source}` |
| `roi_calculated` | Calculator used | `{units, savings}` |
| `demo_requested` | Form submitted | `{landlordId}` |

**Success Metrics**:
- 5% visitor-to-demo conversion
- 20% demo-to-signup conversion
- $50 CAC for landlord segment

---

## Dependencies

### Related Stories
- US-021: Landlord Compliance Tier
- US-026: Split Homepage

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer, Content Writer
