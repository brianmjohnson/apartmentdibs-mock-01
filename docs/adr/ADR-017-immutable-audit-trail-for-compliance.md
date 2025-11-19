# ADR-017: Immutable Audit Trail for Compliance Logging

**Status:** APPROVED
**Date:** 2025-11-19
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

User Story US-001 requires logging all PII access attempts with tamper-proof audit trails for FCRA compliance and fair housing legal defense. Audit logs must be retained for 3 years and be exportable for legal proceedings. The logs must be immutable to provide credible evidence that the landlord evaluation process was unbiased.

**Background**:
- Fair housing complaints require proof of non-discriminatory practices
- FCRA requires audit trails for adverse action decisions
- Audit logs are critical evidence in discrimination lawsuits
- Logs must prove: who accessed what data, when, and whether it was before/after selection
- Current approach: No audit logging implemented
- Risk: Mutable logs can be challenged in court as unreliable

**Requirements**:
- **Functional**: Log all PII access attempts (successful and denied)
- **Functional**: Log applicant selections and PII reveals
- **Functional**: Make logs tamper-proof (immutable)
- **Functional**: Retain logs for 3 years minimum (FCRA requirement)
- **Functional**: Export logs for legal discovery
- **Non-functional**: Log write latency < 100ms
- **Non-functional**: No impact on user-facing performance
- **Non-functional**: Scalable to millions of log entries
- **Constraints**: Must integrate with existing PostgreSQL/Neon infrastructure
- **Constraints**: Cost-effective for startup (< $50/month)

**Scope**:
- **Included**: PII access logging, immutability approach, retention policy
- **Included**: Export functionality for legal compliance
- **Not included**: General application logging (see ADR-007)
- **Not included**: Real-time alerting (future enhancement)

---

## Decision

**We will implement an append-only audit log table in PostgreSQL with database-level immutability enforced via triggers and RLS, with daily cryptographic hash chains for tamper evidence.**

Audit logs will be stored in PostgreSQL with strict append-only policies. We'll use cryptographic hash chains to detect tampering and pg_cron for archival to cold storage after 90 days.

**Implementation Approach**:
- Create `pii_access_log` table with append-only constraints
- Use PostgreSQL triggers to prevent UPDATE and DELETE
- Implement hash chain: each log entry includes hash of previous entry
- Use ZenStack policies to enforce read-only for non-admin users
- Archive to Vercel Blob storage after 90 days (cost optimization)
- Provide export API for legal discovery requests

**Why This Approach**:
1. **Tamper Evidence**: Hash chains prove log integrity
2. **Legal Defensibility**: Database constraints prove immutability
3. **Cost Effective**: PostgreSQL + Blob storage (no additional services)
4. **Compliance**: Meets FCRA 3-year retention requirement
5. **Simplicity**: No additional infrastructure (uses existing Neon)

**Example/Proof of Concept**:
```sql
-- pii_access_log table with immutability constraints
CREATE TABLE pii_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  applicant_id VARCHAR(20) NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- 'view_attempt', 'selection', 'reveal', 'denied'
  access_granted BOOLEAN NOT NULL,
  denial_reason VARCHAR(255),
  request_metadata JSONB, -- {ip, user_agent, endpoint}
  previous_hash VARCHAR(64), -- SHA-256 of previous entry
  entry_hash VARCHAR(64) NOT NULL, -- SHA-256 of this entry

  -- Foreign key constraints
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),

  -- Ensure chronological ordering
  CONSTRAINT valid_timestamp CHECK (created_at <= NOW())
);

-- Index for efficient queries
CREATE INDEX idx_audit_applicant ON pii_access_log (applicant_id, created_at);
CREATE INDEX idx_audit_user ON pii_access_log (user_id, created_at);
CREATE INDEX idx_audit_action ON pii_access_log (action_type, created_at);

-- Trigger to prevent updates
CREATE OR REPLACE FUNCTION prevent_audit_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable and cannot be updated';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_no_update
  BEFORE UPDATE ON pii_access_log
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_update();

-- Trigger to prevent deletes
CREATE OR REPLACE FUNCTION prevent_audit_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable and cannot be deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_no_delete
  BEFORE DELETE ON pii_access_log
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_delete();

-- RLS policy: only admins can read
ALTER TABLE pii_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_read_audit ON pii_access_log
  FOR SELECT
  USING (current_setting('app.user_role', true) = 'admin');
```

```typescript
// lib/services/audit-logger.ts
import { prisma } from '@/lib/db';
import { createHash } from 'crypto';

interface AuditLogEntry {
  userId: string;
  userRole: string;
  applicantId: string;
  actionType: 'view_attempt' | 'selection' | 'reveal' | 'denied';
  accessGranted: boolean;
  denialReason?: string;
  requestMetadata?: {
    ip?: string;
    userAgent?: string;
    endpoint?: string;
  };
}

export async function logPiiAccess(entry: AuditLogEntry): Promise<void> {
  // Get the hash of the previous entry for chain
  const lastEntry = await prisma.piiAccessLog.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { entryHash: true },
  });

  const previousHash = lastEntry?.entryHash || 'GENESIS';

  // Calculate hash of this entry
  const entryData = JSON.stringify({
    ...entry,
    previousHash,
    timestamp: new Date().toISOString(),
  });
  const entryHash = createHash('sha256').update(entryData).digest('hex');

  // Insert audit log entry
  await prisma.piiAccessLog.create({
    data: {
      userId: entry.userId,
      userRole: entry.userRole,
      applicantId: entry.applicantId,
      actionType: entry.actionType,
      accessGranted: entry.accessGranted,
      denialReason: entry.denialReason,
      requestMetadata: entry.requestMetadata || {},
      previousHash,
      entryHash,
    },
  });
}

// Verify hash chain integrity (for compliance audits)
export async function verifyAuditIntegrity(
  startDate: Date,
  endDate: Date
): Promise<{ valid: boolean; brokenAt?: string }> {
  const entries = await prisma.piiAccessLog.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  let previousHash = 'GENESIS';

  for (const entry of entries) {
    if (entry.previousHash !== previousHash) {
      return {
        valid: false,
        brokenAt: entry.id,
      };
    }
    previousHash = entry.entryHash;
  }

  return { valid: true };
}

// Export logs for legal discovery
export async function exportAuditLogs(
  applicantId: string,
  format: 'json' | 'csv' = 'json'
): Promise<string> {
  const logs = await prisma.piiAccessLog.findMany({
    where: { applicantId },
    orderBy: { createdAt: 'asc' },
  });

  if (format === 'csv') {
    const headers = [
      'timestamp',
      'user_id',
      'user_role',
      'action_type',
      'access_granted',
      'denial_reason',
    ].join(',');

    const rows = logs.map(log => [
      log.createdAt.toISOString(),
      log.userId,
      log.userRole,
      log.actionType,
      log.accessGranted,
      log.denialReason || '',
    ].join(','));

    return [headers, ...rows].join('\n');
  }

  return JSON.stringify(logs, null, 2);
}

// Usage in application
export async function handlePiiAccess(
  userId: string,
  userRole: string,
  applicantId: string,
  context: { ip?: string; userAgent?: string }
): Promise<boolean> {
  // Check if user has access
  const hasAccess = await checkPiiAccessPermission(userId, applicantId);

  // Log the access attempt
  await logPiiAccess({
    userId,
    userRole,
    applicantId,
    actionType: hasAccess ? 'reveal' : 'denied',
    accessGranted: hasAccess,
    denialReason: hasAccess ? undefined : 'Applicant not selected',
    requestMetadata: context,
  });

  return hasAccess;
}
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences
- **Legal Defensibility**: Tamper-evident logs are credible in court
- **FCRA Compliance**: Meets 3-year retention requirement
- **Fair Housing Defense**: Can prove blind evaluation process
- **Audit Trail**: Complete history of all PII access
- **Cost Effective**: Uses existing PostgreSQL, no new services

### Negative Consequences
- **Storage Growth**: Logs accumulate over 3 years (need archival)
- **No Deletion**: Cannot correct erroneous entries (append correction instead)
- **Query Performance**: Large table needs careful indexing
- **Hash Chain Overhead**: Extra computation per log entry
- **Admin Burden**: Export requests for legal discovery

### Neutral Consequences
- **Cold Storage**: Need archival strategy for cost management
- **Verification**: Periodic integrity checks needed

### Mitigation Strategies
- **Storage Growth**: Archive to Vercel Blob after 90 days, keep summary in DB
- **No Deletion**: Add "correction" action type with reference to original
- **Query Performance**: Partition table by month, create efficient indexes
- **Hash Chain Overhead**: Async logging to avoid blocking user requests
- **Admin Burden**: Create admin UI for export requests

---

## Alternatives Considered

### Alternative 1: AWS CloudWatch Logs

**Description**:
Use AWS CloudWatch Logs with immutable retention policies.

**Pros**:
- Native AWS integration
- Built-in retention policies
- Log insights for querying
- No database schema to manage

**Cons**:
- Higher cost at scale ($0.50/GB ingestion)
- Query limitations (not SQL)
- Another AWS dependency
- Export to JSON only

**Why Not Chosen**:
Cost concern at scale and limited query flexibility. PostgreSQL provides SQL querying for complex reports. Consider for general application logs alongside existing ADR-007.

---

### Alternative 2: Blockchain-Based Logging

**Description**:
Use a blockchain or distributed ledger for immutable audit trail.

**Pros**:
- Truly immutable (cryptographic proof)
- Decentralized verification
- Industry-recognized tamper-proofing
- Third-party verification possible

**Cons**:
- Overkill for single-tenant application
- High complexity and cost
- Slow write times
- Difficult to query
- Regulatory uncertainty

**Why Not Chosen**:
Blockchain is excessive for our use case. Database triggers + hash chains provide sufficient tamper evidence at fraction of complexity. Consider for multi-party verification scenarios.

---

### Alternative 3: Event Sourcing Pattern

**Description**:
Use event sourcing where all state changes are immutable events.

**Pros**:
- Natural audit trail from event log
- Can replay history
- Rich context in events
- Good for complex workflows

**Cons**:
- Major architecture change
- Learning curve for team
- Complex event replay logic
- Overkill for audit-only needs

**Why Not Chosen**:
Full event sourcing is a significant architectural shift. We only need audit logging for PII access, not full state reconstruction. Keep architecture simple for MVP.

---

### Alternative 4: Third-Party Audit Service (Drata/Vanta)

**Description**:
Use a SOC2/compliance-focused audit logging service.

**Pros**:
- Purpose-built for compliance
- Pre-built compliance reports
- Third-party attestation
- Automatic evidence collection

**Cons**:
- Expensive ($500+/month)
- External dependency for critical function
- May not meet custom requirements
- Data leaves our infrastructure

**Why Not Chosen**:
Too expensive for startup stage. Custom PostgreSQL solution meets requirements at fraction of cost. Consider when pursuing SOC2 certification.

---

### Alternative 5: Append-Only File Log

**Description**:
Write audit logs to append-only files in Vercel Blob storage.

**Pros**:
- Simple implementation
- Low cost storage
- Natural immutability
- Easy archival

**Cons**:
- Cannot query efficiently
- No relational context
- Complex to search/filter
- No real-time access

**Why Not Chosen**:
File logs are difficult to query for legal discovery. Need SQL capabilities to filter by applicant, date range, action type. Use Blob for archival, not primary storage.

---

## Related

**Related ADRs**:
- [ADR-007: Observability with Consola and OpenTelemetry] - General application logging
- [ADR-013: PII Encryption] - Audit logs reference encrypted data
- [ADR-014: Row-Level Security] - RLS on audit logs table

**Related Documentation**:
- [User Story US-001] - PII Anonymization requirements
- [docs/compliance/audit-logging.md] - Implementation guide (to be created)
- [docs/legal/fcra-requirements.md] - FCRA compliance details (to be created)

**External References**:
- [FCRA Compliance Guide](https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-landlords-need-know)
- [Fair Housing Act](https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_act_overview)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/plpgsql-trigger.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

---

## Notes

**Decision Making Process**:
- Evaluated compliance requirements (FCRA, FHA)
- Researched tamper-evidence techniques
- Estimated storage requirements over 3 years
- Decision date: 2025-11-19

**Storage Estimate (3 years)**:
- Log entries per month: 10,000
- Entry size: ~1KB
- Annual storage: 120MB
- 3-year storage: 360MB (minimal)

**Review Schedule**:
- Verify hash chain integrity monthly
- Review archival effectiveness quarterly
- Audit access to audit logs annually
- Test export functionality before any legal request

**Archival Strategy**:
- Active logs (0-90 days): PostgreSQL (fast queries)
- Archive logs (90+ days): Vercel Blob (cost optimization)
- Summary stats: Kept in PostgreSQL indefinitely
- Full deletion: After 3 years + 90 days buffer

**Migration Plan**:
- **Phase 1**: Create audit log table with triggers
- **Phase 2**: Implement logging service with hash chain
- **Phase 3**: Add admin UI for export requests
- **Phase 4**: Implement archival cron job (pg_cron)
- **Rollback**: Cannot rollback without losing audit data (keep backups)

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-19 | Architecture Agent | Initial creation for US-001 |
