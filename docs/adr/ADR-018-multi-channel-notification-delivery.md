# ADR-018: Multi-Channel Notification Delivery for Compliance Communications

**Status:** APPROVED
**Date:** 2025-11-19
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

User Story US-002 (Automated Adverse Action Notices) requires FCRA-compliant adverse action letters to be delivered through multiple channels to ensure legal delivery requirements are met. These legal documents must be delivered via email (primary), SMS notification, and certified mail (fallback when email bounces). We need a unified architecture to orchestrate delivery across these channels with tracking and retry logic.

**Background**:
- ADR-004 established React Email + Resend for transactional emails
- FCRA requires adverse action letters within 7-14 days (we target 24 hours)
- Legal requirement: Must prove delivery to tenant
- Current approach: No multi-channel delivery system
- Email alone is insufficient - emails bounce, spam filters, etc.

**Requirements**:
- **Functional**: Send adverse action letters via email (Resend)
- **Functional**: Send SMS notifications with link to letter (Twilio)
- **Functional**: Send certified mail when email bounces (Lob)
- **Functional**: Track delivery status across all channels
- **Functional**: Retry failed deliveries automatically
- **Non-functional**: Email delivery within 1 hour of denial
- **Non-functional**: SMS notification within 1 hour
- **Non-functional**: 99.9% successful delivery across all channels
- **Non-functional**: Maintain delivery receipts for 3 years
- **Constraints**: Budget: <$100/month for expected volume
- **Constraints**: Must integrate with existing tRPC + Better Auth

**Scope**:
- **Included**: Adverse action letter delivery, delivery tracking, retries
- **Included**: Integration with Resend, Twilio, Lob
- **Not included**: Marketing communications (separate concern)
- **Not included**: Real-time chat/notifications (different pattern)

---

## Decision

**We will implement a multi-channel notification orchestrator using a queue-based architecture with Resend for email, Twilio for SMS, and Lob for certified mail, with centralized delivery tracking.**

The orchestrator will use Upstash Redis queues (already in stack) to manage delivery jobs asynchronously. Each channel has its own adapter following a common interface, allowing easy addition of new channels in the future.

**Implementation Approach**:
- Create `lib/services/notification-orchestrator.ts` for delivery coordination
- Implement channel adapters: `email-adapter.ts`, `sms-adapter.ts`, `mail-adapter.ts`
- Use Upstash Redis queues for async processing and retries
- Store delivery tracking in `delivery_logs` table
- Integrate with ADR-017 audit trail for compliance logging
- Configure webhook endpoints for delivery status updates

**Why This Approach**:
1. **Reliability**: Queue-based ensures no lost deliveries
2. **Legal Compliance**: Multi-channel guarantees delivery proof
3. **Auditability**: Centralized tracking for legal defense
4. **Extensibility**: Adapter pattern allows new channels
5. **Cost-Effective**: Pay-per-use APIs, no idle costs

**Example/Proof of Concept**:
```typescript
// lib/services/notification-orchestrator.ts
import { Redis } from '@upstash/redis';
import { EmailAdapter } from './adapters/email-adapter';
import { SmsAdapter } from './adapters/sms-adapter';
import { MailAdapter } from './adapters/mail-adapter';

interface NotificationJob {
  id: string;
  type: 'adverse_action' | 'reminder' | 'confirmation';
  recipientId: string;
  recipientEmail: string;
  recipientPhone?: string;
  recipientAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  templateId: string;
  templateData: Record<string, unknown>;
  channels: ('email' | 'sms' | 'mail')[];
  priority: 'high' | 'normal';
  createdAt: Date;
}

interface DeliveryResult {
  channel: string;
  status: 'sent' | 'delivered' | 'failed' | 'bounced';
  timestamp: Date;
  externalId?: string;
  errorMessage?: string;
}

export class NotificationOrchestrator {
  private redis: Redis;
  private emailAdapter: EmailAdapter;
  private smsAdapter: SmsAdapter;
  private mailAdapter: MailAdapter;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL!,
      token: process.env.UPSTASH_REDIS_TOKEN!,
    });
    this.emailAdapter = new EmailAdapter();
    this.smsAdapter = new SmsAdapter();
    this.mailAdapter = new MailAdapter();
  }

  async sendAdverseActionNotice(
    applicantId: string,
    letterId: string,
    recipient: {
      email: string;
      phone?: string;
      address?: NotificationJob['recipientAddress'];
    }
  ): Promise<string> {
    const job: NotificationJob = {
      id: crypto.randomUUID(),
      type: 'adverse_action',
      recipientId: applicantId,
      recipientEmail: recipient.email,
      recipientPhone: recipient.phone,
      recipientAddress: recipient.address,
      templateId: 'adverse-action-letter',
      templateData: { letterId },
      channels: ['email', 'sms'], // Mail added automatically if email bounces
      priority: 'high',
      createdAt: new Date(),
    };

    // Queue the job for processing
    await this.redis.lpush('notification:queue:high', JSON.stringify(job));

    // Log to audit trail
    await this.logDeliveryAttempt(job);

    return job.id;
  }

  async processQueue(): Promise<void> {
    // Process high priority first
    const highPriorityJob = await this.redis.rpop('notification:queue:high');
    const normalPriorityJob = await this.redis.rpop('notification:queue:normal');

    const jobData = highPriorityJob || normalPriorityJob;
    if (!jobData) return;

    const job = JSON.parse(jobData as string) as NotificationJob;
    const results: DeliveryResult[] = [];

    // Process each channel
    for (const channel of job.channels) {
      try {
        const result = await this.deliverToChannel(job, channel);
        results.push(result);

        // If email bounces, add certified mail
        if (channel === 'email' && result.status === 'bounced') {
          if (job.recipientAddress) {
            const mailResult = await this.deliverToChannel(job, 'mail');
            results.push(mailResult);
          }
        }
      } catch (error) {
        results.push({
          channel,
          status: 'failed',
          timestamp: new Date(),
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Update delivery tracking
    await this.updateDeliveryStatus(job.id, results);
  }

  private async deliverToChannel(
    job: NotificationJob,
    channel: 'email' | 'sms' | 'mail'
  ): Promise<DeliveryResult> {
    switch (channel) {
      case 'email':
        return this.emailAdapter.send(job);
      case 'sms':
        return this.smsAdapter.send(job);
      case 'mail':
        return this.mailAdapter.send(job);
    }
  }

  private async updateDeliveryStatus(
    jobId: string,
    results: DeliveryResult[]
  ): Promise<void> {
    // Store in database for compliance tracking
    await prisma.deliveryLog.createMany({
      data: results.map(result => ({
        notificationJobId: jobId,
        channel: result.channel,
        status: result.status,
        timestamp: result.timestamp,
        externalId: result.externalId,
        errorMessage: result.errorMessage,
      })),
    });
  }

  private async logDeliveryAttempt(job: NotificationJob): Promise<void> {
    // Integration with ADR-017 audit trail
    await logPiiAccess({
      userId: 'system',
      userRole: 'system',
      applicantId: job.recipientId,
      actionType: 'adverse_action_sent',
      accessGranted: true,
      requestMetadata: {
        jobId: job.id,
        channels: job.channels,
      },
    });
  }
}

// lib/services/adapters/email-adapter.ts
import { Resend } from 'resend';
import { AdverseActionEmail } from '@/emails/adverse-action';

export class EmailAdapter {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async send(job: NotificationJob): Promise<DeliveryResult> {
    const { data, error } = await this.resend.emails.send({
      from: 'notices@apartmentdibs.com',
      to: job.recipientEmail,
      subject: 'Notice of Adverse Action - ApartmentDibs',
      react: AdverseActionEmail(job.templateData),
    });

    if (error) {
      return {
        channel: 'email',
        status: error.name === 'bounce' ? 'bounced' : 'failed',
        timestamp: new Date(),
        errorMessage: error.message,
      };
    }

    return {
      channel: 'email',
      status: 'sent',
      timestamp: new Date(),
      externalId: data?.id,
    };
  }
}

// lib/services/adapters/sms-adapter.ts
import twilio from 'twilio';

export class SmsAdapter {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async send(job: NotificationJob): Promise<DeliveryResult> {
    if (!job.recipientPhone) {
      return {
        channel: 'sms',
        status: 'failed',
        timestamp: new Date(),
        errorMessage: 'No phone number provided',
      };
    }

    const message = await this.client.messages.create({
      body: `ApartmentDibs: You have received an important notice regarding your rental application. View it here: https://apartmentdibs.com/notices/${job.templateData.letterId}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: job.recipientPhone,
    });

    return {
      channel: 'sms',
      status: 'sent',
      timestamp: new Date(),
      externalId: message.sid,
    };
  }
}

// lib/services/adapters/mail-adapter.ts
import Lob from 'lob';

export class MailAdapter {
  private lob: Lob;

  constructor() {
    this.lob = new Lob({ apiKey: process.env.LOB_API_KEY });
  }

  async send(job: NotificationJob): Promise<DeliveryResult> {
    if (!job.recipientAddress) {
      return {
        channel: 'mail',
        status: 'failed',
        timestamp: new Date(),
        errorMessage: 'No address provided',
      };
    }

    const letter = await this.lob.letters.create({
      description: `Adverse Action Notice - ${job.recipientId}`,
      to: {
        name: job.recipientId, // Will be resolved to actual name
        address_line1: job.recipientAddress.street,
        address_city: job.recipientAddress.city,
        address_state: job.recipientAddress.state,
        address_zip: job.recipientAddress.zip,
      },
      from: {
        name: 'ApartmentDibs',
        address_line1: '123 Legal Street',
        address_city: 'New York',
        address_state: 'NY',
        address_zip: '10001',
      },
      file: `https://apartmentdibs.com/api/letters/${job.templateData.letterId}/pdf`,
      mail_type: 'usps_first_class',
      extra_service: 'certified',
    });

    return {
      channel: 'mail',
      status: 'sent',
      timestamp: new Date(),
      externalId: letter.id,
    };
  }
}
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences
- **Legal Compliance**: Multi-channel ensures FCRA delivery requirements met
- **Delivery Guarantee**: If email fails, SMS and mail provide backup
- **Audit Trail**: Complete delivery history for legal defense
- **Reliability**: Queue-based processing prevents lost notifications
- **Scalability**: Async processing handles volume spikes
- **Extensibility**: New channels easily added via adapter pattern

### Negative Consequences
- **Multiple Vendors**: Three external APIs to manage (Resend, Twilio, Lob)
- **Cost Per Delivery**: Certified mail is $3-5 per letter
- **Complexity**: More moving parts than simple email
- **Webhook Management**: Need to handle status callbacks from all providers

### Neutral Consequences
- **Queue Monitoring**: Need observability into queue depth and failures
- **Template Sync**: Letter templates must be consistent across channels

### Mitigation Strategies
- **Multiple Vendors**: Create abstraction layer, document all integrations
- **Cost Per Delivery**: Certified mail only used as fallback, expected <5% of deliveries
- **Complexity**: Comprehensive logging, error handling, and alerting
- **Webhook Management**: Unified webhook handler that routes to appropriate service

---

## Alternatives Considered

### Alternative 1: Email-Only Delivery (Resend)

**Description**:
Send all communications via email only using existing Resend integration.

**Pros**:
- Simple implementation
- Low cost
- Already integrated (ADR-004)

**Cons**:
- No fallback if email bounces
- Cannot prove delivery for legal compliance
- No SMS notification for urgency
- May not meet FCRA requirements

**Why Not Chosen**:
Legal risk too high. FCRA requires proof of delivery, and email alone cannot guarantee this.

---

### Alternative 2: SendGrid + Twilio (Unified Vendor)

**Description**:
Use SendGrid for email (also owned by Twilio) to have a more unified vendor relationship.

**Pros**:
- Single billing relationship
- Integrated email + SMS
- Established enterprise platform
- Unified webhooks

**Cons**:
- More expensive than Resend ($15/month minimum)
- Less developer-friendly than Resend
- Would need to migrate from existing Resend setup
- No certified mail integration

**Why Not Chosen**:
Higher cost and migration effort without significant benefit. Resend already established per ADR-004.

---

### Alternative 3: AWS SNS + SES + Custom Mail

**Description**:
Use AWS services for email and SMS, with custom mail fulfillment.

**Pros**:
- AWS ecosystem consistency
- High reliability
- Potentially lower cost at scale
- Full control over infrastructure

**Cons**:
- Complex setup (IAM, regions, etc.)
- No certified mail solution
- Need to build more infrastructure
- Less developer-friendly

**Why Not Chosen**:
Too much infrastructure overhead for startup stage. Pay-per-use APIs more appropriate for our volume.

---

## Related

**Related ADRs**:
- [ADR-004: Email Templating with Resend] - Email delivery foundation
- [ADR-017: Immutable Audit Trail] - Delivery tracking feeds into audit
- [ADR-003: Redis Caching Strategy] - Upstash Redis for queues

**Related Documentation**:
- [User Story US-002] - Automated Adverse Action Notices
- [docs/notifications/delivery-tracking.md] - Delivery monitoring (to be created)

**External References**:
- [Resend Documentation](https://resend.com/docs)
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [Lob Letters API](https://docs.lob.com/#tag/Letters)
- [FCRA Adverse Action Requirements](https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-landlords-need-know)

---

## Notes

**Decision Making Process**:
- Evaluated FCRA delivery requirements
- Compared vendor options for each channel
- Estimated delivery volume and costs
- Decision date: 2025-11-19

**Cost Estimate (Monthly)**:
- Resend: $0 (free tier covers 3,000 emails)
- Twilio SMS: ~$15 (1,000 messages at $0.0079/msg)
- Lob certified mail: ~$50 (10 letters at $5/letter - fallback only)
- Total: ~$65/month

**Review Schedule**:
- Monitor delivery success rates weekly
- Review costs monthly
- Evaluate alternative vendors if volume exceeds free tiers

**Migration Plan**:
- **Phase 1**: Implement orchestrator and email adapter (Week 1)
- **Phase 2**: Add SMS adapter with Twilio (Week 1)
- **Phase 3**: Add mail adapter with Lob (Week 2)
- **Phase 4**: Implement webhook handlers for status updates (Week 2)
- **Phase 5**: Create delivery tracking dashboard (Week 3)
- **Rollback**: Can disable individual channels via feature flags

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-19 | Architecture Agent | Initial creation for US-002 |
