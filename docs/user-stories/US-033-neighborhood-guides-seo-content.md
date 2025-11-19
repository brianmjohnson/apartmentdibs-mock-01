# US-033: Neighborhood Guides with SEO Content [P2]

**Status**: Approved
**Priority**: P2 (Medium - Strong SEO play, content-heavy, not MVP blocking)
**Sprint**: Sprint 4

---

## User Story

**As a** tenant unfamiliar with NYC neighborhoods
**I want to** read comprehensive neighborhood guides (rent prices, transit, restaurants, schools)
**So that** I can decide where to live before searching for specific listings

---

## Context & Background

### Problem Statement

Tenants relocating to NYC (like Maya) don't know neighborhood characteristics. They need educational content before they can search effectively.

### Business Rationale

- **Content Marketing**: Attract organic traffic for high-intent queries
- **SEO**: "Best neighborhoods in Brooklyn for young professionals"
- **Internal Linking**: Guides link to property search, improving SEO and conversion

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 2,000 neighborhood searches per month
- **Impact**: 1.5 (Medium - content marketing)
- **Confidence**: 70%
- **Effort**: 4 person-weeks (content creation)

**RICE Score**: (2000 x 1.5 x 0.7) / 4 = **525**

### Story Points

**Estimated Effort**: 21 story points (80-100 hours including content)

---

## Acceptance Criteria

### AC-1: Neighborhood Index Page (/neighborhoods)

**Given** user browses neighborhoods
**When** viewing index
**Then** they see:

**List of neighborhoods**:

- NYC: Williamsburg, Park Slope, Fort Greene, Bushwick, Greenpoint

**Each Card Shows**:

- Neighborhood photo
- Name
- Average rent (1BR)
- "Vibe" summary (e.g., "Trendy, nightlife, creative")

**Verification**:

- [ ] All neighborhoods listed
- [ ] ItemList schema
- [ ] Cards link correctly

### AC-2: Individual Guide (/neighborhoods/[slug])

**Given** user reads guide
**When** page loads
**Then** they see:

**Overview Section**:

- Hero image
- Headline with keywords
- Introduction (history, character, who it's best for)

**Rent Prices Section**:

- Average by unit type
- Rent trend chart (12 months)
- Comparison to city average

**Transit Section**:

- Subway lines
- Travel times to major hubs
- Walk score, bike score

**Schools Section**:

- Public schools with ratings
- Private options
- Relevance for families

**Things to Do Section**:

- Restaurants, bars, parks
- "Best of" lists

**Available Listings CTA**:

- "Ready to find your apartment?"
- 3-4 featured listings preview
- Search link

**Related Neighborhoods**:

- "Also consider: Greenpoint, Bushwick"

**Verification**:

- [ ] All sections display
- [ ] Content is helpful
- [ ] CTAs work

### AC-3: Schema.org Structured Data

**Given** guide page
**When** rendered
**Then** includes:

```json
{
  "@context": "https://schema.org",
  "@type": "Place",
  "name": "Williamsburg",
  "description": "Trendy Brooklyn neighborhood...",
  "geo": {...},
  "containedInPlace": {
    "@type": "City",
    "name": "Brooklyn, NY"
  }
}
```

**Verification**:

- [ ] Valid schema
- [ ] Featured snippet eligible

### AC-4: Content Requirements

**Given** SEO needs
**When** content created
**Then**:

- Word count: 1,500+ words
- Internal links to property search, building pages, related neighborhoods
- External links to sources (MTA, GreatSchools)
- Updates: Rent data quarterly, "Things to Do" annually

**Verification**:

- [ ] Word count met
- [ ] Links included
- [ ] Sources cited

### AC-5: Meta Tags

**Given** guide page
**When** rendered
**Then** includes:

- Title: "Williamsburg, Brooklyn | Apartments, Rent Prices, Things to Do"
- Description: "Complete guide to renting in Williamsburg. Average rent: $3,200..."

**Verification**:

- [ ] Keywords included
- [ ] Description compelling

---

## Technical Implementation Notes

### Routes

```
app/(public)/neighborhoods/page.tsx
app/(public)/neighborhoods/[slug]/page.tsx
```

### Content Management

Can use MDX for rich content or store in database

### Rent Data

Aggregate from listings table, cache for performance

### Components

```
components/
  neighborhoods/
    NeighborhoodCard.tsx     - Index card
    RentChart.tsx            - Trend visualization
    TransitInfo.tsx          - Subway info
    ThingsToDo.tsx           - Local highlights
    FeaturedListings.tsx     - CTAs
```

---

## Analytics Tracking

| Event Name                 | When Triggered   | Properties                  |
| -------------------------- | ---------------- | --------------------------- |
| `guide_viewed`             | Page loads       | `{neighborhood, source}`    |
| `listing_cta_clicked`      | Search initiated | `{neighborhood}`            |
| `featured_listing_clicked` | Listing selected | `{neighborhood, listingId}` |

**Success Metrics**:

- 40% organic traffic from guide pages
- 15% guide-to-search conversion
- Featured snippet capture for rent queries

---

## Edge Cases

- **No rent data**: Show estimate or "coming soon"
- **Disputed boundaries**: Use commonly accepted
- **No listings**: Show guide without listings section

---

## Dependencies

### Blocked By

- US-030: Property Page (for listing links)

### Related Stories

- US-031: Building Directory
- US-034: Dynamic Sitemap

---

**Last Updated**: 2025-11-19
**Assigned To**: Content Writer, Frontend Developer
