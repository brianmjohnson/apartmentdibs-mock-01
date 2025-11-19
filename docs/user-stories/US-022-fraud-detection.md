# US-022: Fraud Detection (Fake Pay Stubs, Fake References) [P1]

**Status**: Approved
**Priority**: P1 (High - Platform integrity critical)
**Sprint**: Sprint 3

---

## User Story

**As a** landlord (David)
**I want to** have the platform detect fraudulent documents and references
**So that** I don't lease to applicants who misrepresent their qualifications

---

## Context & Background

### Problem Statement

20-30% of rental applications contain some form of misrepresentation. Common fraud includes fake pay stubs, inflated income, fake employer references, and edited bank statements. Landlords cannot easily detect these.

### Business Rationale

- **Trust**: Verified documents are core value proposition
- **Risk Reduction**: Fraud leads to defaults and evictions
- **Differentiation**: Automated fraud detection is rare

### User Pain Point

"I had a tenant submit pay stubs that looked legitimate but turned out to be from a fake company. I only found out when they couldn't pay rent."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 applications per month
- **Impact**: 2 (High - fraud prevention)
- **Confidence**: 70%
- **Effort**: 4 person-weeks

**RICE Score**: (500 x 2 x 0.7) / 4 = **175**

### Story Points

**Estimated Effort**: 21 story points (80-100 hours)

---

## Acceptance Criteria

### AC-1: Document Analysis

**Given** applicant uploads pay stubs
**When** processed by fraud detection
**Then** system checks:

- Document metadata (creation date, software used)
- Font consistency
- Math accuracy (net = gross - deductions)
- Employer verification against business databases

**And** flags: "High confidence" vs "Manual review needed"

**Verification**:

- [ ] PDF metadata analyzed
- [ ] OCR extracts values for validation
- [ ] Employer cross-referenced

### AC-2: Reference Verification

**Given** applicant provides references
**When** references are contacted
**Then** platform:

- Sends structured questionnaire
- Verifies employer via phone/email
- Cross-references with LinkedIn/business registries
- Flags inconsistencies

**Verification**:

- [ ] Automated questionnaire sent
- [ ] Business verification works
- [ ] Suspicious patterns flagged

### AC-3: Income Verification via Plaid

**Given** applicant uses Plaid for income
**When** bank account connected
**Then** platform:

- Verifies deposits match stated income
- Checks transaction patterns
- Confirms employer direct deposits
- Flags cash-only income

**Verification**:

- [ ] Plaid integration works
- [ ] Income calculated from deposits
- [ ] Discrepancies flagged

### AC-4: Fraud Risk Score

**Given** verification checks complete
**When** risk is assessed
**Then** applicant receives:

- Verification confidence score
- List of verified vs unverified items
- Flags for manual review

**Verification**:

- [ ] Score calculated
- [ ] Clear breakdown provided
- [ ] Manual review queue works

### AC-5: Manual Review Queue

**Given** documents flagged for review
**When** support team investigates
**Then** they can:

- View flagged items
- Request additional documents
- Approve or reject
- Note findings

**Verification**:

- [ ] Admin queue functions
- [ ] Actions logged
- [ ] Applicant notified

---

## Technical Implementation Notes

### Backend Specification

**PDF Analysis**: Extract metadata, OCR text, validate math

**Employer Verification**: Cross-reference with D&B, LinkedIn

**Plaid Integration**: Read-only bank access

### Frontend Specification

**Components**:

```
components/
  fraud/
    VerificationStatus.tsx   - Check results
    FraudRiskBadge.tsx       - Risk indicator
    ManualReviewQueue.tsx    - Admin interface
```

---

## Analytics Tracking

| Event Name                | When Triggered   | Properties                           |
| ------------------------- | ---------------- | ------------------------------------ |
| `document_analyzed`       | Upload processed | `{applicantId, docType, confidence}` |
| `fraud_flagged`           | Issue detected   | `{applicantId, issueType}`           |
| `manual_review_completed` | Admin reviewed   | `{applicantId, decision}`            |

**Success Metrics**:

- 95%+ fraud detection accuracy
- <5% false positive rate
- 50% reduction in fraudulent applications

---

## Dependencies

### External Dependencies

- Plaid API
- Business verification service (D&B, Experian)

### Related Stories

- US-023: Identity Verification

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer, Data Engineer
