'use client';
import React, { useState, useEffect } from 'react';

const faqData = [
      { q: "What is a daily wage?", a: "A daily wage is the fixed compensation earned by an employee or contractor for rendering exactly one statutory working day of labor, calculated from monthly salary or hourly wages." },
      { q: "What is the standard formula to compute daily wage from monthly salary?", a: "Daily Wage = Gross Monthly Salary ÷ Statutory Working Days (standardly 26 days for 6-day weeks, 21.67 or 22 for 5-day weeks)." },
      { q: "Why is 26 used as the standard divisor in India?", a: "Indian Supreme Court rulings and the Payment of Gratuity Act recognize 30 calendar days minus 4 statutory Sundays = 26 effective working days per month." },
      { q: "What is the standard divisor in the United States under FLSA?", a: "The US 5-day 40-hour workweek standardizes 260 annual working days divided by 12 months, yielding an average divisor of 21.67 days." },
      { q: "How does the UK HMRC calculate day rates for deductions?", a: "UK payroll generally applies 1/260th of annual gross salary for standard 5-day workers or 1/365th under the traditional Apportionment Act 1870." },
      { q: "How is daily wage computed under UAE MoHRE labor laws?", a: "UAE Federal Decree-Law No. 33 of 2021 prescribes dividing monthly salary by 30 days for statutory benefits and unpaid leave pro-rations." },
      { q: "How do I convert daily wage into an hourly rate?", a: "Hourly Rate = Daily Wage ÷ Standard Working Hours in the Shift (typically 8, 7.5, or 7.6 hours)." },
      { q: "How is overtime pay calculated from a daily wage?", a: "Determine regular hourly rate (Daily Wage ÷ Shift Hours), then multiply by legal multiplier (1.5x in US, 2.0x in India) multiplied by extra hours worked." },
      { q: "What is Loss of Pay (LOP) and how is it deducted?", a: "LOP occurs when an employee takes unpaid leave. Deduction = Daily Rate × Unapproved Absent Days, deducted from Gross Monthly Remuneration." },
      { q: "Are paid leaves included when calculating daily wage?", a: "Yes, standard contractual monthly salaries incorporate statutory annual leaves, sick leaves, and public holidays." },
      { q: "How should a freelancer compute a sustainable day rate?", a: "Freelance Day Rate = (Annual Personal Target + Business Overhead + Taxes & Healthcare) ÷ Billable Days (typically 180 to 220 billable days)." },
      { q: "What is the difference between daily wage and per diem?", a: "Daily wage is taxable compensation for work rendered, while per diem is a non-taxable daily allowance meant to reimburse lodging and meal expenses." },
      { q: "Does daily wage include statutory retirement benefits (PF/401k)?", a: "Gross daily wage reflects pre-deduction earnings; Net daily wage reflects take-home cash after PF, 401(k), and taxes are withheld." },
      { q: "How are half-days paid in attendance-based payroll?", a: "Half-days are compensated at exactly 50% (0.5x) of the statutory daily wage, assuming standard minimum half-day shift hours." },
      { q: "What is a 20-day vs. 22-day working month?", a: "A 20-day month accounts for 4 working weeks minus statutory holidays, while 22 days represents a full 30-day month with 8 weekend days." },
      { q: "How does Australia's Fair Work Ombudsman calculate daily pay?", a: "Full-time employees operate on a 38-hour standard week (7.6h/day). Daily wage is weekly rate ÷ 5, or hourly rate × 7.6." },
      { q: "Can an employer change the working days divisor mid-year?", a: "No, employers must maintain uniform documented payroll policies in compliance with employment contracts and regional labor laws." },
      { q: "How is daily wage used in severance and gratuity calculations?", a: "In India, gratuity uses the statutory 15/26 formula: (15 × Last Basic Pay × Years of Service) ÷ 26." },
      { q: "What is the impact of public holidays on daily wage?", a: "Salaried full-time workers receive normal pay across public holidays without deduction. Casual piece-rate laborers are paid if they work." },
      { q: "How is contractor crew labor budget computed?", a: "Total Crew Labor Cost = Total Headcount × Daily Wage per Worker × Total Project Duration Days." },
      { q: "Is lunch break included in daily wage hours?", a: "Meal breaks (typically 30 to 60 minutes) are legally unpaid in most jurisdictions unless the worker is required to remain on-call." },
      { q: "How do leap years affect daily wage calculations?", a: "Annual divisor systems (1/365th) adjust to 1/366th in leap years, resulting in a microscopic fractional variance." },
      { q: "What is the minimum wage requirement for daily labor in the US?", a: "The federal floor is $7.25/hour ($58 for an 8-hour day), although states like California require $16.00/hour ($128 per 8-hour shift)." },
      { q: "What is the minimum daily wage requirement in India?", a: "State floor wages under the Code on Wages range from roughly ₹350 to over ₹850 per day depending on classification (unskilled to highly skilled)." },
      { q: "How is overtime pay taxed?", a: "Overtime earnings are treated as ordinary taxable income and subject to standard marginal income tax brackets and payroll deductions." },
      { q: "What constitutes an illegal wage deduction?", a: "Deducting pay for accidental till shortages, property breakage, or disciplinary fines without statutory authorization is strictly illegal." },
      { q: "What is the 30-day calendar calculation method?", a: "Dividing monthly pay by 30 days regardless of weekends; this yields a lower per-day rate often used in continuous 24/7 operations." },
      { q: "How do performance bonuses affect daily wage?", a: "Recurring guaranteed allowances are included in gross daily calculations, whereas non-guaranteed discretionary bonuses are excluded." },
      { q: "How do night shift differentials impact daily pay?", a: "Night or hazardous shift premiums add a flat fee or percentage multiplier (typically +10% to +25%) to the regular daily wage." },
      { q: "Can daily wage workers get paid annual leave?", a: "Yes, permanent daily-rated employees accrue paid leaves pro-rated according to statutory service thresholds." },
      { q: "What is the formula for minute rate calculation?", a: "Minute Rate = Hourly Rate ÷ 60 = (Daily Wage ÷ Shift Hours) ÷ 60." },
      { q: "How does salary pro-ration work for new hires joining mid-month?", a: "New Hires receive: (Monthly Gross Salary ÷ Standard Working Days) × Actual Days Worked from join date to month-end." },
      { q: "What is piece-rate pay compared to daily wage?", a: "Piece-rate compensates per manufactured unit, but employer disbursements must legally equal or exceed minimum daily wage." },
      { q: "How are weekend shifts remunerated?", a: "Weekend work on designated weekly rest days is remunerated at premium rates (typically 1.5x or 2.0x standard daily wage)." },
      { q: "How do sales commissions factor into daily wage?", a: "Under FLSA, non-discretionary commissions must be mathematically allocated into the regular hourly rate for accurate overtime computation." },
      { q: "Why is client-side privacy crucial in salary tools?", a: "Compensation metrics are sensitive personal data; local browser calculation guarantees zero server exposure." },
      { q: "How does unpaid suspension affect daily wage?", a: "Lawful disciplinary unpaid suspensions deduct the exact daily wage rate for each scheduled day of suspension." },
      { q: "How are daylight saving time shifts compensated?", a: "FLSA dictates paying for actual physical hours worked; if a night shift runs 9 hours due to fall-back, they receive 9 hours pay." },
      { q: "What is the difference between gross daily wage and net take-home?", a: "Gross daily wage is pre-tax cost-to-company rate; Net daily wage is the actual spendable income deposited into the employee's bank account." },
      { q: "How do remote workers manage time zones in daily wage calculations?", a: "Daily wage remains tied to completed shift hours within a 24-hour cycle, regardless of client time zone shifts." },
      { q: "How does statutory sick pay interact with daily rate?", a: "Employers deduct normal daily wage for unworked sick days and substitute statutory sick pay subsidies according to government rules." },
      { q: "Can daily wage workers be classified as independent contractors?", a: "Only if they control their methods and equipment; setting fixed hours and direct supervision classifies them legally as employees." },
      { q: "How does salary sacrifice affect daily wage?", a: "Pre-tax salary sacrifice lowers gross earnings, proportionally reducing the daily wage basis unless explicit terms dictate otherwise." },
      { q: "What is the 5-day vs 6-day workweek impact on annual days?", a: "A 5-day week averages 260 workdays per year, whereas a 6-day week averages 312 workdays, reducing the per-day wage rate." },
      { q: "How is daily wage rounded in enterprise payroll software?", a: "Calculations retain 4 decimal places during intermediate steps and round half-up to 2 decimal places on final disbursement." },
      { q: "Does the calculator support historical currency rates?", a: "SolveIt focuses on mathematical parity using regional divisors; you can freely switch currencies without distorting math." },
      { q: "How to compute daily wage when working variable shifts?", a: "Total monthly earnings divided by actual shifts worked, or multiplying variable hours by the contractual hourly rate." },
      { q: "What records must employers maintain for daily wage earners?", a: "Employers must maintain time cards, overtime logs, gross pay, deductions, and payment receipts for at least 3 years." },
      { q: "Is lunch time included when calculating contractor day rates?", a: "Contractor day rates represent 8 productive logged hours; meal breaks are taken outside billed project time." },
      { q: "Can you export calculation logs from SolveIt?", a: "Yes, click 'Logs' in the utility bar to export CSV audit trails or print formatted payroll reports with one click." }
    ];


import Link from 'next/link';

export default function DailyWageClient() {
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    if (openFaqIndices.includes(index)) {
      setOpenFaqIndices(openFaqIndices.filter(i => i !== index));
    } else {
      setOpenFaqIndices([...openFaqIndices, index]);
    }
  };

  useEffect(() => {
    // Global State
    let currentCurrency = "₹";
    let currentDivisor = 26;
    let currentStdHours = 8;
    let activeTabId = "tab-monthly-to-daily";
    let calculationHistory: any[] = [];

    // Format Numbers
    function formatMoney(num: any) {
      return currentCurrency + Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function showToast(msg: string) {
      const toast = document.getElementById('toast-notify');
      const text = document.getElementById('toast-message');
      if (!toast || !text) return;
      text.textContent = msg;
      toast.classList.remove('translate-y-24', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-24', 'opacity-0');
      }, 2200);
    }

    function recordHistory(calcName: string, summary: string) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      calculationHistory.unshift({ calcName, summary, timestamp });
      if (calculationHistory.length > 50) calculationHistory.pop();
      updateHistoryUI();
    }

    function updateHistoryUI() {
      const count = document.getElementById('history-count');
      const list = document.getElementById('history-list');
      if (count) count.textContent = calculationHistory.length.toString();
      if (!list) return;

      if (calculationHistory.length === 0) {
        list.innerHTML = '<p className="text-on-surface-variant italic py-2">No calculations recorded in this browser session yet.</p>';
        return;
      }

      list.innerHTML = calculationHistory.map(item => `
        <div className="flex items-center justify-between py-1 px-2 rounded bg-surface-container-lowest">
          <span><strong>${item.calcName}:</strong> ${item.summary}</span>
          <span className="text-on-surface-variant text-[10px]">${item.timestamp}</span>
        </div>
      `).join('');
    }

    // Region Switcher Logic
    function initRegionSwitcher() {
      const buttons = document.querySelectorAll('.region-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => {
            b.classList.remove('active', 'bg-primary', 'text-on-primary');
            b.classList.add('bg-surface-container', 'text-on-surface');
          });
          btn.classList.add('active', 'bg-primary', 'text-on-primary');
          btn.classList.remove('bg-surface-container', 'text-on-surface');

          currentCurrency = btn.dataset.symbol;
          currentDivisor = parseFloat(btn.dataset.divisor);
          currentStdHours = parseFloat(btn.dataset.hours);

          const badge = document.getElementById('active-currency-badge');
          if (badge) badge.textContent = `${currentCurrency.trim()} ${btn.dataset.country}`;

          document.querySelectorAll('.curr-symbol-marker').forEach(span => {
            span.textContent = currentCurrency.trim();
          });

          // Sync Tab 1 divisor if preset matches
          const m2dCustom = document.getElementById('m2d-custom-days');
          const m2dSlider = document.getElementById('m2d-slider');
          const m2dDisplay = document.getElementById('m2d-days-display');
          if (m2dCustom && m2dSlider && m2dDisplay) {
            m2dCustom.value = currentDivisor;
            m2dSlider.value = currentDivisor;
            m2dDisplay.textContent = currentDivisor + " days";
          }

          // Sync shift hours
          const m2dHours = document.getElementById('m2d-hours');
          if (m2dHours) m2dHours.value = currentStdHours;

          // Recalculate everything
          recalcActiveTab();
          populateMasterTable();
          showToast(`Switched region: ${btn.dataset.country} (${currentCurrency.trim()})`);
        });
      });
    }

    // Tab Switching
    function initTabs() {
      const tabBtns = document.querySelectorAll('.tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => {
            b.classList.remove('active', 'bg-primary', 'text-on-primary');
            b.classList.add('text-on-surface-variant');
          });
          btn.classList.add('active', 'bg-primary', 'text-on-primary');
          btn.classList.remove('text-on-surface-variant');

          const targetId = btn.dataset.tab;
          activeTabId = targetId;
          document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
          const targetPanel = document.getElementById(targetId);
          if (targetPanel) targetPanel.classList.remove('hidden');

          const titleSpan = document.getElementById('active-tab-title');
          if (titleSpan) titleSpan.textContent = btn.textContent.trim();

          recalcActiveTab();
        });
      });
    }

    // --- CALCULATOR ENGINES ---
    function calcMonthlyToDaily() {
      const salary = parseFloat(document.getElementById('m2d-salary')?.value) || 0;
      const days = parseFloat(document.getElementById('m2d-custom-days')?.value) || 26;
      const hours = parseFloat(document.getElementById('m2d-hours')?.value) || 8;

      const daily = days > 0 ? (salary / days) : 0;
      const hourly = hours > 0 ? (daily / hours) : 0;
      const weekly = daily * 5;
      const annual = salary * 12;

      const dailyEl = document.getElementById('m2d-result-daily');
      if (dailyEl) dailyEl.innerHTML = `<span>${formatMoney(daily)}</span>`;
      const hourlyEl = document.getElementById('m2d-result-hourly');
      if (hourlyEl) hourlyEl.textContent = `${formatMoney(hourly)} / hr`;
      const weeklyEl = document.getElementById('m2d-result-weekly');
      if (weeklyEl) weeklyEl.textContent = `${formatMoney(weekly)} / wk`;
      const annualEl = document.getElementById('m2d-result-annual');
      if (annualEl) annualEl.textContent = `${formatMoney(annual)} / yr`;
      const formulaEl = document.getElementById('m2d-formula-string');
      if (formulaEl) formulaEl.textContent = `Daily Wage = ${salary.toLocaleString()} ÷ ${days} = ${formatMoney(daily)}`;

      return { val: formatMoney(daily), summary: `${formatMoney(salary)}/mo @ ${days}d = ${formatMoney(daily)}/day` };
    }

    function calcDailyToMonthly() {
      const daily = parseFloat(document.getElementById('d2m-daily')?.value) || 0;
      const days = parseFloat(document.getElementById('d2m-days')?.value) || 26;
      const monthly = daily * days;
      const annual = monthly * 12;
      const quarterly = monthly * 3;

      const monthlyEl = document.getElementById('d2m-result-monthly');
      if (monthlyEl) monthlyEl.textContent = formatMoney(monthly);
      const annualEl = document.getElementById('d2m-result-annual');
      if (annualEl) annualEl.textContent = formatMoney(annual);
      const quarterEl = document.getElementById('d2m-result-quarterly');
      if (quarterEl) quarterEl.textContent = formatMoney(quarterly);
      const formulaEl = document.getElementById('d2m-formula-string');
      if (formulaEl) formulaEl.textContent = `${formatMoney(daily)} × ${days} days = ${formatMoney(monthly)} / mo`;

      return { val: formatMoney(monthly), summary: `${formatMoney(daily)}/day × ${days}d = ${formatMoney(monthly)}/mo` };
    }

    function calcHourlyToDaily() {
      const hourly = parseFloat(document.getElementById('h2d-hourly')?.value) || 0;
      const hours = parseFloat(document.getElementById('h2d-hours')?.value) || 8;
      const daily = hourly * hours;
      const weekly = daily * 5;
      const monthly = daily * 21.67;

      const dailyEl = document.getElementById('h2d-result-daily');
      if (dailyEl) dailyEl.textContent = formatMoney(daily);
      const weeklyEl = document.getElementById('h2d-result-weekly');
      if (weeklyEl) weeklyEl.textContent = formatMoney(weekly);
      const monthlyEl = document.getElementById('h2d-result-monthly');
      if (monthlyEl) monthlyEl.textContent = formatMoney(monthly);
      const formulaEl = document.getElementById('h2d-formula-string');
      if (formulaEl) formulaEl.textContent = `${formatMoney(hourly)}/hr × ${hours} hrs = ${formatMoney(daily)} / day`;

      return { val: formatMoney(daily), summary: `${formatMoney(hourly)}/hr × ${hours}h = ${formatMoney(daily)}/day` };
    }

    function calcOvertime() {
      const daily = parseFloat(document.getElementById('ot-daily-wage')?.value) || 0;
      const stdHours = parseFloat(document.getElementById('ot-std-hours')?.value) || 8;
      const extraHours = parseFloat(document.getElementById('ot-extra-hours')?.value) || 0;
      const mult = parseFloat(document.getElementById('ot-multiplier')?.value) || 2.0;

      const baseHourly = stdHours > 0 ? (daily / stdHours) : 0;
      const otHourly = baseHourly * mult;
      const otPay = extraHours * otHourly;
      const total = daily + otPay;

      const totalEl = document.getElementById('ot-result-total');
      if (totalEl) totalEl.textContent = formatMoney(total);
      const baseEl = document.getElementById('ot-result-base-rate');
      if (baseEl) baseEl.textContent = `${formatMoney(baseHourly)} / hr`;
      const otRateEl = document.getElementById('ot-result-ot-rate');
      if (otRateEl) otRateEl.textContent = `${formatMoney(otHourly)} / hr`;
      const otPayEl = document.getElementById('ot-result-ot-pay');
      if (otPayEl) otPayEl.textContent = formatMoney(otPay);
      const formulaEl = document.getElementById('ot-formula-string');
      if (formulaEl) formulaEl.textContent = `Base ${formatMoney(daily)} + (${extraHours}h × ${formatMoney(otHourly)}) = ${formatMoney(total)}`;

      return { val: formatMoney(total), summary: `Base ${formatMoney(daily)} + OT ${formatMoney(otPay)} = ${formatMoney(total)}` };
    }

    function calcLeaveDeduction() {
      const salary = parseFloat(document.getElementById('lop-salary')?.value) || 0;
      const divisor = parseFloat(document.getElementById('lop-days-basis')?.value) || 26;
      const absent = parseFloat(document.getElementById('lop-absent-days')?.value) || 0;

      const perDay = divisor > 0 ? (salary / divisor) : 0;
      const deduction = perDay * absent;
      const net = Math.max(0, salary - deduction);

      const netEl = document.getElementById('lop-result-net');
      if (netEl) netEl.textContent = formatMoney(net);
      const perDayEl = document.getElementById('lop-result-per-day');
      if (perDayEl) perDayEl.textContent = `-${formatMoney(perDay)}`;
      const deductEl = document.getElementById('lop-result-deduction');
      if (deductEl) deductEl.textContent = `-${formatMoney(deduction)}`;
      const formulaEl = document.getElementById('lop-formula-string');
      if (formulaEl) formulaEl.textContent = `${formatMoney(salary)} - (${formatMoney(perDay)} × ${absent}d) = ${formatMoney(net)}`;

      return { val: formatMoney(net), summary: `Net ${formatMoney(net)} after -${formatMoney(deduction)} LOP` };
    }

    function calcAttendance() {
      const daily = parseFloat(document.getElementById('att-daily-rate')?.value) || 0;
      const fullDays = parseFloat(document.getElementById('att-full-days')?.value) || 0;
      const halfDays = parseFloat(document.getElementById('att-half-days')?.value) || 0;
      const otHours = parseFloat(document.getElementById('att-ot-hours')?.value) || 0;

      const fullPay = fullDays * daily;
      const halfPay = halfDays * (daily * 0.5);
      const hourlyRate = daily / 8;
      const otPay = otHours * (hourlyRate * 2.0); // 2x statutory OT
      const total = fullPay + halfPay + otPay;

      const totalEl = document.getElementById('att-result-total');
      if (totalEl) totalEl.textContent = formatMoney(total);
      const fullPayEl = document.getElementById('att-result-full-pay');
      if (fullPayEl) fullPayEl.textContent = formatMoney(fullPay);
      const halfPayEl = document.getElementById('att-result-half-pay');
      if (halfPayEl) halfPayEl.textContent = formatMoney(halfPay);
      const otPayEl = document.getElementById('att-result-ot-pay');
      if (otPayEl) otPayEl.textContent = formatMoney(otPay);
      const formulaEl = document.getElementById('att-formula-string');
      if (formulaEl) formulaEl.textContent = `${fullDays} full + ${halfDays} half + ${otHours}h OT = ${formatMoney(total)}`;

      return { val: formatMoney(total), summary: `Attendance total: ${formatMoney(total)}` };
    }

    function calcFreelance() {
      const takeHome = parseFloat(document.getElementById('fl-take-home')?.value) || 0;
      const expenses = parseFloat(document.getElementById('fl-expenses')?.value) || 0;
      const taxPct = parseFloat(document.getElementById('fl-tax')?.value) || 0;
      const billableDays = parseFloat(document.getElementById('fl-billable-days')?.value) || 16;

      const netNeeded = takeHome + expenses;
      const grossNeeded = taxPct < 100 ? (netNeeded / (1 - (taxPct / 100))) : netNeeded;
      const dayRate = billableDays > 0 ? (grossNeeded / billableDays) : 0;
      const hourlyRate = dayRate / 8;

      const dayRateEl = document.getElementById('fl-result-day-rate');
      if (dayRateEl) dayRateEl.textContent = formatMoney(dayRate);
      const hrRateEl = document.getElementById('fl-result-hourly-rate');
      if (hrRateEl) hrRateEl.textContent = `${formatMoney(hourlyRate)} / hr`;
      const grossEl = document.getElementById('fl-result-gross-req');
      if (grossEl) grossEl.textContent = formatMoney(grossNeeded);

      return { val: formatMoney(dayRate), summary: `Freelance day rate: ${formatMoney(dayRate)} (${billableDays} billable days)` };
    }

    function calcContractor() {
      const workers = parseFloat(document.getElementById('cnt-workers')?.value) || 0;
      const wage = parseFloat(document.getElementById('cnt-wage')?.value) || 0;
      const days = parseFloat(document.getElementById('cnt-days')?.value) || 0;

      const burn = workers * wage;
      const total = burn * days;
      const monthly = burn * 26;

      const totalEl = document.getElementById('cnt-result-total');
      if (totalEl) totalEl.textContent = formatMoney(total);
      const burnEl = document.getElementById('cnt-result-burn');
      if (burnEl) burnEl.textContent = `${formatMoney(burn)} / day`;
      const monthEl = document.getElementById('cnt-result-monthly');
      if (monthEl) monthEl.textContent = formatMoney(monthly);
      const formEl = document.getElementById('cnt-formula-string');
      if (formEl) formEl.textContent = `${workers} workers × ${formatMoney(wage)} × ${days} days`;

      return { val: formatMoney(total), summary: `Crew budget: ${formatMoney(total)} (${workers} workers)` };
    }

    function calcPayrollBreakdown() {
      const gross = parseFloat(document.getElementById('pay-gross')?.value) || 0;
      const pfPct = parseFloat(document.getElementById('pay-pf-pct')?.value) || 0;
      const taxPct = parseFloat(document.getElementById('pay-tax-pct')?.value) || 0;
      const other = parseFloat(document.getElementById('pay-other-ded')?.value) || 0;

      const pf = gross * (pfPct / 100);
      const tax = gross * (taxPct / 100);
      const deductions = pf + tax + other;
      const net = Math.max(0, gross - deductions);
      const dailyNet = net / 26;

      const netPct = gross > 0 ? ((net / gross) * 100).toFixed(1) : 0;
      const dedPct = gross > 0 ? ((deductions / gross) * 100).toFixed(1) : 0;

      const netEl = document.getElementById('pay-result-net');
      if (netEl) netEl.textContent = formatMoney(net);
      const dNetEl = document.getElementById('pay-result-daily-net');
      if (dNetEl) dNetEl.textContent = `${formatMoney(dailyNet)} / day`;
      const dedEl = document.getElementById('pay-result-deductions');
      if (dedEl) dedEl.textContent = `-${formatMoney(deductions)}`;

      const barPct = document.getElementById('pay-bar-pct');
      if (barPct) barPct.textContent = netPct + '%';
      const dedBarPct = document.getElementById('pay-bar-ded-pct');
      if (dedBarPct) dedBarPct.textContent = dedPct + '%';
      const netFill = document.getElementById('pay-bar-net-fill');
      if (netFill) netFill.style.width = netPct + '%';
      const dedFill = document.getElementById('pay-bar-ded-fill');
      if (dedFill) dedFill.style.width = dedPct + '%';

      return { val: formatMoney(net), summary: `Gross ${formatMoney(gross)} → Net ${formatMoney(net)}` };
    }

    function calcDailyToHourly() {
      const daily = parseFloat(document.getElementById('d2h-daily')?.value) || 0;
      const hours = parseFloat(document.getElementById('d2h-hours')?.value) || 8;

      const hourly = hours > 0 ? (daily / hours) : 0;
      const minute = hourly / 60;
      const second = minute / 60;

      const hrEl = document.getElementById('d2h-result-hourly');
      if (hrEl) hrEl.textContent = formatMoney(hourly);
      const minEl = document.getElementById('d2h-result-minute');
      if (minEl) minEl.textContent = `${formatMoney(minute)} / min`;
      const secEl = document.getElementById('d2h-result-second');
      if (secEl) secEl.textContent = `${formatMoney(second)} / sec`;
      const formEl = document.getElementById('d2h-formula-string');
      if (formEl) formEl.textContent = `${formatMoney(daily)} ÷ ${hours}h = ${formatMoney(hourly)} / hr`;

      return { val: formatMoney(hourly), summary: `${formatMoney(daily)}/day = ${formatMoney(hourly)}/hr` };
    }

    function recalcActiveTab() {
      switch(activeTabId) {
        case 'tab-monthly-to-daily': return calcMonthlyToDaily();
        case 'tab-daily-to-monthly': return calcDailyToMonthly();
        case 'tab-hourly-to-daily': return calcHourlyToDaily();
        case 'tab-overtime': return calcOvertime();
        case 'tab-leave-deduction': return calcLeaveDeduction();
        case 'tab-attendance': return calcAttendance();
        case 'tab-freelance': return calcFreelance();
        case 'tab-contractor': return calcContractor();
        case 'tab-payroll-breakdown': return calcPayrollBreakdown();
        case 'tab-daily-to-hourly': return calcDailyToHourly();
      }
    }

    // Expose quick set function
    (window as any).setM2DSalary = function(amt: any) {
      const input = document.getElementById('m2d-salary');
      if (input) {
        input.value = amt;
        calcMonthlyToDaily();
        recordHistory("Monthly to Daily", `${formatMoney(amt)}/mo evaluated`);
      }
    };

    window.loadSalaryIntoTab1 = function(sal) {
      // Switch to Tab 1
      const tab1Btn = document.querySelector('[data-tab="tab-monthly-to-daily"]');
      if (tab1Btn) (tab1Btn as HTMLButtonElement).click();
      const input = document.getElementById('m2d-salary') as HTMLInputElement;
      if (input) {
        input.value = sal.toString();
        calcMonthlyToDaily();
      }
      window.scrollTo({ top: document.getElementById('tab-navigation')?.offsetTop - 80, behavior: 'smooth' });
      showToast(`Loaded ${currentCurrency}${sal.toLocaleString()} into calculator`);
    };


    // Wire Tab 1 controls
    function initTab1Controls() {
      const slider = document.getElementById('m2d-slider');
      const customDays = document.getElementById('m2d-custom-days');
      const display = document.getElementById('m2d-days-display');
      const salary = document.getElementById('m2d-salary');
      const hours = document.getElementById('m2d-hours');
      const presets = document.querySelectorAll('.m2d-preset');

      if (!slider || !customDays) return;

      slider.addEventListener('input', (e) => {
        (customDays as HTMLInputElement).value = (e.target as HTMLInputElement).value;
        if (display) display.textContent = (e.target as HTMLInputElement).value + " days";
        presets.forEach(p => p.classList.remove('active', 'bg-primary', 'text-on-primary'));
        calcMonthlyToDaily();
      });

      customDays.addEventListener('input', (e) => {
        (slider as HTMLInputElement).value = (e.target as HTMLInputElement).value;
        if (display) display.textContent = (e.target as HTMLInputElement).value + " days";
        calcMonthlyToDaily();
      });

      salary?.addEventListener('input', calcMonthlyToDaily);
      hours?.addEventListener('change', calcMonthlyToDaily);

      presets.forEach(btn => {
        btn.addEventListener('click', () => {
          presets.forEach(p => {
            p.classList.remove('active', 'bg-primary', 'text-on-primary');
            p.classList.add('bg-surface-container', 'text-on-surface');
          });
          btn.classList.add('active', 'bg-primary', 'text-on-primary');
          btn.classList.remove('bg-surface-container', 'text-on-surface');

          const val = (btn as HTMLElement).dataset.days;
          (slider as HTMLInputElement).value = val;
          (customDays as HTMLInputElement).value = val;
          if (display) display.textContent = val + " days";
          calcMonthlyToDaily();
        });
      });
    }

    // Universal Input Event Binding
    function bindInputs() {
      const inputs = document.querySelectorAll('#calculator-panels input, #calculator-panels select');
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          recalcActiveTab();
        });
      });

      // Copy Button
      const copyBtn = document.getElementById('copy-primary-result-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const res = recalcActiveTab();
          if (res) {
            navigator.clipboard.writeText(res.summary || res.val).then(() => {
              showToast(`Copied: ${res.val}`);
              recordHistory("Result Copied", res.summary);
            });
          }
        });
      }

      // Toggle History
      const histBtn = document.getElementById('toggle-history-btn');
      const histDrawer = document.getElementById('history-drawer');
      if (histBtn && histDrawer) {
        histBtn.addEventListener('click', () => {
          histDrawer.classList.toggle('hidden');
        });
      }

      // Clear History
      const clearBtn = document.getElementById('clear-history-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          calculationHistory = [];
          updateHistoryUI();
          showToast("Calculation log cleared");
        });
      }

      // Export History CSV
      const expBtn = document.getElementById('export-history-csv');
      if (expBtn) {
        expBtn.addEventListener('click', () => {
          if (calculationHistory.length === 0) {
            showToast("No history to export");
            return;
          }
          let csv = "Timestamp,Calculator,Summary\n";
          calculationHistory.forEach(row => {
            csv += `"${row.timestamp}","${row.calcName}","${row.summary.replace(/"/g, '""')}"\n`;
          });
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", `SolveIt-Payroll-Audit-${Date.now()}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast("CSV exported successfully");
        });
      }
    }

    // Master Table Data Generation
    const salarySlabs = [
      10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 
      60000, 70000, 75000, 80000, 90000, 100000, 120000, 150000, 
      175000, 200000, 250000, 300000, 400000, 500000
    ];

    function populateMasterTable(filterVal = "") {
      const tbody = document.getElementById('master-table-body');
      const countEl = document.getElementById('table-slab-count');
      if (!tbody) return;

      const trimmedFilter = filterVal.trim().toLowerCase();
      const filtered = salarySlabs.filter(s => {
        if (!trimmedFilter) return true;
        return s.toString().includes(trimmedFilter) || 
               s.toLocaleString().toLowerCase().includes(trimmedFilter) ||
               (s >= 1000 && (s/1000).toString().includes(trimmedFilter));
      });

      if (countEl) {
        countEl.textContent = `${filtered.length} of ${salarySlabs.length} Slabs`;
      }

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="p-space-lg text-center bg-surface-container-lowest">
              <div class="flex flex-col items-center justify-center py-6 space-y-2">
                <span class="material-symbols-outlined text-outline text-[36px]">search_off</span>
                <p class="font-body-md text-on-surface font-semibold">No salary slabs match "${filterVal}"</p>
                <p class="font-body-sm text-xs text-on-surface-variant">Try searching for 25000, 50000, 100000 or click a quick filter chip.</p>
                <button type="button" onclick="document.getElementById('table-filter-input').value=''; populateMasterTable('');" class="mt-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors">
                  Clear Filter
                </button>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map((sal, idx) => {
        const d26 = (sal / 26).toFixed(2);
        const d22 = (sal / 22).toFixed(2);
        const d21 = (sal / 21.67).toFixed(2);
        const d30 = (sal / 30).toFixed(2);
        const isAlternate = idx % 2 === 1;

        return `
          <tr class="group hover:bg-primary/5 transition-all duration-150 border-b border-surface-container/60 last:border-b-0 ${isAlternate ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30'}">
            <td class="p-space-md font-data-mono font-bold text-on-surface text-sm sm:text-base">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-125 transition-all"></span>
                <span>${currentCurrency}${sal.toLocaleString()}</span>
              </div>
            </td>
            <td class="p-space-md font-data-mono font-bold text-primary bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <span class="inline-flex items-center gap-1">
                ${currentCurrency}${Number(d26).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </td>
            <td class="p-space-md font-data-mono font-medium text-on-surface">
              ${currentCurrency}${Number(d22).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </td>
            <td class="p-space-md font-data-mono font-medium text-on-surface">
              ${currentCurrency}${Number(d21).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </td>
            <td class="p-space-md font-data-mono text-on-surface-variant">
              ${currentCurrency}${Number(d30).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </td>
            <td class="p-space-md text-right whitespace-nowrap">
              <button 
                type="button" 
                onclick="loadSalaryIntoTab1(${sal})" 
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-body-sm text-xs font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer ring-1 ring-primary/30 group/btn"
                title="Load ${currentCurrency}${sal.toLocaleString()} into calculator"
              >
                <span class="material-symbols-outlined text-[15px] group-hover/btn:-translate-y-0.5 transition-transform">arrow_upward</span>
                <span>Load in Calc</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Quick preset click handler
    (window as any).filterMasterTablePreset = function(val: string) {
      const input = document.getElementById('table-filter-input') as HTMLInputElement;
      if (input) {
        input.value = val;
        populateMasterTable(val);
      }
    };

    // Table filter listener
    function initTableFilter() {
      const input = document.getElementById('table-filter-input');
      if (input) {
        input.addEventListener('input', (e) => {
          populateMasterTable((e.target as HTMLInputElement).value);
        });
      }
    }

    // 50 Questions Data Source

    initRegionSwitcher();
    initTabs();
    initTab1Controls();
    bindInputs();
    populateMasterTable();
    initTableFilter();
        calcMonthlyToDaily(); // Default calculation
  }, []);

  return (
    <>

<main className="w-full pt-16 min-h-[calc(100vh-14rem)] bg-background"><div className="flex flex-col w-full">
{/*  Structured JSON-LD Schema (WebPage, WebApp, Calculator, HowTo, Breadcrumbs, 50 FAQ items)  */}

{/*  Notification Toast Container  */}
<div className="fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl" id="toast-notify">
<span className="material-symbols-outlined text-[20px] text-secondary-container">check_circle</span>
<span className="font-body-sm text-body-sm font-medium" id="toast-message">Copied to clipboard</span>
</div>
{/*  BREADCRUMB & METADATA BAR  */}
<div className="w-full bg-surface-container-lowest shadow-sm">
<div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
<nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs text-on-surface-variant font-body-sm text-body-sm">
<a className="hover:text-primary transition-colors" data-path="home" href="#">Home</a>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<a className="hover:text-primary transition-colors" data-path="financial" href="#">Financial &amp; Payroll</a>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-on-surface font-semibold">Daily Wage Calculator</span>
</nav>
</div>
</div>
{/*  HERO BANNER SECTION (Typography-Driven)  */}
<section className="w-full relative overflow-hidden py-space-xl lg:py-space-2xl bg-surface-container-low">
<div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
<div className="lg:col-span-8 space-y-space-sm">
<div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps uppercase tracking-wider">
<span className="material-symbols-outlined text-[16px]">calculate</span>
            Autonomous Payroll Engine v4.8
          </div>
<h1 className="font-display-hero text-display-hero-mobile lg:text-display-hero text-on-surface tracking-tight font-bold">
            Daily Wage <span className="text-primary">Calculator</span>
</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Convert monthly salary, hourly rates, and contracts into exact daily compensation with statutory legal divisors (India 26-day, US 21.67-day, UK 260-day, UAE 30-day). Instant, mathematically verified, zero server pings.
          </p>
</div>
{/*  Global Jurisdiction & Currency Selector Sidecar  */}
<div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-md space-y-space-sm">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">public</span>
<span className="font-headline-md text-headline-md text-on-surface text-base font-semibold">Jurisdiction &amp; Currency</span>
</div>
<span className="font-data-mono text-data-mono font-semibold px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed" id="active-currency-badge">₹ INR</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Select region to synchronize statutory baseline divisors and currency symbols automatically:
          </p>
<div className="grid grid-cols-2 gap-space-2xs pt-space-xs" id="region-selector-grid">
<button className="region-btn active flex items-center gap-space-2xs p-space-xs rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold transition-all" data-country="IN" data-divisor="26" data-hours="8" data-symbol="₹" type="button">
<span>🇮🇳 India</span>
<span className="ml-auto font-data-mono text-[11px] opacity-90">(26d)</span>
</button>
<button className="region-btn flex items-center gap-space-2xs p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all" data-country="US" data-divisor="21.67" data-hours="8" data-symbol="$" type="button">
<span>🇺🇸 USA</span>
<span className="ml-auto font-data-mono text-[11px] opacity-75">(21.67d)</span>
</button>
<button className="region-btn flex items-center gap-space-2xs p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all" data-country="UK" data-divisor="21.67" data-hours="7.5" data-symbol="£" type="button">
<span>🇬🇧 UK</span>
<span className="ml-auto font-data-mono text-[11px] opacity-75">(260d)</span>
</button>
<button className="region-btn flex items-center gap-space-2xs p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all" data-country="AE" data-divisor="30" data-hours="8" data-symbol="AED " type="button">
<span>🇦🇪 UAE</span>
<span className="ml-auto font-data-mono text-[11px] opacity-75">(30d)</span>
</button>
<button className="region-btn flex items-center gap-space-2xs p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all" data-country="AU" data-divisor="21.67" data-hours="7.6" data-symbol="A$" type="button">
<span>🇦🇺 Australia</span>
<span className="ml-auto font-data-mono text-[11px] opacity-75">(38h)</span>
</button>
<button className="region-btn flex items-center gap-space-2xs p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all" data-country="CA" data-divisor="21.67" data-hours="8" data-symbol="C$" type="button">
<span>🇨🇦 Canada</span>
<span className="ml-auto font-data-mono text-[11px] opacity-75">(21.67d)</span>
</button>
</div>
</div>
</div>
</div>
</section>
{/*  WORKBENCH SUITE (10 TABS + DYNAMIC ENGINE)  */}
<section className="w-full py-space-xl lg:py-space-2xl">
<div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
{/*  TOOLBAR & WORKBENCH TABS  */}
<div className="bg-surface-container-lowest rounded-xl p-space-xs shadow-md mb-space-lg overflow-x-auto">
<div className="flex items-center gap-space-2xs min-w-[940px]" id="tab-navigation">
<button className="tab-btn active px-space-sm py-space-xs rounded-lg font-body-sm text-body-sm font-semibold bg-primary text-on-primary flex items-center gap-space-2xs transition-all" data-tab="tab-monthly-to-daily" type="button">
<span className="material-symbols-outlined text-[16px]">calendar_month</span> Monthly → Daily
          </button>
<button className="tab-btn px-space-sm py-space-xs rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-space-2xs" data-tab="tab-daily-to-monthly" type="button">
<span className="material-symbols-outlined text-[16px]">trending_up</span> Daily → Monthly
          </button>
<button className="tab-btn px-space-sm py-space-xs rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-space-2xs" data-tab="tab-hourly-to-daily" type="button">
<span className="material-symbols-outlined text-[16px]">schedule</span> Hourly → Daily
          </button>
<button className="tab-btn px-space-sm py-space-xs rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-space-2xs" data-tab="tab-overtime" type="button">
<span className="material-symbols-outlined text-[16px]">more_time</span> Overtime (OT)
          </button>
<button className="tab-btn px-space-sm py-space-xs rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-space-2xs" data-tab="tab-leave-deduction" type="button">
<span className="material-symbols-outlined text-[16px]">event_busy</span> Leave Deduction (LOP)
          </button>
<button className="tab-btn px-space-sm py-space-xs rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-space-2xs" data-tab="tab-attendance" type="button">
<span className="material-symbols-outlined text-[16px]">fact_check</span> Attendance Salary
          </button>
<button className="tab-btn px-space-sm py-space-xs rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-space-2xs" data-tab="tab-freelance" type="button">
<span className="material-symbols-outlined text-[16px]">laptop_mac</span> Freelance Day Rate
          </button>
<button className="tab-btn px-space-sm py-space-xs rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-space-2xs" data-tab="tab-contractor" type="button">
<span className="material-symbols-outlined text-[16px]">groups</span> Contractor Crew
          </button>
<button className="tab-btn px-space-sm py-space-xs rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-space-2xs" data-tab="tab-payroll-breakdown" type="button">
<span className="material-symbols-outlined text-[16px]">pie_chart</span> Net In-Hand
          </button>
<button className="tab-btn px-space-sm py-space-xs rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-space-2xs" data-tab="tab-daily-to-hourly" type="button">
<span className="material-symbols-outlined text-[16px]">av_timer</span> Daily → Hourly
          </button>
</div>
</div>
{/*  MAIN WORKBENCH CARD  */}
<div className="bg-surface-container-lowest rounded-xl shadow-lg p-space-lg lg:p-space-xl relative">
{/*  UTILITY ACTIONS BAR  */}
<div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-lg mb-space-lg bg-surface-container-low/50 p-space-sm rounded-lg">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Active Engine:</span>
<span className="font-body-sm text-body-sm font-bold text-on-surface" id="active-tab-title">Monthly Salary → Daily Wage Conversion</span>
</div>
<div className="flex items-center gap-space-2xs">
<button className="px-space-sm py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-body-sm text-body-sm font-medium text-on-surface flex items-center gap-1 transition-colors" id="copy-primary-result-btn" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span> Copy Output
            </button>
<button className="px-space-sm py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-body-sm text-body-sm font-medium text-on-surface flex items-center gap-1 transition-colors" onClick={() => { window.print() }} type="button">
<span className="material-symbols-outlined text-[16px]">print</span> Print Report
            </button>
<button className="px-space-sm py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-body-sm text-body-sm font-medium text-on-surface flex items-center gap-1 transition-colors" id="toggle-history-btn" type="button">
<span className="material-symbols-outlined text-[16px]">history</span> Logs (<span id="history-count">0</span>)
            </button>
</div>
</div>
{/*  10 TAB PANELS  */}
<div id="calculator-panels">
{/*  TAB 1: Monthly Salary -> Daily Wage  */}
<div className="tab-panel block" id="tab-monthly-to-daily">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<div className="lg:col-span-7 space-y-space-md">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="m2d-salary">Monthly Gross Remuneration</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner" id="m2d-salary" min="0" step="500" type="number" defaultValue="50000"/>
</div>
<div className="flex items-center gap-space-2xs mt-space-2xs">
<button className="px-space-xs py-0.5 rounded bg-surface-container font-data-mono text-xs hover:bg-surface-container-high text-on-surface-variant" onClick={() => { setM2DSalary(25000) }} type="button">25k</button>
<button className="px-space-xs py-0.5 rounded bg-surface-container font-data-mono text-xs hover:bg-surface-container-high text-on-surface-variant" onClick={() => { setM2DSalary(50000) }} type="button">50k</button>
<button className="px-space-xs py-0.5 rounded bg-surface-container font-data-mono text-xs hover:bg-surface-container-high text-on-surface-variant" onClick={() => { setM2DSalary(75000) }} type="button">75k</button>
<button className="px-space-xs py-0.5 rounded bg-surface-container font-data-mono text-xs hover:bg-surface-container-high text-on-surface-variant" onClick={() => { setM2DSalary(100000) }} type="button">100k</button>
<button className="px-space-xs py-0.5 rounded bg-surface-container font-data-mono text-xs hover:bg-surface-container-high text-on-surface-variant" onClick={() => { setM2DSalary(150000) }} type="button">150k</button>
</div>
</div>
<div>
<div className="flex items-center justify-between mb-space-2xs">
<label className="font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant">Working Days Basis in Month</label>
<span className="font-data-mono text-data-mono font-bold text-primary" id="m2d-days-display">26 days</span>
</div>
<div className="grid grid-cols-4 sm:grid-cols-7 gap-space-2xs mb-space-xs" id="m2d-days-presets">
<button className="m2d-preset py-space-xs rounded bg-surface-container text-on-surface font-data-mono text-body-sm font-semibold" data-days="20" type="button">20d</button>
<button className="m2d-preset py-space-xs rounded bg-surface-container text-on-surface font-data-mono text-body-sm font-semibold" data-days="21.67" type="button">21.67d</button>
<button className="m2d-preset py-space-xs rounded bg-surface-container text-on-surface font-data-mono text-body-sm font-semibold" data-days="22" type="button">22d</button>
<button className="m2d-preset py-space-xs rounded bg-surface-container text-on-surface font-data-mono text-body-sm font-semibold" data-days="24" type="button">24d</button>
<button className="m2d-preset active py-space-xs rounded bg-primary text-on-primary font-data-mono text-body-sm font-semibold" data-days="26" type="button">26d</button>
<button className="m2d-preset py-space-xs rounded bg-surface-container text-on-surface font-data-mono text-body-sm font-semibold" data-days="30" type="button">30d</button>
<button className="m2d-preset py-space-xs rounded bg-surface-container text-on-surface font-data-mono text-body-sm font-semibold" data-days="31" type="button">31d</button>
</div>
<div className="flex items-center gap-space-sm">
<input className="w-full accent-primary" id="m2d-slider" max="31" min="15" step="0.01" type="range" defaultValue="26"/>
<input className="w-20 px-space-xs py-1 rounded bg-surface-container-low font-data-mono text-data-mono text-center" id="m2d-custom-days" max="31" min="1" step="0.01" type="number" defaultValue="26"/>
</div>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="m2d-hours">Daily Shift Length</label>
<select className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface" id="m2d-hours">
<option defaultValue="8">8 Hours (Standard Full-Time Shift)</option>
<option defaultValue="7.5">7.5 Hours (UK / Australia Standard Office)</option>
<option defaultValue="7.6">7.6 Hours (Australia 38h Weekly Standard)</option>
<option defaultValue="9">9 Hours (Extended Industrial Shift)</option>
<option defaultValue="10">10 Hours (4x10 Compressed Shift)</option>
<option defaultValue="6">6 Hours (Part-Time Core Shift)</option>
</select>
</div>
</div>
{/*  Output Sidecar  */}
<div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Calculated Equivalent</span>
<div className="mt-space-2xs mb-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Daily Wage Rate:</span>
<div className="font-numerical-display text-numerical-display text-primary flex items-baseline gap-1" id="m2d-result-daily">
<span>₹1,923.08</span>
</div>
</div>
<div className="space-y-space-xs pt-space-xs">
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Hourly Equivalent:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="m2d-result-hourly">₹240.38 / hr</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Weekly Pay (5-day):</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="m2d-result-weekly">₹9,615.38 / wk</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Annualized Salary:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="m2d-result-annual">₹600,000.00 / yr</span>
</div>
</div>
</div>
<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-highest/60">
<span className="font-label-caps text-label-caps uppercase text-secondary font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">functions</span> Applied Math Formula
                  </span>
<p className="font-data-mono text-xs text-on-surface mt-1" id="m2d-formula-string">
                    Daily Wage = 50,000 ÷ 26 = ₹1,923.08
                  </p>
</div>
</div>
</div>
</div>
{/*  TAB 2: Daily Wage -> Monthly Salary  */}
<div className="tab-panel hidden" id="tab-daily-to-monthly">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<div className="lg:col-span-7 space-y-space-md">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="d2m-daily">Daily Wage Rate</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner" id="d2m-daily" min="0" step="50" type="number" defaultValue="1500"/>
</div>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="d2m-days">Paid Working Days Per Month</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="d2m-days" max="31" min="1" type="number" defaultValue="26"/>
</div>
</div>
<div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Estimated Remuneration</span>
<div className="mt-space-2xs mb-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Gross Monthly Earnings:</span>
<div className="font-numerical-display text-numerical-display text-primary" id="d2m-result-monthly">
                      ₹39,000.00
                    </div>
</div>
<div className="space-y-space-xs">
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Annual Projected Pay:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="d2m-result-annual">₹468,000.00</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Quarterly Estimate:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="d2m-result-quarterly">₹117,000.00</span>
</div>
</div>
</div>
<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-highest/60">
<p className="font-data-mono text-xs text-on-surface" id="d2m-formula-string">1,500 × 26 days = ₹39,000.00/mo</p>
</div>
</div>
</div>
</div>
{/*  TAB 3: Hourly Rate -> Daily Wage  */}
<div className="tab-panel hidden" id="tab-hourly-to-daily">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<div className="lg:col-span-7 space-y-space-md">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="h2d-hourly">Contracted Hourly Rate</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" id="h2d-hourly" min="0" step="10" type="number" defaultValue="250"/>
</div>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="h2d-hours">Shift Hours Worked</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="h2d-hours" max="24" min="1" step="0.5" type="number" defaultValue="8"/>
</div>
</div>
<div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Derived Day &amp; Month Values</span>
<div className="mt-space-2xs mb-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Daily Remuneration:</span>
<div className="font-numerical-display text-numerical-display text-primary" id="h2d-result-daily">₹2,000.00</div>
</div>
<div className="space-y-space-xs">
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Weekly (5 Days / 40h):</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="h2d-result-weekly">₹10,000.00</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Monthly (21.67 Days):</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="h2d-result-monthly">₹43,340.00</span>
</div>
</div>
</div>
<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-highest/60">
<p className="font-data-mono text-xs text-on-surface" id="h2d-formula-string">250/hr × 8 hrs = ₹2,000.00/day</p>
</div>
</div>
</div>
</div>
{/*  TAB 4: Overtime Calculator  */}
<div className="tab-panel hidden" id="tab-overtime">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<div className="lg:col-span-7 space-y-space-md">
<div className="grid grid-cols-2 gap-space-sm">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="ot-daily-wage">Base Daily Wage</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="ot-daily-wage" min="0" step="50" type="number" defaultValue="1600"/>
</div>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="ot-std-hours">Standard Shift Hrs</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="ot-std-hours" max="12" min="4" step="0.5" type="number" defaultValue="8"/>
</div>
</div>
<div className="grid grid-cols-2 gap-space-sm">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="ot-extra-hours">Overtime Hours Worked</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="ot-extra-hours" max="16" min="0" step="0.5" type="number" defaultValue="3"/>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="ot-multiplier">OT Multiplier</label>
<select className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface" id="ot-multiplier">
<option defaultValue="2.0">2.0x (Double Time - India / Weekend)</option>
<option defaultValue="1.5">1.5x (Time &amp; Half - US FLSA / Standard)</option>
<option defaultValue="1.25">1.25x (Partial Premium)</option>
<option defaultValue="2.5">2.5x (Statutory Holiday Special)</option>
</select>
</div>
</div>
</div>
<div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Shift Earnings Breakdown</span>
<div className="mt-space-2xs mb-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Total Daily Compensation:</span>
<div className="font-numerical-display text-numerical-display text-primary" id="ot-result-total">₹2,800.00</div>
</div>
<div className="space-y-space-xs">
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Base Hourly Rate:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="ot-result-base-rate">₹200.00 / hr</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">OT Hourly Rate:</span>
<span className="font-data-mono text-data-mono font-semibold text-primary" id="ot-result-ot-rate">₹400.00 / hr</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Overtime Extra Pay:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="ot-result-ot-pay">₹1,200.00</span>
</div>
</div>
</div>
<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-highest/60">
<p className="font-data-mono text-xs text-on-surface" id="ot-formula-string">Base ₹1,600 + (3h × ₹400) = ₹2,800.00</p>
</div>
</div>
</div>
</div>
{/*  TAB 5: Leave Deduction (LOP)  */}
<div className="tab-panel hidden" id="tab-leave-deduction">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<div className="lg:col-span-7 space-y-space-md">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="lop-salary">Gross Monthly Salary</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="lop-salary" min="0" step="1000" type="number" defaultValue="60000"/>
</div>
</div>
<div className="grid grid-cols-2 gap-space-sm">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="lop-days-basis">Month Divisor Basis</label>
<select className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface" id="lop-days-basis">
<option defaultValue="26">26 Days (Statutory Working)</option>
<option defaultValue="30">30 Days (Calendar Standard)</option>
<option defaultValue="31">31 Days (Full Calendar)</option>
<option defaultValue="22">22 Days (5-day Week)</option>
</select>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="lop-absent-days">Unpaid Leave (LOP) Days</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="lop-absent-days" max="31" min="0" step="0.5" type="number" defaultValue="3.5"/>
</div>
</div>
</div>
<div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Net Payable Remuneration</span>
<div className="mt-space-2xs mb-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Payable Salary Post-Deduction:</span>
<div className="font-numerical-display text-numerical-display text-primary" id="lop-result-net">₹51,923.08</div>
</div>
<div className="space-y-space-xs">
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Per-Day Rate Deducted:</span>
<span className="font-data-mono text-data-mono font-semibold text-error" id="lop-result-per-day">-₹2,307.69</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Total LOP Deduction:</span>
<span className="font-data-mono text-data-mono font-semibold text-error" id="lop-result-deduction">-₹8,076.92</span>
</div>
</div>
</div>
<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-highest/60">
<p className="font-data-mono text-xs text-on-surface" id="lop-formula-string">60k - (2,307.69 × 3.5) = ₹51,923.08</p>
</div>
</div>
</div>
</div>
{/*  TAB 6: Attendance Wage Calculator  */}
<div className="tab-panel hidden" id="tab-attendance">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<div className="lg:col-span-7 space-y-space-md">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="att-daily-rate">Daily Wage Base Rate</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="att-daily-rate" min="0" step="50" type="number" defaultValue="1200"/>
</div>
</div>
<div className="grid grid-cols-3 gap-space-xs">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="att-full-days">Full Days Present</label>
<input className="w-full px-space-xs py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-center" id="att-full-days" max="31" min="0" type="number" defaultValue="22"/>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="att-half-days">Half Days (0.5x)</label>
<input className="w-full px-space-xs py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-center" id="att-half-days" max="31" min="0" type="number" defaultValue="2"/>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="att-ot-hours">Overtime (Hrs)</label>
<input className="w-full px-space-xs py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-center" id="att-ot-hours" max="100" min="0" type="number" defaultValue="10"/>
</div>
</div>
</div>
<div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Disbursable Attendance Wage</span>
<div className="mt-space-2xs mb-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Total Monthly Payout:</span>
<div className="font-numerical-display text-numerical-display text-primary" id="att-result-total">₹30,600.00</div>
</div>
<div className="space-y-space-xs">
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Full Days Earned:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="att-result-full-pay">₹26,400.00</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Half Days Earned:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="att-result-half-pay">₹1,200.00</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Overtime Pay (2x rate):</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="att-result-ot-pay">₹3,000.00</span>
</div>
</div>
</div>
<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-highest/60">
<p className="font-data-mono text-xs text-on-surface" id="att-formula-string">22d + (2 × 0.5d) = 23 effective days + 10h OT</p>
</div>
</div>
</div>
</div>
{/*  TAB 7: Freelancer Day Rate  */}
<div className="tab-panel hidden" id="tab-freelance">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<div className="lg:col-span-7 space-y-space-md">
<div className="grid grid-cols-2 gap-space-sm">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="fl-take-home">Target Monthly Take-Home</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="fl-take-home" min="0" step="5000" type="number" defaultValue="120000"/>
</div>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="fl-expenses">Monthly Biz Expenses</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="fl-expenses" min="0" step="1000" type="number" defaultValue="15000"/>
</div>
</div>
</div>
<div className="grid grid-cols-2 gap-space-sm">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="fl-tax">Estimated Tax &amp; Cess (%)</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="fl-tax" max="60" min="0" type="number" defaultValue="20"/>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="fl-billable-days">Billable Days / Month</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="fl-billable-days" max="31" min="1" type="number" defaultValue="16"/>
</div>
</div>
</div>
<div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Recommended Commercial Billing</span>
<div className="mt-space-2xs mb-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Recommended Day Rate:</span>
<div className="font-numerical-display text-numerical-display text-primary" id="fl-result-day-rate">₹10,312.50</div>
</div>
<div className="space-y-space-xs">
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Hourly Rate (8h basis):</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="fl-result-hourly-rate">₹1,289.06 / hr</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Monthly Gross Target:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="fl-result-gross-req">₹165,000.00</span>
</div>
</div>
</div>
<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-highest/60">
<p className="font-data-mono text-xs text-on-surface" id="fl-formula-string">Accounts for non-billable marketing &amp; taxes</p>
</div>
</div>
</div>
</div>
{/*  TAB 8: Contractor Crew Calculator  */}
<div className="tab-panel hidden" id="tab-contractor">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<div className="lg:col-span-7 space-y-space-md">
<div className="grid grid-cols-3 gap-space-sm">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="cnt-workers">Worker Headcount</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="cnt-workers" max="1000" min="1" type="number" defaultValue="8"/>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="cnt-wage">Wage / Worker / Day</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-xs py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="cnt-wage" min="0" step="50" type="number" defaultValue="950"/>
</div>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="cnt-days">Project Duration (Days)</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="cnt-days" max="365" min="1" type="number" defaultValue="45"/>
</div>
</div>
</div>
<div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Total Crew Labor Budget</span>
<div className="mt-space-2xs mb-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Project Total Labor Cost:</span>
<div className="font-numerical-display text-numerical-display text-primary" id="cnt-result-total">₹342,000.00</div>
</div>
<div className="space-y-space-xs">
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Daily Crew Burn Rate:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="cnt-result-burn">₹7,600.00 / day</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Monthly Burn (26 days):</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="cnt-result-monthly">₹197,600.00</span>
</div>
</div>
</div>
<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-highest/60">
<p className="font-data-mono text-xs text-on-surface" id="cnt-formula-string">8 workers × ₹950 × 45 days</p>
</div>
</div>
</div>
</div>
{/*  TAB 9: Payroll Breakdown (Net In-Hand)  */}
<div className="tab-panel hidden" id="tab-payroll-breakdown">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<div className="lg:col-span-7 space-y-space-md">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="pay-gross">Gross Monthly Remuneration</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="pay-gross" min="0" step="1000" type="number" defaultValue="75000"/>
</div>
</div>
<div className="grid grid-cols-2 gap-space-sm">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="pay-pf-pct">PF / 401k / Pension (%)</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="pay-pf-pct" max="50" min="0" step="0.5" type="number" defaultValue="12"/>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="pay-tax-pct">Tax / TDS / Withholding (%)</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="pay-tax-pct" max="50" min="0" step="0.5" type="number" defaultValue="10"/>
</div>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="pay-other-ded">Insurance &amp; Fixed Deductions</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="pay-other-ded" min="0" step="100" type="number" defaultValue="2500"/>
</div>
</div>
</div>
<div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Net Take-Home &amp; Daily Net</span>
<div className="mt-space-2xs mb-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Net Monthly In-Hand:</span>
<div className="font-numerical-display text-numerical-display text-primary" id="pay-result-net">₹56,000.00</div>
</div>
<div className="space-y-space-xs">
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Net Daily Take-Home (26d):</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="pay-result-daily-net">₹2,153.85 / day</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Total Deductions:</span>
<span className="font-data-mono text-data-mono font-semibold text-error" id="pay-result-deductions">-₹19,000.00</span>
</div>
</div>
{/*  Visual breakdown bar  */}
<div className="mt-space-md">
<div className="flex justify-between text-xs text-on-surface-variant mb-1">
<span>Take-home: <b id="pay-bar-pct">74.7%</b></span>
<span>Deductions: <b id="pay-bar-ded-pct">25.3%</b></span>
</div>
<div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden flex">
<div className="bg-primary h-full transition-all duration-300" id="pay-bar-net-fill" style={{width: "74.7%"}}></div>
<div className="bg-error h-full transition-all duration-300" id="pay-bar-ded-fill" style={{width: "25.3%"}}></div>
</div>
</div>
</div>
<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-highest/60">
<p className="font-data-mono text-xs text-on-surface">Calculated pre &amp; post statutory withholdings</p>
</div>
</div>
</div>
</div>
{/*  TAB 10: Daily Wage -> Hourly Rate  */}
<div className="tab-panel hidden" id="tab-daily-to-hourly">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<div className="lg:col-span-7 space-y-space-md">
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="d2h-daily">Daily Wage</label>
<div className="relative flex items-center">
<span className="curr-symbol-marker absolute left-3 font-data-mono text-on-surface-variant text-base">₹</span>
<input className="w-full pl-9 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="d2h-daily" min="0" step="50" type="number" defaultValue="2400"/>
</div>
</div>
<div>
<label className="block font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant mb-space-2xs" htmlFor="d2h-hours">Daily Shift Length (Hours)</label>
<input className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-low font-data-mono text-data-mono text-on-surface" id="d2h-hours" max="24" min="1" step="0.5" type="number" defaultValue="8"/>
</div>
</div>
<div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Granular Time Rate</span>
<div className="mt-space-2xs mb-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Effective Hourly Wage:</span>
<div className="font-numerical-display text-numerical-display text-primary" id="d2h-result-hourly">₹300.00</div>
</div>
<div className="space-y-space-xs">
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Per Minute Rate:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="d2h-result-minute">₹5.00 / min</span>
</div>
<div className="flex justify-between items-center py-1 bg-surface-container-lowest/70 px-space-sm rounded">
<span className="font-body-sm text-body-sm text-on-surface-variant">Per Second Rate:</span>
<span className="font-data-mono text-data-mono font-semibold text-on-surface" id="d2h-result-second">₹0.083 / sec</span>
</div>
</div>
</div>
<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-highest/60">
<p className="font-data-mono text-xs text-on-surface" id="d2h-formula-string">2,400 ÷ 8 hours = ₹300.00 / hr</p>
</div>
</div>
</div>
</div>
</div>
{/*  HISTORY DRAWER (Collapsible)  */}
<div className="hidden mt-space-lg pt-space-md bg-surface-container-low/80 rounded-xl p-space-md" id="history-drawer">
<div className="flex items-center justify-between pb-space-xs mb-space-xs">
<h2 className="font-headline-md text-headline-md text-base text-on-surface flex items-center gap-space-2xs">
<span className="material-symbols-outlined text-primary text-[18px]">history</span> Local Calculation Audit Log
            </h2>
<div className="flex items-center gap-space-2xs">
<button className="px-space-xs py-1 rounded bg-surface-container-lowest hover:bg-surface-container font-body-sm text-xs font-semibold text-on-surface" id="export-history-csv" type="button">Export CSV</button>
<button className="px-space-xs py-1 rounded bg-surface-container-lowest hover:bg-surface-container font-body-sm text-xs font-semibold text-error" id="clear-history-btn" type="button">Clear</button>
</div>
</div>
<div className="space-y-space-2xs max-h-48 overflow-y-auto font-data-mono text-xs text-on-surface" id="history-list">
{/*  Entries injected via JS  */}
<p className="text-on-surface-variant italic py-2">No calculations recorded in this browser session yet.</p>
</div>
</div>
</div>
</div>
</section>
{/*  FEATURED SNIPPET & COMPARATIVE DEFINITIONS  */}
<section className="w-full py-space-xl bg-surface-container-low">
<div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-xl">
{/*  AI Direct Overview Card  */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md">
<div className="inline-flex items-center gap-space-xs px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase mb-space-xs">
<span className="material-symbols-outlined text-[14px]">psychology</span> Concise Statutory Definition
        </div>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface font-bold tracking-tight mb-space-xs">
          What is a Daily Wage?
        </h2>
<p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
          A <strong>daily wage</strong> is the monetary compensation legally accrued by an employee or contractor for rendering exactly one statutory working day of labor. For salaried employees, it is mathematically derived by apportioning gross monthly pay across an agreed statutory divisor (standardly <strong>26 days</strong> for 6-day workweeks or <strong>21.67 days</strong> for 5-day workweeks). For hourly and gig personnel, it represents the base hourly pay rate multiplied by standard shift duration.
        </p>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-lg">
<div className="p-space-md rounded-lg bg-surface-container-low">
<span className="font-label-caps text-label-caps uppercase font-semibold text-primary">Core Formula 1</span>
<p className="font-data-mono text-sm font-bold text-on-surface mt-1">Daily Wage = Monthly Salary ÷ Working Days</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Used for full-time payroll, loss of pay deductions, and mid-month pro-rata additions.</p>
</div>
<div className="p-space-md rounded-lg bg-surface-container-low">
<span className="font-label-caps text-label-caps uppercase font-semibold text-primary">Core Formula 2</span>
<p className="font-data-mono text-sm font-bold text-on-surface mt-1">Daily Wage = Hourly Rate × Shift Hours</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Applied for non-exempt hourly employees under US FLSA, UK Fair Pay, and Australian Awards.</p>
</div>
<div className="p-space-md rounded-lg bg-surface-container-low">
<span className="font-label-caps text-label-caps uppercase font-semibold text-primary">Core Formula 3</span>
<p className="font-data-mono text-sm font-bold text-on-surface mt-1">Hourly Rate = Daily Wage ÷ Shift Hours</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Vital baseline to determine statutory overtime multipliers (1.5x / 2.0x).</p>
</div>
</div>
</div>
{/*  Comparative Matrix  */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md overflow-x-auto">
<h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-space-sm">
          Comparative Matrix: Compensation Paradigms
        </h3>
<table className="w-full text-left font-body-sm text-body-sm text-on-surface">
<thead>
<tr className="bg-surface-container text-on-surface font-semibold">
<th className="p-space-sm rounded-l-lg">Paradigm</th>
<th className="p-space-sm">Primary Use Case</th>
<th className="p-space-sm">Statutory Basis</th>
<th className="p-space-sm">Overtime Eligibility</th>
<th className="p-space-sm rounded-r-lg">Tax Withholding Method</th>
</tr>
</thead>
<tbody className="divide-y-0">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-space-sm font-bold text-primary">Daily Wage</td>
<td className="p-space-sm">Casual labor, contractor day-rates, pro-rated payroll</td>
<td className="p-space-sm">Per day worked (26d / 21.67d)</td>
<td className="p-space-sm">Calculated on per-hour breakdown</td>
<td className="p-space-sm">Standard TDS / PAYE / W-2</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-space-sm font-bold text-primary">Hourly Wage</td>
<td className="p-space-sm">Retail, logistics, hospitality, non-exempt staff</td>
<td className="p-space-sm">Actual clocked hours</td>
<td className="p-space-sm">Mandatory &gt; 40h/week (1.5x FLSA)</td>
<td className="p-space-sm">Hourly payroll withholding</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-space-sm font-bold text-primary">Monthly Salary</td>
<td className="p-space-sm">Corporate, salaried managers, executive staff</td>
<td className="p-space-sm">Annual contractual salary ÷ 12</td>
<td className="p-space-sm">Generally exempt</td>
<td className="p-space-sm">Monthly progressive tax brackets</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-space-sm font-bold text-primary">Contractor Day Rate</td>
<td className="p-space-sm">Freelance software engineers, specialized consultants</td>
<td className="p-space-sm">B2B Service agreements</td>
<td className="p-space-sm">Governed by SOW (Usually flat)</td>
<td className="p-space-sm">Self-employment tax / Form 1099</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
{/*  WORKED REAL-WORLD EXAMPLES  */}
<section className="w-full py-space-xl">
<div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
<div className="mb-space-lg">
<span className="font-label-caps text-label-caps uppercase text-primary font-bold">Standard Benchmarks</span>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface font-bold tracking-tight">
          Worked Real-World Examples
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant">
          See how diverse salary slabs translate across standard 26-day, 22-day, and 30-day corporate conventions.
        </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
{/*  Example 1  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-space-2xs">
<span className="font-headline-md text-headline-md text-primary font-bold">₹30,000 / mo</span>
<span className="px-space-xs py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant uppercase">Junior Grade</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Standard retail / junior corporate executive benchmark.</p>
<div className="space-y-1 text-xs font-data-mono bg-surface-container-low p-space-xs rounded">
<div className="flex justify-between"><span>26 Working Days:</span><b className="text-on-surface">₹1,153.85 / day</b></div>
<div className="flex justify-between"><span>30 Calendar Days:</span><b className="text-on-surface">₹1,000.00 / day</b></div>
<div className="flex justify-between"><span>Hourly (8h, 26d):</span><b className="text-on-surface">₹144.23 / hr</b></div>
</div>
</div>
{/*  Example 2  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-space-2xs">
<span className="font-headline-md text-headline-md text-primary font-bold">₹50,000 / mo</span>
<span className="px-space-xs py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant uppercase">Mid-Level</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Software developer or senior accountant compensation.</p>
<div className="space-y-1 text-xs font-data-mono bg-surface-container-low p-space-xs rounded">
<div className="flex justify-between"><span>26 Working Days:</span><b className="text-on-surface">₹1,923.08 / day</b></div>
<div className="flex justify-between"><span>22 Working Days (5-day):</span><b className="text-on-surface">₹2,272.73 / day</b></div>
<div className="flex justify-between"><span>Hourly (8h, 26d):</span><b className="text-on-surface">₹240.38 / hr</b></div>
</div>
</div>
{/*  Example 3  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-space-2xs">
<span className="font-headline-md text-headline-md text-primary font-bold">₹75,000 / mo</span>
<span className="px-space-xs py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant uppercase">Team Lead</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Project management or lead engineering specialist.</p>
<div className="space-y-1 text-xs font-data-mono bg-surface-container-low p-space-xs rounded">
<div className="flex justify-between"><span>26 Working Days:</span><b className="text-on-surface">₹2,884.62 / day</b></div>
<div className="flex justify-between"><span>21.67 Days (US Std):</span><b className="text-on-surface">₹3,460.99 / day</b></div>
<div className="flex justify-between"><span>Hourly (8h, 26d):</span><b className="text-on-surface">₹360.58 / hr</b></div>
</div>
</div>
{/*  Example 4  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-space-2xs">
<span className="font-headline-md text-headline-md text-primary font-bold">₹100,000 / mo</span>
<span className="px-space-xs py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant uppercase">Senior Manager</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Senior engineering or departmental operations director.</p>
<div className="space-y-1 text-xs font-data-mono bg-surface-container-low p-space-xs rounded">
<div className="flex justify-between"><span>26 Working Days:</span><b className="text-on-surface">₹3,846.15 / day</b></div>
<div className="flex justify-between"><span>22 Working Days:</span><b className="text-on-surface">₹4,545.45 / day</b></div>
<div className="flex justify-between"><span>Hourly (8h, 26d):</span><b className="text-on-surface">₹480.77 / hr</b></div>
</div>
</div>
{/*  Example 5  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-space-2xs">
<span className="font-headline-md text-headline-md text-primary font-bold">$25.00 / hr</span>
<span className="px-space-xs py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant uppercase">US FLSA Non-Exempt</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">US manufacturing or logistics hourly technician.</p>
<div className="space-y-1 text-xs font-data-mono bg-surface-container-low p-space-xs rounded">
<div className="flex justify-between"><span>Daily (8 Hours):</span><b className="text-on-surface">$200.00 / day</b></div>
<div className="flex justify-between"><span>Weekly (40 Hours):</span><b className="text-on-surface">$1,000.00 / wk</b></div>
<div className="flex justify-between"><span>Monthly (21.67d):</span><b className="text-on-surface">$4,334.00 / mo</b></div>
</div>
</div>
{/*  Example 6  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-space-2xs">
<span className="font-headline-md text-headline-md text-primary font-bold">AED 15,000 / mo</span>
<span className="px-space-xs py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant uppercase">UAE MoHRE</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Expatriate commercial officer in Dubai / Abu Dhabi.</p>
<div className="space-y-1 text-xs font-data-mono bg-surface-container-low p-space-xs rounded">
<div className="flex justify-between"><span>30-Day Law Basis:</span><b className="text-on-surface">AED 500.00 / day</b></div>
<div className="flex justify-between"><span>Hourly (8h):</span><b className="text-on-surface">AED 62.50 / hr</b></div>
<div className="flex justify-between"><span>Annual Gross:</span><b className="text-on-surface">AED 180,000.00</b></div>
</div>
</div>
</div>
</div>
</section>
{/*  MASTER SALARY TO DAILY WAGE LOOKUP TABLE  */}
<section className="w-full py-space-2xl bg-surface-container-low/60 border-y border-surface-container">
  <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-lg">
    
    {/* Section Header */}
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
      <div className="space-y-1 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px]">table_chart</span>
          <span>Master Reference Benchmark Matrix</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface font-bold tracking-tight">
          Salary to Daily Wage Master Lookup Table
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Precomputed daily wages from 10,000 to 500,000 across 26-day standard, 22-day (5-day week), 21.67-day (US/UK FLSA), and 30-day calendar divisors. Click <strong className="text-primary font-semibold">Load in Calc</strong> to compute any slab instantly.
        </p>
      </div>

      {/* Filter & Counter Card */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-xs">
        <div className="relative flex-1 sm:w-72">
          <div className="flex items-center px-space-sm py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-primary text-[20px] mr-2">search</span>
            <input 
              className="bg-transparent border-none outline-none font-body-sm text-body-sm w-full text-on-surface placeholder:text-outline" 
              id="table-filter-input" 
              placeholder="Search salary (e.g. 50000)..." 
              type="text"
            />
          </div>
        </div>
        <div className="px-3 py-2 rounded-xl bg-surface-container text-on-surface-variant text-xs font-data-mono font-medium flex items-center justify-center shrink-0" id="table-slab-count">
          23 Slabs Active
        </div>
      </div>
    </div>

    {/* Quick Filter Chips */}
    <div className="flex items-center flex-wrap gap-2 pt-1">
      <span className="text-xs font-semibold text-on-surface-variant mr-1 flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">tune</span> Quick Filters:
      </span>
      <button 
        type="button" 
        onClick={() => { (window as any).filterMasterTablePreset?.(''); }} 
        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-container hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
      >
        All Slabs
      </button>
      {['25000', '50000', '75000', '100000', '150000', '200000', '500000'].map((slab) => (
        <button 
          key={slab}
          type="button" 
          onClick={() => { (window as any).filterMasterTablePreset?.(slab); }} 
          className="px-2.5 py-1 rounded-lg text-xs font-data-mono font-medium bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
        >
          {Number(slab) >= 1000 ? `${Number(slab)/1000}k` : slab}
        </button>
      ))}
    </div>

    {/* Table Container Card */}
    <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-sm text-body-sm text-on-surface" id="master-salary-table">
          <thead>
            <tr className="bg-surface-container/70 border-b border-surface-container-high font-semibold text-xs text-on-surface-variant uppercase tracking-wider">
              <th className="p-space-md">Monthly Salary</th>
              <th className="p-space-md bg-primary/10 text-primary border-x border-primary/10">
                <div className="flex items-center gap-1.5">
                  <span>26-Day Standard</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-on-primary">Standard</span>
                </div>
              </th>
              <th className="p-space-md">22-Day Basis <span className="text-[10px] font-normal lowercase">(5d / wk)</span></th>
              <th className="p-space-md">21.67-Day Basis <span className="text-[10px] font-normal lowercase">(US / UK)</span></th>
              <th className="p-space-md">30-Day Basis <span className="text-[10px] font-normal lowercase">(Calendar)</span></th>
              <th className="p-space-md text-right">Instant Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container/40" id="master-table-body">
            {/* Populated dynamically with reactive load buttons */}
          </tbody>
        </table>
      </div>

      {/* Table Footer Insight Bar */}
      <div className="px-space-md py-space-sm bg-surface-container-low/50 border-t border-surface-container-high/60 flex flex-col sm:flex-row items-center justify-between gap-space-xs text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary">info</span>
          <span>Highlighted 26-Day column reflects statutory standard in India, Middle East, and 6-day payroll operations.</span>
        </div>
        <div className="flex items-center gap-1 font-data-mono font-medium">
          <span>Formula: Daily = Monthly ÷ Days</span>
        </div>
      </div>
    </div>

  </div>
</section>
{/*  LONG-TAIL SEO DEEP-DIVE EDITORIAL  */}
<section className="w-full py-space-2xl">
<div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-2xl">
<div>
<span className="font-label-caps text-label-caps uppercase text-primary font-bold">Payroll Engineering &amp; Labor Law</span>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface font-bold tracking-tight mb-space-sm">
          Comprehensive Guide: Daily Wage Apportionment &amp; Compliance
        </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">
          In-depth statutory guidelines on calculating daily wages across jurisdictional frameworks, understanding loss-of-pay deductions, overtime formulas, and commercial contractor billing.
        </p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
{/*  Topic 1  */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs">
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary">balance</span> 1. The 26-Day Rule vs. 30-Day Rule Explained
          </h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            One of the most persistent discrepancies in payroll compliance lies in selecting the month divisor. Under traditional Indian labor jurisprudence (affirmed in the Supreme Court ruling <em>Digvijay Woollen Mills Ltd.</em>), an employee working in a 6-day week establishment receives 4 mandatory weekly days off (Sundays). Thus, the effective earning cycle is 30 minus 4 = <strong>26 working days</strong>.
          </p>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Conversely, modern multinationals adopting a 5-day work week have an average of 8 to 9 rest days per month, yielding <strong>21.67 or 22 actual working days</strong>. Using a 30-day divisor for leave deduction unfairly under-deducts the value of an absent working day, whereas using 26 days represents exact productivity parity.
          </p>
</div>
{/*  Topic 2  */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs">
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary">timelapse</span> 2. Statutory Overtime Calculation Rules
          </h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Overtime cannot legally be arbitrary. In the United States, the Fair Labor Standards Act (FLSA) mandates that non-exempt workers receive <strong>1.5× their regular rate of pay</strong> for hours in excess of 40 in a single workweek.
          </p>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            In India, Section 59 of the Factories Act 1948 and Chapter IV of the Occupational Safety, Health and Working Conditions Code dictate that work exceeding 9 hours in a day or 48 hours in a week commands <strong>double the ordinary rate of wages (2.0×)</strong>, computed as: (Basic Wage + Dearness Allowance) ÷ Shift Hours × 2.0.
          </p>
</div>
{/*  Topic 3  */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs">
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary">event_busy</span> 3. Loss of Pay (LOP) &amp; Salary Pro-Ration
          </h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            When an employee exhausts casual, sick, or earned leave credits, unapproved absenteeism results in Loss of Pay (LOP). The mathematical vulnerability arises when HR systems mix divisors.
          </p>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            If an employee earning ₹60,000 takes 2 days LOP in February (28 days) versus March (31 days), dynamic month divisors yield fluctuating daily penalties. Best practice compliance dictates formal codification in the employee handbook of either fixed 26-day basis or exact working-day month apportionment.
          </p>
</div>
{/*  Topic 4  */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs">
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary">engineering</span> 4. Freelancers &amp; Contractor Day-Rate Models
          </h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Salaried staff often fail to comprehend why independent contractor day rates are 2× to 3× their salaried equivalent. Salaried positions offer employer-funded healthcare, paid vacation, social security contributions, paid holidays, and sick days.
          </p>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            A sustainable freelancer day rate must incorporate roughly 25-30% bench time (non-billable sales, invoicing, learning) plus self-employment taxes. As calculated in our Tab 7, a desired ₹120,000 take-home necessitates a day rate of ₹10,300+ across 16 billable days.
          </p>
</div>
</div>
</div>
</section>
{/*  COMPREHENSIVE 50 FAQ ACCORDION GRID  */}
<section className="w-full py-space-xl bg-surface-container-low">
<div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
<div className="text-center max-w-3xl mx-auto mb-space-xl">
<span className="font-label-caps text-label-caps uppercase text-primary font-bold">Frequently Asked Questions</span>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface font-bold tracking-tight">
          50 Essential Daily Wage &amp; Payroll Answers
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
          Comprehensive statutory, mathematical, and operational answers for HR managers, payroll specialists, contractors, and employees.
        </p>
</div>
{/*  FAQ Search / Filter Bar  */}
<div className="max-w-xl mx-auto mb-space-lg">
<div className="flex items-center px-space-sm py-space-xs rounded-xl bg-surface-container-lowest shadow-sm">
<span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-2">search</span>
<input className="bg-transparent border-none outline-none font-body-sm text-body-sm w-full text-on-surface" id="faq-search-input" value={faqSearch} onChange={(e) => setFaqSearch(e.target.value)} placeholder="Search across all 50 questions (e.g. overtime, 26 days, taxes)..." type="text"/>
</div>
</div>
{/*  50 FAQs Container (Accordion layout)  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm" id="faq-accordion-container">
  {faqData
    .filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase()))
    .map((item, idx) => (
      <div key={idx} className="faq-item bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all">
        <button 
          type="button" 
          className="faq-toggle w-full flex items-center justify-between text-left font-body-md text-body-md font-bold text-on-surface hover:text-primary transition-colors focus:outline-none"
          onClick={() => toggleFaq(idx)}
        >
          <span className="flex items-center gap-2">
            <span className="font-data-mono text-xs text-primary/70">#{idx + 1}</span>
            {item.q}
          </span>
          <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transform transition-transform duration-200 ${openFaqIndices.includes(idx) ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>
        {openFaqIndices.includes(idx) && (
          <div className="faq-answer mt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed pt-space-xs border-0">
            {item.a}
          </div>
        )}
      </div>
    ))}
  {faqData.filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase())).length === 0 && (
    <div className="col-span-1 md:col-span-2 text-center p-space-lg text-on-surface-variant italic">No FAQs matching "{faqSearch}".</div>
  )}
</div>
</div>
</section>
{/*  EEAT & EDITORIAL TRANSPARENCY SECTION  */}
<section className="w-full py-space-xl">
<div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
<div className="bg-surface-container-lowest rounded-xl p-space-lg lg:p-space-xl shadow-md border-0 space-y-space-md">
<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md pb-space-sm">
<div className="flex items-center gap-space-sm">
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[24px]">verified</span>
</div>
<div>
<p className="font-headline-md text-headline-md text-base text-on-surface font-bold">Editorial Transparency &amp; Compliance Authority</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Reviewed by Certified Payroll Specialists &amp; Labor Law Analysts</p>
</div>
</div>
<div className="text-right">
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Last Verified Audit</span>
<p className="font-data-mono text-data-mono font-semibold text-primary">January 2025 Edition</p>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
<div>
<h4 className="font-semibold text-on-surface mb-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-secondary">menu_book</span> Statutory References
            </h4>
<ul className="space-y-1 text-xs">
<li>• Indian Code on Wages (2019) &amp; Payment of Gratuity Act</li>
<li>• United States Fair Labor Standards Act (FLSA 29 U.S.C. § 201)</li>
<li>• UK Employment Rights Act 1996 &amp; Apportionment Act 1870</li>
<li>• UAE Federal Decree-Law No. 33 of 2021 (Labor Relations)</li>
<li>• Australian Fair Work Act 2009 (FW Act)</li>
</ul>
</div>
<div>
<h4 className="font-semibold text-on-surface mb-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-secondary">memory</span> Execution Sandbox
            </h4>
<p className="text-xs leading-relaxed">
              Every numerical operation computes exclusively client-side in your device's memory using IEEE 754 64-bit floating point arithmetic. Zero financial data, salary values, or location metrics are ever transmitted to any remote server.
            </p>
</div>
<div>
<h4 className="font-semibold text-on-surface mb-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-secondary">info</span> Legal Disclaimer
            </h4>
<p className="text-xs leading-relaxed">
              SolveItCalculator.com provides mathematical estimations for planning purposes. Official payroll disbursements must account for employer-specific collective bargaining agreements, state minimum wage variations, and local tax withholding schedules.
            </p>
</div>
</div>
</div>
</div>
</section>
{/*  INTERNAL LINKING MESH & RELATED TOOLS  */}
<section className="w-full py-space-xl bg-surface-container-low">
<div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
<div className="mb-space-md">
<span className="font-label-caps text-label-caps uppercase text-primary font-bold">Comprehensive Suite</span>
<h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
          Related Financial &amp; Payroll Computation Engines
        </h2>
</div>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
<a className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-shadow block" data-path="salary-calculator" href="#">
<div className="flex items-center gap-space-2xs text-primary mb-1">
<span className="material-symbols-outlined text-[18px]">payments</span>
<span className="font-body-sm text-body-sm font-bold text-on-surface">Salary Calculator</span>
</div>
<p className="font-body-sm text-xs text-on-surface-variant">Annual CTC to net take-home breakdown.</p>
</a>
<a className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-shadow block" data-path="hourly-wage-calculator" href="#">
<div className="flex items-center gap-space-2xs text-primary mb-1">
<span className="material-symbols-outlined text-[18px]">alarm</span>
<span className="font-body-sm text-body-sm font-bold text-on-surface">Hourly Wage Calc</span>
</div>
<p className="font-body-sm text-xs text-on-surface-variant">Shift rates and fractional hour tracking.</p>
</a>
<a className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-shadow block" data-path="overtime-calculator" href="#">
<div className="flex items-center gap-space-2xs text-primary mb-1">
<span className="material-symbols-outlined text-[18px]">work_history</span>
<span className="font-body-sm text-body-sm font-bold text-on-surface">Overtime Engine</span>
</div>
<p className="font-body-sm text-xs text-on-surface-variant">Time-and-a-half &amp; double time multipliers.</p>
</a>
<a className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-shadow block" data-path="leave-deduction-calculator" href="#">
<div className="flex items-center gap-space-2xs text-primary mb-1">
<span className="material-symbols-outlined text-[18px]">person_off</span>
<span className="font-body-sm text-body-sm font-bold text-on-surface">LOP Deduction</span>
</div>
<p className="font-body-sm text-xs text-on-surface-variant">Unpaid leave pro-rata salary impact.</p>
</a>
<a className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-shadow block" data-path="freelance-rate-calculator" href="#">
<div className="flex items-center gap-space-2xs text-primary mb-1">
<span className="material-symbols-outlined text-[18px]">terminal</span>
<span className="font-body-sm text-body-sm font-bold text-on-surface">Freelance Rate</span>
</div>
<p className="font-body-sm text-xs text-on-surface-variant">Day rate &amp; overhead recovery models.</p>
</a>
<a className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-shadow block" data-path="contractor-cost-calculator" href="#">
<div className="flex items-center gap-space-2xs text-primary mb-1">
<span className="material-symbols-outlined text-[18px]">group_work</span>
<span className="font-body-sm text-body-sm font-bold text-on-surface">Contractor Budget</span>
</div>
<p className="font-body-sm text-xs text-on-surface-variant">Multi-worker crew labor estimations.</p>
</a>
<a className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-shadow block" data-path="gratuity-calculator" href="#">
<div className="flex items-center gap-space-2xs text-primary mb-1">
<span className="material-symbols-outlined text-[18px]">savings</span>
<span className="font-body-sm text-body-sm font-bold text-on-surface">Gratuity Calculator</span>
</div>
<p className="font-body-sm text-xs text-on-surface-variant">Statutory 15/26 retirement calculations.</p>
</a>
<a className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-shadow block" data-path="tds-tax-calculator" href="#">
<div className="flex items-center gap-space-2xs text-primary mb-1">
<span className="material-symbols-outlined text-[18px]">receipt_long</span>
<span className="font-body-sm text-body-sm font-bold text-on-surface">Payroll TDS Calc</span>
</div>
<p className="font-body-sm text-xs text-on-surface-variant">Tax withholding across income slabs.</p>
</a>
</div>
</div>
</section>
{/*  JAVASCRIPT CONTROLLER FOR COMPLETE ENGINE INTERACTIVITY  */}

</div></main>
    </>
  );
}