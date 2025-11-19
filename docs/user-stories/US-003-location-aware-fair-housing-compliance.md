# US-003: Location-Aware Fair Housing Compliance [P0]

**Status**: Approved
**Priority**: P0 (Critical - Prevents platform liability, core compliance value prop)
**Sprint**: Sprint 1

---

## User Story

**As an** agent (Jessica)
**I want to** have the platform automatically adjust screening criteria based on local/state fair housing laws
**So that** I don't accidentally violate jurisdiction-specific regulations and face fines or lawsuits

---

## Context & Background

### Problem Statement

Fair housing laws vary significantly by jurisdiction:

- **NYC Fair Chance Act**: Cannot consider misdemeanors >3 years old, must use "direct relationship test" for felonies
- **San Francisco Fair Chance Ordinance**: Cannot ask about criminal history on initial application
- **California AB 2493**: Must accept Portable Tenant Screening Reports (PTSRs), fee caps apply
- **Seattle**: Cannot consider credit scores <600 if applicant offers co-signer

### Business Rationale

- **Legal Risk**: Agents managing properties in multiple jurisdictions face complex compliance matrix
- **Market Opportunity**: No competitor offers automated location-aware compliance
- **Competitive Advantage**: Platform acts as compliance shield

### User Pain Point

Jessica's perspective: "I lie awake at night wondering if I accidentally said something discriminatory. Even asking 'How many people will live here?' could be familial status discrimination. I need the platform to tell me what I can and can't ask."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 agents per month (estimated Month 3-6)
- **Impact**: 3 (Massive - prevents lawsuits, core value proposition)
- **Confidence**: 90% (regulations are documented, requires legal maintenance)
- **Effort**: 4 person-weeks

**RICE Score**: (500 x 3 x 0.9) / 4 = **337.5**

### Story Points

**Estimated Effort**: 21 story points (80-100 hours)

**Complexity Factors**:

- Technical complexity: High (rule engine, geolocation, dynamic filtering)
- UI complexity: Medium (compliance warnings, education modals)
- Integration complexity: Medium (Google Maps geocoding)
- Unknown factors: Regulatory update frequency, edge case jurisdictions

---

## Acceptance Criteria

### AC-1: Jurisdiction Detection

**Given** a landlord/agent creates a listing
**When** they enter the property address
**Then** the platform geolocates via Google Maps API to determine:

- City
- County
- State

**And** loads applicable regulations (e.g., "123 Main St, Brooklyn, NY" -> NYC, Kings County, New York State -> NYC Fair Chance Act, New York State Human Rights Law, Federal Fair Housing Act)

**Verification**:

- [ ] Address geocoding works for all US addresses
- [ ] Correct jurisdiction hierarchy determined
- [ ] All applicable laws identified and loaded
- [ ] Works for border addresses (apply most restrictive)

### AC-2: Compliance Rule Engine

**Given** jurisdiction-specific rules are stored in the database
**When** screening criteria are evaluated
**Then** the rule engine applies enforcement logic:

**Example Rules**:

- **NYC Fair Chance Act**: Block criminal history filters for misdemeanors >3 years old
- **California AB 2493**: Require PTSR acceptance, enforce fee cap ($62)
- **Seattle**: Allow co-signer override for credit scores <600

**Verification**:

- [ ] Rules stored in `compliance_rules` table with JSONB enforcement logic
- [ ] Rules include jurisdiction, type, description, logic, effective date, source URL
- [ ] Rule versioning for historical reference

### AC-3: Dynamic Screening Criteria Adjustment

**Given** a landlord/agent attempts to set screening criteria
**When** criteria violate local regulations
**Then** the platform blocks and adjusts automatically:

**Criminal History Example (NYC)**:

- Landlord attempts: "No criminal history"
- Platform blocks: "NYC Fair Chance Act restricts criminal history screening. Only violent felonies within 10 years can be considered. Adjusted your filter accordingly."
- Updated filter: "No violent felonies in past 10 years"

**Credit Score Example (Seattle)**:

- Landlord sets: "Minimum credit score 650"
- Applicant has 580 but offers co-signer with 750
- Platform: "Applicant meets Seattle Fair Chance criteria (co-signer provided). Accept application."

**Verification**:

- [ ] Discriminatory filters are blocked with explanation
- [ ] Filters auto-adjusted to compliant alternatives
- [ ] Co-signer override logic works correctly
- [ ] All adjustments logged in audit trail

### AC-4: Real-Time Regulatory Updates

**Given** fair housing laws change
**When** legal team updates `compliance_rules` table
**Then** affected landlords/agents receive notification:

- Push notification: "California AB 2493 updated: PTSR validity now 60 days. Your listings auto-updated to comply."
- No user action required (compliance is automatic)

**Verification**:

- [ ] Rule updates take effect immediately
- [ ] Affected users notified via push/email
- [ ] Listings auto-updated to comply
- [ ] Old rules archived with end_date

### AC-5: Education & Transparency

**Given** the platform blocks a discriminatory filter
**When** landlord/agent asks "Why was my filter blocked?"
**Then** a modal displays:

- Law name and citation (e.g., "NYC Fair Chance Act (Admin Code 5-204)")
- Plain-English explanation
- Link to official government source

**Verification**:

- [ ] Every blocked filter has educational modal
- [ ] Explanation is jargon-free
- [ ] Source links to official government pages
- [ ] "Learn more" expands to full law text

### AC-6: Override Prevention

**Given** a landlord/agent attempts to override compliance filter
**When** they try to bypass the restriction
**Then** the platform blocks: "You cannot override this rule due to legal requirements in [Jurisdiction]."

**And** logs the override attempt: "Landlord attempted to bypass NYC Fair Chance Act on [date]." (Evidence of willful violation if later sued)

**Verification**:

- [ ] Override attempts are blocked completely
- [ ] Warning message explains legal requirement
- [ ] All override attempts logged in audit trail
- [ ] Logs include timestamp, user ID, rule attempted to bypass

### AC-7: Border Jurisdiction Handling

**Given** a property is on the border of two jurisdictions
**When** compliance rules differ
**Then** the platform applies the most restrictive rules

**Example**: Property 0.1 mile into Westchester but near NYC border -> Apply NYC Fair Chance Act (most restrictive)

**Verification**:

- [ ] Border detection works correctly
- [ ] Most restrictive rules applied
- [ ] User notified which jurisdiction rules apply

### AC-8: Non-Functional Requirements

**Accuracy**:

- [ ] Compliance rules are 99.9%+ accurate (legal review required before deployment)

**Latency**:

- [ ] Rule evaluation completes in <500ms (real-time filter blocking)

**Auditability**:

- [ ] Every compliance rule application logged (prove platform enforced law if landlord later sued)

---

## Technical Implementation Notes

### Backend Specification

**Data Model** (compliance_rules table):

```sql
CREATE TABLE compliance_rules (
  id UUID PRIMARY KEY,
  jurisdiction VARCHAR(100), -- "NYC" or "California" or "Federal"
  rule_type VARCHAR(50), -- "criminal_history" or "credit_minimum" or "ptsr_acceptance"
  rule_description TEXT, -- "Cannot consider misdemeanors >3 years old"
  enforcement_logic JSONB, -- {type: "block_filter", params: {field: "criminal_history", condition: "misdemeanor_age > 3"}}
  effective_date DATE,
  end_date DATE, -- NULL if currently active
  source_url TEXT, -- Link to law text (e.g., NYC Admin Code 5-204)
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Index for fast jurisdiction lookup
CREATE INDEX idx_compliance_rules_jurisdiction ON compliance_rules(jurisdiction, rule_type, effective_date);
```

**Rule Evaluation Query**:

```sql
SELECT * FROM compliance_rules
WHERE jurisdiction IN ('Federal', 'New York State', 'NYC')
AND rule_type = 'criminal_history'
AND effective_date <= CURRENT_DATE
AND (end_date IS NULL OR end_date > CURRENT_DATE)
ORDER BY effective_date DESC;
```

**Business Logic**:

- `lib/services/compliance-engine.ts` - Rule evaluation and enforcement
- `lib/services/geocoding.ts` - Address to jurisdiction mapping
- `lib/services/compliance-education.ts` - Educational content retrieval

**External Dependencies**:

- Google Maps Geocoding API
- Legal team maintenance dashboard

**Database Changes**:

- [ ] `compliance_rules` table with JSONB enforcement logic
- [ ] `compliance_logs` table for audit trail
- [ ] `jurisdiction_mappings` table for geocode -> jurisdiction

### Frontend Specification

**Components**:

```
components/
  compliance/
    ComplianceWarning.tsx       - Block message with explanation
    ComplianceEducationModal.tsx - Full law explanation
    CriteriaAdjustmentBanner.tsx - Shows auto-adjusted criteria
    JurisdictionBadge.tsx       - Shows active jurisdiction rules
```

**Admin Dashboard**:

- Legal team can add/update rules without engineering deploy
- Rule preview and testing tools
- Affected listings report

### UI/UX Design

**Key Interactions**:

1. Agent sets filter -> Platform evaluates against jurisdiction rules
2. If violation detected -> Show warning, auto-adjust, log
3. Agent can view "Why blocked?" -> Educational modal
4. Agent cannot bypass compliance rules

**Visual Treatment**:

- Warning banners in yellow/orange
- Educational modals with law citations
- Compliance badge showing jurisdiction coverage

---

## Analytics Tracking

**Events to Track**:

| Event Name                      | When Triggered                 | Properties                                                     |
| ------------------------------- | ------------------------------ | -------------------------------------------------------------- |
| `compliance_check_performed`    | Filter evaluated against rules | `{agentId, listingId, jurisdiction, ruleCount}`                |
| `compliance_violation_blocked`  | Discriminatory filter blocked  | `{agentId, listingId, ruleType, originalValue, adjustedValue}` |
| `compliance_override_attempted` | User tries to bypass rule      | `{agentId, listingId, ruleType, blocked: true}`                |
| `compliance_education_viewed`   | User opens educational modal   | `{agentId, ruleType, jurisdiction}`                            |
| `compliance_rule_updated`       | Legal team updates rule        | `{ruleId, jurisdiction, changeType}`                           |

**Success Metrics**:

- 100% of discriminatory filters blocked before reaching applicants
- <1% compliance-related user complaints
- 0 fair housing violations attributed to platform compliance gaps

---

## Dependencies

### Blocks

- All screening-related features require compliance engine

### Blocked By

- None (foundational infrastructure)

### Related Stories

- US-001: PII Anonymization
- US-002: Automated Adverse Action Notices
- US-004: Audit Trail for Fair Housing Defense

### External Dependencies

- Google Maps Geocoding API
- Legal team for rule maintenance
- State/local government law sources

---

## Testing Requirements

### Unit Tests

- [ ] Geocoding address to jurisdiction
- [ ] Rule engine evaluation logic
- [ ] Filter adjustment algorithms
- [ ] Border case jurisdiction selection

### Integration Tests

- [ ] Complete filter -> check -> block flow
- [ ] Real-time rule updates propagation
- [ ] Audit log creation
- [ ] Educational modal content retrieval

### E2E Tests (Playwright)

```typescript
test('platform blocks discriminatory criminal history filter in NYC', async ({ page }) => {
  await page.goto('/landlord/listings/new')
  await page.fill('input[name="address"]', '123 Main St, Brooklyn, NY')

  // Try to set blanket criminal history filter
  await page.click('text=Screening Criteria')
  await page.check('input[name="no_criminal_history"]')

  // Verify blocking
  await expect(page.locator('text=NYC Fair Chance Act')).toBeVisible()
  await expect(page.locator('text=Only violent felonies within 10 years')).toBeVisible()

  // Verify auto-adjustment
  const adjustedFilter = await page.locator('input[name="criminal_filter"]').inputValue()
  expect(adjustedFilter).toBe('no_violent_felonies_10_years')
})
```

**Test Coverage Target**: 90% for compliance engine logic

---

## Security Considerations

**Access Control**:

- Only legal team can modify compliance rules
- Rule changes require approval workflow
- All rule changes logged

**Data Validation**:

- Rule enforcement logic validated before deployment
- Jurisdiction mappings verified against authoritative sources

**Potential Risks**:

- **Outdated rules** - Mitigate with legal team monitoring, quarterly reviews
- **Incorrect jurisdiction detection** - Mitigate with address verification, user confirmation
- **Rule logic errors** - Mitigate with testing environment, staged rollout

---

## Performance Considerations

**Expected Load**:

- 1,000+ compliance checks per day
- Rule evaluation on every filter change

**Optimization Strategies**:

- Cache jurisdiction mappings
- Pre-compile rule evaluation logic
- Index compliance_rules by jurisdiction

**Performance Targets**:

- Rule evaluation: <500ms
- Jurisdiction detection: <1 second
- Educational modal load: <500ms

---

## Rollout Plan

**Phase 1: Development** (Week 1-2)

- [ ] Compliance rule database schema
- [ ] Rule evaluation engine
- [ ] Geocoding integration

**Phase 2: Rule Population** (Week 2-3)

- [ ] Legal team populates initial rules (Federal, NY, CA)
- [ ] Rule testing and verification
- [ ] Educational content creation

**Phase 3: Integration** (Week 3)

- [ ] Filter blocking UI
- [ ] Educational modals
- [ ] Audit logging

**Phase 4: Testing** (Week 4)

- [ ] Unit and integration tests
- [ ] Legal review of all rules
- [ ] User acceptance testing

**Phase 5: Deployment**

- [ ] Deploy to staging with test jurisdictions
- [ ] Production deployment (NYC first)
- [ ] Monitor for compliance gaps

**Rollback Plan**:

- Feature flag to revert to manual compliance
- Rule versioning allows rollback to previous state

---

## Open Questions

- [x] **How often do fair housing laws change?**
  - **Answer**: Major changes 1-2x per year per jurisdiction; legal team monitors continuously

- [ ] **Should we support Canadian/international jurisdictions?**
  - **Answer**: TBD - US only for MVP

- [ ] **What if geocoding returns ambiguous results?**
  - **Answer**: Prompt user to confirm jurisdiction, default to most restrictive

---

## Notes & Updates

### Update Log

| Date       | Author          | Update                                                   |
| ---------- | --------------- | -------------------------------------------------------- |
| 2025-11-19 | Product Manager | Initial story creation from consolidated User_Stories.md |
| 2025-11-19 | -               | Approved - ready for implementation                      |

### Discussion Notes

- Compliance engine is foundational infrastructure for platform
- Legal team dashboard allows non-engineering rule updates
- "Most restrictive" approach for border cases provides safety margin
- Education component is key to user acceptance of filter restrictions

---

## Related Documentation

- **Business Plan**: `docs/Business_Plan_and_GTM.md` - Regulatory compliance opportunity
- **NYC Fair Chance Act**: NYC Admin Code 5-204
- **California AB 2493**: PTSR requirements
- **Federal Fair Housing Act**: 42 USC 3601-3619
- **ADR-019**: Compliance Rule Engine Architecture - JSONB-based rule engine with geocoding
- **ADR-017**: Immutable Audit Trail - Compliance check logging

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer, Frontend Developer
**Reviewer**: Architecture Agent, Compliance Agent
