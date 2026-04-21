// apps/mobile/theme/typography.ts
// Sharper Man — Type Scale
// Fonts loaded in app/_layout.tsx via @expo-google-fonts

export const type = {
  // ── Display — Cormorant Garamond ─────────────────────────────
  screenTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 28,
    lineHeight: 32,
  },
  cardTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 18,
    lineHeight: 22,
  },
  statValue: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 21,
    lineHeight: 24,
  },
  verseText: {
    fontFamily: 'CormorantGaramond_700Bold_Italic',
    fontSize: 13,
    lineHeight: 21,
  },

  // ── Body / UI — DM Sans ───────────────────────────────────────
  eyebrow: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 8,
    letterSpacing: 2.0,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 8,
    letterSpacing: 1.8,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    lineHeight: 17,
  },
  bodySm: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    lineHeight: 16,
  },
  caption: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 9,
    lineHeight: 14,
  },
  button: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  buttonSm: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
  },
  badge: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 8,
    letterSpacing: 1.0,
    textTransform: 'uppercase' as const,
  },

  // ── Mono — DM Mono ────────────────────────────────────────────
  mono: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 9,
  },
  monoMd: {
    fontFamily: 'DMMono_500Medium',
    fontSize: 10,
  },
} as const
