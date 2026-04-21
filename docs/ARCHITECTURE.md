# System Architecture — Sharper Man

## Architecture Overview

Sharper Man is a self-hosted, containerized mobile application backend. The architecture is deliberately simple for Phase 1 — a single Vultr server running all services in Docker Compose — with a clear, non-disruptive scaling path to handle 1M+ users by extracting services to managed instances without rewriting anything.

```
┌─────────────────────────────────────────────┐
│                 CLIENT LAYER                 │
│         iOS App          Android App         │
│       (React Native / Expo)                  │
└──────────────────┬──────────────────────────┘
                   │ HTTPS / WSS
┌──────────────────▼──────────────────────────┐
│                  EDGE LAYER                  │
│   Cloudflare CDN + DDoS + DNS Proxy          │
│   Backblaze B2 (audio/assets via CF CDN)     │
└──────────────────┬──────────────────────────┘
                   │ Proxied to Vultr VPS
┌──────────────────▼──────────────────────────┐
│              REVERSE PROXY                   │
│         Nginx (SSL termination,              │
│         rate limiting, routing)              │
└──────────────────┬──────────────────────────┘
                   │ Internal Docker Network
┌──────────────────▼──────────────────────────┐
│             APPLICATION LAYER                │
│  ┌──────────────────┐  ┌──────────────────┐ │
│  │   API Server     │  │  Worker Process  │ │
│  │ Fastify + Node   │  │ BullMQ + Node    │ │
│  │ :3000 (internal) │  │ (no ext. port)   │ │
│  └──────────────────┘  └──────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│                DATA LAYER                    │
│  ┌──────────────────┐  ┌──────────────────┐ │
│  │  PostgreSQL 16   │  │    Redis 7       │ │
│  │  Primary DB      │  │  Cache/Sessions  │ │
│  │  :5432           │  │  /Queue :6379    │ │
│  └──────────────────┘  └──────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │ External API calls
┌──────────────────▼──────────────────────────┐
│             EXTERNAL SERVICES                │
│  Anthropic │ ElevenLabs │ Backblaze B2       │
│  RevenueCat │ Resend │ Apple/Google Push     │
└─────────────────────────────────────────────┘
```

---

## Service Responsibilities

### API Server (Fastify + Node.js)
- Handles all client HTTP requests
- Authentication via Better Auth (integrated as a Fastify plugin)
- Route handlers for: auth, users, Bible content, check-ins, prayer requests, health data sync, subscriptions
- Entitlement checks via RevenueCat webhooks and SDK
- Pushes background jobs to BullMQ queues (does not process them)
- Health check endpoint at `GET /health`

### Worker Process (BullMQ + Node.js)
- **Same Docker image as API**, different entry point (`worker.js`)
- Processes all background and scheduled jobs:
  - Weekly AI profile synthesis (all premium users)
  - Daily accountability partner alert checks
  - Monthly progress report generation
  - Prayer request content filtering (near-real-time)
  - ElevenLabs audio pre-generation for new tracks
  - Database backup trigger
- Connects to PostgreSQL and Redis directly
- Never handles HTTP requests

### PostgreSQL 16
- Primary database for all application data
- Runs in Docker with persistent named volume
- Never exposed externally (internal Docker network only)
- Daily backups to Backblaze B2 via cron script
- Migrates to Vultr Managed Database at ~2,000 users

### Redis 7
- **Session store**: Better Auth sessions (fast lookup, avoids DB hit on every request)
- **BullMQ backend**: Job queue storage and pub/sub for worker coordination
- **Rate limiting**: Per-IP and per-user rate limit counters for API endpoints
- **Cache**: Frequently read data (Bible track library, user tier checks)
- Configured with `maxmemory 512mb` and `allkeys-lru` eviction policy
- AOF persistence enabled for durability

### Nginx
- Terminates SSL (Let's Encrypt certificates via Certbot)
- Routes `api.sharperman.com` → API container on :3000
- Enforces rate limiting before requests hit Node.js (coarse-grained)
- Handles CORS headers
- Redirects HTTP → HTTPS

---

## Tech Stack Decisions

### Why Fastify over Express?
Fastify benchmarks 2–3x faster than Express on throughput. It has schema-based request validation built in (via Zod or JSON Schema), excellent TypeScript support, and a plugin architecture that maps cleanly to the application structure. For an API that will serve real-time AI check-ins, performance matters.

### Why Drizzle ORM over Prisma?
Drizzle is TypeScript-native with zero runtime magic. You define your schema in TypeScript, it generates clean SQL. Queries are fully typed. Migration files are plain SQL you can read and audit. Prisma generates an abstraction layer that obscures what's happening at the DB level — fine for simple CRUD, wrong for an app with complex queries across five related tables.

### Why Better Auth over Clerk/Auth0?
Better Auth is open source and self-hosted. It runs inside your API container and uses your PostgreSQL database. Cost at 1M users: $0. Clerk at 1M users: ~$20,000/month. Better Auth ships Apple Sign In and Google OAuth out of the box — both required for App Store compliance. See [INFRASTRUCTURE.md](INFRASTRUCTURE.md) for setup details.

### Why BullMQ over cron jobs?
Cron jobs fail silently. BullMQ retries failed jobs automatically (configurable backoff), persists job state in Redis, and provides visibility into queue health. When the weekly profile synthesis crashes halfway through, BullMQ resumes where it left off. A cron job disappears.

### Why Backblaze B2 over S3?
$0.006/GB vs $0.023/GB. Backblaze and Cloudflare have a bandwidth partnership — egress from B2 to Cloudflare is free. Since all audio is served via Cloudflare CDN, the only cost is storage. Audio files are pre-generated once and never regenerated, so storage cost is essentially fixed regardless of user count.

### Why Expo over bare React Native?
Expo handles build pipelines for iOS and Android simultaneously, over-the-air updates (OTA), push notifications, HealthKit/Health Connect plugins, and App Store submission. Building all of this from scratch in bare React Native would take months. Expo SDK 51+ supports all required native modules.

---

## API Design Principles

### REST (not GraphQL)
Simple, cacheable, and predictable. GraphQL's flexibility is unnecessary overhead for a well-defined mobile app.

### Versioning
All routes are prefixed with `/v1/`. Future breaking changes increment to `/v2/`. Mobile apps cannot be force-updated, so versioning is non-negotiable.

### Authentication
Every protected route checks the Better Auth session token from the `Authorization: Bearer <token>` header. Session data is cached in Redis for 5 minutes to avoid repeated DB lookups.

### Entitlement Enforcement
Premium feature endpoints verify the user's RevenueCat entitlement server-side before processing. This check is a fast Redis cache lookup (cached for 1 hour) with a fallback to RevenueCat's API. Client-side entitlement checks are cosmetic only.

### Rate Limiting
- Global: 100 requests/minute per IP (Nginx)
- AI check-in endpoint: 3 requests/hour per user (Redis counter)
- Prayer submission: 5 submissions/day per user (DB check)
- Auth endpoints: 10 attempts/15 minutes per IP (Redis counter)

---

## Data Flow: AI Check-In Request

```
1. User taps "Start Check-In" in app
2. App sends POST /v1/checkin/start with Bearer token
3. Fastify validates session → checks Premium entitlement
4. API queries: user profile + last 3 session summaries + today's observed data
5. Builds Elijah system prompt with this context (~2,500 tokens)
6. Streams response from Claude Haiku API back to client
7. Client displays response progressively (streaming)
8. On check-in complete: POST /v1/checkin/complete with conversation summary
9. API stores session summary in checkin_sessions table
10. Pushes job to BullMQ: "update-profile-flags" (async, non-blocking)
```

**Total cost per check-in:** ~$0.002–0.004 (Claude Haiku pricing)  
**P95 latency target:** < 2 seconds to first token

---

## Security Considerations

- All secrets in environment variables, never in code or Docker images
- PostgreSQL and Redis never exposed outside Docker network
- Nginx enforces HTTPS with HSTS headers
- All API keys stored in Vultr server `.env` file, not in GitHub
- GitHub Actions secrets used for CI/CD deployment
- Database accessible only from API/Worker containers
- Backups encrypted before upload to Backblaze B2
- User health data never leaves the server unencrypted

---

*See also: [INFRASTRUCTURE.md](INFRASTRUCTURE.md) for deployment details, [DATABASE.md](DATABASE.md) for schema, [AI_ENGINE.md](AI_ENGINE.md) for AI architecture.*
