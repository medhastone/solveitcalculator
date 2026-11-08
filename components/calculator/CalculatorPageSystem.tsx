import React from 'react';
import { Calculator } from 'lucide-react';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import CalculatorJsonLd from '@/components/calculator-page/CalculatorJsonLd';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
  SidebarIconVariant,
} from '@/components/calculator-page/SingleCalculatorPageShell';

interface CalculatorPageSystemProps {
  data: CalculatorSystemData;
  children: React.ReactNode;
  currencySymbol?: string;
}

const DEFAULT_FINANCE_LINKS: RelatedCalculatorLink[] = [
  {
    name: 'Loan Payment Calculator',
    description: 'Calculate monthly payments and total interest for any loan.',
    href: '/loan-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'Mortgage Calculator',
    description: 'Estimate monthly home payments including taxes and insurance.',
    href: '/mortgage-calculator',
    iconVariant: 'chart-green',
  },
  {
    name: 'Compound Interest Calculator',
    description: 'See how savings and investments grow over time.',
    href: '/compound-interest-calculator',
    iconVariant: 'arrows-blue',
  },
  {
    name: 'Profit Margin Calculator',
    description: 'Find gross profit margin, net margin, and markup percentage.',
    href: '/finance/profit-margin-calculator',
    iconVariant: 'tag-amber',
  },
  {
    name: 'Take-Home Pay Calculator',
    description: 'Estimate net paycheck after income and payroll taxes.',
    href: '/finance/take-home-pay-calculator',
    iconVariant: 'percent-coral',
  },
];

export default function CalculatorPageSystem({
  data,
  children,
  currencySymbol,
}: CalculatorPageSystemProps) {
  const jsonLdBreadcrumbs = [
    { name: 'Home', url: 'https://solveitcalculator.com' },
    {
      name: data.categoryName || 'Finance',
      url: `https://solveitcalculator.com${data.categoryPath || '/finance'}`,
    },
    ...(data.subcategoryName && data.subcategoryPath
      ? [
          {
            name: data.subcategoryName,
            url: `https://solveitcalculator.com${data.subcategoryPath}`,
          },
        ]
      : []),
    { name: data.name, url: data.canonicalUrl },
  ];

  const shellBreadcrumbs = [
    { label: 'Home', href: '/' },
    { label: data.categoryName || 'Finance', href: data.categoryPath || '/finance' },
    ...(data.subcategoryName && data.subcategoryPath
      ? [{ label: data.subcategoryName, href: data.subcategoryPath }]
      : []),
    { label: data.name },
  ];

  const variants: SidebarIconVariant[] = [
    'chart-green',
    'tag-amber',
    'coins-gold',
    'arrows-blue',
    'fraction-purple',
  ];

  const customRelated: RelatedCalculatorLink[] = (
    data.relatedConversionPaths || []
  ).map((item, idx) => ({
    name: item.label,
    description: `Open the ${item.label} with step-by-step formulas.`,
    href: item.path,
    iconVariant: variants[idx % variants.length],
  }));

  const otherCalculators: RelatedCalculatorLink[] = [
    ...customRelated,
    ...DEFAULT_FINANCE_LINKS.filter(
      (d) => !customRelated.some((c) => c.href === d.href) && !data.canonicalUrl.endsWith(d.href)
    ),
  ].slice(0, 5);

  const relatedCalculatorsBottom = otherCalculators.slice(0, 4);

  const isBusiness = data.subcategory === 'business';
  const heroSymbol = currencySymbol ? currencySymbol.trim() : isBusiness ? '%' : '$';
  const heroBadgeBg = isBusiness ? 'bg-[#FFF4E5]' : 'bg-[#E6F6F1]';
  const heroBadgeColor = isBusiness ? 'text-[#D97706]' : 'text-[#16856B]';

  const howToUseSteps =
    data.howToUse && data.howToUse.length >= 3
      ? [
          ...data.howToUse.slice(0, 4),
          ...(data.howToUse.length === 3
            ? ['Review the calculated result, complete equation, and step-by-step breakdown.']
            : []),
        ]
      : [
          'Enter your primary financial values in the input fields above.',
          'Adjust any rate, term, or deduction parameters for your scenario.',
          'Click Calculate or adjust values to see your result update immediately.',
          'Review the answer, formula breakdown, and worked example below.',
        ];

  const calculatorCard = (
    <section
      id="calculator"
      aria-label={`${data.name} Interactive Workbench`}
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-5"
    >
      <div className="flex items-start gap-3 pb-3 border-b border-[#F1F5F9]">
        <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
            Calculate {data.name.replace(/ Calculator$/i, '')}
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Enter your values below to calculate the exact result and step-by-step breakdown.
          </p>
        </div>
      </div>

      <div>{children}</div>
    </section>
  );

  return (
    <>
      <CalculatorJsonLd
        name={data.name}
        description={data.shortAnswer}
        url={data.canonicalUrl}
        category="FinanceApplication"
        breadcrumbs={jsonLdBreadcrumbs}
        faqs={data.faqs}
      />

      <SingleCalculatorPageShell
        breadcrumbs={shellBreadcrumbs}
        title={data.name}
        subtitle={data.shortAnswer}
        heroSymbol={heroSymbol}
        heroBadgeBg={heroBadgeBg}
        heroBadgeColor={heroBadgeColor}
        categoryName={data.categoryName || 'Finance'}
        categoryHref={data.categoryPath || '/finance'}
        otherCalculatorsTitle={`Other ${data.subcategoryName || data.categoryName || 'Finance'} Calculators`}
        otherCalculators={otherCalculators}
        relatedCalculators={relatedCalculatorsBottom}
        calculatorCard={calculatorCard}
        fullWidthWorkbench={true}
        formulaCard={{
          introText: data.formula.description,
          formulaText: data.formula.equation,
          exampleTitle: data.workedExample.scenario,
          exampleSteps: data.workedExample.stepByStep.slice(0, 3),
        }}
        howToUseSteps={howToUseSteps}
        howItWorks={{
          paragraph:
            data.howItIsCalculated.join(' ') ||
            data.formula.description,
          formulaBox: data.formula.equation,
          closingNote:
            data.limitations[0] ||
            `Verified methodology based on ${data.sourceReference.organization} (${data.sourceReference.standardName}).`,
        }}
        understandingResult={{
          paragraph: (
            <>
              {data.workedExample.interpretation} In our worked benchmark ({' '}
              <strong className="font-bold text-[#152238]">
                {data.workedExample.title}
              </strong>
              ), the calculation produces{' '}
              <strong className="font-bold text-[#152238]">
                {data.workedExample.finalResult}
              </strong>
              . You can customize every input above to match your exact numbers.
            </>
          ),
        }}
        faqs={
          data.faqs && data.faqs.length > 0
            ? data.faqs
            : [
                {
                  question: `How does the ${data.name} work?`,
                  answer: data.shortAnswer,
                },
                {
                  question: 'What formula is used for this calculation?',
                  answer: `${data.formula.description} The core equation is: ${data.formula.equation}.`,
                },
              ]
        }
      />
    </>
  );
}
