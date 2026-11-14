'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw, AlertCircle } from 'lucide-react';
import {
  MATH_CALCULATORS,
  MathCalculatorItem,
  computeMathToolResult,
} from '@/lib/mathCalculatorsData';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
  SidebarIconVariant,
} from '@/components/calculator-page/SingleCalculatorPageShell';

function getHeroSymbolForTool(tool: MathCalculatorItem): {
  symbol: string;
  bg: string;
  color: string;
} {
  switch (tool.symbolType) {
    case 'percent':
      return { symbol: '%', bg: 'bg-[#FFE4E6]', color: 'text-[#E11D48]' };
    case 'discount-tag':
      return { symbol: '%', bg: 'bg-[#FFF4E5]', color: 'text-[#D97706]' };
    case 'bar-chart-green':
      return { symbol: 'Δ%', bg: 'bg-[#E6F6F1]', color: 'text-[#16856B]' };
    case 'fraction-half':
      return { symbol: '½', bg: 'bg-[#F3E8FF]', color: 'text-[#7C3AED]' };
    case 'ratio-nodes':
      return { symbol: 'A:B', bg: 'bg-[#EBF2FF]', color: 'text-[#2457D6]' };
    case 'sigma':
      return { symbol: 'Σ', bg: 'bg-[#E6F6F1]', color: 'text-[#16856B]' };
    case 'scientific-calc':
      return { symbol: 'fx', bg: 'bg-[#EBF2FF]', color: 'text-[#2457D6]' };
    case 'sqrt-x':
      return { symbol: '√x', bg: 'bg-[#FFF4E5]', color: 'text-[#D97706]' };
    case 'exponent-x2':
      return { symbol: 'x²', bg: 'bg-[#F3E8FF]', color: 'text-[#7C3AED]' };
    case 'abs-x':
      return { symbol: '|x|', bg: 'bg-[#EBF2FF]', color: 'text-[#2457D6]' };
    case 'lcm-gcd':
      return { symbol: 'GCD', bg: 'bg-[#E6F6F1]', color: 'text-[#16856B]' };
    case 'matrix-grid':
      return { symbol: '[A]', bg: 'bg-[#EBF2FF]', color: 'text-[#2457D6]' };
    case 'equation-x':
    default:
      return { symbol: 'x=', bg: 'bg-[#FFE4E6]', color: 'text-[#E11D48]' };
  }
}

const PERCENTAGE_REFERENCE_ROWS = [
  {
    scenarioLabel: '5% of 200',
    multiplierLabel: '200 × 0.05',
    calculatedOutput: '10',
    formulaNote: '(5 × 200) ÷ 100 = 10',
  },
  {
    scenarioLabel: '10% of 200',
    multiplierLabel: '200 × 0.10',
    calculatedOutput: '20',
    formulaNote: '(10 × 200) ÷ 100 = 20',
  },
  {
    scenarioLabel: '15% tip on $80',
    multiplierLabel: '80 × 0.15',
    calculatedOutput: '$12',
    formulaNote: '(15 × 80) ÷ 100 = 12',
  },
  {
    scenarioLabel: '20% off $150',
    multiplierLabel: '150 × 0.20',
    calculatedOutput: '$30 off ($120)',
    formulaNote: '(20 × 150) ÷ 100 = 30 discount',
  },
  {
    scenarioLabel: '25% of 200',
    multiplierLabel: '200 × 0.25',
    calculatedOutput: '50',
    formulaNote: '(25 × 200) ÷ 100 = 50',
  },
  {
    scenarioLabel: '50% of 200',
    multiplierLabel: '200 × 0.50',
    calculatedOutput: '100',
    formulaNote: '(50 × 200) ÷ 100 = 100',
  },
  {
    scenarioLabel: '75% of 200',
    multiplierLabel: '200 × 0.75',
    calculatedOutput: '150',
    formulaNote: '(75 × 200) ÷ 100 = 150',
  },
];

export default function MathToolDetailClient({
  tool,
}: {
  tool: MathCalculatorItem;
}) {
  const isPercentageMain = tool.slug === 'percentage-calculator';

  const [rawA, setRawA] = useState<string>(
    isPercentageMain ? '' : String(tool.defaultInputs.valueA)
  );
  const [rawB, setRawB] = useState<string>(
    isPercentageMain ? '' : String(tool.defaultInputs.valueB)
  );
  const [rawC, setRawC] = useState<string>(
    typeof tool.defaultInputs.valueC === 'number'
      ? String(tool.defaultInputs.valueC)
      : '4'
  );
  const [valA, setValA] = useState<number>(
    isPercentageMain ? 0 : tool.defaultInputs.valueA
  );
  const [valB, setValB] = useState<number>(
    isPercentageMain ? 0 : tool.defaultInputs.valueB
  );
  const [valC, setValC] = useState<number>(tool.defaultInputs.valueC ?? 4);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const output = useMemo(
    () => computeMathToolResult(tool.slug, valA, valB, valC),
    [tool.slug, valA, valB, valC]
  );

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (rawA.trim() === '' || rawB.trim() === '') {
      setErrorMsg('Please enter valid numbers in all required fields (*).');
      return;
    }
    const parsedA = Number(rawA);
    const parsedB = Number(rawB);
    const parsedC = Number(rawC);
    if (
      !Number.isFinite(parsedA) ||
      !Number.isFinite(parsedB) ||
      (typeof tool.defaultInputs.valueC === 'number' && !Number.isFinite(parsedC))
    ) {
      setErrorMsg('Please enter valid numeric values without letters.');
      return;
    }
    if (tool.slug === 'percentage-change-calculator' && parsedA === 0) {
      setErrorMsg('Original value cannot be zero when calculating percentage change.');
      return;
    }
    setErrorMsg(null);
    setValA(parsedA);
    setValB(parsedB);
    if (typeof tool.defaultInputs.valueC === 'number') {
      setValC(parsedC);
    }
  };

  const handleLoadSample = () => {
    setErrorMsg(null);
    setRawA(String(tool.defaultInputs.valueA));
    setRawB(String(tool.defaultInputs.valueB));
    setValA(tool.defaultInputs.valueA);
    setValB(tool.defaultInputs.valueB);
    if (typeof tool.defaultInputs.valueC === 'number') {
      setRawC(String(tool.defaultInputs.valueC));
      setValC(tool.defaultInputs.valueC);
    }
  };

  const handleReset = () => {
    setErrorMsg(null);
    if (isPercentageMain) {
      setRawA('');
      setRawB('');
      setValA(0);
      setValB(0);
      return;
    }
    setRawA(String(tool.defaultInputs.valueA));
    setRawB(String(tool.defaultInputs.valueB));
    setValA(tool.defaultInputs.valueA);
    setValB(tool.defaultInputs.valueB);
    if (typeof tool.defaultInputs.valueC === 'number') {
      setRawC(String(tool.defaultInputs.valueC));
      setValC(tool.defaultInputs.valueC);
    }
  };

  // Sidebar "Other Percentage Calculators" or "Other Math Calculators"
  const otherCalculators: RelatedCalculatorLink[] = useMemo(() => {
    if (isPercentageMain || tool.category === 'Percentages') {
      return [
        {
          name: 'Percentage Change Calculator',
          description: 'Find the percentage increase or decrease between two values.',
          href: '/math/percentage-change-calculator',
          iconVariant: 'chart-green',
        },
        {
          name: 'Retail Discount & Sale Price Calculator',
          description: 'Compute final sale price and dollar savings after a discount.',
          href: '/math/discount-calculator',
          iconVariant: 'tag-amber',
        },
        {
          name: 'Profit Margin & Markup Calculator',
          description: 'Find gross profit margin and markup percentage on cost.',
          href: '/finance/profit-margin-calculator',
          iconVariant: 'coins-gold',
        },
        {
          name: 'Percentage to Decimal Converter',
          description: 'Convert any percent into an exact decimal multiplier.',
          href: '/math/percentage-to-decimal-calculator',
          iconVariant: 'arrows-blue',
        },
        {
          name: 'Percentage to Simplified Fraction',
          description: 'Turn percentages into reduced whole-number fractions.',
          href: '/math/percentage-to-fraction-calculator',
          iconVariant: 'fraction-purple',
        },
      ];
    }

    const variants: SidebarIconVariant[] = [
      'chart-green',
      'tag-amber',
      'coins-gold',
      'arrows-blue',
      'fraction-purple',
    ];
    return MATH_CALCULATORS.filter((item) => item.slug !== tool.slug)
      .slice(0, 5)
      .map((item, idx) => ({
        name: item.name,
        description: item.description,
        href: `/math/${item.slug}`,
        iconVariant: variants[idx % variants.length],
      }));
  }, [isPercentageMain, tool.category, tool.slug]);

  const relatedCalculatorsBottom: RelatedCalculatorLink[] = useMemo(() => {
    if (isPercentageMain || tool.category === 'Percentages') {
      return otherCalculators;
    }
    return otherCalculators.slice(0, 4);
  }, [isPercentageMain, tool.category, otherCalculators]);

  // Result Card formatting (preserves consistent placeholder state when inputs are cleared)
  const hasEmptyInput =
    rawA.trim() === '' ||
    !Number.isFinite(Number(rawA)) ||
    rawB.trim() === '' ||
    !Number.isFinite(Number(rawB)) ||
    (typeof tool.defaultInputs.valueC === 'number' &&
      (rawC.trim() === '' || !Number.isFinite(Number(rawC))));

  const resultCardProps = useMemo(() => {
    if (isPercentageMain) {
      const numericAns = Number(((valA * valB) / 100).toFixed(4));
      return {
        promptSummary: `${valA}% of ${valB.toLocaleString()}`,
        promptSuffix: 'is:',
        mainValue: numericAns.toLocaleString(),
        equation: `${numericAns} = ${valA} × ${valB} ÷ 100`,
        isEmpty: hasEmptyInput,
        placeholderMessage:
          'Enter a percentage and a base number to calculate your exact answer.',
      };
    }
    return {
      promptSummary: `${tool.name} Answer`,
      promptSuffix: 'is:',
      mainValue: output.headlineResult,
      equation: output.steps[0] || `${tool.formulaPreview}`,
      secondaryNote: output.secondaryNote,
      isEmpty: hasEmptyInput,
      placeholderMessage: `Enter ${tool.defaultInputs.labelA.toLowerCase()} and ${tool.defaultInputs.labelB.toLowerCase()} on the left to calculate:`,
    };
  }, [
    isPercentageMain,
    valA,
    valB,
    tool.name,
    tool.formulaPreview,
    tool.defaultInputs.labelA,
    tool.defaultInputs.labelB,
    output,
    hasEmptyInput,
  ]);

  // Formula & Example Card
  const formulaCardProps = useMemo(() => {
    if (isPercentageMain) {
      return {
        introText: 'The formula to calculate the percentage of a number is:',
        formulaText: 'Result = Percentage × Number ÷ 100',
        exampleTitle: 'Find 25% of 200:',
        exampleSteps: [
          'Result = 25 × 200 ÷ 100',
          'Result = 5000 ÷ 100',
          'Result = 50',
        ],
      };
    }
    return {
      introText: `The mathematical formula used by the ${tool.name} is:`,
      formulaText: tool.formulaPreview,
      exampleTitle: tool.examplePrompt,
      exampleSteps: output.steps,
    };
  }, [isPercentageMain, tool.name, tool.formulaPreview, tool.examplePrompt, output.steps]);

  const howToUseSteps = useMemo(() => {
    if (isPercentageMain) {
      return [
        'Enter the percentage value in the first field (for example, 25).',
        'Enter the base number you want to take that percentage of (for example, 200).',
        'Review the live answer and equation right below the inputs, or tap Try Sample (25% of 200).',
        'Click Copy or Share to save your result, or Reset to clear the fields.',
      ];
    }
    return [
      `Enter your ${tool.defaultInputs.labelA.toLowerCase()} in the first field.`,
      `Enter your ${tool.defaultInputs.labelB.toLowerCase()} in the second field.`,
      'Click the Calculate button to compute the exact answer.',
      'Review the calculated result, complete equation, and step-by-step breakdown.',
    ];
  }, [isPercentageMain, tool.defaultInputs.labelA, tool.defaultInputs.labelB]);

  const howItWorks = useMemo(() => {
    if (isPercentageMain) {
      return {
        paragraph:
          'The calculator multiplies the percentage value by the number and then divides the result by 100. Dividing by 100 converts a percent into its decimal equivalent before scaling the base amount.',
        formulaBox: 'Result = (Percentage × Number) ÷ 100',
        closingNote:
          'This formula works for any positive, negative, whole, or decimal value.',
      };
    }
    return {
      paragraph: `${tool.description} The calculator applies standard arithmetic and algebraic identities to compute an exact result with step-by-step verification.`,
      formulaBox: tool.formulaPreview,
      closingNote: `Use this formula for ${tool.commonUseCase.toLowerCase()}.`,
    };
  }, [isPercentageMain, tool.description, tool.formulaPreview, tool.commonUseCase]);

  const understandingResult = useMemo(() => {
    if (isPercentageMain) {
      return {
        paragraph: (
          <>
            The result shows the share of the base number that matches your percentage. For example,{' '}
            <strong className="font-bold text-[#152238]">25% of 200</strong> equals 50 because 25 out of every 100 units across 200 units totals 50—helpful for sale discounts, restaurant tips, sales tax, and test scores.
          </>
        ),
      };
    }
    return {
      paragraph: (
        <>
          Your calculated answer (<strong className="font-bold text-[#152238]">{output.headlineResult}</strong>) represents the exact mathematical outcome based on your inputs. {output.secondaryNote} This tool is commonly used for {tool.commonUseCase.toLowerCase()}.
        </>
      ),
    };
  }, [isPercentageMain, output.headlineResult, output.secondaryNote, tool.commonUseCase]);

  const faqs = useMemo(() => {
    if (isPercentageMain) {
      return [
        {
          question: 'How do you calculate the percentage of a number?',
          answer:
            'Multiply the percentage by the number and divide the product by 100. For example, 25% of 200 is (25 × 200) ÷ 100 = 50.',
        },
        {
          question: 'How do I calculate a 20% discount on an item?',
          answer:
            'Multiply the original price by 0.20 to find your savings, then subtract that from the original price. On a $150 jacket, 20% is $30 off, leaving a $120 sale price.',
        },
        {
          question: 'What is X as a percentage of Y (such as a test score)?',
          answer:
            'Divide the part by the whole and multiply by 100. For example, scoring 42 correct out of 50 questions gives (42 ÷ 50) × 100 = 84%.',
        },
        {
          question: 'Can I calculate percentages with decimals like 7.25% or 8.875%?',
          answer:
            'Yes. Enter any decimal percentage or dollar amount such as 7.25% sales tax on $149.99, and the calculator handles floating-point values without rounding inputs first.',
        },
        {
          question: 'How do I calculate percentage increase or decrease instead?',
          answer:
            'Subtract the old value from the new value, divide by the old value, and multiply by 100—or open our dedicated Percentage Change Calculator linked below.',
        },
        {
          question: 'What is the quick mental math trick for 15% tips?',
          answer:
            'Move the decimal point one place left to find 10%, add half of that amount for the remaining 5%, and sum the two numbers. For an $80 bill, 10% is $8 and half is $4, making a $12 tip.',
        },
      ];
    }
    return [
      {
        question: `How does the ${tool.name} work?`,
        answer: `${tool.description} It uses the formula ${tool.formulaPreview} to deliver an instant, accurate answer along with step-by-step equations.`,
      },
      {
        question: `What are common real-life uses for the ${tool.name}?`,
        answer: `People frequently use this calculator for ${tool.commonUseCase.toLowerCase()}. You can also click Copy result or Print to save your calculation.`,
      },
      {
        question: 'Can I enter decimal or negative numbers?',
        answer:
          'Yes. All input fields accept whole numbers and decimal values so you can solve both everyday problems and school or work equations accurately.',
      },
      {
        question: 'Is this calculator free to use?',
        answer:
          'Yes. Every calculator on SolveItCalculator.com is completely free, works on all devices, and requires no sign-up.',
      },
    ];
  }, [isPercentageMain, tool.name, tool.description, tool.formulaPreview, tool.commonUseCase]);

  const heroBadge = getHeroSymbolForTool(tool);

  const calculatorCard = (
    <section
      id="calculator"
      aria-label={`${tool.name} input panel`}
      className={`bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs ${
        isPercentageMain ? 'p-4 sm:p-6 space-y-4' : 'p-6 sm:p-7 space-y-6'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
          <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-xl font-extrabold text-[#152238]">
            {isPercentageMain
              ? 'Calculate Percentage of a Number'
              : `Calculate ${tool.name.replace(/ Calculator$/i, '')}`}
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            {isPercentageMain
              ? 'Enter the percentage value and the base number.'
              : 'Enter your values in the required fields below to find the result.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleCalculate} className={isPercentageMain ? 'space-y-4' : 'space-y-5'} noValidate>
        <div
          className={
            isPercentageMain
              ? 'grid grid-cols-2 gap-3 sm:gap-4'
              : 'grid grid-cols-1 sm:grid-cols-2 gap-5'
          }
        >
          {/* Field A */}
          <div>
            <label
              htmlFor="math-val-a"
              className={`block font-extrabold text-[#152238] ${
                isPercentageMain ? 'text-xs sm:text-sm mb-1' : 'text-sm mb-2'
              }`}
            >
              {tool.defaultInputs.labelA}{' '}
              <span className="text-[#E11D48]" aria-hidden="true">
                *
              </span>
            </label>
            <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15 transition-all min-h-[44px]">
              <input
                id="math-val-a"
                type="number"
                step="any"
                required
                placeholder={`e.g. ${tool.defaultInputs.valueA}`}
                value={rawA}
                onChange={(e) => {
                  setRawA(e.target.value);
                  if (e.target.value.trim() !== '' && Number.isFinite(Number(e.target.value))) {
                    setValA(Number(e.target.value));
                    setErrorMsg(null);
                  }
                }}
                className="w-full min-h-[44px] px-3 sm:px-4 bg-white text-sm sm:text-base font-bold text-[#152238] tabular-nums focus:outline-none"
              />
              <span className="px-3 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center justify-center shrink-0 select-none">
                {tool.defaultInputs.unitA || (isPercentageMain ? '%' : 'Value')}
              </span>
            </div>
            {!isPercentageMain && (
              <p className="text-xs text-[#64748B] mt-1.5">
                Enter {tool.defaultInputs.labelA.toLowerCase()} (e.g. {tool.defaultInputs.valueA})
              </p>
            )}
          </div>

          {/* Field B */}
          <div>
            <label
              htmlFor="math-val-b"
              className={`block font-extrabold text-[#152238] ${
                isPercentageMain ? 'text-xs sm:text-sm mb-1' : 'text-sm mb-2'
              }`}
            >
              {tool.defaultInputs.labelB}{' '}
              <span className="text-[#E11D48]" aria-hidden="true">
                *
              </span>
            </label>
            <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15 transition-all min-h-[44px]">
              <input
                id="math-val-b"
                type="number"
                step="any"
                required
                placeholder={`e.g. ${tool.defaultInputs.valueB}`}
                value={rawB}
                onChange={(e) => {
                  setRawB(e.target.value);
                  if (e.target.value.trim() !== '' && Number.isFinite(Number(e.target.value))) {
                    setValB(Number(e.target.value));
                    setErrorMsg(null);
                  }
                }}
                className="w-full min-h-[44px] px-3 sm:px-4 bg-white text-sm sm:text-base font-bold text-[#152238] tabular-nums focus:outline-none"
              />
              <span className="px-2.5 sm:px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center justify-center shrink-0 select-none">
                {tool.defaultInputs.unitB || (isPercentageMain ? '#' : 'Value')}
              </span>
            </div>
            {!isPercentageMain && (
              <p className="text-xs text-[#64748B] mt-1.5">
                Enter {tool.defaultInputs.labelB.toLowerCase()} (e.g. {tool.defaultInputs.valueB})
              </p>
            )}
          </div>

          {/* Optional Field C */}
          {typeof tool.defaultInputs.valueC === 'number' && (
            <div className="sm:col-span-2">
              <label
                htmlFor="math-val-c"
                className="block text-sm font-extrabold text-[#152238] mb-2"
              >
                {tool.defaultInputs.labelC}{' '}
                <span className="text-[#E11D48]" aria-hidden="true">
                  *
                </span>
              </label>
              <div className="flex items-stretch max-w-xs rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15 transition-all">
                <input
                  id="math-val-c"
                  type="number"
                  step="any"
                  required
                  value={rawC}
                  onChange={(e) => {
                    setRawC(e.target.value);
                    if (e.target.value.trim() !== '' && Number.isFinite(Number(e.target.value))) {
                      setValC(Number(e.target.value));
                      setErrorMsg(null);
                    }
                  }}
                  className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
                />
                <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center justify-center shrink-0 select-none">
                  Value
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Inline Error Message */}
        {errorMsg && (
          <div
            role="alert"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs sm:text-sm font-bold text-[#BE123C]"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary & Reset Actions */}
        {isPercentageMain ? (
          <div className="grid grid-cols-12 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleLoadSample}
              className="col-span-7 sm:col-span-8 min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0B5CFF] hover:bg-[#1D46B0] text-white text-sm sm:text-base font-extrabold shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#152238]"
            >
              <Calculator className="w-4 h-4" />
              <span>Try Sample (25% of 200)</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="col-span-5 sm:col-span-4 min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] text-sm sm:text-base font-extrabold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-1">
            <button
              type="submit"
              className="sm:col-span-8 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#0B5CFF] hover:bg-[#1D46B0] text-white text-base font-extrabold shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#152238]"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="sm:col-span-4 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] text-base font-extrabold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </form>
    </section>
  );

  return (
    <SingleCalculatorPageShell
      layoutVariant={isPercentageMain ? 'result-below-inputs' : 'default'}
      useCuratedFaqsOnly={isPercentageMain}
      schemaAppCategory={isPercentageMain ? 'EducationalApplication' : undefined}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Math', href: '/math' },
        {
          label: isPercentageMain ? 'Percentage Calculators' : tool.name,
        },
      ]}
      title={tool.name}
      subtitle={tool.description}
      quickAnswer={
        isPercentageMain
          ? {
              question: 'What is 25% of 200?',
              answer:
                '25% of 200 equals 50 because (25 × 200) ÷ 100 = 50. Enter any percent and base number below for instant step-by-step math.',
              targetAnchor: '#reference-table',
              targetLabel: 'Percent table ↓',
            }
          : undefined
      }
      workedExampleCard={
        isPercentageMain
          ? {
              title: 'Find 25% of 200 (discounts, tips & tax):',
              equation: '25 × 200 ÷ 100 = 50',
              steps: [
                'Multiply the percent by the number: 25 × 200 = 5,000',
                'Divide the product by 100: 5,000 ÷ 100 = 50',
                'Check: 25% equals one-quarter (0.25 × 200 = 50)',
              ],
            }
          : undefined
      }
      matchingGuide={
        isPercentageMain
          ? {
              title: 'How to Calculate a Percentage: Step-by-Step Formulas',
              description:
                'Master percent of a number, discounts, reverse percentages, and percent change with real examples.',
              href: '/guides/how-to-calculate-a-percentage',
            }
          : undefined
      }
      referenceTableRows={isPercentageMain ? PERCENTAGE_REFERENCE_ROWS : undefined}
      heroSymbol={heroBadge.symbol}
      heroBadgeBg={heroBadge.bg}
      heroBadgeColor={heroBadge.color}
      categoryName="Math"
      categoryHref="/math"
      otherCalculatorsTitle={
        isPercentageMain || tool.category === 'Percentages'
          ? 'Other Percentage Calculators'
          : 'Other Math Calculators'
      }
      otherCalculators={otherCalculators}
      relatedCalculators={relatedCalculatorsBottom}
      calculatorCard={calculatorCard}
      resultCard={resultCardProps}
      formulaCard={formulaCardProps}
      howToUseSteps={howToUseSteps}
      howItWorks={howItWorks}
      understandingResult={understandingResult}
      faqs={faqs}
    />
  );
}
