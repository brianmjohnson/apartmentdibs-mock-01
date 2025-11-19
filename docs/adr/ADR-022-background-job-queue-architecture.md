# ADR-022: Background Job Queue with Upstash QStash

**Status:** APPROVED
**Date:** 2025-11-19
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

Multiple P1 user stories require reliable background job processing:

- US-007 (Listing Syndication): Publish listings to 6+ external platforms asynchronously
- US-008 (Automated Document Reminders): Scheduled reminder sequences (Day 1, 3, 5, 7)
- US-018 already mentions queue-based notification delivery

We need a robust job queue that handles retries, scheduling, and works with our serverless Vercel architecture.

**Background**:

- Vercel serverless functions have 10-second timeout (Hobby) or 60-second (Pro)
- Syndication to multiple platforms can take >60 seconds total
- Document reminders need scheduled execution (cron-like)
- ADR-018 uses Upstash Redis queues for notifications
- Current approach: No job queue infrastructure

**Requirements**:

- **Functional**: Process long-running tasks asynchronously
- **Functional**: Schedule tasks for future execution (reminders)
- **Functional**: Retry failed jobs with exponential backoff
- **Functional**: Track job status and errors
- **Functional**: Dead letter queue for failed jobs
- **Non-functional**: Handle 1000+ jobs/day
- **Non-functional**: Job processing within 5 minutes of trigger
- **Non-functional**: 99.9% job completion rate
- **Constraints**: Must work with Vercel serverless (no persistent workers)
- **Constraints**: Budget <$30/month
- **Constraints**: Leverage existing Upstash infrastructure

**Scope**:

- **Included**: Async job processing, scheduling, retries, monitoring
- **Included**: Listing syndication, document reminders, notification delivery
- **Not included**: Real-time processing (use Pusher - ADR-021)
- **Not included**: Heavy computation (use dedicated compute if needed)

---

## Decision

**We will use Upstash QStash for background job processing with Vercel Serverless Functions as job handlers.**

QStash is a serverless message queue that calls HTTP endpoints. It handles scheduling, retries, and dead letter queues. Jobs are processed by Vercel API routes, leveraging our existing infrastructure.

**Implementation Approach**:

- Install `@upstash/qstash` package
- Create job handler API routes in `app/api/jobs/`
- Use QStash to enqueue jobs with retry policies
- Schedule recurring jobs (reminders) with QStash schedules
- Store job metadata in PostgreSQL for tracking
- Use Vercel cron for daily cleanup/monitoring

**Why This Approach**:

1. **Serverless Native**: Designed for serverless, calls HTTP endpoints
2. **Existing Vendor**: Already using Upstash for Redis (ADR-003)
3. **Built-in Retries**: Configurable retry with exponential backoff
4. **Scheduling**: Native support for delayed and recurring jobs
5. **Vercel Integration**: Official Vercel partnership, easy setup

**Example/Proof of Concept**:

```typescript
// lib/services/job-queue.ts
import { Client } from '@upstash/qstash'

const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
})

// Job types for type safety
export type JobType = 'syndicate-listing' | 'send-reminder' | 'crm-match' | 'send-notification'

export interface JobPayload {
  'syndicate-listing': {
    listingId: string
    platforms: string[]
  }
  'send-reminder': {
    applicantId: string
    reminderType: 'day1' | 'day3' | 'day5' | 'day7'
    missingDocs: string[]
  }
  'crm-match': {
    listingId: string
    agentId: string
  }
  'send-notification': {
    type: 'adverse_action' | 'reminder' | 'confirmation'
    recipientId: string
    templateId: string
    templateData: Record<string, unknown>
  }
}

export async function enqueueJob<T extends JobType>(
  type: T,
  payload: JobPayload[T],
  options?: {
    delay?: number // seconds
    retries?: number
    deduplicationId?: string
  }
): Promise<string> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  const response = await qstash.publishJSON({
    url: `${baseUrl}/api/jobs/${type}`,
    body: payload,
    retries: options?.retries ?? 3,
    delay: options?.delay,
    deduplicationId: options?.deduplicationId,
  })

  // Store job in database for tracking
  await prisma.jobLog.create({
    data: {
      qstashMessageId: response.messageId,
      jobType: type,
      payload: payload as any,
      status: 'pending',
    },
  })

  return response.messageId
}

// Schedule recurring job (e.g., daily reminder check)
export async function scheduleRecurringJob<T extends JobType>(
  type: T,
  payload: JobPayload[T],
  cron: string // e.g., '0 9 * * *' for 9 AM daily
): Promise<string> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  const response = await qstash.schedules.create({
    destination: `${baseUrl}/api/jobs/${type}`,
    body: JSON.stringify(payload),
    cron,
  })

  return response.scheduleId
}

// app/api/jobs/syndicate-listing/route.ts
import { verifySignature } from '@upstash/qstash/nextjs'
import { syndicateToAllPlatforms } from '@/lib/services/syndication'

async function handler(req: Request) {
  const payload = (await req.json()) as JobPayload['syndicate-listing']

  // Update job status
  await prisma.jobLog.update({
    where: { qstashMessageId: req.headers.get('upstash-message-id') },
    data: { status: 'processing', startedAt: new Date() },
  })

  try {
    // Process syndication
    const results = await syndicateToAllPlatforms(payload.listingId, payload.platforms)

    // Update job status
    await prisma.jobLog.update({
      where: { qstashMessageId: req.headers.get('upstash-message-id') },
      data: {
        status: 'completed',
        completedAt: new Date(),
        result: results,
      },
    })

    return new Response(JSON.stringify({ success: true, results }))
  } catch (error) {
    // Log error, QStash will retry
    await prisma.jobLog.update({
      where: { qstashMessageId: req.headers.get('upstash-message-id') },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        attempts: { increment: 1 },
      },
    })

    throw error // Rethrow to trigger QStash retry
  }
}

// Verify request came from QStash
export const POST = verifySignature(handler)

// app/api/jobs/send-reminder/route.ts
import { verifySignature } from '@upstash/qstash/nextjs'
import { NotificationOrchestrator } from '@/lib/services/notification-orchestrator'

async function handler(req: Request) {
  const payload = (await req.json()) as JobPayload['send-reminder']
  const orchestrator = new NotificationOrchestrator()

  // Get applicant details
  const applicant = await prisma.application.findUnique({
    where: { applicantId: payload.applicantId },
    include: { tenant: true, listing: true },
  })

  if (!applicant) {
    return new Response('Applicant not found', { status: 404 })
  }

  // Skip if documents already complete
  if (applicant.documentsComplete) {
    return new Response(JSON.stringify({ skipped: true, reason: 'Documents complete' }))
  }

  // Send reminder via notification orchestrator (ADR-018)
  await orchestrator.sendReminder({
    applicantId: payload.applicantId,
    email: applicant.tenant.email,
    phone: applicant.tenant.phone,
    templateId: `reminder-${payload.reminderType}`,
    templateData: {
      applicantName: applicant.tenant.name,
      listingAddress: applicant.listing.address,
      missingDocs: payload.missingDocs,
      expiresAt: applicant.expiresAt,
    },
  })

  // Schedule next reminder if applicable
  if (payload.reminderType === 'day1') {
    await enqueueJob(
      'send-reminder',
      {
        ...payload,
        reminderType: 'day3',
      },
      { delay: 2 * 24 * 60 * 60 }
    ) // 2 days
  } else if (payload.reminderType === 'day3') {
    await enqueueJob(
      'send-reminder',
      {
        ...payload,
        reminderType: 'day5',
      },
      { delay: 2 * 24 * 60 * 60 }
    )
  } else if (payload.reminderType === 'day5') {
    await enqueueJob(
      'send-reminder',
      {
        ...payload,
        reminderType: 'day7',
      },
      { delay: 2 * 24 * 60 * 60 }
    )
  }

  return new Response(JSON.stringify({ success: true }))
}

export const POST = verifySignature(handler)

// Example: Trigger syndication from tRPC mutation
export const listingRouter = router({
  create: protectedProcedure.input(listingCreateSchema).mutation(async ({ ctx, input }) => {
    // Create listing in database
    const listing = await ctx.db.listing.create({
      data: input,
    })

    // Enqueue syndication job
    await enqueueJob('syndicate-listing', {
      listingId: listing.id,
      platforms: input.syndicationPlatforms || [
        'zillow',
        'apartments',
        'craigslist',
        'facebook',
        'streeteasy',
      ],
    })

    return listing
  }),
})

// Example: Start reminder sequence when application incomplete
export const applicationRouter = router({
  checkIncomplete: protectedProcedure.mutation(async ({ ctx }) => {
    // Find applications incomplete after 24 hours
    const incompleteApps = await ctx.db.application.findMany({
      where: {
        documentsComplete: false,
        createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        reminderStarted: false,
      },
    })

    // Start reminder sequence for each
    for (const app of incompleteApps) {
      const missingDocs = await getMissingDocuments(app.id)

      await enqueueJob('send-reminder', {
        applicantId: app.applicantId,
        reminderType: 'day1',
        missingDocs,
      })

      await ctx.db.application.update({
        where: { id: app.id },
        data: { reminderStarted: true },
      })
    }

    return { processed: incompleteApps.length }
  }),
})
```

**Database Schema for Job Tracking**:

```sql
CREATE TABLE job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qstash_message_id VARCHAR(100) UNIQUE,
  job_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  attempts INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  result JSONB,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_logs_status ON job_logs(status, created_at);
CREATE INDEX idx_job_logs_type ON job_logs(job_type, created_at);
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences

- **Serverless Compatible**: No long-running workers to manage
- **Reliable Delivery**: Built-in retries with exponential backoff
- **Scheduling**: Native support for delayed and recurring jobs
- **Existing Vendor**: Already using Upstash, unified billing
- **Observability**: Job tracking in database + QStash dashboard
- **Dead Letter**: Failed jobs captured for debugging

### Negative Consequences

- **HTTP Overhead**: Each job is an HTTP request (latency)
- **Cost Per Job**: Pay per message (~$0.001/message)
- **External Dependency**: Jobs fail if QStash is down
- **Debugging**: Async processing harder to trace

### Neutral Consequences

- **Job Design**: Need to design idempotent job handlers
- **Timeout Management**: Each handler has 10-60s limit
- **Signature Verification**: Need to verify QStash signatures

### Mitigation Strategies

- **HTTP Overhead**: Batch small jobs where possible
- **Cost Per Job**: Monitor usage, optimize job frequency
- **External Dependency**: Critical jobs have fallback (retry later)
- **Debugging**: Comprehensive logging, job tracking table

---

## Alternatives Considered

### Alternative 1: BullMQ with Redis

**Description**:
Use BullMQ job queue library with Upstash Redis as backend.

**Pros**:

- Feature-rich (priorities, rate limiting, concurrency)
- Uses existing Upstash Redis
- Large community
- Good TypeScript support

**Cons**:

- Requires persistent worker process (not serverless)
- Would need separate compute (Railway, Render)
- More infrastructure to manage
- Connection pooling issues in serverless

**Why Not Chosen**:
BullMQ requires persistent workers, which doesn't fit our serverless architecture. QStash is designed for serverless and integrates better with Vercel.

---

### Alternative 2: Inngest

**Description**:
Use Inngest for event-driven serverless functions.

**Pros**:

- Excellent developer experience
- Built for serverless
- Event-driven architecture
- Good debugging tools

**Cons**:

- Higher cost ($25+/month)
- Newer service (less proven)
- Would add another vendor
- More complex event model

**Why Not Chosen**:
QStash is simpler and we're already using Upstash. Inngest is great but adds vendor complexity and cost.

---

### Alternative 3: AWS SQS + Lambda

**Description**:
Use AWS SQS for queuing with Lambda for processing.

**Pros**:

- Highly scalable
- Very reliable
- Low cost at scale
- Full AWS ecosystem

**Cons**:

- Complex setup (IAM, VPC, etc.)
- Separate from Vercel stack
- Harder to deploy/manage
- Overkill for our needs

**Why Not Chosen**:
AWS adds significant operational complexity. QStash provides similar reliability with better developer experience for our scale.

---

### Alternative 4: Vercel Cron Only

**Description**:
Use Vercel cron jobs for all scheduled/background work.

**Pros**:

- Built into Vercel (no external service)
- Simple setup
- No additional cost
- Familiar cron syntax

**Cons**:

- No job queuing (only scheduled)
- No retries built-in
- Limited to cron intervals
- Can't enqueue from mutations

**Why Not Chosen**:
Vercel cron is good for scheduled tasks but can't handle on-demand job queuing like syndication on listing create. Use cron for daily checks, QStash for dynamic jobs.

---

### Alternative 5: PostgreSQL-Based Queue (Graphile Worker)

**Description**:
Use PostgreSQL as job queue with Graphile Worker.

**Pros**:

- Uses existing database
- ACID guarantees
- No additional service
- SQL-based job management

**Cons**:

- Requires persistent worker
- Adds load to database
- Not designed for serverless
- Less scalable than dedicated queue

**Why Not Chosen**:
Same issue as BullMQ - requires persistent workers. Also puts additional load on Neon database.

---

## Related

**Related ADRs**:

- [ADR-003: Redis Caching Strategy] - Upstash ecosystem
- [ADR-018: Multi-Channel Notifications] - Uses job queue for delivery
- [ADR-023: External API Integration] - Syndication jobs use this

**Related Documentation**:

- [User Story US-007] - Listing Syndication
- [User Story US-008] - Automated Document Reminders
- [docs/jobs/handler-guide.md] - Job handler patterns (to be created)

**External References**:

- [Upstash QStash Documentation](https://docs.upstash.com/qstash)
- [QStash + Vercel Guide](https://upstash.com/blog/qstash-vercel)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

---

## Notes

**Decision Making Process**:

- Evaluated serverless-compatible queue options
- Compared pricing for expected job volume
- Leveraged existing Upstash relationship
- Decision date: 2025-11-19

**Cost Estimate (Monthly)**:

- QStash free tier: 500 messages/day
- Expected: 200-300 jobs/day
- Total: $0 (free tier sufficient)
- Growth: $1/10k messages

**Job Design Principles**:

1. **Idempotent**: Jobs can safely run multiple times
2. **Small**: Each job completes in <60s
3. **Tracked**: All jobs logged in database
4. **Retriable**: Designed for automatic retry

**Review Schedule**:

- Monitor job completion rates weekly
- Review failed job patterns monthly
- Evaluate alternatives if >1000 jobs/day

**Migration Plan**:

- **Phase 1**: Set up QStash, install packages
- **Phase 2**: Create job tracking table
- **Phase 3**: Implement syndication handler (US-007)
- **Phase 4**: Implement reminder handler (US-008)
- **Phase 5**: Add monitoring dashboard
- **Rollback**: Process jobs synchronously (slower but works)

---

## Revision History

| Date       | Author             | Change                          |
| ---------- | ------------------ | ------------------------------- |
| 2025-11-19 | Architecture Agent | Initial creation for US-007/008 |
