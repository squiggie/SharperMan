# API Integrations — Sharper Man

All third-party services, their purpose, credentials required, cost estimates, and phase rollout.

---

## Anthropic Claude API

**Purpose:** AI accountability coach (Elijah), session summary generation, weekly profile synthesis, prayer request filtering, monthly report generation, devotional commentary generation  
**Phase:** 1 (core)  
**Docs:** https://docs.anthropic.com

### Models Used

| Job | Model | Reason |
|-----|-------|--------|
| Daily check-in (streaming) | `claude-haiku-4-5-20251001` | Cheapest, fastest, sufficient quality |
| Session summary | `claude-haiku-4-5-20251001` | Simple structured extraction task |
| Prayer filter | `claude-haiku-4-5-20251001` | Simple classification task |
| Weekly profile synthesis | `claude-sonnet-4-6` | Higher quality — runs weekly in batch |
| Monthly report | `claude-sonnet-4-6` | Quality matters for a monthly deliverable |
| Track commentary generation | `claude-sonnet-4-6` | Run once, human-reviewed before publish |

### Setup

```bash
# Get API key at https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...
```

### Cost Estimate

| Volume | Monthly Cost |
|--------|-------------|
| 100 premium users | ~$20 |
| 500 premium users | ~$100 |
| 1,000 premium users | ~$205 |
| 5,000 premium users | ~$900 |

---

## ElevenLabs API

**Purpose:** Pre-generate AI voice narration for all Bible study track content  
**Phase:** 1 (premium feature)  
**Docs:** https://elevenlabs.io/docs

### Strategy
Audio is **pre-generated once per track day** and stored in Backblaze B2. Never generated on-demand. Users stream from CDN. After initial generation, ElevenLabs cost is zero for that content.

### Recommended Voice
Use a warm, masculine voice — something like "Daniel" (British, warm) or "Adam" (neutral, deep). Create a custom cloned voice if budget allows for brand consistency.

### Setup

```bash
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB  # Replace with chosen voice ID
```

### Cost Estimate (Creator Plan — $22/mo, 100K chars/mo)

| Content | Chars | Cost |
|---------|-------|------|
| 1 track × 28 days × ~1,500 chars/day | ~42,000 | ~$9 |
| 3 launch tracks | ~126,000 | ~$28 (2 months of Creator plan) |
| Ongoing: 1 new track/month | ~42,000 | ~$9/track or within plan |

Pre-generate all launch content in month 1. Ongoing generation fits within the $22/mo Creator plan for 1–2 new tracks per month.

---

## RevenueCat

**Purpose:** Subscription management, entitlement checks, App Store + Play Store billing, revenue analytics  
**Phase:** 1 (required at launch)  
**Docs:** https://docs.revenuecat.com  
**Critical:** Do not build subscription logic yourself. App Store and Play Store billing is complex. RevenueCat handles receipt validation, refunds, subscription status, and webhooks.

### Pricing
- Free up to $2,500 MRR
- Then 1% of tracked revenue
- At $8,000 MRR → $80/mo. At $25,000 MRR → $250/mo. Worth every penny.

### Setup

```bash
REVENUECAT_API_KEY=your_public_sdk_key          # Used in React Native app
REVENUECAT_WEBHOOK_SECRET=your_webhook_secret   # Used to verify incoming webhooks (server only)
```

### Entitlement Structure

```
Entitlement: "premium"
  Products:
    - Monthly: com.sharperman.premium.monthly ($7.99/mo)
    - Annual:  com.sharperman.premium.annual  ($59.99/yr)

# Phase 3:
Entitlement: "premium_plus"
  Products:
    - Monthly: com.sharperman.premiumplus.monthly ($14.99/mo)
    - Annual:  com.sharperman.premiumplus.annual  ($119.99/yr)
```

### Webhook Integration

RevenueCat sends webhooks to your API for subscription events. Handle these to sync tier in your database:

```typescript
// POST /v1/webhooks/revenuecat
// Events to handle:
// INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION,
// BILLING_ISSUE, SUBSCRIBER_ALIAS

app.post('/v1/webhooks/revenuecat', async (req, reply) => {
  // Verify the webhook is actually from RevenueCat
  const authHeader = req.headers['authorization']
  if (authHeader !== `Bearer ${process.env.REVENUECAT_WEBHOOK_SECRET}`) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }

  const event = req.body.event
  const userId = event.app_user_id

  switch (event.type) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
      await db.update(users)
        .set({ tier: 'premium' })
        .where(eq(users.revenuecatUserId, userId))
      break

    case 'CANCELLATION':
    case 'EXPIRATION':
      await db.update(users)
        .set({ tier: 'free' })
        .where(eq(users.revenuecatUserId, userId))
      break
  }
})
```

---

## Apple HealthKit

**Purpose:** Pull sleep data, step count, workout minutes, heart rate from iOS devices and Apple Watch  
**Phase:** 1 (premium feature)  
**Cost:** Free (native iOS API)  
**Platform:** iOS only

### Setup in Expo

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-health",
        {
          "healthSharePermission": "Sharper Man reads your health data to track your physical wellness alongside your spiritual and mental growth.",
          "healthUpdatePermission": "Sharper Man may log workouts to your health data."
        }
      ]
    ]
  }
}
```

### Data Pulled

| Data Type | HealthKit Identifier | Frequency |
|-----------|---------------------|-----------|
| Sleep duration | `HKCategoryTypeIdentifierSleepAnalysis` | Daily sync |
| Step count | `HKQuantityTypeIdentifierStepCount` | Daily sync |
| Workout minutes | `HKQuantityTypeIdentifierAppleExerciseTime` | Daily sync |
| Active energy | `HKQuantityTypeIdentifierActiveEnergyBurned` | Daily sync |

### Important Notes
- User must explicitly grant permission during onboarding
- HealthKit is iOS only — Android uses Google Health Connect
- Data never leaves the server unencrypted
- Only aggregate daily values are stored — never raw health events

---

## Google Health Connect

**Purpose:** Same health data pipeline for Android users  
**Phase:** 1 (premium feature)  
**Cost:** Free (native Android API)  
**Platform:** Android only  
**Note:** Google Fit API is deprecated — build to Health Connect standard (Android 14+, backported to Android 9+)

### Expo Plugin

```bash
npm install react-native-health-connect
```

### Permissions Required

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.health.READ_SLEEP"/>
<uses-permission android:name="android.permission.health.READ_STEPS"/>
<uses-permission android:name="android.permission.health.READ_EXERCISE"/>
```

---

## Backblaze B2

**Purpose:** Object storage for pre-generated audio files, cover images, database backups  
**Phase:** 1  
**Cost:** $0.006/GB/month storage, free egress via Cloudflare  
**Docs:** https://www.backblaze.com/docs/cloud-storage

### Setup

1. Create a Backblaze account
2. Create bucket: `sharperman-assets`
3. Create bucket: `sharperman-backups`
4. Generate application keys with appropriate bucket permissions

```bash
B2_KEY_ID=your_key_id
B2_APP_KEY=your_application_key
B2_BUCKET_NAME=sharperman-assets
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com  # Varies by region
```

### S3-Compatible Usage

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

export const b2 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: 'us-west-004',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  },
})

export const uploadAudio = async (key: string, buffer: Buffer) => {
  await b2.send(new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'audio/mpeg',
    CacheControl: 'public, max-age=31536000', // 1 year CDN cache
  }))
  return `https://cdn.sharperman.com/${key}` // Cloudflare CDN URL
}
```

---

## Cloudflare

**Purpose:** CDN for audio and static assets, DDoS protection, DNS management, SSL proxy  
**Phase:** 1  
**Cost:** Free tier (unlimited bandwidth when serving from Backblaze B2)

### Setup
1. Add `sharperman.com` to Cloudflare (free)
2. Set DNS A record for `api.sharperman.com` → Vultr server IP
3. Set DNS CNAME for `cdn.sharperman.com` → Backblaze B2 bucket public URL
4. Enable "Proxy" (orange cloud) on API subdomain
5. Set SSL/TLS to "Full (strict)"

### Cloudflare Rules
- Cache all `cdn.sharperman.com/*` requests for 1 year (audio never changes)
- Bypass cache for `api.sharperman.com/*` (dynamic API)
- Rate limit `api.sharperman.com/v1/auth/*` — 10 requests/minute per IP

---

## Resend

**Purpose:** Transactional email — accountability partner alerts, monthly progress reports, email verification, password reset  
**Phase:** 1  
**Cost:** Free (3,000 emails/month). Paid plans from $20/mo.  
**Docs:** https://resend.com/docs

### Setup

```bash
RESEND_API_KEY=re_...
```

### Email Templates

All emails use React Email for templating:

```typescript
// src/emails/accountability-alert.tsx
import { Html, Text, Heading, Button } from '@react-email/components'

export const AccountabilityAlertEmail = ({
  partnerName,
  userName,
  daysMissed,
  patterns,
}: Props) => (
  <Html>
    <Heading>Hey {partnerName} — {userName} may need a call.</Heading>
    <Text>
      {userName} hasn't checked in for {daysMissed} days on Sharper Man.
      Here's what the app has noticed:
    </Text>
    <Text>{patterns}</Text>
    <Text>
      This is just a heads up — not an alarm. But {userName} set you
      as their accountability partner because your voice matters to them.
    </Text>
    <Button href="mailto:">Reply to this email</Button>
  </Html>
)
```

### Sending Emails

```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'Sharper Man <noreply@sharperman.com>',
  to: partnerEmail,
  subject: `${userName} may need a check-in`,
  react: AccountabilityAlertEmail({ partnerName, userName, daysMissed, patterns }),
})
```

---

## Expo Push Notifications

**Purpose:** Daily reminder notifications, prayer reaction notifications, accountability nudges  
**Phase:** 1  
**Cost:** Free (Expo Push Notification Service)

### Setup in Expo

```typescript
import * as Notifications from 'expo-notifications'

// Request permission and get push token during onboarding
const token = await Notifications.getExpoPushTokenAsync({
  projectId: 'your-expo-project-id'
})

// Send token to API, store on user record
await api.post('/v1/users/push-token', { token: token.data })
```

### Sending Notifications from API

```typescript
// Via Expo Push API
const message = {
  to: user.expoPushToken,
  sound: 'default',
  title: 'Time to check in',
  body: `Good morning ${user.displayName}. Elijah is ready when you are.`,
  data: { screen: 'checkin' },
}

await fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(message),
})
```

---

## Sentry

**Purpose:** Error tracking and crash reporting for both the API and React Native app  
**Phase:** 1  
**Cost:** Free tier (5,000 errors/month)  
**Docs:** https://docs.sentry.io

```bash
SENTRY_DSN=https://...@sentry.io/...
```

```typescript
// API initialization
import * as Sentry from '@sentry/node'
Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV })

// React Native
import * as Sentry from '@sentry/react-native'
Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN })
```

---

## PostHog

**Purpose:** Product analytics — screen views, funnel analysis, free-to-paid conversion tracking, feature usage  
**Phase:** 1  
**Cost:** Free (1M events/month)  
**Docs:** https://posthog.com/docs

```typescript
// Key events to track:
posthog.capture('onboarding_started')
posthog.capture('onboarding_completed', { goals: user.goals })
posthog.capture('checkin_started')
posthog.capture('checkin_completed', { duration_seconds: elapsed })
posthog.capture('track_started', { track_id: trackId, tier: user.tier })
posthog.capture('paywall_viewed', { trigger: 'track_locked' })
posthog.capture('subscription_started', { plan: 'monthly' })
posthog.capture('prayer_submitted')
posthog.capture('prayer_reaction_sent', { type: reactionType })
```

---

## Phase 3 Integrations

These are not needed at launch. Add when Phase 3 begins.

| Service | Purpose | Cost |
|---------|---------|------|
| Strava API | Pull workout data from serious athletes | Free |
| Oura Ring API | HRV, sleep stages, recovery score | Free (developer) |
| Whoop API | Recovery, strain, sleep coaching data | Free (developer) |
| Garmin Connect API | Broad wearable fitness data | Free |

---

## Total API Cost at Scale

| Users | Anthropic | ElevenLabs | RevenueCat | Others | Total |
|-------|-----------|-----------|-----------|--------|-------|
| 300 | $60 | $22 | $0 | $5 | $87 |
| 1,000 | $205 | $22 | $0 | $10 | $237 |
| 5,000 | $900 | $22 | $320 | $30 | $1,272 |
| 10,000 | $1,800 | $44 | $640 | $50 | $2,534 |

At 10,000 users × $7.99/mo = $79,900 MRR. API costs at $2,534 = 3.2% of revenue. Very healthy margin.

---

*See also: [AI_ENGINE.md](AI_ENGINE.md) for detailed AI prompt architecture, [INFRASTRUCTURE.md](INFRASTRUCTURE.md) for server setup.*
