# ADR-020: Reusable Tenant Profile Architecture for One-Tap Applications

**Status:** APPROVED
**Date:** 2025-11-19
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

User Story US-010 (Reusable Profile / One-Tap Apply) requires tenants to create their screening profile once and apply to multiple listings without re-uploading documents or re-authorizing credit checks. Profiles must be valid for 60-90 days, portable to any landlord on the platform, and exportable for off-platform use (PTSR compliance). This is the core tenant value proposition: "Apply once, reuse everywhere."

**Background**:

- Traditional applications require 2-3 hours of work per listing
- Tenants pay $50+ per application x 5-7 applications = $250-350
- California AB 2493 requires acceptance of Portable Tenant Screening Reports
- Current approach: No profile system exists
- Verifications (credit, income, employment) have different expiration times

**Requirements**:

- **Functional**: Store tenant profile with documents, verifications, references
- **Functional**: Track verification validity periods (60-90 days)
- **Functional**: One-tap application that copies profile data to application
- **Functional**: Multi-listing batch applications (apply to 3-5 at once)
- **Functional**: Profile export (PDF, QR code, JSON for PTSR compliance)
- **Functional**: Profile updates propagate to pending applications
- **Non-functional**: Application submission <10 seconds
- **Non-functional**: Profile data integrity (no partial applications)
- **Non-functional**: Support for profile tiers (Basic 60 days, Premium 90 days)
- **Constraints**: Must integrate with PII anonymization (ADR-013, ADR-014)
- **Constraints**: Must integrate with verification providers (TransUnion, Plaid, etc.)

**Scope**:

- **Included**: Profile data model, validity tracking, one-tap apply, export
- **Included**: Integration with verification providers
- **Not included**: Verification provider selection (separate decision)
- **Not included**: Pricing/tier logic (business decision)

---

## Decision

**We will implement a profile-based application architecture where tenant screening data is stored in a canonical profile model, with applications created as snapshots that reference the profile at submission time.**

The profile contains all verified data (credit, income, employment, references, documents). Applications are atomic snapshots created from the profile, ensuring landlords always see consistent data. Profile updates trigger re-verification workflows but don't retroactively change submitted applications.

**Implementation Approach**:

- Create `tenant_profile` model as source of truth for tenant data
- Create `profile_verification` model to track individual verification validity
- Applications copy profile data at submission (snapshot pattern)
- Implement verification expiration tracking with renewal reminders
- Build profile export functionality (PDF, QR, JSON)
- Cache profile summaries for fast application UI
- Integrate with ADR-013 PII encryption for sensitive data

**Why This Approach**:

1. **Data Integrity**: Snapshot ensures landlords see same data regardless of later changes
2. **Legal Compliance**: Applications are immutable records for audit trail
3. **User Experience**: One-tap apply with <10 second submission
4. **Portability**: Export functionality enables off-platform use
5. **Verification Management**: Clear expiration tracking and renewal flows

**Example/Proof of Concept**:

```typescript
// lib/services/tenant-profile.ts
import { prisma } from '@/lib/db'
import { encryptPII, decryptPII } from '@/lib/encryption'

interface TenantProfile {
  id: string
  userId: string
  tier: 'basic' | 'premium'
  validUntil: Date
  status: 'incomplete' | 'pending_verification' | 'verified' | 'expired'

  // Personal info (encrypted)
  fullName: string
  email: string
  phone: string
  dateOfBirth: Date
  ssn: string // Last 4 only stored, full for verification

  // Employment
  employerName: string
  employerPhone: string
  jobTitle: string
  monthlyIncome: number
  employmentVerificationId?: string

  // Credit
  creditScore?: number
  creditReportId?: string
  creditVerificationDate?: Date

  // Background
  backgroundCheckId?: string
  backgroundCheckDate?: Date

  // References
  references: Array<{
    name: string
    relationship: string
    phone: string
    email: string
  }>

  // Documents
  documents: Array<{
    type: 'pay_stub' | 'bank_statement' | 'id' | 'tax_return'
    fileId: string
    uploadedAt: Date
  }>

  // Rental history
  rentalHistory: Array<{
    address: string
    landlordName: string
    landlordPhone: string
    moveInDate: Date
    moveOutDate?: Date
    monthlyRent: number
  }>
}

interface ProfileVerification {
  id: string
  profileId: string
  type: 'credit' | 'employment' | 'income' | 'background' | 'identity'
  provider: string
  status: 'pending' | 'verified' | 'failed' | 'expired'
  verifiedAt?: Date
  expiresAt: Date
  externalId?: string
  data?: Record<string, unknown>
}

export class TenantProfileService {
  /**
   * Get profile with verification status
   */
  async getProfile(userId: string): Promise<
    TenantProfile & {
      verifications: ProfileVerification[]
      completionPercentage: number
      canApply: boolean
    }
  > {
    const profile = await prisma.tenantProfile.findUnique({
      where: { userId },
      include: { verifications: true },
    })

    if (!profile) {
      throw new Error('Profile not found')
    }

    // Decrypt PII fields
    const decryptedProfile = {
      ...profile,
      ssn: await decryptPII(profile.ssnEncrypted),
      // ... other encrypted fields
    }

    // Calculate completion
    const completionPercentage = this.calculateCompletion(decryptedProfile)
    const canApply = this.canApply(decryptedProfile, profile.verifications)

    return {
      ...decryptedProfile,
      verifications: profile.verifications,
      completionPercentage,
      canApply,
    }
  }

  /**
   * Check if profile is ready for applications
   */
  private canApply(profile: TenantProfile, verifications: ProfileVerification[]): boolean {
    // Must have active profile
    if (profile.status !== 'verified') return false
    if (profile.validUntil < new Date()) return false

    // Must have required verifications
    const requiredTypes = ['credit', 'income', 'identity']
    return requiredTypes.every((type) =>
      verifications.some(
        (v) => v.type === type && v.status === 'verified' && v.expiresAt > new Date()
      )
    )
  }

  /**
   * Calculate profile completion percentage
   */
  private calculateCompletion(profile: TenantProfile): number {
    const fields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.employerName,
      profile.monthlyIncome,
      profile.documents.length > 0,
      profile.references.length >= 2,
      profile.rentalHistory.length > 0,
    ]

    const completed = fields.filter(Boolean).length
    return Math.round((completed / fields.length) * 100)
  }

  /**
   * Create application from profile (one-tap apply)
   */
  async createApplication(profileId: string, listingId: string): Promise<string> {
    const profile = await prisma.tenantProfile.findUnique({
      where: { id: profileId },
      include: { verifications: true },
    })

    if (!profile) {
      throw new Error('Profile not found')
    }

    // Verify profile can apply
    if (!this.canApply(profile, profile.verifications)) {
      throw new Error('Profile not ready for applications')
    }

    // Create application as snapshot of profile
    const application = await prisma.application.create({
      data: {
        tenantProfileId: profileId,
        listingId,
        status: 'submitted',
        submittedAt: new Date(),

        // Snapshot all profile data at submission time
        snapshotData: {
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          monthlyIncome: profile.monthlyIncome,
          creditScore: profile.creditScore,
          employerName: profile.employerName,
          jobTitle: profile.jobTitle,
          references: profile.references,
          rentalHistory: profile.rentalHistory,
          documents: profile.documents,
          verifications: profile.verifications.map((v) => ({
            type: v.type,
            provider: v.provider,
            verifiedAt: v.verifiedAt,
            expiresAt: v.expiresAt,
          })),
        },

        // Store verification IDs for landlord to re-verify if needed
        creditReportId: profile.creditReportId,
        backgroundCheckId: profile.backgroundCheckId,
        employmentVerificationId: profile.employmentVerificationId,
      },
    })

    // Log to audit trail
    await logPiiAccess({
      userId: profile.userId,
      userRole: 'tenant',
      applicantId: profile.id,
      actionType: 'application_submitted',
      accessGranted: true,
      requestMetadata: {
        applicationId: application.id,
        listingId,
      },
    })

    return application.id
  }

  /**
   * Create multiple applications at once (batch apply)
   */
  async createBatchApplications(profileId: string, listingIds: string[]): Promise<string[]> {
    // Validate all listings exist and are available
    const listings = await prisma.listing.findMany({
      where: {
        id: { in: listingIds },
        status: 'active',
      },
    })

    if (listings.length !== listingIds.length) {
      throw new Error('One or more listings are unavailable')
    }

    // Create applications in parallel
    const applicationIds = await Promise.all(
      listingIds.map((listingId) => this.createApplication(profileId, listingId))
    )

    return applicationIds
  }

  /**
   * Export profile for off-platform use (PTSR compliance)
   */
  async exportProfile(
    profileId: string,
    format: 'pdf' | 'json' | 'qr'
  ): Promise<{ data: string; mimeType: string }> {
    const profile = await this.getProfile(
      (await prisma.tenantProfile.findUnique({
        where: { id: profileId },
        select: { userId: true },
      }))!.userId
    )

    switch (format) {
      case 'pdf':
        return this.generatePdfExport(profile)
      case 'json':
        return this.generateJsonExport(profile)
      case 'qr':
        return this.generateQrExport(profile)
    }
  }

  private async generatePdfExport(
    profile: TenantProfile & {
      verifications: ProfileVerification[]
    }
  ): Promise<{ data: string; mimeType: string }> {
    // Generate PDF with profile summary
    // Uses puppeteer or pdfkit
    const pdfContent = `
      PORTABLE TENANT SCREENING REPORT
      ================================

      Name: ${profile.fullName}
      Generated: ${new Date().toISOString()}
      Valid Until: ${profile.validUntil.toISOString()}

      CREDIT
      Score: ${profile.creditScore}
      Verified: ${profile.verifications.find((v) => v.type === 'credit')?.verifiedAt}

      EMPLOYMENT
      Employer: ${profile.employerName}
      Title: ${profile.jobTitle}
      Monthly Income: $${profile.monthlyIncome}

      VERIFICATION QR CODE
      Scan to verify this report: https://apartmentdibs.com/verify/${profile.id}
    `

    // Convert to actual PDF
    const pdfBuffer = await generatePdf(pdfContent)

    return {
      data: pdfBuffer.toString('base64'),
      mimeType: 'application/pdf',
    }
  }

  private async generateJsonExport(
    profile: TenantProfile & {
      verifications: ProfileVerification[]
    }
  ): Promise<{ data: string; mimeType: string }> {
    // PTSR-compliant JSON format
    const exportData = {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      validUntil: profile.validUntil.toISOString(),
      verificationUrl: `https://apartmentdibs.com/verify/${profile.id}`,
      tenant: {
        name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
      },
      credit: {
        score: profile.creditScore,
        reportId: profile.creditReportId,
        verifiedAt: profile.verifications.find((v) => v.type === 'credit')?.verifiedAt,
      },
      employment: {
        employer: profile.employerName,
        title: profile.jobTitle,
        monthlyIncome: profile.monthlyIncome,
        verifiedAt: profile.verifications.find((v) => v.type === 'employment')?.verifiedAt,
      },
      references: profile.references,
      rentalHistory: profile.rentalHistory,
    }

    return {
      data: JSON.stringify(exportData, null, 2),
      mimeType: 'application/json',
    }
  }

  private async generateQrExport(
    profile: TenantProfile & {
      verifications: ProfileVerification[]
    }
  ): Promise<{ data: string; mimeType: string }> {
    // Generate QR code linking to verification page
    const verificationUrl = `https://apartmentdibs.com/verify/${profile.id}`
    const qrCodeDataUrl = await generateQrCode(verificationUrl)

    return {
      data: qrCodeDataUrl,
      mimeType: 'image/png',
    }
  }

  /**
   * Check and trigger verification renewals
   */
  async checkVerificationExpiry(profileId: string): Promise<void> {
    const verifications = await prisma.profileVerification.findMany({
      where: {
        profileId,
        status: 'verified',
      },
    })

    const now = new Date()
    const sevenDays = 7 * 24 * 60 * 60 * 1000

    for (const verification of verifications) {
      const expiresIn = verification.expiresAt.getTime() - now.getTime()

      if (expiresIn < 0) {
        // Already expired
        await prisma.profileVerification.update({
          where: { id: verification.id },
          data: { status: 'expired' },
        })

        // Send expiration notification
        await sendExpirationNotice(profileId, verification.type)
      } else if (expiresIn < sevenDays) {
        // Expires within 7 days
        await sendRenewalReminder(profileId, verification.type, verification.expiresAt)
      }
    }
  }
}

// Database schema
/*
CREATE TABLE tenant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id),
  tier VARCHAR(20) NOT NULL DEFAULT 'basic',
  valid_until TIMESTAMPTZ NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'incomplete',

  -- Encrypted PII (ADR-013)
  full_name_encrypted BYTEA NOT NULL,
  email_encrypted BYTEA NOT NULL,
  phone_encrypted BYTEA NOT NULL,
  ssn_encrypted BYTEA,

  -- Employment
  employer_name VARCHAR(255),
  employer_phone VARCHAR(20),
  job_title VARCHAR(100),
  monthly_income DECIMAL(10, 2),
  employment_verification_id UUID,

  -- Credit
  credit_score INTEGER,
  credit_report_id UUID,
  credit_verification_date TIMESTAMPTZ,

  -- Background
  background_check_id UUID,
  background_check_date TIMESTAMPTZ,

  -- JSONB for complex nested data
  references JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  rental_history JSONB DEFAULT '[]',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profile_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES tenant_profiles(id),
  type VARCHAR(30) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  external_id VARCHAR(255),
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_profile_id UUID NOT NULL REFERENCES tenant_profiles(id),
  listing_id UUID NOT NULL REFERENCES listings(id),
  status VARCHAR(30) NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ NOT NULL,

  -- Snapshot of profile at submission time (immutable)
  snapshot_data JSONB NOT NULL,

  -- Verification references
  credit_report_id UUID,
  background_check_id UUID,
  employment_verification_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_profile_id, listing_id)
);

-- Index for fast profile lookup
CREATE INDEX idx_tenant_profiles_user ON tenant_profiles(user_id);
CREATE INDEX idx_verifications_profile ON profile_verifications(profile_id, type);
CREATE INDEX idx_applications_profile ON applications(tenant_profile_id, submitted_at DESC);
*/
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences

- **User Experience**: One-tap apply saves 2-3 hours per application
- **Cost Savings**: Single verification fee vs multiple ($54.99 vs $250+)
- **Data Integrity**: Snapshot pattern ensures consistent application data
- **Portability**: Export functionality enables off-platform use
- **Audit Trail**: Complete application history for compliance
- **PTSR Compliance**: Meets California AB 2493 requirements

### Negative Consequences

- **Storage**: Snapshot data duplicates profile data per application
- **Verification Costs**: Must manage verification provider relationships
- **Expiration Complexity**: Multiple verification types expire at different times
- **Profile Updates**: Cannot update submitted applications (by design)
- **Export Security**: Must secure exported PII data

### Neutral Consequences

- **Verification Providers**: Need to integrate with multiple providers
- **Renewal UX**: Must design clear renewal flows for expiring verifications

### Mitigation Strategies

- **Storage**: Snapshot data is compressed, reference large documents
- **Verification Costs**: Negotiate volume pricing with providers
- **Expiration Complexity**: Clear dashboard showing all expiration dates
- **Profile Updates**: Users understand applications are frozen at submission
- **Export Security**: Watermark PDFs, expire QR codes after verification

---

## Alternatives Considered

### Alternative 1: Reference-Based Applications

**Description**:
Applications reference profile directly instead of creating snapshots.

**Pros**:

- Less storage (no duplication)
- Profile updates reflect immediately
- Simpler data model

**Cons**:

- Landlord sees different data than when applied
- Cannot prove what data was submitted
- Legal/audit issues
- Verification may expire between submit and review

**Why Not Chosen**:
Legal risk too high. Landlords must see exactly what tenant submitted. Immutable snapshots are required for audit trail and legal compliance.

---

### Alternative 2: Document-First Architecture

**Description**:
Store individual documents and verifications, compose into profile on demand.

**Pros**:

- Flexible document management
- Easy to add new document types
- Granular permissions
- Deduplication

**Cons**:

- Complex queries to assemble profile
- Hard to ensure completeness
- Performance concerns
- No single source of truth

**Why Not Chosen**:
Profile is the core concept - documents support it. Having a canonical profile model is clearer and performs better.

---

### Alternative 3: Blockchain-Based Verifications

**Description**:
Store verification attestations on blockchain for immutability and portability.

**Pros**:

- Truly immutable records
- Cross-platform portability
- Third-party verification
- Tenant owns their data

**Cons**:

- High complexity
- Slow and expensive
- Regulatory uncertainty
- Overkill for our needs

**Why Not Chosen**:
Blockchain adds significant complexity without proportional benefit. Database-level immutability (ADR-017) is sufficient for our compliance needs.

---

### Alternative 4: Third-Party Profile Provider

**Description**:
Use external service like Rentec Direct or Tenant Turner for profile management.

**Pros**:

- Built-in verification integrations
- Established workflows
- Less development effort
- Industry standard formats

**Cons**:

- No suitable provider for our specific needs
- High per-application costs
- Limited customization
- Vendor lock-in
- Cannot differentiate on UX

**Why Not Chosen**:
Reusable profiles are our core differentiator. Must own this system to provide superior UX and control costs.

---

## Related

**Related ADRs**:

- [ADR-013: PII Encryption] - Profile data encryption
- [ADR-014: Row-Level Security] - Profile access control
- [ADR-017: Immutable Audit Trail] - Application logging

**Related Documentation**:

- [User Story US-010] - Reusable Profile requirements
- [User Story US-011] - Group Applications (depends on profiles)
- [docs/profiles/verification-providers.md] - Provider integrations (to be created)

**External References**:

- [California AB 2493](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=201720180AB2493) - PTSR requirements
- [TransUnion SmartMove](https://www.mysmartmove.com/) - Credit/background provider
- [Plaid](https://plaid.com/) - Income verification

---

## Notes

**Decision Making Process**:

- Analyzed competitive products (Zillow, Apartments.com)
- Evaluated PTSR compliance requirements
- Designed for core differentiator (apply once, reuse everywhere)
- Decision date: 2025-11-19

**Verification Validity Periods**:

- Credit report: 30 days (industry standard)
- Background check: 90 days
- Income verification: 60 days
- Identity verification: 1 year
- Overall profile: 60 days (Basic) or 90 days (Premium)

**Cost Estimate**:

- Credit report: $15-25 per verification
- Background check: $20-35 per verification
- Income verification: $10-20 per verification
- Total per profile: ~$45-80

**Review Schedule**:

- Monitor profile completion rates weekly
- Review verification provider costs monthly
- Evaluate new verification providers quarterly

**Migration Plan**:

- **Phase 1**: Create database schema and profile model (Week 1)
- **Phase 2**: Implement profile creation and verification tracking (Week 1-2)
- **Phase 3**: Build one-tap apply and snapshot creation (Week 2)
- **Phase 4**: Add profile export functionality (Week 3)
- **Phase 5**: Integrate verification providers (Week 3-4)
- **Rollback**: Can disable profile features, fall back to traditional applications

---

## Revision History

| Date       | Author             | Change                      |
| ---------- | ------------------ | --------------------------- |
| 2025-11-19 | Architecture Agent | Initial creation for US-010 |
