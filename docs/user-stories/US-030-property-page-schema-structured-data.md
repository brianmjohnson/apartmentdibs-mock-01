# US-030: Property Page with Rich Schema.org Structured Data [P1]

**Status**: Approved
**Priority**: P1 (High - SEO is primary tenant acquisition channel)
**Sprint**: Sprint 2

---

## User Story

**As a** tenant searching for apartments on Google
**I want to** find ApartmentDibs listings in search results with rich information (price, address, photos, availability)
**So that** I can quickly identify relevant listings without visiting multiple sites

---

## Context & Background

### Problem Statement

Generic listing pages don't appear prominently in Google search results. Without structured data, listings miss rich snippets and Knowledge Graph inclusion opportunities.

### Business Rationale

- **SEO Impact**: Schema.org markup enables rich snippets, higher CTR
- **User Experience**: Rich previews help users find relevant listings faster
- **Competitive Advantage**: Better search presence than competitors

### User Journey

Maya's perspective: "I Googled '1BR Williamsburg pet-friendly' and the first result showed me price, photos, and 'Apply Now' right in the search result."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 5,000 property searches per month
- **Impact**: 2 (High - SEO acquisition)
- **Confidence**: 90%
- **Effort**: 3 person-weeks

**RICE Score**: (5000 x 2 x 0.9) / 3 = **3,000**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: Dynamic Property URLs

**Given** a property listing
**When** URL is generated
**Then** format is: `/property/[slug]`
- Slug format: `[address]-[beds]br-[city]` (e.g., `/property/123-main-st-2br-brooklyn`)
- Canonical URL set
- Alternate URLs link to building/business pages

**Verification**:
- [ ] URLs are SEO-friendly
- [ ] Canonical prevents duplicate content
- [ ] 301 redirects for old URLs

### AC-2: Page Content

**Given** user views property page
**When** page loads
**Then** they see:

**Photo Gallery**: 10-15 high-res images with lightbox

**Property Details**:
- Address with map
- Rent, security deposit
- Beds, baths, sqft
- Amenities (icons + text)
- Available date, lease term
- Pet policy

**Screening Criteria Disclosure**:
- Hard criteria: "3.0x income, 680+ credit, no evictions"
- Soft criteria: "12-month lease preferred"

**Actions**:
- "Apply with Verified Profile" button
- Building link, agent link
- Similar properties carousel

**Verification**:
- [ ] All content displays correctly
- [ ] Map integration works
- [ ] CTA prominent

### AC-3: Schema.org Structured Data

**Given** property page
**When** rendered
**Then** includes JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "2BR Apartment at 123 Main St, Williamsburg",
  "url": "https://apartmentdibs.com/property/123-main-st-2br-brooklyn",
  "description": "Spacious 2BR with in-unit W/D...",
  "datePosted": "2024-11-01",
  "price": 3000,
  "priceCurrency": "USD",
  "address": {...},
  "geo": {...},
  "numberOfRooms": 2,
  "amenityFeature": [...],
  "petsAllowed": true,
  "image": [...],
  "landlord": {...}
}
```

**Verification**:
- [ ] Valid JSON-LD syntax
- [ ] All required properties included
- [ ] Rich results test passes

### AC-4: Meta Tags

**Given** property page
**When** rendered
**Then** includes:

- **Title**: "2BR Apartment at 123 Main St, Williamsburg | $3,000/mo"
- **Description**: "Spacious 2BR with in-unit W/D, pet-friendly. Apply with verified profile."
- **Canonical**: Full URL

**Verification**:
- [ ] Title unique per listing
- [ ] Description compelling
- [ ] No duplicate canonicals

### AC-5: Open Graph Tags

**Given** property shared on social
**When** preview generated
**Then** shows:
- og:title, og:description
- og:image (property photo)
- og:url

**Dynamic OG Image**: `opengraph-image.tsx` generates custom image with photo, price, address

**Verification**:
- [ ] OG tags render correctly
- [ ] Dynamic image generates
- [ ] Preview looks good on Twitter/Facebook/iMessage

### AC-6: Non-Functional Requirements

**Performance**:
- [ ] Page loads in <2 seconds (Core Web Vitals)
- [ ] Lazy-load similar listings

**SEO Score**:
- [ ] 90+ on Lighthouse SEO audit

**Indexing**:
- [ ] New properties indexed within 24 hours

---

## Technical Implementation Notes

### Route

`app/(public)/property/[slug]/page.tsx`

### Data Fetching

ISR with revalidation (revalidate: 3600)

### Components

```
components/
  property/
    PhotoGallery.tsx         - Image display
    PropertyDetails.tsx      - All info
    ScreeningCriteria.tsx    - Requirements
    SimilarProperties.tsx    - Carousel
    ApplyButton.tsx          - CTA
```

### OG Image

`app/(public)/property/[slug]/opengraph-image.tsx` using @vercel/og

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `property_viewed` | Page loads | `{listingId, source}` |
| `apply_clicked` | CTA clicked | `{listingId, qualified}` |
| `photo_viewed` | Gallery opened | `{listingId, photoIndex}` |
| `share_initiated` | Share button | `{listingId, platform}` |

**Success Metrics**:
- 50%+ of traffic from organic search
- 3%+ click-through rate from search results
- 15%+ page-to-application conversion

---

## Edge Cases

- **Property rented**: 301 redirect to similar or "no longer available" page
- **Low quality photos**: Minimum resolution requirements
- **URL slug changes**: 301 redirect from old

---

## Dependencies

### Blocked By
- US-007: Listing Syndication (property data)

### Related Stories
- US-031: Building Directory
- US-032: Business Profiles

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer
