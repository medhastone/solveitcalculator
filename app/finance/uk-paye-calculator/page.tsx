import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import UkPayeClient from './UkPayeClient';

export const metadata: Metadata = {
  title: 'UK PAYE Tax Calculator (2025/26 & 2024/25 HMRC Income Tax & NI) | SolveItCalculator',
  description:
    'Calculate UK take-home pay per year, month, and week under HMRC 2025/26 & 2024/25 rules. Includes £12,570 Personal Allowance taper above £100,000, Scottish vs rUK tax bands, Class 1 National Insurance (8%/2%), pension sacrifice, and Student Loan Plans 1, 2, 4, 5 & Postgrad.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/uk-paye-calculator',
  },
  openGraph: {
    title: 'UK PAYE Tax Calculator (2025/26 & 2024/25 HMRC Income Tax & NI) | SolveItCalculator',
    description: 'Calculate UK take-home pay per year, month, and week under HMRC 2025/26 & 2024/25 rules. Includes £12,570 Personal Allowance taper above £100,000, Scottish vs rUK tax bands, Class 1 National Insurance (8%/2%), pension sacrifice, and Student Loan Plans 1, 2, 4, 5 & Postgrad.',
    url: 'https://solveitcalculator.com/finance/uk-paye-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK PAYE Tax Calculator (2025/26 & 2024/25 HMRC Income Tax & NI) | SolveItCalculator',
    description: 'Calculate UK take-home pay per year, month, and week under HMRC 2025/26 & 2024/25 rules. Includes £12,570 Personal Allowance taper above £100,000, Scottish vs rUK tax bands, Class 1 National Insurance (8%/2%), pension sacrifice, and Student Loan Plans 1, 2, 4, 5 & Postgrad.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'uk-paye-calculator',
  slug: 'uk-paye-calculator',
  name: 'UK PAYE Calculator',
  h1: 'UK PAYE Income Tax & National Insurance Calculator (2025/26)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance',
  canonicalUrl: 'https://solveitcalculator.com/finance/uk-paye-calculator',
  shortAnswer:
    'Calculate your UK PAYE net take-home salary per year, month, and week using official GOV.UK / HMRC schedules. Supports England/Wales/NI and Scottish tax bands, the £100,000 Personal Allowance taper, Class 1 National Insurance (8% / 2%), pension relief methods, and Student Loan plans.',
  formula: {
    equation: 'Net = Gross − Pension − Tax_{HMRC}(AdjustedNet − PA) − NI_{Class1} − StudentLoan',
    description:
      'Applies the £12,570 standard Personal Allowance (tapered by £1 for every £2 above £100,000 adjusted net income), progressive HMRC or Revenue Scotland income tax bands, and Class 1 Employee National Insurance (8% from £12,570 to £50,270; 2% above £50,270).',
    variables: [
      { symbol: 'PA', name: 'Personal Allowance', unit: '£12,570', description: 'Tax-free allowance reduced to £0 at £125,140 adjusted net income.' },
      { symbol: 'NI_Class1', name: 'Employee National Insurance', unit: '8% / 2%', description: '8% on earnings between £12,570 and £50,270; 2% above £50,270.' },
      { symbol: 'StudentLoan', name: 'Student Loan Repayment', unit: '9% (6% Postgrad)', description: 'Calculated above plan-specific thresholds (Plan 1, 2, 4, 5, or Postgraduate).' },
    ],
    assumptions: [
      'Assumes standard tax code 1257L (or S1257L for Scottish taxpayers).',
      'Salary sacrifice pension contributions reduce both Income Tax and Class 1 National Insurance.',
    ],
  },
  workedExample: {
    title: '£55,000 Salary in England with 5% Salary Sacrifice Pension',
    scenario: 'A UK employee earning £55,000/yr with a 5% (£2,750) salary sacrifice pension and no student loan.',
    inputs: {
      'Gross Salary': '£55,000',
      'Pension (5% Salary Sacrifice)': '£2,750',
      'Tax Region': 'England, Wales & NI',
    },
    stepByStep: [
      'Adjusted Gross after Salary Sacrifice = £55,000 − £2,750 = £52,250.',
      'Taxable Income = £52,250 − £12,570 Personal Allowance = £39,680.',
      'Income Tax: £37,700 @ 20% (£7,540) + £1,980 @ 40% (£792) = £8,332.',
      'Class 1 NI: (£50,270 − £12,570) @ 8% (£3,016) + (£52,250 − £50,270) @ 2% (£39.60) = £3,055.60.',
      'Annual Net Take-Home Pay = £52,250 − £8,332 − £3,055.60 = £40,862.40 (£3,405.20/month).',
    ],
    finalResult: '£40,862.40/year Net (£3,405.20/month | £785.82/week)',
    interpretation: 'Using Salary Sacrifice for the 5% pension saved £1,100 in 40% Income Tax plus £55 in National Insurance.',
  },
  howToUse: [
    'Select your UK tax year (2025/26 or 2024/25) and whether you live in Scotland or the rest of the UK.',
    'Enter your annual gross salary and workplace pension contribution percentage.',
    'Select your pension relief method and any applicable Student Loan plan.',
  ],
  howItIsCalculated: [
    'Computes adjusted net income and applies the £1-for-£2 Personal Allowance taper above £100,000.',
    'Applies official GOV.UK rUK bands (20%, 40%, 45%) or Scottish 6-band rates (19% to 48%).',
    'Calculates Class 1 Employee National Insurance at 8% (£12,570–£50,270) and 2% (above £50,270).',
  ],
  whenToUse: [
    'When checking your monthly UK payslip or comparing job offers.',
    'When planning pension contributions to avoid the £100,000–£125,140 60% marginal tax trap.',
  ],
  limitations: [
    'Employer Class 1 secondary NI (15% above £5,000 in 2025/26) is paid by the employer and does not reduce employee gross pay directly.',
  ],
  sourceReference: {
    organization: 'HM Revenue & Customs (HMRC) — GOV.UK',
    standardName: 'Rates and Thresholds for Employers 2024/25 & 2025/26',
    citation: 'https://www.gov.uk/income-tax-rates',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['salary-to-hourly-calculator', 'take-home-pay-calculator', 'pay-raise-calculator'],
  relatedConversionPaths: [
    { label: 'Salary to Hourly Calculator', path: '/finance/salary-to-hourly-calculator' },
    { label: 'Take-Home Pay Calculator', path: '/finance/take-home-pay-calculator' },
    { label: 'Pay Raise Calculator', path: '/finance/pay-raise-calculator' },
  ],
  relatedGuidePaths: [
    { title: 'Canada Income Tax Calculator', path: '/finance/canada-income-tax-calculator' },
  ],
  faqs: [
    {
      question: 'What is the 60% tax trap between £100,000 and £125,140 in the UK?',
      answer:
        'Once your adjusted net income exceeds £100,000, your £12,570 Personal Allowance shrinks by £1 for every £2 earned. Because you pay 40% Higher Rate tax on the new income AND lose £0.50 of tax-free allowance (taxed at 40% = 20%), your effective marginal income tax rate is 60% (+2% NI = 62%) between £100,000 and £125,140.',
    },
  ],
};

export default function UkPayePage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA} currencySymbol="£">
      <UkPayeClient />
    </CalculatorPageSystem>
  );
}
