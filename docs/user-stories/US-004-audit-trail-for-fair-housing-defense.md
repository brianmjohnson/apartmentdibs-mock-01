# US-004: Audit Trail for Fair Housing Defense [P0]

**Status**: Approved
**Priority**: P0 (Critical - Core legal defense mechanism)
**Sprint**: Sprint 1

---

## User Story

**As a** landlord (David)
**I want to** have the platform automatically log every decision I make (who I viewed, who I filtered out, who I selected, and why)
**So that** if I'm ever accused of discrimination, I have timestamped proof that I applied consistent, objective criteria

---

## Context & Background

### Problem Statement

Fair housing lawsuits often hinge on "he said / she said" disputes:
- Denied applicant claims: "Landlord rejected me because of my race"
- Landlord claims: "I rejected them because of low credit score"
- Without documentation, courts assume bias (burden of proof on landlord)

### Business Rationale

- **Legal Risk**: Landlords have no defensible documentation of screening process
- **Market Opportunity**: No competitor offers comprehensive, immutable audit trails
- **Competitive Advantage**: "Compliance insurance" for risk-averse landlords

### User Pain Point

David's perspective: "I'm a doctor. I'm trained to document everything. But rental screening has no clear protocol. Every decision feels like a lawsuit waiting to happen. I need a system that tells me exactly what I can and can't do."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 landlord decisions per month (estimated Month 3-6)
- **Impact**: 3 (Massive - core value proposition for legal protection)
- **Confidence**: 100% (essential for fair housing defense)
- **Effort**: 3 person-weeks

**RICE Score**: (1000 x 3 x 1.0) / 3 = **1,000**

### Story Points

**Estimated Effort**: 21 story points (80-100 hours)

**Complexity Factors**:
- Technical complexity: High (immutable logging, cryptographic hashing, retention policies)
- UI complexity: Medium (audit report generation, timeline views)
- Integration complexity: Medium (performance optimization, data archival)
- Unknown factors: Storage costs at scale, legal requirements evolution

---

## Acceptance Criteria

### AC-1: Comprehensive Event Logging

**Given** a landlord/agent interacts with applicant profiles
**When** any action is taken
**Then** the platform logs:
- **Viewed**: "Landlord viewed Applicant #2847 profile at 2:34 PM on 2024-11-18"
- **Filtered**: "Landlord applied filter: Credit score > 700. Applicants excluded: #5910, #3294"
- **Shortlisted**: "Landlord added Applicant #2847 to shortlist at 3:15 PM"
- **Denied**: "Landlord denied Applicant #5910 at 4:02 PM. Reason: Income-to-rent ratio 2.8x (below 3.0x minimum)"
- **Selected**: "Landlord selected Applicant #2847 at 4:30 PM. Reason: Highest income-to-rent ratio (4.1x)"

**Verification**:
- [ ] All view events logged with timestamp
- [ ] All filter applications logged with affected applicants
- [ ] All shortlist/deny/select actions logged with reasons
- [ ] Logs include user ID, applicant ID, listing ID

### AC-2: Comparison Logging

**Given** a landlord compares multiple applicants side-by-side
**When** the comparison view is accessed
**Then** the platform logs:
- "Landlord compared Applicants #2847, #8392, #5910 at 3:45 PM"
- "Sorted by: Income-to-rent ratio (descending)"
- All comparison criteria captured

**Verification**:
- [ ] Comparison events logged
- [ ] Sort/filter criteria included
- [ ] All compared applicants identified

### AC-3: Criteria Consistency Validation

**Given** a landlord has stated screening criteria
**When** decisions are made
**Then** the platform validates and flags inconsistencies:
- **Stated**: "Minimum credit score 680, minimum income-to-rent 3.0x"
- **Actual**: Selected applicant with 690 credit, denied applicant with 720 credit
- **Audit flag**: "Inconsistency detected: You denied Applicant #8392 (720 credit) but selected Applicant #2847 (690 credit). Reason logged: Applicant #2847 offered longer lease term."

**Verification**:
- [ ] Criteria inconsistencies detected
- [ ] Landlord required to provide legitimate reason for exceptions
- [ ] All exceptions documented with justification

### AC-4: Timestamp Granularity

**Given** audit log entries are created
**When** stored in database
**Then** each entry includes:
- ISO 8601 timestamp with timezone: "2024-11-18T14:34:22-05:00"
- User ID (landlord_id or agent_id)
- IP address (for geolocation verification)
- Device info: "iPhone 15 Pro, iOS 18.0, Safari 17.2"

**Verification**:
- [ ] Timestamps are timezone-aware
- [ ] IP addresses captured
- [ ] Device information logged
- [ ] All entries prove legitimate user (not hacked account)

### AC-5: Audit Report Generation

**Given** a landlord needs legal defense documentation
**When** they request an audit report
**Then** the platform generates PDF containing:
- Listing details: "123 Main St, Brooklyn"
- Date range: "Oct 1 - Oct 30, 2024"
- Total applicants: 8
- Selection summary with reasons:
  - "Applicant #2847 selected (Reason: Highest income ratio 4.1x)"
  - "Applicant #5910 denied (Reason: Income ratio 2.8x below 3.0x minimum)"
  - "Applicant #8392 denied (Reason: Another applicant offered longer lease term)"
- All denials cross-referenced with stated criteria

**Verification**:
- [ ] PDF generation works correctly
- [ ] All decision data included
- [ ] Criteria consistency validated
- [ ] Report is printer-friendly

### AC-6: Retention & Access Control

**Given** audit logs are created
**When** accessed
**Then** the following rules apply:
- **Retention**: 3 years (FCRA requirement)
- **Landlord access**: Full access to their own logs
- **Regulator access**: Upon subpoena
- **Denied applicant access**: Upon request, redacted to show only their own data

**Verification**:
- [ ] Logs retained for 3 years minimum
- [ ] Auto-archival of logs >1 year old
- [ ] Access control enforced
- [ ] GDPR/CCPA data export available

### AC-7: Log Immutability

**Given** audit logs are stored
**When** any modification is attempted
**Then** the platform enforces immutability:
- Logs cannot be edited or deleted
- Cryptographic hash (SHA-256) computed for each entry
- Hash stored separately for integrity verification

**Verification**:
- [ ] No UPDATE or DELETE operations on audit_logs table
- [ ] SHA-256 hash computed for each entry
- [ ] Hash verification detects tampering
- [ ] Separate hash storage table

### AC-8: Non-Functional Requirements

**Immutability**:
- [ ] Audit logs are append-only (blockchain-style)
- [ ] Hash integrity verification available

**Performance**:
- [ ] Log writes complete in <50ms (don't slow user experience)
- [ ] Log reads complete in <100ms

**Storage**:
- [ ] Logs >1 year compressed for storage efficiency
- [ ] Partitioning by timestamp for query performance

---

## Technical Implementation Notes

### Backend Specification

**Audit Log Table**:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  event_type VARCHAR(50), -- 'viewed', 'filtered', 'compared', 'denied', 'selected'
  user_id UUID, -- Landlord or agent
  applicant_id VARCHAR(20), -- "Applicant #2847"
  listing_id UUID,
  event_data JSONB, -- {reason: "Income ratio below minimum", criteria: {...}}
  timestamp TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  hash VARCHAR(64) -- SHA-256 hash of (id + event_type + timestamp + event_data)
);

-- Prevent updates and deletes
REVOKE UPDATE, DELETE ON audit_logs FROM app_user;

-- Index for fast retrieval by listing
CREATE INDEX idx_audit_logs_listing ON audit_logs(listing_id, timestamp DESC);

-- Partitioning by month
CREATE TABLE audit_logs_2024_11 PARTITION OF audit_logs
FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
```

**Hash Computation**:

```typescript
import { createHash } from 'crypto';

function computeAuditHash(log: AuditLog): string {
  const content = `${log.id}|${log.event_type}|${log.timestamp}|${JSON.stringify(log.event_data)}`;
  return createHash('sha256').update(content).digest('hex');
}
```

**Business Logic**:
- `lib/services/audit-logger.ts` - Log creation and hashing
- `lib/services/audit-reporter.ts` - PDF report generation
- `lib/services/audit-verifier.ts` - Hash integrity verification

**Database Changes**:
- [ ] `audit_logs` table with partitioning
- [ ] `audit_hashes` separate table for integrity
- [ ] Indexes for fast querying
- [ ] REVOKE UPDATE/DELETE permissions

### Frontend Specification

**Components**:
```
components/
  audit/
    AuditTimeline.tsx        - Visual timeline of events
    AuditReportGenerator.tsx - PDF generation UI
    InconsistencyAlert.tsx   - Criteria mismatch warnings
    AuditExportButton.tsx    - Export functionality
```

**Routing**:
- `/landlord/listings/[listingId]/audit` - View audit trail for listing
- `/landlord/audit-reports` - Generate and download reports

---

## Analytics Tracking

**Events to Track**:

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `audit_log_created` | Any auditable action | `{userId, listingId, eventType}` |
| `audit_report_generated` | Landlord generates PDF | `{userId, listingId, dateRange}` |
| `criteria_inconsistency_detected` | Decision contradicts criteria | `{userId, applicantId, inconsistencyType}` |
| `audit_data_exported` | GDPR/CCPA export requested | `{applicantId, exportType}` |

**Success Metrics**:
- 100% of landlord actions logged in audit trail
- <1% of reports have unexplained inconsistencies
- 0 successful tampering attempts

---

## Dependencies

### Blocks
- US-002: Automated Adverse Action Notices (letters reference audit)
- All features requiring compliance documentation

### Blocked By
- US-001: PII Anonymization (need applicant data to log)

### Related Stories
- US-002: Automated Adverse Action Notices
- US-003: Location-Aware Fair Housing Compliance
- US-025: GDPR/CCPA Data Export & Deletion

### External Dependencies
- PDF generation library (e.g., Puppeteer, pdfkit)
- Archival storage for old logs

---

## Testing Requirements

### Unit Tests
- [ ] Hash computation correctness
- [ ] Event logging completeness
- [ ] Criteria inconsistency detection
- [ ] Report generation content

### Integration Tests
- [ ] Complete action -> log -> hash flow
- [ ] PDF generation accuracy
- [ ] Access control enforcement
- [ ] Retention policy implementation

### E2E Tests (Playwright)
```typescript
test('landlord can generate audit report', async ({ page }) => {
  await page.goto('/landlord/listings/listing-123/audit')

  // Verify timeline shows events
  await expect(page.locator('text=Viewed Applicant #2847')).toBeVisible()
  await expect(page.locator('text=Selected Applicant #2847')).toBeVisible()

  // Generate report
  await page.click('button:has-text("Generate Report")')
  await page.fill('input[name="startDate"]', '2024-10-01')
  await page.fill('input[name="endDate"]', '2024-10-31')
  await page.click('button:has-text("Download PDF")')

  // Verify download
  const download = await page.waitForEvent('download')
  expect(download.suggestedFilename()).toContain('audit-report')
})
```

**Test Coverage Target**: 90% for audit logging logic

---

## Security Considerations

**Access Control**:
- Landlords can only access their own audit logs
- Applicants can request their own data (redacted)
- Admin access for compliance audits
- No modification by anyone

**Data Integrity**:
- SHA-256 hashing for tamper detection
- Separate hash storage
- Immutable database permissions

**Potential Risks**:
- **Storage costs at scale** - Mitigate with compression, archival
- **Hash collision** - Mitigate with SHA-256 (extremely unlikely)
- **Legal discovery requests** - Mitigate with export functionality

---

## Performance Considerations

**Expected Load**:
- 5,000+ log writes per day
- 100+ report generations per week

**Optimization Strategies**:
- Async log writes (don't block user actions)
- Table partitioning by month
- Index optimization for common queries
- Compress archived partitions

**Performance Targets**:
- Log write: <50ms
- Log read (single listing): <100ms
- Report generation: <10 seconds

---

## Rollout Plan

**Phase 1: Development** (Week 1-2)
- [ ] Audit log table and schema
- [ ] Log creation service
- [ ] Hash computation

**Phase 2: Integration** (Week 2-3)
- [ ] Integrate logging into all actions
- [ ] Inconsistency detection
- [ ] PDF report generation

**Phase 3: Testing** (Week 3)
- [ ] Unit and integration tests
- [ ] Performance testing
- [ ] Security review

**Phase 4: Deployment**
- [ ] Deploy to staging
- [ ] Production deployment
- [ ] Monitor log volume and performance

**Rollback Plan**:
- Feature flag to disable real-time logging
- Background job to backfill logs if needed

---

## Open Questions

- [ ] **How long should we retain logs beyond FCRA requirement?**
  - **Answer**: 3 years minimum, consider 7 years for extended legal protection

- [ ] **Should applicants be able to request their audit logs?**
  - **Answer**: Yes, for GDPR/CCPA compliance, with redaction of other applicants

- [ ] **What if landlord's computer crashes mid-decision?**
  - **Answer**: Auto-save draft decisions every 30 seconds, log "Draft decision saved"

---

## Notes & Updates

### Update Log

| Date | Author | Update |
|------|--------|--------|
| 2025-11-19 | Product Manager | Initial story creation from consolidated User_Stories.md |
| 2025-11-19 | - | Approved - ready for implementation |

### Discussion Notes

- Immutability is critical for legal defense value
- Performance optimization essential to not impact user experience
- Partitioning strategy enables efficient retention management
- PDF reports should be shareable with legal counsel

---

## Related Documentation

- **Business Plan**: `docs/Business_Plan_and_GTM.md` - Compliance value proposition
- **FCRA Requirements**: 3-year retention for adverse action documentation
- **ADR-017**: Immutable Audit Trail for Compliance Logging

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer
**Reviewer**: Architecture Agent, Security Agent
