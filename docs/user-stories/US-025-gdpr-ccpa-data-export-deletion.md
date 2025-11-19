# US-025: GDPR/CCPA Data Export & Deletion (Right to be Forgotten) [P1]

**Status**: Approved
**Priority**: P1 (High - Legal compliance required)
**Sprint**: Sprint 3

---

## User Story

**As a** privacy-conscious tenant (Maya)
**I want to** export all my data and request permanent deletion
**So that** I maintain control over my personal information as required by GDPR/CCPA

---

## Context & Background

### Problem Statement

Privacy regulations (GDPR in EU, CCPA in California) require platforms to provide data export and deletion capabilities. Failure to comply can result in significant fines (up to 4% of global revenue for GDPR).

### Business Rationale

- **Legal Compliance**: Mandatory for operating in EU and California
- **Trust**: Privacy controls build user confidence
- **Differentiation**: Proactive privacy stance vs reactive competitors

### User Pain Point

"I gave my SSN, pay stubs, and address to 7 different landlords. I have no idea what they're doing with my data. At least I want to know I can delete it."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 users per month requesting data
- **Impact**: 2 (High - legal requirement)
- **Confidence**: 100%
- **Effort**: 3 person-weeks

**RICE Score**: (500 x 2 x 1.0) / 3 = **333**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: Data Export Request

**Given** user wants their data
**When** they request export
**Then** system generates:

- JSON file with all personal data
- PDF summary for readability
- All uploaded documents
- Activity history

**And** delivers within 30 days (GDPR requirement)

**Verification**:

- [ ] All data included
- [ ] Machine-readable format (JSON)
- [ ] Delivered within deadline

### AC-2: Data Inventory Display

**Given** user wants to see what's stored
**When** they view privacy settings
**Then** they see:

- Categories of data held
- How long it's retained
- Who it's shared with
- Purpose of collection

**Verification**:

- [ ] Comprehensive inventory
- [ ] Plain language explanations
- [ ] Up-to-date

### AC-3: Deletion Request

**Given** user wants data deleted
**When** they submit request
**Then** system:

- Validates request
- Deletes from all systems within 30 days
- Confirms deletion via email
- Retains only legally required records

**Verification**:

- [ ] Complete deletion executed
- [ ] Backups purged
- [ ] Confirmation sent
- [ ] Legal holds respected

### AC-4: Selective Deletion

**Given** user wants specific data removed
**When** they select items
**Then** they can delete:

- Individual documents
- Profile sections
- Application history (from specific listings)

**And** keep account active

**Verification**:

- [ ] Granular deletion works
- [ ] Account remains functional
- [ ] Changes logged

### AC-5: Audit Trail Exception

**Given** FCRA requires 3-year retention
**When** user requests deletion
**Then** system:

- Anonymizes PII in audit logs
- Retains anonymous compliance records
- Explains exception to user

**Verification**:

- [ ] Audit logs anonymized, not deleted
- [ ] Compliance maintained
- [ ] User informed

### AC-6: Third-Party Notification

**Given** data was shared with landlords
**When** deletion requested
**Then** system:

- Notifies landlords to delete
- Tracks compliance
- Reports to user

**Verification**:

- [ ] Notifications sent
- [ ] Compliance tracked
- [ ] User informed of status

---

## Technical Implementation Notes

### Backend Specification

**Data Mapping**: Complete inventory of all PII storage locations

**Deletion Scripts**: Cascade delete across all tables

**Export Format**: GDPR-compliant JSON structure

### Frontend Specification

**Components**:

```
components/
  privacy/
    DataInventory.tsx        - What we store
    ExportRequest.tsx        - Request export
    DeletionRequest.tsx      - Request deletion
    SelectiveDelete.tsx      - Granular removal
```

**Routing**:

- `/settings/privacy` - Privacy controls

---

## Analytics Tracking

| Event Name           | When Triggered       | Properties               |
| -------------------- | -------------------- | ------------------------ |
| `export_requested`   | User requests data   | `{userId}`               |
| `export_delivered`   | Export sent          | `{userId, fileSize}`     |
| `deletion_requested` | User requests delete | `{userId, scope}`        |
| `deletion_completed` | Delete finished      | `{userId, itemsDeleted}` |

**Success Metrics**:

- 100% of requests fulfilled within 30 days
- <1% of users request full deletion
- 0 compliance violations

---

## Dependencies

### Related Stories

- US-001: PII Anonymization
- US-004: Audit Trail

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer, Compliance Agent
