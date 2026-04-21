// apps/mobile/theme/colors.ts
// Sharper Man — Color Tokens

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
  goldTint:        'rgba(200, 168, 75, 0.07)',  // Verse block bg
  goldPill:        'rgba(200, 168, 75, 0.18)',  // Active nav pill bg
  cardGoldBg:      '#0F0C03',   // Featured card (Elijah, premium)

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
  success:         '#4CAF78',
  error:           '#E07060',

  // ── Borders ──────────────────────────────────────────────────
  borderDim:       'rgba(255, 255, 255, 0.06)',
  borderSubtle:    'rgba(255, 255, 255, 0.08)',
} as const

export type ColorKey = keyof typeof colors
