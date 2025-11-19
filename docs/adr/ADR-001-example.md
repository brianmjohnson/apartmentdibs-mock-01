# ADR-001: Use Better Auth for Authentication

**Status:** APPROVED
**Date:** 2025-01-15
**Author:** Architecture Agent <noreply@anthropic.com>

---

## Context

We need a complete authentication solution for our Next.js application that supports:

- Email/password authentication (MVP requirement)
- OAuth providers (Google, GitHub - future)
- Session management
- Email verification
- Password reset functionality

**Requirements**:

- TypeScript support (full-stack type safety)
- Next.js App Router compatibility
- Easy OAuth integration
- Secure session handling
- Developer-friendly API
- Active maintenance

**Constraints**:

- Budget: Prefer open-source or affordable
- Timeline: Need to implement quickly (1-2 weeks)
- Team: Familiar with TypeScript, minimal auth experience

---

## Decision

**We will use Better Auth (v1.3.27+) as our authentication solution.**

Better Auth is a modern, TypeScript-first authentication library specifically designed for Next.js applications with excellent DX and comprehensive features.

**Implementation Approach**:

1. Install Better Auth with email/password plugin
2. Configure with Prisma adapter (integrates with ZenStack)
3. Set up auth routes using Better Auth's Next.js helpers
4. Add OAuth providers as needed (post-MVP)

**Why Better Auth**:

1. **TypeScript-First**: Excellent type inference, no manual typing needed
2. **Next.js Native**: Built specifically for Next.js App Router
3. **Simple API**: Minimal boilerplate, intuitive hooks
4. **Prisma Integration**: Works seamlessly with our database setup
5. **Modern**: Active development, modern patterns
6. **Flexible**: Easy to extend with plugins

---

## Consequences

### Positive

- **Rapid Development**: Can implement auth in 2-3 days vs weeks with custom solution
- **Type Safety**: Full TypeScript support catches bugs at compile time
- **Less Code**: Built-in session management, no need to build from scratch
- **Security**: Battle-tested auth patterns, less risk of vulnerabilities
- **Future-Proof**: Easy to add OAuth, 2FA, magic links later
- **Good DX**: Developers will enjoy working with clean API

### Negative

- **Newer Library**: Less mature than NextAuth.js (fewer examples, smaller community)
- **Learning Curve**: Team needs to learn Better Auth patterns (minimal, ~1 day)
- **Dependency**: Relying on external library (but saves massive development time)

### Neutral

- **Different from Previous Projects**: Team used NextAuth before (but Better Auth is simpler)
- **Documentation**: Good but less extensive than NextAuth

### Mitigation Strategies

**For newness concern**:

- Library is actively maintained with weekly releases
- Good community support on Discord
- We can contribute docs/examples as we learn

**For learning curve**:

- Comprehensive getting started guide
- Similar patterns to other auth libraries
- Better Auth is simpler than alternatives

---

## Alternatives Considered

### Alternative 1: NextAuth.js

**Description**: Popular auth library for Next.js, industry standard

**Pros**:

- Large community, many examples
- Extensive OAuth provider support
- Mature, battle-tested
- Lots of documentation

**Cons**:

- More boilerplate code required
- TypeScript support is good but not great
- Complexity for simple use cases
- Transitioning to Auth.js (unclear future)
- Heavier bundle size

**Why Not Chosen**:
Better Auth provides better DX with similar functionality. For our needs (email + eventual OAuth), Better Auth is simpler and more type-safe.

---

### Alternative 2: Clerk

**Description**: Managed authentication service

**Pros**:

- Fully managed (no server code needed)
- Beautiful pre-built UI components
- Very quick to implement
- Comprehensive features (2FA, organizations, etc.)

**Cons**:

- **Expensive**: $25/month + $0.02/MAU (costly at scale)
- Vendor lock-in
- Less customization
- External dependency for critical functionality

**Why Not Chosen**:
Cost is prohibitive for MVP. We prefer open-source solution we control. May reconsider for enterprise features later.

---

### Alternative 3: Custom Auth with Passport.js

**Description**: Build custom auth solution using Passport.js

**Pros**:

- Full control over implementation
- No external auth dependencies
- Can customize everything
- Passport is well-known

**Cons**:

- **Time**: 2-4 weeks to build properly
- **Risk**: Easy to make security mistakes
- **Maintenance**: Ongoing burden
- Not Next.js-specific
- Still depends on Passport library

**Why Not Chosen**:
"Don't roll your own auth" is wise advice. Building custom auth takes significant time and introduces security risks. Better Auth gives us 90% control with 10% effort.

---

## Related

**Related ADRs**:

- Will inform ADR-002 (Session Storage Strategy)
- Will inform ADR-005 (OAuth Provider Configuration)

**Related Documentation**:

- `docs/user-stories/US-001.md` - User Authentication story
- `docs/user-stories/US-002.md` - User Login story
- Better Auth docs: https://better-auth.com

**External References**:

- Better Auth GitHub: https://github.com/better-auth/better-auth
- Better Auth Discord: [community link]
- Comparison article: https://...

---

## Notes

**Decision Making Process**:

- Researched 5 options: Better Auth, NextAuth, Clerk, Auth0, custom
- Tested Better Auth in spike (2 hours)
- Consulted with team on DX preferences
- Decision made: 2025-01-15

**Review Schedule**:

- Review after MVP launch (3 months)
- Check community growth, issue resolution
- Evaluate if we made the right choice

**Migration Plan** (if needed in future):
Better Auth uses standard session/user models, so migration to another solution (if needed) is straightforward. Our access control is in ZenStack models, not auth layer, so we're not locked in.

---

## Revision History

| Date       | Author             | Change                     |
| ---------- | ------------------ | -------------------------- |
| 2025-01-15 | Architecture Agent | Initial draft              |
| 2025-01-15 | Human              | Status changed to APPROVED |
| 2025-01-17 | Backend Developer  | Added implementation notes |
