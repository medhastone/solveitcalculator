export type Jurisdiction = 'USA' | 'CAN' | 'AUS' | 'GBR' | 'IND';

export interface AnnualScheduleRow {
  year: number;
  date: string;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  endingBalance: number;
  equityPct: number;
}

export interface MonthlyScheduleRow {
  period: number;
  date: string;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  endingBalance: number;
  equityPct: number;
}

export interface AmortizationOutput {
  annualData: AnnualScheduleRow[];
  monthlyData: MonthlyScheduleRow[];
  totalInterest: number;
  totalRepayment: number;
  interestSaved: number;
  yearsActive: string;
  yearsSaved: string;
  payoffYear: number;
  monthsPassed: number;
}

export function computeMonthlyRate(rate: number, jurisdiction: Jurisdiction): number {
  if (jurisdiction === 'CAN') {
    // Canadian law dictates semi-annual compounding for fixed rate mortgages
    return Math.pow(1 + (rate / 100) / 2, 2 / 12) - 1;
  }
  return (rate / 100) / 12;
}

export function computeBaseMonthlyPI(principal: number, monthlyRate: number, totalMonths: number): number {
  if (principal <= 0) return 0;
  if (monthlyRate <= 0) return principal / totalMonths;
  return (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
}

export function computeAmortization(
  principal: number,
  price: number,
  rate: number,
  termYears: number,
  frequency: string,
  extraMonthly: number,
  annualLumpSum: number,
  jurisdiction: Jurisdiction
): AmortizationOutput {
  const monthlyRate = computeMonthlyRate(rate, jurisdiction);
  const totalMonths = termYears * 12;
  const basePI = computeBaseMonthlyPI(principal, monthlyRate, totalMonths);

  let balance = principal;
  let totalInterest = 0;
  let monthsPassed = 0;
  const annualData: AnnualScheduleRow[] = [];
  const monthlyData: MonthlyScheduleRow[] = [];
  let curYearInterest = 0;
  let curYearPrincipal = 0;
  let curYearTotal = 0;

  let effectiveMonthlyPayment = basePI + extraMonthly;
  if (frequency === 'acc-biweekly' || frequency === 'acc-weekly') {
    effectiveMonthlyPayment = (basePI * 13) / 12 + extraMonthly;
  }

  while (balance > 0.01 && monthsPassed < 600) {
    monthsPassed++;
    const interestPmt = balance * monthlyRate;
    let principalPmt = effectiveMonthlyPayment - interestPmt;

    if (annualLumpSum > 0 && monthsPassed % 12 === 0) {
      principalPmt += annualLumpSum;
    }

    if (principalPmt > balance) {
      principalPmt = balance;
    }

    balance -= principalPmt;
    totalInterest += interestPmt;
    curYearInterest += interestPmt;
    curYearPrincipal += principalPmt;
    curYearTotal += (interestPmt + principalPmt);

    if (monthsPassed <= 60 || monthsPassed % 12 === 0 || balance <= 0.01) {
      const yearNum = Math.ceil(monthsPassed / 12);
      const equityPct = price > 0 ? Math.min(100, Math.round(((price - balance) / price) * 100)) : 0;
      monthlyData.push({
        period: monthsPassed,
        date: `M${monthsPassed} (Yr ${yearNum})`,
        principalPaid: principalPmt,
        interestPaid: interestPmt,
        totalPaid: principalPmt + interestPmt,
        endingBalance: Math.max(0, balance),
        equityPct,
      });
    }

    if (monthsPassed % 12 === 0 || balance <= 0.01) {
      const yearNum = Math.ceil(monthsPassed / 12);
      const equityPct = price > 0 ? Math.min(100, Math.round(((price - balance) / price) * 100)) : 0;
      annualData.push({
        year: yearNum,
        date: `Year ${yearNum} (${2025 + yearNum})`,
        principalPaid: curYearPrincipal,
        interestPaid: curYearInterest,
        totalPaid: curYearTotal,
        endingBalance: Math.max(0, balance),
        equityPct,
      });
      curYearInterest = 0;
      curYearPrincipal = 0;
      curYearTotal = 0;
    }
  }

  const baselineInterest = (basePI * totalMonths) - principal;
  const interestSaved = Math.max(0, baselineInterest - totalInterest);
  const yearsActive = (monthsPassed / 12).toFixed(1);
  const yearsSaved = Math.max(0, termYears - (monthsPassed / 12)).toFixed(1);
  const payoffYear = 2025 + Math.ceil(monthsPassed / 12);

  return {
    annualData,
    monthlyData,
    totalInterest,
    totalRepayment: principal + totalInterest,
    interestSaved,
    yearsActive,
    yearsSaved,
    payoffYear,
    monthsPassed,
  };
}
