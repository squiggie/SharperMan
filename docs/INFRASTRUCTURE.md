# Infrastructure & Deployment — Sharper Man

## Server

**Provider:** Vultr  
**Type:** High Frequency Compute  
**OS:** Ubuntu 24.04 LTS

| Phase | Plan | vCPU | RAM | Storage | Cost |
|-------|------|------|-----|---------|------|
| Launch | High Frequency CX21 | 2 | 4 GB | 80 GB NVMe | $24/mo |
| Growth (~2K users) | High Frequency CX32 | 4 | 8 GB | 160 GB NVMe | $48/mo |
| Scale (~10K users) | CX32 + Vultr Managed DB | 4 | 8 GB | 160 GB NVMe | $63/mo |

---

## Initial Server Setup

Run once on a fresh Vultr Ubuntu 24.04 LTS instance:

```bash
#!/bin/bash
# Initial server setup — run as root

# 1. Update system
apt-get update && apt-get upgrade -y

# 2. Install Docker + Docker Compose plugin
curl -fsSL https://get.docker.com | bash
apt-get install -y docker-compose-plugin

# 3. Create non-root deploy user
useradd -m -s /bin/bash deploy
usermod -aG docker deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh

# 4. Create app directory
mkdir -p /srv/sharperman
chown deploy:deploy /srv/sharperman

# 5. Install Certbot for SSL
apt-get install -y certbot python3-certbot-nginx

# 6. Install AWS CLI (for Backblaze B2 S3-compatible uploads)
apt-get install -y awscli

# 7. Configure firewall
ufw default deny incoming
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 8. Enable automatic security updates
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

echo "Server ready. SSH in as 'deploy' user."
```

---

## Environment Variables

Create `/srv/sharperman/.env` on the server. Never commit this file.

```bash
# Application
NODE_ENV=production
PORT=3000

# Database
DB_PASS=your_strong_password_here
DATABASE_URL=postgresql://sm_user:${DB_PASS}@postgres:5432/sharperman

# Redis
REDIS_URL=redis://redis:6379

# Auth
BETTER_AUTH_SECRET=your_64_char_random_secret_here
BETTER_AUTH_URL=https://api.sharperman.com

# Apple Sign In
APPLE_CLIENT_ID=com.sharperman.app
APPLE_CLIENT_SECRET=your_apple_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Voice
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=your_chosen_voice_id

# Subscriptions
REVENUECAT_WEBHOOK_SECRET=your_revenuecat_webhook_auth_secret  # Used to verify incoming webhooks
REVENUECAT_API_KEY=your_revenuecat_api_key                     # Used for server-side REST API calls

# Email
RESEND_API_KEY=re_...

# Storage
B2_KEY_ID=your_b2_key_id
B2_APP_KEY=your_b2_app_key
B2_BUCKET_NAME=sharperman-assets
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com

# Monitoring (API/server)
SENTRY_DSN=https://...@sentry.io/...

# Monitoring (React Native app — set in apps/mobile/.env or app.config.js, not here)
# EXPO_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

---

## Docker Compose

```yaml
# /srv/sharperman/docker-compose.yml

networks:
  sharperman-net:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  nginx_certs:

services:

  # ── NGINX ────────────────────────────────────────────────────
  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - nginx_certs:/etc/letsencrypt
    depends_on: [api]
    networks: [sharperman-net]

  # ── API SERVER ───────────────────────────────────────────────
  api:
    image: ghcr.io/YOUR_ORG/sharperman-api:latest
    restart: always
    env_file: .env
    environment:
      NODE_ENV: production
      PORT: "3000"
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_healthy }
    networks: [sharperman-net]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ── WORKER ───────────────────────────────────────────────────
  worker:
    image: ghcr.io/YOUR_ORG/sharperman-api:latest  # Same image
    command: ["node", "dist/worker.js"]             # Different entrypoint
    restart: always
    env_file: .env
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_healthy }
    networks: [sharperman-net]

  # ── POSTGRESQL ────────────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: sharperman
      POSTGRES_USER: sm_user
      POSTGRES_PASSWORD: ${DB_PASS}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/postgresql.conf:/etc/postgresql/postgresql.conf
    command: postgres -c config_file=/etc/postgresql/postgresql.conf
    networks: [sharperman-net]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sm_user -d sharperman"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ── REDIS ─────────────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    restart: always
    command: >
      redis-server
      --appendonly yes
      --maxmemory 512mb
      --maxmemory-policy allkeys-lru
      --save 900 1
      --save 300 10
    volumes:
      - redis_data:/data
    networks: [sharperman-net]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  # ── WATCHTOWER (auto-deploy on new image) ─────────────────────
  watchtower:
    image: containrrr/watchtower
    restart: always
    environment:
      WATCHTOWER_POLL_INTERVAL: "30"
      WATCHTOWER_CLEANUP: "true"
      WATCHTOWER_ROLLING_RESTART: "true"
      WATCHTOWER_NOTIFICATIONS: "email"
      WATCHTOWER_NOTIFICATION_EMAIL_TO: "you@youremail.com"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks: [sharperman-net]
```

---

## Nginx Configuration

```nginx
# /srv/sharperman/nginx/nginx.conf

events { worker_connections 1024; }

http {
    # Rate limiting zones
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=10r/m;

    # HTTP → HTTPS redirect
    server {
        listen 80;
        server_name api.sharperman.com;
        return 301 https://$host$request_uri;
    }

    # Main API server
    server {
        listen 443 ssl http2;
        server_name api.sharperman.com;

        ssl_certificate /etc/letsencrypt/live/api.sharperman.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/api.sharperman.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security headers
        add_header Strict-Transport-Security "max-age=63072000" always;
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;

        # Auth routes — stricter rate limit
        location /v1/auth/ {
            limit_req zone=auth_limit burst=5 nodelay;
            proxy_pass http://api:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # All other API routes
        location / {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://api:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_read_timeout 120s; # For streaming AI responses
        }
    }
}
```

### SSL Certificate Setup

```bash
# Run once after DNS is pointing to the server
sudo certbot --nginx -d api.sharperman.com

# Certbot auto-renewal (added automatically, verify with):
sudo certbot renew --dry-run

# Cron for renewal (add if not automatic):
# 0 0,12 * * * certbot renew --quiet
```

---

## Dockerfile

```dockerfile
# services/api/Dockerfile

FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY . .
RUN npm run build              # tsc → dist/

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only copy production deps + compiled output
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

# Default to API server; Worker overrides this in Compose
CMD ["node", "dist/server.js"]
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

---

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Test, Build, Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:

  # ── TEST ────────────────────────────────────────────────────
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run typecheck     # tsc --noEmit
      - run: npm test              # Vitest

  # ── BUILD + PUSH (main branch only) ─────────────────────────
  build-and-push:
    needs: [test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./services/api
          push: true
          tags: ghcr.io/${{ github.repository_owner }}/sharperman-api:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Watchtower on Vultr detects new :latest image and redeploys
  # automatically within 30 seconds. No additional deploy step needed.
```

**Deployment flow:**
1. Push to `main`
2. GitHub runs TypeScript checks + Vitest tests
3. If passing: builds Docker image, pushes to GHCR
4. Watchtower on Vultr polls GHCR every 30 seconds
5. Detects new `:latest` image, pulls it, rolling restarts API + Worker
6. Migrations run automatically on container startup
7. Live in < 2 minutes, zero SSH required

---

## Database Backups

```bash
#!/bin/bash
# /srv/sharperman/scripts/backup-db.sh
# Add to crontab: 0 2 * * * /srv/sharperman/scripts/backup-db.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="sharperman_${TIMESTAMP}.sql.gz"

# Dump and compress
docker exec sharperman-postgres-1 \
  pg_dump -U sm_user sharperman | gzip > /tmp/$BACKUP_FILE

# Upload to Backblaze B2
aws s3 cp /tmp/$BACKUP_FILE \
  s3://sharperman-backups/$BACKUP_FILE \
  --endpoint-url https://s3.us-west-004.backblazeb2.com

# Clean local file
rm /tmp/$BACKUP_FILE

# Delete backups older than 30 days
aws s3 ls s3://sharperman-backups/ \
  --endpoint-url https://s3.us-west-004.backblazeb2.com | \
  awk '{print $4}' | while read file; do
    filedate=$(echo $file | grep -oP '\d{8}')
    if [[ $filedate -lt $(date -d '30 days ago' +%Y%m%d) ]]; then
      aws s3 rm s3://sharperman-backups/$file \
        --endpoint-url https://s3.us-west-004.backblazeb2.com
    fi
  done

echo "Backup complete: $BACKUP_FILE"
```

---

## PostgreSQL Tuning

```conf
# /srv/sharperman/postgres/postgresql.conf
# Tuned for 4GB RAM server

shared_buffers = 1GB           # 25% of RAM
effective_cache_size = 3GB     # 75% of RAM
maintenance_work_mem = 256MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1         # SSD
effective_io_concurrency = 200 # SSD
work_mem = 16MB
min_wal_size = 1GB
max_wal_size = 4GB
max_connections = 100
```

---

## Scaling Path

### Phase 1 → Phase 2 (~2,000 users)
- Resize Vultr server from CX21 to CX32 (2→4 vCPU, 4→8GB RAM)
- No other changes. Resize is live in ~2 minutes via Vultr console.

### Phase 2 → Phase 3 (~10,000 users)
1. Provision Vultr Managed PostgreSQL ($15/mo, 1 vCPU, 2GB)
2. Run `pg_dump` from container, restore to managed DB
3. Update `DATABASE_URL` in `.env`, restart containers
4. Remove `postgres` service from `docker-compose.yml`
5. Sessions already use Redis → horizontal scaling is clean

### Serious Scale (~50,000+ users)
1. Add Vultr Load Balancer ($10/mo)
2. Provision second Vultr server (identical setup)
3. Both servers pull same Docker images, share managed PostgreSQL and Redis
4. Consider Vultr Managed Redis at this stage

### Monitoring
At launch, use **Uptime Kuma** (self-hosted, free) for uptime monitoring:

```yaml
# Add to docker-compose.yml
uptime-kuma:
  image: louislam/uptime-kuma:1
  restart: always
  volumes:
    - uptime_data:/app/data
  ports:
    - "127.0.0.1:3001:3001"  # Accessible via SSH tunnel only
  networks: [sharperman-net]
```

---

*See also: [ARCHITECTURE.md](ARCHITECTURE.md) for design decisions, [DATABASE.md](DATABASE.md) for schema.*
