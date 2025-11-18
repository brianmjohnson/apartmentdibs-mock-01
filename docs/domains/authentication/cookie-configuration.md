# Environment-Aware Cookie Configuration

**Type**: Implementation Guide
**Domain**: Authentication
**Adapted from**: ApartmentDibs ADR-007

---

## Overview

Configure authentication cookies with environment-specific security settings: strict in production, functional in staging/preview, and developer-friendly in local development.

**Core Principle**: **Security in production, functionality everywhere.**

---

## The Problem

Authentication cookies require different security settings per environment:

| Environment | Requirements |
|-------------|--------------|
| **Production** | Strict security (HTTPS, httpOnly, scoped domain) |
| **Preview/Staging** | HTTPS enabled, scoped to preview domain |
| **Local Development** | HTTP allowed, localhost domain, easy debugging |

**Consequences of misconfiguration**:
- ❌ Too strict: Local development breaks (secure cookies require HTTPS)
- ❌ Too permissive: Production security vulnerabilities
- ❌ Wrong domain: Cookies don't persist, authentication fails

---

## Environment-Aware Configuration

### Production (Strict Security)

```typescript
advanced: {
  crossSubDomainCookies: {
    enabled: true,
    domain: ".yourdomain.com"  // Leading dot enables subdomain sharing
  },
  useSecureCookies: true // Force secure even if detected as non-prod
}
```

**Cookie Attributes**:
- `Domain: .yourdomain.com` → Works on `app.yourdomain.com`, `www.yourdomain.com`
- `Secure: true` → HTTPS-only transmission
- `HttpOnly: true` → Prevents JavaScript access (XSS protection)
- `SameSite: Lax` → Balances security with OAuth redirect compatibility

**Why cross-subdomain?**
- Share sessions between `app.`, `www.`, `api.` subdomains
- Enables future microservice architectureswithin the same domain
- Simplifies OAuth redirects across subdomains

---

### Preview/Staging

```typescript
advanced: {
  crossSubDomainCookies: {
    enabled: false  // Each preview has unique domain
  },
  useSecureCookies: true  // Platform uses HTTPS
}
```

**Why no cross-subdomain?**
- Vercel/Netlify previews: Each branch gets unique domain
- Example: `my-app-feat-auth.vercel.app` (cannot share cookies)
- OAuth redirects point to preview-specific URLs

---

### Local Development

```typescript
advanced: {
  crossSubDomainCookies: {
    enabled: false
  },
  useSecureCookies: false  // HTTP in local dev
}
```

**Why no secure flag?**
- Local dev typically uses `http://localhost:3000`
- Secure cookies require HTTPS
- Developer UX: No need to set up local SSL certificates

---

## Implementation

### Environment Detection

**Pattern (Better Auth example)**:

```typescript
const isProduction =
  process.env.NODE_ENV === "production" &&
  !process.env.VERCEL_ENV?.includes("preview");

const isPreview = process.env.VERCEL_ENV === "preview";

const cookieConfig = {
  advanced: {
    crossSubDomainCookies: isProduction
      ? {
          enabled: true,
          domain: ".yourdomain.com", // ⚠️ Update with your domain
        }
      : { enabled: false },
    useSecureCookies: isProduction || isPreview,
  },
};
```

**Best Practice: Centralize environment detection**:

```typescript
// lib/environments.ts
export const IS_PRODUCTION =
  process.env.NODE_ENV === "production" &&
  !process.env.VERCEL_ENV?.includes("preview");

export const IS_PREVIEW = process.env.VERCEL_ENV === "preview";

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

// lib/auth/auth-server.ts
import { IS_PRODUCTION, IS_PREVIEW } from "@/lib/environments";

advanced: {
  useSecureCookies: IS_PRODUCTION || IS_PREVIEW,
  crossSubDomainCookies: IS_PRODUCTION
    ? { enabled: true, domain: ".yourdomain.com" }
    : { enabled: false },
}
```

---

### Complete Configuration (Better Auth)

```typescript
import { betterAuth } from "better-auth";
import { IS_PRODUCTION, IS_PREVIEW } from "@/lib/environments";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,

  advanced: {
    // Cookie prefix (optional)
    cookiePrefix: "auth",

    // Security settings
    useSecureCookies: IS_PRODUCTION || IS_PREVIEW,

    // Cross-subdomain support (production only)
    crossSubDomainCookies: IS_PRODUCTION
      ? {
          enabled: true,
          domain: ".yourdomain.com", // ⚠️ Update with your domain
        }
      : {
          enabled: false,
        },

    // CSRF protection (enabled by default, keep it)
    disableCsrf: false,

    // Cookie customization (optional)
    cookies: {
      session_token: {
        name: "session_token",
        attributes: {
          sameSite: "lax", // OAuth compatibility
        },
      },
      session_data: {
        name: "session_data",
        attributes: {
          sameSite: "lax",
        },
      },
    },
  },

  // ... rest of config
});
```

---

### Environment Variables

**Production**:

```env
# .env.production
NODE_ENV=production
BETTER_AUTH_URL=https://app.yourdomain.com
BETTER_AUTH_SECRET=<32-byte-base64-secret>
```

**Preview/Staging**:

```env
# .env.preview (or Vercel auto-sets)
NODE_ENV=production
VERCEL_ENV=preview
BETTER_AUTH_URL=https://my-app-branch.vercel.app
BETTER_AUTH_SECRET=<secret>
```

**Local Development**:

```env
# .env.local
NODE_ENV=development
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=local-secret-for-dev
```

---

## Cookie Attributes Reference

### Production Cookie Example

```
Set-Cookie: auth.session_token=<value>;
  Domain=.yourdomain.com;
  Path=/;
  HttpOnly;
  Secure;
  SameSite=Lax;
  Max-Age=2592000
```

### Attribute Explanations

| Attribute | Value | Purpose |
|-----------|-------|---------|
| **Domain** | `.yourdomain.com` | Enables cross-subdomain cookies |
| **Path** | `/` | Cookie available for all routes |
| **HttpOnly** | `true` | Prevents JavaScript access (XSS protection) |
| **Secure** | `true` | HTTPS-only transmission |
| **SameSite** | `Lax` | Balances security with OAuth compatibility |
| **Max-Age** | `2592000` | 30 days (customize per your needs) |

---

## Testing Checklist

### Local Development

- [ ] Sign in at `localhost:3000`
- [ ] Session persists across page reloads
- [ ] Cookie visible in browser DevTools (Application → Cookies)
- [ ] `Secure` flag is `false` (HTTP allowed)

### Preview/Staging

- [ ] Sign in at `<branch>.vercel.app`
- [ ] Session persists across pages
- [ ] `Secure` flag is `true` (HTTPS enforced)
- [ ] Cookie scoped to preview domain

### Production

- [ ] Sign in at `app.yourdomain.com`
- [ ] Cookie domain is `.yourdomain.com`
- [ ] `HttpOnly` is `true` (XSS protection)
- [ ] `Secure` is `true` (HTTPS-only)
- [ ] `SameSite` is `Lax`
- [ ] Session works across subdomains (if using cross-subdomain cookies)

### Security Validation

**Browser DevTools Check**:

```bash
# Open: Application > Cookies > https://app.yourdomain.com
# Verify:
Name: auth.session_token (or your cookie name)
Domain: .yourdomain.com
Path: /
HttpOnly: ✓ (checked)
Secure: ✓ (checked)
SameSite: Lax
```

**XSS Protection Test**:

```javascript
// In browser console
document.cookie
// Should NOT see session_token (httpOnly protection)
```

---

## Common Issues & Solutions

### Issue: Cookies not persisting in production

**Cause**: Domain mismatch

```typescript
// ❌ Wrong: No leading dot
crossSubDomainCookies: {
  enabled: true,
  domain: "yourdomain.com"  // Missing leading dot
}

// ✅ Correct: Leading dot enables subdomains
crossSubDomainCookies: {
  enabled: true,
  domain: ".yourdomain.com"  // Leading dot
}
```

### Issue: Cookies work locally but fail in preview

**Cause**: Secure flag enabled in non-HTTPS environment

```typescript
// ❌ Wrong: Forces secure in preview with HTTP
useSecureCookies: true

// ✅ Correct: Only secure in HTTPS environments
useSecureCookies: IS_PRODUCTION || IS_PREVIEW
```

### Issue: OAuth redirects fail

**Cause**: `SameSite` too strict

```typescript
// ❌ Wrong: Blocks OAuth redirects
cookies: {
  session_token: {
    attributes: {
      sameSite: "strict"  // Too restrictive
    }
  }
}

// ✅ Correct: Lax allows OAuth
cookies: {
  session_token: {
    attributes: {
      sameSite: "lax"  // Balances security + functionality
    }
  }
}
```

---

## SameSite Attribute Guide

| Value | OAuth Compatibility | Security | Use Case |
|-------|---------------------|----------|----------|
| **Strict** | ❌ Breaks OAuth | Highest | Internal apps (no OAuth) |
| **Lax** | ✅ Works | High | Recommended for most apps |
| **None** | ✅ Works | Lower | Third-party embeds (requires Secure) |

**Recommendation**: Use `Lax` for authentication cookies (works with OAuth, strong security).

---

## Cross-Subdomain Cookie Patterns

### When to Enable

✅ **Enable cross-subdomain cookies if**:
- You have multiple subdomains (`app.`, `www.`, `api.`)
- Want to share sessions across subdomains
- Planning microservice architecture on subdomains

❌ **Disable cross-subdomain cookies if**:
- Single domain only
- Using dynamic preview domains (Vercel, Netlify)
- Security requires subdomain isolation

### Example Architecture

**With cross-subdomain cookies**:

```
.yourdomain.com           ← Cookie domain
├── app.yourdomain.com    ✅ Shares cookies
├── www.yourdomain.com    ✅ Shares cookies
└── api.yourdomain.com    ✅ Shares cookies
```

**Without cross-subdomain cookies**:

```
app.yourdomain.com        ← Cookie domain
├── app.yourdomain.com    ✅ Cookies work
├── www.yourdomain.com    ❌ Different domain, no cookies
└── api.yourdomain.com    ❌ Different domain, no cookies
```

---

## Alternatives Considered

### Same Configuration Everywhere

**Rejected**:
- Local dev breaks (secure cookies require HTTPS)
- Preview environments fail (domain mismatch)
- One-size-fits-all doesn't work for auth cookies

### No Cross-Subdomain Cookies

**Rejected**:
- Limits future architecture (cannot add `api.` subdomain later)
- Harder to migrate to microservices

### Wildcard Domain (`*.yourdomain.com`)

**Rejected**:
- Not valid cookie domain syntax
- Leading dot `.yourdomain.com` is correct approach

### Separate Auth Domain (`auth.yourdomain.com`)

**Rejected**:
- Adds deployment complexity
- Requires additional subdomain setup
- Cookies still need domain scoping

---

## Framework-Specific Examples

### NextAuth.js

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  cookies: {
    sessionToken: {
      name: IS_PRODUCTION ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: IS_PRODUCTION || IS_PREVIEW,
        domain: IS_PRODUCTION ? '.yourdomain.com' : undefined,
      },
    },
  },
}
```

### Clerk

```typescript
// Clerk handles cookie configuration automatically
// But you can customize in Clerk Dashboard:
// - Session lifetime
// - Cookie SameSite attribute
// - Multi-domain support
```

### Auth0

```typescript
// Auth0 SDK automatically sets secure cookies based on protocol
// No manual configuration needed for basic use cases
```

---

## Security Best Practices

### ✅ Do

- Use `httpOnly: true` for session cookies (prevents XSS)
- Use `secure: true` in production (HTTPS-only)
- Use `sameSite: 'lax'` for auth cookies (OAuth compatible)
- Scope cookies to your domain in production
- Test in all environments before deploying
- Document environment differences for team

### ❌ Don't

- Don't use `sameSite: 'none'` unless absolutely necessary
- Don't disable CSRF protection
- Don't use same config in all environments
- Don't hardcode domain names (use environment variables)
- Don't expose session cookies to JavaScript (keep httpOnly)
- Don't use overly permissive cookie domains

---

## Related Documentation

- **Session Design**: `docs/domains/authentication/session-design.md`
- **Guard Components**: `docs/domains/authentication/guard-components.md`
- **OAuth Proxy Strategy**: `.claude/skills/oauth-proxy-preview-environments.md` (if applicable)

---

## External Resources

- [OWASP Cookie Security](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [Better Auth Cookies](https://www.better-auth.com/docs/concepts/cookies)
- [MDN: Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [SameSite Cookies Explained](https://web.dev/articles/samesite-cookies-explained)

---

**Key Takeaway**: **Environment-aware cookie configuration is essential—security in production, functionality everywhere.**
