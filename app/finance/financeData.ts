export interface FinanceTool {
  id: string;
  name: string;
  description?: string;
  category: string;
  categorySlug?: string;
  path: string;
  keywords?: string[];
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

import {
  formatWithGlobalCurrency,
  getGlobalCurrencySnapshot,
  type GlobalCurrencyCode,
} from '@/lib/currency';

export const WORLD_CURRENCIES = [
    {
        code: 'USD',
        symbol: '$',
        rate: 1.0,
        flag: '🇺🇸',
        name: 'USD ($)'
    },
    {
        code: 'EUR',
        symbol: '€',
        rate: 0.8924,
        flag: '🇪🇺',
        name: 'EUR (€)'
    },
    {
        code: 'GBP',
        symbol: '£',
        rate: 0.7447,
        flag: '🇬🇧',
        name: 'GBP (£)'
    },
    {
        code: 'INR',
        symbol: '₹',
        rate: 93.93,
        flag: '🇮🇳',
        name: 'INR (₹)'
    }
];
export function formatCurrencyAmount(amountUSD: number, currencyCode: string) {
    const validCode = (['USD', 'EUR', 'GBP', 'INR'].includes(currencyCode)
      ? currencyCode
      : getGlobalCurrencySnapshot().currency) as GlobalCurrencyCode;
    return formatWithGlobalCurrency(amountUSD, {
      fromCurrency: 'USD',
      overrideCurrency: validCode,
      decimals: 0,
    });
}
export const FINANCE_CATALOG = [
    {
        id: 'savings-goal-calc',
        name: 'Savings Goal Calculator',
        description: 'Calculate your required monthly deposit to reach any savings goal, or solve how long it will take with compound growth, seed savings, optional inflation, and custom goal presets.',
        category: 'Savings & Liquidity',
        categorySlug: 'savings',
        path: '/compound-interest-calculator',
        keywords: [
            'savings goal calculator',
            'savings calculator',
            'monthly savings calculator',
            'how much to save per month',
            'down payment savings calculator',
            'target savings planner'
        ],
        icon: 'savings',
        badge: 'Popular'
    },
    {
        id: 'emergency-fund-calc',
        name: 'Emergency Fund Calculator',
        description: 'Calculate your exact emergency fund target, evaluate 3/6/9/12 months coverage, analyze funding gap, project completion timeline with compound interest, and review 3-tier liquid allocation.',
        category: 'Savings & Liquidity',
        categorySlug: 'savings',
        path: '/finance/emergency-fund-calculator',
        keywords: [
            'emergency fund calculator',
            'emergency savings calculator',
            'rainy day fund',
            'emergency fund',
            'liquid savings',
            'how many months emergency fund',
            'safety cushion calculator',
            'contingency fund'
        ],
        icon: 'shield_alert',
        badge: 'Popular'
    },
    {
        id: 'fd-calc',
        name: 'FD Calculator (Fixed Deposit)',
        description: 'Calculate Indian Fixed Deposit (FD) maturity amount, quarterly compounding interest, effective annual yield, senior citizen bonus rates, and Section 194A / 80TTB TDS tax deductions.',
        category: 'Savings & Liquidity',
        categorySlug: 'savings',
        path: '/finance/fd-calculator',
        keywords: [
            'fd calculator',
            'fd',
            'fixed deposit calculator',
            'fd calculator india',
            'fixed deposit',
            'fd interest calculator',
            'sbi fd calculator',
            'hdfc fd calculator',
            'icici fd calculator',
            'post office fd calculator',
            'senior citizen fd calculator',
            'tds on fd calculator',
            'section 194a tds',
            'quarterly compounding fd'
        ],
        icon: 'account_balance',
        badge: 'Popular'
    },
    {
        id: 'rd-calc',
        name: 'RD Calculator (Recurring Deposit)',
        description: 'Calculate Indian Recurring Deposit (RD) maturity amount, quarterly compounding under IBA rules, month-by-month table, senior citizen rates, and Section 194A TDS limits across SBI, HDFC, ICICI, and Post Office.',
        category: 'Savings & Liquidity',
        categorySlug: 'savings',
        path: '/finance/rd-calculator',
        keywords: [
            'rd calculator',
            'rd',
            'recurring deposit calculator',
            'rd calculator india',
            'recurring deposit',
            'rd interest calculator',
            'sbi rd calculator',
            'hdfc rd calculator',
            'icici rd calculator',
            'post office rd calculator',
            'quarterly compounding rd',
            'rd vs fd',
            'rd vs sip',
            'tds on rd calculator'
        ],
        icon: 'savings',
        badge: 'Popular'
    },
    {
        id: 'safe-withdrawal-calc',
        name: 'Safe Withdrawal Rate Calculator',
        description: 'Calculate retirement safe withdrawal rate (SWR), required portfolio nest egg under the 4% Bengen rule, portfolio longevity, 3.0%-5.0% sensitivity matrix, sequence of returns risk, and Trinity study context.',
        category: 'Retirement & FIRE',
        categorySlug: 'retirement',
        path: '/finance/safe-withdrawal-rate-calculator',
        keywords: [
            'safe withdrawal rate calculator',
            'safe withdrawal rate',
            'swr calculator',
            '4% rule calculator',
            '4 percent rule calculator',
            'bengen 4% rule',
            'trinity study calculator',
            'retirement withdrawal calculator',
            'sequence of returns risk',
            'needed portfolio calculator',
            'retirement nest egg calculator'
        ],
        icon: 'verified_user',
        badge: 'FIRE Core'
    },
    {
        id: 'coast-fire-calc',
        name: 'Coast FIRE Calculator',
        description: 'Calculate your Coast FIRE milestone number, years to retirement compounding, surplus or deficit gap, age-by-age growth trajectory, and savings bridge plan without saving another dollar.',
        category: 'Retirement & FIRE',
        categorySlug: 'retirement',
        path: '/fire-forecaster',
        keywords: [
            'coast fire calculator',
            'coast fire',
            'coast fi',
            'coast fire number',
            'fire calculator',
            'financial independence retire early',
            'barista fire',
            'retirement milestone',
            'safe withdrawal rate',
            'portfolio growth projection'
        ],
        icon: 'rocket_launch',
        badge: 'Milestone'
    },
    {
        id: '401k-calc',
        name: '401(k) Calculator (US Retirement)',
        description: 'Calculate 401(k) balance at retirement, employer match capture, IRS elective deferral limits ($23,500), age 50+ catch-up ($7,500), SECURE 2.0 catch-up ($11,250), money left on the table analysis, and SECURE 2.0 RMD projections.',
        category: 'Retirement & FIRE',
        categorySlug: 'retirement',
        path: '/finance/401k-calculator',
        keywords: [
            '401k calculator',
            '401k',
            '401(k)',
            '401(k) calculator',
            '401 k',
            '401 k calculator',
            '401k match',
            'employer match calculator',
            'money left on the table',
            'catch up contribution',
            'irs 401k limit',
            'elective deferral',
            'roth 401k vs traditional',
            'rmd calculator',
            'secure 2.0',
            'retirement nest egg',
            'retirement calculator'
        ],
        icon: 'savings',
        badge: 'Popular'
    },
    {
        id: 'roth-vs-traditional-calc',
        name: 'Roth vs Traditional Calculator',
        description: 'Compare pre-tax Traditional vs after-tax Roth contributions under an equal after-tax outlay. Calculate both end values, net after-tax difference, and exact break-even retirement tax rate alongside RMD and IRS MAGI limit guidance.',
        category: 'Retirement & Pension',
        categorySlug: 'retirement',
        path: '/finance/roth-vs-traditional-calculator',
        keywords: [
            'roth vs traditional calculator',
            'roth vs traditional 401k',
            'roth vs traditional ira',
            'equal after-tax outlay',
            'break-even retirement tax rate',
            'pre-tax vs roth',
            'rmd comparison',
            'roth income limits',
            'tax diversification'
        ],
        icon: 'balance',
        badge: 'Popular'
    },
    {
        id: 'rmd-calc',
        name: 'RMD Calculator',
        description: 'Calculate your mandatory Required Minimum Distribution (RMD), percentage of prior year-end balance, withdrawal deadlines, and SECURE 2.0 excise tax penalty exposure using IRS Publication 590-B Uniform Lifetime (Table III) and Joint Life (Table II) factors.',
        category: 'Retirement & Pension',
        categorySlug: 'retirement',
        path: '/finance/rmd-calculator',
        keywords: [
            'rmd calculator',
            'required minimum distribution calculator',
            'irs uniform lifetime table',
            'joint life expectancy table rmd',
            'secure 2.0 rmd age 73 75',
            '401k rmd calculator',
            'ira rmd calculator',
            'missed rmd penalty'
        ],
        icon: 'event_available',
        badge: 'Popular'
    },
    {
        id: 'cd-ladder-calc',
        name: 'CD Ladder Calculator',
        description: 'Build and optimize multi-term Certificate of Deposit (CD) ladders. Calculate blended APY yield, visualize staggered maturity timelines, model early-withdrawal penalties, and compare ladder vs lump-sum CD.',
        category: 'Savings & Liquidity',
        categorySlug: 'savings',
        path: '/finance/cd-ladder-calculator',
        keywords: [
            'cd ladder calculator',
            'cd ladder',
            'certificate of deposit ladder',
            'blended apy',
            'cd maturity timeline',
            'ladder vs single cd',
            'rolling cd reinvestment',
            'early withdrawal penalty cd'
        ],
        icon: 'stacked_line_chart',
        badge: 'Popular'
    },
    {
        id: 'apy-calc',
        name: 'APY Calculator',
        description: 'Convert nominal APR to effective APY across daily, monthly, or continuous compounding. Compare bank accounts side-by-side and solve reverse nominal interest rates.',
        category: 'Savings & Liquidity',
        categorySlug: 'savings',
        path: '/finance/apy-calculator',
        keywords: [
            'apy calculator',
            'apr to apy',
            'annual percentage yield',
            'compound interest apy',
            'effective interest rate',
            'daily compounding apy',
            'hysa apy',
            'cd apy calculator'
        ],
        icon: 'percent',
        badge: 'Popular'
    },
    {
        id: 'rule-of-72-calc',
        name: 'Rule of 72 Calculator',
        description: 'Calculate how long it takes your money to double at any interest rate, solve the rate required to double within target years, and inspect inflation purchasing power halving time.',
        category: 'Investing & Growth',
        categorySlug: 'investing',
        path: '/finance/rule-of-72-calculator',
        keywords: [
            'rule of 72 calculator',
            'rule of 72',
            'doubling time calculator',
            'double money calculator',
            'rule of 70',
            'rule of 69',
            'inflation halving',
            'how long to double money'
        ],
        icon: 'trending_up',
        badge: 'Popular'
    },
    {
        id: 'inflation-calc',
        name: 'Inflation Calculator',
        description: 'Calculate future cost of goods, purchasing power erosion of cash, and exact Fisher equation real investment returns with sourced benchmark rates.',
        category: 'Investing & Growth',
        categorySlug: 'investing',
        path: '/finance/real-rate-of-return-calculator',
        keywords: [
            'inflation calculator',
            'purchasing power calculator',
            'real return calculator',
            'future cost calculator',
            'inflation',
            'real vs nominal return',
            'fisher equation',
            'cpi calculator',
            'rbi inflation'
        ],
        icon: 'trending_up',
        badge: 'Popular'
    },
    {
        id: 'roi-calc',
        name: 'ROI Calculator',
        description: 'Calculate Return on Investment (ROI), annualized ROI, net gain with costs and dividends, compare up to 3 investments, and audit when ROI misleads.',
        category: 'Investing & Growth',
        categorySlug: 'investing',
        path: '/finance/investment-growth-calculator',
        keywords: [
            'roi calculator',
            'return on investment',
            'annualized roi',
            'roi',
            'net gain calculator',
            'roi comparison',
            'roi vs cagr'
        ],
        icon: 'paid',
        badge: 'Popular'
    },
    {
        id: 'cagr-calc',
        name: 'CAGR Calculator',
        description: 'Calculate Compound Annual Growth Rate (CAGR), ending portfolio value, or time required with exact calendar dates, volatility drag simulation, and XIRR comparison.',
        category: 'Investing & Growth',
        categorySlug: 'investing',
        path: '/finance/investment-growth-calculator',
        keywords: [
            'cagr calculator',
            'cagr',
            'compound annual growth rate',
            'annualized return',
            'volatility drag',
            'geometric mean',
            'cagr vs xirr'
        ],
        icon: 'show_chart',
        badge: 'Popular'
    },
    {
        id: 'lumpsum-calc',
        name: 'Lumpsum Calculator',
        description: 'Calculate future maturity corpus, compounding wealth multiplier, doubling time, inflation-adjusted purchasing power, and Lumpsum vs SIP benchmarking.',
        category: 'Investing & Growth',
        categorySlug: 'investing',
        path: '/finance/lumpsum-calculator',
        keywords: [
            'lumpsum calculator',
            'lump sum calculator',
            'lumpsum vs sip',
            'one time investment',
            'mutual fund lumpsum',
            'wealth multiplier',
            'doubling time'
        ],
        icon: 'savings',
        badge: 'Popular'
    },
    {
        id: 'sip-calc',
        name: 'SIP Calculator',
        description: 'Calculate mutual fund SIP returns, annual step-up growth, inflation-adjusted real purchasing power, cost of waiting, and target goal planning.',
        category: 'Investing & Growth',
        categorySlug: 'investing',
        path: '/compound-interest-calculator',
        keywords: [
            'sip calculator',
            'sip',
            'sip calculator with step up',
            'step up sip calculator',
            'systematic investment plan',
            'mutual fund sip',
            'sip returns calculator',
            'crorepati sip calculator'
        ],
        icon: 'trending_up',
        badge: 'Popular'
    },
    {
        id: 'mortgage-affordability-calc',
        name: 'Mortgage Affordability Calculator',
        description: 'Calculate how much house you can afford based on income, monthly debts, 28/36 DTI limits, down payment, taxes, insurance, and rates.',
        category: 'Mortgages & Real Estate',
        categorySlug: 'mortgages',
        path: '/finance/mortgage-affordability-calculator',
        keywords: [
            'mortgage affordability',
            'how much house can i afford',
            'home affordability',
            'dti calculator',
            'house affordability',
            '28 36 rule'
        ],
        icon: 'real_estate_agent',
        badge: 'Popular'
    },
    {
        id: 'mortgage-points-calc',
        name: 'Mortgage Points Calculator',
        description: 'Calculate discount points cost, monthly payment savings, break-even months, comparison vs larger down payment, and IRS tax deduction rules.',
        category: 'Mortgages & Real Estate',
        categorySlug: 'mortgages',
        path: '/finance/mortgage-points-calculator',
        keywords: [
            'mortgage points',
            'mortgage points calculator',
            'discount points',
            'points vs down payment',
            'rate buydown',
            'mortgage points break even'
        ],
        icon: 'percent',
        badge: 'New'
    },
    {
        id: 'mortgage-calc',
        name: 'Mortgage Calculator',
        description: 'Calculate monthly principal & interest (P&I), property taxes, home insurance, PMI, and amortization schedules.',
        category: 'Mortgages & Real Estate',
        categorySlug: 'mortgages',
        path: '/mortgage-calculator',
        keywords: [
            'mortgage',
            'home loan',
            'amortization',
            'piti',
            'pmi',
            'property tax',
            'home buying',
            'down payment'
        ],
        icon: 'home',
        badge: 'Popular'
    },
    {
        id: 'loan-prepayment-calc',
        name: 'Loan Prepayment Calculator',
        description: 'Calculate exact interest saved and tenure shortened with one-time lump-sum or extra monthly loan prepayments.',
        category: 'Loans & Debt',
        categorySlug: 'loans',
        path: '/finance/loan-prepayment-calculator',
        keywords: [
            'loan prepayment',
            'prepayment calculator',
            'part payment',
            'reduce tenure',
            'reduce emi',
            'save interest',
            'mortgage prepayment'
        ],
        icon: 'trending_down',
        badge: 'New'
    },
    {
        id: 'loan-amortization-calc',
        name: 'Amortization Calculator',
        description: 'Generate month-by-month and year-by-year loan amortization schedules with principal reduction and tipping point analysis.',
        category: 'Loans & Debt',
        categorySlug: 'loans',
        path: '/finance/loan-amortization-calculator',
        keywords: [
            'amortization',
            'amortization calculator',
            'loan schedule',
            'amortization schedule',
            'principal interest table',
            'bi-weekly amortization'
        ],
        icon: 'table_chart',
        badge: 'Popular'
    },
    {
        id: 'debt-payoff-calc',
        name: 'Debt Payoff Calculator (Avalanche vs Snowball)',
        description: 'Compare Debt Avalanche (highest APR) vs Debt Snowball (lowest balance) payoff strategies with multi-debt rollover simulations.',
        category: 'Loans & Debt',
        categorySlug: 'loans',
        path: '/finance/debt-payoff-calculator',
        keywords: [
            'debt payoff',
            'debt snowball vs avalanche',
            'debt avalanche',
            'debt snowball',
            'credit card debt',
            'debt free date',
            'payoff calculator'
        ],
        icon: 'payments',
        badge: 'Popular'
    },
    {
        id: 'credit-card-payoff-calc',
        name: 'Credit Card Payoff Calculator',
        description: 'Calculate credit card payoff dates, monthly payment required for target deadlines, total interest paid, extra monthly payment impact, and comparison vs paying minimum only.',
        category: 'Loans & Debt',
        categorySlug: 'loans',
        path: '/finance/credit-card-payoff-calculator',
        keywords: [
            'credit card payoff',
            'credit card payoff calculator',
            'payoff credit card',
            'credit card interest',
            'minimum payment calculator',
            'credit card debt'
        ],
        icon: 'credit_card',
        badge: 'Popular'
    },
    {
        id: 'credit-card-minimum-calc',
        name: 'Credit Card Minimum Payment Calculator',
        description: 'Calculate how long it takes to pay off credit card debt by paying only the minimum payment. See total interest paid, compare with freezing your payment, and explore statutory issuer rules.',
        category: 'Loans & Debt',
        categorySlug: 'loans',
        path: '/finance/credit-card-minimum-payment-calculator',
        keywords: [
            'credit card minimum payment',
            'credit card minimum payment calculator',
            'minimum payment calculator',
            'minimum amount due calculator',
            'card minimum payment'
        ],
        icon: 'credit_card',
        badge: 'New'
    },
    {
        id: 'balance-transfer-calc',
        name: 'Balance Transfer Calculator',
        description: 'Compare keeping your credit card vs transferring to a 0% introductory APR offer. Calculate net interest savings after transfer fees, break-even timeline, and zero-interest payoff strategy.',
        category: 'Loans & Debt',
        categorySlug: 'loans',
        path: '/finance/balance-transfer-calculator',
        keywords: [
            'balance transfer calculator',
            'credit card balance transfer',
            '0% apr calculator',
            'balance transfer fee calculator',
            'balance transfer savings',
            'promo apr calculator',
            '0 apr balance transfer'
        ],
        icon: 'sync_alt',
        badge: 'New'
    },
    {
        id: 'personal-loan-calc',
        name: 'Personal Loan Calculator',
        description: 'Calculate personal loan EMI, true effective APR including processing fees and GST, net disbursal in hand, and compare two lender offers side by side.',
        category: 'Loans & Debt',
        categorySlug: 'loans',
        path: '/finance/personal-loan-calculator',
        keywords: [
            'personal loan calculator',
            'personal loan emi',
            'personal loan',
            'processing fee gst',
            'net disbursal',
            'compare loan offers',
            'effective apr personal loan'
        ],
        icon: 'account_balance_wallet',
        badge: 'Popular'
    },
    {
        id: 'car-loan-calc',
        name: 'Car Loan Calculator',
        description: 'Calculate monthly auto loan payments, sales tax, trade-in equity, total interest, and evaluate the 20/4/10 affordability rule across 36 to 84-month terms.',
        category: 'Loans & Debt',
        categorySlug: 'loans',
        path: '/finance/car-loan-calculator',
        keywords: [
            'car loan calculator',
            'auto loan calculator',
            'car emi',
            '20 4 10 rule',
            'trade in tax credit',
            'negative equity car loan',
            'vehicle loan calculator'
        ],
        icon: 'directions_car',
        badge: 'New'
    },
    {
        id: 'ltv-calc',
        name: 'LTV Calculator',
        description: 'Calculate Loan-to-Value (LTV), Combined CLTV with HELOCs, home equity, pay-down required to cancel PMI at 80%, and India RBI housing loan ceilings.',
        category: 'Mortgages & Real Estate',
        categorySlug: 'mortgages',
        path: '/finance/ltv-calculator',
        keywords: [
            'ltv calculator',
            'loan to value calculator',
            'cltv calculator',
            'cancel pmi ltv',
            'home equity',
            'rbi ltv cap',
            'combined loan to value'
        ],
        icon: 'percent',
        badge: 'New'
    },
    {
        id: 'loan-refinance-calc',
        name: 'Loan Refinance Calculator',
        description: 'Calculate monthly savings, break-even months, total interest reduction, and compare equal vs extended tenure for loan refinancing and home loan balance transfers.',
        category: 'Loans & Debt',
        categorySlug: 'loans',
        path: '/finance/loan-refinance-calculator',
        keywords: [
            'loan refinance calculator',
            'home loan balance transfer calculator',
            'mortgage refinance break even',
            'refinance savings',
            'balance transfer',
            'interest delta'
        ],
        icon: 'sync_alt',
        badge: 'Popular'
    },
    {
        id: 'refinance-break-even-calc',
        name: 'Mortgage Refinance Break-Even Calculator',
        description: 'Calculate mortgage refinance break-even month, monthly payment savings, horizon net savings, closing cost recovery, and compare 15-year vs 30-year terms.',
        category: 'Mortgages & Real Estate',
        categorySlug: 'mortgages',
        path: '/finance/refinance-break-even-calculator',
        keywords: [
            'refinance break even calculator',
            'mortgage refinance calculator',
            'refinance break even',
            'closing cost recovery',
            '15 vs 30 year refi'
        ],
        icon: 'published_with_changes',
        badge: 'New'
    },
    {
        id: 'loan-emi-calc',
        name: 'Loan & EMI Calculator',
        description: 'Calculate Equated Monthly Installments (EMI), total interest payable, and payoff timelines for personal, auto, or home loans.',
        category: 'Loans & Debt',
        categorySlug: 'loans',
        path: '/finance/emi-calculator/in',
        keywords: [
            'emi',
            'loan calculator',
            'personal loan',
            'car loan',
            'auto loan',
            'debt payoff',
            'interest payment'
        ],
        icon: 'payments',
        badge: 'Popular'
    },
    {
        id: 'compound-interest-calc',
        name: 'Compound Interest Calculator',
        description: 'Model compounding growth over time with initial deposit, regular contributions, interest rates, and compounding frequencies.',
        category: 'Investing & Growth',
        categorySlug: 'investing',
        path: '/compound-interest-calculator',
        keywords: [
            'compound interest',
            'apy',
            'savings growth',
            'future value',
            'compounding frequency',
            'interest rate'
        ],
        icon: 'trending_up',
        badge: 'Popular'
    },
    {
        id: 'investment-calc',
        name: 'Investment Return & CAGR Calculator',
        description: 'Compute cumulative investment returns, annualized growth (CAGR), periodic contributions, and lump-sum scenarios.',
        category: 'Investing & Growth',
        categorySlug: 'investing',
        path: '/finance/investment-calculator/in',
        keywords: [
            'investment return',
            'cagr',
            'sip',
            'stock market',
            'lump sum',
            'portfolio growth',
            'dca'
        ],
        icon: 'monitoring',
        badge: 'Popular'
    },
    {
        id: 'fire-forecaster',
        name: 'Retirement & FIRE Forecaster',
        description: 'Estimate your Financial Independence number, target retirement timeline, Coast FIRE, and safe withdrawal rates (3%–5%).',
        category: 'Retirement & Pension',
        categorySlug: 'retirement',
        path: '/finance/fire-forecaster',
        keywords: [
            'retirement',
            'fire',
            'retire early',
            'financial independence',
            'safe withdrawal rate',
            '4% rule',
            'nest egg'
        ],
        icon: 'local_fire_department',
        badge: 'Popular'
    },
    {
        id: 'retirement-countdown',
        name: 'Retirement Countdown',
        description: 'Track exact calendar days, workdays, shifts, PTO, and working hours remaining until your target retirement date.',
        category: 'Retirement & Pension',
        categorySlug: 'retirement',
        path: '/finance/retirement',
        keywords: [
            'retirement countdown',
            'working days to retirement',
            'work hours',
            'retirement date'
        ],
        icon: 'event_available',
        badge: 'Featured'
    },
    {
        id: 'global-tax-calc',
        name: 'Income Tax Calculator',
        description: 'Explore progressive income tax brackets, marginal vs. effective tax rates, and standard deductions by jurisdiction.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance',
        keywords: [
            'tax',
            'income tax',
            'tax bracket',
            'marginal tax',
            'effective tax',
            'deductions',
            '1040',
            'paye'
        ],
        icon: 'receipt_long',
        badge: 'Popular'
    },
    {
        id: 'salary-daily-wage',
        name: 'Salary & Take-Home Pay Calculator',
        description: 'Convert annual wages into hourly, weekly, bi-weekly, and monthly net pay estimates with deductions.',
        category: 'Salary & Budgeting',
        categorySlug: 'salary',
        path: '/finance/salary',
        keywords: [
            'salary',
            'take home pay',
            'daily wage',
            'paycheck',
            'gross to net',
            'hourly rate',
            'payroll'
        ],
        icon: 'work',
        badge: 'Popular'
    },
    {
        id: 'loans-amortization-hub',
        name: 'Debt Payoff & Amortization Suite',
        description: 'Compare avalanche and snowball debt payoff strategies, model extra principal payments, and save on interest.',
        category: 'Loans & Debt',
        categorySlug: 'loans',
        path: '/finance/loans',
        keywords: [
            'debt payoff',
            'amortization table',
            'extra payments',
            'snowball',
            'avalanche',
            'interest reduction'
        ],
        icon: 'account_balance_wallet'
    },
    {
        id: 'credit-cards-revolving',
        name: 'Credit Card Payoff Calculator',
        description: 'Calculate interest charges, evaluate fixed payoff strategies, and compare 0% APR balance transfer scenarios.',
        category: 'Credit Cards',
        categorySlug: 'credit-cards',
        path: '/finance/credit-cards',
        keywords: [
            'credit card',
            'credit card payoff',
            'balance transfer',
            'apr',
            'minimum payment',
            'revolving debt'
        ],
        icon: 'credit_card'
    },
    {
        id: 'savings-liquidity-hub',
        name: 'Savings & Emergency Fund Calculator',
        description: 'Determine 3-6 month emergency fund requirements and project high-yield savings interest growth.',
        category: 'Savings & Liquidity',
        categorySlug: 'savings',
        path: '/finance/savings',
        keywords: [
            'savings',
            'emergency fund',
            'apy',
            'high yield savings',
            'savings goal',
            'liquidity'
        ],
        icon: 'savings'
    },
    {
        id: 'banking-cash-accounts',
        name: 'Banking & Cash Accounts Hub',
        description: 'Compare compounding frequencies, certificate of deposit (CD) ladders, and checking account APY.',
        category: 'Banking & Cash Accounts',
        categorySlug: 'banking',
        path: '/finance/banking',
        keywords: [
            'banking',
            'cd ladder',
            'checking account',
            'deposit interest',
            'cash management'
        ],
        icon: 'account_balance'
    },
    {
        id: 'freelance-hourly-rate',
        name: 'Freelance & Business Rate Calculator',
        description: 'Calculate sustainable billable hourly rates covering taxes, health benefits, operating expenses, and target profit.',
        category: 'Business Finance',
        categorySlug: 'business',
        path: '/finance/salary-to-hourly-calculator',
        keywords: [
            'freelance rate',
            'hourly rate',
            'business profit',
            'billable hours',
            'self employment'
        ],
        icon: 'storefront'
    },
    {
        id: 'meeting-cost-calc',
        name: 'Meeting Cost & Operational Calculator',
        description: 'Calculate the true financial and operational expense of team meetings based on participant compensation.',
        category: 'Business Finance',
        categorySlug: 'business',
        path: '/meeting-cost-calculator',
        keywords: [
            'meeting cost',
            'business expense',
            'operational cost',
            'salary burn'
        ],
        icon: 'groups'
    },
    {
        id: 'percentage-financial-calc',
        name: 'Margin & Percentage Calculator',
        description: 'Calculate profit margins, retail markups, discount savings, and percentage changes with step-by-step math.',
        category: 'Business Finance',
        categorySlug: 'percentage-calculator',
        path: '/math/percentage-calculator',
        keywords: [
            'percentage',
            'margin',
            'markup',
            'profit margin',
            'discount',
            'percent change'
        ],
        icon: 'percent'
    },
    {
        id: 'work-hours-payroll',
        name: 'Work Hours & Payroll Calculator',
        description: 'Track daily clock-in/out hours, lunch breaks, overtime multipliers, and gross paycheck totals.',
        category: 'Salary & Budgeting',
        categorySlug: 'work-hours-payroll-calculator',
        path: '/time-duration-calculator',
        keywords: [
            'work hours',
            'timesheet',
            'payroll',
            'overtime',
            'hourly pay'
        ],
        icon: 'schedule'
    },
    {
        id: 'us-federal-income-tax-calc',
        name: 'US Federal Income Tax Calculator',
        description: 'Calculate 2025/2024 US Federal Income Tax across all 7 IRS brackets, AGI, standard vs itemized deductions, credits, and withholding refund/owed.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/us-federal-income-tax-calculator',
        keywords: ['us federal income tax calculator', 'federal tax calculator', 'irs tax brackets', 'marginal vs effective tax rate'],
        icon: 'receipt_long',
        badge: 'Popular'
    },
    {
        id: 'us-state-take-home-calc',
        name: 'US State Take-Home Paycheck Calculator',
        description: 'Calculate net paycheck per year, month, bi-weekly, and hour across CA, NY, TX, FL, WA, and US states with FICA and state SDI.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/us-state-take-home-calculator',
        keywords: ['us state take home calculator', 'paycheck calculator', 'california paycheck calculator', 'texas take home pay'],
        icon: 'payments',
        badge: 'Popular'
    },
    {
        id: 'self-employment-tax-calc',
        name: 'Self-Employment Tax Calculator',
        description: 'Calculate 2025 IRS Schedule SE tax (15.3% on 92.35% profit), 50% SE tax deduction, W-2 SS cap coordination, and quarterly 1040-ES dates.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/self-employment-tax-calculator',
        keywords: ['self employment tax calculator', '1099 tax calculator', 'schedule se', 'quarterly estimated tax'],
        icon: 'work',
        badge: 'New'
    },
    {
        id: 'capital-gains-tax-calc',
        name: 'Capital Gains Tax Calculator (US)',
        description: 'Calculate short-term and long-term capital gains tax (0%, 15%, 20%), 3.8% NIIT, holding period, and $3,000 capital loss offset.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/capital-gains-tax-calculator',
        keywords: ['capital gains tax calculator', 'long term capital gains', 'niit', 'stock crypto tax'],
        icon: 'trending_up',
        badge: 'Popular'
    },
    {
        id: 'india-capital-gains-tax-calc',
        name: 'India Capital Gains Tax Calculator',
        description: 'Calculate India LTCG (12.5% above ₹1.25L u/s 112A) and STCG (20% u/s 111A) on listed equity, mutual funds, and real estate.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/india-capital-gains-tax-calculator',
        keywords: ['india capital gains calculator', 'ltcg 12.5%', 'stcg 20%', 'section 112a'],
        icon: 'trending_up',
        badge: 'New'
    },
    {
        id: '1099-vs-w2-calc',
        name: '1099 vs W-2 Calculator',
        description: 'Compare 1099 contractor vs W-2 employee net pay and benefits, and solve for the exact break-even 1099 hourly and annual rate.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/1099-vs-w2-calculator',
        keywords: ['1099 vs w2 calculator', 'contractor vs employee', 'break even 1099 rate'],
        icon: 'balance',
        badge: 'Popular'
    },
    {
        id: 'uk-paye-calc',
        name: 'UK PAYE Tax Calculator',
        description: 'Calculate UK take-home salary after HMRC income tax bands (rUK & Scotland), £100k Personal Allowance taper, Class 1 NI, pension, and student loans.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/uk-paye-calculator',
        keywords: ['uk paye calculator', 'uk tax calculator', 'national insurance', 'scottish tax calculator'],
        icon: 'receipt_long',
        badge: 'Popular'
    },
    {
        id: 'canada-income-tax-calc',
        name: 'Canada Income Tax Calculator',
        description: 'Calculate 2025 CRA federal and provincial tax (Ontario, BC, Alberta), RRSP deductions, CPP/CPP2, and EI.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/canada-income-tax-calculator',
        keywords: ['canada income tax calculator', 'ontario tax calculator', 'bc tax calculator', 'cpp2 ei'],
        icon: 'receipt_long',
        badge: 'Popular'
    },
    {
        id: 'india-income-tax-calc',
        name: 'India Income Tax Calculator (New vs Old Regime)',
        description: 'Compare FY 2025-26 & 2024-25 New vs Old Regime tax, ₹12L Section 87A rebate, and exact deductions required for Old Regime to win.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/india-income-tax-calculator',
        keywords: ['india income tax calculator', 'new vs old regime', 'section 115bac', '87a rebate'],
        icon: 'receipt_long',
        badge: 'Popular'
    },
    {
        id: 'hra-exemption-calc',
        name: 'HRA Exemption Calculator',
        description: 'Calculate tax-exempt and taxable House Rent Allowance under Section 10(13A) and Rule 2A for Metro (50%) and Non-Metro (40%) cities.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/hra-exemption-calculator',
        keywords: ['hra exemption calculator', 'hra calculator', 'section 10 13a', 'metro non metro hra'],
        icon: 'home',
        badge: 'Popular'
    },
    {
        id: 'germany-income-tax-calc',
        name: 'Germany Income Tax Calculator',
        description: 'Calculate 2025 German net salary after § 32a EStG income tax, €12,096 Grundfreibetrag, and employee social security contributions.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/germany-income-tax-calculator',
        keywords: ['germany income tax calculator', 'brutto netto rechner', 'estg 2025'],
        icon: 'public'
    },
    {
        id: 'france-income-tax-calc',
        name: 'France Income Tax Calculator',
        description: 'Calculate 2025 French net salary after Cotisations Sociales, 10% expense deduction, Quotient Familial, and DGFiP progressive brackets.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/france-income-tax-calculator',
        keywords: ['france income tax calculator', 'impot sur le revenu', 'salaire brut en net'],
        icon: 'public'
    },
    {
        id: 'uae-income-tax-calc',
        name: 'UAE Salary & Income Tax Calculator',
        description: 'Verify 2025 UAE 0% personal income tax take-home pay for expatriates and 5% GPSSA pension deductions for UAE Nationals.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/uae-income-tax-calculator',
        keywords: ['uae income tax calculator', 'dubai salary calculator', 'gpssa pension'],
        icon: 'public'
    },
    {
        id: 'singapore-income-tax-calc',
        name: 'Singapore Income Tax & CPF Calculator',
        description: 'Calculate YA 2025 Singapore net pay after IRAS progressive resident tax bands (0%-24%) and 20% employee CPF contributions.',
        category: 'Taxes',
        categorySlug: 'taxes',
        path: '/finance/singapore-income-tax-calculator',
        keywords: ['singapore income tax calculator', 'iras tax calculator', 'cpf calculator'],
        icon: 'public'
    },
    {
        id: 'salary-to-hourly-calc',
        name: 'Salary to Hourly Calculator',
        description: 'Convert annual salary to hourly wage (or hourly to annual) across daily, weekly, bi-weekly, semi-monthly, and monthly periods.',
        category: 'Salary & Budgeting',
        categorySlug: 'salary',
        path: '/finance/salary-to-hourly-calculator',
        keywords: ['salary to hourly calculator', 'hourly to salary', '2080 hours'],
        icon: 'schedule',
        badge: 'Popular'
    },
    {
        id: 'take-home-pay-calc',
        name: 'Take-Home Pay Calculator',
        description: 'Calculate net paycheck after taxes, FICA/EPF, and retirement deductions in US Paycheck and India CTC modes.',
        category: 'Salary & Budgeting',
        categorySlug: 'salary',
        path: '/finance/take-home-pay-calculator',
        keywords: ['take home pay calculator', 'net salary calculator', 'paycheck calculator'],
        icon: 'payments',
        badge: 'Popular'
    },
    {
        id: 'in-hand-salary-calc',
        name: 'In-Hand Salary Calculator (India CTC)',
        description: 'Convert annual CTC into monthly in-hand salary after 12% EPF, Gratuity, State Professional Tax, and FY 2025-26 TDS.',
        category: 'Salary & Budgeting',
        categorySlug: 'salary',
        path: '/finance/in-hand-salary-calculator',
        keywords: ['in hand salary calculator', 'ctc to in hand calculator', 'take home salary india'],
        icon: 'payments',
        badge: 'Popular'
    },
    {
        id: 'overtime-pay-calc',
        name: 'Overtime Pay Calculator',
        description: 'Calculate 1.5x time-and-a-half and 2.0x double-time overtime pay, weekly gross, and effective hourly rate under FLSA rules.',
        category: 'Salary & Budgeting',
        categorySlug: 'salary',
        path: '/finance/overtime-pay-calculator',
        keywords: ['overtime pay calculator', 'time and a half calculator', 'double time calculator'],
        icon: 'schedule',
        badge: 'New'
    },
    {
        id: 'pay-raise-calc',
        name: 'Pay Raise Calculator',
        description: 'Calculate new pay across all periods after a raise %, Fisher real raise after inflation, and multi-year compounding.',
        category: 'Salary & Budgeting',
        categorySlug: 'salary',
        path: '/finance/pay-raise-calculator',
        keywords: ['pay raise calculator', 'salary increase calculator', 'real wage raise'],
        icon: 'trending_up',
        badge: 'Popular'
    },
    {
        id: 'bonus-tax-calc',
        name: 'Bonus Tax Calculator',
        description: 'Calculate net bonus check after 22% IRS flat supplemental withholding (37% over $1M), FICA, and state supplemental rates.',
        category: 'Salary & Budgeting',
        categorySlug: 'salary',
        path: '/finance/bonus-tax-calculator',
        keywords: ['bonus tax calculator', 'supplemental tax rate 22%', 'net bonus calculator'],
        icon: 'paid',
        badge: 'New'
    },
    {
        id: 'margin-calc',
        name: 'Margin Calculator',
        description: 'Solve for Gross Margin %, Selling Price, or Cost from any two inputs with Gross Profit and Markup conversion table.',
        category: 'Business Finance',
        categorySlug: 'business',
        path: '/finance/margin-calculator',
        keywords: ['margin calculator', 'gross margin calculator', 'margin vs markup'],
        icon: 'percent',
        badge: 'Popular'
    },
    {
        id: 'markup-calc',
        name: 'Markup Calculator',
        description: 'Calculate selling price, profit, and equivalent gross margin % from cost and markup % with discount and tax options.',
        category: 'Business Finance',
        categorySlug: 'business',
        path: '/finance/markup-calculator',
        keywords: ['markup calculator', 'cost to price calculator', 'keystone markup'],
        icon: 'sell',
        badge: 'Popular'
    },
    {
        id: 'break-even-calc',
        name: 'Break-Even Calculator',
        description: 'Calculate Break-Even Point (BEP) in units and revenue, contribution margin, target profit volume, and margin of safety.',
        category: 'Business Finance',
        categorySlug: 'business',
        path: '/finance/break-even-calculator',
        keywords: ['break even calculator', 'bep calculator', 'contribution margin', 'margin of safety'],
        icon: 'analytics',
        badge: 'Popular'
    },
    {
        id: 'profit-margin-calc',
        name: 'Profit Margin Calculator',
        description: 'Calculate Gross, EBITDA, Operating, and Net Profit Margin with an income statement waterfall and Damodaran sector benchmarks.',
        category: 'Business Finance',
        categorySlug: 'business',
        path: '/finance/profit-margin-calculator',
        keywords: ['profit margin calculator', 'net profit margin', 'operating margin', 'damodaran sector margins'],
        icon: 'monitoring',
        badge: 'Popular'
    }
];
export const POPULAR_FINANCE_TOOLS = FINANCE_CATALOG.filter((t)=>[
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
        'freelance-hourly-rate'
    ].includes(t.id));
export const FINANCE_GOALS = [
    {
        id: 'buy-home',
        title: 'Buy a Home',
        subtitle: 'Determine monthly mortgage affordability, down payments, and amortization.',
        icon: 'home',
        tools: [
            {
                name: 'Mortgage Calculator',
                path: '/mortgage-calculator',
                desc: 'Monthly principal, interest, taxes, and insurance (PITI)'
            },
            {
                name: 'Mortgage Debt Suite',
                path: '/finance/mortgages',
                desc: 'LTV, points vs. rate, and refinancing analysis'
            },
            {
                name: 'Loan EMI Calculator',
                path: '/finance/emi-calculator/in',
                desc: 'Home loan equated monthly installment calculations'
            }
        ]
    },
    {
        id: 'pay-off-debt',
        title: 'Pay Off Debt',
        subtitle: 'Evaluate accelerated payoff timelines, snowball vs. avalanche, and interest savings.',
        icon: 'account_balance_wallet',
        tools: [
            {
                name: 'Debt Payoff Calculator (Avalanche & Snowball)',
                path: '/finance/debt-payoff-calculator',
                desc: 'Compare avalanche and snowball reduction methods'
            },
            {
                name: 'Loan Prepayment Calculator',
                path: '/finance/loan-prepayment-calculator',
                desc: 'See how extra lump sum or monthly prepayments cut interest'
            },
            {
                name: 'Loan Amortization Calculator',
                path: '/finance/loan-amortization-calculator',
                desc: 'Month-by-month principal and interest payoff schedules'
            }
        ]
    },
    {
        id: 'grow-money',
        title: 'Grow My Money',
        subtitle: 'Model compound growth trajectories, recurring deposits, and annualized returns.',
        icon: 'trending_up',
        tools: [
            {
                name: 'Compound Interest Calculator',
                path: '/compound-interest-calculator',
                desc: 'Visual growth curve across frequencies and deposits'
            },
            {
                name: 'Investment Return & CAGR',
                path: '/finance/investment-calculator/in',
                desc: 'Lump-sum vs. dollar-cost averaging (DCA) returns'
            },
            {
                name: 'Wealth & Investing Hub',
                path: '/finance/investing',
                desc: 'Dividends, index fund modeling, and portfolio growth'
            }
        ]
    },
    {
        id: 'plan-retirement',
        title: 'Plan Retirement',
        subtitle: 'Simulate portfolio targets, retirement dates, and historical safe withdrawal rates.',
        icon: 'savings',
        tools: [
            {
                name: 'RMD Calculator (IRS Pub 590-B)',
                path: '/finance/rmd-calculator',
                desc: 'Mandatory Required Minimum Distributions, SECURE 2.0 ages (73/75), and Table II/III factors'
            },
            {
                name: 'Roth vs Traditional Calculator',
                path: '/finance/roth-vs-traditional-calculator',
                desc: 'Equal after-tax outlay comparison, break-even retirement rate, and RMDs'
            },
            {
                name: '401(k) Calculator (US)',
                path: '/finance/401k-calculator',
                desc: 'IRS elective deferral limits, employer match capture, and growth'
            },
            {
                name: 'Coast FIRE Calculator',
                path: '/fire-forecaster',
                desc: 'Coast FIRE number, gap/surplus, and portfolio growth projection'
            },
            {
                name: 'Safe Withdrawal Rate (4% Rule)',
                path: '/finance/safe-withdrawal-rate-calculator',
                desc: 'Retirement nest egg, 3%–5% sensitivity, and Trinity study'
            },
            {
                name: 'FIRE & Retirement Forecaster',
                path: '/fire-forecaster',
                desc: 'Coast FIRE, Lean FIRE, and safe withdrawal rates (3%–5%)'
            },
            {
                name: 'Retirement Countdown in Workdays',
                path: '/date-difference-calculator',
                desc: 'Exact calendar days, work shifts, and hours remaining'
            },
            {
                name: 'Retirement & Super Hub',
                path: '/finance/retirement',
                desc: '401(k), IRA, pension, and employer match scenarios'
            }
        ]
    },
    {
        id: 'save-more',
        title: 'Save More',
        subtitle: 'Build emergency reserve funds and calculate target monthly savings schedules.',
        icon: 'lock',
        tools: [
            {
                name: 'Savings & Liquidity Planner',
                path: '/finance/savings',
                desc: 'Target savings timelines and 3–6 month emergency funds'
            },
            {
                name: 'Banking & CD Ladders',
                path: '/finance/banking',
                desc: 'Compound interest on certificates of deposit & HYSA'
            },
            {
                name: 'Compound Interest Growth',
                path: '/compound-interest-calculator',
                desc: 'Future value projections with regular monthly savings'
            }
        ]
    },
    {
        id: 'understand-pay',
        title: 'Understand My Pay',
        subtitle: 'Convert gross salary into net pay and see tax withholding estimates.',
        icon: 'badge',
        tools: [
            {
                name: 'Salary & Compensation Hub',
                path: '/finance/salary',
                desc: 'Convert hourly, daily, or annual salary to take-home pay'
            },
            {
                name: 'Work Hours & Timesheets',
                path: '/time-duration-calculator',
                desc: 'Bi-weekly checks, overtime shifts, and deductions'
            },
            {
                name: 'Income Tax Calculator',
                path: '/finance',
                desc: 'Marginal vs. effective tax brackets and withholdings'
            }
        ]
    },
    {
        id: 'run-business',
        title: 'Run a Business',
        subtitle: 'Estimate profit margins, break-even hourly rates, and meeting operational costs.',
        icon: 'storefront',
        tools: [
            {
                name: 'Freelance Rate Calculator',
                path: '/finance/salary-to-hourly-calculator',
                desc: 'Determine billable rates covering taxes and overhead'
            },
            {
                name: 'Margin & Markup Calculator',
                path: '/finance/margin-calculator',
                desc: 'Gross margin vs. markup and discount structures'
            },
            {
                name: 'Meeting Cost Calculator',
                path: '/meeting-cost-calculator',
                desc: 'Calculate the true operational expense of team meetings'
            }
        ]
    }
];
export const FINANCIAL_QUESTIONS = [
    {
        question: 'How much is my mandatory Required Minimum Distribution (RMD) from my IRA or 401(k)?',
        toolName: 'RMD Calculator',
        path: '/finance/rmd-calculator',
        hint: 'Calculate your exact RMD from IRS Uniform Lifetime & Joint Life tables, deadlines, and SECURE 2.0 start ages.',
        icon: 'event_available'
    },
    {
        question: 'Should I contribute to a pre-tax Traditional or after-tax Roth account?',
        toolName: 'Roth vs Traditional Calculator',
        path: '/finance/roth-vs-traditional-calculator',
        hint: 'Compare equal after-tax outlays, calculate the break-even retirement tax rate, and evaluate RMDs.',
        icon: 'balance'
    },
    {
        question: 'How much will I accumulate in my 401(k) and am I leaving employer match on the table?',
        toolName: '401(k) Calculator',
        path: '/finance/401k-calculator',
        hint: 'Model yearly deferrals up to IRS limits, verify employer match capture, and project retirement balance.',
        icon: 'savings'
    },
    {
        question: 'How much will my monthly loan payment be?',
        toolName: 'Loan & EMI Calculator',
        path: '/finance/emi-calculator/in',
        hint: 'Calculate principal, interest, and monthly installments across varying terms.',
        icon: 'calculate'
    },
    {
        question: 'How much interest will I pay over the life of a loan?',
        toolName: 'Amortization Calculator',
        path: '/finance/loan-amortization-calculator',
        hint: 'Examine complete amortization tables showing total interest vs. principal.',
        icon: 'account_balance'
    },
    {
        question: 'How much could my regular investments grow over 10 or 20 years?',
        toolName: 'Compound Interest Calculator',
        path: '/compound-interest-calculator',
        hint: 'See how consistent monthly contributions compound with annual returns.',
        icon: 'trending_up'
    },
    {
        question: 'When could I reach my retirement target?',
        toolName: 'FIRE & Retirement Forecaster',
        path: '/fire-forecaster',
        hint: 'Calculate your target portfolio number based on planned annual spending.',
        icon: 'local_fire_department'
    },
    {
        question: 'How much house can I afford each month?',
        toolName: 'Mortgage Calculator',
        path: '/mortgage-calculator',
        hint: 'Model P&I, property taxes, homeowners insurance, and down payment sizes.',
        icon: 'home'
    },
    {
        question: 'How fast can I pay off my credit cards or personal loans?',
        toolName: 'Credit Card Payoff Calculator',
        path: '/finance/credit-cards',
        hint: 'Compare minimum payments against fixed monthly payoff schedules.',
        icon: 'credit_card'
    },
    {
        question: 'What is my estimated take-home pay after tax withholdings?',
        toolName: 'Salary & Compensation Hub',
        path: '/finance/salary',
        hint: 'Estimate net earnings per shift, week, or month from your gross compensation.',
        icon: 'badge'
    },
    {
        question: 'How much income tax might I owe across brackets?',
        toolName: 'Income Tax Calculator',
        path: '/finance',
        hint: 'Review marginal vs. effective tax rates and standard deductions.',
        icon: 'receipt_long'
    },
    {
        question: 'How many workdays and working hours remain until retirement?',
        toolName: 'Retirement Countdown',
        path: '/date-difference-calculator',
        hint: 'Filter by shift schedules, weekends, holidays, and annual leave.',
        icon: 'event_available'
    },
    {
        question: 'What billable hourly rate covers business taxes and expenses?',
        toolName: 'Freelance Rate Calculator',
        path: '/finance/salary-to-hourly-calculator',
        hint: 'Back out unbillable administrative hours, self-employment tax, and profit.',
        icon: 'work'
    }
];
export const FINANCE_CATEGORIES = [
    {
        id: 'loans-debt',
        name: 'Loans & Debt',
        description: 'Calculate payments, interest, payoff timelines, amortization schedules, and debt reduction strategies.',
        icon: 'payments',
        categoryLink: '/finance/loans',
        popularTools: [
            {
                name: 'Debt Payoff Calculator',
                path: '/finance/debt-payoff-calculator'
            },
            {
                name: 'Loan Prepayment Calculator',
                path: '/finance/loan-prepayment-calculator'
            },
            {
                name: 'Amortization Calculator',
                path: '/finance/loan-amortization-calculator'
            }
        ]
    },
    {
        id: 'mortgages-real-estate',
        name: 'Mortgages & Real Estate',
        description: 'Calculate mortgage payments, property taxes, insurance, down payment impact, and loan-to-value (LTV) ratios.',
        icon: 'home',
        categoryLink: '/finance/mortgages',
        popularTools: [
            {
                name: 'Mortgage Calculator (PITI)',
                path: '/mortgage-calculator'
            },
            {
                name: 'Mortgages & Real Estate Debt',
                path: '/finance/mortgages'
            },
            {
                name: 'Home Loan EMI Calculator',
                path: '/finance/emi-calculator/in'
            }
        ]
    },
    {
        id: 'investing-growth',
        name: 'Investing & Growth',
        description: 'Model compounding interest, portfolio returns, compound annual growth rate (CAGR), lumpsum, and periodic contributions.',
        icon: 'trending_up',
        categoryLink: '/finance/investing',
        popularTools: [
            {
                name: 'Rule of 72 Calculator',
                path: '/finance/rule-of-72-calculator'
            },
            {
                name: 'Inflation Calculator',
                path: '/finance/real-rate-of-return-calculator'
            },
            {
                name: 'ROI Calculator',
                path: '/finance/investment-growth-calculator'
            },
            {
                name: 'CAGR Calculator',
                path: '/finance/investment-growth-calculator'
            },
            {
                name: 'Lumpsum Calculator',
                path: '/finance/lumpsum-calculator'
            },
            {
                name: 'SIP Calculator (with Step-Up)',
                path: '/compound-interest-calculator'
            }
        ]
    },
    {
        id: 'retirement-pension',
        name: 'Retirement & Pension',
        description: 'Plan for financial independence, model 401(k) and superannuation balances, and evaluate withdrawal rates.',
        icon: 'savings',
        categoryLink: '/finance/retirement',
        popularTools: [
            {
                name: 'RMD Calculator (IRS Pub 590-B)',
                path: '/finance/rmd-calculator'
            },
            {
                name: 'Roth vs Traditional Calculator',
                path: '/finance/roth-vs-traditional-calculator'
            },
            {
                name: '401(k) Calculator (US)',
                path: '/finance/401k-calculator'
            },
            {
                name: 'FIRE & Retirement Forecaster',
                path: '/fire-forecaster'
            },
            {
                name: 'Retirement Countdown in Workdays',
                path: '/date-difference-calculator'
            },
            {
                name: 'Retirement & Super Hub',
                path: '/finance/retirement'
            }
        ]
    },
    {
        id: 'savings-liquidity',
        name: 'Savings & Liquidity',
        description: 'Plan emergency funds, determine monthly savings targets, and compute annual percentage yields (APY).',
        icon: 'savings',
        categoryLink: '/finance/savings',
        popularTools: [
            {
                name: 'Savings Goal Calculator',
                path: '/compound-interest-calculator'
            },
            {
                name: 'Emergency Fund Calculator',
                path: '/finance/emergency-fund-calculator'
            },
            {
                name: 'FD Calculator (Fixed Deposit)',
                path: '/finance/fd-calculator'
            },
            {
                name: 'RD Calculator (Recurring Deposit)',
                path: '/finance/rd-calculator'
            },
            {
                name: 'CD Ladder Calculator',
                path: '/finance/cd-ladder-calculator'
            },
            {
                name: 'APY Calculator',
                path: '/finance/apy-calculator'
            }
        ]
    },
    {
        id: 'banking-cash-accounts',
        name: 'Banking & Cash Accounts',
        description: 'Compare interest compounding frequencies, certificate of deposit (CD) ladders, and account terms.',
        icon: 'account_balance',
        categoryLink: '/finance/banking',
        popularTools: [
            {
                name: 'FD Calculator (Fixed Deposit)',
                path: '/finance/fd-calculator'
            },
            {
                name: 'CD Ladder Calculator',
                path: '/finance/cd-ladder-calculator'
            },
            {
                name: 'APY Calculator',
                path: '/finance/apy-calculator'
            },
            {
                name: 'Emergency Savings Planner',
                path: '/finance/savings'
            }
        ]
    },
    {
        id: 'credit-cards-revolving',
        name: 'Credit Cards',
        description: 'Calculate interest costs of revolving balances, evaluate payoff timelines, and compare 0% APR transfers.',
        icon: 'credit_card',
        categoryLink: '/finance/credit-cards',
        popularTools: [
            {
                name: 'Credit Card Payoff Calculator',
                path: '/finance/credit-card-payoff-calculator'
            },
            {
                name: 'Minimum Payment Calculator',
                path: '/finance/credit-card-minimum-payment-calculator'
            },
            {
                name: 'Balance Transfer Calculator',
                path: '/finance/balance-transfer-calculator'
            }
        ]
    },
    {
        id: 'taxes',
        name: 'Taxes & Statutory Withholdings',
        description: 'Model progressive income tax brackets, calculate marginal vs. effective tax rates, and estimate standard deductions.',
        icon: 'receipt_long',
        categoryLink: '/finance',
        popularTools: [
            {
                name: 'US Federal Income Tax Calculator',
                path: '/finance/us-federal-income-tax-calculator'
            },
            {
                name: 'US State Take-Home Calculator',
                path: '/finance/us-state-take-home-calculator'
            },
            {
                name: 'Self-Employment Tax Calculator',
                path: '/finance/self-employment-tax-calculator'
            },
            {
                name: 'Capital Gains Tax Calculator (US)',
                path: '/finance/capital-gains-tax-calculator'
            },
            {
                name: '1099 vs W-2 Calculator',
                path: '/finance/1099-vs-w2-calculator'
            },
            {
                name: 'India Income Tax (New vs Old)',
                path: '/finance/india-income-tax-calculator'
            },
            {
                name: 'HRA Exemption Calculator',
                path: '/finance/hra-exemption-calculator'
            },
            {
                name: 'UK PAYE & Canada Tax Calculators',
                path: '/finance/uk-paye-calculator'
            }
        ]
    },
    {
        id: 'salary-budgeting',
        name: 'Salary & Compensation',
        description: 'Convert annual wages to hourly rates, calculate daily shifts, overtime compensation, and estimated net pay.',
        icon: 'badge',
        categoryLink: '/finance/salary',
        popularTools: [
            {
                name: 'Salary to Hourly Calculator',
                path: '/finance/salary-to-hourly-calculator'
            },
            {
                name: 'Take-Home Pay Calculator (US)',
                path: '/finance/take-home-pay-calculator'
            },
            {
                name: 'In-Hand Salary Calculator (India CTC)',
                path: '/finance/in-hand-salary-calculator'
            },
            {
                name: 'Overtime Pay Calculator',
                path: '/finance/overtime-pay-calculator'
            },
            {
                name: 'Pay Raise Calculator',
                path: '/finance/pay-raise-calculator'
            },
            {
                name: 'Bonus Tax Calculator',
                path: '/finance/bonus-tax-calculator'
            }
        ]
    },
    {
        id: 'business-finance',
        name: 'Business Finance',
        description: 'Estimate gross and net profit margins, determine billable hourly rates, and calculate operational meeting expenses.',
        icon: 'storefront',
        categoryLink: '/finance/business',
        popularTools: [
            {
                name: 'Margin Calculator',
                path: '/finance/margin-calculator'
            },
            {
                name: 'Markup Calculator',
                path: '/finance/markup-calculator'
            },
            {
                name: 'Break-Even Calculator',
                path: '/finance/break-even-calculator'
            },
            {
                name: 'Profit Margin Calculator (Damodaran)',
                path: '/finance/profit-margin-calculator'
            },
            {
                name: 'Freelance Rate Calculator',
                path: '/finance/salary-to-hourly-calculator'
            }
        ]
    }
];
export const REGIONAL_HUBS = [
    {
        country: 'United States',
        flag: '🇺🇸',
        description: 'IRS 1040 federal tax brackets, 30-year fixed mortgages, 401(k) retirement contributions, and state tax estimations.',
        links: [
            {
                name: 'US Income Tax Brackets',
                path: '/finance/us-federal-income-tax-calculator'
            },
            {
                name: 'US Mortgage (P&I + Taxes)',
                path: '/mortgage-calculator'
            },
            {
                name: 'US Loan EMI Calculator',
                path: '/finance/emi-calculator/us'
            }
        ]
    },
    {
        country: 'India',
        flag: '🇮🇳',
        description: 'Income Tax New vs. Old Regime calculations, Home Loan EMI, SIP investments, and GST rate additions/subtractions.',
        links: [
            {
                name: 'India Tax Slabs (Sec 115BAC)',
                path: '/finance/india-income-tax-calculator'
            },
            {
                name: 'India Home Loan EMI',
                path: '/finance/emi-calculator/in'
            },
            {
                name: 'India SIP & Investment',
                path: '/finance/investment-calculator/in'
            }
        ]
    },
    {
        country: 'United Kingdom',
        flag: '🇬🇧',
        description: 'HMRC PAYE income tax bands, National Insurance contributions, mortgage amortizations, and ISA investment trajectories.',
        links: [
            {
                name: 'UK PAYE Income Tax',
                path: '/finance/uk-paye-calculator'
            },
            {
                name: 'UK Loan & Mortgage EMI',
                path: '/finance/emi-calculator/uk'
            },
            {
                name: 'UK Investment Calculator',
                path: '/finance/investment-calculator/uk'
            }
        ]
    },
    {
        country: 'Canada',
        flag: '🇨🇦',
        description: 'Federal and provincial tax brackets, GST/HST calculations, and mortgage amortization rules.',
        links: [
            {
                name: 'Canada Income Tax Brackets',
                path: '/finance/canada-income-tax-calculator'
            },
            {
                name: 'Canada Loan EMI Calculator',
                path: '/finance/emi-calculator/ca'
            },
            {
                name: 'Canada Investment Calculator',
                path: '/finance/investment-calculator/canada'
            }
        ]
    },
    {
        country: 'Australia',
        flag: '🇦🇺',
        description: 'ATO resident tax rates, Medicare levy, 10% GST calculations, and Superannuation accumulation modeling.',
        links: [
            {
                name: 'Australia Stage 3 Tax Rates',
                path: '/retirement-and-super'
            },
            {
                name: 'Australia Loan EMI Calculator',
                path: '/finance/emi-calculator/au'
            },
            {
                name: 'Australia Investment Calculator',
                path: '/finance/investment-calculator/australia'
            }
        ]
    }
];
export const TAX_TRUST_DATA = [
    {
        jurisdiction: 'United States',
        taxYear: '2025 / 2026',
        primarySource: 'Internal Revenue Service (IRS)',
        sourceUrl: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets',
        keyAssumption: 'Standard deductions ($15,000 Single / $30,000 MFJ) and federal inflation-indexed progressive income tax brackets.'
    },
    {
        jurisdiction: 'United Kingdom',
        taxYear: '2024 / 2025 – 2025 / 2026',
        primarySource: 'HM Revenue & Customs (HMRC)',
        sourceUrl: 'https://www.gov.uk/income-tax-rates',
        keyAssumption: 'Personal allowance £12,570, basic (20%), higher (40%), and additional rate (45%) PAYE tax bands.'
    },
    {
        jurisdiction: 'India',
        taxYear: 'FY 2024–25 / AY 2025–26 & FY 2025–26',
        primarySource: 'Income Tax Department (CBDT) & Finance Ministry',
        sourceUrl: 'https://incometaxindia.gov.in/pages/charts-and-tables.aspx',
        keyAssumption: 'Default Section 115BAC New Tax Regime progressive slabs with ₹75,000 salaried standard deduction and 4% Health & Education Cess.'
    },
    {
        jurisdiction: 'Canada',
        taxYear: '2025',
        primarySource: 'Canada Revenue Agency (CRA)',
        sourceUrl: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html',
        keyAssumption: 'Federal progressive tax brackets ($15,705 Basic Personal Amount) combined with statutory provincial rates.'
    },
    {
        jurisdiction: 'Australia',
        taxYear: '2024–2025 / 2025–2026',
        primarySource: 'Australian Taxation Office (ATO)',
        sourceUrl: 'https://www.ato.gov.au/rates-and-codes/individual-income-tax-rates',
        keyAssumption: 'Resident tax scales incorporating Stage 3 tax adjustments ($18,200 tax-free threshold) and statutory 2% Medicare levy.'
    }
];
export const RECENTLY_UPDATED_TOOLS = [
    {
        name: 'Income Tax Calculator',
        path: '/finance',
        description: 'Indexed standard deductions, federal tax brackets, and marginal rate thresholds for the 2025/2026 tax periods.',
        lastUpdated: 'February 2025'
    },
    {
        name: 'Loan & EMI Calculator',
        path: '/finance/emi-calculator/in',
        description: 'Refined amortization curve logic and monthly balance interest calculation formulas for prepayment schedules.',
        lastUpdated: 'February 2025'
    },
    {
        name: 'Compound Interest Calculator',
        path: '/compound-interest-calculator',
        description: 'Added support for continuous, daily, monthly, and quarterly compounding frequencies with regular deposits.',
        lastUpdated: 'February 2025'
    },
    {
        name: 'Mortgage Calculator (P&I)',
        path: '/mortgage-calculator',
        description: 'Updated property tax estimations, homeowners insurance averages, and PMI threshold calculations.',
        lastUpdated: 'February 2025'
    }
];
export const FINANCE_FAQS = [
    {
        q: 'What finance calculators are available on SolveItCalculator?',
        a: 'SolveItCalculator provides practical financial calculation tools covering mortgages, personal/auto loan EMIs, compound interest, investment returns (CAGR), retirement timelines (FIRE), emergency savings, credit card debt payoff, paycheck net wages, and multi-country tax estimation.'
    },
    {
        q: 'Are these finance calculators free to use?',
        a: 'Yes. All calculators on SolveItCalculator are completely free to use. There are no subscriptions, paywalls, or account registration requirements.'
    },
    {
        q: 'How do the finance calculators work?',
        a: 'Calculations are computed locally in your web browser using standard mathematical formulas, official financial amortization algorithms, or documented statutory tax rules. You provide the inputs, and the calculator computes the mathematical results instantly.'
    },
    {
        q: 'Can I compare financial scenarios before making a decision?',
        a: 'Yes. Our Compare Financial Scenarios engine allows you to model choices side-by-side—such as Traditional 401(k) vs. Roth IRA, Renting vs. Buying a Home, or Accelerated Debt Payoff vs. Investing—under customizable assumptions.'
    },
    {
        q: 'Are calculator results financial, legal, or tax advice?',
        a: 'No. Calculator outputs are provided strictly for educational and informational planning purposes. Because individual financial situations, tax laws, lender terms, and market conditions vary, you should verify important financial decisions with a qualified professional or official institution.'
    },
    {
        q: 'Can I see the formulas and assumptions used?',
        a: 'Yes. Calculator pages provide transparent formula documentation, key variables, and methodology notes so you can understand exactly how results are calculated.'
    },
    {
        q: 'Why might my calculator result differ from a bank or lender?',
        a: 'Discrepancies often arise from differences in compounding frequency (daily vs. monthly), payment timing (beginning vs. end of period), rounding rules, origination fees, closing costs, private mortgage insurance (PMI), escrow adjustments, or regional tax differences.'
    },
    {
        q: 'How do tax calculators handle different jurisdictions and tax years?',
        a: 'Our tax calculators clearly document the applicable country, tax year, and baseline assumptions (such as standard deductions and filing status) based on published schedules from official agencies like the IRS, HMRC, ATO, and CBDT.'
    },
    {
        q: 'Are my financial figures stored or tracked on a server?',
        a: 'Where supported, calculator computations occur entirely on the client side in your local browser sandbox. Inputs such as your loan balance or income are not stored on our servers.'
    },
    {
        q: 'Can I change calculation assumptions like interest rates and inflation?',
        a: 'Yes. Our tools and scenario models allow you to adjust key assumptions—such as annual return rate, loan term, inflation rate, and regular contribution amounts—to see how different variables impact your financial results.'
    }
];
