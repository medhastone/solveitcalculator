export type CompoundingTiming = 'mid-year' | 'end-of-year';

export interface FourOhOneKInput {
  currentAge?: number;
  retirementAge?: number;
  currentBalance?: number;
  currentSalary?: number;
  annualSalary?: number;
  contributionPercent?: number;
  employeeContributionPercent?: number;
  employerMatchRate?: number;
  employerMatchPercent?: number;
  employerMatchCapPercent?: number;
  salaryGrowthPercent?: number;
  salaryIncreaseRate?: number;
  annualReturnPercent?: number;
  expectedReturnRate?: number;
  inflationRatePercent?: number;
  inflationRate?: number;
  compoundingTiming?: CompoundingTiming;
  applyCatchUpRules?: boolean;
  enableSecure2CatchUp?: boolean;
  swrPercent?: number;
}

export interface FourOhOneKYearRow {
  year: number;
  age: number;
  salary: number;
  irsDeferralCap: number;
  employeeContribution: number;
  employerMatch: number;
  maxPossibleMatch: number;
  missedMatch: number;
  totalContributions: number;
  totalContribution: number;
  investmentGrowth: number;
  annualInvestmentReturn: number;
  endBalance: number;
  endingBalanceNominal: number;
  inflationAdjustedBalance: number;
  endingBalanceInflationAdjusted: number;
}

export interface FourOhOneKResult {
  currentAge: number;
  retirementAge: number;
  yearsToRetire: number;
  initialBalance: number;
  finalSalary: number;
  firstYearEmployeeContribution: number;
  firstYearEmployerMatch: number;
  endingBalanceNominal: number;
  endingBalanceInflationAdjusted: number;
  totalEmployeeContributions: number;
  totalEmployerMatch: number;
  totalEmployerContributions: number;
  totalContributions: number;
  totalInvestmentGrowth: number;
  employeeContributionSharePercent: number;
  employerMatchSharePercent: number;
  growthSharePercent: number;
  annualRetirementIncomeNominal: number;
  monthlyRetirementIncomeNominal: number;
  annualRetirementIncomeReal: number;
  monthlyRetirementIncomeReal: number;
  isLeavingMoneyOnTable: boolean;
  missedMatchFirstYear: number;
  missedMatchWithGrowthAtRetirement: number;
  timeline: FourOhOneKYearRow[];
}

/**
 * 401(k) Retirement Calculator Engine
 * Implements IRS Section 401(k), Section 402(g) Elective Deferral Limits,
 * Age 50+ Catch-Up, SECURE 2.0 Super Catch-Up (Ages 60–63), Employer Match
 * Optimization, Money Left on the Table Analysis, and Inflation-Adjusted Projections.
 */ export const IRS_401K_LIMITS = {
    baseLimit2025: 23500,
    catchUpLimit2025: 7500,
    secure2CatchUpLimit2025: 11250,
    totalAdditionsLimit415c2025: 70000,
    compensationCap401a172025: 350000
};
export function getIrsElectiveDeferralLimit(age, applyCatchUpRules = true, enableSecure2CatchUp = true) {
    if (!applyCatchUpRules || age < 50) {
        return IRS_401K_LIMITS.baseLimit2025;
    }
    if (enableSecure2CatchUp && age >= 60 && age <= 63) {
        return IRS_401K_LIMITS.baseLimit2025 + IRS_401K_LIMITS.secure2CatchUpLimit2025;
    }
    return IRS_401K_LIMITS.baseLimit2025 + IRS_401K_LIMITS.catchUpLimit2025;
}
export function calculateFourOhOneK(input) {
    const currentAge = Math.max(18, Math.min(90, Math.round(input.currentAge || 30)));
    const retirementAge = Math.max(currentAge + 1, Math.min(100, Math.round(input.retirementAge || 65)));
    const yearsToRetire = retirementAge - currentAge;
    const initialBalance = Math.max(0, Number(input.currentBalance) || 0);
    let salary = Math.max(0, Number(input.currentSalary ?? input.annualSalary) || 85000);
    const empContribPct = Math.max(0, Math.min(100, Number(input.contributionPercent ?? input.employeeContributionPercent ?? 6))) / 100;
    const matchRate = Math.max(0, Math.min(200, Number(input.employerMatchRate ?? input.employerMatchPercent ?? 50))) / 100;
    const matchCapPct = Math.max(0, Math.min(100, Number(input.employerMatchCapPercent ?? 6))) / 100;
    const salaryGrowth = Math.max(0, Math.min(30, Number(input.salaryGrowthPercent ?? input.salaryIncreaseRate ?? 3))) / 100;
    const returnRate = Math.max(-20, Math.min(40, Number(input.annualReturnPercent ?? input.expectedReturnRate ?? 7.5))) / 100;
    const inflation = Math.max(0, Math.min(25, Number(input.inflationRatePercent ?? input.inflationRate ?? 2.5))) / 100;
    const compoundingTiming = input.compoundingTiming || 'mid-year';
    const applyCatchUpRules = input.applyCatchUpRules ?? true;
    const enableSecure2CatchUp = input.enableSecure2CatchUp ?? true;
    const swr = Math.max(0.5, Math.min(15, Number(input.swrPercent ?? 4.0))) / 100;
    const timeline = [];
    let totalEmployeeContrib = 0;
    let totalEmployerContrib = 0;
    let totalGrowth = 0;
    let runningBalance = initialBalance;
    let missedMatchCompoundBalance = 0;
    for(let year = 1; year <= yearsToRetire; year++){
        const ageAtEnd = currentAge + year;
        const cappedSalary = Math.min(salary, IRS_401K_LIMITS.compensationCap401a172025);
        const irsCap = getIrsElectiveDeferralLimit(ageAtEnd, applyCatchUpRules, enableSecure2CatchUp);
        const desiredEmployeeContrib = cappedSalary * empContribPct;
        const employeeContribution = Math.min(desiredEmployeeContrib, irsCap);
        // Effective contribution % of salary after IRS cap
        const effectiveEmpPct = cappedSalary > 0 ? employeeContribution / cappedSalary : 0;
        const matchedSalaryPct = Math.min(effectiveEmpPct, matchCapPct);
        const employerMatch = cappedSalary * matchedSalaryPct * matchRate;
        const maxPossibleMatch = cappedSalary * matchCapPct * matchRate;
        const missedMatch = Math.max(0, maxPossibleMatch - employerMatch);
        const totalAnnualAddition = employeeContribution + employerMatch;
        // Growth convention: mid-year assumes payroll contributions compound for half the year on average
        const contributionGrowthWeight = compoundingTiming === 'mid-year' ? 0.5 : 0;
        const growth = (runningBalance + totalAnnualAddition * contributionGrowthWeight) * returnRate;
        runningBalance = runningBalance + totalAnnualAddition + growth;
        // Track compound opportunity cost of missed employer match
        const missedMatchGrowth = (missedMatchCompoundBalance + missedMatch * contributionGrowthWeight) * returnRate;
        missedMatchCompoundBalance = missedMatchCompoundBalance + missedMatch + missedMatchGrowth;
        const inflationFactor = Math.pow(1 + inflation, year);
        const inflationAdjustedBalance = runningBalance / inflationFactor;
        totalEmployeeContrib += employeeContribution;
        totalEmployerContrib += employerMatch;
        totalGrowth += growth;
        const endBal = Math.round(runningBalance);
        const inflBal = Math.round(inflationAdjustedBalance);
        timeline.push({
            year,
            age: ageAtEnd,
            salary: Math.round(salary),
            irsDeferralCap: irsCap,
            employeeContribution: Math.round(employeeContribution),
            employerMatch: Math.round(employerMatch),
            maxPossibleMatch: Math.round(maxPossibleMatch),
            missedMatch: Math.round(missedMatch),
            totalContributions: Math.round(totalAnnualAddition),
            totalContribution: Math.round(totalAnnualAddition),
            investmentGrowth: Math.round(growth),
            annualInvestmentReturn: Math.round(growth),
            endBalance: endBal,
            endingBalanceNominal: endBal,
            inflationAdjustedBalance: inflBal,
            endingBalanceInflationAdjusted: inflBal
        });
        salary = salary * (1 + salaryGrowth);
    }
    const firstYearEmp = timeline[0]?.employeeContribution || 0;
    const firstYearMatch = timeline[0]?.employerMatch || 0;
    const missedMatchFirstYear = timeline[0]?.missedMatch || 0;
    const finalNominal = Math.round(runningBalance);
    const finalInflation = Math.round(runningBalance / Math.pow(1 + inflation, yearsToRetire));
    // Total employee deposits include initial balance + cumulative employee contributions for share breakdown
    const totalEmployeeWithInitial = initialBalance + totalEmployeeContrib;
    const denominator = Math.max(1, finalNominal);
    const employeeContributionSharePercent = Number(Math.min(100, Math.max(0, totalEmployeeWithInitial / denominator * 100)).toFixed(1));
    const employerMatchSharePercent = Number(Math.min(100, Math.max(0, totalEmployerContrib / denominator * 100)).toFixed(1));
    const growthSharePercent = Number(Math.max(0, 100 - employeeContributionSharePercent - employerMatchSharePercent).toFixed(1));
    const annualRetirementIncomeNominal = Math.round(finalNominal * swr);
    const monthlyRetirementIncomeNominal = Math.round(annualRetirementIncomeNominal / 12);
    const annualRetirementIncomeReal = Math.round(finalInflation * swr);
    const monthlyRetirementIncomeReal = Math.round(annualRetirementIncomeReal / 12);
    return {
        currentAge,
        retirementAge,
        yearsToRetire,
        initialBalance: Math.round(initialBalance),
        finalSalary: Math.round(salary),
        firstYearEmployeeContribution: firstYearEmp,
        firstYearEmployerMatch: firstYearMatch,
        endingBalanceNominal: finalNominal,
        endingBalanceInflationAdjusted: finalInflation,
        totalEmployeeContributions: Math.round(totalEmployeeWithInitial),
        totalEmployerMatch: Math.round(totalEmployerContrib),
        totalEmployerContributions: Math.round(totalEmployerContrib),
        totalContributions: Math.round(totalEmployeeWithInitial + totalEmployerContrib),
        totalInvestmentGrowth: Math.round(totalGrowth),
        employeeContributionSharePercent,
        employerMatchSharePercent,
        growthSharePercent,
        annualRetirementIncomeNominal,
        monthlyRetirementIncomeNominal,
        annualRetirementIncomeReal,
        monthlyRetirementIncomeReal,
        isLeavingMoneyOnTable: missedMatchFirstYear > 0.5,
        missedMatchFirstYear: Math.round(missedMatchFirstYear),
        missedMatchWithGrowthAtRetirement: Math.round(missedMatchCompoundBalance),
        timeline
    };
}
