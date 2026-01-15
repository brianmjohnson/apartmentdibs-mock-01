# Reference Document Template

**Purpose**: This template defines the standard format for saving external documentation references locally. When an agent needs to fetch external documentation, it should save the relevant content here using this template, so subsequent agents can reference it without repeated web fetches.

---

## Document Metadata

| Field               | Value                                         |
| ------------------- | --------------------------------------------- |
| **Document Name**   | [Descriptive name of the reference]           |
| **Source URL**      | [Full URL to the original documentation]      |
| **Date Fetched**    | [YYYY-MM-DD]                                  |
| **Fetched By**      | [Agent name or role]                          |
| **Last Updated**    | [YYYY-MM-DD]                                  |
| **Version/Release** | [If applicable, version of the documentation] |

---

## Related Project Documentation

### ADRs (Architecture Decision Records)

- [ADR-XXX](../adr/ADR-XXX-name.md) - Brief description of relationship

### User Stories

- [US-XXX](../user-stories/story-name.md) - Brief description of relationship

### Technical Specifications

- [Spec Name](../technical-specs/spec-name.md) - Brief description of relationship

### Agents

- [Agent Name](../../.claude/agents/agent-name.md) - Brief description of how this agent uses this reference

### Skills

- [Skill Name](../../.claude/skills/skill-name/) - Brief description of how this skill uses this reference

### Other References

- [Reference Name](./other-reference.md) - Brief description of relationship

---

## Use Cases

List specific use cases within this project where this documentation is referenced:

1. **Use Case 1**: Description of when/why this documentation is needed
   - Context: What feature or functionality requires this?
   - Workflow: Which agent workflow or development phase uses this?

2. **Use Case 2**: Description of additional use cases
   - Context: ...
   - Workflow: ...

---

## Summary

Provide a concise (3-5 paragraph) executive summary of the documentation:

- What problem does this documentation solve?
- What are the key concepts or features covered?
- What are the main configuration options or implementation patterns?
- Any important warnings or gotchas?
- Links to related official documentation?

---

## Key Configuration

If applicable, include the primary configuration examples or code snippets:

```typescript
// Example configuration
const config = {
  // Key settings
}
```

```json
// Example JSON configuration
{
  "key": "value"
}
```

---

## Critical Warnings

Highlight any critical warnings, deprecations, or common mistakes:

- ⚠️ **Warning 1**: Description of what to avoid and why
- ⚠️ **Warning 2**: Description of another important consideration
- ⚠️ **Warning 3**: ...

---

## Implementation Patterns

### Pattern 1: [Pattern Name]

**When to use**: Description of when this pattern applies

**Implementation**:

```typescript
// Code example
```

**Considerations**:

- Pro: Advantage 1
- Pro: Advantage 2
- Con: Limitation 1

### Pattern 2: [Pattern Name]

**When to use**: Description

**Implementation**:

```typescript
// Code example
```

**Considerations**:

- Pro: ...
- Con: ...

---

## Complete Documentation Content

> **Note**: This section contains the full, relevant content from the source documentation. Include enough detail that agents can implement features without needing to fetch the original URL.

### Section 1: [Section Name]

[Full content from the original documentation]

### Section 2: [Section Name]

[Full content from the original documentation]

### Section 3: [Section Name]

[Full content from the original documentation]

---

## Cross-References

### External Documentation

- [Official Docs - Related Topic 1](https://example.com/docs/topic-1) - Brief description
- [Official Docs - Related Topic 2](https://example.com/docs/topic-2) - Brief description
- [Community Tutorial](https://example.com/tutorial) - Brief description

### Internal Implementation Files

- [File Path 1](../../path/to/file.ts) - Brief description of implementation
- [File Path 2](../../path/to/file.ts) - Brief description of implementation

### Related Technologies

- Technology 1 - How it relates to this reference
- Technology 2 - How it relates to this reference

---

## Update History

| Date       | Updated By     | Changes                |
| ---------- | -------------- | ---------------------- |
| YYYY-MM-DD | [Agent/Person] | Initial creation       |
| YYYY-MM-DD | [Agent/Person] | Description of updates |

---

## Agent Usage Instructions

**For agents using this reference**:

1. **When to use this reference**: Describe the conditions or triggers for using this documentation
2. **What to verify**: List items to verify in the reference (e.g., version compatibility, deprecated features)
3. **How to validate**: Describe how to validate that implementation matches this reference
4. **When to update**: Describe conditions that would require updating this reference document

**Example workflow**:

1. Agent reads this reference instead of fetching external docs
2. Agent implements based on patterns and configuration shown here
3. Agent validates implementation against "Key Configuration" section
4. Agent checks "Critical Warnings" to avoid common mistakes
5. Agent updates this reference if source documentation has changed

---

## Validation Checklist

Before considering this reference complete, verify:

- [ ] Source URL is accessible and correct
- [ ] All critical configuration examples are included
- [ ] Warnings and gotchas are documented
- [ ] Related ADRs, user stories, and specs are cross-referenced
- [ ] Use cases within the project are clearly described
- [ ] Implementation patterns include working code examples
- [ ] Agent that will use this reference is identified
- [ ] Update history is initialized

---

## Notes

Additional notes or context that doesn't fit in other sections:

- Note 1
- Note 2
- Note 3
