# Agent Hiring Checklist

**Last Updated**: 2025-11-16
**Status**: ACTIVE
**Philosophy**: AI First - Always create the agent before hiring human

---

## Core Principle: AI First

> **RULE**: Before hiring a human for ANY function, CREATE THE AGENT FIRST.

**Why?**
- Agents work 24/7 with low incremental cost
- Agents scale infinitely without hiring overhead
- Agents enforce consistency and best practices
- Agents free humans for strategic/creative work

**Exception**: C-level strategic decisions requiring human judgment, legal liability, or fiduciary responsibility.

---

## Agent Coverage by Business Function

| Business Function | Agent Responsible | Human Oversight Required? |
|------------------|-------------------|---------------------------|
| Product Strategy | Product Manager Agent | Yes (CEO/Founder) |
| Architecture Decisions | Architecture Agent | Yes (CTO) |
| Frontend Development | Frontend Developer Agent | Code review only |
| Backend Development | Backend Developer Agent | Code review only |
| UI/UX Design | UI Designer Agent | Design review only |
| User Research | UX Researcher Agent | Research validation |
| Quality Assurance | Quality Reviewer Agent | Critical path testing |
| Customer Support | Support Triage Agent | Escalations only |
| Content Marketing | Content Marketing Agent | Brand alignment |
| SEO & Analytics | SEO/Analytics Agent | Strategy validation |
| Financial Planning | Unit Economics Agent | CFO approval |
| Legal Compliance | Compliance Agent | Attorney review required |
| Security & Privacy | Observability Agent | CISO oversight |
| Sales & Growth | Growth Strategy Agent | VP Sales collaboration |
| Recruiting | Recruiting Coordinator Agent | Final interviews only |
| Operations | Operations Manager Agent | Strategic direction |
| Process Improvement | Operations Excellence Agent | Continuous improvement |

---

## Agent Directory

### Category 1: Product Development (7 Agents)

**Role-Based Development Agents**

1. **Product Manager Agent** (`.claude/agents/product-manager.md`)
   - User story creation with RICE scoring
   - Feature prioritization
   - Backlog management
   - HITL coordination for stories

2. **Architecture Agent** (`.claude/agents/architecture-agent.md`)
   - ADR creation and maintenance
   - System design decisions
   - Technology evaluations
   - HITL coordination for ADRs

3. **Frontend Developer Agent** (`.claude/agents/frontend-developer.md`)
   - React/Next.js component development
   - UI implementation
   - Client-side testing
   - TanStack Query integration

4. **Backend Developer Agent** (`.claude/agents/backend-developer.md`)
   - ZenStack model design
   - tRPC route implementation
   - Database schema management
   - API development

5. **UI Designer Agent** (`.claude/agents/ui-designer.md`)
   - Component specifications
   - Design system maintenance
   - Mockup creation
   - Accessibility guidelines

6. **UX Researcher Agent** (`.claude/agents/ux-researcher.md`)
   - User research planning
   - Usability testing
   - Analytics interpretation
   - User feedback analysis

7. **Quality Reviewer Agent** (`.claude/agents/quality-reviewer.md`)
   - Test plan creation
   - Bug identification
   - Quality gate enforcement
   - HITL coordination for issues

---

### Category 2: Business Operations (7 Agents)

**Operational & Strategic Agents**

8. **Support Triage Agent** (`.claude/agents/support-triage-agent.md`)
   - First-line customer support
   - FAQ maintenance (`docs/support/faq-template.md`)
   - Ticket classification
   - Escalation to humans when needed

9. **Market Analyst Agent** (`.claude/agents/market-analyst.md`)
   - Competitive intelligence gathering
   - Market trend analysis
   - Pricing research
   - Go-to-market strategy

10. **Experimentation Agent** (`.claude/agents/experimentation-agent.md`)
    - A/B test design and analysis
    - PostHog experiment management
    - Statistical significance validation
    - Experiment documentation

11. **Unit Economics Agent** (`.claude/agents/unit-economics-agent.md`)
    - Monthly financial reports (`docs/finance/unit-economics-template.md`)
    - MRR/ARR tracking
    - CAC/LTV calculations
    - Churn analysis

12. **Compliance Agent** (`.claude/agents/compliance-agent.md`)
    - Privacy policy maintenance (`docs/legal/privacy-policy-draft.md`)
    - Terms of service updates (`docs/legal/terms-of-service-draft.md`)
    - GDPR/CCPA compliance
    - Data retention enforcement

13. **Observability Agent** (`.claude/agents/observability-agent.md`)
    - Logging standards enforcement (`docs/ops/logging-standards.md`)
    - Monitoring setup (PostHog, Sentry)
    - Performance tracking
    - Incident response

14. **Operations Excellence Agent** (`.claude/agents/operations-excellence-agent.md`)
    - PR comment feedback processing
    - Retrospective analysis of session summaries
    - Documentation consistency maintenance
    - Continuous process improvement

---

### Category 3: Task-Specific Agents (3 Agents)

**Workflow Automation Agents**

15. **PR Finalization Agent** (`.claude/agents/pr-finalization-agent.md`)
    - PR workflow automation
    - Migration rollback documentation
    - Pre-merge validation
    - Deployment coordination

16. **GitHub Integration Agent** (`.claude/agents/github-integration-agent.md`)
    - Issue/PR synchronization
    - Label management
    - Milestone tracking
    - Automated status updates

17. **Session Summary Agent** (`.claude/agents/session-summary-agent.md`)
    - Session documentation generation
    - Work summary creation
    - Progress tracking
    - Retrospective material preparation

---

## Agent Hiring Process

### Before Hiring a Human Employee

**Step 1**: Review agent coverage table above
**Step 2**: Identify if an agent already exists for this function
**Step 3**: If agent exists → Enable and configure agent
**Step 4**: If agent doesn't exist → Create agent first
**Step 5**: Run agent for 2-4 weeks to assess capabilities
**Step 6**: Only hire human if agent truly cannot fulfill role

### Creating a New Agent

**Template**: `.claude/agents/template.md`
**Location**: `.claude/agents/[function]-agent.md`
**Required Sections**:
- Role & Responsibilities
- Scope & Boundaries
- Tools & Resources
- Collaboration Points
- HITL Coordination
- Success Metrics

**Documentation**: Update `.claude/agents/README.md` with new agent

---

## Agent Performance Metrics

Track agent effectiveness:

| Metric | Target | Review Frequency |
|--------|--------|------------------|
| Tasks completed without human intervention | >80% | Weekly |
| Time saved vs human equivalent | >50% | Monthly |
| Quality (bugs/errors introduced) | <5% | Per task |
| Human satisfaction with agent output | >4/5 | After each HITL |
| Cost savings vs human salary | Calculate monthly | Monthly |

---

## When to Hire Humans

**Situations where humans are still needed**:

1. **Strategic Leadership**: CEO, CTO, CPO making company-direction decisions
2. **Legal Liability**: Attorney review of legal documents
3. **Financial Oversight**: CFO approval of major financial decisions
4. **Creative Direction**: Brand identity, creative campaigns requiring taste
5. **Complex Negotiations**: Sales deals, partnerships, fundraising
6. **Crisis Management**: Major incidents requiring executive judgment
7. **People Management**: Managing human employees, culture building

**Hiring Priority** (after exhausting agent capabilities):
1. CEO/Founder (strategic vision)
2. CTO (technical leadership + agent orchestration)
3. Designer (brand identity + creative direction)
4. Sales/BD (revenue generation)
5. Operations Manager (agent coordination)

---

## Agent Orchestration

**Coordination Hub**: `.claude/agents/README.md`
**Communication**: Agents coordinate via HITL files in `docs/hitl/`
**Conflict Resolution**: Architecture Agent arbitrates technical disputes

**Multi-Agent Workflows**:
- PM Agent creates stories → Frontend + Backend agents implement → QA Agent reviews
- Growth Agent proposes experiment → PM Agent creates stories → Dev agents implement
- Support Agent identifies common issues → Content Agent creates documentation

---

## References

- Agent templates: `.claude/agents/`
- Agent coordination: `.claude/agents/README.md`
- HITL process: `docs/HITL_GUIDE.md`
- Workflow guide: `docs/WORKFLOW_GUIDE.md`

---

**Remember**: Agents are force multipliers. Always build the agent first, then augment with human expertise only where absolutely necessary.
