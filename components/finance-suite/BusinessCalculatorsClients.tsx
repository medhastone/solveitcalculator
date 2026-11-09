'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  calculateMargin,
  calculateMarkup,
  calculateBreakEven,
  calculateProfitMargin,
} from '@/lib/finance-core/tax-payroll-business-engines';
import { DAMODARAN_SECTOR_MARGINS_2025 } from '@/lib/finance-core/tax-payroll-business-data';
import {
  formatMoney,
  SuiteSlider,
  VerifiedAuthorityBanner,
  RelatedCalculatorsGrid,
} from '@/components/calculator/FinanceSuitePrimitives';

// ============================================================================
// #45: MARGIN CALCULATOR ("GROSS MARGIN CALCULATOR")
// ============================================================================
export function MarginCalculatorClient() {
  const [mode, setMode] = useState<'cost_and_price' | 'cost_and_margin' | 'revenue_and_margin'>('cost_and_price');
  const [cost, setCost] = useState<number>(100);
  const [priceOrRevenue, setPriceOrRevenue] = useState<number>(120);
  const [targetMarginPct, setTargetMarginPct] = useState<number>(25);

  const res = useMemo(
    () =>
      calculateMargin({
        mode,
        cost,
        priceOrRevenue,
        targetMarginPct,
      }),
    [mode, cost, priceOrRevenue, targetMarginPct]
  );

  // Computed live example for 20% markup = 16.67% margin
  const example20Markup = calculateMargin({
    mode: 'cost_and_price',
    cost: 100,
    priceOrRevenue: 120,
    targetMarginPct: 0,
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface" htmlFor="margin-mode">
              Calculation Mode
            </label>
            <select
              id="margin-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as 'cost_and_price' | 'cost_and_margin' | 'revenue_and_margin')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
            >
              <option value="cost_and_price">1. Cost &amp; Selling Price → Gross Margin</option>
              <option value="cost_and_margin">2. Cost &amp; Target Margin % → Required Price</option>
              <option value="revenue_and_margin">3. Revenue &amp; Margin % → Cost &amp; Profit</option>
            </select>
          </div>

          {mode !== 'revenue_and_margin' && (
            <div className="space-y-2 pt-2 border-t border-outline-variant/40">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-on-surface" htmlFor="mg-cost">
                  Unit Cost / COGS ($)
                </label>
                <span className="font-mono font-bold text-primary">{formatMoney(cost, '$', 2)}</span>
              </div>
              <input
                id="mg-cost"
                type="number"
                min={0}
                step={5}
                value={cost}
                onChange={(e) => setCost(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          )}

          {mode !== 'cost_and_margin' && (
            <div className="space-y-2 pt-2 border-t border-outline-variant/40">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-on-surface" htmlFor="mg-price">
                  Selling Price / Revenue ($)
                </label>
                <span className="font-mono font-bold text-primary">{formatMoney(priceOrRevenue, '$', 2)}</span>
              </div>
              <input
                id="mg-price"
                type="number"
                min={0}
                step={5}
                value={priceOrRevenue}
                onChange={(e) => setPriceOrRevenue(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          )}

          {mode !== 'cost_and_price' && (
            <div className="space-y-2 pt-2 border-t border-outline-variant/40">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-on-surface" htmlFor="mg-target">
                  Target Gross Margin (%)
                </label>
                <span className="font-mono font-bold text-primary">{targetMarginPct}%</span>
              </div>
              <SuiteSlider
                ariaLabel="Target Gross Margin Percentage"
                min={1}
                max={90}
                step={0.5}
                value={targetMarginPct}
                onChange={setTargetMarginPct}
                minLabel="1%"
                midLabel="45%"
                maxLabel="90%"
              />
            </div>
          )}

          {/* Computed Proof Box: 20% Markup = 16.67% Margin */}
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50 text-xs space-y-1.5">
            <strong className="text-on-surface block">
              Computed Example: Why {example20Markup.markupPct.toFixed(0)}% Markup ={' '}
              {example20Markup.marginPct.toFixed(2)}% Gross Margin
            </strong>
            <p className="text-on-surface-variant leading-relaxed">
              An item costing <strong>{formatMoney(example20Markup.cost)}</strong> marked up by{' '}
              <strong>{example20Markup.markupPct.toFixed(0)}%</strong> sells for{' '}
              <strong>{formatMoney(example20Markup.price)}</strong>, generating{' '}
              <strong>{formatMoney(example20Markup.grossProfit)}</strong> profit. Divided by the{' '}
              {formatMoney(example20Markup.price)} selling price, gross margin is{' '}
              <strong>
                {formatMoney(example20Markup.grossProfit)} ÷ {formatMoney(example20Markup.price)} ={' '}
                {example20Markup.marginPct.toFixed(2)}%
              </strong>
              .
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">GROSS MARGIN</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {res.marginPct.toFixed(2)}%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">GROSS PROFIT</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatMoney(res.grossProfit, '$', 2)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">SELLING PRICE</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {formatMoney(res.price, '$', 2)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">EQUIVALENT MARKUP</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {res.markupPct.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pt-2 border-t border-outline-variant/40">
              <h3 className="text-sm font-bold text-on-surface mb-2">Margin vs. Markup Conversion Table ($100 Cost Base)</h3>
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-outline-variant/50 text-on-surface-variant font-sans">
                    <th className="py-2">Markup %</th>
                    <th className="py-2">Gross Margin %</th>
                    <th className="py-2 text-right">Cost</th>
                    <th className="py-2 text-right">Selling Price</th>
                    <th className="py-2 text-right">Gross Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {res.conversionTable.map((row) => (
                    <tr key={row.markupPct}>
                      <td className="py-2 font-bold text-on-surface">{row.markupPct.toFixed(2)}%</td>
                      <td className="py-2 font-bold text-primary">{row.marginPct.toFixed(2)}%</td>
                      <td className="py-2 text-right">{formatMoney(row.sampleCost, '$', 2)}</td>
                      <td className="py-2 text-right">{formatMoney(row.samplePrice, '$', 2)}</td>
                      <td className="py-2 text-right text-emerald-700 dark:text-emerald-400">
                        +{formatMoney(row.sampleProfit, '$', 2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'Markup Calculator',
            description: 'Calculate selling price from cost and markup % with bulk multi-item pricing.',
            href: '/finance/markup-calculator',
          },
          {
            title: 'Profit Margin Calculator',
            description: 'Analyze Gross, Operating (EBIT), EBITDA, and Net Profit margins with Damodaran benchmarks.',
            href: '/finance/profit-margin-calculator',
          },
          {
            title: 'Break-Even Calculator',
            description: 'Find the exact unit volume and revenue required to cover fixed and variable costs.',
            href: '/finance/break-even-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #46: MARKUP CALCULATOR (WITH BULK MULTI-ITEM PRICING TABLE)
// ============================================================================
interface BulkSkuRow {
  id: string;
  name: string;
  cost: number;
  markupPct: number;
}

export function MarkupCalculatorClient() {
  const [mode, setMode] = useState<'cost_and_markup' | 'cost_and_price'>('cost_and_markup');
  const [cost, setCost] = useState<number>(80);
  const [markupPct, setMarkupPct] = useState<number>(50);
  const [sellingPrice, setSellingPrice] = useState<number>(120);
  const [discountPct, setDiscountPct] = useState<number>(0);
  const [taxGstVatPct, setTaxGstVatPct] = useState<number>(0);

  const [bulkRows, setBulkRows] = useState<BulkSkuRow[]>([
    { id: '1', name: 'Item A (Standard SKU)', cost: 45, markupPct: 50 },
    { id: '2', name: 'Item B (Premium Tier)', cost: 120, markupPct: 65 },
    { id: '3', name: 'Item C (Accessory)', cost: 18, markupPct: 100 },
  ]);

  const res = useMemo(
    () =>
      calculateMarkup({
        mode,
        cost,
        markupPct,
        sellingPrice,
        discountPct,
        taxGstVatPct,
      }),
    [mode, cost, markupPct, sellingPrice, discountPct, taxGstVatPct]
  );

  const handleAddRow = () => {
    setBulkRows((prev) => [
      ...prev,
      { id: String(Date.now()), name: `SKU #${prev.length + 1}`, cost: 50, markupPct: 40 },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setBulkRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('cost_and_markup')}
              className={`py-2 px-3 rounded-xl text-xs font-bold cursor-pointer ${
                mode === 'cost_and_markup' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
              }`}
            >
              Cost + Markup %
            </button>
            <button
              type="button"
              onClick={() => setMode('cost_and_price')}
              className={`py-2 px-3 rounded-xl text-xs font-bold cursor-pointer ${
                mode === 'cost_and_price' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
              }`}
            >
              Cost + Selling Price
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <label className="text-xs font-bold text-on-surface" htmlFor="mk-cost">
              Unit Cost ($)
            </label>
            <input
              id="mk-cost"
              type="number"
              min={0}
              step={5}
              value={cost}
              onChange={(e) => setCost(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
          </div>

          {mode === 'cost_and_markup' ? (
            <div className="space-y-2 pt-2 border-t border-outline-variant/40">
              <div className="flex justify-between text-xs font-bold">
                <label htmlFor="mk-pct">Markup Percentage (%)</label>
                <span className="font-mono text-primary">{markupPct}%</span>
              </div>
              <SuiteSlider
                ariaLabel="Markup Percentage"
                min={0}
                max={200}
                step={5}
                value={markupPct}
                onChange={setMarkupPct}
                minLabel="0%"
                midLabel="100% (Keystone)"
                maxLabel="200%"
              />
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-outline-variant/40">
              <label className="text-xs font-bold text-on-surface" htmlFor="mk-sell">
                Selling Price ($)
              </label>
              <input
                id="mk-sell"
                type="number"
                min={0}
                step={5}
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="mk-disc">
                Promo Discount (%)
              </label>
              <input
                id="mk-disc"
                type="number"
                min={0}
                max={90}
                value={discountPct}
                onChange={(e) => setDiscountPct(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="mk-tax">
                GST / VAT / Sales Tax (%)
              </label>
              <input
                id="mk-tax"
                type="number"
                min={0}
                max={50}
                value={taxGstVatPct}
                onChange={(e) => setTaxGstVatPct(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">NET SELLING PRICE</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {formatMoney(res.netSellingPricePreTax, '$', 2)}
                </div>
                {taxGstVatPct > 0 && (
                  <span className="text-xs text-on-surface-variant block mt-0.5">
                    Incl. Tax: {formatMoney(res.finalCustomerPriceWithTax, '$', 2)}
                  </span>
                )}
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">EFFECTIVE MARKUP</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {res.effectiveMarkupPct.toFixed(2)}%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">GROSS MARGIN</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {res.grossMarginPct.toFixed(2)}%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">UNIT PROFIT</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatMoney(res.profit, '$', 2)}
                </div>
              </div>
            </div>

            {/* Bulk Multi-Item Pricing Table */}
            <div className="space-y-3 pt-2 border-t border-outline-variant/40">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-on-surface">Bulk Multi-Item SKU Pricing Table</h3>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add SKU Row</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-outline-variant/50 text-on-surface-variant font-sans">
                      <th className="py-2">Item / SKU Name</th>
                      <th className="py-2">Cost ($)</th>
                      <th className="py-2">Markup (%)</th>
                      <th className="py-2 text-right">Selling Price</th>
                      <th className="py-2 text-right">Margin %</th>
                      <th className="py-2 text-right">Profit</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {bulkRows.map((row) => {
                      const p = row.cost * (1 + row.markupPct / 100);
                      const prof = p - row.cost;
                      const mPct = p > 0 ? (prof / p) * 100 : 0;
                      return (
                        <tr key={row.id}>
                          <td className="py-2 pr-2 font-sans">
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) =>
                                setBulkRows((prev) =>
                                  prev.map((r) => (r.id === row.id ? { ...r, name: e.target.value } : r))
                                )
                              }
                              className="w-full px-2 py-1 rounded bg-surface border border-outline-variant/50 text-xs"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <input
                              type="number"
                              value={row.cost}
                              onChange={(e) =>
                                setBulkRows((prev) =>
                                  prev.map((r) =>
                                    r.id === row.id ? { ...r, cost: Math.max(0, Number(e.target.value)) } : r
                                  )
                                )
                              }
                              className="w-20 px-2 py-1 rounded bg-surface border border-outline-variant/50 text-xs"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <input
                              type="number"
                              value={row.markupPct}
                              onChange={(e) =>
                                setBulkRows((prev) =>
                                  prev.map((r) =>
                                    r.id === row.id ? { ...r, markupPct: Number(e.target.value) } : r
                                  )
                                )
                              }
                              className="w-20 px-2 py-1 rounded bg-surface border border-outline-variant/50 text-xs"
                            />
                          </td>
                          <td className="py-2 text-right font-bold text-primary">{formatMoney(p, '$', 2)}</td>
                          <td className="py-2 text-right">{mPct.toFixed(1)}%</td>
                          <td className="py-2 text-right text-emerald-700 dark:text-emerald-400">
                            +{formatMoney(prof, '$', 2)}
                          </td>
                          <td className="py-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(row.id)}
                              className="p-1 text-on-surface-variant hover:text-rose-600 cursor-pointer"
                              aria-label="Remove row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'Margin Calculator',
            description: 'Convert between gross margin and markup with 3 interactive solver modes.',
            href: '/finance/margin-calculator',
          },
          {
            title: 'Break-Even Calculator',
            description: 'Determine how many units you need to sell to cover fixed overhead.',
            href: '/finance/break-even-calculator',
          },
          {
            title: 'Profit Margin Calculator',
            description: 'Full income statement waterfall and Damodaran sector margin benchmarks.',
            href: '/finance/profit-margin-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #47: BREAK-EVEN CALCULATOR
// ============================================================================
export function BreakEvenCalculatorClient() {
  const [fixedCosts, setFixedCosts] = useState<number>(45000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(35);
  const [pricePerUnit, setPricePerUnit] = useState<number>(80);
  const [targetProfit, setTargetProfit] = useState<number>(25000);
  const [expectedActualUnits, setExpectedActualUnits] = useState<number>(1500);

  const res = useMemo(
    () =>
      calculateBreakEven({
        fixedCosts,
        variableCostPerUnit,
        pricePerUnit,
        targetProfit,
        expectedActualUnits,
      }),
    [fixedCosts, variableCostPerUnit, pricePerUnit, targetProfit, expectedActualUnits]
  );

  // SVG Chart Geometry
  const svgW = 640;
  const svgH = 240;
  const padL = 55;
  const padR = 25;
  const padT = 20;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const maxPts = res.chartPoints;
  const maxU = maxPts[maxPts.length - 1]?.units || 1000;
  const maxRev = Math.max(
    maxPts[maxPts.length - 1]?.totalRevenue || 1,
    maxPts[maxPts.length - 1]?.totalCost || 1
  );

  const getX = (u: number) => padL + (u / maxU) * plotW;
  const getY = (val: number) => padT + plotH - Math.min(plotH, Math.max(0, (val / maxRev) * plotH));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <label htmlFor="be-fixed">Total Fixed Costs ($)</label>
              <span className="font-mono text-primary">{formatMoney(fixedCosts)}</span>
            </div>
            <input
              id="be-fixed"
              type="number"
              min={0}
              step={1000}
              value={fixedCosts}
              onChange={(e) => setFixedCosts(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Total Fixed Costs"
              min={1000}
              max={250000}
              step={1000}
              value={fixedCosts}
              onChange={setFixedCosts}
              minLabel="$1k"
              midLabel="$125k"
              maxLabel="$250k"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="be-var">
                Variable Cost / Unit ($)
              </label>
              <input
                id="be-var"
                type="number"
                min={0}
                step={1}
                value={variableCostPerUnit}
                onChange={(e) => setVariableCostPerUnit(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="be-price">
                Selling Price / Unit ($)
              </label>
              <input
                id="be-price"
                type="number"
                min={0}
                step={1}
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="be-target">
                Target Profit ($)
              </label>
              <input
                id="be-target"
                type="number"
                min={0}
                step={1000}
                value={targetProfit}
                onChange={(e) => setTargetProfit(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="be-actual">
                Expected Unit Sales
              </label>
              <input
                id="be-actual"
                type="number"
                min={0}
                step={50}
                value={expectedActualUnits}
                onChange={(e) => setExpectedActualUnits(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">BREAK-EVEN UNITS</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {res.isViable ? Math.ceil(res.bepUnits).toLocaleString() : 'N/A'}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">BREAK-EVEN REVENUE</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {res.isViable ? formatMoney(res.bepRevenue) : 'N/A'}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">CONTRIBUTION MARGIN</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatMoney(res.contributionMargin, '$', 2)}
                </div>
                <span className="text-xs text-on-surface-variant block">
                  {res.contributionMarginRatioPct.toFixed(1)}% CM Ratio
                </span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">MARGIN OF SAFETY</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {res.marginOfSafetyPct.toFixed(1)}%
                </div>
                <span className="text-xs text-on-surface-variant block">
                  Target Units: {res.isViable ? Math.ceil(res.targetUnits).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* SVG Cost Line vs Revenue Line Chart */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/40">
              <h3 className="text-sm font-bold text-on-surface">Total Cost Line vs. Total Revenue Line</h3>
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto bg-surface rounded-xl border border-outline-variant/40 p-2">
                {/* Fixed Cost Horizontal Line */}
                <line
                  x1={padL}
                  y1={getY(res.fixed)}
                  x2={svgW - padR}
                  y2={getY(res.fixed)}
                  stroke="#94a3b8"
                  strokeDasharray="4,4"
                  strokeWidth="1.5"
                />
                {/* Total Cost Line */}
                <line
                  x1={padL}
                  y1={getY(res.fixed)}
                  x2={svgW - padR}
                  y2={getY(res.fixed + maxU * res.varCost)}
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />
                {/* Total Revenue Line */}
                <line
                  x1={padL}
                  y1={getY(0)}
                  x2={svgW - padR}
                  y2={getY(maxU * res.price)}
                  stroke="#2563eb"
                  strokeWidth="3"
                />
                {/* Break-Even Point Circle */}
                {res.isViable && res.bepUnits <= maxU && (
                  <g>
                    <circle
                      cx={getX(res.bepUnits)}
                      cy={getY(res.bepRevenue)}
                      r="6"
                      fill="#047857"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={getX(res.bepUnits)}
                      y={Math.max(15, getY(res.bepRevenue) - 10)}
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-current"
                    >
                      BEP: {Math.ceil(res.bepUnits)} units ({formatMoney(res.bepRevenue)})
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Price ±10% Scenarios Table */}
            <div className="overflow-x-auto pt-2 border-t border-outline-variant/40">
              <h3 className="text-sm font-bold text-on-surface mb-2">Price ±10% Sensitivity Scenarios</h3>
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-outline-variant/50 text-on-surface-variant font-sans">
                    <th className="py-2">Scenario</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Unit CM</th>
                    <th className="py-2 text-right">Break-Even Units</th>
                    <th className="py-2 text-right">Break-Even Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {res.scenarios.map((s) => (
                    <tr key={s.label}>
                      <td className="py-2 font-sans font-semibold text-on-surface">{s.label}</td>
                      <td className="py-2 text-right">{formatMoney(s.price, '$', 2)}</td>
                      <td className="py-2 text-right">{formatMoney(s.cm, '$', 2)}</td>
                      <td className="py-2 text-right font-bold text-primary">
                        {Number.isFinite(s.bepUnits) ? Math.ceil(s.bepUnits).toLocaleString() : 'Unviable'}
                      </td>
                      <td className="py-2 text-right">
                        {Number.isFinite(s.bepRevenue) ? formatMoney(s.bepRevenue) : 'Unviable'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'Profit Margin Calculator',
            description: 'Analyze Gross, Operating, EBITDA, and Net Profit margins with industry benchmarks.',
            href: '/finance/profit-margin-calculator',
          },
          {
            title: 'Markup Calculator',
            description: 'Set unit prices and bulk SKU markups from cost.',
            href: '/finance/markup-calculator',
          },
          {
            title: 'Investment Growth & ROI Calculator',
            description: 'Evaluate total return on capital invested in your business.',
            href: '/finance/investment-growth-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #48: PROFIT MARGIN CALCULATOR (WATERFALL + DAMODARAN SECTOR BENCHMARKS)
// ============================================================================
export function ProfitMarginCalculatorClient() {
  const [revenue, setRevenue] = useState<number>(1000000);
  const [cogs, setCogs] = useState<number>(420000);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(330000);
  const [depreciationAndAmortization, setDepreciationAndAmortization] = useState<number>(40000);
  const [interestExpense, setInterestExpense] = useState<number>(25000);
  const [taxes, setTaxes] = useState<number>(55000);
  const [sectorId, setSectorId] = useState<string>('software-sys');

  const res = useMemo(
    () =>
      calculateProfitMargin({
        revenue,
        cogs,
        operatingExpenses,
        depreciationAndAmortization,
        interestExpense,
        taxes,
        sectorId,
      }),
    [revenue, cogs, operatingExpenses, depreciationAndAmortization, interestExpense, taxes, sectorId]
  );

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={res.benchmarkSource} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <label htmlFor="pm-rev">Total Revenue ($)</label>
              <span className="font-mono text-primary">{formatMoney(revenue)}</span>
            </div>
            <input
              id="pm-rev"
              type="number"
              min={0}
              step={10000}
              value={revenue}
              onChange={(e) => setRevenue(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="pm-cogs">
                Cost of Goods Sold (COGS)
              </label>
              <input
                id="pm-cogs"
                type="number"
                min={0}
                step={5000}
                value={cogs}
                onChange={(e) => setCogs(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="pm-opex">
                Operating Expenses (OPEX)
              </label>
              <input
                id="pm-opex"
                type="number"
                min={0}
                step={5000}
                value={operatingExpenses}
                onChange={(e) => setOperatingExpenses(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="pm-da">
                D&amp;A (for EBITDA)
              </label>
              <input
                id="pm-da"
                type="number"
                min={0}
                step={2500}
                value={depreciationAndAmortization}
                onChange={(e) => setDepreciationAndAmortization(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="pm-int">
                Interest Expense
              </label>
              <input
                id="pm-int"
                type="number"
                min={0}
                step={1000}
                value={interestExpense}
                onChange={(e) => setInterestExpense(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-outline-variant/40">
            <label className="text-xs font-bold text-on-surface" htmlFor="pm-tax">
              Corporate Income Taxes ($)
            </label>
            <input
              id="pm-tax"
              type="number"
              min={0}
              step={1000}
              value={taxes}
              onChange={(e) => setTaxes(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
            />
          </div>

          <div className="space-y-1.5 pt-2 border-t border-outline-variant/40">
            <label className="text-xs font-bold text-on-surface" htmlFor="pm-sector">
              Damodaran (NYU Stern Jan 2025) Sector Benchmark
            </label>
            <select
              id="pm-sector"
              value={sectorId}
              onChange={(e) => setSectorId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
            >
              {DAMODARAN_SECTOR_MARGINS_2025.sectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.sector} ({s.sampleFirms} US firms)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            {/* Three Core Margins + EBITDA */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">GROSS MARGIN</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {res.grossMarginPct.toFixed(1)}%
                </div>
                <span className="text-xs text-on-surface-variant block">
                  {formatMoney(res.grossProfit)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">OPERATING MARGIN</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {res.operatingMarginPct.toFixed(1)}%
                </div>
                <span className="text-xs text-on-surface-variant block">
                  EBIT: {formatMoney(res.operatingProfit)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">EBITDA MARGIN</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {res.ebitdaMarginPct.toFixed(1)}%
                </div>
                <span className="text-xs text-on-surface-variant block">
                  {formatMoney(res.ebitda)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">NET PROFIT MARGIN</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {res.netMarginPct.toFixed(1)}%
                </div>
                <span className="text-xs text-on-surface-variant block">
                  Net: {formatMoney(res.netProfit)}
                </span>
              </div>
            </div>

            {/* Income Statement Waterfall Chart */}
            <div className="space-y-2.5 pt-2 border-t border-outline-variant/40">
              <h3 className="text-sm font-bold text-on-surface">Revenue-to-Net-Profit Waterfall</h3>
              {res.waterfallSteps.map((step) => {
                const barW = Math.min(100, Math.max(2, Math.abs(step.pctOfRevenue)));
                const barColor =
                  step.type === 'revenue'
                    ? 'bg-blue-600'
                    : step.type === 'cost'
                    ? 'bg-rose-500'
                    : step.type === 'subtotal'
                    ? 'bg-teal-600'
                    : 'bg-emerald-600';
                return (
                  <div key={step.label} className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="font-sans font-semibold text-on-surface">{step.label}</span>
                      <span>
                        {formatMoney(step.amount)} ({step.pctOfRevenue.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden">
                      <div style={{ width: `${barW}%` }} className={`h-full rounded-full ${barColor}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cited Damodaran NYU Stern Benchmark Table */}
            <div className="p-4 rounded-xl bg-surface border border-outline-variant/50 space-y-2 text-xs">
              <h4 className="font-bold text-on-surface">
                Cited Sector Comparison: {res.benchmark.sector} (Damodaran NYU Stern, Jan 2025, n={res.benchmark.sampleFirms})
              </h4>
              <div className="grid grid-cols-3 gap-3 font-mono pt-1">
                <div>
                  <span className="font-sans text-on-surface-variant block">Sector Gross Margin</span>
                  <span className="font-bold text-on-surface">{res.benchmark.grossMarginPct.toFixed(1)}%</span>
                  <span className="block text-[11px] text-primary">
                    Yours: {res.grossMarginPct.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="font-sans text-on-surface-variant block">Sector Operating Margin</span>
                  <span className="font-bold text-on-surface">{res.benchmark.operatingMarginPct.toFixed(1)}%</span>
                  <span className="block text-[11px] text-primary">
                    Yours: {res.operatingMarginPct.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="font-sans text-on-surface-variant block">Sector Net Margin</span>
                  <span className="font-bold text-on-surface">{res.benchmark.netMarginPct.toFixed(1)}%</span>
                  <span className="block text-[11px] text-primary">
                    Yours: {res.netMarginPct.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'Gross Margin Calculator',
            description: 'Compute unit margin, profit, and required price from cost.',
            href: '/finance/margin-calculator',
          },
          {
            title: 'Markup Calculator',
            description: 'Convert markup to margin and price multi-item SKU catalogs.',
            href: '/finance/markup-calculator',
          },
          {
            title: 'Break-Even Calculator',
            description: 'Find break-even unit volume and revenue crossover.',
            href: '/finance/break-even-calculator',
          },
        ]}
      />
    </div>
  );
}
