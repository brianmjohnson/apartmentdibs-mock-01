# TypeScript Type Safety in Authentication

**Type**: Implementation Guide
**Domain**: Authentication
**Adapted from**: ApartmentDibs ADR-008, ADR-014

---

## Overview

Enforce strict TypeScript type safety in authentication code to catch bugs at compile time, prevent runtime errors, and improve developer experience through autocomplete and refactoring support.

**Core Principle**: **Zero tolerance for `any` types. Type safety is security.**

---

## The Problem

Authentication code involves complex, dynamic data that's prone to type safety issues:

### Common Anti-Patterns

```typescript
// ❌ Loses type information
const user = session?.user as any
user.customField // No autocomplete, no type checking

// ❌ Unsafe type assertion
const org = data as Organization

// ❌ Missing null checks
const name = session.user.firstName.toUpperCase() // Crash if firstName is null

// ❌ Destructuring plugin methods loses type safety
export const { impersonate } = admin // Wrong method name, TypeScript doesn't catch it
```

**Consequences**:

- Runtime errors that could be caught at compile time
- No autocomplete or IntelliSense
- Difficult refactoring (breaking changes not detected)
- Security vulnerabilities (privilege escalation if types wrong)

---

## Type Safety Rules

### 1. Use Type Inference from Auth Library

**Pattern (Better Auth example)**:

```typescript
// lib/auth/auth-server.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  user: {
    additionalFields: {
      firstName: { type: "string", required: false },
      lastName: { type: "string", required: false },
      role: { type: "string", required: false, input: false }, // Server-only
    },
  },
  // ... config
})

// ✅ Correct: Infer types from auth instance
export type Session = typeof auth.$Infer.Session
export type User = Session["user"]

// ❌ Wrong: Manual type definition (gets out of sync)
type Session = { user: { id: string, ... } }
```

**Why This Works**:

- Types automatically update when auth config changes
- Guaranteed type accuracy (no drift between config and types)
- Single source of truth

**Framework-Specific**:

**NextAuth.js**:

```typescript
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role?: string
    } & DefaultSession['user']
  }
}
```

**Clerk**:

```typescript
import type { UserResource } from '@clerk/types'
// Clerk provides strong types out of the box
```

---

### 2. Enable Strict TypeScript

**tsconfig.json (Recommended Configuration)**:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "noEmit": true,
    "isolatedModules": true,
    "incremental": true,

    // Strict type checking (REQUIRED)
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Additional checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,

    // Path mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },

    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Key Options**:

- `strict: true` → Enables all strict type checking
- `noUncheckedIndexedAccess: true` → Array access returns `T | undefined`
- `noImplicitAny: true` → Ban implicit `any` types

---

### 3. Avoid "any" Casting - Use Type Guards

**Type Guards for Authentication**:

```typescript
// lib/auth/guards.ts
import type { Session } from './types'

// ✅ Type guard for authenticated sessions
export function isAuthenticated(session: Session | null): session is Session {
  return session !== null && !!session.user
}

// ✅ Type guard for active organization
export function hasActiveOrganization(
  session: Session
): session is Session & { activeOrganizationId: string } {
  return !!session.activeOrganizationId
}

// ✅ Type guard for platform admin
export function isPlatformAdmin(session: Session | null): session is Session {
  if (!session) return false
  return session.user.role?.includes('admin') ?? false
}
```

**Usage in Components**:

```typescript
import { useSession } from "@/lib/auth/auth-client"
import { isAuthenticated, hasActiveOrganization } from "@/lib/auth/guards"

function Dashboard() {
  const { data: session } = useSession()

  if (!isAuthenticated(session)) {
    return <LoginComponent />
  }

  // TypeScript knows session is defined here
  const userName = session.user.name

  if (hasActiveOrganization(session)) {
    // TypeScript knows activeOrganizationId is defined
    const orgId: string = session.activeOrganizationId
  }
}
```

**Why Type Guards Matter**:

- TypeScript narrows types after guard checks
- No need for `!` non-null assertions
- Reusable across components
- Centralized type logic

---

### 4. Handle Nullability Explicitly

**Use Optional Chaining and Nullish Coalescing**:

```typescript
// ❌ Unsafe: Crashes if firstName is null
const fullName = `${session.user.firstName} ${session.user.lastName}`

// ✅ Safe with nullish coalescing
const fullName = `${session.user.firstName ?? ''} ${session.user.lastName ?? ''}`.trim()

// ✅ Or optional chaining
const firstInitial = session?.user?.firstName?.[0]?.toUpperCase()

// ✅ Helper function with fallback
export function getFullName(user: User): string {
  const first = user.firstName ?? ''
  const last = user.lastName ?? ''
  return `${first} ${last}`.trim() || 'Anonymous'
}
```

**Best Practice**: Never assume optional fields exist. Always provide fallbacks.

---

### 5. Use Discriminated Unions for State

**Type-Safe Loading States**:

```typescript
// ✅ Discriminated union
type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; session: Session }

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()

  const authState: AuthState = isPending
    ? { status: "loading" }
    : session
      ? { status: "authenticated", session }
      : { status: "unauthenticated" }

  // TypeScript ensures exhaustive handling
  switch (authState.status) {
    case "loading":
      return <Spinner />
    case "unauthenticated":
      return <LoginComponent />
    case "authenticated":
      // TypeScript knows authState.session exists
      return <>{children}</>
  }
}
```

**Benefits**:

- Exhaustive type checking (TypeScript warns if you miss a case)
- No invalid state combinations (can't have `status: "authenticated"` without `session`)
- Clear state transitions

---

## Plugin Type Safety

### The Plugin Type Safety Problem

Auth libraries with plugin systems (Better Auth, NextAuth, Clerk) often use loose types to support dynamic APIs:

```typescript
// ❌ Type safety broken: Destructuring from plugin object
export const authClient = createAuthClient({
  plugins: [adminClient()],
})

export const { admin } = authClient

// Destructuring loses type safety (admin likely has [key: string]: any)
export const {
  impersonate, // Wrong name - should be impersonateUser
  listSessions, // Wrong name - should be listUserSessions
} = admin
```

**Why TypeScript Doesn't Catch This**:

1. Plugin objects often have loose index signatures (`[key: string]: any`)
2. Destructuring happens at runtime
3. TypeScript can't validate property names that don't exist if the type allows arbitrary properties

**Impact**:

- No autocomplete for correct method names
- No type errors when using wrong method names
- Runtime 404 errors (e.g., `POST /api/auth/admin/impersonate 404`)

---

### Solution: Direct Object Usage

**Pattern 1: Export Plugin Object Directly (Recommended)**:

```typescript
// lib/auth/auth-client.ts
import { createAuthClient } from 'better-auth/client'
import { adminClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [adminClient()],
})

// ✅ Export admin object directly - maintains type safety
export const { useSession, signIn, signOut, admin } = authClient
```

```typescript
// components/admin/ImpersonateUserButton.tsx
import { admin } from '@/lib/auth/auth-client'

// ✅ TypeScript autocompletes method names
// ✅ Type errors if method doesn't exist
const result = await admin.impersonateUser({ userId })
```

**Benefits**:

- Full TypeScript autocomplete support
- Compile-time errors for wrong method names
- IntelliSense shows method documentation
- Single source of truth for plugin API

---

**Pattern 2: Explicitly Typed Re-exports (Alternative)**:

If you need named exports for convenience:

```typescript
// lib/auth/auth-client.ts
export const { admin } = authClient

// ✅ Correct method names from Better Auth admin plugin
// (Verified against https://www.better-auth.com/docs/plugins/admin)
export const {
  impersonateUser,
  stopImpersonating,
  banUser,
  unbanUser,
  removeUser,
  listUserSessions,
  revokeUserSession,
  revokeUserSessions,
} = admin
```

**When to Use**:

- You need shorter import paths in many components
- You've verified method names against plugin documentation
- You add JSDoc comments for each exported method

**Trade-offs**:

- Still loses some type safety if plugin types are loose
- Requires manual synchronization with plugin API changes
- More maintenance burden when auth library updates

---

### Best Practices for Plugin Usage

1. **Always reference plugin documentation** before exporting methods
   - Better Auth admin plugin: https://www.better-auth.com/docs/plugins/admin
   - NextAuth providers: https://next-auth.js.org/providers

2. **Prefer direct object usage** over destructured re-exports:

   ```typescript
   // ✅ Good - maintains type safety
   import { admin } from '@/lib/auth/auth-client'
   admin.impersonateUser({ userId })

   // ❌ Avoid - loses type safety
   import { impersonateUser } from '@/lib/auth/auth-client'
   impersonateUser({ userId })
   ```

3. **Test plugin integrations early** with a simple component to verify:
   - Method names are correct
   - TypeScript autocomplete works
   - Runtime calls succeed

4. **Add JSDoc comments** when re-exporting:

   ```typescript
   /**
    * Impersonate a user as a platform admin
    * @see https://www.better-auth.com/docs/plugins/admin#impersonate-user
    */
   export const { impersonateUser } = admin
   ```

---

## Additional Fields Security

### Server-Only Fields (Critical for Security)

**Pattern (Better Auth example)**:

```typescript
// lib/auth/auth-server.ts
export const auth = betterAuth({
  user: {
    additionalFields: {
      // ✅ input: false prevents user tampering
      role: {
        type: 'string',
        required: false,
        input: false, // CRITICAL: Server-only field
      },
      banned: {
        type: 'boolean',
        required: false,
        input: false,
      },
      banReason: {
        type: 'string',
        required: false,
        input: false,
      },

      // ✅ input: true allows user updates
      bio: {
        type: 'string',
        required: false,
        input: true, // User can update this
      },
      phoneNumber: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
})
```

**Why `input: false` Matters**:

- Prevents users from setting their own `role: "admin"`
- Ensures sensitive fields only modified server-side
- **Security vulnerability if omitted** (privilege escalation risk)

**Rule**: Any field affecting permissions, access control, or billing must be `input: false`.

---

## Client-Server Type Sharing

### Monorepo Pattern (Recommended)

```typescript
// lib/auth/types.ts (shared between client and server)
import { auth } from '@/lib/auth/auth-server'

export type Session = typeof auth.$Infer.Session
export type User = Session['user']

// Client code
import type { Session, User } from '@/lib/auth/types'
```

**Benefits**:

- Single source of truth
- Types automatically sync
- No manual maintenance

---

### Separate Repos Pattern

```typescript
// packages/api-types/src/auth.ts
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
  // ... manually kept in sync
}

// Frontend repo
import type { User } from '@myorg/api-types'
```

**Trade-offs**:

- Requires manual synchronization
- Types can drift between repos
- More maintenance burden

**Recommendation**: Use monorepo or shared package if possible.

---

## Helper Functions with Type Safety

```typescript
// lib/auth/helpers.ts
import type { Session, User } from './types'

export function isPlatformAdmin(session: Session | null): boolean {
  if (!session) return false

  // Type-safe null checks with optional chaining
  return (
    session.user.members?.some((m) => m.organization?.slug === 'platform' && m.role === 'admin') ??
    false
  )
}

export function getFullName(user: User): string {
  const first = user.firstName ?? ''
  const last = user.lastName ?? ''
  return `${first} ${last}`.trim() || 'Anonymous'
}

export function getUserInitials(user: User): string {
  const first = user.firstName?.[0]?.toUpperCase() ?? ''
  const last = user.lastName?.[0]?.toUpperCase() ?? ''
  return first + last || user.email[0].toUpperCase()
}
```

**Best Practices**:

- Use optional chaining (`?.`) for nullable fields
- Provide fallback values with nullish coalescing (`??`)
- Return non-null types when possible (e.g., `string` not `string | undefined`)

---

## React Component Type Safety

### Guard Components

```typescript
// components/auth/guards/RequireAuth.tsx
import type { Session } from "@/lib/auth/types"

interface RequireAuthProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  loadingFallback?: React.ReactNode
}

export function RequireAuth({
  children,
  fallback = <LoginComponent />,
  loadingFallback = <Spinner />,
}: RequireAuthProps) {
  const { data: session, isPending } = useSession()

  if (isPending) return <>{loadingFallback}</>
  if (!session) return <>{fallback}</>

  // TypeScript knows session is defined here
  return <>{children}</>
}
```

**Type Safety Features**:

- Explicit prop types
- Default values for optional props
- Type narrowing after null checks

---

### Permission Hooks

```typescript
// lib/hooks/usePermissions.ts
import { useSession } from '@/lib/auth/auth-client'
import type { Session } from '@/lib/auth/types'

export function usePermissions() {
  const { data: session } = useSession()

  // Type-safe permission checks
  const isAdmin = session?.user.role?.includes('admin') ?? false
  const isModerator = session?.user.role?.includes('moderator') ?? false

  const hasPermission = (permission: string): boolean => {
    if (!session) return false

    // Custom permission logic
    if (isAdmin) return true
    if (isModerator && permission.startsWith('moderate:')) return true

    return false
  }

  return {
    isAdmin,
    isModerator,
    hasPermission,
  }
}
```

**Usage**:

```typescript
function AdminPanel() {
  const { isAdmin, hasPermission } = usePermissions()

  if (!isAdmin) {
    return <AccessDenied />
  }

  return (
    <div>
      {hasPermission("users.delete") && <DeleteUserButton />}
    </div>
  )
}
```

---

## Database Query Type Safety

### Prisma Type Inference

```typescript
// lib/dao/organization.ts
import { prisma } from '@/lib/prisma'
import type { Organization, Member } from '@prisma/client'

// ✅ Prisma infers correct return type
export async function getOrganizationWithMembers(
  organizationId: string
): Promise<Organization & { members: Member[] }> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { members: true },
  })

  if (!org) {
    throw new Error(`Organization ${organizationId} not found`)
  }

  return org // Type matches return type
}
```

**Type Safety Benefits**:

- Prisma generates types from schema
- `include` and `select` affect return type
- TypeScript catches mismatched return types

---

### ZenStack Type Inference

```typescript
// lib/dao/user.ts
import { enhance } from '@zenstackhq/runtime'
import { prisma } from '@/lib/prisma'
import type { User } from '@/lib/generated/schema'

export async function getUserProfile(userId: string, session: Session) {
  // ZenStack enhances Prisma with access control
  const db = enhance(prisma, { user: session.user })

  // Types match Prisma/ZenStack generated types
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  })

  return user
}
```

**Why ZenStack**:

- Access control enforced at schema level
- Types match Prisma
- Can't bypass type safety to violate access rules

---

## ESLint Rules for Type Safety

```javascript
// .eslintrc.js
module.exports = {
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // Ban "any" types
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',

    // Encourage explicit types
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',

    // Prevent bugs
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'warn',
  },
}
```

**Key Rules**:

- `no-explicit-any: "error"` → Zero tolerance for `any`
- `no-unsafe-*: "error"` → Prevent unsafe type operations
- `no-floating-promises: "error"` → Catch unhandled promises

---

## Pre-commit Type Checking

**Husky Hook**:

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Type check before commit
pnpm tsc --noEmit

# Or use turbo for monorepos
# pnpm turbo run type-check
```

**package.json script**:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch"
  }
}
```

**Why Pre-commit Checks**:

- Catch type errors before code review
- Faster feedback loop than CI/CD
- Enforce type safety discipline

---

## Testing Type Safety

### Type Testing with `expect-type`

```typescript
// __tests__/types/auth.test-d.ts
import { expectTypeOf } from 'expect-type'
import type { Session, User } from '@/lib/auth/types'

describe('Auth Types', () => {
  it('Session should have user property', () => {
    expectTypeOf<Session>().toHaveProperty('user')
  })

  it('User should have required fields', () => {
    expectTypeOf<User>().toMatchTypeOf<{
      id: string
      email: string
    }>()
  })

  it('Optional fields should be nullable', () => {
    expectTypeOf<User>().toHaveProperty('firstName')
    expectTypeOf<User['firstName']>().toEqualTypeOf<string | null | undefined>()
  })
})
```

**Run Type Tests**:

```bash
pnpm tsc --project tsconfig.test.json
```

---

## Common Pitfalls

### ❌ Pitfall 1: Type Assertion Instead of Type Guard

```typescript
// ❌ Unsafe
const user = session?.user as User
user.firstName.toUpperCase() // Crashes if null

// ✅ Safe with type guard
if (isAuthenticated(session)) {
  const name = session.user.firstName?.toUpperCase() ?? ''
}
```

---

### ❌ Pitfall 2: Destructuring Plugin Methods

```typescript
// ❌ Loses type safety
export const { impersonate } = admin

// ✅ Use admin object directly
import { admin } from '@/lib/auth/auth-client'
admin.impersonateUser({ userId })
```

---

### ❌ Pitfall 3: Manual Type Definitions

```typescript
// ❌ Gets out of sync with auth config
type User = {
  id: string
  email: string
}

// ✅ Infer from auth instance
export type User = (typeof auth.$Infer.Session)['user']
```

---

### ❌ Pitfall 4: Ignoring Optional Fields

```typescript
// ❌ Crashes if firstName is null
const initial = user.firstName[0]

// ✅ Handle optional fields
const initial = user.firstName?.[0] ?? '?'
```

---

## Migration Checklist

If migrating from loose types to strict type safety:

- [ ] Enable `strict: true` in tsconfig.json
- [ ] Fix all TypeScript errors (don't use `@ts-ignore`)
- [ ] Replace `any` types with proper types or `unknown`
- [ ] Add type guards for authentication checks
- [ ] Use type inference from auth library (`$Infer`)
- [ ] Add ESLint rules for type safety
- [ ] Set up pre-commit type checking
- [ ] Document type patterns in this guide
- [ ] Test plugin integrations for type safety
- [ ] Review all additional fields for `input: false` security

---

## Benefits

### Positive Consequences

- **Compile-Time Safety**: Catch bugs before runtime
- **Autocomplete**: IDE suggests available fields
- **Refactoring Confidence**: TypeScript catches breaking changes
- **Documentation**: Types serve as inline documentation
- **Maintainability**: Changes propagate through type system
- **Security**: `input: false` prevents privilege escalation

### Negative Consequences

- **Initial Friction**: More upfront type definitions
- **Learning Curve**: Developers must learn type utilities
- **Strictness**: No quick hacks with `any`

### Neutral Consequences

- **Build Time**: Strict checks add ~10% to TypeScript compilation
- **Bundle Size**: No runtime impact (types erased)

---

## Framework-Specific Examples

### Better Auth

```typescript
// lib/auth/auth-server.ts
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: { type: 'string', required: false, input: false },
    },
  },
})

export type Session = typeof auth.$Infer.Session
export type User = Session['user']
```

---

### NextAuth.js

```typescript
// lib/auth/auth.ts
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role?: string
    } & DefaultSession['user']
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      session.user.role = user.role
      return session
    },
  },
}
```

---

### Clerk

```typescript
// Clerk provides strong types out of the box
import { useUser } from '@clerk/nextjs'
import type { UserResource } from '@clerk/types'

function Profile() {
  const { user } = useUser() // user is strongly typed

  // TypeScript autocompletes user properties
  const email = user?.primaryEmailAddress?.emailAddress
}
```

---

## Related Documentation

- **Guard Components**: `docs/domains/authentication/guard-components.md`
- **Session Design**: `docs/domains/authentication/session-design.md`
- **Type Safety ADR**: Consider creating ADR for your project's type safety standards

---

## External Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Better Auth TypeScript](https://www.better-auth.com/docs/concepts/typescript)
- [TypeScript Index Signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)
- [Type Guards and Type Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

---

**Key Takeaway**: **Strict TypeScript type safety prevents runtime errors, improves developer experience, and strengthens security. Use type inference, type guards, and strict compiler settings.**
