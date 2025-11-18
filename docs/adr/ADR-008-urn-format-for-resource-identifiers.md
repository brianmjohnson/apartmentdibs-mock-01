# ADR-008: URN Format for Resource Identifiers

**Status:** DRAFT
**Date:** 2025-11-16
**Author:** System Architecture <system@example.com>

---

## Context

**What is the issue or problem we're solving?**

We need a consistent, unambiguous format for identifying resources (users, profiles, documents, organizations) across our system, particularly in audit logs, API responses, permissions checks, and cross-service references.

**Background**:
- Current implementation uses colon-separated format: `"user:12345"` and `"profile:12345"`
- This format is simple but lacks formal structure and namespace isolation
- As the system grows with multiple resource types (profiles, documents, organizations, teams), we need clear disambiguation
- Audit logs need to reference resources uniquely across their lifecycle (even after deletion or ID changes)

**Requirements**:
- **Unambiguous**: Clear distinction between resource type and identifier
- **Globally Unique**: Resource identifiers should not collide across types
- **Human-Readable**: Developers can understand the format without tooling
- **Standards-Based**: Follow established conventions (RFC 8141)
- **Future-Proof**: Support namespaces for multi-tenancy, cross-service references
- **Audit Trail**: Enable tracing resources across their entire lifecycle

**Scope**:
- **Included**: Audit logs, API responses (where resource references are returned), permission checks
- **Out of Scope**: Database primary keys (remain as CUIDs), internal implementation details

---

## Decision

**We will use URN (Uniform Resource Name) format for all resource identifiers in audit logs, API responses, and cross-service references.**

**Format**: `urn:{resource-type}:{identifier}`

**Examples**:
```
urn:user:01JCQX8QZKE9W8H4N2F1RSTVBG
urn:profile:01JCQX8QZKE9W8H4N2F1RSTVBG
urn:organization:01JCQXABC123DEFGHIJK
urn:document:01JCQXDEF456GHIJKLMN
urn:session:01JCQXGHI789JKLMNOPQ
```

**Implementation Approach**:
1. **Create utility functions** for URN generation and parsing:
   ```typescript
   // lib/utils/urn.ts
   export function toURN(resourceType: string, id: string): string {
     return `urn:${resourceType}:${id}`
   }

   export function parseURN(urn: string): { resourceType: string; id: string } | null {
     const match = urn.match(/^urn:([^:]+):([^:]+)$/)
     if (!match) return null
     return { resourceType: match[1], id: match[2] }
   }

   export function extractId(urn: string): string | null {
     const parsed = parseURN(urn)
     return parsed?.id ?? null
   }
   ```

2. **Update audit log schema**:
   ```typescript
   model AuditLog extends ImmutableModel {
     actor    String  // urn:user:01JCQX...
     resource String  // urn:profile:01JCQX...
     action   String  // user.profile.update
     // ...
   }
   ```

3. **Gradual Migration**:
   - New audit logs use URN format immediately
   - Legacy logs with `"user:12345"` format remain readable
   - Parsing function handles both formats for backward compatibility

**Why This Approach**:
1. **Standards-Based**: URN is defined in RFC 8141, widely understood by developers
2. **Namespace Isolation**: Clear separation between resource type and identifier prevents collisions
3. **Extensibility**: Can extend to hierarchical URNs (`urn:org:acme:user:12345`) for multi-tenancy
4. **Audit Compliance**: SOC2, GDPR, and HIPAA audits require unambiguous resource identification

**Example/Proof of Concept**:
```typescript
// Before (ambiguous)
const auditLog = {
  actor: "user:12345",
  resource: "profile:12345"  // Is this the user's profile or a different profile?
}

// After (clear)
const auditLog = {
  actor: "urn:user:01JCQX8QZKE9W8H4N2F1RSTVBG",
  resource: "urn:profile:01JCQX8QZKE9W8H4N2F1RSTVBG"  // Explicitly a profile resource
}

// Usage
const userId = extractId(auditLog.actor)  // "01JCQX8QZKE9W8H4N2F1RSTVBG"
const user = await prisma.user.findUnique({ where: { id: userId } })
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences
- **Audit Trail Clarity**: Unambiguous resource identification in logs
- **Cross-Service References**: Services can reference resources without context guessing
- **Compliance**: Meets SOC2/GDPR requirements for resource tracking
- **Future Multi-Tenancy**: URN format supports hierarchical namespaces (`urn:org:acme:user:123`)
- **Debugging**: Developers can immediately identify resource type from URN string

### Negative Consequences
- **String Length**: URN format is slightly longer (`urn:user:123` vs `user:123`)
- **Parsing Overhead**: Requires utility function to extract ID from URN
- **Migration Effort**: Existing logs with old format need graceful handling
- **Learning Curve**: Team needs to adopt new format (minimal, URN is standard)

### Neutral Consequences
- **Standardization**: URN is widely understood, but not universally adopted in all systems
- **Database Impact**: No change to database schema (primary keys remain CUIDs)

### Mitigation Strategies
- **Length Concerns**: URN strings are still short (<100 chars), acceptable for logs and APIs
- **Parsing Performance**: Cache parsed URNs if performance becomes issue (unlikely)
- **Migration**: Parsing function handles both old and new formats transparently
- **Documentation**: Add URN format to project conventions (`docs/CONVENTIONS.md`)

---

## Alternatives Considered

### Alternative 1: Keep Current Format (`resource:id`)

**Description**:
Continue using simple colon-separated format: `"user:12345"`, `"profile:12345"`

**Pros**:
- No migration needed
- Shorter strings
- Simple, familiar format

**Cons**:
- Not standards-based (no RFC backing)
- Ambiguous in complex systems (what namespace?)
- Difficult to extend for multi-tenancy
- Audit compliance concerns (SOC2 auditors may question format)

**Why Not Chosen**:
Format is too simplistic for growing system. As we add multi-tenancy, cross-service references, and compliance requirements, lack of formal structure becomes problematic.

---

### Alternative 2: UUID-Only References

**Description**:
Store only UUIDs in audit logs, infer resource type from context or separate field

```json
{
  "actor": "01JCQX8QZKE9W8H4N2F1RSTVBG",
  "actorType": "user",
  "resource": "01JCQX8QZKE9W8H4N2F1RSTVBG",
  "resourceType": "profile"
}
```

**Pros**:
- Shorter strings
- No parsing needed for ID extraction
- Clear type separation

**Cons**:
- Requires two fields for every reference (ID + type)
- More verbose JSON structure
- Context loss when ID is passed around (need to track type separately)
- Not self-describing (can't understand log entry without schema)

**Why Not Chosen**:
Splitting ID and type into separate fields increases complexity and context loss. URN format keeps resource reference self-contained and human-readable.

---

### Alternative 3: Custom JSON Object Format

**Description**:
Use structured objects for all resource references:

```json
{
  "actor": { "type": "user", "id": "01JCQX..." },
  "resource": { "type": "profile", "id": "01JCQX..." }
}
```

**Pros**:
- Strongly typed (when using TypeScript)
- Clear structure
- No parsing ambiguity

**Cons**:
- More verbose (nested objects)
- Difficult to use in URLs, logs, or simple string contexts
- Requires serialization/deserialization
- Not compatible with string-based systems (grep, external tools)

**Why Not Chosen**:
Over-engineering for the problem. URN format provides similar clarity with simpler string representation that works across all contexts (logs, APIs, URLs).

---

## Related

**Related ADRs**:
- [ADR-007: Observability with Consola and OpenTelemetry](./ADR-007-observability-with-consola-and-opentelemetry.md) - Audit logging implementation

**Related Documentation**:
- `docs/PHILOSOPHY.md` - Audit trail format example
- `.claude/agents/observability-agent.md` - Audit logging strategy

**External References**:
- [RFC 8141: Uniform Resource Name (URN) Syntax](https://datatracker.ietf.org/doc/html/rfc8141)
- [AWS ARN Format](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html) - Similar approach
- [Google Cloud Resource Names](https://cloud.google.com/apis/design/resource_names) - Alternative hierarchical format

---

## Notes

**Decision Making Process**:
- Referenced industry standards (RFC 8141)
- Reviewed AWS ARN and Google Cloud resource naming conventions
- Prioritized compliance requirements (SOC2, GDPR audit trails)

**Review Schedule**:
- **Next Review**: After 6 months of implementation
- **Metrics to Monitor**:
  - Audit log clarity (support team feedback)
  - Parsing performance (if any issues arise)
  - Multi-tenancy adoption (if namespace extensions needed)

**Migration Plan**:
- **Phase 1** (Week 1): Create URN utility functions (`lib/utils/urn.ts`)
- **Phase 2** (Week 2): Update audit logging to use URN format
- **Phase 3** (Week 3-4): Gradually migrate API responses (backward compatible)
- **Phase 4** (Ongoing): Update documentation and examples
- **Rollback Strategy**: Parsing function supports both formats, can revert to old format if critical issues arise

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-16 | System Architecture | Initial draft |

