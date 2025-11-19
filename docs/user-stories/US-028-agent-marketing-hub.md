# US-028: Agent Marketing Hub with Pricing, FAQ, Case Studies [P1]

**Status**: Approved
**Priority**: P1 (High - Agent acquisition drives network effect)
**Sprint**: Sprint 2

---

## User Story

**As an** agent prospect (Jessica)
**I want a** dedicated marketing hub that shows me how ApartmentDibs will help me close more leases, save time, and grow my business
**So that** I can calculate the ROI and justify the subscription cost to my brokerage

---

## Context & Background

### Problem Statement

Agents are time-starved and commission-driven. They need to see concrete time savings and revenue impact, not just features.

### Business Rationale

- **Network Effect**: Agents bring landlords and tenants
- **Revenue Impact**: 25% more leases = $150K additional commission/year
- **Value Prop**: CRM auto-matching, syndication, compliance protection

### User Pain Point

Jessica's perspective: "Will this actually help me close more deals? What's the learning curve? Can my team share a subscription?"

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 agent prospects per month
- **Impact**: 2 (High - network effect driver)
- **Confidence**: 80%
- **Effort**: 3 person-weeks

**RICE Score**: (500 x 2 x 0.8) / 3 = **266.7**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: Landing Page (/for-agents)

**Given** agent visits marketing page
**When** page loads
**Then** they see:

**Hero Section**:
- Headline: "Close 25% More Leases, Save 20 Hours/Week"
- Subheadline: "CRM that converts. Syndication that syncs. Compliance that protects."
- CTA: "Start Free Trial" -> /register?role=agent

**Pain Points (3-Column)**:
- "Document Chasing" - "60% of applicants need follow-ups. We automate it."
- "Lost Leads" - "Denied applicants disappear. Our CRM recaptures them."
- "Compliance Anxiety" - "Fair Housing violations can cost $25,000+. We prevent them."

**Solution Overview**:
- CRM auto-matching with denied applicants
- One-click syndication to 6+ platforms
- Unified applicant dashboard
- Automated compliance protection

**Testimonial**: Jessica Rodriguez quote with photo

**Verification**:
- [ ] Hero section compelling
- [ ] CTAs functional
- [ ] Pain points addressed

### AC-2: Pricing Page (/for-agents/pricing)

**Given** agent views pricing
**When** page loads
**Then** they see:

**Tier Comparison Table**:
- Starter ($99/mo): 10 listings, basic CRM, Zillow syndication, email support
- Professional ($299/mo): Unlimited listings, full CRM, 6+ platform syndication, priority support
- Enterprise (Custom): Multi-agent teams, API access, dedicated account manager

**ROI Calculator**:
- Inputs: Leases per year, average commission
- Output: "Additional annual revenue: $150,000"

**Commission Impact Calculator**: Time savings x hourly rate

**Verification**:
- [ ] Tier table clear
- [ ] Calculators functional
- [ ] Clear value proposition

### AC-3: FAQ Page (/for-agents/faq)

**Given** agent has questions
**When** viewing FAQ
**Then** they see:
- Schema.org FAQPage structured data
- Minimum 10 questions covering CRM, syndication, teams

**Questions Include**:
- "How does CRM auto-matching work?"
- "Which platforms do you syndicate to?"
- "Can my team share a subscription?"
- "How do I transfer existing listings?"
- "Is there a mobile app?"

**Verification**:
- [ ] Questions comprehensive
- [ ] Answers helpful
- [ ] SEO markup correct

### AC-4: CRM Feature Deep-Dive (/for-agents/crm)

**Given** agent wants CRM details
**When** viewing page
**Then** they see:
- How denied applicants become warm leads
- Match scoring algorithm explanation
- One-tap outreach demonstration
- Conversion tracking example
- Network effect math

**Verification**:
- [ ] Feature fully explained
- [ ] Screenshots/demos included
- [ ] Value clearly communicated

### AC-5: Syndication Feature Deep-Dive (/for-agents/syndication)

**Given** agent wants syndication details
**When** viewing page
**Then** they see:
- Supported platforms list
- One-click updates demonstration
- De-listing automation
- QR code generation

**Verification**:
- [ ] All platforms listed
- [ ] Process clearly shown

### AC-6: Case Studies (/for-agents/case-studies)

**Given** agent wants proof
**When** viewing case studies
**Then** they see:
- Index page with 3-5 preview cards
- Individual case studies with metrics
- Schema.org Article markup

**Case Studies**:
- "How Jessica increased commissions by $150K"
- "Metro Property Management's 41x ROI"

**Verification**:
- [ ] Case studies compelling
- [ ] Metrics included

### AC-7: Demo Request (/for-agents/demo)

**Given** agent wants demo
**When** filling out form
**Then** they provide:
- Name, email, phone
- Brokerage name
- Number of agents
- Current tools used

**And** see Calendly embed for scheduling

**Verification**:
- [ ] Form captures all info
- [ ] Lead routed correctly

---

## Technical Implementation Notes

### Routes

```
app/(public)/for-agents/page.tsx
app/(public)/for-agents/pricing/page.tsx
app/(public)/for-agents/faq/page.tsx
app/(public)/for-agents/crm/page.tsx
app/(public)/for-agents/syndication/page.tsx
app/(public)/for-agents/case-studies/page.tsx
app/(public)/for-agents/case-studies/[slug]/page.tsx
app/(public)/for-agents/demo/page.tsx
```

### Frontend Specification

**Components**: Reuse from US-027 with agent-specific content

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `agent_page_viewed` | Page loads | `{page, source}` |
| `roi_calculated` | Calculator used | `{leases, revenue}` |
| `demo_requested` | Form submitted | `{agentId, brokerage}` |

**Success Metrics**:
- 5% visitor-to-demo conversion
- 25% demo-to-signup conversion
- $100 CAC for agent segment

---

## Dependencies

### Related Stories
- US-019: Agent Subscription Billing
- US-026: Split Homepage

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer, Content Writer
