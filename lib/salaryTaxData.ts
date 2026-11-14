export type JurisdictionId = 'us' | 'uk' | 'ca' | 'au' | 'in';

export type PayFrequency = 'annual' | 'monthly' | 'biweekly' | 'weekly';

export type USFilingStatus = 'single' | 'married_joint' | 'head_of_household';

export type IndiaTaxRegime = 'new_regime' | 'old_regime';

export interface TaxBracketRule {
  min: number;
  max: number | null; // null means no upper limit
  rate: number; // decimal rate, e.g. 0.20 for 20%
  label?: string;
}

export interface OfficialSourceReference {
  authority: string;
  title: string;
  url: string;
  effectivePeriod: string;
}

export interface JurisdictionFieldSupport {
  supportsFilingStatus: boolean;
  supportsTaxRegime: boolean;
  supportsPreTaxPension: boolean;
  preTaxPensionLabel: string;
  preTaxPensionDescription: string;
  preTaxPensionMaxRatePercent: number;
  preTaxPensionAnnualCap?: number;
}

export interface JurisdictionTaxYearConfig {
  taxYearId: string;
  taxYearLabel: string;
  effectivePeriodLabel: string;
  verifiedDate: string;
  verificationStatus: 'Based on published statutory tax tables';
  defaultGrossAnnual: number;
  fieldSupport: JurisdictionFieldSupport;
  assumptions: string[];
  includedItems: string[];
  excludedItems: string[];
  roundingRuleNote: string;
  sources: OfficialSourceReference[];
}

export interface JurisdictionModule {
  id: JurisdictionId;
  countryName: string;
  regionScopeLabel: string;
  currencyCode: string;
  currencySymbol: string;
  locale: string;
  defaultTaxYearId: string;
  summaryNote: string;
  taxYears: Record<string, JurisdictionTaxYearConfig>;
}

export const PAY_FREQUENCY_OPTIONS: Array<{
  id: PayFrequency;
  label: string;
  periodsPerYear: number;
}> = [
  { id: 'annual', label: 'Annual (1 / year)', periodsPerYear: 1 },
  { id: 'monthly', label: 'Monthly (12 / year)', periodsPerYear: 12 },
  { id: 'biweekly', label: 'Bi-Weekly (26 / year)', periodsPerYear: 26 },
  { id: 'weekly', label: 'Weekly (52 / year)', periodsPerYear: 52 },
];

export const US_FILING_STATUS_OPTIONS: Array<{
  id: USFilingStatus;
  label: string;
}> = [
  { id: 'single', label: 'Single' },
  { id: 'married_joint', label: 'Married Filing Jointly' },
  { id: 'head_of_household', label: 'Head of Household' },
];

export const INDIA_TAX_REGIME_OPTIONS: Array<{
  id: IndiaTaxRegime;
  label: string;
  badge: string;
}> = [
  {
    id: 'new_regime',
    label: 'New Tax Regime (Section 115BAC)',
    badge: 'Default statutory regime',
  },
  {
    id: 'old_regime',
    label: 'Old Tax Regime (With 80C / EPF deduction)',
    badge: 'Optional regime',
  },
];

// Detailed Year-Specific Rules per Jurisdiction

export interface USTaxYearRules {
  standardDeduction: Record<USFilingStatus, number>;
  brackets: Record<USFilingStatus, TaxBracketRule[]>;
  socialSecurityRate: number;
  socialSecurityWageCap: number;
  medicareRate: number;
  additionalMedicareRate: number;
  additionalMedicareThreshold: Record<USFilingStatus, number>;
  preTax401kCap: number;
}

export const US_TAX_RULES: Record<string, USTaxYearRules> = {
  '2025': {
    standardDeduction: {
      single: 15000,
      married_joint: 30000,
      head_of_household: 22500,
    },
    brackets: {
      single: [
        { min: 0, max: 11925, rate: 0.10, label: '10% Federal Band' },
        { min: 11925, max: 48475, rate: 0.12, label: '12% Federal Band' },
        { min: 48475, max: 103350, rate: 0.22, label: '22% Federal Band' },
        { min: 103350, max: 197300, rate: 0.24, label: '24% Federal Band' },
        { min: 197300, max: 250525, rate: 0.32, label: '32% Federal Band' },
        { min: 250525, max: 626350, rate: 0.35, label: '35% Federal Band' },
        { min: 626350, max: null, rate: 0.37, label: '37% Federal Band' },
      ],
      married_joint: [
        { min: 0, max: 23850, rate: 0.10, label: '10% Federal Band' },
        { min: 23850, max: 96950, rate: 0.12, label: '12% Federal Band' },
        { min: 96950, max: 206700, rate: 0.22, label: '22% Federal Band' },
        { min: 206700, max: 394600, rate: 0.24, label: '24% Federal Band' },
        { min: 394600, max: 501050, rate: 0.32, label: '32% Federal Band' },
        { min: 501050, max: 751600, rate: 0.35, label: '35% Federal Band' },
        { min: 751600, max: null, rate: 0.37, label: '37% Federal Band' },
      ],
      head_of_household: [
        { min: 0, max: 17000, rate: 0.10, label: '10% Federal Band' },
        { min: 17000, max: 64850, rate: 0.12, label: '12% Federal Band' },
        { min: 64850, max: 103350, rate: 0.22, label: '22% Federal Band' },
        { min: 103350, max: 197300, rate: 0.24, label: '24% Federal Band' },
        { min: 197300, max: 250500, rate: 0.32, label: '32% Federal Band' },
        { min: 250500, max: 626350, rate: 0.35, label: '35% Federal Band' },
        { min: 626350, max: null, rate: 0.37, label: '37% Federal Band' },
      ],
    },
    socialSecurityRate: 0.062,
    socialSecurityWageCap: 176100,
    medicareRate: 0.0145,
    additionalMedicareRate: 0.009,
    additionalMedicareThreshold: {
      single: 200000,
      married_joint: 250000,
      head_of_household: 200000,
    },
    preTax401kCap: 23500,
  },
  '2024': {
    standardDeduction: {
      single: 14600,
      married_joint: 29200,
      head_of_household: 21900,
    },
    brackets: {
      single: [
        { min: 0, max: 11600, rate: 0.10, label: '10% Federal Band' },
        { min: 11600, max: 47150, rate: 0.12, label: '12% Federal Band' },
        { min: 47150, max: 100525, rate: 0.22, label: '22% Federal Band' },
        { min: 100525, max: 191950, rate: 0.24, label: '24% Federal Band' },
        { min: 191950, max: 243725, rate: 0.32, label: '32% Federal Band' },
        { min: 243725, max: 609350, rate: 0.35, label: '35% Federal Band' },
        { min: 609350, max: null, rate: 0.37, label: '37% Federal Band' },
      ],
      married_joint: [
        { min: 0, max: 23200, rate: 0.10, label: '10% Federal Band' },
        { min: 23200, max: 94300, rate: 0.12, label: '12% Federal Band' },
        { min: 94300, max: 201050, rate: 0.22, label: '22% Federal Band' },
        { min: 201050, max: 383900, rate: 0.24, label: '24% Federal Band' },
        { min: 383900, max: 487450, rate: 0.32, label: '32% Federal Band' },
        { min: 487450, max: 731200, rate: 0.35, label: '35% Federal Band' },
        { min: 731200, max: null, rate: 0.37, label: '37% Federal Band' },
      ],
      head_of_household: [
        { min: 0, max: 16550, rate: 0.10, label: '10% Federal Band' },
        { min: 16550, max: 63100, rate: 0.12, label: '12% Federal Band' },
        { min: 63100, max: 100500, rate: 0.22, label: '22% Federal Band' },
        { min: 100500, max: 191950, rate: 0.24, label: '24% Federal Band' },
        { min: 191950, max: 243700, rate: 0.32, label: '32% Federal Band' },
        { min: 243700, max: 609350, rate: 0.35, label: '35% Federal Band' },
        { min: 609350, max: null, rate: 0.37, label: '37% Federal Band' },
      ],
    },
    socialSecurityRate: 0.062,
    socialSecurityWageCap: 168600,
    medicareRate: 0.0145,
    additionalMedicareRate: 0.009,
    additionalMedicareThreshold: {
      single: 200000,
      married_joint: 250000,
      head_of_household: 200000,
    },
    preTax401kCap: 23000,
  },
};

export interface UKTaxYearRules {
  personalAllowance: number;
  allowanceTaperThreshold: number; // £100,000
  allowanceZeroThreshold: number; // £125,140
  taxableBands: TaxBracketRule[]; // Applied to taxable income after Personal Allowance
  niPrimaryThreshold: number; // £12,570
  niUpperEarningsLimit: number; // £50,270
  niMainRate: number; // 8%
  niUpperRate: number; // 2%
  preTaxPensionCap: number; // £60,000 Annual Allowance
}

export const UK_TAX_RULES: Record<string, UKTaxYearRules> = {
  '2025-26': {
    personalAllowance: 12570,
    allowanceTaperThreshold: 100000,
    allowanceZeroThreshold: 125140,
    taxableBands: [
      { min: 0, max: 37700, rate: 0.20, label: 'Basic Rate (20%)' },
      { min: 37700, max: 112570, rate: 0.40, label: 'Higher Rate (40%)' },
      { min: 112570, max: null, rate: 0.45, label: 'Additional Rate (45%)' },
    ],
    niPrimaryThreshold: 12570,
    niUpperEarningsLimit: 50270,
    niMainRate: 0.08,
    niUpperRate: 0.02,
    preTaxPensionCap: 60000,
  },
  '2024-25': {
    personalAllowance: 12570,
    allowanceTaperThreshold: 100000,
    allowanceZeroThreshold: 125140,
    taxableBands: [
      { min: 0, max: 37700, rate: 0.20, label: 'Basic Rate (20%)' },
      { min: 37700, max: 112570, rate: 0.40, label: 'Higher Rate (40%)' },
      { min: 112570, max: null, rate: 0.45, label: 'Additional Rate (45%)' },
    ],
    niPrimaryThreshold: 12570,
    niUpperEarningsLimit: 50270,
    niMainRate: 0.08,
    niUpperRate: 0.02,
    preTaxPensionCap: 60000,
  },
};

export interface CanadaTaxYearRules {
  basicPersonalAmountMax: number;
  basicPersonalAmountMin: number;
  bpaPhaseOutStart: number;
  bpaPhaseOutEnd: number;
  lowestCreditRate: number;
  brackets: TaxBracketRule[];
  cppBasicExemption: number;
  cppRate: number;
  cppYmpe: number;
  cpp2Rate: number;
  cppYampe: number;
  eiRate: number;
  eiMaxInsurableEarnings: number;
  rrspAnnualCap: number;
}

export const CANADA_TAX_RULES: Record<string, CanadaTaxYearRules> = {
  '2025': {
    basicPersonalAmountMax: 16129,
    basicPersonalAmountMin: 14538,
    bpaPhaseOutStart: 177882,
    bpaPhaseOutEnd: 253414,
    lowestCreditRate: 0.15,
    brackets: [
      { min: 0, max: 57375, rate: 0.15, label: '15% Federal Bracket' },
      { min: 57375, max: 114750, rate: 0.205, label: '20.5% Federal Bracket' },
      { min: 114750, max: 177882, rate: 0.26, label: '26% Federal Bracket' },
      { min: 177882, max: 253414, rate: 0.29, label: '29% Federal Bracket' },
      { min: 253414, max: null, rate: 0.33, label: '33% Federal Bracket' },
    ],
    cppBasicExemption: 3500,
    cppRate: 0.0595,
    cppYmpe: 71300,
    cpp2Rate: 0.04,
    cppYampe: 81200,
    eiRate: 0.0164,
    eiMaxInsurableEarnings: 65700,
    rrspAnnualCap: 32490,
  },
  '2024': {
    basicPersonalAmountMax: 15705,
    basicPersonalAmountMin: 14156,
    bpaPhaseOutStart: 173205,
    bpaPhaseOutEnd: 246752,
    lowestCreditRate: 0.15,
    brackets: [
      { min: 0, max: 55867, rate: 0.15, label: '15% Federal Bracket' },
      { min: 55867, max: 111733, rate: 0.205, label: '20.5% Federal Bracket' },
      { min: 111733, max: 173205, rate: 0.26, label: '26% Federal Bracket' },
      { min: 173205, max: 246752, rate: 0.29, label: '29% Federal Bracket' },
      { min: 246752, max: null, rate: 0.33, label: '33% Federal Bracket' },
    ],
    cppBasicExemption: 3500,
    cppRate: 0.0595,
    cppYmpe: 68500,
    cpp2Rate: 0.04,
    cppYampe: 73200,
    eiRate: 0.0166,
    eiMaxInsurableEarnings: 63200,
    rrspAnnualCap: 31560,
  },
};

export interface AustraliaTaxYearRules {
  brackets: TaxBracketRule[];
  litoMaxOffset: number;
  litoTier1Threshold: number;
  litoTier1WithdrawalRate: number;
  litoTier2Threshold: number;
  litoTier2WithdrawalRate: number;
  litoCutoutThreshold: number;
  medicareLevyRate: number;
  medicareLowIncomeThreshold: number;
  medicarePhaseInLimit: number;
  medicarePhaseInRate: number;
  concessionalSuperCap: number;
}

export const AUSTRALIA_TAX_RULES: Record<string, AustraliaTaxYearRules> = {
  '2024-25': {
    brackets: [
      { min: 0, max: 18200, rate: 0.0, label: 'Tax-Free Threshold (0%)' },
      { min: 18200, max: 45000, rate: 0.16, label: '16% Resident Band' },
      { min: 45000, max: 135000, rate: 0.30, label: '30% Resident Band' },
      { min: 135000, max: 190000, rate: 0.37, label: '37% Resident Band' },
      { min: 190000, max: null, rate: 0.45, label: '45% Resident Band' },
    ],
    litoMaxOffset: 700,
    litoTier1Threshold: 37500,
    litoTier1WithdrawalRate: 0.05,
    litoTier2Threshold: 45000,
    litoTier2WithdrawalRate: 0.015,
    litoCutoutThreshold: 66667,
    medicareLevyRate: 0.02,
    medicareLowIncomeThreshold: 26000,
    medicarePhaseInLimit: 32500,
    medicarePhaseInRate: 0.10,
    concessionalSuperCap: 30000,
  },
};

export interface IndiaRegimeRuleSet {
  standardDeduction: number;
  rebate87AThreshold: number;
  rebate87AMaxAmount: number;
  supportsMarginalReliefOnRebate: boolean;
  allows80CDeduction: boolean;
  max80CDeduction: number;
  brackets: TaxBracketRule[];
}

export interface IndiaTaxYearRules {
  cessRate: number; // 4% Health & Education Cess
  regimes: Record<IndiaTaxRegime, IndiaRegimeRuleSet>;
}

export const INDIA_TAX_RULES: Record<string, IndiaTaxYearRules> = {
  '2024-25': {
    cessRate: 0.04,
    regimes: {
      new_regime: {
        standardDeduction: 75000,
        rebate87AThreshold: 700000,
        rebate87AMaxAmount: 25000,
        supportsMarginalReliefOnRebate: true,
        allows80CDeduction: false,
        max80CDeduction: 0,
        brackets: [
          { min: 0, max: 300000, rate: 0.0, label: 'Nil Slab (Up to ₹3,00,000)' },
          { min: 300000, max: 700000, rate: 0.05, label: '5% Slab (₹3L – ₹7L)' },
          { min: 700000, max: 1000000, rate: 0.10, label: '10% Slab (₹7L – ₹10L)' },
          { min: 1000000, max: 1200000, rate: 0.15, label: '15% Slab (₹10L – ₹12L)' },
          { min: 1200000, max: 1500000, rate: 0.20, label: '20% Slab (₹12L – ₹15L)' },
          { min: 1500000, max: null, rate: 0.30, label: '30% Slab (Above ₹15L)' },
        ],
      },
      old_regime: {
        standardDeduction: 50000,
        rebate87AThreshold: 500000,
        rebate87AMaxAmount: 12500,
        supportsMarginalReliefOnRebate: false,
        allows80CDeduction: true,
        max80CDeduction: 150000,
        brackets: [
          { min: 0, max: 250000, rate: 0.0, label: 'Nil Slab (Up to ₹2,50,000)' },
          { min: 250000, max: 500000, rate: 0.05, label: '5% Slab (₹2.5L – ₹5L)' },
          { min: 500000, max: 1000000, rate: 0.20, label: '20% Slab (₹5L – ₹10L)' },
          { min: 1000000, max: null, rate: 0.30, label: '30% Slab (Above ₹10L)' },
        ],
      },
    },
  },
};

export const JURISDICTION_MODULES: Record<JurisdictionId, JurisdictionModule> = {
  us: {
    id: 'us',
    countryName: 'United States',
    regionScopeLabel: 'Federal Income Tax + FICA (Social Security & Medicare)',
    currencyCode: 'USD',
    currencySymbol: '$',
    locale: 'en-US',
    defaultTaxYearId: '2025',
    summaryNote:
      'Calculates IRS Federal Income Tax using standard deduction, progressive brackets, and statutory FICA payroll taxes (Social Security & Medicare). State and local income taxes vary by location and are excluded.',
    taxYears: {
      '2025': {
        taxYearId: '2025',
        taxYearLabel: '2025 Tax Year',
        effectivePeriodLabel: 'January 1, 2025 – December 31, 2025',
        verifiedDate: '2025-01-15',
        verificationStatus: 'Based on published statutory tax tables',
        defaultGrossAnnual: 85000,
        fieldSupport: {
          supportsFilingStatus: true,
          supportsTaxRegime: false,
          supportsPreTaxPension: true,
          preTaxPensionLabel: 'Pre-Tax 401(k) / Traditional Retirement (%)',
          preTaxPensionDescription:
            'Reduces federal taxable income (capped at $23,500 employee elective deferral for 2025). Note: 401(k) contributions remain subject to FICA Social Security and Medicare taxes.',
          preTaxPensionMaxRatePercent: 50,
          preTaxPensionAnnualCap: 23500,
        },
        assumptions: [
          'Taxpayer claims the standard deduction for the selected filing status ($15,000 Single; $30,000 Married Filing Jointly; $22,500 Head of Household).',
          'Income is earned W-2 employment wages subject to FICA Social Security (6.2% up to $176,100) and Medicare (1.45% plus 0.9% Additional Medicare Tax above statutory threshold).',
          'Optional pre-tax 401(k) contributions reduce federal taxable income up to the $23,500 annual elective deferral limit, but do not reduce FICA taxable wages.',
        ],
        includedItems: [
          'IRS Federal progressive income tax brackets (10% to 37%)',
          'Standard deduction by filing status',
          'FICA Social Security tax (6.2% up to $176,100 wage base cap)',
          'FICA Medicare tax (1.45% uncapped + 0.9% Additional Medicare Tax above threshold)',
          'Optional pre-tax 401(k) contribution deduction',
        ],
        excludedItems: [
          'State and municipal/city income taxes',
          'Itemized deductions (Schedule A), Child Tax Credit, or Earned Income Tax Credit',
          'Post-tax Roth contributions, health insurance premiums (Section 125), or HSA/FSA deductions',
        ],
        roundingRuleNote:
          'Intermediate bracket taxes are calculated at full precision and rounded to the nearest cent ($0.01) for display.',
        sources: [
          {
            authority: 'Internal Revenue Service (IRS)',
            title: 'IRS Revenue Procedure 2024-40 (2025 Inflation Adjustments & Tax Brackets)',
            url: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2025',
            effectivePeriod: '2025 Tax Year',
          },
          {
            authority: 'Social Security Administration (SSA)',
            title: '2025 Social Security OASDI Contribution and Benefit Base ($176,100)',
            url: 'https://www.ssa.gov/oact/cola/cbb.html',
            effectivePeriod: '2025 Calendar Year',
          },
        ],
      },
      '2024': {
        taxYearId: '2024',
        taxYearLabel: '2024 Tax Year',
        effectivePeriodLabel: 'January 1, 2024 – December 31, 2024',
        verifiedDate: '2025-01-15',
        verificationStatus: 'Based on published statutory tax tables',
        defaultGrossAnnual: 85000,
        fieldSupport: {
          supportsFilingStatus: true,
          supportsTaxRegime: false,
          supportsPreTaxPension: true,
          preTaxPensionLabel: 'Pre-Tax 401(k) / Traditional Retirement (%)',
          preTaxPensionDescription:
            'Reduces federal taxable income (capped at $23,000 employee elective deferral for 2024). Subject to FICA taxes.',
          preTaxPensionMaxRatePercent: 50,
          preTaxPensionAnnualCap: 23000,
        },
        assumptions: [
          'Taxpayer claims the 2024 standard deduction ($14,600 Single; $29,200 Married Filing Jointly; $21,900 Head of Household).',
          'Social Security tax applies at 6.2% up to the 2024 OASDI wage cap of $168,600.',
          'Medicare tax applies at 1.45% on all wages plus 0.9% Additional Medicare Tax above $200,000 ($250,000 Married Filing Jointly).',
        ],
        includedItems: [
          '2024 IRS Federal progressive income tax brackets',
          '2024 Standard deduction by filing status',
          '2024 FICA Social Security (6.2% up to $168,600) and Medicare tax',
          'Optional pre-tax 401(k) contribution deduction (capped at $23,000)',
        ],
        excludedItems: [
          'State and local income taxes',
          'Itemized deductions and family/dependent tax credits',
          'Employer health insurance or cafeteria plan deductions',
        ],
        roundingRuleNote:
          'Calculated at full precision and rounded to the nearest cent ($0.01).',
        sources: [
          {
            authority: 'Internal Revenue Service (IRS)',
            title: 'IRS Revenue Procedure 2023-34 (2024 Tax Year Inflation Adjustments)',
            url: 'https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2024',
            effectivePeriod: '2024 Tax Year',
          },
          {
            authority: 'Internal Revenue Service (IRS)',
            title: 'Publication 15 (Circular E), Employer’s Tax Guide',
            url: 'https://www.irs.gov/publications/p15',
            effectivePeriod: '2024 Tax Year',
          },
        ],
      },
    },
  },

  uk: {
    id: 'uk',
    countryName: 'United Kingdom',
    regionScopeLabel: 'England, Northern Ireland & Wales (PAYE Income Tax + Class 1 NI)',
    currencyCode: 'GBP',
    currencySymbol: '£',
    locale: 'en-GB',
    defaultTaxYearId: '2025-26',
    summaryNote:
      'Calculates HMRC PAYE Income Tax (including the £12,570 Personal Allowance and £100,000 high-income allowance taper) and Class 1 Employee National Insurance for England, Northern Ireland, and Wales.',
    taxYears: {
      '2025-26': {
        taxYearId: '2025-26',
        taxYearLabel: '2025/26 Tax Year',
        effectivePeriodLabel: '6 April 2025 – 5 April 2026',
        verifiedDate: '2025-04-06',
        verificationStatus: 'Based on published statutory tax tables',
        defaultGrossAnnual: 45000,
        fieldSupport: {
          supportsFilingStatus: false,
          supportsTaxRegime: false,
          supportsPreTaxPension: true,
          preTaxPensionLabel: 'Workplace Pension Contribution (Net Pay / Pre-Tax %)',
          preTaxPensionDescription:
            'Deducted from gross pay before Income Tax under a net-pay arrangement (capped at the £60,000 annual allowance). Standard Class 1 Employee NI is calculated on gross pay.',
          preTaxPensionMaxRatePercent: 50,
          preTaxPensionAnnualCap: 60000,
        },
        assumptions: [
          'Taxpayer is subject to England, Northern Ireland, and Wales income tax bands (tax code 1257L baseline).',
          'Standard Personal Allowance of £12,570 tapers down by £1 for every £2 of adjusted net income above £100,000 (reaching £0 at £125,140).',
          'Employee is in standard Class 1 National Insurance category A (8% on earnings between £12,570 and £50,270; 2% above £50,270).',
        ],
        includedItems: [
          'Standard Personal Allowance (£12,570) and high-income £100,000 taper calculation',
          'Basic (20%), Higher (40%), and Additional (45%) Income Tax bands',
          'Class 1 Employee National Insurance (8% main rate and 2% upper rate)',
          'Optional pre-tax workplace pension contribution',
        ],
        excludedItems: [
          'Scottish Income Tax bands (which use Starter, Basic, Intermediate, Higher, Advanced, and Top rates)',
          'Student loan or postgraduate loan repayments (Plan 1, 2, 4, 5)',
          'Marriage Allowance transfers or Blind Person’s Allowance',
        ],
        roundingRuleNote:
          'Calculated on an annualized basis and rounded to the nearest penny (£0.01).',
        sources: [
          {
            authority: 'HM Revenue & Customs (GOV.UK)',
            title: 'Income Tax rates and Personal Allowances',
            url: 'https://www.gov.uk/income-tax-rates',
            effectivePeriod: '6 April 2025 to 5 April 2026',
          },
          {
            authority: 'HM Revenue & Customs (GOV.UK)',
            title: 'Rates and thresholds for employers 2025 to 2026 (Class 1 National Insurance)',
            url: 'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2025-to-2026',
            effectivePeriod: '2025/26 Tax Year',
          },
        ],
      },
      '2024-25': {
        taxYearId: '2024-25',
        taxYearLabel: '2024/25 Tax Year',
        effectivePeriodLabel: '6 April 2024 – 5 April 2025',
        verifiedDate: '2025-01-15',
        verificationStatus: 'Based on published statutory tax tables',
        defaultGrossAnnual: 45000,
        fieldSupport: {
          supportsFilingStatus: false,
          supportsTaxRegime: false,
          supportsPreTaxPension: true,
          preTaxPensionLabel: 'Workplace Pension Contribution (Net Pay / Pre-Tax %)',
          preTaxPensionDescription:
            'Deducted from gross pay before Income Tax (up to £60,000 annual allowance).',
          preTaxPensionMaxRatePercent: 50,
          preTaxPensionAnnualCap: 60000,
        },
        assumptions: [
          'Applies England, Northern Ireland, and Wales 2024/25 tax bands and £12,570 Personal Allowance (with £100,000 taper).',
          'Applies the full-year 8% Class 1 Employee National Insurance main rate (effective from 6 April 2024) between £12,570 and £50,270, and 2% above £50,270.',
        ],
        includedItems: [
          'Personal Allowance (£12,570) with high-income taper above £100,000',
          'Basic (20%), Higher (40%), and Additional (45%) Income Tax bands',
          'Class 1 Employee National Insurance (8% / 2%)',
          'Optional pre-tax pension contribution',
        ],
        excludedItems: [
          'Scottish resident income tax rates',
          'Student loan repayments and Benefit-in-Kind (P11D) adjustments',
        ],
        roundingRuleNote: 'Rounded to the nearest penny (£0.01).',
        sources: [
          {
            authority: 'HM Revenue & Customs (GOV.UK)',
            title: 'Rates and thresholds for employers 2024 to 2025',
            url: 'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2024-to-2025',
            effectivePeriod: '2024/25 Tax Year',
          },
        ],
      },
    },
  },

  ca: {
    id: 'ca',
    countryName: 'Canada',
    regionScopeLabel: 'Federal Income Tax + CPP (Tier 1 & 2) + EI (Excludes Provincial Tax)',
    currencyCode: 'CAD',
    currencySymbol: 'CA$',
    locale: 'en-CA',
    defaultTaxYearId: '2025',
    summaryNote:
      'Calculates CRA Federal Income Tax (including the income-tested Federal Basic Personal Amount credit), Canada Pension Plan (CPP & CPP2), and Employment Insurance (EI) outside Quebec. Provincial/territorial income taxes vary by province and are excluded.',
    taxYears: {
      '2025': {
        taxYearId: '2025',
        taxYearLabel: '2025 Tax Year',
        effectivePeriodLabel: 'January 1, 2025 – December 31, 2025',
        verifiedDate: '2025-01-15',
        verificationStatus: 'Based on published statutory tax tables',
        defaultGrossAnnual: 75000,
        fieldSupport: {
          supportsFilingStatus: false,
          supportsTaxRegime: false,
          supportsPreTaxPension: true,
          preTaxPensionLabel: 'Pre-Tax RRSP / RPP Contribution (%)',
          preTaxPensionDescription:
            'Reduces federal taxable income up to the 2025 RRSP dollar limit ($32,490). CPP and EI are still calculated on gross insurable/pensionable employment earnings.',
          preTaxPensionMaxRatePercent: 30,
          preTaxPensionAnnualCap: 32490,
        },
        assumptions: [
          'Calculates CRA Federal income tax and non-refundable Federal Basic Personal Amount (BPA) credit ($16,129, phased down to $14,538 between $177,882 and $253,414).',
          'Includes 2025 CPP base contribution (5.95% on earnings between $3,500 and $71,300 YMPE) and second additional CPP2 contribution (4% between $71,300 and $81,200 YAMPE).',
          'Includes 2025 Employment Insurance (EI) employee premium outside Quebec (1.64% up to $65,700 maximum insurable earnings).',
          'Federal non-refundable tax credits for base EI premiums and base/enhanced CPP deduction rules are reflected.',
        ],
        includedItems: [
          'CRA 2025 Federal progressive tax brackets (15%, 20.5%, 26%, 29%, 33%)',
          'Federal Basic Personal Amount ($16,129 / $14,538) non-refundable credit',
          'CPP Tier 1 (5.95% up to $71,300) and CPP2 (4% from $71,300 to $81,200)',
          'Employment Insurance (EI) employee premium (1.64% up to $65,700)',
          'Optional RRSP pre-tax deduction (up to $32,490)',
        ],
        excludedItems: [
          'Provincial and territorial income taxes, surtaxes, and health premiums',
          'Quebec Parental Insurance Plan (QPIP) and Quebec Pension Plan (QPP) rates',
        ],
        roundingRuleNote: 'Rounded to the nearest cent (CA$0.01).',
        sources: [
          {
            authority: 'Canada Revenue Agency (CRA)',
            title: 'Canadian income tax rates for individuals – current and previous years',
            url: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html',
            effectivePeriod: '2025 Tax Year',
          },
          {
            authority: 'Canada Revenue Agency (CRA)',
            title: 'CPP contribution rates, maximums and exemptions & EI premium rates',
            url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/calculating-deductions/making-deductions/second-additional-cpp-contribution-rates-maximums.html',
            effectivePeriod: '2025 Calendar Year',
          },
        ],
      },
      '2024': {
        taxYearId: '2024',
        taxYearLabel: '2024 Tax Year',
        effectivePeriodLabel: 'January 1, 2024 – December 31, 2024',
        verifiedDate: '2025-01-15',
        verificationStatus: 'Based on published statutory tax tables',
        defaultGrossAnnual: 75000,
        fieldSupport: {
          supportsFilingStatus: false,
          supportsTaxRegime: false,
          supportsPreTaxPension: true,
          preTaxPensionLabel: 'Pre-Tax RRSP / RPP Contribution (%)',
          preTaxPensionDescription:
            'Reduces federal taxable income up to the 2024 RRSP dollar limit ($31,560).',
          preTaxPensionMaxRatePercent: 30,
          preTaxPensionAnnualCap: 31560,
        },
        assumptions: [
          'Applies 2024 CRA Federal tax brackets and Basic Personal Amount ($15,705 phased down to $14,156 above $173,205).',
          'Applies 2024 CPP1 (5.95% between $3,500 and $68,500 YMPE) and CPP2 (4% between $68,500 and $73,200 YAMPE).',
          'Applies 2024 EI employee premium rate of 1.66% up to $63,200 maximum insurable earnings.',
        ],
        includedItems: [
          '2024 CRA Federal tax brackets',
          '2024 Federal Basic Personal Amount credit',
          '2024 CPP1 & CPP2 contributions and EI premiums',
          'Optional RRSP deduction (up to $31,560)',
        ],
        excludedItems: [
          'Provincial and territorial income taxes',
          'Quebec QPP/QPIP specific rates',
        ],
        roundingRuleNote: 'Rounded to the nearest cent (CA$0.01).',
        sources: [
          {
            authority: 'Canada Revenue Agency (CRA)',
            title: 'Payroll Deductions Formulas (T4127) – 2024',
            url: 'https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4127.html',
            effectivePeriod: '2024 Tax Year',
          },
        ],
      },
    },
  },

  au: {
    id: 'au',
    countryName: 'Australia',
    regionScopeLabel: 'ATO Resident Income Tax + LITO + Medicare Levy',
    currencyCode: 'AUD',
    currencySymbol: 'A$',
    locale: 'en-AU',
    defaultTaxYearId: '2024-25',
    summaryNote:
      'Calculates Australian Resident Income Tax under the 2024–25 Stage 3 tax rates, Low Income Tax Offset (LITO), and the 2% Medicare Levy (including low-income phase-in thresholds).',
    taxYears: {
      '2024-25': {
        taxYearId: '2024-25',
        taxYearLabel: '2024–25 Financial Year',
        effectivePeriodLabel: '1 July 2024 – 30 June 2025',
        verifiedDate: '2025-01-15',
        verificationStatus: 'Based on published statutory tax tables',
        defaultGrossAnnual: 95000,
        fieldSupport: {
          supportsFilingStatus: false,
          supportsTaxRegime: false,
          supportsPreTaxPension: true,
          preTaxPensionLabel: 'Voluntary Salary Sacrifice Super (%)',
          preTaxPensionDescription:
            'Reduces assessable taxable income (capped at $30,000 concessional cap for 2024–25). Note: Employer Superannuation Guarantee (11.5%) is paid on top of ordinary time earnings unless packaged.',
          preTaxPensionMaxRatePercent: 30,
          preTaxPensionAnnualCap: 30000,
        },
        assumptions: [
          'Taxpayer is an Australian resident for tax purposes for the full 2024–25 income year and claims the $18,200 tax-free threshold.',
          'Applies the enacted Stage 3 resident tax brackets (0% up to $18,200; 16% on $18,201–$45,000; 30% on $45,001–$135,000; 37% on $135,001–$190,000; 45% above $190,000).',
          'Includes the Low Income Tax Offset (LITO) of up to $700, phasing out between $37,500 and $66,667.',
          'Includes the standard 2% Medicare Levy (with single low-income exemption below $26,000 and 10% phase-in up to $32,500).',
        ],
        includedItems: [
          '2024–25 Australian resident income tax brackets ($18,200 tax-free threshold)',
          'Low Income Tax Offset (LITO up to $700)',
          'Medicare Levy (2% standard rate with low-income phase-in)',
          'Optional pre-tax salary sacrifice superannuation reduction',
        ],
        excludedItems: [
          'Medicare Levy Surcharge (1%–1.5% for high earners without private hospital cover)',
          'HELP / HECS / VET Student Loan compulsory repayments',
          'Foreign resident or Working Holiday Maker (417/462) tax rates',
        ],
        roundingRuleNote: 'Rounded to the nearest cent (A$0.01).',
        sources: [
          {
            authority: 'Australian Taxation Office (ATO)',
            title: 'Tax rates – Australian resident (2024–25 and 2025–26)',
            url: 'https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents',
            effectivePeriod: '1 July 2024 to 30 June 2025',
          },
          {
            authority: 'Australian Taxation Office (ATO)',
            title: 'Low income tax offset (LITO) & Medicare levy thresholds',
            url: 'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset',
            effectivePeriod: '2024–25 Income Year',
          },
        ],
      },
    },
  },

  in: {
    id: 'in',
    countryName: 'India',
    regionScopeLabel: 'Salaried Income Tax (New & Old Regimes) + Section 87A Rebate + 4% Cess',
    currencyCode: 'INR',
    currencySymbol: '₹',
    locale: 'en-IN',
    defaultTaxYearId: '2024-25',
    summaryNote:
      'Calculates Indian salaried income tax for FY 2024–25 (AY 2025–26) under either the New Tax Regime (Section 115BAC with ₹75,000 standard deduction and ₹7,00,000 rebate limit) or Old Tax Regime (with ₹50,000 standard deduction and optional 80C/EPF deduction), plus 4% Health & Education Cess.',
    taxYears: {
      '2024-25': {
        taxYearId: '2024-25',
        taxYearLabel: 'FY 2024–25 (AY 2025–26)',
        effectivePeriodLabel: '1 April 2024 – 31 March 2025',
        verifiedDate: '2025-01-15',
        verificationStatus: 'Based on published statutory tax tables',
        defaultGrossAnnual: 1200000,
        fieldSupport: {
          supportsFilingStatus: false,
          supportsTaxRegime: true,
          supportsPreTaxPension: true,
          preTaxPensionLabel: 'Employee EPF / Section 80C Deduction (%)',
          preTaxPensionDescription:
            'Deducted from gross salary. In the Old Tax Regime, reduces taxable income up to the ₹1,50,000 Section 80C limit. In the New Tax Regime, employee 80C contributions are not tax-deductible but still reduce cash take-home pay if contributed.',
          preTaxPensionMaxRatePercent: 25,
          preTaxPensionAnnualCap: 150000,
        },
        assumptions: [
          'Taxpayer is a resident salaried individual below 60 years of age.',
          'New Tax Regime (Section 115BAC) applies the enhanced ₹75,000 Standard Deduction enacted in Finance (No. 2) Act 2024 and Section 87A rebate up to ₹7,00,000 taxable income (with marginal relief just above ₹7,00,000).',
          'Old Tax Regime applies the ₹50,000 Standard Deduction, optional Section 80C deduction (up to ₹1,50,000), and Section 87A rebate up to ₹5,00,000 taxable income.',
          '4% Health and Education Cess is levied on income tax after Section 87A rebate.',
        ],
        includedItems: [
          'Standard Deduction (₹75,000 in New Regime / ₹50,000 in Old Regime)',
          'Progressive income tax slabs for FY 2024–25 (AY 2025–26)',
          'Section 87A tax rebate (up to ₹25,000 in New Regime / ₹12,500 in Old Regime) + marginal relief',
          '4% Health & Education Cess',
          'Optional Employee EPF / 80C deduction (tax-deductible under Old Regime up to ₹1,50,000)',
        ],
        excludedItems: [
          'High-income surcharge on total income exceeding ₹50,00,000 (10% to 37%)',
          'State-level Professional Tax (typically ₹200/month in applicable states)',
          'House Rent Allowance (HRA), Leave Travel Allowance (LTA), or Section 80D medical insurance deductions',
        ],
        roundingRuleNote:
          'Taxable income and final tax liability are rounded to the nearest rupee (₹1) in accordance with Section 288A/288B.',
        sources: [
          {
            authority: 'Income Tax Department, Government of India',
            title: 'Salaried Individuals for AY 2025–26 (FY 2024–25) Tax Slabs & Section 115BAC',
            url: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1',
            effectivePeriod: 'FY 2024–25 (AY 2025–26)',
          },
        ],
      },
    },
  },
};

export const JURISDICTION_LIST: JurisdictionModule[] = [
  JURISDICTION_MODULES.us,
  JURISDICTION_MODULES.uk,
  JURISDICTION_MODULES.ca,
  JURISDICTION_MODULES.au,
  JURISDICTION_MODULES.in,
];
