// Helper types, holiday datasets, and calculation utilities for Date Difference, Business Days, Work Hours, and Countdown

export type ModeType = 'all-days' | 'business-days' | 'work-hours' | 'event-countdown';
export type WorkWeekSchedule = '5-day' | '6-day' | '4-day' | 'sun-thu' | 'custom';
export type WorkHoursMethod = 'direct' | 'shift';

export interface HolidayDetail {
  date: string;
  name: string;
  dayOfWeek: string;
}

export const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  UK: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  IN: 'India',
  DE: 'Germany',
};

// Comprehensive holiday dictionary with official holiday names (2024 - 2030)
export const HOLIDAY_NAMES_MAP: Record<string, Record<string, string>> = {
  US: {
    '2024-01-01': "New Year's Day",
    '2024-01-15': 'Martin Luther King Jr. Day',
    '2024-02-19': "Presidents' Day",
    '2024-05-27': 'Memorial Day',
    '2024-06-19': 'Juneteenth National Independence Day',
    '2024-07-04': 'Independence Day',
    '2024-09-02': 'Labor Day',
    '2024-10-14': 'Columbus / Indigenous Peoples Day',
    '2024-11-11': 'Veterans Day',
    '2024-11-28': 'Thanksgiving Day',
    '2024-12-25': 'Christmas Day',
    '2025-01-01': "New Year's Day",
    '2025-01-20': 'Martin Luther King Jr. Day',
    '2025-02-17': "Presidents' Day",
    '2025-05-26': 'Memorial Day',
    '2025-06-19': 'Juneteenth',
    '2025-07-04': 'Independence Day',
    '2025-09-01': 'Labor Day',
    '2025-10-13': 'Columbus / Indigenous Peoples Day',
    '2025-11-11': 'Veterans Day',
    '2025-11-27': 'Thanksgiving Day',
    '2025-12-25': 'Christmas Day',
    '2026-01-01': "New Year's Day",
    '2026-01-19': 'Martin Luther King Jr. Day',
    '2026-02-16': "Presidents' Day",
    '2026-05-25': 'Memorial Day',
    '2026-06-19': 'Juneteenth',
    '2026-07-03': 'Independence Day (Observed)',
    '2026-09-07': 'Labor Day',
    '2026-10-12': 'Columbus / Indigenous Peoples Day',
    '2026-11-11': 'Veterans Day',
    '2026-11-26': 'Thanksgiving Day',
    '2026-12-25': 'Christmas Day',
    '2027-01-01': "New Year's Day",
    '2027-01-18': 'Martin Luther King Jr. Day',
    '2027-02-15': "Presidents' Day",
    '2027-05-31': 'Memorial Day',
    '2027-06-18': 'Juneteenth (Observed)',
    '2027-07-05': 'Independence Day (Observed)',
    '2027-09-06': 'Labor Day',
    '2027-10-11': 'Columbus / Indigenous Peoples Day',
    '2027-11-11': 'Veterans Day',
    '2027-11-25': 'Thanksgiving Day',
    '2027-12-24': 'Christmas Day (Observed)',
    '2028-01-01': "New Year's Day",
    '2028-01-17': 'Martin Luther King Jr. Day',
    '2028-02-21': "Presidents' Day",
    '2028-05-29': 'Memorial Day',
    '2028-06-19': 'Juneteenth',
    '2028-07-04': 'Independence Day',
    '2028-09-04': 'Labor Day',
    '2028-10-09': 'Columbus / Indigenous Peoples Day',
    '2028-11-10': 'Veterans Day (Observed)',
    '2028-11-23': 'Thanksgiving Day',
    '2028-12-25': 'Christmas Day',
    '2029-01-01': "New Year's Day",
    '2029-01-15': 'Martin Luther King Jr. Day',
    '2029-02-19': "Presidents' Day",
    '2029-05-28': 'Memorial Day',
    '2029-06-19': 'Juneteenth',
    '2029-07-04': 'Independence Day',
    '2029-09-03': 'Labor Day',
    '2029-10-08': 'Columbus / Indigenous Peoples Day',
    '2029-11-12': 'Veterans Day (Observed)',
    '2029-11-22': 'Thanksgiving Day',
    '2029-12-25': 'Christmas Day',
    '2030-01-01': "New Year's Day",
    '2030-01-21': 'Martin Luther King Jr. Day',
    '2030-02-18': "Presidents' Day",
    '2030-05-27': 'Memorial Day',
    '2030-06-19': 'Juneteenth',
    '2030-07-04': 'Independence Day',
    '2030-09-02': 'Labor Day',
    '2030-10-14': 'Columbus / Indigenous Peoples Day',
    '2030-11-11': 'Veterans Day',
    '2030-11-28': 'Thanksgiving Day',
    '2030-12-25': 'Christmas Day',
  },
  UK: {
    '2024-01-01': "New Year's Day",
    '2024-03-29': 'Good Friday',
    '2024-04-01': 'Easter Monday',
    '2024-05-06': 'Early May Bank Holiday',
    '2024-05-27': 'Spring Bank Holiday',
    '2024-08-26': 'Summer Bank Holiday',
    '2024-12-25': 'Christmas Day',
    '2024-12-26': 'Boxing Day',
    '2025-01-01': "New Year's Day",
    '2025-04-18': 'Good Friday',
    '2025-04-21': 'Easter Monday',
    '2025-05-05': 'Early May Bank Holiday',
    '2025-05-26': 'Spring Bank Holiday',
    '2025-08-25': 'Summer Bank Holiday',
    '2025-12-25': 'Christmas Day',
    '2025-12-26': 'Boxing Day',
    '2026-01-01': "New Year's Day",
    '2026-04-03': 'Good Friday',
    '2026-04-06': 'Easter Monday',
    '2026-05-04': 'Early May Bank Holiday',
    '2026-05-25': 'Spring Bank Holiday',
    '2026-08-31': 'Summer Bank Holiday',
    '2026-12-25': 'Christmas Day',
    '2026-12-28': 'Boxing Day (Observed)',
    '2027-01-01': "New Year's Day",
    '2027-03-26': 'Good Friday',
    '2027-03-29': 'Easter Monday',
    '2027-05-03': 'Early May Bank Holiday',
    '2027-05-31': 'Spring Bank Holiday',
    '2027-08-30': 'Summer Bank Holiday',
    '2027-12-27': 'Christmas Day (Observed)',
    '2027-12-28': 'Boxing Day (Observed)',
    '2028-01-03': "New Year's Day (Observed)",
    '2028-04-14': 'Good Friday',
    '2028-04-17': 'Easter Monday',
    '2028-05-01': 'Early May Bank Holiday',
    '2028-05-29': 'Spring Bank Holiday',
    '2028-08-28': 'Summer Bank Holiday',
    '2028-12-25': 'Christmas Day',
    '2028-12-26': 'Boxing Day',
  },
  CA: {
    '2024-01-01': "New Year's Day",
    '2024-03-29': 'Good Friday',
    '2024-05-20': 'Victoria Day',
    '2024-07-01': 'Canada Day',
    '2024-09-02': 'Labour Day',
    '2024-09-30': 'National Day for Truth and Reconciliation',
    '2024-10-14': 'Thanksgiving Day',
    '2024-11-11': 'Remembrance Day',
    '2024-12-25': 'Christmas Day',
    '2024-12-26': 'Boxing Day',
    '2025-01-01': "New Year's Day",
    '2025-04-18': 'Good Friday',
    '2025-05-19': 'Victoria Day',
    '2025-07-01': 'Canada Day',
    '2025-09-01': 'Labour Day',
    '2025-09-30': 'National Day for Truth and Reconciliation',
    '2025-10-13': 'Thanksgiving Day',
    '2025-11-11': 'Remembrance Day',
    '2025-12-25': 'Christmas Day',
    '2025-12-26': 'Boxing Day',
    '2026-01-01': "New Year's Day",
    '2026-04-03': 'Good Friday',
    '2026-05-18': 'Victoria Day',
    '2026-07-01': 'Canada Day',
    '2026-09-07': 'Labour Day',
    '2026-09-30': 'National Day for Truth and Reconciliation',
    '2026-10-12': 'Thanksgiving Day',
    '2026-11-11': 'Remembrance Day',
    '2026-12-25': 'Christmas Day',
    '2026-12-28': 'Boxing Day (Observed)',
  },
  AU: {
    '2024-01-01': "New Year's Day",
    '2024-01-26': 'Australia Day',
    '2024-03-29': 'Good Friday',
    '2024-04-01': 'Easter Monday',
    '2024-04-25': 'Anzac Day',
    '2024-06-10': "King's Birthday",
    '2024-10-07': 'Labour Day',
    '2024-12-25': 'Christmas Day',
    '2024-12-26': 'Boxing Day',
    '2025-01-01': "New Year's Day",
    '2025-01-27': 'Australia Day (Observed)',
    '2025-04-18': 'Good Friday',
    '2025-04-21': 'Easter Monday',
    '2025-04-25': 'Anzac Day',
    '2025-06-09': "King's Birthday",
    '2025-10-06': 'Labour Day',
    '2025-12-25': 'Christmas Day',
    '2025-12-26': 'Boxing Day',
    '2026-01-01': "New Year's Day",
    '2026-01-26': 'Australia Day',
    '2026-04-03': 'Good Friday',
    '2026-04-06': 'Easter Monday',
    '2026-04-25': 'Anzac Day',
    '2026-06-08': "King's Birthday",
    '2026-10-05': 'Labour Day',
    '2026-12-25': 'Christmas Day',
    '2026-12-28': 'Boxing Day (Observed)',
  },
  IN: {
    '2024-01-26': 'Republic Day',
    '2024-03-25': 'Holi',
    '2024-04-11': 'Id-ul-Fitr',
    '2024-04-17': 'Ram Navami',
    '2024-04-21': 'Mahavir Jayanti',
    '2024-05-23': 'Buddha Purnima',
    '2024-06-17': 'Bakrid / Eid ul-Adha',
    '2024-07-17': 'Muharram',
    '2024-08-15': 'Independence Day',
    '2024-09-16': 'Milad-un-Nabi',
    '2024-10-02': 'Mahatma Gandhi Jayanti',
    '2024-10-12': 'Dussehra',
    '2024-10-31': 'Diwali (Deepavali)',
    '2024-11-15': 'Guru Nanak Jayanti',
    '2024-12-25': 'Christmas Day',
    '2025-01-26': 'Republic Day',
    '2025-03-14': 'Holi',
    '2025-03-31': 'Id-ul-Fitr',
    '2025-04-18': 'Good Friday',
    '2025-08-15': 'Independence Day',
    '2025-10-02': 'Mahatma Gandhi Jayanti',
    '2025-10-21': 'Diwali',
    '2025-12-25': 'Christmas Day',
    '2026-01-26': 'Republic Day',
    '2026-03-04': 'Holi',
    '2026-03-20': 'Id-ul-Fitr',
    '2026-04-03': 'Good Friday',
    '2026-08-15': 'Independence Day',
    '2026-10-02': 'Mahatma Gandhi Jayanti',
    '2026-11-08': 'Diwali',
    '2026-12-25': 'Christmas Day',
  },
  DE: {
    '2024-01-01': 'Neujahr',
    '2024-03-29': 'Karfreitag',
    '2024-04-01': 'Ostermontag',
    '2024-05-01': 'Tag der Arbeit',
    '2024-05-09': 'Christi Himmelfahrt',
    '2024-05-20': 'Pfingstmontag',
    '2024-10-03': 'Tag der Deutschen Einheit',
    '2024-12-25': '1. Weihnachtstag',
    '2024-12-26': '2. Weihnachtstag',
    '2025-01-01': 'Neujahr',
    '2025-04-18': 'Karfreitag',
    '2025-04-21': 'Ostermontag',
    '2025-05-01': 'Tag der Arbeit',
    '2025-05-29': 'Christi Himmelfahrt',
    '2025-06-09': 'Pfingstmontag',
    '2025-10-03': 'Tag der Deutschen Einheit',
    '2025-12-25': '1. Weihnachtstag',
    '2025-12-26': '2. Weihnachtstag',
    '2026-01-01': 'Neujahr',
    '2026-04-03': 'Karfreitag',
    '2026-04-06': 'Ostermontag',
    '2026-05-01': 'Tag der Arbeit',
    '2026-05-14': 'Christi Himmelfahrt',
    '2026-05-25': 'Pfingstmontag',
    '2026-10-03': 'Tag der Deutschen Einheit',
    '2026-12-25': '1. Weihnachtstag',
    '2026-12-26': '2. Weihnachtstag',
  },
};

export function parseISODate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length < 3) return null;
  return new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
}

export function formatReadableDate(d: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
  return d.toLocaleDateString('en-US', opts);
}

export function getWeekInfo(d: Date): { week: number; year: number } {
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = target.getTime();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
  }
  const week = 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);
  return { week, year: target.getUTCFullYear() };
}

export function getWeekendDaysSet(schedule: WorkWeekSchedule, customDays: number[]): Set<number> {
  switch (schedule) {
    case '6-day':
      return new Set<number>([0]); // Sunday only
    case '4-day':
      return new Set<number>([0, 5, 6]); // Friday, Saturday, Sunday
    case 'sun-thu':
      return new Set<number>([5, 6]); // Friday, Saturday (common in Middle East)
    case 'custom':
      return new Set<number>(customDays);
    case '5-day':
    default:
      return new Set<number>([0, 6]); // Saturday, Sunday
  }
}

export function calculateShiftHours(startTime: string, endTime: string, lunchBreakMins: number): number {
  if (!startTime || !endTime) return 8.0;
  const [sH, sM] = startTime.split(':').map(Number);
  const [eH, eM] = endTime.split(':').map(Number);
  if (isNaN(sH) || isNaN(sM) || isNaN(eH) || isNaN(eM)) return 8.0;

  let startTotalMins = sH * 60 + sM;
  let endTotalMins = eH * 60 + eM;
  if (endTotalMins <= startTotalMins) {
    endTotalMins += 24 * 60; // overnight shift
  }
  const netMins = endTotalMins - startTotalMins - (lunchBreakMins || 0);
  return Math.max(0, parseFloat((netMins / 60).toFixed(2)));
}
