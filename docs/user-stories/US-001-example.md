# US-001: User Authentication with Email [P0]

**Status**: Complete
**Priority**: P0 (MVP - Must Have)
**Sprint**: Sprint 1, Week 1

---

## User Story

**As a** new visitor
**I want to** sign up with my email and password
**So that** I can create an account and access the application

---

## Priority & Estimation

### RICE Scoring

- **Reach**: 100% of users (1,000 estimated in Month 1)
- **Impact**: 3 (Massive - can't use app without it)
- **Confidence**: 100% (essential feature)
- **Effort**: 1.5 person-weeks

**RICE Score**: (1000 × 3 × 1.0) / 1.5 = **2,000**

### Story Points

**Estimated Effort**: 8 story points (20 hours)

**Complexity Factors**:

- Technical complexity: Medium (using Better Auth library)
- UI complexity: Low (standard forms)
- Integration complexity: Low (Better Auth handles it)

---

## Acceptance Criteria

### AC-1: User Can Sign Up

**Given** I'm on the sign-up page
**When** I enter valid email "user@example.com" and password "SecurePass123!"
**Then** I see "Account created successfully" message
**And** I'm redirected to onboarding page `/onboarding`
**And** I'm automatically logged in
**And** I receive a welcome email within 2 minutes

**Verification**:

- [ ] Success message displays for 3 seconds
- [ ] Redirect happens automatically
- [ ] Session cookie is set
- [ ] Welcome email arrives in inbox

### AC-2: Email Validation

**Given** I'm on the sign-up page
**When** I enter invalid email "notanemail"
**Then** I see error "Please enter a valid email address"
**And** Submit button is disabled

**Verification**:

- [ ] Invalid formats rejected: missing @, no domain, spaces
- [ ] Valid formats accepted: user@domain.com, user+tag@domain.co.uk
- [ ] Error shows before submission
- [ ] Focus returns to email input

### AC-3: Password Requirements

**Given** I'm on the sign-up page
**When** I enter password "weak"
**Then** I see error "Password must be at least 8 characters with 1 uppercase, 1 number"
**And** Password strength indicator shows "Weak"

**Verification**:

- [ ] Min 8 characters enforced
- [ ] Requires: 1 uppercase, 1 lowercase, 1 number
- [ ] Strength indicator: Weak / Medium / Strong
- [ ] Show/hide password toggle works

### AC-4: Duplicate Email Prevention

**Given** Email "existing@example.com" already exists
**When** I try to sign up with same email
**Then** I see error "Email already registered. Try logging in or reset password."
**And** I see links to login and password reset

**Verification**:

- [ ] Duplicate detection works (case-insensitive)
- [ ] Helpful error message with next steps
- [ ] Links work correctly

### AC-5: Performance & Accessibility

**Performance**:

- [ ] Sign-up page loads in < 1 second
- [ ] Form submission completes in < 2 seconds
- [ ] No layout shifts during load

**Accessibility**:

- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigable (Tab, Enter)
- [ ] Screen reader announces errors
- [ ] Focus visible on all inputs
- [ ] Labels associated with inputs

---

## Technical Implementation Notes

### Backend Specification

**Better Auth Configuration**:

```typescript
// lib/auth.ts
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  database: prisma,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Enable in production
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Refresh daily
  },
})
```

**ZenStack Models** (already in `zschema/auth.zmodel`):

- `User` - Email, password hash, verified status
- `Session` - Active sessions
- `Account` - OAuth accounts (future)

**API Endpoints** (Better Auth provides):

- `POST /api/auth/sign-up` - Create account
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `POST /api/auth/verify-email` - Email verification

**Email Service** (Resend):

```typescript
// lib/email.ts
import { Resend } from 'resend'

export async function sendWelcomeEmail(email: string, name: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'welcome@yourdomain.com',
    to: email,
    subject: 'Welcome to [App Name]!',
    html: WelcomeEmailTemplate({ name }),
  })
}
```

### Frontend Specification

**Components**:

```
components/auth/
  SignUpForm.tsx        - Main sign-up form
  EmailInput.tsx        - Email with validation
  PasswordInput.tsx     - Password with strength indicator
  AuthButton.tsx        - Submit button with loading
```

**Page**:

- Route: `/sign-up`
- Layout: Centered card, responsive

**Form Validation** (Zod):

```typescript
const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain number'),
})
```

**Client Integration**:

```typescript
import { signUp } from '@/lib/auth-client'

const { mutate: handleSignUp, isPending } = useMutation({
  mutationFn: signUp,
  onSuccess: () => router.push('/onboarding'),
  onError: (error) => toast.error(error.message),
})
```

---

## Analytics Tracking

**Events to Track**:

| Event              | When                       | Properties                             |
| ------------------ | -------------------------- | -------------------------------------- |
| `signup_started`   | User clicks sign-up button | `{source: 'homepage' \| 'navbar'}`     |
| `signup_completed` | Account created            | `{userId, timestamp, method: 'email'}` |
| `signup_failed`    | Error during sign-up       | `{errorType, errorMessage}`            |
| `email_verified`   | Email verified             | `{userId, timestamp}`                  |

**Success Metrics**:

- Sign-up completion rate > 70%
- Time to complete sign-up < 2 minutes
- Email verification rate > 60% within 24 hours

---

## Dependencies

### Blocks

None - this is the foundation

### Blocked By

None

### Related Stories

- US-002: User Login - Uses same auth system
- US-003: Password Reset - Related to password management
- US-004: Email Verification - Enhances security

### External Dependencies

- Better Auth library (v1.3.27+)
- Resend API (for emails)
- Environment variables configured

---

## Testing Requirements

### Unit Tests

- [ ] Email validation function
- [ ] Password strength calculator
- [ ] Form submission handler
- [ ] Error message display

### Integration Tests

- [ ] Sign-up API endpoint creates user
- [ ] Session cookie is set correctly
- [ ] Welcome email is sent
- [ ] Database record created

### E2E Tests (Playwright)

```typescript
test('user can sign up successfully', async ({ page }) => {
  await page.goto('/sign-up')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'SecurePass123!')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/onboarding')
  await expect(page.locator('text=Welcome')).toBeVisible()
})
```

**Test Coverage Target**: 90% for auth flows

---

## Security Considerations

**Access Control**:

- Rate limiting: Max 5 sign-up attempts per IP per hour
- Email verification required in production
- Password hashed with bcrypt (handled by Better Auth)

**Data Validation**:

- Server-side validation (never trust client)
- SQL injection prevention (Prisma handles this)
- XSS prevention (Next.js escapes by default)

**Potential Risks**:

- **Bot sign-ups**: Mitigate with rate limiting, CAPTCHA in future
- **Email enumeration**: Generic error messages
- **Weak passwords**: Enforced requirements + strength indicator

---

## Performance Considerations

**Expected Load**:

- 100 sign-ups per day initially
- Peak: 20 concurrent sign-ups

**Optimization Strategies**:

- Client-side validation before API call
- Optimistic UI (show loading immediately)
- Email sending queued (async, doesn't block response)

**Performance Targets**:

- Page load: < 1s
- Form submission: < 2s
- Email delivery: < 2 minutes

---

## Notes & Updates

### Update Log

| Date       | Author             | Update                     |
| ---------- | ------------------ | -------------------------- |
| 2025-01-15 | Product Manager    | Initial draft              |
| 2025-01-16 | Architecture Agent | Added Better Auth ADR-001  |
| 2025-01-17 | Backend Developer  | Implemented auth endpoints |
| 2025-01-18 | Frontend Developer | Implemented sign-up form   |
| 2025-01-19 | QA Reviewer        | Testing complete, approved |
| 2025-01-20 | -                  | Deployed to production     |

---

**Last Updated**: 2025-01-20
**Status**: ✅ Complete and deployed
