'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { formatWithGlobalCurrency, useCurrency } from '@/lib/currency';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
  FaqItem,
} from '@/components/calculator-page/SingleCalculatorPageShell';

export type MissingFinanceSlug =
  | 'safe-withdrawal-rate-calculator'
  | 'investment-growth-calculator'
  | 'real-rate-of-return-calculator'
  | 'home-affordability-calculator'
  | 'refinance-calculator'
  | 'rent-vs-buy-calculator'
  | 'margin-and-markup-calculator';

const FINANCE_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    name: '401(k) Retirement Calculator',
    description: 'Project 401(k) growth with employer match and IRS limits.',
    href: '/finance/401k-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'Roth vs. Traditional Calculator',
    description: 'Compare pre-tax Traditional vs. post-tax Roth retirement wealth.',
    href: '/finance/roth-vs-traditional-calculator',
    iconVariant: 'scale-teal',
  },
  {
    name: 'Compound Interest Calculator',
    description: 'Calculate long-term compound interest with monthly contributions.',
    href: '/compound-interest-calculator',
    iconVariant: 'chart-green',
  },
  {
    name: 'Mortgage Payment Calculator',
    description: 'Estimate monthly PITI mortgage payments and amortization.',
    href: '/mortgage-calculator',
    iconVariant: 'calc-blue',
  },
  {
    name: 'FIRE Forecaster',
    description: 'Model Lean, Regular, Fat, and Coast FIRE retirement timelines.',
    href: '/fire-forecaster',
    iconVariant: 'percent-coral',
  },
];

function fmtUSD(n: number, decimals = 0): string {
  return formatWithGlobalCurrency(n, {
    fromCurrency: 'USD',
    decimals,
  });
}

export default function MissingFinanceCalculatorsClient({
  slug,
}: {
  slug: MissingFinanceSlug;
}) {
  const { currency, symbol, rateFromUSD, applyExchangeRate } = useCurrency();
  // 1. Safe Withdrawal Rate (4% Rule)
  const [swrPortfolio, setSwrPortfolio] = useState<number>(1_000_000);
  const [swrRatePct, setSwrRatePct] = useState<number>(4.0);
  const [swrReturnPct, setSwrReturnPct] = useState<number>(7.0);
  const [swrInflationPct, setSwrInflationPct] = useState<number>(2.5);
  const [swrYears, setSwrYears] = useState<number>(30);

  // 2. Investment Growth & Expense Ratio Drag
  const [invInitial, setInvInitial] = useState<number>(25_000);
  const [invMonthly, setInvMonthly] = useState<number>(500);
  const [invYears, setInvYears] = useState<number>(25);
  const [invReturnPct, setInvReturnPct] = useState<number>(8.0);
  const [invExpenseRatioPct, setInvExpenseRatioPct] = useState<number>(0.65);

  // 3. Real Rate of Return (Fisher Equation)
  const [nominalReturnPct, setNominalReturnPct] = useState<number>(8.5);
  const [inflationPct, setInflationPct] = useState<number>(3.0);
  const [realPrincipal, setRealPrincipal] = useState<number>(50_000);
  const [realHorizonYears, setRealHorizonYears] = useState<number>(20);

  // 4. Home Affordability (28/36 Rule)
  const [annualGrossIncome, setAnnualGrossIncome] = useState<number>(110_000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(450);
  const [downPaymentUSD, setDownPaymentUSD] = useState<number>(50_000);
  const [mortgageRatePct, setMortgageRatePct] = useState<number>(6.5);
  const [propertyTaxInsuranceMonthly, setPropertyTaxInsuranceMonthly] = useState<number>(420);

  // 5. Mortgage Refinance & Break-Even
  const [refiBalance, setRefiBalance] = useState<number>(320_000);
  const [refiCurrentRatePct, setRefiCurrentRatePct] = useState<number>(7.25);
  const [refiNewRatePct, setRefiNewRatePct] = useState<number>(5.85);
  const [refiTermYears, setRefiTermYears] = useState<number>(30);
  const [refiClosingCosts, setRefiClosingCosts] = useState<number>(4_800);

  // 6. Rent vs. Buy
  const [rvbHomePrice, setRvbHomePrice] = useState<number>(400_000);
  const [rvbDownPct, setRvbDownPct] = useState<number>(20);
  const [rvbMortgageRatePct, setRvbMortgageRatePct] = useState<number>(6.5);
  const [rvbMonthlyRent, setRvbMonthlyRent] = useState<number>(2_200);
  const [rvbStayYears, setRvbStayYears] = useState<number>(7);

  // 7. Margin & Markup
  const [mmCost, setMmCost] = useState<number>(60);
  const [mmPrice, setMmPrice] = useState<number>(100);

  const computed = useMemo(() => {
    if (slug === 'safe-withdrawal-rate-calculator') {
      const annualWithdrawal = swrPortfolio * (swrRatePct / 100);
      const monthlyWithdrawal = annualWithdrawal / 12;
      const realReturn = (1 + swrReturnPct / 100) / (1 + swrInflationPct / 100) - 1;

      let bal = swrPortfolio;
      let yearsLasted = 0;
      while (bal > 0 && yearsLasted < 60) {
        bal = bal * (1 + realReturn) - annualWithdrawal;
        if (bal >= 0) yearsLasted++;
      }
      const endBalance30 = (() => {
        let b = swrPortfolio;
        for (let y = 0; y < swrYears; y++) {
          b = b * (1 + realReturn) - annualWithdrawal;
        }
        return Math.max(0, b);
      })();

      return {
        promptSummary: `Year-1 safe withdrawal at ${swrRatePct}% on ${fmtUSD(swrPortfolio)}`,
        mainValue: `${fmtUSD(annualWithdrawal)} / yr`,
        equation: `${fmtUSD(swrPortfolio)} × ${swrRatePct}% = ${fmtUSD(annualWithdrawal)}/yr (${fmtUSD(monthlyWithdrawal)}/mo)`,
        secondaryNote: `Projected inflation-adjusted balance after ${swrYears} years: ${fmtUSD(endBalance30)} · Portfolio sustainability: ${yearsLasted >= 60 ? '60+ years (Perpetual)' : `~${yearsLasted} years`}`,
      };
    }

    if (slug === 'investment-growth-calculator') {
      const months = Math.max(1, invYears * 12);
      const grossMonthlyR = invReturnPct / 100 / 12;
      const netMonthlyR = Math.max(0, invReturnPct - invExpenseRatioPct) / 100 / 12;

      const calcFV = (r: number) => {
        if (r === 0) return invInitial + invMonthly * months;
        const factor = Math.pow(1 + r, months);
        return invInitial * factor + invMonthly * ((factor - 1) / r);
      };

      const grossEnd = calcFV(grossMonthlyR);
      const netEnd = calcFV(netMonthlyR);
      const feeDrag = Math.max(0, grossEnd - netEnd);
      const totalContributed = invInitial + invMonthly * months;

      return {
        promptSummary: `Net portfolio value after ${invYears} years (after ${invExpenseRatioPct}% expense ratio)`,
        mainValue: fmtUSD(netEnd),
        equation: `Gross FV: ${fmtUSD(grossEnd)} − Fee Drag (${invExpenseRatioPct}%/yr): ${fmtUSD(feeDrag)} = ${fmtUSD(netEnd)}`,
        secondaryNote: `Total Principal Contributed: ${fmtUSD(totalContributed)} · Total Net Investment Gain: ${fmtUSD(netEnd - totalContributed)}`,
      };
    }

    if (slug === 'real-rate-of-return-calculator') {
      const nom = nominalReturnPct / 100;
      const inf = inflationPct / 100;
      const realRate = (1 + nom) / (1 + inf) - 1;
      const realRatePct = realRate * 100;
      const simpleApprox = nominalReturnPct - inflationPct;
      const nominalFV = realPrincipal * Math.pow(1 + nom, realHorizonYears);
      const realPurchasingPowerFV = realPrincipal * Math.pow(1 + realRate, realHorizonYears);

      return {
        promptSummary: `True inflation-adjusted real return (${nominalReturnPct}% nominal, ${inflationPct}% inflation)`,
        mainValue: `${realRatePct.toFixed(2)}%`,
        equation: `((1 + ${nom.toFixed(4)}) ÷ (1 + ${inf.toFixed(4)})) − 1 = ${realRatePct.toFixed(2)}% (Simple approx: ${simpleApprox.toFixed(2)}%)`,
        secondaryNote: `In ${realHorizonYears} years, ${fmtUSD(realPrincipal)} grows to ${fmtUSD(nominalFV)} nominal, which equals ${fmtUSD(realPurchasingPowerFV)} in today’s purchasing power.`,
      };
    }

    if (slug === 'home-affordability-calculator') {
      const grossMonthly = annualGrossIncome / 12;
      const maxFrontEndPITI = grossMonthly * 0.28;
      const maxBackEndTotal = grossMonthly * 0.36;
      const maxAllowedPITI = Math.max(0, Math.min(maxFrontEndPITI, maxBackEndTotal - monthlyDebts));
      const maxMonthlyPI = Math.max(0, maxAllowedPITI - propertyTaxInsuranceMonthly);

      const r = mortgageRatePct / 100 / 12;
      const n = 360; // 30-year fixed
      const maxLoan =
        r > 0
          ? maxMonthlyPI * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)))
          : maxMonthlyPI * n;
      const maxHomePrice = maxLoan + downPaymentUSD;

      return {
        promptSummary: `Maximum affordable home price under the 28/36 rule`,
        mainValue: fmtUSD(maxHomePrice),
        equation: `Max Loan ${fmtUSD(maxLoan)} + Down Payment ${fmtUSD(downPaymentUSD)} = ${fmtUSD(maxHomePrice)}`,
        secondaryNote: `Max Monthly PITI Payment: ${fmtUSD(maxAllowedPITI)}/mo (Principal & Interest: ${fmtUSD(maxMonthlyPI)}/mo + Tax/Ins: ${fmtUSD(propertyTaxInsuranceMonthly)}/mo)`,
      };
    }

    if (slug === 'refinance-calculator') {
      const n = Math.max(12, refiTermYears * 12);
      const calcPmt = (ratePct: number) => {
        const r = ratePct / 100 / 12;
        if (r <= 0) return refiBalance / n;
        return (refiBalance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      };
      const oldPmt = calcPmt(refiCurrentRatePct);
      const newPmt = calcPmt(refiNewRatePct);
      const monthlySavings = oldPmt - newPmt;
      const breakEvenMonths =
        monthlySavings > 0 ? Math.ceil(refiClosingCosts / monthlySavings) : 0;
      const lifetimeNetSavings = monthlySavings * n - refiClosingCosts;

      return {
        promptSummary: `Monthly payment savings from refinancing ${fmtUSD(refiBalance)} (${refiCurrentRatePct}% → ${refiNewRatePct}%)`,
        mainValue: `${fmtUSD(Math.max(0, monthlySavings))} / mo`,
        equation: `Current: ${fmtUSD(oldPmt)}/mo − New: ${fmtUSD(newPmt)}/mo = ${fmtUSD(monthlySavings)}/mo saved`,
        secondaryNote:
          monthlySavings > 0
            ? `Break-Even Point: ${breakEvenMonths} months (${(breakEvenMonths / 12).toFixed(1)} yrs) to recoup ${fmtUSD(refiClosingCosts)} closing costs · Net Lifetime Savings: ${fmtUSD(lifetimeNetSavings)}`
            : 'New interest rate must be lower than current rate to generate monthly payment savings.',
      };
    }

    if (slug === 'rent-vs-buy-calculator') {
      const months = Math.max(12, rvbStayYears * 12);
      const downPayment = rvbHomePrice * (rvbDownPct / 100);
      const loanAmount = rvbHomePrice - downPayment;
      const r = rvbMortgageRatePct / 100 / 12;
      const n = 360;
      const monthlyPI =
        r > 0
          ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
          : loanAmount / n;
      const monthlyTaxMaint = (rvbHomePrice * 0.022) / 12; // ~1.2% property tax + 1% maintenance/ins
      const totalBuyOutflow = downPayment + (monthlyPI + monthlyTaxMaint) * months;
      const futureHomeValue = rvbHomePrice * Math.pow(1.035, rvbStayYears);
      // Remaining loan balance after `months`
      const remBalance =
        r > 0
          ? loanAmount *
            ((Math.pow(1 + r, n) - Math.pow(1 + r, months)) / (Math.pow(1 + r, n) - 1))
          : loanAmount * (1 - months / n);
      const netEquityRecovered = futureHomeValue * 0.94 - remBalance; // 6% selling cost
      const netBuyCost = Math.max(0, totalBuyOutflow - netEquityRecovered);

      // Renting with 3% annual rent increase
      let totalRentCost = 0;
      let currentRent = rvbMonthlyRent;
      for (let y = 0; y < rvbStayYears; y++) {
        totalRentCost += currentRent * 12;
        currentRent *= 1.03;
      }

      const diff = totalRentCost - netBuyCost;
      const winner = diff >= 0 ? 'Buying is cheaper' : 'Renting is cheaper';

      return {
        promptSummary: `${rvbStayYears}-year net cost comparison (${fmtUSD(rvbHomePrice)} home vs. ${fmtUSD(rvbMonthlyRent)}/mo rent)`,
        mainValue: `${winner} by ${fmtUSD(Math.abs(diff))}`,
        equation: `${rvbStayYears}-Yr Net Buy Cost: ${fmtUSD(netBuyCost)} vs. Total Rent Paid: ${fmtUSD(totalRentCost)}`,
        secondaryNote: `Estimated Monthly Mortgage (P&I): ${fmtUSD(monthlyPI)}/mo · Projected Home Value in Year ${rvbStayYears}: ${fmtUSD(futureHomeValue)}`,
      };
    }

    // margin-and-markup-calculator
    const profit = mmPrice - mmCost;
    const grossMarginPct = mmPrice > 0 ? (profit / mmPrice) * 100 : 0;
    const markupPct = mmCost > 0 ? (profit / mmCost) * 100 : 0;

    return {
      promptSummary: `Gross Margin & Markup for Cost = ${fmtUSD(mmCost, 2)} and Price = ${fmtUSD(mmPrice, 2)}`,
      mainValue: `${grossMarginPct.toFixed(2)}% Margin  |  ${markupPct.toFixed(2)}% Markup`,
      equation: `Gross Profit = ${fmtUSD(profit, 2)}  ⇒  Margin = (${fmtUSD(profit, 2)} ÷ ${fmtUSD(mmPrice, 2)}) × 100 = ${grossMarginPct.toFixed(2)}%`,
      secondaryNote: `Unit Gross Profit: ${fmtUSD(profit, 2)} · Markup over Cost: ${markupPct.toFixed(2)}% · Cost-to-Price Ratio: ${mmPrice > 0 ? ((mmCost / mmPrice) * 100).toFixed(1) : 0}%`,
    };
  }, [
    slug,
    swrPortfolio,
    swrRatePct,
    swrReturnPct,
    swrInflationPct,
    swrYears,
    invInitial,
    invMonthly,
    invYears,
    invReturnPct,
    invExpenseRatioPct,
    nominalReturnPct,
    inflationPct,
    realPrincipal,
    realHorizonYears,
    annualGrossIncome,
    monthlyDebts,
    downPaymentUSD,
    mortgageRatePct,
    propertyTaxInsuranceMonthly,
    refiBalance,
    refiCurrentRatePct,
    refiNewRatePct,
    refiTermYears,
    refiClosingCosts,
    rvbHomePrice,
    rvbDownPct,
    rvbMortgageRatePct,
    rvbMonthlyRent,
    rvbStayYears,
    mmCost,
    mmPrice,
    currency,
    symbol,
    rateFromUSD,
    applyExchangeRate,
  ]);

  const handleReset = () => {
    setSwrPortfolio(1_000_000);
    setSwrRatePct(4.0);
    setSwrReturnPct(7.0);
    setSwrInflationPct(2.5);
    setSwrYears(30);
    setInvInitial(25_000);
    setInvMonthly(500);
    setInvYears(25);
    setInvReturnPct(8.0);
    setInvExpenseRatioPct(0.65);
    setNominalReturnPct(8.5);
    setInflationPct(3.0);
    setRealPrincipal(50_000);
    setRealHorizonYears(20);
    setAnnualGrossIncome(110_000);
    setMonthlyDebts(450);
    setDownPaymentUSD(50_000);
    setMortgageRatePct(6.5);
    setPropertyTaxInsuranceMonthly(420);
    setRefiBalance(320_000);
    setRefiCurrentRatePct(7.25);
    setRefiNewRatePct(5.85);
    setRefiTermYears(30);
    setRefiClosingCosts(4_800);
    setRvbHomePrice(400_000);
    setRvbDownPct(20);
    setRvbMortgageRatePct(6.5);
    setRvbMonthlyRent(2_200);
    setRvbStayYears(7);
    setMmCost(60);
    setMmPrice(100);
  };

  const metaBySlug: Record<
    MissingFinanceSlug,
    {
      title: string;
      subtitle: string;
      heroSymbol: string;
      categoryName: string;
      categoryHref: string;
      formulaCard: {
        introText: string;
        formulaText: string;
        exampleTitle: string;
        exampleSteps: string[];
      };
      howToUseSteps: string[];
      howItWorks: {
        paragraph: string;
        formulaBox: string;
        closingNote: string;
      };
      faqs: FaqItem[];
    }
  > = {
    'safe-withdrawal-rate-calculator': {
      title: 'Safe Withdrawal Rate (4% Rule) Calculator',
      subtitle:
        'Calculate your sustainable annual and monthly retirement income, portfolio longevity, and inflation-adjusted remaining balance.',
      heroSymbol: '4%',
      categoryName: 'Retirement & Super',
      categoryHref: '/retirement-and-super',
      formulaCard: {
        introText: 'The classic 4% Safe Withdrawal Rate (Trinity Study) formula is:',
        formulaText: 'Year-1 Withdrawal = Starting Portfolio × (Withdrawal Rate % ÷ 100)',
        exampleTitle: '4% withdrawal on a $1,000,000 portfolio:',
        exampleSteps: [
          'Annual Income = $1,000,000 × 0.04 = $40,000 / year',
          'Monthly Income = $40,000 ÷ 12 = $3,333 / month',
          'Required Nest Egg for $40,000/yr = $40,000 × 25 = $1,000,000',
        ],
      },
      howToUseSteps: [
        'Enter your total retirement portfolio balance ($).',
        'Set your desired Safe Withdrawal Rate (typically 3.5% to 4.0%).',
        'Enter your expected nominal annual return and inflation rate.',
        'Review your annual/monthly retirement paycheck and projected balance after 30 years.',
      ],
      howItWorks: {
        paragraph:
          'Developed by financial planner William Bengen and popularized by the Trinity Study, the 4% rule states that withdrawing 4% of your initial portfolio in Year 1—and adjusting that dollar withdrawal for inflation each subsequent year—historically sustained a diversified stock/bond portfolio for 30 years.',
        formulaBox: 'Required Nest Egg = Annual Retirement Expenses ÷ (SWR % ÷ 100)',
        closingNote:
          'Early retirees with a 40- to 50-year horizon often use a more conservative 3.25% to 3.5% withdrawal rate to reduce sequence-of-returns risk.',
      },
      faqs: [
        {
          question: 'Why is the 4% rule also called the 25x rule?',
          answer:
            'Dividing by 4% (0.04) is mathematically identical to multiplying by 25. Therefore, needing $40,000 per year requires $40,000 × 25 = $1,000,000 saved.',
        },
        {
          question: 'Does the 4% rule account for inflation?',
          answer:
            'Yes. In the Trinity Study methodology, you take 4% of the starting portfolio in year one, and then increase that dollar withdrawal by the inflation rate each year.',
        },
      ],
    },
    'investment-growth-calculator': {
      title: 'Investment Growth & Fee Drag Calculator',
      subtitle:
        'Project long-term compound investment growth and see how annual fund expense ratios impact your final nest egg.',
      heroSymbol: '$',
      categoryName: 'Finance',
      categoryHref: '/finance',
      formulaCard: {
        introText: 'Compound growth with monthly contributions and annual expense ratio drag:',
        formulaText: 'r_net = r_gross − Expense Ratio   ;   FV = P(1+r)^n + PMT × [((1+r)^n − 1) ÷ r]',
        exampleTitle: '$25,000 initial + $500/mo for 25 years at 8% gross (0.65% fee):',
        exampleSteps: [
          'Gross Future Value (0% fee): $646,931',
          'Net Future Value (7.35% net return): $577,507',
          'Cumulative Fee Drag Lost to Expense Ratio: $69,424',
        ],
      },
      howToUseSteps: [
        'Enter your starting investment balance and monthly contribution.',
        'Select your investment horizon in years and expected gross annual return (%).',
        'Enter the fund’s annual Expense Ratio (e.g., 0.04% for an index ETF vs. 0.75% for an active fund).',
        'Compare your net portfolio value against the cumulative dollar cost of fees.',
      ],
      howItWorks: {
        paragraph:
          'Even a seemingly small 0.65% annual fund expense ratio compounds against you over decades—because you lose not only the fee deducted each year, but also all the future compounding that money would have earned.',
        formulaBox: 'Fee Drag ($) = FV(Gross Return) − FV(Gross Return − Expense Ratio)',
        closingNote:
          'Switching from a 0.75% mutual fund to a 0.04% broad-market index fund can preserve tens of thousands of dollars over a 25-year career.',
      },
      faqs: [
        {
          question: 'What is a good expense ratio for an index fund or ETF?',
          answer:
            'Broad-market S&P 500 or Total Stock Market index funds typically charge between 0.03% and 0.10% per year ($3 to $10 per $10,000 invested).',
        },
        {
          question: 'How are mutual fund expense ratios paid?',
          answer:
            'Expense ratios are deducted automatically from the fund’s net asset value (NAV) on a daily basis before returns are credited to your account.',
        },
      ],
    },
    'real-rate-of-return-calculator': {
      title: 'Real Rate of Return Calculator',
      subtitle:
        'Calculate your true inflation-adjusted rate of return using the exact Fisher equation and project real purchasing power.',
      heroSymbol: '%',
      categoryName: 'Finance',
      categoryHref: '/finance',
      formulaCard: {
        introText: 'The exact Fisher Equation for inflation-adjusted real return is:',
        formulaText: 'Real Return = [(1 + Nominal Rate) ÷ (1 + Inflation Rate)] − 1',
        exampleTitle: '8.5% nominal return with 3.0% annual inflation:',
        exampleSteps: [
          '1 + Nominal = 1.085  ;  1 + Inflation = 1.030',
          '1.085 ÷ 1.030 = 1.053398',
          'Real Rate of Return = 1.053398 − 1 = 5.34% per year',
        ],
      },
      howToUseSteps: [
        'Enter your investment’s expected Nominal Annual Return (%).',
        'Enter the expected Annual Inflation Rate (%).',
        'Optionally enter your starting principal and time horizon in years.',
        'Compare the nominal future value against your true future purchasing power in today’s dollars.',
      ],
      howItWorks: {
        paragraph:
          'While subtracting inflation from nominal return (r − i) gives a quick mental estimate, the exact Fisher equation divides (1 + r) by (1 + i) to account for the compounding interaction between investment growth and rising prices.',
        formulaBox: '1 + r_real = (1 + r_nominal) ÷ (1 + i_inflation)',
        closingNote:
          'When planning retirement spending in today’s dollars, always compound your portfolio using the Real Rate of Return.',
      },
      faqs: [
        {
          question: 'Why is the exact Fisher real return slightly lower than Nominal minus Inflation?',
          answer:
            'Because inflation also erodes the purchasing power of the investment gains you earn during the year, not just your starting principal.',
        },
        {
          question: 'Can the real rate of return be negative?',
          answer:
            'Yes. If your savings account yields 2.0% while inflation is 3.5%, your real rate of return is −1.45%, meaning your purchasing power shrinks each year.',
        },
      ],
    },
    'home-affordability-calculator': {
      title: 'Home Affordability Calculator (28/36 Rule)',
      subtitle:
        'Estimate the maximum home purchase price and monthly mortgage payment you can comfortably afford based on income and debt.',
      heroSymbol: '$',
      categoryName: 'Home & Construction',
      categoryHref: '/home-construction',
      formulaCard: {
        introText: 'The standard mortgage underwriting 28/36 Debt-to-Income (DTI) rule:',
        formulaText: 'Max Housing (PITI) ≤ 28% of Gross Monthly Income  AND  Total Debt ≤ 36%',
        exampleTitle: '$110,000 annual income ($9,167/mo) with $450/mo existing debt:',
        exampleSteps: [
          '28% Front-End Cap: $9,167 × 0.28 = $2,567 / month max PITI',
          '36% Back-End Cap minus Debt: ($9,167 × 0.36) − $450 = $2,850 / month',
          'Lower of the two limits applies: $2,567 / month total housing budget',
        ],
      },
      howToUseSteps: [
        'Enter your annual gross household income (before taxes).',
        'Enter your existing monthly debt payments (auto loans, student loans, credit cards).',
        'Enter your planned down payment ($), mortgage interest rate (%), and estimated monthly property tax/insurance.',
        'View your maximum recommended home price and monthly PITI breakdown.',
      ],
      howItWorks: {
        paragraph:
          'Conventional mortgage lenders evaluate two ratios: the Front-End ratio (housing PITI divided by gross monthly income, capped around 28%) and the Back-End ratio (housing PITI plus all other recurring monthly debts, capped around 36%).',
        formulaBox: 'Affordable Home Price = Maximum Supported Loan Principal + Down Payment',
        closingNote:
          'Keeping housing costs at or below 28% of gross income leaves room for retirement savings, utilities, and home maintenance.',
      },
      faqs: [
        {
          question: 'What does PITI stand for in a mortgage payment?',
          answer:
            'PITI stands for Principal, Interest, Property Taxes, and Homeowners Insurance—the four core components of a monthly housing payment.',
        },
        {
          question: 'Does my groceries or utility bill count toward the 36% debt limit?',
          answer:
            'No. Lenders only count contractual credit-report obligations such as car loans, student loans, minimum credit card payments, and child support.',
        },
      ],
    },
    'refinance-calculator': {
      title: 'Mortgage Refinance & Break-Even Calculator',
      subtitle:
        'Compare your current mortgage payment against a new refinance rate and calculate how many months it takes to recoup closing costs.',
      heroSymbol: '%',
      categoryName: 'Home & Construction',
      categoryHref: '/home-construction',
      formulaCard: {
        introText: 'The refinance break-even period formula is:',
        formulaText: 'Break-Even Months = Refinance Closing Costs ÷ Monthly Payment Savings',
        exampleTitle: 'Save $298/month with $4,800 in closing costs:',
        exampleSteps: [
          'Monthly Savings = Old Payment − New Payment = $298 / mo',
          'Break-Even = $4,800 ÷ $298 = 16.1 months (~1.3 years)',
          'If you keep the home longer than 17 months, refinancing saves money',
        ],
      },
      howToUseSteps: [
        'Enter your remaining mortgage balance and current interest rate (%).',
        'Enter the new refinance interest rate (%) and loan term in years.',
        'Enter the estimated total closing costs ($) for the refinance.',
        'Check your monthly savings, exact break-even month, and net lifetime interest savings.',
      ],
      howItWorks: {
        paragraph:
          'Refinancing replaces your existing mortgage with a new loan at a lower interest rate. Because refinancing involves appraisal, title, and origination fees (typically 1% to 2% of the loan), calculating the break-even month ensures you stay in the home long enough to come out ahead.',
        formulaBox: 'Net Lifetime Savings = (Monthly Savings × Total Months) − Closing Costs',
        closingNote:
          'As a rule of thumb, refinancing is most rewarding when you can lower your interest rate by at least 0.75% to 1.00% and plan to stay in the home past the break-even date.',
      },
      faqs: [
        {
          question: 'What is a good break-even timeline for a mortgage refinance?',
          answer:
            'Most homeowners aim for a break-even period of 24 to 36 months or less.',
        },
        {
          question: 'Does refinancing reset my loan term?',
          answer:
            'If you refinance into a new 30-year loan after already paying for 5 years, you extend your repayment timeline unless you choose a 20- or 15-year refinance term.',
        },
      ],
    },
    'rent-vs-buy-calculator': {
      title: 'Rent vs. Buy Home Calculator',
      subtitle:
        'Compare the net cost of buying a home versus renting over your planned stay, accounting for equity build-up, appreciation, and maintenance.',
      heroSymbol: '🏠',
      categoryName: 'Home & Construction',
      categoryHref: '/home-construction',
      formulaCard: {
        introText: 'Net Buying Cost vs. Total Renting Cost over N years:',
        formulaText: 'Net Buy Cost = Total Cash Outflow (Down + P&I + Tax/Maint) − Net Equity Recovered at Sale',
        exampleTitle: '7-Year stay in a $400,000 home vs. $2,200/month rent:',
        exampleSteps: [
          'Compare cumulative rent (with 3%/yr rent inflation) against total homeowner outlays',
          'Subtract home equity and appreciation recovered after 6% agent selling fees',
          'Identify whether buying or renting leaves you with lower net housing cost',
        ],
      },
      howToUseSteps: [
        'Enter the target home purchase price ($), down payment (%), and mortgage interest rate (%).',
        'Enter your comparable current monthly rent ($).',
        'Select how many years you plan to live in the property before moving.',
        'Compare the net cost of buying against total cumulative rent.',
      ],
      howItWorks: {
        paragraph:
          'Buying a home carries upfront and ongoing costs (down payment, mortgage interest, property taxes, maintenance, and selling fees) but builds home equity and benefits from price appreciation. Over short stays (1–3 years), transaction costs often favor renting; over longer stays (5+ years), equity accumulation often favors buying.',
        formulaBox: 'Net Equity at Sale = (Future Home Value × 0.94) − Remaining Mortgage Balance',
        closingNote:
          'This model assumes 3.5% annual home appreciation, 3.0% annual rent increases, and 2.2% annual property tax + maintenance.',
      },
      faqs: [
        {
          question: 'How many years do you usually need to stay in a home for buying to beat renting?',
          answer:
            'In most housing markets, the break-even horizon between buying and renting falls between 4 and 7 years because it takes several years of appreciation and principal paydown to offset buying and selling closing costs.',
        },
        {
          question: 'Why are selling costs deducted from home equity?',
          answer:
            'When you eventually sell a home, real estate agent commissions, transfer taxes, and title fees typically consume 5% to 6% of the sale price.',
        },
      ],
    },
    'margin-and-markup-calculator': {
      title: 'Margin & Markup Calculator',
      subtitle:
        'Calculate gross profit margin percentage, price markup percentage, and dollar unit profit from cost and selling price.',
      heroSymbol: '%',
      categoryName: 'Business',
      categoryHref: '/finance/business',
      formulaCard: {
        introText: 'The side-by-side formulas for Gross Margin and Markup are:',
        formulaText: 'Margin % = [(Price − Cost) ÷ Price] × 100   ;   Markup % = [(Price − Cost) ÷ Cost] × 100',
        exampleTitle: 'Item costs $60 and sells for $100:',
        exampleSteps: [
          'Gross Profit = $100 − $60 = $40',
          'Gross Margin = ($40 ÷ $100) × 100 = 40.00%',
          'Markup Percentage = ($40 ÷ $60) × 100 = 66.67%',
        ],
      },
      howToUseSteps: [
        'Enter your unit Cost ($) to produce or purchase the item.',
        'Enter your Selling Price ($) charged to the customer.',
        'View both Gross Margin (%) and Markup (%) side by side.',
        'Verify your unit dollar profit and cost-to-price ratio.',
      ],
      howItWorks: {
        paragraph:
          'Gross margin and markup measure the same dollar profit against two different denominators: Gross Margin divides profit by Selling Price (revenue), whereas Markup divides profit by Unit Cost. Because selling price is larger than cost for profitable items, Margin % is always numerically smaller than Markup %.',
        formulaBox: 'Margin = Profit ÷ Price   |   Markup = Profit ÷ Cost',
        closingNote:
          'A 50% markup on cost equals a 33.33% gross margin. To achieve a 50% gross margin, you need a 100% markup (doubling the cost).',
      },
      faqs: [
        {
          question: 'What is the difference between margin and markup?',
          answer:
            'Margin is profit as a percentage of the selling price, while markup is profit as a percentage of the cost.',
        },
        {
          question: 'What markup percentage gives a 40% gross margin?',
          answer:
            'A 66.67% markup over cost produces a 40.00% gross profit margin.',
        },
      ],
    },
  };

  const currentMeta = metaBySlug[slug];

  const calculatorCard = (
    <section
      id="calculator"
      aria-label={`${currentMeta.title} input panel`}
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
            {currentMeta.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Adjust the figures below to calculate your instant breakdown.
          </p>
        </div>
      </div>

      {slug === 'safe-withdrawal-rate-calculator' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="swr-port" className="block text-sm font-extrabold text-[#152238] mb-2">
              Starting Retirement Portfolio ({symbol})
            </label>
            <input
              id="swr-port"
              type="number"
              min={0}
              step={10000}
              value={swrPortfolio}
              onChange={(e) => setSwrPortfolio(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="swr-rate" className="block text-sm font-extrabold text-[#152238] mb-2">
              Safe Withdrawal Rate (%)
            </label>
            <input
              id="swr-rate"
              type="number"
              min={0.5}
              max={15}
              step={0.1}
              value={swrRatePct}
              onChange={(e) => setSwrRatePct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="swr-ret" className="block text-sm font-extrabold text-[#152238] mb-2">
              Expected Annual Return (%)
            </label>
            <input
              id="swr-ret"
              type="number"
              step={0.1}
              value={swrReturnPct}
              onChange={(e) => setSwrReturnPct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="swr-inf" className="block text-sm font-extrabold text-[#152238] mb-2">
              Expected Annual Inflation (%)
            </label>
            <input
              id="swr-inf"
              type="number"
              step={0.1}
              value={swrInflationPct}
              onChange={(e) => setSwrInflationPct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
        </div>
      )}

      {slug === 'investment-growth-calculator' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="inv-init" className="block text-sm font-extrabold text-[#152238] mb-2">
              Initial Investment ({symbol})
            </label>
            <input
              id="inv-init"
              type="number"
              min={0}
              step={1000}
              value={invInitial}
              onChange={(e) => setInvInitial(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="inv-mo" className="block text-sm font-extrabold text-[#152238] mb-2">
              Monthly Contribution ({symbol})
            </label>
            <input
              id="inv-mo"
              type="number"
              min={0}
              step={50}
              value={invMonthly}
              onChange={(e) => setInvMonthly(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="inv-yrs" className="block text-sm font-extrabold text-[#152238] mb-2">
              Investment Horizon (Years)
            </label>
            <input
              id="inv-yrs"
              type="number"
              min={1}
              max={60}
              value={invYears}
              onChange={(e) => setInvYears(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="inv-ret" className="block text-sm font-extrabold text-[#152238] mb-2">
              Gross Annual Return (%)
            </label>
            <input
              id="inv-ret"
              type="number"
              step={0.1}
              value={invReturnPct}
              onChange={(e) => setInvReturnPct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="inv-fee" className="block text-sm font-extrabold text-[#152238] mb-2">
              Annual Fund Expense Ratio (%)
            </label>
            <input
              id="inv-fee"
              type="number"
              min={0}
              max={5}
              step={0.05}
              value={invExpenseRatioPct}
              onChange={(e) => setInvExpenseRatioPct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
        </div>
      )}

      {slug === 'real-rate-of-return-calculator' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="rr-nom" className="block text-sm font-extrabold text-[#152238] mb-2">
              Nominal Annual Return (%)
            </label>
            <input
              id="rr-nom"
              type="number"
              step={0.1}
              value={nominalReturnPct}
              onChange={(e) => setNominalReturnPct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="rr-inf" className="block text-sm font-extrabold text-[#152238] mb-2">
              Annual Inflation Rate (%)
            </label>
            <input
              id="rr-inf"
              type="number"
              step={0.1}
              value={inflationPct}
              onChange={(e) => setInflationPct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="rr-prin" className="block text-sm font-extrabold text-[#152238] mb-2">
              Starting Principal ({symbol})
            </label>
            <input
              id="rr-prin"
              type="number"
              min={0}
              step={1000}
              value={realPrincipal}
              onChange={(e) => setRealPrincipal(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="rr-yrs" className="block text-sm font-extrabold text-[#152238] mb-2">
              Projection Years
            </label>
            <input
              id="rr-yrs"
              type="number"
              min={1}
              max={60}
              value={realHorizonYears}
              onChange={(e) => setRealHorizonYears(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
        </div>
      )}

      {slug === 'home-affordability-calculator' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="ha-inc" className="block text-sm font-extrabold text-[#152238] mb-2">
              Annual Gross Income ({symbol})
            </label>
            <input
              id="ha-inc"
              type="number"
              min={0}
              step={5000}
              value={annualGrossIncome}
              onChange={(e) => setAnnualGrossIncome(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="ha-debt" className="block text-sm font-extrabold text-[#152238] mb-2">
              Monthly Debt Payments ({symbol})
            </label>
            <input
              id="ha-debt"
              type="number"
              min={0}
              step={50}
              value={monthlyDebts}
              onChange={(e) => setMonthlyDebts(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="ha-down" className="block text-sm font-extrabold text-[#152238] mb-2">
              Down Payment ({symbol})
            </label>
            <input
              id="ha-down"
              type="number"
              min={0}
              step={5000}
              value={downPaymentUSD}
              onChange={(e) => setDownPaymentUSD(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="ha-rate" className="block text-sm font-extrabold text-[#152238] mb-2">
              30-Year Mortgage Rate (%)
            </label>
            <input
              id="ha-rate"
              type="number"
              min={0.5}
              max={20}
              step={0.1}
              value={mortgageRatePct}
              onChange={(e) => setMortgageRatePct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="ha-tax" className="block text-sm font-extrabold text-[#152238] mb-2">
              Monthly Property Tax & Home Insurance ({symbol})
            </label>
            <input
              id="ha-tax"
              type="number"
              min={0}
              step={25}
              value={propertyTaxInsuranceMonthly}
              onChange={(e) => setPropertyTaxInsuranceMonthly(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
        </div>
      )}

      {slug === 'refinance-calculator' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="ref-bal" className="block text-sm font-extrabold text-[#152238] mb-2">
              Remaining Loan Balance ({symbol})
            </label>
            <input
              id="ref-bal"
              type="number"
              min={1000}
              step={5000}
              value={refiBalance}
              onChange={(e) => setRefiBalance(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="ref-old" className="block text-sm font-extrabold text-[#152238] mb-2">
              Current Interest Rate (%)
            </label>
            <input
              id="ref-old"
              type="number"
              step={0.05}
              value={refiCurrentRatePct}
              onChange={(e) => setRefiCurrentRatePct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="ref-new" className="block text-sm font-extrabold text-[#152238] mb-2">
              New Refinance Rate (%)
            </label>
            <input
              id="ref-new"
              type="number"
              step={0.05}
              value={refiNewRatePct}
              onChange={(e) => setRefiNewRatePct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="ref-cost" className="block text-sm font-extrabold text-[#152238] mb-2">
              Refinance Closing Costs ({symbol})
            </label>
            <input
              id="ref-cost"
              type="number"
              min={0}
              step={200}
              value={refiClosingCosts}
              onChange={(e) => setRefiClosingCosts(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
        </div>
      )}

      {slug === 'rent-vs-buy-calculator' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="rvb-price" className="block text-sm font-extrabold text-[#152238] mb-2">
              Home Purchase Price ({symbol})
            </label>
            <input
              id="rvb-price"
              type="number"
              min={10000}
              step={10000}
              value={rvbHomePrice}
              onChange={(e) => setRvbHomePrice(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="rvb-down" className="block text-sm font-extrabold text-[#152238] mb-2">
              Down Payment (%)
            </label>
            <input
              id="rvb-down"
              type="number"
              min={0}
              max={90}
              step={1}
              value={rvbDownPct}
              onChange={(e) => setRvbDownPct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="rvb-rent" className="block text-sm font-extrabold text-[#152238] mb-2">
              Comparable Monthly Rent ({symbol})
            </label>
            <input
              id="rvb-rent"
              type="number"
              min={100}
              step={100}
              value={rvbMonthlyRent}
              onChange={(e) => setRvbMonthlyRent(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="rvb-yrs" className="block text-sm font-extrabold text-[#152238] mb-2">
              Planned Stay Duration (Years)
            </label>
            <input
              id="rvb-yrs"
              type="number"
              min={1}
              max={30}
              value={rvbStayYears}
              onChange={(e) => setRvbStayYears(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
        </div>
      )}

      {slug === 'margin-and-markup-calculator' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="mm-cost" className="block text-sm font-extrabold text-[#152238] mb-2">
              Unit Cost ({symbol})
            </label>
            <input
              id="mm-cost"
              type="number"
              min={0.01}
              step="any"
              value={mmCost}
              onChange={(e) => setMmCost(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="mm-price" className="block text-sm font-extrabold text-[#152238] mb-2">
              Selling Price ({symbol})
            </label>
            <input
              id="mm-price"
              type="number"
              min={0.01}
              step="any"
              value={mmPrice}
              onChange={(e) => setMmPrice(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-1">
        <button
          type="button"
          onClick={() => {}}
          className="sm:col-span-8 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#2457D6] hover:bg-[#1D46B0] text-white text-base font-extrabold shadow-xs transition-colors cursor-pointer"
        >
          <Calculator className="w-5 h-5" />
          <span>Calculate Result</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="sm:col-span-4 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] text-base font-extrabold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </section>
  );

  return (
    <SingleCalculatorPageShell
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: currentMeta.categoryName, href: currentMeta.categoryHref },
        { label: currentMeta.title },
      ]}
      title={currentMeta.title}
      subtitle={currentMeta.subtitle}
      heroSymbol={currentMeta.heroSymbol}
      heroBadgeBg="bg-[#E6F6F1]"
      heroBadgeColor="text-[#16856B]"
      categoryName={currentMeta.categoryName}
      categoryHref={currentMeta.categoryHref}
      otherCalculatorsTitle="Related Finance & Retirement Calculators"
      otherCalculators={FINANCE_RELATED_LINKS}
      relatedCalculators={FINANCE_RELATED_LINKS.slice(0, 4)}
      calculatorCard={calculatorCard}
      resultCard={{
        promptSummary: computed.promptSummary,
        promptSuffix: 'is:',
        mainValue: computed.mainValue,
        equation: computed.equation,
        secondaryNote: computed.secondaryNote,
      }}
      formulaCard={currentMeta.formulaCard}
      howToUseSteps={currentMeta.howToUseSteps}
      howItWorks={currentMeta.howItWorks}
      understandingResult={{
        paragraph: (
          <>
            Based on your inputs, your result is{' '}
            <strong className="font-bold text-[#152238]">{computed.mainValue}</strong>.{' '}
            {computed.secondaryNote}
          </>
        ),
      }}
      faqs={currentMeta.faqs}
    />
  );
}
