'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Briefcase,
  Globe,
  Search,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Calculator,
  RotateCcw,
  Info,
} from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs';

// --- Types ---
interface ToolItem {
  name: string;
  badge: string;
  category: string;
  desc: string;
  anchor: string;
}

interface CategoryGroup {
  id: string;
  name: string;
  icon: string;
  tools: ToolItem[];
}

// --- Curated Directory of 37 Easy Time & Date Tools ---
const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'age-birthday',
    name: 'Age & Birthday',
    icon: 'cake',
    tools: [
      { name: 'Age Calculator', badge: 'Years, Months & Days', category: 'Age & Birthday', desc: 'Find out exactly how many years, months, and days old you are, plus days until your next birthday.', anchor: '/time-date/age-calculator' },
      { name: 'Birthday Day of Week Calculator', badge: 'Any Past Year', category: 'Age & Birthday', desc: 'Find out what day of the week you or anyone was born on (Monday, Tuesday, etc.).', anchor: '/time-date/age-calculator' },
      { name: 'Birthday Countdown Clock', badge: 'Live Timer', category: 'Age & Birthday', desc: 'A live ticking clock showing how many days, hours, and minutes are left until your next birthday.', anchor: '/time-date/birthday-tracker' },
      { name: 'Age in Weeks, Days & Hours', badge: 'Total Days Lived', category: 'Age & Birthday', desc: 'See how many total weeks, days, and hours you have lived since the day you were born.', anchor: '/time-date/age-calculator' },
      { name: 'Dog & Cat Age in Human Years', badge: 'Pet Years', category: 'Age & Birthday', desc: 'Easily turn your dog or cat age into human years to understand how old your pet is.', anchor: '/pet-age-converter' },
      { name: 'Half-Birthday & Milestone Finder', badge: '6-Month Mark', category: 'Age & Birthday', desc: 'Find your half-birthday date and find out when you reach 10,000 days of life.', anchor: '/time-date/birthday-tracker' },
    ],
  },
  {
    id: 'date-calculations',
    name: 'Date Calculations',
    icon: 'calendar_month',
    tools: [
      { name: 'Days Between Dates Calculator', badge: 'Count Days', category: 'Date Calculations', desc: 'Find the exact number of days, weeks, and months between any two dates on the calendar.', anchor: '/time-date/date-difference' },
      { name: 'Days Between Dates (Inclusive)', badge: 'Count Both Days', category: 'Date Calculations', desc: 'Count all days between two dates, with an option to include the start and end days.', anchor: '/time-date/days-between-dates' },
      { name: 'Working Days Calculator', badge: 'Skip Weekends & Holidays', category: 'Date Calculations', desc: 'Count real work days between dates, automatically skipping weekends and public holidays.', anchor: '/time-date/days-calculator' },
      { name: 'Add & Subtract Time Calculator', badge: 'Add or Take Days', category: 'Date Calculations', desc: 'Add or subtract years, months, days, hours, or minutes to any date to find past or future times.', anchor: '/time-date/add-subtract-time' },
      { name: 'Add or Subtract Days from a Date', badge: 'Date ± Days', category: 'Date Calculations', desc: 'Quickly find what date it will be after adding or taking away any number of days.', anchor: '/time-date/days-calculator' },
      { name: 'Day Number Counter (Julian Day)', badge: 'Running Day Count', category: 'Date Calculations', desc: 'A simple continuous day counter used by stargazers and calendar history researchers.', anchor: '/julian-day-calculator' },
      { name: 'Leap Year Checker', badge: '366 Days Check', category: 'Date Calculations', desc: 'Check if any year has 366 days and an extra day on February 29.', anchor: '/leap-year-calculator' },
    ],
  },
  {
    id: 'time-arithmetic',
    name: 'Time & Clocks',
    icon: 'calculate',
    tools: [
      { name: 'Add Time (Hours & Minutes)', badge: 'Add Up Times', category: 'Time & Clocks', desc: 'Add different hours, minutes, and seconds together from different tasks or activities.', anchor: '/time-date/time-calculator' },
      { name: 'Subtract Time (Time Difference)', badge: 'Time Left', category: 'Time & Clocks', desc: 'Find out how much time has passed between two clock times or how much time is left.', anchor: '/time-date/time-calculator' },
      { name: 'Decimal Hours to Minutes', badge: '0.75h = 45 mins', category: 'Time & Clocks', desc: 'Easily turn decimal work hours (like 7.5 hours) into normal hours and minutes (7 hours 30 mins).', anchor: '/time-date/time-calculator' },
      { name: 'Seconds to Hours & Minutes', badge: 'Seconds to Time', category: 'Time & Clocks', desc: 'Turn large numbers of seconds into readable hours, minutes, and seconds.', anchor: '/time-date/time-calculator' },
      { name: 'Running & Walking Pace Calculator', badge: 'Minutes per Mile', category: 'Time & Clocks', desc: 'Find out how fast you run or walk per mile or kilometer, and your finish time.', anchor: '/running-pace-calculator' },
      { name: 'Computer Timestamp to Real Date', badge: 'Unix Timestamp', category: 'Time & Clocks', desc: 'Turn computer timestamp numbers into normal dates and times that anyone can read.', anchor: '/unix-timestamp-converter' },
    ],
  },
  {
    id: 'time-zones-remote',
    name: 'World Time Zones',
    icon: 'public',
    tools: [
      { name: 'World Time Zone Converter', badge: 'City Times', category: 'World Time Zones', desc: 'Convert hours and meeting times across different cities and countries around the world.', anchor: '/time-date/time-zone-converter' },
      { name: 'World Clock Grid', badge: 'Live City Clocks', category: 'World Time Zones', desc: 'See live clocks for major cities like New York, London, Tokyo, Paris, and Sydney.', anchor: '/time-date/world-clock-grid' },
      { name: 'Meeting Time Overlap Finder', badge: 'Best Meeting Time', category: 'World Time Zones', desc: 'Find daytime hours when you and friends, family, or coworkers in other countries are both awake.', anchor: '/time-date/time-zone-overlap' },
      { name: 'Team Shift Handover Planner', badge: 'Work Handover', category: 'World Time Zones', desc: 'Plan how work moves smoothly between team members in different countries.', anchor: '/time-date/async-team-handover' },
      { name: 'Clock Change & Daylight Saving Tracker', badge: 'Spring & Fall Changes', category: 'World Time Zones', desc: 'Check when clocks change 1 hour forward in spring or 1 hour backward in fall.', anchor: '/time-date/dst-transition-tracker' },
      { name: '24-Hour Military Time Converter', badge: '12h to 24h', category: 'World Time Zones', desc: 'Easily turn AM and PM times into 24-hour clock times (like 17:00 for 5:00 PM).', anchor: '/military-time-converter' },
      { name: 'Flight Travel Time & Jet Lag', badge: 'Travel Time', category: 'World Time Zones', desc: 'Calculate how long a flight takes and what the local time will be when you land.', anchor: '/time-date/multi-city-corridor' },
      { name: 'World Standard Time (UTC)', badge: 'UTC Offset', category: 'World Time Zones', desc: 'Check standard universal world time and how many hours your city is ahead or behind.', anchor: '/time-date/global-meeting-matrix' },
    ],
  },
  {
    id: 'work-shift-payroll',
    name: 'Work & Pay',
    icon: 'payments',
    tools: [
      { name: 'Work Hours & Punch Card Calculator', badge: 'Subtract Lunch Break', category: 'Work & Pay', desc: 'Add up your daily and weekly work hours, and automatically subtract unpaid lunch breaks.', anchor: '/time-date/work-hours' },
      { name: 'Overtime Pay Calculator (1.5× Rate)', badge: 'Extra Pay for Overtime', category: 'Work & Pay', desc: 'Calculate your regular pay and extra 1.5× overtime money when working over 8 hours.', anchor: '/time-date/work-hours' },
      { name: 'Rotating Shift Schedule Planner', badge: 'Day & Night Shifts', category: 'Work & Pay', desc: 'Plan weekly rotating day and night work shifts for yourself or team members.', anchor: '/time-date/work-hours' },
      { name: 'Work Time Rounder (6 or 15 mins)', badge: 'Round Minutes', category: 'Work & Pay', desc: 'Round your work minutes to the nearest 6 minutes (0.1h) or 15 minutes for timesheets.', anchor: '/time-date/work-hours' },
      { name: '2-Week Timesheet Helper', badge: '14-Day Timesheet', category: 'Work & Pay', desc: 'Add up hours across a 2-week pay period and export your timesheet easily.', anchor: '/time-date/work-hours' },
      { name: 'Yearly Salary to Hourly Pay', badge: 'Pay by Hour', category: 'Work & Pay', desc: 'See how much a yearly salary equals in hourly, daily, and per-minute earnings.', anchor: '/time-date/work-hours' },
    ],
  },
  {
    id: 'countdowns-focus',
    name: 'Countdowns & Timers',
    icon: 'hourglass_top',
    tools: [
      { name: 'Event Countdown Clock', badge: 'Live Countdown', category: 'Countdowns & Timers', desc: 'Create a live ticking countdown clock for weddings, holidays, vacations, or parties.', anchor: '/time-date/event-countdown' },
      { name: 'Full-Screen Countdown Timer', badge: 'Timer with Alarm', category: 'Countdowns & Timers', desc: 'A clean full-screen countdown timer with start, pause, reset, and chime sound.', anchor: '/time-date/countdown-timer' },
      { name: 'Work & Rest Focus Timer', badge: '25m Work / 5m Rest', category: 'Countdowns & Timers', desc: 'Boost focus with simple work sprints followed by short rest breaks to keep your energy up.', anchor: '/focus-and-break-timer' },
      { name: 'Days Until Christmas & New Year', badge: 'Holiday Countdowns', category: 'Countdowns & Timers', desc: 'Count the remaining days, hours, and minutes until Christmas, New Year, and holidays.', anchor: '/time-date/event-countdown' },
      { name: '90-Minute Focus & Energy Planner', badge: 'Energy Waves', category: 'Countdowns & Timers', desc: 'Plan your work around natural 90-minute waves when your brain is sharpest.', anchor: '/time-date/90-minute-ultradian-rhythm-planner' },
      { name: 'Days Until Retirement Calculator', badge: 'Workdays Left', category: 'Countdowns & Timers', desc: 'Find out exactly how many working shifts and calendar days you have left until retirement.', anchor: '/retirement-countdown-in-workdays' },
    ],
  },
  {
    id: 'astronomy-solar',
    name: 'Sun & Moon',
    icon: 'wb_sunny',
    tools: [
      { name: 'Sunrise & Sunset Times', badge: 'Sun Times', category: 'Sun & Moon', desc: 'Find when the sun rises, sets, and when daylight begins and ends in your area.', anchor: '/time-date/sunrise-sunset-calculator' },
      { name: 'Moon Phase Calendar', badge: 'Full & New Moon', category: 'Sun & Moon', desc: 'See whether the moon is full, new, or crescent tonight, and when the next full moon is.', anchor: '/time-date/moon-phase-calculator' },
      { name: 'Sun & Moon Eclipse Dates', badge: 'Eclipse Tracker', category: 'Sun & Moon', desc: 'Find out when the next solar or lunar eclipse will take place around the world.', anchor: '/time-date/solar-eclipse-calculator' },
      { name: 'First Day of the Seasons', badge: 'Spring & Winter Dates', category: 'Sun & Moon', desc: 'Find the exact day and time when Spring, Summer, Fall, and Winter officially start.', anchor: '/time-date/equinox-solstice-calculator' },
      { name: 'Day & Night World Map', badge: 'Day vs Night Map', category: 'Sun & Moon', desc: 'An interactive world map showing which parts of the earth are in daylight or night right now.', anchor: '/time-date/day-night-world-map' },
      { name: 'Day Number Counter (Julian Day)', badge: 'Continuous Count', category: 'Sun & Moon', desc: 'Count uninterrupted days since ancient history for calendar research.', anchor: '/julian-day-calculator' },
    ],
  },
];

const FAQS = [
  {
    q: 'What can I calculate with these time and date tools?',
    a: 'You can find your exact age, count days between two dates, add or subtract days, calculate work hours and overtime pay, convert times across different world cities, set event countdowns, and check leap years—all free and right in your browser.',
  },
  {
    q: 'How does the Age Calculator find my exact age?',
    a: 'It looks at your real birth date and counts completed years, months, and days on the real calendar. It takes into account leap years and months with 28, 30, or 31 days, so your answer is 100% accurate.',
  },
  {
    q: 'What does "inclusive counting" mean when counting days?',
    a: 'If you count from Monday to Tuesday, regular counting says 1 day has passed. "Inclusive" counting includes both the first day and the last day, so Monday and Tuesday count as 2 days. You can choose either option with a simple checkbox.',
  },
  {
    q: 'How does the Workdays calculator skip weekends and holidays?',
    a: 'The tool looks at every day on the calendar between your two dates. It automatically skips Saturdays and Sundays, and can skip official holidays too, so you only see the days people actually work.',
  },
  {
    q: 'What happens when you add 1 month to January 31?',
    a: 'Because February only has 28 days (or 29 in a leap year), adding 1 month lands on February 28 or 29. The calculator will never accidentally jump forward into March.',
  },
  {
    q: 'What is a leap year and why does it happen?',
    a: 'The Earth takes about 365 days and 6 hours to travel around the sun. To keep our calendar matched with the seasons, we save up those 6 extra hours every year and add one full day—February 29—every 4 years. That makes 366 days instead of 365.',
  },
  {
    q: 'Why are world time zones different?',
    a: 'The Earth is round and spins. When the sun is shining on London, it is nighttime in Tokyo. Time zones help make sure that 12:00 noon is the middle of the day wherever you live.',
  },
  {
    q: 'What is Daylight Saving Time (spring forward / fall back)?',
    a: 'In many countries, clocks are moved 1 hour forward in the spring so there is more daylight in the evening. In the fall, clocks are moved 1 hour backward to standard time.',
  },
  {
    q: 'What is a Unix timestamp in simple words?',
    a: 'A Unix timestamp is simply the number of seconds that have passed since midnight on January 1, 1970. Computers use this single number to remember dates easily without getting confused by time zones.',
  },
  {
    q: 'How does the Work Hours calculator calculate overtime pay?',
    a: 'You enter what time you started and finished work, and how many minutes you took for an unpaid lunch break. The tool subtracts your lunch break, counts your net hours, and if you worked more than 8 hours, it automatically calculates 1.5× extra pay for those overtime hours.',
  },
  {
    q: 'Can I calculate work hours if my shift goes past midnight?',
    a: 'Yes. If you start work at 10:00 PM at night and finish at 6:00 AM the next morning, the calculator automatically understands that you worked overnight and gives you the correct 8 hours.',
  },
  {
    q: 'How does the 90-minute work timer help me focus?',
    a: 'The human brain naturally focuses best in bursts of about 90 minutes. After 90 minutes, your energy drops. Taking a 15–20 minute break lets your mind recharge so you can work well again.',
  },
  {
    q: 'Is my personal information and birthday private?',
    a: 'Yes, 100%. All calculations happen entirely on your phone or computer. None of your birthdays, work hours, or dates are ever sent to any server.',
  },
  {
    q: 'Why is dividing by 30 inaccurate when counting months?',
    a: 'Because months do not all have 30 days! Some have 31, some have 30, and February has 28 or 29. Dividing by 30 can be off by up to 3 days. Our tools count the actual calendar days so the result is always exact.',
  },
];

export default function TimeDateClient() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDashboardTab, setActiveDashboardTab] = useState<'age' | 'diff' | 'work' | 'timezone'>('age');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Live Time Ticker
  const [now, setNow] = useState<Date | null>(null);

  // --- Workbench State: Tab 1 (Age) ---
  const [dob, setDob] = useState('1996-05-14');
  const [ageTargetDate, setAgeTargetDate] = useState('2026-10-01');

  // --- Workbench State: Tab 2 (Date Difference) ---
  const [dateStart, setDateStart] = useState('2026-01-01');
  const [dateEnd, setDateEnd] = useState('2026-12-31');
  const [inclusiveEnd, setInclusiveEnd] = useState(false);

  // --- Workbench State: Tab 3 (Work Hours & Overtime) ---
  const [shiftStart, setShiftStart] = useState('08:30');
  const [shiftEnd, setShiftEnd] = useState('17:30');
  const [breakMins, setBreakMins] = useState(45);
  const [hourlyWage, setHourlyWage] = useState(45);

  // --- Workbench State: Tab 4 (Time Zone Overlap) ---
  const [utcHourSlider, setUtcHourSlider] = useState(14); // 14:00 UTC

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mount effect & clock interval
  useEffect(() => {
    setMounted(true);
    const currentDate = new Date();
    setNow(currentDate);
    const isoToday = currentDate.toISOString().split('T')[0];
    setAgeTargetDate(isoToday);

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // --- Live Clock String ---
  const liveClockString = useMemo(() => {
    if (!mounted || !now) return '00:00:00 UTC';
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const mins = String(now.getUTCMinutes()).padStart(2, '0');
    const secs = String(now.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${mins}:${secs} UTC`;
  }, [now, mounted]);

  // --- Tab 1: Age Calculations ---
  const ageResults = useMemo(() => {
    if (!dob || !ageTargetDate) {
      return { valid: false, error: 'Please enter a valid birthday date' };
    }
    const dStart = new Date(dob);
    const dTarget = new Date(ageTargetDate);

    if (isNaN(dStart.getTime()) || isNaN(dTarget.getTime())) {
      return { valid: false, error: 'Please pick a real calendar date' };
    }
    if (dTarget < dStart) {
      return { valid: false, error: 'Target date must be after your birth date' };
    }

    let years = dTarget.getFullYear() - dStart.getFullYear();
    let months = dTarget.getMonth() - dStart.getMonth();
    let days = dTarget.getDate() - dStart.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(dTarget.getFullYear(), dTarget.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = dTarget.getTime() - dStart.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayBorn = weekdays[dStart.getDay()];

    const nextBday = new Date(dTarget.getFullYear(), dStart.getMonth(), dStart.getDate());
    if (nextBday < dTarget) {
      nextBday.setFullYear(dTarget.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - dTarget.getTime()) / (1000 * 60 * 60 * 24));

    return {
      valid: true,
      display: `${years} Years, ${months} Months, ${days} Days`,
      totalDays: totalDays.toLocaleString(),
      totalWeeks: totalWeeks.toLocaleString(),
      totalHours: totalHours.toLocaleString(),
      dayBorn,
      daysToNextBday: daysToNextBday === 0 ? 'Today! 🎂' : `${daysToNextBday} Days`,
    };
  }, [dob, ageTargetDate]);

  // --- Tab 2: Date Difference Calculations ---
  const dateDiffResults = useMemo(() => {
    if (!dateStart || !dateEnd) return null;
    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffMs = Math.abs(end.getTime() - start.getTime());
    let totalCalendarDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (inclusiveEnd) {
      totalCalendarDays += 1;
    }
    const totalHours = totalCalendarDays * 24;

    const earlier = start < end ? start : end;
    const later = start < end ? end : start;

    let months = (later.getFullYear() - earlier.getFullYear()) * 12 + (later.getMonth() - earlier.getMonth());
    let days = later.getDate() - earlier.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(later.getFullYear(), later.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    let businessDays = 0;
    let weekendDays = 0;
    const cur = new Date(earlier);
    while (cur < later || (inclusiveEnd && cur.toDateString() === later.toDateString())) {
      const day = cur.getDay();
      if (day === 0 || day === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    return {
      calendarDays: totalCalendarDays,
      monthsAndDays: `${months} Months and ${days} Days`,
      businessDays,
      weekendDays,
      totalHours: totalHours.toLocaleString(),
    };
  }, [dateStart, dateEnd, inclusiveEnd]);

  // --- Tab 3: Work Hours & Overtime Calculations ---
  const timesheetResults = useMemo(() => {
    const [startH, startM] = shiftStart.split(':').map(Number);
    const [endH, endM] = shiftEnd.split(':').map(Number);

    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
      return null;
    }

    const startTotalMins = startH * 60 + startM;
    let endTotalMins = endH * 60 + endM;

    if (endTotalMins < startTotalMins) {
      endTotalMins += 24 * 60; // Spans midnight
    }

    const grossShiftMins = endTotalMins - startTotalMins;
    const netMins = Math.max(0, grossShiftMins - breakMins);
    const decimalHours = netMins / 60;

    const dispH = Math.floor(netMins / 60);
    const dispM = netMins % 60;

    const regularHours = Math.min(8.0, decimalHours);
    const overtimeHours = Math.max(0, decimalHours - 8.0);
    const regularPay = regularHours * hourlyWage;
    const overtimePay = overtimeHours * hourlyWage * 1.5;
    const grossPay = regularPay + overtimePay;

    return {
      decimalHours: decimalHours.toFixed(2),
      formattedTime: `${dispH}h ${dispM}m`,
      regularHours: regularHours.toFixed(2),
      overtimeHours: overtimeHours.toFixed(2),
      regularPay: regularPay.toFixed(2),
      overtimePay: overtimePay.toFixed(2),
      grossPay: grossPay.toFixed(2),
    };
  }, [shiftStart, shiftEnd, breakMins, hourlyWage]);

  // --- Tab 4: Time Zone Overlap Calculations ---
  const timeZoneMatrix = useMemo(() => {
    const cities = [
      { name: 'London', offset: 1, flag: '🇬🇧' },
      { name: 'New York', offset: -4, flag: '🇺🇸' },
      { name: 'San Francisco', offset: -7, flag: '🇺🇸' },
      { name: 'Tokyo', offset: 9, flag: '🇯🇵' },
      { name: 'Sydney', offset: 10, flag: '🇦🇺' },
    ];

    return cities.map((c) => {
      let localHour = (utcHourSlider + c.offset) % 24;
      if (localHour < 0) localHour += 24;

      const isBusinessHours = localHour >= 9 && localHour <= 17;
      const isEvening = localHour > 17 && localHour <= 22;

      const ampm = localHour >= 12 ? 'PM' : 'AM';
      const formatted12 = `${localHour % 12 === 0 ? 12 : localHour % 12}:00 ${ampm}`;
      const formatted24 = `${String(localHour).padStart(2, '0')}:00`;

      return {
        ...c,
        localHour,
        formatted12,
        formatted24,
        isBusinessHours,
        isEvening,
      };
    });
  }, [utcHourSlider]);

  // --- Filtered Tools List for Tier 4 Directory ---
  const filteredCategories = useMemo(() => {
    let list = CATEGORY_GROUPS;
    if (selectedCategory !== 'all') {
      list = list.filter((g) => g.id === selectedCategory);
    }

    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase().trim();

    return list
      .map((group) => {
        const matchingTools = group.tools.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.badge.toLowerCase().includes(query) ||
            group.name.toLowerCase().includes(query) ||
            t.desc.toLowerCase().includes(query)
        );
        return {
          ...group,
          tools: matchingTools,
        };
      })
      .filter((group) => group.tools.length > 0);
  }, [searchQuery, selectedCategory]);

  const totalFilteredCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, [filteredCategories]);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* =========================================================================
          1st TIER: BREADCRUMB NAVIGATION
          ========================================================================= */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Time & Date' },
        ]}
        badge="Simple Time & Date Tools"
        rightContent={
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-data-mono text-[11px] text-on-surface border border-outline-variant/40">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>{liveClockString}</span>
          </div>
        }
      />

      <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop w-full py-8 space-y-12">
        {/* =========================================================================
            2nd TIER: H1 TITLE & SHORT SUBHEADING SUMMARY (CENTERED & NON-TECHNICAL)
            ========================================================================= */}
        <section className="text-center flex flex-col items-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container text-xs font-semibold text-primary uppercase tracking-wider border border-outline-variant/40">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Free &amp; Easy Online Tools</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-surface font-headline-lg leading-tight">
            Time &amp; Date Calculators: <span className="text-primary">Simple Tools for Age, Days, Hours &amp; Calendar</span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed font-body-md mx-auto">
            Easy, free tools to find your exact age, count days between dates, track work hours and overtime pay, and check what time it is in other cities around the world. Fast, clear answers with no confusing words.
          </p>
        </section>

        {/* =========================================================================
            3rd TIER: LIVE INTERACTIVE DASHBOARD (EASY & NON-TECHNICAL)
            ========================================================================= */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-lg overflow-hidden">
          {/* Dashboard Header Bar & Segmented Tabs */}
          <div className="border-b border-outline-variant/40 bg-surface-container/50 px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tier 3 · Try It Right Now</span>
              </div>
              <h2 className="text-lg font-bold text-on-surface">Quick Calculator (Instant Results)</h2>
            </div>

            {/* Segmented Control Tabs */}
            <div className="flex items-center gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/50 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveDashboardTab('age')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeDashboardTab === 'age'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/60'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Age Calculator</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDashboardTab('diff')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeDashboardTab === 'diff'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/60'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span>Days Between Dates</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDashboardTab('work')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeDashboardTab === 'work'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/60'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Work Hours &amp; Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDashboardTab('timezone')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeDashboardTab === 'timezone'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/60'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>World Time Zones</span>
              </button>
            </div>
          </div>

          {/* Workbench Body */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* --- TAB 1: EXACT AGE CALCULATOR --- */}
            {activeDashboardTab === 'age' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="workbench-dob" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Your Birthday (Date of Birth)
                    </label>
                    <input
                      id="workbench-dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface font-data-mono text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="workbench-age-target" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Calculate Age On This Date (Defaults to Today)
                    </label>
                    <input
                      id="workbench-age-target"
                      type="date"
                      value={ageTargetDate}
                      onChange={(e) => setAgeTargetDate(e.target.value)}
                      className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface font-data-mono text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Output Panel */}
                <div className="bg-surface-container/70 rounded-xl p-5 border border-outline-variant/40 space-y-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">Your Exact Age:</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-primary font-data-mono mt-1">
                      {ageResults.valid ? ageResults.display : ageResults.error}
                    </div>
                  </div>

                  {ageResults.valid && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-outline-variant/30">
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-[11px] font-semibold text-on-surface-variant block uppercase">Total Days Old</span>
                        <span className="text-base font-bold font-data-mono text-on-surface">{ageResults.totalDays} Days</span>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-[11px] font-semibold text-on-surface-variant block uppercase">Total Weeks Old</span>
                        <span className="text-base font-bold font-data-mono text-on-surface">{ageResults.totalWeeks} Weeks</span>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-[11px] font-semibold text-on-surface-variant block uppercase">Day You Were Born</span>
                        <span className="text-base font-bold font-data-mono text-on-surface">{ageResults.dayBorn}</span>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-[11px] font-semibold text-on-surface-variant block uppercase">Next Birthday</span>
                        <span className="text-base font-bold font-data-mono text-secondary">{ageResults.daysToNextBday}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-on-surface-variant">
                  <span>Accurate calendar calculation that accounts for real months and leap years.</span>
                  <Link href="/time-date/age-calculator" className="text-primary hover:underline font-semibold flex items-center gap-1">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* --- TAB 2: DATE DIFFERENCE CALCULATOR --- */}
            {activeDashboardTab === 'diff' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="workbench-date-start" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      First Date (Start)
                    </label>
                    <input
                      id="workbench-date-start"
                      type="date"
                      value={dateStart}
                      onChange={(e) => setDateStart(e.target.value)}
                      className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface font-data-mono text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="workbench-date-end" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Second Date (End)
                    </label>
                    <input
                      id="workbench-date-end"
                      type="date"
                      value={dateEnd}
                      onChange={(e) => setDateEnd(e.target.value)}
                      className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface font-data-mono text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Inclusive Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    id="inclusive-checkbox"
                    type="checkbox"
                    checked={inclusiveEnd}
                    onChange={(e) => setInclusiveEnd(e.target.checked)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="inclusive-checkbox" className="text-xs text-on-surface font-medium cursor-pointer">
                    Count both the start date and the end date
                  </label>
                </div>

                {/* Output Panel */}
                {dateDiffResults && (
                  <div className="bg-surface-container/70 rounded-xl p-5 border border-outline-variant/40 space-y-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">Total Days Between Both Dates:</span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-secondary font-data-mono mt-1">
                        {dateDiffResults.calendarDays.toLocaleString()} Days
                      </div>
                      <div className="text-sm text-on-surface-variant font-data-mono mt-0.5">
                        Equal to {dateDiffResults.monthsAndDays}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-outline-variant/30">
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-[11px] font-semibold text-on-surface-variant block uppercase">Workdays (Mon–Fri)</span>
                        <span className="text-base font-bold font-data-mono text-emerald-400">{dateDiffResults.businessDays} Days</span>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-[11px] font-semibold text-on-surface-variant block uppercase">Weekend Days (Sat–Sun)</span>
                        <span className="text-base font-bold font-data-mono text-amber-400">{dateDiffResults.weekendDays} Days</span>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-[11px] font-semibold text-on-surface-variant block uppercase">Total Hours</span>
                        <span className="text-base font-bold font-data-mono text-on-surface">{dateDiffResults.totalHours} Hours</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 text-xs text-on-surface-variant">
                  <span>Counts exact days and easily separates weekdays from weekend days.</span>
                  <Link href="/time-date/date-difference" className="text-primary hover:underline font-semibold flex items-center gap-1">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* --- TAB 3: WORK HOURS & OVERTIME CALCULATOR --- */}
            {activeDashboardTab === 'work' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="shift-start" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Start Work Time
                    </label>
                    <input
                      id="shift-start"
                      type="time"
                      value={shiftStart}
                      onChange={(e) => setShiftStart(e.target.value)}
                      className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface font-data-mono text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="shift-end" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      End Work Time
                    </label>
                    <input
                      id="shift-end"
                      type="time"
                      value={shiftEnd}
                      onChange={(e) => setShiftEnd(e.target.value)}
                      className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface font-data-mono text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="break-mins" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Unpaid Lunch Break (Minutes)
                    </label>
                    <input
                      id="break-mins"
                      type="number"
                      min={0}
                      max={240}
                      value={breakMins}
                      onChange={(e) => setBreakMins(Number(e.target.value))}
                      className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface font-data-mono text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="hourly-wage" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Pay Per Hour ($)
                    </label>
                    <input
                      id="hourly-wage"
                      type="number"
                      min={1}
                      value={hourlyWage}
                      onChange={(e) => setHourlyWage(Number(e.target.value))}
                      className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface font-data-mono text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Output Panel */}
                {timesheetResults && (
                  <div className="bg-surface-container/70 rounded-xl p-5 border border-outline-variant/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">Total Work Time (Lunch Subtracted):</span>
                        <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-data-mono mt-1">
                          {timesheetResults.formattedTime} ({timesheetResults.decimalHours} hours)
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">Estimated Total Pay:</span>
                        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-data-mono mt-1">
                          ${timesheetResults.grossPay}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-outline-variant/30">
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-[11px] font-semibold text-on-surface-variant block uppercase">Regular Hours (Up to 8h)</span>
                        <span className="text-base font-bold font-data-mono text-on-surface">{timesheetResults.regularHours}h</span>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-[11px] font-semibold text-on-surface-variant block uppercase">Overtime Hours (Over 8h)</span>
                        <span className="text-base font-bold font-data-mono text-amber-400">{timesheetResults.overtimeHours}h</span>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-[11px] font-semibold text-on-surface-variant block uppercase">Regular Pay</span>
                        <span className="text-base font-bold font-data-mono text-on-surface">${timesheetResults.regularPay}</span>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-[11px] font-semibold text-on-surface-variant block uppercase">Overtime Pay (1.5× Extra)</span>
                        <span className="text-base font-bold font-data-mono text-secondary">${timesheetResults.overtimePay}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 text-xs text-on-surface-variant">
                  <span>Works for overnight night shifts and automatically calculates 1.5× extra pay for overtime.</span>
                  <Link href="/time-date/work-hours" className="text-primary hover:underline font-semibold flex items-center gap-1">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* --- TAB 4: TIME ZONE OVERLAP CALCULATOR --- */}
            {activeDashboardTab === 'timezone' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="utc-slider" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Slide the bar to change world reference time (UTC hour):
                    </label>
                    <span className="font-data-mono text-sm font-bold text-primary">
                      {String(utcHourSlider).padStart(2, '0')}:00 UTC
                    </span>
                  </div>
                  <input
                    id="utc-slider"
                    type="range"
                    min={0}
                    max={23}
                    step={1}
                    value={utcHourSlider}
                    onChange={(e) => setUtcHourSlider(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-data-mono text-on-surface-variant mt-1">
                    <span>12:00 AM (Midnight)</span>
                    <span>6:00 AM</span>
                    <span>12:00 PM (Noon)</span>
                    <span>6:00 PM</span>
                    <span>11:00 PM</span>
                  </div>
                </div>

                {/* Multi-City Synchronized Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {timeZoneMatrix.map((item) => (
                    <div
                      key={item.name}
                      className={`p-3.5 rounded-xl border transition-all ${
                        item.isBusinessHours
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : item.isEvening
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-surface-container border-outline-variant/30 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface mb-1">
                        <span>{item.flag}</span>
                        <span className="truncate">{item.name}</span>
                      </div>
                      <div className="text-xl font-bold font-data-mono text-on-surface">
                        {item.formatted12}
                      </div>
                      <div className="text-[11px] font-data-mono text-on-surface-variant">
                        24-Hour: {item.formatted24}
                      </div>
                      <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider">
                        {item.isBusinessHours ? (
                          <span className="text-emerald-400">● Daytime Work Hours (9–5)</span>
                        ) : item.isEvening ? (
                          <span className="text-amber-400">● Evening Hours (Good for calls)</span>
                        ) : (
                          <span className="text-on-surface-variant">○ Night / Sleeping Time</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-on-surface-variant">
                  <span>Quickly check what time it is across big cities at the exact same moment.</span>
                  <Link href="/time-date/time-zone-overlap" className="text-primary hover:underline font-semibold flex items-center gap-1">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            4th TIER: TOOLS CATEGORY & TOOL PAGES (CLEAR & NON-TECHNICAL)
            ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary">
                Tier 4 · All 37 Tools
              </div>
              <h2 className="text-2xl font-bold text-on-surface font-headline-md">
                Find Any Time or Date Tool
              </h2>
              <p className="text-sm text-on-surface-variant">
                Showing {totalFilteredCount} easy-to-use tools across {filteredCategories.length} categories.
              </p>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tools (e.g. Age, Work Hours)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-lowest pl-10 pr-10 py-2.5 rounded-xl border border-outline-variant/60 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills (Functional Buttons) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border-outline-variant/50'
              }`}
            >
              All Tools (37)
            </button>
            {CATEGORY_GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedCategory(group.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedCategory === group.id
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border-outline-variant/50'
                }`}
              >
                {group.name} ({group.tools.length})
              </button>
            ))}
          </div>

          {/* Directory Grid */}
          <div className="space-y-10">
            {filteredCategories.map((group) => (
              <div key={group.id} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">{group.icon}</span>
                  <h3 className="text-base font-bold text-on-surface">{group.name}</h3>
                  <span className="text-xs text-on-surface-variant">· {group.tools.length} calculators</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.tools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.anchor}
                      className="group bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/50 hover:border-primary/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors leading-snug">
                            {tool.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface-variant border border-outline-variant/40 shrink-0">
                            {tool.badge}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                          {tool.desc}
                        </p>
                      </div>

                      <div className="pt-4 mt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs font-semibold text-primary">
                        <span>Open Tool</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border border-outline-variant/60 space-y-3">
                <Calculator className="w-10 h-10 text-outline mx-auto" />
                <h4 className="text-base font-bold text-on-surface">No matching calculators found</h4>
                <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                  Try typing a different word or reset the filter to view all 37 tools.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Show All 37 Tools</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            FOLLOWED BY: EDUCATIONAL GUIDES & FAQS (SIMPLE & CLEAR)
            ========================================================================= */}
        <section className="space-y-12 border-t border-outline-variant/40 pt-12">
          {/* Section Heading */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Simple Explanations · How Time Works
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface font-headline-md">
              Helpful Guides &amp; How It Works
            </h2>
            <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
              Easy, plain-English explanations of how calendars work, why leap years exist, how work hours are counted, and why world time zones differ.
            </p>
          </div>

          {/* 4 In-Depth Guides in Plain English */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guide 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 space-y-3">
              <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Guide 1 · Leap Years</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">
                Why Leap Years Have 366 Days
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                It takes the Earth about 365 days and 6 hours to circle around the sun. Because of those extra 6 hours every year, we add 1 whole extra day (February 29) once every 4 years so the calendar stays matched up with the seasons.
              </p>
              <div className="bg-surface-container p-3 rounded-xl font-data-mono text-xs text-on-surface space-y-1 border border-outline-variant/40">
                <div className="text-primary font-bold">The Simple Leap Year Rule:</div>
                <div>Any year you can divide evenly by 4 is a leap year (like 2024 and 2028).</div>
              </div>
              <p className="text-xs text-on-surface-variant">
                Years like 2024 and 2028 have 366 days, while regular years have 365 days.
              </p>
            </div>

            {/* Guide 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 space-y-3">
              <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Guide 2 · Counting Days</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">
                How to Count Days Between Dates Correctly
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Some months have 30 days, some have 31, and February has 28 or 29 days. If you try to guess by dividing by 30, your answer can be wrong by up to 3 days. Our tools count the real days on the calendar so you get the exact number.
              </p>
              <div className="bg-surface-container p-3 rounded-xl font-data-mono text-xs text-on-surface space-y-1 border border-outline-variant/40">
                <div className="text-secondary font-bold">How It Counts:</div>
                <div>Full Months + Exact Leftover Days = 100% Accurate Total</div>
              </div>
              <p className="text-xs text-on-surface-variant">
                This gives you accurate answers for birthdays, rental agreements, and project deadlines.
              </p>
            </div>

            {/* Guide 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-4 h-4" />
                <span>Guide 3 · Work Hours &amp; Pay</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">
                How Work Hours and Overtime Pay Are Counted
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                When you work, your employer subtracts your unpaid lunch break from your total hours. For example, if you are at work for 8 hours and 30 minutes with a 30-minute unpaid lunch break, you get paid for 8 hours of work.
              </p>
              <div className="bg-surface-container p-3 rounded-xl font-data-mono text-xs text-on-surface space-y-1 border border-outline-variant/40">
                <div className="text-amber-400 font-bold">How Overtime Pay Works:</div>
                <div>First 8 Hours = Normal Hourly Rate</div>
                <div>Any Hours Over 8 = 1.5× Normal Hourly Rate (Extra Pay)</div>
              </div>
              <p className="text-xs text-on-surface-variant">
                Our calculator does all the math automatically, including night shifts that cross midnight.
              </p>
            </div>

            {/* Guide 4 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Guide 4 · World Time</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">
                Why World Time Zones Are Different
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Because the Earth is round and spins, the sun rises in Tokyo hours before it rises in London or New York. The world is split into time zones so 12:00 noon is the middle of the day wherever you are.
              </p>
              <div className="bg-surface-container p-3 rounded-xl font-data-mono text-xs text-on-surface space-y-1 border border-outline-variant/40">
                <div className="text-cyan-400 font-bold">Quick World Time Guide:</div>
                <div>When it is 2:00 PM in London:</div>
                <div>It is 10:00 AM in New York · 7:00 AM in San Francisco · 11:00 PM in Tokyo</div>
              </div>
              <p className="text-xs text-on-surface-variant">
                Our time zone tool makes it easy to find good times to call people in other countries.
              </p>
            </div>
          </div>

          {/* Reference Time Constants Table in Plain English */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Info className="w-4 h-4" />
              <span>Quick Time Chart</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface">How Seconds, Minutes, Hours &amp; Days Add Up</h3>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/40 text-on-surface-variant uppercase tracking-wider font-semibold">
                    <th className="py-2.5 pr-4">Time Unit</th>
                    <th className="py-2.5 px-4 font-data-mono">Seconds</th>
                    <th className="py-2.5 px-4 font-data-mono">Minutes</th>
                    <th className="py-2.5 px-4 font-data-mono">Hours</th>
                    <th className="py-2.5 pl-4">What It Means in Everyday Life</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-data-mono text-on-surface">
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-medium">1 Minute</td>
                    <td className="py-2.5 px-4 text-primary font-bold">60 seconds</td>
                    <td className="py-2.5 px-4">1 minute</td>
                    <td className="py-2.5 px-4">0.016 hours</td>
                    <td className="py-2.5 pl-4 font-sans text-on-surface-variant">60 heartbeats or seconds on a clock</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-medium">1 Hour</td>
                    <td className="py-2.5 px-4 text-primary font-bold">3,600 seconds</td>
                    <td className="py-2.5 px-4">60 minutes</td>
                    <td className="py-2.5 px-4">1 hour</td>
                    <td className="py-2.5 pl-4 font-sans text-on-surface-variant">The time it takes for the clock hand to go around once</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-medium">1 Day</td>
                    <td className="py-2.5 px-4 text-primary font-bold">86,400 seconds</td>
                    <td className="py-2.5 px-4">1,440 minutes</td>
                    <td className="py-2.5 px-4">24 hours</td>
                    <td className="py-2.5 pl-4 font-sans text-on-surface-variant">One full day and night (one spin of the Earth)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-medium">1 Week</td>
                    <td className="py-2.5 px-4 text-primary font-bold">604,800 seconds</td>
                    <td className="py-2.5 px-4">10,080 minutes</td>
                    <td className="py-2.5 px-4">168 hours</td>
                    <td className="py-2.5 pl-4 font-sans text-on-surface-variant">7 days in a row (Monday through Sunday)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-medium">1 Normal Year</td>
                    <td className="py-2.5 px-4 text-primary font-bold">31,536,000 seconds</td>
                    <td className="py-2.5 px-4">525,600 minutes</td>
                    <td className="py-2.5 px-4">8,760 hours</td>
                    <td className="py-2.5 pl-4 font-sans text-on-surface-variant">365 days (one trip around the sun)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-medium">1 Leap Year</td>
                    <td className="py-2.5 px-4 text-secondary font-bold">31,622,400 seconds</td>
                    <td className="py-2.5 px-4">527,040 minutes</td>
                    <td className="py-2.5 px-4">8,784 hours</td>
                    <td className="py-2.5 pl-4 font-sans text-on-surface-variant">366 days with February 29 included</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive FAQ Accordion in Plain Everyday English */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary">
                Common Questions &amp; Simple Answers
              </div>
              <h3 className="text-2xl font-bold text-on-surface font-headline-md">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={faq.q}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-outline transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
