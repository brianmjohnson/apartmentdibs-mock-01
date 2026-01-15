# PostHog Account Setup Guide

**Purpose**: One-time PostHog account configuration for ApartmentDibs production project

**Audience**: Human administrators (HITL task - not automated)

**Last Updated**: 2025-11-20

---

## Overview

This guide documents the one-time PostHog account setup required before deploying the PostHog integration to production. These settings must be configured manually at https://posthog.com by a human administrator.

**Related Documents**:

- [ADR-013: PostHog Analytics Platform](../adr/ADR-013-posthog-analytics-and-experimentation-platform.md)
- [User Story: PostHog Integration](../user-stories/posthog-integration.md)
- [Event Catalog](./event-catalog.md)
- [Feature Flag Patterns](./feature-flag-patterns.md)
- [PostHog Vercel Reverse Proxy Reference](../references/posthog-vercel-reverse-proxy.md)

**Prerequisites**:

- PostHog account created at https://posthog.com/signup
- Admin access to the account
- Production domain deployed (https://apartmentdibs-mock-01.vercel.app/)

---

## Project Creation

### 1. Create PostHog Project

**Project Name**: `apartmentdibs-mock-01-posthog`

**Naming Convention**: `<project-slug>-posthog`

- Keeps project name consistent with repository and deployment
- Makes it easy to identify in PostHog dashboard

**Steps**:

1. Navigate to https://posthog.com/
2. Click "Create Project"
3. Enter project name: `apartmentdibs-mock-01-posthog`
4. Select region: **US Cloud** (https://us.posthog.com)
5. Click "Create Project"

---

## Team & Access Management

### 2. Invite Team Members

**Action**: Invite team members to the PostHog project

**Recommended Roles**:

- **Admin**: Product managers, engineering leads
- **Member**: Engineers, designers, data analysts
- **Viewer**: Stakeholders, executives (view-only access)

**Steps**:

1. Navigate to **Settings → Project → Team Members**
2. Click "Invite Team Member"
3. Enter email and select role
4. Send invitation

**Note**: Team invitations are free - PostHog has unlimited team members on all plans.

---

## Session Recording Configuration

### 3. Enable Session Recording

**Purpose**: Record user sessions for debugging and UX research

**Settings** (Settings → Project → Session Recording):

| Setting                     | Value                 | Rationale                                                                     |
| --------------------------- | --------------------- | ----------------------------------------------------------------------------- |
| **Record user sessions**    | ✅ Enabled            | Debug UX issues and understand user behavior                                  |
| **Capture console logs**    | ✅ Enabled            | Debug JavaScript errors in context                                            |
| **Capture canvas elements** | ❌ Disabled           | **PII SAFETY**: Canvas may contain sensitive user data (signatures, drawings) |
| **Enable capture headers**  | ✅ Enabled            | Debug authentication and API issues                                           |
| **Enable capture body**     | ✅ Enabled            | Debug form submissions and API payloads                                       |
| **Recording retention**     | **30 days (minimum)** | **SCRAPE AND LEARN CYCLE**: Allows monthly UX review cycles                   |

**Privacy Notes**:

- Session recording already configured with `maskAllInputs: true` in code (see [PostHogProvider](../../components/providers/posthog-provider.tsx))
- Elements with `[data-private]` attribute are masked
- Canvas capture disabled until we implement PII-safe rendering

---

## Autocapture Settings

### 4. Configure Autocapture Features

**Purpose**: Automatically capture user interactions without manual instrumentation

**Settings** (Settings → Project → Autocapture):

| Setting                           | Value      | Rationale                                                           |
| --------------------------------- | ---------- | ------------------------------------------------------------------- |
| **Enable heat maps**              | ✅ Enabled | Visualize where users click most frequently                         |
| **Enable Web Vitals autocapture** | ✅ Enabled | Track Core Web Vitals (LCP, FID, CLS) for performance               |
| **Enable Dead Clicks capture**    | ✅ Enabled | Identify rage clicks and broken UI elements                         |
| **Enable exception autocapture**  | ✅ Enabled | **SCRAPE AND LEARN CYCLE**: Automatically capture JavaScript errors |

**Autocapture Benefits**:

- Zero-code instrumentation for common interactions
- Identifies UX problems automatically (dead clicks, rage clicks)
- Performance monitoring built-in (Web Vitals)
- Error tracking without separate tool

---

## Project Settings

### 5. Configure Project Preferences

**Settings** (Settings → Project → General):

| Setting                                           | Value      | Rationale                                                             |
| ------------------------------------------------- | ---------- | --------------------------------------------------------------------- |
| **Week starts**                                   | **Monday** | Standard business week alignment                                      |
| **Use human-friendly comparison periods**         | ✅ Enabled | Compare "Last 7 days" vs "Previous 7 days" instead of arbitrary dates |
| **Filter test accounts out of revenue analytics** | ✅ Enabled | Exclude internal testing from business metrics                        |

**Why These Matter**:

- **Week starts Monday**: Aligns with sprint planning and business reviews
- **Human-friendly periods**: Makes dashboards more intuitive for non-technical stakeholders
- **Filter test accounts**: Prevents skewed revenue and conversion metrics

---

## Authorized Domains

### 6. Configure Authorized URLs

**Purpose**: Allow PostHog toolbar and session recording on specific domains

**Authorized URLs** (Settings → Project → Authorized URLs):

```
https://apartmentdibs-mock-01.vercel.app/
http://localhost:3000
```

**Why These URLs**:

- **Production**: https://apartmentdibs-mock-01.vercel.app/ - Live site
- **Development**: http://localhost:3000 - Local development environment

**Toolbar Access**:

- Press **⌘ + K** (Mac) or **Ctrl + K** (Windows) on authorized domains
- Opens PostHog toolbar for feature flags, session recording, and heatmaps
- Only works on authorized URLs for security

**Note**: Vercel preview deployments (`*.vercel.app`) automatically inherit authorization from the main domain pattern.

---

## Test & Internal User Filtering

### 7. Filter Out Test Users

**Purpose**: Exclude internal team and test users from analytics

**Settings** (Settings → Project → Filters):

**Internal User Filter**:

1. Navigate to **Settings → Project → Filters**
2. Click "Add Filter"
3. Select **"Email"**
4. Set condition: **"contains"** `@apartmentdibs.com` (or your company domain)
5. Save filter

**Test Account Filter**:

1. Add another filter
2. Select **"User ID"**
3. Set condition: **"starts with"** `test_`
4. Save filter

**Why Filter Test Users**:

- Prevents skewed conversion metrics
- Cleaner user cohorts and funnels
- More accurate retention calculations
- Better revenue analytics

**Implementation Note**: Ensure test accounts use emails with company domain or IDs starting with `test_`.

---

## Feature Flag Configuration

### 8. Configure Feature Flag Policies

**Purpose**: Add safeguards for feature flag changes in production

**Settings** (Settings → Project → Feature Flags):

| Setting                                           | Value                            | Rationale                                          |
| ------------------------------------------------- | -------------------------------- | -------------------------------------------------- |
| **Enable flag persistence by default**            | ✅ Enabled                       | Users see consistent feature state across sessions |
| **Require confirmation for feature flag changes** | ✅ Enabled                       | Prevents accidental production flag changes        |
| **Confirmation message**                          | Link to experiment documentation | Reminds engineers to document A/B tests            |

**Confirmation Message Template**:

```
⚠️ You are changing a feature flag in PRODUCTION.

Before proceeding:
1. Document this change in docs/experiments/
2. Notify #product channel in Slack
3. Verify rollout percentage is correct

Experiment documentation: https://github.com/your-org/apartmentdibs-mock-01/tree/main/docs/experiments

Continue?
```

**Why Confirmation Required**:

- Feature flags affect production user experience
- Forces intentional changes (not accidental clicks)
- Reminds engineers to document experiments
- Encourages communication with product team

---

## Integrations

### 9. Configure Integrations (Optional)

**Available Integrations**:

| Integration               | Status               | Notes                                               |
| ------------------------- | -------------------- | --------------------------------------------------- |
| **Slack**                 | 🔲 **Deferred**      | Consider enabling for alert notifications in future |
| **GitHub**                | ❌ **Not Enabled**   | Not needed - we manage deployments via Vercel       |
| **Pipeline Destinations** | 🔍 **TODO: Explore** | Web hooks for event streaming to data warehouse     |

**Slack Integration** (Future Consideration):

- **Use Case**: Real-time alerts for critical events (errors, payment failures)
- **Setup**: Settings → Integrations → Slack
- **Recommended Channels**:
  - `#posthog-alerts` - Error alerts, anomaly detection
  - `#product-metrics` - Daily/weekly metrics summaries

**Pipeline Destinations** (To Explore):

- **Use Case**: Stream PostHog events to data warehouse (BigQuery, Snowflake)
- **Priority**: Low (defer until data warehouse is implemented)
- **Related**: See ADR-006 (Data Warehouse and Business Intelligence)

**GitHub Integration** (Not Recommended):

- PostHog can link deployments to GitHub commits
- We use Vercel for deployment tracking (already integrated)
- Would create duplicate deployment tracking

---

## API Keys

### 10. Create MCP API Key

**Purpose**: API key for Model Context Protocol (MCP) server to query PostHog analytics

**Key Type**: **Project-Scoped API Key** with **MCP Default Permissions**

**Steps**:

1. Navigate to **Settings → Project → API Keys**
2. Click "Create API Key"
3. **Name**: `MCP Server - apartmentdibs-mock-01`
4. **Scope**: **Specific Project** → Select `apartmentdibs-mock-01-posthog`
5. **Permissions**: **MCP** (default MCP permissions)
6. Click "Create Key"
7. **Copy key immediately** - it won't be shown again

**MCP Permissions** (read-only by default):

- ✅ Read events
- ✅ Read insights
- ✅ Read dashboards
- ✅ Read feature flags
- ❌ No write access (safe for AI agents)

**Security**:

- Store key in `.env.local` as `POSTHOG_MCP_API_KEY`
- Do NOT commit to git
- Rotate key if ever exposed

**Use Case**:

- MCP server queries PostHog for analytics insights
- AI agents can answer questions like "How many users signed up last week?"
- No risk of agents accidentally modifying production data

---

## Configuration Checklist

Use this checklist to verify all settings are configured:

### Project Setup

- [ ] Project created with name: `apartmentdibs-mock-01-posthog`
- [ ] Region set to US Cloud (https://us.posthog.com)
- [ ] Team members invited with appropriate roles

### Session Recording

- [ ] Record user sessions: **Enabled**
- [ ] Capture console logs: **Enabled**
- [ ] Capture canvas elements: **Disabled** (PII safety)
- [ ] Enable capture headers: **Enabled**
- [ ] Enable capture body: **Enabled**
- [ ] Recording retention: **30 days minimum**

### Autocapture

- [ ] Heat maps: **Enabled**
- [ ] Web Vitals autocapture: **Enabled**
- [ ] Dead Clicks capture: **Enabled**
- [ ] Exception autocapture: **Enabled**

### Project Settings

- [ ] Week starts: **Monday**
- [ ] Human-friendly comparison periods: **Enabled**
- [ ] Filter test accounts from revenue: **Enabled**

### Authorized URLs

- [ ] Added: `https://apartmentdibs-mock-01.vercel.app/`
- [ ] Added: `http://localhost:3000`

### User Filtering

- [ ] Internal user filter created (company domain emails)
- [ ] Test account filter created (test\_ prefix)

### Feature Flags

- [ ] Flag persistence by default: **Enabled**
- [ ] Require confirmation for changes: **Enabled**
- [ ] Confirmation message configured with docs link

### Integrations

- [ ] Slack integration: Deferred for future
- [ ] GitHub integration: Not needed
- [ ] Pipeline destinations: Noted for exploration

### API Keys

- [ ] MCP API key created with project scope
- [ ] Key stored securely in `.env.local`
- [ ] Key NOT committed to git

---

## Post-Setup Validation

After completing the configuration, verify the setup:

### 1. Test Session Recording

1. Deploy the PostHog integration to Vercel
2. Visit https://apartmentdibs-mock-01.vercel.app/
3. Navigate through the app, trigger some events
4. Return to PostHog dashboard → **Session Recording**
5. ✅ Verify your session appears
6. ✅ Play the recording, verify console logs captured
7. ✅ Verify sensitive inputs are masked

### 2. Test Feature Flags

1. Create a test feature flag in PostHog: `test-feature`
2. Set to 100% rollout
3. Open the app, press **⌘ + K** (Mac) or **Ctrl + K** (Windows)
4. ✅ Verify PostHog toolbar appears
5. ✅ Verify feature flag shows as enabled

### 3. Test Event Tracking

1. Navigate to **Activity → Events**
2. ✅ Verify `$pageview` events appear
3. ✅ Verify events show reverse proxy path (`/0579f8f99ca21e72e24243d7b9f81954/`)
4. ✅ Verify user properties include role, organizationId (once Better Auth integrated)

### 4. Test Reverse Proxy

1. Open browser DevTools → Network tab
2. Navigate to a page
3. ✅ Verify requests go to `/0579f8f99ca21e72e24243d7b9f81954/` (not posthog.com)
4. ✅ Verify 200 status codes
5. Enable ad blocker (uBlock Origin, AdBlock Plus)
6. ✅ Verify events still capture with ad blocker enabled

### 5. Test with Test Account

1. Log in with a test account (`test_user@apartmentdibs.com`)
2. Navigate and trigger events
3. Return to PostHog dashboard → **Activity → Events**
4. ✅ Verify test account events are filtered out (or marked as test)

---

## Troubleshooting

### Issue: Session recordings not appearing

**Possible Causes**:

- Authorized URLs not configured correctly
- Session recording disabled in PostHog settings
- Code configuration incorrect (check `session_recording` in PostHogProvider)

**Solution**:

1. Verify authorized URLs include your domain
2. Check Settings → Project → Session Recording → **Record user sessions** is enabled
3. Check browser console for PostHog initialization errors

### Issue: Feature flag toolbar not working

**Possible Causes**:

- Not on authorized URL
- `ui_host` not configured in code
- Feature flag service down

**Solution**:

1. Verify you're on an authorized URL (https://apartmentdibs-mock-01.vercel.app/ or http://localhost:3000)
2. Verify `ui_host: 'https://us.posthog.com'` in [PostHogProvider](../../components/providers/posthog-provider.tsx)
3. Check PostHog status page: https://status.posthog.com/

### Issue: Events not capturing

**Possible Causes**:

- Reverse proxy not configured correctly
- PostHog API key incorrect
- Ad blocker blocking despite proxy

**Solution**:

1. Verify vercel.json rewrites match PostHogProvider api_host
2. Verify `NEXT_PUBLIC_POSTHOG_KEY` is correct
3. Check Network tab for failed requests
4. See [PostHog Vercel Reverse Proxy Reference](../references/posthog-vercel-reverse-proxy.md) for detailed troubleshooting

### Issue: MCP API key not working

**Possible Causes**:

- Wrong key type (personal vs project-scoped)
- Incorrect scope (organization vs project)
- Insufficient permissions

**Solution**:

1. Verify key is **Project-Scoped** (not Personal API Key)
2. Verify key is scoped to `apartmentdibs-mock-01-posthog` project
3. Verify key has **MCP** permissions
4. Regenerate key if still failing

---

## Monthly Maintenance Tasks

**SCRAPE AND LEARN CYCLE**: Review these metrics monthly

### Session Recording Review (30-day cycle)

**Frequency**: Monthly (first Monday of each month)

**Tasks**:

1. Review recordings with errors (exception autocapture)
2. Identify UX pain points (dead clicks, rage clicks)
3. Document findings in `docs/ux-research/`
4. Create GitHub issues for discovered bugs
5. Share insights with product team

**Metrics to Review**:

- Sessions with JavaScript errors
- Sessions with dead clicks (>3 per session)
- Sessions with rage clicks (>5 rapid clicks)
- Drop-off points in key funnels

### Feature Flag Audit

**Frequency**: Monthly (same day as session review)

**Tasks**:

1. List all active feature flags in PostHog
2. Identify flags at 100% rollout for >30 days
3. Remove flag code and delete flag (feature is now permanent)
4. Document flag retirement in changelog

**Why Monthly**:

- Prevents feature flag debt
- Keeps codebase clean
- Reduces conditional logic complexity

### Exception Autocapture Review

**Frequency**: Weekly (every Monday morning)

**Tasks**:

1. Navigate to PostHog → **Exceptions**
2. Review new exceptions from past week
3. Create GitHub issues for critical errors
4. Track exception trends (increasing/decreasing)

**SCRAPE AND LEARN CYCLE**:

- Learn: Understand which errors users encounter most
- Fix: Prioritize fixes based on user impact
- Verify: Monitor exception reduction after fixes

---

## Additional Resources

### PostHog Documentation

- [Official PostHog Docs](https://posthog.com/docs)
- [Session Recording Docs](https://posthog.com/docs/session-recording)
- [Feature Flags Docs](https://posthog.com/docs/feature-flags)
- [Experiments Docs](https://posthog.com/docs/experiments)

### Internal Documentation

- [ADR-013: PostHog Platform Decision](../adr/ADR-013-posthog-analytics-and-experimentation-platform.md)
- [Event Catalog](./event-catalog.md) - All tracked events
- [Feature Flag Patterns](./feature-flag-patterns.md) - Best practices
- [PostHog Vercel Reverse Proxy](../references/posthog-vercel-reverse-proxy.md) - Technical reference

### Support

- PostHog Community: https://posthog.com/questions
- PostHog Slack: https://posthog.com/slack
- Internal Support: #analytics channel in company Slack

---

## Change Log

| Date       | Change                      | Author                              |
| ---------- | --------------------------- | ----------------------------------- |
| 2025-11-20 | Initial setup guide created | Claude (based on user requirements) |

---

## Notes

**PII Safety Reminders**:

- Canvas capture is DISABLED until we implement PII-safe rendering
- Session recording masks all inputs by default
- Use `[data-private]` attribute on sensitive elements
- Review recordings periodically for PII leaks

**Cost Monitoring**:

- PostHog free tier: 1M events/month, 5K recordings/month
- Monitor usage: Settings → Billing → Usage
- Set up billing alerts at 80% of free tier limits

**Security**:

- Rotate API keys quarterly
- Audit team member access monthly
- Review authorized URLs quarterly
- Never commit API keys to git
