/**
 * US Federal Income Tax Calculation Engine
 * Complies with IRS Rev. Proc. 2024-40 (Tax Year 2025) and Rev. Proc. 2023-34 (Tax Year 2024)
 * Loads progressive tax brackets and standard deductions from data/tax-us.json
 */

import taxUsData from '../../data/tax-us.json';

export type UsTaxYear = '2025' | '2024';

export type UsFilingStatus =
  | 'single'
  | 'marriedFilingJointly'
  | 'headOfHousehold'
  | 'marriedFilingSeparately';

export interface UsTaxBracketBreakdown {
  bracketIndex: number;
  rate: number; // decimal e.g. 0.22
  ratePercent: number; // e.g. 22
  from: number;
  to: number | null;
  bracketLabel: string;
  taxableInBracket: number;
  taxInBracket: number;
  cumulativeTax: number;
  isUserTopBracket: boolean;
}

export interface UsTaxOptimizationItem {
  id: string;
  title: string;
  category: 'above-the-line' | 'itemized' | 'credit' | 'strategy';
  description: string;
  potentialTaxSavings: number;
  actionableHint: string;
}

export interface UsFederalTaxInput {
  taxYear: UsTaxYear;
  filingStatus: UsFilingStatus;
  wages: number;
  otherIncome?: number; // 1099, dividends, business, interest
  preTaxDeductions?: {
    traditional401k?: number;
    traditionalIra?: number;
    hsa?: number;
    healthInsurancePreTax?: number;
    otherAdjustments?: number; // student loan interest, educator expenses, etc.
  };
  deductionType?: 'standard' | 'itemized';
  itemizedDeductions?: {
    saltStateAndLocalTax?: number; // state/local income or sales + property (capped at $10k by TCJA)
    mortgageInterest?: number;
    charitableDonations?: number;
    medicalExpensesOver75Pct?: number; // medical over 7.5% of AGI
    otherDeductions?: number;
  };
  taxCredits?: {
    childTaxCredit?: number; // $2,000 per qualifying child
    otherDependentsCredit?: number; // $500 per other dependent
    educationCredits?: number; // AOTC / Lifetime Learning
    cleanEnergyCredit?: number; // EV or home energy
    otherCredits?: number;
  };
  taxesWithheld?: number; // W-2 withholding + estimated tax payments
}

export interface UsFederalTaxResult {
  taxYear: UsTaxYear;
  filingStatus: UsFilingStatus;
  filingStatusLabel: string;

  // Income summary
  totalGrossIncome: number;
  wages: number;
  otherIncome: number;

  // Above-the-line deductions & AGI
  totalPreTaxDeductions: number;
  preTaxBreakdown: {
    traditional401k: number;
    traditionalIra: number;
    hsa: number;
    healthInsurancePreTax: number;
    otherAdjustments: number;
  };
  agi: number; // Adjusted Gross Income

  // Below-the-line deductions
  standardDeduction: number;
  itemizedTotal: number;
  saltDeductionCapped: number; // capped at $10,000
  saltExcessLost: number;
  chosenDeductionType: 'standard' | 'itemized';
  effectiveDeduction: number;
  recommendedDeductionType: 'standard' | 'itemized';
  deductionAdvantage: number;

  // Taxable income & Progressive tax
  taxableIncome: number;
  bracketsBreakdown: UsTaxBracketBreakdown[];
  taxBeforeCredits: number;

  // Credits & Final tax liability
  totalCredits: number;
  creditsBreakdown: {
    childTaxCredit: number;
    otherDependentsCredit: number;
    educationCredits: number;
    cleanEnergyCredit: number;
    otherCredits: number;
  };
  taxAfterCredits: number;

  // Withholding & Refund/Owed
  taxesWithheld: number;
  refundOrOwedType: 'refund' | 'owed' | 'even';
  refundAmount: number;
  amountOwed: number;

  // Rates
  marginalTaxRate: number; // e.g. 0.22
  marginalTaxRatePercent: number; // e.g. 22
  effectiveTaxRate: number; // e.g. 0.1345
  effectiveTaxRatePercent: number; // e.g. 13.45 (on Total Gross Income)
  effectiveTaxRateOnAgiPercent: number; // e.g. 14.80 (on AGI)

  // FICA reference (Social Security & Medicare)
  ficaEstimated: {
    socialSecurity: number;
    medicare: number;
    additionalMedicare: number;
    totalFica: number;
  };

  // Value-added explanations & optimizations
  marginalVsEffectiveExplanation: string;
  optimizationTips: UsTaxOptimizationItem[];
}

export const FILING_STATUS_LABELS: Record<UsFilingStatus, string> = {
  single: 'Single',
  marriedFilingJointly: 'Married Filing Jointly',
  headOfHousehold: 'Head of Household',
  marriedFilingSeparately: 'Married Filing Separately',
};

export function calculateUsFederalTax(input: UsFederalTaxInput): UsFederalTaxResult {
  const taxYear = input.taxYear || '2025';
  const filingStatus = input.filingStatus || 'single';
  const wages = Math.max(0, input.wages || 0);
  const otherIncome = Math.max(0, input.otherIncome || 0);
  const totalGrossIncome = wages + otherIncome;

  // Above-the-line deductions
  const preTax = input.preTaxDeductions || {};
  const traditional401k = Math.max(0, preTax.traditional401k || 0);
  const traditionalIra = Math.max(0, preTax.traditionalIra || 0);
  const hsa = Math.max(0, preTax.hsa || 0);
  const healthInsurancePreTax = Math.max(0, preTax.healthInsurancePreTax || 0);
  const otherAdjustments = Math.max(0, preTax.otherAdjustments || 0);
  const totalPreTaxDeductions =
    traditional401k + traditionalIra + hsa + healthInsurancePreTax + otherAdjustments;

  // AGI = Income - adjustments
  const agi = Math.max(0, totalGrossIncome - totalPreTaxDeductions);

  // Standard deduction from JSON
  const taxYearsMap = taxUsData.taxYears as Record<string, typeof taxUsData.taxYears['2025']>;
  const yearData = taxYearsMap[taxYear] || taxUsData.taxYears['2025'];
  const stdDeductions = yearData.standardDeduction || {};
  const standardDeduction = stdDeductions[filingStatus] ?? (filingStatus === 'marriedFilingJointly' ? 30000 : 15000);

  // Itemized deduction calculation
  const itemizedInput = input.itemizedDeductions || {};
  const saltRaw = Math.max(0, itemizedInput.saltStateAndLocalTax || 0);
  const saltCap = filingStatus === 'marriedFilingSeparately' ? 5000 : 10000;
  const saltDeductionCapped = Math.min(saltRaw, saltCap);
  const saltExcessLost = Math.max(0, saltRaw - saltCap);

  const mortgageInterest = Math.max(0, itemizedInput.mortgageInterest || 0);
  const charitableDonations = Math.max(0, itemizedInput.charitableDonations || 0);
  const medicalRaw = Math.max(0, itemizedInput.medicalExpensesOver75Pct || 0);
  const medicalThreshold = agi * 0.075;
  const medicalDeductible = Math.max(0, medicalRaw - medicalThreshold);
  const otherItemized = Math.max(0, itemizedInput.otherDeductions || 0);

  const itemizedTotal =
    saltDeductionCapped + mortgageInterest + charitableDonations + medicalDeductible + otherItemized;

  const recommendedDeductionType: 'standard' | 'itemized' =
    itemizedTotal > standardDeduction ? 'itemized' : 'standard';

  const userChosenType = input.deductionType || (itemizedTotal > 0 ? recommendedDeductionType : 'standard');
  const chosenDeductionType = userChosenType;
  const effectiveDeduction = chosenDeductionType === 'itemized' ? itemizedTotal : standardDeduction;
  const deductionAdvantage = Math.abs(itemizedTotal - standardDeduction);

  // Taxable Income = max(0, AGI - deduction)
  const taxableIncome = Math.max(0, agi - effectiveDeduction);

  // Progressive Brackets from JSON
  const bracketsConfig = yearData.brackets[filingStatus] || yearData.brackets.single;
  const bracketsBreakdown: UsTaxBracketBreakdown[] = [];

  let remainingTaxable = taxableIncome;
  let previousLimit = 0;
  let taxBeforeCredits = 0;
  let marginalRate = 0;
  let cumulativeTax = 0;

  for (let i = 0; i < bracketsConfig.length; i++) {
    const b = bracketsConfig[i];
    const rate = Number(b.rate);
    const currentLimit = b.upTo !== null ? Number(b.upTo) : null;
    const fromVal = previousLimit;
    const toVal = currentLimit;

    let bracketSpan = currentLimit !== null ? currentLimit - previousLimit : Infinity;
    if (bracketSpan <= 0) bracketSpan = Infinity;

    const taxableInThisBracket = Math.max(0, Math.min(remainingTaxable, bracketSpan));
    const taxInThisBracket = taxableInThisBracket * rate;
    cumulativeTax += taxInThisBracket;

    if (taxableInThisBracket > 0) {
      marginalRate = rate;
    }

    const label =
      toVal === null
        ? `Over $${fromVal.toLocaleString('en-US')}`
        : `$${fromVal.toLocaleString('en-US')} – $${toVal.toLocaleString('en-US')}`;

    bracketsBreakdown.push({
      bracketIndex: i,
      rate,
      ratePercent: Number((rate * 100).toFixed(1)),
      from: fromVal,
      to: toVal,
      bracketLabel: label,
      taxableInBracket: Number(taxableInThisBracket.toFixed(2)),
      taxInBracket: Number(taxInThisBracket.toFixed(2)),
      cumulativeTax: Number(cumulativeTax.toFixed(2)),
      isUserTopBracket: false,
    });

    taxBeforeCredits += taxInThisBracket;
    remainingTaxable = Math.max(0, remainingTaxable - taxableInThisBracket);

    if (currentLimit !== null) {
      previousLimit = currentLimit;
    }
  }

  // If taxableIncome is 0, marginal rate is 0
  if (taxableIncome === 0) {
    marginalRate = 0;
  } else {
    // Mark top bracket
    const topIdx = bracketsBreakdown.findLastIndex((b) => b.taxableInBracket > 0);
    if (topIdx >= 0) {
      bracketsBreakdown[topIdx].isUserTopBracket = true;
    }
  }

  // Tax Credits
  const credits = input.taxCredits || {};
  const childTaxCredit = Math.max(0, credits.childTaxCredit || 0);
  const otherDependentsCredit = Math.max(0, credits.otherDependentsCredit || 0);
  const educationCredits = Math.max(0, credits.educationCredits || 0);
  const cleanEnergyCredit = Math.max(0, credits.cleanEnergyCredit || 0);
  const otherCredits = Math.max(0, credits.otherCredits || 0);
  const totalCredits =
    childTaxCredit + otherDependentsCredit + educationCredits + cleanEnergyCredit + otherCredits;

  const taxAfterCredits = Math.max(0, taxBeforeCredits - totalCredits);

  // Withholding & Refund/Owed
  const taxesWithheld = Math.max(0, input.taxesWithheld || 0);
  let refundOrOwedType: 'refund' | 'owed' | 'even' = 'even';
  let refundAmount = 0;
  let amountOwed = 0;

  if (taxesWithheld > taxAfterCredits) {
    refundOrOwedType = 'refund';
    refundAmount = Number((taxesWithheld - taxAfterCredits).toFixed(2));
  } else if (taxesWithheld < taxAfterCredits) {
    refundOrOwedType = 'owed';
    amountOwed = Number((taxAfterCredits - taxesWithheld).toFixed(2));
  }

  // Effective Rates
  const effectiveTaxRate = totalGrossIncome > 0 ? taxAfterCredits / totalGrossIncome : 0;
  const effectiveTaxRatePercent = Number((effectiveTaxRate * 100).toFixed(2));
  const effectiveTaxRateOnAgi = agi > 0 ? taxAfterCredits / agi : 0;
  const effectiveTaxRateOnAgiPercent = Number((effectiveTaxRateOnAgi * 100).toFixed(2));
  const marginalTaxRatePercent = Number((marginalRate * 100).toFixed(1));

  // FICA calculation (FICA applies to gross wages before 401k/IRA, but after pre-tax Section 125 health insurance)
  const ficaWageBase = Math.max(0, wages - healthInsurancePreTax);
  const ssCap = yearData.fica?.socialSecurityWageCap || 176100;
  const ssTax = Math.min(ficaWageBase, ssCap) * (yearData.fica?.socialSecurityRate || 0.062);
  const medTax = ficaWageBase * (yearData.fica?.medicareRate || 0.0145);
  const addMedThreshold =
    filingStatus === 'marriedFilingJointly'
      ? yearData.fica?.additionalMedicareThresholdMFJ || 250000
      : yearData.fica?.additionalMedicareThresholdSingle || 200000;
  const addMedTax = Math.max(0, ficaWageBase - addMedThreshold) * (yearData.fica?.additionalMedicareRate || 0.009);

  // Marginal vs. Effective explanation with user's own numbers
  const zeroPercentBracket = effectiveDeduction;
  const marginalExplanation =
    taxableIncome <= 0
      ? `Because your total deductions ($${effectiveDeduction.toLocaleString('en-US')}) exceed your adjusted gross income ($${agi.toLocaleString('en-US')}), your taxable income is $0 and your federal tax rate is 0%.`
      : `Your top marginal tax rate is ${marginalTaxRatePercent}%, meaning your last dollar of income is taxed at that rate. However, your effective tax rate is only ${effectiveTaxRatePercent}% of your gross income. This happens because your first $${zeroPercentBracket.toLocaleString('en-US')} is taxed at 0% through your ${chosenDeductionType} deduction, and your initial taxable dollars are taxed at lower progressive tiers (10%, 12%) before reaching ${marginalTaxRatePercent}%.`;

  // "What Lowers My Tax" personalized optimization tips
  const optimizationTips: UsTaxOptimizationItem[] = [];

  // 1. 401(k) opportunity
  const elective401kCap = taxYear === '2025' ? 23500 : 23000;
  if (traditional401k < elective401kCap && marginalRate > 0) {
    const remaining401k = elective401kCap - traditional401k;
    const potentialSaving = Math.round(remaining401k * marginalRate);
    optimizationTips.push({
      id: 'opt-401k',
      title: 'Maximize Pre-Tax 401(k) / 403(b)',
      category: 'above-the-line',
      description: `You have $${remaining401k.toLocaleString('en-US')} of unused 401(k) room below the $${elective401kCap.toLocaleString('en-US')} statutory cap.`,
      potentialTaxSavings: potentialSaving,
      actionableHint: `Contributing an additional $${remaining401k.toLocaleString('en-US')} reduces your taxable income, saving approximately $${potentialSaving.toLocaleString('en-US')} at your ${marginalTaxRatePercent}% marginal bracket.`,
    });
  }

  // 2. HSA opportunity
  const hsaCap = 4300; // 2025 individual reference
  if (hsa < hsaCap && marginalRate > 0) {
    const remainingHsa = hsaCap - hsa;
    const potentialSaving = Math.round(remainingHsa * (marginalRate + 0.0765)); // income tax + FICA
    optimizationTips.push({
      id: 'opt-hsa',
      title: 'Health Savings Account (HSA)',
      category: 'above-the-line',
      description: `HSAs offer a triple tax advantage: pre-tax payroll contributions bypass both federal income tax and FICA taxes.`,
      potentialTaxSavings: potentialSaving,
      actionableHint: `Contributing up to $${hsaCap.toLocaleString('en-US')} saves up to $${potentialSaving.toLocaleString('en-US')} in combined federal income tax and payroll FICA taxes.`,
    });
  }

  // 3. Traditional IRA
  const iraCap = 7000;
  if (traditionalIra < iraCap && marginalRate > 0) {
    const remainingIra = iraCap - traditionalIra;
    const potentialSaving = Math.round(remainingIra * marginalRate);
    optimizationTips.push({
      id: 'opt-ira',
      title: 'Traditional IRA Contribution',
      category: 'above-the-line',
      description: `Deductible IRA contributions reduce AGI directly without needing to itemize deductions.`,
      potentialTaxSavings: potentialSaving,
      actionableHint: `Contributing $${remainingIra.toLocaleString('en-US')} saves approximately $${potentialSaving.toLocaleString('en-US')} if you fall within the IRS MAGI deduction phase-out limits.`,
    });
  }

  // 4. Charitable bunching / Itemized vs Standard strategy
  if (itemizedTotal > 0 && Math.abs(itemizedTotal - standardDeduction) < 5000) {
    optimizationTips.push({
      id: 'opt-bunching',
      title: 'Charitable Donation Bunching',
      category: 'itemized',
      description: `Your itemized deductions ($${itemizedTotal.toLocaleString('en-US')}) are close to the standard deduction ($${standardDeduction.toLocaleString('en-US')}).`,
      potentialTaxSavings: Math.round(2500 * marginalRate),
      actionableHint: `Bunching two years of charitable giving into a single calendar year lets you itemize for a larger deduction in year one, while taking the full standard deduction in year two.`,
    });
  }

  // 5. Tax Credits vs Deductions value-add tip
  optimizationTips.push({
    id: 'opt-credit-vs-deduction',
    title: 'Prioritize Dollar-for-Dollar Tax Credits',
    category: 'credit',
    description: `A $1,000 tax deduction saves $${Math.round(1000 * (marginalRate || 0.22))} at your bracket, whereas a $1,000 tax credit reduces your tax bill by a full $1,000.`,
    potentialTaxSavings: 1000,
    actionableHint: `Explore child tax credits, clean vehicle credits (up to $7,500), and residential clean energy credits (30% solar/heat pump installations).`,
  });

  return {
    taxYear,
    filingStatus,
    filingStatusLabel: FILING_STATUS_LABELS[filingStatus],
    totalGrossIncome: Number(totalGrossIncome.toFixed(2)),
    wages: Number(wages.toFixed(2)),
    otherIncome: Number(otherIncome.toFixed(2)),
    totalPreTaxDeductions: Number(totalPreTaxDeductions.toFixed(2)),
    preTaxBreakdown: {
      traditional401k: Number(traditional401k.toFixed(2)),
      traditionalIra: Number(traditionalIra.toFixed(2)),
      hsa: Number(hsa.toFixed(2)),
      healthInsurancePreTax: Number(healthInsurancePreTax.toFixed(2)),
      otherAdjustments: Number(otherAdjustments.toFixed(2)),
    },
    agi: Number(agi.toFixed(2)),
    standardDeduction: Number(standardDeduction.toFixed(2)),
    itemizedTotal: Number(itemizedTotal.toFixed(2)),
    saltDeductionCapped: Number(saltDeductionCapped.toFixed(2)),
    saltExcessLost: Number(saltExcessLost.toFixed(2)),
    chosenDeductionType,
    effectiveDeduction: Number(effectiveDeduction.toFixed(2)),
    recommendedDeductionType,
    deductionAdvantage: Number(deductionAdvantage.toFixed(2)),
    taxableIncome: Number(taxableIncome.toFixed(2)),
    bracketsBreakdown,
    taxBeforeCredits: Number(taxBeforeCredits.toFixed(2)),
    totalCredits: Number(totalCredits.toFixed(2)),
    creditsBreakdown: {
      childTaxCredit: Number(childTaxCredit.toFixed(2)),
      otherDependentsCredit: Number(otherDependentsCredit.toFixed(2)),
      educationCredits: Number(educationCredits.toFixed(2)),
      cleanEnergyCredit: Number(cleanEnergyCredit.toFixed(2)),
      otherCredits: Number(otherCredits.toFixed(2)),
    },
    taxAfterCredits: Number(taxAfterCredits.toFixed(2)),
    taxesWithheld: Number(taxesWithheld.toFixed(2)),
    refundOrOwedType,
    refundAmount,
    amountOwed,
    marginalTaxRate: Number(marginalRate.toFixed(4)),
    marginalTaxRatePercent,
    effectiveTaxRate: Number(effectiveTaxRate.toFixed(4)),
    effectiveTaxRatePercent,
    effectiveTaxRateOnAgiPercent,
    ficaEstimated: {
      socialSecurity: Number(ssTax.toFixed(2)),
      medicare: Number(medTax.toFixed(2)),
      additionalMedicare: Number(addMedTax.toFixed(2)),
      totalFica: Number((ssTax + medTax + addMedTax).toFixed(2)),
    },
    marginalVsEffectiveExplanation: marginalExplanation,
    optimizationTips,
  };
}
