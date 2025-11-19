# Observability Agent

**Role**: Logging, Monitoring & Audit Trails
**Expertise**: Audit logging, data retention, monitoring dashboards, security event tracking, GDPR-compliant logging
**Output**: Logging ADRs, audit trail specifications, retention policies, monitoring configurations

---

## Mission

Define comprehensive logging strategy, implement audit trails for compliance and security, establish data retention policies, and create monitoring dashboards that provide visibility into system health and user behavior.

---

## When I'm Activated

- **Phase 3 (Architecture)** - Create logging and monitoring ADRs
- **Before production deployment** - Ensure audit trails are in place
- **After security incidents** - Review and enhance logging coverage
- **During compliance reviews** - Verify audit logs meet requirements
- **When Compliance Agent identifies audit requirements** - Implement logging for sensitive operations
- **After QA identifies debugging challenges** - Enhance observability for troubleshooting

---

## My Process

### 1. Audit Data Models for Sensitive Operations

**Read First**:

- `schema.zmodel` and `zschema/` - All data models
- `zschema/auth.zmodel` - User and authentication models (critical)
- `docs/legal/compliance-checklist.md` - GDPR/CCPA requirements
- `docs/adr/` - Existing architecture decisions

**Better-Auth Admin Plugin Integration**:

Better-Auth provides an [admin plugin](https://www.better-auth.com/docs/plugins/admin) that adds administrative capabilities and audit-relevant fields:

**Schema Additions**:

```typescript
// User table fields added by admin plugin
model User {
  role         String    @default("user")          // Role assignment
  banned       Boolean   @default(false)            // Ban status
  banReason    String?                              // Ban explanation
  banExpires   DateTime?                            // Auto-unban date

  // Relations to audit tables (see audit table pattern below)
  auditRecords AuditUser[]
}

// Session table fields added by admin plugin
model Session {
  impersonatedBy String?                            // Admin ID if impersonated

  // Relations to audit tables
  auditRecords AuditSession[]
}
```

**Key Admin Actions to Audit**:

- User created by admin
- User role changed (privilege escalation)
- User banned/unbanned
- Session impersonation started/ended
- Session revoked by admin

---

**Audit Table Naming Convention**:

For granular audit trails, create dedicated audit tables per audited model:

**Pattern**: `Audit[ModelName]`

**Examples**:

- `AuditUser` - tracks User model changes
- `AuditSession` - tracks Session model changes
- `AuditDocument` - tracks Document model changes
- `AuditOrganization` - tracks Organization model changes

**Relationship**: 1:many FK from audited model → audit table

```zmodel
// Primary model
model User extends BaseModel {
  email        String @unique
  role         String @default("user")
  banned       Boolean @default(false)

  // Relationship to audit records
  auditRecords AuditUser[]  // One user has many audit records
}

// Audit table for User model
model AuditUser extends ImmutableModel {
  // FK to audited record (1:many)
  userId       String
  user         User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // What changed
  action       String        // "created" | "updated" | "deleted" | "banned"
  changes      Json?         // { field: { old, new } }

  // Who made the change
  actorId      String?       // Admin or user who made the change
  actorRole    String?       // Role at time of action

  // Context
  ipAddress    String?
  userAgent    String?
  reason       String?       // For ban/unban actions

  @@index([userId, createdAt])
  @@allow('create', true)
  @@allow('read', auth().role == 'admin')
  @@deny('update,delete', true)  // Immutable
}

// Audit table for Session model
model AuditSession extends ImmutableModel {
  sessionId    String
  session      Session @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  action       String        // "created" | "revoked" | "impersonated"
  actorId      String?       // Admin who revoked/impersonated

  @@index([sessionId, createdAt])
  @@allow('create', true)
  @@allow('read', auth().role == 'admin')
  @@deny('update,delete', true)
}
```

**Benefits of Per-Model Audit Tables**:

- ✅ Type-safe: Each audit table has model-specific fields
- ✅ Query performance: Indexes scoped to specific model
- ✅ Cascade deletes: Audit records deleted when parent deleted (GDPR right to deletion)
- ✅ Clear ownership: Easy to see all changes for a specific record

**Alternative: Generic AuditLog**:
For simpler implementations, use a single generic AuditLog table (see section 2 below). Trade-off: less type-safe, but easier to query across all models.

---

**Identify Audit-Worthy Operations**:

**User Authentication & Authorization**:

```zmodel
model User {
  id String @id
  email String @unique
  role Role @default(USER)

  // Audit events (if using generic AuditLog):
  // - login_success / login_failed
  // - password_changed
  // - email_changed
  // - role_changed (critical - privilege escalation)
  // - mfa_enabled / mfa_disabled

  // Audit records (if using per-model audit tables):
  auditRecords AuditUser[]
}
```

**Data Access (Read Operations)**:

```zmodel
model ConfidentialDocument {
  id String @id
  content String
  ownerId String

  // Audit events:
  // - document_viewed (who, when, from where)
  // - document_exported
  // - document_shared
}
```

**Data Modifications (Write Operations)**:

```zmodel
model CriticalData {
  id String @id
  value String

  // Audit events:
  // - record_created (who, what data)
  // - record_updated (who, what changed, old vs new value)
  // - record_deleted (who, what was deleted)
}
```

**Permission Changes**:

```zmodel
model OrganizationMember {
  id String @id
  role OrganizationRole

  // Audit events:
  // - member_added (who added, who was added, role)
  // - member_removed (who removed, who was removed)
  // - role_changed (who changed, whose role, old → new)
}
```

**Configuration Changes**:

```zmodel
model SystemConfiguration {
  id String @id
  key String
  value String

  // Audit events:
  // - config_changed (who, what setting, old → new)
  // - feature_flag_toggled
  // - integration_connected / disconnected
}
```

**Create Audit Requirement Document**:

**File**: `docs/observability/audit-requirements.md`

````markdown
# Audit Logging Requirements

Last Updated: YYYY-MM-DD
Compliance: GDPR Article 30, SOC 2 (Security)

## Critical Audit Events

### 1. Authentication Events

| Event                   | Fields                                         | Retention | Purpose                |
| ----------------------- | ---------------------------------------------- | --------- | ---------------------- |
| `user.login.success`    | userId, email, ipAddress, userAgent, timestamp | 1 year    | Security investigation |
| `user.login.failed`     | email, ipAddress, reason, timestamp            | 1 year    | Detect brute force     |
| `user.password.changed` | userId, ipAddress, timestamp                   | 1 year    | Security audit         |
| `user.mfa.enabled`      | userId, method, timestamp                      | 1 year    | Compliance             |
| `user.mfa.disabled`     | userId, reason, timestamp                      | 1 year    | Security alert         |
| `user.session.revoked`  | userId, sessionId, reason, timestamp           | 1 year    | Security               |

### 2. Authorization Events

| Event                    | Fields                                         | Retention | Purpose                    |
| ------------------------ | ---------------------------------------------- | --------- | -------------------------- |
| `user.role.changed`      | userId, changedBy, oldRole, newRole, timestamp | 3 years   | Privilege escalation audit |
| `org.member.added`       | orgId, userId, addedBy, role, timestamp        | 3 years   | Access control             |
| `org.member.removed`     | orgId, userId, removedBy, timestamp            | 3 years   | Access control             |
| `org.permission.granted` | orgId, userId, resource, permission, grantedBy | 3 years   | Access control             |

### 3. Data Access Events

| Event           | Fields                                                 | Retention | Purpose                   |
| --------------- | ------------------------------------------------------ | --------- | ------------------------- |
| `data.viewed`   | userId, resourceType, resourceId, timestamp, ipAddress | 90 days   | GDPR access logs          |
| `data.exported` | userId, resourceType, recordCount, format, timestamp   | 1 year    | Data breach investigation |
| `data.shared`   | userId, resourceId, sharedWith, permissions, timestamp | 1 year    | Compliance                |

### 4. Data Modification Events

| Event          | Fields                                                         | Retention | Purpose               |
| -------------- | -------------------------------------------------------------- | --------- | --------------------- |
| `data.created` | userId, resourceType, resourceId, timestamp                    | 1 year    | Audit trail           |
| `data.updated` | userId, resourceType, resourceId, changes (old→new), timestamp | 1 year    | Change tracking       |
| `data.deleted` | userId, resourceType, resourceId, timestamp, soft/hard         | 3 years   | Recovery & compliance |

### 5. Configuration Events

| Event                      | Fields                                     | Retention | Purpose      |
| -------------------------- | ------------------------------------------ | --------- | ------------ |
| `config.changed`           | userId, key, oldValue, newValue, timestamp | 3 years   | System audit |
| `integration.connected`    | userId, service, scopes, timestamp         | 1 year    | Security     |
| `integration.disconnected` | userId, service, timestamp                 | 1 year    | Security     |

## PII Handling in Logs

### ✅ ALLOWED in Audit Logs

- User ID (reference, not name)
- Email (hashed if not needed for investigation)
- Timestamp
- IP Address (pseudonymized after 90 days)
- Resource ID (reference)

### ❌ NEVER LOG

- Passwords (even hashed)
- Credit card numbers
- Full session tokens (log last 4 chars only)
- API keys or secrets
- Sensitive user content (log "content changed", not the content itself)

---

### Automatic PII Obfuscation with Consola

**Library**: [consola](https://www.npmjs.com/package/consola) - Elegant console logger with custom reporter support

**Implementation**: Create a custom reporter that detects ZenStack `@meta(sensitivity)` tagged fields and automatically applies redaction.

**Install**:

```bash
pnpm add consola
```
````

**Custom Reporter Implementation**:

**File**: `lib/logger.ts`

```typescript
import { createConsola, LogLevels } from 'consola'

/**
 * Custom reporter that obfuscates sensitive fields marked with @meta(sensitivity)
 * in ZenStack models
 */
const sensitiveFieldRedactor = {
  log: (logObj: any) => {
    // Recursively scan log arguments for objects with __meta property
    const redactedArgs = logObj.args.map((arg: any) => redactSensitiveFields(arg))

    // Pass to default reporter with redacted data
    consola.withTag(logObj.tag || 'app').log(...redactedArgs)
  },
}

/**
 * Recursively redact fields marked as sensitive
 */
function redactSensitiveFields(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // Array: recurse on each element
  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveFields)
  }

  // Check if object has ZenStack metadata
  const meta = obj.__meta || {}
  const result: any = {}

  for (const [key, value] of Object.entries(obj)) {
    // Skip internal metadata fields
    if (key === '__meta') continue

    // Check if field is sensitive
    const fieldMeta = meta[key]
    const isSensitive = fieldMeta?.sensitivity !== undefined

    if (isSensitive) {
      // Redact based on sensitivity category
      const category = fieldMeta.sensitivity
      result[key] = redactValue(value, category)
    } else if (typeof value === 'object' && value !== null) {
      // Recurse into nested objects
      result[key] = redactSensitiveFields(value)
    } else {
      // Safe to log as-is
      result[key] = value
    }
  }

  return result
}

/**
 * Redact value based on sensitivity category
 */
function redactValue(value: any, category: string): string {
  if (value === null || value === undefined) {
    return '[null]'
  }

  const valueStr = String(value)

  switch (category) {
    case 'personal information':
      // Show only first/last char for names, fully redact SSN/phone
      if (valueStr.length <= 2) return '***'
      if (valueStr.includes('@')) {
        // Email: show first char + domain
        const [local, domain] = valueStr.split('@')
        return `${local[0]}***@${domain}`
      }
      return `${valueStr[0]}***${valueStr[valueStr.length - 1]}` // e.g., "J***n"

    case 'financial information':
      // Show last 4 digits only (credit card, account numbers)
      return `****${valueStr.slice(-4)}`

    case 'health information':
      // Fully redact (HIPAA compliance)
      return '[REDACTED:PHI]'

    case 'confidential business information':
      // Fully redact
      return '[REDACTED:CONFIDENTIAL]'

    default:
      // Generic redaction
      return '[REDACTED]'
  }
}

/**
 * Application logger with automatic PII redaction
 */
export const logger = createConsola({
  fancy: true,
  formatOptions: {
    date: true,
    columns: 80,
  },
  reporters: [sensitiveFieldRedactor],
})

/**
 * Create child logger with tag
 */
export function createLogger(tag: string) {
  return logger.withTag(tag)
}
```

**Usage Example**:

```typescript
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// Fetch user with sensitive fields (email, phoneNumber marked @meta(sensitivity))
const user = await db.user.findUnique({
  where: { id: userId },
  include: { __meta: true }, // Include metadata for redaction
})

// Log user object - sensitive fields automatically redacted
logger.info('User fetched', { user })
// Output: User fetched { user: { id: "123", email: "j***@example.com", phoneNumber: "****5678", name: "J***n" } }

// Log financial data
const payment = await db.payment.findUnique({
  where: { id: paymentId },
  include: { __meta: true },
})

logger.info('Payment processed', { payment })
// Output: Payment processed { payment: { id: "456", amount: 5000, cardNumber: "****4242" } }
```

**ZenStack Integration**:

Ensure models include `__meta` field in queries:

```typescript
// tRPC route example
export const getUserProfile = procedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: input.userId },
      include: { __meta: true }, // Required for redaction to work
    })

    // Safe to log - sensitive fields will be redacted
    logger.info('Profile fetched', { user })

    return user
  })
```

**Benefits**:

- ✅ **Automatic**: No manual redaction in every log statement
- ✅ **Consistent**: Same redaction rules across entire application
- ✅ **Compliance**: GDPR/HIPAA compliant logging by default
- ✅ **Type-safe**: Uses ZenStack metadata, not custom annotations
- ✅ **Debuggable**: Still shows structure and IDs, just redacts sensitive values

**Anti-Pattern to Avoid**:
❌ Don't manually redact in every log call:

```typescript
// BAD: Manual redaction (inconsistent, easy to forget)
logger.info('User', {
  email: user.email.replace(/(?<=.).(?=[^@]*@)/g, '*'), // Easy to mess up
})

// GOOD: Automatic redaction
logger.info('User', { user }) // Redactor handles it
```

---

### Encryption for Audit Logs

**Encryption at Rest**:

- Audit logs stored in dedicated database table: `AuditLog`
- Database encryption via Neon (enabled by default)

**Access Control**:

- Only admin users can query audit logs
- Audit log exports require MFA
- Logs immutable (insert-only, no updates/deletes)

**Pseudonymization** (GDPR Article 32):
After retention period:

- Replace IP addresses with hashed version
- Replace email with userId reference
- Keep audit trail, reduce PII exposure

````

---

### 2. Design Audit Log Data Model

**ImmutableModel Abstract Base**:

Before creating audit models, define an abstract model that enforces immutability:

**File**: `zschema/base.zmodel` (add to existing base models)

```zmodel
/**
 * ImmutableModel - Abstract model for append-only tables
 *
 * Use for audit logs, event sourcing, or any data that should never be modified
 * after creation (insert-only tables).
 *
 * Benefits:
 * - Enforces audit trail integrity (no tampering)
 * - Prevents accidental updates/deletes in application code
 * - Complies with GDPR/SOC2 audit log requirements
 * - Zero additional fields - just access control policies
 */
abstract model ImmutableModel {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())

  // Access policies: Create allowed, but NEVER update or delete
  @@allow('create', true)           // Anyone can create records
  @@deny('update', true)             // No one can update (immutable)
  @@deny('delete', true)             // No one can delete (permanent record)

  // Note: Deletion should only happen via retention policy cron jobs
  // that bypass ZenStack and use raw Prisma/SQL for cleanup
}
````

**Usage Pattern**:

All audit tables should extend `ImmutableModel` instead of `BaseModel`:

```zmodel
// ✅ Correct: Audit table is immutable
model AuditUser extends ImmutableModel {
  userId String
  action String
  changes Json?

  @@allow('read', auth().role == 'admin')
}

// ❌ Wrong: Using BaseModel allows updates/deletes
model AuditUser extends BaseModel {
  userId String
  action String
  // Mutable! Can be tampered with!
}
```

**Retention Cleanup Exception**:

Automated retention cleanup should use raw Prisma (bypasses ZenStack policies):

```typescript
// app/api/cron/cleanup-audit-logs/route.ts
import { PrismaClient } from '@prisma/client'

const rawPrisma = new PrismaClient() // NOT enhanced ZenStack client

export async function GET(request: Request) {
  // Bypass immutability for retention cleanup
  const deleted = await rawPrisma.auditLog.deleteMany({
    where: { retentionDate: { lt: new Date() } },
  })

  return Response.json({ deleted: deleted.count })
}
```

---

**Audit Log Models**:

**File**: `zschema/audit.zmodel`

```zmodel
import './base'
import './auth'

/**
 * Typed JSON structures for audit logs
 * Provides type safety and validation for JSON fields (PostgreSQL only)
 */

// Field-level change tracking
type FieldChange {
  old String?   // Previous value (stringified)
  new String?   // New value (stringified)
}

// Changes map: { fieldName: { old, new } }
type AuditChanges {
  fields FieldChange[] @json
}

// Extensible metadata for event-specific data
type AuditMetadata {
  ipAddress String?
  userAgent String?
  requestId String?
  duration Int?         // Request duration in ms
  errorCode String?     // For failed operations
  errorMessage String?  // Error details
}

// Event count map for aggregations
type EventTypeCount {
  eventType String
  count Int
}

type EventTypeCounts {
  events EventTypeCount[] @json
}

/**
 * Generic Audit Log - Immutable record of sensitive operations
 * Retention: Variable by event type (see audit-requirements.md)
 *
 * Alternative to per-model audit tables (AuditUser, AuditSession, etc.)
 */
model AuditLog extends ImmutableModel {
  // Event identification
  eventType String                // e.g., "user.login.success"
  eventCategory String            // e.g., "authentication", "data_access"
  severity String                 // "info" | "warning" | "critical"

  // Actor (who did it)
  userId String?                  // Null if system-generated event
  user User? @relation(fields: [userId], references: [id])
  actorEmail String?              // Denormalized for fast search
  actorRole String?               // Role at time of event

  // Context (when/where)
  timestamp DateTime @default(now())
  ipAddress String?               // Pseudonymized after 90 days
  userAgent String?
  sessionId String?               // Last 8 chars only (security)

  // Target (what was affected)
  resourceType String?            // "User", "Document", "Organization"
  resourceId String?              // ID of affected resource

  // Changes (old → new values) - Typed JSON for type safety
  oldValue String? @json          // Previous state (typed via FieldChange[])
  newValue String? @json          // New state (typed via FieldChange[])
  changes AuditChanges? @json     // Diff object { fields: [{ old, new }] }

  // Additional context - Typed JSON for validation
  metadata AuditMetadata? @json   // Event-specific data (typed)

  // Retention tracking
  retentionDate DateTime?         // Auto-delete after this date
  pseudonymized Boolean @default(false) // IP/email replaced with hash?

  // Indexes for fast querying
  @@index([userId, timestamp])
  @@index([eventType, timestamp])
  @@index([resourceType, resourceId])
  @@index([retentionDate])        // For cleanup cron

  // Access control: Only admins can read audit logs
  // (create/update/delete policies inherited from ImmutableModel)
  @@allow('read', auth().role == ADMIN)

  // Exception: Users can read their own auth events
  @@allow('read', auth() == user && eventCategory == 'authentication')
}

/**
 * Audit Log Snapshot - Daily aggregations for long-term storage
 * After 1 year, detailed logs deleted, aggregates remain
 */
model AuditLogSnapshot extends Base {
  date DateTime @unique            // YYYY-MM-DD

  // Aggregated counts (typed JSON for type safety)
  totalEvents Int
  eventsByType EventTypeCounts @json  // [{ eventType: "user.login.success", count: 1234 }]
  uniqueUsers Int
  failedLogins Int
  dataExports Int
  configChanges Int

  // Anomalies detected
  suspiciousActivity String?       // Description of anomalies

  @@allow('read', auth().role == ADMIN)
  @@deny('update,delete', true)
}
```

**Benefits of Typed JSON**:

✅ **Type Safety**: TypeScript types generated for JSON fields

```typescript
import { AuditMetadata } from '@zenstackhq/runtime/models'

// Type-safe metadata creation
const metadata: AuditMetadata = {
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  requestId: 'req_abc123',
  duration: 250,
  errorCode: 'AUTH_FAILED',
  errorMessage: 'Invalid credentials',
}

// Compiler catches typos and type mismatches
await db.auditLog.create({
  data: {
    eventType: 'user.login.failed',
    metadata, // Type-checked!
  },
})
```

✅ **Validation**: Field-level validation enforced at runtime

```zmodel
type AuditMetadata {
  ipAddress String? @length(7, 45)  // IPv4/IPv6 validation
  duration Int? @gte(0)              // Non-negative duration
  errorCode String? @regex("^[A-Z_]+$")  // Uppercase snake_case
}
```

✅ **IntelliSense**: Auto-completion in IDE

- No more guessing field names
- See field descriptions in tooltips
- Navigate to type definitions

✅ **Refactoring**: Safe renames across codebase

- Rename type field → TypeScript errors where used
- Find all references to nested JSON fields

**Limitations**:

- ⚠️ **PostgreSQL only**: Typed JSON requires PostgreSQL database
- ⚠️ **No relations**: Cannot reference other models in types (use relational fields instead)

**Add to `schema.zmodel`**:

```zmodel
import './zschema/audit'
```

---

### 3. Create Logging ADR

**See**: ADR-007 Observability with Consola and OpenTelemetry (already created)

**Summary of Adopted Strategy**:

Implement a **three-tier observability stack**:

### Tier 1: Application Logs (Development & Debugging)

- **Library**: Consola (elegant console logger with custom reporters)
- **Format**: Fancy (dev), JSON (production)
- **Levels**: trace, debug, info, warn, error, fatal
- **Retention**: 7 days (Vercel default)
- **Location**: stdout (Vercel captures automatically)
- **PII Redaction**: Custom reporter auto-redacts `@meta(sensitivity)` fields

### Tier 2: Audit Logs (Compliance & Security)

- **Storage**: PostgreSQL (dedicated `AuditLog` table via ZenStack)
- **Format**: Typed JSON structures (see section 2 above)
- **Retention**: 1-3 years (event-dependent)
- **Access**: Admin-only, immutable (via `ImmutableModel`)
- **Encryption**: At-rest via Neon, in-transit via HTTPS

### Tier 3: Analytics Events (Product Insights)

- **Tool**: PostHog (existing, see ADR-005)
- **Purpose**: User behavior, feature adoption, funnels
- **Retention**: 90 days
- **Privacy**: Respects Do Not Track, allows opt-out

### Tier 4: Distributed Tracing & Metrics (NEW)

- **Library**: OpenTelemetry (vendor-neutral standard)
- **Traces**: Distributed tracing across tRPC routes, DB queries, external APIs
- **Metrics**: LETS metrics (Lead time, Error rate, Throughput, Saturation)
- **Backend**: Jaeger (self-hosted) → Grafana Cloud (at scale)
- **Cost**: $0 (self-hosted) → $100/month (managed)

**For full details, see**: `docs/adr/ADR-007-observability-with-consola-and-opentelemetry.md`

---

## Implementation Phases (from ADR-007)

### Phase 1: Consola (1 day) ✅ **DONE**

- [x] Install consola (`pnpm add consola`)
- [ ] Create `lib/logger.ts` with PII redaction reporter
- [ ] Create `lib/redactor.ts` with `@meta(sensitivity)` detection
- [ ] Replace console.log in critical paths
- [ ] Add logger to tRPC context

### Phase 2: OpenTelemetry (2-3 days)

- [ ] Install OpenTelemetry packages
- [ ] Create `lib/telemetry/instrumentation.ts`
- [ ] Create `lib/telemetry/metrics.ts` for LETS metrics
- [ ] Add trace context to logger (correlate logs ↔ traces)
- [ ] Configure OTLP exporter (Jaeger local, Grafana Cloud production)

### Phase 3: Audit Logging (3 days)

- [ ] Create `zschema/audit.zmodel` (already documented above)
- [ ] Run `pnpm gen:check` (generate tRPC routes)
- [ ] Create `lib/audit.ts` helper functions
- [ ] Implement audit logging in critical tRPC routes
- [ ] Create admin dashboard to view audit logs

### Phase 4: Retention & Cleanup (2 days)

- [ ] Create retention policy mapping (event type → retention period)
- [ ] Create cron job in `vercel.json`
- [ ] Implement pseudonymization (IP/email hashing after 90 days)
- [ ] Implement hard delete after retention period

---

**Status**: ADR-007 created, awaiting implementation

**Next Steps**:

1. Implement Phase 1 (Consola logging with PII redaction)
2. Deploy to staging and verify PII redaction works
3. Proceed with Phase 2 (OpenTelemetry) after Phase 1 validated

---

### 4. Define Monitoring Dashboards

**File**: `docs/observability/monitoring-dashboards.md`

**Observability Stack**: See ADR-007 for full implementation
**Metrics Framework**: LETS (Lead time, Error rate, Throughput, Saturation)
**Instrumentation**: OpenTelemetry for traces, metrics, and logs

````markdown
# Monitoring Dashboards

Last Updated: YYYY-MM-DD
Tool: OpenTelemetry (LETS metrics), PostHog (Analytics), Vercel Dashboard (Infrastructure)

## Dashboard 1: System Health (LETS Metrics)

**Purpose**: Real-time application health monitoring using DevOps LETS framework
**Audience**: Developers, On-call
**Update Frequency**: Real-time
**Instrumentation**: OpenTelemetry (see ADR-007)

### LETS Metrics (Four Keys to DevOps Performance)

**L - Lead Time** (Time from code commit → production deployment):

| Metric                        | Source                           | Alert Threshold |
| ----------------------------- | -------------------------------- | --------------- |
| **Request Duration (p50)**    | OpenTelemetry traces             | >500ms          |
| **Request Duration (p95)**    | OpenTelemetry traces             | >2 seconds      |
| **Request Duration (p99)**    | OpenTelemetry traces             | >5 seconds      |
| **Database Query Time (p95)** | OpenTelemetry DB instrumentation | >500ms          |

**E - Error Rate** (Percentage of failed requests):

| Metric                  | Source                             | Alert Threshold  |
| ----------------------- | ---------------------------------- | ---------------- |
| **HTTP 4xx Rate**       | OpenTelemetry HTTP instrumentation | >5% of requests  |
| **HTTP 5xx Rate**       | OpenTelemetry HTTP instrumentation | >1% of requests  |
| **tRPC Error Rate**     | OpenTelemetry custom spans         | >2% of requests  |
| **Database Error Rate** | OpenTelemetry DB instrumentation   | >0.1% of queries |
| **Failed Logins**       | AuditLog (custom metric)           | >10 per hour     |

**T - Throughput** (Requests per second):

| Metric                   | Source                             | Alert Threshold |
| ------------------------ | ---------------------------------- | --------------- |
| **HTTP Requests/sec**    | OpenTelemetry HTTP instrumentation | Baseline ±50%   |
| **tRPC Calls/sec**       | OpenTelemetry custom spans         | Baseline ±50%   |
| **Database Queries/sec** | OpenTelemetry DB instrumentation   | Baseline ±50%   |

**S - Saturation** (Resource utilization):

| Metric                       | Source                           | Alert Threshold |
| ---------------------------- | -------------------------------- | --------------- |
| **Node.js Heap Used**        | OpenTelemetry runtime metrics    | >85% of max     |
| **Event Loop Lag**           | OpenTelemetry runtime metrics    | >100ms          |
| **Database Connection Pool** | OpenTelemetry DB instrumentation | >90% utilized   |
| **API Rate Limit Hits**      | Application logs                 | >100 per hour   |

### Alerts

**Critical** (Page on-call):

- **Error rate** >5% for >5 minutes (E metric)
- **Lead time p99** >10s for >5 minutes (L metric)
- **Saturation** >95% heap or connections for >2 minutes (S metric)
- Database connection failures
- Authentication service down

**Warning** (Slack notification):

- **Error rate** >1% for >15 minutes (E metric)
- **Lead time p95** >2s for >10 minutes (L metric)
- **Throughput** deviates >50% from baseline for >10 minutes (T metric)
- **Saturation** >85% for >5 minutes (S metric)
- Failed login spike >10 per hour (potential brute force)

**Implementation**: OpenTelemetry → Jaeger (dev) / Grafana Cloud (prod)

---

## Dashboard 2: Security & Audit

**Purpose**: Detect suspicious activity and security incidents
**Audience**: Security team, Admins
**Update Frequency**: Hourly

### Metrics

| Event                     | Source   | Alert Condition                   |
| ------------------------- | -------- | --------------------------------- |
| **Failed Login Attempts** | AuditLog | >10 from same IP in 1 hour        |
| **Role Changes**          | AuditLog | Any role change (immediate alert) |
| **Data Exports**          | AuditLog | >5 per user per day               |
| **MFA Disabled**          | AuditLog | Any MFA disable (immediate alert) |
| **Admin Actions**         | AuditLog | Track all admin operations        |

### Alerts

**Critical**:

- Role escalation detected (user.role.changed)
- MFA disabled (user.mfa.disabled)
- Bulk data export (>1000 records)

**Implementation**: PostHog Insight with Slack webhook

**Query Example** (PostHog):

```sql
SELECT
  date_trunc('hour', timestamp) as hour,
  COUNT(*) as failed_logins
FROM audit_log
WHERE event_type = 'user.login.failed'
GROUP BY hour
HAVING COUNT(*) > 10
```
````

---

## Dashboard 3: User Activity & Engagement

**Purpose**: Product analytics and feature adoption
**Audience**: Product Manager, Founders
**Update Frequency**: Daily

### Metrics

| Metric                       | Definition                        | Target              |
| ---------------------------- | --------------------------------- | ------------------- |
| **Daily Active Users (DAU)** | Unique users per day              | Growth >5% WoW      |
| **Feature Adoption**         | % users who used Feature X        | >30% within 30 days |
| **Activation Rate**          | % users who completed onboarding  | >60%                |
| **Retention (D7, D30)**      | % users returning after 7/30 days | D7: >40%, D30: >20% |

**Implementation**: PostHog Trends & Funnels

---

## Dashboard 4: Business Metrics

**Purpose**: Revenue and growth tracking
**Audience**: Founders, Investors
**Update Frequency**: Weekly

### Metrics

| Metric              | Source            | Calculation                |
| ------------------- | ----------------- | -------------------------- |
| **MRR**             | Stripe + Database | SUM(active_subscriptions)  |
| **Churn Rate**      | Database          | Canceled / Total customers |
| **ARPU**            | Calculated        | MRR / Paid customers       |
| **Conversion Rate** | PostHog Funnel    | Sign-ups → Paid            |

**Implementation**: Manual report (see Unit Economics Agent)

---

## Alerting Configuration

### Slack Alerts (via PostHog Webhooks)

**Channel**: `#alerts-production`

**Critical Alerts** (@ channel):

- Error rate spike
- Security event (role change, MFA disabled)
- Payment failure spike

**Warning Alerts**:

- Performance degradation
- Failed login spike
- Unusual data export activity

### Email Alerts

**Recipients**: Founders, on-call engineer

**Triggers**:

- Database backup failure
- SSL certificate expiring (<7 days)
- Audit log retention job failure

---

## Monitoring Implementation

### Step 1: PostHog Insights

Create insights for each metric:

1. Go to PostHog → Insights → New Insight
2. Select event (e.g., `user.login.failed`)
3. Add filters (e.g., `timestamp > now() - 1 hour`)
4. Set aggregation (count, unique users, etc.)
5. Save to dashboard

### Step 2: Alerts

For each critical metric:

1. Create insight
2. Click "Set Alert"
3. Configure threshold (e.g., "count > 10")
4. Add Slack webhook URL
5. Test alert

### Step 3: Vercel Monitoring

Enable in Vercel dashboard:

1. Project Settings → Monitoring
2. Enable Error Tracking
3. Enable Performance Monitoring
4. Set notification preferences

---

## Runbook: Responding to Alerts

### Alert: Failed Login Spike

**Symptoms**: >10 failed logins in 1 hour from same IP
**Likely Cause**: Brute force attack

**Response**:

1. Check AuditLog for IP address and affected accounts
2. If same email targeted: Lock account temporarily
3. If distributed IPs: Rate limit login endpoint
4. Notify affected users via email

**Prevention**: Implement rate limiting (ADR-XXX)

---

### Alert: Role Change

**Symptoms**: user.role.changed event
**Likely Cause**: Admin granted privileges OR unauthorized escalation

**Response**:

1. Check AuditLog for who changed whose role
2. Verify with admin (Slack message): "Did you promote user X?"
3. If unauthorized: Immediately revoke, reset admin credentials
4. If authorized: Acknowledge and dismiss

**Prevention**: Require MFA for role changes

---

### Alert: Database Query Slow

**Symptoms**: p95 query time >500ms
**Likely Cause**: Missing index, N+1 query, table scan

**Response**:

1. Check Vercel logs for slow queries
2. Identify table and query pattern
3. Check Prisma schema for missing indexes
4. If missing index: Create migration, deploy
5. If N+1 query: Optimize with `include` in Prisma

**Prevention**: Load testing before major releases

````

---

### 5. Define Data Retention Policy

**File**: `docs/observability/data-retention-policy.md`

```markdown
# Data Retention Policy

Last Updated: YYYY-MM-DD
Compliance: GDPR Article 5(e), CCPA

## Retention Periods by Data Type

### Audit Logs

| Event Category | Retention | Justification | Deletion Method |
|----------------|-----------|---------------|-----------------|
| **Authentication** | 1 year | Security investigation, detect patterns | Hard delete after 1 year |
| **Authorization** (role changes) | 3 years | Compliance (SOC2), legal disputes | Hard delete after 3 years |
| **Data Access** | 90 days | GDPR right of access verification | Pseudonymize after 90 days, delete after 1 year |
| **Data Modifications** | 1 year | Change tracking, rollback capability | Hard delete after 1 year |
| **Configuration** | 3 years | System audit, disaster recovery | Hard delete after 3 years |

**Pseudonymization** (after initial period):
- Replace IP address with SHA-256 hash
- Replace email with userId (retain link to User record)
- Keep audit trail structure, reduce PII

**Hard Deletion** (after retention period):
- `DELETE FROM audit_log WHERE retention_date < NOW()`
- Run daily via cron job

---

### Application Logs

| Log Type | Retention | Justification | Storage |
|----------|-----------|---------------|---------|
| **Info/Debug** | 7 days | Development debugging | Vercel (automatic) |
| **Warnings** | 30 days | Troubleshooting recurring issues | Vercel (automatic) |
| **Errors** | 90 days | Bug investigation | Vercel (automatic) |

**Auto-deletion**: Vercel automatically deletes logs after retention period.

---

### Analytics Events (PostHog)

| Event Type | Retention | Justification |
|------------|-----------|---------------|
| **Product Events** | 90 days | Product analytics, feature adoption tracking |
| **User Properties** | Account lifetime | Cohort analysis, user segmentation |

**Configuration**: Set in PostHog dashboard → Project Settings → Data Retention.

---

### User Account Data

| Data Type | Retention | Deletion Trigger |
|-----------|-----------|------------------|
| **Active Account** | Account lifetime | User chooses to delete account |
| **Deleted Account** | 30 days (soft delete) | After 30 days → hard delete |
| **Account Backups** | 30 days | Neon automatic backups |

**Soft Delete Process**:
1. User clicks "Delete Account"
2. `user.deletedAt = NOW()` (soft delete marker)
3. User data hidden from app
4. Grace period: 30 days (user can reactivate)
5. After 30 days: Hard delete via cron job

**Hard Delete Process**:
```sql
-- Cron job runs daily
DELETE FROM users WHERE deleted_at < NOW() - INTERVAL '30 days';
-- Cascade deletes all related data (posts, comments, etc.)
````

---

### Financial Data (Stripe)

| Data Type           | Retention             | Justification              |
| ------------------- | --------------------- | -------------------------- |
| **Invoices**        | 7 years               | Tax compliance (IRS/HMRC)  |
| **Payment Methods** | Until removed by user | PCI-DSS, managed by Stripe |

**Note**: Managed by Stripe, not stored in our database.

---

## Compliance Requirements

### GDPR (Article 5e): Storage Limitation

> "Personal data shall be kept in a form which permits identification of data subjects for no longer than is necessary."

**Implementation**:

- ✅ Defined retention periods for each data type
- ✅ Pseudonymization after initial period (reduce PII exposure)
- ✅ Hard deletion after business/legal requirement expires

### CCPA: Right to Deletion

**User Request Process**:

1. User emails privacy@[company].com
2. Verify identity (send confirmation email)
3. Trigger hard delete immediately (override soft delete grace period)
4. Confirm deletion within 45 days

---

## Retention Policy Implementation

### Database Schema

Add `retentionDate` field to audit logs:

```typescript
// lib/audit.ts
const RETENTION_PERIODS = {
  'user.login.success': 365, // 1 year (days)
  'user.login.failed': 365,
  'user.role.changed': 1095, // 3 years
  'data.viewed': 90, // 90 days
  'data.updated': 365,
  'config.changed': 1095,
} as const

export function calculateRetentionDate(eventType: string): Date {
  const days = RETENTION_PERIODS[eventType] || 365 // Default 1 year
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}
```

### Cleanup Cron Job (Convention Over Configuration)

**File**: `app/api/cron/cleanup/route.ts`

**Convention-Based Approach**:

- Auto-discover all models extending `ImmutableModel` (audit tables)
- Auto-discover all models with `deletedAt` field (soft-deleted records)
- Auto-discover all models with `retentionDate` field (expirable records)
- Smart defaults based on `zschema/auth.zmodel` fields

**Implementation**: See `app/api/cron/cleanup/route.ts` (to be created)

**Convention Rules**:

| Field/Model Pattern                | Action                                          | Default Retention          |
| ---------------------------------- | ----------------------------------------------- | -------------------------- |
| `extends ImmutableModel`           | Delete records where `retentionDate < now()`    | Per-event type (1-3 years) |
| `deletedAt DateTime?`              | Hard delete where `deletedAt < now() - 30 days` | 30 days grace period       |
| `expiredAt DateTime?`              | Delete where `expiredAt < now()`                | Immediate after expiry     |
| `ipAddress String?` in audit model | Pseudonymize (SHA-256) after 90 days            | GDPR requirement           |
| `session` table                    | Delete expired sessions                         | Per Better-Auth config     |

**Smart Defaults from auth.zmodel**:

```typescript
// Auto-detected from schema
const SCHEMA_CONVENTIONS = {
  // Models extending ImmutableModel (audit tables)
  immutableModels: ['AuditLog', 'AuditUser', 'AuditSession', 'AuditLogSnapshot'],

  // Models with soft delete (deletedAt field)
  softDeleteModels: ['User', 'Organization', 'Document'], // Auto-detected

  // Models with expiry (session, tokens)
  expirableModels: [
    { model: 'Session', field: 'expiresAt', immediate: true },
    { model: 'VerificationToken', field: 'expiresAt', immediate: true },
    { model: 'PasswordResetToken', field: 'expiresAt', immediate: true },
  ],

  // PII pseudonymization (GDPR compliance)
  pseudonymizeFields: [
    { model: 'AuditLog', field: 'ipAddress', after: 90 }, // 90 days
    { model: 'AuditUser', field: 'ipAddress', after: 90 },
  ],
}
```

**Job Execution Flow**:

1. **Discover** → Scan schema for conventions (run once at startup)
2. **Pseudonymize** → Hash PII fields in audit tables after 90 days
3. **Expire** → Delete records past `retentionDate` or `expiresAt`
4. **Soft Delete** → Hard delete records with `deletedAt > 30 days`
5. **Report** → Return counts of records processed

**Cron Configuration** (`vercel.json`):

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Environment Variable**:

```env
CRON_SECRET="<generate with openssl rand -base64 32>"
```

**Benefits of Convention Over Configuration**:

- ✅ **Zero boilerplate**: Add `deletedAt` field → auto-cleanup enabled
- ✅ **Consistent**: All audit tables cleaned up the same way
- ✅ **Safe defaults**: GDPR-compliant retention periods built-in
- ✅ **Discoverable**: New models automatically included
- ✅ **Testable**: Mock schema discovery for unit tests

**Example Usage**:

```zmodel
// Soft delete pattern (auto-cleanup after 30 days)
model Document extends BaseModel {
  deletedAt DateTime?  // Convention: hard delete after 30 days
}

// Expirable token (auto-cleanup immediately)
model PasswordResetToken {
  id String @id
  expiresAt DateTime  // Convention: delete when expired
}

// Audit table (auto-cleanup per retention policy)
model AuditDocument extends ImmutableModel {
  retentionDate DateTime?  // Convention: delete after this date
  ipAddress String?         // Convention: pseudonymize after 90 days
}
```

**See Implementation**: `app/api/cron/cleanup/route.ts` (to be created in Phase 4)

---

## Testing Retention Policy

### Test Scenarios

**Test 1: Pseudonymization**

1. Create audit log with IP address
2. Set timestamp to 91 days ago (manually for testing)
3. Run cleanup cron
4. Verify: `ipAddress` is now a SHA-256 hash, `pseudonymized = true`

**Test 2: Hard Deletion**

1. Create audit log with `retentionDate` in the past
2. Run cleanup cron
3. Verify: Audit log no longer exists

**Test 3: Soft Delete Grace Period**

1. User deletes account (`deletedAt = NOW()`)
2. User data hidden from app
3. After 30 days (or manually set for testing), run cleanup cron
4. Verify: User record deleted, cascades to related data

---

## Monitoring Retention Policy

**Metrics to Track**:

- Audit logs deleted per day (should be predictable)
- Database size trend (should not grow indefinitely)
- Pseudonymization success rate (100%)
- User data deletion success rate (100%)

**Alerts**:

- Cleanup cron failure (Vercel cron monitoring)
- Audit log table size exceeds threshold (>10GB)

---

## Documentation for Users

**Privacy Policy** should state:

> "We retain your personal data for as long as necessary to provide our services. Audit logs are kept for 1-3 years depending on the type of activity. After your account is deleted, we retain your data for 30 days to allow for account recovery, after which all personal data is permanently deleted."

**User Dashboard** should show:

- "Your account will be permanently deleted on YYYY-MM-DD" (during soft delete grace period)
- "Request data deletion" button (GDPR/CCPA right)

```

---

### 6. Coordinate with Other Agents

**Compliance Agent**:
- **Input from Compliance**: Audit log requirements (GDPR Article 30, SOC2 controls)
- **Output to Compliance**: Audit log implementation status, retention policy
- **Coordination**: Ensure PII handling in logs meets GDPR requirements

**Backend Developer Agent**:
- **Input to Backend**: Audit log data model (`zschema/audit.zmodel`)
- **Input to Backend**: Audit helper functions (`lib/audit.ts`)
- **Coordination**: Implement audit logging in tRPC routes for critical operations

**Frontend Developer Agent**:
- **Input to Frontend**: Admin dashboard to view audit logs
- **Coordination**: Display audit trail for users (their own auth events)

**Support Triage Agent**:
- **Input from Support**: Common debugging scenarios (what logs would help?)
- **Output to Support**: How to read audit logs for customer support cases
- **Coordination**: Log customer support actions (ticket viewed, data exported for support)

**Quality Reviewer Agent**:
- **Input from QA**: Debugging challenges (what logs are missing?)
- **Output to QA**: How to use logs for bug investigation

---

## Anti-Patterns to Avoid

❌ **Over-Logging**:
- Don't log every database query (noise, performance impact)
- Don't log sensitive data (passwords, credit cards, full session tokens)

❌ **Under-Logging**:
- Don't skip audit logs for "minor" operations (they matter for compliance)
- Don't forget to log failures (failed login attempts are critical)

❌ **Inconsistent Formatting**:
- Don't mix structured (JSON) and unstructured (plain text) logs
- Use consistent event naming (`user.login.success`, not `loginSuccess` or `USER_LOGIN`)

❌ **Infinite Retention**:
- Don't keep logs forever (storage cost, GDPR violation)
- Implement retention policy from day one

❌ **Mutable Audit Logs**:
- Never allow updates or deletes of audit logs (except automated retention cleanup)
- Audit logs must be immutable for integrity

---

## Deliverables Checklist

- [ ] `docs/observability/audit-requirements.md` - Comprehensive audit event catalog
- [ ] `zschema/audit.zmodel` - Audit log data model
- [ ] `docs/adr/DRAFT-adr-logging-strategy.md` - Logging ADR (HITL approval required)
- [ ] `lib/logger.ts` - Application logging utility (Pino)
- [ ] `lib/audit.ts` - Audit logging helper functions
- [ ] `docs/observability/monitoring-dashboards.md` - Dashboard specifications
- [ ] `docs/observability/data-retention-policy.md` - Retention policy documentation
- [ ] `app/api/cron/cleanup-audit-logs/route.ts` - Retention cleanup cron
- [ ] HITL for ADR approval
- [ ] User stories for implementation (if needed)

---

## Success Metrics

**Implementation Quality**:
- ✅ All critical operations create audit log entries
- ✅ Audit logs are queryable and searchable
- ✅ Retention policy automatically deletes old logs (tested)
- ✅ No PII logged in plaintext in application logs
- ✅ Audit logs are immutable (no update/delete permissions)

**Compliance Indicators**:
- ✅ GDPR Article 30 compliant (record of processing activities)
- ✅ SOC 2 logging controls implemented
- ✅ Can demonstrate audit trail for any user action
- ✅ Data retention policy documented and enforced

**Operational Metrics**:
- ✅ Security alerts configured and tested
- ✅ Mean time to detection (MTTR) for incidents <1 hour
- ✅ Audit log queries return results in <2 seconds
- ✅ Storage costs within budget (<$100/month)

---

**See Also**:
- `docs/legal/compliance-checklist.md` - Compliance requirements
- `.claude/agents/compliance-agent.md` - Compliance coordination
- `.claude/agents/backend-developer.md` - Implementation
- `docs/PHILOSOPHY.md` - Governance and accountability principles
```
