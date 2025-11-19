# US-031: Building Directory and Detail Pages [P2]

**Status**: Approved
**Priority**: P2 (Medium - Valuable for SEO and UX, not MVP blocking)
**Sprint**: Sprint 3

---

## User Story

**As a** tenant researching apartment buildings
**I want to** browse building-specific pages showing amenities, available units, and rental history
**So that** I can find buildings I like and see all available units in one place

---

## Context & Background

### Problem Statement

Tenants often prefer specific buildings (doorman buildings, new construction) but have to search listing-by-listing. Building aggregation improves discovery.

### Business Rationale

- **SEO Opportunity**: "The William Brooklyn apartments" is high-intent query
- **User Experience**: All units in building in one view
- **Landlord Value**: Multi-unit buildings get dedicated presence

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 building searches per month
- **Impact**: 1.5 (Medium - SEO + UX)
- **Confidence**: 80%
- **Effort**: 3 person-weeks

**RICE Score**: (1000 x 1.5 x 0.8) / 3 = **400**

### Story Points

**Estimated Effort**: 13 story points (50-60 hours)

---

## Acceptance Criteria

### AC-1: Building Directory Page (/building)

**Given** tenant browses buildings
**When** viewing directory
**Then** they see:

**Search/Filter**:
- Filter by neighborhood, amenities, building size
- Sort by: units, average rent, newest

**Building Cards**:
- Photo, name, neighborhood
- Key amenities (icons)
- Available units count

**Verification**:
- [ ] Filters work correctly
- [ ] Cards display properly
- [ ] ItemList schema implemented

### AC-2: Individual Building Page (/building/[slug])

**Given** tenant views building
**When** page loads
**Then** they see:

**Building Overview**:
- Photo gallery (exterior, lobby, amenities)
- Name, address, year built
- Total units, description

**Amenities Grid**:
- Icons + text: Doorman, gym, rooftop, parking, etc.

**Available Units**:
- Grid of current listings
- Links to /property/[slug]

**Property Manager Link**:
- Link to /business/[slug]

**Contact Form**:
- "Interested? Contact property manager"

**Verification**:
- [ ] All sections display
- [ ] Listings load correctly
- [ ] Contact form works

### AC-3: Schema.org Structured Data

**Given** building page
**When** rendered
**Then** includes:

```json
{
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  "name": "The William",
  "url": "https://apartmentdibs.com/building/the-william-brooklyn",
  "description": "120-unit luxury doorman building...",
  "address": {...},
  "geo": {...},
  "amenityFeature": [...],
  "numberOfAvailableAccommodation": 5,
  "petsAllowed": true
}
```

**Verification**:
- [ ] Valid schema
- [ ] Rich results eligible

### AC-4: Dynamic OG Image

**Given** building shared on social
**When** preview generated
**Then** shows building exterior with name, neighborhood, amenities

**Verification**:
- [ ] Image generates correctly
- [ ] Looks good on social

---

## Technical Implementation Notes

### Routes

```
app/(public)/building/page.tsx
app/(public)/building/[slug]/page.tsx
app/(public)/building/[slug]/opengraph-image.tsx
```

### Data Model

Building entity with hasMany relationship to Listings

### Components

```
components/
  building/
    BuildingCard.tsx         - Directory card
    BuildingGallery.tsx      - Photos
    AmenitiesGrid.tsx        - Icons
    AvailableUnits.tsx       - Listings
```

---

## Analytics Tracking

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `building_viewed` | Page loads | `{buildingId, source}` |
| `unit_clicked` | Listing selected | `{buildingId, listingId}` |
| `contact_submitted` | Form sent | `{buildingId}` |

**Success Metrics**:
- 30% of building views lead to listing clicks
- 20% organic traffic from building searches
- Higher engagement than direct listing search

---

## Edge Cases

- **No available units**: "Save building" alert signup
- **Incomplete data**: Hide empty sections
- **Same name buildings**: Slug includes neighborhood

---

## Dependencies

### Blocked By
- US-030: Property Page

### Related Stories
- US-032: Business Profiles
- US-033: Neighborhood Guides

---

**Last Updated**: 2025-11-19
**Assigned To**: Frontend Developer
