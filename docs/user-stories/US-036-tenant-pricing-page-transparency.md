# US-036: Tenant Pricing Page with Transparency [P1]

**Status**: Approved
**Priority**: P1 (High - Pricing clarity essential for conversion)
**Sprint**: Sprint 2

---

## User Story

**As a** cost-conscious tenant (Maya)
**I want a** clear pricing page explaining what I get for my profile fee and why I pay instead of the landlord
**So that** I can understand the value proposition and not feel like I'm being "nickel-and-dimed"

---

## Context & Background

### Problem Statement

Tenants are used to "free" application processes (even if they pay $50 per application). The value of a one-time fee for unlimited applications needs clear explanation.

### Business Rationale

- **Objection Handling**: Address "why do I pay?" upfront
- **Value Communication**: $54.99 vs $350+ in traditional fees
- **Conversion**: Clear pricing reduces checkout abandonment

### User Perspectives

- **Maya**: "$350 in fees (7 apps x $50) with zero apartments to show for it" vs "$54.99 once, unlimited applications"
- **Bob**: "The fees aren't significant, but the principle bothers me. I have $2M in liquid assets, yet I'm being nickel-and-dimed."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 pricing visitors per month
- **Impact**: 2 (High - conversion critical)
- **Confidence**: 90%
- **Effort**: 1.5 person-weeks

**RICE Score**: (1000 x 2 x 0.9) / 1.5 = **1,200**

### Story Points

**Estimated Effort**: 8 story points (30-40 hours)

---

## Acceptance Criteria

### AC-1: Pricing Page (/pricing)

**Given** tenant views pricing
**When** page loads
**Then** they see tier comparison:

**Basic Profile ($39.99)**:

- Credit report (TransUnion)
- Basic background check
- 60-day validity
- Unlimited applications
- Email support

**Premium Profile ($54.99)**:

- Everything in Basic
- Full criminal background check
- Eviction history search
- Income verification (Plaid)
- 90-day validity
- Priority support

**Group Application ($99.99)**:

- Everything in Premium
- 2-4 roommate profiles
- Shared household screening
- 90-day validity

**Verification**:

- [ ] Tiers clearly compared
- [ ] Features listed
- [ ] "Best Value" indicator

### AC-2: Cost Comparison Section

**Given** need to show value
**When** comparison displayed
**Then** tenant sees:

**Traditional Cost Breakdown**:

- "$50 per application x 5 applications = $250"
- "$25 credit report x 5 = $125"
- "Total: $375+"

**ApartmentDibs Cost**:

- "$54.99 once = unlimited applications"
- "Savings: $320+"

**Visual**: Side-by-side comparison chart

**Verification**:

- [ ] Math is clear
- [ ] Visual comparison compelling
- [ ] Savings highlighted

### AC-3: "Why Do I Pay?" Transparency Section

**Given** common objection
**When** explanation displayed
**Then** tenant sees:

**Heading**: "Why do tenants pay for screening?"

**Explanation**:

- Traditional: Landlord pays -> landlord chooses company -> landlord sets criteria
- ApartmentDibs: Tenant pays -> tenant owns profile -> tenant controls data -> fairer evaluation

**Benefits**:

- Reuse profile for unlimited applications
- Data stays with you (not scattered)
- Same metrics for all applicants (fair comparison)

**Verification**:

- [ ] Logic explained clearly
- [ ] Benefits compelling
- [ ] Addresses objection

### AC-4: Feature Comparison Table

**Given** detailed comparison needed
**When** viewing table
**Then** rows include:

- Credit report
- Background check
- Income verification
- Profile validity
- Application limit
- Support level

**Columns**: Basic, Premium, Group

**Verification**:

- [ ] All features listed
- [ ] Checkmarks clear
- [ ] Differences obvious

### AC-5: Money-Back Guarantee

**Given** risk reduction needed
**When** displayed
**Then** shows:

- "If your profile is denied by all landlords within 30 days, we'll refund your fee"
- Terms and conditions link

**Verification**:

- [ ] Guarantee prominent
- [ ] Terms accessible
- [ ] Builds confidence

### AC-6: CTA Buttons

**Given** conversion goal
**When** CTAs displayed
**Then** each tier shows:

- "Get Started" -> /register with tier pre-selected

**Additional**:

- "Compare all features" -> scrolls to detail table

**Verification**:

- [ ] CTAs work correctly
- [ ] Tier passed to registration

### AC-7: Cross-Links

**Given** multiple user types
**When** tenant on pricing
**Then** they see:

- "Are you an agent? See Agent Pricing"
- "Are you a landlord? See Landlord Pricing"

**Verification**:

- [ ] Links work correctly

### AC-8: Schema.org Product Markup

**Given** SEO needs
**When** page rendered
**Then** includes:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "ApartmentDibs Premium Profile",
  "description": "Reusable tenant screening profile...",
  "offers": {
    "@type": "Offer",
    "price": 54.99,
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

**Verification**:

- [ ] Valid schema
- [ ] Price shows in search

---

## Technical Implementation Notes

### Route

`app/(public)/pricing/page.tsx`

### Dynamic Pricing

Store prices in database for easy updates

### Stripe Integration

Pre-select tier when user clicks CTA -> checkout with tier ID

### Components

```
components/
  pricing/
    TierCard.tsx             - Individual tier
    ComparisonTable.tsx      - Feature matrix
    CostComparison.tsx       - Savings visual
    TransparencySection.tsx  - Why you pay
    GuaranteeCard.tsx        - Money-back
```

---

## Analytics Tracking

| Event Name          | When Triggered      | Properties      |
| ------------------- | ------------------- | --------------- |
| `pricing_viewed`    | Page loads          | `{source}`      |
| `tier_selected`     | CTA clicked         | `{tier, price}` |
| `comparison_viewed` | Scrolled to table   | `{}`            |
| `why_pay_expanded`  | Transparency viewed | `{}`            |

**Success Metrics**:

- 15% pricing-to-checkout conversion
- 60% Premium tier selection
- <30% bounce rate on pricing page

---

## Edge Cases

- **Can't afford fee**: Consider sliding scale (future)
- **Pricing changes**: Grandfather existing, show "effective date"
- **Competitor cheaper**: Emphasize total savings

---

## Dependencies

### Related Stories

- US-020: Tenant Screening Fees
- US-035: Tenant FAQ

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer, Content Writer
