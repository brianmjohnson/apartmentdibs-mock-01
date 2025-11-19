# Auth Guard Component Pattern

**Type**: Implementation Guide
**Domain**: Authentication
**Adapted from**: ApartmentDibs ADR-003

---

## Overview

Declarative React components for route-level and feature-level authorization, eliminating duplicate authentication logic across your codebase.

**Problem Solved**: Prevents scattered `useAuth` hooks that duplicate:

- Session loading state management
- Authentication status checks
- Login modal rendering
- Redirect URL handling

---

## Guard Components

### 1. Basic Authentication (`<RequireAuth>`)

Protects routes that require any authenticated user.

```typescript
<RequireAuth fallback={<LoginComponent />}>
  <ProtectedContent />
</RequireAuth>
```

**Use Cases**:

- User dashboards
- Settings pages
- Profile pages
- Any feature requiring login

---

### 2. Role-Based Access (`<RequireRole>`)

Protects routes requiring specific user roles.

```typescript
<RequireRole role="admin" fallback={<AccessDenied />}>
  <AdminDashboard />
</RequireRole>
```

**Use Cases**:

- Admin panels
- Moderator tools
- Role-specific features

---

### 3. Organization/Team Access (`<RequireOrgMember>`)

Protects routes scoped to organization/team membership (when using Better Auth Organization plugin or similar).

```typescript
<RequireOrgMember organizationId={orgId} roles={["owner", "admin"]}>
  <TeamSettings />
</RequireOrgMember>
```

**Use Cases**:

- Team dashboards
- Organization settings
- Workspace-specific content
- Multi-tenant features

---

### 4. Custom Permission (`<RequirePermission>`)

Fine-grained permission checking for advanced authorization.

```typescript
<RequirePermission permission="content.publish" fallback={<UpgradePlan />}>
  <PublishButton />
</RequirePermission>
```

**Use Cases**:

- Feature flags
- Plan-based access (free vs paid)
- Custom RBAC systems

---

## Permission Hooks (Feature-Level)

While guard components control **route-level access**, permission hooks enable **fine-grained feature-level authorization** within components.

### When to Use Guards vs Hooks

| Authorization Level | Use              | Example                           |
| ------------------- | ---------------- | --------------------------------- |
| **Route/Page**      | Guard Components | Protect entire page/layout        |
| **Feature/Button**  | Permission Hooks | Show/hide button within page      |
| **Section**         | Permission Hooks | Conditional rendering of sections |
| **Action**          | Permission Hooks | Enable/disable specific actions   |

### Hook Examples

**Basic Permission Hook:**

```typescript
const { hasPermission } = usePermissions();

if (hasPermission("posts.delete")) {
  return <DeleteButton />;
}
```

**Role-Based Hook:**

```typescript
const { isAdmin, isModerator, role } = useRole();

if (isAdmin || isModerator) {
  return <ModerationPanel />;
}
```

**Organization Permission Hook:**

```typescript
const { hasPermission, orgRole } = useOrgPermissions(organizationId);

if (hasPermission("members.invite")) {
  return <InviteMemberButton />;
}
```

---

## Implementation

### Guard Component Structure

```typescript
"use client" // Client Component (uses hooks)

import { useSession } from "@/lib/auth/auth-client"

export function RequireAuth({
  children,
  fallback = <LoginComponent />,
  loadingFallback = <div>Loading...</div>,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  loadingFallback?: React.ReactNode
}) {
  const { data: session, isPending } = useSession()

  if (isPending) return <>{loadingFallback}</>
  if (!session) return <>{fallback}</>

  return <>{children}</>
}
```

**Key Features**:

- Accepts custom fallback UI
- Handles loading state separately
- Type-safe props with TypeScript
- Renders children only when authorized

---

### Role Guard Implementation

```typescript
import { useSession } from "@/lib/auth/auth-client"

export function RequireRole({
  role,
  children,
  fallback = <AccessDenied />,
}: {
  role: string | string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { data: session, isPending } = useSession()

  if (isPending) return <div>Loading...</div>
  if (!session) return <LoginComponent />

  const userRole = session.user.role
  const allowedRoles = Array.isArray(role) ? role : [role]

  if (!allowedRoles.includes(userRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
```

---

### Nested Guards (Complex Authorization)

Combine multiple guards for layered authorization:

```typescript
<RequireAuth>
  <RequireOrgMember organizationId={teamId}>
    <RequireRole roles={["owner", "admin"]}>
      <DangerousAction />
    </RequireRole>
  </RequireOrgMember>
</RequireAuth>
```

**Evaluation Order**: Outside → Inside (RequireAuth → RequireOrgMember → RequireRole)

**Use Cases**:

- Destructive actions (delete team, remove members)
- Billing/payment actions (team owner only)
- Administrative features (team admin or higher)

---

## Usage in Next.js Layouts

### Before (Imperative Pattern)

```typescript
export default function SettingsLayout({ children }) {
  const { isAuthenticated, isLoading, renderLogin } = useRequireAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return renderLogin("embedded")

  return <div>{children}</div>
}
```

**Problems**:

- Scattered auth logic
- Imperative checks in every layout
- Difficult to test
- Hard to change auth behavior globally

### After (Declarative Pattern)

```typescript
export default function SettingsLayout({ children }) {
  return (
    <RequireAuth>
      {children}
    </RequireAuth>
  )
}
```

**Benefits**:

- DRY (Don't Repeat Yourself)
- Clear intent from component tree
- Easy to update auth behavior globally
- Simple to test

---

## Testing

### Testing Guards

```typescript
import { render, screen } from "@testing-library/react"
import { RequireAuth } from "@/components/auth/RequireAuth"

describe("RequireAuth", () => {
  it("shows fallback when not authenticated", () => {
    mockUseSession({ data: null, isPending: false })

    render(
      <RequireAuth fallback={<div>Login Required</div>}>
        <div>Protected Content</div>
      </RequireAuth>
    )

    expect(screen.getByText("Login Required")).toBeInTheDocument()
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
  })

  it("shows loading state while checking auth", () => {
    mockUseSession({ data: null, isPending: true })

    render(
      <RequireAuth loadingFallback={<div>Loading...</div>}>
        <div>Protected Content</div>
      </RequireAuth>
    )

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows protected content when authenticated", () => {
    mockUseSession({ data: { user: { id: "123" } }, isPending: false })

    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    )

    expect(screen.getByText("Protected Content")).toBeInTheDocument()
  })
})
```

---

## Migration Strategy

### Step 1: Create Guard Components

Create guard components in `components/auth/`:

- `RequireAuth.tsx`
- `RequireRole.tsx`
- `RequirePermission.tsx` (optional)

### Step 2: Update Layouts

Replace imperative auth checks with guard components:

```diff
export default function SettingsLayout({ children }) {
-  const { isAuthenticated, renderLogin } = useRequireAuth()
-  if (!isAuthenticated) return renderLogin("embedded")
-
-  return <div>{children}</div>
+  return (
+    <RequireAuth>
+      {children}
+    </RequireAuth>
+  )
}
```

### Step 3: Update Pages

For page-level protection (if not using layout guards):

```diff
export default function ProfilePage() {
-  const { user, isLoading } = useRequireAuth()
-  if (isLoading) return <div>Loading...</div>
-  if (!user) return <LoginModal />
-
  return (
+    <RequireAuth>
      <ProfileContent user={user} />
+    </RequireAuth>
  )
}
```

### Step 4: Replace Conditional Rendering with Hooks

For feature-level authorization (buttons, sections):

```diff
-const { user } = useSession()
+const { hasPermission } = usePermissions()

-if (user?.role === "admin") {
+if (hasPermission("users.delete")) {
  return <DeleteUserButton />
}
```

---

## Best Practices

### ✅ Do

- Use guards for **route/page-level** protection
- Use hooks for **feature-level** authorization (buttons, sections)
- Provide meaningful fallback UI (not just "Access Denied")
- Handle loading states explicitly
- Nest guards when multiple conditions required
- Test guards independently with mocked sessions

### ❌ Don't

- Don't use guards for conditional rendering within a component (use hooks)
- Don't duplicate guards (put in layout instead)
- Don't forget loading state handling
- Don't mix imperative and declarative patterns
- Don't use guards in Server Components (use middleware/API protection)

---

## Alternatives Considered

### Higher-Order Components (HOCs)

```typescript
export default withAuth(withRole('admin')(AdminPage))
```

**Rejected**:

- Wrapper hell (difficult to debug)
- Poor TypeScript inference
- Dated pattern in modern React
- Complex composition

### Next.js Middleware Guards

```typescript
// middleware.ts
if (!session) return NextResponse.redirect('/login')
```

**Rejected**:

- Cannot show custom fallback UI
- Forces full page redirects
- Poor UX (full page loads)
- Harder to test
- Limited to path-based rules

### Continue with `useAuth` Hook Pattern

```typescript
const { isAuth, renderLogin } = useRequireAuth()
if (!isAuth) return renderLogin()
```

**Rejected**:

- Violates DRY principle
- Imperative (not declarative)
- Duplicated logic across files
- Difficult to maintain

---

## Related Documentation

- **Backend**: `.claude/agents/backend-developer.md` (Better Auth integration, permission models)
- **Frontend**: `.claude/agents/frontend-developer.md` (React patterns, Client Components)
- **Authentication Skills**: `.claude/skills/authentication-strategy.md`
- **ADR**: Consider creating ADR documenting your project's auth guard decision

---

## Framework Compatibility

| Framework                | Compatibility | Notes                            |
| ------------------------ | ------------- | -------------------------------- |
| **Next.js App Router**   | ✅ Full       | Use "use client" directive       |
| **Next.js Pages Router** | ✅ Full       | Works with `_app.tsx` wrapper    |
| **React (SPA)**          | ✅ Full       | Standard React patterns          |
| **Remix**                | ✅ Full       | Use in route components          |
| **Better Auth**          | ✅ Native     | `useSession()` hook              |
| **NextAuth.js**          | ✅ Compatible | Use `useSession()` from NextAuth |
| **Clerk**                | ✅ Compatible | Use `useUser()` from Clerk       |
| **Auth0**                | ✅ Compatible | Use `useAuth0()`                 |

---

**See Also**:

- Session Design Patterns: `docs/domains/authentication/session-design.md`
- Cookie Configuration: `docs/domains/authentication/cookie-configuration.md`
- TypeScript Type Safety: `docs/adr/ADR-013-typescript-type-safety-enforcement.md`
