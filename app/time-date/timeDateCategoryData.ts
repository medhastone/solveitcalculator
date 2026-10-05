export interface TimeDateToolItem {
  name: string;
  desc: string;
  path: string;
  badge?: string;
  keywords?: string[];
}

export interface TimeDateCategoryGroup {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  tools: TimeDateToolItem[];
}

export interface WorldClockCity {
  id: string;
  name: string;
  country: string;
  timezone: string;
  iana: string;
  flag: string;
  region: 'Americas' | 'Europe' | 'Asia/Pacific' | 'Middle East';
}

export interface TimezoneOverlapPair {
  regionA: string;
  regionB: string;
  overlapHours: string;
  goldenWindowUTC: string;
  bestUse: string;
}

export interface CalendarBridgeItem {
  system: string;
  epochStart: string;
  yearLength: string;
  keyFeature: string;
  primaryUse: string;
}

export interface TimeDateWorkbenchKit {
  id: string;
  title: string;
  persona: string;
  desc: string;
  icon: string;
  recommendedTools: {
    name: string;
    path: string;
    purpose: string;
  }[];
}

export interface TimeDateFaq {
  q: string;
  a: string;
}

// ---------------------------------------------------------------------------
// 1. WORLD CLOCK CITIES DATA (12 Major Financial & Tech Centers)
// ---------------------------------------------------------------------------
export const WORLD_CLOCK_CITIES: WorldClockCity[] = [
  { id: 'nyc', name: 'New York', country: 'United States', timezone: 'EST/EDT', iana: 'America/New_York', flag: '🇺🇸', region: 'Americas' },
  { id: 'sfo', name: 'San Francisco', country: 'United States', timezone: 'PST/PDT', iana: 'America/Los_Angeles', flag: '🇺🇸', region: 'Americas' },
  { id: 'lon', name: 'London', country: 'United Kingdom', timezone: 'GMT/BST', iana: 'Europe/London', flag: '🇬🇧', region: 'Europe' },
  { id: 'par', name: 'Paris', country: 'France', timezone: 'CET/CEST', iana: 'Europe/Paris', flag: '🇫🇷', region: 'Europe' },
  { id: 'ber', name: 'Berlin', country: 'Germany', timezone: 'CET/CEST', iana: 'Europe/Berlin', flag: '🇩🇪', region: 'Europe' },
  { id: 'dxb', name: 'Dubai', country: 'UAE', timezone: 'GST', iana: 'Asia/Dubai', flag: '🇦🇪', region: 'Middle East' },
  { id: 'sgp', name: 'Singapore', country: 'Singapore', timezone: 'SGT', iana: 'Asia/Singapore', flag: '🇸🇬', region: 'Asia/Pacific' },
  { id: 'hkg', name: 'Hong Kong', country: 'Hong Kong', timezone: 'HKT', iana: 'Asia/Hong_Kong', flag: '🇭🇰', region: 'Asia/Pacific' },
  { id: 'tyo', name: 'Tokyo', country: 'Japan', timezone: 'JST', iana: 'Asia/Tokyo', flag: '🇯🇵', region: 'Asia/Pacific' },
  { id: 'syd', name: 'Sydney', country: 'Australia', timezone: 'AEST/AEDT', iana: 'Australia/Sydney', flag: '🇦🇺', region: 'Asia/Pacific' },
  { id: 'bom', name: 'Mumbai', country: 'India', timezone: 'IST', iana: 'Asia/Kolkata', flag: '🇮🇳', region: 'Asia/Pacific' },
  { id: 'utc', name: 'UTC Coordinated Universal', country: 'Global Standard', timezone: 'UTC', iana: 'UTC', flag: '🌐', region: 'Europe' },
];

// ---------------------------------------------------------------------------
// 2. 10 COMPREHENSIVE CATEGORY GROUPS & 65+ SPECIALIZED TOOLS
// ---------------------------------------------------------------------------
export const TIME_DATE_CATEGORIES: TimeDateCategoryGroup[] = [
  {
    id: 'date-math',
    name: 'Date Math & Calendar Duration',
    icon: 'Calendar',
    tagline: 'Calculate days between dates, add/subtract calendar days, and count business days.',
    tools: [
      { name: 'Date Difference Calculator', desc: 'Compute exact elapsed years, months, weeks, days, and seconds between two dates.', path: '/date-difference-calculator', badge: 'Core' },
      { name: 'Days Between Dates', desc: 'Count total calendar days, weekend days, and business days between any two dates.', path: '/time-date/days-between-dates', badge: 'Popular' },
      { name: 'Business Days Calculator', desc: 'Calculate working days excluding weekends and national public holidays.', path: '/business-days-calculator' },
      { name: 'Add or Subtract Days to Date', desc: 'Add or subtract days, weeks, or months to determine a future or past date.', path: '/time-date/add-subtract-time' },
      { name: 'Day of Year Calculator (ISO 8601)', desc: 'Find the ordinal day number (1 to 365/366) and ISO week number for any date.', path: '/time-date/days-calculator' },
      { name: 'Day of Week Finder', desc: 'Determine the exact day of the week (Monday through Sunday) for any historical date.', path: '/time-date/date-calculators' },
    ],
  },
  {
    id: 'time-math',
    name: 'Time Math & Duration',
    icon: 'Clock',
    tagline: 'Add/subtract hours, minutes, and seconds, convert decimal hours, and compute durations.',
    tools: [
      { name: 'Add & Subtract Time Calculator', desc: 'Sum or subtract hours, minutes, and seconds across multiple timestamps.', path: '/add-subtract-time-calculator', badge: 'Core' },
      { name: 'Time Duration Calculator', desc: 'Calculate the exact elapsed time duration between start and end times.', path: '/time-date/time-calculator', badge: 'Popular' },
      { name: 'Hours & Minutes Calculator', desc: 'Add up columns of time entries for project logs and flight times.', path: '/time-date/time-calculator' },
      { name: 'Decimal Hours Converter', desc: 'Convert hours and minutes (8h 30m) to decimal hours (8.50h) for payroll.', path: '/time-date/time-conversion' },
      { name: 'Seconds to Hours & Days Converter', desc: 'Convert raw seconds into days, hours, minutes, and seconds.', path: '/time-converter' },
    ],
  },
  {
    id: 'work-payroll',
    name: 'Timecards, Work Hours & Payroll',
    icon: 'Briefcase',
    tagline: 'Employee timesheets, unpaid break subtractions, FLSA overtime, and billable hours.',
    tools: [
      { name: 'Work Hours & Payroll Calculator', desc: 'Calculate gross pay, regular hours, and weekly overtime pay.', path: '/work-hours-payroll-calculator', badge: 'Core' },
      { name: 'Time Card Calculator', desc: 'Employee shift timesheet tracker with automatic unpaid lunch break deductions.', path: '/time-card-calculator', badge: 'Popular' },
      { name: 'Billable Hours Calculator', desc: 'Track freelance client billable hours, hourly rates, and total invoice totals.', path: '/billable-hours-calculator' },
      { name: 'Daily Wage Calculator', desc: 'Convert annual salary to hourly, daily, weekly, and bi-weekly pay rates.', path: '/daily-wage-calculator' },
      { name: 'Freelance Hourly Rate Time Estimator', desc: 'Calculate project completion hours based on client budget and target rate.', path: '/freelance-hourly-rate-calculator' },
    ],
  },
  {
    id: 'world-clock',
    name: 'World Clock, Timezones & Overlap',
    icon: 'Globe',
    tagline: 'Global city clocks, timezone converters, meeting overlap matrices, and DST trackers.',
    tools: [
      { name: 'World Clock Grid', desc: 'Live ticking clocks for major international business centers with UTC offsets.', path: '/time-date/world-clock-grid', badge: 'Core' },
      { name: 'Timezone Converter', desc: 'Convert meeting times across EST, PST, GMT, CET, IST, JST, and AEST.', path: '/time-date/time-zone-converter', badge: 'Popular' },
      { name: 'Multi-City Meeting Overlap Matrix', desc: 'Find optimal golden meeting hours across distributed remote teams.', path: '/time-date/time-zone-overlap' },
      { name: 'Async Team Handover Schedule', desc: 'Plan seamless daily shift handovers for global engineering teams.', path: '/time-date/async-team-handover' },
      { name: 'DST Transition Tracker', desc: 'Track upcoming Daylight Saving Time spring-forward and fall-back changes.', path: '/time-date/dst-transition-tracker' },
    ],
  },
  {
    id: 'age-milestones',
    name: 'Age & Milestone Calculations',
    icon: 'User',
    tagline: 'Chronological age in years/months/days, birthday countdowns, and pet developmental age.',
    tools: [
      { name: 'Chronological Age Calculator', desc: 'Calculate exact age in years, months, weeks, days, hours, and minutes.', path: '/time-date/age-calculator', badge: 'Core' },
      { name: 'Pet Age Converter', desc: 'Convert dog, cat, and bird chronological years to human developmental age.', path: '/pet-age-converter', badge: 'Popular' },
      { name: 'Birthday Tracker & Countdown', desc: 'Track upcoming birthdays, horoscope signs, and days until next birthday.', path: '/time-date/birthday-tracker' },
      { name: 'Milestone Anniversary Calculator', desc: 'Find 10,000 days alive, silver/gold anniversaries, and life milestones.', path: '/time-date/event-countdown' },
    ],
  },
  {
    id: 'timers-countdowns',
    name: 'Timers, Stopwatches & Countdowns',
    icon: 'Timer',
    tagline: 'Custom event countdowns, Pomodoro focus timers, and ultradian rhythm planners.',
    tools: [
      { name: 'Countdown Timer', desc: 'Create custom full-screen visual countdowns for events, holidays, and deadlines.', path: '/countdown-timer', badge: 'Core' },
      { name: 'Focus & Break Timer (Pomodoro)', desc: 'Boost productivity with customizable 25m work / 5m break interval timers.', path: '/focus-and-break-timer', badge: 'Popular' },
      { name: '90-Minute Ultradian Rhythm Planner', desc: 'Schedule deep work blocks aligned with human cognitive ultradian performance cycles.', path: '/time-date/90-minute-ultradian-rhythm-planner' },
      { name: 'Meeting Cost Calculator', desc: 'Calculate real-time running dollar costs of team meetings based on attendee salaries.', path: '/meeting-cost-calculator' },
      { name: 'Retirement Countdown in Workdays', desc: 'Count exact working days remaining until target retirement date.', path: '/retirement-countdown-in-workdays' },
    ],
  },
  {
    id: 'solar-astronomy',
    name: 'Astronomical Solar Ephemeris',
    icon: 'Sun',
    tagline: 'Sunrise, sunset, golden hour, 24-hour day/night world map, and equinox/solstice events.',
    tools: [
      { name: 'Sunrise & Sunset Calculator', desc: 'Exact solar dawn, sunrise, solar noon, sunset, and twilight times by location.', path: '/sunrise-sunset-calculator', badge: 'Core' },
      { name: 'Day & Night World Map', desc: 'Real-time interactive 24-hour global map showing day/night solar illumination terminator.', path: '/day-night-world-map', badge: 'Popular' },
      { name: 'Equinox & Solstice Calculator', desc: 'Astronomical dates for Vernal Equinox, Summer Solstice, Autumnal Equinox, and Winter Solstice.', path: '/equinox-solstice-calculator' },
      { name: 'Solar Eclipse Tracker', desc: 'Upcoming total, annular, and partial solar eclipse schedules and visibility paths.', path: '/solar-eclipse-calculator' },
    ],
  },
  {
    id: 'lunar-ephemeris',
    name: 'Lunar & Celestial Ephemeris',
    icon: 'Moon',
    tagline: 'Moon phases, lunar illumination percentage, tides, and eclipse schedules.',
    tools: [
      { name: 'Moon Phase Calculator', desc: 'Current moon phase, illumination percentage, age in days, and lunar calendar.', path: '/moon-phase-calculator', badge: 'Core' },
      { name: 'Lunar Eclipse Tracker', desc: 'Schedules and astronomical dates for penumbral, partial, and total lunar eclipses.', path: '/time-date/solar-eclipse-calculator' },
      { name: 'Full Moon & New Moon Calendar', desc: 'Predict upcoming Supermoons, Harvest Moons, and monthly lunar phases.', path: '/moon-phase-calculator' },
    ],
  },
  {
    id: 'calendars-epochs',
    name: 'Calendar Systems & Epochs',
    icon: 'CalendarDays',
    tagline: 'Julian Day numbers, Gregorian/Julian calendar conversion, leap years, and Unix timestamps.',
    tools: [
      { name: 'Unix Timestamp Converter', desc: 'Convert POSIX epoch seconds and milliseconds to human-readable UTC dates.', path: '/unix-timestamp-converter', badge: 'Core' },
      { name: 'Julian Day Calculator', desc: 'Calculate astronomical Julian Day Numbers (JDN) and Modified Julian Date (MJD).', path: '/julian-day-calculator', badge: 'Popular' },
      { name: 'Leap Year Calculator', desc: 'Determine leap year status and multi-century leap year calendar rules.', path: '/leap-year-calculator' },
      { name: 'Military Time Converter', desc: 'Convert 12-hour AM/PM to 24-hour military and aviation clock syntax.', path: '/military-time-converter' },
    ],
  },
  {
    id: 'project-lifelines',
    name: 'Project Planning & Life Timelines',
    icon: 'LineChart',
    tagline: 'Gantt project milestones, retirement workdays, and running pace lap splits.',
    tools: [
      { name: 'Plan a Project Timeline', desc: 'Calculate project deadline schedules, buffer days, and milestone dates.', path: '/plan-a-project-calculator', badge: 'Core' },
      { name: 'Retirement Countdown in Workdays', desc: 'Calculate exact remaining working days until target retirement date.', path: '/retirement-countdown-in-workdays' },
      { name: 'Running Pace & Lap Split Calculator', desc: 'Calculate marathon finish times, km/mile pace splits, and target race times.', path: '/running-pace-and-lap-split-calculator' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 3. TIMEZONE OVERLAP MATRIX DATA
// ---------------------------------------------------------------------------
export const TIMEZONE_OVERLAP_PAIRS: TimezoneOverlapPair[] = [
  {
    regionA: 'US East Coast (NY) / EST',
    regionB: 'UK & Western Europe (London/Paris)',
    overlapHours: '4–5 Hours Overlap',
    goldenWindowUTC: '13:00 – 17:00 UTC (9 AM–1 PM EST / 2 PM–6 PM GMT)',
    bestUse: 'Daily syncs, engineering code reviews, and executive leadership alignment.',
  },
  {
    regionA: 'US West Coast (SFO) / PST',
    regionB: 'UK & Western Europe (London/Paris)',
    overlapHours: '2–3 Hours Overlap',
    goldenWindowUTC: '16:00 – 18:00 UTC (8 AM–10 AM PST / 4 PM–6 PM GMT)',
    bestUse: 'Morning standups for West Coast aligned with European end-of-day handovers.',
  },
  {
    regionA: 'UK & Western Europe (London)',
    regionB: 'India & South Asia (IST)',
    overlapHours: '4–5 Hours Overlap',
    goldenWindowUTC: '08:00 – 12:00 UTC (8 AM–12 PM GMT / 1:30 PM–5:30 PM IST)',
    bestUse: 'High-throughput software development and joint Q&A technical sessions.',
  },
  {
    regionA: 'US West Coast (SFO) / PST',
    regionB: 'Australia & East Asia (Sydney/Tokyo)',
    overlapHours: '3–4 Hours Overlap',
    goldenWindowUTC: '23:00 – 03:00 UTC (4 PM–8 PM PST / 9 AM–1 PM AEST next day)',
    bestUse: 'Evening US West Coast cross-Pacific handovers to Asia-Pacific teams.',
  },
];

// ---------------------------------------------------------------------------
// 4. CALENDAR SYSTEMS REFERENCE BRIDGE
// ---------------------------------------------------------------------------
export const CALENDAR_SYSTEMS_DATA: CalendarBridgeItem[] = [
  {
    system: 'Gregorian Calendar',
    epochStart: 'October 15, 1582 (Pope Gregory XIII)',
    yearLength: '365.2425 Mean Solar Days',
    keyFeature: 'Leap year every 4 years, except century years not divisible by 400 (e.g. 1900 was not, 2000 was).',
    primaryUse: 'International civil calendar standard used worldwide.',
  },
  {
    system: 'Julian Calendar',
    epochStart: '45 BC (Julius Caesar)',
    yearLength: '365.25 Mean Solar Days',
    keyFeature: 'Simple leap year every 4 years without century exceptions (accumulates ~3 days error per 400 years).',
    primaryUse: 'Historical research and Eastern Orthodox liturgical calendars.',
  },
  {
    system: 'ISO 8601 Week Date',
    epochStart: 'Monday of Week 01 (containing first Thursday of Jan)',
    yearLength: '52 or 53 Full 7-Day Weeks (364 or 371 days)',
    keyFeature: 'Strict week-based structure where every week begins on Monday and year has exact complete weeks.',
    primaryUse: 'Supply chain logistics, manufacturing, and international business planning.',
  },
  {
    system: 'POSIX / Unix Epoch',
    epochStart: 'January 1, 1970 00:00:00 UTC',
    yearLength: 'Continuous Counter (no leap seconds in raw count)',
    keyFeature: 'Integer count of seconds elapsed since 1970-01-01T00:00:00Z.',
    primaryUse: 'Software engineering, databases, OS kernels, and server log timestamps.',
  },
];

// ---------------------------------------------------------------------------
// 5. 6 CURATED DATE & TIME WORKBENCHES
// ---------------------------------------------------------------------------
export const TIME_DATE_WORKBENCHES: TimeDateWorkbenchKit[] = [
  {
    id: 'remote-teams',
    title: 'Remote Teams & Global Collaboration',
    persona: 'Engineering Managers & Distributed Teams',
    desc: 'Solve timezone overlap, plan async handovers, and coordinate cross-border meetings.',
    icon: 'Globe',
    recommendedTools: [
      { name: 'Multi-City Meeting Overlap Matrix', path: '/time-date/time-zone-overlap', purpose: 'Find golden overlap hours across US, Europe, and Asia.' },
      { name: 'World Clock Grid', path: '/time-date/world-clock-grid', purpose: 'Live ticking clocks for global team locations.' },
      { name: 'Async Team Handover Schedule', path: '/time-date/async-team-handover', purpose: 'Structure smooth 24-hour follow-the-sun workflows.' },
      { name: 'DST Transition Tracker', path: '/time-date/dst-transition-tracker', purpose: 'Prevent missed meetings during spring/fall DST shifts.' },
    ],
  },
  {
    id: 'hr-payroll',
    title: 'HR, Timesheets & Payroll Management',
    persona: 'HR Managers, Accountants & Contractors',
    desc: 'Employee shift tracking, break deductions, FLSA overtime math, and billable client hours.',
    icon: 'Briefcase',
    recommendedTools: [
      { name: 'Work Hours & Payroll Calculator', path: '/work-hours-payroll-calculator', purpose: 'Gross pay, regular hours, and weekly overtime pay.' },
      { name: 'Time Card Calculator with Breaks', path: '/time-card-calculator', purpose: 'Calculate employee shift hours minus unpaid lunch breaks.' },
      { name: 'Billable Hours Calculator', path: '/billable-hours-calculator', purpose: 'Convert freelance minutes to decimal billable client hours.' },
      { name: 'Daily & Hourly Wage Calculator', path: '/daily-wage-calculator', purpose: 'Convert annual salary to hourly and daily pay rates.' },
    ],
  },
  {
    id: 'astronomy-stem',
    title: 'Astronomy, Solar Ephemeris & STEM',
    persona: 'Astronomers, Researchers & Students',
    desc: 'Sunrise/sunset, solar noon, equinoxes, moon phases, and Julian Day numbers.',
    icon: 'Sun',
    recommendedTools: [
      { name: 'Sunrise & Sunset Calculator', path: '/sunrise-sunset-calculator', purpose: 'Exact dawn, dusk, solar noon, and day length by location.' },
      { name: 'Day & Night World Map', path: '/day-night-world-map', purpose: '24-hour interactive solar terminator illumination map.' },
      { name: 'Moon Phase & Illumination', path: '/moon-phase-calculator', purpose: 'Current lunar phase, age in days, and illumination %.' },
      { name: 'Julian Day Calculator (JDN)', path: '/julian-day-calculator', purpose: 'Continuous day count for astronomical orbit computations.' },
    ],
  },
  {
    id: 'software-eng',
    title: 'Software Development & Systems',
    persona: 'Software Engineers & DevOps',
    desc: 'Unix epoch timestamps, ISO 8601 formatting, millisecond conversions, and UTC alignment.',
    icon: 'Cpu',
    recommendedTools: [
      { name: 'Unix Timestamp Converter', path: '/unix-timestamp-converter', purpose: 'Convert POSIX epoch seconds/ms to ISO 8601 UTC dates.' },
      { name: 'Military & 24-Hour Time Converter', path: '/military-time-converter', purpose: 'Format 12-hour AM/PM to 24-hour server log syntax.' },
      { name: 'Seconds to Hours & Days', path: '/time-converter', purpose: 'Convert raw uptime seconds to human-readable duration.' },
      { name: 'Leap Year Checker', path: '/leap-year-calculator', purpose: 'Verify multi-century leap year logic for software test suites.' },
    ],
  },
  {
    id: 'productivity',
    title: 'Productivity, Focus & Time Management',
    persona: 'Students, Creators & Professionals',
    desc: 'Pomodoro focus intervals, 90-minute ultradian rhythm planning, and event countdowns.',
    icon: 'Timer',
    recommendedTools: [
      { name: 'Focus & Break Timer (Pomodoro)', path: '/focus-and-break-timer', purpose: '25m work / 5m break interval focus sessions.' },
      { name: '90-Minute Ultradian Rhythm Planner', path: '/time-date/90-minute-ultradian-rhythm-planner', purpose: 'Schedule deep work blocks aligned with cognitive energy cycles.' },
      { name: 'Countdown Timer', path: '/countdown-timer', purpose: 'Custom visual countdowns for exams, project launches, and holidays.' },
      { name: 'Meeting Cost Calculator', path: '/meeting-cost-calculator', purpose: 'Track real-time running salary cost of meetings.' },
    ],
  },
  {
    id: 'life-events',
    title: 'Life Events, Age & Milestones',
    persona: 'Individuals & Families',
    desc: 'Chronological age in years/months/days, pet developmental age, and birthday trackers.',
    icon: 'User',
    recommendedTools: [
      { name: 'Chronological Age Calculator', path: '/time-date/age-calculator', purpose: 'Exact age in years, months, weeks, days, and minutes.' },
      { name: 'Pet Age Converter', path: '/pet-age-converter', purpose: 'Calculate dog and cat developmental age equivalent.' },
      { name: 'Birthday Tracker & Countdown', path: '/time-date/birthday-tracker', purpose: 'Track upcoming family birthdays and days until next celebration.' },
      { name: 'Retirement Countdown in Workdays', path: '/retirement-countdown-in-workdays', purpose: 'Count exact working days remaining until retirement.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 6. 15 COMPREHENSIVE TIME & DATE FAQS (Schema.org FAQPage Compliant)
// ---------------------------------------------------------------------------
export const TIME_DATE_FAQS: TimeDateFaq[] = [
  {
    q: 'How does the SolveItCalculator Date & Time engine handle Daylight Saving Time (DST) transitions?',
    a: 'All timezone and date calculations are executed using standard IANA timezone databases built directly into modern browser JavaScript engines via the Intl.DateTimeFormat API. This ensures automatic, exact handling of regional Daylight Saving Time spring-forward and fall-back adjustments without layout or calculation errors.',
  },
  {
    q: 'What is the exact definition of a Business Day in date calculation?',
    a: 'A standard Business Day (or Working Day) excludes weekends (Saturday and Sunday) and national public holidays. When computing business days between two dates, the start date is typically counted while weekends and specified holidays are omitted from the total count.',
  },
  {
    q: 'How does a Unix Timestamp work and why is it used in software engineering?',
    a: 'A Unix Timestamp (or POSIX timestamp) represents the total number of seconds that have elapsed since 00:00:00 UTC on January 1, 1970 (the Unix Epoch), excluding leap seconds. Because it is a single continuous integer, it provides an unambiguous, timezone-independent point in time for software systems, databases, and API protocols worldwide.',
  },
  {
    q: 'What is the difference between GMT and UTC?',
    a: 'UTC (Coordinated Universal Time) is an atomic time standard that does not observe Daylight Saving Time and serves as the precise basis for civil time worldwide. GMT (Greenwich Mean Time) is a time zone observing the solar time at the Royal Observatory in Greenwich, London. While UTC and GMT share the same clock time, UTC is a scientific standard whereas GMT is a geographical timezone.',
  },
  {
    q: 'How are employee unpaid break deductions calculated on a timesheet?',
    a: 'On an employee timesheet, total daily working hours equal the total elapsed time between clock-in and clock-out minus any unpaid meal break duration. For example, a shift from 8:00 AM to 5:00 PM (9 hours elapsed) with a 30-minute unpaid lunch yields 8.5 net working hours.',
  },
  {
    q: 'What is the rule for determining whether a year is a Leap Year?',
    a: 'Under the Gregorian calendar, a year is a leap year if it is evenly divisible by 4, EXCEPT for century years (ending in 00), which must be divisible by 400. Thus, 1900 was NOT a leap year, 2000 WAS a leap year, and 2100 will NOT be a leap year.',
  },
  {
    q: 'What is a Julian Day Number (JDN) in astronomy?',
    a: 'A Julian Day Number (JDN) is the continuous integer count of days starting from noon UTC on January 1, 4713 BC (in the proleptic Julian calendar). Astronomers use Julian Days to calculate orbital mechanics and celestial events without worrying about irregular calendar months or historical calendar reforms.',
  },
  {
    q: 'How do you convert decimal hours to hours and minutes?',
    a: 'To convert decimal hours (e.g., 7.75 hours) to hours and minutes: the whole number represents hours (7 hours), and the decimal fraction is multiplied by 60 minutes (0.75 × 60 = 45 minutes). Therefore, 7.75 hours equals 7 hours and 45 minutes.',
  },
  {
    q: 'What is a Pomodoro focus timer and how does it improve productivity?',
    a: 'The Pomodoro Technique is a time management method developed by Francesco Cirillo. It uses a timer to break work into 25-minute uninterrupted focus intervals (called pomodoros), separated by 5-minute short breaks. After completing 4 pomodoros, you take a longer 15–30 minute break to maintain cognitive stamina.',
  },
  {
    q: 'How is astronomical Day & Night calculated on a world map?',
    a: 'The solar terminator (the line separating day and night) is calculated by computing the Sun’s current subsolar point (declination and right ascension) based on the Earth’s axial tilt (~23.44°) and orbital position. Locations where the Sun is above the horizon experience daylight, while locations below experience night.',
  },
  {
    q: 'Why do dog and cat age calculations differ from the "1 year = 7 years" myth?',
    a: 'Dogs and cats mature much faster during their first two years of life than humans. A 1-year-old dog or cat is developmentally equivalent to approximately a 15-year-old human adolescent, and a 2-year-old is equivalent to a 24-year-old adult. After age 2, each animal year equals approximately 4 to 5 human years depending on breed size.',
  },
  {
    q: 'What is an Ultradian Rhythm in daily performance planning?',
    a: 'An Ultradian Rhythm is a recurrent biological cycle repeating throughout a 24-hour day. Human cognitive focus naturally peaks in 90-minute blocks of high alertness followed by a 20-minute period of fatigue and recovery. Scheduling deep work in 90-minute blocks optimizes mental productivity.',
  },
  {
    q: 'What is the ISO 8601 week date format (e.g. 2026-W40-7)?',
    a: 'ISO 8601 is an international standard for date and time formatting. An ISO week date consists of the ISO year, week number (W01 to W53), and day of the week (1 = Monday through 7 = Sunday). Week 01 of any year is defined as the week containing the first Thursday of January.',
  },
  {
    q: 'How is meeting cost calculated in real-time?',
    a: 'Meeting cost is computed by converting each attendee’s annual salary (or hourly rate) to a per-second cost, then continuously accumulating the total expense for all attendees across the elapsed meeting duration: Total Cost = ∑ (Hourly Rate_i) × (Elapsed Hours).',
  },
  {
    q: 'Are all Date & Time calculators on SolveItCalculator free to use?',
    a: 'Yes, all 65+ Date & Time calculators, world clocks, timesheets, and astronomical tools are 100% free, require no registration, run completely client-side in browser memory for privacy, and work across mobile, tablet, and desktop.',
  },
];
