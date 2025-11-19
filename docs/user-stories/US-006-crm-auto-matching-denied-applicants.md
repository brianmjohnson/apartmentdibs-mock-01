# US-006: CRM Auto-Matching of Denied Applicants to New Listings [P1]

**Status**: Approved
**Priority**: P1 (High - Core network effect driver, key differentiation)
**Sprint**: Sprint 2

---

## User Story

**As an** agent (Jessica)
**I want to** have the platform automatically notify me when denied applicants from previous listings match new listings I post
**So that** I can convert warm leads instead of starting from scratch and reduce days-to-fill by 50%

---

## Context & Background

### Problem Statement

When an applicant is denied, they disappear from the agent's pipeline with no CRM record. The agent starts from scratch with every new vacancy, missing qualified leads who are already verified and interested in similar properties.

### Business Rationale

- **Missed Opportunity**: 4 pre-vetted applicants x $3,000 commission = $12,000 potential revenue per vacancy
- **Network Effect**: CRM grows with every denial, compounding agent value
- **Competitive Advantage**: No competitor offers automated CRM from denied applicants

### User Pain Point

Jessica's perspective: "I have qualified renters walking away every week. They're already verified, they already like the neighborhood, they already trust me. But I have no way to reach them when a new unit opens up. It's like throwing money away."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 agents per month
- **Impact**: 3 (Massive - network effect driver)
- **Confidence**: 80%
- **Effort**: 3 person-weeks

**RICE Score**: (500 x 3 x 0.8) / 3 = **400**

### Story Points

**Estimated Effort**: 21 story points (80-100 hours)

---

## Acceptance Criteria

### AC-1: Automatic CRM Entry on Denial

**Given** an applicant is denied
**When** the denial is processed
**Then** the applicant is auto-added to CRM with:

- Budget range
- Preferred neighborhoods
- Move-in timeline
- Must-haves and nice-to-haves
- Verification status
- Denied listing (for context)
- Denial date

**Verification**:

- [ ] CRM entry created automatically
- [ ] All preference data captured
- [ ] Verification status preserved

### AC-2: Smart Matching Algorithm

**Given** an agent creates a new listing
**When** the listing is published
**Then** the platform scans CRM for matches based on:

- Budget overlap (rent falls within lead's range)
- Neighborhood match
- Move-in timeline still active
- Must-haves present in listing
- Verification still valid

**And** returns matches with relevance score (e.g., "95% match")

**Verification**:

- [ ] Matching completes in <1 second
- [ ] Match score accurately reflects criteria
- [ ] Only valid (non-expired) leads returned

### AC-3: One-Tap CRM Outreach

**Given** matches are found for a new listing
**When** agent clicks "Invite All Matched Leads"
**Then** platform sends personalized messages:

- SMS: "Hi Maya, new 1BR in Williamsburg matches your preferences. Apply with your existing profile?"
- Email with property photos and one-click apply link
- Push notification

**Verification**:

- [ ] Messages personalized with tenant name
- [ ] Property details included
- [ ] One-click apply works correctly

### AC-4: CRM Conversion Tracking

**Given** CRM outreach is performed
**When** leads respond
**Then** dashboard shows:

- Leads contacted this month
- Applications received
- Lease conversion rate
- Average days-to-fill comparison (CRM vs new leads)

**Verification**:

- [ ] Conversion funnel tracked
- [ ] ROI calculator shows time/money saved

### AC-5: Lead Staleness Management

**Given** CRM leads have expiration dates
**When** leads approach expiration (14 days before)
**Then** agent is prompted to:

- Re-engage with "Still looking?" message
- Extend expiration by 30 days
- Archive the lead

**Verification**:

- [ ] Expiration warnings sent
- [ ] Extension option works
- [ ] Archive removes from active matching

---

## Technical Implementation Notes

### Backend Specification

**CRM Table**:

```sql
CREATE TABLE crm_leads (
  id UUID PRIMARY KEY,
  applicant_id VARCHAR(20),
  agent_id UUID,
  budget_min INTEGER,
  budget_max INTEGER,
  neighborhoods TEXT[],
  move_in_start DATE,
  move_in_end DATE,
  must_haves TEXT[],
  verification_expires_at DATE,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  contacted_count INTEGER DEFAULT 0,
  last_contacted_at TIMESTAMPTZ
);

CREATE INDEX idx_crm_budget ON crm_leads USING GIST (int4range(budget_min, budget_max));
CREATE INDEX idx_crm_neighborhoods ON crm_leads USING GIN (neighborhoods);
```

**Matching Query**:

```sql
SELECT * FROM crm_leads
WHERE agent_id = ?
AND int4range(budget_min, budget_max) && int4range(?, ?)
AND neighborhoods && ARRAY[?]
AND move_in_end >= CURRENT_DATE
AND verification_expires_at >= CURRENT_DATE
AND expires_at >= CURRENT_DATE
ORDER BY created_at DESC;
```

### Frontend Specification

**Components**:

```
components/
  crm/
    CRMMatchNotification.tsx  - Match alert
    LeadCard.tsx              - Individual lead display
    OutreachModal.tsx         - Bulk outreach UI
    ConversionDashboard.tsx   - ROI tracking
```

---

## Analytics Tracking

| Event Name          | When Triggered              | Properties                          |
| ------------------- | --------------------------- | ----------------------------------- |
| `crm_lead_created`  | Denial triggers CRM entry   | `{agentId, applicantId}`            |
| `crm_matches_found` | New listing matches leads   | `{agentId, listingId, matchCount}`  |
| `crm_outreach_sent` | Agent contacts leads        | `{agentId, leadCount, channel}`     |
| `crm_lead_applied`  | Lead applies to new listing | `{agentId, applicantId, listingId}` |

**Success Metrics**:

- 40%+ CRM conversion rate (matches who apply)
- 50% reduction in days-to-fill for CRM-sourced applicants
- 35%+ of vacancies filled via CRM leads

---

## Dependencies

### Blocked By

- US-002: Automated Adverse Action Notices (triggers CRM entry)
- US-001: PII Anonymization (applicant preferences)

### Related Stories

- US-005: Unified Applicant Dashboard

### Architecture Decisions

- [ADR-003: Redis Caching Strategy](../adr/ADR-003-redis-caching-strategy.md) - Cache matching results
- [ADR-018: Multi-Channel Notification Delivery](../adr/ADR-018-multi-channel-notification-delivery.md) - Send outreach via SMS/email

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer, Frontend Developer
