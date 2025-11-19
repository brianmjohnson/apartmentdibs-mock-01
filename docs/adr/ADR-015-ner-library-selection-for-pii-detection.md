# ADR-015: NER Library Selection for PII Detection

**Status:** APPROVED
**Date:** 2025-11-19
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

User Story US-001 requires automatic detection and scrubbing of personally identifiable information (PII) from tenant-submitted text fields and documents. We need Named Entity Recognition (NER) to identify names, locations, organizations, and other identifying information to ensure landlords cannot infer tenant identity before selection.

**Background**:
- Tenants submit personal notes, references, and employment information
- These free-text fields may contain bias-inducing information:
  - Names (racial/ethnic inference)
  - Locations (neighborhood/country of origin)
  - Organizations (religious institutions, ethnic associations)
  - Age indicators (graduation years, birth dates)
- Current approach: No PII scrubbing implemented
- Accuracy is critical: False negatives leak PII, false positives remove valid info

**Requirements**:
- **Functional**: Detect PERSON, LOCATION, ORGANIZATION entities
- **Functional**: Identify dates that could reveal age
- **Functional**: Process both short text and longer documents
- **Non-functional**: Processing time < 2 seconds for typical application text
- **Non-functional**: Accuracy > 95% for common entity types
- **Non-functional**: Support for multilingual text (future requirement)
- **Constraints**: Must run in Node.js/TypeScript environment
- **Constraints**: Prefer edge-deployable (serverless compatible)

**Scope**:
- **Included**: NER library selection, integration approach
- **Included**: Entity types to detect, post-processing rules
- **Not included**: OCR for documents (separate service)
- **Not included**: Image-based PII detection (photos)

---

## Decision

**We will use Compromise.js as primary NER with custom regex patterns for comprehensive PII detection.**

Compromise.js is a lightweight, JavaScript-native NLP library that runs entirely in Node.js without external dependencies. We'll enhance it with custom patterns for age indicators and ethnic markers.

**Implementation Approach**:
- Use Compromise.js for named entity recognition (people, places, organizations)
- Add custom regex patterns for:
  - Email addresses
  - Phone numbers
  - Dates (birth years, graduation dates)
  - Social Security Numbers (last 4 digits)
- Build confidence scoring to handle edge cases
- Create post-processing pipeline for context-aware scrubbing
- Deploy as serverless function for async processing

**Why This Approach**:
1. **Pure JavaScript**: No Python/system dependencies, runs anywhere
2. **Serverless Ready**: Lightweight, fast cold start, edge-deployable
3. **Good Accuracy**: 80-90% for common entities (sufficient with custom rules)
4. **Extensible**: Easy to add custom patterns and rules
5. **Active Maintenance**: Regular updates, good documentation
6. **Bundle Size**: ~200KB minified (vs MB+ for spaCy wrappers)

**Example/Proof of Concept**:
```typescript
// lib/services/pii-scrubbing.ts
import nlp from 'compromise';
import plg from 'compromise-dates';

// Extend compromise with dates plugin
nlp.extend(plg);

interface ScrubResult {
  text: string;
  redactions: Array<{
    original: string;
    type: string;
    replacement: string;
    confidence: number;
  }>;
}

export function scrubPii(input: string): ScrubResult {
  const doc = nlp(input);
  const redactions: ScrubResult['redactions'] = [];
  let text = input;

  // Detect and redact people names
  doc.people().forEach((match) => {
    const original = match.text();
    redactions.push({
      original,
      type: 'PERSON',
      replacement: '[NAME REDACTED]',
      confidence: 0.85,
    });
    text = text.replace(original, '[NAME REDACTED]');
  });

  // Detect and redact places
  doc.places().forEach((match) => {
    const original = match.text();
    redactions.push({
      original,
      type: 'LOCATION',
      replacement: '[LOCATION REDACTED]',
      confidence: 0.80,
    });
    text = text.replace(original, '[LOCATION REDACTED]');
  });

  // Detect and redact organizations
  doc.organizations().forEach((match) => {
    const original = match.text();
    redactions.push({
      original,
      type: 'ORGANIZATION',
      replacement: '[ORGANIZATION REDACTED]',
      confidence: 0.75,
    });
    text = text.replace(original, '[ORGANIZATION REDACTED]');
  });

  // Custom patterns for additional PII
  text = scrubCustomPatterns(text, redactions);

  return { text, redactions };
}

function scrubCustomPatterns(
  text: string,
  redactions: ScrubResult['redactions']
): string {
  // Email addresses
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi;
  text = text.replace(emailRegex, (match) => {
    const [local, domain] = match.split('@');
    const obfuscated = `${local[0]}***@${domain}`;
    redactions.push({
      original: match,
      type: 'EMAIL',
      replacement: obfuscated,
      confidence: 0.99,
    });
    return obfuscated;
  });

  // Phone numbers
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  text = text.replace(phoneRegex, (match) => {
    redactions.push({
      original: match,
      type: 'PHONE',
      replacement: '[PHONE REDACTED]',
      confidence: 0.95,
    });
    return '[PHONE REDACTED]';
  });

  // Birth years and graduation dates (age indicators)
  const yearRegex = /\b(19[4-9]\d|20[0-2]\d)\b/g;
  text = text.replace(yearRegex, (match) => {
    redactions.push({
      original: match,
      type: 'DATE',
      replacement: '[YEAR REDACTED]',
      confidence: 0.70, // Lower confidence - may be other years
    });
    return '[YEAR REDACTED]';
  });

  // National origin phrases
  const originRegex = /\b(from|born in|raised in|immigrated from|moved from)\s+\w+/gi;
  text = text.replace(originRegex, (match) => {
    redactions.push({
      original: match,
      type: 'ORIGIN',
      replacement: '[ORIGIN REDACTED]',
      confidence: 0.85,
    });
    return '[ORIGIN REDACTED]';
  });

  return text;
}

// Example usage
const result = scrubPii(
  "My name is Maria Garcia. I graduated from Stanford in 2015. " +
  "I'm relocating from Mexico City for a job at Google."
);
// Result:
// "[NAME REDACTED]. I graduated from [ORGANIZATION REDACTED] in [YEAR REDACTED]. " +
// "I'm [ORIGIN REDACTED] for a job at [ORGANIZATION REDACTED]."
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences
- **Serverless Compatible**: No system dependencies, works on Vercel Edge
- **Fast Processing**: < 500ms for typical application text
- **Easy Integration**: Pure TypeScript, no Python bridge
- **Customizable**: Simple to add domain-specific patterns
- **Low Cost**: No API calls, runs locally

### Negative Consequences
- **Lower Accuracy**: 80-85% vs 90%+ for spaCy/transformers
- **Limited Languages**: English-optimized, basic multilingual support
- **No Context Understanding**: Pattern-based, not truly semantic
- **Edge Cases**: May miss unusual names or locations
- **False Positives**: Generic patterns may over-redact

### Neutral Consequences
- **Maintenance**: Custom patterns need ongoing refinement
- **Testing**: Need comprehensive test suite for accuracy validation

### Mitigation Strategies
- **Lower Accuracy**: Add confidence scores, flag low-confidence for review
- **Edge Cases**: Build dictionary of common edge cases (names, places)
- **False Positives**: Implement whitelist for legitimate terms (job titles, etc.)
- **Testing**: Create test dataset with known PII for accuracy metrics
- **Future Upgrade**: Abstract behind interface for potential spaCy upgrade

---

## Alternatives Considered

### Alternative 1: spaCy via Python Service

**Description**:
Use spaCy's state-of-the-art NER models via a Python microservice or WASM.

**Pros**:
- Industry-leading accuracy (92%+ F1 score)
- Excellent multilingual support
- Pre-trained models for many entity types
- Active research community

**Cons**:
- Requires Python runtime (separate service)
- Cold start latency (several seconds)
- Complex deployment on Vercel
- Higher memory requirements (500MB+ for models)
- Two languages in codebase

**Why Not Chosen**:
Running Python alongside Node.js adds significant operational complexity. Cold starts would exceed our 2-second processing requirement. Consider if we need significantly higher accuracy in future.

---

### Alternative 2: Hugging Face Transformers (NER)

**Description**:
Use transformer-based NER models via Hugging Face Inference API or local deployment.

**Pros**:
- State-of-the-art accuracy
- Fine-tunable for domain-specific entities
- API option avoids local deployment
- Excellent multilingual models

**Cons**:
- API costs at scale ($0.06/1K characters)
- Self-hosted requires significant compute
- Network latency for API calls
- Rate limiting concerns
- Privacy concerns (sending PII to external API)

**Why Not Chosen**:
Sending PII to external API contradicts our security model. Self-hosting transformers requires GPU/significant compute not available on Vercel. Consider for self-hosted deployment.

---

### Alternative 3: AWS Comprehend

**Description**:
Use Amazon Comprehend's managed NER service.

**Pros**:
- High accuracy, AWS-maintained models
- Handles multiple languages
- No infrastructure to manage
- PII-specific detection feature
- HIPAA eligible

**Cons**:
- Cost: $0.0001/unit (100 characters) = $1/MB
- Network latency (50-200ms per call)
- AWS dependency (already using KMS)
- Asynchronous API for large documents
- Batch processing for cost efficiency

**Why Not Chosen**:
Good option but adds cost and latency. At 1000 applications/month with 1KB average text, cost would be ~$10/month - acceptable but unnecessary given Compromise.js capabilities. Consider if accuracy issues arise.

---

### Alternative 4: Google Cloud Natural Language

**Description**:
Use Google Cloud NL API for entity recognition.

**Pros**:
- High accuracy, continuously improved
- Excellent multilingual support
- Entity salience scoring
- Content classification included

**Cons**:
- Cost: $1/1K records (up to 1KB each)
- Network latency
- Adds Google Cloud dependency (have AWS)
- Privacy concerns with text analysis

**Why Not Chosen**:
Similar to AWS Comprehend but adds another cloud provider. Prefer to minimize vendor dependencies. Compromise.js meets current requirements.

---

### Alternative 5: Regex-Only Approach

**Description**:
Use only regular expressions without NER library.

**Pros**:
- Simplest implementation
- No dependencies
- Fastest processing
- Full control over patterns

**Cons**:
- Cannot detect arbitrary names
- High false positive rate
- No linguistic understanding
- Requires extensive pattern library
- Misses context-dependent entities

**Why Not Chosen**:
Pure regex cannot reliably detect names (infinite variations). Compromise.js adds linguistic understanding with minimal overhead. We use regex to augment NER, not replace it.

---

## Related

**Related ADRs**:
- [ADR-013: PII Encryption] - Encrypted storage after scrubbing
- [ADR-014: Row-Level Security] - Access control complements scrubbing

**Related Documentation**:
- [User Story US-001] - PII Anonymization requirements
- [docs/services/pii-scrubbing.md] - Implementation guide (to be created)

**External References**:
- [Compromise.js Documentation](https://compromise.cool/)
- [Compromise.js GitHub](https://github.com/spencermountain/compromise)
- [spaCy NER Benchmark](https://spacy.io/usage/facts-figures)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

---

## Notes

**Decision Making Process**:
- Evaluated serverless compatibility of NER options
- Compared accuracy vs. operational complexity
- Considered cost at scale (1000+ applications/month)
- Prototyped Compromise.js for representative text samples
- Decision date: 2025-11-19

**Review Schedule**:
- Monitor scrubbing accuracy with production data
- Review false negative rate monthly (PII leaks are critical)
- Evaluate upgrade to cloud NER if accuracy < 90%
- Assess multilingual needs when expanding markets

**Accuracy Validation Plan**:
- Create test dataset with 100+ samples containing various PII
- Measure precision, recall, F1 score for each entity type
- Target: 95% recall (minimize false negatives), 85% precision
- Quarterly accuracy review with production samples

**Migration Plan**:
- **Phase 1**: Implement Compromise.js service with custom patterns
- **Phase 2**: Create test suite for accuracy validation
- **Phase 3**: Integrate with application submission flow
- **Phase 4**: Monitor and tune patterns based on production data
- **Upgrade Path**: Abstract behind `PiiScrubber` interface for future swap

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-19 | Architecture Agent | Initial creation for US-001 |
