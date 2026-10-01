export interface ToolItem {
  id: string;
  name: string;
  badge: string;
  category: string;
  desc: string;
  anchor: string;
  tags?: string[];
  popular?: boolean;
  intent?: string;
}

export interface CategoryGroup {
  id: string;
  name: string;
  icon: string;
  description: string;
  tools: ToolItem[];
}

export const POPULAR_TOOLS: ToolItem[] = [
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    badge: 'Calendar-Aware',
    category: 'Age & Birthdays',
    desc: 'Calculate exact chronological age in years, months, days, and total days.',
    anchor: '/time-date/age-calculator',
    popular: true,
  },
  {
    id: 'days-between-dates',
    name: 'Days Between Dates',
    badge: 'Inclusive/Exclusive',
    category: 'Date Calculations',
    desc: 'Count exact calendar days, weeks, and total elapsed duration between two dates.',
    anchor: '/time-date/days-between-dates',
    popular: true,
  },
  {
    id: 'days-calculator',
    name: 'Days Calculator',
    badge: '±Days Arithmetic',
    category: 'Date Calculations',
    desc: 'Add or subtract days, weeks, months, or years from any starting date.',
    anchor: '/time-date/days-calculator',
    popular: true,
  },
  {
    id: 'business-days-calculator',
    name: 'Business Days Calculator',
    badge: 'Workdays & Holidays',
    category: 'Business Days',
    desc: 'Calculate working days between dates excluding weekends and selected holidays.',
    anchor: '/business-days-calculator',
    popular: true,
  },
  {
    id: 'time-calculator',
    name: 'Time Calculator',
    badge: 'HH:MM:SS',
    category: 'Time Calculations',
    desc: 'Add, subtract, and total hours, minutes, and seconds with automatic carry-over.',
    anchor: '/time-date/time-calculator',
    popular: true,
  },
  {
    id: 'add-subtract-time',
    name: 'Add & Subtract Time',
    badge: 'Date & Clock',
    category: 'Time Calculations',
    desc: 'Add or subtract hours, minutes, days, or months to any specific timestamp.',
    anchor: '/time-date/add-subtract-time',
    popular: true,
  },
  {
    id: 'time-zone-converter',
    name: 'Time Zone Converter',
    badge: 'Global Clock',
    category: 'Time Zones',
    desc: 'Compare local times and UTC offsets across global cities with DST awareness.',
    anchor: '/time-date/time-zone-converter',
    popular: true,
  },
  {
    id: 'event-countdown',
    name: 'Event Countdown',
    badge: 'Live Timer',
    category: 'Countdowns',
    desc: 'Count down days, hours, and minutes until birthdays, vacations, and milestones.',
    anchor: '/time-date/event-countdown',
    popular: true,
  },
  {
    id: 'work-hours',
    name: 'Work Hours Calculator',
    badge: 'Break & Overtime',
    category: 'Work & Payroll',
    desc: 'Calculate daily shift hours, unpaid meal breaks, and billable time totals.',
    anchor: '/time-date/work-hours',
    popular: true,
  },
  {
    id: 'birthday-tracker',
    name: 'Birthday Countdown',
    badge: 'Milestone Tracker',
    category: 'Age & Birthdays',
    desc: 'See days until your next birthday, day of the week born, and half-birthdays.',
    anchor: '/time-date/birthday-tracker',
    popular: true,
  },
  {
    id: 'retirement-countdown-in-workdays',
    name: 'Retirement Countdown',
    badge: 'Shifts & Workdays',
    category: 'Countdowns',
    desc: 'See calendar days, workdays, and shifts remaining until a planned retirement date.',
    anchor: '/time-date/retirement-countdown-in-workdays',
    popular: true,
  },
  {
    id: 'date-difference',
    name: 'Duration Calculator',
    badge: 'Precise Delta',
    category: 'Date Calculations',
    desc: 'Calculate exact time duration between dates in years, months, days, and hours.',
    anchor: '/time-date/date-difference',
    popular: true,
  },
];

export const ALL_TOOLS_CATALOG: ToolItem[] = [
  ...POPULAR_TOOLS,
  {
    id: 'pet-age-converter',
    name: 'Pet Age Converter',
    badge: 'Veterinary Curve',
    category: 'Age & Birthdays',
    desc: 'Convert canine and feline age into human equivalent years based on weight size.',
    anchor: '/time-date/pet-age-converter',
  },
  {
    id: 'julian-day-calculator',
    name: 'Julian Day Calculator',
    badge: 'Astronomical',
    category: 'Advanced Calendar',
    desc: 'Convert dates to continuous astronomical day numbers (JD and MJD).',
    anchor: '/time-date/julian-day-calculator',
  },
  {
    id: 'leap-year-calculator',
    name: 'Leap Year Calculator',
    badge: 'Gregorian Rules',
    category: 'Date Calculations',
    desc: 'Check if any year is a leap year using the 4, 100, and 400-year calendar rule.',
    anchor: '/time-date/leap-year-calculator',
  },
  {
    id: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    badge: 'Epoch Seconds',
    category: 'Advanced Calendar',
    desc: 'Two-way conversion between Unix epoch seconds/milliseconds and UTC date strings.',
    anchor: '/time-date/unix-timestamp-converter',
  },
  {
    id: 'military-time-converter',
    name: 'Military Time Converter',
    badge: '24-Hour Format',
    category: 'Time Calculations',
    desc: 'Quickly convert between 12-hour AM/PM and 24-hour military clock time.',
    anchor: '/time-date/military-time-converter',
  },
  {
    id: 'world-clock-grid',
    name: 'World Clock Grid',
    badge: 'Multi-City',
    category: 'Time Zones',
    desc: 'Monitor concurrent local times across major international finance and business hubs.',
    anchor: '/time-date/world-clock-grid',
  },
  {
    id: 'time-zone-overlap',
    name: 'Time Zone Overlap Scheduler',
    badge: 'Meeting Planner',
    category: 'Time Zones',
    desc: 'Identify overlapping business hours between team members in different time zones.',
    anchor: '/time-date/time-zone-overlap',
  },
  {
    id: 'dst-transition-tracker',
    name: 'Daylight Saving Time Tracker',
    badge: 'Clock Transitions',
    category: 'Time Zones',
    desc: 'Check upcoming DST clock shifts, start/end dates, and regional hour changes.',
    anchor: '/time-date/dst-transition-tracker',
  },
  {
    id: 'global-meeting-matrix',
    name: 'Global Meeting Matrix',
    badge: 'Multi-Region',
    category: 'Time Zones',
    desc: 'Coordinate international calls across 3 or more time zones without confusion.',
    anchor: '/time-date/global-meeting-matrix',
  },
  {
    id: 'focus-and-break-timer',
    name: 'Focus & Break Timer',
    badge: 'Productivity',
    category: 'Work & Payroll',
    desc: 'Structured work intervals with 25/5 Pomodoro and 52/17 rest cycle support.',
    anchor: '/time-date/focus-and-break-timer',
  },
  {
    id: '90-minute-ultradian-rhythm-planner',
    name: 'Ultradian Rhythm Planner',
    badge: 'Work Blocks',
    category: 'Work & Payroll',
    desc: 'Plan 90-minute deep-work cycles aligned with biological attention curves.',
    anchor: '/time-date/90-minute-ultradian-rhythm-planner',
  },
  {
    id: 'plan-a-project-calculator',
    name: 'Project Timeline Calculator',
    badge: 'Milestone Planning',
    category: 'Business Days',
    desc: 'Estimate project completion dates accounting for working days and buffers.',
    anchor: '/time-date/plan-a-project-calculator',
  },
  {
    id: 'running-pace-calculator',
    name: 'Running Pace Calculator',
    badge: 'Splits & Speed',
    category: 'Time Calculations',
    desc: 'Calculate race finish times, kilometer splits, and training paces.',
    anchor: '/time-date/running-pace-calculator',
  },
];

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'date-calculators',
    name: 'Date Calculators',
    icon: 'Calendar',
    description:
      'Calculate chronological age, calendar spans, add/subtract days, and verify leap years with transparent counting methods.',
    tools: [
      ALL_TOOLS_CATALOG.find((t) => t.id === 'age-calculator')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'days-between-dates')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'days-calculator')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'birthday-tracker')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'date-difference')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'leap-year-calculator')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'pet-age-converter')!,
    ],
  },
  {
    id: 'time-calculators',
    name: 'Time Calculators',
    icon: 'Clock',
    description:
      'Add, subtract, and convert hours, minutes, and seconds. Handle decimal payroll time, running paces, and 24-hour formats.',
    tools: [
      ALL_TOOLS_CATALOG.find((t) => t.id === 'time-calculator')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'add-subtract-time')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'military-time-converter')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'running-pace-calculator')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'unix-timestamp-converter')!,
    ],
  },
  {
    id: 'business-days',
    name: 'Business Days & Workdays',
    icon: 'Building2',
    description:
      'Count working days between dates with custom workweeks (Mon–Fri, Mon–Sat) and selectable public holiday exclusions.',
    tools: [
      ALL_TOOLS_CATALOG.find((t) => t.id === 'business-days-calculator')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'days-calculator')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'plan-a-project-calculator')!,
    ],
  },
  {
    id: 'work-payroll',
    name: 'Work, Shift & Payroll',
    icon: 'Briefcase',
    description:
      'Track scheduled shift hours, deduct lunch breaks, calculate overtime, and configure productivity intervals.',
    tools: [
      ALL_TOOLS_CATALOG.find((t) => t.id === 'work-hours')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'focus-and-break-timer')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === '90-minute-ultradian-rhythm-planner')!,
    ],
  },
  {
    id: 'time-zones',
    name: 'Time Zones & Global Meetings',
    icon: 'Globe',
    description:
      'Compare local times, UTC offsets, daylight saving changes, and discover overlapping business hours across global cities.',
    tools: [
      ALL_TOOLS_CATALOG.find((t) => t.id === 'time-zone-converter')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'world-clock-grid')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'time-zone-overlap')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'dst-transition-tracker')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'global-meeting-matrix')!,
    ],
  },
  {
    id: 'countdowns',
    name: 'Countdowns & Milestones',
    icon: 'Hourglass',
    description:
      'Track the remaining days, hours, and minutes until planned retirement dates, birthdays, vacations, and key life events.',
    tools: [
      ALL_TOOLS_CATALOG.find((t) => t.id === 'event-countdown')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'birthday-tracker')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'retirement-countdown-in-workdays')!,
    ],
  },
  {
    id: 'advanced-calendar',
    name: 'Advanced Calendar & Developer Tools',
    icon: 'Terminal',
    description:
      'Specialized tools for astronomical day numbering, Unix timestamps, ISO 8601 formatting, and calendar anomalies.',
    tools: [
      ALL_TOOLS_CATALOG.find((t) => t.id === 'julian-day-calculator')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'unix-timestamp-converter')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'leap-year-calculator')!,
      ALL_TOOLS_CATALOG.find((t) => t.id === 'military-time-converter')!,
    ],
  },
];

export const GOAL_CARDS = [
  {
    title: 'CALCULATE MY AGE',
    desc: 'Find chronological age in years, months, and days, or celebrate milestones.',
    links: [
      { name: 'Age Calculator', href: '/time-date/age-calculator' },
      { name: 'Birthday Countdown', href: '/time-date/birthday-tracker' },
      { name: 'Pet Age Converter', href: '/time-date/pet-age-converter' },
    ],
  },
  {
    title: 'COUNT DAYS',
    desc: 'Count total calendar days, elapsed weeks, or business days between dates.',
    links: [
      { name: 'Days Between Dates', href: '/time-date/days-between-dates' },
      { name: 'Days Calculator', href: '/time-date/days-calculator' },
      { name: 'Business Days', href: '/business-days-calculator' },
    ],
  },
  {
    title: 'FIND A DATE',
    desc: 'Add or subtract days, weeks, months, or clock time to discover target deadlines.',
    links: [
      { name: 'Add/Subtract Days', href: '/time-date/days-calculator' },
      { name: 'Add/Subtract Time', href: '/time-date/add-subtract-time' },
      { name: 'Date Difference', href: '/time-date/date-difference' },
    ],
  },
  {
    title: 'CALCULATE WORK TIME',
    desc: 'Calculate shift hours, break deductions, overtime, and work intervals.',
    links: [
      { name: 'Work Hours Calculator', href: '/time-date/work-hours' },
      { name: 'Focus & Break Timer', href: '/time-date/focus-and-break-timer' },
      { name: 'Project Timeline', href: '/time-date/plan-a-project-calculator' },
    ],
  },
  {
    title: 'PLAN ACROSS TIME ZONES',
    desc: 'Compare global local times, UTC offsets, and identify meeting overlap windows.',
    links: [
      { name: 'Time Zone Converter', href: '/time-date/time-zone-converter' },
      { name: 'World Clock Grid', href: '/time-date/world-clock-grid' },
      { name: 'Meeting Overlap Scheduler', href: '/time-date/time-zone-overlap' },
      { name: 'DST Tracker', href: '/time-date/dst-transition-tracker' },
    ],
  },
  {
    title: 'COUNT DOWN TO AN EVENT',
    desc: 'Keep track of days and hours until birthdays, vacations, or retirement.',
    links: [
      { name: 'Event Countdown', href: '/time-date/event-countdown' },
      { name: 'Birthday Tracker', href: '/time-date/birthday-tracker' },
      { name: 'Retirement Countdown', href: '/time-date/retirement-countdown-in-workdays' },
    ],
  },
  {
    title: 'EXPLORE CALENDAR TOOLS',
    desc: 'Technical day numbers, 24-hour military clock, and calendar rules.',
    links: [
      { name: 'Leap Year Calculator', href: '/time-date/leap-year-calculator' },
      { name: 'Julian Day Calculator', href: '/time-date/julian-day-calculator' },
      { name: 'Unix Timestamp Converter', href: '/time-date/unix-timestamp-converter' },
      { name: 'Military Time Converter', href: '/time-date/military-time-converter' },
    ],
  },
];

export const WHICH_CALCULATOR_ITEMS = [
  {
    question: 'How old am I?',
    toolName: 'Age Calculator',
    href: '/time-date/age-calculator',
    description: 'Calculates exact completed years, months, and days lived from date of birth.',
  },
  {
    question: 'How many days are between two dates?',
    toolName: 'Days Between Dates',
    href: '/time-date/days-between-dates',
    description: 'Counts total calendar days and elapsed weeks with inclusive/exclusive options.',
  },
  {
    question: 'What date is 90 days from today?',
    toolName: 'Days Calculator',
    href: '/time-date/days-calculator',
    description: 'Adds or subtracts N days, weeks, or months to reveal target deadlines.',
  },
  {
    question: 'How many workdays are between two dates?',
    toolName: 'Business Days Calculator',
    href: '/business-days-calculator',
    description: 'Calculates working days excluding weekends and selected public holidays.',
  },
  {
    question: 'How long is a shift?',
    toolName: 'Work Hours Calculator',
    href: '/time-date/work-hours',
    description: 'Calculates total shift duration with unpaid meal break deductions.',
  },
  {
    question: 'What time is it somewhere else?',
    toolName: 'Time Zone Converter',
    href: '/time-date/time-zone-converter',
    description: 'Converts local times across world cities with automatic DST adjustment.',
  },
  {
    question: 'When is my event?',
    toolName: 'Event Countdown',
    href: '/time-date/event-countdown',
    description: 'Live countdown in days, hours, and minutes until target events.',
  },
  {
    question: 'How much work time remains until retirement?',
    toolName: 'Retirement Countdown',
    href: '/time-date/retirement-countdown-in-workdays',
    description: 'Estimates calendar days and working shifts remaining until your planned retirement date.',
  },
  {
    question: 'How do I add hours/minutes to a date?',
    toolName: 'Add & Subtract Time',
    href: '/time-date/add-subtract-time',
    description: 'Adds or subtracts specific hours and minutes to any date and time.',
  },
  {
    question: 'Does this year have 366 days?',
    toolName: 'Leap Year Calculator',
    href: '/time-date/leap-year-calculator',
    description: 'Validates whether any given year contains a 29th day of February.',
  },
];
