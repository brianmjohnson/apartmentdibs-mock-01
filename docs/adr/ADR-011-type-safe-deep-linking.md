# ADR-011: Type-Safe Deep Linking with OAuth Redirect Support

**Status:** DRAFT
**Date:** 2025-11-17
**Author:** System Architecture <system@example.com>

---

## Context

**What is the issue or problem we're solving?**

Modern web applications need deep linking that works seamlessly with OAuth authentication flows while maintaining type safety and security.

**The Problem**:

**OAuth Redirect Preservation**:
- Users access protected resources while unauthenticated → redirected to `/signin`
- After OAuth authentication completes → users must return to original destination
- Context must be preserved: path, search params, AND hash fragments
- Example: User clicks "Edit Profile" → OAuth → Returns to profile page with edit modal open

**State Management Complexity**:
URLs must support two distinct types of state:
- **Shared client-server state**: Filters, pagination, sorting (affects SSR, sent to server)
- **Client-only state**: UI triggers like modals, scrolling, view switching (no server round-trip)

**Type Safety**:
- Manual URL construction is error-prone (`/users/${id}` vs `/user/${id}`)
- Routes, search parameters, and hash actions need compile-time validation
- Refactoring routes is risky without type safety

**Security**:
- Callback URL validation must prevent open redirect vulnerabilities
- Arbitrary redirects after OAuth can compromise user accounts
- Legitimate deep links must still work

**Example Scenario**:

```
1. User (logged out) clicks "Edit Profile"
2. Redirect to: /signin?destination=%2Fprofile%23edit
3. User completes Google OAuth
4. OAuth callback redirects to: /profile#edit
5. Profile page detects #edit hash and opens edit modal
```

**Background**:
- Next.js App Router uses file-based routing
- OAuth providers (Google, GitHub) redirect to callback URLs
- Hash fragments (#) are client-only, not sent to server
- Search params (?) are sent to server, affect SSR

**Requirements**:
- Preserve deep links through OAuth flows
- Type-safe route construction (compile-time validation)
- Separate server state (search params) from client state (hash)
- Security: prevent open redirect vulnerabilities
- Developer experience: autocomplete for routes and actions

---

## Decision

**Implement a type-safe deep linking system that separates URL concerns and provides compile-time validation**

This establishes typed destination builders for all routes with explicit separation of server state (search params) and client state (hash actions).

### URL Structure

```
/path?<search-params>#<hash-action>
│     │                 │
│     │                 └─ Client-only state (no server round-trip)
│     └─────────────────── Shared client-server state
└───────────────────────── Route path
```

**Key Properties**:

**Search params** (`?key=value`):
- ✅ Sent to server in every request
- ✅ Affect server-side rendering (SSR)
- ✅ Trigger page rerenders when changed
- ✅ SEO-friendly (crawlers see them)
- ✅ Preserved in browser history
- **Use for**: Filters, pagination, sorting, UTM params

**Hash fragments** (`#action`):
- ✅ Client-only (not sent to server)
- ✅ No page reload when changed
- ✅ No server round-trip
- ✅ Preserved in browser history
- ❌ Not SEO-friendly (crawlers ignore)
- **Use for**: Modal triggers, scroll targets, view switching

---

### Type-Safe Destination Builders

**Core Pattern**:

```typescript
// lib/deep-linking.ts

// Route-specific destination builders with typed params and actions
const destinations = {
  profile: (params?: ProfileSearchParams, hashAction?: ProfileHashAction) =>
    buildDestinationUrl("/profile", params, hashAction),

  user: (
    username: string,
    params?: UserSearchParams,
    hashAction?: UserHashAction,
  ) => buildDestinationUrl(`/user/${username}`, params, hashAction),

  posts: (params?: PostsSearchParams, hashAction?: PostsHashAction) =>
    buildDestinationUrl("/posts", params, hashAction),

  home: () => "/",
  dashboard: () => "/dashboard",
} as const

// Usage
const destination = destinations.user(
  "alice",
  { tab: "posts", sort: "date:desc" }, // Type-checked search params
  "scroll-to:comment:abc123", // Type-checked hash action
)
// Result: /user/alice?tab=posts&sort=date:desc#scroll-to:comment:abc123
```

**Type Safety Benefits**:
- ✅ Autocomplete for all route functions
- ✅ Compile-time errors for invalid routes
- ✅ Typed search parameters (no typos)
- ✅ Typed hash actions (validated patterns)

---

### Hash Action Types

Use TypeScript template literal types to enforce action patterns:

```typescript
// lib/deep-linking.ts

type ProfileHashAction =
  | "edit"
  | "settings"
  | "change-password"
  | `scroll-to:${string}:${string}` // Generic scroll pattern

type UserHashAction =
  | "follow"
  | "message"
  | `scroll-to:comment:${string}`
  | `scroll-to:post:${string}`

type PostsHashAction =
  | "create"
  | "grid-view"
  | "list-view"
  | `scroll-to:post:${string}`
```

**Colon Separators in scroll-to Pattern**:

The generic `scroll-to:{entityType}:{entityId}` pattern uses colons instead of hyphens to avoid ambiguity with UUIDs (which contain hyphens).

Examples:
- `scroll-to:comment:abc123` - Scroll to comment with ID abc123
- `scroll-to:post:xyz789` - Scroll to post with ID xyz789
- `scroll-to:comment:123e4567-e89b-12d3-a456-426614174000` - UUID works correctly

---

### Search Param Types

Define route-specific search parameter schemas:

```typescript
// lib/deep-linking.ts

type ProfileSearchParams = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

type UserSearchParams = {
  tab?: "posts" | "comments" | "likes"
  sort?: `${string}:${"asc" | "desc"}` // e.g., "date:asc"
  page?: string
}

type PostsSearchParams = {
  category?: string
  tag?: string
  page?: string
  filters?: string // JSON-encoded filter object
}
```

**Benefits**:
- ✅ Type-checked parameter names
- ✅ Validated parameter values (e.g., tab can only be "posts", "comments", or "likes")
- ✅ Self-documenting (type definition is documentation)

---

### OAuth Flow Integration

**Complete Flow**:

```typescript
// 1. Build signin URL with destination
const destination = destinations.profile({}, "edit")
const signinUrl = buildSigninUrl(destination)
// Result: /signin?destination=%2Fprofile%23edit

// 2. Better Auth OAuth callback preserves destination in state parameter

// 3. Callback handler decodes and redirects (307) to destination

// 4. Page component executes hash action
useEffect(() => {
  const hashAction = parseHashAction(window.location.hash)

  if (hashAction === "edit") {
    openEditModal()

    // Clear hash to prevent re-triggering on navigation
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    )
  }
}, [])
```

**Security Validation**:

```typescript
// lib/utils-client.ts

export function validateCallbackUrl(url: string): boolean {
  // Only allow relative URLs
  if (!url.startsWith("/")) return false

  // Prevent protocol-relative URLs (//evil.com)
  if (url.startsWith("//")) return false

  // Prevent javascript: protocol
  if (url.toLowerCase().startsWith("javascript:")) return false

  // Prevent data: protocol
  if (url.toLowerCase().startsWith("data:")) return false

  return true
}
```

---

### Destination Encoding Formats

The system supports **three destination encoding formats** with automatic detection:

**1. Raw Relative URL (Preferred for Internal Use)**

```typescript
destination = "/profile?tab=posts#edit"
```

- **Format**: Plain relative URL with path, search params, and hash
- **Detection**: Starts with `/`
- **Use case**: Internal TypeScript code using destination builders
- **Supports hash**: ✅ Yes, full deep linking support

**2. URL-Encoded (Web-Safe)**

```typescript
destination = "%2Fprofile%3Ftab%3Dposts%23edit"
```

- **Format**: Standard URL encoding (percent-encoded)
- **Detection**: Starts with `%2F` (encoded `/`)
- **Use case**: Query parameters that need to be web-safe
- **Supports hash**: ✅ Yes, hash encoded as `%23`

**3. Base64 URL-Encoded (Compact, URL-Safe)**

```typescript
destination = "L3Byb2ZpbGU_dGFiPXBvc3RzI2VkaXQ"
```

- **Format**: Base64 URL encoding (RFC 4648 §5) - URL-safe variant
  - Replaces `+` with `-`
  - Replaces `/` with `_`
  - Removes padding `=`
- **Detection**: Does not start with `/` or `%2F`, valid base64url
- **Use case**: URL-safe encoding, no additional encoding needed
- **Supports hash**: ✅ Yes, full preservation
- **Compact**: Shorter than URL-encoded for long URLs

---

### Auto-Detection Algorithm

```typescript
// lib/deep-linking.ts

function normalizeDestination(destination: string | null | undefined): string {
  if (!destination) {
    return buildDestinationFromCurrentLocation() // Auto-capture current URL
  }

  if (destination.startsWith("/")) {
    return destination // Format 1: Raw
  }

  if (destination.startsWith("%2F")) {
    return decodeURIComponent(destination) // Format 2: URL-encoded
  }

  // Format 3: Base64 URL (fallback)
  try {
    const decoded = decodeDestination(destination) // Auto-handles base64url
    if (decoded && decoded.startsWith("/")) {
      return decoded
    }
  } catch {
    console.warn("Invalid destination format, using /")
  }

  return "/" // Safe fallback
}

// Base64 URL decoding (RFC 4648 §5)
function decodeDestination(encoded: string): string {
  // Convert base64url to standard base64
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")

  // Add padding if needed
  const padding = (4 - (base64.length % 4)) % 4
  if (padding > 0) {
    base64 += "=".repeat(padding)
  }

  return Buffer.from(base64, "base64").toString("utf-8")
}
```

---

### Usage Examples

**Internal TypeScript Code**:

```typescript
// Use destination builders (outputs raw format)
const dest = destinations.profile({}, "edit")
// Result: "/profile#edit"

<SignInComponent destination={dest} />
```

**External Marketing Site (JavaScript)**:

```javascript
// Option A: URL-encoded (simple, widely compatible)
const dest = encodeURIComponent("/profile#edit")
window.location = `/signin?destination=${dest}`

// Option B: Base64 URL (compact, URL-safe, no extra encoding needed)
function base64UrlEncode(str) {
  const base64 = btoa(str) // Standard base64
  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "") // Remove padding
}

const dest = base64UrlEncode("/profile#edit")
window.location = `/signin?destination=${dest}`
// Result: /signin?destination=L3Byb2ZpbGUjZWRpdA
// No % encoding needed!
```

**Query Parameter Passing**:

```typescript
// All three formats work automatically
router.push(`/signin?destination=/profile#edit`) // Raw
router.push(`/signin?destination=%2Fprofile%23edit`) // URL-encoded
router.push(`/signin?destination=L3Byb2ZpbGUjZWRpdA`) // Base64 URL
```

---

### Core Utilities

**URL Construction**:

```typescript
// lib/deep-linking.ts

// Build typed destination URL
function buildDestinationUrl<P, A>(
  path: string,
  searchParams?: P,
  hashAction?: A,
): string

// Build signin URL with encoded destination
function buildSigninUrl(destination: string): string

// Encode/decode destination (base64url format)
function encodeDestination(url: string): string
function decodeDestination(encoded: string): string

// Auto-detect and normalize any format to raw URL
function normalizeDestination(destination: string | null | undefined): string
```

**URL Parsing**:

```typescript
// Split URL into components
function parseDestinationUrl(url: string): {
  path: string
  searchParams: Record<string, string>
  hashAction: string | null
}

// Extract typed hash action from fragment
function parseHashAction(hash: string): string | null

// Parse scroll target from action
function extractScrollTargetId(action: string): {
  type: string
  id: string
} | null
// Example: "scroll-to:comment:abc123" → { type: "comment", id: "abc123" }
```

**Destination Builders**:

```typescript
const destinations = {
  profile: (params?, action?) => buildDestinationUrl("/profile", params, action),
  user: (username, params?, action?) => buildDestinationUrl(`/user/${username}`, params, action),
  posts: (params?, action?) => buildDestinationUrl("/posts", params, action),
  home: () => "/",
  dashboard: () => "/dashboard",
} as const
```

**Location Capture**:

```typescript
// Capture browser's current URL (path + search + hash)
function buildDestinationFromCurrentLocation(): string
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences (Easier)

✅ **Type Safety**: Compile-time validation prevents typos in routes, params, and hash actions
- Example: `destinations.usre("alice")` → TypeScript error (typo in "user")

✅ **Centralized Route Definitions**: Single source of truth for all URL construction
- Change route pattern once, all usages update automatically

✅ **OAuth Compatibility**: Seamless deep linking through authentication flows
- Users land exactly where they intended after OAuth

✅ **Developer Experience**: IDE autocomplete for all routes and actions
- Faster development, fewer bugs

✅ **Refactoring Safety**: Changing route patterns is localized to `lib/deep-linking.ts`
- Find all route usages via TypeScript compiler

✅ **Security**: Controlled URL construction reduces open redirect vulnerabilities
- Validation layer catches malicious redirects

✅ **Separation of Concerns**: Clear distinction between server state and client state
- Server doesn't process client-only actions

✅ **SEO-Friendly**: Search params remain in URL for server-side rendering and crawlers
- Hash actions don't affect SEO

### Negative Consequences (More Difficult)

⚠️ **Additional Abstraction**: Developers must learn destination builder API
- *Mitigation*: Comprehensive documentation and examples in this ADR
- *Mitigation*: Type safety makes API discoverable via autocomplete

⚠️ **Migration Required**: Existing manual URL construction code needs updating
- *Mitigation*: Migration can be incremental (start with auth flows)
- *Mitigation*: Consider ESLint rule to detect manual URL construction

⚠️ **Hash State Limitations**: Hash actions cannot directly affect SSR or SEO
- *Mitigation*: Use search params for SEO-critical state
- *Mitigation*: Document pattern clearly in team guidelines

⚠️ **Type Maintenance**: New routes require updating destination builders
- *Mitigation*: Template for adding new routes (copy existing pattern)
- *Future*: Consider generating builders from Next.js route files

### Neutral Consequences

- **Hash Clearing**: Components must manually clear hash after action execution
- **Validation Overhead**: `validateCallbackUrl()` adds processing time (negligible, security benefit)
- **Three Encoding Formats**: Flexibility adds complexity (auto-detection mitigates this)

---

## Alternatives Considered

### Alternative 1: Manual URL Construction with String Concatenation

**Description**: Continue building URLs manually

```typescript
// ❌ Error-prone, no type safety
const url = `/user/${username}?tab=${tab}#${action}`
```

**Pros**:
- Simple, no abstraction
- Everyone knows how URLs work

**Cons**:
- Typos in routes not caught until runtime
- No autocomplete or type checking
- Difficult to refactor when routes change
- Easy to forget URL encoding
- No centralized route definitions

**Why Not Chosen**: Lack of type safety leads to runtime bugs. Refactoring routes is risky and error-prone.

---

### Alternative 2: Next.js Query Params for All State

**Description**: Use query params for both server and client state

```typescript
// ❌ Use query params for UI triggers
const url = `/profile?action=edit`
```

**Pros**:
- Simple, one state mechanism
- SEO-friendly

**Cons**:
- Action triggers require server round-trip (performance penalty)
- Actions affect browser history and back button behavior
- Server must handle client-only actions (complexity)
- Cannot trigger client actions without page reload
- URL pollution (long query strings)

**Why Not Chosen**: Mixing server and client state adds unnecessary complexity and performance overhead. Hash fragments are semantically correct for client-only actions.

---

### Alternative 3: Custom State Management for Actions

**Description**: Store post-auth actions in Redux/Zustand

```typescript
// ❌ Store actions in client state
setAuthRedirectAction({ type: "edit", resource: "profile" })
```

**Pros**:
- Type-safe state management
- No URL encoding concerns

**Cons**:
- State not preserved across browser sessions
- Breaks shareable deep links (can't share "edit profile" link)
- Requires additional state management complexity
- Not compatible with server-side rendering
- Lost on page refresh

**Why Not Chosen**: Deep links must be shareable and persistent. Client-only state doesn't support this requirement.

---

### Alternative 4: Route Middleware with Custom Headers

**Description**: Pass actions via custom HTTP headers

```typescript
// ❌ Pass actions via headers during OAuth callback
headers: { "X-Post-Auth-Action": "edit" }
```

**Pros**:
- Keeps URLs clean
- Type-safe (if wrapped)

**Cons**:
- Custom headers not preserved through OAuth provider redirects
- Not compatible with standard OAuth flow
- Browser security restrictions on custom headers
- Not shareable or bookmarkable
- Lost on client-side navigation

**Why Not Chosen**: OAuth providers don't preserve custom headers. Deep links must be URL-based for shareability.

---

### Alternative 5: Separate Action Parameter in Search Params

**Description**: Use special query param for client actions

```typescript
// ❌ Use reserved query param
/profile?tab=posts&_action=edit
```

**Pros**:
- Simple implementation
- URL-based (shareable)

**Cons**:
- Client actions appear in server logs and analytics (noise)
- Actions affect URL history and back button
- Special parameter naming convention fragile
- Not semantically correct (actions aren't search params)
- Conflicts possible with existing params

**Why Not Chosen**: Hash fragments are semantically correct for client-only triggers. No server-side pollution, no history clutter.

---

## Related

**Related ADRs**:
- None yet (this is a new pattern for projects_template)

**Related Documentation**:
- `docs/domains/authentication/session-design.md` - Session management patterns
- `lib/deep-linking.ts` - Implementation (to be created)

**External References**:
- [URL Specification (WHATWG)](https://url.spec.whatwg.org/)
- [RFC 4648 - Base64 Encoding](https://datatracker.ietf.org/doc/html/rfc4648)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [Open Redirect Vulnerability (OWASP)](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)

---

## Notes

### Implementation Checklist

**Phase 1: Core Utilities** (lib/deep-linking.ts):
- [ ] Create `buildDestinationUrl()` function
- [ ] Create `buildSigninUrl()` function
- [ ] Create `normalizeDestination()` with auto-detection
- [ ] Create `parseDestinationUrl()` function
- [ ] Create `parseHashAction()` function
- [ ] Create `extractScrollTargetId()` function
- [ ] Create `validateCallbackUrl()` security function
- [ ] Add comprehensive JSDoc documentation

**Phase 2: Type Definitions**:
- [ ] Define hash action types for each route
- [ ] Define search param types for each route
- [ ] Create destination builder functions
- [ ] Export typed constants

**Phase 3: Authentication Integration**:
- [ ] Update `/signin` page to handle destination param
- [ ] Update OAuth callback to preserve destination
- [ ] Add security validation in callback handler
- [ ] Test OAuth flow with various destinations

**Phase 4: Component Integration**:
- [ ] Create `useHashAction()` hook for standardized hash handling
- [ ] Update authentication components to use destination builders
- [ ] Add hash action handling to route pages
- [ ] Document pattern for adding new routes

**Phase 5: Migration**:
- [ ] Migrate high-traffic routes first
- [ ] Update authentication flows
- [ ] Migrate remaining manual URL construction
- [ ] Add ESLint rule to prevent manual URL construction (optional)

---

### Testing Checklist

**Unit Tests** (`__tests__/lib/deep-linking.test.ts`):
- [ ] Test `buildDestinationUrl()` with all param combinations
- [ ] Test `normalizeDestination()` with all three encoding formats
- [ ] Test `parseDestinationUrl()` URL parsing
- [ ] Test `parseHashAction()` hash extraction
- [ ] Test `extractScrollTargetId()` with various patterns
- [ ] Test `validateCallbackUrl()` security validation

**Integration Tests**:
- [ ] Test OAuth flow with raw destination
- [ ] Test OAuth flow with URL-encoded destination
- [ ] Test OAuth flow with base64url destination
- [ ] Test destination preservation through OAuth callback
- [ ] Test hash action execution after OAuth

**E2E Tests** (Playwright):
- [ ] Test complete flow: protected page → OAuth → return with hash action
- [ ] Test modal opening from hash action
- [ ] Test scroll-to functionality
- [ ] Test hash clearing after action execution
- [ ] Test browser back button behavior

**Security Tests**:
- [ ] Test open redirect prevention (absolute URLs rejected)
- [ ] Test protocol-relative URLs rejected (`//evil.com`)
- [ ] Test javascript: protocol rejected
- [ ] Test data: protocol rejected
- [ ] Test valid relative URLs accepted

---

### Usage Patterns

**Adding a New Route**:

```typescript
// 1. Define hash action type
type MyPageHashAction = "action1" | "action2" | `scroll-to:${string}:${string}`

// 2. Define search param type
type MyPageSearchParams = {
  filter?: string
  sort?: "asc" | "desc"
}

// 3. Add destination builder
const destinations = {
  // ... existing routes
  myPage: (params?: MyPageSearchParams, hashAction?: MyPageHashAction) =>
    buildDestinationUrl("/my-page", params, hashAction),
}

// 4. Use in components
const dest = destinations.myPage({ filter: "active" }, "action1")
```

**Handling Hash Actions in Pages**:

```typescript
// app/profile/page.tsx
"use client"

import { useEffect } from "react"
import { parseHashAction } from "@/lib/deep-linking"

export default function ProfilePage() {
  useEffect(() => {
    const hashAction = parseHashAction(window.location.hash)

    if (hashAction === "edit") {
      openEditModal()
      clearHash()
    } else if (hashAction === "settings") {
      openSettingsModal()
      clearHash()
    }
  }, [])

  function clearHash() {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    )
  }

  return <ProfileContent />
}
```

**Creating Shareable Deep Links**:

```typescript
// Share button component
function ShareProfileButton({ username }: { username: string }) {
  const shareUrl = destinations.user(username, {}, "follow")
  // Result: /user/alice#follow

  return (
    <button onClick={() => navigator.share({ url: shareUrl })}>
      Share Profile
    </button>
  )
}
```

---

### Future Enhancements

1. **ESLint Rule**: Enforce destination builders over manual URL construction
2. **React Hook**: `useHashAction()` for standardized hash action handling
3. **Type Generation**: Generate destination builders from Next.js route files
4. **Analytics Integration**: Track deep link usage and conversion rates
5. **A/B Testing**: Test different hash actions for conversion optimization
6. **Developer Tools**: Browser extension to visualize deep link structure
7. **Documentation Site**: Interactive playground for testing destination builders

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-17 | System Architecture | Initial draft |
