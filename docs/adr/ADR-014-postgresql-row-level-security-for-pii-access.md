# ADR-014: PostgreSQL Row-Level Security for PII Access Control

**Status:** APPROVED
**Date:** 2025-11-19
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

User Story US-001 requires fine-grained access control for tenant PII data. Landlords must only view PII after selecting an applicant. We need database-level enforcement to prevent unauthorized access, even if application code has bugs or is bypassed.

**Background**:
- Tenant profiles contain sensitive PII that must be protected
- Access rules: Tenant can always see their own PII; Landlords see only after selection
- ZenStack provides application-level access control via policies
- Application-level security can be bypassed through direct database access
- Defense in depth: Database should enforce access rules independently
- Current approach: Relying solely on ZenStack/Prisma access policies

**Requirements**:
- **Functional**: Prevent unauthorized PII access at database layer
- **Functional**: Allow tenant to always access their own data
- **Functional**: Allow landlord access only after selection
- **Non-functional**: Minimal performance impact on queries
- **Non-functional**: Work with connection pooling (Neon PostgreSQL)
- **Constraints**: Must integrate with ZenStack-generated Prisma queries
- **Constraints**: Must work with Neon PostgreSQL (serverless)

**Scope**:
- **Included**: RLS policies for tenant_profiles table
- **Included**: Session context passing from application
- **Not included**: RLS for all tables (only PII-sensitive tables)
- **Not included**: Full multi-tenancy isolation (handled by ZenStack)

---

## Decision

**We will implement PostgreSQL Row-Level Security (RLS) as a defense-in-depth layer for PII access control.**

RLS policies will enforce that landlords can only access tenant PII after selection, independent of application logic. This provides database-level security that cannot be bypassed by application bugs.

**Implementation Approach**:
- Enable RLS on `tenant_profiles` table
- Create policies that check `pii_revealed_at` timestamp
- Pass authenticated user ID via `SET LOCAL` in transaction
- Use Prisma `$executeRaw` for setting session context
- Combine with ZenStack policies for full-stack security

**Why This Approach**:
1. **Defense in Depth**: Database enforces rules even if app code is wrong
2. **Audit Compliance**: RLS violations are logged by PostgreSQL
3. **Native PostgreSQL**: Built-in feature, no extensions needed
4. **Performance**: Minimal overhead when policies are simple
5. **Neon Compatible**: Works with Neon PostgreSQL pooling

**Example/Proof of Concept**:
```sql
-- Enable RLS on tenant_profiles
ALTER TABLE tenant_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can always see their own profiles
CREATE POLICY tenant_own_profile ON tenant_profiles
FOR SELECT
USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Policy: Others can see profile only if PII is revealed
CREATE POLICY revealed_profile ON tenant_profiles
FOR SELECT
USING (
  pii_revealed_at IS NOT NULL
  OR user_id = current_setting('app.current_user_id', true)::uuid
);

-- Policy: Only owner can update their profile
CREATE POLICY tenant_update_own ON tenant_profiles
FOR UPDATE
USING (user_id = current_setting('app.current_user_id', true)::uuid)
WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid);

-- Policy: Landlords with selection can view revealed data
CREATE POLICY landlord_revealed_access ON tenant_profiles
FOR SELECT
USING (
  pii_revealed_to_user_id = current_setting('app.current_user_id', true)::uuid
  AND pii_revealed_at IS NOT NULL
);
```

```typescript
// lib/db/rls-context.ts
import { prisma } from '@/lib/db';

export async function withRlsContext<T>(
  userId: string,
  operation: () => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    // Set session context for RLS
    await tx.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, true)`;

    return operation();
  });
}

// Usage in tRPC procedure
export const getTenantProfile = protectedProcedure
  .input(z.object({ applicantId: z.string() }))
  .query(async ({ ctx, input }) => {
    return withRlsContext(ctx.session.userId, async () => {
      return prisma.tenantProfile.findUnique({
        where: { applicantId: input.applicantId },
      });
    });
  });
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences
- **Security Hardening**: Database prevents unauthorized access even with app bugs
- **Compliance Evidence**: Can demonstrate database-level access control
- **Audit Trail**: PostgreSQL logs policy violations
- **No Application Changes**: RLS works transparently with existing queries
- **Defense in Depth**: Multiple layers of security (ZenStack + RLS)

### Negative Consequences
- **Complexity**: Two access control systems to maintain (ZenStack + RLS)
- **Performance**: Small overhead for policy evaluation on each row
- **Connection Context**: Must set session variables in each transaction
- **Testing Difficulty**: Need to test both application and database policies
- **Debugging**: RLS violations can be confusing to diagnose

### Neutral Consequences
- **Prisma Compatibility**: Requires raw SQL for context setting
- **Migration Management**: RLS policies managed via Prisma migrations

### Mitigation Strategies
- **Complexity**: Document which tables have RLS, keep policies simple
- **Performance**: Use indexes on columns referenced in policies
- **Connection Context**: Create helper function for consistent context setting
- **Testing**: Create test fixtures that verify RLS behavior
- **Debugging**: Add logging for RLS context setting, clear error messages

---

## Alternatives Considered

### Alternative 1: ZenStack Policies Only

**Description**:
Rely solely on ZenStack access control policies defined in `.zmodel` files.

**Pros**:
- Single source of truth for access control
- Type-safe policies with TypeScript integration
- Easier to test and debug
- No database-specific configuration
- Already implemented in project

**Cons**:
- Application-level only (can be bypassed)
- Direct database access ignores policies
- No defense in depth
- Harder to prove compliance (not database-enforced)

**Why Not Chosen**:
While ZenStack policies are excellent for application logic, they don't provide database-level protection. For highly sensitive PII, we need enforcement at the storage layer. RLS complements ZenStack.

---

### Alternative 2: Column-Level Security (GRANT/REVOKE)

**Description**:
Use PostgreSQL GRANT/REVOKE permissions on specific columns.

**Pros**:
- Simple to implement
- Native PostgreSQL feature
- Clear permission model

**Cons**:
- Cannot conditionally grant access (all or nothing)
- Would need separate database users per permission level
- Doesn't support "revealed after selection" logic
- Complex user management in serverless environment

**Why Not Chosen**:
Column-level security is too coarse-grained. We need conditional access based on business logic (selection status), which GRANT/REVOKE cannot express.

---

### Alternative 3: Views with Security Filters

**Description**:
Create PostgreSQL views that filter PII based on current user context.

**Pros**:
- Clear abstraction (query views, not tables)
- Can embed complex access logic
- Portable across databases
- Easy to understand and audit

**Cons**:
- Prisma doesn't natively support views as models
- Cannot UPDATE/INSERT through views easily
- Another layer to maintain alongside tables
- Performance overhead for complex views

**Why Not Chosen**:
Views add complexity to Prisma integration and make mutations difficult. RLS is more transparent, working directly on tables without application changes.

---

### Alternative 4: Application Middleware Only

**Description**:
Implement all access control in tRPC middleware without database enforcement.

**Pros**:
- Simpler architecture (no database configuration)
- All logic in TypeScript (testable)
- Full flexibility in access rules
- Consistent with ZenStack approach

**Cons**:
- No database-level protection
- Bugs in middleware expose all data
- Cannot prove database-level compliance
- Direct database access bypasses all controls

**Why Not Chosen**:
For highly sensitive PII subject to fair housing regulations, we need provable database-level controls. Application middleware alone is insufficient for compliance requirements.

---

## Related

**Related ADRs**:
- [ADR-013: PII Encryption with AES-256-GCM] - Encryption at rest complements RLS
- [ADR-017: Immutable Audit Trail] - Logs RLS policy enforcement

**Related Documentation**:
- [User Story US-001] - PII Anonymization requirements
- [docs/security/access-control.md] - Combined ZenStack + RLS guide (to be created)
- [ZenStack schema] - `zschema/auth.zmodel` for application policies

**External References**:
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Neon PostgreSQL RLS Guide](https://neon.tech/docs/guides/row-level-security)
- [Prisma with RLS](https://www.prisma.io/docs/concepts/components/prisma-client/row-level-security)
- [OWASP Access Control Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)

---

## Notes

**Decision Making Process**:
- Evaluated database-level access control options
- Consulted Neon PostgreSQL documentation for RLS compatibility
- Reviewed ZenStack integration patterns
- Decision date: 2025-11-19

**Review Schedule**:
- Monitor query performance with RLS enabled
- Audit RLS policy effectiveness quarterly
- Review policy complexity if adding more tables

**Migration Plan**:
- **Phase 1**: Enable RLS on tenant_profiles table
- **Phase 2**: Create and test policies in development
- **Phase 3**: Add context-setting helper to database client
- **Phase 4**: Deploy migration to production
- **Rollback**: `ALTER TABLE tenant_profiles DISABLE ROW LEVEL SECURITY;`

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-19 | Architecture Agent | Initial creation for US-001 |
