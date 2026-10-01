export type ModeType = 'all-days' | 'business-days' | 'work-hours' | 'event-countdown';

export type WorkWeekSchedule = '5-day' | '6-day' | '4-day' | 'sun-thu' | 'custom';

export type WorkHoursMode = 'daily-hours' | 'shift-time';

export interface MatchedHoliday {
  date: string;
  name: string;
  dayOfWeek: string;
}

export interface CalculationResults {
  isReverse: boolean;
  d1: Date;
  d2: Date;
  msDiff: number;
  totalCalendarDays: number;
  businessDays: number;
  weekendDays: number;
  holidaysCount: number;
  matchedHolidays: MatchedHoliday[];
  totalWeeks: string;
  totalHours: number;
  totalMinutes: number;
  effectiveDailyHours: number;
  calculatedWorkHours: number;
  grossEarnings: number;
  fteWeeks: string;
  workdayPercent: string;
  humanDuration: string;
  yearPercent: string;
  midTime: Date;
  quarter25Time: Date;
  quarter75Time: Date;
  totalFridays: number;
  agileSprints: string;
  quartersSpanned: string;
}

export interface CountdownResults {
  isPassed: boolean;
  totalSecondsRemaining: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  businessDaysRemaining: number;
  workHoursRemaining: number;
  totalWeeksRemaining: string;
  totalHoursRemaining: number;
  totalMinutesRemaining: number;
  targetDateFormatted: string;
}
