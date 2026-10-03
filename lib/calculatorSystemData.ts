import { CANONICAL_TOOLS, CanonicalTool } from './registry';

export interface CalculatorVariable {
  symbol: string;
  name: string;
  unit: string;
  description: string;
}

export interface CalculatorWorkedExample {
  title: string;
  scenario: string;
  inputs: Record<string, string>;
  stepByStep: string[];
  finalResult: string;
  interpretation: string;
}

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface CalculatorSystemData {
  id: string;
  slug: string;
  name: string;
  h1: string;
  category: string;
  categoryName: string;
  categoryPath: string;
  subcategory?: string;
  subcategoryName?: string;
  subcategoryPath?: string;
  canonicalUrl: string;
  shortAnswer: string;
  formula: {
    equation: string;
    description: string;
    variables: CalculatorVariable[];
    assumptions: string[];
  };
  workedExample: CalculatorWorkedExample;
  howToUse: string[];
  howItIsCalculated: string[];
  whenToUse: string[];
  limitations: string[];
  sourceReference: {
    organization: string;
    standardName: string;
    citation: string;
    versionOrDate: string;
  };
  relatedToolIds: string[];
  relatedConversionPaths: { label: string; path: string }[];
  relatedGuidePaths: { title: string; path: string }[];
  faqs: CalculatorFaq[];
}

export const CALCULATOR_SYSTEM_REGISTRY: Record<string, CalculatorSystemData> = {
  'mortgage-calculator': {
    id: 'mortgage-calculator',
    slug: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    h1: 'Mortgage Payment & Amortization Calculator',
    category: 'finance',
    categoryName: 'Finance',
    categoryPath: '/finance',
    subcategory: 'mortgages',
    subcategoryName: 'Mortgages & Real Estate',
    subcategoryPath: '/finance/mortgages',
    canonicalUrl: 'https://solveitcalculator.com/finance/mortgage-calculator',
    shortAnswer: 'This calculator computes your exact monthly mortgage payment (principal and interest) plus monthly property taxes, home insurance, and private mortgage insurance (PMI) with full multi-decade amortization schedules.',
    formula: {
      equation: 'M = P × [r(1 + r)^n] / [(1 + r)^n - 1]',
      description: 'The standard fixed-rate amortizing loan equation determines the fixed periodic payment required to reduce loan principal to zero over n compounding periods.',
      variables: [
        { symbol: 'M', name: 'Monthly Payment', unit: 'USD ($/month)', description: 'Fixed monthly principal and interest installment.' },
        { symbol: 'P', name: 'Principal Balance', unit: 'USD ($)', description: 'Total initial home loan amount after down payment.' },
        { symbol: 'r', name: 'Periodic Interest Rate', unit: 'Decimal (r = APR / 12)', description: 'Annual percentage interest rate divided by 12 monthly cycles.' },
        { symbol: 'n', name: 'Total Number of Payments', unit: 'Months (n = Years × 12)', description: 'Total scheduled monthly payments (e.g., 360 for 30 years).' }
      ],
      assumptions: [
        'Interest is compounded monthly on the unpaid principal balance.',
        'Payments are made at the end of each monthly period.',
        'Property taxes and insurance escrow remain constant unless adjusted in model inputs.'
      ]
    },
    workedExample: {
      title: '30-Year Fixed Mortgage with 20% Down Payment',
      scenario: 'Purchasing a $500,000 home with a 20% down payment ($100,000) at 6.75% annual interest on a 30-year fixed term with $6,000/yr property taxes and $1,500/yr homeowner insurance.',
      inputs: {
        'Home Price': '$500,000',
        'Down Payment': '$100,000 (20%)',
        'Loan Amount (P)': '$400,000',
        'Interest Rate (APR)': '6.75%',
        'Loan Term': '30 Years (360 Months)',
        'Annual Property Tax': '$6,000',
        'Annual Home Insurance': '$1,500'
      },
      stepByStep: [
        'Calculate monthly periodic rate r = 0.0675 / 12 = 0.005625.',
        'Compute compounding factor (1 + r)^360 = (1.005625)^360 ≈ 7.5028.',
        'Calculate base principal & interest M = 400,000 × [0.005625 × 7.5028] / [7.5028 - 1] = 400,000 × 0.042203 / 6.5028 = $2,594.30.',
        'Add monthly property taxes = $6,000 / 12 = $500.00.',
        'Add monthly homeowner insurance = $1,500 / 12 = $125.00.',
        'Total Monthly PITI Payment = $2,594.30 + $500.00 + $125.00 = $3,219.30.'
      ],
      finalResult: '$2,594.30/month (Principal & Interest) | $3,219.30/month Total PITI',
      interpretation: 'Over 30 years, you will pay a total of $933,948.00 in principal and interest, consisting of $400,000 principal repayment and $533,948.00 in cumulative interest.'
    },
    howToUse: [
      'Enter the total home purchase price or expected purchase budget.',
      'Specify your down payment amount in dollars or as a percentage (20% avoids PMI).',
      'Input the annual interest rate (APR) quoted by your mortgage lender.',
      'Select loan duration (typically 15 or 30 years).',
      'Optionally input annual property tax, insurance, and HOA dues for a complete PITI breakdown.',
      'Review your monthly payment, interest versus principal distribution, and full amortization schedule.'
    ],
    howItIsCalculated: [
      'The initial loan principal is determined by subtracting your down payment from the home price.',
      'Monthly principal and interest are calculated using the standard annuity amortization formula.',
      'In early loan years, the majority of each payment covers interest on the large outstanding balance.',
      'As principal is paid down, the interest portion shrinks, allowing a steadily increasing percentage of each monthly payment to build home equity.'
    ],
    whenToUse: [
      'Comparing affordability across different home price brackets before making an offer.',
      'Evaluating the trade-offs between 15-year and 30-year fixed-rate mortgages.',
      'Assessing the financial impact of increasing your down payment to eliminate private mortgage insurance (PMI).',
      'Planning extra monthly principal prepayments to shorten loan duration and save tens of thousands in interest.'
    ],
    limitations: [
      'Does not account for future municipal property tax reassessments or insurance premium inflation.',
      'Closing costs, transfer taxes, and loan origination fees are excluded from the recurring monthly PITI payment.',
      'Adjustable-rate mortgages (ARMs) with variable rate caps after initial fixed periods require dynamic rate modeling.'
    ],
    sourceReference: {
      organization: 'Consumer Financial Protection Bureau (CFPB)',
      standardName: '12 CFR Part 1026 (Truth in Lending - Regulation Z) & Fixed-Rate Amortization Rules',
      citation: 'CFPB Mortgage Disclosure & Amortization Compliance Standards',
      versionOrDate: '2026 Regulatory Review Edition'
    },
    relatedToolIds: [
      'compound-interest-calculator',
      'investment-calculator',
      'emi-calculator',
      'fire-forecaster',
      'age-calculator'
    ],
    relatedConversionPaths: [
      { label: 'Square Footage & Area Converter', path: '/conversions/area' },
      { label: 'Currency & Ratio Estimator', path: '/math/percentage-calculator' }
    ],
    relatedGuidePaths: [
      { title: 'How EMI and Loan Amortization Works', path: '/article/how-emi-works' },
      { title: 'Investment and Growth Fundamentals', path: '/article/investment-planning-basics' }
    ],
    faqs: [
      {
        question: 'What is included in a PITI mortgage payment?',
        answer: 'PITI stands for Principal, Interest, Taxes, and Insurance. Principal reduces the loan balance; Interest is the lender fee for borrowing; Taxes represent local municipal property taxes held in escrow; and Insurance covers homeowner hazard insurance and private mortgage insurance (PMI) if applicable.'
      },
      {
        question: 'How does a 15-year mortgage compare to a 30-year mortgage?',
        answer: 'A 15-year mortgage features higher monthly payments due to the accelerated payoff schedule, but typically offers a lower interest rate (0.50% to 0.75% lower) and saves more than 60% in total lifetime interest compared to a 30-year mortgage.'
      },
      {
        question: 'When is Private Mortgage Insurance (PMI) required?',
        answer: 'On conventional loans, PMI is generally required if your down payment is less than 20% of the home purchase price (loan-to-value ratio > 80%). Under the federal Homeowners Protection Act, you can request PMI cancellation once your loan balance reaches 80% of original value.'
      },
      {
        question: 'How much interest can I save by making one extra payment per year?',
        answer: 'Making one additional monthly payment each year (or switching to bi-weekly payments) on a 30-year mortgage at 6.5% interest will typically pay off the loan 4 to 6 years early and save tens of thousands of dollars in cumulative interest.'
      },
      {
        question: 'What is the difference between interest rate and APR on a mortgage?',
        answer: 'The interest rate is the base cost of borrowing the principal. APR (Annual Percentage Rate) incorporates the interest rate plus upfront lender fees, origination points, processing costs, and mortgage insurance to represent the true annual cost of credit.'
      },
      {
        question: 'Can I calculate loans with custom property tax rates?',
        answer: 'Yes. You can enter your specific annual property tax amount or calculate it based on local county assessment percentages.'
      }
    ]
  },

  'compound-interest-calculator': {
    id: 'compound-interest-calculator',
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    h1: 'Compound Interest & Future Value Calculator',
    category: 'finance',
    categoryName: 'Finance',
    categoryPath: '/finance',
    subcategory: 'investing',
    subcategoryName: 'Investing & Growth',
    subcategoryPath: '/finance/investing',
    canonicalUrl: 'https://solveitcalculator.com/finance/compound-interest-calculator',
    shortAnswer: 'This calculator projects the exponential growth of an initial principal investment over time with recurring monthly or annual deposits and variable compounding frequencies.',
    formula: {
      equation: 'A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]',
      description: 'The future value equation combines geometric capital accumulation on the starting principal with an ordinary annuity stream compounded periodic times per year.',
      variables: [
        { symbol: 'A', name: 'Future Accrued Value', unit: 'USD ($)', description: 'Total accumulated balance including principal and compounded earnings.' },
        { symbol: 'P', name: 'Starting Principal', unit: 'USD ($)', description: 'Initial lump-sum balance invested at inception.' },
        { symbol: 'r', name: 'Annual Nominal Interest Rate', unit: 'Decimal (r = Rate % / 100)', description: 'Annual rate of return or investment yield.' },
        { symbol: 'n', name: 'Compounding Frequency', unit: 'Periods/Year', description: 'Times compounded per year (12 for monthly, 365 for daily, 1 for annually).' },
        { symbol: 't', name: 'Investment Horizon', unit: 'Years', description: 'Total investment time duration.' },
        { symbol: 'PMT', name: 'Periodic Contribution', unit: 'USD ($/period)', description: 'Regular recurring deposit added at each compounding period.' }
      ],
      assumptions: [
        'The interest rate is constant throughout the investment duration.',
        'Contributions are deposited consistently at the end of each period.',
        'All earned interest is 100% reinvested without interim tax or withdrawal deductions.'
      ]
    },
    workedExample: {
      title: '20-Year Growth on $10,000 with $500 Monthly Contributions',
      scenario: 'Investing an initial $10,000 with monthly contributions of $500 earning an average 8.00% annual return compounded monthly over 20 years.',
      inputs: {
        'Initial Deposit (P)': '$10,000',
        'Monthly Contribution (PMT)': '$500',
        'Annual Return (r)': '8.00% (0.08)',
        'Compounding (n)': 'Monthly (n = 12)',
        'Time Horizon (t)': '20 Years (240 Months)'
      },
      stepByStep: [
        'Calculate periodic rate: r/n = 0.08 / 12 = 0.0066667.',
        'Calculate total compounding cycles: nt = 12 × 20 = 240.',
        'Growth on principal: 10,000 × (1.0066667)^240 = 10,000 × 4.9268 = $49,268.03.',
        'Growth on contributions: 500 × [(4.9268 - 1) / 0.0066667] = 500 × [3.9268 / 0.0066667] = 500 × 589.02 = $294,510.15.',
        'Sum total balance: $49,268.03 + $294,510.15 = $343,778.18.',
        'Total Out-of-Pocket Deposits: $10,000 + ($500 × 240) = $130,000.00.',
        'Total Compound Interest Earned: $343,778.18 - $130,000.00 = $213,778.18.'
      ],
      finalResult: '$343,778.18 Total Balance ($213,778.18 Interest Earned)',
      interpretation: 'Due to compound growth, interest earned exceeds total deposits by more than 164% over the 20-year horizon.'
    },
    howToUse: [
      'Enter your starting principal balance (can be $0 if starting fresh).',
      'Set your recurring monthly or annual contribution amount.',
      'Enter your projected annual rate of return (e.g., 7% historical inflation-adjusted stock index average).',
      'Select compounding frequency (monthly is most common for investment accounts).',
      'Choose your investment horizon in years.',
      'Explore the interactive visual chart comparing total contributions against compound interest growth.'
    ],
    howItIsCalculated: [
      'In each period, interest is computed not just on your initial deposits, but also on the interest previously accumulated.',
      'As time progresses, the compound interest curve curves upward exponentially.',
      'Regular contributions benefit from dollar-cost averaging and extend the compounding multiplier.'
    ],
    whenToUse: [
      'Planning retirement accounts (401k, Roth IRA, Superannuation).',
      'Forecasting long-term college savings or wealth accumulation.',
      'Evaluating high-yield savings accounts (HYSA) and certificate of deposit (CD) compounding.',
      'Comparing the financial cost of waiting 5 or 10 years before beginning to invest.'
    ],
    limitations: [
      'Market investment returns fluctuate year-to-year; sequence of returns risk is not reflected in fixed-average models.',
      'Inflation erodes future nominal purchasing power unless real returns are used.',
      'Taxes on dividends and capital gains in non-sheltered brokerage accounts will reduce net annual yield.'
    ],
    sourceReference: {
      organization: 'FINRA Investor Education Foundation',
      standardName: 'Time Value of Money & Compound Interest Computational Standards',
      citation: 'FINRA Investment Reference Models',
      versionOrDate: '2026 Standards'
    },
    relatedToolIds: [
      'mortgage-calculator',
      'investment-calculator',
      'emi-calculator',
      'fire-forecaster',
      'percentage-calculator'
    ],
    relatedConversionPaths: [
      { label: 'Percentage & Ratio Calculator', path: '/math/percentage-calculator' },
      { label: 'Time & Date Duration Counter', path: '/time-date/date-difference-calculator' }
    ],
    relatedGuidePaths: [
      { title: 'Investment Planning Fundamentals', path: '/article/investment-planning-basics' },
      { title: 'How EMI and Loan Debt Works', path: '/article/how-emi-works' }
    ],
    faqs: [
      {
        question: 'What is the difference between simple and compound interest?',
        answer: 'Simple interest earns returns strictly on the original principal balance. Compound interest earns returns on the principal plus all previous accumulated interest, causing balances to grow exponentially over time.'
      },
      {
        question: 'What is the Rule of 72 in compound interest?',
        answer: 'The Rule of 72 is a quick mental math shortcut: divide 72 by your annual interest rate to find the approximate number of years required to double your money. At 8% annual return, an investment doubles in roughly 72 ÷ 8 = 9 years.'
      },
      {
        question: 'Does daily compounding produce significantly more money than monthly compounding?',
        answer: 'Daily compounding yields slightly higher returns due to faster compounding cycles, but the difference is modest. For example, $10,000 at 7% for 10 years yields $20,096.61 with monthly compounding versus $20,136.18 with daily compounding (a difference of ~$40).'
      },
      {
        question: 'How should I factor inflation into compound interest calculations?',
        answer: 'To calculate purchasing power in today’s dollars, subtract expected annual inflation (typically 2.5% to 3.0%) from your nominal return. If a stock index yields 10% nominal and inflation is 3%, use a 7% real return rate.'
      },
      {
        question: 'What is the difference between APR and APY?',
        answer: 'APR (Annual Percentage Rate) is the base annualized interest rate without compounding. APY (Annual Percentage Yield) reflects the effective annual rate including the effect of compounding within the year.'
      },
      {
        question: 'Can I set annual contributions instead of monthly?',
        answer: 'Yes. You can toggle contributions between monthly and annual deposits in our interactive interface.'
      }
    ]
  },

  'age-calculator': {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator',
    h1: 'Chronological Age & Milestone Calculator',
    category: 'time-date',
    categoryName: 'Time & Date',
    categoryPath: '/time-date',
    subcategory: 'calendar',
    subcategoryName: 'Calendar & Chronometry',
    subcategoryPath: '/time-date/age-calculator',
    canonicalUrl: 'https://solveitcalculator.com/time-date/age-calculator',
    shortAnswer: 'This calculator computes your exact chronological age in years, months, weeks, days, hours, minutes, and seconds from your date of birth, factoring in Gregorian leap years and upcoming birthday milestones.',
    formula: {
      equation: 'Δt = Date(Target) - Date(Birth) with Gregorian Intercalary Cycle Adjustments',
      description: 'Calculates exact chronological elapsed time between birth epoch and current/target date with variable calendar month lengths and leap years.',
      variables: [
        { symbol: 'Date(Birth)', name: 'Date of Birth', unit: 'ISO 8601 Date', description: 'Year, month, and day of birth.' },
        { symbol: 'Date(Target)', name: 'Target Date', unit: 'ISO 8601 Date', description: 'Reference date for age determination (defaults to today).' },
        { symbol: 'Δt', name: 'Chronological Age Span', unit: 'Years, Months, Days', description: 'Exact elapsed calendar interval.' }
      ],
      assumptions: [
        'Calendar arithmetic follows the standard Gregorian calendar introduced in 1582.',
        'A full year completes on the exact anniversary date.'
      ]
    },
    workedExample: {
      title: 'Exact Age Calculation for Birth Date July 14, 1995',
      scenario: 'Calculating exact chronological age on October 15, 2026 for a person born July 14, 1995.',
      inputs: {
        'Birth Date': 'July 14, 1995',
        'Target Date': 'October 15, 2026'
      },
      stepByStep: [
        'Subtract birth year from target year: 2026 - 1995 = 31 years.',
        'Compare birth month (July, month 7) to target month (October, month 10): 10 - 7 = 3 months.',
        'Compare birth day (14) to target day (15): 15 - 14 = 1 day.',
        'Exact chronological age: 31 Years, 3 Months, and 1 Day.',
        'Total elapsed solar days: 11,416 Days lived (including 8 leap days: 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024).'
      ],
      finalResult: '31 Years, 3 Months, 1 Day (11,416 Total Days Lived)',
      interpretation: 'Next milestone: 32nd birthday occurs in 272 days.'
    },
    howToUse: [
      'Select your birth date (month, day, year).',
      'Select target date (defaults to the current date).',
      'Instantly view your exact age in years, months, and days.',
      'Explore secondary breakdowns: total days, total weeks, total hours, and upcoming birthday countdowns.'
    ],
    howItIsCalculated: [
      'The algorithm subtracts days, adjusting for the varying number of days in preceding calendar months (28, 29, 30, or 31 days).',
      'Months and years are calculated with strict calendar boundary alignment rather than rough 30-day approximations.'
    ],
    whenToUse: [
      'Verifying legal age requirements for employment, licensing, military service, or voting.',
      'Determining precise pediatric milestones and infant age in months/weeks.',
      'Calculating exact age for retirement eligibility and social security benefits.',
      'Planning milestone birthday and anniversary celebrations.'
    ],
    limitations: [
      'Historical dates prior to October 15, 1582 in some regions followed the Julian calendar rather than Gregorian.',
      'Exact time of birth (hours/minutes) requires timezone offset specification if birth occurred in a different meridian.'
    ],
    sourceReference: {
      organization: 'International Organization for Standardization (ISO)',
      standardName: 'ISO 8601: Date and Time Representation Standards',
      citation: 'ISO 8601:2019 Date & Time Specifications',
      versionOrDate: '2026 Standard Edition'
    },
    relatedToolIds: [
      'work-hours',
      'date-difference-calculator',
      'countdown-timer',
      'retirement-countdown',
      'mortgage-calculator'
    ],
    relatedConversionPaths: [
      { label: 'Time & Date Converter', path: '/conversions/time' },
      { label: 'Unix Timestamp Converter', path: '/time-date/unix-timestamp-converter' }
    ],
    relatedGuidePaths: [
      { title: 'The Science of 90-Minute Ultradian Rhythms', path: '/article/science-of-90-minute-sleep-cycles' }
    ],
    faqs: [
      {
        question: 'How does the calculator handle leap years when calculating age in days?',
        answer: 'The calculator checks every single year within the range and adds an extra day (February 29) for every qualifying leap year (years divisible by 4, except century years not divisible by 400).'
      },
      {
        question: 'How is age calculated for someone born on Leap Day (February 29)?',
        answer: 'In non-leap common years, legal jurisdictions typically recognize the age anniversary on March 1st (or February 28th depending on local statutory code), and our tool accurately calculates days elapsed.'
      },
      {
        question: 'Can I calculate my age on a future or past historical date?',
        answer: 'Yes. You can adjust the "Calculate Age As Of" target date to any past or future date.'
      },
      {
        question: 'How many total days have I lived?',
        answer: 'The total days lived is the absolute integer difference between your birth timestamp and target date, accounting for all Gregorian calendar intercalary leap days.'
      },
      {
        question: 'What is the half-birthday and when does it occur?',
        answer: 'A half-birthday occurs exactly 6 calendar months from your date of birth.'
      },
      {
        question: 'Does this calculator support time of birth (hours and minutes)?',
        answer: 'Yes, you can specify your exact birth time for down-to-the-minute precision.'
      }
    ]
  },

  'percentage-calculator': {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    h1: 'Percentage Calculator & Step-by-Step Solver',
    category: 'math',
    categoryName: 'Math',
    categoryPath: '/math',
    subcategory: 'percentages',
    subcategoryName: 'Percentages & Fractions',
    subcategoryPath: '/math/percentage-calculator',
    canonicalUrl: 'https://solveitcalculator.com/math/percentage-calculator',
    shortAnswer: 'This calculator solves all standard percentage problems including percentage of a number, percentage increase and decrease, percentage difference, and reverse percentage calculations with step-by-step arithmetic steps.',
    formula: {
      equation: 'Percentage % = (Part / Whole) × 100% ; % Change = ((New - Old) / |Old|) × 100%',
      description: 'The fundamental mathematical proportion expresses fractions of a whole scaled to parts per hundred (per centum).',
      variables: [
        { symbol: 'Part (P)', name: 'Portion / Numerator', unit: 'Real Number', description: 'The subset quantity being measured.' },
        { symbol: 'Whole (W)', name: 'Baseline / Denominator', unit: 'Real Number', description: 'The total reference quantity (must not equal zero).' },
        { symbol: '%', name: 'Percentage Result', unit: '%', description: 'The ratio scaled per 100 units.' }
      ],
      assumptions: [
        'The baseline denominator Whole is non-zero (division by zero is undefined).',
        'Percentage change divides strictly by the initial original value.'
      ]
    },
    workedExample: {
      title: 'Calculating Percentage Increase on Retail Price',
      scenario: 'A supplier increases the wholesale cost of a component from $45.00 to $58.50. Calculate the percentage increase.',
      inputs: {
        'Original Price (Old)': '$45.00',
        'New Price (New)': '$58.50'
      },
      stepByStep: [
        'Calculate absolute difference: $58.50 - $45.00 = $13.50.',
        'Divide difference by original baseline: $13.50 / $45.00 = 0.30.',
        'Multiply by 100 to convert to percentage: 0.30 × 100% = 30.00%.'
      ],
      finalResult: '+30.00% Price Increase',
      interpretation: 'The component price increased by exactly 30% relative to its original wholesale cost.'
    },
    howToUse: [
      'Select the percentage mode you wish to solve (e.g. "What is X% of Y", "Percentage Increase/Decrease", or "X is what % of Y").',
      'Input the primary numerical values.',
      'View the immediate answer alongside the step-by-step arithmetic breakdown.',
      'Copy the formula or result for academic or financial documentation.'
    ],
    howItIsCalculated: [
      'For "X% of Y": Multiply Y by (X ÷ 100).',
      'For "Percentage Change": Subtract old from new, divide by original, multiply by 100.',
      'For "Reverse Percentage": To find original price before discount d%, divide final price by (1 - d/100).'
    ],
    whenToUse: [
      'Calculating store sales discounts, coupons, and clearance savings.',
      'Computing tip percentages and sales tax on restaurant bills.',
      'Analyzing business growth metrics, revenue lifts, and profit margins.',
      'Solving academic math, science, and statistics coursework problems.'
    ],
    limitations: [
      'Cannot divide by zero (percentage change from zero is mathematically undefined).',
      'Percentage points and percentage change must not be confused (e.g. an interest rate increase from 4% to 5% is a 1 percentage point rise, but a 25% relative increase).'
    ],
    sourceReference: {
      organization: 'National Institute of Standards and Technology (NIST)',
      standardName: 'Mathematical & Floating Point Computational References',
      citation: 'NIST Guide for Mathematical Arithmetic',
      versionOrDate: '2026 Standards'
    },
    relatedToolIds: [
      'standard-deviation-calculator',
      'compound-interest-calculator',
      'mortgage-calculator',
      'investment-calculator',
      'age-calculator'
    ],
    relatedConversionPaths: [
      { label: 'Decimal & Fraction Converter', path: '/math/percentage-calculator' },
      { label: 'Metric Unit Converter', path: '/conversions' }
    ],
    relatedGuidePaths: [
      { title: 'Understanding Percentage vs Percentage Points', path: '/math' }
    ],
    faqs: [
      {
        question: 'How do you calculate a percentage of a number?',
        answer: 'Convert the percentage into a decimal by dividing by 100, then multiply by the number. For example, 15% of 80 is 0.15 × 80 = 12.'
      },
      {
        question: 'What is the formula for percentage increase?',
        answer: 'Percentage Increase = ((New Value - Old Value) / Old Value) × 100%. If an item rises from $50 to $70: ((70 - 50) / 50) × 100% = (20 / 50) × 100% = 40%.'
      },
      {
        question: 'How do you calculate a reverse percentage discount?',
        answer: 'To find the original price before a discount of d%, divide the sale price by (1 - d/100). If a jacket costs $80 after a 20% discount: $80 ÷ (1 - 0.20) = $80 ÷ 0.80 = $100 original price.'
      },
      {
        question: 'What is the difference between percentage and percentage points?',
        answer: 'Percentage points represent the simple arithmetic difference between two percentage values. Percentage change measures the relative proportion of change. When an interest rate rises from 10% to 12%, it rises by 2 percentage points, but 20% in relative terms.'
      },
      {
        question: 'Can percentages be greater than 100%?',
        answer: 'Yes. A value greater than 100% represents a quantity larger than the original whole. For example, 250% of $100 is $250, representing a 150% increase.'
      },
      {
        question: 'Does this calculator show the exact mathematical formula steps?',
        answer: 'Yes, every calculation displays the exact formula with substituted numbers so you can verify the work.'
      }
    ]
  },

  'work-hours': {
    id: 'work-hours',
    slug: 'work-hours',
    name: 'Work Hours Calculator',
    h1: 'Work Hours, Timesheet & Overtime Calculator',
    category: 'time-date',
    categoryName: 'Time & Date',
    categoryPath: '/time-date',
    subcategory: 'work-time',
    subcategoryName: 'Work Hours & Timesheets',
    subcategoryPath: '/time-date/work-hours',
    canonicalUrl: 'https://solveitcalculator.com/time-date/work-hours',
    shortAnswer: 'This calculator computes total weekly work hours, daily shift durations, unpaid lunch deductions, gross wages, and 1.5× FLSA overtime pay with clean exportable timesheets.',
    formula: {
      equation: 'Net Shift = (ClockOut - ClockIn) - Unpaid Breaks ; Gross Pay = (Regular Hrs × Base Rate) + (OT Hrs × 1.5 × Base Rate)',
      description: 'Computes elapsed working time in sexagesimal minutes, converts to decimal payroll hours, and applies US Fair Labor Standards Act (FLSA) 40-hour weekly overtime compensation rules.',
      variables: [
        { symbol: 'ClockIn / ClockOut', name: 'Shift Start & End', unit: 'HH:MM (12h/24h)', description: 'Daily clock-in and clock-out times.' },
        { symbol: 'Break', name: 'Unpaid Meal Period', unit: 'Minutes', description: 'Bona fide duty-free meal deduction (typically 30–60 min).' },
        { symbol: 'Regular Hrs', name: 'Standard Hours', unit: 'Decimal Hours', description: 'Hours up to 40 in a single 7-day workweek.' },
        { symbol: 'OT Hrs', name: 'Overtime Hours', unit: 'Decimal Hours', description: 'Hours worked in excess of 40 in a workweek paid at 1.5× base rate.' }
      ],
      assumptions: [
        'A standard non-exempt workweek threshold of 40 hours applies under federal FLSA regulations.',
        'Short rest breaks (5 to 20 minutes) are compensable paid time; meal periods (30+ minutes) are unpaid.'
      ]
    },
    workedExample: {
      title: 'Weekly 5-Day Shift with Lunch Breaks & Overtime',
      scenario: 'Working Monday through Friday from 8:00 AM to 5:30 PM with a 45-minute unpaid lunch break each day at a $24.00/hour base wage.',
      inputs: {
        'Daily Shift': '8:00 AM to 5:30 PM (9.5 gross hours/day)',
        'Unpaid Lunch Break': '45 minutes (0.75 hours/day)',
        'Net Daily Hours': '8.75 hours/day',
        'Days Worked': '5 Days (Monday – Friday)',
        'Base Hourly Wage': '$24.00/hour'
      },
      stepByStep: [
        'Calculate total net weekly hours: 5 days × 8.75 hours = 43.75 total hours.',
        'Regular hours (up to 40): 40.00 hours.',
        'Overtime hours (above 40): 43.75 - 40.00 = 3.75 hours.',
        'Regular pay: 40.00 hrs × $24.00 = $960.00.',
        'Overtime rate: $24.00 × 1.5 = $36.00/hour.',
        'Overtime pay: 3.75 hrs × $36.00 = $135.00.',
        'Total gross weekly compensation: $960.00 + $135.00 = $1,095.00.'
      ],
      finalResult: '43.75 Total Hours (40.00 Regular + 3.75 Overtime) | $1,095.00 Gross Pay',
      interpretation: 'The 3.75 overtime hours generated $135.00 in premium wages under FLSA rules.'
    },
    howToUse: [
      'Enter Clock In and Clock Out times for each day worked (Monday through Sunday).',
      'Enter unpaid break duration in minutes (e.g. 30 or 60 min) for each shift.',
      'Optionally enter your base hourly wage rate.',
      'View total hours in both standard HH:MM format and decimal payroll hours.',
      'Review your gross pay and overtime earnings breakdown.'
    ],
    howItIsCalculated: [
      'Daily shift minutes are calculated from time difference, subtracting unpaid lunch minutes.',
      'Minutes are divided by 60 to produce decimal payroll hours (e.g., 8 hours 15 minutes = 8.25 decimal hours).',
      'Total weekly hours are summed: hours up to 40 are multiplied by the base rate, and hours beyond 40 are multiplied by 1.5× the base rate.'
    ],
    whenToUse: [
      'Hourly workers validating payroll paystubs and timesheet entries.',
      'Freelancers and contractors billing clients for hourly projects.',
      'Managers approving weekly employee shift cards and overtime budgets.',
      'Tracking split shifts, overnight shifts, and irregular schedules.'
    ],
    limitations: [
      'State-specific daily overtime rules (such as California’s requirement for overtime over 8 hours in a single workday) require regional setting adjustments.',
      'Does not compute payroll tax withholdings (FICA, federal, state income taxes).'
    ],
    sourceReference: {
      organization: 'US Department of Labor (Wage and Hour Division)',
      standardName: 'Fair Labor Standards Act (FLSA 29 CFR Part 778 - Overtime Compensation)',
      citation: 'FLSA 29 U.S.C. § 207 Hours Worked Guidelines',
      versionOrDate: '2026 Compliance Standards'
    },
    relatedToolIds: [
      'age-calculator',
      'date-difference-calculator',
      'retirement-countdown',
      'percentage-calculator',
      'mortgage-calculator'
    ],
    relatedConversionPaths: [
      { label: 'Time Converter (Hours, Minutes, Seconds)', path: '/conversions/time' },
      { label: 'Military Time Converter (24-Hour)', path: '/time-date/military-time-converter' }
    ],
    relatedGuidePaths: [
      { title: 'FLSA Work Hours & Overtime Compliance', path: '/time-date' }
    ],
    faqs: [
      {
        question: 'How do you convert minutes to decimal hours for payroll?',
        answer: 'Divide the number of minutes by 60. For example: 15 minutes = 0.25 hours; 30 minutes = 0.50 hours; 45 minutes = 0.75 hours. An 8 hour 45 minute shift is 8.75 decimal hours.'
      },
      {
        question: 'Are employers required to pay for lunch breaks under federal law?',
        answer: 'Under the US FLSA, bona fide meal periods (typically 30 minutes or more where the employee is completely relieved from duty) are not work time and are unpaid. Rest breaks of short duration (5 to 20 minutes) must be counted as paid work hours.'
      },
      {
        question: 'How is overtime calculated across overnight shifts?',
        answer: 'An overnight shift spanning two calendar days is attributed to the workday or workweek established by the employer’s regular 7-day payroll schedule.'
      },
      {
        question: 'What is the 7-minute rounding rule in payroll timesheets?',
        answer: 'Under FLSA regulations (29 CFR 785.48(b)), employers may round employee time to the nearest 15 minutes (quarter-hour), rounding down for 1 to 7 minutes and rounding up for 8 to 14 minutes, provided it averages out fairly over time.'
      },
      {
        question: 'Does this calculator support 24-hour military time?',
        answer: 'Yes, you can toggle between standard 12-hour AM/PM time and 24-hour military time format.'
      },
      {
        question: 'Can I export my completed timesheet?',
        answer: 'Yes, timesheet summaries can be printed or copied directly for payroll submission.'
      }
    ]
  }
};

export function getCalculatorSystemData(id: string): CalculatorSystemData | null {
  return CALCULATOR_SYSTEM_REGISTRY[id] || null;
}
