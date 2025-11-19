# US-018: Concierge Service for Technology-Averse Landlords [P2]

**Status**: Approved
**Priority**: P2 (Medium - Addresses specific persona)
**Sprint**: Sprint 4

---

## User Story

**As a** technology-averse landlord (Sandra)
**I want to** have white-glove concierge support that helps me use the platform
**So that** I can get the compliance protection without having to learn complex software

---

## Context & Background

### Problem Statement

Sandra (65, owns 3-unit brownstone) is not comfortable with technology. She wants compliance protection but is intimidated by online platforms. She prefers phone calls and wants someone to walk her through everything.

### Business Rationale

- **Market Segment**: 30%+ of landlords are 60+ and technology-hesitant
- **Premium Pricing**: $499/year + $99/listing for high-touch service
- **Retention**: Personal relationship increases loyalty

### User Pain Point

Sandra's perspective: "I don't want to learn another app. I just want to call someone and have them help me fill out the forms."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 200 landlords per month
- **Impact**: 1.5 (Medium - specific segment)
- **Confidence**: 70%
- **Effort**: 2 person-weeks

**RICE Score**: (200 x 1.5 x 0.7) / 2 = **105**

### Story Points

**Estimated Effort**: 8 story points (30-40 hours)

---

## Acceptance Criteria

### AC-1: Dedicated Phone Support

**Given** Sandra subscribes to concierge tier
**When** she needs help
**Then** she can call a dedicated phone number:
- Priority routing to support
- Familiar rep (assigned account manager)
- Available during business hours

**Verification**:
- [ ] Phone number prominently displayed
- [ ] Account manager assignment works
- [ ] Call history tracked

### AC-2: Profile Creation Assistance

**Given** Sandra needs to create a listing
**When** she calls support
**Then** the rep can:
- Enter listing details on her behalf
- Guide her through photo upload
- Set screening criteria via phone

**Verification**:
- [ ] Admin can act on landlord's behalf
- [ ] All actions logged
- [ ] Landlord receives confirmation

### AC-3: Applicant Review Walkthrough

**Given** applications are received
**When** Sandra is ready to review
**Then** support rep:
- Schedules phone call
- Walks through each applicant
- Explains metrics and recommendations
- Records her decision

**Verification**:
- [ ] Scheduled call workflow
- [ ] Rep can view landlord's dashboard
- [ ] Decision properly recorded

### AC-4: Document Handling

**Given** Sandra receives physical documents
**When** she needs them uploaded
**Then** she can:
- Mail documents to scanning address
- Platform digitizes and attaches
- Or email photos to support

**Verification**:
- [ ] Mail-in address provided
- [ ] Scanning service works
- [ ] Documents attached to correct listing

### AC-5: Proactive Check-ins

**Given** Sandra is subscribed
**When** important events occur
**Then** account manager proactively calls:
- New applicants received
- Application deadlines approaching
- Decision needed
- Lease ready to send

**Verification**:
- [ ] Trigger-based outreach
- [ ] Call logged in system
- [ ] Preferences respected (call times)

---

## Technical Implementation Notes

### Backend Specification

**Admin Acting**: Support can perform actions on landlord's behalf with logging

**Account Manager Assignment**: CRM-style relationship tracking

**Document Scanning**: Integration with document scanning service

### Frontend Specification

**Components**:
```
components/
  concierge/
    AccountManagerCard.tsx   - Contact info
    ConciergeCallLog.tsx     - Call history
    ProxyActionBanner.tsx    - "Action by support"
```

**Admin Dashboard**:
- View landlord's screen
- Perform actions with logging
- Schedule calls

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `concierge_call` | Support call made | `{landlordId, repId, duration, topic}` |
| `proxy_action` | Rep acts on behalf | `{landlordId, repId, actionType}` |
| `document_scanned` | Mail-in processed | `{landlordId, docType}` |

**Success Metrics**:
- 95%+ satisfaction for concierge tier
- 80%+ retention rate
- Average 3 calls per month per landlord

---

## Dependencies

### Blocked By
- US-016: Obfuscated Dashboard (rep walks through)
- US-017: Digital Lease Generation

### External Dependencies
- Phone system integration
- Document scanning service

---

**Last Updated**: 2025-11-19
**Assigned To**: Customer Success Team, Backend Developer
