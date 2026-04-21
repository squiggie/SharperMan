# ⚔ Sharper Man

> *"As iron sharpens iron, so one person sharpens another."* — Proverbs 27:17

A men's holistic discipleship platform combining AI-powered accountability, Bible study tracks with voice narration, a moderation-free prayer community, and whole-man wellness tracking across spiritual, mental, and physical health.

---

## What Is Sharper Man?

Sharper Man is not another Bible app. It is a **men's discipleship OS** — an active, intelligent system that knows your journey, tracks your whole man, coaches you daily through an AI mentor named Elijah, and loops in a real human accountability partner when patterns deteriorate.

Every other app is passive. Sharper Man follows up.

---

## The Core Differentiator

An AI accountability coach (Elijah) with a **persistent two-layer memory system** that:
- Remembers what you've studied, struggled with, and committed to
- Tracks your spiritual, mental, and physical health simultaneously
- Pulls real fitness and sleep data from Apple Health / Google Fit automatically
- Surfaces correlations between your three pillars over time ("Every time your sleep drops, your Bible consistency drops with it")
- Notifies a real accountability partner via email when patterns deteriorate

No other app in the Christian men's space does this.

---

## Platform

- **iOS + Android** — React Native / Expo (single codebase)
- **Freemium model** — free tier hooks, premium tier converts
- **Self-hosted infrastructure** — Vultr + Docker Compose, zero vendor lock-in
- **Target premium price** — $7.99/month or $59.99/year

---

## Documentation

| File | Contents |
|------|----------|
| [`docs/PRODUCT.md`](docs/PRODUCT.md) | Vision, phases 1–3, full feature breakdown, freemium split |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System architecture, service overview, tech stack decisions |
| [`docs/INFRASTRUCTURE.md`](docs/INFRASTRUCTURE.md) | Vultr setup, Docker Compose, Nginx, CI/CD, backups, scaling |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Full Drizzle schema, data models, indexing, migration workflow |
| [`docs/AI_ENGINE.md`](docs/AI_ENGINE.md) | Memory architecture, Elijah persona, prompt structure, guardrails |
| [`docs/API_INTEGRATIONS.md`](docs/API_INTEGRATIONS.md) | All external APIs, credentials, cost estimates, phase rollout |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | One UI-inspired design language, brand colors, typography, component library, screen architecture |
| [`docs/REVENUE.md`](docs/REVENUE.md) | Business model, pricing tiers, projections, growth mechanics |

---

## Tech Stack Summary

### Frontend
- React Native (Expo SDK 51+)
- Expo Router (file-based navigation)
- Zustand (state management)
- Better Auth React Native client

### Backend
- Node.js 22 LTS + Fastify 5
- TypeScript throughout
- Drizzle ORM + PostgreSQL 16
- Better Auth (self-hosted authentication)
- BullMQ (background job queue)
- Redis 7 (sessions, cache, queue backend)

### Infrastructure
- Vultr High Frequency VPS (~$24/mo launch)
- Docker Compose (all services containerized)
- Nginx (reverse proxy + SSL)
- Let's Encrypt / Certbot (SSL certificates)
- GitHub Actions + GHCR (CI/CD)
- Watchtower (auto-deployment)

### External Services
- Anthropic Claude API (AI coach + content)
- ElevenLabs API (voice narration)
- Backblaze B2 + Cloudflare (storage + CDN)
- RevenueCat (subscription billing)
- Resend (transactional email)
- Apple HealthKit + Google Health Connect (fitness data)

---

## Project Structure

```
sharperman/
├── apps/
│   └── mobile/              # React Native / Expo app
│       ├── app/             # Expo Router screens
│       ├── components/      # Shared UI components
│       ├── lib/             # API clients, utilities
│       └── store/           # Zustand state stores
├── services/
│   └── api/                 # Fastify API server + Worker
│       ├── src/
│       │   ├── routes/      # API route handlers
│       │   ├── jobs/        # BullMQ queues and workers
│       │   ├── lib/         # Shared utilities
│       │   ├── db/          # Drizzle schema + migrations
│       │   └── ai/          # Claude prompts and handlers
│       └── Dockerfile
├── infra/
│   ├── docker-compose.yml
│   ├── nginx/
│   └── scripts/             # Backup, setup scripts
└── docs/                    # This documentation
```

---

## Getting Started (Development)

### Prerequisites
- Node.js 22+
- Docker + Docker Compose plugin (`docker compose`, not the legacy `docker-compose` binary)
- Expo (bundled with the `expo` package — no global install required)

### Local Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_ORG/sharperman.git
cd sharperman

# Start backend services locally
cd infra
cp .env.example .env      # Fill in your API keys
docker compose up -d      # Starts Postgres, Redis, Nginx

# Run API
cd ../services/api
npm install
npm run db:migrate        # Run Drizzle migrations
npm run dev               # Starts Fastify on :3000

# Run Worker (separate terminal)
npm run worker

# Run mobile app
cd ../../apps/mobile
npm install
npx expo start            # Starts Expo dev server (uses @expo/cli bundled with expo package)
```

---

## Phase Roadmap

| Phase | Focus | Target MRR | Timeline |
|-------|-------|-----------|----------|
| **Phase 1** | Bible engine + AI coach + three-pillar tracking | $2,500 | 3–4 months |
| **Phase 2** | Prayer wall + enhanced AI memory + partner portal | $8,000 | +4–6 months |
| **Phase 3** | Fitness tracks + whole-man dashboard + church partnerships | $25,000+ | +6–12 months |

---

## Profitability Targets

- **Break-even**: ~315 paid subscribers at $7.99/mo
- **Launch audience**: Existing email list (several thousand) + church community
- **Primary growth mechanic**: Accountability partner emails drive organic installs

---

*Sharper Man Product Design Document v1.0 — Confidential*
