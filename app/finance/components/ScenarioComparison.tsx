'use client';

import React, { useState } from 'react';
import { formatCurrencyAmount } from '../financeData';

interface ScenarioComparisonProps {
  selectedCurrency: string;
}

type ScenarioType = '401k-vs-roth' | 'rent-vs-buy' | 'debt-vs-invest' | 'lump-vs-dca' | 'extra-mortgage-vs-invest';

export default function ScenarioComparison({ selectedCurrency }: ScenarioComparisonProps) {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('401k-vs-roth');
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);

  // Scenario 1: 401(k) vs Roth assumptions
  const [annualContribution, setAnnualContribution] = useState<number>(7000);
  const [currentTaxRate, setCurrentTaxRate] = useState<number>(24);
  const [retirementTaxRate, setRetirementTaxRate] = useState<number>(18);
  const [yearsInvested, setYearsInvested] = useState<number>(25);
  const [annualReturn, setAnnualReturn] = useState<number>(7);

  // Scenario 2: Rent vs Buy assumptions
  const [homePrice, setHomePrice] = useState<number>(400000);
  const [mortgageRate, setMortgageRate] = useState<number>(6.5);
  const [monthlyRent, setMonthlyRent] = useState<number>(2000);
  const [homeAppreciation, setHomeAppreciation] = useState<number>(3.5);
  const [rentYears, setRentYears] = useState<number>(10);

  // Scenario 3: Pay Off Debt vs Invest assumptions
  const [debtBalance, setDebtBalance] = useState<number>(15000);
  const [debtInterestRate, setDebtInterestRate] = useState<number>(18.5);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(600);
  const [investReturn, setInvestReturn] = useState<number>(8.0);

  // Calculations for 401(k) vs Roth
  const r = annualReturn / 100;
  const n = yearsInvested;
  // Future value of annuity: PMT * (((1 + r)^n - 1) / r)
  const fvFactor = ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const tradPreTaxBalance = annualContribution * fvFactor;
  // Traditional net spendable after retirement tax
  const tradSpendable = tradPreTaxBalance * (1 - retirementTaxRate / 100);
  // Roth post-tax: user puts in annualContribution after paying current tax
  // Or assuming same pre-tax budget:
  const rothContribution = annualContribution * (1 - currentTaxRate / 100);
  const rothSpendable = rothContribution * fvFactor;
  const taxSavedAnnually = annualContribution * (currentTaxRate / 100);

  // Calculations for Rent vs Buy (simplified 10-year comparative equity vs portfolio)
  const downPayment = homePrice * 0.20;
  const loanAmt = homePrice * 0.80;
  const monthlyRate = mortgageRate / 100 / 12;
  const nMonths = 30 * 12;
  const monthlyPI = (loanAmt * (monthlyRate * Math.pow(1 + monthlyRate, nMonths))) / (Math.pow(1 + monthlyRate, nMonths) - 1);
  const estMonthlyOwnership = monthlyPI + (homePrice * 0.012) / 12 + (homePrice * 0.005) / 12; // PI + tax + maintenance
  const homeValueAtHorizon = homePrice * Math.pow(1 + homeAppreciation / 100, rentYears);
  const estRemainingLoan = loanAmt * 0.82; // roughly 82% balance after 10 yrs of 30-yr
  const buyerNetEquity = homeValueAtHorizon - estRemainingLoan;
  
  // Renter: invests down payment + difference in monthly cost if renting is cheaper
  const monthlySavings = Math.max(0, estMonthlyOwnership - monthlyRent);
  const renterStockHorizon = downPayment * Math.pow(1.07, rentYears) + monthlySavings * (((Math.pow(1 + 0.07/12, rentYears * 12) - 1) / (0.07/12)));

  // Calculations for Debt vs Invest
  // Paying $600/mo towards $15,000 debt at 18.5%
  const monthlyDebtRate = debtInterestRate / 100 / 12;
  const payoffMonths = Math.log(monthlyBudget / (monthlyBudget - debtBalance * monthlyDebtRate)) / Math.log(1 + monthlyDebtRate);
  const totalPaidDebt = monthlyBudget * payoffMonths;
  const interestSavedByPaying = totalPaidDebt - debtBalance;

  return (
    <section id="scenario-comparison" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
            <span>Comparative Scenario Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Compare Financial Scenarios
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
            See how different assumptions can change the result before making a financial decision.
          </p>
        </div>

        {/* Assumptions Toggle */}
        <button
          type="button"
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface text-xs font-semibold self-start md:self-auto transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">tune</span>
          <span>{showAssumptions ? 'Hide Assumptions' : 'Change Assumptions'}</span>
        </button>
      </div>

      {/* Scenario Tabs */}
      <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-2xl overflow-x-auto mb-6">
        {[
          { id: '401k-vs-roth', label: '401(k) vs. Roth' },
          { id: 'rent-vs-buy', label: 'Rent vs. Buy' },
          { id: 'debt-vs-invest', label: 'Pay Off Debt vs. Invest' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveScenario(tab.id as ScenarioType)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeScenario === tab.id
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Assumptions Drawer */}
      {showAssumptions && (
        <div className="p-4 sm:p-5 mb-6 rounded-2xl bg-surface-container-low border border-primary/20 text-xs sm:text-sm animate-fadeIn">
          <h3 className="font-bold text-on-surface mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">settings</span>
            <span>Adjust Calculation Assumptions</span>
          </h3>

          {activeScenario === '401k-vs-roth' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Annual Contribution ($)</label>
                <input
                  type="number"
                  value={annualContribution}
                  onChange={(e) => setAnnualContribution(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Current Tax Rate (%)</label>
                <input
                  type="number"
                  value={currentTaxRate}
                  onChange={(e) => setCurrentTaxRate(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Retirement Tax Rate (%)</label>
                <input
                  type="number"
                  value={retirementTaxRate}
                  onChange={(e) => setRetirementTaxRate(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Years Invested</label>
                <input
                  type="number"
                  value={yearsInvested}
                  onChange={(e) => setYearsInvested(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Annual Return (%)</label>
                <input
                  type="number"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
            </div>
          )}

          {activeScenario === 'rent-vs-buy' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Home Price ($)</label>
                <input
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Mortgage Rate (%)</label>
                <input
                  type="number"
                  value={mortgageRate}
                  onChange={(e) => setMortgageRate(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Monthly Rent ($)</label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Home Appreciation (%)</label>
                <input
                  type="number"
                  value={homeAppreciation}
                  onChange={(e) => setHomeAppreciation(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Comparison Period (Yrs)</label>
                <input
                  type="number"
                  value={rentYears}
                  onChange={(e) => setRentYears(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
            </div>
          )}

          {activeScenario === 'debt-vs-invest' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Debt Balance ($)</label>
                <input
                  type="number"
                  value={debtBalance}
                  onChange={(e) => setDebtBalance(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Debt Interest Rate (%)</label>
                <input
                  type="number"
                  value={debtInterestRate}
                  onChange={(e) => setDebtInterestRate(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Monthly Budget ($)</label>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Investment Return (%)</label>
                <input
                  type="number"
                  value={investReturn}
                  onChange={(e) => setInvestReturn(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 font-mono"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scenario Output Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Scenario A */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Scenario A</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">Pre-Tax</span>
            </div>
            {activeScenario === '401k-vs-roth' && (
              <>
                <h3 className="font-bold text-lg text-on-surface">Traditional 401(k)</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Contributions are pre-tax, reducing current taxable income. Taxes are paid upon withdrawal in retirement.
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Annual Contribution:</span>
                    <span className="font-mono font-bold text-on-surface">{formatCurrencyAmount(annualContribution, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Annual Tax Saved:</span>
                    <span className="font-mono font-bold text-primary">+{formatCurrencyAmount(taxSavedAnnually, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Pre-Tax Balance ({yearsInvested} yrs):</span>
                    <span className="font-mono font-bold text-on-surface">{formatCurrencyAmount(tradPreTaxBalance, selectedCurrency)}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-surface-container-low">
                  <span className="text-[11px] uppercase font-semibold text-outline block">Est. Spendable in Retirement:</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-on-surface mt-0.5 block">
                    {formatCurrencyAmount(tradSpendable, selectedCurrency)}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Assumes {retirementTaxRate}% retirement tax bracket</span>
                </div>
              </>
            )}

            {activeScenario === 'rent-vs-buy' && (
              <>
                <h3 className="font-bold text-lg text-on-surface">Buying a Home</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Builds home equity through principal amortization and historical real estate appreciation.
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Down Payment (20%):</span>
                    <span className="font-mono font-bold text-on-surface">{formatCurrencyAmount(downPayment, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Est. Monthly PITI:</span>
                    <span className="font-mono font-bold text-on-surface">{formatCurrencyAmount(estMonthlyOwnership, selectedCurrency)}/mo</span>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-surface-container-low">
                  <span className="text-[11px] uppercase font-semibold text-outline block">Est. Net Equity after {rentYears} yrs:</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-on-surface mt-0.5 block">
                    {formatCurrencyAmount(buyerNetEquity, selectedCurrency)}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Home value minus remaining loan balance</span>
                </div>
              </>
            )}

            {activeScenario === 'debt-vs-invest' && (
              <>
                <h3 className="font-bold text-lg text-on-surface">Accelerated Debt Payoff</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Eliminates high-interest debt early, locking in a guaranteed risk-free return equal to the interest rate.
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Debt Balance:</span>
                    <span className="font-mono font-bold text-on-surface">{formatCurrencyAmount(debtBalance, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Payoff Timeline:</span>
                    <span className="font-mono font-bold text-on-surface">{Math.ceil(payoffMonths)} months</span>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-surface-container-low">
                  <span className="text-[11px] uppercase font-semibold text-outline block">Total Interest Avoided:</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-primary mt-0.5 block">
                    {formatCurrencyAmount(interestSavedByPaying, selectedCurrency)}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Guaranteed saving vs. minimum balance drag</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Quantitative Delta & Differences under Assumptions */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between text-center">
          <div>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mx-auto mb-2">
              VS
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-on-surface">Difference Under These Assumptions</h3>

            {activeScenario === '401k-vs-roth' && (
              <div className="mt-4 p-4 rounded-xl bg-surface-container-lowest shadow-xs text-left">
                <span className="text-xs font-semibold text-on-surface-variant block">Net Spendable Differential:</span>
                <span className="text-xl font-extrabold font-mono text-primary mt-1 block">
                  {formatCurrencyAmount(Math.abs(tradSpendable - rothSpendable), selectedCurrency)}
                </span>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  {currentTaxRate > retirementTaxRate
                    ? `Because your current tax rate (${currentTaxRate}%) is higher than your estimated retirement rate (${retirementTaxRate}%), taking the upfront tax deduction yields more spendable cash under these assumptions.`
                    : currentTaxRate < retirementTaxRate
                    ? `Because your retirement tax rate (${retirementTaxRate}%) is projected higher than your current rate (${currentTaxRate}%), paying taxes upfront via Roth yields higher spendable cash under these assumptions.`
                    : 'When current and retirement tax rates are identical, Traditional and Roth produce mathematically equivalent spendable results (assuming identical returns and contribution equivalents).'}
                </p>
              </div>
            )}

            {activeScenario === 'rent-vs-buy' && (
              <div className="mt-4 p-4 rounded-xl bg-surface-container-lowest shadow-xs text-left">
                <span className="text-xs font-semibold text-on-surface-variant block">Net Asset Differential:</span>
                <span className="text-xl font-extrabold font-mono text-primary mt-1 block">
                  {formatCurrencyAmount(Math.abs(buyerNetEquity - renterStockHorizon), selectedCurrency)}
                </span>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Outcome depends strongly on actual local home appreciation ({homeAppreciation}%), stock market returns (7%), property tax rates, and ownership duration.
                </p>
              </div>
            )}

            {activeScenario === 'debt-vs-invest' && (
              <div className="mt-4 p-4 rounded-xl bg-surface-container-lowest shadow-xs text-left">
                <span className="text-xs font-semibold text-on-surface-variant block">Interest Rate vs. Expected Return:</span>
                <span className="text-xl font-extrabold font-mono text-primary mt-1 block">
                  {debtInterestRate}% vs. {investReturn}%
                </span>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Paying down debt carrying {debtInterestRate}% APR produces a guaranteed risk-free {debtInterestRate}% return, which exceeds the projected {investReturn}% expected variable market return.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 text-[11px] text-on-surface-variant bg-surface-container-lowest/60 p-2.5 rounded-lg border border-outline-variant/20">
            <span>Note: Illustrative scenario calculation under selected assumptions. Does not constitute personal financial or tax advice.</span>
          </div>
        </div>

        {/* Scenario B */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Scenario B</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-secondary/10 text-secondary font-semibold">Post-Tax</span>
            </div>
            {activeScenario === '401k-vs-roth' && (
              <>
                <h3 className="font-bold text-lg text-on-surface">Roth IRA / 401(k)</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Contributions are made with after-tax dollars. Qualified Roth withdrawals are generally tax-free under applicable rules.
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Post-Tax Contribution:</span>
                    <span className="font-mono font-bold text-on-surface">{formatCurrencyAmount(rothContribution, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Tax Paid Upfront:</span>
                    <span className="font-mono font-bold text-on-surface-variant">{formatCurrencyAmount(taxSavedAnnually, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Qualified Growth:</span>
                    <span className="font-mono font-bold text-secondary">Tax-free growth</span>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-surface-container-low">
                  <span className="text-[11px] uppercase font-semibold text-outline block">Est. Spendable in Retirement:</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-on-surface mt-0.5 block">
                    {formatCurrencyAmount(rothSpendable, selectedCurrency)}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Subject to qualified distribution requirements</span>
                </div>
              </>
            )}

            {activeScenario === 'rent-vs-buy' && (
              <>
                <h3 className="font-bold text-lg text-on-surface">Renting &amp; Investing Difference</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Keeps down payment capital liquid and invests monthly savings into a diversified portfolio.
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Invested Down Payment:</span>
                    <span className="font-mono font-bold text-on-surface">{formatCurrencyAmount(downPayment, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Monthly Rent:</span>
                    <span className="font-mono font-bold text-on-surface">{formatCurrencyAmount(monthlyRent, selectedCurrency)}/mo</span>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-surface-container-low">
                  <span className="text-[11px] uppercase font-semibold text-outline block">Est. Portfolio after {rentYears} yrs:</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-on-surface mt-0.5 block">
                    {formatCurrencyAmount(renterStockHorizon, selectedCurrency)}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Assumes 7% annual index return</span>
                </div>
              </>
            )}

            {activeScenario === 'debt-vs-invest' && (
              <>
                <h3 className="font-bold text-lg text-on-surface">Minimum Payment + Investing</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Pays minimum debt requirement and directs spare cash flow toward stock market investments.
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Expected Investment Return:</span>
                    <span className="font-mono font-bold text-on-surface">{investReturn}% / yr</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-on-surface-variant">Debt Interest Cost:</span>
                    <span className="font-mono font-bold text-rose-600">-{debtInterestRate}% APR</span>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-surface-container-low">
                  <span className="text-[11px] uppercase font-semibold text-outline block">Net Cost Drag:</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-rose-600 mt-0.5 block">
                    {(debtInterestRate - investReturn).toFixed(1)}% net drag
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Debt interest exceeds expected market gains</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
