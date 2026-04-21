# Product Design — Sharper Man

## Vision

Sharper Man exists to solve a problem every existing Bible and devotional app ignores: **passive consumption doesn't create change**. Men can use YouVersion every day for a year and still be the same man — nobody follows up, nobody notices patterns, nobody holds them accountable.

Sharper Man is active. It knows your story. It follows up. It connects the dots between your Bible time, your stress levels, your sleep, and your walk with God. And when it sees a man going sideways, it calls in a real person.

### Target Audience

**The Sharper Man user** is a Christian man between 25–50 years old who:
- Wants to grow spiritually but struggles with consistency
- Has been let down by passive devotional apps
- Takes his faith seriously enough to pay for tools that actually work
- Values physical discipline alongside spiritual discipline
- Would benefit from accountability but lacks a strong accountability partner
- Is achievement-oriented and responds to data and measurable progress

---

## The Three Pillars

Every feature in Sharper Man maps to one or more of three core pillars:

| Pillar | What We Track | Data Sources |
|--------|--------------|--------------|
| **Spiritual** | Bible study consistency, prayer time, track completion, breakthrough moments, recurring struggles | In-app observation (reading time, prayer timer) + AI check-in |
| **Mental** | Stress levels, emotional patterns, leadership pressure, mental/emotional wins and struggles | Weekly survey + AI check-in conversations |
| **Physical** | Sleep quality, workout consistency, activity levels, energy trends | Apple HealthKit / Google Health Connect + self-report |

The AI synthesizes all three pillars weekly into a living profile and uses it to coach the user proactively — not just answer questions.

---

## Phases

### Phase 1 — Foundation
**Goal:** Launch a profitable MVP with a clear premium value proposition.
**Revenue target:** $2,500 MRR (break-even)
**Timeline:** 3–4 months from start

#### Free Tier
| Feature | Details |
|---------|---------|
| Bible Reader | KJV, ASV, WEB (public domain). Clean reader with chapter/verse navigation. |
| One Rotating Free Track | A single Bible study track released monthly, free for 30 days, then premium. |
| Daily Reading Plan | Standard chronological plan with short AI-generated devotional commentary. |
| Basic Streak Tracking | Consecutive daily reading streak displayed on home screen. |
| Push Notifications | Daily reminder to open the app. Configurable time. |

#### Premium Tier ($7.99/mo or $59.99/yr)
| Feature | Details |
|---------|---------|
| All Bible Study Tracks | Full library. Every track published, including all future releases. |
| ElevenLabs Voice Narration | Every track read aloud by a high-quality AI voice. Pre-generated and cached. |
| AI Accountability Coach (Elijah) | Daily check-in with a pastoral AI mentor that maintains persistent memory. |
| Three-Pillar Tracking | Automated spiritual observation + weekly mental/physical surveys + health sync. |
| Apple Health + Google Fit | Automatic pull of sleep, steps, workout minutes. |
| Accountability Partner System | Set up a real person to receive email alerts when your patterns deteriorate. |
| Early Access | First access to Phase 2, Phase 3 features before free users. |

#### Onboarding Flow (6 screens)
1. **Welcome** — Sharper Man brand, value proposition, Begin / Sign In
2. **Profile** — Display name, age range, church (optional), why they're here
3. **Goals** — Which pillar do you most want to work on? (spiritual / mental / physical / all three)
4. **Accountability Partner** — Enter partner email + name. Set alert threshold (5 / 7 / 10 days). Privacy settings for what partner can see.
5. **Health Sync** — Request HealthKit / Health Connect permissions. Explain what data is used and why.
6. **Notifications** — Set daily check-in reminder time.

---

### Phase 2 — Community
**Goal:** Add community without moderation overhead. Grow through viral accountability partner loop.
**Revenue target:** $8,000 MRR (~1,000 paid subscribers)
**Timeline:** 4–6 months after Phase 1 launch

#### New Features
| Feature | Details |
|---------|---------|
| Prayer Request Wall | Text-only submissions (500 char max). AI-filtered before publishing. Anonymous or named. |
| Prayer Categories | Family, health, work, faith, other. Filterable in feed. |
| Reaction System | 🙏 Prayed, ❤️ With You, 🔥 Standing in Faith. No text replies. Zero moderation needed. |
| Prayer Notifications | Submitter gets push notification: "8 brothers prayed for your request today." |
| Prayer Timer | Dedicated in-app prayer timer. Duration logged to spiritual profile. |
| AI Pattern Correlations | AI begins surfacing cross-pillar insights: "Every time your sleep drops below 6 hours, you miss Bible time. This has happened 4 times." |
| Monthly Progress Report | AI-generated PDF-style summary of the user's 30-day journey sent via email and saved in-app. |
| Adaptive Check-In Questions | AI questions evolve based on current patterns rather than static prompt templates. |
| Accountability Partner Portal | Simple email-based summary for partners. No app required. |

#### Prayer Request Content Filtering
Every prayer request passes through Claude Haiku before storage:
- Profanity and hate speech check
- Crisis-level distress signal detection (if found → gentle redirect to real support, not published)
- Personally identifying information about third parties
- Spam and off-topic content

Rejected submissions return a graceful error with guidance. No human moderation required.

---

### Phase 3 — Whole Man
**Goal:** Expand into full holistic discipleship. New revenue streams via B2B church partnerships.
**Revenue target:** $25,000+ MRR
**Timeline:** 6–12 months after Phase 2

#### New Features
| Feature | Details |
|---------|---------|
| Workout Track Library | Weekly workout plans tied to discipleship themes. Scripture for each session. |
| Workout Logging | Simple daily log: completed? Duration. Notes. Synced to physical profile. |
| Basic Meal Guidance | Weekly nutrition principles — not calorie tracking. Tied to fasting and discipline themes. |
| Wearable Integration | Full Whoop, Oura Ring, Garmin Connect for HRV, recovery, sleep stages. |
| Whole-Man Dashboard | Unified view of all three pillars with historical trends and AI weekly diagnosis. |
| Community Groups | Small groups of 4–8 men. Shared feed and group prayer wall. Group leader moderation only. |
| Annual Bible Challenges | Year-long reading challenges with milestones, badges, leaderboards. |
| Church Partnership Program | Churches co-brand group features for men's ministry. B2B revenue. |
| Premium+ Tier | $14.99/mo — unlocks all Phase 3 features alongside Phase 1 and 2. |

---

## Freemium Conversion Strategy

The free tier is designed as a hook, not a product. It gives users enough to get invested but withholds the core value (Elijah, voice narration, health tracking, accountability partner). The conversion moment happens when:

1. A free user completes their first free track and sees that the full library is locked
2. A free user sees the "Your AI Coach is waiting" prompt after reading
3. A free user gets an email introducing the accountability partner feature

**Target free-to-paid conversion rate:** 15–20% within 90 days of install

---

## Content Strategy

### Bible Study Tracks
Launch with 5–10 tracks repurposed from existing content, AI-assisted and human-reviewed. Add 1–2 new tracks monthly. Track length: 14–30 days.

**Initial track ideas:**
- Romans: The Gospel Unpacked (28 days)
- The Psalms of Ascent: A Man's Journey Upward (15 days)
- Proverbs: Wisdom for Every Area of Life (30 days)
- Ephesians: Standing Firm (21 days)
- The Sermon on the Mount: Kingdom Living (14 days)

### AI-Generated Commentary
Daily reading plan commentary is AI-generated using Claude Sonnet, reviewed in batches before publishing. Focus: brief (150–200 words), masculine in tone, practical application.

### Voice Narration
All track content is pre-generated via ElevenLabs once and stored in Backblaze B2. Served via Cloudflare CDN. Users stream on-demand. No per-stream cost after generation.

---

## Key Design Principles

1. **Active, not passive** — The app reaches out to you. You don't just consume.
2. **Masculine, not soft** — Direct language, achievement-oriented design, no unnecessary sentimentality.
3. **Holistic, not spiritual-only** — A man who neglects his body neglects his discipline. All three pillars matter.
4. **Community without chaos** — Reactions-only prayer wall eliminates moderation while preserving brotherhood.
5. **Human in the loop** — The AI coach is powerful but always points toward real people. Elijah never replaces your pastor.
6. **Data-driven discipleship** — If you can't measure it, you can't improve it. Streaks, completion rates, pillar scores.

---

*See also: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for UI/UX details, [REVENUE.md](REVENUE.md) for full business model.*
