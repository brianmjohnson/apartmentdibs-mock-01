# Upstash CLI Skill

Provides access to Upstash Redis and Kafka management via the Upstash CLI.

## Overview

The Upstash CLI allows you to manage Upstash Redis databases, Kafka clusters, and QStash queues directly from the command line.

**Documentation**: https://upstash.com/docs/devops/cli/overview

## Prerequisites

### CLI Installation

The Upstash CLI is automatically installed via `scripts/install-cli-tools.sh` during session startup.

**Manual Installation** (if needed):

```bash
npm install -g @upstash/cli
```

### Authentication

Upstash CLI requires two environment variables for authentication:

**Required Environment Variables**:

```env
UPSTASH_EMAIL="your-email@example.com"    # The email you use on upstash.com
UPSTASH_API_KEY="your-api-key-here"       # API key from upstash.com dashboard
```

**How to Get API Key**:

1. Log in to https://console.upstash.com
2. Go to Account → API Keys
3. Create a new API key
4. Copy the key and set `UPSTASH_API_KEY` environment variable

**Check Authentication Status**:

```bash
upstash auth whoami
```

Expected output when authenticated:

```
Email: your-email@example.com
Team: your-team-name
```

---

## Common Commands

### Authentication

```bash
# Check current authentication status
upstash auth whoami

# Login interactively (if environment variables not set)
upstash auth login
```

### Redis Management

```bash
# List all Redis databases
upstash redis list

# Create a new Redis database
upstash redis create --name my-redis-db --region global

# Get database details
upstash redis get <database-id>

# Delete a database
upstash redis delete <database-id>

# Get database connection info
upstash redis connection <database-id>
```

### Using redis-cli with Upstash Redis

Upstash Redis is fully compatible with the standard Redis CLI tool (`redis-cli`). You can use any Redis-compatible client to interact with Upstash databases.

**Install redis-cli** (if not already installed):

```bash
# macOS
brew install redis

# Ubuntu/Debian
sudo apt-get install redis-tools

# Check installation
redis-cli --version
```

**Connect to Upstash Redis**:

Upstash provides a connection URL that includes authentication. There are two recommended ways to connect:

**Method 1: Using REDISCLI_AUTH environment variable** (cleaner, no credentials in command line):

```bash
# Set authentication token (from Upstash console)
export REDISCLI_AUTH="your-upstash-token-here"

# Connect using host and port (credentials from environment)
redis-cli -h your-db.upstash.io -p 6379 --tls
```

**Method 2: Using full connection URL**:

```bash
# Set connection URL with embedded credentials
export UPSTASH_REDIS_REST_URL="redis://default:your-token@your-db.upstash.io:6379"

# Connect using URL
redis-cli -u $UPSTASH_REDIS_REST_URL
```

**Recommended: Method 1** (using `REDISCLI_AUTH`) keeps credentials out of command history and process lists.

**Example Session**:

```bash
# Set authentication token from Upstash console
export REDISCLI_AUTH="AYfgASQgYjM1NjYwNmItZDU5Ny00YmQ2LWJmNGMtOWYzMzk3NmQ5MTc2..."

# Connect
redis-cli -h your-db.upstash.io -p 6379 --tls

# Once connected, use standard Redis commands
your-db.upstash.io:6379> SET mykey "Hello World"
OK
your-db.upstash.io:6379> GET mykey
"Hello World"
your-db.upstash.io:6379> KEYS *
1) "mykey"
your-db.upstash.io:6379> DEL mykey
(integer) 1
your-db.upstash.io:6379> EXIT
```

**Common redis-cli Operations**:

```bash
# Execute a single command (non-interactive)
redis-cli -u $UPSTASH_REDIS_REST_URL GET mykey

# Execute multiple commands from a file
redis-cli -u $UPSTASH_REDIS_REST_URL < redis-commands.txt

# Export all keys to a file
redis-cli -u $UPSTASH_REDIS_REST_URL KEYS '*' > all-keys.txt

# Flush all data (DANGEROUS - use with caution!)
redis-cli -u $UPSTASH_REDIS_REST_URL FLUSHALL

# Monitor real-time commands (debugging)
redis-cli -u $UPSTASH_REDIS_REST_URL MONITOR

# Get database info and stats
redis-cli -u $UPSTASH_REDIS_REST_URL INFO

# Benchmark performance
redis-cli -u $UPSTASH_REDIS_REST_URL --intrinsic-latency 100
```

**Using Other Redis Tools**:

Since Upstash Redis is protocol-compatible, you can use any Redis client library or tool:

- **RedisInsight**: Official Redis GUI (https://redis.com/redis-enterprise/redis-insight/)
- **redis-py**: Python client
- **ioredis**: Node.js client
- **@upstash/redis**: Official Upstash SDK (REST-based, optimized for serverless)

**See Also**: [Redis CLI Documentation](https://redis.io/docs/latest/develop/tools/cli/)

### Kafka Management

```bash
# List all Kafka clusters
upstash kafka cluster list

# Create a new Kafka cluster
upstash kafka cluster create --name my-kafka-cluster --region us-east-1

# List topics in a cluster
upstash kafka topic list --cluster <cluster-id>

# Create a topic
upstash kafka topic create --cluster <cluster-id> --name my-topic --partitions 1 --retention-time 604800000
```

### QStash Management

```bash
# List QStash queues
upstash qstash queue list

# Create a queue
upstash qstash queue create --name my-queue

# Publish a message
upstash qstash publish --url https://example.com/webhook --body '{"event": "test"}'
```

---

## Usage Examples

### Example 1: Create Redis Database for Development

```bash
# Create a global Redis database for caching
upstash redis create \
  --name "myapp-cache-dev" \
  --region global \
  --eviction true \
  --tls true

# Get connection string
upstash redis connection <database-id>
```

### Example 2: List All Resources

```bash
# Get overview of all Upstash resources
echo "Redis Databases:"
upstash redis list

echo "\nKafka Clusters:"
upstash kafka cluster list

echo "\nQStash Queues:"
upstash qstash queue list
```

### Example 3: Cleanup Test Databases

```bash
# Delete all Redis databases with "test" in the name
upstash redis list --format json | \
  jq -r '.[] | select(.database_name | contains("test")) | .database_id' | \
  xargs -I {} upstash redis delete {}
```

---

## Integration with Project

### Environment Variable Setup

Add to `.env.local` (not committed to git):

```env
UPSTASH_EMAIL="your-email@example.com"
UPSTASH_API_KEY="your-api-key-here"

# Redis connection (after creating database)
UPSTASH_REDIS_REST_URL="https://your-redis-db.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

Add placeholders to `.env.example`:

```env
# Upstash CLI (for database management)
UPSTASH_EMAIL="<your upstash account email>"
UPSTASH_API_KEY="<your upstash api key from console>"

# Upstash Redis (for application runtime)
UPSTASH_REDIS_REST_URL="<redis rest url from upstash console>"
UPSTASH_REDIS_REST_TOKEN="<redis rest token from upstash console>"
```

### Vercel Integration

For Vercel deployments, add environment variables in the Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
3. Select Production, Preview, Development environments

---

## Common Use Cases

### Use Case 1: Session Storage (Redis)

Create a Redis database for Next.js session storage:

```bash
# Create database
upstash redis create --name "myapp-sessions" --region global --tls true

# Get connection details
upstash redis connection <database-id>

# Copy UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local
```

### Use Case 2: Rate Limiting (Redis)

Create a Redis database for API rate limiting:

```bash
# Create database with eviction enabled
upstash redis create \
  --name "myapp-ratelimit" \
  --region global \
  --eviction true \
  --max-data-size 1000

# Use with @upstash/ratelimit package in Next.js
```

### Use Case 3: Event Streaming (Kafka)

Create a Kafka cluster for event-driven architecture:

```bash
# Create cluster
upstash kafka cluster create --name "myapp-events" --region us-east-1

# Create topics
upstash kafka topic create --cluster <cluster-id> --name "user-events" --partitions 3
upstash kafka topic create --cluster <cluster-id> --name "audit-events" --partitions 1
```

---

## Troubleshooting

### CLI Not Found

```bash
# Reinstall globally
npm install -g @upstash/cli

# Verify installation
which upstash
upstash --version
```

### Authentication Failed

```bash
# Check environment variables are set
echo $UPSTASH_EMAIL
echo $UPSTASH_API_KEY

# Verify credentials
upstash auth whoami

# If fails, re-login interactively
upstash auth login
```

### Command Not Working

```bash
# Check CLI version
upstash --version

# Update to latest version
npm update -g @upstash/cli

# Check Upstash service status
# Visit https://status.upstash.com
```

---

## Best Practices

1. **Environment Variables**: Always use environment variables for credentials, never hardcode
2. **Naming Convention**: Use descriptive names with environment suffix (e.g., `myapp-cache-prod`)
3. **Resource Cleanup**: Regularly delete unused test databases to avoid costs
4. **TLS**: Always enable TLS for production databases (`--tls true`)
5. **Regions**: Choose region closest to your users for lowest latency
6. **Eviction**: Enable eviction for caching use cases, disable for persistent data

---

## See Also

- **Upstash CLI Documentation**: https://upstash.com/docs/devops/cli/overview
- **Upstash Redis Documentation**: https://upstash.com/docs/redis
- **Upstash Kafka Documentation**: https://upstash.com/docs/kafka
- **Upstash QStash Documentation**: https://upstash.com/docs/qstash
- **Next.js + Upstash Guide**: https://upstash.com/docs/redis/howto/nextjsappdir

---

**Installation Status**: ✅ Automatically installed via `scripts/install-cli-tools.sh`
**Authentication**: Requires `UPSTASH_EMAIL` and `UPSTASH_API_KEY` environment variables
**Skill Type**: Infrastructure management, database provisioning, CLI automation
