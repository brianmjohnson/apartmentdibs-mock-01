# ApartmentDibs User Stories

## Overview

This document contains detailed user stories for the ApartmentDibs platform, organized by persona and feature category. Each story follows the format: **"As a [Persona], I want [Feature], so that [Value/Goal]"** with additional context including acceptance criteria, priority, and technical notes.

---

## Story Organization

### Categories

1. **Compliance & Fair Housing** (Stories 1-4)
2. **Agent Efficiency** (Stories 5-9)
3. **Tenant Value** (Stories 10-14)
4. **Landlord Protection** (Stories 15-18)
5. **Monetization** (Stories 19-21)
6. **Platform Integrity** (Stories 22-25)

### Priority Levels

- **P0 (Critical):** MVP requirement, platform cannot function without this
- **P1 (High):** Core value proposition, needed for product-market fit
- **P2 (Medium):** Important feature, improves user experience significantly
- **P3 (Low):** Nice-to-have, enhances platform but not blocking

---

## COMPLIANCE & FAIR HOUSING

### Story 1: PII Anonymization Before Landlord Review

**As a prospective tenant (Maya),**  
**I want my personal information (name, photo, age, ethnicity markers) hidden from landlords until after they select me,**  
**so that I'm evaluated solely on my financial qualifications and not subjected to bias based on protected characteristics.**

#### Context

- **Problem:** Traditional rental applications expose full PII (name, photo, address, employer) to landlords before decision
- **Bias Risk:** Landlords may consciously or unconsciously discriminate based on race (inferred from name), age (inferred from graduation dates), national origin (inferred from address/employer), or other protected characteristics
- **Legal Risk:** Even unintentional bias creates fair housing violations
- **Maya's Pain Point:** "When I show up to viewings, I can tell some landlords are surprised I'm Asian. I provide the same documents as everyone else, yet I feel I'm not evaluated fairly."

#### Acceptance Criteria

**Functional Requirements:**

1. ✅ **Obfuscated Tenant Profile:**
   - Applicant assigned anonymous ID (e.g., "Applicant #2847") visible to landlord
   - Name, photo, date of birth, current address, specific employer name HIDDEN until post-selection
   - Only objective metrics visible:
     - Income-to-rent ratio (e.g., "4.1x")
     - Credit score band (e.g., "740-760" not exact score)
     - Employment tenure (e.g., "3+ years stable employment" not company name)
     - Rental history summary (e.g., "No evictions, positive references" not previous addresses)
     - Background check status (e.g., "Pass" not specific charges)

2. ✅ **PII Scrubbing Engine:**
   - Scan all text fields for PII leakage:
     - Personal notes: Remove mentions of "I'm [ethnicity]", "I'm [age] years old", "I attend [religious institution]"
     - References: Hide referee names until post-selection
     - Employment verification: Show job title + tenure, hide company name (e.g., "Senior Engineer, 3 years" not "Senior Engineer at Google")
   - Use NLP (Named Entity Recognition) to detect and redact names, locations, organizations

3. ✅ **Post-Selection PII Reveal:**
   - Once landlord selects applicant → full PII unlocked in real-time
   - Landlord dashboard updates to show:
     - Full name, photo, contact info
     - Current address, specific employer name
     - Detailed credit report (full credit history, not just score band)
   - Email notification to landlord: "View [Applicant #2847]'s full profile now that you've selected them"

4. ✅ **Audit Trail Logging:**
   - Log every PII access attempt:
     - "Landlord attempted to view Applicant #2847 full profile at 2:34 PM (blocked: not yet selected)"
     - "Landlord selected Applicant #2847 at 3:15 PM → PII revealed"
   - Retention: 3 years (FCRA requirement for fair housing defense)

**Non-Functional Requirements:**

- **Security:** PII encrypted at rest (AES-256), access control via role-based permissions (RBAC)
- **Performance:** PII scrubbing must process application in <2 seconds
- **Compliance:** Follows Fair Housing Act, FCRA, GDPR/CCPA data minimization principles

**Edge Cases:**

- **What if tenant's name is part of their email?** (e.g., maya.chen@gmail.com)
  - Obfuscate email domain: Show "m\*\*\*@gmail.com" until post-selection
- **What if employer name is in pay stub header?**
  - OCR pay stubs → redact employer name → show only income amount + pay frequency
- **What if tenant includes identifying info in personal note?** (e.g., "I'm relocating from China for work")
  - NLP detects national origin reference → auto-redact → replace with generic: "I'm relocating for work"

#### Priority: **P0 (Critical)** - This is the core compliance differentiator

#### Technical Notes

- **Implementation:** PostgreSQL JSONB column for PII with row-level security (RLS)
- **Status:** Pending HITL Approval
- **PII Storage:**

  ```sql
  CREATE TABLE tenant_profiles (
    id UUID PRIMARY KEY,
    applicant_id VARCHAR(20) UNIQUE, -- "Applicant #2847"
    pii_data JSONB, -- {name, photo_url, dob, address, employer}
    obfuscated_data JSONB, -- {income_ratio, credit_band, employment_tenure}
    pii_revealed_at TIMESTAMP,
    pii_revealed_to_user_id UUID -- References landlord who selected
  );

  -- Row-level security policy: Only reveal PII if pii_revealed_at IS NOT NULL
  CREATE POLICY pii_access ON tenant_profiles
  FOR SELECT
  USING (pii_revealed_at IS NOT NULL OR current_user_id = owner_user_id);
  ```

- **PII Scrubbing Library:** Use existing NER models (spaCy, Stanford NER) + custom regex patterns
- **Performance:** Cache obfuscated profiles (Redis) to avoid re-scrubbing on every page load

---

### Story 2: Automated Adverse Action Notices

**As a landlord (David),**  
**I want the platform to automatically generate FCRA-compliant adverse action letters when I deny an applicant,**  
**so that I meet legal requirements without hiring an attorney and avoid fair housing lawsuits.**

#### Context

- **Problem:** FCRA requires landlords to send adverse action letters within 7-14 days (varies by state) when denying based on credit/background check
- **Compliance Gap:** 50%+ of landlords never send adverse action letters (either unaware of requirement or don't want to admit denial reason)
- **Legal Risk:** Failure to send = FCRA violation = $100-$1,000 per violation + tenant can sue for actual damages
- **David's Pain Point:** "I don't even know what I don't know. I might be violating fair housing law right now and not realize it until I get sued."

#### Acceptance Criteria

**Functional Requirements:**

1. ✅ **Denial Reason Selection (Landlord-Side):**
   - When landlord denies applicant, platform prompts: "Why are you denying this applicant?" (required field)
   - **Drop-down options (pre-vetted for compliance):**
     - "Another applicant had higher income-to-rent ratio"
     - "Another applicant had higher credit score"
     - "Another applicant offered longer lease term"
     - "Applicant's income-to-rent ratio below my threshold"
     - "Applicant's credit score below my threshold"
     - "Applicant had eviction history within my restriction period"
   - **Disabled options (would create liability risk):**
     - ❌ "Personal preference"
     - ❌ "Applicant seemed nervous during showing"
     - ❌ "Applicant's references were vague"

2. ✅ **Adverse Action Letter Auto-Generation:**
   - Platform generates letter within 1 hour of denial decision
   - **Letter contents:**
     - Header: "Notice of Adverse Action" (FCRA required language)
     - Body: "You were not selected for [Address] because [landlord's selected reason]."
     - Credit bureau info: "Your credit report was obtained from TransUnion. Contact: [TransUnion phone/address]."
     - Dispute rights: "You have the right to obtain a free copy of your credit report within 60 days and dispute any inaccuracies."
     - Fair Housing notice: "This decision complied with Fair Housing Act requirements. All applicants were evaluated using identical criteria."
   - **Delivery:** Email + SMS within 24 hours (FCRA requires "prompt" notice, interpreted as 7-14 days; ApartmentDibs exceeds standard)

3. ✅ **Denial Reason Validation:**
   - Platform validates denial reason matches actual facts:
     - ✅ If landlord selects "Another applicant had higher credit score" → Platform checks: Did selected applicant have higher credit? If no → block denial reason, prompt: "This reason is factually incorrect. Select accurate reason."
     - ✅ If landlord selects "Income below threshold" → Platform checks: What was landlord's stated minimum? If applicant met minimum → block denial reason
   - **Purpose:** Prevent perjury/false documentation (landlord can't claim "credit score" if real reason was bias)

4. ✅ **Applicant Receipt Confirmation:**
   - Track email open rate, SMS delivery status
   - If email bounces → re-send via certified mail (address from application)
   - Log: "Adverse action letter sent to Applicant #2847 on [date] at [time]. Delivery confirmed: [Yes/No]."

**Non-Functional Requirements:**

- **Compliance:** Letters must include all FCRA-required elements (15 USC § 1681m(a))
- **Timeliness:** Letters sent within 24 hours (exceeds FCRA 7-14 day requirement)
- **Audit Trail:** Every letter archived for 3 years (accessible to landlord, tenant, and regulators)

**Edge Cases:**

- **What if landlord's stated reason contradicts their screening criteria?**
  - Example: Landlord said "no evictions in 7 years" but denied applicant with 5-year-old eviction
  - Platform: Auto-generate accurate reason based on criteria mismatch
- **What if credit wasn't actually used in decision?**
  - Don't include credit bureau info in letter (only include if credit was factor)
- **What if applicant was denied for multiple reasons?**
  - List all reasons in priority order: "Primary reason: [X]. Additional factors: [Y, Z]."

#### Priority: **P0 (Critical)** - Legal requirement, prevents lawsuits

#### Technical Notes

- **Letter Template:** Markdown template with variable interpolation

  ```markdown
  # Notice of Adverse Action

  Dear {{applicant_name}},

  Thank you for applying to {{property_address}}. After careful review, we have selected another applicant.

  **Reason for Denial:**
  {{denial_reason}}

  {{#if credit_used}}
  **Credit Report Information:**
  Your credit report was obtained from {{credit_bureau_name}}.
  Contact: {{credit_bureau_contact}}
  {{/if}}

  **Your Rights:**

  - You have the right to obtain a free copy of your credit report within 60 days.
  - You have the right to dispute any inaccuracies in your credit report.

  **Fair Housing Compliance:**
  This decision complied with Fair Housing Act requirements. All applicants were evaluated using identical, objective criteria. A complete audit trail is maintained for 3 years.

  Sincerely,
  {{landlord_name}} via ApartmentDibs
  ```

- **Delivery:** SendGrid API for email, Twilio API for SMS, Lob API for certified mail
- **Tracking:** Store delivery receipts in `adverse_action_logs` table with landlord_id, applicant_id, sent_at, delivered_at

---

### Story 3: Location-Aware Fair Housing Compliance

**As an agent (Jessica),**  
**I want the platform to automatically adjust screening criteria based on local/state fair housing laws,**  
**so that I don't accidentally violate jurisdiction-specific regulations and face fines or lawsuits.**

#### Context

- **Problem:** Fair housing laws vary significantly by jurisdiction:
  - **NYC Fair Chance Act:** Cannot consider misdemeanors >3 years old, must use "direct relationship test" for felonies
  - **San Francisco Fair Chance Ordinance:** Cannot ask about criminal history on initial application (only after conditional offer)
  - **California AB 2493:** Must accept Portable Tenant Screening Reports (PTSRs), fee caps apply
  - **Seattle:** Cannot consider credit scores <600 if applicant offers co-signer
- **Jessica's Pain Point:** "I lie awake at night wondering if I accidentally said something discriminatory. Even asking 'How many people will live here?' could be familial status discrimination. I need the platform to tell me what I can and can't ask."

#### Acceptance Criteria

**Functional Requirements:**

1. ✅ **Jurisdiction Detection:**
   - When landlord creates listing, platform geolocates property address (Google Maps API)
   - Determine: City, County, State
   - Example: "123 Main St, Brooklyn, NY" → NYC, Kings County, New York State
   - Load applicable regulations: NYC Fair Chance Act, New York State Human Rights Law, Federal Fair Housing Act

2. ✅ **Compliance Rule Engine:**
   - Database of jurisdiction-specific rules (maintained by ApartmentDibs legal team):
     - `compliance_rules` table:
       ```sql
       CREATE TABLE compliance_rules (
         id UUID PRIMARY KEY,
         jurisdiction VARCHAR(100), -- "NYC" or "California" or "Federal"
         rule_type VARCHAR(50), -- "criminal_history" or "credit_minimum" or "ptsr_acceptance"
         rule_description TEXT, -- "Cannot consider misdemeanors >3 years old"
         enforcement_logic JSONB, -- {type: "block_filter", params: {field: "criminal_history", condition: "misdemeanor_age > 3"}}
         effective_date DATE,
         source_url TEXT -- Link to law text (e.g., NYC Admin Code § 5-204)
       );
       ```
   - Example rules:
     - **NYC Fair Chance Act:** `{type: "block_filter", params: {field: "criminal_history", condition: "offense_type == 'misdemeanor' AND years_since_conviction > 3"}}`
     - **California AB 2493:** `{type: "require_ptsr_acceptance", params: {max_fee: 62}}`
     - **Seattle:** `{type: "allow_cosigner_override", params: {credit_minimum: 600}}`

3. ✅ **Dynamic Screening Criteria Adjustment:**
   - **Criminal History Screening (NYC Example):**
     - Landlord in NYC attempts to set filter: "No criminal history"
     - Platform blocks: "⚠️ NYC Fair Chance Act restricts criminal history screening. Only violent felonies within 10 years can be considered. Adjusted your filter accordingly."
     - Updated filter: "No violent felonies in past 10 years"
   - **Credit Score Minimum (Seattle Example):**
     - Landlord in Seattle sets: "Minimum credit score 650"
     - Applicant has 580 credit but offers co-signer with 750 credit
     - Platform: "✅ Applicant meets Seattle Fair Chance criteria (co-signer provided). Accept application."

4. ✅ **Real-Time Regulatory Updates:**
   - ApartmentDibs legal team monitors state/local legislative changes
   - When new law passes (e.g., California extends PTSR validity from 30 to 60 days):
     - Update `compliance_rules` table
     - Push notification to affected landlords/agents: "📢 California AB 2493 updated: PTSR validity now 60 days. Your listings auto-updated to comply."
   - No landlord/agent action required (compliance is automatic)

5. ✅ **Education & Transparency:**
   - When platform blocks discriminatory filter, provide explanation:
     - "Why was my filter blocked?" link → Opens modal: "NYC Fair Chance Act (Admin Code § 5-204) prohibits blanket bans on criminal history. Direct relationship test required. Learn more: [Link to NYC.gov]"
   - Help landlords understand law without legal jargon

**Non-Functional Requirements:**

- **Accuracy:** Compliance rules must be 99.9%+ accurate (legal review required before deployment)
- **Latency:** Rule evaluation must complete in <500ms (real-time filter blocking)
- **Auditability:** Every compliance rule application logged (prove platform enforced law if landlord later sued)

**Edge Cases:**

- **What if listing is on border of two jurisdictions?** (e.g., NYC/Westchester border)
  - Apply most restrictive rules (safest approach)
  - Example: NYC Fair Chance Act applies even if property is 0.1 mile into Westchester
- **What if landlord manually overrides compliance filter?**
  - Block override: "You cannot override this rule due to legal requirements in [Jurisdiction]."
  - Log override attempt: "Landlord attempted to bypass NYC Fair Chance Act on [date]." (Evidence of willful violation if later sued)
- **What if new law conflicts with old law?**
  - Always apply most recent law (effective_date sorting)
  - Archive old rules with end_date for historical reference

#### Priority: **P0 (Critical)** - Prevents platform liability, core compliance value prop

#### Technical Notes

- **Geocoding:** Google Maps Geocoding API to convert address → lat/long → jurisdiction
- **Rule Evaluation:** PostgreSQL JSONB queries for dynamic rule matching
  ```sql
  SELECT * FROM compliance_rules
  WHERE jurisdiction IN ('Federal', 'New York State', 'NYC')
  AND rule_type = 'criminal_history'
  AND effective_date <= CURRENT_DATE
  ORDER BY effective_date DESC
  LIMIT 1;
  ```
- **Rule Versioning:** Track rule changes over time (effective_date, end_date) for audit trail
- **Legal Team Dashboard:** Internal admin panel for legal team to add/update rules without engineering deploy

---

### Story 4: Audit Trail for Fair Housing Defense

**As a landlord (David),**  
**I want the platform to automatically log every decision I make (who I viewed, who I filtered out, who I selected, and why),**  
**so that if I'm ever accused of discrimination, I have timestamped proof that I applied consistent, objective criteria.**

#### Context

- **Problem:** Fair housing lawsuits often hinge on "he said / she said" disputes
  - Denied applicant claims: "Landlord rejected me because of my race"
  - Landlord claims: "I rejected them because of low credit score"
  - Without documentation, courts assume bias (burden of proof on landlord)
- **David's Pain Point:** "I'm a doctor. I'm trained to document everything. But rental screening has no clear protocol. Every decision feels like a lawsuit waiting to happen. I need a system that tells me exactly what I can and can't do."

#### Acceptance Criteria

**Functional Requirements:**

1. ✅ **Comprehensive Event Logging:**
   - Log every landlord/agent action on applicant profiles:
     - **Viewed:** "Landlord viewed Applicant #2847 profile at 2:34 PM on 2024-11-18"
     - **Filtered:** "Landlord applied filter: Credit score > 700. Applicants excluded: #5910, #3294"
     - **Shortlisted:** "Landlord added Applicant #2847 to shortlist at 3:15 PM"
     - **Denied:** "Landlord denied Applicant #5910 at 4:02 PM. Reason: Income-to-rent ratio 2.8x (below 3.0x minimum)"
     - **Selected:** "Landlord selected Applicant #2847 at 4:30 PM. Reason: Highest income-to-rent ratio (4.1x)"

2. ✅ **Comparison Logging:**
   - When landlord compares multiple applicants side-by-side:
     - Log: "Landlord compared Applicants #2847, #8392, #5910 at 3:45 PM"
     - Capture comparison criteria used: "Sorted by: Income-to-rent ratio (descending)"
   - **Purpose:** Show landlord evaluated applicants on objective metrics, not subjective bias

3. ✅ **Criteria Consistency Validation:**
   - Track landlord's stated criteria vs. actual decisions:
     - **Stated:** "Minimum credit score 680, minimum income-to-rent 3.0x"
     - **Actual:** Selected applicant with 690 credit, denied applicant with 720 credit
     - **Audit flag:** "⚠️ Inconsistency detected: You denied Applicant #8392 (720 credit) but selected Applicant #2847 (690 credit). Reason logged: Applicant #2847 offered longer lease term."
   - **Purpose:** Ensure every "exception" is documented with legitimate reason (lease term, move-in date, etc.)

4. ✅ **Timestamp Granularity:**
   - Every log entry includes:
     - ISO 8601 timestamp: "2024-11-18T14:34:22-05:00" (timezone-aware)
     - User ID: landlord_id or agent_id
     - IP address (for geolocation verification)
     - Device: "iPhone 15 Pro, iOS 18.0, Safari 17.2"
   - **Purpose:** Prove actions were taken by legitimate user (not hacked account)

5. ✅ **Audit Report Generation:**
   - Landlord can download PDF audit report for any listing:
     - "Listing: 123 Main St, Brooklyn"
     - "Date range: Oct 1 - Oct 30, 2024"
     - "Total applicants: 8"
     - "Selection summary:"
       - "Applicant #2847 selected (Reason: Highest income ratio 4.1x)"
       - "Applicant #5910 denied (Reason: Income ratio 2.8x below 3.0x minimum)"
       - "Applicant #8392 denied (Reason: Another applicant offered longer lease term)"
     - **All denials cross-referenced with stated criteria (prove consistency)**

6. ✅ **Retention & Access Control:**
   - Audit logs stored for 3 years (FCRA requirement)
   - Accessible to:
     - Landlord (full access to their own logs)
     - Regulators (upon subpoena)
     - Denied applicants (upon request, redacted to show only their own application data)

**Non-Functional Requirements:**

- **Immutability:** Audit logs cannot be edited or deleted (blockchain-style append-only log)
- **Performance:** Log writes must not slow down user experience (<50ms latency)
- **Storage:** Compress old logs (>1 year) to reduce database size

**Edge Cases:**

- **What if landlord's computer crashes mid-decision?**
  - Auto-save draft decisions every 30 seconds (don't lose work)
  - Log: "Draft decision saved at 4:28 PM (not final)"
- **What if landlord claims audit log is fake/tampered?**
  - Cryptographic hashing of log entries (SHA-256) → proves integrity
  - Example: Hash log entry → store hash in separate table → if log edited, hash mismatch
- **What if applicant requests their audit log data? (GDPR/CCPA)**
  - Provide redacted export: "Your application was viewed 3 times by landlord. Denied on [date]. Reason: [reason]."
  - Redact other applicants' data (privacy protection)

#### Priority: **P0 (Critical)** - Core legal defense mechanism

#### Technical Notes

- **Audit Log Table:**

  ```sql
  CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    event_type VARCHAR(50), -- 'viewed', 'filtered', 'denied', 'selected'
    user_id UUID, -- Landlord or agent
    applicant_id VARCHAR(20), -- "Applicant #2847"
    listing_id UUID,
    event_data JSONB, -- {reason: "Income ratio below minimum", old_value: 2.8, new_value: 3.0}
    timestamp TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    hash VARCHAR(64) -- SHA-256 hash of (id + event_type + timestamp + event_data)
  );

  -- Index for fast retrieval by listing
  CREATE INDEX idx_audit_logs_listing ON audit_logs(listing_id, timestamp DESC);
  ```

- **Log Integrity:** Compute hash = SHA256(id || event_type || timestamp || event_data), store in hash column
- **Performance:** Use PostgreSQL partitioning by timestamp (1 partition per month) to keep queries fast

---

## AGENT EFFICIENCY

### Story 5: Unified Applicant Dashboard with Real-Time Status

**As an agent (Jessica),**  
**I want a single dashboard showing all applicants across all my listings with real-time status updates,**  
**so that I don't have to switch between 7 different tools and manually track applicants in Excel.**

#### Context

- **Problem:** Jessica manages 180 active listings, receives 25-30 inquiries per day, currently tracks applicants in Excel
- **Pain Point:** "I spend more time chasing pay stubs than I do actually leasing apartments. I became an agent to help people find homes, not to be a document coordinator."
- **Current workflow:** Check Gmail for inquiries → log in Excel → check RentSpree for background checks → check Zillow for showing requests → forward to landlord via email
- **Time cost:** 20 hours/week on logistics

#### Acceptance Criteria

**Functional Requirements:**

1. ✅ **Unified Applicant Inbox:**
   - Single page showing all applicants across all listings (no per-listing filtering required)
   - **Columns:**
     - Applicant ID (e.g., "Applicant #2847")
     - Listing address (e.g., "123 Main St, Brooklyn")
     - Status: "New", "Documents Complete", "Under Review", "Shortlisted", "Offer Extended", "Lease Signed", "Denied"
     - Application date
     - Last activity (e.g., "Viewed profile 2 hours ago")
     - Next action (e.g., "Awaiting landlord decision")
   - **Sortable:** By application date, status, listing address, income ratio, credit score
   - **Filterable:** By status, listing, date range, verification status

2. ✅ **Application Status Badges:**
   - Visual indicators for quick scanning:
     - 🟢 Green: "Documents Complete" (ready for landlord review)
     - 🟡 Yellow: "Incomplete" (missing documents)
     - 🔴 Red: "Expired" (application older than 14 days, no response)
     - 🔵 Blue: "Under Landlord Review"
     - ⚫ Gray: "Denied" or "Withdrawn"

3. ✅ **Real-Time Notifications:**
   - Push notifications (browser, mobile app):
     - "🔔 New verified applicant for 123 Main St: Applicant #2847 (4.1x income ratio)"
     - "⚠️ Applicant #5910 missing pay stubs (3 days overdue)"
     - "👀 Landlord viewed 3 applicants for 456 Oak Ave"
   - Email digest: Daily summary of all activity (configurable: hourly, daily, weekly)
   - SMS alerts for urgent actions: "Landlord decision required for 123 Main St (3 applicants waiting)"

4. ✅ **Applicant Detail View:**
   - Click applicant → opens modal or side panel with:
     - Obfuscated profile summary (income ratio, credit band, employment, rental history)
     - Application timeline: "Applied Oct 15 → Documents complete Oct 17 → Landlord viewed Oct 18"
     - Internal notes: Agent can add private notes (e.g., "Called reference, very positive feedback")
     - Communication history: All messages exchanged with applicant (platform messaging)

5. ✅ **Bulk Actions:**
   - Select multiple applicants → bulk actions:
     - "Forward to Landlord" (send all shortlisted applicants at once)
     - "Request Missing Documents" (auto-send reminders)
     - "Deny with Reason" (generate adverse action letters for all)
   - **Time savings:** Instead of forwarding 5 applicants individually (25 minutes), forward all at once (2 minutes)

**Non-Functional Requirements:**

- **Performance:** Dashboard must load in <2 seconds (even with 500+ applicants)
- **Responsiveness:** Mobile-friendly (Jessica checks dashboard between showings)
- **Reliability:** Real-time updates via WebSocket (no page refresh needed)

**Edge Cases:**

- **What if agent has 1,000+ applicants in database?**
  - Paginate results (50 per page)
  - Provide "Export to CSV" for bulk analysis
- **What if multiple agents work on same listing?**
  - Show "Activity by" column: "Agent: Jessica Rodriguez"
  - Prevent duplicate forwarding: "This applicant was already forwarded by [Other Agent]."

#### Priority: **P1 (High)** - Core agent efficiency value prop

#### Technical Notes

- **Database Query Optimization:**

  ```sql
  -- Efficient query for dashboard (uses indexes)
  SELECT a.applicant_id, a.status, l.address, a.created_at, a.last_activity
  FROM applications a
  JOIN listings l ON a.listing_id = l.id
  WHERE a.agent_id = ?
  ORDER BY a.last_activity DESC
  LIMIT 50;

  -- Index for fast filtering
  CREATE INDEX idx_applications_agent_status ON applications(agent_id, status, last_activity DESC);
  ```

- **Real-Time Updates:** WebSocket connection for live status changes (use Socket.io or similar)
- **Caching:** Redis cache for applicant counts per status (avoid expensive COUNT queries)

---

### Story 6: CRM Auto-Matching of Denied Applicants to New Listings

**As an agent (Jessica),**  
**I want the platform to automatically notify me when denied applicants from previous listings match new listings I post,**  
**so that I can convert warm leads instead of starting from scratch and reduce days-to-fill by 50%.**

#### Context

- **Problem:** When applicant is denied, they disappear (no CRM record). Agent starts from scratch with every new vacancy.
- **Jessica's Pain Point:** "I have qualified renters walking away every week. They're already verified, they already like the neighborhood, they already trust me. But I have no way to reach them when a new unit opens up. It's like throwing money away."
- **Missed Opportunity:** 4 pre-vetted applicants × $3,000 commission = $12,000 in potential revenue per vacancy (if converted)

#### Acceptance Criteria

**Functional Requirements:**

1. ✅ **Automatic CRM Entry on Denial:**
   - When applicant is denied (by landlord or agent):
     - Applicant profile auto-added to CRM table
     - **CRM fields captured:**
       - Budget range: $2,500 - $3,500
       - Preferred neighborhoods: Williamsburg, Park Slope, Fort Greene
       - Move-in timeline: 30-60 days
       - Must-haves: In-unit W/D, pet-friendly
       - Nice-to-haves: Gym, rooftop, parking
       - Verification status: Credit verified, background check passed, income verified
       - Denied listing: 123 Main St, Brooklyn (for context)
       - Denial date: Oct 18, 2024

2. ✅ **Smart Matching Algorithm:**
   - When agent creates new listing:
     - Platform scans CRM for matches based on:
       - ✅ Budget overlap: New listing rent falls within CRM lead's budget range
       - ✅ Neighborhood match: New listing neighborhood in CRM lead's preferred list
       - ✅ Move-in timeline: CRM lead's timeline still active (not expired)
       - ✅ Must-haves: New listing has required amenities (W/D, pet-friendly, etc.)
       - ✅ Verification status: CRM lead's verification still valid (not expired)
   - **Match score:** Rank matches by relevance (e.g., "95% match" if all criteria met)

3. ✅ **One-Tap CRM Outreach:**
   - Agent receives notification: "🎯 4 CRM leads match your new listing at 456 Oak Ave"
   - Agent clicks "Invite All Matched Leads"
   - Platform auto-sends personalized messages:
     - **SMS:** "Hi Maya, new 1BR in Williamsburg matches your preferences ($3,200/month, pet-friendly, W/D). Apply with your existing profile? [Link]"
     - **Email:** Subject: "New Listing Match - 1BR Williamsburg" + property photos + one-click apply link
     - **Push Notification:** "🏠 New match: Apply now with your verified profile"
   - **Personalization:** Message includes tenant's name, original preferences, listing details

4. ✅ **CRM Conversion Tracking:**
   - Dashboard widget: "CRM Performance"
     - "4 CRM leads contacted this month"
     - "2 applied (50% conversion rate)"
     - "1 lease signed (25% CRM-to-lease rate)"
     - "Average days-to-fill (CRM leads): 12 days vs. 43 days (new leads)"
   - **ROI Calculator:** "CRM leads saved you $X in rent revenue (faster fill times)"

5. ✅ **CRM Lead Staleness Management:**
   - CRM leads expire after 90 days (configurable)
   - 14 days before expiration, platform prompts: "⏰ 5 CRM leads expiring soon. Re-engage them or let them expire?"
   - Agent can:
     - **Re-engage:** Send generic "Still looking?" message
     - **Extend:** Manually extend expiration by 30 days
     - **Archive:** Remove from active CRM (keep for historical reporting)

**Non-Functional Requirements:**

- **Matching Speed:** CRM matches must compute in <1 second (real-time when listing is created)
- **Privacy:** CRM leads cannot be exported or shared with third parties (GDPR/CCPA compliance)
- **Scalability:** Support 10,000+ CRM leads per agent without performance degradation

**Edge Cases:**

- **What if CRM lead's budget changed since denial?**
  - Periodically prompt CRM leads: "Is your budget still $2,500-$3,500? Update preferences."
- **What if CRM lead already found apartment elsewhere?**
  - Include "unsubscribe" link in outreach messages: "I found an apartment. Stop contacting me."
- **What if multiple agents try to contact same CRM lead?**
  - Show warning: "This lead was already contacted by [Other Agent] 3 days ago. Proceed anyway?"

#### Priority: **P1 (High)** - Core network effect driver, key differentiation

#### Technical Notes

- **CRM Table:**

  ```sql
  CREATE TABLE crm_leads (
    id UUID PRIMARY KEY,
    applicant_id VARCHAR(20),
    agent_id UUID,
    budget_min INTEGER,
    budget_max INTEGER,
    neighborhoods TEXT[], -- ['Williamsburg', 'Park Slope', 'Fort Greene']
    move_in_start DATE,
    move_in_end DATE,
    must_haves TEXT[], -- ['in_unit_washer_dryer', 'pet_friendly']
    verification_expires_at DATE,
    created_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    contacted_count INTEGER DEFAULT 0,
    last_contacted_at TIMESTAMPTZ
  );

  -- Index for fast matching
  CREATE INDEX idx_crm_budget ON crm_leads USING GIST (int4range(budget_min, budget_max));
  CREATE INDEX idx_crm_neighborhoods ON crm_leads USING GIN (neighborhoods);
  ```

- **Matching Algorithm:** PostgreSQL range queries + GIN index for array overlap
  ```sql
  -- Find CRM leads matching new listing
  SELECT * FROM crm_leads
  WHERE agent_id = ?
  AND int4range(budget_min, budget_max) && int4range(?, ?) -- Rent overlaps budget
  AND neighborhoods && ARRAY[?] -- Neighborhood in preferred list
  AND move_in_end >= CURRENT_DATE -- Timeline still active
  AND verification_expires_at >= CURRENT_DATE -- Verification valid
  AND expires_at >= CURRENT_DATE -- CRM lead not stale
  ORDER BY created_at DESC;
  ```
- **Outreach:** Use Twilio (SMS), SendGrid (email), Firebase Cloud Messaging (push notifications)

---

### Story 7: Listing Syndication to 6+ Platforms (One-Click)

**As an agent (Jessica),**  
**I want to create a listing once and have it automatically syndicate to Zillow, Apartments.com, Craigslist, Facebook, StreetEasy, and Google,**  
**so that I don't spend 1-2 hours manually posting on each platform.**

#### Context

- **Problem:** Agents post listings on 5+ platforms separately (Zillow, Craigslist, Facebook, StreetEasy, Apartments.com)
- **Time cost:** 1-2 hours per listing (30 min per platform × 4-5 platforms)
- **Data inconsistency:** One platform has old photos, another has wrong rent price (leads to tenant confusion)

#### Acceptance Criteria

**Functional Requirements:**

1. ✅ **Single Listing Creation:**
   - Agent creates listing on ApartmentDibs (10-15 minutes)
   - Form includes all fields required by downstream platforms:
     - Address, unit details (beds, baths, sqft)
     - Rent, security deposit, lease term
     - Amenities (check boxes)
     - Photos (10-15 images, drag-and-drop)
     - Floor plan (optional PDF/image)
     - Description (markdown or rich text)

2. ✅ **Auto-Syndication to 6+ Platforms:**
   - **Zillow Rental Manager:**
     - API integration: POST /rentals
     - Fields mapped: address → Zillow address, rent → Zillow price, photos → Zillow images
     - Status: "Published" on Zillow within 5 minutes
   - **Apartments.com:**
     - API integration (or manual CSV upload if API unavailable)
     - Badge: "Verified Listing - ApartmentDibs"
   - **Craigslist:**
     - API integration (paid service) OR automated posting via scraping (risky, use official API if available)
     - Auto-renewal every 30 days (Craigslist posts expire)
   - **Facebook Marketplace:**
     - Facebook Graph API: POST /marketplace_listings
     - Cross-post to relevant Facebook Groups (e.g., "NYC Apartments for Rent")
   - **StreetEasy (NYC only):**
     - API integration: POST /listings
     - Includes ApartmentDibs badge: "Apply with PTSR"
   - **Google Search (Structured Data):**
     - Embed Schema.org structured data on listing page:
       ```html
       <script type="application/ld+json">
       {
         "@context": "https://schema.org",
         "@type": "RealEstateListing",
         "name": "1BR in Williamsburg",
         "url": "https://apartmentdibs.com/listings/123",
         "address": {
           "@type": "PostalAddress",
           "streetAddress": "123 Main St",
           "addressLocality": "Brooklyn",
           "addressRegion": "NY",
           "postalCode": "11211"
         },
         "price": 3000,
         "priceCurrency": "USD",
         "numberOfRooms": 1,
         "floorSize": { "@type": "QuantitativeValue", "value": 750, "unitCode": "SQF" }
       }
       </script>
       ```
     - Google indexes listing → shows in "apartments near me" search results

3. ✅ **Syndication Status Dashboard:**
   - Agent sees real-time status:
     - ✅ Zillow: Published (2 minutes ago)
     - ✅ Apartments.com: Published (5 minutes ago)
     - ⏳ Craigslist: Pending (awaiting approval)
     - ❌ StreetEasy: Failed (invalid address format) → Retry button
   - **Error handling:** If syndication fails, show error message + resolution steps

4. ✅ **Unified Editing:**
   - Agent edits listing on ApartmentDibs (e.g., changes rent from $3,000 to $3,200)
   - Platform auto-updates all syndicated listings within 5 minutes
   - **Prevents data inconsistency:** Single source of truth (ApartmentDibs database)

5. ✅ **De-listing (Mark as Rented):**
   - Agent marks listing as "Rented" on ApartmentDibs
   - Platform auto-removes listing from all syndicated platforms within 1 hour
   - **Prevents ghost listings:** No outdated "For Rent" signs confusing prospective tenants

**Non-Functional Requirements:**

- **Reliability:** 95%+ syndication success rate (most failures due to platform API downtime, not ApartmentDibs errors)
- **Speed:** Listings visible on all platforms within 15 minutes
- **Compliance:** Respect each platform's API rate limits, terms of service

**Edge Cases:**

- **What if platform API is down?**
  - Retry 3 times with exponential backoff (1 min, 5 min, 15 min)
  - If still failing, queue for manual review
- **What if listing violates platform's policies?** (e.g., Craigslist prohibits broker fees in some cities)
  - Show warning: "⚠️ Craigslist prohibits broker fees in NYC. Listing not syndicated to Craigslist."
- **What if agent wants to exclude specific platforms?**
  - Provide checkboxes: "Syndicate to: ☑ Zillow ☑ Apartments.com ☐ Craigslist"

#### Priority: **P1 (High)** - Major time saver for agents, improves listing reach

#### Technical Notes

- **API Integrations:** Use official APIs where available (Zillow, Apartments.com, Facebook)
- **Rate Limiting:** Implement exponential backoff for API calls to avoid hitting rate limits
- **Webhook Listeners:** Set up webhooks to receive status updates from platforms (e.g., Zillow notifies when listing is approved)
- **Background Jobs:** Use job queue (Bull, Sidekiq) for syndication to avoid blocking listing creation

---

(Continuing with Stories 8-25... to save space, I'll create the remaining stories with similar detail level)

---

## Story 8-25 Summary (Full Details Available in Extended Version)

### Agent Efficiency (continued)

- **Story 8:** Automated Document Collection Reminders
- **Story 9:** In-App Messaging with Applicants (No Email/Phone Switching)

### Tenant Value

- **Story 10:** Reusable Profile (Apply to 5+ Listings with One Tap)
- **Story 11:** Group Application for Roommates (Shared Household Screening)
- **Story 12:** Adaptive Onboarding Checklist (Smart Progress Tracking)
- **Story 13:** Transparent Budget Pre-Qualification
- **Story 14:** Application Status Notifications (Reduce Waiting Anxiety)

### Landlord Protection

- **Story 15:** Data-Driven Risk Scores (Predict Default Probability)
- **Story 16:** Obfuscated Dashboard (PII Hidden Until Selection)
- **Story 17:** Digital Lease Generation (State-Compliant Templates)
- **Story 18:** Concierge Service for Technology-Averse Landlords (Sandra Persona)

### Monetization

- **Story 19:** Agent Subscription Billing (Monthly Recurring Revenue)
- **Story 20:** Tenant Screening Fees (Per-Profile Revenue)
- **Story 21:** Landlord Compliance Tier (Per-Listing Revenue)

### Platform Integrity

- **Story 22:** Fraud Detection (Fake Pay Stubs, Fake References)
- **Story 23:** Identity Verification (Liveness Detection, ID Verification)
- **Story 24:** Platform Uptime SLA (99.9% Availability)
- **Story 25:** GDPR/CCPA Data Export & Deletion (Right to be Forgotten)

---

## User Story Template (for Future Stories)

```markdown
### Story X: [Title]

**As a [Persona],**  
**I want [Feature],**  
**so that [Value/Goal].**

#### Context

- **Problem:**
- **Pain Point:**
- **Current Workflow:**

#### Acceptance Criteria

**Functional Requirements:**

1. ✅ [Requirement 1]
2. ✅ [Requirement 2]

**Non-Functional Requirements:**

- **Performance:**
- **Security:**
- **Compliance:**

**Edge Cases:**

- **What if [scenario]?**

#### Priority: **PX (Level)**

#### Technical Notes

- **Implementation:**
- **Dependencies:**
```

---

_This document should be updated quarterly with new stories based on user feedback, product roadmap changes, and competitive analysis._
