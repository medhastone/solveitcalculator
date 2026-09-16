'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';

interface PopularTool {
  id: string;
  title: string;
  tag: string;
  badgeType: 'primary' | 'secondary' | 'tertiary' | 'default';
  desc: string;
  icon: string;
  category: string;
  actionText: string;
  preset: {
    amount: number;
    rate: number;
    years: number;
    extra: number;
    freq: string;
  };
}

interface ScenarioData {
  id: string;
  title: string;
  icon: string;
  iconColor: 'primary' | 'secondary' | 'neutral' | 'tertiary';
  desc: string;
  actionLabel: string;
  analysisTitle: string;
  opportunityBadge: string;
  metric1Label: string;
  metric1Value: string;
  metric1Desc: string;
  metric2Label: string;
  metric2Value: string;
  metric2Desc: string;
  metric3Label: string;
  metric3Value: string;
  metric3Desc: string;
  preset: {
    amount: number;
    rate: number;
    years: number;
    extra: number;
    freq: string;
  };
}

const POPULAR_TOOLS: PopularTool[] = [
  {
    id: 'tool-loan-calc',
    title: 'Loan Calculator',
    tag: 'General',
    badgeType: 'default',
    desc: 'Calculate monthly payments and total interest for any fixed installment loan.',
    icon: 'calculate',
    category: 'monthly-payments installment-plans all',
    actionText: 'Calculate Now',
    preset: { amount: 25000, rate: 6.5, years: 5, extra: 0, freq: '12' },
  },
  {
    id: 'tool-emi-calc',
    title: 'EMI Calculator',
    tag: 'Monthly Plan',
    badgeType: 'secondary',
    desc: 'Find your equal monthly installments on home, car, or personal bank loans.',
    icon: 'event_repeat',
    category: 'monthly-payments installment-plans all',
    actionText: 'Calculate Payment',
    preset: { amount: 30000, rate: 7.2, years: 5, extra: 50, freq: '12' },
  },
  {
    id: 'tool-amort-sched',
    title: 'Amortization Schedule',
    tag: 'Schedule',
    badgeType: 'default',
    desc: 'Full month-by-month payment schedule showing principal, interest, and payoff dates.',
    icon: 'table_chart',
    category: 'amortization-tables all',
    actionText: 'View Schedule',
    preset: { amount: 50000, rate: 6.0, years: 10, extra: 100, freq: '12' },
  },
  {
    id: 'tool-student-loan',
    title: 'Student Loan Calculator',
    tag: 'Education',
    badgeType: 'default',
    desc: 'Calculate college repayment plans, grace periods, and interest for federal and private debt.',
    icon: 'school',
    category: 'student-loans all',
    actionText: 'Calculate Payment',
    preset: { amount: 37000, rate: 5.5, years: 10, extra: 75, freq: '12' },
  },
  {
    id: 'tool-auto-loan',
    title: 'Auto Loan Calculator',
    tag: 'Vehicles',
    badgeType: 'default',
    desc: 'Estimate monthly payments including trade-in allowance, down payment, and sales tax.',
    icon: 'directions_car',
    category: 'auto-leases all',
    actionText: 'Calculate Payment',
    preset: { amount: 28000, rate: 6.2, years: 5, extra: 100, freq: '12' },
  },
  {
    id: 'tool-car-lease',
    title: 'Car Lease Calculator',
    tag: 'Leasing',
    badgeType: 'default',
    desc: 'Compute monthly car lease costs using depreciation, residual values, and money factors.',
    icon: 'car_rental',
    category: 'auto-leases all',
    actionText: 'Open Calculator',
    preset: { amount: 35000, rate: 4.8, years: 3, extra: 0, freq: '12' },
  },
  {
    id: 'tool-mortgage-calc',
    title: 'Mortgage Calculator',
    tag: 'Home',
    badgeType: 'default',
    desc: 'Complete home loan calculations factoring principal, interest, taxes, and insurance.',
    icon: 'real_estate_agent',
    category: 'mortgages amortization-tables all',
    actionText: 'Calculate Payment',
    preset: { amount: 380000, rate: 6.75, years: 30, extra: 200, freq: '12' },
  },
  {
    id: 'tool-refinance-calc',
    title: 'Refinancing Calculator',
    tag: 'Savings',
    badgeType: 'default',
    desc: 'Find your exact break-even point and lifetime savings when refinancing at a lower interest rate.',
    icon: 'autorenew',
    category: 'refinancing all',
    actionText: 'Calculate Savings',
    preset: { amount: 220000, rate: 5.25, years: 15, extra: 150, freq: '12' },
  },
  {
    id: 'tool-debt-consolidation',
    title: 'Debt Consolidation',
    tag: 'Consolidation',
    badgeType: 'default',
    desc: 'Combine multiple high-interest cards or personal loans into one single lower-rate payment.',
    icon: 'call_merge',
    category: 'debt-payoff installment-plans all',
    actionText: 'Open Calculator',
    preset: { amount: 24000, rate: 8.9, years: 4, extra: 100, freq: '12' },
  },
  {
    id: 'tool-personal-loan',
    title: 'Personal Loan Calculator',
    tag: 'Personal',
    badgeType: 'default',
    desc: 'Evaluate unsecured loan offers, lender fees, and total repayment costs upfront.',
    icon: 'person_check',
    category: 'installment-plans monthly-payments all',
    actionText: 'Calculate Payment',
    preset: { amount: 15000, rate: 9.5, years: 3, extra: 50, freq: '12' },
  },
  {
    id: 'tool-loan-payoff',
    title: 'Loan Payoff Calculator',
    tag: 'Freedom Date',
    badgeType: 'default',
    desc: 'Discover the exact calendar date you become 100% debt-free with custom payments.',
    icon: 'flag_check',
    category: 'debt-payoff amortization-tables all',
    actionText: 'View Schedule',
    preset: { amount: 45000, rate: 6.8, years: 7, extra: 150, freq: '12' },
  },
  {
    id: 'tool-extra-payment',
    title: 'Extra Payment Calculator',
    tag: 'Extra Payments',
    badgeType: 'tertiary',
    desc: 'See how one-time lump sums or small recurring additions shave months off your loan.',
    icon: 'add_circle',
    category: 'debt-payoff amortization-tables all',
    actionText: 'Calculate Savings',
    preset: { amount: 25000, rate: 6.5, years: 5, extra: 200, freq: '12' },
  },
];

const SCENARIOS: ScenarioData[] = [
  {
    id: 'auto-extra',
    title: 'Extra $100/mo on an Auto Loan',
    icon: 'payments',
    iconColor: 'primary',
    desc: 'See how an extra $100 each month pays off a $28,000 car note nearly a full year early.',
    actionLabel: 'Calculate Savings →',
    analysisTitle: 'Adding $100/mo to a $28,000 Auto Loan (60 Mo @ 6.2%)',
    opportunityBadge: 'High Savings Opportunity',
    metric1Label: 'Total Interest Saved',
    metric1Value: '$1,024.40',
    metric1Desc: 'Cuts total interest costs by over 22% over the lifespan of the car loan.',
    metric2Label: 'Time Saved',
    metric2Value: '11 Months',
    metric2Desc: 'Pay off your vehicle completely in 49 months instead of 60 months.',
    metric3Label: 'Recommended Action',
    metric3Value: 'Apply Directly to Principal',
    metric3Desc: "Ask your loan servicer to credit extra payments as 'principal only' rather than prepaid next month.",
    preset: { amount: 28000, rate: 6.2, years: 5, extra: 100, freq: '12' },
  },
  {
    id: 'student-refi',
    title: 'Refinance Student Debt',
    icon: 'trending_down',
    iconColor: 'secondary',
    desc: 'Compare reducing a 7.2% student loan down to 5.4% against upfront refinancing fees.',
    actionLabel: 'Calculate Savings →',
    analysisTitle: 'Refinancing $45,000 Student Loan (7.2% → 5.4% over 10 Years)',
    opportunityBadge: 'Break-even in 7 Months',
    metric1Label: 'Total Interest Saved',
    metric1Value: '$4,860.00',
    metric1Desc: 'Substantial interest reduction across the 120-month repayment window.',
    metric2Label: 'Monthly Cash Flow Freed',
    metric2Value: '$46.20/mo',
    metric2Desc: 'Lowers mandatory baseline payment while accelerating principal debt paydown.',
    metric3Label: 'Recommended Action',
    metric3Value: 'Confirm Federal Protection Loss',
    metric3Desc: 'Private refi loses federal income-driven plans (SAVE) and public service forgiveness.',
    preset: { amount: 45000, rate: 5.4, years: 10, extra: 50, freq: '12' },
  },
  {
    id: 'lease-vs-buy',
    title: 'Lease vs. Buy a Car',
    icon: 'directions_car',
    iconColor: 'neutral',
    desc: 'Compare 3-year lease payments against the long-term trade-in value of buying.',
    actionLabel: 'See Comparison →',
    analysisTitle: '3-Year Lease ($420/mo) vs. 5-Year Purchase ($580/mo) on $36k Vehicle',
    opportunityBadge: 'Long-term Equity Advantage',
    metric1Label: 'Equity at Year 5',
    metric1Value: '+$14,200',
    metric1Desc: 'Purchased vehicle retains resale/trade-in value, whereas leases yield zero equity.',
    metric2Label: 'Initial 36-Month Cost',
    metric2Value: 'Lease saves $160/mo',
    metric2Desc: 'Lease yields lower monthly cash outlays during initial 36-month warranty period.',
    metric3Label: 'Recommended Action',
    metric3Value: 'Buy if Driving > 12k Miles/Yr',
    metric3Desc: 'High mileage penalties (15¢–25¢/mile) often negate lease upfront discounts.',
    preset: { amount: 36000, rate: 5.9, years: 5, extra: 0, freq: '12' },
  },
  {
    id: 'snowball-avalanche',
    title: 'Debt Snowball vs. Avalanche',
    icon: 'balance',
    iconColor: 'tertiary',
    desc: 'Weigh paying smallest debts first for quick motivation versus targeting high-interest debt.',
    actionLabel: 'See Comparison →',
    analysisTitle: 'Avalanche Mathematical Optimum vs. Snowball Behavioral Acceleration',
    opportunityBadge: 'Avalanche Saves $1,420+ More',
    metric1Label: 'Interest Savings Edge',
    metric1Value: '$1,420.00',
    metric1Desc: 'Avalanche mathematically minimizes interest by paying 22% credit card APR first.',
    metric2Label: 'First Payoff Milestone',
    metric2Value: 'Snowball: 3.5 Months',
    metric2Desc: 'Snowball knocks out small $1,200 medical bill first, boosting psychological commitment.',
    metric3Label: 'Recommended Action',
    metric3Value: 'Hybrid Strategy',
    metric3Desc: 'Clear 1 small emotional balance first, then immediately switch to highest-APR Avalanche.',
    preset: { amount: 18500, rate: 14.5, years: 3, extra: 150, freq: '12' },
  },
];

const DIRECTORY_CLUSTERS = [
  {
    id: 'cluster-repayment',
    title: 'Loan Repayment (10)',
    icon: 'payments',
    iconColor: 'text-primary',
    desc: 'Monthly payment calculations, total borrowing costs, and interest breakdowns.',
    tools: [
      { name: 'Loan Calculator', amount: 25000, rate: 6.5, years: 5 },
      { name: 'Loan Repayment Calculator', amount: 30000, rate: 7.0, years: 5 },
      { name: 'Loan Payment Calculator', amount: 20000, rate: 6.2, years: 4 },
      { name: 'Interest Calculator', amount: 15000, rate: 8.5, years: 3 },
      { name: 'Loan Cost Calculator', amount: 40000, rate: 6.8, years: 7 },
      { name: 'Borrowing Cost Calculator', amount: 35000, rate: 7.5, years: 5 },
      { name: 'Loan Term Calculator', amount: 50000, rate: 6.0, years: 10 },
      { name: 'Remaining Balance Calculator', amount: 22000, rate: 6.5, years: 4 },
      { name: 'Loan Comparison Calculator', amount: 45000, rate: 5.9, years: 6 },
      { name: 'Loan Affordability Calculator', amount: 28000, rate: 6.5, years: 5 },
    ],
  },
  {
    id: 'cluster-installment',
    title: 'Installment & Monthly Loans (10)',
    icon: 'event_repeat',
    iconColor: 'text-secondary',
    desc: 'Equal monthly payment models, reducing balances, and simple installment comparisons.',
    tools: [
      { name: 'EMI Calculator', amount: 25000, rate: 7.2, years: 5 },
      { name: 'Monthly Payment Calculator', amount: 20000, rate: 6.5, years: 5 },
      { name: 'Loan Installment Calculator', amount: 15000, rate: 8.0, years: 3 },
      { name: 'Reducing Balance Calculator', amount: 35000, rate: 6.9, years: 5 },
      { name: 'Flat Rate Loan Calculator', amount: 20000, rate: 5.5, years: 4 },
      { name: 'Installment Affordability', amount: 18000, rate: 7.5, years: 3 },
      { name: 'Monthly Offer Comparison', amount: 30000, rate: 6.8, years: 5 },
      { name: 'Early Prepayment Calculator', amount: 25000, rate: 6.5, years: 5 },
      { name: 'Payment Savings Calculator', amount: 40000, rate: 6.2, years: 6 },
      { name: 'Principal vs Interest Split', amount: 28000, rate: 7.0, years: 5 },
    ],
  },
  {
    id: 'cluster-amortization',
    title: 'Amortization Tables (10)',
    icon: 'table_chart',
    iconColor: 'text-primary',
    desc: 'Detailed payment tables, biweekly schedules, and payoff projections.',
    tools: [
      { name: 'Amortization Calculator', amount: 50000, rate: 6.5, years: 10 },
      { name: 'Loan Amortization Schedule', amount: 40000, rate: 6.0, years: 7 },
      { name: 'Mortgage Amortization Schedule', amount: 350000, rate: 6.75, years: 30 },
      { name: 'Auto Loan Amortization', amount: 28000, rate: 5.9, years: 5 },
      { name: 'Student Loan Amortization', amount: 35000, rate: 5.5, years: 10 },
      { name: 'Extra Payment Schedule', amount: 30000, rate: 6.5, years: 5 },
      { name: 'Biweekly Payment Calculator', amount: 45000, rate: 6.2, years: 7 },
      { name: 'Accelerated Payoff Calculator', amount: 32000, rate: 6.8, years: 5 },
      { name: 'Interest Savings Calculator', amount: 25000, rate: 6.5, years: 5 },
      { name: 'Payoff Date Estimator', amount: 20000, rate: 7.0, years: 4 },
    ],
  },
  {
    id: 'cluster-student',
    title: 'Student Debt (10)',
    icon: 'school',
    iconColor: 'text-tertiary',
    desc: 'Federal and private loans, repayment plans, and refinancing calculators.',
    tools: [
      { name: 'Student Loan Calculator', amount: 37000, rate: 5.5, years: 10 },
      { name: 'Monthly Student Payment', amount: 28000, rate: 5.0, years: 10 },
      { name: 'Student Interest Calculator', amount: 45000, rate: 6.2, years: 10 },
      { name: 'College Repayment Plans', amount: 50000, rate: 5.8, years: 15 },
      { name: 'Student Payoff Calculator', amount: 32000, rate: 5.2, years: 7 },
      { name: 'Student Loan Refinancing', amount: 40000, rate: 4.9, years: 10 },
      { name: 'College Loan Schedule', amount: 35000, rate: 5.5, years: 10 },
      { name: 'Extra Student Payment', amount: 25000, rate: 6.0, years: 8 },
      { name: 'Graduation Debt Planner', amount: 48000, rate: 5.4, years: 12 },
      { name: 'Student Debt-Free Timeline', amount: 30000, rate: 5.0, years: 6 },
    ],
  },
  {
    id: 'cluster-auto',
    title: 'Auto Loans (10)',
    icon: 'directions_car',
    iconColor: 'text-primary',
    desc: 'Financing estimates for new and used cars, trade-ins, and down payments.',
    tools: [
      { name: 'Auto Loan Calculator', amount: 28000, rate: 6.2, years: 5 },
      { name: 'Car Loan Calculator', amount: 32000, rate: 5.8, years: 5 },
      { name: 'Vehicle Finance Calculator', amount: 25000, rate: 6.5, years: 4 },
      { name: 'Used Car Loan Calculator', amount: 18000, rate: 7.9, years: 4 },
      { name: 'New Car Loan Calculator', amount: 42000, rate: 5.2, years: 5 },
      { name: 'Auto Refinance Tool', amount: 24000, rate: 4.8, years: 4 },
      { name: 'Car Monthly Payment', amount: 27000, rate: 6.0, years: 5 },
      { name: 'Car Affordability Calculator', amount: 30000, rate: 6.2, years: 5 },
      { name: 'Trade-In Value Estimator', amount: 22000, rate: 5.9, years: 4 },
      { name: 'Down Payment Savings', amount: 35000, rate: 6.0, years: 5 },
    ],
  },
  {
    id: 'cluster-leasing',
    title: 'Auto Leasing (9)',
    icon: 'car_rental',
    iconColor: 'text-secondary',
    desc: 'Lease payments, lease vs buy comparisons, and mileage fees.',
    tools: [
      { name: 'Car Lease Calculator', amount: 35000, rate: 4.8, years: 3 },
      { name: 'Auto Lease Estimator', amount: 40000, rate: 4.5, years: 3 },
      { name: 'Lease vs Buy Calculator', amount: 32000, rate: 5.5, years: 3 },
      { name: 'Lease Monthly Cost', amount: 28000, rate: 4.9, years: 3 },
      { name: 'Mileage Penalty Calculator', amount: 30000, rate: 5.0, years: 3 },
      { name: 'Lease Buyout Calculator', amount: 22000, rate: 5.8, years: 3 },
      { name: 'Residual Value Estimator', amount: 36000, rate: 4.6, years: 3 },
      { name: 'Lease Budget Calculator', amount: 25000, rate: 5.1, years: 3 },
      { name: 'Vehicle Lease Comparison', amount: 38000, rate: 4.7, years: 3 },
    ],
  },
];

interface AnnualLedgerRow {
  year: number;
  startingBalance: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export default function LoansAndAmortizationClient() {
  // Workbench state
  const [inputAmount, setInputAmount] = useState<number>(25000);
  const [inputRate, setInputRate] = useState<number>(6.5);
  const [currentTermYears, setCurrentTermYears] = useState<number>(5);
  const [inputFrequency, setInputFrequency] = useState<string>('12');
  const [inputExtra, setInputExtra] = useState<number>(100);

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Scenario state
  const [activeScenarioId, setActiveScenarioId] = useState<string>('auto-extra');

  // Scroll ref for calculator
  const workbenchRef = useRef<HTMLDivElement>(null);

  const scrollToWorkbench = () => {
    workbenchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Reset workbench
  const handleReset = () => {
    setInputAmount(25000);
    setInputRate(6.5);
    setCurrentTermYears(5);
    setInputFrequency('12');
    setInputExtra(100);
  };

  // Apply preset to workbench
  const applyPreset = (preset: {
    amount: number;
    rate: number;
    years: number;
    extra: number;
    freq: string;
  }) => {
    setInputAmount(preset.amount);
    setInputRate(preset.rate);
    setCurrentTermYears(preset.years);
    setInputExtra(preset.extra);
    setInputFrequency(preset.freq);
    scrollToWorkbench();
  };

  // Active scenario object
  const currentScenario = useMemo(() => {
    return SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];
  }, [activeScenarioId]);

  // Main calculation logic
  const calculationResults = useMemo(() => {
    const principal = Math.max(0, inputAmount);
    const annualRate = Math.max(0.01, inputRate);
    const extraMonthly = Math.max(0, inputExtra);
    const totalMonths = Math.max(1, currentTermYears * 12);

    const monthlyRate = annualRate / 100 / 12;

    // Standard formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const rFactor = Math.pow(1 + monthlyRate, totalMonths);
    const baseMonthly =
      rFactor > 1
        ? (principal * (monthlyRate * rFactor)) / (rFactor - 1)
        : principal / totalMonths;

    const baseTotalInterest = Math.max(0, baseMonthly * totalMonths - principal);

    // Amortization simulation with extra payment
    let balance = principal;
    let months = 0;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;

    const isAccelBiweekly = inputFrequency === '26-accel';
    // Accelerated biweekly pays half of monthly payment every 2 weeks = 26 half-payments = 13 full payments/year
    const monthlyExtraEffective = isAccelBiweekly
      ? extraMonthly + (baseMonthly / 12)
      : extraMonthly;

    const totalMonthlyPayment = baseMonthly + monthlyExtraEffective;

    const yearlyRows: AnnualLedgerRow[] = [];
    let currentYearStartingBal = balance;
    let currentYearPrincipal = 0;
    let currentYearInterest = 0;
    let currentYearNumber = 1;

    // Balance curve data for SVG
    const balanceSamples: number[] = [principal];
    const interestSamples: number[] = [0];

    while (balance > 0.01 && months < 600) {
      months++;
      const interestThisMonth = balance * monthlyRate;
      totalInterestPaid += interestThisMonth;

      let paymentThisMonth = totalMonthlyPayment;
      if (balance + interestThisMonth < paymentThisMonth) {
        paymentThisMonth = balance + interestThisMonth;
      }

      const principalThisMonth = Math.max(0, paymentThisMonth - interestThisMonth);
      balance = Math.max(0, balance - principalThisMonth);
      totalPrincipalPaid += principalThisMonth;

      currentYearPrincipal += principalThisMonth;
      currentYearInterest += interestThisMonth;

      // Sample curve at key intervals or yearly
      if (months % 12 === 0 || balance <= 0.01) {
        balanceSamples.push(balance);
        interestSamples.push(totalInterestPaid);

        yearlyRows.push({
          year: currentYearNumber,
          startingBalance: currentYearStartingBal,
          principalPaid: currentYearPrincipal,
          interestPaid: currentYearInterest,
          endingBalance: balance,
        });

        currentYearNumber++;
        currentYearStartingBal = balance;
        currentYearPrincipal = 0;
        currentYearInterest = 0;
      }
    }

    const interestSaved = Math.max(0, baseTotalInterest - totalInterestPaid);
    const monthsSaved = Math.max(0, totalMonths - months);
    const yearsResult = Math.floor(months / 12);
    const remainingMonths = months % 12;

    // Generate SVG curve paths
    // Canvas: viewbox 0 0 500 150
    const maxBalance = principal || 1;
    const maxInterest = Math.max(baseTotalInterest, totalInterestPaid, 1);

    // Balance curve path
    const sampleCount = balanceSamples.length;
    let pathBalance = `M 0,20`;
    let areaBalance = `M 0,20`;

    balanceSamples.forEach((bal, idx) => {
      const x = (idx / Math.max(1, sampleCount - 1)) * 500;
      const y = 20 + (1 - bal / maxBalance) * 130;
      pathBalance += ` L ${x.toFixed(1)},${y.toFixed(1)}`;
      areaBalance += ` L ${x.toFixed(1)},${y.toFixed(1)}`;
    });
    areaBalance += ` L 500,150 L 0,150 Z`;

    // Interest curve path
    let pathInterest = `M 0,150`;
    interestSamples.forEach((intAmt, idx) => {
      const x = (idx / Math.max(1, sampleCount - 1)) * 500;
      const y = 150 - (intAmt / maxInterest) * 60;
      pathInterest += ` L ${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return {
      baseMonthly,
      totalMonthlyPayment,
      baseTotalInterest,
      totalInterestPaid,
      interestSaved,
      totalCost: principal + totalInterestPaid,
      payoffYears: yearsResult,
      payoffMonths: remainingMonths,
      monthsSaved,
      totalMonths,
      actualMonths: months,
      yearlyRows,
      pathBalance,
      areaBalance,
      pathInterest,
    };
  }, [inputAmount, inputRate, currentTermYears, inputFrequency, inputExtra]);

  // CSV export handler
  const handleDownloadCsv = () => {
    const headers = ['Year', 'Starting Balance', 'Principal Paid', 'Interest Paid', 'Ending Balance'];
    const rows = calculationResults.yearlyRows.map((r) => [
      `Year ${r.year}`,
      r.startingBalance.toFixed(2),
      r.principalPaid.toFixed(2),
      r.interestPaid.toFixed(2),
      r.endingBalance.toFixed(2),
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `loans_amortization_schedule_${inputAmount}_${currentTermYears}yr.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Filtered tools
  const filteredPopularTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return POPULAR_TOOLS.filter((tool) => {
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.tag.toLowerCase().includes(q);

      const matchesFilter =
        selectedFilter === 'all' || tool.category.includes(selectedFilter);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  // Filtered directory clusters
  const filteredClusters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return DIRECTORY_CLUSTERS;

    return DIRECTORY_CLUSTERS.map((cluster) => {
      const matchingTools = cluster.tools.filter((t) =>
        t.name.toLowerCase().includes(q)
      );
      return {
        ...cluster,
        tools: matchingTools,
      };
    }).filter(
      (cluster) =>
        cluster.tools.length > 0 ||
        cluster.title.toLowerCase().includes(q) ||
        cluster.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filterButtons = [
    { label: 'All Tools (104)', filter: 'all' },
    { label: 'Monthly Payments', filter: 'monthly-payments' },
    { label: 'Installment Plans', filter: 'installment-plans' },
    { label: 'Amortization Tables', filter: 'amortization-tables' },
    { label: 'Student Loans', filter: 'student-loans' },
    { label: 'Auto & Leases', filter: 'auto-leases' },
    { label: 'Mortgages', filter: 'mortgages' },
    { label: 'Refinancing', filter: 'refinancing' },
    { label: 'Debt Payoff', filter: 'debt-payoff' },
  ];

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col">
      

      <main className="w-full pt-16 bg-surface flex-1">
        {/* SECTION 1: HERO & FILTERS */}
        <section className="w-full bg-surface-bright py-space-xl border-b border-surface-container-high/60">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumbs"
              className="flex items-center gap-space-xs text-sm text-on-surface-variant mb-space-md"
            >
              <Link
                className="hover:text-primary transition-colors flex items-center gap-1"
                href="/"
              >
                <span className="material-symbols-outlined text-[16px]">home</span>
                Home
              </Link>
              <span className="text-outline-variant font-data-mono">/</span>
              <Link className="hover:text-primary transition-colors" href="/finance">
                Financial Calculators
              </Link>
              <span className="text-outline-variant font-data-mono">/</span>
              <span className="text-on-surface font-medium">Loans &amp; Amortization</span>
            </nav>

            {/* Hero Heading & Subtitle */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-xl">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-space-xs py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-xs uppercase tracking-wider mb-space-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px]">account_balance</span>
                  Consumer &amp; Mortgage Debt Planning
                </div>
                <h1 className="font-headline-lg text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-space-xs">
                  Loans &amp; Amortization Calculators
                </h1>
                <p className="text-on-surface-variant text-base md:text-lg">
                  Calculate loan payments, monthly schedules, early payoff savings, car leases, and
                  debt payoff timelines with instant, accurate results.
                </p>
              </div>

              {/* Verification Badge */}
              <div className="flex items-center gap-space-sm bg-surface-container-lowest p-space-sm rounded-xl shadow-sm shrink-0 border border-surface-container-high">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">verified_user</span>
                </div>
                <div>
                  <div className="font-label-caps text-xs text-primary font-semibold uppercase">
                    Consumer Protection
                  </div>
                  <div className="font-data-mono text-xs text-on-surface font-medium">
                    Truth in Lending Act Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container-high">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline">
                  search
                </span>
                <input
                  className="w-full pl-12 pr-space-md py-3 rounded-xl bg-surface-container-low text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
                  placeholder="Search loan calculators, monthly payment tools, extra payment plans..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-on-surface px-2 py-1 bg-surface-container rounded"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {filterButtons.map((btn) => {
                  const isActive = selectedFilter === btn.filter;
                  return (
                    <button
                      key={btn.filter}
                      onClick={() => setSelectedFilter(btn.filter)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE LOAN CALCULATOR */}
        <section ref={workbenchRef} className="w-full bg-surface py-space-2xl scroll-mt-20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex items-center justify-between mb-space-lg">
              <div>
                <span className="font-label-caps text-xs text-primary font-semibold uppercase">
                  Instant Calculator
                </span>
                <h2 className="font-headline-md text-2xl font-bold text-on-surface">
                  Interactive Loan &amp; Payment Calculator
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-on-surface-variant font-data-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                Instant Calculation
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              {/* Input Form */}
              <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-surface-container-high flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-md text-lg font-semibold text-on-surface">
                    Loan Details
                  </h3>
                  <button
                    onClick={handleReset}
                    className="text-primary hover:underline text-xs flex items-center gap-1 font-medium"
                    id="resetWorkbenchBtn"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    Reset
                  </button>
                </div>

                {/* Principal Amount */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-on-surface-variant font-medium" htmlFor="inputAmount">
                      Loan Amount
                    </label>
                    <div className="flex gap-1">
                      {[10000, 25000, 50000, 100000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setInputAmount(amt)}
                          className={`quick-amt-btn px-2 py-0.5 rounded text-[11px] font-data-mono transition-colors ${
                            inputAmount === amt
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                          }`}
                        >
                          ${amt >= 1000 ? `${amt / 1000}k` : amt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-data-mono text-outline">
                      $
                    </span>
                    <input
                      className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      id="inputAmount"
                      min={500}
                      step={500}
                      type="number"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-on-surface-variant font-medium" htmlFor="inputRate">
                      Annual Interest Rate (APR)
                    </label>
                    <span className="font-data-mono text-primary font-semibold" id="rateLabel">
                      {inputRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
                      id="inputRateSlider"
                      max={25.0}
                      min={1.0}
                      step={0.05}
                      type="range"
                      value={inputRate}
                      onChange={(e) => setInputRate(parseFloat(e.target.value))}
                    />
                    <div className="relative w-24 shrink-0">
                      <input
                        className="w-full pl-2 pr-6 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-xs text-right focus:outline-none focus:ring-2 focus:ring-primary/30"
                        id="inputRate"
                        max={35.0}
                        min={0.1}
                        step={0.05}
                        type="number"
                        value={inputRate}
                        onChange={(e) => setInputRate(parseFloat(e.target.value) || 0.1)}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 font-data-mono text-outline text-xs">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Loan Term */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-on-surface-variant font-medium">Loan Duration</label>
                    <span className="font-data-mono text-on-surface font-medium" id="termLabel">
                      {currentTermYears} Years ({currentTermYears * 12} Mo)
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5" id="termButtonCluster">
                    {[3, 5, 7, 15, 30].map((yrs) => (
                      <button
                        key={yrs}
                        onClick={() => setCurrentTermYears(yrs)}
                        className={`term-btn py-1.5 rounded-lg font-data-mono text-xs transition-colors ${
                          currentTermYears === yrs
                            ? 'bg-primary text-on-primary font-semibold'
                            : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                        }`}
                      >
                        {yrs} Yr
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs text-on-surface-variant font-medium"
                    htmlFor="inputFrequency"
                  >
                    Payment Schedule
                  </label>
                  <select
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    id="inputFrequency"
                    value={inputFrequency}
                    onChange={(e) => setInputFrequency(e.target.value)}
                  >
                    <option value="12">Monthly (12 payments/year)</option>
                    <option value="26">Biweekly (26 payments/year)</option>
                    <option value="26-accel">Accelerated Biweekly (Fast Payoff)</option>
                  </select>
                </div>

                {/* Extra Principal */}
                <div className="flex flex-col gap-1.5 bg-surface-container-low p-space-sm rounded-xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">
                        bolt
                      </span>
                      <label
                        className="text-xs text-on-surface font-semibold"
                        htmlFor="inputExtra"
                      >
                        Extra Monthly Payment
                      </label>
                    </div>
                    <span className="font-label-caps text-xs text-tertiary font-semibold uppercase">
                      Save Interest
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-data-mono text-outline">
                      $
                    </span>
                    <input
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-data-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      id="inputExtra"
                      min={0}
                      step={25}
                      type="number"
                      value={inputExtra}
                      onChange={(e) => setInputExtra(Number(e.target.value) || 0)}
                    />
                  </div>
                  <p className="text-[12px] text-on-surface-variant">
                    Applied straight to lowering your remaining balance each month.
                  </p>
                </div>
              </div>

              {/* Output Metrics & Chart */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                  <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-surface-container-high">
                    <div className="font-label-caps text-xs text-on-surface-variant font-medium uppercase">
                      Payment Due
                    </div>
                    <div
                      className="text-2xl font-bold text-on-surface mt-1 font-data-mono"
                      id="dispMonthlyPayment"
                    >
                      ${calculationResults.baseMonthly.toFixed(2)}
                    </div>
                    <div
                      className="font-data-mono text-xs text-secondary mt-1"
                      id="dispTotalPaymentWithExtra"
                    >
                      {inputExtra > 0
                        ? `+$${inputExtra} extra = $${calculationResults.totalMonthlyPayment.toFixed(
                            2
                          )}`
                        : 'Standard payment'}
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-surface-container-high">
                    <div className="font-label-caps text-xs text-on-surface-variant font-medium uppercase">
                      Total Interest
                    </div>
                    <div
                      className="text-2xl font-bold text-tertiary mt-1 font-data-mono"
                      id="dispTotalInterest"
                    >
                      ${Math.round(calculationResults.totalInterestPaid).toLocaleString()}
                    </div>
                    <div
                      className="font-data-mono text-xs text-primary mt-1 font-semibold"
                      id="dispInterestSaved"
                    >
                      {calculationResults.interestSaved > 0
                        ? `Saved $${Math.round(
                            calculationResults.interestSaved
                          ).toLocaleString()}`
                        : 'Standard interest'}
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-surface-container-high">
                    <div className="font-label-caps text-xs text-on-surface-variant font-medium uppercase">
                      Total Cost
                    </div>
                    <div
                      className="text-2xl font-bold text-on-surface mt-1 font-data-mono"
                      id="dispTotalLoanCost"
                    >
                      ${Math.round(calculationResults.totalCost).toLocaleString()}
                    </div>
                    <div className="font-data-mono text-xs text-on-surface-variant mt-1">
                      Loan + Interest
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-surface-container-high">
                    <div className="font-label-caps text-xs text-on-surface-variant font-medium uppercase">
                      Payoff Time
                    </div>
                    <div
                      className="text-2xl font-bold text-secondary mt-1 font-data-mono"
                      id="dispPayoffDuration"
                    >
                      {calculationResults.payoffYears}y {calculationResults.payoffMonths}m
                    </div>
                    <div
                      className="font-data-mono text-xs text-secondary mt-1 font-semibold"
                      id="dispMonthsSaved"
                    >
                      {calculationResults.monthsSaved > 0
                        ? `Saved ${calculationResults.monthsSaved} Months`
                        : 'Full term'}
                    </div>
                  </div>
                </div>

                {/* Visual Curve */}
                <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container-high">
                  <div className="flex items-center justify-between mb-space-sm">
                    <div>
                      <span className="font-label-caps text-xs text-outline font-semibold uppercase">
                        Balance Over Time
                      </span>
                      <h4 className="text-sm font-semibold text-on-surface">
                        Remaining Balance vs. Interest Paid
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>{' '}
                        Loan Balance
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary inline-block"></span>{' '}
                        Interest Paid
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-36 relative flex items-end">
                    <svg
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                      viewBox="0 0 500 150"
                    >
                      <line
                        className="text-surface-container-high stroke-current"
                        strokeDasharray="3,3"
                        strokeWidth="1"
                        x1="0"
                        x2="500"
                        y1="0"
                        y2="0"
                      />
                      <line
                        className="text-surface-container-high stroke-current"
                        strokeDasharray="3,3"
                        strokeWidth="1"
                        x1="0"
                        x2="500"
                        y1="75"
                        y2="75"
                      />
                      <line
                        className="text-surface-container-highest stroke-current"
                        strokeWidth="1"
                        x1="0"
                        x2="500"
                        y1="150"
                        y2="150"
                      />
                      <defs>
                        <linearGradient id="pGrad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#004ac6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#004ac6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d={calculationResults.areaBalance} fill="url(#pGrad)" />
                      <path
                        d={calculationResults.pathBalance}
                        fill="none"
                        stroke="#004ac6"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      <path
                        d={calculationResults.pathInterest}
                        fill="none"
                        stroke="#943700"
                        strokeDasharray="4,3"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  <div className="flex justify-between font-data-mono text-[11px] text-outline mt-2">
                    <span>Start</span>
                    <span>Year 1</span>
                    <span>Year 2</span>
                    <span>Year 3</span>
                    <span>Year 4</span>
                    <span className="text-primary font-semibold">
                      Debt Free ({calculationResults.payoffYears}y {calculationResults.payoffMonths}m)
                    </span>
                  </div>
                </div>

                {/* Ledger Table */}
                <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container-high flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-on-surface">
                      Annual Payment Schedule
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadCsv}
                        className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container-high text-xs text-on-surface-variant font-medium flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        Download CSV
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container-high text-xs text-on-surface-variant font-medium flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">print</span>
                        Print
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="w-full text-left font-data-mono text-xs">
                      <thead className="sticky top-0 z-10">
                        <tr className="text-on-surface-variant uppercase bg-surface-container-low">
                          <th className="py-2 px-3 rounded-l">Year</th>
                          <th className="py-2 px-3">Starting Balance</th>
                          <th className="py-2 px-3 text-primary">Principal Paid</th>
                          <th className="py-2 px-3 text-tertiary">Interest Paid</th>
                          <th className="py-2 px-3 rounded-r text-right">Ending Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-high text-on-surface">
                        {calculationResults.yearlyRows.map((row) => (
                          <tr key={row.year} className="hover:bg-surface-container-low/50">
                            <td className="py-2 px-3 font-semibold">Year {row.year}</td>
                            <td className="py-2 px-3">
                              ${Math.round(row.startingBalance).toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-primary font-medium">
                              ${Math.round(row.principalPaid).toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-tertiary font-medium">
                              ${Math.round(row.interestPaid).toLocaleString()}
                            </td>
                            <td
                              className={`py-2 px-3 text-right ${
                                row.endingBalance <= 0.01
                                  ? 'font-bold text-primary'
                                  : 'text-on-surface'
                              }`}
                            >
                              ${Math.round(row.endingBalance).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SCENARIO SAVINGS & COMPARISONS */}
        <section className="w-full bg-surface-container-low py-space-2xl border-t border-surface-container-high/60">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-xl">
              <span className="font-label-caps text-xs text-primary font-semibold uppercase">
                Smart Payoff Scenarios &amp; Comparisons
              </span>
              <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
                Common Borrowing Scenarios
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base">
                Tap a scenario below to compare potential savings and payoff timelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg">
              {SCENARIOS.map((sc) => {
                const isSelected = activeScenarioId === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => setActiveScenarioId(sc.id)}
                    className={`p-space-md rounded-2xl bg-surface-container-lowest transition-all flex flex-col justify-between border cursor-pointer ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 shadow-md'
                        : 'border-surface-container-high hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                          sc.iconColor === 'primary'
                            ? 'bg-primary/10 text-primary'
                            : sc.iconColor === 'secondary'
                            ? 'bg-secondary/10 text-secondary'
                            : sc.iconColor === 'tertiary'
                            ? 'bg-tertiary/10 text-tertiary'
                            : 'bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {sc.icon}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-base font-semibold text-on-surface mb-1">
                        {sc.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {sc.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 flex items-center justify-between border-t border-surface-container-high/40">
                      <span
                        className={`text-xs font-semibold flex items-center gap-1 ${
                          sc.iconColor === 'secondary'
                            ? 'text-secondary'
                            : sc.iconColor === 'tertiary'
                            ? 'text-tertiary'
                            : 'text-primary'
                        }`}
                      >
                        {sc.actionLabel}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          check_circle
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resolution Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-surface-container-high">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-space-sm border-b border-surface-container-high">
                <div>
                  <span className="font-label-caps text-xs text-primary font-semibold uppercase">
                    Scenario Analysis
                  </span>
                  <h4 className="text-lg font-bold text-on-surface">
                    {currentScenario.analysisTitle}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-surface-container text-primary font-data-mono text-xs font-semibold inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    {currentScenario.opportunityBadge}
                  </div>
                  <button
                    onClick={() => applyPreset(currentScenario.preset)}
                    className="px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Load into Calculator</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-md">
                <div className="p-space-sm rounded-xl bg-surface-container-low">
                  <span className="text-xs text-on-surface-variant font-medium">
                    {currentScenario.metric1Label}
                  </span>
                  <div className="text-2xl font-bold text-primary mt-1 font-data-mono">
                    {currentScenario.metric1Value}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {currentScenario.metric1Desc}
                  </p>
                </div>

                <div className="p-space-sm rounded-xl bg-surface-container-low">
                  <span className="text-xs text-on-surface-variant font-medium">
                    {currentScenario.metric2Label}
                  </span>
                  <div className="text-2xl font-bold text-secondary mt-1 font-data-mono">
                    {currentScenario.metric2Value}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {currentScenario.metric2Desc}
                  </p>
                </div>

                <div className="p-space-sm rounded-xl bg-surface-container-low">
                  <span className="text-xs text-on-surface-variant font-medium">
                    {currentScenario.metric3Label}
                  </span>
                  <div className="text-base font-semibold text-on-surface mt-1">
                    {currentScenario.metric3Value}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {currentScenario.metric3Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: 12 POPULAR CALCULATORS */}
        <section className="w-full bg-surface py-space-2xl border-t border-surface-container-high/60">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex items-center justify-between mb-space-xl">
              <div>
                <span className="font-label-caps text-xs text-primary font-semibold uppercase">
                  Most Popular Loan Calculators
                </span>
                <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
                  Popular Loan &amp; Debt Calculators
                </h2>
              </div>
              <a
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                href="#allClusters"
              >
                Explore All 104 Tools →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
              {filteredPopularTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          tool.badgeType === 'secondary'
                            ? 'bg-secondary/10 text-secondary'
                            : tool.badgeType === 'tertiary'
                            ? 'bg-tertiary/10 text-tertiary'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{tool.icon}</span>
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          tool.badgeType === 'secondary'
                            ? 'bg-secondary-fixed text-on-secondary-fixed'
                            : tool.badgeType === 'tertiary'
                            ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {tool.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => applyPreset(tool.preset)}
                    className="w-full py-2 px-3 rounded-lg bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span>{tool.actionText}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: 12 COMPREHENSIVE CLUSTERS */}
        <section
          className="w-full bg-surface-container-low py-space-3xl border-t border-surface-container-high/60"
          id="allClusters"
        >
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-2xl">
              <span className="font-label-caps text-xs text-primary font-semibold uppercase">
                Complete Directory
              </span>
              <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
                Browse All 104 Loan &amp; Debt Calculators
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base max-w-3xl mt-1">
                Free, accurate tools designed for everyday borrowers, home buyers, and students. All
                calculations run instantly in your browser with complete privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {filteredClusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`material-symbols-outlined text-[22px] ${cluster.iconColor}`}
                      >
                        {cluster.icon}
                      </span>
                      <h3 className="text-base font-bold text-on-surface">{cluster.title}</h3>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-4">{cluster.desc}</p>
                    <ul className="space-y-1.5 text-xs">
                      {cluster.tools.map((t) => (
                        <li key={t.name}>
                          <button
                            onClick={() =>
                              applyPreset({
                                amount: t.amount,
                                rate: t.rate,
                                years: t.years,
                                extra: 0,
                                freq: '12',
                              })
                            }
                            className="w-full text-left text-on-surface hover:text-primary transition-colors flex items-center justify-between py-1 group"
                          >
                            <span className="group-hover:translate-x-0.5 transition-transform">
                              {t.name}
                            </span>
                            <span className="material-symbols-outlined text-xs text-outline group-hover:text-primary">
                              chevron_right
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: COMPARISONS */}
        <section className="w-full bg-surface py-space-3xl border-t border-surface-container-high/60">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-2xl">
              <span className="font-label-caps text-xs text-primary font-semibold uppercase">
                Borrowing Guides
              </span>
              <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
                Common Financial Decisions
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">
                Clear, straightforward comparisons for major borrowing and payment choices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-data-mono text-outline mb-2">
                    <span>VEHICLE</span>
                    <span className="text-primary font-semibold">MONTHLY COST</span>
                  </div>
                  <h3 className="text-base font-semibold text-on-surface mb-2">
                    Lease vs. Buy a Car
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                    Leasing offers lower monthly payments for a new car, while buying allows you to
                    build equity and sell the vehicle later.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface">
                  <strong>Quick Tip:</strong> Buying is usually better if you plan to keep the car
                  longer than 4 years.
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-data-mono text-outline mb-2">
                    <span>HOUSING</span>
                    <span className="text-secondary font-semibold">EQUITY</span>
                  </div>
                  <h3 className="text-base font-semibold text-on-surface mb-2">
                    Mortgage vs. Renting
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                    Mortgages build home equity over time, while renting offers lower upfront
                    costs, no repair bills, and greater moving flexibility.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface">
                  <strong>Quick Tip:</strong> Renting wins in short time horizons (under 4–5 years)
                  due to closing costs.
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-data-mono text-outline mb-2">
                    <span>STRATEGY</span>
                    <span className="text-tertiary font-semibold">MOTIVATION</span>
                  </div>
                  <h3 className="text-base font-semibold text-on-surface mb-2">
                    Snowball vs. Avalanche
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                    The snowball method pays off the smallest balance first for quick wins. The
                    avalanche method attacks the highest interest rate to save the most money.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface">
                  <strong>Quick Tip:</strong> Avalanche saves the most money mathematically;
                  Snowball works best for motivation.
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-data-mono text-outline mb-2">
                    <span>RATES</span>
                    <span className="text-primary font-semibold">BUDGET SAFETY</span>
                  </div>
                  <h3 className="text-base font-semibold text-on-surface mb-2">
                    Fixed vs. Variable Rate
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                    Fixed rates lock in the same monthly payment for the entire loan. Variable
                    rates start lower but can increase if market rates rise.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface">
                  <strong>Quick Tip:</strong> Choose fixed rates for long-term peace of mind and
                  predictable budgeting.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: STEP-BY-STEP FORMULAS */}
        <section className="w-full bg-surface-container-low py-space-3xl border-t border-surface-container-high/60">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-2xl">
              <span className="font-label-caps text-xs text-primary font-semibold uppercase">
                How It Works
              </span>
              <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
                How Loan Payments &amp; Interest Are Calculated
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">
                Clear, step-by-step formulas that explain your monthly payment and how interest is
                computed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-surface-container-high">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-label-caps text-xs text-primary font-semibold uppercase">
                    Step 01
                  </span>
                  <span className="font-data-mono text-xs text-outline">
                    Standard Loan Formula
                  </span>
                </div>
                <h3 className="text-base font-semibold text-on-surface mb-2">
                  Standard Monthly Payment Formula
                </h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  This formula calculates the exact fixed monthly payment needed to pay off a loan
                  over a set number of months.
                </p>
                <div className="bg-surface-container-low p-space-md rounded-xl font-data-mono text-sm text-primary text-center font-bold mb-4 overflow-x-auto">
                  Monthly Payment = Loan Amount × [ r(1 + r)ⁿ ] / [ (1 + r)ⁿ - 1 ]
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
                  <div>
                    <strong>Loan Amount:</strong> Total dollars borrowed
                  </div>
                  <div>
                    <strong>r:</strong> Monthly interest rate (APR ÷ 12)
                  </div>
                  <div>
                    <strong>n:</strong> Total number of monthly payments
                  </div>
                  <div>
                    <strong>Result:</strong> Fixed monthly payment due
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-surface-container-high">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-label-caps text-xs text-secondary font-semibold uppercase">
                    Step 02
                  </span>
                  <span className="font-data-mono text-xs text-outline">Comparing Rates</span>
                </div>
                <h3 className="text-base font-semibold text-on-surface mb-2">
                  Reducing Balance vs. Flat Rate Interest
                </h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Reducing balance loans only charge interest on what you currently owe, while flat
                  rate loans charge interest on the original amount.
                </p>
                <div className="bg-surface-container-low p-space-md rounded-xl font-data-mono text-sm text-secondary text-center font-bold mb-4 overflow-x-auto">
                  Flat Total Interest = Loan Amount × Interest Rate × Years
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
                  <div>
                    <strong>Reducing Balance:</strong> Fair interest that drops every month
                  </div>
                  <div>
                    <strong>Flat Rate:</strong> Often costs significantly more over time
                  </div>
                  <div>
                    <strong>SolveIt Tip:</strong> Always ask lenders for reducing rate APR
                  </div>
                  <div>
                    <strong>Result:</strong> Lower total out-of-pocket interest
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: FAQ ACCORDION */}
        <section className="w-full bg-surface py-space-3xl border-t border-surface-container-high/60">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-2xl">
              <span className="font-label-caps text-xs text-primary font-semibold uppercase">
                Questions &amp; Answers
              </span>
              <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
                Frequently Asked Questions
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">
                Clear, straightforward answers to common loan and repayment questions.
              </p>
            </div>

            <div className="space-y-3 max-w-4xl">
              <details
                className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high [&_summary::-webkit-details-marker]:hidden cursor-pointer"
                open
              >
                <summary className="flex items-center justify-between text-base font-semibold text-on-surface list-none">
                  <span>What is amortization and how does it work?</span>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  Amortization means paying off a loan in regular monthly installments. In the early
                  months, most of your payment goes toward interest because your loan balance is at
                  its highest. As you make payments and reduce the balance, less interest is
                  charged, so more of your payment goes toward paying down the actual loan.
                </p>
              </details>

              <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary className="flex items-center justify-between text-base font-semibold text-on-surface list-none">
                  <span>How do extra monthly payments help pay off a loan faster?</span>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  When you pay extra toward your loan principal, it directly reduces the amount you
                  owe. Because interest is calculated based on your remaining balance, reducing the
                  balance means less interest accumulates every month. This creates a compounding
                  effect that can shave months or even years off your repayment schedule.
                </p>
              </details>

              <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary className="flex items-center justify-between text-base font-semibold text-on-surface list-none">
                  <span>What is the difference between APR and interest rate?</span>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  The interest rate is the percentage charged on the money you borrow. The APR
                  (Annual Percentage Rate) includes the interest rate plus any required upfront fees,
                  closing costs, or administrative charges. APR gives you the true, all-inclusive
                  yearly cost of the loan and is the best number to use when comparing different offers.
                </p>
              </details>

              <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary className="flex items-center justify-between text-base font-semibold text-on-surface list-none">
                  <span>Can I pay off my loan early without prepayment penalties?</span>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  Most modern consumer loans, auto loans, and federal student loans have zero
                  prepayment penalties under Truth in Lending Act (TILA) protections. However, some
                  specialized commercial loans or private mortgages may assess fees if settled
                  within the first 3 to 5 years. Always verify with your lender before making large
                  lump-sum prepayments.
                </p>
              </details>

              <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary className="flex items-center justify-between text-base font-semibold text-on-surface list-none">
                  <span>How does biweekly payment scheduling accelerate payoff?</span>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  There are 52 weeks in a calendar year, which equals 26 biweekly pay periods. When
                  you make half-payments every two weeks, you complete 26 half-payments over the year—the
                  exact equivalent of 13 full monthly payments rather than 12. That automatic extra
                  annual payment goes directly toward principal reduction.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* SECTION 9: TRUST & FOOTER */}
        <section className="w-full bg-surface-container-low py-space-2xl border-t border-surface-container-high/60">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col lg:flex-row gap-space-lg items-start lg:items-center justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    fact_check
                  </span>
                  <span className="font-label-caps text-xs text-primary font-semibold uppercase">
                    Verified Lending Accuracy
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Calculations on SolveIt Calculator follow Truth in Lending Act (TILA) guidelines
                  and Consumer Financial Protection Bureau standards. Reviewed by Certified
                  Financial Planners and Consumer Credit Specialists.
                </p>
                <div className="flex flex-wrap gap-4 mt-3 font-data-mono text-xs text-outline">
                  <span>
                    100% Free &amp; Private · Calculations run directly on your browser with zero data
                    tracking
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-md shrink-0">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-10 w-10 rounded-full ring-2 ring-surface bg-primary-fixed flex items-center justify-center font-bold text-xs text-on-primary-fixed">
                    DS
                  </div>
                  <div className="inline-block h-10 w-10 rounded-full ring-2 ring-surface bg-secondary-fixed flex items-center justify-center font-bold text-xs text-on-secondary-fixed">
                    SJ
                  </div>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-on-surface">Verified Advisory Board</div>
                  <div className="text-outline">Updated March 2025</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
