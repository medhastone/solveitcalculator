import React from 'react';
import { Metadata } from 'next';
import BusinessClient from '../business/BusinessClient';

export const metadata: Metadata = {
  title: 'Business Calculators | Profit, Pricing, ROI, Payroll & More | SolveItCalculator',
  description: 'Use free business calculators for profit margins, pricing, break-even, ROI, payroll, cash flow, inventory, SaaS metrics, ecommerce, and business planning.',
  alternates: {
    canonical: 'https://solveitcalculator.com/business',
  },
  openGraph: {
    type: 'website',
    title: 'Business Calculators | Profit, Pricing, ROI, Payroll & More | SolveItCalculator',
    description: 'Use free business calculators for profit margins, pricing, break-even, ROI, payroll, cash flow, inventory, SaaS metrics, ecommerce, and business planning.',
    url: 'https://solveitcalculator.com/business/',
    siteName: 'SolveItCalculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Calculators | Profit, Pricing, ROI, Payroll & More | SolveItCalculator',
    description: 'Use free business calculators for profit margins, pricing, break-even, ROI, payroll, cash flow, inventory, SaaS metrics, ecommerce, and business planning.',
  },
};

export default function BusinessToolsCalculatorsCanonicalPage() {
  return <BusinessClient />;
}

