'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { localizedSeoContent } from '@/lib/seoContent';

type JurisdictionKey = 'IN' | 'US' | 'CA' | 'AU' | 'UK';

const COUNTRY_CONFIGS: Record<JurisdictionKey, any> = {
  IN: {
    symbol: '₹',
    defaultAmount: 5000000,
    defaultRate: 8.50,
    defaultTenure: 20,
    ruleText: 'INDIA: MONTHLY REST (RBI EBLR / SEC 24b)',
    amountChips: [
      { label: '₹25 Lakhs', val: 2500000 },
      { label: '₹50 Lakhs', val: 5000000 },
      { label: '₹75 Lakhs', val: 7500000 },
      { label: '₹1 Crore', val: 10000000 },
      { label: '₹2 Crores', val: 20000000 }
    ],
    rateChips: [
      { label: '8.50% (Repo Benchmark)', val: 8.50 },
      { label: '8.75% (SBI/HDFC)', val: 8.75 },
      { label: '9.15% (NBFC Avg)', val: 9.15 }
    ],
    extraMonthlyDefault: 5000,
    lumpSumDefault: 100000,
    offsetDefault: 500000,
    flag: '🇮🇳',
    label: 'INDIA (REPO LINKED / SEC 24b)',
    badgeColor: 'bg-primary-container text-on-primary-container'
  },
  US: {
    symbol: '$',
    defaultAmount: 400000,
    defaultRate: 6.85,
    defaultTenure: 30,
    ruleText: 'USA: CFPB CONVENTIONAL / 30-YR FIXED',
    amountChips: [
      { label: '$250k', val: 250000 },
      { label: '$400k', val: 400000 },
      { label: '$600k', val: 600000 },
      { label: '$800k', val: 800000 },
      { label: '$1.2M', val: 1200000 }
    ],
    rateChips: [
      { label: '6.85% (30-Yr Fixed)', val: 6.85 },
      { label: '6.15% (15-Yr Fixed)', val: 6.15 },
      { label: '7.10% (FHA Benchmark)', val: 7.10 }
    ],
    extraMonthlyDefault: 150,
    lumpSumDefault: 3000,
    offsetDefault: 25000,
    flag: '🇺🇸',
    label: 'USA (CONVENTIONAL / 30-YR FIXED)',
    badgeColor: 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
  },
  CA: {
    symbol: '$',
    defaultAmount: 550000,
    defaultRate: 5.25,
    defaultTenure: 25,
    ruleText: 'CANADA: FCAC SEMI-ANNUAL MANDATE',
    amountChips: [
      { label: '$350k', val: 350000 },
      { label: '$550k', val: 550000 },
      { label: '$750k', val: 750000 },
      { label: '$1.0M', val: 1000000 },
      { label: '$1.4M', val: 1400000 }
    ],
    rateChips: [
      { label: '5.25% (5-Yr Fixed)', val: 5.25 },
      { label: '5.95% (Variable Prime)', val: 5.95 },
      { label: '4.85% (Insurable)', val: 4.85 }
    ],
    extraMonthlyDefault: 200,
    lumpSumDefault: 5000,
    offsetDefault: 30000,
    flag: '🇨🇦',
    label: 'CANADA (SEMI-ANNUAL COMP.)',
    badgeColor: 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
  },
  AU: {
    symbol: '$',
    defaultAmount: 600000,
    defaultRate: 6.15,
    defaultTenure: 30,
    ruleText: 'AUSTRALIA: ASIC OFFSET & REDRAW COMPLIANT',
    amountChips: [
      { label: '$400k', val: 400000 },
      { label: '$600k', val: 600000 },
      { label: '$800k', val: 800000 },
      { label: '$1.0M', val: 1000000 },
      { label: '$1.5M', val: 1500000 }
    ],
    rateChips: [
      { label: '6.15% (Variable Inv/OO)', val: 6.15 },
      { label: '5.89% (Big 4 Special)', val: 5.89 },
      { label: '6.45% (Interest Only)', val: 6.45 }
    ],
    extraMonthlyDefault: 200,
    lumpSumDefault: 5000,
    offsetDefault: 40000,
    flag: '🇦🇺',
    label: 'AUSTRALIA (OFFSET & REDRAW)',
    badgeColor: 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
  },
  UK: {
    symbol: '£',
    defaultAmount: 300000,
    defaultRate: 4.90,
    defaultTenure: 25,
    ruleText: 'UK: FCA STANDARD / 10% ERC FREE OVERPAY',
    amountChips: [
      { label: '£200k', val: 200000 },
      { label: '£300k', val: 300000 },
      { label: '£450k', val: 450000 },
      { label: '£600k', val: 600000 },
      { label: '£850k', val: 850000 }
    ],
    rateChips: [
      { label: '4.90% (2-Yr Fixed)', val: 4.90 },
      { label: '4.45% (5-Yr Fixed)', val: 4.45 },
      { label: '5.25% (BoE Tracker)', val: 5.25 }
    ],
    extraMonthlyDefault: 100,
    lumpSumDefault: 2500,
    offsetDefault: 20000,
    flag: '🇬🇧',
    label: 'UK (TRACKER / 10% OVERPAYMENT)',
    badgeColor: 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
  }
};

export default function EmiCalculatorClient({ defaultCountrySlug = 'in' }: { defaultCountrySlug?: string }) {
  const router = useRouter();
  const initialCountry = defaultCountrySlug.toUpperCase() as JurisdictionKey;
  
  const [activeCountry, setActiveCountry] = useState<JurisdictionKey>(initialCountry);
  const [scheduleViewMode, setScheduleViewMode] = useState<'annual' | 'monthly'>('annual');
  const [isStrategiesOpen, setIsStrategiesOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({});

  const config = COUNTRY_CONFIGS[activeCountry];
  const seoData = localizedSeoContent[activeCountry.toLowerCase() as keyof typeof localizedSeoContent];

  const [loanAmount, setLoanAmount] = useState<number>(config.defaultAmount);
  const [interestRate, setInterestRate] = useState<number>(config.defaultRate);
  const [tenureYears, setTenureYears] = useState<number>(config.defaultTenure);
  const [paymentFrequency, setPaymentFrequency] = useState<string>('12');

  const [enableExtraMonthly, setEnableExtraMonthly] = useState<boolean>(false);
  const [extraMonthlyVal, setExtraMonthlyVal] = useState<number>(config.extraMonthlyDefault);

  const [enableLumpSum, setEnableLumpSum] = useState<boolean>(false);
  const [lumpSumVal, setLumpSumVal] = useState<number>(config.lumpSumDefault);

  const [enableOffset, setEnableOffset] = useState<boolean>(false);
  const [offsetBalanceVal, setOffsetBalanceVal] = useState<number>(config.offsetDefault);

  const [results, setResults] = useState<any>(null);

  const handleCountryChange = (key: JurisdictionKey) => {
    router.push(`/finance/emi-calculator/${key.toLowerCase()}`);
    setActiveCountry(key);
    const newConfig = COUNTRY_CONFIGS[key];
    setLoanAmount(newConfig.defaultAmount);
    setInterestRate(newConfig.defaultRate);
    setTenureYears(newConfig.defaultTenure);
    setExtraMonthlyVal(newConfig.extraMonthlyDefault);
    setLumpSumVal(newConfig.lumpSumDefault);
    setOffsetBalanceVal(newConfig.offsetDefault);
  };

  const formatCurrency = (val: number, country = activeCountry) => {
    const sym = COUNTRY_CONFIGS[country].symbol;
    if (country === 'IN') {
      return sym + Number(Math.round(val)).toLocaleString('en-IN');
    }
    return sym + Number(Math.round(val)).toLocaleString('en-US');
  };

  const getPeriodicRate = (annualRatePct: number, frequency: number, country: JurisdictionKey) => {
    const r = annualRatePct / 100;
    if (country === 'CA') {
      return Math.pow(1 + r / 2, 2 / frequency) - 1;
    }
    return r / frequency;
  };

  useEffect(() => {
    const calculateLoan = () => {
      const P = loanAmount || 0;
      const annualRate = interestRate || 0;
      const tYears = tenureYears || 1;
      const freqVal = paymentFrequency;

      let frequency = 12;
      let isAcceleratedBiWeekly = false;

      if (freqVal === '26_ACC') {
        frequency = 26;
        isAcceleratedBiWeekly = true;
      } else {
        frequency = parseInt(freqVal);
      }

      const totalPeriods = tYears * frequency;
      const periodicRate = getPeriodicRate(annualRate, frequency, activeCountry);

      const monthlyPeriodicRate = getPeriodicRate(annualRate, 12, activeCountry);
      const standardMonthlyTotalPeriods = tYears * 12;
      
      let standardMonthlyEMI = 0;
      if (monthlyPeriodicRate > 0) {
        standardMonthlyEMI = (P * monthlyPeriodicRate * Math.pow(1 + monthlyPeriodicRate, standardMonthlyTotalPeriods)) / 
                               (Math.pow(1 + monthlyPeriodicRate, standardMonthlyTotalPeriods) - 1);
      } else {
        standardMonthlyEMI = P / standardMonthlyTotalPeriods;
      }

      let basePeriodicPayment = 0;
      if (isAcceleratedBiWeekly) {
        basePeriodicPayment = standardMonthlyEMI / 2;
      } else {
        if (periodicRate > 0) {
          basePeriodicPayment = (P * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) / 
                              (Math.pow(1 + periodicRate, totalPeriods) - 1);
        } else {
          basePeriodicPayment = P / totalPeriods;
        }
      }

      const extraVal = enableExtraMonthly ? extraMonthlyVal : 0;
      const lumpValValue = enableLumpSum ? lumpSumVal : 0;
      const offsetVal = enableOffset ? offsetBalanceVal : 0;

      let baselineBalance = P;
      let baselineTotalInterest = 0;
      for (let m = 1; m <= standardMonthlyTotalPeriods; m++) {
        const int = baselineBalance * monthlyPeriodicRate;
        const prin = standardMonthlyEMI - int;
        baselineTotalInterest += int;
        baselineBalance = Math.max(0, baselineBalance - prin);
      }

      let curBalance = P;
      let totalInterestPaid = 0;
      let totalPrincipalPaid = 0;
      let periodsElapsed = 0;
      let tippingPointPeriod: number | null = null;

      const scheduleData = [];
      const maxSafetyPeriods = totalPeriods * 2;

      while (curBalance > 0.01 && periodsElapsed < maxSafetyPeriods) {
        periodsElapsed++;
        const opening = curBalance;

        const effectiveBalance = Math.max(0, curBalance - offsetVal);
        const interestForPeriod = effectiveBalance * periodicRate;

        let regularInstallment = basePeriodicPayment;
        if (regularInstallment > opening + interestForPeriod) {
          regularInstallment = opening + interestForPeriod;
        }

        let principalComponent = regularInstallment - interestForPeriod;

        let extraThisPeriod = (frequency === 12) ? extraVal : (extraVal / (frequency / 12));

        let lumpThisPeriod = 0;
        if (enableLumpSum && periodsElapsed % frequency === 0) {
          lumpThisPeriod = lumpValValue;
        }

        let totalPrepayment = extraThisPeriod + lumpThisPeriod;
        if (principalComponent + totalPrepayment > opening) {
          totalPrepayment = Math.max(0, opening - principalComponent);
        }

        const totalPaidThisPeriod = regularInstallment + totalPrepayment;
        const totalPrincipalThisPeriod = principalComponent + totalPrepayment;
        const closing = Math.max(0, opening - totalPrincipalThisPeriod);

        if (tippingPointPeriod === null && totalPrincipalThisPeriod >= interestForPeriod) {
          tippingPointPeriod = periodsElapsed;
        }

        totalInterestPaid += interestForPeriod;
        totalPrincipalPaid += totalPrincipalThisPeriod;
        curBalance = closing;

        scheduleData.push({
          period: periodsElapsed,
          year: Math.ceil(periodsElapsed / frequency),
          opening,
          paid: totalPaidThisPeriod,
          principal: totalPrincipalThisPeriod,
          interest: interestForPeriod,
          closing,
          equityPct: ((P - closing) / P) * 100
        });
      }

      const displayInstallment = (frequency === 12) ? (basePeriodicPayment + extraVal) : basePeriodicPayment;
      const totalOutflow = P + totalInterestPaid;

      // Scenarios Logic
      const r = (annualRate / 100) / 12;
      const n = tYears * 12;
      
      let baseTotalInt = 0;
      let balB = P;
      for (let i = 0; i < n; i++) {
        const int = balB * r;
        baseTotalInt += int;
        balB -= (standardMonthlyEMI - int);
        if (balB <= 0) break;
      }

      const simExtra = (extraAmt: number) => {
        let bal = P;
        let intPaid = 0;
        let m = 0;
        while (bal > 0.01 && m < n * 2) {
          m++;
          const int = bal * r;
          intPaid += int;
          const prin = standardMonthlyEMI - int + extraAmt;
          bal = Math.max(0, bal - prin);
        }
        return { monthsCut: Math.max(0, n - m), intSaved: Math.max(0, baseTotalInt - intPaid) };
      };

      const extraA = activeCountry === 'IN' ? 2000 : 50;
      const resA = simExtra(extraA);

      const extraB = standardMonthlyEMI / 12;
      const resB = simExtra(extraB);

      let balC = P;
      let intPaidC = 0;
      let curEmiC = standardMonthlyEMI;
      let mC = 0;
      while (balC > 0.01 && mC < n * 2) {
        mC++;
        if (mC > 1 && mC % 12 === 1) {
          curEmiC *= 1.05;
        }
        const int = balC * r;
        intPaidC += int;
        const prin = curEmiC - int;
        balC = Math.max(0, balC - prin);
      }
      const resC = { monthsCut: Math.max(0, n - mC), intSaved: Math.max(0, baseTotalInt - intPaidC) };

      const lumpD = P * 0.10;
      let balD = P;
      let intPaidD = 0;
      let mD = 0;
      while (balD > 0.01 && mD < n * 2) {
        mD++;
        const int = balD * r;
        intPaidD += int;
        let prin = standardMonthlyEMI - int;
        if (mD === 36) prin += lumpD;
        balD = Math.max(0, balD - prin);
      }
      const resD = { monthsCut: Math.max(0, n - mD), intSaved: Math.max(0, baseTotalInt - intPaidD) };

      setResults({
        displayInstallment,
        P,
        totalInterestPaid,
        totalOutflow,
        periodsElapsed,
        frequency,
        tippingPointPeriod,
        baselineTotalInterest,
        scheduleData,
        scenarios: {
          A: { extraAmt: extraA, ...resA },
          B: { ...resB },
          C: { ...resC },
          D: { lumpAmt: lumpD, ...resD },
        }
      });
    };

    calculateLoan();
  }, [loanAmount, interestRate, tenureYears, paymentFrequency, enableExtraMonthly, extraMonthlyVal, enableLumpSum, lumpSumVal, enableOffset, offsetBalanceVal, activeCountry]);

  const copyScheduleSummary = () => {
    if (!results) return;
    const today = new Date();
    const acceleratedMonths = (results.periodsElapsed / results.frequency) * 12;
    const acceleratedEndDate = new Date(today.getFullYear(), today.getMonth() + Math.round(acceleratedMonths));
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const freedomDateStr = `${monthNames[acceleratedEndDate.getMonth()]} ${acceleratedEndDate.getFullYear()}`;

    const text = `SolveIt Calculator Workbench Summary:
- Jurisdiction: ${activeCountry}
- Periodic Installment: ${formatCurrency(results.displayInstallment)}
- Loan Principal: ${formatCurrency(results.P)}
- Total Interest: ${formatCurrency(results.totalInterestPaid)}
- Total Repayment: ${formatCurrency(results.totalOutflow)}
- Projected Freedom Date: ${freedomDateStr}
Calculated via SolveItCalculator.com (Client-Side Actuarial Engine)`;

    navigator.clipboard.writeText(text).then(() => {
      alert('Loan breakdown summary copied to clipboard!');
    });
  };

  const exportAmortizationCSV = () => {
    if (!results) return;
    let csv = `SolveIt Calculator - Universal Amortization Spec\n`;
    csv += `Jurisdiction,${activeCountry}\n`;
    csv += `Principal,${loanAmount}\nInterest Rate,${interestRate}%\nTenure Years,${tenureYears}\n\n`;
    csv += `Period,Opening Balance,Total Paid,Principal Paid,Interest Paid,Closing Balance\n`;

    let rowsToExport = [];
    if (scheduleViewMode === 'annual') {
      const yearsMap: any = {};
      results.scheduleData.forEach((item: any) => {
        if (!yearsMap[item.year]) {
          yearsMap[item.year] = {
            year: item.year,
            opening: item.opening,
            paid: 0,
            principal: 0,
            interest: 0,
            closing: item.closing
          };
        }
        yearsMap[item.year].paid += item.paid;
        yearsMap[item.year].principal += item.principal;
        yearsMap[item.year].interest += item.interest;
        yearsMap[item.year].closing = item.closing;
      });
      rowsToExport = Object.values(yearsMap);
    } else {
      rowsToExport = results.scheduleData.filter((item: any, idx: number) => {
        return idx < 24 || idx % results.frequency === 0 || idx === results.scheduleData.length - 1;
      });
    }

    rowsToExport.forEach((r: any) => {
      csv += `${r.year || r.period},${Math.round(r.opening)},${Math.round(r.paid)},${Math.round(r.principal)},${Math.round(r.interest)},${Math.round(r.closing)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SolveIt_Amortization_${activeCountry}_${Date.now()}.csv`;
    link.click();
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (!results) return null;

  // Chart data
  const standardTotalPeriods = tenureYears * results.frequency;
  const accelEndFraction = Math.min(1, results.periodsElapsed / standardTotalPeriods);
  const xStart = 10;
  const yStart = 10;
  const xEndBaseline = 350;
  const yEnd = 130;
  const xEndAccel = 10 + (340 * accelEndFraction);
  const baselinePath = `M ${xStart} ${yStart} Q 180 50 ${xEndBaseline} ${yEnd}`;
  const qx = 10 + ((xEndAccel - 10) * 0.55);
  const qy = 70;
  const accelPath = `M ${xStart} ${yStart} Q ${qx} ${qy} ${xEndAccel} ${yEnd}`;
  const gapPoints = `${xStart},${yStart} 180,50 ${xEndBaseline},${yEnd} ${xEndAccel},${yEnd} ${qx},${qy} ${xStart},${yStart}`;
  const tippingFraction = results.tippingPointPeriod ? (results.tippingPointPeriod / standardTotalPeriods) : 0.45;
  const tipX = Math.min(340, Math.max(20, 10 + (340 * tippingFraction)));
  const tipY = 10 + (120 * tippingFraction * 0.85);

  const today = new Date();
  const standardEndDate = new Date(today.getFullYear() + tenureYears, today.getMonth());
  const acceleratedMonths = (results.periodsElapsed / results.frequency) * 12;
  const acceleratedEndDate = new Date(today.getFullYear(), today.getMonth() + Math.round(acceleratedMonths));
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const interestSaved = Math.max(0, results.baselineTotalInterest - results.totalInterestPaid);
  const monthsSaved = Math.max(0, (tenureYears * 12) - Math.round(acceleratedMonths));
  const yearsSavedPart = Math.floor(monthsSaved / 12);
  const monthsSavedPart = monthsSaved % 12;

  let rowsToRender = [];
  if (scheduleViewMode === 'annual') {
    const yearsMap: any = {};
    results.scheduleData.forEach((item: any) => {
      if (!yearsMap[item.year]) {
        yearsMap[item.year] = {
          year: item.year,
          opening: item.opening,
          paid: 0,
          principal: 0,
          interest: 0,
          closing: item.closing,
          hasTipping: false
        };
      }
      yearsMap[item.year].paid += item.paid;
      yearsMap[item.year].principal += item.principal;
      yearsMap[item.year].interest += item.interest;
      yearsMap[item.year].closing = item.closing;
      if (item.period === results.tippingPointPeriod) {
        yearsMap[item.year].hasTipping = true;
      }
    });
    rowsToRender = Object.values(yearsMap);
  } else {
    rowsToRender = results.scheduleData.filter((item: any, idx: number) => {
      return idx < 24 || idx % results.frequency === 0 || idx === results.scheduleData.length - 1;
    });
  }

  return (
    <div className="flex flex-col w-full">
      <section className="w-full bg-surface-container-low py-space-xs px-gutter-mobile lg:px-gutter-desktop shadow-sm">
        <div className="max-w-max-width-canvas mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-space-xs text-on-surface-variant">
          <nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs text-body-sm font-body-sm overflow-x-auto whitespace-nowrap py-1">
            <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-[16px]">home</span>Home
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <Link className="hover:text-primary transition-colors" href="/finance">Financial Calculators</Link>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span className="hover:text-primary transition-colors">Loans &amp; Mortgages</span>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span className="text-on-surface font-semibold">Global EMI &amp; Mortgage Payoff Workbench</span>
          </nav>
        </div>
      </section>

      <section className="w-full bg-surface py-space-sm px-gutter-mobile lg:px-gutter-desktop shadow-sm">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="flex items-center justify-between overflow-x-auto pb-1 gap-space-xs">
            <div className="flex items-center gap-space-xs">
              {(Object.keys(COUNTRY_CONFIGS) as JurisdictionKey[]).map(key => (
                <button 
                  key={key}
                  onClick={() => handleCountryChange(key)}
                  className={`px-space-sm py-1.5 rounded-lg font-label-caps text-label-caps flex items-center gap-2 transition-all ${activeCountry === key ? 'bg-primary-container text-on-primary-container shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
                  type="button"
                >
                  <span className="text-base">{COUNTRY_CONFIGS[key].flag}</span>
                  <span>{COUNTRY_CONFIGS[key].label}</span>
                </button>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-1 text-data-mono font-data-mono text-outline text-xs">
              <span className="material-symbols-outlined text-[15px]">tune</span>
              <span>
                {activeCountry === 'CA' ? 'FCAC SEMI-ANNUAL COMPOUNDING' : (activeCountry === 'AU' ? 'DAILY ACCRUAL / OFFSET MODE' : 'STANDARD ANNUITY AMORTIZATION')}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-gradient-to-b from-surface via-surface-container-lowest to-surface py-space-xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-lg">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps mb-space-xs uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                Institutional Actuarial Grade
              </div>
              <h1 className="font-display-hero text-display-hero-mobile lg:text-display-hero text-on-surface tracking-tight mb-space-xs">
                {seoData?.meta?.h1 || "Universal Home Loan EMI & Mortgage Payoff Workbench"}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                {seoData?.meta?.metaDescription || "Compute amortization profiles, evaluate multi-scenario early payoff schedules, interest erosion, and regulatory quirks. Fully calibrated for India (RBI), USA (CFPB), Canada (FCAC semi-annual compounding), Australia (ASIC offset), and UK (FCA)."}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-space-xs text-body-sm font-body-sm text-on-surface-variant pt-space-xs">
            {['Exact Compounding Laws', 'Multi-Payment Acceleration', 'Dynamic Tipping Point', 'Offset & Redraw Simulator', '100% Client-Side Privacy'].map((text, i) => (
              <div key={i} className={`flex items-center gap-2 p-2 rounded-lg bg-surface-container-low/60 ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
                <span className={`material-symbols-outlined text-[18px] text-primary`}>{i === 4 ? 'lock' : 'check_circle'}</span>
                <span className="text-xs font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop bg-surface">
        <div className="max-w-max-width-canvas mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-space-lg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">tune</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Loan Architecture Inputs</h2>
                </div>
                <span className="text-label-caps font-label-caps text-on-surface-variant bg-surface-container px-2 py-1 rounded-md uppercase">
                  {config.ruleText}
                </span>
              </div>

              <div className="mb-space-lg">
                <div className="flex items-center justify-between mb-space-xs">
                  <label className="font-body-md text-body-md font-semibold text-on-surface" htmlFor="loan-amount-input">
                    Principal Loan Amount
                  </label>
                  <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1 shadow-inner focus-within:ring-2 focus-within:ring-primary">
                    <span className="font-data-mono text-data-mono text-outline mr-1">{config.symbol}</span>
                    <input className="w-36 bg-transparent font-data-mono text-data-mono text-on-surface text-right focus:outline-none" id="loan-amount-input" max={config.defaultAmount * 4} min={1000} step={1000} type="number" value={loanAmount || ''} onChange={(e) => setLoanAmount(Number(e.target.value))}/>
                  </div>
                </div>
                <input className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary-container mb-space-xs" id="loan-amount-slider" max={config.defaultAmount * 4} min={1000} step={1000} type="range" value={loanAmount || 0} onChange={(e) => setLoanAmount(Number(e.target.value))}/>
                <div className="flex flex-wrap gap-1.5">
                  {config.amountChips.map((chip: any, idx: number) => (
                    <button key={idx} onClick={() => setLoanAmount(chip.val)} className={`px-2.5 py-1 rounded-md text-xs font-data-mono ${loanAmount === chip.val ? 'bg-primary-container text-on-primary-container font-medium' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`} type="button">{chip.label}</button>
                  ))}
                </div>
              </div>

              <div className="mb-space-lg">
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="flex items-center gap-1.5">
                    <label className="font-body-md text-body-md font-semibold text-on-surface" htmlFor="interest-rate-input">
                      Interest Rate (% p.a.)
                    </label>
                    <span className="material-symbols-outlined text-outline text-[16px] cursor-pointer" title="Annual interest rate applicable across loan tenure.">info</span>
                  </div>
                  <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1 shadow-inner focus-within:ring-2 focus-within:ring-primary">
                    <input className="w-20 bg-transparent font-data-mono text-data-mono text-on-surface text-right focus:outline-none" id="interest-rate-input" max="25.0" min="1.0" step="0.05" type="number" value={interestRate || ''} onChange={(e) => setInterestRate(Number(e.target.value))}/>
                    <span className="font-data-mono text-data-mono text-outline ml-1">%</span>
                  </div>
                </div>
                <input className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary-container mb-space-xs" id="interest-rate-slider" max="15.0" min="3.0" step="0.05" type="range" value={interestRate || 0} onChange={(e) => setInterestRate(Number(e.target.value))}/>
                <div className="flex flex-wrap gap-1.5">
                  {config.rateChips.map((chip: any, idx: number) => (
                    <button key={idx} onClick={() => setInterestRate(chip.val)} className={`px-2.5 py-1 rounded-md text-xs font-data-mono ${interestRate === chip.val ? 'bg-primary-container text-on-primary-container font-medium' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`} type="button">{chip.label}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-lg">
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <label className="font-body-md text-body-md font-semibold text-on-surface" htmlFor="tenure-years-input">
                      Tenure (Years)
                    </label>
                    <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1 shadow-inner">
                      <input className="w-16 bg-transparent font-data-mono text-data-mono text-on-surface text-right focus:outline-none" id="tenure-years-input" max="40" min="1" type="number" value={tenureYears || ''} onChange={(e) => setTenureYears(Number(e.target.value))}/>
                      <span className="font-data-mono text-data-mono text-outline ml-1">Yrs</span>
                    </div>
                  </div>
                  <input className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary-container mb-space-xs" id="tenure-slider" max="40" min="5" step="1" type="range" value={tenureYears || 0} onChange={(e) => setTenureYears(Number(e.target.value))}/>
                  <div className="flex gap-1">
                    {[10, 15, 20, 25, 30].map(y => (
                      <button key={y} onClick={() => setTenureYears(y)} className={`flex-1 py-1 rounded text-xs font-data-mono ${tenureYears === y ? 'bg-primary-container text-on-primary-container font-medium' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`} type="button">{y}Y</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-body-md text-body-md font-semibold text-on-surface mb-space-xs" htmlFor="payment-frequency">
                    Payment Frequency
                  </label>
                  <select className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner mb-2" id="payment-frequency" value={paymentFrequency} onChange={(e) => setPaymentFrequency(e.target.value)}>
                    <option value="12">Monthly (12 payments/year)</option>
                    <option value="26">Bi-Weekly (26 payments/year)</option>
                    <option value="26_ACC">Accelerated Bi-Weekly (Half Monthly / 26)</option>
                    <option value="52">Weekly (52 payments/year)</option>
                  </select>
                  <p className="font-body-sm text-body-sm text-outline text-xs">
                    Accelerated bi-weekly makes the equivalent of 1 extra monthly payment per year.
                  </p>
                </div>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-md">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsStrategiesOpen(!isStrategiesOpen)}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">rocket_launch</span>
                    <span className="font-body-md text-body-md font-semibold text-on-surface">Accelerated Payoff &amp; Offset Modifiers</span>
                  </div>
                  <span className={`material-symbols-outlined text-outline transition-transform duration-200 ${isStrategiesOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </div>
                {isStrategiesOpen && (
                  <div className="space-y-space-md pt-2" id="advanced-strategies">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-space-xs bg-surface-container-lowest rounded-lg">
                      <div className="flex items-center gap-2">
                        <input className="w-4 h-4 text-primary rounded accent-primary-container" id="enable-extra-monthly" type="checkbox" checked={enableExtraMonthly} onChange={(e) => setEnableExtraMonthly(e.target.checked)}/>
                        <div>
                          <label className="text-sm font-semibold text-on-surface block cursor-pointer" htmlFor="enable-extra-monthly">Extra Recurring Principal</label>
                          <span className="text-xs text-outline">Paid every single billing cycle</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-data-mono text-xs text-outline">{config.symbol}</span>
                        <input className="w-24 bg-surface-container-low rounded px-2 py-1 text-right text-xs font-data-mono text-on-surface focus:outline-none" id="extra-monthly-val" type="number" value={extraMonthlyVal || ''} onChange={(e) => setExtraMonthlyVal(Number(e.target.value))}/>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-space-xs bg-surface-container-lowest rounded-lg">
                      <div className="flex items-center gap-2">
                        <input className="w-4 h-4 text-primary rounded accent-primary-container" id="enable-lump-sum" type="checkbox" checked={enableLumpSum} onChange={(e) => setEnableLumpSum(e.target.checked)}/>
                        <div>
                          <label className="text-sm font-semibold text-on-surface block cursor-pointer" htmlFor="enable-lump-sum">Annual Lump-Sum Prepayment</label>
                          <span className="text-xs text-outline">Applied in month 12 of every year (bonus/tax refund)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-data-mono text-xs text-outline">{config.symbol}</span>
                        <input className="w-28 bg-surface-container-low rounded px-2 py-1 text-right text-xs font-data-mono text-on-surface focus:outline-none" id="lump-sum-val" type="number" value={lumpSumVal || ''} onChange={(e) => setLumpSumVal(Number(e.target.value))}/>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-space-xs bg-surface-container-lowest rounded-lg">
                      <div className="flex items-center gap-2">
                        <input className="w-4 h-4 text-primary rounded accent-primary-container" id="enable-offset" type="checkbox" checked={enableOffset} onChange={(e) => setEnableOffset(e.target.checked)}/>
                        <div>
                          <label className="text-sm font-semibold text-on-surface block cursor-pointer" htmlFor="enable-offset">Offset / Redraw Savings Balance</label>
                          <span className="text-xs text-outline">Liquid cash reducing daily interest computation</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-data-mono text-xs text-outline">{config.symbol}</span>
                        <input className="w-28 bg-surface-container-low rounded px-2 py-1 text-right text-xs font-data-mono text-on-surface focus:outline-none" id="offset-balance-val" type="number" value={offsetBalanceVal || ''} onChange={(e) => setOffsetBalanceVal(Number(e.target.value))}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-space-md rounded-2xl bg-surface-container-high/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[28px]">speed</span>
                <div>
                  <div className="font-label-caps text-label-caps uppercase text-outline">Actuarial Proof Engine</div>
                  <div className="font-body-sm text-body-sm text-on-surface">Calculated via continuous standard annuity compounding with microsecond roundoff resolution.</div>
                </div>
              </div>
              <button className="text-xs font-semibold text-primary hover:underline shrink-0" onClick={() => { setLoanAmount(config.defaultAmount); setInterestRate(config.defaultRate); setTenureYears(config.defaultTenure); setPaymentFrequency('12'); setEnableExtraMonthly(false); setEnableLumpSum(false); setEnableOffset(false); }} type="button">Reset Inputs</button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-20">
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-primary-container/20 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline">Computed Monthly Commitment</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-on-secondary-container font-label-caps text-label-caps font-semibold">Live Real-Time</span>
              </div>
              <div className="flex items-baseline gap-2 mb-space-sm">
                <div className="font-numerical-display text-numerical-display-mobile lg:text-numerical-display text-primary tracking-tight">
                  {formatCurrency(results.displayInstallment)}
                </div>
                <span className="font-body-sm text-body-sm text-outline">
                  {results.frequency === 12 ? '/ month' : (results.frequency === 26 ? '/ bi-weekly' : '/ week')}
                </span>
              </div>

              {(interestSaved > 50 || monthsSaved > 0) ? (
                <div className="p-space-sm rounded-xl bg-surface-container-high text-on-surface mb-space-md flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[24px]">savings</span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-primary">Acceleration Active: {formatCurrency(interestSaved)} Saved</div>
                    <div className="text-xs text-on-surface-variant">Loan matures {yearsSavedPart} Yrs {monthsSavedPart} Mos earlier!</div>
                  </div>
                </div>
              ) : (
                <div className="p-space-sm rounded-xl bg-surface-container-high text-on-surface mb-space-md flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[24px]">savings</span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-primary">Standard Baseline Schedule</div>
                    <div className="text-xs text-on-surface-variant">Add prepayments or switch to accelerated bi-weekly to save.</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-space-sm mb-space-lg">
                <div className="p-space-sm rounded-xl bg-surface-container-low">
                  <div className="text-xs text-outline font-label-caps uppercase">Principal Amount</div>
                  <div className="font-data-mono text-data-mono font-bold text-on-surface mt-1">{formatCurrency(results.P)}</div>
                  <div className="text-[11px] text-outline mt-0.5">{results.totalOutflow > 0 ? ((results.P / results.totalOutflow) * 100).toFixed(1) : 50}% of total</div>
                </div>
                <div className="p-space-sm rounded-xl bg-surface-container-low">
                  <div className="text-xs text-outline font-label-caps uppercase">Total Interest</div>
                  <div className="font-data-mono text-data-mono font-bold text-tertiary mt-1">{formatCurrency(results.totalInterestPaid)}</div>
                  <div className="text-[11px] text-outline mt-0.5">{results.totalOutflow > 0 ? ((results.totalInterestPaid / results.totalOutflow) * 100).toFixed(1) : 50}% of total</div>
                </div>
                <div className="p-space-sm rounded-xl bg-surface-container-low">
                  <div className="text-xs text-outline font-label-caps uppercase">Overall Outflow</div>
                  <div className="font-data-mono text-data-mono font-bold text-on-surface mt-1">{formatCurrency(results.totalOutflow)}</div>
                  <div className="text-[11px] text-outline mt-0.5">Principal + Interest</div>
                </div>
                <div className="p-space-sm rounded-xl bg-surface-container-low">
                  <div className="text-xs text-outline font-label-caps uppercase">Freedom Date</div>
                  <div className="font-data-mono text-data-mono font-bold text-primary mt-1">{monthNames[acceleratedEndDate.getMonth()]} {acceleratedEndDate.getFullYear()}</div>
                  <div className="text-[11px] text-outline mt-0.5">Standard: {monthNames[standardEndDate.getMonth()]} {standardEndDate.getFullYear()}</div>
                </div>
              </div>

              <div className="mb-space-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-caps text-label-caps uppercase text-outline">Amortization Decay &amp; Freedom Gap</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 text-outline"><span className="w-2.5 h-0.5 bg-outline"></span> Standard</span>
                    <span className="inline-flex items-center gap-1 text-primary"><span className="w-2.5 h-0.5 bg-primary"></span> Accelerated</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-low rounded-xl p-3">
                  <svg aria-label="Amortization decay curve chart" className="w-full h-32 overflow-visible" viewBox="0 0 360 140">
                    <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="3,3" x1="10" x2="350" y1="10" y2="10"></line>
                    <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="3,3" x1="10" x2="350" y1="70" y2="70"></line>
                    <line className="text-outline-variant/30" stroke="currentColor" x1="10" x2="350" y1="130" y2="130"></line>
                    <polygon className="fill-primary-container/20" points={gapPoints}></polygon>
                    <path className="text-outline" d={baselinePath} fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                    <path className="text-primary" d={accelPath} fill="none" stroke="currentColor" strokeWidth="3"></path>
                    <circle className="fill-secondary-container" cx={tipX} cy={tipY} r="4.5"></circle>
                    <text className="text-[9px] fill-on-surface font-data-mono" x={Math.min(270, tipX + 8)} y={Math.max(20, tipY - 4)}>Tipping Point (Yr {Math.ceil((results.tippingPointPeriod || 1) / results.frequency) || 8})</text>
                    <text className="text-[9px] fill-outline font-data-mono" x="12" y="138">Yr 0</text>
                    <text className="text-[9px] fill-outline font-data-mono" x="170" y="138">Yr {Math.round(tenureYears/2)}</text>
                    <text className="text-[9px] fill-outline font-data-mono" x="325" y="138">Yr {tenureYears}</text>
                  </svg>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-space-xs">
                <button className="flex-1 py-2.5 px-3 rounded-lg bg-primary text-on-primary font-semibold text-sm flex items-center justify-center gap-1.5 shadow hover:bg-primary-container transition-all" onClick={copyScheduleSummary} type="button">
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  <span>Copy Breakdown</span>
                </button>
                <button className="py-2.5 px-3 rounded-lg bg-surface-container text-on-surface font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-all" onClick={exportAmortizationCSV} type="button">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps mb-space-xs uppercase">
              Tactical Acceleration Models
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface">
              Early Payoff Strategies: Eradicate Decades of Compound Interest
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Because mortgage amortization is severely front-loaded with interest, minor micro-payments made in the initial ten-year cycle shave thousands in total lifetime finance costs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-3">
                  <span className="material-symbols-outlined">add_circle</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Strategy A</span>
                <h3 className="font-headline-md text-headline-md text-on-surface text-lg mb-2">The Coffee Micro-Addition</h3>
                <p className="text-xs text-on-surface-variant mb-4">Add just <span className="font-semibold text-on-surface">+{formatCurrency(results.scenarios.A.extraAmt)}</span> into your normal monthly installment starting month 1.</p>
              </div>
              <div className="pt-3 bg-surface-container-low rounded-xl p-3">
                <div className="flex justify-between items-baseline text-xs mb-1">
                  <span className="text-outline">Tenure Cut:</span>
                  <span className="font-data-mono font-bold text-primary">{Math.floor(results.scenarios.A.monthsCut / 12)} Yrs {results.scenarios.A.monthsCut % 12} Mos</span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-outline">Interest Saved:</span>
                  <span className="font-data-mono font-bold text-secondary">{formatCurrency(results.scenarios.A.intSaved)}</span>
                </div>
              </div>
            </div>
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary mb-3">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Strategy B</span>
                <h3 className="font-headline-md text-headline-md text-on-surface text-lg mb-2">The 13th Month Salary Hack</h3>
                <p className="text-xs text-on-surface-variant mb-4">Pay exactly 1 extra full monthly EMI per calendar year using year-end bonuses or tax refunds.</p>
              </div>
              <div className="pt-3 bg-surface-container-low rounded-xl p-3">
                <div className="flex justify-between items-baseline text-xs mb-1">
                  <span className="text-outline">Tenure Cut:</span>
                  <span className="font-data-mono font-bold text-primary">{Math.floor(results.scenarios.B.monthsCut / 12)} Yrs {results.scenarios.B.monthsCut % 12} Mos</span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-outline">Interest Saved:</span>
                  <span className="font-data-mono font-bold text-secondary">{formatCurrency(results.scenarios.B.intSaved)}</span>
                </div>
              </div>
            </div>
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary mb-3">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Strategy C</span>
                <h3 className="font-headline-md text-headline-md text-on-surface text-lg mb-2">5% Annual Appraisal Step-Up</h3>
                <p className="text-xs text-on-surface-variant mb-4">Increase your EMI by a modest 5% every 12 months as your salary or business earnings expand.</p>
              </div>
              <div className="pt-3 bg-surface-container-low rounded-xl p-3">
                <div className="flex justify-between items-baseline text-xs mb-1">
                  <span className="text-outline">Tenure Cut:</span>
                  <span className="font-data-mono font-bold text-primary">{Math.floor(results.scenarios.C.monthsCut / 12)} Yrs {results.scenarios.C.monthsCut % 12} Mos</span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-outline">Interest Saved:</span>
                  <span className="font-data-mono font-bold text-secondary">{formatCurrency(results.scenarios.C.intSaved)}</span>
                </div>
              </div>
            </div>
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-3">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Strategy D</span>
                <h3 className="font-headline-md text-headline-md text-on-surface text-lg mb-2">Early Year 3 Lump Sum</h3>
                <p className="text-xs text-on-surface-variant mb-4">Inject a single capital windfall of <span className="font-semibold text-on-surface">10% Principal</span> in month 36 directly to principal.</p>
              </div>
              <div className="pt-3 bg-surface-container-low rounded-xl p-3">
                <div className="flex justify-between items-baseline text-xs mb-1">
                  <span className="text-outline">Tenure Cut:</span>
                  <span className="font-data-mono font-bold text-primary">{Math.floor(results.scenarios.D.monthsCut / 12)} Yrs {results.scenarios.D.monthsCut % 12} Mos</span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-outline">Interest Saved:</span>
                  <span className="font-data-mono font-bold text-secondary">{formatCurrency(results.scenarios.D.intSaved)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop bg-surface">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-md">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-outline">Actuarial Ledger Breakdown</span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface">
                Complete Milestone Amortization Schedule
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Inspect the progressive shift between interest burden and principal equity accumulation. The green marker identifies the &quot;Tipping Point&quot;.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex p-1 rounded-lg bg-surface-container-low text-xs font-semibold">
                <button className={`px-3 py-1.5 rounded-md shadow-sm ${scheduleViewMode === 'annual' ? 'bg-surface-container-lowest text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`} onClick={() => setScheduleViewMode('annual')} type="button">Annual Roll-Up</button>
                <button className={`px-3 py-1.5 rounded-md shadow-sm ${scheduleViewMode === 'monthly' ? 'bg-surface-container-lowest text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`} onClick={() => setScheduleViewMode('monthly')} type="button">Monthly Granular</button>
              </div>
              <button className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface" onClick={exportAmortizationCSV} title="Export schedule as CSV" type="button">
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl shadow-md bg-surface-container-lowest">
            <table className="w-full text-left text-body-sm font-body-sm min-w-[760px]">
              <thead className="bg-surface-container-low text-on-surface font-label-caps text-label-caps uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Period / Year</th>
                  <th className="py-3 px-4">Opening Balance</th>
                  <th className="py-3 px-4">Total Paid</th>
                  <th className="py-3 px-4 text-primary">Principal Paid</th>
                  <th className="py-3 px-4 text-tertiary">Interest Paid</th>
                  <th className="py-3 px-4">Closing Balance</th>
                  <th className="py-3 px-4 text-right">Equity Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-data-mono text-xs">
                {rowsToRender.map((row: any, idx: number) => {
                  const isTipping = (scheduleViewMode === 'annual' && row.hasTipping) || 
                                    (scheduleViewMode === 'monthly' && row.period === results.tippingPointPeriod);
                  const periodLabel = scheduleViewMode === 'annual' 
                    ? `Year ${row.year}` 
                    : `Mth ${row.period} (Yr ${row.year})`;
                  const equityPct = (((results.P - row.closing) / results.P) * 100).toFixed(1);
                  return (
                    <tr key={idx} className={isTipping ? 'bg-secondary-container/10 font-semibold' : 'hover:bg-surface-container-low transition-colors'}>
                      <td className="py-2.5 px-4 font-body-sm text-on-surface flex items-center gap-1.5">
                        {isTipping && <span className="material-symbols-outlined text-secondary text-[16px]" title="Tipping point reached">star</span>}
                        {periodLabel}
                      </td>
                      <td className="py-2.5 px-4">{formatCurrency(row.opening)}</td>
                      <td className="py-2.5 px-4">{formatCurrency(row.paid)}</td>
                      <td className="py-2.5 px-4 text-primary font-medium">{formatCurrency(row.principal)}</td>
                      <td className="py-2.5 px-4 text-tertiary">{formatCurrency(row.interest)}</td>
                      <td className="py-2.5 px-4 font-semibold text-on-surface">{formatCurrency(row.closing)}</td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <span className="text-xs">{equityPct}%</span>
                          <div className="w-12 h-1.5 bg-surface-container rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full bg-primary" style={{ width: `${equityPct}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-xs text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary-container inline-block"></span>
              <span><strong>Tipping Point Highlight:</strong> The period where your monthly installment pays more principal than interest.</span>
            </div>
            <div className="font-data-mono text-outline">
              Showing calculated schedule for <span>{tenureYears} Years ({results.scheduleData.length} Actual Periods)</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-lowest">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-xl max-w-3xl">
            <span className="font-label-caps text-label-caps uppercase text-outline">Actuarial Foundations</span>
            <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface">
              Global Lending Formulae &amp; Jurisdiction Mechanics
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Consumer credit mathematics vary substantially across borders. SolveIt implements the statutory accounting frameworks mandated by national central banks and regulatory authorities.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
            <div className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🇨🇦 🇺🇸</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface text-lg">Canadian vs. US Amortization</h3>
                </div>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  In the US, interest compounds <strong>monthly</strong> (12 times/year). In Canada, the <em>Interest Act</em> mandates that fixed-rate mortgages compound <strong>semi-annually</strong>, not in advance.
                </p>
                <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-xs text-primary mb-3">
                  r = (1 + R/2)^(2/12) - 1
                </div>
                <p className="text-[11px] text-outline leading-relaxed">
                  This effective monthly rate is slightly lower than nominal (R/12), yielding slight monthly payment savings compared to identical US loan balances.
                </p>
              </div>
              <div className="mt-4 pt-3 text-xs font-semibold text-primary flex items-center gap-1">
                <span>Regulated by FCAC &amp; CFPB</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
            <div className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🇦🇺</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface text-lg">Australian 100% Offset Accounts</h3>
                </div>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  An Australian mortgage offset is a transaction account linked directly to your home loan. Interest is calculated on a <strong>daily rest</strong> using the net balance.
                </p>
                <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-xs text-primary mb-3">
                  Daily Int = (Principal - Offset Balance) × (R / 365)
                </div>
                <p className="text-[11px] text-outline leading-relaxed">
                  Unlike taxable interest earned in savings accounts, interest saved via an offset account is 100% tax-free under Australian ATO provisions.
                </p>
              </div>
              <div className="mt-4 pt-3 text-xs font-semibold text-secondary flex items-center gap-1">
                <span>ASIC MoneySmart Calibration</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
            <div className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🇮🇳 🇬🇧</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface text-lg">India EBLR &amp; UK 10% ERC Cap</h3>
                </div>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  In India, RBI directives prohibit floating-rate home loan prepayment penalties. Rates link dynamically to the RBI Repo Rate (EBLR) with quarterly resets.
                </p>
                <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-xs text-primary mb-3">
                  E = [P × r × (1+r)^n] / [(1+r)^n - 1]
                </div>
                <p className="text-[11px] text-outline leading-relaxed">
                  In the UK, fixed-rate mortgages permit up to 10% penalty-free overpayment annually before Early Repayment Charges (ERCs) trigger.
                </p>
              </div>
              <div className="mt-4 pt-3 text-xs font-semibold text-tertiary flex items-center gap-1">
                <span>RBI Master Directions &amp; FCA Compliance</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop bg-surface">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-lg max-w-2xl">
            <span className="font-label-caps text-label-caps uppercase text-outline">Temporal Arbitrage</span>
            <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface">
              Payment Frequency Comparison Matrix
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Why accelerated bi-weekly schedules cut 4 to 5 years off a 30-year home loan without altering your lifestyle or budget.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl shadow-md bg-surface-container-lowest">
            <table className="w-full text-left text-body-sm font-body-sm min-w-[700px]">
              <thead className="bg-surface-container-low text-on-surface font-label-caps text-label-caps uppercase">
                <tr>
                  <th className="py-3.5 px-4">Frequency</th>
                  <th className="py-3.5 px-4">Installments / Year</th>
                  <th className="py-3.5 px-4">Effective Annual Contribution</th>
                  <th className="py-3.5 px-4">Compounding Relief</th>
                  <th className="py-3.5 px-4 text-right">Amortization Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-xs">
                <tr>
                  <td className="py-3 px-4 font-semibold text-on-surface">Monthly (Standard)</td>
                  <td className="py-3 px-4 font-data-mono">12</td>
                  <td className="py-3 px-4 font-data-mono">12.00 × EMI</td>
                  <td className="py-3 px-4 text-outline">Baseline standard amortization</td>
                  <td className="py-3 px-4 text-right font-data-mono text-outline">1.0x (Baseline)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-on-surface">Bi-Weekly (Ordinary)</td>
                  <td className="py-3 px-4 font-data-mono">26</td>
                  <td className="py-3 px-4 font-data-mono">12.00 × EMI ((Monthly × 12) / 26)</td>
                  <td className="py-3 px-4 text-on-surface-variant">Marginal daily interest reduction</td>
                  <td className="py-3 px-4 text-right font-data-mono text-primary">1.02x faster</td>
                </tr>
                <tr className="bg-surface-container-high/40">
                  <td className="py-3 px-4 font-semibold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    Accelerated Bi-Weekly
                  </td>
                  <td className="py-3 px-4 font-data-mono font-bold text-on-surface">26</td>
                  <td className="py-3 px-4 font-data-mono font-bold text-primary">13.00 × EMI (Monthly ÷ 2)</td>
                  <td className="py-3 px-4 text-on-surface">1 whole extra EMI paid directly into principal each year</td>
                  <td className="py-3 px-4 text-right font-data-mono font-bold text-secondary">1.28x faster (Saves ~4.5 Yrs)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-on-surface">Accelerated Weekly</td>
                  <td className="py-3 px-4 font-data-mono">52</td>
                  <td className="py-3 px-4 font-data-mono">13.00 × EMI (Monthly ÷ 4)</td>
                  <td className="py-3 px-4 text-on-surface-variant">Continuous rapid principal decay</td>
                  <td className="py-3 px-4 text-right font-data-mono text-secondary">1.30x faster</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {seoData && (
        <section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="mb-space-xl max-w-3xl">
              <span className="font-label-caps text-label-caps uppercase text-outline">Borrower Advisory</span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface">
                {seoData.meta.h2s[0]}
              </h2>
              <div className="mt-6 space-y-6">
                {typeof seoData.editorial === 'string' ? (
                  <div className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">
                    {seoData.editorial}
                  </div>
                ) : (
                  seoData.editorial.map((section: any, index: number) => (
                    <div key={index} className="flex flex-col gap-2">
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">{section.subtitle}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{section.paragraph}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {seoData && (
        <section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="mb-space-xl max-w-3xl">
              <span className="font-label-caps text-label-caps uppercase text-outline">Actuarial Knowledge Base</span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-space-xs max-w-4xl" id="faq-container">
              {seoData.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl bg-surface-container-lowest overflow-hidden shadow-sm">
                  <button className="w-full p-space-md text-left flex items-center justify-between gap-4 font-semibold text-sm text-on-surface" onClick={() => toggleFaq(idx)} type="button">
                    <span>{faq.question}</span>
                    <span className={`material-symbols-outlined text-outline transition-transform duration-200 ${openFaqs[idx] ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  {openFaqs[idx] && (
                    <div className="faq-content p-space-md pt-0 text-xs text-on-surface-variant leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {seoData?.citation && (
        <section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop bg-surface border-t border-outline/10">
          <div className="max-w-max-width-canvas mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">policy</span>
              <h3 className="font-headline-md text-headline-md text-on-surface text-base">Statutory Authority &amp; Entity Citations</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-xs text-on-surface-variant">
              <div className="p-2.5 rounded-lg bg-surface-container-low">
                <a href={seoData.citation.url} target="_blank" rel="noopener noreferrer" className="font-bold text-primary block hover:underline">{seoData.citation.name}</a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
