// apps/mobile/theme/layout.ts
// Sharper Man — Spacing, Radius & Navigation tokens

export const radius = {
  card:    22,    // One UI large card radius
  cardSm:  18,    // Track cards, prayer cards
  pill:    999,   // Buttons, filter chips, badges, nav indicator, inputs
  chip:    16,    // Stat chips
  week:    6,     // Week activity day squares
} as const

export const spacing = {
  screenH:  18,   // Horizontal screen padding
  cardP:    14,   // Card internal padding
  cardMb:   8,    // Gap between stacked cards
  chipGap:  6,    // Gap between stat chips
  gap:      8,    // Default element gap
} as const

export const nav = {
  height:   62,   // Bottom tab bar height
  pillW:    40,   // Active tab indicator pill width
  pillH:    26,   // Active tab indicator pill height
} as const
