# Logging Standards

**Last Updated**: 2025-11-16
**Status**: ACTIVE
**Owner**: Observability Agent
**Review Cycle**: Quarterly

---

## Purpose

This document defines logging standards for [COMPANY NAME] to ensure:

- Consistent log format across all services
- Effective debugging and troubleshooting
- Security compliance (GDPR, CCPA)
- Performance monitoring
- Incident response capabilities

---

## 1. What to Log

### 1.1 Authentication Events

**MUST log**:

- ✅ User login attempts (success and failure)
- ✅ User logout
- ✅ Password reset requests
- ✅ OAuth authentication (provider, success/failure)
- ✅ Session creation and expiration
- ✅ Multi-factor authentication events
- ✅ Account lockouts

**Log level**: INFO (success), WARN (failure)

**Example**:

```json
{
  "timestamp": "2025-11-16T12:34:56.789Z",
  "level": "INFO",
  "event": "user.login.success",
  "userId": "user_123",
  "email": "user@example.com",
  "method": "oauth.google",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "sessionId": "sess_abc123"
}
```

### 1.2 Data Access Events

**MUST log**:

- ✅ Sensitive data reads (user profiles, payment info)
- ✅ Bulk data exports
- ✅ Admin access to user data
- ✅ API calls accessing user data
- ✅ Database queries on sensitive tables

**Log level**: INFO

**Example**:

```json
{
  "timestamp": "2025-11-16T12:34:56.789Z",
  "level": "INFO",
  "event": "data.access",
  "userId": "user_123",
  "resource": "users",
  "resourceId": "user_456",
  "action": "read",
  "fields": ["email", "profile"],
  "ipAddress": "192.168.1.100"
}
```

### 1.3 Data Modification Events

**MUST log**:

- ✅ Create, update, delete operations on all entities
- ✅ Bulk operations (batch updates, deletions)
- ✅ Data imports/exports
- ✅ Schema migrations
- ✅ Configuration changes

**Log level**: INFO

**Example**:

```json
{
  "timestamp": "2025-11-16T12:34:56.789Z",
  "level": "INFO",
  "event": "data.modify",
  "userId": "user_123",
  "resource": "projects",
  "resourceId": "proj_789",
  "action": "update",
  "changedFields": ["name", "status"],
  "previousValues": { "status": "draft" },
  "newValues": { "status": "published" }
}
```

### 1.4 Authorization Events

**MUST log**:

- ✅ Permission checks (allowed and denied)
- ✅ Role changes
- ✅ Organization membership changes
- ✅ Resource sharing (invitations, access grants)

**Log level**: INFO (allowed), WARN (denied)

**Example**:

```json
{
  "timestamp": "2025-11-16T12:34:56.789Z",
  "level": "WARN",
  "event": "authorization.denied",
  "userId": "user_123",
  "resource": "projects",
  "resourceId": "proj_789",
  "action": "delete",
  "reason": "insufficient_permissions",
  "requiredRole": "admin",
  "userRole": "member"
}
```

### 1.5 Errors and Exceptions

**MUST log**:

- ✅ All unhandled exceptions
- ✅ API errors (4xx, 5xx responses)
- ✅ Database connection errors
- ✅ Third-party service failures
- ✅ Validation errors (on server side)
- ✅ Rate limiting events

**Log level**: ERROR (server errors), WARN (client errors)

**Example**:

```json
{
  "timestamp": "2025-11-16T12:34:56.789Z",
  "level": "ERROR",
  "event": "error.unhandled",
  "errorType": "DatabaseConnectionError",
  "errorMessage": "Connection timeout to database",
  "stackTrace": "Error: Connection timeout...",
  "userId": "user_123",
  "requestId": "req_xyz",
  "endpoint": "/api/projects",
  "method": "POST"
}
```

### 1.6 Performance and Monitoring

**SHOULD log**:

- ✅ Slow queries (> 1 second)
- ✅ API response times (> 500ms)
- ✅ Memory usage spikes
- ✅ High CPU usage
- ✅ Queue depths

**Log level**: WARN (slow), INFO (normal)

**Example**:

```json
{
  "timestamp": "2025-11-16T12:34:56.789Z",
  "level": "WARN",
  "event": "performance.slow_query",
  "query": "SELECT * FROM users WHERE...",
  "executionTime": 1523,
  "threshold": 1000,
  "userId": "user_123",
  "requestId": "req_xyz"
}
```

### 1.7 Business Events

**SHOULD log**:

- ✅ User signups
- ✅ Subscription changes
- ✅ Payment transactions
- ✅ Feature usage (major features)
- ✅ Data exports

**Log level**: INFO

**Example**:

```json
{
  "timestamp": "2025-11-16T12:34:56.789Z",
  "level": "INFO",
  "event": "business.subscription.upgraded",
  "userId": "user_123",
  "previousPlan": "free",
  "newPlan": "pro",
  "amount": 29.99,
  "currency": "USD"
}
```

---

## 2. Log Format

### 2.1 Structured Logging (JSON)

**All logs MUST be in JSON format** for easy parsing and analysis.

**Required fields**:

- `timestamp`: ISO 8601 format (UTC)
- `level`: DEBUG | INFO | WARN | ERROR
- `event`: Event type in dot notation (e.g., `user.login.success`)
- `message`: Human-readable description (optional)

**Recommended fields**:

- `userId`: User ID (if applicable)
- `requestId`: Unique request identifier (for tracing)
- `sessionId`: Session identifier
- `ipAddress`: Client IP (anonymized if required)
- `userAgent`: Browser/client info
- `environment`: production | staging | development

**Example**:

```json
{
  "timestamp": "2025-11-16T12:34:56.789Z",
  "level": "INFO",
  "event": "user.login.success",
  "message": "User logged in successfully",
  "userId": "user_123",
  "email": "user@example.com",
  "requestId": "req_abc123",
  "sessionId": "sess_xyz789",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "environment": "production"
}
```

### 2.2 Log Levels

| Level     | Use Case                            | Examples                                             |
| --------- | ----------------------------------- | ---------------------------------------------------- |
| **DEBUG** | Detailed diagnostic info (dev only) | Variable values, function calls, detailed flow       |
| **INFO**  | Normal operations                   | User actions, successful operations, business events |
| **WARN**  | Potential issues (recoverable)      | Deprecated API usage, slow queries, failed login     |
| **ERROR** | Error conditions (action required)  | Exceptions, failures, data corruption                |

**Environment-specific logging**:

- **Production**: INFO, WARN, ERROR only
- **Staging**: DEBUG, INFO, WARN, ERROR
- **Development**: DEBUG, INFO, WARN, ERROR

---

## 3. PII (Personally Identifiable Information) Handling

### 3.1 NEVER Log (Sensitive PII)

**Prohibited data**:

- ❌ Passwords (plaintext or hashed)
- ❌ API keys, tokens, secrets
- ❌ Credit card numbers (full or partial)
- ❌ Social Security Numbers
- ❌ Passport numbers
- ❌ Private encryption keys
- ❌ OAuth access tokens/refresh tokens
- ❌ Session tokens (in plaintext)
- ❌ Biometric data

**Example of WRONG logging**:

```json
// ❌ WRONG - Never do this
{
  "event": "user.login",
  "email": "user@example.com",
  "password": "MyPassword123!" // ❌ NEVER LOG PASSWORDS
}
```

### 3.2 Redact or Hash (Moderate PII)

**Use hashing or redaction**:

- ⚠️ Email addresses: Hash or redact domain (e.g., `u***@example.com`)
- ⚠️ IP addresses: Anonymize last octet (e.g., `192.168.1.xxx`)
- ⚠️ Phone numbers: Redact middle digits (e.g., `+1-555-***-1234`)
- ⚠️ Session IDs: Only log if necessary for debugging

**Redaction example**:

```json
{
  "event": "user.login.success",
  "email": "u***@example.com", // Redacted
  "ipAddress": "192.168.1.xxx" // Anonymized
}
```

### 3.3 Safe to Log

**Non-sensitive identifiers**:

- ✅ User IDs (internal UUIDs, not emails)
- ✅ Organization IDs
- ✅ Resource IDs (projects, documents)
- ✅ Timestamps
- ✅ HTTP methods, status codes
- ✅ Error types and messages (without sensitive data)

---

## 4. Log Retention

### 4.1 Retention Periods (GDPR/CCPA Compliance)

| Log Type               | Retention Period | Reason                            |
| ---------------------- | ---------------- | --------------------------------- |
| Authentication logs    | 90 days          | Security auditing                 |
| Data access logs       | 90 days          | Compliance (GDPR right to access) |
| Error logs             | 30 days          | Debugging                         |
| Performance logs       | 7 days           | Optimization                      |
| Business event logs    | 365 days         | Analytics, billing                |
| Security incident logs | 2 years          | Legal compliance                  |

**Automatic deletion**: Logs MUST be automatically deleted after retention period expires.

**Backup logs**: Logs in backups follow the same retention policy.

### 4.2 Log Archiving

For logs requiring long-term retention:

- Archive to cold storage (S3, Glacier)
- Compress before archiving
- Encrypt archived logs
- Document archive locations

---

## 5. Log Storage and Access

### 5.1 Storage Locations

**Production logs**:

- **Primary**: Vercel logs (native platform logging)
- **Aggregation**: [PostHog, Sentry, CloudWatch, etc.]
- **Backup**: [S3, etc.]

**Development logs**:

- Console output (stdout/stderr)
- Local files (`.log` files gitignored)

### 5.2 Access Control

**Who can access logs**:

- **Production logs**: DevOps, CTO, security team only
- **Staging logs**: Developers, QA
- **Development logs**: Individual developers (their own environment)

**Audit trail**: Log all access to production logs.

---

## 6. Implementation Guidelines

### 6.1 Logging Libraries

**Recommended libraries**:

- **Node.js**: [Winston](https://github.com/winstonjs/winston), [Pino](https://github.com/pinojs/pino)
- **Next.js**: Server-side logging only (avoid client-side logging of sensitive data)

**Configuration**:

```typescript
// Example: Winston setup (server/lib/logger.ts)
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

export default logger
```

### 6.2 Usage Examples

**Authentication event**:

```typescript
import logger from '@/server/lib/logger'

logger.info({
  event: 'user.login.success',
  userId: user.id,
  email: redactEmail(user.email), // Redaction helper
  method: 'oauth.google',
  ipAddress: anonymizeIP(req.ip),
  requestId: req.id,
})
```

**Error logging**:

```typescript
try {
  await dangerousOperation()
} catch (error) {
  logger.error({
    event: 'error.unhandled',
    errorType: error.name,
    errorMessage: error.message,
    stackTrace: error.stack,
    userId: req.user?.id,
    requestId: req.id,
    endpoint: req.url,
    method: req.method,
  })
  throw error
}
```

**Data access logging**:

```typescript
logger.info({
  event: 'data.access',
  userId: req.user.id,
  resource: 'projects',
  resourceId: projectId,
  action: 'read',
  ipAddress: anonymizeIP(req.ip),
  requestId: req.id,
})
```

### 6.3 Helper Functions

**IP Anonymization**:

```typescript
function anonymizeIP(ip: string): string {
  if (!ip) return 'unknown'
  const parts = ip.split('.')
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`
  }
  return 'anonymized'
}
```

**Email Redaction**:

```typescript
function redactEmail(email: string): string {
  if (!email) return 'unknown'
  const [local, domain] = email.split('@')
  return `${local[0]}***@${domain}`
}
```

---

## 7. Monitoring and Alerting

### 7.1 Critical Alerts

Set up alerts for:

- ⚠️ High error rate (> 1% of requests)
- ⚠️ Authentication failures (> 10 per minute per user)
- ⚠️ Database connection failures
- ⚠️ Third-party service outages
- ⚠️ Unusual data access patterns (potential breach)

### 7.2 Log Analysis

**Regular reviews**:

- Daily: Error logs
- Weekly: Performance logs, slow queries
- Monthly: Security logs, access patterns

**Tools**:

- PostHog: User behavior, feature usage
- Sentry: Error tracking
- Vercel Analytics: Performance monitoring

---

## 8. Security and Compliance

### 8.1 Encryption

- ✅ Logs in transit: TLS/SSL
- ✅ Logs at rest: Encrypted storage (if required by compliance)

### 8.2 Compliance Requirements

**GDPR**:

- Right to erasure: Delete user's log data upon request
- Data minimization: Log only necessary data
- Purpose limitation: Use logs only for stated purposes

**CCPA**:

- Disclosure: Inform users what we log (Privacy Policy)
- Opt-out: Allow users to opt-out of analytics logging

**SOC 2** (if applicable):

- Access controls: Limit log access
- Audit trails: Log access to logs
- Retention: Follow documented retention policy

---

## 9. Debugging Best Practices

### 9.1 Request Tracing

**Use request IDs** to trace requests across services:

```typescript
// Middleware to add request ID
app.use((req, res, next) => {
  req.id = generateRequestId() // UUID
  res.setHeader('X-Request-ID', req.id)
  next()
})

// Include in all logs
logger.info({
  event: 'api.request',
  requestId: req.id,
  endpoint: req.url,
  method: req.method,
})
```

### 9.2 Context Propagation

Pass context through async operations:

```typescript
// Use AsyncLocalStorage for context
import { AsyncLocalStorage } from 'async_hooks'

const requestContext = new AsyncLocalStorage()

// Middleware
app.use((req, res, next) => {
  requestContext.run({ requestId: req.id, userId: req.user?.id }, next)
})

// In any function
logger.info({
  ...requestContext.getStore(),
  event: 'database.query',
  query: sql,
})
```

---

## 10. Checklist for Developers

Before merging code with logging:

- [ ] Using JSON structured logging format
- [ ] Included required fields (timestamp, level, event)
- [ ] Not logging sensitive PII (passwords, tokens, full emails)
- [ ] Using appropriate log level (DEBUG/INFO/WARN/ERROR)
- [ ] Added request ID for tracing
- [ ] Tested log output in development
- [ ] Verified log retention compliance
- [ ] Added context for debugging (userId, resourceId)

---

## References

- Privacy Policy: `docs/legal/privacy-policy-draft.md`
- Observability Agent: `.claude/agents/observability-agent.md`
- GDPR Compliance: [GDPR Official Text](https://gdpr-info.eu/)
- OWASP Logging Cheat Sheet: [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

---

**Maintained by**: Observability Agent
**Questions**: [DEVOPS EMAIL]
**Last Reviewed**: 2025-11-16
**Next Review**: 2026-02-16
