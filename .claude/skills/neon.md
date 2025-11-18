# Neon PostgreSQL Skill

Provides access to Neon serverless PostgreSQL database management via Neon CLI and standard PostgreSQL tools.

## Overview

Neon is a serverless PostgreSQL platform. Since Neon is **fully PostgreSQL-compatible**, you can use any standard PostgreSQL client or tool to interact with your database.

**Neon Documentation**: https://neon.tech/docs

## Prerequisites

### CLI Installation

The Neon CLI (`neonctl`) is automatically installed via `scripts/install-cli-tools.sh` during session startup.

**Manual Installation** (if needed):
```bash
# Via pnpm (recommended)
pnpm add -g neonctl

# Via npm
npm install -g neonctl
```

### Authentication

Neon CLI requires an API key for authentication:

**Required Environment Variable**:
```env
NEON_API_KEY="your-api-key-here"    # API key from Neon console
```

**How to Get API Key**:
1. Log in to https://console.neon.tech
2. Go to Account Settings → API Keys
3. Create a new API key
4. Copy the key and set `NEON_API_KEY` environment variable

**Check Authentication Status**:
```bash
neonctl auth
```

---

## Using Standard PostgreSQL Tools with Neon

**Neon is PostgreSQL** - you can use any PostgreSQL client tool to connect to your Neon database.

### Connection String Format

Neon provides two types of connection strings:

**1. Pooled Connection** (recommended for applications):
```
postgresql://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/mydb?sslmode=require&pgbouncer=true
```

**2. Direct Connection** (recommended for migrations, admin tasks):
```
postgresql://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/mydb?sslmode=require
```

### Using psql (PostgreSQL CLI)

`psql` is the standard PostgreSQL command-line client. Use it for interactive database queries, administration, and debugging.

**Install psql**:
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Check installation
psql --version
```

**Connect to Neon Database**:

```bash
# Using connection string from environment variable
psql $DATABASE_URL_UNPOOLED

# Or specify directly
psql "postgresql://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/mydb?sslmode=require"
```

**Example Session**:
```bash
# Set environment variable (from .env.local)
export DATABASE_URL_UNPOOLED="postgresql://user:pass@ep-xxx.neon.tech/mydb?sslmode=require"

# Connect
psql $DATABASE_URL_UNPOOLED

# Once connected, use standard SQL commands
mydb=> \dt                     -- List all tables
mydb=> SELECT * FROM users;    -- Query data
mydb=> \d users               -- Describe table structure
mydb=> \l                      -- List all databases
mydb=> \dn                     -- List schemas
mydb=> \q                      -- Quit
```

**Common psql Operations**:

```bash
# Execute a single query (non-interactive)
psql $DATABASE_URL_UNPOOLED -c "SELECT COUNT(*) FROM users;"

# Execute SQL from a file
psql $DATABASE_URL_UNPOOLED -f migration.sql

# Export query results to CSV
psql $DATABASE_URL_UNPOOLED -c "SELECT * FROM users;" --csv > users.csv

# Execute query and format output
psql $DATABASE_URL_UNPOOLED -c "SELECT * FROM users;" --expanded

# Get database size
psql $DATABASE_URL_UNPOOLED -c "SELECT pg_size_pretty(pg_database_size(current_database()));"

# List all tables with row counts
psql $DATABASE_URL_UNPOOLED -c "
  SELECT schemaname,tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_live_tup AS rows
  FROM pg_stat_user_tables
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

**Useful psql Meta-Commands**:

```sql
\dt                  -- List all tables
\dt+                 -- List tables with sizes
\d table_name        -- Describe table structure
\di                  -- List indexes
\dv                  -- List views
\df                  -- List functions
\l                   -- List databases
\dn                  -- List schemas
\du                  -- List roles/users
\x                   -- Toggle expanded output (vertical)
\timing              -- Toggle query timing
\?                   -- Help on psql commands
\h SELECT            -- Help on SQL commands
```

### Using pg_dump (Database Backup)

Export your Neon database to a SQL file:

```bash
# Full database dump
pg_dump $DATABASE_URL_UNPOOLED > backup.sql

# Dump with compression
pg_dump $DATABASE_URL_UNPOOLED | gzip > backup.sql.gz

# Dump specific tables only
pg_dump $DATABASE_URL_UNPOOLED -t users -t sessions > users_backup.sql

# Dump schema only (no data)
pg_dump $DATABASE_URL_UNPOOLED --schema-only > schema.sql

# Dump data only (no schema)
pg_dump $DATABASE_URL_UNPOOLED --data-only > data.sql

# Dump in custom format (for pg_restore)
pg_dump $DATABASE_URL_UNPOOLED -Fc > backup.dump
```

### Using pg_restore (Database Restore)

Restore from a pg_dump backup:

```bash
# Restore from SQL file
psql $DATABASE_URL_UNPOOLED < backup.sql

# Restore from compressed SQL
gunzip -c backup.sql.gz | psql $DATABASE_URL_UNPOOLED

# Restore from custom format dump
pg_restore -d $DATABASE_URL_UNPOOLED backup.dump

# Restore specific tables only
pg_restore -d $DATABASE_URL_UNPOOLED -t users backup.dump
```

### Using pgcli (Enhanced PostgreSQL CLI)

`pgcli` is a modern PostgreSQL CLI with auto-completion and syntax highlighting.

**Install pgcli**:
```bash
pip install pgcli
```

**Connect to Neon**:
```bash
pgcli $DATABASE_URL_UNPOOLED
```

**Features**:
- Auto-completion for SQL keywords, table names, column names
- Syntax highlighting
- Multi-line queries with `\e` to open editor
- Query history with arrow keys
- Pretty-printed table output

### Using GUI Tools

Any PostgreSQL GUI tool works with Neon:

**Popular Options**:
- **pgAdmin**: https://www.pgadmin.org/
- **DBeaver**: https://dbeaver.io/
- **TablePlus**: https://tableplus.com/
- **Postico** (macOS): https://eggerapps.at/postico/
- **DataGrip** (JetBrains): https://www.jetbrains.com/datagrip/

**Connection Settings**:
- Host: Extract from connection string (e.g., `ep-cool-darkness-123456.us-east-2.aws.neon.tech`)
- Port: `5432`
- Database: Extract from connection string (e.g., `mydb`)
- Username: Extract from connection string
- Password: Extract from connection string
- SSL Mode: **Require** (always use SSL with Neon)

---

## Neon CLI (neonctl) Commands

While you can use standard PostgreSQL tools for database operations, `neonctl` is useful for **infrastructure management** (projects, branches, compute).

### Project Management

```bash
# List all projects
neonctl projects list

# Get current project details
neonctl projects get

# Create a new project
neonctl projects create --name "my-new-project" --region-id aws-us-east-2
```

### Branch Management (Neon-Specific Feature)

Neon supports **database branching** - create instant copies of your database for development, testing, or CI/CD.

```bash
# List all branches
neonctl branches list

# Create a new branch from main
neonctl branches create --name dev-branch

# Create a branch from a specific point in time
neonctl branches create --name staging --parent main --timestamp "2025-01-01T00:00:00Z"

# Delete a branch
neonctl branches delete dev-branch

# Get branch connection string
neonctl connection-string --branch dev-branch
```

### Compute Management

```bash
# List compute endpoints
neonctl compute list

# Start a compute endpoint
neonctl compute start <compute-id>

# Stop a compute endpoint (to save costs)
neonctl compute stop <compute-id>
```

---

## Common Use Cases

### Use Case 1: Database Migrations

Use `psql` for running migrations:

```bash
# Run Prisma migration manually
psql $DATABASE_URL_UNPOOLED -f prisma/migrations/20250116_init/migration.sql

# Or use Prisma CLI (which uses the connection string)
pnpm prisma migrate deploy
```

### Use Case 2: Database Backup/Restore

```bash
# Backup production database
pg_dump $DATABASE_URL_UNPOOLED > backup-$(date +%Y%m%d).sql

# Restore to a different Neon branch
psql $DEV_DATABASE_URL < backup-20250116.sql
```

### Use Case 3: Query Debugging

```bash
# Use psql to debug a slow query
psql $DATABASE_URL_UNPOOLED

mydb=> EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';
mydb=> \d users  -- Check if index exists on email column
```

### Use Case 4: Data Export for Analytics

```bash
# Export user data to CSV for analysis
psql $DATABASE_URL_UNPOOLED -c "
  SELECT id, email, created_at, role
  FROM users
  WHERE created_at > NOW() - INTERVAL '30 days'
" --csv > recent_users.csv
```

### Use Case 5: Database Branching for Development

```bash
# Create a dev branch from production
neonctl branches create --name dev --parent main

# Get connection string for dev branch
neonctl connection-string --branch dev

# Use dev database in local development
export DATABASE_URL="<dev-branch-connection-string>"
pnpm dev
```

---

## Integration with Project

### Environment Variables

Add to `.env.local` (not committed to git):
```env
# Neon API Key (for neonctl CLI)
NEON_API_KEY="your-neon-api-key"

# Database Connections
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/mydb?sslmode=require&pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://user:pass@ep-xxx.neon.tech/mydb?sslmode=require"
```

Add placeholders to `.env.example`:
```env
# Neon CLI (for database management)
NEON_API_KEY="<your neon api key from console>"

# Neon Database (for application runtime)
DATABASE_URL="<pooled connection string from neon console>"
DATABASE_URL_UNPOOLED="<direct connection string from neon console>"
```

### Prisma Integration

Neon works seamlessly with Prisma:

```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")           // Pooled connection for app
  directUrl = env("DATABASE_URL_UNPOOLED") // Direct connection for migrations
}
```

---

## Neon-Specific Features

Unlike other PostgreSQL providers, Neon offers unique features:

### 1. Database Branching

Create instant, copy-on-write branches of your database:

```bash
# Create a branch for feature development
neonctl branches create --name feature-auth

# Each branch has its own connection string
neonctl connection-string --branch feature-auth

# Delete branch when done
neonctl branches delete feature-auth
```

**Use Cases**:
- Isolated development environments
- CI/CD test databases
- Staging environments
- Point-in-time recovery

### 2. Auto-Scaling Compute

Neon automatically scales compute up/down based on load and can scale to zero when inactive.

```bash
# Configure auto-suspend (default: 5 minutes)
neonctl compute update --auto-suspend-delay 300
```

### 3. Point-in-Time Restore

Restore your database to any point in the last 7-30 days (depending on plan):

```bash
# Create a branch from a specific timestamp
neonctl branches create --name restore-point --timestamp "2025-01-15T14:30:00Z"
```

---

## Troubleshooting

### Connection Refused

```bash
# Check if DATABASE_URL is set correctly
echo $DATABASE_URL

# Verify SSL mode is set (required for Neon)
# Connection string must include: ?sslmode=require

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### SSL/TLS Errors

Neon requires SSL. Ensure your connection string includes `sslmode=require`:

```bash
# ✅ Correct
postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require

# ❌ Wrong (will fail)
postgresql://user:pass@ep-xxx.neon.tech/db
```

### Pooled vs Direct Connection

- **Pooled** (`pgbouncer=true`): Use for application runtime (Next.js, tRPC)
- **Direct** (no `pgbouncer`): Use for migrations, admin tasks, pg_dump

```bash
# Migrations: Use direct connection
psql $DATABASE_URL_UNPOOLED -f migration.sql

# Admin queries: Use direct connection
psql $DATABASE_URL_UNPOOLED -c "CREATE INDEX idx_email ON users(email);"

# Application: Use pooled connection (automatic via Prisma)
```

---

## Best Practices

1. **Use Direct Connection for Admin**: Migrations, schema changes, and pg_dump require direct connection
2. **Use Pooled Connection for App**: Application runtime should use pooled connection for better performance
3. **Always Use SSL**: Neon requires `sslmode=require` in connection strings
4. **Leverage Branching**: Create branches for development, testing, and feature work
5. **Regular Backups**: Use `pg_dump` for backups, even though Neon has point-in-time restore
6. **Monitor Compute**: Check Neon console for compute usage and auto-scaling behavior

---

## See Also

- **Neon Documentation**: https://neon.tech/docs
- **Neon CLI Reference**: https://neon.tech/docs/reference/cli
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **psql Documentation**: https://www.postgresql.org/docs/current/app-psql.html
- **Prisma + Neon Guide**: https://www.prisma.io/docs/guides/database/neon

---

**Installation Status**: ✅ Neon CLI automatically installed via `scripts/install-cli-tools.sh`
**PostgreSQL Tools**: Use standard tools (psql, pg_dump, pg_restore, pgAdmin, etc.)
**Authentication**: Requires `NEON_API_KEY` for CLI, connection strings for database access
**Skill Type**: Database management, infrastructure provisioning, PostgreSQL administration
