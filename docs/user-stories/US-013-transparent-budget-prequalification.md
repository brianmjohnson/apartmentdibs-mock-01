# US-013: Transparent Budget Pre-Qualification [P2]

**Status**: Approved
**Priority**: P2 (Medium - Improves user experience)
**Sprint**: Sprint 3

---

## User Story

**As a** prospective tenant (Maya)
**I want to** know if I qualify for a listing before I apply
**So that** I don't waste time applying to apartments outside my budget or qualifications

---

## Context & Background

### Problem Statement

Tenants apply to apartments without knowing if they meet basic criteria, wasting time for both tenant and landlord. When rejected, they don't understand why, leading to frustration and distrust.

### Business Rationale

- **Efficiency**: Fewer unqualified applications to process
- **User Trust**: Transparency builds confidence
- **Conversion**: Qualified applicants more likely to complete

### User Pain Point

"I applied to 5 apartments and got rejected by all of them. No one told me I needed 40x rent income in NYC. I only make 35x."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 tenants per month
- **Impact**: 1.5 (Medium - UX improvement)
- **Confidence**: 80%
- **Effort**: 1.5 person-weeks

**RICE Score**: (1000 x 1.5 x 0.8) / 1.5 = **800**

### Story Points

**Estimated Effort**: 8 story points (30-40 hours)

---

## Acceptance Criteria

### AC-1: Pre-Qualification Quiz

**Given** a tenant browses listings without a profile
**When** they access pre-qualification
**Then** they can answer:
- "What's your annual income?"
- "What's your estimated credit score range?"
- "Do you have eviction history?"

**And** receive: "Based on your answers, you qualify for apartments up to $X/month"

**Verification**:
- [ ] Calculator uses standard formulas (3x-4x income)
- [ ] Results clearly explain qualification
- [ ] Prompts to create profile for accurate assessment

### AC-2: Listing Match Indicator

**Given** a tenant has income/credit info (from profile or quiz)
**When** they view a listing
**Then** they see qualification status:
- Green check: "You meet all requirements"
- Yellow warning: "You meet most requirements. Credit score below threshold."
- Red X: "You don't meet income requirement (2.8x vs 3.0x required)"

**Verification**:
- [ ] Indicator shows on all listings
- [ ] Specific gap identified
- [ ] Suggestions provided (e.g., "Consider a co-signer")

### AC-3: Hard vs Soft Criteria Display

**Given** a listing has screening criteria
**When** a tenant views the listing
**Then** they see:
- **Hard criteria**: "Minimum 3.0x income, 680+ credit, no evictions in 7 years"
- **Soft criteria**: "Prefers 12-month lease, move-in within 30 days"

**Verification**:
- [ ] Criteria clearly categorized
- [ ] Hard criteria marked as requirements
- [ ] Soft criteria marked as preferences

### AC-4: Qualification Improvement Tips

**Given** a tenant doesn't meet criteria
**When** they see the gap
**Then** they receive suggestions:
- "Offer a co-signer to meet income requirement"
- "Pay extra security deposit to offset credit score"
- "Look at listings with lower requirements"

**Verification**:
- [ ] Tips are actionable
- [ ] Alternative listings suggested
- [ ] Co-signer flow available

---

## Technical Implementation Notes

### Backend Specification

**Qualification Engine**: Compare profile data against listing criteria

**Formula**: `qualifies = (income >= rent * ratio) && (credit >= minimum)`

### Frontend Specification

**Components**:
```
components/
  qualification/
    PreQualQuiz.tsx          - Budget calculator
    QualificationBadge.tsx   - Match indicator
    ImprovementTips.tsx      - Suggestions
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `prequal_completed` | Quiz submitted | `{userId, maxBudget}` |
| `qualification_viewed` | Badge seen on listing | `{listingId, qualified}` |
| `tip_clicked` | Improvement tip accessed | `{userId, tipType}` |

**Success Metrics**:
- 80% of applications are from qualified tenants
- 25% reduction in unqualified applications
- 90%+ of users find pre-qual helpful (survey)

---

## Dependencies

### Blocked By
- US-010: Reusable Profile (for accurate assessment)

### Related Stories
- US-012: Adaptive Onboarding

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer
