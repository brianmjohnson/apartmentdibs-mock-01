# US-016: Obfuscated Dashboard (PII Hidden Until Selection) [P0]

**Status**: Approved
**Priority**: P0 (Critical - Core fair housing compliance)
**Sprint**: Sprint 1

---

## User Story

**As a** landlord (David)
**I want to** review applicants without seeing their names, photos, or other personally identifying information
**So that** I make decisions based solely on objective qualifications and eliminate unconscious bias

---

## Context & Background

### Problem Statement

Traditional screening shows full applicant details (name, photo, address) upfront, enabling conscious and unconscious bias based on perceived race, ethnicity, gender, and national origin. This creates legal liability and perpetuates housing discrimination.

### Business Rationale

- **Legal Protection**: Eliminates disparate treatment evidence
- **Fair Housing**: Ensures objective evaluation
- **Core Differentiation**: Central to ApartmentDibs value proposition

### User Pain Point

David's perspective: "I try to be fair, but I know I have biases. If I see a name that sounds foreign, I might unconsciously be more skeptical. I want to be protected from my own biases."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 landlord reviews per month
- **Impact**: 3 (Massive - legal protection, core feature)
- **Confidence**: 100%
- **Effort**: 2 person-weeks

**RICE Score**: (1000 x 3 x 1.0) / 2 = **1,500**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: Pre-Selection Obfuscation

**Given** a landlord reviews applicant profiles
**When** profiles are displayed
**Then** all PII is hidden:
- Name replaced with "Applicant #2847"
- No photo shown
- Address shown as city only
- Employer name hidden (show industry only)

**Verification**:
- [ ] No PII visible in any view
- [ ] Applicant ID consistent across views
- [ ] Cannot reverse-engineer identity

### AC-2: Qualification Metrics Display

**Given** PII is hidden
**When** landlord evaluates applicants
**Then** they see objective metrics only:
- Income-to-rent ratio: 4.1x
- Credit score band: 740-760
- Employment stability: 5+ years
- Rental history: Positive references
- Background check: Pass

**Verification**:
- [ ] All metrics clearly displayed
- [ ] No demographic indicators
- [ ] Sufficient data for decision

### AC-3: Post-Selection PII Reveal

**Given** a landlord selects an applicant
**When** selection is confirmed
**Then** full profile is revealed:
- Name: Maya Chen
- Photo: Professional headshot
- Contact: Email, phone
- Current address: Full address

**Verification**:
- [ ] Reveal only after selection finalized
- [ ] Cannot view and then "undo selection"
- [ ] Reveal logged in audit trail

### AC-4: Personal Note Scrubbing

**Given** applicants can submit personal notes
**When** notes are displayed to landlord
**Then** PII is automatically scrubbed:
- Names, addresses, ages removed
- References to protected characteristics removed
- "I'm a quiet professional" allowed
- "I'm a 28-year-old Hispanic woman" scrubbed

**Verification**:
- [ ] NLP scrubbing works accurately
- [ ] No false positives on legitimate content
- [ ] Original preserved for applicant

### AC-5: Search and Filter Restrictions

**Given** landlord filters applicants
**When** they attempt discriminatory filters
**Then** platform blocks:
- Cannot filter by name patterns
- Cannot sort by anything identifying
- Can only filter by objective criteria

**Verification**:
- [ ] All filter options are objective
- [ ] No workarounds available

---

## Technical Implementation Notes

### Backend Specification

**Obfuscation Layer**: Transform applicant data before sending to landlord

**PII Scrubbing**: NLP-based detection and removal

**Reveal Logic**: Separate endpoint, triggered only after selection

### Frontend Specification

**Components**:
```
components/
  obfuscation/
    ObfuscatedProfile.tsx    - Hidden PII display
    MetricsCard.tsx          - Objective data only
    RevealModal.tsx          - Post-selection reveal
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `obfuscated_profile_viewed` | Landlord sees profile | `{landlordId, applicantId}` |
| `pii_revealed` | Selection made | `{landlordId, applicantId}` |
| `scrubbed_content_displayed` | Personal note filtered | `{applicantId, scrubbedFields}` |

**Success Metrics**:
- 100% of pre-selection views are obfuscated
- <1% of fair housing complaints
- 95%+ landlord satisfaction with data sufficiency

---

## Dependencies

### Blocks
- All landlord review features

### Related Stories
- US-001: PII Anonymization
- US-004: Audit Trail

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer, Frontend Developer
