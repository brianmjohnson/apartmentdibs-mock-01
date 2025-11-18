# Stripe CLI Skill

Provides access to Stripe payment and subscription management via the Stripe CLI.

## Overview

The Stripe CLI allows you to interact with your Stripe account, manage customers, subscriptions, invoices, and payment methods directly from the command line.

**Documentation**: https://stripe.com/docs/stripe-cli

## Prerequisites

### CLI Installation

The Stripe CLI can be installed via package managers or direct download.

**Installation Methods**:

```bash
# macOS (Homebrew)
brew install stripe/stripe-cli/stripe

# Linux (via download)
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe

# Windows (via Scoop)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Or download binary directly
# Visit: https://github.com/stripe/stripe-cli/releases/latest
```

**Verify Installation**:
```bash
stripe --version
```

### Authentication

Stripe CLI requires API keys for authentication:

**Required Environment Variable**:
```env
STRIPE_API_KEY="sk_test_..."    # Secret key from Stripe Dashboard
```

**How to Get API Key**:
1. Log in to https://dashboard.stripe.com
2. Go to Developers → API Keys
3. Copy the "Secret key" (starts with `sk_test_` for test mode, `sk_live_` for production)
4. Set `STRIPE_API_KEY` environment variable

**Login to Stripe CLI**:
```bash
# Interactive login (recommended for local development)
stripe login

# Or authenticate with API key directly
stripe listen --api-key sk_test_...
```

**Check Authentication Status**:
```bash
stripe config --list
```

---

## Common Commands

### Customer Management

```bash
# List all customers
stripe customers list --limit 10

# Get customer details
stripe customers retrieve cus_xxxxx

# Create a new customer
stripe customers create \
  --email user@example.com \
  --name "John Doe" \
  --description "User ID: usr_12345"

# Update customer
stripe customers update cus_xxxxx \
  --email newemail@example.com

# Delete customer
stripe customers delete cus_xxxxx

# Search customers by email
stripe customers list --email user@example.com
```

### Subscription Management

```bash
# List all subscriptions
stripe subscriptions list --limit 10

# Get subscription details
stripe subscriptions retrieve sub_xxxxx

# List subscriptions for a customer
stripe subscriptions list --customer cus_xxxxx

# Cancel subscription
stripe subscriptions cancel sub_xxxxx

# Cancel subscription at period end
stripe subscriptions update sub_xxxxx \
  --cancel-at-period-end true

# Reactivate canceled subscription
stripe subscriptions update sub_xxxxx \
  --cancel-at-period-end false

# Update subscription (change plan)
stripe subscriptions update sub_xxxxx \
  --items[0][price]=price_xxxxx
```

### Payment & Charge Management

```bash
# List recent charges
stripe charges list --limit 10

# Get charge details
stripe charges retrieve ch_xxxxx

# List charges for a customer
stripe charges list --customer cus_xxxxx

# Refund a charge
stripe refunds create --charge ch_xxxxx

# Partial refund
stripe refunds create \
  --charge ch_xxxxx \
  --amount 500  # Amount in cents
```

### Invoice Management

```bash
# List invoices
stripe invoices list --limit 10

# Get invoice details
stripe invoices retrieve in_xxxxx

# List invoices for customer
stripe invoices list --customer cus_xxxxx

# Finalize draft invoice
stripe invoices finalize in_xxxxx

# Pay invoice manually
stripe invoices pay in_xxxxx

# Void invoice
stripe invoices void in_xxxxx
```

### Payment Method Management

```bash
# List payment methods for customer
stripe payment_methods list \
  --customer cus_xxxxx \
  --type card

# Attach payment method to customer
stripe payment_methods attach pm_xxxxx \
  --customer cus_xxxxx

# Detach payment method
stripe payment_methods detach pm_xxxxx

# Set default payment method
stripe customers update cus_xxxxx \
  --invoice_settings[default_payment_method]=pm_xxxxx
```

### Webhook Management

```bash
# Listen for webhook events (for local development)
stripe listen

# Forward events to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# List webhook endpoints
stripe webhook_endpoints list

# Create webhook endpoint
stripe webhook_endpoints create \
  --url https://example.com/api/webhooks/stripe \
  --enabled-events payment_intent.succeeded,customer.subscription.deleted
```

---

## Usage Examples

### Example 1: Troubleshoot Failed Payment

```bash
# 1. Find customer by email
CUSTOMER_ID=$(stripe customers list --email user@example.com | jq -r '.data[0].id')

# 2. Check recent charges
stripe charges list --customer $CUSTOMER_ID --limit 5

# 3. Check subscription status
stripe subscriptions list --customer $CUSTOMER_ID

# 4. View payment methods on file
stripe payment_methods list --customer $CUSTOMER_ID --type card
```

### Example 2: Manually Refund Customer

```bash
# 1. Find charge ID
stripe charges list --customer cus_xxxxx --limit 10

# 2. Create refund
stripe refunds create --charge ch_xxxxx

# 3. Verify refund
stripe refunds retrieve re_xxxxx
```

### Example 3: Cancel Subscription Gracefully

```bash
# Cancel at end of current period (no immediate loss of access)
stripe subscriptions update sub_xxxxx --cancel-at-period-end true

# Verify cancellation scheduled
stripe subscriptions retrieve sub_xxxxx | jq '.cancel_at_period_end'
```

### Example 4: Reactivate Canceled Subscription

```bash
# Remove cancellation
stripe subscriptions update sub_xxxxx --cancel-at-period-end false

# Or create new subscription if already canceled
stripe subscriptions create \
  --customer cus_xxxxx \
  --items[0][price]=price_xxxxx
```

---

## Integration with Project

### Environment Variables

Add to `.env.local` (not committed to git):
```env
# Stripe API Keys
STRIPE_SECRET_KEY="sk_test_..."       # For backend API calls
STRIPE_PUBLISHABLE_KEY="pk_test_..."  # For frontend (public, safe to expose)
STRIPE_WEBHOOK_SECRET="whsec_..."     # For webhook signature verification

# Stripe CLI (for support/admin)
STRIPE_API_KEY="sk_test_..."          # Same as STRIPE_SECRET_KEY
```

Add placeholders to `.env.example`:
```env
# Stripe (Payment Processing)
STRIPE_SECRET_KEY="<secret key from stripe dashboard>"
STRIPE_PUBLISHABLE_KEY="<publishable key from stripe dashboard>"
STRIPE_WEBHOOK_SECRET="<webhook secret from stripe dashboard>"
```

### Better Auth + Stripe Integration

Stripe customer IDs are typically stored in the `User` model:

```zmodel
model User extends BaseModel {
  email String @unique

  // Stripe integration
  stripeCustomerId String? @unique
  stripeSubscriptionId String?

  @@allow('read', auth() == this)
  @@allow('update', auth() == this)
}
```

**Common Queries**:
```sql
-- Find user by Stripe customer ID
SELECT * FROM "User" WHERE "stripeCustomerId" = 'cus_xxxxx';

-- Find all users with active subscriptions
SELECT * FROM "User" WHERE "stripeSubscriptionId" IS NOT NULL;
```

---

## Troubleshooting

### CLI Not Found

```bash
# Reinstall via Homebrew (macOS)
brew install stripe/stripe-cli/stripe

# Verify installation
which stripe
stripe --version
```

### Authentication Failed

```bash
# Check environment variable is set
echo $STRIPE_API_KEY

# Re-login interactively
stripe login

# Verify credentials
stripe config --list
```

### Webhook Events Not Received

```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, trigger test event
stripe trigger payment_intent.succeeded

# Check webhook endpoint configuration
stripe webhook_endpoints list
```

### API Version Mismatch

Stripe CLI uses the latest API version by default. To use a specific version:

```bash
stripe charges list --stripe-version 2023-10-16
```

---

## Best Practices

1. **Use Test Mode First**: Always test with `sk_test_` keys before using `sk_live_` production keys
2. **Never Commit API Keys**: Keep `STRIPE_API_KEY` in `.env.local`, never commit to git
3. **Webhook Security**: Always verify webhook signatures using `STRIPE_WEBHOOK_SECRET`
4. **Customer Metadata**: Store your internal user ID in Stripe customer metadata for easy lookups
5. **Idempotency**: Use idempotency keys for critical operations to prevent duplicate charges
6. **Refund Policies**: Document refund policies clearly and automate where possible

---

## Common Support Workflows

### Workflow 1: Customer Can't Pay

1. Look up customer: `stripe customers list --email user@example.com`
2. Check subscription status: `stripe subscriptions list --customer cus_xxxxx`
3. Check payment methods: `stripe payment_methods list --customer cus_xxxxx --type card`
4. Review recent failed charges: `stripe charges list --customer cus_xxxxx --limit 10`
5. If card expired/declined, ask user to update payment method in app

### Workflow 2: Customer Requests Refund

1. Find customer: `stripe customers list --email user@example.com`
2. Find charge: `stripe charges list --customer cus_xxxxx`
3. Verify refund policy eligibility
4. Issue refund: `stripe refunds create --charge ch_xxxxx`
5. Confirm with customer: Email confirmation with refund ID

### Workflow 3: Subscription Didn't Cancel

1. Look up subscription: `stripe subscriptions list --customer cus_xxxxx`
2. Check `cancel_at_period_end` status
3. If `false`, user didn't cancel correctly - cancel now: `stripe subscriptions cancel sub_xxxxx`
4. If `true` but still charged, investigate invoice: `stripe invoices list --customer cus_xxxxx --limit 5`

---

## See Also

- **Stripe CLI Documentation**: https://stripe.com/docs/stripe-cli
- **Stripe API Reference**: https://stripe.com/docs/api
- **Stripe Testing**: https://stripe.com/docs/testing
- **Better Auth + Stripe**: (custom integration - see project docs)

---

**Installation Status**: Manual installation required via package manager
**Authentication**: Requires `STRIPE_API_KEY` environment variable or `stripe login`
**Skill Type**: Payment management, subscription billing, customer support

