export interface FinanceTool {
  id: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  path: string;
  keywords: string[];
  icon: string;
  badge?: string;
}

export interface FinanceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  categoryLink: string;
  popularTools: { name: string; path: string }[];
}

export interface FinanceGoal {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tools: { name: string; path: string; desc: string }[];
}

export interface FinancialQuestion {
  question: string;
  toolName: string;
  path: string;
  hint: string;
  icon: string;
}

export const WORLD_CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1.0, flag: '🇺🇸', name: 'USD ($)' },
  { code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺', name: 'EUR (€)' },
  { code: 'GBP', symbol: '£', rate: 0.78, flag: '🇬🇧', name: 'GBP (£)' },
  { code: 'CAD', symbol: 'CA$', rate: 1.36, flag: '🇨🇦', name: 'CAD ($)' },
  { code: 'AUD', symbol: 'AU$', rate: 1.52, flag: '🇦🇺', name: 'AUD ($)' },
  { code: 'INR', symbol: '₹', rate: 83.5, flag: '🇮🇳', name: 'INR (₹)' },
  { code: 'SGD', symbol: 'SG$', rate: 1.34, flag: '🇸🇬', name: 'SGD ($)' },
];

export function formatCurrencyAmount(amountUSD: number, currencyCode: string): string {
  const curr = WORLD_CURRENCIES.find((c) => c.code === currencyCode) || WORLD_CURRENCIES[0];
  const converted = amountUSD * curr.rate;
  if (currencyCode === 'INR') {
    return `${curr.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
  }
  return `${curr.symbol}${Math.round(converted).toLocaleString('en-US')}`;
}

export const FINANCE_CATALOG: FinanceTool[] = [
  {
    id: 'mortgage-calc',
    name: 'Mortgage Calculator',
    description: 'Calculate monthly principal & interest (P&I), property taxes, home insurance, PMI, and amortization schedules.',
    category: 'Mortgages & Real Estate',
    categorySlug: 'mortgages-and-real-estate-debt',
    path: '/finance/mortgage-calculator',
    keywords: ['mortgage', 'home loan', 'amortization', 'piti', 'pmi', 'property tax', 'home buying', 'down payment'],
    icon: 'home',
    badge: 'Popular',
  },
  {
    id: 'loan-emi-calc',
    name: 'Loan & EMI Calculator',
    description: 'Calculate Equated Monthly Installments (EMI), total interest payable, and payoff timelines for personal, auto, or home loans.',
    category: 'Loans & Debt',
    categorySlug: 'loans-and-amortization',
    path: '/finance/emi-calculator',
    keywords: ['emi', 'loan calculator', 'personal loan', 'car loan', 'auto loan', 'debt payoff', 'interest payment'],
    icon: 'payments',
    badge: 'Popular',
  },
  {
    id: 'compound-interest-calc',
    name: 'Compound Interest Calculator',
    description: 'Model compounding growth over time with initial deposit, regular contributions, interest rates, and compounding frequencies.',
    category: 'Investing & Growth',
    categorySlug: 'investing-and-growth',
    path: '/finance/compound-interest-calculator',
    keywords: ['compound interest', 'apy', 'savings growth', 'future value', 'compounding frequency', 'interest rate'],
    icon: 'trending_up',
    badge: 'Popular',
  },
  {
    id: 'investment-calc',
    name: 'Investment Return & CAGR Calculator',
    description: 'Compute cumulative investment returns, annualized growth (CAGR), periodic contributions, and lump-sum scenarios.',
    category: 'Investing & Growth',
    categorySlug: 'investing-and-growth',
    path: '/finance/investment-calculator',
    keywords: ['investment return', 'cagr', 'sip', 'stock market', 'lump sum', 'portfolio growth', 'dca'],
    icon: 'monitoring',
    badge: 'Popular',
  },
  {
    id: 'fire-forecaster',
    name: 'Retirement & FIRE Forecaster',
    description: 'Estimate your Financial Independence number, target retirement timeline, Coast FIRE, and safe withdrawal rates (3%–5%).',
    category: 'Retirement & Pension',
    categorySlug: 'retirement-and-super',
    path: '/finance/fire-forecaster',
    keywords: ['retirement', 'fire', 'retire early', 'financial independence', 'safe withdrawal rate', '4% rule', 'nest egg'],
    icon: 'local_fire_department',
    badge: 'Popular',
  },
  {
    id: 'retirement-countdown',
    name: 'Retirement Countdown',
    description: 'Track exact calendar days, workdays, shifts, PTO, and working hours remaining until your target retirement date.',
    category: 'Retirement & Pension',
    categorySlug: 'retirement-and-super',
    path: '/time-date/retirement-countdown',
    keywords: ['retirement countdown', 'working days to retirement', 'work hours', 'retirement date'],
    icon: 'event_available',
    badge: 'Featured',
  },
  {
    id: 'global-tax-calc',
    name: 'Income Tax Calculator',
    description: 'Estimate income tax liabilities, marginal vs. effective tax rates, and standard deductions across multiple jurisdictions.',
    category: 'Taxes',
    categorySlug: 'global-tax-calculator',
    path: '/global-tax-calculator',
    keywords: ['tax', 'income tax', 'tax bracket', 'marginal tax', 'effective tax', 'deductions', '1040', 'paye'],
    icon: 'receipt_long',
    badge: 'Popular',
  },
  {
    id: 'salary-daily-wage',
    name: 'Salary & Take-Home Pay Calculator',
    description: 'Convert annual salary, daily wages, or hourly rates into gross and estimated net take-home pay after standard withholdings.',
    category: 'Salary & Budgeting',
    categorySlug: 'salary-and-payroll',
    path: '/daily-wage-calculator',
    keywords: ['salary', 'take home pay', 'daily wage', 'paycheck', 'gross to net', 'hourly rate', 'payroll'],
    icon: 'work',
    badge: 'Popular',
  },
  {
    id: 'loans-amortization-hub',
    name: 'Debt Payoff & Amortization Suite',
    description: 'Evaluate debt reduction strategies (Avalanche vs. Snowball), extra principal payments, and interest savings.',
    category: 'Loans & Debt',
    categorySlug: 'loans-and-amortization',
    path: '/loans-and-amortization',
    keywords: ['debt payoff', 'amortization table', 'extra payments', 'snowball', 'avalanche', 'interest reduction'],
    icon: 'account_balance_wallet',
  },
  {
    id: 'credit-cards-revolving',
    name: 'Credit Card Payoff Calculator',
    description: 'Calculate time to zero balance, evaluate minimum payment costs, and model 0% APR balance transfer scenarios.',
    category: 'Credit Cards',
    categorySlug: 'credit-cards-and-revolving',
    path: '/credit-cards-and-revolving',
    keywords: ['credit card', 'credit card payoff', 'balance transfer', 'apr', 'minimum payment', 'revolving debt'],
    icon: 'credit_card',
  },
  {
    id: 'savings-liquidity-hub',
    name: 'Savings & Emergency Fund Calculator',
    description: 'Plan monthly savings goals, calculate emergency fund coverage (3–6 months), and estimate interest earnings under different APYs.',
    category: 'Savings & Liquidity',
    categorySlug: 'savings-and-liquidity',
    path: '/savings-and-liquidity',
    keywords: ['savings', 'emergency fund', 'apy', 'high yield savings', 'savings goal', 'liquidity'],
    icon: 'savings',
  },
  {
    id: 'banking-cash-accounts',
    name: 'Banking & Cash Accounts Hub',
    description: 'Compare Certificate of Deposit (CD) ladders, high-yield checking accounts, and compound interest intervals.',
    category: 'Banking & Cash Accounts',
    categorySlug: 'banking-and-cash-accounts',
    path: '/banking-and-cash-accounts',
    keywords: ['banking', 'cd ladder', 'checking account', 'deposit interest', 'cash management'],
    icon: 'account_balance',
  },
  {
    id: 'freelance-hourly-rate',
    name: 'Freelance & Business Rate Calculator',
    description: 'Calculate required billable hourly rates to meet annual net income targets considering unbillable hours, overhead, and self-employment taxes.',
    category: 'Business Finance',
    categorySlug: 'business',
    path: '/freelance-hourly-rate-calculator',
    keywords: ['freelance rate', 'hourly rate', 'business profit', 'billable hours', 'self employment'],
    icon: 'storefront',
  },
  {
    id: 'meeting-cost-calc',
    name: 'Meeting Cost & Operational Calculator',
    description: 'Compute the real financial cost of organizational meetings based on attendee count, average salaries, and duration.',
    category: 'Business Finance',
    categorySlug: 'business',
    path: '/meeting-cost-calculator',
    keywords: ['meeting cost', 'business expense', 'operational cost', 'salary burn'],
    icon: 'groups',
  },
  {
    id: 'percentage-financial-calc',
    name: 'Margin & Percentage Calculator',
    description: 'Quickly calculate profit margins, markups, percentage increases/decreases, and discount structures.',
    category: 'Business Finance',
    categorySlug: 'percentage-calculator',
    path: '/percentage-calculator',
    keywords: ['percentage', 'margin', 'markup', 'profit margin', 'discount', 'percent change'],
    icon: 'percent',
  },
  {
    id: 'work-hours-payroll',
    name: 'Work Hours & Payroll Calculator',
    description: 'Log and calculate daily and weekly shifts, overtime hours, break deductions, and gross payroll compensation.',
    category: 'Salary & Budgeting',
    categorySlug: 'work-hours-payroll-calculator',
    path: '/work-hours-payroll-calculator',
    keywords: ['work hours', 'timesheet', 'payroll', 'overtime', 'hourly pay'],
    icon: 'schedule',
  },
];

export const POPULAR_FINANCE_TOOLS = FINANCE_CATALOG.filter((t) =>
  [
    'mortgage-calc',
    'loan-emi-calc',
    'compound-interest-calc',
    'investment-calc',
    'fire-forecaster',
    'global-tax-calc',
    'salary-daily-wage',
    'credit-cards-revolving',
    'savings-liquidity-hub',
    'loans-amortization-hub',
    'percentage-financial-calc',
    'freelance-hourly-rate',
  ].includes(t.id)
);

export const FINANCE_GOALS: FinanceGoal[] = [
  {
    id: 'buy-home',
    title: 'Buy a Home',
    subtitle: 'Determine monthly mortgage affordability, down payments, and amortization.',
    icon: 'home',
    tools: [
      { name: 'Mortgage Calculator', path: '/finance/mortgage-calculator', desc: 'Monthly principal, interest, taxes, and insurance (PITI)' },
      { name: 'Mortgage Debt Suite', path: '/mortgages-and-real-estate-debt', desc: 'LTV, points vs. rate, and refinancing analysis' },
      { name: 'Loan EMI Calculator', path: '/finance/emi-calculator', desc: 'Home loan equated monthly installment calculations' },
    ],
  },
  {
    id: 'pay-off-debt',
    title: 'Pay Off Debt',
    subtitle: 'Evaluate accelerated payoff timelines, snowball vs. avalanche, and interest savings.',
    icon: 'account_balance_wallet',
    tools: [
      { name: 'Debt Payoff & Amortization', path: '/loans-and-amortization', desc: 'Compare avalanche and snowball reduction methods' },
      { name: 'Credit Card Payoff', path: '/credit-cards-and-revolving', desc: 'Escape minimum payments & model 0% balance transfers' },
      { name: 'Loan EMI Calculator', path: '/finance/emi-calculator', desc: 'See how extra monthly principal cuts total interest' },
    ],
  },
  {
    id: 'grow-money',
    title: 'Grow My Money',
    subtitle: 'Model compound growth trajectories, recurring deposits, and annualized returns.',
    icon: 'trending_up',
    tools: [
      { name: 'Compound Interest Calculator', path: '/finance/compound-interest-calculator', desc: 'Visual growth curve across frequencies and deposits' },
      { name: 'Investment Return & CAGR', path: '/finance/investment-calculator', desc: 'Lump-sum vs. dollar-cost averaging (DCA) returns' },
      { name: 'Wealth & Investing Hub', path: '/investing-and-growth', desc: 'Dividends, index fund modeling, and portfolio growth' },
    ],
  },
  {
    id: 'plan-retirement',
    title: 'Plan Retirement',
    subtitle: 'Simulate portfolio targets, retirement dates, and historical safe withdrawal rates.',
    icon: 'savings',
    tools: [
      { name: 'FIRE & Retirement Forecaster', path: '/finance/fire-forecaster', desc: 'Coast FIRE, Lean FIRE, and safe withdrawal rates (3%–5%)' },
      { name: 'Retirement Countdown', path: '/time-date/retirement-countdown', desc: 'Exact calendar days, work shifts, and hours remaining' },
      { name: 'Retirement & Super Hub', path: '/retirement-and-super', desc: '401(k), IRA, pension, and employer match scenarios' },
    ],
  },
  {
    id: 'save-more',
    title: 'Save More',
    subtitle: 'Build emergency reserve funds and calculate target monthly savings schedules.',
    icon: 'lock',
    tools: [
      { name: 'Savings & Liquidity Planner', path: '/savings-and-liquidity', desc: 'Target savings timelines and 3–6 month emergency funds' },
      { name: 'Banking & CD Ladders', path: '/banking-and-cash-accounts', desc: 'Compound interest on certificates of deposit & HYSA' },
      { name: 'Compound Interest Tool', path: '/finance/compound-interest-calculator', desc: 'Future value projections with regular monthly savings' },
    ],
  },
  {
    id: 'understand-pay',
    title: 'Understand My Pay',
    subtitle: 'Convert gross salary into net pay and see tax withholding estimates.',
    icon: 'badge',
    tools: [
      { name: 'Daily Wage & Net Pay', path: '/daily-wage-calculator', desc: 'Convert hourly, daily, or annual salary to take-home pay' },
      { name: 'Salary & Compensation Hub', path: '/salary-and-payroll', desc: 'Bi-weekly checks, overtime shifts, and deductions' },
      { name: 'Income Tax Calculator', path: '/global-tax-calculator', desc: 'Marginal vs. effective tax brackets and withholdings' },
    ],
  },
  {
    id: 'run-business',
    title: 'Run a Business',
    subtitle: 'Estimate profit margins, break-even hourly rates, and meeting operational costs.',
    icon: 'storefront',
    tools: [
      { name: 'Freelance Rate Calculator', path: '/freelance-hourly-rate-calculator', desc: 'Determine billable rates covering taxes and overhead' },
      { name: 'Margin & Markup Calculator', path: '/percentage-calculator', desc: 'Gross margin vs. markup and discount structures' },
      { name: 'Meeting Cost Calculator', path: '/meeting-cost-calculator', desc: 'Calculate the true operational expense of team meetings' },
    ],
  },
];

export const FINANCIAL_QUESTIONS: FinancialQuestion[] = [
  {
    question: 'How much will my monthly loan payment be?',
    toolName: 'Loan & EMI Calculator',
    path: '/finance/emi-calculator',
    hint: 'Calculate principal, interest, and monthly installments across varying terms.',
    icon: 'calculate',
  },
  {
    question: 'How much interest will I pay over the life of a loan?',
    toolName: 'Debt Payoff & Amortization',
    path: '/loans-and-amortization',
    hint: 'Examine complete amortization tables showing total interest vs. principal.',
    icon: 'account_balance',
  },
  {
    question: 'How much could my regular investments grow over 10 or 20 years?',
    toolName: 'Compound Interest Calculator',
    path: '/finance/compound-interest-calculator',
    hint: 'See how consistent monthly contributions compound with annual returns.',
    icon: 'trending_up',
  },
  {
    question: 'When could I reach my retirement target?',
    toolName: 'FIRE & Retirement Forecaster',
    path: '/finance/fire-forecaster',
    hint: 'Calculate your target portfolio number based on planned annual spending.',
    icon: 'local_fire_department',
  },
  {
    question: 'How much house can I afford each month?',
    toolName: 'Mortgage Calculator',
    path: '/finance/mortgage-calculator',
    hint: 'Model P&I, property taxes, homeowners insurance, and down payment sizes.',
    icon: 'home',
  },
  {
    question: 'How fast can I pay off my credit cards or personal loans?',
    toolName: 'Credit Card Payoff Calculator',
    path: '/credit-cards-and-revolving',
    hint: 'Compare minimum payments against fixed monthly payoff schedules.',
    icon: 'credit_card',
  },
  {
    question: 'What is my estimated take-home pay after tax withholdings?',
    toolName: 'Daily Wage & Paycheck Calculator',
    path: '/daily-wage-calculator',
    hint: 'Estimate net earnings per shift, week, or month from your gross compensation.',
    icon: 'badge',
  },
  {
    question: 'How much income tax might I owe across brackets?',
    toolName: 'Income Tax Calculator',
    path: '/global-tax-calculator',
    hint: 'Review marginal vs. effective tax rates and standard deductions.',
    icon: 'receipt_long',
  },
  {
    question: 'How many workdays and working hours remain until retirement?',
    toolName: 'Retirement Countdown',
    path: '/time-date/retirement-countdown',
    hint: 'Filter by shift schedules, weekends, holidays, and annual leave.',
    icon: 'event_available',
  },
  {
    question: 'What billable hourly rate covers business taxes and expenses?',
    toolName: 'Freelance Rate Calculator',
    path: '/freelance-hourly-rate-calculator',
    hint: 'Back out unbillable administrative hours, self-employment tax, and profit.',
    icon: 'work',
  },
];

export const FINANCE_CATEGORIES: FinanceCategory[] = [
  {
    id: 'loans-debt',
    name: 'Loans & Debt',
    description: 'Calculate payments, interest, payoff timelines, amortization schedules, and debt reduction strategies.',
    icon: 'payments',
    categoryLink: '/loans-and-amortization',
    popularTools: [
      { name: 'Loan & EMI Calculator', path: '/finance/emi-calculator' },
      { name: 'Debt Payoff & Amortization', path: '/loans-and-amortization' },
      { name: 'Extra Payments Impact', path: '/loans-and-amortization' },
    ],
  },
  {
    id: 'mortgages-real-estate',
    name: 'Mortgages & Real Estate',
    description: 'Calculate mortgage payments, property taxes, insurance, down payment impact, and loan-to-value (LTV) ratios.',
    icon: 'home',
    categoryLink: '/mortgages-and-real-estate-debt',
    popularTools: [
      { name: 'Mortgage Calculator (PITI)', path: '/finance/mortgage-calculator' },
      { name: 'Mortgages & Real Estate Debt', path: '/mortgages-and-real-estate-debt' },
      { name: 'Amortization Schedules', path: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'investing-growth',
    name: 'Investing & Growth',
    description: 'Model compounding interest, portfolio returns, compound annual growth rate (CAGR), and periodic contributions.',
    icon: 'trending_up',
    categoryLink: '/investing-and-growth',
    popularTools: [
      { name: 'Compound Interest Calculator', path: '/finance/compound-interest-calculator' },
      { name: 'Investment Return & CAGR', path: '/finance/investment-calculator' },
      { name: 'Investing & Growth Suite', path: '/investing-and-growth' },
    ],
  },
  {
    id: 'retirement-pension',
    name: 'Retirement & Pension',
    description: 'Plan for financial independence, model 401(k) and superannuation balances, and evaluate withdrawal rates.',
    icon: 'savings',
    categoryLink: '/retirement-and-super',
    popularTools: [
      { name: 'FIRE & Retirement Forecaster', path: '/finance/fire-forecaster' },
      { name: 'Retirement Countdown', path: '/time-date/retirement-countdown' },
      { name: 'Retirement & Super Hub', path: '/retirement-and-super' },
    ],
  },
  {
    id: 'savings-liquidity',
    name: 'Savings & Liquidity',
    description: 'Plan emergency funds, determine monthly savings targets, and compute annual percentage yields (APY).',
    icon: 'savings',
    categoryLink: '/savings-and-liquidity',
    popularTools: [
      { name: 'Savings & Liquidity Hub', path: '/savings-and-liquidity' },
      { name: 'Compound Interest Tool', path: '/finance/compound-interest-calculator' },
      { name: 'Emergency Fund Sizing', path: '/savings-and-liquidity' },
    ],
  },
  {
    id: 'banking-cash-accounts',
    name: 'Banking & Cash Accounts',
    description: 'Compare interest compounding frequencies, certificate of deposit (CD) ladders, and account terms.',
    icon: 'account_balance',
    categoryLink: '/banking-and-cash-accounts',
    popularTools: [
      { name: 'Banking Accounts Suite', path: '/banking-and-cash-accounts' },
      { name: 'CD Ladder Modeler', path: '/banking-and-cash-accounts' },
      { name: 'APY Compounding Tool', path: '/finance/compound-interest-calculator' },
    ],
  },
  {
    id: 'credit-cards-revolving',
    name: 'Credit Cards',
    description: 'Calculate interest costs of revolving balances, evaluate payoff timelines, and compare 0% APR transfers.',
    icon: 'credit_card',
    categoryLink: '/credit-cards-and-revolving',
    popularTools: [
      { name: 'Credit Card Payoff Calculator', path: '/credit-cards-and-revolving' },
      { name: 'Minimum Payment Cost', path: '/credit-cards-and-revolving' },
      { name: 'Balance Transfer Evaluation', path: '/credit-cards-and-revolving' },
    ],
  },
  {
    id: 'taxes',
    name: 'Taxes & Statutory Withholdings',
    description: 'Model progressive income tax brackets, calculate marginal vs. effective tax rates, and estimate standard deductions.',
    icon: 'receipt_long',
    categoryLink: '/global-tax-calculator',
    popularTools: [
      { name: 'Global Income Tax Calculator', path: '/global-tax-calculator' },
      { name: 'India GST Calculator', path: '/tax-calculator/india' },
      { name: 'Australia GST Calculator', path: '/tax-calculator/australia' },
    ],
  },
  {
    id: 'salary-budgeting',
    name: 'Salary & Compensation',
    description: 'Convert annual wages to hourly rates, calculate daily shifts, overtime compensation, and estimated net pay.',
    icon: 'badge',
    categoryLink: '/salary-and-payroll',
    popularTools: [
      { name: 'Daily Wage & Paycheck', path: '/daily-wage-calculator' },
      { name: 'Salary & Payroll Hub', path: '/salary-and-payroll' },
      { name: 'Work Hours & Timesheets', path: '/work-hours-payroll-calculator' },
    ],
  },
  {
    id: 'business-finance',
    name: 'Business Finance',
    description: 'Estimate gross and net profit margins, determine billable hourly rates, and calculate operational meeting expenses.',
    icon: 'storefront',
    categoryLink: '/business',
    popularTools: [
      { name: 'Freelance Rate Calculator', path: '/freelance-hourly-rate-calculator' },
      { name: 'Margin & Markup Calculator', path: '/percentage-calculator' },
      { name: 'Meeting Cost Calculator', path: '/meeting-cost-calculator' },
    ],
  },
];

export const REGIONAL_HUBS = [
  {
    country: 'United States',
    flag: '🇺🇸',
    description: 'IRS 1040 federal tax brackets, 30-year fixed mortgages, 401(k) retirement contributions, and state tax estimations.',
    links: [
      { name: 'US Income Tax Calculator', path: '/global-tax-calculator' },
      { name: 'US Investment Calculator', path: '/finance/investment-calculator/usa' },
      { name: 'US Mortgage (P&I + Taxes)', path: '/finance/mortgage-calculator' },
      { name: 'US Loan EMI Calculator', path: '/finance/emi-calculator/us' },
    ],
  },
  {
    country: 'India',
    flag: '🇮🇳',
    description: 'Income Tax New vs. Old Regime calculations, Home Loan EMI, SIP investments, and GST rate additions/subtractions.',
    links: [
      { name: 'India GST Calculator', path: '/tax-calculator/india' },
      { name: 'India Home Loan EMI', path: '/finance/emi-calculator/in' },
      { name: 'India SIP & Investment', path: '/finance/investment-calculator/india' },
    ],
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    description: 'HMRC PAYE income tax bands, National Insurance contributions, mortgage amortizations, and ISA investment trajectories.',
    links: [
      { name: 'UK PAYE Income Tax', path: '/global-tax-calculator' },
      { name: 'UK Loan & Mortgage EMI', path: '/finance/emi-calculator/uk' },
      { name: 'UK Investment Calculator', path: '/finance/investment-calculator/uk' },
    ],
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    description: 'Federal and provincial tax brackets, GST/HST calculations, and mortgage amortization rules.',
    links: [
      { name: 'Canada GST/HST Calculator', path: '/tax-calculator/canada' },
      { name: 'Canada Loan EMI Calculator', path: '/finance/emi-calculator/ca' },
      { name: 'Canada Investment Calculator', path: '/finance/investment-calculator/canada' },
    ],
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    description: 'ATO resident tax rates, Medicare levy, 10% GST calculations, and Superannuation accumulation modeling.',
    links: [
      { name: 'Australia GST Calculator', path: '/tax-calculator/australia' },
      { name: 'Australia Loan EMI Calculator', path: '/finance/emi-calculator/au' },
      { name: 'Australia Investment Calculator', path: '/finance/investment-calculator/australia' },
    ],
  },
  {
    country: 'Singapore',
    flag: '🇸🇬',
    description: 'IRAS resident tax brackets, 9% GST calculations, and compound wealth planning.',
    links: [
      { name: 'Singapore 9% GST Calculator', path: '/tax-calculator/singapore' },
      { name: 'Singapore Investment Calculator', path: '/finance/investment-calculator/singapore' },
    ],
  },
];

export const TAX_TRUST_DATA = [
  {
    jurisdiction: 'United States',
    taxYear: '2025 / 2026',
    primarySource: 'Internal Revenue Service (IRS)',
    sourceUrl: 'https://www.irs.gov',
    keyAssumption: 'Standard deductions and federal inflation-indexed progressive income tax brackets.',
  },
  {
    jurisdiction: 'United Kingdom',
    taxYear: '2024 / 2025 – 2025 / 2026',
    primarySource: 'HM Revenue & Customs (HMRC)',
    sourceUrl: 'https://www.gov.uk/government/organisations/hm-revenue-customs',
    keyAssumption: 'Personal allowance £12,570, basic, higher, and additional rate PAYE tax bands.',
  },
  {
    jurisdiction: 'India',
    taxYear: 'FY 2024–25 / AY 2025–26 & FY 2025–26',
    primarySource: 'Income Tax Department (CBDT) & GST Council',
    sourceUrl: 'https://incometax.gov.in',
    keyAssumption: 'Default New Tax Regime progressive slabs with standard deduction; statutory GST schedules (5%, 12%, 18%, 28%).',
  },
  {
    jurisdiction: 'Canada',
    taxYear: '2025 / 2026',
    primarySource: 'Canada Revenue Agency (CRA)',
    sourceUrl: 'https://www.canada.ca/en/revenue-agency.html',
    keyAssumption: 'Federal progressive tax brackets combined with statutory GST/HST provincial rates.',
  },
  {
    jurisdiction: 'Australia',
    taxYear: '2024–2025 / 2025–2026',
    primarySource: 'Australian Taxation Office (ATO)',
    sourceUrl: 'https://www.ato.gov.au',
    keyAssumption: 'Resident tax scales incorporating Stage 3 tax adjustments and statutory 2% Medicare levy.',
  },
];

export const RECENTLY_UPDATED_TOOLS = [
  {
    name: 'Income Tax Calculator',
    path: '/global-tax-calculator',
    description: 'Indexed standard deductions, federal tax brackets, and marginal rate thresholds for the 2025/2026 tax periods.',
    lastUpdated: 'February 2026',
  },
  {
    name: 'Loan & EMI Calculator',
    path: '/finance/emi-calculator',
    description: 'Refined amortization curve logic and monthly balance interest calculation formulas for prepayment schedules.',
    lastUpdated: 'January 2026',
  },
  {
    name: 'Compound Interest Calculator',
    path: '/finance/compound-interest-calculator',
    description: 'Added support for continuous, daily, monthly, and quarterly compounding frequencies with regular deposits.',
    lastUpdated: 'February 2026',
  },
  {
    name: 'Mortgage Calculator (P&I)',
    path: '/finance/mortgage-calculator',
    description: 'Updated property tax estimations, homeowners insurance averages, and PMI threshold calculations.',
    lastUpdated: 'January 2026',
  },
];

export const FINANCE_FAQS = [
  {
    q: 'What finance calculators are available on SolveItCalculator?',
    a: 'SolveItCalculator provides practical financial calculation tools covering mortgages, personal/auto loan EMIs, compound interest, investment returns (CAGR), retirement timelines (FIRE), emergency savings, credit card debt payoff, paycheck net wages, and multi-country tax estimation.',
  },
  {
    q: 'Are these finance calculators free to use?',
    a: 'Yes. All calculators on SolveItCalculator are completely free to use. There are no subscriptions, paywalls, or account registration requirements.',
  },
  {
    q: 'How do the finance calculators work?',
    a: 'Calculations are computed locally in your web browser using standard mathematical formulas, official financial amortization algorithms, or documented statutory tax rules. You provide the inputs, and the calculator computes the mathematical results instantly.',
  },
  {
    q: 'Can I compare financial scenarios before making a decision?',
    a: 'Yes. Our Compare Financial Scenarios engine allows you to model choices side-by-side—such as Traditional 401(k) vs. Roth IRA, Renting vs. Buying a Home, or Accelerated Debt Payoff vs. Investing—under customizable assumptions.',
  },
  {
    q: 'Are calculator results financial, legal, or tax advice?',
    a: 'No. Calculator outputs are provided strictly for educational and informational planning purposes. Because individual financial situations, tax laws, lender terms, and market conditions vary, you should verify important financial decisions with a qualified professional or official institution.',
  },
  {
    q: 'Can I see the formulas and assumptions used?',
    a: 'Yes. Calculator pages provide transparent formula documentation, key variables, and methodology notes so you can understand exactly how results are calculated.',
  },
  {
    q: 'Why might my calculator result differ from a bank or lender?',
    a: 'Discrepancies often arise from differences in compounding frequency (daily vs. monthly), payment timing (beginning vs. end of period), rounding rules, origination fees, closing costs, private mortgage insurance (PMI), escrow adjustments, or regional tax differences.',
  },
  {
    q: 'How do tax calculators handle different jurisdictions and tax years?',
    a: 'Our tax calculators clearly document the applicable country, tax year, and baseline assumptions (such as standard deductions and filing status) based on published schedules from official agencies like the IRS, HMRC, ATO, and CBDT.',
  },
  {
    q: 'Are my financial figures stored or tracked on a server?',
    a: 'Where supported, calculator computations occur entirely on the client side in your local browser sandbox. Inputs such as your loan balance or income are not stored on our servers.',
  },
  {
    q: 'Can I change calculation assumptions like interest rates and inflation?',
    a: 'Yes. Our tools and scenario models allow you to adjust key assumptions—such as annual return rate, loan term, inflation rate, and regular contribution amounts—to see how different variables impact your financial results.',
  },
];
