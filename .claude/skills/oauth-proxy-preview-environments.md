# OAuth Proxy for Preview Environments

**Use When**: OAuth providers (Google, GitHub) require static callback URLs but preview deployments have dynamic URLs

---

## Context

OAuth providers require pre-registered redirect URIs. Preview deployments (Vercel, Netlify) generate unique URLs per branch, making it impossible to pre-register all callback URLs.

**Adapted from**: ApartmentDibs ADR-016

---

## Problem

**OAuth Callback URL Mismatch**:

```
OAuth Provider (Google):
  Allowed redirect URIs:
  - https://yourdomain.com/api/auth/callback/google
  - https://staging.yourdomain.com/api/auth/callback/google

Preview Deployment:
  - https://my-app-feat-auth-abc123.vercel.app/api/auth/callback/google
    ❌ NOT in allowed list → OAuth fails
```

**Why This Happens**:

- Preview URLs are dynamic (`abc123` changes per deployment)
- OAuth providers require exact URL matches
- Can't pre-register thousands of possible preview URLs
- Preview deployments can't use OAuth without workaround

---

## Solution: OAuth Proxy Pattern

### Architecture

```
User → Preview Deployment → OAuth Proxy (Production) → OAuth Provider
                                    ↓
                                OAuth Provider → OAuth Proxy → Preview Deployment
```

**Flow**:

1. User clicks "Sign in with Google" on preview deployment
2. Preview redirects to production proxy: `https://yourdomain.com/auth/proxy?destination=<preview-url>`
3. Proxy initiates OAuth with provider
4. Provider redirects back to proxy: `https://yourdomain.com/api/auth/callback/google`
5. Proxy completes OAuth, then redirects to original preview URL with auth token

---

### Implementation

**1. OAuth Proxy Endpoint (Production)**:

```typescript
// app/auth/proxy/route.ts (deployed to production domain)
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth-server'

export async function GET(request: NextRequest) {
  const destination = request.nextUrl.searchParams.get('destination')
  const provider = request.nextUrl.searchParams.get('provider') || 'google'

  // Validate destination (security check)
  if (!isValidPreviewUrl(destination)) {
    return new Response('Invalid destination', { status: 400 })
  }

  // Store destination in session/cookie for later
  const session = new Session()
  session.set('oauth_destination', destination)

  // Redirect to OAuth provider
  // OAuth will callback to production URL (allowed in OAuth config)
  return auth.api.signIn.social({
    provider,
    callbackUrl: `https://yourdomain.com/api/auth/callback/${provider}`,
  })
}

function isValidPreviewUrl(url: string | null): boolean {
  if (!url) return false

  // Only allow preview deployments
  return url.startsWith('https://') && (url.includes('.vercel.app') || url.includes('.netlify.app'))
}
```

**2. OAuth Callback Handler (Production)**:

```typescript
// app/api/auth/callback/[provider]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth-server'

export async function GET(request: NextRequest, { params }: { params: { provider: string } }) {
  // Complete OAuth with provider
  const session = await auth.api.signIn.social({
    provider: params.provider,
    // ... handle OAuth callback
  })

  // Get destination from session
  const destination = session.get('oauth_destination')

  if (!destination || !isValidPreviewUrl(destination)) {
    // Fallback to production if no valid destination
    return NextResponse.redirect('https://yourdomain.com/dashboard')
  }

  // Create auth token to send to preview
  const token = createAuthToken(session)

  // Redirect to preview deployment with auth token
  return NextResponse.redirect(`${destination}?auth_token=${token}`)
}
```

**3. Preview Deployment Handler**:

```typescript
// app/auth/callback/route.ts (preview deployment)
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('auth_token')

  if (!token) {
    return NextResponse.redirect('/signin?error=no_token')
  }

  // Verify token and create session
  const session = await verifyAuthToken(token)

  if (!session) {
    return NextResponse.redirect('/signin?error=invalid_token')
  }

  // Create session in preview deployment
  await createSession(session)

  // Redirect to dashboard
  return NextResponse.redirect('/dashboard')
}
```

---

## Security Considerations

**Token Exchange Security**:

```typescript
// Create short-lived auth token
function createAuthToken(session: Session): string {
  const payload = {
    userId: session.user.id,
    email: session.user.email,
    exp: Date.now() + 5 * 60 * 1000, // 5 minutes
  }

  return jwt.sign(payload, process.env.JWT_SECRET!)
}

// Verify token
function verifyAuthToken(token: string): Session | null {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)

    // Check expiration
    if (payload.exp < Date.now()) {
      return null
    }

    return {
      user: {
        id: payload.userId,
        email: payload.email,
      },
    }
  } catch {
    return null
  }
}
```

**Destination Validation**:

```typescript
function isValidPreviewUrl(url: string | null): boolean {
  if (!url) return false

  try {
    const parsed = new URL(url)

    // Only allow HTTPS
    if (parsed.protocol !== 'https:') return false

    // Only allow known preview domains
    const allowedDomains = [
      '.vercel.app',
      '.netlify.app',
      // Add other trusted deployment platforms
    ]

    return allowedDomains.some((domain) => parsed.hostname.endsWith(domain))
  } catch {
    return false
  }
}
```

---

## Alternative: OAuth Provider Configuration

Some OAuth providers support wildcard domains:

**Google OAuth**:

- Allowed: `https://*.vercel.app/api/auth/callback/google`
- Check provider documentation for wildcard support

**GitHub OAuth**:

- Does NOT support wildcards
- Requires OAuth proxy pattern

**Configuration**:

```typescript
// If provider supports wildcards
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // Wildcard supported (if provider allows)
    callbackUrl: "https://*.vercel.app/api/auth/callback/google",
  },
}
```

---

## Testing

**Test OAuth Proxy Flow**:

```bash
# 1. Deploy to preview
git push origin feature/new-auth

# 2. Get preview URL
vercel ls
# Example: https://my-app-feat-new-abc123.vercel.app

# 3. Open preview and click "Sign in with Google"
open https://my-app-feat-new-abc123.vercel.app

# 4. Verify flow:
#    - Redirected to production proxy
#    - OAuth with Google
#    - Redirected back to preview with auth token
#    - Logged in on preview

# 5. Check session
curl -H "Cookie: ..." https://my-app-feat-new-abc123.vercel.app/api/me
# Should return user data
```

---

## Comparison: Proxy vs Wildcard

| Aspect               | OAuth Proxy               | Wildcard Callback         |
| -------------------- | ------------------------- | ------------------------- |
| **Provider Support** | All providers             | Some (Google, not GitHub) |
| **Complexity**       | Higher (extra endpoint)   | Lower (native support)    |
| **Security**         | Controlled via validation | Relies on provider        |
| **Setup**            | Requires production proxy | Just configure provider   |
| **Maintenance**      | Proxy code to maintain    | None                      |

**Recommendation**: Use wildcard if provider supports it, otherwise use OAuth proxy pattern.

---

## Quick Reference

**OAuth Proxy Endpoints**:

```typescript
// Production domain
/auth/proxy?destination=<preview-url>&provider=<provider>
/api/auth/callback/<provider>

// Preview deployment
/auth/callback?auth_token=<token>
```

**Environment Variables**:

```env
# Production
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET=...  # For auth tokens

# Preview (same credentials, but uses proxy)
GOOGLE_CLIENT_ID=...  # Same as production
GOOGLE_CLIENT_SECRET=...  # Same as production
OAUTH_PROXY_URL=https://yourdomain.com/auth/proxy
```

---

## Common Issues

**Issue 1: OAuth Provider Rejects Callback**

```
Error: redirect_uri_mismatch
```

**Solution**: Ensure callback URL in OAuth provider config matches production proxy URL exactly.

**Issue 2: Token Expired**

```
Error: invalid_token
```

**Solution**: Token has 5-minute expiration. Complete OAuth flow faster or increase expiration.

**Issue 3: Destination Validation Fails**

```
Error: Invalid destination
```

**Solution**: Ensure destination URL starts with `https://` and ends with `.vercel.app` or `.netlify.app`.

---

## Related Documentation

- **Deep Linking**: `docs/adr/ADR-011-type-safe-deep-linking.md` (callback URLs)
- **CORS Strategy**: `.claude/skills/vercel-preview-cors-strategy.md`

---

**Key Principle**: Use OAuth proxy on production domain to handle OAuth callbacks, then redirect to preview deployment with short-lived auth token. Always validate destination URLs to prevent open redirects.
