# ADR-004: Use React Email with Resend for Transactional Emails

**Status:** APPROVED
**Date:** 2025-11-16
**Author:** AI Agent

---

## Context

**What is the issue or problem we're solving?**

We need to send transactional emails for user workflows including welcome messages, password resets, notifications, and organization invitations. These emails must be reliable, branded, and maintainable by developers using our existing tech stack (React/TypeScript).

**Background**:
- Better Auth requires email delivery for authentication flows
- Current approach: No email service configured
- Emails must be responsive, accessible, and render correctly across clients
- Team is already proficient in React and TypeScript
- Need to maintain email templates in version control

**Requirements**:
- **Functional**: Send transactional emails (auth, notifications, alerts)
- **Functional**: Responsive templates that work across email clients
- **Functional**: Support dynamic content (user names, links, data)
- **Non-functional**: 99.9% delivery rate for critical emails
- **Non-functional**: Developer-friendly authoring (type-safe, component-based)
- **Non-functional**: Cost-effective ($0-20/month for MVP volume)
- **Constraints**: Integrate with Better Auth email flows
- **Constraints**: Must work with Vercel serverless functions

**Scope**:
- **Included**: Transactional emails (auth, notifications, invitations)
- **Included**: Email template versioning and preview
- **Not included**: Marketing emails/newsletters (use dedicated platform later)
- **Not included**: Email analytics beyond delivery status

---

## Decision

**We will use React Email for templating and Resend for email delivery.**

React Email allows us to build email templates as React components with TypeScript, while Resend provides reliable delivery with a developer-friendly API. This combination leverages our team's existing React expertise and provides excellent DX.

**Implementation Approach**:
- Create `emails/` directory with React Email templates
- Install `react-email` and `resend` packages
- Build email components using React Email primitives
- Preview emails locally via `pnpm email:dev` script
- Send emails via Resend API from tRPC routes and Better Auth
- Version control all templates as `.tsx` files
- Configure Better Auth to use Resend for auth emails

**Why This Approach**:
1. **Type-Safe**: TypeScript support for email props and data
2. **Component Reuse**: Share headers, footers, buttons across emails
3. **Developer Friendly**: Write emails in React, preview in browser
4. **Version Control**: Templates are code, tracked in Git
5. **Reliable Delivery**: Resend built on AWS SES with 99.9% uptime

**Example/Proof of Concept**:
```typescript
// emails/welcome.tsx
import { Html, Button, Container, Text } from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  verifyUrl: string;
}

export const WelcomeEmail = ({ userName, verifyUrl }: WelcomeEmailProps) => (
  <Html>
    <Container>
      <Text>Welcome {userName}!</Text>
      <Button href={verifyUrl}>Verify your email</Button>
    </Container>
  </Html>
);

// server/lib/email.ts
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (to: string, props: WelcomeEmailProps) => {
  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to,
    subject: 'Welcome to Our App!',
    react: WelcomeEmail(props),
  });
};
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences
- **Developer Experience**: Emails written in familiar React syntax
- **Type Safety**: Props validated at compile time, fewer runtime errors
- **Preview & Testing**: See emails in browser before sending
- **Reusability**: Components shared across email templates
- **Version Control**: Email templates tracked in Git with code review
- **Fast Onboarding**: No new templating language to learn

### Negative Consequences
- **Email Client Limitations**: React features must map to HTML email constraints
- **Build Step Required**: Templates must be compiled before sending
- **React Dependency**: Email templates coupled to React ecosystem
- **Cost at Scale**: Resend pricing increases with volume (though competitive)

### Neutral Consequences
- **Email Testing**: Need to test across email clients (Litmus/Email on Acid)
- **Learning Curve**: Team must learn React Email's specific components

### Mitigation Strategies
- **Email Client Limitations**: React Email handles compatibility automatically, test with major clients
- **Build Step Required**: Templates build with main app, no separate deployment
- **React Dependency**: Templates are simple TSX, easy to migrate if needed
- **Cost at Scale**: Resend offers 100k emails/month free, then $0.001/email (competitive pricing)

---

## Alternatives Considered

### Alternative 1: Handlebars Templates with SendGrid

**Description**:
Use Handlebars string templates with SendGrid for email delivery.

**Pros**:
- Industry standard approach
- SendGrid has robust infrastructure
- Handlebars syntax is simple and well-documented
- No build step for templates

**Cons**:
- No type safety for template variables
- String-based templates prone to errors
- SendGrid more expensive ($15/month minimum)
- Less developer-friendly than React components
- Harder to share components across templates

**Why Not Chosen**:
Handlebars lacks type safety and requires learning a new templating syntax. SendGrid's pricing is higher than Resend for our expected volume.

---

### Alternative 2: Postmark with Mustache Templates

**Description**:
Use Postmark's email delivery service with Mustache or HTML templates.

**Pros**:
- Excellent deliverability reputation
- Good documentation and support
- Competitive pricing ($15/month for 10k emails)
- Built-in template editor in dashboard

**Cons**:
- Mustache templates not type-safe
- No React component reuse
- Template editing in web UI (not version controlled)
- Similar cost to Resend without developer benefits

**Why Not Chosen**:
While Postmark has great deliverability, it doesn't offer the developer experience benefits of React Email. Resend provides comparable delivery with better DX.

---

### Alternative 3: MJML with NodeMailer

**Description**:
Build emails with MJML (responsive email framework) and send via NodeMailer + SMTP.

**Pros**:
- MJML creates responsive emails automatically
- Full control over SMTP configuration
- Lower cost (use existing SMTP or AWS SES)
- XML-based syntax designed for emails

**Cons**:
- Another language to learn (MJML XML syntax)
- No type safety for dynamic content
- Need to manage SMTP infrastructure or AWS SES
- NodeMailer requires connection management in serverless
- More complex setup and maintenance

**Why Not Chosen**:
MJML adds complexity without the type safety and DX benefits of React Email. Managing SMTP in serverless is problematic, and Resend's pricing is competitive with AWS SES when considering infrastructure overhead.

---

### Alternative 4: Better Auth Default (No Custom Templates)

**Description**:
Use Better Auth's built-in email templates without customization.

**Pros**:
- Zero setup required
- Works out of the box with Better Auth
- No additional dependencies
- Immediate functionality

**Cons**:
- Generic templates (not branded)
- Limited customization options
- Can't add custom transactional emails
- Poor user experience (generic look and feel)

**Why Not Chosen**:
Generic templates hurt brand perception and user trust. Custom emails are essential for professional product experience.

---

## Related

**Related ADRs**:
- [ADR-001: Technology Stack Selection] - React/TypeScript ecosystem
- [Better Auth integration] - Auth email flows

**Related Documentation**:
- [docs/email/templates.md] - Email template guide (to be created)
- [docs/email/testing.md] - Email testing strategy (to be created)

**External References**:
- [React Email Documentation](https://react.email/)
- [Resend Documentation](https://resend.com/docs)
- [Email Client Compatibility](https://www.caniemail.com/)
- [Better Auth Email Configuration](https://better-auth.com/docs/email)

---

## Notes

**Decision Making Process**:
- Evaluated developer experience vs deliverability trade-offs
- Compared pricing for 10k emails/month (expected MVP volume)
- Tested React Email preview functionality
- Consulted Resend case studies and delivery stats
- Decision date: 2025-11-16

**Review Schedule**:
- Revisit after 6 months to evaluate deliverability metrics
- Re-evaluate if email volume exceeds 100k/month (cost implications)
- Monitor: Delivery rate, bounce rate, monthly cost

**Migration Plan**:
- **Phase 1 (Day 1)**: Set up Resend account, verify domain
- **Phase 2 (Day 2)**: Install packages, create email directory structure
- **Phase 3 (Day 3-4)**: Build core templates (welcome, password reset, verification)
- **Phase 4 (Day 5)**: Integrate with Better Auth email hooks
- **Phase 5 (Week 2)**: Add notification templates as features require
- **Rollback**: Can switch to any SMTP provider, templates export to HTML

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-16 | AI Agent | Initial draft and approval |
