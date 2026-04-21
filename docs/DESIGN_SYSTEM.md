# Design System — Sharper Man

## Design Language

Sharper Man's UI is built on **Samsung One UI design principles** with a custom Sharper Man brand layer on top. One UI was chosen for its large readable headers, generously rounded surfaces, and Samsung Health-style data presentation — all of which serve a masculine, achievement-oriented audience well.

The result is a dark, premium-feeling app that feels native on Android and intentional on iOS.

---

## Design Foundations

### One UI Principles We Inherit

| Principle | How It Appears in Sharper Man |
|-----------|-------------------------------|
| Large collapsible headers | Every screen opens with a two-line display header (eyebrow label + large Cormorant title) |
| Heavily rounded cards | Cards use 22px border radius — more generous than standard iOS |
| Pill-shaped CTAs | Primary buttons are fully pill-shaped (border-radius: 999px) |
| Bottom nav pill indicator | Active tab gets a pill background, not just a color change |
| Health-style metric chips | 3-up stat chips for streaks, progress scores, and pillar percentages |
| Filter chip rows | Horizontally scrollable category pills (prayer wall, track browser) |
| Layered card depth | Cards sit at `#1A1A1A` on `#080808` — subtle but clear elevation |

### The Sharper Man Brand Layer Applied on Top

| One UI Default | Sharper Man Override |
|---------------|---------------------|
| Samsung blue accent | **Gold #C8A84B** |
| White / light gray backgrounds | **Deep black #080808 + charcoal #1A1A1A** |
| Roboto / One UI Sans | **Cormorant Garamond** (display) + **DM Sans** (body) |
| Generic health metric colors | **Three-pillar system** — gold / steel blue / royal purple |

---

## Color System

```typescript
// theme/colors.ts

export const colors = {
  // ── Core Backgrounds ─────────────────────────────────────────
  black:           '#080808',   // Primary screen background
  charcoalDeep:    '#0F0F0F',   // Bottom nav, input backgrounds
  charcoal:        '#1A1A1A',   // Card surfaces (One UI card layer)
  charcoalMid:     '#242424',   // Secondary cards, nested surfaces
  charcoalLight:   '#2A2A2A',   // Progress bar tracks, skeleton loaders
  charcoalBorder:  '#252525',   // Week day squares (unfilled)

  // ── Gold — Primary Brand Accent ──────────────────────────────
  gold:            '#C8A84B',   // CTAs, active states, spiritual pillar
  goldLight:       '#E4C97A',   // Active text, verse quotes
  goldDim:         '#8A6F2E',   // Muted gold — left borders, pill fills
  goldSubtle:      'rgba(200, 168, 75, 0.12)',  // Card tints, badge bgs
  goldBorder:      'rgba(200, 168, 75, 0.30)',  // Card borders, outlines

  // ── Text ─────────────────────────────────────────────────────
  white:           '#F5F0E8',   // Primary text — warm white
  whiteDim:        '#B8B0A0',   // Secondary text, body content
  whiteMuted:      '#706860',   // Placeholder, timestamps
  grey:            '#555555',   // Inactive nav icons, low-priority info

  // ── Three-Pillar System ──────────────────────────────────────
  spiritual:       '#C8A84B',   // Gold
  mental:          '#4B8EC8',   // Steel blue
  mentalSubtle:    'rgba(75, 142, 200, 0.15)',
  physical:        '#7C4BC8',   // Royal purple
  physicalSubtle:  'rgba(124, 75, 200, 0.15)',

  // ── Semantic ─────────────────────────────────────────────────
  successBright:   '#4CAF78',
  errorBright:     '#E07060',

  // ── Borders ──────────────────────────────────────────────────
  borderDim:       'rgba(255, 255, 255, 0.06)',
  borderSubtle:    'rgba(255, 255, 255, 0.08)',
}
```

---

## Typography

### Font Stack

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display | Cormorant Garamond | 700, 700 Italic | Screen titles, user names, stat values, verse quotes |
| Body / UI | DM Sans | 400, 500, 600 | Labels, descriptions, buttons, body copy |
| Monospace | DM Mono | 400, 500 | Timestamps, version strings (sparingly) |

### Expo Installation

```typescript
// app/_layout.tsx
import {
  CormorantGaramond_700Bold,
  CormorantGaramond_700Bold_Italic,
} from '@expo-google-fonts/cormorant-garamond'
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from '@expo-google-fonts/dm-sans'
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono'
```

### Type Scale

```typescript
// theme/typography.ts

export const type = {
  // Display — Cormorant Garamond
  screenTitle:  { fontFamily: 'CormorantGaramond_700Bold', fontSize: 28, lineHeight: 32 },
  cardTitle:    { fontFamily: 'CormorantGaramond_700Bold', fontSize: 18, lineHeight: 22 },
  statValue:    { fontFamily: 'CormorantGaramond_700Bold', fontSize: 21, lineHeight: 24 },
  verseText:    { fontFamily: 'CormorantGaramond_700Bold_Italic', fontSize: 13, lineHeight: 21 },

  // Body — DM Sans
  eyebrow:  { fontFamily: 'DMSans_600SemiBold', fontSize: 8, letterSpacing: 2.0, textTransform: 'uppercase' as const },
  label:    { fontFamily: 'DMSans_600SemiBold', fontSize: 8, letterSpacing: 1.8, textTransform: 'uppercase' as const },
  body:     { fontFamily: 'DMSans_400Regular', fontSize: 11, lineHeight: 17 },
  bodySm:   { fontFamily: 'DMSans_400Regular', fontSize: 10, lineHeight: 16 },
  caption:  { fontFamily: 'DMSans_400Regular', fontSize: 9, lineHeight: 14 },
  button:   { fontFamily: 'DMSans_600SemiBold', fontSize: 13, letterSpacing: 0.2 },
  buttonSm: { fontFamily: 'DMSans_600SemiBold', fontSize: 12 },
  badge:    { fontFamily: 'DMSans_600SemiBold', fontSize: 8, letterSpacing: 1.0, textTransform: 'uppercase' as const },
}
```

---

## Spacing & Shape

```typescript
// theme/layout.ts

export const radius = {
  card:    22,    // One UI large card radius
  cardSm:  18,    // Track cards, prayer cards
  pill:    999,   // Buttons, filter chips, badges, nav indicator
  chip:    16,    // Stat chips
  input:   999,   // Search bar, message input
  week:    6,     // Week activity day squares
}

export const spacing = {
  screenH:  18,   // Horizontal screen padding
  cardP:    14,   // Card internal padding
  cardMb:   8,    // Gap between stacked cards
  chipG:    6,    // Gap between stat chips
}

export const nav = {
  height:   62,   // Bottom nav bar height
  pillW:    40,   // Active tab indicator pill width
  pillH:    26,   // Active tab indicator pill height
}
```

---

## Component Library

### Screen Header (One UI Large Header)

Every screen uses this pattern. Small eyebrow label above a large two-line Cormorant title.

```tsx
const ScreenHeader = ({ eyebrow, title, highlight }) => (
  <View style={{ paddingHorizontal: 18, paddingTop: 8, paddingBottom: 4 }}>
    <Text style={{ ...type.eyebrow, color: colors.grey, marginBottom: 1 }}>
      {eyebrow}
    </Text>
    <Text style={{ ...type.screenTitle, color: colors.white }}>
      {title}
      {'\n'}
      <Text style={{ color: colors.gold, fontStyle: 'italic' }}>{highlight}</Text>
    </Text>
  </View>
)
// Example:
// eyebrow="⚔ SHARPER MAN"
// title="Good morning,"
// highlight="Marcus."
```

### Card (One UI Rounded Surface)

```tsx
const Card = ({ children, gold = false, style }) => (
  <View style={[{
    backgroundColor: gold ? '#0F0C03' : colors.charcoal,
    borderRadius: radius.card,
    padding: spacing.cardP,
    marginBottom: spacing.cardMb,
    borderWidth: gold ? 1 : 0,
    borderColor: gold ? colors.goldBorder : 'transparent',
  }, style]}>
    {children}
  </View>
)
// gold=true: used for featured cards (Elijah coach card, premium upsell)
```

### Card Label (Section Eyebrow)

```tsx
const CardLabel = ({ text, color = colors.gold }) => (
  <Text style={{ ...type.label, color, marginBottom: 7 }}>{text}</Text>
)
// "TODAY'S READING", "YOUR COACH", "THIS WEEK"
```

### Stat Chip Row (One UI Health Style)

Three-up metric display. Used on home and progress screens.

```tsx
const StatChipRow = ({ items }) => (
  <View style={{ flexDirection: 'row', gap: spacing.chipG, marginBottom: 8 }}>
    {items.map(({ value, label, color = colors.gold }) => (
      <View key={label} style={{
        flex: 1,
        backgroundColor: colors.charcoal,
        borderRadius: radius.chip,
        paddingVertical: 10,
        paddingHorizontal: 6,
        alignItems: 'center',
      }}>
        <Text style={{ ...type.statValue, color }}>{value}</Text>
        <Text style={{
          ...type.caption,
          color: colors.grey,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          marginTop: 2,
        }}>{label}</Text>
      </View>
    ))}
  </View>
)
// Usage:
// items={[
//   { value: '14', label: 'Day Streak' },
//   { value: '68%', label: 'Track' },
//   { value: '↑', label: 'Wellness', color: colors.successBright },
// ]}
```

### Primary Button (One UI Full-Pill)

```tsx
const PrimaryButton = ({ label, onPress, icon, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={{
      width: '100%',
      height: 48,
      backgroundColor: disabled ? colors.charcoalLight : colors.gold,
      borderRadius: radius.pill,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      marginTop: 8,
    }}
  >
    {icon}
    <Text style={{ ...type.button, color: disabled ? colors.whiteMuted : '#000000' }}>
      {label}
    </Text>
  </TouchableOpacity>
)
```

### Secondary Button (Outline Pill)

```tsx
const SecondaryButton = ({ label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      width: '100%',
      height: 42,
      borderRadius: radius.pill,
      borderWidth: 1.5,
      borderColor: 'rgba(200, 168, 75, 0.35)',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 6,
    }}
  >
    <Text style={{ ...type.buttonSm, color: colors.gold }}>{label}</Text>
  </TouchableOpacity>
)
```

### Progress Bar

```tsx
const ProgressBar = ({ value, color = colors.gold }) => (
  <View style={{
    height: 5,
    backgroundColor: colors.charcoalLight,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginVertical: 5,
  }}>
    <View style={{
      height: '100%',
      width: `${Math.min(100, Math.max(0, value))}%`,
      backgroundColor: color,
      borderRadius: radius.pill,
    }} />
  </View>
)
```

### Badge / Pill Label

```tsx
type BadgeVariant = 'gold' | 'blue' | 'purple' | 'premium'

const Badge = ({ text, variant = 'gold' }: { text: string; variant?: BadgeVariant }) => {
  const map: Record<BadgeVariant, { bg: string; color: string }> = {
    gold:    { bg: colors.goldSubtle,       color: colors.gold },
    blue:    { bg: colors.mentalSubtle,     color: '#88B8E8' },
    purple:  { bg: colors.physicalSubtle,   color: '#A888E8' },
    premium: { bg: 'rgba(138,111,46,0.1)',  color: colors.goldDim },
  }
  const s = map[variant]
  return (
    <View style={{ backgroundColor: s.bg, borderRadius: radius.pill, paddingVertical: 3, paddingHorizontal: 9 }}>
      <Text style={{ ...type.badge, color: s.color }}>{text}</Text>
    </View>
  )
}
```

### Filter Chip Row (Prayer Wall / Track Browser)

```tsx
const FilterChipRow = ({ options, selected, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8, gap: 5 }}
  >
    {options.map(opt => {
      const active = selected === opt
      return (
        <TouchableOpacity
          key={opt}
          onPress={() => onSelect(opt)}
          style={{
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: radius.pill,
            backgroundColor: active ? colors.goldSubtle : 'transparent',
            borderWidth: 1,
            borderColor: active ? colors.goldBorder : colors.borderSubtle,
          }}
        >
          <Text style={{
            fontFamily: 'DMSans_600SemiBold',
            fontSize: 10,
            color: active ? colors.gold : colors.whiteDim,
          }}>{opt}</Text>
        </TouchableOpacity>
      )
    })}
  </ScrollView>
)
```

### Week Activity Strip (Home Screen)

```tsx
const WeekStrip = ({ days }: { days: ('done' | 'partial' | 'empty')[] }) => (
  <View style={{ flexDirection: 'row', gap: 3 }}>
    {(['M','T','W','T','F','S','S'] as const).map((d, i) => (
      <View key={i} style={{ flex: 1, alignItems: 'center' }}>
        <View style={{
          height: 22,
          width: '100%',
          borderRadius: radius.week,
          backgroundColor:
            days[i] === 'done'    ? colors.gold :
            days[i] === 'partial' ? 'rgba(200,168,75,0.35)' :
            colors.charcoalBorder,
        }} />
        <Text style={{ ...type.caption, color: colors.grey, marginTop: 2 }}>{d}</Text>
      </View>
    ))}
  </View>
)
```

### Verse / Quote Block (Elijah Home Card)

Note: no border-radius on left side — never use rounded corners on a single-side border.

```tsx
const VerseBlock = ({ reference, text }) => (
  <View style={{
    backgroundColor: 'rgba(200, 168, 75, 0.07)',
    borderLeftWidth: 2,
    borderLeftColor: colors.goldDim,
    borderTopRightRadius: radius.cardSm,
    borderBottomRightRadius: radius.cardSm,
    paddingVertical: 9,
    paddingHorizontal: 11,
    marginBottom: 8,
  }}>
    {reference && (
      <Text style={{ ...type.label, color: colors.gold, marginBottom: 3 }}>{reference}</Text>
    )}
    <Text style={{ ...type.verseText, color: colors.goldLight }}>{text}</Text>
  </View>
)
```

### AI Chat Bubbles (Check-In Screen)

```tsx
// Elijah's message — left aligned, charcoal with gold left border
const ElijahBubble = ({ text }) => (
  <View style={{ marginBottom: 6, maxWidth: '85%' }}>
    <Text style={{ ...type.label, color: colors.gold, marginBottom: 3 }}>Elijah</Text>
    <View style={{
      backgroundColor: colors.charcoal,
      borderRadius: 16,
      borderTopLeftRadius: 3,
      borderLeftWidth: 2,
      borderLeftColor: colors.goldDim,
      paddingVertical: 9,
      paddingHorizontal: 12,
    }}>
      <Text style={{ ...type.body, color: colors.whiteDim, lineHeight: 18 }}>{text}</Text>
    </View>
  </View>
)

// User's message — right aligned, gold-tinted
const UserBubble = ({ text }) => (
  <View style={{ alignItems: 'flex-end', marginBottom: 6 }}>
    <View style={{
      backgroundColor: 'rgba(200, 168, 75, 0.10)',
      borderRadius: 16,
      borderTopRightRadius: 3,
      paddingVertical: 9,
      paddingHorizontal: 12,
      maxWidth: '80%',
    }}>
      <Text style={{ ...type.body, color: colors.goldLight, lineHeight: 18 }}>{text}</Text>
    </View>
  </View>
)
```

### Prayer Card (Prayer Wall)

```tsx
const PrayerCard = ({ name, initials, avatarVariant = 'gold', time, text, reactions, onReact }) => {
  const avatarColors = {
    gold:   { bg: 'rgba(200,168,75,0.12)',  text: colors.gold },
    blue:   { bg: 'rgba(75,142,200,0.15)',  text: '#4B8EC8' },
    purple: { bg: 'rgba(124,75,200,0.15)',  text: '#7C4BC8' },
  }
  const av = avatarColors[avatarVariant]
  return (
    <View style={{ backgroundColor: colors.charcoal, borderRadius: radius.cardSm, padding: 13, marginBottom: 7 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 7 }}>
        <View style={{
          width: 26, height: 26, borderRadius: radius.pill,
          backgroundColor: av.bg,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ ...type.badge, fontSize: 9, color: av.text }}>{initials}</Text>
        </View>
        <Text style={{ ...type.body, fontWeight: '600', color: colors.white, flex: 1 }}>{name}</Text>
        <Text style={{ ...type.caption, color: colors.grey }}>{time}</Text>
      </View>
      <Text style={{ ...type.body, color: colors.whiteDim, lineHeight: 17, marginBottom: 8 }}>{text}</Text>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {reactions.map(r => (
          <TouchableOpacity
            key={r.type}
            onPress={() => onReact(r.type)}
            style={{
              paddingVertical: 4, paddingHorizontal: 9,
              borderRadius: radius.pill,
              backgroundColor: r.active
                ? 'rgba(200,168,75,0.10)'
                : 'rgba(255,255,255,0.05)',
            }}
          >
            <Text style={{
              fontFamily: 'DMSans_400Regular',
              fontSize: 10,
              color: r.active ? colors.gold : colors.whiteDim,
            }}>
              {r.emoji} {r.label} · {r.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
```

### Pillar Progress Row (Progress Screen)

```tsx
const PillarRow = ({ pillar, value, note }) => {
  const map = {
    spiritual: { color: colors.gold,     label: 'Spiritual' },
    mental:    { color: colors.mental,   label: 'Mental' },
    physical:  { color: colors.physical, label: 'Physical' },
  }
  const { color, label } = map[pillar]
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Text style={{ ...type.label, color }}>{label}</Text>
        <Text style={{ fontFamily: 'CormorantGaramond_700Bold', fontSize: 20, color }}>
          {Math.round(value)}%
        </Text>
      </View>
      <ProgressBar value={value} color={color} />
      {note && <Text style={{ ...type.caption, color: colors.grey, marginTop: 1 }}>{note}</Text>}
    </View>
  )
}
```

---

## Navigation

### Bottom Tab Bar

```
[Home] [Bible] [Check-In] [Prayer] [Progress]
```

| State | Icon fill | Label color | Background |
|-------|-----------|-------------|------------|
| Active | `#C8A84B` | `#C8A84B` | `rgba(200,168,75,0.18)` pill 40×26px |
| Inactive | `#555555` | `#555555` | None |

- Nav background: `#0F0F0F`
- Top border: `1px solid rgba(255,255,255,0.06)`
- Height: 62px
- Corner: `borderRadius: '0 0 42px 42px'` (follows phone body shape)

---

## Screen Architecture

### Home
Large header → 3-chip stat row → Today's Reading card → Elijah coach card → This Week strip

### Bible
Header + translation badge → Pill search bar → Current track card → 2-column track grid (locked tracks show `PREMIUM` badge)

### Check-In
Header + day badge → Scrollable chat (flex:1) → Sticky bottom input bar (pill input + gold send button)

### Prayer Wall
Header + `+ Submit` tappable badge → Horizontal filter chips → Scrollable prayer cards → 3-reaction system only (no text replies)

### Progress
Header + `30 days` badge → 3-chip pillar summary → Three Pillars card → Streaks card → Tracks Completed card

---

## Paywall Screen

```
Header: "Unlock" (white) + "Sharper Man" (gold italic)

Free card — charcoal, dim border
  $0 in Cormorant Garamond
  ✓ free features in whiteDim
  ✗ locked features in grey

Premium card — #0F0C03 bg, gold border (featured card treatment)
  $7.99 / month in Cormorant Garamond large
  "or $59.99/year · save 37%" in caption goldDim
  ✓ all features in white
  [Start Premium Today] — full-width primary pill button

"Cancel anytime. No contracts." — caption, grey, centered
```

---

## Onboarding Screens

All onboarding follows One UI's stepped onboarding pattern:

- Large centered illustration: 40×40 gold SVG icon on `rgba(200,168,75,0.10)` circle background
- Big Cormorant Garamond title — centered, 28px
- Body description — DM Sans, `whiteDim`, centered, max-width ~220px
- Primary pill CTA fixed at bottom
- 5-dot step indicator above CTA — active dot gold, inactive dots `charcoalLight`

Screens: Welcome → Profile → Goals → Accountability Partner → Health Sync → Notifications

---

## Micro-interactions

| Interaction | Animation |
|-------------|-----------|
| Prayer reaction tap | Emoji floats up 20px and fades — `react-native-reanimated` |
| Check-in message send | Gold ripple from send button center |
| Streak increment | Stat chip scales `1.0 → 1.15 → 1.0` |
| Track completion | Full-screen overlay: sword icon + "Track Complete" in Cormorant Garamond |
| Paywall | Slide-up bottom sheet |
| Loading / skeleton | Charcoal card shapes with a gold shimmer wave scan |

All durations: 180–280ms. Use `react-native-reanimated` v3 throughout. Do not use the legacy `Animated` API.

---

## System UI

```typescript
// Status bar
// Style: 'light-content' (white icons on dark background)
// Background: transparent — bleeds into #080808 screen bg

// Safe areas
// Always useSafeAreaInsets() — bottom nav sits above the OS gesture bar
// Top content starts below status bar — use insets.top for header top padding

// Keyboard avoiding
// Use KeyboardAvoidingView on check-in screen only (bottom input bar)
```

---

## Icons

All icons are inline SVG paths — no icon library dependency at launch.

Standard sizes:
- Bottom nav icons: 18×18px
- Card action icons: 13×13px
- Button icons: 13×13px with 5px gap to label text

The sword symbol `⚔` is the app's mark — used in the home eyebrow, app icon, and splash screen.

---

*See also: [PRODUCT.md](PRODUCT.md) for feature context, [ARCHITECTURE.md](ARCHITECTURE.md) for React Native project structure.*
