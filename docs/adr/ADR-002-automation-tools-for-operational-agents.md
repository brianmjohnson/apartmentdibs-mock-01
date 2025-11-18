# ADR-002: Use Zapier/n8n for Operational Agent Automation

**Status:** APPROVED
**Date:** 2025-11-16
**Author:** AI Agent

---

## Context

**What is the issue or problem we're solving?**

Operational agents (Market Analyst, Unit Economics, Compliance) need to run scheduled tasks regularly to gather data, perform analysis, and generate reports. These tasks include weekly competitor scans, monthly financial reviews, and daily news monitoring. We need a reliable automation platform to orchestrate these workflows.

**Background**:
- Operational agents require periodic execution without manual intervention
- Tasks involve API calls, data processing, and database updates
- Current approach lacks scheduling infrastructure for automated workflows
- Need to balance ease of use, cost, flexibility, and maintenance burden

**Requirements**:
- **Functional**: Schedule recurring tasks (daily, weekly, monthly intervals)
- **Functional**: Integrate with external APIs (news, market data, compliance feeds)
- **Functional**: Trigger database operations and tRPC endpoints
- **Non-functional**: Reliability >99% uptime for scheduled tasks
- **Non-functional**: Cost-effective for startup budget ($0-100/month initially)
- **Constraints**: Limited DevOps resources for infrastructure management
- **Constraints**: Need to work with Vercel serverless architecture

**Scope**:
- **Included**: Scheduling, webhook handling, basic data transformations
- **Included**: Integration with third-party APIs and internal tRPC routes
- **Not included**: Complex ETL pipelines (use dedicated tools if needed)
- **Not included**: Real-time event streaming (use message queues if needed)

---

## Decision

**We will use n8n (self-hosted) for operational agent automation workflows.**

We will deploy n8n as a containerized service on Railway or Vercel, providing a visual workflow builder for scheduling and orchestrating operational agent tasks. This gives us the flexibility of open-source software with low-code ease of use.

**Implementation Approach**:
- Deploy n8n via Docker container on Railway (free tier initially)
- Create workflow templates for each operational agent type
- Use n8n's built-in scheduler for recurring tasks
- Integrate with tRPC endpoints via HTTP requests/webhooks
- Store workflow definitions in version control as JSON
- Set up monitoring via n8n's execution logs and Railway metrics

**Why This Approach**:
1. **Cost-effective**: Free for self-hosted, $0 until we need scaling
2. **Flexibility**: Open-source allows customization and self-hosting
3. **Visual Workflows**: Low-code interface for future team members
4. **Rich Integrations**: 350+ pre-built nodes for common services
5. **Upgrade Path**: Can migrate to Zapier later if team prefers SaaS

**Example/Proof of Concept**:
```typescript
// n8n workflow structure (JSON)
{
  "nodes": [
    {
      "name": "Schedule Weekly Market Scan",
      "type": "n8n-nodes-base.cron",
      "parameters": { "cronExpression": "0 9 * * 1" }
    },
    {
      "name": "Call Market Analyst Agent",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "{{$env.APP_URL}}/api/trpc/agents.marketAnalyst",
        "method": "POST"
      }
    }
  ]
}
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences
- **Automated Operations**: Agents run on schedule without manual intervention
- **Visual Debugging**: Workflow execution history and logs in n8n UI
- **Low Cost**: Free tier covers initial needs, no vendor lock-in
- **Flexibility**: Full control over deployment and data processing
- **Team Enablement**: Non-developers can create/modify workflows via UI

### Negative Consequences
- **Infrastructure Management**: Need to maintain Docker container and updates
- **Setup Time**: Initial deployment and configuration takes 2-4 hours
- **Learning Curve**: Team needs to learn n8n's workflow syntax
- **Self-Hosted Responsibility**: We manage uptime, backups, security patches

### Neutral Consequences
- **Deployment Platform**: Adds Railway as additional infrastructure dependency
- **Monitoring**: Need to set up separate monitoring for n8n health checks

### Mitigation Strategies
- **Infrastructure Management**: Use Railway's managed platform features for auto-deploy and monitoring
- **Setup Time**: Create reusable workflow templates documented in `/docs/automation/`
- **Learning Curve**: Provide starter workflows and onboarding guide
- **Self-Hosted Responsibility**: Set up automated backups to Vercel Blob, enable Railway health checks

---

## Alternatives Considered

### Alternative 1: Zapier (SaaS Platform)

**Description**:
Use Zapier's hosted automation platform with pre-built integrations and visual workflow builder.

**Pros**:
- Zero infrastructure management (fully managed SaaS)
- Extremely easy setup (connect apps via OAuth)
- 5000+ integrations available
- Non-technical team members can create workflows

**Cons**:
- Cost: $20-100/month for necessary features (multi-step zaps, webhooks)
- Vendor lock-in: Workflows tied to Zapier platform
- Limited customization for complex data transformations
- Rate limits on lower tiers

**Why Not Chosen**:
Cost escalates quickly with usage, and vendor lock-in limits flexibility. We prefer to invest initial setup time for long-term cost savings and control.

---

### Alternative 2: Custom Cron Jobs with Vercel Cron

**Description**:
Build custom TypeScript functions deployed as Vercel Cron Jobs.

**Pros**:
- Full control over execution logic
- Native integration with our codebase
- No additional infrastructure
- Type-safe implementation

**Cons**:
- Every workflow requires code changes
- No visual debugging or execution history
- Higher development time per automation
- Vercel Cron limited to 1 cron per route on free tier

**Why Not Chosen**:
Development time is too high for operational tasks. Visual workflow tools allow faster iteration and team enablement.

---

### Alternative 3: GitHub Actions

**Description**:
Use GitHub Actions workflows with scheduled triggers.

**Pros**:
- Free for public repos, generous limits for private
- YAML-based workflows in version control
- Excellent CI/CD integration
- Built-in secrets management

**Cons**:
- Not designed for production operational tasks
- Harder to debug than visual workflow tools
- Limited to 15-minute execution time
- Requires code deployment for changes

**Why Not Chosen**:
GitHub Actions is better suited for CI/CD than operational workflows. Execution time limits and lack of visual debugging make it unsuitable for complex agent tasks.

---

## Related

**Related ADRs**:
- [ADR-001: Technology Stack Selection] - Defines Vercel deployment context
- [ADR-003: Redis Caching Strategy] - n8n can use Redis for rate limiting

**Related Documentation**:
- [docs/automation/n8n-setup.md] - Deployment guide (to be created)
- [docs/automation/workflow-templates.md] - Starter workflows (to be created)

**External References**:
- [n8n Documentation](https://docs.n8n.io/)
- [n8n Self-Hosting Guide](https://docs.n8n.io/hosting/)
- [Railway Deployment Guide](https://railway.app/template/n8n)

---

## Notes

**Decision Making Process**:
- Evaluated based on cost, flexibility, and team enablement
- Consulted n8n community examples and Railway template
- Decision date: 2025-11-16

**Review Schedule**:
- Revisit after 3 months of usage to evaluate operational costs
- Re-evaluate if team requests Zapier's ease of use over flexibility
- Monitor: n8n uptime, workflow execution success rate, monthly hosting cost

**Migration Plan**:
- **Phase 1 (Week 1)**: Deploy n8n container on Railway
- **Phase 2 (Week 2)**: Create 3 starter workflows (market scan, financial review, compliance check)
- **Phase 3 (Week 3)**: Document workflows and train team
- **Rollback**: Can migrate workflows to Zapier if needed (export as JSON, recreate manually)

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-16 | AI Agent | Initial draft and approval |
