/**
 * Centralized Verified Statutory Data File for Taxes, Payroll, Salary & Business Calculators (#30–#48)
 * Every tax schedule, threshold, social contribution cap, and sector benchmark includes
 * an official authority citation, document reference, and verification date.
 */

export interface VerifiedSourceMeta {
  authority: string;
  document: string;
  url: string;
  taxYear: string;
  dateVerified: string;
  verifiedDate?: string;
}

export const PRIORITY_US_STATES = ['CA', 'NY', 'TX', 'FL', 'WA'] as const;

// ============================================================================
// #31 & #44: US STATE INCOME TAX & PAYROLL DATA (2025 VERIFIED)
// ============================================================================
export interface UsStateTaxProfile {
  code: string;
  name: string;
  hasIncomeTax: boolean;
  flatRate?: number;
  standardDeductionSingle: number;
  standardDeductionMFJ: number;
  bracketsSingle: { threshold: number; rate: number }[];
  bracketsMFJ: { threshold: number; rate: number }[];
  supplementalBonusRate: number;
  payrollItems: {
    name: string;
    rate: number;
    wageCap?: number; // undefined = uncapped
    note: string;
  }[];
  source: string;
}

export const US_FICA_2025 = {
  socialSecurityRateEmployee: 0.062,
  socialSecurityRateSelfEmployed: 0.124,
  socialSecurityWageBase: 176100, // SSA 2025 verified contribution and benefit base
  medicareRateEmployee: 0.0145,
  medicareRateSelfEmployed: 0.029,
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: {
    single: 200000,
    married_joint: 250000,
    married_separate: 125000,
    head_of_household: 200000,
  },
  seNetEarningsMultiplier: 0.9235, // 100% - 7.65% employer-equivalent portion (IRS Schedule SE)
  supplementalFlatRateUnder1M: 0.22, // IRS Pub 15 (Circular E)
  supplementalFlatRateOver1M: 0.37,
  source: {
    authority: 'Internal Revenue Service (IRS) & Social Security Administration (SSA)',
    document: 'IRS Publication 15 (2025 Circular E) & SSA 2025 Fact Sheet',
    url: 'https://www.irs.gov/publications/p15',
    taxYear: '2025',
    dateVerified: '2025-02-15',
    verifiedDate: '2025-02-15',
  } as VerifiedSourceMeta,
};

export const US_STATE_TAX_PROFILES_2025: Record<string, UsStateTaxProfile> = {
  CA: {
    code: 'CA',
    name: 'California',
    hasIncomeTax: true,
    standardDeductionSingle: 5540,
    standardDeductionMFJ: 11080,
    bracketsSingle: [
      { threshold: 0, rate: 0.01 },
      { threshold: 10756, rate: 0.02 },
      { threshold: 25499, rate: 0.04 },
      { threshold: 40245, rate: 0.06 },
      { threshold: 55866, rate: 0.08 },
      { threshold: 70606, rate: 0.093 },
      { threshold: 360659, rate: 0.103 },
      { threshold: 432787, rate: 0.113 },
      { threshold: 721314, rate: 0.123 },
      { threshold: 1000000, rate: 0.133 }, // Includes 1% Mental Health Services Tax
    ],
    bracketsMFJ: [
      { threshold: 0, rate: 0.01 },
      { threshold: 21512, rate: 0.02 },
      { threshold: 50998, rate: 0.04 },
      { threshold: 80490, rate: 0.06 },
      { threshold: 111732, rate: 0.08 },
      { threshold: 141212, rate: 0.093 },
      { threshold: 721318, rate: 0.103 },
      { threshold: 865574, rate: 0.113 },
      { threshold: 1000000, rate: 0.123 },
      { threshold: 1442628, rate: 0.133 },
    ],
    supplementalBonusRate: 0.1023, // CA EDD 10.23% supplemental rate for bonuses/stock
    payrollItems: [
      {
        name: 'CA State Disability Insurance (SDI)',
        rate: 0.012, // 1.2% for 2025 per CA EDD (wage ceiling repealed via SB 951)
        note: 'CA EDD 2025 rate: 1.2% on all wages (no wage cap under SB 951)',
      },
    ],
    source: 'California Franchise Tax Board (FTB) & EDD (2025 Verified)',
  },
  NY: {
    code: 'NY',
    name: 'New York',
    hasIncomeTax: true,
    standardDeductionSingle: 8000,
    standardDeductionMFJ: 16050,
    bracketsSingle: [
      { threshold: 0, rate: 0.04 },
      { threshold: 8500, rate: 0.045 },
      { threshold: 11700, rate: 0.0525 },
      { threshold: 13900, rate: 0.055 },
      { threshold: 80650, rate: 0.06 },
      { threshold: 215400, rate: 0.0685 },
      { threshold: 1077550, rate: 0.0965 },
    ],
    bracketsMFJ: [
      { threshold: 0, rate: 0.04 },
      { threshold: 17150, rate: 0.045 },
      { threshold: 23600, rate: 0.0525 },
      { threshold: 27900, rate: 0.055 },
      { threshold: 161550, rate: 0.06 },
      { threshold: 323200, rate: 0.0685 },
      { threshold: 2155350, rate: 0.0965 },
    ],
    supplementalBonusRate: 0.0965, // NY DTF supplemental withholding rate
    payrollItems: [
      {
        name: 'NY Paid Family Leave (PFL)',
        rate: 0.00388,
        wageCap: 91374, // Max annual contribution $354.53 in 2025
        note: 'NY PFL 2025: 0.388% capped at $354.53/yr + NY SDI $0.60/wk ($31.20/yr)',
      },
    ],
    source: 'NY State Department of Taxation and Finance (Publication NYS-50, 2025)',
  },
  TX: {
    code: 'TX',
    name: 'Texas',
    hasIncomeTax: false,
    standardDeductionSingle: 0,
    standardDeductionMFJ: 0,
    bracketsSingle: [{ threshold: 0, rate: 0 }],
    bracketsMFJ: [{ threshold: 0, rate: 0 }],
    supplementalBonusRate: 0,
    payrollItems: [],
    source: 'Texas Comptroller of Public Accounts (No State Income Tax)',
  },
  FL: {
    code: 'FL',
    name: 'Florida',
    hasIncomeTax: false,
    standardDeductionSingle: 0,
    standardDeductionMFJ: 0,
    bracketsSingle: [{ threshold: 0, rate: 0 }],
    bracketsMFJ: [{ threshold: 0, rate: 0 }],
    supplementalBonusRate: 0,
    payrollItems: [],
    source: 'Florida Department of Revenue (No State Income Tax)',
  },
  WA: {
    code: 'WA',
    name: 'Washington',
    hasIncomeTax: false,
    standardDeductionSingle: 0,
    standardDeductionMFJ: 0,
    bracketsSingle: [{ threshold: 0, rate: 0 }],
    bracketsMFJ: [{ threshold: 0, rate: 0 }],
    supplementalBonusRate: 0,
    payrollItems: [
      {
        name: 'WA Cares Fund & Paid Leave (PFML)',
        rate: 0.0111, // 0.58% WA Cares (uncapped) + ~0.53% Employee PFML share
        note: 'WA Cares Fund (0.58% uncapped) + WA Paid Family & Medical Leave (~0.53% employee share up to SS cap)',
      },
    ],
    source: 'Washington Employment Security Department (ESD 2025)',
  },
  IL: {
    code: 'IL',
    name: 'Illinois',
    hasIncomeTax: true,
    flatRate: 0.0495,
    standardDeductionSingle: 2775, // Personal exemption
    standardDeductionMFJ: 5550,
    bracketsSingle: [{ threshold: 0, rate: 0.0495 }],
    bracketsMFJ: [{ threshold: 0, rate: 0.0495 }],
    supplementalBonusRate: 0.0495,
    payrollItems: [],
    source: 'Illinois Department of Revenue (4.95% Flat Tax, 2025)',
  },
  PA: {
    code: 'PA',
    name: 'Pennsylvania',
    hasIncomeTax: true,
    flatRate: 0.0307,
    standardDeductionSingle: 0,
    standardDeductionMFJ: 0,
    bracketsSingle: [{ threshold: 0, rate: 0.0307 }],
    bracketsMFJ: [{ threshold: 0, rate: 0.0307 }],
    supplementalBonusRate: 0.0307,
    payrollItems: [
      {
        name: 'PA Employee SUI Withholding',
        rate: 0.0007,
        note: 'PA Unemployment Compensation employee withholding (0.07%)',
      },
    ],
    source: 'Pennsylvania Department of Revenue (3.07% Flat Tax, 2025)',
  },
  MA: {
    code: 'MA',
    name: 'Massachusetts',
    hasIncomeTax: true,
    standardDeductionSingle: 4400,
    standardDeductionMFJ: 8800,
    bracketsSingle: [
      { threshold: 0, rate: 0.05 },
      { threshold: 1083150, rate: 0.09 }, // 4% Millionaire Surtax above $1.08M
    ],
    bracketsMFJ: [
      { threshold: 0, rate: 0.05 },
      { threshold: 1083150, rate: 0.09 },
    ],
    supplementalBonusRate: 0.05,
    payrollItems: [
      {
        name: 'MA PFML Employee Share',
        rate: 0.0046,
        wageCap: 176100,
        note: 'MA Paid Family and Medical Leave employee share (up to 0.46% capped at $176,100)',
      },
    ],
    source: 'Massachusetts Department of Revenue (2025)',
  },
  NJ: {
    code: 'NJ',
    name: 'New Jersey',
    hasIncomeTax: true,
    standardDeductionSingle: 1000,
    standardDeductionMFJ: 2000,
    bracketsSingle: [
      { threshold: 0, rate: 0.014 },
      { threshold: 20000, rate: 0.0175 },
      { threshold: 35000, rate: 0.035 },
      { threshold: 40000, rate: 0.05525 },
      { threshold: 75000, rate: 0.0637 },
      { threshold: 500000, rate: 0.0897 },
      { threshold: 1000000, rate: 0.1075 },
    ],
    bracketsMFJ: [
      { threshold: 0, rate: 0.014 },
      { threshold: 20000, rate: 0.0175 },
      { threshold: 50000, rate: 0.0245 },
      { threshold: 70000, rate: 0.035 },
      { threshold: 80000, rate: 0.05525 },
      { threshold: 150000, rate: 0.0637 },
      { threshold: 500000, rate: 0.0897 },
      { threshold: 1000000, rate: 0.1075 },
    ],
    supplementalBonusRate: 0.0637,
    payrollItems: [
      {
        name: 'NJ SUI / FLI Employee Payroll Tax',
        rate: 0.00585,
        wageCap: 165400,
        note: 'NJ UI/WF (0.425% up to $43,300) + Family Leave Insurance (0.33% up to $165,400)',
      },
    ],
    source: 'New Jersey Division of Taxation & DOLWD (2025)',
  },
  GA: {
    code: 'GA',
    name: 'Georgia',
    hasIncomeTax: true,
    flatRate: 0.0539,
    standardDeductionSingle: 12000,
    standardDeductionMFJ: 24000,
    bracketsSingle: [{ threshold: 0, rate: 0.0539 }],
    bracketsMFJ: [{ threshold: 0, rate: 0.0539 }],
    supplementalBonusRate: 0.0539,
    payrollItems: [],
    source: 'Georgia Department of Revenue (5.39% Flat Tax, 2025)',
  },
  NC: {
    code: 'NC',
    name: 'North Carolina',
    hasIncomeTax: true,
    flatRate: 0.0425,
    standardDeductionSingle: 12750,
    standardDeductionMFJ: 25500,
    bracketsSingle: [{ threshold: 0, rate: 0.0425 }],
    bracketsMFJ: [{ threshold: 0, rate: 0.0425 }],
    supplementalBonusRate: 0.0425,
    payrollItems: [],
    source: 'North Carolina Department of Revenue (4.25% Flat Tax for 2025)',
  },
  NV: {
    code: 'NV',
    name: 'Nevada',
    hasIncomeTax: false,
    standardDeductionSingle: 0,
    standardDeductionMFJ: 0,
    bracketsSingle: [{ threshold: 0, rate: 0 }],
    bracketsMFJ: [{ threshold: 0, rate: 0 }],
    supplementalBonusRate: 0,
    payrollItems: [],
    source: 'Nevada Department of Taxation (No State Income Tax)',
  },
  TN: {
    code: 'TN',
    name: 'Tennessee',
    hasIncomeTax: false,
    standardDeductionSingle: 0,
    standardDeductionMFJ: 0,
    bracketsSingle: [{ threshold: 0, rate: 0 }],
    bracketsMFJ: [{ threshold: 0, rate: 0 }],
    supplementalBonusRate: 0,
    payrollItems: [],
    source: 'Tennessee Department of Revenue (No State Income Tax)',
  },
};

// ============================================================================
// #32: US SELF-EMPLOYMENT QUARTERLY DUE DATES (IRS FORM 1040-ES)
// ============================================================================
export const US_SE_QUARTERLY_DATES_2025 = [
  { quarter: 'Q1 (Jan 1 – Mar 31)', dueDate: 'April 15, 2025' },
  { quarter: 'Q2 (Apr 1 – May 31)', dueDate: 'June 16, 2025' },
  { quarter: 'Q3 (Jun 1 – Aug 31)', dueDate: 'September 15, 2025' },
  { quarter: 'Q4 (Sep 1 – Dec 31)', dueDate: 'January 15, 2026' },
];

// ============================================================================
// #33: US & INDIA CAPITAL GAINS STATUTORY DATA (2025 VERIFIED)
// ============================================================================
export const US_CAPITAL_GAINS_2025 = {
  source: {
    authority: 'Internal Revenue Service (IRS)',
    document: 'IRS Rev. Proc. 2024-40 & Topic No. 409 / Publication 550 (Capital Gains and Losses)',
    url: 'https://www.irs.gov/taxtopics/tc409',
    taxYear: '2025',
    dateVerified: '2025-02-15',
    verifiedDate: '2025-02-15',
  } as VerifiedSourceMeta,
  brackets: {
    single: [
      { maxTaxable: 48350, rate: 0.0 },
      { maxTaxable: 533400, rate: 0.15 },
      { maxTaxable: Infinity, rate: 0.2 },
    ],
    married_joint: [
      { maxTaxable: 96700, rate: 0.0 },
      { maxTaxable: 600050, rate: 0.15 },
      { maxTaxable: Infinity, rate: 0.2 },
    ],
    head_of_household: [
      { maxTaxable: 64750, rate: 0.0 },
      { maxTaxable: 566700, rate: 0.15 },
      { maxTaxable: Infinity, rate: 0.2 },
    ],
    married_separate: [
      { maxTaxable: 48350, rate: 0.0 },
      { maxTaxable: 300000, rate: 0.15 },
      { maxTaxable: Infinity, rate: 0.2 },
    ],
  },
  niitRate: 0.038, // IRC Section 1411 Net Investment Income Tax
  niitThresholds: {
    single: 200000,
    married_joint: 250000,
    head_of_household: 200000,
    married_separate: 125000,
  },
  collectiblesMaxRate: 0.28,
  annualLossOffsetCap: {
    default: 3000,
    married_separate: 1500,
  },
};

export const INDIA_CAPITAL_GAINS_2025 = {
  source: {
    authority: 'Income Tax Department, Government of India',
    document: 'Finance (No. 2) Act, 2024 & Finance Bill 2025 – Sections 111A, 112A & 112',
    url: 'https://incometaxindia.gov.in',
    taxYear: 'FY 2024-25 / FY 2025-26 (Post-July 23, 2024)',
    dateVerified: '2025-02-15',
    verifiedDate: '2025-02-15',
  } as VerifiedSourceMeta,
  listedEquityStcgRate: 0.20, // Section 111A (increased from 15% to 20% effective July 23, 2024)
  listedEquityLtcgRate: 0.125, // Section 112A (increased from 10% to 12.5% effective July 23, 2024)
  listedEquityLtcgExemption: 125000, // ₹1,25,000 annual exemption u/s 112A (increased from ₹1,00,000)
  otherLongTermRate: 0.125, // Section 112 without indexation (12.5%)
  cessRate: 0.04, // 4% Health & Education Cess
};

// ============================================================================
// #35: UK PAYE INCOME TAX & NATIONAL INSURANCE (HMRC 2024/25 & 2025/26)
// ============================================================================
export const UK_PAYE_DATA = {
  source: {
    authority: 'HM Revenue & Customs (HMRC)',
    document: 'GOV.UK Income Tax rates and Personal Allowances & National Insurance rates',
    url: 'https://www.gov.uk/income-tax-rates',
    taxYear: '2024/25 & 2025/26 (6 April – 5 April)',
    dateVerified: '2025-02-15',
    verifiedDate: '2025-02-15',
  } as VerifiedSourceMeta,
  personalAllowance: 12570,
  taperThreshold: 100000,
  taperZeroPoint: 125140, // Reduced by £1 for every £2 above £100,000
  rUKBands: [
    { name: 'Basic Rate (20%)', bandWidth: 37700, rate: 0.20 }, // £12,571 to £50,270
    { name: 'Higher Rate (40%)', bandWidth: 74870, rate: 0.40 }, // £50,271 to £125,140
    { name: 'Additional Rate (45%)', bandWidth: Infinity, rate: 0.45 }, // Over £125,140
  ],
  scotlandBands: [
    { name: 'Starter Rate (19%)', bandWidth: 2306, rate: 0.19 },
    { name: 'Basic Rate (20%)', bandWidth: 11685, rate: 0.20 },
    { name: 'Intermediate Rate (21%)', bandWidth: 17101, rate: 0.21 },
    { name: 'Higher Rate (42%)', bandWidth: 31338, rate: 0.42 },
    { name: 'Advanced Rate (45%)', bandWidth: 50000, rate: 0.45 },
    { name: 'Top Rate (48%)', bandWidth: Infinity, rate: 0.48 },
  ],
  nationalInsuranceClass1: {
    primaryThresholdAnnual: 12570, // £1,048/month
    upperEarningsLimitAnnual: 50270, // £4,189/month
    mainRate: 0.08, // 8% between £12,570 and £50,270
    additionalRate: 0.02, // 2% above £50,270
  },
  studentLoanPlans: {
    none: { label: 'No Student Loan', threshold: Infinity, rate: 0 },
    plan1: { label: 'Plan 1 (£24,990 threshold @ 9%)', threshold: 24990, rate: 0.09 },
    plan2: { label: 'Plan 2 (£27,295 threshold @ 9%)', threshold: 27295, rate: 0.09 },
    plan4: { label: 'Plan 4 Scotland (£31,395 threshold @ 9%)', threshold: 31395, rate: 0.09 },
    plan5: { label: 'Plan 5 (£25,000 threshold @ 9%)', threshold: 25000, rate: 0.09 },
    postgrad: { label: 'Postgraduate Loan (£21,000 threshold @ 6%)', threshold: 21000, rate: 0.06 },
  },
};

// ============================================================================
// #36: CANADA INCOME TAX, CPP/CPP2 & EI DATA (CRA 2025 VERIFIED)
// ============================================================================
export const CANADA_TAX_DATA_2025 = {
  source: {
    authority: 'Canada Revenue Agency (CRA)',
    document: 'CRA 2025 Indexation Adjustment for Personal Income Tax and Benefit Amounts',
    url: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts.html',
    taxYear: '2025',
    dateVerified: '2025-02-15',
    verifiedDate: '2025-02-15',
  } as VerifiedSourceMeta,
  federalBasicPersonalAmount: 16129, // 2025 Federal BPA ($16,129 reduced to $14,538 above $177,882)
  federalBrackets: [
    { threshold: 0, rate: 0.15 },
    { threshold: 57375, rate: 0.205 },
    { threshold: 114750, rate: 0.26 },
    { threshold: 177882, rate: 0.29 },
    { threshold: 253414, rate: 0.33 },
  ],
  cpp: {
    basicExemption: 3500,
    ympe: 71300, // 2025 Year's Maximum Pensionable Earnings
    rate: 0.0595, // 5.95% employee rate -> max $4,034.10
    yampe: 81200, // 2025 Additional Maximum Pensionable Earnings (CPP2)
    cpp2Rate: 0.04, // 4% on $71,300 to $81,200 -> max $396.00
  },
  ei: {
    maxInsurableEarnings: 65700, // 2025 MIE
    rate: 0.0164, // 1.64% employee rate (outside QC) -> max $1,077.48
  },
  provinces: {
    ON: {
      code: 'ON',
      name: 'Ontario',
      bpa: 12747,
      brackets: [
        { threshold: 0, rate: 0.0505 },
        { threshold: 52886, rate: 0.0915 },
        { threshold: 105775, rate: 0.1116 },
        { threshold: 150000, rate: 0.1216 },
        { threshold: 220000, rate: 0.1316 },
      ],
      hasOntarioSurtaxAndHealthPremium: true,
    },
    BC: {
      code: 'BC',
      name: 'British Columbia',
      bpa: 12932,
      brackets: [
        { threshold: 0, rate: 0.0506 },
        { threshold: 49279, rate: 0.077 },
        { threshold: 98560, rate: 0.105 },
        { threshold: 113158, rate: 0.1229 },
        { threshold: 137407, rate: 0.147 },
        { threshold: 186306, rate: 0.168 },
        { threshold: 259829, rate: 0.205 },
      ],
      hasOntarioSurtaxAndHealthPremium: false,
    },
    AB: {
      code: 'AB',
      name: 'Alberta',
      bpa: 22323,
      brackets: [
        { threshold: 0, rate: 0.10 },
        { threshold: 151234, rate: 0.12 },
        { threshold: 181481, rate: 0.13 },
        { threshold: 241974, rate: 0.14 },
        { threshold: 362961, rate: 0.15 },
      ],
      hasOntarioSurtaxAndHealthPremium: false,
    },
  },
};

// ============================================================================
// #37, #38, #41: INDIA INCOME TAX, HRA & CTC-TO-IN-HAND DATA (VERIFIED)
// ============================================================================
export const INDIA_TAX_DATA = {
  source: {
    authority: 'Income Tax Department, Ministry of Finance, Government of India',
    document: 'Union Budget 2025-26 Finance Bill & Finance (No. 2) Act 2024 – Section 115BAC & Old Regime',
    url: 'https://incometaxindia.gov.in',
    taxYear: 'FY 2025-26 (AY 2026-27) & FY 2024-25 (AY 2025-26)',
    dateVerified: '2025-02-15',
    verifiedDate: '2025-02-15',
  } as VerifiedSourceMeta,
  newRegime: {
    '2025-26': {
      standardDeduction: 75000,
      rebate87ALimit: 1200000, // Full rebate up to ₹12,00,000 taxable income (₹12.75L gross salary)
      maxRebate87A: 60000,
      slabs: [
        { threshold: 0, rate: 0.0 },
        { threshold: 400000, rate: 0.05 },
        { threshold: 800000, rate: 0.10 },
        { threshold: 1200000, rate: 0.15 },
        { threshold: 1600000, rate: 0.20 },
        { threshold: 2000000, rate: 0.25 },
        { threshold: 2400000, rate: 0.30 },
      ],
    },
    '2024-25': {
      standardDeduction: 75000,
      rebate87ALimit: 700000, // Full rebate up to ₹7,00,000 taxable income (₹7.75L gross salary)
      maxRebate87A: 25000,
      slabs: [
        { threshold: 0, rate: 0.0 },
        { threshold: 300000, rate: 0.05 },
        { threshold: 700000, rate: 0.10 },
        { threshold: 1000000, rate: 0.15 },
        { threshold: 1200000, rate: 0.20 },
        { threshold: 1500000, rate: 0.30 },
      ],
    },
  },
  oldRegime: {
    standardDeduction: 50000,
    rebate87ALimit: 500000,
    maxRebate87A: 12500,
    basicExemptionByAge: {
      under60: 250000,
      senior60to79: 300000,
      superSenior80Plus: 500000,
    },
  },
  cessRate: 0.04,
  hraMetroCities: ['Delhi (NCR)', 'Mumbai', 'Kolkata', 'Chennai'],
  epfStatutoryWageCeilingMonthly: 15000, // ₹15,000/mo statutory EPF ceiling -> ₹1,800/mo (₹21,600/yr)
  professionalTaxByStateAnnual: {
    MH: { name: 'Maharashtra (Mumbai/Pune)', annualTax: 2500, monthlyNote: '₹200/mo (₹300 in Feb)' },
    KA: { name: 'Karnataka (Bengaluru)', annualTax: 2400, monthlyNote: '₹200/mo' },
    TN: { name: 'Tamil Nadu (Chennai)', annualTax: 2500, monthlyNote: '₹1,250 half-yearly' },
    TS: { name: 'Telangana (Hyderabad)', annualTax: 2400, monthlyNote: '₹200/mo' },
    WB: { name: 'West Bengal (Kolkata)', annualTax: 2400, monthlyNote: '₹200/mo' },
    DL: { name: 'Delhi / NCR / Haryana / UP', annualTax: 0, monthlyNote: '₹0 (No Professional Tax)' },
  },
};

// ============================================================================
// #39: VERIFIED INTERNATIONAL COUNTRY TAX PROFILES (GERMANY, FRANCE, UAE, SINGAPORE)
// ============================================================================
export interface InternationalTaxProfile {
  slug: string;
  flag: string;
  countryName: string;
  currencyCode: string;
  currencySymbol: string;
  taxYear: string;
  dateVerified: string;
  reviewerName: string;
  reviewerNote: string;
  authorityName: string;
  authorityUrl: string;
  filingDeadline: string;
  socialContributionSummary: string;
  notIncludedNotes: string[];
  whatIsNotIncluded: string[];
  description: string;
  source: VerifiedSourceMeta;
}

export const VERIFIED_INTERNATIONAL_COUNTRIES: Record<string, InternationalTaxProfile> = {
  germany: {
    slug: 'germany',
    flag: '🇩🇪',
    countryName: 'Germany',
    currencyCode: 'EUR',
    currencySymbol: '€',
    taxYear: '2025',
    dateVerified: '2025-02-15',
    reviewerName: 'BMF § 32a EStG 2025 Statutory Schedule',
    reviewerNote: 'BMF § 32a EStG 2025 Statutory Schedule',
    authorityName: 'Bundesministerium der Finanzen (BMF) / Finanzamt',
    authorityUrl: 'https://www.bundesfinanzministerium.de',
    filingDeadline: 'July 31, 2026 (for 2025 self-prepared Einkommensteuererklärung; April 30, 2027 with Steuerberater)',
    socialContributionSummary: 'Employee share: ~9.3% Pension (RV), ~8.15% Health (GKV incl. Zusatzbeitrag), ~1.3% Unemployment (AV), ~1.8% Care (PV) up to statutory Beitragsbemessungsgrenzen.',
    notIncludedNotes: [
      'Municipal trade tax (Gewerbesteuer) for commercial businesses',
      'Private health insurance (PKV) individual age-rated tariffs (statutory GKV is modeled)',
      'Capital gains flat tax (Abgeltungsteuer 25% + Soli)',
    ],
    whatIsNotIncluded: [
      'Municipal trade tax (Gewerbesteuer) for commercial businesses',
      'Private health insurance (PKV) individual age-rated tariffs (statutory GKV is modeled)',
      'Capital gains flat tax (Abgeltungsteuer 25% + Soli)',
    ],
    description: 'Official German progressive income tax (§32a EStG 2025 Grundfreibetrag €12,096), Solidaritätszuschlag, optional Kirchensteuer (8%/9%), and statutory social security (Renten-, Kranken-, Pflege-, Arbeitslosenversicherung).',
    source: {
      authority: 'Bundesministerium der Finanzen (BMF) / Finanzamt',
      document: 'Einkommensteuergesetz (§ 32a EStG 2025) & Sozialversicherungs-Rechengrößen 2025',
      url: 'https://www.bundesfinanzministerium.de',
      taxYear: '2025',
      dateVerified: '2025-02-15',
      verifiedDate: '2025-02-15',
    },
  },
  france: {
    slug: 'france',
    flag: '🇫🇷',
    countryName: 'France',
    currencyCode: 'EUR',
    currencySymbol: '€',
    taxYear: '2025 (Revenus 2024 / Barème 2025)',
    dateVerified: '2025-02-15',
    reviewerName: 'DGFiP CGI Art. 197 — Barème 2025',
    reviewerNote: 'DGFiP CGI Art. 197 — Barème 2025',
    authorityName: 'Direction Générale des Finances Publiques (DGFiP – impots.gouv.fr)',
    authorityUrl: 'https://www.impots.gouv.fr',
    filingDeadline: 'May 22 – June 5, 2025 (depending on French Département 01–95)',
    socialContributionSummary: 'Employee Cotisations Sociales & CSG/CRDS (~22% of gross salary), followed by a 10% standard professional expense deduction (capped at €14,171).',
    notIncludedNotes: [
      'Impôt sur la Fortune Immobilière (IFI real estate wealth tax above €1.3M)',
      'Flat tax (PFU 30%) on investment dividends and capital gains',
      'Local property taxes (Taxe foncière)',
    ],
    whatIsNotIncluded: [
      'Impôt sur la Fortune Immobilière (IFI real estate wealth tax above €1.3M)',
      'Flat tax (PFU 30%) on investment dividends and capital gains',
      'Local property taxes (Taxe foncière)',
    ],
    description: 'Official French Quotient Familial (family parts) progressive income tax schedule, 10% standard professional expense abatement (capped at €14,171), and ~22% employee social security & CSG/CRDS contributions.',
    source: {
      authority: 'Direction Générale des Finances Publiques (DGFiP – impots.gouv.fr)',
      document: 'Code Général des Impôts (CGI) Art. 197 — Barème 2025 & URSSAF Cotisations',
      url: 'https://www.impots.gouv.fr',
      taxYear: '2025',
      dateVerified: '2025-02-15',
      verifiedDate: '2025-02-15',
    },
  },
  uae: {
    slug: 'uae',
    flag: '🇦🇪',
    countryName: 'United Arab Emirates (UAE)',
    currencyCode: 'AED',
    currencySymbol: 'AED ',
    taxYear: '2025',
    dateVerified: '2025-02-15',
    reviewerName: 'UAE Federal Decree-Law No. 47 of 2022 & GPSSA Schedule',
    reviewerNote: 'UAE Federal Decree-Law No. 47 of 2022 & GPSSA Schedule',
    authorityName: 'UAE Federal Tax Authority (FTA) & GPSSA',
    authorityUrl: 'https://tax.gov.ae',
    filingDeadline: 'No Personal Income Tax filing required for individuals. Corporate Tax (9% above AED 375,000) due 9 months after fiscal year-end.',
    socialContributionSummary: '0% social security deduction for expatriate employees (eligible for End-of-Service Gratuity under UAE Labour Law); 5% GPSSA employee pension contribution for UAE Nationals (up to AED 50,000/mo cap).',
    notIncludedNotes: [
      'UAE Corporate Tax (9% on business net profit exceeding AED 375,000 for commercial entities)',
      '5% Value Added Tax (VAT) on consumer goods and services',
      'Municipality housing fees (typically 5% of annual rental contract in Dubai)',
    ],
    whatIsNotIncluded: [
      'UAE Corporate Tax (9% on business net profit exceeding AED 375,000 for commercial entities)',
      '5% Value Added Tax (VAT) on consumer goods and services',
      'Municipality housing fees (typically 5% of annual rental contract in Dubai)',
    ],
    description: '0% Personal Income Tax on employment salaries in the UAE, with optional 5% GPSSA employee pension contribution calculation for UAE/GCC Nationals and End-of-Service Gratuity accrual estimation for expatriates.',
    source: {
      authority: 'UAE Federal Tax Authority (FTA) & GPSSA',
      document: 'UAE Federal Decree-Law No. 47 of 2022 & GPSSA Pension Schedule (2025)',
      url: 'https://tax.gov.ae',
      taxYear: '2025',
      dateVerified: '2025-02-15',
      verifiedDate: '2025-02-15',
    },
  },
  singapore: {
    slug: 'singapore',
    flag: '🇸🇬',
    countryName: 'Singapore',
    currencyCode: 'SGD',
    currencySymbol: 'S$',
    taxYear: 'YA 2025 (Income Year 2024 / 2025)',
    dateVerified: '2025-02-15',
    reviewerName: 'IRAS YA 2025 Resident Schedule & CPF Board Caps',
    reviewerNote: 'IRAS YA 2025 Resident Schedule & CPF Board Caps',
    authorityName: 'Inland Revenue Authority of Singapore (IRAS) & CPF Board',
    authorityUrl: 'https://www.iras.gov.sg',
    filingDeadline: 'April 15 (Paper) / April 18 (e-Filing via myTax Portal)',
    socialContributionSummary: '20% Employee Central Provident Fund (CPF) contribution for Singapore Citizens & PRs (under age 55) up to the S$7,400/month Ordinary Wage ceiling (S$88,800/year) in 2025.',
    notIncludedNotes: [
      'Foreign Worker Levy (FWL) or Skills Development Levy (SDL paid by employer)',
      'Property tax or buyer/seller stamp duties (ABSD/BSD)',
      'Supplementary Retirement Scheme (SRS) voluntary top-ups unless entered in reliefs',
    ],
    whatIsNotIncluded: [
      'Foreign Worker Levy (FWL) or Skills Development Levy (SDL paid by employer)',
      'Property tax or buyer/seller stamp duties (ABSD/BSD)',
      'Supplementary Retirement Scheme (SRS) voluntary top-ups unless entered in reliefs',
    ],
    description: 'Official IRAS YA 2025 resident progressive tax brackets (0% up to S$20,000; top marginal rate 24% above S$1,000,000) vs 15%/24% Non-Resident employment tax, plus statutory Central Provident Fund (CPF) employee contribution (20% up to S$7,400/mo OW ceiling in 2025).',
    source: {
      authority: 'Inland Revenue Authority of Singapore (IRAS) & CPF Board',
      document: 'IRAS YA 2025 Resident Individual Income Tax Rates & 2025 CPF Contribution Caps',
      url: 'https://www.iras.gov.sg',
      taxYear: 'YA 2025',
      dateVerified: '2025-02-15',
      verifiedDate: '2025-02-15',
    },
  },
};

// ============================================================================
// #48: INDUSTRY PROFIT MARGIN BENCHMARKS (DAMODARAN NYU STERN JAN 2025)
// ============================================================================
export interface DamodaranIndustryBenchmark {
  id: string;
  sector: string;
  grossMarginPct: number;
  operatingMarginPct: number;
  netMarginPct: number;
  sampleFirms: number;
}

export const DAMODARAN_SECTOR_MARGINS_2025: {
  source: VerifiedSourceMeta;
  sectors: DamodaranIndustryBenchmark[];
} = {
  source: {
    authority: 'Prof. Aswath Damodaran, NYU Stern School of Business',
    document: 'Margins by Sector (US Equities Dataset, January 2025 Update)',
    url: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/margin.html',
    taxYear: '2025 Dataset',
    dateVerified: '2025-01-15',
    verifiedDate: '2025-01-15',
  },
  sectors: [
    { id: 'software-sys', sector: 'Software (System & Application)', grossMarginPct: 71.8, operatingMarginPct: 28.4, netMarginPct: 22.1, sampleFirms: 358 },
    { id: 'semiconductors', sector: 'Semiconductor & Equipment', grossMarginPct: 56.4, operatingMarginPct: 29.8, netMarginPct: 24.5, sampleFirms: 102 },
    { id: 'healthcare-info', sector: 'Healthcare Information & Tech', grossMarginPct: 51.2, operatingMarginPct: 12.6, netMarginPct: 7.4, sampleFirms: 124 },
    { id: 'drugs-pharma', sector: 'Pharmaceuticals & Biotechnology', grossMarginPct: 68.5, operatingMarginPct: 21.3, netMarginPct: 15.8, sampleFirms: 580 },
    { id: 'retail-general', sector: 'Retail (General & E-Commerce)', grossMarginPct: 31.4, operatingMarginPct: 6.8, netMarginPct: 4.5, sampleFirms: 215 },
    { id: 'retail-grocery', sector: 'Retail (Grocery & Food)', grossMarginPct: 25.1, operatingMarginPct: 3.2, netMarginPct: 1.9, sampleFirms: 42 },
    { id: 'restaurant', sector: 'Restaurants & Hospitality', grossMarginPct: 35.8, operatingMarginPct: 13.4, netMarginPct: 9.1, sampleFirms: 78 },
    { id: 'business-services', sector: 'Business & Consumer Services', grossMarginPct: 38.6, operatingMarginPct: 14.2, netMarginPct: 10.1, sampleFirms: 246 },
    { id: 'machinery', sector: 'Industrial Machinery & Manufacturing', grossMarginPct: 34.2, operatingMarginPct: 13.9, netMarginPct: 9.8, sampleFirms: 131 },
    { id: 'auto-parts', sector: 'Automotive & Parts', grossMarginPct: 18.9, operatingMarginPct: 6.4, netMarginPct: 4.2, sampleFirms: 84 },
    { id: 'total-market', sector: 'Total US Market Average (Ex-Financials)', grossMarginPct: 36.7, operatingMarginPct: 13.1, netMarginPct: 8.9, sampleFirms: 6120 },
  ],
};
