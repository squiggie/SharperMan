// apps/mobile/theme/pulse.ts
// Sharper Man — Daily Pulse question definitions
// These feed the Check-In screen's daily reflection quiz.
// Answers are stored in the check_in_responses table and surfaced
// to Elijah as context in the AI prompt (see docs/AI_ENGINE.md).

export type PulseQuestionType = 'mood' | 'grouped' | 'multiselect' | 'single' | 'text'

export interface MoodOption {
  value: string
  label: string
  icon: string
}

export interface GroupedGroup {
  label: string
  color: string
  items: string[]
}

export interface SingleOption {
  value: string
  label: string
  color: string
}

export interface PulseQuestion {
  id: string
  type: PulseQuestionType
  question: string
  subtitle?: string
  // mood
  options?: MoodOption[] | string[] | SingleOption[]
  // grouped
  groups?: GroupedGroup[]
  // text
  placeholder?: string
}

export const PULSE_QUESTIONS: PulseQuestion[] = [
  {
    id: 'mood',
    type: 'mood',
    question: 'How are you showing up today?',
    options: [
      { value: 'locked_in',  label: 'Locked in',  icon: '⚔' },
      { value: 'steady',     label: 'Steady',     icon: '🏔' },
      { value: 'distracted', label: 'Distracted', icon: '🌀' },
      { value: 'tired',      label: 'Tired',      icon: '🌧' },
      { value: 'struggling', label: 'Struggling', icon: '⚡' },
    ] as MoodOption[],
  },
  {
    id: 'struggled',
    type: 'grouped',
    question: 'Today I struggled with…',
    subtitle: 'Select all that apply — or skip',
    groups: [
      { label: 'Spiritual',  color: '#C8A84B', items: ['Doubt', 'Lack of prayer', 'Spiritual dryness', 'Pornography', 'Lust'] },
      { label: 'Mental',     color: '#4B8EC8', items: ['Anxiety', 'Overthinking', 'Negative self-talk', 'Comparison', 'Hopelessness'] },
      { label: 'Relational', color: '#7C4BC8', items: ['Anger', 'Pride', 'Conflict', 'Isolation', 'Bitterness'] },
      { label: 'Physical',   color: '#4CAF78', items: ['Laziness', 'Poor diet', 'Skipped workout', 'Sleep', 'Substance use'] },
    ],
  },
  {
    id: 'overcame',
    type: 'grouped',
    question: 'Today I overcame…',
    subtitle: 'Select all that apply — or skip',
    groups: [
      { label: 'Spiritual',  color: '#C8A84B', items: ['Temptation', 'Skipping prayer', 'A moment of doubt', 'Spiritual distraction'] },
      { label: 'Mental',     color: '#4B8EC8', items: ['Negative self-talk', 'Anxiety spiral', 'Giving up', 'Fear of failure'] },
      { label: 'Relational', color: '#7C4BC8', items: ['Holding a grudge', 'Conflict', 'Isolation', 'A hard conversation'] },
      { label: 'Physical',   color: '#4CAF78', items: ['Skipping a workout', 'A bad habit', 'Poor eating', 'Staying up late'] },
    ],
  },
  {
    id: 'faith',
    type: 'multiselect',
    question: 'Today I…',
    subtitle: 'Check everything that happened',
    options: [
      'Shared my faith with someone',
      'Encouraged a brother',
      'Prayed with or for someone by name',
      'Shared my testimony',
      'Served without recognition',
      'Let an offense go',
      'Led my family spiritually',
      'Held my tongue when I wanted to react',
      'None of these today',
    ],
  },
  {
    id: 'gratitude',
    type: 'text',
    question: "One thing I'm grateful for today…",
    placeholder: 'Write anything — big or small',
  },
  {
    id: 'tomorrow',
    type: 'single',
    question: 'Tomorrow I want to focus on…',
    options: [
      { value: 'prayer',      label: 'Deeper prayer time',         color: '#C8A84B' },
      { value: 'scripture',   label: 'More time in Scripture',     color: '#C8A84B' },
      { value: 'clarity',     label: 'Mental clarity & focus',     color: '#4B8EC8' },
      { value: 'brotherhood', label: 'Connecting with a brother',  color: '#4B8EC8' },
      { value: 'discipline',  label: 'Physical discipline',        color: '#7C4BC8' },
      { value: 'rest',        label: 'Rest & recovery',            color: '#7C4BC8' },
    ] as SingleOption[],
  },
]

// Pillar scoring weights — how each pulse answer affects pillar scores
// Used by the scoring engine in services/api/src/jobs/
export const PILLAR_WEIGHTS = {
  struggled: {
    Spiritual: { pillar: 'spiritual', delta: -3 },
    'Lack of prayer': { pillar: 'spiritual', delta: -4 },
    'Spiritual dryness': { pillar: 'spiritual', delta: -3 },
    Pornography: { pillar: 'spiritual', delta: -6 },
    Lust: { pillar: 'spiritual', delta: -5 },
    Anxiety: { pillar: 'mental', delta: -4 },
    Overthinking: { pillar: 'mental', delta: -3 },
    'Negative self-talk': { pillar: 'mental', delta: -3 },
    Comparison: { pillar: 'mental', delta: -2 },
    Hopelessness: { pillar: 'mental', delta: -5 },
    Anger: { pillar: 'mental', delta: -3 },
    Pride: { pillar: 'mental', delta: -2 },
    Conflict: { pillar: 'mental', delta: -3 },
    Isolation: { pillar: 'mental', delta: -4 },
    Bitterness: { pillar: 'mental', delta: -3 },
    Laziness: { pillar: 'physical', delta: -3 },
    'Poor diet': { pillar: 'physical', delta: -2 },
    'Skipped workout': { pillar: 'physical', delta: -4 },
    Sleep: { pillar: 'physical', delta: -3 },
    'Substance use': { pillar: 'physical', delta: -6 },
  },
  overcame: {
    Temptation: { pillar: 'spiritual', delta: +5 },
    'Skipping prayer': { pillar: 'spiritual', delta: +4 },
    'A moment of doubt': { pillar: 'spiritual', delta: +3 },
    'Spiritual distraction': { pillar: 'spiritual', delta: +3 },
    'Negative self-talk': { pillar: 'mental', delta: +4 },
    'Anxiety spiral': { pillar: 'mental', delta: +4 },
    'Giving up': { pillar: 'mental', delta: +5 },
    'Fear of failure': { pillar: 'mental', delta: +4 },
    'Holding a grudge': { pillar: 'mental', delta: +4 },
    Conflict: { pillar: 'mental', delta: +3 },
    Isolation: { pillar: 'mental', delta: +4 },
    'A hard conversation': { pillar: 'mental', delta: +5 },
    'Skipping a workout': { pillar: 'physical', delta: +4 },
    'A bad habit': { pillar: 'physical', delta: +4 },
    'Poor eating': { pillar: 'physical', delta: +3 },
    'Staying up late': { pillar: 'physical', delta: +3 },
  },
} as const
