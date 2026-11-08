import {
  AUSTRALIA_TAX_RULES,
  CANADA_TAX_RULES,
  INDIA_TAX_RULES,
  JURISDICTION_MODULES,
  PAY_FREQUENCY_OPTIONS,
  UK_TAX_RULES,
  US_TAX_RULES,
} from './salaryTaxData.ts';

import type {
  IndiaTaxRegime,
  JurisdictionId,
  JurisdictionModule,
  JurisdictionTaxYearConfig,
  PayFrequency,
  TaxBracketRule,
  USFilingStatus,
} from './salaryTaxData.ts';

export interface SalaryCalculationInput {
  jurisdictionId: JurisdictionId;
  taxYearId: string;
  grossAmount: number;
  payFrequency: PayFrequency;
  usFilingStatus?: USFilingStatus;
  indiaTaxRegime?: IndiaTaxRegime;
  preTaxPensionPercent?: number;
}

export interface BracketBreakdownRow {
  label: string;
  min: number;
  max: number | null;
  ratePercent: number;
  taxableAmountInBracket: number;
  taxForBracket: number;
}

export interface DeductionLineItem {
  id: string;
  label: string;
  annualAmount: number;
  category: 'income_tax' | 'social_contribution' | 'pre_tax_pension';
  note?: string;
}

export interface PeriodBreakdownRow {
  frequency: PayFrequency;
  label: string;
  periodsPerYear: number;
  grossPay: number;
  preTaxPension: number;
  incomeTax: number;
  socialContributions: number;
  totalDeductions: number;
  netPay: number;
}

export interface SalaryCalculationSuccess {
  ok: true;
  jurisdiction: JurisdictionModule;
  taxYearConfig: JurisdictionTaxYearConfig;
  grossAnnual: number;
  preTaxPensionAnnual: number;
  preTaxPensionCapped: boolean;
  statutoryAllowanceOrDeductionAnnual: number;
  statutoryAllowanceLabel: string;
  taxableIncomeAnnual: number;
  grossBracketTaxAnnual: number;
  taxCreditsOrRebatesAnnual: number;
  taxCreditsLabel?: string;
  incomeTaxAnnual: number;
  socialContributionsAnnual: number;
  totalTaxAndStatutoryAnnual: number;
  totalAllDeductionsAnnual: number;
  netPayAnnual: number;
  effectiveTaxAndStatutoryRatePercent: number;
  effectiveIncomeTaxOnlyRatePercent: number;
  marginalIncomeTaxRatePercent: number;
  marginalCombinedRateNote: string;
  bracketBreakdown: BracketBreakdownRow[];
  deductionLineItems: DeductionLineItem[];
  periodBreakdowns: Record<PayFrequency, PeriodBreakdownRow>;
  calculationSteps: string[];
}

export interface SalaryCalculationError {
  ok: false;
  errorMessage: string;
}

export type SalaryCalculationResult =
  | SalaryCalculationSuccess
  | SalaryCalculationError;

/**
 * Decimal-safe currency rounding (2 decimal places for USD/GBP/CAD/AUD, integer or 2 decimal places).
 */
export function roundMoney(value: number, decimals = 2): number {
  if (!Number.isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function roundPercent(value: number, decimals = 2): number {
  if (!Number.isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatCurrencyAmount(
  amount: number,
  jurisdictionId: JurisdictionId,
  options?: { maximumFractionDigits?: number }
): string {
  const mod = JURISDICTION_MODULES[jurisdictionId];
  const maxDecimals =
    options?.maximumFractionDigits ?? (jurisdictionId === 'in' ? 0 : 2);
  const minDecimals = jurisdictionId === 'in' ? 0 : maxDecimals;
  return new Intl.NumberFormat(mod.locale, {
    style: 'currency',
    currency: mod.currencyCode,
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(amount);
}

function evaluateProgressiveBrackets(
  taxableIncome: number,
  brackets: TaxBracketRule[],
  decimals = 2
): {
  totalBracketTax: number;
  marginalRatePercent: number;
  breakdown: BracketBreakdownRow[];
} {
  let totalTax = 0;
  let marginalRate = 0;
  const breakdown: BracketBreakdownRow[] = [];

  for (const bracket of brackets) {
    const bandWidth =
      bracket.max === null ? Infinity : Math.max(0, bracket.max - bracket.min);
    const amountInBand =
      taxableIncome > bracket.min
        ? Math.min(taxableIncome - bracket.min, bandWidth)
        : 0;
    const rawBandTax = amountInBand * bracket.rate;
    const bandTax = roundMoney(rawBandTax, decimals);
    totalTax += rawBandTax;

    if (amountInBand > 0 || (taxableIncome === 0 && bracket.min === 0)) {
      marginalRate = roundPercent(bracket.rate * 100, 2);
    }

    breakdown.push({
      label:
        bracket.label ??
        `${roundPercent(bracket.rate * 100, 2)}% Tax Bracket`,
      min: bracket.min,
      max: bracket.max,
      ratePercent: roundPercent(bracket.rate * 100, 2),
      taxableAmountInBracket: roundMoney(amountInBand, decimals),
      taxForBracket: bandTax,
    });
  }

  return {
    totalBracketTax: roundMoney(totalTax, decimals),
    marginalRatePercent: marginalRate,
    breakdown,
  };
}

function computePreTaxPension(
  grossAnnual: number,
  requestedPercent: number | undefined,
  annualCap: number | undefined,
  maxPercent: number,
  decimals = 2
): { amount: number; capped: boolean } {
  const pct = Math.max(0, Math.min(maxPercent, requestedPercent ?? 0));
  if (pct <= 0 || grossAnnual <= 0) {
    return { amount: 0, capped: false };
  }
  const rawContribution = roundMoney((grossAnnual * pct) / 100, decimals);
  if (annualCap !== undefined && rawContribution > annualCap) {
    return { amount: annualCap, capped: true };
  }
  return { amount: rawContribution, capped: false };
}

export function calculateSalaryTakeHome(
  input: SalaryCalculationInput
): SalaryCalculationResult {
  const jurisdiction = JURISDICTION_MODULES[input.jurisdictionId];
  if (!jurisdiction) {
    return {
      ok: false,
      errorMessage: 'Unsupported country or jurisdiction selected.',
    };
  }

  const taxYearConfig =
    jurisdiction.taxYears[input.taxYearId] ??
    jurisdiction.taxYears[jurisdiction.defaultTaxYearId];

  if (!taxYearConfig) {
    return {
      ok: false,
      errorMessage: 'Unsupported tax year for the selected jurisdiction.',
    };
  }

  if (!Number.isFinite(input.grossAmount) || input.grossAmount < 0) {
    return {
      ok: false,
      errorMessage: 'Please enter a valid non-negative gross salary amount.',
    };
  }

  const freqOption =
    PAY_FREQUENCY_OPTIONS.find((f) => f.id === input.payFrequency) ??
    PAY_FREQUENCY_OPTIONS[0];

  const decimals = input.jurisdictionId === 'in' ? 0 : 2;
  const grossAnnual = roundMoney(
    input.grossAmount * freqOption.periodsPerYear,
    decimals
  );

  const pensionPct = input.preTaxPensionPercent ?? 0;
  if (
    !Number.isFinite(pensionPct) ||
    pensionPct < 0 ||
    pensionPct > taxYearConfig.fieldSupport.preTaxPensionMaxRatePercent
  ) {
    return {
      ok: false,
      errorMessage: `Pre-tax pension contribution must be between 0% and ${taxYearConfig.fieldSupport.preTaxPensionMaxRatePercent}%.`,
    };
  }

  const { amount: preTaxPensionAnnual, capped: preTaxPensionCapped } =
    computePreTaxPension(
      grossAnnual,
      pensionPct,
      taxYearConfig.fieldSupport.preTaxPensionAnnualCap,
      taxYearConfig.fieldSupport.preTaxPensionMaxRatePercent,
      decimals
    );

  let statutoryAllowanceOrDeductionAnnual = 0;
  let statutoryAllowanceLabel = 'Standard Allowance / Deduction';
  let taxableIncomeAnnual = 0;
  let grossBracketTaxAnnual = 0;
  let taxCreditsOrRebatesAnnual = 0;
  let taxCreditsLabel: string | undefined;
  let incomeTaxAnnual = 0;
  let socialContributionsAnnual = 0;
  let marginalIncomeTaxRatePercent = 0;
  let marginalCombinedRateNote = '';
  let bracketBreakdown: BracketBreakdownRow[] = [];
  const deductionLineItems: DeductionLineItem[] = [];
  const calculationSteps: string[] = [];

  if (input.jurisdictionId === 'us') {
    const filingStatus: USFilingStatus = input.usFilingStatus ?? 'single';
    const rules = US_TAX_RULES[taxYearConfig.taxYearId] ?? US_TAX_RULES['2025'];
    const standardDeduction = rules.standardDeduction[filingStatus];
    statutoryAllowanceOrDeductionAnnual = standardDeduction;
    statutoryAllowanceLabel = `IRS Standard Deduction (${
      filingStatus === 'married_joint'
        ? 'Married Filing Jointly'
        : filingStatus === 'head_of_household'
          ? 'Head of Household'
          : 'Single'
    })`;

    const adjustedGrossIncome = Math.max(0, grossAnnual - preTaxPensionAnnual);
    taxableIncomeAnnual = roundMoney(
      Math.max(0, adjustedGrossIncome - standardDeduction),
      decimals
    );

    const bracketEval = evaluateProgressiveBrackets(
      taxableIncomeAnnual,
      rules.brackets[filingStatus],
      decimals
    );
    grossBracketTaxAnnual = bracketEval.totalBracketTax;
    incomeTaxAnnual = grossBracketTaxAnnual;
    marginalIncomeTaxRatePercent =
      taxableIncomeAnnual > 0 ? bracketEval.marginalRatePercent : 0;
    bracketBreakdown = bracketEval.breakdown;

    // FICA Social Security (6.2% up to wage cap on gross W-2 wages)
    const ssTaxableWages = Math.min(grossAnnual, rules.socialSecurityWageCap);
    const socialSecurityTax = roundMoney(
      ssTaxableWages * rules.socialSecurityRate,
      decimals
    );

    // FICA Medicare (1.45% on all wages + 0.9% above threshold)
    const baseMedicareTax = roundMoney(
      grossAnnual * rules.medicareRate,
      decimals
    );
    const addMedThreshold = rules.additionalMedicareThreshold[filingStatus];
    const addMedTaxable = Math.max(0, grossAnnual - addMedThreshold);
    const additionalMedicareTax = roundMoney(
      addMedTaxable * rules.additionalMedicareRate,
      decimals
    );
    const totalMedicareTax = roundMoney(
      baseMedicareTax + additionalMedicareTax,
      decimals
    );

    socialContributionsAnnual = roundMoney(
      socialSecurityTax + totalMedicareTax,
      decimals
    );

    if (preTaxPensionAnnual > 0) {
      deductionLineItems.push({
        id: 'us_401k',
        label: 'Pre-Tax 401(k) / Traditional Retirement',
        annualAmount: preTaxPensionAnnual,
        category: 'pre_tax_pension',
        note: preTaxPensionCapped
          ? `Capped at IRS annual elective deferral limit ($${rules.preTax401kCap.toLocaleString()})`
          : `${pensionPct}% of gross pay`,
      });
    }
    deductionLineItems.push({
      id: 'us_fed_tax',
      label: 'Federal Income Tax',
      annualAmount: incomeTaxAnnual,
      category: 'income_tax',
      note: `Progressive brackets on $${taxableIncomeAnnual.toLocaleString()} taxable income`,
    });
    deductionLineItems.push({
      id: 'us_ss',
      label: 'FICA Social Security (6.2%)',
      annualAmount: socialSecurityTax,
      category: 'social_contribution',
      note: `Capped at $${rules.socialSecurityWageCap.toLocaleString()} annual wage base`,
    });
    deductionLineItems.push({
      id: 'us_medicare',
      label:
        additionalMedicareTax > 0
          ? 'FICA Medicare (1.45% + 0.9% Additional)'
          : 'FICA Medicare (1.45%)',
      annualAmount: totalMedicareTax,
      category: 'social_contribution',
      note:
        additionalMedicareTax > 0
          ? `Includes $${additionalMedicareTax.toLocaleString()} Additional Medicare Tax above $${addMedThreshold.toLocaleString()}`
          : '1.45% on all covered wages',
    });

    const marginalFica =
      (grossAnnual < rules.socialSecurityWageCap ? 6.2 : 0) +
      1.45 +
      (grossAnnual > addMedThreshold ? 0.9 : 0);
    marginalCombinedRateNote = `${marginalIncomeTaxRatePercent}% Federal marginal bracket + ${roundPercent(marginalFica, 2)}% marginal FICA rate.`;

    calculationSteps.push(
      `Annualized Gross Income: ${formatCurrencyAmount(grossAnnual, 'us')}.`,
      preTaxPensionAnnual > 0
        ? `Subtracted Pre-Tax 401(k) contribution of ${formatCurrencyAmount(preTaxPensionAnnual, 'us')} to arrive at ${formatCurrencyAmount(adjustedGrossIncome, 'us')} Adjusted Gross Income.`
        : `No pre-tax 401(k) deduction entered (AGI = ${formatCurrencyAmount(adjustedGrossIncome, 'us')}).`,
      `Subtracted ${statutoryAllowanceLabel} of ${formatCurrencyAmount(standardDeduction, 'us')} to arrive at ${formatCurrencyAmount(taxableIncomeAnnual, 'us')} Federal Taxable Income.`,
      `Applied IRS progressive tax brackets to calculate ${formatCurrencyAmount(incomeTaxAnnual, 'us')} in Federal Income Tax.`,
      `Calculated FICA Social Security (${formatCurrencyAmount(socialSecurityTax, 'us')}) and Medicare (${formatCurrencyAmount(totalMedicareTax, 'us')}) on gross wages.`
    );
  } else if (input.jurisdictionId === 'uk') {
    const rules =
      UK_TAX_RULES[taxYearConfig.taxYearId] ?? UK_TAX_RULES['2025-26'];
    const adjustedNetIncome = Math.max(0, grossAnnual - preTaxPensionAnnual);

    // Personal Allowance taper: £1 lost for every £2 over £100,000
    let personalAllowance = rules.personalAllowance;
    if (adjustedNetIncome > rules.allowanceTaperThreshold) {
      const reduction = Math.floor(
        (adjustedNetIncome - rules.allowanceTaperThreshold) / 2
      );
      personalAllowance = Math.max(0, rules.personalAllowance - reduction);
    }

    statutoryAllowanceOrDeductionAnnual = personalAllowance;
    statutoryAllowanceLabel =
      personalAllowance < rules.personalAllowance
        ? 'Tapered Personal Allowance (Adjusted Net Income > £100,000)'
        : 'Standard Personal Allowance (1257L)';

    taxableIncomeAnnual = roundMoney(
      Math.max(0, adjustedNetIncome - personalAllowance),
      decimals
    );

    const bracketEval = evaluateProgressiveBrackets(
      taxableIncomeAnnual,
      rules.taxableBands,
      decimals
    );
    grossBracketTaxAnnual = bracketEval.totalBracketTax;
    incomeTaxAnnual = grossBracketTaxAnnual;
    marginalIncomeTaxRatePercent =
      taxableIncomeAnnual > 0 ? bracketEval.marginalRatePercent : 0;
    bracketBreakdown = bracketEval.breakdown;

    // Class 1 Employee National Insurance (on gross pay)
    const niMainBandEarnings = Math.max(
      0,
      Math.min(grossAnnual, rules.niUpperEarningsLimit) -
        rules.niPrimaryThreshold
    );
    const niUpperBandEarnings = Math.max(
      0,
      grossAnnual - rules.niUpperEarningsLimit
    );
    const niAnnual = roundMoney(
      niMainBandEarnings * rules.niMainRate +
        niUpperBandEarnings * rules.niUpperRate,
      decimals
    );
    socialContributionsAnnual = niAnnual;

    if (preTaxPensionAnnual > 0) {
      deductionLineItems.push({
        id: 'uk_pension',
        label: 'Workplace Pension (Pre-Tax)',
        annualAmount: preTaxPensionAnnual,
        category: 'pre_tax_pension',
        note: `${pensionPct}% of gross pay`,
      });
    }
    deductionLineItems.push({
      id: 'uk_income_tax',
      label: 'HMRC PAYE Income Tax',
      annualAmount: incomeTaxAnnual,
      category: 'income_tax',
      note: `Personal Allowance applied: ${formatCurrencyAmount(personalAllowance, 'uk')}`,
    });
    deductionLineItems.push({
      id: 'uk_ni',
      label: 'Class 1 Employee National Insurance',
      annualAmount: niAnnual,
      category: 'social_contribution',
      note: '8% (£12,570–£50,270) + 2% (above £50,270)',
    });

    const inAllowanceTaperZone =
      adjustedNetIncome > rules.allowanceTaperThreshold &&
      adjustedNetIncome < rules.allowanceZeroThreshold;
    marginalCombinedRateNote = inAllowanceTaperZone
      ? `Includes the £100,000–£125,140 Personal Allowance taper zone (effective 60% marginal Income Tax rate + 2% NI).`
      : `${marginalIncomeTaxRatePercent}% marginal Income Tax band + ${
          grossAnnual > rules.niUpperEarningsLimit
            ? '2%'
            : grossAnnual > rules.niPrimaryThreshold
              ? '8%'
              : '0%'
        } marginal Class 1 NI.`;

    calculationSteps.push(
      `Annualized Gross Income: ${formatCurrencyAmount(grossAnnual, 'uk')}.`,
      preTaxPensionAnnual > 0
        ? `Subtracted Pre-Tax Workplace Pension of ${formatCurrencyAmount(preTaxPensionAnnual, 'uk')} to get ${formatCurrencyAmount(adjustedNetIncome, 'uk')} Adjusted Net Income.`
        : `Adjusted Net Income: ${formatCurrencyAmount(adjustedNetIncome, 'uk')}.`,
      `Applied ${statutoryAllowanceLabel} of ${formatCurrencyAmount(personalAllowance, 'uk')} to arrive at ${formatCurrencyAmount(taxableIncomeAnnual, 'uk')} Taxable Income.`,
      `Calculated UK Income Tax across Basic (20%), Higher (40%), and Additional (45%) bands: ${formatCurrencyAmount(incomeTaxAnnual, 'uk')}.`,
      `Calculated Class 1 Employee National Insurance: ${formatCurrencyAmount(niAnnual, 'uk')}.`
    );
  } else if (input.jurisdictionId === 'ca') {
    const rules =
      CANADA_TAX_RULES[taxYearConfig.taxYearId] ?? CANADA_TAX_RULES['2025'];

    // CPP Tier 1 & Tier 2
    const cpp1Pensionable = Math.max(
      0,
      Math.min(grossAnnual, rules.cppYmpe) - rules.cppBasicExemption
    );
    const cpp1Annual = roundMoney(cpp1Pensionable * rules.cppRate, decimals);
    // Base CPP (4.95%) generates a 15% federal credit; enhanced CPP1 (1.00%) and CPP2 (4.00%) are tax deductions
    const cpp1EnhancedDeduction = roundMoney(cpp1Pensionable * 0.01, decimals);
    const cpp1BaseForCredit = roundMoney(
      cpp1Annual - cpp1EnhancedDeduction,
      decimals
    );

    const cpp2Pensionable = Math.max(
      0,
      Math.min(grossAnnual, rules.cppYampe) - rules.cppYmpe
    );
    const cpp2Annual = roundMoney(cpp2Pensionable * rules.cpp2Rate, decimals);

    // EI
    const eiInsurable = Math.min(grossAnnual, rules.eiMaxInsurableEarnings);
    const eiAnnual = roundMoney(eiInsurable * rules.eiRate, decimals);

    socialContributionsAnnual = roundMoney(
      cpp1Annual + cpp2Annual + eiAnnual,
      decimals
    );

    // Taxable income after RRSP and enhanced CPP/CPP2 deductions
    const statutoryCppDeduction = roundMoney(
      cpp1EnhancedDeduction + cpp2Annual,
      decimals
    );
    taxableIncomeAnnual = roundMoney(
      Math.max(
        0,
        grossAnnual - preTaxPensionAnnual - statutoryCppDeduction
      ),
      decimals
    );

    // Federal Basic Personal Amount (BPA) with high-income phase-out
    let bpa = rules.basicPersonalAmountMax;
    if (taxableIncomeAnnual > rules.bpaPhaseOutEnd) {
      bpa = rules.basicPersonalAmountMin;
    } else if (taxableIncomeAnnual > rules.bpaPhaseOutStart) {
      const ratio =
        (taxableIncomeAnnual - rules.bpaPhaseOutStart) /
        (rules.bpaPhaseOutEnd - rules.bpaPhaseOutStart);
      bpa = roundMoney(
        rules.basicPersonalAmountMax -
          ratio * (rules.basicPersonalAmountMax - rules.basicPersonalAmountMin),
        decimals
      );
    }

    statutoryAllowanceOrDeductionAnnual = bpa;
    statutoryAllowanceLabel =
      'CRA Federal Basic Personal Amount (Non-Refundable Credit Base)';

    const bracketEval = evaluateProgressiveBrackets(
      taxableIncomeAnnual,
      rules.brackets,
      decimals
    );
    grossBracketTaxAnnual = bracketEval.totalBracketTax;
    marginalIncomeTaxRatePercent =
      taxableIncomeAnnual > 0 ? bracketEval.marginalRatePercent : 0;
    bracketBreakdown = bracketEval.breakdown;

    // Canada Federal Non-Refundable Tax Credits (15% of BPA + Base CPP + EI + Canada Employment Amount $1,433)
    const canadaEmploymentAmount = Math.min(grossAnnual, 1433);
    const totalCreditBase =
      bpa + cpp1BaseForCredit + eiAnnual + canadaEmploymentAmount;
    const rawFederalCredits = roundMoney(
      totalCreditBase * rules.lowestCreditRate,
      decimals
    );
    taxCreditsOrRebatesAnnual = Math.min(
      grossBracketTaxAnnual,
      rawFederalCredits
    );
    taxCreditsLabel =
      'Federal Non-Refundable Credits (15% of BPA, Base CPP, EI & Employment Amount)';

    incomeTaxAnnual = roundMoney(
      Math.max(0, grossBracketTaxAnnual - taxCreditsOrRebatesAnnual),
      decimals
    );

    if (preTaxPensionAnnual > 0) {
      deductionLineItems.push({
        id: 'ca_rrsp',
        label: 'Pre-Tax RRSP / RPP Contribution',
        annualAmount: preTaxPensionAnnual,
        category: 'pre_tax_pension',
        note: `${pensionPct}% of gross pay`,
      });
    }
    deductionLineItems.push({
      id: 'ca_fed_tax',
      label: 'CRA Federal Income Tax (Net of Credits)',
      annualAmount: incomeTaxAnnual,
      category: 'income_tax',
      note: `${formatCurrencyAmount(grossBracketTaxAnnual, 'ca')} bracket tax minus ${formatCurrencyAmount(taxCreditsOrRebatesAnnual, 'ca')} non-refundable credits`,
    });
    deductionLineItems.push({
      id: 'ca_cpp',
      label:
        cpp2Annual > 0
          ? 'Canada Pension Plan (CPP1 + CPP2)'
          : 'Canada Pension Plan (CPP)',
      annualAmount: roundMoney(cpp1Annual + cpp2Annual, decimals),
      category: 'social_contribution',
      note:
        cpp2Annual > 0
          ? `Includes ${formatCurrencyAmount(cpp1Annual, 'ca')} CPP1 + ${formatCurrencyAmount(cpp2Annual, 'ca')} CPP2`
          : '5.95% above $3,500 basic exemption up to YMPE',
    });
    deductionLineItems.push({
      id: 'ca_ei',
      label: `Employment Insurance (EI ${roundPercent(rules.eiRate * 100, 2)}%)`,
      annualAmount: eiAnnual,
      category: 'social_contribution',
      note: `Capped at ${formatCurrencyAmount(rules.eiMaxInsurableEarnings, 'ca')} insurable earnings`,
    });

    marginalCombinedRateNote = `${marginalIncomeTaxRatePercent}% Federal marginal tax bracket (Provincial tax excluded).`;

    calculationSteps.push(
      `Annualized Gross Income: ${formatCurrencyAmount(grossAnnual, 'ca')}.`,
      `Calculated CPP contributions (${formatCurrencyAmount(cpp1Annual + cpp2Annual, 'ca')}) and EI premiums (${formatCurrencyAmount(eiAnnual, 'ca')}).`,
      `Determined Federal Taxable Income of ${formatCurrencyAmount(taxableIncomeAnnual, 'ca')} after enhanced CPP deduction (${formatCurrencyAmount(statutoryCppDeduction, 'ca')}) and optional RRSP (${formatCurrencyAmount(preTaxPensionAnnual, 'ca')}).`,
      `Calculated gross Federal bracket tax of ${formatCurrencyAmount(grossBracketTaxAnnual, 'ca')} and subtracted ${formatCurrencyAmount(taxCreditsOrRebatesAnnual, 'ca')} in Federal non-refundable credits (including BPA of ${formatCurrencyAmount(bpa, 'ca')}).`
    );
  } else if (input.jurisdictionId === 'au') {
    const rules =
      AUSTRALIA_TAX_RULES[taxYearConfig.taxYearId] ??
      AUSTRALIA_TAX_RULES['2024-25'];

    statutoryAllowanceOrDeductionAnnual = 18200;
    statutoryAllowanceLabel = 'ATO Resident Tax-Free Threshold ($18,200)';

    taxableIncomeAnnual = roundMoney(
      Math.max(0, grossAnnual - preTaxPensionAnnual),
      decimals
    );

    const bracketEval = evaluateProgressiveBrackets(
      taxableIncomeAnnual,
      rules.brackets,
      decimals
    );
    grossBracketTaxAnnual = bracketEval.totalBracketTax;
    marginalIncomeTaxRatePercent =
      taxableIncomeAnnual > 18200 ? bracketEval.marginalRatePercent : 0;
    bracketBreakdown = bracketEval.breakdown;

    // Low Income Tax Offset (LITO)
    let lito = 0;
    if (taxableIncomeAnnual <= rules.litoTier1Threshold) {
      lito = rules.litoMaxOffset;
    } else if (taxableIncomeAnnual <= rules.litoTier2Threshold) {
      lito =
        rules.litoMaxOffset -
        (taxableIncomeAnnual - rules.litoTier1Threshold) *
          rules.litoTier1WithdrawalRate;
    } else if (taxableIncomeAnnual < rules.litoCutoutThreshold) {
      const tier1Reduction =
        (rules.litoTier2Threshold - rules.litoTier1Threshold) *
        rules.litoTier1WithdrawalRate; // $375
      lito =
        rules.litoMaxOffset -
        tier1Reduction -
        (taxableIncomeAnnual - rules.litoTier2Threshold) *
          rules.litoTier2WithdrawalRate;
    }
    lito = roundMoney(Math.max(0, lito), decimals);
    taxCreditsOrRebatesAnnual = Math.min(grossBracketTaxAnnual, lito);
    taxCreditsLabel = 'Low Income Tax Offset (LITO)';

    incomeTaxAnnual = roundMoney(
      Math.max(0, grossBracketTaxAnnual - taxCreditsOrRebatesAnnual),
      decimals
    );

    // Medicare Levy (2% with low-income phase-in between $26,000 and $32,500)
    let medicareLevy = 0;
    if (taxableIncomeAnnual > rules.medicarePhaseInLimit) {
      medicareLevy = roundMoney(
        taxableIncomeAnnual * rules.medicareLevyRate,
        decimals
      );
    } else if (taxableIncomeAnnual > rules.medicareLowIncomeThreshold) {
      medicareLevy = roundMoney(
        (taxableIncomeAnnual - rules.medicareLowIncomeThreshold) *
          rules.medicarePhaseInRate,
        decimals
      );
    }
    socialContributionsAnnual = medicareLevy;

    if (preTaxPensionAnnual > 0) {
      deductionLineItems.push({
        id: 'au_super',
        label: 'Voluntary Salary Sacrifice Super',
        annualAmount: preTaxPensionAnnual,
        category: 'pre_tax_pension',
        note: `${pensionPct}% salary sacrifice`,
      });
    }
    deductionLineItems.push({
      id: 'au_income_tax',
      label: 'ATO Resident Income Tax (Net of LITO)',
      annualAmount: incomeTaxAnnual,
      category: 'income_tax',
      note:
        taxCreditsOrRebatesAnnual > 0
          ? `Includes ${formatCurrencyAmount(taxCreditsOrRebatesAnnual, 'au')} Low Income Tax Offset reduction`
          : 'Stage 3 resident tax brackets applied',
    });
    deductionLineItems.push({
      id: 'au_medicare',
      label: 'Medicare Levy (2%)',
      annualAmount: medicareLevy,
      category: 'social_contribution',
      note:
        taxableIncomeAnnual <= rules.medicareLowIncomeThreshold
          ? 'Exempt under low-income threshold ($26,000)'
          : 'Standard 2% resident Medicare Levy',
    });

    marginalCombinedRateNote = `${marginalIncomeTaxRatePercent}% Resident Income Tax bracket + ${
      taxableIncomeAnnual > rules.medicareLowIncomeThreshold ? '2%' : '0%'
    } Medicare Levy.`;

    calculationSteps.push(
      `Annualized Gross Income: ${formatCurrencyAmount(grossAnnual, 'au')}.`,
      `Assessed Taxable Income: ${formatCurrencyAmount(taxableIncomeAnnual, 'au')} (first $18,200 is tax-free).`,
      `Calculated resident bracket tax of ${formatCurrencyAmount(grossBracketTaxAnnual, 'au')} and applied ${formatCurrencyAmount(taxCreditsOrRebatesAnnual, 'au')} Low Income Tax Offset (LITO) for net Income Tax of ${formatCurrencyAmount(incomeTaxAnnual, 'au')}.`,
      `Calculated Medicare Levy of ${formatCurrencyAmount(medicareLevy, 'au')}.`
    );
  } else if (input.jurisdictionId === 'in') {
    const regime: IndiaTaxRegime = input.indiaTaxRegime ?? 'new_regime';
    const yearRules =
      INDIA_TAX_RULES[taxYearConfig.taxYearId] ?? INDIA_TAX_RULES['2024-25'];
    const regimeRules = yearRules.regimes[regime];

    const standardDeduction = regimeRules.standardDeduction;
    const deductible80C = regimeRules.allows80CDeduction
      ? Math.min(preTaxPensionAnnual, regimeRules.max80CDeduction)
      : 0;

    statutoryAllowanceOrDeductionAnnual = standardDeduction + deductible80C;
    statutoryAllowanceLabel =
      regime === 'new_regime'
        ? 'Standard Deduction (₹75,000 under New Regime)'
        : deductible80C > 0
          ? `Standard Deduction (₹50,000) + Section 80C Deduction (${formatCurrencyAmount(deductible80C, 'in')})`
          : 'Standard Deduction (₹50,000 under Old Regime)';

    taxableIncomeAnnual = roundMoney(
      Math.max(0, grossAnnual - statutoryAllowanceOrDeductionAnnual),
      decimals
    );

    const bracketEval = evaluateProgressiveBrackets(
      taxableIncomeAnnual,
      regimeRules.brackets,
      decimals
    );
    grossBracketTaxAnnual = bracketEval.totalBracketTax;
    marginalIncomeTaxRatePercent =
      taxableIncomeAnnual > 300000 ? bracketEval.marginalRatePercent : 0;
    bracketBreakdown = bracketEval.breakdown;

    // Section 87A Rebate & Marginal Relief
    let rebate87A = 0;
    if (taxableIncomeAnnual <= regimeRules.rebate87AThreshold) {
      rebate87A = Math.min(
        grossBracketTaxAnnual,
        regimeRules.rebate87AMaxAmount
      );
    } else if (regimeRules.supportsMarginalReliefOnRebate) {
      // Marginal relief in New Regime when taxable income slightly exceeds ₹7,00,000
      const incomeAboveThreshold =
        taxableIncomeAnnual - regimeRules.rebate87AThreshold;
      if (grossBracketTaxAnnual > incomeAboveThreshold) {
        rebate87A = roundMoney(
          grossBracketTaxAnnual - incomeAboveThreshold,
          decimals
        );
      }
    }

    taxCreditsOrRebatesAnnual = rebate87A;
    taxCreditsLabel = 'Section 87A Tax Rebate (with Marginal Relief)';

    const taxAfterRebate = roundMoney(
      Math.max(0, grossBracketTaxAnnual - rebate87A),
      decimals
    );
    const healthAndEducationCess = roundMoney(
      taxAfterRebate * yearRules.cessRate,
      decimals
    );

    incomeTaxAnnual = taxAfterRebate;
    socialContributionsAnnual = healthAndEducationCess;

    if (preTaxPensionAnnual > 0) {
      deductionLineItems.push({
        id: 'in_epf',
        label: 'Employee EPF / 80C Contribution',
        annualAmount: preTaxPensionAnnual,
        category: 'pre_tax_pension',
        note:
          regime === 'old_regime'
            ? `Reduces taxable income by ${formatCurrencyAmount(deductible80C, 'in')} under Section 80C`
            : 'Employee contribution deducted from cash pay (80C not deductible in New Regime)',
      });
    }
    deductionLineItems.push({
      id: 'in_income_tax',
      label: `Income Tax (${regime === 'new_regime' ? 'New Regime' : 'Old Regime'})`,
      annualAmount: incomeTaxAnnual,
      category: 'income_tax',
      note:
        rebate87A > 0
          ? `Includes ${formatCurrencyAmount(rebate87A, 'in')} Section 87A rebate reduction`
          : `Calculated on ${formatCurrencyAmount(taxableIncomeAnnual, 'in')} taxable income`,
    });
    deductionLineItems.push({
      id: 'in_cess',
      label: 'Health & Education Cess (4%)',
      annualAmount: healthAndEducationCess,
      category: 'social_contribution',
      note: '4% statutory cess on income tax after Section 87A rebate',
    });

    marginalCombinedRateNote =
      incomeTaxAnnual === 0
        ? '0% effective tax after Section 87A Rebate.'
        : `${marginalIncomeTaxRatePercent}% slab rate + 4% Health & Education Cess on tax.`;

    calculationSteps.push(
      `Annualized Gross Salary: ${formatCurrencyAmount(grossAnnual, 'in')}.`,
      `Applied ${statutoryAllowanceLabel} of ${formatCurrencyAmount(statutoryAllowanceOrDeductionAnnual, 'in')} to arrive at ${formatCurrencyAmount(taxableIncomeAnnual, 'in')} Net Taxable Income.`,
      `Computed slab tax of ${formatCurrencyAmount(grossBracketTaxAnnual, 'in')} and applied Section 87A rebate of ${formatCurrencyAmount(rebate87A, 'in')}.`,
      `Added 4% Health & Education Cess of ${formatCurrencyAmount(healthAndEducationCess, 'in')}.`
    );
  }

  const totalTaxAndStatutoryAnnual = roundMoney(
    incomeTaxAnnual + socialContributionsAnnual,
    decimals
  );
  const totalAllDeductionsAnnual = roundMoney(
    totalTaxAndStatutoryAnnual + preTaxPensionAnnual,
    decimals
  );
  const netPayAnnual = roundMoney(
    Math.max(0, grossAnnual - totalAllDeductionsAnnual),
    decimals
  );

  const effectiveTaxAndStatutoryRatePercent =
    grossAnnual > 0
      ? roundPercent((totalTaxAndStatutoryAnnual / grossAnnual) * 100, 2)
      : 0;
  const effectiveIncomeTaxOnlyRatePercent =
    grossAnnual > 0
      ? roundPercent((incomeTaxAnnual / grossAnnual) * 100, 2)
      : 0;

  const periodBreakdowns = {} as Record<PayFrequency, PeriodBreakdownRow>;
  for (const freq of PAY_FREQUENCY_OPTIONS) {
    const div = freq.periodsPerYear;
    periodBreakdowns[freq.id] = {
      frequency: freq.id,
      label: freq.label,
      periodsPerYear: div,
      grossPay: roundMoney(grossAnnual / div, decimals),
      preTaxPension: roundMoney(preTaxPensionAnnual / div, decimals),
      incomeTax: roundMoney(incomeTaxAnnual / div, decimals),
      socialContributions: roundMoney(socialContributionsAnnual / div, decimals),
      totalDeductions: roundMoney(totalAllDeductionsAnnual / div, decimals),
      netPay: roundMoney(netPayAnnual / div, decimals),
    };
  }

  return {
    ok: true,
    jurisdiction,
    taxYearConfig,
    grossAnnual,
    preTaxPensionAnnual,
    preTaxPensionCapped,
    statutoryAllowanceOrDeductionAnnual,
    statutoryAllowanceLabel,
    taxableIncomeAnnual,
    grossBracketTaxAnnual,
    taxCreditsOrRebatesAnnual,
    taxCreditsLabel,
    incomeTaxAnnual,
    socialContributionsAnnual,
    totalTaxAndStatutoryAnnual,
    totalAllDeductionsAnnual,
    netPayAnnual,
    effectiveTaxAndStatutoryRatePercent,
    effectiveIncomeTaxOnlyRatePercent,
    marginalIncomeTaxRatePercent,
    marginalCombinedRateNote,
    bracketBreakdown,
    deductionLineItems,
    periodBreakdowns,
    calculationSteps,
  };
}
