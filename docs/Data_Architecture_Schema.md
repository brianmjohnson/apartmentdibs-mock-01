# ApartmentDibs Data Architecture & Schema

## Overview

This document defines the complete data architecture for ApartmentDibs, with particular emphasis on:

1. **PII Security & Separation** - How personally identifiable information is isolated and protected
2. **Compliance Architecture** - Audit trails, adverse action tracking, GDPR/CCPA compliance
3. **Performance Optimization** - Indexing strategy, caching, query patterns
4. **Scalability** - Partitioning, replication, read replicas

**Core Principle:** PII must be stored separately from business logic, encrypted at rest, and accessed only when legally permitted (post-selection by landlord).

---

## Technology Stack

- **Database:** PostgreSQL 16+ (supports JSONB, row-level security, advanced indexing)
- **ORM:** Prisma 5+ (TypeScript-first, migration management)
- **Schema Enhancement:** ZenStack v2 (access control, Zod schema generation)
- **Caching:** Redis (session data, obfuscated profiles, CRM match results)
- **Search:** OpenSearch (full-text search for listings, applicants)
- **File Storage:** AWS S3 (encrypted at rest, presigned URLs for secure access)
- **Encryption:** AES-256 for PII at rest, TLS 1.3 for data in transit

---

## Entity Relationship Diagram (High-Level)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│     User     │───────│    Person    │───────│PersonAddress │
└──────────────┘       └──────────────┘       │PersonEmail   │
       │                      │                │PersonPhone   │
       │                      │                └──────────────┘
       │                      │
       │              ┌───────┴───────┐
       │              │               │
       │         ┌────────┐      ┌────────┐
       │         │ Tenant │      │Landlord│
       │         │Profile │      │        │
       │         └────────┘      └────────┘
       │              │               │
       │              │               │
       │         ┌────────────┐  ┌────────────┐
       │         │Application │  │  Property  │
       │         └────────────┘  └────────────┘
       │              │               │
       │              │               │
       │         ┌────────────┐  ┌────────────┐
       │         │   Lease    │──│   Listing  │
       │         └────────────┘  └────────────┘
       │                              │
       │                              │
       │                         ┌────────────┐
       └─────────────────────────│   Agent    │
                                 └────────────┘
```

---

## Core Entities

### 1. User (Authentication & Access Control)

**Purpose:** Authentication identity, role-based access control (RBAC)

```prisma
model User {
  id                String   @id @default(uuid())
  email             String   @unique
  emailVerified     DateTime?

  // Auth fields
  password          String?  // Nullable if OAuth
  hashedPassword    String?  // bcrypt hash

  // OAuth fields
  oauthProvider     String?  // "google", "apple", "facebook"
  oauthId           String?  // Provider's user ID

  // Role (enum)
  role              UserRole @default(TENANT)

  // Account status
  status            UserStatus @default(ACTIVE)
  emailVerifiedAt   DateTime?
  phoneVerifiedAt   DateTime?

  // Sessions (NextAuth.js)
  sessions          Session[]
  accounts          Account[]

  // Relationships
  person            Person?   // 1:1 relationship (nullable for admin-only users)

  // Audit fields
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastLoginAt       DateTime?

  @@index([email])
  @@index([role])
}

enum UserRole {
  TENANT
  AGENT
  LANDLORD
  ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  BANNED
  DELETED  // Soft delete (GDPR right to deletion)
}
```

**Security Notes:**

- Passwords hashed with bcrypt (cost factor: 12)
- Email verification required before account activation
- Sessions stored in database (not JWT) for revocation capability
- Role-based access control enforced at database level (ZenStack policies)

---

### 2. Person (PII Storage - Encrypted)

**Purpose:** Store personally identifiable information (PII) separately from User table

**CRITICAL:** This table contains sensitive PII and must be:

1. Encrypted at rest (PostgreSQL TDE or AWS RDS encryption)
2. Accessed only via row-level security (RLS) policies
3. Never directly queried by client code (always via tRPC procedures with access control)

```prisma
model Person {
  id                String   @id @default(uuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // PII fields (ENCRYPTED)
  firstName         String   // AES-256 encrypted
  middleName        String?
  lastName          String   // AES-256 encrypted
  dateOfBirth       DateTime // AES-256 encrypted
  ssn               String?  // AES-256 encrypted (last 4 digits only, full SSN for screening services)

  // Photo (stored in S3, presigned URLs)
  photoUrl          String?  // S3 key: "persons/{personId}/profile.jpg"

  // Contact info (JSONB with strong typing)
  emails            Json     // [{ type: "personal", email: "...", verified: true, primary: true }]
  phones            Json     // [{ type: "mobile", number: "...", verified: true, primary: true }]
  addresses         Json     // [{ type: "current", street: "...", city: "...", state: "...", zip: "...", country: "US" }]

  // Relationships
  tenantProfile     TenantProfile?
  landlordProfile   LandlordProfile?
  agentProfile      AgentProfile?

  // Audit fields
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  piiAccessedBy     Json[]   // Log of who accessed PII (userId, timestamp, reason)

  @@index([userId])
}

// TypeScript type for emails JSONB field
type PersonEmail = {
  type: "personal" | "work" | "other";
  email: string;
  verified: boolean;
  primary: boolean;
  verifiedAt?: Date;
};

// TypeScript type for phones JSONB field
type PersonPhone = {
  type: "mobile" | "home" | "work";
  number: string; // E.164 format: +12125551234
  verified: boolean;
  primary: boolean;
  verifiedAt?: Date;
};

// TypeScript type for addresses JSONB field
type PersonAddress = {
  type: "current" | "previous" | "mailing";
  street: string;
  unit?: string;
  city: string;
  state: string; // 2-letter abbreviation
  zip: string;
  country: string; // ISO 3166-1 alpha-2 (e.g., "US")
  isPrimary: boolean;
  moveInDate?: Date;
  moveOutDate?: Date;
};
```

**Row-Level Security (RLS) Policy:**

```sql
-- Enable RLS on Person table
ALTER TABLE "Person" ENABLE ROW LEVEL SECURITY;

-- Policy 1: User can access their own PII
CREATE POLICY person_access_own
ON "Person"
FOR SELECT
USING (auth.uid() = "userId");

-- Policy 2: Admin can access all PII (with audit logging)
CREATE POLICY person_access_admin
ON "Person"
FOR SELECT
USING (auth.role() = 'ADMIN');

-- Policy 3: Landlord can access PII only if applicant selected
CREATE POLICY person_access_landlord_post_selection
ON "Person"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "Application" a
    WHERE a."tenantProfileId" IN (
      SELECT id FROM "TenantProfile" WHERE "personId" = "Person".id
    )
    AND a."status" = 'SELECTED'
    AND a."landlordId" = auth.uid()
  )
);
```

**Encryption Implementation:**

- Use PostgreSQL `pgcrypto` extension for column-level encryption
- Or use AWS RDS encryption-at-rest (transparent data encryption)
- Or use application-level encryption (encrypt before INSERT, decrypt after SELECT)

**Example Application-Level Encryption (TypeScript):**

```typescript
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.PERSON_PII_ENCRYPTION_KEY! // 32-byte key
const IV_LENGTH = 16

export function encryptPII(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decryptPII(text: string): string {
  const [ivHex, encryptedHex] = text.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString()
}
```

---

### 3. TenantProfile (Obfuscated Data + Verification Status)

**Purpose:** Store tenant-specific data (income, credit, background check) with anonymized IDs for landlord review

```prisma
model TenantProfile {
  id                   String   @id @default(uuid())
  personId             String   @unique
  person               Person   @relation(fields: [personId], references: [id], onDelete: Cascade)

  // Anonymized ID (visible to landlords pre-selection)
  applicantId          String   @unique // "Applicant #2847"

  // Profile tier (determines features unlocked)
  profileTier          ProfileTier @default(BASIC)
  profileExpiresAt     DateTime // 60-90 days from creation

  // Verification status (badges)
  identityVerified     Boolean @default(false)
  incomeVerified       Boolean @default(false)
  creditVerified       Boolean @default(false)
  backgroundVerified   Boolean @default(false)

  // Verification timestamps
  identityVerifiedAt   DateTime?
  incomeVerifiedAt     DateTime?
  creditVerifiedAt     DateTime?
  backgroundVerifiedAt DateTime?

  // Obfuscated data (visible to landlords pre-selection)
  incomeToRentRatio    Float?   // e.g., 4.1 (calculated from income / target rent)
  creditScoreBand      String?  // e.g., "740-760" (not exact score)
  employmentTenure     String?  // e.g., "3+ years stable employment"
  rentalHistorySummary String?  // e.g., "No evictions, positive references"
  backgroundCheckStatus String? // e.g., "Pass" or "Pass (misdemeanor 8 years ago per Fair Chance Act)"

  // Full verification data (encrypted, accessible post-selection only)
  verificationData     Json?    // {identityReport: {...}, incomeReport: {...}, creditReport: {...}, backgroundReport: {...}}

  // Preferences (for CRM matching)
  budgetMin            Int?
  budgetMax            Int?
  preferredNeighborhoods String[] // ['Williamsburg', 'Park Slope']
  moveInStart          DateTime?
  moveInEnd            DateTime?
  mustHaves            String[] // ['in_unit_washer_dryer', 'pet_friendly']
  niceToHaves          String[]

  // Relationships
  applications         Application[]
  crmLeads             CrmLead[]

  // Audit fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([applicantId])
  @@index([profileExpiresAt])
  @@index([identityVerified, incomeVerified, creditVerified, backgroundVerified])
}

enum ProfileTier {
  BASIC   // $39.99: Basic screening, 60-day validity
  PREMIUM // $54.99: Comprehensive screening, 90-day validity, income via Plaid
  GROUP   // $99.99: Roommate screening (2-4 applicants)
}
```

**Key Design Decisions:**

1. **Obfuscated Data Separation:**
   - `incomeToRentRatio`, `creditScoreBand`, etc. are **denormalized** (duplicated from verificationData)
   - This allows landlords to view objective metrics without seeing PII
   - Full verification reports (with PII) stored in encrypted `verificationData` JSONB field

2. **Applicant ID:**
   - Auto-generated on profile creation: "Applicant #" + random 4-digit number
   - Visible to landlords/agents pre-selection (replaces tenant's real name)

3. **Verification Data Structure (verificationData JSONB):**

```typescript
type VerificationData = {
  identity: {
    provider: 'onfido' | 'persona'
    reportId: string
    status: 'verified' | 'failed'
    documentType: 'drivers_license' | 'passport'
    documentNumber: string // Encrypted
    issuingCountry: string
    expiryDate: Date
    livenessCheck: boolean
    verifiedAt: Date
  }
  income: {
    provider: 'plaid' | 'manual'
    reportId?: string // Plaid report ID
    annualIncome: number // Encrypted
    employerName: string // Encrypted
    employmentStatus: 'employed' | 'self_employed' | 'unemployed'
    employmentStartDate: Date
    incomeFrequency: 'monthly' | 'biweekly' | 'weekly'
    verifiedAt: Date
  }
  credit: {
    provider: 'transunion' | 'experian' | 'equifax'
    reportId: string
    creditScore: number // Encrypted (exact score, not band)
    publicRecords: number
    collections: number
    latePayments: number
    reportDate: Date
  }
  background: {
    provider: 'checkr' | 'goodhire'
    reportId: string
    criminalRecords: {
      offense: string
      date: Date
      jurisdiction: string
      severity: 'felony' | 'misdemeanor'
    }[]
    evictionHistory: {
      filingDate: Date
      court: string
      outcome: 'evicted' | 'dismissed' | 'settled'
    }[]
    sexOffenderRegistry: boolean
    reportDate: Date
  }
}
```

---

### 4. Application (Tenant → Listing Connection)

**Purpose:** Track application lifecycle, manage bidding, log decision rationale

```prisma
model Application {
  id                   String   @id @default(uuid())

  // Relationships
  tenantProfileId      String
  tenantProfile        TenantProfile @relation(fields: [tenantProfileId], references: [id])

  listingId            String
  listing              Listing @relation(fields: [listingId], references: [id])

  landlordId           String   // Denormalized for performance (also in Listing)
  agentId              String?  // Optional (self-managed landlords have no agent)

  // Application status
  status               ApplicationStatus @default(SUBMITTED)

  // Competitive bidding
  bidRent              Int?     // Offered rent (may be higher than asking)
  bidLeaseTerm         Int?     // Offered lease length (months)
  bidMoveInDate        DateTime?
  bidPrepayment        Int?     // Months of rent prepaid (e.g., 6 months)

  // Personal note (PII-scrubbed by NLP)
  personalNote         String?  // Max 200 characters
  personalNoteRaw      String?  // Original note (before PII scrubbing, encrypted)

  // Decision tracking
  selectedAt           DateTime?
  deniedAt             DateTime?
  denialReason         String?  // Required if denied (for adverse action letter)
  denialReasonCategory DenialReason?

  // Adverse action tracking
  adverseActionSentAt  DateTime?
  adverseActionViewed  Boolean @default(false)
  adverseActionViewedAt DateTime?

  // Audit trail
  landlordViewedAt     DateTime[] // Array of timestamps (every time landlord viewed)
  landlordFilteredOut  Boolean @default(false)
  landlordFilterReason String?

  // Relationships
  lease                Lease?   // 1:1 (only if application selected)

  // Audit fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([tenantProfileId, status])
  @@index([listingId, status])
  @@index([landlordId, status])
  @@index([status, createdAt])
}

enum ApplicationStatus {
  DRAFT          // Tenant started but didn't submit
  SUBMITTED      // Tenant submitted application
  UNDER_REVIEW   // Agent/landlord reviewing
  SHORTLISTED    // Moved to landlord's shortlist
  SELECTED       // Landlord selected this applicant
  DENIED         // Landlord denied
  WITHDRAWN      // Tenant withdrew application
  EXPIRED        // Application older than 14 days, no response
}

enum DenialReason {
  INCOME_BELOW_MINIMUM      // "Applicant's income-to-rent ratio below threshold"
  CREDIT_BELOW_MINIMUM      // "Applicant's credit score below threshold"
  EVICTION_HISTORY          // "Applicant has eviction within restriction period"
  BACKGROUND_CHECK_FAILED   // "Applicant failed background check"
  BETTER_APPLICANT_INCOME   // "Another applicant had higher income-to-rent ratio"
  BETTER_APPLICANT_CREDIT   // "Another applicant had higher credit score"
  BETTER_APPLICANT_OFFER    // "Another applicant offered longer lease term / higher rent"
  OTHER                     // Free-text reason (must be FCRA-compliant)
}
```

**Audit Trail Implementation:**

- Every landlord/agent action logged in `AuditLog` table (see below)
- `landlordViewedAt` array tracks every view (prove consistent evaluation)
- `denialReasonCategory` enforces FCRA-compliant reasons (prevent discriminatory text)

---

### 5. Listing (Property → Tenant Marketplace)

**Purpose:** Advertise vacant units, define screening criteria, track applicant funnel

```prisma
model Listing {
  id                   String   @id @default(uuid())

  // Relationships
  propertyId           String
  property             Property @relation(fields: [propertyId], references: [id])

  landlordId           String   // Owner of property
  agentId              String?  // Optional (self-managed landlords)

  // Listing details
  title                String   // "Spacious 1BR in Williamsburg"
  description          String   @db.Text

  // Rent details
  rent                 Int      // Monthly rent in cents (e.g., 300000 = $3,000)
  securityDeposit      Int      // In cents
  brokerFee            Int?     // In cents (optional)
  applicationFee       Int @default(0) // Usually $0 (landlord pays subscription)

  // Lease terms
  leaseTerm            Int      // Months (e.g., 12)
  availableDate        DateTime

  // Photos & media
  photos               String[] // S3 keys: ["listings/{listingId}/photo1.jpg", ...]
  floorPlanUrl         String?  // S3 key for floor plan PDF
  videoTourUrl         String?  // YouTube/Vimeo embed URL

  // Amenities (JSONB for flexibility)
  amenities            Json     // {inUnitWasherDryer: true, dishwasher: true, gym: false, ...}

  // Screening criteria (HARD)
  minCreditScore       Int @default(600)
  minIncomeRatio       Float @default(3.0) // 3x rent
  maxEvictions         Int @default(0)
  backgroundCheckRules Json     // {allowMisdemeanors: true, felonyLookbackYears: 10}

  // Preferences (SOFT)
  preferredLeaseTerm   Int?
  preferredMoveInDate  DateTime?
  petPolicy            PetPolicy @default(NO_PETS)

  // Status
  status               ListingStatus @default(ACTIVE)

  // Syndication tracking
  syndicatedTo         Json     // {zillow: {id: "...", url: "...", status: "published"}, apartments: {...}}

  // QR code (for physical signs)
  qrCodeUrl            String?  // S3 key: "listings/{listingId}/qr.png"

  // Relationships
  applications         Application[]

  // Audit fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  publishedAt          DateTime?
  closedAt             DateTime? // When marked as rented

  @@index([landlordId, status])
  @@index([agentId, status])
  @@index([status, availableDate])
}

enum ListingStatus {
  DRAFT       // Agent created but not published
  ACTIVE      // Published and accepting applications
  PENDING     // Offer extended, awaiting lease signing
  RENTED      // Lease signed, unit occupied
  ARCHIVED    // Removed from platform
}

enum PetPolicy {
  NO_PETS
  CATS_ONLY
  DOGS_ONLY
  CATS_AND_DOGS
  SMALL_DOGS  // <30 lbs
  CASE_BY_CASE
}
```

**Compliance Features:**

- `backgroundCheckRules` enforces jurisdiction-specific rules (e.g., NYC Fair Chance Act)
- `minCreditScore`, `minIncomeRatio` applied consistently to all applicants (audit trail proves consistency)
- `syndicatedTo` tracks listing visibility across platforms (Zillow, Apartments.com, etc.)

---

### 6. Property (Landlord's Real Estate Asset)

**Purpose:** Store property-level information (address, units, ownership)

```prisma
model Property {
  id                   String   @id @default(uuid())

  // Relationships
  landlordId           String
  landlord             LandlordProfile @relation(fields: [landlordId], references: [id])

  // Address
  street               String
  unit                 String?
  city                 String
  state                String   // 2-letter abbreviation
  zip                  String
  country              String @default("US")

  // Geocoding (for map display, proximity search)
  latitude             Float?
  longitude            Float?

  // Property details
  propertyType         PropertyType
  yearBuilt            Int?
  totalUnits           Int @default(1)

  // Relationships
  listings             Listing[]
  leases               Lease[]

  // Audit fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([landlordId])
  @@index([city, state, zip])
  @@index([latitude, longitude]) // For geo-proximity queries
}

enum PropertyType {
  SINGLE_FAMILY
  MULTI_FAMILY_2_4   // 2-4 units (duplex, triplex, quadplex)
  MULTI_FAMILY_5_PLUS // 5+ units (apartment building)
  CONDO
  TOWNHOUSE
  CO_OP
}
```

---

### 7. Lease (Post-Selection Agreement)

**Purpose:** Store lease agreement, rent payment tracking, maintenance requests

```prisma
model Lease {
  id                   String   @id @default(uuid())

  // Relationships
  applicationId        String   @unique
  application          Application @relation(fields: [applicationId], references: [id])

  tenantProfileId      String
  landlordId           String
  propertyId           String
  property             Property @relation(fields: [propertyId], references: [id])

  // Lease terms
  startDate            DateTime
  endDate              DateTime
  rent                 Int      // Monthly rent in cents
  securityDeposit      Int      // In cents

  // Lease document (DocuSign or HelloSign)
  leaseDocumentUrl     String   // S3 key: "leases/{leaseId}/lease.pdf"
  signedAt             DateTime?
  tenantSignedAt       DateTime?
  landlordSignedAt     DateTime?

  // Pet details (if applicable)
  petDeposit           Int?
  petRent              Int?     // Monthly pet rent
  petDescription       String?  // "Golden Retriever, 25 lbs, named Max"

  // Lease status
  status               LeaseStatus @default(ACTIVE)

  // Rent payments
  rentPayments         RentPayment[]

  // Maintenance requests
  maintenanceRequests  MaintenanceRequest[]

  // Renewal tracking
  renewalOffered       Boolean @default(false)
  renewalOfferedAt     DateTime?
  renewalAccepted      Boolean?

  // Audit fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  terminatedAt         DateTime?

  @@index([tenantProfileId, status])
  @@index([landlordId, status])
  @@index([endDate]) // For lease expiration notifications
}

enum LeaseStatus {
  PENDING     // Offer extended, awaiting signatures
  ACTIVE      // Lease signed, tenant occupying
  EXPIRING    // <90 days until end date
  EXPIRED     // Past end date, no renewal
  TERMINATED  // Lease broken early (eviction or mutual agreement)
}
```

---

### 8. CrmLead (Denied Applicants → Warm Leads)

**Purpose:** Store denied applicants for future matching (network effect)

```prisma
model CrmLead {
  id                   String   @id @default(uuid())

  // Relationships
  tenantProfileId      String
  tenantProfile        TenantProfile @relation(fields: [tenantProfileId], references: [id])

  agentId              String   // Who originally interacted with this lead

  // Original application context
  deniedListingId      String   // Which listing they were denied from
  deniedAt             DateTime
  denialReason         String?

  // CRM preferences (inherited from TenantProfile)
  budgetMin            Int
  budgetMax            Int
  preferredNeighborhoods String[]
  moveInStart          DateTime
  moveInEnd            DateTime
  mustHaves            String[]

  // CRM engagement tracking
  contactedCount       Int @default(0)
  lastContactedAt      DateTime?
  responded            Boolean @default(false)
  convertedToApplication Boolean @default(false)

  // CRM status
  status               CrmLeadStatus @default(ACTIVE)
  expiresAt            DateTime // 90 days from denial

  // Audit fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([agentId, status])
  @@index([expiresAt])
  @@index([budgetMin, budgetMax])
}

enum CrmLeadStatus {
  ACTIVE     // Available for matching
  CONTACTED  // Agent reached out, awaiting response
  CONVERTED  // Applied to new listing
  EXPIRED    // 90 days passed, no engagement
  ARCHIVED   // Tenant found apartment elsewhere
}
```

**CRM Matching Algorithm:**

- When agent creates new listing, platform queries CRM leads with:
  - `budgetMin <= listing.rent <= budgetMax`
  - `preferredNeighborhoods` contains listing neighborhood
  - `moveInEnd >= listing.availableDate`
  - `mustHaves` subset of listing amenities
  - `status = ACTIVE`
- Matches ranked by score (higher score = better match)

---

### 9. AuditLog (Compliance & Legal Defense)

**Purpose:** Immutable log of all actions for fair housing defense

```prisma
model AuditLog {
  id                   String   @id @default(uuid())

  // Who performed action
  userId               String
  userRole             UserRole

  // What was accessed
  entityType           String   // "Application", "TenantProfile", "Person"
  entityId             String

  // Action performed
  action               AuditAction

  // Context
  metadata             Json     // {reason: "Landlord reviewed shortlist", applicationId: "...", ...}

  // Integrity (prevent tampering)
  hash                 String   // SHA-256 hash of (id + action + timestamp + metadata)
  previousHash         String?  // Hash of previous log entry (blockchain-style)

  // Audit fields
  createdAt            DateTime @default(now())
  ipAddress            String
  userAgent            String

  @@index([userId, createdAt])
  @@index([entityType, entityId, createdAt])
  @@index([action, createdAt])
}

enum AuditAction {
  // PII Access
  PII_VIEWED           // Landlord viewed tenant's full PII (post-selection)
  PII_EXPORTED         // Admin exported user data (GDPR)

  // Application Actions
  APPLICATION_VIEWED   // Landlord/agent viewed obfuscated application
  APPLICATION_FILTERED // Landlord applied filter (e.g., credit > 700)
  APPLICATION_SHORTLISTED
  APPLICATION_SELECTED
  APPLICATION_DENIED

  // Compliance Actions
  ADVERSE_ACTION_SENT
  DENIAL_REASON_LOGGED

  // Admin Actions
  USER_IMPERSONATED    // Admin impersonated user
  USER_BANNED
  USER_DELETED
}
```

**Integrity Verification (Blockchain-Style Hashing):**

```typescript
function computeAuditLogHash(log: {
  id: string
  action: string
  timestamp: Date
  metadata: any
  previousHash: string | null
}): string {
  const data = `${log.id}|${log.action}|${log.timestamp.toISOString()}|${JSON.stringify(log.metadata)}|${log.previousHash || ''}`
  return crypto.createHash('sha256').update(data).digest('hex')
}
```

---

### 10. AdverseActionLetter (FCRA Compliance)

**Purpose:** Track adverse action letter generation and delivery

```prisma
model AdverseActionLetter {
  id                   String   @id @default(uuid())

  // Relationships
  applicationId        String
  application          Application @relation(fields: [applicationId], references: [id])

  tenantProfileId      String
  landlordId           String

  // Letter content
  denialReason         String
  creditBureau         String?  // "TransUnion", "Experian", "Equifax"
  creditBureauContact  String?  // Phone/address for credit bureau

  // Delivery tracking
  sentViaEmail         Boolean @default(true)
  sentViaSms           Boolean @default(false)
  sentViaMail          Boolean @default(false) // Certified mail for no email/SMS response

  emailSentAt          DateTime?
  smsSentAt            DateTime?
  mailSentAt           DateTime?

  emailDelivered       Boolean @default(false)
  smsDelivered         Boolean @default(false)
  mailDelivered        Boolean @default(false)

  // Tenant engagement
  viewed               Boolean @default(false)
  viewedAt             DateTime?

  // Letter document (PDF)
  letterUrl            String   // S3 key: "adverse-actions/{id}/letter.pdf"

  // Audit fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([applicationId])
  @@index([tenantProfileId])
}
```

---

## Supporting Entities

### 11. LandlordProfile, AgentProfile (Role-Specific Data)

```prisma
model LandlordProfile {
  id                   String   @id @default(uuid())
  personId             String   @unique
  person               Person   @relation(fields: [personId], references: [id])

  // Business info
  companyName          String?
  licenseNumber        String?

  // Properties
  properties           Property[]

  // Subscription
  subscriptionTier     SubscriptionTier @default(NONE)
  subscriptionExpiresAt DateTime?

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}

model AgentProfile {
  id                   String   @id @default(uuid())
  personId             String   @unique
  person               Person   @relation(fields: [personId], references: [id])

  // Business info
  agencyName           String?
  licenseNumber        String
  brokerageLicense     String?

  // Subscription
  subscriptionTier     SubscriptionTier @default(STARTER)
  subscriptionExpiresAt DateTime?
  billingEmail         String?

  // Listings managed
  listings             Listing[]

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}

enum SubscriptionTier {
  NONE          // Free tier (landlord compliance tier)
  STARTER       // $99/month (agents, up to 10 listings)
  PROFESSIONAL  // $299/month (agents, up to 50 listings)
  ENTERPRISE    // $799/month (agents, unlimited listings)
}
```

---

### 12. RentPayment (Rent Collection Tracking)

```prisma
model RentPayment {
  id                   String   @id @default(uuid())
  leaseId              String
  lease                Lease    @relation(fields: [leaseId], references: [id])

  // Payment details
  amount               Int      // In cents
  dueDate              DateTime
  paidDate             DateTime?

  // Payment method
  paymentMethod        PaymentMethod
  paymentMethodDetails Json?    // {last4: "4242", brand: "Visa"} for cards

  // Stripe transaction
  stripePaymentIntentId String?

  // Status
  status               PaymentStatus @default(PENDING)

  // Late fees
  lateFeeAmount        Int @default(0)
  lateFeeAppliedAt     DateTime?

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([leaseId, dueDate])
}

enum PaymentMethod {
  ACH           // Bank account (preferred, low fees)
  CREDIT_CARD   // Stripe (higher fees, pass to tenant)
  DEBIT_CARD
  APPLE_PAY
  GOOGLE_PAY
}

enum PaymentStatus {
  PENDING       // Payment not yet made
  PROCESSING    // ACH in progress (3-5 days)
  PAID          // Successfully paid
  FAILED        // Payment failed (insufficient funds, etc.)
  REFUNDED      // Payment refunded (e.g., lease terminated early)
}
```

---

### 13. MaintenanceRequest (Tenant → Landlord Communication)

```prisma
model MaintenanceRequest {
  id                   String   @id @default(uuid())
  leaseId              String
  lease                Lease    @relation(fields: [leaseId], references: [id])

  // Request details
  title                String   // "Leaky faucet in bathroom"
  description          String   @db.Text
  priority             Priority @default(MEDIUM)

  // Photos (before/after)
  photos               String[] // S3 keys

  // Status tracking
  status               MaintenanceStatus @default(SUBMITTED)
  assignedTo           String?  // Contractor/handyman user ID
  resolvedAt           DateTime?

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([leaseId, status])
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT  // e.g., no heat in winter
}

enum MaintenanceStatus {
  SUBMITTED
  IN_PROGRESS
  RESOLVED
  CLOSED
}
```

---

## Indexes & Performance Optimization

### Critical Indexes

```sql
-- Tenant searches
CREATE INDEX idx_listings_search ON "Listing"(status, rent, "availableDate") WHERE status = 'ACTIVE';
CREATE INDEX idx_listings_geo ON "Property"(latitude, longitude); -- For proximity search

-- Agent dashboard (applicant management)
CREATE INDEX idx_applications_agent ON "Application"("agentId", status, "createdAt" DESC);

-- Landlord dashboard (applicant review)
CREATE INDEX idx_applications_landlord ON "Application"("landlordId", status, "createdAt" DESC);

-- CRM matching (most critical for performance)
CREATE INDEX idx_crm_leads_matching ON "CrmLead"("agentId", status, "expiresAt")
WHERE status = 'ACTIVE' AND "expiresAt" > NOW();

-- Audit log queries
CREATE INDEX idx_audit_logs_entity ON "AuditLog"("entityType", "entityId", "createdAt" DESC);
```

### Partitioning Strategy

**AuditLog Table:** Partition by month (time-series data)

```sql
CREATE TABLE audit_logs_2024_11 PARTITION OF audit_logs
FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
```

---

## Caching Strategy (Redis)

**What to Cache:**

1. **Obfuscated Applicant Profiles:** Cache for 1 hour (reduce database load for landlord dashboard)
2. **CRM Match Results:** Cache for 5 minutes (expensive query)
3. **Listing Search Results:** Cache for 2 minutes (high traffic endpoint)
4. **User Sessions:** Cache for session lifetime (fast authentication)

**Redis Key Patterns:**

```
user:session:{sessionId}             // TTL: 30 days
applicant:obfuscated:{applicantId}   // TTL: 1 hour
crm:matches:{agentId}:{listingId}    // TTL: 5 minutes
listings:search:{query_hash}         // TTL: 2 minutes
```

---

## Backup & Disaster Recovery

**Database Backups:**

- **Automated daily backups:** AWS RDS automated backups (7-day retention)
- **Manual snapshots:** Before major schema migrations
- **Point-in-time recovery:** Enabled (restore to any second in last 7 days)

**PII Data Protection:**

- Encrypt backups at rest (AWS KMS)
- Access control: Only DBAs with MFA can restore

---

_This schema should be version-controlled in Prisma migrations and reviewed quarterly for performance optimization and compliance updates._
