import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import TakeHomeInHandClient from '@/components/calculator/TakeHomeInHandClient';

export const metadata: Metadata = {
  title: 'In-Hand Salary Calculator India (CTC to Monthly Take-Home FY 2025-26) | SolveItCalculator',
  description:
    'Convert your Indian annual CTC into exact monthly in-hand salary. Includes Basic %, HRA, Special Allowance, 12% EPF (full Basic vs ₹15,000 ceiling toggle), Gratuity, State Professional Tax, and FY 2025-26 TDS.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/in-hand-salary-calculator',
  },
  openGraph: {
    title: 'In-Hand Salary Calculator India (CTC to Monthly Take-Home FY 2025-26) | SolveItCalculator',
    description: 'Convert your Indian annual CTC into exact monthly in-hand salary. Includes Basic %, HRA, Special Allowance, 12% EPF (full Basic vs ₹15,000 ceiling toggle), Gratuity, State Professional Tax, and FY 2025-26 TDS.',
    url: 'https://solveitcalculator.com/finance/in-hand-salary-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'In-Hand Salary Calculator India (CTC to Monthly Take-Home FY 2025-26) | SolveItCalculator',
    description: 'Convert your Indian annual CTC into exact monthly in-hand salary. Includes Basic %, HRA, Special Allowance, 12% EPF (full Basic vs ₹15,000 ceiling toggle), Gratuity, State Professional Tax, and FY 2025-26 TDS.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'in-hand-salary-calculator',
  slug: 'in-hand-salary-calculator',
  name: 'In-Hand Salary Calculator (India CTC)',
  h1: 'India CTC to Monthly In-Hand Salary Calculator (FY 2025–26)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'salary',
  subcategoryName: 'Salary & Payroll',
  subcategoryPath: '/finance/salary',
  canonicalUrl: 'https://solveitcalculator.com/finance/in-hand-salary-calculator',
  shortAnswer:
    'Convert your annual Cost to Company (CTC) into exact monthly in-hand salary after subtracting Employer & Employee EPF (12% of Basic or capped at ₹1,800/mo), Gratuity (4.81%), State Professional Tax, and Income Tax TDS.',
  formula: {
    equation: 'InHand = CTC − PF_{Employer} − Gratuity − PF_{Employee} − PT_{State} − TDS_{New/Old}',
    description:
      'Breaks down CTC into Gross Salary (Basic + HRA + Special Allowance) and deducts Employee Provident Fund (EPFO 12%), State Professional Tax (up to ₹2,500/yr under Art. 276(2)), and Section 192 TDS.',
    variables: [
      { symbol: 'EPF', name: 'Employees’ Provident Fund', unit: '12% of Basic (or ₹1,800/mo cap)', description: 'Both employer and employee contribute 12% of Basic; statutory wage ceiling is ₹15,000/mo.' },
      { symbol: 'PT', name: 'State Professional Tax', unit: '₹0 to ₹2,500/year', description: 'State-level payroll tax in Maharashtra, Karnataka, Tamil Nadu, Telangana, West Bengal, and Gujarat.' },
    ],
    assumptions: ['Uses the verified FY 2025-26 and FY 2024-25 India Income Tax engine (#37) and HRA engine (#38) to compute exact monthly TDS.'],
  },
  workedExample: {
    title: '₹18,00,000 CTC in Maharashtra (40% Basic, New Regime)',
    scenario: 'Software engineer with ₹18,00,000 annual CTC, 40% Basic (₹7.2L), uncapped 12% PF, and Gratuity included in CTC.',
    inputs: { 'Annual CTC': '₹18,00,000', 'Basic Salary (40%)': '₹7,20,000', 'State': 'Maharashtra (₹2,500 PT)' },
    stepByStep: [
      'Employer PF (12% of ₹7.2L) = ₹86,400; Gratuity (4.81% of ₹7.2L) = ₹34,632 -> Gross Salary = ₹16,78,968.',
      'Employee PF = ₹86,400; Maharashtra PT = ₹2,500; FY 2025-26 New Regime TDS = ₹1,25,356.',
      'Annual Net In-Hand = ₹14,64,712 -> Monthly In-Hand Salary = ₹1,22,059/month.',
    ],
    finalResult: '₹1,22,059/month Net In-Hand Salary (₹14,64,712/year)',
    interpretation: 'Enabling the ₹15,000 EPFO statutory ceiling toggle reduces PF deductions to ₹1,800/mo and increases immediate monthly cash in hand.',
  },
  howToUse: ['Enter your annual CTC and adjust the Basic % and HRA % sliders.', 'Toggle whether your employer caps EPF at ₹1,800/month (₹15,000 wage ceiling) and includes Gratuity inside CTC.', 'Select your state for Professional Tax and compare New vs Old Regime TDS.'],
  howItIsCalculated: ['Integrates the #37 India Income Tax and #38 HRA Exemption engines with EPFO and State Professional Tax schedules.'],
  whenToUse: ['When evaluating an Indian campus placement or lateral offer letter stated in LPA (Lakhs Per Annum).'],
  limitations: ['Variable performance bonuses or ESOP vestings included in CTC are paid according to company vesting schedules.'],
  sourceReference: {
    organization: 'EPFO, State Commercial Tax Departments & CBDT India',
    standardName: 'EPF Scheme 1952 (Para 26A ₹15,000 Ceiling) & Income Tax Act Sec 192',
    citation: 'https://www.epfindia.gov.in/',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['sip-calculator', 'fd-calculator'],
  relatedConversionPaths: [
    { label: 'India Income Tax Calculator', path: '/finance/india-income-tax-calculator' },
    { label: 'HRA Exemption Calculator', path: '/finance/hra-exemption-calculator' },
    { label: 'Take-Home Pay Calculator (US)', path: '/finance/take-home-pay-calculator' },
  ],
  relatedGuidePaths: [{ title: 'SIP Calculator', path: '/compound-interest-calculator' }],
  faqs: [
    {
      question: 'Is Employee PF mandatory at 12% of full Basic Salary or capped at ₹1,800/month?',
      answer: 'Under the EPF Scheme, 1952, the statutory wage ceiling is ₹15,000/month, which makes the mandatory minimum PF contribution 12% of ₹15,000 = ₹1,800/month. Many private employers deduct 12% of full Basic Salary by default, which builds a larger tax-free retirement corpus but reduces monthly in-hand pay.',
    },
  ],
};

export default function InHandSalaryPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA} currencySymbol="₹">
      <TakeHomeInHandClient initialMode="india" />
    </CalculatorPageSystem>
  );
}
