import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import HraExemptionClient from './HraExemptionClient';

export const metadata: Metadata = {
  title: 'HRA Exemption Calculator (Section 10(13A) & Rule 2A Metro vs Non-Metro) | SolveItCalculator',
  description:
    'Calculate tax-exempt and taxable House Rent Allowance (HRA) under Section 10(13A) and Income Tax Rule 2A. Shows yearly and monthly breakdown and highlights which of the three statutory limits applied.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/hra-exemption-calculator',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'hra-exemption-calculator',
  slug: 'hra-exemption-calculator',
  name: 'HRA Exemption Calculator',
  h1: 'HRA Exemption Calculator (Section 10(13A) & Income Tax Rule 2A)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance/taxes',
  canonicalUrl: 'https://solveitcalculator.com/finance/hra-exemption-calculator',
  shortAnswer:
    'Calculate your tax-exempt and taxable House Rent Allowance (HRA) per month and year under Section 10(13A) and Rule 2A of the Indian Income Tax Rules (Old Tax Regime). Automatically identifies which of the three statutory limits governs your exemption.',
  formula: {
    equation: 'HRA_{Exempt} = min(HRA_{Received}, Rent − 0.10 × (Basic + DA), 0.50_{Metro} or 0.40_{NonMetro} × (Basic + DA))',
    description:
      'Under Income Tax Rule 2A, the exempt portion of HRA is the minimum of: (1) Actual HRA received, (2) Actual rent paid minus 10% of Basic + DA, or (3) 50% of Basic + DA in Delhi, Mumbai, Kolkata, or Chennai (40% in all other cities).',
    variables: [
      { symbol: 'Basic + DA', name: 'Basic Salary + Dearness Allowance', unit: 'INR (₹/year)', description: 'Annual Basic Salary plus DA forming part of retirement benefits.' },
      { symbol: 'HRA_Received', name: 'Actual HRA Received', unit: 'INR (₹/year)', description: 'Total House Rent Allowance paid by your employer.' },
      { symbol: 'Rent', name: 'Actual Rent Paid', unit: 'INR (₹/year)', description: 'Verified residential rent paid by the employee.' },
    ],
    assumptions: [
      'Section 10(13A) HRA exemption is available only if the taxpayer opts for the Old Tax Regime.',
    ],
  },
  workedExample: {
    title: '₹7,20,000 Basic Salary, ₹3,60,000 HRA, ₹3,00,000 Rent in Mumbai (Metro)',
    scenario: 'A salaried employee in Mumbai receiving ₹60,000/mo Basic (₹7.2L/yr), ₹30,000/mo HRA (₹3.6L/yr), and paying ₹25,000/mo rent (₹3.0L/yr).',
    inputs: {
      'Basic Salary': '₹7,20,000/yr',
      'HRA Received': '₹3,60,000/yr',
      'Rent Paid': '₹3,00,000/yr (Mumbai — Metro)',
    },
    stepByStep: [
      'Limit 1 (Actual HRA Received) = ₹3,60,000.',
      'Limit 2 (Rent Paid − 10% of Basic) = ₹3,00,000 − ₹72,000 = ₹2,28,000.',
      'Limit 3 (50% of Basic for Metro) = ₹3,60,000.',
      'Least of the three = ₹2,28,000 Exempt HRA; remaining ₹1,32,000 is Taxable HRA.',
    ],
    finalResult: '₹2,28,000/yr (₹19,000/mo) Tax-Exempt HRA | ₹1,32,000/yr Taxable HRA',
    interpretation: 'Because Limit 2 (Rent minus 10% Basic) is the lowest of the three limits, it governs your exemption.',
  },
  howToUse: [
    'Select whether your rented residence is in one of the 4 statutory Metro cities (Delhi, Mumbai, Kolkata, Chennai) or a Non-Metro city.',
    'Enter your annual Basic Salary, Dearness Allowance (if any), HRA received, and actual rent paid.',
    'Review the highlighted governing limit and copy the exempt HRA into the India Income Tax Calculator.',
  ],
  howItIsCalculated: [
    'Evaluates all three statutory clauses under Income Tax Rule 2A and selects the minimum value.',
    'Subtracts exempt HRA from actual HRA received to determine taxable HRA.',
  ],
  whenToUse: [
    'Before submitting rent receipts and landlord PAN details to payroll.',
    'When evaluating whether your HRA + 80C deductions make the Old Tax Regime more beneficial than the New Tax Regime.',
  ],
  limitations: [
    'Cannot be claimed under the default Section 115BAC New Tax Regime.',
  ],
  sourceReference: {
    organization: 'Income Tax Department of India (CBDT)',
    standardName: 'Income Tax Act, 1961 Section 10(13A) & Income Tax Rules, 1962 Rule 2A',
    citation: 'https://www.incometax.gov.in/',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['sip-calculator', 'fd-calculator'],
  relatedConversionPaths: [
    { label: 'India Income Tax Calculator', path: '/finance/india-income-tax-calculator' },
    { label: 'In-Hand Salary Calculator', path: '/finance/in-hand-salary-calculator' },
  ],
  relatedGuidePaths: [
    { title: 'India Income Tax New vs Old Regime', path: '/finance/india-income-tax-calculator' },
  ],
  faqs: [
    {
      question: 'Is Bengaluru, Hyderabad, or Pune considered a Metro city for HRA calculation?',
      answer:
        'No. Under Rule 2A of the Income Tax Rules, 1962, only Delhi, Mumbai, Kolkata, and Chennai qualify for the 50% Metro limit. All other cities—including Bengaluru, Hyderabad, Pune, Ahmedabad, and Gurugram—are subject to the 40% Non-Metro limit.',
    },
  ],
};

export default function HraExemptionPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA} currencySymbol="₹">
      <HraExemptionClient />
    </CalculatorPageSystem>
  );
}
