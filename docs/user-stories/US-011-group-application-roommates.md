# US-011: Group Application for Roommates (Shared Household Screening) [P1]

**Status**: Approved
**Priority**: P1 (High - Addresses common use case)
**Sprint**: Sprint 3

---

## User Story

**As a** prospective tenant applying with roommates
**I want to** submit a group application that includes all co-tenants' screening information
**So that** we can apply together and the landlord can evaluate our combined qualifications

---

## Context & Background

### Problem Statement

Roommate situations require coordinating multiple applications. Each person submits separately, landlords manually combine the data, and there's no combined household view. This creates delays and confusion.

### Business Rationale

- **Market Size**: 30%+ of renters have roommates
- **Pricing Opportunity**: $99.99 for 2-4 applicants (vs $200+ separately)
- **Competitive Advantage**: Unified household screening

### User Pain Point

"My roommate submitted their application a week ago but the landlord is still waiting on mine. We're losing apartments because we can't get our documents together."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 300 groups per month
- **Impact**: 2 (High - addresses real pain)
- **Confidence**: 80%
- **Effort**: 3 person-weeks

**RICE Score**: (300 x 2 x 0.8) / 3 = **160**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: Group Creation

**Given** a tenant wants to apply with roommates
**When** they start a group application
**Then** they can:

- Invite 2-4 co-applicants via email/phone
- Set themselves as primary applicant
- Track invitation status

**Verification**:

- [ ] Invitations sent via email/SMS
- [ ] Invitees can accept and link profiles
- [ ] Status shows pending/accepted

### AC-2: Combined Household View

**Given** all roommates have completed profiles
**When** the group applies
**Then** landlord sees combined metrics:

- Total household income-to-rent ratio
- Combined credit score summary
- All background checks
- Shared references

**Verification**:

- [ ] Household income calculated correctly
- [ ] Individual and combined metrics shown
- [ ] All applicants' data included

### AC-3: Group Pricing

**Given** a group application
**When** payment is processed
**Then** pricing is:

- $99.99 for 2-4 applicants
- Split evenly or paid by primary
- 90-day validity for all profiles

**Verification**:

- [ ] Group pricing applied
- [ ] Payment split option works
- [ ] All profiles get same validity

### AC-4: Partial Completion Handling

**Given** some roommates haven't completed profiles
**When** primary tries to submit
**Then** they see:

- Status per roommate
- Option to send reminders
- Ability to apply with partial group

**Verification**:

- [ ] Per-member status visible
- [ ] Reminder functionality works
- [ ] Partial submission with warning

### AC-5: Lease Assignment

**Given** a group is selected
**When** lease is generated
**Then** all applicants appear on lease as co-tenants

**Verification**:

- [ ] All names on lease
- [ ] Each signs digitally

---

## Technical Implementation Notes

### Data Model

```sql
CREATE TABLE application_groups (
  id UUID PRIMARY KEY,
  primary_applicant_id UUID,
  listing_id UUID,
  status VARCHAR(50),
  created_at TIMESTAMPTZ
);

CREATE TABLE group_members (
  group_id UUID REFERENCES application_groups,
  applicant_id UUID,
  invitation_status VARCHAR(50),
  joined_at TIMESTAMPTZ
);
```

### Frontend Specification

**Components**:

```
components/
  group/
    GroupInvite.tsx          - Invite roommates
    GroupStatus.tsx          - Member completion
    HouseholdSummary.tsx     - Combined metrics
```

---

## Analytics Tracking

| Event Name            | When Triggered       | Properties                 |
| --------------------- | -------------------- | -------------------------- |
| `group_created`       | Primary starts group | `{primaryId, memberCount}` |
| `group_member_joined` | Roommate accepts     | `{groupId, memberId}`      |
| `group_applied`       | Group submits        | `{groupId, listingId}`     |

**Success Metrics**:

- 40% of group applications complete within 48 hours
- 30%+ of applications are group applications
- 50% cost savings vs individual applications

---

## Dependencies

### Blocked By

- US-010: Reusable Profile

### Related Stories

- US-017: Digital Lease Generation

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer, Frontend Developer
