# ApartmentDibs - Next.js 15 App Router Site Map

## Overview

This document outlines the complete folder structure for the ApartmentDibs Next.js 15 application using the App Router architecture. The structure emphasizes:

- **Route Groups** for persona-specific experiences (tenant, agent, landlord, admin)
- **API Routes** for tRPC endpoints, webhooks, and third-party integrations
- **Shared Components** using shadcn/ui with TypeScript
- **Middleware** for authentication and compliance enforcement

---

## Root Structure

```
apartmentdibs/
├── app/                          # Next.js App Router (all routes)
├── prisma/                       # Database schema & migrations
├── public/                       # Static assets
├── src/                          # Shared code (non-route)
├── .env                          # Environment variables (git-ignored)
├── .env.example                  # Example env vars (committed)
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies & scripts
├── tailwind.config.ts            # Tailwind CSS v4 configuration
├── tsconfig.json                 # TypeScript configuration
├── zenstack.config.ts            # ZenStack configuration
└── README.md                     # Project documentation
```

---

## app/ Directory (Next.js App Router)

### Public Routes (No Authentication Required)

```
app/
├── (public)/                     # Route group: Public-facing pages
│   ├── layout.tsx                # Public layout (header, footer, no auth)
│   ├── page.tsx                  # Homepage: "Find Your Next Apartment"
│   │                             # Hero, value props, search bar, featured listings
│   │
│   ├── search/                   # Apartment search
│   │   ├── page.tsx              # Search results page
│   │   └── [listingId]/          # Individual listing detail
│   │       └── page.tsx          # Public listing page (photos, amenities, apply CTA)
│   │
│   ├── about/                    # About ApartmentDibs
│   │   └── page.tsx              # Company mission, team, press
│   │
│   ├── pricing/                  # Pricing page
│   │   └── page.tsx              # Subscription tiers, feature comparison
│   │
│   ├── faq/                      # FAQ page
│   │   └── page.tsx              # Common questions (grouped by persona)
│   │
│   ├── contact/                  # Contact page
│   │   └── page.tsx              # Contact form, support email, phone
│   │
│   ├── legal/                    # Legal pages
│   │   ├── terms/                # Terms of service
│   │   │   └── page.tsx
│   │   ├── privacy/              # Privacy policy
│   │   │   └── page.tsx
│   │   └── fair-housing/         # Fair housing statement
│   │       └── page.tsx
│   │
│   └── blog/                     # Blog (SEO content)
│       ├── page.tsx              # Blog index (list of posts)
│       └── [slug]/               # Individual blog post
│           └── page.tsx
```

### Authentication Routes

```
app/
├── (auth)/                       # Route group: Authentication flows
│   ├── layout.tsx                # Auth layout (centered form, no header/footer)
│   │
│   ├── login/                    # Login page
│   │   └── page.tsx              # Email/password OR OAuth (Google, Apple)
│   │
│   ├── register/                 # Registration page
│   │   └── page.tsx              # Choose persona: Tenant, Agent, Landlord
│   │
│   ├── forgot-password/          # Password reset request
│   │   └── page.tsx
│   │
│   ├── reset-password/           # Password reset form (token-based)
│   │   └── page.tsx
│   │
│   └── verify-email/             # Email verification (after registration)
│       └── page.tsx
```

### Tenant Routes (Renter-Specific)

```
app/
├── (tenant)/                     # Route group: Tenant dashboard
│   ├── layout.tsx                # Tenant layout (sidebar: Profile, Applications, Saved Listings, Settings)
│   │
│   ├── dashboard/                # Tenant dashboard (home)
│   │   └── page.tsx              # Overview: Active applications, CRM matches, profile status
│   │
│   ├── profile/                  # Tenant profile management
│   │   ├── page.tsx              # Profile overview (verification status, reusability)
│   │   ├── edit/                 # Edit profile
│   │   │   └── page.tsx
│   │   ├── documents/            # Document management
│   │   │   └── page.tsx          # Upload pay stubs, ID, references
│   │   └── verification/         # Verification steps
│   │       ├── identity/         # Identity verification (Onfido integration)
│   │       │   └── page.tsx
│   │       ├── income/           # Income verification (Plaid integration)
│   │       │   └── page.tsx
│   │       ├── credit/           # Credit authorization
│   │       │   └── page.tsx
│   │       └── background/       # Background check authorization
│   │           └── page.tsx
│   │
│   ├── applications/             # Application management
│   │   ├── page.tsx              # List of all applications (status, timeline)
│   │   └── [applicationId]/      # Individual application detail
│   │       └── page.tsx          # Application status, landlord messages, next steps
│   │
│   ├── saved-listings/           # Saved/favorited listings
│   │   └── page.tsx              # Listings saved during search
│   │
│   ├── payments/                 # Payment history
│   │   └── page.tsx              # Screening fees paid, rent payments (if tenant)
│   │
│   └── settings/                 # Tenant account settings
│       ├── page.tsx              # General settings
│       ├── notifications/        # Notification preferences
│       │   └── page.tsx
│       └── privacy/              # Privacy settings (GDPR/CCPA data export)
│           └── page.tsx
```

### Agent Routes (Leasing Agent / Property Manager)

```
app/
├── (agent)/                      # Route group: Agent dashboard
│   ├── layout.tsx                # Agent layout (sidebar: Listings, Applicants, CRM, Analytics, Settings)
│   │
│   ├── dashboard/                # Agent dashboard (home)
│   │   └── page.tsx              # KPIs: Active listings, applicants, days-to-fill, CRM matches
│   │
│   ├── listings/                 # Listing management
│   │   ├── page.tsx              # List of all listings (active, pending, rented)
│   │   ├── create/               # Create new listing
│   │   │   └── page.tsx
│   │   └── [listingId]/          # Individual listing management
│   │       ├── page.tsx          # Listing overview, edit, syndication status
│   │       ├── edit/             # Edit listing
│   │       │   └── page.tsx
│   │       ├── applicants/       # Applicants for this listing
│   │       │   └── page.tsx      # Obfuscated applicant profiles, shortlist, compare
│   │       └── analytics/        # Listing analytics
│   │           └── page.tsx      # Views, inquiries, application rate
│   │
│   ├── applicants/               # All applicants (across all listings)
│   │   ├── page.tsx              # Unified applicant dashboard (filterable, sortable)
│   │   └── [applicantId]/        # Individual applicant detail
│   │       └── page.tsx          # Obfuscated profile, communication history, internal notes
│   │
│   ├── crm/                      # CRM (denied applicants)
│   │   ├── page.tsx              # CRM dashboard (warm leads, match score, last contacted)
│   │   └── [leadId]/             # Individual CRM lead
│   │       └── page.tsx          # Lead profile, match history, outreach history
│   │
│   ├── calendar/                 # Showing calendar
│   │   └── page.tsx              # Calendar view of scheduled showings
│   │
│   ├── messages/                 # Messaging (applicants, landlords)
│   │   └── page.tsx              # Unified inbox (all conversations)
│   │
│   ├── analytics/                # Agent analytics
│   │   └── page.tsx              # Performance metrics, conversion rates, time-to-fill
│   │
│   └── settings/                 # Agent account settings
│       ├── page.tsx              # General settings
│       ├── team/                 # Team management (if agency has multiple agents)
│       │   └── page.tsx
│       ├── billing/              # Subscription billing
│       │   └── page.tsx
│       └── notifications/        # Notification preferences
│           └── page.tsx
```

### Landlord Routes

```
app/
├── (landlord)/                   # Route group: Landlord dashboard
│   ├── layout.tsx                # Landlord layout (sidebar: Properties, Applicants, Leases, Settings)
│   │
│   ├── dashboard/                # Landlord dashboard (home)
│   │   └── page.tsx              # Overview: Vacant units, pending decisions, rent payments
│   │
│   ├── properties/               # Property management
│   │   ├── page.tsx              # List of all properties owned
│   │   ├── create/               # Add new property
│   │   │   └── page.tsx
│   │   └── [propertyId]/         # Individual property management
│   │       ├── page.tsx          # Property overview (units, leases, financials)
│   │       └── units/            # Units within property
│   │           └── [unitId]/
│   │               └── page.tsx  # Unit details, current tenant, lease expiration
│   │
│   ├── listings/                 # Vacant unit listings
│   │   ├── page.tsx              # Active listings (managed by agent or self-managed)
│   │   └── [listingId]/          # Individual listing
│   │       ├── page.tsx          # Listing details, applicants awaiting decision
│   │       └── applicants/       # Obfuscated applicant review
│   │           └── page.tsx      # Shortlisted applicants, comparison tool, decision UI
│   │
│   ├── leases/                   # Lease management
│   │   ├── page.tsx              # All leases (active, expiring, archived)
│   │   └── [leaseId]/            # Individual lease
│   │       ├── page.tsx          # Lease details, tenant info (post-selection), documents
│   │       └── renew/            # Lease renewal workflow
│   │           └── page.tsx
│   │
│   ├── payments/                 # Rent payments
│   │   └── page.tsx              # Payment history, auto-pay status, late fees
│   │
│   ├── maintenance/              # Maintenance requests
│   │   └── page.tsx              # Tenant-submitted requests, work order tracking
│   │
│   └── settings/                 # Landlord account settings
│       ├── page.tsx              # General settings
│       ├── billing/              # Subscription billing (if using compliance tier)
│       │   └── page.tsx
│       └── notifications/        # Notification preferences
│           └── page.tsx
```

### Admin Routes (Internal Operations)

```
app/
├── (admin)/                      # Route group: Admin dashboard (ApartmentDibs staff only)
│   ├── layout.tsx                # Admin layout (full-width, no sidebar)
│   │
│   ├── dashboard/                # Admin dashboard
│   │   └── page.tsx              # Platform-wide metrics, active users, revenue
│   │
│   ├── users/                    # User management
│   │   ├── page.tsx              # List of all users (tenants, agents, landlords)
│   │   └── [userId]/             # Individual user management
│   │       └── page.tsx          # Impersonate user, view audit logs, ban/suspend
│   │
│   ├── listings/                 # Listing moderation
│   │   └── page.tsx              # Flagged listings, fraud detection, manual review
│   │
│   ├── compliance/               # Compliance monitoring
│   │   ├── page.tsx              # Fair housing alerts, audit trail access
│   │   └── rules/                # Compliance rule management
│   │       └── page.tsx          # Update jurisdiction-specific rules
│   │
│   ├── support/                  # Customer support
│   │   ├── page.tsx              # Support tickets, live chat queue
│   │   └── [ticketId]/           # Individual support ticket
│   │       └── page.tsx
│   │
│   ├── analytics/                # Platform analytics
│   │   └── page.tsx              # User acquisition, churn, revenue, feature usage
│   │
│   └── settings/                 # Admin settings
│       ├── page.tsx              # Platform configuration
│       └── team/                 # Admin team management
│           └── page.tsx
```

---

## api/ Routes (tRPC, Webhooks, Third-Party Integrations)

```
app/
├── api/                          # API routes
│   │
│   ├── trpc/                     # tRPC API endpoints
│   │   └── [trpc]/
│   │       └── route.ts          # tRPC handler (handles all tRPC procedures)
│   │
│   ├── webhooks/                 # Third-party webhooks
│   │   ├── stripe/               # Stripe webhook (payment events)
│   │   │   └── route.ts
│   │   ├── plaid/                # Plaid webhook (income verification)
│   │   │   └── route.ts
│   │   ├── checkr/               # Checkr webhook (background check completion)
│   │   │   └── route.ts
│   │   ├── onfido/               # Onfido webhook (identity verification)
│   │   │   └── route.ts
│   │   └── transunion/           # TransUnion webhook (credit report ready)
│   │       └── route.ts
│   │
│   ├── auth/                     # Auth.js API routes
│   │   └── [...nextauth]/
│   │       └── route.ts          # NextAuth.js handler (OAuth, credentials)
│   │
│   ├── upload/                   # File upload endpoint
│   │   └── route.ts              # Handle document uploads (pay stubs, ID, etc.)
│   │
│   ├── export/                   # Data export (GDPR/CCPA)
│   │   └── route.ts              # Generate user data export (JSON, CSV)
│   │
│   └── health/                   # Health check endpoint
│       └── route.ts              # GET /api/health (uptime monitoring)
```

---

## src/ Directory (Shared Non-Route Code)

```
src/
├── components/                   # Shared React components (shadcn/ui + custom)
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   └── ...                   # All shadcn/ui components
│   │
│   ├── layout/                   # Layout components
│   │   ├── header.tsx            # Global header (logo, nav, auth buttons)
│   │   ├── footer.tsx            # Global footer (links, copyright)
│   │   ├── sidebar.tsx           # Dashboard sidebar (nav links)
│   │   └── mobile-nav.tsx        # Mobile navigation menu
│   │
│   ├── forms/                    # Form components
│   │   ├── profile-form.tsx      # Tenant profile creation form
│   │   ├── listing-form.tsx      # Agent listing creation form
│   │   ├── application-form.tsx  # Tenant application form
│   │   └── ...                   # Other forms
│   │
│   ├── listings/                 # Listing-specific components
│   │   ├── listing-card.tsx      # Listing preview card (search results)
│   │   ├── listing-gallery.tsx   # Photo gallery (lightbox)
│   │   ├── listing-map.tsx       # Embedded map (Google Maps)
│   │   └── ...
│   │
│   ├── applicants/               # Applicant-specific components
│   │   ├── applicant-card.tsx    # Obfuscated applicant card (landlord view)
│   │   ├── comparison-table.tsx  # Side-by-side applicant comparison
│   │   └── ...
│   │
│   └── compliance/               # Compliance-related components
│       ├── audit-trail.tsx       # Audit log viewer
│       ├── adverse-action.tsx    # Adverse action letter generator
│       └── ...
│
├── server/                       # Server-side code (tRPC, database)
│   ├── api/                      # tRPC routers
│   │   ├── routers/              # Feature-specific routers
│   │   │   ├── tenant.ts         # Tenant-related procedures (profile, applications)
│   │   │   ├── agent.ts          # Agent-related procedures (listings, applicants)
│   │   │   ├── landlord.ts       # Landlord-related procedures (properties, decisions)
│   │   │   ├── listing.ts        # Listing management procedures
│   │   │   ├── application.ts    # Application workflow procedures
│   │   │   ├── crm.ts            # CRM procedures (lead matching)
│   │   │   ├── compliance.ts     # Compliance procedures (audit logs, adverse action)
│   │   │   └── ...
│   │   ├── trpc.ts               # tRPC context & initialization
│   │   └── root.ts               # Root router (combines all routers)
│   │
│   ├── db.ts                     # Prisma client instance
│   │
│   ├── auth.ts                   # Auth.js configuration
│   │
│   └── services/                 # Business logic services
│       ├── verification/         # Verification services
│       │   ├── identity.ts       # Onfido integration
│       │   ├── income.ts         # Plaid integration
│       │   ├── credit.ts         # TransUnion integration
│       │   └── background.ts     # Checkr integration
│       │
│       ├── compliance/           # Compliance services
│       │   ├── pii-scrubbing.ts  # PII anonymization engine
│       │   ├── audit-trail.ts    # Audit log generation
│       │   ├── adverse-action.ts # Adverse action letter generation
│       │   └── rules-engine.ts   # Location-aware compliance rules
│       │
│       ├── payments/             # Payment services
│       │   └── stripe.ts         # Stripe integration
│       │
│       ├── messaging/            # Messaging services
│       │   ├── email.ts          # SendGrid integration
│       │   ├── sms.ts            # Twilio integration
│       │   └── push.ts           # Firebase Cloud Messaging
│       │
│       └── syndication/          # Listing syndication services
│           ├── zillow.ts         # Zillow API integration
│           ├── apartments.ts     # Apartments.com integration
│           ├── craigslist.ts     # Craigslist API integration
│           └── ...
│
├── lib/                          # Utility libraries
│   ├── utils.ts                  # General utilities (classNames, formatters)
│   ├── validators.ts             # Zod schemas (form validation)
│   ├── constants.ts              # App-wide constants
│   └── ...
│
├── hooks/                        # Custom React hooks
│   ├── use-user.ts               # Access current user (Auth.js session)
│   ├── use-listings.ts           # Fetch listings (tRPC query)
│   ├── use-applications.ts       # Fetch applications (tRPC query)
│   └── ...
│
└── types/                        # TypeScript type definitions
    ├── api.ts                    # API response types
    ├── models.ts                 # Database model types (Prisma-generated)
    └── ...
```

---

## prisma/ Directory (Database Schema)

```
prisma/
├── schema.prisma                 # Prisma schema (ZenStack enhanced)
├── migrations/                   # Database migrations (auto-generated)
│   └── 20241118_initial_schema/
│       └── migration.sql
└── seed.ts                       # Database seeding script (test data)
```

---

## public/ Directory (Static Assets)

```
public/
├── images/                       # Static images
│   ├── logo.svg                  # ApartmentDibs logo
│   ├── hero.jpg                  # Homepage hero image
│   └── ...
│
├── icons/                        # Icon assets (if not using icon library)
│   └── ...
│
├── fonts/                        # Custom fonts (if any)
│   └── ...
│
└── favicon.ico                   # Favicon
```

---

## Configuration Files (Root)

```
apartmentdibs/
├── .env                          # Environment variables (git-ignored)
│   # Example contents:
│   # DATABASE_URL=postgresql://user:pass@localhost:5432/apartmentdibs
│   # NEXTAUTH_SECRET=your_secret_here
│   # STRIPE_SECRET_KEY=sk_test_...
│   # TRANSUNION_API_KEY=...
│   # PLAID_CLIENT_ID=...
│   # etc.
│
├── .env.example                  # Example env vars (committed to git)
│
├── next.config.mjs               # Next.js configuration
│   # - Enable experimental features (PPR, taint)
│   # - Configure image domains (for uploaded photos)
│   # - Set up redirects, rewrites
│
├── package.json                  # Dependencies
│   # Key dependencies:
│   # - next@15
│   # - react@19
│   # - @prisma/client
│   # - @trpc/server@11
│   # - @tanstack/react-query@5
│   # - next-auth@5
│   # - stripe
│   # - zod
│   # - tailwindcss@4
│
├── tailwind.config.ts            # Tailwind CSS v4 configuration
│   # - Configure theme colors, fonts
│   # - Add shadcn/ui plugin
│
├── tsconfig.json                 # TypeScript configuration
│   # - Set strict mode, path aliases (@/)
│
├── zenstack.config.ts            # ZenStack configuration
│   # - Generate Zod schemas, tRPC routers
│
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
└── README.md                     # Project documentation
```

---

## Middleware (app/middleware.ts)

```typescript
// app/middleware.ts
// Runs on every request (authentication, compliance checks)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Authentication check
  // - Redirect unauthenticated users to /login
  // - Allow access to (public) routes without auth

  // 2. Role-based access control
  // - Check if user has permission to access (agent) routes
  // - Redirect if unauthorized

  // 3. Compliance checks
  // - Log all PII access attempts (for audit trail)
  // - Block access to PII if landlord hasn't selected applicant

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/(tenant|agent|landlord|admin)/:path*', // Protected routes
    '/api/:path*', // Protect API routes
  ],
}
```

---

## Route Group Conventions

### Layout Inheritance

- **`(public)/layout.tsx`**: Public header/footer, no auth
- **`(tenant)/layout.tsx`**: Tenant sidebar, auth required
- **`(agent)/layout.tsx`**: Agent sidebar, auth required
- **`(landlord)/layout.tsx`**: Landlord sidebar, auth required
- **`(admin)/layout.tsx`**: Admin full-width layout, admin role required

### Parallel Routes (Future Enhancement)

- **`@modal`**: Modal overlays (e.g., applicant detail modal)
  ```
  app/(agent)/listings/[listingId]/@modal/applicant/[applicantId]/page.tsx
  ```
- **`@sidebar`**: Dynamic sidebar content
  ```
  app/(agent)/dashboard/@sidebar/default.tsx
  ```

### Intercepting Routes (Future Enhancement)

- **Intercept applicant detail**: Open modal instead of full page
  ```
  app/(agent)/listings/[listingId]/(..)applicant/[applicantId]/page.tsx
  ```

---

## Mobile App Structure (React Native - Future)

**Note:** This is a separate codebase (not in Next.js app), but shares API via tRPC.

```
apartmentdibs-mobile/
├── app/                          # Expo Router (similar structure to Next.js)
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── search.tsx            # Search tab (tenant)
│   │   ├── applications.tsx      # Applications tab (tenant)
│   │   ├── profile.tsx           # Profile tab (tenant)
│   │   └── settings.tsx          # Settings tab
│   │
│   ├── listing/[id].tsx          # Listing detail (modal)
│   └── ...
│
├── src/
│   ├── components/               # Shared React Native components
│   ├── services/                 # tRPC client, API calls
│   └── ...
│
└── package.json                  # Dependencies (react-native, expo, @trpc/client)
```

---

## Key Routing Patterns

### 1. Dynamic Routes

```
app/search/[listingId]/page.tsx
// Accessible via: /search/abc-123
// Params: { listingId: "abc-123" }
```

### 2. Catch-All Routes

```
app/blog/[...slug]/page.tsx
// Matches: /blog/a, /blog/a/b, /blog/a/b/c
// Params: { slug: ["a", "b", "c"] }
```

### 3. Optional Catch-All Routes

```
app/docs/[[...slug]]/page.tsx
// Matches: /docs, /docs/a, /docs/a/b
// Params: { slug: undefined | ["a"] | ["a", "b"] }
```

### 4. Route Groups (No URL Segment)

```
app/(tenant)/dashboard/page.tsx
// URL: /dashboard (NOT /tenant/dashboard)
```

### 5. Private Folders (Excluded from Routing)

```
app/_components/Header.tsx
// NOT accessible via URL (underscore prefix)
```

---

## API Route Patterns

### tRPC Endpoints (Type-Safe)

```typescript
// app/api/trpc/[trpc]/route.ts
// Handles all tRPC procedures:
// - tenant.getProfile
// - agent.listListings
// - landlord.reviewApplicants
// etc.
```

### REST Endpoints (Webhooks Only)

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const payload = await request.text()
  const sig = request.headers.get('stripe-signature')
  // Verify webhook, process event
}
```

---

## Server Component vs. Client Component Strategy

### Server Components (Default)

- All `page.tsx` files are Server Components by default
- Used for: Data fetching, SEO optimization, reduced client bundle size
- Example: `app/(public)/search/page.tsx` fetches listings server-side

### Client Components (Use Sparingly)

- Add `'use client'` directive at top of file
- Used for: Interactivity (forms, modals, dropdowns), browser APIs
- Example: `src/components/forms/profile-form.tsx` (form with validation)

### Hybrid Approach

- Server Component wraps Client Component
- Server Component fetches data, Client Component handles interactions

---

_This site map should be updated as new features are added or routing patterns change._
