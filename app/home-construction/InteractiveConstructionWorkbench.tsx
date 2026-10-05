'use client';

import React, { useState, useMemo } from 'react';
import {
  Hammer,
  Square,
  Brush,
  Shield,
  Layers,
  Grid,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  DollarSign,
} from 'lucide-react';

export type ConstructionTrade =
  | 'concrete'
  | 'flooring'
  | 'paint'
  | 'roofing'
  | 'drywall'
  | 'lumber';

export default function InteractiveConstructionWorkbench() {
  const [activeTrade, setActiveTrade] = useState<ConstructionTrade>('concrete');
  const [wasteFactor, setWasteFactor] = useState<number>(10);
  const [unitCost, setUnitCost] = useState<string>('125'); // default ready-mix cost per yd3
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Trade 1: Concrete State
  const [slabLength, setSlabLength] = useState<string>('12');
  const [slabWidth, setSlabWidth] = useState<string>('12');
  const [slabThickness, setSlabThickness] = useState<string>('4');

  // Trade 2: Flooring State
  const [floorLength, setFloorLength] = useState<string>('15');
  const [floorWidth, setFloorWidth] = useState<string>('12');
  const [boxCoverage, setBoxCoverage] = useState<string>('22');

  // Trade 3: Wall Paint State
  const [roomLength, setRoomLength] = useState<string>('14');
  const [roomWidth, setRoomWidth] = useState<string>('12');
  const [ceilingHeight, setCeilingHeight] = useState<string>('9');
  const [doorsCount, setDoorsCount] = useState<string>('2');
  const [windowsCount, setWindowsCount] = useState<string>('2');
  const [paintCoats, setPaintCoats] = useState<string>('2');

  // Trade 4: Roofing State
  const [roofFootprintL, setRoofFootprintL] = useState<string>('40');
  const [roofFootprintW, setRoofFootprintW] = useState<string>('30');
  const [roofPitchSlope, setRoofPitchSlope] = useState<number>(6); // e.g. 6/12 pitch
  const [roofOverhang, setRoofOverhang] = useState<string>('1.5');

  // Trade 5: Drywall State
  const [drywallRoomL, setDrywallRoomL] = useState<string>('16');
  const [drywallRoomW, setDrywallRoomW] = useState<string>('12');
  const [drywallHeight, setDrywallHeight] = useState<string>('8');
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(true);

  // Trade 6: Lumber Board Feet State
  const [lumberThickness, setLumberThickness] = useState<string>('2');
  const [lumberWidth, setLumberWidth] = useState<string>('6');
  const [lumberLengthFt, setLumberLengthFt] = useState<string>('8');
  const [lumberQty, setLumberQty] = useState<string>('20');

  // Switch Trade with preset costs
  const handleSelectTrade = (trade: ConstructionTrade) => {
    setActiveTrade(trade);
    if (trade === 'concrete') setUnitCost('130'); // $ per cu yd
    else if (trade === 'flooring') setUnitCost('3.50'); // $ per sq ft
    else if (trade === 'paint') setUnitCost('45'); // $ per gallon
    else if (trade === 'roofing') setUnitCost('110'); // $ per square
    else if (trade === 'drywall') setUnitCost('15'); // $ per 4x8 sheet
    else if (trade === 'lumber') setUnitCost('4.20'); // $ per board foot
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const wasteMultiplier = 1 + wasteFactor / 100;
  const costNum = parseFloat(unitCost) || 0;

  // 1. Concrete Computations
  const concreteCalcs = useMemo(() => {
    const l = parseFloat(slabLength) || 0;
    const w = parseFloat(slabWidth) || 0;
    const t = parseFloat(slabThickness) || 0;
    const areaSqFt = l * w;
    const rawCuFt = (l * w * t) / 12;
    const rawCuYd = rawCuFt / 27;
    const withWasteCuYd = rawCuYd * wasteMultiplier;
    const bags60lb = Math.ceil(withWasteCuYd * 60);
    const bags80lb = Math.ceil(withWasteCuYd * 45);
    const estCost = withWasteCuYd * costNum;
    return {
      areaSqFt: areaSqFt.toFixed(1),
      cubicYards: withWasteCuYd.toFixed(2),
      rawCubicYards: rawCuYd.toFixed(2),
      bags60lb,
      bags80lb,
      estCost: estCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    };
  }, [slabLength, slabWidth, slabThickness, wasteMultiplier, costNum]);

  // 2. Flooring Computations
  const flooringCalcs = useMemo(() => {
    const l = parseFloat(floorLength) || 0;
    const w = parseFloat(floorWidth) || 0;
    const boxSqFt = parseFloat(boxCoverage) || 20;
    const netArea = l * w;
    const grossArea = netArea * wasteMultiplier;
    const boxesNeeded = Math.ceil(grossArea / (boxSqFt > 0 ? boxSqFt : 20));
    const totalPurchasedSqFt = boxesNeeded * boxSqFt;
    const estCost = totalPurchasedSqFt * costNum;
    return {
      netArea: netArea.toFixed(1),
      grossArea: grossArea.toFixed(1),
      boxesNeeded,
      totalPurchasedSqFt: totalPurchasedSqFt.toFixed(1),
      estCost: estCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    };
  }, [floorLength, floorWidth, boxCoverage, wasteMultiplier, costNum]);

  // 3. Paint Computations
  const paintCalcs = useMemo(() => {
    const l = parseFloat(roomLength) || 0;
    const w = parseFloat(roomWidth) || 0;
    const h = parseFloat(ceilingHeight) || 0;
    const d = parseFloat(doorsCount) || 0;
    const win = parseFloat(windowsCount) || 0;
    const coats = parseFloat(paintCoats) || 1;

    const perimeter = 2 * (l + w);
    const grossWallArea = perimeter * h;
    const deductions = d * 21 + win * 15; // 21 sq ft per door, 15 per window
    const netWallArea = Math.max(0, grossWallArea - deductions);
    const ceilingArea = l * w;
    const totalSurfaceArea = (netWallArea + ceilingArea) * coats;
    const totalWithWaste = totalSurfaceArea * wasteMultiplier;
    const gallonsNeeded = Math.ceil(totalWithWaste / 350);
    const estCost = gallonsNeeded * costNum;
    return {
      netWallArea: netWallArea.toFixed(0),
      ceilingArea: ceilingArea.toFixed(0),
      totalSurfaceArea: totalSurfaceArea.toFixed(0),
      gallonsNeeded,
      estCost: estCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    };
  }, [roomLength, roomWidth, ceilingHeight, doorsCount, windowsCount, paintCoats, wasteMultiplier, costNum]);

  // 4. Roofing Computations
  const roofingCalcs = useMemo(() => {
    const l = parseFloat(roofFootprintL) || 0;
    const w = parseFloat(roofFootprintW) || 0;
    const oh = parseFloat(roofOverhang) || 0;
    const pitch = roofPitchSlope;

    // Pitch multiplier: sqrt(12^2 + pitch^2) / 12
    const pitchMultiplier = Math.sqrt(144 + pitch * pitch) / 12;
    const totalL = l + 2 * oh;
    const totalW = w + 2 * oh;
    const flatArea = totalL * totalW;
    const trueRoofArea = flatArea * pitchMultiplier;
    const areaWithWaste = trueRoofArea * wasteMultiplier;
    const squares = areaWithWaste / 100;
    const bundles = Math.ceil(squares * 3);
    const estCost = squares * costNum;
    return {
      flatArea: flatArea.toFixed(0),
      pitchMultiplier: pitchMultiplier.toFixed(3),
      trueRoofArea: trueRoofArea.toFixed(0),
      squares: squares.toFixed(2),
      bundles,
      estCost: estCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    };
  }, [roofFootprintL, roofFootprintW, roofOverhang, roofPitchSlope, wasteMultiplier, costNum]);

  // 5. Drywall Computations
  const drywallCalcs = useMemo(() => {
    const l = parseFloat(drywallRoomL) || 0;
    const w = parseFloat(drywallRoomW) || 0;
    const h = parseFloat(drywallHeight) || 0;
    const perimeter = 2 * (l + w);
    const wallArea = perimeter * h;
    const ceilingArea = includeCeiling ? l * w : 0;
    const totalArea = (wallArea + ceilingArea) * wasteMultiplier;

    const sheets4x8 = Math.ceil(totalArea / 32);
    const sheets4x12 = Math.ceil(totalArea / 48);
    const screwsLbs = Math.ceil(sheets4x8 / 4);
    const mudBuckets = Math.ceil(totalArea / 500);
    const estCost = sheets4x8 * costNum;
    return {
      wallArea: wallArea.toFixed(0),
      totalArea: totalArea.toFixed(0),
      sheets4x8,
      sheets4x12,
      screwsLbs,
      mudBuckets,
      estCost: estCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    };
  }, [drywallRoomL, drywallRoomW, drywallHeight, includeCeiling, wasteMultiplier, costNum]);

  // 6. Lumber Board Feet Computations
  const lumberCalcs = useMemo(() => {
    const t = parseFloat(lumberThickness) || 0;
    const w = parseFloat(lumberWidth) || 0;
    const lFt = parseFloat(lumberLengthFt) || 0;
    const qty = parseFloat(lumberQty) || 0;

    const singleBF = (t * w * (lFt * 12)) / 144;
    const totalBF = singleBF * qty * wasteMultiplier;
    const totalLinFt = lFt * qty;
    const estCost = totalBF * costNum;
    return {
      singleBF: singleBF.toFixed(2),
      totalBF: totalBF.toFixed(2),
      totalLinFt: totalLinFt.toFixed(0),
      estCost: estCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    };
  }, [lumberThickness, lumberWidth, lumberLengthFt, lumberQty, wasteMultiplier, costNum]);

  return (
    <div className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden transition-colors">
      {/* 1. Trade Switcher Tab Ribbon */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-600/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              <Hammer className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              Interactive Multi-Trade Material & Cost Estimator
            </h2>
          </div>
          <div className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded border border-blue-200 dark:border-blue-800/40 shrink-0 self-start sm:self-auto">
            IRC & NRMCA Standards
          </div>
        </div>

        {/* Trade Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'concrete', label: 'Concrete Slab', icon: Hammer },
            { id: 'flooring', label: 'Flooring Box', icon: Square },
            { id: 'paint', label: 'Wall Paint', icon: Brush },
            { id: 'roofing', label: 'Roofing Squares', icon: Shield },
            { id: 'drywall', label: 'Drywall Sheets', icon: Layers },
            { id: 'lumber', label: 'Lumber Board Feet', icon: Grid },
          ].map((t) => {
            const IconComp = t.icon;
            const isSelected = activeTrade === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTrade(t.id as ConstructionTrade)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 dark:bg-amber-500 text-white dark:text-slate-950 font-bold shadow-md'
                    : 'bg-white dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Workbench Calculation Stage */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Controls: Waste Factor Slider + Unit Cost Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-xs">
          {/* Waste Factor Controller */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Cut-Waste & Spillage Buffer:</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400 text-sm">
                +{wasteFactor}% Overage
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={wasteFactor}
              onChange={(e) => setWasteFactor(parseInt(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Unit Cost Input */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-1">
            <label htmlFor="unit-cost-input" className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Unit Material Cost Estimate:</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                id="unit-cost-input"
                type="number"
                step="any"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                placeholder="Unit cost..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* TRADE 1: CONCRETE SLAB */}
        {activeTrade === 'concrete' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="concrete-length" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Slab Length (Feet)
                </label>
                <input
                  id="concrete-length"
                  type="number"
                  value={slabLength}
                  onChange={(e) => setSlabLength(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold"
                />
              </div>
              <div>
                <label htmlFor="concrete-width" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Slab Width (Feet)
                </label>
                <input
                  id="concrete-width"
                  type="number"
                  value={slabWidth}
                  onChange={(e) => setSlabWidth(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold"
                />
              </div>
              <div>
                <label htmlFor="concrete-thickness" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thickness (Inches)
                </label>
                <input
                  id="concrete-thickness"
                  type="number"
                  value={slabThickness}
                  onChange={(e) => setSlabThickness(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Ready-Mix Volume:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400">
                  {concreteCalcs.cubicYards} yd³
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Net: {concreteCalcs.rawCubicYards} yd³</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">80 lb Pre-Mix Bags:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                  {concreteCalcs.bags80lb} Bags
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">or {concreteCalcs.bags60lb} of 60lb bags</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Surface Footprint:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-blue-600 dark:text-blue-400">
                  {concreteCalcs.areaSqFt} sq ft
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">at {slabThickness}&quot; nominal depth</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Estimated Material Cost:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                  {concreteCalcs.estCost}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">at ${unitCost}/yd³</span>
              </div>
            </div>
          </div>
        )}

        {/* TRADE 2: FLOORING */}
        {activeTrade === 'flooring' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="floor-length" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Room Length (Feet)
                </label>
                <input
                  id="floor-length"
                  type="number"
                  value={floorLength}
                  onChange={(e) => setFloorLength(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold"
                />
              </div>
              <div>
                <label htmlFor="floor-width" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Room Width (Feet)
                </label>
                <input
                  id="floor-width"
                  type="number"
                  value={floorWidth}
                  onChange={(e) => setFloorWidth(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold"
                />
              </div>
              <div>
                <label htmlFor="box-coverage" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sq Ft per Box / Carton
                </label>
                <input
                  id="box-coverage"
                  type="number"
                  value={boxCoverage}
                  onChange={(e) => setBoxCoverage(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Boxes to Order:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400">
                  {flooringCalcs.boxesNeeded} Cartons
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{flooringCalcs.totalPurchasedSqFt} sq ft total</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Net Floor Area:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                  {flooringCalcs.netArea} sq ft
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Raw room footprint</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Gross Area (+{wasteFactor}%):</span>
                <div className="text-xl font-mono tabular-nums font-bold text-blue-600 dark:text-blue-400">
                  {flooringCalcs.grossArea} sq ft
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">With cut-waste allowance</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Estimated Total Cost:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                  {flooringCalcs.estCost}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">at ${unitCost}/sq ft</span>
              </div>
            </div>
          </div>
        )}

        {/* TRADE 3: PAINT */}
        {activeTrade === 'paint' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label htmlFor="room-length" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Length (ft)</label>
                <input id="room-length" type="number" value={roomLength} onChange={(e) => setRoomLength(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="room-width" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Width (ft)</label>
                <input id="room-width" type="number" value={roomWidth} onChange={(e) => setRoomWidth(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="ceiling-height" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Height (ft)</label>
                <input id="ceiling-height" type="number" value={ceilingHeight} onChange={(e) => setCeilingHeight(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="doors-count" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Doors</label>
                <input id="doors-count" type="number" value={doorsCount} onChange={(e) => setDoorsCount(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="windows-count" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Windows</label>
                <input id="windows-count" type="number" value={windowsCount} onChange={(e) => setWindowsCount(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="paint-coats" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Coats</label>
                <input id="paint-coats" type="number" min="1" max="4" value={paintCoats} onChange={(e) => setPaintCoats(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Paint Required:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400">
                  {paintCalcs.gallonsNeeded} Gallons
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">For {paintCoats} full coats</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Net Wall Surface:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                  {paintCalcs.netWallArea} sq ft
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">After opening deductions</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Ceiling Area:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-blue-600 dark:text-blue-400">
                  {paintCalcs.ceilingArea} sq ft
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Standard flat surface</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Estimated Paint Cost:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                  {paintCalcs.estCost}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">at ${unitCost}/gal</span>
              </div>
            </div>
          </div>
        )}

        {/* TRADE 4: ROOFING */}
        {activeTrade === 'roofing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label htmlFor="roof-footprint-length" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Footprint Length (ft)</label>
                <input id="roof-footprint-length" type="number" value={roofFootprintL} onChange={(e) => setRoofFootprintL(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="roof-footprint-width" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Footprint Width (ft)</label>
                <input id="roof-footprint-width" type="number" value={roofFootprintW} onChange={(e) => setRoofFootprintW(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="roof-pitch-slope" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Roof Pitch (Rise/12)</label>
                <select id="roof-pitch-slope" value={roofPitchSlope} onChange={(e) => setRoofPitchSlope(parseInt(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-bold">
                  <option value="3">3/12 (Low Slope - 1.031x)</option>
                  <option value="4">4/12 (Standard - 1.054x)</option>
                  <option value="5">5/12 (Moderate - 1.083x)</option>
                  <option value="6">6/12 (Common - 1.118x)</option>
                  <option value="8">8/12 (Steep - 1.202x)</option>
                  <option value="10">10/12 (Very Steep - 1.302x)</option>
                  <option value="12">12/12 (45° Pitch - 1.414x)</option>
                </select>
              </div>
              <div>
                <label htmlFor="roof-overhang" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Eaves Overhang (ft)</label>
                <input id="roof-overhang" type="number" step="0.5" value={roofOverhang} onChange={(e) => setRoofOverhang(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Roofing Squares:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400">
                  {roofingCalcs.squares} Sq
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">1 Square = 100 sq ft</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Shingle Bundles (3/Sq):</span>
                <div className="text-xl font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                  {roofingCalcs.bundles} Bundles
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Plus starter strips</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">True 3D Roof Area:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-blue-600 dark:text-blue-400">
                  {roofingCalcs.trueRoofArea} sq ft
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Multiplier: {roofingCalcs.pitchMultiplier}x</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Estimated Shingle Cost:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                  {roofingCalcs.estCost}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">at ${unitCost}/square</span>
              </div>
            </div>
          </div>
        )}

        {/* TRADE 5: DRYWALL */}
        {activeTrade === 'drywall' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label htmlFor="drywall-room-length" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Room Length (ft)</label>
                <input id="drywall-room-length" type="number" value={drywallRoomL} onChange={(e) => setDrywallRoomL(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="drywall-room-width" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Room Width (ft)</label>
                <input id="drywall-room-width" type="number" value={drywallRoomW} onChange={(e) => setDrywallRoomW(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="drywall-height" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ceiling Height (ft)</label>
                <input id="drywall-height" type="number" value={drywallHeight} onChange={(e) => setDrywallHeight(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div className="flex flex-col justify-center pt-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input type="checkbox" checked={includeCeiling} onChange={(e) => setIncludeCeiling(e.target.checked)} className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-amber-600 w-4 h-4 cursor-pointer" />
                  <span>Include Ceiling Drywall</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">4x8 Sheet Count:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400">
                  {drywallCalcs.sheets4x8} Sheets
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">or {drywallCalcs.sheets4x12} 4x12 sheets</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Screws & Mud:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                  {drywallCalcs.mudBuckets} Buckets
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Plus ~{drywallCalcs.screwsLbs} lbs screws</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Gross Surface Area:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-blue-600 dark:text-blue-400">
                  {drywallCalcs.totalArea} sq ft
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Walls + Ceiling</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Estimated Drywall Cost:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                  {drywallCalcs.estCost}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">at ${unitCost}/sheet</span>
              </div>
            </div>
          </div>
        )}

        {/* TRADE 6: LUMBER BOARD FEET */}
        {activeTrade === 'lumber' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label htmlFor="lumber-thickness" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Thickness (in)</label>
                <input id="lumber-thickness" type="number" value={lumberThickness} onChange={(e) => setLumberThickness(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="lumber-width" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Width (in)</label>
                <input id="lumber-width" type="number" value={lumberWidth} onChange={(e) => setLumberWidth(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="lumber-length" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Length (ft)</label>
                <input id="lumber-length" type="number" value={lumberLengthFt} onChange={(e) => setLumberLengthFt(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
              <div>
                <label htmlFor="lumber-qty" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Quantity (Pieces)</label>
                <input id="lumber-qty" type="number" value={lumberQty} onChange={(e) => setLumberQty(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Total Board Footage:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400">
                  {lumberCalcs.totalBF} BF
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{lumberCalcs.singleBF} BF per piece</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Total Linear Footage:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                  {lumberCalcs.totalLinFt} Linear Ft
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{lumberQty} boards at {lumberLengthFt}ft</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Standard Formula:</span>
                <div className="text-sm font-mono text-blue-600 dark:text-blue-400 font-semibold pt-1">
                  (T&quot; × W&quot; × L&quot;) / 144
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Industry BF standard</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Estimated Lumber Cost:</span>
                <div className="text-xl font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                  {lumberCalcs.estCost}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">at ${unitCost}/BF</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
