/**
 * Roth vs. Traditional Retirement Calculator Engine
 *
 * Implements the Equal After-Tax Outlay (Commutative Tax Equivalence) model:
 * - Single Contribution Mode:
 *   Traditional Pre-Tax End Value = C * (1 + r)^n
 *   Traditional After-Tax End Value = C * (1 + r)^n * (1 - t_ret)
 *   Roth Initial After-Tax Contribution = C * (1 - t_now)
 *   Roth After-Tax End Value = C * (1 - t_now) * (1 + r)^n
 *
 * - Recurring Annual Contribution Mode (Optional Extension):
 *   Applies the same equal after-tax outlay logic across an n-year ordinary annuity:
 *   FV_factor = ((1 + r)^n - 1) / r (or n when r = 0)
 *   Traditional After-Tax End Value = C * FV_factor * (1 - t_ret)
 *   Roth After-Tax End Value = C * (1 - t_now) * FV_factor
 *
 * In both equal-outlay formulations, the growth multiplier cancels in ratio comparison,
 * reducing the comparison to (1 - t_ret) vs (1 - t_now), with Break-Even Retirement Rate = t_now.
 */

import limitsRetirementData from '../../data/limits-retirement-us.json';
import rmdTablesData from '../../data/rmd-tables.json';

export type ContributionFrequencyMode = 'single' | 'annual';

export interface RothVsTraditionalInput {
  /** Pre-tax contribution amount (C) in currency units */
  preTaxContribution: number;
  /** Current marginal income tax rate (%) e.g. 24 */
  currentMarginalRatePercent: number;
  /** Expected retirement income tax rate (%) e.g. 15 */
  expectedRetirementRatePercent: number;
  /** Investment horizon in years (n) e.g. 25 */
  years: number;
  /** Expected annual compound return rate (%) e.g. 7.0 */
  annualReturnPercent: number;
  /** Calculation mode: 'single' (default C(1+r)^n) or 'annual' (recurring C per year) */
  contributionMode?: ContributionFrequencyMode;
}

export interface RothVsTraditionalYearRow {
  year: number;
  cumulativePreTaxOutlay: number;
  cumulativeAfterTaxOutlay: number;
  traditionalPreTaxBalance: number;
  traditionalEmbeddedTaxLiability: number;
  traditionalAfterTaxValue: number;
  rothAfterTaxBalance: number;
  afterTaxDifference: number; // rothAfterTaxBalance - traditionalAfterTaxValue
}

export interface RetirementRateSensitivityRow {
  retirementRatePercent: number;
  oneMinusRetRatePercent: number;
  traditionalAfterTaxEndValue: number;
  rothAfterTaxEndValue: number;
  netDifference: number; // positive = Roth higher, negative = Traditional higher, 0 = tie
  outcome: 'traditional' | 'roth' | 'equal';
}

export interface RothVsTraditionalResult {
  // Inputs echoed
  preTaxContribution: number;
  currentMarginalRatePercent: number;
  expectedRetirementRatePercent: number;
  years: number;
  annualReturnPercent: number;
  contributionMode: ContributionFrequencyMode;

  // Equal Outlay Initial Cash Flow Mechanics
  immediateTaxPaidOrSaved: number; // C * t_now
  equalAfterTaxOutlayPerPeriod: number; // C * (1 - t_now)
  totalPreTaxContributionAllocated: number;
  totalEqualAfterTaxOutlay: number;

  // Growth Factor
  compoundGrowthFactor: number; // (1 + r)^n for single, or annuity factor for annual
  singleContributionMultiplier: number; // (1 + r)^n

  // Traditional Account End Values
  traditionalPreTaxEndValue: number;
  traditionalTaxesOwedAtRetirement: number;
  traditionalAfterTaxEndValue: number;

  // Roth Account End Values
  rothPrincipalContributed: number;
  rothTaxFreeGrowth: number;
  rothAfterTaxEndValue: number;

  // Core Comparison Outputs
  differenceSigned: number; // rothAfterTaxEndValue - traditionalAfterTaxEndValue
  differenceAbsolute: number; // |rothAfterTaxEndValue - traditionalAfterTaxEndValue|
  percentageAdvantage: number; // |diff| / min(trad, roth) * 100
  breakEvenRetirementRatePercent: number; // equals currentMarginalRatePercent
  rateSpreadPercentagePoints: number; // expectedRetirementRatePercent - currentMarginalRatePercent
  oneMinusCurrentRatePercent: number; // (1 - t_now) * 100
  oneMinusRetirementRatePercent: number; // (1 - t_ret) * 100
  higherOutcome: 'traditional' | 'roth' | 'equal';
  neutralSummaryText: string;

  // Value-Added: RMD Illustration at Age 73 (IRS Uniform Lifetime Table divisor 26.5)
  rmdAge73Divisor: number;
  traditionalFirstYearRmdAt73: number;
  traditionalFirstYearRmdTaxAtRetirementRate: number;
  rothLifetimeRmd: number; // $0 under SECURE 2.0

  // Timelines & Sensitivity
  timeline: RothVsTraditionalYearRow[];
  sensitivityTable: RetirementRateSensitivityRow[];
}

export const VERIFIED_IRS_RETIREMENT_LIMITS = limitsRetirementData.limits;
export const VERIFIED_IRS_RMD_TABLE = rmdTablesData;

/**
 * Computes the Roth vs. Traditional comparison under the equal after-tax outlay principle.
 */
export function calculateRothVsTraditional(
  input: RothVsTraditionalInput
): RothVsTraditionalResult {
  const C = Math.max(0, Number(input.preTaxContribution) || 0);
  const tNowPct = Math.min(99, Math.max(0, Number(input.currentMarginalRatePercent) || 0));
  const tRetPct = Math.min(99, Math.max(0, Number(input.expectedRetirementRatePercent) || 0));
  const n = Math.min(100, Math.max(1, Math.round(Number(input.years) || 1)));
  const rPct = Math.min(50, Math.max(-20, Number(input.annualReturnPercent) || 0));
  const contributionMode: ContributionFrequencyMode = input.contributionMode || 'single';

  const tNow = tNowPct / 100;
  const tRet = tRetPct / 100;
  const r = rPct / 100;

  const immediateTaxPaidOrSaved = C * tNow;
  const equalAfterTaxOutlayPerPeriod = C * (1 - tNow);

  const singleContributionMultiplier = Math.pow(1 + r, n);

  const compoundGrowthFactor =
    contributionMode === 'single'
      ? singleContributionMultiplier
      : Math.abs(r) < 1e-9
      ? n
      : (Math.pow(1 + r, n) - 1) / r;

  const totalPeriods = contributionMode === 'single' ? 1 : n;
  const totalPreTaxContributionAllocated = C * totalPeriods;
  const totalEqualAfterTaxOutlay = equalAfterTaxOutlayPerPeriod * totalPeriods;

  // Traditional End Values
  const traditionalPreTaxEndValue = C * compoundGrowthFactor;
  const traditionalTaxesOwedAtRetirement = traditionalPreTaxEndValue * tRet;
  const traditionalAfterTaxEndValue = traditionalPreTaxEndValue * (1 - tRet);

  // Roth End Values (Equal After-Tax Outlay: C * (1 - t_now))
  const rothPrincipalContributed = totalEqualAfterTaxOutlay;
  const rothAfterTaxEndValue = C * (1 - tNow) * compoundGrowthFactor;
  const rothTaxFreeGrowth = Math.max(0, rothAfterTaxEndValue - rothPrincipalContributed);

  // Core Comparison
  const differenceSigned = rothAfterTaxEndValue - traditionalAfterTaxEndValue;
  const differenceAbsolute = Math.abs(differenceSigned);

  const minEndValue = Math.min(traditionalAfterTaxEndValue, rothAfterTaxEndValue);
  const percentageAdvantage =
    minEndValue > 0 ? (differenceAbsolute / minEndValue) * 100 : 0;

  const breakEvenRetirementRatePercent = tNowPct;
  const rateSpreadPercentagePoints = tRetPct - tNowPct;
  const oneMinusCurrentRatePercent = (1 - tNow) * 100;
  const oneMinusRetirementRatePercent = (1 - tRet) * 100;

  let higherOutcome: 'traditional' | 'roth' | 'equal' = 'equal';
  if (Math.abs(tRetPct - tNowPct) < 1e-6) {
    higherOutcome = 'equal';
  } else if (tRetPct < tNowPct) {
    higherOutcome = 'traditional';
  } else {
    higherOutcome = 'roth';
  }

  let neutralSummaryText = '';
  if (higherOutcome === 'equal') {
    neutralSummaryText =
      'Because the expected retirement tax rate equals the current marginal tax rate, Traditional and Roth produce identical after-tax purchasing power under an equal after-tax outlay.';
  } else if (higherOutcome === 'traditional') {
    neutralSummaryText = `Because the expected retirement tax rate (${tRetPct.toFixed(1)}%) is lower than the current marginal tax rate (${tNowPct.toFixed(1)}%), the Traditional account retains ${(100 - tRetPct).toFixed(1)}% of terminal value vs. ${(100 - tNowPct).toFixed(1)}% for Roth.`;
  } else {
    neutralSummaryText = `Because the expected retirement tax rate (${tRetPct.toFixed(1)}%) is higher than the current marginal tax rate (${tNowPct.toFixed(1)}%), paying the ${tNowPct.toFixed(1)}% tax rate upfront via Roth retains ${(100 - tNowPct).toFixed(1)}% of terminal value vs. ${(100 - tRetPct).toFixed(1)}% for Traditional.`;
  }

  // Year-by-year trajectory
  const timeline: RothVsTraditionalYearRow[] = [];
  for (let yr = 1; yr <= n; yr++) {
    const factorYr =
      contributionMode === 'single'
        ? Math.pow(1 + r, yr)
        : Math.abs(r) < 1e-9
        ? yr
        : (Math.pow(1 + r, yr) - 1) / r;

    const periodsElapsed = contributionMode === 'single' ? 1 : yr;
    const cumPreTax = C * periodsElapsed;
    const cumAfterTax = equalAfterTaxOutlayPerPeriod * periodsElapsed;

    const tradPreTax = C * factorYr;
    const tradTax = tradPreTax * tRet;
    const tradAfterTax = tradPreTax * (1 - tRet);
    const rothAfterTax = C * (1 - tNow) * factorYr;

    timeline.push({
      year: yr,
      cumulativePreTaxOutlay: cumPreTax,
      cumulativeAfterTaxOutlay: cumAfterTax,
      traditionalPreTaxBalance: tradPreTax,
      traditionalEmbeddedTaxLiability: tradTax,
      traditionalAfterTaxValue: tradAfterTax,
      rothAfterTaxBalance: rothAfterTax,
      afterTaxDifference: rothAfterTax - tradAfterTax,
    });
  }

  // Sensitivity across expected retirement tax rates
  const candidateRates = [0, 10, 12, 15, 20, 22, 24, 28, 32, 35, 37];
  if (!candidateRates.some((cr) => Math.abs(cr - tNowPct) < 0.05)) {
    candidateRates.push(tNowPct);
    candidateRates.sort((a, b) => a - b);
  }

  const sensitivityTable: RetirementRateSensitivityRow[] = candidateRates.map((ratePct) => {
    const rateDec = ratePct / 100;
    const tradVal = traditionalPreTaxEndValue * (1 - rateDec);
    const rothVal = rothAfterTaxEndValue;
    const diff = rothVal - tradVal;
    const outcome: 'traditional' | 'roth' | 'equal' =
      Math.abs(ratePct - tNowPct) < 1e-6
        ? 'equal'
        : ratePct < tNowPct
        ? 'traditional'
        : 'roth';

    return {
      retirementRatePercent: ratePct,
      oneMinusRetRatePercent: (1 - rateDec) * 100,
      traditionalAfterTaxEndValue: tradVal,
      rothAfterTaxEndValue: rothVal,
      netDifference: diff,
      outcome,
    };
  });

  // RMD at age 73 illustration from verified rmd-tables.json
  const age73FactorObj = rmdTablesData.factors.find((f) => f.age === 73);
  const rmdAge73Divisor = age73FactorObj ? age73FactorObj.distributionPeriod : 26.5;
  const traditionalFirstYearRmdAt73 = traditionalPreTaxEndValue / rmdAge73Divisor;
  const traditionalFirstYearRmdTaxAtRetirementRate = traditionalFirstYearRmdAt73 * tRet;

  return {
    preTaxContribution: C,
    currentMarginalRatePercent: tNowPct,
    expectedRetirementRatePercent: tRetPct,
    years: n,
    annualReturnPercent: rPct,
    contributionMode,

    immediateTaxPaidOrSaved,
    equalAfterTaxOutlayPerPeriod,
    totalPreTaxContributionAllocated,
    totalEqualAfterTaxOutlay,

    compoundGrowthFactor,
    singleContributionMultiplier,

    traditionalPreTaxEndValue,
    traditionalTaxesOwedAtRetirement,
    traditionalAfterTaxEndValue,

    rothPrincipalContributed,
    rothTaxFreeGrowth,
    rothAfterTaxEndValue,

    differenceSigned,
    differenceAbsolute,
    percentageAdvantage,
    breakEvenRetirementRatePercent,
    rateSpreadPercentagePoints,
    oneMinusCurrentRatePercent,
    oneMinusRetirementRatePercent,
    higherOutcome,
    neutralSummaryText,

    rmdAge73Divisor,
    traditionalFirstYearRmdAt73,
    traditionalFirstYearRmdTaxAtRetirementRate,
    rothLifetimeRmd: 0,

    timeline,
    sensitivityTable,
  };
}
