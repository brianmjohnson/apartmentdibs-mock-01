# US-008: Automated Document Collection Reminders [P1]

**Status**: Approved
**Priority**: P1 (High - Reduces agent manual follow-up burden)
**Sprint**: Sprint 2

---

## User Story

**As an** agent (Jessica)
**I want to** have the platform automatically send reminders to applicants with missing documents
**So that** I don't spend hours manually chasing pay stubs and employment verification letters

---

## Context & Background

### Problem Statement

60% of applicants don't submit complete documents on first attempt. Agents spend significant time sending manual follow-ups via email and phone, which is repetitive and time-consuming.

### Business Rationale

- **Time Cost**: 5-10 hours per week chasing documents
- **Conversion Impact**: Incomplete applications delay decisions and lose candidates
- **Automation Opportunity**: Standardized reminders can be fully automated

### User Pain Point

Jessica's perspective: "I send the same 'please submit your pay stubs' email 20 times a week. It's mind-numbing."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 agents per month
- **Impact**: 2 (High - time savings)
- **Confidence**: 90%
- **Effort**: 2 person-weeks

**RICE Score**: (500 x 2 x 0.9) / 2 = **450**

### Story Points

**Estimated Effort**: 8 story points (30-40 hours)

---

## Acceptance Criteria

### AC-1: Missing Document Detection

**Given** an applicant has started their profile
**When** documents are incomplete after 24 hours
**Then** the platform identifies missing items:
- Pay stubs
- Credit authorization
- Employment verification
- References

**Verification**:
- [ ] System detects all missing document types
- [ ] Tracks time since application started

### AC-2: Automated Reminder Sequence

**Given** documents are missing
**When** reminder triggers fire
**Then** applicant receives:
- Day 1: Email "Reminder: Complete your profile to apply for [Address]"
- Day 3: SMS "Only 2 steps left! (credit authorization + pay stubs)"
- Day 5: Email "Urgent: Application expires in 48 hours"
- Day 7: Final notice before expiration

**Verification**:
- [ ] Reminders sent at correct intervals
- [ ] Multi-channel delivery (email + SMS)
- [ ] Personalized with specific missing items
- [ ] Stop when documents submitted

### AC-3: Agent Notification

**Given** an applicant has been reminded 3+ times
**When** still incomplete
**Then** agent receives alert: "Applicant #2847 needs intervention - 5 days incomplete"

**Verification**:
- [ ] Agent dashboard shows stuck applicants
- [ ] Alert includes one-click contact option

### AC-4: Applicant Progress Tracking

**Given** reminders are sent
**When** applicant views their profile
**Then** they see:
- Progress bar showing completion percentage
- Specific items needed with upload buttons
- Deadline countdown

**Verification**:
- [ ] Progress indicator visible
- [ ] Missing items clearly listed
- [ ] Direct upload links work

### AC-5: Configurable Reminder Settings

**Given** an agent manages reminder preferences
**When** they access settings
**Then** they can configure:
- Reminder frequency (default: Day 1, 3, 5, 7)
- Channels (email, SMS, both)
- Custom message templates
- Application expiration period

**Verification**:
- [ ] Settings are customizable per agent
- [ ] Custom templates work correctly

---

## Technical Implementation Notes

### Backend Specification

**Scheduled Jobs**:
- Daily job checks all incomplete applications
- Triggers appropriate reminder based on days elapsed

**Message Templates**:
- Stored in database with variable interpolation
- Supports email and SMS formats

**Data Model**:
```sql
CREATE TABLE reminder_logs (
  id UUID PRIMARY KEY,
  applicant_id VARCHAR(20),
  reminder_type VARCHAR(50),
  channel VARCHAR(20),
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ
);
```

### Frontend Specification

**Components**:
```
components/
  reminders/
    ProgressBar.tsx           - Application completion
    MissingDocsList.tsx       - What's needed
    ReminderSettings.tsx      - Agent configuration
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `reminder_sent` | Automated reminder delivered | `{applicantId, reminderType, channel}` |
| `document_uploaded` | Applicant submits missing doc | `{applicantId, docType, daysElapsed}` |
| `application_expired` | Profile times out | `{applicantId, daysElapsed}` |

**Success Metrics**:
- 80%+ profile completion rate (up from 40%)
- 70% reduction in agent manual follow-up
- Average completion time <3 days

---

## Dependencies

### Blocked By
- US-005: Unified Applicant Dashboard

### Related Stories
- US-012: Adaptive Onboarding Checklist

### External Dependencies
- SendGrid for email
- Twilio for SMS

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer
