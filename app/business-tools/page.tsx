import React from 'react';
import { Metadata } from 'next';
import BusinessClient from '../business/BusinessClient';

export const metadata: Metadata = {
  title: 'Business Tools & Calculators – Profit, Revenue, ROI, Payroll & More | SolveItCalculator',
  description: 'Use free business calculators for profit margin, ROI, revenue, payroll, pricing, inventory, taxes, budgeting, growth planning, and business finance decisions.',
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

export default function BusinessToolsPage() {
  return <BusinessClient />;
}
