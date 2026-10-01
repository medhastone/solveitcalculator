export interface LeapYearEvaluation {
  year: number;
  isLeap: boolean;
  isDiv400: boolean;
  isDiv100: boolean;
  isDiv4: boolean;
  ruleIndex: number; // 1: div400, 2: div100, 3: div4, 4: not div4
  reason: string;
  febDays: number;
  totalDays: number;
  totalHours: number;
  solarDrift: string;
  prevLeap: number;
  nextLeap: number;
}

export type CycleFilter = 'all' | 'leap' | 'common' | 'centuries';

export interface CycleYearItem {
  year: number;
  isLeap: boolean;
  isDiv400: boolean;
  isDiv100: boolean;
  febDays: number;
  totalDays: number;
  reason: string;
}

export interface SpanCalculationResult {
  startYear: number;
  endYear: number;
  totalYears: number;
  leapCount: number;
  commonCount: number;
  extraDaysAdded: number;
  leapYears: number[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
  explanationCorrect: string;
  explanationIncorrect: string;
}

export interface LeapYearFact {
  title: string;
  description: string;
  icon: string;
}

export interface HistoricalCenturyRow {
  year: number;
  gregorianRule: string;
  julianRule: string;
  daysDrifted: string;
  whatHappened: string;
  isCenturyLeap: boolean;
}

export interface RelatedToolItem {
  title: string;
  desc: string;
  icon: string;
  href: string;
}
