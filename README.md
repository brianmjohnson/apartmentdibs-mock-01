# ApartmentDibs

> **Tagline**: Compliance-first rental marketplace with true PII anonymization and portable tenant screening

**Status**: =� In Development
**Version**: 0.1.0
**Last Updated**: 2025-11-20

---

## Executive Summary

ApartmentDibs is a compliance-first rental marketplace that connects landlords and renters through an automated, bias-free application platform. We solve the critical problem that **none of the major rental platforms offer true PII anonymization before landlord review**, while addressing the **$276 million annual "excess burden"** in application fees that tenants currently pay.

**Key Highlights**:

- = **True PII Anonymization**: First platform to scrub personally identifiable information before landlord review
- � **Automated Fair Housing Compliance**: Built-in protection against discrimination lawsuits ($5K-$2.1M settlements)
- =� **Portable Tenant Screening Reports (PTSR)**: Genuine cross-platform portability saving tenants $276M annually
- =� **Data-Driven Operations**: PostHog-powered analytics for product decisions and experimentation

**Market Opportunity**: $405-$675 million annual screening market with 32,321 fair housing complaints filed in 2024 (20-year high).

---

## Problem Statement

### The Challenge

The rental application process is broken:

- **No major platform offers true PII anonymization** before landlord review
- **Fair housing complaints at 20-year high** (32,321 in 2024)
- **Tenants pay $276M annually in excess screening fees** beyond actual costs
- **No genuine PTSR portability** exists despite 7 states enacting laws

### Current Solutions & Their Limitations

1. **RentSpree**: Best in class but still no true PII scrubbing before review
2. **Avail**: Basic SSN hiding only, no automated compliance
3. **TurboTenant**: Tenants pay directly, only simple PII blanking
4. **Apartments.com, Zillow, Realtor.com**: Zero PII anonymization, referral-only models

### Market Opportunity

- **TAM**: 45-46 million U.S. rental units
- **Market Size**: $405-$675 million annual screening market
- **Growth Driver**: Fair housing penalties ($25K-$105K per violation)
- **Regulatory Momentum**: AB 2493 (California), PTSR laws in 7 states, CCPA/GDPR enforcement

---

## Solution Overview

### Our Approach

ApartmentDibs uniquely combines:

1. **True PII Anonymization**: Remove all personally identifiable information before landlord review
2. **Genuine PTSR Portability**: Cross-platform compatibility with standardized format
3. **Automated Compliance**: Fair Housing Act, AB 2493, CCPA/GDPR protection
4. **Transparent Pricing**: Eliminate excess fees and hidden costs
5. **Data-Driven Product**: PostHog analytics and experimentation for continuous improvement

### Key Features

#### 1. PII Anonymization Engine

**Value**: Eliminates bias by removing names, photos, and protected class information before landlord review
**How it Works**: Automated redaction + compliance verification before application forwarding
**Differentiation**: First platform with true PII scrubbing (not just SSN hiding)

#### 2. Portable Tenant Screening Reports

**Value**: Tenants order once, share unlimited times (saves $276M annually)
**How it Works**: Standardized format accepted across platforms with blockchain verification
**Differentiation**: Genuine cross-platform portability (competitors are platform-locked)

#### 3. Automated Fair Housing Compliance

**Value**: Protects landlords from $5K-$2.1M discrimination lawsuits
**How it Works**: AI-powered screening for discriminatory language + automated documentation
**Differentiation**: Proactive prevention vs. reactive education

#### 4. Analytics & Experimentation Platform

**Value**: Data-driven product decisions, feature flags, and A/B testing
**How it Works**: PostHog integration for event tracking, user segmentation, and session recording
**Differentiation**: Product analytics and experimentation built into the platform from day one

---

## Target Market & Users

### Primary Personas

#### Persona 1: Risk-Averse Landlord (Individual Owner)

- **Demographics**: 40-60 years old, owns 1-5 rental properties, urban/suburban markets
- **Goals**: Fill vacancy quickly while minimizing legal risk and compliance burden
- **Pain Points**: Fair housing lawsuit fear, keeping up with changing regulations, screening costs
- **How We Help**: Automated compliance, true bias elimination, transparent pricing
- **Success Metrics**: Days to fill, zero discrimination complaints, reduced screening costs

#### Persona 2: Budget-Conscious Tenant

- **Demographics**: 25-40 years old, moving for work/life changes, applying to multiple units
- **Pain Points**: Paying $30-$50 per application across 5-10 applications ($150-$500 total)
- **How We Help**: One-time PTSR purchase ($30-50) shareable unlimited times
- **Success Metrics**: Money saved on applications, faster approval times, transparency

#### Persona 3: Compliance-Focused Property Manager

- **Demographics**: Professional PM firms managing 50-500+ units
- **Goals**: Scale operations while maintaining perfect compliance record
- **Pain Points**: Manual compliance verification, high-volume applicant screening, legal liability
- **How We Help**: Automated compliance workflows, API integrations, audit trails
- **Success Metrics**: Time saved per application, zero violations, scalability

### Market Segments

1. **Primary: NYC Metro** - 43-day average fill time, highly regulated, dozens of major PM firms
2. **Secondary: SF Bay Area** - 20-day average fill (fastest nationally), tech-savvy users
3. **Tertiary: Greater LA** - Large rental market, strong regulatory environment (AB 2493)
4. **Long-tail: Bedroom Communities** - Single landlords needing pricing help and legal protection

---

## Technical Overview

### Tech Stack

**Full-Stack Framework**:

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.9+
- **Backend**: tRPC v11, ZenStack 2.19+ (access control), Prisma 6+
- **Database**: PostgreSQL (Neon) with automatic branching
- **Styling**: Tailwind CSS 4.0, shadcn/ui components

**Infrastructure & Services**:

- **Auth**: Better Auth 1.3+ (OAuth + Organizations)
- **Hosting**: Vercel (serverless edge functions)
- **Storage**: Vercel Blob (document storage)
- **Analytics**: PostHog (product analytics, feature flags, A/B testing)

**Developer Tools**:

- **Query Management**: TanStack Query v5 (auto-generated hooks)
- **Testing**: Jest (unit), Playwright (E2E)
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

### Analytics & Experimentation

**Platform**: PostHog (open-source product analytics)

**Capabilities**:

- **Event Tracking**: Page views, user interactions, conversion funnels
- **Feature Flags**: Gradual rollouts, user segmentation, kill switches
- **A/B Testing**: Experiments with statistical significance testing
- **Session Recording**: User session replay for debugging and UX analysis
- **User Identification**: Linked to Better Auth with organization context
- **Dashboards**: Custom analytics for product, engineering, and business teams

**Integration Points**:

- User identification on authentication (Better Auth)
- Organization-level tracking for multi-tenant analytics
- Custom event tracking for key user actions (applications, listings, messages)
- Automated pageview and pageleave tracking

### Architecture Principles

1. **Type Safety**: Full-stack TypeScript with strict mode
2. **Generated Code**: ZenStack models � Prisma schema � tRPC routers � React hooks
3. **Access Control**: Schema-level policies with row-level security
4. **Scalability**: Serverless architecture with edge functions
5. **Developer Experience**: Hot reload, type-safe APIs, automated code generation
6. **Data-Driven**: PostHog integration for analytics and experimentation
7. **Agentic Development**: AI agents for planning, development, and QA

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

---

## Getting Started

### For Developers

```bash
# Clone and install
git clone https://github.com/apartmentdibs/apartmentdibs-mock-01.git
cd apartmentdibs-mock-01
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your values (database, auth, PostHog keys)

# Generate Prisma + tRPC + React hooks
pnpm gen:check

# Start development server
pnpm dev
```

See [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) for complete setup instructions.

### For Contributors

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Check [docs/user-stories.md](docs/user-stories.md) for available work
3. Follow [docs/WORKFLOW_GUIDE.md](docs/WORKFLOW_GUIDE.md) for development process
4. Review [docs/HITL_GUIDE.md](docs/HITL_GUIDE.md) for Human-in-the-Loop workflow

---

## Documentation

- **Setup**: [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
- **Workflow**: [docs/WORKFLOW_GUIDE.md](docs/WORKFLOW_GUIDE.md)
- **HITL Process**: [docs/HITL_GUIDE.md](docs/HITL_GUIDE.md)
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) _(coming soon)_
- **User Stories**: [docs/user-stories.md](docs/user-stories.md) _(coming soon)_
- **ADRs**: [docs/adr/](docs/adr/)
- **Business Plan**: [docs/Business_Plan_and_GTM.md](docs/Business_Plan_and_GTM.md)
- **Agent Guide**: [.claude/agents/README.md](.claude/agents/README.md)

---

## Project Philosophy

**Core Principle**: **Agentic First** - Hire Agents First, Then People

All development follows an autonomous agent-driven approach with human governance through HITL gates. We have 19+ specialized AI agents handling:

- **Product Development**: architecture, frontend, backend, UI/UX, QA
- **Business Operations**: market analysis, experimentation, data engineering, compliance
- **Task Automation**: PR workflows, GitHub integration, session summaries

See [docs/PHILOSOPHY.md](docs/PHILOSOPHY.md) and [docs/AGENT_HIRING_CHECKLIST.md](docs/AGENT_HIRING_CHECKLIST.md) for complete details.

---

## Links

- **Production**: _Coming soon_
- **Staging**: _Coming soon_
- **PostHog Analytics**: _Project dashboard (team access)_
- **GitHub**: [apartmentdibs-mock-01](https://github.com/apartmentdibs/apartmentdibs-mock-01)

---

## License

_To be determined_

---

## Contact

- **Project Lead**: [Brian Johnson]
- **GitHub**: [github.com/apartmentdibs](https://github.com/apartmentdibs)

---

**Last Updated**: 2025-11-20
**Next Review**: 2026-02-20 (quarterly review recommended)
