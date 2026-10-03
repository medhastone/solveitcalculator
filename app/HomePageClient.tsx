"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import QuickEverydaySolver from "../components/QuickEverydaySolver";

// --- Types ---
interface CalculatorItem {
  id: string;
  name: string;
  category: string;
  categoryHref: string;
  description: string;
  href: string;
  icon: string;
  synonyms: string[];
}

interface CategoryItem {
  name: string;
  href: string;
  icon: string;
  description: string;
  sampleTools: { name: string; href: string }[];
}

interface GoalCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  tools: { name: string; href: string; note: string }[];
}

interface EducationalGuide {
  title: string;
  question: string;
  answer: string;
  guideHref: string;
  calculatorHref: string;
  calculatorName: string;
}

// --- Data: Curated Calculator Search Index (100% Real Routes) ---
const CALCULATOR_DIRECTORY: CalculatorItem[] = [
  {
    id: "mortgage",
    name: "Mortgage Calculator",
    category: "Finance",
    categoryHref: "/finance",
    description: "Estimate monthly home loan payments with principal, interest, taxes, and amortization schedules.",
    href: "/finance/mortgage-calculator",
    icon: "home",
    synonyms: ["home loan", "house payment", "amortization", "property tax", "escrow", "real estate", "down payment"],
  },
  {
    id: "bmi",
    name: "BMI Calculator",
    category: "Health & Fitness",
    categoryHref: "/health-fitness-calculators",
    description: "Assess body mass index and healthy weight ranges for adults and children according to WHO benchmarks.",
    href: "/bmi-calculator",
    icon: "monitor_weight",
    synonyms: ["body mass index", "weight", "body fat", "calories", "obesity", "underweight", "ideal weight", "height"],
  },
  {
    id: "age",
    name: "Age Calculator",
    category: "Time & Date",
    categoryHref: "/time-date",
    description: "Calculate your exact chronological age in years, months, weeks, days, hours, and seconds.",
    href: "/time-date/age-calculator",
    icon: "cake",
    synonyms: ["birthday", "date of birth", "how old am i", "chronological age", "age difference", "dob"],
  },
  {
    id: "percentage",
    name: "Percentage Calculator",
    category: "Math & Statistics",
    categoryHref: "/math",
    description: "Solve percentage increases, decreases, differences, fractions, and discounts with step-by-step math.",
    href: "/percentage-calculator",
    icon: "percent",
    synonyms: ["percent", "discount", "markup", "percentage change", "fraction to percent", "proportion"],
  },
  {
    id: "loan-emi",
    name: "Loan & EMI Calculator",
    category: "Finance",
    categoryHref: "/finance",
    description: "Calculate monthly loan installments, total interest costs, and full payment breakdown curves.",
    href: "/finance/emi-calculator",
    icon: "payments",
    synonyms: ["emi", "car loan", "personal loan", "borrowing", "monthly installment", "amortization table"],
  },
  {
    id: "compound-interest",
    name: "Compound Interest Calculator",
    category: "Finance",
    categoryHref: "/finance",
    description: "Model wealth accumulation with compound growth frequencies and periodic contributions.",
    href: "/finance/compound-interest-calculator",
    icon: "trending_up",
    synonyms: ["compound growth", "interest", "future value", "investing", "annual yield", "apy"],
  },
  {
    id: "sip",
    name: "SIP Calculator",
    category: "Finance",
    categoryHref: "/finance",
    description: "Forecast potential returns from systematic monthly mutual fund investments over time.",
    href: "/investing-and-growth",
    icon: "savings",
    synonyms: ["systematic investment plan", "mutual funds", "recurring deposit", "cagr", "wealth builder"],
  },
  {
    id: "salary-payroll",
    name: "Salary & Payroll Calculator",
    category: "Business",
    categoryHref: "/business",
    description: "Estimate gross earnings, take-home pay, hourly rates, and standard withholding deductions.",
    href: "/salary-and-payroll",
    icon: "badge",
    synonyms: ["take home pay", "hourly to salary", "wages", "paycheck", "gross to net", "payroll taxes"],
  },
  {
    id: "time-calculator",
    name: "Time Calculator",
    category: "Time & Date",
    categoryHref: "/time-date",
    description: "Add, subtract, and convert clock hours, minutes, and seconds across multiple time intervals.",
    href: "/time-date/time-calculator",
    icon: "schedule",
    synonyms: ["hours and minutes", "clock calculator", "elapsed time", "time sum", "duration"],
  },
  {
    id: "gpa",
    name: "GPA & Academic Planning Calculator",
    category: "Education",
    categoryHref: "/education",
    description: "Calculate cumulative grade point averages and determine target scores needed on final exams.",
    href: "/education",
    icon: "school",
    synonyms: ["grade point average", "college gpa", "grades", "final exam", "weighted gpa", "marks"],
  },
  {
    id: "unit-converter",
    name: "Universal Unit Converter",
    category: "Unit Conversion",
    categoryHref: "/conversions",
    description: "Convert length, weight, temperature, area, volume, speed, data, and power units with exact precision.",
    href: "/conversions",
    icon: "swap_horiz",
    synonyms: ["metric conversion", "imperial", "kg to lbs", "meters to feet", "celsius to fahrenheit", "units"],
  },
  {
    id: "scientific",
    name: "Scientific Calculator",
    category: "Math & Statistics",
    categoryHref: "/math",
    description: "Solve advanced algebra, trigonometry, logarithms, exponentials, and scientific equations.",
    href: "/scientific-calculator",
    icon: "calculate",
    synonyms: ["sin cos tan", "logarithm", "square root", "powers", "trigonometry", "scientific notation"],
  },
  {
    id: "retirement",
    name: "Retirement Countdown & Super Calculator",
    category: "Finance",
    categoryHref: "/finance",
    description: "Model safe withdrawal rates, nest egg targets, and countdown workdays remaining until retirement.",
    href: "/time-date/retirement-countdown-in-workdays",
    icon: "beach_access",
    synonyms: ["401k", "pension", "fire", "retirement age", "working days left", "nest egg"],
  },
  {
    id: "business-days",
    name: "Business Days Calculator",
    category: "Time & Date",
    categoryHref: "/time-date",
    description: "Count exact working days between dates, automatically excluding weekends and public holidays.",
    href: "/business-days-calculator",
    icon: "event_available",
    synonyms: ["workdays", "working days", "business day countdown", "exclude weekends", "calendar days"],
  },
  {
    id: "date-diff",
    name: "Date Difference Calculator",
    category: "Time & Date",
    categoryHref: "/time-date",
    description: "Determine the exact duration between any two dates in days, months, and years.",
    href: "/date-difference-calculator",
    icon: "date_range",
    synonyms: ["days between dates", "calendar span", "time between dates", "countdown", "date math"],
  },
  {
    id: "fuel-cost",
    name: "Fuel Economy & Cost Calculator",
    category: "Automotive",
    categoryHref: "/automotive-calculators-estimators",
    description: "Estimate trip gas expenses, fuel consumption, and distance efficiency in MPG or L/100km.",
    href: "/fuel-economy-converter",
    icon: "local_gas_station",
    synonyms: ["gas cost", "mpg", "liters per 100km", "trip cost", "mileage", "gas mileage"],
  },
  {
    id: "ultradian-rhythm",
    name: "90-Minute Ultradian Rhythm Planner",
    category: "Time & Date",
    categoryHref: "/time-date",
    description: "Align deep work sessions with Dr. Nathaniel Kleitman’s 90-minute biological BRAC cycle and rest pauses.",
    href: "/time-date/90-minute-ultradian-rhythm-planner",
    icon: "psychology",
    synonyms: ["ultradian", "90 minute", "focus block", "brac", "pomodoro alternative", "sleep cycle", "circadian"],
  },
  {
    id: "running-pace",
    name: "Running Pace Calculator",
    category: "Health & Fitness",
    categoryHref: "/health-fitness-calculators",
    description: "Calculate pace, speed, finish times, and split intervals for 5K, 10K, half marathon, or marathon.",
    href: "/running-pace-calculator",
    icon: "directions_run",
    synonyms: ["pace", "split times", "marathon finish time", "min per km", "min per mile", "5k pace"],
  },
  {
    id: "leap-year",
    name: "Leap Year Calculator",
    category: "Time & Date",
    categoryHref: "/time-date",
    description: "Verify if any calendar year is a leap year according to the 400-year Gregorian cycle.",
    href: "/leap-year-calculator",
    icon: "event_repeat",
    synonyms: ["february 29", "leap day", "gregorian rules", "astronomical year", "calendar cycle"],
  },
  {
    id: "income-tax",
    name: "Global Income Tax Calculator",
    category: "Finance",
    categoryHref: "/finance",
    description: "Evaluate progressive marginal tax brackets, effective tax rates, and standard deductions.",
    href: "/tax-calculator",
    icon: "receipt_long",
    synonyms: ["tax brackets", "income tax", "federal tax", "state tax", "withholding", "marginal tax"],
  },
  {
    id: "gst-vat",
    name: "GST & VAT Calculator",
    category: "Business",
    categoryHref: "/business",
    description: "Calculate inclusive and exclusive sales tax, VAT, or GST amounts with clear tax splits.",
    href: "/tax-calculator",
    icon: "receipt",
    synonyms: ["gst", "vat", "sales tax", "tax inclusive", "tax exclusive"],
  },
  {
    id: "home-construction",
    name: "Home & Construction Estimators",
    category: "Home & Construction",
    categoryHref: "/home-construction",
    description: "Estimate materials for concrete slabs, flooring, roofing, drywall, and paint projects.",
    href: "/home-construction",
    icon: "construction",
    synonyms: ["concrete", "flooring", "drywall", "roofing", "paint", "square footage", "yardage"],
  },
  {
    id: "electrical",
    name: "Electrical Engineering Tools",
    category: "Electrical",
    categoryHref: "/electrical",
    description: "Solve Ohm’s law, wire gauge sizing, voltage drop, and power conversions with electrical standards.",
    href: "/electrical",
    icon: "electric_bolt",
    synonyms: ["ohms law", "voltage drop", "amperage", "wire gauge", "awg", "watts to amps"],
  },
  {
    id: "work-hours",
    name: "Work Hours & Timesheet Calculator",
    category: "Time & Date",
    categoryHref: "/time-date",
    description: "Track daily clock-in and clock-out hours, break deductions, and billable timesheet totals.",
    href: "/time-date/work-hours",
    icon: "more_time",
    synonyms: ["timesheet", "punch card", "billable hours", "shift time", "clock in clock out"],
  },
  {
    id: "fire-forecaster",
    name: "FIRE Forecaster & Financial Independence",
    category: "Finance",
    categoryHref: "/finance",
    description: "Forecast the timeline to financial independence based on annual savings rate and withdrawal rules.",
    href: "/finance/fire-forecaster",
    icon: "local_fire_department",
    synonyms: ["financial independence", "early retirement", "fire movement", "safe withdrawal", "lean fire"],
  },
  {
    id: "project-planner",
    name: "Project Timeline & Plan Estimator",
    category: "Business",
    categoryHref: "/business",
    description: "Schedule milestones, estimate task durations, and project completion dates.",
    href: "/plan-a-project-calculator",
    icon: "timeline",
    synonyms: ["project schedule", "timeline", "task duration", "milestones", "gantt planning"],
  },
];

// --- 12 Main Categories ---
const CATEGORIES: CategoryItem[] = [
  {
    name: "Finance",
    href: "/finance",
    icon: "payments",
    description: "Loans, mortgages, investing, retirement, taxes, savings and more.",
    sampleTools: [
      { name: "Mortgage Calculator", href: "/finance/mortgage-calculator" },
      { name: "EMI & Loans", href: "/finance/emi-calculator" },
      { name: "Compound Interest", href: "/finance/compound-interest-calculator" },
    ],
  },
  {
    name: "Health & Fitness",
    href: "/health-fitness-calculators",
    icon: "favorite",
    description: "BMI, calories, BMR, TDEE, body metrics and wellness calculations.",
    sampleTools: [
      { name: "BMI Calculator", href: "/bmi-calculator" },
      { name: "Running Pace", href: "/running-pace-calculator" },
      { name: "Zone 2 Training", href: "/article/zone-2-cardio-training" },
    ],
  },
  {
    name: "Math & Statistics",
    href: "/math",
    icon: "calculate",
    description: "Percentages, fractions, algebra, statistics and everyday math.",
    sampleTools: [
      { name: "Percentage Calculator", href: "/percentage-calculator" },
      { name: "Standard Deviation", href: "/math/standard-deviation-calculator" },
      { name: "Scientific Solver", href: "/scientific-calculator" },
    ],
  },
  {
    name: "Unit Conversion",
    href: "/conversions",
    icon: "swap_horiz",
    description: "Length, weight, area, volume, temperature and other conversions.",
    sampleTools: [
      { name: "Universal Converter", href: "/conversions" },
      { name: "Temperature (°C / °F)", href: "/temperature-converter" },
      { name: "Weight & Mass", href: "/weight-mass-converter" },
    ],
  },
  {
    name: "Time & Date",
    href: "/time-date",
    icon: "schedule",
    description: "Age, date differences, countdowns, durations, workdays and time zones.",
    sampleTools: [
      { name: "Age Calculator", href: "/time-date/age-calculator" },
      { name: "90-Minute Ultradian", href: "/time-date/90-minute-ultradian-rhythm-planner" },
      { name: "Business Days", href: "/business-days-calculator" },
    ],
  },
  {
    name: "Home & Construction",
    href: "/home-construction",
    icon: "home_work",
    description: "Concrete, flooring, roofing, paint, area and project calculations.",
    sampleTools: [
      { name: "Material Estimator", href: "/home-construction" },
      { name: "Project Timeline", href: "/plan-a-project-calculator" },
      { name: "Area Converter", href: "/area-converter" },
    ],
  },
  {
    name: "Business",
    href: "/business",
    icon: "domain",
    description: "Profit, margin, pricing, payroll, revenue and business planning.",
    sampleTools: [
      { name: "Salary & Payroll", href: "/salary-and-payroll" },
      { name: "GST & Sales Tax", href: "/tax-calculator" },
      { name: "Freelance Rate", href: "/freelance-hourly-rate-calculator" },
    ],
  },
  {
    name: "Education",
    href: "/education",
    icon: "school",
    description: "Grades, GPA, study planning, attendance and academic calculations.",
    sampleTools: [
      { name: "Cumulative GPA", href: "/education" },
      { name: "Final Exam Planner", href: "/education" },
      { name: "Percentage Solver", href: "/percentage-calculator" },
    ],
  },
  {
    name: "Science",
    href: "/science",
    icon: "science",
    description: "Physics, chemistry, biology and scientific calculations.",
    sampleTools: [
      { name: "Scientific Tools", href: "/science" },
      { name: "Density & Mass", href: "/conversion/grams-to-milliliters" },
      { name: "Astronomy & Solstice", href: "/equinox-solstice-calculator" },
    ],
  },
  {
    name: "Electrical",
    href: "/electrical",
    icon: "electric_bolt",
    description: "Voltage, current, resistance, power and electrical formulas.",
    sampleTools: [
      { name: "Ohm’s Law Solver", href: "/electrical" },
      { name: "Voltage Drop", href: "/electrical" },
      { name: "Power Converter", href: "/power-converter" },
    ],
  },
  {
    name: "Automotive",
    href: "/automotive-calculators-estimators",
    icon: "directions_car",
    description: "Fuel economy, vehicle costs, auto loans, EV calculations and more.",
    sampleTools: [
      { name: "Fuel Economy (MPG)", href: "/fuel-economy-converter" },
      { name: "Auto Loan Estimator", href: "/finance/emi-calculator" },
      { name: "Speed & Velocity", href: "/speed-velocity-converter" },
    ],
  },
  {
    name: "Technology",
    href: "/technology",
    icon: "terminal",
    description: "Data, bandwidth, networking, aspect ratio and developer calculations.",
    sampleTools: [
      { name: "Data Storage Units", href: "/data-storage-converter" },
      { name: "Unix Timestamp", href: "/unix-timestamp-converter" },
      { name: "Transfer Speeds", href: "/data-transfer-converter" },
    ],
  },
];

// --- Finance Subcategories ---
const FINANCE_SUBCATEGORIES = [
  { name: "Loans & Amortization", href: "/loans-and-amortization", desc: "Personal, auto, and amortized fixed installment schedules." },
  { name: "Mortgages & Real Estate", href: "/mortgages-and-real-estate", desc: "Home purchases, refinancing, escrow, and property taxes." },
  { name: "Investing & Growth", href: "/investing-and-growth", desc: "Compound returns, SIP wealth accumulation, and CAGR models." },
  { name: "Retirement & Pension", href: "/retirement-and-super", desc: "401(k), nest egg depletion horizons, and safe withdrawal." },
  { name: "Savings & Liquidity", href: "/savings-and-liquidity", desc: "Emergency funds, high-yield deposit yields, and milestone pacing." },
  { name: "Banking & Cash Accounts", href: "/banking-and-cash-accounts", desc: "Checking fee balances, overdraft models, and money market yields." },
  { name: "Credit Cards", href: "/credit-cards-and-revolving", desc: "Interest payoff acceleration, balance transfers, and minimum fees." },
  { name: "Taxes", href: "/global-tax-calculator", desc: "Marginal income tax brackets, deductions, and statutory levies." },
];

// --- Goal-Based Discovery (Easy Everyday English) ---
const GOAL_CATEGORIES: GoalCategory[] = [
  {
    id: "money",
    title: "LOANS & MORTGAGES",
    icon: "payments",
    description: "Figure out monthly payments, total interest costs, and payoff timelines.",
    tools: [
      { name: "Mortgage Calculator", href: "/finance/mortgage-calculator", note: "Monthly home loan payments" },
      { name: "Loan & EMI Calculator", href: "/finance/emi-calculator", note: "Car and personal loan payments" },
      { name: "Compound Interest", href: "/finance/compound-interest-calculator", note: "See how your savings can grow" },
      { name: "Retirement Countdown", href: "/time-date/retirement-countdown-in-workdays", note: "Days until you can retire" },
    ],
  },
  {
    id: "home",
    title: "HOME & DIY PROJECTS",
    icon: "home_work",
    description: "Calculate room size, floor tiles, paint, concrete, and materials.",
    tools: [
      { name: "Home Construction Suite", href: "/home-construction", note: "Concrete, walls & materials" },
      { name: "Project Timeline", href: "/plan-a-project-calculator", note: "Track project days & milestones" },
      { name: "Area & Room Size", href: "/area-converter", note: "Square feet, meters & yards" },
      { name: "Mortgage Affordability", href: "/finance/mortgage-calculator", note: "See what house fits your budget" },
    ],
  },
  {
    id: "health",
    title: "HEALTH & FITNESS",
    icon: "favorite",
    description: "Check your body weight, BMI score, walking and running pace.",
    tools: [
      { name: "BMI Calculator", href: "/bmi-calculator", note: "Check if your weight is in a healthy range" },
      { name: "Running & Walking Pace", href: "/running-pace-calculator", note: "Minutes per mile or kilometer" },
      { name: "Health & Fitness Tools", href: "/health-fitness-calculators", note: "All body and workout tools" },
      { name: "Pet Age Converter", href: "/pet-age-converter", note: "Find your dog or cat age in human years" },
    ],
  },
  {
    id: "time",
    title: "DATES, AGE & TIME",
    icon: "schedule",
    description: "Find your exact age, count days between dates, and count work hours.",
    tools: [
      { name: "Exact Age Calculator", href: "/time-date/age-calculator", note: "Exact years, months, and days" },
      { name: "Days Between Dates", href: "/date-difference-calculator", note: "Count days between any two dates" },
      { name: "Working Days Counter", href: "/business-days-calculator", note: "Skip weekends and holidays" },
      { name: "Add or Subtract Time", href: "/time-date/add-subtract-time", note: "Add up clock hours and minutes" },
    ],
  },
  {
    id: "business",
    title: "WORK, PAYROLL & TAX",
    icon: "domain",
    description: "See your take-home paycheck, hourly rates, and sales tax.",
    tools: [
      { name: "Salary & Paycheck", href: "/salary-and-payroll", note: "Hourly wage to monthly paycheck" },
      { name: "Sales Tax & GST", href: "/tax-calculator", note: "Add or remove tax from a price" },
      { name: "Freelance Hourly Rate", href: "/freelance-hourly-rate-calculator", note: "What to charge for your time" },
      { name: "Business Tools", href: "/business", note: "Profit and cost calculators" },
    ],
  },
  {
    id: "study",
    title: "SCHOOL & MATH HELP",
    icon: "school",
    description: "Easy step-by-step help for percentages, grades, and science.",
    tools: [
      { name: "Percentage Calculator", href: "/percentage-calculator", note: "Discounts and percentage changes" },
      { name: "Grade & GPA Calculator", href: "/education", note: "Calculate test and school scores" },
      { name: "Scientific Calculator", href: "/scientific-calculator", note: "Fractions, powers, and equations" },
      { name: "Unit Converter", href: "/conversions", note: "Feet to meters, lbs to kg, and more" },
    ],
  },
];

// --- 16 Popular Calculators ---
const POPULAR_CALCULATORS = [
  { name: "Mortgage Calculator", href: "/finance/mortgage-calculator", desc: "Estimate monthly home loan payments, interest, and taxes.", icon: "home" },
  { name: "BMI Calculator", href: "/bmi-calculator", desc: "Assess body mass index and clinical category ranges.", icon: "monitor_weight" },
  { name: "Age Calculator", href: "/time-date/age-calculator", desc: "Compute exact chronological age in years, days, and seconds.", icon: "cake" },
  { name: "Percentage Calculator", href: "/percentage-calculator", desc: "Solve percentage changes, differences, and discount values.", icon: "percent" },
  { name: "Loan & EMI Calculator", href: "/finance/emi-calculator", desc: "Calculate fixed monthly loan payments and amortization.", icon: "payments" },
  { name: "Compound Interest", href: "/finance/compound-interest-calculator", desc: "Model compounding interest over flexible growth intervals.", icon: "trending_up" },
  { name: "SIP Calculator", href: "/investing-and-growth", desc: "Forecast wealth accumulated through monthly mutual fund plans.", icon: "savings" },
  { name: "Salary & Payroll", href: "/salary-and-payroll", desc: "Estimate hourly wage to annual salary and take-home pay.", icon: "badge" },
  { name: "Time Calculator", href: "/time-date/time-calculator", desc: "Add, subtract, and total hours, minutes, and clock intervals.", icon: "schedule" },
  { name: "GPA Calculator", href: "/education", desc: "Compute cumulative college and high school grade averages.", icon: "school" },
  { name: "Unit Converter", href: "/conversions", desc: "Convert length, weight, area, volume, and temperature units.", icon: "swap_horiz" },
  { name: "Scientific Calculator", href: "/scientific-calculator", desc: "Solve trigonometry, logarithms, powers, and math equations.", icon: "calculate" },
  { name: "Retirement Countdown", href: "/time-date/retirement-countdown-in-workdays", desc: "Track calendar days and remaining workdays until retirement.", icon: "beach_access" },
  { name: "Business Days Calculator", href: "/business-days-calculator", desc: "Calculate business days between dates excluding holidays.", icon: "event_available" },
  { name: "Date Calculator", href: "/date-difference-calculator", desc: "Find the exact span of days and months between two dates.", icon: "date_range" },
  { name: "Fuel Cost Calculator", href: "/fuel-economy-converter", desc: "Estimate road trip fuel costs and mileage consumption.", icon: "local_gas_station" },
];

// --- 6 Featured Calculators ---
const FEATURED_CALCULATORS = [
  {
    name: "Retirement Countdown",
    href: "/time-date/retirement-countdown-in-workdays",
    desc: "Count calendar days, workdays, shifts, PTO and remaining work hours until retirement.",
    icon: "beach_access",
    tag: "Long-Term Planning",
  },
  {
    name: "90-Minute Ultradian Rhythm Planner",
    href: "/time-date/90-minute-ultradian-rhythm-planner",
    desc: "Align deep creative focus blocks with Dr. Nathaniel Kleitman’s biological BRAC cycle and 20-minute refractory pauses.",
    icon: "psychology",
    tag: "Productivity Science",
  },
  {
    name: "Running Pace Calculator",
    href: "/running-pace-calculator",
    desc: "Calculate pace, speed, finish time and race splits in min/mile and min/km for any distance.",
    icon: "directions_run",
    tag: "Athletics & Training",
  },
  {
    name: "Leap Year Calculator",
    href: "/leap-year-calculator",
    desc: "Check any year and explore the Gregorian 400-year cycle and leap day astronomical rules.",
    icon: "event_repeat",
    tag: "Chronology",
  },
  {
    name: "Global Income Tax Calculator",
    href: "/tax-calculator",
    desc: "Calculate tax based on selected marginal brackets, personal exemptions, and applicable deduction rules.",
    icon: "receipt_long",
    tag: "Tax Planning",
  },
  {
    name: "FIRE Forecaster",
    href: "/finance/fire-forecaster",
    desc: "Model financial independence timelines using annual savings rate and safe withdrawal horizons.",
    icon: "local_fire_department",
    tag: "Wealth Strategy",
  },
];

// --- 6 Recently Updated Calculators ---
const RECENTLY_UPDATED = [
  {
    name: "90-Minute Ultradian Rhythm Planner",
    href: "/time-date/90-minute-ultradian-rhythm-planner",
    explanation: "Added chronotype presets, custom refractory rest duration, and Web Audio timer synthesis.",
    lastUpdated: "September 2026",
    icon: "psychology",
  },
  {
    name: "Global Income Tax Calculator",
    href: "/tax-calculator",
    explanation: "Updated marginal rate bracket tiers and standard deduction limits for the 2026 fiscal cycle.",
    lastUpdated: "March 2026",
    icon: "receipt_long",
  },
  {
    name: "Mortgage Payment Calculator",
    href: "/finance/mortgage-calculator",
    explanation: "Enhanced escrow breakdown logic and multi-tier amortization comparison schedules.",
    lastUpdated: "February 2026",
    icon: "home",
  },
  {
    name: "Retirement Countdown",
    href: "/time-date/retirement-countdown-in-workdays",
    explanation: "Added configurable work-week shifts, PTO leave deductions, and milestone projections.",
    lastUpdated: "February 2026",
    icon: "beach_access",
  },
  {
    name: "Business Days Calculator",
    href: "/business-days-calculator",
    explanation: "Updated statutory bank holidays and regional calendar registries for accurate working day spans.",
    lastUpdated: "January 2026",
    icon: "event_available",
  },
  {
    name: "Leap Year Calculator",
    href: "/leap-year-calculator",
    explanation: "Refined Gregorian century modulo validation and astronomical solar year delta calculations.",
    lastUpdated: "January 2026",
    icon: "event_repeat",
  },
];

// --- 6 Calculator Collections ---
const COLLECTIONS = [
  {
    title: "Finance Calculator Suite",
    href: "/finance",
    icon: "payments",
    desc: "All major tools for loans, investing, savings, taxes, mortgages, and retirement planning.",
    tools: ["Mortgage Amortization", "Loan EMI", "Compound Growth", "Retirement Super", "Income Tax"],
  },
  {
    title: "Health & Fitness Suite",
    href: "/health-fitness-calculators",
    icon: "favorite",
    desc: "BMI, calories, BMR, TDEE, running splits, and related wellness metric calculations.",
    tools: ["Clinical BMI", "Running Pace", "Zone 2 Cardio", "Body Composition"],
  },
  {
    title: "Time & Date Suite",
    href: "/time-date",
    icon: "schedule",
    desc: "Age, dates, duration, countdowns, workdays, 90-minute focus cycles, and time zones.",
    tools: ["Exact Age", "90-Min Ultradian", "Business Days", "Add/Subtract Time", "Date Difference"],
  },
  {
    title: "Home & Construction Suite",
    href: "/home-construction",
    icon: "home_work",
    desc: "Construction, material, area, project scheduling, and surface estimation tools.",
    tools: ["Concrete Slabs", "Square Footage", "Drywall & Framing", "Project Milestones"],
  },
  {
    title: "Math & Statistics Suite",
    href: "/math",
    icon: "calculate",
    desc: "Everyday mathematics, algebra, percentages, fractions, and statistical distributions.",
    tools: ["Percentage Solver", "Standard Deviation", "Scientific Algebra", "Fractions"],
  },
  {
    title: "Business Suite",
    href: "/business",
    icon: "domain",
    desc: "Profit, pricing, payroll, revenue, freelance rates, and operational planning tools.",
    tools: ["Salary & Payroll", "GST / VAT Splitter", "Freelance Hourly Rate", "Break-Even"],
  },
];

// --- 8 Educational Guides ---
const EDUCATIONAL_GUIDES: EducationalGuide[] = [
  {
    title: "How Does an EMI Calculator Work?",
    question: "How Does an EMI Calculator Work?",
    answer: "EMI is calculated using principal, interest rate, and tenure through the standard reducing-balance annuity formula: E = P × r × (1+r)ⁿ / ((1+r)ⁿ - 1).",
    guideHref: "/article/how-emi-works",
    calculatorHref: "/finance/emi-calculator",
    calculatorName: "EMI Calculator",
  },
  {
    title: "How Is BMI Calculated?",
    question: "How Is BMI Calculated?",
    answer: "BMI divides body weight in kilograms by the square of height in meters (kg/m²), categorizing metrics into standard WHO health ranges.",
    guideHref: "/article/how-to-calculate-bmi",
    calculatorHref: "/bmi-calculator",
    calculatorName: "BMI Calculator",
  },
  {
    title: "What Is Compound Interest?",
    question: "What Is Compound Interest?",
    answer: "Compound interest adds accumulated earnings back to the principal balance at set intervals, driving exponential wealth growth over time.",
    guideHref: "/article/investment-planning-basics",
    calculatorHref: "/finance/compound-interest-calculator",
    calculatorName: "Compound Interest",
  },
  {
    title: "How Are Business Days Calculated?",
    question: "How Are Business Days Calculated?",
    answer: "Business days calculate calendar intervals while automatically filtering out weekend days (Saturdays and Sundays) and designated banking holidays.",
    guideHref: "/business-days-calculator",
    calculatorHref: "/business-days-calculator",
    calculatorName: "Business Days Calculator",
  },
  {
    title: "How Does a Mortgage Payment Work?",
    question: "How Does a Mortgage Payment Work?",
    answer: "A standard mortgage payment bundles principal repayment, loan interest, property taxes, and homeowner hazard insurance into one monthly schedule.",
    guideHref: "/article/how-emi-works",
    calculatorHref: "/finance/mortgage-calculator",
    calculatorName: "Mortgage Calculator",
  },
  {
    title: "How Is Percentage Calculated?",
    question: "How Is Percentage Calculated?",
    answer: "Percentages represent a ratio per 100, calculated as (part ÷ whole) × 100 to evaluate relative changes, financial margins, and proportion changes.",
    guideHref: "/percentage-calculator",
    calculatorHref: "/percentage-calculator",
    calculatorName: "Percentage Calculator",
  },
  {
    title: "What Is the Science of 90-Minute Sleep Cycles?",
    question: "What Is the Science of 90-Minute Sleep Cycles?",
    answer: "Human circadian rhythms include ultradian 90-minute Basic Rest-Activity Cycles (BRAC) discovered by Dr. Nathaniel Kleitman that dictate natural focus peaks.",
    guideHref: "/article/science-of-90-minute-sleep-cycles",
    calculatorHref: "/time-date/90-minute-ultradian-rhythm-planner",
    calculatorName: "90-Minute Planner",
  },
  {
    title: "Understanding GST and VAT Calculations",
    question: "Understanding GST and VAT Calculations",
    answer: "Sales taxes are evaluated as tax-exclusive (base price + tax) or tax-inclusive (tax extracted from total amount) using statutory rates.",
    guideHref: "/article/understanding-gst",
    calculatorHref: "/tax-calculator",
    calculatorName: "Tax Calculator",
  },
];

// --- Unified Master FAQs (12 High-Value Questions) ---
const FAQS = [
  {
    q: "What is SolveItCalculator?",
    a: "SolveItCalculator is a free online platform providing fast, accurate, search-intent-focused computational tools across finance, health, math, unit conversions, time, construction, business, and education.",
  },
  {
    q: "Are all calculators completely free to use?",
    a: "Yes. Every single calculator on SolveItCalculator is 100% free forever without subscriptions, payment methods, or paywalls.",
  },
  {
    q: "Do I need to sign up or create an account?",
    a: "No. You can access and run calculations immediately without signing up, providing an email address, or creating an account.",
  },
  {
    q: "Do you store or track my financial or health numbers?",
    a: "No. SolveItCalculator uses an offline-first, client-side processing architecture. Your numbers (income, debts, body weight, dates) are computed locally inside your web browser and are never transmitted to or stored on remote databases.",
  },
  {
    q: "How accurate and reliable are the calculations?",
    a: "Our calculators use robust arbitrary numerical precision to avoid standard floating-point rounding drift. Financial formulas conform to statutory compounding and amortization benchmarks, and health metrics follow WHO and clinical standards.",
  },
  {
    q: "Can I see the underlying formulas and steps?",
    a: "Yes. Every tool explains the underlying mathematical formulas, stated assumptions, step-by-step arithmetic stages, and practical real-world examples.",
  },
  {
    q: "Can I use SolveItCalculator on my smartphone?",
    a: "Yes. Every calculator is designed with touch-friendly controls, responsive inputs, and optimized layouts that work smoothly on phones, tablets, and desktop computers.",
  },
  {
    q: "Can I print or save my calculation results?",
    a: "Yes. You can save your favorite tools to your local browser storage with one click or print/export detailed schedules and amortization tables directly to clean PDFs.",
  },
  {
    q: "How often are tax brackets and rates updated?",
    a: "We continuously update statutory reference tables, standard deductions, and tax brackets for each fiscal cycle so your planning remains current.",
  },
  {
    q: "What formulas are used for the health calculators?",
    a: "Our health tools follow clinical benchmarks. For example, our BMR calculator uses the Mifflin-St Jeor equation (the clinical gold standard), and BMI adheres to World Health Organization (WHO) categories.",
  },
  {
    q: "Are the scientific tools capable of handling complex equations?",
    a: "Yes. Our scientific suite handles deep algebraic parentheses, trigonometry, powers, logarithms, and fractions with step-by-step mathematical work.",
  },
  {
    q: "Are these results considered professional financial or medical advice?",
    a: "No. All calculations are intended strictly for planning and educational purposes. Important financial, tax, legal, or health decisions should always be confirmed with qualified professionals.",
  },
];

// --- Popular Search Pills ---
const POPULAR_SEARCH_TERMS = [
  "Mortgage",
  "BMI",
  "Percentage",
  "Age",
  "Loan",
  "SIP",
  "Salary",
  "GST",
  "Time",
  "Scientific",
];

export default function HomePageClient() {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeGoal, setActiveGoal] = useState<string>("money");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsListRef = useRef<HTMLUListElement>(null);

  // Search filtering logic
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return CALCULATOR_DIRECTORY.filter((calc) => {
      const nameMatch = calc.name.toLowerCase().includes(q);
      const catMatch = calc.category.toLowerCase().includes(q);
      const descMatch = calc.description.toLowerCase().includes(q);
      const synMatch = calc.synonyms.some((s) => s.toLowerCase().includes(q));
      return nameMatch || catMatch || descMatch || synMatch;
    }).slice(0, 8);
  }, [query]);

  // Keyboard navigation for search suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (searchResults.length > 0) {
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (searchResults.length > 0) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
      }
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
        e.preventDefault();
        window.location.href = searchResults[selectedIndex].href;
      }
    } else if (e.key === "Escape") {
      setQuery("");
      setSelectedIndex(-1);
      searchInputRef.current?.blur();
    }
  };

  const handlePopularSearchClick = (term: string) => {
    setQuery(term);
    setSelectedIndex(-1);
    searchInputRef.current?.focus();
  };

  const scrollToSearch = () => {
    searchInputRef.current?.focus();
    searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsListRef.current) {
      const items = suggestionsListRef.current.querySelectorAll("li");
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface text-on-surface font-body-md">
      {/* ================= 1. HERO SECTION & SEARCH (COMPACT & RESPONSIVE) ================= */}
      <section className="w-full bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low/40 border-b border-outline-variant/20 py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Free &amp; Private · In-Browser Tools</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight leading-tight mb-3">
            Free, Easy Calculators for Everyday Life
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto mb-5 leading-relaxed">
            Quickly figure out your loan payments, check your birthday age, calculate discounts, or convert measurements. Simple, fast, and 100% free with no sign-up needed.
          </p>

          {/* Primary Search Box */}
          <div className="relative max-w-2xl mx-auto text-left mb-4">
            <label htmlFor="hero-search" className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              What would you like to calculate today?
            </label>
            <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-xl shadow-xs transition-all">
              <span className="material-symbols-outlined text-on-surface-variant/80 pl-3.5 text-xl select-none" aria-hidden="true">
                search
              </span>
              <input
                id="hero-search"
                ref={searchInputRef}
                type="text"
                role="combobox"
                aria-expanded={searchResults.length > 0 || (query.trim().length > 0 && searchResults.length === 0)}
                aria-controls="search-suggestions-box"
                aria-autocomplete="list"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type what you need, like loan, BMI, age, discount, or dates..."
                className="w-full py-3 pl-2.5 pr-9 bg-transparent text-on-surface placeholder:text-on-surface-variant/60 text-sm sm:text-base focus:outline-none"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelectedIndex(-1);
                    searchInputRef.current?.focus();
                  }}
                  className="pr-3 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  aria-label="Clear search input"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>

            {/* Instant Suggestions Dropdown */}
            {query.trim().length > 0 && (
              <div
                id="search-suggestions-box"
                className="absolute z-40 left-0 right-0 mt-1.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl overflow-hidden"
              >
                {searchResults.length > 0 ? (
                  <ul ref={suggestionsListRef} role="listbox" className="divide-y divide-outline-variant/15 max-h-80 overflow-y-auto">
                    {searchResults.map((calc, idx) => (
                      <li
                        key={calc.id}
                        role="option"
                        aria-selected={idx === selectedIndex}
                        className={`transition-colors ${idx === selectedIndex ? "bg-primary/10" : "hover:bg-surface-container-high"}`}
                      >
                        <Link
                          href={calc.href}
                          className="flex items-center gap-3 p-3 block"
                          onClick={() => setQuery("")}
                        >
                          <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-lg">{calc.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-on-surface text-xs sm:text-sm truncate">{calc.name}</span>
                              <span className="text-[10px] font-medium text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container">
                                {calc.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant truncate mt-0.5">{calc.description}</p>
                          </div>
                          <span className="material-symbols-outlined text-on-surface-variant text-sm">arrow_forward</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center">
                    <h3 className="text-xs sm:text-sm font-semibold text-on-surface mb-1">No matching calculator found.</h3>
                    <p className="text-xs text-on-surface-variant mb-3">
                      Try searching for “mortgage”, “BMI”, “percentage”, “loan”, “age”, or “tax”.
                    </p>
                    <a
                      href="#categories-section"
                      onClick={() => setQuery("")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Browse Categories <span className="material-symbols-outlined text-xs">arrow_downward</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Popular Searches */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 text-xs mb-3">
            <span className="text-[11px] font-medium text-on-surface-variant mr-0.5">Quick Searches:</span>
            {POPULAR_SEARCH_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handlePopularSearchClick(term)}
                className="px-2.5 py-0.5 rounded-full bg-surface-container-high hover:bg-primary/10 hover:text-primary text-on-surface transition-colors cursor-pointer border border-outline-variant/30 text-xs font-medium"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Interactive Everyday Quick Solver Widget */}
          <QuickEverydaySolver />

          {/* Hero CTAs */}
          <div className="flex items-center justify-center gap-3 flex-wrap mt-5">
            <button
              type="button"
              onClick={scrollToSearch}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs sm:text-sm hover:opacity-95 shadow-xs transition-opacity flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">search</span>
              Find Any Calculator
            </button>
            <a
              href="#categories-section"
              className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-xs sm:text-sm hover:bg-surface-container-highest border border-outline-variant/40 transition-colors flex items-center gap-1.5"
            >
              <span>Browse All Topics</span>
              <span className="material-symbols-outlined text-base">arrow_downward</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= 2. QUICK DISCOVERY OPTIONS (COMPACT GRID) ================= */}
      <section className="w-full py-8 sm:py-10 bg-surface-container-lowest border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
              Find Any Calculator Easily
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
              Choose the easiest way to find what you are looking for today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-4.5 rounded-xl bg-surface border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <h3 className="font-bold text-sm text-on-surface mb-1">Search by Word</h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Type any word like “loan”, “discount”, or “age” for instant suggestions.
                </p>
              </div>
              <button
                type="button"
                onClick={scrollToSearch}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer pt-2 border-t border-outline-variant/15"
              >
                Go to Search <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="p-4 sm:p-4.5 rounded-xl bg-surface border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">grid_view</span>
                </div>
                <h3 className="font-bold text-sm text-on-surface mb-1">Browse by Topic</h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Explore simple tools grouped by money, health, dates, math, and daily life.
                </p>
              </div>
              <a
                href="#categories-section"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-2 border-t border-outline-variant/15"
              >
                Browse Topics <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>

            <div className="p-4 sm:p-4.5 rounded-xl bg-surface border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">task_alt</span>
                </div>
                <h3 className="font-bold text-sm text-on-surface mb-1">Pick Your Goal</h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Choose what you want to do: buy a car, save cash, get fit, or count days.
                </p>
              </div>
              <a
                href="#solve-goals-section"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-2 border-t border-outline-variant/15"
              >
                Start with a Goal <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>

            <div className="p-4 sm:p-4.5 rounded-xl bg-surface border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">trending_up</span>
                </div>
                <h3 className="font-bold text-sm text-on-surface mb-1">Top Everyday Tools</h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Quick access to mortgage, BMI, discounts, age, and conversion tools.
                </p>
              </div>
              <a
                href="#popular-calculators-section"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-2 border-t border-outline-variant/15"
              >
                View Popular Tools <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. BROWSE CALCULATORS BY CATEGORY (COMPACT DESKTOP GRID) ================= */}
      <section id="categories-section" className="w-full py-8 sm:py-10 md:py-12 bg-surface border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
              Browse Calculators by Category
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
              Select a domain to access specialized calculation workbenches and tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                    </div>
                    <h3 className="font-bold text-sm text-on-surface truncate">{cat.name}</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-3 line-clamp-2">{cat.description}</p>
                  <div className="border-t border-outline-variant/15 pt-2 mb-3 space-y-1">
                    {cat.sampleTools.slice(0, 3).map((tool) => (
                      <Link
                        key={tool.name}
                        href={tool.href}
                        className="block text-xs text-on-surface hover:text-primary transition-colors truncate"
                      >
                        · {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  href={cat.href}
                  className="inline-flex items-center justify-between text-xs font-semibold text-primary group-hover:underline pt-2 border-t border-outline-variant/15"
                >
                  <span>Explore {cat.name}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/time-date"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-colors"
            >
              <span>View All Categories &amp; Tools</span>
              <span className="material-symbols-outlined text-base">apps</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 4. FINANCE CATEGORY FEATURE ================= */}
      <section className="w-full py-8 sm:py-10 bg-surface-container-lowest border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-sm">payments</span>
                <span>Financial Planning</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
                Finance Calculators
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl">
                Understand loans, savings, taxes, investments, mortgages, retirement, and everyday money decisions.
              </p>
            </div>
            <Link
              href="/finance"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-95 shrink-0 self-start sm:self-auto"
            >
              Explore Finance <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FINANCE_SUBCATEGORIES.map((sub) => (
              <Link
                key={sub.name}
                href={sub.href}
                className="p-3.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary/50 transition-colors group"
              >
                <h3 className="font-semibold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors mb-1 flex items-center justify-between">
                  <span>{sub.name}</span>
                  <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                    chevron_right
                  </span>
                </h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">{sub.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. WHAT ARE YOU TRYING TO SOLVE? (RESPONSIVE TABS & COMPACT CARDS) ================= */}
      <section id="solve-goals-section" className="w-full py-8 sm:py-10 md:py-12 bg-surface border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
              What Would You Like to Solve?
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
              Pick your goal below to see the most helpful calculators right away.
            </p>
          </div>

          {/* Goal Selector Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2 mb-5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {GOAL_CATEGORIES.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setActiveGoal(goal.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer border ${
                  activeGoal === goal.id
                    ? "bg-primary text-on-primary border-primary shadow-xs"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container-high border-outline-variant/30"
                }`}
              >
                <span className="material-symbols-outlined text-sm">{goal.icon}</span>
                <span>{goal.title}</span>
              </button>
            ))}
          </div>

          {/* Active Goal Content Display */}
          {(() => {
            const current = GOAL_CATEGORIES.find((g) => g.id === activeGoal) || GOAL_CATEGORIES[0];
            return (
              <div className="p-4 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">{current.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-on-surface">{current.title}</h3>
                      <p className="text-xs text-on-surface-variant">{current.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {current.tools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      title={tool.note}
                      className="px-3 py-2.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/10 transition-all flex items-center justify-between gap-2 group shadow-2xs hover:shadow-xs hover:translate-x-0.5"
                    >
                      <span className="font-semibold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors truncate flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary shrink-0 transition-colors" />
                        <span className="truncate">{tool.name}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform shrink-0">
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ================= 6. POPULAR CALCULATORS (HIGH DENSITY GRID) ================= */}
      <section id="popular-calculators-section" className="w-full py-8 sm:py-10 bg-surface-container-lowest border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
              Popular Calculators
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
              Commonly used calculators for rapid everyday estimates and decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {POPULAR_CALCULATORS.map((calc) => (
              <div
                key={calc.name}
                className="p-3.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary/40 flex flex-col justify-between transition-colors group"
              >
                <div>
                  <div className="w-7 h-7 rounded-lg bg-surface-container text-primary flex items-center justify-center mb-2.5">
                    <span className="material-symbols-outlined text-base">{calc.icon}</span>
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors mb-1">{calc.name}</h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mb-3">{calc.desc}</p>
                </div>
                <Link
                  href={calc.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-2 border-t border-outline-variant/15"
                >
                  Calculate →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. FEATURED DIFFERENTIATED TOOLS ================= */}
      <section className="w-full py-8 sm:py-10 md:py-12 bg-surface border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
              Featured Calculators
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
              Deep-model workbenches designed to solve specific real-world tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {FEATURED_CALCULATORS.map((tool) => (
              <div
                key={tool.name}
                className="p-4 sm:p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">{tool.icon}</span>
                    </div>
                    <span className="text-[10px] font-mono font-medium text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">
                      {tool.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-on-surface mb-1.5">{tool.name}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{tool.desc}</p>
                </div>
                <Link
                  href={tool.href}
                  className="inline-flex items-center justify-between w-full py-2 px-3.5 rounded-lg bg-surface-container text-on-surface font-semibold text-xs hover:bg-primary hover:text-on-primary transition-colors"
                >
                  <span>Launch Tool</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 8. RECENTLY UPDATED CALCULATORS ================= */}
      <section className="w-full py-8 sm:py-10 bg-surface-container-lowest border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
              Recently Updated Calculators
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
              Calculators that have recently received methodology, tax rate, or clinical benchmark updates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {RECENTLY_UPDATED.map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-xl bg-surface border border-outline-variant/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono text-on-surface-variant flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Updated: {item.lastUpdated}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-on-surface mb-1">{item.name}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{item.explanation}</p>
                </div>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-2 border-t border-outline-variant/15"
                >
                  Open Tool →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 9. CALCULATOR COLLECTIONS ================= */}
      <section className="w-full py-8 sm:py-10 md:py-12 bg-surface border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
              Explore Calculator Collections
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
              Curated suites of complementary tools grouped for complete task workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {COLLECTIONS.map((col) => (
              <div
                key={col.title}
                className="p-4 sm:p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">{col.icon}</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-on-surface">{col.title}</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{col.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {col.tools.map((t) => (
                      <span key={t} className="text-[10px] font-medium text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={col.href}
                  className="inline-flex items-center justify-between text-xs font-semibold text-primary hover:underline pt-2.5 border-t border-outline-variant/15"
                >
                  <span>Explore Collection</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 10. HOW SOLVEITCALCULATOR WORKS ================= */}
      <section className="w-full py-8 sm:py-10 bg-surface-container-lowest border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
              How SolveItCalculator Works in 4 Easy Steps
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
              Simple and clear calculation steps from your input to your final answer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            <div className="p-4 rounded-xl bg-surface border border-outline-variant/30">
              <span className="text-xl font-bold text-primary font-mono block mb-1.5">01</span>
              <h3 className="font-bold text-xs sm:text-sm text-on-surface mb-1">Pick Your Tool</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Find what you need by searching or clicking any topic like loans, age, or health.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-outline-variant/30">
              <span className="text-xl font-bold text-primary font-mono block mb-1.5">02</span>
              <h3 className="font-bold text-xs sm:text-sm text-on-surface mb-1">Type Your Numbers</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Enter your numbers with clear, simple labels and helpful example values.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-outline-variant/30">
              <span className="text-xl font-bold text-primary font-mono block mb-1.5">03</span>
              <h3 className="font-bold text-xs sm:text-sm text-on-surface mb-1">Get Instant Answers</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                See your final results right away on your screen—no waiting and no email required.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-outline-variant/30">
              <span className="text-xl font-bold text-primary font-mono block mb-1.5">04</span>
              <h3 className="font-bold text-xs sm:text-sm text-on-surface mb-1">Follow Simple Steps</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                See exactly how the math was done in easy-to-understand words.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 11. CALCULATION TRANSPARENCY SECTION ================= */}
      <section className="w-full py-8 sm:py-10 md:py-12 bg-surface border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
                Clear Calculations, Fully Transparent
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
                We never hide formulas. Every calculation is explained clearly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">functions</span>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-on-surface mb-0.5">Everyday Formulas</h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">Standard, verified formulas displayed openly in simple language.</p>
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">input</span>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-on-surface mb-0.5">Simple Input Boxes</h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">Clear labels and helpful placeholders so you always know what to enter.</p>
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">help_outline</span>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-on-surface mb-0.5">Clear Explanations</h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">Know exactly how interest or tax was applied to your numbers.</p>
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">format_list_numbered</span>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-on-surface mb-0.5">Step-by-Step Breakdown</h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">Follow the simple math steps to see how your result was reached.</p>
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">lightbulb</span>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-on-surface mb-0.5">Helpful Examples</h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">Real-life examples demonstrating how to use the results.</p>
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">link</span>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-on-surface mb-0.5">Related Helpers</h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">Quick links to other helpful tools to finish your calculations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 12. TRUST & PRINCIPLES ================= */}
      <section className="w-full py-8 sm:py-10 bg-surface-container-lowest border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
              Why People Love SolveItCalculator
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
              Built to make everyday math simple, private, and stress-free for everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/30 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-lg">visibility</span>
              </div>
              <h3 className="font-bold text-xs text-on-surface mb-1">CLEAR RESULTS</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Your answer is shown first in large, clear numbers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/30 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-lg">menu_book</span>
              </div>
              <h3 className="font-bold text-xs text-on-surface mb-1">EASY WORDS</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                No confusing jargon. Plain English anyone can follow.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/30 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-lg">shield</span>
              </div>
              <h3 className="font-bold text-xs text-on-surface mb-1">100% PRIVATE</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Runs on your device. We never see or store your data.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/30 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-lg">bolt</span>
              </div>
              <h3 className="font-bold text-xs text-on-surface mb-1">INSTANT SPEED</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Works instantly without loading delays or server lag.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/30 text-center col-span-2 sm:col-span-1">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-lg">lock_open</span>
              </div>
              <h3 className="font-bold text-xs text-on-surface mb-1">100% FREE</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                No sign-up, no subscriptions, and no hidden fees ever.
              </p>
            </div>
          </div>

          {/* Privacy-Considerate Message */}
          <div className="max-w-2xl mx-auto p-3.5 sm:p-4 rounded-xl bg-surface border border-outline-variant/30 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
              <span className="material-symbols-outlined text-sm">shield</span>
              <span>Privacy-Conscious Calculations</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Calculator inputs are processed locally in your browser. Review our{" "}
              <Link href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>{" "}
              for complete details.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 13. EDUCATIONAL CONTENT ================= */}
      <section className="w-full py-8 sm:py-10 md:py-12 bg-surface border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1">
              Learn How Calculations Work
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
              Understand the formulas, assumptions, and meaning behind standard numerical models.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {EDUCATIONAL_GUIDES.map((g) => (
              <div
                key={g.title}
                className="p-3.5 sm:p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-on-surface mb-1.5 leading-snug">{g.question}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{g.answer}</p>
                </div>
                <div className="flex items-center justify-between pt-2.5 border-t border-outline-variant/15 text-xs">
                  <Link href={g.guideHref} className="text-on-surface-variant hover:text-primary transition-colors font-medium text-[11px]">
                    Read Guide →
                  </Link>
                  <Link href={g.calculatorHref} className="text-primary hover:underline font-semibold text-[11px]">
                    Use Tool →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 14. SEARCH-INTENT SEO SHORTCUTS ================= */}
      <section className="w-full py-8 sm:py-10 bg-surface-container-lowest border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-sm sm:text-base font-bold text-on-surface mb-3">
              Looking for a Specific Calculation?
            </h2>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <Link href="/finance/mortgage-calculator" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                Mortgage Payment
              </Link>
              <Link href="/finance/emi-calculator" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                Loan EMI
              </Link>
              <Link href="/bmi-calculator" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                BMI Index
              </Link>
              <Link href="/time-date/age-calculator" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                Age Calculator
              </Link>
              <Link href="/percentage-calculator" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                Percentage Math
              </Link>
              <Link href="/investing-and-growth" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                Compound Growth
              </Link>
              <Link href="/time-date/retirement-countdown-in-workdays" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                Retirement Countdown
              </Link>
              <Link href="/business-days-calculator" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                Working Days
              </Link>
              <Link href="/conversions" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                Unit Converter
              </Link>
              <Link href="/business" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                Business Profit
              </Link>
              <Link href="/education" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                GPA Planner
              </Link>
              <Link href="/home-construction" className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-medium shadow-2xs">
                Concrete Volume
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 15. UNIFIED MASTER FAQ ACCORDION ================= */}
      <section className="w-full py-12 sm:py-16 bg-surface border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs font-semibold text-primary uppercase tracking-wider border border-outline-variant/40 mb-2">
                <span className="material-symbols-outlined text-sm">help</span>
                <span>Common Questions Answered</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-2 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                Clear and transparent answers detailing our tools, 100% in-browser privacy, and verified accuracy.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden shadow-xs hover:border-primary/40 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full py-4 px-5 text-left font-bold text-xs sm:text-sm text-on-surface flex items-center justify-between gap-4 cursor-pointer select-none focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="leading-snug">{faq.q}</span>
                      <span
                        className={`material-symbols-outlined text-base transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-primary" : "text-on-surface-variant"
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/20 animate-in fade-in-50 duration-150">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 16. FINAL CALL TO ACTION ================= */}
      <section className="w-full py-12 sm:py-16 bg-surface-container-low/50 border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto bg-surface-container-lowest p-8 sm:p-10 rounded-2xl border border-outline-variant/40 shadow-xs">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-2 tracking-tight">
              Ready to Solve Your Calculation?
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mb-6 max-w-md mx-auto leading-relaxed">
              Find the right calculator in seconds or explore our topic categories. 100% free with no sign-up or paywalls.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={scrollToSearch}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs sm:text-sm hover:opacity-95 shadow-xs transition-opacity flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">search</span>
                Find a Calculator
              </button>
              <a
                href="#categories-section"
                className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-xs sm:text-sm hover:bg-surface-container-highest border border-outline-variant/40 transition-colors flex items-center gap-1.5"
              >
                <span>Browse All Topics</span>
                <span className="material-symbols-outlined text-base">arrow_downward</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
