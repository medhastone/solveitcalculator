import React from 'react';
import { Metadata } from 'next';
import BusinessClient from './BusinessClient';

export const metadata: Metadata = {
  title: 'Business Calculators | Profit, Pricing, ROI, Payroll & More | SolveItCalculator',
  description: 'Use free business calculators for profit margins, pricing, break-even, ROI, payroll, cash flow, inventory, SaaS metrics, ecommerce, and business planning.',
  keywords: [
    'business calculators',
    'profit margin calculator',
    'break even calculator',
    'ROI calculator',
    'pricing calculator',
    'markup calculator',
    'payroll calculator',
    'cash flow calculator',
    'business loan calculator',
    'startup cost calculator',
    'ecommerce profit calculator',
    'business runway calculator',
    'CAC calculator',
    'LTV CAC calculator',
    'SaaS metrics calculator',
    'free business tools'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/business/',
  },
  openGraph: {
    type: 'website',
    title: 'Business Calculators | Profit, Pricing, ROI, Payroll & More | SolveItCalculator',
    description: 'Use free business calculators for profit margins, pricing, break-even, ROI, payroll, cash flow, inventory, SaaS metrics, ecommerce, and business planning.',
    url: 'https://solveitcalculator.com/business/',
    siteName: 'SolveItCalculator',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Calculators | Profit, Pricing, ROI, Payroll & More | SolveItCalculator',
    description: 'Use free business calculators for profit margins, pricing, break-even, ROI, payroll, cash flow, inventory, SaaS metrics, ecommerce, and business planning.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://solveitcalculator.com/business/#webpage',
      url: 'https://solveitcalculator.com/business/',
      name: 'Business Calculators | Profit, Pricing, ROI, Payroll & More | SolveItCalculator',
      description: 'Use free business calculators for profit margins, pricing, break-even, ROI, payroll, cash flow, inventory, SaaS metrics, ecommerce, and business planning.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://solveitcalculator.com/#website',
        name: 'SolveItCalculator',
        url: 'https://solveitcalculator.com/'
      }
    },
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/business/#collection',
      url: 'https://solveitcalculator.com/business/',
      name: 'Business Calculators for Profit, Pricing, Payroll & Growth',
      description: 'Free calculators for profit margins, pricing, break-even, payroll, revenue, ROI, cash flow, inventory, SaaS metrics, and business planning.',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Profit Margin Calculator',
            description: 'Calculate gross profit, net profit, and profit margins from revenue and costs.'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Break-Even Calculator',
            description: 'Calculate unit sales and revenue required to cover fixed and variable business costs.'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'ROI Calculator',
            description: 'Evaluate return on investment and annualized capital performance across business projects.'
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Pricing Calculator',
            description: 'Determine optimal product and service pricing based on cost of goods and target margins.'
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Markup Calculator',
            description: 'Convert between markup percentages and profit margins to price inventory accurately.'
          },
          {
            '@type': 'ListItem',
            position: 6,
            name: 'Payroll Calculator',
            description: 'Calculate total employee cost including wages, payroll taxes, benefits, and overhead.'
          },
          {
            '@type': 'ListItem',
            position: 7,
            name: 'Cash Flow & Runway Calculator',
            description: 'Estimate monthly cash burn and business runway in operating months.'
          },
          {
            '@type': 'ListItem',
            position: 8,
            name: 'Business Loan Calculator',
            description: 'Calculate monthly amortized debt service, interest expense, and debt service coverage.'
          },
          {
            '@type': 'ListItem',
            position: 9,
            name: 'Startup Cost Calculator',
            description: 'Itemize initial capital expenditures, working capital reserves, and pre-launch expenses.'
          },
          {
            '@type': 'ListItem',
            position: 10,
            name: 'Ecommerce Profit Calculator',
            description: 'Calculate net unit margins after platform fees, payment processing, shipping, and ad spend.'
          }
        ]
      }
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://solveitcalculator.com/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Business Calculators',
          item: 'https://solveitcalculator.com/business/'
        }
      ]
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What business calculations can SolveItCalculator help with?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SolveItCalculator provides free tools for profit margin, markup, break-even unit analysis, pricing strategies, cash flow and runway estimation, employee and payroll overhead, ecommerce net profits, SaaS metrics (CAC, LTV, MRR, churn), ROI, and commercial debt calculations.'
          }
        },
        {
          '@type': 'Question',
          name: 'How is profit margin calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Profit margin is calculated as: Gross Profit Margin (%) = [(Revenue - Cost of Goods Sold) / Revenue] × 100. Net Profit Margin (%) = [(Revenue - Total Expenses) / Revenue] × 100. It measures the percentage of each dollar of revenue retained as profit.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is the difference between margin and markup?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Profit margin is profit expressed as a percentage of the selling price: (Profit / Selling Price) × 100. Markup is profit expressed as a percentage of the cost: (Profit / Cost) × 100. For example, an item costing $50 sold for $100 has a 50% profit margin and a 100% markup.'
          }
        },
        {
          '@type': 'Question',
          name: 'How is break-even calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Break-even volume is calculated as: Break-Even Units = Total Fixed Costs / (Selling Price per Unit - Variable Cost per Unit). The denominator represents the contribution margin per unit.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is CAC?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Customer Acquisition Cost (CAC) is the total sales and marketing expenditure over a specific period divided by the number of new customers acquired in that period: CAC = Total Acquisition Expenses / Total New Customers Acquired.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is LTV:CAC?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The LTV:CAC ratio compares the lifetime gross profit generated by a customer to the cost of acquiring them: LTV:CAC = Customer Lifetime Value / Customer Acquisition Cost. A ratio of 3:1 is commonly cited in software business models as a balanced growth benchmark.'
          }
        },
        {
          '@type': 'Question',
          name: 'How is business runway calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Business runway is calculated as: Runway (Months) = Current Liquid Cash Reserves / Net Monthly Cash Burn. Net monthly burn equals total monthly cash outlays minus monthly cash receipts.'
          }
        },
        {
          '@type': 'Question',
          name: 'Are business tax calculations universal?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Tax rates, deductions, depreciation schedules, VAT/GST rules, and payroll taxes vary substantially by jurisdiction, legal entity type (e.g., LLC, C-Corp, Sole Proprietorship), and tax year. Always verify tax calculations with applicable statutory guidelines or a certified tax advisor.'
          }
        },
        {
          '@type': 'Question',
          name: 'Are the results financial or professional advice?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. SolveItCalculator tools provide mathematical estimates based strictly on user-entered values and standard financial formulas. They are designed for scenario planning and educational exploration, not as formal accounting, legal, tax, or investment advice.'
          }
        }
      ]
    }
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

