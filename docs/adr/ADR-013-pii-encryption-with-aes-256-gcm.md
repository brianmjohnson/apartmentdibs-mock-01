# ADR-013: PII Encryption with AES-256-GCM

**Status:** APPROVED
**Date:** 2025-11-19
**Author:** Architecture Agent

---

## Context

**What is the issue or problem we're solving?**

User Story US-001 (PII Anonymization Before Landlord Review) requires encrypting sensitive tenant personally identifiable information (PII) at rest. This includes names, photos, dates of birth, addresses, and employer details. The encryption must protect data from unauthorized access while allowing authorized decryption when landlords select applicants.

**Background**:
- Tenant profiles contain highly sensitive PII that must be protected
- PII is only revealed after landlord selection (blind evaluation)
- Data must be encrypted in PostgreSQL JSONB fields
- Compliance requirements: Fair Housing Act, FCRA, GDPR/CCPA
- Current approach: No encryption implemented yet

**Requirements**:
- **Functional**: Encrypt PII data at rest in database
- **Functional**: Decrypt PII only when authorized access occurs
- **Functional**: Support key rotation without data re-encryption downtime
- **Non-functional**: Encryption/decryption latency < 50ms
- **Non-functional**: FIPS 140-2 compliant encryption algorithm
- **Non-functional**: Secure key management (no keys in code/environment)
- **Constraints**: Must work with PostgreSQL JSONB storage
- **Constraints**: Must integrate with Node.js/TypeScript backend

**Scope**:
- **Included**: Encryption algorithm selection, key management approach
- **Included**: Integration with TenantProfile model for piiData field
- **Not included**: Transport encryption (TLS already handled by Vercel)
- **Not included**: Database-level encryption (handled by Neon PostgreSQL)

---

## Decision

**We will use AES-256-GCM for PII encryption with AWS KMS for key management.**

AES-256-GCM (Advanced Encryption Standard with 256-bit keys in Galois/Counter Mode) provides authenticated encryption, ensuring both confidentiality and integrity of PII data. We'll use AWS KMS for secure key storage and management.

**Implementation Approach**:
- Use Node.js `crypto` module with AES-256-GCM algorithm
- Store encrypted data as base64 in PostgreSQL JSONB
- Each record gets unique IV (Initialization Vector) stored alongside ciphertext
- Authentication tag validates data integrity on decryption
- AWS KMS stores Data Encryption Key (DEK), envelope encryption pattern
- Key rotation handled by KMS with automatic re-wrapping

**Why This Approach**:
1. **Industry Standard**: AES-256 is NIST-approved, FIPS 140-2 compliant
2. **Authenticated Encryption**: GCM mode provides integrity verification
3. **Performance**: Hardware-accelerated on modern CPUs (AES-NI)
4. **Node.js Native**: Built-in `crypto` module, no external dependencies
5. **Key Management**: AWS KMS provides secure, auditable key storage

**Example/Proof of Concept**:
```typescript
// lib/services/pii-encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { KMSClient, DecryptCommand, GenerateDataKeyCommand } from '@aws-sdk/client-kms';

const kmsClient = new KMSClient({ region: process.env.AWS_REGION });
const KMS_KEY_ID = process.env.KMS_KEY_ID;

interface EncryptedData {
  ciphertext: string;  // base64 encoded
  iv: string;          // base64 encoded
  authTag: string;     // base64 encoded
  keyId: string;       // KMS key version for rotation
}

export async function encryptPii(plaintext: Record<string, unknown>): Promise<EncryptedData> {
  // Generate data key from KMS
  const { Plaintext: dataKey, CiphertextBlob: encryptedDataKey } = await kmsClient.send(
    new GenerateDataKeyCommand({
      KeyId: KMS_KEY_ID,
      KeySpec: 'AES_256',
    })
  );

  const iv = randomBytes(12); // 96-bit IV for GCM
  const cipher = createCipheriv('aes-256-gcm', dataKey!, iv);

  const json = JSON.stringify(plaintext);
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    keyId: encryptedDataKey!.toString('base64'),
  };
}

export async function decryptPii(encrypted: EncryptedData): Promise<Record<string, unknown>> {
  // Decrypt data key from KMS
  const { Plaintext: dataKey } = await kmsClient.send(
    new DecryptCommand({
      CiphertextBlob: Buffer.from(encrypted.keyId, 'base64'),
    })
  );

  const decipher = createDecipheriv(
    'aes-256-gcm',
    dataKey!,
    Buffer.from(encrypted.iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted.ciphertext, 'base64')),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString('utf8'));
}
```

---

## Consequences

**What becomes easier or more difficult as a result of this decision?**

### Positive Consequences
- **Strong Security**: AES-256 provides military-grade encryption
- **Data Integrity**: GCM authentication tag detects tampering
- **Compliance Ready**: Meets FIPS 140-2, SOC2, HIPAA encryption requirements
- **Audit Trail**: KMS logs all key usage for compliance
- **Key Rotation**: KMS handles rotation without code changes

### Negative Consequences
- **AWS Dependency**: Tied to AWS KMS (vendor lock-in risk)
- **KMS Latency**: Each encrypt/decrypt requires KMS API call (~10-50ms)
- **KMS Costs**: ~$1/10,000 requests + $1/month per key
- **Complexity**: Envelope encryption pattern adds implementation complexity
- **No Database Search**: Encrypted fields cannot be queried in SQL

### Neutral Consequences
- **Data Format**: PII stored as encrypted JSON blob, not individual columns
- **Development Mode**: Need local KMS mock or dev key for testing

### Mitigation Strategies
- **KMS Latency**: Cache decrypted data in memory for active sessions
- **KMS Costs**: Batch operations, use caching to reduce API calls
- **AWS Dependency**: Abstract KMS behind interface for potential future migration
- **No Database Search**: Use obfuscated fields for queries, encrypted only for storage
- **Development Mode**: Use `aws-sdk-client-mock` for testing, local key for dev

---

## Alternatives Considered

### Alternative 1: PostgreSQL pgcrypto Extension

**Description**:
Use PostgreSQL's built-in pgcrypto extension for encryption at the database layer.

**Pros**:
- Native PostgreSQL integration
- No external service dependency
- Encryption happens transparently in database
- Can potentially search encrypted data with specific patterns

**Cons**:
- Key management in database (security risk)
- No hardware security module (HSM) protection
- Less control over encryption parameters
- Neon PostgreSQL support uncertain

**Why Not Chosen**:
pgcrypto lacks secure key management. Keys in database environment variables are exposed to anyone with database access. KMS provides HSM-backed security with audit logging.

---

### Alternative 2: HashiCorp Vault

**Description**:
Use Vault's Transit Secrets Engine for encryption as a service.

**Pros**:
- Platform-agnostic (not tied to AWS)
- Excellent key management features
- Can run self-hosted or use HCP Vault
- Supports multiple encryption algorithms

**Cons**:
- Requires running Vault server (operational overhead)
- Additional service to manage and secure
- HCP Vault costs more than AWS KMS
- More complex setup and configuration

**Why Not Chosen**:
Operational overhead of running Vault not justified for this use case. AWS KMS provides equivalent functionality with managed service simplicity. Consider Vault if we need multi-cloud support in future.

---

### Alternative 3: Application-Level with Static Key

**Description**:
Use AES-256-GCM with encryption key stored in environment variable.

**Pros**:
- Simplest implementation
- No external service dependency
- Zero additional latency (no API calls)
- Lower cost (no KMS charges)

**Cons**:
- Key rotation requires data re-encryption
- No audit log of key usage
- Key exposed in environment (security risk)
- No HSM protection for key material

**Why Not Chosen**:
Storing keys in environment variables is a significant security risk. Anyone with access to Vercel environment can extract the key. No audit trail makes compliance difficult.

---

### Alternative 4: Vercel Environment Encryption

**Description**:
Rely solely on Vercel's encrypted environment variables for secrets.

**Pros**:
- No additional implementation
- Vercel handles encryption
- Simple developer experience

**Cons**:
- Only encrypts secrets, not data at rest
- No granular encryption per record
- Cannot encrypt dynamic user data
- Not suitable for PII protection

**Why Not Chosen**:
Vercel environment encryption protects secrets, not user data. PII must be encrypted per-record with unique IVs for security.

---

## Related

**Related ADRs**:
- [ADR-014: PostgreSQL Row-Level Security] - RLS works alongside encryption
- [ADR-017: Immutable Audit Trail] - KMS audit logs complement application logs

**Related Documentation**:
- [User Story US-001] - PII Anonymization requirements
- [docs/security/encryption-guide.md] - Implementation guide (to be created)

**External References**:
- [AWS KMS Best Practices](https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html)
- [NIST AES Standard](https://csrc.nist.gov/publications/detail/fips/197/final)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

---

## Notes

**Decision Making Process**:
- Evaluated encryption algorithms (AES-256-GCM vs AES-256-CBC)
- Compared key management solutions (KMS, Vault, static keys)
- Consulted OWASP and NIST encryption guidelines
- Decision date: 2025-11-19

**Review Schedule**:
- Review KMS costs after 10k monthly requests
- Evaluate multi-cloud KMS options if AWS dependency becomes issue
- Monitor encryption/decryption latency in production

**Migration Plan**:
- **Phase 1**: Set up AWS KMS key and IAM policies
- **Phase 2**: Implement encryption service with tests
- **Phase 3**: Integrate with TenantProfile model
- **Phase 4**: Encrypt existing PII data (if any)
- **Rollback**: Maintain decryption capability; cannot un-encrypt without significant effort

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-19 | Architecture Agent | Initial creation for US-001 |
