# US-026: Split Homepage with Tenant Search + Landlord/Agent CTAs [P0]

**Status**: Approved
**Priority**: P0 (Critical - Homepage is first impression, drives all acquisition)
**Sprint**: Sprint 1

---

## User Story

**As a** first-time visitor to ApartmentDibs
**I want a** homepage that immediately shows me how to search for apartments (if I'm a tenant) or how to list my property/grow my business (if I'm a landlord/agent)
**So that** I can quickly understand the platform's value and take the appropriate next action

---

## Context & Background

### Problem Statement

Traditional rental platforms either focus solely on tenants (Zillow, Apartments.com) or solely on property managers (AppFolio, Buildium), missing the opportunity to serve both sides of the marketplace.

### Business Rationale

- **StreetEasy Model**: Successfully serves both renters and agents from a single homepage
- **ApartmentDibs Differentiation**: Beyond search, we offer compliance protection for landlords and fair housing guarantees for tenants

### User Pain Points

- **Maya (Tenant)**: "I need to see a search bar immediately. If I can't find apartments within 5 seconds, I'll go to Zillow."
- **Jessica (Agent)**: "I need to know how this helps me close more deals. Show me the CRM, the syndication, the time savings."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: All visitors (10,000/month projected)
- **Impact**: 3 (Massive - first impression)
- **Confidence**: 90%
- **Effort**: 2 person-weeks

**RICE Score**: (10000 x 3 x 0.9) / 2 = **13,500**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: Hero Section (Tenant-Focused, Above the Fold)

**Given** a visitor lands on the homepage
**When** the page loads
**Then** they see a hero section with:

**Search Bar (Primary CTA)**:
- Large, prominent search input: "Find your next apartment"
- Location autocomplete (Google Places API)
- Budget filter dropdown: "$0-$2,000", "$2,000-$3,000", "$3,000-$4,000", "$4,000+"
- Beds filter: "Studio", "1 BR", "2 BR", "3+ BR"
- Primary CTA button: "Search Rentals" (high-contrast color)

**Subheading**: "10,000+ verified listings. Apply once, reuse everywhere."

**Trust Signals**:
- "Verified listings only" badge
- "No broker fees" badge (where applicable)
- "Fair Housing compliant" badge

**Verification**:
- [ ] Search bar prominent and functional
- [ ] Autocomplete works
- [ ] Filters work correctly
- [ ] Trust badges display

### AC-2: Secondary Section (Landlord/Agent CTAs)

**Given** visitor scrolls below the fold
**When** secondary section appears
**Then** they see two-column layout:

**Column 1: For Landlords**
- Headline: "Protect Your Investment, Fill Faster"
- Pain points: "Audit trails for compliance | Risk scores for tenant quality | 56% faster fills"
- CTA button: "Get Started" -> /for-landlords
- Trust signal: David testimonial quote

**Column 2: For Agents**
- Headline: "Close 25% More Leases, Save 20 Hours/Week"
- Pain points: "CRM auto-matching | One-click syndication | Unified dashboard"
- CTA button: "Get Started" -> /for-agents
- Trust signal: Jessica testimonial quote

**Verification**:
- [ ] Two columns display properly
- [ ] CTAs link correctly
- [ ] Testimonials show

### AC-3: Featured Listings Section

**Given** visitor continues scrolling
**When** featured listings appear
**Then** they see:
- Grid of 6-8 verified listings (curated)
- Each card shows: Photo, address, neighborhood, rent, beds/baths, "Verified" badge
- "View All Listings" link -> /search

**Verification**:
- [ ] Listings load from database
- [ ] Cards display correctly
- [ ] Link works

### AC-4: Social Proof Section

**Given** visitor views social proof
**When** metrics and testimonials display
**Then** they see:

**Metrics**:
- "10,000+ verified renters"
- "500+ agents"
- "43 days -> 21 days average fill time"

**Testimonials**:
- Maya (tenant): "ApartmentDibs saved me $300 and 12 hours..."
- Jessica (agent): "I close 25% more leases..."
- David (landlord): "The audit trail is bulletproof..."

**Verification**:
- [ ] Metrics display
- [ ] Testimonials with photos
- [ ] Quotes compelling

### AC-5: Neighborhood Guides Section

**Given** SEO and user discovery needs
**When** neighborhood links display
**Then** visitor sees:
- Quick links to popular neighborhoods
- Each link -> /neighborhoods/[slug]

**Verification**:
- [ ] Links work correctly
- [ ] SEO benefit realized

### AC-6: Non-Functional Requirements

**Performance**:
- [ ] Homepage loads in <2 seconds (Core Web Vitals)
- [ ] Lazy-load below-fold content

**Mobile Responsiveness**:
- [ ] Search bar functional on mobile
- [ ] CTAs tappable

**SEO**:
- [ ] Proper meta tags
- [ ] Schema.org WebSite + SearchAction structured data

**A/B Testable**:
- [ ] Hero text, CTA colors, layout easily swappable

---

## Technical Implementation Notes

### Frontend Specification

**Route**: `app/(public)/page.tsx`

**Components**:
```
components/
  home/
    HeroSearch.tsx           - Search bar with autocomplete
    LandlordCTA.tsx          - Landlord section
    AgentCTA.tsx             - Agent section
    FeaturedListings.tsx     - Listing grid
    Testimonials.tsx         - Social proof
    NeighborhoodLinks.tsx    - Quick links
```

### SEO Metadata

```typescript
export const metadata: Metadata = {
  title: 'ApartmentDibs | NYC Apartment Rentals',
  description: 'Find verified apartment listings in NYC. Apply once, reuse everywhere. Fair housing compliant.',
  openGraph: {
    title: 'ApartmentDibs | NYC Apartment Rentals',
    description: 'Find verified apartment listings in NYC. Apply once, reuse everywhere.',
    url: 'https://apartmentdibs.com',
    siteName: 'ApartmentDibs',
    type: 'website',
  },
};
```

### Structured Data

WebSite schema with SearchAction for Google Sitelinks Search Box

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `homepage_viewed` | Page loads | `{source, device}` |
| `search_initiated` | Search performed | `{location, budget, beds}` |
| `cta_clicked` | Button clicked | `{ctaType, destination}` |
| `listing_clicked` | Featured listing | `{listingId}` |

**Success Metrics**:
- 40%+ discovery-to-engagement rate
- <30 seconds time-to-first-engagement
- Bounce rate <50%

---

## Edge Cases

- **Tenant clicks landlord CTA by accident**: /for-landlords has "Are you a renter? Search apartments here" link
- **Search returns zero results**: Show suggestions to expand search
- **Slow mobile connection**: Lazy-load everything below hero

---

## Dependencies

### Related Stories
- US-027: Landlord Marketing Hub
- US-028: Agent Marketing Hub
- US-030: Property Page

---

## Related Documentation

- **ADR-005**: PostHog Feature Flags and A/B Testing - Hero text, CTA colors, layout A/B testing
- **Google Places API**: Location autocomplete for search bar
- **Schema.org**: WebSite + SearchAction structured data for SEO

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer, UI Designer
