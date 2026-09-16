import React from 'react';
import { Metadata } from 'next';
import BusinessClient from './BusinessClient';

export const metadata: Metadata = {
  title: 'Business Tools & Calculators – Profit, Revenue, ROI, Payroll & More | SolveItCalculator',
  description: 'Use free business calculators for profit margin, ROI, revenue, payroll, pricing, inventory, taxes, budgeting, growth planning, and business finance decisions.',
  keywords: [
    'business calculators',
    'business tools',
    'business finance calculators',
    'profit margin calculator',
    'ROI calculator',
    'revenue calculator',
    'break even calculator',
    'payroll calculator',
    'pricing calculator',
    'inventory calculator',
    'cash flow calculator',
    'markup calculator',
    'business loan calculator',
    'startup cost calculator',
    'sales tax calculator',
    'business growth calculator',
    'startup calculator',
    'business finance tools',
    'free business calculators'
  ],
  alternates: {
    canonical: '/business-tools-calculators/',
  },
  openGraph: {
    type: 'website',
    title: 'Business Tools & Calculators | Free Business Planning & Finance Tools',
    description: 'Calculate profit margins, ROI, payroll, pricing, inventory costs, revenue forecasts, and business growth metrics with free tools from SolveItCalculator.',
    url: '/business-tools-calculators/',
    siteName: 'SolveItCalculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Tools & Calculators | Free Business Planning & Finance Tools',
    description: 'Free business calculators for profit, revenue, ROI, payroll, pricing, inventory, budgeting, and business growth planning.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Business Tools & Calculators',
  url: 'https://solveitcalculator.com/business-tools-calculators/',
  description: 'Use free business calculators for profit margin, ROI, revenue, payroll, pricing, inventory, taxes, budgeting, growth planning, and business finance decisions.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Profit Margin Calculators',
    'ROI Calculators',
    'Break-Even Calculators',
    'Payroll Calculators',
    'Revenue Calculators',
    'Pricing & Markup Calculators',
    'Inventory Calculators',
    'Cash Flow Calculators',
    'Startup Cost Calculators',
    'Business Loan Calculators',
    'Sales Tax Calculators',
    'Business Growth Calculators',
    'Productivity Calculators',
    'Financial Planning Tools'
  ]
};

export default function BusinessPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BusinessClient />
    </>
  );
}
