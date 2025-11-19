# US-034: Dynamic Sitemap and Robots.txt Generation [P1]

**Status**: Approved
**Priority**: P1 (High - Critical for SEO indexing)
**Sprint**: Sprint 2

---

## User Story

**As** Google's search crawler
**I want a** comprehensive XML sitemap and robots.txt file
**So that** I can efficiently index all ApartmentDibs pages and respect crawl directives

---

## Context & Background

### Problem Statement

Without a sitemap, Google may not discover or prioritize all pages. With thousands of properties, buildings, businesses, and neighborhoods, manual sitemap is impossible.

### Business Rationale

- **SEO Foundation**: Sitemap ensures all pages are discoverable
- **Crawl Efficiency**: Priority and changefreq guide crawler behavior
- **Scale**: Must handle 10,000+ URLs automatically

---

## Priority & Estimation

### RICE Scoring

- **Reach**: All pages (10,000+)
- **Impact**: 2 (High - SEO foundation)
- **Confidence**: 100%
- **Effort**: 1 person-week

**RICE Score**: (10000 x 2 x 1.0) / 1 = **20,000**

### Story Points

**Estimated Effort**: 5 story points (20-25 hours)

---

## Acceptance Criteria

### AC-1: Dynamic XML Sitemap (/sitemap.xml)

**Given** database has content
**When** sitemap is generated
**Then** includes:

**All Pages**:

- All property pages: `/property/[slug]`
- All building pages: `/building/[slug]`
- All business pages: `/business/[slug]`
- All neighborhood guides: `/neighborhoods/[slug]`
- All blog posts: `/blog/[slug]`
- Marketing pages: `/for-landlords/*`, `/for-agents/*`
- Static pages: `/`, `/about`, `/pricing`, `/faq`, `/contact`

**Per-URL Metadata**:

- `<loc>`: Full canonical URL
- `<lastmod>`: Last modification date
- `<changefreq>`: Update frequency (daily for listings, monthly for static)
- `<priority>`: Importance (1.0 for homepage, 0.8 for properties)

**Verification**:

- [ ] All page types included
- [ ] Metadata accurate
- [ ] Valid XML format

### AC-2: Sitemap Index

**Given** >50,000 URLs
**When** sitemap generated
**Then** create sitemap index with multiple child sitemaps

**Verification**:

- [ ] Index structure works
- [ ] Each child sitemap <50MB
- [ ] Each child sitemap <50,000 URLs

### AC-3: Dynamic Robots.txt (/robots.txt)

**Given** crawler needs directives
**When** robots.txt accessed
**Then** shows:

```
User-agent: *
Allow: /

Disallow: /portal/
Disallow: /api/
Disallow: /admin/

Sitemap: https://apartmentdibs.com/sitemap.xml
```

**Verification**:

- [ ] Public pages allowed
- [ ] Private pages blocked
- [ ] Sitemap reference included

### AC-4: Google Search Console Integration

**Given** sitemap exists
**When** submitted to GSC
**Then**:

- Monitor index coverage
- Track crawl errors
- Request re-indexing on major updates

**Verification**:

- [ ] Sitemap submitted
- [ ] Coverage monitored
- [ ] Errors addressed

### AC-5: Automated Updates

**Given** content changes
**When** listings created/updated
**Then**:

- Sitemap regenerates daily (or on-demand)
- New URLs appear within 24 hours
- Stale URLs removed

**Verification**:

- [ ] Generation is automatic
- [ ] New content appears quickly
- [ ] Removed content excluded

### AC-6: Non-Functional Requirements

**Performance**:

- [ ] Generation completes in <10 seconds (even with 50,000 URLs)

**Compliance**:

- [ ] Valid per sitemap protocol
- [ ] Gzip compression

**Caching**:

- [ ] Cache sitemap
- [ ] Invalidate on content change

---

## Technical Implementation Notes

### Implementation

```typescript
// app/(public)/sitemap.ts
import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await prisma.listing.findMany({
    where: { status: 'active' },
    select: { slug: true, updatedAt: true },
  })

  return [
    {
      url: 'https://apartmentdibs.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...properties.map((property) => ({
      url: `https://apartmentdibs.com/property/${property.slug}`,
      lastModified: property.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    // ... buildings, businesses, neighborhoods, blog
  ]
}
```

### Routes

```
app/(public)/sitemap.ts
app/(public)/robots.ts
```

### Data Sources

Query listings, buildings, businesses, neighborhoods tables

---

## Analytics Tracking

| Event Name           | When Triggered     | Properties             |
| -------------------- | ------------------ | ---------------------- |
| `sitemap_generated`  | Daily regeneration | `{urlCount, duration}` |
| `gsc_error_detected` | Crawl error        | `{errorType, url}`     |

**Success Metrics**:

- 95%+ of pages indexed within 7 days
- <1% crawl errors
- Daily sitemap generation <10 seconds

---

## Edge Cases

- **Exceeds 50MB/50,000 URLs**: Create sitemap index
- **Temporarily unavailable page**: Keep in sitemap
- **URL slug changes**: 301 redirect, update sitemap

---

## Dependencies

### Blocked By

- US-030: Property Page (URL structure)

### Related Stories

- US-030-033: All content pages

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer
