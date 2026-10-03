import { TimeToolDefinition, TimeToolCategory } from './types';
import { CORE_TIME_TOOLS } from './tools-core';
import { CONVERSION_TIME_TOOLS } from './tools-conversions';
import { COUNTDOWN_TIME_TOOLS } from './tools-countdowns';
import { TIMER_TIME_TOOLS } from './tools-timers';
import { REFERENCE_TIME_TOOLS } from './tools-references';

export * from './types';
export * from './calculations';
export * from './audio';
export * from './ics';

export const ALL_TIME_TOOLS: TimeToolDefinition[] = [
  ...CORE_TIME_TOOLS,
  ...CONVERSION_TIME_TOOLS,
  ...COUNTDOWN_TIME_TOOLS,
  ...TIMER_TIME_TOOLS,
  ...REFERENCE_TIME_TOOLS,
];

export interface TimeCategoryMeta {
  id: TimeToolCategory;
  name: string;
  path: string;
  description: string;
  count: number;
}

export const TIME_CATEGORIES: TimeCategoryMeta[] = [
  {
    id: 'core',
    name: 'Time Calculators',
    path: '/time-date/time-calculator',
    description: 'Calculate elapsed time, sum hours, deduct breaks, and compute timesheet wages.',
    count: CORE_TIME_TOOLS.filter((t) => t.category === 'core').length,
  },
  {
    id: 'date-calculators',
    name: 'Date Calculators',
    path: '/time-date/date-calculators',
    description: 'Date difference, business days with holiday filters, and calendar intervals.',
    count: CORE_TIME_TOOLS.filter((t) => t.category === 'date-calculators').length,
  },
  {
    id: 'age-calculators',
    name: 'Age Calculators',
    path: '/time-date/age-calculators',
    description: 'Chronological age in years/months/days, age gaps, and milestone date lookups.',
    count: CORE_TIME_TOOLS.filter((t) => t.category === 'age-calculators').length,
  },
  {
    id: 'time-conversion',
    name: 'Time Conversions',
    path: '/time-date/time-conversion',
    description: 'Convert between 12 time units, military time, 24h/12h, and decimal hours.',
    count: CONVERSION_TIME_TOOLS.length,
  },
  {
    id: 'countdown',
    name: 'Countdowns',
    path: '/time-date/countdown',
    description: 'Live real-time countdown clocks for holidays, deadlines, and intra-day targets.',
    count: COUNTDOWN_TIME_TOOLS.length,
  },
  {
    id: 'timers',
    name: 'Timers & Stopwatch',
    path: '/time-date/timers',
    description: '1-click quick-start preset timers (5s to 2h), Pomodoro, and lap stopwatch.',
    count: TIMER_TIME_TOOLS.length,
  },
  {
    id: 'calendar',
    name: 'Calendar & Reference',
    path: '/time-date/calendar',
    description: 'Current date, week numbers, day of the year, leap year checker, and future dates.',
    count: REFERENCE_TIME_TOOLS.filter((t) => t.category === 'calendar').length + CORE_TIME_TOOLS.filter((t) => t.category === 'calendar').length,
  },
  {
    id: 'guides',
    name: 'Time & Calendar Guides',
    path: '/time-date/guides',
    description: 'In-depth educational articles on leap years, military time, and decimal payroll.',
    count: REFERENCE_TIME_TOOLS.filter((t) => t.category === 'guides').length,
  },
];

export function getAllTimeTools(): TimeToolDefinition[] {
  return ALL_TIME_TOOLS;
}

export function getTimeToolBySlug(slug: string): TimeToolDefinition | undefined {
  const normalized = slug.toLowerCase().trim();
  return ALL_TIME_TOOLS.find(
    (t) =>
      t.slug === normalized ||
      t.canonicalPath === `/time-date/${normalized}` ||
      t.canonicalPath.endsWith(`/${normalized}`)
  );
}

export function getTimeToolsByCategory(category: TimeToolCategory): TimeToolDefinition[] {
  return ALL_TIME_TOOLS.filter((t) => t.category === category);
}

export function getRelatedTools(slugs: string[]): TimeToolDefinition[] {
  const result: TimeToolDefinition[] = [];
  slugs.forEach((slug) => {
    const found = getTimeToolBySlug(slug);
    if (found && !result.some((r) => r.slug === found.slug)) {
      result.push(found);
    }
  });
  return result;
}
