# US-001: PII Anonymization Before Landlord Review [P0]

**Status**: Approved
**Priority**: P0 (Critical - MVP Core Compliance Differentiator)
**Sprint**: Sprint 1

---

## User Story

**As a** prospective tenant (Maya)
**I want to** have my personal information (name, photo, age, ethnicity markers) hidden from landlords until after they select me
**So that** I'm evaluated solely on my financial qualifications and not subjected to bias based on protected characteristics

---

## Context & Background

### Problem Statement

Traditional rental applications expose full PII (name, photo, address, employer) to landlords before any decision is made. This creates significant bias risks where landlords may consciously or unconsciously discriminate based on:
- Race (inferred from name)
- Age (inferred from graduation dates)
- National origin (inferred from address/employer)
- Religion (inferred from name or institutional affiliations)

### Business Rationale

- **Legal Risk**: Even unintentional bias creates fair housing violations
- **Market Opportunity**: No competitor offers true PII anonymization before human review (all platforms only hide SSNs)
- **Competitive Advantage**: This is ApartmentDibs' core compliance differentiator
- **Regulatory Environment**: 32,321 fair housing complaints filed in 2024 (20-year high), with settlements ranging from $5,000 to $2.13 million

### User Pain Point

Maya's perspective: "When I show up to viewings, I can tell some landlords are surprised I'm Asian. I provide the same documents as everyone else, yet I feel I'm not evaluated fairly."

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 1,000 tenant applications per month (estimated Month 3-6)
- **Impact**: 3 (Massive - core value proposition, platform cannot exist without this)
- **Confidence**: 100% (essential feature, validated by fair housing research and user interviews)
- **Effort**: 4 person-weeks

**RICE Score**: (1000 x 3 x 1.0) / 4 = **750**

### Story Points

**Estimated Effort**: 21 story points (80-100 hours)

**Complexity Factors**:
- Technical complexity: High (NLP/NER integration, PII scrubbing, encryption)
- UI complexity: Medium (obfuscated vs revealed profile views)
- Integration complexity: High (OCR for documents, audit logging, access control)
- Unknown factors: NER model accuracy for edge cases, performance tuning

---

## Acceptance Criteria

### AC-1: Obfuscated Tenant Profile Display

**Given** a landlord is viewing applicants for their listing
**When** they view a tenant's application
**Then** they see only anonymized information:
- Anonymous ID (e.g., "Applicant #2847")
- Income-to-rent ratio (e.g., "4.1x")
- Credit score band (e.g., "740-760")
- Employment tenure (e.g., "3+ years stable employment")
- Rental history summary (e.g., "No evictions, positive references")
- Background check status (e.g., "Pass")

**And** the following are hidden:
- Full name, photo, date of birth
- Current address
- Specific employer name
- Reference names

**Verification**:
- [ ] Landlord dashboard shows only obfuscated profile data
- [ ] No PII fields are visible in any UI component
- [ ] Income-to-rent ratio calculated correctly from submitted data
- [ ] Credit score displayed as band, not exact number
- [ ] Employment shows tenure without company name

### AC-2: PII Scrubbing Engine

**Given** a tenant submits application documents and personal notes
**When** the application is processed
**Then** the system automatically scrubs all PII from text fields:
- Personal notes: Remove mentions of ethnicity, age, religious institutions
- References: Hide referee names
- Employment verification: Show job title + tenure only

**Verification**:
- [ ] NLP (Named Entity Recognition) detects and redacts names
- [ ] Location mentions are removed or generalized
- [ ] Organization names are redacted
- [ ] Ethnic/racial indicators are detected and removed
- [ ] Age indicators are removed (graduation dates, birth years)
- [ ] Processing completes in <2 seconds

### AC-3: Document PII Redaction

**Given** a tenant uploads documents containing PII (pay stubs, ID, etc.)
**When** the documents are processed
**Then** identifiable information is automatically redacted:
- Email addresses are obfuscated (e.g., "m***@gmail.com")
- Employer names on pay stubs are redacted via OCR
- Only income amount + pay frequency are visible

**Verification**:
- [ ] Pay stub employer name is redacted
- [ ] Income amount and frequency remain visible
- [ ] Email addresses show partial obfuscation
- [ ] Photo IDs are not displayed until post-selection
- [ ] OCR processing handles various document formats

### AC-4: Post-Selection PII Reveal

**Given** a landlord has selected an applicant
**When** they confirm their selection
**Then** the full PII is immediately unlocked:
- Full name, photo, contact information
- Current address, specific employer name
- Detailed credit report (full history, not just band)
- All reference contact information

**And** landlord receives email notification: "View [Applicant #2847]'s full profile now that you've selected them"

**Verification**:
- [ ] Selection triggers real-time PII reveal
- [ ] All previously hidden fields become visible
- [ ] Credit report shows complete history
- [ ] Email notification sent within 1 minute
- [ ] Dashboard updates without page refresh

### AC-5: Audit Trail Logging

**Given** any attempt to access PII
**When** the access is requested
**Then** the system logs:
- User ID, timestamp, and applicant ID
- Action type (view attempt, selection, PII reveal)
- Access granted or denied

**And** logs are retained for 3 years (FCRA requirement)

**Verification**:
- [ ] Blocked access attempts are logged with denial reason
- [ ] Successful reveals are logged with timestamp
- [ ] Audit logs are tamper-proof (immutable)
- [ ] 3-year retention policy enforced
- [ ] Logs exportable for legal defense

### AC-6: Edge Case Handling

**Given** various edge cases in user data
**When** processing applications
**Then** the system correctly handles:
- Names embedded in email addresses
- Employer names in document headers
- Self-identifying information in personal notes (e.g., "I'm relocating from China")

**Verification**:
- [ ] Email domains obfuscated appropriately
- [ ] NLP auto-redacts national origin references
- [ ] Generic replacement text used (e.g., "I'm relocating for work")
- [ ] No false positives remove legitimate qualification data

### AC-7: Non-Functional Requirements

**Security**:
- [ ] PII encrypted at rest (AES-256)
- [ ] Access control via role-based permissions (RBAC)
- [ ] Row-level security (RLS) in database
- [ ] Decryption keys stored securely (KMS)

**Performance**:
- [ ] PII scrubbing completes in <2 seconds
- [ ] Profile loads in <1 second (with caching)
- [ ] Document OCR completes in <5 seconds

**Compliance**:
- [ ] Follows Fair Housing Act requirements
- [ ] FCRA compliant for adverse action
- [ ] GDPR/CCPA data minimization principles applied

**Accessibility**:
- [ ] Screen reader announces "anonymized profile" appropriately
- [ ] Keyboard navigation works for all profile sections
- [ ] WCAG 2.1 AA compliant

---

## Technical Implementation Notes

### Backend Specification

**Data Models** (ZenStack):

```zmodel
model TenantProfile extends BaseModel {
  applicantId          String    @unique  // "Applicant #2847"
  userId               String
  user                 User      @relation(fields: [userId], references: [id])

  // PII Data (encrypted, access controlled)
  piiData              Json      // {name, photoUrl, dob, address, employer}

  // Obfuscated Data (always visible)
  obfuscatedData       Json      // {incomeRatio, creditBand, employmentTenure}

  // Reveal tracking
  piiRevealedAt        DateTime?
  piiRevealedToUserId  String?   // References landlord who selected

  // Access control: Only reveal PII if revealed
  @@allow('create', auth() != null)
  @@allow('read', auth() == user || piiRevealedAt != null)
  @@allow('update', auth() == user)
  @@deny('read', piiRevealedAt == null && auth() != user)
}

model PiiAccessLog extends BaseModel {
  userId               String
  applicantId          String
  actionType           String    // 'view_attempt', 'selection', 'reveal'
  accessGranted        Boolean
  denialReason         String?

  @@allow('create', true)
  @@allow('read', auth().role == 'admin')
  @@deny('update', true)
  @@deny('delete', true)
}
```

**Database Schema** (PostgreSQL):

```sql
CREATE TABLE tenant_profiles (
  id UUID PRIMARY KEY,
  applicant_id VARCHAR(20) UNIQUE, -- "Applicant #2847"
  pii_data JSONB, -- {name, photo_url, dob, address, employer}
  obfuscated_data JSONB, -- {income_ratio, credit_band, employment_tenure}
  pii_revealed_at TIMESTAMP,
  pii_revealed_to_user_id UUID -- References landlord who selected
);

-- Row-level security policy
CREATE POLICY pii_access ON tenant_profiles
FOR SELECT
USING (pii_revealed_at IS NOT NULL OR current_user_id = owner_user_id);
```

**Business Logic**:

- `lib/services/pii-scrubbing.ts` - NER-based PII detection and redaction
- `lib/services/document-ocr.ts` - OCR processing for pay stubs and documents
- `lib/services/profile-obfuscation.ts` - Transform PII to anonymized format
- `lib/services/audit-logger.ts` - Immutable audit trail logging

**External Dependencies**:
- NER models: spaCy or Stanford NER for named entity recognition
- OCR: Tesseract.js or Google Cloud Vision API
- Encryption: Node.js crypto with AES-256-GCM

**Database Changes**:
- [ ] New models added to `zschema/`
- [ ] Migrations created for tenant_profiles and pii_access_logs
- [ ] RLS policies configured in PostgreSQL
- [ ] Indexes on applicant_id, pii_revealed_at

### Frontend Specification

**Components**:
```
components/
  tenant-profile/
    ObfuscatedProfile.tsx      - Anonymous profile view for landlords
    RevealedProfile.tsx        - Full profile after selection
    ProfileComparison.tsx      - Side-by-side applicant comparison
    CreditBand.tsx             - Credit score band display
    EmploymentTenure.tsx       - Employment duration display
  application/
    ApplicationCard.tsx        - Applicant card in landlord dashboard
    SelectApplicantDialog.tsx  - Confirmation dialog for selection
    PiiRevealNotice.tsx        - Notice when PII is unlocked
```

**Hooks** (ZenStack Generated):
```typescript
import {
  useCreateTenantProfile,
  useFindManyTenantProfile,
  useFindUniqueTenantProfile,
  useUpdateTenantProfile,
} from '@/lib/hooks/generated/tanstack-query'
```

**Custom Hooks**:
```typescript
// lib/hooks/use-pii-reveal.ts
export function usePiiReveal(applicantId: string) {
  // Handle selection and PII reveal flow
}

// lib/hooks/use-obfuscated-profile.ts
export function useObfuscatedProfile(applicantId: string) {
  // Fetch and transform profile data for display
}
```

**Routing**:
- `/tenant/profile` - Tenant views/edits their profile
- `/agent/applications/[listingId]` - Agent views applicants (obfuscated)
- `/landlord/applications/[listingId]` - Landlord views applicants (obfuscated)
- `/landlord/applicant/[applicantId]` - Individual applicant detail

**State Management**:
- Server state via TanStack Query (profile data)
- Local state for selection flow (Zustand)
- Form state with react-hook-form for profile editing

### UI/UX Design

**Key Interactions**:
1. Landlord browses applicants, sees only anonymized cards
2. Landlord selects applicant, confirms selection
3. PII reveals with visual transition (blur to clear)
4. Email notification sent to both parties

**Visual Treatment**:
- Obfuscated profiles use muted colors, anonymous avatar
- "Anonymized" badge clearly visible
- Revealed profiles transition with animation
- Credit bands use color coding (green = excellent, yellow = good, etc.)

**Empty States**:
- "No applications yet" with explanation of anonymous process
- "Waiting for selection" for tenants

**Loading States**:
- Skeleton loaders for profile cards
- Progress indicator for document processing
- Optimistic UI for selection action

**Error States**:
- "PII access denied - applicant not yet selected"
- "Document processing failed - please reupload"
- Network error handling with retry

---

## UI Designer Review

**Review Date**: 2025-11-19
**Reviewer**: UI Designer Agent

### Mockup Coverage Summary

The existing frontend mockups in the `app/` directory provide **substantial coverage** of the PII anonymization requirements. The core obfuscation display is well-implemented, but several UI elements need to be added for complete story fulfillment.

### Implemented UI Elements (Complete)

**Landlord Applicants Page** (`/landlord/listings/[listingId]/applicants/page.tsx`):
- Anonymous ID display (e.g., "Applicant #3421")
- Income ratio display (e.g., "4.2x")
- Credit band display (e.g., "740-760")
- Employment tenure display (e.g., "3+ years")
- Employment type badge
- Occupants and pets badges
- Competitive edge display
- Fair Housing Reminder info card
- Select/Deny confirmation dialogs with reasons
- No PII visible (names, photos, addresses hidden)

**Agent Applicant Detail Page** (`/agent/applicants/[applicantId]/page.tsx`):
- "Obfuscated Profile" section with clear header
- Visual indicators for strong metrics (green badges)
- Rental history summary ("5+ years, no evictions")
- Background check status ("Pass")
- Competitive edge highlight
- Internal notes and communication history
- Shortlist/Deny action buttons

**Agent All Applicants Page** (`/agent/applicants/page.tsx`):
- Table view with obfuscated data
- displayId, income ratio, credit band columns
- Status/listing/date filters
- Action buttons for detail view

**Tenant Profile Page** (`/tenant/profile/page.tsx`):
- Full PII visible to profile owner
- Verification status for all categories
- Document management
- Profile completion progress

**Mock Data Structure** (`/lib/mock-data/landlord.ts`, `/lib/mock-data/agent.ts`):
- LandlordApplicant interface with obfuscated fields
- Applicant interface matches story requirements
- displayId format matches "Applicant #XXXX" pattern

### Missing UI Elements (Needs Implementation)

#### Priority 1: Critical for Story Completion

1. **RevealedProfile Component** - MISSING
   - **Location**: `components/tenant-profile/RevealedProfile.tsx`
   - **Purpose**: Display full PII after landlord selection
   - **Requirements**:
     - Full name, photo, contact information
     - Current address, employer name
     - Complete credit history
     - All reference information
     - Visual transition animation (blur to clear)

2. **Landlord Individual Applicant Detail Page** - MISSING
   - **Location**: `app/(landlord)/landlord/applicant/[applicantId]/page.tsx`
   - **Purpose**: Detailed view of single applicant (pre/post selection)
   - **Requirements**:
     - Obfuscated view by default
     - Transitions to RevealedProfile after selection
     - Selection confirmation flow
     - Audit trail visibility

3. **PiiRevealNotice Component** - MISSING
   - **Location**: `components/application/PiiRevealNotice.tsx`
   - **Purpose**: Notification when PII is unlocked
   - **Requirements**:
     - Success message banner
     - Email notification confirmation
     - Next steps guidance
     - Timestamp of reveal

4. **"Anonymized" Badge** - MISSING
   - **Purpose**: Clear visual indicator on all obfuscated profiles
   - **Locations to add**:
     - Landlord applicants list page
     - Agent applicant detail page
     - Landlord applicant detail page
   - **Design**: Use `Badge` with muted styling, lock icon

5. **Anonymous Avatar Placeholder** - MISSING
   - **Purpose**: Visual placeholder where photo would appear
   - **Design**: Generic user silhouette with muted background
   - **Implementation**: Add to applicant cards in landlord view

#### Priority 2: Important for UX Quality

6. **Credit Band Color Coding** - PARTIAL
   - **Current**: Agent page has green badges for strong metrics
   - **Missing**: Explicit color bands in landlord view
   - **Design Spec**:
     - 800+: Green (Excellent)
     - 740-799: Blue (Good)
     - 680-739: Yellow (Fair)
     - Below 680: Red (Poor)

7. **ProfileComparison Component** - MISSING
   - **Location**: `components/tenant-profile/ProfileComparison.tsx`
   - **Purpose**: Side-by-side comparison of shortlisted applicants
   - **Requirements**:
     - 2-3 applicants side-by-side
     - Highlight differences in metrics
     - Selection buttons for each

8. **Specific Empty States** - MISSING
   - "No applications yet" with explanation of anonymous process
   - "Waiting for selection" state for tenant applications page
   - "All applicants denied" state with guidance

9. **Loading States** - MISSING
   - Skeleton loaders for profile cards
   - Progress indicator for document processing
   - Optimistic UI update on selection

#### Priority 3: Accessibility & Polish

10. **Screen Reader Accessibility**
    - Add `aria-label="Anonymized applicant profile"` to profile sections
    - Announce credit bands with context (e.g., "Credit band 740 to 760, rated Good")
    - Keyboard navigation verification needed

11. **CreditBand Component** - TO CREATE
    - **Location**: `components/tenant-profile/CreditBand.tsx`
    - **Purpose**: Reusable credit score band display with colors
    - **Features**: Color coding, accessible labels, score range

12. **EmploymentTenure Component** - TO CREATE
    - **Location**: `components/tenant-profile/EmploymentTenure.tsx`
    - **Purpose**: Consistent employment tenure display
    - **Features**: Icon, duration text, stability indicator

### Route Corrections Needed

The story specifies these routes but the actual mockups use different paths:

| Story Specification | Actual Mockup Path | Status |
|---------------------|-------------------|--------|
| `/agent/applications/[listingId]` | `/agent/listings/[listingId]/applicants` | Different path |
| `/landlord/applications/[listingId]` | `/landlord/listings/[listingId]/applicants` | Different path |
| `/landlord/applicant/[applicantId]` | Not implemented | MISSING |

**Recommendation**: Update story to match actual route structure OR create redirect routes.

### Component Creation Checklist

Components that need to be created for story completion:

- [ ] `components/tenant-profile/RevealedProfile.tsx`
- [ ] `components/tenant-profile/ProfileComparison.tsx`
- [ ] `components/tenant-profile/CreditBand.tsx`
- [ ] `components/tenant-profile/EmploymentTenure.tsx`
- [ ] `components/application/PiiRevealNotice.tsx`
- [ ] `app/(landlord)/landlord/applicant/[applicantId]/page.tsx`

### Visual Design Specifications

**Anonymous Avatar Placeholder**:
```
┌─────────┐
│   ┌─┐   │
│  (   )  │  ← Generic silhouette
│   └─┘   │
│  ╱   ╲  │
└─────────┘
bg-muted, border-dashed
```

**Anonymized Badge**:
```
┌───────────────┐
│ 🔒 Anonymized │  ← Lock icon + text
└───────────────┘
Badge variant="outline" with muted colors
```

**PII Reveal Transition**:
```
Before Selection:          After Selection:
┌─────────────────┐       ┌─────────────────┐
│ Applicant #2847 │  →    │ Maya Chen       │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │       │ maya@email.com  │
│ Credit: 740-760 │       │ Credit: 752     │
└─────────────────┘       └─────────────────┘
                    ↑
             CSS transition:
             opacity 0→1, filter blur(8px)→blur(0)
```

### Mock Data Updates Needed

Add `status: 'selected'` state handling and PII reveal fields to:
- `LandlordApplicant` interface in `/lib/mock-data/landlord.ts`

```typescript
// Add to LandlordApplicant interface
piiRevealed?: boolean;
piiRevealedAt?: string;
// Add PII data for revealed state
revealedData?: {
  name: string;
  email: string;
  phone: string;
  address: string;
  employer: string;
  exactCreditScore: number;
};
```

### Summary

**Overall Mockup Completeness**: 70%

**Breakdown**:
- Core obfuscation display: 95% complete
- Selection workflow: 80% complete
- Post-selection PII reveal: 0% complete (critical gap)
- Accessibility compliance: 40% complete
- Polish/loading states: 30% complete

**Recommended Priority Order**:
1. Create landlord applicant detail page with reveal mechanism
2. Create RevealedProfile and PiiRevealNotice components
3. Add "Anonymized" badge and anonymous avatar to existing views
4. Implement credit band color coding
5. Add loading/empty states
6. Verify accessibility requirements

---

## Analytics Tracking

**Events to Track**:

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `obfuscated_profile_viewed` | Landlord views anonymized profile | `{landlordId, applicantId, listingId}` |
| `pii_reveal_attempted` | Landlord tries to view PII before selection | `{landlordId, applicantId, blocked: true}` |
| `applicant_selected` | Landlord selects applicant | `{landlordId, applicantId, listingId}` |
| `pii_revealed` | PII unlocked after selection | `{landlordId, applicantId, revealTime}` |
| `profile_created` | Tenant creates anonymized profile | `{tenantId, timestamp}` |
| `document_processed` | Document OCR completes | `{tenantId, docType, processingTime}` |
| `scrubbing_flagged` | NER flags potential PII | `{applicantId, fieldType, scrubType}` |

**Success Metrics**:
- 100% of profiles shown to landlords are properly anonymized
- PII scrubbing accuracy >99% (minimize false negatives)
- Document processing time <5 seconds for 95th percentile
- Audit log completeness: 100% of access attempts logged
- Zero PII leakage incidents

---

## Dependencies

### Blocks
This story blocks several other features:

- US-003: Landlord applicant selection flow
- US-004: Automated adverse action notices (requires selection event)
- US-006: Tenant application management

### Blocked By
- US-002: User authentication (must have accounts to create profiles)
- ADR-013: PII Encryption with AES-256-GCM (APPROVED)
- ADR-014: PostgreSQL Row-Level Security for PII Access Control (APPROVED)
- ADR-015: NER Library Selection for PII Detection (APPROVED)
- ADR-016: Caching Strategy for Obfuscated Tenant Profiles (APPROVED)
- ADR-017: Immutable Audit Trail for Compliance Logging (APPROVED)

### Related Stories
- US-002: Automated Adverse Action Notices - Uses selection event
- US-003: Portable Tenant Screening Reports - Shares profile data
- US-004: Compliance audit logging

### External Dependencies
- NER library (spaCy, Stanford NER, or Hugging Face transformers)
- OCR service (Tesseract.js or cloud provider)
- KMS for encryption key management
- Redis for obfuscated profile caching

---

## Testing Requirements

### Unit Tests
- [ ] PII scrubbing service correctly identifies names
- [ ] PII scrubbing service correctly identifies locations
- [ ] PII scrubbing service correctly identifies organizations
- [ ] Credit band calculation from raw score
- [ ] Income-to-rent ratio calculation
- [ ] Applicant ID generation (uniqueness, format)
- [ ] Obfuscated profile transformation
- [ ] Audit log creation

### Integration Tests
- [ ] Complete profile creation flow
- [ ] Document upload and OCR processing
- [ ] Selection triggers PII reveal
- [ ] Email notification sent on reveal
- [ ] RLS policies enforce access control
- [ ] Audit logs created for all access attempts

### E2E Tests (Playwright)
```typescript
test('landlord sees only obfuscated profile', async ({ page }) => {
  await page.goto('/landlord/applications/listing-123')

  // Verify anonymized display
  await expect(page.locator('text=Applicant #')).toBeVisible()
  await expect(page.locator('text=4.1x')).toBeVisible() // income ratio
  await expect(page.locator('text=740-760')).toBeVisible() // credit band

  // Verify PII is hidden
  await expect(page.locator('text=Maya')).not.toBeVisible()
  await expect(page.locator('img[alt="applicant photo"]')).not.toBeVisible()
})

test('PII reveals after selection', async ({ page }) => {
  await page.goto('/landlord/applications/listing-123')
  await page.click('button:has-text("Select Applicant")')
  await page.click('button:has-text("Confirm Selection")')

  // Verify PII is now visible
  await expect(page.locator('text=Maya Chen')).toBeVisible()
  await expect(page.locator('img[alt="applicant photo"]')).toBeVisible()
})
```

**Test Coverage Target**: 90% for PII handling logic

---

## Security Considerations

**Access Control**:
- Only landlords reviewing specific listings can view applicant profiles
- PII locked until landlord makes selection
- Admin access to audit logs only
- Tenant owns and controls their profile data

**Data Validation**:
- All uploaded documents scanned for malware
- Input sanitization on all text fields
- Rate limiting on profile view requests
- CSRF protection on selection endpoint

**Encryption**:
- PII encrypted at rest with AES-256-GCM
- Encryption keys in KMS (AWS KMS or similar)
- TLS 1.3 for all data in transit
- Secure key rotation policy

**Potential Risks**:
- **NER false negatives** (PII leaks through) - Mitigate with multiple NER passes, human review for flagged content
- **Key compromise** - Mitigate with KMS, key rotation, access logging
- **Timing attacks** - Mitigate with constant-time comparisons
- **Inference attacks** - Mitigate by limiting visible data fields

---

## Performance Considerations

**Expected Load**:
- 500-1,000 profile views per day initially
- 100-200 document uploads per day
- Peak: 50 concurrent profile views

**Optimization Strategies**:
- Cache obfuscated profiles in Redis (invalidate on update)
- Pre-process documents on upload (async processing)
- Lazy load detailed credit information
- Database indexes on frequently queried fields
- Connection pooling for database access

**Performance Targets**:
- Profile load: < 1s (from cache)
- Document OCR: < 5s
- PII scrubbing: < 2s
- Selection/reveal: < 1s
- Audit log write: < 100ms

---

## Rollout Plan

**Phase 1: Development** (Week 1-2)
- [ ] Database schema and migrations
- [ ] PII scrubbing service implementation
- [ ] Obfuscated profile API endpoints
- [ ] Basic frontend components

**Phase 2: Integration** (Week 3)
- [ ] Document OCR integration
- [ ] Selection and reveal flow
- [ ] Email notifications
- [ ] Audit logging

**Phase 3: Testing** (Week 4)
- [ ] Unit and integration tests
- [ ] E2E tests
- [ ] Security review
- [ ] Performance testing
- [ ] NER accuracy validation

**Phase 4: Deployment**
- [ ] Deploy to staging
- [ ] UAT with test accounts
- [ ] Production deployment
- [ ] Monitoring setup

**Rollback Plan**:
- Feature flag to disable PII anonymization
- Fallback to showing basic profile (with warning)
- Database migration rollback scripts prepared

---

## Open Questions

- [x] **Which NER library should we use?**
  - **Answer**: Compromise.js with custom regex patterns (see ADR-015). Chosen for serverless compatibility, JavaScript-native implementation, and extensibility with custom patterns.

- [ ] **Should we allow tenants to preview their anonymized profile?**
  - **Answer**: TBD - Good UX but adds complexity

- [ ] **How do we handle international documents (non-English)?**
  - **Answer**: TBD - May need multilingual NER models

---

## Notes & Updates

### Update Log

| Date | Author | Update |
|------|--------|--------|
| 2025-11-19 | Product Manager | Initial story creation from consolidated User_Stories.md |
| 2025-11-19 | Product Manager | Added RICE scoring and technical specifications |
| 2025-11-19 | - | Approved - ready for architecture review |
| 2025-11-19 | UI Designer Agent | Added UI Designer Review section with mockup analysis (70% complete, critical gaps identified) |
| 2025-11-19 | Architecture Agent | Created 5 ADRs for architectural decisions (ADR-013 through ADR-017) |

### Discussion Notes

- This feature is the core compliance differentiator for ApartmentDibs
- Must balance NER accuracy with performance (false negatives are worse than false positives)
- Consider future enhancement for tenant preview of their anonymized profile
- Audit trail is critical for fair housing legal defense

---

## Related Documentation

- **Business Plan**: `docs/Business_Plan_and_GTM.md` - Competitive analysis, market opportunity
- **Customer Journey**: `docs/Customer_Journey_Map.md` - Maya persona pain points
- **Sitemap**: `docs/NextJS_Sitemap.md` - Route structure for tenant/landlord dashboards
- **ADRs**:
  - `docs/adr/ADR-013-pii-encryption-with-aes-256-gcm.md` - PII encryption strategy
  - `docs/adr/ADR-014-postgresql-row-level-security-for-pii-access.md` - Database access control
  - `docs/adr/ADR-015-ner-library-selection-for-pii-detection.md` - NER library selection
  - `docs/adr/ADR-016-caching-obfuscated-tenant-profiles.md` - Profile caching strategy
  - `docs/adr/ADR-017-immutable-audit-trail-for-compliance.md` - Audit trail implementation
- **Fair Housing**: Research on FHA requirements and recent settlements

---

**Last Updated**: 2025-11-19
**Assigned To**: Backend Developer, Frontend Developer
**Reviewer**: Architecture Agent, Quality Reviewer
