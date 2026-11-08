import { calculateUsFederalTax, UsFilingStatus, UsTaxYear } from './us-federal-tax';
import {
  US_FICA_2025,
  US_STATE_TAX_PROFILES_2025,
  US_SE_QUARTERLY_DATES_2025,
  US_CAPITAL_GAINS_2025,
  INDIA_CAPITAL_GAINS_2025,
  UK_PAYE_DATA,
  CANADA_TAX_DATA_2025,
  INDIA_TAX_DATA,
  VERIFIED_INTERNATIONAL_COUNTRIES,
  DAMODARAN_SECTOR_MARGINS_2025,
} from './tax-payroll-business-data';

// Helper for progressive brackets [{ threshold, rate }]
function computeProgressiveTax(
  taxableIncome: number,
  brackets: { threshold: number; rate: number }[]
): { totalTax: number; marginalRate: number } {
  if (taxableIncome <= 0) {
    return { totalTax: 0, marginalRate: brackets[0]?.rate ?? 0 };
  }
  let totalTax = 0;
  let marginalRate = brackets[0]?.rate ?? 0;
  for (let i = 0; i < brackets.length; i++) {
    const curr = brackets[i];
    const nextThreshold = i + 1 < brackets.length ? brackets[i + 1].threshold : Infinity;
    if (taxableIncome > curr.threshold) {
      const taxableInSlice = Math.min(taxableIncome, nextThreshold) - curr.threshold;
      totalTax += taxableInSlice * curr.rate;
      marginalRate = curr.rate;
    }
  }
  return { totalTax, marginalRate };
}

// ============================================================================
// #31: US STATE TAKE-HOME PAYCHECK CALCULATOR ENGINE
// ============================================================================
export interface UsStateTakeHomeInput {
  stateCode: string;
  annualSalary: number;
  payFrequency: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'annual';
  filingStatus: UsFilingStatus;
  preTax401k: number;
  preTaxHsaAndHealth: number;
  taxYear?: UsTaxYear;
}

export function calculateUsStateTakeHome(input: UsStateTakeHomeInput) {
  const stateProfile = US_STATE_TAX_PROFILES_2025[input.stateCode] || US_STATE_TAX_PROFILES_2025.CA;
  const gross = Math.max(0, input.annualSalary);
  const preTax401k = Math.max(0, input.preTax401k);
  const preTaxHealth = Math.max(0, input.preTaxHsaAndHealth);
  const totalPreTax = Math.min(gross, preTax401k + preTaxHealth);

  // 1. Federal Tax (reusing #30 engine)
  const fedResult = calculateUsFederalTax({
    taxYear: input.taxYear || '2025',
    filingStatus: input.filingStatus,
    wages: gross,
    preTaxDeductions: {
      traditional401k: preTax401k,
      hsa: preTaxHealth,
    },
  });
  const federalTax = fedResult.finalTaxLiability;

  // 2. FICA (Social Security + Medicare + Additional Medicare)
  // Note: 401(k) deferrals are subject to FICA; Sec 125 health/HSA are FICA-exempt
  const ficaWages = Math.max(0, gross - preTaxHealth);
  const socialSecurityTax =
    Math.min(ficaWages, US_FICA_2025.socialSecurityWageBase) * US_FICA_2025.socialSecurityRateEmployee;
  const medicareTax = ficaWages * US_FICA_2025.medicareRateEmployee;
  const addMedThreshold =
    input.filingStatus === 'marriedFilingJointly'
      ? US_FICA_2025.additionalMedicareThreshold.married_joint
      : input.filingStatus === 'marriedFilingSeparately'
      ? US_FICA_2025.additionalMedicareThreshold.married_separate
      : US_FICA_2025.additionalMedicareThreshold.single;
  const additionalMedicareTax =
    Math.max(0, ficaWages - addMedThreshold) * US_FICA_2025.additionalMedicareRate;
  const totalFica = socialSecurityTax + medicareTax + additionalMedicareTax;

  // 3. State Income Tax
  const stateAgi = Math.max(0, gross - totalPreTax);
  const isMFJ = input.filingStatus === 'marriedFilingJointly';
  const stateStdDed = isMFJ ? stateProfile.standardDeductionMFJ : stateProfile.standardDeductionSingle;
  const stateTaxable = Math.max(0, stateAgi - stateStdDed);
  const stateBrackets = isMFJ ? stateProfile.bracketsMFJ : stateProfile.bracketsSingle;
  const { totalTax: stateIncomeTax, marginalRate: stateMarginalRate } = stateProfile.hasIncomeTax
    ? computeProgressiveTax(stateTaxable, stateBrackets)
    : { totalTax: 0, marginalRate: 0 };

  // 4. State Payroll Items (e.g. CA SDI 1.2%, NY PFL, WA Cares)
  const statePayrollBreakdown = stateProfile.payrollItems.map((item) => {
    const base = item.wageCap ? Math.min(ficaWages, item.wageCap) : ficaWages;
    return {
      name: item.name,
      amount: base * item.rate,
      note: item.note,
    };
  });
  const statePayrollTotal = statePayrollBreakdown.reduce((acc, item) => acc + item.amount, 0);

  const totalTaxes = federalTax + totalFica + stateIncomeTax + statePayrollTotal;
  const netAnnual = Math.max(0, gross - totalPreTax - totalTaxes);

  const periodsMap = {
    annual: 1,
    monthly: 12,
    semimonthly: 24,
    biweekly: 26,
    weekly: 52,
  };
  const activeDivisor = periodsMap[input.payFrequency];

  return {
    stateProfile,
    grossAnnual: gross,
    totalPreTax,
    federalTax,
    federalMarginalRate: fedResult.marginalRatePercent,
    socialSecurityTax,
    medicareTax: medicareTax + additionalMedicareTax,
    totalFica,
    stateIncomeTax,
    stateMarginalRatePct: stateMarginalRate * 100,
    statePayrollBreakdown,
    statePayrollTotal,
    totalTaxes,
    effectiveTaxRatePct: gross > 0 ? (totalTaxes / gross) * 100 : 0,
    netAnnual,
    netMonthly: netAnnual / 12,
    netSemiMonthly: netAnnual / 24,
    netBiWeekly: netAnnual / 26,
    netWeekly: netAnnual / 52,
    netHourly: netAnnual / 2080,
    netPerPaycheck: netAnnual / activeDivisor,
    grossPerPaycheck: gross / activeDivisor,
  };
}

// ============================================================================
// #32: US SELF-EMPLOYMENT TAX CALCULATOR ENGINE (IRS SCHEDULE SE)
// ============================================================================
export interface SelfEmploymentTaxInput {
  netBusinessProfit: number;
  filingStatus: UsFilingStatus;
  otherW2Wages: number;
  taxYear?: UsTaxYear;
}

export function calculateSelfEmploymentTax(input: SelfEmploymentTaxInput) {
  const profit = Math.max(0, input.netBusinessProfit);
  const w2 = Math.max(0, input.otherW2Wages);

  // 1. Net earnings from self-employment = 92.35% of net profit (IRS Schedule SE Line 4a)
  const netEarningsFromSE = profit * US_FICA_2025.seNetEarningsMultiplier;

  // 2. Social Security portion (12.4% up to $176,100 reduced by W-2 wages)
  const remainingSsCap = Math.max(0, US_FICA_2025.socialSecurityWageBase - w2);
  const taxableSsEarnings = Math.min(netEarningsFromSE, remainingSsCap);
  const socialSecurityTax = taxableSsEarnings * US_FICA_2025.socialSecurityRateSelfEmployed;

  // 3. Medicare portion (2.9% uncapped)
  const medicareTax = netEarningsFromSE * US_FICA_2025.medicareRateSelfEmployed;

  // 4. Additional Medicare Tax (0.9% above threshold on combined W-2 + SE net earnings)
  const addMedThreshold =
    input.filingStatus === 'marriedFilingJointly'
      ? US_FICA_2025.additionalMedicareThreshold.married_joint
      : input.filingStatus === 'marriedFilingSeparately'
      ? US_FICA_2025.additionalMedicareThreshold.married_separate
      : US_FICA_2025.additionalMedicareThreshold.single;
  const combinedMedicareBase = w2 + netEarningsFromSE;
  const w2OverThreshold = Math.max(0, w2 - addMedThreshold);
  const totalOverThreshold = Math.max(0, combinedMedicareBase - addMedThreshold);
  const seSubjectToAdditionalMedicare = Math.max(0, totalOverThreshold - w2OverThreshold);
  const additionalMedicareTax =
    seSubjectToAdditionalMedicare * US_FICA_2025.additionalMedicareRate;

  // 5. Total SE Tax & Deductible Half (50% of regular SE tax, excluding 0.9% Additional Medicare)
  const regularSeTax = socialSecurityTax + medicareTax;
  const deductibleHalfSeTax = regularSeTax * 0.5;
  const totalSeTax = regularSeTax + additionalMedicareTax;

  // 6. Federal Income Tax on combined income (after 50% SE tax deduction)
  const fedResult = calculateUsFederalTax({
    taxYear: input.taxYear || '2025',
    filingStatus: input.filingStatus,
    wages: w2,
    otherIncome: profit,
    preTaxDeductions: {
      otherAdjustments: deductibleHalfSeTax,
    },
  });

  // Baseline federal tax on W-2 alone so we isolate incremental income tax from business
  const fedW2Only = calculateUsFederalTax({
    taxYear: input.taxYear || '2025',
    filingStatus: input.filingStatus,
    wages: w2,
  });
  const incrementalIncomeTax = Math.max(0, fedResult.finalTaxLiability - fedW2Only.finalTaxLiability);
  const totalAnnualEstimatedTax = totalSeTax + incrementalIncomeTax;
  const quarterlyPayment = totalAnnualEstimatedTax / 4;

  return {
    profit,
    w2,
    netEarningsFromSE,
    remainingSsCap,
    taxableSsEarnings,
    socialSecurityTax,
    medicareTax,
    additionalMedicareTax,
    totalSeTax,
    deductibleHalfSeTax,
    effectiveSeRatePct: profit > 0 ? (totalSeTax / profit) * 100 : 0,
    totalFederalIncomeTax: fedResult.finalTaxLiability,
    incrementalIncomeTax,
    totalAnnualEstimatedTax,
    quarterlyPayment,
    quarterlySchedule: US_SE_QUARTERLY_DATES_2025.map((q) => ({
      ...q,
      amount: quarterlyPayment,
    })),
    source: US_FICA_2025.source,
  };
}

// ============================================================================
// #33: US & INDIA CAPITAL GAINS TAX CALCULATOR ENGINES
// ============================================================================
export interface UsCapitalGainsInput {
  assetType: 'stocks_crypto' | 'real_estate' | 'collectibles';
  purchasePrice: number;
  salePrice: number;
  sellingFees: number;
  purchaseDate: string; // YYYY-MM-DD
  saleDate: string; // YYYY-MM-DD
  filingStatus: UsFilingStatus;
  otherTaxableIncome: number;
}

export function calculateUsCapitalGains(input: UsCapitalGainsInput) {
  const costBasis = Math.max(0, input.purchasePrice);
  const netSale = Math.max(0, input.salePrice - Math.max(0, input.sellingFees));
  const rawGain = netSale - costBasis;

  const pDate = new Date(input.purchaseDate);
  const sDate = new Date(input.saleDate);
  const diffMs = sDate.getTime() - pDate.getTime();
  const holdingDays = Number.isFinite(diffMs) ? Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24))) : 400;
  // IRS rule: held MORE than 1 year (> 365 days) = Long-Term
  const isLongTerm = holdingDays > 365;

  const statusKey =
    input.filingStatus === 'marriedFilingJointly'
      ? 'married_joint'
      : input.filingStatus === 'headOfHousehold'
      ? 'head_of_household'
      : input.filingStatus === 'marriedFilingSeparately'
      ? 'married_separate'
      : 'single';

  const ordinaryIncome = Math.max(0, input.otherTaxableIncome);

  if (rawGain <= 0) {
    const lossAbs = Math.abs(rawGain);
    const maxOffset =
      statusKey === 'married_separate'
        ? US_CAPITAL_GAINS_2025.annualLossOffsetCap.married_separate
        : US_CAPITAL_GAINS_2025.annualLossOffsetCap.default;
    const deductibleThisYear = Math.min(lossAbs, maxOffset);
    const carryforwardLoss = Math.max(0, lossAbs - deductibleThisYear);
    return {
      rawGain,
      holdingDays,
      isLongTerm,
      baseCapitalGainsTax: 0,
      niitTax: 0,
      totalTax: 0,
      effectiveTaxRatePct: 0,
      netProceeds: netSale,
      deductibleLossThisYear: deductibleThisYear,
      carryforwardLoss,
      bracketBreakdown: [] as { ratePct: number; amount: number; tax: number }[],
      source: US_CAPITAL_GAINS_2025.source,
    };
  }

  let baseCapitalGainsTax = 0;
  const bracketBreakdown: { ratePct: number; amount: number; tax: number }[] = [];

  if (!isLongTerm) {
    // Short-term capital gains taxed as ordinary income (#30 engine difference)
    const withGain = calculateUsFederalTax({
      taxYear: '2025',
      filingStatus: input.filingStatus,
      wages: ordinaryIncome + rawGain,
      deductionType: 'itemized',
      itemizedDeductions: { otherDeductions: 0 }, // rawGain stacked on taxable income
    });
    const withoutGain = calculateUsFederalTax({
      taxYear: '2025',
      filingStatus: input.filingStatus,
      wages: ordinaryIncome,
      deductionType: 'itemized',
      itemizedDeductions: { otherDeductions: 0 },
    });
    baseCapitalGainsTax = Math.max(0, withGain.finalTaxLiability - withoutGain.finalTaxLiability);
    bracketBreakdown.push({
      ratePct: withGain.marginalRatePercent,
      amount: rawGain,
      tax: baseCapitalGainsTax,
    });
  } else if (input.assetType === 'collectibles') {
    // Collectibles LTCG capped at 28%
    const rate = 0.28;
    baseCapitalGainsTax = rawGain * rate;
    bracketBreakdown.push({ ratePct: 28, amount: rawGain, tax: baseCapitalGainsTax });
  } else {
    // Standard 0% / 15% / 20% LTCG stacking on top of ordinary taxable income
    const brackets = US_CAPITAL_GAINS_2025.brackets[statusKey];
    let currentFloor = ordinaryIncome;
    let remainingGain = rawGain;
    let prevCap = 0;

    for (const b of brackets) {
      if (remainingGain <= 0) break;
      const sliceStart = Math.max(currentFloor, prevCap);
      if (b.maxTaxable > sliceStart) {
        const availableRoom = b.maxTaxable - sliceStart;
        const gainInBracket = Math.min(remainingGain, availableRoom);
        const taxInBracket = gainInBracket * b.rate;
        baseCapitalGainsTax += taxInBracket;
        bracketBreakdown.push({
          ratePct: b.rate * 100,
          amount: gainInBracket,
          tax: taxInBracket,
        });
        remainingGain -= gainInBracket;
        currentFloor += gainInBracket;
      }
      prevCap = b.maxTaxable;
    }
  }

  // Net Investment Income Tax (3.8% NIIT above MAGI threshold)
  const niitThreshold = US_CAPITAL_GAINS_2025.niitThresholds[statusKey];
  const totalMagi = ordinaryIncome + rawGain;
  const excessOverNiit = Math.max(0, totalMagi - niitThreshold);
  const niitBase = Math.min(rawGain, excessOverNiit);
  const niitTax = niitBase * US_CAPITAL_GAINS_2025.niitRate;

  const totalTax = baseCapitalGainsTax + niitTax;
  const netProceeds = netSale - totalTax;

  return {
    rawGain,
    holdingDays,
    isLongTerm,
    baseCapitalGainsTax,
    niitTax,
    totalTax,
    effectiveTaxRatePct: rawGain > 0 ? (totalTax / rawGain) * 100 : 0,
    netProceeds,
    deductibleLossThisYear: 0,
    carryforwardLoss: 0,
    bracketBreakdown,
    source: US_CAPITAL_GAINS_2025.source,
  };
}

export interface IndiaCapitalGainsInput {
  assetCategory: 'listed_equity_mf' | 'unlisted_real_estate_gold' | 'debt_mf';
  purchasePrice: number;
  salePrice: number;
  transferExpenses: number;
  holdingMonths: number;
  slabRatePct: number; // for Debt MF / STCG non-equity
}

export function calculateIndiaCapitalGains(input: IndiaCapitalGainsInput) {
  const netSale = Math.max(0, input.salePrice - Math.max(0, input.transferExpenses));
  const gain = netSale - Math.max(0, input.purchasePrice);
  const ltcgThresholdMonths = input.assetCategory === 'listed_equity_mf' ? 12 : 24;
  const isLongTerm = input.holdingMonths > ltcgThresholdMonths;

  if (gain <= 0) {
    return {
      gain,
      isLongTerm,
      ltcgThresholdMonths,
      exemptionApplied: 0,
      taxableGain: 0,
      baseTaxRatePct: 0,
      baseTax: 0,
      cessAmount: 0,
      totalTax: 0,
      netProceeds: netSale,
      source: INDIA_CAPITAL_GAINS_2025.source,
    };
  }

  let exemptionApplied = 0;
  let baseTaxRatePct = 0;

  if (input.assetCategory === 'listed_equity_mf') {
    if (isLongTerm) {
      exemptionApplied = Math.min(gain, INDIA_CAPITAL_GAINS_2025.listedEquityLtcgExemption);
      baseTaxRatePct = INDIA_CAPITAL_GAINS_2025.listedEquityLtcgRate * 100; // 12.5% u/s 112A
    } else {
      baseTaxRatePct = INDIA_CAPITAL_GAINS_2025.listedEquityStcgRate * 100; // 20% u/s 111A
    }
  } else if (input.assetCategory === 'unlisted_real_estate_gold') {
    baseTaxRatePct = isLongTerm ? INDIA_CAPITAL_GAINS_2025.otherLongTermRate * 100 : input.slabRatePct;
  } else {
    // Debt MF (Section 50AA taxed at slab rate)
    baseTaxRatePct = input.slabRatePct;
  }

  const taxableGain = Math.max(0, gain - exemptionApplied);
  const baseTax = taxableGain * (baseTaxRatePct / 100);
  const cessAmount = baseTax * INDIA_CAPITAL_GAINS_2025.cessRate;
  const totalTax = baseTax + cessAmount;

  return {
    gain,
    isLongTerm,
    ltcgThresholdMonths,
    exemptionApplied,
    taxableGain,
    baseTaxRatePct,
    baseTax,
    cessAmount,
    totalTax,
    netProceeds: netSale - totalTax,
    source: INDIA_CAPITAL_GAINS_2025.source,
  };
}

// ============================================================================
// #34: 1099 VS W-2 CALCULATOR ENGINE (WITH BISECTION BREAK-EVEN SOLVER)
// ============================================================================
export interface W2Vs1099Input {
  w2Salary: number;
  w2EmployerHealthBenefit: number;
  w2Employer401kMatchPct: number;
  w2PaidLeaveDays: number;
  contractorMode: 'hourly' | 'annual';
  contractorHourlyRate: number;
  contractorBillableHoursPerYear: number;
  contractorAnnualGross: number;
  contractorBusinessExpenses: number;
  contractorHealthInsuranceCost: number;
  applyQbi20PctDeduction: boolean;
  filingStatus: UsFilingStatus;
}

export function calculate1099VsW2(input: W2Vs1099Input) {
  const w2Gross = Math.max(0, input.w2Salary);
  const w2MatchValue = w2Gross * (Math.max(0, input.w2Employer401kMatchPct) / 100);
  const w2PtoImplicitValue = (w2Gross / 260) * Math.max(0, input.w2PaidLeaveDays);

  // W-2 Taxes (Federal + FICA)
  const w2Fed = calculateUsFederalTax({
    taxYear: '2025',
    filingStatus: input.filingStatus,
    wages: w2Gross,
  });
  const w2Ss = Math.min(w2Gross, US_FICA_2025.socialSecurityWageBase) * US_FICA_2025.socialSecurityRateEmployee;
  const w2Med = w2Gross * US_FICA_2025.medicareRateEmployee;
  const w2TotalTax = w2Fed.finalTaxLiability + w2Ss + w2Med;
  const w2NetCash = w2Gross - w2TotalTax;
  const w2TotalPackageValue = w2NetCash + Math.max(0, input.w2EmployerHealthBenefit) + w2MatchValue;

  // Helper to evaluate 1099 net cash for any gross revenue G
  const evaluate1099Gross = (grossRevenue: number) => {
    const expenses = Math.max(0, input.contractorBusinessExpenses);
    const healthCost = Math.max(0, input.contractorHealthInsuranceCost);
    const netProfit = Math.max(0, grossRevenue - expenses);
    const se = calculateSelfEmploymentTax({
      netBusinessProfit: netProfit,
      filingStatus: input.filingStatus,
      otherW2Wages: 0,
      taxYear: '2025',
    });

    const agiAfterSeAndHealth = Math.max(0, netProfit - se.deductibleHalfSeTax - healthCost);
    const qbiDeduction = input.applyQbi20PctDeduction ? agiAfterSeAndHealth * 0.2 : 0;

    const fed1099 = calculateUsFederalTax({
      taxYear: '2025',
      filingStatus: input.filingStatus,
      wages: 0,
      otherIncome: netProfit,
      preTaxDeductions: {
        otherAdjustments: se.deductibleHalfSeTax + healthCost + qbiDeduction,
      },
    });

    const totalTax1099 = se.totalSeTax + fed1099.finalTaxLiability;
    const netAfterExpensesHealthAndTax = grossRevenue - expenses - healthCost - totalTax1099;
    return {
      grossRevenue,
      netProfit,
      seTax: se.totalSeTax,
      deductibleHalfSeTax: se.deductibleHalfSeTax,
      qbiDeduction,
      federalIncomeTax: fed1099.finalTaxLiability,
      totalTax1099,
      netTakeHome: netAfterExpensesHealthAndTax,
    };
  };

  const active1099Gross =
    input.contractorMode === 'hourly'
      ? Math.max(0, input.contractorHourlyRate) * Math.max(1, input.contractorBillableHoursPerYear)
      : Math.max(0, input.contractorAnnualGross);

  const current1099 = evaluate1099Gross(active1099Gross);

  // Bisection solver: find 1099 Gross Revenue where 1099 netTakeHome == w2TotalPackageValue
  let low = 0;
  let high = Math.max(w2TotalPackageValue * 3.5, 500000);
  for (let iter = 0; iter < 50; iter++) {
    const mid = (low + high) / 2;
    const evalMid = evaluate1099Gross(mid);
    if (evalMid.netTakeHome < w2TotalPackageValue) {
      low = mid;
    } else {
      high = mid;
    }
  }
  const breakEven1099Gross = Math.round((low + high) / 2);
  const billableHours = Math.max(1, input.contractorBillableHoursPerYear);
  const breakEven1099Hourly = breakEven1099Gross / billableHours;

  return {
    w2: {
      gross: w2Gross,
      federalTax: w2Fed.finalTaxLiability,
      ficaTax: w2Ss + w2Med,
      totalTax: w2TotalTax,
      netCash: w2NetCash,
      employerHealthBenefit: input.w2EmployerHealthBenefit,
      employer401kMatch: w2MatchValue,
      ptoImplicitValue: w2PtoImplicitValue,
      totalPackageValue: w2TotalPackageValue,
    },
    contractor: current1099,
    netDifference: current1099.netTakeHome - w2TotalPackageValue,
    breakEven1099Gross,
    breakEven1099Hourly,
    billableHours,
  };
}

// ============================================================================
// #35: UK PAYE CALCULATOR ENGINE (HMRC 2024/25 & 2025/26)
// ============================================================================
export interface UkPayeInput {
  grossSalary: number;
  pensionPct: number;
  pensionMethod: 'salary_sacrifice' | 'net_pay' | 'relief_at_source';
  studentLoanPlan: keyof typeof UK_PAYE_DATA.studentLoanPlans;
  isScotland: boolean;
}

export function calculateUkPaye(input: UkPayeInput) {
  const gross = Math.max(0, input.grossSalary);
  const pensionContribution = gross * (Math.max(0, Math.min(100, input.pensionPct)) / 100);

  // Adjusted Gross for NI & Income Tax depending on pension relief method
  const niableGross =
    input.pensionMethod === 'salary_sacrifice' ? Math.max(0, gross - pensionContribution) : gross;
  const adjustedNetIncome = Math.max(0, gross - pensionContribution);

  // Personal Allowance with £1-for-£2 taper above £100,000
  let personalAllowance = UK_PAYE_DATA.personalAllowance;
  if (adjustedNetIncome > UK_PAYE_DATA.taperThreshold) {
    const reduction = Math.floor((adjustedNetIncome - UK_PAYE_DATA.taperThreshold) / 2);
    personalAllowance = Math.max(0, UK_PAYE_DATA.personalAllowance - reduction);
  }

  const taxableIncome = Math.max(0, adjustedNetIncome - personalAllowance);
  const bands = input.isScotland ? UK_PAYE_DATA.scotlandBands : UK_PAYE_DATA.rUKBands;

  let remainingTaxable = taxableIncome;
  let incomeTax = 0;
  const bandBreakdown: { name: string; taxable: number; tax: number; ratePct: number }[] = [];

  for (const band of bands) {
    if (remainingTaxable <= 0) break;
    const slice = Math.min(remainingTaxable, band.bandWidth);
    const taxInSlice = slice * band.rate;
    incomeTax += taxInSlice;
    bandBreakdown.push({
      name: band.name,
      taxable: slice,
      tax: taxInSlice,
      ratePct: band.rate * 100,
    });
    remainingTaxable -= slice;
  }

  // Class 1 Employee National Insurance
  const niConfig = UK_PAYE_DATA.nationalInsuranceClass1;
  const niMainBand = Math.max(
    0,
    Math.min(niableGross, niConfig.upperEarningsLimitAnnual) - niConfig.primaryThresholdAnnual
  );
  const niUpperBand = Math.max(0, niableGross - niConfig.upperEarningsLimitAnnual);
  const nationalInsurance = niMainBand * niConfig.mainRate + niUpperBand * niConfig.additionalRate;

  // Student Loan
  const loanConfig = UK_PAYE_DATA.studentLoanPlans[input.studentLoanPlan] || UK_PAYE_DATA.studentLoanPlans.none;
  const studentLoan =
    niableGross > loanConfig.threshold ? (niableGross - loanConfig.threshold) * loanConfig.rate : 0;

  const totalDeductions = incomeTax + nationalInsurance + pensionContribution + studentLoan;
  const netAnnual = Math.max(0, gross - totalDeductions);

  return {
    gross,
    personalAllowance,
    taxableIncome,
    incomeTax,
    nationalInsurance,
    pensionContribution,
    studentLoan,
    totalDeductions,
    effectiveTaxAndNiRatePct: gross > 0 ? ((incomeTax + nationalInsurance) / gross) * 100 : 0,
    netAnnual,
    netMonthly: netAnnual / 12,
    netWeekly: netAnnual / 52,
    bandBreakdown,
    source: UK_PAYE_DATA.source,
  };
}

// ============================================================================
// #36: CANADA INCOME TAX CALCULATOR ENGINE (CRA 2025)
// ============================================================================
export interface CanadaTaxInput {
  province: 'ON' | 'BC' | 'AB';
  grossIncome: number;
  rrspDeduction: number;
}

export function calculateCanadaIncomeTax(input: CanadaTaxInput) {
  const gross = Math.max(0, input.grossIncome);
  const rrsp = Math.min(gross, Math.max(0, input.rrspDeduction));

  // 1. CPP, CPP2, and EI (2025 CRA verified)
  const cpp1Base = Math.max(
    0,
    Math.min(gross, CANADA_TAX_DATA_2025.cpp.ympe) - CANADA_TAX_DATA_2025.cpp.basicExemption
  );
  const cpp1Contribution = cpp1Base * CANADA_TAX_DATA_2025.cpp.rate;

  const cpp2Base = Math.max(
    0,
    Math.min(gross, CANADA_TAX_DATA_2025.cpp.yampe) - CANADA_TAX_DATA_2025.cpp.ympe
  );
  const cpp2Contribution = cpp2Base * CANADA_TAX_DATA_2025.cpp.cpp2Rate;
  const totalCpp = cpp1Contribution + cpp2Contribution;

  const eiContribution =
    Math.min(gross, CANADA_TAX_DATA_2025.ei.maxInsurableEarnings) * CANADA_TAX_DATA_2025.ei.rate;

  // Enhanced CPP phase-in & CPP2 are tax deductions; base CPP (4.95%) and EI are non-refundable tax credits
  const enhancedCppDeduction = cpp1Base * 0.01 + cpp2Contribution;
  const taxableIncome = Math.max(0, gross - rrsp - enhancedCppDeduction);

  // 2. Federal Tax
  const fedRaw = computeProgressiveTax(taxableIncome, CANADA_TAX_DATA_2025.federalBrackets);
  const fedCreditsBase =
    CANADA_TAX_DATA_2025.federalBasicPersonalAmount + (cpp1Contribution - cpp1Base * 0.01) + eiContribution;
  const federalTax = Math.max(0, fedRaw.totalTax - fedCreditsBase * 0.15);

  // 3. Provincial Tax
  const provProfile = CANADA_TAX_DATA_2025.provinces[input.province];
  const provRaw = computeProgressiveTax(taxableIncome, provProfile.brackets);
  const lowestProvRate = provProfile.brackets[0].rate;
  const provCreditsBase = provProfile.bpa + (cpp1Contribution - cpp1Base * 0.01) + eiContribution;
  let provincialTax = Math.max(0, provRaw.totalTax - provCreditsBase * lowestProvRate);

  // Ontario Surtax & Ontario Health Premium
  if (provProfile.hasOntarioSurtaxAndHealthPremium) {
    const surtax1 = Math.max(0, provincialTax - 5710) * 0.2;
    const surtax2 = Math.max(0, provincialTax - 7307) * 0.36;
    const ontarioHealthPremium =
      taxableIncome <= 20000
        ? 0
        : taxableIncome <= 36000
        ? Math.min(300, (taxableIncome - 20000) * 0.06)
        : taxableIncome <= 48000
        ? Math.min(450, 300 + (taxableIncome - 36000) * 0.06)
        : taxableIncome <= 72000
        ? Math.min(600, 450 + (taxableIncome - 48000) * 0.25)
        : taxableIncome <= 200000
        ? Math.min(750, 600 + (taxableIncome - 72000) * 0.25)
        : Math.min(900, 750 + (taxableIncome - 200000) * 0.25);
    provincialTax += surtax1 + surtax2 + ontarioHealthPremium;
  }

  const totalIncomeTax = federalTax + provincialTax;
  const totalDeductions = totalIncomeTax + totalCpp + eiContribution + rrsp;
  const netAnnual = Math.max(0, gross - totalDeductions);
  const combinedMarginalRatePct = (fedRaw.marginalRate + provRaw.marginalRate) * 100;
  const averageTaxRatePct = gross > 0 ? ((totalIncomeTax + totalCpp + eiContribution) / gross) * 100 : 0;

  return {
    provinceProfile: provProfile,
    gross,
    rrsp,
    taxableIncome,
    federalTax,
    provincialTax,
    totalIncomeTax,
    cpp1Contribution,
    cpp2Contribution,
    totalCpp,
    eiContribution,
    combinedMarginalRatePct,
    averageTaxRatePct,
    netAnnual,
    netMonthly: netAnnual / 12,
    netBiWeekly: netAnnual / 26,
    source: CANADA_TAX_DATA_2025.source,
  };
}

// ============================================================================
// #37: INDIA INCOME TAX CALCULATOR (NEW VS OLD REGIME)
// ============================================================================
export interface IndiaIncomeTaxInput {
  financialYear: '2025-26' | '2024-25';
  ageBand: 'under60' | 'senior60to79' | 'superSenior80Plus';
  grossSalary: number;
  otherIncome: number;
  deduction80C: number;
  deduction80D: number;
  hraExemption: number;
  homeLoanInterest24b: number;
  npsExtra80CCD1B: number;
  employerNps80CCD2: number;
}

export function calculateIndiaIncomeTax(input: IndiaIncomeTaxInput) {
  const salary = Math.max(0, input.grossSalary);
  const other = Math.max(0, input.otherIncome);
  const grossTotal = salary + other;

  // --- NEW REGIME (Section 115BAC) ---
  const newConfig = INDIA_TAX_DATA.newRegime[input.financialYear];
  const newStdDed = salary > 0 ? Math.min(salary, newConfig.standardDeduction) : 0;
  const newDeductions = newStdDed + Math.max(0, input.employerNps80CCD2);
  const newTaxable = Math.max(0, grossTotal - newDeductions);
  const newRaw = computeProgressiveTax(newTaxable, newConfig.slabs);

  // Section 87A Rebate & Marginal Relief under New Regime
  let newTaxAfterRebate = newRaw.totalTax;
  if (newTaxable <= newConfig.rebate87ALimit) {
    newTaxAfterRebate = 0;
  } else {
    // Marginal relief just above the 87A threshold
    const excessIncomeAboveRebateLimit = newTaxable - newConfig.rebate87ALimit;
    if (newRaw.totalTax > excessIncomeAboveRebateLimit) {
      newTaxAfterRebate = excessIncomeAboveRebateLimit;
    }
  }
  const newCess = newTaxAfterRebate * INDIA_TAX_DATA.cessRate;
  const newTotalTax = Math.round(newTaxAfterRebate + newCess);

  // --- OLD REGIME ---
  const oldStdDed = salary > 0 ? Math.min(salary, INDIA_TAX_DATA.oldRegime.standardDeduction) : 0;
  const d80C = Math.min(150000, Math.max(0, input.deduction80C));
  const d80D = Math.min(100000, Math.max(0, input.deduction80D));
  const dHra = Math.max(0, input.hraExemption);
  const d24b = Math.min(200000, Math.max(0, input.homeLoanInterest24b));
  const dNps = Math.min(50000, Math.max(0, input.npsExtra80CCD1B));
  const dEmpNps = Math.max(0, input.employerNps80CCD2);

  const oldTotalDeductions = oldStdDed + d80C + d80D + dHra + d24b + dNps + dEmpNps;
  const oldTaxable = Math.max(0, grossTotal - oldTotalDeductions);

  const basicExemption = INDIA_TAX_DATA.oldRegime.basicExemptionByAge[input.ageBand];
  const oldSlabs = [
    { threshold: 0, rate: 0 },
    { threshold: basicExemption, rate: 0.05 },
    { threshold: 500000, rate: 0.2 },
    { threshold: 1000000, rate: 0.3 },
  ].filter((s, idx) => idx === 0 || s.threshold >= basicExemption);

  const oldRaw = computeProgressiveTax(oldTaxable, oldSlabs);
  const oldTaxAfterRebate = oldTaxable <= INDIA_TAX_DATA.oldRegime.rebate87ALimit ? 0 : oldRaw.totalTax;
  const oldCess = oldTaxAfterRebate * INDIA_TAX_DATA.cessRate;
  const oldTotalTax = Math.round(oldTaxAfterRebate + oldCess);

  const taxSavings = Math.abs(oldTotalTax - newTotalTax);
  const recommendedRegime =
    newTotalTax < oldTotalTax ? 'New Regime' : oldTotalTax < newTotalTax ? 'Old Regime' : 'Equal Tax in Both';

  // Calculate total deductions needed under Old Regime to match New Regime tax
  const targetOldBaseTax = newTaxAfterRebate;
  let breakEvenOldTaxable = 0;
  if (targetOldBaseTax <= 0) {
    breakEvenOldTaxable = 500000;
  } else {
    // Invert old regime slabs to find taxable income that produces targetOldBaseTax
    let lo = 0;
    let hi = grossTotal;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const t = mid <= 500000 ? 0 : computeProgressiveTax(mid, oldSlabs).totalTax;
      if (t < targetOldBaseTax) lo = mid;
      else hi = mid;
    }
    breakEvenOldTaxable = Math.round((lo + hi) / 2);
  }
  const totalDeductionsNeededForOldToWin = Math.max(0, grossTotal - breakEvenOldTaxable);
  const additionalDeductionsNeededForOld = Math.max(
    0,
    totalDeductionsNeededForOldToWin - oldTotalDeductions
  );

  return {
    grossTotal,
    newRegime: {
      deductions: newDeductions,
      taxableIncome: newTaxable,
      baseTax: Math.round(newTaxAfterRebate),
      cess: Math.round(newCess),
      totalTax: newTotalTax,
      netTakeHomeAnnual: Math.max(0, grossTotal - newTotalTax),
      netTakeHomeMonthly: Math.max(0, grossTotal - newTotalTax) / 12,
    },
    oldRegime: {
      deductions: oldTotalDeductions,
      taxableIncome: oldTaxable,
      baseTax: Math.round(oldTaxAfterRebate),
      cess: Math.round(oldCess),
      totalTax: oldTotalTax,
      netTakeHomeAnnual: Math.max(0, grossTotal - oldTotalTax),
      netTakeHomeMonthly: Math.max(0, grossTotal - oldTotalTax) / 12,
    },
    recommendedRegime,
    taxSavings,
    totalDeductionsNeededForOldToWin,
    additionalDeductionsNeededForOld,
    source: INDIA_TAX_DATA.source,
  };
}

// ============================================================================
// #38: HRA EXEMPTION CALCULATOR ENGINE (SECTION 10(13A) RULE 2A)
// ============================================================================
export interface HraExemptionInput {
  basicSalaryAnnual: number;
  dearnessAllowanceAnnual: number;
  hraReceivedAnnual: number;
  rentPaidAnnual: number;
  isMetroCity: boolean;
}

export function calculateHraExemption(input: HraExemptionInput) {
  const basicPlusDa = Math.max(0, input.basicSalaryAnnual) + Math.max(0, input.dearnessAllowanceAnnual);
  const hraReceived = Math.max(0, input.hraReceivedAnnual);
  const rentPaid = Math.max(0, input.rentPaidAnnual);

  const limit1ActualHra = hraReceived;
  const limit2RentMinus10Pct = Math.max(0, rentPaid - 0.1 * basicPlusDa);
  const limit3MetroPct = basicPlusDa * (input.isMetroCity ? 0.5 : 0.4);

  const exemptHraAnnual = Math.min(limit1ActualHra, limit2RentMinus10Pct, limit3MetroPct);
  const taxableHraAnnual = Math.max(0, hraReceived - exemptHraAnnual);

  let governingRuleLabel = 'Actual HRA Received';
  if (exemptHraAnnual === limit2RentMinus10Pct) {
    governingRuleLabel = 'Actual Rent Paid minus 10% of (Basic + DA)';
  } else if (exemptHraAnnual === limit3MetroPct) {
    governingRuleLabel = input.isMetroCity ? '50% of (Basic + DA) [Metro]' : '40% of (Basic + DA) [Non-Metro]';
  }

  return {
    basicPlusDa,
    hraReceived,
    rentPaid,
    limit1ActualHra,
    limit2RentMinus10Pct,
    limit3MetroPct,
    exemptHraAnnual,
    exemptHraMonthly: exemptHraAnnual / 12,
    taxableHraAnnual,
    taxableHraMonthly: taxableHraAnnual / 12,
    governingRuleLabel,
    metroCities: INDIA_TAX_DATA.hraMetroCities,
    source: INDIA_TAX_DATA.source,
  };
}

// ============================================================================
// #39: VERIFIED INTERNATIONAL COUNTRY TAX ENGINE (DE, FR, UAE, SG)
// ============================================================================
export interface CountryTaxCalcInput {
  countrySlug: 'germany' | 'france' | 'uae' | 'singapore';
  grossIncome: number;
  isMarriedSplitting: boolean; // Ehegattensplitting (DE) or 2 parts (FR)
  optionalDeductions: number;
  includeChurchOrNationalPension: boolean; // Kirchensteuer (DE) or UAE National GPSSA (5%) or SG Citizen CPF (20%)
}

export function calculateCountryTax(input: CountryTaxCalcInput) {
  const profile = VERIFIED_INTERNATIONAL_COUNTRIES[input.countrySlug] || VERIFIED_INTERNATIONAL_COUNTRIES.germany;
  const gross = Math.max(0, input.grossIncome);
  const deductions = Math.max(0, input.optionalDeductions);

  let incomeTax = 0;
  let socialContributions = 0;
  let marginalRatePct = 0;

  if (input.countrySlug === 'germany') {
    // Social security employee shares 2025 (~20.8% capped at BBG €96,600 RV/AV and €66,150 KV/PV)
    const rvAvBase = Math.min(gross, 96600);
    const kvPvBase = Math.min(gross, 66150);
    socialContributions = rvAvBase * (0.093 + 0.013) + kvPvBase * (0.0815 + 0.018);

    const taxableTotal = Math.max(0, gross - socialContributions - 1230 - deductions);
    const splitFactor = input.isMarriedSplitting ? 2 : 1;
    const zvE = taxableTotal / splitFactor;

    // §32a EStG 2025 brackets
    const deRes = computeProgressiveTax(zvE, [
      { threshold: 0, rate: 0 },
      { threshold: 12096, rate: 0.24 },
      { threshold: 68429, rate: 0.42 },
      { threshold: 277825, rate: 0.45 },
    ]);
    let baseEst = deRes.totalTax * splitFactor;
    if (input.includeChurchOrNationalPension) {
      baseEst *= 1.09; // 9% Kirchensteuer
    }
    incomeTax = baseEst;
    marginalRatePct = deRes.marginalRate * 100;
  } else if (input.countrySlug === 'france') {
    // ~22% employee cotisations sociales
    socialContributions = gross * 0.22;
    const netImposableAfter10Pct = Math.max(0, (gross - socialContributions) * 0.9 - deductions);
    const parts = input.isMarriedSplitting ? 2 : 1;
    const qf = netImposableAfter10Pct / parts;

    // DGFiP 2025 Barème
    const frRes = computeProgressiveTax(qf, [
      { threshold: 0, rate: 0 },
      { threshold: 11497, rate: 0.11 },
      { threshold: 29315, rate: 0.30 },
      { threshold: 83823, rate: 0.41 },
      { threshold: 180294, rate: 0.45 },
    ]);
    incomeTax = frRes.totalTax * parts;
    marginalRatePct = frRes.marginalRate * 100;
  } else if (input.countrySlug === 'uae') {
    // 0% personal income tax; 5% GPSSA pension for UAE Nationals up to AED 840,000/yr
    incomeTax = 0;
    marginalRatePct = 0;
    socialContributions = input.includeChurchOrNationalPension ? Math.min(gross, 840000) * 0.05 : 0;
  } else {
    // Singapore YA 2025 Resident Brackets + CPF 20% up to S$88,800 annual OW ceiling (S$7,400/mo)
    socialContributions = input.includeChurchOrNationalPension ? Math.min(gross, 88800) * 0.20 : 0;
    const chargeableIncome = Math.max(0, gross - socialContributions - 1000 - deductions);
    const sgRes = computeProgressiveTax(chargeableIncome, [
      { threshold: 0, rate: 0 },
      { threshold: 20000, rate: 0.02 },
      { threshold: 30000, rate: 0.035 },
      { threshold: 40000, rate: 0.07 },
      { threshold: 80000, rate: 0.115 },
      { threshold: 120000, rate: 0.15 },
      { threshold: 160000, rate: 0.18 },
      { threshold: 200000, rate: 0.19 },
      { threshold: 240000, rate: 0.195 },
      { threshold: 280000, rate: 0.20 },
      { threshold: 320000, rate: 0.22 },
      { threshold: 500000, rate: 0.23 },
      { threshold: 1000000, rate: 0.24 },
    ]);
    incomeTax = sgRes.totalTax;
    marginalRatePct = sgRes.marginalRate * 100;
  }

  const totalDeductions = incomeTax + socialContributions;
  const netAnnual = Math.max(0, gross - totalDeductions);
  const effectiveRatePct = gross > 0 ? (totalDeductions / gross) * 100 : 0;

  return {
    profile,
    gross,
    incomeTax,
    socialContributions,
    totalDeductions,
    netAnnual,
    netMonthly: netAnnual / 12,
    effectiveRatePct,
    marginalRatePct,
  };
}

// ============================================================================
// #40: SALARY TO HOURLY CALCULATOR ENGINE
// ============================================================================
export interface SalaryToHourlyInput {
  inputMode: 'annual' | 'hourly';
  amount: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  unpaidLeaveWeeks: number;
  paidHolidayDays: number;
  adjustForPaidHolidays: boolean;
}

export function calculateSalaryToHourly(input: SalaryToHourlyInput) {
  const hoursPerWeek = Math.max(1, input.hoursPerWeek);
  const weeksPerYear = Math.max(1, Math.min(52, input.weeksPerYear));
  const unpaidWeeks = Math.max(0, Math.min(weeksPerYear - 1, input.unpaidLeaveWeeks));
  const paidWeeks = weeksPerYear - unpaidWeeks;

  const scheduledHoursPerYear = hoursPerWeek * paidWeeks;
  const hoursPerDay = hoursPerWeek / 5;
  const holidayHours = input.adjustForPaidHolidays ? Math.max(0, input.paidHolidayDays) * hoursPerDay : 0;
  const actualWorkedHoursPerYear = Math.max(1, scheduledHoursPerYear - holidayHours);

  const annualSalary =
    input.inputMode === 'annual'
      ? Math.max(0, input.amount)
      : Math.max(0, input.amount) * scheduledHoursPerYear;

  const nominalHourly = annualSalary / scheduledHoursPerYear;
  const effectiveWorkedHourly = annualSalary / actualWorkedHoursPerYear;

  return {
    annualSalary,
    scheduledHoursPerYear,
    actualWorkedHoursPerYear,
    nominalHourly,
    effectiveWorkedHourly,
    daily: nominalHourly * hoursPerDay,
    weekly: annualSalary / weeksPerYear,
    biWeekly: annualSalary / 26,
    semiMonthly: annualSalary / 24,
    monthly: annualSalary / 12,
  };
}

// ============================================================================
// #41: INDIA CTC TO IN-HAND SALARY CALCULATOR ENGINE
// ============================================================================
export interface IndiaCtcInput {
  annualCtc: number;
  basicPctOfCtc: number;
  hraPctOfBasic: number;
  epfCapAtStatutoryCeiling: boolean; // ₹1,800/mo (12% of ₹15,000) vs 12% of full Basic
  includeGratuityInCtc: boolean; // 4.81% of Basic
  stateCode: keyof typeof INDIA_TAX_DATA.professionalTaxByStateAnnual;
  regime: 'new' | 'old';
  deduction80CExtra: number;
  rentPaidAnnual: number;
  isMetroCity: boolean;
}

export function calculateIndiaInHandSalary(input: IndiaCtcInput) {
  const ctc = Math.max(0, input.annualCtc);
  const basicAnnual = ctc * (Math.max(10, Math.min(80, input.basicPctOfCtc)) / 100);
  const hraAnnual = basicAnnual * (Math.max(0, Math.min(100, input.hraPctOfBasic)) / 100);

  const epfAnnualSingleSide = input.epfCapAtStatutoryCeiling
    ? Math.min(basicAnnual, INDIA_TAX_DATA.epfStatutoryWageCeilingMonthly * 12) * 0.12
    : basicAnnual * 0.12;

  const employerPfAnnual = epfAnnualSingleSide;
  const employeePfAnnual = epfAnnualSingleSide;
  const gratuityAnnual = input.includeGratuityInCtc ? basicAnnual * 0.0481 : 0;

  // Gross Salary = CTC - Employer PF - Gratuity
  const grossSalaryAnnual = Math.max(0, ctc - employerPfAnnual - gratuityAnnual);
  const specialAllowanceAnnual = Math.max(0, grossSalaryAnnual - basicAnnual - hraAnnual);

  const ptProfile =
    INDIA_TAX_DATA.professionalTaxByStateAnnual[input.stateCode] ||
    INDIA_TAX_DATA.professionalTaxByStateAnnual.MH;
  const professionalTaxAnnual = ptProfile.annualTax;

  // HRA Exemption for Old Regime
  const hraCalc = calculateHraExemption({
    basicSalaryAnnual: basicAnnual,
    dearnessAllowanceAnnual: 0,
    hraReceivedAnnual: hraAnnual,
    rentPaidAnnual: input.rentPaidAnnual,
    isMetroCity: input.isMetroCity,
  });

  // Income Tax (TDS) using #37 engine
  const taxCalc = calculateIndiaIncomeTax({
    financialYear: '2025-26',
    ageBand: 'under60',
    grossSalary: grossSalaryAnnual,
    otherIncome: 0,
    deduction80C: Math.min(150000, employeePfAnnual + Math.max(0, input.deduction80CExtra)),
    deduction80D: 0,
    hraExemption: hraCalc.exemptHraAnnual,
    homeLoanInterest24b: 0,
    npsExtra80CCD1B: 0,
    employerNps80CCD2: 0,
  });

  const annualTds = input.regime === 'new' ? taxCalc.newRegime.totalTax : taxCalc.oldRegime.totalTax;
  const totalEmployeeDeductionsAnnual = employeePfAnnual + professionalTaxAnnual + annualTds;
  const netInHandAnnual = Math.max(0, grossSalaryAnnual - totalEmployeeDeductionsAnnual);

  return {
    ctc,
    basicAnnual,
    hraAnnual,
    specialAllowanceAnnual,
    employerPfAnnual,
    employeePfAnnual,
    gratuityAnnual,
    grossSalaryAnnual,
    professionalTaxAnnual,
    ptProfile,
    annualTds,
    taxComparison: taxCalc,
    netInHandAnnual,
    netInHandMonthly: netInHandAnnual / 12,
  };
}

// ============================================================================
// #42: OVERTIME PAY CALCULATOR ENGINE
// ============================================================================
export interface OvertimePayInput {
  payMode: 'hourly' | 'annual_salary';
  baseRateOrSalary: number;
  regularHoursPerWeek: number;
  overtimeHours15x: number;
  doubleTimeHours20x: number;
  customOvertimeMultiplier: number;
}

export function calculateOvertimePay(input: OvertimePayInput) {
  const regHours = Math.max(0, input.regularHoursPerWeek);
  const hourlyRate =
    input.payMode === 'hourly'
      ? Math.max(0, input.baseRateOrSalary)
      : Math.max(0, input.baseRateOrSalary) / (Math.max(1, regHours) * 52);

  const ot15Hours = Math.max(0, input.overtimeHours15x);
  const dt20Hours = Math.max(0, input.doubleTimeHours20x);
  const multiplier = Math.max(1, input.customOvertimeMultiplier || 1.5);

  const regularPayWeekly = regHours * hourlyRate;
  const overtimePayWeekly = ot15Hours * hourlyRate * multiplier;
  const doubleTimePayWeekly = dt20Hours * hourlyRate * 2.0;
  const totalOvertimePayWeekly = overtimePayWeekly + doubleTimePayWeekly;
  const totalGrossWeekly = regularPayWeekly + totalOvertimePayWeekly;
  const totalHoursWeekly = regHours + ot15Hours + dt20Hours;
  const effectiveHourlyRate = totalHoursWeekly > 0 ? totalGrossWeekly / totalHoursWeekly : hourlyRate;

  return {
    hourlyRate,
    overtimeRate: hourlyRate * multiplier,
    doubleTimeRate: hourlyRate * 2.0,
    regularPayWeekly,
    overtimePayWeekly,
    doubleTimePayWeekly,
    totalOvertimePayWeekly,
    totalGrossWeekly,
    totalGrossBiWeekly: totalGrossWeekly * 2,
    totalGrossMonthly: (totalGrossWeekly * 52) / 12,
    totalGrossAnnual: totalGrossWeekly * 52,
    effectiveHourlyRate,
  };
}

// ============================================================================
// #43: PAY RAISE CALCULATOR ENGINE
// ============================================================================
export interface PayRaiseInput {
  payPeriod: 'hourly' | 'monthly' | 'annual';
  currentPay: number;
  raiseMode: 'percentage' | 'new_amount';
  raiseValue: number;
  hoursPerWeek: number;
  inflationRatePct: number;
  compoundingYears: number;
}

export function calculatePayRaise(input: PayRaiseInput) {
  const hrsPerYear = Math.max(1, input.hoursPerWeek) * 52;
  const currentAnnual =
    input.payPeriod === 'annual'
      ? Math.max(0, input.currentPay)
      : input.payPeriod === 'monthly'
      ? Math.max(0, input.currentPay) * 12
      : Math.max(0, input.currentPay) * hrsPerYear;

  const newAnnual =
    input.raiseMode === 'percentage'
      ? currentAnnual * (1 + input.raiseValue / 100)
      : input.payPeriod === 'annual'
      ? Math.max(0, input.raiseValue)
      : input.payPeriod === 'monthly'
      ? Math.max(0, input.raiseValue) * 12
      : Math.max(0, input.raiseValue) * hrsPerYear;

  const nominalRaisePct = currentAnnual > 0 ? ((newAnnual - currentAnnual) / currentAnnual) * 100 : 0;
  const annualDiff = newAnnual - currentAnnual;

  // Fisher equation: real raise = (1 + raise) / (1 + inflation) - 1
  const infDec = input.inflationRatePct / 100;
  const raiseDec = nominalRaisePct / 100;
  const realRaisePct = ((1 + raiseDec) / (1 + infDec) - 1) * 100;
  const realPurchasingPowerAnnual = newAnnual / (1 + infDec);

  const multiYearSchedule = Array.from({ length: Math.max(1, Math.min(10, input.compoundingYears)) }, (_, idx) => {
    const yr = idx + 1;
    const projectedSalary = currentAnnual * Math.pow(1 + raiseDec, yr);
    const realSalary = projectedSalary / Math.pow(1 + infDec, yr);
    return {
      year: yr,
      projectedSalary,
      realSalary,
      gainOverCurrent: projectedSalary - currentAnnual,
    };
  });

  return {
    currentAnnual,
    newAnnual,
    annualDiff,
    monthlyDiff: annualDiff / 12,
    biWeeklyDiff: annualDiff / 26,
    hourlyDiff: annualDiff / hrsPerYear,
    newMonthly: newAnnual / 12,
    newBiWeekly: newAnnual / 26,
    newHourly: newAnnual / hrsPerYear,
    nominalRaisePct,
    realRaisePct,
    realPurchasingPowerAnnual,
    multiYearSchedule,
  };
}

// ============================================================================
// #44: BONUS TAX CALCULATOR ENGINE (IRS FLAT SUPPLEMENTAL VS AGGREGATE)
// ============================================================================
export interface BonusTaxInput {
  bonusAmount: number;
  annualSalary: number;
  filingStatus: UsFilingStatus;
  stateCode: string;
  withholdingMethod: 'flat_supplemental' | 'aggregate';
  bonus401kDeferralPct: number;
}

export function calculateBonusTax(input: BonusTaxInput) {
  const bonus = Math.max(0, input.bonusAmount);
  const salary = Math.max(0, input.annualSalary);
  const stateProfile = US_STATE_TAX_TAX_LOOKUP(input.stateCode);
  const deferral401k = bonus * (Math.max(0, Math.min(100, input.bonus401kDeferralPct)) / 100);
  const taxableBonusForIncomeTax = Math.max(0, bonus - deferral401k);

  // 1. Federal Supplemental Withholding
  // Flat Method: 22% on first $1,000,000; 37% on excess above $1,000,000 (IRS Pub 15)
  const under1M = Math.min(taxableBonusForIncomeTax, 1000000);
  const over1M = Math.max(0, taxableBonusForIncomeTax - 1000000);
  const flatFederalWithholding =
    under1M * US_FICA_2025.supplementalFlatRateUnder1M +
    over1M * US_FICA_2025.supplementalFlatRateOver1M;

  // Actual / Aggregate Marginal Federal Tax Liability on the Bonus
  const fedWithBonus = calculateUsFederalTax({
    taxYear: '2025',
    filingStatus: input.filingStatus,
    wages: salary + bonus,
    preTaxDeductions: { traditional401k: deferral401k },
  });
  const fedSalaryOnly = calculateUsFederalTax({
    taxYear: '2025',
    filingStatus: input.filingStatus,
    wages: salary,
  });
  const actualFederalLiabilityOnBonus = Math.max(
    0,
    fedWithBonus.finalTaxLiability - fedSalaryOnly.finalTaxLiability
  );

  const federalWithheldOnPaycheck =
    input.withholdingMethod === 'flat_supplemental'
      ? flatFederalWithholding
      : actualFederalLiabilityOnBonus;

  // 2. FICA on Bonus (considering existing salary against $176,100 SS cap)
  const remainingSsRoom = Math.max(0, US_FICA_2025.socialSecurityWageBase - salary);
  const bonusSubjectToSs = Math.min(bonus, remainingSsRoom);
  const socialSecurityTax = bonusSubjectToSs * US_FICA_2025.socialSecurityRateEmployee;
  const medicareTax = bonus * US_FICA_2025.medicareRateEmployee;

  const addMedThreshold =
    input.filingStatus === 'marriedFilingJointly'
      ? US_FICA_2025.additionalMedicareThreshold.married_joint
      : US_FICA_2025.additionalMedicareThreshold.single;
  const totalWages = salary + bonus;
  const bonusSubjectToAddMed = Math.max(
    0,
    Math.max(0, totalWages - addMedThreshold) - Math.max(0, salary - addMedThreshold)
  );
  const additionalMedicareTax = bonusSubjectToAddMed * US_FICA_2025.additionalMedicareRate;
  const totalFica = socialSecurityTax + medicareTax + additionalMedicareTax;

  // 3. State Supplemental Tax + State SDI
  const stateWithholding = taxableBonusForIncomeTax * stateProfile.supplementalBonusRate;
  const statePayrollTax = stateProfile.payrollItems.reduce((acc, item) => {
    const remainingCap = item.wageCap ? Math.max(0, item.wageCap - salary) : Infinity;
    return acc + Math.min(bonus, remainingCap) * item.rate;
  }, 0);

  const totalWithheldAndDeferred =
    federalWithheldOnPaycheck + totalFica + stateWithholding + statePayrollTax + deferral401k;
  const netBonusCheck = Math.max(0, bonus - totalWithheldAndDeferred);

  // Withholding vs Actual Liability Difference at April Tax Filing
  const withholdingMinusActualFederal = federalWithheldOnPaycheck - actualFederalLiabilityOnBonus;

  return {
    bonus,
    deferral401k,
    federalWithheldOnPaycheck,
    flatFederalWithholding,
    actualFederalLiabilityOnBonus,
    withholdingMinusActualFederal,
    socialSecurityTax,
    medicareTax: medicareTax + additionalMedicareTax,
    totalFica,
    stateWithholding: stateWithholding + statePayrollTax,
    stateProfile,
    netBonusCheck,
    effectiveWithholdingRatePct: bonus > 0 ? ((totalWithheldAndDeferred - deferral401k) / bonus) * 100 : 0,
    source: US_FICA_2025.source,
  };
}

function US_STATE_TAX_TAX_LOOKUP(code: string) {
  return US_STATE_TAX_PROFILES_2025[code] || US_STATE_TAX_PROFILES_2025.CA;
}

// ============================================================================
// #45: MARGIN CALCULATOR ENGINE
// ============================================================================
export interface MarginInput {
  mode: 'cost_and_price' | 'cost_and_margin' | 'revenue_and_margin';
  cost: number;
  priceOrRevenue: number;
  targetMarginPct: number;
}

export function calculateMargin(input: MarginInput) {
  let cost = 0;
  let price = 0;
  let marginPct = 0;

  if (input.mode === 'cost_and_price') {
    cost = Math.max(0, input.cost);
    price = Math.max(0, input.priceOrRevenue);
    marginPct = price > 0 ? ((price - cost) / price) * 100 : 0;
  } else if (input.mode === 'cost_and_margin') {
    cost = Math.max(0, input.cost);
    marginPct = Math.min(99.9, Math.max(-500, input.targetMarginPct));
    price = cost / (1 - marginPct / 100);
  } else {
    price = Math.max(0, input.priceOrRevenue);
    marginPct = Math.min(99.9, Math.max(-500, input.targetMarginPct));
    cost = price * (1 - marginPct / 100);
  }

  const grossProfit = price - cost;
  const markupPct = cost > 0 ? (grossProfit / cost) * 100 : 0;

  const conversionTable = [10, 15, 20, 25, 30, 33.33, 40, 50, 75, 100].map((markupVal) => {
    const m = markupVal / 100;
    const correspondingMargin = (m / (1 + m)) * 100;
    return {
      markupPct: markupVal,
      marginPct: correspondingMargin,
      sampleCost: 100,
      samplePrice: 100 * (1 + m),
      sampleProfit: 100 * m,
    };
  });

  return {
    cost,
    price,
    grossProfit,
    marginPct,
    markupPct,
    conversionTable,
  };
}

// ============================================================================
// #46: MARKUP CALCULATOR ENGINE
// ============================================================================
export interface MarkupInput {
  mode: 'cost_and_markup' | 'cost_and_price';
  cost: number;
  markupPct: number;
  sellingPrice: number;
  discountPct: number;
  taxGstVatPct: number;
}

export function calculateMarkup(input: MarkupInput) {
  const cost = Math.max(0, input.cost);
  const listPrice =
    input.mode === 'cost_and_markup'
      ? cost * (1 + input.markupPct / 100)
      : Math.max(0, input.sellingPrice);

  const discountRatio = Math.max(0, Math.min(100, input.discountPct)) / 100;
  const netSellingPricePreTax = listPrice * (1 - discountRatio);
  const profit = netSellingPricePreTax - cost;
  const effectiveMarkupPct = cost > 0 ? (profit / cost) * 100 : 0;
  const grossMarginPct = netSellingPricePreTax > 0 ? (profit / netSellingPricePreTax) * 100 : 0;
  const taxAmount = netSellingPricePreTax * (Math.max(0, input.taxGstVatPct) / 100);
  const finalCustomerPriceWithTax = netSellingPricePreTax + taxAmount;

  return {
    cost,
    listPrice,
    netSellingPricePreTax,
    profit,
    effectiveMarkupPct,
    grossMarginPct,
    taxAmount,
    finalCustomerPriceWithTax,
  };
}

// ============================================================================
// #47: BREAK-EVEN CALCULATOR ENGINE
// ============================================================================
export interface BreakEvenInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
  targetProfit: number;
  expectedActualUnits: number;
}

export function calculateBreakEven(input: BreakEvenInput) {
  const fixed = Math.max(0, input.fixedCosts);
  const varCost = Math.max(0, input.variableCostPerUnit);
  const price = Math.max(0, input.pricePerUnit);
  const target = Math.max(0, input.targetProfit);
  const actualUnits = Math.max(0, input.expectedActualUnits);

  const contributionMargin = price - varCost;
  const contributionMarginRatioPct = price > 0 ? (contributionMargin / price) * 100 : 0;
  const isViable = contributionMargin > 0;

  const bepUnits = isViable ? fixed / contributionMargin : Infinity;
  const bepRevenue = isViable ? bepUnits * price : Infinity;
  const targetUnits = isViable ? (fixed + target) / contributionMargin : Infinity;
  const targetRevenue = isViable ? targetUnits * price : Infinity;

  const marginOfSafetyUnits = isViable ? actualUnits - bepUnits : 0;
  const marginOfSafetyPct =
    isViable && actualUnits > 0 ? ((actualUnits - bepUnits) / actualUnits) * 100 : 0;

  // Price ±10% sensitivity scenarios
  const scenarios = [-0.1, 0, 0.1].map((delta) => {
    const scenarioPrice = price * (1 + delta);
    const scenarioCm = scenarioPrice - varCost;
    const scenarioBepUnits = scenarioCm > 0 ? fixed / scenarioCm : Infinity;
    const scenarioBepRevenue = Number.isFinite(scenarioBepUnits) ? scenarioBepUnits * scenarioPrice : Infinity;
    return {
      label: delta === -0.1 ? 'Price -10% Discount' : delta === 0 ? 'Baseline Price' : 'Price +10% Premium',
      price: scenarioPrice,
      cm: scenarioCm,
      bepUnits: scenarioBepUnits,
      bepRevenue: scenarioBepRevenue,
    };
  });

  // Chart points
  const maxUnits = Number.isFinite(bepUnits) && bepUnits > 0 ? Math.ceil(bepUnits * 2) : 1000;
  const step = Math.max(1, Math.round(maxUnits / 10));
  const chartPoints = Array.from({ length: 11 }, (_, idx) => {
    const units = idx * step;
    const totalCost = fixed + units * varCost;
    const totalRevenue = units * price;
    return {
      units,
      fixedCost: fixed,
      totalCost,
      totalRevenue,
      netProfit: totalRevenue - totalCost,
    };
  });

  return {
    fixed,
    varCost,
    price,
    contributionMargin,
    contributionMarginRatioPct,
    isViable,
    bepUnits,
    bepRevenue,
    targetUnits,
    targetRevenue,
    marginOfSafetyUnits,
    marginOfSafetyPct,
    scenarios,
    chartPoints,
  };
}

// ============================================================================
// #48: PROFIT MARGIN CALCULATOR ENGINE (WITH DAMODARAN BENCHMARKS)
// ============================================================================
export interface ProfitMarginInput {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  depreciationAndAmortization: number;
  interestExpense: number;
  taxes: number;
  sectorId: string;
}

export function calculateProfitMargin(input: ProfitMarginInput) {
  const rev = Math.max(0, input.revenue);
  const cogs = Math.max(0, input.cogs);
  const opex = Math.max(0, input.operatingExpenses);
  const da = Math.max(0, input.depreciationAndAmortization);
  const interest = Math.max(0, input.interestExpense);
  const taxes = Math.max(0, input.taxes);

  const grossProfit = rev - cogs;
  const ebitda = grossProfit - opex + da;
  const operatingProfit = grossProfit - opex; // EBIT
  const ebt = operatingProfit - interest;
  const netProfit = ebt - taxes;

  const grossMarginPct = rev > 0 ? (grossProfit / rev) * 100 : 0;
  const ebitdaMarginPct = rev > 0 ? (ebitda / rev) * 100 : 0;
  const operatingMarginPct = rev > 0 ? (operatingProfit / rev) * 100 : 0;
  const netMarginPct = rev > 0 ? (netProfit / rev) * 100 : 0;

  const benchmark =
    DAMODARAN_SECTOR_MARGINS_2025.sectors.find((s) => s.id === input.sectorId) ||
    DAMODARAN_SECTOR_MARGINS_2025.sectors[0];

  const waterfallSteps = [
    { label: 'Total Revenue', amount: rev, pctOfRevenue: 100, type: 'revenue' as const },
    { label: 'Cost of Goods Sold (COGS)', amount: -cogs, pctOfRevenue: rev > 0 ? (cogs / rev) * 100 : 0, type: 'cost' as const },
    { label: 'Gross Profit', amount: grossProfit, pctOfRevenue: grossMarginPct, type: 'subtotal' as const },
    { label: 'Operating Expenses (OPEX)', amount: -opex, pctOfRevenue: rev > 0 ? (opex / rev) * 100 : 0, type: 'cost' as const },
    { label: 'Operating Profit (EBIT)', amount: operatingProfit, pctOfRevenue: operatingMarginPct, type: 'subtotal' as const },
    { label: 'Interest & Taxes', amount: -(interest + taxes), pctOfRevenue: rev > 0 ? ((interest + taxes) / rev) * 100 : 0, type: 'cost' as const },
    { label: 'Net Profit', amount: netProfit, pctOfRevenue: netMarginPct, type: 'total' as const },
  ];

  return {
    rev,
    cogs,
    opex,
    da,
    interest,
    taxes,
    grossProfit,
    ebitda,
    operatingProfit,
    netProfit,
    grossMarginPct,
    ebitdaMarginPct,
    operatingMarginPct,
    netMarginPct,
    benchmark,
    benchmarkSource: DAMODARAN_SECTOR_MARGINS_2025.source,
    allSectors: DAMODARAN_SECTOR_MARGINS_2025.sectors,
    waterfallSteps,
  };
}
