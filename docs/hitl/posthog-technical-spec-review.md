# HITL Review: PostHog Integration Technical Specification

**Review Type**: HITL Gate #3 - Technical Specification Review
**Date**: 2025-11-20
**Status**: PENDING REVIEW
**Reviewers**: Product Owner, Tech Lead, Security Lead
**Related Documents**:
- [Technical Specification](../technical-specs/posthog-integration-spec.md)
- [ADR-013: PostHog Analytics Platform](../adr/ADR-013-posthog-analytics-and-experimentation-platform.md)
- [US-002: PostHog Integration](../user-stories/posthog-integration.md)

---

## Review Summary

This HITL checkpoint reviews the technical specification for PostHog analytics integration before implementation begins. This is **HITL Gate #3** in the SDLC workflow:

1. ✅ **Gate #1**: User Story (US-002) - APPROVED
2. ✅ **Gate #2**: Architecture Decision (ADR-013) - APPROVED
3. ⏳ **Gate #3**: Technical Specification - **PENDING REVIEW** (this document)
4. ⏸️ Gate #4: Quality Review - After implementation (if issues found)

---

## What Needs Review

### 1. Implementation Approach

**Question**: Does the proposed implementation align with project architecture?

**Key Points to Review**:
- 11 new files, 2 files modified
- Uses Next.js 15.3+ instrumentation pattern (`instrumentation-client.ts`)
- Integrates with existing Better Auth session management
- Wraps app with PostHogProvider (similar to QueryClientProvider)
- Manual pageview tracking for App Router accuracy

**Concerns**:
- [ ] Does instrumentation pattern work with Next.js 16.0.3?
- [ ] Is wrapping with another provider acceptable (performance impact)?
- [ ] Should we use a different initialization pattern?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES

---

### 2. File Structure

**Question**: Are the proposed files organized correctly?

**New Files** (11 total):
```
instrumentation-client.ts                    # Root level (Next.js pattern)
lib/analytics/posthog.ts                    # Client utilities
lib/analytics/posthog.server.ts             # Server utilities
lib/analytics/events.ts                      # Event definitions
lib/analytics/types.ts                       # TypeScript types
lib/hooks/use-posthog-auth.ts               # Auth integration
lib/hooks/use-track-event.ts                # Event tracking
components/providers/posthog-provider.tsx   # React provider
app/_components/posthog-pageview.tsx        # Pageview tracking
docs/analytics/event-catalog.md             # Documentation
docs/analytics/feature-flag-patterns.md     # Documentation
```

**Modified Files** (2 total):
- `app/layout.tsx` - Minimal (just imports)
- `app/providers.tsx` - Add PostHogProvider wrapper

**Concerns**:
- [ ] Should analytics be in `lib/analytics/` or `lib/posthog/`?
- [ ] Should hooks be in `lib/hooks/` or `hooks/`?
- [ ] Should `instrumentation-client.ts` be in root or `lib/`?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES

---

### 3. Better Auth Integration

**Question**: Is the Better Auth integration approach correct?

**Current Approach**:
- Use `usePostHogAuth()` hook in providers
- Calls `useSession()` to get user data
- Automatically identifies/resets user on session change

**Open Question**:
**What is the correct import path for Better Auth session hook?**

Options:
- A) `import { useSession } from '@/lib/auth-client'` (assumed)
- B) `import { useSession } from 'better-auth/react'` (official SDK)
- C) Custom implementation (location TBD)

**Current State**: Spec uses mock `useSession()` hook with comment to update

**Concerns**:
- [ ] Is there an existing Better Auth session hook?
- [ ] What is the session data shape (user + organization)?
- [ ] Should we call identify on server-side (during auth callback)?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES
**Answer Needed**: Better Auth session hook import path

---

### 4. Event Tracking Strategy

**Question**: Are the 9 custom events sufficient and correctly defined?

**Events from US-002**:
1. `application_created` - Tenant submits application
2. `application_viewed` - Landlord/agent views application
3. `listing_created` - Landlord creates listing
4. `listing_viewed` - User views listing
5. `message_sent` - User sends message
6. `search_performed` - User searches listings
7. `profile_completed` - User completes profile
8. `payment_initiated` - User starts payment
9. `payment_completed` - Payment succeeds

**Spec Approach**:
- Typed event definitions in `lib/analytics/types.ts`
- Helper hooks per domain (`useApplicationEvents`, `useListingEvents`, etc.)
- Consistent properties: `userId`, `timestamp` (auto-added)

**Concerns**:
- [ ] Are 9 events enough for MVP? Should we add more?
- [ ] Should we track page-level events (e.g., `dashboard_viewed`)?
- [ ] Are event properties sufficient for analytics queries?
- [ ] Should we include `sessionId` in all events?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES

---

### 5. Privacy & GDPR Compliance

**Question**: Does the implementation meet GDPR/CCPA requirements?

**Privacy Features**:
- ✅ IP anonymization (`ip: false`)
- ✅ Person profiles: identified only (`person_profiles: 'identified_only'`)
- ✅ Do Not Track respected (`respect_dnt: true`)
- ✅ Session recording masks passwords/phone numbers
- ✅ User opt-out mechanism implemented
- ⚠️ Cookie consent banner (deferred to US-010)

**Open Question**:
**Should we require cookie consent before PostHog initialization?**

Options:
- A) Deploy now without consent (for internal team testing)
- B) Block PostHog until consent given (delays MVP)
- C) Use localStorage instead of cookies (no consent needed, but less accurate)

**Current Recommendation**: Option A (deploy for internal team, add consent in US-010)

**Concerns**:
- [ ] Is it acceptable to deploy without cookie consent for internal testing?
- [ ] Should we use a "legitimate interest" basis for analytics (GDPR Article 6)?
- [ ] Do we need a Data Processing Agreement (DPA) with PostHog?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES
**Decision Needed**: Cookie consent timing

---

### 6. Session Recording Scope

**Question**: Should session recording be enabled by default?

**Current Approach**:
- Enabled by default for all users
- Passwords and phone numbers masked
- Sensitive pages blocked (`/api/*`, `/admin/settings`)
- Users can opt-out in settings (future implementation)

**Options**:
- A) Enabled by default, opt-out in settings (current spec)
- B) Opt-in only (requires banner/toggle)
- C) Enabled only for internal users (by feature flag)
- D) Disabled until US-010 cookie consent implemented

**Privacy Considerations**:
- Recording captures all user interactions (clicks, scrolls, text entry)
- Useful for debugging but privacy-invasive
- GDPR requires "legitimate interest" or consent

**Concerns**:
- [ ] Are users comfortable with recording by default?
- [ ] Should we show a banner: "This session is being recorded for quality"?
- [ ] Should recordings be limited to specific pages (e.g., only forms)?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES
**Decision Needed**: Session recording default state

---

### 7. Feature Flags for Testing

**Question**: What initial feature flags should we create?

**Proposed Flags**:
1. `new-dashboard` (boolean): Enable new dashboard UI
2. `beta-features` (boolean): Show beta features
3. `maintenance-mode` (boolean): Display maintenance banner

**Usage**:
```typescript
const isEnabled = useFeatureFlagEnabled('new-dashboard')
return isEnabled ? <NewDashboard /> : <LegacyDashboard />
```

**Concerns**:
- [ ] Are these 3 flags sufficient for testing?
- [ ] Should we add more domain-specific flags (e.g., `advanced-search`)?
- [ ] What should the default rollout be (0%, 50%, 100%)?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES
**Decision Needed**: Initial feature flag list

---

### 8. Performance Impact

**Question**: Is the performance overhead acceptable?

**Expected Impact**:
- Bundle size: +50KB gzipped (~2% increase)
- PostHog init: ~50-100ms (one-time, non-blocking)
- Event capture: ~5-10ms per event (async)
- Feature flags: ~50ms (cached for 60s)
- Session recording: ~10-20ms per interaction

**Performance Budget**:
- ✅ LCP (Largest Contentful Paint): No impact
- ✅ FID (First Input Delay): <5ms overhead
- ✅ CLS (Cumulative Layout Shift): Zero
- ⚠️ TTI (Time to Interactive): +50ms (PostHog init)

**Mitigation**:
- Async initialization (non-blocking)
- Event batching (10 events or 10 seconds)
- Feature flag caching (60s TTL)
- Graceful degradation if PostHog fails

**Concerns**:
- [ ] Is +50ms TTI acceptable for MVP?
- [ ] Should we lazy-load PostHog after app interactive?
- [ ] Should we disable session recording on slow networks?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES

---

### 9. Testing Strategy

**Question**: Is the testing approach comprehensive?

**Proposed Tests**:
- **Unit Tests**: `lib/analytics/posthog.ts`, `lib/hooks/use-track-event.ts` (80% coverage)
- **Integration Tests**: PostHog initialization, user identification, pageview tracking
- **E2E Tests**: Custom event tracking, feature flags, graceful degradation

**Test Coverage Target**: 85% for analytics code

**Concerns**:
- [ ] Is 85% coverage sufficient?
- [ ] Should we add visual regression tests for feature flag UI changes?
- [ ] How do we test PostHog in CI/CD (mock or real PostHog project)?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES

---

### 10. Rollout Strategy

**Question**: Should we deploy to production immediately or staging first?

**Options**:
- A) Deploy to production immediately (feature flag at 0%)
- B) Deploy to staging first, test for 1 week, then production
- C) Deploy to production for internal team only (by organization ID)

**Current Recommendation**: Option C (internal team first)

**Phased Rollout**:
1. Week 1: Internal team (5 users)
2. Week 2: Beta users (50 users) - 10% rollout
3. Week 3: All users - 100% rollout

**Rollback Strategy**:
- Remove PostHogProvider from `app/providers.tsx` (instant rollback)
- Feature flags have default values (app works without PostHog)
- No database migrations (no data loss risk)

**Concerns**:
- [ ] Should we test in staging first (safer but slower)?
- [ ] Should we use a separate PostHog project for production?
- [ ] What metrics indicate successful rollout (event delivery rate, errors)?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES
**Decision Needed**: Rollout strategy

---

## Implementation Timeline

**Total Estimate**: 2 weeks (13 story points, ~32 hours)

**Phase 1** (Week 1, Days 1-2): Setup & Configuration
- [ ] Install packages, configure environment
- [ ] Create PostHog project, get API keys
- [ ] Initialize PostHog client
- [ ] Verify pageview tracking

**Phase 2** (Week 1, Days 3-4): User Identification
- [ ] Integrate with Better Auth
- [ ] Implement user identification
- [ ] Add organization context
- [ ] Test multi-tenancy

**Phase 3** (Week 2, Days 1-3): Event Tracking
- [ ] Create typed event definitions
- [ ] Implement 9 custom events
- [ ] Add events across app
- [ ] Verify events in dashboard

**Phase 4** (Week 2, Days 4-5): Advanced Features
- [ ] Implement feature flags (client + server)
- [ ] Enable session recording
- [ ] Create test flags
- [ ] Write tests

**Phase 5** (Week 2, Day 5): Testing & Documentation
- [ ] Unit tests (80% coverage)
- [ ] Integration tests
- [ ] E2E tests
- [ ] Documentation (event catalog, flag patterns)

**Timeline Concerns**:
- [ ] Is 2 weeks realistic for 11 new files + 2 modifications?
- [ ] Should we allocate buffer time for Better Auth integration unknowns?
- [ ] Should we split into 2 stories (core + advanced features)?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES

---

## Security Considerations

**Access Control**:
- ✅ Personal API key (server-only, never exposed to client)
- ✅ Project API key (public, read-only for events)
- ✅ Organization-level data isolation

**Data Validation**:
- ✅ Event properties sanitized
- ✅ No PII tracked (SSN, credit cards, passwords)
- ⚠️ Email addresses tracked (acceptable for rental context?)

**Potential Risks**:
- **Ad blockers**: 10-30% of users block PostHog (mitigate with proxy in future)
- **Data leakage**: Risk of accidentally tracking sensitive data
- **Third-party dependency**: PostHog downtime affects analytics (but not app)

**Mitigation**:
- Use allow-list for trackable properties
- Automatic PII redaction in abstraction layer
- Graceful fallback if PostHog unavailable

**Concerns**:
- [ ] Should we implement PII detection (regex for SSN, credit cards)?
- [ ] Should we hash email addresses before sending to PostHog?
- [ ] Should we audit all events for PII before production?

**Approval Needed**: ✅ YES / ❌ NO / 🔄 NEEDS CHANGES

---

## Open Questions (Require Answers Before Implementation)

### Critical Questions (Blockers)

1. **Better Auth Session Hook Import Path**
   - **Question**: What is the correct import for Better Auth session hook?
   - **Current**: Mock implementation with TODO comment
   - **Impact**: Blocks user identification (Phase 2)
   - **Answer Needed By**: Start of Phase 2 (Week 1, Day 3)
   - **Answer**: _____________________________________

2. **Cookie Consent Timing**
   - **Question**: Should we require cookie consent before enabling PostHog?
   - **Options**: A) Deploy now (internal team), B) Block until consent, C) Use localStorage
   - **Impact**: Affects GDPR compliance
   - **Answer Needed By**: Before production deployment
   - **Decision**: _____________________________________

3. **Session Recording Default State**
   - **Question**: Should session recording be enabled by default?
   - **Options**: A) Enabled (opt-out), B) Opt-in only, C) Internal users only, D) Wait for US-010
   - **Impact**: Privacy implications
   - **Answer Needed By**: Phase 4 (Week 2, Day 4)
   - **Decision**: _____________________________________

### Non-Critical Questions (Can Be Decided During Implementation)

4. **Feature Flags for Testing**
   - **Question**: Which feature flags should we create for initial testing?
   - **Proposed**: `new-dashboard`, `beta-features`, `maintenance-mode`
   - **Decision**: _____________________________________

5. **Production Rollout Strategy**
   - **Question**: Deploy immediately, staging first, or internal team first?
   - **Proposed**: Internal team first (Option C)
   - **Decision**: _____________________________________

6. **Session Recording Scope**
   - **Question**: Should recordings be limited to specific pages?
   - **Options**: A) All pages, B) Forms only, C) Non-sensitive pages only
   - **Decision**: _____________________________________

---

## Review Checklist

### Technical Accuracy
- [ ] Implementation follows Next.js 15.3+ best practices
- [ ] TypeScript types are comprehensive and correct
- [ ] Better Auth integration approach is valid
- [ ] Event definitions match US-002 requirements
- [ ] Performance optimizations are appropriate
- [ ] Error handling is graceful

### Architecture Alignment
- [ ] Follows project file structure conventions
- [ ] Integrates with existing providers (QueryClientProvider)
- [ ] Consistent with ADR-013 decisions
- [ ] Scalable for future analytics needs
- [ ] Maintainable by team

### Privacy & Compliance
- [ ] GDPR/CCPA requirements met
- [ ] IP anonymization configured
- [ ] Session recording respects privacy
- [ ] User opt-out mechanism included
- [ ] Cookie consent strategy defined
- [ ] Data retention policy clear

### Security
- [ ] API keys handled securely
- [ ] No PII leaked in events
- [ ] Organization-level isolation enforced
- [ ] Graceful degradation if PostHog fails
- [ ] No security vulnerabilities introduced

### Testing
- [ ] Unit test strategy comprehensive
- [ ] Integration tests cover critical paths
- [ ] E2E tests validate acceptance criteria
- [ ] Test coverage target (85%) is appropriate
- [ ] Manual testing plan clear

### Documentation
- [ ] Technical spec is clear and complete
- [ ] Event catalog template provided
- [ ] Feature flag patterns documented
- [ ] Implementation guide step-by-step
- [ ] Rollback strategy defined

### Timeline & Effort
- [ ] 2-week estimate is realistic
- [ ] 13 story points aligns with US-002
- [ ] Phase breakdown is logical
- [ ] Dependencies identified
- [ ] Buffer time for unknowns

---

## Review Decision

**Overall Assessment**: ✅ APPROVED / ❌ REJECTED / 🔄 NEEDS CHANGES

**Reviewer**: _____________________________________
**Date**: _____________________________________

### Approval Conditions (if applicable)

1. **Condition**: _____________________________________
   - **Resolution**: _____________________________________

2. **Condition**: _____________________________________
   - **Resolution**: _____________________________________

3. **Condition**: _____________________________________
   - **Resolution**: _____________________________________

### Comments

_____________________________________
_____________________________________
_____________________________________

---

## Next Steps After Approval

1. **Resolve Open Questions**: Answer 3 critical questions above
2. **Begin Implementation**: Start Phase 1 (setup)
3. **Daily Standups**: Report progress, blockers
4. **Weekly Review**: Check progress against timeline
5. **Quality Gate**: After implementation, proceed to HITL Gate #4 (if issues found)

---

## Appendix: Specification Summary

**Files to Create**: 11
- `instrumentation-client.ts`
- `lib/analytics/posthog.ts`
- `lib/analytics/posthog.server.ts`
- `lib/analytics/events.ts`
- `lib/analytics/types.ts`
- `lib/hooks/use-posthog-auth.ts`
- `lib/hooks/use-track-event.ts`
- `components/providers/posthog-provider.tsx`
- `app/_components/posthog-pageview.tsx`
- `docs/analytics/event-catalog.md`
- `docs/analytics/feature-flag-patterns.md`

**Files to Modify**: 2
- `app/layout.tsx` (minimal)
- `app/providers.tsx` (add PostHogProvider)

**Dependencies**: 2
- `posthog-js@^1.100.0` (client)
- `posthog-node@^4.0.0` (server)

**Environment Variables**: 3 (already in `.env.example`)
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `POSTHOG_PERSONAL_API_KEY`

**Custom Events**: 9 (from US-002)
- `application_created`, `application_viewed`
- `listing_created`, `listing_viewed`
- `message_sent`, `search_performed`
- `profile_completed`
- `payment_initiated`, `payment_completed`

**Estimated Effort**: 2 weeks (13 story points, ~32 hours)

**Full Specification**: [docs/technical-specs/posthog-integration-spec.md](../technical-specs/posthog-integration-spec.md)

---

**HITL Gate #3 Status**: ⏳ PENDING REVIEW

**Reviewer Instructions**:
1. Read full technical specification (56 pages)
2. Review each section above
3. Answer open questions
4. Check all approval checkboxes
5. Provide overall decision (APPROVED / REJECTED / NEEDS CHANGES)
6. Add any conditions or comments
7. Sign and date

**Timeline**: Please review within 2 business days to maintain project velocity.
