const fs = require('fs');
let content = fs.readFileSync('app/finance/FinanceHubClient.tsx', 'utf-8');

const textToRemove = `<div className="flex flex-col">
                  <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface leading-none">
                    SolveIt<span className="text-primary font-headline-md">Calculator</span>
                  </span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">
                    Financial Intelligence
                  </span>
                </div>`;

content = content.replace(textToRemove, '');

const startIdx = content.indexOf('const DOMAINS: DomainCard[] = [');
const endMarker = "categoryLink: '/investing-and-growth',\n  },\n];";
let endIdx = content.indexOf(endMarker);
if (endIdx === -1) {
  // Try another end marker
  const altEndMarker = "    categoryLink: '/investing-and-growth',\n  }\n];";
  endIdx = content.indexOf(altEndMarker);
}
if (endIdx === -1) {
    const alt2 = "categoryLink: '/investing-and-growth',\n  }\n];"
    endIdx = content.indexOf("];", content.indexOf("categoryLink: '/investing-and-growth'", startIdx + 1000));
}

if (startIdx !== -1 && endIdx !== -1) {
    const newDomains = `const DOMAINS: DomainCard[] = [
  {
    id: 'domain-investing',
    icon: 'trending_up',
    toolsCount: '150+ Tools',
    title: 'Investing & Growth',
    description: 'Calculate compound interest, stock returns, and growth.',
    tags: [
      { label: 'Compound Interest', href: '/investing-and-growth' },
      { label: 'Stock Growth', href: '/investing-and-growth' },
      { label: 'Dividend Returns', href: '/investing-and-growth' },
      { label: 'Portfolio Planning', href: '/investing-and-growth' },
    ],
    colorTheme: 'primary',
    categoryLink: '/investing-and-growth',
  },
  {
    id: 'domain-retirement',
    icon: 'elderly',
    toolsCount: '95+ Tools',
    title: 'Retirement Planning',
    description: 'Plan your retirement with 401(k) and savings goals.',
    tags: [
      { label: '401(k) Match', href: '/retirement-and-super' },
      { label: 'Pension Plans', href: '/retirement-and-super' },
      { label: 'Retirement Goals', href: '/retirement-and-super' },
      { label: 'Social Security', href: '/retirement-and-super' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/retirement-and-super',
  },
  {
    id: 'domain-tax',
    icon: 'account_balance',
    toolsCount: '85+ Tools',
    title: 'Global Tax Calculator',
    description: 'Estimate taxes for USA, UK, Canada, Australia, and worldwide.',
    tags: [
      { label: 'Income Tax', href: '/global-tax-calculator' },
      { label: 'Payroll Tax', href: '/global-tax-calculator' },
      { label: 'Capital Gains', href: '/global-tax-calculator' },
      { label: 'Sales Tax & VAT', href: '/tax-calculator' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/global-tax-calculator',
  },
  {
    id: 'domain-loans',
    icon: 'payments',
    toolsCount: '104 Tools',
    title: 'Loans & Payments',
    description: 'Calculate monthly payments, loan schedules, and debt payoff.',
    tags: [
      { label: 'Loan Payments', href: '/loans-and-amortization' },
      { label: 'Payment Schedules', href: '/loans-and-amortization#allClusters' },
      { label: 'Auto Loans', href: '/loans-and-amortization' },
      { label: 'Payoff Early', href: '/loans-and-amortization' },
    ],
    colorTheme: 'primary',
    categoryLink: '/loans-and-amortization',
  },
  {
    id: 'domain-mortgage',
    icon: 'real_estate_agent',
    toolsCount: '106 Tools',
    title: 'Mortgages & Real Estate',
    description: 'Plan your home purchase, refinancing, and mortgage payments.',
    tags: [
      { label: 'Mortgage Payments', href: '/mortgages-and-real-estate-debt' },
      { label: '15 vs 30-Year', href: '/mortgages-and-real-estate-debt' },
      { label: 'Refinance Savings', href: '/mortgages-and-real-estate-debt' },
      { label: 'Home Equity', href: '/mortgages-and-real-estate-debt' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/mortgages-and-real-estate-debt',
  },
  {
    id: 'domain-savings',
    icon: 'savings',
    toolsCount: '102 Tools',
    title: 'Savings & Liquidity',
    description: 'Grow your savings with high-yield accounts and emergency funds.',
    tags: [
      { label: 'High-Yield Savings', href: '/savings-and-liquidity' },
      { label: 'CD Returns', href: '/savings-and-liquidity' },
      { label: 'Emergency Fund', href: '/savings-and-liquidity' },
      { label: 'Savings Goals', href: '/savings-and-liquidity' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/savings-and-liquidity',
  },
  {
    id: 'domain-banking',
    icon: 'account_balance_wallet',
    toolsCount: '98 Tools',
    title: 'Banking Accounts',
    description: 'Compare bank accounts, interest rates, and avoid fees.',
    tags: [
      { label: 'Interest Rates', href: '/banking-and-cash-accounts' },
      { label: 'Bank Fees', href: '/banking-and-cash-accounts' },
      { label: 'Overdraft Costs', href: '/banking-and-cash-accounts' },
      { label: 'Checking Balance', href: '/banking-and-cash-accounts' },
    ],
    colorTheme: 'primary',
    categoryLink: '/banking-and-cash-accounts',
  },
  {
    id: 'domain-credit-cards',
    icon: 'credit_card',
    toolsCount: '96 Tools',
    title: 'Credit Cards',
    description: 'Manage credit card debt, balance transfers, and payoff strategies.',
    tags: [
      { label: 'Debt Payoff', href: '/credit-cards-and-revolving' },
      { label: 'Minimum Payment', href: '/credit-cards-and-revolving' },
      { label: 'Balance Transfer', href: '/credit-cards-and-revolving' },
      { label: 'Credit Score', href: '/credit-cards-and-revolving' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/credit-cards-and-revolving',
  },
  {
    id: 'domain-insurance',
    icon: 'health_and_safety',
    toolsCount: '45+ Tools',
    title: 'Insurance',
    description: 'Estimate life insurance needs and health savings accounts.',
    tags: [
      { label: 'Life Insurance', href: '/investing-and-growth' },
      { label: 'HSA Benefits', href: '/global-tax-calculator' },
      { label: 'Annuity Payouts', href: '/investing-and-growth' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/investing-and-growth',
  },
  {
    id: 'domain-personal-finance',
    icon: 'vital_signs',
    toolsCount: '50+ Tools',
    title: 'Financial Health',
    description: 'Track your net worth, cash flow, and financial wellness.',
    tags: [
      { label: 'Net Worth', href: '/fire-forecaster' },
      { label: 'Cash Flow', href: '/investing-and-growth' },
      { label: 'Debt-to-Income', href: '/finance/mortgage-calculator' },
    ],
    colorTheme: 'primary',
    categoryLink: '/fire-forecaster',
  },
  {
    id: 'domain-budgeting',
    icon: 'pie_chart',
    toolsCount: '30+ Tools',
    title: 'Budgeting',
    description: 'Organize your money using simple and effective budget rules.',
    tags: [
      { label: '50/30/20 Rule', href: '/investing-and-growth' },
      { label: 'Zero-Based Budget', href: '/investing-and-growth' },
      { label: 'Savings Funds', href: '/investing-and-growth' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/investing-and-growth',
  },
  {
    id: 'domain-debt-elimination',
    icon: 'link_off',
    toolsCount: '40+ Tools',
    title: 'Debt Elimination',
    description: 'Find the fastest and smartest ways to become debt-free.',
    tags: [
      { label: 'Debt Avalanche', href: '/finance/emi-calculator' },
      { label: 'Debt Snowball', href: '/finance/emi-calculator' },
      { label: 'Consolidation', href: '/finance/emi-calculator' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/finance/emi-calculator',
  },
  {
    id: 'domain-wealth-building',
    icon: 'diamond',
    toolsCount: '35+ Tools',
    title: 'Wealth Building',
    description: 'Learn how fast your money can grow and build long-term wealth.',
    tags: [
      { label: 'Double Your Money', href: '/investing-and-growth' },
      { label: 'Trust Planning', href: '/fire-forecaster' },
      { label: 'Wealth Growth', href: '/fire-forecaster' },
    ],
    colorTheme: 'primary',
    categoryLink: '/investing-and-growth',
  },
  {
    id: 'domain-business-finance',
    icon: 'domain',
    toolsCount: '45+ Tools',
    title: 'Business Finance',
    description: 'Calculate business profits, startup costs, and sales goals.',
    tags: [
      { label: 'Break-Even Point', href: '/investing-and-growth' },
      { label: 'Business Runway', href: '/investing-and-growth' },
      { label: 'Working Capital', href: '/investing-and-growth' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/investing-and-growth',
  },
  {
    id: 'domain-real-estate',
    icon: 'apartment',
    toolsCount: '60+ Tools',
    title: 'Property Investing',
    description: 'Evaluate rental properties, cash flow, and investment returns.',
    tags: [
      { label: 'Rental Yield', href: '/finance/mortgage-calculator' },
      { label: 'Cash Returns', href: '/finance/mortgage-calculator' },
      { label: 'Tax Exchanges', href: '/global-tax-calculator' },
      { label: 'Property Value', href: '/finance/mortgage-calculator' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/finance/mortgage-calculator',
  },
  {
    id: 'domain-salary',
    icon: 'badge',
    toolsCount: '55+ Tools',
    title: 'Salary & Wages',
    description: 'Calculate your take-home pay, hourly wages, and overtime.',
    tags: [
      { label: 'Take-Home Pay', href: '/salary-and-payroll' },
      { label: 'Freelance vs Job', href: '/salary-and-payroll' },
      { label: 'Overtime Pay', href: '/salary-and-payroll' },
    ],
    colorTheme: 'primary',
    categoryLink: '/salary-and-payroll',
  },
  {
    id: 'domain-international',
    icon: 'public',
    toolsCount: '30+ Tools',
    title: 'International & Forex',
    description: 'Calculate exchange rates and international taxes.',
    tags: [
      { label: 'Exchange Rates', href: '/conversions' },
      { label: 'Expat Taxes', href: '/global-tax-calculator' },
      { label: 'Foreign Income', href: '/global-tax-calculator' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/conversions',
  },
  {
    id: 'domain-crypto',
    icon: 'currency_bitcoin',
    toolsCount: '40+ Tools',
    title: 'Crypto Assets',
    description: 'Track crypto returns, taxes, and mining profits.',
    tags: [
      { label: 'Staking Returns', href: '/investing-and-growth' },
      { label: 'Crypto Taxes', href: '/global-tax-calculator' },
      { label: 'Mining Profits', href: '/investing-and-growth' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/investing-and-growth',
  }
];`;
    content = content.slice(0, startIdx) + newDomains + content.slice(endIdx + 2);
    fs.writeFileSync('app/finance/FinanceHubClient.tsx', content);
    console.log("Successfully replaced domains block.");
} else {
    console.log("Failed to find start or end index.");
    console.log("Start", startIdx, "End", endIdx);
}
