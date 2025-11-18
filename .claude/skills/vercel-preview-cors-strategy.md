# Vercel Preview Deployment CORS Strategy

**Use When**: Configuring CORS for preview deployments with dynamic URLs

---

## Context

Preview deployments (Vercel, Netlify) generate unique URLs per branch, requiring dynamic CORS configuration to allow requests from these domains.

**Adapted from**: ApartmentDibs ADR-015

---

## Problem

**Static CORS Configuration Fails**:

```typescript
// ❌ Doesn't work for preview deployments
const corsOptions = {
  origin: "https://yourdomain.com", // Only allows production
}

// Preview URLs are dynamic:
// - https://my-app-feat-auth-abc123.vercel.app
// - https://my-app-fix-bug-def456.vercel.app
// Can't hardcode all possible preview URLs
```

**Requirements**:
- Allow preview deployments (`*.vercel.app`)
- Allow production domain (`yourdomain.com`)
- Allow local development (`localhost`)
- Block unauthorized domains

---

## Solution: Dynamic CORS with Pattern Matching

### 1. Environment-Based CORS Configuration

```typescript
// lib/cors.ts
export function getAllowedOrigins(): string[] {
  const env = process.env.NODE_ENV
  const vercelEnv = process.env.VERCEL_ENV

  // Development: Allow localhost
  if (env === "development") {
    return ["http://localhost:3000", "http://localhost:3001"]
  }

  // Production: Allow production domain only
  if (vercelEnv === "production") {
    return ["https://yourdomain.com", "https://www.yourdomain.com"]
  }

  // Preview: Allow preview deployments + production
  if (vercelEnv === "preview") {
    return [
      "https://yourdomain.com",
      "https://www.yourdomain.com",
      // Pattern: *.vercel.app (handled in isAllowedOrigin)
    ]
  }

  return []
}

export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false

  const env = process.env.VERCEL_ENV
  const allowedOrigins = getAllowedOrigins()

  // Exact match for production/development
  if (allowedOrigins.includes(origin)) return true

  // Preview: Allow *.vercel.app pattern
  if (env === "preview" && origin.endsWith(".vercel.app")) {
    return true
  }

  return false
}
```

### 2. Next.js API Route CORS Middleware

```typescript
// lib/api/cors.ts
import { NextResponse } from "next/server"
import { isAllowedOrigin } from "@/lib/cors"

export function corsHeaders(origin: string | undefined) {
  if (!isAllowedOrigin(origin)) {
    return {}
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  }
}

// Usage in API route
export async function GET(request: Request) {
  const origin = request.headers.get("origin") ?? undefined

  const data = { message: "Hello" }

  return NextResponse.json(data, {
    headers: corsHeaders(origin),
  })
}

// Handle preflight (OPTIONS)
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") ?? undefined

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  })
}
```

### 3. Middleware-Based CORS (Global)

```typescript
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isAllowedOrigin } from "@/lib/cors"

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin")

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin! : "",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    })
  }

  // Add CORS headers to all responses
  const response = NextResponse.next()

  if (isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin!)
    response.headers.set("Access-Control-Allow-Credentials", "true")
  }

  return response
}

// Apply middleware to API routes only
export const config = {
  matcher: "/api/:path*",
}
```

---

## Testing CORS Configuration

### Local Testing

```bash
# Start dev server
pnpm dev

# Test CORS from different origin
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:3000/api/test

# Should return CORS headers:
# Access-Control-Allow-Origin: http://localhost:3000
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

### Preview Deployment Testing

```bash
# Deploy to preview
git push origin feature/new-feature

# Get preview URL
vercel ls
# Example: https://my-app-feat-new-abc123.vercel.app

# Test CORS from preview URL
curl -H "Origin: https://my-app-feat-new-abc123.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://my-app-feat-new-abc123.vercel.app/api/test

# Should allow (*.vercel.app pattern matches)
```

### Production Testing

```bash
# Test from production domain
curl -H "Origin: https://yourdomain.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://yourdomain.com/api/test

# Should allow (exact match)

# Test from unauthorized domain
curl -H "Origin: https://evil.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://yourdomain.com/api/test

# Should NOT include CORS headers (blocked)
```

---

## Environment Variables

```env
# .env.local (development)
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# .env.preview (Vercel auto-sets)
NODE_ENV=production
VERCEL_ENV=preview
NEXT_PUBLIC_API_URL=https://my-app-preview.vercel.app

# .env.production
NODE_ENV=production
VERCEL_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

---

## Security Considerations

**Do**:
- ✅ Validate origin against allowed patterns
- ✅ Use `Access-Control-Allow-Credentials: true` only for trusted origins
- ✅ Limit `Access-Control-Allow-Methods` to required methods
- ✅ Specify exact `Access-Control-Allow-Headers` (don't use `*`)

**Don't**:
- ❌ Use `Access-Control-Allow-Origin: *` with credentials
- ❌ Allow all origins in production
- ❌ Trust `origin` header without validation
- ❌ Use overly broad patterns (e.g., `*.com`)

---

## Common Issues

**Issue 1: Preview Deployment Blocked**

```
Error: CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution**: Ensure `*.vercel.app` pattern matching is enabled for `VERCEL_ENV=preview`

```typescript
if (env === "preview" && origin.endsWith(".vercel.app")) {
  return true
}
```

**Issue 2: Credentials Not Sent**

```
Error: Credentials flag is true, but Access-Control-Allow-Credentials is not
```

**Solution**: Add credentials header

```typescript
headers: {
  "Access-Control-Allow-Credentials": "true",
}
```

**Issue 3: Preflight Request Fails**

```
Error: Response to preflight request doesn't pass access control check
```

**Solution**: Handle OPTIONS method

```typescript
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") ?? undefined

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  })
}
```

---

## Quick Reference

```typescript
// Check if origin is allowed
isAllowedOrigin(origin)

// Get CORS headers for response
corsHeaders(origin)

// Handle preflight (OPTIONS)
return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })

// Apply CORS to response
const response = NextResponse.json(data)
Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
  response.headers.set(key, value)
})
```

---

## Related Documentation

- **Deep Linking**: `docs/adr/ADR-011-type-safe-deep-linking.md` (callback URLs and CORS)
- **OAuth Proxy**: `.claude/skills/oauth-proxy-preview-environments.md` (related pattern)

---

**Key Principle**: Use dynamic CORS configuration with pattern matching for preview deployments. Always validate origin against allowed patterns. Never use wildcard (`*`) with credentials.
