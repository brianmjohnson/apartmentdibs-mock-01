# US-015: Data-Driven Risk Scores (Predict Default Probability) [P1]

**Status**: Approved
**Priority**: P1 (High - Core landlord protection value)
**Sprint**: Sprint 3

---

## User Story

**As a** landlord (David)
**I want to** see data-driven risk scores for each applicant that predict default probability
**So that** I can make informed decisions based on objective data instead of gut feelings

---

## Context & Background

### Problem Statement

Landlords rely on basic metrics (credit score, income) without understanding actual default risk. Two applicants with 700 credit scores may have vastly different risk profiles based on employment stability, rental history patterns, and other factors.

### Business Rationale

- **Risk Reduction**: Predict and avoid costly evictions ($5K+ per eviction)
- **Confidence**: Data-backed decisions reduce landlord anxiety
- **Differentiation**: No competitor offers predictive risk scoring

### User Pain Point

David's perspective: "A 700 credit score tells me something, but I've had 700-score tenants default and 650-score tenants be perfect. I need better predictive data."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 landlords per month
- **Impact**: 2 (High - risk reduction)
- **Confidence**: 70%
- **Effort**: 4 person-weeks

**RICE Score**: (500 x 2 x 0.7) / 4 = **175**

### Story Points

**Estimated Effort**: 21 story points (80-100 hours)

---

## Acceptance Criteria

### AC-1: Risk Score Calculation

**Given** an applicant has completed their profile
**When** risk score is calculated
**Then** the score considers:

- Credit score and history
- Income stability (time at job)
- Income-to-rent ratio
- Rental payment history
- Eviction history
- Employment type stability
- Reference quality

**And** outputs: "2% predicted default rate" or "Low risk"

**Verification**:

- [ ] Algorithm uses 50,000+ data points
- [ ] Score updates with profile changes
- [ ] Confidence interval provided

### AC-2: Risk Score Display

**Given** a landlord reviews applicants
**When** they view the dashboard
**Then** each applicant shows:

- Risk score: "Very Low (1.5%)", "Low (3%)", "Moderate (6%)", "High (10%+)"
- Key risk factors: "Positive: 5+ years employment. Negative: Eviction in 2019"
- Comparison to average

**Verification**:

- [ ] Score clearly displayed
- [ ] Factors explained in plain language
- [ ] Visual indicators (color-coded)

### AC-3: Comparative Risk Analysis

**Given** multiple applicants for a listing
**When** landlord compares them
**Then** they see side-by-side risk comparison:

- Applicant A: 2% default risk
- Applicant B: 4% default risk
- Platform recommendation based on risk

**Verification**:

- [ ] Comparison table works
- [ ] Differences highlighted
- [ ] No absolute recommendation (landlord decides)

### AC-4: Risk Score Transparency

**Given** landlord wants to understand score
**When** they click for details
**Then** they see:

- Breakdown of factors
- Weight of each factor
- How applicant compares to population

**Verification**:

- [ ] Full transparency on calculation
- [ ] Avoids "black box" perception
- [ ] Educational content available

### AC-5: Historical Accuracy Tracking

**Given** risk scores are used
**When** lease outcomes are known (6+ months)
**Then** platform tracks:

- Predicted vs actual default rates
- Model accuracy metrics
- Continuous improvement data

**Verification**:

- [ ] Outcome data collected with consent
- [ ] Model accuracy reported
- [ ] Algorithm improved over time

---

## Technical Implementation Notes

### Backend Specification

**ML Model**: Logistic regression or gradient boosting for default prediction

**Training Data**: Historical tenant outcomes (anonymized)

**Feature Engineering**:

- Credit score bands
- Employment tenure
- Income volatility
- Reference sentiment

### Frontend Specification

**Components**:

```
components/
  risk/
    RiskScore.tsx            - Score display
    RiskBreakdown.tsx        - Factor details
    RiskComparison.tsx       - Side-by-side
```

---

## Analytics Tracking

| Event Name                 | When Triggered          | Properties                                  |
| -------------------------- | ----------------------- | ------------------------------------------- |
| `risk_score_viewed`        | Landlord sees score     | `{landlordId, applicantId, score}`          |
| `risk_details_expanded`    | Factor breakdown viewed | `{landlordId, applicantId}`                 |
| `risk_influenced_decision` | Selection made          | `{landlordId, selectedRisk, rejectedRisks}` |

**Success Metrics**:

- 20% reduction in defaults for platform users
- 90%+ landlords find scores helpful
- Model accuracy >85%

---

## Dependencies

### Blocked By

- US-001: PII Anonymization (need profile data)
- US-004: Audit Trail (log score usage)

---

**Last Updated**: 2025-11-19
**Assigned To**: Data Scientist, Backend Developer
