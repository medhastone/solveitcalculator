import { TimeToolDefinition } from './types';

const PRESET_CONFIGS = [
  { seconds: 5, label: '5 Second Timer', slug: '5-second-timer' },
  { seconds: 10, label: '10 Second Timer', slug: '10-second-timer' },
  { seconds: 15, label: '15 Second Timer', slug: '15-second-timer' },
  { seconds: 20, label: '20 Second Timer', slug: '20-second-timer' },
  { seconds: 30, label: '30 Second Timer', slug: '30-second-timer' },
  { seconds: 45, label: '45 Second Timer', slug: '45-second-timer' },
  { seconds: 60, label: '60 Second Timer (1 Minute)', slug: '60-second-timer' },
  { seconds: 120, label: '2 Minute Timer', slug: '2-minute-timer' },
  { seconds: 180, label: '3 Minute Timer', slug: '3-minute-timer' },
  { seconds: 300, label: '5 Minute Timer', slug: '5-minute-timer' },
  { seconds: 600, label: '10 Minute Timer', slug: '10-minute-timer' },
  { seconds: 900, label: '15 Minute Timer', slug: '15-minute-timer' },
  { seconds: 1200, label: '20 Minute Timer', slug: '20-minute-timer' },
  { seconds: 1500, label: '25 Minute Timer (Pomodoro)', slug: '25-minute-timer' },
  { seconds: 1800, label: '30 Minute Timer', slug: '30-minute-timer' },
  { seconds: 2700, label: '45 Minute Timer', slug: '45-minute-timer' },
  { seconds: 3600, label: '1 Hour Timer', slug: '1-hour-timer' },
  { seconds: 7200, label: '2 Hour Timer', slug: '2-hour-timer' },
];

export const TIMER_TIME_TOOLS: TimeToolDefinition[] = [
  {
    slug: 'timers',
    canonicalPath: '/time-date/timers',
    category: 'timers',
    subcategoryTitle: 'Timers & Stopwatch Suite',
    name: 'Online Timer Suite',
    shortTitle: 'Timers & Stopwatch',
    metaTitle: 'Online Timers & Stopwatch | Free Full-Screen Presets & Alarms',
    metaDescription: 'Free online timer, stopwatch with lap splits, and instant preset countdown timers with Web Audio chime alerts and full-screen display.',
    keywords: ['online timer', 'stopwatch', 'preset timer', 'countdown timer with sound', 'pomodoro timer'],
    searchIntent: 'timer',
    calculatorType: 'custom-timer',
    relatedSlugs: ['5-minute-timer', '10-minute-timer', '25-minute-timer', 'stopwatch-timer'],
    faqs: [
      {
        question: 'Will the timer alert sound if I switch browser tabs?',
        answer: 'Yes, web timers utilize the Web Audio API and continue running accurately in background tabs.',
      },
      {
        question: 'Can I enter custom hours, minutes, and seconds?',
        answer: 'Yes, the custom timer lets you set any duration from 1 second up to 99 hours.',
      },
    ],
  },
  {
    slug: 'stopwatch-timer',
    canonicalPath: '/time-date/timers/stopwatch-timer',
    category: 'timers',
    subcategoryTitle: 'Timers & Stopwatch Suite',
    name: 'Online Stopwatch with Lap Counter',
    shortTitle: 'Stopwatch',
    metaTitle: 'Online Stopwatch | High Precision Millisecond Lap Counter',
    metaDescription: 'Millisecond-precision online stopwatch with split lap tracking, copy lap table, and keyboard shortcuts (Space to start/stop, L for lap).',
    keywords: ['online stopwatch', 'stopwatch with laps', 'millisecond stopwatch', 'lap timer'],
    searchIntent: 'timer',
    calculatorType: 'stopwatch',
    relatedSlugs: ['timers', '5-minute-timer', 'time-calculator'],
    faqs: [
      {
        question: 'How accurate is the online stopwatch?',
        answer: 'It calculates elapsed time using the high-resolution performance.now() browser clock with millisecond precision.',
      },
    ],
  },
  ...PRESET_CONFIGS.map(
    (cfg): TimeToolDefinition => ({
      slug: cfg.slug,
      canonicalPath: `/time-date/timers/${cfg.slug}`,
      category: 'timers',
      subcategoryTitle: 'Quick Preset Timers',
      name: `${cfg.label}`,
      shortTitle: cfg.label,
      metaTitle: `${cfg.label} | Free Full-Screen Online Timer with Alarm`,
      metaDescription: `Start a free ${cfg.label} countdown immediately with one click. Features clean full-screen mode, visual flash, and chime alarm.`,
      keywords: [`${cfg.slug.replace(/-/g, ' ')}`, `${cfg.label.toLowerCase()}`, 'online timer alarm', 'quick timer'],
      searchIntent: 'timer',
      calculatorType: 'preset-timer',
      presetSeconds: cfg.seconds,
      relatedSlugs: ['timers', 'stopwatch-timer', cfg.seconds >= 60 ? '5-minute-timer' : '30-second-timer'],
      faqs: [
        {
          question: `How do I start the ${cfg.label}?`,
          answer: `Click the "Start" button or press the spacebar to begin the ${cfg.label} countdown instantly.`,
        },
      ],
    })
  ),
];
