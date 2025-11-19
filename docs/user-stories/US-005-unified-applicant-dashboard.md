# US-005: Unified Applicant Dashboard with Real-Time Status [P1]

**Status**: Approved
**Priority**: P1 (High - Core agent efficiency value prop)
**Sprint**: Sprint 2

---

## User Story

**As an** agent (Jessica)
**I want to** have a single dashboard showing all applicants across all my listings with real-time status updates
**So that** I don't have to switch between 7 different tools and manually track applicants in Excel

---

## Context & Background

### Problem Statement

Jessica manages 180 active listings, receives 25-30 inquiries per day, and currently tracks applicants in Excel. Her workflow involves: Check Gmail for inquiries -> log in Excel -> check RentSpree for background checks -> check Zillow for showing requests -> forward to landlord via email.

### Business Rationale

- **Time Cost**: 20 hours/week on logistics instead of leasing
- **Market Opportunity**: No unified dashboard across all platforms
- **Competitive Advantage**: Single source of truth for all applicant data

### User Pain Point

Jessica's perspective: "I spend more time chasing pay stubs than I do actually leasing apartments. I became an agent to help people find homes, not to be a document coordinator."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 agents per month (estimated Month 3-6)
- **Impact**: 2 (High - significant time savings)
- **Confidence**: 80% (based on user research)
- **Effort**: 3 person-weeks

**RICE Score**: (500 x 2 x 0.8) / 3 = **266.7**

### Story Points

**Estimated Effort**: 21 story points (80-100 hours)

**Complexity Factors**:

- Technical complexity: Medium (data aggregation, real-time updates)
- UI complexity: High (dashboard design, filtering, sorting)
- Integration complexity: Medium (WebSocket for real-time)
- Unknown factors: Performance at scale (500+ applicants)

---

## Acceptance Criteria

### AC-1: Unified Applicant Inbox

**Given** an agent logs into the platform
**When** they access the dashboard
**Then** they see all applicants across all listings with columns:

- Applicant ID (e.g., "Applicant #2847")
- Listing address
- Status: "New", "Documents Complete", "Under Review", "Shortlisted", "Offer Extended", "Lease Signed", "Denied"
- Application date
- Last activity
- Next action (e.g., "Awaiting landlord decision")

**And** the list is:

- Sortable by: application date, status, listing address, income ratio, credit score
- Filterable by: status, listing, date range, verification status

**Verification**:

- [ ] All applicants displayed in single view
- [ ] Sorting works for all columns
- [ ] Filtering works for all criteria
- [ ] Pagination for large datasets (50 per page)

### AC-2: Application Status Badges

**Given** applicants have different statuses
**When** displayed in the dashboard
**Then** visual badges indicate status:

- Green: "Documents Complete" (ready for landlord review)
- Yellow: "Incomplete" (missing documents)
- Red: "Expired" (application older than 14 days, no response)
- Blue: "Under Landlord Review"
- Gray: "Denied" or "Withdrawn"

**Verification**:

- [ ] Color-coded badges display correctly
- [ ] Badge colors are accessible (colorblind-friendly)
- [ ] Status updates reflected in real-time

### AC-3: Real-Time Notifications

**Given** applicant status changes or new events occur
**When** the dashboard is open
**Then** agent receives:

- Push notifications (browser, mobile): "New verified applicant for 123 Main St: Applicant #2847 (4.1x income ratio)"
- In-dashboard toast notifications
- Email digest (configurable: hourly, daily, weekly)
- SMS alerts for urgent actions

**Verification**:

- [ ] WebSocket delivers real-time updates
- [ ] Push notifications work in browser
- [ ] Email digest configurable
- [ ] SMS alerts for urgent items

### AC-4: Applicant Detail View

**Given** an agent clicks on an applicant
**When** the detail view opens
**Then** they see:

- Obfuscated profile summary (income ratio, credit band, employment, rental history)
- Application timeline: "Applied Oct 15 -> Documents complete Oct 17 -> Landlord viewed Oct 18"
- Internal notes (agent can add private notes)
- Communication history (all platform messages)

**Verification**:

- [ ] Modal/side panel displays all details
- [ ] Timeline shows all events
- [ ] Notes are saveable and private
- [ ] Communication history complete

### AC-5: Bulk Actions

**Given** an agent selects multiple applicants
**When** they perform bulk actions
**Then** available actions include:

- "Forward to Landlord" (send all shortlisted at once)
- "Request Missing Documents" (auto-send reminders)
- "Deny with Reason" (generate adverse action letters for all)

**Verification**:

- [ ] Multi-select works correctly
- [ ] Bulk forward sends all selected
- [ ] Bulk reminder triggers for incomplete applicants
- [ ] Bulk deny generates individual letters

### AC-6: Non-Functional Requirements

**Performance**:

- [ ] Dashboard loads in <2 seconds (even with 500+ applicants)
- [ ] Real-time updates via WebSocket (no page refresh)

**Responsiveness**:

- [ ] Mobile-friendly (agent checks between showings)
- [ ] Touch-friendly controls

**Reliability**:

- [ ] Graceful degradation if WebSocket disconnects

---

## Technical Implementation Notes

### Backend Specification

**Database Query Optimization**:

```sql
SELECT a.applicant_id, a.status, l.address, a.created_at, a.last_activity
FROM applications a
JOIN listings l ON a.listing_id = l.id
WHERE a.agent_id = ?
ORDER BY a.last_activity DESC
LIMIT 50;

-- Index for fast filtering
CREATE INDEX idx_applications_agent_status ON applications(agent_id, status, last_activity DESC);
```

**Real-Time Updates**: WebSocket connection via Socket.io

**Caching**: Redis cache for applicant counts per status

### Frontend Specification

**Components**:

```
components/
  dashboard/
    ApplicantTable.tsx        - Main data table
    StatusBadge.tsx           - Color-coded badges
    ApplicantDetailPanel.tsx  - Side panel detail view
    BulkActionBar.tsx         - Multi-select actions
    NotificationToast.tsx     - Real-time alerts
```

**Routing**:

- `/agent/applicants` - Main dashboard
- `/agent/applicants/[id]` - Detail view

---

## Analytics Tracking

| Event Name              | When Triggered         | Properties                           |
| ----------------------- | ---------------------- | ------------------------------------ |
| `dashboard_viewed`      | Agent opens dashboard  | `{agentId, applicantCount}`          |
| `applicant_filtered`    | Filter applied         | `{agentId, filterType, filterValue}` |
| `bulk_action_performed` | Bulk action executed   | `{agentId, actionType, count}`       |
| `notification_received` | Real-time notification | `{agentId, notificationType}`        |

**Success Metrics**:

- 75% reduction in time spent on applicant management
- 90%+ of agents use dashboard daily
- <2 second dashboard load time

---

## Dependencies

### Blocked By

- US-001: PII Anonymization (obfuscated data display)

### Related Stories

- US-006: CRM Auto-Matching
- US-008: Automated Document Collection Reminders

---

## Testing Requirements

### E2E Tests

```typescript
test('agent can view and filter applicants', async ({ page }) => {
  await page.goto('/agent/applicants')

  // Verify dashboard loads
  await expect(page.locator('table')).toBeVisible()

  // Apply filter
  await page.selectOption('select[name="status"]', 'documents_complete')
  await expect(page.locator('tbody tr')).toHaveCount(5)
})
```

---

## Notes & Updates

| Date       | Author          | Update                 |
| ---------- | --------------- | ---------------------- |
| 2025-11-19 | Product Manager | Initial story creation |
| 2025-11-19 | -               | Approved               |

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer, Backend Developer
