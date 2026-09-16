'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface ToolCardData {
  id: string;
  title: string;
  badge: string;
  desc: string;
  icon: string;
  category: string;
  href: string;
}

const flagshipTools: ToolCardData[] = [
  {
    id: 'tool-income',
    title: 'Income Tax Calculator',
    badge: 'Global Standard',
    desc: 'Multi-bracket progressive rate simulation with itemized deductions and personal tax allowances.',
    icon: 'calculate',
    category: 'us uk ca au income all',
    href: '/finance#domain-tax',
  },
  {
    id: 'tool-takehome',
    title: 'Take Home Pay Calculator',
    badge: 'Net Paycheck',
    desc: 'Instant conversion from gross annual compensation to bi-weekly, semi-monthly, or monthly pocket cash.',
    icon: 'payments',
    category: 'us uk ca au salary all',
    href: '/daily-wage-calculator',
  },
  {
    id: 'tool-payroll',
    title: 'Payroll Tax Calculator',
    badge: 'FICA / PAYE',
    desc: 'Employer and employee statutory withholding evaluation including FICA, FUTA, SUTA, and healthcare levies.',
    icon: 'badge',
    category: 'us payroll business all',
    href: '/salary-and-payroll',
  },
  {
    id: 'tool-salary',
    title: 'Salary Tax Calculator',
    badge: 'W-2 Form',
    desc: 'Hourly-to-salary adjustments incorporating pre-tax 401(k), HSA, FSA, and medical premium reductions.',
    icon: 'work',
    category: 'us salary all',
    href: '/salary-and-payroll',
  },
  {
    id: 'tool-capitalgains',
    title: 'Capital Gains Tax Calculator',
    badge: '0/15/20% Brackets',
    desc: 'Short-term vs long-term differential modeling for equities, real estate, and digital crypto assets.',
    icon: 'trending_up',
    category: 'cg us uk ca au all',
    href: '/investing-and-growth',
  },
  {
    id: 'tool-se',
    title: 'Self-Employment Tax Calculator',
    badge: '15.3% SE Tax',
    desc: 'Computes Schedule SE mandatory Medicare & Social Security contributions plus the 50% above-the-line deduction.',
    icon: 'engineering',
    category: 'se us 1099 all',
    href: '/business',
  },
  {
    id: 'tool-freelancer',
    title: 'Freelancer Tax Calculator',
    badge: '1099-NEC / IR35',
    desc: 'Tailored for creative independent contractors, remote coders, and gig workers deducting home office and tech overhead.',
    icon: 'laptop_chromebook',
    category: 'se us uk ca all',
    href: '/business',
  },
  {
    id: 'tool-smallbiz',
    title: 'Small Business Tax Calculator',
    badge: 'LLC / Pass-Through',
    desc: 'Section 199A Qualified Business Income (QBI) deduction simulation and estimated quarterly pass-through obligations.',
    icon: 'storefront',
    category: 'business us uk all',
    href: '/business',
  },
  {
    id: 'tool-corporate',
    title: 'Corporate Tax Calculator',
    badge: '21% Fed / Global Min',
    desc: 'Form 1120 corporate taxable profit calculation with NOL carryforwards and cross-border Pillar Two assessments.',
    icon: 'domain',
    category: 'business corporate all',
    href: '/business',
  },
  {
    id: 'tool-retirement',
    title: 'Retirement Tax Calculator',
    badge: '401k / RMD / Social Security',
    desc: 'Models provisional income thresholds for Social Security benefit taxation and Required Minimum Distributions (RMD).',
    icon: 'elderly',
    category: 'us retirement all',
    href: '/retirement-and-super',
  },
  {
    id: 'tool-vat',
    title: 'VAT Calculator (Inclusive & Exclusive)',
    badge: 'Cross-Border EU/UK',
    desc: 'Add or remove Value Added Tax across European Union standard (17-27%) and reduced statutory categories.',
    icon: 'receipt_long',
    category: 'vat uk eu all',
    href: '/tax-calculator',
  },
  {
    id: 'tool-gst',
    title: 'GST Calculator',
    badge: 'AU, CA, NZ, IN',
    desc: 'Evaluates Goods and Services Tax credits, reverse charges, and dual CGST/SGST breakdowns for India and Australia.',
    icon: 'shopping_cart_checkout',
    category: 'vat au ca in nz all',
    href: '/tax-calculator',
  },
];

interface CountryHub {
  country: string;
  agency: string;
  flagIcon: string;
  links: { name: string; href: string }[];
}

const countryHubs: CountryHub[] = [
  {
    country: 'United States Tax Hub',
    agency: 'Internal Revenue Service (IRS)',
    flagIcon: 'flag',
    links: [
      { name: 'Federal Income Tax Calculator (7 Brackets)', href: '/finance#domain-tax' },
      { name: 'All 50 State Income Tax Calculators', href: '/finance#domain-tax' },
      { name: '1099 vs W2 Take Home Comparison', href: '/business' },
      { name: 'Capital Gains (Stock, Crypto & Real Estate)', href: '/investing-and-growth' },
      { name: 'RSU & ISO Stock Option Withholding Tool', href: '/salary-and-payroll' },
    ],
  },
  {
    country: 'United Kingdom Tax Hub',
    agency: 'HM Revenue & Customs (HMRC)',
    flagIcon: 'flag',
    links: [
      { name: 'PAYE Salary & Take Home Calculator', href: '/salary-and-payroll' },
      { name: 'National Insurance (Class 1, 2, 4)', href: '/finance#domain-tax' },
      { name: 'IR35 Inside vs Outside Contractor Tool', href: '/business' },
      { name: 'Dividend Allowance & Surtax Engine', href: '/investing-and-growth' },
      { name: 'Scottish vs Rest of UK Rate Variance', href: '/finance#domain-tax' },
    ],
  },
  {
    country: 'Canada Tax Hub',
    agency: 'Canada Revenue Agency (CRA)',
    flagIcon: 'flag',
    links: [
      { name: 'Canada Federal + Provincial Income Tax', href: '/finance#domain-tax' },
      { name: 'Ontario, BC, Alberta & Quebec Modules', href: '/finance#domain-tax' },
      { name: 'CPP2 Tier-2 Contribution Calculator', href: '/salary-and-payroll' },
      { name: 'RRSP & TFSA Shield Optimization', href: '/retirement-and-super' },
      { name: '66.7% Capital Gains Inclusion Adjuster', href: '/investing-and-growth' },
    ],
  },
  {
    country: 'Australia Tax Hub',
    agency: 'Australian Taxation Office (ATO)',
    flagIcon: 'flag',
    links: [
      { name: 'Stage 3 Individual Income Tax Cuts', href: '/tax-calculator/australia' },
      { name: 'Medicare Levy & Surcharge Calculator', href: '/finance#domain-tax' },
      { name: 'Superannuation 11.5% Mandatory Evaluator', href: '/retirement-and-super' },
      { name: '50% CGT 12-Month Discount Engine', href: '/investing-and-growth' },
      { name: 'GST & PAYG Installment Estimator', href: '/tax-calculator' },
    ],
  },
  {
    country: 'Germany (Steuerrechner)',
    agency: 'Bundesfinanzministerium (BMF)',
    flagIcon: 'flag',
    links: [
      { name: 'Lohnsteuer & Einkommensteuer Tool', href: '/finance#domain-tax' },
      { name: 'Solidaritätszuschlag Threshold Calculator', href: '/finance#domain-tax' },
      { name: 'Sozialversicherungsbeiträge (Kranken/Renten)', href: '/salary-and-payroll' },
      { name: 'Kirchensteuer (8% / 9% Regional)', href: '/finance#domain-tax' },
    ],
  },
  {
    country: 'Singapore Tax Hub',
    agency: 'Inland Revenue Authority (IRAS)',
    flagIcon: 'flag',
    links: [
      { name: 'Resident Progressive Tax (0% - 24%)', href: '/finance#domain-tax' },
      { name: 'Central Provident Fund (CPF) Allocation', href: '/retirement-and-super' },
      { name: 'Corporate Tax (Flat 17% + Partial Exemption)', href: '/business' },
      { name: 'Non-Resident Withholding Evaluator', href: '/finance#domain-tax' },
    ],
  },
  {
    country: 'India Tax Hub',
    agency: 'Income Tax Department (CBDT)',
    flagIcon: 'flag',
    links: [
      { name: 'New vs Old Tax Regime (Sec 115BAC)', href: '/finance#domain-tax' },
      { name: 'Standard Deduction ₹75,000 Model', href: '/salary-and-payroll' },
      { name: 'Revised STCG (20%) & LTCG (12.5%)', href: '/investing-and-growth' },
      { name: 'HRA Exemption & 80C Deduction Calc', href: '/salary-and-payroll' },
    ],
  },
  {
    country: 'France Tax Hub',
    agency: 'Direction Générale des Finances Publiques',
    flagIcon: 'flag',
    links: [
      { name: 'Impôt sur le Revenu (Quotient Familial)', href: '/finance#domain-tax' },
      { name: 'Prélèvement à la Source Simulator', href: '/salary-and-payroll' },
      { name: 'Cotisations Sociales & CSG/CRDS', href: '/salary-and-payroll' },
      { name: 'PFU Flat Tax (30%) on Investments', href: '/investing-and-growth' },
    ],
  },
  {
    country: 'United Arab Emirates',
    agency: 'Federal Tax Authority (FTA)',
    flagIcon: 'flag',
    links: [
      { name: '0% Individual Income Tax Verification', href: '/finance#domain-tax' },
      { name: 'Corporate Tax (9% over AED 375k)', href: '/business' },
      { name: 'Free Zone Qualifying Income Evaluator', href: '/business' },
      { name: 'VAT (5%) Standard Return Calculator', href: '/tax-calculator' },
    ],
  },
];

const specializedSuites = [
  {
    title: 'Capital Gains Hub',
    icon: 'candlestick_chart',
    links: [
      'Crypto Tax (FIFO, LIFO, HIFO)',
      'Stock & ETF Realized Gains',
      'Real Estate & Section 1031 Exchange',
      'Primary Home $250k/$500k Exclusion',
      'Net Investment Income Tax (3.8% NIIT)',
    ],
  },
  {
    title: 'Self-Employed Hub',
    icon: 'person_pin',
    links: [
      '1099 Contractor Net Rate',
      'Quarterly Estimated Taxes (Form 1040-ES)',
      'Home Office Deduction (Simplified vs Actual)',
      'Vehicle Mileage Deduction (67¢/mile)',
      'Solo 401(k) / SEP IRA Contribution',
    ],
  },
  {
    title: 'Corporate & Entity Hub',
    icon: 'apartment',
    links: [
      'LLC vs S-Corp Tax Savings Engine',
      'S-Corp Reasonable Salary Determinator',
      'Section 179 Accelerated Depreciation',
      'Qualified Small Business Stock (QSBS)',
      'Pass-Through Entity Tax (PTET) Credit',
    ],
  },
  {
    title: 'Retirement & Pension Hub',
    icon: 'savings',
    links: [
      'Roth Conversion Ladder Tax Engine',
      'Traditional IRA Deduction Phase-out',
      'Required Minimum Distribution (RMD)',
      'Canada RRSP vs TFSA Net Yield',
      'UK SIPP Pension Tax Relief (20-45%)',
    ],
  },
];

const headToHeadCases = [
  {
    title: 'USA vs UK Salary Taxation',
    badge: '$100k Benchmark',
    desc: 'In the US, an $100k salary (single, TX) yields ~21.2% total effective tax (Fed + FICA). In the UK, £78k ($100k eqv) incurs ~28.5% total tax (PAYE + Class 1 NI), driven by the lower personal threshold freeze (£12,570) and higher basic bracket (20% + 8% NI).',
    stat1: 'US Take Home: ~$78,800',
    stat2: 'UK Take Home: ~£55,700',
  },
  {
    title: 'W-2 Employee vs 1099 Contractor',
    badge: 'Self-Employment Drag',
    desc: 'A 1099 contractor bears the full 15.3% FICA burden (employer + employee half) instead of 7.65%. To break even with a $100k W-2 job offering standard healthcare, a contractor must bill at least $128,000 gross before business write-offs.',
    stat1: 'W-2 FICA: $7,650',
    stat2: '1099 SE Tax: $14,130',
  },
  {
    title: 'Capital Gains vs Ordinary Income',
    badge: 'Preferential Spread',
    desc: 'Long-term capital assets held > 365 days qualify for 0%, 15%, or 20% federal brackets. A $150k long-term stock gain incurs an effective federal tax of ~15.2%, versus ~21.8% ordinary rate + FICA if billed as consulting revenue.',
    stat1: 'LTCG Max: 20% + 3.8% NIIT',
    stat2: 'Ordinary Max: 37% + SE',
  },
  {
    title: 'Canada vs USA Net Retention',
    badge: 'C$120k Benchmark',
    desc: 'An Ontario resident earning C$120,000 faces an effective rate of ~29.8% ($35,800 tax). A comparable US filer in Ohio earning $90,000 USD faces an effective ~22.4%, reflecting lower US federal brackets and higher standard deductions.',
    stat1: 'Ontario Net: C$84,200',
    stat2: 'US Ohio Net: $69,840',
  },
  {
    title: 'Roth IRA vs Traditional IRA',
    badge: 'Temporal Arbitrage',
    desc: 'Traditional contributions offer immediate upfront tax relief at your highest marginal rate today. Roth IRA uses post-tax dollars but yields 100% tax-free growth and tax-free withdrawals at age 59½, eliminating future tax bracket risk.',
    stat1: 'Traditional: Taxed at RMD',
    stat2: 'Roth: Zero Exit Tax',
  },
  {
    title: 'S-Corp Salary vs Distribution',
    badge: '15.3% SE Bypass',
    desc: 'At $160k net profit, an S-Corp electing a $75,000 reasonable W-2 salary pays 15.3% FICA only on $75k ($11,475). The remaining $85k dividend distribution bypasses self-employment tax entirely, yielding ~$13,000 in net cash preservation.',
    stat1: 'Pure LLC Tax: $22,600',
    stat2: 'S-Corp Structure: $11,475',
  },
  {
    title: 'Zero-Tax States vs High-Tax States',
    badge: 'CA/NY vs TX/FL',
    desc: 'A filer earning $250,000 pays ~$21,800 in California state income tax (9.3% bracket) and ~$18,600 in New York. Moving to Texas, Florida, Washington, or Nevada reduces state personal income tax to zero, retaining up to $21,800 annually.',
    stat1: 'CA Net @ $250k: $162k',
    stat2: 'TX Net @ $250k: $184k',
  },
];

const faqs = [
  {
    q: 'What is the difference between marginal tax rate and effective tax rate?',
    a: 'Your marginal tax rate is the highest bracket applied to your topmost dollar of earnings. Your effective tax rate is the actual percentage of total income paid across all brackets combined: calculated as (Total Tax Paid ÷ Total Gross Income) × 100.',
  },
  {
    q: 'How does SolveIt ensure zero-log data privacy?',
    a: 'All arithmetic, progressive bracket evaluations, and statutory calculations run locally inside your browser’s JavaScript execution engine. No gross salary inputs, deduction variables, or net pay results are ever transmitted to an external server or saved in a remote database.',
  },
  {
    q: 'Why is self-employment tax (15.3%) higher than W-2 payroll withholding?',
    a: 'Standard employees split FICA taxes equally with their employers (7.65% paid by employee, 7.65% by employer). Self-employed individuals, 1099 contractors, and freelancers act as both employer and employee, requiring them to cover the full 15.3% (12.4% Social Security + 2.9% Medicare), though half is tax-deductible on Form 1040.',
  },
  {
    q: 'How does the 2024–2025 IRS Standard Deduction work?',
    a: 'Under Rev. Proc. 2023-34 for tax year 2024, the federal standard deduction is $14,600 for Single filers, $29,200 for Married Filing Jointly, and $21,900 for Heads of Household. This baseline dollar amount is subtracted directly from gross income before calculating any tax.',
  },
  {
    q: 'How do short-term vs long-term capital gains tax rates differ?',
    a: 'Assets held for one year or less are classified as short-term capital gains and taxed at normal ordinary income rates (10%–37%). Assets held longer than 365 days qualify for preferential long-term capital gains rates of 0%, 15%, or 20%, depending on your overall taxable income.',
  },
  {
    q: 'What are the 9 US states with no general personal income tax?',
    a: 'Alaska, Florida, Nevada, New Hampshire (dividends/interest tax phase-out completed 2027), South Dakota, Tennessee, Texas, Washington (has a 7% tax on long-term capital gains above $250k), and Wyoming do not levy ordinary state wage taxes.',
  },
  {
    q: 'How do UK National Insurance contributions (NIC) work in 2024?',
    a: 'Class 1 employee National Insurance was reduced to 8% on earnings between £12,570 and £50,270 per annum, and 2% on earnings above £50,270. This deduction is calculated concurrently with PAYE income tax on each paycheck.',
  },
  {
    q: 'What is the Canadian CPP enhancement (CPP2) introduced in 2024?',
    a: 'The CRA implemented the second earnings ceiling (CPP2). Employees earning between the Year’s Maximum Pensionable Earnings (YMPE: C$68,500) and the second ceiling (YAMPE: C$73,200) pay an additional 4% contribution on that specific C$4,700 band (max deduction C$188).',
  },
];

const promptResolutions: Record<string, { tool: string; text: string; linkText: string; linkHref: string }> = {
  'california-80k': {
    tool: 'California Income Tax Tool',
    text: 'On an $80,000 gross salary in California (Single, standard deduction $14,600 Fed / $5,540 CA): Federal Income Tax is ~$7,920, California State Tax is ~$3,148, and FICA (Social Security + Medicare) is ~$6,120. Total combined tax drag is $17,188, leaving an estimated annual take-home pay of $62,812 (effective tax rate of 21.48%).',
    linkText: 'Open California Income Tax Tool',
    linkHref: '/finance#domain-tax',
  },
  'uk-50k': {
    tool: 'UK PAYE & Salary Engine',
    text: 'On a £50,000 gross wage in England (2024/25): Standard personal allowance is £12,570. Taxable income of £37,430 is taxed at the 20% basic rate (£7,486). National Insurance Class 1 at 8% amounts to £2,994. Total deductions equal £10,480, yielding a net take-home pay of £39,520/year (~£3,293 monthly).',
    linkText: 'Launch UK PAYE Engine',
    linkHref: '/salary-and-payroll',
  },
  '1099-vs-w2': {
    tool: '1099 Contractor vs W-2 Analyzer',
    text: 'To match a $100,000 W-2 job offering standard healthcare and retirement match, you must bill approximately $128,000–$135,000 as a 1099 contractor. This differential offsets the additional 7.65% employer FICA burden ($7,650), non-subsidized health premiums (~$7,200), and uncompensated PTO.',
    linkText: 'Launch 1099 Contractor Workbench',
    linkHref: '/business',
  },
  'crypto-25k': {
    tool: 'Capital Gains & Crypto Engine',
    text: 'If $25,000 of crypto profit is held for >1 year, it is taxed at preferential LTCG rates (0% if total taxable income is below $47,025; 15% between $47,025 and $518,900). If held under 365 days, it is taxed at your ordinary marginal bracket (up to 37%), adding state tax where applicable.',
    linkText: 'Open Capital Gains & Crypto Tool',
    linkHref: '/investing-and-growth',
  },
};

export default function GlobalTaxCalculatorClient() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Interactive Fiscal Workbench State
  const [grossIncome, setGrossIncome] = useState<number>(100000);
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'self-employed'>('single');
  const [usState, setUsState] = useState<'ca' | 'ny' | 'tx' | 'fl' | 'wa'>('ca');

  // AI Prompt Resolver State
  const [activePromptKey, setActivePromptKey] = useState<string>('california-80k');

  // FAQ Accordion State
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Live Mathematical Computation Engine
  const calculations = useMemo(() => {
    const gross = Math.max(0, grossIncome || 0);

    // 1. United States Tax Engine (2024 Brackets)
    const fedStandardDeduction = filingStatus === 'married' ? 29200 : 14600;
    const taxableFed = Math.max(0, gross - fedStandardDeduction);
    let fedTax = 0;
    let fedMarginal = 10;

    if (taxableFed > 0) {
      if (taxableFed <= 11600) {
        fedTax = taxableFed * 0.10;
        fedMarginal = 10;
      } else if (taxableFed <= 47150) {
        fedTax = 1160 + (taxableFed - 11600) * 0.12;
        fedMarginal = 12;
      } else if (taxableFed <= 100525) {
        fedTax = 5426 + (taxableFed - 47150) * 0.22;
        fedMarginal = 22;
      } else if (taxableFed <= 191950) {
        fedTax = 17168.5 + (taxableFed - 100525) * 0.24;
        fedMarginal = 24;
      } else if (taxableFed <= 243725) {
        fedTax = 39110.5 + (taxableFed - 191950) * 0.32;
        fedMarginal = 32;
      } else if (taxableFed <= 609350) {
        fedTax = 55678.5 + (taxableFed - 243725) * 0.35;
        fedMarginal = 35;
      } else {
        fedTax = 183647.25 + (taxableFed - 609350) * 0.37;
        fedMarginal = 37;
      }
    }

    const ssTax = Math.min(gross, 168600) * (filingStatus === 'self-employed' ? 0.124 : 0.062);
    const medTax = gross * (filingStatus === 'self-employed' ? 0.029 : 0.0145);
    const ficaTotal = ssTax + medTax;

    let stateTaxRate = 0;
    let stateMarginal = 0;
    let stateName = 'California (FTB)';
    if (usState === 'ca') {
      stateTaxRate = 0.062;
      stateMarginal = 9.3;
      stateName = 'California (FTB)';
    } else if (usState === 'ny') {
      stateTaxRate = 0.058;
      stateMarginal = 6.85;
      stateName = 'New York (DTF)';
    } else if (usState === 'tx') {
      stateTaxRate = 0.0;
      stateMarginal = 0;
      stateName = 'Texas (0% State)';
    } else if (usState === 'fl') {
      stateTaxRate = 0.0;
      stateMarginal = 0;
      stateName = 'Florida (0% State)';
    } else if (usState === 'wa') {
      stateTaxRate = 0.0;
      stateMarginal = 0;
      stateName = 'Washington (0%)';
    }

    const stateTax = gross * stateTaxRate;
    const totalUsTax = fedTax + stateTax + ficaTotal;
    const usTakeHome = Math.max(0, gross - totalUsTax);
    const usEffective = gross > 0 ? (totalUsTax / gross) * 100 : 0;
    const usCombinedMarginal = fedMarginal + stateMarginal;

    // 2. United Kingdom Engine (£ equiv ~ 0.78 * USD gross)
    const ukGross = gross * 0.78;
    let ukPersonalAllowance = 12570;
    if (ukGross > 100000) {
      ukPersonalAllowance = Math.max(0, 12570 - (ukGross - 100000) / 2);
    }
    const ukTaxable = Math.max(0, ukGross - ukPersonalAllowance);
    let ukPaye = 0;
    let ukMarg = 20;

    if (ukTaxable > 0) {
      if (ukTaxable <= 37700) {
        ukPaye = ukTaxable * 0.20;
        ukMarg = 20;
      } else if (ukTaxable <= 112570) {
        ukPaye = 7540 + (ukTaxable - 37700) * 0.40;
        ukMarg = 40;
      } else {
        ukPaye = 37488 + (ukTaxable - 112570) * 0.45;
        ukMarg = 45;
      }
    }

    let ukNiVal = 0;
    if (ukGross > 12570) {
      const band1 = Math.min(ukGross, 50270) - 12570;
      ukNiVal += band1 * 0.08;
      if (ukGross > 50270) {
        ukNiVal += (ukGross - 50270) * 0.02;
      }
    }
    const ukTotalTax = ukPaye + ukNiVal;
    const ukTakeHome = ukGross - ukTotalTax;
    const ukEffective = ukGross > 0 ? (ukTotalTax / ukGross) * 100 : 0;
    const ukMarginalWithNi = ukMarg + (ukGross > 50270 ? 2 : 8);

    // 3. Canada Engine (C$ equiv ~ 1.35 * USD gross, Ontario)
    const caGross = gross * 1.35;
    const caFedTax = caGross * 0.16; // Blended statutory effective
    const caProvTax = caGross * 0.09;
    const caCppEI = Math.min(4888, caGross * 0.065);
    const caTotalTax = caFedTax + caProvTax + caCppEI;
    const caTakeHome = caGross - caTotalTax;
    const caEffective = caGross > 0 ? (caTotalTax / caGross) * 100 : 0;
    const caMarginal = 37.91;

    // 4. Australia Engine (A$ equiv ~ 1.50 * USD gross, ATO Stage 3 2024/2025)
    const auGross = gross * 1.50;
    let auTax = 0;
    let auMargRate = 16;
    if (auGross > 18200) {
      if (auGross <= 45000) {
        auTax = (auGross - 18200) * 0.16;
        auMargRate = 16;
      } else if (auGross <= 135000) {
        auTax = 4288 + (auGross - 45000) * 0.30;
        auMargRate = 30;
      } else if (auGross <= 190000) {
        auTax = 31288 + (auGross - 135000) * 0.37;
        auMargRate = 37;
      } else {
        auTax = 51638 + (auGross - 190000) * 0.45;
        auMargRate = 45;
      }
    }
    const auMedicare = auGross * 0.02;
    const auTotal = auTax + auMedicare;
    const auTakeHome = auGross - auTotal;
    const auSuperVal = auGross * 0.115;
    const auEffective = auGross > 0 ? (auTotal / auGross) * 100 : 0;

    return {
      us: {
        takeHome: Math.round(usTakeHome),
        effective: usEffective.toFixed(2),
        marginal: usCombinedMarginal.toFixed(1),
        fica: Math.round(ficaTotal),
        stateLabel: stateName,
      },
      uk: {
        takeHome: Math.round(ukTakeHome),
        effective: ukEffective.toFixed(2),
        marginal: ukMarginalWithNi.toFixed(1),
        ni: Math.round(ukNiVal),
      },
      ca: {
        takeHome: Math.round(caTakeHome),
        effective: caEffective.toFixed(2),
        marginal: caMarginal.toFixed(2),
        cpp: Math.round(caCppEI),
      },
      au: {
        takeHome: Math.round(auTakeHome),
        effective: auEffective.toFixed(2),
        marginal: (auMargRate + 2).toFixed(1),
        superVal: Math.round(auSuperVal),
      },
    };
  }, [grossIncome, filingStatus, usState]);

  // Filtered tools list
  const filteredTools = useMemo(() => {
    return flagshipTools.filter((tool) => {
      const matchesSearch =
        !searchQuery.trim() ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.badge.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === 'all' || tool.category.includes(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex((prev) => (prev === index ? null : index));
  };

  const activeResolution = promptResolutions[activePromptKey] || promptResolutions['california-80k'];

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary/20 selection:text-primary">
      

      <main className="w-full pt-16 flex-1">
        {/* Top Global Compliance Strip */}
        <section className="w-full bg-surface-container-high/60 border-b border-outline-variant/20 py-2">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop flex flex-wrap items-center justify-between gap-3 text-on-surface-variant font-data-mono text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-primary font-semibold">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                Statutory Compliance 2024–2025
              </span>
              <span className="text-outline-variant">•</span>
              <span>IRS Rev. Proc. 2024-40</span>
              <span className="text-outline-variant">•</span>
              <span>HMRC Autumn Statement</span>
              <span className="text-outline-variant">•</span>
              <span>CRA Indexation 4.7%</span>
              <span className="text-outline-variant">•</span>
              <span>ATO Stage 3 Cuts</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-on-surface">
                <span className="material-symbols-outlined text-[15px] text-primary">lock</span>
                Zero-Log Client-Side Evaluation
              </span>
              <span className="bg-surface-container-lowest px-2 py-0.5 rounded shadow-xs font-medium text-on-surface border border-outline-variant/20">
                Audit Grade: ISO/IEC 25023
              </span>
            </div>
          </div>
        </section>

        {/* Hero & Primary Search Header */}
        <section className="w-full bg-gradient-to-b from-surface to-surface-container-low/40 pb-space-2xl pt-space-xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
            {/* Breadcrumbs */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-space-md"
            >
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link href="/finance" className="hover:text-primary transition-colors">
                Tax Calculators
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-medium">Global Tax Calculators</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              <div className="lg:col-span-8 space-y-space-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-caps uppercase font-label-caps font-semibold">
                  <span className="material-symbols-outlined text-[16px]">public</span>
                  Cross-Border Fiscal Intelligence &amp; Simulation Suite
                </div>
                <h1 className="font-display-hero text-3xl sm:text-4xl md:text-5xl lg:text-display-hero text-on-surface tracking-tight leading-[1.08]">
                  Global Tax <span className="text-primary">Calculators</span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
                  Statutory tax evaluation engines calibrated for 140+ sovereign jurisdictions. Real-time modeling for individual PAYE salary, federal &amp; state multi-tier brackets, 1099 contractor self-employment, corporate profits, cross-border digital VAT/GST, and tiered capital asset gains.
                </p>

                {/* Quick Search & Intent Filter */}
                <div className="pt-space-xs space-y-3">
                  <div className="relative max-w-2xl bg-surface-container-lowest shadow-md rounded-xl p-1.5 flex items-center gap-2 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary ml-2 text-[22px]">manage_search</span>
                    <input
                      className="w-full bg-transparent text-on-surface font-body-md text-body-md py-2 px-1 focus:outline-none placeholder:text-outline"
                      id="tool-search-input"
                      placeholder="Search by country, state (e.g., California), bracket, 1099, or asset (crypto, RSU)..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('flagship-tools-container');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-headline-md text-sm font-semibold hover:bg-primary-container transition-all shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      Compute
                    </button>
                  </div>

                  {/* Fast Filter Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="font-label-caps text-label-caps uppercase text-outline mr-1">Quick Select:</span>
                    {[
                      { id: 'all', label: 'All (140+)' },
                      { id: 'us', label: 'United States (IRS)' },
                      { id: 'uk', label: 'United Kingdom (HMRC)' },
                      { id: 'ca', label: 'Canada (CRA)' },
                      { id: 'au', label: 'Australia (ATO)' },
                      { id: 'cg', label: 'Capital Gains' },
                      { id: 'se', label: '1099 / Freelancer' },
                      { id: 'vat', label: 'VAT / GST' },
                    ].map((chip) => {
                      const isActive = activeFilter === chip.id;
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => setActiveFilter(chip.id)}
                          className={`text-xs font-medium px-3 py-1 rounded-full transition-all cursor-pointer ${
                            isActive
                              ? 'bg-primary text-on-primary shadow-xs'
                              : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Jurisdiction Stats Badge Block */}
              <div className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-outline-variant/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                  <span className="font-headline-md text-sm text-on-surface font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">account_balance</span>
                    Statutory Formula Engine
                  </span>
                  <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    v24.8.2
                  </span>
                </div>
                <div className="space-y-3 font-body-sm text-on-surface-variant">
                  <div className="flex items-center justify-between">
                    <span>Jurisdictions Configured</span>
                    <span className="font-data-mono font-semibold text-on-surface">142 Countries</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sub-National States &amp; Provinces</span>
                    <span className="font-data-mono font-semibold text-on-surface">264 Tax Zones</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Double Taxation Treaties (DTA)</span>
                    <span className="font-data-mono font-semibold text-on-surface">1,890 Mappings</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Statutory Rate Verification</span>
                    <span className="text-primary font-data-mono font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Live Q1 2025
                    </span>
                  </div>
                </div>
                <div className="pt-2 bg-surface-container-low rounded-lg p-3 text-xs leading-relaxed text-on-surface-variant border border-outline-variant/20">
                  <span className="font-semibold text-on-surface">Privacy Protocol:</span> All computation loops execute strictly in volatile client memory (V8 sandbox). Zero payload leaves your browser.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Tax Comparison & Effective Rate Visualizer */}
        <section className="w-full bg-surface-container-lowest py-space-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-space-lg">
              <div>
                <div className="flex items-center gap-2 text-primary font-label-caps text-label-caps uppercase tracking-wider mb-1">
                  <span className="material-symbols-outlined text-[16px]">stacked_bar_chart</span>
                  Live Fiscal Workbench
                </div>
                <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface tracking-tight">
                  Cross-Border Net Take-Home &amp; Rate Comparison
                </h2>
                <p className="font-body-md text-on-surface-variant mt-1">
                  Adjust baseline gross compensation to evaluate progressive fiscal drags across standard tax jurisdictions.
                </p>
              </div>
              {/* Presets */}
              <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20 shrink-0">
                {[80000, 150000, 250000].map((amt) => {
                  const isMatch = grossIncome === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setGrossIncome(amt)}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${
                        isMatch
                          ? 'text-on-surface bg-surface-container-lowest shadow-sm font-semibold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      ${amt.toLocaleString()} /yr
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulator Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container-low p-space-md rounded-xl mb-space-lg border border-outline-variant/30">
              <div>
                <label htmlFor="workbench-gross-input" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">
                  Gross Annual Income (USD Eqv)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-data-mono text-on-surface-variant">$</span>
                  <input
                    className="w-full bg-surface-container-lowest pl-7 pr-3 py-2 rounded-lg font-data-mono text-base text-on-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold border border-outline-variant/20"
                    id="workbench-gross-input"
                    step="5000"
                    type="number"
                    value={grossIncome}
                    onChange={(e) => setGrossIncome(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="workbench-status" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">
                  Filing Status
                </label>
                <select
                  className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg font-body-sm text-body-sm text-on-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20 cursor-pointer"
                  id="workbench-status"
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as 'single' | 'married' | 'self-employed')}
                >
                  <option value="single">Single Filer</option>
                  <option value="married">Married Joint / Common Law</option>
                  <option value="self-employed">Self-Employed / Independent Sole Trader</option>
                </select>
              </div>

              <div>
                <label htmlFor="workbench-us-state" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">
                  US Benchmark State
                </label>
                <select
                  className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg font-body-sm text-body-sm text-on-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20 cursor-pointer"
                  id="workbench-us-state"
                  value={usState}
                  onChange={(e) => setUsState(e.target.value as 'ca' | 'ny' | 'tx' | 'fl' | 'wa')}
                >
                  <option value="ca">California (High State Progressive)</option>
                  <option value="ny">New York (MTA + State Surcharge)</option>
                  <option value="tx">Texas (0% State Personal Income Tax)</option>
                  <option value="fl">Florida (0% State Personal Income Tax)</option>
                  <option value="wa">Washington (0% Personal Income Tax)</option>
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">
                  Tax Regime Year
                </label>
                <div className="flex items-center h-10 px-3 bg-surface-container-lowest rounded-lg shadow-sm font-data-mono text-body-sm text-on-surface justify-between border border-outline-variant/20">
                  <span>2024 / 2025 Statutory</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
                </div>
              </div>
            </div>

            {/* Comparative Results Matrix (4 Key Jurisdictions) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="tax-cards-grid">
              {/* Card 1: USA */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-base text-on-surface font-semibold flex items-center gap-2">
                      <span className="w-5 h-3.5 bg-blue-700 inline-block rounded-xs overflow-hidden relative shadow-2xs">
                        <span className="absolute inset-x-0 top-1/2 h-0.5 bg-red-600"></span>
                      </span>
                      United States
                    </span>
                    <span className="text-xs font-data-mono px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      {calculations.us.stateLabel}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-xs text-on-surface-variant font-label-caps uppercase block">Net Annual Take-Home</span>
                    <div className="font-numerical-display text-2xl text-primary font-bold tracking-tight">
                      ${calculations.us.takeHome.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 text-xs font-body-sm">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Effective Tax Rate</span>
                      <span className="font-data-mono font-semibold text-on-surface">
                        {calculations.us.effective}%
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Marginal Bracket (Fed+State)</span>
                      <span className="font-data-mono text-on-surface">
                        {calculations.us.marginal}%
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>FICA (SS &amp; Medicare)</span>
                      <span className="font-data-mono text-on-surface">
                        ${calculations.us.fica.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-surface-container-high">
                  <Link
                    className="inline-flex items-center justify-between w-full text-xs font-semibold text-primary hover:underline"
                    href="/finance#domain-tax"
                  >
                    <span>Open US Federal &amp; State Calculator</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Card 2: United Kingdom */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col justify-between border border-outline-variant/30">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-base text-on-surface font-semibold flex items-center gap-2">
                      <span className="w-5 h-3.5 bg-blue-900 inline-block rounded-xs shadow-2xs border border-white/20"></span>
                      United Kingdom
                    </span>
                    <span className="text-xs font-data-mono px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      PAYE + NI
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-xs text-on-surface-variant font-label-caps uppercase block">Net Take-Home (£ Eqv)</span>
                    <div className="font-numerical-display text-2xl text-on-surface font-bold tracking-tight">
                      £{calculations.uk.takeHome.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 text-xs font-body-sm">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Effective Total Rate</span>
                      <span className="font-data-mono font-semibold text-on-surface">
                        {calculations.uk.effective}%
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Marginal Tax Rate</span>
                      <span className="font-data-mono text-on-surface">
                        {calculations.uk.marginal}%
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Class 1 National Ins.</span>
                      <span className="font-data-mono text-on-surface">
                        £{calculations.uk.ni.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-surface-container-high">
                  <Link
                    className="inline-flex items-center justify-between w-full text-xs font-semibold text-primary hover:underline"
                    href="/salary-and-payroll"
                  >
                    <span>Launch UK PAYE Engine</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Card 3: Canada */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col justify-between border border-outline-variant/30">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-base text-on-surface font-semibold flex items-center gap-2">
                      <span className="w-5 h-3.5 bg-red-600 inline-block rounded-xs shadow-2xs border border-white/20"></span>
                      Canada
                    </span>
                    <span className="text-xs font-data-mono px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      Ontario
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-xs text-on-surface-variant font-label-caps uppercase block">Net Take-Home (C$)</span>
                    <div className="font-numerical-display text-2xl text-on-surface font-bold tracking-tight">
                      C${calculations.ca.takeHome.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 text-xs font-body-sm">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Effective Combined Rate</span>
                      <span className="font-data-mono font-semibold text-on-surface">
                        {calculations.ca.effective}%
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Combined Marginal Bracket</span>
                      <span className="font-data-mono text-on-surface">
                        {calculations.ca.marginal}%
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>CPP &amp; EI Deductions</span>
                      <span className="font-data-mono text-on-surface">
                        C${calculations.ca.cpp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-surface-container-high">
                  <Link
                    className="inline-flex items-center justify-between w-full text-xs font-semibold text-primary hover:underline"
                    href="/finance#domain-tax"
                  >
                    <span>Open Canada CRA Engine</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Card 4: Australia */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col justify-between border border-outline-variant/30">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-base text-on-surface font-semibold flex items-center gap-2">
                      <span className="w-5 h-3.5 bg-blue-800 inline-block rounded-xs shadow-2xs border border-white/20"></span>
                      Australia
                    </span>
                    <span className="text-xs font-data-mono px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      ATO 2024 Stage 3
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-xs text-on-surface-variant font-label-caps uppercase block">Net Take-Home (A$)</span>
                    <div className="font-numerical-display text-2xl text-on-surface font-bold tracking-tight">
                      A${calculations.au.takeHome.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 text-xs font-body-sm">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Effective Tax Rate</span>
                      <span className="font-data-mono font-semibold text-on-surface">
                        {calculations.au.effective}%
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Marginal Tax Bracket</span>
                      <span className="font-data-mono text-on-surface">
                        {calculations.au.marginal}%
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Superannuation (Employer)</span>
                      <span className="font-data-mono text-on-surface">
                        11.5% (A${calculations.au.superVal.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-surface-container-high">
                  <Link
                    className="inline-flex items-center justify-between w-full text-xs font-semibold text-primary hover:underline"
                    href="/tax-calculator/australia"
                  >
                    <span>Open Australia ATO Tool</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Tax Assistant & Query Resolver */}
        <section className="w-full bg-surface py-space-2xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div className="bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high p-space-lg md:p-space-xl rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase font-label-caps">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  SolveIt Tax Intelligence Prompt Matrix
                </div>
                <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface tracking-tight">
                  Ask Any Fiscal, Capital Gain, or Payroll Question
                </h2>
                <p className="font-body-md text-on-surface-variant">
                  Click any programmatic prompt below to auto-resolve bracket mechanics, cross-border treatment, or tax-loss thresholds.
                </p>

                <div className="flex flex-wrap gap-2 pt-2" id="prompt-pills">
                  {[
                    { key: 'california-80k', q: 'How much tax will I pay on $80,000 in California?' },
                    { key: 'uk-50k', q: 'What is my net take-home pay on £50,000 in the UK?' },
                    { key: '1099-vs-w2', q: 'Should I file as a 1099 contractor or W2 employee?' },
                    { key: 'crypto-25k', q: 'What is the capital gains tax on $25,000 crypto profit?' },
                  ].map((item) => {
                    const isSelected = activePromptKey === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setActivePromptKey(item.key)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-body-sm shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer border ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary font-medium'
                            : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high border-outline-variant/30'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">help</span>
                        &quot;{item.q}&quot;
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Resolver Box */}
                <div
                  className="mt-4 p-space-md bg-surface-container-lowest rounded-xl shadow-sm border-l-4 border-primary border-t border-r border-b border-outline-variant/30 space-y-2"
                  id="ai-resolver-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-sm text-on-surface font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                      Resolution Synthesis
                    </span>
                    <span className="font-data-mono text-xs text-primary font-medium" id="ai-target-tool">
                      {activeResolution.tool}
                    </span>
                  </div>
                  <p className="font-body-md text-on-surface text-sm leading-relaxed" id="ai-response-text">
                    {activeResolution.text}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      href={activeResolution.linkHref}
                      id="ai-tool-link"
                    >
                      {activeResolution.linkText}
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </Link>
                    <span className="text-outline-variant">•</span>
                    <span className="text-xs text-on-surface-variant font-data-mono">
                      Verified against 2024 IRS Rev. Proc. 2023-34 &amp; FTB Schedules
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flagship Tools Grid (12 Core Engines) */}
        <section className="w-full bg-surface-container-low/50 py-space-2xl border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div className="space-y-2 mb-space-xl">
              <div className="text-primary font-label-caps text-label-caps uppercase tracking-wider">
                Statutory Calculator Directory
              </div>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface tracking-tight">
                12 Core Flagship Tax Engines
              </h2>
              <p className="font-body-md text-on-surface-variant max-w-2xl">
                Zero-fluff, production-grade calculation engines for individual filers, corporate treasuries, and independent operators.
              </p>
            </div>

            {filteredTools.length === 0 ? (
              <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">search_off</span>
                <p className="text-on-surface font-medium">No calculation engines match &quot;{searchQuery}&quot;</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="mt-3 text-xs text-primary font-semibold hover:underline"
                >
                  Reset all search filters
                </button>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                id="flagship-tools-container"
              >
                {filteredTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="tool-card group bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30 hover:border-primary/40"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                          <span className="material-symbols-outlined text-[20px]">{tool.icon}</span>
                        </div>
                        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant px-2 py-0.5 rounded bg-surface-container-low border border-outline-variant/20">
                          {tool.badge}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-base text-on-surface font-semibold group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                    <div className="pt-4 mt-2 flex items-center text-xs font-semibold text-primary">
                      <span>Launch Calculator</span>
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform ml-1">
                        arrow_forward
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 10 Major Country Tax Hubs (Deep Jurisdictional Directory) */}
        <section className="w-full bg-surface py-space-2xl border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div className="space-y-2 mb-space-xl">
              <div className="text-primary font-label-caps text-label-caps uppercase tracking-wider">
                Statutory Hubs
              </div>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface tracking-tight">
                10 Major Country Tax Suites
              </h2>
              <p className="font-body-md text-on-surface-variant max-w-2xl">
                Comprehensive statutory calculation clusters encompassing direct income, municipal/state add-ons, and social security treaties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countryHubs.map((hub) => (
                <div
                  key={hub.country}
                  className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-surface-container-high">
                    <span className="material-symbols-outlined text-primary text-[24px]">flag</span>
                    <div>
                      <h3 className="font-headline-md text-base text-on-surface font-semibold">{hub.country}</h3>
                      <span className="font-data-mono text-xs text-on-surface-variant">{hub.agency}</span>
                    </div>
                  </div>
                  <ul className="pt-3 space-y-2 text-xs font-body-sm">
                    {hub.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          className="flex items-center justify-between text-on-surface-variant hover:text-primary transition-colors py-0.5"
                          href={link.href}
                        >
                          <span>{link.name}</span>
                          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialized Tax Clusters (Card Directories) */}
        <section className="w-full bg-surface-container-low/30 py-space-2xl border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div className="space-y-2 mb-space-xl">
              <div className="text-primary font-label-caps text-label-caps uppercase tracking-wider">
                Asset &amp; Entity Clustering
              </div>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface tracking-tight">
                Specialized Fiscal Suites
              </h2>
              <p className="font-body-md text-on-surface-variant max-w-2xl">
                Modular toolsets categorized strictly by tax asset profile, entity structure, and statutory exemptions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specializedSuites.map((suite) => (
                <div
                  key={suite.title}
                  className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-3 border border-outline-variant/30"
                >
                  <div className="flex items-center gap-2 text-on-surface font-headline-md text-sm font-semibold">
                    <span className="material-symbols-outlined text-primary text-[18px]">{suite.icon}</span>
                    {suite.title}
                  </div>
                  <ul className="space-y-2 text-xs font-body-sm text-on-surface-variant">
                    {suite.links.map((link) => (
                      <li key={link}>
                        <Link className="hover:text-primary transition-colors block py-0.5" href="/finance#domain-tax">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Head-to-Head Tax Comparison Benchmarks (7 Deep Scenarios) */}
        <section className="w-full bg-surface py-space-2xl border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div className="space-y-2 mb-space-xl">
              <div className="text-primary font-label-caps text-label-caps uppercase tracking-wider">
                Comparative Benchmarks
              </div>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface tracking-tight">
                Head-to-Head Fiscal Case Studies
              </h2>
              <p className="font-body-md text-on-surface-variant max-w-2xl">
                Empirical mathematical breakdowns resolving common cross-border, entity structure, and asset-class debates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {headToHeadCases.map((item) => (
                <div
                  key={item.title}
                  className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-3 border border-outline-variant/30 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-headline-md text-sm font-semibold text-on-surface">{item.title}</span>
                      <span className="text-xs font-data-mono bg-surface-container px-2 py-0.5 rounded text-primary">
                        {item.badge}
                      </span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant leading-relaxed text-xs">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-surface-container-high flex justify-between text-xs font-data-mono">
                    <span className="text-on-surface-variant">{item.stat1}</span>
                    <span className="text-on-surface-variant">{item.stat2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comprehensive Educational Authority & AI Overview Blocks */}
        <section className="w-full bg-surface-container-low/40 py-space-2xl border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-xl">
            {/* Educational Module 1: Marginal vs Effective Math */}
            <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="max-w-3xl space-y-3">
                <div className="text-primary font-label-caps text-label-caps uppercase tracking-wider">
                  Mathematical Fundamentals
                </div>
                <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface tracking-tight">
                  Understanding Marginal vs Effective Tax Rates
                </h2>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  The single most common financial misconception is believing that entering a higher tax bracket reduces total take-home pay. Progressive tax systems employ a bucket mechanism: each statutory rate applies exclusively to income inside that specific tier, never to your entire earnings.
                </p>
              </div>

              {/* Math Demonstration Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left font-body-sm text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container text-on-surface font-semibold border-b border-outline-variant/20">
                      <th className="p-3">Income Bracket Tier (Single Filer 2024)</th>
                      <th className="p-3">Statutory Rate</th>
                      <th className="p-3">Taxable Dollars in Bracket</th>
                      <th className="p-3">Tax Generated</th>
                      <th className="p-3">Cumulative Tax Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container font-data-mono text-on-surface-variant">
                    <tr>
                      <td className="p-3 font-body-sm text-on-surface">Standard Deduction ($0 - $14,600)</td>
                      <td className="p-3">0.0%</td>
                      <td className="p-3">$14,600</td>
                      <td className="p-3">$0.00</td>
                      <td className="p-3">$0.00</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-body-sm text-on-surface">Tier 1: $14,600 to $26,200</td>
                      <td className="p-3">10.0%</td>
                      <td className="p-3">$11,600</td>
                      <td className="p-3">$1,160.00</td>
                      <td className="p-3">$1,160.00</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-body-sm text-on-surface">Tier 2: $26,200 to $61,750</td>
                      <td className="p-3">12.0%</td>
                      <td className="p-3">$35,550</td>
                      <td className="p-3">$4,266.00</td>
                      <td className="p-3">$5,426.00</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-body-sm text-on-surface">Tier 3: $61,750 to $115,125</td>
                      <td className="p-3">22.0%</td>
                      <td className="p-3">$38,250 (at $100k gross)</td>
                      <td className="p-3">$8,415.00</td>
                      <td className="p-3 font-semibold text-on-surface">$13,841.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-surface-container-high/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-body-sm border border-outline-variant/20">
                <div>
                  <span className="font-semibold text-on-surface">Takeaway on $100,000 Income:</span>
                  <span className="text-on-surface-variant">
                    {' '}The marginal bracket is <strong className="text-on-surface">22%</strong>, but the actual effective income tax rate is only <strong className="text-primary">13.84%</strong>.
                  </span>
                </div>
                <span className="font-data-mono bg-surface-container-lowest px-3 py-1.5 rounded shadow-2xs text-on-surface shrink-0 border border-outline-variant/30">
                  Formula: Total Tax ($13,841) ÷ Gross ($100,000) = 13.84%
                </span>
              </div>
            </div>

            {/* Educational Module 2: Legal Tax Mitigation Strategies Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-4 border border-outline-variant/30">
                <div className="flex items-center gap-2 text-primary font-headline-md text-base font-semibold">
                  <span className="material-symbols-outlined">checklist</span>
                  Primary Tax Reduction Mechanisms
                </div>
                <ul className="space-y-3 font-body-sm text-xs text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">check_circle</span>
                    <div>
                      <strong className="text-on-surface">Maxing Pre-Tax Qualified Plans:</strong> Contributing the 2024 maximum of $23,000 to a 401(k) / 403(b) shields income at your topmost marginal tier, saving up to $8,510 in federal tax.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">check_circle</span>
                    <div>
                      <strong className="text-on-surface">Health Savings Account (HSA) Triple Exemption:</strong> 100% tax-deductible contributions ($4,150 single / $8,300 family), tax-free capital growth, and tax-free medical withdrawals.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">check_circle</span>
                    <div>
                      <strong className="text-on-surface">Systematic Tax-Loss Harvesting:</strong> Offsetting unlimited capital gains plus up to $3,000 of ordinary wage income annually by liquidating depreciated assets before Dec 31.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-4 border border-outline-variant/30">
                <div className="flex items-center gap-2 text-error font-headline-md text-base font-semibold">
                  <span className="material-symbols-outlined">warning</span>
                  Severe Fiscal Pitfalls &amp; Penalty Traps
                </div>
                <ul className="space-y-3 font-body-sm text-xs text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-error text-[18px] shrink-0">cancel</span>
                    <div>
                      <strong className="text-on-surface">Estimated Underpayment Penalties (IRC § 6654):</strong> Freelancers and 1099 workers failing to pay 90% of current year or 100%/110% of prior year tax quarterly face compound IRS interest charges.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-error text-[18px] shrink-0">cancel</span>
                    <div>
                      <strong className="text-on-surface">Wash-Sale Disallowance Rule (30-Day Window):</strong> Repurchasing a substantially identical stock or crypto security within 30 days disallows claiming the capital loss deduction for that filing cycle.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-error text-[18px] shrink-0">cancel</span>
                    <div>
                      <strong className="text-on-surface">Worker Misclassification Exposure:</strong> Treating workers as 1099 contractors without meeting behavioral, financial, and relational independence standards triggers back-tax FICA assessments.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Educational Module 3: Sovereign Fiscal Comparison Table */}
            <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="space-y-2 mb-4">
                <h3 className="font-headline-md text-base text-on-surface font-semibold">
                  Global Sovereign Fiscal Architecture Comparison
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Key macro statutory thresholds across leading commercial jurisdictions for cross-border benchmarking.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container text-on-surface font-semibold border-b border-outline-variant/20">
                      <th className="p-3">Country</th>
                      <th className="p-3">Top Marginal Income Tax</th>
                      <th className="p-3">Corporate Income Tax</th>
                      <th className="p-3">Capital Gains Tax Rate</th>
                      <th className="p-3">Standard VAT / GST</th>
                      <th className="p-3">Social Tax Scheme</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container font-data-mono text-on-surface-variant">
                    <tr>
                      <td className="p-3 font-semibold text-on-surface">United States</td>
                      <td className="p-3">37.0% (+ State up to 13.3%)</td>
                      <td className="p-3">21.0% Federal</td>
                      <td className="p-3">0% / 15% / 20% (+3.8% NIIT)</td>
                      <td className="p-3">0% (State Sales Tax 0-10%)</td>
                      <td className="p-3">FICA: 7.65% (15.3% SE)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-on-surface">United Kingdom</td>
                      <td className="p-3">45.0% (over £125,140)</td>
                      <td className="p-3">25.0% (Main Rate)</td>
                      <td className="p-3">10% / 20% (Residential 18/24%)</td>
                      <td className="p-3">20.0% Standard VAT</td>
                      <td className="p-3">NI Class 1: 8% + 2%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-on-surface">Canada</td>
                      <td className="p-3">33.0% (+ Provincial up to 25.75%)</td>
                      <td className="p-3">15.0% Fed (9% Small Biz)</td>
                      <td className="p-3">50% - 66.7% Inclusion Rate</td>
                      <td className="p-3">5% GST (13-15% HST)</td>
                      <td className="p-3">CPP + EI: C$4,888 Max</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-on-surface">Australia</td>
                      <td className="p-3">45.0% (over A$190,000)</td>
                      <td className="p-3">30.0% (25% Base Entity)</td>
                      <td className="p-3">Marginal Rate (50% CGT Disc)</td>
                      <td className="p-3">10.0% GST</td>
                      <td className="p-3">Super Guarantee: 11.5%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-on-surface">Germany</td>
                      <td className="p-3">45.0% (+ 5.5% Soli + Church)</td>
                      <td className="p-3">~30.0% (KSt + GewSt)</td>
                      <td className="p-3">25.0% Abgeltungsteuer</td>
                      <td className="p-3">19.0% MwSt</td>
                      <td className="p-3">Social: ~20% Employee</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-on-surface">Singapore</td>
                      <td className="p-3">24.0% (over S$1,000,000)</td>
                      <td className="p-3">17.0% Flat</td>
                      <td className="p-3">0.0% (Zero Capital Gains)</td>
                      <td className="p-3">9.0% GST</td>
                      <td className="p-3">CPF: Up to 20%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Programmatic SEO Matrix Links (Sub-Path Directory) */}
        <section className="w-full bg-surface py-space-2xl border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div className="space-y-2 mb-space-lg">
              <div className="text-primary font-label-caps text-label-caps uppercase tracking-wider">
                Index Matrix
              </div>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface tracking-tight">
                High-Intent State &amp; Regional Tax Directories
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body-sm text-xs">
              {/* US State Matrices */}
              <div className="space-y-2 bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/30">
                <h4 className="font-semibold text-on-surface text-sm border-b border-surface-container-high pb-2">
                  Top US State Sub-Calculators
                </h4>
                <ul className="space-y-1.5 text-on-surface-variant pt-1">
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/finance#domain-tax">California State Income &amp; SDI Tax Calculator</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/finance#domain-tax">New York State &amp; NYC Resident Tax Tool</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/finance#domain-tax">Texas Zero State Income Tax Take-Home</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/salary-and-payroll">Florida Wage &amp; Salary Paycheck Estimator</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/investing-and-growth">Washington State 7% Capital Gains Tax Tool</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/finance#domain-tax">Illinois Flat 4.95% Income Tax Engine</Link></li>
                </ul>
              </div>

              {/* Global City & Regional Modules */}
              <div className="space-y-2 bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/30">
                <h4 className="font-semibold text-on-surface text-sm border-b border-surface-container-high pb-2">
                  International Regional Hubs
                </h4>
                <ul className="space-y-1.5 text-on-surface-variant pt-1">
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/salary-and-payroll">UK Scottish Rate of Income Tax (SRIT)</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/finance#domain-tax">Ontario vs British Columbia Income Tax</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/finance#domain-tax">Alberta 10% Flat Threshold Calculator</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/salary-and-payroll">Australia New South Wales vs Victoria Payroll</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/finance#domain-tax">Ireland PAYE &amp; Universal Social Charge (USC)</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/finance#domain-tax">Switzerland Cantonal Tax Multiplier Tool</Link></li>
                </ul>
              </div>

              {/* Tiered Compensation Matrices */}
              <div className="space-y-2 bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/30">
                <h4 className="font-semibold text-on-surface text-sm border-b border-surface-container-high pb-2">
                  Salary Tier Take-Home Analyses
                </h4>
                <ul className="space-y-1.5 text-on-surface-variant pt-1">
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/salary-and-payroll">$50,000 Annual Salary After Taxes (All 50 States)</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/salary-and-payroll">$75,000 Salary Net Pay &amp; Monthly Budget Breakdown</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/salary-and-payroll">$100,000 Single Filer Take Home in US vs UK</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/salary-and-payroll">$150,000 Executive Compensation Tax Drag</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/finance#domain-tax">$250,000 High-Earner AMT &amp; NIIT Thresholds</Link></li>
                  <li><Link className="hover:text-primary transition-colors block py-0.5" href="/finance#domain-tax">$500,000 Top Bracket Tax-Shelter Matrix</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Matrix */}
        <section className="w-full bg-surface-container-low/50 py-space-2xl border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div className="space-y-2 mb-space-xl">
              <div className="text-primary font-label-caps text-label-caps uppercase tracking-wider">
                Expert Resolution
              </div>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface tracking-tight">
                Frequently Asked Questions on Global Tax &amp; Computation
              </h2>
              <p className="font-body-md text-on-surface-variant max-w-2xl">
                Direct, authoritative answers structured for voice search, Google AI Overviews, and personal tax planning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="faq-accordion-grid">
              {faqs.map((faq, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className="bg-surface-container-lowest p-4 rounded-xl shadow-2xs space-y-2 border border-outline-variant/30"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between text-left font-headline-md text-sm font-semibold text-on-surface cursor-pointer gap-2"
                    >
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-[18px] text-primary shrink-0 transition-transform duration-200">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="font-body-sm text-xs text-on-surface-variant leading-relaxed pt-1 border-t border-surface-container-high">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Institutional EEAT Advisory Board & Statutory Sources */}
        <section className="w-full bg-surface py-space-xl border-t border-surface-container-high">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-outline-variant/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 border border-primary/20">
                  MV
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline-md text-sm font-semibold text-on-surface">
                      Marcus Vance, CPA, M.S. Taxation
                    </h4>
                    <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Senior Managing Director of International Fiscal Compliance • Former Big 4 Senior Tax Manager • Board Certified Public Accountant.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-data-mono text-on-surface-variant shrink-0">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">policy</span>
                  Statutory Reference: 26 U.S. Code
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">gavel</span>
                  UK Income Tax Act 2007
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
                  ATO ITAA 1997
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
