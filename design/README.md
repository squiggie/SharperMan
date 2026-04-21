# Design System Integration

This folder contains files ready to drop into the SharperMan repo.

## Drop these into your repo:

### `apps/mobile/theme/`
Production TypeScript token files — import these directly in your RN components:

```ts
import { colors, type, radius, spacing, nav } from '@/theme'
import { PULSE_QUESTIONS, PILLAR_WEIGHTS } from '@/theme/pulse'
```

| File | Contents |
|------|----------|
| `colors.ts` | Full color token map with `as const` |
| `typography.ts` | Type scale — all `fontFamily`, `fontSize`, `lineHeight`, `letterSpacing` |
| `layout.ts` | `radius`, `spacing`, `nav` tokens |
| `index.ts` | Barrel export — import from `@/theme` |
| `pulse.ts` | Daily Pulse question definitions + pillar scoring weights |

### `design/`
HTML design reference files — **not production code**. Open in a browser for visual reference.

| File | Contents |
|------|----------|
| `ui-kit/index.html` | Full interactive 5-screen mobile prototype |
| `ui-kit/Components.jsx` | Shared primitive components |
| `ui-kit/HomeScreen.jsx` | Home screen |
| `ui-kit/BibleScreen.jsx` | Bible tracks screen |
| `ui-kit/CheckInScreen.jsx` | Daily Check-In + Daily Pulse quiz |
| `ui-kit/PrayerScreen.jsx` | Prayer wall |
| `ui-kit/ProgressScreen.jsx` | Progress dashboard |

## Usage in production components

```tsx
import { colors, type, radius, spacing } from '@/theme'

const MyCard = () => (
  <View style={{
    backgroundColor: colors.charcoal,
    borderRadius: radius.card,
    padding: spacing.cardP,
  }}>
    <Text style={{ ...type.cardTitle, color: colors.white }}>
      Hello
    </Text>
  </View>
)
```

## Daily Pulse → Elijah context

When a user completes the Daily Pulse, pass `answers` to your AI prompt builder:

```ts
import { PULSE_QUESTIONS, PILLAR_WEIGHTS } from '@/theme/pulse'

// Score pillar deltas from answers
const scoreDeltas = { spiritual: 0, mental: 0, physical: 0 }
answers.struggled?.forEach(item => {
  const w = PILLAR_WEIGHTS.struggled[item]
  if (w) scoreDeltas[w.pillar] += w.delta
})
answers.overcame?.forEach(item => {
  const w = PILLAR_WEIGHTS.overcame[item]
  if (w) scoreDeltas[w.pillar] += w.delta
})
```
