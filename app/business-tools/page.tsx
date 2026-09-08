import React from 'react';
import { Metadata } from 'next';
import BusinessClient from '../business/BusinessClient';

export const metadata: Metadata = {
  title: 'Business Tools & Calculators | SolveIt',
  description: 'Free business calculators, startup financial tools, pricing planners, SaaS metrics, ecommerce profit calculators, and growth resources.',
};

export default function BusinessToolsPage() {
  return <BusinessClient />;
}
