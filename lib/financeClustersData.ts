import { CANONICAL_TOOLS, CanonicalTool } from './registry';

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface JurisdictionTaxConfig {
  countryCode: string;
  countryName: string;
  currencySymbol: string;
  currencyCode: string;
  taxYear: string;
  authorityName: string;
  standardDeductionOrAllowance: number;
  brackets: TaxBracket[];
  additionalLevies: { name: string; rate: number; threshold: number }[];
  keyRules: string[];
}

export interface FinanceClusterGuide {
  slug: string;
  title: string;
  description: string;
  formula: string;
  formulaVariables: { symbol: string; meaning: string }[];
  workedExample: {
    scenario: string;
    calculation: string;
    result: string;
  };
  keyTakeaway: string;
}

export interface FinanceSubcategoryCluster {
  id: string;
  slug: string;
  title: string;
  h1: string;
  canonicalPath: string;
  description: string;
  calculatorMathOverview: string;
  modelAssumptions: string[];
  currentStatutoryRules: string[];
  financialInformationPrinciples: string[];
  primaryToolIds: string[];
  goalTasks: { task: string; targetUrl: string; badge: string }[];
  guides: FinanceClusterGuide[];
  faqs: { question: string; answer: string }[];
  relatedClusterSlugs: string[];
  jurisdictionConfigs?: JurisdictionTaxConfig[];
}

export const JURISDICTION_TAX_CONFIGS: Record<string, JurisdictionTaxConfig> = {
  us: {
    countryCode: 'US',
    countryName: 'United States',
    currencySymbol: '$',
    currencyCode: 'USD',
    taxYear: '2025/2026',
    authorityName: 'Internal Revenue Service (IRS)',
    standardDeductionOrAllowance: 14600, // Single filer
    brackets: [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 },
      { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: null, rate: 0.37 }
    ],
    additionalLevies: [
      { name: 'Social Security (OASDI)', rate: 0.062, threshold: 168600 },
      { name: 'Medicare (HI)', rate: 0.0145, threshold: 0 },
      { name: 'Additional Medicare (High Earners)', rate: 0.009, threshold: 200000 }
    ],
    keyRules: [
      'Progressive marginal tax brackets apply only to taxable income exceeding the standard deduction ($14,600 Single / $29,200 Married Joint in 2025/2026).',
      'FICA Social Security tax is capped at $168,600 annual gross wages.',
      'Long-term capital gains (>1 year) are taxed at preferential rates (0%, 15%, or 20%).'
    ]
  },
  uk: {
    countryCode: 'UK',
    countryName: 'United Kingdom',
    currencySymbol: '£',
    currencyCode: 'GBP',
    taxYear: '2025/2026',
    authorityName: 'HM Revenue & Customs (HMRC)',
    standardDeductionOrAllowance: 12570, // Personal Allowance
    brackets: [
      { min: 0, max: 12570, rate: 0.00 },
      { min: 12570, max: 50270, rate: 0.20 }, // Basic rate
      { min: 50270, max: 125140, rate: 0.40 }, // Higher rate
      { min: 125140, max: null, rate: 0.45 } // Additional rate
    ],
    additionalLevies: [
      { name: 'National Insurance Class 1 (Main Rate)', rate: 0.08, threshold: 12570 },
      { name: 'National Insurance Class 1 (Upper Earnings Limit)', rate: 0.02, threshold: 50270 }
    ],
    keyRules: [
      'Standard Personal Allowance of £12,570 is tax-free.',
      'Personal Allowance tapers down by £1 for every £2 of income exceeding £100,000, reaching zero at £125,140 (creating an effective 60% marginal tax band).',
      'National Insurance contributions are calculated on gross pay without personal allowance deductions.'
    ]
  },
  canada: {
    countryCode: 'CA',
    countryName: 'Canada',
    currencySymbol: 'CA$',
    currencyCode: 'CAD',
    taxYear: '2025/2026',
    authorityName: 'Canada Revenue Agency (CRA)',
    standardDeductionOrAllowance: 15705, // Basic Personal Amount
    brackets: [
      { min: 0, max: 55867, rate: 0.15 },
      { min: 55867, max: 111733, rate: 0.205 },
      { min: 111733, max: 173205, rate: 0.26 },
      { min: 173205, max: 246752, rate: 0.29 },
      { min: 246752, max: null, rate: 0.33 }
    ],
    additionalLevies: [
      { name: 'Canada Pension Plan (CPP)', rate: 0.0595, threshold: 3500 },
      { name: 'Employment Insurance (EI)', rate: 0.0166, threshold: 0 }
    ],
    keyRules: [
      'Federal tax is combined with provincial income tax (ranging from 5% to 25% depending on province).',
      'Basic Personal Amount ($15,705) reduces federal tax via non-refundable tax credit at 15%.',
      'Capital gains inclusion rate applies to 50% (or 66.7% for high gains) of realized capital gains.'
    ]
  },
  australia: {
    countryCode: 'AU',
    countryName: 'Australia',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    taxYear: '2025/2026',
    authorityName: 'Australian Taxation Office (ATO)',
    standardDeductionOrAllowance: 18200, // Tax-free threshold
    brackets: [
      { min: 0, max: 18200, rate: 0.00 },
      { min: 18200, max: 45000, rate: 0.16 },
      { min: 45000, max: 135000, rate: 0.30 },
      { min: 135000, max: 190000, rate: 0.37 },
      { min: 190000, max: null, rate: 0.45 }
    ],
    additionalLevies: [
      { name: 'Medicare Levy', rate: 0.02, threshold: 24276 },
      { name: 'Superannuation Guarantee (Employer Paid)', rate: 0.115, threshold: 0 }
    ],
    keyRules: [
      'Revised Stage 3 tax cuts are enacted: 16% up to $45,000, 30% up to $135,000, 37% up to $190,000, and 45% above $190,000.',
      'Standard 2% Medicare Levy applies on resident taxable income above threshold.',
      'Superannuation contributions of 11.5% are paid by employers on top of base salary.'
    ]
  },
  india: {
    countryCode: 'IN',
    countryName: 'India',
    currencySymbol: '₹',
    currencyCode: 'INR',
    taxYear: 'FY 2025-26 (AY 2026-27)',
    authorityName: 'Income Tax Department of India (ITD)',
    standardDeductionOrAllowance: 75000, // New Regime Standard Deduction
    brackets: [
      { min: 0, max: 300000, rate: 0.00 },
      { min: 300000, max: 700000, rate: 0.05 },
      { min: 700000, max: 1000000, rate: 0.10 },
      { min: 1000000, max: 1200000, rate: 0.15 },
      { min: 1200000, max: 1500000, rate: 0.20 },
      { min: 1500000, max: null, rate: 0.30 }
    ],
    additionalLevies: [
      { name: 'Health & Education Cess', rate: 0.04, threshold: 0 },
      { name: 'Standard Goods & Services Tax (GST)', rate: 0.18, threshold: 0 }
    ],
    keyRules: [
      'New Tax Regime (Section 115BAC) is the default tax regime with ₹75,000 standard deduction.',
      'Section 87A rebate provides full tax rebate for taxable income up to ₹7,00,000 (effectively zero tax up to ₹7.75 Lakhs under New Regime).',
      'Old Tax Regime allows chapter VI-A deductions (Section 80C up to ₹1.5L, Section 80D, HRA, home loan interest) under older slab rates.'
    ]
  }
};

export const FINANCE_SUBCATEGORY_CLUSTERS: Record<string, FinanceSubcategoryCluster> = {
  loans: {
    id: 'loans',
    slug: 'loans',
    title: 'Loans & Debt',
    h1: 'Loan, EMI & Debt Repayment Calculators',
    canonicalPath: '/finance/loans',
    description: 'Explore high-precision loan calculators for equated monthly installments (EMI), debt payoff schedules, interest reduction strategies, personal loans, and auto financing.',
    calculatorMathOverview: 'Loan amortization models use the standard annuity formula: M = P × [r(1+r)^n] / [(1+r)^n - 1]. In each period, interest charge = Remaining Principal × Periodic Rate, and Principal Repayment = Monthly Installment - Interest Charge.',
    modelAssumptions: [
      'Interest rate remains fixed throughout the repayment term unless refinancing or variable loan terms are modeled.',
      'Payments occur on regular uniform monthly calendar dates.',
      'No prepayment penalties or administrative origination fees are included in the baseline mathematical amortization.'
    ],
    currentStatutoryRules: [
      'US CFPB Truth in Lending Act (Regulation Z) requires clear disclosure of Annual Percentage Rate (APR) including upfront lender fees.',
      'UK FCA regulations require total charge for credit (TCC) transparency.'
    ],
    financialInformationPrinciples: [
      'Paying extra principal in early loan years yields disproportionate interest savings due to the compounding reduction of balance.',
      'The Debt Avalanche method (targeting highest APR first) mathematically minimizes total interest cost compared to the Debt Snowball method.'
    ],
    primaryToolIds: ['emi-calculator', 'mortgage-calculator', 'compound-interest-calculator'],
    goalTasks: [
      { task: 'Calculate monthly EMI for personal, car, or student loan', targetUrl: '/finance/emi-calculator', badge: 'EMI Solver' },
      { task: 'Calculate mortgage principal and interest payment', targetUrl: '/finance/mortgage-calculator', badge: 'Mortgage' },
      { task: 'Compare loan interest savings with extra monthly payments', targetUrl: '/finance/emi-calculator', badge: 'Payoff Acceleration' }
    ],
    guides: [
      {
        slug: 'how-emi-works',
        title: 'How Equated Monthly Installments (EMI) and Amortization Work',
        description: 'Understand the mathematical split between interest payment and principal reduction over the lifetime of an amortizing loan.',
        formula: 'EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]',
        formulaVariables: [
          { symbol: 'P', meaning: 'Principal balance borrowed' },
          { symbol: 'r', meaning: 'Monthly periodic interest rate (APR / 12 / 100)' },
          { symbol: 'n', meaning: 'Total number of monthly payments' }
        ],
        workedExample: {
          scenario: '$30,000 personal loan at 8.0% APR over 5 years (60 months)',
          calculation: 'r = 0.08 / 12 = 0.006667. Factor = (1.006667)^60 = 1.4898. EMI = 30,000 × [0.006667 × 1.4898] / 0.4898',
          result: '$608.29 per month (Total Interest: $6,497.40)'
        },
        keyTakeaway: 'In Year 1, roughly 33% of each payment goes to interest; by Year 5, over 95% goes directly to principal.'
      },
      {
        slug: 'debt-avalanche-vs-snowball',
        title: 'Debt Avalanche vs. Debt Snowball: Payoff Mechanics',
        description: 'Compare the mathematical efficiency of highest-interest prioritization against behavioral balance elimination.',
        formula: 'Interest Savings = Σ (Balance_i × APR_i × TimeSaved_i)',
        formulaVariables: [
          { symbol: 'Balance_i', meaning: 'Outstanding debt balance for account i' },
          { symbol: 'APR_i', meaning: 'Annual percentage rate for account i' }
        ],
        workedExample: {
          scenario: '$5,000 at 24% APR vs $2,000 at 12% APR with $300 monthly budget',
          calculation: 'Avalanche eliminates the 24% debt first, saving $480 in annual finance charges compared to paying the 12% loan first.',
          result: 'Avalanche saves $620+ total interest and finishes 3 months faster.'
        },
        keyTakeaway: 'Always choose Avalanche for pure mathematical optimization; choose Snowball if quick psychological wins keep you motivated.'
      }
    ],
    faqs: [
      { question: 'What is the difference between simple interest loans and amortizing loans?', answer: 'Simple interest loans calculate interest only on the original principal. Amortizing loans calculate interest on the remaining unpaid balance, so the dollar amount of interest decreases with each payment.' },
      { question: 'How do extra payments reduce total loan duration?', answer: 'Extra payments go 100% directly toward reducing principal. This immediately reduces the balance upon which subsequent months’ interest is calculated, triggering a compounding acceleration in loan payoff.' }
    ],
    relatedClusterSlugs: ['mortgages', 'credit-cards', 'investing', 'savings']
  },

  mortgages: {
    id: 'mortgages',
    slug: 'mortgages',
    title: 'Mortgages & Real Estate Debt',
    h1: 'Mortgage & Home Financing Calculators',
    canonicalPath: '/finance/mortgages',
    description: 'Calculate monthly mortgage payments (PITI), private mortgage insurance (PMI), loan-to-value (LTV) ratios, amortization schedules, and down payment scenarios.',
    calculatorMathOverview: 'Total monthly mortgage cost is PITI: Principal & Interest (Annuity formula) + Property Taxes (Annual / 12) + Homeowner Hazard Insurance (Annual / 12) + PMI (if LTV > 80%).',
    modelAssumptions: [
      'Fixed-rate mortgage interest rate remains constant over 15, 20, or 30 years.',
      'Escrow property tax and insurance payments are based on user inputs without projected municipal assessment increases.'
    ],
    currentStatutoryRules: [
      'Homeowners Protection Act of 1998 mandates automatic cancellation of borrower-paid PMI when principal balance reaches 78% of original property value (or borrower request at 80%).',
      'CFPB Qualified Mortgage (QM) standards generally cap total debt-to-income (DTI) ratio at 43% for prime underwriting.'
    ],
    financialInformationPrinciples: [
      'A 20% down payment eliminates PMI, saving $100–$300+ per month on conventional financing.',
      'A 15-year fixed mortgage typically offers a 0.50%–0.75% lower interest rate and cuts total interest costs by over 60% compared to a 30-year term.'
    ],
    primaryToolIds: ['mortgage-calculator', 'emi-calculator', 'compound-interest-calculator'],
    goalTasks: [
      { task: 'Calculate total monthly PITI payment', targetUrl: '/finance/mortgage-calculator', badge: 'PITI Calculator' },
      { task: 'Determine down payment needed to avoid PMI', targetUrl: '/finance/mortgage-calculator', badge: 'PMI Sizer' },
      { task: 'Compare 15-year vs. 30-year mortgage lifetime interest', targetUrl: '/finance/mortgage-calculator', badge: 'Term Comparison' }
    ],
    guides: [
      {
        slug: 'piti-breakdown',
        title: 'Understanding PITI: Principal, Interest, Taxes, and Insurance',
        description: 'Complete breakdown of what makes up an escrowed monthly home mortgage payment.',
        formula: 'PITI = Principal + Interest + (Annual Tax / 12) + (Annual Hazard Ins / 12) + Monthly PMI',
        formulaVariables: [
          { symbol: 'P&I', meaning: 'Amortized loan principal reduction and bank interest' },
          { symbol: 'Escrow', meaning: 'Taxes and homeowner hazard insurance held by servicer' }
        ],
        workedExample: {
          scenario: '$400,000 loan at 6.5% interest on $500,000 home ($5,000 tax/yr, $1,200 ins/yr)',
          calculation: 'P&I = $2,528.27/mo. Taxes = $416.67/mo. Insurance = $100.00/mo. PMI = $0 (20% down).',
          result: 'Total Monthly PITI = $3,044.94/month'
        },
        keyTakeaway: 'Always budget for PITI rather than base principal and interest alone when evaluating home affordability.'
      }
    ],
    faqs: [
      { question: 'What is loan-to-value (LTV) ratio and why does it matter?', answer: 'LTV is the loan amount divided by the appraised property value. An LTV over 80% requires Private Mortgage Insurance (PMI) on conventional loans to protect the lender against default.' },
      { question: 'How does bi-weekly mortgage payment save money?', answer: 'Paying half your monthly mortgage payment every two weeks results in 26 half-payments (equivalent to 13 full monthly payments per year), paying off a 30-year loan in roughly 24–25 years.' }
    ],
    relatedClusterSlugs: ['loans', 'investing', 'real-estate', 'taxes']
  },

  investing: {
    id: 'investing',
    slug: 'investing',
    title: 'Investing & Wealth Building',
    h1: 'Investment, SIP & Compound Growth Calculators',
    canonicalPath: '/finance/investing',
    description: 'Project future investment portfolio returns, systematic investment plans (SIP), dollar-cost averaging, compound annual growth rate (CAGR), and capital accumulation over time.',
    calculatorMathOverview: 'Future Value combines principal growth P(1+r/n)^(nt) with ordinary annuity series PMT × [((1+r/n)^(nt) - 1) / (r/n)]. CAGR = (Ending Value / Beginning Value)^(1/t) - 1.',
    modelAssumptions: [
      'Projected annual return rate is assumed uniform over the holding period.',
      'All dividends and distributions are 100% reinvested without dividend tax friction unless modeled.'
    ],
    currentStatutoryRules: [
      'IRS Long-Term Capital Gains brackets apply to assets held >1 year (0%, 15%, 20%).',
      'Tax-advantaged contribution limits (e.g. 401k $23,500, IRA $7,000 in 2025/2026) accelerate compound growth.'
    ],
    financialInformationPrinciples: [
      'Dollar-cost averaging reduces the risk of market timing by purchasing more units at lower prices.',
      'A 1% reduction in investment expense ratios can preserve hundreds of thousands of dollars over a 30-year investing horizon.'
    ],
    primaryToolIds: ['compound-interest-calculator', 'investment-calculator', 'fire-forecaster'],
    goalTasks: [
      { task: 'Forecast future portfolio balance with monthly deposits', targetUrl: '/finance/compound-interest-calculator', badge: 'Compound Growth' },
      { task: 'Calculate Compound Annual Growth Rate (CAGR)', targetUrl: '/finance/compound-interest-calculator', badge: 'CAGR Engine' },
      { task: 'Model systematic investment plan (SIP) returns', targetUrl: '/finance/investment-calculator', badge: 'SIP Forecaster' }
    ],
    guides: [
      {
        slug: 'cagr-vs-simple-return',
        title: 'CAGR vs. Simple Return: Why Annualized Compounding Matters',
        description: 'Learn why simple arithmetic average returns distort investment performance and how CAGR provides the true geometric growth rate.',
        formula: 'CAGR = (Ending Value / Beginning Value)^(1 / t) - 1',
        formulaVariables: [
          { symbol: 'Ending Value', meaning: 'Final portfolio balance at conclusion' },
          { symbol: 'Beginning Value', meaning: 'Initial capital balance at start' },
          { symbol: 't', meaning: 'Number of years elapsed' }
        ],
        workedExample: {
          scenario: '$10,000 grows to $20,000 over 7 years',
          calculation: 'CAGR = ($20,000 / $10,000)^(1/7) - 1 = (2.0)^0.142857 - 1 = 1.1041 - 1 = 0.1041',
          result: 'CAGR = 10.41% per year'
        },
        keyTakeaway: 'A portfolio gaining +50% in Year 1 and losing -50% in Year 2 has an arithmetic average of 0%, but an actual CAGR of -29.3% (ending at $7,500 on $10,000).'
      }
    ],
    faqs: [
      { question: 'What is the historical average return of the S&P 500 index?', answer: 'Historically, the broad US stock market (S&P 500) has returned an average of approximately 10% nominal annual return (or roughly 7% real return after adjusting for inflation) over multi-decade periods.' },
      { question: 'What is the difference between APR and APY in investment accounts?', answer: 'APR is the nominal rate without compounding. APY (Annual Percentage Yield) reflects the true annual return earned when interest is compounded daily, monthly, or quarterly.' }
    ],
    relatedClusterSlugs: ['compound-interest', 'savings', 'retirement', 'fire']
  },

  'compound-interest': {
    id: 'compound-interest',
    slug: 'compound-interest',
    title: 'Compound Interest',
    h1: 'Compound Interest & Exponential Growth Calculators',
    canonicalPath: '/finance/compound-interest',
    description: 'Calculate exponential interest growth, daily/monthly/annual compounding frequency effects, Rule of 72 doubling times, and principal-versus-interest balance schedules.',
    calculatorMathOverview: 'Future Value A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]. Doubling time rule: Years ≈ 72 ÷ Interest Rate (%).',
    modelAssumptions: [
      'Contributions occur at uniform interval endpoints (ordinary annuity).',
      'Interest rate r is held constant without negative variance cycles.'
    ],
    currentStatutoryRules: [
      'Truth in Savings Act (Regulation DD) governs APY calculation standard: APY = 100 × [(1 + Interest/Principal)^(365/Days) - 1].'
    ],
    financialInformationPrinciples: [
      'Compounding frequency increases effective annual yield: Daily compounding yields more than annual compounding for the same nominal rate.',
      'Starting 10 years earlier creates larger terminal wealth than doubling contributions 10 years later.'
    ],
    primaryToolIds: ['compound-interest-calculator', 'investment-calculator', 'fire-forecaster'],
    goalTasks: [
      { task: 'Simulate compound growth with periodic monthly contributions', targetUrl: '/finance/compound-interest-calculator', badge: 'Compound Sim' },
      { task: 'Calculate Rule of 72 investment doubling timeline', targetUrl: '/finance/compound-interest-calculator', badge: 'Doubling Rule' },
      { task: 'Convert APR nominal rate to APY effective annual yield', targetUrl: '/finance/compound-interest-calculator', badge: 'APR vs APY' }
    ],
    guides: [
      {
        slug: 'rule-of-72-math',
        title: 'The Rule of 72: Instant Mental Math for Investment Doubling',
        description: 'How to instantly approximate the number of years required to double money at any fixed compound interest rate.',
        formula: 'Doubling Years ≈ 72 ÷ Annual Interest Rate (%)',
        formulaVariables: [
          { symbol: '72', meaning: 'Mathematical approximation constant for ln(2) ≈ 0.693' },
          { symbol: 'Rate', meaning: 'Annual percentage yield (e.g., enter 8 for 8%)' }
        ],
        workedExample: {
          scenario: '$25,000 invested in index fund returning 9.0% per year',
          calculation: 'Years to Double = 72 ÷ 9 = 8.0 years. In 8 years: $50,000. In 16 years: $100,000. In 24 years: $200,000.',
          result: '8.0 Years to Double'
        },
        keyTakeaway: 'The Rule of 72 demonstrates the power of starting early: each 8-year period doubles your entire cumulative wealth.'
      },
      {
        slug: 'apr-vs-apy-compounding',
        title: 'APR vs. APY: The Real Cost of Compounding Frequencies',
        description: 'Understand the mathematical difference between nominal APR and effective APY when interest is compounded daily or monthly.',
        formula: 'APY = (1 + APR / n)^n - 1',
        formulaVariables: [
          { symbol: 'APR', meaning: 'Annual Percentage Rate in decimal form' },
          { symbol: 'n', meaning: 'Number of compounding periods per year (365 for daily, 12 for monthly)' }
        ],
        workedExample: {
          scenario: 'High-Yield Savings Account offering 5.00% APR compounded daily (n=365)',
          calculation: 'APY = (1 + 0.05 / 365)^365 - 1 = (1.000136986)^365 - 1 = 1.051267 - 1 = 5.127%',
          result: '5.13% Effective APY'
        },
        keyTakeaway: 'Lenders advertise APR on loans (to look lower) and APY on deposits (to look higher).'
      }
    ],
    faqs: [
      { question: 'Why does compound interest accelerate in later years?', answer: 'In early years, most of the growth comes from your personal deposits. In later years, interest earned in previous cycles earns its own interest, causing an exponential curve where annual growth exceeds annual contributions.' },
      { question: 'What compounding frequency provides the highest return?', answer: 'Continuous compounding (A = P × e^(rt)) produces the theoretical maximum limit, but daily compounding (n=365) is virtually identical in practical consumer finance.' }
    ],
    relatedClusterSlugs: ['investing', 'savings', 'retirement', 'fire']
  },

  savings: {
    id: 'savings',
    slug: 'savings',
    title: 'Savings & Liquidity',
    h1: 'Savings Goal, Emergency Fund & APY Calculators',
    canonicalPath: '/finance/savings',
    description: 'Calculate emergency fund targets, high-yield savings account (HYSA) compound interest, CD ladder maturities, and monthly savings requirements for major life goals.',
    calculatorMathOverview: 'Required Monthly Savings = Target Goal ÷ [ ((1 + r/12)^n - 1) / (r/12) ]. APY = (1 + r/n)^n - 1.',
    modelAssumptions: [
      'Savings account APY is assumed constant over the target timeline.',
      'Emergency fund target calculates 3 to 6 months of essential baseline living expenses.'
    ],
    currentStatutoryRules: [
      'FDIC standard deposit insurance covers up to $250,000 per depositor, per insured bank, per ownership category in the US.',
      'UK FSCS covers deposits up to £85,000 per eligible financial institution.'
    ],
    financialInformationPrinciples: [
      'Keep 3 to 6 months of essential living expenses in a liquid High-Yield Savings Account before aggressively investing in equities.',
      'Certificate of Deposit (CD) ladders provide guaranteed interest while maintaining staggered liquidity every 3 to 6 months.'
    ],
    primaryToolIds: ['compound-interest-calculator', 'investment-calculator', 'fire-forecaster'],
    goalTasks: [
      { task: 'Calculate monthly savings needed to reach a financial goal', targetUrl: '/finance/compound-interest-calculator', badge: 'Goal Accumulator' },
      { task: 'Determine 3-month and 6-month emergency fund targets', targetUrl: '/finance/savings', badge: 'Emergency Fund' },
      { task: 'Calculate High-Yield Savings Account (HYSA) interest earnings', targetUrl: '/finance/compound-interest-calculator', badge: 'HYSA APY' }
    ],
    guides: [
      {
        slug: 'emergency-fund-rules',
        title: 'How to Calculate Your Emergency Fund Target (3 vs 6 Months)',
        description: 'Formula to calculate essential survival expenses vs discretionary spending.',
        formula: 'Emergency Target = (Housing + Utilities + Food + Insurance + Min Debt Payments) × Desired Months',
        formulaVariables: [
          { symbol: 'Essential Expenses', meaning: 'Non-negotiable monthly living costs' }
        ],
        workedExample: {
          scenario: 'Household with $3,500 essential monthly living expenses aiming for a 6-month safety buffer',
          calculation: 'Emergency Fund = $3,500 × 6 = $21,000. In a 4.5% APY HYSA, $21,000 earns $945/year ($78.75/mo) in risk-free interest.',
          result: '$21,000 Target Emergency Fund'
        },
        keyTakeaway: 'Emergency funds should be evaluated on essential survival costs, not pre-crisis discretionary spending.'
      }
    ],
    faqs: [
      { question: 'Where should I keep my emergency fund?', answer: 'Emergency funds should be kept in liquid, FDIC-insured High-Yield Savings Accounts (HYSAs) or money market accounts where capital is safe from stock market volatility and accessible within 24–48 hours.' },
      { question: 'Is interest earned on a savings account taxable?', answer: 'Yes. In the US, interest earned on savings accounts, CDs, and money market funds is taxed as ordinary income and reported on Form 1099-INT.' }
    ],
    relatedClusterSlugs: ['compound-interest', 'investing', 'retirement', 'salary']
  },

  retirement: {
    id: 'retirement',
    slug: 'retirement',
    title: 'Retirement & Long-Term Planning',
    h1: 'Retirement Nest Egg, 401(k) & Decumulation Calculators',
    canonicalPath: '/finance/retirement',
    description: 'Calculate retirement savings goals, 401(k) compounding growth, safe withdrawal rates (SWR), required nest egg sizes, and workdays remaining until retirement.',
    calculatorMathOverview: 'Required Nest Egg = Annual Retirement Expenses ÷ Safe Withdrawal Rate (SWR). Compounding wealth decumulation models portfolio survival over 30–40 years against inflation and portfolio variance.',
    modelAssumptions: [
      'Retirement duration is estimated at 30 years from retirement date.',
      'Portfolio allocation is maintained as a balanced mix of equities and fixed-income securities.'
    ],
    currentStatutoryRules: [
      'IRS 2025/2026 401(k) elective deferral limit is $23,500 ($31,000 for age 50+ catch-up). IRA limit is $7,000 ($8,000 for age 50+).',
      'Required Minimum Distributions (RMDs) legally commence at age 73 (rising to 75 by 2033 under SECURE 2.0).'
    ],
    financialInformationPrinciples: [
      'The 4% Rule (Trinity Study) provides a historical baseline where a diversified 50/50 stock/bond portfolio survived 30-year retirements with minimal failure risk.',
      'Asset location (holding dividend assets in tax-deferred accounts and growth index funds in taxable accounts) optimizes after-tax retirement income.'
    ],
    primaryToolIds: ['fire-forecaster', 'compound-interest-calculator', 'retirement-countdown'],
    goalTasks: [
      { task: 'Calculate retirement nest egg needed for target income', targetUrl: '/finance/fire-forecaster', badge: 'Nest Egg Sizer' },
      { task: 'Project 401(k) and IRA growth with employer match', targetUrl: '/finance/compound-interest-calculator', badge: '401(k) Forecaster' },
      { task: 'Count exact remaining workdays and shifts to retirement', targetUrl: '/time-date/retirement-countdown', badge: 'Workday Countdown' }
    ],
    guides: [
      {
        slug: 'the-4-percent-rule-explained',
        title: 'The 4% Safe Withdrawal Rule and Trinity Study Mechanics',
        description: 'Understand William Bengen’s safe withdrawal rate research and how spending multiples determine retirement readiness.',
        formula: 'Target Nest Egg = Annual Living Expenses × 25 (Assuming 4% SWR)',
        formulaVariables: [
          { symbol: 'Annual Expenses', meaning: 'Expected annual spending in retirement' },
          { symbol: '25× Multiple', meaning: 'Inverse of 4.0% safe withdrawal rate (1 / 0.04)' }
        ],
        workedExample: {
          scenario: 'Retiree requiring $60,000/year spending from investment portfolio',
          calculation: 'Nest Egg = $60,000 × 25 = $1,500,000. Year 1 withdrawal = $60,000. Year 2 withdrawal = $60,000 × (1 + Inflation Rate).',
          result: '$1.5 Million Target Nest Egg'
        },
        keyTakeaway: 'For early retirees planning 40+ year retirements, a more conservative withdrawal rate of 3.25%–3.50% (28×–30× expenses) is recommended.'
      }
    ],
    faqs: [
      { question: 'What is the difference between Traditional 401(k) and Roth 401(k)?', answer: 'Traditional 401(k) contributions are made pre-tax (reducing your taxes today) and taxed upon withdrawal in retirement. Roth 401(k) contributions are made with after-tax dollars and grow completely tax-free, with zero income tax on qualified withdrawals in retirement.' },
      { question: 'What is Sequence of Returns Risk in retirement?', answer: 'Sequence of returns risk is the hazard that market declines occur in the first few years of retirement while you are actively withdrawing capital, permanently impairing the portfolio’s ability to recover.' }
    ],
    relatedClusterSlugs: ['fire', 'investing', 'savings', 'taxes']
  },

  fire: {
    id: 'fire',
    slug: 'fire',
    title: 'FIRE (Financial Independence, Retire Early)',
    h1: 'FIRE Number, Savings Rate & Lean/Fat FIRE Calculators',
    canonicalPath: '/finance/fire',
    description: 'Calculate your FIRE number, savings rate correlation to years to financial independence, LeanFIRE vs FatFIRE expense targets, and CoastFIRE trajectory.',
    calculatorMathOverview: 'FIRE Number = Annual Expenses ÷ SWR. Years to FI = ln([Target × r / Savings + 1]) ÷ ln(1 + r).',
    modelAssumptions: [
      'Savings rate is calculated as net invested capital divided by take-home income.',
      'Real investment return (after inflation) is modeled between 5% and 7%.'
    ],
    currentStatutoryRules: [
      'Rule 72(t) / SEPP (Substantially Equal Periodic Payments) and Roth Conversion Ladders allow early access to retirement funds prior to age 59½ without 10% penalty.'
    ],
    financialInformationPrinciples: [
      'Your savings rate is the primary mathematical driver of time to financial independence: saving 50% of income takes roughly 17 years; saving 70% takes roughly 8.5 years.',
      'CoastFIRE is achieved when existing investments will compound into your full retirement nest egg by traditional retirement age without further contributions.'
    ],
    primaryToolIds: ['fire-forecaster', 'compound-interest-calculator', 'investment-calculator'],
    goalTasks: [
      { task: 'Calculate exact FIRE Number and years to financial freedom', targetUrl: '/finance/fire-forecaster', badge: 'FIRE Forecaster' },
      { task: 'Model CoastFIRE milestone threshold', targetUrl: '/finance/fire-forecaster', badge: 'CoastFIRE Sizer' },
      { task: 'Compare LeanFIRE, Regular FIRE, and FatFIRE expense levels', targetUrl: '/finance/fire-forecaster', badge: 'FIRE Tiers' }
    ],
    guides: [
      {
        slug: 'savings-rate-vs-years-to-fire',
        title: 'The Shockingly Simple Math Behind Early Retirement',
        description: 'How increasing your savings rate exponentially compresses your required working years.',
        formula: 'Working Years = ln( (Annual Expenses / Annual Savings) × (r / (1+r)) + 1 ) / ln(1+r)',
        formulaVariables: [
          { symbol: 'Savings Rate', meaning: 'Percentage of take-home income invested' },
          { symbol: 'r', meaning: 'Real annual investment return rate after inflation (typically 5%)' }
        ],
        workedExample: {
          scenario: 'Household saving 50% of their $80,000 net income ($40,000 spent, $40,000 invested)',
          calculation: 'Target at 4% SWR = $40,000 × 25 = $1,000,000. At 5% real return with $40k/yr deposits, reach $1M in 16.6 years.',
          result: '16.6 Years to Complete Financial Independence'
        },
        keyTakeaway: 'Cutting expenses has a double benefit: it reduces your target FIRE number while simultaneously increasing your annual investment capital.'
      }
    ],
    faqs: [
      { question: 'What is the difference between LeanFIRE, BaristaFIRE, and FatFIRE?', answer: 'LeanFIRE targets minimal annual living costs (typically under $40,000/yr). BaristaFIRE involves partial retirement where low-stress part-time work covers baseline living expenses while portfolio compounds. FatFIRE funds an abundant lifestyle (typically $100,000+/yr).' },
      { question: 'How can you access 401(k) and IRA funds before age 59½ without penalty?', answer: 'Two primary legal methods exist: (1) Roth Conversion Ladder (converting Traditional IRA to Roth and waiting 5 years to withdraw penalty-free principal) and (2) IRS Rule 72(t) SEPP distributions.' }
    ],
    relatedClusterSlugs: ['retirement', 'investing', 'compound-interest', 'savings']
  },

  'credit-cards': {
    id: 'credit-cards',
    slug: 'credit-cards',
    title: 'Credit Cards & Revolving Credit',
    h1: 'Credit Card Payoff, Minimum Payment & Interest Calculators',
    canonicalPath: '/finance/credit-cards',
    description: 'Calculate credit card payoff timelines, minimum payment traps, daily compounding interest charges, balance transfer savings, and total cost of revolving debt.',
    calculatorMathOverview: 'Daily Periodic Rate = APR / 365. Daily Interest Charge = Daily Balance × Daily Periodic Rate. Minimum payments typically calculate as max($25–$35, 1%–2% of Principal + Monthly Interest).',
    modelAssumptions: [
      'No additional charges or cash advances are made on the card while paying down debt.',
      'APR remains fixed over the payoff timeline.'
    ],
    currentStatutoryRules: [
      'Credit CARD Act of 2009 mandates credit card statements to include a "Minimum Payment Warning" disclosing the total time and interest cost to pay off balance making only minimum payments versus a 3-year fixed payoff schedule.'
    ],
    financialInformationPrinciples: [
      'Making only minimum payments on high-interest credit cards (20%–29% APR) often extends repayment to 15–25 years and triples the original purchase cost.',
      'A 0% APR balance transfer card can save thousands in finance charges if the balance is fully paid off within the promotional window (typically 12–21 months).'
    ],
    primaryToolIds: ['emi-calculator', 'compound-interest-calculator', 'mortgage-calculator'],
    goalTasks: [
      { task: 'Calculate months to pay off credit card balance with fixed payments', targetUrl: '/finance/emi-calculator', badge: 'Payoff Planner' },
      { task: 'Calculate true cost of paying only the minimum payment', targetUrl: '/finance/credit-cards', badge: 'Minimum Trap' },
      { task: 'Estimate balance transfer fee vs. interest savings', targetUrl: '/finance/credit-cards', badge: 'Balance Transfer' }
    ],
    guides: [
      {
        slug: 'how-credit-card-interest-compounds',
        title: 'How Credit Card Interest Is Calculated: Average Daily Balance',
        description: 'Understand the daily periodic compounding rate and why high APR revolving debt accumulates so quickly.',
        formula: 'Monthly Interest = Average Daily Balance × (APR / 365) × Days in Billing Cycle',
        formulaVariables: [
          { symbol: 'Average Daily Balance', meaning: 'Sum of end-of-day balances divided by days in cycle' },
          { symbol: 'APR / 365', meaning: 'Daily periodic interest multiplier' }
        ],
        workedExample: {
          scenario: '$6,000 credit card balance at 24.99% APR over a 30-day billing cycle',
          calculation: 'Daily Rate = 0.2499 / 365 = 0.00068466. Monthly Interest = $6,000 × 0.00068466 × 30 = $123.24 in finance charges per month.',
          result: '$123.24 monthly interest charge ($1,478.88/year in pure interest)'
        },
        keyTakeaway: 'Paying your balance before the statement closing date lowers your average daily balance and reduces interest charges immediately.'
      }
    ],
    faqs: [
      { question: 'What is a credit card grace period and how does it work?', answer: 'A grace period is the window (typically 21 to 25 days between statement date and due date) where no interest is charged on new purchases, provided you paid your previous statement balance in full by the due date.' },
      { question: 'Does closing an old credit card hurt your credit score?', answer: 'Yes, closing an old card reduces your total available credit limit (which raises your overall credit utilization ratio) and may eventually reduce the average age of your credit accounts.' }
    ],
    relatedClusterSlugs: ['loans', 'savings', 'taxes', 'salary']
  },

  taxes: {
    id: 'taxes',
    slug: 'taxes',
    title: 'Taxes & Statutory Deductions',
    h1: 'Income Tax, Marginal Brackets & Statutory Deductions',
    canonicalPath: '/finance/taxes',
    description: 'Calculate income tax liabilities, progressive marginal brackets, standard allowances, FICA payroll contributions, GST, and VAT across the US, UK, Canada, Australia, and India.',
    calculatorMathOverview: 'Progressive tax liability = Σ [ (min(TaxableIncome, BracketMax_i) - BracketMin_i) × Rate_i ] for all applicable tiers above standard deductions/allowances.',
    modelAssumptions: [
      'Taxpayer is a standard tax resident eligible for basic statutory personal allowances and standard deductions.',
      'Income consists primarily of regular employment salary or wages unless business/capital gain adjustments are entered.'
    ],
    currentStatutoryRules: [
      'US: IRS 2025/2026 progressive tax rates from 10% to 37% with $14,600 standard deduction.',
      'UK: HMRC 2025/2026 rates (20%, 40%, 45%) with £12,570 Personal Allowance and 8% Class 1 NI.',
      'Canada: CRA 2025/2026 Federal brackets (15% to 33%) + Provincial tax brackets.',
      'Australia: ATO 2025/2026 Revised Stage 3 rates (16%, 30%, 37%, 45%) with 2% Medicare Levy.',
      'India: FY 2025-26 New Tax Regime (Section 115BAC) slabs up to 30% with ₹75,000 standard deduction.'
    ],
    financialInformationPrinciples: [
      'Your marginal tax rate is the tax paid on your last dollar of income; your effective tax rate is total tax paid divided by total gross income (always lower than marginal rate).',
      'Pre-tax retirement contributions (401k, Traditional IRA, Pension, Superannuation) reduce taxable income in your highest marginal bracket.'
    ],
    primaryToolIds: ['global-tax-calculator', 'mortgage-calculator', 'compound-interest-calculator'],
    goalTasks: [
      { task: 'Calculate US Federal & State income tax with FICA', targetUrl: '/finance/taxes/us', badge: 'US Tax' },
      { task: 'Calculate UK HMRC Income Tax & National Insurance', targetUrl: '/finance/taxes/uk', badge: 'UK Tax' },
      { task: 'Calculate Canadian CRA Federal & Provincial Tax', targetUrl: '/finance/taxes/canada', badge: 'Canada Tax' },
      { task: 'Calculate Australian ATO Income Tax & Medicare Levy', targetUrl: '/finance/taxes/australia', badge: 'Australia Tax' },
      { task: 'Compare India New vs. Old Tax Regime', targetUrl: '/finance/taxes/india', badge: 'India Tax' }
    ],
    guides: [
      {
        slug: 'marginal-vs-effective-tax-rate',
        title: 'Marginal vs. Effective Tax Rate Explained',
        description: 'Understand how progressive tax brackets work and why earning a raise never reduces your take-home pay.',
        formula: 'Effective Tax Rate = (Total Tax Liability / Total Gross Income) × 100%',
        formulaVariables: [
          { symbol: 'Total Tax', meaning: 'Sum of taxes across all progressive bracket tiers' },
          { symbol: 'Gross Income', meaning: 'Total pre-tax earnings before deductions' }
        ],
        workedExample: {
          scenario: 'US Single filer earning $80,000 gross in 2025/2026 with $14,600 standard deduction',
          calculation: 'Taxable Income = $80,000 - $14,600 = $65,400. 10% on first $11,600 = $1,160. 12% on next $35,550 ($47,150-$11,600) = $4,266. 22% on remaining $18,250 ($65,400-$47,150) = $4,015. Total Tax = $9,441.',
          result: 'Marginal Bracket = 22% | Effective Federal Tax Rate = 11.80% ($9,441 / $80,000)'
        },
        keyTakeaway: 'Moving into a higher tax bracket only taxes the specific dollars above the threshold at the higher rate, never your entire income.'
      }
    ],
    faqs: [
      { question: 'Will a pay raise put me into a higher tax bracket and leave me with less money?', answer: 'No. This is the single most common tax myth. Tax brackets are progressive (marginal), meaning only the money earned above the new threshold is taxed at the higher percentage. Every additional dollar you earn increases your net take-home pay.' },
      { question: 'What is the difference between tax deductions and tax credits?', answer: 'A tax deduction reduces your taxable income before taxes are calculated (e.g. a $1,000 deduction in a 22% bracket saves $220). A tax credit directly reduces your tax bill dollar-for-dollar (e.g. a $1,000 credit saves exactly $1,000 in taxes).' }
    ],
    relatedClusterSlugs: ['salary', 'business', 'investing', 'retirement'],
    jurisdictionConfigs: Object.values(JURISDICTION_TAX_CONFIGS)
  },

  salary: {
    id: 'salary',
    slug: 'salary',
    title: 'Salary & Payroll',
    h1: 'Salary, Paycheck & Gross-to-Net Wage Calculators',
    canonicalPath: '/finance/salary',
    description: 'Convert between hourly wages, daily pay, bi-weekly paychecks, and annual salary. Calculate take-home pay after statutory tax withholdings and employer retirement matches.',
    calculatorMathOverview: 'Gross Pay = Hourly Wage × Hours Worked. Annualized Salary = Hourly Wage × 2,080 hours (40 hrs/wk × 52 wks). Net Pay = Gross Pay - (Income Tax + Social Security/CPP/NI + Medicare + Health Insurance + 401k).',
    modelAssumptions: [
      'Full-time employment is defined as 40 hours per week and 52 weeks (2,080 working hours) per year.',
      'Paid time off (PTO) and paid holidays are treated as standard compensable hours.'
    ],
    currentStatutoryRules: [
      'US Fair Labor Standards Act (FLSA 29 CFR Part 778) mandates 1.5× base hourly pay for non-exempt overtime exceeding 40 hours weekly.',
      'FICA Social Security tax is 6.2% on wages up to $168,600; Medicare tax is 1.45% with no wage ceiling.'
    ],
    financialInformationPrinciples: [
      'Converting hourly rates to salary: Multiply hourly wage by 2,000 for a quick estimate ($30/hr ≈ $60,000/year).',
      'Capturing your full employer 401(k) or pension match provides an immediate 50% to 100% guaranteed return on contributed capital.'
    ],
    primaryToolIds: ['work-hours', 'emi-calculator', 'compound-interest-calculator'],
    goalTasks: [
      { task: 'Convert hourly rate to annual salary and monthly paycheck', targetUrl: '/finance/salary', badge: 'Salary Converter' },
      { task: 'Calculate weekly shift timesheet hours with FLSA overtime', targetUrl: '/time-date/work-hours', badge: 'Timesheet Solver' },
      { task: 'Estimate net take-home paycheck after taxes', targetUrl: '/finance/taxes', badge: 'Take-Home Pay' }
    ],
    guides: [
      {
        slug: 'hourly-to-salary-conversion',
        title: 'How to Convert Hourly Wage to Annual Salary and Paychecks',
        description: 'Standard formula to convert hourly pay rates into weekly, bi-weekly, monthly, and annual gross earnings.',
        formula: 'Annual Salary = Hourly Wage × Hours per Week × 52 Weeks (Standard 2,080 Hours)',
        formulaVariables: [
          { symbol: 'Hourly Wage', meaning: 'Pay rate per working hour' },
          { symbol: '2,080', meaning: 'Standard annual working hours for 40-hr week' }
        ],
        workedExample: {
          scenario: '$35.00/hour full-time position (40 hours/week, 52 weeks)',
          calculation: 'Annual Gross = $35.00 × 2,080 = $72,800. Monthly Gross = $72,800 / 12 = $6,066.67. Bi-Weekly Paycheck = $72,800 / 26 = $2,800.00.',
          result: '$72,800/year | $2,800.00 bi-weekly gross paycheck'
        },
        keyTakeaway: 'For bi-weekly payroll schedules, you receive 26 paychecks per year, meaning two months each year contain three paychecks.'
      }
    ],
    faqs: [
      { question: 'How many work hours are in a standard working year?', answer: 'A standard full-time working year consists of 2,080 hours (40 hours per week × 52 weeks). Assuming 10 paid federal holidays and 10 days PTO, actual time worked is approximately 1,920 hours.' },
      { question: 'What is the difference between bi-weekly and semi-monthly pay?', answer: 'Bi-weekly payroll is paid every two weeks (26 paychecks per year). Semi-monthly payroll is paid twice per month, typically on the 15th and last day of the month (24 paychecks per year).' }
    ],
    relatedClusterSlugs: ['taxes', 'loans', 'savings', 'business'],
    jurisdictionConfigs: Object.values(JURISDICTION_TAX_CONFIGS)
  },

  business: {
    id: 'business',
    slug: 'business',
    title: 'Business Finance',
    h1: 'Business Finance, Margin & Break-Even Calculators',
    canonicalPath: '/finance/business',
    description: 'Calculate gross and net profit margins, break-even unit volume, markup multipliers, working capital requirements, and return on investment (ROI).',
    calculatorMathOverview: 'Gross Margin % = ((Revenue - COGS) / Revenue) × 100. Break-Even Volume = Fixed Costs ÷ (Price per Unit - Variable Cost per Unit). Markup % = ((Price - Cost) / Cost) × 100.',
    modelAssumptions: [
      'Variable costs scale linearly with unit production volume.',
      'Fixed overhead costs remain constant over the projected analysis interval.'
    ],
    currentStatutoryRules: [
      'GAAP / IFRS standards require clear separation of Cost of Goods Sold (COGS) from Operating Expenses (OPEX).'
    ],
    financialInformationPrinciples: [
      'Margin is calculated on selling price; Markup is calculated on cost. A 50% markup equals a 33.3% gross profit margin.',
      'Operating leverage magnifies profit gains as sales volume exceeds the break-even point.'
    ],
    primaryToolIds: ['compound-interest-calculator', 'emi-calculator', 'investment-calculator'],
    goalTasks: [
      { task: 'Calculate Break-Even unit and revenue volume', targetUrl: '/finance/business', badge: 'Break-Even' },
      { task: 'Convert Cost Markup to Gross Profit Margin percentage', targetUrl: '/finance/business', badge: 'Margin vs Markup' },
      { task: 'Forecast commercial equipment loan amortization', targetUrl: '/finance/emi-calculator', badge: 'Commercial Debt' }
    ],
    guides: [
      {
        slug: 'break-even-analysis-formula',
        title: 'Break-Even Analysis: Formulas, Units & Safety Margins',
        description: 'Learn how to determine the exact number of units a business must sell to cover fixed overhead and variable costs.',
        formula: 'Break-Even Units = Total Fixed Costs ÷ (Selling Price - Variable Cost per Unit)',
        formulaVariables: [
          { symbol: 'Fixed Costs', meaning: 'Rent, salaries, software, insurance, overhead' },
          { symbol: 'Contribution Margin', meaning: 'Selling Price minus Variable Cost per unit' }
        ],
        workedExample: {
          scenario: 'Business with $15,000 monthly fixed overhead selling products at $50 each with $20 unit cost',
          calculation: 'Contribution Margin = $50 - $20 = $30/unit. Break-Even Units = $15,000 ÷ $30 = 500 units. Break-Even Revenue = 500 × $50 = $25,000.',
          result: '500 Units ($25,000 Monthly Revenue) to Break Even'
        },
        keyTakeaway: 'Every unit sold above 500 contributes $30 pure profit directly to the bottom line.'
      },
      {
        slug: 'profit-margin-vs-markup',
        title: 'Profit Margin vs. Markup: The Mathematical Relationship',
        description: 'Why confusing margin and markup leads to underpriced products and business cash flow failure.',
        formula: 'Margin = Markup ÷ (1 + Markup)  |  Markup = Margin ÷ (1 - Margin)',
        formulaVariables: [
          { symbol: 'Margin', meaning: 'Profit as a fraction of Selling Price' },
          { symbol: 'Markup', meaning: 'Profit as a fraction of Wholesale Cost' }
        ],
        workedExample: {
          scenario: 'Wholesale item costs $100. Retailer wants a 40% gross margin.',
          calculation: 'Markup Needed = 0.40 ÷ (1 - 0.40) = 0.40 ÷ 0.60 = 66.67%. Retail Price = $100 × 1.6667 = $166.67. Margin = ($66.67 / $166.67) = 40.0%.',
          result: 'Price at $166.67 (Requires 66.7% markup to achieve 40% margin)'
        },
        keyTakeaway: 'If you mark up a $100 product by 40% to sell at $140, your actual profit margin is only 28.6% ($40 / $140), not 40%.'
      }
    ],
    faqs: [
      { question: 'What is the difference between gross margin and operating margin?', answer: 'Gross margin only subtracts direct Cost of Goods Sold (COGS) from revenue. Operating margin subtracts both COGS and all indirect operating expenses (rent, marketing, administrative salaries, depreciation).' },
      { question: 'What is working capital and why is it critical?', answer: 'Working capital is Current Assets minus Current Liabilities. Positive working capital ensures a company can pay short-term bills, purchase inventory, and handle payment collection delays without insolvency.' }
    ],
    relatedClusterSlugs: ['taxes', 'salary', 'loans', 'investing']
  },

  'real-estate': {
    id: 'real-estate',
    slug: 'real-estate',
    title: 'Real Estate Finance',
    h1: 'Real Estate Investment, Cap Rate & Cash Flow Calculators',
    canonicalPath: '/finance/real-estate',
    description: 'Calculate Capitalization Rate (Cap Rate), Cash-on-Cash Return, Net Operating Income (NOI), Gross Rent Multiplier (GRM), and rental property cash flow.',
    calculatorMathOverview: 'Cap Rate = Net Operating Income (NOI) ÷ Current Market Value. Cash-on-Cash Return = Annual Pre-Tax Cash Flow ÷ Total Cash Invested. NOI = Gross Rental Income - Operating Expenses (excluding debt service).',
    modelAssumptions: [
      'Vacancy rates and credit losses are modeled as a percentage deduction from gross potential rent.',
      'Cap rate excludes mortgage debt service to measure pure property asset yield.'
    ],
    currentStatutoryRules: [
      'IRS Section 1031 Exchange allows real estate investors to defer capital gains tax by rolling sale proceeds into a like-kind replacement property.',
      'Residential rental property depreciates over 27.5 years under MACRS (Modified Accelerated Cost Recovery System).'
    ],
    financialInformationPrinciples: [
      'The 1% Rule states that a rental property should generate monthly rent equal to at least 1% of the purchase price for likely positive cash flow.',
      'Cap rate reflects unleveraged yield and local market risk; Cash-on-Cash return reflects actual equity performance with mortgage financing.'
    ],
    primaryToolIds: ['mortgage-calculator', 'emi-calculator', 'compound-interest-calculator'],
    goalTasks: [
      { task: 'Calculate Net Operating Income (NOI) and Capitalization Rate (Cap Rate)', targetUrl: '/finance/real-estate', badge: 'Cap Rate' },
      { task: 'Calculate Cash-on-Cash Return on rental down payment', targetUrl: '/finance/real-estate', badge: 'Cash-on-Cash' },
      { task: 'Model complete residential mortgage PITI schedule', targetUrl: '/finance/mortgage-calculator', badge: 'Mortgage P&I' }
    ],
    guides: [
      {
        slug: 'cap-rate-vs-cash-on-cash',
        title: 'Cap Rate vs. Cash-on-Cash Return in Real Estate Investing',
        description: 'Understand the critical difference between evaluating property value versus measuring investor equity return.',
        formula: 'Cap Rate = NOI / Property Value  |  Cash-on-Cash = Cash Flow / Cash Invested',
        formulaVariables: [
          { symbol: 'NOI', meaning: 'Annual Gross Operating Income minus Operating Expenses' },
          { symbol: 'Cash Flow', meaning: 'NOI minus Annual Mortgage Debt Service' }
        ],
        workedExample: {
          scenario: '$300,000 rental property purchased with 20% down ($60,000 + $5,000 closing costs). NOI = $24,000/yr. Annual Mortgage Payments = $16,000/yr.',
          calculation: 'Cap Rate = $24,000 / $300,000 = 8.0%. Annual Cash Flow = $24,000 - $16,000 = $8,000. Cash-on-Cash Return = $8,000 / $65,000 = 12.31%.',
          result: '8.0% Cap Rate | 12.31% Cash-on-Cash Return'
        },
        keyTakeaway: 'Favorable mortgage leverage can boost your cash-on-cash yield significantly above the property’s baseline cap rate.'
      }
    ],
    faqs: [
      { question: 'What is included in Net Operating Income (NOI)?', answer: 'NOI includes all rental revenue, parking fees, and laundry income minus property taxes, insurance, maintenance, property management fees, utilities, and vacancy reserves. Crucially, NOI does NOT include mortgage principal or interest payments.' },
      { question: 'What is a good Cap Rate for rental properties?', answer: 'Typical cap rates range from 4% to 6% in high-demand prime urban markets (lower risk, higher appreciation potential) and 7% to 10%+ in secondary or suburban rental markets (higher immediate yield).' }
    ],
    relatedClusterSlugs: ['mortgages', 'investing', 'loans', 'taxes']
  }
};

export function getFinanceSubcategoryCluster(slug: string): FinanceSubcategoryCluster | null {
  const normalized = slug.replace(/^\/finance\/?/, '').replace(/\/$/, '');
  return FINANCE_SUBCATEGORY_CLUSTERS[normalized] || null;
}
