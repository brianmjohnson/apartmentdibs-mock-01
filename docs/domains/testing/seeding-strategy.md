# Database Seeding Strategy

**Type**: Implementation Guide
**Domain**: Testing
**Adapted from**: ApartmentDibs ADR-005

---

## Overview

Create deterministic, composable test data using factory functions that enable seeding individual models or complete scenarios for development and testing.

**Core Principle**: **Build complex scenarios from simple, independent factories.**

---

## The Problem

Applications with complex data relationships need flexible seeding for:

- **Development**: Local databases with realistic data
- **Testing**: Specific scenarios for unit/E2E tests
- **Storybook**: Component development with varied states
- **Demos**: Consistent data for presentations

**Common seeding anti-patterns**:
```typescript
// ❌ Monolithic seed script
async function seed() {
  // Creates all data in one pass
  // 500 lines of tightly coupled code
  // Can't seed individual models
  // Difficult to create specific test scenarios
  // Hard to maintain as models evolve
}
```

**Problems**:
- Cannot seed individual models in isolation
- Difficult to create specific test scenarios
- Hard to maintain as models evolve
- Slow iteration (must seed everything or nothing)

---

## Solution: Factory-Based Composable Seeding

### Architecture

```
prisma/seed/
├── factories/           # Individual model factories
│   ├── user.factory.ts
│   ├── organization.factory.ts
│   ├── post.factory.ts
│   ├── comment.factory.ts
│   └── ...
├── scenarios/           # Composed test scenarios
│   ├── development.ts   # Rich local dev data
│   ├── test.ts          # Minimal test data
│   ├── demo.ts          # Demo/presentation data
│   └── ...
├── orchestrator.ts      # CLI entry point
└── utils/              # Shared utilities
    ├── platform-org.ts  # Ensure platform org exists
    └── cleanup.ts       # Database reset utilities
```

---

## Factory Pattern

### Basic Factory

Each factory is a **pure function** that creates one model instance:

```typescript
// prisma/seed/factories/user.factory.ts
import { faker } from "@faker-js/faker"
import { prisma } from "@/lib/prisma"

export interface UserFactoryInput {
  email?: string
  firstName?: string
  lastName?: string
  emailVerified?: boolean
  role?: string
  image?: string
}

export async function createUser(input: UserFactoryInput = {}) {
  return prisma.user.create({
    data: {
      email: input.email ?? faker.internet.email(),
      firstName: input.firstName ?? faker.person.firstName(),
      lastName: input.lastName ?? faker.person.lastName(),
      emailVerified: input.emailVerified ?? true,
      role: input.role ?? "user",
      image: input.image ?? faker.image.avatar(),
    },
  })
}

// Convenience variants
export const createAdmin = () => createUser({ role: "admin" })
export const createModerator = () => createUser({ role: "moderator" })
```

**Key Features**:
- **Defaults with Faker**: Realistic random data
- **Override capability**: Specify exact values when needed
- **Type-safe**: TypeScript input interface
- **Pure function**: No side effects, just creates one record

---

### Factory with Relationships

Handle foreign key dependencies gracefully:

```typescript
// prisma/seed/factories/post.factory.ts
export interface PostFactoryInput {
  authorId?: string
  title?: string
  content?: string
  published?: boolean
}

export async function createPost(input: PostFactoryInput = {}) {
  // Ensure author exists
  const authorId = input.authorId ?? (await createUser()).id

  return prisma.post.create({
    data: {
      authorId,
      title: input.title ?? faker.lorem.sentence(),
      content: input.content ?? faker.lorem.paragraphs(3),
      published: input.published ?? false,
    },
  })
}
```

**Pattern**: If foreign key not provided, create parent automatically.

---

### Complex Factory (Embedded JSON)

```typescript
// prisma/seed/factories/listing.factory.ts
export async function createListing(input: ListingFactoryInput = {}) {
  const businessId = input.businessId ?? (await createBusiness()).id

  return prisma.listing.create({
    data: {
      businessId,
      title: input.title ?? faker.commerce.productName(),
      description: input.description ?? faker.lorem.paragraphs(3),
      status: input.status ?? "DRAFT",

      // Embedded JSON object
      address: input.address ?? {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode(),
        country: "US",
      },

      // Nested array of objects
      images: input.images ?? [
        {
          url: faker.image.urlLoremFlickr({ category: "house" }),
          alt: "Property photo",
          order: 0,
        },
      ],
    },
  })
}
```

**Use Faker for**:
- Addresses
- Product names
- Lorem ipsum text
- URLs and images
- Phone numbers, emails

---

## Scenario Composition

### Simple Scenario

```typescript
// prisma/seed/scenarios/single-user-with-posts.ts
export async function seedSingleUserWithPosts() {
  const user = await createUser({
    email: "alice@example.com",
    firstName: "Alice",
  })

  await createPost({
    authorId: user.id,
    title: "My First Post",
    published: true,
  })

  await createPost({
    authorId: user.id,
    title: "Draft Post",
    published: false,
  })

  return { user }
}
```

---

### Complex Scenario

```typescript
// prisma/seed/scenarios/multi-organization.ts
export async function seedMultiOrganization() {
  // Create organization owner
  const owner = await createUser({ role: "owner" })

  // Organization 1
  const org1 = await createOrganization({ name: "Tech Corp" })
  await createMember({
    userId: owner.id,
    organizationId: org1.id,
    role: "owner",
  })

  // Add team members to org1
  const dev1 = await createUser({ role: "developer" })
  await createMember({
    userId: dev1.id,
    organizationId: org1.id,
    role: "member",
  })

  // Create projects for org1
  const project1 = await createProject({
    organizationId: org1.id,
    name: "Website Redesign",
  })

  // Organization 2
  const org2 = await createOrganization({ name: "Marketing Agency" })
  await createMember({
    userId: owner.id,
    organizationId: org2.id,
    role: "owner",
  })

  return { owner, org1, org2, dev1, project1 }
}
```

**Pattern**: Compose simple factories to create complex, realistic scenarios.

---

## CLI Interface

### Orchestrator Script

```typescript
// prisma/seed/orchestrator.ts
import { Command } from "commander"
import {
  seedDevelopment,
  seedTest,
  seedDemo,
} from "./scenarios"
import {
  createUser,
  createPost,
  createOrganization,
} from "./factories"

const program = new Command()

program
  .option("--all", "Seed everything (development scenario)")
  .option("--users <count>", "Number of users to create")
  .option("--posts <count>", "Number of posts to create")
  .option("--organizations <count>", "Number of organizations to create")
  .option("--scenario <name>", "Named scenario to seed")

program.parse()
const options = program.opts()

async function main() {
  if (options.all) {
    console.log("🌱 Seeding development data...")
    await seedDevelopment()
  } else if (options.scenario) {
    console.log(`🌱 Seeding scenario: ${options.scenario}`)
    await seedScenario(options.scenario)
  } else if (options.users) {
    console.log(`🌱 Creating ${options.users} users...`)
    for (let i = 0; i < parseInt(options.users); i++) {
      await createUser()
    }
  } else if (options.posts) {
    console.log(`🌱 Creating ${options.posts} posts...`)
    for (let i = 0; i < parseInt(options.posts); i++) {
      await createPost()
    }
  } else {
    console.log("🌱 Seeding default scenario (test)...")
    await seedTest()
  }

  console.log("✅ Seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

### package.json Scripts

```json
{
  "scripts": {
    "db:seed": "tsx prisma/seed/orchestrator.ts",
    "db:seed:all": "tsx prisma/seed/orchestrator.ts --all",
    "db:seed:dev": "tsx prisma/seed/scenarios/development.ts",
    "db:seed:test": "tsx prisma/seed/scenarios/test.ts",
    "db:seed:demo": "tsx prisma/seed/scenarios/demo.ts",
    "db:reset": "prisma migrate reset --force"
  }
}
```

---

### Usage Examples

```bash
# Seed everything (development scenario)
pnpm db:seed --all

# Seed specific models
pnpm db:seed --users=10
pnpm db:seed --posts=50
pnpm db:seed --organizations=5

# Seed specific scenario
pnpm db:seed --scenario=demo

# Compose seeds
pnpm db:seed --users=10 --posts=50

# Reset and seed
pnpm db:reset && pnpm db:seed --all
```

---

## Deterministic Seeding (for Tests)

### Set Faker Seed

```typescript
// __tests__/factories/setup.ts
import { faker } from "@faker-js/faker"

// Set seed for consistent results
faker.seed(12345)

// Now all faker calls return same values across runs
const user = await createUser()
// Always: email: "Aaliyah_Metz@yahoo.com", firstName: "Aaliyah", etc.
```

**Why Deterministic**:
- Tests are reproducible
- Easier to debug failures
- Snapshots don't change on every run

---

### Test-Specific Factories

```typescript
// __tests__/helpers/test-factories.ts
import { faker } from "@faker-js/faker"
import { createUser, createPost } from "@/prisma/seed/factories"

// Set deterministic seed for tests
faker.seed(12345)

export async function createTestUser(overrides = {}) {
  return createUser({
    emailVerified: true, // Always verified in tests
    ...overrides,
  })
}

export async function createTestPost(overrides = {}) {
  return createPost({
    published: true, // Always published in tests
    ...overrides,
  })
}
```

**Usage in Tests**:

```typescript
// __tests__/api/posts.test.ts
import { createTestUser, createTestPost } from "../helpers/test-factories"

describe("POST /api/posts", () => {
  it("creates a post", async () => {
    const user = await createTestUser()
    const post = await createTestPost({ authorId: user.id })

    expect(post.author.id).toBe(user.id)
  })
})
```

---

## Cleanup Utilities

### Database Reset

```typescript
// prisma/seed/utils/cleanup.ts
import { prisma } from "@/lib/prisma"

export async function cleanDatabase() {
  // Delete in correct order to respect foreign keys
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  console.log("🧹 Database cleaned")
}

// Delete all except platform organization
export async function cleanDatabaseExceptPlatform() {
  const platformOrg = await prisma.organization.findFirst({
    where: { slug: "platform" },
  })

  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.member.deleteMany({
    where: { organizationId: { not: platformOrg?.id } },
  })
  await prisma.organization.deleteMany({
    where: { id: { not: platformOrg?.id } },
  })
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  console.log("🧹 Database cleaned (kept platform org)")
}
```

**Usage**:

```typescript
// Before seeding
await cleanDatabase()
await seedDevelopment()
```

---

## Platform Organization Utility

For multi-tenant apps, ensure platform organization exists:

```typescript
// prisma/seed/utils/platform-org.ts
import { prisma } from "@/lib/prisma"

export async function ensurePlatformOrganization() {
  const existingOrg = await prisma.organization.findFirst({
    where: { slug: "platform" },
  })

  if (existingOrg) {
    return existingOrg
  }

  return prisma.organization.create({
    data: {
      name: "Platform",
      slug: "platform",
      metadata: { isPlatform: true },
    },
  })
}

export async function createPlatformAdmin() {
  const platformOrg = await ensurePlatformOrganization()

  const admin = await createUser({
    email: "admin@example.com",
    role: "admin",
  })

  await prisma.member.create({
    data: {
      userId: admin.id,
      organizationId: platformOrg.id,
      role: "owner",
    },
  })

  return admin
}
```

---

## Scenario Examples

### Development Scenario

Rich data for local development:

```typescript
// prisma/seed/scenarios/development.ts
import { cleanDatabase } from "../utils/cleanup"
import { ensurePlatformOrganization, createPlatformAdmin } from "../utils/platform-org"
import * as factories from "../factories"

export async function seedDevelopment() {
  await cleanDatabase()

  console.log("🌱 Creating platform organization...")
  await ensurePlatformOrganization()
  await createPlatformAdmin()

  console.log("🌱 Creating users...")
  const users = await Promise.all([
    factories.createUser({ email: "alice@example.com", firstName: "Alice" }),
    factories.createUser({ email: "bob@example.com", firstName: "Bob" }),
    factories.createUser({ email: "carol@example.com", firstName: "Carol" }),
  ])

  console.log("🌱 Creating organizations...")
  const org1 = await factories.createOrganization({ name: "Tech Startup" })
  const org2 = await factories.createOrganization({ name: "Marketing Agency" })

  console.log("🌱 Creating memberships...")
  await factories.createMember({
    userId: users[0].id,
    organizationId: org1.id,
    role: "owner",
  })
  await factories.createMember({
    userId: users[1].id,
    organizationId: org1.id,
    role: "member",
  })

  console.log("🌱 Creating posts...")
  for (let i = 0; i < 20; i++) {
    await factories.createPost({
      authorId: users[i % users.length].id,
      published: Math.random() > 0.3, // 70% published
    })
  }

  console.log("✅ Development seed complete!")
}
```

---

### Test Scenario

Minimal data for CI/CD tests:

```typescript
// prisma/seed/scenarios/test.ts
import { cleanDatabase } from "../utils/cleanup"
import * as factories from "../factories"

export async function seedTest() {
  await cleanDatabase()

  // Minimal data for tests
  const user = await factories.createUser({
    email: "test@example.com",
  })

  const post = await factories.createPost({
    authorId: user.id,
    published: true,
  })

  console.log("✅ Test seed complete!")
  return { user, post }
}
```

---

### Demo Scenario

Polished data for presentations:

```typescript
// prisma/seed/scenarios/demo.ts
import { cleanDatabase } from "../utils/cleanup"
import * as factories from "../factories"

export async function seedDemo() {
  await cleanDatabase()

  // Create demo user with specific data
  const demoUser = await factories.createUser({
    email: "demo@example.com",
    firstName: "Demo",
    lastName: "User",
    image: "https://i.pravatar.cc/150?img=12",
  })

  // Create polished demo posts
  await factories.createPost({
    authorId: demoUser.id,
    title: "Welcome to Our Platform",
    content: "This is a demo post showcasing our platform's capabilities.",
    published: true,
  })

  console.log("✅ Demo seed complete!")
}
```

---

## Usage in Tests

### Jest Test with Factory

```typescript
// __tests__/api/posts.test.ts
import { createTestUser, createTestPost } from "../helpers/test-factories"
import { cleanDatabase } from "@/prisma/seed/utils/cleanup"

beforeEach(async () => {
  await cleanDatabase()
})

describe("GET /api/posts", () => {
  it("returns published posts", async () => {
    const user = await createTestUser()

    await createTestPost({
      authorId: user.id,
      published: true,
      title: "Published Post",
    })

    await createTestPost({
      authorId: user.id,
      published: false,
      title: "Draft Post",
    })

    const response = await fetch("/api/posts")
    const posts = await response.json()

    expect(posts).toHaveLength(1)
    expect(posts[0].title).toBe("Published Post")
  })
})
```

---

### Playwright E2E Test with Seed

```typescript
// e2e/posts.spec.ts
import { test, expect } from "@playwright/test"
import { seedTest } from "@/prisma/seed/scenarios/test"

test.beforeEach(async () => {
  // Seed database before each test
  await seedTest()
})

test("user can create a post", async ({ page }) => {
  await page.goto("/login")
  await page.fill('input[name="email"]', "test@example.com")
  await page.click('button[type="submit"]')

  await page.goto("/posts/new")
  await page.fill('input[name="title"]', "My E2E Post")
  await page.fill('textarea[name="content"]', "This is a test post.")
  await page.click('button[type="submit"]')

  await expect(page.locator("text=My E2E Post")).toBeVisible()
})
```

---

## Storybook Integration

Use factories to generate component data:

```typescript
// components/PostCard.stories.tsx
import { Meta, StoryObj } from "@storybook/react"
import { PostCard } from "./PostCard"
import { createUser, createPost } from "@/prisma/seed/factories"
import { faker } from "@faker-js/faker"

faker.seed(12345) // Deterministic

const meta: Meta<typeof PostCard> = {
  component: PostCard,
}

export default meta

type Story = StoryObj<typeof PostCard>

// Use factories in Storybook
export const Default: Story = {
  args: {
    post: await createPost({ published: true }),
  },
}

export const Draft: Story = {
  args: {
    post: await createPost({ published: false }),
  },
}
```

---

## Best Practices

### ✅ Do

- Create one factory per model
- Use Faker for realistic random data
- Provide override parameters for all fields
- Handle foreign key dependencies in factories
- Use deterministic seeds in tests
- Clean database before seeding
- Create named scenarios for common use cases
- Use factories in tests, seed scripts, and Storybook

### ❌ Don't

- Create monolithic seed scripts
- Hardcode all data (use Faker for variety)
- Ignore foreign key constraints
- Seed production database (only dev/test)
- Commit `.env` with production credentials
- Skip cleanup utilities (leads to test pollution)

---

## Benefits

### Positive Consequences

- **Testability**: Create exact scenarios needed for specific tests
- **Maintainability**: Each factory in one file, easy to update
- **Composability**: Build complex scenarios from simple factories
- **Reusability**: Factories used in tests, seed scripts, and Storybook
- **Deterministic**: Faker generates consistent data with fixed seeds
- **Fast Iteration**: Seed only what you need for current task
- **Documentation**: Scenarios serve as usage examples

### Negative Consequences

- **Initial Effort**: Must create factory for each model
- **Relationship Management**: Must ensure foreign key constraints satisfied
- **Data Volume**: Large seeds still take time to generate

---

## Alternatives Considered

### Monolithic Seed Scripts

**Rejected**:
- Cannot seed individual models
- Difficult to create specific test scenarios
- Hard to maintain as models evolve

### SQL Fixtures

**Rejected**:
- Brittle (breaks when schema changes)
- Difficult to maintain relationships
- No type safety

### Snapshot/Restore Strategy

**Rejected**:
- Large database dumps
- Slow restore times
- Difficult to version control
- Not composable

---

## Related Documentation

- **Testing Pyramid**: `docs/domains/testing/testing-pyramid.md` (uses factories)
- **Database**: `docs/DATABASE.md` (schema and migrations)

---

## External Resources

- [Faker.js Documentation](https://fakerjs.dev/)
- [Prisma Seeding](https://www.prisma.io/docs/guides/migrate/seed-database)
- [Factory Pattern](https://refactoring.guru/design-patterns/factory-method)

---

**Key Takeaway**: **Build complex test scenarios from simple, independent factory functions. Use Faker for realistic data, compose factories for scenarios, and leverage deterministic seeds for tests.**
