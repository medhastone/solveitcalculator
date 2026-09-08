import React from 'react';
import { Metadata } from 'next';
import BusinessClient from './BusinessClient';

export const metadata: Metadata = {
  title: 'Business Tools & Calculators | SolveIt',
  description: 'Free business calculators, startup financial tools, pricing planners, SaaS metrics, ecommerce profit calculators, and growth resources. 100% private and client-side.',
};

export default function BusinessPage() {
  return <BusinessClient />;
}
