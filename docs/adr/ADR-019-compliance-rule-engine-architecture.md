# ADR-019: Compliance Rule Engine Architecture for Location-Aware Fair Housing

**Status:** APPROVED
**Date:** 2025-11-19
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

User Story US-003 (Location-Aware Fair Housing Compliance) requires an automated system to enforce jurisdiction-specific fair housing regulations when landlords set screening criteria. Rules vary significantly by location (NYC Fair Chance Act, California AB 2493, Seattle co-signer rules, etc.) and must be dynamically applied based on property address. The system must block discriminatory filters, auto-adjust criteria, and provide educational explanations.

**Background**:

- Fair housing laws vary by federal/state/city jurisdiction
- NYC Fair Chance Act restricts criminal history screening
- California AB 2493 requires PTSR acceptance and fee caps
- Seattle allows co-signer overrides for low credit scores
- Current approach: No compliance enforcement
- Risk: Platform and landlords face fair housing lawsuits

**Requirements**:

- **Functional**: Detect property jurisdiction from address (geocoding)
- **Functional**: Store and evaluate compliance rules per jurisdiction
- **Functional**: Block discriminatory screening criteria with explanation
- **Functional**: Auto-adjust filters to compliant alternatives
- **Functional**: Log all compliance actions for audit trail
- **Functional**: Allow legal team to update rules without code deployment
- **Non-functional**: Rule evaluation <500ms (real-time blocking)
- **Non-functional**: 99.9% rule accuracy (legal-reviewed)
- **Non-functional**: No false negatives (never allow discriminatory criteria)
- **Constraints**: Must integrate with Google Maps Geocoding API
- **Constraints**: Must be maintainable by legal team (not engineers)

**Scope**:

- **Included**: Rule engine, geocoding, filter blocking, education modals
- **Included**: Admin dashboard for legal team rule management
- **Not included**: International jurisdictions (US only for MVP)
- **Not included**: Predictive compliance (only enforce known rules)

---

## Decision

**We will implement a JSONB-based rule engine in PostgreSQL with a hierarchical jurisdiction resolution system, geocoding integration, and admin dashboard for legal team rule management.**

Rules are stored with JSONB enforcement logic allowing complex conditions without code changes. Jurisdiction hierarchy (Federal > State > City/County) determines which rules apply, with most restrictive winning in conflicts. The legal team can add/modify rules via admin UI with staging environment testing.

**Implementation Approach**:

- Create `compliance_rules` table with JSONB enforcement logic
- Create `jurisdiction_mappings` table for geocode -> jurisdiction lookup
- Implement rule evaluation engine with hierarchy resolution
- Cache jurisdiction mappings in Redis for performance
- Build admin dashboard for legal team rule management
- Integrate with Google Maps Geocoding API for address resolution
- Log all compliance actions to ADR-017 audit trail

**Why This Approach**:

1. **Flexibility**: JSONB rules handle complex conditions without code changes
2. **Hierarchy**: Properly handles overlapping jurisdictions
3. **Legal Team Ownership**: Non-engineers can manage rules
4. **Performance**: Rule caching and efficient queries
5. **Auditability**: Full logging of all compliance decisions

**Example/Proof of Concept**:

```typescript
// lib/services/compliance-engine.ts
import { prisma } from '@/lib/db'
import { Redis } from '@upstash/redis'

interface ComplianceRule {
  id: string
  jurisdiction: string
  jurisdictionLevel: 'federal' | 'state' | 'county' | 'city'
  ruleType: string
  ruleDescription: string
  enforcementLogic: {
    type: 'block_filter' | 'adjust_filter' | 'require_field' | 'cap_value'
    field: string
    condition: Record<string, unknown>
    adjustedValue?: unknown
    message: string
  }
  educationContent: {
    lawName: string
    citation: string
    explanation: string
    sourceUrl: string
  }
  effectiveDate: Date
  endDate?: Date
}

interface ComplianceCheckResult {
  passed: boolean
  violations: Array<{
    ruleId: string
    ruleType: string
    originalValue: unknown
    adjustedValue?: unknown
    message: string
    education: ComplianceRule['educationContent']
  }>
  adjustedCriteria?: Record<string, unknown>
}

export class ComplianceEngine {
  private redis: Redis

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL!,
      token: process.env.UPSTASH_REDIS_TOKEN!,
    })
  }

  /**
   * Get jurisdictions for an address using geocoding
   */
  async getJurisdictions(address: string): Promise<string[]> {
    // Check cache first
    const cacheKey = `jurisdiction:${address}`
    const cached = await this.redis.get<string[]>(cacheKey)
    if (cached) return cached

    // Geocode address
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    const geocodeData = await geocodeResponse.json()

    if (!geocodeData.results?.[0]) {
      throw new Error('Unable to geocode address')
    }

    // Extract jurisdiction components
    const components = geocodeData.results[0].address_components
    const jurisdictions: string[] = ['Federal'] // Always include federal

    for (const component of components) {
      if (component.types.includes('administrative_area_level_1')) {
        // State
        jurisdictions.push(component.long_name)
      }
      if (component.types.includes('administrative_area_level_2')) {
        // County
        jurisdictions.push(component.long_name)
      }
      if (component.types.includes('locality')) {
        // City
        jurisdictions.push(component.long_name)
      }
    }

    // Cache for 24 hours
    await this.redis.set(cacheKey, jurisdictions, { ex: 86400 })

    return jurisdictions
  }

  /**
   * Check screening criteria against compliance rules
   */
  async checkCompliance(
    address: string,
    criteria: Record<string, unknown>,
    applicantData?: Record<string, unknown>
  ): Promise<ComplianceCheckResult> {
    const jurisdictions = await this.getJurisdictions(address)

    // Get applicable rules
    const rules = await prisma.complianceRule.findMany({
      where: {
        jurisdiction: { in: jurisdictions },
        effectiveDate: { lte: new Date() },
        OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
      },
      orderBy: [
        // Order by specificity (city > county > state > federal)
        { jurisdictionLevel: 'desc' },
        { effectiveDate: 'desc' },
      ],
    })

    const violations: ComplianceCheckResult['violations'] = []
    const adjustedCriteria = { ...criteria }

    // Evaluate each rule
    for (const rule of rules) {
      const evaluation = this.evaluateRule(rule, criteria, applicantData)

      if (!evaluation.passed) {
        violations.push({
          ruleId: rule.id,
          ruleType: rule.ruleType,
          originalValue: evaluation.originalValue,
          adjustedValue: evaluation.adjustedValue,
          message: evaluation.message,
          education: rule.educationContent,
        })

        // Apply adjustment if provided
        if (evaluation.adjustedValue !== undefined) {
          adjustedCriteria[rule.enforcementLogic.field] = evaluation.adjustedValue
        }
      }
    }

    // Log compliance check to audit trail
    await this.logComplianceCheck(address, jurisdictions, criteria, violations)

    return {
      passed: violations.length === 0,
      violations,
      adjustedCriteria: violations.length > 0 ? adjustedCriteria : undefined,
    }
  }

  /**
   * Evaluate a single rule against criteria
   */
  private evaluateRule(
    rule: ComplianceRule,
    criteria: Record<string, unknown>,
    applicantData?: Record<string, unknown>
  ): {
    passed: boolean
    originalValue?: unknown
    adjustedValue?: unknown
    message: string
  } {
    const { enforcementLogic } = rule
    const criteriaValue = criteria[enforcementLogic.field]

    switch (enforcementLogic.type) {
      case 'block_filter': {
        // Block if filter matches condition
        // Example: Block "no_criminal_history" filter in NYC
        if (this.matchesCondition(criteriaValue, enforcementLogic.condition)) {
          return {
            passed: false,
            originalValue: criteriaValue,
            adjustedValue: enforcementLogic.adjustedValue,
            message: enforcementLogic.message,
          }
        }
        break
      }

      case 'adjust_filter': {
        // Adjust filter value to compliant alternative
        // Example: "no criminal history" -> "no violent felonies in 10 years"
        if (this.matchesCondition(criteriaValue, enforcementLogic.condition)) {
          return {
            passed: false,
            originalValue: criteriaValue,
            adjustedValue: enforcementLogic.adjustedValue,
            message: enforcementLogic.message,
          }
        }
        break
      }

      case 'require_field': {
        // Require certain fields to be present/accepted
        // Example: California requires PTSR acceptance
        if (!criteriaValue || criteriaValue === false) {
          return {
            passed: false,
            originalValue: criteriaValue,
            adjustedValue: true,
            message: enforcementLogic.message,
          }
        }
        break
      }

      case 'cap_value': {
        // Cap maximum value
        // Example: California application fee cap $62
        const maxValue = enforcementLogic.condition.max as number
        if (typeof criteriaValue === 'number' && criteriaValue > maxValue) {
          return {
            passed: false,
            originalValue: criteriaValue,
            adjustedValue: maxValue,
            message: enforcementLogic.message,
          }
        }
        break
      }
    }

    return { passed: true, message: '' }
  }

  /**
   * Check if value matches condition
   */
  private matchesCondition(value: unknown, condition: Record<string, unknown>): boolean {
    // Simple condition matching - can be extended
    if (condition.equals !== undefined) {
      return value === condition.equals
    }
    if (condition.in !== undefined && Array.isArray(condition.in)) {
      return condition.in.includes(value)
    }
    if (condition.exists !== undefined) {
      return condition.exists ? value !== undefined : value === undefined
    }
    if (condition.greaterThan !== undefined) {
      return typeof value === 'number' && value > (condition.greaterThan as number)
    }
    return false
  }

  /**
   * Log compliance check to audit trail
   */
  private async logComplianceCheck(
    address: string,
    jurisdictions: string[],
    criteria: Record<string, unknown>,
    violations: ComplianceCheckResult['violations']
  ): Promise<void> {
    await prisma.complianceLog.create({
      data: {
        address,
        jurisdictions,
        criteriaChecked: criteria,
        violationsFound: violations,
        timestamp: new Date(),
      },
    })
  }

  /**
   * Check if override attempt should be blocked
   */
  async blockOverrideAttempt(userId: string, ruleId: string, address: string): Promise<void> {
    // Log the override attempt (evidence of willful violation)
    await prisma.complianceOverrideAttempt.create({
      data: {
        userId,
        ruleId,
        address,
        timestamp: new Date(),
        blocked: true,
      },
    })

    // Could trigger alert to compliance team for repeat offenders
  }
}

// Database schema for compliance rules
/*
CREATE TABLE compliance_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction VARCHAR(100) NOT NULL,
  jurisdiction_level VARCHAR(20) NOT NULL, -- 'federal', 'state', 'county', 'city'
  rule_type VARCHAR(50) NOT NULL,
  rule_description TEXT NOT NULL,
  enforcement_logic JSONB NOT NULL,
  education_content JSONB NOT NULL,
  effective_date DATE NOT NULL,
  end_date DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_level CHECK (jurisdiction_level IN ('federal', 'state', 'county', 'city'))
);

-- Index for fast jurisdiction lookup
CREATE INDEX idx_compliance_rules_jurisdiction
ON compliance_rules(jurisdiction, rule_type, effective_date DESC);

-- Example rule: NYC Fair Chance Act
INSERT INTO compliance_rules (
  jurisdiction,
  jurisdiction_level,
  rule_type,
  rule_description,
  enforcement_logic,
  education_content,
  effective_date
) VALUES (
  'New York',
  'city',
  'criminal_history',
  'Cannot consider misdemeanors older than 3 years',
  '{
    "type": "block_filter",
    "field": "criminal_history_filter",
    "condition": {"in": ["no_criminal_history", "no_misdemeanors"]},
    "adjustedValue": "no_violent_felonies_10_years",
    "message": "NYC Fair Chance Act restricts criminal history screening. Adjusted to: No violent felonies in past 10 years."
  }',
  '{
    "lawName": "NYC Fair Chance Act",
    "citation": "NYC Admin Code 8-107(11-a)",
    "explanation": "The Fair Chance Act prohibits landlords from considering most misdemeanors older than 3 years and requires a direct relationship test for felonies.",
    "sourceUrl": "https://www1.nyc.gov/site/cchr/law/fair-chance-act.page"
  }',
  '2015-10-27'
);
*/
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences

- **Legal Protection**: Platform prevents landlords from violating fair housing laws
- **Automatic Compliance**: No manual research required by landlords
- **Legal Team Ownership**: Rules managed without engineering involvement
- **Education**: Users learn why criteria are blocked, not just that they're blocked
- **Audit Trail**: Complete record of compliance enforcement for legal defense
- **Scalability**: New jurisdictions added via data, not code

### Negative Consequences

- **Rule Maintenance**: Legal team must monitor regulatory changes
- **Edge Cases**: Complex rules may require custom enforcement logic
- **False Positives**: Overly aggressive rules may frustrate landlords
- **Geocoding Costs**: Google Maps API charges per request
- **Rule Testing**: New rules need testing before production

### Neutral Consequences

- **Legal Review**: All rules require legal team sign-off
- **Performance Trade-off**: Rule evaluation adds latency to filter changes

### Mitigation Strategies

- **Rule Maintenance**: Subscribe to legal updates, quarterly rule audits
- **Edge Cases**: Support custom JavaScript conditions for complex rules
- **False Positives**: User feedback mechanism, rule refinement process
- **Geocoding Costs**: Aggressive caching (addresses rarely change)
- **Rule Testing**: Staging environment with rule preview

---

## Alternatives Considered

### Alternative 1: Hardcoded Rules in Application

**Description**:
Implement compliance rules directly in application code.

**Pros**:

- Full control over logic
- Type-safe rule implementation
- No external data dependencies
- Fast evaluation

**Cons**:

- Requires code deployment for rule changes
- Legal team cannot manage rules
- Difficult to audit rule changes
- Slow response to regulatory updates

**Why Not Chosen**:
Compliance rules change frequently and legal team must be able to update without engineering involvement. Data-driven approach essential.

---

### Alternative 2: External Rules Engine (Drools, OpenRules)

**Description**:
Use enterprise business rules management system (BRMS).

**Pros**:

- Purpose-built for complex rules
- Sophisticated rule management UI
- Industry-proven solutions
- Decision tables and workflows

**Cons**:

- Expensive licensing ($10k+/year)
- Complex integration
- Learning curve for legal team
- Overkill for our rule complexity

**Why Not Chosen**:
Enterprise BRMS is expensive and complex for our relatively simple rule needs. JSONB rules with custom UI is sufficient.

---

### Alternative 3: GraphQL-based Rule Schema

**Description**:
Define rules as GraphQL schemas with custom resolvers.

**Pros**:

- Type-safe rule definitions
- GraphQL tooling ecosystem
- Self-documenting
- Flexible querying

**Cons**:

- Not intuitive for legal team
- Requires GraphQL expertise
- Complex for simple rules
- No clear advantage over JSONB

**Why Not Chosen**:
GraphQL adds complexity without clear benefit. JSONB is simpler and more flexible for non-technical users.

---

### Alternative 4: Third-Party Compliance API

**Description**:
Use external compliance service that provides jurisdiction rules.

**Pros**:

- Rules maintained by experts
- Always up to date
- No internal maintenance
- Legal liability transferred

**Cons**:

- No suitable vendor exists for rental compliance
- High cost if it existed
- External dependency for critical function
- Cannot customize rules

**Why Not Chosen**:
No suitable third-party exists for rental-specific fair housing rules. Custom solution required.

---

## Related

**Related ADRs**:

- [ADR-017: Immutable Audit Trail] - Compliance checks logged for legal defense
- [ADR-003: Redis Caching Strategy] - Cache jurisdiction mappings

**Related Documentation**:

- [User Story US-003] - Location-Aware Fair Housing Compliance
- [docs/compliance/rule-management.md] - Admin guide (to be created)
- [docs/compliance/jurisdiction-list.md] - Supported jurisdictions (to be created)

**External References**:

- [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- [NYC Fair Chance Act](https://www1.nyc.gov/site/cchr/law/fair-chance-act.page)
- [California AB 2493](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=201720180AB2493)
- [Fair Housing Act](https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_act_overview)

---

## Notes

**Decision Making Process**:

- Analyzed jurisdiction complexity across US
- Evaluated rule engine options
- Consulted fair housing regulatory sources
- Decision date: 2025-11-19

**Initial Jurisdiction Coverage**:

- Federal (Fair Housing Act)
- New York State
- New York City (Fair Chance Act)
- California (AB 2493, AB 1482)
- Seattle
- Additional jurisdictions added as needed

**Cost Estimate**:

- Google Maps Geocoding: ~$5/month (1,000 requests at $5/1k)
- PostgreSQL storage: Minimal (rules are small)
- Total: <$10/month

**Review Schedule**:

- Legal team reviews rules quarterly
- Monitor blocked filters monthly
- User feedback review weekly

**Migration Plan**:

- **Phase 1**: Create database schema and rule engine (Week 1)
- **Phase 2**: Implement geocoding integration (Week 1)
- **Phase 3**: Build admin dashboard for legal team (Week 2)
- **Phase 4**: Populate initial rules (Federal, NY, CA) (Week 2-3)
- **Phase 5**: Integrate with screening criteria UI (Week 3)
- **Rollback**: Feature flag to disable compliance enforcement

---

## Revision History

| Date       | Author             | Change                      |
| ---------- | ------------------ | --------------------------- |
| 2025-11-19 | Architecture Agent | Initial creation for US-003 |
