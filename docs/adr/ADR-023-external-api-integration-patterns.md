# ADR-023: External API Integration Patterns for Listing Syndication

**Status:** APPROVED
**Date:** 2025-11-19
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

User Story US-007 (Listing Syndication) requires integration with 6+ external platforms:

- Zillow Rental Manager API
- Apartments.com (API or CSV)
- Craigslist (auto-renewal)
- Facebook Marketplace (Graph API)
- StreetEasy (NYC only)
- Google Search (Schema.org structured data)

Each platform has different APIs, rate limits, authentication methods, and error behaviors. We need a standardized pattern for external API integrations that handles retries, circuit breakers, rate limiting, and error tracking.

**Background**:

- Different platforms use REST, GraphQL, or file uploads
- APIs have varying rate limits (some aggressive)
- Network failures and timeouts are common
- Need unified status tracking across all platforms
- Current approach: No external API patterns established

**Requirements**:

- **Functional**: Integrate with 6+ different external APIs
- **Functional**: Retry failed requests with exponential backoff
- **Functional**: Respect rate limits per platform
- **Functional**: Track integration status per listing per platform
- **Functional**: Circuit breaker to prevent cascading failures
- **Non-functional**: Complete syndication to all platforms in <15 minutes
- **Non-functional**: 95%+ success rate for syndication
- **Non-functional**: Graceful degradation when platforms are down
- **Constraints**: Must work with ADR-022 job queue
- **Constraints**: Budget for third-party API costs

**Scope**:

- **Included**: Adapter pattern for platform APIs, retry logic, circuit breaker
- **Included**: Rate limiting, error tracking, status dashboard
- **Not included**: Platform-specific business logic (separate concern)
- **Not included**: OAuth flow setup for each platform (done in onboarding)

---

## Decision

**We will implement an adapter pattern with a unified interface for all external APIs, using circuit breakers, retry policies, and per-platform rate limiting.**

Each platform gets an adapter class implementing a common interface. A syndication orchestrator coordinates calls across adapters, respecting rate limits and handling failures gracefully. Integration status is tracked in the database per listing per platform.

**Implementation Approach**:

- Create `lib/services/integrations/` with adapter per platform
- Define common `PlatformAdapter` interface
- Implement circuit breaker using `opossum` library
- Use `bottleneck` for rate limiting per platform
- Store integration status in `listing_syndication` table
- Track errors with structured logging (ADR-007)
- Integrate with job queue (ADR-022) for async processing

**Why This Approach**:

1. **Unified Interface**: Consistent API across all platforms
2. **Isolated Failures**: Circuit breakers prevent cascading issues
3. **Rate Limit Safety**: Per-platform limiters avoid bans
4. **Testability**: Adapters can be mocked for testing
5. **Extensibility**: Easy to add new platforms

**Example/Proof of Concept**:

```typescript
// lib/services/integrations/types.ts
export interface ListingData {
  id: string
  address: string
  unit: string
  rent: number
  securityDeposit: number
  leaseTerm: number
  bedrooms: number
  bathrooms: number
  sqft: number
  amenities: string[]
  description: string
  photos: string[]
  floorPlan?: string
  availableDate: Date
  petPolicy: string
}

export interface SyndicationResult {
  platform: string
  status: 'success' | 'failed' | 'pending' | 'rate_limited'
  externalId?: string
  externalUrl?: string
  errorMessage?: string
  retryAfter?: Date
}

export interface PlatformAdapter {
  name: string
  publish(listing: ListingData): Promise<SyndicationResult>
  update(listing: ListingData, externalId: string): Promise<SyndicationResult>
  unpublish(externalId: string): Promise<SyndicationResult>
  checkStatus(externalId: string): Promise<'active' | 'pending' | 'removed' | 'error'>
}

// lib/services/integrations/base-adapter.ts
import CircuitBreaker from 'opossum'
import Bottleneck from 'bottleneck'
import { logger } from '@/lib/logger'

export abstract class BaseAdapter implements PlatformAdapter {
  abstract name: string
  protected circuitBreaker: CircuitBreaker
  protected rateLimiter: Bottleneck

  constructor(options: {
    rateLimit: { reservoir: number; reservoirRefreshInterval: number }
    circuitBreaker: { timeout: number; errorThreshold: number; resetTimeout: number }
  }) {
    // Rate limiter per platform
    this.rateLimiter = new Bottleneck({
      reservoir: options.rateLimit.reservoir,
      reservoirRefreshInterval: options.rateLimit.reservoirRefreshInterval,
      maxConcurrent: 1,
    })

    // Circuit breaker for fault tolerance
    this.circuitBreaker = new CircuitBreaker(this.executeRequest.bind(this), {
      timeout: options.circuitBreaker.timeout,
      errorThresholdPercentage: options.circuitBreaker.errorThreshold,
      resetTimeout: options.circuitBreaker.resetTimeout,
    })

    // Log circuit breaker events
    this.circuitBreaker.on('open', () => {
      logger.warn(`Circuit breaker OPEN for ${this.name}`)
    })
    this.circuitBreaker.on('halfOpen', () => {
      logger.info(`Circuit breaker HALF-OPEN for ${this.name}`)
    })
    this.circuitBreaker.on('close', () => {
      logger.info(`Circuit breaker CLOSED for ${this.name}`)
    })
  }

  protected abstract executeRequest(
    action: 'publish' | 'update' | 'unpublish' | 'status',
    data: any
  ): Promise<any>

  async publish(listing: ListingData): Promise<SyndicationResult> {
    return this.rateLimiter.schedule(async () => {
      try {
        const result = await this.circuitBreaker.fire('publish', listing)
        return {
          platform: this.name,
          status: 'success',
          ...result,
        }
      } catch (error) {
        return this.handleError(error)
      }
    })
  }

  async update(listing: ListingData, externalId: string): Promise<SyndicationResult> {
    return this.rateLimiter.schedule(async () => {
      try {
        const result = await this.circuitBreaker.fire('update', { listing, externalId })
        return {
          platform: this.name,
          status: 'success',
          ...result,
        }
      } catch (error) {
        return this.handleError(error)
      }
    })
  }

  async unpublish(externalId: string): Promise<SyndicationResult> {
    return this.rateLimiter.schedule(async () => {
      try {
        await this.circuitBreaker.fire('unpublish', externalId)
        return {
          platform: this.name,
          status: 'success',
        }
      } catch (error) {
        return this.handleError(error)
      }
    })
  }

  async checkStatus(externalId: string): Promise<'active' | 'pending' | 'removed' | 'error'> {
    try {
      return await this.circuitBreaker.fire('status', externalId)
    } catch {
      return 'error'
    }
  }

  protected handleError(error: unknown): SyndicationResult {
    const message = error instanceof Error ? error.message : 'Unknown error'

    // Check for rate limiting
    if (message.includes('429') || message.includes('rate limit')) {
      return {
        platform: this.name,
        status: 'rate_limited',
        errorMessage: message,
        retryAfter: new Date(Date.now() + 60 * 1000), // Retry in 1 minute
      }
    }

    // Check for circuit breaker open
    if (message.includes('Breaker is open')) {
      return {
        platform: this.name,
        status: 'failed',
        errorMessage: 'Service temporarily unavailable',
        retryAfter: new Date(Date.now() + 5 * 60 * 1000), // Retry in 5 minutes
      }
    }

    return {
      platform: this.name,
      status: 'failed',
      errorMessage: message,
    }
  }
}

// lib/services/integrations/zillow-adapter.ts
import { BaseAdapter, ListingData, SyndicationResult } from './base-adapter'

export class ZillowAdapter extends BaseAdapter {
  name = 'zillow'
  private apiKey: string

  constructor() {
    super({
      rateLimit: {
        reservoir: 100, // 100 requests
        reservoirRefreshInterval: 60 * 1000, // per minute
      },
      circuitBreaker: {
        timeout: 30000, // 30 second timeout
        errorThreshold: 50, // Open after 50% failures
        resetTimeout: 60000, // Try again after 1 minute
      },
    })
    this.apiKey = process.env.ZILLOW_API_KEY!
  }

  protected async executeRequest(
    action: 'publish' | 'update' | 'unpublish' | 'status',
    data: any
  ): Promise<any> {
    const baseUrl = 'https://api.zillow.com/rental-manager/v2'

    switch (action) {
      case 'publish': {
        const listing = data as ListingData
        const response = await fetch(`${baseUrl}/listings`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.transformToZillow(listing)),
        })

        if (!response.ok) {
          throw new Error(`Zillow API error: ${response.status} ${await response.text()}`)
        }

        const result = await response.json()
        return {
          externalId: result.listingId,
          externalUrl: result.url,
        }
      }

      case 'update': {
        const { listing, externalId } = data
        const response = await fetch(`${baseUrl}/listings/${externalId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.transformToZillow(listing)),
        })

        if (!response.ok) {
          throw new Error(`Zillow API error: ${response.status}`)
        }

        return { externalId }
      }

      case 'unpublish': {
        const externalId = data as string
        const response = await fetch(`${baseUrl}/listings/${externalId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        })

        if (!response.ok && response.status !== 404) {
          throw new Error(`Zillow API error: ${response.status}`)
        }

        return {}
      }

      case 'status': {
        const externalId = data as string
        const response = await fetch(`${baseUrl}/listings/${externalId}`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        })

        if (response.status === 404) return 'removed'
        if (!response.ok) return 'error'

        const result = await response.json()
        return result.status === 'active' ? 'active' : 'pending'
      }
    }
  }

  private transformToZillow(listing: ListingData) {
    return {
      address: {
        streetAddress: listing.address,
        unit: listing.unit,
      },
      price: listing.rent,
      deposit: listing.securityDeposit,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      squareFeet: listing.sqft,
      description: listing.description,
      photos: listing.photos,
      availableDate: listing.availableDate.toISOString().split('T')[0],
      leaseTermMonths: listing.leaseTerm,
      petPolicy: listing.petPolicy,
      amenities: listing.amenities,
    }
  }
}

// lib/services/integrations/facebook-adapter.ts
export class FacebookAdapter extends BaseAdapter {
  name = 'facebook'

  constructor() {
    super({
      rateLimit: {
        reservoir: 200, // 200 requests
        reservoirRefreshInterval: 60 * 60 * 1000, // per hour
      },
      circuitBreaker: {
        timeout: 45000,
        errorThreshold: 50,
        resetTimeout: 120000,
      },
    })
  }

  protected async executeRequest(
    action: 'publish' | 'update' | 'unpublish' | 'status',
    data: any
  ): Promise<any> {
    // Facebook Graph API implementation
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN!
    const pageId = process.env.FACEBOOK_PAGE_ID!

    switch (action) {
      case 'publish': {
        const listing = data as ListingData
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${pageId}/commerce_listings`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.transformToFacebook(listing)),
          }
        )

        if (!response.ok) {
          throw new Error(`Facebook API error: ${response.status}`)
        }

        const result = await response.json()
        return {
          externalId: result.id,
          externalUrl: `https://facebook.com/marketplace/item/${result.id}`,
        }
      }
      // ... other actions
    }
  }

  private transformToFacebook(listing: ListingData) {
    return {
      listing_type: 'FOR_RENT',
      price: listing.rent,
      currency: 'USD',
      title: `${listing.bedrooms}BR in ${listing.address}`,
      description: listing.description,
      images: listing.photos.map((url) => ({ url })),
      location: {
        address: listing.address,
      },
    }
  }
}

// lib/services/syndication-orchestrator.ts
import { prisma } from '@/lib/db'
import { ZillowAdapter } from './integrations/zillow-adapter'
import { FacebookAdapter } from './integrations/facebook-adapter'
import { ApartmentsAdapter } from './integrations/apartments-adapter'
import { CraigslistAdapter } from './integrations/craigslist-adapter'
import { StreetEasyAdapter } from './integrations/streeteasy-adapter'
import { ListingData, PlatformAdapter, SyndicationResult } from './integrations/types'

export class SyndicationOrchestrator {
  private adapters: Map<string, PlatformAdapter>

  constructor() {
    this.adapters = new Map([
      ['zillow', new ZillowAdapter()],
      ['facebook', new FacebookAdapter()],
      ['apartments', new ApartmentsAdapter()],
      ['craigslist', new CraigslistAdapter()],
      ['streeteasy', new StreetEasyAdapter()],
    ])
  }

  async syndicateToAll(listingId: string, platforms: string[]): Promise<SyndicationResult[]> {
    // Get listing data
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    })

    if (!listing) {
      throw new Error(`Listing ${listingId} not found`)
    }

    const listingData = this.transformListing(listing)
    const results: SyndicationResult[] = []

    // Process each platform
    for (const platform of platforms) {
      const adapter = this.adapters.get(platform)
      if (!adapter) {
        results.push({
          platform,
          status: 'failed',
          errorMessage: `Unknown platform: ${platform}`,
        })
        continue
      }

      // Check for existing syndication
      const existing = await prisma.listingSyndication.findUnique({
        where: {
          listingId_platform: {
            listingId,
            platform,
          },
        },
      })

      let result: SyndicationResult

      if (existing?.externalId) {
        // Update existing
        result = await adapter.update(listingData, existing.externalId)
      } else {
        // Publish new
        result = await adapter.publish(listingData)
      }

      // Store result
      await prisma.listingSyndication.upsert({
        where: {
          listingId_platform: { listingId, platform },
        },
        create: {
          listingId,
          platform,
          status: result.status,
          externalId: result.externalId,
          externalUrl: result.externalUrl,
          lastSyncAt: new Date(),
          errorMessage: result.errorMessage,
        },
        update: {
          status: result.status,
          externalId: result.externalId,
          externalUrl: result.externalUrl,
          lastSyncAt: new Date(),
          errorMessage: result.errorMessage,
        },
      })

      results.push(result)
    }

    return results
  }

  async unpublishFromAll(listingId: string): Promise<SyndicationResult[]> {
    const syndications = await prisma.listingSyndication.findMany({
      where: { listingId },
    })

    const results: SyndicationResult[] = []

    for (const syndication of syndications) {
      const adapter = this.adapters.get(syndication.platform)
      if (!adapter || !syndication.externalId) continue

      const result = await adapter.unpublish(syndication.externalId)
      results.push(result)

      await prisma.listingSyndication.update({
        where: { id: syndication.id },
        data: {
          status: result.status === 'success' ? 'removed' : 'failed',
          lastSyncAt: new Date(),
        },
      })
    }

    return results
  }

  private transformListing(listing: any): ListingData {
    return {
      id: listing.id,
      address: listing.address,
      unit: listing.unit,
      rent: listing.rent,
      securityDeposit: listing.securityDeposit,
      leaseTerm: listing.leaseTerm,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      sqft: listing.sqft,
      amenities: listing.amenities,
      description: listing.description,
      photos: listing.photos,
      floorPlan: listing.floorPlan,
      availableDate: listing.availableDate,
      petPolicy: listing.petPolicy,
    }
  }
}
```

**Database Schema**:

```sql
CREATE TABLE listing_syndication (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  platform VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL, -- success, failed, pending, rate_limited, removed
  external_id VARCHAR(255),
  external_url TEXT,
  last_sync_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(listing_id, platform)
);

CREATE INDEX idx_syndication_listing ON listing_syndication(listing_id);
CREATE INDEX idx_syndication_status ON listing_syndication(status, platform);
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences

- **Unified Interface**: All platforms use same adapter pattern
- **Fault Tolerance**: Circuit breakers prevent cascading failures
- **Rate Limit Safety**: Per-platform limiters avoid API bans
- **Observability**: Centralized status tracking in database
- **Testability**: Adapters can be easily mocked
- **Extensibility**: New platforms added by implementing interface

### Negative Consequences

- **Boilerplate**: Each adapter needs similar structure
- **Maintenance**: API changes require adapter updates
- **Complexity**: More code than direct API calls
- **Dependencies**: Additional libraries (opossum, bottleneck)

### Neutral Consequences

- **Platform Differences**: Some APIs are quirky, adapters hide this
- **Authentication**: Each platform has different OAuth flow
- **Monitoring**: Need to watch circuit breaker and rate limit stats

### Mitigation Strategies

- **Boilerplate**: BaseAdapter handles common patterns
- **Maintenance**: Monitor platform changelogs, version APIs
- **Complexity**: Comprehensive documentation and examples
- **Dependencies**: Libraries are well-maintained, small footprint

---

## Alternatives Considered

### Alternative 1: Direct API Calls (No Pattern)

**Description**:
Call each platform API directly without abstraction layer.

**Pros**:

- Simplest implementation
- No learning curve
- Fewer dependencies
- Direct control

**Cons**:

- No retry logic
- No rate limiting
- No circuit breaker
- Duplicate error handling
- Hard to test

**Why Not Chosen**:
External APIs fail frequently. Without patterns for retries, rate limiting, and circuit breakers, syndication would be unreliable.

---

### Alternative 2: Third-Party Syndication Service (e.g., RentCafe)

**Description**:
Use a property management syndication service that handles all platforms.

**Pros**:

- Single integration point
- They handle API changes
- More platforms available
- Less maintenance

**Cons**:

- Expensive ($100+/month per agent)
- Less control over data
- Vendor lock-in
- May not support all features

**Why Not Chosen**:
Cost prohibitive for startup. Also reduces our competitive advantage of having direct control over syndication.

---

### Alternative 3: Event-Driven with Webhooks

**Description**:
Use webhooks to receive platform status updates instead of polling.

**Pros**:

- Real-time status updates
- Less API calls needed
- Efficient use of resources

**Cons**:

- Not all platforms support webhooks
- Need to handle webhook security
- More infrastructure (webhook endpoints)
- Still need adapters for publish/update

**Why Not Chosen**:
Most listing platforms don't offer webhooks. We still need the adapter pattern for publishing, so webhooks would be additive complexity.

---

### Alternative 4: GraphQL Federation

**Description**:
Create a GraphQL gateway that federates all platform APIs.

**Pros**:

- Unified query interface
- Type-safe schema
- Good for reads

**Cons**:

- Overkill for mutations
- Complex setup
- Most platforms are REST
- Doesn't solve retry/circuit breaker

**Why Not Chosen**:
We need mutations (publish/update), not queries. GraphQL federation is better for read-heavy aggregation scenarios.

---

## Related

**Related ADRs**:

- [ADR-022: Background Job Queue] - Jobs call syndication orchestrator
- [ADR-003: Redis Caching] - Can cache platform status
- [ADR-007: Observability] - Structured logging for API errors

**Related Documentation**:

- [User Story US-007] - Listing Syndication
- [docs/integrations/platform-setup.md] - OAuth setup per platform (to be created)
- [docs/integrations/troubleshooting.md] - Common errors (to be created)

**External References**:

- [Zillow Rental Manager API](https://www.zillow.com/rental-manager/tools/api)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [opossum Circuit Breaker](https://nodeshift.dev/opossum/)
- [Bottleneck Rate Limiter](https://github.com/SGrondin/bottleneck)

---

## Notes

**Decision Making Process**:

- Evaluated syndication reliability requirements
- Researched platform API limitations
- Compared direct calls vs abstraction
- Decision date: 2025-11-19

**Platform API Limits**:

- Zillow: 100 requests/minute
- Facebook: 200 requests/hour
- Apartments.com: 50 requests/minute
- Craigslist: Manual posting, auto-renewal
- StreetEasy: 100 requests/minute

**Circuit Breaker Settings**:

- Timeout: 30-45 seconds per request
- Error threshold: 50% failures opens circuit
- Reset timeout: 60-120 seconds

**Review Schedule**:

- Monitor syndication success rates weekly
- Review circuit breaker trips monthly
- Update adapters when platforms change APIs

**Migration Plan**:

- **Phase 1**: Implement base adapter and orchestrator
- **Phase 2**: Build Zillow adapter (most critical)
- **Phase 3**: Build Facebook and Apartments.com adapters
- **Phase 4**: Build Craigslist and StreetEasy adapters
- **Phase 5**: Add Schema.org structured data generation
- **Rollback**: Disable individual adapters via feature flags

---

## Revision History

| Date       | Author             | Change                      |
| ---------- | ------------------ | --------------------------- |
| 2025-11-19 | Architecture Agent | Initial creation for US-007 |
