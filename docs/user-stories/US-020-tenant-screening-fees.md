# US-020: Tenant Screening Fees (Per-Profile Revenue) [P1]

**Status**: Approved
**Priority**: P1 (High - Core tenant revenue stream)
**Sprint**: Sprint 2

---

## User Story

**As a** prospective tenant (Maya)
**I want to** purchase a screening profile tier that matches my needs
**So that** I can get verified and apply to apartments

---

## Context & Background

### Problem Statement

Tenants need to pay for screening to verify their qualifications. The platform needs to make this transparent and fair compared to traditional per-application fees.

### Business Rationale

- **Revenue Model**: Per-profile fees (not per-application)
- **Value Proposition**: $54.99 once vs $250+ for multiple applications
- **Margin**: Credit/background checks cost $15-20, healthy margin on $39.99-$54.99

### Pricing Tiers

- **Basic ($39.99)**: Credit report, basic background, 60-day validity
- **Premium ($54.99)**: Full background, eviction history, income verification, 90-day validity
- **Group ($99.99)**: 2-4 roommates, shared household screening, 90-day validity

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 tenants per month
- **Impact**: 3 (Massive - core revenue)
- **Confidence**: 90%
- **Effort**: 2 person-weeks

**RICE Score**: (1000 x 3 x 0.9) / 2 = **1,350**

### Story Points

**Estimated Effort**: 8 story points (30-40 hours)

---

## Acceptance Criteria

### AC-1: Tier Selection

**Given** a tenant needs a profile
**When** they view pricing
**Then** they see:
- Tier comparison (Basic vs Premium vs Group)
- Features included in each
- Validity period
- "Best Value" indicator

**Verification**:
- [ ] Clear comparison table
- [ ] Benefits clearly stated
- [ ] Money-back guarantee mentioned

### AC-2: Checkout Flow

**Given** tenant selects tier
**When** they checkout via Stripe
**Then**:
- Payment processed
- Profile tier assigned
- Verification services triggered (credit, background)

**Verification**:
- [ ] Payment works
- [ ] Tier activated immediately
- [ ] Third-party services called

### AC-3: Profile Validity Tracking

**Given** profile is purchased
**When** validity approaches expiration
**Then** tenant receives:
- 14-day warning
- 3-day warning
- Option to renew at discount

**Verification**:
- [ ] Expiration tracked correctly
- [ ] Warnings sent
- [ ] Renewal discount applied

### AC-4: Money-Back Guarantee

**Given** guarantee terms (denied by all landlords in 30 days)
**When** tenant requests refund
**Then**:
- Eligibility verified
- Refund processed via Stripe
- Profile remains valid

**Verification**:
- [ ] Eligibility logic correct
- [ ] Refund processed
- [ ] Not abused (limit 1 per user)

### AC-5: Cost Comparison Display

**Given** tenant considers purchase
**When** viewing pricing
**Then** they see:
- Traditional cost: "$50/app x 5 = $250"
- ApartmentDibs: "$54.99 unlimited"
- "Save $195+"

**Verification**:
- [ ] Comparison clearly shown
- [ ] Savings emphasized
- [ ] Builds confidence

---

## Technical Implementation Notes

### Backend Specification

**Stripe One-Time Payment**: Charge for profile tier

**Third-Party Services**: TransUnion (credit), Checkr (background)

### Frontend Specification

**Components**:
```
components/
  tenant/
    ProfilePricing.tsx       - Tier selection
    CostComparison.tsx       - Savings calculator
    ValidityStatus.tsx       - Expiration tracking
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `profile_purchased` | Payment complete | `{tenantId, tier, price}` |
| `profile_renewed` | Renewal purchased | `{tenantId, tier}` |
| `refund_requested` | Guarantee claim | `{tenantId, eligible}` |

**Success Metrics**:
- 60% Premium tier selection
- 2%> refund rate
- $10,000 revenue/month by Month 3

---

## Dependencies

### External Dependencies
- Stripe API
- TransUnion API
- Checkr API

### Related Stories
- US-010: Reusable Profile
- US-012: Adaptive Onboarding

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer
