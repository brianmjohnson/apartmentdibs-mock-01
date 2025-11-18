# Testing Pyramid Strategy

**Type**: Implementation Guide
**Domain**: Testing
**Adapted from**: ApartmentDibs ADR-006

---

## Overview

A comprehensive two-tier testing strategy combining Jest for fast unit tests and Playwright for E2E coverage, ensuring rapid feedback during development while maintaining confidence in critical user journeys.

**Core Principle**: **Many fast unit tests, fewer integration tests, critical path E2E tests.**

---

## The Testing Pyramid

```
          /\
         /E2E\        Playwright: Critical paths (15-30 tests)
        /------\
       / Integ  \     Jest: Integration tests (40-80 tests)
      /----------\
     /   Unit     \   Jest: Business logic (150-300+ tests)
    /--------------\
```

**Why This Structure**:
- **Unit tests**: Fast feedback (<10s), enable TDD workflow
- **Integration tests**: Validate component composition
- **E2E tests**: Confidence in critical user journeys

---

## Jest (Unit & Integration Tests)

### What to Test with Jest

**Business Logic**:
- State machines (order processing, workflow steps)
- Calculation functions (pricing, discounts, scoring)
- Validation logic (form validators, business rules)

**Helper Functions**:
- Formatters (dates, currency, phone numbers)
- Permission checks (isPlatformAdmin, hasPermission)
- Data transformations (API response mappers)

**React Hooks**:
- Custom hooks (useOrganization, usePermissions)
- Data fetching hooks (TanStack Query wrappers)
- State management hooks (Zustand selectors)

**React Components**:
- Guard components (RequireAuth, RequireRole)
- Form components (inputs, validators)
- UI components (buttons, cards, modals)

**Data Access Objects**:
- Database queries
- API client methods
- Cache interactions

**Validation Schemas**:
- Zod schemas
- Type guards
- Input sanitization

---

### Jest Test Examples

**Guard Component Test**:

```typescript
// __tests__/auth/guards/RequireAuth.test.tsx
import { render, screen } from "@testing-library/react"
import { RequireAuth } from "@/components/auth/guards/RequireAuth"
import { mockUseSession } from "@/tests/helpers/auth"

describe("RequireAuth", () => {
  it("renders children when authenticated", () => {
    mockUseSession({ data: mockSession, isPending: false })

    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    )

    expect(screen.getByText("Protected Content")).toBeInTheDocument()
  })

  it("renders fallback when not authenticated", () => {
    mockUseSession({ data: null, isPending: false })

    render(
      <RequireAuth fallback={<div>Login Required</div>}>
        <div>Protected Content</div>
      </RequireAuth>
    )

    expect(screen.getByText("Login Required")).toBeInTheDocument()
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
  })

  it("shows loading state while checking auth", () => {
    mockUseSession({ data: null, isPending: true })

    render(
      <RequireAuth loadingFallback={<div>Loading...</div>}>
        <div>Protected Content</div>
      </RequireAuth>
    )

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })
})
```

---

**Business Logic Test**:

```typescript
// __tests__/lib/helpers/pricing.test.ts
import { calculateDiscount, applyPromoCode } from "@/lib/helpers/pricing"

describe("Pricing Helpers", () => {
  describe("calculateDiscount", () => {
    it("applies percentage discount correctly", () => {
      const result = calculateDiscount(100, { type: "percentage", value: 20 })
      expect(result).toBe(80)
    })

    it("applies fixed amount discount correctly", () => {
      const result = calculateDiscount(100, { type: "fixed", value: 15 })
      expect(result).toBe(85)
    })

    it("does not discount below zero", () => {
      const result = calculateDiscount(100, { type: "fixed", value: 150 })
      expect(result).toBe(0)
    })
  })

  describe("applyPromoCode", () => {
    it("applies valid promo code", async () => {
      const result = await applyPromoCode("SAVE20", 100)
      expect(result.finalPrice).toBe(80)
      expect(result.discountApplied).toBe(20)
    })

    it("rejects expired promo code", async () => {
      await expect(
        applyPromoCode("EXPIRED", 100)
      ).rejects.toThrow("Promo code expired")
    })
  })
})
```

---

**Custom Hook Test**:

```typescript
// __tests__/hooks/usePermissions.test.ts
import { renderHook } from "@testing-library/react"
import { usePermissions } from "@/lib/hooks/usePermissions"
import { mockUseSession } from "@/tests/helpers/auth"

describe("usePermissions", () => {
  it("identifies admin user correctly", () => {
    mockUseSession({
      data: { user: { role: "admin" } },
      isPending: false,
    })

    const { result } = renderHook(() => usePermissions())

    expect(result.current.isAdmin).toBe(true)
    expect(result.current.hasPermission("users.delete")).toBe(true)
  })

  it("denies permissions for regular user", () => {
    mockUseSession({
      data: { user: { role: "user" } },
      isPending: false,
    })

    const { result } = renderHook(() => usePermissions())

    expect(result.current.isAdmin).toBe(false)
    expect(result.current.hasPermission("users.delete")).toBe(false)
  })
})
```

---

**Database DAO Test**:

```typescript
// __tests__/lib/dao/organization.test.ts
import { getOrganizationWithMembers } from "@/lib/dao/organization"
import { createOrganization, createMember, createUser } from "@/tests/helpers/factories"
import { cleanDatabase } from "@/prisma/seed/utils/cleanup"

beforeEach(async () => {
  await cleanDatabase()
})

describe("getOrganizationWithMembers", () => {
  it("returns organization with all members", async () => {
    const org = await createOrganization()
    const user1 = await createUser()
    const user2 = await createUser()

    await createMember({ userId: user1.id, organizationId: org.id, role: "owner" })
    await createMember({ userId: user2.id, organizationId: org.id, role: "member" })

    const result = await getOrganizationWithMembers(org.id)

    expect(result.id).toBe(org.id)
    expect(result.members).toHaveLength(2)
    expect(result.members[0].role).toBe("owner")
  })

  it("throws error if organization not found", async () => {
    await expect(
      getOrganizationWithMembers("non-existent-id")
    ).rejects.toThrow("Organization not found")
  })
})
```

---

## Playwright (E2E Tests)

### What to Test with Playwright

**Authentication Flows**:
- OAuth sign-in (Google, GitHub, etc.)
- Sign-out and session cleanup
- Session persistence across page reloads
- Callback URL handling after OAuth

**Authorization**:
- Admin impersonation (start/stop)
- Organization switching
- Role-based access control
- Data isolation between organizations

**Critical CRUD Operations**:
- Create/edit/delete core resources
- Form validation and submission
- File uploads
- Multi-step workflows

**User Journeys**:
- Onboarding flow
- Checkout/payment flow
- Dashboard interactions
- Settings updates

---

### Playwright Test Examples

**Authentication Flow**:

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test"

test("user can sign in with OAuth", async ({ page }) => {
  await page.goto("/")

  // Click sign-in button
  await page.click('[data-testid="sign-in-button"]')

  // OAuth provider selection
  await page.click('[data-testid="oauth-google"]')

  // After OAuth redirect (mocked in test env)
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
})

test("user can sign out", async ({ page }) => {
  await loginAsUser(page) // Helper function

  await page.click('[data-testid="user-menu"]')
  await page.click('[data-testid="sign-out-button"]')

  await expect(page).toHaveURL(/\//)
  await expect(page.locator('[data-testid="sign-in-button"]')).toBeVisible()
})
```

---

**Impersonation Flow**:

```typescript
// tests/e2e/impersonation.spec.ts
import { test, expect } from "@playwright/test"
import { loginAsAdmin, loginAsUser } from "../helpers/auth"

test("admin can impersonate user and return", async ({ page }) => {
  await loginAsAdmin(page)
  await page.goto("/admin/users")

  // Start impersonation
  await page.click('[data-testid="impersonate-user-123"]')

  // Verify impersonation banner
  await expect(
    page.locator('[data-testid="impersonation-banner"]')
  ).toBeVisible()

  // Navigate as impersonated user
  await page.goto("/settings")
  await expect(page).toHaveURL(/\/settings/)

  // Stop impersonation
  await page.click('[data-testid="stop-impersonation"]')

  // Verify returned to admin
  await expect(
    page.locator('[data-testid="impersonation-banner"]')
  ).not.toBeVisible()
  await expect(page).toHaveURL(/\/admin/)
})
```

---

**Organization Switching**:

```typescript
// tests/e2e/organization-switching.spec.ts
import { test, expect } from "@playwright/test"
import { seedMultiOrganization } from "@/prisma/seed/scenarios"

test.beforeEach(async () => {
  await cleanDatabase()
  await seedMultiOrganization() // User with 2 organizations
})

test("user can switch between organizations", async ({ page }) => {
  await loginAsUser(page)

  // Check current organization
  await expect(page.locator('[data-testid="org-name"]')).toHaveText("Org 1")

  // Switch organization
  await page.click('[data-testid="org-switcher"]')
  await page.click('[data-testid="org-option-2"]')

  // Verify switch
  await expect(page.locator('[data-testid="org-name"]')).toHaveText("Org 2")

  // Verify data isolation (only see Org 2 projects)
  await expect(page.locator('[data-testid="project-list"]')).not.toContainText(
    "Org 1 Project"
  )
})
```

---

**CRUD Flow**:

```typescript
// tests/e2e/posts.spec.ts
import { test, expect } from "@playwright/test"

test("user can create, edit, and delete a post", async ({ page }) => {
  await loginAsUser(page)

  // Create post
  await page.goto("/posts/new")
  await page.fill('input[name="title"]', "My Test Post")
  await page.fill('textarea[name="content"]', "This is test content.")
  await page.click('button[type="submit"]')

  // Verify creation
  await expect(page.locator("text=My Test Post")).toBeVisible()

  // Edit post
  await page.click('[data-testid="edit-post"]')
  await page.fill('input[name="title"]', "My Updated Post")
  await page.click('button[type="submit"]')

  // Verify edit
  await expect(page.locator("text=My Updated Post")).toBeVisible()

  // Delete post
  await page.click('[data-testid="delete-post"]')
  await page.click('[data-testid="confirm-delete"]')

  // Verify deletion
  await expect(page.locator("text=My Updated Post")).not.toBeVisible()
})
```

---

## Test Data Strategy

### Use Factories from Seeding Guide

**Jest Tests**:

```typescript
// __tests__/lib/dao/posts.test.ts
import { createUser, createPost } from "@/tests/helpers/factories"

it("returns user's published posts", async () => {
  const user = await createUser()

  await createPost({ authorId: user.id, published: true })
  await createPost({ authorId: user.id, published: false })

  const posts = await getUserPublishedPosts(user.id)

  expect(posts).toHaveLength(1)
  expect(posts[0].published).toBe(true)
})
```

---

**Playwright Tests**:

```typescript
// tests/e2e/setup.ts
import { test as base } from "@playwright/test"
import { seedTest } from "@/prisma/seed/scenarios/test"

export const test = base.extend({
  // Reset database before each test
  page: async ({ page }, use) => {
    await cleanDatabase()
    await seedTest()
    await use(page)
  },
})
```

---

## Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "!**/*.test.{ts,tsx}",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

**Key Settings**:
- `testEnvironment: "jsdom"` → Simulate browser environment
- `coverageThresholds` → Enforce minimum coverage
- `setupFilesAfterEnv` → Global test setup (mock defaults, etc.)

---

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],

  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
})
```

**Key Settings**:
- `fullyParallel: true` → Run tests in parallel for speed
- `retries: 2` → Retry flaky tests in CI
- `trace: "on-first-retry"` → Generate trace for debugging
- `webServer` → Auto-start dev server for tests

---

## Test Helpers

### Authentication Helpers

```typescript
// tests/helpers/auth.ts
import { Page } from "@playwright/test"

export async function loginAsUser(page: Page, email = "test@example.com") {
  // For E2E tests, use test OAuth endpoint
  await page.goto(`/api/auth/test-login?email=${email}`)
  await page.waitForURL(/\/dashboard/)
}

export async function loginAsAdmin(page: Page) {
  await page.goto("/api/auth/test-login?role=admin")
  await page.waitForURL(/\/admin/)
}

export function mockUseSession(returnValue: any) {
  jest.mock("@/lib/auth/auth-client", () => ({
    useSession: jest.fn(() => returnValue),
  }))
}
```

---

### Factory Helpers

```typescript
// tests/helpers/factories.ts
import { faker } from "@faker-js/faker"
import { createUser as createUserFactory } from "@/prisma/seed/factories/user.factory"

// Set deterministic seed for tests
faker.seed(12345)

export async function createTestUser(overrides = {}) {
  return createUserFactory({
    emailVerified: true, // Always verified in tests
    ...overrides,
  })
}

export async function createTestPost(overrides = {}) {
  return createPostFactory({
    published: true, // Always published in tests
    ...overrides,
  })
}
```

---

## package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "pnpm test && pnpm test:e2e"
  }
}
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

**Key Features**:
- Parallel unit and E2E test jobs
- Coverage upload to Codecov
- Playwright report artifact on failure

---

## Critical Test Scenarios

### Authentication (100% Coverage Required)

- [ ] OAuth sign-in (Google, GitHub)
- [ ] Sign-out and session cleanup
- [ ] Session persistence across page reloads
- [ ] Callback URL handling
- [ ] Email verification flow

### Authorization (100% Coverage Required)

- [ ] Admin impersonation (start/stop)
- [ ] Organization switching
- [ ] Role-based access control
- [ ] Permission checks (create, edit, delete)
- [ ] Data isolation between organizations

### Core Features (Critical Paths)

- [ ] User registration/onboarding
- [ ] Profile editing
- [ ] Organization creation
- [ ] Team member invitation
- [ ] Resource CRUD operations
- [ ] Search functionality
- [ ] File uploads

---

## Coverage Goals

**Unit Tests**:
- 70% overall code coverage (enforced)
- 90%+ for business logic (state machines, calculations)
- 80%+ for helper functions
- 60%+ for components (focus on logic, not UI)

**E2E Tests**:
- 100% critical path coverage (auth, core features)
- 100% authorization flow coverage
- 90%+ happy path coverage for core features
- 50%+ edge case coverage

**Zero Tolerance**:
- Authentication flows: Must have 100% E2E coverage
- Authorization checks: Must have 100% E2E coverage
- Data isolation: Must have 100% E2E coverage

---

## Best Practices

### ✅ Do

- Write unit tests for business logic and pure functions
- Use E2E tests for critical user journeys
- Use factories for test data
- Set deterministic Faker seed in tests
- Clean database before each E2E test
- Mock external APIs in unit tests
- Use test IDs (`data-testid`) for E2E selectors
- Run unit tests in watch mode during development
- Debug failing E2E tests with Playwright UI mode

### ❌ Don't

- Test implementation details (internal state)
- Use E2E tests for business logic (too slow)
- Hardcode test data (use factories)
- Skip cleanup between tests (causes pollution)
- Use CSS selectors in E2E tests (too brittle)
- Test third-party libraries (they have their own tests)
- Commit failing tests (fix or skip with `.skip`)

---

## Debugging

### Jest Debugging

```bash
# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test path/to/test.test.ts

# Run tests matching pattern
pnpm test -t "user can sign in"

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

### Playwright Debugging

```bash
# Run tests in UI mode (recommended)
pnpm test:e2e:ui

# Run tests in headed mode (see browser)
pnpm test:e2e:headed

# Debug specific test
pnpm test:e2e:debug tests/e2e/auth.spec.ts

# Generate trace for failed test
pnpm test:e2e --trace on
npx playwright show-trace trace.zip
```

**Playwright Trace Viewer**:
- Timeline of all actions
- Network requests
- Screenshots at each step
- Console logs
- DOM snapshots

---

## Benefits

### Positive Consequences

- **Fast Feedback**: Jest tests run in <10 seconds, enable TDD workflow
- **Confidence**: E2E tests catch integration issues before production
- **Regression Prevention**: Comprehensive auth test coverage
- **Documentation**: Tests serve as usage examples
- **CI/CD Ready**: Both test suites integrate with GitHub Actions
- **Debugging**: Playwright trace viewer for failed E2E tests
- **Type Safety**: TypeScript catches errors in test code too

### Negative Consequences

- **Maintenance**: Must update tests when behavior changes
- **Slow E2E**: Playwright tests take 2-3 minutes to run full suite
- **Flakiness**: E2E tests can be flaky (network, timing issues)
- **Infrastructure**: Need Playwright browsers installed (~500MB)

---

## Alternatives Considered

### Jest Only (No E2E)

**Rejected**:
- Cannot test OAuth flows
- Cannot test browser-specific behavior
- Cannot test full user journeys
- Critical authentication paths untested

### Cypress Instead of Playwright

**Rejected**:
- Playwright has better TypeScript support
- Runs on real browsers (not just Electron)
- Faster execution
- Better debugging tools (trace viewer)

### Full E2E Coverage (Everything with Playwright)

**Rejected**:
- Too slow for TDD workflow
- Expensive CI minutes
- Unnecessary for pure business logic

---

## Related Documentation

- **Seeding Strategy**: `docs/domains/testing/seeding-strategy.md`
- **Guard Components**: `docs/domains/authentication/guard-components.md` (testing auth)

---

## External Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

---

**Key Takeaway**: **Write many fast unit tests for business logic, fewer integration tests for component composition, and critical path E2E tests for user journeys. Use factories for test data and maintain 100% coverage on authentication/authorization.**
