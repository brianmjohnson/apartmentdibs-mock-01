# US-014: Application Status Notifications (Reduce Waiting Anxiety) [P1]

**Status**: Approved
**Priority**: P1 (High - Critical for tenant experience)
**Sprint**: Sprint 2

---

## User Story

**As a** prospective tenant (Maya)
**I want to** receive real-time updates on my application status
**So that** I know where I stand and can plan accordingly instead of anxiously waiting

---

## Context & Background

### Problem Statement

After submitting an application, tenants hear nothing for days or weeks. They don't know if documents were received, if the landlord is reviewing, or when a decision will be made. This creates anxiety and leads to tenants applying to more listings "just in case."

### Business Rationale

- **User Trust**: Transparency reduces anxiety and builds loyalty
- **Conversion**: Engaged users more likely to complete lease
- **Differentiation**: Most platforms provide no status updates

### User Pain Point

"I submitted my application 5 days ago and haven't heard anything. Did they even receive my documents? Should I apply somewhere else?"

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 tenants per month
- **Impact**: 2 (High - major UX improvement)
- **Confidence**: 90%
- **Effort**: 2 person-weeks

**RICE Score**: (1000 x 2 x 0.9) / 2 = **900**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: Application Status Dashboard

**Given** a tenant has submitted applications
**When** they view their dashboard
**Then** they see status for each:
- Application received
- Documents complete/incomplete
- Under landlord review
- Shortlisted/Not shortlisted
- Decision pending
- Selected/Denied

**Verification**:
- [ ] All statuses tracked accurately
- [ ] Timeline view shows progression
- [ ] Multiple applications in single view

### AC-2: Real-Time Status Updates

**Given** application status changes
**When** landlord takes action
**Then** tenant receives:
- Push notification (immediate)
- In-app update (real-time)
- Email summary (configurable)

**Verification**:
- [ ] Updates delivered within seconds
- [ ] Notifications are clear and actionable
- [ ] Frequency configurable

### AC-3: Landlord Engagement Signals

**Given** a landlord reviews the application
**When** they view the profile
**Then** tenant sees (without specifics that create bias):
- "Landlord viewed your profile 3 times"
- "You're in the top 3 finalists"
- "Decision expected by [date]"

**Verification**:
- [ ] Engagement signals increase hope
- [ ] No specific ranking creates unfair expectations
- [ ] Estimated decision date shown

### AC-4: Decision Notification

**Given** landlord makes a decision
**When** tenant is selected or denied
**Then** they receive immediate notification:
- **Selected**: "Congratulations! You've been selected for [Address]!"
- **Denied**: Adverse action letter with reason

**Verification**:
- [ ] Notification within 1 hour of decision
- [ ] Clear next steps provided
- [ ] Denied applicants enter CRM for re-matching

### AC-5: Status Timeline

**Given** a tenant views application details
**When** they click for timeline
**Then** they see:
- "Applied Oct 15"
- "Documents complete Oct 17"
- "Landlord viewed Oct 18"
- "Shortlisted Oct 19"
- "Decision pending - expected Oct 25"

**Verification**:
- [ ] Timeline shows all events
- [ ] Dates and times accurate
- [ ] Visual timeline design

### AC-6: Notification Preferences

**Given** a tenant receives many notifications
**When** they adjust settings
**Then** they can configure:
- Push notifications on/off
- Email digest frequency (immediate, daily, weekly)
- SMS for urgent updates only

**Verification**:
- [ ] Settings persist correctly
- [ ] Channels respect preferences
- [ ] Quiet hours option

---

## Technical Implementation Notes

### Backend Specification

**Event System**: Status changes trigger notification events

**Data Model**:
```sql
CREATE TABLE application_events (
  id UUID PRIMARY KEY,
  application_id UUID,
  event_type VARCHAR(50),
  event_data JSONB,
  created_at TIMESTAMPTZ
);
```

### Frontend Specification

**Components**:
```
components/
  status/
    StatusDashboard.tsx      - All applications
    StatusTimeline.tsx       - Single app history
    EngagementSignal.tsx     - Landlord activity
    NotificationSettings.tsx - Preferences
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `status_viewed` | Tenant checks dashboard | `{tenantId, applicationCount}` |
| `notification_sent` | Status update delivered | `{tenantId, notificationType, channel}` |
| `notification_opened` | Tenant opens notification | `{tenantId, notificationId}` |

**Success Metrics**:
- 90%+ of status changes notified within 5 minutes
- 50% reduction in "what's my status?" support tickets
- 80%+ tenant satisfaction with transparency

---

## Dependencies

### Blocked By
- US-010: Reusable Profile

### Related Stories
- US-008: Automated Document Reminders
- US-002: Adverse Action Notices

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer, Backend Developer
