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
  Percent,
  Tag,
  Clock,
  Star,
  ArrowUpDown,
  ClipboardList,
  BookOpen,
  X,
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
    | 'retirement'
    | 'guides';
  layout: 'list' | 'compact-grid';
  calculators: DirectoryCalculatorItem[];
}

export const DIRECTORY_GROUPS: DirectoryCategoryGroup[] = [
  {
    id: 'math',
    title: 'Math Calculators',
    subtitle: 'Basic math, percentages, fractions, ratios, algebra and more.',
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
        description: 'Calculate percentage, find the value or percent.',
        href: '/math/percentage-calculator',
        keywords: ['percent', 'percentage', 'rate', 'value'],
      },
      {
        id: 'fraction-calculator',
        name: 'Fraction Calculator',
        description: 'Add, subtract, multiply and divide fractions.',
        href: '/math/fraction-calculator',
        keywords: ['fraction', 'numerator', 'denominator', 'simplify'],
      },
      {
        id: 'ratio-calculator',
        name: 'Ratio Calculator',
        description: 'Simplify ratios and compare quantities.',
        href: '/math/ratio-calculator',
        keywords: ['ratio', 'proportion', 'scale', 'compare'],
      },
      {
        id: 'average-calculator',
        name: 'Average Calculator',
        description: 'Find mean, median, mode and range.',
        href: '/math/average-calculator',
        keywords: ['average', 'mean', 'median', 'mode', 'range'],
      },
      {
        id: 'scientific-calculator',
        name: 'Scientific Calculator',
        description: 'Advanced calculations with trigonometry and more.',
        href: '/math/scientific-calculator',
        keywords: ['scientific', 'trigonometry', 'algebra', 'log', 'exponent'],
      },
      {
        id: 'percentage-change-calculator',
        name: 'Percentage Change Calculator',
        description: 'Find the percentage increase or decrease between two values.',
        href: '/math/percentage-change-calculator',
        keywords: ['percentage change', 'increase', 'decrease', 'growth'],
      },
      {
        id: 'discount-calculator',
        name: 'Discount Calculator',
        description: 'Find the final price after a percentage discount and money saved.',
        href: '/math/discount-calculator',
        keywords: ['discount', 'sale price', 'percent off', 'markdown'],
      },
      {
        id: 'square-root-calculator',
        name: 'Square Root Calculator',
        description: 'Find the square root of a number and solve related problems.',
        href: '/math/square-root-calculator',
        keywords: ['square root', 'radical', 'nth root', 'geometry'],
      },
      {
        id: 'exponent-calculator',
        name: 'Exponent Calculator',
        description: 'Calculate powers, exponents and scientific notation.',
        href: '/math/exponent-calculator',
        keywords: ['exponent', 'power', 'scientific notation'],
      },
      {
        id: 'absolute-value-calculator',
        name: 'Absolute Value Calculator',
        description: 'Find the absolute value of a number and distance between values.',
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
        id: 'matrix-calculator',
        name: 'Matrix Calculator',
        description: 'Perform matrix operations like addition, multiplication and determinant.',
        href: '/math/matrix-calculator',
        keywords: ['matrix', 'determinant', 'inverse', 'linear algebra'],
      },
      {
        id: 'equation-solver',
        name: 'Equation Solver',
        description: 'Solve linear and quadratic equations step by step.',
        href: '/math/equation-solver',
        keywords: ['equation solver', 'algebra', 'quadratic', 'linear'],
      },
      {
        id: 'fraction-to-decimal-calculator',
        name: 'Fraction to Decimal & Percent Converter',
        description: 'Convert proper, improper, or mixed fractions into decimals and percentages.',
        href: '/math/fraction-to-decimal-calculator',
        keywords: ['fraction to decimal', 'convert fraction', 'decimal'],
      },
      {
        id: 'proportion-calculator',
        name: 'Proportion & Cross-Multiplication Calculator',
        description: 'Solve for the unknown variable X in two equal fractions (A/B = C/X).',
        href: '/math/proportion-calculator',
        keywords: ['proportion', 'cross multiply', 'equivalent ratio'],
      },
      {
        id: 'quadratic-equation-calculator',
        name: 'Quadratic Equation Solver',
        description: 'Solve ax² + bx + c = 0 using the quadratic formula and discriminant.',
        href: '/math/quadratic-equation-calculator',
        keywords: ['quadratic formula', 'roots', 'discriminant', 'vertex'],
      },
      {
        id: 'percentage-to-decimal-calculator',
        name: 'Percentage to Decimal Calculator',
        description: 'Convert any percentage value into its exact decimal form.',
        href: '/math/percentage-to-decimal-calculator',
        keywords: ['percentage to decimal', 'convert percent', 'decimal'],
      },
      {
        id: 'percentage-to-fraction-calculator',
        name: 'Percentage to Fraction Calculator',
        description: 'Convert any percentage into a simplified fraction or mixed number.',
        href: '/math/percentage-to-fraction-calculator',
        keywords: ['percentage to fraction', 'lowest terms', 'fraction'],
      },
      {
        id: 'percent-error-calculator',
        name: 'Percent Error Calculator',
        description: 'Compare experimental measurements against theoretical values.',
        href: '/math/percent-error-calculator',
        keywords: ['percent error', 'experimental', 'theoretical', 'accuracy'],
      },
      {
        id: 'log-calculator',
        name: 'Logarithm Calculator (log₁₀, ln & Base-b)',
        description: 'Calculate common, natural, and custom-base logarithms.',
        href: '/math/log-calculator',
        keywords: ['logarithm', 'log', 'ln', 'natural log'],
      },
      {
        id: 'mean-median-mode-calculator',
        name: 'Mean, Median, Mode & Range Calculator',
        description: 'Calculate statistical mean, median, mode, sum, and spread.',
        href: '/math/mean-median-mode-calculator',
        keywords: ['mean', 'median', 'mode', 'range', 'statistics'],
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance Calculators',
    subtitle: 'Loans, mortgages, interest, taxes, salary, retirement and more.',
    href: '/finance',
    headerBg: 'bg-[#ECFDF5]',
    iconBg: 'bg-[#F59E0B]',
    iconColor: 'text-white',
    iconName: 'finance',
    layout: 'list',
    calculators: [
      {
        id: 'salary-calculator',
        name: 'Country-Specific Salary & Take-Home Pay Calculator (US, UK, CA, AU, IN)',
        description:
          'Estimate gross-to-net take-home pay for the US, UK, Canada, Australia, and India with official tax brackets, statutory deductions, and assumptions.',
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
        name: 'Loan Payment Calculator',
        description: 'Estimate monthly payments, total interest, and amortization schedule.',
        href: '/loan-calculator',
        keywords: ['loan', 'payment', 'emi', 'monthly', 'borrow'],
      },
      {
        id: 'interest-calculator',
        name: 'Interest & Compound Growth Calculator',
        description: 'Calculate simple or compound interest with monthly contributions.',
        href: '/compound-interest-calculator',
        keywords: ['interest', 'compound', 'simple', 'savings', 'apy'],
      },
      {
        id: 'discount-calculator-finance',
        name: 'Discount Calculator',
        description: 'Find the final price and savings after a discount.',
        href: '/math/discount-calculator',
        keywords: ['discount', 'sale', 'price', 'percent off', 'savings'],
      },
      {
        id: 'mortgage-calculator',
        name: 'Mortgage & Loan Affordability Calculator',
        description: 'Calculate monthly principal, interest, taxes, insurance, and PMI.',
        href: '/mortgage-calculator',
        keywords: ['affordability', 'mortgage', 'home loan', 'piti', 'pmi'],
      },
      {
        id: '401k-calculator',
        name: '401(k) Retirement & Investment Return Calculator',
        description: 'Project 401(k) balance with employer match caps and IRS limits.',
        href: '/finance/401k-calculator',
        keywords: ['investment', 'return', 'retirement', '401k', 'employer match'],
      },
      {
        id: 'roth-vs-traditional-calculator',
        name: 'Roth vs. Traditional Calculator',
        description: 'Compare after-tax retirement wealth between Traditional and Roth accounts.',
        href: '/finance/roth-vs-traditional-calculator',
        keywords: ['roth', 'traditional', 'ira', '401k', 'tax comparison'],
      },
      {
        id: 'rmd-calculator',
        name: 'Required Minimum Distribution (RMD) Calculator',
        description: 'Calculate mandatory annual retirement withdrawals using IRS tables.',
        href: '/finance/rmd-calculator',
        keywords: ['rmd', 'required minimum distribution', 'irs', 'retirement'],
      },
      {
        id: 'fire-forecaster',
        name: 'FIRE Forecaster & Safe Withdrawal Calculator',
        description: 'Calculate your Financial Independence target number and 4% rule longevity.',
        href: '/fire-forecaster',
        keywords: ['fire', 'financial independence', 'safe withdrawal rate', '4% rule'],
      },
      {
        id: 'us-federal-income-tax-calculator',
        name: 'US Federal Income Tax Calculator',
        description: 'Estimate federal tax liability, effective and marginal rates, and refund.',
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
        id: 'self-employment-tax-calculator',
        name: 'Self-Employment Tax Calculator',
        description: 'Compute 15.3% Social Security and Medicare SE tax and quarterly estimates.',
        href: '/finance/self-employment-tax-calculator',
        keywords: ['self employment tax', '1099', 'schedule se', 'freelance'],
      },
      {
        id: 'capital-gains-tax-calculator',
        name: 'Capital Gains Tax Calculator (US)',
        description: 'Calculate short-term and long-term capital gains tax and 3.8% NIIT.',
        href: '/finance/capital-gains-tax-calculator',
        keywords: ['capital gains', 'stocks', 'real estate tax', 'niit'],
      },
      {
        id: '1099-vs-w2-calculator',
        name: '1099 Contractor vs. W-2 Employee Calculator',
        description: 'Compare after-tax take-home pay and break-even 1099 hourly rate.',
        href: '/finance/1099-vs-w2-calculator',
        keywords: ['1099 vs w2', 'contractor', 'employee', 'break even'],
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
        name: 'Take-Home Pay Calculator',
        description: 'Calculate net paycheck amount after taxes, 401(k), and pre-tax deductions.',
        href: '/finance/take-home-pay-calculator',
        keywords: ['take home pay', 'net salary', 'paycheck'],
      },
      {
        id: 'investment-growth-calculator',
        name: 'Investment Growth, ROI & CAGR Calculator',
        description: 'Project long-term portfolio growth, ROI, and Compound Annual Growth Rate (CAGR).',
        href: '/finance/investment-growth-calculator',
        keywords: ['investment growth', 'roi', 'cagr', 'portfolio growth'],
      },
      {
        id: 'real-rate-of-return-calculator',
        name: 'Real Rate of Return & Inflation-Adjusted Yield Calculator',
        description: 'Calculate purchasing-power investment yield after inflation and taxes using the Fisher equation.',
        href: '/finance/real-rate-of-return-calculator',
        keywords: ['real rate of return', 'inflation', 'fisher equation', 'purchasing power'],
      },
      {
        id: 'rent-vs-buy-calculator',
        name: 'Rent vs. Buy Home Comparison Calculator',
        description: 'Compare 5-to-30 year net cost and equity build of buying a home versus renting and investing.',
        href: '/finance/rent-vs-buy-calculator',
        keywords: ['rent vs buy', 'homeownership', 'home equity'],
      },
      {
        id: 'pay-raise-calculator',
        name: 'Pay Raise & Salary Increase Calculator',
        description: 'See your new salary and additional monthly income after a raise.',
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
        description: 'Compare IRS 22% flat supplemental withholding against aggregate method.',
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
        description: 'Break down annual CTC into monthly in-hand pay after EPF, PT, and tax.',
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
    subtitle: 'Convert length, weight, volume, area, temperature, speed and digital storage.',
    href: '/conversions',
    headerBg: 'bg-[#F3EEFF]',
    iconBg: 'bg-[#7C3AED]',
    iconColor: 'text-white',
    iconName: 'unit',
    layout: 'list',
    calculators: [
      {
        id: 'recipe-converter',
        name: 'Recipe Converter (Scale Servings & Cups to Grams)',
        description: 'Scale recipes by serving count and convert cups, spoons, and mL to grams using verified ingredient densities.',
        href: '/recipe-converter',
        keywords: ['recipe converter', 'baking', 'cups to grams', 'flour', 'sugar', 'butter', 'servings'],
      },
      {
        id: 'length-conversion',
        name: 'Length & Distance Conversion',
        description: 'Convert meters, kilometers, feet, inches, yards, and miles.',
        href: '/conversions/length',
        keywords: ['length', 'meters', 'feet', 'inches', 'kilometers', 'miles'],
      },
      {
        id: 'weight-conversion',
        name: 'Weight & Mass Conversion',
        description: 'Convert kilograms, pounds, grams, ounces, stones, and metric tons.',
        href: '/conversions/weight',
        keywords: ['weight', 'mass', 'kilograms', 'pounds', 'grams', 'ounces'],
      },
      {
        id: 'area-conversion',
        name: 'Area & Land Conversion',
        description: 'Convert square meters, square feet, acres, hectares, and square yards.',
        href: '/conversions/area',
        keywords: ['area', 'square meters', 'square feet', 'acres', 'hectares'],
      },
      {
        id: 'volume-conversion',
        name: 'Volume & Liquid Conversion',
        description: 'Convert liters, milliliters, US gallons, quarts, cups, and cubic meters.',
        href: '/conversions/volume',
        keywords: ['volume', 'liters', 'gallons', 'milliliters', 'cubic'],
      },
      {
        id: 'temperature-conversion',
        name: 'Temperature Conversion (Celsius, Fahrenheit & Kelvin)',
        description: 'Convert temperatures between Celsius (°C), Fahrenheit (°F), and Kelvin (K).',
        href: '/conversions/temperature',
        keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin'],
      },
      {
        id: 'speed-velocity-converter',
        name: 'Speed & Velocity Converter',
        description: 'Convert miles per hour (mph), kilometers per hour (km/h), m/s, and knots.',
        href: '/conversions/speed',
        keywords: ['speed', 'velocity', 'mph', 'kmh', 'knots'],
      },
      {
        id: 'cooking-measurement-converter',
        name: 'Kitchen & Cooking Unit Converter',
        description: 'Convert tablespoons, teaspoons, cups, milliliters, and fluid ounces.',
        href: '/conversions/cooking',
        keywords: ['cooking', 'kitchen', 'cups', 'tablespoons', 'teaspoons', 'ml'],
      },
      {
        id: 'fuel-economy-converter',
        name: 'Fuel Economy Converter (L/100km, MPG & km/L)',
        description: 'Convert liters per 100 km, US/UK miles per gallon (MPG), and km/L.',
        href: '/conversions/fuel-economy',
        keywords: ['fuel economy', 'mpg', 'l/100km', 'km/l'],
      },
      {
        id: 'torque-converter',
        name: 'Torque Converter (Newton-Meters to Foot-Pounds & Inch-Pounds)',
        description: 'Convert N·m, ft-lb, and in-lb for automotive and mechanical fasteners.',
        href: '/conversions/torque',
        keywords: ['torque', 'nm to ft lbs', 'inch pounds'],
      },
      {
        id: 'digital-storage-converter',
        name: 'Digital Data & Storage Converter',
        description: 'Convert bytes, kilobytes (KB), megabytes (MB), gigabytes (GB), and TB.',
        href: '/conversions/digital',
        keywords: ['digital storage', 'bytes', 'mb', 'gb', 'tb', 'data'],
      },
      {
        id: 'energy-power-converter',
        name: 'Energy & Work Unit Converter',
        description: 'Convert joules, kilojoules, calories, kilocalories, watt-hours, and kWh.',
        href: '/conversions/energy',
        keywords: ['energy', 'joules', 'calories', 'kwh', 'btu'],
      },
    ],
  },
  {
    id: 'date-time',
    title: 'Date and Time Calculators',
    subtitle: 'Date differences, exact age, time duration, workdays and deadlines.',
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
        description: 'Calculate the exact number of years, months, weeks, and days between dates.',
        href: '/date-difference-calculator',
        keywords: ['date', 'difference', 'days between', 'calendar'],
      },
      {
        id: 'age-calculator',
        name: 'Age Calculator',
        description: 'Find your exact age in years, months, weeks, and days from date of birth.',
        href: '/age-calculator',
        keywords: ['age', 'birthday', 'date of birth', 'years'],
      },
      {
        id: 'time-duration-calculator',
        name: 'Time Duration Calculator',
        description: 'Calculate elapsed hours, minutes, and seconds between two times or dates.',
        href: '/time-duration-calculator',
        keywords: ['time', 'duration', 'hours', 'minutes', 'elapsed'],
      },
      {
        id: 'time-zone-converter',
        name: 'Time Zone Converter',
        description: 'Convert time between different global time zones and UTC offsets.',
        href: '/date-time',
        keywords: ['time zone', 'utc', 'gmt', 'world clock'],
      },
      {
        id: 'workdays-calculator',
        name: 'Business Days & Working Days Calculator',
        description: 'Count working weekdays between two dates excluding Saturdays and Sundays.',
        href: '/date-difference-calculator',
        keywords: ['workdays', 'business days', 'working days', 'schedule'],
      },
      {
        id: 'add-subtract-days-calculator',
        name: 'Add or Subtract Days from a Date Calculator',
        description: 'Find the future or past calendar date after adding or subtracting days.',
        href: '/date-difference-calculator',
        keywords: ['add days', 'subtract days', 'future date', 'calendar'],
      },
      {
        id: 'work-hours-timesheet-calculator',
        name: 'Work Hours & Shift Duration Calculator',
        description: 'Calculate total shift hours and decimal payroll hours from clock times.',
        href: '/time-duration-calculator',
        keywords: ['work hours', 'timesheet', 'shift duration', 'payroll hours'],
      },
      {
        id: 'birthday-milestone-calculator',
        name: 'Next Birthday & Milestone Countdown Calculator',
        description: 'See how many days remain until your next birthday and life milestones.',
        href: '/age-calculator',
        keywords: ['next birthday', 'countdown', 'days lived', 'milestone'],
      },
      {
        id: 'project-deadline-calculator',
        name: 'Project Deadline & Day Counter',
        description: 'Plan project schedules by counting total calendar days and weekdays.',
        href: '/date-difference-calculator',
        keywords: ['project deadline', 'day counter', 'delivery date'],
      },
    ],
  },
  {
    id: 'health-fitness',
    title: 'Health and Fitness Calculators',
    subtitle: 'BMI, daily calorie needs (TDEE), BMR, body fat, ideal weight and pace.',
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
        description: 'Check your body mass index and WHO adult health range in metric or imperial.',
        href: '/bmi-calculator',
        keywords: ['bmi', 'body mass index', 'weight', 'height', 'health'],
      },
      {
        id: 'calorie-calculator',
        name: 'Daily Calorie & TDEE Calculator',
        description: 'Estimate Total Daily Energy Expenditure (TDEE) to maintain or lose weight.',
        href: '/bmi-calculator?mode=tdee',
        keywords: ['calorie', 'tdee', 'nutrition', 'diet', 'daily intake'],
      },
      {
        id: 'body-fat-percentage-calculator',
        name: 'Body Fat Percentage Calculator',
        description: 'Estimate your body fat percentage and lean body mass composition.',
        href: '/bmi-calculator?mode=body-fat',
        keywords: ['body fat', 'lean mass', 'fitness', 'composition'],
      },
      {
        id: 'ideal-weight-calculator',
        name: 'Ideal & Healthy Weight Range Calculator',
        description: 'Find the recommended healthy weight range (BMI 18.5–24.9) for your height.',
        href: '/bmi-calculator?mode=ideal-weight',
        keywords: ['ideal weight', 'healthy weight', 'target weight'],
      },
      {
        id: 'bmr-calculator',
        name: 'Basal Metabolic Rate (BMR) Calculator',
        description: 'Calculate your resting calorie burn using the Mifflin-St Jeor equation.',
        href: '/bmi-calculator?mode=bmr',
        keywords: ['bmr', 'basal metabolic rate', 'metabolism', 'calories'],
      },
      {
        id: 'weight-change-percentage-calculator',
        name: 'Weight Loss & Body Change Percentage Calculator',
        description: 'Calculate the exact percentage of body weight lost or gained over time.',
        href: '/math/percentage-change-calculator',
        keywords: ['weight loss percentage', 'body change', 'fitness progress'],
      },
      {
        id: 'chronological-age-calculator',
        name: 'Exact Chronological Age Calculator',
        description: 'Determine exact age in years, months, and days for health screenings.',
        href: '/age-calculator',
        keywords: ['chronological age', 'health age', 'exact age'],
      },
      {
        id: 'workout-duration-pace-timer',
        name: 'Workout & Interval Time Duration Calculator',
        description: 'Calculate total training session duration in hours, minutes, and seconds.',
        href: '/time-duration-calculator',
        keywords: ['workout duration', 'training time', 'interval timer'],
      },
      {
        id: 'body-weight-unit-converter',
        name: 'Body Weight & Height Unit Converter (kg/lb & cm/ft)',
        description: 'Convert body weight between kg, lbs, and stones, or height between ft and cm.',
        href: '/conversions/weight',
        keywords: ['kg to lbs', 'cm to feet', 'body weight converter'],
      },
    ],
  },
  {
    id: 'home-construction',
    title: 'Home and Construction Calculators',
    subtitle: 'Room area, concrete volume, paint coverage, roofing and home financing.',
    href: '/home-construction',
    headerBg: 'bg-[#FFFBEB]',
    iconBg: 'bg-[#D97706]',
    iconColor: 'text-white',
    iconName: 'home',
    layout: 'list',
    calculators: [
      {
        id: 'construction-project-calculator',
        name: 'Construction Project Calculator (Area, Concrete Slabs & Post Holes)',
        description:
          'Guided 4-stage workflow: enter measurements, calculate area or cubic volume, add waste allowance, and estimate material packages and cost.',
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
        name: 'Flooring Calculator (Estimate Your Flooring Project)',
        description:
          'Calculate room area, estimate flooring quantity with waste allowance, and get a material cost estimate.',
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
        id: 'area-calculator',
        name: 'Square Footage & Room Area Calculator',
        description: 'Calculate and convert room area between sq ft, sq meters, and acres.',
        href: '/conversions/area',
        keywords: ['area', 'square footage', 'room size', 'flooring'],
      },
      {
        id: 'volume-calculator',
        name: 'Cubic Volume Calculator',
        description: 'Find the volume of a space or slab in cubic feet, cubic yards, or meters.',
        href: '/conversions/volume',
        keywords: ['volume', 'cubic feet', 'cubic meters', 'capacity'],
      },
      {
        id: 'concrete-calculator',
        name: 'Concrete & Cubic Yards Volume Calculator',
        description: 'Estimate concrete quantity in cubic yards and bags for slabs and footings.',
        href: '/construction-project-calculator',
        keywords: ['concrete', 'slab', 'cement', 'bags', 'construction'],
      },
      {
        id: 'paint-calculator',
        name: 'Wall Area & Paint Coverage Calculator',
        description: 'Calculate wall surface area and gallons or liters of paint needed.',
        href: '/conversions/area',
        keywords: ['paint', 'gallons', 'wall coverage', 'renovation'],
      },
      {
        id: 'roofing-calculator',
        name: 'Roofing & Material Area Calculator',
        description: 'Estimate roofing materials, bundles, and pitch surface area.',
        href: '/home-construction',
        keywords: ['roofing', 'shingles', 'pitch', 'roof area'],
      },
      {
        id: 'home-mortgage-payment-calculator',
        name: 'Home Mortgage Payment Calculator (PITI)',
        description: 'Estimate monthly principal, interest, property taxes, and home insurance.',
        href: '/mortgage-calculator',
        keywords: ['home mortgage', 'piti', 'house payment', 'property tax'],
      },
      {
        id: 'home-affordability-calculator',
        name: 'Home Affordability Calculator (28/36 Rule)',
        description: 'Calculate the maximum house price you can afford based on income and debt.',
        href: '/finance/home-affordability-calculator',
        keywords: ['home affordability', '28/36 rule', 'how much house'],
      },
      {
        id: 'refinance-break-even-calculator',
        name: 'Mortgage Refinance & Break-Even Calculator',
        description: 'Compare your current mortgage against a new loan rate and closing costs.',
        href: '/finance/refinance-calculator',
        keywords: ['refinance', 'break even', 'closing costs', 'lower rate'],
      },
      {
        id: 'lumber-length-dimension-converter',
        name: 'Construction Length & Dimension Converter',
        description: 'Convert blueprint dimensions between inches, feet, yards, mm, cm, and meters.',
        href: '/conversions/length',
        keywords: ['lumber', 'blueprint', 'inches to feet', 'mm to inches'],
      },
      {
        id: 'flooring-waste-percentage-calculator',
        name: 'Material Overage & Waste Percentage Calculator',
        description: 'Add 10% to 15% cutting waste to tile, hardwood flooring, or drywall orders.',
        href: '/math/percentage-calculator',
        keywords: ['flooring waste', 'tile overage', 'material buffer'],
      },
    ],
  },
  {
    id: 'business',
    title: 'Business Calculators',
    subtitle: 'Gross margin, markup, profit margin, break-even point, ROI, and taxes.',
    href: '/finance/business',
    headerBg: 'bg-[#FFF1F2]',
    iconBg: 'bg-[#E11D48]',
    iconColor: 'text-white',
    iconName: 'business',
    layout: 'list',
    calculators: [
      {
        id: 'profit-margin-calculator',
        name: 'Profit Margin Calculator',
        description: 'Compute gross, operating, and net profit margins from revenue and costs.',
        href: '/finance/profit-margin-calculator',
        keywords: ['profit margin', 'net margin', 'operating margin', 'revenue'],
      },
      {
        id: 'margin-calculator',
        name: 'Gross Margin Calculator',
        description: 'Calculate gross margin percentage, unit profit, and required selling price.',
        href: '/finance/margin-calculator',
        keywords: ['gross margin', 'unit profit', 'selling price', 'cogs'],
      },
      {
        id: 'markup-calculator',
        name: 'Price Markup Calculator',
        description: 'Find selling price, dollar profit, and gross margin from cost and markup %.',
        href: '/finance/markup-calculator',
        keywords: ['markup', 'wholesale cost', 'retail price'],
      },
      {
        id: 'break-even-calculator',
        name: 'Break-Even Point Calculator',
        description: 'Find the exact sales volume in units and revenue to cover fixed costs.',
        href: '/finance/break-even-calculator',
        keywords: ['break even', 'fixed costs', 'unit price', 'contribution margin'],
      },
      {
        id: 'sales-tax-calculator',
        name: 'Payroll & Net Take-Home Pay Calculator',
        description: 'Calculate gross-to-net salary, payroll withholding, and deductions.',
        href: '/finance/take-home-pay-calculator',
        keywords: ['payroll', 'take home pay', 'net pay', 'business'],
      },
      {
        id: 'roi-calculator',
        name: 'ROI & Investment Growth Calculator',
        description: 'Calculate return on investment (ROI) and annualized compound growth (CAGR).',
        href: '/finance/investment-growth-calculator',
        keywords: ['roi', 'return on investment', 'business return', 'cagr'],
      },
      {
        id: 'gst-calculator',
        name: 'GST & Business Tax Calculator',
        description: 'Calculate goods and services tax and business tax deductions.',
        href: '/finance/us-federal-income-tax-calculator',
        keywords: ['gst', 'goods and services tax', 'tax inclusive'],
      },
      {
        id: 'business-discount-calculator',
        name: 'Promotional Discount & Markdown Calculator',
        description: 'Calculate promotional sale prices, customer savings, and net revenue.',
        href: '/math/discount-calculator',
        keywords: ['promotional discount', 'markdown', 'sale price'],
      },
      {
        id: 'business-self-employment-tax',
        name: 'Freelance & Self-Employment Tax Calculator',
        description: 'Calculate Social Security and Medicare SE taxes and quarterly IRS payments.',
        href: '/finance/self-employment-tax-calculator',
        keywords: ['freelance tax', 'self employment', 'schedule se'],
      },
      {
        id: 'business-1099-vs-w2',
        name: '1099 Contractor vs. W-2 Compensation Calculator',
        description: 'Compare net business income against salaried employment and benefits.',
        href: '/finance/1099-vs-w2-calculator',
        keywords: ['1099', 'contractor rate', 'consulting'],
      },
      {
        id: 'revenue-growth-percentage-calculator',
        name: 'Revenue & Percentage Change Calculator',
        description: 'Measure period-over-period revenue growth and expense changes.',
        href: '/math/percentage-change-calculator',
        keywords: ['revenue growth', 'yoy growth', 'percentage change'],
      },
      {
        id: 'business-loan-calculator',
        name: 'Business Loan Payment Calculator',
        description: 'Estimate monthly payments and total interest for business or equipment loans.',
        href: '/loan-calculator',
        keywords: ['business loan', 'working capital', 'equipment financing'],
      },
    ],
  },
  {
    id: 'science',
    title: 'Science Calculators',
    subtitle: 'Physics, chemistry, scientific functions, logarithms, percent error and SI units.',
    href: '/science',
    headerBg: 'bg-[#EEF4FF]',
    iconBg: 'bg-[#2457D6]',
    iconColor: 'text-white',
    iconName: 'science',
    layout: 'list',
    calculators: [
      {
        id: 'speed-calculator',
        name: 'Speed & Velocity Calculator',
        description: 'Calculate and convert speed, distance, and time across metric and imperial.',
        href: '/conversions/speed',
        keywords: ['speed', 'velocity', 'distance', 'time', 'physics'],
      },
      {
        id: 'energy-calculator',
        name: 'Energy & Work Calculator',
        description: 'Calculate and convert kinetic, thermal, and electrical energy in Joules and kWh.',
        href: '/conversions/energy',
        keywords: ['energy', 'kinetic', 'potential', 'joules', 'physics'],
      },
      {
        id: 'density-calculator',
        name: 'Density Calculator',
        description: 'Calculate density from mass and volume using ρ = m ÷ V.',
        href: '/science/density-calculator',
        keywords: ['density', 'mass', 'volume', 'chemistry', 'physics'],
      },
      {
        id: 'force-calculator',
        name: 'Force Calculator (Newton’s Second Law)',
        description: 'Calculate net force in Newtons using mass and acceleration (F = m × a).',
        href: '/science/force-calculator',
        keywords: ['force', 'newton', 'mass', 'acceleration', 'physics'],
      },
      {
        id: 'ohms-law-calculator',
        name: "Ohm's Law Calculator",
        description: 'Calculate voltage (V), current (I), resistance (R), and electrical power (W).',
        href: '/science/ohms-law-calculator',
        keywords: ['ohms law', 'voltage', 'current', 'resistance', 'watts'],
      },
      {
        id: 'molarity-calculator',
        name: 'Molarity & Solution Concentration Calculator',
        description: 'Calculate molarity (M), moles of solute, and solution volume for chemistry labs.',
        href: '/science/molarity-calculator',
        keywords: ['molarity', 'moles', 'concentration', 'chemistry'],
      },
      {
        id: 'science-scientific-calculator',
        name: 'Scientific Calculator (Trig, Logs & Constants)',
        description: 'Evaluate sin, cos, tan, logarithms, factorials, powers, and π or e.',
        href: '/math/scientific-calculator',
        keywords: ['scientific calculator', 'trigonometry', 'radians', 'degrees'],
      },
      {
        id: 'science-percent-error-calculator',
        name: 'Percent Error Calculator (Experimental vs. Theoretical)',
        description: 'Measure lab accuracy by comparing experimental and theoretical values.',
        href: '/math/percent-error-calculator',
        keywords: ['percent error', 'chemistry lab', 'physics lab', 'experimental'],
      },
      {
        id: 'science-exponent-calculator',
        name: 'Exponent & Scientific Notation Power Calculator',
        description: 'Compute positive, negative, and fractional exponents and orders of magnitude.',
        href: '/math/exponent-calculator',
        keywords: ['scientific notation', 'powers of 10', 'exponents'],
      },
      {
        id: 'science-log-calculator',
        name: 'Logarithm & pH Scale Calculator (log₁₀ & ln)',
        description: 'Calculate base-10 and natural logarithms used in pH, decibels, and half-life.',
        href: '/math/log-calculator',
        keywords: ['ph scale', 'logarithm', 'half life', 'decibels'],
      },
      {
        id: 'science-si-unit-converter',
        name: 'SI & Metric Unit Converter (Kelvin, Joules, kg, m)',
        description: 'Convert SI base and derived units for physics and chemistry equations.',
        href: '/conversions',
        keywords: ['si units', 'kelvin', 'metric converter', 'physics units'],
      },
      {
        id: 'science-quadratic-kinematics',
        name: 'Quadratic Equation & Projectile Trajectory Solver',
        description: 'Solve second-degree kinematics and chemical equilibrium equations.',
        href: '/math/quadratic-equation-calculator',
        keywords: ['projectile motion', 'kinematics', 'quadratic equilibrium'],
      },
      {
        id: 'science-square-root-calculator',
        name: 'Square Root & Radical Calculator',
        description: 'Calculate principal square roots for RMS speed and vector magnitudes.',
        href: '/math/square-root-calculator',
        keywords: ['rms speed', 'vector magnitude', 'square root'],
      },
      {
        id: 'science-statistical-analyzer',
        name: 'Experimental Data Mean, Median & Range Calculator',
        description: 'Analyze repeated lab trials by finding the sample mean, median, and spread.',
        href: '/math/mean-median-mode-calculator',
        keywords: ['lab trials', 'sample mean', 'experimental statistics'],
      },
    ],
  },
  {
    id: 'retirement-and-super',
    title: 'Retirement & Super Calculators',
    subtitle: '401(k) match, Roth vs. Traditional, RMDs, FIRE, and Safe Withdrawal Rates.',
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
        description: 'Project your 401(k) balance with employer match caps and IRS catch-up limits.',
        href: '/finance/401k-calculator',
        keywords: ['401k', 'employer match', 'retirement savings', 'catch up'],
      },
      {
        id: 'ret-roth-vs-traditional',
        name: 'Roth vs. Traditional Retirement Calculator',
        description: 'Compare pre-tax Traditional vs. post-tax Roth retirement wealth.',
        href: '/finance/roth-vs-traditional-calculator',
        keywords: ['roth vs traditional', 'roth ira', 'roth 401k'],
      },
      {
        id: 'ret-rmd-calculator',
        name: 'Required Minimum Distribution (RMD) Calculator',
        description: 'Calculate mandatory annual withdrawals under IRS Publication 590-B rules.',
        href: '/finance/rmd-calculator',
        keywords: ['rmd', 'required minimum distribution', 'secure 2.0'],
      },
      {
        id: 'ret-safe-withdrawal-rate',
        name: 'Safe Withdrawal Rate (4% Rule) Calculator',
        description: 'Simulate retirement portfolio longevity with inflation-adjusted withdrawals.',
        href: '/finance/safe-withdrawal-rate-calculator',
        keywords: ['safe withdrawal rate', '4% rule', 'trinity study', 'swr'],
      },
      {
        id: 'ret-fire-forecaster',
        name: 'FIRE Forecaster & Financial Independence Calculator',
        description: 'Calculate your FIRE target number, savings rate, and years to retirement.',
        href: '/fire-forecaster',
        keywords: ['fire calculator', 'lean fire', 'fat fire', 'retire early'],
      },
      {
        id: 'ret-compound-interest',
        name: 'Compound Interest & Nest Egg Growth Calculator',
        description: 'See how initial retirement savings and monthly deposits compound over decades.',
        href: '/compound-interest-calculator',
        keywords: ['nest egg', 'compound growth', 'retirement compound interest'],
      },
      {
        id: 'ret-pre-tax-deduction-tax',
        name: 'Pre-Tax 401(k) & Federal Tax Savings Calculator',
        description: 'See how pre-tax 401(k) and IRA contributions reduce your current tax bill.',
        href: '/finance/us-federal-income-tax-calculator',
        keywords: ['pre tax 401k', 'agi reduction', 'tax deferred'],
      },
    ],
  },
  {
    id: 'guides',
    title: 'Formula Guides & Tutorials',
    subtitle: 'Step-by-step math, finance, home, and conversion guides with worked examples.',
    href: '/guides',
    headerBg: 'bg-[#EEF4FF]',
    iconBg: 'bg-[#2457D6]',
    iconColor: 'text-white',
    iconName: 'guides',
    layout: 'list',
    calculators: GUIDES_DATA.map((guide) => ({
      id: `guide-${guide.slug}`,
      name: guide.title,
      description: guide.heroIntro,
      href: `/guides/${guide.slug}`,
      keywords: guide.keywords,
    })),
  },
];

const POPULAR_SHORTCUTS = [
  {
    name: 'Percentage Calculator',
    href: '/math/percentage-calculator',
    icon: Percent,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
  },
  {
    name: 'Age Calculator',
    href: '/age-calculator',
    icon: Calendar,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'Loan Payment Calculator',
    href: '/loan-calculator',
    icon: Home,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Unit Conversion Calculator',
    href: '/conversions',
    icon: ArrowLeftRight,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    name: 'Discount Calculator',
    href: '/math/discount-calculator',
    icon: Tag,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    name: 'BMI Calculator',
    href: '/bmi-calculator',
    icon: Heart,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'Date Difference Calculator',
    href: '/date-difference-calculator',
    icon: Calendar,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E11D48]',
  },
  {
    name: 'Time Duration Calculator',
    href: '/time-duration-calculator',
    icon: Clock,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
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
    case 'guides':
      return <BookOpen className={className} aria-hidden="true" />;
  }
}

const DIRECTORY_STATE_STORAGE_KEY = 'solveit_directory_browsing_state';

export default function AllCalculatorsDirectoryClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'az' | 'za'>('default');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [isHydrated, setIsHydrated] = useState(false);

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
        {/* Subtle Decorative Left & Right Illustrations on wide viewports */}
        <div
          aria-hidden="true"
          className="pointer-events-none hidden xl:block absolute left-10 top-12 select-none"
        >
          <div className="relative w-44 h-44">
            <div className="absolute left-6 top-6 w-28 h-36 rounded-2xl bg-[#2457D6] shadow-md p-3.5 -rotate-12 flex flex-col justify-between">
              <div className="h-6 rounded-md bg-[#93C5FD]/90 w-full" />
              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-4 rounded-xs bg-white/90" />
                <div className="h-4 rounded-xs bg-white/90" />
                <div className="h-4 rounded-xs bg-white/90" />
                <div className="h-4 rounded-xs bg-white/90" />
                <div className="h-4 rounded-xs bg-white/90" />
                <div className="h-4 rounded-xs bg-white/90" />
                <div className="h-4 rounded-xs bg-white/90" />
                <div className="h-4 rounded-xs bg-white/90" />
                <div className="h-4 rounded-xs bg-white/90" />
              </div>
            </div>
            <div className="absolute left-1 bottom-8 w-10 h-10 rounded-xl bg-[#16856B] text-white font-bold text-lg flex items-center justify-center shadow-xs -rotate-12">
              %
            </div>
            <div className="absolute right-4 top-8 w-9 h-9 rounded-full bg-[#93C5FD] text-[#152238] font-bold text-base flex items-center justify-center shadow-xs rotate-12">
              ÷
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none hidden xl:block absolute right-10 top-10 select-none"
        >
          <div className="relative w-48 h-44">
            <div className="absolute right-10 top-4 w-32 h-36 rounded-2xl bg-white border border-[#D0E1FD] shadow-md p-3.5 rotate-6 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-xs bg-[#DBEAFE] text-[#2457D6] flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  <span className="h-2.5 w-16 rounded bg-[#CBD5E1]" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-xs bg-[#DBEAFE] text-[#2457D6] flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  <span className="h-2.5 w-14 rounded bg-[#CBD5E1]" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-xs bg-[#DBEAFE] text-[#2457D6] flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  <span className="h-2.5 w-16 rounded bg-[#CBD5E1]" />
                </div>
              </div>
            </div>
            <div className="absolute right-2 bottom-3 w-16 h-22 rounded-xl bg-[#2457D6] shadow-md p-2 rotate-12 flex flex-col justify-between">
              <div className="h-4 rounded-xs bg-[#BFDBFE] w-full" />
              <div className="grid grid-cols-3 gap-1">
                <div className="h-2.5 rounded-xs bg-white/90" />
                <div className="h-2.5 rounded-xs bg-white/90" />
                <div className="h-2.5 rounded-xs bg-white/90" />
                <div className="h-2.5 rounded-xs bg-white/90" />
                <div className="h-2.5 rounded-xs bg-white/90" />
                <div className="h-2.5 rounded-xs bg-white/90" />
              </div>
            </div>
          </div>
        </div>

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
            <h1
              id="all-calculators-heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#152238]"
            >
              All <span className="text-[#2457D6]">Calculators</span>
            </h1>
            <p className="mt-2.5 text-sm sm:text-base lg:text-[17px] text-[#475569] leading-relaxed max-w-2xl mx-auto">
              Browse all available calculators. Find the right tool for your
              needs and get instant, accurate results with clear explanations.
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
                placeholder="Search calculators (e.g. percentage, loan, BMI, time...)"
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
                  <option value="all">All Topics</option>
                  {DIRECTORY_GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
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
              All Categories
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
                {group.title.replace(' Calculators', '')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Directory Content */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Active Filter Banner if user filtered by letter, topic, or search */}
        {hasActiveFilters && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm">
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
                    <span>Category Page</span>
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

        {/* Bottom Route Back to Popular Calculators and Category Landing Pages */}
        <section
          aria-labelledby="popular-calculators-strip-heading"
          className="mt-7 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F1F5F9]">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#2457D6] text-white flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 fill-current" aria-hidden="true" />
              </span>
              <h2
                id="popular-calculators-strip-heading"
                className="text-base sm:text-lg font-extrabold text-[#152238]"
              >
                Popular Calculators
              </h2>
              <span className="text-xs sm:text-sm text-[#64748B]">
                Quick access to commonly used tools.
              </span>
            </div>

            <Link
              href="/#popular-calculators"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2457D6] hover:text-[#1D47B0] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
            >
              <span>View All Popular Calculators</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {POPULAR_SHORTCUTS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#2457D6] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <span
                    className={`w-8 h-8 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold text-[#152238] group-hover:text-[#2457D6] leading-tight">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Frequently Asked Questions (Most-Asked Google Search Calculator Queries) */}
        <section
          id="faq"
          aria-labelledby="directory-faq-heading"
          className="mt-7 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-5 sm:p-6 space-y-4"
        >
          <div>
            <h2
              id="directory-faq-heading"
              className="text-base sm:text-lg font-extrabold text-[#152238]"
            >
              Frequently Asked Questions About Online Calculators &amp; Formulas
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Quick answers to the most-searched math, finance, conversion, health, and construction formulas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                q: 'How do I calculate a percentage of a number or percentage change?',
                a: 'To find X% of Y, multiply Y by (X ÷ 100). To find percentage increase or decrease from an old value to a new value, compute ((New − Old) ÷ Old) × 100. Open our Percentage Calculator for instant step-by-step solutions.',
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
              {
                q: 'How do I convert hours and minutes into decimal hours for payroll?',
                a: 'Keep the whole hours and divide minutes by 60. For example, 8 hours and 45 minutes equals 8 + (45 ÷ 60) = 8.75 decimal hours.',
              },
              {
                q: 'Are all calculators on SolveItCalculator free and mobile-friendly?',
                a: 'Yes. Every calculator in our directory is 100% free, requires no registration, shows the verified formula and worked example alongside your live output, and runs privately in your browser on desktop and mobile.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1"
              >
                <h3 className="text-xs sm:text-sm font-bold text-[#152238]">
                  {faq.q}
                </h3>
                <p className="text-xs text-[#475569] leading-relaxed">
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
