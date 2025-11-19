# US-021: Landlord Compliance Tier (Per-Listing Revenue) [P1]

**Status**: Approved
**Priority**: P1 (High - Landlord revenue stream)
**Sprint**: Sprint 3

---

## User Story

**As a** landlord (David)
**I want to** subscribe to a compliance tier that protects me from fair housing lawsuits
**So that** I get audit trails, adverse action automation, and peace of mind

---

## Context & Background

### Problem Statement

Landlords need compliance protection but don't want ongoing agent subscriptions. They prefer per-listing or annual compliance coverage that gives them legal protection.

### Business Rationale

- **Revenue Model**: Annual subscription or per-listing fee
- **Value Proposition**: $249/year vs $5,000+ attorney retainer
- **Upsell**: Concierge tier for technology-averse landlords

### Pricing Tiers

- **Free**: 1 listing, basic screening, email support
- **Compliance ($249/year)**: Unlimited listings, full audit trail, adverse action automation, risk scores, priority support
- **Concierge ($499/year + $99/listing)**: Everything in Compliance + phone support, white-glove onboarding

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 300 landlords per month
- **Impact**: 2 (High - legal protection)
- **Confidence**: 80%
- **Effort**: 2 person-weeks

**RICE Score**: (300 x 2 x 0.8) / 2 = **240**

### Story Points

**Estimated Effort**: 8 story points (30-40 hours)

---

## Acceptance Criteria

### AC-1: Tier Selection

**Given** a landlord views pricing
**When** comparing tiers
**Then** they see:
- Free vs Compliance vs Concierge
- Features per tier
- ROI calculator showing savings
- "Protect Your Investment" messaging

**Verification**:
- [ ] Clear tier comparison
- [ ] ROI calculator works
- [ ] Appropriate messaging

### AC-2: Compliance Features Gating

**Given** landlord on Free tier
**When** they try to access compliance features
**Then** they see upgrade prompt:
- "Audit trail available with Compliance tier"
- "Upgrade to access risk scores"

**Verification**:
- [ ] Features properly gated
- [ ] Upgrade path clear
- [ ] Trial option if applicable

### AC-3: ROI Calculator

**Given** landlord evaluating pricing
**When** they use calculator
**Then** they input:
- Number of units
- Average rent
- Current vacancy rate

**And** receive:
- "Annual savings: $53,500 (attorney fees + reduced vacancy)"

**Verification**:
- [ ] Calculator accurate
- [ ] Assumptions explained
- [ ] Compelling output

### AC-4: Annual Subscription

**Given** landlord subscribes to Compliance
**When** billed annually
**Then**:
- $249 charged
- All compliance features unlocked
- Renewal reminder at 11 months

**Verification**:
- [ ] Annual billing works
- [ ] Features active for full year
- [ ] Renewal flow works

### AC-5: Concierge Add-On

**Given** landlord wants Concierge
**When** they subscribe
**Then**:
- $499/year + $99 per active listing
- Account manager assigned
- Phone support activated

**Verification**:
- [ ] Per-listing charge works
- [ ] Account manager assigned
- [ ] Support routing updated

---

## Technical Implementation Notes

### Backend Specification

**Stripe Subscription**: Annual recurring

**Usage-Based Billing**: Per-listing for Concierge

**Feature Flags**: Control access by tier

### Frontend Specification

**Components**:
```
components/
  landlord/
    LandlordPricing.tsx      - Tier comparison
    ROICalculator.tsx        - Savings estimate
    ComplianceGate.tsx       - Feature restriction
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `landlord_subscribed` | Subscription started | `{landlordId, tier, price}` |
| `compliance_feature_gated` | Free user blocked | `{landlordId, feature}` |
| `roi_calculated` | Calculator used | `{landlordId, estimatedSavings}` |

**Success Metrics**:
- 30% of landlords on paid tier
- 70% annual retention
- $5,000 MRR from landlords by Month 6

---

## Dependencies

### Blocked By
- US-002: Adverse Action (compliance feature)
- US-004: Audit Trail (compliance feature)

### External Dependencies
- Stripe API

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer
