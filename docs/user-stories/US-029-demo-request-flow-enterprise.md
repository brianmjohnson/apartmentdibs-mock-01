# US-029: Demo Request Flow for Enterprise Prospects [P2]

**Status**: Approved
**Priority**: P2 (Medium - Important for enterprise revenue, not MVP blocking)
**Sprint**: Sprint 4

---

## User Story

**As an** enterprise prospect (property management company with 50+ units or brokerage with 10+ agents)
**I want to** schedule a personalized demo with an ApartmentDibs representative
**So that** I can see how the platform addresses my specific needs and get custom pricing

---

## Context & Background

### Problem Statement

Enterprise buyers have complex requirements (multi-agent access, API integrations, custom branding, SLA guarantees) that can't be addressed through self-service. They need personalized demos and proposals.

### Business Rationale

- **High-Value Deals**: Enterprise deals $10K+ ARR
- **Sales Cycle**: 2-4 weeks, multiple demos
- **Use Cases**: Metro Property Management (75 agents), regional brokerages, institutional landlords

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 50 enterprise prospects per month
- **Impact**: 2 (High - high-value deals)
- **Confidence**: 80%
- **Effort**: 2 person-weeks

**RICE Score**: (50 x 2 x 0.8) / 2 = **40**

### Story Points

**Estimated Effort**: 8 story points (30-40 hours)

---

## Acceptance Criteria

### AC-1: Demo Request Form

**Given** enterprise prospect wants demo
**When** they access form
**Then** they provide:

**Required Fields**:

- Name
- Email (business email preferred)
- Phone
- Company name
- Role (dropdown): Property Manager, Leasing Agent, Brokerage Owner, Institutional Landlord, Other

**Qualifying Fields**:

- For agents: Team size (1-4, 5-19, 20-49, 50+)
- For landlords: Units managed (1-9, 10-49, 50-99, 100+)

**Context Fields**:

- Current tools used (checkboxes): RentSpree, AppFolio, Buildium, Zillow, Excel, Other
- Primary challenge (textarea): "What's your biggest pain point?"

**Verification**:

- [ ] Form validation works
- [ ] Required fields enforced
- [ ] Data captured completely

### AC-2: Calendar Integration

**Given** form is submitted
**When** prospect needs to schedule
**Then** they see:

- Calendly embed with available slots
- 30-min or 60-min demo options
- Time zone auto-detection
- Alternative: "Can't find a time? Call us at [phone]"

**Verification**:

- [ ] Calendly integration works
- [ ] Time zones handled
- [ ] Backup option visible

### AC-3: Confirmation & Follow-Up

**Given** demo is scheduled
**When** confirmation is sent
**Then** prospect receives:

**Confirmation Email**:

- Subject: "Your ApartmentDibs Demo is Scheduled"
- Date/time, Zoom link
- What to prepare
- Rep's name and photo

**Additional Items**:

- Calendar invite (ICS attachment)
- SMS reminder 1 hour before
- CRM entry created (HubSpot/Salesforce)

**Verification**:

- [ ] Email sends correctly
- [ ] Calendar invite works
- [ ] CRM lead created

### AC-4: Post-Demo Flow

**Given** demo is completed
**When** follow-up is needed
**Then** rep sends (within 24 hours):

- Demo recording (if permitted)
- Custom proposal PDF (pricing, SLA, timeline)
- Next steps: "Ready to start? Click here."

**Retargeting**: If no conversion in 7 days, send "Still interested?" email

**Verification**:

- [ ] Follow-up sequence defined
- [ ] Proposal template ready
- [ ] Retargeting emails configured

### AC-5: Enterprise-Specific Content

**Given** enterprise page content
**When** displayed
**Then** addresses concerns:

- Multi-agent team management
- API access for custom integrations
- 99.9% uptime SLA
- Dedicated account manager
- Volume discounts available

**Trust Signals**: "Trusted by 50+ property management companies"

**Verification**:

- [ ] Enterprise concerns addressed
- [ ] Social proof displayed
- [ ] Pricing transparency (or "contact sales")

### AC-6: Qualification Routing

**Given** prospect may not be enterprise
**When** team size is too small
**Then** route to self-service: "Based on your team size, our Professional tier may be best. Start your free trial here."

**Verification**:

- [ ] Qualification logic works
- [ ] Appropriate routing happens

---

## Technical Implementation Notes

### Routes

```
app/(public)/for-landlords/demo/page.tsx
app/(public)/for-agents/demo/page.tsx
```

### Integrations

- **Calendly API**: Embed scheduling, capture booking data
- **CRM Webhook**: Create lead in HubSpot/Salesforce
- **Email**: SendGrid or Customer.io for sequences

### Frontend Specification

**Components**:

```
components/
  demo/
    DemoRequestForm.tsx      - Form fields
    CalendlyEmbed.tsx        - Scheduling widget
    QualificationRouter.tsx  - Direct to appropriate path
```

---

## Analytics Tracking

| Event Name            | When Triggered   | Properties                 |
| --------------------- | ---------------- | -------------------------- |
| `demo_form_started`   | Form opened      | `{source}`                 |
| `demo_form_submitted` | Form completed   | `{companySize, role}`      |
| `demo_scheduled`      | Calendly booked  | `{prospectId, demoLength}` |
| `demo_completed`      | Meeting happened | `{prospectId, outcome}`    |
| `demo_converted`      | Signed up        | `{prospectId, dealValue}`  |

**Success Metrics**:

- 50% form-to-demo conversion
- 30% demo-to-customer conversion
- Average deal size $5,000 ARR

---

## Edge Cases

- **No-show**: Automated reschedule email
- **Not qualified**: Route to self-service
- **Requests on-site demo**: Sales arranges for deals >$10K ARR

---

## Dependencies

### Related Stories

- US-027: Landlord Marketing Hub
- US-028: Agent Marketing Hub

### External Dependencies

- Calendly
- CRM (HubSpot/Salesforce)

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer, Sales Operations
