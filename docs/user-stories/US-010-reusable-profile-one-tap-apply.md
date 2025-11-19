# US-010: Reusable Profile (Apply to 5+ Listings with One Tap) [P0]

**Status**: Approved
**Priority**: P0 (Critical - Core tenant value proposition)
**Sprint**: Sprint 1

---

## User Story

**As a** prospective tenant (Maya)
**I want to** create my screening profile once and apply to multiple listings with a single tap
**So that** I don't have to re-upload documents, re-authorize credit checks, and pay multiple fees for each application

---

## Context & Background

### Problem Statement

Traditional rental applications require tenants to repeat document submission for every application: upload pay stubs (again), request employment verification (again), authorize credit check (again). Time cost: 2-3 hours per application x 5 applications = 10-15 hours wasted. Financial cost: $50 per application x 5 = $250+.

### Business Rationale

- **Cost Savings**: $54.99 once vs $250+ for multiple applications
- **Time Savings**: 60 minutes once vs 10-15 hours for multiple applications
- **Competitive Advantage**: True PTSR portability that actually works

### User Pain Point

Maya's perspective: "I've spent $350 on application fees across 7 different landlords, and I still don't have an apartment."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 tenants per month
- **Impact**: 3 (Massive - core value proposition)
- **Confidence**: 100%
- **Effort**: 3 person-weeks

**RICE Score**: (1000 x 3 x 1.0) / 3 = **1,000**

### Story Points

**Estimated Effort**: 21 story points (80-100 hours)

---

## Acceptance Criteria

### AC-1: One-Time Profile Creation

**Given** a tenant completes their profile (documents, verifications, references)
**When** the profile is verified
**Then** the profile is:
- Valid for 60 days (Basic) or 90 days (Premium)
- Reusable for unlimited applications during validity
- Portable to any ApartmentDibs landlord

**Verification**:
- [ ] Profile validity tracked correctly
- [ ] Expiration warnings sent before deadline
- [ ] Profile renewal flow works

### AC-2: One-Tap Application

**Given** a tenant has a verified profile
**When** they click "Apply" on a listing
**Then** the application submits automatically with:
- Credit report
- Background check
- Income verification
- References
- Rental history

**And** no additional uploads or authorizations required

**Verification**:
- [ ] Application submits in <10 seconds
- [ ] All profile data transferred correctly
- [ ] No re-authorization prompts

### AC-3: Multi-Listing Application

**Given** a tenant wants to apply to multiple listings
**When** they select 3-5 listings
**Then** they can apply to all with a single action

**Verification**:
- [ ] Bulk application works
- [ ] Each listing receives complete profile
- [ ] Status tracked per listing

### AC-4: Profile Export (Cross-Platform)

**Given** a tenant wants to apply outside ApartmentDibs
**When** they request profile export
**Then** they receive:
- PDF summary for manual sharing
- QR code for instant verification
- JSON export for integrations

**Verification**:
- [ ] PDF includes all verified data
- [ ] QR code links to verification page
- [ ] Export meets PTSR standards

### AC-5: Profile Update Flow

**Given** a tenant's information changes
**When** they update their profile
**Then**:
- Affected verifications are refreshed
- Previously applied listings see updated data
- Validation period may extend

**Verification**:
- [ ] Updates propagate correctly
- [ ] Re-verification prompts when needed

---

## Technical Implementation Notes

### Backend Specification

**Profile Validation**: Track expiration dates, trigger renewal reminders

**Application Flow**: Copy profile data to application record on submit

### Frontend Specification

**Components**:
```
components/
  profile/
    ProfileStatus.tsx        - Validity and completion
    OneClickApply.tsx        - Application button
    ProfileExport.tsx        - PDF/QR generation
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `profile_created` | Tenant completes profile | `{tenantId, tier}` |
| `one_tap_apply` | Application submitted | `{tenantId, listingId}` |
| `profile_reused` | Second+ application | `{tenantId, applicationCount}` |

**Success Metrics**:
- 50%+ of profiles used for 2+ applications
- <10 seconds per application
- 85% cost savings vs traditional ($54.99 vs $350+)

---

## Dependencies

### Blocks
- US-011: Group Application (builds on reusable profile)
- All tenant application features

### Blocked By
- US-001: PII Anonymization
- US-012: Adaptive Onboarding

---

## Related Documentation

- **ADR-020**: Reusable Tenant Profile Architecture - Profile model, snapshot pattern, one-tap apply
- **ADR-013**: PII Encryption - Profile data encryption
- **ADR-014**: Row-Level Security - Profile access control
- **California AB 2493**: PTSR requirements for profile export

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer, Frontend Developer
