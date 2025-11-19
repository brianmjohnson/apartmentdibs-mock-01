# ADR-003: Use Upstash Redis for Rate Limiting and Caching

**Status:** DRAFT
**Date:** 2025-11-16
**Author:** AI Agent

---

## Context

**What is the issue or problem we're solving?**

As our API endpoints scale, we need mechanisms for rate limiting to prevent abuse, caching for expensive database queries, and potentially session storage for improved performance. We need a fast, distributed caching layer that works seamlessly with our Vercel serverless architecture.

**Background**:

- Vercel serverless functions are stateless and ephemeral
- In-memory caching doesn't persist across function invocations
- tRPC queries to Prisma can be expensive for complex joins
- API endpoints need protection from abuse and DDoS attacks
- Current approach: No caching or rate limiting implemented

**Requirements**:

- **Functional**: Rate limiting (e.g., 100 requests/minute per user)
- **Functional**: Cache tRPC query results with TTL (time-to-live)
- **Functional**: Store temporary data (feature flag overrides, session data)
- **Non-functional**: Sub-10ms latency for cache hits
- **Non-functional**: Serverless-compatible (no persistent connections)
- **Non-functional**: Cost-effective for startup budget ($5-20/month)
- **Constraints**: Must work with Vercel's serverless environment
- **Constraints**: Minimal configuration and maintenance overhead

**Scope**:

- **Included**: Rate limiting, query caching, temporary key-value storage
- **Included**: Integration with tRPC middleware and API routes
- **Not included**: Primary database replacement (use Neon for persistent data)
- **Not included**: Complex pub/sub messaging (use dedicated queue if needed)

---

## Decision

**We will use Upstash Redis for rate limiting, caching, and temporary storage.**

Upstash provides a serverless-native Redis implementation with HTTP-based API, eliminating connection pooling issues in serverless environments. We'll integrate it via the `@upstash/redis` SDK for rate limiting and caching expensive tRPC queries.

**Implementation Approach**:

- Create Upstash Redis database (serverless tier)
- Install `@upstash/redis` and `@upstash/ratelimit` packages
- Create tRPC middleware for automatic query caching
- Implement rate limiting middleware for API routes
- Use Redis for feature flag overrides (PostHog integration)
- Set up monitoring via Upstash dashboard

**Why This Approach**:

1. **Serverless-First**: Designed for edge/serverless with HTTP API
2. **Pay-Per-Request**: No idle costs, only pay for actual usage
3. **Vercel Integration**: Official Vercel partnership with easy setup
4. **Global Replication**: Low latency worldwide via edge locations
5. **No Connection Pooling**: Avoids serverless connection limit issues

**Example/Proof of Concept**:

```typescript
// Rate limiting middleware
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 req/min
})

export const rateLimitMiddleware = middleware(async ({ ctx, next }) => {
  const { success } = await ratelimit.limit(ctx.session.userId)
  if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
  return next()
})

// Query caching middleware
export const cacheMiddleware = middleware(async ({ ctx, next, path }) => {
  const cacheKey = `trpc:${path}:${JSON.stringify(ctx.input)}`
  const cached = await redis.get(cacheKey)
  if (cached) return cached

  const result = await next()
  await redis.setex(cacheKey, 3600, result) // 1 hour TTL
  return result
})
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences

- **API Protection**: Rate limiting prevents abuse and reduces costs
- **Performance**: Cached queries reduce database load and response time
- **Scalability**: Handles traffic spikes without database overload
- **Developer Experience**: Simple SDK with TypeScript support
- **Cost Optimization**: Pay-per-request model aligns with serverless usage

### Negative Consequences

- **Additional Dependency**: Another service to manage and monitor
- **Cost Uncertainty**: Usage-based pricing can be unpredictable
- **Cache Invalidation**: Need to implement cache busting strategies
- **Debugging Complexity**: Cached responses may hide underlying issues

### Neutral Consequences

- **Environment Variables**: Need to manage Upstash credentials
- **Learning Curve**: Team needs to understand Redis TTL and caching patterns

### Mitigation Strategies

- **Cost Uncertainty**: Set up Upstash billing alerts at $15/month threshold
- **Cache Invalidation**: Implement automatic invalidation on mutations, use short TTLs initially
- **Debugging Complexity**: Add cache hit/miss headers in development mode
- **Additional Dependency**: Monitor Upstash status page, implement graceful fallback (continue without cache)

---

## Alternatives Considered

### Alternative 1: Vercel KV (Redis)

**Description**:
Use Vercel's managed Redis offering (powered by Upstash backend).

**Pros**:

- Native Vercel integration (one-click setup)
- Same serverless Redis technology as Upstash
- Integrated billing with Vercel dashboard
- Simplified environment variable management

**Cons**:

- Higher cost than direct Upstash (Vercel markup)
- Less flexibility in configuration
- Tied to Vercel platform (harder to migrate)
- Newer product with less documentation

**Why Not Chosen**:
Vercel KV is essentially Upstash with a premium. Direct Upstash access provides better pricing and more control, while still offering excellent Vercel integration.

---

### Alternative 2: Traditional Redis (Self-Hosted or AWS ElastiCache)

**Description**:
Deploy Redis on a dedicated server or managed service with persistent connections.

**Pros**:

- Full Redis feature set (pub/sub, streams, modules)
- Predictable pricing (fixed monthly cost)
- More control over configuration and tuning
- Industry-standard solution

**Cons**:

- Requires connection pooling in serverless (complex)
- Need to manage infrastructure or pay for managed service
- Higher baseline cost (~$30/month minimum)
- Cold start issues with connection establishment

**Why Not Chosen**:
Serverless environments struggle with persistent connections. Connection pooling adds complexity and latency, defeating the purpose of caching.

---

### Alternative 3: In-Memory Caching (Node.js Map)

**Description**:
Use JavaScript Map or libraries like `lru-cache` for in-memory caching within function instances.

**Pros**:

- Zero cost (no external service)
- Ultra-fast access (no network latency)
- No configuration required
- Works offline in development

**Cons**:

- Cache doesn't persist across function invocations
- Each serverless instance has separate cache (low hit rate)
- No rate limiting capability
- Limited memory available in serverless functions

**Why Not Chosen**:
Serverless functions are ephemeral and distributed. In-memory caching provides minimal benefit due to low hit rates across instances.

---

### Alternative 4: Do Nothing (No Caching)

**Description**:
Skip caching and rate limiting initially, rely on Neon's performance and Vercel's DDoS protection.

**Pros**:

- Simplest approach (no additional services)
- Zero cost for caching infrastructure
- One less dependency to manage
- Neon has built-in query caching

**Cons**:

- No API rate limiting (vulnerable to abuse)
- Expensive queries hit database every time
- Higher database costs at scale
- Poor user experience for slow queries

**Why Not Chosen**:
While simple, this approach leaves the API vulnerable and misses performance optimization opportunities. However, this is viable for MVP—hence the DRAFT status. We can defer implementation until we observe actual performance or abuse issues.

---

## Related

**Related ADRs**:

- [ADR-001: Technology Stack Selection] - Defines Vercel and serverless architecture
- [ADR-002: Automation Tools] - n8n can use Redis for workflow state
- [ADR-005: PostHog Feature Flags] - Redis can cache flag evaluations

**Related Documentation**:

- [docs/architecture/caching-strategy.md] - Caching patterns guide (to be created)
- [docs/security/rate-limiting.md] - Rate limit configuration (to be created)

**External References**:

- [Upstash Documentation](https://docs.upstash.com/)
- [Vercel + Upstash Integration](https://vercel.com/integrations/upstash)
- [tRPC Caching Guide](https://trpc.io/docs/server/caching)

---

## Notes

**Decision Making Process**:

- Evaluated serverless-compatible options (Upstash, Vercel KV)
- Compared pricing for expected traffic (1M requests/month)
- Consulted Vercel deployment best practices
- Decision date: 2025-11-16
- **Status DRAFT**: Approve when rate limiting becomes necessary

**Review Schedule**:

- Move to APPROVED when implementing first rate-limited endpoint
- Revisit pricing after reaching 100k requests/month
- Monitor: Cache hit rate, rate limit violations, monthly cost

**Migration Plan**:

- **Phase 1**: Set up Upstash account and environment variables
- **Phase 2**: Implement rate limiting middleware for public API routes
- **Phase 3**: Add caching middleware to expensive tRPC queries
- **Phase 4**: Monitor performance and adjust TTL values
- **Rollback**: Remove middleware, all code degrades gracefully without Redis

---

## Revision History

| Date       | Author   | Change        |
| ---------- | -------- | ------------- |
| 2025-11-16 | AI Agent | Initial draft |
