export type TimeToolCategory =
  | 'core'
  | 'date-calculators'
  | 'age-calculators'
  | 'time-conversion'
  | 'countdown'
  | 'timers'
  | 'calendar'
  | 'time-zones'
  | 'guides';

export type SearchIntent =
  | 'calculator'
  | 'converter'
  | 'countdown'
  | 'timer'
  | 'reference'
  | 'educational';

export interface VariableDefinition {
  symbol: string;
  label: string;
  description: string;
}

export interface WorkedExample {
  scenario: string;
  steps: string[];
  conclusion: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ReferenceTableRow {
  label: string;
  value: string;
  secondary?: string;
}

export interface TimeToolDefinition {
  slug: string;
  canonicalPath: string;
  category: TimeToolCategory;
  subcategoryTitle: string;
  name: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  searchIntent: SearchIntent;
  calculatorType:
    | 'time-duration'
    | 'add-subtract-time'
    | 'work-hours'
    | 'time-card'
    | 'average-time'
    | 'business-days'
    | 'date-diff'
    | 'days-from-today'
    | 'days-since'
    | 'day-of-week'
    | 'age'
    | 'age-diff'
    | 'how-old-was-i'
    | 'leap-year'
    | 'month-calc'
    | 'unit-converter'
    | 'pair-converter'
    | 'format-converter'
    | 'countdown'
    | 'preset-timer'
    | 'stopwatch'
    | 'custom-timer'
    | 'date-reference'
    | 'guide';
  formula?: string;
  variableDefinitions?: VariableDefinition[];
  workedExample?: WorkedExample;
  assumptions?: string[];
  referenceTable?: {
    title: string;
    headers: string[];
    rows: string[][];
  };
  relatedSlugs: string[];
  faqs: FAQItem[];
  // Special props for parameterized engines
  presetSeconds?: number;
  fromUnit?: string;
  toUnit?: string;
  formatType?: '24-to-12' | '12-to-24' | 'military' | 'hms-to-decimal' | 'decimal-to-hms' | 'hms-to-min' | 'hms-to-sec';
  countdownTargetMonth?: number; // 0-indexed
  countdownTargetDay?: number;
  countdownTargetTime?: string; // "15:00:00"
  countdownDefaultName?: string;
  relativeDaysOffset?: number;
  relativeMonthsOffset?: number;
  relativeWeeksOffset?: number;
  referenceMetricType?: 'today' | 'day-of-year' | 'week-number' | 'days-left-year' | 'weeks-left-year' | 'current-month' | 'current-year';
  guideContent?: {
    summary: string;
    sections: { heading: string; body: string }[];
  };
}
