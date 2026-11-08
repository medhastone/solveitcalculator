import type { Metadata } from 'next';
import CategoryHubPageClient, {
  CategoryHubConfig,
} from '@/components/CategoryHubPageClient';

export const metadata: Metadata = {
  title:
    'Date & Time Calculators — Exact Age, Days Between Dates & Work Hours | SolveItCalculator',
  description:
    'Free date and time calculators with leap-year accuracy: calculate exact chronological age in years, months, and days, count days between calendar dates, and sum hours and minutes.',
  alternates: {
    canonical: 'https://solveitcalculator.com/date-time',
  },
  openGraph: {
    title:
      'Date & Time Calculators — Age, Date Difference & Time Duration | SolveItCalculator',
    description:
      'Count days between dates, calculate exact age, and convert hours and minutes into decimal payroll hours.',
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
    'Count days between calendar dates, calculate your exact age in years, months, and days, or total hours and minutes between two times with leap-year accuracy.',
  searchPlaceholder: 'Find a date or time calculator',
  headerIconName: 'calendar',
  heroBadgeTopLeft: '365',
  heroBadgeBottomLeft: '24h',
  filters: [
    'All',
    'Date Differences',
    'Age & Birthdays',
    'Time & Hours',
    'Workdays & Deadlines',
  ],
  tools: [
    {
      id: 'date-difference-calculator',
      name: 'Date Difference Calculator',
      description:
        'Calculate the exact number of years, months, weeks, and days between any two calendar dates.',
      href: '/date-difference-calculator',
      category: 'Date Differences',
      displayBadge: 'Date Differences',
      iconName: 'calendar',
      iconBg: 'bg-[#FFF0F0]',
      iconColor: 'text-[#E11D48]',
      isPopular: true,
    },
    {
      id: 'age-calculator',
      name: 'Age Calculator',
      description:
        'Find your exact age in years, months, weeks, and days from your date of birth, plus days until your next birthday.',
      href: '/age-calculator',
      category: 'Age & Birthdays',
      displayBadge: 'Age & Birthdays',
      iconName: 'calendar',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'time-duration-calculator',
      name: 'Time Duration Calculator',
      description:
        'Calculate the elapsed hours, minutes, and seconds between a start time and end time, including overnight shifts.',
      href: '/time-duration-calculator',
      category: 'Time & Hours',
      displayBadge: 'Time & Hours',
      iconName: 'clock',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'business-days-calculator',
      name: 'Business Days & Working Days Calculator',
      description:
        'Count working weekdays between two dates while automatically excluding Saturdays and Sundays.',
      href: '/date-difference-calculator',
      category: 'Workdays & Deadlines',
      displayBadge: 'Workdays',
      iconName: 'calendar',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
      isPopular: true,
    },
    {
      id: 'add-subtract-days-calculator',
      name: 'Add or Subtract Days from a Date Calculator',
      description:
        'Find the exact future or past calendar date after adding or subtracting days, weeks, months, or years.',
      href: '/date-difference-calculator',
      category: 'Date Differences',
      displayBadge: 'Date Differences',
      iconName: 'calendar',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
      isPopular: true,
    },
    {
      id: 'work-hours-timesheet-calculator',
      name: 'Work Hours & Shift Duration Calculator',
      description:
        'Calculate total shift hours and decimal payroll hours from clock-in and clock-out times.',
      href: '/time-duration-calculator',
      category: 'Time & Hours',
      displayBadge: 'Time & Hours',
      iconName: 'clock',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'birthday-milestone-calculator',
      name: 'Next Birthday & Milestone Countdown Calculator',
      description:
        'See how many days remain until your next birthday and track life milestones in total days or weeks lived.',
      href: '/age-calculator',
      category: 'Age & Birthdays',
      displayBadge: 'Age & Birthdays',
      iconName: 'calendar',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      id: 'project-deadline-calculator',
      name: 'Project Deadline & Day Counter',
      description:
        'Plan project schedules by counting total calendar days and weekdays between start and delivery dates.',
      href: '/date-difference-calculator',
      category: 'Workdays & Deadlines',
      displayBadge: 'Workdays',
      iconName: 'clock',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E54D37]',
    },
  ],
  relatedCategories: [
    {
      name: 'Math Calculators',
      href: '/math',
      iconName: 'calculator',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Finance Calculators',
      href: '/finance',
      iconName: 'coins',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
    {
      name: 'Unit Conversion',
      href: '/unit-conversion',
      iconName: 'arrow-left-right',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Health & Fitness Calculators',
      href: '/health-fitness',
      iconName: 'heart',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      name: 'Business Calculators',
      href: '/finance/business',
      iconName: 'bar-chart',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      name: 'Retirement & Super',
      href: '/retirement-and-super',
      iconName: 'piggy-bank',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
  ],
  chooseGuideHeading: 'How to choose the right date or time calculator',
  chooseSteps: [
    {
      step: 1,
      title: 'Decide between dates or clock times',
      description:
        'Choose whether you are counting calendar days between dates or hours and minutes between clock times.',
    },
    {
      step: 2,
      title: 'Check if weekends should be excluded',
      description:
        'For shipping, payroll, or project deadlines, use the business days option to skip Saturdays and Sundays.',
    },
    {
      step: 3,
      title: 'Open the calculator',
      description:
        'Select the matching date, age, or time duration calculator from the list above.',
    },
    {
      step: 4,
      title: 'Review the full breakdown',
      description:
        'See your answer expressed in years, months, weeks, days, hours, and total minutes.',
    },
  ],
  faqs: [
    {
      question: 'Do the date calculators account for leap years and varying month lengths?',
      answer:
        'Yes. All date and age calculations use exact Gregorian calendar rules, automatically accounting for 28-, 29-, 30-, and 31-day months as well as leap years every four years (divisible by 4, except century years not divisible by 400).',
    },
    {
      question: 'How is exact age calculated in years, months, and days?',
      answer:
        'The Age Calculator counts completed full years from your birth date, then full calendar months since your last monthly anniversary, and finally the remaining days up to the target date, alongside total weeks, days, hours, and minutes lived.',
    },
    {
      question: 'How do I convert hours and minutes into decimal hours for payroll?',
      answer:
        'Keep the whole hours and divide the minutes by 60. For example, 7 hours and 45 minutes is 7 + (45 ÷ 60) = 7.75 decimal hours, and 8 hours 20 minutes is 8.33 decimal hours.',
    },
    {
      question: 'Can the Time Duration Calculator handle overnight shifts past midnight?',
      answer:
        'Yes. If your end time is earlier on the clock than your start time (such as 10:00 PM to 6:30 AM), the calculator automatically adds 24 hours to roll over past midnight and compute the true 8 hour 30 minute elapsed duration.',
    },
    {
      question: 'Does the Date Difference Calculator include both the start and end date?',
      answer:
        'By default, date subtraction measures the elapsed span between two dates (End − Start), and includes a toggle so you can add +1 day when counting inclusive calendar days for leave requests or hotel stays.',
    },
    {
      question: 'How many business days (working days) are in a standard year?',
      answer:
        'A standard 365-day year contains 52 full weeks (260 weekdays) plus 1 extra weekday, totaling 260 to 262 weekdays before subtracting federal or public holidays (typically leaving 250 to 252 working days).',
    },
    {
      question: 'How many weeks are in a month and in a year?',
      answer:
        'A standard 365-day year has 52 weeks and 1 day (52.143 weeks). Because months average 30.4375 days across the Gregorian cycle, an average calendar month contains 4.348 weeks—not exactly 4 weeks.',
    },
    {
      question: 'How do I find the exact date 30, 60, 90, or 180 days from today?',
      answer:
        'Open the Date Difference or Age & Date tool to add or subtract any number of days, weeks, or months from a starting date while automatically rolling across month-end boundaries.',
    },
  ],
};

export default function DateTimeCategoryPage() {
  return <CategoryHubPageClient config={DATE_TIME_CONFIG} />;
}
