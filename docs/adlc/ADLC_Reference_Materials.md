# ADLC Reference Materials

**Agentic Development Life Cycle (ADLC)** - Resources, inspiration, best practices, and anti-patterns for building software with AI agents.

**Last Updated**: 2025-11-16

---

## Table of Contents

- [Official Claude Code Documentation](#official-claude-code-documentation)
- [Anthropic Engineering & Research](#anthropic-engineering--research)
- [Skills Development](#skills-development)
- [Plugins & Integrations](#plugins--integrations)
- [Agent Architecture](#agent-architecture)
- [MCP (Model Context Protocol)](#mcp-model-context-protocol)
- [Best Practices](#best-practices)
- [Community Resources](#community-resources)
- [Thought Leadership](#thought-leadership)
- [Anti-Patterns](#anti-patterns)

---

## Official Claude Code Documentation

### Core Documentation

**[Claude Code on the Web](https://code.claude.com/docs/en/claude-code-on-the-web)**

- Web-based Claude Code environment setup
- Remote container configuration
- Environment variables and authentication

**[GitHub Actions Integration](https://code.claude.com/docs/en/github-actions)**

- CI/CD workflows with Claude Code
- Automated testing and deployment
- PR automation and review workflows

**[Plugins Guide](https://code.claude.com/docs/en/plugins)**

- Plugin architecture and development
- Custom plugin creation
- Plugin lifecycle management

**[Sub-Agents](https://code.claude.com/docs/en/sub-agents)**

- Specialized agent coordination
- Multi-agent workflows
- Agent communication patterns

**[Hooks Guide](https://code.claude.com/docs/en/hooks-guide)**

- Guard rails and safety mechanisms
- Prevent infinite loops and failure cycles
- Detect stalled or excessive-duration tasks
- Pre/post tool execution hooks

**[MCP Documentation](https://code.claude.com/docs/en/mcp)**

- Model Context Protocol overview
- MCP server setup and configuration
- Tool availability and usage

---

## Anthropic Engineering & Research

**[Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)**

- Official engineering recommendations
- Performance optimization
- Code quality and maintainability

**[Equipping Agents for the Real World with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)**

- Real-world agent deployment strategies
- Skill-based agent architecture
- Production considerations

**[GitHub: claude-code-action](https://github.com/anthropics/claude-code-action)**

- GitHub Actions integration
- Workflow automation examples
- CI/CD best practices

---

## Skills Development

### Official Resources

**[Agent Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)**

- Best practices for building skills
- Skill structure and organization
- Reusability across agents

**[Tool Use Overview](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)**

- Tool calling patterns
- Error handling
- Tool composition

**[Agent SDK Overview](https://docs.claude.com/en/docs/agent-sdk/overview)**

- SDK usage and examples
- Agent lifecycle management
- Advanced patterns

### Community Skills

**[Anthropic Official Skills Repository](https://github.com/anthropics/skills)**

- Curated official skills
- Reference implementations
- Production-ready examples

**[BehiSecc/awesome-claude-skills](https://github.com/BehiSecc/awesome-claude-skills)**

- Community-contributed skills
- Use case examples
- Skill templates

**[travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)**

- Additional community skills
- Alternative implementations
- Specialized domains

---

## Plugins & Integrations

**[PostHog Claude Code Share Plugin](https://github.com/PostHog/claude-code-share-plugin)**

- Session sharing and collaboration
- Feedback loop creation
- Knowledge distribution across developer community
- Reduces friction points with LLMs

**[Claude Cookbooks](https://github.com/anthropics/claude-cookbooks)**

- Implementation recipes
- Integration patterns
- Common use cases

---

## Agent Architecture

### Design Principles

**Key Principle: Skills > Agents**

- Prefer building reusable skills over creating new agents
- Skills can be shared across multiple agents (DRY principle)
- Reduces duplication and maintenance burden
- Enables composition and modularity

**Key Principle: CLI Tools > MCP Servers**

- Prefer command-line tools and CLIs when possible
- MCP servers add complexity and deployment overhead
- CLI tools are more portable and easier to debug
- Use MCP when native tool integration is unavailable

### Sub-Agent Patterns

See `.claude/agents/` for implemented patterns:

- Product development agents (architecture, frontend, backend, QA)
- Business operations agents (market analysis, experimentation, compliance)
- Task-specific agents (PR workflows, session summaries)

---

## MCP (Model Context Protocol)

**[Model Context Protocol Documentation](https://modelcontextprotocol.io/docs/getting-started/intro)**

- Protocol specification
- Server implementation guide
- Client integration

**[MCP Server Directory](https://mcp.so/)**

- Available MCP servers
- Server capabilities
- Installation guides

**Note**: While MCP provides powerful integration capabilities, prefer CLI tools and skills when possible for simplicity and portability. Use MCP when:

- Native tool integration is impossible
- Real-time bidirectional communication is required
- Advanced context management is needed

---

## Best Practices

### Development Workflow

1. **Research First**: Search codebase and web before implementing
2. **Validation Always**: Run type checkers, linters, tests before considering work complete
3. **Skills Over Agents**: Build reusable skills, not duplicate agent code
4. **CLI Over MCP**: Use command-line tools for simplicity and portability
5. **HITL Gates**: Human approval at key checkpoints (see `docs/HITL_GUIDE.md`)

### Tool Development

**From Agent Skills Best Practices**:

- Make skills atomic and focused
- Provide clear documentation
- Include usage examples
- Handle errors gracefully
- Support both interactive and programmatic use

**From Tool Use Overview**:

- Design tools for composition
- Provide structured outputs
- Use consistent naming conventions
- Document expected inputs/outputs
- Include error codes and messages

### Guard Rails (from Hooks Guide)

**Prevent Failure Loops**:

- Detect repeated tool failures
- Abort after N consecutive errors
- Require human intervention for stuck states

**Detect Stalls**:

- Monitor task duration
- Set reasonable timeouts
- Alert when progress stalls

**Avoid Infinite Loops**:

- Track repetitive actions
- Break cycles automatically
- Require user confirmation for long-running tasks

---

## Community Resources

**[Awesome Claude AI](https://awesomeclaude.ai/)**

- Curated list of Claude resources
- Tools, integrations, examples
- Community projects

**[Awesome Cursor Rules](https://github.com/PatrickJS/awesome-cursorrules)**

- Cursor editor rules and configs
- AI coding assistant patterns
- IDE integration examples

**[Cursor Directory](https://cursor.directory/)**

- Shared Cursor configurations
- Team coding standards
- Best practice collections

---

## Thought Leadership

**[APDLC: Rethinking Innovation in an Agentic World](https://www.linkedin.com/pulse/apdlc-rethinking-innovation-agentic-world-matthew-mengerink-kchkc/)**

- Agentic Product Development Life Cycle (APDLC)
- Paradigm shift from traditional SDLC
- Innovation and collaboration in AI-native development
- Human-agent partnership models

**Key Concepts from APDLC Article**:

- Shift from "human-directed" to "human-guided" development
- Agents as first-class team members, not tools
- Emphasis on architectural guardrails over prescriptive rules
- Continuous learning and feedback loops
- Business value over technical perfection

---

## Anti-Patterns

### ❌ What NOT to Do

**Over-Engineering with MCP**:

- Don't use MCP when a simple CLI tool would work
- Don't create MCP servers for one-time tasks
- Don't add MCP complexity without clear benefit

**Agent Proliferation**:

- Don't create a new agent for every small task
- Don't duplicate logic across agents (use shared skills)
- Don't bypass skill reusability for convenience

**Hallucination Risks**:

- ❌ Don't assume APIs exist without verification
- ❌ Don't implement features without searching for existing solutions
- ❌ Don't skip validation (linting, type checking, testing)
- ❌ Don't ignore login-gated documentation (create HITL request)

**Workflow Anti-Patterns**:

- ❌ Don't skip HITL gates for "small changes"
- ❌ Don't batch multiple changes without review
- ❌ Don't implement without ADR for architectural decisions
- ❌ Don't ignore hooks warnings about loops or stalls

**Testing Anti-Patterns**:

- ❌ Don't assume code works without running it
- ❌ Don't skip edge case testing
- ❌ Don't ignore TypeScript errors as "minor issues"
- ❌ Don't merge PRs without CI passing

### ✅ Instead, Do This

- Use CLI tools wrapped in skills for portability
- Create reusable skills, invoke from multiple agents
- Search codebase and official docs before implementing
- Create HITL requests when blocked or uncertain
- Run full validation suite before marking tasks complete
- Document significant decisions in ADRs
- Respect hook guardrails (they prevent costly mistakes)

---

## Research Notes

### Our Position on Key Debates

**Skills vs Agents**:

- **We believe**: Skills should be the primary unit of reusability
- Agents compose skills to accomplish complex workflows
- Single Responsibility Principle: agents coordinate, skills execute

**CLI Tools vs MCP Servers**:

- **We believe**: CLI tools are simpler, more portable, and easier to debug
- Use MCP only when CLI tools can't solve the problem
- Prefer standard Unix tools and conventions

**Frequentist vs Bayesian A/B Testing**:

- **We believe**: Bayesian methods are superior for product experimentation
- Clearer interpretation (probabilities, not p-values)
- Sequential testing allows continuous monitoring
- Quantifies risk via expected loss
- See `.claude/agents/experimentation-agent.md` for full rationale

**Governance as Code**:

- **We believe**: ZenStack access policies are better than manual reviews
- Encode rules in code, not documentation
- Audit trails are mandatory, not optional
- See `docs/PHILOSOPHY.md` for governance framework

---

## Contributing to This Document

When adding new resources:

1. **Categorize appropriately** - Use existing sections or propose new ones
2. **Add context** - Don't just list URLs, explain why it's relevant
3. **Date significant updates** - Track when major sections change
4. **Cross-reference** - Link to related project documentation (ADRs, guides)
5. **Mark deprecated resources** - Strike through ~~obsolete links~~ with explanation

**Template for New Entries**:

```markdown
**[Resource Title](URL)**

- Brief description of what this resource covers
- Why it's relevant to ADLC
- How it influences our approach (optional)
```

---

## Version History

| Date       | Change                               | Author |
| ---------- | ------------------------------------ | ------ |
| 2025-11-16 | Initial creation with core resources | System |
