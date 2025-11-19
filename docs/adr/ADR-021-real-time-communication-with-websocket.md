# ADR-021: Real-Time Communication with Pusher Channels

**Status:** APPROVED
**Date:** 2025-11-19
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

Multiple P1 user stories require real-time communication capabilities:

- US-005 (Unified Applicant Dashboard): Real-time status updates, notifications, WebSocket for live data
- US-009 (In-App Messaging): Real-time message delivery, typing indicators, read receipts

We need a standardized approach to real-time communication that is reliable, scalable, and works well with our serverless Vercel architecture.

**Background**:

- Vercel serverless functions are stateless and short-lived
- WebSocket connections require persistent servers
- Self-hosted WebSocket solutions don't work well with serverless
- Current approach: No real-time capabilities implemented
- Need: Dashboard updates, message delivery, typing indicators, read receipts

**Requirements**:

- **Functional**: Push updates to connected clients in real-time
- **Functional**: Support presence (who's online), typing indicators
- **Functional**: Support private channels (per-user, per-conversation)
- **Functional**: Graceful fallback when connection drops
- **Non-functional**: Message delivery <500ms latency
- **Non-functional**: Support 500+ concurrent connections
- **Non-functional**: 99.9% uptime
- **Non-functional**: Cost-effective for startup (<$50/month)
- **Constraints**: Must work with Vercel serverless
- **Constraints**: Must integrate with existing tRPC architecture

**Scope**:

- **Included**: Real-time dashboard updates, messaging, notifications
- **Included**: Presence detection, typing indicators, read receipts
- **Not included**: Video/audio streaming
- **Not included**: Large file transfers

---

## Decision

**We will use Pusher Channels for real-time communication with a pub/sub pattern, triggered from tRPC mutations.**

Pusher provides a managed WebSocket service with client libraries, presence channels, and excellent serverless compatibility. Our tRPC mutations will publish events to Pusher, and React clients will subscribe to receive updates.

**Implementation Approach**:

- Install `pusher` (server) and `pusher-js` (client) packages
- Create `lib/services/realtime.ts` for Pusher integration
- Trigger events from tRPC mutations after database writes
- Subscribe in React components using custom hooks
- Use private channels for user-specific data
- Use presence channels for typing indicators and online status
- Implement client-side optimistic updates + server reconciliation

**Why This Approach**:

1. **Serverless Compatible**: No persistent connections from our servers
2. **Managed Service**: No WebSocket infrastructure to maintain
3. **Client Libraries**: React SDK with hooks, presence, fallbacks
4. **Private Channels**: Secure per-user data delivery
5. **Reliability**: 99.99% uptime SLA, global infrastructure

**Example/Proof of Concept**:

```typescript
// lib/services/realtime.ts
import Pusher from 'pusher'

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

// Event types for type safety
export type RealtimeEvent =
  | { type: 'applicant:status_changed'; data: { applicantId: string; status: string } }
  | { type: 'applicant:new'; data: { applicantId: string; listingId: string } }
  | { type: 'message:new'; data: { threadId: string; messageId: string } }
  | { type: 'message:read'; data: { threadId: string; messageId: string } }
  | { type: 'typing:start'; data: { threadId: string; userId: string } }
  | { type: 'typing:stop'; data: { threadId: string; userId: string } }

export async function publishToAgent(agentId: string, event: RealtimeEvent): Promise<void> {
  await pusher.trigger(`private-agent-${agentId}`, event.type, event.data)
}

export async function publishToThread(threadId: string, event: RealtimeEvent): Promise<void> {
  await pusher.trigger(`private-thread-${threadId}`, event.type, event.data)
}

// lib/hooks/use-realtime.ts
import PusherClient from 'pusher-js'
import { useEffect, useState } from 'react'

const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  authEndpoint: '/api/pusher/auth',
})

export function useAgentChannel(agentId: string) {
  const [channel, setChannel] = useState<PusherClient.Channel | null>(null)

  useEffect(() => {
    const ch = pusherClient.subscribe(`private-agent-${agentId}`)
    setChannel(ch)

    return () => {
      pusherClient.unsubscribe(`private-agent-${agentId}`)
    }
  }, [agentId])

  return channel
}

export function useApplicantUpdates(
  agentId: string,
  onStatusChange: (data: { applicantId: string; status: string }) => void
) {
  const channel = useAgentChannel(agentId)

  useEffect(() => {
    if (!channel) return

    channel.bind('applicant:status_changed', onStatusChange)
    channel.bind('applicant:new', onStatusChange)

    return () => {
      channel.unbind('applicant:status_changed')
      channel.unbind('applicant:new')
    }
  }, [channel, onStatusChange])
}

// Example: Dashboard component with real-time updates
export function ApplicantDashboard({ agentId }: { agentId: string }) {
  const utils = trpc.useUtils()

  // Subscribe to real-time updates
  useApplicantUpdates(agentId, (data) => {
    // Invalidate and refetch the applicant list
    utils.applicant.list.invalidate()

    // Or optimistically update cache
    utils.applicant.list.setData({ agentId }, (old) => {
      if (!old) return old
      return old.map((a) => (a.id === data.applicantId ? { ...a, status: data.status } : a))
    })
  })

  // ... rest of component
}

// Example: tRPC mutation triggering real-time event
export const applicantRouter = router({
  updateStatus: protectedProcedure
    .input(
      z.object({
        applicantId: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Update database
      const applicant = await ctx.db.application.update({
        where: { id: input.applicantId },
        data: { status: input.status },
      })

      // Publish real-time event
      await publishToAgent(applicant.agentId, {
        type: 'applicant:status_changed',
        data: {
          applicantId: input.applicantId,
          status: input.status,
        },
      })

      return applicant
    }),
})

// API route for Pusher authentication (private channels)
// app/api/pusher/auth/route.ts
import { auth } from '@/lib/auth'
import { pusher } from '@/lib/services/realtime'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const data = await req.formData()
  const socketId = data.get('socket_id') as string
  const channel = data.get('channel_name') as string

  // Validate user has access to this channel
  const userId = session.user.id
  if (channel.startsWith(`private-agent-${userId}`) || (await canAccessChannel(userId, channel))) {
    const authResponse = pusher.authorizeChannel(socketId, channel)
    return new Response(JSON.stringify(authResponse))
  }

  return new Response('Forbidden', { status: 403 })
}
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences

- **Real-Time UX**: Instant updates without polling
- **Reduced Server Load**: No polling requests to handle
- **Serverless Compatible**: Works perfectly with Vercel
- **Developer Experience**: Good SDKs, TypeScript support
- **Reliability**: Managed service with high uptime
- **Presence Features**: Built-in typing indicators, online status

### Negative Consequences

- **External Dependency**: Critical feature depends on third-party
- **Cost at Scale**: $49/month for 500k messages, grows with usage
- **Learning Curve**: Team needs to understand pub/sub patterns
- **Debugging Complexity**: Async events harder to trace than REST

### Neutral Consequences

- **Event Design**: Need to design event schema carefully
- **Channel Strategy**: Need to plan channel naming convention
- **Authentication**: Need auth endpoint for private channels

### Mitigation Strategies

- **External Dependency**: Implement graceful degradation (fallback to polling)
- **Cost at Scale**: Monitor usage, optimize event granularity
- **Learning Curve**: Create internal documentation and examples
- **Debugging**: Add event logging, use Pusher debug console

---

## Alternatives Considered

### Alternative 1: Socket.io (Self-Hosted)

**Description**:
Deploy Socket.io server on a separate Node.js service (Railway, Render).

**Pros**:

- Full control over implementation
- No per-message costs
- Rich feature set (rooms, namespaces)
- Large community

**Cons**:

- Requires separate infrastructure
- Need to manage scaling, failover
- Doesn't integrate with Vercel serverless
- Higher DevOps burden

**Why Not Chosen**:
Managing WebSocket infrastructure is complex and expensive for a startup. Serverless architecture doesn't support persistent connections from application code.

---

### Alternative 2: Ably

**Description**:
Use Ably as an alternative managed real-time service.

**Pros**:

- Similar to Pusher, managed service
- Strong reliability features
- Good documentation
- Presence and history support

**Cons**:

- Higher pricing than Pusher
- Smaller community/ecosystem
- Less React/Next.js examples
- Over-engineered for our needs

**Why Not Chosen**:
Pusher has better pricing for our expected volume and more community examples for Next.js integration.

---

### Alternative 3: Supabase Realtime

**Description**:
Use Supabase's built-in realtime subscriptions to Postgres changes.

**Pros**:

- Database-level change detection
- No manual event publishing
- Integrated with Supabase ecosystem
- Row-level security

**Cons**:

- Would require migrating from Neon to Supabase
- Less flexible event patterns
- Tied to database schema
- Can't do presence/typing indicators

**Why Not Chosen**:
Would require database migration from Neon. Also limited to database changes - can't handle typing indicators or custom events.

---

### Alternative 4: Long Polling / Server-Sent Events

**Description**:
Use HTTP long polling or SSE instead of WebSockets.

**Pros**:

- Works with serverless (for SSE)
- Simpler implementation
- No third-party dependency
- Lower cost

**Cons**:

- Higher latency than WebSocket
- No bidirectional communication (SSE)
- More server resources for polling
- Poor UX for typing indicators

**Why Not Chosen**:
SSE is one-way only (server to client), can't handle typing indicators. Long polling has too much latency for real-time messaging experience.

---

### Alternative 5: Do Nothing (Polling)

**Description**:
Use interval polling from client to fetch updates.

**Pros**:

- Simplest implementation
- No additional services
- Works everywhere
- Easy to understand

**Cons**:

- High latency (depends on interval)
- Wasteful of resources (many empty requests)
- Poor UX for real-time features
- Server load increases with users

**Why Not Chosen**:
Polling at intervals fast enough for good UX (1-2 seconds) creates too much server load and still feels sluggish compared to true real-time.

---

## Related

**Related ADRs**:

- [ADR-003: Redis Caching Strategy] - Can cache channel data
- [ADR-004: Email Templating] - Notifications fallback
- [ADR-018: Multi-Channel Notifications] - Push notifications complement

**Related Documentation**:

- [User Story US-005] - Unified Applicant Dashboard
- [User Story US-009] - In-App Messaging
- [docs/realtime/channel-design.md] - Channel naming conventions (to be created)

**External References**:

- [Pusher Channels Docs](https://pusher.com/docs/channels)
- [Pusher React Integration](https://pusher.com/tutorials/react-websockets)
- [Vercel + Pusher Guide](https://vercel.com/guides/deploying-pusher-channels-with-vercel)

---

## Notes

**Decision Making Process**:

- Evaluated serverless-compatible options
- Compared pricing for expected message volume
- Reviewed Next.js integration examples
- Decision date: 2025-11-19

**Cost Estimate (Monthly)**:

- Starter plan: Free (200k messages, 100 connections)
- Growth plan: $49/month (2M messages, 500 connections)
- Expected usage: ~100k messages/month initially
- Total: $0 (free tier sufficient for MVP)

**Channel Naming Convention**:

- `private-agent-{agentId}` - Agent-specific updates
- `private-thread-{threadId}` - Message thread updates
- `private-applicant-{applicantId}` - Applicant status updates
- `presence-thread-{threadId}` - Typing indicators

**Review Schedule**:

- Monitor message volume weekly
- Review latency metrics monthly
- Evaluate alternatives if costs exceed $100/month

**Migration Plan**:

- **Phase 1**: Set up Pusher account, install packages
- **Phase 2**: Implement auth endpoint and hooks
- **Phase 3**: Add real-time to dashboard (US-005)
- **Phase 4**: Add real-time to messaging (US-009)
- **Rollback**: Disable Pusher triggers, enable polling fallback

---

## Revision History

| Date       | Author             | Change                          |
| ---------- | ------------------ | ------------------------------- |
| 2025-11-19 | Architecture Agent | Initial creation for US-005/009 |
