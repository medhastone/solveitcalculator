export interface CanonicalSubcategory {
  id: string;
  name: string;
  path: string;
  description: string;
}

export interface CanonicalCategory {
  id: string;
  name: string;
  slug: string;
  path: string;
  icon: string;
  description: string;
  standardsBody: string;
  subcategories?: CanonicalSubcategory[];
}

export interface CanonicalTool {
  id: string;
  title: string;
  name: string;
  canonicalPath: string;
  category: string;
  subcategory?: string;
  badge: string;
  desc: string;
  keywords: string[];
  formulaDisplay: string;
  calculationStandard: string;
  lastUpdated: string;
}

/**
 * SolveItCalculator Authoritative Platform Registry
 * Single Source of Truth for all Categories, Subcategories, Canonical Calculators, and Counts.
 * All tool counts, category counts, formulas, and verified standards are derived directly from this file.
 */ export const CANONICAL_CATEGORIES = [
    {
        id: 'finance',
        name: 'Finance & Banking',
        slug: 'finance',
        path: '/finance',
        icon: 'account_balance',
        description: 'High-precision computational models for mortgages, loans, compound interest, payroll, and statutory tax calculations.',
        standardsBody: 'CFPB (12 CFR Part 1026), IRS Publication 15-T, US Federal Reserve Regulations',
        subcategories: [
            {
                id: 'mortgages',
                name: 'Mortgages & Real Estate',
                path: '/finance/mortgages',
                description: 'Amortization, PITI, PMI, down payments, and home equity.'
            },
            {
                id: 'loans',
                name: 'Loans & Amortization',
                path: '/finance/loans',
                description: 'Equated Monthly Installment (EMI), personal loans, and debt payoff.'
            },
            {
                id: 'investing',
                name: 'Investing & Compound Growth',
                path: '/finance/investing',
                description: 'Compound interest, SIP returns, and portfolio trajectory.'
            },
            {
                id: 'retirement',
                name: 'Retirement & Long-Term Planning',
                path: '/finance/retirement',
                description: 'FIRE forecasting, safe withdrawal rates, and 401(k) models.'
            },
            {
                id: 'taxes',
                name: 'Tax Engines & Statutory Models',
                path: '/finance',
                description: 'Marginal tax brackets, GST, VAT, and paycheck deductions.'
            },
            {
                id: 'banking',
                name: 'Banking & Cash Accounts',
                path: '/finance/banking',
                description: 'APY compound interest, liquidity, and CDs.'
            },
            {
                id: 'savings',
                name: 'Savings & Liquidity',
                path: '/finance/savings',
                description: 'Emergency funds, goal accumulation, and compound savings.'
            },
            {
                id: 'credit-cards',
                name: 'Credit Cards & Revolving Credit',
                path: '/finance/credit-cards',
                description: 'Minimum payments, interest payoff schedules, and debt snowball.'
            },
            {
                id: 'salary',
                name: 'Salary & Payroll',
                path: '/finance/salary',
                description: 'Gross to net pay, hourly wages, and shift compensation.'
            },
            {
                id: 'business',
                name: 'Business Finance & Margin',
                path: '/finance/business',
                description: 'Gross margin, markup, break-even CVP analysis, and P&L profit margins.'
            }
        ]
    },
    {
        id: 'time-date',
        name: 'Date, Time & Productivity',
        slug: 'time-date',
        path: '/date-time',
        icon: 'schedule',
        description: 'Chronological engines, payroll timesheets, astronomical calculators, and global timezone coordination tools.',
        standardsBody: 'ISO 8601 (Time & Date Representation), IERS (Julian Dates), US FLSA (Work Hours)',
        subcategories: [
            {
                id: 'work-time',
                name: 'Work Hours & Timesheets',
                path: '/time-duration-calculator',
                description: 'Payroll timesheets, break tracking, and overtime under FLSA.'
            },
            {
                id: 'calendar',
                name: 'Calendar & Chronometry',
                path: '/age-calculator',
                description: 'Age in days, date differences, leap years, and Julian dates.'
            },
            {
                id: 'astronomy',
                name: 'Astronomical & Ephemeris',
                path: '/date-time',
                description: 'Solar eclipses, moon phases, and equinox calculations.'
            },
            {
                id: 'timers',
                name: 'Timers & Productivity',
                path: '/time-duration-calculator',
                description: 'Pomodoro rhythms, countdown clocks, and ultradian cycles.'
            }
        ]
    },
    {
        id: 'math',
        name: 'Mathematics & Statistics',
        slug: 'math',
        path: '/math',
        icon: 'calculate',
        description: 'Deterministic mathematical engines for percentages, statistical distributions, algebra, and scientific notation.',
        standardsBody: 'IEEE 754 Floating-Point Arithmetic & NIST Statistical References'
    },
    {
        id: 'conversions',
        name: 'Universal Unit Conversions',
        slug: 'conversions',
        path: '/conversions',
        icon: 'swap_horiz',
        description: 'Standardized unit conversions across length, mass, volume, temperature, and engineering dimensions.',
        standardsBody: 'NIST SP 811 (Guide for the Use of the International System of Units) & ISO 80000'
    },
    {
        id: 'health-fitness',
        name: 'Health & Fitness',
        slug: 'health-fitness',
        path: '/health-fitness',
        icon: 'favorite',
        description: 'Evidence-based physiological estimators for BMI, BMR, TDEE, body composition, macros, and cardiovascular training zones.',
        standardsBody: 'American College of Sports Medicine (ACSM), World Health Organization (WHO), CDC Guidelines'
    },
    {
        id: 'electrical',
        name: 'Electrical & Power',
        slug: 'electrical',
        path: '/electrical',
        icon: 'bolt',
        description: 'Wire sizing, voltage drop, Ohm’s law, electricity bills, and circuit breaker calculations.',
        standardsBody: 'National Electrical Code (NEC / NFPA 70 Guidelines) & IEEE Standards',
        subcategories: [
            {
                id: 'home-wiring',
                name: 'Home Wiring & Conductors',
                path: '/electrical',
                description: 'Wire gauge sizing (AWG), voltage drop, conduit fill, box volume, and breaker ratings.'
            },
            {
                id: 'circuits',
                name: 'Circuits & Fundamentals',
                path: '/electrical',
                description: 'Ohm’s law (V, I, R, P), series/parallel resistors, LED resistors, and AC RMS voltage.'
            },
            {
                id: 'energy-cost',
                name: 'Energy & Utility Costs',
                path: '/electrical',
                description: 'Electricity bills per kWh, appliance power usage, solar arrays, and generator sizing.'
            },
            {
                id: 'electronics-conversions',
                name: 'Electronic Components & Conversions',
                path: '/electrical',
                description: 'Capacitance, inductance, resistor color bands, SMD codes, and unit conversions.'
            }
        ]
    },
    {
        id: 'automotive',
        name: 'Automotive & Mechanical',
        slug: 'automotive',
        path: '/automotive',
        icon: 'directions_car',
        description: 'Gear ratios, engine RPM at speed, fuel economy, and mechanical estimations.',
        standardsBody: 'SAE International Mechanical & Automotive Standards'
    },
    {
        id: 'home-construction',
        name: 'Home & Construction',
        slug: 'home-construction',
        path: '/home-construction',
        icon: 'home_work',
        description: 'Concrete slab volume, framing lumber, roofing shingles, and square footage calculators.',
        standardsBody: 'International Residential Code (IRC) & ASTM Material Standards'
    },
    {
        id: 'education',
        name: 'Education & Academics',
        slug: 'education',
        path: '/education',
        icon: 'school',
        description: 'GPA calculations, final grade estimators, and academic planning workbenches.',
        standardsBody: 'Standardized Academic Grading Scales (4.0 Scale & Weighted Honors/AP)'
    },
    {
        id: 'science',
        name: 'Science & Physics',
        slug: 'science',
        path: '/science',
        icon: 'science',
        description: 'Kinematics, thermodynamics, wave equations, and fundamental scientific constants.',
        standardsBody: 'CODATA Recommended Values of the Fundamental Physical Constants'
    },
    {
        id: 'technology',
        name: 'Technology & Networking',
        slug: 'technology',
        path: '/technology',
        icon: 'memory',
        description: 'Data transfer rates, storage capacity conversions, and subnet calculators.',
        standardsBody: 'IEEE 802 Standards & IEC 80000-13 Binary Data Prefixes (KiB, MiB, GiB)'
    }
];
export const CANONICAL_TOOLS = [
    // --- FINANCE SUITE ---
    {
        id: 'mortgage-calculator',
        title: 'Mortgage Calculator',
        name: 'Mortgage Payment & Amortization Calculator',
        canonicalPath: '/mortgage-calculator',
        category: 'finance',
        subcategory: 'mortgages',
        badge: 'PITI & Amortization',
        desc: 'Calculate exact monthly principal and interest, property taxes, home insurance, PMI, and complete amortization schedules.',
        keywords: [
            'mortgage calculator',
            'monthly mortgage payment',
            'home loan calculator',
            'amortization schedule',
            'pmi calculator'
        ],
        formulaDisplay: 'M = P[r(1+r)^n] / [(1+r)^n - 1]',
        calculationStandard: 'CFPB Fixed-Rate Amortization Standard (12 CFR Part 1026)',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'compound-interest-calculator',
        title: 'Compound Interest Calculator',
        name: 'Compound Interest & Future Value Calculator',
        canonicalPath: '/compound-interest-calculator',
        category: 'finance',
        subcategory: 'investing',
        badge: 'Compounding Law',
        desc: 'Forecast compound interest growth over time with regular monthly or annual contributions and inflation adjustments.',
        keywords: [
            'compound interest calculator',
            'investment growth',
            'future value',
            'compound annual growth rate',
            'cagr'
        ],
        formulaDisplay: 'A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]',
        calculationStandard: 'Standard Financial Mathematics & Continuous Compounding Equations',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'investment-calculator',
        title: 'Investment Calculator',
        name: 'Investment & SIP Growth Calculator',
        canonicalPath: '/finance/investment-calculator/in',
        category: 'finance',
        subcategory: 'investing',
        badge: 'Portfolio Growth',
        desc: 'Calculate investment growth, return on investment (ROI), systematic investment plans (SIP), and asset allocation trajectories.',
        keywords: [
            'investment calculator',
            'sip calculator',
            'roi calculator',
            'portfolio return',
            'mutual fund calculator'
        ],
        formulaDisplay: 'FV = P × (1 + r)^t + PMT × [((1 + r)^t - 1) / r]',
        calculationStandard: 'FINRA Investor Guidelines & Time Value of Money Theory',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'lumpsum-calculator',
        title: 'Lumpsum Calculator',
        name: 'Lumpsum Investment Return & Future Value Calculator',
        canonicalPath: '/finance/lumpsum-calculator',
        category: 'finance',
        subcategory: 'investing',
        badge: 'Lumpsum & Multiplier',
        desc: 'Calculate one-time lumpsum investment returns, compounding wealth multiplier, doubling time, and compare against SIP.',
        keywords: [
            'lumpsum calculator',
            'lump sum calculator',
            'lumpsum vs sip',
            'one time investment calculator',
            'mutual fund lumpsum calculator',
            'future value lumpsum'
        ],
        formulaDisplay: 'FV = P × (1 + R)^t  |  Doubling Time = ln(2) / ln(1 + R)',
        calculationStandard: 'Standard Financial Mathematics & CFA Institute Discrete Compounding Valuation',
        lastUpdated: '2026-10-07'
    },
    {
        id: 'cagr-calculator',
        title: 'CAGR Calculator',
        name: 'CAGR Calculator & Compound Annual Growth Rate Analyzer',
        canonicalPath: '/finance/investment-growth-calculator',
        category: 'finance',
        subcategory: 'investing',
        badge: 'CAGR & Volatility Drag',
        desc: 'Calculate compound annual growth rate (CAGR), ending portfolio value, or time required with exact calendar dates, volatility drag simulation, and XIRR comparison.',
        keywords: [
            'cagr calculator',
            'cagr',
            'compound annual growth rate',
            'annualized return calculator',
            'geometric mean return',
            'volatility drag',
            'cagr vs xirr'
        ],
        formulaDisplay: 'CAGR = (End Value / Begin Value)^(1 / Years) - 1',
        calculationStandard: 'CFA Institute Global Investment Performance Standards (GIPS) & Geometric Mean Valuation',
        lastUpdated: '2026-10-08'
    },
    {
        id: 'roi-calculator',
        title: 'ROI Calculator',
        name: 'ROI Calculator & Annualized Return on Investment Analyzer',
        canonicalPath: '/finance/investment-growth-calculator',
        category: 'finance',
        subcategory: 'investing',
        badge: 'ROI & Multi-Comparison',
        desc: 'Calculate total Return on Investment (ROI), annualized ROI, net gain with costs and dividends, compare up to 3 investments side-by-side, and inspect the ROI vs CAGR vs IRR matrix.',
        keywords: [
            'roi calculator',
            'return on investment',
            'annualized roi',
            'roi',
            'investment return calculator',
            'net gain calculator',
            'roi comparison',
            'roi vs cagr'
        ],
        formulaDisplay: 'ROI = Net Gain / Total Cost Basis  |  Annualized = (1 + ROI)^(1 / Years) − 1',
        calculationStandard: 'Corporate Finance Institute (CFI) & SEC Guidelines for Return on Investment',
        lastUpdated: '2026-10-08'
    },
    {
        id: 'fd-calculator',
        title: 'FD Calculator (Fixed Deposit)',
        name: 'FD Calculator (India), Fixed Deposit Maturity, Interest & TDS Rules',
        canonicalPath: '/finance/fd-calculator',
        category: 'finance',
        subcategory: 'savings',
        badge: 'Fixed Deposit & TDS (India)',
        desc: 'Calculate Indian Fixed Deposit (FD) maturity corpus, quarterly compound interest, effective annual yield, senior citizen bonus rates (+0.50%), and Section 194A / 80TTB TDS tax deductions with bank presets (SBI, HDFC, ICICI, Post Office).',
        keywords: [
            'fd calculator',
            'fd',
            'fd calculator india',
            'india fd calculator',
            'india fd',
            'fd india',
            'fixed deposit calculator',
            'fixed deposit india',
            'fixed deposit',
            'fd interest calculator',
            'sbi fd calculator',
            'hdfc fd calculator',
            'icici fd calculator',
            'post office fd calculator',
            'senior citizen fd calculator',
            'tds on fd calculator',
            'fixed deposit maturity calculator',
            'compound interest fd',
            'quarterly compounding fd',
            'section 194a tds',
            'section 80ttb',
            'fd vs rd',
            'term deposit calculator'
        ],
        formulaDisplay: 'M = P(1 + r/n)^(n·t)  |  Effective Yield = (1 + r/n)^n − 1  |  Simple (<180d): M = P(1 + r·t)',
        calculationStandard: 'Reserve Bank of India (RBI) Rupee Deposit Master Directions & Income Tax Act Section 194A / 80TTB',
        lastUpdated: '2026-10-09'
    },
    {
        id: 'rd-calculator',
        title: 'RD Calculator (Recurring Deposit)',
        name: 'RD Calculator (India), Recurring Deposit Maturity, Interest & Month Table',
        canonicalPath: '/finance/rd-calculator',
        category: 'finance',
        subcategory: 'savings',
        badge: 'Recurring Deposit & IBA Compounding (India)',
        desc: 'Calculate Indian bank Recurring Deposit (RD) maturity corpus, quarterly compound interest under IBA rules, month-by-month table, senior citizen rates (+0.50%), and Section 194A TDS limits across SBI, HDFC, ICICI, and Post Office.',
        keywords: [
            'rd calculator',
            'rd',
            'rd calculator india',
            'india rd calculator',
            'india rd',
            'rd india',
            'recurring deposit calculator',
            'recurring deposit india',
            'recurring deposit',
            'rd interest',
            'rd interest calculator',
            'rd interest rate',
            'recurring deposit interest',
            'recurring deposit interest calculator',
            'sbi rd calculator',
            'hdfc rd calculator',
            'icici rd calculator',
            'post office rd calculator',
            'post office recurring deposit calculator',
            'senior citizen rd calculator',
            'tds on rd calculator',
            'rd maturity calculator',
            'recurring deposit maturity calculator',
            'quarterly compounding rd',
            'monthly deposit calculator',
            'rd vs fd',
            'rd vs sip',
            'section 194a tds on rd'
        ],
        formulaDisplay: 'M = Σ D·(1 + r/4)^(4·(N−k+1)/12)  |  IBA Quarterly Compounding Standard',
        calculationStandard: 'Indian Banks’ Association (IBA) Compounding Standard & RBI Master Direction on Rupee Deposits',
        lastUpdated: '2026-10-09'
    },
    {
        id: 'safe-withdrawal-rate-calculator',
        title: 'Safe Withdrawal Rate Calculator',
        name: 'Safe Withdrawal Rate Calculator (4% Rule), Nest Egg & SWR Matrix',
        canonicalPath: '/finance/safe-withdrawal-rate-calculator',
        category: 'finance',
        subcategory: 'retirement',
        badge: 'Retirement & FIRE Decumulation',
        desc: 'Calculate retirement safe withdrawal rate (SWR), required portfolio nest egg under the 4% Bengen rule, portfolio longevity, 3.0%-5.0% sensitivity matrix, sequence of returns risk, and academic Trinity study context.',
        keywords: [
            'safe withdrawal rate calculator',
            'safe withdrawal rate',
            'swr calculator',
            '4% rule calculator',
            '4 percent rule',
            '4 percent rule calculator',
            'bengen 4% rule',
            'bengen rule',
            'trinity study calculator',
            'retirement withdrawal calculator',
            'retirement decumulation calculator',
            'fire withdrawal calculator',
            'sequence of returns risk',
            'needed portfolio calculator',
            'retirement nest egg calculator',
            'annual spending retirement',
            'portfolio longevity'
        ],
        formulaDisplay: 'Needed Portfolio = Annual Spending / SWR  |  Yearly: Bal_{t+1} = (Bal_t - Withdraw_t) × (1 + r)',
        calculationStandard: 'Bengen (1994) Journal of Financial Planning & Trinity Study (1998 Cooley et al.) Framework',
        lastUpdated: '2026-10-09'
    },
    {
        id: 'coast-fire-calculator',
        title: 'Coast FIRE Calculator',
        name: 'Coast FIRE Calculator, Milestone Number & Portfolio Growth Projection',
        canonicalPath: '/fire-forecaster',
        category: 'finance',
        subcategory: 'retirement',
        badge: 'Retirement Milestone',
        desc: 'Calculate your Coast FIRE number, years to retirement compounding, surplus or deficit gap, age-by-age portfolio trajectory, and savings bridge plan without saving another dollar.',
        keywords: [
            'coast fire calculator',
            'coast fire',
            'coast fi',
            'coast fire number',
            'fire calculator',
            'financial independence retire early',
            'coast fire formula',
            'coast fire net worth',
            'barista fire',
            'retirement milestone',
            'safe withdrawal rate',
            'portfolio growth projection'
        ],
        formulaDisplay: 'Coast Number = FIRE Target / (1 + r)^t  |  FIRE Target = Annual Spending / SWR',
        calculationStandard: 'Compound Growth Discounting & Trinity Study / Bengen Framework',
        lastUpdated: '2026-10-10'
    },
    {
        id: '401k-calculator',
        title: '401(k) Calculator',
        name: '401(k) Retirement Calculator (US), Employer Match & Compound Growth',
        canonicalPath: '/finance/401k-calculator',
        category: 'finance',
        subcategory: 'retirement',
        badge: 'Retirement & 401(k)',
        desc: 'Forecast 401(k) balance at retirement with IRS elective deferral limits ($23,500), age 50+ catch-up ($7,500), SECURE 2.0 catch-up ($11,250), employer match optimization, money left on the table analysis, Roth vs Traditional comparison, and SECURE 2.0 RMD projections.',
        keywords: [
            '401k calculator',
            '401k',
            '401(k)',
            '401(k) calculator',
            '401 k calculator',
            '401k match calculator',
            'employer match calculator',
            'money left on the table',
            'catch up contribution',
            'catch-up contribution',
            'irs 401k limit',
            'elective deferral limit',
            'roth 401k vs traditional',
            'roth 401k',
            'traditional 401k',
            'rmd calculator',
            'required minimum distribution',
            'secure 2.0',
            'retirement calculator',
            'retirement nest egg'
        ],
        formulaDisplay: 'Contr = min(Salary × pct, IRS Limit) | Match = min(Salary × cap, Contr × rate) | Bal_{t+1} = (Bal_t + Contr_t) × (1 + r)',
        calculationStandard: 'IRS 26 U.S.C. § 401(k), IRS Notice 2024-80 / 2025-2026 Limits, SECURE 2.0 Act',
        lastUpdated: '2026-10-13'
    },
    {
        id: 'roth-vs-traditional-calculator',
        title: 'Roth vs Traditional Calculator',
        name: 'Roth vs Traditional Calculator (Equal After-Tax Outlay & Break-Even Tax Rate)',
        canonicalPath: '/finance/roth-vs-traditional-calculator',
        category: 'finance',
        subcategory: 'retirement',
        badge: 'US Retirement & Tax',
        desc: 'Compare pre-tax Traditional and after-tax Roth retirement contributions under an equal after-tax outlay. Compute both end values, net after-tax difference, break-even retirement rate, and review RMDs, IRS income limits, and tax diversification.',
        keywords: [
            'roth vs traditional calculator',
            'roth vs traditional 401k calculator',
            'roth vs traditional ira calculator',
            'equal after-tax outlay',
            'break-even retirement tax rate',
            'pre-tax vs roth',
            'rmd comparison',
            'roth ira income limits',
            'tax diversification retirement'
        ],
        formulaDisplay: 'Trad After-Tax = C(1 + r)^n × (1 - t_ret) | Roth After-Tax = C(1 - t_now)(1 + r)^n | Break-Even: t_ret = t_now',
        calculationStandard: 'Commutative Tax Equivalence Model, IRS Publication 590-A/B, SECURE 2.0 Act',
        lastUpdated: '2026-10-18'
    },
    {
        id: 'rmd-calculator',
        title: 'RMD Calculator',
        name: 'RMD Calculator (Required Minimum Distribution — IRS Pub 590-B & SECURE 2.0)',
        canonicalPath: '/finance/rmd-calculator',
        category: 'finance',
        subcategory: 'retirement',
        badge: 'US Retirement & Tax',
        desc: 'Calculate mandatory IRA and 401(k) Required Minimum Distributions (RMDs), percentage of prior year-end balance, withdrawal deadlines, and SECURE 2.0 penalty rules using IRS Uniform Lifetime (Table III) and Joint Life (Table II) factors.',
        keywords: [
            'rmd calculator',
            'required minimum distribution calculator',
            'irs uniform lifetime table',
            'joint life expectancy table rmd',
            'secure 2.0 rmd age',
            '401k rmd calculator',
            'ira rmd calculator',
            'rmd penalty calculator'
        ],
        formulaDisplay: 'RMD = Prior Dec 31 Balance ÷ IRS Distribution Period (Table III Uniform Lifetime or Table II Joint Life)',
        calculationStandard: 'IRS Publication 590-B (Tables II & III), Treas. Reg. § 1.401(a)(9)-9, SECURE 2.0 Act §§ 107, 302',
        lastUpdated: '2026-10-18'
    },
    {
        id: 'cd-ladder-calculator',
        title: 'CD Ladder Calculator',
        name: 'CD Ladder Calculator, Liquidity Timeline & Blended Yield',
        canonicalPath: '/finance/cd-ladder-calculator',
        category: 'finance',
        subcategory: 'savings',
        badge: 'Fixed Income & Liquidity',
        desc: 'Calculate CD ladder blended APY, maturity timeline, annual interest cashflows, rolling reinvestments into longest terms, and compare ladder vs single lump-sum CDs.',
        keywords: [
            'cd ladder calculator',
            'certificate of deposit ladder',
            'cd laddering strategy',
            'blended apy calculator',
            'cd maturity timeline',
            'cd vs hysa',
            'ladder vs single cd',
            'rolling cd reinvestment',
            'early withdrawal penalty cd'
        ],
        formulaDisplay: 'Rung FV = (Total / n) × (1 + APY)^(term/12)  |  Blended APY = Σ(Principal_i × APY_i) / Total',
        calculationStandard: 'FDIC Federal Deposit Insurance Standards & FINRA Fixed Income Guidelines',
        lastUpdated: '2026-10-09'
    },
    {
        id: 'apy-calculator',
        title: 'APY Calculator',
        name: 'APY Calculator, APR to Effective Yield & Compounding Frequencies',
        canonicalPath: '/finance/apy-calculator',
        category: 'finance',
        subcategory: 'savings',
        badge: 'APR vs APY & Compounding Yield',
        desc: 'Convert nominal APR to effective APY across daily, monthly, or continuous compounding. Compare bank accounts side-by-side and solve reverse nominal interest rates.',
        keywords: [
            'apy calculator',
            'apr to apy calculator',
            'annual percentage yield calculator',
            'effective interest rate calculator',
            'compound interest apy',
            'daily compounding apy',
            'hysa apy calculator',
            'cd apy calculator',
            'compare bank accounts apy'
        ],
        formulaDisplay: 'APY = (1 + r/n)^n − 1  |  Continuous: APY = e^r − 1  |  Reverse: APR = n[(1 + APY)^(1/n) − 1]',
        calculationStandard: 'US Federal Reserve Truth in Savings Act (Regulation DD) & FDIC 12 CFR Part 1030 Standards',
        lastUpdated: '2026-10-08'
    },
    {
        id: 'savings-goal-calculator',
        title: 'Savings Goal Calculator',
        name: 'Savings Goal Calculator, Target Monthly Deposit & Horizon',
        canonicalPath: '/compound-interest-calculator',
        category: 'finance',
        subcategory: 'savings',
        badge: 'Target Savings & Compound Growth',
        desc: 'Calculate exact monthly deposit required to reach any financial goal with current savings, compound interest, optional inflation on the goal, and reverse time mode.',
        keywords: [
            'savings goal calculator',
            'savings calculator',
            'monthly savings calculator',
            'how much to save per month',
            'down payment calculator',
            'college savings goal',
            'target savings planner'
        ],
        formulaDisplay: 'PMT = (Goal − PV(1+i)^n) × i / ((1+i)^n − 1)  |  Reverse: n = ln((Goal·i+PMT)/(PV·i+PMT)) / ln(1+i)',
        calculationStandard: 'Excel TVM PMT/NPER Mathematical Model & FINRA Financial Goal Planning Principles',
        lastUpdated: '2026-10-08'
    },
    {
        id: 'emergency-fund-calculator',
        title: 'Emergency Fund Calculator',
        name: 'Emergency Fund Calculator, Target Buffer & Liquid Allocation',
        canonicalPath: '/finance/emergency-fund-calculator',
        category: 'finance',
        subcategory: 'savings',
        badge: 'Cash Buffer & Target Timeline',
        desc: 'Calculate your ideal emergency fund based on essentials, target months, current savings, and compound yield. Determine funding gap, date reached, and liquid account tiers.',
        keywords: [
            'emergency fund calculator',
            'emergency savings calculator',
            'rainy day fund calculator',
            'emergency fund',
            'liquid savings',
            'how many months emergency fund',
            'safety cushion calculator'
        ],
        formulaDisplay: 'Target = Monthly Essentials × Months  |  Gap = max(0, Target − Current)  |  Months = NPER(r, −PMT, −PV, FV)',
        calculationStandard: 'CFP Board Financial Planning Reserve Standards & CFPB Emergency Reserve Guidelines',
        lastUpdated: '2026-10-08'
    },
    {
        id: 'rule-of-72-calculator',
        title: 'Rule of 72 Calculator',
        name: 'Rule of 72 Calculator, Doubling Time & Inflation Halving',
        canonicalPath: '/finance/rule-of-72-calculator',
        category: 'finance',
        subcategory: 'investing',
        badge: 'Doubling Time & Return Solver',
        desc: 'Calculate investment doubling time, required return rate to double money, exact logarithmic compounding, and inflation purchasing power halving with multi-rate accuracy tables.',
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
        formulaDisplay: 'Approx Years = 72 / r  |  Exact Years = ln(2) / ln(1 + r)  |  Exact Rate = (2^(1/t) − 1) × 100',
        calculationStandard: 'Compound Interest Doubling Law & Luca Pacioli Summa de Arithmetica (1494)',
        lastUpdated: '2026-10-08'
    },
    {
        id: 'inflation-calculator',
        title: 'Inflation Calculator',
        name: 'Inflation Calculator, Purchasing Power & Real Return Analyzer',
        canonicalPath: '/finance/real-rate-of-return-calculator',
        category: 'finance',
        subcategory: 'investing',
        badge: 'Purchasing Power & Real Return',
        desc: 'Calculate future cost of goods, cash purchasing power loss, and exact Fisher equation real investment returns with sourced RBI & US BLS benchmark rates and multi-year milestone timelines.',
        keywords: [
            'inflation calculator',
            'purchasing power calculator',
            'real return calculator',
            'future cost calculator',
            'inflation',
            'real vs nominal return',
            'fisher equation',
            'lost purchasing power',
            'rbi inflation',
            'cpi calculator'
        ],
        formulaDisplay: 'Future Cost = A(1+i)ᵗ  |  Purchasing Power = A/(1+i)ᵗ  |  Real Return = [(1+r)/(1+i)] − 1',
        calculationStandard: 'Reserve Bank of India (RBI) CPI Framework & US BLS Fisher Real Rate Theory',
        lastUpdated: '2026-10-08'
    },
    {
        id: 'appreciation-calculator',
        title: 'Appreciation Calculator',
        name: 'Home, Real Estate & Asset Appreciation Calculator',
        canonicalPath: '/finance/investment-growth-calculator',
        category: 'finance',
        subcategory: 'investing',
        badge: 'Asset Growth',
        desc: 'Calculate the future value, total appreciation gain, and growth percentage of real estate, homes, collectibles, or investments over time with compounding controls.',
        keywords: [
            'appreciation calculator',
            'home appreciation calculator',
            'real estate appreciation',
            'future asset value',
            'property growth calculator',
            'capital gains projection'
        ],
        formulaDisplay: 'Future Value = Initial Value × (1 + r)^t',
        calculationStandard: 'Standard Capital Asset Pricing & Discrete Compounding Growth Models',
        lastUpdated: '2026-10-04'
    },
    {
        id: 'mortgage-affordability-calculator',
        title: 'Mortgage Affordability Calculator',
        name: 'Mortgage Affordability & Home Buying Power Calculator',
        canonicalPath: '/finance/mortgage-affordability-calculator',
        category: 'finance',
        subcategory: 'mortgages',
        badge: 'Affordability & 28/36 Rule',
        desc: 'Calculate how much house you can afford based on income, monthly debts, down payment, 28/36 DTI limits, property taxes, insurance, and mortgage interest rates.',
        keywords: [
            'mortgage affordability calculator',
            'how much house can i afford',
            'home affordability calculator',
            'dti calculator',
            'house affordability',
            '28 36 rule',
            'home buying power'
        ],
        formulaDisplay: 'p = [M - I/12 - H + D·(f + pmi)] / [f + pmi + t/12] where M = min(0.28·G, 0.36·G - debts)',
        calculationStandard: 'Fannie Mae / Freddie Mac Qualified Mortgage DTI Standards (12 CFR Part 1026)',
        lastUpdated: '2026-10-06'
    },
    {
        id: 'mortgage-points-calculator',
        title: 'Mortgage Points Calculator',
        name: 'Mortgage Points & Discount Rate Reduction Calculator',
        canonicalPath: '/finance/mortgage-points-calculator',
        category: 'finance',
        subcategory: 'mortgages',
        badge: 'Discount Points & Break-Even',
        desc: 'Calculate mortgage discount points cost, monthly payment savings, break-even months, comparison vs larger down payment, and IRS tax deduction rules.',
        keywords: [
            'mortgage points calculator',
            'mortgage points',
            'discount points calculator',
            'buying points mortgage',
            'mortgage points break even',
            'points vs down payment',
            'are mortgage points deductible'
        ],
        formulaDisplay: 'Points Cost = Points% × Loan; Break-Even Months = Points Cost / Monthly Savings',
        calculationStandard: 'IRS Publication 936 (Home Mortgage Interest Deduction) & CFPB Loan Terms (12 CFR Part 1026)',
        lastUpdated: '2026-10-06'
    },
    {
        id: 'ltv-calculator',
        title: 'LTV Calculator',
        name: 'Loan-to-Value (LTV) & CLTV Ratio Calculator',
        canonicalPath: '/finance/ltv-calculator',
        category: 'finance',
        subcategory: 'mortgages',
        badge: 'LTV, CLTV & PMI Cancel',
        desc: 'Calculate primary loan-to-value, combined CLTV with HELOCs, net home equity, pay-down needed to reach 80% to drop PMI, and India RBI housing caps.',
        keywords: [
            'ltv calculator',
            'loan to value calculator',
            'cltv calculator',
            'loan to value ratio',
            'how to calculate ltv',
            'cancel pmi ltv',
            'equity calculator',
            'combined loan to value'
        ],
        formulaDisplay: 'LTV = (Primary Loan / Property Value) × 100; CLTV = (Total Loans / Property Value) × 100',
        calculationStandard: 'Homeowners Protection Act of 1998 (12 U.S.C. 4901) & RBI Housing Finance Circulars',
        lastUpdated: '2026-10-06'
    },
    {
        id: 'loan-refinance-calculator',
        title: 'Loan Refinance Calculator',
        name: 'Loan Refinance & Home Loan Balance Transfer Calculator',
        canonicalPath: '/finance/loan-refinance-calculator',
        category: 'finance',
        subcategory: 'loans',
        badge: 'Refinance & Break-Even',
        desc: 'Calculate monthly savings, break-even months, total interest saved, and compare equal vs extended tenure for mortgage refinances and balance transfers.',
        keywords: [
            'loan refinance calculator',
            'home loan balance transfer calculator',
            'mortgage refinance break even',
            'refinance savings',
            'balance transfer',
            'interest delta'
        ],
        formulaDisplay: 'Monthly Savings = EMI_old - EMI_new; Break-Even Months = Fees / Monthly Savings',
        calculationStandard: 'CFPB Truth in Lending Act (12 CFR Part 1026) & RBI Home Loan Transfer Rules',
        lastUpdated: '2026-10-06'
    },
    {
        id: 'credit-card-payoff-calculator',
        title: 'Credit Card Payoff Calculator',
        name: 'Credit Card Payoff & Debt-Free Timeline Calculator',
        canonicalPath: '/finance/credit-card-payoff-calculator',
        category: 'finance',
        subcategory: 'loans',
        badge: 'Credit Card Payoff & APR',
        desc: 'Calculate credit card payoff dates, monthly payment required for target deadlines, total interest paid, extra monthly payment impact, and comparison vs paying minimum only.',
        keywords: [
            'credit card payoff calculator',
            'credit card payoff',
            'payoff credit card',
            'card payoff calculator',
            'credit card interest calculator',
            'minimum payment calculator',
            'how to pay off credit card'
        ],
        formulaDisplay: 'Months n = -ln(1 - B·r/P) / ln(1+r) when P > B·r; Target Payment P = B·r / (1 - (1+r)^-n)',
        calculationStandard: 'CFPB Credit Card Accountability Responsibility and Disclosure Act of 2009 (CARD Act / 12 CFR Part 1026)',
        lastUpdated: '2026-10-06'
    },
    {
        id: 'credit-card-minimum-payment-calculator',
        title: 'Credit Card Minimum Payment Calculator',
        name: 'Credit Card Minimum Payment & Debt Trap Calculator',
        canonicalPath: '/finance/credit-card-minimum-payment-calculator',
        category: 'finance',
        subcategory: 'loans',
        badge: 'Minimum Payment & Debt Trap',
        desc: 'Calculate how long it takes to pay off credit card debt by paying only the minimum payment. See total interest paid, compare with freezing your payment, and explore statutory issuer rules.',
        keywords: [
            'credit card minimum payment calculator',
            'credit card minimum payment',
            'minimum payment calculator',
            'minimum amount due calculator',
            'card minimum payment',
            'minimum payment trap'
        ],
        formulaDisplay: 'Payment_m = max(Floor, %·B_m [+ Interest_m]); B_{m+1} = B_m + Interest_m - Payment_m',
        calculationStandard: 'CFPB CARD Act of 2009 (12 CFR § 1026.7) & RBI Master Direction on Credit Cards',
        lastUpdated: '2026-10-06'
    },
    {
        id: 'car-loan-calculator',
        title: 'Car Loan Calculator',
        name: 'Auto Loan EMI, Sales Tax & 20/4/10 Rule Calculator',
        canonicalPath: '/finance/car-loan-calculator',
        category: 'finance',
        subcategory: 'loans',
        badge: 'Auto & 20/4/10 Rule',
        desc: 'Calculate monthly auto loan payments, sales tax, trade-in equity, total interest, and evaluate the 20/4/10 affordability rule across 36 to 84-month terms.',
        keywords: [
            'car loan calculator',
            'auto loan calculator',
            'car emi',
            '20 4 10 rule',
            'trade in tax credit',
            'negative equity car loan'
        ],
        formulaDisplay: 'Financed = Price + Tax + Fees - Down - TradeIn; EMI = PMT(r, n, -Financed)',
        calculationStandard: 'Truth in Lending Act (12 CFR Part 1026) & CFPB Auto Finance Rules',
        lastUpdated: '2026-10-06'
    },
    {
        id: 'personal-loan-calculator',
        title: 'Personal Loan Calculator',
        name: 'Personal Loan EMI, True APR & Net Disbursal Calculator',
        canonicalPath: '/finance/personal-loan-calculator',
        category: 'finance',
        subcategory: 'loans',
        badge: 'True APR & Fees',
        desc: 'Calculate monthly personal loan EMI, true effective APR including processing fees and GST, net disbursal in hand, and compare two lender offers side by side.',
        keywords: [
            'personal loan calculator',
            'personal loan emi calculator',
            'personal loan apr',
            'processing fee gst',
            'net disbursal',
            'compare loan offers'
        ],
        formulaDisplay: 'True APR = IRR(CashFlows) × 12 where CF_0 = -NetDisbursal, CF_t = EMI',
        calculationStandard: 'Truth in Lending Act (12 CFR Part 1026) & RBI Regulatory Framework',
        lastUpdated: '2026-10-06'
    },
    {
        id: 'debt-payoff-calculator',
        title: 'Debt Payoff Calculator',
        name: 'Debt Payoff Calculator (Avalanche vs Snowball)',
        canonicalPath: '/finance/debt-payoff-calculator',
        category: 'finance',
        subcategory: 'loans',
        badge: 'Avalanche & Snowball',
        desc: 'Compare Debt Avalanche (highest APR first) vs Debt Snowball (lowest balance first) with multi-debt rollover simulations and interest savings.',
        keywords: [
            'debt payoff calculator',
            'debt snowball vs avalanche',
            'debt avalanche',
            'debt snowball',
            'credit card payoff',
            'debt free date'
        ],
        formulaDisplay: 'Payment Rollover: Budget - Σ MinPayments → Priority Debt until Paid',
        calculationStandard: 'Consumer Debt Acceleration & Rollover Model',
        lastUpdated: '2026-10-06'
    },
    {
        id: 'loan-prepayment-calculator',
        title: 'Loan Prepayment Calculator',
        name: 'Loan & Mortgage Prepayment Calculator',
        canonicalPath: '/finance/loan-prepayment-calculator',
        category: 'finance',
        subcategory: 'loans',
        badge: 'Interest Savings',
        desc: 'Calculate exact interest saved and tenure shortened with one-time lump-sum or extra monthly loan prepayments.',
        keywords: [
            'loan prepayment calculator',
            'prepayment calculator',
            'part payment',
            'reduce tenure',
            'reduce emi',
            'save interest'
        ],
        formulaDisplay: 'Savings = TotalInterest(Base) - TotalInterest(Prepayment)',
        calculationStandard: 'CFPB Fixed-Rate Amortization Standard (12 CFR Part 1026)',
        lastUpdated: '2026-10-06'
    },
    {
        id: 'loan-amortization-calculator',
        title: 'Amortization Calculator',
        name: 'Loan & Mortgage Amortization Calculator',
        canonicalPath: '/finance/loan-amortization-calculator',
        category: 'finance',
        subcategory: 'loans',
        badge: 'Amortization Schedule',
        desc: 'Generate complete monthly and annual loan amortization schedules with principal reduction, tipping point analysis, and CSV export.',
        keywords: [
            'amortization calculator',
            'loan schedule',
            'amortization schedule',
            'principal interest table',
            'bi-weekly amortization'
        ],
        formulaDisplay: 'M = P[r(1+r)^n] / [(1+r)^n - 1]',
        calculationStandard: 'CFPB Fixed-Rate Amortization Standard (12 CFR Part 1026)',
        lastUpdated: '2026-10-06'
    },
    {
        id: 'emi-calculator',
        title: 'EMI Calculator',
        name: 'Equated Monthly Installment (EMI) Calculator',
        canonicalPath: '/finance/emi-calculator/in',
        category: 'finance',
        subcategory: 'loans',
        badge: 'Loan Repayment',
        desc: 'Calculate equated monthly installments for personal, auto, and student loans with total interest breakdown.',
        keywords: [
            'emi calculator',
            'loan installment calculator',
            'personal loan emi',
            'car loan calculator',
            'loan repayment'
        ],
        formulaDisplay: 'E = [P × r × (1 + r)^n] / [(1 + r)^n - 1]',
        calculationStandard: 'Standard Amortizing Loan Reduction Model',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'fire-forecaster',
        title: 'FIRE Calculator',
        name: 'Financial Independence, Retire Early (FIRE) Forecaster',
        canonicalPath: '/fire-forecaster',
        category: 'finance',
        subcategory: 'retirement',
        badge: 'FIRE & SWR',
        desc: 'Estimate your FIRE number, safe withdrawal rate (SWR), and timeline to financial independence based on annual expenditures.',
        keywords: [
            'fire calculator',
            'financial independence retire early',
            'safe withdrawal rate',
            '4 percent rule',
            'retirement nest egg'
        ],
        formulaDisplay: 'FIRE Number = Annual Expenses × (1 / SWR) (Standard 25× for 4% Rule)',
        calculationStandard: 'Bengen (1994) & Trinity Study Safe Withdrawal Rate Research',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'global-tax-calculator',
        title: 'Income Tax Calculator',
        name: 'Statutory Income Tax & Progressive Brackets Calculator',
        canonicalPath: '/finance',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'Statutory Tax',
        desc: 'Calculate progressive income taxes, standard deductions, personal allowances, and social insurance levies across major jurisdictions.',
        keywords: [
            'income tax calculator',
            'tax bracket calculator',
            'marginal tax',
            'effective tax rate',
            'statutory deductions'
        ],
        formulaDisplay: 'Tax = Σ [(min(Income, Cap_i) - Base_i) × Rate_i] - Deductions',
        calculationStandard: 'Official Statutory Schedules (IRS, HMRC, CRA, ATO, Income Tax Dept)',
        lastUpdated: '2026-02-15'
    },
    {
        id: 'salary-calculator',
        title: 'Salary Calculator',
        name: 'Gross-to-Net Salary & Paycheck Calculator',
        canonicalPath: '/finance/salary',
        category: 'finance',
        subcategory: 'salary',
        badge: 'Take-Home Pay',
        desc: 'Convert hourly, weekly, bi-weekly, and annual wages to net take-home pay after statutory withholdings.',
        keywords: [
            'salary calculator',
            'take home pay',
            'hourly to salary',
            'paycheck calculator',
            'wage converter'
        ],
        formulaDisplay: 'Net Pay = Gross Earnings - (Income Tax + Social Insurance + Deductions)',
        calculationStandard: 'Standard Payroll Deduction & FLSA Overtime Algorithms',
        lastUpdated: '2026-02-15'
    },
    {
        id: 'us-federal-income-tax-calculator',
        title: 'US Federal Income Tax Calculator',
        name: 'US Federal Income Tax Calculator (2025/2024 Brackets, AGI & Refund/Owed)',
        canonicalPath: '/finance/us-federal-income-tax-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'IRS Rev. Proc. 2024-40',
        desc: 'Calculate 2025 and 2024 US Federal Income Tax across all 7 IRS brackets, AGI, standard vs itemized deductions, tax credits, marginal vs effective rates, and refund or balance owed.',
        keywords: ['us federal income tax calculator', 'federal tax calculator', 'irs tax brackets 2025', 'marginal vs effective tax rate', 'tax refund calculator'],
        formulaDisplay: 'AGI = Income − PreTax ; Taxable = max(0, AGI − Deduction) ; Net Tax = max(0, Σ Bracket_i − Credits)',
        calculationStandard: 'IRS Revenue Procedure 2024-40 (2025) & Rev. Proc. 2023-34 (2024)',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'us-state-take-home-calculator',
        title: 'US State Take-Home Calculator',
        name: 'US State Take-Home Paycheck Calculator (Federal + FICA + State Tax)',
        canonicalPath: '/finance/us-state-take-home-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: '50-State Paycheck Engine',
        desc: 'Calculate net take-home pay per year, month, bi-weekly, and hour across CA, NY, TX, FL, WA, and US states after Federal income tax, FICA, and state payroll taxes.',
        keywords: ['us state take home calculator', 'paycheck calculator', 'california paycheck calculator', 'new york paycheck calculator', 'texas take home pay'],
        formulaDisplay: 'Net = Gross − PreTax − FedTax − FICA(SS 6.2% + Med 1.45% + AddMed 0.9%) − StateTax − SDI',
        calculationStandard: 'IRS Rev. Proc. 2024-40, SSA 2025 Wage Base ($176,100) & State Revenue Schedules',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'self-employment-tax-calculator',
        title: 'Self-Employment Tax Calculator',
        name: 'Self-Employment Tax Calculator (Schedule SE & Quarterly 1040-ES)',
        canonicalPath: '/finance/self-employment-tax-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'IRS Schedule SE',
        desc: 'Calculate 15.3% IRS Schedule SE self-employment tax on 92.35% of net profit, W-2 Social Security cap coordination, 50% AGI deduction, and quarterly 1040-ES vouchers.',
        keywords: ['self employment tax calculator', '1099 tax calculator', 'schedule se calculator', 'quarterly estimated tax calculator'],
        formulaDisplay: 'SE Earnings = 0.9235 × Profit ; SE Tax = 12.4% SS (up to $176.1k) + 2.9% Medicare + 0.9% Addl',
        calculationStandard: 'IRS Schedule SE (Form 1040) & Form 1040-ES Safe-Harbor Rules',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'capital-gains-tax-calculator',
        title: 'Capital Gains Tax Calculator (US)',
        name: 'US Capital Gains Tax Calculator (Short-Term vs Long-Term & 3.8% NIIT)',
        canonicalPath: '/finance/capital-gains-tax-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'IRS Pub 550 & NIIT',
        desc: 'Calculate short-term and long-term capital gains tax (0%, 15%, 20%), 3.8% Net Investment Income Tax (NIIT), exact holding period, and $3,000 capital loss deduction.',
        keywords: ['capital gains tax calculator', 'long term capital gains calculator', 'short term capital gains', 'niit calculator', 'stock tax calculator'],
        formulaDisplay: 'Gain = Sale − Fees − Cost ; Held > 365d → LTCG (0%/15%/20%) + 3.8% NIIT above MAGI threshold',
        calculationStandard: 'IRS Publication 550, IRC § 1(h) & § 1411 Net Investment Income Tax',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'india-capital-gains-tax-calculator',
        title: 'India Capital Gains Tax Calculator',
        name: 'India Capital Gains Tax Calculator (Sec 112A 12.5% LTCG & Sec 111A 20% STCG)',
        canonicalPath: '/finance/india-capital-gains-tax-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'Finance Act (No. 2) 2024',
        desc: 'Calculate India LTCG (12.5% above ₹1.25 Lakh exemption) and STCG (20%) on listed equity, equity mutual funds, and real estate with 4% cess.',
        keywords: ['india capital gains tax calculator', 'ltcg calculator india', 'stcg calculator', 'section 112a 12.5%'],
        formulaDisplay: 'Listed Equity LTCG = max(0, Gain − ₹1,25,000) × 12.5% × 1.04 ; STCG = Gain × 20% × 1.04',
        calculationStandard: 'Income Tax Act 1961 Sections 111A, 112 & 112A (Finance Act No. 2, 2024)',
        lastUpdated: '2026-10-20'
    },
    {
        id: '1099-vs-w2-calculator',
        title: '1099 vs W-2 Calculator',
        name: '1099 Contractor vs W-2 Employee Total Compensation & Break-Even Calculator',
        canonicalPath: '/finance/1099-vs-w2-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'Bisection Break-Even Solver',
        desc: 'Compare 1099 independent contractor and W-2 employee after-tax income and benefits side-by-side, and solve for the exact break-even 1099 gross and hourly rate.',
        keywords: ['1099 vs w2 calculator', 'contractor vs employee calculator', 'break even 1099 hourly rate', 'w2 to 1099 converter'],
        formulaDisplay: 'Solve Gross_1099 such that Net_1099(Gross_1099) = Net_W2(Salary_W2) + Benefits_W2',
        calculationStandard: 'IRS Publication 15-T, Schedule SE & Bisection Root-Finding Equivalence',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'uk-paye-calculator',
        title: 'UK PAYE Calculator',
        name: 'UK PAYE Income Tax, National Insurance & Take-Home Pay Calculator',
        canonicalPath: '/finance/uk-paye-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'HMRC 2025/26 & Scotland',
        desc: 'Calculate UK take-home pay across England/NI/Wales and Scotland (6 bands) with £12,570 Personal Allowance taper above £100k, Class 1 NI (8%/2%), pension, and Student Loan Plans 1/2/4/5/PG.',
        keywords: ['uk paye calculator', 'uk tax calculator', 'take home pay calculator uk', 'scottish income tax calculator', 'national insurance calculator'],
        formulaDisplay: 'PA = max(0, £12,570 − max(0, ANI − £100,000)/2) ; Net = Gross − Pension − Tax − Class1_NI − StudentLoan',
        calculationStandard: 'HMRC 2025/26 & 2024/25 Rates and Thresholds (GOV.UK)',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'canada-income-tax-calculator',
        title: 'Canada Income Tax Calculator',
        name: 'Canada Federal & Provincial Income Tax, CPP/CPP2 & EI Calculator',
        canonicalPath: '/finance/canada-income-tax-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'CRA 2025 (ON, BC, AB)',
        desc: 'Calculate 2025 Canadian net take-home pay, Federal and Provincial income tax (Ontario, BC, Alberta), RRSP deductions, Basic Personal Amount credits, CPP, CPP2, and EI.',
        keywords: ['canada income tax calculator', 'ontario tax calculator', 'bc tax calculator', 'alberta tax calculator', 'cpp2 calculator'],
        formulaDisplay: 'Net = Gross − RRSP − FedTax − ProvTax − CPP − CPP2 − EI',
        calculationStandard: 'Canada Revenue Agency (CRA) 2025 T4127 Payroll Deductions Formulas',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'india-income-tax-calculator',
        title: 'India Income Tax Calculator',
        name: 'India Income Tax Calculator (FY 2025-26 & 2024-25 New vs Old Regime)',
        canonicalPath: '/finance/india-income-tax-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'Section 115BAC & 87A Rebate',
        desc: 'Compare India New vs Old Tax Regime for FY 2025-26 (Budget 2025 ₹12L Rebate) and FY 2024-25 side-by-side, including Section 87A marginal relief, 4% cess, and break-even deductions.',
        keywords: ['india income tax calculator', 'new vs old tax regime calculator', 'fy 2025 26 tax calculator', 'section 115bac', '87a rebate 12 lakh'],
        formulaDisplay: 'Tax = (SlabTax − Rebate_87A + Surcharge) × 1.04 (Health & Education Cess)',
        calculationStandard: 'Income Tax Department of India (CBDT) — Finance Act 2025 & 2024',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'hra-exemption-calculator',
        title: 'HRA Exemption Calculator',
        name: 'HRA Exemption Calculator (India Section 10(13A) & Rule 2A)',
        canonicalPath: '/finance/hra-exemption-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'Section 10(13A) Rule 2A',
        desc: 'Calculate tax-exempt and taxable House Rent Allowance (HRA) under Section 10(13A) across all three statutory Rule 2A limits for Metro (50%) and Non-Metro (40%) cities.',
        keywords: ['hra exemption calculator', 'hra calculator india', 'section 10 13a calculator', 'house rent allowance exemption'],
        formulaDisplay: 'Exempt HRA = min(HRA Received, Rent − 10% × Basic+DA, 50% or 40% × Basic+DA)',
        calculationStandard: 'Income Tax Act 1961 Section 10(13A) & Income Tax Rule 2A',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'germany-income-tax-calculator',
        title: 'Germany Income Tax Calculator',
        name: 'Germany Income Tax & Social Security Calculator (§ 32a EStG 2025)',
        canonicalPath: '/finance/germany-income-tax-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'BMF § 32a EStG 2025',
        desc: 'Calculate 2025 German net salary after § 32a EStG polynomial income tax zones, €12,096 Grundfreibetrag, and statutory pension, health, unemployment, and care insurance.',
        keywords: ['germany income tax calculator', 'brutto netto rechner', 'german tax calculator 2025'],
        formulaDisplay: 'Net = Gross − Sozialversicherung − ESt(§ 32a EStG) − Solidaritätszuschlag',
        calculationStandard: 'German Federal Ministry of Finance (BMF) — § 32a EStG 2025',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'france-income-tax-calculator',
        title: 'France Income Tax Calculator',
        name: 'France Income Tax & Cotisations Sociales Calculator (DGFiP 2025)',
        canonicalPath: '/finance/france-income-tax-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'DGFiP Barème 2025',
        desc: 'Calculate 2025 French net salary after ~22% Cotisations Sociales, 10% Abattement pour frais professionnels, Quotient Familial parts, and DGFiP progressive tax bands.',
        keywords: ['france income tax calculator', 'impot sur le revenu 2025', 'salaire brut en net'],
        formulaDisplay: 'Net Imposable = Gross × (1 − 0.22) ; Tax = Parts × Barème(Taxable / Parts)',
        calculationStandard: 'Direction Générale des Finances Publiques (DGFiP) — 2025 Schedule',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'uae-income-tax-calculator',
        title: 'UAE Income Tax Calculator',
        name: 'UAE Salary & GPSSA Pension Calculator (0% Personal Income Tax)',
        canonicalPath: '/finance/uae-income-tax-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'UAE MoF & GPSSA 2025',
        desc: 'Calculate 2025 UAE net salary with 0% personal income tax for expatriates and 5% statutory GPSSA social security contributions for UAE Nationals.',
        keywords: ['uae income tax calculator', 'dubai salary calculator', 'uae tax calculator'],
        formulaDisplay: 'Personal Income Tax = 0% ; GPSSA (UAE Nationals) = 5% up to AED 50,000/mo cap',
        calculationStandard: 'UAE Ministry of Finance & Federal Tax Authority (FTA) 2025',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'singapore-income-tax-calculator',
        title: 'Singapore Income Tax Calculator',
        name: 'Singapore Resident Income Tax & CPF Calculator (IRAS YA 2025)',
        canonicalPath: '/finance/singapore-income-tax-calculator',
        category: 'finance',
        subcategory: 'taxes',
        badge: 'IRAS YA 2025 & CPF',
        desc: 'Calculate Singapore net take-home salary after 20% employee CPF contributions (capped at S$88,800/yr) and IRAS YA 2025 progressive resident income tax bands (0% to 24%).',
        keywords: ['singapore income tax calculator', 'iras tax calculator', 'cpf calculator singapore'],
        formulaDisplay: 'Chargeable = Gross − CPF(20%) − EarnedIncomeRelief ; Tax = Σ IRAS Progressive Bands',
        calculationStandard: 'Inland Revenue Authority of Singapore (IRAS) YA 2025 & CPF Board',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'salary-to-hourly-calculator',
        title: 'Salary to Hourly Calculator',
        name: 'Salary to Hourly & Pay Period Converter (2,080-Hour Standard)',
        canonicalPath: '/finance/salary-to-hourly-calculator',
        category: 'finance',
        subcategory: 'salary',
        badge: 'All 7 Pay Periods',
        desc: 'Convert annual salary to hourly wage (or hourly to annual) across hourly, daily, weekly, bi-weekly, semi-monthly, monthly, and annual pay periods with unpaid leave and PTO adjustments.',
        keywords: ['salary to hourly calculator', 'hourly to salary calculator', '2080 hours calculator', 'annual to hourly wage'],
        formulaDisplay: 'Hourly = Annual / (Hours/Week × Paid Weeks) ; Standard Year = 40 × 52 = 2,080 Hours',
        calculationStandard: 'US Bureau of Labor Statistics (BLS) 2,080-Hour Full-Time Standard',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'take-home-pay-calculator',
        title: 'Take-Home Pay Calculator',
        name: 'Take-Home Pay Calculator (US Paycheck & India CTC Modes)',
        canonicalPath: '/finance/take-home-pay-calculator',
        category: 'finance',
        subcategory: 'salary',
        badge: 'US & India Dual Engine',
        desc: 'Calculate exact monthly and bi-weekly take-home pay after Federal/State income tax, FICA, 401(k)/HSA, or India CTC-to-In-Hand EPF, Professional Tax, and TDS deductions.',
        keywords: ['take home pay calculator', 'net pay calculator', 'paycheck calculator', 'salary after tax calculator'],
        formulaDisplay: 'Net Pay = Gross − PreTax Deductions − Income Tax − Payroll Levies (FICA / EPF+PT)',
        calculationStandard: 'IRS Rev. Proc. 2024-40 & CBDT / EPFO Payroll Standards',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'in-hand-salary-calculator',
        title: 'In-Hand Salary Calculator (India)',
        name: 'India CTC to Monthly In-Hand Salary Calculator (EPF, PT & TDS)',
        canonicalPath: '/finance/in-hand-salary-calculator',
        category: 'finance',
        subcategory: 'salary',
        badge: 'India CTC Breakdown',
        desc: 'Convert annual Cost-to-Company (CTC) into monthly in-hand take-home salary after Employer & Employee EPF (12% or ₹1,800 ceiling), Gratuity (4.81%), State Professional Tax, and New/Old Regime TDS.',
        keywords: ['in hand salary calculator', 'ctc to in hand salary calculator', 'take home salary calculator india', 'pf gratuity tds calculator'],
        formulaDisplay: 'Monthly In-Hand = (Gross Salary − Employee PF − Annual TDS − Professional Tax) ÷ 12',
        calculationStandard: 'EPF Act 1952, Payment of Gratuity Act 1972 & Income Tax Act 1961',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'overtime-pay-calculator',
        title: 'Overtime Pay Calculator',
        name: 'Overtime Pay Calculator (FLSA 1.5x, California Double-Time & India Factories Act)',
        canonicalPath: '/finance/overtime-pay-calculator',
        category: 'finance',
        subcategory: 'salary',
        badge: 'FLSA 1.5x & 2.0x',
        desc: 'Calculate regular pay, 1.5x time-and-a-half pay, 2.0x double-time pay, total weekly gross, and effective hourly rate under US FLSA, California daily rules, and India 2x rules.',
        keywords: ['overtime pay calculator', 'time and a half calculator', 'double time calculator', 'flsa overtime calculator'],
        formulaDisplay: 'Gross = (RegHrs × Rate) + (OT_1.5 × Rate × 1.5) + (OT_2.0 × Rate × 2.0)',
        calculationStandard: 'US Fair Labor Standards Act (29 U.S.C. § 207) & CA Labor Code § 510',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'pay-raise-calculator',
        title: 'Pay Raise Calculator',
        name: 'Pay Raise & Real Inflation-Adjusted Salary Increase Calculator',
        canonicalPath: '/finance/pay-raise-calculator',
        category: 'finance',
        subcategory: 'salary',
        badge: 'Fisher Real Raise',
        desc: 'Calculate new pay across hourly, weekly, bi-weekly, monthly, and annual periods after a percentage raise or target salary, including Fisher inflation-adjusted real raise and multi-year compounding.',
        keywords: ['pay raise calculator', 'salary increase calculator', 'raise percentage calculator', 'real wage increase inflation'],
        formulaDisplay: 'New = Old × (1 + Raise) ; Real Raise = [(1 + Raise) / (1 + Inflation)] − 1',
        calculationStandard: 'Irving Fisher Real Wage Purchasing Power Identity',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'bonus-tax-calculator',
        title: 'Bonus Tax Calculator',
        name: 'Bonus Tax Calculator (22% Flat Supplemental vs Aggregate Method)',
        canonicalPath: '/finance/bonus-tax-calculator',
        category: 'finance',
        subcategory: 'salary',
        badge: 'IRS Pub 15 (22% / 37%)',
        desc: 'Calculate net bonus check after IRS 22% flat supplemental withholding (37% above $1M) vs aggregate withholding, FICA, state supplemental tax, and year-end true tax reconciliation.',
        keywords: ['bonus tax calculator', 'how are bonuses taxed', '22% supplemental tax rate', 'net bonus calculator'],
        formulaDisplay: 'Withholding (≤$1M) = 22% × Bonus ; Actual Tax = Tax(Salary + Bonus) − Tax(Salary)',
        calculationStandard: 'IRS Publication 15 (Circular E) & Treas. Reg. § 31.3402(g)-1',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'margin-calculator',
        title: 'Margin Calculator',
        name: 'Gross Margin, Revenue & Cost 2-of-3 Solver',
        canonicalPath: '/finance/margin-calculator',
        category: 'finance',
        subcategory: 'business',
        badge: 'Any-2-of-3 Solver',
        desc: 'Enter any two of Cost, Revenue/Selling Price, or Gross Margin % to solve for the third, along with Gross Profit ($), equivalent Markup %, and the Margin vs Markup reference table.',
        keywords: ['margin calculator', 'gross margin calculator', 'selling price from margin', 'margin vs markup'],
        formulaDisplay: 'Margin = (Price − Cost) / Price ; Price = Cost / (1 − Margin) ; Markup = Margin / (1 − Margin)',
        calculationStandard: 'GAAP / IFRS Gross Profit & Retail Merchandising Standards',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'markup-calculator',
        title: 'Markup Calculator',
        name: 'Markup to Selling Price & Gross Margin Calculator (with Discount & Tax)',
        canonicalPath: '/finance/markup-calculator',
        category: 'finance',
        subcategory: 'business',
        badge: 'Cost + Markup Engine',
        desc: 'Calculate selling price, unit profit, and equivalent gross margin % from cost and markup % (or reverse), with promotional discount % and sales tax/GST pass-through.',
        keywords: ['markup calculator', 'cost to price calculator', 'markup to margin converter', 'keystone markup'],
        formulaDisplay: 'Price = Cost × (1 + Markup) ; Margin = Markup / (1 + Markup)',
        calculationStandard: 'Standard Cost-Plus Pricing & Retail Merchandising Formulas',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'break-even-calculator',
        title: 'Break-Even Calculator',
        name: 'Break-Even Point (BEP), Contribution Margin & Target Profit Calculator',
        canonicalPath: '/finance/break-even-calculator',
        category: 'finance',
        subcategory: 'business',
        badge: 'CVP & Margin of Safety',
        desc: 'Calculate Break-Even Point (BEP) in units and revenue, contribution margin ratio, units needed for target profit, margin of safety, and ±10% price sensitivity.',
        keywords: ['break even calculator', 'break even point calculator', 'contribution margin calculator', 'margin of safety calculator'],
        formulaDisplay: 'CM = Price − VariableCost ; BEP_Units = FixedCosts / CM ; Target_Units = (Fixed + Profit) / CM',
        calculationStandard: 'Institute of Management Accountants (IMA) Cost-Volume-Profit (CVP) Standard',
        lastUpdated: '2026-10-20'
    },
    {
        id: 'profit-margin-calculator',
        title: 'Profit Margin Calculator',
        name: 'Profit Margin Calculator (Gross, EBITDA, Operating & Net Margin + Damodaran Benchmarks)',
        canonicalPath: '/finance/profit-margin-calculator',
        category: 'finance',
        subcategory: 'business',
        badge: 'NYU Stern Benchmarks',
        desc: 'Calculate Gross Margin, EBITDA Margin, Operating (EBIT) Margin, and Net Profit Margin with an interactive P&L waterfall and cited NYU Stern (Damodaran) sector benchmarks.',
        keywords: ['profit margin calculator', 'net profit margin calculator', 'operating margin calculator', 'ebitda margin', 'industry profit margins'],
        formulaDisplay: 'Gross = (Rev−COGS)/Rev ; Operating = (Rev−COGS−OPEX)/Rev ; Net = NetProfit/Rev',
        calculationStandard: 'GAAP/IFRS Income Statement & NYU Stern (Aswath Damodaran) Jan 2025 Dataset',
        lastUpdated: '2026-10-20'
    },
    // --- TIME & DATE SUITE ---
    {
        id: 'age-calculator',
        title: 'Age Calculator',
        name: 'Chronological Age & Milestone Calculator',
        canonicalPath: '/age-calculator',
        category: 'time-date',
        subcategory: 'calendar',
        badge: 'Exact Age in Days',
        desc: 'Calculate chronological age in years, months, days, hours, and minutes with leap year adjustment and milestone forecasts.',
        keywords: [
            'age calculator',
            'how old am i',
            'exact age calculator',
            'age in days',
            'chronological age'
        ],
        formulaDisplay: 'Δt = Date(Target) - Date(Birth) with Gregorian Leap Year Calendar Compensation',
        calculationStandard: 'ISO 8601 Calendar & Gregorian Intercalary Cycle',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'work-hours',
        title: 'Work Hours Calculator',
        name: 'Work Hours, Timesheet & Overtime Calculator',
        canonicalPath: '/time-duration-calculator',
        category: 'time-date',
        subcategory: 'work-time',
        badge: 'Timesheet & FLSA',
        desc: 'Track daily shifts, unpaid lunch deductions, total weekly hours, and 1.5× overtime pay according to labor standards.',
        keywords: [
            'work hours calculator',
            'timesheet calculator',
            'overtime calculator',
            'flsa work hours',
            'clock in clock out'
        ],
        formulaDisplay: 'Gross Hours = Σ(ClockOut - ClockIn) - Deductible Breaks; OT = max(0, Hours - 40)',
        calculationStandard: 'US Fair Labor Standards Act (FLSA 29 CFR Part 778)',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'date-difference-calculator',
        title: 'Date Difference Calculator',
        name: 'Days Between Dates & Difference Calculator',
        canonicalPath: '/date-difference-calculator',
        category: 'time-date',
        subcategory: 'calendar',
        badge: 'Calendar Span',
        desc: 'Calculate the exact number of days, weeks, months, and business days between any two dates in history or the future.',
        keywords: [
            'date difference calculator',
            'days between dates',
            'days counter',
            'how many days between',
            'calendar duration'
        ],
        formulaDisplay: 'Span = |TargetDate - BaseDate| in milliseconds converted to solar days (86,400 s/day)',
        calculationStandard: 'Gregorian Calendar Astronomical Algorithm',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'countdown-timer',
        title: 'Countdown Timer',
        name: 'Live Countdown Timer & Event Chronometer',
        canonicalPath: '/date-difference-calculator',
        category: 'time-date',
        subcategory: 'timers',
        badge: 'Live Ticking Clock',
        desc: 'Create accurate down-to-the-second countdowns for deadlines, exams, birthdays, and product launches with sound notifications.',
        keywords: [
            'countdown timer',
            'online countdown',
            'timer with seconds',
            'event countdown',
            'stopwatch and timer'
        ],
        formulaDisplay: 'T_remaining = max(0, TargetEpoch - CurrentEpoch)',
        calculationStandard: 'W3C High Resolution Time & Performance API',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'event-countdown',
        title: 'Event Countdown',
        name: 'Event Countdown & Milestone Chronometer',
        canonicalPath: '/date-difference-calculator',
        category: 'time-date',
        subcategory: 'timers',
        badge: 'Milestone Tracker',
        desc: 'Track exact days and hours left until weddings, vacations, retirement, or milestones with business days filtering.',
        keywords: [
            'event countdown',
            'wedding countdown',
            'vacation countdown',
            'days until event',
            'milestone tracker'
        ],
        formulaDisplay: 'Days_left = ceil((EventDate - Now) / 86400000)',
        calculationStandard: 'Gregorian Astronomical Calendar Standards',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'focus-and-break-timers',
        title: 'Focus & Break Timer',
        name: 'Pomodoro & 52/17 Focus & Break Timer',
        canonicalPath: '/time-duration-calculator',
        category: 'time-date',
        subcategory: 'timers',
        badge: 'Pomodoro & 52/17',
        desc: 'Optimize cognitive focus and mental recovery using classic 25/5 Pomodoro intervals and 52/17 desk rhythms.',
        keywords: [
            'focus timer',
            'pomodoro timer',
            '52 17 timer',
            'break timer',
            'productivity timer'
        ],
        formulaDisplay: 'Work Block: 25/50/52 min; Break Block: 5/10/17 min cyclically scheduled',
        calculationStandard: 'Ergonomic Desk Productivity Studies & Pomodoro Technique Standard',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'retirement-countdown',
        title: 'Retirement Countdown',
        name: 'Retirement Countdown in Workdays & Shifts',
        canonicalPath: '/date-difference-calculator',
        category: 'time-date',
        subcategory: 'calendar',
        badge: 'Workdays to Retirement',
        desc: 'Calculate exact remaining workdays, shifts, and working hours until retirement after factoring in PTO balance and paid holidays.',
        keywords: [
            'retirement countdown in workdays',
            'workdays until retirement',
            'retirement shift counter',
            'final working day',
            'pto deduction'
        ],
        formulaDisplay: 'Net Workdays = Total Calendar Workdays - Annual PTO - Statutory Paid Holidays',
        calculationStandard: 'Standard Shift Scheduling & BLS Annual Workday Metrics',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'add-subtract-time-calculator',
        title: 'Add or Subtract Time Calculator',
        name: 'Time Addition & Subtraction Calculator',
        canonicalPath: '/time-duration-calculator',
        category: 'time-date',
        subcategory: 'calendar',
        badge: 'Time Arithmetic',
        desc: 'Add or subtract days, hours, minutes, and seconds from any date and time with 24-hour rollover precision.',
        keywords: [
            'add time calculator',
            'subtract time calculator',
            'time math',
            'date plus hours',
            'time addition and subtraction'
        ],
        formulaDisplay: 'T_final = T_base ± (Δd × 86400 + Δh × 3600 + Δm × 60 + Δs)',
        calculationStandard: 'Sexagesimal (Base-60) Mathematical Arithmetic & ISO 8601',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'military-time-converter',
        title: 'Military Time Converter',
        name: 'Military Time & 24-Hour Clock Converter',
        canonicalPath: '/date-time',
        category: 'time-date',
        subcategory: 'calendar',
        badge: '24-Hour & NATO DTG',
        desc: 'Convert between 12-hour civilian time, 24-hour military notation, NATO phonetic pronunciation, and Date-Time Groups (DTG).',
        keywords: [
            'military time converter',
            '24 hour time converter',
            'nato phonetic time',
            'date time group dtg',
            'civilian to military time'
        ],
        formulaDisplay: 'PM Hours = 12:00 PM to 11:59 PM → Add 12 to hour (except 12:00 PM = 1200); AM Hours = 12:00 AM → 0000',
        calculationStandard: 'STANAG 2211 & ACP 121(I) International Defense Standards',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'unix-timestamp-converter',
        title: 'Unix Timestamp Converter',
        name: 'Unix Epoch Time & Timestamp Converter',
        canonicalPath: '/date-time',
        category: 'time-date',
        subcategory: 'calendar',
        badge: 'POSIX Epoch Seconds',
        desc: 'Convert Unix epoch timestamps (seconds and milliseconds) to human-readable UTC and local date formats.',
        keywords: [
            'unix timestamp converter',
            'epoch time',
            'posix timestamp',
            'timestamp to date',
            'epoch converter'
        ],
        formulaDisplay: 'Timestamp = Seconds elapsed since 1970-01-01 00:00:00 UTC (excluding leap seconds)',
        calculationStandard: 'POSIX.1-2017 (IEEE Std 1003.1-2017)',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'julian-day-calculator',
        title: 'Julian Day Calculator',
        name: 'Julian Day Number (JDN) & Modified Julian Date (MJD) Calculator',
        canonicalPath: '/date-difference-calculator',
        category: 'time-date',
        subcategory: 'astronomy',
        badge: 'Astronomical JDN',
        desc: 'Calculate Julian Day Numbers (JDN), Modified Julian Dates (MJD), and day of year with astronomical ephemeris precision.',
        keywords: [
            'julian day calculator',
            'julian day number',
            'jdn',
            'mjd',
            'modified julian date',
            'astronomical day of year'
        ],
        formulaDisplay: 'JDN = [367Y - 7(Y + (M + 9)/12)/4 + 275M/9 + D + 1721013.5]',
        calculationStandard: 'IERS Conventions & Astronomical Algorithms (Meeus, 1998)',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'leap-year-calculator',
        title: 'Leap Year Calculator',
        name: 'Leap Year Validator & 400-Year Cycle Counter',
        canonicalPath: '/date-difference-calculator',
        category: 'time-date',
        subcategory: 'calendar',
        badge: 'Gregorian Intercalary',
        desc: 'Verify whether any year is a leap year under the Gregorian 400-year cycle rule and count intercalary days between dates.',
        keywords: [
            'leap year calculator',
            'is it a leap year',
            'next leap year',
            'february 29',
            '400 year cycle'
        ],
        formulaDisplay: 'IsLeap = (Year mod 4 == 0 AND Year mod 100 != 0) OR (Year mod 400 == 0)',
        calculationStandard: 'Papal Bull Inter Gravissimas (1582) & ISO 8601 Calendar Rules',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'running-pace-calculator',
        title: 'Running Pace Calculator',
        name: 'Running Pace, Lap Splits & Race Finish Estimator',
        canonicalPath: '/time-duration-calculator',
        category: 'time-date',
        subcategory: 'calendar',
        badge: 'Splits & Finish Time',
        desc: 'Calculate your required running pace per mile or kilometer for 5K, 10K, half marathon, and full marathon finish targets.',
        keywords: [
            'running pace calculator',
            'pace per mile',
            '5k pace',
            'marathon pace calculator',
            'lap splits estimator'
        ],
        formulaDisplay: 'Pace = Total Time / Total Distance; Time = Pace × Distance',
        calculationStandard: 'World Athletics Standard Track & Field Measurement Standards',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'pet-age-converter',
        title: 'Pet Age Converter',
        name: 'Dog & Cat Age in Human Years Calculator',
        canonicalPath: '/age-calculator',
        category: 'time-date',
        subcategory: 'calendar',
        badge: 'Epigenetic Clock',
        desc: 'Convert canine and feline chronological ages to physiological human years using canine DNA methylation epigenetic algorithms.',
        keywords: [
            'dog age calculator',
            'cat age calculator',
            'dog years to human years',
            'pet age in human years'
        ],
        formulaDisplay: 'Human Age = 16 × ln(Dog Age) + 31 (UC San Diego Canine Epigenetics Model)',
        calculationStandard: 'Wang et al. (2020) Quantitative Translation of Dog-to-Human Aging (Cell Systems)',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'moon-phase-calculator',
        title: 'Moon Phase Calculator',
        name: 'Moon Phase, Lunar Illumination & Cycle Calculator',
        canonicalPath: '/date-time',
        category: 'time-date',
        subcategory: 'astronomy',
        badge: 'Synodic Month',
        desc: 'Calculate the current moon phase, percentage illumination, and dates of the next full, new, and quarter moons.',
        keywords: [
            'moon phase calculator',
            'current moon phase',
            'lunar illumination',
            'next full moon date',
            'synodic lunar cycle'
        ],
        formulaDisplay: 'Lunar Age = (JDN - KnownNewMoonJDN) mod 29.53058867 days',
        calculationStandard: 'US Naval Observatory (USNO) Astronomical Ephemeris',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'solar-eclipse-calculator',
        title: 'Solar Eclipse Calculator',
        name: 'Solar Eclipse Path & Geometry Calculator',
        canonicalPath: '/date-time',
        category: 'time-date',
        subcategory: 'astronomy',
        badge: 'Saros Series',
        desc: 'Compute solar eclipse contacts, totality durations, Saros cycle numbers, and solar filter requirements.',
        keywords: [
            'solar eclipse calculator',
            'solar eclipse totality',
            'saros cycle',
            'eclipse path and duration'
        ],
        formulaDisplay: 'Besselian Elements & Umbral Geometry Calculations',
        calculationStandard: 'NASA Eclipse Ephemeris & ISO 12312-2 Eye Safety Standards',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'sunrise-sunset-calculator',
        title: 'Sunrise Sunset Calculator',
        name: 'Sunrise, Sunset & Solar Noon Ephemeris',
        canonicalPath: '/date-time',
        category: 'time-date',
        subcategory: 'astronomy',
        badge: 'Solar Zenith',
        desc: 'Calculate precise sunrise, sunset, solar noon, and civil dawn times based on geographic latitude and longitude coordinates.',
        keywords: [
            'sunrise sunset calculator',
            'solar noon calculator',
            'daylight hours',
            'civil twilight dawn'
        ],
        formulaDisplay: 'cos(ω) = (sin(a) - sin(φ)sin(δ)) / (cos(φ)cos(δ)) where a = -0.833°',
        calculationStandard: 'NOAA Solar Calculation Algorithm (Jean Meeus Astronomical Algorithms)',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'equinox-solstice-calculator',
        title: 'Equinox & Solstice Calculator',
        name: 'Equinox & Solstice Astronomical Calculator',
        canonicalPath: '/date-time',
        category: 'time-date',
        subcategory: 'astronomy',
        badge: 'Solar Declination',
        desc: 'Calculate the exact astronomical timestamps for the vernal equinox, summer solstice, autumnal equinox, and winter solstice.',
        keywords: [
            'equinox calculator',
            'solstice calculator',
            'first day of spring timestamp',
            'summer solstice date'
        ],
        formulaDisplay: 'Apparent Ecliptic Longitude λ = 0° (Vernal), 90° (Summer), 180° (Autumnal), 270° (Winter)',
        calculationStandard: 'VSOP87 Planetary Theory & Bureau des Longitudes',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'day-night-world-map',
        title: 'Day and Night World Map',
        name: 'Live Solar Terminator & Day-Night World Map',
        canonicalPath: '/date-time',
        category: 'time-date',
        subcategory: 'astronomy',
        badge: 'Solar Terminator',
        desc: 'Interactive world map illustrating the live solar terminator, subsolar point, and regions experiencing daylight versus darkness.',
        keywords: [
            'day night world map',
            'solar terminator map',
            'daylight map',
            'subsolar point live'
        ],
        formulaDisplay: 'Terminator Curve: tan(δ) = -cos(λ - λ_sub) / tan(φ)',
        calculationStandard: 'Astronomical Solar Coordinates & Spherical Trigonometry',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'world-clock-grid',
        title: 'World Clock Grid',
        name: 'Global World Clock & UTC Offset Grid',
        canonicalPath: '/date-time',
        category: 'time-date',
        subcategory: 'calendar',
        badge: 'IANA Timezones',
        desc: 'Display real-time synchronized local clocks across major financial and metropolitan hubs with active daylight saving alerts.',
        keywords: [
            'world clock grid',
            'global time zones',
            'utc offset clock',
            'international meeting clock'
        ],
        formulaDisplay: 'Local Time = UTC + Offset(tz, currentInstant)',
        calculationStandard: 'IANA Time Zone Database (tzdb 2026) & Olson Database',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'time-zone-converter',
        title: 'Time Zone Converter',
        name: 'Interactive Time Zone Meeting Planner',
        canonicalPath: '/date-time',
        category: 'time-date',
        subcategory: 'calendar',
        badge: 'Meeting Planner',
        desc: 'Convert times across global cities and identify overlapping working hours for cross-border collaboration.',
        keywords: [
            'time zone converter',
            'timezone meeting planner',
            'convert est to pst',
            'convert gmt to local time'
        ],
        formulaDisplay: 'Time_Target = Time_Source + (Offset_Target - Offset_Source)',
        calculationStandard: 'IANA TZ Database & ISO 8601 UTC Designations',
        lastUpdated: '2026-09-15'
    },
    {
        id: '90-minute-ultradian-rhythm-planner',
        title: '90-Minute Ultradian Rhythm Planner',
        name: '90-Minute Basic Rest-Activity Cycle (BRAC) Planner',
        canonicalPath: '/time-duration-calculator',
        category: 'time-date',
        subcategory: 'timers',
        badge: 'BRAC Chronobiology',
        desc: 'Plan daily deep work blocks synchronized with the biological 90-minute Basic Rest-Activity Cycle and 20-minute refractory pauses.',
        keywords: [
            'ultradian rhythm planner',
            '90 minute focus cycle',
            'basic rest activity cycle brac',
            'deep work blocks'
        ],
        formulaDisplay: 'Cycle = 90 min Beta/Gamma Peak Focus + 20 min Parasympathetic Recovery',
        calculationStandard: 'Kleitman Chronobiology BRAC Literature (1963) & Ericsson Deliberate Practice Models',
        lastUpdated: '2026-09-15'
    },
    // --- MATHEMATICS SUITE ---
    {
        id: 'percentage-calculator',
        title: 'Percentage Calculator',
        name: 'Comprehensive Percentage & Percentage Change Calculator',
        canonicalPath: '/math/percentage-calculator',
        category: 'math',
        badge: '3-Way Variations',
        desc: 'Solve percentage increases, percentage decreases, differences between two numbers, and fraction-to-percentage conversions.',
        keywords: [
            'percentage calculator',
            'percent increase calculator',
            'percent decrease',
            'percentage difference',
            'what percent of'
        ],
        formulaDisplay: 'Percent = (Part / Whole) × 100; % Change = ((New - Old) / Old) × 100',
        calculationStandard: 'Standard Elementary Algebra & IEEE 754 High-Precision Math',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'standard-deviation-calculator',
        title: 'Standard Deviation Calculator',
        name: 'Sample & Population Standard Deviation Calculator',
        canonicalPath: '/math/standard-deviation-calculator',
        category: 'math',
        badge: 'Sample & Population',
        desc: 'Compute sample standard deviation (s), population standard deviation (σ), variance, mean, and sum of squares with step-by-step math.',
        keywords: [
            'standard deviation calculator',
            'sample standard deviation',
            'variance calculator',
            'population standard deviation',
            'standard error'
        ],
        formulaDisplay: 's = √[Σ(x_i - x̄)² / (n - 1)]; σ = √[Σ(x_i - μ)² / N]',
        calculationStandard: 'NIST/SEMATECH e-Handbook of Statistical Methods',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'scientific-calculator',
        title: 'Scientific Calculator',
        name: 'Full High-Precision Scientific Calculator',
        canonicalPath: '/math/scientific-calculator',
        category: 'math',
        badge: 'Trigonometry & Log',
        desc: 'High-precision scientific evaluation engine supporting trigonometry, logarithms, factorials, roots, and scientific notation.',
        keywords: [
            'scientific calculator',
            'online scientific calculator',
            'trig calculator',
            'logarithm calculator',
            'fraction solver'
        ],
        formulaDisplay: 'Algebraic Order of Operations (PEMDAS / BODMAS) with IEEE 754 Double Precision',
        calculationStandard: 'IEEE 754 Standard for Floating-Point Arithmetic',
        lastUpdated: '2026-09-15'
    },
    // --- HEALTH & FITNESS SUITE ---
    {
        id: 'bmi-calculator',
        title: 'BMI Calculator',
        name: 'Body Mass Index (BMI) & Prime Index Calculator',
        canonicalPath: '/bmi-calculator',
        category: 'health-fitness',
        badge: 'WHO Clinical Standards',
        desc: 'Calculate Body Mass Index (BMI) and healthy weight ranges for adults with WHO classification thresholds and metric/imperial toggles.',
        keywords: [
            'bmi calculator',
            'body mass index',
            'bmi categories',
            'healthy weight range',
            'bmi formula'
        ],
        formulaDisplay: 'BMI = Weight (kg) / [Height (m)]² or (Weight (lb) / [Height (in)]²) × 703',
        calculationStandard: 'World Health Organization (WHO) Technical Report Series 854',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'tdee-calculator',
        title: 'TDEE Calculator',
        name: 'Total Daily Energy Expenditure (TDEE) Calculator',
        canonicalPath: '/bmi-calculator',
        category: 'health-fitness',
        badge: 'Mifflin-St Jeor',
        desc: 'Calculate Total Daily Energy Expenditure (TDEE) and target maintenance calories using the clinical Mifflin-St Jeor equation.',
        keywords: [
            'tdee calculator',
            'total daily energy expenditure',
            'maintenance calories',
            'calorie deficit',
            'bmr and tdee'
        ],
        formulaDisplay: 'TDEE = BMR × Physical Activity Level (PAL 1.2 to 1.9)',
        calculationStandard: 'Mifflin-St Jeor Equation (1990) & WHO Energy Requirements',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'body-fat-calculator',
        title: 'Body Fat Calculator',
        name: 'U.S. Navy Body Fat Percentage Calculator',
        canonicalPath: '/bmi-calculator',
        category: 'health-fitness',
        badge: 'US Navy Circumference',
        desc: 'Estimate body fat percentage and fat-free mass using circumference measurements developed by the Naval Health Research Center.',
        keywords: [
            'body fat calculator',
            'navy body fat formula',
            'body fat percentage',
            'lean mass calculator'
        ],
        formulaDisplay: 'Men: 495 / (1.0324 - 0.19077·log(waist - neck) + 0.15456·log(height)) - 450',
        calculationStandard: 'Hodgdon & Beckett (1984) Naval Health Research Center Standard',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'ideal-body-weight',
        title: 'Ideal Body Weight Calculator',
        name: 'Ideal Body Weight (IBW) Calculator',
        canonicalPath: '/bmi-calculator',
        category: 'health-fitness',
        badge: 'Clinical Formulas',
        desc: 'Compare ideal body weight estimates across validated medical formulas: Devine, Robinson, Miller, and Hamwi.',
        keywords: [
            'ideal body weight calculator',
            'ibw devine formula',
            'healthy weight for height',
            'hamwi formula'
        ],
        formulaDisplay: 'Devine (Men): 50.0 kg + 2.3 kg per inch over 5 feet; Women: 45.5 kg + 2.3 kg per inch',
        calculationStandard: 'Devine (1974) & Hamwi (1964) Pharmacokinetic Dosing Guidelines',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'max-heart-rate',
        title: 'Target Heart Rate Calculator',
        name: 'Target Heart Rate Zones & Karvonen Formula Calculator',
        canonicalPath: '/bmi-calculator',
        category: 'health-fitness',
        badge: 'Karvonen Heart Reserve',
        desc: 'Calculate aerobic, anaerobic, and Zone 2 cardiovascular training zones using the Karvonen heart rate reserve formula.',
        keywords: [
            'target heart rate calculator',
            'heart rate training zones',
            'karvonen formula',
            'zone 2 cardio',
            'max heart rate'
        ],
        formulaDisplay: 'THR = ((HR_max - HR_rest) × %Intensity) + HR_rest where HR_max = 208 - (0.7 × Age)',
        calculationStandard: 'Tanaka et al. (2001) & American College of Sports Medicine (ACSM)',
        lastUpdated: '2026-09-15'
    },
    // --- UNIVERSAL CONVERSIONS SUITE ---
    {
        id: 'length-converter',
        title: 'Length Converter',
        name: 'Universal Length & Distance Unit Converter',
        canonicalPath: '/conversions/length',
        category: 'conversions',
        badge: 'NIST Standards',
        desc: 'Convert length and distance between inches, feet, yards, miles, centimeters, meters, and kilometers.',
        keywords: [
            'length converter',
            'inches to cm',
            'feet to meters',
            'miles to km',
            'distance converter'
        ],
        formulaDisplay: 'Metric Base: Meter (m); 1 Inch = exactly 0.0254 m (1959 International Yard & Pound Agreement)',
        calculationStandard: 'NIST Special Publication 811 & ISO 80000-3',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'mass-converter',
        title: 'Weight & Mass Converter',
        name: 'Universal Weight & Mass Unit Converter',
        canonicalPath: '/conversions/weight',
        category: 'conversions',
        badge: 'NIST Standards',
        desc: 'Convert weight and mass between grams, kilograms, milligrams, pounds, ounces, stones, and metric tonnes.',
        keywords: [
            'weight converter',
            'mass converter',
            'pounds to kg',
            'grams to ounces',
            'kg to lbs'
        ],
        formulaDisplay: 'Base: Kilogram (kg); 1 Pound (avoirdupois) = exactly 0.45359237 kg',
        calculationStandard: 'NIST Special Publication 811 & 26th General Conference on Weights and Measures (CGPM)',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'volume-converter',
        title: 'Volume & Capacity Converter',
        name: 'Universal Volume & Fluid Capacity Converter',
        canonicalPath: '/conversions/volume',
        category: 'conversions',
        badge: 'NIST Standards',
        desc: 'Convert fluid ounces, cups, tablespoons, teaspoons, milliliters, liters, gallons, and cubic meters.',
        keywords: [
            'volume converter',
            'liters to gallons',
            'milliliters to fluid ounces',
            'cups to ml',
            'tablespoons to teaspoons'
        ],
        formulaDisplay: 'Base: Liter (L); 1 US Gallon = exactly 231 cubic inches = 3.785411784 L',
        calculationStandard: 'NIST Handbook 44 & US Customary System Definitions',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'temperature-converter',
        title: 'Temperature Converter',
        name: 'Celsius, Fahrenheit & Kelvin Temperature Converter',
        canonicalPath: '/conversions/temperature',
        category: 'conversions',
        badge: 'ITS-90 Scale',
        desc: 'Convert temperatures between Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R) with step-by-step arithmetic.',
        keywords: [
            'temperature converter',
            'celsius to fahrenheit',
            'fahrenheit to celsius',
            'kelvin to celsius',
            'temp conversion formula'
        ],
        formulaDisplay: '°F = (°C × 9/5) + 32; °C = (°F - 32) × 5/9; K = °C + 273.15',
        calculationStandard: 'International Temperature Scale of 1990 (ITS-90)',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'area-converter',
        title: 'Area Converter',
        name: 'Universal Area & Surface Measure Converter',
        canonicalPath: '/conversions/area',
        category: 'conversions',
        badge: 'NIST Standards',
        desc: 'Convert square feet, square meters, acres, hectares, square miles, and square kilometers.',
        keywords: [
            'area converter',
            'square feet to square meters',
            'acres to hectares',
            'sq ft to acres'
        ],
        formulaDisplay: '1 Acre = 43,560 sq ft = 4,046.8564224 m²; 1 Hectare = 10,000 m²',
        calculationStandard: 'NIST SP 811 & ISO 80000-3',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'speed-converter',
        title: 'Speed Converter',
        name: 'Universal Speed & Velocity Converter',
        canonicalPath: '/conversions/speed',
        category: 'conversions',
        badge: 'SI & Nautical',
        desc: 'Convert miles per hour (mph), kilometers per hour (km/h), knots, and meters per second (m/s).',
        keywords: [
            'speed converter',
            'mph to kmh',
            'kmh to mph',
            'knots to mph',
            'meters per second to kmh'
        ],
        formulaDisplay: '1 Knot = 1 Nautical Mile/hour = exactly 1.852 km/h; 1 mph = 1.609344 km/h',
        calculationStandard: 'International Hydrographic Organization & NIST SP 811',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'pressure-converter',
        title: 'Pressure Converter',
        name: 'Pressure & Stress Unit Converter',
        canonicalPath: '/conversions',
        category: 'conversions',
        badge: 'SI Pascal',
        desc: 'Convert psi, bar, pascals (Pa), kilopascals (kPa), atmospheres (atm), and millimeters of mercury (mmHg).',
        keywords: [
            'pressure converter',
            'psi to bar',
            'bar to psi',
            'kpa to psi',
            'atm to pascals'
        ],
        formulaDisplay: '1 Standard Atmosphere (atm) = exactly 101,325 Pa; 1 bar = 100,000 Pa; 1 psi ≈ 6,894.757 Pa',
        calculationStandard: 'ISO 80000-4 & International Standard Atmosphere (ISA)',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'energy-converter',
        title: 'Energy Converter',
        name: 'Energy, Work & Heat Converter',
        canonicalPath: '/conversions/energy',
        category: 'conversions',
        badge: 'Joules & Calories',
        desc: 'Convert joules (J), kilojoules (kJ), calories, kilocalories (dietary calories), watt-hours (Wh), and British Thermal Units (BTU).',
        keywords: [
            'energy converter',
            'joules to calories',
            'kj to kcal',
            'btu to joules',
            'kwh to joules'
        ],
        formulaDisplay: '1 Thermochemical Calorie = 4.184 J; 1 kWh = exactly 3,600,000 J; 1 BTU_IT ≈ 1,055.056 J',
        calculationStandard: 'NIST SP 811 & ISO 80000-5',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'power-converter',
        title: 'Power Converter',
        name: 'Power & Mechanical Energy Rate Converter',
        canonicalPath: '/conversions/energy',
        category: 'conversions',
        badge: 'Watts & Horsepower',
        desc: 'Convert watts (W), kilowatts (kW), megawatts (MW), mechanical horsepower (hp), and metric horsepower (PS).',
        keywords: [
            'power converter',
            'watts to horsepower',
            'kw to hp',
            'horsepower to watts',
            'megawatts to kilowatts'
        ],
        formulaDisplay: '1 Mechanical Horsepower (550 ft·lbf/s) = 745.69987158227022 W; 1 Metric HP (PS) = 735.49875 W',
        calculationStandard: 'NIST SP 811 & ISO 80000-5',
        lastUpdated: '2026-09-15'
    },
    {
        id: 'grams-to-tablespoons',
        title: 'Grams to Tablespoons',
        name: 'Grams to Tablespoons Culinary Metrology Converter',
        canonicalPath: '/conversions/cooking',
        category: 'conversions',
        badge: 'USDA Bulk Density',
        desc: 'Convert grams to tablespoons with ingredient-specific bulk densities for flour, sugar, butter, oil, honey, and salt.',
        keywords: [
            'grams to tablespoons',
            'convert grams to tablespoons',
            'butter grams to tbsp',
            'flour grams to tablespoons'
        ],
        formulaDisplay: 'Tablespoons = Grams / (Density (g/ml) × 14.7868 ml/tbsp)',
        calculationStandard: 'USDA FoodData Central Bulk Density Calibration',
        lastUpdated: '2026-09-15'
    },
    // --- ELECTRICAL & ELECTRONICS SUITE (MATCHING INCH CALCULATOR CATALOG) ---
    {
        id: 'wire-size-calculator',
        title: 'Wire Size & Gauge Calculator',
        name: 'Wire Gauge (AWG) & Cable Thickness Calculator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'home-wiring',
        badge: 'NEC Standard',
        desc: 'Find the safest American Wire Gauge (AWG) thickness for copper and aluminum conductors based on amps and continuous load.',
        keywords: [
            'wire size calculator',
            'wire gauge calculator',
            'awg calculator',
            'electrical wire size',
            'cable sizing'
        ],
        formulaDisplay: 'Circular Mils = (2 × K × I × L) / Max Allowable Voltage Drop',
        calculationStandard: 'NEC Chapter 9 Table 8 & NEC Table 310.16 Ampacity Standard',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'voltage-drop-calculator',
        title: 'Voltage Drop Calculator',
        name: 'Single-Phase & 3-Phase Voltage Loss Calculator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'home-wiring',
        badge: '3% Safety Rule',
        desc: 'Calculate voltage lost over long wire distances to prevent motor overheating and ensure NEC 3% compliance.',
        keywords: [
            'voltage drop calculator',
            'voltage loss calculator',
            'single phase voltage drop',
            '3 phase voltage drop',
            'nec voltage drop'
        ],
        formulaDisplay: '1-Phase: VD = (2 × K × I × L) / CM ; 3-Phase: VD = (√3 × K × I × L) / CM',
        calculationStandard: 'National Electrical Code (NEC Informational Note 210.19(A))',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'conduit-fill-calculator',
        title: 'Conduit Fill & Wire Capacity',
        name: 'Conduit Fill & Pipe Capacity Sizer',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'home-wiring',
        badge: 'NEC Chapter 9',
        desc: 'Calculate how many wires can safely fit into EMT, PVC, IMC, or Rigid conduit without exceeding 40% fill limits.',
        keywords: [
            'conduit fill calculator',
            'pipe fill calculator',
            'emt conduit fill',
            'pvc conduit sizing',
            'wire capacity conduit'
        ],
        formulaDisplay: 'Conduit Fill % = (Total Area of All Conductors / Total Internal Area of Conduit) × 100%',
        calculationStandard: 'NEC Chapter 9 Table 1 (40% Maximum Fill for 3+ Conductors)',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'electrical-box-fill-calculator',
        title: 'Electrical Box Volume & Fill',
        name: 'Electrical Box Fill & Cubic Inch Capacity Calculator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'home-wiring',
        badge: 'NEC 314.16',
        desc: 'Calculate total volume allowances for conductors, clamps, switches, receptacles, and grounding wires in junction boxes.',
        keywords: [
            'electrical box fill calculator',
            'box volume calculator',
            'junction box fill',
            'nec box sizing',
            'gang box volume'
        ],
        formulaDisplay: 'Total Volume Required = Σ (Conductor Equivalents × Volume Allowance per Gauge in cu in)',
        calculationStandard: 'NEC Article 314.16(B) Box Volume Calculations',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'circuit-breaker-calculator',
        title: 'Circuit Breaker & Continuous Load Sizer',
        name: 'Circuit Breaker Ampacity & Safety Sizer',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'home-wiring',
        badge: '80% Safety Rule',
        desc: 'Size 15A, 20A, 30A, 50A breakers and verify that continuous loads running for 3+ hours do not exceed 80% capacity.',
        keywords: [
            'circuit breaker calculator',
            'breaker size calculator',
            'continuous load calculator',
            '15 amp vs 20 amp breaker'
        ],
        formulaDisplay: 'Minimum Breaker Rating = (Continuous Load Amps × 1.25) + Non-Continuous Load Amps',
        calculationStandard: 'NEC Article 210.20 & Article 215.3 Overcurrent Protection',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'ohms-law-calculator',
        title: 'Ohm’s Law Calculator (V, I, R, P)',
        name: 'Ohm’s Law & Electrical Power Solver',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'circuits',
        badge: 'Core Formula',
        desc: 'Calculate Voltage (Volts), Current (Amps), Resistance (Ohms), and Power (Watts) instantly from any two known values.',
        keywords: [
            'ohms law calculator',
            'voltage current resistance',
            'volts amps watts calculator',
            'power wheel calculator',
            'v ir formula'
        ],
        formulaDisplay: 'V = I × R ; P = V × I = I² × R = V² / R',
        calculationStandard: 'Fundamental Ohm & Joule Thermodynamic Equations',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'series-parallel-resistor-calculator',
        title: 'Series & Parallel Resistor Calculator',
        name: 'Series and Parallel Circuit Resistance Solver',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'circuits',
        badge: 'Network Solver',
        desc: 'Calculate total equivalent resistance for any number of resistors connected in series or parallel branches.',
        keywords: [
            'parallel resistor calculator',
            'series resistor calculator',
            'equivalent resistance',
            'resistor network calculator'
        ],
        formulaDisplay: 'Series: R_total = R₁ + R₂ + ... ; Parallel: 1/R_total = 1/R₁ + 1/R₂ + ...',
        calculationStandard: 'Kirchhoff’s Current & Voltage Laws (KCL & KVL)',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'led-resistor-calculator',
        title: 'LED Current-Limiting Resistor Calculator',
        name: 'LED Ballast Resistor & Power Dissipation Calculator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'circuits',
        badge: 'LED Protection',
        desc: 'Calculate the exact resistor ohms and minimum wattage required to safely power single or multiple LEDs without burnout.',
        keywords: [
            'led resistor calculator',
            'led series resistor',
            'current limiting resistor',
            'led power calculator',
            'forward voltage drop'
        ],
        formulaDisplay: 'Resistor (Ω) = (Supply Voltage - LED Forward Voltage) / Desired LED Current (A)',
        calculationStandard: 'Standard Diode Forward-Bias Circuit Modeling',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'ac-rms-peak-voltage-calculator',
        title: 'Peak, RMS & Peak-to-Peak Voltage Calculator',
        name: 'AC Waveform RMS & Peak Voltage Converter',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'circuits',
        badge: 'AC Waveform',
        desc: 'Convert between Root Mean Square (RMS) voltage, peak voltage ($V_{pk}$), and peak-to-peak voltage ($V_{pp}$) for sine waves.',
        keywords: [
            'rms voltage calculator',
            'peak voltage calculator',
            'peak to peak voltage',
            'ac to dc voltage',
            'sine wave voltage'
        ],
        formulaDisplay: 'V_RMS = V_Peak / √2 ≈ 0.7071 × V_Peak ; V_Peak-to-Peak = 2 × V_Peak',
        calculationStandard: 'IEEE Standard for Sinusoidal Alternating Current Metrics',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'power-factor-calculator',
        title: 'Power Factor & Real vs Apparent Power',
        name: 'AC Power Factor, Real (kW) & Apparent (kVA) Sizer',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'circuits',
        badge: 'Power Triangle',
        desc: 'Calculate power factor, active power (kW), reactive power (kVAR), and total apparent power (kVA) in AC electrical systems.',
        keywords: [
            'power factor calculator',
            'kw to kva calculator',
            'apparent power calculator',
            'reactive power kvar',
            'ac power factor'
        ],
        formulaDisplay: 'Power Factor (PF) = Real Power (kW) / Apparent Power (kVA) = cos(θ)',
        calculationStandard: 'IEEE Standard 1459 AC Electric Power Definitions',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'coulombs-law-calculator',
        title: 'Coulomb’s Law & Electrostatic Force',
        name: 'Coulomb’s Law Electric Charge & Force Calculator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'circuits',
        badge: 'Physics Law',
        desc: 'Calculate electrostatic attraction or repulsion force between two point charges separated by a known distance.',
        keywords: [
            'coulombs law calculator',
            'electrostatic force calculator',
            'electric charge force',
            'coulombs constant'
        ],
        formulaDisplay: 'F = k_e × (|q₁ × q₂|) / r² (where k_e ≈ 8.98755 × 10⁹ N·m²/C²)',
        calculationStandard: 'NIST CODATA Recommended Constants for Electromagnetism',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'electricity-cost-calculator',
        title: 'Electricity Bill & Running Cost Calculator',
        name: 'Appliance & Household Electricity Bill Estimator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'energy-cost',
        badge: 'Energy Savings',
        desc: 'Calculate how much any appliance costs to run per hour, per day, per month, and per year based on your local kWh rate.',
        keywords: [
            'electricity cost calculator',
            'appliance running cost',
            'kwh cost calculator',
            'power bill calculator',
            'energy cost per month'
        ],
        formulaDisplay: 'Cost = (Appliance Watts × Hours Used / 1,000) × Electricity Rate ($/kWh)',
        calculationStandard: 'US Energy Information Administration (EIA) Utility Billing Standards',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'appliance-energy-calculator',
        title: 'Appliance Energy Consumption Calculator',
        name: 'Appliance Power Usage & Carbon Footprint Estimator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'energy-cost',
        badge: 'Home Efficiency',
        desc: 'Compare electricity consumption across air conditioners, space heaters, refrigerators, computers, and water heaters.',
        keywords: [
            'appliance energy calculator',
            'refrigerator power cost',
            'space heater electricity cost',
            'air conditioner power usage'
        ],
        formulaDisplay: 'Monthly kWh = (Watts × Daily Hours × 30) / 1,000',
        calculationStandard: 'EPA Energy Star Appliance Test Procedures',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'lighting-energy-calculator',
        title: 'Lighting Energy & LED Savings Calculator',
        name: 'Lighting Energy Cost & LED Retrofit Savings Calculator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'energy-cost',
        badge: 'LED Upgrade',
        desc: 'Calculate annual cost savings and payback time when upgrading incandescent or fluorescent bulbs to high-efficiency LEDs.',
        keywords: [
            'lighting energy calculator',
            'led savings calculator',
            'incandescent vs led cost',
            'lighting electricity cost'
        ],
        formulaDisplay: 'Annual Savings = [((Watts_Old - Watts_LED) × Hours/Day × 365) / 1,000] × Rate/kWh',
        calculationStandard: 'Department of Energy (DOE) Solid-State Lighting Standards',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'solar-battery-calculator',
        title: 'Solar Array & Battery Storage Sizer',
        name: 'Solar Panel System & Battery Backup Calculator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'energy-cost',
        badge: 'Solar & Storage',
        desc: 'Calculate how many solar panels and how much battery storage (kWh / Ah) you need for off-grid or home backup power.',
        keywords: [
            'solar calculator',
            'solar battery calculator',
            'off grid solar sizer',
            'battery storage capacity',
            'solar panel requirements'
        ],
        formulaDisplay: 'Battery Storage (Ah) = (Daily Wh × Days of Autonomy) / (Battery Voltage × Depth of Discharge)',
        calculationStandard: 'IEEE Standard 1013 Recommended Practice for Sizing Lead-Acid/Lithium Batteries',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'generator-sizing-calculator',
        title: 'Home Backup Generator Sizing Calculator',
        name: 'Emergency Generator Wattage & Load Sizer',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'energy-cost',
        badge: 'Backup Power',
        desc: 'Calculate starting (surge) watts and running (continuous) watts needed to power your critical household appliances during an outage.',
        keywords: [
            'generator sizing calculator',
            'generator wattage calculator',
            'home backup generator',
            'starting vs running watts'
        ],
        formulaDisplay: 'Generator Size (Watts) = Highest Starting Surge Watts + Total Running Watts of All Loads',
        calculationStandard: 'NFPA 110 Standard for Emergency and Standby Power Systems',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'capacitance-calculator',
        title: 'Capacitance & Capacitor Energy Solver',
        name: 'Capacitance, Stored Energy & Plate Area Calculator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'electronics-conversions',
        badge: 'Energy Storage',
        desc: 'Calculate capacitance in farads/microfarads, parallel plate dimensions, and total energy stored in a charged capacitor.',
        keywords: [
            'capacitance calculator',
            'capacitor energy calculator',
            'parallel plate capacitance',
            'microfarads to farads'
        ],
        formulaDisplay: 'C = (ε_r × ε_0 × Area) / Distance ; Stored Energy E = ½ × C × V²',
        calculationStandard: 'Standard Electrostatic Permittivity Modeling',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'inductance-calculator',
        title: 'Inductance & Coil Inductor Calculator',
        name: 'Coil Inductance & Magnetic Energy Calculator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'electronics-conversions',
        badge: 'Magnetics',
        desc: 'Calculate single-layer air core coil inductance in microhenries (µH) and energy stored in an inductor ($E = ½LI^2$).',
        keywords: [
            'inductance calculator',
            'coil inductance',
            'inductor energy calculator',
            'microhenries calculator'
        ],
        formulaDisplay: 'L (µH) = (d² × n²) / (18d + 40l) (Wheeler’s Formula for Air-Core Coils)',
        calculationStandard: 'Wheeler Standard Formula for RF Single-Layer Solenoids',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'resistor-color-code-calculator',
        title: 'Resistor Color Code Calculator',
        name: '4-Band, 5-Band & 6-Band Resistor Color Code Decoder',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'electronics-conversions',
        badge: 'Color Decoder',
        desc: 'Decode resistor color bands to find resistance in ohms, tolerance percentage, and temperature coefficient (ppm/K).',
        keywords: [
            'resistor color code calculator',
            '4 band resistor',
            '5 band resistor',
            'resistor color bands',
            'resistor decoder'
        ],
        formulaDisplay: 'Resistance = (Band 1 & 2 digits) × 10^(Multiplier Band) ± Tolerance %',
        calculationStandard: 'IEC 60062 Resistor & Capacitor Marking Codes',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'smd-resistor-code-calculator',
        title: 'SMD Resistor Code Calculator',
        name: 'Surface Mount (SMD) Resistor Code Calculator',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'electronics-conversions',
        badge: 'SMD Decoder',
        desc: 'Calculate resistance values from 3-digit, 4-digit, and EIA-96 precision surface-mount resistor codes.',
        keywords: [
            'smd resistor code calculator',
            'smd code decoder',
            'eia-96 code calculator',
            'surface mount resistor values'
        ],
        formulaDisplay: '3-Digit: AB × 10^C ; 4-Digit: ABC × 10^D ; EIA-96: Value Code Lookup × 10^Multiplier Code',
        calculationStandard: 'EIA-96 Precision 1% SMD Resistor Marking Standard',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'amps-to-watts-converter',
        title: 'Amps to Watts / Volts / kVA Converter',
        name: 'Amps to Watts, Volts, and kVA Electrical Converter',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'electronics-conversions',
        badge: 'Unit Conversion',
        desc: 'Instantly convert Amperes (Current) to Watts (Power), Kilowatts (kW), and Volts across DC, 1-Phase AC, and 3-Phase AC.',
        keywords: [
            'amps to watts converter',
            'watts to amps calculator',
            'amps to kva',
            'amps to volts converter',
            'electrical conversion'
        ],
        formulaDisplay: 'Watts = Amps × Volts × Power Factor (1-Phase AC) ; Watts = √3 × Amps × Volts × PF (3-Phase AC)',
        calculationStandard: 'IEEE Standard 141 Electrical Engineering Conversion Factors',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'horsepower-to-kw-converter',
        title: 'Horsepower (HP) to Kilowatts (kW) Converter',
        name: 'Motor Horsepower (HP) to Kilowatts (kW) Converter',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'electronics-conversions',
        badge: 'Motor Power',
        desc: 'Convert electric motor mechanical horsepower (HP) to electrical kilowatts (kW) and calculate full load amps.',
        keywords: [
            'horsepower to kw converter',
            'hp to kw calculator',
            'kw to hp converter',
            'electric motor power converter'
        ],
        formulaDisplay: '1 Mechanical HP = 0.74569987 kW ; kW = HP × 0.7457 ; HP = kW / 0.7457',
        calculationStandard: 'NEMA MG 1 Motors and Generators Standard',
        lastUpdated: '2026-10-01'
    },
    {
        id: 'dbm-to-watts-converter',
        title: 'dBm to Watts & Milliwatts Converter',
        name: 'dBm to Watts & RF Signal Power Converter',
        canonicalPath: '/electrical',
        category: 'electrical',
        subcategory: 'electronics-conversions',
        badge: 'Signal Power',
        desc: 'Convert decibel-milliwatts (dBm) to milliwatts (mW) and Watts (W) for audio, radio frequency (RF), and Wi-Fi signals.',
        keywords: [
            'dbm to watts converter',
            'dbm to mw calculator',
            'rf power converter',
            'watts to dbm conversion'
        ],
        formulaDisplay: 'Power (mW) = 10^(dBm / 10) ; Power (Watts) = 10^((dBm - 30) / 10)',
        calculationStandard: 'Telecommunications Industry Association (TIA) RF Power Metrology',
        lastUpdated: '2026-10-01'
    }
];
// AUTHORITATIVE STATISTICAL GETTERS (NEVER HARDCODE COUNTS)
export const TOTAL_CALCULATORS_COUNT = CANONICAL_TOOLS.length;
export const TOTAL_CATEGORIES_COUNT = CANONICAL_CATEGORIES.length;
export function getToolsByCategory(categoryId) {
    return CANONICAL_TOOLS.filter((t)=>t.category === categoryId);
}
export function getCategoryCount(categoryId) {
    return getToolsByCategory(categoryId).length;
}
export function getToolByPath(path) {
    const clean = path.replace(/\/$/, '');
    return CANONICAL_TOOLS.find((t)=>t.canonicalPath === clean);
}
export function getAllCanonicalPaths() {
    const toolPaths = CANONICAL_TOOLS.map((t)=>t.canonicalPath);
    const catPaths = CANONICAL_CATEGORIES.map((c)=>c.path);
    return Array.from(new Set([
        ...catPaths,
        ...toolPaths
    ]));
}
