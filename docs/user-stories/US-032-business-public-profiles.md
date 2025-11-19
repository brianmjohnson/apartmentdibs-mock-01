# US-032: Business (Agent/Landlord) Public Profiles [P2]

**Status**: Approved
**Priority**: P2 (Medium - Valuable for trust and SEO, not MVP blocking)
**Sprint**: Sprint 3

---

## User Story

**As a** tenant evaluating a listing
**I want to** see the agent's or landlord's public profile with their track record, response time, and other listings
**So that** I can trust who I'm applying to and compare agents

---

## Context & Background

### Problem Statement

Tenants don't know if an agent is responsive, experienced, or trustworthy. No way to evaluate track record or compare agents.

### Business Rationale

- **Trust Building**: Performance metrics build confidence
- **SEO Opportunity**: "Jessica Rodriguez Metro Property Management" is navigational query
- **Agent Value**: Public profile acts as marketing tool

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 500 profile views per month
- **Impact**: 1.5 (Medium - trust + SEO)
- **Confidence**: 80%
- **Effort**: 2 person-weeks

**RICE Score**: (500 x 1.5 x 0.8) / 2 = **300**

### Story Points

**Estimated Effort**: 8 story points (30-40 hours)

---

## Acceptance Criteria

### AC-1: Business Directory Page (/business)

**Given** user browses agents/landlords
**When** viewing directory
**Then** they see:

**Search/Filter**:
- Filter by location served, specialty
- Sort by: listings, response time, experience

**Business Cards**:
- Photo, name, company
- Location served
- Active listings count
- Verified badge

**Verification**:
- [ ] Filters work
- [ ] Cards display properly
- [ ] ItemList schema

### AC-2: Individual Profile (/business/[slug])

**Given** user views profile
**When** page loads
**Then** they see:

**Profile Header**:
- Photo (headshot or logo)
- Name, title, company
- Location served
- "Verified Agent" badge

**Bio/Description**:
- About text
- Years of experience
- Specialties

**Performance Metrics**:
- Active listings count
- Average days-to-fill
- Response time
- Leases closed

**Active Listings Grid**:
- Current listings from this agent
- Links to /property/[slug]

**Contact Form**:
- "Have questions? Contact [Name]"
- Routes through platform messaging

**Verification**:
- [ ] All sections display
- [ ] Metrics accurate
- [ ] Contact works

### AC-3: All Listings Page (/business/[slug]/listings)

**Given** agent has many listings
**When** user wants full list
**Then** they see paginated grid:
- Active, pending, recently rented
- Filter by status
- Sort by date

**Verification**:
- [ ] Pagination works
- [ ] Filters work

### AC-4: Schema.org Structured Data

**Given** profile page
**When** rendered
**Then** includes:

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Jessica Rodriguez",
  "jobTitle": "Senior Leasing Agent",
  "worksFor": {...},
  "url": "https://apartmentdibs.com/business/jessica-rodriguez",
  "description": "...",
  "areaServed": "Brooklyn, Queens, Manhattan",
  "image": "...",
  "contactPoint": {...}
}
```

**Verification**:
- [ ] Valid schema
- [ ] Rich results eligible

---

## Technical Implementation Notes

### Routes

```
app/(public)/business/page.tsx
app/(public)/business/[slug]/page.tsx
app/(public)/business/[slug]/listings/page.tsx
```

### Components

```
components/
  business/
    BusinessCard.tsx         - Directory card
    ProfileHeader.tsx        - Photo, name, badges
    PerformanceMetrics.tsx   - Stats
    ListingsGrid.tsx         - Active properties
    ContactForm.tsx          - Platform messaging
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `profile_viewed` | Page loads | `{businessId, source}` |
| `listing_clicked` | Property selected | `{businessId, listingId}` |
| `contact_submitted` | Message sent | `{businessId, tenantId}` |

**Success Metrics**:
- 25% of profile views lead to listing clicks
- 10% of profile views lead to contact
- Higher trust scores in user surveys

---

## Edge Cases

- **No listings**: Don't create profile until first listing
- **Hide metrics**: Allow opt-out (but default to showing)
- **Contact spam**: CAPTCHA, rate limiting, require account

---

## Dependencies

### Blocked By
- US-030: Property Page

### Related Stories
- US-031: Building Directory
- US-009: In-App Messaging

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer
