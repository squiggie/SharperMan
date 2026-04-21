# Database Schema — Sharper Man

**Database:** PostgreSQL 16  
**ORM:** Drizzle ORM (TypeScript-native)  
**Migration tool:** `drizzle-kit`

---

## Migration Workflow

```bash
# Generate migration from schema changes
npm run db:generate     # → drizzle-kit generate

# Apply migrations (also runs on container startup)
npm run db:migrate      # → drizzle-kit migrate

# View current DB state
npm run db:studio       # → drizzle-kit studio (local only)
```

Migrations are plain SQL files in `src/db/migrations/`. Every migration is committed to Git. The API container runs `npm run db:migrate` automatically before starting.

---

## Full Schema

```typescript
// src/db/schema.ts

import {
  pgTable, pgEnum, uuid, text, boolean,
  integer, timestamp, date, index, uniqueIndex
} from 'drizzle-orm/pg-core'

// ─────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────

export const tierEnum = pgEnum('tier', ['free', 'premium', 'premium_plus'])

export const filterStatusEnum = pgEnum('filter_status', [
  'pending', 'approved', 'rejected'
])

export const prayerCategoryEnum = pgEnum('prayer_category', [
  'family', 'health', 'work', 'faith', 'other'
])

export const trackTierEnum = pgEnum('track_tier', ['free', 'premium'])

// ─────────────────────────────────────────────────────────────
// USERS
// Core account and subscription data
// ─────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id:                         uuid('id').primaryKey().defaultRandom(),
  email:                      text('email').notNull().unique(),
  displayName:                text('display_name').notNull(),
  tier:                       tierEnum('tier').default('free').notNull(),

  // Onboarding
  onboardingComplete:         boolean('onboarding_complete').default(false),
  goalsSet:                   text('goals').array().default([]),
  // e.g. ['spiritual', 'physical'] — set during onboarding

  // Accountability partner
  accountabilityPartnerEmail: text('accountability_partner_email'),
  accountabilityPartnerName:  text('accountability_partner_name'),
  alertThresholdDays:         integer('alert_threshold_days').default(7),
  alertsPaused:               boolean('alerts_paused').default(false),
  alertsPausedUntil:          timestamp('alerts_paused_until'),
  lastAlertSentAt:            timestamp('last_alert_sent_at'),
  // Partner visibility settings
  partnerCanSeeStreak:        boolean('partner_can_see_streak').default(true),
  partnerCanSeePillars:       boolean('partner_can_see_pillars').default(true),

  // Health sync
  healthSyncEnabled:          boolean('health_sync_enabled').default(false),
  healthSyncPlatform:         text('health_sync_platform'),
  // 'apple_health' | 'google_health_connect'

  // RevenueCat
  revenuecatUserId:           text('revenuecat_user_id').unique(),

  // Timestamps
  createdAt:                  timestamp('created_at').defaultNow().notNull(),
  updatedAt:                  timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
  revenuecatIdx: index('users_revenuecat_idx').on(table.revenuecatUserId),
}))

// ─────────────────────────────────────────────────────────────
// USER_PROFILES
// AI living profile document — updated weekly by the Worker
// ─────────────────────────────────────────────────────────────

export const userProfiles = pgTable('user_profiles', {
  userId:           uuid('user_id').primaryKey()
                    .references(() => users.id, { onDelete: 'cascade' }),

  // Three-pillar summaries (AI-generated, updated weekly)
  spiritualSummary: text('spiritual_summary').default(''),
  mentalSummary:    text('mental_summary').default(''),
  physicalSummary:  text('physical_summary').default(''),

  // Recurring themes extracted across sessions
  // e.g. ['patience_at_home', 'work_stress', 'family_leadership']
  recurringThemes:  text('recurring_themes').array().default([]),

  // Current Bible study track progress
  currentTrackId:   uuid('current_track_id')
                    .references(() => bibleTracks.id, { onDelete: 'set null' }),
  currentTrackDay:  integer('current_track_day').default(1),

  // Streak tracking
  streakDays:       integer('streak_days').default(0),
  longestStreak:    integer('longest_streak').default(0),
  lastActivityDate: date('last_activity_date'),

  // Profile metadata
  lastSynthesizedAt: timestamp('last_synthesized_at'),
  updatedAt:         timestamp('updated_at').defaultNow(),
})

// ─────────────────────────────────────────────────────────────
// CHECKIN_SESSIONS
// One record per daily AI check-in. Never stores raw transcript.
// ─────────────────────────────────────────────────────────────

export const checkinSessions = pgTable('checkin_sessions', {
  id:             uuid('id').primaryKey().defaultRandom(),
  userId:         uuid('user_id').notNull()
                  .references(() => users.id, { onDelete: 'cascade' }),
  date:           date('date').notNull(),

  // AI-generated structured summaries (not raw conversation)
  spiritualNotes: text('spiritual_notes').default(''),
  mentalNotes:    text('mental_notes').default(''),
  physicalNotes:  text('physical_notes').default(''),

  // Action/challenge given by Elijah
  actionGiven:    text('action_given'),
  actionFollowUp: text('action_follow_up'), // Did they do it? (next session)

  // Thematic flags for living profile
  flags:          text('flags').array().default([]),

  // Observed data (in-app)
  bibleSeconds:   integer('bible_seconds').default(0),
  prayerSeconds:  integer('prayer_seconds').default(0),
  tracksCompleted: text('tracks_completed').array().default([]),

  // Health data (from sync)
  sleepHours:     text('sleep_hours'),      // stored as string "7.4"
  sleepQuality:   text('sleep_quality'),    // 'poor' | 'fair' | 'good'
  workoutDone:    boolean('workout_done').default(false),
  workoutMinutes: integer('workout_minutes').default(0),
  stepCount:      integer('step_count'),

  // Weekly survey data
  stressLevel:    integer('stress_level'),  // 1-5 self-reported
  energyLevel:    integer('energy_level'),  // 1-5 self-reported

  createdAt:      timestamp('created_at').defaultNow(),
}, (table) => ({
  userDateIdx: uniqueIndex('checkin_user_date_idx').on(table.userId, table.date),
  userIdx: index('checkin_user_idx').on(table.userId),
  dateIdx: index('checkin_date_idx').on(table.date),
}))

// ─────────────────────────────────────────────────────────────
// BIBLE_TRACKS
// Study track library
// ─────────────────────────────────────────────────────────────

export const bibleTracks = pgTable('bible_tracks', {
  id:              uuid('id').primaryKey().defaultRandom(),
  title:           text('title').notNull(),
  description:     text('description').notNull(),
  shortDesc:       text('short_desc'),      // 1-line tagline
  totalDays:       integer('total_days').notNull(),
  tierRequired:    trackTierEnum('tier_required').default('premium').notNull(),
  isCurrentFree:   boolean('is_current_free').default(false),
  // True for the one currently featured on free tier

  audioGenerated:  boolean('audio_generated').default(false),
  coverImageUrl:   text('cover_image_url'),
  sortOrder:       integer('sort_order').default(0),

  // Scripture references for this track
  primaryBook:     text('primary_book'),    // e.g. 'Romans'
  scriptureRange:  text('scripture_range'), // e.g. 'Romans 1-16'

  createdAt:       timestamp('created_at').defaultNow(),
  publishedAt:     timestamp('published_at'),
}, (table) => ({
  sortIdx: index('tracks_sort_idx').on(table.sortOrder),
  tierIdx: index('tracks_tier_idx').on(table.tierRequired),
}))

// ─────────────────────────────────────────────────────────────
// BIBLE_TRACK_DAYS
// Individual day content within a track
// ─────────────────────────────────────────────────────────────

export const bibleTrackDays = pgTable('bible_track_days', {
  id:           uuid('id').primaryKey().defaultRandom(),
  trackId:      uuid('track_id').notNull()
                .references(() => bibleTracks.id, { onDelete: 'cascade' }),
  dayNumber:    integer('day_number').notNull(),
  title:        text('title').notNull(),
  scriptureRef: text('scripture_ref').notNull(), // e.g. 'Romans 8:1-17'
  content:      text('content').notNull(),        // Devotional body text
  audioFileUrl: text('audio_file_url'),           // B2/CDN URL, null if not generated
  readingMins:  integer('reading_mins').default(5),
}, (table) => ({
  trackDayIdx: uniqueIndex('track_day_idx').on(table.trackId, table.dayNumber),
}))

// ─────────────────────────────────────────────────────────────
// USER_TRACK_PROGRESS
// Tracks a user's progress through a Bible study track
// ─────────────────────────────────────────────────────────────

export const userTrackProgress = pgTable('user_track_progress', {
  id:           uuid('id').primaryKey().defaultRandom(),
  userId:       uuid('user_id').notNull()
                .references(() => users.id, { onDelete: 'cascade' }),
  trackId:      uuid('track_id').notNull()
                .references(() => bibleTracks.id, { onDelete: 'cascade' }),
  currentDay:   integer('current_day').default(1),
  completedAt:  timestamp('completed_at'),
  startedAt:    timestamp('started_at').defaultNow(),
  lastReadAt:   timestamp('last_read_at'),
}, (table) => ({
  userTrackIdx: uniqueIndex('user_track_idx').on(table.userId, table.trackId),
}))

// ─────────────────────────────────────────────────────────────
// PRAYER_REQUESTS (Phase 2)
// ─────────────────────────────────────────────────────────────

export const prayerRequests = pgTable('prayer_requests', {
  id:               uuid('id').primaryKey().defaultRandom(),
  userId:           uuid('user_id').notNull()
                    .references(() => users.id, { onDelete: 'cascade' }),
  content:          text('content').notNull(),    // Max 500 chars, enforced in API
  isAnonymous:      boolean('is_anonymous').default(false),
  category:         prayerCategoryEnum('category').default('other'),

  // Reaction counts (denormalized for fast reads)
  reactionPrayed:   integer('reaction_prayed').default(0),
  reactionWithYou:  integer('reaction_with_you').default(0),
  reactionStanding: integer('reaction_standing').default(0),

  // AI content filter
  filterStatus:     filterStatusEnum('filter_status').default('pending'),
  filterReason:     text('filter_reason'), // Populated on rejection

  // Soft delete (don't purge from DB — keep for audit)
  isActive:         boolean('is_active').default(true),

  createdAt:        timestamp('created_at').defaultNow(),
  updatedAt:        timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('prayer_user_idx').on(table.userId),
  statusIdx: index('prayer_status_idx').on(table.filterStatus),
  categoryIdx: index('prayer_category_idx').on(table.category),
  createdIdx: index('prayer_created_idx').on(table.createdAt),
}))

// ─────────────────────────────────────────────────────────────
// PRAYER_REACTIONS
// One record per user-reaction-request combination
// Prevents double-reacting
// ─────────────────────────────────────────────────────────────

export const prayerReactions = pgTable('prayer_reactions', {
  id:              uuid('id').primaryKey().defaultRandom(),
  prayerRequestId: uuid('prayer_request_id').notNull()
                   .references(() => prayerRequests.id, { onDelete: 'cascade' }),
  userId:          uuid('user_id').notNull()
                   .references(() => users.id, { onDelete: 'cascade' }),
  reactionType:    text('reaction_type').notNull(),
  // 'prayed' | 'with_you' | 'standing'
  createdAt:       timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueReaction: uniqueIndex('unique_prayer_reaction').on(
    table.prayerRequestId, table.userId, table.reactionType
  ),
}))

// ─────────────────────────────────────────────────────────────
// BETTER_AUTH TABLES (auto-created by Better Auth)
// Listed here for reference — do not manually define
// ─────────────────────────────────────────────────────────────

// users (Better Auth creates this — our `users` table above
//   uses `userId` as a separate app-level profile)
// sessions
// accounts (OAuth provider linkages)
// verifications (email verification tokens)
```

---

## Key Relationships

```
users (1) ──────────────── (1) user_profiles
users (1) ──────────────── (N) checkin_sessions
users (1) ──────────────── (N) user_track_progress
users (1) ──────────────── (N) prayer_requests
users (1) ──────────────── (N) prayer_reactions

bible_tracks (1) ─────────── (N) bible_track_days
bible_tracks (1) ─────────── (N) user_track_progress

prayer_requests (1) ──────── (N) prayer_reactions
```

---

## Indexing Strategy

Critical indexes for common query patterns:

| Index | Table | Columns | Reason |
|-------|-------|---------|--------|
| `checkin_user_date_idx` | checkin_sessions | user_id, date | Fetch recent sessions for AI context |
| `prayer_status_idx` | prayer_requests | filter_status | Feed query (approved only) |
| `prayer_created_idx` | prayer_requests | created_at | Chronological feed ordering |
| `user_track_idx` | user_track_progress | user_id, track_id | Check if user is enrolled |
| `unique_prayer_reaction` | prayer_reactions | request_id, user_id, type | Prevent duplicate reactions |

---

## Common Queries

### Get AI context for check-in
```typescript
// Last 3 sessions + user profile
const [profile, sessions] = await Promise.all([
  db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId)
  }),
  db.query.checkinSessions.findMany({
    where: eq(checkinSessions.userId, userId),
    orderBy: [desc(checkinSessions.date)],
    limit: 3
  })
])
```

### Get prayer feed (approved, recent)
```typescript
const feed = await db.query.prayerRequests.findMany({
  where: and(
    eq(prayerRequests.filterStatus, 'approved'),
    eq(prayerRequests.isActive, true)
  ),
  orderBy: [desc(prayerRequests.createdAt)],
  limit: 20,
  offset: page * 20,
  with: {
    user: {
      columns: { displayName: true }
    }
  }
})
```

### Check accountability alert eligibility
```typescript
const inactiveUsers = await db
  .select()
  .from(users)
  .leftJoin(checkinSessions, eq(users.id, checkinSessions.userId))
  .where(and(
    eq(users.tier, 'premium'),
    isNotNull(users.accountabilityPartnerEmail),
    eq(users.alertsPaused, false),
    // Last activity was more than threshold days ago
    // Note: use column reference outside the string literal — interpolating a column
    // inside INTERVAL '...' treats it as a value substitution, not an identifier.
    lt(
      userProfiles.lastActivityDate,
      sql`NOW() - (${users.alertThresholdDays} * INTERVAL '1 day')`
    )
  ))
```

---

*See also: [AI_ENGINE.md](AI_ENGINE.md) for how profile data is used, [ARCHITECTURE.md](ARCHITECTURE.md) for service context.*
