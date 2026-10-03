/**
 * Precision Mathematical & Calendar Arithmetic Engine for Time & Date Suite
 */

// Universal time unit ratios relative to 1 second
export const TIME_UNIT_FACTORS: Record<string, number> = {
  nanoseconds: 1e-9,
  microseconds: 1e-6,
  milliseconds: 1e-3,
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  months: 2629746, // Average Gregorian month = 365.2425 / 12 * 86400 = 2629746 seconds
  years: 31556952, // Average Gregorian solar year = 365.2425 * 86400 = 31556952 seconds
  decades: 315569520,
  centuries: 3155695200,
};

export const TIME_UNIT_LABELS: Record<string, string> = {
  nanoseconds: 'Nanoseconds (ns)',
  microseconds: 'Microseconds (μs)',
  milliseconds: 'Milliseconds (ms)',
  seconds: 'Seconds (s)',
  minutes: 'Minutes (min)',
  hours: 'Hours (hr)',
  days: 'Days (d)',
  weeks: 'Weeks (wk)',
  months: 'Months (mo, avg)',
  years: 'Years (yr, avg)',
  decades: 'Decades (dec)',
  centuries: 'Centuries (c)',
};

/**
 * Universal Unit Conversion
 */
export function convertTimeUnit(value: number, fromUnit: string, toUnit: string): number {
  if (isNaN(value) || !TIME_UNIT_FACTORS[fromUnit] || !TIME_UNIT_FACTORS[toUnit]) {
    return 0;
  }
  const seconds = value * TIME_UNIT_FACTORS[fromUnit];
  return seconds / TIME_UNIT_FACTORS[toUnit];
}

/**
 * Check if a given year is a leap year under the Gregorian calendar
 */
export function isLeapYear(year: number): boolean {
  if (!Number.isInteger(year)) return false;
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the exact number of days in a specific month of a specific year
 */
export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Calculate chronological difference between two dates
 */
export interface DateDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  isNegative: boolean;
}

export function calculateDateDifference(
  startDate: Date,
  endDate: Date,
  inclusive = false
): DateDiffResult {
  let isNegative = false;
  let d1 = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  let d2 = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (d1 > d2) {
    isNegative = true;
    const temp = d1;
    d1 = d2;
    d2 = temp;
  }

  // Adjust for inclusive if requested
  if (inclusive) {
    d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate() + 1);
  }

  const totalMilliseconds = d2.getTime() - d1.getTime();
  const totalDays = Math.round(totalMilliseconds / (1000 * 60 * 60 * 24));
  const totalWeeks = Number((totalDays / 7).toFixed(2));
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;

  let y1 = d1.getFullYear();
  let m1 = d1.getMonth();
  let day1 = d1.getDate();

  const y2 = d2.getFullYear();
  const m2 = d2.getMonth();
  const day2 = d2.getDate();

  let years = y2 - y1;
  let months = m2 - m1;
  let days = day2 - day1;

  if (days < 0) {
    months -= 1;
    // get days in previous month
    const prevMonthDays = getDaysInMonth(y2, m2 === 0 ? 11 : m2 - 1);
    days += prevMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
    isNegative,
  };
}

/**
 * Add or subtract calendar units from a starting date
 */
export function addSubtractDate(
  startDate: Date,
  options: {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    operation: 'add' | 'subtract';
  }
): Date {
  const mult = options.operation === 'add' ? 1 : -1;
  const result = new Date(startDate.getTime());

  const targetYear = result.getFullYear() + (options.years || 0) * mult;
  const targetMonth = result.getMonth() + (options.months || 0) * mult;
  const originalDay = result.getDate();

  // Set year and month first
  result.setFullYear(targetYear);
  result.setMonth(targetMonth);

  // Pin day if month rollover occurred (e.g. Jan 31 + 1 mo -> Feb 28)
  const maxDays = getDaysInMonth(result.getFullYear(), result.getMonth());
  if (originalDay > maxDays) {
    result.setDate(maxDays);
  }

  const dayOffset = ((options.weeks || 0) * 7 + (options.days || 0)) * mult;
  result.setDate(result.getDate() + dayOffset);

  if (options.hours) result.setHours(result.getHours() + options.hours * mult);
  if (options.minutes) result.setMinutes(result.getMinutes() + options.minutes * mult);

  return result;
}

/**
 * Business Days Calculator
 */
export function calculateBusinessDays(
  startDate: Date,
  endDate: Date,
  options: {
    includeWeekends?: boolean;
    workDays?: number[]; // default [1,2,3,4,5] (Mon=1 ... Fri=5)
    includeStartDate?: boolean;
    holidays?: string[]; // YYYY-MM-DD strings
  } = {}
): {
  businessDays: number;
  weekendDays: number;
  holidayDays: number;
  totalCalendarDays: number;
} {
  const workDays = options.workDays || [1, 2, 3, 4, 5];
  const holidays = new Set(options.holidays || []);

  const d1 = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const d2 = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (d1 > d2) {
    return { businessDays: 0, weekendDays: 0, holidayDays: 0, totalCalendarDays: 0 };
  }

  let businessDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;
  let totalCalendarDays = 0;

  const current = new Date(d1);
  const endLimit = new Date(d2);

  while (current <= endLimit) {
    const dayOfWeek = current.getDay(); // 0 is Sunday, 6 is Saturday
    const dateKey = current.toISOString().slice(0, 10);
    const isWorkDay = workDays.includes(dayOfWeek);
    const isHoliday = holidays.has(dateKey);

    totalCalendarDays++;

    if (!isWorkDay) {
      weekendDays++;
    } else if (isHoliday) {
      holidayDays++;
    } else {
      businessDays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return { businessDays, weekendDays, holidayDays, totalCalendarDays };
}

/**
 * Time duration between two clock times (HH:MM:SS)
 */
export function calculateTimeDuration(
  startTime: string, // "09:00:00" or "09:00"
  endTime: string,
  breakMinutes = 0
): {
  hours: number;
  minutes: number;
  seconds: number;
  decimalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  crossesMidnight: boolean;
} {
  const parseTime = (t: string) => {
    const parts = t.split(':').map((p) => parseInt(p, 10) || 0);
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  };

  const startSec = parseTime(startTime);
  let endSec = parseTime(endTime);
  let crossesMidnight = false;

  if (endSec < startSec) {
    endSec += 24 * 3600; // Overnight
    crossesMidnight = true;
  }

  let diffSec = endSec - startSec - breakMinutes * 60;
  if (diffSec < 0) diffSec = 0;

  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  const decimalHours = Number((diffSec / 3600).toFixed(4));
  const totalMinutes = Number((diffSec / 60).toFixed(2));

  return {
    hours,
    minutes,
    seconds,
    decimalHours,
    totalMinutes,
    totalSeconds: diffSec,
    crossesMidnight,
  };
}

/**
 * Add / Subtract Two Durations (HH:MM:SS + HH:MM:SS)
 */
export function addSubtractTimeDurations(
  durations: { hours: number; minutes: number; seconds: number }[],
  operation: 'add' | 'subtract' = 'add'
): { hours: number; minutes: number; seconds: number; totalSeconds: number; formatted: string } {
  let totalSec = 0;

  durations.forEach((d, idx) => {
    const sec = d.hours * 3600 + d.minutes * 60 + d.seconds;
    if (idx === 0 || operation === 'add') {
      totalSec += sec;
    } else {
      totalSec -= sec;
    }
  });

  const isNeg = totalSec < 0;
  const absSec = Math.abs(totalSec);
  const h = Math.floor(absSec / 3600);
  const m = Math.floor((absSec % 3600) / 60);
  const s = absSec % 60;

  const formatted = `${isNeg ? '-' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return {
    hours: isNeg ? -h : h,
    minutes: isNeg ? -m : m,
    seconds: isNeg ? -s : s,
    totalSeconds: totalSec,
    formatted,
  };
}

/**
 * Age Breakdown with Zodiac & Birthday Countdown
 */
export function calculateDetailedAge(
  birthDate: Date,
  currentDate: Date = new Date()
): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthdayDays: number;
  zodiacSign: string;
  dayOfWeekBorn: string;
} {
  const diff = calculateDateDifference(birthDate, currentDate);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekBorn = daysOfWeek[birthDate.getDay()];

  // Next birthday calculation
  const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < currentDate) {
    nextBirthday.setFullYear(currentDate.getFullYear() + 1);
  }
  const nextDiff = calculateDateDifference(currentDate, nextBirthday);

  // Zodiac Sign
  const m = birthDate.getMonth() + 1;
  const d = birthDate.getDate();
  let zodiacSign = 'Capricorn';

  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) zodiacSign = 'Aquarius';
  else if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) zodiacSign = 'Pisces';
  else if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) zodiacSign = 'Aries';
  else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) zodiacSign = 'Taurus';
  else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) zodiacSign = 'Gemini';
  else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) zodiacSign = 'Cancer';
  else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) zodiacSign = 'Leo';
  else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) zodiacSign = 'Virgo';
  else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) zodiacSign = 'Libra';
  else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) zodiacSign = 'Scorpio';
  else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) zodiacSign = 'Sagittarius';
  else if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) zodiacSign = 'Capricorn';

  return {
    years: diff.years,
    months: diff.months,
    days: diff.days,
    totalDays: diff.totalDays,
    totalHours: diff.totalHours,
    totalMinutes: diff.totalMinutes,
    totalSeconds: diff.totalSeconds,
    nextBirthdayDays: nextDiff.totalDays,
    zodiacSign,
    dayOfWeekBorn,
  };
}

/**
 * Format Time Utilities
 */
export function format24To12(time24: string): { formatted12: string; hours: number; minutes: number; period: 'AM' | 'PM' } {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 === 0 ? 12 : h % 12;
  const formatted12 = `${displayHours}:${String(m).padStart(2, '0')} ${period}`;
  return { formatted12, hours: displayHours, minutes: m, period };
}

export function format12To24(hours: number, minutes: number, period: 'AM' | 'PM'): string {
  let h = hours % 12;
  if (period === 'PM') h += 12;
  return `${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatToMilitary(time: string): { military: string; phonetic: string } {
  // Input could be "14:30" or "2:30 PM"
  let h = 0;
  let m = 0;

  if (time.includes('AM') || time.includes('PM')) {
    const isPM = time.includes('PM');
    const clean = time.replace(/[APM ]/gi, '');
    const parts = clean.split(':').map((p) => parseInt(p, 10) || 0);
    h = (parts[0] || 0) % 12 + (isPM ? 12 : 0);
    m = parts[1] || 0;
  } else {
    const parts = time.split(':').map((p) => parseInt(p, 10) || 0);
    h = parts[0] || 0;
    m = parts[1] || 0;
  }

  const military = `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')} hours`;
  const phonetic = `${String(h).padStart(2, '0')} hundred ${m > 0 ? String(m).padStart(2, '0') : ''} hours`.trim();

  return { military, phonetic };
}

export function decimalHoursToHms(decimalHours: number): {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
} {
  const isNeg = decimalHours < 0;
  const absHours = Math.abs(decimalHours);
  const totalSec = Math.round(absHours * 3600);

  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const formatted = `${isNeg ? '-' : ''}${hours}h ${minutes}m ${seconds}s`;
  return { hours, minutes, seconds, formatted };
}

export function hmsToDecimalHours(hours: number, minutes: number, seconds: number): number {
  return Number((hours + minutes / 60 + seconds / 3600).toFixed(6));
}

/**
 * Dynamic Calendar Metrics for "Today"
 */
export function getTodayReferenceMetrics(date: Date = new Date()): {
  isoDate: string;
  formattedLong: string;
  dayOfWeek: string;
  dayOfYear: number;
  totalDaysInYear: number;
  daysRemainingInYear: number;
  weekNumber: number;
  totalWeeksInYear: number;
  weeksRemainingInYear: number;
  isLeapYear: boolean;
  currentQuarter: number;
} {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const diffTime = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const leap = isLeapYear(year);
  const totalDaysInYear = leap ? 366 : 365;
  const daysRemainingInYear = totalDaysInYear - dayOfYear;

  // ISO Week number calculation
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const totalWeeksInYear = 52;
  const weeksRemainingInYear = Math.max(0, totalWeeksInYear - weekNumber);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[date.getDay()];

  const currentQuarter = Math.floor(date.getMonth() / 3) + 1;

  const formattedLong = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    isoDate: date.toISOString().slice(0, 10),
    formattedLong,
    dayOfWeek,
    dayOfYear,
    totalDaysInYear,
    daysRemainingInYear,
    weekNumber,
    totalWeeksInYear,
    weeksRemainingInYear,
    isLeapYear: leap,
    currentQuarter,
  };
}
