# US-007: Listing Syndication to 6+ Platforms (One-Click) [P1]

**Status**: Approved
**Priority**: P1 (High - Major time saver for agents, improves listing reach)
**Sprint**: Sprint 2

---

## User Story

**As an** agent (Jessica)
**I want to** create a listing once and have it automatically syndicate to Zillow, Apartments.com, Craigslist, Facebook, StreetEasy, and Google
**So that** I don't spend 1-2 hours manually posting on each platform

---

## Context & Background

### Problem Statement

Agents post listings on 5+ platforms separately, spending 1-2 hours per listing. This leads to data inconsistency (old photos on one platform, wrong rent on another) and tenant confusion.

### Business Rationale

- **Time Cost**: 1-2 hours per listing (30 min per platform x 4-5 platforms)
- **Data Inconsistency**: Creates tenant confusion and missed opportunities
- **Competitive Advantage**: Single source of truth, unified management

### User Pain Point

"I spend more time posting listings than showing apartments."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 agents per month
- **Impact**: 2 (High - significant time savings)
- **Confidence**: 80%
- **Effort**: 4 person-weeks

**RICE Score**: (500 x 2 x 0.8) / 4 = **200**

### Story Points

**Estimated Effort**: 21 story points (80-100 hours)

---

## Acceptance Criteria

### AC-1: Single Listing Creation

**Given** an agent creates a listing on ApartmentDibs
**When** they complete the form (10-15 minutes)
**Then** all fields required by downstream platforms are captured:
- Address, unit details
- Rent, security deposit, lease term
- Amenities (checkboxes)
- Photos (10-15 images, drag-and-drop)
- Floor plan (optional)
- Description

**Verification**:
- [ ] Form captures all required fields
- [ ] Photo upload works (drag-and-drop)
- [ ] Validation prevents incomplete submissions

### AC-2: Auto-Syndication to 6+ Platforms

**Given** a listing is created
**When** syndication is triggered
**Then** listing appears on:
- Zillow Rental Manager (API)
- Apartments.com (API or CSV)
- Craigslist (auto-renewal every 30 days)
- Facebook Marketplace (Graph API)
- StreetEasy (NYC only)
- Google Search (Schema.org structured data)

**And** ApartmentDibs badge indicates "Verified Listing"

**Verification**:
- [ ] All platforms receive listing within 15 minutes
- [ ] Field mapping is correct
- [ ] ApartmentDibs badge displays

### AC-3: Syndication Status Dashboard

**Given** syndication is in progress
**When** agent views status
**Then** they see real-time status per platform:
- Zillow: Published (2 minutes ago)
- Craigslist: Pending (awaiting approval)
- StreetEasy: Failed (invalid format) -> Retry button

**Verification**:
- [ ] Status updates in real-time
- [ ] Errors show resolution steps
- [ ] Retry functionality works

### AC-4: Unified Editing

**Given** an agent edits a listing on ApartmentDibs
**When** changes are saved
**Then** all syndicated listings update within 5 minutes

**Verification**:
- [ ] Changes propagate to all platforms
- [ ] No manual re-posting required

### AC-5: De-listing (Mark as Rented)

**Given** an agent marks listing as "Rented"
**When** the status is updated
**Then** listing is removed from all platforms within 1 hour

**Verification**:
- [ ] Automatic de-listing works
- [ ] No ghost listings remain

### AC-6: Platform Selection

**Given** an agent creates a listing
**When** they configure syndication
**Then** they can select/deselect platforms via checkboxes

**Verification**:
- [ ] Per-platform selection available
- [ ] Default is all platforms enabled

---

## Technical Implementation Notes

### Backend Specification

**API Integrations**:
- Zillow Rental Manager API
- Facebook Graph API
- StreetEasy API

**Background Jobs**: Use job queue (Bull) for async syndication

**Schema.org Structured Data**:
```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "1BR in Williamsburg",
  "price": 3000,
  "priceCurrency": "USD"
}
```

### Frontend Specification

**Components**:
```
components/
  syndication/
    SyndicationStatus.tsx     - Per-platform status
    PlatformSelector.tsx      - Enable/disable platforms
    RetryButton.tsx           - Retry failed syndication
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `listing_created` | Agent creates listing | `{agentId, listingId}` |
| `syndication_completed` | All platforms updated | `{listingId, platforms, successCount}` |
| `syndication_failed` | Platform returns error | `{listingId, platform, error}` |

**Success Metrics**:
- 95%+ syndication success rate
- <15 minutes to all platforms
- 85% reduction in manual posting time

---

## Dependencies

### Related Stories
- US-005: Unified Applicant Dashboard
- US-030: Property Page with Schema.org

### External Dependencies
- Zillow API access
- Facebook Graph API access
- StreetEasy API access

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer
