import type { Metadata } from 'next';
import CategoryHubPageClient, {
  CategoryHubConfig,
} from '@/components/CategoryHubPageClient';

export const metadata: Metadata = {
  title: 'Date & Time Calculators: Age, Hours, Countdowns | SolveIt',
  description:
    'Calculate days between dates, business days, days from today, chronological age, event countdowns, work hours, timers, military time, and time unit conversions.',
  alternates: {
    canonical: 'https://solveitcalculator.com/date-time',
  },
  openGraph: {
    title: 'Date & Time Calculators: Age, Hours, Countdowns | SolveIt',
    description:
      'Calculate days between dates, business days, chronological age, countdowns, work hours, timers, and military time.',
    url: 'https://solveitcalculator.com/date-time',
    type: 'website',
  },
};

const DATE_TIME_CONFIG: CategoryHubConfig = {
  id: 'date-time',
  breadcrumbLabel: 'Date & Time',
  title: 'Date & Time Calculators',
  shortTitle: 'Date & Time',
  introduction:
    'Pick the right calendar or clock tool for your task—whether you are counting calendar or working days between two dates, adding 30 or 90 days from today, finding your exact chronological age, totaling weekly payroll timesheets, or running a countdown timer.',
  searchPlaceholder:
    'Find a date or time calculator (e.g. age, business days, days from today, military time...)',
  headerIconName: 'calendar',
  heroBadgeTopLeft: '365d',
  heroBadgeBottomLeft: '24hr',
  filters: [
    'All',
    'Calendar & Dates',
    'Age & Countdowns',
    'Hours & Payroll',
    'Timers & Clocks',
  ],
  tools: [
    {
      id: 'date-difference-calculator',
      name: 'Date Difference Calculator (Days & Weeks Between Dates)',
      description:
        'Count the exact number of calendar days, weeks, and remaining days between any two dates with leap-year handling.',
      href: '/date-difference-calculator',
      category: 'Calendar & Dates',
      displayBadge: 'Calendar Span',
      iconName: 'calendar',
      symbolText: 'ΔDays',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'days-from-today-calculator',
      name: 'Days From Today Calculator (Add or Subtract Days & Weeks)',
      description:
        'Add or subtract 30, 45, 60, 90, or any number of days and weeks from a starting date to find the exact target date.',
      href: '/days-from-today-calculator',
      category: 'Calendar & Dates',
      displayBadge: 'Add / Subtract',
      iconName: 'calendar',
      symbolText: '+30d',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
      isPopular: true,
    },
    {
      id: 'business-days-calculator',
      name: 'Business Days & Working Weekdays Calculator',
      description:
        'Count Monday-through-Friday working days between two calendar dates while excluding weekends and public holidays.',
      href: '/business-days-calculator',
      category: 'Calendar & Dates',
      displayBadge: 'Mon–Fri Workdays',
      iconName: 'calendar',
      symbolText: 'M–F',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'age-calculator',
      name: 'Chronological Age Calculator (Years, Months & Days)',
      description:
        'Find your exact age in completed years, months, weeks, days, and total hours from your date of birth.',
      href: '/age-calculator',
      category: 'Age & Countdowns',
      displayBadge: 'Exact Age',
      iconName: 'clock',
      symbolText: 'Y·M·D',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E11D48]',
      isPopular: true,
    },
    {
      id: 'countdown-calculator',
      name: 'Event & Birthday Countdown Calculator',
      description:
        'Count down the exact days, weeks, and hours remaining until a wedding, birthday, vacation, holiday, or launch.',
      href: '/countdown-calculator',
      category: 'Age & Countdowns',
      displayBadge: 'Countdowns',
      iconName: 'calendar',
      symbolText: '⏳',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      id: 'time-duration-calculator',
      name: 'Time Duration Calculator (Hours & Minutes Between Times)',
      description:
        'Calculate elapsed hours, minutes, and decimal payroll hours between a start clock time and end clock time.',
      href: '/time-duration-calculator',
      category: 'Hours & Payroll',
      displayBadge: 'Shift Duration',
      iconName: 'clock',
      symbolText: 'hr:min',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'work-hours-calculator',
      name: 'Work Hours & Weekly Timesheet Calculator',
      description:
        'Sum Monday–Friday work hours, split regular hours from 1.5x overtime over 40 hours, and estimate gross weekly pay.',
      href: '/work-hours-calculator',
      category: 'Hours & Payroll',
      displayBadge: 'Weekly Timesheet',
      iconName: 'clock',
      symbolText: '40h',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'timer-stopwatch',
      name: 'Online Timer & Focus Stopwatch (Pomodoro Presets)',
      description:
        'Start an interactive countdown timer with 5, 10, 15, 25 (Pomodoro), 45, and 60-minute presets for study and workouts.',
      href: '/timer-stopwatch',
      category: 'Timers & Clocks',
      displayBadge: 'Live Timer',
      iconName: 'clock',
      symbolText: '25:00',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      id: 'military-time-converter',
      name: 'Military Time & 24-Hour Clock Converter (0000–2359)',
      description:
        'Convert between 24-hour military time (e.g. 1745 hrs) and standard 12-hour AM/PM clock time instantly.',
      href: '/military-time-converter',
      category: 'Timers & Clocks',
      displayBadge: '24h ↔ AM/PM',
      iconName: 'arrow-left-right',
      symbolText: '24h',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      id: 'time-unit-converter',
      name: 'Time Unit & Decimal Hours Converter (hr, min, sec, days)',
      description:
        'Convert hours, minutes, and seconds into decimal hours, total minutes, total seconds, and days.',
      href: '/time-unit-converter',
      category: 'Timers & Clocks',
      displayBadge: 'Time Units',
      iconName: 'arrow-left-right',
      symbolText: 'h↔s',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
  ],
  relatedCategories: [
    {
      name: 'Finance & Payroll Calculators',
      href: '/finance',
      iconName: 'coins',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
    {
      name: 'Math Calculators',
      href: '/math',
      iconName: 'calculator',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Health & Fitness Calculators',
      href: '/health-fitness',
      iconName: 'heart',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E11D48]',
    },
    {
      name: 'Unit Conversion Calculators',
      href: '/conversions',
      iconName: 'arrow-left-right',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
  ],
  chooseGuideHeading: 'Which date or time calculator should I use?',
  chooseSteps: [
    {
      step: 1,
      title: 'Date Difference vs. Business Days vs. Days From Today',
      description:
        'Use Date Difference when you have two known dates and want total calendar days. Use Business Days when Saturdays, Sundays, and holidays must be excluded. Use Days From Today when you have one start date and want to add or subtract 30, 60, or 90 days to find the target date.',
    },
    {
      step: 2,
      title: 'Age Calculator vs. Countdown Calculator',
      description:
        'Use the Age Calculator to break a birth date into completed years, months, and days plus your next birthday. Use the Countdown Calculator to track weeks, days, and hours left until any future event or holiday.',
    },
    {
      step: 3,
      title: 'Time Duration Calculator vs. Work Hours Timesheet Calculator',
      description:
        'Use Time Duration to find hours and minutes for a single shift from clock-in to clock-out (including overnight shifts). Use Work Hours Calculator to total a full 5-day workweek, split regular vs. 1.5x overtime hours, and compute gross pay.',
    },
    {
      step: 4,
      title: 'Military Time Converter vs. Time Unit Converter',
      description:
        'Use Military Time Converter to translate 24-hour clock codes (like 1745 hrs) into 12-hour AM/PM time. Use Time Unit Converter to turn hours, minutes, and seconds into decimal hours or total seconds.',
    },
  ],
  matchingGuides: [
    {
      title: 'How to Calculate Exact Age and Days Between Two Dates',
      description:
        'Understand calendar month borrowing, Gregorian leap-year rules, and inclusive vs. exclusive day counting.',
      href: '/guides/how-to-calculate-exact-age-and-date-difference',
    },
    {
      title: 'How to Calculate Net Salary, Take-Home Pay, and Hourly Wages',
      description:
        'See how decimal payroll hours and overtime multipliers connect to your take-home paycheck.',
      href: '/guides/how-to-calculate-net-salary-and-sales-tax',
    },
  ],
  faqs: [
    {
      question: 'How does the Date Difference Calculator handle leap years?',
      answer:
        'A Gregorian year is a leap year if it is divisible by 4, except century years that are not divisible by 400 (so 2024 and 2028 have 366 days). Our UTC timestamp engine automatically includes February 29 whenever your span crosses a leap year.',
    },
    {
      question: 'Should I include the end date when counting days between dates?',
      answer:
        'By default, date subtraction measures elapsed time (excluding the final day, like counting hotel nights). Check "Include end date (+1 day)" when both the start and end dates count as full active days, such as a Monday-to-Friday vacation (5 days).',
    },
    {
      question: 'How do I convert hours and minutes into decimal hours for payroll?',
      answer:
        'Keep the whole hours and divide the minutes by 60. For example, 7 hours and 45 minutes is 7 + (45 ÷ 60) = 7.75 decimal hours. Multiply 7.75 by your hourly pay rate to get exact gross pay.',
    },
    {
      question: 'How do I convert 24-hour military time to 12-hour AM/PM time?',
      answer:
        'For hours between 01:00 and 11:59, keep the hour and add AM (00:00 is 12:00 AM midnight; 12:00 is 12:00 PM noon). For hours from 13:00 to 23:59, subtract 12 from the hour and add PM (for example, 17:30 − 12 = 5:30 PM).',
    },
    {
      question: 'How does the Time Duration Calculator handle overnight shifts past midnight?',
      answer:
        'If your end time is earlier on the clock than your start time (such as 10:00 PM to 6:30 AM), the calculator automatically adds 24 hours to the end time so your overnight shift duration is calculated accurately.',
    },
  ],
};

export default function DateTimeCategoryPage() {
  return <CategoryHubPageClient config={DATE_TIME_CONFIG} />;
}
