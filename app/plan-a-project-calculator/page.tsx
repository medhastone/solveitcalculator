import { Metadata } from 'next';
import PlanAProjectCalculator from '@/components/PlanAProjectCalculator';

export const metadata: Metadata = {
  title: 'Plan a Project Calculator — Timeline, Milestone & Deadline Estimator',
  description: 'Deterministic project schedule forecasting, Critical Path Method (CPM) dependency sequencing, multi-resource velocity balancing, and instant scenario delay modeling. Built with zero telemetry.',
  alternates: {
    canonical: 'https://solveitcalculator.com/plan-a-project-calculator',
  },
  openGraph: {
    title: 'Plan a Project Calculator — Timeline & Estimator',
    description: 'Deterministic project schedule and deadline forecasting calculator. Includes Critical Path Method (CPM), multi-resource capacity balancing, Gantt preview, and instant delay scenario simulation.',
    url: 'https://solveitcalculator.com/plan-a-project-calculator',
    type: 'website',
  },
};

export default function PlanAProjectPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Plan a Project Calculator",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All modern browsers (Client-Side HTML5/WASM/JS)",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Deterministic project schedule and deadline forecasting calculator. Includes Critical Path Method (CPM), multi-resource capacity balancing, Gantt preview, and instant delay scenario simulation."
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://solveitcalculator.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Time & Date Calculators",
            "item": "https://solveitcalculator.com/time-date"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Plan a Project Calculator",
            "item": "https://solveitcalculator.com/plan-a-project-calculator"
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PlanAProjectCalculator />
    </>
  );
}
