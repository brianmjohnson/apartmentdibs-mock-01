# ADR-007: Observability with Consola and OpenTelemetry

**Status:** DRAFT
**Date:** 2025-11-16
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

We need a comprehensive observability strategy to monitor application health, debug production issues, track performance, and ensure compliance with GDPR/HIPAA logging requirements.

**Background**:

- Current state: Basic console.log for development, PostHog for product analytics
- Gaps: No structured logging, no PII redaction, no distributed tracing, no performance metrics
- Compliance requirement: GDPR Article 32 requires security of processing and logging controls
- Operational need: Production debugging is difficult without structured logs and tracing

**Requirements**:

**Functional**:

- Structured JSON logging for machine parsing (e.g., by log aggregators)
- Automatic PII redaction based on ZenStack `@meta(sensitivity)` tags
- Distributed tracing across tRPC routes, database queries, and external API calls
- Performance metrics: Lead time, Error rate, Throughput, Saturation (LETS)
- Request correlation (trace requests across multiple services/functions)

**Non-Functional**:

- Performance: <10ms overhead per log statement
- Compliance: GDPR/HIPAA compliant (no PII in logs without explicit consent)
- Developer Experience: Minimal configuration, automatic instrumentation
- Cost: <$50/month at scale (prefer open standards over vendor lock-in)

**Scope**:

- **In Scope**: Application logging, distributed tracing, LETS metrics, PII redaction
- **Out of Scope**: Infrastructure monitoring (Vercel handles this), business analytics (PostHog)

---

## Decision

**We will adopt a three-tier observability stack: Consola for logging, OpenTelemetry for tracing/metrics, and PostHog for analytics.**

### Tier 1: Application Logging (Consola)

**Library**: [Consola](https://github.com/unjs/consola) - Elegant console logger for Node.js and browser

**Why Consola**:

- 🎨 **Elegant**: Colorful, readable output in development
- 📊 **Structured**: JSON output in production for log aggregators
- 🔌 **Extensible**: Custom reporters for PII redaction
- 🪶 **Lightweight**: 3.4KB gzipped, minimal performance impact
- 🌐 **Universal**: Works in Node.js, Edge runtime, and browser

**Key Features**:

- Custom reporter for automatic `@meta(sensitivity)` PII redaction
- Tagging for module-level logging (e.g., `logger.withTag('auth')`)
- Log levels: trace, debug, info, warn, error, fatal
- Fancy formatting in dev, JSON in production

**Implementation**:

```typescript
// lib/logger.ts
import { createConsola } from 'consola'
import { redactSensitiveFields } from './redactor'

const sensitiveFieldRedactor = {
  log: (logObj: any) => {
    const redactedArgs = logObj.args.map(redactSensitiveFields)
    consola.withTag(logObj.tag || 'app').log(...redactedArgs)
  },
}

export const logger = createConsola({
  fancy: process.env.NODE_ENV === 'development',
  formatOptions: { date: true, columns: 80 },
  reporters: [sensitiveFieldRedactor],
})
```

---

### Tier 2: Distributed Tracing & Metrics (OpenTelemetry)

**Library**: [OpenTelemetry](https://opentelemetry.io/) - Vendor-neutral observability standard

**Why OpenTelemetry**:

- 🌍 **Industry Standard**: CNCF project, widely adopted
- 🔓 **Vendor Neutral**: Works with any backend (Jaeger, Zipkin, Grafana, Datadog, etc.)
- 📈 **Comprehensive**: Traces, metrics, and logs in one SDK
- 🔧 **Auto-Instrumentation**: Automatic instrumentation for common frameworks
- 💰 **Cost Effective**: Export to self-hosted backends (free) or managed services

**Key Features**:

- Distributed tracing: Track requests across tRPC routes, DB queries, external APIs
- Metrics: LETS metrics (Lead time, Error rate, Throughput, Saturation)
- Context propagation: Correlate logs with traces via trace ID
- Sampling: Trace 100% in dev, 10% in production (configurable)

**LETS Metrics Implementation**:

```typescript
// lib/telemetry/metrics.ts
import { metrics } from '@opentelemetry/api'

const meter = metrics.getMeter('app')

// L - Lead Time (time from request to response)
export const leadTimeHistogram = meter.createHistogram('http.server.duration', {
  description: 'Request lead time in milliseconds',
  unit: 'ms',
})

// E - Error Rate (4xx/5xx responses)
export const errorCounter = meter.createCounter('http.server.errors', {
  description: 'Count of HTTP errors by status code',
  unit: '1',
})

// T - Throughput (requests per second)
export const throughputCounter = meter.createCounter('http.server.requests', {
  description: 'Total HTTP requests',
  unit: '1',
})

// S - Saturation (resource utilization)
export const saturationGauge = meter.createObservableGauge('runtime.nodejs.memory.heap_used', {
  description: 'Node.js heap memory usage',
  unit: 'bytes',
})
```

**Trace Context in Logs**:

```typescript
import { trace } from '@opentelemetry/api'
import { logger } from '@/lib/logger'

export function logWithTrace(message: string, data?: any) {
  const span = trace.getActiveSpan()
  const traceId = span?.spanContext().traceId

  logger.info(message, {
    ...data,
    traceId, // Correlate logs with traces
    spanId: span?.spanContext().spanId,
  })
}
```

---

### Tier 3: Product Analytics (PostHog) - Existing

**Purpose**: User behavior tracking, feature adoption, A/B testing (see ADR-005)

**Separation of Concerns**:

- **Consola**: Development debugging, error tracking, compliance logging
- **OpenTelemetry**: Performance monitoring, distributed tracing, DevOps metrics
- **PostHog**: Product analytics, user funnels, feature flags

**No Overlap**: Each tool serves a distinct purpose, minimal redundancy.

---

## Implementation Approach

### Phase 1: Consola (Already Installed ✅)

```bash
pnpm add consola  # Already done
```

**Tasks**:

- [x] Install consola
- [ ] Create `lib/logger.ts` with PII redaction reporter
- [ ] Create `lib/redactor.ts` with `@meta(sensitivity)` detection logic
- [ ] Replace `console.log` with `logger` in critical paths
- [ ] Add logger to tRPC context for request-scoped logging

**Effort**: 1 day

---

### Phase 2: OpenTelemetry (Next Priority)

```bash
pnpm add @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
pnpm add @opentelemetry/exporter-trace-otlp-http @opentelemetry/exporter-metrics-otlp-http
```

**Tasks**:

- [ ] Create `lib/telemetry/instrumentation.ts` with auto-instrumentation setup
- [ ] Create `lib/telemetry/metrics.ts` for LETS metrics
- [ ] Add trace context to logger (correlate logs with traces)
- [ ] Configure OTLP exporter (start with console, then Jaeger for local dev)
- [ ] Add custom spans for critical operations (tRPC routes, DB queries)

**Effort**: 2-3 days

**Configuration** (`instrumentation.ts` for Next.js 15+):

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'

export function register() {
  const sdk = new NodeSDK({
    serviceName: 'nextjs-app',
    traceExporter: new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/metrics',
      }),
      exportIntervalMillis: 60000, // Export every 60 seconds
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false }, // Too noisy
        '@opentelemetry/instrumentation-http': { enabled: true },
        '@opentelemetry/instrumentation-prisma': { enabled: true },
      }),
    ],
  })

  sdk.start()

  // Graceful shutdown
  process.on('SIGTERM', () => {
    sdk.shutdown().finally(() => process.exit(0))
  })
}
```

---

### Phase 3: Backend Integration (Choose One)

**Option A: Self-Hosted (Free, Full Control)**

**Jaeger** (for local development and staging):

```bash
docker run -d --name jaeger \
  -p 16686:16686 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest
```

- UI: http://localhost:16686
- Cost: $0 (self-hosted)
- Retention: Configure as needed
- Best for: Early stages, cost-conscious startups

**Option B: Managed Service (Paid, Less Ops)**

**Grafana Cloud** (Free tier: 50GB traces/month, 10k metrics):

- Cost: $0 - $100/month
- Setup: 5-minute integration
- Features: Unified dashboards for traces + metrics + logs
- Best for: Production, teams that want managed solution

**Decision**: Start with Jaeger (local), migrate to Grafana Cloud at scale.

---

## Consequences

### Positive Consequences

**Developer Experience**:

- ✅ **Faster Debugging**: Structured logs + traces pinpoint issues in seconds
- ✅ **Automatic PII Protection**: No manual redaction, GDPR-compliant by default
- ✅ **Request Correlation**: Trace requests from API → DB → external services
- ✅ **Minimal Config**: Consola works with zero config, OpenTelemetry auto-instruments

**Operational Benefits**:

- ✅ **Performance Insights**: LETS metrics reveal bottlenecks (slow queries, high error rates)
- ✅ **Proactive Monitoring**: Alerts on error rate spikes, latency degradation
- ✅ **Vendor Independence**: OpenTelemetry exports to any backend (no lock-in)

**Compliance**:

- ✅ **GDPR Compliant**: Automatic PII redaction prevents accidental exposure
- ✅ **Audit Trail**: Structured logs are immutable and queryable for compliance

### Negative Consequences

**Complexity**:

- ❌ **Learning Curve**: Team must learn OpenTelemetry SDK and concepts (spans, traces, metrics)
- ❌ **Configuration Overhead**: OpenTelemetry requires instrumentation setup

**Performance**:

- ❌ **Trace Overhead**: ~5-10ms per traced request (mitigated by sampling)
- ❌ **Log Volume**: Structured JSON logs are larger than plain text

**Cost**:

- ❌ **Managed Service**: Grafana Cloud/Datadog can cost $100-500/month at scale
- ❌ **Storage**: Logs and traces require storage (mitigated by retention policies)

### Mitigation Strategies

**Learning Curve**:

- 📚 Create runbook: `docs/observability/getting-started.md`
- 📚 Document common patterns: "How to add custom spans", "How to log with trace context"

**Performance**:

- ⚙️ Use sampling: 100% in dev, 10% in production (adjustable)
- ⚙️ Async exports: Don't block requests waiting for trace exports

**Cost**:

- 💰 Start with Jaeger (self-hosted, free)
- 💰 Implement retention policies: 7 days for traces, 30 days for logs
- 💰 Use tail-based sampling: Only trace errors and slow requests in production

---

## Alternatives Considered

### Alternative 1: Pino for Logging

**Description**: [Pino](https://getpino.io/) is a very fast JSON logger for Node.js.

**Pros**:

- ⚡ Faster than Consola (claims 5x faster)
- 📊 Structured JSON logging built-in
- 🔌 Extensive plugin ecosystem

**Cons**:

- 🎨 Less elegant output (no colors by default)
- 🔧 More configuration required for PII redaction
- 🌐 Node.js only (doesn't work in browser/edge)

**Why Not Chosen**:
Consola provides better developer experience with minimal performance difference for our scale. Pino's speed advantage (5-10ms vs 1-2ms per log) is negligible compared to network latency (50-200ms).

---

### Alternative 2: Sentry for Observability

**Description**: Use Sentry for error tracking, performance monitoring, and logging.

**Pros**:

- 📦 All-in-one solution (errors + performance + logs)
- 🎯 Excellent error grouping and issue tracking
- 📧 Built-in alerting

**Cons**:

- 💰 Expensive: $26/month (team) → $80/month (business) → $599/month (enterprise)
- 🔒 Vendor lock-in (proprietary SDK and backends)
- 📊 Limited metrics (no custom LETS metrics)
- 🔍 No distributed tracing (added in 2023, less mature than OpenTelemetry)

**Why Not Chosen**:
Cost and vendor lock-in. OpenTelemetry + Jaeger (free) provides similar capabilities with portability.

---

### Alternative 3: Datadog

**Description**: Full observability platform (logs, metrics, traces, APM).

**Pros**:

- 🌟 Best-in-class UI and dashboards
- 📈 Excellent APM and profiling
- 🔔 Advanced alerting and anomaly detection

**Cons**:

- 💰💰 Very expensive: $31/host/month (logs) + $15/host/month (APM) = $46+/month
- 🔒 Vendor lock-in (proprietary agents)
- 🧩 Overkill for early-stage startup

**Why Not Chosen**:
Cost is prohibitive for a startup. Defer until we have >$100k MRR and need enterprise-grade observability.

---

### Alternative 4: Do Nothing (Console.log + Vercel Logs)

**Description**: Continue using console.log, rely on Vercel's built-in logging.

**Pros**:

- ✅ Zero setup, works today
- ✅ Free (Vercel includes logs in platform)

**Cons**:

- ❌ No PII redaction (GDPR violation risk)
- ❌ No structured data (hard to parse/query)
- ❌ No distributed tracing (can't debug multi-service requests)
- ❌ No custom metrics (no LETS tracking)
- ❌ 7-day retention only (Vercel default)

**Why Not Chosen**:
Insufficient for production. PII redaction is a compliance requirement, not optional.

---

## Related

**Related ADRs**:

- [ADR-005: PostHog for Feature Flags and A/B Testing](./ADR-005-posthog-feature-flags-and-ab-testing.md) - Separate analytics from observability
- [ADR-002: Automation Tools for Operational Agents](./ADR-002-automation-tools-for-operational-agents.md) - n8n for operational workflows

**Related Documentation**:

- `.claude/agents/observability-agent.md` - Observability agent responsibilities
- `.claude/agents/compliance-agent.md` - GDPR/HIPAA logging requirements
- `docs/observability/audit-requirements.md` - Audit logging specification (to be created)

**External References**:

- [Consola Documentation](https://github.com/unjs/consola)
- [OpenTelemetry Getting Started](https://opentelemetry.io/docs/languages/js/getting-started/nodejs/)
- [LETS Metrics (DORA)](https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

---

## Notes

**Decision Making Process**:

- Consulted: Architecture Agent, Compliance Agent, Observability Agent
- Research: Evaluated Consola, Pino, Winston for logging; OpenTelemetry, Datadog, Sentry for tracing
- Decision Date: 2025-11-16

**Review Schedule**:

- Revisit after 6 months or when monthly trace volume exceeds 1M spans
- Monitor metrics: Log volume (MB/day), trace export latency, storage costs

**Migration Plan**:

**Phase 1** (Week 1): Consola logging

- Replace console.log in critical paths (auth, payments, tRPC routes)
- Deploy to staging, verify PII redaction works
- Deploy to production, monitor log volume

**Phase 2** (Week 2-3): OpenTelemetry tracing

- Instrument tRPC routes with custom spans
- Deploy Jaeger locally for development
- Add trace context to logs (correlate logs ↔ traces)

**Phase 3** (Week 4): LETS metrics

- Implement Lead time, Error rate, Throughput, Saturation metrics
- Create Grafana dashboards (or Jaeger UI for traces)
- Set up alerts for error rate >5%, p95 latency >2s

**Rollback Strategy**:

- Consola: Minimal risk, can disable custom reporter if issues arise
- OpenTelemetry: Use feature flag to disable instrumentation if performance issues occur

---

## Revision History

| Date       | Author             | Change        |
| ---------- | ------------------ | ------------- |
| 2025-11-16 | Architecture Agent | Initial draft |
