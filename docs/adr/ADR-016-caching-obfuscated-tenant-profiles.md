# ADR-016: Caching Strategy for Obfuscated Tenant Profiles

**Status:** APPROVED
**Date:** 2025-11-19
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

User Story US-001 requires landlords to view obfuscated tenant profiles (anonymized data) with performance targets of < 1 second load time. Obfuscated profiles contain computed fields (income-to-rent ratio, credit band, employment tenure) that are expensive to recalculate. We need efficient caching to meet performance requirements while ensuring cache consistency.

**Background**:

- Landlords view many applicant profiles when reviewing listings
- Each profile load requires: database fetch, field transformation, access control check
- Obfuscated data is read-heavy, write-infrequent (changes when tenant updates profile)
- ADR-003 established Upstash Redis as the caching solution
- Current approach: No caching, each profile view hits database
- Performance target: < 1 second profile load from cache

**Requirements**:

- **Functional**: Cache obfuscated profile data for fast retrieval
- **Functional**: Invalidate cache on profile updates
- **Functional**: Support cache bypass for debugging
- **Non-functional**: Cache hit latency < 50ms
- **Non-functional**: Cache hit rate > 90% for active listings
- **Non-functional**: Data consistency within 5 seconds of update
- **Constraints**: Use Upstash Redis (per ADR-003)
- **Constraints**: PII must never be cached (only obfuscated data)

**Scope**:

- **Included**: Caching strategy for obfuscated tenant profile data
- **Included**: Cache key structure, TTL, invalidation patterns
- **Not included**: Full PII caching (security risk)
- **Not included**: Session caching (different use case)

---

## Decision

**We will implement a write-through caching pattern for obfuscated tenant profiles using Upstash Redis with automatic invalidation on mutations.**

Obfuscated profile data will be cached on read (cache-aside) and invalidated on any profile update. We'll use a structured key naming convention and short TTLs with aggressive invalidation for consistency.

**Implementation Approach**:

- Cache obfuscated profile data (never encrypted PII)
- Use cache-aside pattern: check cache first, populate on miss
- Structured keys: `profile:obfuscated:{applicantId}`
- TTL: 1 hour with invalidation on update
- Invalidate on: profile update, document upload, selection event
- Store only JSON-serializable obfuscated data
- Add cache hit/miss metrics for monitoring

**Why This Approach**:

1. **Simple Pattern**: Cache-aside is well-understood, easy to debug
2. **Consistency**: Short TTL + explicit invalidation ensures freshness
3. **Security**: Only obfuscated data cached, never PII
4. **Performance**: 10-50ms cache hits vs 200ms+ database queries
5. **Redis Integration**: Leverages ADR-003 infrastructure

**Example/Proof of Concept**:

```typescript
// lib/services/profile-cache.ts
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

interface ObfuscatedProfile {
  applicantId: string
  incomeToRentRatio: number
  creditBand: string
  employmentTenure: string
  employmentType: string
  rentalHistory: string
  backgroundCheck: string
  competitiveEdge?: string
  cachedAt: string
}

const CACHE_TTL = 3600 // 1 hour
const KEY_PREFIX = 'profile:obfuscated:'

export async function getCachedProfile(applicantId: string): Promise<ObfuscatedProfile | null> {
  const cacheKey = `${KEY_PREFIX}${applicantId}`
  const cached = await redis.get<ObfuscatedProfile>(cacheKey)

  if (cached) {
    // Track cache hit
    await redis.incr('metrics:profile:cache:hits')
    return cached
  }

  // Track cache miss
  await redis.incr('metrics:profile:cache:misses')
  return null
}

export async function cacheProfile(profile: ObfuscatedProfile): Promise<void> {
  const cacheKey = `${KEY_PREFIX}${profile.applicantId}`
  const profileWithTimestamp = {
    ...profile,
    cachedAt: new Date().toISOString(),
  }

  await redis.setex(cacheKey, CACHE_TTL, profileWithTimestamp)
}

export async function invalidateProfileCache(applicantId: string): Promise<void> {
  const cacheKey = `${KEY_PREFIX}${applicantId}`
  await redis.del(cacheKey)

  // Track invalidation
  await redis.incr('metrics:profile:cache:invalidations')
}

// Batch invalidation for listing (when landlord changes)
export async function invalidateListingProfiles(
  listingId: string,
  applicantIds: string[]
): Promise<void> {
  const keys = applicantIds.map((id) => `${KEY_PREFIX}${id}`)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

// Usage in tRPC procedure
export const getObfuscatedProfile = protectedProcedure
  .input(z.object({ applicantId: z.string() }))
  .query(async ({ input }) => {
    // Check cache first
    const cached = await getCachedProfile(input.applicantId)
    if (cached) {
      return cached
    }

    // Fetch from database
    const profile = await prisma.tenantProfile.findUnique({
      where: { applicantId: input.applicantId },
      select: {
        applicantId: true,
        obfuscatedData: true,
        // Never select piiData here
      },
    })

    if (!profile) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    // Transform to obfuscated format
    const obfuscated = transformToObfuscated(profile)

    // Cache for future requests
    await cacheProfile(obfuscated)

    return obfuscated
  })

// Invalidation on mutation
export const updateTenantProfile = protectedProcedure
  .input(profileUpdateSchema)
  .mutation(async ({ ctx, input }) => {
    const updated = await prisma.tenantProfile.update({
      where: { userId: ctx.session.userId },
      data: input,
    })

    // Invalidate cache after update
    await invalidateProfileCache(updated.applicantId)

    return updated
  })
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences

- **Performance**: Sub-50ms profile loads from cache
- **Cost Reduction**: Fewer database queries
- **Scalability**: Cache absorbs traffic spikes
- **User Experience**: Instant profile viewing for landlords
- **Metrics**: Cache hit/miss rates enable optimization

### Negative Consequences

- **Consistency Window**: Up to 5 seconds stale data possible
- **Complexity**: Cache invalidation logic to maintain
- **Memory Cost**: Redis memory usage scales with profiles
- **Cold Start**: First view still hits database
- **Debugging**: Cached data may hide database issues

### Neutral Consequences

- **Two Data Paths**: Direct and cached retrieval paths
- **Monitoring**: Need to track cache effectiveness

### Mitigation Strategies

- **Consistency Window**: Use cache-aside (not write-through) for immediate reads
- **Complexity**: Centralize invalidation in service, not scattered in procedures
- **Memory Cost**: Use TTL to expire unused entries, monitor memory usage
- **Cold Start**: Pre-warm cache for active listings (optional)
- **Debugging**: Add `?nocache=1` query param for bypass in development

---

## Alternatives Considered

### Alternative 1: TanStack Query Cache Only

**Description**:
Rely solely on TanStack Query's client-side caching without server-side Redis.

**Pros**:

- Already built into frontend architecture
- Zero server-side cache configuration
- Automatic stale-while-revalidate behavior
- No additional Redis costs

**Cons**:

- Cache not shared across users
- Each landlord hits database on first view
- No benefit for server-side rendering
- Cannot pre-warm cache

**Why Not Chosen**:
Client-side cache doesn't help with database load or server performance. Multiple landlords viewing same profile all hit database. Redis provides shared cache across all requests.

---

### Alternative 2: Full Profile Caching (Including PII)

**Description**:
Cache entire tenant profile including encrypted PII data.

**Pros**:

- Single cache entry per profile
- Simpler implementation
- Full data available instantly after decryption

**Cons**:

- Security risk: PII in cache even if encrypted
- Larger cache entries (more memory)
- Must handle decryption on cache hit
- Cache invalidation more critical

**Why Not Chosen**:
Caching PII, even encrypted, increases attack surface. Obfuscated data is sufficient for landlord browsing. PII decryption should always go to source for audit trail.

---

### Alternative 3: Write-Through Caching

**Description**:
Update cache synchronously on every database write.

**Pros**:

- Cache always consistent with database
- No stale data window
- Cache always warm after writes

**Cons**:

- Slower writes (database + cache)
- Cache updates even for rarely-read profiles
- More complex write logic
- Cache failures block writes

**Why Not Chosen**:
Obfuscated profiles are read-heavy, write-infrequent. Write-through adds unnecessary latency to profile updates. Cache-aside with invalidation is simpler and sufficient.

---

### Alternative 4: Database Materialized Views

**Description**:
Use PostgreSQL materialized views for pre-computed obfuscated data.

**Pros**:

- Data stays in database (single source)
- SQL-accessible for reporting
- Automatic refresh options
- No external cache dependency

**Cons**:

- Refresh can be expensive
- Still hits database for each query
- Less flexible than Redis (no TTL per record)
- Not as fast as in-memory cache

**Why Not Chosen**:
Materialized views still require database queries. Redis provides faster retrieval and more flexible invalidation. Consider materialized views for analytics use cases.

---

### Alternative 5: No Caching (Database Only)

**Description**:
Query database directly for each profile view without caching.

**Pros**:

- Simplest implementation
- Always consistent data
- No cache invalidation logic
- Fewer moving parts

**Cons**:

- Higher database load
- Slower response times (200ms+ per query)
- More expensive at scale (database costs)
- Potential bottleneck under load

**Why Not Chosen**:
Performance target is < 1 second load time. Database queries average 200-500ms. With cache, we achieve < 50ms. Caching is essential for user experience.

---

## Related

**Related ADRs**:

- [ADR-003: Redis Caching Strategy] - Establishes Upstash Redis infrastructure
- [ADR-013: PII Encryption] - PII data that is NOT cached
- [ADR-014: Row-Level Security] - Access control at database layer

**Related Documentation**:

- [User Story US-001] - PII Anonymization requirements
- [docs/architecture/caching-patterns.md] - Caching best practices (to be created)

**External References**:

- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Cache-Aside Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cache-aside)
- [TanStack Query Caching](https://tanstack.com/query/latest/docs/react/guides/caching)

---

## Notes

**Decision Making Process**:

- Analyzed profile read/write patterns
- Estimated cache memory requirements
- Reviewed ADR-003 Redis infrastructure
- Decision date: 2025-11-19

**Cache Sizing Estimate**:

- Average obfuscated profile: ~500 bytes
- Active profiles (6 months): 10,000
- Estimated memory: 5MB (well within Redis limits)

**Review Schedule**:

- Monitor cache hit rate (target > 90%)
- Review TTL effectiveness monthly
- Analyze memory usage growth
- Evaluate pre-warming strategy if cold starts are issue

**Migration Plan**:

- **Phase 1**: Implement cache service with ADR-003 Redis
- **Phase 2**: Add caching to profile read procedures
- **Phase 3**: Add invalidation to profile write procedures
- **Phase 4**: Set up monitoring dashboards
- **Rollback**: Remove cache calls, application falls back to database

---

## Revision History

| Date       | Author             | Change                      |
| ---------- | ------------------ | --------------------------- |
| 2025-11-19 | Architecture Agent | Initial creation for US-001 |
