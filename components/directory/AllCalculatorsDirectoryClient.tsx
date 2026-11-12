'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronRight,
  ArrowRight,
  Calculator,
  Coins,
  ArrowLeftRight,
  Calendar,
  Heart,
  Home,
  BarChart3,
  FlaskConical,
  PiggyBank,
  ArrowUpDown,
  ClipboardList,
  BookOpen,
  X,
  Compass,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { GUIDES_DATA } from '@/lib/guidesData';

export interface DirectoryCalculatorItem {
  id: string;
  name: string;
  description: string;
  href: string;
  keywords: string[];
}

export interface DirectoryCategoryGroup {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  headerBg: string;
  iconBg: string;
  iconColor: string;
  iconName:
    | 'math'
    | 'finance'
    | 'unit'
    | 'datetime'
    | 'health'
    | 'home'
    | 'business'
    | 'science'
    | 'retirement';
  layout: 'list' | 'compact-grid';
  calculators: DirectoryCalculatorItem[];
}

export const DIRECTORY_GROUPS: DirectoryCategoryGroup[] = [
  {
    id: 'math',
    title: 'Math Calculators',
    subtitle: 'Percentages, fractions, ratios, averages, algebra, and multi-step expressions.',
    href: '/math',
    headerBg: 'bg-[#EEF4FF]',
    iconBg: 'bg-[#2457D6]',
    iconColor: 'text-white',
    iconName: 'math',
    layout: 'list',
    calculators: [
      {
        id: 'calculation-workspace',
        name: 'Calculation Workspace (Expressions & History)',
        description:
          'Calculate multi-step expressions, review previous steps, save named subtotals, and reuse results.',
        href: '/calculation-workspace',
        keywords: ['workspace', 'expression calculator', 'history', 'running total', 'subtotal'],
      },
      {
        id: 'percentage-calculator',
        name: 'Percentage Calculator',
        description: 'Calculate the percentage of a number, what percent X is of Y, or whole from part.',
        href: '/math/percentage-calculator',
        keywords: ['percent', 'percentage', 'rate', 'value'],
      },
      {
        id: 'percentage-change-calculator',
        name: 'Percentage Change Calculator',
        description: 'Find the percentage increase, decrease, or difference between two values.',
        href: '/math/percentage-change-calculator',
        keywords: ['percentage change', 'increase', 'decrease', 'difference', 'growth'],
      },
      {
        id: 'discount-calculator',
        name: 'Discount Calculator',
        description: 'Find the final sale price after a percentage discount and total money saved.',
        href: '/math/discount-calculator',
        keywords: ['discount', 'sale price', 'percent off', 'markdown'],
      },
      {
        id: 'percent-error-calculator',
        name: 'Percent Error Calculator',
        description: 'Compare experimental measurements against theoretical or accepted values.',
        href: '/math/percent-error-calculator',
        keywords: ['percent error', 'experimental', 'theoretical', 'accuracy'],
      },
      {
        id: 'percentage-to-decimal-calculator',
        name: 'Percentage to Decimal Calculator',
        description: 'Convert any percentage value into its exact decimal form and vice versa.',
        href: '/math/percentage-to-decimal-calculator',
        keywords: ['percentage to decimal', 'convert percent', 'decimal'],
      },
      {
        id: 'percentage-to-fraction-calculator',
        name: 'Percentage to Fraction Calculator',
        description: 'Convert any percentage into a simplified proper fraction or mixed number.',
        href: '/math/percentage-to-fraction-calculator',
        keywords: ['percentage to fraction', 'lowest terms', 'fraction'],
      },
      {
        id: 'fraction-calculator',
        name: 'Fraction Calculator',
        description: 'Add, subtract, multiply, divide, and simplify fractions step by step.',
        href: '/math/fraction-calculator',
        keywords: ['fraction', 'numerator', 'denominator', 'simplify'],
      },
      {
        id: 'fraction-to-decimal-calculator',
        name: 'Fraction to Decimal & Percent Converter',
        description: 'Convert proper, improper, or mixed fractions into decimals and percentages.',
        href: '/math/fraction-to-decimal-calculator',
        keywords: ['fraction to decimal', 'convert fraction', 'decimal'],
      },
      {
        id: 'ratio-calculator',
        name: 'Ratio & Proportion Calculator',
        description: 'Simplify ratios, solve proportions by cross-multiplication, and scale quantities.',
        href: '/math/ratio-calculator',
        keywords: ['ratio', 'proportion', 'cross multiply', 'scale', 'compare'],
      },
      {
        id: 'average-calculator',
        name: 'Average Calculator (Mean, Median, Mode & Range)',
        description: 'Find the arithmetic mean, median, mode, sum, and range of any number set.',
        href: '/math/average-calculator',
        keywords: ['average', 'mean', 'median', 'mode', 'range', 'statistics'],
      },
      {
        id: 'scientific-calculator',
        name: 'Scientific Calculator',
        description: 'Evaluate advanced expressions with trigonometry, logarithms, and PEMDAS order.',
        href: '/math/scientific-calculator',
        keywords: ['scientific', 'trigonometry', 'algebra', 'log', 'exponent', 'pemdas'],
      },
      {
        id: 'square-root-calculator',
        name: 'Square Root Calculator',
        description: 'Find principal square roots, nth radicals, and simplified radical forms.',
        href: '/math/square-root-calculator',
        keywords: ['square root', 'radical', 'nth root', 'geometry'],
      },
      {
        id: 'exponent-calculator',
        name: 'Exponent Calculator',
        description: 'Calculate positive, negative, and fractional powers and scientific notation.',
        href: '/math/exponent-calculator',
        keywords: ['exponent', 'power', 'scientific notation'],
      },
      {
        id: 'log-calculator',
        name: 'Logarithm Calculator (log₁₀, ln & Base-b)',
        description: 'Calculate common base-10, natural base-e, and custom-base logarithms.',
        href: '/math/log-calculator',
        keywords: ['logarithm', 'log', 'ln', 'natural log'],
      },
      {
        id: 'absolute-value-calculator',
        name: 'Absolute Value Calculator',
        description: 'Find the absolute magnitude of a number and distance between two points.',
        href: '/math/absolute-value-calculator',
        keywords: ['absolute value', 'magnitude', 'distance'],
      },
      {
        id: 'gcd-and-lcm-calculator',
        name: 'GCD and LCM Calculator',
        description: 'Find the greatest common divisor (GCD) and least common multiple (LCM).',
        href: '/math/gcd-and-lcm-calculator',
        keywords: ['gcd', 'lcm', 'greatest common divisor', 'least common multiple'],
      },
      {
        id: 'equation-solver',
        name: 'Linear Equation Solver',
        description: 'Isolate x and solve one-variable linear algebraic equations step by step.',
        href: '/math/equation-solver',
        keywords: ['equation solver', 'algebra', 'linear'],
      },
      {
        id: 'quadratic-equation-calculator',
        name: 'Quadratic Equation Solver',
        description: 'Solve ax² + bx + c = 0 using the quadratic formula, discriminant, and vertex.',
        href: '/math/quadratic-equation-calculator',
        keywords: ['quadratic formula', 'roots', 'discriminant', 'vertex'],
      },
      {
        id: 'matrix-calculator',
        name: 'Matrix Calculator',
        description: 'Perform 2×2 and 3×3 matrix addition, multiplication, transpose, and determinant.',
        href: '/math/matrix-calculator',
        keywords: ['matrix', 'determinant', 'inverse', 'linear algebra'],
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance & Tax Calculators',
    subtitle: 'Loans, mortgages, compound interest, US & global income taxes, and paychecks.',
    href: '/finance',
    headerBg: 'bg-[#ECFDF5]',
    iconBg: 'bg-[#F59E0B]',
    iconColor: 'text-white',
    iconName: 'finance',
    layout: 'list',
    calculators: [
      {
        id: 'salary-calculator',
        name: 'Multi-Country Salary & Take-Home Pay Calculator',
        description:
          'Estimate gross-to-net take-home pay for the US, UK, Canada, Australia, and India with official tax brackets.',
        href: '/salary-calculator',
        keywords: [
          'salary calculator',
          'take home pay',
          'net pay',
          'paycheck',
          'us tax',
          'uk paye',
          'canada cpp ei',
          'australia medicare levy',
          'india new tax regime',
        ],
      },
      {
        id: 'loan-payment-calculator',
        name: 'Loan Payment & Amortization Calculator',
        description: 'Estimate monthly loan payments, total interest cost, and full amortization schedule.',
        href: '/loan-calculator',
        keywords: ['loan', 'payment', 'emi', 'monthly', 'borrow'],
      },
      {
        id: 'interest-calculator',
        name: 'Compound Interest Calculator',
        description: 'Calculate simple or compound interest growth with recurring monthly contributions.',
        href: '/compound-interest-calculator',
        keywords: ['interest', 'compound', 'simple', 'savings', 'apy'],
      },
      {
        id: 'mortgage-calculator',
        name: 'Mortgage Payment Calculator (PITI & Extra Payments)',
        description: 'Calculate monthly principal, interest, property taxes, homeowners insurance, and PMI.',
        href: '/mortgage-calculator',
        keywords: ['affordability', 'mortgage', 'home loan', 'piti', 'pmi'],
      },
      {
        id: 'us-federal-income-tax-calculator',
        name: 'US Federal Income Tax Calculator',
        description: 'Estimate federal tax liability, effective and marginal rates, and tax refund.',
        href: '/finance/us-federal-income-tax-calculator',
        keywords: ['us federal tax', 'income tax', 'irs', 'brackets', 'refund'],
      },
      {
        id: 'us-state-take-home-calculator',
        name: 'US State Take-Home Paycheck Calculator',
        description: 'Calculate net pay across all 50 US states after federal, FICA, and state tax.',
        href: '/finance/us-state-take-home-calculator',
        keywords: ['state tax', 'paycheck', 'take home pay', '50 states'],
      },
      {
        id: 'capital-gains-tax-calculator',
        name: 'Capital Gains Tax Calculator (US)',
        description: 'Calculate short-term and long-term capital gains tax and 3.8% NIIT.',
        href: '/finance/capital-gains-tax-calculator',
        keywords: ['capital gains', 'stocks', 'real estate tax', 'niit'],
      },
      {
        id: 'salary-to-hourly-calculator',
        name: 'Salary to Hourly Wage Converter',
        description: 'Convert annual salary into hourly, daily, weekly, bi-weekly, and monthly pay.',
        href: '/finance/salary-to-hourly-calculator',
        keywords: ['salary to hourly', 'hourly wage', 'paycheck converter'],
      },
      {
        id: 'take-home-pay-calculator',
        name: 'Take-Home Paycheck Calculator',
        description: 'Calculate net paycheck amount after taxes, 401(k), and pre-tax health deductions.',
        href: '/finance/take-home-pay-calculator',
        keywords: ['take home pay', 'net salary', 'paycheck'],
      },
      {
        id: 'investment-growth-calculator',
        name: 'Investment Growth, ROI & Expense Ratio Calculator',
        description: 'Project long-term portfolio growth, ROI, CAGR, and annual fee drag.',
        href: '/finance/investment-growth-calculator',
        keywords: ['investment growth', 'roi', 'cagr', 'portfolio growth'],
      },
      {
        id: 'real-rate-of-return-calculator',
        name: 'Real Rate of Return (Inflation-Adjusted) Calculator',
        description: 'Calculate purchasing-power investment yield after inflation using the Fisher equation.',
        href: '/finance/real-rate-of-return-calculator',
        keywords: ['real rate of return', 'inflation', 'fisher equation', 'purchasing power'],
      },
      {
        id: 'pay-raise-calculator',
        name: 'Pay Raise & Salary Increase Calculator',
        description: 'See your new annual salary, hourly rate, and extra monthly income after a raise.',
        href: '/finance/pay-raise-calculator',
        keywords: ['pay raise', 'salary increase', 'promotion'],
      },
      {
        id: 'overtime-pay-calculator',
        name: 'Overtime Pay Calculator (FLSA 1.5x & 2x)',
        description: 'Compute total gross earnings including regular, 1.5x overtime, and 2x shifts.',
        href: '/finance/overtime-pay-calculator',
        keywords: ['overtime pay', 'time and a half', 'double time', 'flsa'],
      },
      {
        id: 'bonus-tax-calculator',
        name: 'Bonus Tax Withholding Calculator (US)',
        description: 'Compare IRS 22% flat supplemental withholding against the aggregate paycheck method.',
        href: '/finance/bonus-tax-calculator',
        keywords: ['bonus tax', 'supplemental wages', '22% withholding'],
      },
      {
        id: 'uk-paye-calculator',
        name: 'UK PAYE Income Tax & National Insurance Calculator',
        description: 'Calculate UK take-home pay, Personal Allowance taper, and Class 1 NI.',
        href: '/finance/uk-paye-calculator',
        keywords: ['uk tax', 'paye', 'national insurance', 'hmrc'],
      },
      {
        id: 'canada-income-tax-calculator',
        name: 'Canada Federal & Provincial Income Tax Calculator',
        description: 'Estimate Canadian net income after federal, provincial, CPP, and EI.',
        href: '/finance/canada-income-tax-calculator',
        keywords: ['canada tax', 'cra', 'provincial tax', 'cpp', 'ei'],
      },
      {
        id: 'india-income-tax-calculator',
        name: 'India Income Tax Calculator (New vs. Old Regime)',
        description: 'Compare New and Old Regime tax slabs, Section 87A rebate, and 4% cess.',
        href: '/finance/india-income-tax-calculator',
        keywords: ['india income tax', 'new regime', 'old regime', '80c'],
      },
      {
        id: 'in-hand-salary-calculator',
        name: 'India In-Hand Salary Calculator (CTC to Net)',
        description: 'Break down annual CTC into monthly in-hand pay after EPF, PT, and income tax.',
        href: '/finance/in-hand-salary-calculator',
        keywords: ['in hand salary', 'ctc to net', 'epf', 'india salary'],
      },
      {
        id: 'hra-exemption-calculator',
        name: 'HRA Tax Exemption Calculator (India)',
        description: 'Calculate tax-exempt House Rent Allowance under Section 10(13A).',
        href: '/finance/hra-exemption-calculator',
        keywords: ['hra exemption', 'house rent allowance', 'section 10(13a)'],
      },
      {
        id: 'india-capital-gains-tax-calculator',
        name: 'India Capital Gains Tax Calculator (STCG & LTCG)',
        description: 'Calculate equity, mutual fund, and property short- and long-term capital gains.',
        href: '/finance/india-capital-gains-tax-calculator',
        keywords: ['india capital gains', 'stcg', 'ltcg', 'mutual fund tax'],
      },
      {
        id: 'germany-income-tax-calculator',
        name: 'Germany Brutto-Netto Income Tax Calculator',
        description: 'Compute German net salary after income tax, solidarity surcharge, and insurance.',
        href: '/finance/germany-income-tax-calculator',
        keywords: ['germany tax', 'brutto netto', 'lohnsteuer'],
      },
      {
        id: 'france-income-tax-calculator',
        name: 'France Family Quotient Income Tax Calculator',
        description: 'Calculate French net pay using household quotient familial parts and CSG/CRDS.',
        href: '/finance/france-income-tax-calculator',
        keywords: ['france tax', 'impot sur le revenu', 'quotient familial'],
      },
      {
        id: 'singapore-income-tax-calculator',
        name: 'Singapore Resident Income Tax & CPF Calculator',
        description: 'Estimate Singapore resident income tax and Central Provident Fund (CPF).',
        href: '/finance/singapore-income-tax-calculator',
        keywords: ['singapore tax', 'iras', 'cpf contribution'],
      },
      {
        id: 'uae-income-tax-calculator',
        name: 'UAE Salary & End-of-Service Gratuity Calculator',
        description: 'Calculate tax-free UAE take-home pay and statutory end-of-service gratuity.',
        href: '/finance/uae-income-tax-calculator',
        keywords: ['uae salary', 'dubai gratuity', 'end of service'],
      },
    ],
  },
  {
    id: 'unit-conversion',
    title: 'Unit Conversion Calculators',
    subtitle: 'Convert length, weight, volume, area, temperature, cooking, speed, and data.',
    href: '/conversions',
    headerBg: 'bg-[#F3EEFF]',
    iconBg: 'bg-[#7C3AED]',
    iconColor: 'text-white',
    iconName: 'unit',
    layout: 'list',
    calculators: [
      {
        id: 'recipe-converter',
        name: 'Recipe Ingredient & Serving Scale Converter',
        description: 'Scale recipes by serving count and convert cups, spoons, and mL to grams using ingredient densities.',
        href: '/recipe-converter',
        keywords: ['recipe converter', 'baking', 'cups to grams', 'flour', 'sugar', 'butter', 'servings'],
      },
      {
        id: 'length-conversion',
        name: 'Length & Distance Converter',
        description: 'Convert meters, kilometers, centimeters, millimeters, feet, inches, yards, and miles.',
        href: '/conversions/length',
        keywords: ['length', 'meters', 'feet', 'inches', 'kilometers', 'miles'],
      },
      {
        id: 'weight-conversion',
        name: 'Weight & Mass Converter',
        description: 'Convert kilograms, pounds, grams, milligrams, ounces, stones, and metric tons.',
        href: '/conversions/weight',
        keywords: ['weight', 'mass', 'kilograms', 'pounds', 'grams', 'ounces'],
      },
      {
        id: 'temperature-conversion',
        name: 'Temperature Converter (Celsius, Fahrenheit & Kelvin)',
        description: 'Convert temperatures between Celsius (°C), Fahrenheit (°F), and Kelvin (K).',
        href: '/conversions/temperature',
        keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin'],
      },
      {
        id: 'volume-conversion',
        name: 'Liquid Volume & Capacity Converter',
        description: 'Convert liters, milliliters, US gallons, quarts, pints, cups, fluid ounces, and cubic meters.',
        href: '/conversions/volume',
        keywords: ['volume', 'liters', 'gallons', 'milliliters', 'cubic'],
      },
      {
        id: 'cooking-measurement-converter',
        name: 'Kitchen Volume & Spoon Converter',
        description: 'Convert US cups, tablespoons, teaspoons, fluid ounces, milliliters, and liters.',
        href: '/conversions/cooking',
        keywords: ['cooking', 'kitchen', 'cups', 'tablespoons', 'teaspoons', 'ml'],
      },
      {
        id: 'area-conversion',
        name: 'Area & Land Measurement Converter',
        description: 'Convert square meters, square feet, acres, hectares, square yards, and square inches.',
        href: '/conversions/area',
        keywords: ['area', 'square meters', 'square feet', 'acres', 'hectares'],
      },
      {
        id: 'speed-velocity-converter',
        name: 'Speed & Velocity Converter',
        description: 'Convert miles per hour (mph), kilometers per hour (km/h), meters per second (m/s), and knots.',
        href: '/conversions/speed',
        keywords: ['speed', 'velocity', 'mph', 'kmh', 'knots'],
      },
      {
        id: 'fuel-economy-converter',
        name: 'Fuel Economy & Consumption Converter',
        description: 'Convert US MPG, UK Imperial MPG, kilometers per liter (km/L), and liters per 100 km (L/100km).',
        href: '/conversions/fuel-economy',
        keywords: ['fuel economy', 'mpg', 'l/100km', 'km/l'],
      },
      {
        id: 'torque-converter',
        name: 'Torque Converter (N·m, ft-lb & in-lb)',
        description: 'Convert Newton-meters (N·m), foot-pounds (ft-lb), and inch-pounds (in-lb) for fasteners.',
        href: '/conversions/torque',
        keywords: ['torque', 'nm to ft lbs', 'inch pounds'],
      },
      {
        id: 'energy-power-converter',
        name: 'Energy & Work Unit Converter',
        description: 'Convert joules, kilojoules, calories, kilocalories (kcal), watt-hours, kWh, and BTU.',
        href: '/conversions/energy',
        keywords: ['energy', 'joules', 'calories', 'kwh', 'btu'],
      },
      {
        id: 'digital-storage-converter',
        name: 'Digital Data & Storage Converter',
        description: 'Convert bits, bytes, kilobytes (KB), megabytes (MB), gigabytes (GB), and terabytes (TB).',
        href: '/conversions/digital',
        keywords: ['digital storage', 'bytes', 'mb', 'gb', 'tb', 'data'],
      },
    ],
  },
  {
    id: 'date-time',
    title: 'Date & Time Calculators',
    subtitle: 'Date differences, days from today, business days, exact age, countdowns, and timers.',
    href: '/date-time',
    headerBg: 'bg-[#FFF1F2]',
    iconBg: 'bg-[#E11D48]',
    iconColor: 'text-white',
    iconName: 'datetime',
    layout: 'list',
    calculators: [
      {
        id: 'date-difference-calculator',
        name: 'Date Difference Calculator',
        description: 'Calculate exact years, months, weeks, and total calendar days between two dates.',
        href: '/date-difference-calculator',
        keywords: ['date difference', 'days between dates', 'calendar days'],
      },
      {
        id: 'days-from-today-calculator',
        name: 'Days From Today Calculator (Add or Subtract Days)',
        description: 'Find the exact calendar date N days, weeks, or months from today or before a start date.',
        href: '/days-from-today-calculator',
        keywords: ['days from today', 'add days to date', '30 days from today', '90 days from today'],
      },
      {
        id: 'business-days-calculator',
        name: 'Business Days & Working Days Calculator',
        description: 'Count Monday–Friday working days between two dates or project a business-day deadline.',
        href: '/business-days-calculator',
        keywords: ['business days', 'working days', 'weekdays', 'exclude weekends'],
      },
      {
        id: 'age-calculator',
        name: 'Chronological Age Calculator',
        description: 'Find your exact age in years, months, weeks, days, hours, and minutes from date of birth.',
        href: '/age-calculator',
        keywords: ['age', 'birthday', 'date of birth', 'years', 'chronological age'],
      },
      {
        id: 'countdown-calculator',
        name: 'Event & Holiday Countdown Calculator',
        description: 'See live days, hours, minutes, and seconds remaining until any upcoming event or deadline.',
        href: '/countdown-calculator',
        keywords: ['countdown', 'days until', 'event countdown', 'retirement countdown'],
      },
      {
        id: 'time-duration-calculator',
        name: 'Time Duration Calculator (Hours & Minutes Between Times)',
        description: 'Calculate elapsed hours, minutes, seconds, and decimal hours between a start and end time.',
        href: '/time-duration-calculator',
        keywords: ['time duration', 'hours between times', 'elapsed time'],
      },
      {
        id: 'work-hours-calculator',
        name: 'Weekly Work Hours & Timesheet Pay Calculator',
        description: 'Total weekly shift hours, deduct unpaid breaks, and compute regular plus 1.5× overtime pay.',
        href: '/work-hours-calculator',
        keywords: ['work hours', 'timesheet', 'time card', 'payroll hours'],
      },
      {
        id: 'timer-stopwatch',
        name: 'Online Interval Timer & Lap Stopwatch',
        description: 'Run a countdown timer with focus presets or record millisecond lap splits in your browser.',
        href: '/timer-stopwatch',
        keywords: ['timer', 'stopwatch', 'pomodoro', 'lap timer'],
      },
      {
        id: 'military-time-converter',
        name: 'Military Time Converter (24-Hour & 12-Hour AM/PM)',
        description: 'Convert 24-hour military time (0000–2359) to standard 12-hour AM/PM time and spoken phonetics.',
        href: '/military-time-converter',
        keywords: ['military time', '24 hour clock', 'am pm converter'],
      },
      {
        id: 'time-unit-converter',
        name: 'Time Unit Converter (Seconds, Minutes, Hours, Days & Weeks)',
        description: 'Convert durations across milliseconds, seconds, minutes, hours, days, weeks, and years.',
        href: '/time-unit-converter',
        keywords: ['time converter', 'hours to minutes', 'seconds to hours', 'days to hours'],
      },
    ],
  },
  {
    id: 'health-fitness',
    title: 'Health & Fitness Calculators',
    subtitle: 'Adult BMI, Total Daily Energy Expenditure (TDEE), resting BMR, body fat %, and ideal weight.',
    href: '/health-fitness',
    headerBg: 'bg-[#ECFDF5]',
    iconBg: 'bg-[#16856B]',
    iconColor: 'text-white',
    iconName: 'health',
    layout: 'list',
    calculators: [
      {
        id: 'bmi-calculator',
        name: 'BMI Calculator (Body Mass Index)',
        description:
          'Calculate adult Body Mass Index (kg/m²), WHO weight status category, Ponderal Index, and healthy weight range.',
        href: '/bmi-calculator',
        keywords: ['bmi', 'body mass index', 'weight category', 'who bmi'],
      },
      {
        id: 'tdee-calculator',
        name: 'TDEE Calculator (Total Daily Energy Expenditure)',
        description:
          'Estimate total daily calorie burn across 5 activity levels plus target calories and macros for cutting or bulking.',
        href: '/tdee-calculator',
        keywords: ['tdee', 'daily calories', 'calorie burn', 'macros', 'maintenance calories'],
      },
      {
        id: 'bmr-calculator',
        name: 'BMR Calculator (Basal Metabolic Rate)',
        description:
          'Calculate resting metabolic calorie expenditure using the Mifflin-St Jeor and Revised Harris-Benedict equations.',
        href: '/bmr-calculator',
        keywords: ['bmr', 'basal metabolic rate', 'resting calories', 'mifflin st jeor'],
      },
      {
        id: 'body-fat-calculator',
        name: 'Body Fat Percentage Calculator (U.S. Navy Method)',
        description:
          'Estimate body fat percentage, fat mass, and lean body mass from neck, waist, hip, and height circumference.',
        href: '/body-fat-calculator',
        keywords: ['body fat', 'us navy body fat', 'lean body mass', 'fat percentage'],
      },
      {
        id: 'ideal-weight-calculator',
        name: 'Ideal Weight Calculator (Devine, Robinson, Miller & WHO)',
        description:
          'Compare healthy target body weight across four clinical height-based formulas and the WHO normal BMI band.',
        href: '/ideal-weight-calculator',
        keywords: ['ideal weight', 'healthy weight', 'devine formula', 'target weight'],
      },
    ],
  },
  {
    id: 'home-construction',
    title: 'Home & Construction Calculators',
    subtitle: 'Concrete slabs, post holes, flooring boxes and waste allowance, and home financing.',
    href: '/home-construction',
    headerBg: 'bg-[#FFFBEB]',
    iconBg: 'bg-[#D97706]',
    iconColor: 'text-white',
    iconName: 'home',
    layout: 'list',
    calculators: [
      {
        id: 'construction-project-calculator',
        name: 'Concrete Slab, Footing & Material Volume Calculator',
        description:
          'Calculate square footage, cubic feet, cubic yards, and pre-mixed concrete bag counts (40, 60, or 80 lb) with waste allowance.',
        href: '/construction-project-calculator',
        keywords: [
          'construction project calculator',
          'concrete slab',
          'post holes',
          'cubic yards',
          'square footage',
          'waste allowance',
        ],
      },
      {
        id: 'flooring-project-calculator',
        name: 'Flooring & Tile Estimator (Area, Waste & Box Count)',
        description:
          'Calculate room square footage, add 5%–15% cutting waste allowance, and estimate flooring boxes and project cost.',
        href: '/home-construction/flooring-calculator',
        keywords: [
          'flooring',
          'flooring calculator',
          'laminate',
          'hardwood',
          'tile',
          'room area',
          'waste allowance',
        ],
      },
      {
        id: 'home-affordability-calculator',
        name: 'Home Affordability Calculator (28/36 Rule)',
        description: 'Calculate the maximum house price you can afford based on gross income, down payment, and debt.',
        href: '/finance/home-affordability-calculator',
        keywords: ['home affordability', '28/36 rule', 'how much house'],
      },
      {
        id: 'refinance-break-even-calculator',
        name: 'Mortgage Refinance & Break-Even Calculator',
        description: 'Compare your current mortgage against a new loan rate and closing costs to find break-even months.',
        href: '/finance/refinance-calculator',
        keywords: ['refinance', 'break even', 'closing costs', 'lower rate'],
      },
      {
        id: 'rent-vs-buy-calculator',
        name: 'Rent vs. Buy Home Comparison Calculator',
        description: 'Compare 5-to-30 year net cost and equity build of buying a home versus renting and investing.',
        href: '/finance/rent-vs-buy-calculator',
        keywords: ['rent vs buy', 'homeownership', 'home equity'],
      },
    ],
  },
  {
    id: 'business',
    title: 'Business Calculators',
    subtitle: 'Gross margin, price markup, operating & net profit margin, break-even, and contractor taxes.',
    href: '/finance/business',
    headerBg: 'bg-[#FFF1F2]',
    iconBg: 'bg-[#E11D48]',
    iconColor: 'text-white',
    iconName: 'business',
    layout: 'list',
    calculators: [
      {
        id: 'profit-margin-calculator',
        name: 'Net & Operating Profit Margin Calculator',
        description: 'Compute gross, operating, and net profit margins from revenue, COGS, operating expenses, and tax.',
        href: '/finance/profit-margin-calculator',
        keywords: ['profit margin', 'net margin', 'operating margin', 'revenue'],
      },
      {
        id: 'margin-calculator',
        name: 'Gross Margin Calculator',
        description: 'Calculate gross margin percentage, unit profit, and required selling price from unit cost.',
        href: '/finance/margin-calculator',
        keywords: ['gross margin', 'unit profit', 'selling price', 'cogs'],
      },
      {
        id: 'markup-calculator',
        name: 'Price Markup Calculator',
        description: 'Find selling price, dollar profit, and gross margin equivalent from unit cost and markup %.',
        href: '/finance/markup-calculator',
        keywords: ['markup', 'wholesale cost', 'retail price'],
      },
      {
        id: 'break-even-calculator',
        name: 'Break-Even Point Calculator',
        description: 'Find the exact sales volume in units and revenue required to cover fixed and variable costs.',
        href: '/finance/break-even-calculator',
        keywords: ['break even', 'fixed costs', 'unit price', 'contribution margin'],
      },
      {
        id: 'business-self-employment-tax',
        name: 'Self-Employment Tax Calculator (Schedule SE)',
        description: 'Calculate 15.3% Social Security and Medicare SE taxes, half-SE deduction, and quarterly IRS payments.',
        href: '/finance/self-employment-tax-calculator',
        keywords: ['freelance tax', 'self employment', 'schedule se'],
      },
      {
        id: 'business-1099-vs-w2',
        name: '1099 Contractor vs. W-2 Compensation Calculator',
        description: 'Compare net independent contractor income against salaried W-2 employment and benefits.',
        href: '/finance/1099-vs-w2-calculator',
        keywords: ['1099', 'contractor rate', 'consulting'],
      },
    ],
  },
  {
    id: 'science',
    title: 'Science Calculators',
    subtitle: "Physics, chemistry, density, Newton's second law of force, Ohm's law, and solution molarity.",
    href: '/science',
    headerBg: 'bg-[#EEF4FF]',
    iconBg: 'bg-[#2457D6]',
    iconColor: 'text-white',
    iconName: 'science',
    layout: 'list',
    calculators: [
      {
        id: 'density-calculator',
        name: 'Density, Mass & Volume Calculator',
        description: 'Calculate density (ρ), mass (m), or volume (V) using ρ = m ÷ V with water buoyancy check.',
        href: '/science/density-calculator',
        keywords: ['density', 'mass', 'volume', 'chemistry', 'physics'],
      },
      {
        id: 'force-calculator',
        name: 'Force, Mass & Acceleration Calculator (F = m × a)',
        description: "Calculate net force in Newtons, mass in kg, or acceleration in m/s² using Newton's Second Law.",
        href: '/science/force-calculator',
        keywords: ['force', 'newton', 'mass', 'acceleration', 'physics'],
      },
      {
        id: 'ohms-law-calculator',
        name: "Ohm's Law & DC Power Calculator (V, I, R, P)",
        description: 'Calculate voltage (V), current (I), resistance (Ω), and electrical power (W) from any two values.',
        href: '/science/ohms-law-calculator',
        keywords: ['ohms law', 'voltage', 'current', 'resistance', 'watts'],
      },
      {
        id: 'molarity-calculator',
        name: 'Molarity, Solution Mass & Dilution Calculator',
        description: 'Calculate molar concentration (M = mol ÷ L), required solute grams, or C₁V₁ = C₂V₂ stock dilutions.',
        href: '/science/molarity-calculator',
        keywords: ['molarity', 'moles', 'concentration', 'chemistry'],
      },
    ],
  },
  {
    id: 'retirement-and-super',
    title: 'Retirement & Super Calculators',
    subtitle: '401(k) employer match, Roth vs. Traditional, IRS RMDs, Safe Withdrawal Rate, and FIRE.',
    href: '/retirement-and-super',
    headerBg: 'bg-[#ECFDF5]',
    iconBg: 'bg-[#16856B]',
    iconColor: 'text-white',
    iconName: 'retirement',
    layout: 'list',
    calculators: [
      {
        id: 'ret-401k-calculator',
        name: '401(k) Retirement & Employer Match Calculator',
        description: 'Project your 401(k) balance with employer match caps, IRS limits, and inflation adjustment.',
        href: '/finance/401k-calculator',
        keywords: ['401k', 'employer match', 'retirement savings', 'catch up'],
      },
      {
        id: 'ret-roth-vs-traditional',
        name: 'Roth vs. Traditional Retirement Calculator',
        description: 'Compare pre-tax Traditional vs. post-tax Roth retirement wealth across marginal brackets.',
        href: '/finance/roth-vs-traditional-calculator',
        keywords: ['roth vs traditional', 'roth ira', 'roth 401k'],
      },
      {
        id: 'ret-rmd-calculator',
        name: 'Required Minimum Distribution (RMD) Calculator',
        description: 'Calculate mandatory annual withdrawals under IRS Publication 590-B Uniform Lifetime tables.',
        href: '/finance/rmd-calculator',
        keywords: ['rmd', 'required minimum distribution', 'secure 2.0'],
      },
      {
        id: 'ret-safe-withdrawal-rate',
        name: 'Safe Withdrawal Rate (4% Rule) Calculator',
        description: 'Simulate retirement portfolio longevity across 20–40 years with inflation-adjusted withdrawals.',
        href: '/finance/safe-withdrawal-rate-calculator',
        keywords: ['safe withdrawal rate', '4% rule', 'trinity study', 'swr'],
      },
      {
        id: 'ret-fire-forecaster',
        name: 'FIRE Forecaster & Financial Independence Calculator',
        description: 'Calculate your FIRE target nest egg, savings rate, and years to early retirement.',
        href: '/fire-forecaster',
        keywords: ['fire calculator', 'lean fire', 'fat fire', 'retire early'],
      },
    ],
  },
];

const WHICH_DIRECTORY_CATEGORY_GUIDE = [
  {
    title: 'Math vs. Science vs. Unit Conversions',
    summary:
      'Choose Math Calculators for percentages, fractions, ratios, averages, and algebraic equations. Choose Science Calculators when solving physical laws like F = m × a, V = I × R, density, or chemical molarity. Choose Unit Conversions when translating a known measurement between Metric and US Imperial units (such as meters to feet, kg to lbs, or cups to grams).',
    recommendedHref: '/math',
    recommendedLabel: 'Explore Math Calculators',
  },
  {
    title: 'Personal Finance vs. Business vs. Retirement',
    summary:
      'Choose Finance & Tax Calculators for mortgages, personal loans, compound interest, and country-specific net salary or tax returns. Choose Business Calculators when setting product selling prices (gross margin vs. markup), finding break-even unit volume, or filing Schedule SE contractor taxes. Choose Retirement Calculators for 401(k) matching, Roth vs. Traditional comparisons, RMDs, and 4% safe withdrawal planning.',
    recommendedHref: '/finance',
    recommendedLabel: 'Explore Finance Calculators',
  },
  {
    title: 'Date & Time vs. Health & Fitness vs. Home & Construction',
    summary:
      'Choose Date & Time Calculators for calendar date differences, adding business days, chronological age, work timesheets, and 24-hour military time. Choose Health & Fitness for BMI, TDEE daily calories, resting BMR, U.S. Navy body fat %, and ideal weight. Choose Home & Construction for concrete slab cubic yards, flooring box counts with waste allowance, and home affordability.',
    recommendedHref: '/date-time',
    recommendedLabel: 'Explore Date & Time Calculators',
  },
];

const DIRECTORY_FAQS = [
  {
    q: 'How do I calculate a percentage of a number or percentage change?',
    a: 'To find X% of Y, multiply Y by (X ÷ 100). To find percentage increase or decrease from an original value to a new value, compute ((New − Original) ÷ |Original|) × 100. Open our Percentage Calculator or Percentage Change Calculator for instant step-by-step solutions.',
  },
  {
    q: 'How is a monthly mortgage payment (PITI) calculated?',
    a: 'Monthly Principal & Interest uses M = P × [r(1 + r)^n] ÷ [(1 + r)^n − 1], where P is loan principal, r is monthly interest rate (annual rate ÷ 12), and n is total monthly payments. Add monthly property tax, homeowners insurance, and HOA/PMI for full PITI.',
  },
  {
    q: 'What is the difference between gross salary and net take-home pay?',
    a: 'Gross salary is your total earnings before deductions. Net take-home pay is what reaches your bank account after subtracting federal/national income tax, state or provincial tax, Social Security/National Insurance, and retirement contributions.',
  },
  {
    q: 'How do I convert millimeters to inches and kilograms to pounds?',
    a: '1 inch equals exactly 25.4 millimeters (divide mm by 25.4 to get inches). 1 kilogram equals approximately 2.20462262 pounds (divide kg by 0.45359237 to get pounds). All unit converters follow NIST SP 811 constants.',
  },
  {
    q: 'How is Body Mass Index (BMI) and daily calorie expenditure (TDEE) calculated?',
    a: 'BMI equals weight (kg) ÷ [height (m)]² (or 703 × lbs ÷ in²). Total Daily Energy Expenditure (TDEE) calculates resting Basal Metabolic Rate via the Mifflin-St Jeor equation and multiplies by your physical activity factor.',
  },
  {
    q: 'How do I calculate cubic yards of concrete and square footage for flooring?',
    a: 'Square footage equals Length (ft) × Width (ft); add 10% for flooring cut waste. For concrete slabs, multiply Length (ft) × Width (ft) × Thickness (ft) and divide by 27 to convert cubic feet into cubic yards.',
  },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function CategoryHeaderIcon({
  iconName,
  className,
}: {
  iconName: DirectoryCategoryGroup['iconName'];
  className?: string;
}) {
  switch (iconName) {
    case 'math':
      return <Calculator className={className} aria-hidden="true" />;
    case 'finance':
      return <Coins className={className} aria-hidden="true" />;
    case 'unit':
      return <ArrowLeftRight className={className} aria-hidden="true" />;
    case 'datetime':
      return <Calendar className={className} aria-hidden="true" />;
    case 'health':
      return <Heart className={className} aria-hidden="true" />;
    case 'home':
      return <Home className={className} aria-hidden="true" />;
    case 'business':
      return <BarChart3 className={className} aria-hidden="true" />;
    case 'science':
      return <FlaskConical className={className} aria-hidden="true" />;
    case 'retirement':
      return <PiggyBank className={className} aria-hidden="true" />;
  }
}

const DIRECTORY_STATE_STORAGE_KEY = 'solveit_directory_browsing_state';

export default function AllCalculatorsDirectoryClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'az' | 'za'>('default');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [isHydrated, setIsHydrated] = useState(false);

  const totalCalculatorsCount = useMemo(
    () =>
      DIRECTORY_GROUPS.reduce(
        (sum, group) => sum + group.calculators.length,
        0
      ),
    []
  );

  // Restore browsing state from URL params or sessionStorage on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlQ = params.get('q');
      const urlTopic = params.get('topic');
      const urlLetter = params.get('letter');
      const urlSort = params.get('sort') as 'default' | 'az' | 'za' | null;

      if (urlQ !== null || urlTopic !== null || urlLetter !== null || urlSort !== null) {
        if (urlQ !== null) setSearchQuery(urlQ);
        if (urlTopic !== null) setSelectedTopic(urlTopic);
        if (urlLetter !== null) setSelectedLetter(urlLetter);
        if (urlSort && ['default', 'az', 'za'].includes(urlSort)) {
          setSortOrder(urlSort);
        }
      } else {
        const raw = window.sessionStorage.getItem(DIRECTORY_STATE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.q === 'string') setSearchQuery(parsed.q);
          if (typeof parsed.topic === 'string') setSelectedTopic(parsed.topic);
          if (typeof parsed.letter === 'string') setSelectedLetter(parsed.letter);
          if (parsed.sort && ['default', 'az', 'za'].includes(parsed.sort)) {
            setSortOrder(parsed.sort);
          }
          if (typeof parsed.scrollY === 'number' && parsed.scrollY > 0) {
            setTimeout(() => {
              window.scrollTo({ top: parsed.scrollY, behavior: 'auto' });
            }, 40);
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
    setIsHydrated(true);
  }, []);

  // Sync filter changes to URL & sessionStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const existingRaw = window.sessionStorage.getItem(DIRECTORY_STATE_STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      window.sessionStorage.setItem(
        DIRECTORY_STATE_STORAGE_KEY,
        JSON.stringify({
          ...existing,
          q: searchQuery,
          topic: selectedTopic,
          letter: selectedLetter,
          sort: sortOrder,
        })
      );

      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (selectedTopic !== 'all') params.set('topic', selectedTopic);
      if (selectedLetter !== 'All') params.set('letter', selectedLetter);
      if (sortOrder !== 'default') params.set('sort', sortOrder);
      const qs = params.toString();
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${qs ? `?${qs}` : ''}`
      );
    } catch {
      // Ignore storage errors
    }
  }, [searchQuery, selectedTopic, selectedLetter, sortOrder, isHydrated]);

  const recordScrollPosition = () => {
    try {
      window.sessionStorage.setItem(
        DIRECTORY_STATE_STORAGE_KEY,
        JSON.stringify({
          q: searchQuery,
          topic: selectedTopic,
          letter: selectedLetter,
          sort: sortOrder,
          scrollY: window.scrollY,
        })
      );
    } catch {
      // Ignore storage errors
    }
  };

  // Determine which letters have at least one calculator for clear feedback
  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    DIRECTORY_GROUPS.forEach((group) => {
      group.calculators.forEach((calc) => {
        const firstChar = calc.name.trim().charAt(0).toUpperCase();
        if (firstChar) set.add(firstChar);
      });
    });
    return set;
  }, []);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return DIRECTORY_GROUPS.filter((group) =>
      selectedTopic === 'all' ? true : group.id === selectedTopic
    )
      .map((group) => {
        const filteredCalcs = group.calculators.filter((calc) => {
          const matchesLetter =
            selectedLetter === 'All'
              ? true
              : calc.name.trim().toUpperCase().startsWith(selectedLetter);

          if (!matchesLetter) return false;
          if (!q) return true;

          return (
            calc.name.toLowerCase().includes(q) ||
            calc.description.toLowerCase().includes(q) ||
            group.title.toLowerCase().includes(q) ||
            calc.keywords.some((k) => k.toLowerCase().includes(q))
          );
        });

        const sortedCalcs = [...filteredCalcs].sort((a, b) => {
          if (sortOrder === 'az') {
            return a.name.localeCompare(b.name);
          }
          if (sortOrder === 'za') {
            return b.name.localeCompare(a.name);
          }
          return 0;
        });

        return {
          ...group,
          calculators: sortedCalcs,
        };
      })
      .filter((group) => group.calculators.length > 0);
  }, [searchQuery, selectedTopic, sortOrder, selectedLetter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedTopic('all');
    setSelectedLetter('All');
    setSortOrder('default');
    try {
      window.sessionStorage.removeItem(DIRECTORY_STATE_STORAGE_KEY);
      window.history.replaceState(null, '', window.location.pathname);
    } catch {
      // Ignore storage errors
    }
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedTopic !== 'all' ||
    selectedLetter !== 'All';

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* Top Hero Banner with Breadcrumb, H1, Intro, Search & Topic/Sort Controls */}
      <section
        aria-labelledby="all-calculators-heading"
        className="relative overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-b from-[#EAF2FF] via-[#F2F7FF] to-[#F8FAFC] pt-4 pb-7"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb: Home / All Calculators */}
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#475569]">
              <li>
                <Link
                  href="/"
                  className="text-[#2457D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#94A3B8]">
                ›
              </li>
              <li aria-current="page" className="text-[#2457D6] font-semibold">
                All Calculators
              </li>
            </ol>
          </nav>

          {/* Centered Title & Concise Introduction */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C6DBFF] text-[#2457D6] text-xs font-bold mb-2.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{totalCalculatorsCount} Verified Calculators</span>
            </div>
            <h1
              id="all-calculators-heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#152238]"
            >
              All <span className="text-[#2457D6]">Calculators</span> Directory
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-[#475569] leading-relaxed max-w-3xl mx-auto">
              Finding the right calculator starts with matching your question to the proper domain: browse our {totalCalculatorsCount} verified tools organized across Math, Finance &amp; Tax, Unit Conversions, Date &amp; Time, Health &amp; Fitness, Home &amp; Construction, Business, Science, and Retirement—or filter alphabetically and by keyword to jump straight to a live calculator with transparent formulas.
            </p>

            {/* Large Search Field */}
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              aria-label="Filter calculators in directory"
              className="mt-5 max-w-2xl mx-auto flex items-center bg-white rounded-xl border border-[#CBD5E1] shadow-xs p-1.5 focus-within:border-[#2457D6] focus-within:ring-2 focus-within:ring-[#2457D6] transition-all"
            >
              <label htmlFor="directory-search-input" className="sr-only">
                Search calculators by name or topic
              </label>
              <div className="pl-3.5 pr-2 text-[#152238] flex items-center pointer-events-none">
                <Search className="w-5 h-5" aria-hidden="true" />
              </div>
              <input
                id="directory-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculators (e.g. percentage, mortgage, TDEE, business days...)"
                className="w-full py-2 px-2 text-sm sm:text-base text-[#152238] placeholder:text-[#64748B] bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="p-1.5 mr-1 rounded-full text-[#64748B] hover:text-[#152238] hover:bg-[#F1F5F9] cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              <button
                type="submit"
                className="shrink-0 bg-[#2457D6] hover:bg-[#1D47B0] text-white font-semibold text-sm sm:text-base px-6 py-2 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
              >
                Search
              </button>
            </form>

            {/* Simple Filters: Select Topic & Sort by Calculator Name */}
            <div className="mt-3.5 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="relative flex items-center">
                <ClipboardList
                  className="w-4 h-4 text-[#152238] dark:text-[#F8FAFC] absolute left-3.5 pointer-events-none z-10"
                  aria-hidden="true"
                />
                <label htmlFor="topic-filter-select" className="sr-only">
                  Filter by topic
                </label>
                <select
                  id="topic-filter-select"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-white dark:bg-[#0F172A] rounded-xl border border-[#CBD5E1] dark:border-[#334155] pl-10 pr-8 py-2.5 text-sm font-semibold text-[#152238] dark:text-[#F8FAFC] shadow-2xs focus:border-[#2457D6] focus:outline-none focus:ring-2 focus:ring-[#2457D6] cursor-pointer"
                >
                  <option value="all">All Topics ({totalCalculatorsCount})</option>
                  {DIRECTORY_GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({g.calculators.length})
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative flex items-center">
                <ArrowUpDown
                  className="w-4 h-4 text-[#152238] dark:text-[#F8FAFC] absolute left-3.5 pointer-events-none z-10"
                  aria-hidden="true"
                />
                <label htmlFor="sort-order-select" className="sr-only">
                  Sort calculators
                </label>
                <select
                  id="sort-order-select"
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as 'default' | 'az' | 'za')
                  }
                  className="w-full bg-white dark:bg-[#0F172A] rounded-xl border border-[#CBD5E1] dark:border-[#334155] pl-10 pr-8 py-2.5 text-sm font-semibold text-[#152238] dark:text-[#F8FAFC] shadow-2xs focus:border-[#2457D6] focus:outline-none focus:ring-2 focus:ring-[#2457D6] cursor-pointer"
                >
                  <option value="default">Sort by: Category Order</option>
                  <option value="az">Sort by: Name (A to Z)</option>
                  <option value="za">Sort by: Name (Z to A)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alphabetical Index A-Z Bar & Quick Category Filter Pills */}
      <section
        aria-label="Browse calculators alphabetically or by category"
        className="bg-white border-b border-[#E2E8F0]"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-sm font-bold text-[#152238] mr-1.5">
              Browse by name:
            </span>

            <button
              type="button"
              onClick={() => setSelectedLetter('All')}
              aria-pressed={selectedLetter === 'All'}
              className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                selectedLetter === 'All'
                  ? 'bg-[#2457D6] text-white border-[#2457D6] shadow-2xs'
                  : 'bg-[#F8FAFC] text-[#152238] border-[#E2E8F0] hover:border-[#2457D6]'
              }`}
            >
              All
            </button>

            {ALPHABET.map((letter) => {
              const isSelected = selectedLetter === letter;
              const hasTools = availableLetters.has(letter);
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  aria-pressed={isSelected}
                  aria-label={`Filter calculators starting with ${letter}`}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                    isSelected
                      ? 'bg-[#2457D6] text-white border-[#2457D6]'
                      : hasTools
                      ? 'bg-white text-[#152238] border-[#E2E8F0] hover:border-[#2457D6] hover:text-[#2457D6]'
                      : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Quick Category Pills to jump or filter any category */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#F1F5F9]">
            <span className="text-xs font-bold text-[#475569] mr-1">
              Categories:
            </span>
            <button
              type="button"
              onClick={() => setSelectedTopic('all')}
              aria-pressed={selectedTopic === 'all'}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                selectedTopic === 'all'
                  ? 'bg-[#2457D6] text-white border-[#2457D6]'
                  : 'bg-[#F8FAFC] text-[#152238] border-[#E2E8F0] hover:border-[#2457D6] hover:text-[#2457D6]'
              }`}
            >
              All Categories ({totalCalculatorsCount})
            </button>
            {DIRECTORY_GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedTopic(group.id)}
                aria-pressed={selectedTopic === group.id}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  selectedTopic === group.id
                    ? 'bg-[#2457D6] text-white border-[#2457D6]'
                    : 'bg-[#F8FAFC] text-[#152238] border-[#E2E8F0] hover:border-[#2457D6] hover:text-[#2457D6]'
                }`}
              >
                {group.title.replace(' Calculators', '')} ({group.calculators.length})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Directory Content */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-8">
        {/* "Which calculator category should I use?" Guide */}
        <section
          aria-labelledby="which-directory-category-heading"
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-5 sm:p-6"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#2457D6] flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="which-directory-category-heading"
                className="text-base sm:text-lg font-extrabold text-[#152238]"
              >
                Which Calculator Category Should I Use?
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Compare how our 9 specialized hubs divide formulas so you pick the exact tool for your calculation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WHICH_DIRECTORY_CATEGORY_GUIDE.map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-[#152238]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#E2E8F0]">
                  <Link
                    href={item.recommendedHref}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2457D6] hover:underline"
                  >
                    <span>{item.recommendedLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Filter Banner if user filtered by letter, topic, or search */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm">
            <div className="text-[#475569]">
              Showing directory results
              {selectedTopic !== 'all' && (
                <>
                  {' '}
                  in{' '}
                  <strong className="text-[#152238]">
                    {DIRECTORY_GROUPS.find((g) => g.id === selectedTopic)?.title}
                  </strong>
                </>
              )}
              {selectedLetter !== 'All' && (
                <>
                  {' '}
                  starting with{' '}
                  <strong className="text-[#152238]">{selectedLetter}</strong>
                </>
              )}
              {searchQuery.trim() && (
                <>
                  {' '}
                  matching{' '}
                  <strong className="text-[#152238]">
                    &ldquo;{searchQuery.trim()}&rdquo;
                  </strong>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-semibold text-[#2457D6] hover:underline cursor-pointer"
            >
              Reset directory filters
            </button>
          </div>
        )}

        {/* Directory Grid of All Categories and All Calculators */}
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {filteredGroups.map((group) => (
              <section
                key={group.id}
                id={`category-${group.id}`}
                aria-labelledby={`group-heading-${group.id}`}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden flex flex-col"
              >
                {/* Category Group Header */}
                <div
                  className={`${group.headerBg} px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl ${group.iconBg} ${group.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
                    >
                      <CategoryHeaderIcon
                        iconName={group.iconName}
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2
                          id={`group-heading-${group.id}`}
                          className="text-base sm:text-lg font-extrabold text-[#152238] leading-snug"
                        >
                          <Link
                            href={group.href}
                            className="hover:text-[#2457D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
                          >
                            {group.title}
                          </Link>
                        </h2>
                        <span className="text-[11px] font-bold text-[#2457D6] bg-white/90 border border-[#CBD5E1] px-2 py-0.5 rounded-full">
                          {group.calculators.length}{' '}
                          {group.calculators.length === 1 ? 'Tool' : 'Tools'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#475569] truncate">
                        {group.subtitle}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={group.href}
                    aria-label={`Open ${group.title} category page`}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2457D6] hover:text-[#1D47B0] hover:underline shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded px-1 py-0.5"
                  >
                    <span>Category Hub</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>

                {/* All Calculators Inside This Category */}
                <ul className="divide-y divide-[#F1F5F9]">
                  {group.calculators.map((calc) => (
                    <li key={calc.id}>
                      <Link
                        href={calc.href}
                        onClick={recordScrollPosition}
                        className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-[#F8FAFC] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2457D6]"
                      >
                        <div className="min-w-0">
                          <span className="block text-sm font-bold text-[#152238] group-hover:text-[#2457D6] transition-colors">
                            {calc.name}
                          </span>
                          <span className="block text-xs text-[#64748B] mt-0.5 line-clamp-1">
                            {calc.description}
                          </span>
                        </div>
                        <ChevronRight
                          className="w-4 h-4 text-[#2457D6] shrink-0 group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          /* Friendly Empty State when filter or letter matches nothing */
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center">
            <h2 className="text-lg font-bold text-[#152238]">
              No calculators match your current filter
            </h2>
            <p className="mt-1 text-sm text-[#475569]">
              Try selecting &ldquo;All&rdquo; in the alphabetical bar or clearing
              your search term.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2457D6] text-white text-sm font-semibold hover:bg-[#1D47B0] transition-colors cursor-pointer"
            >
              Show All Calculators
            </button>
          </div>
        )}

        {/* Matching Step-by-Step Formula Guides */}
        <section
          aria-labelledby="matching-guides-directory-heading"
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-5 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#EEF4FF] text-[#2457D6] flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
              </span>
              <div>
                <h2
                  id="matching-guides-directory-heading"
                  className="text-base sm:text-lg font-extrabold text-[#152238]"
                >
                  Matching Step-by-Step Formula Guides ({GUIDES_DATA.length} Guides)
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Learn the underlying equations, worked examples, and common mistakes behind our calculators.
                </p>
              </div>
            </div>

            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2457D6] hover:text-[#1D47B0] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
            >
              <span>Browse All Formula Guides</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {GUIDES_DATA.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="flex flex-col justify-between p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#2457D6] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#2457D6] mb-1">
                    {guide.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#152238] group-hover:text-[#2457D6] leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                    {guide.heroIntro}
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#2457D6]">
                  <span>Read guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Frequently Asked Questions with Visible Answers */}
        <section
          id="faq"
          aria-labelledby="directory-faq-heading"
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#2457D6]" aria-hidden="true" />
            <div>
              <h2
                id="directory-faq-heading"
                className="text-base sm:text-lg font-extrabold text-[#152238]"
              >
                Frequently Asked Questions About Online Calculators &amp; Formulas
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                Visible answers to the most-searched math, finance, conversion, health, and construction formulas.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {DIRECTORY_FAQS.map((faq) => (
              <div
                key={faq.q}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5"
              >
                <h3 className="text-xs sm:text-sm font-bold text-[#152238]">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
