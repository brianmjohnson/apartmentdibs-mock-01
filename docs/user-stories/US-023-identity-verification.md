# US-023: Identity Verification (Liveness Detection, ID Verification) [P1]

**Status**: Approved
**Priority**: P1 (High - Prevents identity fraud)
**Sprint**: Sprint 2

---

## User Story

**As a** landlord (David)
**I want to** know that applicants are who they say they are
**So that** I don't lease to someone using a stolen identity

---

## Context & Background

### Problem Statement

Identity theft in rental applications is increasing. Fraudsters use stolen IDs to secure apartments, then disappear. Landlords have no way to verify the person applying is actually who they claim to be.

### Business Rationale

- **Trust**: Verified identity is foundation of platform trust
- **Legal Compliance**: KYC requirements for some jurisdictions
- **Fraud Prevention**: Prevents identity-based scams

### User Pain Point

"I once leased to someone who used their brother's ID and credit. By the time I found out, they'd trashed the place and skipped town."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 applicants per month
- **Impact**: 2 (High - trust foundation)
- **Confidence**: 90%
- **Effort**: 2 person-weeks

**RICE Score**: (1000 x 2 x 0.9) / 2 = **900**

### Story Points

**Estimated Effort**: 8 story points (30-40 hours)

---

## Acceptance Criteria

### AC-1: Government ID Upload

**Given** applicant needs ID verification
**When** they upload ID
**Then** system accepts:

- Driver's license
- Passport
- State ID

**And** extracts:

- Name, DOB, address
- Photo
- Document number
- Expiration date

**Verification**:

- [ ] OCR extracts data accurately
- [ ] Multiple ID types supported
- [ ] Expired IDs rejected

### AC-2: Liveness Detection

**Given** ID is uploaded
**When** applicant takes selfie
**Then** system performs:

- Face match against ID photo
- Liveness check (not a photo of a photo)
- Multiple angles if needed

**Verification**:

- [ ] Face comparison works
- [ ] Prevents photo spoofing
- [ ] Clear instructions provided

### AC-3: Document Authenticity

**Given** ID is uploaded
**When** analyzed
**Then** system checks:

- Security features (holograms, patterns)
- Font and format consistency
- Barcode/MRZ validation

**Verification**:

- [ ] Authenticity checks run
- [ ] Fakes detected
- [ ] Confidence score provided

### AC-4: Verification Badge

**Given** identity is verified
**When** profile displays
**Then** landlord sees:

- "Identity Verified" badge
- Verification date
- Method used

**Verification**:

- [ ] Badge displays correctly
- [ ] Inspection shows details
- [ ] Non-verified clearly marked

### AC-5: Privacy and Data Handling

**Given** sensitive ID data is collected
**When** stored and used
**Then** platform:

- Encrypts at rest (AES-256)
- Auto-deletes after 90 days
- Only shows to verified parties
- GDPR/CCPA compliant

**Verification**:

- [ ] Encryption implemented
- [ ] Auto-deletion works
- [ ] Access controls enforced

---

## Technical Implementation Notes

### Backend Specification

**Identity Service**: Onfido, Persona, or Stripe Identity

**Data Retention**: 90-day auto-deletion policy

**Storage**: Encrypted, separate from main database

### Frontend Specification

**Components**:

```
components/
  identity/
    IDUpload.tsx             - Document capture
    SelfieCapture.tsx        - Liveness check
    VerificationBadge.tsx    - Status display
```

---

## Analytics Tracking

| Event Name           | When Triggered     | Properties               |
| -------------------- | ------------------ | ------------------------ |
| `id_uploaded`        | Document submitted | `{applicantId, idType}`  |
| `liveness_completed` | Selfie verified    | `{applicantId, matched}` |
| `identity_verified`  | Full verification  | `{applicantId, method}`  |

**Success Metrics**:

- 95%+ verification completion
- <2% false rejection rate
- 99%+ fraud prevention

---

## Dependencies

### External Dependencies

- Identity verification service (Onfido, Persona)

### Related Stories

- US-022: Fraud Detection

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer
