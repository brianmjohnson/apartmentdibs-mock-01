# Authentication Strategy Skill

**Use When**: Setting up authentication for a new project or evaluating auth libraries

---

## Context

This skill provides guidance on choosing and implementing authentication strategies for modern web applications.

**Adapted from**: ApartmentDibs ADR-001

---

## Decision Framework

### 1. Choose Auth Implementation

**Better Auth (Recommended for full control)**:
- ✅ Use when: Need full control over auth flow, custom logic, or specific OAuth providers
- ✅ Flexible: Database-backed sessions with cookie caching
- ✅ Plugins: Built-in admin, organization, two-factor
- ✅ Type-safe: Full TypeScript support with type inference

**NextAuth.js (Rapid setup)**:
- ✅ Use when: Need quick OAuth setup with minimal configuration
- ✅ Established: Large community, many providers
- ⚠️ Less flexible: Limited customization options

**Clerk (Managed service)**:
- ✅ Use when: Want fully managed auth with UI components
- ✅ Features: Built-in user management, organizations, webhooks
- ⚠️ Cost: Paid service, vendor lock-in

**Considerations**:
- Project complexity (simple app vs enterprise)
- Budget (free vs paid)
- Control needed (full control vs managed)
- Team expertise (comfortable with auth internals vs want managed)

---

### 2. Session Management

**Database-Backed Sessions** (Recommended):

```typescript
// Better Auth with database sessions
export const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
})
```

**Benefits**:
- ✅ Can revoke sessions server-side
- ✅ Supports multiple devices
- ✅ Better security (no JWT vulnerabilities)
- ✅ Cookie caching reduces DB queries

**JWT Sessions** (Alternative):
- ⚠️ Cannot revoke without additional infrastructure
- ✅ Stateless (no DB queries)
- ⚠️ Token size limitations

---

### 3. OAuth Providers

**Recommended Providers**:
- **Google**: Most common, reliable, broad user base
- **GitHub**: Developer-focused apps
- **Microsoft**: Enterprise B2B apps
- **Email + Magic Link**: No provider dependency

**Implementation**:

```typescript
export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
})
```

---

### 4. Security Best Practices

**Cookie Configuration**:
```typescript
// See docs/domains/authentication/cookie-configuration.md
advanced: {
  useSecureCookies: IS_PRODUCTION || IS_PREVIEW,
  crossSubDomainCookies: IS_PRODUCTION
    ? { enabled: true, domain: ".yourdomain.com" }
    : { enabled: false },
}
```

**Session Security**:
- ✅ httpOnly cookies (prevent XSS)
- ✅ secure flag in production (HTTPS only)
- ✅ sameSite: 'lax' (CSRF protection + OAuth compatibility)
- ✅ Short-lived sessions with refresh tokens

**Additional Fields** (input: false for server-only):
```typescript
user: {
  additionalFields: {
    role: { type: "string", required: false, input: false }, // Server-only
    banned: { type: "boolean", required: false, input: false },
  },
}
```

---

### 5. Multi-Tenancy Support

**Organization Plugin** (Better Auth):

```typescript
import { organization } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
    }),
  ],
})
```

**Session with Active Organization**:
```typescript
{
  session: {
    id: string
    activeOrganizationId?: string  // Current org context
    expiresAt: Date
  }
}
```

---

## Implementation Checklist

- [ ] Choose auth library (Better Auth, NextAuth, Clerk)
- [ ] Configure database for sessions (if database-backed)
- [ ] Set up OAuth providers (Google, GitHub, etc.)
- [ ] Configure environment variables (.env.local, Vercel)
- [ ] Implement cookie configuration (see cookie-configuration.md)
- [ ] Create auth guard components (see guard-components.md)
- [ ] Set up minimal session model (see session-design.md)
- [ ] Configure TypeScript types (see typescript-safety.md)
- [ ] Test OAuth flows (local, preview, production)
- [ ] Implement permission checking
- [ ] Add audit logging for sensitive actions

---

## Common Patterns

**Sign In Flow**:
```typescript
// components/SignInButton.tsx
import { signIn } from "@/lib/auth/auth-client"

export function SignInButton() {
  return (
    <button onClick={() => signIn.social({ provider: "google" })}>
      Sign in with Google
    </button>
  )
}
```

**Protected Routes**:
```typescript
// app/dashboard/layout.tsx
import { RequireAuth } from "@/components/auth/guards/RequireAuth"

export default function DashboardLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>
}
```

**Server-Side Auth Check**:
```typescript
// app/api/protected/route.ts
import { auth } from "@/lib/auth/auth-server"
import { headers } from "next/headers"

export async function GET() {
  const session = await auth.api.getSession({ headers: headers() })

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  // ... protected logic
}
```

---

## Related Documentation

- **Guard Components**: `docs/domains/authentication/guard-components.md`
- **Session Design**: `docs/domains/authentication/session-design.md`
- **Cookie Configuration**: `docs/domains/authentication/cookie-configuration.md`
- **TypeScript Safety**: `docs/domains/authentication/typescript-safety.md`

---

**Key Principle**: Choose authentication strategy based on project needs. Database-backed sessions provide best security and flexibility. Always use httpOnly cookies, environment-aware configuration, and minimal session data.
