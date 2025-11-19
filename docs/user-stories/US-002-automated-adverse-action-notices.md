# US-002: Automated Adverse Action Notices [P0]

**Status**: Approved
**Priority**: P0 (Critical - Legal requirement, prevents lawsuits)
**Sprint**: Sprint 1

---

## User Story

**As a** landlord (David)
**I want to** have the platform automatically generate FCRA-compliant adverse action letters when I deny an applicant
**So that** I meet legal requirements without hiring an attorney and avoid fair housing lawsuits

---

## Context & Background

### Problem Statement

FCRA requires landlords to send adverse action letters within 7-14 days (varies by state) when denying based on credit/background check. 50%+ of landlords never send adverse action letters (either unaware of requirement or don't want to admit denial reason).

### Business Rationale

- **Legal Risk**: Failure to send = FCRA violation = $100-$1,000 per violation + tenant can sue for actual damages
- **Market Opportunity**: Most landlords are unaware of this requirement, creating massive liability
- **Competitive Advantage**: Automate compliance, reduce landlord anxiety

### User Pain Point

David's perspective: "I don't even know what I don't know. I might be violating fair housing law right now and not realize it until I get sued."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 landlord denials per month (estimated Month 3-6)
- **Impact**: 3 (Massive - legal compliance, core value proposition)
- **Confidence**: 100% (FCRA is federal law, absolute requirement)
- **Effort**: 2 person-weeks

**RICE Score**: (1000 x 3 x 1.0) / 2 = **1,500**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

**Complexity Factors**:
- Technical complexity: Medium (template generation, validation logic)
- UI complexity: Low (dropdown selections, letter preview)
- Integration complexity: Medium (email/SMS/mail delivery)
- Unknown factors: State-specific variations in requirements

---

## Acceptance Criteria

### AC-1: Denial Reason Selection

**Given** a landlord is denying an applicant
**When** they initiate the denial action
**Then** the platform prompts with required denial reason dropdown:
- Pre-vetted compliance-safe options:
  - "Another applicant had higher income-to-rent ratio"
  - "Another applicant had higher credit score"
  - "Another applicant offered longer lease term"
  - "Applicant's income-to-rent ratio below my threshold"
  - "Applicant's credit score below my threshold"
  - "Applicant had eviction history within my restriction period"
- Disabled options that create liability:
  - "Personal preference"
  - "Applicant seemed nervous during showing"

**Verification**:
- [ ] Denial reason is required field
- [ ] Only compliance-safe options are selectable
- [ ] Liability-risk options are disabled with explanation

### AC-2: Adverse Action Letter Auto-Generation

**Given** a landlord has selected a denial reason
**When** the denial is confirmed
**Then** the platform generates FCRA-compliant letter within 1 hour containing:
- Header: "Notice of Adverse Action" (FCRA required language)
- Body: "You were not selected for [Address] because [landlord's selected reason]."
- Credit bureau info (if credit was factor): "Your credit report was obtained from TransUnion. Contact: [TransUnion phone/address]."
- Dispute rights: "You have the right to obtain a free copy of your credit report within 60 days and dispute any inaccuracies."
- Fair Housing notice: "This decision complied with Fair Housing Act requirements. All applicants were evaluated using identical criteria."

**Verification**:
- [ ] Letter generated within 1 hour of denial
- [ ] All FCRA-required elements included (15 USC 1681m(a))
- [ ] Letter content accurate to selected reason
- [ ] Credit bureau info only included if credit was factor

### AC-3: Denial Reason Validation

**Given** a landlord selects a denial reason
**When** the reason is submitted
**Then** the platform validates against actual facts:
- If "Another applicant had higher credit score" -> Check if selected applicant had higher credit
- If "Income below threshold" -> Check if applicant met landlord's stated minimum

**And** if validation fails, block denial reason with message: "This reason is factually incorrect. Select accurate reason."

**Verification**:
- [ ] System validates reason against applicant data
- [ ] Invalid reasons are blocked with clear message
- [ ] Landlord must select accurate reason to proceed

### AC-4: Delivery Channels

**Given** an adverse action letter is generated
**When** delivery is initiated
**Then** the letter is sent via:
- Email (primary) within 24 hours
- SMS notification within 24 hours
- Certified mail if email bounces (using address from application)

**Verification**:
- [ ] Email delivered within 24 hours
- [ ] SMS notification sent within 24 hours
- [ ] Certified mail sent if email bounces
- [ ] Delivery receipts tracked and logged

### AC-5: Delivery Confirmation Tracking

**Given** adverse action letters are sent
**When** delivery attempts complete
**Then** the platform logs:
- Email open rate and delivery status
- SMS delivery status
- Certified mail tracking number

**And** the landlord can view: "Adverse action letter sent to Applicant #2847 on [date] at [time]. Delivery confirmed: [Yes/No]."

**Verification**:
- [ ] Email open tracking enabled
- [ ] SMS delivery confirmation logged
- [ ] All delivery attempts archived for 3 years
- [ ] Landlord dashboard shows delivery status

### AC-6: Edge Case Handling

**Given** various edge cases
**When** processing denials
**Then** the system correctly handles:
- Multiple denial reasons: List all reasons in priority order
- Credit not used in decision: Omit credit bureau info from letter
- Stated criteria contradictions: Auto-generate accurate reason based on criteria mismatch

**Verification**:
- [ ] Multiple reasons listed in priority order
- [ ] Credit info only included when relevant
- [ ] Automatic correction of contradictory reasons

### AC-7: Non-Functional Requirements

**Compliance**:
- [ ] Letters meet all FCRA 15 USC 1681m(a) requirements
- [ ] Letters sent within 24 hours (exceeds 7-14 day FCRA requirement)
- [ ] All letters archived for 3 years (accessible to landlord, tenant, regulators)

**Performance**:
- [ ] Letter generation completes in <10 seconds
- [ ] Email delivery within 1 hour

**Security**:
- [ ] Letters contain only necessary PII
- [ ] Archive encrypted at rest

---

## Technical Implementation Notes

### Backend Specification

**Letter Template** (Markdown with variable interpolation):

```markdown
# Notice of Adverse Action

Dear {{applicant_name}},

Thank you for applying to {{property_address}}. After careful review, we have selected another applicant.

**Reason for Denial:**
{{denial_reason}}

{{#if credit_used}}
**Credit Report Information:**
Your credit report was obtained from {{credit_bureau_name}}.
Contact: {{credit_bureau_contact}}
{{/if}}

**Your Rights:**

- You have the right to obtain a free copy of your credit report within 60 days.
- You have the right to dispute any inaccuracies in your credit report.

**Fair Housing Compliance:**
This decision complied with Fair Housing Act requirements. All applicants were evaluated using identical, objective criteria. A complete audit trail is maintained for 3 years.

Sincerely,
{{landlord_name}} via ApartmentDibs
```

**API Endpoints**:
- `POST /api/denials` - Create denial with reason
- `GET /api/denials/{id}/letter` - Get generated letter
- `POST /api/denials/{id}/send` - Trigger delivery

**Business Logic**:
- `lib/services/adverse-action.ts` - Letter generation and validation
- `lib/services/delivery.ts` - Multi-channel delivery orchestration

**External Dependencies**:
- SendGrid API for email delivery
- Twilio API for SMS
- Lob API for certified mail

**Database Changes**:
- [ ] `adverse_action_logs` table for tracking
- [ ] Letter templates table with versioning
- [ ] Delivery tracking table

### Frontend Specification

**Components**:
```
components/
  denial/
    DenialReasonSelector.tsx    - Dropdown with validation
    AdverseActionPreview.tsx    - Letter preview before send
    DeliveryStatusTracker.tsx   - Delivery confirmation display
```

**Routing**:
- `/landlord/applications/[listingId]` - Deny button triggers flow
- `/landlord/denials` - View sent adverse action letters

---

## Analytics Tracking

**Events to Track**:

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `denial_initiated` | Landlord starts denial flow | `{landlordId, applicantId, listingId}` |
| `denial_reason_selected` | Reason selected from dropdown | `{landlordId, applicantId, reason}` |
| `adverse_action_generated` | Letter generated | `{landlordId, applicantId, letterId}` |
| `adverse_action_sent` | Letter delivered | `{landlordId, applicantId, channel, success}` |
| `adverse_action_opened` | Tenant opens email | `{applicantId, letterId, timestamp}` |

**Success Metrics**:
- 100% of denials include FCRA-compliant letter
- 95%+ of letters delivered successfully within 24 hours
- Average letter generation time <10 seconds

---

## Dependencies

### Blocks
- US-006: CRM Auto-Matching (denied applicants enter CRM after adverse action)

### Blocked By
- US-001: PII Anonymization (need applicant data for letters)
- US-004: Audit Trail (letters reference audit log)

### Related Stories
- US-003: Location-Aware Fair Housing Compliance
- US-004: Audit Trail for Fair Housing Defense

### External Dependencies
- SendGrid API account
- Twilio API account
- Lob API account (certified mail)

---

## Testing Requirements

### Unit Tests
- [ ] Letter template variable interpolation
- [ ] Denial reason validation logic
- [ ] Credit bureau info conditional inclusion
- [ ] Multiple reasons formatting

### Integration Tests
- [ ] Complete denial flow end-to-end
- [ ] Email delivery via SendGrid
- [ ] SMS delivery via Twilio
- [ ] Audit log creation

### E2E Tests (Playwright)
```typescript
test('landlord can deny applicant with adverse action letter', async ({ page }) => {
  await page.goto('/landlord/applications/listing-123')
  await page.click('button:has-text("Deny")')
  await page.selectOption('select[name="reason"]', 'income_below_threshold')
  await page.click('button:has-text("Confirm Denial")')

  // Verify letter preview
  await expect(page.locator('text=Notice of Adverse Action')).toBeVisible()
  await page.click('button:has-text("Send Letter")')

  // Verify confirmation
  await expect(page.locator('text=Adverse action letter sent')).toBeVisible()
})
```

**Test Coverage Target**: 85% for adverse action logic

---

## Security Considerations

**Access Control**:
- Only landlord who owns listing can initiate denial
- Tenant can access their own adverse action letters
- Admin access for compliance audits

**Data Validation**:
- Denial reason must match pre-approved options
- Applicant ID must be valid for listing
- Letter content sanitized before generation

**Potential Risks**:
- **Incorrect reason selected** - Mitigate with validation against actual data
- **Letter not delivered** - Mitigate with multiple channels and retry logic
- **Legal challenge to letter content** - Mitigate with legal review of templates

---

## Performance Considerations

**Expected Load**:
- 100-300 denials per day initially
- Peak: 50 concurrent denial processes

**Optimization Strategies**:
- Pre-compile letter templates
- Async delivery processing (queue-based)
- Cache credit bureau contact information

**Performance Targets**:
- Letter generation: <10 seconds
- Email delivery: <1 hour
- Dashboard update: Real-time

---

## Rollout Plan

**Phase 1: Development** (Week 1)
- [ ] Letter template system
- [ ] Denial reason validation
- [ ] Basic letter generation

**Phase 2: Integration** (Week 2)
- [ ] SendGrid email integration
- [ ] Twilio SMS integration
- [ ] Delivery tracking

**Phase 3: Testing** (Week 3)
- [ ] Unit and integration tests
- [ ] Legal review of templates
- [ ] User acceptance testing

**Phase 4: Deployment**
- [ ] Deploy to staging
- [ ] Production deployment
- [ ] Monitor delivery rates

**Rollback Plan**:
- Feature flag to disable automatic sending
- Manual letter generation fallback

---

## Open Questions

- [ ] **Should we support multiple languages for letters?**
  - **Answer**: TBD - Consider for future localization

- [ ] **What happens if landlord wants to customize letter text?**
  - **Answer**: Allow limited customization while maintaining required elements

---

## Notes & Updates

### Update Log

| Date | Author | Update |
|------|--------|--------|
| 2025-11-19 | Product Manager | Initial story creation from consolidated User_Stories.md |
| 2025-11-19 | - | Approved - ready for implementation |

### Discussion Notes

- Exceeding FCRA timeline requirements (24 hours vs 7-14 days) is a key differentiator
- Validation logic prevents landlords from selecting inaccurate reasons
- Multi-channel delivery ensures compliance even if one channel fails

---

## Related Documentation

- **Business Plan**: `docs/Business_Plan_and_GTM.md` - Compliance value proposition
- **FCRA Reference**: 15 USC 1681m(a) - Adverse action requirements
- **Template**: Letter templates stored in `lib/templates/adverse-action/`
- **ADR-018**: Multi-Channel Notification Delivery - Email, SMS, certified mail delivery architecture
- **ADR-004**: Email Templating with Resend - Email delivery foundation
- **ADR-017**: Immutable Audit Trail - Delivery tracking and compliance logging

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer
**Reviewer**: Architecture Agent, Compliance Agent
