# Session Design Patterns

**Type**: Implementation Guide
**Domain**: Authentication
**Adapted from**: ApartmentDibs ADR-004

---

## Overview

Design philosophy for session data management: keep sessions minimal, query domain data as needed, and leverage cookie caching to minimize database hits.

**Core Principle**: **Sessions store authentication state, not business logic.**

---

## The Anti-Pattern: Bloated Sessions

### ❌ Common Mistake: Caching Everything in Session

```typescript
// ❌ BAD: Session contains business logic and cached data
session.user = {
  id,
  email,
  name,
  // Auth data (good)
  role: [],
  // Cached business data (bad - belongs in queries)
  currentTeam: { id, name, plan },
  teamCount: number,
  recentProjects: [],
  preferences: {},
  lastActivity: Date,
  cacheTimestamp: Date,
  needsRefresh: boolean,
}
```

**Problems**:
- **Stale data**: Cached team/project data becomes outdated
- **Complex caching logic**: Manual cache invalidation required
- **Large cookie size**: More data = larger cookies
- **Security risk**: More data exposed in cookies
- **Maintainability**: Hard to add fields without session migration
- **Type complexity**: Many optional fields, hard to reason about

---

## The Solution: Minimal Session + Domain Queries

### ✅ Correct Pattern: Minimal Session

```typescript
// ✅ GOOD: Session contains only auth-essential data
{
  user: {
    id: string
    email: string
    name: string
    firstName?: string
    lastName?: string
    image?: string
    role: string              // User's role(s)
    emailVerified: boolean
    // Better Auth admin plugin fields (if using)
    banned?: boolean
    banReason?: string
    banExpires?: Date
  },
  session: {
    id: string
    activeOrganizationId?: string  // Current org context (if multi-tenant)
    expiresAt: Date
  }
}
```

**Benefits**:
- **Always fresh**: Domain data queried from database
- **Simple**: No cache invalidation logic needed
- **Small cookies**: Minimal data transferred
- **Secure**: Less sensitive data in cookies
- **Maintainable**: Easy to add fields without session changes
- **Type-safe**: Fewer optional fields, clearer contracts

---

## Data Access Patterns

### Authentication Data (from session)

Use session for authentication state **only**:

```typescript
import { useSession } from "@/lib/auth/auth-client"

function MyComponent() {
  const { data: session } = useSession()

  // ✅ Good: Read auth data from session
  const userId = session?.user.id
  const userEmail = session?.user.email
  const isEmailVerified = session?.user.emailVerified

  // ✅ Good: Check role from session
  const isAdmin = session?.user.role?.includes("admin")
}
```

### Domain Data (via hooks/queries)

Query domain data separately when needed:

```typescript
import { useSession } from "@/lib/auth/auth-client"
import { useActiveOrganization } from "@/lib/hooks/useActiveOrganization"
import { useUserProfile } from "@/lib/hooks/useUserProfile"

function Dashboard() {
  const { data: session } = useSession()

  // ✅ Good: Query organization data separately
  const { data: org } = useActiveOrganization()

  // ✅ Good: Query user profile separately
  const { data: profile } = useUserProfile(session.user.id)

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Current Team: {org?.name}</p>
      <p>Profile Bio: {profile?.bio}</p>
    </div>
  )
}
```

---

## Cookie Caching Strategy

### How Cookie Caching Works

Most modern auth libraries (Better Auth, NextAuth, Clerk) cache session data in cookies for performance:

```typescript
session: {
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60 // 5 minutes
  }
}
```

**Performance Characteristics**:
- **Cookie cached**: <1ms (cookie read, no database query)
- **Uncached session**: ~50ms (database query)
- **Domain data query**: ~10-20ms (indexed queries)

**Caching Behavior**:
1. **First request**: Database query (50ms)
2. **Next 5 minutes**: Cookie read (<1ms)
3. **After 5 minutes**: Database query again

### Leveraging Cache for Performance

Since sessions are cached, you can call `useSession()` frequently without performance penalty:

```typescript
// ✅ Good: useSession() calls are cached, no performance impact
function Header() {
  const { data: session } = useSession() // <1ms (cached)
  return <UserAvatar user={session?.user} />
}

function Sidebar() {
  const { data: session } = useSession() // <1ms (cached, same request)
  return <RoleIndicator role={session?.user.role} />
}
```

**But** domain data queries should be managed carefully:

```typescript
// ⚠️ Use React Query or similar to cache domain queries
function Dashboard() {
  const { data: session } = useSession()

  // ✅ Good: React Query caches this
  const { data: org } = useOrganization(session?.activeOrganizationId)

  // ✅ Good: React Query deduplicates queries
  const { data: projects } = useProjects(org?.id)
}
```

---

## Multi-Tenancy Pattern

### Active Organization Context

For multi-tenant apps, store current organization ID in session:

```typescript
{
  session: {
    id: string,
    activeOrganizationId?: string,  // Currently selected org
    expiresAt: Date
  }
}
```

**Why in session?**
- User's current "context" for all actions
- Persists across page navigations
- Server and client both need this value

### Organization Switching

```typescript
import { useActiveOrganization } from "@/lib/hooks/useActiveOrganization"

function OrgSwitcher() {
  const { data: org, setActiveOrganization } = useActiveOrganization()

  async function switchOrg(newOrgId: string) {
    // Updates session.activeOrganizationId server-side
    await setActiveOrganization(newOrgId)
    // Page refreshes with new org context
  }

  return (
    <select value={org?.id} onChange={(e) => switchOrg(e.target.value)}>
      {/* org options */}
    </select>
  )
}
```

### Organization-Scoped Queries

Use active organization ID from session for scoped queries:

```typescript
function ProjectList() {
  const { data: session } = useSession()

  // Query projects scoped to active organization
  const { data: projects } = useProjects({
    organizationId: session?.activeOrganizationId
  })

  return <>{/* render projects */}</>
}
```

---

## Permission Checking Pattern

### Role from Session

```typescript
import { useSession } from "@/lib/auth/auth-client"

function usePermissions() {
  const { data: session } = useSession()

  // ✅ Good: Basic role check from session
  const isAdmin = session?.user.role?.includes("admin")
  const isModerator = session?.user.role?.includes("moderator")

  return { isAdmin, isModerator }
}
```

### Advanced Permissions (Query-Based)

For complex permissions, query additional data:

```typescript
import { useSession } from "@/lib/auth/auth-client"
import { useOrgMembership } from "@/lib/hooks/useOrgMembership"

function useOrgPermissions(organizationId?: string) {
  const { data: session } = useSession()
  const orgId = organizationId ?? session?.activeOrganizationId

  // Query user's membership in organization
  const { data: membership } = useOrgMembership({
    userId: session?.user.id,
    organizationId: orgId
  })

  const hasPermission = (permission: string) => {
    // Complex permission logic based on org role
    if (membership?.role === "owner") return true
    if (membership?.role === "admin" && permission !== "billing") return true
    if (membership?.role === "member" && permission.startsWith("read:")) return true
    return false
  }

  return {
    membership,
    orgRole: membership?.role,
    hasPermission,
  }
}
```

---

## Migration from Bloated Sessions

### Step 1: Identify Cached Fields

List all non-auth fields currently in your session:

```typescript
// Before
session.user = {
  id,           // ✅ Keep (auth)
  email,        // ✅ Keep (auth)
  role,         // ✅ Keep (auth)
  currentTeam,  // ❌ Remove (business logic)
  teamCount,    // ❌ Remove (business logic)
  preferences,  // ❌ Remove (business logic)
}
```

### Step 2: Create Query Hooks

For each removed field, create a query hook:

```typescript
// Remove: session.user.currentTeam
// Add: useActiveOrganization() hook

export function useActiveOrganization() {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ["organization", session?.activeOrganizationId],
    queryFn: () => fetchOrganization(session?.activeOrganizationId),
    enabled: !!session?.activeOrganizationId,
  })
}
```

### Step 3: Update Components

Replace session reads with hook calls:

```diff
function Dashboard() {
  const { data: session } = useSession()
+  const { data: org } = useActiveOrganization()

-  const teamName = session.user.currentTeam?.name
+  const teamName = org?.name

  return <h1>Team: {teamName}</h1>
}
```

### Step 4: Remove Session Caching Logic

Delete manual cache invalidation code:

```diff
- // Remove cache refresh triggers
- if (session.user.needsRefresh) {
-   await refreshUserData()
- }
```

---

## Database Indexes for Performance

To minimize query latency, ensure proper indexes:

```sql
-- User lookups (session validation)
CREATE INDEX idx_user_id ON "User"(id);
CREATE INDEX idx_user_email ON "User"(email);

-- Organization membership queries
CREATE INDEX idx_member_user_org ON "Member"(user_id, organization_id);
CREATE INDEX idx_member_org_role ON "Member"(organization_id, role);

-- Organization context queries
CREATE INDEX idx_org_id ON "Organization"(id);
CREATE INDEX idx_org_slug ON "Organization"(slug);
```

**Query Performance**:
- Indexed queries: ~10-20ms
- Unindexed queries: ~100-500ms (avoid!)

---

## Best Practices

### ✅ Do

- Keep sessions minimal (only auth-essential data)
- Query domain data via hooks (React Query, SWR, tRPC)
- Leverage cookie caching (5-minute default is good)
- Use indexes for frequently-queried data
- Store active organization ID in session (multi-tenant)
- Check basic roles from session (e.g., `isAdmin`)

### ❌ Don't

- Cache business logic in sessions
- Store large objects in sessions
- Manually invalidate session caches
- Query the same data multiple times (use React Query)
- Skip database indexes (kills performance)
- Put preference/settings data in sessions

---

## Framework-Specific Guidance

### Better Auth

```typescript
// lib/auth.ts
export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // 5 minutes
    }
  }
})
```

### NextAuth.js

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "database", // Use database sessions, not JWT
  },
  callbacks: {
    session({ session, user }) {
      // ✅ Only add essential auth fields
      session.user.id = user.id
      session.user.role = user.role

      // ❌ Don't add business logic
      // session.user.teams = await getTeams(user.id) // NO!

      return session
    }
  }
}
```

### Clerk

```typescript
// Clerk stores minimal session by default
import { useUser, useOrganization } from "@clerk/nextjs"

function Component() {
  const { user } = useUser()           // Auth data
  const { organization } = useOrganization() // Domain data (queried)
}
```

---

## Alternatives Considered

### Keep JWT Caching Pattern

**Rejected**:
- Requires complex cache invalidation with cookie sessions
- Stale data issues
- Modern auth libraries handle caching automatically

### Custom Session Fields via Plugins

**Rejected**:
- Most plugins recompute custom fields on every request
- No performance benefit over separate queries
- Adds complexity to session management

### Cache Domain Data in React Context

**Rejected**:
- Client-side state complexity
- Hydration mismatches (SSR vs client)
- Stale data synchronization issues
- React Query / SWR solve this better

---

## Related Documentation

- **Guard Components**: `docs/domains/authentication/guard-components.md`
- **Cookie Configuration**: `docs/domains/authentication/cookie-configuration.md`
- **Backend Developer**: `.claude/agents/backend-developer.md` (session model design)

---

**Key Takeaway**: **Keep sessions simple. Query data when you need it. Let cookie caching + React Query handle performance.**
