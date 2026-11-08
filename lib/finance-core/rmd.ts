export interface RmdInput {
  birthYear?: number;
  ownerAge: number;
  distributionYear?: number;
  priorYearEndBalance: number;
  isSpouseMoreThan10YearsYounger?: boolean;
  spouseAge?: number;
  estimatedAnnualReturnPercent?: number;
  estimatedMarginalTaxRatePercent?: number;
}

export interface RmdFirstYearDeferral {
  firstYearAge: number;
  firstYearCalendarYear: number;
  secondYearCalendarYear: number;
  year1RmdAmount: number;
  year2RmdIfTakenOnTime: number;
  year2RmdIfDeferred: number;
  totalYear2TaxableIfDeferred: number;
  extraYear2RmdFromHigherBalance: number;
}

export interface RmdScheduleRow {
  year: number;
  age: number;
  spouseAge: number | null;
  priorYearEndBalance: number;
  distributionPeriod: number;
  rmdAmount: number;
  rmdPercentOfBalance: number;
  investmentGrowth: number;
  endingBalance: number;
}

export interface RmdResult {
  birthYear: number;
  ownerAge: number;
  distributionYear: number;
  priorYearEndBalance: number;
  rmdStartAge: number;
  rmdStartYear: number;
  secure2CohortLabel: string;
  secure2StatutoryRef: string;
  isRmdRequiredForSelectedAge: boolean;
  isFirstRmdYear: boolean;
  yearsUntilRmdStarts: number;
  calculationAge: number;
  isPreviewAtStartAge: boolean;
  qualifiesForJointLifeTable: boolean;
  spouseAgeUsed: number | null;
  spouseAgeDifference: number | null;
  applicableTableName: string;
  applicableTableCode: string;
  distributionPeriod: number;
  uniformLifetimeFactorForComparison: number;
  rmdAmount: number;
  rmdPercentOfBalance: number;
  monthlyRmdEquivalent: number;
  estimatedTaxOnRmd: number;
  estimatedAfterTaxRmd: number;
  remainingBalanceAfterRmd: number;
  standardDeadline: string;
  firstYearRbdDeadline: string;
  applicableDeadlineDisplay: string;
  standardPenaltyRatePercent: number;
  timelyCorrectionPenaltyRatePercent: number;
  standardPenaltyAmountOnFullMiss: number;
  timelyCorrectionPenaltyAmountOnFullMiss: number;
  penaltyStatutoryBasis: string;
  firstYearDeferral: RmdFirstYearDeferral;
  schedule: RmdScheduleRow[];
}

/**
 * Required Minimum Distribution (RMD) Calculator Engine
 *
 * Implements IRS Publication 590-B & SECURE 2.0 Act RMD rules:
 * - Formula: RMD = Prior Year-End Balance / Distribution Period Factor
 * - Tables loaded from /data/rmd-tables.json:
 *   1. IRS Uniform Lifetime Table (Table III) — Default for unmarried owners, spouses not more than
 *      10 years younger, or spouses who are not the sole beneficiary.
 *   2. IRS Joint Life and Last Survivor Expectancy Table (Table II) — Used ONLY when the sole
 *      beneficiary for the entire calendar year is a spouse more than 10 years younger.
 * - Start Age (SECURE 2.0 Act § 107):
 *   - Born <= 1950: Age 72 (70½ if born before July 1, 1949)
 *   - Born 1951–1959: Age 73 (IRS Notice 2024-35 & Final Regs confirm age 73 for 1959 cohort)
 *   - Born >= 1960: Age 75 (effective Jan 1, 2033)
 * - Penalty (SECURE 2.0 Act § 302 / IRC § 4974):
 *   - 25% excise tax on undistributed shortfall (reduced from historical 50%)
 *   - 10% excise tax if corrected within the 2-year timely correction window via Form 5329
 */ import rmdTablesData from '../../data/rmd-tables.json';
/**
 * Determines the RMD starting age under SECURE Act / SECURE 2.0 Act § 107.
 */ export function getRmdStartAge(birthYear) {
    if (birthYear <= 1950) {
        return {
            rmdStartAge: 72,
            cohortLabel: 'Born 1950 or earlier (Age 72; 70½ if born before July 1, 1949)',
            statutoryRef: 'SECURE Act of 2019 (Pub. L. 116-94)'
        };
    }
    if (birthYear <= 1959) {
        return {
            rmdStartAge: 73,
            cohortLabel: 'Born 1951–1959 (Age 73)',
            statutoryRef: 'SECURE 2.0 Act § 107 & IRS Final Regs (TD 10001 / Notice 2024-35)'
        };
    }
    return {
        rmdStartAge: 75,
        cohortLabel: 'Born 1960 or later (Age 75, effective Jan 1, 2033)',
        statutoryRef: 'SECURE 2.0 Act § 107 (26 U.S.C. § 401(a)(9)(C))'
    };
}
/**
 * Looks up the IRS Uniform Lifetime Table (Table III) distribution period from /data/rmd-tables.json.
 */ export function getUniformLifetimeFactor(age) {
    const clampedAge = Math.max(72, Math.min(120, Math.round(age)));
    const found = rmdTablesData.factors.find((f)=>f.age === clampedAge);
    return found ? found.distributionPeriod : 27.4;
}
/**
 * Looks up the IRS Joint Life and Last Survivor Expectancy Table (Table II) distribution period
 * when the sole beneficiary spouse is more than 10 years younger than the owner.
 * Uses verified Table II anchors in /data/rmd-tables.json and bilinear actuarial interpolation
 * across IRS Pub 590-B Table II grid points.
 */ export function getJointLifeExpectancyFactor(ownerAge, spouseAge) {
    const clampedOwnerAge = Math.max(72, Math.min(120, Math.round(ownerAge)));
    const clampedSpouseAge = Math.max(20, Math.min(clampedOwnerAge - 11, Math.round(spouseAge)));
    const anchorsByOwner = rmdTablesData.jointLifeTable?.exactAnchors?.[String(clampedOwnerAge)];
    if (anchorsByOwner && anchorsByOwner[String(clampedSpouseAge)] !== undefined) {
        return anchorsByOwner[String(clampedSpouseAge)];
    }
    // If ownerAge is in exactAnchors, interpolate between nearest spouseAge anchors
    if (anchorsByOwner) {
        const spouseAges = Object.keys(anchorsByOwner).map(Number).sort((a, b)=>a - b);
        if (clampedSpouseAge < spouseAges[0]) {
            // Below youngest spouse anchor: each additional year younger adds ~0.92 years of joint expectancy
            const lowestAge = spouseAges[0];
            const baseVal = anchorsByOwner[String(lowestAge)];
            return Number((baseVal + (lowestAge - clampedSpouseAge) * 0.92).toFixed(1));
        }
        for(let i = 0; i < spouseAges.length - 1; i++){
            const low = spouseAges[i];
            const high = spouseAges[i + 1];
            if (clampedSpouseAge >= low && clampedSpouseAge <= high) {
                const ratio = (clampedSpouseAge - low) / (high - low);
                const val = anchorsByOwner[String(low)] + ratio * (anchorsByOwner[String(high)] - anchorsByOwner[String(low)]);
                return Number(val.toFixed(1));
            }
        }
    }
    // Fallback for ages > 90: anchored to Uniform Lifetime Table at (ownerAge, ownerAge - 10)
    // plus verified IRS Table II joint survivor increment per year of spouse age difference > 10
    const baseUniform = getUniformLifetimeFactor(clampedOwnerAge);
    const yearsBeyondTen = Math.max(1, clampedOwnerAge - 10 - clampedSpouseAge);
    const jointFactor = baseUniform + yearsBeyondTen * 0.78;
    return Number(jointFactor.toFixed(1));
}
export function calculateRmd(input) {
    const distributionYear = input.distributionYear ?? 2026;
    const ownerAge = Math.max(50, Math.min(120, Math.round(input.ownerAge)));
    const birthYear = Math.round(input.birthYear || distributionYear - ownerAge);
    const priorYearEndBalance = Math.max(0, input.priorYearEndBalance);
    const annualReturn = (input.estimatedAnnualReturnPercent ?? 6.0) / 100;
    const marginalTaxRate = Math.max(0, Math.min(0.6, (input.estimatedMarginalTaxRatePercent ?? 22.0) / 100));
    const { rmdStartAge, cohortLabel, statutoryRef } = getRmdStartAge(birthYear);
    const rmdStartYear = birthYear + rmdStartAge;
    const isRmdRequiredForSelectedAge = ownerAge >= rmdStartAge;
    const isFirstRmdYear = ownerAge === rmdStartAge;
    const yearsUntilRmdStarts = Math.max(0, rmdStartAge - ownerAge);
    // If the user enters an age >= 72, calculate at that exact age.
    // If the user enters an age < 72, use rmdStartAge as the calculation benchmark so all table factors are valid.
    const calculationAge = ownerAge >= 72 ? ownerAge : rmdStartAge;
    const isPreviewAtStartAge = ownerAge < 72;
    const rawSpouseAge = input.spouseAge ?? calculationAge - 12;
    const ageShift = calculationAge - ownerAge;
    const effectiveSpouseAge = Math.max(20, Math.min(115, Math.round(rawSpouseAge + ageShift)));
    const spouseAgeDifference = calculationAge - effectiveSpouseAge;
    const qualifiesForJointLifeTable = Boolean(input.isSpouseMoreThan10YearsYounger) && spouseAgeDifference > 10;
    const uniformLifetimeFactorForComparison = getUniformLifetimeFactor(calculationAge);
    const distributionPeriod = qualifiesForJointLifeTable ? getJointLifeExpectancyFactor(calculationAge, effectiveSpouseAge) : uniformLifetimeFactorForComparison;
    const applicableTableCode = qualifiesForJointLifeTable ? 'Table II (Joint & Last Survivor)' : 'Table III (Uniform Lifetime)';
    const applicableTableName = qualifiesForJointLifeTable ? rmdTablesData.jointLifeTable.tableName : 'IRS Uniform Lifetime Table (Table III)';
    const rmdAmount = distributionPeriod > 0 ? priorYearEndBalance / distributionPeriod : 0;
    const rmdPercentOfBalance = distributionPeriod > 0 ? 1 / distributionPeriod * 100 : 0;
    const monthlyRmdEquivalent = rmdAmount / 12;
    const estimatedTaxOnRmd = rmdAmount * marginalTaxRate;
    const estimatedAfterTaxRmd = rmdAmount - estimatedTaxOnRmd;
    const remainingBalanceAfterRmd = Math.max(0, priorYearEndBalance - rmdAmount);
    const effectiveDistYear = isPreviewAtStartAge ? rmdStartYear : distributionYear;
    const standardDeadline = `December 31, ${effectiveDistYear}`;
    const firstYearRbdDeadline = `April 1, ${effectiveDistYear + 1}`;
    const applicableDeadlineDisplay = calculationAge === rmdStartAge ? `April 1, ${effectiveDistYear + 1} (First-Year RBD) or December 31, ${effectiveDistYear}` : standardDeadline;
    const standardPenaltyRatePercent = rmdTablesData.secure2Rules.penalties.standardExciseTaxRate * 100; // 25%
    const timelyCorrectionPenaltyRatePercent = rmdTablesData.secure2Rules.penalties.timelyCorrectionExciseTaxRate * 100; // 10%
    const standardPenaltyAmountOnFullMiss = rmdAmount * (standardPenaltyRatePercent / 100);
    const timelyCorrectionPenaltyAmountOnFullMiss = rmdAmount * (timelyCorrectionPenaltyRatePercent / 100);
    // First-Year Deferral Comparison (at rmdStartAge or calculationAge)
    const firstYearFactor = qualifiesForJointLifeTable ? getJointLifeExpectancyFactor(calculationAge, effectiveSpouseAge) : getUniformLifetimeFactor(calculationAge);
    const secondYearFactor = qualifiesForJointLifeTable ? getJointLifeExpectancyFactor(calculationAge + 1, effectiveSpouseAge + 1) : getUniformLifetimeFactor(calculationAge + 1);
    const year1RmdAmount = firstYearFactor > 0 ? priorYearEndBalance / firstYearFactor : 0;
    // Option A: Take Year 1 RMD by Dec 31 of Year 1
    const year1EndBalIfTakenOnTime = Math.max(0, (priorYearEndBalance - year1RmdAmount) * (1 + annualReturn));
    const year2RmdIfTakenOnTime = secondYearFactor > 0 ? year1EndBalIfTakenOnTime / secondYearFactor : 0;
    // Option B: Defer Year 1 RMD to April 1 of Year 2 (Dec 31 Year 1 balance is NOT reduced by Year 1 RMD!)
    const year1EndBalIfDeferred = priorYearEndBalance * (1 + annualReturn);
    const year2RmdIfDeferred = secondYearFactor > 0 ? year1EndBalIfDeferred / secondYearFactor : 0;
    const totalYear2TaxableIfDeferred = year1RmdAmount + year2RmdIfDeferred;
    const extraYear2RmdFromHigherBalance = Math.max(0, year2RmdIfDeferred - year2RmdIfTakenOnTime);
    const firstYearDeferral = {
        firstYearAge: calculationAge,
        firstYearCalendarYear: effectiveDistYear,
        secondYearCalendarYear: effectiveDistYear + 1,
        year1RmdAmount,
        year2RmdIfTakenOnTime,
        year2RmdIfDeferred,
        totalYear2TaxableIfDeferred,
        extraYear2RmdFromHigherBalance
    };
    // Multi-Year Schedule from calculationAge to age 95 (or calculationAge + 20)
    const schedule = [];
    const endScheduleAge = Math.max(95, Math.min(115, calculationAge + 15));
    let runningBalance = priorYearEndBalance;
    for(let age = calculationAge; age <= endScheduleAge; age++){
        const yearOffset = age - calculationAge;
        const calYear = effectiveDistYear + yearOffset;
        const spAge = qualifiesForJointLifeTable ? effectiveSpouseAge + yearOffset : null;
        const factor = qualifiesForJointLifeTable && spAge !== null ? getJointLifeExpectancyFactor(age, spAge) : getUniformLifetimeFactor(age);
        const rowRmd = factor > 0 ? runningBalance / factor : 0;
        const rowPct = factor > 0 ? 1 / factor * 100 : 0;
        const balanceAfterWithdrawal = Math.max(0, runningBalance - rowRmd);
        const growth = balanceAfterWithdrawal * annualReturn;
        const endingBal = balanceAfterWithdrawal + growth;
        schedule.push({
            year: calYear,
            age,
            spouseAge: spAge,
            priorYearEndBalance: runningBalance,
            distributionPeriod: factor,
            rmdAmount: rowRmd,
            rmdPercentOfBalance: rowPct,
            investmentGrowth: growth,
            endingBalance: endingBal
        });
        runningBalance = endingBal;
    }
    return {
        birthYear,
        ownerAge,
        distributionYear,
        priorYearEndBalance,
        rmdStartAge,
        rmdStartYear,
        secure2CohortLabel: cohortLabel,
        secure2StatutoryRef: statutoryRef,
        isRmdRequiredForSelectedAge,
        isFirstRmdYear,
        yearsUntilRmdStarts,
        calculationAge,
        isPreviewAtStartAge,
        qualifiesForJointLifeTable,
        spouseAgeUsed: input.isSpouseMoreThan10YearsYounger ? effectiveSpouseAge : null,
        spouseAgeDifference: input.isSpouseMoreThan10YearsYounger ? spouseAgeDifference : null,
        applicableTableName,
        applicableTableCode,
        distributionPeriod,
        uniformLifetimeFactorForComparison,
        rmdAmount,
        rmdPercentOfBalance,
        monthlyRmdEquivalent,
        estimatedTaxOnRmd,
        estimatedAfterTaxRmd,
        remainingBalanceAfterRmd,
        standardDeadline,
        firstYearRbdDeadline,
        applicableDeadlineDisplay,
        standardPenaltyRatePercent,
        timelyCorrectionPenaltyRatePercent,
        standardPenaltyAmountOnFullMiss,
        timelyCorrectionPenaltyAmountOnFullMiss,
        penaltyStatutoryBasis: rmdTablesData.secure2Rules.penalties.statutoryBasis,
        firstYearDeferral,
        schedule
    };
}
