# ADR-006: Defer Data Warehouse Until 100k+ Events/Month

**Status:** APPROVED
**Date:** 2025-11-16
**Author:** AI Agent

---

## Context

**What is the issue or problem we're solving?**

As we build analytics capabilities and business intelligence, we need to decide whether to implement a dedicated data warehouse immediately or defer until we have proven need. This decision impacts architecture complexity, costs, and our ability to run advanced analytics and investor reports.

**Background**:
- Neon PostgreSQL is our primary database with built-in analytics capabilities
- PostHog provides 90-day event retention on free tier
- Current data volume: <1000 events/day (MVP stage)
- No complex BI requirements yet (investor reports, multi-year analysis)
- Team has limited data engineering experience

**Requirements**:
- **Functional**: Store analytics events for >90 days
- **Functional**: Run SQL queries for business intelligence
- **Functional**: Generate reports for stakeholders/investors
- **Non-functional**: Query performance acceptable for reporting (<30s)
- **Non-functional**: Cost-effective for startup budget
- **Constraints**: Limited data engineering resources
- **Constraints**: Must support future growth to millions of events

**Scope**:
- **Included**: Short-term analytics and reporting strategy
- **Included**: Decision criteria for when to add data warehouse
- **Not included**: Real-time OLAP analytics (not needed for MVP)
- **Not included**: Complex data science pipelines (future consideration)

---

## Decision

**We will defer implementing a dedicated data warehouse until we reach 100k+ events per month. Until then, we will use Neon's built-in BI features for SQL analytics on our production database.**

Neon PostgreSQL provides SQL analytics capabilities directly on production data. PostHog retains 90 days of events (sufficient for MVP validation). We'll revisit this decision when event volume or BI complexity demands a dedicated warehouse.

**Implementation Approach**:
- Use Neon's BI-friendly features (read replicas, analytics queries)
- Export critical reports to CSV for archival if needed
- Leverage PostHog's built-in dashboards for product analytics
- Document BI queries in `queries/` directory for repeatability
- Set up monitoring to alert when we hit 100k events/month threshold
- Re-evaluate warehouse options when threshold is reached

**Why This Approach**:
1. **Simplicity**: No additional infrastructure to manage
2. **Cost-Effective**: Zero additional cost for analytics
3. **Sufficient**: Neon + PostHog cover MVP analytics needs
4. **Deferred Complexity**: Avoid over-engineering before we validate product
5. **Upgrade Path**: Clear criteria for when to add warehouse

**Example/Proof of Concept**:
```typescript
// Analytics query on Neon (direct Prisma)
export const getMonthlyActiveUsers = async (startDate: Date) => {
  return await prisma.$queryRaw`
    SELECT
      DATE_TRUNC('month', created_at) as month,
      COUNT(DISTINCT user_id) as mau
    FROM user_sessions
    WHERE created_at >= ${startDate}
    GROUP BY month
    ORDER BY month DESC
  `;
};

// PostHog for event-based analytics
// Use PostHog dashboard for:
// - Feature usage tracking
// - Funnel analysis
// - Retention cohorts
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences
- **Simple Architecture**: No ETL pipelines or data syncing to manage
- **Zero Cost**: No warehouse hosting fees ($0 vs $50-500/month)
- **Fast Iteration**: No data engineering overhead
- **Direct Access**: Query production data directly (for now)
- **Defer Decision**: Learn what analytics we actually need before committing

### Negative Consequences
- **Limited History**: PostHog only retains 90 days (may lose early insights)
- **Analytics Load**: Heavy queries could impact production database
- **Manual Exports**: Need manual process for long-term archival
- **Future Migration**: Will need to migrate when we add warehouse later

### Neutral Consequences
- **Query Performance**: Acceptable for MVP, may degrade with scale
- **BI Tool Limitations**: Can't use advanced BI tools (Tableau, Looker) easily

### Mitigation Strategies
- **Limited History**: Export critical reports monthly to Vercel Blob for archival
- **Analytics Load**: Use Neon read replicas for heavy queries (isolate from production)
- **Manual Exports**: Create cron job to export key metrics to CSV monthly
- **Future Migration**: Document schema and queries now for easier migration later

---

## Alternatives Considered

### Alternative 1: Snowflake Data Warehouse (Immediate)

**Description**:
Set up Snowflake data warehouse with daily ETL from Neon and PostHog.

**Pros**:
- Industry-standard data warehouse
- Excellent query performance at scale
- Rich BI tool integrations (Tableau, Looker, Mode)
- Designed for analytics workloads
- Handles petabyte-scale data

**Cons**:
- Overkill for <100k events/month
- Cost: $50-200/month minimum (plus engineering time)
- Need to build ETL pipelines (1-2 weeks setup)
- Ongoing maintenance burden
- Complexity for limited analytics needs

**Why Not Chosen**:
Massive over-engineering for MVP stage. We don't have enough data or BI requirements to justify Snowflake's complexity and cost.

---

### Alternative 2: BigQuery (Google Cloud)

**Description**:
Use Google BigQuery as serverless data warehouse with pay-per-query pricing.

**Pros**:
- Serverless (no infrastructure management)
- Pay-per-query model (cost-effective for low volume)
- Excellent for large-scale analytics
- Strong ML/AI integration
- Free tier (1 TB queries/month)

**Cons**:
- Still requires ETL setup and maintenance
- Adds Google Cloud dependency (we're on AWS/Vercel)
- Learning curve for BigQuery SQL dialect
- Unnecessary for current data volume
- Minimum $10-50/month with data ingestion

**Why Not Chosen**:
While more cost-effective than Snowflake, BigQuery still adds complexity we don't need. Neon can handle our current analytics requirements.

---

### Alternative 3: Custom ETL to S3 + Athena

**Description**:
Build custom ETL to export data to AWS S3, query with Athena.

**Pros**:
- Very cost-effective ($5-15/month)
- Full control over data format
- Athena is serverless and scalable
- S3 storage extremely cheap

**Cons**:
- Need to build custom ETL pipelines
- Athena query performance slower than dedicated warehouse
- More engineering effort than managed solutions
- Parquet format conversion required for performance

**Why Not Chosen**:
Engineering time to build ETL not justified for current analytics needs. Better to use that time building product features.

---

### Alternative 4: PostHog Data Export (Extended Retention)

**Description**:
Pay for PostHog's data export feature to retain events indefinitely.

**Pros**:
- Simple one-click setup
- Exports to S3/BigQuery automatically
- Managed by PostHog (no ETL to build)
- Extends PostHog event retention

**Cons**:
- PostHog export limited to event data (no transactional data)
- Still need separate solution for database analytics
- Cost increases with event volume
- Limited query flexibility compared to warehouse

**Why Not Chosen**:
Only solves half the problem (event data, not database analytics). Doesn't provide unified BI solution.

---

## Related

**Related ADRs**:
- [ADR-001: Technology Stack Selection] - Neon PostgreSQL chosen for database
- [ADR-005: PostHog for Analytics] - PostHog provides 90-day event retention

**Related Documentation**:
- [docs/analytics/bi-queries.md] - Reusable BI query library (to be created)
- [docs/analytics/export-strategy.md] - Data archival process (to be created)

**External References**:
- [Neon Analytics Features](https://neon.tech/docs/analytics)
- [PostHog Data Export](https://posthog.com/docs/data/batch-exports)
- [When to Add a Data Warehouse](https://www.startdataengineering.com/post/when-to-build-data-warehouse/)

---

## Notes

**Decision Making Process**:
- Evaluated current analytics requirements vs future needs
- Compared warehouse costs against expected event volume
- Consulted data engineering best practices for startups
- Decided to defer until proven need
- Decision date: 2025-11-16

**Review Schedule**:
- **Automatic Review Trigger**: Alert when we hit 100k events/month
- **Quarterly Check-in**: Review analytics complexity and BI requirements
- **Investor Reporting**: Re-evaluate if we need multi-year historical reports
- Monitor: Monthly event volume, query performance, analytics request complexity

**Criteria to Revisit**:
1. **Event Volume**: >100k events/month sustained
2. **BI Complexity**: Need for complex joins across 10+ tables
3. **Historical Analysis**: Investor requests for >1 year trends
4. **Query Performance**: Neon queries taking >30 seconds regularly
5. **Team Capacity**: Hire data engineer/analyst who can manage warehouse

**Migration Plan** (when threshold is met):
- **Phase 1 (Week 1)**: Evaluate Snowflake vs BigQuery vs Redshift
- **Phase 2 (Week 2)**: Set up warehouse and test ETL pipeline
- **Phase 3 (Week 3)**: Migrate historical data from exports
- **Phase 4 (Week 4)**: Set up daily ETL from Neon + PostHog
- **Phase 5 (Week 5)**: Migrate BI queries to warehouse, validate results
- **Phase 6 (Ongoing)**: Deprecate direct Neon analytics queries

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-16 | AI Agent | Initial draft and approval |
