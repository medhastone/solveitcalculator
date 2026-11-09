import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import TakeHomeInHandClient from '@/components/calculator/TakeHomeInHandClient';

export const metadata: Metadata = {
  title: 'Take-Home Pay Calculator (US Paycheck & India CTC to In-Hand) | SolveItCalculator',
  description:
    'Calculate your monthly and bi-weekly take-home pay after taxes, FICA/EPF, and retirement deductions. Supports both US State Paycheck mode and India CTC-to-In-Hand mode.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/take-home-pay-calculator',
  },
  openGraph: {
    title: 'Take-Home Pay Calculator (US Paycheck & India CTC to In-Hand) | SolveItCalculator',
    description: 'Calculate your monthly and bi-weekly take-home pay after taxes, FICA/EPF, and retirement deductions. Supports both US State Paycheck mode and India CTC-to-In-Hand mode.',
    url: 'https://solveitcalculator.com/finance/take-home-pay-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Take-Home Pay Calculator (US Paycheck & India CTC to In-Hand) | SolveItCalculator',
    description: 'Calculate your monthly and bi-weekly take-home pay after taxes, FICA/EPF, and retirement deductions. Supports both US State Paycheck mode and India CTC-to-In-Hand mode.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'take-home-pay-calculator',
  slug: 'take-home-pay-calculator',
  name: 'Take-Home Pay Calculator',
  h1: 'Take-Home Pay & Net Salary Calculator (US Paycheck & India CTC)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'salary',
  subcategoryName: 'Salary & Payroll',
  subcategoryPath: '/finance/salary',
  canonicalUrl: 'https://solveitcalculator.com/finance/take-home-pay-calculator',
  shortAnswer:
    'Calculate your net take-home salary after income taxes, social security / provident fund, and benefit deductions. Includes dual engines for US Paycheck withholding and India CTC-to-In-Hand payslip calculation.',
  formula: {
    equation: 'Net_{Pay} = Gross − Retirement_{401k/EPF} − IncomeTax_{Fed/TDS} − PayrollTax_{FICA/PT}',
    description:
      'Subtracts mandatory employee retirement contributions, statutory payroll taxes, and progressive income taxes to reveal net cash credited to your bank account.',
    variables: [
      { symbol: 'Gross', name: 'Gross Salary / CTC', unit: 'USD ($) or INR (₹)', description: 'Total annual compensation package.' },
      { symbol: 'Retirement', name: '401(k) or EPF Deduction', unit: 'Pre-Tax / 12% Basic', description: 'Employee retirement deferral deducted from paycheck.' },
    ],
    assumptions: ['Uses verified 2025 IRS/FICA schedules for US mode and FY 2025-26 CBDT/EPFO schedules for India mode.'],
  },
  workedExample: {
    title: '$110,000 US Salary vs ₹18,00,000 India CTC',
    scenario: 'Calculating monthly take-home pay in California ($110k) and Mumbai (₹18L CTC).',
    inputs: { 'US Salary': '$110,000 (CA)', 'India CTC': '₹18,00,000 (Mumbai, New Regime)' },
    stepByStep: [
      'US Mode: $110,000 minus $8,600 pre-tax, $14,004 Federal tax, $8,262 FICA, and $6,668 CA tax/SDI = $72,466/yr ($6,039/mo).',
      'India Mode: ₹18,00,000 CTC minus ₹86,400 Employer PF, ₹34,632 Gratuity, ₹86,400 Employee PF, ₹2,500 PT, and ₹1,25,356 TDS = ₹14,64,712/yr (₹1,22,059/mo).',
    ],
    finalResult: '$6,039/month (US CA) | ₹1,22,059/month (India CTC)',
    interpretation: 'Switch between US Paycheck and India CTC modes at the top of the calculator.',
  },
  howToUse: ['Choose US Take-Home Paycheck or India CTC to In-Hand mode.', 'Enter your annual compensation and benefit deductions.', 'Review your monthly and annual net bank credit.'],
  howItIsCalculated: ['Combines #30/#31 US tax engines and #37/#38 India tax/HRA engines.'],
  whenToUse: ['When negotiating a job offer or auditing your monthly payslip.'],
  limitations: ['Voluntary post-tax deductions such as ESPP or gym benefits are not subtracted.'],
  sourceReference: {
    organization: 'Internal Revenue Service (IRS) & Income Tax Department of India (CBDT)',
    standardName: '2025 Statutory Payroll Withholding Schedules',
    citation: 'IRS Pub 15-T & Income Tax Act Sec 115BAC',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['us-state-take-home-calculator', 'salary-to-hourly-calculator'],
  relatedConversionPaths: [
    { label: 'In-Hand Salary Calculator (India CTC)', path: '/finance/in-hand-salary-calculator' },
    { label: 'US State Take-Home Calculator', path: '/finance/us-state-take-home-calculator' },
    { label: 'Salary to Hourly Calculator', path: '/finance/salary-to-hourly-calculator' },
  ],
  relatedGuidePaths: [{ title: 'India Income Tax Calculator', path: '/finance/india-income-tax-calculator' }],
  faqs: [
    {
      question: 'Why is my monthly in-hand salary much lower than my annual CTC divided by 12?',
      answer: 'Cost to Company (CTC) includes employer-side costs like Employer EPF (12% of Basic) and Gratuity (4.81% of Basic), plus employee deductions for Employee EPF (12% of Basic), Professional Tax, and Income Tax (TDS).',
    },
  ],
};

export default function TakeHomePayPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <TakeHomeInHandClient initialMode="us" />
    </CalculatorPageSystem>
  );
}
