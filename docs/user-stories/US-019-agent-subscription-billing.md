# US-019: Agent Subscription Billing (Monthly Recurring Revenue) [P1]

**Status**: Approved
**Priority**: P1 (High - Core revenue stream)
**Sprint**: Sprint 2

---

## User Story

**As a** leasing agent (Jessica)
**I want to** subscribe to a monthly plan that gives me access to platform features based on my needs
**So that** I can choose the right tier and manage my costs

---

## Context & Background

### Problem Statement

Agents need predictable pricing that scales with their business. Transaction-based pricing is unpredictable and creates friction at the moment of listing creation.

### Business Rationale

- **Revenue Model**: Monthly recurring revenue (MRR) for predictable growth
- **Agent Retention**: Subscription creates stickiness
- **Scalable Pricing**: Tiers allow growth with customer

### Pricing Tiers

- **Starter ($99/mo)**: 10 listings, basic CRM, Zillow syndication, email support
- **Professional ($299/mo)**: Unlimited listings, full CRM, 6+ platform syndication, priority support
- **Enterprise (Custom)**: Multi-agent teams, API access, dedicated account manager

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 agents per month
- **Impact**: 3 (Massive - core revenue)
- **Confidence**: 90%
- **Effort**: 3 person-weeks

**RICE Score**: (500 x 3 x 0.9) / 3 = **450**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: Tier Selection

**Given** an agent wants to subscribe
**When** they view pricing
**Then** they see tier comparison:

- Features per tier
- Price per month
- "Most Popular" indicator
- Annual discount option

**Verification**:

- [ ] Clear tier comparison
- [ ] Feature matrix accurate
- [ ] Annual saves 20%

### AC-2: Subscription Checkout

**Given** agent selects a tier
**When** they checkout
**Then** Stripe processes:

- Credit card payment
- Recurring billing setup
- Immediate access grant

**Verification**:

- [ ] Stripe integration works
- [ ] Subscription created in database
- [ ] Features unlocked immediately

### AC-3: Usage Tracking

**Given** agent on Starter tier (10 listings)
**When** they approach limit
**Then** they see:

- "8 of 10 listings used"
- Upgrade prompt when at limit
- Cannot create 11th listing without upgrade

**Verification**:

- [ ] Usage counter accurate
- [ ] Soft limit warning at 80%
- [ ] Hard limit enforced

### AC-4: Subscription Management

**Given** agent has active subscription
**When** they manage account
**Then** they can:

- Upgrade/downgrade tier
- Update payment method
- Cancel subscription
- View billing history

**Verification**:

- [ ] Plan changes prorate correctly
- [ ] Payment updates work
- [ ] Cancellation flows properly

### AC-5: Dunning Management

**Given** payment fails
**When** renewal is due
**Then** platform:

- Retries payment 3x over 7 days
- Sends email notifications
- Downgrades to free after 14 days
- Preserves data for reactivation

**Verification**:

- [ ] Retry logic works
- [ ] Notifications sent
- [ ] Graceful downgrade
- [ ] Data not deleted

---

## Technical Implementation Notes

### Backend Specification

**Stripe Subscription API**: Manage plans, customers, invoices

**Webhook Handling**: Process subscription events

**Feature Flags**: Control access based on tier

### Frontend Specification

**Components**:

```
components/
  billing/
    PricingTable.tsx         - Tier comparison
    CheckoutForm.tsx         - Payment collection
    UsageCounter.tsx         - Limit tracking
    BillingHistory.tsx       - Invoice list
```

**Routing**:

- `/agent/billing` - Manage subscription
- `/pricing` - Public pricing page

---

## Analytics Tracking

| Event Name               | When Triggered   | Properties                    |
| ------------------------ | ---------------- | ----------------------------- |
| `subscription_started`   | New subscription | `{agentId, tier, price}`      |
| `subscription_upgraded`  | Plan change up   | `{agentId, fromTier, toTier}` |
| `subscription_cancelled` | Cancellation     | `{agentId, tier, reason}`     |
| `payment_failed`         | Charge fails     | `{agentId, failureReason}`    |

**Success Metrics**:

- 5% monthly churn or less
- 60% annual plan adoption
- $15,000 MRR by Month 6

---

## Dependencies

### External Dependencies

- Stripe API

### Related Stories

- US-020: Tenant Screening Fees
- US-021: Landlord Compliance Tier

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer
